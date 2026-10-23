# Mira

Mira is a government and public-service welfare platform connecting citizens, households, family records, documents, schemes, eligibility, applications, verification, benefits and audit history. It keeps these records connected across a welfare workflow instead of treating every application, document and family record as an isolated process.

> **Implementation status:** This repository contains a working web application and API with synthetic demo data. Some screens and assistant responses are demo-driven; this is not connected to live government registries or payment systems.

## Overview

The repository is a two-application workspace. The browser application provides citizen, field, verification, scheme, supervisor, auditor and department workspaces. A Rust API authenticates requests, applies role and record checks, and persists domain data in PostgreSQL. SQL migrations define the schema; the API runs them and seeds the synthetic dataset on startup.

Core domain workflows are implemented in the API and exercised by Rust integration/security tests. The UI combines API-backed workflows with local demo data and simulated interface elements; see [Known limitations](#known-limitations).

## Core capabilities

| Capability | What is present | Status |
|---|---|---|
| Accounts and profile | Registration, login, bearer-token sessions, profile/preferences and family actions. | Implemented in API; profile UI is present. |
| Household and people records | People, households, memberships, relationships, properties, life events and disputes. | Implemented; seeded data is synthetic. |
| Family360 | Searchable, filterable household visualization with selected-member details, relationships and timeline. | Implemented as a visualization over household/person records. |
| Schemes and eligibility | Scheme/rule management and deterministic rule evaluation with per-application assessment results. | Implemented; scheme data is synthetic and rule coverage depends on configured rules. |
| Applications and verification | Draft/submission, assignment, evidence requests and submission, verification, approval/rejection. | Implemented in API; presented through role workspaces. |
| Documents and evidence | Upload, metadata, application linking, preview/download, versioning, verification and extraction/evidence endpoints. | Implemented with local file storage; OCR/extraction depends on configured system tools and document type. |
| Benefits | Benefit records, events/assets, listing, detail and disbursement action. | Implemented against demo records; no live payment integration. |
| Communications and notifications | Notifications with read state; role workspaces also include contextual inbox/message interfaces. | Notifications are API-backed; inbox interactions are partly demo/client-driven. |
| Audit | User activity and role-authorized audit event views, with events written by workflow operations. | Implemented; this is an application audit log, not a certified immutable ledger. |
| Duplicate review | Entity-resolution cases and benefit-duplicate checks with human resolution actions. | Implemented as matching/review workflows; a match is an investigation signal, not a fraud finding. |
| Mira AI | Authenticated assistant route, optional Groq completion and a local fallback. | Partial; see [Mira AI](#mira-ai). |

## Product architecture

```text
Browser
  └─ React + TanStack Start/Router UI
       └─ JSON API calls with bearer token
            └─ Rust Axum API and application services
                 ├─ PostgreSQL (SQLx)
                 ├─ local document storage
                 └─ optional Groq chat completion
```

The API is the persistence and workflow layer. Most authenticated API handlers extract an authenticated user, and domain services check role and/or record scope. The UI also has route and workspace configuration, but hiding a navigation item is not itself an authorization boundary.

### User roles

The backend role enum and seed data define `CITIZEN`, `FIELD_OFFICIAL`, `VERIFICATION_OFFICER`, `SCHEME_OFFICER`, `SUPERVISOR`, `DEPARTMENT_ADMIN`, `AUDITOR` and `SUPER_ADMIN`.

| Role | Primary work |
|---|---|
| Citizen | Own profile and household, schemes, applications, documents, benefits, notifications and support views. API access is scoped to the authenticated user and related records. |
| Field official | Field and household record work, evidence collection and assigned verification tasks. Access depends on the API operation and role checks. |
| Verification officer | Review assigned applications, documents and evidence; request further evidence and record verification. |
| Scheme officer | Scheme/rule and application review workflows. |
| Supervisor | Escalated or supervisory review workflows. |
| Department administrator | Department operations, scheme/rule administration and demo operations. |
| Auditor | Read-oriented audit and oversight views; write actions are restricted by API role checks. |
| Super administrator | System-level role exists in the backend model; it is not presented as a separate seeded demo identity. |

The frontend also uses workspace names such as `officer`, `verifier`, `scheme`, `supervisor`, `auditor` and `admin`. These are presentation choices mapped to backend roles, not additional database roles.

### Main workflows

Citizen-facing flow:

```text
Profile / household → scheme discovery → eligibility assessment
  → application → documents and evidence → review / clarification
  → verification → decision → benefit record → audit history
```

Officer-facing flow:

```text
Role workspace / queue → application → Family360 and records
  → documents / evidence review → request evidence or verify
  → decision or escalation → audit history
```

Concrete route families include `/citizen/*`, `/officer/*`, `/verifier/*`, `/department/*` and `/auditor/*`. The generated route tree is at `apps/web/src/routeTree.gen.ts`; API routes are registered in `apps/api/src/api/mod.rs` under `/api/v1`.

## Family360

Family360 is an interactive view over the underlying household and person records, not a separate source of truth. The web component loads household family data and fetches person 360 details when a member is selected. It supports member search, generation/role/verification filters, node selection, relationship inspection, member details, zoom, reset/fullscreen, path finding and a history timeline. The API also exposes household graph/timeline and person 360/relationship data.

The visualization can display verification and conflict information provided by records and seeded data. It does not independently verify the accuracy of those records.

## Schemes and eligibility

Schemes have status, descriptive fields and configurable rules. The API's eligibility engine evaluates configured rules and stores an assessment and individual rule results for an application. Assessment is deterministic application logic; Mira AI is not the eligibility authority. Seeded schemes and applicant records are synthetic, and the repository does not integrate with an official scheme registry.

## Applications and verification

Application status values in the database include `DRAFT`, `SUBMITTED`, `UNDER_REVIEW`, `EVIDENCE_REQUESTED`, `EVIDENCE_SUBMITTED`, `FIELD_VERIFIED`, `APPROVED`, `REJECTED` and `WITHDRAWN`. API actions create/assess/submit applications, assign them, request and submit evidence, verify, approve and reject. The application/document endpoints link evidence to case review.

## Documents and evidence

The API supports document upload, metadata, application linkage, preview/download, archive, replacement/version history, document verification and extraction review. Files are stored by the API in its configured local storage directory (the repository's compose setup mounts a volume for this). Document evidence packs and consistency reports are available through API endpoints. OCR and extraction are not a general guarantee for every file: processing depends on available tools, format and processing state. The repository includes sensitive-looking synthetic sample files; do not treat the demo store as a production storage design.

## Benefits

Benefit records relate to the scheme and person/household/application domain, with benefit events/assets and API operations to list, inspect and record disbursement. Values and status shown by the demo are synthetic. No bank, treasury or real disbursement provider is integrated.

## Communications and notifications

The API provides user notifications and read-state updates. Role workspaces include inbox, threaded messages, replies and clarification-oriented UI. The inbox experience is not a general email service, and the repository's client data layer includes demo-driven content; do not assume every displayed conversation is persisted as a backend communication record.

## Audit and account history

Workflow and security-related operations insert `audit_events` with event type, actor/user, organization where available, request ID, IP address where captured, details and timestamp. API routes distinguish role-authorized audit event access (`/api/v1/audit/events`) from a user's own activity (`/api/v1/audit/my-activity`). The web application has audit views and Profile/Account screens. These records are ordinary application database records; there is no implemented hash-chain guarantee or external compliance certification.

## Mira AI

The API exposes authenticated `POST /api/v1/ai/chat`. When `GROQ_API_KEY` is configured, the API sends a chat completion request to Groq; `GROQ_MODEL` selects the model and defaults in code to `llama-3.3-70b-versatile`. Without a key or when the provider call fails, the application returns a local fallback response. Some fallback answers are fixed demo text and are not reliable live record lookups.

The API builds role-oriented context and sends it with the prompt; it also includes input pattern checks, output sanitization and instructions treating supplied record/document content as untrusted data. These are defense-in-depth measures, not a guarantee against prompt injection or disclosure. Context construction includes hard-coded demo identities and summaries, so do not use this path with real sensitive records without further review. The assistant helps explain/navigation and is not an autonomous decision-maker.

## Security and privacy

Implemented mechanisms include Argon2 password hashing, signed JWT bearer tokens, authenticated API extractors, role/record checks in service methods, request IDs, CORS configuration, and audit events. Demo login is disabled when `APP_ENV=production` and can be disabled in other environments with `MIRA_DEMO_MODE=false`. API keys are read server-side from environment configuration.

The repository does not establish legal/regulatory compliance, production-grade encrypted document storage, a certified immutable audit trail, external identity verification, or a comprehensive deployment security posture. Review defaults in `.env.example` and `docker-compose.yml` before any non-local deployment; replace development secrets and configure origins, database access, storage and operational controls appropriately.

## Demo environment

The API seeds a synthetic Mira Demo Department. With demo mode enabled, the login screen/API can select these role accounts:

| Email | Demonstrates |
|---|---|
| `demo.citizen@mira.demo` | Citizen household, schemes, applications and benefits. |
| `demo.verifier@mira.demo` | Verification queues and evidence review. |
| `demo.scheme@mira.demo` | Scheme/rule and scheme-officer workflows. |
| `demo.supervisor@mira.demo` | Supervisor workflows. |
| `demo.auditor@mira.demo` | Audit and oversight views. |
| `demo.admin@mira.demo` | Department administration. |

Demo login uses a seeded development credential internally; this README intentionally does not publish it. The `npm run seed` command resets and reseeds synthetic domain data, so it should only target a disposable development database.

## Technology stack

| Layer | Technology |
|---|---|
| Web | React 19, TypeScript, TanStack Start and Router, Vite |
| Styling and UI | Tailwind CSS 4, Radix UI primitives, project UI components |
| API | Rust, Axum 0.7, Tokio |
| Database | PostgreSQL, SQLx 0.7 |
| Authentication | Argon2 password hashing, JSON Web Tokens (`jsonwebtoken`) |
| AI | Optional Groq chat completions through server-side `reqwest` |
| Frontend tests | Vitest, Testing Library, jsdom |
| Backend tests | Cargo test (Rust integration tests) |
| Containers | Dockerfiles for API/web and Docker Compose with PostgreSQL |

## Repository structure

```text
apps/
  api/src/              Axum routes, auth, application/domain services, database and AI
  api/tests/            Rust API, workflow and security tests
  web/src/routes/       TanStack file-based routes and role workspaces
  web/src/components/   Shared, civic and role-specific UI
  web/src/lib/           API client, app state, eligibility and translations
migrations/             PostgreSQL schema migrations
scripts/                Development, test and seed entry points
docker/                 API and web container definitions
docs/                   API and architecture notes
```

## Local development

Prerequisites: Node.js/npm, Rust/Cargo, Docker Compose (or a compatible PostgreSQL instance). The repository root has scripts but no root dependency set; install frontend dependencies in `apps/web`.

```bash
git clone <repository-url>
cd mira
npm --prefix apps/web install
docker compose up -d postgres
npm run dev
```

The development script starts the API on `http://localhost:4000` and web app on `http://localhost:5173`. The API waits for PostgreSQL on port `5433`, runs migrations, and seeds demo data on startup. Health endpoint: `http://localhost:4000/api/v1/health`.

For explicit environment configuration, copy `.env.example` to `.env` and set a local `DATABASE_URL`. The checked-in example and compose file contain development-only defaults; do not reuse those credentials or JWT secret outside a local demo. The API reads `.env` from its working directory (`apps/api`) and the root script passes `DATABASE_URL` through to it.

## Environment variables

See [`.env.example`](.env.example) for the documented local settings. The API also recognizes optional `GROQ_API_KEY` and `GROQ_MODEL`; provide these only in the API process environment if enabling live chat. `VITE_API_BASE_URL` can override the web API base URL; by default the web client uses same-origin `/api` (the dev/prod web proxy handles it).

Important API settings include `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRATION_HOURS`, `PORT`, `APP_ENV`, `MIRA_DEMO_MODE`, `CORS_ORIGINS` and `RUST_LOG`. Never commit real keys, passwords or tokens.

## Database

PostgreSQL schema changes are SQL files in `migrations/`. The API currently embeds and executes migrations `0001` through `0008` during startup. Run the explicit commands from the API directory when needed:

```bash
cd apps/api
cargo run -- migrate
cargo run -- seed
```

The seed operation is intended for local synthetic data and clears/recreates demo domain rows. It is destructive to data in the target Mira database.

## Testing and quality checks

Available root scripts:

```bash
npm test
npm run build:web
npm run build:api
```

`npm test` invokes `scripts/test.sh`, which runs Rust integration tests against `mira_test` on PostgreSQL port `5433`, then frontend Vitest tests. Ensure the test database is available before running it. Frontend-only commands are `cd apps/web && npm test` and `npm run lint`. There is no dedicated root typecheck script; the web build runs the configured TypeScript/Vite build.

## Build and deployment

Build the web and API independently with the root scripts above. `docker compose up --build` builds the web/API images and PostgreSQL service for a local containerized demonstration; it is not a production deployment recipe. Compose publishes web on port `3000`, API on `4000` and PostgreSQL on `5433`, and mounts database/document volumes. Set production secrets and infrastructure controls outside this sample configuration.

## Known limitations

- Seeded people, schemes, applications, benefits, audit activity and document files are synthetic.
- Some workspace metrics, inbox content, identity flows and other screen states are client-side demonstrations; the login UI does not connect to UIDAI or another identity provider.
- The AI fallback contains fixed sample answers, and the current authorized-context builder includes hard-coded role identity/context examples. Live Groq use is optional and requires review before supplying sensitive data.
- Document processing capability varies by file type and locally available OCR/extraction tools. Local file storage is not a managed production document service.
- The UI contains translations for multiple Indian languages, but dictionaries are partial; backend preference validation currently supports English (`en`) and Hindi (`hi`).
- Notifications have API persistence; the inbox is not uniformly backed by a persisted message/communication domain model.
- No live government registry, scheme catalog, identity, email/SMS, payment or benefit-disbursement integration is configured.

## Roadmap

### Current

API-backed household/person records, scheme rules and assessments, application workflow, document/evidence endpoints, benefits, notifications, audit events, role workspaces and Family360 visualization.

### Next

Replace demo-only UI data and hard-coded AI context with consistently API-backed, record-scoped workflows; complete translation coverage and document-processing setup.

### Future

Integrate external identity, registry, messaging and payment services only with appropriate authorization, operational safeguards and deployment-specific review.

## Development guidelines

- Treat API authorization and record scope as the access boundary; frontend navigation is not authorization.
- Keep synthetic demo fixtures clearly separated from live integrations and avoid adding real personal data to seed files.
- Update migrations and tests alongside backend domain/workflow changes.
- Keep secrets in environment configuration, never in source or documentation.
