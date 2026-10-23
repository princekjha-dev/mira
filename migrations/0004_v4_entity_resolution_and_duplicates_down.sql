-- Migration Down: 0004_v4_entity_resolution_and_duplicates_down.sql
DROP TABLE IF EXISTS benefit_duplicate_decisions CASCADE;
DROP TABLE IF EXISTS benefit_duplicate_evidence CASCADE;
DROP TABLE IF EXISTS benefit_duplicate_candidates CASCADE;
DROP TABLE IF EXISTS benefit_duplicate_cases CASCADE;

DROP TABLE IF EXISTS entity_resolution_decisions CASCADE;
DROP TABLE IF EXISTS entity_resolution_evidence CASCADE;
DROP TABLE IF EXISTS entity_resolution_candidates CASCADE;
DROP TABLE IF EXISTS entity_resolution_cases CASCADE;
DROP TABLE IF EXISTS matching_model_versions CASCADE;
