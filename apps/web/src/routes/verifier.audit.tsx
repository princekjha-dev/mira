import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/app-state";
import { PageHeader } from "@/components/gov/ui";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollText, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/verifier/audit")({
  head: () => ({
    meta: [
      { title: "Audit Ledger — Verifier Workstation" },
      { name: "description", content: "Cryptographic activity ledger for verification officer determinations." },
    ],
  }),
  component: VerifierAuditPage,
});

function VerifierAuditPage() {
  const { state } = useApp();
  const logs = state.audit || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Verification Audit Ledger"
        desc="Immutable event stream of determinations, status updates, evidence submissions, and overrides."
        crumbs={[{ label: "Verifier", to: "/verifier/dashboard" }, { label: "Audit" }]}
      />

      <Card className="border-border/80 shadow-xs">
        <CardContent className="p-0">
          <div className="divide-y divide-border text-xs">
            {logs.map((log) => (
              <div key={log.id} className="p-4 flex flex-col gap-1 hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-foreground">{log.action}</span>
                    {log.application && (
                      <span className="font-mono text-[11px] text-primary">{log.application}</span>
                    )}
                  </div>
                  <span className="font-mono text-[11px] text-muted-foreground">{log.ts}</span>
                </div>
                <div className="text-muted-foreground">
                  Actor: <span className="text-foreground">{log.actor}</span>
                  {log.prev && log.next && (
                    <span> · State: {log.prev} → <strong className="text-foreground">{log.next}</strong></span>
                  )}
                </div>
                {log.reason && (
                  <p className="mt-1 text-[11px] italic text-muted-foreground bg-muted/40 p-2 rounded">
                    "{log.reason}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
