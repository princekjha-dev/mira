use chrono::Utc;
use serde::{Deserialize, Serialize};
use sqlx::{PgPool, Row};
use uuid::Uuid;

use crate::{
    auth::AuthenticatedUser,
    domain::{
        entity_resolution::{
            blocking::BlockingEngine,
            evaluation::PersonEvaluator,
            models::{
                EntityResolutionCandidate, EntityResolutionCase, EntityResolutionEvidence,
                MatchingModelConfig, OverallAssessment,
            },
        },
        AuditEvent, Person, RoleType,
    },
    errors::AppError,
};

#[derive(Deserialize)]
pub struct CreateERCaseRequest {
    pub entity_type: String,
    pub source_entity_id: Uuid,
}

#[derive(Deserialize)]
pub struct ResolveERCaseRequest {
    pub decision: String,
    pub reason: String,
    pub notes: Option<String>,
}

pub struct EntityResolutionService;

impl EntityResolutionService {
    /// Loads active matching model configuration from database or returns default
    pub async fn get_active_config(pool: &PgPool) -> MatchingModelConfig {
        let row = sqlx::query(
            r#"
            SELECT version, name, strong_match_threshold, possible_match_threshold,
                   non_match_threshold, duplicate_high_threshold, duplicate_review_threshold,
                   field_weights, blocking_strategies, normalization_version
            FROM matching_model_versions
            WHERE is_active = TRUE
            ORDER BY created_at DESC
            LIMIT 1
            "#,
        )
        .fetch_optional(pool)
        .await
        .unwrap_or(None);

        if let Some(r) = row {
            let blocking_val: serde_json::Value = r.get("blocking_strategies");
            let blocking_vec: Vec<String> = serde_json::from_value(blocking_val).unwrap_or_default();

            MatchingModelConfig {
                version: r.get("version"),
                name: r.get("name"),
                strong_match_threshold: r.get("strong_match_threshold"),
                possible_match_threshold: r.get("possible_match_threshold"),
                non_match_threshold: r.get("non_match_threshold"),
                duplicate_high_threshold: r.get("duplicate_high_threshold"),
                duplicate_review_threshold: r.get("duplicate_review_threshold"),
                field_weights: r.get("field_weights"),
                blocking_strategies: blocking_vec,
                normalization_version: r.get("normalization_version"),
            }
        } else {
            MatchingModelConfig::default()
        }
    }

    /// Creates and evaluates an Entity Resolution case
    pub async fn create_case(
        pool: &PgPool,
        caller: &AuthenticatedUser,
        payload: CreateERCaseRequest,
    ) -> Result<EntityResolutionCase, AppError> {
        let config = Self::get_active_config(pool).await;
        let case_id = Uuid::new_v4();
        let public_id = format!("ERC-{}", &case_id.to_string()[..8].to_uppercase());

        // Resolve source label
        let source_label = match payload.entity_type.as_str() {
            "PERSON" => {
                let p = sqlx::query_as!(
                    Person,
                    r#"
                    SELECT id, public_id, first_name, middle_name, last_name,
                           date_of_birth, gender, phone, email, status,
                           created_by, updated_by, created_at, updated_at
                    FROM persons WHERE id = $1
                    "#,
                    payload.source_entity_id
                )
                .fetch_optional(pool)
                .await?
                .ok_or_else(|| AppError::NotFound(format!("Source person {} not found", payload.source_entity_id)))?;

                format!("{} {}", p.first_name, p.last_name)
            }
            "HOUSEHOLD" => {
                let name: String = sqlx::query_scalar("SELECT name FROM households WHERE id = $1")
                    .bind(payload.source_entity_id)
                    .fetch_optional(pool)
                    .await?
                    .ok_or_else(|| AppError::NotFound(format!("Source household {} not found", payload.source_entity_id)))?;
                name
            }
            "PROPERTY" => {
                let addr: String = sqlx::query_scalar("SELECT address_line FROM properties WHERE id = $1")
                    .bind(payload.source_entity_id)
                    .fetch_optional(pool)
                    .await?
                    .ok_or_else(|| AppError::NotFound(format!("Source property {} not found", payload.source_entity_id)))?;
                addr
            }
            _ => return Err(AppError::BadRequest("Invalid entity_type. Expected PERSON, HOUSEHOLD, or PROPERTY".to_string())),
        };

        // Insert case record
        sqlx::query(
            r#"
            INSERT INTO entity_resolution_cases (
                id, public_id, entity_type, source_entity_id, status, priority,
                matching_model_version, summary, created_by, created_at, updated_at
            )
            VALUES ($1, $2, $3, $4, 'OPEN', 'MEDIUM', $5, $6, $7, NOW(), NOW())
            "#,
        )
        .bind(case_id)
        .bind(&public_id)
        .bind(&payload.entity_type)
        .bind(payload.source_entity_id)
        .bind(&config.version)
        .bind(format!("Entity resolution check initiated for {} ({})", source_label, payload.entity_type))
        .bind(caller.id)
        .execute(pool)
        .await?;

        // Candidate Generation & Evaluation
        let mut evaluated_candidates = Vec::new();
        let mut highest_priority = "LOW";

        if payload.entity_type == "PERSON" {
            let source_person = sqlx::query_as!(
                Person,
                r#"
                SELECT id, public_id, first_name, middle_name, last_name,
                       date_of_birth, gender, phone, email, status,
                       created_by, updated_by, created_at, updated_at
                FROM persons WHERE id = $1
                "#,
                payload.source_entity_id
            )
            .fetch_one(pool)
            .await?;

            let candidate_ids = BlockingEngine::generate_person_candidates(pool, &source_person, &config).await?;

            let mut rank = 1;
            for cid in candidate_ids {
                let cand_person = sqlx::query_as!(
                    Person,
                    r#"
                    SELECT id, public_id, first_name, middle_name, last_name,
                           date_of_birth, gender, phone, email, status,
                           created_by, updated_by, created_at, updated_at
                    FROM persons WHERE id = $1
                    "#,
                    cid
                )
                .fetch_optional(pool)
                .await?;

                if let Some(cp) = cand_person {
                    let mut evaluated = PersonEvaluator::evaluate_person_pair(pool, &source_person, &cp, &config, rank).await?;
                    evaluated.case_id = case_id;

                    // Persist candidate
                    sqlx::query(
                        r#"
                        INSERT INTO entity_resolution_candidates (
                            id, case_id, candidate_entity_id, candidate_rank,
                            overall_assessment, confidence_score, support_score,
                            contradiction_penalty, hard_contradiction_detected,
                            summary, why_flagged, why_not_confident, created_at
                        )
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW())
                        "#,
                    )
                    .bind(evaluated.id)
                    .bind(case_id)
                    .bind(evaluated.candidate_entity_id)
                    .bind(evaluated.candidate_rank)
                    .bind(&evaluated.overall_assessment)
                    .bind(evaluated.confidence_score)
                    .bind(evaluated.support_score)
                    .bind(evaluated.contradiction_penalty)
                    .bind(evaluated.hard_contradiction_detected)
                    .bind(&evaluated.summary)
                    .bind(&evaluated.why_flagged)
                    .bind(&evaluated.why_not_confident)
                    .execute(pool)
                    .await?;

                    // Persist evidence
                    for mut ev in evaluated.evidence.clone() {
                        ev.candidate_id = evaluated.id;
                        sqlx::query(
                            r#"
                            INSERT INTO entity_resolution_evidence (
                                id, candidate_id, field, source_value, candidate_value,
                                comparison_method, comparison_result, similarity, weight,
                                direction, explanation, created_at
                            )
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
                            "#,
                        )
                        .bind(ev.id)
                        .bind(evaluated.id)
                        .bind(&ev.field)
                        .bind(&ev.source_value)
                        .bind(&ev.candidate_value)
                        .bind(&ev.comparison_method)
                        .bind(&ev.comparison_result)
                        .bind(ev.similarity)
                        .bind(ev.weight)
                        .bind(&ev.direction)
                        .bind(&ev.explanation)
                        .execute(pool)
                        .await?;
                    }

                    if evaluated.overall_assessment == "STRONG_MATCH" {
                        highest_priority = "HIGH";
                    } else if evaluated.overall_assessment == "POSSIBLE_MATCH" && highest_priority != "HIGH" {
                        highest_priority = "MEDIUM";
                    }

                    evaluated_candidates.push(evaluated);
                    rank += 1;
                }
            }
        }

        // Update case with calculated priority & summary
        let summary_text = if evaluated_candidates.is_empty() {
            "No candidate matches found across blocking blocks.".to_string()
        } else {
            format!("Surfaced {} potential candidate match(es). Highest assessment: {}", evaluated_candidates.len(), highest_priority)
        };

        sqlx::query(
            "UPDATE entity_resolution_cases SET priority = $1, summary = $2, updated_at = NOW() WHERE id = $3",
        )
        .bind(highest_priority)
        .bind(&summary_text)
        .bind(case_id)
        .execute(pool)
        .await?;

        // Audit Log
        crate::application::AuditService::log_event(
            pool,
            "ER_CASE_CREATED",
            Some(caller.id),
            None,
            &format!("req-{}", Uuid::new_v4()),
            None,
            serde_json::json!({
                "case_id": case_id,
                "public_id": public_id,
                "entity_type": payload.entity_type,
                "candidates_found": evaluated_candidates.len(),
                "priority": highest_priority
            }),
        )
        .await;

        Self::get_case_by_id(pool, caller, case_id).await
    }

    /// List entity resolution cases
    pub async fn list_cases(
        pool: &PgPool,
        _caller: &AuthenticatedUser,
        status: Option<&str>,
        priority: Option<&str>,
        page: i64,
        limit: i64,
    ) -> Result<Vec<EntityResolutionCase>, AppError> {
        let offset = (page.max(1) - 1) * limit;
        let mut qb = sqlx::QueryBuilder::new(
            r#"
            SELECT c.id, c.public_id, c.entity_type, c.source_entity_id,
                   c.status, c.priority, c.matching_model_version, c.summary,
                   c.resolved_at, c.resolved_by, c.resolution, c.created_at, c.updated_at
            FROM entity_resolution_cases c
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
            let cid: Uuid = r.get("id");
            let etype: String = r.get("entity_type");
            let s_id: Uuid = r.get("source_entity_id");

            let s_label = match etype.as_str() {
                "PERSON" => {
                    sqlx::query_scalar::<_, String>("SELECT (first_name || ' ' || last_name) FROM persons WHERE id = $1")
                        .bind(s_id)
                        .fetch_optional(pool)
                        .await?
                }
                "HOUSEHOLD" => {
                    sqlx::query_scalar::<_, String>("SELECT name FROM households WHERE id = $1")
                        .bind(s_id)
                        .fetch_optional(pool)
                        .await?
                }
                "PROPERTY" => {
                    sqlx::query_scalar::<_, String>("SELECT address_line FROM properties WHERE id = $1")
                        .bind(s_id)
                        .fetch_optional(pool)
                        .await?
                }
                _ => None,
            };

            cases.push(EntityResolutionCase {
                id: cid,
                public_id: r.get("public_id"),
                entity_type: etype,
                source_entity_id: s_id,
                source_entity_label: s_label,
                status: r.get("status"),
                priority: r.get("priority"),
                matching_model_version: r.get("matching_model_version"),
                summary: r.get("summary"),
                resolved_at: r.get("resolved_at"),
                resolved_by: r.get("resolved_by"),
                resolution: r.get("resolution"),
                candidates: Vec::new(),
                created_at: r.get("created_at"),
                updated_at: r.get("updated_at"),
            });
        }

        Ok(cases)
    }

    /// Retrieve full entity resolution case by ID including candidates and evidence
    pub async fn get_case_by_id(
        pool: &PgPool,
        _caller: &AuthenticatedUser,
        case_id: Uuid,
    ) -> Result<EntityResolutionCase, AppError> {
        let r = sqlx::query(
            r#"
            SELECT c.id, c.public_id, c.entity_type, c.source_entity_id,
                   c.status, c.priority, c.matching_model_version, c.summary,
                   c.resolved_at, c.resolved_by, c.resolution, c.created_at, c.updated_at
            FROM entity_resolution_cases c
            WHERE c.id = $1
            "#,
        )
        .bind(case_id)
        .fetch_optional(pool)
        .await?
        .ok_or_else(|| AppError::NotFound(format!("Entity resolution case {} not found", case_id)))?;

        let etype: String = r.get("entity_type");
        let s_id: Uuid = r.get("source_entity_id");

        let s_label = match etype.as_str() {
            "PERSON" => {
                sqlx::query_scalar::<_, String>("SELECT (first_name || ' ' || last_name) FROM persons WHERE id = $1")
                    .bind(s_id)
                    .fetch_optional(pool)
                    .await?
            }
            "HOUSEHOLD" => {
                sqlx::query_scalar::<_, String>("SELECT name FROM households WHERE id = $1")
                    .bind(s_id)
                    .fetch_optional(pool)
                    .await?
            }
            "PROPERTY" => {
                sqlx::query_scalar::<_, String>("SELECT address_line FROM properties WHERE id = $1")
                    .bind(s_id)
                    .fetch_optional(pool)
                    .await?
            }
            _ => None,
        };

        // Fetch candidates
        let cand_rows = sqlx::query(
            r#"
            SELECT id, case_id, candidate_entity_id, candidate_rank,
                   overall_assessment, confidence_score, support_score,
                   contradiction_penalty, hard_contradiction_detected,
                   summary, why_flagged, why_not_confident, created_at
            FROM entity_resolution_candidates
            WHERE case_id = $1
            ORDER BY candidate_rank ASC
            "#,
        )
        .bind(case_id)
        .fetch_all(pool)
        .await?;

        let mut candidates = Vec::new();
        for cr in cand_rows {
            let cand_id: Uuid = cr.get("id");
            let cand_entity_id: Uuid = cr.get("candidate_entity_id");

            let c_label = match etype.as_str() {
                "PERSON" => {
                    sqlx::query_scalar::<_, String>("SELECT (first_name || ' ' || last_name) FROM persons WHERE id = $1")
                        .bind(cand_entity_id)
                        .fetch_optional(pool)
                        .await?
                }
                "HOUSEHOLD" => {
                    sqlx::query_scalar::<_, String>("SELECT name FROM households WHERE id = $1")
                        .bind(cand_entity_id)
                        .fetch_optional(pool)
                        .await?
                }
                "PROPERTY" => {
                    sqlx::query_scalar::<_, String>("SELECT address_line FROM properties WHERE id = $1")
                        .bind(cand_entity_id)
                        .fetch_optional(pool)
                        .await?
                }
                _ => None,
            };

            // Fetch evidence for this candidate
            let ev_rows = sqlx::query(
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
            .fetch_all(pool)
            .await?;

            let mut evidence = Vec::new();
            for er in ev_rows {
                evidence.push(EntityResolutionEvidence {
                    id: er.get("id"),
                    candidate_id: er.get("candidate_id"),
                    field: er.get("field"),
                    source_value: er.get("source_value"),
                    candidate_value: er.get("candidate_value"),
                    comparison_method: er.get("comparison_method"),
                    comparison_result: er.get("comparison_result"),
                    similarity: er.get("similarity"),
                    weight: er.get("weight"),
                    direction: er.get("direction"),
                    explanation: er.get("explanation"),
                    created_at: er.get("created_at"),
                });
            }

            candidates.push(EntityResolutionCandidate {
                id: cand_id,
                case_id,
                candidate_entity_id: cand_entity_id,
                candidate_entity_label: c_label,
                candidate_rank: cr.get("candidate_rank"),
                overall_assessment: cr.get("overall_assessment"),
                confidence_score: cr.get("confidence_score"),
                support_score: cr.get("support_score"),
                contradiction_penalty: cr.get("contradiction_penalty"),
                hard_contradiction_detected: cr.get("hard_contradiction_detected"),
                summary: cr.get("summary"),
                why_flagged: cr.get("why_flagged"),
                why_not_confident: cr.get("why_not_confident"),
                evidence,
                created_at: cr.get("created_at"),
            });
        }

        Ok(EntityResolutionCase {
            id: case_id,
            public_id: r.get("public_id"),
            entity_type: etype,
            source_entity_id: s_id,
            source_entity_label: s_label,
            status: r.get("status"),
            priority: r.get("priority"),
            matching_model_version: r.get("matching_model_version"),
            summary: r.get("summary"),
            resolved_at: r.get("resolved_at"),
            resolved_by: r.get("resolved_by"),
            resolution: r.get("resolution"),
            candidates,
            created_at: r.get("created_at"),
            updated_at: r.get("updated_at"),
        })
    }

    /// Resolves an entity resolution case with human-in-the-loop audit trail
    pub async fn resolve_case(
        pool: &PgPool,
        caller: &AuthenticatedUser,
        case_id: Uuid,
        payload: ResolveERCaseRequest,
    ) -> Result<EntityResolutionCase, AppError> {
        let is_authorized = caller.roles.iter().any(|r| {
            matches!(r.as_str(), "VERIFICATION_OFFICER" | "DEPARTMENT_ADMIN" | "SUPER_ADMIN")
        });

        if !is_authorized {
            return Err(AppError::Forbidden("Only verification officers and admins can resolve entity cases".to_string()));
        }

        let new_status = match payload.decision.as_str() {
            "MATCH" => "RESOLVED_MATCH",
            "NON_MATCH" => "RESOLVED_NON_MATCH",
            _ => "RESOLVED_UNCERTAIN",
        };

        // 1. Record immutable human decision
        sqlx::query(
            r#"
            INSERT INTO entity_resolution_decisions (
                id, case_id, decision, reason, notes, evidence_reference,
                decided_by, decided_at
            )
            VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW())
            "#,
        )
        .bind(case_id)
        .bind(&payload.decision)
        .bind(&payload.reason)
        .bind(&payload.notes)
        .bind(serde_json::json!({ "recorded_by": caller.id, "role": caller.roles }))
        .bind(caller.id)
        .execute(pool)
        .await?;

        // 2. Update case status
        sqlx::query(
            r#"
            UPDATE entity_resolution_cases
            SET status = $1, resolution = $2, resolved_at = NOW(), resolved_by = $3, updated_at = NOW()
            WHERE id = $4
            "#,
        )
        .bind(new_status)
        .bind(&payload.decision)
        .bind(caller.id)
        .bind(case_id)
        .execute(pool)
        .await?;

        // 3. Audit trail event
        crate::application::AuditService::log_event(
            pool,
            "ER_CASE_RESOLVED",
            Some(caller.id),
            None,
            &format!("req-{}", Uuid::new_v4()),
            None,
            serde_json::json!({
                "case_id": case_id,
                "decision": payload.decision,
                "reason": payload.reason,
                "notes": payload.notes,
                "new_status": new_status
            }),
        )
        .await;

        Self::get_case_by_id(pool, caller, case_id).await
    }
}
