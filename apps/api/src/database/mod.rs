use chrono::NaiveDate;
use sha2::{Digest, Sha256};
use sqlx::{postgres::PgPoolOptions, PgPool, Row};
use std::path::Path;
use uuid::Uuid;

use crate::{auth::PasswordService, domain::RoleType, errors::AppError};

pub const DEMO_PASSWORD: &str = "MiraDemo@2026!";

pub async fn create_pool(database_url: &str) -> Result<PgPool, AppError> {
    PgPoolOptions::new()
        .max_connections(20)
        .connect(database_url)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to connect to database: {}", e)))
}

/// Run foundational and V2 schema migrations
pub async fn run_migrations(pool: &PgPool) -> Result<(), AppError> {
    sqlx::query("SELECT pg_advisory_lock(88127391)")
        .execute(pool)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to acquire migration lock: {e}")))?;

    let res = run_migrations_inner(pool).await;

    let _ = sqlx::query("SELECT pg_advisory_unlock(88127391)")
        .execute(pool)
        .await;

    res
}

async fn run_migrations_inner(pool: &PgPool) -> Result<(), AppError> {
    let schema_v1 = include_str!("../../../../migrations/0001_initial_schema.sql");
    sqlx::raw_sql(schema_v1)
        .execute(pool)
        .await
        .map_err(|e| AppError::Internal(format!("V1 database migration failed: {}", e)))?;

    let schema_v2 = include_str!("../../../../migrations/0002_v2_domain_schema.sql");
    sqlx::raw_sql(schema_v2)
        .execute(pool)
        .await
        .map_err(|e| AppError::Internal(format!("V2 database migration failed: {}", e)))?;

    let schema_v3 = include_str!("../../../../migrations/0003_v3_scheme_benefit_schema.sql");
    sqlx::raw_sql(schema_v3)
        .execute(pool)
        .await
        .map_err(|e| AppError::Internal(format!("V3 database migration failed: {}", e)))?;

    let schema_v4 =
        include_str!("../../../../migrations/0004_v4_entity_resolution_and_duplicates.sql");
    sqlx::raw_sql(schema_v4)
        .execute(pool)
        .await
        .map_err(|e| AppError::Internal(format!("V4 database migration failed: {}", e)))?;

    let schema_v5 =
        include_str!("../../../../migrations/0005_v5_evidence_and_document_intelligence.sql");
    sqlx::raw_sql(schema_v5)
        .execute(pool)
        .await
        .map_err(|e| AppError::Internal(format!("V5 database migration failed: {}", e)))?;

    let schema_v6 = include_str!("../../../../migrations/0006_v6_workflow_and_notifications.sql");
    sqlx::raw_sql(schema_v6)
        .execute(pool)
        .await
        .map_err(|e| AppError::Internal(format!("V6 database migration failed: {}", e)))?;

    let schema_v7 = include_str!("../../../../migrations/0007_v7_document_library.sql");
    sqlx::raw_sql(schema_v7)
        .execute(pool)
        .await
        .map_err(|e| AppError::Internal(format!("V7 database migration failed: {}", e)))?;

    let schema_v8 = include_str!("../../../../migrations/0008_demo_auth.sql");
    sqlx::raw_sql(schema_v8)
        .execute(pool)
        .await
        .map_err(|e| AppError::Internal(format!("V8 database migration failed: {}", e)))?;

    tracing::info!("Database schema migrations (V1 through V8) verified successfully");
    Ok(())
}

async fn clean_demo_data(pool: &PgPool) -> Result<(), AppError> {
    let tables = [
        "document_verifications",
        "document_consistency_checks",
        "document_extractions",
        "ocr_results",
        "document_jobs",
        "document_access_logs",
        "document_versions",
        "application_documents",
        "benefit_duplicate_decisions",
        "benefit_duplicate_candidates",
        "benefit_duplicate_cases",
        "benefit_events",
        "benefit_assets",
        "benefits",
        "eligibility_rule_results",
        "eligibility_assessments",
        "applications",
        "scheme_rules",
        "schemes",
        "property_associations",
        "properties",
        "household_memberships",
        "person_relationships",
        "person_identifiers",
        "life_events",
        "households",
        "persons",
        "documents",
        "notifications",
        "audit_events",
        "user_roles",
        "user_organizations",
        "users",
        "roles",
        "organizations",
        "source_records",
    ];

    for table in tables {
        let q = format!("DELETE FROM {}", table);
        let _ = sqlx::query(&q).execute(pool).await;
    }
    Ok(())
}

/// Deterministic Seed Data Runner
/// Safe, idempotent, and repeatable seeding of foundation, V2, V3, V4, and V5 demo data
pub async fn seed_database(pool: &PgPool) -> Result<(), AppError> {
    tracing::info!("Starting deterministic database seed for Mira synthetic demo environment");

    // Clean tables for 100% deterministic idempotency
    clean_demo_data(pool).await?;

    // ========================================================================
    // 1. Roles
    // ========================================================================
    let roles = [
        (
            RoleType::Citizen.as_str(),
            "Resident citizen seeking public documentation & entitlements",
        ),
        (
            RoleType::FieldOfficial.as_str(),
            "Civic field operative validating local resident credentials",
        ),
        (
            RoleType::VerificationOfficer.as_str(),
            "Verification and adjudication officer reviewing claims",
        ),
        (
            RoleType::SchemeOfficer.as_str(),
            "Scheme officer reviewing policy, eligibility & sanctions",
        ),
        (
            RoleType::Supervisor.as_str(),
            "Supervisor reviewing escalated cases and second approvals",
        ),
        (
            RoleType::DepartmentAdmin.as_str(),
            "Administrative authority managing department operations",
        ),
        (
            RoleType::Auditor.as_str(),
            "Independent oversight auditor inspecting access and logs",
        ),
        (
            RoleType::SuperAdmin.as_str(),
            "System infrastructure administrator",
        ),
    ];

    for (role_name, desc) in roles {
        sqlx::query(
            r#"
            INSERT INTO roles (id, name, description)
            VALUES (gen_random_uuid(), $1, $2)
            ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description
            "#,
        )
        .bind(role_name)
        .bind(desc)
        .execute(pool)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to seed role {}: {}", role_name, e)))?;
    }

    // ========================================================================
    // 2. Synthetic Demo Organization
    // ========================================================================
    let org_code = "MIRA-DEMO-DEPT";
    let org_name = "Mira Demo Department";
    let org_desc = "Synthetic Demo Department for Public Documentation Verification";

    let org_row = sqlx::query(
        r#"
        INSERT INTO organizations (id, name, code, description, is_active)
        VALUES (gen_random_uuid(), $1, $2, $3, true)
        ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description
        RETURNING id
        "#,
    )
    .bind(org_name)
    .bind(org_code)
    .bind(org_desc)
    .fetch_one(pool)
    .await
    .map_err(|e| AppError::Internal(format!("Failed to seed organization: {}", e)))?;

    let org_id: Uuid = org_row.get("id");

    // ========================================================================
    // 3. Demo Users
    // ========================================================================
    let demo_pw_hash = PasswordService::hash(DEMO_PASSWORD)?;

    let demo_users = [
        // Standard prompt demo accounts
        (
            "demo.citizen@mira.demo",
            "Rajesh Sharma (Citizen)",
            "en",
            RoleType::Citizen.as_str(),
        ),
        (
            "demo.verifier@mira.demo",
            "Vikram Malhotra (Verification Officer)",
            "en",
            RoleType::VerificationOfficer.as_str(),
        ),
        (
            "demo.scheme@mira.demo",
            "Sunita Verma (Scheme Officer)",
            "en",
            RoleType::SchemeOfficer.as_str(),
        ),
        (
            "demo.supervisor@mira.demo",
            "Arun Deshmukh (Supervisor)",
            "en",
            RoleType::Supervisor.as_str(),
        ),
        (
            "demo.auditor@mira.demo",
            "Kavita Rao (Auditor)",
            "en",
            RoleType::Auditor.as_str(),
        ),
        (
            "demo.admin@mira.demo",
            "System Administrator",
            "en",
            RoleType::DepartmentAdmin.as_str(),
        ),
        // Legacy aliases for backwards compatibility
        (
            "citizen@mira.local",
            "Rajesh Sharma (Citizen)",
            "en",
            RoleType::Citizen.as_str(),
        ),
        (
            "officer@mira.local",
            "Priya Sharma (Field Official)",
            "en",
            RoleType::FieldOfficial.as_str(),
        ),
        (
            "verifier@mira.local",
            "Vikram Malhotra (Verification Officer)",
            "hi",
            RoleType::VerificationOfficer.as_str(),
        ),
        (
            "admin@mira.local",
            "System Administrator",
            "en",
            RoleType::DepartmentAdmin.as_str(),
        ),
        (
            "auditor@mira.local",
            "Kavita Rao (Auditor)",
            "en",
            RoleType::Auditor.as_str(),
        ),
    ];

    let mut admin_user_id = Uuid::nil();
    let mut citizen_user_id = Uuid::nil();

    for (email, display_name, lang, role_name) in demo_users {
        let user_row = sqlx::query(
            r#"
            INSERT INTO users (id, email, password_hash, display_name, preferred_language, is_active, is_demo)
            VALUES (gen_random_uuid(), $1, $2, $3, $4, true, true)
            ON CONFLICT (email) DO UPDATE 
            SET display_name = EXCLUDED.display_name,
                preferred_language = EXCLUDED.preferred_language,
                password_hash = EXCLUDED.password_hash,
                is_demo = true
            RETURNING id
            "#,
        )
        .bind(email)
        .bind(&demo_pw_hash)
        .bind(display_name)
        .bind(lang)
        .fetch_one(pool)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to seed user {}: {}", email, e)))?;

        let user_id: Uuid = user_row.get("id");
        if role_name == RoleType::DepartmentAdmin.as_str() && admin_user_id == Uuid::nil() {
            admin_user_id = user_id;
        }
        if email == "demo.citizen@mira.demo" {
            citizen_user_id = user_id;
        }

        let role_row = sqlx::query("SELECT id FROM roles WHERE name = $1")
            .bind(role_name)
            .fetch_one(pool)
            .await
            .map_err(|e| AppError::Internal(format!("Role not found {}: {}", role_name, e)))?;

        let role_id: Uuid = role_row.get("id");

        sqlx::query(
            r#"
            INSERT INTO user_roles (user_id, role_id)
            VALUES ($1, $2)
            ON CONFLICT (user_id, role_id) DO NOTHING
            "#,
        )
        .bind(user_id)
        .bind(role_id)
        .execute(pool)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to assign role to {}: {}", email, e)))?;

        sqlx::query(
            r#"
            INSERT INTO user_organizations (user_id, organization_id, is_primary)
            VALUES ($1, $2, true)
            ON CONFLICT (user_id, organization_id) DO NOTHING
            "#,
        )
        .bind(user_id)
        .bind(org_id)
        .execute(pool)
        .await
        .map_err(|e| {
            AppError::Internal(format!(
                "Failed to associate user {} with org: {}",
                email, e
            ))
        })?;
    }

    // ========================================================================
    // 4. Provenance Sources
    // ========================================================================
    let sources = [
        (
            "HOUSEHOLD_REGISTER",
            "HR-2024-DEL-01",
            "State Household Census Register 2024",
            "HIGH",
        ),
        (
            "FIELD_VERIFICATION",
            "FV-2025-089",
            "Field Inspector Verification Unit",
            "VERY_HIGH",
        ),
        (
            "BIRTH_REGISTER",
            "BR-MIRA-DEMO",
            "Civil Registration System",
            "VERY_HIGH",
        ),
        (
            "REVENUE_REGISTER",
            "REV-UP-2025-01",
            "State Land & Revenue Records Bureau",
            "VERY_HIGH",
        ),
    ];

    let mut source_hr_id = Uuid::nil();
    let mut source_fv_id = Uuid::nil();

    for (stype, sref, sname, rel) in sources {
        let row = sqlx::query(
            r#"
            INSERT INTO source_records (id, source_type, source_reference, source_name, reliability)
            VALUES (gen_random_uuid(), $1, $2, $3, $4)
            RETURNING id
            "#,
        )
        .bind(stype)
        .bind(sref)
        .bind(sname)
        .bind(rel)
        .fetch_one(pool)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to seed source {}: {}", sname, e)))?;

        let sid: Uuid = row.get("id");
        if stype == "HOUSEHOLD_REGISTER" {
            source_hr_id = sid;
        } else if stype == "FIELD_VERIFICATION" {
            source_fv_id = sid;
        }
    }

    // ========================================================================
    // 5. Baseline Test Persons (Ramesh, Sita, Amit, Rahul, Priya, Arjun)
    // ========================================================================
    let persons: [(
        &str,
        &str,
        Option<&str>,
        &str,
        Option<NaiveDate>,
        &str,
        &str,
        &str,
    ); 6] = [
        (
            "P-1001",
            "Ramesh",
            None,
            "Kumar",
            NaiveDate::from_ymd_opt(1968, 4, 12),
            "Male",
            "ramesh@synthetic.local",
            "ACTIVE",
        ),
        (
            "P-1002",
            "Sita",
            None,
            "Devi",
            NaiveDate::from_ymd_opt(1972, 8, 25),
            "Female",
            "sita@synthetic.local",
            "ACTIVE",
        ),
        (
            "P-1003",
            "Amit",
            None,
            "Kumar",
            NaiveDate::from_ymd_opt(1996, 11, 4),
            "Male",
            "amit@synthetic.local",
            "ACTIVE",
        ),
        (
            "P-1004",
            "Rahul",
            None,
            "Kumar",
            NaiveDate::from_ymd_opt(1999, 6, 18),
            "Male",
            "rahul@synthetic.local",
            "ACTIVE",
        ),
        (
            "P-1005",
            "Priya",
            None,
            "Sharma",
            NaiveDate::from_ymd_opt(1992, 3, 15),
            "Female",
            "priya@synthetic.local",
            "ACTIVE",
        ),
        (
            "P-1006",
            "Arjun",
            None,
            "Sharma",
            NaiveDate::from_ymd_opt(1989, 12, 20),
            "Male",
            "arjun@synthetic.local",
            "ACTIVE",
        ),
    ];

    let mut person_map = std::collections::HashMap::new();

    for (pid, fname, mname, lname, dob, gender, email, status) in persons {
        let row = sqlx::query(
            r#"
            INSERT INTO persons (id, public_id, first_name, middle_name, last_name, date_of_birth, gender, email, status, created_by)
            VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (public_id) DO UPDATE 
            SET first_name = EXCLUDED.first_name,
                last_name = EXCLUDED.last_name,
                status = EXCLUDED.status
            RETURNING id, public_id
            "#,
        )
        .bind(pid)
        .bind(fname)
        .bind(mname)
        .bind(lname)
        .bind(dob)
        .bind(gender)
        .bind(email)
        .bind(status)
        .bind(admin_user_id)
        .fetch_one(pool)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to seed person {}: {}", pid, e)))?;

        let id: Uuid = row.get("id");
        let pub_id: String = row.get("public_id");
        person_map.insert(pub_id, id);

        sqlx::query(
            r#"
            INSERT INTO person_identifiers (id, person_id, identifier_type, identifier_reference, source_id, verified)
            VALUES (gen_random_uuid(), $1, 'DEMO_ID', $2, $3, true)
            "#,
        )
        .bind(id)
        .bind(format!("SYNTH-{}", pid))
        .bind(source_hr_id)
        .execute(pool)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to seed identifier for {}: {}", pid, e)))?;
    }

    let ramesh_id = person_map["P-1001"];
    let sita_id = person_map["P-1002"];
    let amit_id = person_map["P-1003"];
    let rahul_id = person_map["P-1004"];
    let priya_id = person_map["P-1005"];
    let arjun_id = person_map["P-1006"];

    // Relationships for baseline persons
    let relationships: [(Uuid, Uuid, &str, NaiveDate, Option<NaiveDate>); 7] = [
        (
            ramesh_id,
            sita_id,
            "SPOUSE",
            NaiveDate::from_ymd_opt(1993, 2, 14).unwrap(),
            None,
        ),
        (
            ramesh_id,
            amit_id,
            "PARENT",
            NaiveDate::from_ymd_opt(1996, 11, 4).unwrap(),
            None,
        ),
        (
            sita_id,
            amit_id,
            "PARENT",
            NaiveDate::from_ymd_opt(1996, 11, 4).unwrap(),
            None,
        ),
        (
            ramesh_id,
            rahul_id,
            "PARENT",
            NaiveDate::from_ymd_opt(1999, 6, 18).unwrap(),
            None,
        ),
        (
            sita_id,
            rahul_id,
            "PARENT",
            NaiveDate::from_ymd_opt(1999, 6, 18).unwrap(),
            None,
        ),
        (
            amit_id,
            rahul_id,
            "SIBLING",
            NaiveDate::from_ymd_opt(1999, 6, 18).unwrap(),
            None,
        ),
        (
            priya_id,
            arjun_id,
            "SPOUSE",
            NaiveDate::from_ymd_opt(2017, 5, 10).unwrap(),
            None,
        ),
    ];

    for (p_a, p_b, rtype, vfrom, vto) in relationships {
        sqlx::query(
            r#"
            INSERT INTO person_relationships (id, person_a_id, person_b_id, relationship_type, valid_from, valid_to, source_id, verification_status, confidence, created_by)
            VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'VERIFIED', 1.00, $7)
            "#,
        )
        .bind(p_a)
        .bind(p_b)
        .bind(rtype)
        .bind(vfrom)
        .bind(vto)
        .bind(source_fv_id)
        .bind(admin_user_id)
        .execute(pool)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to seed relationship: {}", e)))?;
    }

    // Baseline Households (H001, H002, H003)
    let households = [
        ("H001", "Ramesh Kumar Household", "ACTIVE"),
        ("H002", "Rahul Kumar Household", "ACTIVE"),
        ("H003", "Sharma Household", "ACTIVE"),
    ];

    let mut household_map = std::collections::HashMap::new();

    for (hid, hname, hstatus) in households {
        let row = sqlx::query(
            r#"
            INSERT INTO households (id, public_id, name, status, created_by)
            VALUES (gen_random_uuid(), $1, $2, $3, $4)
            ON CONFLICT (public_id) DO UPDATE SET name = EXCLUDED.name, status = EXCLUDED.status
            RETURNING id, public_id
            "#,
        )
        .bind(hid)
        .bind(hname)
        .bind(hstatus)
        .bind(admin_user_id)
        .fetch_one(pool)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to seed household {}: {}", hid, e)))?;

        let id: Uuid = row.get("id");
        let pub_id: String = row.get("public_id");
        household_map.insert(pub_id, id);
    }

    let h001_id = household_map["H001"];
    let h002_id = household_map["H002"];
    let h003_id = household_map["H003"];

    let sep_date = NaiveDate::from_ymd_opt(2025, 7, 1).unwrap();
    let memberships = [
        (
            h001_id,
            ramesh_id,
            "HEAD",
            NaiveDate::from_ymd_opt(2015, 1, 1).unwrap(),
            None,
        ),
        (
            h001_id,
            sita_id,
            "SPOUSE",
            NaiveDate::from_ymd_opt(2015, 1, 1).unwrap(),
            None,
        ),
        (
            h001_id,
            amit_id,
            "CHILD",
            NaiveDate::from_ymd_opt(2018, 3, 10).unwrap(),
            None,
        ),
        (
            h001_id,
            rahul_id,
            "CHILD",
            NaiveDate::from_ymd_opt(2018, 1, 1).unwrap(),
            Some(sep_date),
        ),
        (h002_id, rahul_id, "HEAD", sep_date, None),
        (
            h003_id,
            priya_id,
            "HEAD",
            NaiveDate::from_ymd_opt(2021, 1, 1).unwrap(),
            None,
        ),
        (
            h003_id,
            arjun_id,
            "SPOUSE",
            NaiveDate::from_ymd_opt(2021, 1, 1).unwrap(),
            None,
        ),
    ];

    for (hid, pid, role, vfrom, vto) in memberships {
        sqlx::query(
            r#"
            INSERT INTO household_memberships (id, household_id, person_id, membership_role, valid_from, valid_to, source_id, verification_status, confidence, created_by)
            VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'VERIFIED', 1.00, $7)
            "#,
        )
        .bind(hid)
        .bind(pid)
        .bind(role)
        .bind(vfrom)
        .bind(vto)
        .bind(source_hr_id)
        .bind(admin_user_id)
        .execute(pool)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to seed membership: {}", e)))?;
    }

    // Baseline Properties
    let properties = [
        (
            "PROP-001",
            "HOUSE",
            "Plot 42, Civil Lines",
            "Civil Lines",
            "Central Delhi",
            "Delhi",
            "110054",
            28.6812,
            77.2228,
        ),
        (
            "PROP-002",
            "APARTMENT",
            "Flat 304, Shanti Enclave",
            "Mayur Vihar",
            "East Delhi",
            "Delhi",
            "110091",
            28.6080,
            77.2950,
        ),
        (
            "PROP-003",
            "LAND",
            "Survey No. 81/2, Agricultural Zone",
            "Alipur",
            "North Delhi",
            "Delhi",
            "110036",
            28.7981,
            77.1352,
        ),
    ];

    let mut prop_map = std::collections::HashMap::new();

    for (p_pub, p_type, p_addr, p_loc, p_dist, p_state, p_post, p_lat, p_long) in properties {
        let row = sqlx::query(
            r#"
            INSERT INTO properties (id, public_id, property_type, address_line, locality, district, state, postal_code, latitude, longitude)
            VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (public_id) DO UPDATE SET address_line = EXCLUDED.address_line
            RETURNING id, public_id
            "#,
        )
        .bind(p_pub)
        .bind(p_type)
        .bind(p_addr)
        .bind(p_loc)
        .bind(p_dist)
        .bind(p_state)
        .bind(p_post)
        .bind(p_lat)
        .bind(p_long)
        .fetch_one(pool)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to seed property {}: {}", p_pub, e)))?;

        let id: Uuid = row.get("id");
        let pub_id: String = row.get("public_id");
        prop_map.insert(pub_id, id);
    }

    let prop1_id = prop_map["PROP-001"];
    let prop2_id = prop_map["PROP-002"];
    let prop3_id = prop_map["PROP-003"];

    let prop_assocs: [(
        Uuid,
        Option<Uuid>,
        Option<Uuid>,
        &str,
        NaiveDate,
        Option<NaiveDate>,
    ); 3] = [
        (
            prop1_id,
            Some(h001_id),
            None,
            "HOUSEHOLD_OCCUPIES",
            NaiveDate::from_ymd_opt(2015, 1, 1).unwrap(),
            None,
        ),
        (
            prop2_id,
            Some(h002_id),
            None,
            "HOUSEHOLD_OCCUPIES",
            sep_date,
            None,
        ),
        (
            prop3_id,
            None,
            Some(ramesh_id),
            "PERSON_OWNS",
            NaiveDate::from_ymd_opt(2010, 5, 20).unwrap(),
            None,
        ),
    ];

    for (p_id, h_id, per_id, a_type, vfrom, vto) in prop_assocs {
        sqlx::query(
            r#"
            INSERT INTO property_associations (id, property_id, household_id, person_id, association_type, valid_from, valid_to, verification_status, confidence)
            VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'VERIFIED', 1.00)
            "#,
        )
        .bind(p_id)
        .bind(h_id)
        .bind(per_id)
        .bind(a_type)
        .bind(vfrom)
        .bind(vto)
        .execute(pool)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to seed property association: {}", e)))?;
    }

    // ========================================================================
    // 6. Schemes Master
    // ========================================================================
    let schemes = [
        ("SCH-001", "SCH_STUDENT_SCHOLARSHIP", "Student Educational Scholarship Assistance", "Direct annual financial scholarship for meritorious students from low-income families", "Department of Higher Education", "ACTIVE", "INDIVIDUAL"),
        ("SCH-002", "SCH_HH_SANITATION", "Household Sanitation and Hygiene Support Scheme", "Comprehensive toilet construction and sanitation facility support for verified rural and peri-urban families", "Department of Drinking Water and Sanitation", "ACTIVE", "HOUSEHOLD"),
        ("SCH-003", "SCH_WATER_CONNECTION", "Jal Jeevan Household Tap Water Connection", "Piped clean drinking water infrastructure connection to registered residential dwelling plots", "Department of Water Resources", "ACTIVE", "PROPERTY"),
        ("SCH-004", "SCH_RURAL_HOUSING", "Pradhan Mantri Rural Housing Assistance Scheme", "Financial assistance for construction of pucca dwelling unit for rural families without permanent housing", "Department of Rural Development", "ACTIVE", "HOUSEHOLD"),
        ("SCH-005", "SCH_ANTYODAYA_RATION", "Antyodaya Priority Grain and Food Security Scheme", "Monthly subsidized food grain entitlement for vulnerable and low-income rural households", "Department of Food & Public Distribution", "ACTIVE", "HOUSEHOLD"),
        ("SCH-006", "SCH_AYUSHMAN_HEALTH", "Ayushman National Universal Healthcare Cover", "Cashless tertiary and secondary hospital treatment cover up to ₹5,00,000 per family per year", "National Health Authority", "ACTIVE", "HOUSEHOLD"),
        ("SCH-007", "SCH_SENIOR_PENSION", "National Senior Citizen Social Security Pension", "Monthly direct benefit social pension for senior residents aged 60 and above", "Department of Social Justice", "ACTIVE", "INDIVIDUAL"),
        ("SCH-008", "SCH_DISABILITY_SUPPORT", "Divyangjan Assistive Aid & Livelihood Support", "Financial and assistive aid support for persons with certified physical mobility challenges", "Department of Empowerment of Persons with Disabilities", "ACTIVE", "INDIVIDUAL"),
        ("SCH-009", "SCH_RURAL_LIVELIHOOD", "Deendayal Antyodaya Rural Livelihood Mission", "Seed capital and skill development support for rural women and small enterprise households", "Department of Rural Development", "ACTIVE", "HOUSEHOLD"),
    ];

    let mut scheme_map = std::collections::HashMap::new();

    for (s_pub, s_code, s_name, s_desc, s_dept, s_status, s_scope) in schemes {
        let row = sqlx::query(
            r#"
            INSERT INTO schemes (id, public_id, code, name, description, department, status, scope, created_by)
            VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (code) DO UPDATE 
            SET name = EXCLUDED.name,
                description = EXCLUDED.description,
                status = EXCLUDED.status
            RETURNING id, code
            "#,
        )
        .bind(s_pub)
        .bind(s_code)
        .bind(s_name)
        .bind(s_desc)
        .bind(s_dept)
        .bind(s_status)
        .bind(s_scope)
        .bind(admin_user_id)
        .fetch_one(pool)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to seed scheme {}: {}", s_code, e)))?;

        let id: Uuid = row.get("id");
        let code: String = row.get("code");
        scheme_map.insert(code, id);
    }

    // Rules for Student Scholarship
    let sch_scholarship_id = scheme_map["SCH_STUDENT_SCHOLARSHIP"];
    let scholarship_rules = [
        (sch_scholarship_id, "AGE_MIN", ">=", "5", 1),
        (sch_scholarship_id, "AGE_MAX", "<=", "25", 2),
        (sch_scholarship_id, "RESIDENCY_REQUIRED", "=", "TRUE", 3),
        (sch_scholarship_id, "INCOME_MAX", "<=", "200000", 4),
    ];
    for (sch_id, r_type, op, val, prio) in scholarship_rules {
        sqlx::query("INSERT INTO scheme_rules (id, scheme_id, rule_type, operator, value, priority, active) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, true)")
            .bind(sch_id).bind(r_type).bind(op).bind(val).bind(prio).execute(pool).await?;
    }

    // Rules for Sanitation
    let sch_sanitation_id = scheme_map["SCH_HH_SANITATION"];
    let sanitation_rules = [
        (sch_sanitation_id, "HOUSEHOLD_SIZE_MIN", ">=", "2", 1),
        (sch_sanitation_id, "RESIDENCY_REQUIRED", "=", "TRUE", 2),
        (sch_sanitation_id, "INCOME_MAX", "<=", "250000", 3),
    ];
    for (sch_id, r_type, op, val, prio) in sanitation_rules {
        sqlx::query("INSERT INTO scheme_rules (id, scheme_id, rule_type, operator, value, priority, active) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, true)")
            .bind(sch_id).bind(r_type).bind(op).bind(val).bind(prio).execute(pool).await?;
    }

    // Rules for Water Connection
    let sch_water_id = scheme_map["SCH_WATER_CONNECTION"];
    sqlx::query("INSERT INTO scheme_rules (id, scheme_id, rule_type, operator, value, priority, active) VALUES (gen_random_uuid(), $1, 'PROPERTY_REQUIRED', '=', 'TRUE', 1, true)")
        .bind(sch_water_id).execute(pool).await?;

    // Rules for Rural Housing
    let sch_housing_id = scheme_map["SCH_RURAL_HOUSING"];
    let housing_rules = [
        (sch_housing_id, "INCOME_MAX", "<=", "200000", 1),
        (sch_housing_id, "RESIDENCY_REQUIRED", "=", "TRUE", 2),
    ];
    for (sch_id, r_type, op, val, prio) in housing_rules {
        sqlx::query("INSERT INTO scheme_rules (id, scheme_id, rule_type, operator, value, priority, active) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, true)")
            .bind(sch_id).bind(r_type).bind(op).bind(val).bind(prio).execute(pool).await?;
    }

    // Rules for Senior Pension
    let sch_pension_id = scheme_map["SCH_SENIOR_PENSION"];
    let pension_rules = [
        (sch_pension_id, "AGE_MIN", ">=", "60", 1),
        (sch_pension_id, "INCOME_MAX", "<=", "200000", 2),
    ];
    for (sch_id, r_type, op, val, prio) in pension_rules {
        sqlx::query("INSERT INTO scheme_rules (id, scheme_id, rule_type, operator, value, priority, active) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, true)")
            .bind(sch_id).bind(r_type).bind(op).bind(val).bind(prio).execute(pool).await?;
    }

    // Rules for Ayushman Healthcare
    let sch_health_id = scheme_map["SCH_AYUSHMAN_HEALTH"];
    let health_rules = [
        (sch_health_id, "INCOME_MAX", "<=", "250000", 1),
        (sch_health_id, "RESIDENCY_REQUIRED", "=", "TRUE", 2),
    ];
    for (sch_id, r_type, op, val, prio) in health_rules {
        sqlx::query("INSERT INTO scheme_rules (id, scheme_id, rule_type, operator, value, priority, active) VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, true)")
            .bind(sch_id).bind(r_type).bind(op).bind(val).bind(prio).execute(pool).await?;
    }

    // ========================================================================
    // 7. Seed Rahul's historical benefit (for duplicate/history test)
    // ========================================================================
    let app1_row = sqlx::query(
        r#"
        INSERT INTO applications (
            id, public_id, application_number, scheme_id, applicant_person_id, target_person_id,
            submitted_at, status, current_stage, application_date, created_by
        )
        VALUES (
            gen_random_uuid(), 'APP-2025-001', 'APP-SCHOLAR-2025-001', $1, $2, $2,
            '2025-01-08T10:00:00Z', 'DISBURSED', 'BENEFIT_DISBURSED', '2025-01-08', $3
        )
        RETURNING id
        "#,
    )
    .bind(sch_scholarship_id)
    .bind(rahul_id)
    .bind(admin_user_id)
    .fetch_one(pool)
    .await?;

    let app1_id: Uuid = app1_row.get("id");

    let assess1_row = sqlx::query(
        r#"
        INSERT INTO eligibility_assessments (id, application_id, result, evaluated_at, engine_version, summary)
        VALUES (gen_random_uuid(), $1, 'ELIGIBLE', '2025-01-08T10:05:00Z', 'v3.0.0-deterministic',
                'Deterministic rule evaluation: All age and residency eligibility rules satisfied for applicant.')
        RETURNING id
        "#,
    )
    .bind(app1_id)
    .fetch_one(pool)
    .await?;

    let assess1_id: Uuid = assess1_row.get("id");

    sqlx::query(
        r#"
        INSERT INTO eligibility_rule_results (id, assessment_id, rule_type, result, actual_value, expected_value, explanation)
        VALUES 
        (gen_random_uuid(), $1, 'AGE_MIN', 'PASS', '25', '>= 5', 'Applicant age 25 meets minimum age requirement of 5.'),
        (gen_random_uuid(), $1, 'AGE_MAX', 'PASS', '25', '<= 25', 'Applicant age 25 meets maximum age requirement of 25.'),
        (gen_random_uuid(), $1, 'RESIDENCY_REQUIRED', 'PASS', 'TRUE', '= TRUE', 'Applicant holds verified residency record.')
        "#,
    )
    .bind(assess1_id)
    .execute(pool)
    .await?;

    sqlx::query(
        r#"
        INSERT INTO benefits (
            id, public_id, scheme_id, application_id, benefit_unit_type, person_id,
            status, approved_at, disbursed_at, valid_from, valid_to, amount, currency,
            description, source_id, created_by
        )
        VALUES (
            gen_random_uuid(), 'BEN-2025-001', $1, $2, 'PERSON', $3,
            'DISBURSED', '2025-01-10T12:00:00Z', '2025-01-15T15:30:00Z', '2025-01-01', '2025-12-31',
            10000.00, 'INR', 'Direct Educational Student Scholarship Allowance for 2025 academic session',
            $4, $5
        )
        "#,
    )
    .bind(sch_scholarship_id)
    .bind(app1_id)
    .bind(rahul_id)
    .bind(source_hr_id)
    .bind(admin_user_id)
    .execute(pool)
    .await?;

    // Seed Sharma Family (35 members, ₹1,72,000 income, 6 applications)
    seed_sharma_family(
        pool,
        citizen_user_id,
        admin_user_id,
        source_hr_id,
        source_fv_id,
    )
    .await?;

    // Seed 10 realistic synthetic documents and application document links
    seed_demo_documents(pool).await?;

    tracing::info!("Deterministic V4/V5 seed finished successfully. Sharma Family (35 members) and 10 synthetic documents ready.");
    Ok(())
}

fn synthetic_demo_pdf(label: &str) -> Vec<u8> {
    let content = format!("BT /F1 18 Tf 72 700 Td (SYNTHETIC DEMO DOCUMENT) Tj 0 -42 Td /F1 13 Tf ({}) Tj 0 -28 Td (For Mira product testing only. Not an official certificate.) Tj ET", label);
    let objects = [
        "<< /Type /Catalog /Pages 2 0 R >>".to_string(),
        "<< /Type /Pages /Kids [3 0 R] /Count 1 >>".to_string(),
        "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>".to_string(),
        "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>".to_string(),
        format!("<< /Length {} >>\nstream\n{}\nendstream", content.len(), content),
    ];
    let mut pdf = b"%PDF-1.4\n".to_vec();
    let mut offsets = Vec::new();
    for (index, object) in objects.iter().enumerate() {
        offsets.push(pdf.len());
        pdf.extend_from_slice(format!("{} 0 obj\n{}\nendobj\n", index + 1, object).as_bytes());
    }
    let xref_offset = pdf.len();
    pdf.extend_from_slice(
        format!("xref\n0 {}\n0000000000 65535 f \n", objects.len() + 1).as_bytes(),
    );
    for offset in offsets {
        pdf.extend_from_slice(format!("{offset:010} 00000 n \n").as_bytes());
    }
    pdf.extend_from_slice(
        format!(
            "trailer\n<< /Size {} /Root 1 0 R >>\nstartxref\n{}\n%%EOF",
            objects.len() + 1,
            xref_offset
        )
        .as_bytes(),
    );
    pdf
}

async fn seed_sharma_family(
    pool: &PgPool,
    citizen_user_id: Uuid,
    admin_user_id: Uuid,
    source_hr_id: Uuid,
    source_fv_id: Uuid,
) -> Result<(), AppError> {
    // 1. Household: MIRA-FAM-10482
    let hh_row = sqlx::query(
        r#"
        INSERT INTO households (id, public_id, name, status, created_by)
        VALUES (gen_random_uuid(), 'MIRA-FAM-10482', 'Sharma Family', 'ACTIVE', $1)
        ON CONFLICT (public_id) DO UPDATE SET name = EXCLUDED.name, status = EXCLUDED.status
        RETURNING id
        "#,
    )
    .bind(citizen_user_id)
    .fetch_one(pool)
    .await?;

    let sharma_hh_id: Uuid = hh_row.get("id");

    // 2. 35 Members for Sharma Family (Multi-generational tree):
    // Generation 1 (Great-Grandparents / Grandparents / Elders)
    // Generation 2 (Rajesh & Siblings / In-laws / Cousins)
    // Generation 3 (Children)
    // Generation 4 (Infants / Dependents)
    let sharma_persons = [
        // G2 Head & Applicant
        (
            "P-10482-01",
            "Rajesh",
            "Sharma",
            NaiveDate::from_ymd_opt(1985, 3, 12),
            "Male",
            "demo.citizen@mira.demo",
            "XXXX-XXXX-4821",
            "HEAD",
        ),
        (
            "P-10482-02",
            "Sunita",
            "Sharma",
            NaiveDate::from_ymd_opt(1988, 7, 24),
            "Female",
            "sunita.sharma@mira.demo",
            "XXXX-XXXX-7722",
            "SPOUSE",
        ),
        // G1 Elders
        (
            "P-10482-03",
            "Devraj",
            "Sharma",
            NaiveDate::from_ymd_opt(1938, 4, 10),
            "Male",
            "devraj.sharma@mira.demo",
            "XXXX-XXXX-3801",
            "DEPENDENT",
        ),
        (
            "P-10482-04",
            "Kamala",
            "Sharma",
            NaiveDate::from_ymd_opt(1941, 8, 15),
            "Female",
            "kamala.sharma@mira.demo",
            "XXXX-XXXX-4102",
            "DEPENDENT",
        ),
        (
            "P-10482-05",
            "Meena",
            "Sharma",
            NaiveDate::from_ymd_opt(1960, 11, 4),
            "Female",
            "meena.sharma@mira.demo",
            "XXXX-XXXX-1102",
            "DEPENDENT",
        ),
        (
            "P-10482-06",
            "Ramakant",
            "Sharma",
            NaiveDate::from_ymd_opt(1958, 2, 19),
            "Male",
            "ramakant.sharma@mira.demo",
            "XXXX-XXXX-5803",
            "DEPENDENT",
        ),
        (
            "P-10482-07",
            "Harish",
            "Sharma",
            NaiveDate::from_ymd_opt(1962, 9, 5),
            "Male",
            "harish.sharma@mira.demo",
            "XXXX-XXXX-6204",
            "DEPENDENT",
        ),
        (
            "P-10482-08",
            "Shashi",
            "Sharma",
            NaiveDate::from_ymd_opt(1965, 6, 12),
            "Female",
            "shashi.sharma@mira.demo",
            "XXXX-XXXX-6505",
            "DEPENDENT",
        ),
        // G2 Siblings & In-Laws (using SIBLING and OTHER to satisfy chk_membership_role)
        (
            "P-10482-09",
            "Manoj",
            "Sharma",
            NaiveDate::from_ymd_opt(1987, 5, 14),
            "Male",
            "manoj.sharma@mira.demo",
            "XXXX-XXXX-8706",
            "SIBLING",
        ),
        (
            "P-10482-10",
            "Pooja",
            "Sharma",
            NaiveDate::from_ymd_opt(1990, 1, 20),
            "Female",
            "pooja.sharma@mira.demo",
            "XXXX-XXXX-9007",
            "SIBLING",
        ),
        (
            "P-10482-11",
            "Suresh",
            "Sharma",
            NaiveDate::from_ymd_opt(1989, 10, 8),
            "Male",
            "suresh.sharma@mira.demo",
            "XXXX-XXXX-8908",
            "SIBLING",
        ),
        (
            "P-10482-12",
            "Kavita",
            "Sharma",
            NaiveDate::from_ymd_opt(1992, 4, 16),
            "Female",
            "kavita.sharma@mira.demo",
            "XXXX-XXXX-9209",
            "SIBLING",
        ),
        (
            "P-10482-13",
            "Anita",
            "Sharma",
            NaiveDate::from_ymd_opt(1991, 12, 3),
            "Female",
            "anita.sharma@mira.demo",
            "XXXX-XXXX-9110",
            "SIBLING",
        ),
        (
            "P-10482-14",
            "Deepak",
            "Verma",
            NaiveDate::from_ymd_opt(1988, 3, 29),
            "Male",
            "deepak.verma@mira.demo",
            "XXXX-XXXX-8811",
            "OTHER",
        ),
        (
            "P-10482-15",
            "Vikram",
            "Sharma",
            NaiveDate::from_ymd_opt(1984, 7, 11),
            "Male",
            "vikram.sharma@mira.demo",
            "XXXX-XXXX-8412",
            "SIBLING",
        ),
        (
            "P-10482-16",
            "Neha",
            "Sharma",
            NaiveDate::from_ymd_opt(1987, 11, 25),
            "Female",
            "neha.sharma@mira.demo",
            "XXXX-XXXX-8713",
            "OTHER",
        ),
        (
            "P-10482-17",
            "Sanjay",
            "Sharma",
            NaiveDate::from_ymd_opt(1986, 8, 17),
            "Male",
            "sanjay.sharma@mira.demo",
            "XXXX-XXXX-8614",
            "SIBLING",
        ),
        (
            "P-10482-18",
            "Ritu",
            "Sharma",
            NaiveDate::from_ymd_opt(1989, 2, 9),
            "Female",
            "ritu.sharma@mira.demo",
            "XXXX-XXXX-8915",
            "OTHER",
        ),
        // G3 Children
        (
            "P-10482-19",
            "Ananya",
            "Sharma",
            NaiveDate::from_ymd_opt(2012, 5, 18),
            "Female",
            "ananya.sharma@mira.demo",
            "XXXX-XXXX-9410",
            "CHILD",
        ),
        (
            "P-10482-20",
            "Aarav",
            "Sharma",
            NaiveDate::from_ymd_opt(2016, 9, 10),
            "Male",
            "aarav.sharma@mira.demo",
            "XXXX-XXXX-4412",
            "CHILD",
        ),
        (
            "P-10482-21",
            "Diya",
            "Sharma",
            NaiveDate::from_ymd_opt(2014, 3, 22),
            "Female",
            "diya.sharma@mira.demo",
            "XXXX-XXXX-1421",
            "CHILD",
        ),
        (
            "P-10482-22",
            "Rohan",
            "Sharma",
            NaiveDate::from_ymd_opt(2018, 7, 15),
            "Male",
            "rohan.sharma@mira.demo",
            "XXXX-XXXX-1822",
            "CHILD",
        ),
        (
            "P-10482-23",
            "Ishaan",
            "Sharma",
            NaiveDate::from_ymd_opt(2015, 11, 30),
            "Male",
            "ishaan.sharma@mira.demo",
            "XXXX-XXXX-1523",
            "CHILD",
        ),
        (
            "P-10482-24",
            "Tanya",
            "Sharma",
            NaiveDate::from_ymd_opt(2019, 4, 5),
            "Female",
            "tanya.sharma@mira.demo",
            "XXXX-XXXX-1924",
            "CHILD",
        ),
        (
            "P-10482-25",
            "Aryan",
            "Verma",
            NaiveDate::from_ymd_opt(2017, 6, 18),
            "Male",
            "aryan.verma@mira.demo",
            "XXXX-XXXX-1725",
            "CHILD",
        ),
        (
            "P-10482-26",
            "Simran",
            "Verma",
            NaiveDate::from_ymd_opt(2020, 9, 12),
            "Female",
            "simran.verma@mira.demo",
            "XXXX-XXXX-2026",
            "CHILD",
        ),
        (
            "P-10482-27",
            "Aditya",
            "Sharma",
            NaiveDate::from_ymd_opt(2013, 1, 25),
            "Male",
            "aditya.sharma@mira.demo",
            "XXXX-XXXX-1327",
            "CHILD",
        ),
        (
            "P-10482-28",
            "Riya",
            "Sharma",
            NaiveDate::from_ymd_opt(2016, 5, 8),
            "Female",
            "riya.sharma@mira.demo",
            "XXXX-XXXX-1628",
            "CHILD",
        ),
        (
            "P-10482-29",
            "Varun",
            "Sharma",
            NaiveDate::from_ymd_opt(2015, 8, 19),
            "Male",
            "varun.sharma@mira.demo",
            "XXXX-XXXX-1529",
            "CHILD",
        ),
        (
            "P-10482-30",
            "Khushi",
            "Sharma",
            NaiveDate::from_ymd_opt(2018, 12, 4),
            "Female",
            "khushi.sharma@mira.demo",
            "XXXX-XXXX-1830",
            "CHILD",
        ),
        (
            "P-10482-31",
            "Pranav",
            "Sharma",
            NaiveDate::from_ymd_opt(2021, 2, 14),
            "Male",
            "pranav.sharma@mira.demo",
            "XXXX-XXXX-2131",
            "CHILD",
        ),
        (
            "P-10482-32",
            "Sneha",
            "Sharma",
            NaiveDate::from_ymd_opt(2022, 8, 20),
            "Female",
            "sneha.sharma@mira.demo",
            "XXXX-XXXX-2232",
            "CHILD",
        ),
        (
            "P-10482-33",
            "Vihaan",
            "Sharma",
            NaiveDate::from_ymd_opt(2023, 4, 11),
            "Male",
            "vihaan.sharma@mira.demo",
            "XXXX-XXXX-2333",
            "CHILD",
        ),
        // G4 Great-Grandchildren / Dependents
        (
            "P-10482-34",
            "Krrish",
            "Sharma",
            NaiveDate::from_ymd_opt(2024, 6, 1),
            "Male",
            "krrish.sharma@mira.demo",
            "XXXX-XXXX-2434",
            "DEPENDENT",
        ),
        (
            "P-10482-35",
            "Anvi",
            "Sharma",
            NaiveDate::from_ymd_opt(2025, 1, 15),
            "Female",
            "anvi.sharma@mira.demo",
            "XXXX-XXXX-2535",
            "DEPENDENT",
        ),
    ];

    let mut person_map = std::collections::HashMap::new();

    for (pub_id, fname, lname, dob, gender, email, masked_id, role) in sharma_persons {
        let p_row = sqlx::query(
            r#"
            INSERT INTO persons (id, public_id, first_name, last_name, date_of_birth, gender, email, status, created_by)
            VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, 'ACTIVE', $7)
            ON CONFLICT (public_id) DO UPDATE
            SET first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name, email = EXCLUDED.email
            RETURNING id
            "#,
        )
        .bind(pub_id)
        .bind(fname)
        .bind(lname)
        .bind(dob)
        .bind(gender)
        .bind(email)
        .bind(citizen_user_id)
        .fetch_one(pool)
        .await?;

        let pid: Uuid = p_row.get("id");
        person_map.insert(pub_id, pid);

        // Aadhaar Identifier
        let _ = sqlx::query(
            r#"
            INSERT INTO person_identifiers (id, person_id, identifier_type, identifier_reference, source_id, verified)
            VALUES (gen_random_uuid(), $1, 'DEMO_AADHAAR', $2, $3, true)
            "#,
        )
        .bind(pid)
        .bind(masked_id)
        .bind(source_hr_id)
        .execute(pool)
        .await;

        // Household Membership
        let _ = sqlx::query(
            r#"
            INSERT INTO household_memberships (id, household_id, person_id, membership_role, valid_from, source_id, verification_status, confidence, created_by)
            VALUES (gen_random_uuid(), $1, $2, $3, '2010-02-14', $4, 'VERIFIED', 1.00, $5)
            "#,
        )
        .bind(sharma_hh_id)
        .bind(pid)
        .bind(role)
        .bind(source_hr_id)
        .bind(citizen_user_id)
        .execute(pool)
        .await;
    }

    let rajesh_id = person_map["P-10482-01"];
    let sunita_id = person_map["P-10482-02"];
    let devraj_id = person_map["P-10482-03"];
    let kamala_id = person_map["P-10482-04"];
    let meena_id = person_map["P-10482-05"];
    let ramakant_id = person_map["P-10482-06"];
    let harish_id = person_map["P-10482-07"];
    let shashi_id = person_map["P-10482-08"];
    let manoj_id = person_map["P-10482-09"];
    let pooja_id = person_map["P-10482-10"];
    let suresh_id = person_map["P-10482-11"];
    let kavita_id = person_map["P-10482-12"];
    let anita_id = person_map["P-10482-13"];
    let deepak_id = person_map["P-10482-14"];
    let vikram_id = person_map["P-10482-15"];
    let neha_id = person_map["P-10482-16"];
    let sanjay_id = person_map["P-10482-17"];
    let ritu_id = person_map["P-10482-18"];
    let ananya_id = person_map["P-10482-19"];
    let aarav_id = person_map["P-10482-20"];
    let diya_id = person_map["P-10482-21"];
    let rohan_id = person_map["P-10482-22"];
    let ishaan_id = person_map["P-10482-23"];
    let tanya_id = person_map["P-10482-24"];
    let aryan_id = person_map["P-10482-25"];
    let simran_id = person_map["P-10482-26"];
    let aditya_id = person_map["P-10482-27"];
    let riya_id = person_map["P-10482-28"];
    let varun_id = person_map["P-10482-29"];
    let khushi_id = person_map["P-10482-30"];
    let pranav_id = person_map["P-10482-31"];
    let sneha_id = person_map["P-10482-32"];
    let vihaan_id = person_map["P-10482-33"];

    // 3. Relationships for Sharma Family Tree:
    let rels = [
        // G1 Marriages & Lineage
        (
            devraj_id,
            kamala_id,
            "SPOUSE",
            NaiveDate::from_ymd_opt(1957, 5, 20).unwrap(),
        ),
        (
            devraj_id,
            ramakant_id,
            "PARENT",
            NaiveDate::from_ymd_opt(1958, 2, 19).unwrap(),
        ),
        (
            kamala_id,
            ramakant_id,
            "PARENT",
            NaiveDate::from_ymd_opt(1958, 2, 19).unwrap(),
        ),
        (
            devraj_id,
            harish_id,
            "PARENT",
            NaiveDate::from_ymd_opt(1962, 9, 5).unwrap(),
        ),
        (
            kamala_id,
            harish_id,
            "PARENT",
            NaiveDate::from_ymd_opt(1962, 9, 5).unwrap(),
        ),
        (
            ramakant_id,
            meena_id,
            "SPOUSE",
            NaiveDate::from_ymd_opt(1983, 11, 28).unwrap(),
        ),
        (
            harish_id,
            shashi_id,
            "SPOUSE",
            NaiveDate::from_ymd_opt(1983, 2, 14).unwrap(),
        ),
        // G2 Marriages & Lineage
        (
            ramakant_id,
            rajesh_id,
            "PARENT",
            NaiveDate::from_ymd_opt(1985, 3, 12).unwrap(),
        ),
        (
            meena_id,
            rajesh_id,
            "PARENT",
            NaiveDate::from_ymd_opt(1985, 3, 12).unwrap(),
        ),
        (
            ramakant_id,
            manoj_id,
            "PARENT",
            NaiveDate::from_ymd_opt(1987, 5, 14).unwrap(),
        ),
        (
            meena_id,
            manoj_id,
            "PARENT",
            NaiveDate::from_ymd_opt(1987, 5, 14).unwrap(),
        ),
        (
            ramakant_id,
            suresh_id,
            "PARENT",
            NaiveDate::from_ymd_opt(1989, 10, 8).unwrap(),
        ),
        (
            meena_id,
            suresh_id,
            "PARENT",
            NaiveDate::from_ymd_opt(1989, 10, 8).unwrap(),
        ),
        (
            ramakant_id,
            anita_id,
            "PARENT",
            NaiveDate::from_ymd_opt(1991, 12, 3).unwrap(),
        ),
        (
            meena_id,
            anita_id,
            "PARENT",
            NaiveDate::from_ymd_opt(1991, 12, 3).unwrap(),
        ),
        (
            harish_id,
            vikram_id,
            "PARENT",
            NaiveDate::from_ymd_opt(1984, 7, 11).unwrap(),
        ),
        (
            shashi_id,
            vikram_id,
            "PARENT",
            NaiveDate::from_ymd_opt(1984, 7, 11).unwrap(),
        ),
        (
            harish_id,
            sanjay_id,
            "PARENT",
            NaiveDate::from_ymd_opt(1986, 8, 17).unwrap(),
        ),
        (
            shashi_id,
            sanjay_id,
            "PARENT",
            NaiveDate::from_ymd_opt(1986, 8, 17).unwrap(),
        ),
        (
            rajesh_id,
            sunita_id,
            "SPOUSE",
            NaiveDate::from_ymd_opt(2010, 2, 14).unwrap(),
        ),
        (
            manoj_id,
            pooja_id,
            "SPOUSE",
            NaiveDate::from_ymd_opt(2012, 11, 20).unwrap(),
        ),
        (
            suresh_id,
            kavita_id,
            "SPOUSE",
            NaiveDate::from_ymd_opt(2014, 5, 12).unwrap(),
        ),
        (
            deepak_id,
            anita_id,
            "SPOUSE",
            NaiveDate::from_ymd_opt(2015, 12, 8).unwrap(),
        ),
        (
            vikram_id,
            neha_id,
            "SPOUSE",
            NaiveDate::from_ymd_opt(2011, 4, 18).unwrap(),
        ),
        (
            sanjay_id,
            ritu_id,
            "SPOUSE",
            NaiveDate::from_ymd_opt(2013, 9, 22).unwrap(),
        ),
        // G3 Lineage
        (
            rajesh_id,
            ananya_id,
            "PARENT",
            NaiveDate::from_ymd_opt(2012, 5, 18).unwrap(),
        ),
        (
            sunita_id,
            ananya_id,
            "PARENT",
            NaiveDate::from_ymd_opt(2012, 5, 18).unwrap(),
        ),
        (
            rajesh_id,
            aarav_id,
            "PARENT",
            NaiveDate::from_ymd_opt(2016, 9, 10).unwrap(),
        ),
        (
            sunita_id,
            aarav_id,
            "PARENT",
            NaiveDate::from_ymd_opt(2016, 9, 10).unwrap(),
        ),
        (
            manoj_id,
            diya_id,
            "PARENT",
            NaiveDate::from_ymd_opt(2014, 3, 22).unwrap(),
        ),
        (
            pooja_id,
            diya_id,
            "PARENT",
            NaiveDate::from_ymd_opt(2014, 3, 22).unwrap(),
        ),
        (
            manoj_id,
            rohan_id,
            "PARENT",
            NaiveDate::from_ymd_opt(2018, 7, 15).unwrap(),
        ),
        (
            pooja_id,
            rohan_id,
            "PARENT",
            NaiveDate::from_ymd_opt(2018, 7, 15).unwrap(),
        ),
        (
            manoj_id,
            pranav_id,
            "PARENT",
            NaiveDate::from_ymd_opt(2021, 2, 14).unwrap(),
        ),
        (
            pooja_id,
            pranav_id,
            "PARENT",
            NaiveDate::from_ymd_opt(2021, 2, 14).unwrap(),
        ),
        (
            suresh_id,
            ishaan_id,
            "PARENT",
            NaiveDate::from_ymd_opt(2015, 11, 30).unwrap(),
        ),
        (
            kavita_id,
            ishaan_id,
            "PARENT",
            NaiveDate::from_ymd_opt(2015, 11, 30).unwrap(),
        ),
        (
            suresh_id,
            tanya_id,
            "PARENT",
            NaiveDate::from_ymd_opt(2019, 4, 5).unwrap(),
        ),
        (
            kavita_id,
            tanya_id,
            "PARENT",
            NaiveDate::from_ymd_opt(2019, 4, 5).unwrap(),
        ),
        (
            suresh_id,
            sneha_id,
            "PARENT",
            NaiveDate::from_ymd_opt(2022, 8, 20).unwrap(),
        ),
        (
            kavita_id,
            sneha_id,
            "PARENT",
            NaiveDate::from_ymd_opt(2022, 8, 20).unwrap(),
        ),
        (
            deepak_id,
            aryan_id,
            "PARENT",
            NaiveDate::from_ymd_opt(2017, 6, 18).unwrap(),
        ),
        (
            anita_id,
            aryan_id,
            "PARENT",
            NaiveDate::from_ymd_opt(2017, 6, 18).unwrap(),
        ),
        (
            deepak_id,
            simran_id,
            "PARENT",
            NaiveDate::from_ymd_opt(2020, 9, 12).unwrap(),
        ),
        (
            anita_id,
            simran_id,
            "PARENT",
            NaiveDate::from_ymd_opt(2020, 9, 12).unwrap(),
        ),
        (
            vikram_id,
            aditya_id,
            "PARENT",
            NaiveDate::from_ymd_opt(2013, 1, 25).unwrap(),
        ),
        (
            neha_id,
            aditya_id,
            "PARENT",
            NaiveDate::from_ymd_opt(2013, 1, 25).unwrap(),
        ),
        (
            vikram_id,
            riya_id,
            "PARENT",
            NaiveDate::from_ymd_opt(2016, 5, 8).unwrap(),
        ),
        (
            neha_id,
            riya_id,
            "PARENT",
            NaiveDate::from_ymd_opt(2016, 5, 8).unwrap(),
        ),
        (
            vikram_id,
            vihaan_id,
            "PARENT",
            NaiveDate::from_ymd_opt(2023, 4, 11).unwrap(),
        ),
        (
            neha_id,
            vihaan_id,
            "PARENT",
            NaiveDate::from_ymd_opt(2023, 4, 11).unwrap(),
        ),
        (
            sanjay_id,
            varun_id,
            "PARENT",
            NaiveDate::from_ymd_opt(2015, 8, 19).unwrap(),
        ),
        (
            ritu_id,
            varun_id,
            "PARENT",
            NaiveDate::from_ymd_opt(2015, 8, 19).unwrap(),
        ),
        (
            sanjay_id,
            khushi_id,
            "PARENT",
            NaiveDate::from_ymd_opt(2018, 12, 4).unwrap(),
        ),
        (
            ritu_id,
            khushi_id,
            "PARENT",
            NaiveDate::from_ymd_opt(2018, 12, 4).unwrap(),
        ),
    ];

    for (p_a, p_b, rtype, vfrom) in rels {
        let _ = sqlx::query(
            r#"
            INSERT INTO person_relationships (id, person_a_id, person_b_id, relationship_type, valid_from, source_id, verification_status, confidence, created_by)
            VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, 'VERIFIED', 1.00, $6)
            "#,
        )
        .bind(p_a)
        .bind(p_b)
        .bind(rtype)
        .bind(vfrom)
        .bind(source_fv_id)
        .bind(citizen_user_id)
        .execute(pool)
        .await;
    }

    // 4. Property for Sharma Family
    let prop_row = sqlx::query(
        r#"
        INSERT INTO properties (id, public_id, property_type, address_line, locality, district, state, postal_code, latitude, longitude)
        VALUES (gen_random_uuid(), 'PROP-SHARMA-01', 'HOUSE', 'House No. 42, Ward 7, Demo District', 'Civil Lines', 'Demo District', 'Uttar Pradesh', '201001', 26.8467, 80.9462)
        ON CONFLICT (public_id) DO UPDATE SET address_line = EXCLUDED.address_line
        RETURNING id
        "#,
    )
    .fetch_one(pool)
    .await?;

    let sharma_prop_id: Uuid = prop_row.get("id");

    let _ = sqlx::query(
        r#"
        INSERT INTO property_associations (id, property_id, household_id, association_type, valid_from, verification_status, confidence)
        VALUES (gen_random_uuid(), $1, $2, 'HOUSEHOLD_OCCUPIES', '2010-02-14', 'VERIFIED', 1.00)
        "#,
    )
    .bind(sharma_prop_id)
    .bind(sharma_hh_id)
    .execute(pool)
    .await;

    // 5. Timeline Events for Sharma Family (Economic profile: ₹1,72,000 annual income)
    let timeline_events = [
        (
            "MARRIAGE",
            Some(rajesh_id),
            NaiveDate::from_ymd_opt(2010, 2, 14).unwrap(),
            "Marriage registered with Sunita Sharma",
            "Civil Registration Office",
        ),
        (
            "BIRTH",
            Some(ananya_id),
            NaiveDate::from_ymd_opt(2012, 5, 18).unwrap(),
            "Ananya Sharma born (BR-2012-0941)",
            "Civil Registration System",
        ),
        (
            "BIRTH",
            Some(aarav_id),
            NaiveDate::from_ymd_opt(2016, 9, 10).unwrap(),
            "Aarav Sharma born (BR-2016-4412)",
            "Civil Registration System",
        ),
        (
            "ADDRESS_UPDATE",
            Some(rajesh_id),
            NaiveDate::from_ymd_opt(2018, 6, 15).unwrap(),
            "Household address verified: House No. 42, Ward 7, Demo District",
            "Field Verification Unit",
        ),
        (
            "INCOME_CERTIFICATE",
            Some(rajesh_id),
            NaiveDate::from_ymd_opt(2025, 4, 10).unwrap(),
            "Income certificate verified: ₹1,72,000 / year (Under ₹2,00,000 poverty line)",
            "Revenue Department",
        ),
        (
            "SCHEME_APPLICATION",
            Some(rajesh_id),
            NaiveDate::from_ymd_opt(2026, 1, 12).unwrap(),
            "Student Scholarship application submitted for Ananya Sharma",
            "Mira Welfare Portal",
        ),
    ];

    for (etype, pid, edate, desc, sname) in timeline_events {
        let _ = sqlx::query(
            r#"
            INSERT INTO life_events (id, event_type, person_id, household_id, effective_date, metadata, created_by)
            VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6)
            "#,
        )
        .bind(etype)
        .bind(pid)
        .bind(sharma_hh_id)
        .bind(edate)
        .bind(serde_json::json!({
            "description": desc,
            "source_name": sname,
            "verification_status": "VERIFIED",
            "verified_by": "Field Verification Officer"
        }))
        .bind(citizen_user_id)
        .execute(pool)
        .await;
    }

    // 6. Schemes references
    let sch_scholarship_id: Uuid =
        sqlx::query_scalar("SELECT id FROM schemes WHERE code = 'SCH_STUDENT_SCHOLARSHIP'")
            .fetch_one(pool)
            .await?;
    let sch_sanitation_id: Uuid =
        sqlx::query_scalar("SELECT id FROM schemes WHERE code = 'SCH_HH_SANITATION'")
            .fetch_one(pool)
            .await?;
    let sch_housing_id: Uuid =
        sqlx::query_scalar("SELECT id FROM schemes WHERE code = 'SCH_RURAL_HOUSING'")
            .fetch_one(pool)
            .await?;
    let sch_water_id: Uuid =
        sqlx::query_scalar("SELECT id FROM schemes WHERE code = 'SCH_WATER_CONNECTION'")
            .fetch_one(pool)
            .await?;
    let sch_health_id: Uuid =
        sqlx::query_scalar("SELECT id FROM schemes WHERE code = 'SCH_AYUSHMAN_HEALTH'")
            .fetch_one(pool)
            .await?;
    let sch_pension_id: Uuid =
        sqlx::query_scalar("SELECT id FROM schemes WHERE code = 'SCH_SENIOR_PENSION'")
            .fetch_one(pool)
            .await?;

    // ------------------------------------------------------------------------
    // APPLICATION 1: Student Scholarship (EVIDENCE_REQUIRED - Clarification Loop)
    // ------------------------------------------------------------------------
    let app_scholar_row = sqlx::query(
        r#"
        INSERT INTO applications (
            id, public_id, application_number, scheme_id, applicant_person_id, target_person_id,
            submitted_at, status, current_stage, application_date, metadata, created_by
        )
        VALUES (
            gen_random_uuid(), 'APP-2026-10482', 'APP-SCHOLAR-2026-10482', $1, $2, $3,
            '2026-01-12T09:30:00Z', 'EVIDENCE_REQUIRED', 'EVIDENCE_REQUIRED', '2026-01-12', $4, $5
        )
        RETURNING id
        "#,
    )
    .bind(sch_scholarship_id)
    .bind(rajesh_id)
    .bind(ananya_id)
    .bind(serde_json::json!({
        "declared_income": 172000,
        "applicant_name": "Rajesh Sharma",
        "target_name": "Ananya Sharma",
        "household_public_id": "MIRA-FAM-10482",
        "evidence_requests": [
            {
                "id": "EV-REQ-10482",
                "evidence_type": "RESIDENCE_PROOF",
                "reason": "Address Variation Flagged",
                "description": "Preliminary document extraction found address text variation with municipal database. Please upload current address proof or electricity bill.",
                "deadline": "2026-02-15",
                "requested_by": admin_user_id,
                "requested_at": "2026-01-14T11:00:00Z",
                "status": "OPEN"
            }
        ],
        "clarification_needed": true,
        "notes": "Evidence requested by Verification Officer Vikram Malhotra."
    }))
    .bind(citizen_user_id)
    .fetch_one(pool)
    .await?;

    let app_scholar_id: Uuid = app_scholar_row.get("id");

    let _ = sqlx::query(
        r#"
        INSERT INTO notifications (id, user_id, type, title, message, entity_type, entity_id)
        VALUES (gen_random_uuid(), $1, 'ACTION_REQUIRED', 'Action Required: Additional Evidence for APP-SCHOLAR-2026-10482', 'Verification officer requested updated residence document for application APP-SCHOLAR-2026-10482.', 'APPLICATION', $2)
        "#,
    )
    .bind(citizen_user_id)
    .bind(app_scholar_id.to_string())
    .execute(pool)
    .await;

    // ------------------------------------------------------------------------
    // APPLICATION 2: Sanitation Support (UNDER_VERIFICATION - Duplicate Alert)
    // ------------------------------------------------------------------------
    let app_san_row = sqlx::query(
        r#"
        INSERT INTO applications (
            id, public_id, application_number, scheme_id, applicant_person_id, target_household_id, target_property_id,
            submitted_at, status, current_stage, application_date, metadata, created_by
        )
        VALUES (
            gen_random_uuid(), 'APP-2026-10483', 'APP-SAN-2026-10483', $1, $2, $3, $4,
            '2026-01-14T14:00:00Z', 'UNDER_VERIFICATION', 'OFFICER_REVIEW', '2026-01-14', $5, $6
        )
        RETURNING id
        "#,
    )
    .bind(sch_sanitation_id)
    .bind(rajesh_id)
    .bind(sharma_hh_id)
    .bind(sharma_prop_id)
    .bind(serde_json::json!({
        "declared_income": 172000,
        "duplicate_alert": true,
        "notes": "Potential overlap identified with prior household sanitation record."
    }))
    .bind(citizen_user_id)
    .fetch_one(pool)
    .await?;

    let app_san_id: Uuid = app_san_row.get("id");

    let dup_case_row = sqlx::query(
        r#"
        INSERT INTO benefit_duplicate_cases (
            id, public_id, application_id, scheme_id, benefit_scope, benefit_unit_type,
            household_id, status, priority, assessment, reason, recommended_action, created_by
        )
        VALUES (
            gen_random_uuid(), 'CASE-DUP-2026-10483', $1, $2, 'HOUSEHOLD', 'HOUSEHOLD',
            $3, 'OPEN', 'MEDIUM', 'POTENTIAL_DUPLICATE',
            'Potential duplicate detected: Lineage cross-match shows prior sanitation asset allocated under family ancestor record.',
            'MANUAL_REVIEW', $4
        )
        RETURNING id
        "#,
    )
    .bind(app_san_id)
    .bind(sch_sanitation_id)
    .bind(sharma_hh_id)
    .bind(admin_user_id)
    .fetch_one(pool)
    .await?;

    let dup_case_id: Uuid = dup_case_row.get("id");

    let existing_ben_row = sqlx::query(
        r#"
        INSERT INTO benefits (
            id, public_id, scheme_id, benefit_unit_type, household_id,
            status, approved_at, disbursed_at, valid_from, valid_to, amount, currency,
            description, created_by
        )
        VALUES (
            gen_random_uuid(), 'BEN-SAN-2021-HIST', $1, 'HOUSEHOLD', $2,
            'DISBURSED', '2021-03-15T10:00:00Z', '2021-03-20T10:00:00Z', '2021-03-15', '2026-03-15',
            12000.00, 'INR', 'Prior rural sanitation asset granted to ancestral Sharma lineage', $3
        )
        RETURNING id
        "#,
    )
    .bind(sch_sanitation_id)
    .bind(sharma_hh_id)
    .bind(admin_user_id)
    .fetch_one(pool)
    .await?;

    let existing_ben_id: Uuid = existing_ben_row.get("id");

    let _ = sqlx::query(
        r#"
        INSERT INTO benefit_duplicate_candidates (
            id, case_id, existing_benefit_id, candidate_rank, duplicate_category, overlap_score, explanation
        )
        VALUES (
            gen_random_uuid(), $1, $2, 1, 'POTENTIAL_DUPLICATE', 0.84,
            'Prior sanitation asset allocated in 2021 under ancestor record. Verification required to confirm whether this is a legitimate new dwelling unit.'
        )
        "#,
    )
    .bind(dup_case_id)
    .bind(existing_ben_id)
    .execute(pool)
    .await;

    // ------------------------------------------------------------------------
    // APPLICATION 3: Rural Housing Assistance (SUBMITTED - Document Review)
    // ------------------------------------------------------------------------
    let app_house_row = sqlx::query(
        r#"
        INSERT INTO applications (
            id, public_id, application_number, scheme_id, applicant_person_id, target_household_id, target_property_id,
            submitted_at, status, current_stage, application_date, metadata, created_by
        )
        VALUES (
            gen_random_uuid(), 'APP-2026-10484', 'APP-HOUSE-2026-10484', $1, $2, $3, $4,
            '2026-01-16T11:00:00Z', 'SUBMITTED', 'DOCUMENT_REVIEW', '2026-01-16', $5, $6
        )
        RETURNING id
        "#,
    )
    .bind(sch_housing_id)
    .bind(rajesh_id)
    .bind(sharma_hh_id)
    .bind(sharma_prop_id)
    .bind(serde_json::json!({
        "declared_income": 172000,
        "housing_type": "Kutcha",
        "notes": "Application submitted with Income Certificate and Land Khatauni."
    }))
    .bind(citizen_user_id)
    .fetch_one(pool)
    .await?;

    let _app_house_id: Uuid = app_house_row.get("id");

    // ------------------------------------------------------------------------
    // APPLICATION 4: Water Connection (UNDER_VERIFICATION - Ready for Scheme Officer)
    // ------------------------------------------------------------------------
    let app_water_row = sqlx::query(
        r#"
        INSERT INTO applications (
            id, public_id, application_number, scheme_id, applicant_person_id, target_property_id,
            submitted_at, status, current_stage, application_date, metadata, created_by
        )
        VALUES (
            gen_random_uuid(), 'APP-2026-10485', 'APP-WATER-2026-10485', $1, $2, $3,
            '2026-01-10T08:00:00Z', 'UNDER_VERIFICATION', 'SCHEME_REVIEW', '2026-01-10', $4, $5
        )
        RETURNING id
        "#,
    )
    .bind(sch_water_id)
    .bind(rajesh_id)
    .bind(sharma_prop_id)
    .bind(serde_json::json!({
        "declared_income": 172000,
        "connection_type": "DOMESTIC",
        "officer_verification": "SATISFIED",
        "notes": "Field inspection verified tap line proximity. Ready for Scheme Officer approval."
    }))
    .bind(citizen_user_id)
    .fetch_one(pool)
    .await?;

    let _app_water_id: Uuid = app_water_row.get("id");

    // ------------------------------------------------------------------------
    // APPLICATION 5: Ayushman Universal Healthcare (APPROVED - Disbursed Benefit)
    // ------------------------------------------------------------------------
    let app_health_row = sqlx::query(
        r#"
        INSERT INTO applications (
            id, public_id, application_number, scheme_id, applicant_person_id, target_household_id,
            submitted_at, status, current_stage, application_date, metadata, created_by
        )
        VALUES (
            gen_random_uuid(), 'APP-2026-10486', 'APP-HEALTH-2026-10486', $1, $2, $3,
            '2025-11-01T10:00:00Z', 'APPROVED', 'BENEFIT_DISBURSED', '2025-11-01', $4, $5
        )
        RETURNING id
        "#,
    )
    .bind(sch_health_id)
    .bind(rajesh_id)
    .bind(sharma_hh_id)
    .bind(serde_json::json!({
        "declared_income": 172000,
        "beneficiary_count": 35,
        "card_number": "PMJAY-2025-10482-GOLD"
    }))
    .bind(citizen_user_id)
    .fetch_one(pool)
    .await?;

    let app_health_id: Uuid = app_health_row.get("id");

    let _ = sqlx::query(
        r#"
        INSERT INTO benefits (
            id, public_id, scheme_id, application_id, benefit_unit_type, household_id,
            status, approved_at, disbursed_at, valid_from, valid_to, amount, currency,
            description, created_by
        )
        VALUES (
            gen_random_uuid(), 'BEN-2026-10486', $1, $2, 'HOUSEHOLD', $3,
            'APPROVED', '2025-11-10T12:00:00Z', '2025-11-15T00:00:00Z', '2025-11-10', '2026-11-10',
            500000.00, 'INR', 'Ayushman Bharat Family Healthcare Golden Protection Card', $4
        )
        "#,
    )
    .bind(sch_health_id)
    .bind(app_health_id)
    .bind(sharma_hh_id)
    .bind(admin_user_id)
    .execute(pool)
    .await;

    // ------------------------------------------------------------------------
    // APPLICATION 6: Senior Citizen Pension for Meena Sharma (SUPERVISOR_REVIEW - Escalated)
    // ------------------------------------------------------------------------
    let app_pension_row = sqlx::query(
        r#"
        INSERT INTO applications (
            id, public_id, application_number, scheme_id, applicant_person_id, target_person_id,
            submitted_at, status, current_stage, application_date, metadata, created_by
        )
        VALUES (
            gen_random_uuid(), 'APP-2026-10487', 'APP-PENSION-2026-10487', $1, $2, $3,
            '2026-01-18T14:30:00Z', 'UNDER_VERIFICATION', 'SUPERVISOR_REVIEW', '2026-01-18', $4, $5
        )
        RETURNING id
        "#,
    )
    .bind(sch_pension_id)
    .bind(rajesh_id)
    .bind(meena_id)
    .bind(serde_json::json!({
        "declared_income": 172000,
        "target_name": "Meena Sharma",
        "target_age": 65,
        "escalation": {
            "reason": "Special Pension Tier Approval",
            "escalated_to": "Supervisor Arun Deshmukh",
            "notes": "Elder dependent meets base age criteria. Escalated for second supervisor sign-off on widow pension overlay."
        }
    }))
    .bind(citizen_user_id)
    .fetch_one(pool)
    .await?;

    let _app_pension_id: Uuid = app_pension_row.get("id");

    Ok(())
}

async fn seed_demo_documents(pool: &PgPool) -> Result<(), AppError> {
    let citizen_user_id = sqlx::query_scalar::<_, Uuid>(
        "SELECT id FROM users WHERE email = 'demo.citizen@mira.demo' OR email = 'citizen@mira.local' ORDER BY (email = 'demo.citizen@mira.demo') DESC LIMIT 1"
    )
    .fetch_optional(pool)
    .await?
    .unwrap_or_else(Uuid::new_v4);

    let storage = Path::new("data/storage/safe_store");
    tokio::fs::create_dir_all(storage)
        .await
        .map_err(|e| AppError::Internal(format!("Unable to prepare document storage: {e}")))?;

    // 10 realistic synthetic documents for Rajesh Sharma:
    let docs = [
        // 1. Aadhaar Card
        (
            "DOC-DEMO-AADHAAR-01",
            "Aadhaar Card - Rajesh Sharma.pdf",
            "IDENTITY_SUPPORTING_DOCUMENT",
            "VERIFIED",
            None,
            10,
        ),
        // 2. Synthetic altered document: Income Certificate (declared ₹1,72,000 vs OCR ₹2,31,000)
        (
            "DOC-DEMO-INCOME-01",
            "Income Certificate 2025-26.pdf",
            "INCOME_CERTIFICATE",
            "ACTION_REQUIRED",
            None,
            5,
        ),
        // 3. Residence Certificate with address discrepancy
        (
            "DOC-DEMO-RESIDENCE-01",
            "Residence Certificate - Ward 7.pdf",
            "RESIDENCE_CERTIFICATE",
            "ACTION_REQUIRED",
            None,
            4,
        ),
        // 4. BPL Priority Ration Card (expired)
        (
            "DOC-DEMO-RATION-01",
            "BPL Priority Ration Card.pdf",
            "OTHER",
            "EXPIRED",
            Some("2025-03-31T00:00:00Z"),
            220,
        ),
        // 5. Land Revenue Record (Pending Review)
        (
            "DOC-DEMO-LAND-01",
            "Land Revenue Record - Khatauni.pdf",
            "PROPERTY_DOCUMENT",
            "PENDING_REVIEW",
            None,
            2,
        ),
        // 6. Utility Bill (Verified residence proof)
        (
            "DOC-DEMO-UTIL-01",
            "Electricity Utility Bill - Latest.pdf",
            "RESIDENCE_PROOF",
            "VERIFIED",
            None,
            3,
        ),
        // 7. Caste Certificate (Verified)
        (
            "DOC-DEMO-CASTE-01",
            "Caste & Category Certificate.pdf",
            "COMMUNITY_CERTIFICATE",
            "VERIFIED",
            None,
            40,
        ),
        // 8. Education Certificate
        (
            "DOC-DEMO-EDU-01",
            "School Enrollment Certificate - Ananya.pdf",
            "EDUCATION_CERTIFICATE",
            "VERIFIED",
            None,
            12,
        ),
        // 9. Bank Passbook
        (
            "DOC-DEMO-BANK-01",
            "Bank Passbook Front Page.pdf",
            "FINANCIAL_DOCUMENT",
            "VERIFIED",
            None,
            15,
        ),
        // 10. Medical Card
        (
            "DOC-DEMO-HEALTH-01",
            "Health Assessment Card.pdf",
            "MEDICAL_CERTIFICATE",
            "VERIFIED",
            None,
            20,
        ),
    ];

    let mut doc_map = std::collections::HashMap::new();

    for (pub_id, filename, doc_type, verification, expiry, age_days) in docs {
        let label = filename.trim_end_matches(".pdf");
        let bytes = synthetic_demo_pdf(label);
        let hash = format!("{:x}", Sha256::digest(&bytes));
        let key = format!("{}.pdf", Uuid::new_v4());
        tokio::fs::write(storage.join(&key), &bytes)
            .await
            .map_err(|e| AppError::Internal(format!("Unable to seed demo document object: {e}")))?;

        let row = sqlx::query(
            r#"INSERT INTO documents (
                public_id, owner_type, owner_id, document_type, original_filename, detected_mime_type,
                size_bytes, original_size_bytes, sha256, storage_reference, status, verification_status, expires_at, created_by,
                created_at, updated_at
            ) VALUES ($1, 'CITIZEN', $2, $3, $4, 'application/pdf', $5, $5, $6, $7, 'READY', $8, $9, $2,
                NOW() - ($10 * INTERVAL '1 day'), NOW() - ($10 * INTERVAL '1 day')) RETURNING id"#,
        )
        .bind(pub_id)
        .bind(citizen_user_id)
        .bind(doc_type)
        .bind(filename)
        .bind(bytes.len() as i64)
        .bind(&hash)
        .bind(&key)
        .bind(verification)
        .bind(expiry.map(|date| date.parse::<chrono::DateTime<chrono::Utc>>()).transpose().map_err(|e| AppError::Internal(e.to_string()))?)
        .bind(age_days)
        .fetch_one(pool)
        .await
        .map_err(|e| AppError::Internal(format!("Unable to seed document metadata: {e}")))?;

        let document_id: Uuid = row.get("id");
        doc_map.insert(pub_id, document_id);

        sqlx::query("INSERT INTO document_versions (document_id, version_type, storage_reference, mime_type, size_bytes, sha256, compression_type) VALUES ($1, 'ORIGINAL', $2, 'application/pdf', $3, $4, 'NONE')")
            .bind(document_id).bind(&key).bind(bytes.len() as i64).bind(&hash).execute(pool).await?;

        sqlx::query("INSERT INTO document_access_logs (document_id, user_id, action, purpose) VALUES ($1, $2, 'PROCESS', 'CITIZEN_SELF_SERVICE')")
            .bind(document_id).bind(citizen_user_id).execute(pool).await?;

        // Structured OCR Extractions
        if pub_id == "DOC-DEMO-AADHAAR-01" {
            let _ = sqlx::query(
                r#"
                INSERT INTO document_extractions (document_id, field, value, normalized_value, confidence, extraction_method, status)
                VALUES 
                ($1, 'Name', 'Rajesh Sharma', 'RAJESH SHARMA', 0.98, 'DEMO_OCR_SIMULATION', 'OFFICER_VERIFIED'),
                ($1, 'DOB', '12 March 1985', '1985-03-12', 0.97, 'DEMO_OCR_SIMULATION', 'OFFICER_VERIFIED'),
                ($1, 'Document Number', 'XXXX-XXXX-4821', 'XXXX-XXXX-4821', 0.99, 'DEMO_OCR_SIMULATION', 'OFFICER_VERIFIED'),
                ($1, 'Address', 'House No. 42, Ward 7, Demo District, UP', 'HOUSE NO 42 WARD 7 DEMO DISTRICT UP', 0.95, 'DEMO_OCR_SIMULATION', 'OFFICER_VERIFIED')
                "#
            )
            .bind(document_id).execute(pool).await;
        } else if pub_id == "DOC-DEMO-INCOME-01" {
            // Synthetic altered document: declared ₹1,72,000 vs OCR extracted ₹2,31,000
            let _ = sqlx::query(
                r#"
                INSERT INTO document_extractions (document_id, field, value, normalized_value, confidence, extraction_method, status)
                VALUES 
                ($1, 'Declared Annual Income', '₹1,72,000', '172000', 0.95, 'DEMO_OCR_SIMULATION', 'OFFICER_VERIFIED'),
                ($1, 'Extracted OCR Income', '₹2,31,000', '231000', 0.82, 'DEMO_OCR_SIMULATION', 'CONFLICTING'),
                ($1, 'Discrepancy Note', 'Declared ₹1,72,000 vs OCR ₹2,31,000 exceeds ceiling threshold. Requires officer verification.', 'DISCREPANCY_FLAGGED', 0.90, 'DEMO_OCR_SIMULATION', 'CONFLICTING'),
                ($1, 'Certificate Number', 'IC-2025-UP-71829', 'IC-2025-UP-71829', 0.94, 'DEMO_OCR_SIMULATION', 'SYSTEM_EXTRACTED'),
                ($1, 'Issuing Authority', 'Tehsildar, Demo District', 'TEHSILDAR DEMO DISTRICT', 0.91, 'DEMO_OCR_SIMULATION', 'SYSTEM_EXTRACTED')
                "#
            )
            .bind(document_id).execute(pool).await;

            let _ = sqlx::query(
                r#"
                INSERT INTO document_consistency_checks (
                    id, document_id, check_type, field, result,
                    source_a_label, source_a_value, source_b_label, source_b_value,
                    action_recommended, explanation
                )
                VALUES (
                    gen_random_uuid(), $1, 'SCHEME_CONFLICT', 'income', 'CONFLICT',
                    'Declared Application Income', '₹1,72,000', 'OCR Extracted Revenue Stamp', '₹2,31,000',
                    'MANUAL_VERIFICATION_REQUIRED',
                    'Declared household income of ₹1,72,000 is under the ₹2,00,000 threshold, but raw OCR extraction reads ₹2,31,000 which exceeds the threshold. Officer verification and clarification required.'
                )
                "#
            )
            .bind(document_id).execute(pool).await;
        } else if pub_id == "DOC-DEMO-RESIDENCE-01" {
            let _ = sqlx::query(
                r#"
                INSERT INTO document_extractions (document_id, field, value, normalized_value, confidence, extraction_method, status)
                VALUES 
                ($1, 'Address', 'Ward 7, Civil Lines, Demo District', 'WARD 7 CIVIL LINES DEMO DISTRICT', 0.88, 'DEMO_OCR_SIMULATION', 'CONFLICTING'),
                ($1, 'Applicant Name', 'Rajesh Sharma', 'RAJESH SHARMA', 0.94, 'DEMO_OCR_SIMULATION', 'OFFICER_VERIFIED')
                "#
            )
            .bind(document_id).execute(pool).await;
        } else if pub_id == "DOC-DEMO-LAND-01" {
            let _ = sqlx::query(
                r#"
                INSERT INTO document_extractions (document_id, field, value, normalized_value, confidence, extraction_method, status)
                VALUES 
                ($1, 'Khasra Number', 'Plot 42/Ward 7', 'PLOT 42 WARD 7', 0.96, 'DEMO_OCR_SIMULATION', 'SYSTEM_EXTRACTED'),
                ($1, 'Holding Area', '0.18 Hectares', '0.18 HA', 0.93, 'DEMO_OCR_SIMULATION', 'SYSTEM_EXTRACTED')
                "#
            )
            .bind(document_id).execute(pool).await;
        } else if pub_id == "DOC-DEMO-UTIL-01" {
            let _ = sqlx::query(
                r#"
                INSERT INTO document_extractions (document_id, field, value, normalized_value, confidence, extraction_method, status)
                VALUES 
                ($1, 'Consumer Number', 'UPPCL-2026-99214', 'UPPCL-2026-99214', 0.97, 'DEMO_OCR_SIMULATION', 'OFFICER_VERIFIED'),
                ($1, 'Service Address', 'House No. 42, Ward 7, Demo District', 'HOUSE NO 42 WARD 7 DEMO DISTRICT', 0.95, 'DEMO_OCR_SIMULATION', 'OFFICER_VERIFIED')
                "#
            )
            .bind(document_id).execute(pool).await;
        } else if pub_id == "DOC-DEMO-EDU-01" {
            let _ = sqlx::query(
                r#"
                INSERT INTO document_extractions (document_id, field, value, normalized_value, confidence, extraction_method, status)
                VALUES 
                ($1, 'Student Name', 'Ananya Sharma', 'ANANYA SHARMA', 0.96, 'DEMO_OCR_SIMULATION', 'OFFICER_VERIFIED'),
                ($1, 'Class', 'Class VII', 'CLASS VII', 0.98, 'DEMO_OCR_SIMULATION', 'OFFICER_VERIFIED'),
                ($1, 'Institution', 'Government Model Inter College', 'GOVERNMENT MODEL INTER COLLEGE', 0.95, 'DEMO_OCR_SIMULATION', 'OFFICER_VERIFIED')
                "#
            )
            .bind(document_id).execute(pool).await;
        } else if pub_id == "DOC-DEMO-BANK-01" {
            let _ = sqlx::query(
                r#"
                INSERT INTO document_extractions (document_id, field, value, normalized_value, confidence, extraction_method, status)
                VALUES 
                ($1, 'Account Holder', 'Rajesh Sharma', 'RAJESH SHARMA', 0.97, 'DEMO_OCR_SIMULATION', 'OFFICER_VERIFIED'),
                ($1, 'Bank Name', 'State Bank of India', 'STATE BANK OF INDIA', 0.98, 'DEMO_OCR_SIMULATION', 'OFFICER_VERIFIED'),
                ($1, 'IFSC Code', 'SBIN0001234', 'SBIN0001234', 0.99, 'DEMO_OCR_SIMULATION', 'OFFICER_VERIFIED')
                "#
            )
            .bind(document_id).execute(pool).await;
        } else if pub_id == "DOC-DEMO-HEALTH-01" {
            let _ = sqlx::query(
                r#"
                INSERT INTO document_extractions (document_id, field, value, normalized_value, confidence, extraction_method, status)
                VALUES 
                ($1, 'Patient Name', 'Meena Sharma', 'MEENA SHARMA', 0.95, 'DEMO_OCR_SIMULATION', 'OFFICER_VERIFIED'),
                ($1, 'Assessment', 'Senior Age Health Certification', 'SENIOR AGE HEALTH CERTIFICATION', 0.94, 'DEMO_OCR_SIMULATION', 'OFFICER_VERIFIED')
                "#
            )
            .bind(document_id).execute(pool).await;
        }
    }

    // Link documents to seeded applications
    let app_docs = [
        // App 1: Student Scholarship
        ("APP-2026-10482", "DOC-DEMO-AADHAAR-01", "IDENTITY_PROOF"),
        ("APP-2026-10482", "DOC-DEMO-INCOME-01", "INCOME_CERTIFICATE"),
        ("APP-2026-10482", "DOC-DEMO-EDU-01", "EDUCATION_CERTIFICATE"),
        (
            "APP-2026-10482",
            "DOC-DEMO-RESIDENCE-01",
            "RESIDENCE_CERTIFICATE",
        ),
        // App 2: Sanitation
        ("APP-2026-10483", "DOC-DEMO-AADHAAR-01", "IDENTITY_PROOF"),
        (
            "APP-2026-10483",
            "DOC-DEMO-RESIDENCE-01",
            "RESIDENCE_CERTIFICATE",
        ),
        ("APP-2026-10483", "DOC-DEMO-UTIL-01", "RESIDENCE_PROOF"),
        // App 3: Rural Housing
        ("APP-2026-10484", "DOC-DEMO-INCOME-01", "INCOME_CERTIFICATE"),
        ("APP-2026-10484", "DOC-DEMO-LAND-01", "PROPERTY_DOCUMENT"),
        ("APP-2026-10484", "DOC-DEMO-AADHAAR-01", "IDENTITY_PROOF"),
        // App 4: Water Connection
        ("APP-2026-10485", "DOC-DEMO-LAND-01", "PROPERTY_DOCUMENT"),
        ("APP-2026-10485", "DOC-DEMO-UTIL-01", "RESIDENCE_PROOF"),
        // App 5: Healthcare
        ("APP-2026-10486", "DOC-DEMO-AADHAAR-01", "IDENTITY_PROOF"),
        ("APP-2026-10486", "DOC-DEMO-INCOME-01", "INCOME_CERTIFICATE"),
        ("APP-2026-10486", "DOC-DEMO-RATION-01", "BPL_CERTIFICATE"),
        // App 6: Pension
        ("APP-2026-10487", "DOC-DEMO-AADHAAR-01", "IDENTITY_PROOF"),
        ("APP-2026-10487", "DOC-DEMO-BANK-01", "BANK_PASSBOOK"),
        (
            "APP-2026-10487",
            "DOC-DEMO-HEALTH-01",
            "MEDICAL_CERTIFICATE",
        ),
    ];

    for (app_pub, doc_pub, req_type) in app_docs {
        let app_id: Option<Uuid> =
            sqlx::query_scalar("SELECT id FROM applications WHERE public_id = $1")
                .bind(app_pub)
                .fetch_optional(pool)
                .await?;
        let doc_id = doc_map.get(doc_pub).copied();

        if let (Some(aid), Some(did)) = (app_id, doc_id) {
            let _ = sqlx::query(
                r#"
                INSERT INTO application_documents (id, application_id, document_id, document_version_id, required_type, status, linked_by)
                VALUES (gen_random_uuid(), $1, $2, $2, $3, 'LINKED', $4)
                ON CONFLICT (application_id, document_id, document_version_id) DO NOTHING
                "#,
            )
            .bind(aid)
            .bind(did)
            .bind(req_type)
            .bind(citizen_user_id)
            .execute(pool)
            .await;
        }
    }

    Ok(())
}
