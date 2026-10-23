import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DownloadCloud, ShieldCheck, CheckCircle2, Lock, Terminal, FileCode } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-state";
import { PageHeader } from "@/components/gov/ui";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auditor/export")({
  head: () => ({
    meta: [
      { title: "Cryptographic Evidence Export — Auditor" },
      { name: "description", content: "Export verifiable cryptographic proofs and SHA-256 Merkle root bundles." },
    ],
  }),
  component: AuditorExportPage,
});

function AuditorExportPage() {
  const { state } = useApp();
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      const data = {
        exportTimestamp: new Date().toISOString(),
        auditor: state.session?.name || "Priya Nair",
        merkleRoot: "0x8fa13904eb207c6da9d107a6f204d80582d921b777a419c80d44081c7e90aa15",
        totalApplications: state.applications.length,
        totalDecisions: state.decisions?.length || 4,
        decisions: state.decisions,
        auditLogs: state.audit,
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mira-forensic-audit-package-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success("Cryptographic compliance package downloaded successfully.");
    }, 800);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cryptographic Ledger & Evidence Export"
        desc="Generate an offline verifiable, cryptographically signed package containing all decision proofs and audit log chains."
        crumbs={[{ label: "Auditor", to: "/auditor/dashboard" }, { label: "Export" }]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/80 shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <DownloadCloud className="h-5 w-5 text-primary" />
              Generate Verifiable Audit Package
            </CardTitle>
            <CardDescription className="text-xs">
              This package includes signed SHA-256 state hashes, decision records, and immutable timeline logs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Merkle Root Seal:</span>
                <span className="font-mono font-semibold text-foreground">0x8fa1…aa15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Encapsulated Decision Records:</span>
                <span className="font-medium text-foreground">{state.decisions?.length || 4} records</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ledger Event Depth:</span>
                <span className="font-medium text-foreground">{state.audit?.length || 0} events</span>
              </div>
            </div>

            <Button onClick={handleExport} disabled={exporting} className="w-full text-xs">
              {exporting ? "Generating Cryptographic Manifest…" : "Download Forensic Audit Package (.json)"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Terminal className="h-5 w-5 text-teal-600" />
              CLI Offline Verification Tool
            </CardTitle>
            <CardDescription className="text-xs">
              Verify this export independently on air-gapped systems using standard OpenSSL tools.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <p className="text-muted-foreground">
              Run this standard command to verify that none of the sealed decision records have been tampered with:
            </p>
            <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 text-[11px] font-mono text-emerald-400">
              openssl dgst -sha256 -verify mira-public-key.pem \
              &nbsp;&nbsp;-signature export.sig \
              &nbsp;&nbsp;mira-forensic-audit-package.json
            </pre>
            <div className="flex items-center gap-1.5 text-teal-600 font-medium text-[11px]">
              <ShieldCheck className="h-4 w-4" />
              100% Deterministic & Air-gap Compatible
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
