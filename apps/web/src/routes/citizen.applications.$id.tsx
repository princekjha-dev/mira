import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Download, Info } from "lucide-react";
import { toast } from "sonner";
import { downloadAcknowledgement, useApp } from "@/lib/app-state";
import { getScheme, fmtDate } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Empty, PageHeader, Panel, StatusBadge, Timeline } from "@/components/gov/ui";
import { DocUploadCard, type UploadedDoc } from "@/components/gov/DocUpload";

export const Route = createFileRoute("/citizen/applications/$id")({
  head: ({ params }) => ({ meta: [{ title: `Application ${params.id}` }, { name: "description", content: "Application details, timeline and actions." }, { property: "og:title", content: `Application ${params.id}` }, { property: "og:description", content: "Application status and timeline." }] }),
  component: AppDetail,
});

function AppDetail() {
  const { id } = Route.useParams();
  const { state, updateApp, addAudit, submitAppEvidence } = useApp();
  const a = state.applications.find((x) => x.id === id || (x as any).rawId === id);
  const [dlg, setDlg] = useState<null | "reason" | "clarify" | "upload" | "review" | "respond">(null);
  const [text, setText] = useState("");
  const [doc, setDoc] = useState<UploadedDoc>();
  if (!a) return <Empty title="Application not found" body={`No application with ID ${id}.`} action={<Button asChild><Link to="/citizen/applications">Back to applications</Link></Button>} />;
  const s = getScheme(a.schemeId) || {
    id: a.schemeId,
    name: (a as any).schemeName || "Welfare Assistance Scheme",
    level: "Individual" as const,
    documents: ["Income Certificate", "Residence Certificate"],
  };

  const submitText = async (label: string) => {
    if (text.trim().length < 10) { toast.error("Please write at least 10 characters"); return; }
    const targetId = (a as any).rawId || a.id;
    const reqId = (a as any).metadata?.evidence_requests?.[0]?.id || "EV-RESP";
    try {
      await submitAppEvidence(targetId, {
        request_id: reqId,
        explanation: text.trim(),
      });
      toast.success(`${label} submitted and forwarded to reviewing officer.`);
    } catch {
      updateApp(a.id, { status: "Officer Review", stage: Math.max(a.stage, 4) }, `${label}: “${text.trim()}”`, a.applicant);
    }
    addAudit({ actor: `${state.session?.name} (${state.session?.id})`, action: label, application: a.id, prev: a.status, next: "Officer Review", reason: text.trim().slice(0, 80) });
    setText(""); setDlg(null);
  };

  const submitDoc = async () => {
    if (!doc) { toast.error("Upload a document first"); return; }
    const targetId = (a as any).rawId || a.id;
    const reqId = (a as any).metadata?.evidence_requests?.[0]?.id || "EV-DOC";
    try {
      await submitAppEvidence(targetId, {
        request_id: reqId,
        explanation: `Evidence uploaded: ${doc.name}`,
      });
      toast.success("Document submitted for verification in officer portal.");
    } catch {
      updateApp(a.id, { status: "Documents Under Review" }, `Evidence uploaded: ${doc.name}`, a.applicant);
    }
    addAudit({ actor: `${state.session?.name} (${state.session?.id})`, action: "Document uploaded", application: a.id, prev: a.status, next: "Documents Under Review", reason: doc.name });
    setDoc(undefined); setDlg(null);
  };

  return (
    <div>
      <PageHeader title={s.name} desc={`${a.id} · Applicant: ${a.applicant}`} crumbs={[{ label: "My Applications", to: "/citizen/applications" }, { label: a.id }]}
        actions={a.status === "Draft" ? <Button asChild><Link to="/citizen/apply/$schemeId" params={{ schemeId: a.schemeId }}>Continue application</Link></Button>
          : <Button variant="outline" onClick={() => downloadAcknowledgement(a, s.name)}><Download className="mr-1 h-4 w-4" />Download acknowledgement</Button>} />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Panel title="Status">
            <div className="flex flex-wrap items-center gap-3"><StatusBadge s={a.status} /><span className="text-sm text-muted-foreground">Last updated {fmtDate(a.updatedOn)}</span></div>
            {a.status === "Draft" && <p className="mt-3 text-sm">This application has not been submitted. Your progress is saved automatically.</p>}
            {a.status === "Additional Evidence Required" && (
              <div className="mt-3 rounded-md border border-warning/50 bg-warning/10 p-3 text-sm"><p className="font-medium">The officer has asked for additional evidence.</p><p className="mt-1">{a.events.at(-1)?.text}</p>
                <div className="mt-3 flex flex-wrap gap-2"><Button size="sm" onClick={() => setDlg("upload")}>Upload Missing Document</Button><Button size="sm" variant="outline" onClick={() => setDlg("respond")}>Respond to Officer</Button></div></div>
            )}
            {a.decision && <div className="mt-3 rounded-md border p-3 text-sm"><p className="font-medium">Decision: {a.decision.outcome}</p><p className="text-muted-foreground">Reason: {a.decision.reason}</p>{a.decision.note && <p className="text-muted-foreground">Officer note: {a.decision.note}</p>}<p className="mt-1 text-xs text-muted-foreground">By {a.decision.by} on {fmtDate(a.decision.date)}</p></div>}
          </Panel>

          {a.duplicate && a.status === "Verification Required" && (
            <Panel title="Verification Required">
              <div className="flex gap-3"><Info className="h-5 w-5 shrink-0 text-warning" /><div><p className="text-sm font-medium">A similar household-level benefit may already exist.</p><p className="mt-1 text-sm text-muted-foreground">This is not a rejection. An officer will review the records and make the final decision. You can help by explaining your situation.</p></div></div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => setDlg("reason")}>View reason</Button>
                <Button size="sm" variant="outline" onClick={() => setDlg("clarify")}>Provide clarification</Button>
                <Button size="sm" variant="outline" onClick={() => setDlg("upload")}>Upload evidence</Button>
                <Button size="sm" onClick={() => setDlg("review")}>Request review</Button>
              </div>
            </Panel>
          )}

          {a.mismatch && (
            <Panel title="Information mismatch">
              <div className="flex gap-3"><AlertTriangle className="h-5 w-5 shrink-0 text-warning" /><div className="flex-1 text-sm">
                <p className="font-medium">{a.mismatch.field}</p>
                <div className="mt-2 grid grid-cols-2 gap-3 rounded-md border p-3"><div><p className="text-xs text-muted-foreground">Application</p><p className="font-semibold">{a.mismatch.declared}</p></div><div><p className="text-xs text-muted-foreground">{a.mismatch.source}</p><p className="font-semibold">{a.mismatch.document}</p></div></div>
                <p className="mt-2">Income values do not match. Please review or submit supporting evidence.</p>
                <Button size="sm" variant="outline" className="mt-3" onClick={() => setDlg("upload")}>Submit supporting evidence</Button>
              </div></div>
            </Panel>
          )}

          <Panel title="Activity">
            {a.events.length === 0 ? <p className="text-sm text-muted-foreground">No activity yet.</p> :
              <ul className="space-y-3">{[...a.events].reverse().map((e, i) => <li key={i} className="border-l-2 pl-3 text-sm"><p>{e.text}</p><p className="text-xs text-muted-foreground">{e.date} · {e.by}</p></li>)}</ul>}
          </Panel>
        </div>
        <Panel title="Application timeline"><Timeline app={a} /></Panel>
      </div>

      <Dialog open={dlg === "reason"} onOpenChange={(o) => !o && setDlg(null)}>
        <DialogContent><DialogHeader><DialogTitle>Why verification is required</DialogTitle><DialogDescription>Records available to you as the applicant</DialogDescription></DialogHeader>
          <div className="space-y-2 text-sm">
            <p>A Rural Housing Assistance benefit was approved in 2019 for household {a.householdId}, when the family of Rajesh Kumar was part of your household.</p>
            <p>Your household record shows a household split in March 2021. Because this is a household-level scheme, an officer needs to confirm whether the earlier benefit belongs to your current household.</p>
            <p className="text-muted-foreground">Sources: household lineage register, benefit registry, land records.</p>
          </div>
          <DialogFooter><Button onClick={() => setDlg("clarify")}>Provide clarification</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      {(["clarify", "review", "respond"] as const).map((k) => (
        <Dialog key={k} open={dlg === k} onOpenChange={(o) => !o && setDlg(null)}>
          <DialogContent><DialogHeader><DialogTitle>{k === "clarify" ? "Provide clarification" : k === "review" ? "Request review" : "Respond to officer"}</DialogTitle><DialogDescription>Your message is attached to the application and visible to the reviewing officer.</DialogDescription></DialogHeader>
            <Label htmlFor={`t-${k}`}>Message</Label><Textarea id={`t-${k}`} rows={5} value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. The 2019 house was built for my brother-in-law's family, who now live separately in HH-UP-0417-3380." />
            <DialogFooter><Button variant="outline" onClick={() => setDlg(null)}>Cancel</Button><Button onClick={() => submitText(k === "clarify" ? "Clarification provided" : k === "review" ? "Review requested" : "Citizen response")}>Submit</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
      <Dialog open={dlg === "upload"} onOpenChange={(o) => !o && setDlg(null)}>
        <DialogContent><DialogHeader><DialogTitle>Upload document / evidence</DialogTitle></DialogHeader>
          <DocUploadCard docType="Supporting Evidence" required value={doc} onChange={setDoc} />
          <DialogFooter><Button variant="outline" onClick={() => setDlg(null)}>Cancel</Button><Button onClick={submitDoc}>Submit document</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
