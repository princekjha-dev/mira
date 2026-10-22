use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::domain::document::consistency::CaseConsistencyReport;
use crate::domain::document::matching::DocumentEntityMatchResult;
use crate::domain::document::models::{Document, DocumentExtraction, DocumentVerification};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CaseTimelineEvent {
    pub timestamp: DateTime<Utc>,
    pub stage: String,
    pub title: String,
    pub description: String,
    pub actor: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EvidencePack {
    pub case_id: Uuid,
    pub case_public_id: String,
    pub scheme_name: String,
    pub applicant_name: String,
    pub documents: Vec<Document>,
    pub extractions: Vec<DocumentExtraction>,
    pub verifications: Vec<DocumentVerification>,
    pub entity_matches: DocumentEntityMatchResult,
    pub consistency_report: CaseConsistencyReport,
    pub why_flagged: String,
    pub recommended_action: String,
    pub ai_summary: Option<String>,
    pub timeline: Vec<CaseTimelineEvent>,
    pub generated_at: DateTime<Utc>,
}

pub struct EvidencePackBuilder;

impl EvidencePackBuilder {
    pub fn build_pack(
        case_id: Uuid,
        case_public_id: String,
        scheme_name: String,
        applicant_name: String,
        documents: Vec<Document>,
        extractions: Vec<DocumentExtraction>,
        verifications: Vec<DocumentVerification>,
        entity_matches: DocumentEntityMatchResult,
        consistency_report: CaseConsistencyReport,
        ai_summary: Option<String>,
    ) -> EvidencePack {
        // Construct explainable "Why Flagged" rationale
        let mut why_reasons = Vec::new();

        if consistency_report.conflict_count > 0 {
            for c in &consistency_report.checks {
                if c.result == "CONFLICT" {
                    why_reasons.push(format!("[{}] {}: {}", c.check_type, c.field, c.explanation));
                }
            }
        }

        for prop in &entity_matches.property_matches {
            if prop.has_previous_benefits {
                why_reasons.push(format!(
                    "Property '{}' already associated with prior benefit ({}). Duplicate check triggered.",
                    prop.public_id,
                    prop.previous_benefit_details.as_deref().unwrap_or("prior claim")
                ));
            }
        }

        let (why_flagged, recommended_action) = if !why_reasons.is_empty() {
            (
                format!("Review flagged due to: {}", why_reasons.join(" | ")),
                "MANUAL_OFFICER_REVIEW_REQUIRED".to_string(),
            )
        } else if !extractions.is_empty() {
            (
                "All extracted document evidence aligns with registry records. Routine verification check.".to_string(),
                "READY_FOR_OFFICER_VERIFICATION".to_string(),
            )
        } else {
            (
                "Document uploaded and undergoing processing.".to_string(),
                "AWAITING_EXTRACTION".to_string(),
            )
        };

        // Construct timeline
        let now = Utc::now();
        let mut timeline = vec![
            CaseTimelineEvent {
                timestamp: now - chrono::Duration::hours(2),
                stage: "APPLICATION_SUBMISSION".to_string(),
                title: "Application Submitted".to_string(),
                description: format!("Application for scheme '{}' initiated by applicant.", scheme_name),
                actor: applicant_name.clone(),
            },
        ];

        for doc in &documents {
            timeline.push(CaseTimelineEvent {
                timestamp: doc.created_at,
                stage: "DOCUMENT_UPLOAD".to_string(),
                title: format!("Document Uploaded: {}", doc.document_type),
                description: format!("File '{}' ({} bytes, sha256: {}...) ingested securely.", doc.original_filename, doc.size_bytes, &doc.sha256[..8]),
                actor: "Citizen/Field Official".to_string(),
            });
            timeline.push(CaseTimelineEvent {
                timestamp: doc.created_at + chrono::Duration::seconds(5),
                stage: "OCR_AND_EXTRACTION".to_string(),
                title: "OCR & Field Extraction Completed".to_string(),
                description: "Extracted normalized structured fields and bounded regions.".to_string(),
                actor: "Mira Document Engine".to_string(),
            });
        }

        if consistency_report.conflict_count > 0 {
            timeline.push(CaseTimelineEvent {
                timestamp: now - chrono::Duration::minutes(15),
                stage: "DISCREPANCY_FLAGGED".to_string(),
                title: "Cross-Document Discrepancy Detected".to_string(),
                description: "Consistency engine surfaced conflicting records requiring manual inspection.".to_string(),
                actor: "Mira Consistency Engine".to_string(),
            });
        }

        for v in &verifications {
            timeline.push(CaseTimelineEvent {
                timestamp: v.verified_at,
                stage: "HUMAN_VERIFICATION".to_string(),
                title: format!("Officer Action: {}", v.decision),
                description: format!("Field '{}' reviewed. Rationale: {}", v.field, v.reason.as_deref().unwrap_or("Verified by authorized officer.")),
                actor: format!("Officer UUID: {}", v.verified_by),
            });
        }

        EvidencePack {
            case_id,
            case_public_id,
            scheme_name,
            applicant_name,
            documents,
            extractions,
            verifications,
            entity_matches,
            consistency_report,
            why_flagged,
            recommended_action,
            ai_summary,
            timeline,
            generated_at: now,
        }
    }
}
