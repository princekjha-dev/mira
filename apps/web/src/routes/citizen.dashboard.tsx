import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
} from "lucide-react";
import { useApp } from "@/lib/app-state";
import { getScheme, fmtDate } from "@/lib/data";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Panel, StatusBadge } from "@/components/gov/ui";
import { apiRequest, type ApiDocument } from "@/lib/api";
import { formatBytes } from "@/lib/document-config";
import { DocumentViewer } from "@/components/gov/DocumentViewer";

export const Route = createFileRoute("/citizen/dashboard")({
  head: () => ({
    meta: [
      { title: "My Dashboard — Citizen" },
      {
        name: "description",
        content: "Your applications, household and document status.",
      },
      { property: "og:title", content: "Citizen Dashboard" },
      {
        property: "og:description",
        content: "Your citizen services at a glance.",
      },
    ],
  }),
  component: Dash,
});

const ACTIONS = [
  { to: "/schemes", icon: ClipboardList, label: "Apply for Scheme" },
  { to: "/eligibility", icon: ListChecks, label: "Check Eligibility" },
  { to: "/citizen/applications", icon: FileCheck2, label: "Track Application" },
  { to: "/citizen/family", icon: Users, label: "My Family" },
  { to: "/citizen/documents", icon: FolderOpen, label: "My Documents" },
  { to: "/citizen/benefits", icon: History, label: "Benefit History" },
  { to: "/citizen/family", icon: UserPen, label: "Update Family Details" },
  {
    to: "/citizen/grievances",
    icon: MessageSquareWarning,
    label: "Raise Grievance",
  },
] as const;

function Dash() {
  const { state } = useApp();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<ApiDocument[]>([]);
  const [previewDoc, setPreviewDoc] = useState<ApiDocument | null>(null);
  const [greet, setGreet] = useState("Welcome");
  useEffect(() => {
    const h = new Date().getHours();
    setGreet(
      h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening",
    );
  }, []);
  useEffect(() => {
    if (!state.session?.apiToken) return;
    let active = true;
    apiRequest<{ data: ApiDocument[] }>(
      state.session,
      "/api/v1/documents?owner_type=CITIZEN",
    )
      .then(
        (result) =>
          active &&
          setDocuments(
            result.data.filter((doc) => doc.status !== "REVOKED").slice(0, 5),
          ),
      )
      .catch(() => active && setDocuments([]));
    return () => {
      active = false;
    };
  }, [state.session?.apiToken, state.session?.apiUserId]);
  const mine = state.applications;
  const action = mine.filter(
    (a) =>
      a.status === "Verification Required" ||
      a.status === "Additional Evidence Required" ||
      a.status === "Draft",
  );
  const inProgress = mine.filter(
    (a) => !["Draft", "Approved", "Rejected"].includes(a.status),
  ).length;
  const received = state.benefits.filter((benefit) =>
    ["Disbursed", "Completed"].includes(benefit.status),
  ).length;
  const docsOk = documents.filter(
    (d) => d.verification_status === "VERIFIED",
  ).length;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-navy">
          {greet}, {state.session?.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          {state.session?.isDemo
            ? "Demo account · Synthetic records"
            : "Your Mira account"}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Panel>
          <p className="text-sm text-muted-foreground">
            Applications in progress
          </p>
          <p className="mt-1 text-xl font-semibold">{inProgress}</p>
          <Link
            to="/citizen/applications"
            className="mt-3 inline-block text-xs text-gov hover:underline"
          >
            View applications
          </Link>
        </Panel>
        <Panel>
          <p className="text-sm text-muted-foreground">Benefits received</p>
          <p className="mt-1 text-xl font-semibold">{received}</p>
          <Link
            to="/citizen/benefits"
            className="mt-3 inline-block text-xs text-gov hover:underline"
          >
            View benefit history
          </Link>
        </Panel>
        <Panel>
          <p className="text-sm text-muted-foreground">Verified documents</p>
          <p className="mt-1 text-xl font-semibold">{docsOk}</p>
          <Progress
            value={documents.length ? (docsOk / documents.length) * 100 : 0}
            className="mt-2"
          />
          <Link
            to="/citizen/documents"
            search={{ upload: false }}
            className="mt-2 inline-block text-xs text-gov hover:underline"
          >
            Review documents
          </Link>
        </Panel>
      </div>
      {action.length > 0 && (
        <Panel title={`Needs your attention (${action.length})`}>
          <ul className="divide-y">
            {action.map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-2 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium">
                    {getScheme(a.schemeId)?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {a.id} · updated {fmtDate(a.updatedOn)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge s={a.status} />
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/citizen/applications/$id" params={{ id: a.id }}>
                      Open
                    </Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      )}
      <Panel
        title="My Documents"
        actions={
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                void navigate({
                  to: "/citizen/documents",
                  search: { upload: true },
                })
              }
            >
              Upload document
            </Button>
            <Button size="sm" variant="ghost" asChild>
              <Link to="/citizen/documents" search={{ upload: false }}>
                View all documents
              </Link>
            </Button>
          </div>
        }
      >
        {documents.length === 0 ? (
          <div className="py-4 text-sm text-muted-foreground">
            No documents uploaded yet. Upload files to reuse them across
            applications.
          </div>
        ) : (
          <ul className="divide-y">
            {documents.slice(0, 4).map((doc) => (
              <li
                key={doc.id}
                className="flex flex-wrap items-center justify-between gap-2 py-3"
              >
                <button
                  onClick={() => setPreviewDoc(doc)}
                  className="min-w-0 text-left"
                >
                  <span className="block truncate text-sm font-medium text-slate-900">
                    {doc.original_filename}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatBytes(doc.size_bytes)} ·{" "}
                    {new Date(doc.created_at).toLocaleDateString("en-IN")}
                  </span>
                </button>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${doc.verification_status === "VERIFIED" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`}
                >
                  {doc.verification_status === "VERIFIED"
                    ? "Verified"
                    : doc.verification_status === "REJECTED"
                      ? "Rejected"
                      : "Review required"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <div>
        <h2 className="mb-3 font-semibold text-navy">Services</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {ACTIONS.map((a) => (
            <Link
              key={a.label}
              to={a.to}
              className="group flex flex-col gap-2 rounded-lg border bg-card p-4 hover:border-gov"
            >
              <a.icon className="h-5 w-5 text-gov" />
              <span className="flex items-center justify-between text-sm font-medium">
                {a.label}
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-gov" />
              </span>
            </Link>
          ))}
        </div>
      </div>
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
