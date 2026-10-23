import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Scale, ShieldCheck, CheckCircle2, Lock, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-state";
import { PageHeader } from "@/components/gov/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auditor/decisions")({
  head: () => ({
    meta: [
      { title: "Hashed Decisions & Entitlement Determinations — Auditor" },
      { name: "description", content: "Cryptographically verified determinations, public certificates, and SHA-256 seal registry." },
    ],
  }),
  component: AuditorDecisionsPage,
});

function AuditorDecisionsPage() {
  const { state } = useApp();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const decisions = state.decisions || [];

  const handleCopyHash = (hash: string, id: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(id);
    toast.success("Cryptographic SHA-256 hash copied to clipboard.");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cryptographic Decision Registry"
        desc="Permanent audit ledger of approved and rejected public benefit determinations with immutable SHA-256 state hashes."
        crumbs={[{ label: "Auditor", to: "/auditor/dashboard" }, { label: "Decisions" }]}
      />

      <div className="space-y-4">
        {decisions.map((dec) => (
          <Card key={dec.id} className="border-border/80 shadow-xs">
            <CardHeader className="p-5 pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-primary" />
                  <span className="font-mono text-xs font-bold text-foreground">{dec.id}</span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${
                      dec.decision === "APPROVED"
                        ? "border-teal-400 bg-teal-500/10 text-teal-700 dark:text-teal-300"
                        : "border-red-400 bg-red-500/10 text-red-700 dark:text-red-300"
                    }`}
                  >
                    {dec.decision}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground font-mono">Date: {dec.decidedAt}</div>
              </div>
            </CardHeader>

            <CardContent className="p-5 pt-1 space-y-3 text-xs">
              <div className="grid gap-3 sm:grid-cols-2 rounded-lg bg-muted/30 p-3">
                <div>
                  <span className="text-muted-foreground text-[11px]">Application:</span>
                  <div className="font-semibold text-foreground">{dec.applicationId} · {dec.schemeName}</div>
                </div>
                <div>
                  <span className="text-muted-foreground text-[11px]">Beneficiary / Applicant:</span>
                  <div className="font-semibold text-foreground">{dec.applicantName}</div>
                </div>
              </div>

              <div>
                <span className="font-medium text-foreground">Statutory Determination Rationale:</span>
                <p className="mt-1 text-muted-foreground leading-relaxed italic bg-background p-2.5 rounded border border-border/60">
                  "{dec.justification}"
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
                <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-teal-600 shrink-0" />
                  <span className="truncate max-w-xs sm:max-w-md">SHA256: {dec.auditHash}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => handleCopyHash(dec.auditHash, dec.id)}
                  >
                    {copiedId === dec.id ? <Check className="h-3 w-3 text-teal-600" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </div>

                <div className="text-right text-[11px] text-muted-foreground">
                  Affixed by: <strong className="text-foreground">{dec.decidedBy}</strong> ({dec.statutoryRuleRef})
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
