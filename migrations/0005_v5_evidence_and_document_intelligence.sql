-- ============================================================================
-- MIRA V5 SCHEMA MIGRATION: DOCUMENT INTELLIGENCE, EVIDENCE & PRIVACY
-- ============================================================================

-- 1. Documents Table
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id VARCHAR(64) NOT NULL UNIQUE,
    owner_type VARCHAR(64) NOT NULL,
    owner_id UUID NOT NULL,
    document_type VARCHAR(64) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    detected_mime_type VARCHAR(128) NOT NULL,
    size_bytes BIGINT NOT NULL,
    sha256 VARCHAR(64) NOT NULL,
    storage_reference VARCHAR(512) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'UPLOADED' CHECK (status IN (
        'UPLOADED',
        'PROCESSING',
        'READY',
        'FAILED',
        'QUARANTINED',
        'REVOKED'
    )),
    retention_policy VARCHAR(64) NOT NULL DEFAULT 'STANDARD_AUDIT',
    retention_until TIMESTAMPTZ,
    legal_hold BOOLEAN NOT NULL DEFAULT FALSE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_documents_public_id ON documents(public_id);
CREATE INDEX IF NOT EXISTS idx_documents_owner ON documents(owner_type, owner_id);
CREATE INDEX IF NOT EXISTS idx_documents_sha256 ON documents(sha256);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_created_by ON documents(created_by);

-- 2. Document Versions Table (Lossless vs Lossy Optimization & Derived Representations)
CREATE TABLE IF NOT EXISTS document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    version_type VARCHAR(32) NOT NULL CHECK (version_type IN (
        'ORIGINAL',
        'OPTIMIZED',
        'PREVIEW',
        'OCR_DERIVATIVE'
    )),
    storage_reference VARCHAR(512) NOT NULL,
    mime_type VARCHAR(128) NOT NULL,
    size_bytes BIGINT NOT NULL,
    sha256 VARCHAR(64) NOT NULL,
    compression_type VARCHAR(32) NOT NULL DEFAULT 'LOSSLESS' CHECK (compression_type IN (
        'NONE',
        'LOSSLESS',
        'LOSSY'
    )),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_doc_versions_doc_id ON document_versions(document_id);
CREATE INDEX IF NOT EXISTS idx_doc_versions_type ON document_versions(version_type);

-- 3. Document Access Audit Logs (Mandatory Purpose Limitation)
CREATE TABLE IF NOT EXISTS document_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(32) NOT NULL CHECK (action IN (
        'VIEW',
        'DOWNLOAD',
        'PREVIEW',
        'PROCESS',
        'SHARE',
        'REVOKE'
    )),
    purpose VARCHAR(64) NOT NULL CHECK (purpose IN (
        'APPLICATION_VERIFICATION',
        'DUPLICATE_REVIEW',
        'ELIGIBILITY_REVIEW',
        'AUDIT',
        'CITIZEN_SELF_SERVICE'
    )),
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_doc_access_doc_id ON document_access_logs(document_id);
CREATE INDEX IF NOT EXISTS idx_doc_access_user_id ON document_access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_doc_access_purpose ON document_access_logs(purpose);
CREATE INDEX IF NOT EXISTS idx_doc_access_timestamp ON document_access_logs(timestamp DESC);

-- 4. Document Processing Jobs (Asynchronous Tracking & Retry Policy)
CREATE TABLE IF NOT EXISTS document_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    job_type VARCHAR(32) NOT NULL CHECK (job_type IN (
        'SCAN',
        'OCR',
        'EXTRACTION',
        'CLASSIFICATION',
        'OPTIMIZATION'
    )),
    status VARCHAR(32) NOT NULL DEFAULT 'QUEUED' CHECK (status IN (
        'QUEUED',
        'PROCESSING',
        'COMPLETED',
        'FAILED',
        'REQUIRES_REVIEW'
    )),
    attempts INT NOT NULL DEFAULT 0,
    error_code VARCHAR(64),
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_doc_jobs_doc_id ON document_jobs(document_id);
CREATE INDEX IF NOT EXISTS idx_doc_jobs_status ON document_jobs(status);

-- 5. OCR Results Table (Immutable Raw Extraction with Quality Signals)
CREATE TABLE IF NOT EXISTS ocr_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    provider VARCHAR(64) NOT NULL,
    provider_version VARCHAR(32) NOT NULL,
    language VARCHAR(32) NOT NULL DEFAULT 'en',
    text TEXT NOT NULL,
    confidence DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    quality_warning TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ocr_results_doc_id ON ocr_results(document_id);

-- 6. Document Extractions Table (Normalized Structured Fields + Bounding Box Provenance)
CREATE TABLE IF NOT EXISTS document_extractions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    field VARCHAR(64) NOT NULL,
    value TEXT NOT NULL,
    normalized_value TEXT NOT NULL,
    confidence DOUBLE PRECISION NOT NULL DEFAULT 0.90,
    source_region JSONB NOT NULL DEFAULT '{}'::jsonb,
    extraction_method VARCHAR(64) NOT NULL DEFAULT 'DETERMINISTIC_SCHEMA',
    status VARCHAR(32) NOT NULL DEFAULT 'SYSTEM_EXTRACTED' CHECK (status IN (
        'UNVERIFIED',
        'SYSTEM_EXTRACTED',
        'OFFICER_VERIFIED',
        'SOURCE_VERIFIED',
        'CONFLICTING',
        'REJECTED'
    )),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_doc_extractions_doc_id ON document_extractions(document_id);
CREATE INDEX IF NOT EXISTS idx_doc_extractions_field ON document_extractions(field);
CREATE INDEX IF NOT EXISTS idx_doc_extractions_status ON document_extractions(status);

-- 7. Document Verifications Table (Human Officer Verification Trail)
CREATE TABLE IF NOT EXISTS document_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    extraction_id UUID REFERENCES document_extractions(id) ON DELETE SET NULL,
    field VARCHAR(64) NOT NULL,
    original_value TEXT NOT NULL,
    corrected_value TEXT,
    decision VARCHAR(32) NOT NULL CHECK (decision IN (
        'VERIFIED',
        'REJECTED',
        'EDITED',
        'SOURCE_VERIFIED'
    )),
    verification_method VARCHAR(64) NOT NULL DEFAULT 'MANUAL_INSPECTION' CHECK (verification_method IN (
        'OFFICIAL_SOURCE',
        'MANUAL_INSPECTION',
        'AUTHORIZED_API',
        'OTHER'
    )),
    reason TEXT,
    verified_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    verified_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_doc_verifications_doc_id ON document_verifications(document_id);
CREATE INDEX IF NOT EXISTS idx_doc_verifications_officer ON document_verifications(verified_by);

-- 8. Document Consistency Checks Table (Cross-Document Anomaly & Conflict Signals)
CREATE TABLE IF NOT EXISTS document_consistency_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    check_type VARCHAR(64) NOT NULL CHECK (check_type IN (
        'DOB_CONFLICT',
        'NAME_VARIATION',
        'ADDRESS_CONFLICT',
        'PARENT_CONFLICT',
        'PROPERTY_CONFLICT',
        'SCHEME_CONFLICT',
        'DATE_CONFLICT',
        'TEMPORAL_INCONSISTENCY'
    )),
    field VARCHAR(64) NOT NULL,
    result VARCHAR(32) NOT NULL CHECK (result IN (
        'PASS',
        'CONFLICT',
        'INSUFFICIENT_DATA',
        'NOT_APPLICABLE'
    )),
    source_a_label VARCHAR(128) NOT NULL,
    source_a_value TEXT,
    source_b_label VARCHAR(128) NOT NULL,
    source_b_value TEXT,
    action_recommended VARCHAR(64) NOT NULL DEFAULT 'MANUAL_VERIFICATION_REQUIRED',
    explanation TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_doc_consistency_case_id ON document_consistency_checks(case_id);
CREATE INDEX IF NOT EXISTS idx_doc_consistency_doc_id ON document_consistency_checks(document_id);
CREATE INDEX IF NOT EXISTS idx_doc_consistency_result ON document_consistency_checks(result);
