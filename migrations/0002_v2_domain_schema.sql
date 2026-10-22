-- MIRA V2 — Person, Household, Temporal Family Graph Schema

-- 1. Source Records (Provenance infrastructure)
CREATE TABLE IF NOT EXISTS source_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_type VARCHAR(64) NOT NULL,
    source_reference VARCHAR(255) NOT NULL,
    source_name VARCHAR(255) NOT NULL,
    reliability VARCHAR(32) NOT NULL DEFAULT 'HIGH',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Persons
CREATE TABLE IF NOT EXISTS persons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id VARCHAR(64) NOT NULL UNIQUE,
    first_name VARCHAR(128) NOT NULL,
    middle_name VARCHAR(128),
    last_name VARCHAR(128) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(32),
    phone VARCHAR(32),
    email VARCHAR(255),
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_person_status CHECK (status IN ('ACTIVE', 'DECEASED', 'UNKNOWN'))
);

-- 3. Person Identifiers (Generic synthetic identifier model)
CREATE TABLE IF NOT EXISTS person_identifiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    identifier_type VARCHAR(64) NOT NULL,
    identifier_reference VARCHAR(255) NOT NULL,
    source_id UUID REFERENCES source_records(id) ON DELETE SET NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Households (Logical administrative grouping)
CREATE TABLE IF NOT EXISTS households (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_household_status CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

-- 5. Household Memberships (Temporal model with bitemporal dates & daterange)
CREATE TABLE IF NOT EXISTS household_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    household_id UUID NOT NULL REFERENCES households(id) ON DELETE CASCADE,
    person_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    membership_role VARCHAR(64) NOT NULL DEFAULT 'OTHER',
    valid_from DATE NOT NULL,
    valid_to DATE,
    valid_during DATERANGE GENERATED ALWAYS AS (daterange(valid_from, valid_to, '[)')) STORED,
    source_id UUID REFERENCES source_records(id) ON DELETE SET NULL,
    verification_status VARCHAR(32) NOT NULL DEFAULT 'UNVERIFIED',
    confidence NUMERIC(3, 2) NOT NULL DEFAULT 1.00,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_membership_role CHECK (membership_role IN ('HEAD', 'SPOUSE', 'CHILD', 'PARENT', 'SIBLING', 'DEPENDENT', 'OTHER')),
    CONSTRAINT chk_membership_verification CHECK (verification_status IN ('UNVERIFIED', 'VERIFIED', 'DISPUTED', 'REJECTED')),
    CONSTRAINT chk_membership_dates CHECK (valid_to IS NULL OR valid_to > valid_from)
);

-- 6. Family Relationships (Directional with inverse resolution)
CREATE TABLE IF NOT EXISTS person_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_a_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    person_b_id UUID NOT NULL REFERENCES persons(id) ON DELETE CASCADE,
    relationship_type VARCHAR(64) NOT NULL,
    valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_to DATE,
    valid_during DATERANGE GENERATED ALWAYS AS (daterange(valid_from, valid_to, '[)')) STORED,
    source_id UUID REFERENCES source_records(id) ON DELETE SET NULL,
    verification_status VARCHAR(32) NOT NULL DEFAULT 'UNVERIFIED',
    confidence NUMERIC(3, 2) NOT NULL DEFAULT 1.00,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    updated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_rel_not_self CHECK (person_a_id != person_b_id),
    CONSTRAINT chk_rel_type CHECK (relationship_type IN ('PARENT', 'CHILD', 'SPOUSE', 'SIBLING', 'GUARDIAN', 'DEPENDENT')),
    CONSTRAINT chk_rel_verification CHECK (verification_status IN ('UNVERIFIED', 'VERIFIED', 'DISPUTED', 'REJECTED')),
    CONSTRAINT chk_rel_dates CHECK (valid_to IS NULL OR valid_to > valid_from)
);

-- 7. Properties / Assets
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_id VARCHAR(64) NOT NULL UNIQUE,
    property_type VARCHAR(64) NOT NULL DEFAULT 'HOUSE',
    address_line VARCHAR(255) NOT NULL,
    locality VARCHAR(128),
    district VARCHAR(128),
    state VARCHAR(128),
    postal_code VARCHAR(32),
    latitude NUMERIC(9, 6),
    longitude NUMERIC(9, 6),
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_prop_type CHECK (property_type IN ('HOUSE', 'LAND', 'APARTMENT', 'TOILET', 'WATER_CONNECTION', 'OTHER')),
    CONSTRAINT chk_prop_status CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

-- 8. Property Associations (Occupancy vs Ownership)
CREATE TABLE IF NOT EXISTS property_associations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    person_id UUID REFERENCES persons(id) ON DELETE CASCADE,
    household_id UUID REFERENCES households(id) ON DELETE CASCADE,
    association_type VARCHAR(64) NOT NULL,
    valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_to DATE,
    valid_during DATERANGE GENERATED ALWAYS AS (daterange(valid_from, valid_to, '[)')) STORED,
    source_id UUID REFERENCES source_records(id) ON DELETE SET NULL,
    verification_status VARCHAR(32) NOT NULL DEFAULT 'UNVERIFIED',
    confidence NUMERIC(3, 2) NOT NULL DEFAULT 1.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_prop_assoc_target CHECK (person_id IS NOT NULL OR household_id IS NOT NULL),
    CONSTRAINT chk_prop_assoc_type CHECK (association_type IN ('HOUSEHOLD_OCCUPIES', 'PERSON_OWNS', 'HOUSEHOLD_OWNS', 'PERSON_RESIDES_AT')),
    CONSTRAINT chk_prop_assoc_verification CHECK (verification_status IN ('UNVERIFIED', 'VERIFIED', 'DISPUTED', 'REJECTED')),
    CONSTRAINT chk_prop_assoc_dates CHECK (valid_to IS NULL OR valid_to > valid_from)
);

-- 9. Life Events (Temporal event log influencing household history)
CREATE TABLE IF NOT EXISTS life_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(64) NOT NULL,
    person_id UUID REFERENCES persons(id) ON DELETE SET NULL,
    household_id UUID REFERENCES households(id) ON DELETE SET NULL,
    effective_date DATE NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    source_id UUID REFERENCES source_records(id) ON DELETE SET NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_life_event_type CHECK (event_type IN ('BIRTH', 'MARRIAGE', 'DEATH', 'HOUSEHOLD_SEPARATION', 'HOUSEHOLD_MERGE', 'MOVE'))
);

-- Indexes for high-performance temporal queries and joins
CREATE INDEX IF NOT EXISTS idx_persons_public_id ON persons(public_id);
CREATE INDEX IF NOT EXISTS idx_persons_status ON persons(status);
CREATE INDEX IF NOT EXISTS idx_person_identifiers_person_id ON person_identifiers(person_id);

CREATE INDEX IF NOT EXISTS idx_households_public_id ON households(public_id);
CREATE INDEX IF NOT EXISTS idx_households_status ON households(status);

CREATE INDEX IF NOT EXISTS idx_memberships_household ON household_memberships(household_id);
CREATE INDEX IF NOT EXISTS idx_memberships_person ON household_memberships(person_id);
CREATE INDEX IF NOT EXISTS idx_memberships_dates ON household_memberships(valid_from, valid_to);
CREATE INDEX IF NOT EXISTS idx_memberships_range ON household_memberships USING GIST (valid_during);

CREATE INDEX IF NOT EXISTS idx_rel_person_a ON person_relationships(person_a_id);
CREATE INDEX IF NOT EXISTS idx_rel_person_b ON person_relationships(person_b_id);
CREATE INDEX IF NOT EXISTS idx_rel_range ON person_relationships USING GIST (valid_during);

CREATE INDEX IF NOT EXISTS idx_properties_public_id ON properties(public_id);
CREATE INDEX IF NOT EXISTS idx_prop_assoc_property ON property_associations(property_id);
CREATE INDEX IF NOT EXISTS idx_prop_assoc_person ON property_associations(person_id);
CREATE INDEX IF NOT EXISTS idx_prop_assoc_household ON property_associations(household_id);
CREATE INDEX IF NOT EXISTS idx_prop_assoc_range ON property_associations USING GIST (valid_during);

CREATE INDEX IF NOT EXISTS idx_life_events_person ON life_events(person_id);
CREATE INDEX IF NOT EXISTS idx_life_events_household ON life_events(household_id);
CREATE INDEX IF NOT EXISTS idx_life_events_date ON life_events(effective_date);
