import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Eye, ShieldCheck, Lock, ArrowRight } from "lucide-react";
import { useApp } from "@/lib/app-state";
import { getScheme } from "@/lib/data";
import { PageHeader, StatusBadge } from "@/components/gov/ui";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auditor/applications")({
  head: () => ({
    meta: [
      { title: "Applications Audit — Forensic Inspection" },
      { name: "description", content: "Read-only application audit inspection." },
    ],
  }),
  component: AuditorApplicationsPage,
});

function AuditorApplicationsPage() {
  const { state } = useApp();
  const [q, setQ] = useState("");

  const apps = state.applications.filter((a) => {
    const s = q.trim().toLowerCase();
    const schemeName = getScheme(a.schemeId)?.name || "";
    return (
      !s ||
      a.id.toLowerCase().includes(s) ||
      a.applicant.toLowerCase().includes(s) ||
      a.householdId.toLowerCase().includes(s) ||
      schemeName.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Application Records Audit Inspection"
        desc="Examine complete application data trails, stage transitions, and verification evidence without write locks."
        crumbs={[{ label: "Auditor", to: "/auditor/dashboard" }, { label: "Applications" }]}
      />

      <div className="flex items-center max-w-md">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter by application, citizen, or household ID…"
          className="text-xs"
        />
      </div>

      <Card className="border-border/80 shadow-xs overflow-hidden">
        <CardContent className="p-0">
          <table className="w-full text-left text-xs">
            <thead className="border-b bg-muted/40 font-medium text-muted-foreground">
              <tr>
                <th className="p-3.5 pl-4">Application ID</th>
                <th className="p-3.5">Applicant & Household</th>
                <th className="p-3.5">Scheme</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Audit Integrity</th>
                <th className="p-3.5 pr-4 text-right">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {apps.map((a) => (
                <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3.5 pl-4 font-mono font-semibold text-primary">{a.id}</td>
                  <td className="p-3.5">
                    <div className="font-medium">{a.applicant}</div>
                    <div className="text-[11px] text-muted-foreground">{a.householdId}</div>
                  </td>
                  <td className="p-3.5 text-muted-foreground">{getScheme(a.schemeId)?.name || "Welfare Assistance"}</td>
                  <td className="p-3.5">
                    <StatusBadge s={a.status} />
                  </td>
                  <td className="p-3.5">
                    <span className="flex items-center gap-1 text-teal-600 font-medium text-[11px]">
                      <ShieldCheck className="h-3 w-3" /> Sealed SHA-256
                    </span>
                  </td>
                  <td className="p-3.5 pr-4 text-right">
                    <Button size="sm" variant="outline" asChild className="h-7 text-xs">
                      <Link to="/officer/applications/$id" params={{ id: a.id }}>
                        <Eye className="mr-1 h-3 w-3" /> View Provenance
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
