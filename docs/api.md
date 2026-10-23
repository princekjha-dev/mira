# Mira V1 — Foundation API Documentation

Version: `v1`  
Product: **Mira**  
Base Path: `/api/v1`

---

## 1. Overview & Security Foundation

Mira's V1 core API is implemented in Rust using Axum and Tokio. It enforces:
- **Strong Typing & Domain Separation:** Business logic resides in the application domain layer, not HTTP handlers.
- **Argon2id Password Hashing:** Salted, memory-hard Argon2id hashes. Plaintext passwords and hashes are never exposed.
- **Multi-User Isolation & Object-Level Authorization:** Users cannot access foreign protected resources by tampering with resource IDs.
- **Deterministic Correlation IDs:** Every request receives an `x-request-id` header traced across logs, responses, and audit records.
- **Auditing:** Security events (logins, logouts, failures, profile changes) are recorded into `audit_events`.

---

## 2. Standard Error Format

All error responses strictly follow the unified format:

```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Access denied: insufficient permissions to view other users' profiles",
    "request_id": "req-9f3b2a-1729584"
  }
}
```

Standard error codes:
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `BAD_REQUEST` (400)
- `CONFLICT` (409)
- `VALIDATION_ERROR` (422)
- `INTERNAL_ERROR` (500)

---

## 3. Endpoints

### 3.1 Health & Status

#### `GET /api/v1/health`
Returns live platform health and infrastructure verification.

**Response `200 OK`:**
```json
{
  "data": {
    "status": "healthy",
    "api_version": "v1",
    "database_connected": true,
    "auth_system": "Argon2id + JWT + Object-Level Authorization",
    "environment": "development",
    "timestamp": "2026-10-22T08:30:00Z"
  }
}
```

---

### 3.2 Authentication

#### `POST /api/v1/auth/register`
Creates a synthetic demo user with the default `CITIZEN` role.

**Request Body:**
```json
{
  "email": "resident@mira.local",
  "password": "Password123!",
  "display_name": "Kavita Rao",
  "preferred_language": "hi"
}
```

**Response `201 Created`:**
```json
{
  "token": "eyJhbGciOi...",
  "token_type": "Bearer",
  "user": {
    "id": "e7c10b12-9c44-4e2b-8a84-814d485f79a1",
    "email": "resident@mira.local",
    "display_name": "Kavita Rao",
    "preferred_language": "hi",
    "roles": ["CITIZEN"],
    "organization": {
      "id": "c1f7218d-6490-410a-9d2c-c76646b9a897",
      "name": "Mira Demo Department",
      "code": "MIRA-DEMO-DEPT"
    },
    "created_at": "2026-10-22T08:30:00Z"
  }
}
```

#### `POST /api/v1/auth/login`
Authenticates user with Argon2id hash verification and issues JWT bearer token.

**Request Body:**
```json
{
  "email": "citizen@mira.local",
  "password": "MiraDemo@2026!"
}
```

**Response `200 OK`:**
```json
{
  "token": "eyJhbGciOi...",
  "token_type": "Bearer",
  "user": { ... }
}
```

#### `POST /api/v1/auth/logout`
Logs out user session and records security audit trail.  
*Requires Header:* `Authorization: Bearer <token>`

**Response `200 OK`:**
```json
{
  "message": "Successfully logged out"
}
```

#### `GET /api/v1/auth/me`
Retrieves authenticated session profile.  
*Requires Header:* `Authorization: Bearer <token>`

---

### 3.3 User Profile & Isolation

#### `GET /api/v1/profile`
Retrieves current caller's profile.

#### `GET /api/v1/profile/:id`
Retrieves a user profile by UUID.  
**Object-Level Authorization Guard:**
- If `:id` == caller's ID: **Allowed (200 OK)**
- If caller has `AUDITOR`, `DEPARTMENT_ADMIN`, or `SUPER_ADMIN` role: **Allowed (200 OK)**
- If caller is a `CITIZEN` or unauthorized role attempting to read another user's ID: **Denied (403 Forbidden)**

#### `PUT /api/v1/profile/preferences`
Updates caller's display name and preferred language.

**Request Body:**
```json
{
  "display_name": "Rajesh Kumar",
  "preferred_language": "hi"
}
```

---

### 3.4 Audit Trail

#### `GET /api/v1/audit/events?limit=50`
Accessible only to `AUDITOR`, `DEPARTMENT_ADMIN`, and `SUPER_ADMIN` roles. Returns security events.
