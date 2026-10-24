import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Clock3,
  Scale,
  Waves,
  FlaskConical,
  Building2,
  FileCheck2,
  ShieldCheck,
  AlertTriangle,
  History,
  Layers,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/lib/app-state";
import { SCHEMES } from "@/lib/data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  MiraPageHeader,
  MiraSectionHeader,
  MiraCard,
  MiraStatCard,
  MiraBadge,
  MiraStatus,
} from "@/components/mira";

export const Route = createFileRoute("/department/dashboard")({
  head: () => ({
    meta: [
      { title: "System & Department Administration · Mira" },
      {
        name: "description",
        content:
          "Scheme administration, rule versions, department configurations, and system-wide audit telemetry.",
      },
    ],
  }),
  component: DepartmentDashboardPage,
});

const FUTURE_CAPABILITIES = [
  {
    icon: Clock3,
    name: "Entitlement Time Machine",
    text: "Reconstruct what a household was entitled to on any past date, using the rule version in force at that specific historical timestamp.",
  },
  {
    icon: Scale,
    name: "Fair Decision Guardian",
    text: "Review officer determinations for parity and demographic consistency across similar cases, flagging statistical outliers.",
  },
  {
    icon: Waves,
    name: "Decision Ripple Engine",
    text: "Model downstream cross-scheme impacts when a central family record mutates (e.g. household split, birth, or civil death record).",
  },
  {
    icon: FlaskConical,
    name: "Policy Crash-Test Lab",
    text: "Simulate proposed legislative rule changes against millions of anonymized records before gazetting a new statutory version.",
  },
];

export function DepartmentDashboardPage() {
  const { state } = useApp();
  const [selectedSim, setSelectedSim] = useState<
    (typeof FUTURE_CAPABILITIES)[number] | null
  >(null);

  const activeSchemesCount = SCHEMES.length;
  const ruleVersionsCount = state.ruleVersions?.length || 8;
  const openAlertsCount =
    state.alerts?.filter((a) => a.status === "Open").length || 3;
  const auditEventsCount = state.audit?.length || 24;
  const adminName = state.session?.name || "Arjun Mehta";

  return (
    <div className="space-y-7 pb-12 animate-in fade-in duration-200">
      {/* 1. Page Header */}
      <MiraPageHeader
        context="System Authority"
        title="Administration"
        description={`${adminName} · Department of Welfare Services & Entitlements · Statutory Schema Authority`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              asChild
              className="h-8.5 rounded-lg border-border/80 bg-background/80 px-3.5 text-xs font-medium shadow-2xs hover:bg-muted"
            >
              <Link to="/department/rules">
                <Layers className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                Rule Engine
              </Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="h-8.5 rounded-lg bg-primary px-3.5 text-xs font-medium text-primary-foreground shadow-2xs hover:bg-primary/95"
            >
              <Link to="/department/schemes">
                <FileCheck2 className="mr-1.5 h-3.5 w-3.5" />
                Manage Schemes ({activeSchemesCount})
              </Link>
            </Button>
          </div>
        }
      />

      {/* 2. Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MiraStatCard
          title="Active Schemes"
          value={activeSchemesCount}
          subtext="Centrally administered"
          icon={Building2}
          trend={{ label: "Operational", tone: "positive" }}
        />
        <MiraStatCard
          title="Rule Versions"
          value={ruleVersionsCount}
          subtext="Versioned logic trees"
          icon={Layers}
          trend={{ label: "Immutable", tone: "positive" }}
        />
        <MiraStatCard
          title="Open Anomaly Alerts"
          value={openAlertsCount}
          subtext="Duplicate or criteria signals"
          icon={AlertTriangle}
          trend={{
            label: openAlertsCount > 0 ? "Under Review" : "Clear",
            tone: openAlertsCount > 0 ? "warning" : "positive",
          }}
        />
        <MiraStatCard
          title="System Audit Events"
          value={auditEventsCount}
          subtext="Cryptographic trail"
          icon={History}
          trend={{ label: "Live Telemetry", tone: "neutral" }}
        />
      </div>

      {/* 3. Main Workspaces */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Latest Rule Changes (2 cols) */}
        <div className="space-y-4 lg:col-span-2">
          <MiraCard className="p-5">
            <MiraSectionHeader
              title="Recent Rule Engine Updates"
              description="Chronological log of versioned eligibility criteria and effective statutory dates."
              action={
                <Button
                  size="sm"
                  variant="ghost"
                  asChild
                  className="h-7 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Link to="/department/rules">View all versions</Link>
                </Button>
              }
            />

            <div className="mt-3 divide-y divide-border/60">
              {[...state.ruleVersions]
                .reverse()
                .slice(0, 5)
                .map((rule) => {
                  const scheme = SCHEMES.find((s) => s.id === rule.schemeId);
                  return (
                    <div
                      key={rule.version + rule.schemeId}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 first:pt-1 last:pb-1"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/20">
                            {rule.version}
                          </span>
                          <span className="text-xs font-medium text-foreground truncate">
                            {scheme?.name || "Global Rule Group"}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          {rule.reason} · Effective from {rule.effective}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <MiraStatus status="Active" />
                      </div>
                    </div>
                  );
                })}
            </div>
          </MiraCard>

          {/* Planned Advanced Analytics & Simulation Engine */}
          <MiraCard className="p-5">
            <MiraSectionHeader
              title="Statutory Simulation Engines"
              description="Policy experimentation, decision parity, and temporal entitlement reconstruction."
            />
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {FUTURE_CAPABILITIES.map((cap) => (
                <button
                  key={cap.name}
                  onClick={() => setSelectedSim(cap)}
                  className="group flex gap-3 rounded-xl border border-border/70 bg-card p-3.5 text-left transition-all duration-150 hover:border-primary/40 hover:bg-muted/30"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-foreground group-hover:text-primary transition-colors">
                    <cap.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-foreground tracking-tight">
                        {cap.name}
                      </span>
                      <MiraBadge
                        variant="outline"
                        className="text-[9px] py-0 px-1 font-mono"
                      >
                        Statutory Lab
                      </MiraBadge>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {cap.text}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </MiraCard>
        </div>

        {/* Secondary Context Column */}
        <div className="space-y-4">
          <MiraCard className="p-5">
            <MiraSectionHeader
              title="System Health & Connectivity"
              description="Enterprise backend services status."
            />
            <div className="mt-2 space-y-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">
                  PostgreSQL 18 Engine:
                </span>
                <span className="font-semibold text-teal-600 dark:text-teal-400">
                  Online · Port 5433
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">
                  Rust Microservices (Axum):
                </span>
                <span className="font-semibold text-teal-600 dark:text-teal-400">
                  Healthy · Port 4000
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-muted-foreground">
                  Deterministic Seeding:
                </span>
                <span className="font-semibold text-teal-600 dark:text-teal-400">
                  V4 Active
                </span>
              </div>
              <div className="flex items-center justify-between pb-1">
                <span className="text-muted-foreground">
                  Cross-Scheme Duplicate Index:
                </span>
                <span className="font-semibold text-teal-600 dark:text-teal-400">
                  Synched
                </span>
              </div>
            </div>
          </MiraCard>

          <MiraCard className="p-4.5 bg-muted/30">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="font-semibold text-foreground block">
                  Statutory Rule Governance
                </span>
                <p className="text-muted-foreground leading-relaxed">
                  Modifications to active scheme thresholds require
                  cryptographic co-signatures and automatic version increments
                  to guarantee retrospective determinations remain auditable.
                </p>
              </div>
            </div>
          </MiraCard>
        </div>
      </div>

      {/* Capability Details Dialog */}
      <Dialog
        open={!!selectedSim}
        onOpenChange={(open) => !open && setSelectedSim(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              {selectedSim?.name}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Autonomous statutory telemetry module.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2 text-xs leading-relaxed text-foreground">
            <p>{selectedSim?.text}</p>
            <p className="text-muted-foreground">
              The platform records immutable versioned rules, household lineage
              graphs, and an append-only audit trail, which this capability
              leverages.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
