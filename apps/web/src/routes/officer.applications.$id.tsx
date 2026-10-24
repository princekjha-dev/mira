import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Eye,
  FileText,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { nowStamp, useApp } from "@/lib/app-state";
import { DocumentViewer } from "@/components/gov/DocumentViewer";
import { apiRequest, type ApiDocument } from "@/lib/api";
import {
  BENEFITS,
  CITIZEN,
  HOUSEHOLD,
  MEMBERS,
  getScheme,
  fmtDate,
  inr,
  type AppStatus,
} from "@/lib/data";
import { DEMO_PROFILE, evaluate } from "@/lib/eligibility";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Empty,
  LevelBadge,
  PageHeader,
  Panel,
  Pill,
  StatusBadge,
  Timeline,
} from "@/components/gov/ui";
import { EligibilityResult } from "@/components/gov/EligibilityResult";

export const Route = createFileRoute("/officer/applications/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Review ${params.id} — Officer` },
      { name: "description", content: "Evidence-based application review." },
      { property: "og:title", content: `Review ${params.id}` },
      { property: "og:description", content: "Application review workspace." },
    ],
  }),
  component: Review,
});

type Action = "Approve" | "Request Evidence" | "Escalate" | "Reject";
const REASONS: Record<Action, string[]> = {
  Approve: [
    "All criteria met and documents verified",
    "Criteria met after clarification",
  ],
  "Request Evidence": [
    "Updated income certificate required",
    "Property document unclear",
    "Clarification on prior household benefit",
    "Expired document",
  ],
  Escalate: [
    "Complex household history",
    "Possible policy exception",
    "Inter-department record conflict",
  ],
  Reject: [
    "Income exceeds scheme limit",
    "Confirmed duplicate household benefit",
    "Not resident in eligible area",
    "Ineligible after verification",
  ],
};
const NEXT: Record<Action, AppStatus> = {
  Approve: "Approved",
  "Request Evidence": "Additional Evidence Required",
  Escalate: "Officer Review",
  Reject: "Rejected",
};

function Review() {
  const { id } = Route.useParams();
  const {
    state,
    updateApp,
    addAudit,
    set,
    approveApp,
    rejectApp,
    requestAppEvidence,
    assignApp,
  } = useApp();
  const a = state.applications.find(
    (x) => x.id === id || (x as any).rawId === id,
  );
  const [act, setAct] = useState<Action | null>(null);
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [submittedDocs, setSubmittedDocs] = useState<ApiDocument[]>([]);
  const [activeDoc, setActiveDoc] = useState<ApiDocument | null>(null);

  const targetAppId = (a as { rawId?: string } | undefined)?.rawId || a?.id;

  const loadDocuments = useCallback(() => {
    if (!state.session?.apiToken || !targetAppId) return;
    apiRequest<{ data: ApiDocument[] }>(
      state.session,
      `/api/v1/applications/${targetAppId}/documents`,
    )
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setSubmittedDocs(res.data);
        } else {
          apiRequest<{ data: ApiDocument[] }>(
            state.session,
            `/api/v1/documents`,
          )
            .then((all) => setSubmittedDocs(all.data || []))
            .catch(() => setSubmittedDocs([]));
        }
      })
      .catch(() => {
        apiRequest<{ data: ApiDocument[] }>(state.session, `/api/v1/documents`)
          .then((all) => setSubmittedDocs(all.data || []))
          .catch(() => setSubmittedDocs([]));
      });
  }, [state.session, targetAppId]);

  useEffect(() => {
    if (a) {
      loadDocuments();
    }
  }, [a, loadDocuments]);
  if (!a)
    return (
      <Empty
        title="Application not found"
        action={
          <Button asChild>
            <Link to="/officer/applications">Back</Link>
          </Button>
        }
      />
    );
  const s = getScheme(a.schemeId) || {
    id: a.schemeId,
    name: (a as any).schemeName || "Welfare Assistance Scheme",
    level: "Individual" as const,
    documents: ["Income Certificate", "Residence Certificate"],
  };
  const own = a.householdId === CITIZEN.householdId;
  const elig = evaluate(s as any, {
    ...DEMO_PROFILE,
    income: a.declaredIncome,
    priorHouseholdSchemes: a.duplicate ? [s.id] : [],
  });
  const alert = state.alerts.find((d) => d.appId === a.id);
  const closed = a.status === "Approved" || a.status === "Rejected";

  const decide = async () => {
    if (!act) return;
    if (!reason) return setErr("Select a reason");
    if (
      (act === "Reject" || act === "Escalate" || act === "Request Evidence") &&
      note.trim().length < 10
    )
      return setErr("An officer note of at least 10 characters is required");

    setBusy(true);
    try {
      const by = `${state.session?.name} (${state.session?.id})`;
      const next = NEXT[act];
      const targetId = (a as any).rawId || a.id;

      if (act === "Approve") {
        await approveApp(targetId);
        toast.success("Application approved and benefit created in database.");
      } else if (act === "Reject") {
        await rejectApp(targetId, reason, note);
        toast.success("Application rejected and citizen notified.");
      } else if (act === "Request Evidence") {
        await requestAppEvidence(targetId, {
          evidence_type: "INCOME_CERTIFICATE",
          reason,
          description: note,
          deadline: new Date(Date.now() + 14 * 86400000)
            .toISOString()
            .slice(0, 10),
        });
        toast.success("Evidence request sent to citizen portal.");
      } else {
        updateApp(
          a.id,
          {
            status: next,
            stage: 4,
          },
          `${act}: ${reason}${note ? ` — ${note}` : ""}`,
          by,
        );
      }

      addAudit({
        actor: by,
        action:
          act === "Approve"
            ? "Application approved"
            : act === "Reject"
              ? "Application rejected"
              : act === "Escalate"
                ? "Application escalated"
                : "Officer requested evidence",
        application: a.id,
        prev: a.status,
        next,
        reason: `${reason}${note ? ` — ${note}` : ""}`,
      });
      setAct(null);
      setReason("");
      setNote("");
      setErr("");
    } catch (e: any) {
      setErr(e.message || "Failed to process decision on database.");
    } finally {
      setBusy(false);
    }
  };

  const handleSelfAssign = async () => {
    if (!state.session?.apiUserId) return;
    try {
      const targetId = (a as any).rawId || a.id;
      await assignApp(
        targetId,
        state.session.apiUserId,
        `Assigned to ${state.session.name}`,
      );
      toast.success(`Application assigned to ${state.session.name}`);
    } catch (e: any) {
      toast.error(e.message || "Assignment failed");
    }
  };

  return (
    <div className="pb-24">
      <PageHeader
        title={`${a.applicant} — ${s.name}`}
        desc={`${a.id} · received ${fmtDate(a.appliedOn)}`}
        crumbs={[
          { label: "Applications", to: "/officer/applications" },
          { label: a.id },
        ]}
        actions={
          <>
            <LevelBadge level={s.level} />
            <StatusBadge s={a.status} />
          </>
        }
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-4">
          <Panel
            title="Citizen information"
            actions={
              <Link
                to="/officer/citizens/$id"
                params={{ id: a.citizenId }}
                className="text-xs text-gov hover:underline"
              >
                Full record
              </Link>
            }
          >
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Name</dt>
                <dd>{a.applicant}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Citizen ID</dt>
                <dd className="font-mono">{a.citizenId}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Aadhaar</dt>
                <dd className="font-mono">
                  {own ? CITIZEN.aadhaarMasked : "XXXX XXXX 1190"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Identity</dt>
                <dd>
                  <Pill t="ok">Verified</Pill>
                </dd>
              </div>
            </dl>
          </Panel>
          <Panel
            title="Family information"
            actions={
              <div className="flex items-center gap-3">
                <Link
                  to="/officer/family360"
                  className="text-xs font-semibold text-gov hover:underline flex items-center gap-1"
                >
                  <Users className="h-3.5 w-3.5" />
                  Family360 Graph
                </Link>
                <Link
                  to="/officer/families/$id"
                  params={{ id: a.householdId }}
                  className="text-xs text-muted-foreground hover:underline"
                >
                  Household record
                </Link>
              </div>
            }
          >
            {own ? (
              <ul className="text-sm">
                {MEMBERS.map((m) => (
                  <li
                    key={m.id}
                    className="flex justify-between border-b py-1.5 last:border-0"
                  >
                    <span>
                      {m.name}{" "}
                      <span className="text-muted-foreground">
                        · {m.relationship}
                      </span>
                    </span>
                    <Pill t={m.membership === "Active" ? "info" : "neutral"}>
                      {m.membership}
                    </Pill>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Household {a.householdId} · 4 active members
              </p>
            )}
          </Panel>
          <Panel title="Income / BPL and Property">
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">
                  Declared income
                </dt>
                <dd>{inr(a.declaredIncome)}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">BPL</dt>
                <dd>{own ? HOUSEHOLD.bpl : "BPL"}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs text-muted-foreground">Property</dt>
                <dd>{own ? HOUSEHOLD.property : "No property record found"}</dd>
              </div>
            </dl>
          </Panel>
          <Panel title="Benefit history (household)">
            {own ? (
              <ul className="space-y-1.5 text-sm">
                {BENEFITS.map((b) => (
                  <li key={b.ref} className="flex justify-between gap-2">
                    <span>
                      {b.scheme}{" "}
                      <span className="text-muted-foreground">
                        · {b.beneficiary}
                      </span>
                    </span>
                    <Pill t={b.type === "Household" ? "teal" : "info"}>
                      {b.type}
                    </Pill>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No prior benefits recorded.
              </p>
            )}
          </Panel>
          <Panel title="Submitted documents & verification">
            {submittedDocs.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {submittedDocs.map((doc) => {
                  const isConflict =
                    doc.verification_status === "ACTION_REQUIRED" ||
                    doc.verification_status === "MISMATCH";
                  return (
                    <li
                      key={doc.id}
                      className="flex items-center justify-between gap-2 p-2 rounded-md border bg-slate-50/60"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText
                          className={`h-4 w-4 shrink-0 ${
                            isConflict
                              ? "text-amber-600"
                              : doc.verification_status === "VERIFIED"
                                ? "text-emerald-600"
                                : "text-slate-500"
                          }`}
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-xs truncate">
                            {doc.original_filename}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {doc.document_type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Pill
                          t={
                            doc.verification_status === "VERIFIED"
                              ? "ok"
                              : isConflict
                                ? "warn"
                                : "default"
                          }
                        >
                          {doc.verification_status}
                        </Pill>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setActiveDoc(doc)}
                          className="h-6 text-[11px] px-1.5 text-blue-700"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <ul className="space-y-1.5 text-sm">
                {s.documents.map((d, i) => (
                  <li key={d} className="flex justify-between gap-2">
                    <span>
                      {d}{" "}
                      <span className="text-xs text-muted-foreground">
                        · file_{i + 1}.pdf
                      </span>
                    </span>
                    <Pill t="ok">Verified</Pill>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
        <div className="space-y-4">
          <Panel title="Eligibility result">
            <EligibilityResult {...elig} />
          </Panel>
          <Panel title="Validation warnings">
            {a.mismatch ? (
              <div className="flex gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />
                <div>
                  <p className="font-medium">
                    {a.mismatch.field}: application {a.mismatch.declared} vs
                    document {a.mismatch.document}
                  </p>
                  <p className="text-muted-foreground">
                    Source: {a.mismatch.source}
                  </p>
                </div>
              </div>
            ) : (
              <p className="flex items-center gap-2 text-sm text-success">
                <CheckCircle2 className="h-4 w-4" />
                No validation warnings
              </p>
            )}
          </Panel>
          <Panel title="Duplicate alerts">
            {alert ? (
              <div className="text-sm">
                <div className="flex items-center gap-2">
                  <AlertOctagon className="h-4 w-4 text-destructive" />
                  <span className="font-medium">{alert.id}</span>
                  <Pill t={alert.severity === "High" ? "bad" : "warn"}>
                    {alert.severity}
                  </Pill>
                  <Pill>{alert.status}</Pill>
                </div>
                <p className="mt-2">{alert.reason}</p>
                <p className="mt-1 text-muted-foreground">
                  Supporting evidence: {alert.sources.join(", ")}
                </p>
                <Button size="sm" variant="outline" className="mt-3" asChild>
                  <Link to="/officer/duplicates">Open comparison view</Link>
                </Button>
              </div>
            ) : (
              <p className="flex items-center gap-2 text-sm text-success">
                <CheckCircle2 className="h-4 w-4" />
                No duplicate benefit found
              </p>
            )}
          </Panel>
          <Panel title="Application timeline">
            <Timeline app={a} />
            <ul className="mt-4 space-y-2 border-t pt-3">
              {[...a.events].reverse().map((e, i) => (
                <li key={i} className="text-xs">
                  <span className="font-medium">{e.text}</span>
                  <span className="block text-muted-foreground">
                    {e.date} · {e.by}
                  </span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-card md:left-60">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3 md:px-6">
          <span className="mr-auto hidden text-sm text-muted-foreground sm:inline">
            {closed
              ? `Decision recorded: ${a.status}`
              : "Every decision is recorded in the audit trail."}
          </span>
          {!(a as any).metadata?.assignment && (
            <Button variant="secondary" onClick={handleSelfAssign}>
              Assign to Me
            </Button>
          )}
          <Button
            disabled={closed || busy}
            className="bg-success text-success-foreground hover:bg-success/90"
            onClick={() => setAct("Approve")}
          >
            Approve
          </Button>
          <Button
            disabled={closed || busy}
            variant="outline"
            onClick={() => setAct("Request Evidence")}
          >
            Request Evidence
          </Button>
          <Button
            disabled={closed || busy}
            variant="outline"
            onClick={() => setAct("Escalate")}
          >
            Escalate
          </Button>
          <Button
            disabled={closed || busy}
            variant="destructive"
            onClick={() => setAct("Reject")}
          >
            Reject
          </Button>
        </div>
      </div>

      <Dialog
        open={!!act}
        onOpenChange={(o) => {
          if (!o) {
            setAct(null);
            setErr("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {act}: {a.id}
            </DialogTitle>
            <DialogDescription>
              {act === "Reject"
                ? "Rejection requires a reason and an officer note. The citizen will see the reason."
                : "This decision will be recorded with your officer ID."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Reason</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {act &&
                    REASONS[act].map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="note">
                Officer note{" "}
                {act !== "Approve" && (
                  <span className="text-destructive">*</span>
                )}
              </Label>
              <Textarea
                id="note"
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-1"
              />
            </div>
            <p className="text-sm text-destructive" role="alert">
              {err}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAct(null)}>
              Cancel
            </Button>
            <Button
              variant={act === "Reject" ? "destructive" : "default"}
              onClick={decide}
            >
              Confirm {act}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
