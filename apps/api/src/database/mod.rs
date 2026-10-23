use chrono::NaiveDate;
use sqlx::{postgres::PgPoolOptions, PgPool, Row};
use sha2::{Digest, Sha256};
use std::path::Path;
use uuid::Uuid;

use crate::{
    auth::PasswordService,
    domain::RoleType,
    errors::AppError,
};

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

    let _ = sqlx::query("SELECT pg_advisory_unlock(88127391)").execute(pool).await;

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

    let schema_v4 = include_str!("../../../../migrations/0004_v4_entity_resolution_and_duplicates.sql");
    sqlx::raw_sql(schema_v4)
        .execute(pool)
        .await
        .map_err(|e| AppError::Internal(format!("V4 database migration failed: {}", e)))?;

    let schema_v5 = include_str!("../../../../migrations/0005_v5_evidence_and_document_intelligence.sql");
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

/// Deterministic Seed Data Runner
/// Safe, idempotent, and repeatable seeding of foundation and V2 domain data
pub async fn seed_database(pool: &PgPool) -> Result<(), AppError> {
    tracing::info!("Starting deterministic database seed for Mira synthetic demo environment");

    // ========================================================================
    // 1. Roles
    // ========================================================================
    let roles = [
        (RoleType::Citizen.as_str(), "Resident citizen seeking public documentation & entitlements"),
        (RoleType::FieldOfficial.as_str(), "Civic field operative validating local resident credentials"),
        (RoleType::VerificationOfficer.as_str(), "Verification and adjudication officer reviewing claims"),
        (RoleType::DepartmentAdmin.as_str(), "Administrative authority managing department operations"),
        (RoleType::Auditor.as_str(), "Independent oversight auditor inspecting access and logs"),
        (RoleType::SuperAdmin.as_str(), "System infrastructure administrator"),
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
        ("citizen@mira.local", "Rajesh Kumar (Citizen)", "en", RoleType::Citizen.as_str()),
        ("officer@mira.local", "Priya Sharma (Field Official)", "en", RoleType::FieldOfficial.as_str()),
        ("verifier@mira.local", "Anil Verma (Verification Officer)", "hi", RoleType::VerificationOfficer.as_str()),
        ("admin@mira.local", "Sunita Patel (Department Admin)", "en", RoleType::DepartmentAdmin.as_str()),
        ("auditor@mira.local", "Vikram Malhotra (Auditor)", "en", RoleType::Auditor.as_str()),
    ];

    let mut admin_user_id = Uuid::nil();

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
        if role_name == RoleType::DepartmentAdmin.as_str() {
            admin_user_id = user_id;
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
        .map_err(|e| AppError::Internal(format!("Failed to associate user {} with org: {}", email, e)))?;
    }

    // ========================================================================
    // 4. V2 Provenance Sources
    // ========================================================================
    let sources = [
        ("HOUSEHOLD_REGISTER", "HR-2024-DEL-01", "State Household Census Register 2024", "HIGH"),
        ("FIELD_VERIFICATION", "FV-2025-089", "Field Inspector Verification Unit", "VERY_HIGH"),
        ("BIRTH_REGISTER", "BR-MIRA-DEMO", "Civil Registration System", "VERY_HIGH"),
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
    // 5. V2 Persons (Ramesh, Sita, Amit, Rahul, Priya, Arjun)
    // ========================================================================
    let persons: [(&str, &str, Option<&str>, &str, Option<NaiveDate>, &str, &str, &str); 6] = [
        ("P-1001", "Ramesh", None, "Kumar", NaiveDate::from_ymd_opt(1968, 4, 12), "Male", "ramesh@synthetic.local", "ACTIVE"),
        ("P-1002", "Sita", None, "Devi", NaiveDate::from_ymd_opt(1972, 8, 25), "Female", "sita@synthetic.local", "ACTIVE"),
        ("P-1003", "Amit", None, "Kumar", NaiveDate::from_ymd_opt(1996, 11, 4), "Male", "amit@synthetic.local", "ACTIVE"),
        ("P-1004", "Rahul", None, "Kumar", NaiveDate::from_ymd_opt(1999, 6, 18), "Male", "rahul@synthetic.local", "ACTIVE"),
        ("P-1005", "Priya", None, "Sharma", NaiveDate::from_ymd_opt(1992, 3, 15), "Female", "priya@synthetic.local", "ACTIVE"),
        ("P-1006", "Arjun", None, "Sharma", NaiveDate::from_ymd_opt(1989, 12, 20), "Male", "arjun@synthetic.local", "ACTIVE"),
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

        // Add synthetic identifier
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

    // ========================================================================
    // 6. V2 Family Relationships
    // ========================================================================
    let relationships: [(Uuid, Uuid, &str, NaiveDate, Option<NaiveDate>); 7] = [
        (ramesh_id, sita_id, "SPOUSE", NaiveDate::from_ymd_opt(1993, 2, 14).unwrap(), None),
        (ramesh_id, amit_id, "PARENT", NaiveDate::from_ymd_opt(1996, 11, 4).unwrap(), None),
        (sita_id, amit_id, "PARENT", NaiveDate::from_ymd_opt(1996, 11, 4).unwrap(), None),
        (ramesh_id, rahul_id, "PARENT", NaiveDate::from_ymd_opt(1999, 6, 18).unwrap(), None),
        (sita_id, rahul_id, "PARENT", NaiveDate::from_ymd_opt(1999, 6, 18).unwrap(), None),
        (amit_id, rahul_id, "SIBLING", NaiveDate::from_ymd_opt(1999, 6, 18).unwrap(), None),
        (priya_id, arjun_id, "SPOUSE", NaiveDate::from_ymd_opt(2017, 5, 10).unwrap(), None),
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
        .map_err(|e| AppError::Internal(format!("Failed to seed relationship {} -> {}: {}", p_a, p_b, e)))?;
    }

    // ========================================================================
    // 7. V2 Households (H001, H002, H003)
    // ========================================================================
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

    // ========================================================================
    // 8. V2 Household Memberships (with Historical Separation on 2025-07-01)
    // ========================================================================
    let sep_date = NaiveDate::from_ymd_opt(2025, 7, 1).unwrap();

    let memberships = [
        // H001 members
        (h001_id, ramesh_id, "HEAD", NaiveDate::from_ymd_opt(2015, 1, 1).unwrap(), None),
        (h001_id, sita_id, "SPOUSE", NaiveDate::from_ymd_opt(2015, 1, 1).unwrap(), None),
        (h001_id, amit_id, "CHILD", NaiveDate::from_ymd_opt(2018, 3, 10).unwrap(), None),
        // Rahul was in H001 until 2025-07-01!
        (h001_id, rahul_id, "CHILD", NaiveDate::from_ymd_opt(2018, 1, 1).unwrap(), Some(sep_date)),
        // Rahul moved to H002 effective 2025-07-01!
        (h002_id, rahul_id, "HEAD", sep_date, None),
        // H003 members
        (h003_id, priya_id, "HEAD", NaiveDate::from_ymd_opt(2021, 1, 1).unwrap(), None),
        (h003_id, arjun_id, "SPOUSE", NaiveDate::from_ymd_opt(2021, 1, 1).unwrap(), None),
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
        .map_err(|e| AppError::Internal(format!("Failed to seed membership {} -> {}: {}", hid, pid, e)))?;
    }

    // ========================================================================
    // 9. V2 Properties & Associations
    // ========================================================================
    let properties = [
        ("PROP-001", "HOUSE", "Plot 42, Civil Lines", "Civil Lines", "Central Delhi", "Delhi", "110054", 28.6812, 77.2228),
        ("PROP-002", "APARTMENT", "Flat 304, Shanti Enclave", "Mayur Vihar", "East Delhi", "Delhi", "110091", 28.6080, 77.2950),
        ("PROP-003", "LAND", "Survey No. 81/2, Agricultural Zone", "Alipur", "North Delhi", "Delhi", "110036", 28.7981, 77.1352),
    ];

    let mut prop_map = std::collections::HashMap::new();

    for (pr_id, pr_type, addr, loc, dist, state, pin, lat, lng) in properties {
        let row = sqlx::query(
            r#"
            INSERT INTO properties (id, public_id, property_type, address_line, locality, district, state, postal_code, latitude, longitude)
            VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (public_id) DO UPDATE SET address_line = EXCLUDED.address_line
            RETURNING id, public_id
            "#,
        )
        .bind(pr_id)
        .bind(pr_type)
        .bind(addr)
        .bind(loc)
        .bind(dist)
        .bind(state)
        .bind(pin)
        .bind(lat)
        .bind(lng)
        .fetch_one(pool)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to seed property {}: {}", pr_id, e)))?;

        let id: Uuid = row.get("id");
        let pub_id: String = row.get("public_id");
        prop_map.insert(pub_id, id);
    }

    let p001_id = prop_map["PROP-001"];
    let p002_id = prop_map["PROP-002"];
    let p003_id = prop_map["PROP-003"];

    // Associations
    // H001 occupies PROP-001
    sqlx::query(
        r#"
        INSERT INTO property_associations (id, property_id, household_id, association_type, valid_from, verification_status, confidence)
        VALUES (gen_random_uuid(), $1, $2, 'HOUSEHOLD_OCCUPIES', '2015-01-01', 'VERIFIED', 1.00)
        "#,
    )
    .bind(p001_id)
    .bind(h001_id)
    .execute(pool)
    .await?;

    // H002 occupies PROP-002 (since separation 2025-07-01)
    sqlx::query(
        r#"
        INSERT INTO property_associations (id, property_id, household_id, association_type, valid_from, verification_status, confidence)
        VALUES (gen_random_uuid(), $1, $2, 'HOUSEHOLD_OCCUPIES', $3, 'VERIFIED', 1.00)
        "#,
    )
    .bind(p002_id)
    .bind(h002_id)
    .bind(sep_date)
    .execute(pool)
    .await?;

    // Ramesh owns Land PROP-003
    sqlx::query(
        r#"
        INSERT INTO property_associations (id, property_id, person_id, association_type, valid_from, verification_status, confidence)
        VALUES (gen_random_uuid(), $1, $2, 'PERSON_OWNS', '2010-04-15', 'VERIFIED', 1.00)
        "#,
    )
    .bind(p003_id)
    .bind(ramesh_id)
    .execute(pool)
    .await?;

    // ========================================================================
    // 10. V2 Life Events (Separation Event)
    // ========================================================================
    sqlx::query(
        r#"
        INSERT INTO life_events (id, event_type, person_id, household_id, effective_date, source_id, metadata, created_by)
        VALUES (gen_random_uuid(), 'HOUSEHOLD_SEPARATION', $1, $2, $3, $4, $5, $6)
        "#,
    )
    .bind(rahul_id)
    .bind(h001_id)
    .bind(sep_date)
    .bind(source_fv_id)
    .bind(serde_json::json!({
        "previous_household_id": h001_id,
        "new_household_id": h002_id,
        "person_name": "Rahul Kumar",
        "notes": "Household separation and establishment of independent dwelling recorded by Field Verification unit"
    }))
    .bind(admin_user_id)
    .execute(pool)
    .await?;

    // ========================================================================
    // 11. V3 Schemes & Eligibility Rules
    // ========================================================================
    let v3_already_seeded: bool = sqlx::query_scalar("SELECT EXISTS(SELECT 1 FROM schemes WHERE code = 'SCH_STUDENT_SCHOLARSHIP')")
        .fetch_one(pool)
        .await
        .unwrap_or(false);

    if !v3_already_seeded {


    let schemes = [
        (
            "SCH-001",
            "SCH_STUDENT_SCHOLARSHIP",
            "Student Scholarship",
            "Direct individual educational financial assistance for enrolled students aged 5 to 25.",
            "Department of Higher Education",
            "ACTIVE",
            "INDIVIDUAL",
        ),
        (
            "SCH-002",
            "SCH_HH_SANITATION",
            "Household Sanitation Assistance",
            "Household-level assistance for toilet and sanitation infrastructure construction.",
            "Ministry of Housing and Urban Affairs",
            "ACTIVE",
            "HOUSEHOLD",
        ),
        (
            "SCH-003",
            "SCH_WATER_CONNECTION",
            "Water Connection Assistance",
            "Infrastructure potable water connection subsidy for residential properties.",
            "Department of Drinking Water and Sanitation",
            "ACTIVE",
            "PROPERTY",
        ),
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

    let sch_scholarship_id = scheme_map["SCH_STUDENT_SCHOLARSHIP"];
    let sch_sanitation_id = scheme_map["SCH_HH_SANITATION"];
    let sch_water_id = scheme_map["SCH_WATER_CONNECTION"];

    // Rules for Student Scholarship
    let scholarship_rules = [
        (sch_scholarship_id, "AGE_MIN", ">=", "5", 1),
        (sch_scholarship_id, "AGE_MAX", "<=", "25", 2),
        (sch_scholarship_id, "RESIDENCY_REQUIRED", "=", "TRUE", 3),
    ];

    for (sch_id, r_type, op, val, prio) in scholarship_rules {
        sqlx::query(
            r#"
            INSERT INTO scheme_rules (id, scheme_id, rule_type, operator, value, priority, active)
            VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, true)
            "#,
        )
        .bind(sch_id)
        .bind(r_type)
        .bind(op)
        .bind(val)
        .bind(prio)
        .execute(pool)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to seed rule {}: {}", r_type, e)))?;
    }

    // Rules for Household Sanitation Assistance
    let sanitation_rules = [
        (sch_sanitation_id, "HOUSEHOLD_SIZE_MIN", ">=", "2", 1),
        (sch_sanitation_id, "RESIDENCY_REQUIRED", "=", "TRUE", 2),
    ];

    for (sch_id, r_type, op, val, prio) in sanitation_rules {
        sqlx::query(
            r#"
            INSERT INTO scheme_rules (id, scheme_id, rule_type, operator, value, priority, active)
            VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, true)
            "#,
        )
        .bind(sch_id)
        .bind(r_type)
        .bind(op)
        .bind(val)
        .bind(prio)
        .execute(pool)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to seed rule {}: {}", r_type, e)))?;
    }

    // Rules for Water Connection Assistance
    sqlx::query(
        r#"
        INSERT INTO scheme_rules (id, scheme_id, rule_type, operator, value, priority, active)
        VALUES (gen_random_uuid(), $1, 'PROPERTY_REQUIRED', '=', 'TRUE', 1, true)
        "#,
    )
    .bind(sch_water_id)
    .execute(pool)
    .await
    .map_err(|e| AppError::Internal(format!("Failed to seed rule PROPERTY_REQUIRED: {}", e)))?;

    // ========================================================================
    // 12. V3 Seed Applications & Benefits
    // ========================================================================

    // 1. Rahul - Student Scholarship (INDIVIDUAL, ₹10,000, 2025)
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
        ON CONFLICT (application_number) DO UPDATE SET status = EXCLUDED.status
        RETURNING id
        "#,
    )
    .bind(sch_scholarship_id)
    .bind(rahul_id)
    .bind(admin_user_id)
    .fetch_one(pool)
    .await
    .map_err(|e| AppError::Internal(format!("Failed to seed application APP-2025-001: {}", e)))?;

    let app1_id: Uuid = app1_row.get("id");

    // Eligibility assessment for App 1
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

    // Rule results for App 1
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

    // Benefit 1: Rahul Scholarship
    let ben1_row = sqlx::query(
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
        ON CONFLICT (public_id) DO UPDATE SET status = EXCLUDED.status
        RETURNING id
        "#,
    )
    .bind(sch_scholarship_id)
    .bind(app1_id)
    .bind(rahul_id)
    .bind(source_hr_id)
    .bind(admin_user_id)
    .fetch_one(pool)
    .await?;

    let ben1_id: Uuid = ben1_row.get("id");

    sqlx::query(
        r#"
        INSERT INTO benefit_events (id, benefit_id, event_type, effective_at, recorded_at, source_id, metadata, created_by)
        VALUES 
        (gen_random_uuid(), $1, 'APPROVED', '2025-01-10T12:00:00Z', '2025-01-10T12:00:00Z', $2, '{"notes":"Scholarship approved based on verified age & enrollment"}'::jsonb, $3),
        (gen_random_uuid(), $1, 'DISBURSED', '2025-01-15T15:30:00Z', '2025-01-15T15:30:00Z', $2, '{"disbursement_method":"Electronic Civic Transfer","batch":"BTCH-2025-01"}'::jsonb, $3)
        "#,
    )
    .bind(ben1_id)
    .bind(source_hr_id)
    .bind(admin_user_id)
    .execute(pool)
    .await?;

    // 2. Household H001 - Household Sanitation Assistance (Toilet T001, 2024)
    let app2_row = sqlx::query(
        r#"
        INSERT INTO applications (
            id, public_id, application_number, scheme_id, applicant_person_id, target_household_id, target_property_id,
            submitted_at, status, current_stage, application_date, created_by
        )
        VALUES (
            gen_random_uuid(), 'APP-2024-001', 'APP-SAN-2024-001', $1, $2, $3, $4,
            '2024-05-20T11:00:00Z', 'DISBURSED', 'BENEFIT_DISBURSED', '2024-05-20', $5
        )
        ON CONFLICT (application_number) DO UPDATE SET status = EXCLUDED.status
        RETURNING id
        "#,
    )
    .bind(sch_sanitation_id)
    .bind(ramesh_id)
    .bind(h001_id)
    .bind(p001_id)
    .bind(admin_user_id)
    .fetch_one(pool)
    .await?;

    let app2_id: Uuid = app2_row.get("id");

    let ben2_row = sqlx::query(
        r#"
        INSERT INTO benefits (
            id, public_id, scheme_id, application_id, benefit_unit_type, household_id, property_id,
            status, approved_at, disbursed_at, valid_from, valid_to, quantity, unit,
            description, source_id, created_by
        )
        VALUES (
            gen_random_uuid(), 'BEN-2024-001', $1, $2, 'HOUSEHOLD', $3, $4,
            'DISBURSED', '2024-06-05T14:00:00Z', '2024-06-12T16:00:00Z', '2024-06-01', '2024-12-31',
            1, 'toilet', '1 Sanitation Toilet Asset Unit (T001) allocated to Household H001',
            $5, $6
        )
        ON CONFLICT (public_id) DO UPDATE SET status = EXCLUDED.status
        RETURNING id
        "#,
    )
    .bind(sch_sanitation_id)
    .bind(app2_id)
    .bind(h001_id)
    .bind(p001_id)
    .bind(source_fv_id)
    .bind(admin_user_id)
    .fetch_one(pool)
    .await?;

    let ben2_id: Uuid = ben2_row.get("id");

    // Link toilet asset
    sqlx::query(
        r#"
        INSERT INTO benefit_assets (id, benefit_id, property_id, asset_role)
        VALUES (gen_random_uuid(), $1, $2, 'PHYSICAL_ASSET')
        "#,
    )
    .bind(ben2_id)
    .bind(p001_id)
    .execute(pool)
    .await?;

    // 3. Property P001 - Water Connection Assistance (PROPERTY, 2025)
    let ben3_row = sqlx::query(
        r#"
        INSERT INTO benefits (
            id, public_id, scheme_id, benefit_unit_type, property_id,
            status, approved_at, disbursed_at, valid_from, quantity, unit,
            description, source_id, created_by
        )
        VALUES (
            gen_random_uuid(), 'BEN-2025-002', $1, 'PROPERTY', $2,
            'DISBURSED', '2025-03-10T09:00:00Z', '2025-03-20T11:00:00Z', '2025-03-01',
            1, 'connection', '1 Residential Potable Water Connection Line allocated to Property PROP-001',
            $3, $4
        )
        ON CONFLICT (public_id) DO UPDATE SET status = EXCLUDED.status
        RETURNING id
        "#,
    )
    .bind(sch_water_id)
    .bind(p001_id)
    .bind(source_fv_id)
    .bind(admin_user_id)
    .fetch_one(pool)
    .await?;

    let _ben3_id: Uuid = ben3_row.get("id");
    }

    let h001_id: Uuid = sqlx::query_scalar("SELECT id FROM households WHERE public_id = 'H001'")
        .fetch_one(pool)
        .await?;

    // ========================================================================
    // 16. V4 Matching Model Configuration (Centralized & Versioned)
    // ========================================================================

    sqlx::query(
        r#"
        INSERT INTO matching_model_versions (
            id, name, version, strong_match_threshold, possible_match_threshold,
            non_match_threshold, duplicate_high_threshold, duplicate_review_threshold,
            field_weights, blocking_strategies, normalization_version, is_active, created_by
        )
        VALUES (
            gen_random_uuid(), 'Default Deterministic Civic Matching Configuration', 'v4.0.0',
            0.82, 0.58, 0.35, 0.78, 0.48,
            '{"name": 0.30, "date_of_birth": 0.25, "parent_name": 0.15, "address": 0.10, "household": 0.10, "phone": 0.05, "gender": 0.05}'::jsonb,
            '["NAME_PREFIX_DOB_YEAR", "NAME_PREFIX_DISTRICT", "PHONE_SUFFIX"]'::jsonb,
            'v4.0.0-unicode-translit', TRUE, $1
        )
        ON CONFLICT (version) DO UPDATE SET is_active = TRUE
        "#,
    )
    .bind(admin_user_id)
    .execute(pool)
    .await?;

    // ========================================================================
    // 17. V4 Demo Scenario C: Devanagari Multilingual Records (सुनीता देवी / Sunita Devi)
    // ========================================================================
    let sunita_en = sqlx::query(
        r#"
        INSERT INTO persons (id, public_id, first_name, last_name, date_of_birth, gender, phone, status, created_by)
        VALUES (gen_random_uuid(), 'P-DEMO-SUNITA-EN', 'Sunita', 'Devi', '1985-05-15', 'FEMALE', '+919876543201', 'ACTIVE', $1)
        ON CONFLICT (public_id) DO UPDATE SET first_name = EXCLUDED.first_name
        RETURNING id
        "#,
    )
    .bind(admin_user_id)
    .fetch_one(pool)
    .await?;
    let sunita_en_id: Uuid = sunita_en.get("id");

    let _sunita_hi = sqlx::query(
        r#"
        INSERT INTO persons (id, public_id, first_name, last_name, date_of_birth, gender, phone, status, created_by)
        VALUES (gen_random_uuid(), 'P-DEMO-SUNITA-HI', 'सुनीता', 'देवी', '1985-05-15', 'FEMALE', '+919876543201', 'ACTIVE', $1)
        ON CONFLICT (public_id) DO UPDATE SET first_name = EXCLUDED.first_name
        RETURNING id
        "#,
    )
    .bind(admin_user_id)
    .fetch_one(pool)
    .await?;

    // Link Sunita to Household H001 and Property P001 for rich evidence matrix
    let _ = sqlx::query(
        r#"
        INSERT INTO household_members (id, household_id, person_id, role, valid_from, created_by)
        VALUES (gen_random_uuid(), $1, $2, 'MEMBER', '2023-01-01', $3)
        ON CONFLICT DO NOTHING
        "#,
    )
    .bind(h001_id)
    .bind(sunita_en_id)
    .bind(admin_user_id)
    .execute(pool)
    .await;

    // ========================================================================
    // 18. V4 Demo Scenario D: DOB Contradiction Person Record (Rahul Kumar 1988 vs 1998)
    // ========================================================================
    let _rahul_older = sqlx::query(
        r#"
        INSERT INTO persons (id, public_id, first_name, last_name, date_of_birth, gender, phone, status, created_by)
        VALUES (gen_random_uuid(), 'P-DEMO-RAHUL-1988', 'Rahul', 'Kumar', '1988-04-12', 'MALE', '+919876543299', 'ACTIVE', $1)
        ON CONFLICT (public_id) DO UPDATE SET first_name = EXCLUDED.first_name
        RETURNING id
        "#,
    )
    .bind(admin_user_id)
    .fetch_one(pool)
    .await?;

    // Initial seed audit record
    let seed_request_id = format!("seed-{}", Uuid::new_v4());
    sqlx::query(
        r#"
        INSERT INTO audit_events (id, event_type, user_id, organization_id, request_id, details)
        VALUES (gen_random_uuid(), 'SYSTEM_INITIALIZED', NULL, $1, $2, $3)
        "#,
    )
    .bind(org_id)
    .bind(seed_request_id)
    .bind(serde_json::json!({
        "message": "Mira V4 Entity Resolution, Explainable Duplicate Intelligence & Human Review system seeded",
        "environment": "Synthetic Demo Environment"
    }))
    .execute(pool)
    .await
    .map_err(|e| AppError::Internal(format!("Failed to write seed audit event: {}", e)))?;

    seed_demo_documents(pool).await?;
    tracing::info!("Deterministic V4 seed finished successfully. Entity Resolution and Duplicate Detection ready.");
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
    pdf.extend_from_slice(format!("xref\n0 {}\n0000000000 65535 f \n", objects.len() + 1).as_bytes());
    for offset in offsets { pdf.extend_from_slice(format!("{offset:010} 00000 n \n").as_bytes()); }
    pdf.extend_from_slice(format!("trailer\n<< /Size {} /Root 1 0 R >>\nstartxref\n{}\n%%EOF", objects.len() + 1, xref_offset).as_bytes());
    pdf
}

async fn seed_demo_documents(pool: &PgPool) -> Result<(), AppError> {
    let user_id = sqlx::query_scalar::<_, Uuid>("SELECT id FROM users WHERE email = 'citizen@mira.local'")
        .fetch_optional(pool)
        .await?
        .ok_or_else(|| AppError::Internal("Synthetic demo citizen is missing during document seeding".into()))?;
    let storage = Path::new("data/storage/safe_store");
    tokio::fs::create_dir_all(storage).await.map_err(|e| AppError::Internal(format!("Unable to prepare document storage: {e}")))?;
    let docs = [
        ("Aadhaar Demo.pdf", "IDENTITY_SUPPORTING_DOCUMENT", "VERIFIED", None, 5),
        ("Income Certificate.pdf", "INCOME_CERTIFICATE", "VERIFIED", None, 4),
        ("Residence Certificate.pdf", "RESIDENCE_CERTIFICATE", "ACTION_REQUIRED", None, 3),
        ("BPL Certificate.pdf", "OTHER", "EXPIRED", Some("2025-03-31T00:00:00Z"), 220),
        ("Land Record.pdf", "PROPERTY_DOCUMENT", "PENDING_REVIEW", None, 1),
    ];
    for (filename, doc_type, verification, expiry, age_days) in docs {
        let exists = sqlx::query_scalar::<_, bool>("SELECT EXISTS(SELECT 1 FROM documents WHERE created_by = $1 AND original_filename = $2)")
            .bind(user_id).bind(filename).fetch_one(pool).await?;
        if exists { continue; }
        let label = filename.trim_end_matches(".pdf");
        let bytes = synthetic_demo_pdf(label);
        let hash = format!("{:x}", Sha256::digest(&bytes));
        let key = format!("{}.pdf", Uuid::new_v4());
        tokio::fs::write(storage.join(&key), &bytes).await.map_err(|e| AppError::Internal(format!("Unable to seed demo document object: {e}")))?;
        let row = sqlx::query(
            r#"INSERT INTO documents (
                public_id, owner_type, owner_id, document_type, original_filename, detected_mime_type,
                size_bytes, original_size_bytes, sha256, storage_reference, status, verification_status, expires_at, created_by,
                created_at, updated_at
            ) VALUES ($1, 'CITIZEN', $2, $3, $4, 'application/pdf', $5, $5, $6, $7, 'READY', $8, $9, $2,
                NOW() - ($10 * INTERVAL '1 day'), NOW() - ($10 * INTERVAL '1 day')) RETURNING id"#,
        )
        .bind(format!("DOC-DEMO-{}", Uuid::new_v4().to_string()[..8].to_uppercase()))
        .bind(user_id).bind(doc_type).bind(filename).bind(bytes.len() as i64).bind(&hash).bind(&key)
        .bind(verification).bind(expiry.map(|date| date.parse::<chrono::DateTime<chrono::Utc>>()).transpose().map_err(|e| AppError::Internal(e.to_string()))?).bind(age_days)
        .fetch_one(pool).await.map_err(|e| AppError::Internal(format!("Unable to seed synthetic document metadata: {e}")))?;
        let document_id: Uuid = row.get("id");
        sqlx::query("INSERT INTO document_versions (document_id, version_type, storage_reference, mime_type, size_bytes, sha256, compression_type) VALUES ($1, 'ORIGINAL', $2, 'application/pdf', $3, $4, 'NONE')")
            .bind(document_id).bind(&key).bind(bytes.len() as i64).bind(&hash).execute(pool).await?;
        sqlx::query("INSERT INTO document_access_logs (document_id, user_id, action, purpose) VALUES ($1, $2, 'PROCESS', 'CITIZEN_SELF_SERVICE')")
            .bind(document_id).bind(user_id).execute(pool).await?;
    }
    Ok(())
}

