import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Clock3, Scale, Waves, FlaskConical } from "lucide-react";
import { useApp } from "@/lib/app-state";
import { SCHEMES } from "@/lib/data";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageHeader, Panel, Pill } from "@/components/gov/ui";

export const Route = createFileRoute("/department/dashboard")({
  head: () => ({ meta: [{ title: "Department Portal — Dashboard" }, { name: "description", content: "Scheme administration, rules, integrations and audit." }, { property: "og:title", content: "Department Portal" }, { property: "og:description", content: "Department administration dashboard." }] }),
  component: DD,
});

const FUTURE = [
  { icon: Clock3, name: "Entitlement Time Machine", text: "Reconstruct what a household was entitled to on any past date, using the rule version in force at that time." },
  { icon: Scale, name: "Fair Decision Guardian", text: "Review officer decisions for consistency across similar cases and flag outliers for supervisory review." },
  { icon: Waves, name: "Decision Ripple Engine", text: "Show which other benefits are affected when a family record changes (e.g. a household split or death record)." },
  { icon: FlaskConical, name: "Policy Crash-Test Lab", text: "Simulate a proposed rule change against anonymised records before publishing a new rule version." },
];

function DD() {
  const { state } = useApp();
  const [f, setF] = useState<(typeof FUTURE)[number] | null>(null);
  const cards = [
    { l: "Active schemes", n: SCHEMES.length, to: "/department/schemes" },
    { l: "Rule versions", n: state.ruleVersions.length, to: "/department/rules" },
    { l: "Open duplicate alerts", n: state.alerts.filter((a) => a.status === "Open").length, to: "/department/reports" },
    { l: "Audit events", n: state.audit.length, to: "/department/audit" },
  ] as const;
  return (
    <div className="space-y-6">
      <PageHeader title="Department Portal" desc={state.session?.department} />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{cards.map((c) => <Link key={c.l} to={c.to} className="rounded-lg border bg-card p-4 hover:border-gov"><p className="text-xs text-muted-foreground">{c.l}</p><p className="mt-1 text-2xl font-semibold text-navy">{c.n}</p></Link>)}</div>
      <Panel title="Latest rule changes"><ul className="divide-y">{[...state.ruleVersions].reverse().slice(0, 4).map((r) => <li key={r.version + r.schemeId} className="flex flex-wrap justify-between gap-2 py-2 text-sm"><span><span className="font-mono">{r.version}</span> · {SCHEMES.find((s) => s.id === r.schemeId)?.name}</span><span className="text-muted-foreground">{r.reason} · effective {r.effective}</span></li>)}</ul></Panel>
      <Panel title="Planned analytics capabilities">
        <div className="grid gap-3 md:grid-cols-2">{FUTURE.map((x) => (
          <button key={x.name} onClick={() => setF(x)} className="flex gap-3 rounded-md border border-dashed p-3 text-left hover:border-gov"><x.icon className="h-5 w-5 shrink-0 text-muted-foreground" /><span><span className="flex items-center gap-2 text-sm font-medium">{x.name}<Pill>Planned</Pill></span><span className="text-xs text-muted-foreground">{x.text}</span></span></button>
        ))}</div>
      </Panel>
      <Dialog open={!!f} onOpenChange={(o) => !o && setF(null)}>
        <DialogContent><DialogHeader><DialogTitle>{f?.name}</DialogTitle><DialogDescription>Planned module — not active in this prototype.</DialogDescription></DialogHeader><p className="text-sm">{f?.text}</p><p className="text-sm text-muted-foreground">The platform already records versioned rules, household lineage and an append-only audit trail, which this module will build on.</p></DialogContent>
      </Dialog>
    </div>
  );
}
