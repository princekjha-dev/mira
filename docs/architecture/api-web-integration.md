# Mira — API ↔ Web Full-Stack Integration Architecture Audit

**Status:** APPROVED FOR IMPLEMENTATION  
**Document Version:** 1.0.0  
**Target Architecture:** Production-Grade End-to-End Integration  

---

## Executive Summary

This architecture audit evaluates the complete integration boundary between `apps/web` (Frontend: React 19, TanStack Start/Router, TanStack Query, Tailwind CSS) and `apps/api` (Backend: Rust, Axum 0.7, SQLx, Tokio, PostgreSQL 18).

The objective is to eliminate all client-side mock data and mock state management in production flows, replacing them with typed, authoritative REST endpoints backed by PostgreSQL transactions, role-based authorization guards, cryptographic session management, audit event logging, and explainable intelligence engines (duplicate detection, eligibility rules, and document evidence).

---

## 1. Frontend Framework

- **Core Engine:** React 19 (`19.2.0`) with TypeScript 5.8
- **Meta-Framework & Routing:** TanStack Start (`1.168.60`) + TanStack Router (`1.170.41`) with Vite 8.1.5
- **State Management & Querying:** `@tanstack/react-query` (`^5.101.1`) for asynchronous server-state cache management, invalidation, and optimistic mutations; React Context (`AppStateProvider`) for client-only UI accessibility preferences (font scaling, high contrast, reduced motion, selected language).
- **UI & Styling:** Tailwind CSS v4 (`@tailwindcss/vite`), Radix UI primitives (`dialog`, `accordion`, `select`, `tabs`, `dropdown-menu`, etc.), Lucide React icons, and Recharts.

---

## 2. Backend Framework

- **Core Engine:** Rust (2021 edition) with Axum 0.7 and Tokio asynchronous runtime.
- **Database Driver & ORM:** SQLx 0.7 with asynchronous connection pooling (`sqlx::PgPool`), native PostgreSQL UUID (`uuid::Uuid`), and Chrono (`chrono::NaiveDate`, `chrono::DateTime<Utc>`).
- **Middleware & Networking:** Tower and Tower-HTTP (CORS, Trace, Request ID generation, timeout handling).
- **Security Primitives:** Argon2id password hashing (`argon2`), JSON Web Tokens (`jsonwebtoken` with HMAC-SHA256), secure deterministic ID generation.

---

## 3. API Protocol

- **Protocol:** HTTP/1.1 and HTTP/2 over HTTPS in production; HTTP in local development.
- **Payload Format:** JSON (`application/json`) with standard wrapping:
  - Success responses: `{ "data": ... }` or `{ "data": [...], "meta": { "total": ..., "page": ... } }`
  - Error responses: `{ "error": { "code": "...", "message": "...", "request_id": "..." } }`
- **Request Tracing:** Every request accepts or generates an `x-request-id` header passed into tracing spans, database audit events, and error responses.

---

## 4. Authentication Mechanism

- **Auth Protocol:** Cryptographic Bearer Token (JWT) issued on `/api/v1/auth/login` or `/api/v1/auth/register`.
- **Credential Hashing:** Salted Argon2id (never plain text).
- **Session Extraction:** Axum `FromRequestParts` extractor `AuthenticatedUser` parses and validates JWT signature, claims, expiration, and user status.
- **Claims Structure:**
  ```json
  {
    "sub": "user-uuid",
    "email": "user@mira.local",
    "roles": ["CITIZEN"],
    "org_id": "organization-uuid",
    "exp": 1729600000,
    "iat": 1729513600
  }
  ```
- **Web Auth Storage:** Secure storage in client storage with automatic Bearer token injection in the unified API client (`src/lib/api/client.ts`). Automatic redirection on 401 Unauthorized.

---

## 5. Database

- **Engine:** PostgreSQL 18.
- **Port:** 5433 (Native local development via `scripts/ensure_services.sh` or Docker Compose).
- **Migrations:** Sequential, reversible raw SQL migrations (`migrations/0001_initial_schema.sql` through `0005_v5_evidence_and_document_intelligence.sql`).
- **Core Entities:**
  - Auth: `organizations`, `roles`, `users`, `user_roles`, `user_organizations`, `sessions`, `audit_events`
  - V2 Domain: `source_records`, `persons`, `person_identifiers`, `person_relationships`, `households`, `household_memberships`, `properties`, `property_associations`, `life_events`
  - V3 Welfare: `schemes`, `scheme_rules`, `applications`, `eligibility_assessments`, `eligibility_rule_results`, `benefits`, `benefit_events`, `benefit_assets`
  - V4 Duplicate & Resolution: `matching_model_versions`, `entity_resolution_cases`, `entity_resolution_candidates`, `benefit_duplicate_cases`
  - V5 Evidence: `documents`, `document_extractions`, `document_verifications`

---

## 6. API Base URL

- **Environment Variable:** `VITE_API_BASE_URL` (Frontend client) / `API_URL` (Server-side & Scripts).
- **Default Development:** `http://localhost:4000`
- **Rule:** Never hardcode `localhost:4000` or `localhost:3000` inside React components. All network requests route through the centralized API client in `apps/web/src/lib/api/client.ts`.

---

## 7. Existing Endpoints (Backend Inventory)

The Axum core API in `apps/api` provides:

### System & Auth
- `GET /api/v1/health`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `GET /api/v1/profile`
- `GET /api/v1/profile/:id`
- `PUT /api/v1/profile/preferences`
- `GET /api/v1/audit/events`

### V2 Domain (Persons, Households, Properties, Graph)
- `GET /api/v1/persons`, `POST /api/v1/persons`
- `GET /api/v1/persons/:id`, `PATCH /api/v1/persons/:id`
- `GET /api/v1/persons/:id/relationships`, `POST /api/v1/persons/:id/relationships`
- `GET /api/v1/persons/:id/households`
- `GET /api/v1/persons/:id/properties`
- `GET /api/v1/persons/:id/benefits`
- `GET /api/v1/households`, `POST /api/v1/households`, `POST /api/v1/households/split`
- `GET /api/v1/households/:id`, `PATCH /api/v1/households/:id`
- `GET /api/v1/households/:id/members`, `POST /api/v1/households/:id/members`
- `GET /api/v1/households/:id/properties`
- `GET /api/v1/households/:id/timeline`
- `GET /api/v1/households/:id/benefits`
- `GET /api/v1/properties`, `POST /api/v1/properties`, `POST /api/v1/properties/associations`
- `GET /api/v1/properties/:id`, `GET /api/v1/properties/:id/benefits`
- `GET /api/v1/graph/person/:id`, `GET /api/v1/graph/household/:id`

### V3 Welfare Schemes & Benefits
- `GET /api/v1/schemes`, `POST /api/v1/schemes`, `GET /api/v1/schemes/:id`, `PATCH /api/v1/schemes/:id`
- `GET /api/v1/schemes/:id/rules`, `POST /api/v1/schemes/:id/rules`
- `PATCH /api/v1/scheme-rules/:id`
- `GET /api/v1/applications`, `POST /api/v1/applications`, `GET /api/v1/applications/:id`
- `POST /api/v1/applications/:id/assess`
- `POST /api/v1/applications/:id/submit`
- `POST /api/v1/applications/:id/approve`
- `GET /api/v1/benefits`, `GET /api/v1/benefits/:id`, `POST /api/v1/benefits/:id/disburse`
- `GET /api/v1/dashboard/stats`

### V4 Entity Resolution & Duplicate Intelligence
- `GET /api/v1/entity-resolution/cases`, `POST /api/v1/entity-resolution/cases`
- `GET /api/v1/entity-resolution/cases/:id`, `POST /api/v1/entity-resolution/cases/:id/resolve`
- `GET /api/v1/entity-resolution/cases/:id/candidates`
- `GET /api/v1/entity-resolution/candidates/:id/evidence`
- `GET /api/v1/benefit-duplicate-checks`, `POST /api/v1/benefit-duplicate-checks`
- `GET /api/v1/benefit-duplicate-checks/:id`, `POST /api/v1/benefit-duplicate-checks/:id/decision`
- `GET /api/v1/matching-config`

### V5 Document Intelligence & Evidence Pack
- `GET /api/v1/documents`, `POST /api/v1/documents`
- `GET /api/v1/documents/:id`
- `GET /api/v1/documents/:id/download`, `GET /api/v1/documents/:id/preview`
- `GET /api/v1/documents/:id/extractions`, `POST /api/v1/documents/:id/verify-extraction`
- `GET /api/v1/cases/:id/evidence-pack`
- `GET /api/v1/cases/:id/document-consistency`
- `GET /api/v1/cases/:id/evidence-report`

---

## 8. Existing Frontend API Calls

- **Before this audit:** 0 HTTP network calls existed in `apps/web/src`.
- The frontend previously relied entirely on local in-memory mock datasets in `apps/web/src/lib/data.ts` and `apps/web/src/lib/app-state.tsx`.

---

## 9. Mock Data Sources to be Replaced

The following static collections in `apps/web/src/lib/data.ts` and `apps/web/src/lib/app-state.tsx` must be connected to real backend APIs:
1. `SCHEMES` → `GET /api/v1/schemes`
2. `CITIZEN` & `MEMBERS` → `GET /api/v1/persons` and `GET /api/v1/households/:id/members`
3. `HOUSEHOLD` → `GET /api/v1/households/:id`
4. `APPLICATIONS` → `GET /api/v1/applications`
5. `BENEFITS` → `GET /api/v1/benefits`
6. `DUPLICATE_ALERTS` → `GET /api/v1/benefit-duplicate-checks`
7. `VAULT` → `GET /api/v1/documents`
8. `AUDIT` → `GET /api/v1/audit/events`
9. Hardcoded officer and admin logins → `POST /api/v1/auth/login`

---

## 10. Missing Endpoints

To support all requirements from the specification, the following endpoints will be introduced/standardized:
1. `POST /api/v1/applications/:id/reject` — Formal rejection with audit reason
2. `POST /api/v1/applications/:id/request-correction` — Transition to correction/evidence required state
3. `POST /api/v1/simulations` — Run policy simulation scenario
4. `GET /api/v1/simulations/:id` — Poll simulation run status and fetch scenario impact results
5. `GET /api/v1/analytics/overview` — Aggregated operational statistics

---

## 11. Broken Endpoints & Discrepancies

1. **Frontend-Backend Scope Naming:** Backend uses uppercase enums (`INDIVIDUAL`, `HOUSEHOLD`, `PROPERTY`); frontend used title case (`Individual`, `Household`). A bidirectional translation layer in `apps/web/src/lib/api/` will harmonize types without loss of precision.
2. **Date Format:** Backend uses ISO-8601 strings and RFC3339; frontend expects standard JavaScript `Date` parseable strings.
3. **Application IDs:** Backend UUID vs Demo Code (`APP-2026-000318`). Backend endpoints accept UUIDs, and lookup by `application_number` or `public_id` will be supported.

---

## 12. CORS Configuration

- Configured in `apps/api/src/infrastructure/mod.rs` via `tower_http::cors::CorsLayer`.
- Allowed origins loaded from `CORS_ORIGINS` in `.env` (default: `http://localhost:5173`, `http://127.0.0.1:5173`, `http://localhost:3000`).
- Credentials allowed (`allow_credentials(true)`).
- Allowed headers: `AUTHORIZATION`, `ACCEPT`, `CONTENT_TYPE`, `X_REQUEST_ID`.
- Production environment rejects wildcard `*`.

---

## 13. Environment Variables

### Root / API (`.env`, `.env.example`)
```text
APP_ENV=development
PORT=4000
DATABASE_URL=postgres://postgres@127.0.0.1:5433/mira_dev
JWT_SECRET=mira-v1-foundation-secure-jwt-secret-key-minimum-32-chars
JWT_EXPIRATION_HOURS=24
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000
RUST_LOG=mira_api=debug,tower_http=info
```

### Frontend (`apps/web/.env`, `apps/web/.env.example`)
```text
VITE_API_BASE_URL=http://localhost:4000
```

---

## 14. File Upload Architecture

- Flow: Client forms `multipart/form-data` → `POST /api/v1/documents`.
- Backend validates MIME type, magic bytes, file size (< 10 MB), and ownership.
- Document binary/text stored in secure filesystem repository (`apps/api/data/documents/`) or metadata DB; metadata indexed in `documents` table with hash digest.
- Preview and download protected by role-based authorization check.

---

## 15. WebSocket / SSE Usage

- Polling with exponential backoff / short interval is implemented for asynchronous workflows (OCR extraction verification, duplicate checks, simulations). Ordinary polling is clean, deterministic, and avoids brittle socket disconnections in civic network conditions.

---

## 16. Error Format

Uniform JSON error envelope across the entire API:
```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Human-readable explanation of error",
    "request_id": "c1f7218d-6490-410a-9d2c-c76646b9a897"
  }
}
```
HTTP Status Mapping:
- `401 Unauthorized`: Missing or invalid JWT
- `403 Forbidden`: Insufficient role or object-level authorization violation
- `404 Not Found`: Entity not found
- `409 Conflict`: Unique constraint violation / state collision
- `422 Unprocessable Entity`: Validation failure
- `500 Internal Server Error`: Unhandled server exception

---

## 17. Validation Format

- Client: Form-level validation with Zod schemas and accessible input error states.
- Server: Strongly typed Rust domain models with Axum extractor validation, returning `VALIDATION_ERROR` (422) or `BAD_REQUEST` (400).

---

## 18. Pagination Format

- Query parameters: `?page=1&limit=50` or `?offset=0&limit=50`.
- List responses return array in `{ "data": [...] }`.

---

## 19. Authorization Model

- Backend is strictly authoritative.
- Roles supported:
  1. `CITIZEN`: Access only to own profile, own household, own submitted applications.
  2. `FIELD_OFFICIAL`: Field data verification and candidate document collection.
  3. `VERIFICATION_OFFICER`: Claim verification, duplicate review, assessment adjudication.
  4. `DEPARTMENT_ADMIN`: Scheme creation, rule editing, policy versioning, case approvals.
  5. `AUDITOR`: Immutable audit log inspection.
  6. `SUPER_ADMIN`: System maintenance.
- Frontend role checks purely govern navigation links and button visibility; backend guards enforce object-level and role-level authorization on every mutation and query.

---

## 20. Integration Risks & Mitigation Plan

| Risk | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| Mock data regression | Broken UI when server is empty | Keep deterministic seed runner (`cargo run -- seed`) so all demo households, persons, and benefits are immediately populated. |
| Auth token expiry / invalidation | Confusing blank states on 401 | Centralized API client interceptor catches 401 and clears session to prompt re-login. |
| Disconnected schemas between TS & Rust | Runtime type mismatches | Centralized TypeScript API types strictly mapped to Rust DTOs in `src/lib/api/types.ts`. |
| Cross-Origin Resource Sharing (CORS) block | Network failure in browser | Strict CORS layer configured in Axum allowing Vite dev port `5173`. |
| Peer dependency conflict in Web | Broken `npm install` | Tested `--legacy-peer-deps` resolution for React 19 compatibility. |
