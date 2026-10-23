import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import { nowStamp, useApp, type RuleCondition } from "@/lib/app-state";
import { SCHEMES } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Empty, PageHeader, Panel } from "@/components/gov/ui";

export const Route = createFileRoute("/department/rules")({
  validateSearch: (s: Record<string, unknown>): { scheme?: string } => ({ scheme: typeof s.scheme === "string" ? s.scheme : undefined }),
  head: () => ({ meta: [{ title: "Eligibility Rules — Department" }, { name: "description", content: "Visual, versioned eligibility rule builder." }, { property: "og:title", content: "Eligibility Rules" }, { property: "og:description", content: "Scheme rule builder." }] }),
  component: Rules,
});

const FIELDS = ["Household income", "Applicant age", "BPL status", "Property condition", "Land holding (ha)", "Gender", "Previous benefit", "State of residence"];
const OPS = ["<", "<=", "=", ">=", ">", "NOT received"];

function Rules() {
  const { scheme } = Route.useSearch();
  const nav = useNavigate({ from: "/department/rules" });
  const sid = scheme ?? "rural-housing";
  const { state, set, addAudit } = useApp();
  const versions = state.ruleVersions.filter((r) => r.schemeId === sid);
  const latest = versions.at(-1);
  const [conds, setConds] = useState<RuleCondition[]>(latest?.conditions ?? [{ field: "Household income", op: "<", value: "" }]);
  const [eff, setEff] = useState("");
  const [reason, setReason] = useState("");
  const [err, setErr] = useState("");

  const changeScheme = (v: string) => { nav({ search: { scheme: v } }); const l = state.ruleVersions.filter((r) => r.schemeId === v).at(-1); setConds(l?.conditions ?? [{ field: "Household income", op: "<", value: "" }]); };
  const upd = (i: number, k: keyof RuleCondition, v: string) => setConds(conds.map((c, j) => (j === i ? { ...c, [k]: v } : c)));
  const publish = () => {
    if (conds.some((c) => !c.value.trim())) return setErr("Every condition needs a value");
    if (!eff) return setErr("Choose an effective date");
    if (reason.trim().length < 10) return setErr("Provide a change reason (at least 10 characters)");
    setErr("");
    const n = versions.length;
    const version = n ? `v${latest!.version.slice(1).split(".")[0]}.${Number(latest!.version.split(".")[1]) + 1}` : "v1.0";
    set((s) => ({ ruleVersions: [...s.ruleVersions, { version, schemeId: sid, effective: eff, by: `${s.session?.name} (Dept Admin)`, reason, conditions: conds }] }));
    addAudit({ actor: `${state.session?.name} (${state.session?.id})`, action: "Rule version published", application: sid, prev: latest?.version ?? "—", next: version, reason });
    toast.success(`Rule ${version} published`, { description: `Effective ${eff}. Earlier versions remain for past decisions.` });
    setReason("");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Eligibility Rules" desc="Rules are versioned. Applications are always assessed with the version in force on their submission date." />
      <div className="max-w-md"><Label>Scheme</Label><Select value={sid} onValueChange={changeScheme}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{SCHEMES.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select></div>
      <Panel title="Rule builder">
        <div className="space-y-2">
          {conds.map((c, i) => (
            <div key={i} className="flex flex-wrap items-center gap-2 rounded-md border bg-background p-2">
              <span className="w-12 text-xs font-bold text-gov">{i === 0 ? "IF" : "AND"}</span>
              <Select value={c.field} onValueChange={(v) => upd(i, "field", v)}><SelectTrigger className="w-48"><SelectValue /></SelectTrigger><SelectContent>{FIELDS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent></Select>
              <Select value={c.op} onValueChange={(v) => upd(i, "op", v)}><SelectTrigger className="w-36"><SelectValue /></SelectTrigger><SelectContent>{OPS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent></Select>
              <Input value={c.value} onChange={(e) => upd(i, "value", e.target.value)} placeholder="Value (e.g. 300000)" className="w-48" aria-label={`Value for condition ${i + 1}`} />
              <Button size="icon" variant="ghost" disabled={conds.length === 1} onClick={() => setConds(conds.filter((_, j) => j !== i))} aria-label="Remove condition"><X className="h-4 w-4" /></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setConds([...conds, { field: "BPL status", op: "=", value: "" }])}><Plus className="mr-1 h-4 w-4" />Add condition</Button>
          <div className="rounded-md border-2 border-success/40 bg-success/5 p-2 text-sm"><span className="mr-3 text-xs font-bold text-success">THEN</span>Eligible <span className="text-muted-foreground">(subject to officer verification)</span></div>
        </div>
        <div className="mt-5 grid gap-3 border-t pt-4 sm:grid-cols-[200px_1fr]">
          <div><Label htmlFor="eff">Effective date</Label><Input id="eff" type="date" value={eff} onChange={(e) => setEff(e.target.value)} className="mt-1" min={nowStamp().slice(0, 10)} /></div>
          <div><Label htmlFor="rsn">Change reason</Label><Textarea id="rsn" value={reason} onChange={(e) => setReason(e.target.value)} className="mt-1" rows={2} placeholder="e.g. Income ceiling revised per notification no. …" /></div>
        </div>
        <p className="mt-2 text-sm text-destructive" role="alert">{err}</p>
        <Button className="mt-2" onClick={publish}>Publish new version</Button>
      </Panel>
      <Panel title="Rule versions">
        {versions.length === 0 ? <Empty title="No versions yet for this scheme" body="Publish the first version above." /> : (
          <div className="overflow-x-auto"><Table>
            <TableHeader><TableRow><TableHead>Version</TableHead><TableHead>Effective date</TableHead><TableHead>Modified by</TableHead><TableHead>Change reason</TableHead><TableHead>Conditions</TableHead></TableRow></TableHeader>
            <TableBody>{[...versions].reverse().map((v) => <TableRow key={v.version}><TableCell className="font-mono">{v.version}</TableCell><TableCell>{v.effective}</TableCell><TableCell>{v.by}</TableCell><TableCell className="text-sm">{v.reason}</TableCell><TableCell className="text-xs text-muted-foreground">{v.conditions.map((c) => `${c.field} ${c.op} ${c.value}`).join(" AND ")}</TableCell></TableRow>)}</TableBody>
          </Table></div>
        )}
      </Panel>
    </div>
  );
}
