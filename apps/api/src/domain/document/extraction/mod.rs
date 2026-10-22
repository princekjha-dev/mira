use chrono::NaiveDate;
use serde::{Deserialize, Serialize};
use crate::domain::document::models::{BoundingBox, DocumentType, ExtractionStatus};
use crate::domain::entity_resolution::normalization::normalize_name;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExtractedField {
    pub field_name: String,
    pub raw_value: String,
    pub normalized_value: String,
    pub confidence: f64,
    pub source_region: BoundingBox,
    pub extraction_method: String,
    pub validation_status: ExtractionStatus,
}

pub struct DocumentExtractor;

impl DocumentExtractor {
    pub fn extract(
        doc_type: &DocumentType,
        text: &str,
        regions: &[BoundingBox],
    ) -> Vec<ExtractedField> {
        let mut fields = Vec::new();

        match doc_type {
            DocumentType::BirthCertificate => {
                Self::extract_birth_certificate(text, regions, &mut fields);
            }
            DocumentType::IncomeCertificate => {
                Self::extract_income_certificate(text, regions, &mut fields);
            }
            DocumentType::ResidenceCertificate => {
                Self::extract_residence_certificate(text, regions, &mut fields);
            }
            DocumentType::PropertyDocument => {
                Self::extract_property_document(text, regions, &mut fields);
            }
            _ => {
                Self::extract_generic(text, regions, &mut fields);
            }
        }

        fields
    }

    fn extract_birth_certificate(text: &str, regions: &[BoundingBox], out: &mut Vec<ExtractedField>) {
        // Child Name
        if let Some((raw, region)) = find_value_after_prefix(text, &["Child Name / नाम:", "Child Name:", "नाम:", "Name:"], regions) {
            let normalized = normalize_name(&clean_bilingual(&raw));
            out.push(ExtractedField {
                field_name: "NAME".to_string(),
                raw_value: raw,
                normalized_value: normalized,
                confidence: 0.96,
                source_region: region,
                extraction_method: "SCHEMA_BIRTH_CERTIFICATE".to_string(),
                validation_status: ExtractionStatus::SystemExtracted,
            });
        }

        // DOB
        if let Some((raw, region)) = find_value_after_prefix(text, &["Date of Birth / जन्म तिथि:", "Date of Birth:", "जन्म तिथि:", "DOB:"], regions) {
            let (normalized, valid) = normalize_and_validate_date(&raw);
            out.push(ExtractedField {
                field_name: "DATE_OF_BIRTH".to_string(),
                raw_value: raw,
                normalized_value: normalized,
                confidence: if valid { 0.95 } else { 0.60 },
                source_region: region,
                extraction_method: "SCHEMA_BIRTH_CERTIFICATE".to_string(),
                validation_status: if valid { ExtractionStatus::SystemExtracted } else { ExtractionStatus::Unverified },
            });
        }

        // Father / Parent Name
        if let Some((raw, region)) = find_value_after_prefix(text, &["Father Name / पिता का नाम:", "Father Name:", "पिता का नाम:", "Parent:"], regions) {
            let normalized = normalize_name(&clean_bilingual(&raw));
            out.push(ExtractedField {
                field_name: "PARENT_NAME".to_string(),
                raw_value: raw,
                normalized_value: normalized,
                confidence: 0.94,
                source_region: region,
                extraction_method: "SCHEMA_BIRTH_CERTIFICATE".to_string(),
                validation_status: ExtractionStatus::SystemExtracted,
            });
        }

        // Mother Name
        if let Some((raw, region)) = find_value_after_prefix(text, &["Mother Name / माता का नाम:", "Mother Name:", "माता का नाम:"], regions) {
            let normalized = normalize_name(&clean_bilingual(&raw));
            out.push(ExtractedField {
                field_name: "MOTHER_NAME".to_string(),
                raw_value: raw,
                normalized_value: normalized,
                confidence: 0.93,
                source_region: region,
                extraction_method: "SCHEMA_BIRTH_CERTIFICATE".to_string(),
                validation_status: ExtractionStatus::SystemExtracted,
            });
        }

        // Document / Registration Number
        if let Some((raw, region)) = find_value_after_prefix(text, &["Registration No:", "Reg No:", "प्रमाण पत्र संख्या:"], regions) {
            out.push(ExtractedField {
                field_name: "DOCUMENT_NUMBER".to_string(),
                raw_value: raw.clone(),
                normalized_value: raw.trim().to_uppercase(),
                confidence: 0.98,
                source_region: region,
                extraction_method: "SCHEMA_BIRTH_CERTIFICATE".to_string(),
                validation_status: ExtractionStatus::SystemExtracted,
            });
        }

        // Address
        if let Some((raw, region)) = find_value_after_prefix(text, &["Permanent Address:", "Address:", "पता:"], regions) {
            out.push(ExtractedField {
                field_name: "ADDRESS".to_string(),
                raw_value: raw.clone(),
                normalized_value: raw.trim().to_lowercase(),
                confidence: 0.92,
                source_region: region,
                extraction_method: "SCHEMA_BIRTH_CERTIFICATE".to_string(),
                validation_status: ExtractionStatus::SystemExtracted,
            });
        }
    }

    fn extract_income_certificate(text: &str, regions: &[BoundingBox], out: &mut Vec<ExtractedField>) {
        // Applicant Name
        if let Some((raw, region)) = find_value_after_prefix(text, &["Applicant Name / प्रार्थी का नाम:", "Applicant Name:", "प्रार्थी का नाम:", "Name:"], regions) {
            let normalized = normalize_name(&clean_bilingual(&raw));
            out.push(ExtractedField {
                field_name: "NAME".to_string(),
                raw_value: raw,
                normalized_value: normalized,
                confidence: 0.95,
                source_region: region,
                extraction_method: "SCHEMA_INCOME_CERTIFICATE".to_string(),
                validation_status: ExtractionStatus::SystemExtracted,
            });
        }

        // DOB (where available in income cert)
        if let Some((raw, region)) = find_value_after_prefix(text, &["Date of Birth:", "DOB:", "जन्म तिथि:"], regions) {
            let (normalized, valid) = normalize_and_validate_date(&raw);
            out.push(ExtractedField {
                field_name: "DATE_OF_BIRTH".to_string(),
                raw_value: raw,
                normalized_value: normalized,
                confidence: if valid { 0.94 } else { 0.60 },
                source_region: region,
                extraction_method: "SCHEMA_INCOME_CERTIFICATE".to_string(),
                validation_status: if valid { ExtractionStatus::SystemExtracted } else { ExtractionStatus::Unverified },
            });
        }

        // Annual Income / Amount
        if let Some((raw, region)) = find_value_after_prefix(text, &["Annual Income / वार्षिक आय:", "Annual Income:", "वार्षिक आय:", "Income:"], regions) {
            let normalized = normalize_amount(&raw);
            out.push(ExtractedField {
                field_name: "AMOUNT".to_string(),
                raw_value: raw,
                normalized_value: normalized,
                confidence: 0.96,
                source_region: region,
                extraction_method: "SCHEMA_INCOME_CERTIFICATE".to_string(),
                validation_status: ExtractionStatus::SystemExtracted,
            });
        }

        // Certificate Number
        if let Some((raw, region)) = find_value_after_prefix(text, &["Certificate No:", "प्रमाण पत्र संख्या:", "Cert No:"], regions) {
            out.push(ExtractedField {
                field_name: "DOCUMENT_NUMBER".to_string(),
                raw_value: raw.clone(),
                normalized_value: raw.trim().to_uppercase(),
                confidence: 0.98,
                source_region: region,
                extraction_method: "SCHEMA_INCOME_CERTIFICATE".to_string(),
                validation_status: ExtractionStatus::SystemExtracted,
            });
        }

        // Address
        if let Some((raw, region)) = find_value_after_prefix(text, &["Address:", "पता:"], regions) {
            out.push(ExtractedField {
                field_name: "ADDRESS".to_string(),
                raw_value: raw.clone(),
                normalized_value: raw.trim().to_lowercase(),
                confidence: 0.91,
                source_region: region,
                extraction_method: "SCHEMA_INCOME_CERTIFICATE".to_string(),
                validation_status: ExtractionStatus::SystemExtracted,
            });
        }
    }

    fn extract_residence_certificate(text: &str, regions: &[BoundingBox], out: &mut Vec<ExtractedField>) {
        if let Some((raw, region)) = find_value_after_prefix(text, &["निवासी का नाम:", "Name:", "Resident Name:"], regions) {
            let normalized = normalize_name(&clean_bilingual(&raw));
            out.push(ExtractedField {
                field_name: "NAME".to_string(),
                raw_value: raw,
                normalized_value: normalized,
                confidence: 0.94,
                source_region: region,
                extraction_method: "SCHEMA_RESIDENCE_CERTIFICATE".to_string(),
                validation_status: ExtractionStatus::SystemExtracted,
            });
        }

        if let Some((raw, region)) = find_value_after_prefix(text, &["पिता/पति का नाम:", "Parent:", "Father/Spouse Name:"], regions) {
            let normalized = normalize_name(&clean_bilingual(&raw));
            out.push(ExtractedField {
                field_name: "PARENT_NAME".to_string(),
                raw_value: raw,
                normalized_value: normalized,
                confidence: 0.93,
                source_region: region,
                extraction_method: "SCHEMA_RESIDENCE_CERTIFICATE".to_string(),
                validation_status: ExtractionStatus::SystemExtracted,
            });
        }

        if let Some((raw, region)) = find_value_after_prefix(text, &["वर्तमान पता:", "Address:", "स्थायी पता:"], regions) {
            out.push(ExtractedField {
                field_name: "ADDRESS".to_string(),
                raw_value: raw.clone(),
                normalized_value: raw.trim().to_lowercase(),
                confidence: 0.92,
                source_region: region,
                extraction_method: "SCHEMA_RESIDENCE_CERTIFICATE".to_string(),
                validation_status: ExtractionStatus::SystemExtracted,
            });
        }

        if let Some((raw, region)) = find_value_after_prefix(text, &["प्रमाण पत्र संख्या:", "Certificate Reference:", "Cert No:"], regions) {
            out.push(ExtractedField {
                field_name: "DOCUMENT_NUMBER".to_string(),
                raw_value: raw.clone(),
                normalized_value: raw.trim().to_uppercase(),
                confidence: 0.98,
                source_region: region,
                extraction_method: "SCHEMA_RESIDENCE_CERTIFICATE".to_string(),
                validation_status: ExtractionStatus::SystemExtracted,
            });
        }
    }

    fn extract_property_document(text: &str, regions: &[BoundingBox], out: &mut Vec<ExtractedField>) {
        // Property Identifier (e.g. P001)
        if let Some((raw, region)) = find_value_after_prefix(text, &["Property Identifier:", "Property ID:", "सम्पत्ति पहचान:", "Survey No:"], regions) {
            out.push(ExtractedField {
                field_name: "PROPERTY_ID".to_string(),
                raw_value: raw.clone(),
                normalized_value: raw.trim().to_uppercase(),
                confidence: 0.97,
                source_region: region,
                extraction_method: "SCHEMA_PROPERTY_DOCUMENT".to_string(),
                validation_status: ExtractionStatus::SystemExtracted,
            });
        }

        // Beneficiary / Owner Name
        if let Some((raw, region)) = find_value_after_prefix(text, &["Beneficiary:", "Owner / Occupant:", "Owner:", "Name:"], regions) {
            let normalized = normalize_name(&clean_bilingual(&raw));
            out.push(ExtractedField {
                field_name: "NAME".to_string(),
                raw_value: raw,
                normalized_value: normalized,
                confidence: 0.94,
                source_region: region,
                extraction_method: "SCHEMA_PROPERTY_DOCUMENT".to_string(),
                validation_status: ExtractionStatus::SystemExtracted,
            });
        }

        // Address
        if let Some((raw, region)) = find_value_after_prefix(text, &["Address:", "पता:"], regions) {
            out.push(ExtractedField {
                field_name: "ADDRESS".to_string(),
                raw_value: raw.clone(),
                normalized_value: raw.trim().to_lowercase(),
                confidence: 0.91,
                source_region: region,
                extraction_method: "SCHEMA_PROPERTY_DOCUMENT".to_string(),
                validation_status: ExtractionStatus::SystemExtracted,
            });
        }
    }

    fn extract_generic(text: &str, regions: &[BoundingBox], out: &mut Vec<ExtractedField>) {
        if let Some((raw, region)) = find_value_after_prefix(text, &["Name:", "Holder Name:"], regions) {
            out.push(ExtractedField {
                field_name: "NAME".to_string(),
                raw_value: raw.clone(),
                normalized_value: normalize_name(&raw),
                confidence: 0.90,
                source_region: region,
                extraction_method: "GENERIC_EXTRACTOR".to_string(),
                validation_status: ExtractionStatus::SystemExtracted,
            });
        }

        if let Some((raw, region)) = find_value_after_prefix(text, &["Date of Birth:", "DOB:"], regions) {
            let (normalized, valid) = normalize_and_validate_date(&raw);
            out.push(ExtractedField {
                field_name: "DATE_OF_BIRTH".to_string(),
                raw_value: raw,
                normalized_value: normalized,
                confidence: if valid { 0.90 } else { 0.50 },
                source_region: region,
                extraction_method: "GENERIC_EXTRACTOR".to_string(),
                validation_status: if valid { ExtractionStatus::SystemExtracted } else { ExtractionStatus::Unverified },
            });
        }
    }
}

// -----------------------------------------------------------------------------
// Utility Functions
// -----------------------------------------------------------------------------

fn clean_bilingual(val: &str) -> String {
    // E.g. "Rahul Kumar (राहुल कुमार)" -> "Rahul Kumar"
    if let Some(pos) = val.find('(') {
        val[..pos].trim().to_string()
    } else {
        val.trim().to_string()
    }
}

fn normalize_amount(raw: &str) -> String {
    // Extract numbers from "₹ 95,000 (Ninety Five Thousand)" -> "95000"
    let digits: String = raw.chars().take_while(|&c| c != '(').filter(|c| c.is_ascii_digit()).collect();
    if digits.is_empty() {
        raw.trim().to_string()
    } else {
        digits
    }
}

fn normalize_and_validate_date(raw: &str) -> (String, bool) {
    let trimmed = raw.trim();
    // Try DD/MM/YYYY
    if let Ok(d) = NaiveDate::parse_from_str(trimmed, "%d/%m/%Y") {
        return (d.format("%Y-%m-%d").to_string(), true);
    }
    // Try YYYY-MM-DD
    if let Ok(d) = NaiveDate::parse_from_str(trimmed, "%Y-%m-%d") {
        return (d.format("%Y-%m-%d").to_string(), true);
    }
    // Try DD-MM-YYYY
    if let Ok(d) = NaiveDate::parse_from_str(trimmed, "%d-%m-%Y") {
        return (d.format("%Y-%m-%d").to_string(), true);
    }

    // Attempt fuzzy parsing for messy OCR e.g. "12/04/1998" inside "(Unclear OCR: ...)"
    for token in trimmed.split(|c: char| c.is_whitespace() || c == '(' || c == ')') {
        if let Ok(d) = NaiveDate::parse_from_str(token, "%d/%m/%Y") {
            return (d.format("%Y-%m-%d").to_string(), true);
        }
    }

    (trimmed.to_string(), false)
}

fn find_value_after_prefix(text: &str, prefixes: &[&str], regions: &[BoundingBox]) -> Option<(String, BoundingBox)> {
    for line in text.lines() {
        for prefix in prefixes {
            if let Some(pos) = line.find(prefix) {
                let remainder = line[pos + prefix.len()..].trim().to_string();
                if !remainder.is_empty() {
                    // Find corresponding region
                    let region = regions
                        .iter()
                        .find(|r| r.text.contains(prefix) || r.text.contains(&remainder))
                        .cloned()
                        .unwrap_or_else(|| BoundingBox {
                            page: 1,
                            x: 60.0,
                            y: 120.0,
                            width: 280.0,
                            height: 20.0,
                            text: line.to_string(),
                            confidence: 0.90,
                        });
                    return Some((remainder, region));
                }
            }
        }
    }
    None
}
