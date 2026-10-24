import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ShieldCheck,
  Search,
  Lock,
  Layers,
  ArrowRight,
  FileCheck2,
  FileText,
} from "lucide-react";
import { PageHeader } from "@/components/gov/ui";
import { Family360 } from "@/components/gov/Family360";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/auditor/family360")({
  head: () => ({
    meta: [
      { title: "Family360 Forensic Record — Auditor Oversight" },
      {
        name: "description",
        content:
          "Read-only cryptographic audit perspective over household compositions, historical relationship alterations, and CAG compliance.",
      },
      { property: "og:title", content: "Family360 — Auditor" },
    ],
  }),
  component: AuditorFamily360Page,
});

export function AuditorFamily360Page() {
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <PageHeader
              title="Family360 Forensic Inspection"
              desc="Read-only statutory inspection of household relationships, cryptographic evidence links, and state modification trails."
              crumbs={[
                { label: "Audit Overview", href: "/auditor/dashboard" },
                { label: "Family360" },
              ]}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Badge
            variant="outline"
            className="bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20 text-xs py-1 px-2.5 gap-1.5"
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Forensic Read-Only Mode</span>
          </Badge>

          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 shrink-0"
          >
            <div className="relative w-44 sm:w-56">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Household ID..."
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
              Audit
            </Button>
          </form>
        </div>
      </div>

      {/* Family360 Component with readOnly flag */}
      <Family360
        householdId={activeHouseholdId}
        role="auditor"
        readOnly={true}
      />

      {/* Forensic Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <Link
          to="/auditor/audit"
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-gov/50 transition-colors dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gov/10 text-gov">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Forensic Audit Ledger
                </p>
                <p className="text-[11px] text-muted-foreground">
                  SHA-256 Merkle chain logs
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </div>
        </Link>

        <Link
          to="/auditor/compliance"
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-gov/50 transition-colors dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700">
                <FileCheck2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Compliance Benchmarks
                </p>
                <p className="text-[11px] text-muted-foreground">
                  CAG welfare parameters
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </div>
        </Link>

        <Link
          to="/auditor/reports"
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-gov/50 transition-colors dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-700">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Audit Reports
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Discrepancy and duplicate reports
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
