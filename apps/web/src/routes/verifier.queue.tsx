import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileCheck2,
  SlidersHorizontal,
} from "lucide-react";
import { useApp } from "@/lib/app-state";
import { getScheme } from "@/lib/data";
import { PageHeader, StatusBadge } from "@/components/gov/ui";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/verifier/queue")({
  head: () => ({
    meta: [
      { title: "Verification Queue — Verifier Workstation" },
      { name: "description", content: "High-density queue of welfare applications awaiting verification." },
    ],
  }),
  component: VerifierQueuePage,
});

function VerifierQueuePage() {
  const { state } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [mismatchOnly, setMismatchOnly] = useState(false);

  const filtered = useMemo(() => {
    return state.applications.filter((a) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        a.id.toLowerCase().includes(q) ||
        a.applicant.toLowerCase().includes(q) ||
        a.householdId.toLowerCase().includes(q) ||
        (getScheme(a.schemeId)?.name || "").toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "pending" && (a.status === "Documents Under Review" || a.status === "Verification Required" || a.status === "Officer Review")) ||
        a.status === statusFilter;

      const matchesMismatch = !mismatchOnly || !!a.mismatch;

      return matchesSearch && matchesStatus && matchesMismatch;
    });
  }, [state.applications, search, statusFilter, mismatchOnly]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Verification Determination Queue"
        desc="Interactive triage table. Review applicant records, registry mismatches, and submit statutory findings."
        crumbs={[{ label: "Verifier", to: "/verifier/dashboard" }, { label: "Queue" }]}
      />

      {/* Control Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Application ID, Citizen, or Household…"
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border bg-card p-1 text-xs">
            <Button
              size="sm"
              variant={statusFilter === "all" ? "secondary" : "ghost"}
              className="h-7 text-xs"
              onClick={() => setStatusFilter("all")}
            >
              All ({state.applications.length})
            </Button>
            <Button
              size="sm"
              variant={statusFilter === "pending" ? "secondary" : "ghost"}
              className="h-7 text-xs"
              onClick={() => setStatusFilter("pending")}
            >
              Pending Verification
            </Button>
            <Button
              size="sm"
              variant={statusFilter === "Approved" ? "secondary" : "ghost"}
              className="h-7 text-xs"
              onClick={() => setStatusFilter("Approved")}
            >
              Approved
            </Button>
          </div>

          <Button
            size="sm"
            variant={mismatchOnly ? "default" : "outline"}
            className="h-8 text-xs"
            onClick={() => setMismatchOnly(!mismatchOnly)}
          >
            <AlertTriangle className="mr-1.5 h-3.5 w-3.5 text-amber-500" />
            Mismatches Only
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <Card className="border-border/80 shadow-xs overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b bg-muted/50 text-muted-foreground font-medium">
                <tr>
                  <th className="p-3.5 pl-4">Application ID</th>
                  <th className="p-3.5">Applicant & Household</th>
                  <th className="p-3.5">Scheme</th>
                  <th className="p-3.5">Stage & Status</th>
                  <th className="p-3.5">Discrepancy / Signal</th>
                  <th className="p-3.5 pr-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3.5 pl-4 font-mono font-semibold text-primary">
                      {a.id}
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-foreground">{a.applicant}</div>
                      <div className="text-[11px] text-muted-foreground">{a.householdId}</div>
                    </td>
                    <td className="p-3.5 max-w-[200px] truncate text-foreground">
                      {getScheme(a.schemeId)?.name || "Welfare Assistance"}
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5">
                        <StatusBadge s={a.status} />
                        <span className="text-[10px] text-muted-foreground">Stage {a.stage}/6</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      {a.mismatch ? (
                        <Badge variant="outline" className="border-amber-400 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px]">
                          Mismatch: {a.mismatch.field}
                        </Badge>
                      ) : a.duplicate ? (
                        <Badge variant="outline" className="border-blue-400 bg-blue-500/10 text-blue-700 dark:text-blue-300 text-[10px]">
                          Overlap Signal
                        </Badge>
                      ) : (
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-teal-600" /> Consistent
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 pr-4 text-right">
                      <Button size="sm" asChild className="h-7 text-xs">
                        <Link to="/verifier/applications/$id" params={{ id: a.id }}>
                          Inspect <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
