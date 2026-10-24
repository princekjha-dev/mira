import type { Session, Role } from "./app-state";
import {
  APPLICATIONS,
  AUDIT,
  BENEFITS,
  CITIZEN,
  HOUSEHOLD,
  MEMBERS,
  NOTIFICATIONS,
  SCHEMES,
  VAULT,
} from "./data";
import type {
  Application,
  AppEvent,
  AppStatus,
  Benefit,
  Notification,
  AuditEvent,
} from "./data";

// Use same-origin /api by default: Vite and the production nginx container proxy
// it to the API. An explicit base URL remains available for split deployments.
const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

export interface ApiDocument {
  id: string;
  public_id: string;
  owner_type: string;
  owner_id: string;
  document_type: string;
  original_filename: string;
  detected_mime_type: string;
  size_bytes: number;
  original_size_bytes: number;
  sha256: string;
  storage_reference: string;
  status: string;
  verification_status: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  supersedes_document_id?: string | null;
  version_number?: number;
  expires_at?: string | null;
}

export interface ApiEnvelope<T> {
  data: T;
}

export class ApiRequestError extends Error {
  readonly code?: string;
  readonly status: number;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
  }
}

export interface ApiAuthResponse {
  token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    display_name: string;
    roles: string[];
    is_demo: boolean;
    organization?: { name: string } | null;
  };
}

export const apiUrl = (path: string) => `${API_BASE}${path}`;

const isLocalDemoSession = (
  value: Session | string | null,
): boolean =>
  Boolean(
    value &&
      typeof value === "object" &&
      value.isDemo &&
      (value.authSource === "local-demo" || !value.apiToken),
  );

export async function apiRequest<T>(
  sessionOrToken: Session | string | null,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  if (isLocalDemoSession(sessionOrToken)) {
    return localDemoApiRequest<T>(sessionOrToken as Session, path, init);
  }
  const token =
    typeof sessionOrToken === "string"
      ? sessionOrToken
      : sessionOrToken?.apiToken;
  const headers = new Headers(init.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (
    init.body &&
    !(init.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }
  const response = await fetch(apiUrl(path), { ...init, headers });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      error?: { code?: string; message?: string } | boolean;
      code?: string;
      message?: string;
    } | null;
    const errorObject =
      body?.error && typeof body.error === "object" ? body.error : body;
    throw new ApiRequestError(
      errorObject?.message || `Request failed (${response.status}). Please retry.`,
      response.status,
      errorObject?.code,
    );
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export async function loginUser(
  email: string,
  password: string,
): Promise<ApiAuthResponse> {
  let response: Response;
  try {
    response = await fetch(apiUrl("/api/v1/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch (error) {
    console.error("Mira authentication request network error:", error);
    throw new Error(
      "Unable to reach the authentication service. Please check your network connection.",
    );
  }
  const payload = (await response.json().catch(() => null)) as
    (ApiAuthResponse & { error?: { code?: string; message?: string } }) | null;
  if (!response.ok || !payload?.token) {
    throw new Error(
      response.status === 401
        ? "Invalid email or password. Please check your credentials and try again."
        : response.status >= 500
          ? "Authentication service encountered an unexpected error. Please retry."
          : payload?.error?.message || "Unable to sign in. Please verify your credentials.",
    );
  }
  return payload;
}

export async function registerUser(
  email: string,
  password: string,
  displayName: string,
): Promise<ApiAuthResponse> {
  const response = await fetch(apiUrl("/api/v1/auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password,
      display_name: displayName,
      preferred_language: "en",
    }),
  });
  const payload = (await response.json().catch(() => null)) as
    (ApiAuthResponse & { error?: { message?: string } }) | null;
  if (!response.ok || !payload?.token) {
    throw new Error(
      payload?.error?.message ||
        "Registration failed. Please check your information.",
    );
  }
  return payload;
}

export async function getMe(token: string): Promise<ApiAuthResponse["user"]> {
  const res = await apiRequest<ApiEnvelope<ApiAuthResponse["user"]>>(
    token,
    "/api/v1/auth/me",
  );
  return res.data;
}

export type DemoHealthState = "ready" | "initializing" | "degraded" | "unavailable";

export async function checkDemoHealth(): Promise<{
  state: DemoHealthState;
  details?: string;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(apiUrl("/api/v1/health"), {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        state: "unavailable",
        details: `Service returned HTTP ${response.status}`,
      };
    }

    const payload = (await response.json().catch(() => null)) as {
      data?: {
        status?: string;
        database_connected?: boolean;
      };
    } | null;

    if (payload?.data?.database_connected === false) {
      return {
        state: "degraded",
        details: "Database connection degraded",
      };
    }

    if (payload?.data?.status === "healthy" || response.status === 200) {
      return { state: "ready" };
    }

    return { state: "degraded" };
  } catch (error) {
    return {
      state: "unavailable",
      details: error instanceof Error ? error.message : "Service unreachable",
    };
  }
}

export async function authenticateDemo(
  role: "citizen" | "officer" | "verifier" | "scheme" | "supervisor" | "admin" | "auditor",
): Promise<ApiAuthResponse> {
  let response: Response;
  try {
    response = await fetch(apiUrl("/api/v1/auth/demo-login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
  } catch (error) {
    console.error("Mira demo authentication request network error:", error);
    throw new ApiRequestError("Demo authentication service is unreachable.", 0, "CONNECTION_ERROR");
  }
  const payload = (await response.json().catch(() => null)) as
    (ApiAuthResponse & { error?: { code?: string; message?: string } }) | null;
  if (!response.ok || !payload?.token) {
    const errorObject = payload?.error && typeof payload.error === "object" ? payload.error : undefined;
    throw new ApiRequestError(
      errorObject?.message || "Unable to open this demo account.",
      response.status,
      errorObject?.code,
    );
  }
  if (!payload.user.is_demo) {
    throw new ApiRequestError("This account is not configured as a demo identity.", 403, "DEMO_ACCOUNT_REQUIRED");
  }
  return payload;
}

export function mapRoleToUiRole(roles: string[]): Role {
  if (roles.includes("AUDITOR")) return "auditor";
  if (roles.includes("SUPERVISOR")) return "supervisor";
  if (roles.includes("SCHEME_OFFICER")) return "scheme";
  if (roles.includes("VERIFICATION_OFFICER")) return "verifier";
  if (roles.includes("FIELD_OFFICIAL") || roles.includes("OFFICER"))
    return "officer";
  if (roles.includes("DEPARTMENT_ADMIN") || roles.includes("SUPER_ADMIN")) return "admin";
  return "citizen";
}

export function mapBackendAppToFrontend(raw: any): Application {
  const meta = raw.metadata || {};
  const statusStr = raw.status || "DRAFT";

  let status: AppStatus = "Draft";
  let stage = 0;
  if (statusStr === "DRAFT") {
    status = "Draft";
    stage = 0;
  } else if (statusStr === "SUBMITTED") {
    status = "Submitted";
    stage = 1;
  } else if (statusStr === "UNDER_VERIFICATION") {
    status = meta.verification_task
      ? "Verification Required"
      : "Documents Under Review";
    stage = 2;
  } else if (statusStr === "EVIDENCE_REQUIRED") {
    status = "Additional Evidence Required";
    stage = 3;
  } else if (statusStr === "APPROVED" || statusStr === "DISBURSED") {
    status = "Approved";
    stage = 5;
  } else if (statusStr === "REJECTED") {
    status = "Rejected";
    stage = 5;
  } else {
    status = "Officer Review";
    stage = 4;
  }

  const events: AppEvent[] = [];
  if (raw.created_at) {
    events.push({
      date: raw.created_at.replace("T", " ").slice(0, 16),
      text: "Application drafted",
      by: raw.applicant_name || "Applicant",
    });
  }
  if (raw.submitted_at) {
    events.push({
      date: raw.submitted_at.replace("T", " ").slice(0, 16),
      text: "Application submitted",
      by: raw.applicant_name || "Applicant",
    });
  }
  if (meta.assignment) {
    events.push({
      date: (meta.assignment.assigned_at || "").replace("T", " ").slice(0, 16),
      text: `Assigned to ${meta.assignment.assigned_to_name || "Officer"}`,
      by: "Assignment Engine",
    });
  }
  if (Array.isArray(meta.evidence_requests)) {
    for (const req of meta.evidence_requests) {
      events.push({
        date: (req.requested_at || "").replace("T", " ").slice(0, 16),
        text: `Evidence requested: ${req.evidence_type} (${req.reason})`,
        by: "Officer",
      });
      if (req.submitted_at) {
        events.push({
          date: req.submitted_at.replace("T", " ").slice(0, 16),
          text: `Evidence submitted: ${req.explanation || "Document attached"}`,
          by: raw.applicant_name || "Applicant",
        });
      }
    }
  }
  if (meta.verification_task) {
    events.push({
      date: (meta.verification_task.verified_at || "")
        .replace("T", " ")
        .slice(0, 16),
      text: `Field verification completed: ${meta.verification_task.findings || "All checks verified"}`,
      by: "Verification Officer",
    });
  }
  if (meta.decision) {
    events.push({
      date: (meta.decision.decided_at || "").replace("T", " ").slice(0, 16),
      text: `Decision: ${meta.decision.decision || "Completed"} - ${meta.decision.reason || ""}`,
      by: meta.decision.decided_by_name || "Approving Authority",
    });
  }

  let decision: Application["decision"] = undefined;
  if (meta.decision) {
    decision = {
      outcome: meta.decision.decision === "APPROVED" ? "Approved" : "Rejected",
      reason: meta.decision.reason || "Eligibility criteria met",
      note: meta.decision.notes || "",
      by: meta.decision.decided_by_name || "Authorized Officer",
      date: (meta.decision.decided_at || "").slice(0, 10),
    };
  } else if (raw.status === "APPROVED") {
    decision = {
      outcome: "Approved",
      reason: "All eligibility conditions and documents verified",
      note: "Standard public assistance approval",
      by: "Competent Authority",
      date: (raw.updated_at || "").slice(0, 10),
    };
  }

  // Scheme ID fallback mapping
  let schemeId = raw.scheme_id;
  if (raw.scheme_code === "SCH_STUDENT_SCHOLARSHIP") schemeId = "post-matric";
  else if (raw.scheme_code === "SCH_HH_SANITATION") schemeId = "sanitation";
  else if (raw.scheme_code === "SCH_WATER_CONNECTION")
    schemeId = "rural-housing";

  return {
    id: raw.application_number || raw.public_id || raw.id,
    schemeId,
    applicant: raw.applicant_name || "Citizen Applicant",
    citizenId: raw.applicant_person_id || "C-1001",
    householdId:
      raw.target_household_id || raw.target_household_name || "HH-UP-0417-2291",
    appliedOn: raw.submitted_at
      ? raw.submitted_at.slice(0, 10)
      : raw.application_date || "",
    updatedOn: (raw.updated_at || "").slice(0, 10),
    status,
    stage,
    declaredIncome: Number(meta.income || 180000),
    events:
      events.length > 0
        ? events
        : [
            {
              date: (raw.created_at || "").slice(0, 10),
              text: "Application created",
              by: "Citizen",
            },
          ],
    decision,
    metadata: meta,
    rawId: raw.id,
    schemeName: raw.scheme_name,
  } as Application & { metadata?: any; rawId?: string; schemeName?: string };
}

export function mapBackendNotification(n: any): Notification {
  let link = undefined;
  if (n.entity_type === "APPLICATION" && n.entity_id) {
    link = `/citizen/applications/${n.entity_id}`;
  }
  return {
    id: n.id,
    title: n.title,
    body: n.message,
    date: (n.created_at || "").slice(0, 10),
    read: n.read,
    link,
  };
}

export function mapBackendAuditEvent(e: any): AuditEvent {
  const details = e.details || {};
  return {
    id: e.id ? e.id.slice(0, 10) : "EV-" + Date.now(),
    ts: (e.created_at || "").replace("T", " ").slice(0, 19),
    actor:
      details.email || (e.user_id ? `User ${e.user_id.slice(0, 8)}` : "System"),
    action: e.event_type || "SYSTEM_EVENT",
    application: details.application_id || details.scheme_code || "-",
    prev: details.previous_status || "-",
    next: details.new_status || details.status || "-",
    reason: details.reason || details.findings || details.notes || "-",
  };
}

export function mapBackendBenefit(b: any): Benefit {
  const backendStatus = String(b.status || "").toUpperCase();
  const status: Benefit["status"] =
    backendStatus === "DISBURSED"
      ? "Disbursed"
      : backendStatus === "COMPLETED"
        ? "Completed"
        : backendStatus === "SUSPENDED"
          ? "Suspended"
          : backendStatus === "REJECTED"
            ? "Rejected"
            : backendStatus === "EXPIRED"
              ? "Expired"
              : backendStatus === "PENDING"
                ? "Pending"
                : backendStatus === "UNDER_REVIEW"
                  ? "Under Review"
                  : backendStatus === "APPROVED" || backendStatus === "ACTIVE"
                    ? "Active"
                    : "Pending";
  return {
    ref: b.public_id || b.id,
    schemeId:
      b.scheme_id ||
      b.schemeId ||
      (b.scheme_name
        ? b.scheme_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
        : "general"),
    scheme: b.scheme_name || "Scheme name unavailable",
    beneficiary:
      b.person_name || b.household_name || "Named beneficiary unavailable",
    type: b.benefit_unit_type === "HOUSEHOLD" ? "Household" : "Individual",
    approvedOn: (b.approved_at || b.created_at || "").slice(0, 10),
    status,
    department: b.department_name || b.department || "",
    amount: typeof b.amount === "number" ? b.amount : null,
    currency: b.currency || null,
    applicationId: b.application_id || null,
    validTo: b.valid_to || null,
    entitlementDescription: b.entitlement_description || b.description || undefined,
    decisionRef: b.decision_ref || b.decision_id || undefined,
  };
}

// ----------------------------------------------------------------------------
// APPLICATION API CALLS
// ----------------------------------------------------------------------------

export async function fetchApplications(
  session: Session | null,
): Promise<Application[]> {
  if (isLocalDemoSession(session)) return [...APPLICATIONS];
  if (!session?.apiToken) return [];
  const res = await apiRequest<ApiEnvelope<any[]>>(
    session,
    "/api/v1/applications",
  );
  return (res.data || []).map(mapBackendAppToFrontend);
}

export async function fetchApplicationById(
  session: Session | null,
  id: string,
): Promise<Application> {
  if (isLocalDemoSession(session)) {
    const application = APPLICATIONS.find((item) => item.id === id);
    if (!application) throw new ApiRequestError("Application not found in the demo workspace.", 404, "APPLICATION_NOT_FOUND");
    return application;
  }
  const res = await apiRequest<ApiEnvelope<any>>(
    session,
    `/api/v1/applications/${id}`,
  );
  return mapBackendAppToFrontend(res.data);
}

export async function createBackendApplication(
  session: Session | null,
  schemeId: string,
  metadata: Record<string, any> = {},
): Promise<Application> {
  const res = await apiRequest<ApiEnvelope<any>>(
    session,
    "/api/v1/applications",
    {
      method: "POST",
      body: JSON.stringify({ scheme_id: schemeId, metadata }),
    },
  );
  return mapBackendAppToFrontend(res.data);
}

export async function updateBackendApplication(
  session: Session | null,
  id: string,
  payload: {
    status?: string;
    current_stage?: string;
    metadata?: Record<string, any>;
  },
): Promise<Application> {
  const res = await apiRequest<ApiEnvelope<any>>(
    session,
    `/api/v1/applications/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  return mapBackendAppToFrontend(res.data);
}

export async function submitBackendApplication(
  session: Session | null,
  id: string,
): Promise<Application> {
  const res = await apiRequest<ApiEnvelope<any>>(
    session,
    `/api/v1/applications/${id}/submit`,
    {
      method: "POST",
    },
  );
  return mapBackendAppToFrontend(res.data);
}

export async function assignBackendApplication(
  session: Session | null,
  id: string,
  assignedTo: string,
  notes?: string,
): Promise<Application> {
  const res = await apiRequest<ApiEnvelope<any>>(
    session,
    `/api/v1/applications/${id}/assign`,
    {
      method: "POST",
      body: JSON.stringify({ assigned_to: assignedTo, notes }),
    },
  );
  return mapBackendAppToFrontend(res.data);
}

export async function requestBackendEvidence(
  session: Session | null,
  id: string,
  payload: {
    evidence_type: string;
    reason: string;
    description: string;
    deadline?: string;
  },
): Promise<Application> {
  const res = await apiRequest<ApiEnvelope<any>>(
    session,
    `/api/v1/applications/${id}/request-evidence`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
  return mapBackendAppToFrontend(res.data);
}

export async function submitBackendEvidence(
  session: Session | null,
  id: string,
  payload: { request_id: string; document_id?: string; explanation?: string },
): Promise<Application> {
  const res = await apiRequest<ApiEnvelope<any>>(
    session,
    `/api/v1/applications/${id}/submit-evidence`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
  return mapBackendAppToFrontend(res.data);
}

export async function verifyBackendApplication(
  session: Session | null,
  id: string,
  payload: {
    findings: string;
    status?: string;
    verified_household?: boolean;
    verified_address?: boolean;
  },
): Promise<Application> {
  const res = await apiRequest<ApiEnvelope<any>>(
    session,
    `/api/v1/applications/${id}/verify`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
  return mapBackendAppToFrontend(res.data);
}

export async function approveBackendApplication(
  session: Session | null,
  id: string,
): Promise<any> {
  const res = await apiRequest<ApiEnvelope<any>>(
    session,
    `/api/v1/applications/${id}/approve`,
    {
      method: "POST",
    },
  );
  return res.data;
}

export async function rejectBackendApplication(
  session: Session | null,
  id: string,
  reason: string,
  notes: string,
): Promise<Application> {
  const res = await apiRequest<ApiEnvelope<any>>(
    session,
    `/api/v1/applications/${id}/reject`,
    {
      method: "POST",
      body: JSON.stringify({ reason, notes }),
    },
  );
  return mapBackendAppToFrontend(res.data);
}

// ----------------------------------------------------------------------------
// NOTIFICATIONS & AUDIT API CALLS
// ----------------------------------------------------------------------------

export async function fetchNotifications(
  session: Session | null,
): Promise<Notification[]> {
  if (isLocalDemoSession(session)) return [...NOTIFICATIONS];
  if (!session?.apiToken) return [];
  const res = await apiRequest<ApiEnvelope<any[]>>(
    session,
    "/api/v1/notifications",
  );
  return (res.data || []).map(mapBackendNotification);
}

export async function markBackendNotificationRead(
  session: Session | null,
  id: string,
): Promise<void> {
  await apiRequest<void>(session, `/api/v1/notifications/${id}/read`, {
    method: "POST",
  });
}

export async function fetchAuditEvents(
  session: Session | null,
  limit = 50,
): Promise<AuditEvent[]> {
  if (isLocalDemoSession(session)) return AUDIT.slice(0, limit);
  if (!session?.apiToken) return [];
  const res = await apiRequest<ApiEnvelope<any[]>>(
    session,
    `/api/v1/audit/events?limit=${limit}`,
  );
  return (res.data || []).map(mapBackendAuditEvent);
}

export async function fetchBenefits(
  session: Session | null,
): Promise<Benefit[]> {
  if (isLocalDemoSession(session)) return [...BENEFITS];
  if (!session?.apiToken) return [];
  const res = await apiRequest<ApiEnvelope<any[]>>(session, "/api/v1/benefits");
  return (res.data || []).map(mapBackendBenefit);
}

export async function fetchSchemes(): Promise<any[]> {
  try {
    const res = await fetch(apiUrl("/api/v1/schemes"));
    if (!res.ok) return [...SCHEMES];
    const data = (await res.json()) as ApiEnvelope<any[]>;
    return data.data?.length ? data.data : [...SCHEMES];
  } catch {
    return [...SCHEMES];
  }
}

// ----------------------------------------------------------------------------
// DOCUMENT UPLOAD & ACCESS
// ----------------------------------------------------------------------------

const encodeBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Unable to read this file."));
    reader.onload = () => {
      const value = String(reader.result);
      resolve(value.slice(value.indexOf(",") + 1));
    };
    reader.readAsDataURL(file);
  });

export function uploadDocument(
  session: Session,
  file: File,
  documentType: string,
  onProgress: (loaded: number, total: number) => void,
  replaceId?: string,
  originalFile: File = file,
): Promise<ApiDocument> {
  if (isLocalDemoSession(session)) {
    const documents = getLocalDemoDocuments();
    const now = new Date().toISOString();
    const localDocument: ApiDocument = {
      id: `local-${Date.now()}`,
      public_id: `DEMO-DOC-${Date.now()}`,
      owner_type: "CITIZEN",
      owner_id: session.apiUserId || CITIZEN.id,
      document_type: documentType,
      original_filename: originalFile.name,
      detected_mime_type: originalFile.type || "application/octet-stream",
      size_bytes: originalFile.size,
      original_size_bytes: originalFile.size,
      sha256: "DEMO-ONLY",
      storage_reference: "metadata-only-local-demo",
      status: "READY",
      verification_status: "PENDING_REVIEW",
      created_by: session.apiUserId || null,
      created_at: now,
      updated_at: now,
      version_number: 1,
    };
    documents.unshift(localDocument);
    onProgress(originalFile.size, originalFile.size);
    return Promise.resolve(localDocument);
  }
  return Promise.all([
    encodeBase64(file),
    originalFile !== file && originalFile.size <= 25 * 1024 * 1024
      ? encodeBase64(originalFile)
      : Promise.resolve(""),
  ]).then(
    ([file_content_base64, original_file_content_base64]) =>
      new Promise<ApiDocument>((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open(
          "POST",
          apiUrl(
            replaceId
              ? `/api/v1/documents/${replaceId}/replace`
              : "/api/v1/documents",
          ),
        );
        request.setRequestHeader(
          "Authorization",
          `Bearer ${session.apiToken || ""}`,
        );
        request.setRequestHeader("Content-Type", "application/json");
        request.upload.onprogress = (event) =>
          onProgress(event.loaded, event.total || file_content_base64.length);
        request.onerror = () =>
          reject(
            new Error(
              "Network connection interrupted. Check your connection and retry.",
            ),
          );
        request.onabort = () =>
          reject(new Error("Upload interrupted. You can retry this file."));
        request.onload = () => {
          let payload:
            | (ApiEnvelope<ApiDocument> & { error?: { message?: string } })
            | null = null;
          try {
            payload = JSON.parse(request.responseText);
          } catch {
            /* handled below */
          }
          if (request.status < 200 || request.status >= 300 || !payload?.data) {
            const message =
              request.status === 401
                ? "401 Unauthorized"
                : request.status === 403
                  ? "403 Forbidden"
                  : request.status === 413
                    ? "413 File too large"
                    : request.status === 415
                      ? "415 Unsupported media type"
                      : request.status === 400 || request.status === 422
                        ? "422 Validation failed"
                        : request.status >= 500
                          ? "500 Storage server unavailable"
                          : "The upload service couldn't complete this request. Retry in a moment.";
            reject(new Error(message));
            return;
          }
          resolve(payload.data);
        };
        request.send(
          JSON.stringify(
            replaceId
              ? {
                  filename: file.name,
                  original_filename: originalFile.name,
                  specified_doc_type: documentType,
                  file_content_base64,
                  original_file_content_base64:
                    original_file_content_base64 || undefined,
                  original_file_mime_type: original_file_content_base64
                    ? originalFile.type
                    : undefined,
                }
              : {
                  filename: file.name,
                  original_filename: originalFile.name,
                  owner_type: "CITIZEN",
                  owner_id: session.apiUserId,
                  specified_doc_type: documentType,
                  access_purpose: "CITIZEN_SELF_SERVICE",
                  file_content_base64,
                  original_file_content_base64:
                    original_file_content_base64 || undefined,
                  original_file_mime_type: original_file_content_base64
                    ? originalFile.type
                    : undefined,
                },
          ),
        );
      }),
  );
}

export const documentPreviewUrl = (id: string) =>
  apiUrl(`/api/v1/documents/${id}/preview?purpose=CITIZEN_SELF_SERVICE`);
export const documentDownloadUrl = (id: string) =>
  apiUrl(`/api/v1/documents/${id}/download?purpose=CITIZEN_SELF_SERVICE`);

export interface ApiFamilyMember {
  id: string;
  person_id: string;
  public_id: string;
  name: string;
  relationship: string;
  membership_role: string;
  dob: string;
  gender: string;
  identity: string;
  membership: string;
  income: string | null;
  benefits: string[];
  is_current: boolean;
}

export interface ApiFamilyRelationship {
  id: string;
  person_a_id: string;
  person_b_id: string;
  person_a_name: string;
  person_b_name: string;
  relationship_type: string;
  valid_from: string | null;
  verification_status: string;
}

export interface ApiFamilyTimelineItem {
  date: string;
  event_type: string;
  title: string;
  description: string;
  source: string;
  evidence: string | null;
  verification_status: string;
  verified_by: string;
  timestamp: string;
}

export interface ApiFamilyRequest {
  id: string;
  type: string;
  requested_at: string;
  status: string;
  details: string;
  changes: Record<string, any>;
}

export interface ApiFamilyResponse {
  household_id: string;
  household_public_id: string;
  household_name: string;
  status: string;
  address: string;
  property_summary: string;
  bpl_status: string;
  income_category: string;
  verification_status: string;
  is_demo_data: boolean;
  disclaimer: string;
  members: ApiFamilyMember[];
  relationships: ApiFamilyRelationship[];
  timeline: ApiFamilyTimelineItem[];
  requests: ApiFamilyRequest[];
}

let cachedLocalDemoFamily: ApiFamilyResponse | null = null;
let cachedLocalDemoDocuments: ApiDocument[] | null = null;

function getLocalDemoFamily(): ApiFamilyResponse {
  if (cachedLocalDemoFamily) return cachedLocalDemoFamily;
  const members: ApiFamilyMember[] = MEMBERS.map((member) => ({
    id: member.id,
    person_id: member.id,
    public_id: member.id,
    name: member.name,
    relationship: member.relationship.toUpperCase().replaceAll(" ", "_"),
    membership_role: member.relationship === "Head of Household" ? "HEAD" : member.relationship.toUpperCase(),
    dob: member.dob,
    gender: member.gender,
    identity: member.identity.toUpperCase().replaceAll(" ", "_"),
    membership: member.membership.toUpperCase(),
    income: member.income || null,
    benefits: member.benefits,
    is_current: member.membership === "Active",
  }));
  const byId = (id: string) => members.find((member) => member.id === id);
  const relation = (id: string, a: string, b: string, type: string): ApiFamilyRelationship => ({
    id,
    person_a_id: a,
    person_b_id: b,
    person_a_name: byId(a)?.name || "",
    person_b_name: byId(b)?.name || "",
    relationship_type: type,
    valid_from: "2010-02-14",
    verification_status: "Verified",
  });
  const relationships = [
    relation("rel-spouse", "P-10482-01", "P-10482-02", "SPOUSE"),
    relation("rel-daughter", "P-10482-01", "P-10482-19", "DAUGHTER"),
    relation("rel-son", "P-10482-01", "P-10482-20", "SON"),
    relation("rel-father", "P-10482-03", "P-10482-01", "FATHER"),
    relation("rel-mother", "P-10482-04", "P-10482-01", "MOTHER"),
  ];
  const timeline: ApiFamilyTimelineItem[] = MEMBERS.flatMap((member) =>
    member.history.map((event, index) => ({
      date: event.date,
      event_type: "HOUSEHOLD_RECORD",
      title: event.event,
      description: `${member.name}: ${event.event}`,
      source: "Mira demo registry",
      evidence: null,
      verification_status: member.identity,
      verified_by: "Demo Registry",
      timestamp: `${event.date}T00:00:00Z-${member.id}-${index}`,
    })),
  );
  cachedLocalDemoFamily = {
    household_id: "demo-household-10482",
    household_public_id: HOUSEHOLD.id,
    household_name: "Sharma Family",
    status: "ACTIVE",
    address: CITIZEN.address,
    property_summary: HOUSEHOLD.property,
    bpl_status: HOUSEHOLD.bpl,
    income_category: HOUSEHOLD.income,
    verification_status: "VERIFIED",
    is_demo_data: true,
    disclaimer: "Synthetic demo household records for product evaluation.",
    members,
    relationships,
    timeline,
    requests: [],
  };
  return cachedLocalDemoFamily;
}

function getLocalDemoDocuments(): ApiDocument[] {
  if (cachedLocalDemoDocuments) return cachedLocalDemoDocuments;
  cachedLocalDemoDocuments = VAULT.map((doc, index) => {
    const size = Number.parseFloat(doc.size) * (doc.size.includes("MB") ? 1024 * 1024 : 1024);
    const verificationStatus =
      doc.status === "Verified" ? "VERIFIED" :
      doc.status === "Mismatch detected" ? "MISMATCH" :
      doc.status === "Expired document" ? "EXPIRED" : "MANUAL_REVIEW";
    return {
      id: doc.id,
      public_id: `DEMO-DOC-${doc.id.toUpperCase()}`,
      owner_type: "CITIZEN",
      owner_id: CITIZEN.id,
      document_type: doc.type,
      original_filename: doc.name,
      detected_mime_type: doc.name.toLowerCase().endsWith(".jpg") ? "image/jpeg" : "application/pdf",
      size_bytes: Math.round(size),
      original_size_bytes: Math.round(size),
      sha256: `DEMO-ONLY-${index + 1}`,
      storage_reference: "demo-record-without-file-content",
      status: "READY",
      verification_status: verificationStatus,
      created_by: null,
      created_at: `${doc.uploaded}T10:00:00Z`,
      updated_at: `${doc.uploaded}T10:00:00Z`,
      version_number: 1,
    };
  });
  return cachedLocalDemoDocuments;
}

async function localDemoApiRequest<T>(
  session: Session,
  path: string,
  init: RequestInit,
): Promise<T> {
  const url = new URL(path, "http://mira.local");
  const method = (init.method || "GET").toUpperCase();
  const body = typeof init.body === "string" ? JSON.parse(init.body || "{}") : {};
  const family = getLocalDemoFamily();
  const docs = getLocalDemoDocuments();
  const appMatch = url.pathname.match(/^\/api\/v1\/applications\/([^/]+)$/);
  const docMatch = url.pathname.match(/^\/api\/v1\/documents\/([^/]+)(?:\/(.*))?$/);

  if (method === "GET" && url.pathname === "/api/v1/documents") {
    return { data: docs } as T;
  }
  if (method === "GET" && /^\/api\/v1\/applications\/[^/]+\/documents$/.test(url.pathname)) {
    return { data: docs } as T;
  }
  if (method === "GET" && docMatch) {
    const document = docs.find((doc) => doc.id === decodeURIComponent(docMatch[1]));
    const action = docMatch[2];
    if (action === "versions") return { data: document ? [document] : [] } as T;
    if (action === "applications") {
      const linked = APPLICATIONS.filter((app) => app.applicant === CITIZEN.name || app.applicant === "Ananya Sharma").map((app) => ({
        id: app.id,
        reference_number: app.id,
        scheme_name: app.schemeId,
        status: app.status,
        linked_at: app.updatedOn,
      }));
      return { data: linked } as T;
    }
    if (action === "extractions") return { data: [] } as T;
    if (!action && document) return { data: document } as T;
  }
  if (method === "DELETE" && docMatch && !docMatch[2]) {
    const index = docs.findIndex((doc) => doc.id === decodeURIComponent(docMatch[1]));
    if (index >= 0) docs.splice(index, 1);
    return undefined as T;
  }
  if (method === "POST" && docMatch && docMatch[2] === "verify") {
    const document = docs.find((doc) => doc.id === decodeURIComponent(docMatch[1]));
    if (!document) throw new ApiRequestError("Document not found in the demo workspace.", 404, "DOCUMENT_NOT_FOUND");
    document.verification_status = String(body.status || "PENDING_REVIEW");
    return { data: document } as T;
  }
  if (method === "GET" && appMatch) {
    const application = APPLICATIONS.find((app) => app.id === decodeURIComponent(appMatch[1]));
    if (application) return { data: application } as T;
  }
  if (method === "GET" && url.pathname === "/api/v1/profile/family") {
    return { data: family } as T;
  }
  if (method === "POST" && url.pathname === "/api/v1/profile/family/members") {
    const id = `DEMO-MEMBER-${Date.now()}`;
    const member: ApiFamilyMember = {
      id,
      person_id: id,
      public_id: id,
      name: `${body.first_name || "New"} ${body.last_name || "Member"}`.trim(),
      relationship: String(body.relationship || "OTHER").toUpperCase(),
      membership_role: String(body.relationship || "OTHER").toUpperCase(),
      dob: String(body.date_of_birth || ""),
      gender: String(body.gender || "Unspecified"),
      identity: "PENDING",
      membership: "ACTIVE",
      income: body.income || null,
      benefits: [],
      is_current: true,
    };
    family.members.push(member);
    return { data: member } as T;
  }
  if (method === "POST" && url.pathname === "/api/v1/profile/family/events") {
    const item: ApiFamilyTimelineItem = {
      date: String(body.effective_date || new Date().toISOString().slice(0, 10)),
      event_type: String(body.event_type || "LIFE_EVENT"),
      title: String(body.event_type || "Life event").replaceAll("_", " "),
      description: String(body.details || ""),
      source: session.name,
      evidence: body.certificate_no || null,
      verification_status: "Pending",
      verified_by: "",
      timestamp: new Date().toISOString(),
    };
    family.timeline.unshift(item);
    return { data: item } as T;
  }
  if (method === "POST" && url.pathname === "/api/v1/profile/family/disputes") {
    const item = { id: `DEMO-DISPUTE-${Date.now()}`, status: "PENDING_REVIEW", ...body };
    family.requests.unshift({ id: item.id, type: String(body.category || "Data correction"), requested_at: new Date().toISOString(), status: item.status, details: String(body.description || ""), changes: {} });
    return { data: item } as T;
  }
  const householdPath = url.pathname.match(/^\/api\/v1\/households\/([^/]+)\/family$/);
  if (method === "GET" && householdPath) return { data: family } as T;
  const graphPath = url.pathname.match(/^\/api\/v1\/households\/([^/]+)\/graph$/);
  if (method === "GET" && graphPath) {
    return {
      data: {
        query_date: new Date().toISOString().slice(0, 10),
        nodes: family.members.map((member) => ({ id: member.id, node_type: "PERSON", label: member.name, sublabel: member.relationship, data: member })),
        edges: family.relationships.map((rel) => ({ id: rel.id, source: rel.person_a_id, target: rel.person_b_id, edge_type: rel.relationship_type, label: rel.relationship_type, verification_status: rel.verification_status, confidence: 1 })),
      },
    } as T;
  }
  const personPath = url.pathname.match(/^\/api\/v1\/persons\/([^/]+)\/360$/);
  if (method === "GET" && personPath) {
    const member = family.members.find((item) => item.id === decodeURIComponent(personPath[1]) || item.person_id === decodeURIComponent(personPath[1]));
    if (member) {
      const [firstName = "", ...lastParts] = member.name.split(" ");
      const related = family.relationships.filter((rel) => rel.person_a_id === member.id || rel.person_b_id === member.id).map((rel) => ({
        id: rel.id,
        related_person_id: rel.person_a_id === member.id ? rel.person_b_id : rel.person_a_id,
        related_person_public_id: rel.person_a_id === member.id ? rel.person_b_id : rel.person_a_id,
        related_person_name: rel.person_a_id === member.id ? rel.person_b_name : rel.person_a_name,
        relationship_type: rel.relationship_type,
        verification_status: rel.verification_status,
        confidence: 1,
      }));
      const personApplications = APPLICATIONS.filter((app) => app.applicant === member.name || (member.name === "Ananya Sharma" && app.applicant === "Ananya Sharma"));
      return {
        data: {
          person: {
            id: member.id,
            public_id: member.public_id,
            first_name: firstName,
            last_name: lastParts.join(" "),
            name: member.name,
            dob: member.dob,
            gender: member.gender,
            age: Number.isNaN(Date.parse(member.dob)) ? 0 : new Date().getFullYear() - new Date(member.dob).getFullYear(),
            masked_id: "XXXX-XXXX-4821",
            status: member.membership,
            verification_status: member.identity,
            membership_role: member.membership_role,
            household_id: family.household_id,
            household_public_id: family.household_public_id,
            household_name: family.household_name,
          },
          relationships: related,
          documents: docs.slice(0, 3).map((doc) => ({ id: doc.id, public_id: doc.public_id, document_type: doc.document_type, title: doc.original_filename, status: doc.status, verification_status: doc.verification_status, created_at: doc.created_at })),
          applications: personApplications.map((app) => ({ id: app.id, reference_number: app.id, scheme_name: app.schemeId, status: app.status, submitted_at: app.appliedOn })),
          benefits: BENEFITS.filter((benefit) => benefit.beneficiary.includes(member.name) || (benefit.type === "Household" && member.id === "P-10482-01")).map((benefit) => ({ id: benefit.ref, scheme_name: benefit.scheme, disbursement_amount: String(benefit.amount || ""), status: benefit.status, disbursed_at: benefit.approvedOn })),
          timeline: family.timeline.filter((item) => item.description.includes(member.name)).map((item) => ({ id: item.timestamp, event_type: item.event_type, effective_date: item.date, description: item.description, verification_status: item.verification_status })),
          schemes: SCHEMES.slice(0, 3).map((scheme) => ({ scheme_id: scheme.id, name: scheme.name, code: scheme.id.toUpperCase(), eligibility_status: "REVIEW_REQUIRED", explanation: "Review household and scheme criteria before applying.", satisfied_conditions: [], unmet_conditions: [] })),
        },
      } as T;
    }
  }
  if (method === "GET" && url.pathname === "/api/v1/audit/my-activity") return { data: [] } as T;
  if (method === "POST" && /^\/api\/v1\/notifications\/[^/]+\/read$/.test(url.pathname)) return undefined as T;

  throw new ApiRequestError("This operation requires the live Mira service.", 503, "LOCAL_DEMO_OPERATION_UNAVAILABLE");
}

export async function fetchMyFamily(
  sessionOrToken: Session | string | null,
): Promise<ApiFamilyResponse> {
  if (isLocalDemoSession(sessionOrToken)) return getLocalDemoFamily();
  const res = await apiRequest<ApiEnvelope<ApiFamilyResponse>>(
    sessionOrToken,
    "/api/v1/profile/family",
  );
  return res.data;
}

export async function addFamilyMember(
  sessionOrToken: Session | string | null,
  payload: {
    first_name: string;
    last_name: string;
    relationship: string;
    date_of_birth: string;
    gender: string;
    income?: string | null;
  },
): Promise<ApiFamilyMember> {
  const res = await apiRequest<ApiEnvelope<ApiFamilyMember>>(
    sessionOrToken,
    "/api/v1/profile/family/members",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
  return res.data;
}

export async function reportLifeEvent(
  sessionOrToken: Session | string | null,
  payload: {
    event_type: string;
    effective_date: string;
    person_name?: string | null;
    details: string;
    certificate_no?: string | null;
  },
): Promise<ApiFamilyTimelineItem> {
  const res = await apiRequest<ApiEnvelope<ApiFamilyTimelineItem>>(
    sessionOrToken,
    "/api/v1/profile/family/events",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
  return res.data;
}

export async function raiseFamilyDispute(
  sessionOrToken: Session | string | null,
  payload: {
    application_id?: string | null;
    category: string;
    description: string;
    document_reference?: string | null;
  },
): Promise<any> {
  const res = await apiRequest<ApiEnvelope<any>>(
    sessionOrToken,
    "/api/v1/profile/family/disputes",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
  return res.data;
}

export async function fetchDocumentExtractions(
  sessionOrToken: Session | string | null,
  docId: string,
): Promise<any> {
  const res = await apiRequest<ApiEnvelope<any>>(
    sessionOrToken,
    `/api/v1/documents/${docId}/extractions`,
  );
  return res.data;
}

export interface ApiAiChatRequest {
  message: string;
  route?: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
}

export interface ApiAiChatResponse {
  reply: string;
  role: string;
  context_summary: string;
  is_live_llm: boolean;
}

export async function sendMiraAiChat(
  sessionOrToken: Session | string | null,
  payload: ApiAiChatRequest,
): Promise<ApiAiChatResponse> {
  return apiRequest<ApiAiChatResponse>(
    sessionOrToken,
    "/api/v1/ai/chat",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

// ============================================================================
// FAMILY 360, GRAPH & PERSON 360 APIs
// ============================================================================

export interface ApiGraphNode {
  id: string;
  node_type: string;
  label: string;
  sublabel?: string | null;
  data: Record<string, any>;
}

export interface ApiGraphEdge {
  id: string;
  source: string;
  target: string;
  edge_type: string;
  label: string;
  verification_status: string;
  confidence: number;
}

export interface ApiGraphData {
  query_date: string;
  nodes: ApiGraphNode[];
  edges: ApiGraphEdge[];
}

export interface ApiPerson360Person {
  id: string;
  public_id: string;
  first_name: string;
  last_name: string;
  name: string;
  dob: string;
  gender: string;
  age: number;
  masked_id: string;
  status: string;
  verification_status: string;
  membership_role: string;
  household_id: string;
  household_public_id: string;
  household_name: string;
}

export interface ApiPerson360Relationship {
  id: string;
  related_person_id: string;
  related_person_public_id: string;
  related_person_name: string;
  relationship_type: string;
  verification_status: string;
  confidence: number;
}

export interface ApiPerson360Document {
  id: string;
  public_id: string;
  document_type: string;
  title: string;
  status: string;
  verification_status: string;
  created_at: string;
}

export interface ApiPerson360Application {
  id: string;
  reference_number: string;
  scheme_name: string;
  status: string;
  submitted_at: string;
}

export interface ApiPerson360Benefit {
  id: string;
  scheme_name: string;
  disbursement_amount: string;
  status: string;
  disbursed_at: string;
}

export interface ApiPerson360Timeline {
  id: string;
  event_type: string;
  effective_date: string;
  description: string;
  verification_status: string;
}

export interface ApiPerson360Scheme {
  scheme_id: string;
  name: string;
  code: string;
  eligibility_status: string;
  explanation: string;
  satisfied_conditions: string[];
  unmet_conditions: string[];
}

export interface ApiPerson360Data {
  person: ApiPerson360Person;
  relationships: ApiPerson360Relationship[];
  documents: ApiPerson360Document[];
  applications: ApiPerson360Application[];
  benefits: ApiPerson360Benefit[];
  timeline: ApiPerson360Timeline[];
  schemes: ApiPerson360Scheme[];
}

export interface ApiMyAuditEvent {
  id: string;
  event_type: string;
  user_id?: string | null;
  organization_id?: string | null;
  request_id?: string | null;
  ip_address?: string | null;
  details: Record<string, any>;
  created_at: string;
}

export async function fetchHouseholdFamily(
  sessionOrToken: Session | string | null,
  householdId: string,
): Promise<ApiFamilyResponse> {
  if (isLocalDemoSession(sessionOrToken)) {
    if (householdId !== HOUSEHOLD.id) {
      throw new ApiRequestError("Household not found in the local demo registry.", 404, "HOUSEHOLD_NOT_FOUND");
    }
    return getLocalDemoFamily();
  }
  const res = await apiRequest<ApiEnvelope<ApiFamilyResponse>>(
    sessionOrToken,
    `/api/v1/households/${encodeURIComponent(householdId)}/family`,
  );
  return res.data;
}

export async function fetchHouseholdGraph(
  sessionOrToken: Session | string | null,
  householdId: string,
  temporalDate?: string,
): Promise<ApiGraphData> {
  if (isLocalDemoSession(sessionOrToken)) {
    const family = getLocalDemoFamily();
    return {
      query_date: temporalDate || new Date().toISOString().slice(0, 10),
      nodes: family.members.map((member) => ({ id: member.id, node_type: "PERSON", label: member.name, sublabel: member.relationship, data: member })),
      edges: family.relationships.map((rel) => ({ id: rel.id, source: rel.person_a_id, target: rel.person_b_id, edge_type: rel.relationship_type, label: rel.relationship_type, verification_status: rel.verification_status, confidence: 1 })),
    };
  }
  const query = temporalDate ? `?date=${encodeURIComponent(temporalDate)}` : "";
  const res = await apiRequest<ApiEnvelope<ApiGraphData>>(
    sessionOrToken,
    `/api/v1/households/${encodeURIComponent(householdId)}/graph${query}`,
  );
  return res.data;
}

export async function fetchPerson360(
  sessionOrToken: Session | string | null,
  personId: string,
): Promise<ApiPerson360Data> {
  if (isLocalDemoSession(sessionOrToken)) {
    const response = await localDemoApiRequest<ApiEnvelope<ApiPerson360Data>>(
      sessionOrToken as Session,
      `/api/v1/persons/${encodeURIComponent(personId)}/360`,
      { method: "GET" },
    );
    return response.data;
  }
  const res = await apiRequest<ApiEnvelope<ApiPerson360Data>>(
    sessionOrToken,
    `/api/v1/persons/${encodeURIComponent(personId)}/360`,
  );
  return res.data;
}

export async function fetchMyAuditActivity(
  sessionOrToken: Session | string | null,
): Promise<ApiMyAuditEvent[]> {
  if (isLocalDemoSession(sessionOrToken)) return [];
  const res = await apiRequest<ApiEnvelope<ApiMyAuditEvent[]>>(
    sessionOrToken,
    "/api/v1/audit/my-activity",
  );
  return res.data;
}

