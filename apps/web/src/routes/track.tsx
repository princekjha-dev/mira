import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowRight, RefreshCw, Search } from "lucide-react";
import { useApp } from "@/lib/app-state";
import { fetchApplications } from "@/lib/api";
import { fmtDate, getScheme, type Application } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Empty,
  ErrorState,
  LoadingState,
  PageContainer,
  PageHeader,
  Panel,
  StatusBadge,
  Timeline,
} from "@/components/gov/ui";

export const Route = createFileRoute("/track")({
  validateSearch: (search: Record<string, unknown>): { id?: string } => ({
    id: typeof search.id === "string" ? search.id : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Track your application — Mira" },
      {
        name: "description",
        content:
          "See the current status of your welfare applications and what happens next.",
      },
      { property: "og:title", content: "Track your application — Mira" },
    ],
  }),
  component: Track,
});

import { MiraCard } from "@/components/mira/MiraPrimitives";

function referenceMatches(app: Application, query: string) {
  const extended = app as Application & { rawId?: string };
  return [app.id, extended.rawId].some(
    (value) => value?.toUpperCase() === query,
  );
}

function nextStep(app: Application) {
  if (app.status === "Approved")
    return "Your decision is ready. Open the application for details.";
  if (app.status === "Rejected")
    return "Open the application to review the decision and available next steps.";
  if (
    app.status === "Verification Required" ||
    app.status === "Additional Evidence Required"
  )
    return "Please review the request and provide any missing information.";
  if (
    app.status === "Documents Under Review" ||
    app.status === "Officer Review"
  )
    return "Your application is being reviewed. Mira will show an update when the stage changes.";
  return "Your application has been received and is moving through the review process.";
}

function ApplicationTrackCard({ app }: { app: Application }) {
  const extended = app as Application & { schemeName?: string };
  const schemeName =
    getScheme(app.schemeId)?.name || extended.schemeName || "Application";
  return (
    <MiraCard variant="elevated" className="p-5 sm:p-6 transition-all">
      <div className="flex flex-col gap-3 border-b border-border/60 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
            {schemeName}
          </h2>
          <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
            {app.id}
          </p>
        </div>
        <StatusBadge s={app.status} />
      </div>
      <dl className="grid gap-3 py-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-xs text-muted-foreground">Submitted</dt>
          <dd className="mt-1 font-medium text-foreground">{fmtDate(app.appliedOn)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Last updated</dt>
          <dd className="mt-1 font-medium text-foreground">{fmtDate(app.updatedOn)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Next step</dt>
          <dd className="mt-1 leading-5 text-foreground">{nextStep(app)}</dd>
        </div>
      </dl>
      <div className="border-t border-border/60 pt-4">
        <h3 className="mb-3 text-sm font-semibold tracking-tight text-foreground">
          Application progress
        </h3>
        <Timeline app={app} />
      </div>
      <div className="mt-4 border-t border-border/60 pt-3">
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0 text-primary font-medium group"
          asChild
        >
          <Link
            to="/citizen/applications/$id"
            params={{
              id: (app as Application & { rawId?: string }).rawId || app.id,
            }}
          >
            View application details
            <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </div>
    </MiraCard>
  );
}

function Track() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate({ from: "/track" });
  const { state } = useApp();
  const session = state.session;
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [id, setId] = useState(searchParams.id || "");
  const [submittedId, setSubmittedId] = useState(
    searchParams.id?.trim().toUpperCase() || "",
  );
  const [formatError, setFormatError] = useState("");
  useEffect(() => {
    if (searchParams.id) {
      setId(searchParams.id);
      setSubmittedId(searchParams.id.trim().toUpperCase());
    }
  }, [searchParams.id]);

  const refresh = useCallback(async () => {
    if (!session?.apiToken && !session?.isDemo) {
      setApplications([]);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      setApplications(await fetchApplications(session));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [session]);
  useEffect(() => {
    void refresh();
  }, [refresh]);

  const displayedApps = session?.apiToken || session?.isDemo ? applications : [];
  const submittedApps = useMemo(
    () => displayedApps.filter((app) => app.status !== "Draft"),
    [displayedApps],
  );
  const searched = submittedId
    ? submittedApps.find((app) => referenceMatches(app, submittedId))
    : null;
  const search = (event: React.FormEvent) => {
    event.preventDefault();
    const value = id.trim().toUpperCase();
    if (!/^(APP-[A-Z0-9-]{6,}|[A-F0-9-]{16,})$/.test(value)) {
      setFormatError(
        "Enter the application reference from your acknowledgement.",
      );
      setSubmittedId("");
      return;
    }
    setFormatError("");
    setSubmittedId(value);
    void navigate({ search: { id: value || undefined } });
  };

  return (
    <PageContainer className="max-w-5xl">
      <PageHeader
        eyebrow="APPLICATION STATUS"
        title="Track your application"
        desc="See the current status of your welfare applications and what happens next."
      />
      <MiraCard variant="elevated" className="mb-7 p-6">
        <form onSubmit={search} role="search" noValidate>
          <Label
            htmlFor="application-reference"
            className="text-sm font-medium text-foreground"
          >
            Search by application reference
          </Label>
          <p className="mt-1 text-xs text-muted-foreground">
            Use the reference shown on your submission acknowledgement.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Input
              id="application-reference"
              value={id}
              onChange={(event) => {
                setId(event.target.value);
                setFormatError("");
              }}
              placeholder="e.g. APP-2026-000318"
              aria-invalid={!!formatError}
              aria-describedby={
                formatError ? "track-reference-error" : undefined
              }
              className="h-10"
            />
            <Button type="submit" className="sm:min-w-36 h-10 tactile-btn">
              <Search className="h-4 w-4 mr-1.5" />
              Track application
            </Button>
          </div>
          {formatError && (
            <p
              id="track-reference-error"
              className="mt-2 text-xs text-destructive"
              role="alert"
            >
              {formatError}
            </p>
          )}
        </form>
      </MiraCard>

      {submittedId && !loading && !error && !searched && (
        <div className="mb-6">
          <Empty
            title="No application found"
            body="Check the reference on your acknowledgement and try again."
          />
        </div>
      )}
      {searched && (
        <div className="mb-7">
          <ApplicationTrackCard app={searched} />
        </div>
      )}

      {session?.apiToken && (
        <section aria-labelledby="your-applications-heading">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2
                id="your-applications-heading"
                className="text-lg font-semibold tracking-tight text-slate-950"
              >
                Your applications
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Applications associated with your signed-in account.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void refresh()}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
          {loading && applications.length === 0 ? (
            <LoadingState label="Loading your applications…" />
          ) : error ? (
            <ErrorState onRetry={() => void refresh()} />
          ) : submittedApps.length === 0 ? (
            <Empty
              title="No applications found"
              body="Applications you submit through Mira will appear here."
              action={
                <Button asChild>
                  <Link to="/schemes">Explore schemes</Link>
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {submittedApps.map((app) => (
                <ApplicationTrackCard
                  key={
                    (app as Application & { rawId?: string }).rawId || app.id
                  }
                  app={app}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </PageContainer>
  );
}
