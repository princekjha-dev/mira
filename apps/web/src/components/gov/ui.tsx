import { Link } from "@tanstack/react-router";
import { Check, Circle, Loader2, Lock, X, AlertTriangle } from "lucide-react";
import type { ReactNode } from "react";
import {
  TIMELINE_STAGES,
  type AppStatus,
  type Application,
  type Level,
} from "@/lib/data";
import { useApp, type Role } from "@/lib/app-state";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const tone: Record<string, string> = {
  neutral: "bg-muted text-muted-foreground border-border",
  info: "bg-secondary text-gov border-gov/30",
  warn: "bg-warning/10 text-warning-foreground border-warning/40",
  ok: "bg-success/10 text-success border-success/30",
  bad: "bg-destructive/10 text-destructive border-destructive/30",
  teal: "bg-accent text-accent-foreground border-teal/30",
};
export function Pill({
  children,
  t = "neutral",
  className,
}: {
  children: ReactNode;
  t?: keyof typeof tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        tone[t],
        className,
      )}
    >
      {children}
    </span>
  );
}

const statusTone: Record<AppStatus, keyof typeof tone> = {
  Draft: "neutral",
  Submitted: "info",
  "Documents Under Review": "info",
  "Verification Required": "warn",
  "Officer Review": "teal",
  Approved: "ok",
  Rejected: "bad",
  "Additional Evidence Required": "warn",
};
export const StatusBadge = ({ s }: { s: AppStatus }) => (
  <Pill t={statusTone[s]}>{s}</Pill>
);

export function LevelBadge({ level }: { level: Level }) {
  return level === "Household" ? (
    <Pill t="teal" className="uppercase tracking-wide">
      Household
    </Pill>
  ) : (
    <Pill t="info" className="uppercase tracking-wide">
      Individual
    </Pill>
  );
}

export function PageContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 md:py-10",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  desc,
  actions,
  crumbs,
  eyebrow,
}: {
  title: string;
  desc?: string;
  actions?: ReactNode;
  crumbs?: { label: string; to?: string }[];
  eyebrow?: string;
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        {crumbs && (
          <nav
            aria-label="Breadcrumb"
            className="mb-1 text-xs text-muted-foreground"
          >
            {crumbs.map((c, i) => (
              <span key={i}>
                {c.to ? (
                  <Link to={c.to} className="hover:text-gov hover:underline">
                    {c.label}
                  </Link>
                ) : (
                  c.label
                )}
                {i < crumbs.length - 1 && " / "}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && (
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700">
            {eyebrow}
          </p>
        )}
        <h1 className="text-[clamp(1.7rem,3vw,2.25rem)] font-semibold leading-tight tracking-tight text-slate-950">
          {title}
        </h1>
        {desc && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {desc}
          </p>
        )}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({
  title,
  children,
  actions,
  className,
}: {
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.045)]",
        className,
      )}
    >
      {title && (
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-sm font-semibold text-navy">{title}</h2>
          {actions}
        </div>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

export function Empty({
  title,
  body,
  action,
}: {
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center">
      <p className="font-semibold text-slate-900">{title}</p>
      {body && (
        <p className="mx-auto mt-1.5 max-w-lg text-sm leading-6 text-slate-600">
          {body}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function SectionHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-slate-600">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div
      className="flex min-h-28 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-600"
      role="status"
    >
      <Loader2 className="h-4 w-4 animate-spin text-blue-700" />
      {label}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  body = "We couldn't load this information right now.",
  onRetry,
}: {
  title?: string;
  body?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="rounded-xl border border-amber-200 bg-amber-50/60 p-5"
      role="alert"
    >
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-sm text-slate-700">{body}</p>
      {onRetry && (
        <Button
          type="button"
          variant="outline"
          className="mt-3 border-slate-300 bg-white"
          onClick={onRetry}
        >
          Try again
        </Button>
      )}
    </div>
  );
}

export function Timeline({ app }: { app: Application }) {
  const rejected = app.status === "Rejected";
  const stage = app.status === "Approved" && app.stage < 5 ? 5 : app.stage;
  return (
    <ol className="space-y-0">
      {TIMELINE_STAGES.map((label, i) => {
        const state =
          i < stage || (i === stage && i === 6 && app.status === "Approved")
            ? "done"
            : i === stage
              ? "current"
              : "pending";
        const failed = rejected && i === 5;
        return (
          <li key={label} className="relative flex gap-3 pb-5 last:pb-0">
            {i < TIMELINE_STAGES.length - 1 && (
              <span
                className={cn(
                  "absolute left-[11px] top-6 h-full w-px",
                  state === "done" ? "bg-success" : "bg-border",
                )}
                aria-hidden
              />
            )}
            <span
              className={cn(
                "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
                failed
                  ? "border-destructive bg-destructive text-destructive-foreground"
                  : state === "done"
                    ? "border-success bg-success text-success-foreground"
                    : state === "current"
                      ? "border-warning bg-card text-warning"
                      : "border-border bg-card text-muted-foreground",
              )}
            >
              {failed ? (
                <X className="h-3.5 w-3.5" />
              ) : state === "done" ? (
                <Check className="h-3.5 w-3.5" />
              ) : state === "current" ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Circle className="h-2 w-2" />
              )}
            </span>
            <div>
              <p
                className={cn(
                  "text-sm font-medium",
                  state === "pending" && "text-muted-foreground",
                )}
              >
                {label}
              </p>
              <p className="text-xs text-muted-foreground">
                {failed
                  ? "Rejected — see reason"
                  : state === "done"
                    ? "Completed"
                    : state === "current"
                      ? app.status === "Verification Required" ||
                        app.status === "Additional Evidence Required"
                        ? "Action needed: " + app.status
                        : "In progress"
                      : "Pending"}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function RequireRole({
  role,
  children,
}: {
  role: Role;
  children: ReactNode;
}) {
  const { state, hydrated } = useApp();
  if (!hydrated)
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading…
      </div>
    );
  if (state.session?.role !== role) {
    const to = role === "officer" ? "/officer/login" : "/login";
    return (
      <div className="mx-auto my-16 max-w-md rounded-lg border bg-card p-8 text-center">
        <Lock className="mx-auto h-8 w-8 text-gov" />
        <h1 className="mt-3 text-lg font-semibold">Sign in required</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This area is for{" "}
          {role === "citizen"
            ? "citizens"
            : role === "officer"
              ? "government officers"
              : "department administrators"}
          . Please sign in with the correct account type.
        </p>
        <Button asChild className="mt-5">
          <Link to={to}>Go to sign in</Link>
        </Button>
      </div>
    );
  }
  return <>{children}</>;
}

export function Emblem({ className }: { className?: string }) {
  return (
    <img
      src="/miraicon.svg"
      alt="Mira Emblem"
      className={cn("h-10 w-10 rounded-xl object-contain shrink-0", className)}
      loading="eager"
    />
  );
}

export function DemoNotice({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2 rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-xs text-warning-foreground">
      <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
      <span>{children}</span>
    </div>
  );
}
