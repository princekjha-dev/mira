import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-state";
import type { DuplicateAlert } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageHeader, Panel, Pill } from "@/components/gov/ui";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/officer/duplicates")({
  head: () => ({ meta: [{ title: "Duplicate Alerts — Officer" }, { name: "description", content: "Compare current applications against existing benefit records." }, { property: "og:title", content: "Duplicate Alerts" }, { property: "og:description", content: "Possible duplicate household claims." }] }),
  component: Dups,
});

type Act = "Not Duplicate" | "Evidence Requested" | "Confirmed Duplicate" | "Escalated";
function Dups() {
  const { state, set, addAudit, updateApp } = useApp();
  const [sel, setSel] = useState(state.alerts[0]?.id);
  const [act, setAct] = useState<Act | null>(null);
  const [note, setNote] = useState("");
  const d = state.alerts.find((x) => x.id === sel);
  const apply = () => {
    if (!d || !act) return;
    if (note.trim().length < 10) { toast.error("Please add a note of at least 10 characters"); return; }
    set((s) => ({ alerts: s.alerts.map((x) => (x.id === d.id ? { ...x, status: act } : x)) }));
    addAudit({ actor: `${state.session?.name} (${state.session?.id})`, action: `Duplicate alert: ${act}`, application: d.appId, prev: d.status, next: act, reason: note });
    if (act === "Not Duplicate") updateApp(d.appId, { status: "Officer Review", duplicate: false, stage: 4 }, `Duplicate alert cleared: ${note}`, state.session?.name);
    if (act === "Evidence Requested") updateApp(d.appId, { status: "Additional Evidence Required" }, `Evidence requested on duplicate alert: ${note}`, state.session?.name);
    if (act === "Confirmed Duplicate") updateApp(d.appId, { status: "Officer Review" }, `Duplicate confirmed — pending final decision: ${note}`, state.session?.name);
    if (act === "Escalated") updateApp(d.appId, {}, `Duplicate alert escalated: ${note}`, state.session?.name);
    toast.success(`Alert marked: ${act}`, { description: act === "Confirmed Duplicate" ? "The application is not auto-rejected. Record your final decision on the review page." : "Recorded in audit trail." });
    setAct(null); setNote("");
  };
  const sev = (x: DuplicateAlert) => (x.severity === "High" ? "bad" : x.severity === "Medium" ? "warn" : "neutral");
  return (
    <div>
      <PageHeader title="Duplicate Alerts" desc="Possible matches with existing benefits. Alerts never reject an application automatically — you decide." />
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <ul className="space-y-2">{state.alerts.map((x) => (
          <li key={x.id}><button onClick={() => setSel(x.id)} className={cn("w-full rounded-lg border bg-card p-3 text-left text-sm", sel === x.id && "border-gov ring-1 ring-gov")}>
            <div className="flex justify-between"><span className="font-mono text-xs">{x.id}</span><Pill t={sev(x)}>{x.severity}</Pill></div><p className="mt-1 font-medium">{x.applicant}</p><p className="text-xs text-muted-foreground">{x.scheme}</p><Pill className="mt-2">{x.status}</Pill>
          </button></li>
        ))}</ul>
        {d && (
          <div className="space-y-4">
            <Panel title={`${d.id} — ${d.scheme}`} actions={<Link to="/officer/applications/$id" params={{ id: d.appId }} className="text-xs text-gov hover:underline">Open application {d.appId}</Link>}>
              <dl className="grid gap-3 text-sm sm:grid-cols-2"><div><dt className="text-xs text-muted-foreground">Applicant</dt><dd>{d.applicant}</dd></div><div><dt className="text-xs text-muted-foreground">Household</dt><dd className="font-mono">{d.household}</dd></div><div className="sm:col-span-2"><dt className="text-xs text-muted-foreground">Potential matching benefit</dt><dd>{d.match}</dd></div><div className="sm:col-span-2"><dt className="text-xs text-muted-foreground">Reason for match</dt><dd>{d.reason}</dd></div><div className="sm:col-span-2"><dt className="text-xs text-muted-foreground">Evidence sources</dt><dd className="flex flex-wrap gap-1">{d.sources.map((s) => <Pill key={s}>{s}</Pill>)}</dd></div></dl>
            </Panel>
            <Panel title="Comparison: Current Application vs Existing Record">
              <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="text-left text-xs text-muted-foreground"><tr><th className="p-2">Field</th><th className="p-2">Current Application</th><th className="p-2">Existing Record</th><th className="p-2">Match</th></tr></thead>
                <tbody>{d.compare.map((c) => <tr key={c.field} className={cn("border-t", c.same && "bg-warning/5")}><td className="p-2 font-medium">{c.field}</td><td className="p-2">{c.current}</td><td className="p-2">{c.existing}</td><td className="p-2">{c.same ? <Pill t="warn">Same</Pill> : <Pill>Different</Pill>}</td></tr>)}</tbody></table></div>
            </Panel>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setAct("Not Duplicate")}>Mark as Not Duplicate</Button>
              <Button variant="outline" onClick={() => setAct("Evidence Requested")}>Request Evidence</Button>
              <Button variant="destructive" onClick={() => setAct("Confirmed Duplicate")}>Confirm Duplicate</Button>
              <Button variant="outline" onClick={() => setAct("Escalated")}>Escalate</Button>
            </div>
          </div>
        )}
      </div>
      <Dialog open={!!act} onOpenChange={(o) => !o && setAct(null)}>
        <DialogContent><DialogHeader><DialogTitle>{act}</DialogTitle><DialogDescription>Your note and officer ID will be recorded in the audit trail.</DialogDescription></DialogHeader>
          <Label htmlFor="dn">Officer note</Label><Textarea id="dn" rows={4} value={note} onChange={(e) => setNote(e.target.value)} />
          <DialogFooter><Button variant="outline" onClick={() => setAct(null)}>Cancel</Button><Button onClick={apply}>Confirm</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
