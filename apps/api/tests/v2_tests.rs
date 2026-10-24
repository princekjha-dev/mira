use axum::{
    body::Body,
    http::{header, Method, Request, StatusCode},
};
use chrono::NaiveDate;
use http_body_util::BodyExt;
use mira_api::{
    api::{create_router, AppState},
    config::AppConfig,
    database::{create_pool, run_migrations, seed_database, DEMO_PASSWORD},
};
use serde_json::Value;
use std::sync::Arc;
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

async fn get_auth_token(app: &axum::Router, email: &str, password: &str) -> String {
    let login_payload = serde_json::json!({
        "email": email,
        "password": password
    });

    let res = app
        .clone()
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

    assert_eq!(res.status(), StatusCode::OK);
    let bytes = res.into_body().collect().await.unwrap().to_bytes();
    let body: Value = serde_json::from_slice(&bytes).unwrap();
    body["token"].as_str().unwrap().to_string()
}

#[tokio::test]
async fn test_mandatory_v2_temporal_household_scenario() {
    let (app, pool, _) = setup_test_app().await;
    let admin_token = get_auth_token(&app, "admin@mira.local", DEMO_PASSWORD).await;

    // 1. Create Rahul
    let rahul_req = serde_json::json!({
        "public_id": format!("P-RAHUL-{}", uuid::Uuid::new_v4().to_string()[..4].to_uppercase()),
        "first_name": "Rahul",
        "last_name": "Kumar",
        "date_of_birth": "1999-06-18",
        "gender": "Male"
    });
    let res = app
        .clone()
        .oneshot(
            Request::builder()
                .uri("/api/v1/persons")
                .method(Method::POST)
                .header(header::AUTHORIZATION, format!("Bearer {}", admin_token))
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(serde_json::to_vec(&rahul_req).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::CREATED);
    let rahul_body: Value =
        serde_json::from_slice(&res.into_body().collect().await.unwrap().to_bytes()).unwrap();
    let rahul_id = rahul_body["data"]["id"].as_str().unwrap().to_string();

    // 2. Create Amit
    let amit_req = serde_json::json!({
        "public_id": format!("P-AMIT-{}", uuid::Uuid::new_v4().to_string()[..4].to_uppercase()),
        "first_name": "Amit",
        "last_name": "Kumar",
        "date_of_birth": "1996-11-04",
        "gender": "Male"
    });
    let res = app
        .clone()
        .oneshot(
            Request::builder()
                .uri("/api/v1/persons")
                .method(Method::POST)
                .header(header::AUTHORIZATION, format!("Bearer {}", admin_token))
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(serde_json::to_vec(&amit_req).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::CREATED);
    let amit_body: Value =
        serde_json::from_slice(&res.into_body().collect().await.unwrap().to_bytes()).unwrap();
    let amit_id = amit_body["data"]["id"].as_str().unwrap().to_string();

    // 3. Create household H001
    let h001_req = serde_json::json!({
        "public_id": format!("HH-H001-{}", uuid::Uuid::new_v4().to_string()[..4].to_uppercase()),
        "name": "Kumar Family Household H001"
    });
    let res = app
        .clone()
        .oneshot(
            Request::builder()
                .uri("/api/v1/households")
                .method(Method::POST)
                .header(header::AUTHORIZATION, format!("Bearer {}", admin_token))
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(serde_json::to_vec(&h001_req).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::CREATED);
    let h001_body: Value =
        serde_json::from_slice(&res.into_body().collect().await.unwrap().to_bytes()).unwrap();
    let h001_id = h001_body["data"]["id"].as_str().unwrap().to_string();

    // 4. Add Rahul to H001 (effective 2018-01-01)
    let add_rahul_req = serde_json::json!({
        "person_id": rahul_id,
        "membership_role": "CHILD",
        "valid_from": "2018-01-01"
    });
    let res = app
        .clone()
        .oneshot(
            Request::builder()
                .uri(format!("/api/v1/households/{}/members", h001_id))
                .method(Method::POST)
                .header(header::AUTHORIZATION, format!("Bearer {}", admin_token))
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(serde_json::to_vec(&add_rahul_req).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::CREATED);

    // 5. Add Amit to H001 (effective 2020-01-01)
    let add_amit_req = serde_json::json!({
        "person_id": amit_id,
        "membership_role": "HEAD",
        "valid_from": "2020-01-01"
    });
    let res = app
        .clone()
        .oneshot(
            Request::builder()
                .uri(format!("/api/v1/households/{}/members", h001_id))
                .method(Method::POST)
                .header(header::AUTHORIZATION, format!("Bearer {}", admin_token))
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(serde_json::to_vec(&add_amit_req).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::CREATED);

    // 6. Create sibling relationship between Amit and Rahul
    let sib_req = serde_json::json!({
        "person_b_id": rahul_id,
        "relationship_type": "SIBLING",
        "valid_from": "1999-06-18"
    });
    let res = app
        .clone()
        .oneshot(
            Request::builder()
                .uri(format!("/api/v1/persons/{}/relationships", amit_id))
                .method(Method::POST)
                .header(header::AUTHORIZATION, format!("Bearer {}", admin_token))
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(serde_json::to_vec(&sib_req).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::CREATED);

    // 7 & 8. Move Rahul from H001 to H002 effective 2025-07-01 (Household Split)
    let split_req = serde_json::json!({
        "person_id": rahul_id,
        "current_household_id": h001_id,
        "effective_date": "2025-07-01",
        "new_household_name": "Rahul Independent Household H002",
        "new_household_public_id": format!("HH-H002-{}", uuid::Uuid::new_v4().to_string()[..4].to_uppercase())
    });
    let res = app
        .clone()
        .oneshot(
            Request::builder()
                .uri("/api/v1/households/split")
                .method(Method::POST)
                .header(header::AUTHORIZATION, format!("Bearer {}", admin_token))
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(serde_json::to_vec(&split_req).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::OK);
    let h002_body: Value =
        serde_json::from_slice(&res.into_body().collect().await.unwrap().to_bytes()).unwrap();
    let h002_id = h002_body["data"]["id"].as_str().unwrap().to_string();
    assert_ne!(h001_id, h002_id);

    // 9 & 10. Query Rahul in 2024 -> Assert H001
    let res = app
        .clone()
        .oneshot(
            Request::builder()
                .uri(format!(
                    "/api/v1/households?person={}&date=2024-06-01",
                    rahul_id
                ))
                .method(Method::GET)
                .header(header::AUTHORIZATION, format!("Bearer {}", admin_token))
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::OK);
    let q_2024_body: Value =
        serde_json::from_slice(&res.into_body().collect().await.unwrap().to_bytes()).unwrap();
    let hhs_2024 = q_2024_body["data"].as_array().unwrap();
    assert_eq!(
        hhs_2024.len(),
        1,
        "Rahul should belong to exactly 1 household in 2024"
    );
    assert_eq!(
        hhs_2024[0]["id"].as_str().unwrap(),
        h001_id,
        "In 2024, Rahul must belong to H001"
    );

    // 11 & 12. Query Rahul in 2026 -> Assert H002
    let res = app
        .clone()
        .oneshot(
            Request::builder()
                .uri(format!(
                    "/api/v1/households?person={}&date=2026-01-01",
                    rahul_id
                ))
                .method(Method::GET)
                .header(header::AUTHORIZATION, format!("Bearer {}", admin_token))
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::OK);
    let q_2026_body: Value =
        serde_json::from_slice(&res.into_body().collect().await.unwrap().to_bytes()).unwrap();
    let hhs_2026 = q_2026_body["data"].as_array().unwrap();
    assert_eq!(
        hhs_2026.len(),
        1,
        "Rahul should belong to exactly 1 household in 2026"
    );
    assert_eq!(
        hhs_2026[0]["id"].as_str().unwrap(),
        h002_id,
        "In 2026, Rahul must belong to H002"
    );

    // 13 & 14. Query H001 in 2024 -> Assert Rahul + Amit
    let res = app
        .clone()
        .oneshot(
            Request::builder()
                .uri(format!(
                    "/api/v1/households/{}/members?date=2024-06-01",
                    h001_id
                ))
                .method(Method::GET)
                .header(header::AUTHORIZATION, format!("Bearer {}", admin_token))
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::OK);
    let mems_2024_body: Value =
        serde_json::from_slice(&res.into_body().collect().await.unwrap().to_bytes()).unwrap();
    let mems_2024 = mems_2024_body["data"].as_array().unwrap();
    let mem_2024_ids: Vec<&str> = mems_2024
        .iter()
        .map(|m| m["person_id"].as_str().unwrap())
        .collect();
    assert!(
        mem_2024_ids.contains(&rahul_id.as_str()),
        "H001 in 2024 must include Rahul"
    );
    assert!(
        mem_2024_ids.contains(&amit_id.as_str()),
        "H001 in 2024 must include Amit"
    );

    // 15 & 16. Query H001 in 2026 -> Assert Amit only (Rahul departed)
    let res = app
        .clone()
        .oneshot(
            Request::builder()
                .uri(format!(
                    "/api/v1/households/{}/members?date=2026-01-01",
                    h001_id
                ))
                .method(Method::GET)
                .header(header::AUTHORIZATION, format!("Bearer {}", admin_token))
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::OK);
    let mems_2026_body: Value =
        serde_json::from_slice(&res.into_body().collect().await.unwrap().to_bytes()).unwrap();
    let mems_2026 = mems_2026_body["data"].as_array().unwrap();
    let mem_2026_ids: Vec<&str> = mems_2026
        .iter()
        .map(|m| m["person_id"].as_str().unwrap())
        .collect();
    assert!(
        !mem_2026_ids.contains(&rahul_id.as_str()),
        "H001 in 2026 must NOT include Rahul"
    );
    assert!(
        mem_2026_ids.contains(&amit_id.as_str()),
        "H001 in 2026 must include Amit"
    );

    // 17. Verify old relationship/history still exists
    let res = app
        .clone()
        .oneshot(
            Request::builder()
                .uri(format!("/api/v1/persons/{}/relationships", rahul_id))
                .method(Method::GET)
                .header(header::AUTHORIZATION, format!("Bearer {}", admin_token))
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::OK);
    let rel_body: Value =
        serde_json::from_slice(&res.into_body().collect().await.unwrap().to_bytes()).unwrap();
    let rels = rel_body["data"].as_array().unwrap();
    assert!(
        !rels.is_empty(),
        "Sibling relationship between Rahul and Amit must still exist"
    );

    // 18. Verify audit events were created
    let count: i64 = sqlx::query_scalar!(
        "SELECT count(*) FROM audit_events WHERE event_type IN ('PERSON_CREATED', 'HOUSEHOLD_CREATED', 'HOUSEHOLD_SPLIT')"
    )
    .fetch_one(&pool)
    .await
    .unwrap()
    .unwrap_or(0);

    assert!(count >= 3, "Audit events must record domain operations");
}

#[tokio::test]
async fn test_v2_cross_user_isolation_and_security() {
    let (app, _, _) = setup_test_app().await;

    // 1. Citizen registers
    let citizen_email = format!("citizen_sec_{}@mira.local", uuid::Uuid::new_v4());
    let reg_payload = serde_json::json!({
        "email": citizen_email,
        "password": "Password123!",
        "display_name": "Citizen Security Tester"
    });
    let res = app
        .clone()
        .oneshot(
            Request::builder()
                .uri("/api/v1/auth/register")
                .method(Method::POST)
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(serde_json::to_vec(&reg_payload).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();
    let reg_body: Value =
        serde_json::from_slice(&res.into_body().collect().await.unwrap().to_bytes()).unwrap();
    let citizen_token = reg_body["token"].as_str().unwrap();

    // 2. Admin creates a private person record for someone else
    let admin_token = get_auth_token(&app, "admin@mira.local", DEMO_PASSWORD).await;
    let person_req = serde_json::json!({
        "public_id": format!("P-SEC-{}", uuid::Uuid::new_v4().to_string()[..4].to_uppercase()),
        "first_name": "Confidential",
        "last_name": "Citizen",
        "email": "confidential@other.local"
    });
    let res = app
        .clone()
        .oneshot(
            Request::builder()
                .uri("/api/v1/persons")
                .method(Method::POST)
                .header(header::AUTHORIZATION, format!("Bearer {}", admin_token))
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(serde_json::to_vec(&person_req).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res.status(), StatusCode::CREATED);
    let p_body: Value =
        serde_json::from_slice(&res.into_body().collect().await.unwrap().to_bytes()).unwrap();
    let private_person_id = p_body["data"]["id"].as_str().unwrap();

    // 3. Citizen attempts to read other citizen's private person record -> MUST BE 403 FORBIDDEN
    let res = app
        .clone()
        .oneshot(
            Request::builder()
                .uri(format!("/api/v1/persons/{}", private_person_id))
                .method(Method::GET)
                .header(header::AUTHORIZATION, format!("Bearer {}", citizen_token))
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(
        res.status(),
        StatusCode::FORBIDDEN,
        "Citizen cannot read another person's record"
    );

    // 4. Auditor attempts to MUTATE domain data -> MUST BE 403 FORBIDDEN (Read-only guarantee)
    let auditor_token = get_auth_token(&app, "auditor@mira.local", DEMO_PASSWORD).await;
    let res = app
        .clone()
        .oneshot(
            Request::builder()
                .uri("/api/v1/persons")
                .method(Method::POST)
                .header(header::AUTHORIZATION, format!("Bearer {}", auditor_token))
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(serde_json::to_vec(&person_req).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(
        res.status(),
        StatusCode::FORBIDDEN,
        "Auditor cannot mutate domain data"
    );
}

#[tokio::test]
async fn test_v2_graph_generation_and_time_travel() {
    let (app, _, _) = setup_test_app().await;
    let admin_token = get_auth_token(&app, "admin@mira.local", DEMO_PASSWORD).await;

    // Get seeded households (H001)
    let res = app
        .clone()
        .oneshot(
            Request::builder()
                .uri("/api/v1/households")
                .method(Method::GET)
                .header(header::AUTHORIZATION, format!("Bearer {}", admin_token))
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    let hh_body: Value =
        serde_json::from_slice(&res.into_body().collect().await.unwrap().to_bytes()).unwrap();
    let households = hh_body["data"].as_array().unwrap();
    let h001 = households
        .iter()
        .find(|h| h["public_id"] == "H001")
        .expect("H001 must exist in seed");
    let h001_id = h001["id"].as_str().unwrap();

    // Query graph for H001 in 2024
    let res_2024 = app
        .clone()
        .oneshot(
            Request::builder()
                .uri(format!(
                    "/api/v1/graph/household/{}?date=2024-01-01",
                    h001_id
                ))
                .method(Method::GET)
                .header(header::AUTHORIZATION, format!("Bearer {}", admin_token))
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res_2024.status(), StatusCode::OK);
    let g_2024: Value =
        serde_json::from_slice(&res_2024.into_body().collect().await.unwrap().to_bytes()).unwrap();
    let nodes_2024 = g_2024["data"]["nodes"].as_array().unwrap();
    let person_nodes_2024: Vec<&str> = nodes_2024
        .iter()
        .filter(|n| n["type"] == "person")
        .map(|n| n["label"].as_str().unwrap())
        .collect();

    // In 2024, Ramesh, Sita, Amit, and Rahul are all in H001
    assert!(
        person_nodes_2024.iter().any(|name| name.contains("Rahul")),
        "Rahul must be in H001 graph in 2024"
    );
    assert_eq!(person_nodes_2024.len(), 4, "H001 had 4 members in 2024");

    // Query graph for H001 in 2026 (post separation)
    let res_2026 = app
        .clone()
        .oneshot(
            Request::builder()
                .uri(format!(
                    "/api/v1/graph/household/{}?date=2026-01-01",
                    h001_id
                ))
                .method(Method::GET)
                .header(header::AUTHORIZATION, format!("Bearer {}", admin_token))
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    assert_eq!(res_2026.status(), StatusCode::OK);
    let g_2026: Value =
        serde_json::from_slice(&res_2026.into_body().collect().await.unwrap().to_bytes()).unwrap();
    let nodes_2026 = g_2026["data"]["nodes"].as_array().unwrap();
    let person_nodes_2026: Vec<&str> = nodes_2026
        .iter()
        .filter(|n| n["type"] == "person")
        .map(|n| n["label"].as_str().unwrap())
        .collect();

    // In 2026, Rahul has departed to H002
    assert!(
        !person_nodes_2026.iter().any(|name| name.contains("Rahul")),
        "Rahul must NOT be in H001 graph in 2026"
    );
    assert_eq!(person_nodes_2026.len(), 3, "H001 has 3 members in 2026");
}
