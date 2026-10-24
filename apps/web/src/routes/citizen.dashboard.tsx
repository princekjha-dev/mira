import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ClipboardList,
  FileCheck2,
  FolderOpen,
  History,
  ListChecks,
  MessageSquareWarning,
  UserPen,
  Users,
  ArrowRight,
  AlertTriangle,
  Home,
  CheckCircle2,
  Calendar,
  FileText,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/lib/app-state";
import { getScheme, fmtDate } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  MiraPageHeader,
  MiraSectionHeader,
  MiraCard,
  MiraStatCard,
  MiraStatus,
  MiraEmptyState,
} from "@/components/mira";
import {
  apiRequest,
  fetchMyFamily,
  type ApiDocument,
  type ApiFamilyResponse,
} from "@/lib/api";
import { formatBytes } from "@/lib/document-config";
import { DocumentViewer } from "@/components/gov/DocumentViewer";

export const Route = createFileRoute("/citizen/dashboard")({
  head: () => ({
    meta: [
      { title: "Rajesh Sharma — Citizen Workspace · Mira" },
      {
        name: "description",
        content:
          "Authoritative family record, scheme applications, verified civil documents, and entitlement services.",
      },
    ],
  }),
  component: CitizenDashboard,
});

const QUICK_SERVICES = [
  {
    to: "/schemes",
    icon: ClipboardList,
    label: "Apply for Scheme",
    desc: "Discover active welfare programs",
  },
  {
    to: "/eligibility",
    icon: ListChecks,
    label: "Check Eligibility",
    desc: "Instant automated criteria test",
  },
  {
    to: "/citizen/applications",
    icon: FileCheck2,
    label: "Track Application",
    desc: "Real-time verification telemetry",
  },
  {
    to: "/citizen/family",
    icon: Users,
    label: "My Family Tree",
    desc: "Verified household roster",
  },
  {
    to: "/citizen/documents",
    icon: FolderOpen,
    label: "Civil Documents",
    desc: "Attested digital certificates",
  },
  {
    to: "/citizen/benefits",
    icon: History,
    label: "Benefit Disbursements",
    desc: "Direct benefit transfer logs",
  },
  {
    to: "/citizen/family",
    icon: UserPen,
    label: "Report Life Event",
    desc: "Birth, marriage & address changes",
  },
  {
    to: "/citizen/grievances",
    icon: MessageSquareWarning,
    label: "Lodge Grievance",
    desc: "Direct supervisory escalation",
  },
] as const;

function CitizenDashboard() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<ApiDocument[]>([]);
  const [previewDoc, setPreviewDoc] = useState<ApiDocument | null>(null);
  const [greeting, setGreeting] = useState("Good day");

  // Query Live Family Data
  const { data: family } = useQuery<ApiFamilyResponse>({
    queryKey: ["my-family", state.session?.apiUserId],
    queryFn: () => fetchMyFamily(state.session),
    enabled: !!state.session,
  });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  useEffect(() => {
    if (!state.session?.apiToken) return;
    let active = true;
    apiRequest<{ data: ApiDocument[] }>(
      state.session,
      "/api/v1/documents?owner_type=CITIZEN",
    )
      .then((result) => {
        if (active) {
          setDocuments(
            result.data.filter((doc) => doc.status !== "REVOKED").slice(0, 5),
          );
        }
      })
      .catch(() => {
        if (active) setDocuments([]);
      });
    return () => {
      active = false;
    };
  }, [state.session]);

  const applications = state.applications;
  const actionRequiredApps = applications.filter(
    (a) =>
      a.status === "Verification Required" ||
      a.status === "Additional Evidence Required" ||
      a.status === "Draft",
  );
  const inProgressCount = applications.filter(
    (a) => !["Draft", "Approved", "Rejected"].includes(a.status),
  ).length;
  const disbursedBenefits = state.benefits.filter((b) =>
    ["Disbursed", "Completed"].includes(b.status),
  ).length;
  const verifiedDocsCount = documents.filter(
    (d) => d.verification_status === "VERIFIED",
  ).length;

  // Identity: Rajesh Sharma
  const citizenName = state.session?.name || "Rajesh Sharma";
  const householdName = family?.household_name || "Sharma Family";
  const householdId = family?.household_public_id || "MIRA-FAM-10482";
  const memberCount = family?.members?.length || 11;

  return (
    <div className="space-y-7 pb-12 animate-in fade-in duration-200">
      {/* 1. Header (Apple-restrained hierarchy) */}
      <MiraPageHeader
        context="Citizen account"
        title={`${greeting}, ${citizenName}`}
        description="Unified welfare eligibility, household civil registry, and verified direct entitlement services."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              asChild
              className="h-8.5 rounded-lg border-border/80 bg-background/80 px-3.5 text-xs font-medium shadow-2xs hover:bg-muted"
            >
              <Link to="/citizen/family">
                <Users className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                View Family Tree
              </Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="h-8.5 rounded-lg bg-primary px-3.5 text-xs font-medium text-primary-foreground shadow-2xs hover:bg-primary/95"
            >
              <Link to="/schemes">
                <ClipboardList className="mr-1.5 h-3.5 w-3.5" />
                Explore Schemes
              </Link>
            </Button>
          </div>
        }
      />

      {/* 2. Core Family Record Summary (Section 30: feels like a core record rather than decorative card) */}
      <div className="rounded-xl border border-border/80 bg-gradient-to-b from-card via-card to-muted/20 p-5 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/5 text-primary">
              <Home className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-base font-semibold tracking-tight text-foreground">
                  {householdName}
                </h2>
                <span className="font-mono text-xs font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/60">
                  {householdId}
                </span>
                <MiraStatus
                  status={family?.verification_status || "Verified"}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground leading-normal">
                <span className="font-medium text-foreground">
                  {memberCount} registered members
                </span>{" "}
                · {family?.bpl_status || "BPL Category A"} ·{" "}
                {family?.income_category || "Annual Income < ₹1.2L"} · Verified
                via Civil Registration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:self-center">
            <Button
              size="sm"
              variant="outline"
              asChild
              className="h-8 rounded-lg text-xs font-medium"
            >
              <Link to="/citizen/family">
                Manage Household
                <ArrowRight className="ml-1.5 h-3.5 w-3.5 text-muted-foreground" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Action Required Alert (if clarification/evidence requested) */}
      {actionRequiredApps.some(
        (a) =>
          a.status === "Additional Evidence Required" ||
          a.status === "Verification Required",
      ) && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4.5 text-amber-950 dark:text-amber-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <h3 className="text-xs font-semibold tracking-tight">
                  Officer Clarification Requested
                </h3>
                <p className="mt-0.5 text-xs text-amber-900/90 dark:text-amber-300/90 leading-relaxed">
                  The verification officer has requested supporting
                  documentation for your pending application. Review details and
                  upload attested documents to prevent SLA delays.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              asChild
              className="h-8 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-medium shrink-0 shadow-2xs"
            >
              <Link to="/citizen/applications">
                Respond to Request
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* 4. Summary Metric Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MiraStatCard
          title="Applications in Progress"
          value={inProgressCount}
          subtext="Under statutory review"
          icon={FileCheck2}
        />
        <MiraStatCard
          title="Disbursed Benefits"
          value={disbursedBenefits}
          subtext="Direct bank transfers"
          icon={CreditCard}
          trend={{ label: "Active", tone: "positive" }}
        />
        <MiraStatCard
          title="Verified Documents"
          value={verifiedDocsCount}
          subtext={`of ${documents.length || 5} civil proofs`}
          icon={FolderOpen}
          trend={{ label: "Attested", tone: "positive" }}
        />
        <MiraStatCard
          title="Household Members"
          value={memberCount}
          subtext="Verified kinship registry"
          icon={Users}
        />
      </div>

      {/* 5. Main Content Workspaces: Applications & Documents */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Applications Column (2 cols) */}
        <div className="space-y-4 lg:col-span-2">
          <MiraCard className="p-5">
            <MiraSectionHeader
              title="Active Applications"
              description="Real-time statutory status and verification progression."
              action={
                <Button
                  size="sm"
                  variant="ghost"
                  asChild
                  className="h-7 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Link to="/citizen/applications">
                    View all ({applications.length})
                  </Link>
                </Button>
              }
            />

            {applications.length === 0 ? (
              <MiraEmptyState
                icon={FileCheck2}
                title="No active applications"
                description="Explore schemes and check eligibility to apply for welfare support."
                action={
                  <Button size="sm" asChild className="mt-2 text-xs">
                    <Link to="/schemes">Apply for Scheme</Link>
                  </Button>
                }
              />
            ) : (
              <div className="mt-3 divide-y divide-border/60">
                {applications.slice(0, 4).map((app) => (
                  <div
                    key={app.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 first:pt-1 last:pb-1"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-medium font-mono text-muted-foreground">
                          {app.id}
                        </span>
                        <MiraStatus status={app.status} />
                        {app.duplicate && (
                          <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-400 border border-amber-500/20">
                            Duplicate Alert
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-semibold text-foreground truncate">
                        {getScheme(app.schemeId)?.name ||
                          "Welfare Assistance Scheme"}
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        Updated {fmtDate(app.updatedOn)} · Assigned to district
                        verification queue
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
                          to="/citizen/applications/$id"
                          params={{ id: app.id }}
                        >
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </MiraCard>

          {/* Quick Services Grid */}
          <MiraCard className="p-5">
            <MiraSectionHeader
              title="Citizen Services"
              description="Direct access to lifecycle claims, family registry updates, and scheme discovery."
            />
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {QUICK_SERVICES.map((srv) => (
                <Link
                  key={srv.label}
                  to={srv.to}
                  className="group flex flex-col justify-between rounded-xl border border-border/70 bg-card p-3.5 transition-all duration-150 hover:border-primary/40 hover:bg-muted/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-foreground group-hover:text-primary transition-colors">
                      <srv.icon className="h-4 w-4" />
                    </div>
                    <ArrowRight className="h-3 w-3 text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <div className="mt-3">
                    <span className="text-xs font-semibold text-foreground tracking-tight block">
                      {srv.label}
                    </span>
                    <span className="mt-0.5 text-[10px] text-muted-foreground line-clamp-1 block">
                      {srv.desc}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </MiraCard>
        </div>

        {/* Secondary Column: Civil Documents & Identity Status */}
        <div className="space-y-4">
          <MiraCard className="p-5">
            <MiraSectionHeader
              title="Verified Documents"
              description="Official proofs linked to your household."
              action={
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    void navigate({
                      to: "/citizen/documents",
                      search: { upload: true },
                    })
                  }
                  className="h-7 text-xs text-primary hover:text-primary/90"
                >
                  Upload New
                </Button>
              }
            />

            {documents.length === 0 ? (
              <p className="mt-2 text-xs text-muted-foreground">
                No documents uploaded yet. Attested proofs will appear here.
              </p>
            ) : (
              <div className="mt-2 divide-y divide-border/60">
                {documents.slice(0, 4).map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setPreviewDoc(doc)}
                    className="w-full text-left py-3 first:pt-1 last:pb-1 flex items-center justify-between gap-3 group hover:bg-muted/20 -mx-1 px-1 rounded transition-colors"
                  >
                    <div className="min-w-0">
                      <span className="block truncate text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                        {doc.original_filename}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {formatBytes(doc.size_bytes)} ·{" "}
                        {new Date(doc.created_at).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                    <MiraStatus
                      status={
                        doc.verification_status === "VERIFIED"
                          ? "Verified"
                          : "Pending"
                      }
                    />
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Verification Rate</span>
              <span className="font-semibold text-teal-600 dark:text-teal-400">
                {documents.length
                  ? Math.round((verifiedDocsCount / documents.length) * 100)
                  : 100}
                %
              </span>
            </div>
          </MiraCard>

          {/* Statutory Notice */}
          <MiraCard className="p-4.5 bg-muted/30">
            <div className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
              <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <span>
                Your household record is protected by statutory end-to-end audit
                seals. All eligibility determinations are reproducible on the
                public ledger.
              </span>
            </div>
          </MiraCard>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {state.session && (
        <DocumentViewer
          document={previewDoc}
          session={state.session}
          onClose={() => setPreviewDoc(null)}
          onChanged={() => {
            if (!state.session?.apiToken) return;
            void apiRequest<{ data: ApiDocument[] }>(
              state.session,
              "/api/v1/documents?owner_type=CITIZEN",
            )
              .then((result) =>
                setDocuments(
                  result.data
                    .filter((doc) => doc.status !== "REVOKED")
                    .slice(0, 5),
                ),
              )
              .catch(() => undefined);
          }}
        />
      )}
    </div>
  );
}
