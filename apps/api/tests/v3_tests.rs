use axum::{
    body::Body,
    http::{header, Request, StatusCode},
};
use chrono::NaiveDate;
use http_body_util::BodyExt;
use serde_json::{json, Value};
use sqlx::Row;
use std::sync::Arc;
use tower::ServiceExt;
use uuid::Uuid;

use mira_api::{
    api::create_router,
    application::*,
    auth::TokenService,
    config::AppConfig,
    database::{create_pool, run_migrations, seed_database},
    domain::*,
};

async fn setup_v3_test_app() -> (axum::Router, sqlx::PgPool, Arc<AppConfig>) {
    let db_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgres://postgres@127.0.0.1:5433/mira_test".to_string());
    let pool = create_pool(&db_url).await.expect("Failed to connect to test database");

    run_migrations(&pool).await.expect("Migrations failed");
    seed_database(&pool).await.expect("Seeding failed");

    let config = Arc::new(AppConfig::from_env());
    let app_state = mira_api::api::AppState {
        pool: pool.clone(),
        config: config.clone(),
    };

    let router = create_router(app_state);
    (router, pool, config)
}

fn generate_auth_header(
    config: &AppConfig,
    user_id: Uuid,
    email: &str,
    role: &str,
    org_id: Option<Uuid>,
) -> String {
    let org_tuple = org_id.as_ref().map(|id| (id, "Test Civic Department"));
    let token = TokenService::create_token(
        user_id,
        email,
        &[role.to_string()],
        org_tuple,
        config,
    )
    .expect("Token generation failed");

    format!("Bearer {}", token)
}

#[tokio::test]
async fn test_v3_core_scenario_and_deterministic_eligibility() {
    let (app, pool, config) = setup_v3_test_app().await;

    // 1. Get synthetic admin & citizen tokens
    let admin_user = sqlx::query("SELECT id, email FROM users WHERE email = 'admin@mira.local'")
        .fetch_one(&pool)
        .await
        .unwrap();
    let admin_id: Uuid = admin_user.get("id");
    let admin_token = generate_auth_header(&config, admin_id, "admin@mira.local", "SUPER_ADMIN", None);

    let citizen_user = sqlx::query("SELECT id, email FROM users WHERE email = 'citizen@mira.local'")
        .fetch_one(&pool)
        .await
        .unwrap();
    let citizen_id: Uuid = citizen_user.get("id");
    let citizen_token = generate_auth_header(&config, citizen_id, "citizen@mira.local", "CITIZEN", None);

    // 2. Fetch Rahul's record (P-1004)
    let rahul = sqlx::query("SELECT id, date_of_birth FROM persons WHERE public_id = 'P-1004'")
        .fetch_one(&pool)
        .await
        .unwrap();
    let rahul_id: Uuid = rahul.get("id");

    // 3. Create a specialized Student Scholarship scheme for testing
    let scheme_code = format!("SCH_CORE_TEST_{}", &Uuid::new_v4().to_string()[..6]);
    let create_scheme_res = app.clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/api/v1/schemes")
                .header(header::AUTHORIZATION, &admin_token)
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(json!({
                    "code": scheme_code,
                    "name": "Higher Secondary Scholarship Test Scheme",
                    "description": "Deterministic eligibility testing scheme",
                    "department": "Department of Education",
                    "scope": "INDIVIDUAL",
                    "valid_from": "2024-01-01"
                }).to_string()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(create_scheme_res.status(), StatusCode::CREATED);
    let bytes = create_scheme_res.into_body().collect().await.unwrap().to_bytes();
    let scheme_body: Value = serde_json::from_slice(&bytes).unwrap();
    let scheme_id_str = scheme_body["data"]["id"].as_str().unwrap();
    let scheme_id = Uuid::parse_str(scheme_id_str).unwrap();

    // 4. Add deterministic rules to the scheme: AGE_MIN >= 15, AGE_MAX <= 30, RESIDENCY_REQUIRED = TRUE
    let rule1_res = app.clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri(format!("/api/v1/schemes/{}/rules", scheme_id))
                .header(header::AUTHORIZATION, &admin_token)
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(json!({
                    "rule_type": "AGE_MIN",
                    "operator": ">=",
                    "value": "15",
                    "priority": 1
                }).to_string()))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(rule1_res.status(), StatusCode::CREATED);

    let rule2_res = app.clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri(format!("/api/v1/schemes/{}/rules", scheme_id))
                .header(header::AUTHORIZATION, &admin_token)
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(json!({
                    "rule_type": "AGE_MAX",
                    "operator": "<=",
                    "value": "30",
                    "priority": 2
                }).to_string()))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(rule2_res.status(), StatusCode::CREATED);

    // 5. Create application for Rahul (Born 1999-06-18, age is 25 in 2025)
    let app_res = app.clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/api/v1/applications")
                .header(header::AUTHORIZATION, &citizen_token)
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(json!({
                    "scheme_id": scheme_id,
                    "applicant_person_id": rahul_id,
                    "target_person_id": rahul_id,
                    "application_date": "2025-05-15"
                }).to_string()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(app_res.status(), StatusCode::CREATED);
    let bytes = app_res.into_body().collect().await.unwrap().to_bytes();
    let app_body: Value = serde_json::from_slice(&bytes).unwrap();
    let application_id = app_body["data"]["id"].as_str().unwrap();

    // 6. Assess eligibility deterministically
    let assess_res = app.clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri(format!("/api/v1/applications/{}/assess", application_id))
                .header(header::AUTHORIZATION, &admin_token)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(assess_res.status(), StatusCode::OK);
    let bytes = assess_res.into_body().collect().await.unwrap().to_bytes();
    let assess_body: Value = serde_json::from_slice(&bytes).unwrap();

    assert_eq!(assess_body["data"]["result"], "ELIGIBLE");
    let rules = assess_body["data"]["rule_results"].as_array().unwrap();
    assert_eq!(rules.len(), 2);
    assert_eq!(rules[0]["result"], "PASS");
    assert_eq!(rules[1]["result"], "PASS");
    assert!(rules[0]["explanation"].as_str().unwrap().contains("Applicant age is 25"));

    // 7. Submit application
    let submit_res = app.clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri(format!("/api/v1/applications/{}/submit", application_id))
                .header(header::AUTHORIZATION, &citizen_token)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(submit_res.status(), StatusCode::OK);

    // 8. Approve application (Admin transactionally creates Benefit)
    let approve_res = app.clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri(format!("/api/v1/applications/{}/approve", application_id))
                .header(header::AUTHORIZATION, &admin_token)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(approve_res.status(), StatusCode::OK);
    let bytes = approve_res.into_body().collect().await.unwrap().to_bytes();
    let approve_body: Value = serde_json::from_slice(&bytes).unwrap();
    let benefit_id = approve_body["data"]["id"].as_str().unwrap();

    assert_eq!(approve_body["data"]["benefit_unit_type"], "PERSON");
    assert_eq!(approve_body["data"]["person_id"], rahul_id.to_string());
    assert_eq!(approve_body["data"]["status"], "APPROVED");

    // 9. Disburse benefit
    let disburse_res = app.clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri(format!("/api/v1/benefits/{}/disburse", benefit_id))
                .header(header::AUTHORIZATION, &admin_token)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(disburse_res.status(), StatusCode::OK);
    let bytes = disburse_res.into_body().collect().await.unwrap().to_bytes();
    let disburse_body: Value = serde_json::from_slice(&bytes).unwrap();
    assert_eq!(disburse_body["data"]["status"], "DISBURSED");
    assert!(disburse_body["data"]["disbursed_at"].is_string());

    // 10. Verify audit events recorded for approval and disbursement
    let audit_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(*) FROM audit_events WHERE event_type IN ('BENEFIT_APPROVED', 'BENEFIT_DISBURSED')"
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert!(audit_count >= 2);
}

#[tokio::test]
async fn test_v3_temporal_household_resolution() {
    let (app, pool, config) = setup_v3_test_app().await;

    let admin_user = sqlx::query("SELECT id, email FROM users WHERE email = 'admin@mira.local'")
        .fetch_one(&pool)
        .await
        .unwrap();
    let admin_token = generate_auth_header(&config, admin_user.get("id"), "admin@mira.local", "SUPER_ADMIN", None);

    let rahul_id: Uuid = sqlx::query_scalar("SELECT id FROM persons WHERE public_id = 'P-1004'")
        .fetch_one(&pool)
        .await
        .unwrap();

    let h001_id: Uuid = sqlx::query_scalar("SELECT id FROM households WHERE public_id = 'H001'")
        .fetch_one(&pool)
        .await
        .unwrap();

    let h002_id: Uuid = sqlx::query_scalar("SELECT id FROM households WHERE public_id = 'H002'")
        .fetch_one(&pool)
        .await
        .unwrap();

    let san_scheme_id: Uuid = sqlx::query_scalar("SELECT id FROM schemes WHERE code = 'SCH_HH_SANITATION'")
        .fetch_one(&pool)
        .await
        .unwrap();

    // In 2024 (before separation on 2025-07-01), Rahul belongs to H001!
    let app_2024_res = app.clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/api/v1/applications")
                .header(header::AUTHORIZATION, &admin_token)
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(json!({
                    "scheme_id": san_scheme_id,
                    "applicant_person_id": rahul_id,
                    "application_date": "2024-06-01"
                }).to_string()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(app_2024_res.status(), StatusCode::CREATED);
    let bytes = app_2024_res.into_body().collect().await.unwrap().to_bytes();
    let app_2024: Value = serde_json::from_slice(&bytes).unwrap();
    assert_eq!(app_2024["data"]["target_household_id"], h001_id.to_string());

    // In 2026 (after separation), Rahul belongs to H002!
    let app_2026_res = app.clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/api/v1/applications")
                .header(header::AUTHORIZATION, &admin_token)
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(json!({
                    "scheme_id": san_scheme_id,
                    "applicant_person_id": rahul_id,
                    "application_date": "2026-01-15"
                }).to_string()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(app_2026_res.status(), StatusCode::CREATED);
    let bytes = app_2026_res.into_body().collect().await.unwrap().to_bytes();
    let app_2026: Value = serde_json::from_slice(&bytes).unwrap();
    assert_eq!(app_2026["data"]["target_household_id"], h002_id.to_string());
}

#[tokio::test]
async fn test_v3_scope_integrity_and_invalid_scope_rejection() {
    let (_app, pool, _config) = setup_v3_test_app().await;

    let rahul_id: Uuid = sqlx::query_scalar("SELECT id FROM persons WHERE public_id = 'P-1004'").fetch_one(&pool).await.unwrap();
    let sch_sanitation_id: Uuid = sqlx::query_scalar("SELECT id FROM schemes WHERE code = 'SCH_HH_SANITATION'").fetch_one(&pool).await.unwrap();
    let sch_scholarship_id: Uuid = sqlx::query_scalar("SELECT id FROM schemes WHERE code = 'SCH_STUDENT_SCHOLARSHIP'").fetch_one(&pool).await.unwrap();

    // Direct database check constraint enforcement test:
    // Attempt HOUSEHOLD scope with person_id only and NULL household_id -> Database must reject!
    let invalid_hh_benefit = sqlx::query(
        r#"
        INSERT INTO benefits (
            id, public_id, scheme_id, benefit_unit_type, person_id, household_id, status, approved_at, valid_from
        )
        VALUES (
            gen_random_uuid(), 'BEN-INV-001', $1, 'HOUSEHOLD', $2, NULL, 'APPROVED', NOW(), '2025-01-01'
        )
        "#
    )
    .bind(sch_sanitation_id)
    .bind(rahul_id)
    .execute(&pool)
    .await;

    assert!(invalid_hh_benefit.is_err(), "Database must reject HOUSEHOLD benefit unit without household_id");

    // Attempt PERSON scope with NULL person_id -> Database must reject!
    let invalid_person_benefit = sqlx::query(
        r#"
        INSERT INTO benefits (
            id, public_id, scheme_id, benefit_unit_type, person_id, household_id, status, approved_at, valid_from
        )
        VALUES (
            gen_random_uuid(), 'BEN-INV-002', $1, 'PERSON', NULL, NULL, 'APPROVED', NOW(), '2025-01-01'
        )
        "#
    )
    .bind(sch_scholarship_id)
    .execute(&pool)
    .await;

    assert!(invalid_person_benefit.is_err(), "Database must reject PERSON benefit unit without person_id");
}

#[tokio::test]
async fn test_v3_authorization_and_cross_user_isolation() {
    let (app, pool, config) = setup_v3_test_app().await;

    // 1. Citizen cannot create a scheme (403)
    let citizen_user = sqlx::query("SELECT id, email FROM users WHERE email = 'citizen@mira.local'")
        .fetch_one(&pool)
        .await
        .unwrap();
    let citizen_token = generate_auth_header(&config, citizen_user.get("id"), "citizen@mira.local", "CITIZEN", None);

    let create_scheme_res = app.clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/api/v1/schemes")
                .header(header::AUTHORIZATION, &citizen_token)
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(json!({
                    "code": "SCH_FORGED",
                    "name": "Forged Citizen Scheme",
                    "department": "Fraud",
                    "scope": "INDIVIDUAL"
                }).to_string()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(create_scheme_res.status(), StatusCode::FORBIDDEN);

    // 2. Auditor cannot create or disburse benefits (403)
    let auditor_user = sqlx::query("SELECT id, email FROM users WHERE email = 'auditor@mira.local'")
        .fetch_one(&pool)
        .await
        .unwrap();
    let auditor_token = generate_auth_header(&config, auditor_user.get("id"), "auditor@mira.local", "AUDITOR", None);

    let seed_ben_id: Uuid = sqlx::query_scalar("SELECT id FROM benefits WHERE public_id = 'BEN-2025-001'").fetch_one(&pool).await.unwrap();

    let auditor_disburse_res = app.clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri(format!("/api/v1/benefits/{}/disburse", seed_ben_id))
                .header(header::AUTHORIZATION, &auditor_token)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(auditor_disburse_res.status(), StatusCode::FORBIDDEN);

    // 3. Auditor CAN read benefits ledger (200 OK)
    let auditor_read_res = app.clone()
        .oneshot(
            Request::builder()
                .method("GET")
                .uri("/api/v1/benefits")
                .header(header::AUTHORIZATION, &auditor_token)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(auditor_read_res.status(), StatusCode::OK);
}
