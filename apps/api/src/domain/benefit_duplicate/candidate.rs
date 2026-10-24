use chrono::{DateTime, NaiveDate, Utc};
use sqlx::{postgres::PgRow, PgPool, Row};
use uuid::Uuid;

use crate::{
    domain::{benefit_duplicate::scope::BenefitScope, Benefit},
    errors::AppError,
};

/// Candidate query engine for potential duplicate benefits
pub struct DuplicateCandidateFinder;

impl DuplicateCandidateFinder {
    fn map_benefit_row(r: &PgRow) -> Benefit {
        Benefit {
            id: r.get("id"),
            public_id: r.get("public_id"),
            scheme_id: r.get("scheme_id"),
            scheme_name: r.get("scheme_name"),
            scheme_code: r.get("scheme_code"),
            scheme_scope: r.get("scheme_scope"),
            application_id: r.get("application_id"),
            benefit_unit_type: r.get("benefit_unit_type"),
            person_id: r.get("person_id"),
            person_name: r.get("person_name"),
            household_id: r.get("household_id"),
            household_name: r.get("household_name"),
            property_id: r.get("property_id"),
            property_address: r.get("property_address"),
            status: r.get("status"),
            approved_at: r.get("approved_at"),
            disbursed_at: r.get("disbursed_at"),
            valid_from: r.get("valid_from"),
            valid_to: r.get("valid_to"),
            amount: r.get("amount"),
            currency: r.get("currency"),
            quantity: r.get("quantity"),
            unit: r.get("unit"),
            description: r.get("description"),
            source_id: r.get("source_id"),
            created_at: r.get("created_at"),
            updated_at: r.get("updated_at"),
        }
    }

    /// Find existing benefit records that could duplicate an incoming application
    pub async fn find_candidates(
        pool: &PgPool,
        scheme_id: Uuid,
        scope: BenefitScope,
        person_id: Option<Uuid>,
        household_id: Option<Uuid>,
        property_id: Option<Uuid>,
        _application_date: NaiveDate,
    ) -> Result<Vec<Benefit>, AppError> {
        let base_query = r#"
            SELECT b.id, b.public_id, b.scheme_id, s.name as scheme_name, s.code as scheme_code,
                   s.scope as scheme_scope, b.application_id, b.benefit_unit_type,
                   b.person_id, (p.first_name || ' ' || p.last_name) as person_name,
                   b.household_id, h.name as household_name,
                   b.property_id, prop.address_line as property_address,
                   b.status, b.approved_at, b.disbursed_at,
                   lower(b.effective_during) as valid_from, upper(b.effective_during) as valid_to,
                   b.amount::float8 as amount, b.currency, b.quantity, b.unit, b.description,
                   b.source_id, b.created_at, b.updated_at
            FROM benefits b
            JOIN schemes s ON b.scheme_id = s.id
            LEFT JOIN persons p ON b.person_id = p.id
            LEFT JOIN households h ON b.household_id = h.id
            LEFT JOIN properties prop ON b.property_id = prop.id
            WHERE b.scheme_id = $1
              AND b.status IN ('APPROVED', 'DISBURSED', 'ACTIVE')
        "#;

        let mut candidates = Vec::new();

        match scope {
            BenefitScope::Individual => {
                if let Some(pid) = person_id {
                    let q = format!("{} AND b.person_id = $2", base_query);
                    let rows = sqlx::query(&q)
                        .bind(scheme_id)
                        .bind(pid)
                        .fetch_all(pool)
                        .await?;
                    for r in rows {
                        candidates.push(Self::map_benefit_row(&r));
                    }
                }
            }
            BenefitScope::Household => {
                if let Some(hid) = household_id {
                    let q = format!("{} AND b.household_id = $2", base_query);
                    let rows = sqlx::query(&q)
                        .bind(scheme_id)
                        .bind(hid)
                        .fetch_all(pool)
                        .await?;
                    for r in rows {
                        candidates.push(Self::map_benefit_row(&r));
                    }
                }
            }
            BenefitScope::Property => {
                if let Some(prid) = property_id {
                    let q = format!("{} AND b.property_id = $2", base_query);
                    let rows = sqlx::query(&q)
                        .bind(scheme_id)
                        .bind(prid)
                        .fetch_all(pool)
                        .await?;
                    for r in rows {
                        candidates.push(Self::map_benefit_row(&r));
                    }
                }
            }
            BenefitScope::Composite => {
                if let Some(pid) = person_id {
                    let q = format!(
                        "{} AND (b.person_id = $2 OR b.household_id = $3)",
                        base_query
                    );
                    let rows = sqlx::query(&q)
                        .bind(scheme_id)
                        .bind(pid)
                        .bind(household_id)
                        .fetch_all(pool)
                        .await?;
                    for r in rows {
                        candidates.push(Self::map_benefit_row(&r));
                    }
                }
            }
        }

        Ok(candidates)
    }
}
