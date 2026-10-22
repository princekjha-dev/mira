use chrono::Utc;
use serde::{Deserialize, Serialize};
use sqlx::{PgPool, Row};
use uuid::Uuid;

use crate::{
    auth::AuthenticatedUser,
    domain::{
        benefit_duplicate::{
            candidate::DuplicateCandidateFinder,
            comparison::DuplicateComparator,
            scope::BenefitScope,
        },
        entity_resolution::models::{
            BenefitDuplicateCandidate, BenefitDuplicateCase, BenefitDuplicateEvidence,
            DuplicateCategory,
        },
        Application, RoleType, Scheme,
    },
    errors::AppError,
};

#[derive(Deserialize)]
pub struct CheckBenefitDuplicateRequest {
    pub application_id: Uuid,
}

#[derive(Deserialize)]
pub struct BenefitDuplicateDecisionRequest {
    pub decision: String, // CONFIRMED_DUPLICATE, NOT_DUPLICATE, REQUIRES_MORE_EVIDENCE
    pub reason: String,   // HOUSEHOLD_SEPARATION, DIFFERENT_PERSON, INCORRECT_SOURCE_DATA, DUPLICATE_CONFIRMED, PROPERTY_ALREADY_BENEFITED, INSUFFICIENT_EVIDENCE, OTHER
    pub explanation: Option<String>,
}

pub struct BenefitDuplicateService;

impl BenefitDuplicateService {
    /// Evaluates duplicate benefit risk for an incoming application
    pub async fn check_application_duplicates(
        pool: &PgPool,
        caller: &AuthenticatedUser,
        payload: CheckBenefitDuplicateRequest,
    ) -> Result<BenefitDuplicateCase, AppError> {
        // Load application details
        let app = sqlx::query_as!(
            Application,
            r#"
            SELECT a.id, a.public_id, a.application_number, a.scheme_id,
                   s.name as scheme_name, s.code as scheme_code, s.scope as scheme_scope,
                   a.applicant_person_id, (p.first_name || ' ' || p.last_name) as applicant_name,
                   a.target_person_id, a.target_household_id, h.name as target_household_name,
                   a.target_property_id, a.submitted_at, a.status, a.current_stage,
                   a.application_date, a.metadata, a.created_at, a.updated_at
            FROM applications a
            JOIN schemes s ON a.scheme_id = s.id
            JOIN persons p ON a.applicant_person_id = p.id
            LEFT JOIN households h ON a.target_household_id = h.id
            WHERE a.id = $1
            "#,
            payload.application_id
        )
        .fetch_optional(pool)
        .await?
        .ok_or_else(|| AppError::NotFound(format!("Application {} not found", payload.application_id)))?;

        let scope_str = app.scheme_scope.clone().unwrap_or_else(|| "INDIVIDUAL".to_string());
        let scope = BenefitScope::from_str(&scope_str);

        // Scope unit resolution:
        // If household scope, check household membership at application date!
        let effective_household_id = if scope == BenefitScope::Household {
            // Check historical household membership at application_date
            let hist_hh: Option<Uuid> = sqlx::query_scalar(
                r#"
                SELECT household_id
                FROM household_members
                WHERE person_id = $1
                  AND valid_from <= $2
                  AND (valid_to IS NULL OR valid_to >= $2)
                LIMIT 1
                "#,
            )
            .bind(app.target_person_id.unwrap_or(app.applicant_person_id))
            .bind(app.application_date)
            .fetch_optional(pool)
            .await
            .unwrap_or(None);

            hist_hh.or(app.target_household_id)
        } else {
            app.target_household_id
        };

        // Query candidate existing benefits
        let existing_benefits = DuplicateCandidateFinder::find_candidates(
            pool,
            app.scheme_id,
            scope,
            app.target_person_id.or(Some(app.applicant_person_id)),
            effective_household_id,
            app.target_property_id,
            app.application_date,
        )
        .await?;

        let mut evaluated_candidates = Vec::new();
        let mut overall_assessment = DuplicateCategory::NotDuplicate;
        let mut rank = 1;

        for eb in existing_benefits {
            let cand = DuplicateComparator::compare_application_with_benefit(
                pool,
                &app,
                scope,
                &eb,
                rank,
            )
            .await?;

            let cat = DuplicateCategory::from_str(&cand.duplicate_category);
            match cat {
                DuplicateCategory::ExactDuplicate => overall_assessment = DuplicateCategory::ExactDuplicate,
                DuplicateCategory::LikelyDuplicate if overall_assessment != DuplicateCategory::ExactDuplicate => {
                    overall_assessment = DuplicateCategory::LikelyDuplicate;
                }
                DuplicateCategory::PotentialDuplicate if overall_assessment == DuplicateCategory::NotDuplicate => {
                    overall_assessment = DuplicateCategory::PotentialDuplicate;
                }
                _ => {}
            }

            evaluated_candidates.push(cand);
            rank += 1;
        }

        let case_id = Uuid::new_v4();
        let public_id = format!("BDC-{}", &case_id.to_string()[..8].to_uppercase());

        let (priority, recommended_action, reason) = match overall_assessment {
            DuplicateCategory::ExactDuplicate => (
                "HIGH",
                "MANUAL_REVIEW",
                format!("Exact duplicate identified: Target entity holds active entitlement for scheme '{}'", app.scheme_name.as_deref().unwrap_or("Public Scheme")),
            ),
            DuplicateCategory::LikelyDuplicate => (
                "HIGH",
                "MANUAL_REVIEW",
                format!("Likely duplicate detected: Target unit received benefit during overlapping period under '{}'", app.scheme_name.as_deref().unwrap_or("Public Scheme")),
            ),
            DuplicateCategory::PotentialDuplicate => (
                "MEDIUM",
                "MANUAL_REVIEW",
                format!("Potential overlap flagged for scheme '{}'. Human review advised.", app.scheme_name.as_deref().unwrap_or("Public Scheme")),
            ),
            DuplicateCategory::NotDuplicate => (
                "LOW",
                "AUTOMATIC_CLEARANCE",
                "No duplicate benefit conflicts detected across individual, household, or property scopes.".to_string(),
            ),
            DuplicateCategory::InsufficientInformation => (
                "MEDIUM",
                "REQUEST_MORE_INFORMATION",
                "Insufficient historical data to rule out duplicate benefit claims.".to_string(),
            ),
        };

        // Determine unit type string
        let unit_type_str = match scope {
            BenefitScope::Individual => "PERSON",
            BenefitScope::Household => "HOUSEHOLD",
            BenefitScope::Property => "PROPERTY",
            BenefitScope::Composite => "PERSON",
        };

        // Insert benefit duplicate case
        sqlx::query(
            r#"
            INSERT INTO benefit_duplicate_cases (
                id, public_id, application_id, scheme_id, benefit_scope,
                benefit_unit_type, person_id, household_id, property_id,
                status, priority, assessment, rules_version, reason,
                recommended_action, created_by, created_at, updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'OPEN', $10, $11, 'duplicate-v4.0.0', $12, $13, $14, NOW(), NOW())
            "#,
        )
        .bind(case_id)
        .bind(&public_id)
        .bind(app.id)
        .bind(app.scheme_id)
        .bind(scope.as_str())
        .bind(unit_type_str)
        .bind(app.target_person_id.or(Some(app.applicant_person_id)))
        .bind(effective_household_id)
        .bind(app.target_property_id)
        .bind(priority)
        .bind(overall_assessment.as_str())
        .bind(&reason)
        .bind(recommended_action)
        .bind(caller.id)
        .execute(pool)
        .await?;

        // Persist candidates and evidence
        for mut cand in evaluated_candidates {
            cand.case_id = case_id;
            sqlx::query(
                r#"
                INSERT INTO benefit_duplicate_candidates (
                    id, case_id, existing_benefit_id, candidate_rank,
                    duplicate_category, overlap_score, explanation, created_at
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
                "#,
            )
            .bind(cand.id)
            .bind(case_id)
            .bind(cand.existing_benefit_id)
            .bind(cand.candidate_rank)
            .bind(&cand.duplicate_category)
            .bind(cand.overlap_score)
            .bind(&cand.explanation)
            .execute(pool)
            .await?;

            for mut ev in cand.evidence {
                ev.candidate_id = cand.id;
                sqlx::query(
                    r#"
                    INSERT INTO benefit_duplicate_evidence (
                        id, candidate_id, field, source_value, existing_value,
                        result, weight, explanation, created_at
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
                    "#,
                )
                .bind(ev.id)
                .bind(cand.id)
                .bind(&ev.field)
                .bind(&ev.source_value)
                .bind(&ev.existing_value)
                .bind(&ev.result)
                .bind(ev.weight)
                .bind(&ev.explanation)
                .execute(pool)
                .await?;
            }
        }

        // Audit Trail
        crate::application::AuditService::log_event(
            pool,
            "BENEFIT_DUPLICATE_CHECK_PERFORMED",
            Some(caller.id),
            None,
            &format!("req-{}", Uuid::new_v4()),
            None,
            serde_json::json!({
                "case_id": case_id,
                "public_id": public_id,
                "application_id": app.id,
                "assessment": overall_assessment.as_str(),
                "priority": priority
            }),
        )
        .await;

        Self::get_duplicate_case_by_id(pool, caller, case_id).await
    }

    /// List benefit duplicate cases
    pub async fn list_duplicate_cases(
        pool: &PgPool,
        _caller: &AuthenticatedUser,
        status: Option<&str>,
        priority: Option<&str>,
        page: i64,
        limit: i64,
    ) -> Result<Vec<BenefitDuplicateCase>, AppError> {
        let offset = (page.max(1) - 1) * limit;
        let mut qb = sqlx::QueryBuilder::new(
            r#"
            SELECT c.id, c.public_id, c.application_id, a.application_number,
                   c.scheme_id, s.name as scheme_name, c.benefit_scope, c.benefit_unit_type,
                   c.person_id, (p.first_name || ' ' || p.last_name) as person_name,
                   c.household_id, h.public_id as household_public_id,
                   c.property_id, prop.address_line as property_address,
                   c.status, c.priority, c.assessment, c.rules_version,
                   c.reason, c.recommended_action, c.final_decision,
                   c.created_at, c.updated_at
            FROM benefit_duplicate_cases c
            JOIN applications a ON c.application_id = a.id
            JOIN schemes s ON c.scheme_id = s.id
            LEFT JOIN persons p ON c.person_id = p.id
            LEFT JOIN households h ON c.household_id = h.id
            LEFT JOIN properties prop ON c.property_id = prop.id
            WHERE 1=1
            "#,
        );

        if let Some(st) = status {
            qb.push(" AND c.status = ").push_bind(st);
        }
        if let Some(pr) = priority {
            qb.push(" AND c.priority = ").push_bind(pr);
        }

        qb.push(" ORDER BY CASE c.priority WHEN 'HIGH' THEN 1 WHEN 'MEDIUM' THEN 2 ELSE 3 END, c.created_at DESC ");
        qb.push(" LIMIT ").push_bind(limit).push(" OFFSET ").push_bind(offset);

        let rows = qb.build().fetch_all(pool).await?;
        let mut cases = Vec::new();

        for r in rows {
            cases.push(BenefitDuplicateCase {
                id: r.get("id"),
                public_id: r.get("public_id"),
                application_id: r.get("application_id"),
                application_number: r.get("application_number"),
                scheme_id: r.get("scheme_id"),
                scheme_name: r.get("scheme_name"),
                benefit_scope: r.get("benefit_scope"),
                benefit_unit_type: r.get("benefit_unit_type"),
                person_id: r.get("person_id"),
                person_name: r.get("person_name"),
                household_id: r.get("household_id"),
                household_public_id: r.get("household_public_id"),
                property_id: r.get("property_id"),
                property_address: r.get("property_address"),
                status: r.get("status"),
                priority: r.get("priority"),
                assessment: r.get("assessment"),
                rules_version: r.get("rules_version"),
                reason: r.get("reason"),
                recommended_action: r.get("recommended_action"),
                final_decision: r.get("final_decision"),
                candidates: Vec::new(),
                created_at: r.get("created_at"),
                updated_at: r.get("updated_at"),
            });
        }

        Ok(cases)
    }

    /// Retrieve full benefit duplicate case details including candidate benefits and evidence
    pub async fn get_duplicate_case_by_id(
        pool: &PgPool,
        _caller: &AuthenticatedUser,
        case_id: Uuid,
    ) -> Result<BenefitDuplicateCase, AppError> {
        let r = sqlx::query(
            r#"
            SELECT c.id, c.public_id, c.application_id, a.application_number,
                   c.scheme_id, s.name as scheme_name, c.benefit_scope, c.benefit_unit_type,
                   c.person_id, (p.first_name || ' ' || p.last_name) as person_name,
                   c.household_id, h.public_id as household_public_id,
                   c.property_id, prop.address_line as property_address,
                   c.status, c.priority, c.assessment, c.rules_version,
                   c.reason, c.recommended_action, c.final_decision,
                   c.created_at, c.updated_at
            FROM benefit_duplicate_cases c
            JOIN applications a ON c.application_id = a.id
            JOIN schemes s ON c.scheme_id = s.id
            LEFT JOIN persons p ON c.person_id = p.id
            LEFT JOIN households h ON c.household_id = h.id
            LEFT JOIN properties prop ON c.property_id = prop.id
            WHERE c.id = $1
            "#,
        )
        .bind(case_id)
        .fetch_optional(pool)
        .await?
        .ok_or_else(|| AppError::NotFound(format!("Benefit duplicate case {} not found", case_id)))?;

        // Query candidates
        let cand_rows = sqlx::query(
            r#"
            SELECT c.id, c.case_id, c.existing_benefit_id, b.public_id as existing_benefit_public_id,
                   b.amount::float8 as existing_benefit_amount, b.description as existing_benefit_asset,
                   c.candidate_rank, c.duplicate_category, c.overlap_score, c.explanation, c.created_at
            FROM benefit_duplicate_candidates c
            JOIN benefits b ON c.existing_benefit_id = b.id
            WHERE c.case_id = $1
            ORDER BY c.candidate_rank ASC
            "#,
        )
        .bind(case_id)
        .fetch_all(pool)
        .await?;

        let mut candidates = Vec::new();
        for cr in cand_rows {
            let cand_id: Uuid = cr.get("id");

            let ev_rows = sqlx::query(
                r#"
                SELECT id, candidate_id, field, source_value, existing_value,
                       result, weight, explanation, created_at
                FROM benefit_duplicate_evidence
                WHERE candidate_id = $1
                ORDER BY created_at ASC
                "#,
            )
            .bind(cand_id)
            .fetch_all(pool)
            .await?;

            let mut evidence = Vec::new();
            for er in ev_rows {
                evidence.push(BenefitDuplicateEvidence {
                    id: er.get("id"),
                    candidate_id: er.get("candidate_id"),
                    field: er.get("field"),
                    source_value: er.get("source_value"),
                    existing_value: er.get("existing_value"),
                    result: er.get("result"),
                    weight: er.get("weight"),
                    explanation: er.get("explanation"),
                    created_at: er.get("created_at"),
                });
            }

            candidates.push(BenefitDuplicateCandidate {
                id: cand_id,
                case_id,
                existing_benefit_id: cr.get("existing_benefit_id"),
                existing_benefit_public_id: cr.get("existing_benefit_public_id"),
                existing_benefit_amount: cr.get("existing_benefit_amount"),
                existing_benefit_asset: cr.get("existing_benefit_asset"),
                candidate_rank: cr.get("candidate_rank"),
                duplicate_category: cr.get("duplicate_category"),
                overlap_score: cr.get("overlap_score"),
                explanation: cr.get("explanation"),
                evidence,
                created_at: cr.get("created_at"),
            });
        }

        Ok(BenefitDuplicateCase {
            id: case_id,
            public_id: r.get("public_id"),
            application_id: r.get("application_id"),
            application_number: r.get("application_number"),
            scheme_id: r.get("scheme_id"),
            scheme_name: r.get("scheme_name"),
            benefit_scope: r.get("benefit_scope"),
            benefit_unit_type: r.get("benefit_unit_type"),
            person_id: r.get("person_id"),
            person_name: r.get("person_name"),
            household_id: r.get("household_id"),
            household_public_id: r.get("household_public_id"),
            property_id: r.get("property_id"),
            property_address: r.get("property_address"),
            status: r.get("status"),
            priority: r.get("priority"),
            assessment: r.get("assessment"),
            rules_version: r.get("rules_version"),
            reason: r.get("reason"),
            recommended_action: r.get("recommended_action"),
            final_decision: r.get("final_decision"),
            candidates,
            created_at: r.get("created_at"),
            updated_at: r.get("updated_at"),
        })
    }

    /// Records human verification decision for a benefit duplicate case
    pub async fn record_decision(
        pool: &PgPool,
        caller: &AuthenticatedUser,
        case_id: Uuid,
        payload: BenefitDuplicateDecisionRequest,
    ) -> Result<BenefitDuplicateCase, AppError> {
        let is_authorized = caller.roles.iter().any(|r| {
            matches!(r.as_str(), "VERIFICATION_OFFICER" | "DEPARTMENT_ADMIN" | "SUPER_ADMIN")
        });

        if !is_authorized {
            return Err(AppError::Forbidden("Only authorized verification officers or department admins can decide duplicate cases".to_string()));
        }

        let new_status = match payload.decision.as_str() {
            "CONFIRMED_DUPLICATE" => "RESOLVED_DUPLICATE",
            "NOT_DUPLICATE" => "RESOLVED_NOT_DUPLICATE",
            _ => "RESOLVED_MORE_EVIDENCE",
        };

        // 1. Record immutable human decision
        sqlx::query(
            r#"
            INSERT INTO benefit_duplicate_decisions (
                id, case_id, decision, reason, explanation, evidence_reference,
                decided_by, decided_at
            )
            VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW())
            "#,
        )
        .bind(case_id)
        .bind(&payload.decision)
        .bind(&payload.reason)
        .bind(&payload.explanation)
        .bind(serde_json::json!({ "officer_id": caller.id, "roles": caller.roles }))
        .bind(caller.id)
        .execute(pool)
        .await?;

        // 2. Update case status and final decision
        sqlx::query(
            r#"
            UPDATE benefit_duplicate_cases
            SET status = $1, final_decision = $2, resolved_at = NOW(), resolved_by = $3, updated_at = NOW()
            WHERE id = $4
            "#,
        )
        .bind(new_status)
        .bind(&payload.decision)
        .bind(caller.id)
        .bind(case_id)
        .execute(pool)
        .await?;

        // 3. Record audit trail event
        crate::application::AuditService::log_event(
            pool,
            "BENEFIT_DUPLICATE_DECIDED",
            Some(caller.id),
            None,
            &format!("req-{}", Uuid::new_v4()),
            None,
            serde_json::json!({
                "case_id": case_id,
                "decision": payload.decision,
                "reason": payload.reason,
                "explanation": payload.explanation,
                "new_status": new_status
            }),
        )
        .await;

        Self::get_duplicate_case_by_id(pool, caller, case_id).await
    }
}
