# Mira — Unified Digital Platform for Accessible Public Documentation

> **V1 Foundation — PS 7: Unified Digital Platform for Accessible Public Documentation**  
> A privacy-first, explainable civic platform built with **React/TypeScript**, **Rust/Axum**, and **PostgreSQL**.

---

## 1. Product Overview

**Mira** is designed to solve the challenges of fragmented government records, household relationships, welfare benefits, and duplicate household-level claims.

### V1 Scope Discipline
This release is strictly **Version 1 (Foundation)**. It establishes the secure architectural foundation without premature complexity.
- **NO** premature AI / LLM dependencies
- **NO** OpenDots
- **NO** real Aadhaar or biometrics
- **NO** 3D or heavy decorative animations
- **NO** fake statistics or fabricated claim metrics
- **NO** premature file upload / OCR document pipelines

V1 delivers a real, runnable, tested system with:
1. **Strong Multi-User Isolation & Object-Level Authorization** (Backend enforced — User A cannot access User B's resources)
2. **Robust Role-Based Access Control** (`CITIZEN`, `FIELD_OFFICIAL`, `VERIFICATION_OFFICER`, `DEPARTMENT_ADMIN`, `AUDITOR`, `SUPER_ADMIN`)
3. **Argon2id Cryptographic Password Hashing & JWT Sessions**
4. **Per-User Persistent Multilingual Architecture** (English `en` and Hindi `hi`)
5. **Real-Data Dashboard & Traceable Security Auditing** (`audit_events`)
6. **Deterministic Seed Data & Reversible PostgreSQL Migrations**

---

## 2. Quick Start: One Command Sequence

### Prerequisites
- Node.js (v20+) and npm
- Rust stable toolchain (1.80+) and Cargo
- PostgreSQL (16+) running locally, or Docker

### 1-Command Local Launch

```bash
# Clone and enter directory
cd /path/to/mira

# Start the local database (Docker Compose publishes it on port 5433)
docker compose up -d postgres

# Start both Rust Axum API and React Frontend concurrently
npm run dev
```

The services will be available at:
- **Web Frontend:** [http://localhost:5173](http://localhost:5173)
- **Core Rust API:** [http://localhost:4000](http://localhost:4000)
- **API Health:** [http://localhost:4000/api/v1/health](http://localhost:4000/api/v1/health)

---

## 3. Synthetic Demo Environment & Credentials

Mira V1 includes a **Synthetic Demo Environment** ("Mira Demo Department") populated with deterministic seed accounts:

| Role | Demo Email | Password | Primary Scope |
| :--- | :--- | :--- | :--- |
| **CITIZEN** | `citizen@mira.local` | `MiraDemo@2026!` | Resident profile, personal preferences |
| **FIELD_OFFICIAL** | `officer@mira.local` | `MiraDemo@2026!` | Field collection & credential review |
| **VERIFICATION_OFFICER** | `verifier@mira.local` | `MiraDemo@2026!` | Claim adjudication & verification |
| **DEPARTMENT_ADMIN** | `admin@mira.local` | `MiraDemo@2026!` | Departmental operations & audit review |
| **AUDITOR** | `auditor@mira.local` | `MiraDemo@2026!` | Independent oversight & security audit logs |

> **Note:** The web frontend login page includes a **1-click autofill selector** for each role to streamline evaluation.

---

## 4. Multi-User Isolation & Security Guarantees

A core requirement of Mira V1 is **backend-enforced object-level authorization**.

### IDOR Protection Guarantee
- Frontend filtering is **never** relied upon for isolation.
- When an authenticated user calls `GET /api/v1/profile/:id`:
  - Access to their **own** profile (`caller.id == target.id`) is permitted (`200 OK`).
  - Access to a **foreign** profile by a `CITIZEN` or unauthorized role is **actively denied with `403 Forbidden`**.
  - Only authorized oversight roles (`AUDITOR`, `DEPARTMENT_ADMIN`, `SUPER_ADMIN`) have legitimate multi-profile inspection rights.
- **Automated Test Proof:** The test suite includes `test_mandatory_multi_user_isolation_and_idor_protection` which registers User A and User B and validates that User A is rejected when attempting to read User B's profile.
- **Interactive In-App Proof:** The dashboard includes a live "Test IDOR Protection" action that demonstrates the `403 Forbidden` response in real time.

---

## 5. Technology Stack

### Frontend (`apps/web`)
- **React 18 + TypeScript + Vite**
- **Tailwind CSS** (Calm, accessible, trustworthy civic design system)
- **React Router v6** (Protected routing & role-based route guards)
- **TanStack Query v5** (Server state synchronization)
- **Zod** (Client-side input schema validation)
- **Lucide React** (Consistent iconography)
- **i18n Translation Engine** (Key-based, per-user persistent dictionary for `en` and `hi`)

### Backend (`apps/api`)
- **Rust (Stable)**
- **Axum 0.7** (High-throughput, memory-safe web framework)
- **Tokio** (Asynchronous runtime)
- **SQLx 0.7** (Typed PostgreSQL integration with connection pooling)
- **Argon2id** (Memory-hard salted password hashing)
- **jsonwebtoken** (Stateless, signed claims with correlation tracking)
- **tracing / tracing-subscriber** (Structured JSON operational logging)
- **UUID v4 & Chrono** (Type-safe identifiers and timestamps)

### Database (`migrations/`)
- **PostgreSQL 18** (System of record)
- UUID primary keys for all entities
- Foundation tables: `users`, `roles`, `user_roles`, `organizations`, `user_organizations`, `sessions`, `audit_events`
- Fully reversible migrations (`0001_initial_schema.sql` and `0001_initial_schema_down.sql`)

---

## 6. Repository Architecture

```text
mira/
├── apps/
│   ├── web/                    # React + TypeScript + Vite frontend
│   │   ├── src/
│   │   │   ├── api/            # API client with correlation IDs
│   │   │   ├── components/     # Accessible UI components (Navbar, RoleBadge, ProtectedRoute)
│   │   │   ├── context/        # Auth and state contexts
│   │   │   ├── i18n/           # English (en.json) & Hindi (hi.json) dictionaries
│   │   │   ├── pages/          # Login, Register, Dashboard, Profile, AuditTrail
│   │   │   ├── test/           # Vitest unit test suite
│   │   │   └── types/          # Shared frontend domain interfaces
│   └── api/                    # Rust Axum core backend
│       ├── src/
│       │   ├── api/            # Axum router & thin HTTP handlers
│       │   ├── application/    # Domain services (Auth, Profile, Audit, Health)
│       │   ├── auth/           # Argon2id hasher, JWT claims, CurrentUser extractor
│       │   ├── config/         # Environment configuration
│       │   ├── database/       # Connection pool, migration runner, seed script
│       │   ├── domain/         # Strongly-typed domain models & V2 extension contracts
│       │   ├── errors/         # Consistent error format { error: { code, message, request_id } }
│       │   ├── infrastructure/ # Tracing, request ID middleware, CORS, security headers
│       │   └── main.rs         # Application entry point
│       └── tests/              # Rust integration & IDOR security test suite
├── migrations/                 # Reversible SQL migrations
│   ├── 0001_initial_schema.sql
│   └── 0001_initial_schema_down.sql
├── scripts/                    # Automation scripts (dev.sh, test.sh, seed.sh)
├── docs/                       # API documentation (docs/api.md)
├── docker/                     # Dockerfiles for web and api
├── docker-compose.yml          # Containerized development orchestration
├── .env.example                # Sample environment variables
└── README.md
```

---

## 7. Running Tests

Run the complete automated test suite across backend and frontend:

```bash
# Run both backend integration tests and frontend unit tests
./scripts/test.sh
```

Or individually:

```bash
# Rust backend integration & IDOR tests
cd apps/api
cargo test

# Frontend Vitest unit tests
cd apps/web
npm test
```

---

## 8. Docker Deployment

To launch the full environment (PostgreSQL + Rust API + Nginx Web) using Docker:

```bash
docker compose up --build
```

---

## 9. V2 Readiness: Extension Path Without Rewriting V1

Mira V1 establishes clean boundaries so Version 2 can implement:
1. **Temporal Household Graph:** `Household`, `Person`, `HouseholdMembership` (with `valid_from`, `valid_to` intervals) link cleanly to existing `user_id` and `organization_id` foreign keys.
2. **Benefit-Scope Engine:** Entitlement definitions (`BenefitScheme`) and claims (`Application`) attach directly to the existing organization and role isolation model.
3. **Cryptographic Audit Hash Chain:** The `audit_events` table already includes `previous_hash` and `current_hash` columns, enabling seamless activation of SHA-256 block chaining in V2.
4. **Deterministic Evidence Pipeline:** Future duplicate detection and machine-assisted verification will operate over deterministic domain models without modifying core authentication or tenancy.
# mira
