import { createFileRoute } from "@tanstack/react-router";
import {
  Users2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { PageHeader } from "@/components/gov/ui";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/auditor/officers")({
  head: () => ({
    meta: [
      { title: "Officer Activity & Integrity Oversight — Auditor" },
      {
        name: "description",
        content:
          "Statutory oversight on officer determinations, override statistics, and SLA fidelity.",
      },
    ],
  }),
  component: AuditorOfficersPage,
});

function AuditorOfficersPage() {
  const officers = [
    {
      name: "Neha Verma",
      role: "Verification Officer (Tier 2)",
      district: "Lucknow & Chandauli Jurisdiction",
      totalVerified: 184,
      overrideRate: "1.6%",
      avgSlaHours: "14.2h",
      anomalies: 0,
      status: "Exemplary Compliance",
    },
    {
      name: "Ravi Kumar",
      role: "Field Operational Officer",
      district: "Chandauli Rural Cluster",
      totalVerified: 216,
      overrideRate: "0.9%",
      avgSlaHours: "18.5h",
      anomalies: 0,
      status: "Exemplary Compliance",
    },
    {
      name: "Arjun Mehta",
      role: "Department Administrator / Director",
      district: "State Headquarters",
      totalVerified: 48,
      overrideRate: "2.1%",
      avgSlaHours: "6.0h",
      anomalies: 0,
      status: "Exemplary Compliance",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Officer Integrity & Determination Oversight"
        desc="Objective forensic evaluation of officer determination patterns, data override frequencies, and adherence to public service canons."
        crumbs={[
          { label: "Auditor", to: "/auditor/dashboard" },
          { label: "Officer Oversight" },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-3">
        {officers.map((o) => (
          <Card key={o.name} className="border-border/80 shadow-xs">
            <CardHeader className="p-4 pb-2">
              <Badge
                variant="outline"
                className="mb-1 text-[10px] border-teal-500/30 text-teal-700 bg-teal-500/10 w-fit"
              >
                <ShieldCheck className="mr-1 h-3 w-3" /> {o.status}
              </Badge>
              <CardTitle className="text-base font-semibold">
                {o.name}
              </CardTitle>
              <CardDescription className="text-xs">
                {o.role} · {o.district}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-2 text-xs space-y-2">
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-muted-foreground">Cases Resolved:</span>
                <span className="font-semibold text-foreground">
                  {o.totalVerified}
                </span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-muted-foreground">
                  Registry Override Rate:
                </span>
                <span className="font-medium text-foreground">
                  {o.overrideRate}
                </span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-muted-foreground">Mean Turnaround:</span>
                <span className="font-medium text-foreground">
                  {o.avgSlaHours}
                </span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-muted-foreground">Integrity Flags:</span>
                <span className="text-teal-600 font-semibold">
                  {o.anomalies} flags
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
