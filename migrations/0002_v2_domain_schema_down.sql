-- Reversible down migration for MIRA V2 schema
DROP TABLE IF EXISTS life_events;
DROP TABLE IF EXISTS property_associations;
DROP TABLE IF EXISTS properties;
DROP TABLE IF EXISTS person_relationships;
DROP TABLE IF EXISTS household_memberships;
DROP TABLE IF EXISTS households;
DROP TABLE IF EXISTS person_identifiers;
DROP TABLE IF EXISTS persons;
DROP TABLE IF EXISTS source_records;
