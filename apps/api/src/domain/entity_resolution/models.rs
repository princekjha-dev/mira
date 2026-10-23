use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum OverallAssessment {
    #[serde(rename = "STRONG_MATCH")]
    StrongMatch,
    #[serde(rename = "POSSIBLE_MATCH")]
    PossibleMatch,
    #[serde(rename = "WEAK_MATCH")]
    WeakMatch,
    #[serde(rename = "LIKELY_NON_MATCH")]
    LikelyNonMatch,
    #[serde(rename = "UNCERTAIN")]
    Uncertain,
}

impl OverallAssessment {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::StrongMatch => "STRONG_MATCH",
            Self::PossibleMatch => "POSSIBLE_MATCH",
            Self::WeakMatch => "WEAK_MATCH",
            Self::LikelyNonMatch => "LIKELY_NON_MATCH",
            Self::Uncertain => "UNCERTAIN",
        }
    }

    pub fn from_str(s: &str) -> Self {
        match s {
            "STRONG_MATCH" => Self::StrongMatch,
            "POSSIBLE_MATCH" => Self::PossibleMatch,
            "WEAK_MATCH" => Self::WeakMatch,
            "LIKELY_NON_MATCH" => Self::LikelyNonMatch,
            _ => Self::Uncertain,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum EvidenceDirection {
    #[serde(rename = "SUPPORTS_MATCH")]
    SupportsMatch,
    #[serde(rename = "CONTRADICTS_MATCH")]
    ContradictsMatch,
    #[serde(rename = "NEUTRAL")]
    Neutral,
}

impl EvidenceDirection {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::SupportsMatch => "SUPPORTS_MATCH",
            Self::ContradictsMatch => "CONTRADICTS_MATCH",
            Self::Neutral => "NEUTRAL",
        }
    }

    pub fn from_str(s: &str) -> Self {
        match s {
            "SUPPORTS_MATCH" => Self::SupportsMatch,
            "CONTRADICTS_MATCH" => Self::ContradictsMatch,
            _ => Self::Neutral,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum DuplicateCategory {
    #[serde(rename = "EXACT_DUPLICATE")]
    ExactDuplicate,
    #[serde(rename = "LIKELY_DUPLICATE")]
    LikelyDuplicate,
    #[serde(rename = "POTENTIAL_DUPLICATE")]
    PotentialDuplicate,
    #[serde(rename = "NOT_DUPLICATE")]
    NotDuplicate,
    #[serde(rename = "INSUFFICIENT_INFORMATION")]
    InsufficientInformation,
}

impl DuplicateCategory {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::ExactDuplicate => "EXACT_DUPLICATE",
            Self::LikelyDuplicate => "LIKELY_DUPLICATE",
            Self::PotentialDuplicate => "POTENTIAL_DUPLICATE",
            Self::NotDuplicate => "NOT_DUPLICATE",
            Self::InsufficientInformation => "INSUFFICIENT_INFORMATION",
        }
    }

    pub fn from_str(s: &str) -> Self {
        match s {
            "EXACT_DUPLICATE" => Self::ExactDuplicate,
            "LIKELY_DUPLICATE" => Self::LikelyDuplicate,
            "POTENTIAL_DUPLICATE" => Self::PotentialDuplicate,
            "NOT_DUPLICATE" => Self::NotDuplicate,
            _ => Self::InsufficientInformation,
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MatchingModelConfig {
    pub version: String,
    pub name: String,
    pub strong_match_threshold: f64,
    pub possible_match_threshold: f64,
    pub non_match_threshold: f64,
    pub duplicate_high_threshold: f64,
    pub duplicate_review_threshold: f64,
    pub field_weights: serde_json::Value,
    pub blocking_strategies: Vec<String>,
    pub normalization_version: String,
}

impl Default for MatchingModelConfig {
    fn default() -> Self {
        Self {
            version: "v4.0.0".to_string(),
            name: "Default Deterministic Civic Matching Configuration".to_string(),
            strong_match_threshold: 0.82,
            possible_match_threshold: 0.58,
            non_match_threshold: 0.35,
            duplicate_high_threshold: 0.78,
            duplicate_review_threshold: 0.48,
            field_weights: serde_json::json!({
                "name": 0.30,
                "date_of_birth": 0.25,
                "parent_name": 0.15,
                "address": 0.10,
                "household": 0.10,
                "phone": 0.05,
                "gender": 0.05
            }),
            blocking_strategies: vec![
                "NAME_PREFIX_DOB_YEAR".to_string(),
                "NAME_PREFIX_DISTRICT".to_string(),
                "PHONE_SUFFIX".to_string(),
            ],
            normalization_version: "v4.0.0-unicode-translit".to_string(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EntityResolutionCase {
    pub id: Uuid,
    pub public_id: String,
    pub entity_type: String,
    pub source_entity_id: Uuid,
    pub source_entity_label: Option<String>,
    pub status: String,
    pub priority: String,
    pub matching_model_version: String,
    pub summary: Option<String>,
    pub resolved_at: Option<DateTime<Utc>>,
    pub resolved_by: Option<Uuid>,
    pub resolution: Option<String>,
    pub candidates: Vec<EntityResolutionCandidate>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EntityResolutionCandidate {
    pub id: Uuid,
    pub case_id: Uuid,
    pub candidate_entity_id: Uuid,
    pub candidate_entity_label: Option<String>,
    pub candidate_rank: i32,
    pub overall_assessment: String,
    pub confidence_score: f64,
    pub support_score: f64,
    pub contradiction_penalty: f64,
    pub hard_contradiction_detected: bool,
    pub summary: String,
    pub why_flagged: Option<String>,
    pub why_not_confident: Option<String>,
    pub evidence: Vec<EntityResolutionEvidence>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EntityResolutionEvidence {
    pub id: Uuid,
    pub candidate_id: Uuid,
    pub field: String,
    pub source_value: Option<String>,
    pub candidate_value: Option<String>,
    pub comparison_method: String,
    pub comparison_result: String,
    pub similarity: f64,
    pub weight: f64,
    pub direction: String,
    pub explanation: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BenefitDuplicateCase {
    pub id: Uuid,
    pub public_id: String,
    pub application_id: Uuid,
    pub application_number: Option<String>,
    pub scheme_id: Uuid,
    pub scheme_name: Option<String>,
    pub benefit_scope: String,
    pub benefit_unit_type: String,
    pub person_id: Option<Uuid>,
    pub person_name: Option<String>,
    pub household_id: Option<Uuid>,
    pub household_public_id: Option<String>,
    pub property_id: Option<Uuid>,
    pub property_address: Option<String>,
    pub status: String,
    pub priority: String,
    pub assessment: String,
    pub rules_version: String,
    pub reason: String,
    pub recommended_action: String,
    pub final_decision: Option<String>,
    pub candidates: Vec<BenefitDuplicateCandidate>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BenefitDuplicateCandidate {
    pub id: Uuid,
    pub case_id: Uuid,
    pub existing_benefit_id: Uuid,
    pub existing_benefit_public_id: Option<String>,
    pub existing_benefit_amount: Option<f64>,
    pub existing_benefit_asset: Option<String>,
    pub candidate_rank: i32,
    pub duplicate_category: String,
    pub overlap_score: f64,
    pub explanation: String,
    pub evidence: Vec<BenefitDuplicateEvidence>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BenefitDuplicateEvidence {
    pub id: Uuid,
    pub candidate_id: Uuid,
    pub field: String,
    pub source_value: Option<String>,
    pub existing_value: Option<String>,
    pub result: String,
    pub weight: f64,
    pub explanation: String,
    pub created_at: DateTime<Utc>,
}
