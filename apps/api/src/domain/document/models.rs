use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum DocumentStatus {
    Uploaded,
    Processing,
    Ready,
    Failed,
    Quarantined,
    Revoked,
}

impl DocumentStatus {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Uploaded => "UPLOADED",
            Self::Processing => "PROCESSING",
            Self::Ready => "READY",
            Self::Failed => "FAILED",
            Self::Quarantined => "QUARANTINED",
            Self::Revoked => "REVOKED",
        }
    }

    pub fn from_str(s: &str) -> Self {
        match s {
            "UPLOADED" => Self::Uploaded,
            "PROCESSING" => Self::Processing,
            "READY" => Self::Ready,
            "FAILED" => Self::Failed,
            "QUARANTINED" => Self::Quarantined,
            "REVOKED" => Self::Revoked,
            _ => Self::Uploaded,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum DocumentType {
    BirthCertificate,
    IncomeCertificate,
    ResidenceCertificate,
    PropertyDocument,
    BenefitDocument,
    IdentitySupportingDocument,
    HouseholdDocument,
    Other,
}

impl DocumentType {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::BirthCertificate => "BIRTH_CERTIFICATE",
            Self::IncomeCertificate => "INCOME_CERTIFICATE",
            Self::ResidenceCertificate => "RESIDENCE_CERTIFICATE",
            Self::PropertyDocument => "PROPERTY_DOCUMENT",
            Self::BenefitDocument => "BENEFIT_DOCUMENT",
            Self::IdentitySupportingDocument => "IDENTITY_SUPPORTING_DOCUMENT",
            Self::HouseholdDocument => "HOUSEHOLD_DOCUMENT",
            Self::Other => "OTHER",
        }
    }

    pub fn from_str(s: &str) -> Self {
        match s {
            "BIRTH_CERTIFICATE" => Self::BirthCertificate,
            "INCOME_CERTIFICATE" => Self::IncomeCertificate,
            "RESIDENCE_CERTIFICATE" => Self::ResidenceCertificate,
            "PROPERTY_DOCUMENT" => Self::PropertyDocument,
            "BENEFIT_DOCUMENT" => Self::BenefitDocument,
            "IDENTITY_SUPPORTING_DOCUMENT" => Self::IdentitySupportingDocument,
            "HOUSEHOLD_DOCUMENT" => Self::HouseholdDocument,
            _ => Self::Other,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum VersionType {
    Original,
    Optimized,
    Preview,
    OcrDerivative,
}

impl VersionType {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Original => "ORIGINAL",
            Self::Optimized => "OPTIMIZED",
            Self::Preview => "PREVIEW",
            Self::OcrDerivative => "OCR_DERIVATIVE",
        }
    }

    pub fn from_str(s: &str) -> Self {
        match s {
            "ORIGINAL" => Self::Original,
            "OPTIMIZED" => Self::Optimized,
            "PREVIEW" => Self::Preview,
            "OCR_DERIVATIVE" => Self::OcrDerivative,
            _ => Self::Original,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum AccessAction {
    View,
    Download,
    Preview,
    Process,
    Share,
    Revoke,
}

impl AccessAction {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::View => "VIEW",
            Self::Download => "DOWNLOAD",
            Self::Preview => "PREVIEW",
            Self::Process => "PROCESS",
            Self::Share => "SHARE",
            Self::Revoke => "REVOKE",
        }
    }

    pub fn from_str(s: &str) -> Self {
        match s {
            "VIEW" => Self::View,
            "DOWNLOAD" => Self::Download,
            "PREVIEW" => Self::Preview,
            "PROCESS" => Self::Process,
            "SHARE" => Self::Share,
            "REVOKE" => Self::Revoke,
            _ => Self::View,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum AccessPurpose {
    ApplicationVerification,
    DuplicateReview,
    EligibilityReview,
    Audit,
    CitizenSelfService,
}

impl AccessPurpose {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::ApplicationVerification => "APPLICATION_VERIFICATION",
            Self::DuplicateReview => "DUPLICATE_REVIEW",
            Self::EligibilityReview => "ELIGIBILITY_REVIEW",
            Self::Audit => "AUDIT",
            Self::CitizenSelfService => "CITIZEN_SELF_SERVICE",
        }
    }

    pub fn from_str(s: &str) -> Self {
        match s {
            "APPLICATION_VERIFICATION" => Self::ApplicationVerification,
            "DUPLICATE_REVIEW" => Self::DuplicateReview,
            "ELIGIBILITY_REVIEW" => Self::EligibilityReview,
            "AUDIT" => Self::Audit,
            "CITIZEN_SELF_SERVICE" => Self::CitizenSelfService,
            _ => Self::CitizenSelfService,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum JobType {
    Scan,
    Ocr,
    Extraction,
    Classification,
    Optimization,
}

impl JobType {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Scan => "SCAN",
            Self::Ocr => "OCR",
            Self::Extraction => "EXTRACTION",
            Self::Classification => "CLASSIFICATION",
            Self::Optimization => "OPTIMIZATION",
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum JobStatus {
    Queued,
    Processing,
    Completed,
    Failed,
    RequiresReview,
}

impl JobStatus {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Queued => "QUEUED",
            Self::Processing => "PROCESSING",
            Self::Completed => "COMPLETED",
            Self::Failed => "FAILED",
            Self::RequiresReview => "REQUIRES_REVIEW",
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum ExtractionStatus {
    Unverified,
    SystemExtracted,
    OfficerVerified,
    SourceVerified,
    Conflicting,
    Rejected,
}

impl ExtractionStatus {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Unverified => "UNVERIFIED",
            Self::SystemExtracted => "SYSTEM_EXTRACTED",
            Self::OfficerVerified => "OFFICER_VERIFIED",
            Self::SourceVerified => "SOURCE_VERIFIED",
            Self::Conflicting => "CONFLICTING",
            Self::Rejected => "REJECTED",
        }
    }

    pub fn from_str(s: &str) -> Self {
        match s {
            "UNVERIFIED" => Self::Unverified,
            "SYSTEM_EXTRACTED" => Self::SystemExtracted,
            "OFFICER_VERIFIED" => Self::OfficerVerified,
            "SOURCE_VERIFIED" => Self::SourceVerified,
            "CONFLICTING" => Self::Conflicting,
            "REJECTED" => Self::Rejected,
            _ => Self::Unverified,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum VerificationDecision {
    Verified,
    Rejected,
    Edited,
    SourceVerified,
}

impl VerificationDecision {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Verified => "VERIFIED",
            Self::Rejected => "REJECTED",
            Self::Edited => "EDITED",
            Self::SourceVerified => "SOURCE_VERIFIED",
        }
    }

    pub fn from_str(s: &str) -> Self {
        match s {
            "VERIFIED" => Self::Verified,
            "REJECTED" => Self::Rejected,
            "EDITED" => Self::Edited,
            "SOURCE_VERIFIED" => Self::SourceVerified,
            _ => Self::Verified,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum ConsistencyCheckType {
    DobConflict,
    NameVariation,
    AddressConflict,
    ParentConflict,
    PropertyConflict,
    SchemeConflict,
    DateConflict,
    TemporalInconsistency,
}

impl ConsistencyCheckType {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::DobConflict => "DOB_CONFLICT",
            Self::NameVariation => "NAME_VARIATION",
            Self::AddressConflict => "ADDRESS_CONFLICT",
            Self::ParentConflict => "PARENT_CONFLICT",
            Self::PropertyConflict => "PROPERTY_CONFLICT",
            Self::SchemeConflict => "SCHEME_CONFLICT",
            Self::DateConflict => "DATE_CONFLICT",
            Self::TemporalInconsistency => "TEMPORAL_INCONSISTENCY",
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum ConsistencyResult {
    Pass,
    Conflict,
    InsufficientData,
    NotApplicable,
}

impl ConsistencyResult {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Pass => "PASS",
            Self::Conflict => "CONFLICT",
            Self::InsufficientData => "INSUFFICIENT_DATA",
            Self::NotApplicable => "NOT_APPLICABLE",
        }
    }

    pub fn from_str(s: &str) -> Self {
        match s {
            "PASS" => Self::Pass,
            "CONFLICT" => Self::Conflict,
            "INSUFFICIENT_DATA" => Self::InsufficientData,
            "NOT_APPLICABLE" => Self::NotApplicable,
            _ => Self::InsufficientData,
        }
    }
}

// -----------------------------------------------------------------------------
// Database Entities
// -----------------------------------------------------------------------------

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct Document {
    pub id: Uuid,
    pub public_id: String,
    pub owner_type: String,
    pub owner_id: Uuid,
    pub document_type: String,
    pub original_filename: String,
    pub detected_mime_type: String,
    pub size_bytes: i64,
    pub sha256: String,
    pub storage_reference: String,
    pub status: String,
    pub retention_policy: String,
    pub retention_until: Option<DateTime<Utc>>,
    pub legal_hold: bool,
    pub created_by: Option<Uuid>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub supersedes_document_id: Option<Uuid>,
    pub version_number: i32,
    pub verification_status: String,
    pub original_size_bytes: i64,
    pub expires_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct DocumentVersion {
    pub id: Uuid,
    pub document_id: Uuid,
    pub version_type: String,
    pub storage_reference: String,
    pub mime_type: String,
    pub size_bytes: i64,
    pub sha256: String,
    pub compression_type: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct DocumentAccessLog {
    pub id: Uuid,
    pub document_id: Uuid,
    pub user_id: Option<Uuid>,
    pub action: String,
    pub purpose: String,
    pub ip_address: Option<String>,
    pub user_agent: Option<String>,
    pub timestamp: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct DocumentJob {
    pub id: Uuid,
    pub document_id: Uuid,
    pub job_type: String,
    pub status: String,
    pub attempts: i32,
    pub error_code: Option<String>,
    pub error_message: Option<String>,
    pub created_at: DateTime<Utc>,
    pub started_at: Option<DateTime<Utc>>,
    pub completed_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct OcrResult {
    pub id: Uuid,
    pub document_id: Uuid,
    pub provider: String,
    pub provider_version: String,
    pub language: String,
    pub text: String,
    pub confidence: f64,
    pub quality_warning: Option<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BoundingBox {
    pub page: i32,
    pub x: f64,
    pub y: f64,
    pub width: f64,
    pub height: f64,
    pub text: String,
    pub confidence: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct DocumentExtraction {
    pub id: Uuid,
    pub document_id: Uuid,
    pub field: String,
    pub value: String,
    pub normalized_value: String,
    pub confidence: f64,
    pub source_region: serde_json::Value,
    pub extraction_method: String,
    pub status: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct DocumentVerification {
    pub id: Uuid,
    pub document_id: Uuid,
    pub extraction_id: Option<Uuid>,
    pub field: String,
    pub original_value: String,
    pub corrected_value: Option<String>,
    pub decision: String,
    pub verification_method: String,
    pub reason: Option<String>,
    pub verified_by: Uuid,
    pub verified_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct DocumentConsistencyCheck {
    pub id: Uuid,
    pub case_id: Option<Uuid>,
    pub document_id: Uuid,
    pub check_type: String,
    pub field: String,
    pub result: String,
    pub source_a_label: String,
    pub source_a_value: Option<String>,
    pub source_b_label: String,
    pub source_b_value: Option<String>,
    pub action_recommended: String,
    pub explanation: String,
    pub created_at: DateTime<Utc>,
}
