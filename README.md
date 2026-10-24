# Mira

Mira is a secure government and public-service welfare platform connecting citizens, households, family records, documents, schemes, eligibility, applications, verification, benefits, and audit history. It keeps these records connected across the complete welfare lifecycle instead of treating every application, document, and family record as an isolated workflow.

> **Implementation Note:** This repository contains a functional full-stack web application and REST API operating on synthetic demonstration datasets. External integrations (such as live UIDAI Aadhaar verification, state treasury PFMS disbursements, or national civil registries) are simulated with deterministic domain rules and local mock pipelines.

---

## Overview

Mira addresses data fragmentation in public service administration. In traditional welfare workflows, citizens must repeatedly re-submit evidence, field officers lack visibility into family structures, and scheme officers adjudicate claims without unified household records.

Mira unifies this lifecycle through a connected data layer:

```text
Person
  ↓
Household
  ↓
Family Relationships
  ↓
Documents & Evidence
  ↓
Applications
  ↓
Eligibility Evaluation
  ↓
Verification & Field Inspection
  ↓
Sanction Decision
  ↓
Benefits & Entitlements
  ↓
Immutable Audit History
```

The platform is implemented as a two-application monorepo:
1. **Frontend (`apps/web`):** A React 19 application built with TanStack Start, TanStack Router, Vite, Tailwind CSS 4, and Radix UI. It provides role-tailored workstations for Citizens, Verification Officers, Field Officials, Scheme Officers, Supervisors, Auditors, and Administrators.
2. **Backend (`apps/api`):** A high-performance Rust web service built with Axum 0.7, Tokio, and SQLx 0.7, providing JWT authentication, role-based and record-scoped authorization, deterministic eligibility rule evaluation, document management, and PostgreSQL persistence.

---

## Core Capabilities

| Capability | Description | Target Users | Implementation Status |
|---|---|---|---|
| **Account & Profile Center** | Authenticated session management, personal demographic records, language selection, preferences, and personal audit trail. | All Roles | **Implemented** |
| **Household & Family Registry** | Relational records connecting individuals into households, tracking active memberships, legal relationships, and civil life events. | Citizen, Field Official, Verifier | **Implemented** |
| **Family360 Visual Intelligence** | Interactive multi-generational SVG graph canvas, zoom/pan, relationship highlighting, BFS relationship path finder, and 360 member dossier. | All Roles | **Implemented** |
| **Welfare Schemes & Catalog** | Structured welfare program catalog with statutory conditions, target demographics, and required documentation. | Citizen, Scheme Officer, Admin | **Implemented** |
| **Eligibility Rules Engine** | Deterministic rule assessment evaluating household income, dwelling type, age, and land records with explainable criteria. | Scheme Officer, Citizen | **Implemented** |
| **Applications Workflow** | End-to-end lifecycle tracking: draft creation, submission, triage, evidence requests, field verification, and determinations. | Citizen, Verifier, Scheme Officer | **Implemented** |
| **Document & Evidence Vault** | Upload, storage, SHA-256 hashing, preview, versioning, verification status, OCR metadata, and multi-document consistency comparison. | Citizen, Verifier, Auditor | **Implemented** (local file storage) |
| **Benefits & Entitlements** | Sanction records, benefit events, individual and household entitlement tracking, and disbursement actions. | Citizen, Scheme Officer | **Implemented** (synthetic tracking) |
| **Contextual Communications** | Application-linked clarification threads, official requests, citizen responses, and real-time in-app notifications. | Citizen, Verifier, Officer | **Implemented** |
| **Audit Ledger & Compliance** | Chronological event logging (`audit_events`) capturing actor, role, action, entity, previous/new state, timestamp, and request ID. | Auditor, Admin, All Users | **Implemented** |
| **Entity Resolution & Duplicates** | Matching logic identifying potential duplicate registrations, conflicting dates of birth, or overlapping claims for manual officer review. | Verifier, Officer, Auditor | **Implemented** |
| **Mira AI Assistant** | Context-constrained assistant for scheme inquiries, application tracking, and navigation guidance with strict prompt-injection defenses. | All Roles | **Implemented** (Groq API + Local Fallback) |

---

## Product Architecture

Mira strictly separates presentation logic from authorization and business domain services:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Web Browser (Client)                            │
│  React 19 • TanStack Start & Router • Tailwind CSS 4 • Radix UI        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ JSON / REST (Bearer JWT)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Mira Core API (Rust / Axum)                     │
│  ┌───────────────────────┐  ┌────────────────────────────────────────┐ │
│  │   Auth & Middleware   │  │           Domain Services              │ │
│  │  • JWT Verification   │  │  • Profile & Family Service            │ │
│  │  • Role-Based Auth    │  │  • Application Workflow Service        │ │
│  │  • Request ID Tracing │  │  • Eligibility Assessment Engine       │ │
│  │  • Audit Logging      │  │  • Document & Extraction Service       │ │
│  └───────────────────────┘  └────────────────────────────────────────┘ │
└───────────────────┬───────────────────────────┬────────────────────────┘
                    │                           │
                    ▼                           ▼
        ┌───────────────────────┐   ┌────────────────────────┐
        │  PostgreSQL Database  │   │  Local Evidence Store  │
        │  (Postgres 18 / SQLx) │   │  (Mounted Storage Vol) │
        └───────────────────────┘   └────────────────────────┘
```

### Authorization Architecture

Authorization is strictly enforced server-side within `apps/api/src/application/mod.rs`:
- **Role Verification:** Extracted from the cryptographic claims of the JWT bearer token.
- **Record-Level Scoping:** Citizens can only query and mutate records belonging to their own user ID or verified household. Privileged officers are restricted to cases within their statutory jurisdiction or assigned queues.
- **Read-Only Enforcements:** Auditor roles are restricted from mutating state across domain endpoints.
- **Client Decoupling:** Hiding UI elements or navigation links in the browser is treated purely as a user experience affordance, never as a security boundary.

---

## User Roles & Access Control

The platform implements 7 primary roles across the public welfare administration hierarchy:

| Role | System Identifier | Responsibilities & Accessible Workspaces | Primary Access Boundary |
|---|---|---|---|
| **Citizen / Applicant** | `CITIZEN` | Manages personal profile, views household family tree, explores welfare schemes, checks eligibility, submits applications, responds to document clarification requests, and tracks disbursed benefits. | Restricted to personal household and owned applications (`/citizen/*`, `/schemes`). |
| **Verification Officer** | `VERIFICATION_OFFICER` | Reviews incoming application queue, cross-examines uploaded identity and property documents, compares OCR extracted values, inspects Family360 relationships, and requests additional evidence. | Assigned verification queue, document vault, and verification workstations (`/verifier/*`). |
| **Field Official** | `FIELD_OFFICIAL` | Conducts on-site dwelling inspections, verifies physical dwelling conditions, registers life events (births, separations), and collects field evidence. | Field inspection queue, household records, and duplicate signals (`/officer/*`). |
| **Scheme Officer** | `SCHEME_OFFICER` | Adjudicates program-specific eligibility matrices, reviews household compositions, approves/rejects claims, and monitors benefit disbursement schedules. | Scheme operations, eligibility rules, and decision workbenches (`/officer/*`, `/schemes`). |
| **Supervisor** | `SUPERVISOR` | Handles escalated cases, reviews conflicting relationship determinations, monitors department SLAs, and resolves complex appeals. | Escalations, supervisory reviews, and appeals consoles (`/department/*`). |
| **Forensic Auditor** | `AUDITOR` | Performs independent oversight, inspects cryptographic audit ledgers, reviews decision histories, and audits compliance against CAG benchmarks. | Read-only access to audit logs, compliance reports, and read-only Family360 (`/auditor/*`). |
| **Department Administrator** | `DEPARTMENT_ADMIN` | Configures welfare programs, manages eligibility rule parameters, maintains departmental units, and oversees operational telemetry. | System configuration, department directory, and rules management (`/department/*`). |

---

## End-to-End Workflows

### 1. Citizen Welfare Journey

```text
1. Citizen logs into portal
   ↓
2. Discovers welfare schemes (/schemes)
   ↓
3. Evaluates household eligibility against statutory rules (/eligibility)
   ↓
4. Prepares and submits application with family details (/citizen/apply/:schemeId)
   ↓
5. Uploads required documents (Aadhaar, Income Certificate, Khatauni) (/citizen/documents)
   ↓
6. Application enters Verification Queue with status SUBMITTED
   ↓
7. Receives official clarification request for additional document
   ↓
8. Responds with uploaded evidence in message thread (/citizen/applications/:id)
   ↓
9. Application verified and sanctioned by Scheme Officer
   ↓
10. Benefit record disbursed and visible in entitlement ledger (/citizen/benefits)
   ↓
11. State changes recorded in personal audit activity (/citizen/settings)
```

### 2. Officer Adjudication Workflow

```text
1. Officer opens Verification Queue (/verifier/queue)
   ↓
2. Inspects application details (/verifier/applications/:id)
   ↓
3. Opens contextual Family360 Graph to review multi-generational lineage
   ↓
4. Reviews submitted evidence in split Document Comparison viewer
   ↓
5. Identifies missing or blurred document → Issues Clarification Request
   ↓
6. Citizen submits updated document → System updates status to EVIDENCE_SUBMITTED
   ↓
7. Officer confirms verified match → Approves eligibility criteria
   ↓
8. Formal Determination recorded → Cryptographic audit log written to audit_events
```

---

## Family360 Visual Intelligence Layer

`Family360` (`apps/web/src/components/gov/Family360.tsx`) is a visual intelligence layer connecting household memberships, legal relationships, documents, schemes, and lifecycle timelines into a single interactive representation.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        Family360 Interactive Canvas                    │
│                                                                        │
│  [TIER 1 • ELDERS (G1)]         Devraj Sharma ── Kamla Sharma          │
│                                       │                                │
│  [TIER 2 • PARENTS (G2)]        Ramakant Sharma ── Pushpa Sharma       │
│                                       │                                │
│  [TIER 2 • HEAD & SPOUSE]       Rajesh Sharma ════ Sunita Sharma       │
│                                       │                                │
│  [TIER 3 • CHILDREN (G3)]       Aarav Sharma     Priya Sharma          │
│                                                                        │
│  [TIER 4 • DEPENDENTS (G4)]     Infants & Dependents                   │
└────────────────────────────────────────────────────────────────────────┘
```

### Technical Capabilities
- **Multi-Generational Tiering:** Automatically assigns and visualizes members across 4 distinct generational tiers (G1 Elders, G2 Parents/Heads, G3 Youth/Students, G4 Infants/Dependents).
- **Interactive SVG Canvas:** Smooth hardware-accelerated pan, zoom controls ($45\%$ to $200\%$), zoom reset, and fullscreen mode.
- **Dynamic Relationship Edges:** Cubic bezier curves connecting related nodes with distinct visual styling for `SPOUSE`, `PARENT`, `CHILD`, and `SIBLING`. Hovering a member dynamically highlights all connected relationship paths.
- **Statutory Path Finder:** Built-in Breadth-First Search (BFS) graph algorithm allowing operators to select any two individuals in the registry and compute their verified legal lineage path (e.g., `Devraj Sharma → PARENT → Ramakant Sharma → PARENT → Rajesh Sharma`).
- **Live Household Intelligence Metrics:** Real-time computation of household statistics from the database (Total Members, Verified Civil IDs, Active Review Flags, and Declared Household Income).
- **360 Member Dossier (Slide-over Drawer):** Clicking any node opens a detailed profile panel organized into 5 functional tabs:
  1. **Overview:** Legal identity, Date of Birth, Age, Gender, Masked Aadhaar (`XXXX-XXXX-4821`), and Household Role.
  2. **Relationships:** Direct family connections with relationship type and verification confidence scores.
  3. **Documents:** Associated evidence documents (Land Khatauni, Income Certificates) with verification status.
  4. **Schemes:** Explainable eligibility assessments indicating satisfied statutory criteria and unmet conditions.
  5. **Timeline:** Chronological life events (births, marriages, household bifurcations).

---

## Schemes & Eligibility Engine

Mira implements a rule-based evaluation engine rather than opaque automated decisions:

- **Configurable Statutory Criteria:** Schemes define eligibility parameters including maximum annual household income, categorical thresholds (BPL, EWS), land ownership ceilings, and dwelling construction type (Kutcha vs Pucca).
- **Deterministic Assessment:** Evaluated on demand via `POST /api/v1/applications/:id/evaluate` or in the citizen eligibility portal (`/eligibility`).
- **Explainable Determinations:** Returns plain-language rationale alongside granular conditions:
  - *Satisfied Conditions:* Criteria met by current verified records (e.g., "Household income < ₹2,00,000 threshold").
  - *Unmet Conditions:* Criteria requiring field verification or documentation (e.g., "Physical dwelling inspection report required").
  - *Missing Evidence:* Explicit list of missing proof documents.
- **AI Decision Boundary:** Mira AI assists users in understanding rules; it does **not** make statutory eligibility decisions.

---

## Applications & Verification Lifecycle

Application records progress through a strict, auditable finite-state machine:

```text
               ┌──────────┐
               │  DRAFT   │
               └────┬─────┘
                    │ Submit
                    ▼
             ┌─────────────┐
             │  SUBMITTED  │
             └──────┬──────┘
                    │ Assign / Triage
                    ▼
            ┌──────────────┐
            │ UNDER_REVIEW │◄──────────────────────┐
            └──────┬───────┘                       │
                   │                               │
        ┌──────────┴──────────┐                    │
 Request│Evidence     Verify  │Field               │ Evidence
        ▼                     ▼                    │ Submitted
┌──────────────────┐  ┌────────────────┐           │
│EVIDENCE_REQUESTED│  │ FIELD_VERIFIED │           │
└───────┬──────────┘  └───────┬────────┘           │
        │                     │                    │
        │ Upload Evidence     │ Final Determination│
        ▼                     │                    │
┌──────────────────┐          │                    │
│EVIDENCE_SUBMITTED├──────────┘                    │
└───────┬──────────┘                               │
        └──────────────────────────────────────────┘
                    │
         ┌──────────┴──────────┐
  Approve│               Reject│
         ▼                     ▼
   ┌──────────┐          ┌──────────┐
   │ APPROVED │          │ REJECTED │
   └──────────┘          └──────────┘
```

---

## Documents & Evidence Verification

- **Storage & Integrity:** Files uploaded via `POST /api/v1/documents` are stored in the local storage volume and fingerprinted using cryptographic SHA-256 digests to prevent silent tampering.
- **Version History:** Re-uploading a document supersedes prior versions (`supersedes_document_id`) while preserving audit history.
- **OCR & Field Extraction:** Extraction endpoints (`GET /api/v1/documents/:id/extractions`) extract key-value pairs (Aadhaar number, land area, holder name, issue date) for split-screen document comparison against application claims.
- **Privacy Masking:** Sensitive national identifiers are masked by default across API responses and UI displays (e.g., Aadhaar displayed as `XXXX-XXXX-4821`).

---

## Benefits & Entitlements

- **Benefit Records:** Created upon application sanction, linking the approved program, sanctioned amount, disbursement schedule, and beneficiary identity.
- **Disbursement Tracking:** Records chronological disbursement events (`DISBURSED`, `SCHEDULED`, `FAILED`) and payment reference IDs.
- **Duplicate & Overlap Review:** Cross-references active benefits across household members to surface duplicate claims (e.g., multiple housing assistance sanctions across a recently bifurcated family) for manual supervisor review.

---

## Contextual Communications

- **Application-Anchored Messaging:** Clarification requests and replies are linked directly to application records (`/api/v1/applications/:id/comments`).
- **Clarification Loop:** Officers specify required corrections; citizens view the request, upload the requested document, and reply within the same thread.
- **Notifications Engine:** In-app notifications with unread badge counters alert users to state changes, assignments, and evidence requests.

---

## Audit Ledger & Compliance

Every state-modifying action records an immutable audit entry in `audit_events`:

```json
{
  "id": "d74f82cb-2b06-4cd7-91bd-0a14a04200dd",
  "event_type": "APPLICATION_VERIFIED",
  "user_id": "271c7e44-59db-4ec0-8aa2-6c77a8cec445",
  "organization_id": "dee522ff-33a8-493a-83d2-a9afd7c45ef3",
  "request_id": "d5a00e8e-3b10-4dd9-be7d-0dad556b1949",
  "details": {
    "application_id": "APP-2026-8812",
    "previous_status": "UNDER_REVIEW",
    "new_status": "FIELD_VERIFIED",
    "reason": "On-site kutcha dwelling confirmed"
  },
  "created_at": "2026-10-24T03:30:00Z"
}
```

### Access Separation
- **Personal Account Center (`/citizen/settings`):** Exposes "My Audit Activity" (`GET /api/v1/audit/my-activity`) showing the authenticated user's own logins, submissions, and profile changes.
- **Forensic Audit Ledger (`/auditor/audit`):** Authorized operational roles (`VERIFIER`, `OFFICER`, `AUDITOR`, `ADMIN`) have access to system-wide audit records with cryptographic SHA-256 chain verification.

---

## Mira AI & Security Guardrails

The platform includes an AI assistant (`POST /api/v1/ai/chat`) with strict guardrails:

```text
User Input
  ↓
Backend Server Authorization (Verify User Session & Permissions)
  ↓
Context Assembly (Inject only authorized records for current page)
  ↓
Prompt Injection & Defense Filtering
  ↓
Groq API (Model: llama-3.3-70b-versatile) / Local Fallback
  ↓
Output Sanitization
  ↓
Sanitized Response to Client
```

### Security Guardrails
1. **Zero Autonomous Authority:** Mira AI cannot approve applications, alter records, mutate permissions, or issue determinations.
2. **Pre-LLM Authorization:** Record permissions are validated by Rust services *before* any data reaches the context assembler.
3. **Untrusted Data Boundaries:** All uploaded document OCR text, citizen messages, and user inputs are demarcated as untrusted data within the prompt template to neutralize prompt injection attempts.
4. **Credential Isolation:** The assistant will refuse attempts to disclose system prompts, database connection strings, or system secrets.

---

## Security & Privacy Controls

- **Authentication:** Password hashing via Argon2id; stateless session tokens issued as signed JSON Web Tokens (HMAC-SHA256).
- **Transport & Access:** CORS origin enforcement, automated UUID and parameter validation, and structured request ID tracking.
- **Identifier Masking:** National identity numbers (Aadhaar) are stored securely and masked (`XXXX-XXXX-4821`) across public and officer interfaces.
- **Demo Mode Isolation:** The public demo credential switcher is disabled when `APP_ENV=production`.

---

## Demo Environment & Seed Data

The local environment includes synthetic demo data centered on the 35-member Sharma Family (`MIRA-FAM-10482`):

| Role | Demo Email | Demonstrates |
|---|---|---|
| **Citizen** | `demo.citizen@mira.demo` (or `citizen@mira.local`) | Citizen dashboard, family tree, Family360, application submission, document uploads. |
| **Verification Officer** | `demo.verifier@mira.demo` (or `verifier@mira.local`) | High-density verification queue, split-screen document viewer, Family360 cross-matching. |
| **Field Official** | `officer@mira.local` | Geotagged inspections, dwelling assessments, physical evidence gathering. |
| **Scheme Officer** | `demo.scheme@mira.demo` | Program rule configuration, multi-generational dependent evaluations, sanctions. |
| **Supervisor** | `demo.supervisor@mira.demo` | Escalated cases, duplicate resolution approvals, appeals. |
| **Forensic Auditor** | `demo.auditor@mira.demo` (or `auditor@mira.local`) | Read-only forensic ledger, cryptographic audit trails, CAG compliance benchmarks. |
| **Administrator** | `demo.admin@mira.demo` (or `admin@mira.local`) | Department administration, user role assignments, system-wide telemetry. |

> *Note: Seed passwords follow the internal development configuration specified in the local environment and are omitted from public documentation.*

---

## Technology Stack

| Layer | Component | Technology | Version / Details |
|---|---|---|---|
| **Frontend** | Framework | React | `19.2.0` |
| | Routing & SSR | TanStack Start & TanStack Router | `1.168.x` / `1.170.x` |
| | Build Tool | Vite | `8.1.5` |
| | Styling | Tailwind CSS | `4.2.1` |
| | UI Components | Radix UI Primitives, Lucide Icons | Accessible, headless primitives |
| | State & Queries | TanStack Query | `5.101.1` |
| **Backend** | Language | Rust | `2021 Edition` |
| | Web Framework | Axum | `0.7` |
| | Asynchronous Runtime| Tokio | `1.37` (full) |
| | Database Client | SQLx | `0.7` (Postgres, tokio-rustls) |
| | Authentication | Argon2id & jsonwebtoken | `argon2 0.5`, `jsonwebtoken 9.3` |
| **Database** | Database Engine | PostgreSQL | `Postgres 18` |
| | Migrations | SQL Migrations (`migrations/`) | Versioned SQL scripts (`0001` - `0008`) |
| **AI Integration**| LLM Provider | Groq Cloud API | `llama-3.3-70b-versatile` (with local fallback) |
| **Quality & Tests**| Frontend Testing | Vitest & Testing Library | `vitest 4.1.x` |
| | Backend Testing | Rust Cargo Test | Multi-tier integration test suite |
| **Containers** | Containerization | Docker & Docker Compose | Multi-stage Dockerfiles for API and Web |

---

## Repository Structure

```text
mira/
├── apps/
│   ├── api/                      # Rust Axum Backend
│   │   ├── src/
│   │   │   ├── main.rs           # Server entry point & CLI commands
│   │   │   ├── api/              # HTTP routes, request handlers & extractors
│   │   │   ├── application/      # Domain services & business logic
│   │   │   ├── database/         # SQLx pool setup, migrations & seed engine
│   │   │   ├── domain/           # Core entity types & domain models
│   │   │   └── infrastructure/   # Auth, JWT, AI/Groq client, middleware
│   │   ├── tests/                # Rust API & security integration tests
│   │   └── Cargo.toml            # Rust dependencies & metadata
│   └── web/                      # React TanStack Frontend
│       ├── src/
│       │   ├── routes/           # TanStack file-based routes
│       │   ├── components/       # UI components (gov, mira, ui)
│       │   │   ├── gov/          # Family360, DocumentViewer, PageHeader
│       │   │   └── mira/         # Profile, Shell, Workstation layouts
│       │   ├── lib/              # API client, app state, i18n, role config
│       │   ├── test/             # Vitest frontend tests
│       │   └── routeTree.gen.ts  # Generated route tree
│       └── package.json          # Frontend dependencies & scripts
├── migrations/                   # SQL migration scripts (0001 to 0008)
├── docker/                       # Production & development Dockerfiles
├── scripts/                      # Shell orchestration scripts (dev, test, seed)
├── docker-compose.yml            # Local containerized development stack
├── package.json                  # Root monorepo scripts
└── README.md                     # Platform documentation
```

---

## Local Development & Setup

### Prerequisites
- **Node.js** (v20+ recommended) and **npm**
- **Rust** and **Cargo** (v1.75+ recommended)
- **Docker** and **Docker Compose** (for PostgreSQL)

### Step 1: Clone and Install Dependencies

```bash
git clone <repository-url>
cd mira

# Install web application dependencies
npm --prefix apps/web install
```

### Step 2: Start PostgreSQL Database

```bash
# Launch PostgreSQL 18 container on port 5433
docker compose up -d postgres
```

### Step 3: Run Database Migrations and Seed Data

```bash
# Run migrations and seed synthetic demonstration records
npm run seed
```

### Step 4: Start Development Servers

```bash
# Concurrently starts API on port 4000 and Web on port 5173
npm run dev
```

Once running:
- **Frontend Portal:** `http://localhost:5173`
- **Core API Health:** `http://localhost:4000/api/v1/health`

---

## Environment Variables

Configuration is managed via environment variables. Copy `.env.example` to `.env`:

```env
# Application Environment
APP_ENV=development
MIRA_DEMO_MODE=true
PORT=4000

# PostgreSQL Connection
DATABASE_URL=postgres://postgres@127.0.0.1:5433/mira_dev

# Cryptographic Token Secret (Minimum 32 characters)
JWT_SECRET=mira-v1-foundation-secure-jwt-secret-key-minimum-32-chars
JWT_EXPIRATION_HOURS=24

# Allowed CORS Origins
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000

# Optional Groq AI Integration
# GROQ_API_KEY=your_api_key_here
# GROQ_MODEL=llama-3.3-70b-versatile

# Logging
RUST_LOG=mira_api=info,tower_http=info
```

---

## Testing & Quality Checks

Run the verification suites before committing changes:

```bash
# 1. Full Platform Test Suite (Rust backend tests + Vitest frontend tests)
npm test

# 2. Frontend Vitest Tests
cd apps/web && npm test

# 3. Production Builds
npm run build:web
npm run build:api
```

---

## Known Limitations

- **Synthetic Registries:** All citizen records, land revenue Khatauni documents, bank accounts, and scheme data are synthetic. The platform is not connected to live UIDAI CIDR, State Land Records, or PFMS treasury gateways.
- **Document OCR Extensibility:** OCR text extraction currently parses structured templates and demo PDFs. Complex scanned handwritten documents require integration with a cloud document intelligence service in production.
- **Multilingual Completeness:** Full UI localization is implemented for English (`en`) and Hindi (`hi`). Additional regional Indian languages have dictionary scaffolds in place with partial string coverage.
- **Local Evidence Storage:** Evidence documents are stored in the local file system or mounted Docker volumes rather than an S3-compatible cloud object store with WORM (Write Once Read Many) immutability.

---

## Roadmap

### Current (Completed)
- API-backed household and family registry with multi-generational support.
- Native `Family360` interactive SVG graph with zoom, pan, BFS path finder, and 360 member dossier.
- Deterministic scheme eligibility rule engine with explainable criteria.
- Complete application lifecycle with split-screen document verification and clarification threads.
- Personal Account Center with "My Audit Activity" separated from the privileged institutional Audit Ledger.

### Next
- Cloud object storage adapter (S3 / Azure Blob) for evidence vault attachments with client-side envelope encryption.
- Extended regional language localization dictionaries across all 22 official languages.
- Webhook notification dispatchers for SMS (CDAC gateway) and email notifications.

### Future
- Open-standard Verifiable Credentials (W3C VC) issuance for certified eligibility certificates.
- Multi-party zero-knowledge proof verification for income thresholds without disclosing raw financial values.

---

## Development Guidelines

1. **Authorization First:** Always enforce role and record-level authorization in `apps/api/src/application/mod.rs`. Never rely on frontend UI hiding for access control.
2. **Preserve Connected Records:** Avoid creating disconnected mock data stores inside UI components. All features must read from and write to the primary relational models.
3. **Audit State Changes:** Every state mutation (application status change, document verification, relationship update) must emit a structured audit log entry.
4. **Defense in Depth:** Treat all user inputs, uploaded file contents, and OCR extractions as untrusted data before passing to backend services or LLM context builders.
