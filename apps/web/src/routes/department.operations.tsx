import { createFileRoute } from "@tanstack/react-router";
import { Activity, Clock, AlertTriangle, CheckCircle2, TrendingUp, ShieldAlert, BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/gov/ui";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/department/operations")({
  head: () => ({
    meta: [
      { title: "Operations & Queue Health — Department" },
      { name: "description", content: "Real-time queue health, SLA breaches, bottleneck analysis, and load distribution." },
    ],
  }),
  component: DeptOperationsPage,
});

function DeptOperationsPage() {
  const queues = [
    { name: "Rural Housing Assistance (Tier 1 Triage)", count: 28, slaBreaches: 0, medianTime: "11.4h", health: "Optimal" },
    { name: "Old Age Pension Cross-Verification", count: 64, slaBreaches: 1, medianTime: "18.2h", health: "Normal" },
    { name: "Farmer Fertilizer Subsidy Aadhaar Linkage", count: 112, slaBreaches: 3, medianTime: "26.8h", health: "Elevated" },
    { name: "State Girl Child Education Grant", count: 19, slaBreaches: 0, medianTime: "8.5h", health: "Optimal" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Operations & Queue Health Monitoring"
        desc="Systemic SLA tracking, verification bottleneck detection, and processing load indicators across administrative blocks."
        crumbs={[{ label: "Department", to: "/department/dashboard" }, { label: "Operations" }]}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="border-border/80 shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs font-medium text-muted-foreground">Overall System Health</span>
            <div className="mt-2 text-2xl font-bold text-teal-600 flex items-center gap-1.5">
              <CheckCircle2 className="h-6 w-6" /> 99.4%
            </div>
            <p className="text-[11px] text-muted-foreground">All verification services active</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs font-medium text-muted-foreground">SLA Breaches (24h)</span>
            <div className="mt-2 text-2xl font-bold text-amber-600">4 cases</div>
            <p className="text-[11px] text-amber-600">Dispatched to regional supervisor</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs font-medium text-muted-foreground">Active Triage Load</span>
            <div className="mt-2 text-2xl font-bold">223 items</div>
            <p className="text-[11px] text-muted-foreground">Across 14 officer queues</p>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs">
          <CardContent className="p-4">
            <span className="text-xs font-medium text-muted-foreground">Average Resolution Speed</span>
            <div className="mt-2 text-2xl font-bold text-primary">16.8 hrs</div>
            <p className="text-[11px] text-teal-600">Statutory limit: 48.0 hrs</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Jurisdictional Queue Health Status</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {queues.map((q) => (
            <Card key={q.name} className="border-border/80 shadow-xs">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">{q.name}</CardTitle>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${
                      q.health === "Optimal"
                        ? "border-teal-400 bg-teal-500/10 text-teal-700 dark:text-teal-300"
                        : q.health === "Normal"
                        ? "border-blue-400 bg-blue-500/10 text-blue-700 dark:text-blue-300"
                        : "border-amber-400 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                    }`}
                  >
                    {q.health}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-1 space-y-2 text-xs">
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Pending in Queue:</span>
                  <span className="font-semibold text-foreground">{q.count} cases</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-muted-foreground">Median Resolution Time:</span>
                  <span className="font-medium text-foreground">{q.medianTime}</span>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-muted-foreground">SLA Breach Count:</span>
                  <span className={`font-semibold ${q.slaBreaches > 0 ? "text-amber-600" : "text-teal-600"}`}>
                    {q.slaBreaches} breaches
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
