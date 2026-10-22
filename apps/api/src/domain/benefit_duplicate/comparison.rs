use chrono::NaiveDate;
use sqlx::PgPool;
use uuid::Uuid;

use crate::{
    domain::{
        benefit_duplicate::scope::BenefitScope,
        entity_resolution::models::{
            BenefitDuplicateCandidate, BenefitDuplicateEvidence, DuplicateCategory,
        },
        Application, Benefit,
    },
    errors::AppError,
};

pub struct DuplicateComparator;

impl DuplicateComparator {
    /// Compares an application against an existing benefit under scheme scope semantics
    pub async fn compare_application_with_benefit(
        _pool: &PgPool,
        application: &Application,
        scope: BenefitScope,
        benefit: &Benefit,
        rank: i32,
    ) -> Result<BenefitDuplicateCandidate, AppError> {
        let mut evidence_items = Vec::new();
        let mut overlap_score: f64 = 0.0;

        // 1. Scope and Target Unit Comparison
        let (unit_matches, unit_field, source_val, existing_val) = match scope {
            BenefitScope::Individual => {
                let s_id = application.target_person_id.unwrap_or(application.applicant_person_id);
                let e_id = benefit.person_id;
                let matches = e_id.map_or(false, |id| id == s_id);
                (
                    matches,
                    "target_person",
                    Some(s_id.to_string()),
                    e_id.map(|id| id.to_string()),
                )
            }
            BenefitScope::Household => {
                let s_id = application.target_household_id;
                let e_id = benefit.household_id;
                let matches = s_id.is_some() && e_id.is_some() && s_id == e_id;
                (
                    matches,
                    "target_household",
                    s_id.map(|id| id.to_string()),
                    e_id.map(|id| id.to_string()),
                )
            }
            BenefitScope::Property => {
                let s_id = application.target_property_id;
                let e_id = benefit.property_id;
                let matches = s_id.is_some() && e_id.is_some() && s_id == e_id;
                (
                    matches,
                    "target_property",
                    s_id.map(|id| id.to_string()),
                    e_id.map(|id| id.to_string()),
                )
            }
            BenefitScope::Composite => {
                let p_matches = application.target_person_id.is_some() && application.target_person_id == benefit.person_id;
                let h_matches = application.target_household_id.is_some() && application.target_household_id == benefit.household_id;
                (p_matches || h_matches, "composite_unit", None, None)
            }
        };

        if unit_matches {
            overlap_score += 0.40;
            evidence_items.push(BenefitDuplicateEvidence {
                id: Uuid::new_v4(),
                candidate_id: Uuid::nil(),
                field: unit_field.to_string(),
                source_value: source_val,
                existing_value: existing_val,
                result: "SUPPORTS_MATCH".to_string(),
                weight: 0.40,
                explanation: format!(
                    "Exact benefit unit match for {} scope. Both reference identical entity identifier.",
                    scope.as_str()
                ),
                created_at: chrono::Utc::now(),
            });
        } else {
            evidence_items.push(BenefitDuplicateEvidence {
                id: Uuid::new_v4(),
                candidate_id: Uuid::nil(),
                field: unit_field.to_string(),
                source_value: source_val,
                existing_value: existing_val,
                result: "CONTRADICTS_MATCH".to_string(),
                weight: 0.50,
                explanation: format!(
                    "Different benefit unit entities under {} scope. Critical false-positive protection active.",
                    scope.as_str()
                ),
                created_at: chrono::Utc::now(),
            });
        }

        // 2. Scheme Comparison
        let scheme_matches = application.scheme_id == benefit.scheme_id;
        if scheme_matches {
            overlap_score += 0.30;
            evidence_items.push(BenefitDuplicateEvidence {
                id: Uuid::new_v4(),
                candidate_id: Uuid::nil(),
                field: "scheme".to_string(),
                source_value: Some(application.scheme_id.to_string()),
                existing_value: Some(benefit.scheme_id.to_string()),
                result: "SUPPORTS_MATCH".to_string(),
                weight: 0.30,
                explanation: "Both claims pertain to the identical public benefit scheme.".to_string(),
                created_at: chrono::Utc::now(),
            });
        } else {
            evidence_items.push(BenefitDuplicateEvidence {
                id: Uuid::new_v4(),
                candidate_id: Uuid::nil(),
                field: "scheme".to_string(),
                source_value: Some(application.scheme_id.to_string()),
                existing_value: Some(benefit.scheme_id.to_string()),
                result: "CONTRADICTS_MATCH".to_string(),
                weight: 0.30,
                explanation: "Different public schemes (independent benefit entitlements).".to_string(),
                created_at: chrono::Utc::now(),
            });
        }

        // 3. Temporal Overlap Comparison
        let is_overlapping = match benefit.valid_to {
            Some(end_date) => application.application_date >= benefit.valid_from && application.application_date <= end_date,
            None => application.application_date >= benefit.valid_from,
        };

        if is_overlapping {
            overlap_score += 0.30;
            evidence_items.push(BenefitDuplicateEvidence {
                id: Uuid::new_v4(),
                candidate_id: Uuid::nil(),
                field: "benefit_period".to_string(),
                source_value: Some(application.application_date.to_string()),
                existing_value: Some(format!(
                    "{} to {}",
                    benefit.valid_from,
                    benefit.valid_to.map_or("indefinite".to_string(), |d| d.to_string())
                )),
                result: "SUPPORTS_MATCH".to_string(),
                weight: 0.30,
                explanation: "Application date falls within the active entitlement period of the existing benefit.".to_string(),
                created_at: chrono::Utc::now(),
            });
        } else {
            evidence_items.push(BenefitDuplicateEvidence {
                id: Uuid::new_v4(),
                candidate_id: Uuid::nil(),
                field: "benefit_period".to_string(),
                source_value: Some(application.application_date.to_string()),
                existing_value: Some(format!(
                    "{} to {}",
                    benefit.valid_from,
                    benefit.valid_to.map_or("indefinite".to_string(), |d| d.to_string())
                )),
                result: "NEUTRAL".to_string(),
                weight: 0.10,
                explanation: "Non-overlapping benefit periods (existing benefit has expired).".to_string(),
                created_at: chrono::Utc::now(),
            });
        }

        // Determine Duplicate Category
        let category = if !unit_matches {
            DuplicateCategory::NotDuplicate
        } else if scheme_matches && is_overlapping {
            if overlap_score >= 0.95 {
                DuplicateCategory::ExactDuplicate
            } else {
                DuplicateCategory::LikelyDuplicate
            }
        } else if scheme_matches {
            DuplicateCategory::PotentialDuplicate
        } else {
            DuplicateCategory::NotDuplicate
        };

        let explanation = format!(
            "Evaluation: {} (Overlap Score: {:.2}). {}",
            category.as_str(),
            overlap_score,
            if !unit_matches {
                "Distinct target entities; legitimate separate claim."
            } else if scheme_matches && is_overlapping {
                "Target entity holds an active, overlapping benefit under the identical scheme."
            } else {
                "Previous benefit found with potential overlap or historical relationship."
            }
        );

        Ok(BenefitDuplicateCandidate {
            id: Uuid::new_v4(),
            case_id: Uuid::nil(),
            existing_benefit_id: benefit.id,
            existing_benefit_public_id: Some(benefit.public_id.clone()),
            existing_benefit_amount: benefit.amount,
            existing_benefit_asset: benefit.description.clone(),
            candidate_rank: rank,
            duplicate_category: category.as_str().to_string(),
            overlap_score: (overlap_score * 100.0).round() / 100.0,
            explanation,
            evidence: evidence_items,
            created_at: chrono::Utc::now(),
        })
    }
}
