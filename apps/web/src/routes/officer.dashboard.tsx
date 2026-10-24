import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/lib/app-state";
import { getScheme, fmtDate } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel, Pill, StatusBadge } from "@/components/gov/ui";

export const Route = createFileRoute("/officer/dashboard")({
  head: () => ({
    meta: [
      { title: "Officer Dashboard" },
      {
        name: "description",
        content: "Pending applications, verification and duplicate alerts.",
      },
      { property: "og:title", content: "Officer Dashboard" },
      { property: "og:description", content: "Officer workload overview." },
    ],
  }),
  component: OD,
});

function OD() {
  const { state } = useApp();
  const A = state.applications.filter((a) => a.status !== "Draft");
  const today = new Date().toISOString().slice(0, 10);
  const cards = [
    {
      label: "Applications Pending",
      n: A.filter((a) => !["Approved", "Rejected"].includes(a.status)).length,
      to: "/officer/applications",
    },
    {
      label: "Verification Required",
      n: A.filter((a) => a.status === "Verification Required").length,
      to: "/officer/verification",
    },
    {
      label: "Duplicate Alerts",
      n: state.alerts.filter((a) => a.status === "Open").length,
      to: "/officer/duplicates",
    },
    {
      label: "Evidence Requested",
      n: A.filter((a) => a.status === "Additional Evidence Required").length,
      to: "/officer/applications",
    },
    {
      label: "Approved Today",
      n: A.filter((a) => a.status === "Approved" && a.updatedOn === today)
        .length,
      to: "/officer/applications",
    },
  ] as const;
  const queue = A.filter((a) =>
    [
      "Officer Review",
      "Verification Required",
      "Documents Under Review",
    ].includes(a.status),
  );
  return (
    <div>
      <PageHeader
        title={`Welcome, ${state.session?.name}`}
        desc={`${state.session?.department} · Block Office, Sadar`}
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="rounded-lg border bg-card p-4 hover:border-gov"
          >
            <p className="text-xs text-muted-foreground">{c.label}</p>
            <p className="mt-1 text-2xl font-semibold text-navy">{c.n}</p>
          </Link>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Panel
          title="Awaiting your action"
          actions={
            <Button size="sm" variant="ghost" asChild>
              <Link to="/officer/applications">View all</Link>
            </Button>
          }
        >
          <ul className="divide-y">
            {queue.map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-2 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium">
                    {a.applicant} — {getScheme(a.schemeId)?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {a.id} · received {fmtDate(a.appliedOn)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge s={a.status} />
                  <Button size="sm" asChild>
                    <Link to="/officer/applications/$id" params={{ id: a.id }}>
                      Review
                    </Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Open duplicate alerts">
          <ul className="space-y-3">
            {state.alerts
              .filter((d) => d.status === "Open")
              .map((d) => (
                <li key={d.id} className="rounded-md border p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="font-mono text-xs">{d.id}</span>
                    <Pill t={d.severity === "High" ? "bad" : "warn"}>
                      {d.severity}
                    </Pill>
                  </div>
                  <p className="mt-1">
                    {d.applicant} · {d.scheme}
                  </p>
                  <Link
                    to="/officer/duplicates"
                    className="text-xs text-gov hover:underline"
                  >
                    Open comparison
                  </Link>
                </li>
              ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
