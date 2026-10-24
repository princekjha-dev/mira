use chrono::Datelike;
use sqlx::{PgPool, Row};
use std::collections::HashSet;
use uuid::Uuid;

use crate::{
    domain::{
        entity_resolution::{models::MatchingModelConfig, normalization::normalize_name},
        Person,
    },
    errors::AppError,
};

/// Candidate Generation using Multi-Block Strategies
/// Avoids N x N comparisons by querying candidates matching deterministic blocking keys.
pub struct BlockingEngine;

impl BlockingEngine {
    /// Generate candidate person IDs for a given source person using multi-block strategy
    pub async fn generate_person_candidates(
        pool: &PgPool,
        source_person: &Person,
        _config: &MatchingModelConfig,
    ) -> Result<Vec<Uuid>, AppError> {
        let mut candidate_ids = HashSet::new();
        let norm_name = normalize_name(&format!(
            "{} {}",
            source_person.first_name, source_person.last_name
        ));
        let name_prefix = if norm_name.len() >= 3 {
            &norm_name[..3]
        } else {
            &norm_name[..]
        };

        // Strategy 1: NAME_PREFIX_DOB_YEAR
        // Candidates with matching 3-letter name prefix and birth year (if DOB is present)
        if let Some(dob) = source_person.date_of_birth {
            let birth_year = dob.year();
            let rows = sqlx::query(
                r#"
                SELECT id FROM persons
                WHERE id != $1
                  AND LOWER(first_name) LIKE $2
                  AND EXTRACT(YEAR FROM date_of_birth) = $3
                LIMIT 50
                "#,
            )
            .bind(source_person.id)
            .bind(format!("{}%", name_prefix))
            .bind(birth_year as f64)
            .fetch_all(pool)
            .await?;

            for row in rows {
                let id: Uuid = row.get("id");
                candidate_ids.insert(id);
            }
        }

        // Strategy 2: NAME_PREFIX_DISTRICT
        // Candidates with matching name prefix associated with the same property locality/district
        let rows = sqlx::query(
            r#"
            SELECT DISTINCT pa2.person_id
            FROM property_associations pa1
            JOIN properties p1 ON pa1.property_id = p1.id
            JOIN properties p2 ON p1.district IS NOT NULL AND p1.district = p2.district
            JOIN property_associations pa2 ON p2.id = pa2.property_id
            JOIN persons p_other ON pa2.person_id = p_other.id
            WHERE pa1.person_id = $1
              AND pa2.person_id != $1
              AND LOWER(p_other.first_name) LIKE $2
            LIMIT 50
            "#,
        )
        .bind(source_person.id)
        .bind(format!("{}%", name_prefix))
        .fetch_all(pool)
        .await
        .unwrap_or_default();

        for row in rows {
            let id: Option<Uuid> = row.get("person_id");
            if let Some(uid) = id {
                candidate_ids.insert(uid);
            }
        }

        // Strategy 3: PHONE_SUFFIX
        // Candidates with matching last 4 digits of phone
        if let Some(phone) = &source_person.phone {
            let digits: String = phone.chars().filter(|c| c.is_ascii_digit()).collect();
            if digits.len() >= 4 {
                let suffix = &digits[digits.len() - 4..];
                let rows = sqlx::query(
                    r#"
                    SELECT id FROM persons
                    WHERE id != $1
                      AND phone LIKE $2
                    LIMIT 30
                    "#,
                )
                .bind(source_person.id)
                .bind(format!("%{}", suffix))
                .fetch_all(pool)
                .await?;

                for row in rows {
                    let id: Uuid = row.get("id");
                    candidate_ids.insert(id);
                }
            }
        }

        // Strategy 4: Fallback / Broad Recall Strategy
        // Candidates sharing the same household membership (co-habitants or related applicants)
        let hh_rows = sqlx::query(
            r#"
            SELECT DISTINCT hm2.person_id
            FROM household_members hm1
            JOIN household_members hm2 ON hm1.household_id = hm2.household_id
            WHERE hm1.person_id = $1 AND hm2.person_id != $1
            LIMIT 30
            "#,
        )
        .bind(source_person.id)
        .fetch_all(pool)
        .await
        .unwrap_or_default();

        for row in hh_rows {
            let id: Uuid = row.get("person_id");
            candidate_ids.insert(id);
        }

        // Strategy 5: Transliteration / Phonetic Name Match fallback
        // If candidate set is small, look for matching first name transliteration
        if candidate_ids.len() < 5 {
            let latin_cand =
                crate::domain::entity_resolution::normalization::transliterate_indic_to_latin(
                    &source_person.first_name,
                );
            let search_term = if !latin_cand.is_empty() {
                latin_cand
            } else {
                source_person.first_name.clone()
            };
            let prefix = if search_term.len() >= 3 {
                &search_term[..3]
            } else {
                &search_term[..]
            };

            let name_rows = sqlx::query(
                r#"
                SELECT id FROM persons
                WHERE id != $1
                  AND (LOWER(first_name) LIKE $2 OR LOWER(last_name) LIKE $3)
                LIMIT 20
                "#,
            )
            .bind(source_person.id)
            .bind(format!("{}%", prefix.to_lowercase()))
            .bind(format!("{}%", source_person.last_name.to_lowercase()))
            .fetch_all(pool)
            .await
            .unwrap_or_default();

            for row in name_rows {
                let id: Uuid = row.get("id");
                candidate_ids.insert(id);
            }
        }

        Ok(candidate_ids.into_iter().collect())
    }

    /// Generate candidate household IDs for household entity resolution
    pub async fn generate_household_candidates(
        pool: &PgPool,
        source_household_id: Uuid,
    ) -> Result<Vec<Uuid>, AppError> {
        let mut candidate_ids = HashSet::new();

        // Households associated with the same property or locality
        let rows = sqlx::query(
            r#"
            SELECT DISTINCT pa2.household_id
            FROM property_associations pa1
            JOIN property_associations pa2 ON pa1.property_id = pa2.property_id
            WHERE pa1.household_id = $1
              AND pa2.household_id IS NOT NULL
              AND pa2.household_id != $1
            LIMIT 30
            "#,
        )
        .bind(source_household_id)
        .fetch_all(pool)
        .await?;

        for row in rows {
            let id: Option<Uuid> = row.get("household_id");
            if let Some(uid) = id {
                candidate_ids.insert(uid);
            }
        }

        // Households sharing members historically
        let member_rows = sqlx::query(
            r#"
            SELECT DISTINCT hm2.household_id
            FROM household_members hm1
            JOIN household_members hm2 ON hm1.person_id = hm2.person_id
            WHERE hm1.household_id = $1
              AND hm2.household_id != $1
            LIMIT 30
            "#,
        )
        .bind(source_household_id)
        .fetch_all(pool)
        .await?;

        for row in member_rows {
            let id: Uuid = row.get("household_id");
            candidate_ids.insert(id);
        }

        Ok(candidate_ids.into_iter().collect())
    }

    /// Generate candidate property IDs for property entity resolution
    pub async fn generate_property_candidates(
        pool: &PgPool,
        source_property_id: Uuid,
    ) -> Result<Vec<Uuid>, AppError> {
        let rows = sqlx::query(
            r#"
            SELECT p2.id
            FROM properties p1
            JOIN properties p2 ON (
                (p1.postal_code IS NOT NULL AND p1.postal_code = p2.postal_code)
                OR (p1.district IS NOT NULL AND p1.district = p2.district AND p1.locality = p2.locality)
            )
            WHERE p1.id = $1 AND p2.id != $1
            LIMIT 30
            "#,
        )
        .bind(source_property_id)
        .fetch_all(pool)
        .await?;

        let mut candidate_ids = Vec::new();
        for row in rows {
            let id: Uuid = row.get("id");
            candidate_ids.push(id);
        }

        Ok(candidate_ids)
    }
}
