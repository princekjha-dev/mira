-- Extend the existing V5 document system with immutable user-facing versions.
ALTER TABLE documents
    ADD COLUMN IF NOT EXISTS supersedes_document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS version_number INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN IF NOT EXISTS verification_status VARCHAR(32) NOT NULL DEFAULT 'PENDING_REVIEW',
    ADD COLUMN IF NOT EXISTS original_size_bytes BIGINT NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

UPDATE documents SET original_size_bytes = size_bytes WHERE original_size_bytes = 0;

CREATE INDEX IF NOT EXISTS idx_documents_supersedes ON documents(supersedes_document_id);

CREATE TABLE IF NOT EXISTS application_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE RESTRICT,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE RESTRICT,
    document_version_id UUID NOT NULL REFERENCES documents(id) ON DELETE RESTRICT,
    required_type VARCHAR(128) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'LINKED',
    linked_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    linked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(application_id, document_id, document_version_id)
);

CREATE INDEX IF NOT EXISTS idx_application_documents_application ON application_documents(application_id);
CREATE INDEX IF NOT EXISTS idx_application_documents_document ON application_documents(document_id);
