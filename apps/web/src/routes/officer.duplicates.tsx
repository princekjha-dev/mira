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

type Act =
  | "Legitimate Overlap"
  | "Not Duplicate"
  | "Evidence Requested"
  | "Confirmed Duplicate"
  | "Escalated";

function Dups() {
  const { state, set, addAudit, updateApp } = useApp();
  const [sel, setSel] = useState(state.alerts[0]?.id);
  const [act, setAct] = useState<Act | null>(null);
  const [note, setNote] = useState("");
  const d = state.alerts.find((x) => x.id === sel);

  const apply = () => {
    if (!d || !act) return;
    if (note.trim().length < 10) {
      toast.error("Please add an explanation note of at least 10 characters");
      return;
    }
    set((s) => ({
      alerts: s.alerts.map((x) => (x.id === d.id ? { ...x, status: act } : x)),
    }));
    addAudit({
      actor: `${state.session?.name} (${state.session?.id})`,
      action: `Duplicate determination: ${act}`,
      application: d.appId,
      prev: d.status,
      next: act,
      reason: note,
    });
    if (act === "Legitimate Overlap" || act === "Not Duplicate") {
      updateApp(
        d.appId,
        { status: "Officer Review", duplicate: false, stage: 4 },
        `Human adjudication cleared alert (${act}): ${note}`,
        state.session?.name,
      );
    }
    if (act === "Evidence Requested") {
      updateApp(
        d.appId,
        { status: "Additional Evidence Required" },
        `Evidence requested on duplicate signal: ${note}`,
        state.session?.name,
      );
    }
    if (act === "Confirmed Duplicate") {
      updateApp(
        d.appId,
        { status: "Officer Review" },
        `Duplicate confirmed — pending final decision: ${note}`,
        state.session?.name,
      );
    }
    if (act === "Escalated") {
      updateApp(
        d.appId,
        {},
        `Duplicate alert escalated to supervisor: ${note}`,
        state.session?.name,
      );
    }
    toast.success(`Determination recorded: ${act}`, {
      description:
        act === "Legitimate Overlap"
          ? "Alert resolved. Legitimate family/scheme overlap recorded. Not treated as fraud."
          : act === "Confirmed Duplicate"
            ? "The application is not auto-rejected. Officer records decision on case file."
            : "Recorded in audit trail.",
    });
    setAct(null);
    setNote("");
  };

  const sev = (x: DuplicateAlert) =>
    x.severity === "High" ? "bad" : x.severity === "Medium" ? "warn" : "neutral";

  return (
    <div>
      <PageHeader
        title="Duplicate Claim Detection (Human-in-the-Loop)"
        desc="Investigation signals flagged by entity resolution and benefit overlap rules. System never automatically rejects a citizen merely for potential duplicates — authorized officers make consequential adjudications."
      />
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <ul className="space-y-2">
          {state.alerts.map((x) => (
            <li key={x.id}>
              <button
                onClick={() => setSel(x.id)}
                className={cn(
                  "w-full rounded-lg border bg-card p-3 text-left text-sm transition-all",
                  sel === x.id && "border-gov ring-1 ring-gov shadow-sm",
                )}
              >
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs font-semibold">{x.id}</span>
                  <Pill t={sev(x)}>{x.severity}</Pill>
                </div>
                <p className="mt-1 font-semibold text-navy">{x.applicant}</p>
                <p className="text-xs text-muted-foreground truncate">{x.scheme}</p>
                <Pill className="mt-2 text-[10px]">{x.status}</Pill>
              </button>
            </li>
          ))}
        </ul>

        {d && (
          <div className="space-y-4">
            <Panel
              title={`${d.id} — ${d.scheme}`}
              actions={
                <Link
                  to="/officer/applications/$id"
                  params={{ id: d.appId }}
                  className="text-xs text-gov hover:underline font-semibold"
                >
                  Open application {d.appId} ↗
                </Link>
              }
            >
              <div className="mb-4 rounded-md bg-blue-50/70 border border-blue-200/60 p-3 text-xs text-blue-900 leading-relaxed">
                <strong>Investigation Signal:</strong> Potential duplicate detected because two applications share matching identity references or overlapping benefit periods. Platform policy prohibits automatic rejection or fraud accusations prior to human inquiry.
              </div>
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-muted-foreground">Applicant</dt>
                  <dd className="font-semibold text-navy mt-0.5">{d.applicant}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Household ID</dt>
                  <dd className="font-mono font-semibold text-slate-800 mt-0.5">{d.household}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs text-muted-foreground">Potential Matching Record</dt>
                  <dd className="text-xs font-medium text-slate-800 mt-0.5">{d.match}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs text-muted-foreground">Matching Rationale</dt>
                  <dd className="text-xs text-slate-700 mt-0.5 leading-relaxed">{d.reason}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs text-muted-foreground">Evidence Sources</dt>
                  <dd className="flex flex-wrap gap-1 mt-1">
                    {d.sources.map((s) => (
                      <Pill key={s}>{s}</Pill>
                    ))}
                  </dd>
                </div>
              </dl>
            </Panel>

            <Panel title="Field-by-Field Evidence Comparison">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="text-left bg-slate-50 border-b text-slate-600">
                    <tr>
                      <th className="p-2.5">Field</th>
                      <th className="p-2.5">Current Application</th>
                      <th className="p-2.5">Existing Record</th>
                      <th className="p-2.5">Signal Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-700">
                    {d.compare.map((c) => (
                      <tr key={c.field} className={cn(c.same && "bg-amber-50/40")}>
                        <td className="p-2.5 font-semibold text-navy">{c.field}</td>
                        <td className="p-2.5 font-mono">{c.current}</td>
                        <td className="p-2.5 font-mono">{c.existing}</td>
                        <td className="p-2.5">
                          {c.same ? (
                            <Pill t="warn">Potential Match</Pill>
                          ) : (
                            <Pill t="neutral">Distinct</Pill>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            <div className="flex flex-wrap gap-2.5 pt-1">
              <Button
                className="bg-teal hover:bg-teal/90 text-white text-xs h-9"
                onClick={() => setAct("Legitimate Overlap")}
              >
                Legitimate Overlap (Resolve Alert)
              </Button>
              <Button
                variant="outline"
                className="text-xs h-9"
                onClick={() => setAct("Not Duplicate")}
              >
                Mark as Distinct Application
              </Button>
              <Button
                variant="outline"
                className="text-xs h-9 text-amber-900 border-amber-300 hover:bg-amber-50"
                onClick={() => setAct("Evidence Requested")}
              >
                Request Evidence from Citizen
              </Button>
              <Button
                variant="destructive"
                className="text-xs h-9"
                onClick={() => setAct("Confirmed Duplicate")}
              >
                Confirm Subsumed Duplicate
              </Button>
              <Button
                variant="outline"
                className="text-xs h-9 text-slate-700"
                onClick={() => setAct("Escalated")}
              >
                Escalate to Supervisor
              </Button>
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
