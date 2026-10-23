import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, CheckCircle2, Download, Pencil, Save } from "lucide-react";
import { toast } from "sonner";
import { downloadAcknowledgement, nowStamp, useApp } from "@/lib/app-state";
import { CITIZEN, HOUSEHOLD, MEMBERS, getScheme, inr, type Application } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Empty, LevelBadge, PageHeader, Panel, Pill } from "@/components/gov/ui";
import { type UploadedDoc } from "@/components/gov/DocUpload";
import { DocumentPicker } from "@/components/gov/DocumentPicker";
import { apiRequest, type ApiDocument } from "@/lib/api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/citizen/apply/$schemeId")({
  head: () => ({ meta: [{ title: "Apply for Scheme — Citizen" }, { name: "description", content: "Multi-step scheme application with verified data prefilled." }, { property: "og:title", content: "Apply for Scheme" }, { property: "og:description", content: "Guided scheme application." }] }),
  component: Apply,
});

const STEPS = ["Personal Details", "Household Details", "Income & Property", "Scheme Questions", "Documents", "Review", "Declaration & Submit"];

interface Form {
  name: string; dob: string; gender: string; mobile: string; email: string; address: string;
  dependents: string; incomeSource: string; income: string; land: string; assets: string;
  answers: Record<string, string>;
}
const initialForm: Form = {
  name: CITIZEN.name, dob: CITIZEN.dob, gender: CITIZEN.gender, mobile: CITIZEN.mobile, email: CITIZEN.email, address: CITIZEN.address,
  dependents: "3", incomeSource: "Agriculture and daily wage", income: String(HOUSEHOLD.annualIncome), land: "0.8 ha, Khasra 214 (ancestral)", assets: "", answers: {},
};

function Apply() {
  const { schemeId } = Route.useParams();
  const s = getScheme(schemeId);
  const { state, set, addAudit, createApp, submitApp } = useApp();
  const key = `udp-draft-${schemeId}`;
  const [step, setStep] = useState(0);
  const [f, setF] = useState<Form>(initialForm);
  const [docs, setDocs] = useState<Record<string, UploadedDoc | undefined>>({});
  const [libraryDocs, setLibraryDocs] = useState<ApiDocument[]>([]);
  const [decl, setDecl] = useState({ consent: false, accurate: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState("");
  const [done, setDone] = useState<Application | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { try { const d = localStorage.getItem(key); if (d) { const p = JSON.parse(d); setF(p.f); setStep(p.step); setDocs(p.docs ?? {}); toast.info("Restored your saved draft"); } } catch { /* ignore */ } }, [key]);
  useEffect(() => { if (!state.session?.apiToken) return; let active = true; apiRequest<{ data: ApiDocument[] }>(state.session, "/api/v1/documents?owner_type=CITIZEN").then((result) => active && setLibraryDocs(result.data.filter((doc) => doc.status === "READY"))).catch(() => active && setLibraryDocs([])); return () => { active = false; }; }, [state.session?.apiToken, state.session?.apiUserId]);
  useEffect(() => { if (done) return; const tm = setTimeout(() => { localStorage.setItem(key, JSON.stringify({ f, step, docs })); setSaved(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })); }, 600); return () => clearTimeout(tm); }, [f, step, docs, key, done]);

  const refreshLibrary = async () => {
    if (!state.session?.apiToken) return [];
    try { const result = await apiRequest<{ data: ApiDocument[] }>(state.session, "/api/v1/documents?owner_type=CITIZEN"); const next = result.data.filter((doc) => doc.status === "READY"); setLibraryDocs(next); return next; }
    catch { return libraryDocs; }
  };

  if (!s) return <Empty title="Scheme not found" action={<Button asChild><Link to="/schemes">Browse schemes</Link></Button>} />;
  const needsIncome = s.incomeMax !== undefined || s.bplRequired; const needsProperty = !!s.property;
  const up = (k: keyof Form, v: string) => setF({ ...f, [k]: v });

  const validate = (i: number) => {
    const e: Record<string, string> = {};
    if (i === 0) { if (f.name.trim().length < 3) e.name = "Enter full name"; if (!/^[\dX]{10}$/.test(f.mobile)) e.mobile = "Enter a 10-digit mobile number"; if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email"; if (f.address.trim().length < 10) e.address = "Enter full address"; }
    if (i === 2 && needsIncome && !(Number(f.income) > 0)) e.income = "Enter annual household income";
    if (i === 3) s.questions.forEach((q) => { if (!f.answers[q]?.trim()) e[q] = "This answer is required"; });
    if (i === 4) s.documents.forEach((d) => { if (!docs[d]) e[d] = "Upload required"; });
    if (i === 6) { if (!decl.consent) e.consent = "Consent is required"; if (!decl.accurate) e.accurate = "Declaration is required"; }
    setErrors(e);
    if (Object.keys(e).length) toast.error("Please complete the highlighted fields");
    return Object.keys(e).length === 0;
  };
  const next = () => { if (validate(step)) setStep(step + 1); };

  const submit = async () => {
    if (!validate(6) || submitting) return;
    setSubmitting(true);
    try {
      // Map scheme ID to PostgreSQL database scheme UUID
      let schemeUuid = "f5b56b91-2536-4919-9b2e-a0ce136a2c63";
      if (s.id === "sanitation") schemeUuid = "dfd0a6d6-de7b-47a5-b1a8-9e825f58efcb";
      else if (s.id === "rural-housing") schemeUuid = "8127bd85-d309-4d92-b9a0-bd8660155f18";

      const metadata = {
        applicant_name: f.name,
        income: Number(f.income),
        address: f.address,
        answers: f.answers,
        step: 6,
      };

      let finalApp: Application;
      if (state.session?.apiToken) {
        const draft = await createApp(schemeUuid, metadata);
        finalApp = await submitApp(draft.id);
      } else {
        const id = `MIRA-2026-${String(Date.now()).slice(-6)}`;
        finalApp = {
          id,
          schemeId: s.id,
          applicant: f.name,
          citizenId: CITIZEN.id,
          householdId: CITIZEN.householdId,
          appliedOn: nowStamp().slice(0, 10),
          updatedOn: nowStamp().slice(0, 10),
          status: "Submitted",
          stage: 1,
          declaredIncome: Number(f.income),
          events: [{ date: nowStamp().slice(0, 16), text: "Application submitted", by: f.name }],
        };
        set((st) => ({ applications: [finalApp, ...st.applications] }));
      }

      addAudit({ actor: `${f.name} (${CITIZEN.id})`, action: "Application submitted", application: finalApp.id, prev: "Draft", next: "Submitted", reason: "Citizen submission" });
      localStorage.removeItem(key);
      setDone(finalApp);
      toast.success("Application submitted successfully and saved to official registry.");
    } catch (e: any) {
      toast.error(e.message || "Failed to submit application. Please retry.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) return (
    <div className="mx-auto max-w-xl rounded-lg border bg-card p-8 text-center">
      <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
      <h1 className="mt-3 text-xl font-semibold text-navy">Application submitted</h1>
      <dl className="mx-auto mt-5 max-w-sm space-y-2 text-left text-sm">
        <div className="flex justify-between"><dt className="text-muted-foreground">Application ID</dt><dd className="font-mono font-semibold">{done.id}</dd></div>
        <div className="flex justify-between"><dt className="text-muted-foreground">Submitted on</dt><dd>{done.appliedOn}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Next step</dt><dd className="text-right">{done.status === "Verification Required" ? "Officer verification of flagged items" : "Document check (1–3 working days)"}</dd></div>
      </dl>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button asChild><Link to="/citizen/applications/$id" params={{ id: done.id }}>Track Application</Link></Button>
        <Button variant="outline" onClick={() => downloadAcknowledgement(done, s.name)}><Download className="mr-1 h-4 w-4" />Download acknowledgement</Button>
      </div>
    </div>
  );

  const err = (k: string) => errors[k] && <p className="mt-1 text-xs text-destructive">{errors[k]}</p>;
  const field = (k: keyof Form, label: string, opts: { verified?: boolean; type?: string } = {}) => (
    <div><Label htmlFor={k} className="flex items-center gap-2">{label}{opts.verified && <Pill t="ok" className="text-[10px]">Verified record</Pill>}</Label>
      <Input id={k} type={opts.type ?? "text"} value={f[k] as string} onChange={(e) => up(k, e.target.value)} className="mt-1" aria-invalid={!!errors[k]} />{err(k)}</div>
  );
  const reviewSection = (i: number, rows: [string, string][]) => (
    <div className="rounded-lg border">
      <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-2"><p className="text-sm font-semibold">{STEPS[i]}</p><Button size="sm" variant="ghost" onClick={() => setStep(i)}><Pencil className="mr-1 h-3.5 w-3.5" />Edit</Button></div>
      <dl className="grid gap-x-6 gap-y-2 p-4 text-sm sm:grid-cols-2">{rows.map(([k, v]) => <div key={k}><dt className="text-xs text-muted-foreground">{k}</dt><dd>{v || "—"}</dd></div>)}</dl>
    </div>
  );
  const active = MEMBERS.filter((m) => m.membership === "Active");

  return (
    <div>
      <PageHeader title={`Apply: ${s.name}`} desc={s.department} crumbs={[{ label: "Schemes", to: "/schemes" }, { label: "Apply" }]} actions={<LevelBadge level={s.level} />} />
      <ol className="mb-6 flex gap-1 overflow-x-auto pb-1" aria-label="Progress">
        {STEPS.map((st, i) => (
          <li key={st} className="min-w-28 flex-1">
            <button onClick={() => i < step && setStep(i)} disabled={i > step} className={cn("w-full border-t-4 pt-2 text-left text-xs", i < step ? "border-success text-success" : i === step ? "border-gov font-semibold text-navy" : "border-border text-muted-foreground")} aria-current={i === step ? "step" : undefined}>
              <span className="flex items-center gap-1">{i < step && <Check className="h-3 w-3" />}Step {i + 1}</span>{st}
            </button>
          </li>
        ))}
      </ol>
      <Panel title={`Step ${step + 1} — ${STEPS[step]}`} actions={<span className="flex items-center gap-1 text-xs text-muted-foreground"><Save className="h-3.5 w-3.5" />{saved ? `Draft saved ${saved}` : "Autosave on"}</span>}>
        {step === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {field("name", "Full Name", { verified: true })}
            {field("dob", "Date of Birth", { verified: true, type: "date" })}
            <div><Label>Gender</Label><Select value={f.gender} onValueChange={(v) => up("gender", v)}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Female">Female</SelectItem><SelectItem value="Male">Male</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select></div>
            {field("mobile", "Mobile Number", { verified: true })}
            {field("email", "Email (optional)", { type: "email" })}
            <div><Label>Aadhaar</Label><Input value={CITIZEN.aadhaarMasked} disabled className="mt-1 font-mono" /></div>
            <div className="sm:col-span-2"><Label htmlFor="address">Address</Label><Textarea id="address" value={f.address} onChange={(e) => up("address", e.target.value)} className="mt-1" />{err("address")}</div>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3"><div><Label>Household ID</Label><Input value={HOUSEHOLD.id} disabled className="mt-1 font-mono" /></div><div><Label>BPL status</Label><Input value={HOUSEHOLD.bpl} disabled className="mt-1" /></div>{field("dependents", "Number of dependents", { type: "number" })}</div>
            <div className="overflow-x-auto rounded-md border"><table className="w-full text-sm"><thead className="bg-muted/50 text-left text-xs"><tr><th className="p-2">Member</th><th className="p-2">Relationship</th><th className="p-2">Date of birth</th><th className="p-2">Identity</th></tr></thead>
              <tbody>{active.map((m) => <tr key={m.id} className="border-t"><td className="p-2">{m.name}</td><td className="p-2">{m.relationship}</td><td className="p-2">{m.dob}</td><td className="p-2"><Pill t={m.identity === "Verified" ? "ok" : "warn"}>{m.identity}</Pill></td></tr>)}</tbody></table></div>
            <p className="text-xs text-muted-foreground">Family details come from your verified household record. To change them, use <Link to="/citizen/family" className="text-gov underline">My Family</Link>.</p>
          </div>
        )}
        {step === 2 && (!needsIncome && !needsProperty ? <p className="text-sm text-muted-foreground">This scheme does not require income or property details. Continue to the next step.</p> : (
          <div className="grid gap-4 sm:grid-cols-2">
            {needsIncome && <>{field("incomeSource", "Income source")}{field("income", "Annual household income (₹)", { type: "number" })}</>}
            {needsProperty && <><div className="sm:col-span-2">{field("land", "Land / property information")}</div><div className="sm:col-span-2">{field("assets", "Relevant assets (vehicle, pucca house etc.)")}</div></>}
          </div>
        ))}
        {step === 3 && (
          <div className="space-y-4">{s.questions.map((q) => <div key={q}><Label htmlFor={q}>{q}</Label><Input id={q} value={f.answers[q] ?? ""} onChange={(e) => setF({ ...f, answers: { ...f.answers, [q]: e.target.value } })} className="mt-1" aria-invalid={!!errors[q]} />{err(q)}</div>)}</div>
        )}
        {step === 4 && (
          <div className="grid gap-4 md:grid-cols-2">{s.documents.map((d) => <div key={d}><DocumentPicker session={state.session} documents={libraryDocs} docType={d} required value={docs[d]} onChange={(v) => setDocs({ ...docs, [d]: v })} onUploaded={refreshLibrary} />{err(d)}</div>)}</div>
        )}
        {step === 5 && (
          <div className="space-y-4">
            {reviewSection(0, [["Full name", f.name], ["Date of birth", f.dob], ["Gender", f.gender], ["Mobile", f.mobile], ["Email", f.email], ["Address", f.address]])}
            {reviewSection(1, [["Household ID", HOUSEHOLD.id], ["BPL status", HOUSEHOLD.bpl], ["Members", String(active.length)], ["Dependents", f.dependents]])}
            {(needsIncome || needsProperty) && reviewSection(2, [["Income source", f.incomeSource], ["Annual income", f.income ? inr(Number(f.income)) : ""], ["Land / property", f.land], ["Assets", f.assets]])}
            {reviewSection(3, s.questions.map((q) => [q, f.answers[q] ?? ""]))}
            {reviewSection(4, s.documents.map((d) => [d, docs[d] ? `${docs[d]!.name} — ${docs[d]!.result}` : "Not uploaded"]))}
          </div>
        )}
        {step === 6 && (
          <div className="space-y-4">
            <label className="flex items-start gap-2 text-sm"><Checkbox checked={decl.consent} onCheckedChange={(v) => setDecl({ ...decl, consent: !!v })} className="mt-0.5" /><span>I consent to the department accessing my linked citizen, household, income and property records for verifying this application.</span></label>{err("consent")}
            <label className="flex items-start gap-2 text-sm"><Checkbox checked={decl.accurate} onCheckedChange={(v) => setDecl({ ...decl, accurate: !!v })} className="mt-0.5" /><span>I declare that the information provided is true and correct to the best of my knowledge. I understand that false information may lead to rejection and recovery of benefits.</span></label>{err("accurate")}
          </div>
        )}
        <div className="mt-6 flex justify-between border-t pt-4">
          <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
          {step < 6 ? <Button onClick={next}>Save & Continue</Button> : <Button onClick={submit}>Submit Application</Button>}
        </div>
      </Panel>
    </div>
  );
}
