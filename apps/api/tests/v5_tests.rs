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

// ============================================================================
// 1. SECURITY & FILE VALIDATION TESTS
// ============================================================================

#[tokio::test]
async fn test_v5_security_and_file_upload_attacks() {
    let (app, pool, _) = setup_test_app().await;
    let citizen_token = get_auth_token(&app, "citizen@mira.local", DEMO_PASSWORD).await;

    // Get citizen user ID
    let citizen_user = sqlx::query!("SELECT id FROM users WHERE email = 'citizen@mira.local'")
        .fetch_one(&pool)
        .await
        .unwrap();

    // A. Executable file rejection (MZ header disguised as PDF)
    let fake_pdf_payload = serde_json::json!({
        "filename": "trojan.pdf",
        "owner_type": "CITIZEN",
        "owner_id": citizen_user.id,
        "file_content_base64": "TVqQAAMAAAAEAAAA//8AALgAAAAAAAAAQAA=", // "MZ..." base64
        "access_purpose": "CITIZEN_SELF_SERVICE"
    });

    let res = app
        .clone()
        .oneshot(
            Request::builder()
                .uri("/api/v1/documents")
                .method(Method::POST)
                .header(header::AUTHORIZATION, format!("Bearer {}", citizen_token))
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(serde_json::to_vec(&fake_pdf_payload).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(res.status(), StatusCode::UNPROCESSABLE_ENTITY);

    // B. Script upload rejection (<script> injection)
    let script_payload = serde_json::json!({
        "filename": "document.txt",
        "owner_type": "CITIZEN",
        "owner_id": citizen_user.id,
        "text_content": "<script>alert('xss')</script>",
        "access_purpose": "CITIZEN_SELF_SERVICE"
    });

    let res_script = app
        .clone()
        .oneshot(
            Request::builder()
                .uri("/api/v1/documents")
                .method(Method::POST)
                .header(header::AUTHORIZATION, format!("Bearer {}", citizen_token))
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(serde_json::to_vec(&script_payload).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(res_script.status(), StatusCode::UNPROCESSABLE_ENTITY);

    // C. Path traversal filename sanitization check
    let clean_cert = serde_json::json!({
        "filename": "../../../../etc/passwd_birth_cert.txt",
        "owner_type": "CITIZEN",
        "owner_id": citizen_user.id,
        "text_content": "BIRTH CERTIFICATE\nName: Rahul Kumar\nDate of Birth: 12/04/1998",
        "access_purpose": "CITIZEN_SELF_SERVICE"
    });

    let res_traversal = app
        .clone()
        .oneshot(
            Request::builder()
                .uri("/api/v1/documents")
                .method(Method::POST)
                .header(header::AUTHORIZATION, format!("Bearer {}", citizen_token))
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(serde_json::to_vec(&clean_cert).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(res_traversal.status(), StatusCode::CREATED);
    let body: Value = serde_json::from_slice(
        &res_traversal
            .into_body()
            .collect()
            .await
            .unwrap()
            .to_bytes(),
    )
    .unwrap();
    let original_filename = body["data"]["original_filename"].as_str().unwrap();
    assert!(
        !original_filename.contains("../"),
        "Path traversal sequences must be stripped"
    );
}

// ============================================================================
// 2. PRIVACY & IDOR ISOLATION TESTS
// ============================================================================

#[tokio::test]
async fn test_v5_privacy_and_idor_protection() {
    let (app, pool, _) = setup_test_app().await;
    let citizen_token = get_auth_token(&app, "citizen@mira.local", DEMO_PASSWORD).await;
    let officer_token = get_auth_token(&app, "officer@mira.local", DEMO_PASSWORD).await;

    let citizen_user = sqlx::query!("SELECT id FROM users WHERE email = 'citizen@mira.local'")
        .fetch_one(&pool)
        .await
        .unwrap();

    // 1. Citizen uploads private document
    let upload_payload = serde_json::json!({
        "filename": "citizen_income_certificate.txt",
        "owner_type": "CITIZEN",
        "owner_id": citizen_user.id,
        "text_content": "INCOME CERTIFICATE\nApplicant Name: Rahul Kumar\nDate of Birth: 12/04/1998\nAnnual Income: ₹ 95,000",
        "access_purpose": "CITIZEN_SELF_SERVICE"
    });

    let res_upload = app
        .clone()
        .oneshot(
            Request::builder()
                .uri("/api/v1/documents")
                .method(Method::POST)
                .header(header::AUTHORIZATION, format!("Bearer {}", citizen_token))
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(serde_json::to_vec(&upload_payload).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(res_upload.status(), StatusCode::CREATED);
    let upload_body: Value =
        serde_json::from_slice(&res_upload.into_body().collect().await.unwrap().to_bytes())
            .unwrap();
    let doc_id = upload_body["data"]["id"].as_str().unwrap();

    // 2. IDOR Attack: Citizen attempts to upload document claiming another user's owner_id
    let malicious_owner_id = uuid::Uuid::new_v4();
    let idor_upload_payload = serde_json::json!({
        "filename": "fake_claim.txt",
        "owner_type": "CITIZEN",
        "owner_id": malicious_owner_id,
        "text_content": "BIRTH CERTIFICATE",
        "access_purpose": "CITIZEN_SELF_SERVICE"
    });

    let res_idor = app
        .clone()
        .oneshot(
            Request::builder()
                .uri("/api/v1/documents")
                .method(Method::POST)
                .header(header::AUTHORIZATION, format!("Bearer {}", citizen_token))
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(
                    serde_json::to_vec(&idor_upload_payload).unwrap(),
                ))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(res_idor.status(), StatusCode::FORBIDDEN);

    // 3. Authorized verification download by officer with purpose
    let res_download = app
        .clone()
        .oneshot(
            Request::builder()
                .uri(format!(
                    "/api/v1/documents/{}/download?purpose=APPLICATION_VERIFICATION",
                    doc_id
                ))
                .method(Method::GET)
                .header(header::AUTHORIZATION, format!("Bearer {}", officer_token))
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(res_download.status(), StatusCode::OK);

    // 4. Verify access was recorded in document_access_logs
    let access_logs = sqlx::query!(
        "SELECT action, purpose FROM document_access_logs WHERE document_id = $1 ORDER BY timestamp DESC",
        uuid::Uuid::parse_str(doc_id).unwrap()
    )
    .fetch_all(&pool)
    .await
    .unwrap();

    assert!(access_logs
        .iter()
        .any(|l| l.action == "DOWNLOAD" && l.purpose == "APPLICATION_VERIFICATION"));
}

// ============================================================================
// 3. COMPLETE DEMO SCENARIOS 1–6 (EVIDENCE INTELLIGENCE & HUMAN VERIFICATION)
// ============================================================================

#[tokio::test]
async fn test_v5_demo_scenarios_clean_conflict_property_and_correction() {
    let (app, pool, _) = setup_test_app().await;
    let officer_token = get_auth_token(&app, "officer@mira.local", DEMO_PASSWORD).await;

    // Get seeded case application
    let app_row = sqlx::query!(
        "SELECT id, applicant_person_id FROM applications WHERE public_id = 'APP-2025-001'"
    )
    .fetch_one(&pool)
    .await
    .unwrap();

    // -------------------------------------------------------------------------
    // Scenario 1: Clean Birth Certificate
    // -------------------------------------------------------------------------
    let birth_cert_req = serde_json::json!({
        "filename": "rahul_birth_certificate.txt",
        "owner_type": "APPLICATION",
        "owner_id": app_row.id,
        "specified_doc_type": "BIRTH_CERTIFICATE",
        "document_demo_type": "clean_birth",
        "access_purpose": "APPLICATION_VERIFICATION"
    });

    let res_s1 = app
        .clone()
        .oneshot(
            Request::builder()
                .uri("/api/v1/documents")
                .method(Method::POST)
                .header(header::AUTHORIZATION, format!("Bearer {}", officer_token))
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(serde_json::to_vec(&birth_cert_req).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(res_s1.status(), StatusCode::CREATED);
    let s1_body: Value =
        serde_json::from_slice(&res_s1.into_body().collect().await.unwrap().to_bytes()).unwrap();
    let s1_doc_id = s1_body["data"]["id"].as_str().unwrap();

    // Check extractions for Scenario 1
    let res_ext = app
        .clone()
        .oneshot(
            Request::builder()
                .uri(format!("/api/v1/documents/{}/extractions", s1_doc_id))
                .method(Method::GET)
                .header(header::AUTHORIZATION, format!("Bearer {}", officer_token))
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(res_ext.status(), StatusCode::OK);
    let ext_body: Value =
        serde_json::from_slice(&res_ext.into_body().collect().await.unwrap().to_bytes()).unwrap();
    let fields = ext_body["data"].as_array().unwrap();

    assert!(fields
        .iter()
        .any(|f| f["field"] == "NAME" && f["value"].as_str().unwrap().contains("Rahul Kumar")));
    assert!(fields
        .iter()
        .any(|f| f["field"] == "DATE_OF_BIRTH" && f["normalized_value"] == "1998-04-12"));

    // -------------------------------------------------------------------------
    // Scenario 4: Cross-Document Conflict (DOB 12/04/1988 vs 12/04/1998)
    // -------------------------------------------------------------------------
    let conflict_cert_req = serde_json::json!({
        "filename": "income_cert_conflict_1988.txt",
        "owner_type": "APPLICATION",
        "owner_id": app_row.id,
        "specified_doc_type": "INCOME_CERTIFICATE",
        "document_demo_type": "conflict_income_1988",
        "access_purpose": "APPLICATION_VERIFICATION"
    });

    let res_s4 = app
        .clone()
        .oneshot(
            Request::builder()
                .uri("/api/v1/documents")
                .method(Method::POST)
                .header(header::AUTHORIZATION, format!("Bearer {}", officer_token))
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(serde_json::to_vec(&conflict_cert_req).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(res_s4.status(), StatusCode::CREATED);
    let s4_body: Value =
        serde_json::from_slice(&res_s4.into_body().collect().await.unwrap().to_bytes()).unwrap();
    let _s4_doc_id = s4_body["data"]["id"].as_str().unwrap();

    // Check Case Evidence Pack for conflict

    let res_pack = app
        .clone()
        .oneshot(
            Request::builder()
                .uri(format!("/api/v1/cases/{}/evidence-pack", app_row.id))
                .method(Method::GET)
                .header(header::AUTHORIZATION, format!("Bearer {}", officer_token))
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(res_pack.status(), StatusCode::OK);
    let pack_body: Value =
        serde_json::from_slice(&res_pack.into_body().collect().await.unwrap().to_bytes()).unwrap();

    assert_eq!(
        pack_body["data"]["recommended_action"],
        "MANUAL_OFFICER_REVIEW_REQUIRED"
    );
    assert!(pack_body["data"]["why_flagged"]
        .as_str()
        .unwrap()
        .contains("DOB_CONFLICT"));

    // -------------------------------------------------------------------------
    // Scenario 6: Human Officer Correction & Immutable Provenance Trail
    // -------------------------------------------------------------------------
    // Get extraction ID for NAME from doc 1
    let name_ext = fields
        .iter()
        .find(|f| f["field"] == "NAME")
        .expect("Name field must exist");
    let name_ext_id = name_ext["id"].as_str().unwrap();

    let correction_payload = serde_json::json!({
        "extraction_id": name_ext_id,
        "decision": "EDITED",
        "corrected_value": "Rahul Kumar",
        "verification_method": "MANUAL_INSPECTION",
        "reason": "Corrected minor spelling variant from OCR extraction"
    });

    let res_correct = app
        .clone()
        .oneshot(
            Request::builder()
                .uri(format!("/api/v1/documents/{}/verify-extraction", s1_doc_id))
                .method(Method::POST)
                .header(header::AUTHORIZATION, format!("Bearer {}", officer_token))
                .header(header::CONTENT_TYPE, "application/json")
                .body(Body::from(serde_json::to_vec(&correction_payload).unwrap()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(res_correct.status(), StatusCode::OK);
    let correct_body: Value =
        serde_json::from_slice(&res_correct.into_body().collect().await.unwrap().to_bytes())
            .unwrap();
    assert_eq!(correct_body["data"]["decision"], "EDITED");
    assert_eq!(correct_body["data"]["corrected_value"], "Rahul Kumar");

    // Check that original raw OCR text is still intact in ocr_results
    let raw_ocr = sqlx::query!(
        "SELECT text FROM ocr_results WHERE document_id = $1",
        uuid::Uuid::parse_str(s1_doc_id).unwrap()
    )
    .fetch_one(&pool)
    .await
    .unwrap();
    assert!(
        !raw_ocr.text.is_empty(),
        "Original OCR text must be preserved"
    );
}
