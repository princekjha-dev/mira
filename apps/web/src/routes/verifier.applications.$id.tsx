import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  ShieldCheck,
  XCircle,
  HelpCircle,
  Flag,
  CheckCircle2,
  AlertTriangle,
  FileText,
  User,
  Users,
  Calendar,
  Building,
  History,
  Lock,
  Eye,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-state";
import { getScheme, fmtDate } from "@/lib/data";
import { PageHeader, StatusBadge, Timeline, Empty, Pill } from "@/components/gov/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CommentsThread } from "@/components/gov/CommentsThread";
import { DocumentViewer } from "@/components/gov/DocumentViewer";
import { apiRequest, type ApiDocument } from "@/lib/api";

export const Route = createFileRoute("/verifier/applications/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Verify Application ${params.id} — Verifier Workstation` },
      { name: "description", content: "Comprehensive determination workbench and document cross-verification." },
    ],
  }),
  component: VerifierAppDetailWorkbench,
});

function VerifierAppDetailWorkbench() {
  const { id } = Route.useParams();
  const { state, updateApp, addAudit } = useApp();
  const a = state.applications.find((x) => x.id === id || (x as any).rawId === id);

  const [decisionDlg, setDecisionDlg] = useState<null | "approve" | "reject" | "evidence" | "escalate">(null);
  const [reason, setReason] = useState("");
  const [submittedDocs, setSubmittedDocs] = useState<ApiDocument[]>([]);
  const [activeDoc, setActiveDoc] = useState<ApiDocument | null>(null);

  const loadDocuments = () => {
    if (!state.session?.apiToken && !state.session?.isDemo) return;
    const targetId = (a as any)?.rawId || a?.id;
    if (!targetId) return;
    apiRequest<{ data: ApiDocument[] }>(state.session, `/api/v1/applications/${targetId}/documents`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setSubmittedDocs(res.data);
        } else {
          apiRequest<{ data: ApiDocument[] }>(state.session, `/api/v1/documents`)
            .then((all) => setSubmittedDocs(all.data || []))
            .catch(() => setSubmittedDocs([]));
        }
      })
      .catch(() => {
        apiRequest<{ data: ApiDocument[] }>(state.session, `/api/v1/documents`)
          .then((all) => setSubmittedDocs(all.data || []))
          .catch(() => setSubmittedDocs([]));
      });
  };

  useEffect(() => {
    if (a) {
      loadDocuments();
    }
  }, [a?.id, (a as any)?.rawId, state.session?.apiToken, state.session?.isDemo]);

  if (!a) {
    return (
      <Empty
        title="Application not found"
        body={`No application record found for ${id}.`}
        action={
          <Button asChild>
            <Link to="/verifier/queue">Back to Verification Queue</Link>
          </Button>
        }
      />
    );
  }

  const s = getScheme(a.schemeId) || {
    id: a.schemeId,
    name: "Welfare Assistance Scheme",
    level: "Individual" as const,
    documents: ["Income Certificate", "Residence Certificate"],
  };

  const handleDecision = (outcome: "Approved" | "Rejected" | "Additional Evidence Required" | "Escalated") => {
    if (!reason.trim()) {
      toast.error("Please enter a determination note or legal finding.");
      return;
    }

    const officerName = state.session?.name || "Neha Verma (Verification Officer)";

    if (outcome === "Approved") {
      updateApp(
        a.id,
        {
          status: "Approved",
          stage: 6,
          decision: {
            outcome: "Approved",
            reason: reason.trim(),
            note: reason.trim(),
            date: new Date().toISOString().split("T")[0],
            by: officerName,
          },
        },
        `Statutory approval granted: ${reason.trim()}`,
        officerName
      );
      addAudit({
        actor: officerName,
        action: "Application Approved",
        application: a.id,
        prev: a.status,
        next: "Approved",
        reason: reason.trim(),
      });
      toast.success(`Application ${a.id} approved. Benefit entitlement generated.`);
    } else if (outcome === "Rejected") {
      updateApp(
        a.id,
        {
          status: "Rejected",
          stage: 6,
          decision: {
            outcome: "Rejected",
            reason: reason.trim(),
            note: reason.trim(),
            date: new Date().toISOString().split("T")[0],
            by: officerName,
          },
        },
        `Application rejected with cause: ${reason.trim()}`,
        officerName
      );
      addAudit({
        actor: officerName,
        action: "Application Rejected",
        application: a.id,
        prev: a.status,
        next: "Rejected",
        reason: reason.trim(),
      });
      toast.error(`Application ${a.id} rejected.`);
    } else if (outcome === "Additional Evidence Required") {
      updateApp(
        a.id,
        {
          status: "Additional Evidence Required",
        },
        `Clarification required from citizen: ${reason.trim()}`,
        officerName
      );
      addAudit({
        actor: officerName,
        action: "Evidence Requested",
        application: a.id,
        prev: a.status,
        next: "Additional Evidence Required",
        reason: reason.trim(),
      });
      toast.info(`Clarification request dispatched to ${a.applicant}.`);
    } else if (outcome === "Escalated") {
      updateApp(
        a.id,
        {
          status: "Verification Required",
        },
        `Escalated to Supervisor: ${reason.trim()}`,
        officerName
      );
      addAudit({
        actor: officerName,
        action: "Escalated to Supervisor",
        application: a.id,
        prev: a.status,
        next: "Verification Required",
        reason: reason.trim(),
      });
      toast.warning(`Application ${a.id} flagged and escalated to Supervisor.`);
    }

    setDecisionDlg(null);
    setReason("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Determination: ${s.name}`}
        desc={`${a.id} · Applicant: ${a.applicant} · Household: ${a.householdId}`}
        crumbs={[{ label: "Verifier Queue", to: "/verifier/queue" }, { label: a.id }]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDecisionDlg("evidence")}
              className="text-xs"
            >
              <HelpCircle className="mr-1.5 h-3.5 w-3.5 text-amber-500" />
              Request Evidence
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDecisionDlg("escalate")}
              className="text-xs"
            >
              <Flag className="mr-1.5 h-3.5 w-3.5 text-blue-500" />
              Escalate to Supervisor
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setDecisionDlg("reject")}
              className="text-xs"
            >
              <XCircle className="mr-1.5 h-3.5 w-3.5" />
              Reject
            </Button>
            <Button
              size="sm"
              onClick={() => setDecisionDlg("approve")}
              className="text-xs bg-emerald-600 hover:bg-emerald-700"
            >
              <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
              Approve Benefit
            </Button>
          </div>
        }
      />

      {/* Main Workbench Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Details, Mismatches, Timeline */}
        <div className="space-y-6 lg:col-span-2">
          {/* Status & Overlap Alert */}
          <Card className="border-border/80 shadow-xs">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <StatusBadge s={a.status} />
                  <span className="text-xs text-muted-foreground">Updated {fmtDate(a.updatedOn)}</span>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  Stage {a.stage} / 6
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2 text-xs space-y-3">
              {a.duplicate && (
                <div className="rounded-lg border border-blue-300/40 bg-blue-500/10 p-3 text-blue-900 dark:text-blue-200">
                  <div className="flex items-center gap-2 font-semibold">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    <span>Household Lineage Cross-Match (Duplicate Signal)</span>
                  </div>
                  <p className="mt-1 text-[11px] opacity-90">
                    Earlier benefit sanctioned in 2019 for pre-split household lineage. March 2021 formal bifurcation registered in family register. Determination must verify distinct independent dwelling status.
                  </p>
                </div>
              )}

              {a.mismatch && (
                <div className="rounded-lg border border-amber-300/40 bg-amber-500/10 p-3 text-amber-900 dark:text-amber-200">
                  <div className="flex items-center gap-2 font-semibold">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span>Data Mismatch Flagged: {a.mismatch.field}</span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-muted-foreground">Citizen Declared:</span>
                      <p className="font-semibold text-foreground">{a.mismatch.declared}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{a.mismatch.source}:</span>
                      <p className="font-semibold text-foreground">{a.mismatch.document}</p>
                    </div>
                  </div>
                </div>
              )}

              {a.decision && (
                <div className="rounded-lg border border-teal-300/40 bg-teal-500/10 p-3 text-teal-900 dark:text-teal-200">
                  <div className="font-semibold">Official Determination: {a.decision.outcome}</div>
                  <p className="mt-1 text-[11px]">Reason: {a.decision.reason}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">By {a.decision.by} on {fmtDate(a.decision.date)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submitted Evidence & Document Intelligence */}
          <Card className="border-border/80 shadow-xs">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-blue-600" />
                    Submitted Documents & Evidence
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Certificates attached to this application with OCR extracted intelligence
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-[10px]">
                  {submittedDocs.length} Documents
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-1 space-y-2 text-xs">
              {submittedDocs.length > 0 ? (
                <div className="divide-y rounded-md border bg-slate-50/50">
                  {submittedDocs.map((doc) => {
                    const isConflicting =
                      doc.verification_status === "ACTION_REQUIRED" ||
                      doc.verification_status === "MISMATCH";
                    return (
                      <div
                        key={doc.id}
                        className="flex flex-wrap items-center justify-between p-3 gap-2"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText
                            className={`h-4 w-4 shrink-0 ${
                              isConflicting
                                ? "text-amber-600"
                                : doc.verification_status === "VERIFIED"
                                ? "text-emerald-600"
                                : "text-slate-500"
                            }`}
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 truncate">
                              {doc.original_filename}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {doc.document_type} · v{doc.version_number || 1}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-semibold border ${
                              doc.verification_status === "VERIFIED"
                                ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                                : isConflicting
                                ? "border-amber-300 bg-amber-50 text-amber-900"
                                : doc.verification_status === "REJECTED"
                                ? "border-red-300 bg-red-50 text-red-800"
                                : "border-slate-300 bg-slate-100 text-slate-700"
                            }`}
                          >
                            {doc.verification_status}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setActiveDoc(doc)}
                            className="h-7 text-xs px-2.5 gap-1 text-blue-700 border-blue-200 hover:bg-blue-50"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View Document
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded border border-dashed p-4 text-center text-xs text-muted-foreground">
                  No submitted documents loaded.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Scheme Criteria Checklist */}
          <Card className="border-border/80 shadow-xs">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold">Statutory Eligibility Verification</CardTitle>
              <CardDescription className="text-xs">Criteria prescribed under {s.name}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-1 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <span className="font-medium text-foreground">Annual Household Income &lt; ₹ 2,00,000</span>
                  <p className="text-[11px] text-muted-foreground">Verified against Tehsildar & State Revenue Registry</p>
                </div>
                <Badge variant="outline" className="border-teal-400 bg-teal-500/10 text-teal-700 text-[10px]">
                  Pass (₹ 1,72,000)
                </Badge>
              </div>

              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <span className="font-medium text-foreground">Rural Residence & Land Holding</span>
                  <p className="text-[11px] text-muted-foreground">Plot 42/Ward 7 recorded in UP Bhulekh Khatauni</p>
                </div>
                <Badge variant="outline" className="border-teal-400 bg-teal-500/10 text-teal-700 text-[10px]">
                  Pass (0.18 Ha)
                </Badge>
              </div>

              <div className="flex items-center justify-between pb-1">
                <div>
                  <span className="font-medium text-foreground">No Prior Disqualifying Benefit in 5 Years</span>
                  <p className="text-[11px] text-muted-foreground">Household split authenticated by Gram Panchayat</p>
                </div>
                <Badge variant="outline" className="border-blue-400 bg-blue-500/10 text-blue-700 text-[10px]">
                  Requires Sign-off
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Activity & Threaded Comments */}
          <CommentsThread recordType="application" recordId={a.id} />
        </div>

        {/* Right Col: Timeline & Household summary */}
        <div className="space-y-6">
          <Card className="border-border/80 shadow-xs">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold">Application Lifecycle</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <Timeline app={a} />
            </CardContent>
          </Card>

          <Card className="border-border/80 shadow-xs">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold">Household Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-1 space-y-2 text-xs">
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-muted-foreground">Household ID:</span>
                <span className="font-mono font-medium">{a.householdId}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-muted-foreground">Members Registered:</span>
                <span className="font-medium font-semibold text-blue-900 dark:text-blue-200">
                  {a.householdId?.includes("10482") ? "35 Members (Multi-Gen)" : "5 Members"}
                </span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-muted-foreground">Registration Date:</span>
                <span className="font-medium">February 2010</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-muted-foreground">Jurisdiction:</span>
                <span className="font-medium">Civil Lines, Demo District</span>
              </div>
              <div className="pt-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-semibold gap-1.5 border-gov/30 text-gov hover:bg-gov/5"
                >
                  <Link to="/verifier/family360">
                    <Users className="h-3.5 w-3.5" />
                    <span>Inspect in Family360 Graph</span>
                    <ExternalLink className="h-3 w-3 ml-auto" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Decision Dialogs */}
      {decisionDlg && (
        <Dialog open={!!decisionDlg} onOpenChange={(open) => !open && setDecisionDlg(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="capitalize">
                {decisionDlg === "approve"
                  ? "Approve Application & Entitlement"
                  : decisionDlg === "reject"
                  ? "Issue Rejection Order"
                  : decisionDlg === "evidence"
                  ? "Request Additional Evidence"
                  : "Escalate to Supervisor"}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {decisionDlg === "approve"
                  ? "This determination will be cryptographically hashed and recorded to the state ledger."
                  : "State statutory finding and administrative rationale."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div>
                <label className="font-medium text-foreground">Determination Finding / Directive Note</label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={
                    decisionDlg === "approve"
                      ? "e.g. All statutory criteria met. Household split confirmed independent. Prior 2019 benefit pertained to separate brother-in-law dwelling."
                      : decisionDlg === "reject"
                      ? "e.g. Ineligible under Rule 8(b): Income ceiling exceeded based on revenue records."
                      : "e.g. Please furnish registered partition deed or Gram Panchayat resolution."
                  }
                  rows={4}
                  className="mt-1 text-xs"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" size="sm" onClick={() => setDecisionDlg(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant={decisionDlg === "reject" ? "destructive" : "default"}
                onClick={() =>
                  handleDecision(
                    decisionDlg === "approve"
                      ? "Approved"
                      : decisionDlg === "reject"
                      ? "Rejected"
                      : decisionDlg === "evidence"
                      ? "Additional Evidence Required"
                      : "Escalated"
                  )
                }
              >
                Confirm Determination
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {activeDoc && state.session && (
        <DocumentViewer
          document={activeDoc}
          session={state.session}
          onClose={() => setActiveDoc(null)}
          onChanged={() => {
            loadDocuments();
          }}
        />
      )}
    </div>
  );
}
