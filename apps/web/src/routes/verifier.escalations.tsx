import { createFileRoute, Link } from "@tanstack/react-router";
import { Flag, ArrowRight, ShieldAlert, CheckCircle2, AlertTriangle } from "lucide-react";
import { useApp } from "@/lib/app-state";
import { getScheme } from "@/lib/data";
import { PageHeader, StatusBadge } from "@/components/gov/ui";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/verifier/escalations")({
  head: () => ({
    meta: [
      { title: "Escalations & Flags — Verifier Workstation" },
      { name: "description", content: "High-risk cases, policy ambiguities, and supervisor reviews." },
    ],
  }),
  component: VerifierEscalationsPage,
});

function VerifierEscalationsPage() {
  const { state } = useApp();
  const escalated = state.applications.filter(
    (a) => a.duplicate || (a.events && a.events.some((e) => e.text.toLowerCase().includes("escalat")))
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Supervisor Escalations & Complex Cases"
        desc="Applications involving household split legal disputes, historical duplicate overlap, or policy exceptions."
        crumbs={[{ label: "Verifier", to: "/verifier/dashboard" }, { label: "Escalations" }]}
      />

      <div className="space-y-4">
        {escalated.map((a) => (
          <Card key={a.id} className="border-border/80 shadow-xs">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flag className="h-4 w-4 text-blue-600" />
                  <span className="font-mono text-xs font-semibold text-primary">{a.id}</span>
                  <StatusBadge s={a.status} />
                </div>
                <span className="text-xs text-muted-foreground">{a.householdId}</span>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-1 text-xs space-y-2">
              <p className="font-medium text-foreground">{a.applicant} — {getScheme(a.schemeId)?.name || "Welfare Assistance"}</p>
              <div className="rounded-md border bg-muted/30 p-2.5 text-muted-foreground">
                <span className="font-semibold text-foreground">Escalation Trigger: </span>
                {a.duplicate
                  ? "Historical benefit duplication detected across 2021 household bifurcation boundary. Requires Joint Secretary / Supervisor concurrence."
                  : "Supervisory review requested for policy interpretation."}
              </div>
              <div className="flex justify-end pt-2">
                <Button size="sm" asChild className="h-8 text-xs">
                  <Link to="/verifier/applications/$id" params={{ id: a.id }}>
                    Review Escalation <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {escalated.length === 0 && (
          <Card className="p-8 text-center text-muted-foreground border-dashed">
            <CheckCircle2 className="mx-auto h-8 w-8 text-teal-600" />
            <p className="mt-2 text-sm font-medium">No active escalations</p>
          </Card>
        )}
      </div>
    </div>
  );
}
