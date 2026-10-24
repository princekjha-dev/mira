use chrono::{DateTime, NaiveDate, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// System Role Enum establishing foundational permissions
#[derive(Debug, Clone, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum RoleType {
    Citizen,
    FieldOfficial,
    VerificationOfficer,
    SchemeOfficer,
    Supervisor,
    DepartmentAdmin,
    Auditor,
    SuperAdmin,
}

impl RoleType {
    pub fn as_str(&self) -> &'static str {
        match self {
            RoleType::Citizen => "CITIZEN",
            RoleType::FieldOfficial => "FIELD_OFFICIAL",
            RoleType::VerificationOfficer => "VERIFICATION_OFFICER",
            RoleType::SchemeOfficer => "SCHEME_OFFICER",
            RoleType::Supervisor => "SUPERVISOR",
            RoleType::DepartmentAdmin => "DEPARTMENT_ADMIN",
            RoleType::Auditor => "AUDITOR",
            RoleType::SuperAdmin => "SUPER_ADMIN",
        }
    }

    pub fn from_str_opt(s: &str) -> Option<Self> {
        match s.trim().to_uppercase().as_str() {
            "CITIZEN" => Some(RoleType::Citizen),
            "FIELD_OFFICIAL" => Some(RoleType::FieldOfficial),
            "VERIFICATION_OFFICER" => Some(RoleType::VerificationOfficer),
            "SCHEME_OFFICER" => Some(RoleType::SchemeOfficer),
            "SUPERVISOR" => Some(RoleType::Supervisor),
            "DEPARTMENT_ADMIN" => Some(RoleType::DepartmentAdmin),
            "AUDITOR" => Some(RoleType::Auditor),
            "SUPER_ADMIN" => Some(RoleType::SuperAdmin),
            _ => None,
        }
    }

    pub fn can_view_all_profiles(&self) -> bool {
        matches!(
            self,
            RoleType::DepartmentAdmin
                | RoleType::Auditor
                | RoleType::SuperAdmin
                | RoleType::VerificationOfficer
                | RoleType::SchemeOfficer
                | RoleType::Supervisor
        )
    }

    pub fn can_view_audit_logs(&self) -> bool {
        matches!(
            self,
            RoleType::Auditor
                | RoleType::DepartmentAdmin
                | RoleType::SuperAdmin
                | RoleType::Supervisor
        )
    }

    pub fn can_mutate_domain(&self) -> bool {
        !matches!(self, RoleType::Auditor)
    }
}

/// Core User entity
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: Uuid,
    pub email: String,
    #[serde(skip_serializing)]
    pub password_hash: String,
    pub display_name: String,
    pub preferred_language: String,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

/// Organization entity representing civic authority or tenant boundary
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Organization {
    pub id: Uuid,
    pub name: String,
    pub code: String,
    pub description: Option<String>,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OrganizationSummary {
    pub id: Uuid,
    pub name: String,
    pub code: String,
}

/// User Profile view returned to authenticated clients
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserProfile {
    pub id: Uuid,
    pub email: String,
    pub display_name: String,
    pub preferred_language: String,
    pub roles: Vec<String>,
    pub is_demo: bool,
    pub organization: Option<OrganizationSummary>,
    pub created_at: DateTime<Utc>,
}

/// Session entity
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Session {
    pub id: Uuid,
    pub user_id: Uuid,
    pub token_hash: String,
    pub ip_address: Option<String>,
    pub user_agent: Option<String>,
    pub expires_at: DateTime<Utc>,
    pub revoked_at: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
}

/// Audit Event entity for security and operational traceability
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuditEvent {
    pub id: Uuid,
    pub event_type: String,
    pub user_id: Option<Uuid>,
    pub organization_id: Option<Uuid>,
    pub request_id: String,
    pub ip_address: Option<String>,
    pub details: serde_json::Value,
    pub previous_hash: Option<String>,
    pub current_hash: Option<String>,
    pub created_at: DateTime<Utc>,
}

/// System Health & Status representation
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemStatus {
    pub status: String,
    pub api_version: String,
    pub database_connected: bool,
    pub auth_system: String,
    pub environment: String,
    pub timestamp: DateTime<Utc>,
}

// ============================================================================
// V2 DOMAIN MODELS: Person, Household, Temporal Membership, Relationship, Property
// ============================================================================

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum PersonStatus {
    Active,
    Deceased,
    Unknown,
}

impl PersonStatus {
    pub fn as_str(&self) -> &'static str {
        match self {
            PersonStatus::Active => "ACTIVE",
            PersonStatus::Deceased => "DECEASED",
            PersonStatus::Unknown => "UNKNOWN",
        }
    }

    pub fn from_str(s: &str) -> Self {
        match s.trim().to_uppercase().as_str() {
            "DECEASED" => PersonStatus::Deceased,
            "UNKNOWN" => PersonStatus::Unknown,
            _ => PersonStatus::Active,
        }
    }
}

/// Person entity
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Person {
    pub id: Uuid,
    pub public_id: String,
    pub first_name: String,
    pub middle_name: Option<String>,
    pub last_name: String,
    pub date_of_birth: Option<NaiveDate>,
    pub gender: Option<String>,
    pub phone: Option<String>,
    pub email: Option<String>,
    pub status: String,
    pub created_by: Option<Uuid>,
    pub updated_by: Option<Uuid>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

/// Generic Person Identifier (synthetic references)
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PersonIdentifier {
    pub id: Uuid,
    pub person_id: Uuid,
    pub identifier_type: String,
    pub identifier_reference: String,
    pub source_id: Option<Uuid>,
    pub verified: bool,
    pub created_at: DateTime<Utc>,
}

/// Household entity
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Household {
    pub id: Uuid,
    pub public_id: String,
    pub name: String,
    pub status: String,
    pub created_by: Option<Uuid>,
    pub updated_by: Option<Uuid>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

/// Household Membership entity with temporal validity
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HouseholdMembership {
    pub id: Uuid,
    pub household_id: Uuid,
    pub person_id: Uuid,
    pub membership_role: String,
    pub valid_from: NaiveDate,
    pub valid_to: Option<NaiveDate>,
    pub source_id: Option<Uuid>,
    pub verification_status: String,
    pub confidence: f64,
    pub recorded_at: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HouseholdMemberDetail {
    pub membership_id: Uuid,
    pub household_id: Uuid,
    pub person_id: Uuid,
    pub public_id: String,
    pub full_name: String,
    pub membership_role: String,
    pub valid_from: NaiveDate,
    pub valid_to: Option<NaiveDate>,
    pub verification_status: String,
    pub confidence: f64,
    pub is_current: bool,
}

/// Relationship Type enum with inverse mapping
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum RelationshipType {
    Parent,
    Child,
    Spouse,
    Sibling,
    Guardian,
    Dependent,
}

impl RelationshipType {
    pub fn as_str(&self) -> &'static str {
        match self {
            RelationshipType::Parent => "PARENT",
            RelationshipType::Child => "CHILD",
            RelationshipType::Spouse => "SPOUSE",
            RelationshipType::Sibling => "SIBLING",
            RelationshipType::Guardian => "GUARDIAN",
            RelationshipType::Dependent => "DEPENDENT",
        }
    }

    pub fn from_str(s: &str) -> Option<Self> {
        match s.trim().to_uppercase().as_str() {
            "PARENT" => Some(RelationshipType::Parent),
            "CHILD" => Some(RelationshipType::Child),
            "SPOUSE" => Some(RelationshipType::Spouse),
            "SIBLING" => Some(RelationshipType::Sibling),
            "GUARDIAN" => Some(RelationshipType::Guardian),
            "DEPENDENT" => Some(RelationshipType::Dependent),
            _ => None,
        }
    }

    pub fn inverse(&self) -> Self {
        match self {
            RelationshipType::Parent => RelationshipType::Child,
            RelationshipType::Child => RelationshipType::Parent,
            RelationshipType::Spouse => RelationshipType::Spouse,
            RelationshipType::Sibling => RelationshipType::Sibling,
            RelationshipType::Guardian => RelationshipType::Dependent,
            RelationshipType::Dependent => RelationshipType::Guardian,
        }
    }
}

/// Family Relationship entity
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PersonRelationship {
    pub id: Uuid,
    pub person_a_id: Uuid,
    pub person_b_id: Uuid,
    pub relationship_type: String,
    pub valid_from: NaiveDate,
    pub valid_to: Option<NaiveDate>,
    pub source_id: Option<Uuid>,
    pub verification_status: String,
    pub confidence: f64,
    pub recorded_at: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RelationshipDetail {
    pub id: Uuid,
    pub related_person_id: Uuid,
    pub related_person_public_id: String,
    pub related_person_name: String,
    pub relationship_type: String,
    pub is_inverse: bool,
    pub valid_from: NaiveDate,
    pub valid_to: Option<NaiveDate>,
    pub verification_status: String,
    pub confidence: f64,
    pub source_name: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FamilyMemberDto {
    pub id: String,
    pub person_id: Uuid,
    pub public_id: String,
    pub name: String,
    pub relationship: String,
    pub membership_role: String,
    pub dob: String,
    pub gender: String,
    pub identity: String,
    pub membership: String,
    pub income: Option<String>,
    pub benefits: Vec<String>,
    pub is_current: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FamilyRelationshipDto {
    pub id: Uuid,
    pub person_a_id: Uuid,
    pub person_b_id: Uuid,
    pub person_a_name: String,
    pub person_b_name: String,
    pub relationship_type: String,
    pub valid_from: String,
    pub verification_status: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FamilyTimelineItemDto {
    pub date: String,
    pub event_type: String,
    pub title: String,
    pub description: String,
    pub source: String,
    pub evidence: Option<String>,
    pub verification_status: String,
    pub verified_by: Option<String>,
    pub timestamp: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FamilyRequestDto {
    pub id: String,
    pub request_type: String,
    pub details: String,
    pub date: String,
    pub status: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MyFamilyResponse {
    pub household_id: Uuid,
    pub household_public_id: String,
    pub household_name: String,
    pub status: String,
    pub address: String,
    pub property_summary: String,
    pub bpl_status: String,
    pub income_category: String,
    pub verification_status: String,
    pub is_demo_data: bool,
    pub disclaimer: String,
    pub members: Vec<FamilyMemberDto>,
    pub relationships: Vec<FamilyRelationshipDto>,
    pub timeline: Vec<FamilyTimelineItemDto>,
    pub requests: Vec<FamilyRequestDto>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AddFamilyMemberRequest {
    pub first_name: String,
    pub last_name: String,
    pub relationship: String,
    pub date_of_birth: String,
    pub gender: String,
    pub income: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ReportLifeEventRequest {
    pub event_type: String,
    pub effective_date: String,
    pub person_name: Option<String>,
    pub details: String,
    pub certificate_no: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RaiseDisputeRequest {
    pub application_id: Option<String>,
    pub category: String,
    pub description: String,
    pub document_reference: Option<String>,
}

/// Property entity
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Property {
    pub id: Uuid,
    pub public_id: String,
    pub property_type: String,
    pub address_line: String,
    pub locality: Option<String>,
    pub district: Option<String>,
    pub state: Option<String>,
    pub postal_code: Option<String>,
    pub latitude: Option<f64>,
    pub longitude: Option<f64>,
    pub status: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

/// Property Association entity
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PropertyAssociation {
    pub id: Uuid,
    pub property_id: Uuid,
    pub person_id: Option<Uuid>,
    pub household_id: Option<Uuid>,
    pub association_type: String,
    pub valid_from: NaiveDate,
    pub valid_to: Option<NaiveDate>,
    pub source_id: Option<Uuid>,
    pub verification_status: String,
    pub confidence: f64,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PropertyAssociationDetail {
    pub id: Uuid,
    pub property_id: Uuid,
    pub property_public_id: String,
    pub property_type: String,
    pub address_line: String,
    pub association_type: String,
    pub person_id: Option<Uuid>,
    pub household_id: Option<Uuid>,
    pub valid_from: NaiveDate,
    pub valid_to: Option<NaiveDate>,
    pub verification_status: String,
}

/// Provenance Source Record
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SourceRecord {
    pub id: Uuid,
    pub source_type: String,
    pub source_reference: String,
    pub source_name: String,
    pub reliability: String,
    pub metadata: serde_json::Value,
    pub recorded_at: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
}

/// Life Event entity
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LifeEvent {
    pub id: Uuid,
    pub event_type: String,
    pub person_id: Option<Uuid>,
    pub household_id: Option<Uuid>,
    pub effective_date: NaiveDate,
    pub recorded_at: DateTime<Utc>,
    pub source_id: Option<Uuid>,
    pub metadata: serde_json::Value,
    pub created_by: Option<Uuid>,
    pub created_at: DateTime<Utc>,
}

// ============================================================================
// Graph Data Types for Frontend Graph Visualization
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GraphNode {
    pub id: String,
    #[serde(rename = "type")]
    pub node_type: String, // "person", "household", "property"
    pub label: String,
    pub sublabel: Option<String>,
    pub data: serde_json::Value,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GraphEdge {
    pub id: String,
    pub source: String,
    pub target: String,
    #[serde(rename = "type")]
    pub edge_type: String, // "MEMBER_OF", "RELATED_TO", "OCCUPIES", "OWNS"
    pub label: String,
    pub verification_status: String,
    pub confidence: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GraphData {
    pub query_date: NaiveDate,
    pub nodes: Vec<GraphNode>,
    pub edges: Vec<GraphEdge>,
}

// ============================================================================
// V3 DOMAIN TYPES: SCHEME, RULES, APPLICATIONS, BENEFITS & ELIGIBILITY
// ============================================================================

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum SchemeScope {
    Individual,
    Household,
    Property,
    Composite,
}

impl SchemeScope {
    pub fn as_str(&self) -> &'static str {
        match self {
            SchemeScope::Individual => "INDIVIDUAL",
            SchemeScope::Household => "HOUSEHOLD",
            SchemeScope::Property => "PROPERTY",
            SchemeScope::Composite => "COMPOSITE",
        }
    }

    pub fn from_str(s: &str) -> Self {
        match s.trim().to_uppercase().as_str() {
            "INDIVIDUAL" => SchemeScope::Individual,
            "HOUSEHOLD" => SchemeScope::Household,
            "PROPERTY" => SchemeScope::Property,
            _ => SchemeScope::Composite,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum SchemeStatus {
    Draft,
    Active,
    Suspended,
    Retired,
}

impl SchemeStatus {
    pub fn as_str(&self) -> &'static str {
        match self {
            SchemeStatus::Draft => "DRAFT",
            SchemeStatus::Active => "ACTIVE",
            SchemeStatus::Suspended => "SUSPENDED",
            SchemeStatus::Retired => "RETIRED",
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum ApplicationStatus {
    Draft,
    Submitted,
    UnderVerification,
    Approved,
    Rejected,
    Withdrawn,
    Disbursed,
}

impl ApplicationStatus {
    pub fn as_str(&self) -> &'static str {
        match self {
            ApplicationStatus::Draft => "DRAFT",
            ApplicationStatus::Submitted => "SUBMITTED",
            ApplicationStatus::UnderVerification => "UNDER_VERIFICATION",
            ApplicationStatus::Approved => "APPROVED",
            ApplicationStatus::Rejected => "REJECTED",
            ApplicationStatus::Withdrawn => "WITHDRAWN",
            ApplicationStatus::Disbursed => "DISBURSED",
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum BenefitUnitType {
    Person,
    Household,
    Property,
}

impl BenefitUnitType {
    pub fn as_str(&self) -> &'static str {
        match self {
            BenefitUnitType::Person => "PERSON",
            BenefitUnitType::Household => "HOUSEHOLD",
            BenefitUnitType::Property => "PROPERTY",
        }
    }

    pub fn from_str(s: &str) -> Self {
        match s.trim().to_uppercase().as_str() {
            "PERSON" | "INDIVIDUAL" => BenefitUnitType::Person,
            "HOUSEHOLD" => BenefitUnitType::Household,
            _ => BenefitUnitType::Property,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum AssessmentResult {
    Eligible,
    Ineligible,
    Indeterminate,
    RequiresReview,
}

impl AssessmentResult {
    pub fn as_str(&self) -> &'static str {
        match self {
            AssessmentResult::Eligible => "ELIGIBLE",
            AssessmentResult::Ineligible => "INELIGIBLE",
            AssessmentResult::Indeterminate => "INDETERMINATE",
            AssessmentResult::RequiresReview => "REQUIRES_REVIEW",
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum RuleResultStatus {
    Pass,
    Fail,
    Indeterminate,
    RequiresReview,
}

impl RuleResultStatus {
    pub fn as_str(&self) -> &'static str {
        match self {
            RuleResultStatus::Pass => "PASS",
            RuleResultStatus::Fail => "FAIL",
            RuleResultStatus::Indeterminate => "INDETERMINATE",
            RuleResultStatus::RequiresReview => "REQUIRES_REVIEW",
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Scheme {
    pub id: Uuid,
    pub public_id: String,
    pub code: String,
    pub name: String,
    pub description: Option<String>,
    pub department: String,
    pub status: String,
    pub scope: String,
    pub valid_from: NaiveDate,
    pub valid_to: Option<NaiveDate>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SchemeRule {
    pub id: Uuid,
    pub scheme_id: Uuid,
    pub rule_type: String,
    pub operator: String,
    pub value: String,
    pub priority: i32,
    pub active: bool,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Application {
    pub id: Uuid,
    pub public_id: String,
    pub application_number: String,
    pub scheme_id: Uuid,
    pub scheme_name: Option<String>,
    pub scheme_code: Option<String>,
    pub scheme_scope: Option<String>,
    pub applicant_person_id: Uuid,
    pub applicant_name: Option<String>,
    pub target_person_id: Option<Uuid>,
    pub target_household_id: Option<Uuid>,
    pub target_household_name: Option<String>,
    pub target_property_id: Option<Uuid>,
    pub submitted_at: Option<DateTime<Utc>>,
    pub status: String,
    pub current_stage: String,
    pub application_date: NaiveDate,
    pub metadata: serde_json::Value,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EligibilityRuleResult {
    pub id: Uuid,
    pub assessment_id: Uuid,
    pub rule_id: Option<Uuid>,
    pub rule_type: String,
    pub result: String,
    pub actual_value: Option<String>,
    pub expected_value: String,
    pub explanation: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EligibilityAssessment {
    pub id: Uuid,
    pub application_id: Uuid,
    pub result: String,
    pub evaluated_at: DateTime<Utc>,
    pub engine_version: String,
    pub summary: String,
    pub rule_results: Vec<EligibilityRuleResult>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Benefit {
    pub id: Uuid,
    pub public_id: String,
    pub scheme_id: Uuid,
    pub scheme_name: Option<String>,
    pub scheme_code: Option<String>,
    pub scheme_scope: Option<String>,
    pub application_id: Option<Uuid>,
    pub benefit_unit_type: String,
    pub person_id: Option<Uuid>,
    pub person_name: Option<String>,
    pub household_id: Option<Uuid>,
    pub household_name: Option<String>,
    pub property_id: Option<Uuid>,
    pub property_address: Option<String>,
    pub status: String,
    pub approved_at: DateTime<Utc>,
    pub disbursed_at: Option<DateTime<Utc>>,
    pub valid_from: NaiveDate,
    pub valid_to: Option<NaiveDate>,
    pub amount: Option<f64>,
    pub currency: Option<String>,
    pub quantity: Option<i32>,
    pub unit: Option<String>,
    pub description: Option<String>,
    pub source_id: Option<Uuid>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BenefitEvent {
    pub id: Uuid,
    pub benefit_id: Uuid,
    pub event_type: String,
    pub effective_at: DateTime<Utc>,
    pub recorded_at: DateTime<Utc>,
    pub source_id: Option<Uuid>,
    pub metadata: serde_json::Value,
    pub created_by: Option<Uuid>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BenefitAsset {
    pub id: Uuid,
    pub benefit_id: Uuid,
    pub property_id: Uuid,
    pub asset_role: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DashboardStats {
    pub total_applications: i64,
    pub pending_verification: i64,
    pub approved_applications: i64,
    pub disbursed_applications: i64,
    pub total_benefits: i64,
    pub individual_benefits: i64,
    pub household_benefits: i64,
    pub property_benefits: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Notification {
    pub id: Uuid,
    pub user_id: Uuid,
    pub r#type: String,
    pub title: String,
    pub message: String,
    pub entity_type: Option<String>,
    pub entity_id: Option<String>,
    pub read: bool,
    pub created_at: DateTime<Utc>,
}

pub mod benefit_duplicate;
pub mod document;
pub mod entity_resolution;
