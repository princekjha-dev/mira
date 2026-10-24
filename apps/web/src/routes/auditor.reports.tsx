import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, FileDown, ShieldCheck, Calendar } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/gov/ui";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auditor/reports")({
  head: () => ({
    meta: [
      { title: "Statutory Audit Reports — Auditor" },
      {
        name: "description",
        content:
          "CAG and statutory compliance reports, leak prevention estimates, and duplicate resolution audits.",
      },
    ],
  }),
  component: AuditorReportsPage,
});

function AuditorReportsPage() {
  const reports = [
    {
      title: "Quarterly Public Welfare Leak Prevention Audit (Q3 FY26)",
      period: "July 2026 – September 2026",
      summary:
        "Evaluated 12,410 applications. Duplicate detection across household splits prevented estimated ₹ 4.2 Cr in erroneous duplicate disbursements.",
      code: "CAG-REP-2026-Q3",
    },
    {
      title: "Cross-Registry Data Discrepancy & Override Analysis",
      period: "Fiscal Year 2025-26",
      summary:
        "Review of human verifier overrides on Tehsildar income certificates. Found 98.4% of overrides accompanied by valid secondary documentation.",
      code: "AUD-OVR-2026-01",
    },
    {
      title: "Field Geotag Accuracy & NavIC Satellite Lock Audit",
      period: "August 2026 – October 2026",
      summary:
        "99.1% of field inspection photographs possessed cryptographic GPS stamps within 3 meters of registered land revenue coordinates.",
      code: "TEC-GEO-2026-08",
    },
  ];

  const handleDownload = (code: string) => {
    toast.success(
      `Statutory Audit Report ${code} exported as cryptographically signed PDF.`,
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Statutory Forensic Audit Reports"
        desc="Formal audit reports submitted to the Comptroller and Auditor General (CAG) and Ministry of Social Justice."
        crumbs={[
          { label: "Auditor", to: "/auditor/dashboard" },
          { label: "Reports" },
        ]}
      />

      <div className="space-y-4">
        {reports.map((rep) => (
          <Card key={rep.code} className="border-border/80 shadow-xs">
            <CardHeader className="p-5 pb-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-base font-semibold">
                  {rep.title}
                </CardTitle>
                <span className="font-mono text-xs text-muted-foreground">
                  {rep.code}
                </span>
              </div>
              <CardDescription className="flex items-center gap-1.5 pt-1 text-xs">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{rep.period}</span>
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-1 space-y-3 text-xs">
              <p className="text-muted-foreground leading-relaxed">
                {rep.summary}
              </p>
              <div className="flex justify-end pt-2 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(rep.code)}
                  className="h-8 text-xs"
                >
                  <FileDown className="mr-1.5 h-3.5 w-3.5 text-primary" />
                  Download Signed Report
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
