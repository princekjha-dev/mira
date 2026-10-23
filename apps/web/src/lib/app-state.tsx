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
} from "./api";

export type Role = "citizen" | "officer" | "verifier" | "admin" | "auditor";
export interface Session {
  role: Role;
  name: string;
  id: string;
  department?: string;
  apiToken?: string;
  apiUserId?: string;
  apiEmail?: string;
  isDemo?: boolean;
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

const SESSION_KEY = "mira-session-v2";
const UI_PREFS_KEY = "mira-ui-prefs-v1";

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
}

const AppCtx = createContext<Ctx | null>(null);

export const nowStamp = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
};

export function AppStateProvider({ children }: { children: ReactNode }) {
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
      const rawPrefs = localStorage.getItem(UI_PREFS_KEY);
      if (rawPrefs) {
        const prefs = JSON.parse(rawPrefs);
        setState((s) => ({
          ...s,
          ...prefs,
          ...(savedSession ? EMPTY_ACCOUNT_DATA : {}),
          session: savedSession,
        }));
      } else if (savedSession) {
        setState((s) => ({
          ...s,
          ...EMPTY_ACCOUNT_DATA,
          session: savedSession,
        }));
      }
    } catch {
      /* ignore corrupt storage */
    }

    sessionRef.current = savedSession;
    setHydrated(true);

    // Verify session token with backend if present
    if (savedSession?.apiToken) {
      getMe(savedSession.apiToken)
        .then((me) => {
          const validatedRole = mapRoleToUiRole(me.roles);
          const validatedSession: Session = {
            ...savedSession!,
            role: validatedRole,
            name: me.display_name,
            apiEmail: me.email,
            isDemo: me.is_demo,
          };
          sessionRef.current = validatedSession;
          setState((s) => ({ ...s, session: validatedSession }));
          localStorage.setItem(SESSION_KEY, JSON.stringify(validatedSession));
        })
        .catch(() => {
          // Token expired or invalid
          sessionRef.current = null;
          setState((s) => ({ ...s, ...EMPTY_ACCOUNT_DATA, session: null }));
          localStorage.removeItem(SESSION_KEY);
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
          backendApps.status === "fulfilled" ? backendApps.value : [];

        const nextNotifications =
          backendNotifs.status === "fulfilled" ? backendNotifs.value : [];

        const nextAudit =
          backendAudit.status === "fulfilled" ? backendAudit.value : [];

        const nextBenefits =
          backendBenefits.status === "fulfilled" ? backendBenefits.value : [];

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

  const login = useCallback((session: Session) => {
    sessionRef.current = session;
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setState((s) => ({ ...s, ...EMPTY_ACCOUNT_DATA, session }));
  }, []);

  const logout = useCallback(() => {
    sessionRef.current = null;
    localStorage.removeItem(SESSION_KEY);
    setState((s) => ({ ...s, ...EMPTY_ACCOUNT_DATA, session: null }));
  }, []);

  // Real backend workflow action helpers
  const createApp = useCallback(
    async (schemeId: string, metadata: Record<string, any> = {}) => {
      const created = await createBackendApplication(
        sessionRef.current,
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
    [state.applications, refreshData],
  );

  const assignApp = useCallback(
    async (id: string, assignedTo: string, notes?: string) => {
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
    [state.applications, refreshData],
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
    [state.applications, refreshData],
  );

  const submitAppEvidence = useCallback(
    async (
      id: string,
      req: { request_id: string; document_id?: string; explanation?: string },
    ) => {
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
    [state.applications, refreshData],
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
    [state.applications, refreshData],
  );

  const approveApp = useCallback(
    async (id: string) => {
      const target = state.applications.find((a) => a.id === id);
      const backendId = (target as any)?.rawId || id;
      const result = await approveBackendApplication(
        sessionRef.current,
        backendId,
      );
      void refreshData();
      return result;
    },
    [state.applications, refreshData],
  );

  const rejectApp = useCallback(
    async (id: string, reason: string, notes: string) => {
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
    [state.applications, refreshData],
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
