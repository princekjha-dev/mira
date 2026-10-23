use std::sync::Arc;
use std::process::Stdio;
use axum::{
    extract::{DefaultBodyLimit, Path, Query, State},
    http::{HeaderMap, StatusCode},
    response::IntoResponse,
    routing::{get, patch, post, put},
    Json, Router,
};
use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use sqlx::{PgPool, Row};
use uuid::Uuid;
use tokio::{io::AsyncWriteExt, process::Command};

use crate::{
    application::{
        AddHouseholdMemberRequest, ApplicationService, AssignApplicationRequest, AuditService, AuthService,
        BenefitDuplicateDecisionRequest, BenefitDuplicateService, BenefitService, CheckBenefitDuplicateRequest,
        CreateApplicationRequest, CreateERCaseRequest, CreateHouseholdRequest, CreatePersonRequest,
        CreatePropertyAssociationRequest, CreatePropertyRequest, CreateRelationshipRequest, CreateSchemeRequest,
        CreateSchemeRuleRequest, EligibilityEngine, EntityResolutionService, GraphService, HealthService,
        HouseholdService, LoginRequest, NotificationService, PersonService, ProfileService, PropertyService,
        RegisterRequest, RejectApplicationRequest, RequestEvidenceRequest, ResolveERCaseRequest, SchemeService,
        SplitHouseholdRequest, SubmitEvidenceRequest, UpdateApplicationRequest, UpdateHouseholdRequest,
        UpdatePersonRequest, UpdatePreferencesRequest, UpdateSchemeRequest, UpdateSchemeRuleRequest,
        VerifyApplicationRequest,
    },
    auth::AuthenticatedUser,

    config::AppConfig,
    errors::AppError,
    infrastructure::REQUEST_ID_HEADER,
};

#[derive(Clone)]
pub struct AppState {
    pub pool: PgPool,
    pub config: Arc<AppConfig>,
}

#[derive(Serialize)]
pub struct ApiResponse<T> {
    pub data: T,
}

#[derive(Serialize)]
pub struct MessageResponse {
    pub message: String,
}

fn get_request_id(headers: &HeaderMap) -> String {
    headers
        .get(REQUEST_ID_HEADER)
        .and_then(|h| h.to_str().ok())
        .unwrap_or("unknown")
        .to_string()
}

fn get_client_ip(headers: &HeaderMap) -> Option<&str> {
    headers
        .get("x-forwarded-for")
        .and_then(|h| h.to_str().ok())
        .map(|s| s.split(',').next().unwrap_or(s).trim())
}

// ============================================================================
// V1 Auth & Profile Handlers
// ============================================================================

pub async fn health_handler(State(state): State<AppState>) -> impl IntoResponse {
    let status = HealthService::check_status(&state.pool, &state.config.app_env).await;
    (StatusCode::OK, Json(ApiResponse { data: status }))
}

pub async fn register_handler(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(payload): Json<RegisterRequest>,
) -> Result<impl IntoResponse, AppError> {
    let request_id = get_request_id(&headers);
    let client_ip = get_client_ip(&headers);
    let res = AuthService::register(&state.pool, &state.config, payload, &request_id, client_ip).await?;
    Ok((StatusCode::CREATED, Json(res)))
}

pub async fn login_handler(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(payload): Json<LoginRequest>,
) -> Result<impl IntoResponse, AppError> {
    let request_id = get_request_id(&headers);
    let client_ip = get_client_ip(&headers);
    let res = AuthService::login(&state.pool, &state.config, payload, &request_id, client_ip).await?;
    Ok((StatusCode::OK, Json(res)))
}

#[derive(Deserialize)]
pub struct DemoLoginRequest {
    role: String,
}

pub async fn demo_login_handler(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(payload): Json<DemoLoginRequest>,
) -> Result<impl IntoResponse, AppError> {
    if !state.config.demo_mode {
        return Err(AppError::NotFound("Demo access is unavailable.".to_string()));
    }

    let (primary_email, fallback_email, expected_roles): (&str, Option<&str>, &[&str]) = match payload.role.as_str() {
        "citizen" => ("demo.citizen@mira.demo", Some("citizen@mira.local"), &["CITIZEN"]),
        "verifier" => ("demo.verifier@mira.demo", Some("verifier@mira.local"), &["VERIFICATION_OFFICER"]),
        "scheme" => ("demo.scheme@mira.demo", Some("officer@mira.local"), &["SCHEME_OFFICER", "FIELD_OFFICIAL"]),
        "supervisor" => ("demo.supervisor@mira.demo", Some("admin@mira.local"), &["SUPERVISOR", "DEPARTMENT_ADMIN"]),
        "auditor" => ("demo.auditor@mira.demo", Some("auditor@mira.local"), &["AUDITOR"]),
        "admin" => ("demo.admin@mira.demo", Some("admin@mira.local"), &["DEPARTMENT_ADMIN", "SUPER_ADMIN"]),
        "officer" => ("officer@mira.local", Some("demo.scheme@mira.demo"), &["FIELD_OFFICIAL", "SCHEME_OFFICER"]),
        _ => return Err(AppError::Validation("Choose a valid demo account.".to_string())),
    };

    let request_id = get_request_id(&headers);
    let client_ip = get_client_ip(&headers);

    // Attempt primary email first, then fallback email
    let login_attempt = AuthService::login(
        &state.pool,
        &state.config,
        LoginRequest {
            email: primary_email.to_string(),
            password: crate::database::DEMO_PASSWORD.to_string(),
        },
        &request_id,
        client_ip.clone(),
    )
    .await;

    let response = match login_attempt {
        Ok(res) => res,
        Err(_) if fallback_email.is_some() => {
            AuthService::login(
                &state.pool,
                &state.config,
                LoginRequest {
                    email: fallback_email.unwrap().to_string(),
                    password: crate::database::DEMO_PASSWORD.to_string(),
                },
                &request_id,
                client_ip,
            )
            .await?
        }
        Err(e) => return Err(e),
    };

    if !response.user.is_demo || !response.user.roles.iter().any(|role| expected_roles.contains(&role.as_str())) {
        return Err(AppError::Forbidden("This account is not configured for the selected demo role.".to_string()));
    }

    Ok((StatusCode::OK, Json(response)))
}

pub async fn logout_handler(
    State(state): State<AppState>,
    headers: HeaderMap,
    user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let client_ip = get_client_ip(&headers);
    AuthService::logout(&state.pool, &user, client_ip).await?;
    Ok((StatusCode::OK, Json(MessageResponse { message: "Successfully logged out".to_string() })))
}

pub async fn me_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let profile = ProfileService::get_profile(&state.pool, user.id, &user).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: profile })))
}

pub async fn profile_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let profile = ProfileService::get_profile(&state.pool, user.id, &user).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: profile })))
}

pub async fn profile_by_id_handler(
    State(state): State<AppState>,
    Path(target_id): Path<Uuid>,
    user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let profile = ProfileService::get_profile(&state.pool, target_id, &user).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: profile })))
}

pub async fn update_preferences_handler(
    State(state): State<AppState>,
    headers: HeaderMap,
    user: AuthenticatedUser,
    Json(payload): Json<UpdatePreferencesRequest>,
) -> Result<impl IntoResponse, AppError> {
    let request_id = get_request_id(&headers);
    let profile = ProfileService::update_preferences(&state.pool, user.id, payload, &request_id).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: profile })))
}

pub async fn get_my_family_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let family = ProfileService::get_family_for_user(&state.pool, &user).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: family })))
}

pub async fn add_my_family_member_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    Json(payload): Json<crate::domain::AddFamilyMemberRequest>,
) -> Result<impl IntoResponse, AppError> {
    let member = ProfileService::add_family_member(&state.pool, payload, &user).await?;
    Ok((StatusCode::CREATED, Json(ApiResponse { data: member })))
}

pub async fn report_my_family_event_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    Json(payload): Json<crate::domain::ReportLifeEventRequest>,
) -> Result<impl IntoResponse, AppError> {
    let event = ProfileService::report_life_event(&state.pool, payload, &user).await?;
    Ok((StatusCode::CREATED, Json(ApiResponse { data: event })))
}

pub async fn raise_my_family_dispute_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    Json(payload): Json<crate::domain::RaiseDisputeRequest>,
) -> Result<impl IntoResponse, AppError> {
    let dispute = ProfileService::raise_dispute(&state.pool, payload, &user).await?;
    Ok((StatusCode::CREATED, Json(ApiResponse { data: dispute })))
}

#[derive(Deserialize)]
pub struct AuditQuery {
    pub limit: Option<i64>,
}

pub async fn audit_events_handler(
    State(state): State<AppState>,
    Query(query): Query<AuditQuery>,
    user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let limit = query.limit.unwrap_or(50);
    let events = AuditService::list_events(&state.pool, &user, limit).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: events })))
}

// ============================================================================
// V2 PERSON HANDLERS
// ============================================================================

#[derive(Deserialize)]
pub struct PersonListQuery {
    pub status: Option<String>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

pub async fn list_persons_handler(
    State(state): State<AppState>,
    Query(q): Query<PersonListQuery>,
    user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let limit = q.limit.unwrap_or(50);
    let offset = q.offset.unwrap_or(0);
    let persons = PersonService::list_persons(&state.pool, &user, q.status.as_deref(), limit, offset).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: persons })))
}

pub async fn get_person_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let person = PersonService::get_person_by_id(&state.pool, id, &user).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: person })))
}

pub async fn create_person_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    Json(payload): Json<CreatePersonRequest>,
) -> Result<impl IntoResponse, AppError> {
    let person = PersonService::create_person(&state.pool, payload, &user).await?;
    Ok((StatusCode::CREATED, Json(ApiResponse { data: person })))
}

pub async fn patch_person_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    user: AuthenticatedUser,
    Json(payload): Json<UpdatePersonRequest>,
) -> Result<impl IntoResponse, AppError> {
    let person = PersonService::update_person(&state.pool, id, payload, &user).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: person })))
}

#[derive(Deserialize)]
pub struct DateQuery {
    pub date: Option<NaiveDate>,
}

pub async fn get_person_relationships_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Query(dq): Query<DateQuery>,
    user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let rels = PersonService::get_person_relationships(&state.pool, id, &user, dq.date).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: rels })))
}

pub async fn create_person_relationship_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    user: AuthenticatedUser,
    Json(payload): Json<CreateRelationshipRequest>,
) -> Result<impl IntoResponse, AppError> {
    let rel = PersonService::create_relationship(&state.pool, id, payload, &user).await?;
    Ok((StatusCode::CREATED, Json(ApiResponse { data: rel })))
}

pub async fn get_person_households_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let history = PersonService::get_person_household_history(&state.pool, id, &user).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: history })))
}

// ============================================================================
// V2 HOUSEHOLD HANDLERS
// ============================================================================

#[derive(Deserialize)]
pub struct HouseholdListQuery {
    pub person: Option<Uuid>,
    pub date: Option<NaiveDate>,
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

pub async fn list_households_handler(
    State(state): State<AppState>,
    Query(q): Query<HouseholdListQuery>,
    user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let limit = q.limit.unwrap_or(50);
    let offset = q.offset.unwrap_or(0);
    let households = HouseholdService::list_households(&state.pool, &user, q.person, q.date, limit, offset).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: households })))
}

pub async fn get_household_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let household = HouseholdService::get_household_by_id(&state.pool, id, &user).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: household })))
}

pub async fn create_household_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    Json(payload): Json<CreateHouseholdRequest>,
) -> Result<impl IntoResponse, AppError> {
    let household = HouseholdService::create_household(&state.pool, payload, &user).await?;
    Ok((StatusCode::CREATED, Json(ApiResponse { data: household })))
}

pub async fn patch_household_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    user: AuthenticatedUser,
    Json(payload): Json<UpdateHouseholdRequest>,
) -> Result<impl IntoResponse, AppError> {
    let household = HouseholdService::update_household(&state.pool, id, payload, &user).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: household })))
}

pub async fn get_household_members_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Query(dq): Query<DateQuery>,
    user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let members = HouseholdService::get_household_members(&state.pool, id, &user, dq.date).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: members })))
}

pub async fn add_household_member_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    user: AuthenticatedUser,
    Json(payload): Json<AddHouseholdMemberRequest>,
) -> Result<impl IntoResponse, AppError> {
    let member = HouseholdService::add_household_member(&state.pool, id, payload, &user).await?;
    Ok((StatusCode::CREATED, Json(ApiResponse { data: member })))
}

pub async fn split_household_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    Json(payload): Json<SplitHouseholdRequest>,
) -> Result<impl IntoResponse, AppError> {
    let new_hh = HouseholdService::split_household(&state.pool, payload, &user).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: new_hh })))
}

pub async fn get_household_timeline_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let timeline = HouseholdService::get_household_timeline(&state.pool, id, &user).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: timeline })))
}

// ============================================================================
// V2 PROPERTY HANDLERS
// ============================================================================

#[derive(Deserialize)]
pub struct PropertyListQuery {
    pub limit: Option<i64>,
    pub offset: Option<i64>,
}

pub async fn list_properties_handler(
    State(state): State<AppState>,
    Query(q): Query<PropertyListQuery>,
    user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let limit = q.limit.unwrap_or(50);
    let offset = q.offset.unwrap_or(0);
    let props = PropertyService::list_properties(&state.pool, &user, limit, offset).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: props })))
}

pub async fn get_property_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let prop = PropertyService::get_property_by_id(&state.pool, id, &user).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: prop })))
}

pub async fn create_property_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    Json(payload): Json<CreatePropertyRequest>,
) -> Result<impl IntoResponse, AppError> {
    let prop = PropertyService::create_property(&state.pool, payload, &user).await?;
    Ok((StatusCode::CREATED, Json(ApiResponse { data: prop })))
}

pub async fn create_property_association_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    Json(payload): Json<CreatePropertyAssociationRequest>,
) -> Result<impl IntoResponse, AppError> {
    let assoc = PropertyService::create_property_association(&state.pool, payload, &user).await?;
    Ok((StatusCode::CREATED, Json(ApiResponse { data: assoc })))
}

pub async fn get_household_properties_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Query(dq): Query<DateQuery>,
    _user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let assocs = PropertyService::get_associations_for_target(&state.pool, None, Some(id), dq.date).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: assocs })))
}

pub async fn get_person_properties_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Query(dq): Query<DateQuery>,
    _user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let assocs = PropertyService::get_associations_for_target(&state.pool, Some(id), None, dq.date).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: assocs })))
}

// ============================================================================
// V2 GRAPH HANDLERS
// ============================================================================

pub async fn get_person_graph_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Query(dq): Query<DateQuery>,
    user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let graph = GraphService::get_person_graph(&state.pool, id, &user, dq.date).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: graph })))
}

pub async fn get_household_graph_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    Query(dq): Query<DateQuery>,
    user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let graph = GraphService::get_household_graph(&state.pool, id, &user, dq.date).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: graph })))
}

// ============================================================================
// V3 Schemes, Applications, Eligibility & Benefits Handlers
// ============================================================================

#[derive(Debug, Deserialize)]
pub struct SchemeFilterQuery {
    pub scope: Option<String>,
    pub status: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct ApplicationFilterQuery {
    pub status: Option<String>,
    pub scheme_id: Option<Uuid>,
    pub applicant_id: Option<Uuid>,
    pub page: Option<i64>,
    pub limit: Option<i64>,
}

#[derive(Debug, Deserialize)]
pub struct BenefitFilterQuery {
    pub scheme_id: Option<Uuid>,
    pub scope: Option<String>,
    pub status: Option<String>,
    pub unit_id: Option<Uuid>,
    pub page: Option<i64>,
    pub limit: Option<i64>,
}

fn require_admin_or_officer(user: &AuthenticatedUser) -> Result<(), AppError> {
    if user.roles.iter().any(|r| r == "AUDITOR") && !user.roles.iter().any(|r| r == "SUPER_ADMIN" || r == "DEPARTMENT_ADMIN") {
        return Err(AppError::Forbidden("Auditors hold read-only oversight permissions".to_string()));
    }
    let is_authorized = user.roles.iter().any(|r| {
        matches!(r.as_str(), "SUPER_ADMIN" | "DEPARTMENT_ADMIN" | "FIELD_OFFICIAL" | "VERIFICATION_OFFICER")
    });
    if !is_authorized {
        return Err(AppError::Forbidden("Operation requires official or administrator authorization".to_string()));
    }
    Ok(())
}

fn require_not_auditor(user: &AuthenticatedUser) -> Result<(), AppError> {
    if user.roles.iter().any(|r| r == "AUDITOR") && !user.roles.iter().any(|r| r == "SUPER_ADMIN" || r == "DEPARTMENT_ADMIN") {
        return Err(AppError::Forbidden("Auditors hold read-only oversight permissions".to_string()));
    }
    Ok(())
}

// 1. Schemes
pub async fn list_schemes_handler(
    State(state): State<AppState>,
    Query(query): Query<SchemeFilterQuery>,
    _user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let schemes = SchemeService::list_schemes(&state.pool, query.scope.as_deref(), query.status.as_deref()).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: schemes })))
}

pub async fn create_scheme_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    Json(payload): Json<CreateSchemeRequest>,
) -> Result<impl IntoResponse, AppError> {
    require_admin_or_officer(&user)?;
    let scheme = SchemeService::create_scheme(&state.pool, payload, user.id).await?;
    Ok((StatusCode::CREATED, Json(ApiResponse { data: scheme })))
}

pub async fn get_scheme_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    _user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let scheme = SchemeService::get_scheme_by_id(&state.pool, id).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: scheme })))
}

pub async fn patch_scheme_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    user: AuthenticatedUser,
    Json(payload): Json<UpdateSchemeRequest>,
) -> Result<impl IntoResponse, AppError> {
    require_admin_or_officer(&user)?;
    let scheme = SchemeService::update_scheme(&state.pool, id, payload, user.id).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: scheme })))
}

// 2. Rules
pub async fn list_scheme_rules_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    _user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let rules = SchemeService::list_rules_for_scheme(&state.pool, id).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: rules })))
}

pub async fn create_scheme_rule_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    user: AuthenticatedUser,
    Json(payload): Json<CreateSchemeRuleRequest>,
) -> Result<impl IntoResponse, AppError> {
    require_admin_or_officer(&user)?;
    let rule = SchemeService::create_scheme_rule(&state.pool, id, payload).await?;
    Ok((StatusCode::CREATED, Json(ApiResponse { data: rule })))
}

pub async fn patch_scheme_rule_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    user: AuthenticatedUser,
    Json(payload): Json<UpdateSchemeRuleRequest>,
) -> Result<impl IntoResponse, AppError> {
    require_admin_or_officer(&user)?;
    let rule = SchemeService::update_scheme_rule(&state.pool, id, payload).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: rule })))
}

// 3. Applications
pub async fn list_applications_handler(
    State(state): State<AppState>,
    Query(query): Query<ApplicationFilterQuery>,
    user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let page = query.page.unwrap_or(1);
    let limit = query.limit.unwrap_or(50);
    let apps = ApplicationService::list_applications(
        &state.pool,
        &user,
        query.status.as_deref(),
        query.scheme_id,
        query.applicant_id,
        page,
        limit,
    ).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: apps })))
}

pub async fn create_application_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    Json(payload): Json<CreateApplicationRequest>,
) -> Result<impl IntoResponse, AppError> {
    require_not_auditor(&user)?;
    let app = ApplicationService::create_application(&state.pool, payload, user.id).await?;
    Ok((StatusCode::CREATED, Json(ApiResponse { data: app })))
}

pub async fn get_application_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    _user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let app = ApplicationService::get_application_by_id(&state.pool, id).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: app })))
}

pub async fn assess_application_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    _user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let assessment = EligibilityEngine::evaluate_application(&state.pool, id).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: assessment })))
}

pub async fn submit_application_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    require_not_auditor(&user)?;
    let app = ApplicationService::submit_application(&state.pool, id, user.id).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: app })))
}

pub async fn approve_application_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    require_admin_or_officer(&user)?;
    let benefit = ApplicationService::approve_application(&state.pool, id, user.id).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: benefit })))
}

pub async fn patch_application_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    user: AuthenticatedUser,
    Json(payload): Json<UpdateApplicationRequest>,
) -> Result<impl IntoResponse, AppError> {
    require_not_auditor(&user)?;
    let app = ApplicationService::update_application(&state.pool, id, payload, user.id).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: app })))
}

pub async fn assign_application_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    user: AuthenticatedUser,
    Json(payload): Json<AssignApplicationRequest>,
) -> Result<impl IntoResponse, AppError> {
    require_admin_or_officer(&user)?;
    let app = ApplicationService::assign_application(&state.pool, id, payload, user.id).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: app })))
}

pub async fn request_evidence_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    user: AuthenticatedUser,
    Json(payload): Json<RequestEvidenceRequest>,
) -> Result<impl IntoResponse, AppError> {
    require_admin_or_officer(&user)?;
    let app = ApplicationService::request_evidence(&state.pool, id, payload, user.id).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: app })))
}

pub async fn submit_evidence_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    user: AuthenticatedUser,
    Json(payload): Json<SubmitEvidenceRequest>,
) -> Result<impl IntoResponse, AppError> {
    require_not_auditor(&user)?;
    let app = ApplicationService::submit_evidence(&state.pool, id, payload, user.id).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: app })))
}

pub async fn verify_application_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    user: AuthenticatedUser,
    Json(payload): Json<VerifyApplicationRequest>,
) -> Result<impl IntoResponse, AppError> {
    require_admin_or_officer(&user)?;
    let app = ApplicationService::verify_application(&state.pool, id, payload, user.id).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: app })))
}

pub async fn reject_application_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    user: AuthenticatedUser,
    Json(payload): Json<RejectApplicationRequest>,
) -> Result<impl IntoResponse, AppError> {
    require_admin_or_officer(&user)?;
    let app = ApplicationService::reject_application(&state.pool, id, payload, user.id).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: app })))
}

pub async fn list_notifications_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let notifs = NotificationService::list_notifications(&state.pool, user.id).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: notifs })))
}

pub async fn mark_notification_read_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    NotificationService::mark_as_read(&state.pool, id, user.id).await?;
    Ok((StatusCode::OK, Json(MessageResponse { message: "Notification marked as read".to_string() })))
}

// 4. Benefits
pub async fn list_benefits_handler(
    State(state): State<AppState>,
    Query(query): Query<BenefitFilterQuery>,
    user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let page = query.page.unwrap_or(1);
    let limit = query.limit.unwrap_or(50);
    let benefits = BenefitService::list_benefits(
        &state.pool,
        &user,
        query.scheme_id,
        query.scope.as_deref(),
        query.status.as_deref(),
        query.unit_id,
        page,
        limit,
    ).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: benefits })))
}

pub async fn get_benefit_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    _user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let benefit = BenefitService::get_benefit_by_id(&state.pool, id).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: benefit })))
}

pub async fn disburse_benefit_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    require_admin_or_officer(&user)?;
    let benefit = BenefitService::disburse_benefit(&state.pool, id, user.id).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: benefit })))
}

pub async fn get_person_benefits_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    _user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let benefits = BenefitService::get_person_benefits(&state.pool, id).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: benefits })))
}

pub async fn get_household_benefits_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    _user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let benefits = BenefitService::get_household_benefits(&state.pool, id).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: benefits })))
}

pub async fn get_property_benefits_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    _user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let benefits = BenefitService::get_property_benefits(&state.pool, id).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: benefits })))
}

pub async fn dashboard_stats_handler(
    State(state): State<AppState>,
    _user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let stats = BenefitService::get_dashboard_stats(&state.pool).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: stats })))
}

// ============================================================================
// V4 Entity Resolution & Duplicate Benefit Intelligence Handlers
// ============================================================================

#[derive(serde::Deserialize)]
pub struct ListERCaseParams {
    pub status: Option<String>,
    pub priority: Option<String>,
    pub page: Option<i64>,
    pub limit: Option<i64>,
}

#[derive(serde::Deserialize)]
pub struct ListDuplicateParams {
    pub status: Option<String>,
    pub priority: Option<String>,
    pub page: Option<i64>,
    pub limit: Option<i64>,
}

pub async fn create_er_case_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    Json(payload): Json<CreateERCaseRequest>,
) -> Result<impl IntoResponse, AppError> {
    let res = EntityResolutionService::create_case(&state.pool, &user, payload).await?;
    Ok((StatusCode::CREATED, Json(ApiResponse { data: res })))
}

pub async fn list_er_cases_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    Query(params): Query<ListERCaseParams>,
) -> Result<impl IntoResponse, AppError> {
    let res = EntityResolutionService::list_cases(
        &state.pool,
        &user,
        params.status.as_deref(),
        params.priority.as_deref(),
        params.page.unwrap_or(1),
        params.limit.unwrap_or(20),
    ).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: res })))
}

pub async fn get_er_case_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    Path(id): Path<Uuid>,
) -> Result<impl IntoResponse, AppError> {
    let res = EntityResolutionService::get_case_by_id(&state.pool, &user, id).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: res })))
}

pub async fn resolve_er_case_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    Path(id): Path<Uuid>,
    Json(payload): Json<ResolveERCaseRequest>,
) -> Result<impl IntoResponse, AppError> {
    let res = EntityResolutionService::resolve_case(&state.pool, &user, id, payload).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: res })))
}

pub async fn get_er_candidates_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    Path(id): Path<Uuid>,
) -> Result<impl IntoResponse, AppError> {
    let case = EntityResolutionService::get_case_by_id(&state.pool, &user, id).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: case.candidates })))
}

pub async fn get_er_candidate_evidence_handler(
    State(state): State<AppState>,
    _user: AuthenticatedUser,
    Path(cand_id): Path<Uuid>,
) -> Result<impl IntoResponse, AppError> {
    let rows = sqlx::query(
        r#"
        SELECT id, candidate_id, field, source_value, candidate_value,
               comparison_method, comparison_result, similarity, weight,
               direction, explanation, created_at
        FROM entity_resolution_evidence
        WHERE candidate_id = $1
        ORDER BY created_at ASC
        "#,
    )
    .bind(cand_id)
    .fetch_all(&state.pool)
    .await?;

    let mut evidence = Vec::new();
    for er in rows {
        evidence.push(crate::domain::entity_resolution::models::EntityResolutionEvidence {
            id: sqlx::Row::get(&er, "id"),
            candidate_id: sqlx::Row::get(&er, "candidate_id"),
            field: sqlx::Row::get(&er, "field"),
            source_value: sqlx::Row::get(&er, "source_value"),
            candidate_value: sqlx::Row::get(&er, "candidate_value"),
            comparison_method: sqlx::Row::get(&er, "comparison_method"),
            comparison_result: sqlx::Row::get(&er, "comparison_result"),
            similarity: sqlx::Row::get(&er, "similarity"),
            weight: sqlx::Row::get(&er, "weight"),
            direction: sqlx::Row::get(&er, "direction"),
            explanation: sqlx::Row::get(&er, "explanation"),
            created_at: sqlx::Row::get(&er, "created_at"),
        });
    }

    Ok((StatusCode::OK, Json(ApiResponse { data: evidence })))
}

pub async fn create_benefit_duplicate_check_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    Json(payload): Json<CheckBenefitDuplicateRequest>,
) -> Result<impl IntoResponse, AppError> {
    let res = BenefitDuplicateService::check_application_duplicates(&state.pool, &user, payload).await?;
    Ok((StatusCode::CREATED, Json(ApiResponse { data: res })))
}

pub async fn list_benefit_duplicate_cases_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    Query(params): Query<ListDuplicateParams>,
) -> Result<impl IntoResponse, AppError> {
    let res = BenefitDuplicateService::list_duplicate_cases(
        &state.pool,
        &user,
        params.status.as_deref(),
        params.priority.as_deref(),
        params.page.unwrap_or(1),
        params.limit.unwrap_or(20),
    ).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: res })))
}

pub async fn get_benefit_duplicate_case_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    Path(id): Path<Uuid>,
) -> Result<impl IntoResponse, AppError> {
    let res = BenefitDuplicateService::get_duplicate_case_by_id(&state.pool, &user, id).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: res })))
}

pub async fn decide_benefit_duplicate_case_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    Path(id): Path<Uuid>,
    Json(payload): Json<BenefitDuplicateDecisionRequest>,
) -> Result<impl IntoResponse, AppError> {
    let res = BenefitDuplicateService::record_decision(&state.pool, &user, id, payload).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: res })))
}

pub async fn get_matching_config_handler(
    State(state): State<AppState>,
    _user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let res = EntityResolutionService::get_active_config(&state.pool).await;
    Ok((StatusCode::OK, Json(ApiResponse { data: res })))
}

// ============================================================================
// V5 DOCUMENT INTELLIGENCE & EVIDENCE HANDLERS
// ============================================================================

fn decode_base64_payload(input: &str) -> Result<Vec<u8>, AppError> {
    let clean = input.trim();
    let b64 = if let Some(idx) = clean.find(";base64,") {
        &clean[idx + 8..]
    } else {
        clean
    };

    const CHARS: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let mut table = [255u8; 256];
    for (i, &c) in CHARS.iter().enumerate() {
        table[c as usize] = i as u8;
    }

    let mut out = Vec::new();
    let mut buf = 0u32;
    let mut bits = 0;

    for &byte in b64.as_bytes() {
        if byte == b'=' || byte.is_ascii_whitespace() {
            continue;
        }
        let val = table[byte as usize];
        if val == 255 {
            return Err(AppError::Validation("Invalid character in base64 file data".into()));
        }
        buf = (buf << 6) | (val as u32);
        bits += 6;
        if bits >= 8 {
            bits -= 8;
            out.push((buf >> bits) as u8);
        }
    }
    Ok(out)
}

#[derive(Deserialize)]
pub struct UploadDocumentJsonRequest {
    pub filename: String,
    pub original_filename: Option<String>,
    pub owner_type: String,
    pub owner_id: Uuid,
    pub specified_doc_type: Option<String>,
    pub access_purpose: Option<String>,
    pub file_content_base64: Option<String>,
    pub original_file_content_base64: Option<String>,
    pub original_file_mime_type: Option<String>,
    pub text_content: Option<String>,
    pub document_demo_type: Option<String>,
}

#[derive(Deserialize)]
pub struct ReplaceDocumentJsonRequest {
    pub filename: String,
    pub original_filename: Option<String>,
    pub specified_doc_type: Option<String>,
    pub file_content_base64: String,
    pub original_file_content_base64: Option<String>,
    pub original_file_mime_type: Option<String>,
}

#[derive(Deserialize)]
pub struct LinkApplicationDocumentRequest {
    pub document_id: Uuid,
    pub document_version_id: Uuid,
    pub required_type: String,
}

pub async fn link_application_document_handler(
    State(state): State<AppState>,
    Path(application_id): Path<Uuid>,
    user: AuthenticatedUser,
    Json(payload): Json<LinkApplicationDocumentRequest>,
) -> Result<impl IntoResponse, AppError> {
    let owns_application = sqlx::query_scalar::<_, bool>("SELECT EXISTS(SELECT 1 FROM applications WHERE id = $1 AND created_by = $2)")
        .bind(application_id).bind(user.id).fetch_one(&state.pool).await?;
    let is_super_admin = user.roles.iter().any(|role| role == "SUPER_ADMIN");
    let is_department_admin = user.roles.iter().any(|role| role == "DEPARTMENT_ADMIN");
    let department_scope = if is_department_admin {
        if let Some(org_id) = user.organization_id {
            sqlx::query_scalar::<_, bool>(
                "SELECT EXISTS(SELECT 1 FROM applications a JOIN user_organizations uo ON uo.user_id = a.created_by WHERE a.id = $1 AND uo.organization_id = $2)",
            ).bind(application_id).bind(org_id).fetch_one(&state.pool).await?
        } else { false }
    } else { false };
    let is_assigned_officer = sqlx::query_scalar::<_, bool>(
        "SELECT EXISTS(SELECT 1 FROM applications WHERE id = $1 AND metadata->'assignment'->>'assigned_to' = $2)",
    ).bind(application_id).bind(user.id.to_string()).fetch_one(&state.pool).await?;
    if !owns_application && !is_super_admin && !department_scope && !is_assigned_officer { return Err(AppError::Forbidden("You cannot attach documents to this application.".into())); }
    let service = crate::application::DocumentService::new(state.pool.clone(), "data/storage").await?;
    service.get_document(payload.document_id, &user, "APPLICATION_VERIFICATION", None, None).await?;
    let version_matches = sqlx::query_scalar::<_, bool>(
        "SELECT EXISTS(SELECT 1 FROM documents WHERE id = $1 AND (id = $2 OR supersedes_document_id = $2))",
    ).bind(payload.document_version_id).bind(payload.document_id).fetch_one(&state.pool).await?;
    if !version_matches { return Err(AppError::Validation("The selected document version does not belong to this document.".into())); }
    let row = sqlx::query(
        "INSERT INTO application_documents (application_id, document_id, document_version_id, required_type, linked_by) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (application_id, document_id, document_version_id) DO UPDATE SET required_type = EXCLUDED.required_type RETURNING id, application_id, document_id, document_version_id, required_type, status, linked_by, linked_at",
    ).bind(application_id).bind(payload.document_id).bind(payload.document_version_id).bind(&payload.required_type).bind(user.id)
        .fetch_one(&state.pool).await?;
    sqlx::query("INSERT INTO audit_events (event_type, user_id, organization_id, request_id, details) VALUES ('DOCUMENT_LINKED', $1, $2, $3, $4)")
        .bind(user.id).bind(user.organization_id).bind(&user.request_id)
        .bind(serde_json::json!({"document_id": payload.document_id, "version_id": payload.document_version_id, "application_id": application_id, "required_type": payload.required_type}))
        .execute(&state.pool).await?;
    Ok((StatusCode::CREATED, Json(ApiResponse { data: serde_json::json!({
        "id": row.try_get::<Uuid, _>("id")?,
        "application_id": row.try_get::<Uuid, _>("application_id")?,
        "document_id": row.try_get::<Uuid, _>("document_id")?,
        "document_version_id": row.try_get::<Uuid, _>("document_version_id")?,
        "required_type": row.try_get::<String, _>("required_type")?,
        "status": row.try_get::<String, _>("status")?,
        "linked_by": row.try_get::<Uuid, _>("linked_by")?,
        "linked_at": row.try_get::<chrono::DateTime<chrono::Utc>, _>("linked_at")?,
    }) })))
}

#[derive(Deserialize)]
pub struct DocumentListQuery {
    pub owner_type: Option<String>,
    pub owner_id: Option<Uuid>,
}

#[derive(Deserialize)]
pub struct DocumentAccessQuery {
    pub purpose: Option<String>,
}

async fn optimize_pdf_if_useful(source: Vec<u8>) -> Result<(Vec<u8>, Option<Vec<u8>>), AppError> {
    use crate::domain::document::file_type_registry::{MAX_FILE_SIZE_BYTES, PDF_COMPRESSION_THRESHOLD_BYTES};
    if source.len() <= PDF_COMPRESSION_THRESHOLD_BYTES || !source.starts_with(b"%PDF-") {
        return Ok((source, None));
    }
    if source.windows(8).any(|window| window == b"/Encrypt") {
        return Err(AppError::Validation("Password-protected PDF files are not supported. Remove the password and try again.".into()));
    }
    // Rewriting digitally signed PDFs can invalidate their signatures, so keep their exact bytes.
    if source.windows(9).any(|window| window == b"/ByteRange") {
        if source.len() > MAX_FILE_SIZE_BYTES as usize {
            return Err(AppError::Validation("This signed PDF is larger than 25 MB and cannot be safely optimized without invalidating its signature.".into()));
        }
        return Ok((source, None));
    }

    let output_path = std::env::temp_dir().join(format!("mira-pdf-{}.pdf", Uuid::new_v4()));
    let mut child = match Command::new("gs")
        .args(["-dSAFER", "-dBATCH", "-dNOPAUSE", "-dQUIET", "-sDEVICE=pdfwrite", "-dCompatibilityLevel=1.7", "-dPDFSETTINGS=/prepress", "-dDetectDuplicateImages=true", "-dCompressFonts=true"])
        .arg(format!("-sOutputFile={}", output_path.display()))
        .stdin(Stdio::piped()).stdout(Stdio::null()).stderr(Stdio::null()).spawn()
    {
        Ok(child) => child,
        Err(_) if source.len() <= MAX_FILE_SIZE_BYTES as usize => return Ok((source, None)),
        Err(_) => return Err(AppError::Validation("Automatic PDF optimization is unavailable. This PDF exceeds 25 MB; choose a smaller file or retry when document processing is available.".into())),
    };
    if let Some(mut stdin) = child.stdin.take() {
        stdin.write_all(&source).await.map_err(|e| AppError::Internal(format!("Unable to pass PDF to optimizer: {e}")))?;
    }
    let result = child.wait().await;
    let output = if result.map(|status| status.success()).unwrap_or(false) {
        tokio::fs::read(&output_path).await.ok()
    } else { None };
    let _ = tokio::fs::remove_file(&output_path).await;
    if let Some(optimized) = output.filter(|bytes| bytes.len() < source.len() && bytes.starts_with(b"%PDF-")) {
        return Ok((optimized, Some(source)));
    }
    if source.len() <= MAX_FILE_SIZE_BYTES as usize { Ok((source, None)) }
    else { Err(AppError::Validation("Automatic PDF optimization could not reduce this file below 25 MB. The original was preserved; choose a smaller PDF and retry.".into())) }
}

pub async fn upload_document_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    headers: HeaderMap,
    Json(payload): Json<UploadDocumentJsonRequest>,
) -> Result<impl IntoResponse, AppError> {
    let doc_service = crate::application::DocumentService::new(state.pool.clone(), "data/storage").await?;
    let ip = get_client_ip(&headers).map(|s| s.to_string());
    let ua = headers.get("user-agent").and_then(|h| h.to_str().ok()).map(|s| s.to_string());

    let raw_bytes = if let Some(ref b64) = payload.file_content_base64 {
        decode_base64_payload(b64)?
    } else if let Some(ref txt) = payload.text_content {
        txt.as_bytes().to_vec()
    } else if let Some(ref demo_type) = payload.document_demo_type {
        crate::domain::document::ocr::generate_fallback_ocr_text_from_filename(demo_type).into_bytes()
    } else {
        crate::domain::document::ocr::generate_fallback_ocr_text_from_filename(&payload.filename).into_bytes()
    };
    let (bytes, original_bytes) = if payload.filename.to_lowercase().ends_with(".pdf") {
        optimize_pdf_if_useful(raw_bytes).await?
    } else { (raw_bytes, None) };

    let upload_payload = crate::application::UploadDocumentPayload {
        raw_filename: payload.filename.clone(),
        display_filename: payload.original_filename,
        owner_type: payload.owner_type,
        owner_id: payload.owner_id,
        specified_doc_type: payload.specified_doc_type,
        access_purpose: payload.access_purpose.unwrap_or_else(|| "APPLICATION_VERIFICATION".to_string()),
    };

    let browser_original = payload.original_file_content_base64.as_deref().map(decode_base64_payload).transpose()?;
    let retained_original = original_bytes.as_deref().or(browser_original.as_deref());
    let source_mime = if original_bytes.is_some() { Some("application/pdf") } else { payload.original_file_mime_type.as_deref() };
    let doc = doc_service.upload_and_process_document(upload_payload, &bytes, retained_original, source_mime, &user, ip, ua).await?;
    Ok((StatusCode::CREATED, Json(ApiResponse { data: doc })))
}

pub async fn list_documents_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    Query(query): Query<DocumentListQuery>,
) -> Result<impl IntoResponse, AppError> {
    let doc_service = crate::application::DocumentService::new(state.pool.clone(), "data/storage").await?;
    let docs = doc_service.list_documents(&user, query.owner_type.as_deref(), query.owner_id).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: docs })))
}

pub async fn get_document_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    Path(id): Path<Uuid>,
    Query(query): Query<DocumentAccessQuery>,
    headers: HeaderMap,
) -> Result<impl IntoResponse, AppError> {
    let doc_service = crate::application::DocumentService::new(state.pool.clone(), "data/storage").await?;
    let ip = get_client_ip(&headers).map(|s| s.to_string());
    let ua = headers.get("user-agent").and_then(|h| h.to_str().ok()).map(|s| s.to_string());
    let purpose = query.purpose.unwrap_or_else(|| "APPLICATION_VERIFICATION".to_string());

    let doc = doc_service.get_document(id, &user, &purpose, ip, ua).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: doc })))
}

pub async fn download_document_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    Path(id): Path<Uuid>,
    Query(query): Query<DocumentAccessQuery>,
    headers: HeaderMap,
) -> Result<impl IntoResponse, AppError> {
    let doc_service = crate::application::DocumentService::new(state.pool.clone(), "data/storage").await?;
    let ip = get_client_ip(&headers).map(|s| s.to_string());
    let ua = headers.get("user-agent").and_then(|h| h.to_str().ok()).map(|s| s.to_string());
    let purpose = query.purpose.unwrap_or_else(|| "APPLICATION_VERIFICATION".to_string());

    let (doc, bytes) = doc_service.download_document_binary(id, &user, &purpose, ip, ua).await?;

    let mut response_headers = HeaderMap::new();
    response_headers.insert(
        axum::http::header::CONTENT_TYPE,
        doc.detected_mime_type.parse().unwrap_or(axum::http::HeaderValue::from_static("application/octet-stream")),
    );
    response_headers.insert(
        axum::http::header::CONTENT_DISPOSITION,
        format!("attachment; filename=\"{}\"", doc.original_filename.chars().map(|character| if character.is_ascii_alphanumeric() || matches!(character, '.' | '-' | '_' | ' ') { character } else { '_' }).collect::<String>())
            .parse().map_err(|_| AppError::Internal("Unable to prepare a safe download filename.".into()))?,
    );
    response_headers.insert(
        axum::http::header::CONTENT_LENGTH,
        bytes.len().to_string().parse().unwrap(),
    );

    Ok((StatusCode::OK, response_headers, bytes))
}

pub async fn preview_document_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    Path(id): Path<Uuid>,
    Query(query): Query<DocumentAccessQuery>,
    headers: HeaderMap,
) -> Result<impl IntoResponse, AppError> {
    let doc_service = crate::application::DocumentService::new(state.pool.clone(), "data/storage").await?;
    let ip = get_client_ip(&headers).map(|s| s.to_string());
    let ua = headers.get("user-agent").and_then(|h| h.to_str().ok()).map(|s| s.to_string());
    let purpose = query.purpose.unwrap_or_else(|| "CITIZEN_SELF_SERVICE".to_string());

    let (doc, bytes) = doc_service.download_document_binary(id, &user, &purpose, ip, ua).await?;

    let mut response_headers = HeaderMap::new();
    response_headers.insert(
        axum::http::header::CONTENT_TYPE,
        doc.detected_mime_type.parse().unwrap_or(axum::http::HeaderValue::from_static("application/octet-stream")),
    );

    Ok((StatusCode::OK, response_headers, bytes))
}

pub async fn replace_document_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    user: AuthenticatedUser,
    headers: HeaderMap,
    Json(payload): Json<ReplaceDocumentJsonRequest>,
) -> Result<impl IntoResponse, AppError> {
    let service = crate::application::DocumentService::new(state.pool.clone(), "data/storage").await?;
    let ip = get_client_ip(&headers).map(str::to_owned);
    let ua = headers.get("user-agent").and_then(|h| h.to_str().ok()).map(str::to_owned);
    let prior = service.get_document(id, &user, "CITIZEN_SELF_SERVICE", ip.clone(), ua.clone()).await?;
    if prior.created_by != Some(user.id) && prior.owner_id != user.id {
        return Err(AppError::Forbidden("Only the document owner can replace this file.".into()));
    }
    let raw_bytes = decode_base64_payload(&payload.file_content_base64)?;
    let (bytes, original_bytes) = if payload.filename.to_lowercase().ends_with(".pdf") {
        optimize_pdf_if_useful(raw_bytes).await?
    } else { (raw_bytes, None) };
    let browser_original = payload.original_file_content_base64.as_deref().map(decode_base64_payload).transpose()?;
    let retained_original = original_bytes.as_deref().or(browser_original.as_deref());
    let source_mime = if original_bytes.is_some() { Some("application/pdf") } else { payload.original_file_mime_type.as_deref() };
    let replacement = service.upload_and_process_document(
        crate::application::UploadDocumentPayload {
            raw_filename: payload.filename.clone(),
            display_filename: payload.original_filename,
            owner_type: prior.owner_type.clone(),
            owner_id: prior.owner_id,
            specified_doc_type: payload.specified_doc_type.or(Some(prior.document_type.clone())),
            access_purpose: "CITIZEN_SELF_SERVICE".to_string(),
        },
        &bytes,
        retained_original,
        source_mime,
        &user,
        ip,
        ua,
    ).await?;
    if replacement.id != prior.id && replacement.supersedes_document_id.is_none() {
        sqlx::query("UPDATE documents SET supersedes_document_id = $1, version_number = $2 WHERE id = $3")
            .bind(prior.id)
            .bind(prior.version_number + 1)
            .bind(replacement.id)
            .execute(&state.pool)
            .await
            .map_err(|e| AppError::Internal(format!("Failed to record document version: {e}")))?;
        sqlx::query("INSERT INTO audit_events (event_type, user_id, organization_id, request_id, details) VALUES ('DOCUMENT_REPLACED', $1, $2, $3, $4)")
            .bind(user.id).bind(user.organization_id).bind(&user.request_id)
            .bind(serde_json::json!({"document_id": prior.id, "previous_version": prior.version_number, "new_version_id": replacement.id, "version": prior.version_number + 1}))
            .execute(&state.pool).await?;
        sqlx::query("INSERT INTO audit_events (event_type, user_id, organization_id, request_id, details) VALUES ('DOCUMENT_VERSION_CREATED', $1, $2, $3, $4)")
            .bind(user.id).bind(user.organization_id).bind(&user.request_id)
            .bind(serde_json::json!({"document_id": replacement.id, "supersedes_document_id": prior.id, "version": prior.version_number + 1}))
            .execute(&state.pool).await?;
        let updated = service.get_document(replacement.id, &user, "CITIZEN_SELF_SERVICE", None, None).await?;
        return Ok((StatusCode::CREATED, Json(ApiResponse { data: updated })));
    }
    Ok((StatusCode::OK, Json(ApiResponse { data: replacement })))
}

pub async fn document_versions_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let service = crate::application::DocumentService::new(state.pool.clone(), "data/storage").await?;
    service.get_document(id, &user, "CITIZEN_SELF_SERVICE", None, None).await?;
    let docs = sqlx::query_as::<_, crate::domain::document::models::Document>(
        r#"WITH RECURSIVE root AS (
               SELECT id, supersedes_document_id FROM documents WHERE id = $1
               UNION ALL
               SELECT parent.id, parent.supersedes_document_id
               FROM documents parent JOIN root child ON child.supersedes_document_id = parent.id
           ), family AS (
               SELECT id FROM root WHERE supersedes_document_id IS NULL
               UNION ALL
               SELECT child.id FROM documents child JOIN family parent ON child.supersedes_document_id = parent.id
           )
           SELECT d.* FROM documents d JOIN family f ON f.id = d.id ORDER BY d.version_number ASC"#,
    )
    .bind(id)
    .fetch_all(&state.pool)
    .await
    .map_err(|e| AppError::Internal(format!("Failed to load document history: {e}")))?;
    Ok((StatusCode::OK, Json(ApiResponse { data: docs })))
}

pub async fn document_applications_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    user: AuthenticatedUser,
) -> Result<impl IntoResponse, AppError> {
    let service = crate::application::DocumentService::new(state.pool.clone(), "data/storage").await?;
    service.get_document(id, &user, "CITIZEN_SELF_SERVICE", None, None).await?;
    let rows = sqlx::query(
        r#"SELECT a.id AS application_id, a.public_id, a.application_number, a.status,
                  s.name AS scheme_name, ad.required_type, ad.linked_at, ad.document_version_id
           FROM application_documents ad
           JOIN applications a ON a.id = ad.application_id
           JOIN schemes s ON s.id = a.scheme_id
           WHERE ad.document_id = $1 ORDER BY ad.linked_at DESC"#,
    ).bind(id).fetch_all(&state.pool).await?;
    let mut data = Vec::new();
    for row in rows {
        let app_id: Uuid = row.try_get("application_id").unwrap_or_default();
        let pub_id: String = row.try_get("public_id").unwrap_or_default();
        let app_num: String = row.try_get("application_number").unwrap_or_default();
        let status: String = row.try_get("status").unwrap_or_default();
        let scheme_name: String = row.try_get("scheme_name").unwrap_or_default();
        let req_type: String = row.try_get("required_type").unwrap_or_default();
        let linked_at: Option<chrono::DateTime<chrono::Utc>> = row.try_get("linked_at").ok();
        let doc_ver_id: Option<Uuid> = row.try_get("document_version_id").ok();
        data.push(serde_json::json!({
            "application_id": app_id,
            "public_id": pub_id,
            "application_number": app_num,
            "status": status,
            "scheme_name": scheme_name,
            "required_type": req_type,
            "linked_at": linked_at,
            "document_version_id": doc_ver_id,
        }));
    }
    Ok((StatusCode::OK, Json(ApiResponse { data })))
}

pub async fn archive_document_handler(
    State(state): State<AppState>,
    Path(id): Path<Uuid>,
    user: AuthenticatedUser,
    headers: HeaderMap,
) -> Result<impl IntoResponse, AppError> {
    let service = crate::application::DocumentService::new(state.pool.clone(), "data/storage").await?;
    let archived = service.archive_document(
        id,
        &user,
        get_client_ip(&headers).map(str::to_owned),
        headers.get("user-agent").and_then(|h| h.to_str().ok()).map(str::to_owned),
    ).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: archived })))
}

pub async fn get_document_extractions_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    Path(id): Path<Uuid>,
) -> Result<impl IntoResponse, AppError> {
    let doc_service = crate::application::DocumentService::new(state.pool.clone(), "data/storage").await?;
    doc_service.get_document(id, &user, "CITIZEN_SELF_SERVICE", None, None).await?;
    let extractions = doc_service.get_extractions(id).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: extractions })))
}

pub async fn verify_extraction_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    Path(id): Path<Uuid>,
    Json(payload): Json<crate::application::ExtractionVerificationPayload>,
) -> Result<impl IntoResponse, AppError> {
    let doc_service = crate::application::DocumentService::new(state.pool.clone(), "data/storage").await?;
    let verification = doc_service.verify_extraction(id, payload, &user).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: verification })))
}

pub async fn get_case_evidence_pack_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    Path(id): Path<Uuid>,
) -> Result<impl IntoResponse, AppError> {
    let doc_service = crate::application::DocumentService::new(state.pool.clone(), "data/storage").await?;
    let pack = doc_service.get_case_evidence_pack(id, &user).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: pack })))
}

pub async fn get_case_consistency_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    Path(id): Path<Uuid>,
) -> Result<impl IntoResponse, AppError> {
    let doc_service = crate::application::DocumentService::new(state.pool.clone(), "data/storage").await?;
    let pack = doc_service.get_case_evidence_pack(id, &user).await?;
    Ok((StatusCode::OK, Json(ApiResponse { data: pack.consistency_report })))
}

pub async fn get_case_evidence_report_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    Path(id): Path<Uuid>,
) -> Result<impl IntoResponse, AppError> {
    let doc_service = crate::application::DocumentService::new(state.pool.clone(), "data/storage").await?;
    let pack = doc_service.get_case_evidence_pack(id, &user).await?;

    let report = serde_json::json!({
        "case_id": pack.case_id,
        "public_id": pack.case_public_id,
        "scheme": pack.scheme_name,
        "applicant": pack.applicant_name,
        "why_flagged": pack.why_flagged,
        "recommended_action": pack.recommended_action,
        "ai_grounded_summary": pack.ai_summary,
        "documents_count": pack.documents.len(),
        "extractions": pack.extractions.iter().map(|e| {
            serde_json::json!({
                "field": e.field,
                "value": e.value,
                "confidence": e.confidence,
                "status": e.status
            })
        }).collect::<Vec<_>>(),
        "conflicts": pack.consistency_report.checks.iter().filter(|c| c.result == "CONFLICT").collect::<Vec<_>>(),
        "timeline": pack.timeline,
        "generated_at": pack.generated_at
    });

    Ok((StatusCode::OK, Json(ApiResponse { data: report })))
}

// ============================================================================
// Router Builder
// ============================================================================

pub fn create_router(state: AppState) -> Router {
    Router::new()
        // Health
        .route("/api/v1/health", get(health_handler))

        // Authentication
        .route("/api/v1/auth/register", post(register_handler))
        .route("/api/v1/auth/login", post(login_handler))
        .route("/api/v1/auth/demo-login", post(demo_login_handler))
        .route("/api/v1/auth/logout", post(logout_handler))
        .route("/api/v1/auth/me", get(me_handler))

        // User Profile & Isolation
        .route("/api/v1/profile", get(profile_handler))
        .route("/api/v1/profile/family", get(get_my_family_handler))
        .route("/api/v1/profile/family/members", post(add_my_family_member_handler))
        .route("/api/v1/profile/family/events", post(report_my_family_event_handler))
        .route("/api/v1/profile/family/disputes", post(raise_my_family_dispute_handler))
        .route("/api/v1/profile/:id", get(profile_by_id_handler))
        .route("/api/v1/profile/preferences", put(update_preferences_handler))

        // Audit Trail
        .route("/api/v1/audit/events", get(audit_events_handler))

        // V2 Persons
        .route("/api/v1/persons", get(list_persons_handler).post(create_person_handler))
        .route("/api/v1/persons/:id", get(get_person_handler).patch(patch_person_handler))
        .route("/api/v1/persons/:id/relationships", get(get_person_relationships_handler).post(create_person_relationship_handler))
        .route("/api/v1/persons/:id/households", get(get_person_households_handler))
        .route("/api/v1/persons/:id/properties", get(get_person_properties_handler))
        .route("/api/v1/persons/:id/benefits", get(get_person_benefits_handler))

        // V2 Households
        .route("/api/v1/households", get(list_households_handler).post(create_household_handler))
        .route("/api/v1/households/split", post(split_household_handler))
        .route("/api/v1/households/:id", get(get_household_handler).patch(patch_household_handler))
        .route("/api/v1/households/:id/members", get(get_household_members_handler).post(add_household_member_handler))
        .route("/api/v1/households/:id/properties", get(get_household_properties_handler))
        .route("/api/v1/households/:id/timeline", get(get_household_timeline_handler))
        .route("/api/v1/households/:id/benefits", get(get_household_benefits_handler))

        // V2 Properties
        .route("/api/v1/properties", get(list_properties_handler).post(create_property_handler))
        .route("/api/v1/properties/associations", post(create_property_association_handler))
        .route("/api/v1/properties/:id", get(get_property_handler))
        .route("/api/v1/properties/:id/benefits", get(get_property_benefits_handler))

        // V2 Graphs
        .route("/api/v1/graph/person/:id", get(get_person_graph_handler))
        .route("/api/v1/graph/household/:id", get(get_household_graph_handler))

        // V3 Schemes
        .route("/api/v1/schemes", get(list_schemes_handler).post(create_scheme_handler))
        .route("/api/v1/schemes/:id", get(get_scheme_handler).patch(patch_scheme_handler))
        .route("/api/v1/schemes/:id/rules", get(list_scheme_rules_handler).post(create_scheme_rule_handler))
        .route("/api/v1/scheme-rules/:id", patch(patch_scheme_rule_handler))

        // V3 Applications & Assessment
        .route("/api/v1/applications", get(list_applications_handler).post(create_application_handler))
        .route("/api/v1/applications/:id", get(get_application_handler).patch(patch_application_handler))
        .route("/api/v1/applications/:id/assess", post(assess_application_handler))
        .route("/api/v1/applications/:id/submit", post(submit_application_handler))
        .route("/api/v1/applications/:id/assign", post(assign_application_handler))
        .route("/api/v1/applications/:id/request-evidence", post(request_evidence_handler))
        .route("/api/v1/applications/:id/submit-evidence", post(submit_evidence_handler))
        .route("/api/v1/applications/:id/verify", post(verify_application_handler))
        .route("/api/v1/applications/:id/approve", post(approve_application_handler))
        .route("/api/v1/applications/:id/reject", post(reject_application_handler))

        // Notifications
        .route("/api/v1/notifications", get(list_notifications_handler))
        .route("/api/v1/notifications/:id/read", post(mark_notification_read_handler))

        // V3 Benefits & Dashboard
        .route("/api/v1/benefits", get(list_benefits_handler))
        .route("/api/v1/benefits/:id", get(get_benefit_handler))
        .route("/api/v1/benefits/:id/disburse", post(disburse_benefit_handler))
        .route("/api/v1/dashboard/stats", get(dashboard_stats_handler))

        // V4 Entity Resolution
        .route("/api/v1/entity-resolution/cases", get(list_er_cases_handler).post(create_er_case_handler))
        .route("/api/v1/entity-resolution/cases/:id", get(get_er_case_handler))
        .route("/api/v1/entity-resolution/cases/:id/resolve", post(resolve_er_case_handler))
        .route("/api/v1/entity-resolution/cases/:id/candidates", get(get_er_candidates_handler))
        .route("/api/v1/entity-resolution/candidates/:id/evidence", get(get_er_candidate_evidence_handler))

        // V4 Duplicate Benefit Intelligence
        .route("/api/v1/benefit-duplicate-checks", get(list_benefit_duplicate_cases_handler).post(create_benefit_duplicate_check_handler))
        .route("/api/v1/benefit-duplicate-checks/:id", get(get_benefit_duplicate_case_handler))
        .route("/api/v1/benefit-duplicate-checks/:id/decision", post(decide_benefit_duplicate_case_handler))

        // V4 Matching Configuration
        .route("/api/v1/matching-config", get(get_matching_config_handler))

        // V5 Document Intelligence & Evidence
        .route("/api/v1/documents", get(list_documents_handler).post(upload_document_handler))
        .route("/api/v1/documents/:id", get(get_document_handler).delete(archive_document_handler))
        .route("/api/v1/documents/:id/download", get(download_document_handler))
        .route("/api/v1/documents/:id/preview", get(preview_document_handler))
        .route("/api/v1/documents/:id/replace", post(replace_document_handler))
        .route("/api/v1/documents/:id/versions", get(document_versions_handler))
        .route("/api/v1/documents/:id/applications", get(document_applications_handler))
        .route("/api/v1/applications/:id/documents", post(link_application_document_handler))
        .route("/api/v1/documents/:id/extractions", get(get_document_extractions_handler))
        .route("/api/v1/documents/:id/verify-extraction", post(verify_extraction_handler))
        .route("/api/v1/cases/:id/evidence-pack", get(get_case_evidence_pack_handler))
        .route("/api/v1/cases/:id/document-consistency", get(get_case_consistency_handler))
        .route("/api/v1/cases/:id/evidence-report", get(get_case_evidence_report_handler))
        
        // Mira AI Secure Assistant (Groq-powered & Role-authorized)
        .route("/api/v1/ai/chat", post(crate::ai::ai_chat_handler))

        .layer(axum::Extension(state.config.clone()))
        .layer(DefaultBodyLimit::max(72 * 1024 * 1024))
        .with_state(state)
}

