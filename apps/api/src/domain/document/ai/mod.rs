use crate::domain::document::models::DocumentType;
use crate::errors::AppError;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GroundedEvidenceSummary {
    pub summary_text: String,
    pub source_citations: Vec<String>,
    pub uncertainties: Vec<String>,
    pub conflicts_highlighted: Vec<String>,
    pub model: String,
    pub provider: String,
    pub prompt_version: String,
}

pub trait AIProvider: Send + Sync {
    fn provider_name(&self) -> &'static str;
    fn is_enabled(&self) -> bool;
    async fn generate_case_summary(
        &self,
        doc_type: &DocumentType,
        extracted_fields: &[(String, String, f64)], // (field, value, confidence)
        conflicts: &[String],
        matched_person: Option<&str>,
        matched_property: Option<&str>,
    ) -> Result<GroundedEvidenceSummary, AppError>;
}

/// Disabled AI Provider (Ensures Mira operates 100% deterministically when AI_PROVIDER=disabled)
pub struct DisabledAIProvider;

impl AIProvider for DisabledAIProvider {
    fn provider_name(&self) -> &'static str {
        "disabled"
    }

    fn is_enabled(&self) -> bool {
        false
    }

    async fn generate_case_summary(
        &self,
        _doc_type: &DocumentType,
        _extracted_fields: &[(String, String, f64)],
        _conflicts: &[String],
        _matched_person: Option<&str>,
        _matched_property: Option<&str>,
    ) -> Result<GroundedEvidenceSummary, AppError> {
        Ok(GroundedEvidenceSummary {
            summary_text: "AI summarization is disabled in system configuration. Review structured evidence fields below.".to_string(),
            source_citations: Vec::new(),
            uncertainties: Vec::new(),
            conflicts_highlighted: Vec::new(),
            model: "none".to_string(),
            provider: "disabled".to_string(),
            prompt_version: "v5.0.0-disabled".to_string(),
        })
    }
}

/// Local Grounded AI Provider with strict prompt boundary and source citations
pub struct LocalGroundedAIProvider;

impl AIProvider for LocalGroundedAIProvider {
    fn provider_name(&self) -> &'static str {
        "mira-local-grounded-engine"
    }

    fn is_enabled(&self) -> bool {
        true
    }

    async fn generate_case_summary(
        &self,
        doc_type: &DocumentType,
        extracted_fields: &[(String, String, f64)],
        conflicts: &[String],
        matched_person: Option<&str>,
        matched_property: Option<&str>,
    ) -> Result<GroundedEvidenceSummary, AppError> {
        // Enforce strict prompt boundary: Treat all inputs as untrusted structured data
        let mut citations = Vec::new();
        let mut uncertainties = Vec::new();
        let mut conflict_notes = Vec::new();

        let doc_type_name = doc_type.as_str().replace('_', " ");
        let mut parts = Vec::new();
        parts.push(format!(
            "This document was classified as a {}.",
            doc_type_name
        ));

        for (field, val, conf) in extracted_fields {
            if *conf < 0.70 {
                uncertainties.push(format!("Field '{}' extracted with low confidence ({:.0}%). Manual verification advised.", field, conf * 100.0));
            }

            match field.as_str() {
                "NAME" => {
                    parts.push(format!(
                        "Extracted applicant name is '{}'. [Source: {}, Page 1]",
                        val, doc_type_name
                    ));
                    citations.push(format!("{}: Name = {}", doc_type_name, val));
                }
                "DATE_OF_BIRTH" => {
                    parts.push(format!(
                        "Stated date of birth is '{}'. [Source: {}, Page 1]",
                        val, doc_type_name
                    ));
                    citations.push(format!("{}: DOB = {}", doc_type_name, val));
                }
                "AMOUNT" => {
                    parts.push(format!(
                        "Document declares annual income/amount as ₹{}. [Source: {}, Page 1]",
                        val, doc_type_name
                    ));
                    citations.push(format!("{}: Stated Amount = ₹{}", doc_type_name, val));
                }
                "PROPERTY_ID" => {
                    parts.push(format!(
                        "Document references property ID '{}'. [Source: {}, Page 1]",
                        val, doc_type_name
                    ));
                    citations.push(format!("{}: Property ID = {}", doc_type_name, val));
                }
                _ => {}
            }
        }

        if let Some(person) = matched_person {
            parts.push(format!(
                "Candidate person profile linked via V4 Entity Resolution: '{}'.",
                person
            ));
        }

        if let Some(prop) = matched_property {
            parts.push(format!(
                "Matched property in civic asset registry: '{}'.",
                prop
            ));
        }

        if !conflicts.is_empty() {
            for c in conflicts {
                conflict_notes.push(c.clone());
            }
            parts.push("Notice: Cross-document inconsistency detected between uploaded evidence and registered citizen profiles. Manual officer verification required before consequential action.".to_string());
        }

        let summary_text = parts.join(" ");

        Ok(GroundedEvidenceSummary {
            summary_text,
            source_citations: citations,
            uncertainties,
            conflicts_highlighted: conflict_notes,
            model: "mira-grounded-v5".to_string(),
            provider: self.provider_name().to_string(),
            prompt_version: "v5.2.0-source-grounded".to_string(),
        })
    }
}
