import { Link } from "@tanstack/react-router";
import { type ReactNode, type HTMLAttributes } from "react";
import {
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";

// ============================================================================
// 1. MiraPageHeader
// ============================================================================
export interface MiraPageHeaderProps {
  title: string;
  description?: string;
  context?: string;
  breadcrumbs?: { label: string; to?: string }[];
  actions?: ReactNode;
  badge?: ReactNode;
  className?: string;
}

export function MiraPageHeader({
  title,
  description,
  context,
  breadcrumbs,
  actions,
  badge,
  className,
}: MiraPageHeaderProps) {
  return (
    <div className={cn("space-y-1.5 pb-2", className)}>
      {/* Breadcrumbs or Context */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <div key={idx} className="flex items-center gap-1.5">
                {idx > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground/60" />}
                {crumb.to && !isLast ? (
                  <Link to={crumb.to as "/"} className="hover:text-foreground transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={cn(isLast ? "font-medium text-foreground" : "")}>{crumb.label}</span>
                )}
              </div>
            );
          })}
        </nav>
      )}

      {context && !breadcrumbs && (
        <div className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
          {context}
        </div>
      )}

      {/* Main Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-0.5">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{title}</h1>
            {badge}
          </div>
          {description && (
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
              {description}
            </p>
          )}
        </div>

        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}

// ============================================================================
// 2. MiraSectionHeader
// ============================================================================
export function MiraSectionHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-4 pb-2", className)}>
      <div>
        <h2 className="text-sm font-semibold text-foreground tracking-tight">{title}</h2>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ============================================================================
// 3. MiraCard
// ============================================================================
// 3. MiraCard — Apple-Inspired Card System (Section 13, 14, 15)
// ============================================================================
export interface MiraCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "standard" | "elevated" | "interactive" | "glass" | "compact" | "feature";
  interactive?: boolean;
}

export function MiraCard({
  children,
  className,
  variant = "standard",
  interactive = false,
  ...props
}: MiraCardProps) {
  const isInteractive = interactive || variant === "interactive";

  const variantStyles = {
    standard: "rounded-2xl border border-slate-200/80 bg-card text-card-foreground shadow-2xs dark:border-slate-800",
    elevated: "rounded-2xl border border-slate-200/70 bg-card text-card-foreground shadow-sm dark:border-slate-800 dark:shadow-slate-950/40",
    interactive: "rounded-2xl border border-slate-200/80 bg-card text-card-foreground shadow-2xs hover:border-slate-300 hover:shadow-xs active:scale-[0.99] cursor-pointer transition-all duration-150 dark:border-slate-800 dark:hover:border-slate-700",
    glass: "rounded-2xl border border-slate-200/60 bg-card/85 backdrop-blur-md text-card-foreground shadow-xs dark:border-slate-800/80 dark:bg-card/75",
    compact: "rounded-xl border border-slate-200/70 bg-card text-card-foreground shadow-2xs p-3 text-xs dark:border-slate-800",
    feature: "rounded-3xl border border-slate-200/80 bg-gradient-to-b from-card to-secondary/30 text-card-foreground shadow-md dark:border-slate-800 dark:from-card dark:to-card/50",
  };

  return (
    <div
      className={cn(
        variantStyles[variant],
        isInteractive && variant !== "interactive" && "hover:border-slate-300 hover:shadow-xs active:scale-[0.99] cursor-pointer transition-all duration-150 dark:hover:border-slate-700",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================================================
// 4. MiraStatCard
// ============================================================================
export function MiraStatCard({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  className,
}: {
  title: string;
  value: string | number;
  subtext?: string;
  icon?: LucideIcon;
  trend?: { label: string; tone?: "positive" | "warning" | "neutral" };
  className?: string;
}) {
  return (
    <MiraCard className={cn("p-4.5 sm:p-5", className)}>
      <div className="flex items-center justify-between text-muted-foreground">
        <span className="text-xs font-medium tracking-tight text-muted-foreground">{title}</span>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground shrink-0" />}
      </div>
      <div className="mt-2 text-2xl font-bold tracking-tight text-foreground">{value}</div>
      {(subtext || trend) && (
        <div className="mt-1 flex items-center gap-1.5 text-[11px]">
          {trend && (
            <span
              className={cn(
                "font-semibold",
                trend.tone === "positive"
                  ? "text-teal-600 dark:text-teal-400"
                  : trend.tone === "warning"
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-muted-foreground"
              )}
            >
              {trend.label}
            </span>
          )}
          {subtext && <span className="text-muted-foreground">{subtext}</span>}
        </div>
      )}
    </MiraCard>
  );
}

// ============================================================================
// 5. MiraStatus — Central Semantic Status System
// ============================================================================
export type MiraStatusType =
  | "Verified"
  | "Approved"
  | "Pending"
  | "Under Review"
  | "Officer Review"
  | "Documents Under Review"
  | "Verification Required"
  | "Action Required"
  | "Additional Evidence Required"
  | "Mismatch"
  | "Escalated"
  | "Draft"
  | "Submitted"
  | "Rejected"
  | "Archived"
  | string;

export function MiraStatus({ status, className }: { status: MiraStatusType; className?: string }) {
  const norm = (status || "").toLowerCase().trim();

  // Positive / Verified / Approved
  if (norm === "verified" || norm === "approved" || norm === "completed") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full border border-teal-500/30 bg-teal-500/10 px-2 py-0.5 text-[11px] font-semibold text-teal-700 dark:border-teal-400/20 dark:bg-teal-500/15 dark:text-teal-300",
          className
        )}
      >
        <CheckCircle2 className="h-3 w-3" />
        <span>{status}</span>
      </span>
    );
  }

  // Warning / Mismatch / Action Required / Additional Evidence
  if (
    norm.includes("mismatch") ||
    norm.includes("evidence") ||
    norm.includes("action") ||
    norm === "verification required"
  ) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:border-amber-400/20 dark:bg-amber-500/15 dark:text-amber-300",
          className
        )}
      >
        <AlertTriangle className="h-3 w-3" />
        <span>{status}</span>
      </span>
    );
  }

  // In Progress / Under Review / Submitted
  if (norm.includes("review") || norm === "submitted" || norm === "in progress") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-700 dark:border-blue-400/20 dark:bg-blue-500/15 dark:text-blue-300",
          className
        )}
      >
        <Clock className="h-3 w-3" />
        <span>{status}</span>
      </span>
    );
  }

  // Rejected / Danger
  if (norm === "rejected") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[11px] font-semibold text-red-700 dark:border-red-400/20 dark:bg-red-500/15 dark:text-red-300",
          className
        )}
      >
        <XCircle className="h-3 w-3" />
        <span>{status}</span>
      </span>
    );
  }

  // Neutral (Draft, Archived, Default)
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-border bg-muted/60 px-2 py-0.5 text-[11px] font-medium text-muted-foreground",
        className
      )}
    >
      <span>{status}</span>
    </span>
  );
}

// ============================================================================
// 6. MiraBadge
// ============================================================================
export function MiraBadge({
  children,
  tone = "neutral",
  variant = "solid",
  size = "md",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "primary" | "teal" | "amber" | "red" | "blue";
  variant?: "solid" | "outline";
  size?: "sm" | "md";
  className?: string;
}) {
  const tones = {
    neutral: "border-border bg-muted/60 text-muted-foreground",
    primary: "border-primary/20 bg-primary/10 text-primary font-semibold",
    teal: "border-teal-500/30 bg-teal-500/10 text-teal-700 dark:text-teal-300 font-semibold",
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold",
    red: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300 font-semibold",
    blue: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300 font-semibold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border",
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[11px]",
        variant === "outline" ? "bg-transparent" : tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

// ============================================================================
// 7. MiraButton
// ============================================================================
export interface MiraButtonProps extends Omit<ButtonProps, "variant" | "size"> {
  variant?: "primary" | "secondary" | "tertiary" | "destructive" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
}

export function MiraButton({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  className,
  ...props
}: MiraButtonProps) {
  const customVariant =
    variant === "primary"
      ? "default"
      : variant === "secondary"
      ? "secondary"
      : variant === "tertiary"
      ? "outline"
      : variant === "destructive"
      ? "destructive"
      : "ghost";

  const customSize = size === "sm" ? "sm" : size === "lg" ? "lg" : "default";

  return (
    <Button
      variant={customVariant}
      size={customSize}
      className={cn("tactile-btn text-xs font-medium rounded-xl select-none", className)}
      {...props}
    >
      {Icon && <Icon className="mr-1.5 h-3.5 w-3.5 shrink-0" />}
      {children}
    </Button>
  );
}

// ============================================================================
// 7b. MiraSegmentedControl — Apple HIG Segmented Switcher (Section 18)
// ============================================================================
export interface SegmentItem<T extends string> {
  id: T;
  label: string;
  count?: number;
  icon?: LucideIcon;
}

export function MiraSegmentedControl<T extends string>({
  items,
  value,
  onChange,
  className,
}: {
  items: SegmentItem<T>[];
  value: T;
  onChange: (val: T) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-1 p-1 rounded-xl bg-slate-200/60 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 text-xs font-medium",
        className
      )}
    >
      {items.map((item) => {
        const isSelected = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(item.id)}
            className={cn(
              "tactile-btn relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-150 outline-none",
              isSelected
                ? "bg-white text-slate-900 font-semibold shadow-xs dark:bg-slate-900 dark:text-slate-100 dark:shadow-slate-950/40"
                : "text-muted-foreground hover:text-foreground hover:bg-slate-100/50 dark:hover:bg-slate-700/50"
            )}
          >
            {item.icon && <item.icon className="h-3.5 w-3.5 shrink-0" />}
            <span>{item.label}</span>
            {typeof item.count === "number" && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.2 text-[10px] font-mono tabular-nums",
                  isSelected
                    ? "bg-primary/10 text-primary font-bold"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ============================================================================
// 8. MiraTable Primitives
// ============================================================================
export function MiraTable({ children, className }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border/70 bg-card">
      <table className={cn("w-full text-left text-xs", className)}>{children}</table>
    </div>
  );
}

export function MiraTableHeader({ children, className }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("border-b border-border/80 bg-muted/30 font-medium text-muted-foreground", className)}>{children}</thead>;
}

export function MiraTableRow({ children, className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={cn("border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors", className)} {...props}>
      {children}
    </tr>
  );
}

export function MiraTableHead({ children, className }: HTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn("p-3.5 font-medium text-muted-foreground", className)}>{children}</th>;
}

export function MiraTableCell({ children, className }: HTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("p-3.5 text-foreground", className)}>{children}</td>;
}

// ============================================================================
// 9. MiraEmptyState
// ============================================================================
export function MiraEmptyState({
  title,
  description,
  icon: Icon = HelpCircle,
  action,
  className,
}: {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 p-8 sm:p-12 text-center", className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-3 text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground max-w-sm leading-relaxed">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ============================================================================
// 10. MiraSkeleton
// ============================================================================
export function MiraSkeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-muted/60", className)} />;
}
