import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  LockKeyhole,
  ShieldCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-state";
import { authenticateDemo, loginUser, mapRoleToUiRole } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import familyPhoto from "@/assets/login-family-photo.webp";
import servicePhoto from "@/assets/login-service-photo.webp";
import civicPhoto from "@/assets/login-civic-photo.webp";

type AccessRole =
  | "choose"
  | "account"
  | "citizen"
  | "officer"
  | "verifier"
  | "admin"
  | "auditor";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Secure access — Mira" },
      {
        name: "description",
        content: "Sign in to Mira citizen services and authorized workspaces.",
      },
      { property: "og:title", content: "Secure access — Mira" },
    ],
  }),
  component: LoginPage,
});

const ROLE_ROUTES = {
  citizen: "/citizen/dashboard",
  officer: "/officer/dashboard",
  verifier: "/officer/verification",
  admin: "/department/dashboard",
  auditor: "/officer/audit",
} as const;

const DEMO_ACCOUNTS = [
  {
    role: "citizen" as const,
    icon: Users,
    title: "Citizen access",
    description: "Explore schemes, household services and applications.",
  },
  {
    role: "officer" as const,
    icon: ShieldCheck,
    title: "Field official",
    description: "Review assigned applications and field work.",
  },
  {
    role: "verifier" as const,
    icon: ShieldCheck,
    title: "Verification officer",
    description: "Review documents and verification tasks.",
  },
  {
    role: "admin" as const,
    icon: Building2,
    title: "Department administrator",
    description: "Manage schemes, rules and service operations.",
  },
  {
    role: "auditor" as const,
    icon: LockKeyhole,
    title: "Auditor",
    description: "Inspect read-only audit and decision records.",
  },
];

export function LoginPage({
  initialRole = "choose",
}: {
  initialRole?: AccessRole;
}) {
  const { t } = useApp();
  const [role, setRole] = useState<AccessRole>(initialRole);
  const panel = useRef<HTMLDivElement>(null);
  const choose = (value: AccessRole) => {
    setRole(value);
    requestAnimationFrame(() => panel.current?.focus());
  };

  return (
    <section className="login-page">
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
      <div className="login-layout mx-auto max-w-7xl">
        <div className="login-access">
          <div className="login-panel w-full">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal">
              Secure access
            </p>
            <h1 className="mt-3 text-2xl font-semibold leading-snug text-navy">
              Welcome to Mira
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Choose an account to continue to its Mira workspace.
            </p>
            <div
              ref={panel}
              tabIndex={-1}
              className="mt-5 border-t pt-5 outline-none"
            >
              {role === "choose" ? (
                <div className="space-y-2" aria-label="Choose demo account">
                  {DEMO_ACCOUNTS.map(
                    ({ role: accountRole, icon: Icon, title, description }) => (
                      <Button
                        key={accountRole}
                        variant="outline"
                        className="login-role group h-auto w-full justify-start whitespace-normal border-border bg-card p-4 text-left shadow-none"
                        onClick={() => choose(accountRole)}
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary text-gov">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-base font-semibold text-navy">
                            {title}
                          </span>
                          <span className="mt-1 block text-sm font-normal leading-5 text-muted-foreground">
                            {description}
                          </span>
                        </span>
                        <ArrowRight className="login-role-arrow text-gov" />
                      </Button>
                    ),
                  )}
                  <Button
                    variant="ghost"
                    className="h-10 w-full text-sm text-slate-700"
                    onClick={() => choose("account")}
                  >
                    Sign in with email and password
                  </Button>
                  <p className="pt-2 text-xs leading-5 text-muted-foreground">
                    Prototype access uses synthetic demo accounts and data.
                  </p>
                </div>
              ) : (
                <div className="login-form-enter">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <Button
                      variant="link"
                      className="h-auto p-0 text-gov"
                      onClick={() => choose("choose")}
                    >
                      <ArrowLeft /> Change account
                    </Button>
                    <span className="flex items-center gap-1 text-xs font-medium text-teal">
                      <Check className="h-3.5 w-3.5" />
                      Demo account
                    </span>
                  </div>
                  {role === "account" ? (
                    <AccountLogin />
                  ) : role === "citizen" ? (
                    <CitizenLogin />
                  ) : (
                    <StaffLogin role={role} />
                  )}
                </div>
              )}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <LockKeyhole className="h-3.5 w-3.5" />
                {t("secureConnection")}
              </span>
              <span>{t("privacyProtected")}</span>
              <span>{t("roleAccess")}</span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {t("needHelp")}{" "}
              <Link
                to="/help"
                className="text-gov underline-offset-4 hover:underline"
              >
                {t("support")} <span aria-hidden="true">↗</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function useDemoSignIn(role: Exclude<AccessRole, "choose" | "account">) {
  const { login } = useApp();
  const nav = useNavigate();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const signIn = async () => {
    setError("");
    setBusy(true);
    try {
      const auth = await authenticateDemo(role);
      const verifiedRole = mapRoleToUiRole(auth.user.roles);
      if (!auth.user.is_demo || verifiedRole !== role) {
        throw new Error(
          "This demo account is not configured for the selected workspace.",
        );
      }
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
      toast.success(`Welcome to Mira, ${auth.user.display_name}`);
      await nav({ to: ROLE_ROUTES[verifiedRole] as never });
    } catch (cause) {
      console.error("Demo sign-in failed", cause);
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to sign you in. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return { signIn, error, busy };
}

function AccountLogin() {
  const { login } = useApp();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const auth = await loginUser(email, password);
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
      toast.success(`Welcome to Mira, ${auth.user.display_name}`);
      await nav({ to: ROLE_ROUTES[role] as never });
    } catch (cause) {
      console.error("Mira sign-in failed", cause);
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to sign you in. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <h2 className="text-xl font-semibold text-navy">Sign in to Mira</h2>
      <p className="text-sm leading-6 text-muted-foreground">
        Use the email and password associated with your Mira account.
      </p>
      <div className="space-y-2">
        <Label htmlFor="account-email">Email</Label>
        <Input
          id="account-email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="account-password">Password</Label>
        <Input
          id="account-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      {error && (
        <p
          role="alert"
          className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          {error}
        </p>
      )}
      <Button type="submit" className="h-11 w-full" disabled={busy}>
        {busy ? "Signing in…" : "Sign in"}
        <ArrowRight />
      </Button>
    </form>
  );
}

function CitizenLogin() {
  const { signIn, error, busy } = useDemoSignIn("citizen");
  return (
    <div>
      <h2 className="text-xl font-semibold text-navy">Citizen access</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Sign in to your secure Mira demo account. No real identity service is
        contacted.
      </p>
      {error && (
        <p
          role="alert"
          className="mt-4 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          {error}
        </p>
      )}
      <Button
        type="button"
        className="mt-5 h-11 w-full"
        onClick={() => void signIn()}
        disabled={busy}
      >
        <LockKeyhole className="mr-1.5 h-4 w-4" />
        {busy ? "Connecting securely…" : "Continue as demo citizen"}
        <ArrowRight />
      </Button>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">
        Your demo account uses the same authenticated Mira services and
        persistent records as other accounts.
      </p>
    </div>
  );
}

function StaffLogin({
  role,
}: {
  role: "officer" | "verifier" | "admin" | "auditor";
}) {
  const { signIn, error, busy } = useDemoSignIn(role);
  const title =
    DEMO_ACCOUNTS.find((account) => account.role === role)?.title ??
    "Mira workspace";
  return (
    <div>
      <h2 className="text-xl font-semibold text-navy">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Continue with the configured synthetic demonstration account.
      </p>
      {error && (
        <p
          role="alert"
          className="mt-4 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          {error}
        </p>
      )}
      <Button
        type="button"
        className="mt-5 h-11 w-full"
        onClick={() => void signIn()}
        disabled={busy}
      >
        <LockKeyhole className="mr-1.5 h-4 w-4" />
        {busy ? "Connecting securely…" : `Continue to ${title}`}
        <ArrowRight />
      </Button>
      {role === "auditor" && (
        <p className="mt-4 text-xs text-muted-foreground">
          Auditor access is read-only.
        </p>
      )}
    </div>
  );
}
