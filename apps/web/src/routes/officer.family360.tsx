import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Users,
  Search,
  Sparkles,
  Award,
  Layers,
  ArrowRight,
  ClipboardList,
  MapPin,
} from "lucide-react";
import { PageHeader } from "@/components/gov/ui";
import { Family360 } from "@/components/gov/Family360";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/officer/family360")({
  head: () => ({
    meta: [
      { title: "Family360 Operations — Scheme & Field Officer" },
      {
        name: "description",
        content:
          "Operational multi-generational household registry, scheme eligibility evaluations, and field verification.",
      },
      { property: "og:title", content: "Family360 — Scheme Officer" },
    ],
  }),
  component: OfficerFamily360Page,
});

export function OfficerFamily360Page() {
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
        <PageHeader
          title="Family360 Scheme Operations"
          desc="Household composition analysis, multi-generational dependent verification, and statutory benefit eligibility."
          crumbs={[
            { label: "Scheme Operations", href: "/officer/schemes" },
            { label: "Family360" },
          ]}
        />

        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 shrink-0"
        >
          <div className="relative w-48 sm:w-60">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Household ID..."
              value={householdInput}
              onChange={(e) => setHouseholdInput(e.target.value)}
              className="h-8 pl-8 text-xs font-mono bg-white dark:bg-slate-900"
            />
          </div>
          <Button type="submit" size="sm" variant="outline" className="h-8 text-xs">
            Inspect
          </Button>
        </form>
      </div>

      {/* Family360 Component */}
      <Family360
        householdId={activeHouseholdId}
        role="officer"
      />

      {/* Operational Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <Link
          to="/officer/schemes"
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-gov/50 transition-colors dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gov/10 text-gov">
                <Award className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Scheme Catalog & Rules
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Review eligibility rules
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </div>
        </Link>

        <Link
          to="/officer/field-visits"
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-gov/50 transition-colors dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Field Visits
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Conduct on-site inspections
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </div>
        </Link>

        <Link
          to="/officer/applications"
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-gov/50 transition-colors dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-700">
                <ClipboardList className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Applications Queue
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Manage active submissions
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
