use std::sync::Arc;
use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use axum::{
    async_trait,
    extract::FromRequestParts,
    http::{header, request::Parts},
};
use chrono::{Duration, Utc};
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{
    config::AppConfig,
    domain::RoleType,
    errors::AppError,
    infrastructure::REQUEST_ID_HEADER,
};

/// Password hashing utilities using Argon2id
pub struct PasswordService;

impl PasswordService {
    pub fn hash(password: &str) -> Result<String, AppError> {
        let salt = SaltString::generate(&mut OsRng);
        let argon2 = Argon2::default();
        argon2
            .hash_password(password.as_bytes(), &salt)
            .map(|hash| hash.to_string())
            .map_err(|e| AppError::Internal(format!("Failed to hash password: {}", e)))
    }

    pub fn verify(password: &str, hash: &str) -> Result<bool, AppError> {
        let parsed_hash = PasswordHash::new(hash)
            .map_err(|e| AppError::Internal(format!("Invalid password hash format: {}", e)))?;
        Ok(Argon2::default()
            .verify_password(password.as_bytes(), &parsed_hash)
            .is_ok())
    }
}

/// JWT Claims payload
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Claims {
    pub sub: String, // user_id as string
    pub email: String,
    pub roles: Vec<String>,
    pub org_id: Option<String>,
    pub org_name: Option<String>,
    pub exp: i64,
    pub iat: i64,
}

pub struct TokenService;

impl TokenService {
    pub fn create_token(
        user_id: Uuid,
        email: &str,
        roles: &[String],
        org: Option<(&Uuid, &str)>,
        config: &AppConfig,
    ) -> Result<String, AppError> {
        let now = Utc::now();
        let exp = now + Duration::hours(config.jwt_expiration_hours);

        let claims = Claims {
            sub: user_id.to_string(),
            email: email.to_string(),
            roles: roles.to_vec(),
            org_id: org.map(|(id, _)| id.to_string()),
            org_name: org.map(|(_, name)| name.to_string()),
            iat: now.timestamp(),
            exp: exp.timestamp(),
        };

        encode(
            &Header::default(),
            &claims,
            &EncodingKey::from_secret(config.jwt_secret.as_bytes()),
        )
        .map_err(|e| AppError::Internal(format!("Failed to generate authentication token: {}", e)))
    }

    pub fn verify_token(token: &str, secret: &str) -> Result<Claims, AppError> {
        let validation = Validation::default();
        let token_data = decode::<Claims>(
            token,
            &DecodingKey::from_secret(secret.as_bytes()),
            &validation,
        )
        .map_err(|e| match e.kind() {
            jsonwebtoken::errors::ErrorKind::ExpiredSignature => {
                AppError::Unauthorized("Session expired. Please log in again.".to_string())
            }
            _ => AppError::Unauthorized("Invalid authentication token.".to_string()),
        })?;

        Ok(token_data.claims)
    }
}

/// Extractor representing an authenticated user in Axum request handlers
#[derive(Debug, Clone)]
pub struct AuthenticatedUser {
    pub id: Uuid,
    pub email: String,
    pub roles: Vec<String>,
    pub organization_id: Option<Uuid>,
    pub organization_name: Option<String>,
    pub request_id: String,
}

impl AuthenticatedUser {
    /// Multi-User Isolation check: Ensures user can only access their own resource
    /// unless they hold an administrative or verification role.
    pub fn can_access_user_data(&self, target_user_id: Uuid) -> bool {
        if self.id == target_user_id {
            return true;
        }

        // Higher-level roles can view other profiles
        self.roles.iter().any(|r| {
            RoleType::from_str_opt(r)
                .map(|role| role.can_view_all_profiles())
                .unwrap_or(false)
        })
    }

    pub fn has_role(&self, role: RoleType) -> bool {
        self.roles.iter().any(|r| r == role.as_str())
    }

    pub fn can_view_audit_logs(&self) -> bool {
        self.roles.iter().any(|r| {
            RoleType::from_str_opt(r)
                .map(|role| role.can_view_audit_logs())
                .unwrap_or(false)
        })
    }
}

#[async_trait]
impl<S> FromRequestParts<S> for AuthenticatedUser
where
    S: Send + Sync,
{
    type Rejection = AppError;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        let request_id = parts
            .headers
            .get(REQUEST_ID_HEADER)
            .and_then(|h| h.to_str().ok())
            .unwrap_or("unknown")
            .to_string();

        let auth_header = parts
            .headers
            .get(header::AUTHORIZATION)
            .and_then(|h| h.to_str().ok())
            .ok_or_else(|| {
                AppError::Unauthorized("Missing Authorization header".to_string())
            })?;

        if !auth_header.starts_with("Bearer ") {
            return Err(AppError::Unauthorized(
                "Invalid Authorization format. Expected Bearer token".to_string(),
            ));
        }

        let token = &auth_header[7..];

        // Retrieve config from request extensions
        let config = parts
            .extensions
            .get::<Arc<AppConfig>>()
            .ok_or_else(|| AppError::Internal("AppConfig not found in extensions".to_string()))?;

        let claims = TokenService::verify_token(token, &config.jwt_secret)?;

        let user_id = Uuid::parse_str(&claims.sub)
            .map_err(|_| AppError::Unauthorized("Invalid user ID in token".to_string()))?;

        let org_id = claims
            .org_id
            .as_deref()
            .and_then(|s| Uuid::parse_str(s).ok());

        Ok(AuthenticatedUser {
            id: user_id,
            email: claims.email,
            roles: claims.roles,
            organization_id: org_id,
            organization_name: claims.org_name,
            request_id,
        })
    }
}
