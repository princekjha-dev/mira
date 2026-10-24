import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ListChecks,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ArrowRight,
  FileCheck2,
  CheckCircle2,
  UserCheck,
  ExternalLink,
  Search,
} from "lucide-react";
import { useApp } from "@/lib/app-state";
import { getScheme, fmtDate } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  MiraPageHeader,
  MiraSectionHeader,
  MiraCard,
  MiraStatCard,
  MiraStatus,
  MiraBadge,
  MiraEmptyState,
} from "@/components/mira";

export const Route = createFileRoute("/verifier/dashboard")({
  head: () => ({
    meta: [
      { title: "Verification Workstation — Vikram Malhotra · Mira" },
      {
        name: "description",
        content:
          "High-density verification operations console, mismatch resolution, and determination queue.",
      },
    ],
  }),
  component: VerifierDashboardPage,
});

export function VerifierDashboardPage() {
  const { state } = useApp();
  const queueApps = state.applications.filter(
    (a) =>
      a.status === "Documents Under Review" ||
      a.status === "Verification Required" ||
      a.status === "Officer Review" ||
      a.status === "Additional Evidence Required",
  );
  const mismatches = state.applications.filter((a) => a.mismatch);
  const verifierName = state.session?.name || "Vikram Malhotra";

  return (
    <div className="space-y-7 pb-12 animate-in fade-in duration-200">
      {/* 1. Header (Apple-restrained hierarchy, Section 31 specs) */}
      <MiraPageHeader
        context="Verification Officer"
        title="Verification"
        description={`${verifierName} · Direct Jurisdictional Operations (Chandauli & Lucknow Sector) · Cryptographic Audit Ledger`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              asChild
              className="h-8.5 rounded-lg border-border/80 bg-background/80 px-3.5 text-xs font-medium shadow-2xs hover:bg-muted"
            >
              <Link to="/verifier/evidence">
                <Search className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                Evidence Explorer
              </Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="h-8.5 rounded-lg bg-primary px-3.5 text-xs font-medium text-primary-foreground shadow-2xs hover:bg-primary/95"
            >
              <Link to="/verifier/queue">
                <ListChecks className="mr-1.5 h-3.5 w-3.5" />
                Active Queue ({queueApps.length})
              </Link>
            </Button>
          </div>
        }
      />

      {/* 2. Workstation Metrics (Section 31: pending reviews, active mismatches, SLA, completed) */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MiraStatCard
          title="Pending Reviews"
          value={queueApps.length}
          subtext="Assigned for cross-verification"
          icon={ListChecks}
          trend={{ label: "Active Queue", tone: "neutral" }}
        />
        <MiraStatCard
          title="Active Mismatches"
          value={mismatches.length}
          subtext="Registry discrepancies found"
          icon={AlertTriangle}
          trend={{
            label: "Requires Action",
            tone: mismatches.length > 0 ? "warning" : "positive",
          }}
        />
        <MiraStatCard
          title="Mean Turnaround (SLA)"
          value="14.2h"
          subtext="Within 48h statutory deadline"
          icon={Clock}
          trend={{ label: "98.4% On-time", tone: "positive" }}
        />
        <MiraStatCard
          title="Completed Verification"
          value="184"
          subtext="This month · 100% audited"
          icon={ShieldCheck}
          trend={{ label: "Chain Sealed", tone: "positive" }}
        />
      </div>

      {/* 3. Main Workspace & Secondary Context */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Priority Applications Table / Queue (2 columns) */}
        <div className="space-y-4 lg:col-span-2">
          <MiraCard className="p-5">
            <MiraSectionHeader
              title="Priority Applications"
              description="Awaiting primary document cross-check and field correlation."
              action={
                <Button
                  size="sm"
                  variant="ghost"
                  asChild
                  className="h-7 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Link to="/verifier/queue">
                    Open Full Queue ({queueApps.length})
                  </Link>
                </Button>
              }
            />

            {queueApps.length === 0 ? (
              <MiraEmptyState
                icon={CheckCircle2}
                title="Queue is all clear"
                description="All assigned verification cases have been determined or routed for decision."
              />
            ) : (
              <div className="mt-3 divide-y divide-border/60">
                {queueApps.slice(0, 5).map((app) => (
                  <div
                    key={app.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 first:pt-1 last:pb-1"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-semibold text-primary">
                          {app.id}
                        </span>
                        <MiraStatus status={app.status} />
                        {app.duplicate && (
                          <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-400 border border-amber-500/20">
                            Duplicate Alert
                          </span>
                        )}
                        {app.mismatch && (
                          <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold text-destructive border border-destructive/20">
                            Data Mismatch
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                        <span>{app.applicant}</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="font-mono text-muted-foreground">
                          {app.householdId}
                        </span>
                      </div>

                      <p className="text-[11px] text-muted-foreground">
                        {getScheme(app.schemeId)?.name ||
                          "Welfare Assistance Scheme"}{" "}
                        · Updated {fmtDate(app.updatedOn)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="h-7.5 text-xs font-medium rounded-lg"
                      >
                        <Link
                          to="/verifier/applications/$id"
                          params={{ id: app.id }}
                        >
                          Inspect Case
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </MiraCard>

          {/* Connected Workflows quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              to="/verifier/mismatches"
              className="rounded-xl border border-border/70 bg-card p-4 transition-all duration-150 hover:border-primary/40 hover:bg-muted/30"
            >
              <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4" />
                <ArrowRight className="h-3 w-3 text-muted-foreground/50" />
              </div>
              <h4 className="mt-2 text-xs font-semibold text-foreground">
                Mismatch Resolution
              </h4>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Resolve discrepancy claims
              </p>
            </Link>

            <Link
              to="/verifier/evidence"
              className="rounded-xl border border-border/70 bg-card p-4 transition-all duration-150 hover:border-primary/40 hover:bg-muted/30"
            >
              <div className="flex items-center justify-between text-primary">
                <FileCheck2 className="h-4 w-4" />
                <ArrowRight className="h-3 w-3 text-muted-foreground/50" />
              </div>
              <h4 className="mt-2 text-xs font-semibold text-foreground">
                Document OCR Vault
              </h4>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Inspect cryptographic attestations
              </p>
            </Link>

            <Link
              to="/verifier/audit"
              className="rounded-xl border border-border/70 bg-card p-4 transition-all duration-150 hover:border-primary/40 hover:bg-muted/30"
            >
              <div className="flex items-center justify-between text-teal-600 dark:text-teal-400">
                <ShieldCheck className="h-4 w-4" />
                <ArrowRight className="h-3 w-3 text-muted-foreground/50" />
              </div>
              <h4 className="mt-2 text-xs font-semibold text-foreground">
                Audit Trail
              </h4>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Officer determination ledger
              </p>
            </Link>
          </div>
        </div>

        {/* Secondary Column: Active Registries & Guidance */}
        <div className="space-y-4">
          <MiraCard className="p-5">
            <MiraSectionHeader
              title="Active Cross-Check Registries"
              description="Statutory live verification sync."
            />
            <div className="mt-2 space-y-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">
                  UIDAI Aadhaar Vault:
                </span>
                <span className="flex items-center text-teal-600 dark:text-teal-400 font-medium">
                  <CheckCircle2 className="mr-1 h-3 w-3" /> Connected
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">
                  State Land Records (Bhulekh):
                </span>
                <span className="flex items-center text-teal-600 dark:text-teal-400 font-medium">
                  <CheckCircle2 className="mr-1 h-3 w-3" /> Live Sync
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">
                  Revenue Dept (Income Registry):
                </span>
                <span className="flex items-center text-teal-600 dark:text-teal-400 font-medium">
                  <CheckCircle2 className="mr-1 h-3 w-3" /> Live Sync
                </span>
              </div>
              <div className="flex items-center justify-between pb-1">
                <span className="text-muted-foreground">
                  Public Distribution (NFSA):
                </span>
                <span className="flex items-center text-teal-600 dark:text-teal-400 font-medium">
                  <CheckCircle2 className="mr-1 h-3 w-3" /> Live Sync
                </span>
              </div>
            </div>
          </MiraCard>

          <MiraCard className="p-4.5 bg-muted/30">
            <div className="flex items-start gap-2.5">
              <UserCheck className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-semibold text-foreground block">
                  Verifier Statutory Guidance
                </span>
                <p className="text-muted-foreground leading-relaxed">
                  Section 14(2) of Public Verification Act requires all adverse
                  determinations to record a reasoned note citing the exact
                  registry discrepancy. No application may be rejected without
                  at least one citizen opportunity to furnish clarifying
                  evidence.
                </p>
              </div>
            </div>
          </MiraCard>
        </div>
      </div>
    </div>
  );
}
