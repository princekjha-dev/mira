import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShieldCheck,
  Search,
  Users,
  FileCheck2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { PageHeader, Panel } from "@/components/gov/ui";
import { Family360 } from "@/components/gov/Family360";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/verifier/family360")({
  head: () => ({
    meta: [
      { title: "Family360 Intelligence — Verification Officer Workstation" },
      {
        name: "description",
        content:
          "Multi-generational household graph, relationship evidence, and civil record verification workstation.",
      },
      { property: "og:title", content: "Family360 — Verification Officer" },
    ],
  }),
  component: VerifierFamily360Page,
});

export function VerifierFamily360Page() {
  const [householdInput, setHouseholdInput] = useState("MIRA-FAM-10482");
  const [activeHouseholdId, setActiveHouseholdId] = useState("MIRA-FAM-10482");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (householdInput.trim()) {
      setActiveHouseholdId(householdInput.trim());
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Family360 Household Intelligence"
          desc="Multi-generational relationship verification, civil evidence cross-referencing, and conflict detection."
          crumbs={[
            { label: "Verification Workstation", href: "/verifier/queue" },
            { label: "Family360" },
          ]}
        />

        {/* Household Switcher */}
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 shrink-0"
        >
          <div className="relative w-48 sm:w-60">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Household ID (e.g. MIRA-FAM-10482)..."
              value={householdInput}
              onChange={(e) => setHouseholdInput(e.target.value)}
              className="h-8 pl-8 text-xs font-mono bg-white dark:bg-slate-900"
            />
          </div>
          <Button
            type="submit"
            size="sm"
            variant="outline"
            className="h-8 text-xs"
          >
            Inspect
          </Button>
        </form>
      </div>

      {/* Main Family360 Component */}
      <Family360 householdId={activeHouseholdId} role="verifier" />

      {/* Connected Workstation Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <Link
          to="/verifier/queue"
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-gov/50 transition-colors dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gov/10 text-gov">
                <FileCheck2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Verification Queue
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Adjudicate pending claims
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </div>
        </Link>

        <Link
          to="/verifier/documents"
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-gov/50 transition-colors dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Evidence Vault & OCR
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Cross-examine documents
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </div>
        </Link>

        <Link
          to="/verifier/audit"
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-gov/50 transition-colors dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Audit Ledger
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Verify cryptographic seals
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </div>
        </Link>
      </div>
    </div>
  );
}
