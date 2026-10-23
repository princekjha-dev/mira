import type { Session, Role } from "./app-state";
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

export async function apiRequest<T>(
  sessionOrToken: Session | string | null,
  path: string,
  init: RequestInit = {},
): Promise<T> {
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
      error?: { message?: string };
    } | null;
    throw new Error(
      body?.error?.message ||
        `Request failed (${response.status}). Please retry.`,
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
    console.error("Mira authentication request failed", error);
    throw new Error(
      "Connection problem. We couldn't reach Mira. Please try again.",
    );
  }
  const payload = (await response.json().catch(() => null)) as
    (ApiAuthResponse & { error?: { message?: string } }) | null;
  if (!response.ok || !payload?.token) {
    throw new Error(
      response.status === 401
        ? "Unable to sign in. Check your access details and try again."
        : response.status >= 500
          ? "Mira is temporarily unavailable. Please try again."
          : payload?.error?.message || "Unable to sign in. Please try again.",
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

export async function authenticateDemo(
  role: "citizen" | "officer" | "verifier" | "admin" | "auditor",
): Promise<ApiAuthResponse> {
  let response: Response;
  try {
    response = await fetch(apiUrl("/api/v1/auth/demo-login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
  } catch (error) {
    console.error("Mira demo authentication request failed", error);
    throw new Error(
      "Connection problem. We couldn't reach Mira. Please try again.",
    );
  }
  const payload = (await response.json().catch(() => null)) as
    (ApiAuthResponse & { error?: { message?: string } }) | null;
  if (!response.ok || !payload?.token) {
    throw new Error(
      response.status === 404 || response.status === 403
        ? "Demo account unavailable. Please try again later."
        : response.status >= 500
          ? "Mira is temporarily unavailable. Please try again."
          : payload?.error?.message || "Unable to open this demo account.",
    );
  }
  if (!payload.user.is_demo) {
    throw new Error("Demo account unavailable. Please choose another account.");
  }
  return payload;
}

export function mapRoleToUiRole(roles: string[]): Role {
  if (roles.includes("AUDITOR")) return "auditor";
  if (roles.includes("VERIFICATION_OFFICER")) return "verifier";
  if (roles.includes("DEPARTMENT_ADMIN")) return "admin";
  if (roles.includes("FIELD_OFFICIAL") || roles.includes("OFFICER"))
    return "officer";
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
  };
}

// ----------------------------------------------------------------------------
// APPLICATION API CALLS
// ----------------------------------------------------------------------------

export async function fetchApplications(
  session: Session | null,
): Promise<Application[]> {
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
  if (!session?.apiToken) return [];
  const res = await apiRequest<ApiEnvelope<any[]>>(session, "/api/v1/benefits");
  return (res.data || []).map(mapBackendBenefit);
}

export async function fetchSchemes(): Promise<any[]> {
  const res = await fetch(apiUrl("/api/v1/schemes"));
  if (!res.ok) return [];
  const data = (await res.json()) as ApiEnvelope<any[]>;
  return data.data || [];
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
