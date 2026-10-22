export interface OrganizationSummary {
  id: string;
  name: string;
  code: string;
}

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  preferred_language: string;
  roles: string[];
  organization: OrganizationSummary | null;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  token_type: string;
  user: UserProfile;
}

export interface SystemStatus {
  status: string;
  api_version: string;
  database_connected: boolean;
  auth_system: string;
  environment: string;
  timestamp: string;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    request_id?: string;
  };
}

export interface AuditEvent {
  id: string;
  event_type: string;
  user_id: string | null;
  organization_id: string | null;
  request_id: string;
  ip_address: string | null;
  details: Record<string, unknown>;
  created_at: string;
}

// ============================================================================
// V2 DOMAIN TYPES
// ============================================================================

export interface Person {
  id: string;
  public_id: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  date_of_birth?: string | null;
  gender: string;
  phone?: string | null;
  email?: string | null;
  status: 'ACTIVE' | 'DECEASED' | 'UNKNOWN';
  identity_type?: string | null;
  identity_last4?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Household {
  id: string;
  public_id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
  updated_at: string;
}

export interface HouseholdMembership {
  id: string;
  household_id: string;
  person_id: string;
  membership_role: 'HEAD' | 'SPOUSE' | 'CHILD' | 'PARENT' | 'SIBLING' | 'DEPENDENT' | 'OTHER';
  valid_from: string;
  valid_to?: string | null;
  source_id?: string | null;
  verification_status: 'UNVERIFIED' | 'VERIFIED' | 'DISPUTED' | 'REJECTED';
  confidence: number;
  person_name?: string | null;
  household_name?: string | null;
  created_at: string;
}

export interface PersonRelationship {
  id: string;
  person_a_id: string;
  person_b_id: string;
  relationship_type: 'PARENT' | 'CHILD' | 'SPOUSE' | 'SIBLING' | 'GUARDIAN' | 'DEPENDENT';
  valid_from: string;
  valid_to?: string | null;
  source_id?: string | null;
  verification_status: 'UNVERIFIED' | 'VERIFIED' | 'DISPUTED' | 'REJECTED';
  confidence: number;
  person_b_name?: string | null;
  person_b_public_id?: string | null;
  person_b_gender?: string | null;
  created_at: string;
}

export interface Property {
  id: string;
  public_id: string;
  property_type: 'HOUSE' | 'LAND' | 'APARTMENT' | 'TOILET' | 'WATER_CONNECTION' | 'OTHER';
  address_line: string;
  locality?: string | null;
  district: string;
  state: string;
  postal_code?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  status: string;
  created_at: string;
}

export interface PropertyAssociation {
  id: string;
  property_id: string;
  person_id?: string | null;
  household_id?: string | null;
  association_type: 'HOUSEHOLD_OCCUPIES' | 'PERSON_OWNS' | 'HOUSEHOLD_OWNS' | 'PERSON_RESIDES_AT';
  valid_from: string;
  valid_to?: string | null;
  source_id?: string | null;
  verification_status: 'UNVERIFIED' | 'VERIFIED' | 'DISPUTED' | 'REJECTED';
  confidence: number;
  property_type?: string | null;
  address_line?: string | null;
  district?: string | null;
}

export interface LifeEvent {
  id: string;
  event_type: 'BIRTH' | 'MARRIAGE' | 'DEATH' | 'HOUSEHOLD_SEPARATION' | 'HOUSEHOLD_MERGE' | 'MOVE';
  person_id?: string | null;
  household_id?: string | null;
  effective_date: string;
  recorded_at: string;
  source_id?: string | null;
  metadata?: Record<string, unknown>;
  created_by?: string | null;
}

export interface GraphNode {
  id: string;
  type: 'person' | 'household' | 'property';
  label: string;
  data: Record<string, unknown>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  label?: string | null;
  data?: Record<string, unknown>;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface HouseholdTimelineItem {
  id: string;
  date: string;
  event_type: string;
  title: string;
  description: string;
  source_name?: string | null;
  verification_status?: string | null;
  details?: Record<string, unknown>;
}

// ============================================================================
// MIRA V3 Types: Scheme, Benefit & Eligibility Intelligence
// ============================================================================

export type SchemeScope = 'INDIVIDUAL' | 'HOUSEHOLD' | 'PROPERTY' | 'COMPOSITE';
export type SchemeStatus = 'DRAFT' | 'ACTIVE' | 'SUSPENDED' | 'RETIRED';

export interface Scheme {
  id: string;
  public_id: string;
  code: string;
  name: string;
  description: string;
  department: string;
  status: SchemeStatus;
  scope: SchemeScope;
  effective_during?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  updated_by?: string | null;
}

export interface SchemeRule {
  id: string;
  scheme_id: string;
  rule_type: string;
  operator: string;
  value: string;
  priority: number;
  effective_during?: string | null;
  active: boolean;
  created_at: string;
}

export type ApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_VERIFICATION'
  | 'APPROVED'
  | 'REJECTED'
  | 'WITHDRAWN'
  | 'DISBURSED';

export interface Application {
  id: string;
  public_id: string;
  application_number: string;
  scheme_id: string;
  scheme_name?: string | null;
  scheme_code?: string | null;
  scheme_scope?: SchemeScope | null;
  applicant_person_id: string;
  applicant_name?: string | null;
  target_person_id?: string | null;
  target_household_id?: string | null;
  target_property_id?: string | null;
  target_label?: string | null;
  submitted_at?: string | null;
  status: ApplicationStatus;
  current_stage: string;
  application_date: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
}

export type BenefitUnitType = 'PERSON' | 'HOUSEHOLD' | 'PROPERTY';

export type AssessmentResultType = 'ELIGIBLE' | 'INELIGIBLE' | 'INDETERMINATE' | 'REQUIRES_REVIEW';

export interface EligibilityRuleResult {
  id: string;
  assessment_id: string;
  rule_id?: string | null;
  rule_type: string;
  result: 'PASS' | 'FAIL' | 'INDETERMINATE' | 'MANUAL_REVIEW';
  actual_value?: string | null;
  expected_value?: string | null;
  explanation: string;
}

export interface EligibilityAssessment {
  id: string;
  application_id: string;
  result: AssessmentResultType;
  evaluated_at: string;
  engine_version: string;
  summary: string;
  rule_results?: EligibilityRuleResult[];
}

export type BenefitStatus = 'APPROVED' | 'DISBURSED' | 'CANCELLED' | 'EXPIRED' | 'REVOKED';

export interface Benefit {
  id: string;
  public_id: string;
  scheme_id: string;
  scheme_name?: string | null;
  scheme_code?: string | null;
  scheme_scope?: SchemeScope | null;
  application_id?: string | null;
  application_number?: string | null;
  benefit_unit_type: BenefitUnitType;
  person_id?: string | null;
  person_name?: string | null;
  household_id?: string | null;
  household_public_id?: string | null;
  property_id?: string | null;
  property_address?: string | null;
  status: BenefitStatus;
  approved_at?: string | null;
  disbursed_at?: string | null;
  effective_during?: string | null;
  amount?: number | null;
  currency?: string | null;
  quantity?: number | null;
  unit?: string | null;
  description?: string | null;
  source_id?: string | null;
  source_name?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_applications: number;
  pending_verification: number;
  approved_applications: number;
  disbursed_applications: number;
  total_benefits: number;
  individual_benefits: number;
  household_benefits: number;
  property_benefits: number;
  individual_benefits_count?: number;
  household_benefits_count?: number;
  property_benefits_count?: number;
  total_schemes_count?: number;
}

// ============================================================================
// V4 DOMAIN TYPES — ENTITY RESOLUTION & DUPLICATE DETECTION
// ============================================================================

export type OverallAssessment = 'STRONG_MATCH' | 'POSSIBLE_MATCH' | 'WEAK_MATCH' | 'LIKELY_NON_MATCH' | 'UNCERTAIN';
export type EvidenceDirection = 'SUPPORTS_MATCH' | 'CONTRADICTS_MATCH' | 'NEUTRAL';
export type ERCaseStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED_MATCH' | 'RESOLVED_NON_MATCH' | 'RESOLVED_UNCERTAIN' | 'CANCELLED';
export type ERResolution = 'MATCH' | 'NON_MATCH' | 'UNCERTAIN';

export type DuplicateCategory = 'EXACT_DUPLICATE' | 'LIKELY_DUPLICATE' | 'POTENTIAL_DUPLICATE' | 'NOT_DUPLICATE' | 'INSUFFICIENT_INFORMATION';
export type DuplicateCaseStatus = 'OPEN' | 'UNDER_REVIEW' | 'CONFIRMED_DUPLICATE' | 'RESOLVED_NOT_DUPLICATE' | 'REQUIRES_MORE_EVIDENCE' | 'DISMISSED';
export type DuplicateDecision = 'CONFIRMED_DUPLICATE' | 'NOT_DUPLICATE' | 'REQUIRES_MORE_EVIDENCE';

export interface EntityResolutionEvidence {
  id: string;
  candidate_id: string;
  field: string;
  source_value: string | null;
  candidate_value: string | null;
  comparison_method: string;
  comparison_result: string;
  similarity: number;
  weight: number;
  direction: EvidenceDirection;
  explanation: string;
  created_at: string;
}

export interface EntityResolutionCandidate {
  id: string;
  case_id: string;
  candidate_entity_id: string;
  candidate_rank: number;
  candidate_name?: string | null;
  candidate_dob?: string | null;
  candidate_gender?: string | null;
  candidate_address?: string | null;
  overall_assessment: OverallAssessment;
  overall_score: number;
  contradiction_count: number;
  why_flagged: string;
  why_not_confident: string;
  created_at: string;
  evidence?: EntityResolutionEvidence[];
}

export interface EntityResolutionCase {
  id: string;
  public_id: string;
  entity_type: 'PERSON' | 'HOUSEHOLD' | 'PROPERTY';
  source_entity_id: string;
  source_name?: string | null;
  source_dob?: string | null;
  source_gender?: string | null;
  source_address?: string | null;
  status: ERCaseStatus;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  matching_model_version: string;
  normalization_version: string;
  blocking_version: string;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  resolved_at?: string | null;
  resolved_by?: string | null;
  resolution?: ERResolution | null;
  candidates?: EntityResolutionCandidate[];
}

export interface BenefitDuplicateEvidence {
  id: string;
  candidate_id: string;
  field: string;
  source_value: string | null;
  candidate_value: string | null;
  comparison_method: string;
  comparison_result: string;
  direction: EvidenceDirection;
  explanation: string;
  created_at: string;
}

export interface BenefitDuplicateCandidate {
  id: string;
  case_id: string;
  existing_benefit_id?: string | null;
  existing_application_id?: string | null;
  existing_scheme_id?: string | null;
  existing_scheme_name?: string | null;
  existing_person_name?: string | null;
  existing_household_name?: string | null;
  existing_property_address?: string | null;
  existing_benefit_period?: string | null;
  duplicate_category: DuplicateCategory;
  score: number;
  why_flagged: string;
  recommended_action: string;
  created_at: string;
  evidence?: BenefitDuplicateEvidence[];
}

export interface BenefitDuplicateCase {
  id: string;
  public_id: string;
  target_application_id: string;
  applicant_person_name?: string | null;
  scheme_name?: string | null;
  scheme_scope?: 'INDIVIDUAL' | 'HOUSEHOLD' | 'PROPERTY' | 'COMPOSITE';
  overall_assessment: DuplicateCategory;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: DuplicateCaseStatus;
  duplicate_rules_version: string;
  reason: string;
  recommended_action: string;
  household_context?: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  resolved_at?: string | null;
  resolved_by?: string | null;
  resolution?: string | null;
  candidates?: BenefitDuplicateCandidate[];
}

export interface MatchingModelConfig {
  id: string;
  name: string;
  version: string;
  weight_name: number;
  weight_dob: number;
  weight_parent: number;
  weight_address: number;
  weight_household: number;
  weight_phone: number;
  weight_gender: number;
  strong_match_threshold: number;
  possible_match_threshold: number;
  non_match_threshold: number;
  dob_conflict_penalty: number;
  gender_conflict_penalty: number;
  identifier_conflict_penalty: number;
  duplicate_high_threshold: number;
  duplicate_review_threshold: number;
  active: boolean;
  created_at: string;
}



