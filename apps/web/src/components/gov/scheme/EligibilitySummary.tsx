import { Link } from "@tanstack/react-router";
import { CheckCircle2, AlertCircle, Info, Sparkles, ArrowRight } from "lucide-react";
import type { Scheme } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EligibilitySummaryProps {
  scheme: Scheme;
  className?: string;
}

export function EligibilitySummary({ scheme, className }: EligibilitySummaryProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Criteria Breakdown Grid */}
      <div className="rounded-xl border border-border/80 bg-card p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Statutory Eligibility Requirements
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Verified against cross-departmental administrative registries during application processing.
            </p>
          </div>

          <Button
            size="sm"
            asChild
            className="hidden sm:inline-flex rounded-lg bg-navy hover:bg-navy/90 text-white font-medium text-xs shadow-xs"
          >
            <Link to="/eligibility" search={{ scheme: scheme.id }}>
              <Sparkles className="h-3.5 w-3.5 mr-1 text-gov" />
              <span>Interactive Eligibility Test</span>
            </Link>
          </Button>
        </div>

        <ul className="divide-y divide-border/60">
          {scheme.eligibility.map((item, idx) => (
            <li key={idx} className="py-3 flex items-start gap-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-xs sm:text-sm">
                <span className="font-medium text-foreground">{item}</span>
              </div>
            </li>
          ))}
        </ul>

        {/* Structured parameter details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-border/60 text-xs">
          <div className="rounded-lg bg-muted/40 p-3 space-y-1">
            <span className="text-[11px] font-mono uppercase text-muted-foreground">Evaluation Unit</span>
            <p className="font-semibold text-foreground">
              {scheme.level === "Household" ? "Entire Household (Family360)" : "Individual Beneficiary"}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {scheme.level === "Household"
                ? "Prior benefits received by any household member are checked."
                : "Entitlement granted directly to the individual applicant."}
            </p>
          </div>

          <div className="rounded-lg bg-muted/40 p-3 space-y-1">
            <span className="text-[11px] font-mono uppercase text-muted-foreground">Income Ceiling</span>
            <p className="font-semibold text-foreground">
              {scheme.incomeMax
                ? `₹${scheme.incomeMax.toLocaleString("en-IN")} per year`
                : "No strict ceiling / Category based"}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {scheme.bplRequired ? "Requires verified BPL / Priority Ration Card." : "Income certificate issued by Revenue authority."}
            </p>
          </div>

          <div className="rounded-lg bg-muted/40 p-3 space-y-1">
            <span className="text-[11px] font-mono uppercase text-muted-foreground">Geographic Jurisdiction</span>
            <p className="font-semibold text-foreground">
              {scheme.states.includes("All States") ? "All States & UTs" : scheme.states.join(", ")}
            </p>
            <p className="text-[11px] text-muted-foreground">
              State-specific rules apply where administered by state departments.
            </p>
          </div>
        </div>
      </div>

      {/* Verification Notice */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-4 sm:p-5 flex items-start gap-3.5">
        <Info className="h-5 w-5 text-gov shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <p className="font-medium text-slate-900 dark:text-slate-100">
            Automated Registry Verification Notice
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            During application submission, Mira performs real-time queries against Aadhaar (UIDAI), Land Records (Bhulekh),
            Public Distribution System (NFSA), and PFMS treasury records. Any discrepancy between declared data and registry
            records will trigger an official clarification request in your Communications inbox.
          </p>
        </div>
      </div>
    </div>
  );
}
