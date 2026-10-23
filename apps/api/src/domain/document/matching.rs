use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use uuid::Uuid;
use crate::domain::entity_resolution::normalization::normalize_name;
use crate::domain::entity_resolution::similarity::compare_names;
use crate::errors::AppError;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MatchedPersonCandidate {
    pub person_id: Uuid,
    pub public_id: String,
    pub full_name: String,
    pub date_of_birth: Option<String>,
    pub similarity_score: f64,
    pub assessment: String, // STRONG_MATCH, POSSIBLE_MATCH, UNCERTAIN
    pub explanation: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MatchedHouseholdCandidate {
    pub household_id: Uuid,
    pub public_id: String,
    pub household_name: String,
    pub match_level: String, // LIKELY_HOUSEHOLD_MATCH, POSSIBLE_HOUSEHOLD_MATCH, UNCERTAIN
    pub matched_members: Vec<String>,
    pub explanation: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MatchedPropertyCandidate {
    pub property_id: Uuid,
    pub public_id: String,
    pub address_line: String,
    pub property_type: String,
    pub has_previous_benefits: bool,
    pub previous_benefit_details: Option<String>,
    pub match_level: String, // EXACT_PROPERTY_MATCH, POSSIBLE_PROPERTY_MATCH, UNCERTAIN
    pub explanation: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DocumentEntityMatchResult {
    pub person_matches: Vec<MatchedPersonCandidate>,
    pub household_matches: Vec<MatchedHouseholdCandidate>,
    pub property_matches: Vec<MatchedPropertyCandidate>,
}

pub struct DocumentMatcher;

impl DocumentMatcher {
    pub async fn match_entities(
        pool: &PgPool,
        extracted_name: Option<&str>,
        extracted_dob: Option<&str>,
        extracted_property_id: Option<&str>,
        extracted_address: Option<&str>,
    ) -> Result<DocumentEntityMatchResult, AppError> {
        let mut person_matches = Vec::new();
        let mut household_matches = Vec::new();
        let mut property_matches = Vec::new();

        // 1. Person Matching via V4 Normalized Comparison
        if let Some(name) = extracted_name {
            let normalized_input_name = normalize_name(name);

            let rows = sqlx::query!(
                r#"
                SELECT id, public_id, first_name, middle_name, last_name, date_of_birth
                FROM persons
                LIMIT 50
                "#
            )
            .fetch_all(pool)
            .await
            .map_err(|e| AppError::Internal(format!("Failed to query person candidates: {}", e)))?;

            for row in rows {
                let db_full_name = format!(
                    "{} {}",
                    row.first_name,
                    row.last_name
                );
                let normalized_db_name = normalize_name(&db_full_name);

                let name_res = compare_names(&normalized_input_name, &normalized_db_name);
                let sim = name_res.similarity;
                let details = name_res.explanation;

                if sim >= 0.65 {
                    let mut assessment = if sim >= 0.85 { "STRONG_MATCH" } else { "POSSIBLE_MATCH" };
                    let mut explanation = format!("Name similarity: {:.0}% ({})", sim * 100.0, details);

                    // Check DOB contradiction if extracted DOB exists
                    let db_dob_str = row.date_of_birth.map(|d| d.format("%Y-%m-%d").to_string());
                    if let (Some(ext_dob), Some(ref db_dob)) = (extracted_dob, &db_dob_str) {
                        if ext_dob != db_dob {
                            assessment = "POSSIBLE_MATCH";
                            explanation.push_str(&format!(" [DOB Discrepancy: Doc={}, Record={}]", ext_dob, db_dob));
                        } else {
                            explanation.push_str(" [DOB matches exactly]");
                        }
                    }

                    person_matches.push(MatchedPersonCandidate {
                        person_id: row.id,
                        public_id: row.public_id,
                        full_name: db_full_name,
                        date_of_birth: db_dob_str,
                        similarity_score: sim,
                        assessment: assessment.to_string(),
                        explanation,
                    });
                }
            }

            person_matches.sort_by(|a, b| b.similarity_score.partial_cmp(&a.similarity_score).unwrap_or(std::cmp::Ordering::Equal));
            person_matches.truncate(5);
        }

        // 2. Household Matching
        if let Some(top_person) = person_matches.first() {
            let hh_rows = sqlx::query!(
                r#"
                SELECT h.id, h.public_id, h.name
                FROM households h
                JOIN household_memberships hm ON hm.household_id = h.id
                WHERE hm.person_id = $1 AND hm.valid_to IS NULL
                LIMIT 5
                "#,
                top_person.person_id
            )
            .fetch_all(pool)
            .await
            .unwrap_or_default();

            for hh in hh_rows {
                household_matches.push(MatchedHouseholdCandidate {
                    household_id: hh.id,
                    public_id: hh.public_id,
                    household_name: hh.name,
                    match_level: "LIKELY_HOUSEHOLD_MATCH".to_string(),
                    matched_members: vec![top_person.full_name.clone()],
                    explanation: format!("Matched person '{}' is an active registered member of this household.", top_person.full_name),
                });
            }
        }

        // 3. Property Matching & Previous Benefit Duplicates
        if let Some(prop_id_str) = extracted_property_id {
            let clean_prop_id = prop_id_str.trim().to_uppercase();
            let prop_row = sqlx::query!(
                r#"
                SELECT p.id, p.public_id, p.address_line, p.property_type
                FROM properties p
                WHERE UPPER(p.public_id) = $1 OR UPPER(p.address_line) LIKE $2
                LIMIT 1
                "#,
                clean_prop_id,
                format!("%{}%", clean_prop_id)
            )
            .fetch_optional(pool)
            .await
            .unwrap_or(None);

            if let Some(prop) = prop_row {
                // Check if this property already has previous benefits disbursed/approved!
                let benefit_rows = sqlx::query!(
                    r#"
                    SELECT b.public_id, s.name as scheme_name, b.status, b.disbursed_at
                    FROM benefits b
                    JOIN schemes s ON s.id = b.scheme_id
                    WHERE b.property_id = $1
                    LIMIT 3
                    "#,
                    prop.id
                )
                .fetch_all(pool)
                .await
                .unwrap_or_default();

                let has_previous_benefits = !benefit_rows.is_empty();
                let prev_details = if has_previous_benefits {
                    let list: Vec<String> = benefit_rows
                        .iter()
                        .map(|b| format!("{}: {} ({})", b.public_id, b.scheme_name, b.status))
                        .collect();
                    Some(list.join("; "))
                } else {
                    None
                };

                let explanation = if has_previous_benefits {
                    format!("Property '{}' matches database records and has previous household benefit history (Potential Duplicate Claim Trigger)", prop.public_id)
                } else {
                    format!("Property '{}' matches database records.", prop.public_id)
                };

                property_matches.push(MatchedPropertyCandidate {
                    property_id: prop.id,
                    public_id: prop.public_id,
                    address_line: prop.address_line,
                    property_type: prop.property_type,
                    has_previous_benefits,
                    previous_benefit_details: prev_details,
                    match_level: "EXACT_PROPERTY_MATCH".to_string(),
                    explanation,
                });
            }
        } else if let Some(addr) = extracted_address {
            // Fuzzy match on address line
            let prop_rows = sqlx::query!(
                r#"
                SELECT p.id, p.public_id, p.address_line, p.property_type
                FROM properties p
                LIMIT 20
                "#
            )
            .fetch_all(pool)
            .await
            .unwrap_or_default();

            for prop in prop_rows {
                if addr.to_lowercase().contains(&prop.address_line.to_lowercase())
                    || prop.address_line.to_lowercase().contains(&addr.to_lowercase())
                {
                    property_matches.push(MatchedPropertyCandidate {
                        property_id: prop.id,
                        public_id: prop.public_id,
                        address_line: prop.address_line,
                        property_type: prop.property_type,
                        has_previous_benefits: false,
                        previous_benefit_details: None,
                        match_level: "POSSIBLE_PROPERTY_MATCH".to_string(),
                        explanation: "Address text closely correlates with property database record.".into(),
                    });
                    break;
                }
            }
        }

        Ok(DocumentEntityMatchResult {
            person_matches,
            household_matches,
            property_matches,
        })
    }
}
