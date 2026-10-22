use std::sync::Arc;
use axum::{
    body::Body,
    http::{header, Method, Request, StatusCode},
};
use http_body_util::BodyExt;
use mira_api::{
    api::{create_router, AppState},
    config::AppConfig,
    database::{create_pool, run_migrations, seed_database, DEMO_PASSWORD},
};
use serde_json::Value;
use tower::ServiceExt;

async fn setup_test_app() -> (axum::Router, sqlx::PgPool, AppConfig) {
    let mut config = AppConfig::from_env();
    config.database_url = "postgres://postgres@127.0.0.1:5433/mira_test".to_string();

    let pool = create_pool(&config.database_url)
        .await
        .expect("Failed to connect to test database");

    run_migrations(&pool).await.expect("Migrations failed");
    seed_database(&pool).await.expect("Seed failed");

    let state = AppState {
        pool: pool.clone(),
        config: Arc::new(config.clone()),
    };

    let router = create_router(state);
    (router, pool, config)
}

#[tokio::test]
async fn test_health_check() {
    let (app, _, _) = setup_test_app().await;

    let response = app
        .oneshot(
            Request::builder()
                .uri("/api/v1/health")
                .method(Method::GET)
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);
    let bytes = response.into_body().collect().await.unwrap().to_bytes();
    let body: Value = serde_json::from_slice(&bytes).unwrap();

    assert_eq!(body["data"]["status"], "healthy");
    assert_eq!(body["data"]["database_connected"], true);
    assert_eq!(body["data"]["api_version"], "v1");
}

#[tokio::test]
async fn test_demo_user_authentication_flow() {
    let (app, _, _) = setup_test_app().await;

    // Login as seeded demo citizen
    let login_payload = serde_json::json!({
        "email": "citizen@mira.local",
        "password": DEMO_PASSWORD
    });

    let response = app.clone()
        .oneshot(
            Request::builder()
                .uri("/api/v1/auth/login")
                .method(Method::POST)
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(serde_json::to_vec(&login_payload).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);
    let bytes = response.into_body().collect().await.unwrap().to_bytes();
    let body: Value = serde_json::from_slice(&bytes).unwrap();

    let token = body["token"].as_str().expect("Token should be present");
    assert!(!token.is_empty());
    assert_eq!(body["user"]["email"], "citizen@mira.local");

    // Access protected /api/v1/auth/me
    let me_response = app.clone()
        .oneshot(
            Request::builder()
                .uri("/api/v1/auth/me")
                .method(Method::GET)
                .header(header::AUTHORIZATION, format!("Bearer {}", token))
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(me_response.status(), StatusCode::OK);
    let me_bytes = me_response.into_body().collect().await.unwrap().to_bytes();
    let me_body: Value = serde_json::from_slice(&me_bytes).unwrap();
    assert_eq!(me_body["data"]["email"], "citizen@mira.local");
}

#[tokio::test]
async fn test_mandatory_multi_user_isolation_and_idor_protection() {
    let (app, _, _) = setup_test_app().await;

    // Register User A
    let user_a_email = format!("user_a_{}@mira.local", uuid::Uuid::new_v4());
    let reg_a_payload = serde_json::json!({
        "email": user_a_email,
        "password": "Password123!",
        "display_name": "Citizen User A"
    });

    let res_a = app.clone()
        .oneshot(
            Request::builder()
                .uri("/api/v1/auth/register")
                .method(Method::POST)
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(serde_json::to_vec(&reg_a_payload).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(res_a.status(), StatusCode::CREATED);
    let body_a: Value = serde_json::from_slice(&res_a.into_body().collect().await.unwrap().to_bytes()).unwrap();
    let token_a = body_a["token"].as_str().unwrap();
    let user_a_id = body_a["user"]["id"].as_str().unwrap();

    // Register User B
    let user_b_email = format!("user_b_{}@mira.local", uuid::Uuid::new_v4());
    let reg_b_payload = serde_json::json!({
        "email": user_b_email,
        "password": "Password123!",
        "display_name": "Citizen User B"
    });

    let res_b = app.clone()
        .oneshot(
            Request::builder()
                .uri("/api/v1/auth/register")
                .method(Method::POST)
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(serde_json::to_vec(&reg_b_payload).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(res_b.status(), StatusCode::CREATED);
    let body_b: Value = serde_json::from_slice(&res_b.into_body().collect().await.unwrap().to_bytes()).unwrap();
    let user_b_id = body_b["user"]["id"].as_str().unwrap();

    // 1. User A accesses their OWN profile by ID -> MUST SUCCEED (200 OK)
    let self_access_res = app.clone()
        .oneshot(
            Request::builder()
                .uri(format!("/api/v1/profile/{}", user_a_id))
                .method(Method::GET)
                .header(header::AUTHORIZATION, format!("Bearer {}", token_a))
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(self_access_res.status(), StatusCode::OK);

    // 2. User A attempts to access User B's profile by ID -> MUST BE FORBIDDEN (403 FORBIDDEN)
    // Mandatory IDOR test
    let idor_attempt_res = app.clone()
        .oneshot(
            Request::builder()
                .uri(format!("/api/v1/profile/{}", user_b_id))
                .method(Method::GET)
                .header(header::AUTHORIZATION, format!("Bearer {}", token_a))
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(idor_attempt_res.status(), StatusCode::FORBIDDEN);
    let err_bytes = idor_attempt_res.into_body().collect().await.unwrap().to_bytes();
    let err_body: Value = serde_json::from_slice(&err_bytes).unwrap();

    assert_eq!(err_body["error"]["code"], "FORBIDDEN");
    assert!(err_body["error"]["message"].as_str().unwrap().contains("insufficient permissions"));
    assert!(err_body["error"]["request_id"].is_string());
}

#[tokio::test]
async fn test_profile_preference_and_language_update() {
    let (app, _, _) = setup_test_app().await;

    // Login as demo citizen
    let login_payload = serde_json::json!({
        "email": "citizen@mira.local",
        "password": DEMO_PASSWORD
    });

    let res = app.clone()
        .oneshot(
            Request::builder()
                .uri("/api/v1/auth/login")
                .method(Method::POST)
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(serde_json::to_vec(&login_payload).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();

    let body: Value = serde_json::from_slice(&res.into_body().collect().await.unwrap().to_bytes()).unwrap();
    let token = body["token"].as_str().unwrap();

    // Update preferred language to Hindi ('hi') and display name
    let update_payload = serde_json::json!({
        "display_name": "Rajesh Kumar (Citizen)",
        "preferred_language": "hi"
    });

    let update_res = app.clone()
        .oneshot(
            Request::builder()
                .uri("/api/v1/profile/preferences")
                .method(Method::PUT)
                .header(header::AUTHORIZATION, format!("Bearer {}", token))
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(serde_json::to_vec(&update_payload).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(update_res.status(), StatusCode::OK);
    let updated_body: Value = serde_json::from_slice(&update_res.into_body().collect().await.unwrap().to_bytes()).unwrap();
    assert_eq!(updated_body["data"]["preferred_language"], "hi");

    // Attempt to set invalid language 'fr' -> validation error
    let invalid_lang_payload = serde_json::json!({
        "preferred_language": "fr"
    });

    let invalid_res = app.clone()
        .oneshot(
            Request::builder()
                .uri("/api/v1/profile/preferences")
                .method(Method::PUT)
                .header(header::AUTHORIZATION, format!("Bearer {}", token))
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(serde_json::to_vec(&invalid_lang_payload).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(invalid_res.status(), StatusCode::UNPROCESSABLE_ENTITY);
}

#[tokio::test]
async fn test_role_based_audit_access() {
    let (app, _, _) = setup_test_app().await;

    // Login as Citizen
    let citizen_login = serde_json::json!({
        "email": "citizen@mira.local",
        "password": DEMO_PASSWORD
    });

    let res = app.clone()
        .oneshot(
            Request::builder()
                .uri("/api/v1/auth/login")
                .method(Method::POST)
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(serde_json::to_vec(&citizen_login).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();
    let body: Value = serde_json::from_slice(&res.into_body().collect().await.unwrap().to_bytes()).unwrap();
    let citizen_token = body["token"].as_str().unwrap();

    // Citizen tries to access audit events -> 403 Forbidden
    let audit_res = app.clone()
        .oneshot(
            Request::builder()
                .uri("/api/v1/audit/events")
                .method(Method::GET)
                .header(header::AUTHORIZATION, format!("Bearer {}", citizen_token))
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(audit_res.status(), StatusCode::FORBIDDEN);

    // Login as Auditor
    let auditor_login = serde_json::json!({
        "email": "auditor@mira.local",
        "password": DEMO_PASSWORD
    });
    let a_res = app.clone()
        .oneshot(
            Request::builder()
                .uri("/api/v1/auth/login")
                .method(Method::POST)
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(serde_json::to_vec(&auditor_login).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();
    let a_body: Value = serde_json::from_slice(&a_res.into_body().collect().await.unwrap().to_bytes()).unwrap();
    let auditor_token = a_body["token"].as_str().unwrap();

    // Auditor accesses audit events -> 200 OK
    let auditor_access_res = app.clone()
        .oneshot(
            Request::builder()
                .uri("/api/v1/audit/events")
                .method(Method::GET)
                .header(header::AUTHORIZATION, format!("Bearer {}", auditor_token))
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(auditor_access_res.status(), StatusCode::OK);
}
