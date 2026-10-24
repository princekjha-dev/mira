import { Building2, Gift, Users, User, MapPin } from "lucide-react";
import type { Scheme } from "@/lib/data";
import { SchemeStatus } from "./SchemeStatus";
import { ApplicationCTA } from "./ApplicationCTA";
import { LevelBadge, Pill } from "@/components/gov/ui";
import { cn } from "@/lib/utils";

interface SchemeHeaderProps {
  scheme: Scheme;
  className?: string;
  hideCTA?: boolean;
}

export function SchemeHeader({ scheme, className, hideCTA = false }: SchemeHeaderProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs relative overflow-hidden",
        className
      )}
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-3.5 flex-1 min-w-0">
          {/* Department & Level Row */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300">
              <Building2 className="h-3.5 w-3.5 text-gov" />
              <span>{scheme.department}</span>
            </span>

            <span className="text-slate-300 dark:text-slate-700">•</span>

            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3 text-slate-400" />
              <span>{scheme.states.includes("All States") ? "Pan-India Central Scheme" : scheme.states.join(", ")}</span>
            </span>
          </div>

          {/* Scheme Title */}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
            {scheme.name}
          </h1>

          {/* Purpose description */}
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
            {scheme.description}
          </p>

          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <LevelBadge level={scheme.level} />
            <Pill>{scheme.category}</Pill>
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-800 dark:text-slate-200">
              <Gift className="h-3 w-3 text-gov" />
              <span>{scheme.benefitType}</span>
            </span>
            <SchemeStatus status={scheme.status} />
          </div>
        </div>

        {/* Right side CTAs */}
        {!hideCTA && (
          <div className="shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/60">
            <ApplicationCTA scheme={scheme} size="lg" />
          </div>
        )}
      </div>

      {/* Key Benefit Highlight Banner */}
      <div className="mt-6 rounded-xl border border-blue-200/80 bg-blue-50/70 dark:border-blue-900/50 dark:bg-blue-950/20 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] font-mono uppercase tracking-wider font-semibold text-blue-900 dark:text-blue-300">
            Primary Statutory Entitlement
          </p>
          <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
            {scheme.keyBenefit}
          </p>
        </div>

        <div className="shrink-0 text-xs font-medium text-blue-800 dark:text-blue-300 bg-white/80 dark:bg-slate-900/80 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-1.5 self-start sm:self-auto">
          Audience: {scheme.targetAudience}
        </div>
      </div>
    </div>
  );
}
