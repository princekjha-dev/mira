import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/lib/app-state";
import { CITIZEN, MEMBERS, getScheme, fmtDate } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Empty, PageHeader, Panel, Pill, StatusBadge } from "@/components/gov/ui";

export const Route = createFileRoute("/officer/citizens/$id")({
  head: ({ params }) => ({ meta: [{ title: `Citizen ${params.id} — Officer` }, { name: "description", content: "Citizen record view for authorised officers." }, { property: "og:title", content: `Citizen ${params.id}` }, { property: "og:description", content: "Citizen record." }] }),
  component: Citizen,
});

function Citizen() {
  const { id } = Route.useParams();
  const { state } = useApp();
  const m = MEMBERS.find((x) => x.id === id);
  if (!m) return <Empty title={`No citizen record for ${id}`} body="Demo records: C-1001 to C-1005." action={<Button asChild><Link to="/officer/citizens/$id" params={{ id: "C-1001" }}>Open C-1001</Link></Button>} />;
  const apps = state.applications.filter((a) => a.citizenId === id);
  return (
    <div className="space-y-4">
      <PageHeader title={m.name} desc={`Citizen ID ${m.id} · Access logged for audit`} crumbs={[{ label: "Citizen Records" }, { label: m.id }]} />
      <Panel title="Identity and registration"><dl className="grid gap-3 text-sm sm:grid-cols-3">
        <div><dt className="text-xs text-muted-foreground">Date of birth</dt><dd>{fmtDate(m.dob)}</dd></div><div><dt className="text-xs text-muted-foreground">Gender</dt><dd>{m.gender}</dd></div><div><dt className="text-xs text-muted-foreground">Identity</dt><dd><Pill t={m.identity === "Verified" ? "ok" : "warn"}>{m.identity}</Pill></dd></div>
        <div><dt className="text-xs text-muted-foreground">Household</dt><dd><Link to="/officer/families/$id" params={{ id: CITIZEN.householdId }} className="font-mono text-gov hover:underline">{CITIZEN.householdId}</Link></dd></div><div><dt className="text-xs text-muted-foreground">Relationship</dt><dd>{m.relationship}</dd></div><div><dt className="text-xs text-muted-foreground">Membership</dt><dd>{m.membership}</dd></div>
      </dl></Panel>
      <Panel title="Record history"><ul className="space-y-2">{m.history.map((h, i) => <li key={i} className="border-l-2 pl-3 text-sm">{h.event}<span className="block text-xs text-muted-foreground">{fmtDate(h.date)}</span></li>)}</ul></Panel>
      <Panel title="Applications">{apps.length ? <ul className="divide-y">{apps.map((a) => <li key={a.id} className="flex items-center justify-between py-2 text-sm"><span>{a.id} · {getScheme(a.schemeId)?.name}</span><span className="flex items-center gap-2"><StatusBadge s={a.status} /><Button size="sm" variant="outline" asChild><Link to="/officer/applications/$id" params={{ id: a.id }}>Open</Link></Button></span></li>)}</ul> : <p className="text-sm text-muted-foreground">No applications.</p>}</Panel>
    </div>
  );
}
