import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Baby, Heart, HeartCrack, History, Home, Split, UserPlus, UserX, Wrench } from "lucide-react";
import { toast } from "sonner";
import { nowStamp, useApp } from "@/lib/app-state";
import { HOUSEHOLD, MEMBERS, fmtDate } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, Panel, Pill } from "@/components/gov/ui";

export const Route = createFileRoute("/citizen/family")({
  head: () => ({ meta: [{ title: "My Family Record — Citizen" }, { name: "description", content: "Household overview, members, relationships and lifecycle events." }, { property: "og:title", content: "My Family Record" }, { property: "og:description", content: "Your verified household record." }] }),
  component: Family,
});

const EVENTS = [
  { k: "Add Family Member", icon: UserPlus, fields: ["Full name", "Relationship", "Date of birth"] },
  { k: "Request Relationship Correction", icon: Wrench, fields: ["Member name", "Correct relationship / detail"] },
  { k: "Report Marriage", icon: Heart, fields: ["Spouse name", "Date of marriage", "Marriage registration no."] },
  { k: "Report Separation", icon: HeartCrack, fields: ["Member name", "Date of separation"] },
  { k: "Report Birth", icon: Baby, fields: ["Child name", "Date of birth", "Birth certificate no."] },
  { k: "Report Death", icon: UserX, fields: ["Member name", "Date of death", "Death certificate no."] },
  { k: "Request Household Split", icon: Split, fields: ["Members moving", "New address"] },
];

function Family() {
  const { state, set, addAudit } = useApp();
  const [ev, setEv] = useState<(typeof EVENTS)[number] | null>(null);
  const [vals, setVals] = useState<Record<string, string>>({});
  const [note, setNote] = useState("");
  const [hist, setHist] = useState<string | null>(null);
  const active = MEMBERS.filter((m) => m.membership === "Active");
  const past = MEMBERS.filter((m) => m.membership !== "Active");

  const submit = () => {
    if (!ev) return;
    const missing = ev.fields.filter((f) => !vals[f]?.trim());
    if (missing.length) { toast.error(`Please fill: ${missing.join(", ")}`); return; }
    const id = `FR-2026-${String(42 + state.familyRequests.length).padStart(4, "0")}`;
    set((s) => ({ familyRequests: [{ id, type: ev.k, details: ev.fields.map((f) => `${f}: ${vals[f]}`).join("; ") + (note ? ` — ${note}` : ""), date: nowStamp().slice(0, 10), status: "Pending verification" }, ...s.familyRequests] }));
    addAudit({ actor: `${state.session?.name} (${state.session?.id})`, action: `Family update requested: ${ev.k}`, application: HOUSEHOLD.id, prev: "Verified record", next: "Pending verification", reason: id });
    toast.success("Request submitted for verification", { description: `${id}. Your verified record stays unchanged until an officer approves.` });
    setEv(null); setVals({}); setNote("");
  };

  const memberRow = (m: (typeof MEMBERS)[number]) => (
    <li key={m.id} className="grid gap-2 p-4 sm:grid-cols-[1.4fr_1fr_1fr_auto] sm:items-center">
      <div><p className="font-medium">{m.name}</p><p className="text-xs text-muted-foreground">{m.relationship} · DOB {fmtDate(m.dob)} · {m.id}</p>{m.income && <p className="text-xs text-muted-foreground">Income: {m.income}</p>}</div>
      <div className="flex flex-wrap gap-1"><Pill t={m.identity === "Verified" ? "ok" : "warn"}>ID: {m.identity}</Pill><Pill t={m.membership === "Active" ? "info" : "neutral"}>{m.membership === "Active" ? "Active member" : m.membership}</Pill></div>
      <div className="text-xs">{m.benefits.length ? m.benefits.map((b) => <p key={b}>{b}</p>) : <span className="text-muted-foreground">No benefits</span>}</div>
      <Button size="sm" variant="ghost" onClick={() => setHist(m.id)}><History className="mr-1 h-3.5 w-3.5" />History</Button>
    </li>
  );
  const hm = MEMBERS.find((m) => m.id === hist);

  return (
    <div className="space-y-6">
      <PageHeader title="My Family Record" desc="Changes to verified information are sent for officer verification. Previous relationships are kept as history and are never deleted." />
      <Panel title="Family Overview">
        <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div><dt className="text-xs text-muted-foreground">Household ID</dt><dd className="font-mono">{HOUSEHOLD.id}</dd></div>
          <div><dt className="text-xs text-muted-foreground">Household status</dt><dd><Pill t="ok">{HOUSEHOLD.status}</Pill></dd></div>
          <div><dt className="text-xs text-muted-foreground">BPL category</dt><dd>{HOUSEHOLD.bpl}</dd></div>
          <div><dt className="text-xs text-muted-foreground">Income category</dt><dd>{HOUSEHOLD.income}</dd></div>
          <div className="sm:col-span-2"><dt className="text-xs text-muted-foreground">Current address</dt><dd className="flex gap-1"><Home className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />{HOUSEHOLD.address}</dd></div>
          <div className="sm:col-span-2 lg:col-span-3"><dt className="text-xs text-muted-foreground">Property summary</dt><dd>{HOUSEHOLD.property}</dd></div>
        </dl>
      </Panel>
      <Panel title="Report a life event or change">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {EVENTS.map((e) => <button key={e.k} onClick={() => setEv(e)} className="flex flex-col items-center gap-1.5 rounded-md border p-3 text-center text-xs hover:border-gov hover:bg-secondary/40"><e.icon className="h-5 w-5 text-gov" />{e.k}</button>)}
        </div>
      </Panel>
      <Tabs defaultValue="current">
        <TabsList><TabsTrigger value="current">Current members ({active.length})</TabsTrigger><TabsTrigger value="history">Former / historical ({past.length})</TabsTrigger><TabsTrigger value="requests">Requests ({state.familyRequests.length})</TabsTrigger></TabsList>
        <TabsContent value="current"><ul className="divide-y rounded-lg border bg-card">{active.map(memberRow)}</ul></TabsContent>
        <TabsContent value="history"><ul className="divide-y rounded-lg border bg-card">{past.map(memberRow)}</ul><p className="mt-2 text-xs text-muted-foreground">Historical records are kept so earlier household benefits can be correctly attributed.</p></TabsContent>
        <TabsContent value="requests">
          <ul className="divide-y rounded-lg border bg-card">{state.familyRequests.map((r) => <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 p-4 text-sm"><div><p className="font-medium">{r.type}</p><p className="text-xs text-muted-foreground">{r.id} · {fmtDate(r.date)} · {r.details}</p></div><Pill t={r.status === "Verified" ? "ok" : "warn"}>{r.status}</Pill></li>)}</ul>
        </TabsContent>
      </Tabs>

      <Dialog open={!!ev} onOpenChange={(o) => !o && setEv(null)}>
        <DialogContent><DialogHeader><DialogTitle>{ev?.k}</DialogTitle><DialogDescription>This request will be verified by an officer before your record changes.</DialogDescription></DialogHeader>
          <div className="space-y-3">{ev?.fields.map((f) => <div key={f}><Label htmlFor={f}>{f}</Label><Input id={f} type={f.startsWith("Date") ? "date" : "text"} value={vals[f] ?? ""} onChange={(e) => setVals({ ...vals, [f]: e.target.value })} className="mt-1" /></div>)}
            <div><Label htmlFor="note">Additional information (optional)</Label><Textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} className="mt-1" /></div></div>
          <DialogFooter><Button variant="outline" onClick={() => setEv(null)}>Cancel</Button><Button onClick={submit}>Submit for verification</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={!!hm} onOpenChange={(o) => !o && setHist(null)}>
        <DialogContent><DialogHeader><DialogTitle>Record history — {hm?.name}</DialogTitle></DialogHeader>
          <ul className="space-y-2">{hm?.history.map((h, i) => <li key={i} className="border-l-2 pl-3 text-sm"><p>{h.event}</p><p className="text-xs text-muted-foreground">{fmtDate(h.date)}</p></li>)}</ul>
        </DialogContent>
      </Dialog>
    </div>
  );
}
