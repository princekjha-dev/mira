import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  FileCheck2,
  FileText,
  Gift,
  HelpCircle,
  LogIn,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { useApp } from "@/lib/app-state";
import { fetchApplications, fetchBenefits } from "@/lib/api";
import { BENEFITS, SCHEMES, type Application, type Benefit, type Scheme } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Empty,
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
  Panel,
} from "@/components/gov/ui";
import { SchemeBreadcrumbs } from "@/components/gov/scheme";
import { MiraCard } from "@/components/mira/MiraPrimitives";
import { cn } from "@/lib/utils";

type SearchParams = {
  schemeId?: string;
  tab?: string;
};

export const Route = createFileRoute("/citizen/benefits")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    schemeId: typeof s.schemeId === "string" ? s.schemeId : undefined,
    tab: typeof s.tab === "string" ? s.tab : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Benefits & Entitlements — Public Welfare & Assistance — Mira" },
      {
        name: "description",
        content:
          "Explore statutory benefits, direct assistance transfers (DBT), monthly pensions, and active household entitlements.",
      },
    ],
  }),
  component: Benefits,
});

const ALL = "all";

const statusStyle: Record<string, string> = {
  Active: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
  Approved: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
  Disbursed: "border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-800 dark:bg-teal-950/40 dark:text-teal-300",
  Completed: "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
  Pending: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  "Under Review": "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  Suspended: "border-orange-200 bg-orange-50 text-orange-900 dark:border-orange-800 dark:bg-orange-950/40 dark:text-orange-300",
  Rejected: "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300",
  Expired: "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

const asDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Not specified";

function Benefits() {
  const searchParams = Route.useSearch();
  const { state } = useApp();
  const session = state.session;
  const isCitizen = session?.role === "citizen";

  const [benefits, setBenefits] = useState<Benefit[]>(() =>
    state.benefits?.length ? state.benefits : BENEFITS
  );
  const [applications, setApplications] = useState<Application[]>(() => state.applications || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Filters
  const [activeTab, setActiveTab] = useState<"all" | "active" | "pending" | "completed">("all");
  const [member, setMember] = useState(ALL);
  const [type, setType] = useState(ALL);
  const [publicBenefitType, setPublicBenefitType] = useState(ALL);
  const [publicSearch, setPublicSearch] = useState("");

  const refresh = useCallback(async () => {
    if (!session?.apiToken) {
      setBenefits(BENEFITS);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const [loadedBenefits, loadedApplications] = await Promise.all([
        fetchBenefits(session),
        fetchApplications(session),
      ]);
      setBenefits(loadedBenefits.length ? loadedBenefits : state.benefits?.length ? state.benefits : BENEFITS);
      if (loadedApplications.length) setApplications(loadedApplications);
    } catch {
      setBenefits(state.benefits?.length ? state.benefits : BENEFITS);
    } finally {
      setLoading(false);
    }
  }, [session, state.benefits]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  // Authenticated benefits filtering
  const members = useMemo(
    () => Array.from(new Set(benefits.map((b) => b.beneficiary).filter(Boolean))),
    [benefits]
  );

  const filteredBenefits = useMemo(() => {
    return benefits.filter((b) => {
      // Tab filter
      if (activeTab === "active" && !["Active", "Approved", "Disbursed"].includes(b.status)) {
        return false;
      }
      if (activeTab === "pending" && !["Pending", "Under Review"].includes(b.status)) {
        return false;
      }
      if (activeTab === "completed" && !["Completed", "Expired"].includes(b.status)) {
        return false;
      }

      // Member filter
      if (member !== ALL && b.beneficiary !== member) return false;

      // Unit type filter
      if (type !== ALL && b.type !== type) return false;

      // Preselected schemeId filter
      if (searchParams.schemeId && b.schemeId !== searchParams.schemeId) return false;

      return true;
    });
  }, [benefits, activeTab, member, type, searchParams.schemeId]);

  // Public directory filtering
  const filteredSchemesForPublic = useMemo(() => {
    return SCHEMES.filter((s) => {
      if (publicBenefitType !== ALL && s.benefitType !== publicBenefitType) {
        return false;
      }
      if (publicSearch) {
        const query = publicSearch.toLowerCase();
        if (
          !(s.name + s.description + s.keyBenefit + s.benefitType + s.department)
            .toLowerCase()
            .includes(query)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [publicBenefitType, publicSearch]);

  const activeCount = benefits.filter((b) => ["Active", "Approved", "Disbursed"].includes(b.status)).length;
  const pendingCount = benefits.filter((b) => ["Pending", "Under Review"].includes(b.status)).length;
  const completedCount = benefits.filter((b) => ["Completed", "Expired"].includes(b.status)).length;

  return (
    <PageContainer className="max-w-6xl space-y-6">
      {/* Contextual Breadcrumbs */}
      <SchemeBreadcrumbs
        currentSection="Benefits & Entitlements"
      />

      <PageHeader
        eyebrow={isCitizen ? "HOUSEHOLD BENEFITS" : "PUBLIC WELFARE DIRECTORY"}
        title={isCitizen ? "My Benefits & Entitlements" : "Benefits & Entitlements Directory"}
        desc={
          isCitizen
            ? "Statutory entitlements, direct benefit transfers (DBT), monthly pensions, and public assistance granted to your household."
            : "Explore statutory entitlements, direct assistance transfers, pensions, and medical coverage provided across government welfare schemes."
        }
        actions={
          isCitizen ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => void refresh()}
                className="rounded-lg border-slate-300 dark:border-slate-700 h-8"
              >
                <RefreshCw className={cn("h-3.5 w-3.5 mr-1.5", loading && "animate-spin")} />
                <span>Refresh</span>
              </Button>
              <Button
                size="sm"
                asChild
                className="rounded-lg bg-navy hover:bg-navy/90 text-white h-8 text-xs font-semibold"
              >
                <Link to="/schemes">
                  <Gift className="h-3.5 w-3.5 mr-1.5" />
                  <span>Browse All Schemes</span>
                </Link>
              </Button>
            </div>
          ) : undefined
        }
      />

      {/* ------------------------------------------------------------------ */}
      {/* PUBLIC EXPERIENCE (LOGGED OUT)                                     */}
      {/* ------------------------------------------------------------------ */}
      {!isCitizen ? (
        <div className="space-y-6">
          {/* Sign In Prompt Banner */}
          <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/80 dark:bg-blue-950/30 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <ShieldCheck className="h-6 w-6 text-gov shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="font-bold text-sm sm:text-base text-foreground">
                  Track Your Household's Entitlements
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Sign in with your Citizen ID to view your active sanctions, pending DBT payment installments,
                  ration entitlements, and personal welfare records.
                </p>
              </div>
            </div>

            <Button
              size="lg"
              asChild
              className="rounded-lg bg-navy hover:bg-navy/90 text-white font-medium text-xs sm:text-sm shadow-xs shrink-0 self-start sm:self-auto"
            >
              <Link to="/login">
                <LogIn className="h-4 w-4 mr-1.5" />
                <span>Sign In with Citizen ID</span>
              </Link>
            </Button>
          </div>

          {/* Public Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card p-4 rounded-xl border border-border/70">
            <div className="w-full sm:w-72 relative">
              <Search className="h-4 w-4 absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search benefits by keyword…"
                value={publicSearch}
                onChange={(e) => setPublicSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Label className="text-xs text-muted-foreground shrink-0">Benefit Type:</Label>
              <Select value={publicBenefitType} onValueChange={setPublicBenefitType}>
                <SelectTrigger className="h-8 text-xs w-full sm:w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All Benefit Types</SelectItem>
                  <SelectItem value="Direct Benefit Transfer (DBT)">Direct Benefit Transfer (DBT)</SelectItem>
                  <SelectItem value="Subsidy / Grant">Subsidy / Grant</SelectItem>
                  <SelectItem value="Healthcare Coverage">Healthcare Coverage</SelectItem>
                  <SelectItem value="Monthly Pension">Monthly Pension</SelectItem>
                  <SelectItem value="In-kind Assistance">In-kind Assistance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Public Catalogue Grid of Entitlements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSchemesForPublic.map((s) => (
              <MiraCard key={s.id} variant="elevated" className="p-5 rounded-2xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-primary block">
                        {s.benefitType}
                      </span>
                      <h3 className="font-bold text-base text-foreground mt-0.5">
                        {s.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {s.department}
                      </p>
                    </div>

                    <span className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] font-mono px-2 py-0.5 border border-border/50 shrink-0">
                      {s.level} Unit
                    </span>
                  </div>

                  <div className="rounded-lg bg-blue-50/70 dark:bg-blue-950/20 p-3 border border-blue-200/60 dark:border-blue-900/40 text-xs">
                    <p className="font-semibold text-blue-950 dark:text-blue-100">
                      Entitlement: {s.keyBenefit}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Who qualifies: {s.targetAudience}
                    </p>
                  </div>

                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {s.benefitsSummary.slice(0, 2).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-gov font-bold">✓</span>
                        <span className="line-clamp-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-border/60 mt-4 flex items-center justify-between gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    className="text-xs h-8 rounded-lg flex-1 border-slate-300 dark:border-slate-700"
                  >
                    <Link to="/schemes/$id" params={{ id: s.id }}>
                      <span>View Scheme</span>
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>

                  <Button
                    size="sm"
                    asChild
                    className="text-xs h-8 rounded-lg flex-1 bg-navy hover:bg-navy/90 text-white font-medium"
                  >
                    <Link to="/eligibility" search={{ scheme: s.id }}>
                      <Sparkles className="h-3 w-3 mr-1 text-gov" />
                      <span>Check Eligibility</span>
                    </Link>
                  </Button>
                </div>
              </MiraCard>
            ))}
          </div>
        </div>
      ) : (
        /* ------------------------------------------------------------------ */
        /* AUTHENTICATED EXPERIENCE (CITIZEN / APPLICANT)                     */
        /* ------------------------------------------------------------------ */
        <div className="space-y-6">
          {/* Subnavigation Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-3">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors flex items-center gap-1.5",
                  activeTab === "all"
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 shadow-2xs"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                )}
              >
                <span>All Benefits</span>
                <span className="rounded-full bg-white/20 dark:bg-black/10 px-1.5 text-[10px] tabular-nums font-mono">
                  {benefits.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("active")}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors flex items-center gap-1.5",
                  activeTab === "active"
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 shadow-2xs"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                )}
              >
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                <span>Active</span>
                <span className="rounded-full bg-white/20 dark:bg-black/10 px-1.5 text-[10px] tabular-nums font-mono">
                  {activeCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("pending")}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors flex items-center gap-1.5",
                  activeTab === "pending"
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 shadow-2xs"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                )}
              >
                <span>Pending Review</span>
                <span className="rounded-full bg-white/20 dark:bg-black/10 px-1.5 text-[10px] tabular-nums font-mono">
                  {pendingCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("completed")}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors flex items-center gap-1.5",
                  activeTab === "completed"
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 shadow-2xs"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                )}
              >
                <span>Completed / Disbursed</span>
                <span className="rounded-full bg-white/20 dark:bg-black/10 px-1.5 text-[10px] tabular-nums font-mono">
                  {completedCount}
                </span>
              </button>
            </div>

            {/* Member & Unit Filters */}
            <div className="flex items-center gap-2 text-xs">
              <Select value={member} onValueChange={setMember}>
                <SelectTrigger className="h-8 text-xs w-40">
                  <SelectValue placeholder="Beneficiary" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All Beneficiaries</SelectItem>
                  {members.map((m) => (
                    <SelectItem value={m} key={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-8 text-xs w-32">
                  <SelectValue placeholder="Unit Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All Units</SelectItem>
                  <SelectItem value="Household">Household</SelectItem>
                  <SelectItem value="Individual">Individual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Benefits Cards List */}
          {loading ? (
            <LoadingState label="Retrieving household benefits records…" />
          ) : filteredBenefits.length === 0 ? (
            <Empty
              title="No benefits match these criteria"
              body="No active benefits or entitlements were found for the selected filter."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveTab("all");
                    setMember(ALL);
                    setType(ALL);
                  }}
                  className="rounded-lg text-xs"
                >
                  Clear Filters
                </Button>
              }
            />
          ) : (
            <div className="space-y-4">
              {filteredBenefits.map((benefit) => {
                const linkedScheme = SCHEMES.find(
                  (s) => s.id === benefit.schemeId || s.name === benefit.scheme
                );

                return (
                  <MiraCard
                    key={benefit.ref}
                    variant="elevated"
                    className="p-5 sm:p-6 rounded-2xl space-y-4 hover:shadow-xs transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-wider font-semibold text-muted-foreground">
                            {benefit.type} Entitlement
                          </span>
                          <span className="text-slate-300 dark:text-slate-700">•</span>
                          <span className="text-xs font-mono text-muted-foreground">
                            Ref: {benefit.ref}
                          </span>
                        </div>

                        <h3 className="font-bold text-lg text-foreground">
                          {benefit.scheme}
                        </h3>

                        <p className="text-xs text-muted-foreground font-medium">
                          {benefit.department}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <span
                          className={cn(
                            "rounded-full border px-2.5 py-0.5 text-xs font-medium font-mono",
                            statusStyle[benefit.status] || statusStyle.Pending
                          )}
                        >
                          {benefit.status}
                        </span>
                      </div>
                    </div>

                    {/* Entitlement specification banner */}
                    <div className="rounded-xl border border-blue-200/70 bg-blue-50/60 dark:border-blue-900/50 dark:bg-blue-950/20 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5">
                        <span className="font-mono text-[10px] uppercase font-semibold text-blue-900 dark:text-blue-300">
                          Granted Statutory Entitlement
                        </span>
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {benefit.entitlementDescription || linkedScheme?.keyBenefit || "Statutory public assistance"}
                        </p>
                      </div>

                      {benefit.amount && (
                        <div className="shrink-0 bg-white/90 dark:bg-slate-900/90 border border-blue-200 dark:border-blue-800 rounded-lg px-3 py-1.5 self-start sm:self-auto text-right">
                          <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                            Sanction Value
                          </span>
                          <span className="text-sm font-bold text-foreground">
                            {new Intl.NumberFormat("en-IN", {
                              style: "currency",
                              currency: benefit.currency || "INR",
                              maximumFractionDigits: 0,
                            }).format(benefit.amount)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Grid metadata */}
                    <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-xs">
                      <div className="rounded-lg bg-muted/30 p-2.5 space-y-0.5">
                        <dt className="text-muted-foreground font-mono uppercase text-[10px] flex items-center gap-1">
                          <Users className="h-3 w-3 text-gov" />
                          <span>Beneficiary</span>
                        </dt>
                        <dd className="font-semibold text-foreground">
                          {benefit.beneficiary}
                        </dd>
                      </div>

                      <div className="rounded-lg bg-muted/30 p-2.5 space-y-0.5">
                        <dt className="text-muted-foreground font-mono uppercase text-[10px] flex items-center gap-1">
                          <CalendarDays className="h-3 w-3 text-gov" />
                          <span>Sanction Date</span>
                        </dt>
                        <dd className="font-semibold text-foreground">
                          {asDate(benefit.approvedOn)}
                        </dd>
                      </div>

                      <div className="rounded-lg bg-muted/30 p-2.5 space-y-0.5">
                        <dt className="text-muted-foreground font-mono uppercase text-[10px] flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3 text-gov" />
                          <span>Decision Order</span>
                        </dt>
                        <dd className="font-mono text-muted-foreground font-semibold">
                          {benefit.decisionRef || "DEC-CONFIRMED"}
                        </dd>
                      </div>

                      <div className="rounded-lg bg-muted/30 p-2.5 space-y-0.5">
                        <dt className="text-muted-foreground font-mono uppercase text-[10px] flex items-center gap-1">
                          <Wallet className="h-3 w-3 text-gov" />
                          <span>Validity</span>
                        </dt>
                        <dd className="font-medium text-foreground">
                          {benefit.validTo || "Perennial / Annual Cycle"}
                        </dd>
                      </div>
                    </dl>

                    {/* Bottom Action Links */}
                    <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex flex-wrap items-center gap-3">
                        {linkedScheme && (
                          <Button
                            variant="link"
                            size="sm"
                            asChild
                            className="h-auto p-0 text-primary font-medium"
                          >
                            <Link to="/schemes/$id" params={{ id: linkedScheme.id }}>
                              <span>View Scheme Catalogue</span>
                              <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                            </Link>
                          </Button>
                        )}

                        {benefit.applicationId && (
                          <Button
                            variant="link"
                            size="sm"
                            asChild
                            className="h-auto p-0 text-blue-700 dark:text-blue-400 font-medium"
                          >
                            <Link
                              to="/citizen/applications/$id"
                              params={{ id: benefit.applicationId }}
                            >
                              <span>View Application ({benefit.applicationId})</span>
                              <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                            </Link>
                          </Button>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="text-xs text-muted-foreground hover:text-foreground h-7 px-2"
                      >
                        <Link to="/citizen/grievances">
                          <span>Report Issue / Appeal</span>
                        </Link>
                      </Button>
                    </div>
                  </MiraCard>
                );
              })}
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
}
