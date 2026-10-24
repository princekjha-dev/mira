use crate::domain::document::models::{
    ConsistencyCheckType, ConsistencyResult, DocumentConsistencyCheck,
};
use crate::domain::entity_resolution::normalization::normalize_name;
use crate::domain::entity_resolution::similarity::compare_names;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConsistencyCheckItem {
    pub check_type: String,
    pub field: String,
    pub result: String,
    pub source_a_label: String,
    pub source_a_value: Option<String>,
    pub source_b_label: String,
    pub source_b_value: Option<String>,
    pub action_recommended: String,
    pub explanation: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CrossDocumentTimelineEntry {
    pub date_str: String,
    pub year: i32,
    pub event_name: String,
    pub document_reference: String,
    pub is_temporally_valid: bool,
    pub anomaly_note: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CaseConsistencyReport {
    pub case_id: Option<Uuid>,
    pub total_checks: usize,
    pub pass_count: usize,
    pub conflict_count: usize,
    pub review_required: bool,
    pub checks: Vec<ConsistencyCheckItem>,
    pub timeline: Vec<CrossDocumentTimelineEntry>,
}

pub struct ConsistencyEngine;

impl ConsistencyEngine {
    pub fn evaluate_consistency(
        case_id: Option<Uuid>,
        doc_id: Uuid,
        extracted_name: Option<&str>,
        extracted_dob: Option<&str>,
        extracted_parent: Option<&str>,
        extracted_address: Option<&str>,
        record_name: Option<&str>,
        record_dob: Option<&str>,
        record_parent: Option<&str>,
        record_address: Option<&str>,
        comparison_doc_label: &str,
    ) -> CaseConsistencyReport {
        let mut checks = Vec::new();
        let mut timeline = Vec::new();

        // 1. Date of Birth Check
        if let (Some(doc_dob), Some(rec_dob)) = (extracted_dob, record_dob) {
            let clean_doc_dob = doc_dob.trim();
            let clean_rec_dob = rec_dob.trim();

            if clean_doc_dob == clean_rec_dob {
                checks.push(ConsistencyCheckItem {
                    check_type: ConsistencyCheckType::DobConflict.as_str().to_string(),
                    field: "DATE_OF_BIRTH".to_string(),
                    result: ConsistencyResult::Pass.as_str().to_string(),
                    source_a_label: "Uploaded Document".to_string(),
                    source_a_value: Some(clean_doc_dob.to_string()),
                    source_b_label: comparison_doc_label.to_string(),
                    source_b_value: Some(clean_rec_dob.to_string()),
                    action_recommended: "AUTO_PASS".to_string(),
                    explanation: "Date of birth matches authoritative record identically."
                        .to_string(),
                });
            } else {
                checks.push(ConsistencyCheckItem {
                    check_type: ConsistencyCheckType::DobConflict.as_str().to_string(),
                    field: "DATE_OF_BIRTH".to_string(),
                    result: ConsistencyResult::Conflict.as_str().to_string(),
                    source_a_label: "Uploaded Document".to_string(),
                    source_a_value: Some(clean_doc_dob.to_string()),
                    source_b_label: comparison_doc_label.to_string(),
                    source_b_value: Some(clean_rec_dob.to_string()),
                    action_recommended: "MANUAL_VERIFICATION_REQUIRED".to_string(),
                    explanation: format!(
                        "DOCUMENT CONFLICT DETECTED: Uploaded document states DOB as '{}' while {} states '{}'. Manual adjudication required.",
                        clean_doc_dob, comparison_doc_label, clean_rec_dob
                    ),
                });
            }

            // Timeline addition
            if let Ok(year) = clean_doc_dob
                .split('-')
                .next()
                .unwrap_or("1998")
                .parse::<i32>()
            {
                timeline.push(CrossDocumentTimelineEntry {
                    date_str: clean_doc_dob.to_string(),
                    year,
                    event_name: "Birth Stated on Document".to_string(),
                    document_reference: "Uploaded Document".to_string(),
                    is_temporally_valid: true,
                    anomaly_note: if clean_doc_dob != clean_rec_dob {
                        Some("Discrepancy with existing record".to_string())
                    } else {
                        None
                    },
                });
            }
        } else {
            checks.push(ConsistencyCheckItem {
                check_type: ConsistencyCheckType::DobConflict.as_str().to_string(),
                field: "DATE_OF_BIRTH".to_string(),
                result: ConsistencyResult::InsufficientData.as_str().to_string(),
                source_a_label: "Uploaded Document".to_string(),
                source_a_value: extracted_dob.map(|s| s.to_string()),
                source_b_label: comparison_doc_label.to_string(),
                source_b_value: record_dob.map(|s| s.to_string()),
                action_recommended: "INSUFFICIENT_DATA_REVIEW".to_string(),
                explanation:
                    "One of the source records does not provide a validated date of birth."
                        .to_string(),
            });
        }

        // 2. Name Variation Check
        if let (Some(doc_n), Some(rec_n)) = (extracted_name, record_name) {
            let norm_doc = normalize_name(doc_n);
            let norm_rec = normalize_name(rec_n);
            let name_res = compare_names(&norm_doc, &norm_rec);
            let sim = name_res.similarity;
            let details = name_res.explanation;

            if sim >= 0.85 {
                checks.push(ConsistencyCheckItem {
                    check_type: ConsistencyCheckType::NameVariation.as_str().to_string(),
                    field: "NAME".to_string(),
                    result: ConsistencyResult::Pass.as_str().to_string(),
                    source_a_label: "Uploaded Document".to_string(),
                    source_a_value: Some(doc_n.to_string()),
                    source_b_label: comparison_doc_label.to_string(),
                    source_b_value: Some(rec_n.to_string()),
                    action_recommended: "AUTO_PASS".to_string(),
                    explanation: format!(
                        "Name variation consistent (similarity: {:.0}%, {})",
                        sim * 100.0,
                        details
                    ),
                });
            } else if sim >= 0.50 {
                checks.push(ConsistencyCheckItem {
                    check_type: ConsistencyCheckType::NameVariation.as_str().to_string(),
                    field: "NAME".to_string(),
                    result: ConsistencyResult::Conflict.as_str().to_string(),
                    source_a_label: "Uploaded Document".to_string(),
                    source_a_value: Some(doc_n.to_string()),
                    source_b_label: comparison_doc_label.to_string(),
                    source_b_value: Some(rec_n.to_string()),
                    action_recommended: "MANUAL_VERIFICATION_REQUIRED".to_string(),
                    explanation: format!(
                        "Moderate name phonetic/spelling variation detected: '{}' vs '{}'",
                        doc_n, rec_n
                    ),
                });
            } else {
                checks.push(ConsistencyCheckItem {
                    check_type: ConsistencyCheckType::NameVariation.as_str().to_string(),
                    field: "NAME".to_string(),
                    result: ConsistencyResult::Conflict.as_str().to_string(),
                    source_a_label: "Uploaded Document".to_string(),
                    source_a_value: Some(doc_n.to_string()),
                    source_b_label: comparison_doc_label.to_string(),
                    source_b_value: Some(rec_n.to_string()),
                    action_recommended: "MANUAL_VERIFICATION_REQUIRED".to_string(),
                    explanation: format!(
                        "Significant name mismatch detected: '{}' vs '{}'",
                        doc_n, rec_n
                    ),
                });
            }
        }

        // 3. Address Check
        if let (Some(doc_addr), Some(rec_addr)) = (extracted_address, record_address) {
            let lower_doc = doc_addr.to_lowercase();
            let lower_rec = rec_addr.to_lowercase();

            if lower_doc.contains(&lower_rec) || lower_rec.contains(&lower_doc) {
                checks.push(ConsistencyCheckItem {
                    check_type: ConsistencyCheckType::AddressConflict.as_str().to_string(),
                    field: "ADDRESS".to_string(),
                    result: ConsistencyResult::Pass.as_str().to_string(),
                    source_a_label: "Uploaded Document".to_string(),
                    source_a_value: Some(doc_addr.to_string()),
                    source_b_label: comparison_doc_label.to_string(),
                    source_b_value: Some(rec_addr.to_string()),
                    action_recommended: "AUTO_PASS".to_string(),
                    explanation: "Address components correlate with existing residential address."
                        .to_string(),
                });
            } else {
                checks.push(ConsistencyCheckItem {
                    check_type: ConsistencyCheckType::AddressConflict.as_str().to_string(),
                    field: "ADDRESS".to_string(),
                    result: ConsistencyResult::InsufficientData.as_str().to_string(),
                    source_a_label: "Uploaded Document".to_string(),
                    source_a_value: Some(doc_addr.to_string()),
                    source_b_label: comparison_doc_label.to_string(),
                    source_b_value: Some(rec_addr.to_string()),
                    action_recommended: "OFFICER_REVIEW".to_string(),
                    explanation: "Address difference noted. Verify if applicant has relocated or holds multiple residences.".to_string(),
                });
            }
        }

        // 4. Parent Name Check
        if let (Some(doc_p), Some(rec_p)) = (extracted_parent, record_parent) {
            let name_res = compare_names(&normalize_name(doc_p), &normalize_name(rec_p));
            let sim = name_res.similarity;
            if sim >= 0.70 {
                checks.push(ConsistencyCheckItem {
                    check_type: ConsistencyCheckType::ParentConflict.as_str().to_string(),
                    field: "PARENT_NAME".to_string(),
                    result: ConsistencyResult::Pass.as_str().to_string(),
                    source_a_label: "Uploaded Document".to_string(),
                    source_a_value: Some(doc_p.to_string()),
                    source_b_label: comparison_doc_label.to_string(),
                    source_b_value: Some(rec_p.to_string()),
                    action_recommended: "AUTO_PASS".to_string(),
                    explanation: "Parent name aligns with family graph.".to_string(),
                });
            } else {
                checks.push(ConsistencyCheckItem {
                    check_type: ConsistencyCheckType::ParentConflict.as_str().to_string(),
                    field: "PARENT_NAME".to_string(),
                    result: ConsistencyResult::Conflict.as_str().to_string(),
                    source_a_label: "Uploaded Document".to_string(),
                    source_a_value: Some(doc_p.to_string()),
                    source_b_label: comparison_doc_label.to_string(),
                    source_b_value: Some(rec_p.to_string()),
                    action_recommended: "MANUAL_VERIFICATION_REQUIRED".to_string(),
                    explanation: format!("Parent name mismatch: '{}' vs '{}'", doc_p, rec_p),
                });
            }
        }

        let conflict_count = checks.iter().filter(|c| c.result == "CONFLICT").count();
        let pass_count = checks.iter().filter(|c| c.result == "PASS").count();
        let review_required = conflict_count > 0;

        CaseConsistencyReport {
            case_id,
            total_checks: checks.len(),
            pass_count,
            conflict_count,
            review_required,
            checks,
            timeline,
        }
    }
}
