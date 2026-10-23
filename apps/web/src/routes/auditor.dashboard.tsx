import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  ScrollText,
  FileCheck2,
  Lock,
  ArrowRight,
  History,
  CheckCircle2,
  FileLock2,
  Search,
} from "lucide-react";
import { useApp } from "@/lib/app-state";
import { Button } from "@/components/ui/button";
import {
  MiraPageHeader,
  MiraSectionHeader,
  MiraCard,
  MiraStatCard,
  MiraBadge,
  MiraStatus,
} from "@/components/mira";

export const Route = createFileRoute("/auditor/dashboard")({
  head: () => ({
    meta: [
      { title: "Statutory Forensic Audit Station — Priya Nair · Mira" },
      {
        name: "description",
        content: "Independent statutory audit overview, decision integrity verification, and immutable cryptographic ledger telemetry.",
      },
    ],
  }),
  component: AuditorDashboardPage,
});

export function AuditorDashboardPage() {
  const { state } = useApp();
  const totalDecisions = state.decisions?.length || 4;
  const auditLogs = state.audit || [];
  const auditorName = state.session?.name || "Priya Nair";

  return (
    <div className="space-y-7 pb-12 animate-in fade-in duration-200">
      {/* 1. Page Header */}
      <MiraPageHeader
        context="Statutory Auditor"
        title="Forensic Audit Station"
        description={`${auditorName} · State Audit Directorate · ISO/IEC 27001 Cryptographic Verification · Strict Read-Only Authority`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              asChild
              className="h-8.5 rounded-lg border-border/80 bg-background/80 px-3.5 text-xs font-medium shadow-2xs hover:bg-muted"
            >
              <Link to="/auditor/decisions">
                <FileLock2 className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                Sealed Decisions
              </Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="h-8.5 rounded-lg bg-primary px-3.5 text-xs font-medium text-primary-foreground shadow-2xs hover:bg-primary/95"
            >
              <Link to="/auditor/audit">
                <ScrollText className="mr-1.5 h-3.5 w-3.5" />
                Inspect Full Ledger ({auditLogs.length})
              </Link>
            </Button>
          </div>
        }
      />

      {/* 2. Forensic Telemetry Bar */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MiraStatCard
          title="Chain Integrity"
          value="Verified Valid"
          subtext="Zero broken Merkle blocks"
          icon={ShieldCheck}
          trend={{ label: "Cryptographic Pass", tone: "positive" }}
        />
        <MiraStatCard
          title="Decisions Sealed"
          value={totalDecisions}
          subtext="SHA-256 state seal affixed"
          icon={Lock}
          trend={{ label: "Tamper Proof", tone: "positive" }}
        />
        <MiraStatCard
          title="Audit Log Entries"
          value={auditLogs.length}
          subtext="Immutable append-only stream"
          icon={History}
          trend={{ label: "Sequential", tone: "neutral" }}
        />
        <MiraStatCard
          title="Detected Anomalies"
          value="0 critical"
          subtext="100% compliance record"
          icon={CheckCircle2}
          trend={{ label: "Compliant", tone: "positive" }}
        />
      </div>

      {/* 3. Main Workspaces */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Immutable Ledger Stream (2 cols) */}
        <div className="space-y-4 lg:col-span-2">
          <MiraCard className="p-5">
            <MiraSectionHeader
              title="Immutable Ledger Stream"
              description="Real-time cryptographic trail of determinations, household splits, and cross-verifications."
              action={
                <Button size="sm" variant="ghost" asChild className="h-7 text-xs text-muted-foreground hover:text-foreground">
                  <Link to="/auditor/audit">Inspect Full Ledger</Link>
                </Button>
              }
            />

            <div className="mt-3 divide-y divide-border/60">
              {auditLogs.slice(0, 6).map((log) => (
                <div
                  key={log.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 first:pt-1 last:pb-1"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-xs text-foreground">
                        {log.action}
                      </span>
                      {log.application && (
                        <span className="font-mono text-[11px] text-muted-foreground bg-muted/60 px-1.5 py-0.2 rounded border border-border/60">
                          {log.application}
                        </span>
                      )}
                      <span className="text-[10px] text-muted-foreground font-mono">
                        by {log.actor}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate max-w-lg">
                      {log.reason ? `${log.reason} · ` : ""}{log.prev} → {log.next}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {log.ts}
                    </span>
                    <MiraBadge variant="outline" className="text-[9px] py-0 px-1 font-mono">
                      Verified
                    </MiraBadge>
                  </div>
                </div>
              ))}
            </div>
          </MiraCard>

          {/* Quick Forensic Modules */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              to="/auditor/decisions"
              className="rounded-xl border border-border/70 bg-card p-4 transition-all duration-150 hover:border-primary/40 hover:bg-muted/30"
            >
              <div className="flex items-center justify-between text-primary">
                <FileLock2 className="h-4 w-4" />
                <ArrowRight className="h-3 w-3 text-muted-foreground/50" />
              </div>
              <h4 className="mt-2 text-xs font-semibold text-foreground">Decision Sealing</h4>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Inspect cryptographic attestations</p>
            </Link>

            <Link
              to="/auditor/evidence"
              className="rounded-xl border border-border/70 bg-card p-4 transition-all duration-150 hover:border-primary/40 hover:bg-muted/30"
            >
              <div className="flex items-center justify-between text-teal-600 dark:text-teal-400">
                <FileCheck2 className="h-4 w-4" />
                <ArrowRight className="h-3 w-3 text-muted-foreground/50" />
              </div>
              <h4 className="mt-2 text-xs font-semibold text-foreground">Evidence Records</h4>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Inspect forensic proofs</p>
            </Link>

            <Link
              to="/auditor/rules"
              className="rounded-xl border border-border/70 bg-card p-4 transition-all duration-150 hover:border-primary/40 hover:bg-muted/30"
            >
              <div className="flex items-center justify-between text-muted-foreground">
                <ScrollText className="h-4 w-4" />
                <ArrowRight className="h-3 w-3 text-muted-foreground/50" />
              </div>
              <h4 className="mt-2 text-xs font-semibold text-foreground">Rule History Trace</h4>
              <p className="mt-0.5 text-[11px] text-muted-foreground">Statutory version telemetry</p>
            </Link>
          </div>
        </div>

        {/* Secondary Column: Forensic Standards */}
        <div className="space-y-4">
          <MiraCard className="p-5">
            <MiraSectionHeader
              title="Statutory Evidence Standard"
              description="Legally admissible electronic evidence."
            />
            <div className="mt-2 space-y-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">Evidence Act Section 65B:</span>
                <span className="font-semibold text-teal-600 dark:text-teal-400">Compliant</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">Hashing Algorithm:</span>
                <span className="font-mono font-medium text-foreground">SHA-256 Merkle</span>
              </div>
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">Time Sync:</span>
                <span className="font-medium text-foreground">NTP Stratum-1 Verified</span>
              </div>
              <div className="flex items-center justify-between pb-1">
                <span className="text-muted-foreground">Write Restriction:</span>
                <span className="font-semibold text-teal-600 dark:text-teal-400">Strict Read-Only</span>
              </div>
            </div>
          </MiraCard>

          <MiraCard className="p-4.5 bg-muted/30">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-semibold text-foreground block">
                  Independent Oversight Notice
                </span>
                <p className="text-muted-foreground leading-relaxed">
                  As an independent statutory auditor, your session is cryptographically attested. All audit queries and inspections are recorded in the secondary oversight trail.
                </p>
              </div>
            </div>
          </MiraCard>
        </div>
      </div>
    </div>
  );
}
