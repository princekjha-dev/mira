import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Gift,
  HelpCircle,
  Info,
  MapPin,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { CATEGORY_IMAGE, getScheme, type Scheme } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { LevelBadge, PageContainer, Pill } from "@/components/gov/ui";
import {
  SchemeBreadcrumbs,
  SchemeHeader,
  SchemeNavigation,
  SchemeStatus,
  EligibilitySummary,
  BenefitSummary,
  RequiredDocuments,
  ApplicationCTA,
  type SchemeTabKey,
} from "@/components/gov/scheme";
import { useApp } from "@/lib/app-state";

type S = { tab?: SchemeTabKey };

export const Route = createFileRoute("/schemes/$id")({
  validateSearch: (s: Record<string, unknown>): S => ({
    tab: (s.tab as SchemeTabKey) || undefined,
  }),
  loader: ({ params }) => {
    const s = getScheme(params.id);
    if (!s) throw notFound();
    return s;
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Public Schemes & Benefits — Mira` },
          { name: "description", content: loaderData.description },
          { property: "og:title", content: loaderData.name },
          { property: "og:description", content: loaderData.description },
        ]
      : [{ title: "Scheme unavailable" }, { name: "robots", content: "noindex" }],
  }),
  component: SchemeDetail,
});

function SchemeDetail() {
  const scheme = Route.useLoaderData();
  const search = Route.useSearch();
  const [activeTab, setActiveTab] = useState<SchemeTabKey>(
    search.tab || "overview"
  );
  const { state } = useApp();
  const session = state.session;
  const isCitizen = session?.role === "citizen";

  useEffect(() => {
    if (search.tab) {
      setActiveTab(search.tab);
    }
  }, [search.tab]);

  const existingApp = isCitizen
    ? state.applications.find((a) => a.schemeId === scheme.id)
    : null;

  return (
    <PageContainer className="max-w-6xl space-y-6">
      {/* Contextual Breadcrumbs */}
      <SchemeBreadcrumbs
        scheme={scheme}
        currentSection={
          activeTab === "overview"
            ? undefined
            : activeTab === "eligibility"
              ? "Eligibility Criteria"
              : activeTab === "benefits"
                ? "Benefits & Entitlements"
                : activeTab === "documents"
                  ? "Required Documents"
                  : "How to Apply"
        }
      />

      {/* Scheme Header Component */}
      <SchemeHeader scheme={scheme} />

      {/* Navigation Tabs Bar */}
      <SchemeNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Panels */}
      <div className="pt-2">
        {/* ------------------------------------------------------------------ */}
        {/* OVERVIEW TAB                                                       */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-[1.5fr_1fr]">
              <div className="space-y-6">
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border/80 shadow-xs">
                  <img
                    src={CATEGORY_IMAGE[scheme.category]}
                    alt={scheme.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs font-mono uppercase tracking-wider text-slate-200">
                      Administrative Wing
                    </p>
                    <p className="font-semibold text-base sm:text-lg">
                      {scheme.department}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
                  <h3 className="text-base font-semibold text-foreground">
                    About this Welfare Program
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {scheme.description}
                  </p>

                  <div className="pt-2 border-t border-border/60">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono mb-2">
                      Statutory Basis & Scope
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {scheme.level === "Household"
                        ? "This scheme is sanctioned at the Household unit level. Benefits are evaluated across all family members registered in the household record (Family360), and duplicate subsidies across the same dwelling or family unit are strictly monitored."
                        : "This scheme is sanctioned to the named individual applicant. The benefit is personal and non-transferable."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sidebar Quick Summary */}
              <div className="space-y-5">
                <div className="rounded-xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
                    At a Glance
                  </h4>

                  <dl className="space-y-3 text-xs">
                    <div>
                      <dt className="text-muted-foreground font-mono uppercase text-[10px]">
                        Target Audience
                      </dt>
                      <dd className="font-semibold text-foreground mt-0.5">
                        {scheme.targetAudience}
                      </dd>
                    </div>

                    <div className="pt-2 border-t border-border/50">
                      <dt className="text-muted-foreground font-mono uppercase text-[10px]">
                        Primary Entitlement
                      </dt>
                      <dd className="font-semibold text-foreground mt-0.5">
                        {scheme.keyBenefit}
                      </dd>
                    </div>

                    <div className="pt-2 border-t border-border/50">
                      <dt className="text-muted-foreground font-mono uppercase text-[10px]">
                        Benefit Delivery
                      </dt>
                      <dd className="font-semibold text-foreground mt-0.5">
                        {scheme.benefitType}
                      </dd>
                    </div>

                    <div className="pt-2 border-t border-border/50">
                      <dt className="text-muted-foreground font-mono uppercase text-[10px]">
                        Enrollment Status
                      </dt>
                      <dd className="mt-1">
                        <SchemeStatus status={scheme.status} size="sm" />
                      </dd>
                    </div>

                    <div className="pt-2 border-t border-border/50">
                      <dt className="text-muted-foreground font-mono uppercase text-[10px]">
                        Deadlines / Batch Cycle
                      </dt>
                      <dd className="font-medium text-foreground mt-0.5">
                        {scheme.deadlines || "Rolling Application Cycle"}
                      </dd>
                    </div>
                  </dl>

                  <div className="pt-3 border-t border-border/60">
                    <ApplicationCTA scheme={scheme} className="w-full justify-center" />
                  </div>
                </div>

                {/* Direct quick links */}
                <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-2 text-xs">
                  <p className="font-semibold text-foreground">Next Steps</p>
                  <ul className="space-y-1.5 text-muted-foreground">
                    <li>
                      <button
                        type="button"
                        onClick={() => setActiveTab("eligibility")}
                        className="text-primary hover:underline font-medium text-left"
                      >
                        → Check detailed eligibility criteria
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => setActiveTab("benefits")}
                        className="text-primary hover:underline font-medium text-left"
                      >
                        → View complete benefit package breakdown
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={() => setActiveTab("documents")}
                        className="text-primary hover:underline font-medium text-left"
                      >
                        → Prepare required documentary evidence
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* ELIGIBILITY TAB                                                    */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === "eligibility" && (
          <EligibilitySummary scheme={scheme} />
        )}

        {/* ------------------------------------------------------------------ */}
        {/* BENEFITS TAB                                                       */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === "benefits" && (
          <BenefitSummary scheme={scheme} />
        )}

        {/* ------------------------------------------------------------------ */}
        {/* REQUIRED DOCUMENTS TAB                                             */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === "documents" && (
          <RequiredDocuments scheme={scheme} />
        )}

        {/* ------------------------------------------------------------------ */}
        {/* HOW TO APPLY TAB                                                   */}
        {/* ------------------------------------------------------------------ */}
        {activeTab === "process" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Official Application & Determination Workflow
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Mira coordinates cross-departmental verification between the citizen, field inspecting officials, and sanctioning authorities.
                </p>
              </div>

              {/* Step by step process */}
              <div className="space-y-4">
                {scheme.howToApply.map((stepDesc, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 p-3.5 rounded-lg border border-border/60 bg-muted/20"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold font-mono text-xs shadow-2xs">
                      {idx + 1}
                    </div>
                    <div className="space-y-0.5 text-xs sm:text-sm">
                      <span className="font-semibold text-foreground block">
                        Stage 0{idx + 1}
                      </span>
                      <p className="text-muted-foreground leading-relaxed">
                        {stepDesc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Administrative SLAs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border/60 text-xs">
                <div className="rounded-lg bg-muted/40 p-3 space-y-1">
                  <span className="text-[11px] font-mono uppercase text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3 text-gov" />
                    <span>Processing SLA</span>
                  </span>
                  <p className="font-semibold text-foreground">
                    15 to 21 Working Days
                  </p>
                </div>

                <div className="rounded-lg bg-muted/40 p-3 space-y-1">
                  <span className="text-[11px] font-mono uppercase text-muted-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-gov" />
                    <span>Nodal Department</span>
                  </span>
                  <p className="font-semibold text-foreground truncate">
                    {scheme.department}
                  </p>
                </div>

                <div className="rounded-lg bg-muted/40 p-3 space-y-1">
                  <span className="text-[11px] font-mono uppercase text-muted-foreground flex items-center gap-1">
                    <HelpCircle className="h-3 w-3 text-gov" />
                    <span>Grievance Mechanism</span>
                  </span>
                  <p className="font-semibold text-foreground">
                    Appeals via Mira Grievance Cell
                  </p>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs text-muted-foreground">
                  Ready to begin? You can save drafts and upload documents in stages.
                </p>
                <ApplicationCTA scheme={scheme} size="lg" />
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
