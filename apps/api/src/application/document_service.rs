use chrono::Utc;
use serde::{Deserialize, Serialize};
use sqlx::PgPool;
use std::sync::Arc;
use uuid::Uuid;

use crate::{
    auth::AuthenticatedUser,
    domain::{
        document::{
            ai::{AIProvider, GroundedEvidenceSummary, LocalGroundedAIProvider},
            classifier::DocumentClassifier,
            consistency::{CaseConsistencyReport, ConsistencyEngine},
            evidence_pack::{EvidencePack, EvidencePackBuilder},
            extraction::{DocumentExtractor, ExtractedField},
            file_type_registry::{FileTypeRegistry, ValidatedFile},
            matching::{DocumentEntityMatchResult, DocumentMatcher},
            models::{
                AccessAction, AccessPurpose, Document, DocumentAccessLog, DocumentExtraction,
                DocumentStatus, DocumentType, DocumentVerification, DocumentVersion, ExtractionStatus,
                OcrResult, VerificationDecision, VersionType,
            },
            ocr::{BilingualOcrProvider, OCRProvider},
            scanner::{MalwareScanner, SecurityScanner},
            storage::{compute_sha256, LocalStorageAdapter, ObjectStorage},
        },
        RoleType,
    },
    errors::AppError,
};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UploadDocumentPayload {
    pub raw_filename: String,
    pub owner_type: String, // CITIZEN, PERSON, APPLICATION, HOUSEHOLD, PROPERTY
    pub owner_id: Uuid,
    pub specified_doc_type: Option<String>,
    pub access_purpose: String, // APPLICATION_VERIFICATION, CITIZEN_SELF_SERVICE, etc.
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExtractionVerificationPayload {
    pub extraction_id: Uuid,
    pub decision: String, // VERIFIED, REJECTED, EDITED, SOURCE_VERIFIED
    pub verification_method: Option<String>,
    pub corrected_value: Option<String>,
    pub reason: Option<String>,
}

#[derive(Clone)]
pub struct DocumentService {
    pool: PgPool,
    storage: LocalStorageAdapter,
    scanner: Arc<SecurityScanner>,
    ocr: Arc<BilingualOcrProvider>,
    ai: Arc<LocalGroundedAIProvider>,
}

impl DocumentService {
    pub async fn new(pool: PgPool, storage_base_path: &str) -> Result<Self, AppError> {
        let storage = LocalStorageAdapter::new(storage_base_path).await?;
        Ok(Self {
            pool,
            storage,
            scanner: Arc::new(SecurityScanner::default()),
            ocr: Arc::new(BilingualOcrProvider::new()),
            ai: Arc::new(LocalGroundedAIProvider),
        })
    }

    /// Full Document Ingestion, Scanning, Validation, Extraction & Matching Pipeline
    pub async fn upload_and_process_document(
        &self,
        payload: UploadDocumentPayload,
        data: &[u8],
        user: &AuthenticatedUser,
        ip_address: Option<String>,
        user_agent: Option<String>,
    ) -> Result<Document, AppError> {
        // 1. Mandatory Object-Level Authorization Check
        Self::authorize_owner_access(user, &payload.owner_type, payload.owner_id)?;

        // 2. Strict File Validation (Signatures, MIME, Size, Sanitization)
        let validated = FileTypeRegistry::validate(&payload.raw_filename, None, data)?;

        // 3. Malware & Security Scan
        let scan_report = self.scanner.scan(&validated.sanitized_filename, data)?;
        if !scan_report.is_clean || scan_report.quarantine_recommended {
            // Quarantine malicious upload safely
            self.storage.quarantine_file(&validated.storage_key, data).await?;

            let doc_public_id = format!("DOC-QUARANTINED-{}", Uuid::new_v4().to_string()[..8].to_uppercase());
            let sha = compute_sha256(data);

            let row = sqlx::query_as!(
                Document,
                r#"
                INSERT INTO documents (
                    public_id, owner_type, owner_id, document_type,
                    original_filename, detected_mime_type, size_bytes, sha256,
                    storage_reference, status, created_by
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'QUARANTINED', $10)
                RETURNING *
                "#,
                doc_public_id,
                payload.owner_type,
                payload.owner_id,
                "QUARANTINED_CONTENT",
                validated.sanitized_filename,
                validated.detected_mime,
                validated.size_bytes,
                sha,
                format!("quarantine/{}", validated.storage_key),
                user.id
            )
            .fetch_one(&self.pool)
            .await
            .map_err(|e| AppError::Internal(format!("Failed to record quarantined document: {}", e)))?;

            return Err(AppError::Validation(format!(
                "Security scan violation: Document quarantined. Threat: {}",
                scan_report.threat_detected.unwrap_or_else(|| "Suspicious payload".into())
            )));
        }

        // 4. Calculate SHA-256 Integrity Hash
        let file_sha256 = compute_sha256(data);

        // 5. Document Exact Duplicate Detection (SHA-256 match)
        let existing = sqlx::query_as!(
            Document,
            r#"
            SELECT * FROM documents
            WHERE sha256 = $1 AND owner_id = $2 AND status != 'REVOKED'
            LIMIT 1
            "#,
            file_sha256,
            payload.owner_id
        )
        .fetch_optional(&self.pool)
        .await
        .map_err(|e| AppError::Internal(format!("Database error checking duplicate hash: {}", e)))?;

        if let Some(existing_doc) = existing {
            // Log access
            self.log_access(
                existing_doc.id,
                Some(user.id),
                AccessAction::View,
                AccessPurpose::from_str(&payload.access_purpose),
                ip_address,
                user_agent,
            ).await?;
            return Ok(existing_doc);
        }

        // 6. Persist Immutable Original in Object Storage
        self.storage.put(&validated.storage_key, data).await?;

        // 7. Initial Document Classification
        let (inferred_type, _, _) = DocumentClassifier::classify(
            &validated.sanitized_filename,
            if let Ok(s) = std::str::from_utf8(data) { s } else { "" },
        );
        let final_doc_type = payload.specified_doc_type
            .map(|s| DocumentType::from_str(&s))
            .unwrap_or(inferred_type);

        let doc_public_id = format!("DOC-{}-{}", final_doc_type.as_str().split('_').next().unwrap_or("DOC"), Uuid::new_v4().to_string()[..6].to_uppercase());

        // 8. Create Document Record
        let doc = sqlx::query_as!(
            Document,
            r#"
            INSERT INTO documents (
                public_id, owner_type, owner_id, document_type,
                original_filename, detected_mime_type, size_bytes, sha256,
                storage_reference, status, created_by
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'PROCESSING', $10)
            RETURNING *
            "#,
            doc_public_id,
            payload.owner_type,
            payload.owner_id,
            final_doc_type.as_str(),
            validated.sanitized_filename,
            validated.detected_mime,
            validated.size_bytes,
            file_sha256,
            validated.storage_key,
            user.id
        )
        .fetch_one(&self.pool)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to insert document: {}", e)))?;

        // 9. Create ORIGINAL Document Version
        sqlx::query!(
            r#"
            INSERT INTO document_versions (
                document_id, version_type, storage_reference, mime_type, size_bytes, sha256, compression_type
            )
            VALUES ($1, 'ORIGINAL', $2, $3, $4, $5, 'NONE')
            "#,
            doc.id,
            validated.storage_key,
            validated.detected_mime,
            validated.size_bytes,
            file_sha256
        )
        .execute(&self.pool)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to record original version: {}", e)))?;

        // 10. Generate Preview Derivative Version (Lossless optimization tracking)
        let preview_key = format!("preview_{}", validated.storage_key);
        let _ = self.storage.put(&preview_key, data).await;
        sqlx::query!(
            r#"
            INSERT INTO document_versions (
                document_id, version_type, storage_reference, mime_type, size_bytes, sha256, compression_type
            )
            VALUES ($1, 'PREVIEW', $2, $3, $4, $5, 'LOSSLESS')
            "#,
            doc.id,
            preview_key,
            validated.detected_mime,
            validated.size_bytes,
            file_sha256
        )
        .execute(&self.pool)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to record preview version: {}", e)))?;

        // 11. Log Ingestion in Access Audit
        self.log_access(
            doc.id,
            Some(user.id),
            AccessAction::Process,
            AccessPurpose::from_str(&payload.access_purpose),
            ip_address,
            user_agent,
        ).await?;

        // 12. Run OCR & Quality Extraction
        let ocr_output = self.ocr.process_document(
            &validated.sanitized_filename,
            &validated.detected_mime,
            data,
        ).await?;

        sqlx::query!(
            r#"
            INSERT INTO ocr_results (
                document_id, provider, provider_version, language, text, confidence, quality_warning
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            "#,
            doc.id,
            ocr_output.provider,
            ocr_output.provider_version,
            ocr_output.primary_language,
            ocr_output.full_text,
            ocr_output.overall_confidence,
            ocr_output.quality_warning
        )
        .execute(&self.pool)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to record OCR results: {}", e)))?;

        // 13. Structured Field Extraction with Bounding Boxes
        let all_regions: Vec<crate::domain::document::models::BoundingBox> = ocr_output.pages.iter().flat_map(|p| p.regions.clone()).collect();
        let extracted_fields = DocumentExtractor::extract(&final_doc_type, &ocr_output.full_text, &all_regions);

        for f in extracted_fields {
            let region_json = serde_json::to_value(&f.source_region).unwrap_or(serde_json::json!({}));
            sqlx::query!(
                r#"
                INSERT INTO document_extractions (
                    document_id, field, value, normalized_value, confidence, source_region, extraction_method, status
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                "#,
                doc.id,
                f.field_name,
                f.raw_value,
                f.normalized_value,
                f.confidence,
                region_json,
                f.extraction_method,
                f.validation_status.as_str()
            )
            .execute(&self.pool)
            .await
            .map_err(|e| AppError::Internal(format!("Failed to record extraction field: {}", e)))?;
        }

        // 14. Mark Document Status as READY
        let updated_doc = sqlx::query_as!(
            Document,
            r#"
            UPDATE documents
            SET status = 'READY', updated_at = NOW()
            WHERE id = $1
            RETURNING *
            "#,
            doc.id
        )
        .fetch_one(&self.pool)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to update document status: {}", e)))?;

        Ok(updated_doc)
    }

    /// Retrieve Document with Purpose Check & Object-Level Isolation
    pub async fn get_document(
        &self,
        doc_id: Uuid,
        user: &AuthenticatedUser,
        purpose: &str,
        ip: Option<String>,
        ua: Option<String>,
    ) -> Result<Document, AppError> {
        let doc = sqlx::query_as!(
            Document,
            r#"SELECT * FROM documents WHERE id = $1"#,
            doc_id
        )
        .fetch_optional(&self.pool)
        .await
        .map_err(|e| AppError::Internal(e.to_string()))?
        .ok_or_else(|| AppError::NotFound("Document not found".into()))?;

        Self::authorize_document_access(user, &doc)?;

        self.log_access(
            doc.id,
            Some(user.id),
            AccessAction::View,
            AccessPurpose::from_str(purpose),
            ip,
            ua,
        ).await?;

        Ok(doc)
    }

    /// Secure Document Binary Download
    pub async fn download_document_binary(
        &self,
        doc_id: Uuid,
        user: &AuthenticatedUser,
        purpose: &str,
        ip: Option<String>,
        ua: Option<String>,
    ) -> Result<(Document, Vec<u8>), AppError> {
        let doc = self.get_document(doc_id, user, purpose, ip.clone(), ua.clone()).await?;

        let bytes = self.storage.get(&doc.storage_reference).await?;

        self.log_access(
            doc.id,
            Some(user.id),
            AccessAction::Download,
            AccessPurpose::from_str(purpose),
            ip,
            ua,
        ).await?;

        Ok((doc, bytes))
    }

    /// List Documents Scoped by Role & Owner
    pub async fn list_documents(
        &self,
        user: &AuthenticatedUser,
        owner_type: Option<&str>,
        owner_id: Option<Uuid>,
    ) -> Result<Vec<Document>, AppError> {
        let is_admin_or_officer = user.roles.iter().any(|r| {
            r == "VERIFICATION_OFFICER"
                || r == "FIELD_OFFICIAL"
                || r == "DEPARTMENT_ADMIN"
                || r == "SUPER_ADMIN"
                || r == "AUDITOR"
        });

        if is_admin_or_officer {
            if let (Some(ot), Some(oid)) = (owner_type, owner_id) {
                sqlx::query_as!(
                    Document,
                    r#"
                    SELECT * FROM documents
                    WHERE owner_type = $1 AND owner_id = $2 AND status != 'REVOKED'
                    ORDER BY created_at DESC
                    "#,
                    ot,
                    oid
                )
                .fetch_all(&self.pool)
                .await
                .map_err(|e| AppError::Internal(e.to_string()))
            } else {
                sqlx::query_as!(
                    Document,
                    r#"
                    SELECT * FROM documents
                    WHERE status != 'REVOKED'
                    ORDER BY created_at DESC
                    LIMIT 100
                    "#
                )
                .fetch_all(&self.pool)
                .await
                .map_err(|e| AppError::Internal(e.to_string()))
            }
        } else {
            // Citizen: strictly own documents
            sqlx::query_as!(
                Document,
                r#"
                SELECT * FROM documents
                WHERE created_by = $1 AND status != 'REVOKED'
                ORDER BY created_at DESC
                "#,
                user.id
            )
            .fetch_all(&self.pool)
            .await
            .map_err(|e| AppError::Internal(e.to_string()))
        }
    }

    /// Retrieve Extractions for Document
    pub async fn get_extractions(&self, doc_id: Uuid) -> Result<Vec<DocumentExtraction>, AppError> {
        sqlx::query_as!(
            DocumentExtraction,
            r#"
            SELECT * FROM document_extractions
            WHERE document_id = $1
            ORDER BY created_at ASC
            "#,
            doc_id
        )
        .fetch_all(&self.pool)
        .await
        .map_err(|e| AppError::Internal(e.to_string()))
    }

    /// Human Officer Verification of Extracted Evidence Field
    pub async fn verify_extraction(
        &self,
        doc_id: Uuid,
        payload: ExtractionVerificationPayload,
        user: &AuthenticatedUser,
    ) -> Result<DocumentVerification, AppError> {
        // Enforce Officer RBAC
        let is_officer = user.roles.iter().any(|r| {
            r == "VERIFICATION_OFFICER"
                || r == "FIELD_OFFICIAL"
                || r == "DEPARTMENT_ADMIN"
                || r == "SUPER_ADMIN"
        });
        if !is_officer {
            return Err(AppError::Forbidden("Officer role required to verify document extractions.".into()));
        }

        // Fetch target extraction
        let extraction = sqlx::query_as!(
            DocumentExtraction,
            r#"SELECT * FROM document_extractions WHERE id = $1 AND document_id = $2"#,
            payload.extraction_id,
            doc_id
        )
        .fetch_optional(&self.pool)
        .await
        .map_err(|e| AppError::Internal(e.to_string()))?
        .ok_or_else(|| AppError::NotFound("Extraction record not found".into()))?;

        let decision = VerificationDecision::from_str(&payload.decision);
        let new_status = match decision {
            VerificationDecision::Verified => ExtractionStatus::OfficerVerified,
            VerificationDecision::Rejected => ExtractionStatus::Rejected,
            VerificationDecision::Edited => ExtractionStatus::OfficerVerified,
            VerificationDecision::SourceVerified => ExtractionStatus::SourceVerified,
        };

        // If edited, update extraction normalized value while preserving original in verification trail
        if let Some(ref corrected) = payload.corrected_value {
            sqlx::query!(
                r#"
                UPDATE document_extractions
                SET value = $1, normalized_value = $2, status = $3
                WHERE id = $4
                "#,
                corrected,
                corrected.trim().to_lowercase(),
                new_status.as_str(),
                extraction.id
            )
            .execute(&self.pool)
            .await
            .map_err(|e| AppError::Internal(e.to_string()))?;
        } else {
            sqlx::query!(
                r#"
                UPDATE document_extractions
                SET status = $1
                WHERE id = $2
                "#,
                new_status.as_str(),
                extraction.id
            )
            .execute(&self.pool)
            .await
            .map_err(|e| AppError::Internal(e.to_string()))?;
        }

        // Record verification audit
        let verification = sqlx::query_as!(
            DocumentVerification,
            r#"
            INSERT INTO document_verifications (
                document_id, extraction_id, field, original_value, corrected_value,
                decision, verification_method, reason, verified_by
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
            "#,
            doc_id,
            extraction.id,
            extraction.field,
            extraction.value,
            payload.corrected_value,
            decision.as_str(),
            payload.verification_method.unwrap_or_else(|| "MANUAL_INSPECTION".to_string()),
            payload.reason,
            user.id
        )
        .fetch_one(&self.pool)
        .await
        .map_err(|e| AppError::Internal(e.to_string()))?;

        Ok(verification)
    }

    /// Case Evidence Pack Aggregator
    pub async fn get_case_evidence_pack(&self, case_id: Uuid, user: &AuthenticatedUser) -> Result<EvidencePack, AppError> {
        // Find application
        let app_row = sqlx::query!(
            r#"
            SELECT a.id, a.public_id, a.applicant_person_id, s.name as scheme_name, p.first_name, p.last_name
            FROM applications a
            JOIN schemes s ON s.id = a.scheme_id
            JOIN persons p ON p.id = a.applicant_person_id
            WHERE a.id = $1
            "#,
            case_id
        )
        .fetch_optional(&self.pool)
        .await
        .map_err(|e| AppError::Internal(e.to_string()))?
        .ok_or_else(|| AppError::NotFound("Case application not found".into()))?;

        let applicant_name = format!("{} {}", app_row.first_name, app_row.last_name);

        // Fetch associated documents (owner_id = case_id or applicant_person_id)
        let documents = sqlx::query_as!(
            Document,
            r#"
            SELECT * FROM documents
            WHERE (owner_id = $1 OR owner_id = $2) AND status != 'REVOKED'
            ORDER BY created_at DESC
            "#,
            case_id,
            app_row.applicant_person_id
        )
        .fetch_all(&self.pool)
        .await
        .map_err(|e| AppError::Internal(e.to_string()))?;

        let doc_ids: Vec<Uuid> = documents.iter().map(|d| d.id).collect();

        // Extractions
        let extractions = if !doc_ids.is_empty() {
            sqlx::query_as!(
                DocumentExtraction,
                r#"
                SELECT * FROM document_extractions
                WHERE document_id = ANY($1)
                ORDER BY created_at ASC
                "#,
                &doc_ids
            )
            .fetch_all(&self.pool)
            .await
            .unwrap_or_default()
        } else {
            Vec::new()
        };

        // Verifications
        let verifications = if !doc_ids.is_empty() {
            sqlx::query_as!(
                DocumentVerification,
                r#"
                SELECT * FROM document_verifications
                WHERE document_id = ANY($1)
                ORDER BY verified_at ASC
                "#,
                &doc_ids
            )
            .fetch_all(&self.pool)
            .await
            .unwrap_or_default()
        } else {
            Vec::new()
        };

        // Extract key query fields for matching and consistency
        let extracted_name = extractions.iter().find(|e| e.field == "NAME").map(|e| e.value.as_str());
        let extracted_dob = extractions.iter().find(|e| e.field == "DATE_OF_BIRTH").map(|e| e.normalized_value.as_str());
        let extracted_prop = extractions.iter().find(|e| e.field == "PROPERTY_ID").map(|e| e.value.as_str());
        let extracted_addr = extractions.iter().find(|e| e.field == "ADDRESS").map(|e| e.value.as_str());

        // Match Entities
        let entity_matches = DocumentMatcher::match_entities(
            &self.pool,
            extracted_name,
            extracted_dob,
            extracted_prop,
            extracted_addr,
        ).await?;

        // Authoritative Record comparison
        let person_record = sqlx::query!(
            r#"SELECT first_name, last_name, date_of_birth FROM persons WHERE id = $1"#,
            app_row.applicant_person_id
        )
        .fetch_optional(&self.pool)
        .await
        .unwrap_or(None);

        let rec_dob = person_record.as_ref().and_then(|p| p.date_of_birth.map(|d| d.format("%Y-%m-%d").to_string()));
        let rec_name = person_record.as_ref().map(|p| format!("{} {}", p.first_name, p.last_name));

        let consistency = ConsistencyEngine::evaluate_consistency(
            Some(case_id),
            doc_ids.first().copied().unwrap_or(case_id),
            extracted_name,
            extracted_dob,
            None,
            extracted_addr,
            rec_name.as_deref(),
            rec_dob.as_deref(),
            None,
            None,
            "Civil Registration Database (V2)",
        );

        // Grounded AI Summary
        let conflicts: Vec<String> = consistency.checks
            .iter()
            .filter(|c| c.result == "CONFLICT")
            .map(|c| c.explanation.clone())
            .collect();

        let fields_tuples: Vec<(String, String, f64)> = extractions
            .iter()
            .map(|e| (e.field.clone(), e.value.clone(), e.confidence))
            .collect();

        let ai_summary = if self.ai.is_enabled() {
            let doc_type = documents.first().map(|d| DocumentType::from_str(&d.document_type)).unwrap_or(DocumentType::Other);
            self.ai.generate_case_summary(
                &doc_type,
                &fields_tuples,
                &conflicts,
                entity_matches.person_matches.first().map(|p| p.full_name.as_str()),
                entity_matches.property_matches.first().map(|p| p.public_id.as_str()),
            ).await.ok().map(|s| s.summary_text)
        } else {
            None
        };

        let pack = EvidencePackBuilder::build_pack(
            case_id,
            app_row.public_id,
            app_row.scheme_name,
            applicant_name,
            documents,
            extractions,
            verifications,
            entity_matches,
            consistency,
            ai_summary,
        );

        Ok(pack)
    }

    /// Access Logging Helper
    async fn log_access(
        &self,
        document_id: Uuid,
        user_id: Option<Uuid>,
        action: AccessAction,
        purpose: AccessPurpose,
        ip_address: Option<String>,
        user_agent: Option<String>,
    ) -> Result<(), AppError> {
        sqlx::query!(
            r#"
            INSERT INTO document_access_logs (
                document_id, user_id, action, purpose, ip_address, user_agent
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            "#,
            document_id,
            user_id,
            action.as_str(),
            purpose.as_str(),
            ip_address,
            user_agent
        )
        .execute(&self.pool)
        .await
        .map_err(|e| AppError::Internal(format!("Failed to record document access log: {}", e)))?;

        Ok(())
    }

    /// Authorization Rule: User must own the entity or hold an officer role
    fn authorize_owner_access(user: &AuthenticatedUser, owner_type: &str, owner_id: Uuid) -> Result<(), AppError> {
        let is_privileged = user.roles.iter().any(|r| {
            r == "VERIFICATION_OFFICER"
                || r == "FIELD_OFFICIAL"
                || r == "DEPARTMENT_ADMIN"
                || r == "SUPER_ADMIN"
        });

        if is_privileged {
            return Ok(());
        }

        // Citizen check: owner_id must match citizen user ID
        if owner_type == "CITIZEN" || owner_type == "USER" {
            if owner_id != user.id {
                return Err(AppError::Forbidden("IDOR Violation: Citizens cannot upload or access documents belonging to other citizens.".into()));
            }
        }

        Ok(())
    }

    /// Authorization Rule: Check access to specific document
    fn authorize_document_access(user: &AuthenticatedUser, doc: &Document) -> Result<(), AppError> {
        let is_privileged = user.roles.iter().any(|r| {
            r == "VERIFICATION_OFFICER"
                || r == "FIELD_OFFICIAL"
                || r == "DEPARTMENT_ADMIN"
                || r == "SUPER_ADMIN"
                || r == "AUDITOR"
        });

        if is_privileged {
            return Ok(());
        }

        if doc.created_by != Some(user.id) && doc.owner_id != user.id {
            return Err(AppError::Forbidden(
                "IDOR Access Denied: You do not possess authorization to view this document.".into(),
            ));
        }

        Ok(())
    }
}
