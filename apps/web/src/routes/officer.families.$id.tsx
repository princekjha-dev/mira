import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useApp } from "@/lib/app-state";
import { BENEFITS, HOUSEHOLD, MEMBERS, fmtDate } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Empty, PageHeader, Panel, Pill } from "@/components/gov/ui";

export const Route = createFileRoute("/officer/families/$id")({
  head: ({ params }) => ({ meta: [{ title: `Household ${params.id} — Officer` }, { name: "description", content: "Household record, members, history and pending changes." }, { property: "og:title", content: `Household ${params.id}` }, { property: "og:description", content: "Household record." }] }),
  component: Fam,
});

function Fam() {
  const { id } = Route.useParams();
  const { state, set, addAudit } = useApp();
  if (id !== HOUSEHOLD.id) return <Empty title={`No household record for ${id}`} action={<Button asChild><Link to="/officer/families/$id" params={{ id: HOUSEHOLD.id }}>Open {HOUSEHOLD.id}</Link></Button>} />;
  const act = (rid: string, status: "Verified" | "Returned") => {
    set((s) => ({ familyRequests: s.familyRequests.map((r) => (r.id === rid ? { ...r, status } : r)) }));
    addAudit({ actor: `${state.session?.name} (${state.session?.id})`, action: status === "Verified" ? "Record verified" : "Family update returned", application: rid, prev: "Pending verification", next: status, reason: "Officer review of family update" });
    toast.success(`Request ${status === "Verified" ? "verified" : "returned to citizen"}`);
  };
  return (
    <div className="space-y-4">
      <PageHeader title={`Household ${HOUSEHOLD.id}`} desc={HOUSEHOLD.address} crumbs={[{ label: "Family Records" }, { label: HOUSEHOLD.id }]} />
      <Panel title="Overview"><dl className="grid gap-3 text-sm sm:grid-cols-3"><div><dt className="text-xs text-muted-foreground">Status</dt><dd><Pill t="ok">{HOUSEHOLD.status}</Pill></dd></div><div><dt className="text-xs text-muted-foreground">BPL</dt><dd>{HOUSEHOLD.bpl}</dd></div><div><dt className="text-xs text-muted-foreground">Registered</dt><dd>{fmtDate(HOUSEHOLD.registeredOn)}</dd></div><div className="sm:col-span-3"><dt className="text-xs text-muted-foreground">Property</dt><dd>{HOUSEHOLD.property}</dd></div></dl></Panel>
      <Panel title="Members and relationship history">
        <ul className="divide-y">{MEMBERS.map((m) => <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm"><Link to="/officer/citizens/$id" params={{ id: m.id }} className="text-gov hover:underline">{m.name}</Link><span className="text-muted-foreground">{m.relationship}</span><span className="text-xs text-muted-foreground">{m.history.at(-1)?.event}</span><Pill t={m.membership === "Active" ? "info" : "neutral"}>{m.membership}</Pill></li>)}</ul>
      </Panel>
      <Panel title="Household benefits"><ul className="space-y-1 text-sm">{BENEFITS.map((b) => <li key={b.ref} className="flex justify-between"><span>{b.scheme} · {b.beneficiary}</span><Pill t={b.type === "Household" ? "teal" : "info"}>{b.type}</Pill></li>)}</ul></Panel>
      <Panel title="Pending family updates">
        <ul className="divide-y">{state.familyRequests.map((r) => <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm"><div><p className="font-medium">{r.type}</p><p className="text-xs text-muted-foreground">{r.id} · {r.details}</p></div>
          {r.status === "Pending verification" ? <div className="flex gap-2"><Button size="sm" onClick={() => act(r.id, "Verified")}>Verify</Button><Button size="sm" variant="outline" onClick={() => act(r.id, "Returned")}>Return</Button></div> : <Pill t={r.status === "Verified" ? "ok" : "warn"}>{r.status}</Pill>}</li>)}</ul>
      </Panel>
    </div>
  );
}
