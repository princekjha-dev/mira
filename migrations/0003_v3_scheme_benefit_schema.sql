-- ============================================================================
-- MIRA V3 SCHEMA MIGRATION: SCHEMES, RULES, APPLICATIONS, BENEFITS & SCOPE
-- ============================================================================

-- 1. Schemes table
CREATE TABLE IF NOT EXISTS schemes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id VARCHAR(32) NOT NULL UNIQUE,
    code VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    department VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('DRAFT', 'ACTIVE', 'SUSPENDED', 'RETIRED')),
    scope VARCHAR(32) NOT NULL CHECK (scope IN ('INDIVIDUAL', 'HOUSEHOLD', 'PROPERTY', 'COMPOSITE')),
    effective_during daterange NOT NULL DEFAULT daterange(CURRENT_DATE, NULL, '[)'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_schemes_code ON schemes(code);
CREATE INDEX IF NOT EXISTS idx_schemes_scope ON schemes(scope);
CREATE INDEX IF NOT EXISTS idx_schemes_status ON schemes(status);
CREATE INDEX IF NOT EXISTS idx_schemes_effective ON schemes USING gist (effective_during);

-- 2. Scheme Rules table
CREATE TABLE IF NOT EXISTS scheme_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scheme_id UUID NOT NULL REFERENCES schemes(id) ON DELETE CASCADE,
    rule_type VARCHAR(64) NOT NULL CHECK (rule_type IN (
        'AGE_MIN',
        'AGE_MAX',
        'GENDER',
        'HOUSEHOLD_SIZE_MIN',
        'HOUSEHOLD_SIZE_MAX',
        'RESIDENCY_REQUIRED',
        'PROPERTY_REQUIRED',
        'INCOME_MAX',
        'BENEFIT_HISTORY_REQUIRED',
        'BENEFIT_HISTORY_PROHIBITED'
    )),
    operator VARCHAR(32) NOT NULL CHECK (operator IN ('>=', '<=', '=', '!=', 'IN', 'NOT IN', 'EXISTS', 'NOT EXISTS')),
    value TEXT NOT NULL,
    priority INT NOT NULL DEFAULT 1,
    effective_during daterange NOT NULL DEFAULT daterange(CURRENT_DATE, NULL, '[)'),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_scheme_rules_scheme ON scheme_rules(scheme_id);
CREATE INDEX IF NOT EXISTS idx_scheme_rules_type ON scheme_rules(rule_type);

-- 3. Applications table
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id VARCHAR(32) NOT NULL UNIQUE,
    application_number VARCHAR(64) NOT NULL UNIQUE,
    scheme_id UUID NOT NULL REFERENCES schemes(id) ON DELETE RESTRICT,
    applicant_person_id UUID NOT NULL REFERENCES persons(id) ON DELETE RESTRICT,
    target_person_id UUID REFERENCES persons(id) ON DELETE RESTRICT,
    target_household_id UUID REFERENCES households(id) ON DELETE RESTRICT,
    target_property_id UUID REFERENCES properties(id) ON DELETE RESTRICT,
    submitted_at TIMESTAMPTZ,
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT' CHECK (status IN (
        'DRAFT',
        'SUBMITTED',
        'UNDER_VERIFICATION',
        'APPROVED',
        'REJECTED',
        'WITHDRAWN',
        'DISBURSED'
    )),
    current_stage VARCHAR(64) NOT NULL DEFAULT 'INITIAL_SUBMISSION',
    application_date DATE NOT NULL DEFAULT CURRENT_DATE,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_applications_scheme ON applications(scheme_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant ON applications(applicant_person_id);
CREATE INDEX IF NOT EXISTS idx_applications_target_household ON applications(target_household_id);
CREATE INDEX IF NOT EXISTS idx_applications_target_property ON applications(target_property_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_date ON applications(application_date);

-- 4. Eligibility Assessments table
CREATE TABLE IF NOT EXISTS eligibility_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    result VARCHAR(32) NOT NULL CHECK (result IN ('ELIGIBLE', 'INELIGIBLE', 'INDETERMINATE', 'REQUIRES_REVIEW')),
    evaluated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    engine_version VARCHAR(32) NOT NULL DEFAULT 'v3.0.0-deterministic',
    summary TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_eligibility_assessments_app ON eligibility_assessments(application_id);

-- 5. Eligibility Rule Results table
CREATE TABLE IF NOT EXISTS eligibility_rule_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES eligibility_assessments(id) ON DELETE CASCADE,
    rule_id UUID REFERENCES scheme_rules(id) ON DELETE SET NULL,
    rule_type VARCHAR(64) NOT NULL,
    result VARCHAR(32) NOT NULL CHECK (result IN ('PASS', 'FAIL', 'INDETERMINATE', 'REQUIRES_REVIEW')),
    actual_value TEXT,
    expected_value TEXT NOT NULL,
    explanation TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rule_results_assessment ON eligibility_rule_results(assessment_id);

-- 6. Benefits table
CREATE TABLE IF NOT EXISTS benefits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id VARCHAR(32) NOT NULL UNIQUE,
    scheme_id UUID NOT NULL REFERENCES schemes(id) ON DELETE RESTRICT,
    application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
    benefit_unit_type VARCHAR(32) NOT NULL CHECK (benefit_unit_type IN ('PERSON', 'HOUSEHOLD', 'PROPERTY')),
    person_id UUID REFERENCES persons(id) ON DELETE RESTRICT,
    household_id UUID REFERENCES households(id) ON DELETE RESTRICT,
    property_id UUID REFERENCES properties(id) ON DELETE RESTRICT,
    status VARCHAR(32) NOT NULL DEFAULT 'APPROVED' CHECK (status IN (
        'APPROVED',
        'DISBURSED',
        'CANCELLED',
        'EXPIRED',
        'REVOKED'
    )),
    approved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    disbursed_at TIMESTAMPTZ,
    effective_during daterange NOT NULL DEFAULT daterange(CURRENT_DATE, NULL, '[)'),
    valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_to DATE,
    amount NUMERIC(14, 2),
    currency VARCHAR(16) DEFAULT 'INR',
    quantity INT,
    unit VARCHAR(64),
    description TEXT,
    source_id UUID REFERENCES source_records(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT chk_benefit_unit_integrity CHECK (
        (benefit_unit_type = 'PERSON' AND person_id IS NOT NULL) OR
        (benefit_unit_type = 'HOUSEHOLD' AND household_id IS NOT NULL) OR
        (benefit_unit_type = 'PROPERTY' AND property_id IS NOT NULL)
    )
);

CREATE INDEX IF NOT EXISTS idx_benefits_scheme ON benefits(scheme_id);
CREATE INDEX IF NOT EXISTS idx_benefits_person ON benefits(person_id);
CREATE INDEX IF NOT EXISTS idx_benefits_household ON benefits(household_id);
CREATE INDEX IF NOT EXISTS idx_benefits_property ON benefits(property_id);
CREATE INDEX IF NOT EXISTS idx_benefits_unit_type ON benefits(benefit_unit_type);
CREATE INDEX IF NOT EXISTS idx_benefits_status ON benefits(status);
CREATE INDEX IF NOT EXISTS idx_benefits_effective ON benefits USING gist (effective_during);

-- 7. Benefit Events table (State changes / historical disbursements)
CREATE TABLE IF NOT EXISTS benefit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    benefit_id UUID NOT NULL REFERENCES benefits(id) ON DELETE CASCADE,
    event_type VARCHAR(64) NOT NULL CHECK (event_type IN (
        'APPROVED',
        'DISBURSED',
        'PARTIALLY_DISBURSED',
        'SUSPENDED',
        'REACTIVATED',
        'CANCELLED',
        'EXPIRED',
        'REVOKED'
    )),
    effective_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    source_id UUID REFERENCES source_records(id) ON DELETE SET NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_benefit_events_benefit ON benefit_events(benefit_id);

-- 8. Benefit Assets table (Connecting benefits to physical infrastructure)
CREATE TABLE IF NOT EXISTS benefit_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    benefit_id UUID NOT NULL REFERENCES benefits(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE RESTRICT,
    asset_role VARCHAR(64) NOT NULL DEFAULT 'PHYSICAL_ASSET',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_benefit_assets_benefit ON benefit_assets(benefit_id);
CREATE INDEX IF NOT EXISTS idx_benefit_assets_property ON benefit_assets(property_id);
