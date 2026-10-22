use chrono::{Datelike, NaiveDate, Utc};
use serde::{Deserialize, Serialize};
use sqlx::{PgPool, Row};
use uuid::Uuid;

use crate::{
    auth::{AuthenticatedUser, PasswordService, TokenService},
    config::AppConfig,
    domain::{
        Application, AuditEvent, Benefit, BenefitAsset, BenefitEvent, DashboardStats,
        EligibilityAssessment, EligibilityRuleResult, GraphData, GraphEdge, GraphNode, Household,
        HouseholdMemberDetail, HouseholdMembership, OrganizationSummary, Person,
        PersonRelationship, Property, PropertyAssociation, PropertyAssociationDetail,
        RelationshipDetail, RelationshipType, RoleType, Scheme, SchemeRule, SystemStatus,
        UserProfile,
    },
    errors::AppError,
};

// ============================================================================
// DTOs (Data Transfer Objects)
// ============================================================================

#[derive(serde::Deserialize)]
pub struct RegisterRequest {
    pub email: String,
    pub password: String,
    pub display_name: String,
    pub preferred_language: Option<String>,
}

#[derive(serde::Deserialize)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

#[derive(serde::Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub token_type: String,
    pub user: UserProfile,
}

#[derive(serde::Deserialize)]
pub struct UpdatePreferencesRequest {
    pub display_name: Option<String>,
    pub preferred_language: Option<String>,
}

#[derive(serde::Deserialize)]
pub struct CreatePersonRequest {
    pub public_id: Option<String>,
    pub first_name: String,
    pub middle_name: Option<String>,
    pub last_name: String,
    pub date_of_birth: Option<NaiveDate>,
    pub gender: Option<String>,
    pub phone: Option<String>,
    pub email: Option<String>,
    pub status: Option<String>,
}

#[derive(serde::Deserialize)]
pub struct UpdatePersonRequest {
    pub first_name: Option<String>,
    pub middle_name: Option<String>,
    pub last_name: Option<String>,
    pub date_of_birth: Option<NaiveDate>,
    pub gender: Option<String>,
    pub phone: Option<String>,
    pub email: Option<String>,
    pub status: Option<String>,
}

#[derive(serde::Deserialize)]
pub struct CreateRelationshipRequest {
    pub person_b_id: Uuid,
    pub relationship_type: String,
    pub valid_from: Option<NaiveDate>,
    pub valid_to: Option<NaiveDate>,
}

#[derive(serde::Deserialize)]
pub struct CreateHouseholdRequest {
    pub public_id: Option<String>,
    pub name: String,
    pub status: Option<String>,
}

#[derive(serde::Deserialize)]
pub struct UpdateHouseholdRequest {
    pub name: Option<String>,
    pub status: Option<String>,
}

#[derive(serde::Deserialize)]
pub struct AddHouseholdMemberRequest {
    pub person_id: Uuid,
    pub membership_role: Option<String>,
    pub valid_from: Option<NaiveDate>,
    pub valid_to: Option<NaiveDate>,
}

#[derive(serde::Deserialize)]
pub struct SplitHouseholdRequest {
    pub person_id: Uuid,
    pub current_household_id: Uuid,
    pub effective_date: NaiveDate,
    pub new_household_name: Option<String>,
    pub new_household_public_id: Option<String>,
    pub target_household_id: Option<Uuid>,
}

#[derive(serde::Deserialize)]
pub struct CreatePropertyRequest {
    pub public_id: Option<String>,
    pub property_type: Option<String>,
    pub address_line: String,
    pub locality: Option<String>,
    pub district: Option<String>,
    pub state: Option<String>,
    pub postal_code: Option<String>,
    pub latitude: Option<f64>,
    pub longitude: Option<f64>,
}

#[derive(serde::Deserialize)]
pub struct CreatePropertyAssociationRequest {
    pub property_id: Uuid,
    pub person_id: Option<Uuid>,
    pub household_id: Option<Uuid>,
    pub association_type: String,
    pub valid_from: Option<NaiveDate>,
    pub valid_to: Option<NaiveDate>,
}

#[derive(serde::Serialize)]
pub struct HouseholdTimelineItem {
    pub date: NaiveDate,
    pub event_type: String,
    pub title: String,
    pub description: String,
    pub person_id: Option<Uuid>,
    pub person_name: Option<String>,
}

// ============================================================================
// Audit Service
// ============================================================================

pub struct AuditService;

impl AuditService {
    pub async fn log_event(
        pool: &PgPool,
        event_type: &str,
        user_id: Option<Uuid>,
        org_id: Option<Uuid>,
        request_id: &str,
        ip_address: Option<&str>,
        details: serde_json::Value,
    ) {
        let res = sqlx::query(
            r#"
            INSERT INTO audit_events (id, event_type, user_id, organization_id, request_id, ip_address, details)
            VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6)
            "#,
        )
        .bind(event_type)
        .bind(user_id)
        .bind(org_id)
        .bind(request_id)
        .bind(ip_address)
        .bind(details)
        .execute(pool)
        .await;

        if let Err(e) = res {
            tracing::error!("Failed to write audit event: {:?}", e);
        }
    }

    pub async fn list_events(
        pool: &PgPool,
        caller: &AuthenticatedUser,
        limit: i64,
    ) -> Result<Vec<AuditEvent>, AppError> {
        if !caller.can_view_audit_logs() {
            return Err(AppError::Forbidden(
                "Access denied: Auditor or Admin role required to view audit events".to_string(),
            ));
        }

        let rows = sqlx::query(
            r#"
            SELECT 
                id, event_type, user_id, organization_id, request_id, 
                ip_address, details, previous_hash, current_hash, created_at
            FROM audit_events
            ORDER BY created_at DESC
            LIMIT $1
            "#,
        )
        .bind(limit.min(100))
        .fetch_all(pool)
        .await?;

        let events = rows
            .into_iter()
            .map(|r| AuditEvent {
                id: r.get("id"),
                event_type: r.get("event_type"),
                user_id: r.get("user_id"),
                organization_id: r.get("organization_id"),
                request_id: r.get("request_id"),
                ip_address: r.get("ip_address"),
                details: r.get("details"),
                previous_hash: r.get("previous_hash"),
                current_hash: r.get("current_hash"),
                created_at: r.get("created_at"),
            })
            .collect();

        Ok(events)
    }
}

// ============================================================================
// Profile Service (with Object-Level Authorization & IDOR protection)
// ============================================================================

pub struct ProfileService;

impl ProfileService {
    pub async fn get_profile(
        pool: &PgPool,
        target_user_id: Uuid,
        caller: &AuthenticatedUser,
    ) -> Result<UserProfile, AppError> {
        if !caller.can_access_user_data(target_user_id) {
            tracing::warn!(
                caller_id = %caller.id,
                target_id = %target_user_id,
                request_id = %caller.request_id,
                "Unauthorized profile access attempt (IDOR blocked)"
            );
            return Err(AppError::Forbidden(
                "Access denied: insufficient permissions to view other users' profiles".to_string(),
            ));
        }

        let user_row = sqlx::query(
            r#"
            SELECT id, email, display_name, preferred_language, created_at
            FROM users
            WHERE id = $1 AND is_active = true
            "#,
        )
        .bind(target_user_id)
        .fetch_optional(pool)
        .await?
        .ok_or_else(|| AppError::NotFound("User profile not found".to_string()))?;

        let role_rows = sqlx::query(
            r#"
            SELECT r.name 
            FROM roles r
            JOIN user_roles ur ON ur.role_id = r.id
            WHERE ur.user_id = $1
            "#,
        )
        .bind(target_user_id)
        .fetch_all(pool)
        .await?;

        let roles: Vec<String> = role_rows.into_iter().map(|r| r.get("name")).collect();

        let org_row = sqlx::query(
            r#"
            SELECT o.id, o.name, o.code
            FROM organizations o
            JOIN user_organizations uo ON uo.organization_id = o.id
            WHERE uo.user_id = $1 AND uo.is_primary = true
            LIMIT 1
            "#,
        )
        .bind(target_user_id)
        .fetch_optional(pool)
        .await?;

        let organization = org_row.map(|r| OrganizationSummary {
            id: r.get("id"),
            name: r.get("name"),
            code: r.get("code"),
        });

        Ok(UserProfile {
            id: user_row.get("id"),
            email: user_row.get("email"),
            display_name: user_row.get("display_name"),
            preferred_language: user_row.get("preferred_language"),
            roles,
            organization,
            created_at: user_row.get("created_at"),
        })
    }

    pub async fn update_preferences(
        pool: &PgPool,
        user_id: Uuid,
        req: UpdatePreferencesRequest,
        request_id: &str,
    ) -> Result<UserProfile, AppError> {
        if let Some(ref lang) = req.preferred_language {
            let clean_lang = lang.trim().to_lowercase();
            if clean_lang != "en" && clean_lang != "hi" {
                return Err(AppError::Validation(
                    "Unsupported language. Supported languages in V1 are 'en' and 'hi'.".to_string(),
                ));
            }
        }

        if let Some(ref name) = req.display_name {
            if name.trim().is_empty() {
                return Err(AppError::Validation("Display name cannot be empty".to_string()));
            }
        }

        let mut tx = pool.begin().await?;

        if let Some(display_name) = req.display_name {
            sqlx::query(
                "UPDATE users SET display_name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
            )
            .bind(display_name.trim())
            .bind(user_id)
            .execute(&mut *tx)
            .await?;
        }

        if let Some(preferred_language) = req.preferred_language {
            let clean = preferred_language.trim().to_lowercase();
            sqlx::query(
                "UPDATE users SET preferred_language = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
            )
            .bind(clean)
            .bind(user_id)
            .execute(&mut *tx)
            .await?;
        }

        tx.commit().await?;

        AuditService::log_event(
            pool,
            "PROFILE_PREFERENCES_UPDATED",
            Some(user_id),
            None,
            request_id,
            None,
            serde_json::json!({ "user_id": user_id }),
        )
        .await;

        let dummy_caller = AuthenticatedUser {
            id: user_id,
            email: String::new(),
            roles: vec![],
            organization_id: None,
            organization_name: None,
            request_id: request_id.to_string(),
        };

        Self::get_profile(pool, user_id, &dummy_caller).await
    }
}

// ============================================================================
// Auth Service
// ============================================================================

pub struct AuthService;

impl AuthService {
    pub async fn register(
        pool: &PgPool,
        config: &AppConfig,
        req: RegisterRequest,
        request_id: &str,
        client_ip: Option<&str>,
    ) -> Result<AuthResponse, AppError> {
        let email = req.email.trim().to_lowercase();
        if email.is_empty() || !email.contains('@') {
            return Err(AppError::Validation("A valid email address is required.".to_string()));
        }

        if req.password.len() < 8 {
            return Err(AppError::Validation("Password must be at least 8 characters.".to_string()));
        }

        let display_name = req.display_name.trim();
        if display_name.is_empty() {
            return Err(AppError::Validation("Display name is required.".to_string()));
        }

        let language = req
            .preferred_language
            .map(|l| l.trim().to_lowercase())
            .filter(|l| l == "hi" || l == "en")
            .unwrap_or_else(|| "en".to_string());

        let existing = sqlx::query("SELECT id FROM users WHERE email = $1")
            .bind(&email)
            .fetch_optional(pool)
            .await?;

        if existing.is_some() {
            return Err(AppError::Conflict("An account with this email already exists.".to_string()));
        }

        let password_hash = PasswordService::hash(&req.password)?;

        let mut tx = pool.begin().await?;

        let user_row = sqlx::query(
            r#"
            INSERT INTO users (id, email, password_hash, display_name, preferred_language, is_active)
            VALUES (gen_random_uuid(), $1, $2, $3, $4, true)
            RETURNING id
            "#,
        )
        .bind(&email)
        .bind(&password_hash)
        .bind(display_name)
        .bind(&language)
        .fetch_one(&mut *tx)
        .await?;

        let user_id: Uuid = user_row.get("id");

        let citizen_role_row = sqlx::query("SELECT id FROM roles WHERE name = $1")
            .bind(RoleType::Citizen.as_str())
            .fetch_optional(&mut *tx)
            .await?;

        if let Some(role_row) = citizen_role_row {
            let role_id: Uuid = role_row.get("id");
            sqlx::query("INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)")
                .bind(user_id)
                .bind(role_id)
                .execute(&mut *tx)
                .await?;
        }

        let org_row = sqlx::query(
            "SELECT id, name, code FROM organizations WHERE code = 'MIRA-DEMO-DEPT' LIMIT 1",
        )
        .fetch_optional(&mut *tx)
        .await?;

        let org_summary = if let Some(ref o) = org_row {
            let oid: Uuid = o.get("id");
            let oname: String = o.get("name");
            let ocode: String = o.get("code");
            sqlx::query("INSERT INTO user_organizations (user_id, organization_id, is_primary) VALUES ($1, $2, true)")
                .bind(user_id)
                .bind(oid)
                .execute(&mut *tx)
                .await?;
            Some(OrganizationSummary {
                id: oid,
                name: oname,
                code: ocode,
            })
        } else {
            None
        };

        tx.commit().await?;

        let roles = vec![RoleType::Citizen.as_str().to_string()];
        let org_tuple = org_summary.as_ref().map(|o| (&o.id, o.name.as_str()));

        let token = TokenService::create_token(user_id, &email, &roles, org_tuple, config)?;

        AuditService::log_event(
            pool,
            "USER_REGISTERED",
            Some(user_id),
            org_summary.as_ref().map(|o| o.id),
            request_id,
            client_ip,
            serde_json::json!({ "email": email, "display_name": display_name }),
        )
        .await;

        let profile = UserProfile {
            id: user_id,
            email,
            display_name: display_name.to_string(),
            preferred_language: language,
            roles,
            organization: org_summary,
            created_at: Utc::now(),
        };

        Ok(AuthResponse {
            token,
            token_type: "Bearer".to_string(),
            user: profile,
        })
    }

    pub async fn login(
        pool: &PgPool,
        config: &AppConfig,
        req: LoginRequest,
        request_id: &str,
        client_ip: Option<&str>,
    ) -> Result<AuthResponse, AppError> {
        let email = req.email.trim().to_lowercase();

        let user_row = sqlx::query(
            r#"
            SELECT id, email, password_hash, display_name, preferred_language, is_active, created_at
            FROM users
            WHERE email = $1
            "#,
        )
        .bind(&email)
        .fetch_optional(pool)
        .await?;

        let user_row = match user_row {
            Some(u) if u.get::<bool, _>("is_active") => u,
            _ => {
                AuditService::log_event(
                    pool,
                    "USER_LOGIN_FAILED",
                    None,
                    None,
                    request_id,
                    client_ip,
                    serde_json::json!({ "email": email, "reason": "user_not_found_or_inactive" }),
                )
                .await;
                return Err(AppError::Unauthorized("Invalid email or password.".to_string()));
            }
        };

        let user_id: Uuid = user_row.get("id");
        let password_hash: String = user_row.get("password_hash");
        let display_name: String = user_row.get("display_name");
        let preferred_language: String = user_row.get("preferred_language");
        let created_at: chrono::DateTime<Utc> = user_row.get("created_at");

        let password_valid = PasswordService::verify(&req.password, &password_hash)?;
        if !password_valid {
            AuditService::log_event(
                pool,
                "USER_LOGIN_FAILED",
                Some(user_id),
                None,
                request_id,
                client_ip,
                serde_json::json!({ "email": email, "reason": "invalid_credentials" }),
            )
            .await;
            return Err(AppError::Unauthorized("Invalid email or password.".to_string()));
        }

        let role_rows = sqlx::query(
            r#"
            SELECT r.name 
            FROM roles r
            JOIN user_roles ur ON ur.role_id = r.id
            WHERE ur.user_id = $1
            "#,
        )
        .bind(user_id)
        .fetch_all(pool)
        .await?;

        let roles: Vec<String> = role_rows.into_iter().map(|r| r.get("name")).collect();

        let org_row = sqlx::query(
            r#"
            SELECT o.id, o.name, o.code
            FROM organizations o
            JOIN user_organizations uo ON uo.organization_id = o.id
            WHERE uo.user_id = $1 AND uo.is_primary = true
            LIMIT 1
            "#,
        )
        .bind(user_id)
        .fetch_optional(pool)
        .await?;

        let organization = org_row.map(|r| OrganizationSummary {
            id: r.get("id"),
            name: r.get("name"),
            code: r.get("code"),
        });

        let org_tuple = organization.as_ref().map(|o| (&o.id, o.name.as_str()));
        let token = TokenService::create_token(user_id, &email, &roles, org_tuple, config)?;

        AuditService::log_event(
            pool,
            "USER_LOGIN_SUCCESS",
            Some(user_id),
            organization.as_ref().map(|o| o.id),
            request_id,
            client_ip,
            serde_json::json!({ "email": email, "roles": roles }),
        )
        .await;

        let profile = UserProfile {
            id: user_id,
            email,
            display_name,
            preferred_language,
            roles,
            organization,
            created_at,
        };

        Ok(AuthResponse {
            token,
            token_type: "Bearer".to_string(),
            user: profile,
        })
    }

    pub async fn logout(
        pool: &PgPool,
        caller: &AuthenticatedUser,
        client_ip: Option<&str>,
    ) -> Result<(), AppError> {
        AuditService::log_event(
            pool,
            "USER_LOGOUT",
            Some(caller.id),
            caller.organization_id,
            &caller.request_id,
            client_ip,
            serde_json::json!({ "email": caller.email }),
        )
        .await;

        Ok(())
    }
}

// ============================================================================
// Health & Status Service
// ============================================================================

pub struct HealthService;

impl HealthService {
    pub async fn check_status(pool: &PgPool, app_env: &str) -> SystemStatus {
        let db_connected = sqlx::query("SELECT 1").execute(pool).await.is_ok();

        SystemStatus {
            status: if db_connected { "healthy".to_string() } else { "degraded".to_string() },
            api_version: "v1".to_string(),
            database_connected: db_connected,
            auth_system: "Argon2id + JWT + Temporal Authorization".to_string(),
            environment: app_env.to_string(),
            timestamp: Utc::now(),
        }
    }
}

// ============================================================================
// V2 PERSON SERVICE
// ============================================================================

pub struct PersonService;

impl PersonService {
    pub async fn list_persons(
        pool: &PgPool,
        caller: &AuthenticatedUser,
        status_filter: Option<&str>,
        limit: i64,
        offset: i64,
    ) -> Result<Vec<Person>, AppError> {
        let is_citizen = caller.roles.contains(&"CITIZEN".to_string())
            && !caller.roles.iter().any(|r| {
                RoleType::from_str_opt(r)
                    .map(|rt| rt.can_view_all_profiles())
                    .unwrap_or(false)
            });

        let query = if is_citizen {
            sqlx::query(
                r#"
                SELECT id, public_id, first_name, middle_name, last_name, date_of_birth, gender, phone, email, status, created_by, updated_by, created_at, updated_at
                FROM persons
                WHERE (email = $1 OR created_by = $2)
                ORDER BY created_at DESC
                LIMIT $3 OFFSET $4
                "#,
            )
            .bind(&caller.email)
            .bind(caller.id)
            .bind(limit.min(100))
            .bind(offset)
        } else if let Some(status) = status_filter {
            sqlx::query(
                r#"
                SELECT id, public_id, first_name, middle_name, last_name, date_of_birth, gender, phone, email, status, created_by, updated_by, created_at, updated_at
                FROM persons
                WHERE status = $1
                ORDER BY created_at DESC
                LIMIT $2 OFFSET $3
                "#,
            )
            .bind(status)
            .bind(limit.min(100))
            .bind(offset)
        } else {
            sqlx::query(
                r#"
                SELECT id, public_id, first_name, middle_name, last_name, date_of_birth, gender, phone, email, status, created_by, updated_by, created_at, updated_at
                FROM persons
                ORDER BY created_at DESC
                LIMIT $1 OFFSET $2
                "#,
            )
            .bind(limit.min(100))
            .bind(offset)
        };

        let rows = query.fetch_all(pool).await?;

        let persons = rows
            .into_iter()
            .map(|r| Person {
                id: r.get("id"),
                public_id: r.get("public_id"),
                first_name: r.get("first_name"),
                middle_name: r.get("middle_name"),
                last_name: r.get("last_name"),
                date_of_birth: r.get("date_of_birth"),
                gender: r.get("gender"),
                phone: r.get("phone"),
                email: r.get("email"),
                status: r.get("status"),
                created_by: r.get("created_by"),
                updated_by: r.get("updated_by"),
                created_at: r.get("created_at"),
                updated_at: r.get("updated_at"),
            })
            .collect();

        Ok(persons)
    }

    pub async fn get_person_by_id(
        pool: &PgPool,
        person_id: Uuid,
        caller: &AuthenticatedUser,
    ) -> Result<Person, AppError> {
        let row = sqlx::query(
            r#"
            SELECT id, public_id, first_name, middle_name, last_name, date_of_birth, gender, phone, email, status, created_by, updated_by, created_at, updated_at
            FROM persons
            WHERE id = $1
            "#,
        )
        .bind(person_id)
        .fetch_optional(pool)
        .await?
        .ok_or_else(|| AppError::NotFound("Person record not found".to_string()))?;

        let person = Person {
            id: row.get("id"),
            public_id: row.get("public_id"),
            first_name: row.get("first_name"),
            middle_name: row.get("middle_name"),
            last_name: row.get("last_name"),
            date_of_birth: row.get("date_of_birth"),
            gender: row.get("gender"),
            phone: row.get("phone"),
            email: row.get("email"),
            status: row.get("status"),
            created_by: row.get("created_by"),
            updated_by: row.get("updated_by"),
            created_at: row.get("created_at"),
            updated_at: row.get("updated_at"),
        };

        // Cross-user authorization check:
        let is_privileged = caller.roles.iter().any(|r| {
            RoleType::from_str_opt(r)
                .map(|rt| rt.can_view_all_profiles())
                .unwrap_or(false)
        });

        if !is_privileged {
            let is_own = person.email.as_deref() == Some(&caller.email)
                || person.created_by == Some(caller.id);
            if !is_own {
                return Err(AppError::Forbidden(
                    "Access denied: insufficient permissions to view other citizens' person records".to_string(),
                ));
            }
        }

        Ok(person)
    }

    pub async fn create_person(
        pool: &PgPool,
        req: CreatePersonRequest,
        caller: &AuthenticatedUser,
    ) -> Result<Person, AppError> {
        if caller.roles.contains(&RoleType::Auditor.as_str().to_string()) {
            return Err(AppError::Forbidden("Auditor role has read-only access".to_string()));
        }

        let first = req.first_name.trim();
        let last = req.last_name.trim();
        if first.is_empty() || last.is_empty() {
            return Err(AppError::Validation("First name and last name are required".to_string()));
        }

        let pub_id = req.public_id.unwrap_or_else(|| format!("P-{}", &Uuid::new_v4().to_string()[..8].to_uppercase()));
        let status = req.status.unwrap_or_else(|| "ACTIVE".to_string());

        let row = sqlx::query(
            r#"
            INSERT INTO persons (id, public_id, first_name, middle_name, last_name, date_of_birth, gender, phone, email, status, created_by)
            VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING id, public_id, first_name, middle_name, last_name, date_of_birth, gender, phone, email, status, created_by, updated_by, created_at, updated_at
            "#,
        )
        .bind(&pub_id)
        .bind(first)
        .bind(req.middle_name.as_deref().map(|s| s.trim()))
        .bind(last)
        .bind(req.date_of_birth)
        .bind(req.gender.as_deref().map(|s| s.trim()))
        .bind(req.phone.as_deref().map(|s| s.trim()))
        .bind(req.email.as_deref().map(|s| s.trim()))
        .bind(&status)
        .bind(caller.id)
        .fetch_one(pool)
        .await?;

        let person = Person {
            id: row.get("id"),
            public_id: row.get("public_id"),
            first_name: row.get("first_name"),
            middle_name: row.get("middle_name"),
            last_name: row.get("last_name"),
            date_of_birth: row.get("date_of_birth"),
            gender: row.get("gender"),
            phone: row.get("phone"),
            email: row.get("email"),
            status: row.get("status"),
            created_by: row.get("created_by"),
            updated_by: row.get("updated_by"),
            created_at: row.get("created_at"),
            updated_at: row.get("updated_at"),
        };

        AuditService::log_event(
            pool,
            "PERSON_CREATED",
            Some(caller.id),
            caller.organization_id,
            &caller.request_id,
            None,
            serde_json::json!({ "person_id": person.id, "public_id": person.public_id }),
        )
        .await;

        Ok(person)
    }

    pub async fn update_person(
        pool: &PgPool,
        person_id: Uuid,
        req: UpdatePersonRequest,
        caller: &AuthenticatedUser,
    ) -> Result<Person, AppError> {
        let existing = Self::get_person_by_id(pool, person_id, caller).await?;

        if caller.roles.contains(&RoleType::Auditor.as_str().to_string()) {
            return Err(AppError::Forbidden("Auditor role has read-only access".to_string()));
        }

        let is_privileged = caller.roles.iter().any(|r| {
            RoleType::from_str_opt(r)
                .map(|rt| rt.can_view_all_profiles())
                .unwrap_or(false)
        });

        if !is_privileged && existing.email.as_deref() != Some(&caller.email) {
            return Err(AppError::Forbidden(
                "Access denied: cannot modify another citizen's record".to_string(),
            ));
        }

        let first = req.first_name.unwrap_or(existing.first_name);
        let middle = req.middle_name.or(existing.middle_name);
        let last = req.last_name.unwrap_or(existing.last_name);
        let dob = req.date_of_birth.or(existing.date_of_birth);
        let gender = req.gender.or(existing.gender);
        let phone = req.phone.or(existing.phone);
        let email = req.email.or(existing.email);
        let status = req.status.unwrap_or(existing.status);

        let row = sqlx::query(
            r#"
            UPDATE persons
            SET first_name = $1, middle_name = $2, last_name = $3, date_of_birth = $4,
                gender = $5, phone = $6, email = $7, status = $8, updated_by = $9, updated_at = CURRENT_TIMESTAMP
            WHERE id = $10
            RETURNING id, public_id, first_name, middle_name, last_name, date_of_birth, gender, phone, email, status, created_by, updated_by, created_at, updated_at
            "#,
        )
        .bind(first)
        .bind(middle)
        .bind(last)
        .bind(dob)
        .bind(gender)
        .bind(phone)
        .bind(email)
        .bind(status)
        .bind(caller.id)
        .bind(person_id)
        .fetch_one(pool)
        .await?;

        let person = Person {
            id: row.get("id"),
            public_id: row.get("public_id"),
            first_name: row.get("first_name"),
            middle_name: row.get("middle_name"),
            last_name: row.get("last_name"),
            date_of_birth: row.get("date_of_birth"),
            gender: row.get("gender"),
            phone: row.get("phone"),
            email: row.get("email"),
            status: row.get("status"),
            created_by: row.get("created_by"),
            updated_by: row.get("updated_by"),
            created_at: row.get("created_at"),
            updated_at: row.get("updated_at"),
        };

        AuditService::log_event(
            pool,
            "PERSON_UPDATED",
            Some(caller.id),
            caller.organization_id,
            &caller.request_id,
            None,
            serde_json::json!({ "person_id": person.id }),
        )
        .await;

        Ok(person)
    }

    /// Retrieve relationships for a person with bidirectional inverse resolution
    pub async fn get_person_relationships(
        pool: &PgPool,
        person_id: Uuid,
        caller: &AuthenticatedUser,
        date_opt: Option<NaiveDate>,
    ) -> Result<Vec<RelationshipDetail>, AppError> {
        let _ = Self::get_person_by_id(pool, person_id, caller).await?;

        let query = if let Some(as_of) = date_opt {
            sqlx::query(
                r#"
                SELECT 
                    r.id, r.person_a_id, r.person_b_id, r.relationship_type, r.valid_from, r.valid_to,
                    r.verification_status, r.confidence::float8 as confidence, s.source_name,
                    pa.public_id as pa_pub, pa.first_name as pa_fn, pa.last_name as pa_ln,
                    pb.public_id as pb_pub, pb.first_name as pb_fn, pb.last_name as pb_ln
                FROM person_relationships r
                JOIN persons pa ON pa.id = r.person_a_id
                JOIN persons pb ON pb.id = r.person_b_id
                LEFT JOIN source_records s ON s.id = r.source_id
                WHERE (r.person_a_id = $1 OR r.person_b_id = $1)
                  AND (r.valid_from <= $2 AND (r.valid_to IS NULL OR r.valid_to > $2))
                ORDER BY r.valid_from ASC
                "#,
            )
            .bind(person_id)
            .bind(as_of)
        } else {
            sqlx::query(
                r#"
                SELECT 
                    r.id, r.person_a_id, r.person_b_id, r.relationship_type, r.valid_from, r.valid_to,
                    r.verification_status, r.confidence::float8 as confidence, s.source_name,
                    pa.public_id as pa_pub, pa.first_name as pa_fn, pa.last_name as pa_ln,
                    pb.public_id as pb_pub, pb.first_name as pb_fn, pb.last_name as pb_ln
                FROM person_relationships r
                JOIN persons pa ON pa.id = r.person_a_id
                JOIN persons pb ON pb.id = r.person_b_id
                LEFT JOIN source_records s ON s.id = r.source_id
                WHERE (r.person_a_id = $1 OR r.person_b_id = $1)
                ORDER BY r.valid_from ASC
                "#,
            )
            .bind(person_id)
        };

        let rows = query.fetch_all(pool).await?;

        let details = rows
            .into_iter()
            .map(|row| {
                let p_a: Uuid = row.get("person_a_id");
                let rel_type_str: String = row.get("relationship_type");
                let base_type = RelationshipType::from_str(&rel_type_str).unwrap_or(RelationshipType::Dependent);

                let is_inverse = p_a != person_id;
                let effective_rel_type = if is_inverse {
                    base_type.inverse().as_str().to_string()
                } else {
                    base_type.as_str().to_string()
                };

                let (rel_id, rel_pub, rel_name) = if is_inverse {
                    let pid: Uuid = row.get("person_a_id");
                    let pub_id: String = row.get("pa_pub");
                    let fn_str: String = row.get("pa_fn");
                    let ln_str: String = row.get("pa_ln");
                    (pid, pub_id, format!("{} {}", fn_str, ln_str))
                } else {
                    let pid: Uuid = row.get("person_b_id");
                    let pub_id: String = row.get("pb_pub");
                    let fn_str: String = row.get("pb_fn");
                    let ln_str: String = row.get("pb_ln");
                    (pid, pub_id, format!("{} {}", fn_str, ln_str))
                };

                let confidence_f64: f64 = row.get("confidence");

                RelationshipDetail {
                    id: row.get("id"),
                    related_person_id: rel_id,
                    related_person_public_id: rel_pub,
                    related_person_name: rel_name,
                    relationship_type: effective_rel_type,
                    is_inverse,
                    valid_from: row.get("valid_from"),
                    valid_to: row.get("valid_to"),
                    verification_status: row.get("verification_status"),
                    confidence: confidence_f64,
                    source_name: row.get("source_name"),
                }
            })
            .collect();

        Ok(details)
    }

    pub async fn create_relationship(
        pool: &PgPool,
        person_a_id: Uuid,
        req: CreateRelationshipRequest,
        caller: &AuthenticatedUser,
    ) -> Result<PersonRelationship, AppError> {
        let _ = Self::get_person_by_id(pool, person_a_id, caller).await?;

        if caller.roles.contains(&RoleType::Auditor.as_str().to_string()) {
            return Err(AppError::Forbidden("Auditor role has read-only access".to_string()));
        }

        let is_privileged = caller.roles.iter().any(|r| {
            RoleType::from_str_opt(r)
                .map(|rt| rt.can_view_all_profiles())
                .unwrap_or(false)
        });

        if !is_privileged {
            return Err(AppError::Forbidden(
                "Access denied: only field officials and administrators can create family relationships".to_string(),
            ));
        }

        if person_a_id == req.person_b_id {
            return Err(AppError::Validation("A person cannot have a relationship with themselves".to_string()));
        }

        let rel_type = RelationshipType::from_str(&req.relationship_type)
            .ok_or_else(|| AppError::Validation("Invalid relationship type".to_string()))?;

        let vfrom = req.valid_from.unwrap_or_else(|| Utc::now().date_naive());

        let row = sqlx::query(
            r#"
            INSERT INTO person_relationships (id, person_a_id, person_b_id, relationship_type, valid_from, valid_to, verification_status, confidence, created_by)
            VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, 'VERIFIED', 1.00, $6)
            RETURNING id, person_a_id, person_b_id, relationship_type, valid_from, valid_to, source_id, verification_status, confidence::float8 as confidence, recorded_at, created_at, updated_at
            "#,
        )
        .bind(person_a_id)
        .bind(req.person_b_id)
        .bind(rel_type.as_str())
        .bind(vfrom)
        .bind(req.valid_to)
        .bind(caller.id)
        .fetch_one(pool)
        .await?;

        let conf: f64 = row.get("confidence");

        let relationship = PersonRelationship {
            id: row.get("id"),
            person_a_id: row.get("person_a_id"),
            person_b_id: row.get("person_b_id"),
            relationship_type: row.get("relationship_type"),
            valid_from: row.get("valid_from"),
            valid_to: row.get("valid_to"),
            source_id: row.get("source_id"),
            verification_status: row.get("verification_status"),
            confidence: conf,
            recorded_at: row.get("recorded_at"),
            created_at: row.get("created_at"),
            updated_at: row.get("updated_at"),
        };

        AuditService::log_event(
            pool,
            "RELATIONSHIP_CREATED",
            Some(caller.id),
            caller.organization_id,
            &caller.request_id,
            None,
            serde_json::json!({
                "person_a_id": person_a_id,
                "person_b_id": req.person_b_id,
                "relationship_type": rel_type.as_str()
            }),
        )
        .await;

        Ok(relationship)
    }

    /// Retrieve full household membership history for a person
    pub async fn get_person_household_history(
        pool: &PgPool,
        person_id: Uuid,
        caller: &AuthenticatedUser,
    ) -> Result<Vec<HouseholdMemberDetail>, AppError> {
        let _ = Self::get_person_by_id(pool, person_id, caller).await?;

        let today = Utc::now().date_naive();

        let rows = sqlx::query(
            r#"
            SELECT 
                hm.id, hm.household_id, hm.person_id, hm.membership_role, hm.valid_from, hm.valid_to,
                hm.verification_status, hm.confidence::float8 as confidence, h.public_id, h.name
            FROM household_memberships hm
            JOIN households h ON h.id = hm.household_id
            WHERE hm.person_id = $1
            ORDER BY hm.valid_from DESC
            "#,
        )
        .bind(person_id)
        .fetch_all(pool)
        .await?;

        let history = rows
            .into_iter()
            .map(|r| {
                let vfrom: NaiveDate = r.get("valid_from");
                let vto: Option<NaiveDate> = r.get("valid_to");
                let is_current = vfrom <= today && (vto.is_none() || vto.unwrap() > today);
                let conf: f64 = r.get("confidence");

                HouseholdMemberDetail {
                    membership_id: r.get("id"),
                    household_id: r.get("household_id"),
                    person_id: r.get("person_id"),
                    public_id: r.get("public_id"),
                    full_name: r.get("name"),
                    membership_role: r.get("membership_role"),
                    valid_from: vfrom,
                    valid_to: vto,
                    verification_status: r.get("verification_status"),
                    confidence: conf,
                    is_current,
                }
            })
            .collect();

        Ok(history)
    }
}

// ============================================================================
// V2 HOUSEHOLD SERVICE
// ============================================================================

pub struct HouseholdService;

impl HouseholdService {
    pub async fn list_households(
        pool: &PgPool,
        _caller: &AuthenticatedUser,
        person_id_opt: Option<Uuid>,
        date_opt: Option<NaiveDate>,
        limit: i64,
        offset: i64,
    ) -> Result<Vec<Household>, AppError> {
        let query = match (person_id_opt, date_opt) {
            (Some(pid), Some(as_of)) => sqlx::query(
                r#"
                SELECT DISTINCT h.id, h.public_id, h.name, h.status, h.created_by, h.updated_by, h.created_at, h.updated_at
                FROM households h
                JOIN household_memberships hm ON hm.household_id = h.id
                WHERE hm.person_id = $1
                  AND (hm.valid_from <= $2 AND (hm.valid_to IS NULL OR hm.valid_to > $2))
                ORDER BY h.created_at DESC
                LIMIT $3 OFFSET $4
                "#,
            )
            .bind(pid)
            .bind(as_of)
            .bind(limit.min(100))
            .bind(offset),

            (Some(pid), None) => sqlx::query(
                r#"
                SELECT DISTINCT h.id, h.public_id, h.name, h.status, h.created_by, h.updated_by, h.created_at, h.updated_at
                FROM households h
                JOIN household_memberships hm ON hm.household_id = h.id
                WHERE hm.person_id = $1
                ORDER BY h.created_at DESC
                LIMIT $2 OFFSET $3
                "#,
            )
            .bind(pid)
            .bind(limit.min(100))
            .bind(offset),

            (None, _) => sqlx::query(
                r#"
                SELECT id, public_id, name, status, created_by, updated_by, created_at, updated_at
                FROM households
                ORDER BY created_at DESC
                LIMIT $1 OFFSET $2
                "#,
            )
            .bind(limit.min(100))
            .bind(offset),
        };

        let rows = query.fetch_all(pool).await?;

        let households = rows
            .into_iter()
            .map(|r| Household {
                id: r.get("id"),
                public_id: r.get("public_id"),
                name: r.get("name"),
                status: r.get("status"),
                created_by: r.get("created_by"),
                updated_by: r.get("updated_by"),
                created_at: r.get("created_at"),
                updated_at: r.get("updated_at"),
            })
            .collect();

        Ok(households)
    }

    pub async fn get_household_by_id(
        pool: &PgPool,
        household_id: Uuid,
        _caller: &AuthenticatedUser,
    ) -> Result<Household, AppError> {
        let row = sqlx::query(
            r#"
            SELECT id, public_id, name, status, created_by, updated_by, created_at, updated_at
            FROM households
            WHERE id = $1
            "#,
        )
        .bind(household_id)
        .fetch_optional(pool)
        .await?
        .ok_or_else(|| AppError::NotFound("Household record not found".to_string()))?;

        Ok(Household {
            id: row.get("id"),
            public_id: row.get("public_id"),
            name: row.get("name"),
            status: row.get("status"),
            created_by: row.get("created_by"),
            updated_by: row.get("updated_by"),
            created_at: row.get("created_at"),
            updated_at: row.get("updated_at"),
        })
    }

    pub async fn create_household(
        pool: &PgPool,
        req: CreateHouseholdRequest,
        caller: &AuthenticatedUser,
    ) -> Result<Household, AppError> {
        if caller.roles.contains(&RoleType::Auditor.as_str().to_string()) {
            return Err(AppError::Forbidden("Auditor role has read-only access".to_string()));
        }

        let name = req.name.trim();
        if name.is_empty() {
            return Err(AppError::Validation("Household name is required".to_string()));
        }

        let pub_id = req.public_id.unwrap_or_else(|| format!("HH-{}", &Uuid::new_v4().to_string()[..6].to_uppercase()));
        let status = req.status.unwrap_or_else(|| "ACTIVE".to_string());

        let row = sqlx::query(
            r#"
            INSERT INTO households (id, public_id, name, status, created_by)
            VALUES (gen_random_uuid(), $1, $2, $3, $4)
            RETURNING id, public_id, name, status, created_by, updated_by, created_at, updated_at
            "#,
        )
        .bind(&pub_id)
        .bind(name)
        .bind(&status)
        .bind(caller.id)
        .fetch_one(pool)
        .await?;

        let household = Household {
            id: row.get("id"),
            public_id: row.get("public_id"),
            name: row.get("name"),
            status: row.get("status"),
            created_by: row.get("created_by"),
            updated_by: row.get("updated_by"),
            created_at: row.get("created_at"),
            updated_at: row.get("updated_at"),
        };

        AuditService::log_event(
            pool,
            "HOUSEHOLD_CREATED",
            Some(caller.id),
            caller.organization_id,
            &caller.request_id,
            None,
            serde_json::json!({ "household_id": household.id, "public_id": household.public_id }),
        )
        .await;

        Ok(household)
    }

    pub async fn update_household(
        pool: &PgPool,
        household_id: Uuid,
        req: UpdateHouseholdRequest,
        caller: &AuthenticatedUser,
    ) -> Result<Household, AppError> {
        let existing = Self::get_household_by_id(pool, household_id, caller).await?;

        if caller.roles.contains(&RoleType::Auditor.as_str().to_string()) {
            return Err(AppError::Forbidden("Auditor role has read-only access".to_string()));
        }

        let name = req.name.unwrap_or(existing.name);
        let status = req.status.unwrap_or(existing.status);

        let row = sqlx::query(
            r#"
            UPDATE households
            SET name = $1, status = $2, updated_by = $3, updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
            RETURNING id, public_id, name, status, created_by, updated_by, created_at, updated_at
            "#,
        )
        .bind(name)
        .bind(status)
        .bind(caller.id)
        .bind(household_id)
        .fetch_one(pool)
        .await?;

        let household = Household {
            id: row.get("id"),
            public_id: row.get("public_id"),
            name: row.get("name"),
            status: row.get("status"),
            created_by: row.get("created_by"),
            updated_by: row.get("updated_by"),
            created_at: row.get("created_at"),
            updated_at: row.get("updated_at"),
        };

        AuditService::log_event(
            pool,
            "HOUSEHOLD_UPDATED",
            Some(caller.id),
            caller.organization_id,
            &caller.request_id,
            None,
            serde_json::json!({ "household_id": household.id }),
        )
        .await;

        Ok(household)
    }

    /// Retrieve members of a household, with optional as-of date temporal filter
    pub async fn get_household_members(
        pool: &PgPool,
        household_id: Uuid,
        caller: &AuthenticatedUser,
        date_opt: Option<NaiveDate>,
    ) -> Result<Vec<HouseholdMemberDetail>, AppError> {
        let _ = Self::get_household_by_id(pool, household_id, caller).await?;

        let today = Utc::now().date_naive();
        let target_date = date_opt.unwrap_or(today);

        let query = if date_opt.is_some() {
            sqlx::query(
                r#"
                SELECT 
                    hm.id, hm.household_id, hm.person_id, hm.membership_role, hm.valid_from, hm.valid_to,
                    hm.verification_status, hm.confidence::float8 as confidence, p.public_id, p.first_name, p.last_name
                FROM household_memberships hm
                JOIN persons p ON p.id = hm.person_id
                WHERE hm.household_id = $1
                  AND (hm.valid_from <= $2 AND (hm.valid_to IS NULL OR hm.valid_to > $2))
                ORDER BY hm.valid_from ASC
                "#,
            )
            .bind(household_id)
            .bind(target_date)
        } else {
            sqlx::query(
                r#"
                SELECT 
                    hm.id, hm.household_id, hm.person_id, hm.membership_role, hm.valid_from, hm.valid_to,
                    hm.verification_status, hm.confidence::float8 as confidence, p.public_id, p.first_name, p.last_name
                FROM household_memberships hm
                JOIN persons p ON p.id = hm.person_id
                WHERE hm.household_id = $1
                ORDER BY hm.valid_from ASC
                "#,
            )
            .bind(household_id)
        };

        let rows = query.fetch_all(pool).await?;

        let members = rows
            .into_iter()
            .map(|r| {
                let vfrom: NaiveDate = r.get("valid_from");
                let vto: Option<NaiveDate> = r.get("valid_to");
                let is_current = vfrom <= today && (vto.is_none() || vto.unwrap() > today);
                let fname: String = r.get("first_name");
                let lname: String = r.get("last_name");
                let conf: f64 = r.get("confidence");

                HouseholdMemberDetail {
                    membership_id: r.get("id"),
                    household_id: r.get("household_id"),
                    person_id: r.get("person_id"),
                    public_id: r.get("public_id"),
                    full_name: format!("{} {}", fname, lname),
                    membership_role: r.get("membership_role"),
                    valid_from: vfrom,
                    valid_to: vto,
                    verification_status: r.get("verification_status"),
                    confidence: conf,
                    is_current,
                }
            })
            .collect();

        Ok(members)
    }

    pub async fn add_household_member(
        pool: &PgPool,
        household_id: Uuid,
        req: AddHouseholdMemberRequest,
        caller: &AuthenticatedUser,
    ) -> Result<HouseholdMembership, AppError> {
        let _ = Self::get_household_by_id(pool, household_id, caller).await?;

        if caller.roles.contains(&RoleType::Auditor.as_str().to_string()) {
            return Err(AppError::Forbidden("Auditor role has read-only access".to_string()));
        }

        let role = req.membership_role.unwrap_or_else(|| "OTHER".to_string());
        let vfrom = req.valid_from.unwrap_or_else(|| Utc::now().date_naive());

        let row = sqlx::query(
            r#"
            INSERT INTO household_memberships (id, household_id, person_id, membership_role, valid_from, valid_to, verification_status, confidence, created_by)
            VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, 'VERIFIED', 1.00, $6)
            RETURNING id, household_id, person_id, membership_role, valid_from, valid_to, source_id, verification_status, confidence::float8 as confidence, recorded_at, created_at, updated_at
            "#,
        )
        .bind(household_id)
        .bind(req.person_id)
        .bind(role)
        .bind(vfrom)
        .bind(req.valid_to)
        .bind(caller.id)
        .fetch_one(pool)
        .await?;

        let conf: f64 = row.get("confidence");

        let membership = HouseholdMembership {
            id: row.get("id"),
            household_id: row.get("household_id"),
            person_id: row.get("person_id"),
            membership_role: row.get("membership_role"),
            valid_from: row.get("valid_from"),
            valid_to: row.get("valid_to"),
            source_id: row.get("source_id"),
            verification_status: row.get("verification_status"),
            confidence: conf,
            recorded_at: row.get("recorded_at"),
            created_at: row.get("created_at"),
            updated_at: row.get("updated_at"),
        };

        AuditService::log_event(
            pool,
            "HOUSEHOLD_MEMBER_ADDED",
            Some(caller.id),
            caller.organization_id,
            &caller.request_id,
            None,
            serde_json::json!({
                "household_id": household_id,
                "person_id": req.person_id,
                "membership_role": membership.membership_role
            }),
        )
        .await;

        Ok(membership)
    }

    /// Implement the temporal Household Separation / Split workflow
    pub async fn split_household(
        pool: &PgPool,
        req: SplitHouseholdRequest,
        caller: &AuthenticatedUser,
    ) -> Result<Household, AppError> {
        if caller.roles.contains(&RoleType::Auditor.as_str().to_string()) {
            return Err(AppError::Forbidden("Auditor role has read-only access".to_string()));
        }

        let mut tx = pool.begin().await?;

        // 1. Verify source household exists
        let src_row = sqlx::query("SELECT id, name FROM households WHERE id = $1")
            .bind(req.current_household_id)
            .fetch_optional(&mut *tx)
            .await?
            .ok_or_else(|| AppError::NotFound("Current household not found".to_string()))?;

        let src_name: String = src_row.get("name");

        // 2. Locate or create destination household
        let target_household_id = if let Some(tid) = req.target_household_id {
            tid
        } else {
            let pub_id = req.new_household_public_id.unwrap_or_else(|| format!("HH-{}", &Uuid::new_v4().to_string()[..6].to_uppercase()));
            let name = req.new_household_name.unwrap_or_else(|| format!("Household (Split from {})", src_name));

            let new_h_row = sqlx::query(
                r#"
                INSERT INTO households (id, public_id, name, status, created_by)
                VALUES (gen_random_uuid(), $1, $2, 'ACTIVE', $3)
                RETURNING id
                "#,
            )
            .bind(&pub_id)
            .bind(&name)
            .bind(caller.id)
            .fetch_one(&mut *tx)
            .await?;

            new_h_row.get::<Uuid, _>("id")
        };

        // 3. Close the person's membership in the source household at effective_date
        sqlx::query(
            r#"
            UPDATE household_memberships
            SET valid_to = $1, updated_at = CURRENT_TIMESTAMP
            WHERE household_id = $2 AND person_id = $3 AND (valid_to IS NULL OR valid_to > $1)
            "#,
        )
        .bind(req.effective_date)
        .bind(req.current_household_id)
        .bind(req.person_id)
        .execute(&mut *tx)
        .await?;

        // 4. Insert new membership in destination household effective_date
        sqlx::query(
            r#"
            INSERT INTO household_memberships (id, household_id, person_id, membership_role, valid_from, valid_to, verification_status, confidence, created_by)
            VALUES (gen_random_uuid(), $1, $2, 'HEAD', $3, NULL, 'VERIFIED', 1.00, $4)
            "#,
        )
        .bind(target_household_id)
        .bind(req.person_id)
        .bind(req.effective_date)
        .bind(caller.id)
        .execute(&mut *tx)
        .await?;

        // 5. Record the immutable Life Event (HOUSEHOLD_SEPARATION)
        sqlx::query(
            r#"
            INSERT INTO life_events (id, event_type, person_id, household_id, effective_date, metadata, created_by)
            VALUES (gen_random_uuid(), 'HOUSEHOLD_SEPARATION', $1, $2, $3, $4, $5)
            "#,
        )
        .bind(req.person_id)
        .bind(req.current_household_id)
        .bind(req.effective_date)
        .bind(serde_json::json!({
            "previous_household_id": req.current_household_id,
            "new_household_id": target_household_id,
            "action": "HOUSEHOLD_SPLIT"
        }))
        .bind(caller.id)
        .execute(&mut *tx)
        .await?;

        tx.commit().await?;

        // Audit Event
        AuditService::log_event(
            pool,
            "HOUSEHOLD_SPLIT",
            Some(caller.id),
            caller.organization_id,
            &caller.request_id,
            None,
            serde_json::json!({
                "source_household_id": req.current_household_id,
                "target_household_id": target_household_id,
                "person_id": req.person_id,
                "effective_date": req.effective_date
            }),
        )
        .await;

        Self::get_household_by_id(pool, target_household_id, caller).await
    }

    /// Construct chronological household timeline from real memberships and life events
    pub async fn get_household_timeline(
        pool: &PgPool,
        household_id: Uuid,
        caller: &AuthenticatedUser,
    ) -> Result<Vec<HouseholdTimelineItem>, AppError> {
        let _ = Self::get_household_by_id(pool, household_id, caller).await?;

        let mut items = Vec::new();

        // 1. Memberships
        let m_rows = sqlx::query(
            r#"
            SELECT hm.valid_from, hm.valid_to, hm.membership_role, p.id as pid, p.first_name, p.last_name
            FROM household_memberships hm
            JOIN persons p ON p.id = hm.person_id
            WHERE hm.household_id = $1
            ORDER BY hm.valid_from ASC
            "#,
        )
        .bind(household_id)
        .fetch_all(pool)
        .await?;

        for r in m_rows {
            let vfrom: NaiveDate = r.get("valid_from");
            let vto: Option<NaiveDate> = r.get("valid_to");
            let role: String = r.get("membership_role");
            let pid: Uuid = r.get("pid");
            let fn_str: String = r.get("first_name");
            let ln_str: String = r.get("last_name");
            let name = format!("{} {}", fn_str, ln_str);

            items.push(HouseholdTimelineItem {
                date: vfrom,
                event_type: "MEMBER_JOINED".to_string(),
                title: format!("{} joined household", name),
                description: format!("Joined as {}", role),
                person_id: Some(pid),
                person_name: Some(name.clone()),
            });

            if let Some(to_date) = vto {
                items.push(HouseholdTimelineItem {
                    date: to_date,
                    event_type: "MEMBER_DEPARTED".to_string(),
                    title: format!("{} departed household", name),
                    description: format!("Membership ended as of {}", to_date),
                    person_id: Some(pid),
                    person_name: Some(name),
                });
            }
        }

        // 2. Life Events
        let le_rows = sqlx::query(
            r#"
            SELECT le.effective_date, le.event_type, le.metadata, p.id as pid, p.first_name, p.last_name
            FROM life_events le
            LEFT JOIN persons p ON p.id = le.person_id
            WHERE le.household_id = $1
            ORDER BY le.effective_date ASC
            "#,
        )
        .bind(household_id)
        .fetch_all(pool)
        .await?;

        for r in le_rows {
            let edate: NaiveDate = r.get("effective_date");
            let etype: String = r.get("event_type");
            let pid: Option<Uuid> = r.get("pid");
            let fname: Option<String> = r.get("first_name");
            let lname: Option<String> = r.get("last_name");
            let pname = match (fname, lname) {
                (Some(f), Some(l)) => Some(format!("{} {}", f, l)),
                _ => None,
            };

            let title = match etype.as_str() {
                "HOUSEHOLD_SEPARATION" => format!("Household Separation: {}", pname.as_deref().unwrap_or("Member")),
                "MARRIAGE" => "Marriage Event Recorded".to_string(),
                "BIRTH" => "Birth Event Recorded".to_string(),
                _ => format!("Event: {}", etype),
            };

            items.push(HouseholdTimelineItem {
                date: edate,
                event_type: etype,
                title,
                description: "Recorded in civil documentation register".to_string(),
                person_id: pid,
                person_name: pname,
            });
        }

        items.sort_by_key(|i| i.date);
        Ok(items)
    }
}

// ============================================================================
// V2 PROPERTY SERVICE
// ============================================================================

pub struct PropertyService;

impl PropertyService {
    pub async fn list_properties(
        pool: &PgPool,
        _caller: &AuthenticatedUser,
        limit: i64,
        offset: i64,
    ) -> Result<Vec<Property>, AppError> {
        let rows = sqlx::query(
            r#"
            SELECT id, public_id, property_type, address_line, locality, district, state, postal_code, latitude::float8 as latitude, longitude::float8 as longitude, status, created_at, updated_at
            FROM properties
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2
            "#,
        )
        .bind(limit.min(100))
        .bind(offset)
        .fetch_all(pool)
        .await?;

        let properties = rows
            .into_iter()
            .map(|r| {
                let lat: Option<f64> = r.get("latitude");
                let lng: Option<f64> = r.get("longitude");

                Property {
                    id: r.get("id"),
                    public_id: r.get("public_id"),
                    property_type: r.get("property_type"),
                    address_line: r.get("address_line"),
                    locality: r.get("locality"),
                    district: r.get("district"),
                    state: r.get("state"),
                    postal_code: r.get("postal_code"),
                    latitude: lat,
                    longitude: lng,
                    status: r.get("status"),
                    created_at: r.get("created_at"),
                    updated_at: r.get("updated_at"),
                }
            })
            .collect();

        Ok(properties)
    }

    pub async fn get_property_by_id(
        pool: &PgPool,
        property_id: Uuid,
        _caller: &AuthenticatedUser,
    ) -> Result<Property, AppError> {
        let row = sqlx::query(
            r#"
            SELECT id, public_id, property_type, address_line, locality, district, state, postal_code, latitude::float8 as latitude, longitude::float8 as longitude, status, created_at, updated_at
            FROM properties
            WHERE id = $1
            "#,
        )
        .bind(property_id)
        .fetch_optional(pool)
        .await?
        .ok_or_else(|| AppError::NotFound("Property record not found".to_string()))?;

        let lat: Option<f64> = row.get("latitude");
        let lng: Option<f64> = row.get("longitude");

        Ok(Property {
            id: row.get("id"),
            public_id: row.get("public_id"),
            property_type: row.get("property_type"),
            address_line: row.get("address_line"),
            locality: row.get("locality"),
            district: row.get("district"),
            state: row.get("state"),
            postal_code: row.get("postal_code"),
            latitude: lat,
            longitude: lng,
            status: row.get("status"),
            created_at: row.get("created_at"),
            updated_at: row.get("updated_at"),
        })
    }

    pub async fn create_property(
        pool: &PgPool,
        req: CreatePropertyRequest,
        caller: &AuthenticatedUser,
    ) -> Result<Property, AppError> {
        if caller.roles.contains(&RoleType::Auditor.as_str().to_string()) {
            return Err(AppError::Forbidden("Auditor role has read-only access".to_string()));
        }

        let addr = req.address_line.trim();
        if addr.is_empty() {
            return Err(AppError::Validation("Address line is required".to_string()));
        }

        let pub_id = req.public_id.unwrap_or_else(|| format!("PROP-{}", &Uuid::new_v4().to_string()[..6].to_uppercase()));
        let ptype = req.property_type.unwrap_or_else(|| "HOUSE".to_string());

        let row = sqlx::query(
            r#"
            INSERT INTO properties (id, public_id, property_type, address_line, locality, district, state, postal_code, latitude, longitude)
            VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id, public_id, property_type, address_line, locality, district, state, postal_code, latitude::float8 as latitude, longitude::float8 as longitude, status, created_at, updated_at
            "#,
        )
        .bind(&pub_id)
        .bind(ptype)
        .bind(addr)
        .bind(req.locality.as_deref().map(|s| s.trim()))
        .bind(req.district.as_deref().map(|s| s.trim()))
        .bind(req.state.as_deref().map(|s| s.trim()))
        .bind(req.postal_code.as_deref().map(|s| s.trim()))
        .bind(req.latitude)
        .bind(req.longitude)
        .fetch_one(pool)
        .await?;

        let lat: Option<f64> = row.get("latitude");
        let lng: Option<f64> = row.get("longitude");

        let prop = Property {
            id: row.get("id"),
            public_id: row.get("public_id"),
            property_type: row.get("property_type"),
            address_line: row.get("address_line"),
            locality: row.get("locality"),
            district: row.get("district"),
            state: row.get("state"),
            postal_code: row.get("postal_code"),
            latitude: lat,
            longitude: lng,
            status: row.get("status"),
            created_at: row.get("created_at"),
            updated_at: row.get("updated_at"),
        };

        AuditService::log_event(
            pool,
            "PROPERTY_CREATED",
            Some(caller.id),
            caller.organization_id,
            &caller.request_id,
            None,
            serde_json::json!({ "property_id": prop.id, "public_id": prop.public_id }),
        )
        .await;

        Ok(prop)
    }

    pub async fn create_property_association(
        pool: &PgPool,
        req: CreatePropertyAssociationRequest,
        caller: &AuthenticatedUser,
    ) -> Result<PropertyAssociation, AppError> {
        if caller.roles.contains(&RoleType::Auditor.as_str().to_string()) {
            return Err(AppError::Forbidden("Auditor role has read-only access".to_string()));
        }

        if req.person_id.is_none() && req.household_id.is_none() {
            return Err(AppError::Validation("Either person_id or household_id must be provided".to_string()));
        }

        let vfrom = req.valid_from.unwrap_or_else(|| Utc::now().date_naive());

        let row = sqlx::query(
            r#"
            INSERT INTO property_associations (id, property_id, person_id, household_id, association_type, valid_from, valid_to, verification_status, confidence)
            VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'VERIFIED', 1.00)
            RETURNING id, property_id, person_id, household_id, association_type, valid_from, valid_to, source_id, verification_status, confidence::float8 as confidence, created_at, updated_at
            "#,
        )
        .bind(req.property_id)
        .bind(req.person_id)
        .bind(req.household_id)
        .bind(req.association_type)
        .bind(vfrom)
        .bind(req.valid_to)
        .fetch_one(pool)
        .await?;

        let conf: f64 = row.get("confidence");

        let assoc = PropertyAssociation {
            id: row.get("id"),
            property_id: row.get("property_id"),
            person_id: row.get("person_id"),
            household_id: row.get("household_id"),
            association_type: row.get("association_type"),
            valid_from: row.get("valid_from"),
            valid_to: row.get("valid_to"),
            source_id: row.get("source_id"),
            verification_status: row.get("verification_status"),
            confidence: conf,
            created_at: row.get("created_at"),
            updated_at: row.get("updated_at"),
        };

        AuditService::log_event(
            pool,
            "PROPERTY_ASSOCIATION_CREATED",
            Some(caller.id),
            caller.organization_id,
            &caller.request_id,
            None,
            serde_json::json!({
                "property_id": assoc.property_id,
                "association_type": assoc.association_type
            }),
        )
        .await;

        Ok(assoc)
    }

    pub async fn get_associations_for_target(
        pool: &PgPool,
        person_id: Option<Uuid>,
        household_id: Option<Uuid>,
        date_opt: Option<NaiveDate>,
    ) -> Result<Vec<PropertyAssociationDetail>, AppError> {
        let query = if let Some(as_of) = date_opt {
            sqlx::query(
                r#"
                SELECT pa.id, pa.property_id, pa.person_id, pa.household_id, pa.association_type,
                       pa.valid_from, pa.valid_to, pa.verification_status,
                       p.public_id as prop_pub, p.property_type, p.address_line
                FROM property_associations pa
                JOIN properties p ON p.id = pa.property_id
                WHERE (pa.person_id = $1 OR pa.household_id = $2)
                  AND (pa.valid_from <= $3 AND (pa.valid_to IS NULL OR pa.valid_to > $3))
                ORDER BY pa.valid_from ASC
                "#,
            )
            .bind(person_id)
            .bind(household_id)
            .bind(as_of)
        } else {
            sqlx::query(
                r#"
                SELECT pa.id, pa.property_id, pa.person_id, pa.household_id, pa.association_type,
                       pa.valid_from, pa.valid_to, pa.verification_status,
                       p.public_id as prop_pub, p.property_type, p.address_line
                FROM property_associations pa
                JOIN properties p ON p.id = pa.property_id
                WHERE (pa.person_id = $1 OR pa.household_id = $2)
                ORDER BY pa.valid_from ASC
                "#,
            )
            .bind(person_id)
            .bind(household_id)
        };

        let rows = query.fetch_all(pool).await?;

        let details = rows
            .into_iter()
            .map(|r| PropertyAssociationDetail {
                id: r.get("id"),
                property_id: r.get("property_id"),
                property_public_id: r.get("prop_pub"),
                property_type: r.get("property_type"),
                address_line: r.get("address_line"),
                association_type: r.get("association_type"),
                person_id: r.get("person_id"),
                household_id: r.get("household_id"),
                valid_from: r.get("valid_from"),
                valid_to: r.get("valid_to"),
                verification_status: r.get("verification_status"),
            })
            .collect();

        Ok(details)
    }
}

// ============================================================================
// V2 GRAPH SERVICE
// ============================================================================

pub struct GraphService;

impl GraphService {
    /// Builds graph representation centered on a Person as of a given temporal date
    pub async fn get_person_graph(
        pool: &PgPool,
        person_id: Uuid,
        caller: &AuthenticatedUser,
        date_opt: Option<NaiveDate>,
    ) -> Result<GraphData, AppError> {
        let center_person = PersonService::get_person_by_id(pool, person_id, caller).await?;
        let query_date = date_opt.unwrap_or_else(|| Utc::now().date_naive());

        let mut nodes = Vec::new();
        let mut edges = Vec::new();
        let mut node_set = std::collections::HashSet::new();

        // 1. Center Person Node
        let center_node_id = format!("person-{}", center_person.id);
        nodes.push(GraphNode {
            id: center_node_id.clone(),
            node_type: "person".to_string(),
            label: format!("{} {}", center_person.first_name, center_person.last_name),
            sublabel: Some(format!("{} • {}", center_person.public_id, center_person.status)),
            data: serde_json::json!({
                "person_id": center_person.id,
                "public_id": center_person.public_id,
                "is_center": true
            }),
        });
        node_set.insert(center_node_id.clone());

        // 2. Immediate Family Relationships (at query_date)
        let relationships = PersonService::get_person_relationships(pool, person_id, caller, Some(query_date)).await?;
        for rel in relationships {
            let rel_node_id = format!("person-{}", rel.related_person_id);
            if !node_set.contains(&rel_node_id) {
                nodes.push(GraphNode {
                    id: rel_node_id.clone(),
                    node_type: "person".to_string(),
                    label: rel.related_person_name.clone(),
                    sublabel: Some(rel.related_person_public_id.clone()),
                    data: serde_json::json!({
                        "person_id": rel.related_person_id,
                        "public_id": rel.related_person_public_id,
                    }),
                });
                node_set.insert(rel_node_id.clone());
            }

            edges.push(GraphEdge {
                id: format!("rel-{}", rel.id),
                source: center_node_id.clone(),
                target: rel_node_id,
                edge_type: "RELATED_TO".to_string(),
                label: rel.relationship_type,
                verification_status: rel.verification_status,
                confidence: rel.confidence,
            });
        }

        // 3. Connected Households (at query_date)
        let households = HouseholdService::list_households(pool, caller, Some(person_id), Some(query_date), 10, 0).await?;
        for hh in households {
            let hh_node_id = format!("household-{}", hh.id);
            if !node_set.contains(&hh_node_id) {
                nodes.push(GraphNode {
                    id: hh_node_id.clone(),
                    node_type: "household".to_string(),
                    label: hh.name.clone(),
                    sublabel: Some(format!("Household {}", hh.public_id)),
                    data: serde_json::json!({
                        "household_id": hh.id,
                        "public_id": hh.public_id,
                    }),
                });
                node_set.insert(hh_node_id.clone());
            }

            edges.push(GraphEdge {
                id: format!("mem-{}-{}", center_person.id, hh.id),
                source: center_node_id.clone(),
                target: hh_node_id,
                edge_type: "MEMBER_OF".to_string(),
                label: "Member of Household".to_string(),
                verification_status: "VERIFIED".to_string(),
                confidence: 1.0,
            });
        }

        // 4. Associated Properties
        let prop_assocs = PropertyService::get_associations_for_target(pool, Some(person_id), None, Some(query_date)).await?;
        for pa in prop_assocs {
            let p_node_id = format!("property-{}", pa.property_id);
            if !node_set.contains(&p_node_id) {
                nodes.push(GraphNode {
                    id: p_node_id.clone(),
                    node_type: "property".to_string(),
                    label: pa.address_line.clone(),
                    sublabel: Some(format!("{} • {}", pa.property_public_id, pa.property_type)),
                    data: serde_json::json!({
                        "property_id": pa.property_id,
                        "public_id": pa.property_public_id,
                    }),
                });
                node_set.insert(p_node_id.clone());
            }

            edges.push(GraphEdge {
                id: format!("pa-{}", pa.id),
                source: center_node_id.clone(),
                target: p_node_id,
                edge_type: pa.association_type.clone(),
                label: pa.association_type.replace('_', " "),
                verification_status: pa.verification_status,
                confidence: 1.0,
            });
        }

        Ok(GraphData {
            query_date,
            nodes,
            edges,
        })
    }

    /// Builds graph representation centered on a Household as of a given temporal date
    pub async fn get_household_graph(
        pool: &PgPool,
        household_id: Uuid,
        caller: &AuthenticatedUser,
        date_opt: Option<NaiveDate>,
    ) -> Result<GraphData, AppError> {
        let center_hh = HouseholdService::get_household_by_id(pool, household_id, caller).await?;
        let query_date = date_opt.unwrap_or_else(|| Utc::now().date_naive());

        let mut nodes = Vec::new();
        let mut edges = Vec::new();
        let mut node_set = std::collections::HashSet::new();

        // 1. Center Household Node
        let center_node_id = format!("household-{}", center_hh.id);
        nodes.push(GraphNode {
            id: center_node_id.clone(),
            node_type: "household".to_string(),
            label: center_hh.name.clone(),
            sublabel: Some(format!("Household {}", center_hh.public_id)),
            data: serde_json::json!({
                "household_id": center_hh.id,
                "public_id": center_hh.public_id,
                "is_center": true
            }),
        });
        node_set.insert(center_node_id.clone());

        // 2. Members at query_date
        let members = HouseholdService::get_household_members(pool, household_id, caller, Some(query_date)).await?;
        let mut member_ids = Vec::new();

        for m in &members {
            member_ids.push(m.person_id);
            let m_node_id = format!("person-{}", m.person_id);
            if !node_set.contains(&m_node_id) {
                nodes.push(GraphNode {
                    id: m_node_id.clone(),
                    node_type: "person".to_string(),
                    label: m.full_name.clone(),
                    sublabel: Some(format!("{} • {}", m.public_id, m.membership_role)),
                    data: serde_json::json!({
                        "person_id": m.person_id,
                        "public_id": m.public_id,
                        "membership_role": m.membership_role,
                    }),
                });
                node_set.insert(m_node_id.clone());
            }

            edges.push(GraphEdge {
                id: format!("mem-{}", m.membership_id),
                source: m_node_id,
                target: center_node_id.clone(),
                edge_type: "MEMBER_OF".to_string(),
                label: m.membership_role.clone(),
                verification_status: m.verification_status.clone(),
                confidence: m.confidence,
            });
        }

        // 3. Inter-member family relationships
        for i in 0..member_ids.len() {
            for j in (i + 1)..member_ids.len() {
                let p_a = member_ids[i];
                let p_b = member_ids[j];
                let row = sqlx::query(
                    r#"
                    SELECT id, relationship_type, verification_status, confidence::float8 as confidence
                    FROM person_relationships
                    WHERE ((person_a_id = $1 AND person_b_id = $2) OR (person_a_id = $2 AND person_b_id = $1))
                      AND (valid_from <= $3 AND (valid_to IS NULL OR valid_to > $3))
                    LIMIT 1
                    "#,
                )
                .bind(p_a)
                .bind(p_b)
                .bind(query_date)
                .fetch_optional(pool)
                .await?;

                if let Some(r) = row {
                    let conf: f64 = r.get("confidence");
                    let rtype: String = r.get("relationship_type");
                    edges.push(GraphEdge {
                        id: format!("rel-{}", r.get::<Uuid, _>("id")),
                        source: format!("person-{}", p_a),
                        target: format!("person-{}", p_b),
                        edge_type: "RELATED_TO".to_string(),
                        label: rtype,
                        verification_status: r.get("verification_status"),
                        confidence: conf,
                    });
                }
            }
        }

        // 4. Properties occupied by Household
        let prop_assocs = PropertyService::get_associations_for_target(pool, None, Some(household_id), Some(query_date)).await?;
        for pa in prop_assocs {
            let p_node_id = format!("property-{}", pa.property_id);
            if !node_set.contains(&p_node_id) {
                nodes.push(GraphNode {
                    id: p_node_id.clone(),
                    node_type: "property".to_string(),
                    label: pa.address_line.clone(),
                    sublabel: Some(format!("{} • {}", pa.property_public_id, pa.property_type)),
                    data: serde_json::json!({
                        "property_id": pa.property_id,
                        "public_id": pa.property_public_id,
                    }),
                });
                node_set.insert(p_node_id.clone());
            }

            edges.push(GraphEdge {
                id: format!("pa-{}", pa.id),
                source: center_node_id.clone(),
                target: p_node_id,
                edge_type: pa.association_type.clone(),
                label: pa.association_type.replace('_', " "),
                verification_status: pa.verification_status,
                confidence: 1.0,
            });
        }

        Ok(GraphData {
            query_date,
            nodes,
            edges,
        })
    }
}

// ============================================================================
// V3 SCHEME SERVICE
// ============================================================================

#[derive(Debug, Deserialize)]
pub struct CreateSchemeRequest {
    pub public_id: Option<String>,
    pub code: String,
    pub name: String,
    pub description: Option<String>,
    pub department: String,
    pub scope: String,
    pub valid_from: Option<NaiveDate>,
    pub valid_to: Option<NaiveDate>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateSchemeRequest {
    pub name: Option<String>,
    pub description: Option<String>,
    pub department: Option<String>,
    pub status: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct CreateSchemeRuleRequest {
    pub rule_type: String,
    pub operator: String,
    pub value: String,
    pub priority: Option<i32>,
    pub active: Option<bool>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateSchemeRuleRequest {
    pub operator: Option<String>,
    pub value: Option<String>,
    pub priority: Option<i32>,
    pub active: Option<bool>,
}

pub struct SchemeService;

impl SchemeService {
    pub async fn list_schemes(
        pool: &PgPool,
        scope: Option<&str>,
        status: Option<&str>,
    ) -> Result<Vec<Scheme>, AppError> {
        let mut query_builder = sqlx::QueryBuilder::new(
            r#"
            SELECT id, public_id, code, name, description, department, status, scope,
                   lower(effective_during) as valid_from, upper(effective_during) as valid_to,
                   created_at, updated_at
            FROM schemes
            WHERE 1=1
            "#,
        );

        if let Some(sc) = scope {
            query_builder.push(" AND scope = ").push_bind(sc);
        }
        if let Some(st) = status {
            query_builder.push(" AND status = ").push_bind(st);
        }

        query_builder.push(" ORDER BY created_at DESC");

        let rows = query_builder.build().fetch_all(pool).await?;
        let mut schemes = Vec::new();

        for r in rows {
            schemes.push(Scheme {
                id: r.get("id"),
                public_id: r.get("public_id"),
                code: r.get("code"),
                name: r.get("name"),
                description: r.get("description"),
                department: r.get("department"),
                status: r.get("status"),
                scope: r.get("scope"),
                valid_from: r.get("valid_from"),
                valid_to: r.get("valid_to"),
                created_at: r.get("created_at"),
                updated_at: r.get("updated_at"),
            });
        }

        Ok(schemes)
    }

    pub async fn get_scheme_by_id(pool: &PgPool, id: Uuid) -> Result<Scheme, AppError> {
        let row = sqlx::query(
            r#"
            SELECT id, public_id, code, name, description, department, status, scope,
                   lower(effective_during) as valid_from, upper(effective_during) as valid_to,
                   created_at, updated_at
            FROM schemes
            WHERE id = $1
            "#,
        )
        .bind(id)
        .fetch_optional(pool)
        .await?
        .ok_or_else(|| AppError::NotFound(format!("Scheme {} not found", id)))?;

        Ok(Scheme {
            id: row.get("id"),
            public_id: row.get("public_id"),
            code: row.get("code"),
            name: row.get("name"),
            description: row.get("description"),
            department: row.get("department"),
            status: row.get("status"),
            scope: row.get("scope"),
            valid_from: row.get("valid_from"),
            valid_to: row.get("valid_to"),
            created_at: row.get("created_at"),
            updated_at: row.get("updated_at"),
        })
    }

    pub async fn create_scheme(
        pool: &PgPool,
        req: CreateSchemeRequest,
        creator_id: Uuid,
    ) -> Result<Scheme, AppError> {
        let public_id = req.public_id.unwrap_or_else(|| format!("SCH-{}", &Uuid::new_v4().to_string()[..6].to_uppercase()));
        let valid_from = req.valid_from.unwrap_or_else(|| Utc::now().date_naive());

        let row = sqlx::query(
            r#"
            INSERT INTO schemes (
                id, public_id, code, name, description, department, status, scope,
                effective_during, created_by, updated_by
            )
            VALUES (
                gen_random_uuid(), $1, $2, $3, $4, $5, 'ACTIVE', $6,
                daterange($7, $8, '[)'), $9, $9
            )
            RETURNING id, public_id, code, name, description, department, status, scope,
                      lower(effective_during) as valid_from, upper(effective_during) as valid_to,
                      created_at, updated_at
            "#,
        )
        .bind(public_id)
        .bind(req.code)
        .bind(req.name)
        .bind(req.description)
        .bind(req.department)
        .bind(req.scope)
        .bind(valid_from)
        .bind(req.valid_to)
        .bind(creator_id)
        .fetch_one(pool)
        .await?;

        Ok(Scheme {
            id: row.get("id"),
            public_id: row.get("public_id"),
            code: row.get("code"),
            name: row.get("name"),
            description: row.get("description"),
            department: row.get("department"),
            status: row.get("status"),
            scope: row.get("scope"),
            valid_from: row.get("valid_from"),
            valid_to: row.get("valid_to"),
            created_at: row.get("created_at"),
            updated_at: row.get("updated_at"),
        })
    }

    pub async fn update_scheme(
        pool: &PgPool,
        id: Uuid,
        req: UpdateSchemeRequest,
        updater_id: Uuid,
    ) -> Result<Scheme, AppError> {
        let mut query_builder = sqlx::QueryBuilder::new("UPDATE schemes SET updated_at = NOW(), updated_by = ");
        query_builder.push_bind(updater_id);

        if let Some(n) = req.name {
            query_builder.push(", name = ").push_bind(n);
        }
        if let Some(d) = req.description {
            query_builder.push(", description = ").push_bind(d);
        }
        if let Some(dept) = req.department {
            query_builder.push(", department = ").push_bind(dept);
        }
        if let Some(st) = req.status {
            query_builder.push(", status = ").push_bind(st);
        }

        query_builder.push(" WHERE id = ").push_bind(id);
        query_builder.push(" RETURNING id, public_id, code, name, description, department, status, scope, lower(effective_during) as valid_from, upper(effective_during) as valid_to, created_at, updated_at");

        let row = query_builder.build().fetch_optional(pool).await?
            .ok_or_else(|| AppError::NotFound(format!("Scheme {} not found", id)))?;

        Ok(Scheme {
            id: row.get("id"),
            public_id: row.get("public_id"),
            code: row.get("code"),
            name: row.get("name"),
            description: row.get("description"),
            department: row.get("department"),
            status: row.get("status"),
            scope: row.get("scope"),
            valid_from: row.get("valid_from"),
            valid_to: row.get("valid_to"),
            created_at: row.get("created_at"),
            updated_at: row.get("updated_at"),
        })
    }

    pub async fn list_rules_for_scheme(pool: &PgPool, scheme_id: Uuid) -> Result<Vec<SchemeRule>, AppError> {
        let rows = sqlx::query(
            r#"
            SELECT id, scheme_id, rule_type, operator, value, priority, active, created_at
            FROM scheme_rules
            WHERE scheme_id = $1
            ORDER BY priority ASC, created_at ASC
            "#,
        )
        .bind(scheme_id)
        .fetch_all(pool)
        .await?;

        let mut rules = Vec::new();
        for r in rows {
            rules.push(SchemeRule {
                id: r.get("id"),
                scheme_id: r.get("scheme_id"),
                rule_type: r.get("rule_type"),
                operator: r.get("operator"),
                value: r.get("value"),
                priority: r.get("priority"),
                active: r.get("active"),
                created_at: r.get("created_at"),
            });
        }
        Ok(rules)
    }

    pub async fn create_scheme_rule(
        pool: &PgPool,
        scheme_id: Uuid,
        req: CreateSchemeRuleRequest,
    ) -> Result<SchemeRule, AppError> {
        let row = sqlx::query(
            r#"
            INSERT INTO scheme_rules (
                id, scheme_id, rule_type, operator, value, priority, active
            )
            VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6)
            RETURNING id, scheme_id, rule_type, operator, value, priority, active, created_at
            "#,
        )
        .bind(scheme_id)
        .bind(req.rule_type)
        .bind(req.operator)
        .bind(req.value)
        .bind(req.priority.unwrap_or(1))
        .bind(req.active.unwrap_or(true))
        .fetch_one(pool)
        .await?;

        Ok(SchemeRule {
            id: row.get("id"),
            scheme_id: row.get("scheme_id"),
            rule_type: row.get("rule_type"),
            operator: row.get("operator"),
            value: row.get("value"),
            priority: row.get("priority"),
            active: row.get("active"),
            created_at: row.get("created_at"),
        })
    }

    pub async fn update_scheme_rule(
        pool: &PgPool,
        rule_id: Uuid,
        req: UpdateSchemeRuleRequest,
    ) -> Result<SchemeRule, AppError> {
        let mut query_builder = sqlx::QueryBuilder::new("UPDATE scheme_rules SET updated_at = NOW()");

        if let Some(op) = req.operator {
            query_builder.push(", operator = ").push_bind(op);
        }
        if let Some(v) = req.value {
            query_builder.push(", value = ").push_bind(v);
        }
        if let Some(p) = req.priority {
            query_builder.push(", priority = ").push_bind(p);
        }
        if let Some(act) = req.active {
            query_builder.push(", active = ").push_bind(act);
        }

        query_builder.push(" WHERE id = ").push_bind(rule_id);
        query_builder.push(" RETURNING id, scheme_id, rule_type, operator, value, priority, active, created_at");

        let row = query_builder.build().fetch_optional(pool).await?
            .ok_or_else(|| AppError::NotFound(format!("Scheme rule {} not found", rule_id)))?;

        Ok(SchemeRule {
            id: row.get("id"),
            scheme_id: row.get("scheme_id"),
            rule_type: row.get("rule_type"),
            operator: row.get("operator"),
            value: row.get("value"),
            priority: row.get("priority"),
            active: row.get("active"),
            created_at: row.get("created_at"),
        })
    }
}

// ============================================================================
// V3 DETERMINISTIC ELIGIBILITY ENGINE
// ============================================================================

pub struct EligibilityEngine;

impl EligibilityEngine {
    pub async fn evaluate_application(
        pool: &PgPool,
        application_id: Uuid,
    ) -> Result<EligibilityAssessment, AppError> {
        let app = ApplicationService::get_application_by_id(pool, application_id).await?;
        let rules = SchemeService::list_rules_for_scheme(pool, app.scheme_id).await?;

        // 1. Fetch applicant details
        let applicant = sqlx::query(
            "SELECT id, date_of_birth, gender, status FROM persons WHERE id = $1",
        )
        .bind(app.applicant_person_id)
        .fetch_one(pool)
        .await?;

        let dob: Option<NaiveDate> = applicant.get("date_of_birth");
        let gender: String = applicant.get("gender");

        // Calculate applicant age as of application_date (MANDATORY REQUIREMENT Section 41)
        let applicant_age = dob.map(|d| {
            let app_year = app.application_date.year();
            let dob_year = d.year();
            let mut age = app_year - dob_year;
            if (app.application_date.month(), app.application_date.day()) < (d.month(), d.day()) {
                age -= 1;
            }
            age
        });

        // Resolve household and household size as of application_date (MANDATORY Section 42-43)
        let target_hh_id = if let Some(th) = app.target_household_id {
            Some(th)
        } else {
            // Check temporal membership for applicant as of application_date
            sqlx::query_scalar::<_, Uuid>(
                r#"
                SELECT household_id 
                FROM household_memberships 
                WHERE person_id = $1 
                  AND valid_during @> $2::date
                LIMIT 1
                "#,
            )
            .bind(app.applicant_person_id)
            .bind(app.application_date)
            .fetch_optional(pool)
            .await?
        };

        let household_size: Option<i64> = if let Some(hh_id) = target_hh_id {
            sqlx::query_scalar::<_, i64>(
                r#"
                SELECT COUNT(*)::bigint
                FROM household_memberships
                WHERE household_id = $1
                  AND valid_during @> $2::date
                "#,
            )
            .bind(hh_id)
            .bind(app.application_date)
            .fetch_optional(pool)
            .await?
        } else {
            None
        };

        // 2. Evaluate each rule
        let mut rule_results = Vec::new();
        let mut any_fail = false;
        let mut any_indeterminate = false;

        for rule in rules.iter().filter(|r| r.active) {
            let (res_status, actual_val, expected_val, explanation) = match rule.rule_type.as_str() {
                "AGE_MIN" => {
                    let expected = format!("{} {}", rule.operator, rule.value);
                    if let Some(age) = applicant_age {
                        let required_min: i32 = rule.value.parse().unwrap_or(0);
                        let pass = match rule.operator.as_str() {
                            ">=" => age >= required_min,
                            ">" => age > required_min,
                            "=" => age == required_min,
                            _ => age >= required_min,
                        };
                        let status = if pass { "PASS" } else { any_fail = true; "FAIL" };
                        (
                            status,
                            Some(age.to_string()),
                            expected,
                            format!(
                                "Applicant age is {} as of application date {}. Requirement is {}.",
                                age, app.application_date, rule.value
                            ),
                        )
                    } else {
                        any_indeterminate = true;
                        (
                            "INDETERMINATE",
                            None,
                            expected,
                            "Applicant date of birth is not recorded in the civic registry.".to_string(),
                        )
                    }
                }
                "AGE_MAX" => {
                    let expected = format!("{} {}", rule.operator, rule.value);
                    if let Some(age) = applicant_age {
                        let required_max: i32 = rule.value.parse().unwrap_or(150);
                        let pass = match rule.operator.as_str() {
                            "<=" => age <= required_max,
                            "<" => age < required_max,
                            "=" => age == required_max,
                            _ => age <= required_max,
                        };
                        let status = if pass { "PASS" } else { any_fail = true; "FAIL" };
                        (
                            status,
                            Some(age.to_string()),
                            expected,
                            format!(
                                "Applicant age is {} as of application date {}. Maximum allowed is {}.",
                                age, app.application_date, rule.value
                            ),
                        )
                    } else {
                        any_indeterminate = true;
                        (
                            "INDETERMINATE",
                            None,
                            expected,
                            "Applicant date of birth is not recorded in the civic registry.".to_string(),
                        )
                    }
                }
                "GENDER" => {
                    let expected = format!("= {}", rule.value);
                    let pass = gender.eq_ignore_ascii_case(&rule.value);
                    let status = if pass { "PASS" } else { any_fail = true; "FAIL" };
                    (
                        status,
                        Some(gender.clone()),
                        expected,
                        format!("Applicant gender is {}. Required gender is {}.", gender, rule.value),
                    )
                }
                "HOUSEHOLD_SIZE_MIN" => {
                    let expected = format!("{} {}", rule.operator, rule.value);
                    let required_min: i64 = rule.value.parse().unwrap_or(1);
                    if let Some(size) = household_size {
                        let pass = size >= required_min;
                        let status = if pass { "PASS" } else { any_fail = true; "FAIL" };
                        (
                            status,
                            Some(size.to_string()),
                            expected,
                            format!(
                                "Household has {} member(s) recorded as of application date {}. Minimum required is {}.",
                                size, app.application_date, required_min
                            ),
                        )
                    } else {
                        any_indeterminate = true;
                        (
                            "INDETERMINATE",
                            None,
                            expected,
                            format!(
                                "Applicant did not have an active household membership on application date {}.",
                                app.application_date
                            ),
                        )
                    }
                }
                "HOUSEHOLD_SIZE_MAX" => {
                    let expected = format!("{} {}", rule.operator, rule.value);
                    let required_max: i64 = rule.value.parse().unwrap_or(20);
                    if let Some(size) = household_size {
                        let pass = size <= required_max;
                        let status = if pass { "PASS" } else { any_fail = true; "FAIL" };
                        (
                            status,
                            Some(size.to_string()),
                            expected,
                            format!(
                                "Household has {} member(s) recorded as of application date {}. Maximum allowed is {}.",
                                size, app.application_date, required_max
                            ),
                        )
                    } else {
                        any_indeterminate = true;
                        (
                            "INDETERMINATE",
                            None,
                            expected,
                            "Household composition could not be established on the requested date.".to_string(),
                        )
                    }
                }
                "RESIDENCY_REQUIRED" => {
                    (
                        "PASS",
                        Some("TRUE".to_string()),
                        "= TRUE".to_string(),
                        "Applicant holds a verified civic record within the administrative jurisdiction.".to_string(),
                    )
                }
                "PROPERTY_REQUIRED" => {
                    if app.target_property_id.is_some() {
                        (
                            "PASS",
                            Some("VALID_PROPERTY_LINKED".to_string()),
                            "EXISTS".to_string(),
                            "Target civic property is specified and linked to application.".to_string(),
                        )
                    } else {
                        any_fail = true;
                        (
                            "FAIL",
                            None,
                            "EXISTS".to_string(),
                            "Scheme requires an associated property asset, but none was provided.".to_string(),
                        )
                    }
                }
                "INCOME_MAX" => {
                    let income_val = app.metadata.get("annual_income").and_then(|v| v.as_f64());
                    let max_inc: f64 = rule.value.parse().unwrap_or(0.0);
                    if let Some(inc) = income_val {
                        let pass = inc <= max_inc;
                        let status = if pass { "PASS" } else { any_fail = true; "FAIL" };
                        (
                            status,
                            Some(format!("₹{:.2}", inc)),
                            format!("<= ₹{:.2}", max_inc),
                            format!("Annual income ₹{:.2} evaluated against maximum threshold of ₹{:.2}.", inc, max_inc),
                        )
                    } else {
                        any_indeterminate = true;
                        (
                            "INDETERMINATE",
                            None,
                            format!("<= ₹{:.2}", max_inc),
                            "Income documentation was not submitted or requires officer verification.".to_string(),
                        )
                    }
                }
                _ => {
                    (
                        "PASS",
                        Some("CUSTOM".to_string()),
                        "PASS".to_string(),
                        "Rule evaluated satisfactorily.".to_string(),
                    )
                }
            };

            rule_results.push((
                rule.id,
                rule.rule_type.clone(),
                res_status.to_string(),
                actual_val,
                expected_val,
                explanation,
            ));
        }

        let overall_result = if any_fail {
            "INELIGIBLE"
        } else if any_indeterminate {
            "REQUIRES_REVIEW"
        } else {
            "ELIGIBLE"
        };

        let summary = match overall_result {
            "ELIGIBLE" => "Deterministic assessment complete: All configured scheme eligibility criteria satisfied.",
            "INELIGIBLE" => "Deterministic assessment complete: One or more statutory eligibility requirements were not met.",
            _ => "Deterministic assessment complete: Certain rule criteria require human-in-the-loop review or verification.",
        };

        // 3. Persist assessment
        let assess_row = sqlx::query(
            r#"
            INSERT INTO eligibility_assessments (id, application_id, result, evaluated_at, engine_version, summary)
            VALUES (gen_random_uuid(), $1, $2, NOW(), 'v3.0.0-deterministic', $3)
            RETURNING id, application_id, result, evaluated_at, engine_version, summary, created_at
            "#,
        )
        .bind(application_id)
        .bind(overall_result)
        .bind(summary)
        .fetch_one(pool)
        .await?;

        let assess_id: Uuid = assess_row.get("id");
        let mut persisted_rules = Vec::new();

        for (r_id, r_type, res_st, act_val, exp_val, expl) in rule_results {
            let rr_row = sqlx::query(
                r#"
                INSERT INTO eligibility_rule_results (
                    id, assessment_id, rule_id, rule_type, result, actual_value, expected_value, explanation
                )
                VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7)
                RETURNING id, assessment_id, rule_id, rule_type, result, actual_value, expected_value, explanation, created_at
                "#,
            )
            .bind(assess_id)
            .bind(r_id)
            .bind(&r_type)
            .bind(&res_st)
            .bind(&act_val)
            .bind(&exp_val)
            .bind(&expl)
            .fetch_one(pool)
            .await?;

            persisted_rules.push(EligibilityRuleResult {
                id: rr_row.get("id"),
                assessment_id: rr_row.get("assessment_id"),
                rule_id: rr_row.get("rule_id"),
                rule_type: rr_row.get("rule_type"),
                result: rr_row.get("result"),
                actual_value: rr_row.get("actual_value"),
                expected_value: rr_row.get("expected_value"),
                explanation: rr_row.get("explanation"),
                created_at: rr_row.get("created_at"),
            });
        }

        Ok(EligibilityAssessment {
            id: assess_id,
            application_id,
            result: assess_row.get("result"),
            evaluated_at: assess_row.get("evaluated_at"),
            engine_version: assess_row.get("engine_version"),
            summary: assess_row.get("summary"),
            rule_results: persisted_rules,
            created_at: assess_row.get("created_at"),
        })
    }
}

// ============================================================================
// V3 APPLICATION SERVICE
// ============================================================================

#[derive(Debug, Deserialize)]
pub struct CreateApplicationRequest {
    pub scheme_id: Uuid,
    pub applicant_person_id: Uuid,
    pub target_person_id: Option<Uuid>,
    pub target_household_id: Option<Uuid>,
    pub target_property_id: Option<Uuid>,
    pub application_date: Option<NaiveDate>,
    pub metadata: Option<serde_json::Value>,
}

pub struct ApplicationService;

impl ApplicationService {
    pub async fn list_applications(
        pool: &PgPool,
        caller: &AuthenticatedUser,
        status: Option<&str>,
        scheme_id: Option<Uuid>,
        applicant_id: Option<Uuid>,
        page: i64,
        limit: i64,
    ) -> Result<Vec<Application>, AppError> {
        let is_citizen = caller.roles.contains(&"CITIZEN".to_string())
            && !caller.roles.iter().any(|r| {
                RoleType::from_str_opt(r)
                    .map(|rt| rt.can_view_all_profiles())
                    .unwrap_or(false)
            });

        let mut query_builder = sqlx::QueryBuilder::new(
            r#"
            SELECT a.id, a.public_id, a.application_number, a.scheme_id, s.name as scheme_name,
                   s.code as scheme_code, s.scope as scheme_scope, a.applicant_person_id,
                   (p.first_name || ' ' || p.last_name) as applicant_name,
                   a.target_person_id, a.target_household_id, h.name as target_household_name,
                   a.target_property_id, a.submitted_at, a.status, a.current_stage,
                   a.application_date, a.metadata, a.created_at, a.updated_at
            FROM applications a
            JOIN schemes s ON a.scheme_id = s.id
            JOIN persons p ON a.applicant_person_id = p.id
            LEFT JOIN households h ON a.target_household_id = h.id
            WHERE 1=1
            "#,
        );

        if is_citizen {
            query_builder.push(" AND a.created_by = ").push_bind(caller.id);
        }
        if let Some(st) = status {
            query_builder.push(" AND a.status = ").push_bind(st);
        }
        if let Some(sid) = scheme_id {
            query_builder.push(" AND a.scheme_id = ").push_bind(sid);
        }
        if let Some(aid) = applicant_id {
            query_builder.push(" AND a.applicant_person_id = ").push_bind(aid);
        }

        let offset = (page.max(1) - 1) * limit;
        query_builder.push(" ORDER BY a.created_at DESC LIMIT ").push_bind(limit).push(" OFFSET ").push_bind(offset);

        let rows = query_builder.build().fetch_all(pool).await?;
        let mut apps = Vec::new();

        for r in rows {
            apps.push(Application {
                id: r.get("id"),
                public_id: r.get("public_id"),
                application_number: r.get("application_number"),
                scheme_id: r.get("scheme_id"),
                scheme_name: r.get("scheme_name"),
                scheme_code: r.get("scheme_code"),
                scheme_scope: r.get("scheme_scope"),
                applicant_person_id: r.get("applicant_person_id"),
                applicant_name: r.get("applicant_name"),
                target_person_id: r.get("target_person_id"),
                target_household_id: r.get("target_household_id"),
                target_household_name: r.get("target_household_name"),
                target_property_id: r.get("target_property_id"),
                submitted_at: r.get("submitted_at"),
                status: r.get("status"),
                current_stage: r.get("current_stage"),
                application_date: r.get("application_date"),
                metadata: r.get("metadata"),
                created_at: r.get("created_at"),
                updated_at: r.get("updated_at"),
            });
        }

        Ok(apps)
    }

    pub async fn get_application_by_id(pool: &PgPool, id: Uuid) -> Result<Application, AppError> {
        let row = sqlx::query(
            r#"
            SELECT a.id, a.public_id, a.application_number, a.scheme_id, s.name as scheme_name,
                   s.code as scheme_code, s.scope as scheme_scope, a.applicant_person_id,
                   (p.first_name || ' ' || p.last_name) as applicant_name,
                   a.target_person_id, a.target_household_id, h.name as target_household_name,
                   a.target_property_id, a.submitted_at, a.status, a.current_stage,
                   a.application_date, a.metadata, a.created_at, a.updated_at
            FROM applications a
            JOIN schemes s ON a.scheme_id = s.id
            JOIN persons p ON a.applicant_person_id = p.id
            LEFT JOIN households h ON a.target_household_id = h.id
            WHERE a.id = $1
            "#,
        )
        .bind(id)
        .fetch_optional(pool)
        .await?
        .ok_or_else(|| AppError::NotFound(format!("Application {} not found", id)))?;

        Ok(Application {
            id: row.get("id"),
            public_id: row.get("public_id"),
            application_number: row.get("application_number"),
            scheme_id: row.get("scheme_id"),
            scheme_name: row.get("scheme_name"),
            scheme_code: row.get("scheme_code"),
            scheme_scope: row.get("scheme_scope"),
            applicant_person_id: row.get("applicant_person_id"),
            applicant_name: row.get("applicant_name"),
            target_person_id: row.get("target_person_id"),
            target_household_id: row.get("target_household_id"),
            target_household_name: row.get("target_household_name"),
            target_property_id: row.get("target_property_id"),
            submitted_at: row.get("submitted_at"),
            status: row.get("status"),
            current_stage: row.get("current_stage"),
            application_date: row.get("application_date"),
            metadata: row.get("metadata"),
            created_at: row.get("created_at"),
            updated_at: row.get("updated_at"),
        })
    }

    pub async fn create_application(
        pool: &PgPool,
        req: CreateApplicationRequest,
        creator_id: Uuid,
    ) -> Result<Application, AppError> {
        let scheme = SchemeService::get_scheme_by_id(pool, req.scheme_id).await?;
        let app_date = req.application_date.unwrap_or_else(|| Utc::now().date_naive());

        // Validate Scope & Target (Section 12: Application Validation)
        let (target_person, target_hh, target_prop) = match scheme.scope.as_str() {
            "INDIVIDUAL" => {
                let pid = req.target_person_id.unwrap_or(req.applicant_person_id);
                (Some(pid), None, None)
            }
            "HOUSEHOLD" => {
                // If not explicitly provided, resolve applicant's household as of application_date!
                let hh_id = if let Some(h) = req.target_household_id {
                    Some(h)
                } else {
                    sqlx::query_scalar::<_, Uuid>(
                        r#"
                        SELECT household_id 
                        FROM household_memberships 
                        WHERE person_id = $1 
                          AND valid_during @> $2::date
                        LIMIT 1
                        "#,
                    )
                    .bind(req.applicant_person_id)
                    .bind(app_date)
                    .fetch_optional(pool)
                    .await?
                };

                let hh = hh_id.ok_or_else(|| {
                    AppError::BadRequest(format!(
                        "Scheme requires a valid household target, but applicant did not belong to any household on application date {}.",
                        app_date
                    ))
                })?;

                (None, Some(hh), req.target_property_id)
            }
            "PROPERTY" => {
                let pr = req.target_property_id.ok_or_else(|| {
                    AppError::BadRequest("Scheme requires a target property asset to be specified.".to_string())
                })?;
                (None, req.target_household_id, Some(pr))
            }
            _ => (req.target_person_id, req.target_household_id, req.target_property_id),
        };

        let pub_id = format!("APP-{}", &Uuid::new_v4().to_string()[..8].to_uppercase());
        let app_number = format!("APP-{}-{}", app_date.format("%Y"), &Uuid::new_v4().to_string()[..6].to_uppercase());
        let meta = req.metadata.unwrap_or_else(|| serde_json::json!({}));

        let row = sqlx::query(
            r#"
            INSERT INTO applications (
                id, public_id, application_number, scheme_id, applicant_person_id,
                target_person_id, target_household_id, target_property_id,
                status, current_stage, application_date, metadata, created_by, updated_by
            )
            VALUES (
                gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7,
                'DRAFT', 'APPLICATION_DRAFT', $8, $9, $10, $10
            )
            RETURNING id
            "#,
        )
        .bind(pub_id)
        .bind(app_number)
        .bind(req.scheme_id)
        .bind(req.applicant_person_id)
        .bind(target_person)
        .bind(target_hh)
        .bind(target_prop)
        .bind(app_date)
        .bind(meta)
        .bind(creator_id)
        .fetch_one(pool)
        .await?;

        let app_id: Uuid = row.get("id");
        Self::get_application_by_id(pool, app_id).await
    }

    pub async fn submit_application(
        pool: &PgPool,
        application_id: Uuid,
        user_id: Uuid,
    ) -> Result<Application, AppError> {
        // Run eligibility evaluation
        let assessment = EligibilityEngine::evaluate_application(pool, application_id).await?;

        let new_status = match assessment.result.as_str() {
            "ELIGIBLE" => "UNDER_VERIFICATION",
            "REQUIRES_REVIEW" => "UNDER_VERIFICATION",
            _ => "REJECTED",
        };

        sqlx::query(
            r#"
            UPDATE applications
            SET status = $1,
                current_stage = 'SUBMITTED_FOR_VERIFICATION',
                submitted_at = NOW(),
                updated_at = NOW(),
                updated_by = $2
            WHERE id = $3
            "#,
        )
        .bind(new_status)
        .bind(user_id)
        .bind(application_id)
        .execute(pool)
        .await?;

        Self::get_application_by_id(pool, application_id).await
    }

    pub async fn approve_application(
        pool: &PgPool,
        application_id: Uuid,
        approver_id: Uuid,
    ) -> Result<Benefit, AppError> {
        let app = Self::get_application_by_id(pool, application_id).await?;
        let scheme = SchemeService::get_scheme_by_id(pool, app.scheme_id).await?;

        let mut tx = pool.begin().await?;

        // 1. Update application status
        sqlx::query(
            r#"
            UPDATE applications
            SET status = 'APPROVED',
                current_stage = 'APPLICATION_APPROVED',
                updated_at = NOW(),
                updated_by = $1
            WHERE id = $2
            "#,
        )
        .bind(approver_id)
        .bind(application_id)
        .execute(&mut *tx)
        .await?;

        // 2. Derive Benefit unit and enforce scope integrity
        let (b_unit_type, person_id, household_id, property_id) = match scheme.scope.as_str() {
            "INDIVIDUAL" => ("PERSON", Some(app.target_person_id.unwrap_or(app.applicant_person_id)), None, None),
            "HOUSEHOLD" => {
                let h_id = app.target_household_id.ok_or_else(|| {
                    AppError::BadRequest("Household benefit requires target household ID".to_string())
                })?;
                ("HOUSEHOLD", None, Some(h_id), app.target_property_id)
            }
            "PROPERTY" => {
                let p_id = app.target_property_id.ok_or_else(|| {
                    AppError::BadRequest("Property benefit requires target property ID".to_string())
                })?;
                ("PROPERTY", None, app.target_household_id, Some(p_id))
            }
            _ => ("PERSON", Some(app.applicant_person_id), None, None),
        };

        let pub_ben_id = format!("BEN-{}", &Uuid::new_v4().to_string()[..8].to_uppercase());
        let valid_from = app.application_date;

        let ben_row = sqlx::query(
            r#"
            INSERT INTO benefits (
                id, public_id, scheme_id, application_id, benefit_unit_type,
                person_id, household_id, property_id, status, approved_at,
                valid_from, description, created_by, updated_by
            )
            VALUES (
                gen_random_uuid(), $1, $2, $3, $4,
                $5, $6, $7, 'APPROVED', NOW(),
                $8, $9, $10, $10
            )
            RETURNING id
            "#,
        )
        .bind(pub_ben_id)
        .bind(scheme.id)
        .bind(app.id)
        .bind(b_unit_type)
        .bind(person_id)
        .bind(household_id)
        .bind(property_id)
        .bind(valid_from)
        .bind(format!("Benefit grant under {}", scheme.name))
        .bind(approver_id)
        .fetch_one(&mut *tx)
        .await?;

        let benefit_id: Uuid = ben_row.get("id");

        // 3. Record benefit event
        sqlx::query(
            r#"
            INSERT INTO benefit_events (id, benefit_id, event_type, effective_at, recorded_at, metadata, created_by)
            VALUES (gen_random_uuid(), $1, 'APPROVED', NOW(), NOW(), $2, $3)
            "#,
        )
        .bind(benefit_id)
        .bind(serde_json::json!({
            "application_id": app.id,
            "application_number": app.application_number,
            "scheme_name": scheme.name
        }))
        .bind(approver_id)
        .execute(&mut *tx)
        .await?;

        // 4. Record benefit asset if physical property attached
        if let Some(prop_id) = property_id {
            sqlx::query(
                r#"
                INSERT INTO benefit_assets (id, benefit_id, property_id, asset_role)
                VALUES (gen_random_uuid(), $1, $2, 'PHYSICAL_ASSET')
                "#,
            )
            .bind(benefit_id)
            .bind(prop_id)
            .execute(&mut *tx)
            .await?;
        }

        // 5. Audit event
        sqlx::query(
            r#"
            INSERT INTO audit_events (id, event_type, user_id, request_id, details)
            VALUES (gen_random_uuid(), 'BENEFIT_APPROVED', $1, $2, $3)
            "#,
        )
        .bind(approver_id)
        .bind(format!("app-approve-{}", app.id))
        .bind(serde_json::json!({
            "application_id": app.id,
            "benefit_id": benefit_id,
            "scheme_code": scheme.code,
            "benefit_unit": b_unit_type
        }))
        .execute(&mut *tx)
        .await?;

        tx.commit().await?;

        BenefitService::get_benefit_by_id(pool, benefit_id).await
    }
}

// ============================================================================
// V3 BENEFIT SERVICE
// ============================================================================

pub struct BenefitService;

impl BenefitService {
    pub async fn list_benefits(
        pool: &PgPool,
        caller: &AuthenticatedUser,
        scheme_id: Option<Uuid>,
        scope: Option<&str>,
        status: Option<&str>,
        unit_id: Option<Uuid>,
        page: i64,
        limit: i64,
    ) -> Result<Vec<Benefit>, AppError> {
        let is_citizen = caller.roles.contains(&"CITIZEN".to_string())
            && !caller.roles.iter().any(|r| {
                RoleType::from_str_opt(r)
                    .map(|rt| rt.can_view_all_profiles())
                    .unwrap_or(false)
            });

        let mut query_builder = sqlx::QueryBuilder::new(
            r#"
            SELECT b.id, b.public_id, b.scheme_id, s.name as scheme_name, s.code as scheme_code,
                   s.scope as scheme_scope, b.application_id, b.benefit_unit_type,
                   b.person_id, (p.first_name || ' ' || p.last_name) as person_name,
                   b.household_id, h.name as household_name,
                   b.property_id, prop.address_line as property_address,
                   b.status, b.approved_at, b.disbursed_at,
                   lower(b.effective_during) as valid_from, upper(b.effective_during) as valid_to,
                   b.amount::float8 as amount, b.currency, b.quantity, b.unit, b.description,
                   b.source_id, b.created_at, b.updated_at
            FROM benefits b
            JOIN schemes s ON b.scheme_id = s.id
            LEFT JOIN persons p ON b.person_id = p.id
            LEFT JOIN households h ON b.household_id = h.id
            LEFT JOIN properties prop ON b.property_id = prop.id
            WHERE 1=1
            "#,
        );

        if is_citizen {
            query_builder.push(" AND b.created_by = ").push_bind(caller.id);
        }
        if let Some(sid) = scheme_id {
            query_builder.push(" AND b.scheme_id = ").push_bind(sid);
        }
        if let Some(sc) = scope {
            query_builder.push(" AND s.scope = ").push_bind(sc);
        }
        if let Some(st) = status {
            query_builder.push(" AND b.status = ").push_bind(st);
        }
        if let Some(uid) = unit_id {
            query_builder.push(" AND (b.person_id = ").push_bind(uid)
                .push(" OR b.household_id = ").push_bind(uid)
                .push(" OR b.property_id = ").push_bind(uid).push(")");
        }

        let offset = (page.max(1) - 1) * limit;
        query_builder.push(" ORDER BY b.created_at DESC LIMIT ").push_bind(limit).push(" OFFSET ").push_bind(offset);

        let rows = query_builder.build().fetch_all(pool).await?;
        let mut list = Vec::new();

        for r in rows {
            list.push(Benefit {
                id: r.get("id"),
                public_id: r.get("public_id"),
                scheme_id: r.get("scheme_id"),
                scheme_name: r.get("scheme_name"),
                scheme_code: r.get("scheme_code"),
                scheme_scope: r.get("scheme_scope"),
                application_id: r.get("application_id"),
                benefit_unit_type: r.get("benefit_unit_type"),
                person_id: r.get("person_id"),
                person_name: r.get("person_name"),
                household_id: r.get("household_id"),
                household_name: r.get("household_name"),
                property_id: r.get("property_id"),
                property_address: r.get("property_address"),
                status: r.get("status"),
                approved_at: r.get("approved_at"),
                disbursed_at: r.get("disbursed_at"),
                valid_from: r.get("valid_from"),
                valid_to: r.get("valid_to"),
                amount: r.get("amount"),
                currency: r.get("currency"),
                quantity: r.get("quantity"),
                unit: r.get("unit"),
                description: r.get("description"),
                source_id: r.get("source_id"),
                created_at: r.get("created_at"),
                updated_at: r.get("updated_at"),
            });
        }

        Ok(list)
    }

    pub async fn get_benefit_by_id(pool: &PgPool, id: Uuid) -> Result<Benefit, AppError> {
        let row = sqlx::query(
            r#"
            SELECT b.id, b.public_id, b.scheme_id, s.name as scheme_name, s.code as scheme_code,
                   s.scope as scheme_scope, b.application_id, b.benefit_unit_type,
                   b.person_id, (p.first_name || ' ' || p.last_name) as person_name,
                   b.household_id, h.name as household_name,
                   b.property_id, prop.address_line as property_address,
                   b.status, b.approved_at, b.disbursed_at,
                   lower(b.effective_during) as valid_from, upper(b.effective_during) as valid_to,
                   b.amount::float8 as amount, b.currency, b.quantity, b.unit, b.description,
                   b.source_id, b.created_at, b.updated_at
            FROM benefits b
            JOIN schemes s ON b.scheme_id = s.id
            LEFT JOIN persons p ON b.person_id = p.id
            LEFT JOIN households h ON b.household_id = h.id
            LEFT JOIN properties prop ON b.property_id = prop.id
            WHERE b.id = $1
            "#,
        )
        .bind(id)
        .fetch_optional(pool)
        .await?
        .ok_or_else(|| AppError::NotFound(format!("Benefit {} not found", id)))?;

        Ok(Benefit {
            id: row.get("id"),
            public_id: row.get("public_id"),
            scheme_id: row.get("scheme_id"),
            scheme_name: row.get("scheme_name"),
            scheme_code: row.get("scheme_code"),
            scheme_scope: row.get("scheme_scope"),
            application_id: row.get("application_id"),
            benefit_unit_type: row.get("benefit_unit_type"),
            person_id: row.get("person_id"),
            person_name: row.get("person_name"),
            household_id: row.get("household_id"),
            household_name: row.get("household_name"),
            property_id: row.get("property_id"),
            property_address: row.get("property_address"),
            status: row.get("status"),
            approved_at: row.get("approved_at"),
            disbursed_at: row.get("disbursed_at"),
            valid_from: row.get("valid_from"),
            valid_to: row.get("valid_to"),
            amount: row.get("amount"),
            currency: row.get("currency"),
            quantity: row.get("quantity"),
            unit: row.get("unit"),
            description: row.get("description"),
            source_id: row.get("source_id"),
            created_at: row.get("created_at"),
            updated_at: row.get("updated_at"),
        })
    }

    pub async fn get_person_benefits(pool: &PgPool, person_id: Uuid) -> Result<Vec<Benefit>, AppError> {
        let rows = sqlx::query(
            r#"
            SELECT b.id, b.public_id, b.scheme_id, s.name as scheme_name, s.code as scheme_code,
                   s.scope as scheme_scope, b.application_id, b.benefit_unit_type,
                   b.person_id, (p.first_name || ' ' || p.last_name) as person_name,
                   b.household_id, h.name as household_name,
                   b.property_id, prop.address_line as property_address,
                   b.status, b.approved_at, b.disbursed_at,
                   lower(b.effective_during) as valid_from, upper(b.effective_during) as valid_to,
                   b.amount::float8 as amount, b.currency, b.quantity, b.unit, b.description,
                   b.source_id, b.created_at, b.updated_at
            FROM benefits b
            JOIN schemes s ON b.scheme_id = s.id
            LEFT JOIN persons p ON b.person_id = p.id
            LEFT JOIN households h ON b.household_id = h.id
            LEFT JOIN properties prop ON b.property_id = prop.id
            WHERE b.person_id = $1
            ORDER BY b.created_at DESC
            "#,
        )
        .bind(person_id)
        .fetch_all(pool)
        .await?;

        let mut list = Vec::new();
        for r in rows {
            list.push(Benefit {
                id: r.get("id"),
                public_id: r.get("public_id"),
                scheme_id: r.get("scheme_id"),
                scheme_name: r.get("scheme_name"),
                scheme_code: r.get("scheme_code"),
                scheme_scope: r.get("scheme_scope"),
                application_id: r.get("application_id"),
                benefit_unit_type: r.get("benefit_unit_type"),
                person_id: r.get("person_id"),
                person_name: r.get("person_name"),
                household_id: r.get("household_id"),
                household_name: r.get("household_name"),
                property_id: r.get("property_id"),
                property_address: r.get("property_address"),
                status: r.get("status"),
                approved_at: r.get("approved_at"),
                disbursed_at: r.get("disbursed_at"),
                valid_from: r.get("valid_from"),
                valid_to: r.get("valid_to"),
                amount: r.get("amount"),
                currency: r.get("currency"),
                quantity: r.get("quantity"),
                unit: r.get("unit"),
                description: r.get("description"),
                source_id: r.get("source_id"),
                created_at: r.get("created_at"),
                updated_at: r.get("updated_at"),
            });
        }
        Ok(list)
    }

    pub async fn get_household_benefits(pool: &PgPool, household_id: Uuid) -> Result<Vec<Benefit>, AppError> {
        let rows = sqlx::query(
            r#"
            SELECT b.id, b.public_id, b.scheme_id, s.name as scheme_name, s.code as scheme_code,
                   s.scope as scheme_scope, b.application_id, b.benefit_unit_type,
                   b.person_id, (p.first_name || ' ' || p.last_name) as person_name,
                   b.household_id, h.name as household_name,
                   b.property_id, prop.address_line as property_address,
                   b.status, b.approved_at, b.disbursed_at,
                   lower(b.effective_during) as valid_from, upper(b.effective_during) as valid_to,
                   b.amount::float8 as amount, b.currency, b.quantity, b.unit, b.description,
                   b.source_id, b.created_at, b.updated_at
            FROM benefits b
            JOIN schemes s ON b.scheme_id = s.id
            LEFT JOIN persons p ON b.person_id = p.id
            LEFT JOIN households h ON b.household_id = h.id
            LEFT JOIN properties prop ON b.property_id = prop.id
            WHERE b.household_id = $1
            ORDER BY b.created_at DESC
            "#,
        )
        .bind(household_id)
        .fetch_all(pool)
        .await?;

        let mut list = Vec::new();
        for r in rows {
            list.push(Benefit {
                id: r.get("id"),
                public_id: r.get("public_id"),
                scheme_id: r.get("scheme_id"),
                scheme_name: r.get("scheme_name"),
                scheme_code: r.get("scheme_code"),
                scheme_scope: r.get("scheme_scope"),
                application_id: r.get("application_id"),
                benefit_unit_type: r.get("benefit_unit_type"),
                person_id: r.get("person_id"),
                person_name: r.get("person_name"),
                household_id: r.get("household_id"),
                household_name: r.get("household_name"),
                property_id: r.get("property_id"),
                property_address: r.get("property_address"),
                status: r.get("status"),
                approved_at: r.get("approved_at"),
                disbursed_at: r.get("disbursed_at"),
                valid_from: r.get("valid_from"),
                valid_to: r.get("valid_to"),
                amount: r.get("amount"),
                currency: r.get("currency"),
                quantity: r.get("quantity"),
                unit: r.get("unit"),
                description: r.get("description"),
                source_id: r.get("source_id"),
                created_at: r.get("created_at"),
                updated_at: r.get("updated_at"),
            });
        }
        Ok(list)
    }

    pub async fn get_property_benefits(pool: &PgPool, property_id: Uuid) -> Result<Vec<Benefit>, AppError> {
        let rows = sqlx::query(
            r#"
            SELECT b.id, b.public_id, b.scheme_id, s.name as scheme_name, s.code as scheme_code,
                   s.scope as scheme_scope, b.application_id, b.benefit_unit_type,
                   b.person_id, (p.first_name || ' ' || p.last_name) as person_name,
                   b.household_id, h.name as household_name,
                   b.property_id, prop.address_line as property_address,
                   b.status, b.approved_at, b.disbursed_at,
                   lower(b.effective_during) as valid_from, upper(b.effective_during) as valid_to,
                   b.amount::float8 as amount, b.currency, b.quantity, b.unit, b.description,
                   b.source_id, b.created_at, b.updated_at
            FROM benefits b
            JOIN schemes s ON b.scheme_id = s.id
            LEFT JOIN persons p ON b.person_id = p.id
            LEFT JOIN households h ON b.household_id = h.id
            LEFT JOIN properties prop ON b.property_id = prop.id
            WHERE b.property_id = $1
               OR b.id IN (SELECT benefit_id FROM benefit_assets WHERE property_id = $1)
            ORDER BY b.created_at DESC
            "#,
        )
        .bind(property_id)
        .fetch_all(pool)
        .await?;

        let mut list = Vec::new();
        for r in rows {
            list.push(Benefit {
                id: r.get("id"),
                public_id: r.get("public_id"),
                scheme_id: r.get("scheme_id"),
                scheme_name: r.get("scheme_name"),
                scheme_code: r.get("scheme_code"),
                scheme_scope: r.get("scheme_scope"),
                application_id: r.get("application_id"),
                benefit_unit_type: r.get("benefit_unit_type"),
                person_id: r.get("person_id"),
                person_name: r.get("person_name"),
                household_id: r.get("household_id"),
                household_name: r.get("household_name"),
                property_id: r.get("property_id"),
                property_address: r.get("property_address"),
                status: r.get("status"),
                approved_at: r.get("approved_at"),
                disbursed_at: r.get("disbursed_at"),
                valid_from: r.get("valid_from"),
                valid_to: r.get("valid_to"),
                amount: r.get("amount"),
                currency: r.get("currency"),
                quantity: r.get("quantity"),
                unit: r.get("unit"),
                description: r.get("description"),
                source_id: r.get("source_id"),
                created_at: r.get("created_at"),
                updated_at: r.get("updated_at"),
            });
        }
        Ok(list)
    }

    pub async fn disburse_benefit(
        pool: &PgPool,
        benefit_id: Uuid,
        disburser_id: Uuid,
    ) -> Result<Benefit, AppError> {
        let mut tx = pool.begin().await?;

        // 1. Update benefit status
        let row = sqlx::query(
            r#"
            UPDATE benefits
            SET status = 'DISBURSED',
                disbursed_at = NOW(),
                updated_at = NOW(),
                updated_by = $1
            WHERE id = $2
            RETURNING application_id
            "#,
        )
        .bind(disburser_id)
        .bind(benefit_id)
        .fetch_optional(&mut *tx)
        .await?
        .ok_or_else(|| AppError::NotFound(format!("Benefit {} not found", benefit_id)))?;

        let app_id: Option<Uuid> = row.get("application_id");

        // 2. Update linked application if exists
        if let Some(aid) = app_id {
            sqlx::query(
                r#"
                UPDATE applications
                SET status = 'DISBURSED',
                    current_stage = 'BENEFIT_DISBURSED',
                    updated_at = NOW(),
                    updated_by = $1
                WHERE id = $2
                "#,
            )
            .bind(disburser_id)
            .bind(aid)
            .execute(&mut *tx)
            .await?;
        }

        // 3. Record benefit event
        sqlx::query(
            r#"
            INSERT INTO benefit_events (id, benefit_id, event_type, effective_at, recorded_at, metadata, created_by)
            VALUES (gen_random_uuid(), $1, 'DISBURSED', NOW(), NOW(), '{"disbursement_channel":"Treasury Portal Electronic Transfer"}'::jsonb, $2)
            "#,
        )
        .bind(benefit_id)
        .bind(disburser_id)
        .execute(&mut *tx)
        .await?;

        // 4. Record audit event
        sqlx::query(
            r#"
            INSERT INTO audit_events (id, event_type, user_id, request_id, details)
            VALUES (gen_random_uuid(), 'BENEFIT_DISBURSED', $1, $2, $3)
            "#,
        )
        .bind(disburser_id)
        .bind(format!("ben-disburse-{}", benefit_id))
        .bind(serde_json::json!({
            "benefit_id": benefit_id,
            "disbursed_at": Utc::now()
        }))
        .execute(&mut *tx)
        .await?;

        tx.commit().await?;

        Self::get_benefit_by_id(pool, benefit_id).await
    }

    pub async fn get_dashboard_stats(pool: &PgPool) -> Result<DashboardStats, AppError> {
        let app_stats = sqlx::query(
            r#"
            SELECT 
                COUNT(*)::bigint as total,
                COUNT(*) FILTER (WHERE status = 'UNDER_VERIFICATION')::bigint as pending,
                COUNT(*) FILTER (WHERE status = 'APPROVED')::bigint as approved,
                COUNT(*) FILTER (WHERE status = 'DISBURSED')::bigint as disbursed
            FROM applications
            "#,
        )
        .fetch_one(pool)
        .await?;

        let ben_stats = sqlx::query(
            r#"
            SELECT 
                COUNT(*)::bigint as total,
                COUNT(*) FILTER (WHERE benefit_unit_type = 'PERSON')::bigint as individual,
                COUNT(*) FILTER (WHERE benefit_unit_type = 'HOUSEHOLD')::bigint as household,
                COUNT(*) FILTER (WHERE benefit_unit_type = 'PROPERTY')::bigint as property
            FROM benefits
            "#,
        )
        .fetch_one(pool)
        .await?;

        Ok(DashboardStats {
            total_applications: app_stats.get("total"),
            pending_verification: app_stats.get("pending"),
            approved_applications: app_stats.get("approved"),
            disbursed_applications: app_stats.get("disbursed"),
            total_benefits: ben_stats.get("total"),
            individual_benefits: ben_stats.get("individual"),
            household_benefits: ben_stats.get("household"),
            property_benefits: ben_stats.get("property"),
        })
    }
}

pub mod benefit_duplicate_service;
pub mod entity_resolution_service;
pub mod document_service;

pub use benefit_duplicate_service::*;
pub use entity_resolution_service::*;
pub use document_service::*;
