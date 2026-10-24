import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Building2,
  Check,
  FileCheck,
  LockKeyhole,
  ShieldCheck,
  UserCheck,
  Users,
  Eye,
  AlertCircle,
  AlertTriangle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-state";
import {
  authenticateDemo,
  ApiRequestError,
  checkDemoHealth,
  loginUser,
  registerUser,
  mapRoleToUiRole,
  type DemoHealthState,
} from "@/lib/api";
import { getRoleConfig } from "@/lib/role-config";
import type { DictKey } from "@/lib/i18n";
import type { Session } from "@/lib/app-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import familyPhoto from "@/assets/login-family-photo.webp";
import servicePhoto from "@/assets/login-service-photo.webp";
import civicPhoto from "@/assets/login-civic-photo.webp";

type DemoRoleKey =
  | "citizen"
  | "verifier"
  | "scheme"
  | "supervisor"
  | "auditor"
  | "admin";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Demo & Real Access — Mira Welfare Verification Platform" },
      {
        name: "description",
        content:
          "Sign in to Mira public services, field verification queues, and audit workspaces.",
      },
      { property: "og:title", content: "Access — Mira" },
    ],
  }),
  component: LoginPage,
});

interface DemoAccountItem {
  role: DemoRoleKey;
  email: string;
  name: string;
  titleKey: DictKey;
  badgeKey: DictKey;
  descKey: DictKey;
  icon: typeof Users;
}

const DEMO_ACCOUNT_CONFIGS = [
  {
    role: "citizen",
    titleKey: "demoAccountCitizenTitle",
    badgeKey: "demoAccountCitizenBadge",
    descKey: "demoAccountCitizenDesc",
    icon: Users,
  },
  {
    role: "verifier",
    titleKey: "demoAccountVerifierTitle",
    badgeKey: "demoAccountVerifierBadge",
    descKey: "demoAccountVerifierDesc",
    icon: ShieldCheck,
  },
  {
    role: "scheme",
    titleKey: "demoAccountSchemeTitle",
    badgeKey: "demoAccountSchemeBadge",
    descKey: "demoAccountSchemeDesc",
    icon: FileCheck,
  },
  {
    role: "supervisor",
    titleKey: "demoAccountSupervisorTitle",
    badgeKey: "demoAccountSupervisorBadge",
    descKey: "demoAccountSupervisorDesc",
    icon: UserCheck,
  },
  {
    role: "auditor",
    titleKey: "demoAccountAuditorTitle",
    badgeKey: "demoAccountAuditorBadge",
    descKey: "demoAccountAuditorDesc",
    icon: Eye,
  },
  {
    role: "admin",
    titleKey: "demoAccountAdminTitle",
    badgeKey: "demoAccountAdminBadge",
    descKey: "demoAccountAdminDesc",
    icon: Building2,
  },
 ] satisfies Array<Omit<DemoAccountItem, "email" | "name">>;

const DEMO_ACCOUNTS: DemoAccountItem[] = DEMO_ACCOUNT_CONFIGS.map((account) => {
  const config = getRoleConfig(account.role);
  return { ...account, email: config.demoEmail, name: config.defaultIdentity.name };
});

export function LoginPage({ initialRole }: { initialRole?: string } = {}) {
  const { t, login } = useApp();
  const nav = useNavigate();
  const [mode, setMode] = useState<"demo" | "real">("demo");
  const [realTab, setRealTab] = useState<"login" | "register">("login");
  const [loadingRole, setLoadingRole] = useState<string | null>(null);
  const [activeSigningAccount, setActiveSigningAccount] = useState<DemoAccountItem | null>(null);
  const [failedAccount, setFailedAccount] = useState<DemoAccountItem | null>(null);

  // Truthful demo sandbox health state
  const [demoHealth, setDemoHealth] = useState<DemoHealthState>("initializing");
  const [demoError, setDemoError] = useState<string | null>(null);

  // Real Account state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [realError, setRealError] = useState("");
  const [realBusy, setRealBusy] = useState(false);

  const fetchHealth = async () => {
    setDemoHealth("initializing");
    setDemoError(null);
    const res = await checkDemoHealth();
    setDemoHealth(res.state);
  };

  useEffect(() => {
    let active = true;
    checkDemoHealth().then((res) => {
      if (!active) return;
      setDemoHealth(res.state);
    });
    return () => {
      active = false;
    };
  }, []);

  const handleDemoSignIn = async (account: DemoAccountItem) => {
    if (loadingRole) return;
    setLoadingRole(account.role);
    setActiveSigningAccount(account);
    setFailedAccount(null);
    setDemoError(null);

    try {
      let verifiedRole: typeof account.role = account.role;
      let name: string;
      let targetRoute: string;
      let session: Session;
      try {
        const auth = await authenticateDemo(account.role);
        const mappedRole = mapRoleToUiRole(auth.user.roles);
        if (mappedRole !== account.role) {
          throw new ApiRequestError("The selected demo role did not match the authenticated account.", 403, "DEMO_ROLE_MISMATCH");
        }
        verifiedRole = account.role;
        const config = getRoleConfig(verifiedRole);
        name = auth.user.display_name;
        targetRoute = config.primaryDashboardUrl;
        session = {
          role: verifiedRole,
          name,
          id: auth.user.id,
          apiToken: auth.token,
          apiUserId: auth.user.id,
          apiEmail: auth.user.email,
          isDemo: true,
          roles: auth.user.roles,
          authSource: "api" as const,
          department: auth.user.organization?.name || config.defaultIdentity.organization,
          permissions: config.permissions,
          householdId: verifiedRole === "citizen" ? "MIRA-FAM-10482" : undefined,
        };
      } catch (error) {
        const canUseLocalDemo =
          !import.meta.env.PROD &&
          (error instanceof ApiRequestError && (error.status === 0 || error.status >= 500));
        if (!canUseLocalDemo) throw error;

        const config = getRoleConfig(account.role);
        name = config.defaultIdentity.name;
        targetRoute = config.primaryDashboardUrl;
        session = {
          role: account.role,
          name,
          id: `local-demo:${account.role}`,
          apiEmail: config.demoEmail,
          isDemo: true,
          authSource: "local-demo" as const,
          department: config.defaultIdentity.organization,
          permissions: config.permissions,
          householdId: account.role === "citizen" ? "MIRA-FAM-10482" : undefined,
        };
        setDemoHealth("unavailable");
      }

      login(session);
      toast.success(`Signed in as ${name}`);
      await nav({ to: targetRoute as never });
    } catch (cause) {
      console.error("Demo login error:", cause);
      setFailedAccount(account);
      if (cause instanceof ApiRequestError && cause.status === 401) {
        setDemoError("Demo sign-in needs an authentication configuration check.");
      } else if (cause instanceof ApiRequestError && cause.status === 403) {
        setDemoError("The selected demo account is not configured for this role.");
      } else {
        setDemoError("We couldn't initialize this demo session. Please try again.");
      }
    } finally {
      setLoadingRole(null);
      setActiveSigningAccount(null);
    }
  };

  const handleRealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRealError("");
    setRealBusy(true);

    try {
      let auth;
      if (realTab === "register") {
        if (!displayName.trim()) {
          throw new Error("Please enter your legal full name.");
        }
        auth = await registerUser(email, password, displayName);
        toast.success("Account created successfully!");
      } else {
        auth = await loginUser(email, password);
      }

      const role = mapRoleToUiRole(auth.user.roles);
      const config = getRoleConfig(role);
      login({
        role,
        name: auth.user.display_name,
        id: auth.user.id,
        apiToken: auth.token,
        apiUserId: auth.user.id,
        apiEmail: auth.user.email,
        isDemo: auth.user.is_demo,
        roles: auth.user.roles,
        authSource: "real",
        permissions: config.permissions,
        householdId: role === "citizen" ? "MIRA-FAM-10482" : undefined,
        department: auth.user.organization?.name,
      });
      toast.success(`Welcome back, ${auth.user.display_name}`);
      const targetRoute = config.primaryDashboardUrl;
      await nav({ to: targetRoute as never });
    } catch (cause) {
      console.error("Real authentication failed:", cause);
      setRealError(
        cause instanceof Error
          ? cause.message
          : t("authErrorFallback"),
      );
    } finally {
      setRealBusy(false);
    }
  };

  return (
    <section className="login-page min-h-screen py-8">
      <div className="login-background" aria-hidden="true">
        <div className="login-photo-layer login-photo-civic">
          <img
            src={civicPhoto}
            alt=""
            width="1200"
            height="800"
            className="login-background-photo"
          />
        </div>
        <div className="login-photo-layer login-photo-family">
          <img
            src={familyPhoto}
            alt=""
            width="850"
            height="1000"
            fetchPriority="high"
            className="login-background-photo"
          />
        </div>
        <div className="login-photo-layer login-photo-service">
          <img
            src={servicePhoto}
            alt=""
            width="1000"
            height="680"
            className="login-background-photo"
          />
        </div>
        <div className="login-photo-overlay" />
      </div>

      <div className="login-layout mx-auto max-w-4xl px-4 sm:px-6">
        <div className="login-access w-full max-w-2xl mx-auto">
          <div className="login-panel w-full rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-lg">
            {/* 1. Platform Access Header */}
            <div className="border-b border-border/60 pb-5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wider uppercase text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {t("platformAccess")}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  v2.4
                </span>
              </div>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {t("signInTitle")}
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                {t("signInSubtitle")}
              </p>

              {/* 2. Mode Switcher: Demo Access vs Use Real Account */}
              <div className="mt-5 grid grid-cols-2 gap-1.5 rounded-xl bg-muted/80 p-1" role="tablist">
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "demo"}
                  onClick={() => {
                    setMode("demo");
                    setDemoError(null);
                    setFailedAccount(null);
                  }}
                  className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs sm:text-sm font-semibold transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gov ${
                    mode === "demo"
                      ? "bg-card text-foreground shadow-xs ring-1 ring-border/50"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  {t("demoAccessTab")}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "real"}
                  onClick={() => {
                    setMode("real");
                    setRealError("");
                  }}
                  className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs sm:text-sm font-semibold transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gov ${
                    mode === "real"
                      ? "bg-card text-foreground shadow-xs ring-1 ring-border/50"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LockKeyhole className="h-3.5 w-3.5 text-teal" />
                  {t("realAccessTab")}
                </button>
              </div>
            </div>

            {/* TAB CONTENT: DEMO ACCESS */}
            {mode === "demo" ? (
              <div className="mt-6 space-y-4">
                {/* Status Bar */}
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("continueAs")}
                  </span>

                  {/* Live API health is separate from the always available local demo. */}
                  <div className="flex items-center gap-2">
                    {demoHealth === "ready" && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                        Live demo services connected
                      </span>
                    )}
                    {demoHealth === "initializing" && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-500" />
                        Local demo ready · checking live services
                      </span>
                    )}
                    {demoHealth === "degraded" && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                        <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                        Local demo ready · live services limited
                      </span>
                    )}
                    {demoHealth === "unavailable" && (
                      <div className="inline-flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
                          <AlertTriangle className="h-3.5 w-3.5 text-slate-500" />
                          Local demo ready · live services unavailable
                        </span>
                        <button
                          type="button"
                          onClick={fetchHealth}
                          className="text-xs underline text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="h-3 w-3" />
                          {t("retryConnection")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Signing in banner */}
                {loadingRole && activeSigningAccount && (
                  <div
                    role="status"
                    className="flex items-center gap-2.5 rounded-lg border border-gov/20 bg-gov/5 p-3 text-xs font-medium text-gov animate-pulse"
                  >
                    <Loader2 className="h-4 w-4 animate-spin shrink-0 text-gov" />
                    <span>
                      {t("signingInAs")} {activeSigningAccount.name}…
                    </span>
                  </div>
                )}

                {/* Contextual Demo Launch Error */}
                {demoError && (
                  <div
                    role="alert"
                    className="flex items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive"
                  >
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{demoError}</span>
                    </div>
                    {failedAccount && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs border-destructive/30 hover:bg-destructive/10 text-destructive"
                        onClick={() => handleDemoSignIn(failedAccount)}
                      >
                        {t("retryAction")}
                      </Button>
                    )}
                  </div>
                )}

                {/* Demo Accounts List */}
                <div
                  role="list"
                  className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border/80 bg-card shadow-xs"
                >
                  {DEMO_ACCOUNTS.map((account) => {
                    const Icon = account.icon;
                    const isBusy = loadingRole === account.role;
                    const isAnyBusy = loadingRole !== null;

                    return (
                      <button
                        key={account.role}
                        type="button"
                        role="listitem"
                        disabled={isAnyBusy}
                        onClick={() => handleDemoSignIn(account)}
                        aria-label={`${t("launch")} ${account.name}, ${t(account.titleKey)}`}
                        className="group flex w-full items-center justify-between p-3 sm:px-4 text-left transition-all duration-150 hover:bg-muted/50 active:scale-[0.99] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gov focus-visible:z-10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-muted/60 text-foreground transition-transform group-hover:scale-105">
                            <Icon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-foreground tracking-tight">
                                {account.name}
                              </span>
                              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border/50">
                                {t(account.titleKey)}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate max-w-[270px] sm:max-w-[390px] mt-0.5">
                              {t(account.descKey)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pl-3 shrink-0">
                          {isBusy ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gov">
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              {t("opening")}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-background px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 group-hover:border-gov group-hover:text-gov group-hover:bg-gov/5 transition-colors">
                              {t("launch")}
                              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* TAB CONTENT: REAL ACCOUNT */
              <div className="mt-6">
                <div className="flex border-b border-border/80 mb-5" role="tablist">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={realTab === "login"}
                    onClick={() => {
                      setRealTab("login");
                      setRealError("");
                    }}
                    className={`pb-2.5 px-4 text-sm font-semibold border-b-2 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gov ${
                      realTab === "login"
                        ? "border-gov text-navy"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t("signInTab")}
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={realTab === "register"}
                    onClick={() => {
                      setRealTab("register");
                      setRealError("");
                    }}
                    className={`pb-2.5 px-4 text-sm font-semibold border-b-2 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gov ${
                      realTab === "register"
                        ? "border-gov text-navy"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t("createCitizenAccountTab")}
                  </button>
                </div>

                <form onSubmit={handleRealSubmit} className="space-y-4 max-w-md mx-auto">
                  {realTab === "register" && (
                    <div className="space-y-1.5">
                      <Label htmlFor="real-name">{t("fullLegalName")}</Label>
                      <Input
                        id="real-name"
                        type="text"
                        placeholder="e.g. Rajesh Sharma"
                        required
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label htmlFor="real-email">{t("emailAddress")}</Label>
                    <Input
                      id="real-email"
                      type="email"
                      autoComplete="username"
                      placeholder="citizen@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="real-password">{t("passwordPlaceholder")}</Label>
                    <Input
                      id="real-password"
                      type="password"
                      autoComplete={realTab === "login" ? "current-password" : "new-password"}
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {realTab === "register" && (
                      <p className="text-[11px] text-muted-foreground">
                        {t("passwordRequirement")}
                      </p>
                    )}
                  </div>

                  {realError && (
                    <div
                      role="alert"
                      className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
                    >
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{realError}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-10 mt-2 bg-gov hover:bg-gov/90 text-white font-medium"
                    disabled={realBusy}
                  >
                    {realBusy ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t("authenticating")}
                      </span>
                    ) : realTab === "register" ? (
                      t("registerButton")
                    ) : (
                      t("signInButton")
                    )}
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>

                  <p className="text-center text-xs text-muted-foreground pt-2">
                    {realTab === "login" ? (
                      <>
                        {t("dontHaveAccountPrompt")}{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setRealTab("register");
                            setRealError("");
                          }}
                          className="text-gov font-semibold underline underline-offset-2 hover:text-gov/80"
                        >
                          {t("registerHereLink")}
                        </button>
                      </>
                    ) : (
                      <>
                        {t("alreadyHaveAccountPrompt")}{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setRealTab("login");
                            setRealError("");
                          }}
                          className="text-gov font-semibold underline underline-offset-2 hover:text-gov/80"
                        >
                          {t("signInHereLink")}
                        </button>
                      </>
                    )}
                  </p>
                </form>
              </div>
            )}

            {/* Footer Trust Indicators */}
            <div className="mt-8 flex flex-wrap items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
                  <LockKeyhole className="h-3.5 w-3.5 text-teal" />
                  {t("secureConnection")}
                </span>
                <span>•</span>
                <span>{t("privacyProtected")}</span>
              </div>
              <div>
                <Link
                  to="/help"
                  className="text-gov font-medium underline-offset-4 hover:underline"
                >
                  {t("support")} ↗
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
