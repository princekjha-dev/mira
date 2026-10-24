import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  APPLICATIONS,
  AUDIT,
  DUPLICATE_ALERTS,
  NOTIFICATIONS,
  VAULT,
  BENEFITS,
  type Application,
  type AuditEvent,
  type DuplicateAlert,
  type Notification,
  type VaultDoc,
  type Benefit,
  type MessageThread,
  type CommentItem,
  type FieldVisit,
  type FileRecord,
  type DecisionRecord,
  SEED_MESSAGES,
  SEED_COMMENTS,
  SEED_FIELD_VISITS,
  SEED_FILES,
  SEED_DECISIONS,
  DEMO_PROFILES,
  CITIZEN,
  HOUSEHOLD,
  getScheme,
} from "./data";
import { translate, type DictKey, type LangCode } from "./i18n";
import {
  fetchApplications,
  fetchNotifications,
  fetchAuditEvents,
  fetchBenefits,
  updateBackendApplication,
  submitBackendApplication,
  createBackendApplication,
  assignBackendApplication,
  requestBackendEvidence,
  submitBackendEvidence,
  verifyBackendApplication,
  approveBackendApplication,
  rejectBackendApplication,
  markBackendNotificationRead,
  getMe,
  mapRoleToUiRole,
  ApiRequestError,
} from "./api";
import { getRoleConfig } from "./role-config";

export type Role =
  | "citizen"
  | "officer"
  | "verifier"
  | "scheme"
  | "supervisor"
  | "admin"
  | "auditor";
export interface Session {
  role: Role;
  name: string;
  id: string;
  department?: string;
  apiToken?: string;
  apiUserId?: string;
  apiEmail?: string;
  isDemo?: boolean;
  authSource?: "api" | "local-demo" | "real";
  roles?: string[];
  permissions?: string[];
  householdId?: string;
  applicationContext?: string[];
}
export interface Grievance {
  id: string;
  appId: string;
  category: string;
  description: string;
  file?: string;
  date: string;
  status: "Received" | "In Progress" | "Resolved";
}
export interface FamilyRequest {
  id: string;
  type: string;
  details: string;
  date: string;
  status: "Pending verification" | "Verified" | "Returned";
}
export interface RuleCondition {
  field: string;
  op: string;
  value: string;
}
export interface RuleVersion {
  version: string;
  schemeId: string;
  effective: string;
  by: string;
  reason: string;
  conditions: RuleCondition[];
}

export interface AppState {
  lang: LangCode;
  fontScale: number;
  highContrast: boolean;
  reducedMotion: boolean;
  srMode: boolean;
  notifPrefs: { sms: boolean; email: boolean; app: boolean };
  session: Session | null;
  applications: Application[];
  notifications: Notification[];
  audit: AuditEvent[];
  benefits: Benefit[];
  alerts: DuplicateAlert[];
  vault: VaultDoc[];
  grievances: Grievance[];
  familyRequests: FamilyRequest[];
  ruleVersions: RuleVersion[];
  messages: MessageThread[];
  comments: CommentItem[];
  fieldVisits: FieldVisit[];
  files: FileRecord[];
  decisions: DecisionRecord[];
}

const initial: AppState = {
  lang: "en",
  fontScale: 0,
  highContrast: false,
  reducedMotion: false,
  srMode: false,
  notifPrefs: { sms: true, email: false, app: true },
  session: null,
  applications: APPLICATIONS,
  notifications: NOTIFICATIONS,
  audit: AUDIT,
  benefits: BENEFITS,
  alerts: DUPLICATE_ALERTS,
  vault: VAULT,
  messages: SEED_MESSAGES,
  comments: SEED_COMMENTS,
  fieldVisits: SEED_FIELD_VISITS,
  files: SEED_FILES,
  decisions: SEED_DECISIONS,
  grievances: [
    {
      id: "GRV-2026-01182",
      appId: "APP-2026-000412",
      category: "Delay in processing",
      description: "BPL certificate renewal pending at tehsil.",
      date: "2026-10-13",
      status: "In Progress",
    },
  ],
  familyRequests: [
    {
      id: "FR-2026-0041",
      type: "Relationship Correction",
      details: "Aman Kumar date of birth correction (2012-09-03)",
      date: "2026-10-05",
      status: "Pending verification",
    },
  ],
  ruleVersions: [
    {
      version: "v1.0",
      schemeId: "rural-housing",
      effective: "2024-04-01",
      by: "S. Rao (Dept Admin)",
      reason: "Initial rule set",
      conditions: [
        { field: "Household income", op: "<", value: "250000" },
        { field: "Property condition", op: "=", value: "No pucca house" },
      ],
    },
    {
      version: "v1.1",
      schemeId: "rural-housing",
      effective: "2025-04-01",
      by: "S. Rao (Dept Admin)",
      reason: "Income ceiling revised per state notification",
      conditions: [
        { field: "Household income", op: "<", value: "300000" },
        { field: "Property condition", op: "=", value: "No pucca house" },
        {
          field: "Previous benefit",
          op: "NOT received",
          value: "Rural Housing Assistance",
        },
      ],
    },
  ],
};

const EMPTY_ACCOUNT_DATA = {
  applications: [] as Application[],
  notifications: [] as Notification[],
  audit: [] as AuditEvent[],
  benefits: [] as Benefit[],
  alerts: [] as DuplicateAlert[],
  vault: [] as VaultDoc[],
  grievances: [] as Grievance[],
  familyRequests: [] as FamilyRequest[],
};

const isLocalDemo = (session: Session | null) =>
  Boolean(session?.isDemo && (session.authSource === "local-demo" || !session.apiToken));

const SESSION_KEY = "mira-session-v2";
const UI_PREFS_KEY = "mira-ui-prefs-v1";
const DEMO_DATA_KEY = "mira-demo-data-v1";

const DEMO_DATA_FIELDS = [
  "applications",
  "notifications",
  "audit",
  "benefits",
  "alerts",
  "vault",
  "grievances",
  "familyRequests",
  "ruleVersions",
  "messages",
  "comments",
  "fieldVisits",
  "files",
  "decisions",
] as const satisfies readonly (keyof AppState)[];

type Patch = Partial<AppState> | ((s: AppState) => Partial<AppState>);

interface Ctx {
  state: AppState;
  hydrated: boolean;
  isLoading: boolean;
  set: (p: Patch) => void;
  t: (k: DictKey) => string;
  login: (s: Session) => void;
  logout: () => void;
  refreshData: () => Promise<void>;
  addAudit: (e: Omit<AuditEvent, "id" | "ts">) => void;
  updateApp: (
    id: string,
    patch: Partial<Application>,
    eventText?: string,
    by?: string,
  ) => void;
  notify: (title: string, body: string, link?: string) => void;
  markNotificationRead: (id: string) => Promise<void>;
  createApp: (
    schemeId: string,
    metadata?: Record<string, any>,
  ) => Promise<Application>;
  submitApp: (id: string) => Promise<Application>;
  assignApp: (
    id: string,
    assignedTo: string,
    notes?: string,
  ) => Promise<Application>;
  requestAppEvidence: (
    id: string,
    req: {
      evidence_type: string;
      reason: string;
      description: string;
      deadline?: string;
    },
  ) => Promise<Application>;
  submitAppEvidence: (
    id: string,
    req: { request_id: string; document_id?: string; explanation?: string },
  ) => Promise<Application>;
  verifyApp: (
    id: string,
    req: {
      findings: string;
      status?: string;
      verified_household?: boolean;
      verified_address?: boolean;
    },
  ) => Promise<Application>;
  approveApp: (id: string) => Promise<any>;
  rejectApp: (
    id: string,
    reason: string,
    notes: string,
  ) => Promise<Application>;
  sendMessage: (msg: {
    toEmail: string;
    toName?: string;
    toRole?: string;
    subject: string;
    body: string;
    applicationId?: string;
    threadId?: string;
    attachments?: Array<{ id: string; name: string; size: number; type: string }>;
    updatedCaseStatus?: MessageThread["caseStatus"];
    clearActionRequired?: boolean;
    auditAction?: string;
  }) => void;
  markMessageRead: (threadId: string) => void;
  toggleStarMessage: (threadId: string) => void;
  archiveMessage: (threadId: string) => void;
  addComment: (comment: {
    recordType: CommentItem["recordType"];
    recordId: string;
    text: string;
    mentions?: string[];
    replyToId?: string;
  }) => void;
  updateFieldVisit: (visitId: string, patch: Partial<FieldVisit>) => void;
  addFileVersion: (fileId: string, newVersion: { filename: string; sizeBytes: number; reason: string }) => void;
}

const AppCtx = createContext<Ctx | null>(null);

export const nowStamp = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
};

export function AppStateProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [state, setState] = useState<AppState>(initial);
  const [hydrated, setHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const sessionRef = useRef<Session | null>(null);

  // Restore session and UI preferences from localStorage on mount
  useEffect(() => {
    let savedSession: Session | null = null;
    try {
      const rawSession = localStorage.getItem(SESSION_KEY);
      if (rawSession) savedSession = JSON.parse(rawSession);
      const rawDemoData = localStorage.getItem(DEMO_DATA_KEY);
      const demoData = rawDemoData ? JSON.parse(rawDemoData) as Partial<AppState> : {};
      const restoredDemoData = Object.fromEntries(
        DEMO_DATA_FIELDS.flatMap((field) =>
          Array.isArray(demoData[field]) ? [[field, demoData[field]]] : [],
        ),
      ) as Partial<AppState>;
      const rawPrefs = localStorage.getItem(UI_PREFS_KEY);
      if (rawPrefs) {
        const prefs = JSON.parse(rawPrefs);
        setState((s) => ({
          ...s,
          ...prefs,
          ...restoredDemoData,
          session: savedSession,
        }));
      } else if (savedSession || Object.keys(restoredDemoData).length > 0) {
        setState((s) => ({
          ...s,
          ...restoredDemoData,
          session: savedSession,
        }));
      }
    } catch {
      /* ignore corrupt storage */
    }

    sessionRef.current = savedSession;
    setHydrated(true);

    // Validate real/backend sessions. Local demo sessions intentionally work offline.
    if (savedSession?.apiToken && savedSession.authSource !== "local-demo") {
      getMe(savedSession.apiToken)
        .then((me) => {
          const validatedRole = mapRoleToUiRole(me.roles);
          const config = getRoleConfig(validatedRole);
          const validatedSession: Session = {
            ...savedSession!,
            role: validatedRole,
            name: me.display_name,
            apiEmail: me.email,
            isDemo: me.is_demo,
            authSource: savedSession!.authSource || (me.is_demo ? "api" : "real"),
            roles: me.roles,
            permissions: config.permissions,
            householdId: savedSession!.householdId || (validatedRole === "citizen" ? HOUSEHOLD.id : undefined),
          };
          sessionRef.current = validatedSession;
          setState((s) => ({ ...s, session: validatedSession }));
          localStorage.setItem(SESSION_KEY, JSON.stringify(validatedSession));
        })
        .catch((error: unknown) => {
          if (error instanceof ApiRequestError && (error.status === 401 || error.status === 403)) {
            sessionRef.current = null;
            setState((s) => ({ ...s, ...EMPTY_ACCOUNT_DATA, session: null }));
            localStorage.removeItem(SESSION_KEY);
            return;
          }
          console.warn("Mira session validation is temporarily unavailable; keeping the saved session.", {
            status: error instanceof ApiRequestError ? error.status : undefined,
            name: error instanceof Error ? error.name : "UnknownError",
          });
        });
    }
  }, []);

  // Synchronize authoritative data from PostgreSQL
  const refreshData = useCallback(async () => {
    const currentSession = sessionRef.current;
    if (!currentSession?.apiToken) return;

    try {
      setIsLoading(true);
      const [backendApps, backendNotifs, backendAudit, backendBenefits] =
        await Promise.allSettled([
          fetchApplications(currentSession),
          fetchNotifications(currentSession),
          fetchAuditEvents(currentSession, 50),
          fetchBenefits(currentSession),
        ]);

      setState((s) => {
        const nextApplications =
          backendApps.status === "fulfilled" ? backendApps.value : s.applications;

        const nextNotifications =
          backendNotifs.status === "fulfilled" ? backendNotifs.value : s.notifications;

        const nextAudit =
          backendAudit.status === "fulfilled" ? backendAudit.value : s.audit;

        const nextBenefits =
          backendBenefits.status === "fulfilled" ? backendBenefits.value : s.benefits;

        return {
          ...s,
          applications: nextApplications,
          notifications: nextNotifications,
          audit: nextAudit,
          benefits: nextBenefits,
        };
      });
    } catch {
      // keep current cache
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Trigger refresh whenever session changes or every 5 seconds for cross-browser synchronization
  useEffect(() => {
    sessionRef.current = state.session;
    if (state.session?.apiToken) {
      void refreshData();
      const interval = setInterval(() => {
        void refreshData();
      }, 5000);
      const handleFocus = () => void refreshData();
      window.addEventListener("focus", handleFocus);
      return () => {
        clearInterval(interval);
        window.removeEventListener("focus", handleFocus);
      };
    }
    return undefined;
  }, [state.session?.apiToken, refreshData]);

  // Persist accessibility / UI preferences
  useEffect(() => {
    if (!hydrated) return;
    const { lang, fontScale, highContrast, reducedMotion, srMode, notifPrefs } =
      state;
    localStorage.setItem(
      UI_PREFS_KEY,
      JSON.stringify({
        lang,
        fontScale,
        highContrast,
        reducedMotion,
        srMode,
        notifPrefs,
      }),
    );
  }, [
    state.lang,
    state.fontScale,
    state.highContrast,
    state.reducedMotion,
    state.srMode,
    state.notifPrefs,
    hydrated,
  ]);

  // Demo workflow changes survive refreshes and switching between demo roles.
  useEffect(() => {
    if (!hydrated || !state.session?.isDemo) return;
    const snapshot = Object.fromEntries(
      DEMO_DATA_FIELDS.map((field) => [field, state[field]]),
    );
    try {
      localStorage.setItem(DEMO_DATA_KEY, JSON.stringify(snapshot));
    } catch (error) {
      console.warn("Unable to persist the local demo workspace state.", {
        name: error instanceof Error ? error.name : "UnknownError",
      });
    }
  }, [state, hydrated]);

  // A11y DOM side-effects
  useEffect(() => {
    const el = document.documentElement;
    el.style.fontSize = `${100 + state.fontScale * 12.5}%`;
    el.classList.toggle("hc", state.highContrast);
    el.classList.toggle("reduce-motion", state.reducedMotion);
    el.classList.toggle("sr-mode", state.srMode);
    el.lang = state.lang;
  }, [
    state.fontScale,
    state.highContrast,
    state.reducedMotion,
    state.srMode,
    state.lang,
  ]);

  const set = useCallback(
    (p: Patch) =>
      setState((s) => ({ ...s, ...(typeof p === "function" ? p(s) : p) })),
    [],
  );

  const login = useCallback(
    (session: Session) => {
      try {
        queryClient.clear();
      } catch {
        /* ignore */
      }
      const config = getRoleConfig(session.role);
      const normalizedSession: Session = {
        ...session,
        authSource: session.authSource || (session.isDemo ? (session.apiToken ? "api" : "local-demo") : "real"),
        permissions: session.permissions || config.permissions,
        householdId: session.householdId || (session.role === "citizen" ? HOUSEHOLD.id : undefined),
      };
      sessionRef.current = normalizedSession;
      localStorage.setItem(SESSION_KEY, JSON.stringify(normalizedSession));
      setState((s) => ({
        ...s,
        ...(normalizedSession.isDemo ? {} : EMPTY_ACCOUNT_DATA),
        session: normalizedSession,
      }));
    },
    [queryClient],
  );

  const logout = useCallback(() => {
    try {
      queryClient.clear();
    } catch {
      /* ignore */
    }
    sessionRef.current = null;
    localStorage.removeItem(SESSION_KEY);
    setState((s) => ({
      ...s,
      ...(s.session?.isDemo ? {} : EMPTY_ACCOUNT_DATA),
      session: null,
    }));
  }, [queryClient]);

  const updateLocalApplication = useCallback(
    (
      id: string,
      patch: Partial<Application>,
      eventText: string,
      by = sessionRef.current?.name || "Demo workflow",
    ) => {
      let updated: Application | undefined;
      setState((s) => {
        const current = s.applications.find((app) => app.id === id || (app as any).rawId === id);
        if (!current) return s;
        const timestamp = nowStamp();
        updated = {
          ...current,
          ...patch,
          updatedOn: timestamp.slice(0, 10),
          events: [...current.events, { date: timestamp.slice(0, 16), text: eventText, by }],
        };
        return {
          ...s,
          applications: s.applications.map((app) => app.id === id || (app as any).rawId === id ? updated! : app),
          audit: [
            {
              id: `AU-${Date.now()}`,
              ts: timestamp,
              actor: `${by} (${sessionRef.current?.role || "demo"})`,
              action: eventText,
              application: id,
              prev: current.status,
              next: updated.status,
              reason: eventText,
            },
            ...s.audit,
          ],
        };
      });
      if (!updated) throw new Error("The application could not be found in the demo workspace.");
      return updated;
    },
    [],
  );

  // Real backend workflow action helpers
  const createApp = useCallback(
    async (schemeId: string, metadata: Record<string, any> = {}) => {
      const session = sessionRef.current;
      if (session?.role === "auditor") throw new Error("Auditor access is read-only.");
      if (isLocalDemo(session)) {
        const now = nowStamp();
        const demoSchemeId = String(metadata.frontend_scheme_id || schemeId);
        const scheme = getScheme(demoSchemeId);
        const created: Application = {
          id: `DEMO-APP-${Date.now()}`,
          schemeId: demoSchemeId,
          applicant: String(metadata.applicant_name || session?.name || CITIZEN.name),
          citizenId: session?.role === "citizen" ? CITIZEN.id : "P-10482-01",
          householdId: session?.householdId || HOUSEHOLD.id,
          appliedOn: "",
          updatedOn: now.slice(0, 10),
          status: "Draft",
          stage: -1,
          declaredIncome: Number(metadata.income || HOUSEHOLD.annualIncome),
          events: scheme ? [{ date: now.slice(0, 16), text: `${scheme.name} application started`, by: session?.name || CITIZEN.name }] : [],
        };
        setState((s) => ({ ...s, applications: [created, ...s.applications] }));
        return created;
      }
      const created = await createBackendApplication(
        session,
        schemeId,
        metadata,
      );
      setState((s) => ({
        ...s,
        applications: [
          created,
          ...s.applications.filter((a) => a.id !== created.id),
        ],
      }));
      void refreshData();
      return created;
    },
    [refreshData],
  );

  const updateAppAction = useCallback(
    (
      id: string,
      patch: Partial<Application>,
      eventText?: string,
      by?: string,
    ) => {
      if (sessionRef.current?.role === "auditor") return;
      // 1. Optimistic local update
      setState((s) => ({
        ...s,
        applications: s.applications.map((a) =>
          a.id === id || (a as any).rawId === id
            ? {
                ...a,
                ...patch,
                updatedOn: nowStamp().slice(0, 10),
                events: eventText
                  ? [
                      ...a.events,
                      {
                        date: nowStamp().slice(0, 16),
                        text: eventText,
                        by: by ?? "System",
                      },
                    ]
                  : a.events,
              }
            : a,
        ),
      }));

      // 2. Persist to backend database if session token is available
      if (sessionRef.current?.apiToken) {
        const backendId =
          (state.applications.find((a) => a.id === id) as any)?.rawId || id;
        void updateBackendApplication(sessionRef.current, backendId, {
          status: patch.status
            ? patch.status.toUpperCase().replace(/\s+/g, "_")
            : undefined,
          metadata: (patch as any).metadata,
        }).catch(() => undefined);
      }
    },
    [state.applications],
  );

  const submitApp = useCallback(
    async (id: string) => {
      const session = sessionRef.current;
      if (session?.role === "auditor") throw new Error("Auditor access is read-only.");
      if (isLocalDemo(session)) {
        return updateLocalApplication(id, {
          status: "Submitted",
          stage: 1,
          appliedOn: nowStamp().slice(0, 10),
        }, "Application submitted", session?.name);
      }
      const target = state.applications.find((a) => a.id === id);
      const backendId = (target as any)?.rawId || id;
      const submitted = await submitBackendApplication(
        sessionRef.current,
        backendId,
      );
      setState((s) => ({
        ...s,
        applications: s.applications.map((a) =>
          a.id === id || (a as any).rawId === id ? submitted : a,
        ),
      }));
      void refreshData();
      return submitted;
    },
    [state.applications, refreshData, updateLocalApplication],
  );

  const assignApp = useCallback(
    async (id: string, assignedTo: string, notes?: string) => {
      const session = sessionRef.current;
      if (session?.role === "auditor") throw new Error("Auditor access is read-only.");
      if (isLocalDemo(session)) {
        return updateLocalApplication(id, {
          status: "Officer Review",
          stage: 4,
          assignedTo,
        }, notes ? `Assigned to ${assignedTo}: ${notes}` : `Assigned to ${assignedTo}`, session?.name);
      }
      const target = state.applications.find((a) => a.id === id);
      const backendId = (target as any)?.rawId || id;
      const assigned = await assignBackendApplication(
        sessionRef.current,
        backendId,
        assignedTo,
        notes,
      );
      setState((s) => ({
        ...s,
        applications: s.applications.map((a) =>
          a.id === id || (a as any).rawId === id ? assigned : a,
        ),
      }));
      void refreshData();
      return assigned;
    },
    [state.applications, refreshData, updateLocalApplication],
  );

  const requestAppEvidence = useCallback(
    async (
      id: string,
      req: {
        evidence_type: string;
        reason: string;
        description: string;
        deadline?: string;
      },
    ) => {
      const session = sessionRef.current;
      if (session?.role === "auditor") throw new Error("Auditor access is read-only.");
      if (isLocalDemo(session)) {
        return updateLocalApplication(id, {
          status: "Additional Evidence Required",
          stage: 6,
        }, `Clarification requested: ${req.description || req.reason}`, session?.name);
      }
      const target = state.applications.find((a) => a.id === id);
      const backendId = (target as any)?.rawId || id;
      const updated = await requestBackendEvidence(
        sessionRef.current,
        backendId,
        req,
      );
      setState((s) => ({
        ...s,
        applications: s.applications.map((a) =>
          a.id === id || (a as any).rawId === id ? updated : a,
        ),
      }));
      void refreshData();
      return updated;
    },
    [state.applications, refreshData, updateLocalApplication],
  );

  const submitAppEvidence = useCallback(
    async (
      id: string,
      req: { request_id: string; document_id?: string; explanation?: string },
    ) => {
      const session = sessionRef.current;
      if (session?.role === "auditor") throw new Error("Auditor access is read-only.");
      if (isLocalDemo(session)) {
        return updateLocalApplication(id, {
          status: "Documents Under Review",
          stage: 2,
        }, "Additional document evidence submitted", session?.name);
      }
      const target = state.applications.find((a) => a.id === id);
      const backendId = (target as any)?.rawId || id;
      const updated = await submitBackendEvidence(
        sessionRef.current,
        backendId,
        req,
      );
      setState((s) => ({
        ...s,
        applications: s.applications.map((a) =>
          a.id === id || (a as any).rawId === id ? updated : a,
        ),
      }));
      void refreshData();
      return updated;
    },
    [state.applications, refreshData, updateLocalApplication],
  );

  const verifyApp = useCallback(
    async (
      id: string,
      req: {
        findings: string;
        status?: string;
        verified_household?: boolean;
        verified_address?: boolean;
      },
    ) => {
      const session = sessionRef.current;
      if (session?.role === "auditor") throw new Error("Auditor access is read-only.");
      if (isLocalDemo(session)) {
        return updateLocalApplication(id, {
          status: "Officer Review",
          stage: 4,
        }, `Field verification submitted: ${req.findings}`, session?.name);
      }
      const target = state.applications.find((a) => a.id === id);
      const backendId = (target as any)?.rawId || id;
      const updated = await verifyBackendApplication(
        sessionRef.current,
        backendId,
        req,
      );
      setState((s) => ({
        ...s,
        applications: s.applications.map((a) =>
          a.id === id || (a as any).rawId === id ? updated : a,
        ),
      }));
      void refreshData();
      return updated;
    },
    [state.applications, refreshData, updateLocalApplication],
  );

  const approveApp = useCallback(
    async (id: string) => {
      const session = sessionRef.current;
      if (session?.role === "auditor") throw new Error("Auditor access is read-only.");
      if (isLocalDemo(session)) {
        return updateLocalApplication(id, {
          status: "Approved",
          stage: 7,
          decision: {
            outcome: "Approved",
            reason: "Eligibility and verification requirements are complete.",
            note: "Demo decision recorded for workflow review.",
            by: session?.name || "Scheme Officer",
            date: nowStamp().slice(0, 10),
          },
        }, "Application approved and moved to benefit processing", session?.name);
      }
      const target = state.applications.find((a) => a.id === id);
      const backendId = (target as any)?.rawId || id;
      const result = await approveBackendApplication(
        sessionRef.current,
        backendId,
      );
      void refreshData();
      return result;
    },
    [state.applications, refreshData, updateLocalApplication],
  );

  const rejectApp = useCallback(
    async (id: string, reason: string, notes: string) => {
      const session = sessionRef.current;
      if (session?.role === "auditor") throw new Error("Auditor access is read-only.");
      if (isLocalDemo(session)) {
        return updateLocalApplication(id, {
          status: "Rejected",
          stage: 7,
          decision: {
            outcome: "Rejected",
            reason,
            note: notes,
            by: session?.name || "Scheme Officer",
            date: nowStamp().slice(0, 10),
          },
        }, `Application rejected: ${reason}`, session?.name);
      }
      const target = state.applications.find((a) => a.id === id);
      const backendId = (target as any)?.rawId || id;
      const updated = await rejectBackendApplication(
        sessionRef.current,
        backendId,
        reason,
        notes,
      );
      setState((s) => ({
        ...s,
        applications: s.applications.map((a) =>
          a.id === id || (a as any).rawId === id ? updated : a,
        ),
      }));
      void refreshData();
      return updated;
    },
    [state.applications, refreshData, updateLocalApplication],
  );

  const markNotificationRead = useCallback(async (id: string) => {
    setState((s) => ({
      ...s,
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    }));
    if (sessionRef.current?.apiToken) {
      await markBackendNotificationRead(sessionRef.current, id).catch(
        () => undefined,
      );
    }
  }, []);

  const value = useMemo<Ctx>(() => {
    const addAudit: Ctx["addAudit"] = (e) =>
      set((s) => ({
        audit: [
          { ...e, id: "AU-" + (90100 + s.audit.length), ts: nowStamp() },
          ...s.audit,
        ],
      }));

    return {
      state,
      hydrated,
      isLoading,
      set,
      t: (k) => translate(state.lang, k),
      login,
      logout,
      refreshData,
      addAudit,
      notify: (title, body, link) =>
        set((s) => ({
          notifications: [
            {
              id: "n" + Date.now(),
              title,
              body,
              link,
              date: nowStamp().slice(0, 10),
              read: false,
            },
            ...s.notifications,
          ],
        })),
      updateApp: updateAppAction,
      markNotificationRead,
      createApp,
      submitApp,
      assignApp,
      requestAppEvidence,
      submitAppEvidence,
      verifyApp,
      approveApp,
      rejectApp,
      sendMessage: (msg) => {
        set((s) => {
          const senderName = s.session?.name || "User";
          const senderEmail = s.session?.apiEmail || "user@mira.local";
          const senderRole = s.session?.role || "citizen";
          const now = nowStamp().slice(0, 16);

          if (msg.threadId) {
            const updatedAudit: AuditEvent[] = msg.auditAction
              ? [
                  {
                    id: "AU-" + (90100 + s.audit.length),
                    ts: nowStamp(),
                    actor: `${senderName} (${senderRole})`,
                    action: msg.auditAction,
                    application: msg.applicationId || msg.threadId,
                    prev: "Active Review",
                    next: msg.updatedCaseStatus || "Updated",
                    reason: msg.auditAction,
                  },
                  ...s.audit,
                ]
              : s.audit;

            return {
              audit: updatedAudit,
              messages: s.messages.map((t) =>
                t.id === msg.threadId
                  ? {
                      ...t,
                      timestamp: now,
                      preview: msg.body.slice(0, 100),
                      caseStatus:
                        msg.updatedCaseStatus ||
                        (msg.clearActionRequired
                          ? "awaiting_verification"
                          : t.caseStatus),
                      actionRequired: msg.clearActionRequired
                        ? undefined
                        : t.actionRequired,
                      actionType: msg.clearActionRequired
                        ? "none"
                        : t.actionType,
                      messages: [
                        ...t.messages,
                        {
                          id: "m-" + Date.now(),
                          senderName,
                          senderEmail,
                          senderRole,
                          timestamp: now,
                          body: msg.body,
                          attachments: msg.attachments,
                        },
                      ],
                    }
                  : t,
              ),
            };
          }

          const newThread: MessageThread = {
            id: "MSG-2026-" + Math.floor(1000 + Math.random() * 9000),
            subject: msg.subject,
            sender: {
              name: senderName,
              email: senderEmail,
              role: senderRole,
              department: s.session?.department,
            },
            recipient: {
              name: msg.toName || msg.toEmail.split("@")[0],
              email: msg.toEmail,
              role: msg.toRole || "user",
            },
            preview: msg.body.slice(0, 100),
            timestamp: now,
            status: "read",
            folder: "sent",
            applicationId: msg.applicationId,
            caseStatus: msg.updatedCaseStatus || "informational",
            auditRef: "AUD-TX-" + Math.floor(10000 + Math.random() * 90000),
            messages: [
              {
                id: "m-" + Date.now(),
                senderName,
                senderEmail,
                senderRole,
                timestamp: now,
                body: msg.body,
                attachments: msg.attachments,
              },
            ],
          };
          const updatedAudit: AuditEvent[] = msg.auditAction
            ? [
                {
                  id: "AU-" + (90100 + s.audit.length),
                  ts: nowStamp(),
                  actor: `${senderName} (${senderRole})`,
                  action: msg.auditAction,
                  application: msg.applicationId || newThread.id,
                  prev: "Initiated",
                  next: msg.updatedCaseStatus || "Dispatched",
                  reason: msg.auditAction,
                },
                ...s.audit,
              ]
            : s.audit;
          return { messages: [newThread, ...s.messages], audit: updatedAudit };
        });
      },
      markMessageRead: (threadId) =>
        set((s) => ({
          messages: s.messages.map((m) =>
            m.id === threadId ? { ...m, status: "read" } : m,
          ),
        })),
      toggleStarMessage: (threadId) =>
        set((s) => ({
          messages: s.messages.map((m) =>
            m.id === threadId ? { ...m, isStarred: !m.isStarred } : m,
          ),
        })),
      archiveMessage: (threadId) =>
        set((s) => ({
          messages: s.messages.map((m) =>
            m.id === threadId ? { ...m, folder: "archived" as const, isArchived: true } : m,
          ),
        })),
      addComment: (comment) =>
        set((s) => {
          const authorName = s.session?.name || "Official";
          const authorRole = s.session?.role || "officer";
          const now = nowStamp().slice(0, 16);

          if (comment.replyToId) {
            return {
              comments: s.comments.map((c) =>
                c.id === comment.replyToId
                  ? {
                      ...c,
                      replies: [
                        ...c.replies,
                        {
                          id: "rep-" + Date.now(),
                          author: { name: authorName, role: authorRole },
                          timestamp: now,
                          text: comment.text,
                          mentions: comment.mentions,
                        },
                      ],
                    }
                  : c,
              ),
            };
          }

          const newComment: CommentItem = {
            id: "COM-" + Date.now(),
            recordType: comment.recordType,
            recordId: comment.recordId,
            author: {
              name: authorName,
              role: authorRole,
              department: s.session?.department,
            },
            timestamp: now,
            text: comment.text,
            mentions: comment.mentions,
            replies: [],
            isResolved: false,
          };
          return { comments: [...s.comments, newComment] };
        }),
      updateFieldVisit: (visitId, patch) =>
        set((s) => ({
          fieldVisits: s.fieldVisits.map((v) =>
            v.id === visitId ? { ...v, ...patch } : v,
          ),
        })),
      addFileVersion: (fileId, newVersion) =>
        set((s) => ({
          files: s.files.map((f) => {
            if (f.id !== fileId) return f;
            const nextVer = f.currentVersion + 1;
            return {
              ...f,
              name: newVersion.filename,
              sizeBytes: newVersion.sizeBytes,
              currentVersion: nextVer,
              verificationStatus: "Pending Review" as const,
              uploadedDate: nowStamp().slice(0, 10),
              versions: [
                {
                  versionNumber: nextVer,
                  filename: newVersion.filename,
                  sizeBytes: newVersion.sizeBytes,
                  uploadedBy: s.session?.name || "Citizen",
                  uploadedAt: nowStamp().slice(0, 16),
                  reason: newVersion.reason,
                },
                ...f.versions,
              ],
            };
          }),
        })),
    };
  }, [
    state,
    hydrated,
    isLoading,
    set,
    login,
    logout,
    refreshData,
    updateAppAction,
    markNotificationRead,
    createApp,
    submitApp,
    assignApp,
    requestAppEvidence,
    submitAppEvidence,
    verifyApp,
    approveApp,
    rejectApp,
  ]);

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp outside provider");
  return c;
}

export function downloadAcknowledgement(a: Application, schemeName: string) {
  const text = [
    "MIRA — UNIFIED CITIZEN WELFARE OPERATING SYSTEM",
    "Application Acknowledgement (Authoritative Record)",
    "------------------------------------------------------------",
    `Application ID : ${a.id}`,
    `Scheme         : ${schemeName}`,
    `Applicant      : ${a.applicant}`,
    `Household ID   : ${a.householdId}`,
    `Submitted on   : ${a.appliedOn || "Not yet submitted"}`,
    `Current status : ${a.status}`,
    `Last updated   : ${a.updatedOn}`,
    "",
    "Keep this Application ID to track your application at /track.",
    `Generated: ${nowStamp()}`,
  ].join("\n");
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Acknowledgement_${a.id}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}
