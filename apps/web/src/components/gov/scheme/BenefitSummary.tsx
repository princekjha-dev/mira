import { Link } from "@tanstack/react-router";
import { Gift, Check, ArrowRight, ShieldCheck, Wallet, Calendar } from "lucide-react";
import type { Scheme } from "@/lib/data";
import { useApp } from "@/lib/app-state";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BenefitSummaryProps {
  scheme: Scheme;
  className?: string;
}

export function BenefitSummary({ scheme, className }: BenefitSummaryProps) {
  const { state } = useApp();
  const session = state.session;
  const isCitizen = session?.role === "citizen";

  // Check if citizen has active benefits under this scheme
  const linkedBenefit = isCitizen
    ? state.benefits?.find((b) => b.schemeId === scheme.id || b.scheme === scheme.name)
    : null;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Active Entitlement Notice if citizen already has it */}
      {linkedBenefit && (
        <div className="rounded-xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="text-[11px] font-mono uppercase font-semibold text-emerald-800 dark:text-emerald-300">
                Active Household Entitlement
              </span>
              <p className="text-sm font-semibold text-emerald-950 dark:text-emerald-100">
                Reference ID: {linkedBenefit.ref} ({linkedBenefit.status})
              </p>
              <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80">
                Granted to: {linkedBenefit.beneficiary} • Approved: {linkedBenefit.approvedOn}
              </p>
            </div>
          </div>

          <Button
            size="sm"
            asChild
            className="rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs shadow-2xs self-start sm:self-auto shrink-0"
          >
            <Link to="/citizen/benefits" search={{ schemeId: scheme.id } as any}>
              <span>Manage in My Benefits</span>
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </div>
      )}

      {/* Main Benefits Card */}
      <div className="rounded-xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-5">
        <div className="space-y-1">
          <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-primary">
            Entitlement Specification
          </span>
          <h3 className="text-lg font-bold text-foreground">
            {scheme.keyBenefit}
          </h3>
          <p className="text-xs text-muted-foreground">
            Category: {scheme.category} • Delivery Mechanism: {scheme.benefitType}
          </p>
        </div>

        {/* Benefits points */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
            Key Package Components
          </h4>

          <ul className="grid grid-cols-1 gap-2.5">
            {scheme.benefitsSummary.map((item, idx) => (
              <li
                key={idx}
                className="rounded-lg border border-border/60 bg-muted/20 p-3.5 flex items-start gap-3"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold font-mono">
                  {idx + 1}
                </span>
                <span className="text-xs sm:text-sm text-foreground font-medium leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Delivery Mode details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border/60 text-xs">
          <div className="rounded-lg bg-muted/40 p-3 space-y-1">
            <span className="text-[11px] font-mono uppercase text-muted-foreground flex items-center gap-1">
              <Wallet className="h-3 w-3 text-gov" />
              <span>Disbursal Channel</span>
            </span>
            <p className="font-semibold text-foreground">
              {scheme.benefitType.includes("DBT")
                ? "PFMS Electronic Direct Transfer"
                : scheme.benefitType.includes("Healthcare")
                  ? "Paperless Cashless Hospital Admission"
                  : "State Treasury / Gram Panchayat"}
            </p>
          </div>

          <div className="rounded-lg bg-muted/40 p-3 space-y-1">
            <span className="text-[11px] font-mono uppercase text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3 text-gov" />
              <span>Sanction Schedule</span>
            </span>
            <p className="font-semibold text-foreground">
              {scheme.deadlines || "Rolling Application Cycle"}
            </p>
          </div>

          <div className="rounded-lg bg-muted/40 p-3 space-y-1">
            <span className="text-[11px] font-mono uppercase text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-gov" />
              <span>Statutory Guarantee</span>
            </span>
            <p className="font-semibold text-foreground">
              Direct Entitlement Under Scheme Rules
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
