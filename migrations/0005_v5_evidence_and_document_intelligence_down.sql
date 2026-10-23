-- ============================================================================
-- MIRA V5 SCHEMA MIGRATION DOWN: ROLLBACK DOCUMENT INTELLIGENCE
-- ============================================================================

DROP TABLE IF EXISTS document_consistency_checks CASCADE;
DROP TABLE IF EXISTS document_verifications CASCADE;
DROP TABLE IF EXISTS document_extractions CASCADE;
DROP TABLE IF EXISTS ocr_results CASCADE;
DROP TABLE IF EXISTS document_jobs CASCADE;
DROP TABLE IF EXISTS document_access_logs CASCADE;
DROP TABLE IF EXISTS document_versions CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
