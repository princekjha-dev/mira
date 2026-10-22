-- Migration: 0004_v4_entity_resolution_and_duplicates.sql
-- Description: MIRA V4 - Entity Resolution, Explainable Duplicate Detection & Human Decisions
-- Author: Mira Platform Engineering

-- 1. Matching Model Configuration (Versioned & Centralized)
CREATE TABLE IF NOT EXISTS matching_model_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(128) NOT NULL,
    version VARCHAR(32) NOT NULL UNIQUE,
    strong_match_threshold DOUBLE PRECISION NOT NULL DEFAULT 0.85,
    possible_match_threshold DOUBLE PRECISION NOT NULL DEFAULT 0.60,
    non_match_threshold DOUBLE PRECISION NOT NULL DEFAULT 0.40,
    duplicate_high_threshold DOUBLE PRECISION NOT NULL DEFAULT 0.80,
    duplicate_review_threshold DOUBLE PRECISION NOT NULL DEFAULT 0.50,
    field_weights JSONB NOT NULL DEFAULT '{"name": 0.30, "date_of_birth": 0.25, "parent_name": 0.15, "address": 0.10, "household": 0.10, "phone": 0.05, "gender": 0.05}'::jsonb,
    blocking_strategies JSONB NOT NULL DEFAULT '["NAME_PREFIX_DOB_YEAR", "NAME_PREFIX_DISTRICT", "PHONE_SUFFIX"]'::jsonb,
    normalization_version VARCHAR(32) NOT NULL DEFAULT 'v4.0.0-unicode-translit',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- 2. Entity Resolution Cases
CREATE TABLE IF NOT EXISTS entity_resolution_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id VARCHAR(64) NOT NULL UNIQUE,
    entity_type VARCHAR(32) NOT NULL,
    source_entity_id UUID NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'OPEN',
    priority VARCHAR(16) NOT NULL DEFAULT 'MEDIUM',
    matching_model_version VARCHAR(32) NOT NULL DEFAULT 'v4.0.0',
    summary TEXT,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    resolution VARCHAR(32),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_er_entity_type CHECK (entity_type IN ('PERSON', 'HOUSEHOLD', 'PROPERTY')),
    CONSTRAINT chk_er_status CHECK (status IN ('OPEN', 'UNDER_REVIEW', 'RESOLVED_MATCH', 'RESOLVED_NON_MATCH', 'RESOLVED_UNCERTAIN', 'CANCELLED')),
    CONSTRAINT chk_er_priority CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
    CONSTRAINT chk_er_resolution CHECK (resolution IS NULL OR resolution IN ('MATCH', 'NON_MATCH', 'UNCERTAIN'))
);

-- 3. Entity Resolution Candidates
CREATE TABLE IF NOT EXISTS entity_resolution_candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES entity_resolution_cases(id) ON DELETE CASCADE,
    candidate_entity_id UUID NOT NULL,
    candidate_rank INT NOT NULL DEFAULT 1,
    overall_assessment VARCHAR(32) NOT NULL,
    confidence_score DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    support_score DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    contradiction_penalty DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    hard_contradiction_detected BOOLEAN NOT NULL DEFAULT FALSE,
    summary TEXT NOT NULL,
    why_flagged TEXT,
    why_not_confident TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_erc_assessment CHECK (overall_assessment IN ('STRONG_MATCH', 'POSSIBLE_MATCH', 'WEAK_MATCH', 'LIKELY_NON_MATCH', 'UNCERTAIN'))
);

-- 4. Entity Resolution Evidence
CREATE TABLE IF NOT EXISTS entity_resolution_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES entity_resolution_candidates(id) ON DELETE CASCADE,
    field VARCHAR(64) NOT NULL,
    source_value TEXT,
    candidate_value TEXT,
    comparison_method VARCHAR(64) NOT NULL,
    comparison_result VARCHAR(32) NOT NULL,
    similarity DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    weight DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    direction VARCHAR(32) NOT NULL,
    explanation TEXT NOT NULL,
    source_provenance_id UUID REFERENCES source_records(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_ere_direction CHECK (direction IN ('SUPPORTS_MATCH', 'CONTRADICTS_MATCH', 'NEUTRAL'))
);

-- 5. Entity Resolution Human Decisions (Immutable Trail)
CREATE TABLE IF NOT EXISTS entity_resolution_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES entity_resolution_cases(id) ON DELETE CASCADE,
    decision VARCHAR(32) NOT NULL,
    reason VARCHAR(64) NOT NULL,
    notes TEXT,
    evidence_reference JSONB,
    decided_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    decided_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_erd_decision CHECK (decision IN ('MATCH', 'NON_MATCH', 'UNCERTAIN'))
);

-- 6. Benefit Duplicate Cases
CREATE TABLE IF NOT EXISTS benefit_duplicate_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id VARCHAR(64) NOT NULL UNIQUE,
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    scheme_id UUID NOT NULL REFERENCES schemes(id) ON DELETE RESTRICT,
    benefit_scope VARCHAR(32) NOT NULL,
    benefit_unit_type VARCHAR(32) NOT NULL,
    person_id UUID REFERENCES persons(id) ON DELETE SET NULL,
    household_id UUID REFERENCES households(id) ON DELETE SET NULL,
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'OPEN',
    priority VARCHAR(16) NOT NULL DEFAULT 'MEDIUM',
    assessment VARCHAR(32) NOT NULL DEFAULT 'POTENTIAL_DUPLICATE',
    rules_version VARCHAR(32) NOT NULL DEFAULT 'duplicate-v4.0.0',
    reason TEXT NOT NULL,
    recommended_action VARCHAR(64) NOT NULL DEFAULT 'MANUAL_REVIEW',
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    final_decision VARCHAR(32),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_bdc_scope CHECK (benefit_scope IN ('INDIVIDUAL', 'HOUSEHOLD', 'PROPERTY', 'COMPOSITE')),
    CONSTRAINT chk_bdc_unit_type CHECK (benefit_unit_type IN ('PERSON', 'HOUSEHOLD', 'PROPERTY')),
    CONSTRAINT chk_bdc_status CHECK (status IN ('OPEN', 'UNDER_REVIEW', 'RESOLVED_DUPLICATE', 'RESOLVED_NOT_DUPLICATE', 'RESOLVED_MORE_EVIDENCE', 'CANCELLED')),
    CONSTRAINT chk_bdc_priority CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')),
    CONSTRAINT chk_bdc_assessment CHECK (assessment IN ('EXACT_DUPLICATE', 'LIKELY_DUPLICATE', 'POTENTIAL_DUPLICATE', 'NOT_DUPLICATE', 'INSUFFICIENT_INFORMATION')),
    CONSTRAINT chk_bdc_final_decision CHECK (final_decision IS NULL OR final_decision IN ('CONFIRMED_DUPLICATE', 'NOT_DUPLICATE', 'REQUIRES_MORE_EVIDENCE'))
);

-- 7. Benefit Duplicate Candidates (Matched Existing Benefits)
CREATE TABLE IF NOT EXISTS benefit_duplicate_candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES benefit_duplicate_cases(id) ON DELETE CASCADE,
    existing_benefit_id UUID NOT NULL REFERENCES benefits(id) ON DELETE CASCADE,
    candidate_rank INT NOT NULL DEFAULT 1,
    duplicate_category VARCHAR(32) NOT NULL,
    overlap_score DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    explanation TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_bdcand_category CHECK (duplicate_category IN ('EXACT_DUPLICATE', 'LIKELY_DUPLICATE', 'POTENTIAL_DUPLICATE', 'NOT_DUPLICATE'))
);

-- 8. Benefit Duplicate Evidence
CREATE TABLE IF NOT EXISTS benefit_duplicate_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES benefit_duplicate_candidates(id) ON DELETE CASCADE,
    field VARCHAR(64) NOT NULL,
    source_value TEXT,
    existing_value TEXT,
    result VARCHAR(32) NOT NULL,
    weight DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    explanation TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_bde_result CHECK (result IN ('SUPPORTS_MATCH', 'CONTRADICTS_MATCH', 'NEUTRAL'))
);

-- 9. Benefit Duplicate Human Decisions (Immutable Audit Trail)
CREATE TABLE IF NOT EXISTS benefit_duplicate_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES benefit_duplicate_cases(id) ON DELETE CASCADE,
    decision VARCHAR(32) NOT NULL,
    reason VARCHAR(64) NOT NULL,
    explanation TEXT,
    evidence_reference JSONB,
    decided_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    decided_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_bdd_decision CHECK (decision IN ('CONFIRMED_DUPLICATE', 'NOT_DUPLICATE', 'REQUIRES_MORE_EVIDENCE'))
);

-- 10. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_er_cases_status ON entity_resolution_cases(status, priority);
CREATE INDEX IF NOT EXISTS idx_er_cases_source ON entity_resolution_cases(entity_type, source_entity_id);
CREATE INDEX IF NOT EXISTS idx_er_candidates_case ON entity_resolution_candidates(case_id);
CREATE INDEX IF NOT EXISTS idx_er_candidates_target ON entity_resolution_candidates(candidate_entity_id);
CREATE INDEX IF NOT EXISTS idx_er_evidence_cand ON entity_resolution_evidence(candidate_id);

CREATE INDEX IF NOT EXISTS idx_bdc_status ON benefit_duplicate_cases(status, priority);
CREATE INDEX IF NOT EXISTS idx_bdc_app ON benefit_duplicate_cases(application_id);
CREATE INDEX IF NOT EXISTS idx_bdc_scheme_scope ON benefit_duplicate_cases(scheme_id, benefit_scope);
CREATE INDEX IF NOT EXISTS idx_bdc_units ON benefit_duplicate_cases(benefit_unit_type, person_id, household_id, property_id);
CREATE INDEX IF NOT EXISTS idx_bd_candidates_case ON benefit_duplicate_candidates(case_id);
CREATE INDEX IF NOT EXISTS idx_bd_candidates_benefit ON benefit_duplicate_candidates(existing_benefit_id);
CREATE INDEX IF NOT EXISTS idx_bd_evidence_cand ON benefit_duplicate_evidence(candidate_id);
