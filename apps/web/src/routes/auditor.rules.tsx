import { createFileRoute } from "@tanstack/react-router";
import { Scale, CheckCircle2, GitBranch, History } from "lucide-react";
import { PageHeader } from "@/components/gov/ui";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/auditor/rules")({
  head: () => ({
    meta: [
      { title: "Eligibility Rules & Policy Audit — Auditor" },
      {
        name: "description",
        content:
          "Forensic audit of eligibility criteria, rule engines, and version histories.",
      },
    ],
  }),
  component: AuditorRulesPage,
});

function AuditorRulesPage() {
  const rules = [
    {
      scheme: "Rural Housing Assistance Scheme",
      ruleId: "RUL-RHA-01",
      name: "Income Threshold Ceiling",
      criteria: "Annual Household Income <= ₹ 1,80,000",
      version: "v3.2.0 (Active since 2025-04-01)",
      auditStatus: "Statutory Gazetted",
    },
    {
      scheme: "Rural Housing Assistance Scheme",
      ruleId: "RUL-RHA-02",
      name: "Dwelling Condition Qualification",
      criteria:
        "Dwelling type must be Kutcha or Semi-Kutcha with no prior sanction in 5 fiscal years",
      version: "v2.1.0 (Active since 2024-01-15)",
      auditStatus: "Statutory Gazetted",
    },
    {
      scheme: "Old Age Pension Scheme",
      ruleId: "RUL-OAP-01",
      name: "Senior Citizen Age Gate",
      criteria: "Age >= 60 years authenticated via UIDAI Aadhaar Vault",
      version: "v1.0.0",
      auditStatus: "Statutory Gazetted",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Eligibility Rules & Policy Logic Audit"
        desc="Audit trail of statutory rules, legislative gazette references, and version change-logs."
        crumbs={[
          { label: "Auditor", to: "/auditor/dashboard" },
          { label: "Rules Audit" },
        ]}
      />

      <div className="space-y-4">
        {rules.map((r) => (
          <Card key={r.ruleId} className="border-border/80 shadow-xs">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground text-sm">
                    {r.name}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] border-teal-500/30 text-teal-700 bg-teal-500/10"
                  >
                    {r.auditStatus}
                  </Badge>
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {r.ruleId}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-1 text-xs space-y-2">
              <p className="text-muted-foreground">
                Scheme: <strong className="text-foreground">{r.scheme}</strong>
              </p>
              <div className="rounded border bg-muted/30 p-2.5 font-mono text-[11px] text-foreground">
                {r.criteria}
              </div>
              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                <span>Version: {r.version}</span>
                <span className="flex items-center text-teal-600 font-medium">
                  <CheckCircle2 className="mr-1 h-3 w-3" /> No Rule Tampering
                  Detected
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
