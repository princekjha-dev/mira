use chrono::Datelike;
use sqlx::{PgPool, Row};
use uuid::Uuid;

use crate::{
    domain::{
        entity_resolution::{
            models::{
                EntityResolutionCandidate, EntityResolutionEvidence, EvidenceDirection,
                MatchingModelConfig, OverallAssessment,
            },
            normalization::{compare_dates_with_conflict, normalize_name, normalize_phone, tokenize_address},
            similarity::{compare_names, token_jaccard_similarity},
        },
        Person,
    },
    errors::AppError,
};

/// Evaluates a candidate person against a source person and generates structured explainable evidence
pub struct PersonEvaluator;

impl PersonEvaluator {
    pub async fn evaluate_person_pair(
        pool: &PgPool,
        source_person: &Person,
        candidate_person: &Person,
        config: &MatchingModelConfig,
        rank: i32,
    ) -> Result<EntityResolutionCandidate, AppError> {
        let mut evidence_items = Vec::new();
        let mut support_score = 0.0;
        let mut contradiction_penalty = 0.0;
        let mut hard_contradiction = false;

        // Extract weights from config
        let w_name = config.field_weights.get("name").and_then(|v| v.as_f64()).unwrap_or(0.30);
        let w_dob = config.field_weights.get("date_of_birth").and_then(|v| v.as_f64()).unwrap_or(0.25);
        let w_parent = config.field_weights.get("parent_name").and_then(|v| v.as_f64()).unwrap_or(0.15);
        let w_address = config.field_weights.get("address").and_then(|v| v.as_f64()).unwrap_or(0.10);
        let w_household = config.field_weights.get("household").and_then(|v| v.as_f64()).unwrap_or(0.10);
        let w_phone = config.field_weights.get("phone").and_then(|v| v.as_f64()).unwrap_or(0.05);
        let w_gender = config.field_weights.get("gender").and_then(|v| v.as_f64()).unwrap_or(0.05);

        // 1. Name Comparison
        let source_full_name = format!("{} {}", source_person.first_name, source_person.last_name);
        let candidate_full_name = format!("{} {}", candidate_person.first_name, candidate_person.last_name);
        let name_res = compare_names(&source_full_name, &candidate_full_name);

        let (name_direction, name_result_str) = if name_res.similarity >= 0.85 {
            (EvidenceDirection::SupportsMatch, "STRONG_SIMILARITY")
        } else if name_res.similarity >= 0.65 {
            (EvidenceDirection::SupportsMatch, "MODERATE_SIMILARITY")
        } else if name_res.similarity <= 0.35 {
            (EvidenceDirection::ContradictsMatch, "DISSIMILAR")
        } else {
            (EvidenceDirection::Neutral, "NEUTRAL")
        };

        if name_direction == EvidenceDirection::SupportsMatch {
            support_score += w_name * name_res.similarity;
        } else if name_direction == EvidenceDirection::ContradictsMatch {
            contradiction_penalty += w_name * 0.5;
        }

        let name_explanation = format!(
            "Name similarity is {:.1}% using {} comparison. Source: '{}', Candidate: '{}'.",
            name_res.similarity * 100.0,
            name_res.method,
            source_full_name,
            candidate_full_name
        );

        evidence_items.push(EntityResolutionEvidence {
            id: Uuid::new_v4(),
            candidate_id: Uuid::nil(),
            field: "name".to_string(),
            source_value: Some(source_full_name.clone()),
            candidate_value: Some(candidate_full_name.clone()),
            comparison_method: name_res.method.to_string(),
            comparison_result: name_result_str.to_string(),
            similarity: (name_res.similarity * 100.0).round() / 100.0,
            weight: w_name,
            direction: name_direction.as_str().to_string(),
            explanation: name_explanation,
            created_at: chrono::Utc::now(),
        });

        // 2. Date of Birth Comparison
        let (dob_direction, dob_penalty, dob_expl) = compare_dates_with_conflict(
            source_person.date_of_birth,
            candidate_person.date_of_birth,
        );

        let (dob_sim, dob_res_str) = match dob_direction {
            EvidenceDirection::SupportsMatch => {
                support_score += w_dob;
                (1.0, "EXACT_MATCH")
            }
            EvidenceDirection::ContradictsMatch => {
                contradiction_penalty += w_dob * dob_penalty;
                // If DOB is off by more than 5 years, mark hard contradiction
                if let (Some(d1), Some(d2)) = (source_person.date_of_birth, candidate_person.date_of_birth) {
                    if (d1.year() - d2.year()).abs() >= 5 {
                        hard_contradiction = true;
                    }
                }
                (0.0, "CONFLICT")
            }
            EvidenceDirection::Neutral => (0.0, "MISSING_DATA"),
        };

        evidence_items.push(EntityResolutionEvidence {
            id: Uuid::new_v4(),
            candidate_id: Uuid::nil(),
            field: "date_of_birth".to_string(),
            source_value: source_person.date_of_birth.map(|d| d.to_string()),
            candidate_value: candidate_person.date_of_birth.map(|d| d.to_string()),
            comparison_method: "EXACT_DATE_COMPARISON".to_string(),
            comparison_result: dob_res_str.to_string(),
            similarity: dob_sim,
            weight: w_dob,
            direction: dob_direction.as_str().to_string(),
            explanation: dob_expl,
            created_at: chrono::Utc::now(),
        });

        // 3. Gender Comparison
        let (gender_dir, gender_sim, gender_expl) = match (&source_person.gender, &candidate_person.gender) {
            (Some(g1), Some(g2)) => {
                if g1.trim().to_uppercase() == g2.trim().to_uppercase() {
                    support_score += w_gender;
                    (EvidenceDirection::SupportsMatch, 1.0, format!("Gender aligns ('{}').", g1))
                } else {
                    contradiction_penalty += w_gender * 0.8;
                    (EvidenceDirection::ContradictsMatch, 0.0, format!("Gender mismatch ('{}' vs '{}').", g1, g2))
                }
            }
            _ => (EvidenceDirection::Neutral, 0.0, "Gender missing in one or both records (treated as neutral).".to_string()),
        };

        evidence_items.push(EntityResolutionEvidence {
            id: Uuid::new_v4(),
            candidate_id: Uuid::nil(),
            field: "gender".to_string(),
            source_value: source_person.gender.clone(),
            candidate_value: candidate_person.gender.clone(),
            comparison_method: "CATEGORICAL_EQUALITY".to_string(),
            comparison_result: if gender_dir == EvidenceDirection::SupportsMatch { "MATCH" } else if gender_dir == EvidenceDirection::ContradictsMatch { "MISMATCH" } else { "NEUTRAL" }.to_string(),
            similarity: gender_sim,
            weight: w_gender,
            direction: gender_dir.as_str().to_string(),
            explanation: gender_expl,
            created_at: chrono::Utc::now(),
        });

        // 4. Phone Comparison
        let (phone_dir, phone_sim, phone_expl) = match (&source_person.phone, &candidate_person.phone) {
            (Some(p1), Some(p2)) => {
                let norm1 = normalize_phone(p1);
                let norm2 = normalize_phone(p2);
                if norm1 == norm2 {
                    support_score += w_phone;
                    (EvidenceDirection::SupportsMatch, 1.0, "Exact phone number match.".to_string())
                } else if norm1.len() >= 4 && norm2.len() >= 4 && norm1[norm1.len() - 4..] == norm2[norm2.len() - 4..] {
                    support_score += w_phone * 0.7;
                    (EvidenceDirection::SupportsMatch, 0.7, "Phone number suffix match (last 4 digits).".to_string())
                } else {
                    (EvidenceDirection::Neutral, 0.0, "Different phone numbers observed (phones can change).".to_string())
                }
            }
            _ => (EvidenceDirection::Neutral, 0.0, "Phone number missing in one or both records.".to_string()),
        };

        evidence_items.push(EntityResolutionEvidence {
            id: Uuid::new_v4(),
            candidate_id: Uuid::nil(),
            field: "phone".to_string(),
            source_value: source_person.phone.clone(),
            candidate_value: candidate_person.phone.clone(),
            comparison_method: "NORMALIZED_PHONE_COMPARISON".to_string(),
            comparison_result: if phone_sim >= 0.7 { "MATCH" } else { "NEUTRAL" }.to_string(),
            similarity: phone_sim,
            weight: w_phone,
            direction: phone_dir.as_str().to_string(),
            explanation: phone_expl,
            created_at: chrono::Utc::now(),
        });

        // 5. Parent Name / Relationships Comparison
        let (parent_dir, parent_sim, parent_expl) = Self::compare_parents(pool, source_person.id, candidate_person.id).await?;
        if parent_dir == EvidenceDirection::SupportsMatch {
            support_score += w_parent * parent_sim;
        } else if parent_dir == EvidenceDirection::ContradictsMatch {
            contradiction_penalty += w_parent * 0.8;
        }

        evidence_items.push(EntityResolutionEvidence {
            id: Uuid::new_v4(),
            candidate_id: Uuid::nil(),
            field: "parent_name".to_string(),
            source_value: None,
            candidate_value: None,
            comparison_method: "FAMILY_GRAPH_PARENT_MATCH".to_string(),
            comparison_result: if parent_sim >= 0.8 { "MATCH" } else if parent_dir == EvidenceDirection::ContradictsMatch { "MISMATCH" } else { "NEUTRAL" }.to_string(),
            similarity: parent_sim,
            weight: w_parent,
            direction: parent_dir.as_str().to_string(),
            explanation: parent_expl,
            created_at: chrono::Utc::now(),
        });

        // 6. Household Membership Comparison
        let (hh_dir, hh_sim, hh_expl) = Self::compare_households(pool, source_person.id, candidate_person.id).await?;
        if hh_dir == EvidenceDirection::SupportsMatch {
            support_score += w_household * hh_sim;
        }

        evidence_items.push(EntityResolutionEvidence {
            id: Uuid::new_v4(),
            candidate_id: Uuid::nil(),
            field: "household".to_string(),
            source_value: None,
            candidate_value: None,
            comparison_method: "HOUSEHOLD_MEMBERSHIP_OVERLAP".to_string(),
            comparison_result: if hh_sim >= 0.9 { "MATCH" } else { "NEUTRAL" }.to_string(),
            similarity: hh_sim,
            weight: w_household,
            direction: hh_dir.as_str().to_string(),
            explanation: hh_expl,
            created_at: chrono::Utc::now(),
        });

        // 7. Address / Property Locality Comparison
        let (addr_dir, addr_sim, addr_expl) = Self::compare_addresses(pool, source_person.id, candidate_person.id).await?;
        if addr_dir == EvidenceDirection::SupportsMatch {
            support_score += w_address * addr_sim;
        }

        evidence_items.push(EntityResolutionEvidence {
            id: Uuid::new_v4(),
            candidate_id: Uuid::nil(),
            field: "address".to_string(),
            source_value: None,
            candidate_value: None,
            comparison_method: "ADDRESS_TOKEN_JACCARD".to_string(),
            comparison_result: if addr_sim >= 0.6 { "SIMILAR" } else { "NEUTRAL" }.to_string(),
            similarity: addr_sim,
            weight: w_address,
            direction: addr_dir.as_str().to_string(),
            explanation: addr_expl,
            created_at: chrono::Utc::now(),
        });

        // Calculate final assessment score
        let confidence_score = ((support_score - contradiction_penalty).clamp(0.0, 1.0) * 100.0).round() / 100.0;

        let overall_assessment = if hard_contradiction {
            if confidence_score > 0.40 {
                OverallAssessment::Uncertain
            } else {
                OverallAssessment::LikelyNonMatch
            }
        } else if confidence_score >= config.strong_match_threshold && contradiction_penalty == 0.0 {
            OverallAssessment::StrongMatch
        } else if confidence_score >= config.possible_match_threshold {
            OverallAssessment::PossibleMatch
        } else if confidence_score >= config.non_match_threshold {
            OverallAssessment::WeakMatch
        } else {
            OverallAssessment::LikelyNonMatch
        };

        // Construct explainability strings: why_flagged & why_not_confident
        let why_flagged = format!(
            "Surfaced because candidate shares name prefix/transliteration ('{}') with {:.1}% similarity and corroborating demographic signals.",
            source_person.first_name,
            name_res.similarity * 100.0
        );

        let why_not_confident = if hard_contradiction {
            "Strong contradiction detected (such as significant date of birth difference). Requires mandatory human verification.".to_string()
        } else if contradiction_penalty > 0.0 {
            "Contradicting evidence detected in date of birth or demographic attributes. Manual verification recommended.".to_string()
        } else if overall_assessment == OverallAssessment::StrongMatch {
            "High confidence deterministic match across primary identity attributes with zero contradictions.".to_string()
        } else {
            "Evidence is inconclusive due to missing corroborating records or partial token similarity.".to_string()
        };

        let summary = format!(
            "Assessment: {} (Score: {:.2}, Support: {:.2}, Penalty: {:.2})",
            overall_assessment.as_str(),
            confidence_score,
            support_score,
            contradiction_penalty
        );

        Ok(EntityResolutionCandidate {
            id: Uuid::new_v4(),
            case_id: Uuid::nil(),
            candidate_entity_id: candidate_person.id,
            candidate_entity_label: Some(candidate_full_name),
            candidate_rank: rank,
            overall_assessment: overall_assessment.as_str().to_string(),
            confidence_score,
            support_score: (support_score * 100.0).round() / 100.0,
            contradiction_penalty: (contradiction_penalty * 100.0).round() / 100.0,
            hard_contradiction_detected: hard_contradiction,
            summary,
            why_flagged: Some(why_flagged),
            why_not_confident: Some(why_not_confident),
            evidence: evidence_items,
            created_at: chrono::Utc::now(),
        })
    }

    async fn compare_parents(
        pool: &PgPool,
        source_id: Uuid,
        candidate_id: Uuid,
    ) -> Result<(EvidenceDirection, f64, String), AppError> {
        // Query parent names for source
        let source_parents = sqlx::query(
            r#"
            SELECT p.first_name, p.last_name
            FROM person_relationships pr
            JOIN persons p ON pr.related_person_id = p.id
            WHERE pr.person_id = $1 AND pr.relationship_type = 'CHILD'
            "#,
        )
        .bind(source_id)
        .fetch_all(pool)
        .await
        .unwrap_or_default();

        let cand_parents = sqlx::query(
            r#"
            SELECT p.first_name, p.last_name
            FROM person_relationships pr
            JOIN persons p ON pr.related_person_id = p.id
            WHERE pr.person_id = $1 AND pr.relationship_type = 'CHILD'
            "#,
        )
        .bind(candidate_id)
        .fetch_all(pool)
        .await
        .unwrap_or_default();

        if source_parents.is_empty() || cand_parents.is_empty() {
            return Ok((
                EvidenceDirection::Neutral,
                0.0,
                "Parent relationship information missing or unlinked for comparison.".to_string(),
            ));
        }

        let mut max_sim = 0.0;
        for sp in &source_parents {
            let s_name = format!("{} {}", sp.get::<String, _>("first_name"), sp.get::<String, _>("last_name"));
            for cp in &cand_parents {
                let c_name = format!("{} {}", cp.get::<String, _>("first_name"), cp.get::<String, _>("last_name"));
                let cmp = compare_names(&s_name, &c_name);
                if cmp.similarity > max_sim {
                    max_sim = cmp.similarity;
                }
            }
        }

        if max_sim >= 0.85 {
            Ok((
                EvidenceDirection::SupportsMatch,
                max_sim,
                format!("Parent records match with {:.1}% similarity.", max_sim * 100.0),
            ))
        } else if max_sim < 0.40 {
            Ok((
                EvidenceDirection::ContradictsMatch,
                max_sim,
                "Both records have linked parents but names disagree (possible siblings or distinct families).".to_string(),
            ))
        } else {
            Ok((
                EvidenceDirection::Neutral,
                max_sim,
                format!("Partial parent name similarity ({:.1}%).", max_sim * 100.0),
            ))
        }
    }

    async fn compare_households(
        pool: &PgPool,
        source_id: Uuid,
        candidate_id: Uuid,
    ) -> Result<(EvidenceDirection, f64, String), AppError> {
        let rows = sqlx::query(
            r#"
            SELECT hm1.household_id
            FROM household_members hm1
            JOIN household_members hm2 ON hm1.household_id = hm2.household_id
            WHERE hm1.person_id = $1 AND hm2.person_id = $2
            "#,
        )
        .bind(source_id)
        .bind(candidate_id)
        .fetch_all(pool)
        .await
        .unwrap_or_default();

        if !rows.is_empty() {
            Ok((
                EvidenceDirection::SupportsMatch,
                1.0,
                "Both records are registered members of the same household (co-habitants).".to_string(),
            ))
        } else {
            Ok((
                EvidenceDirection::Neutral,
                0.0,
                "No shared household membership recorded.".to_string(),
            ))
        }
    }

    async fn compare_addresses(
        pool: &PgPool,
        source_id: Uuid,
        candidate_id: Uuid,
    ) -> Result<(EvidenceDirection, f64, String), AppError> {
        let source_props = sqlx::query(
            r#"
            SELECT p.address_line, p.locality, p.district, p.postal_code
            FROM property_associations pa
            JOIN properties p ON pa.property_id = p.id
            WHERE pa.person_id = $1
            "#,
        )
        .bind(source_id)
        .fetch_all(pool)
        .await
        .unwrap_or_default();

        let cand_props = sqlx::query(
            r#"
            SELECT p.address_line, p.locality, p.district, p.postal_code
            FROM property_associations pa
            JOIN properties p ON pa.property_id = p.id
            WHERE pa.person_id = $1
            "#,
        )
        .bind(candidate_id)
        .fetch_all(pool)
        .await
        .unwrap_or_default();

        if source_props.is_empty() || cand_props.is_empty() {
            return Ok((
                EvidenceDirection::Neutral,
                0.0,
                "Property or address records missing for one or both individuals.".to_string(),
            ));
        }

        let mut max_sim = 0.0;
        let mut best_expl = String::new();

        for sp in &source_props {
            let s_addr = format!(
                "{} {} {} {}",
                sp.get::<String, _>("address_line"),
                sp.get::<Option<String>, _>("locality").unwrap_or_default(),
                sp.get::<Option<String>, _>("district").unwrap_or_default(),
                sp.get::<Option<String>, _>("postal_code").unwrap_or_default()
            );
            let s_tokens = tokenize_address(&s_addr);

            for cp in &cand_props {
                let c_addr = format!(
                    "{} {} {} {}",
                    cp.get::<String, _>("address_line"),
                    cp.get::<Option<String>, _>("locality").unwrap_or_default(),
                    cp.get::<Option<String>, _>("district").unwrap_or_default(),
                    cp.get::<Option<String>, _>("postal_code").unwrap_or_default()
                );
                let c_tokens = tokenize_address(&c_addr);

                let sim = token_jaccard_similarity(&s_tokens, &c_tokens);
                if sim > max_sim {
                    max_sim = sim;
                    best_expl = format!("Address token overlap {:.1}% ('{}' vs '{}').", sim * 100.0, s_addr.trim(), c_addr.trim());
                }
            }
        }

        if max_sim >= 0.5 {
            Ok((EvidenceDirection::SupportsMatch, max_sim, best_expl))
        } else {
            Ok((EvidenceDirection::Neutral, max_sim, "Different or unassociated addresses.".to_string()))
        }
    }
}
