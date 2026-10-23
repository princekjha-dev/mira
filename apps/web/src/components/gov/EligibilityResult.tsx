import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import type { Criterion, Outcome } from "@/lib/eligibility";
import { cn } from "@/lib/utils";

const icon = { pass: CheckCircle2, verify: AlertTriangle, fail: XCircle };
const color = { pass: "text-success", verify: "text-warning", fail: "text-destructive" };
const word = { pass: "Eligible", verify: "Verification Required", fail: "Not met" };

export function EligibilityResult({ criteria, outcome }: { criteria: Criterion[]; outcome: Outcome }) {
  const box = outcome === "Likely Eligible" ? "border-success/40 bg-success/5" : outcome === "Verification Required" ? "border-warning/50 bg-warning/5" : "border-destructive/40 bg-destructive/5";
  return (
    <div className="space-y-4">
      <ul className="divide-y rounded-lg border bg-card">
        {criteria.map((c) => { const I = icon[c.status]; return (
          <li key={c.label} className="flex gap-3 p-3">
            <I className={cn("mt-0.5 h-5 w-5 shrink-0", color[c.status])} aria-hidden />
            <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><p className="font-medium">{c.label}</p><span className={cn("text-sm font-medium", color[c.status])}>{word[c.status]}</span></div><p className="text-sm text-muted-foreground">{c.detail}</p></div>
          </li>
        ); })}
      </ul>
      <div className={cn("rounded-lg border-2 p-4", box)} role="status">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Final status</p>
        <p className="text-lg font-semibold">{outcome}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {outcome === "Likely Eligible" && "All criteria are met based on the information available. Final approval is made by the officer after document verification."}
          {outcome === "Verification Required" && "Some criteria need record or document checks (shown above with ⚠). You can still apply; an officer will verify."}
          {outcome === "Currently Not Eligible" && "One or more criteria are not met (shown above with ✕). If your records are outdated, you can update them and check again."}
        </p>
      </div>
    </div>
  );
}
