use std::sync::Arc;
use axum::{
    extract::{Path, Query, State},
    http::{HeaderMap, StatusCode},
    response::IntoResponse,
    routing::{get, patch, post, put},
    Json, Router,
};
use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    application::{
        AddHouseholdMemberRequest, ApplicationService, AuditService, AuthService, BenefitDuplicateDecisionRequest,
        BenefitDuplicateService, BenefitService, CheckBenefitDuplicateRequest, CreateApplicationRequest,
        CreateERCaseRequest, CreateHouseholdRequest, CreatePersonRequest, CreatePropertyAssociationRequest,
        CreatePropertyRequest, CreateRelationshipRequest, CreateSchemeRequest, CreateSchemeRuleRequest,
        EligibilityEngine, EntityResolutionService, GraphService, HealthService, HouseholdService,
        LoginRequest, PersonService, ProfileService, PropertyService, RegisterRequest, ResolveERCaseRequest,
        SchemeService, SplitHouseholdRequest, UpdateHouseholdRequest, UpdatePersonRequest,
        UpdatePreferencesRequest, UpdateSchemeRequest, UpdateSchemeRuleRequest,
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
    pub owner_type: String,
    pub owner_id: Uuid,
    pub specified_doc_type: Option<String>,
    pub access_purpose: Option<String>,
    pub file_content_base64: Option<String>,
    pub text_content: Option<String>,
    pub document_demo_type: Option<String>,
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

pub async fn upload_document_handler(
    State(state): State<AppState>,
    user: AuthenticatedUser,
    headers: HeaderMap,
    Json(payload): Json<UploadDocumentJsonRequest>,
) -> Result<impl IntoResponse, AppError> {
    let doc_service = crate::application::DocumentService::new(state.pool.clone(), "data/storage").await?;
    let ip = get_client_ip(&headers).map(|s| s.to_string());
    let ua = headers.get("user-agent").and_then(|h| h.to_str().ok()).map(|s| s.to_string());

    let bytes = if let Some(ref b64) = payload.file_content_base64 {
        decode_base64_payload(b64)?
    } else if let Some(ref txt) = payload.text_content {
        txt.as_bytes().to_vec()
    } else if let Some(ref demo_type) = payload.document_demo_type {
        crate::domain::document::ocr::generate_fallback_ocr_text_from_filename(demo_type).into_bytes()
    } else {
        crate::domain::document::ocr::generate_fallback_ocr_text_from_filename(&payload.filename).into_bytes()
    };

    let upload_payload = crate::application::UploadDocumentPayload {
        raw_filename: payload.filename,
        owner_type: payload.owner_type,
        owner_id: payload.owner_id,
        specified_doc_type: payload.specified_doc_type,
        access_purpose: payload.access_purpose.unwrap_or_else(|| "APPLICATION_VERIFICATION".to_string()),
    };

    let doc = doc_service.upload_and_process_document(upload_payload, &bytes, &user, ip, ua).await?;
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
        format!("attachment; filename=\"{}\"", doc.original_filename).parse().unwrap(),
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

pub async fn get_document_extractions_handler(
    State(state): State<AppState>,
    _user: AuthenticatedUser,
    Path(id): Path<Uuid>,
) -> Result<impl IntoResponse, AppError> {
    let doc_service = crate::application::DocumentService::new(state.pool.clone(), "data/storage").await?;
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
        .route("/api/v1/auth/logout", post(logout_handler))
        .route("/api/v1/auth/me", get(me_handler))

        // User Profile & Isolation
        .route("/api/v1/profile", get(profile_handler))
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
        .route("/api/v1/applications/:id", get(get_application_handler))
        .route("/api/v1/applications/:id/assess", post(assess_application_handler))
        .route("/api/v1/applications/:id/submit", post(submit_application_handler))
        .route("/api/v1/applications/:id/approve", post(approve_application_handler))

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
        .route("/api/v1/documents/:id", get(get_document_handler))
        .route("/api/v1/documents/:id/download", get(download_document_handler))
        .route("/api/v1/documents/:id/preview", get(preview_document_handler))
        .route("/api/v1/documents/:id/extractions", get(get_document_extractions_handler))
        .route("/api/v1/documents/:id/verify-extraction", post(verify_extraction_handler))
        .route("/api/v1/cases/:id/evidence-pack", get(get_case_evidence_pack_handler))
        .route("/api/v1/cases/:id/document-consistency", get(get_case_consistency_handler))
        .route("/api/v1/cases/:id/evidence-report", get(get_case_evidence_report_handler))

        .layer(axum::Extension(state.config.clone()))
        .with_state(state)
}

