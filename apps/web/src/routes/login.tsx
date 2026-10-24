import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-state";
import {
  authenticateDemo,
  loginUser,
  registerUser,
  mapRoleToUiRole,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import familyPhoto from "@/assets/login-family-photo.webp";
import servicePhoto from "@/assets/login-service-photo.webp";
import civicPhoto from "@/assets/login-civic-photo.webp";

type DemoRoleKey =
  "citizen" | "verifier" | "scheme" | "supervisor" | "auditor" | "admin";

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

const ROLE_ROUTES = {
  citizen: "/citizen/dashboard",
  officer: "/officer/dashboard",
  verifier: "/verifier/dashboard",
  scheme: "/officer/dashboard",
  supervisor: "/verifier/dashboard",
  admin: "/department/dashboard",
  auditor: "/auditor/dashboard",
} as const;

interface DemoAccountItem {
  role: DemoRoleKey;
  email: string;
  title: string;
  name: string;
  badge: string;
  description: string;
  icon: any;
}

const DEMO_ACCOUNTS: DemoAccountItem[] = [
  {
    role: "citizen",
    email: "demo.citizen@mira.demo",
    title: "Citizen / Applicant",
    name: "Rajesh Sharma",
    badge: "Citizen Account",
    description:
      "Sharma Family (MIRA-FAM-10482). Household tree, life events, document upload & scheme applications.",
    icon: Users,
  },
  {
    role: "verifier",
    email: "demo.verifier@mira.demo",
    title: "Verification Officer",
    name: "Vikram Malhotra",
    badge: "Field Official",
    description:
      "Inspect incoming cases, verify family relationships, examine OCR evidence, request clarifications & resolve mismatches.",
    icon: ShieldCheck,
  },
  {
    role: "scheme",
    email: "demo.scheme@mira.demo",
    title: "Scheme Officer",
    name: "Sunita Verma",
    badge: "Program Officer",
    description:
      "Review scheme eligibility evaluations, cross-scheme overlaps, and make final approval or documented rejection decisions.",
    icon: FileCheck,
  },
  {
    role: "supervisor",
    email: "demo.supervisor@mira.demo",
    title: "Supervisor",
    name: "Dr. Alok Nath",
    badge: "Senior Review",
    description:
      "Second-tier reviews, escalated cases, complex duplicate adjudications, and appeal/dispute resolution.",
    icon: UserCheck,
  },
  {
    role: "auditor",
    email: "demo.auditor@mira.demo",
    title: "Auditor",
    name: "Priya Nair",
    badge: "Strict Read-Only",
    description:
      "Immutable audit records, decision inspection, document access history, and compliance verification.",
    icon: Eye,
  },
  {
    role: "admin",
    email: "demo.admin@mira.demo",
    title: "Administrator",
    name: "Arjun Mehta",
    badge: "System Authority",
    description:
      "Configure departments, welfare schemes, eligibility rules, staff permissions, and system settings.",
    icon: Building2,
  },
];

export function LoginPage({ initialRole }: { initialRole?: string } = {}) {
  const { t, login } = useApp();
  const nav = useNavigate();
  const [mode, setMode] = useState<"demo" | "real">("demo");
  const [realTab, setRealTab] = useState<"login" | "register">("login");
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  // Real Account state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [realError, setRealError] = useState("");
  const [realBusy, setRealBusy] = useState(false);

  const handleDemoSignIn = async (account: DemoAccountItem) => {
    setLoadingRole(account.role);
    try {
      const auth = await authenticateDemo(account.role);
      const verifiedRole = mapRoleToUiRole(auth.user.roles);
      login({
        role: verifiedRole,
        name: auth.user.display_name,
        id: auth.user.id,
        apiToken: auth.token,
        apiUserId: auth.user.id,
        apiEmail: auth.user.email,
        isDemo: auth.user.is_demo,
        department: auth.user.organization?.name,
      });
      toast.success(`Signed in as ${auth.user.display_name}`);
      const targetRoute =
        ROLE_ROUTES[verifiedRole as keyof typeof ROLE_ROUTES] ||
        "/citizen/dashboard";
      await nav({ to: targetRoute as never });
    } catch (cause) {
      console.error("Demo login error", cause);
      toast.error(
        cause instanceof Error
          ? cause.message
          : "Unable to launch demo workspace.",
      );
    } finally {
      setLoadingRole(null);
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
          throw new Error("Please enter your full name.");
        }
        auth = await registerUser(email, password, displayName);
        toast.success("Account created successfully!");
      } else {
        auth = await loginUser(email, password);
      }

      const role = mapRoleToUiRole(auth.user.roles);
      login({
        role,
        name: auth.user.display_name,
        id: auth.user.id,
        apiToken: auth.token,
        apiUserId: auth.user.id,
        apiEmail: auth.user.email,
        isDemo: auth.user.is_demo,
        department: auth.user.organization?.name,
      });
      toast.success(`Welcome back, ${auth.user.display_name}`);
      const targetRoute =
        ROLE_ROUTES[role as keyof typeof ROLE_ROUTES] || "/citizen/dashboard";
      await nav({ to: targetRoute as never });
    } catch (cause) {
      console.error("Real authentication failed", cause);
      setRealError(
        cause instanceof Error
          ? cause.message
          : "Authentication failed. Please verify credentials.",
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
          <div className="login-panel w-full rounded-2xl sm:rounded-3xl border border-border/80 bg-card/95 p-6 sm:p-8 shadow-xl backdrop-blur-md material-elevated">
            {/* Header */}
            <div className="border-b border-border/60 pb-5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wider uppercase text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  MIRA PLATFORM ACCESS
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  v2.4
                </span>
              </div>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Sign In to Mira
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                Unified public welfare environment for citizens, verification
                officers, and administrators.
              </p>

              {/* Mode Switcher: Demo Access vs Use Real Account */}
              <div className="mt-5 grid grid-cols-2 gap-1.5 rounded-xl bg-muted/80 p-1">
                <button
                  type="button"
                  onClick={() => setMode("demo")}
                  className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs sm:text-sm font-semibold transition-all active:scale-[0.98] ${
                    mode === "demo"
                      ? "bg-card text-foreground shadow-xs ring-1 ring-border/50"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  Demo Access
                </button>
                <button
                  type="button"
                  onClick={() => setMode("real")}
                  className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs sm:text-sm font-semibold transition-all active:scale-[0.98] ${
                    mode === "real"
                      ? "bg-card text-foreground shadow-xs ring-1 ring-border/50"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LockKeyhole className="h-3.5 w-3.5 text-teal" />
                  Use Real Account
                </button>
              </div>
            </div>

            {/* TAB CONTENT: DEMO ACCESS */}
            {mode === "demo" ? (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Continue as
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <Check className="h-3.5 w-3.5" /> Live sandbox active
                  </span>
                </div>

                <div className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-xs">
                  {DEMO_ACCOUNTS.map((account) => {
                    const Icon = account.icon;
                    const isBusy = loadingRole === account.role;
                    return (
                      <button
                        key={account.role}
                        type="button"
                        disabled={isBusy || loadingRole !== null}
                        onClick={() => handleDemoSignIn(account)}
                        className="group flex w-full items-center justify-between p-3.5 sm:px-4 text-left transition-all duration-150 hover:bg-muted/50 active:scale-[0.99] touch-target-44 disabled:opacity-50"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/60 text-foreground transition-transform group-hover:scale-105">
                            <Icon className="h-4.5 w-4.5" />
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-foreground tracking-tight">
                                {account.name}
                              </span>
                              <span className="rounded-full bg-muted/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border/50">
                                {account.title}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate max-w-[280px] sm:max-w-[380px] mt-0.5">
                              {account.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pl-3 shrink-0">
                          <span className="hidden sm:inline-flex text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            {isBusy ? "Opening…" : "Launch"}
                          </span>
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted/60 text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* TAB CONTENT: REAL ACCOUNT */
              <div className="mt-6">
                <div className="flex border-b border-slate-200 mb-5">
                  <button
                    type="button"
                    onClick={() => setRealTab("login")}
                    className={`pb-2.5 px-4 text-sm font-semibold border-b-2 transition-colors ${
                      realTab === "login"
                        ? "border-gov text-navy"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setRealTab("register")}
                    className={`pb-2.5 px-4 text-sm font-semibold border-b-2 transition-colors ${
                      realTab === "register"
                        ? "border-gov text-navy"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Create Real Citizen Account
                  </button>
                </div>

                <form
                  onSubmit={handleRealSubmit}
                  className="space-y-4 max-w-md mx-auto"
                >
                  {realTab === "register" && (
                    <div className="space-y-1.5">
                      <Label htmlFor="real-name">Full Legal Name</Label>
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
                    <Label htmlFor="real-email">Email Address</Label>
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
                    <Label htmlFor="real-password">Password</Label>
                    <Input
                      id="real-password"
                      type="password"
                      autoComplete={
                        realTab === "login"
                          ? "current-password"
                          : "new-password"
                      }
                      required
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {realTab === "register" && (
                      <p className="text-[11px] text-muted-foreground">
                        Minimum 8 characters. Stored securely with Argon2id
                        hash.
                      </p>
                    )}
                  </div>

                  {realError && (
                    <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{realError}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-10 mt-2 bg-gov hover:bg-gov/90 text-white"
                    disabled={realBusy}
                  >
                    {realBusy
                      ? "Authenticating…"
                      : realTab === "register"
                        ? "Create Real Account & Sign In"
                        : "Sign In to Real Account"}
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>

                  <p className="text-center text-xs text-muted-foreground pt-2">
                    {realTab === "login" ? (
                      <>
                        Don't have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setRealTab("register")}
                          className="text-gov font-semibold underline underline-offset-2"
                        >
                          Register here
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setRealTab("login")}
                          className="text-gov font-semibold underline underline-offset-2"
                        >
                          Sign in here
                        </button>
                      </>
                    )}
                  </p>
                </form>
              </div>
            )}

            {/* Footer Trust Indicators */}
            <div className="mt-8 flex flex-wrap items-center justify-between border-t pt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <LockKeyhole className="h-3.5 w-3.5 text-teal" />
                  {t("secureConnection")}
                </span>
                <span>•</span>
                <span>{t("privacyProtected")}</span>
              </div>
              <div>
                <Link
                  to="/help"
                  className="text-gov underline-offset-4 hover:underline"
                >
                  {t("needHelp")} {t("support")} ↗
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
