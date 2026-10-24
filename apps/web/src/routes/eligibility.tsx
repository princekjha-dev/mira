import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleHelp,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  XCircle,
  FileText,
  Gift,
  Building2,
  LogIn,
} from "lucide-react";
import { SCHEMES, STATES, type Scheme, HOUSEHOLD, CITIZEN } from "@/lib/data";
import { evaluate, type Profile, type Criterion, type Outcome } from "@/lib/eligibility";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Empty, PageContainer, PageHeader, Panel } from "@/components/gov/ui";
import { SchemeBreadcrumbs } from "@/components/gov/scheme";
import { MiraCard } from "@/components/mira/MiraPrimitives";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/eligibility")({
  validateSearch: (s: Record<string, unknown>): { scheme?: string } => ({
    scheme: typeof s.scheme === "string" ? s.scheme : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Check Scheme Eligibility Criteria — Mira" },
      {
        name: "description",
        content:
          "Find schemes and benefits you qualify for based on statutory household and individual criteria.",
      },
      { property: "og:title", content: "Check Scheme Eligibility Criteria — Mira" },
    ],
  }),
  component: Eligibility,
});

const FLOW = [
  "Your details",
  "Household information",
  "Scheme requirements",
  "Eligibility result",
];

const EMPTY_PROFILE: Profile = {
  age: 0,
  gender: "Other",
  income: 0,
  bpl: "unknown",
  puccaHouse: "unknown",
  landHa: 0,
  priorHouseholdSchemes: [],
  state: "",
};

// Verified citizen demo profile helper
function getCitizenProfile(): Profile {
  return {
    age: 41,
    gender: "Male",
    income: HOUSEHOLD.annualIncome || 172000,
    bpl: true,
    puccaHouse: "no",
    landHa: 0.18,
    priorHouseholdSchemes: ["job-card", "health-cover"],
    state: "Uttar Pradesh",
  };
}

// Map evidence needed for each criterion type
function getEvidenceForCriterion(label: string, scheme: Scheme): string {
  if (label.toLowerCase().includes("income")) {
    return "Income Certificate issued by Tehsildar / Sub-Divisional Magistrate";
  }
  if (label.toLowerCase().includes("bpl")) {
    return "Priority / BPL Ration Card certified by Food & Civil Supplies";
  }
  if (label.toLowerCase().includes("age") || label.toLowerCase().includes("identity")) {
    return "Aadhaar Card / Birth Certificate registered with UIDAI";
  }
  if (label.toLowerCase().includes("house") || label.toLowerCase().includes("land") || label.toLowerCase().includes("property")) {
    return "Homestead inspection report / Bhulekh land revenue record";
  }
  if (label.toLowerCase().includes("gender")) {
    return "Official Identity Certificate (Aadhaar / Voter ID)";
  }
  if (label.toLowerCase().includes("prior")) {
    return "Registry cross-check against State Welfare Sanction Ledger";
  }
  return scheme.documents[0] || "Supporting statutory identification record";
}

export function Eligibility() {
  const { scheme: schemeParam } = Route.useSearch();
  const nav = useNavigate({ from: "/eligibility" });
  const { state } = useApp();
  const session = state.session;
  const isCitizen = session?.role === "citizen";

  const [schemeId, setSchemeId] = useState(schemeParam ?? "");
  const [profile, setProfile] = useState<Profile>({ ...EMPTY_PROFILE });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const [usedHouseholdRecord, setUsedHouseholdRecord] = useState(false);

  const selected = SCHEMES.find((item) => item.id === schemeId);
  const result = selected && checked ? evaluate(selected, profile) : null;

  useEffect(() => {
    if (schemeParam) {
      setSchemeId(schemeParam);
      setChecked(false);
    }
  }, [schemeParam]);

  const chooseScheme = (id: string) => {
    setSchemeId(id);
    setChecked(false);
    setUsedHouseholdRecord(false);
    void nav({ search: { scheme: id } });
  };

  const update = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setProfile((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  // Instant 1-click evaluation using citizen household profile
  const evaluateWithHouseholdProfile = () => {
    const p = getCitizenProfile();
    setProfile(p);
    setUsedHouseholdRecord(true);
    setChecked(true);
    setStep(3);
  };

  const next = () => {
    const nextErrors: Record<string, string> = {};
    if (
      step === 0 &&
      (!Number.isFinite(profile.age) || profile.age < 1 || profile.age > 120)
    )
      nextErrors.age = "Enter an age from 1 to 120.";
    if (step === 1) {
      if (!Number.isFinite(profile.income) || profile.income < 0)
        nextErrors.income = "Enter a valid annual household income.";
      if (!Number.isFinite(profile.landHa) || profile.landHa < 0)
        nextErrors.landHa = "Enter a valid land area.";
      if (!profile.state) nextErrors.state = "Choose your state or territory.";
    }
    if (step === 2 && !selected)
      nextErrors.scheme = "Choose a scheme to continue.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    if (step === 2) {
      setChecked(true);
      setStep(3);
    } else setStep((current) => Math.min(3, current + 1));
  };

  const back = () => {
    setErrors({});
    setStep((current) => Math.max(0, current - 1));
  };

  const reset = () => {
    setProfile({ ...EMPTY_PROFILE });
    setSchemeId("");
    setStep(0);
    setChecked(false);
    setUsedHouseholdRecord(false);
    setErrors({});
    void nav({ search: {} });
  };

  return (
    <PageContainer className="max-w-6xl space-y-6">
      {/* Contextual Breadcrumbs */}
      <SchemeBreadcrumbs
        scheme={selected}
        currentSection="Eligibility Criteria"
      />

      <PageHeader
        eyebrow="ELIGIBILITY CRITERIA"
        title={
          selected
            ? `Eligibility for ${selected.name}`
            : "Check Scheme Eligibility"
        }
        desc={
          selected
            ? `Review statutory qualifications, household income thresholds, and documentary requirements for ${selected.name}.`
            : "Evaluate your eligibility against statutory government welfare rules, income limits, and categorical criteria."
        }
      />

      {/* ------------------------------------------------------------------ */}
      {/* AUTHENTICATED CITIZEN ONE-CLICK CALLOUT                           */}
      {/* ------------------------------------------------------------------ */}
      {isCitizen && selected && !checked && (
        <div className="rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/80 dark:bg-blue-950/30 p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <UserCheck className="h-6 w-6 text-gov shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-bold text-sm sm:text-base text-foreground">
                Evaluate Instantly with Household Records
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You are authenticated as <strong>{session?.name || "Rajesh Sharma"}</strong> (Household ID: {HOUSEHOLD.id}).
                Mira can evaluate your eligibility for <strong>{selected.name}</strong> using verified income, BPL, and residence records on file.
              </p>
            </div>
          </div>

          <Button
            onClick={evaluateWithHouseholdProfile}
            size="lg"
            className="rounded-lg bg-navy hover:bg-navy/90 text-white font-medium text-xs sm:text-sm shadow-xs shrink-0 self-start sm:self-auto"
          >
            <Sparkles className="h-4 w-4 mr-1.5 text-gov" />
            <span>Check Against My Household</span>
          </Button>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* UNAUTHENTICATED NOTICE                                             */}
      {/* ------------------------------------------------------------------ */}
      {!session && selected && !checked && (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <ShieldCheck className="h-4 w-4 text-gov shrink-0" />
            <span>
              Have a citizen account? Sign in to check eligibility using your existing household record.
            </span>
          </div>

          <Button
            size="sm"
            variant="outline"
            asChild
            className="rounded-lg border-slate-300 dark:border-slate-700 text-xs font-semibold h-7.5 self-start sm:self-auto"
          >
            <Link to="/login">
              <LogIn className="h-3 w-3 mr-1" />
              <span>Sign In with Citizen ID</span>
            </Link>
          </Button>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* STEP PROGRESS TRACKER                                              */}
      {/* ------------------------------------------------------------------ */}
      {!checked && (
        <ol
          className="grid grid-cols-2 gap-2 sm:grid-cols-4"
          aria-label="Eligibility check steps"
        >
          {FLOW.map((label, index) => (
            <li
              key={label}
              aria-current={step === index ? "step" : undefined}
              className={`flex min-w-0 items-center gap-2 border-b-2 px-2 pb-3 pt-1 text-xs sm:px-3 sm:text-sm ${
                index === step
                  ? "border-blue-700 text-slate-950 dark:text-slate-100 font-semibold"
                  : index < step
                    ? "border-teal-600 text-slate-700 dark:text-slate-300"
                    : "border-slate-200 dark:border-slate-800 text-slate-400"
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold ${
                  index < step
                    ? "border-teal-700 bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-200"
                    : index === step
                      ? "border-blue-700 text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950"
                      : "border-slate-300 dark:border-slate-700"
                }`}
              >
                {index < step ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  `0${index + 1}`
                )}
              </span>
              <span className="leading-4 truncate">{label}</span>
            </li>
          ))}
        </ol>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* WIZARD FORM (STEPS 0, 1, 2)                                        */}
      {/* ------------------------------------------------------------------ */}
      {step < 3 ? (
        <MiraCard variant="elevated" className="overflow-hidden p-0 rounded-2xl">
          <div className="border-b border-border/60 px-5 py-4 sm:px-7 bg-muted/20 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Step 0{step + 1} of 04
              </p>
              <h2 className="mt-0.5 text-base sm:text-lg font-semibold tracking-tight text-foreground">
                {FLOW[step]}
              </h2>
            </div>

            {selected && (
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-border/60">
                Scheme: {selected.name}
              </span>
            )}
          </div>

          <div className="space-y-5 px-5 py-5 sm:px-7 sm:py-6">
            {step === 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="elig-age">Your Age (Years)</Label>
                  <Input
                    id="elig-age"
                    type="number"
                    min="1"
                    max="120"
                    inputMode="numeric"
                    value={profile.age || ""}
                    onChange={(event) =>
                      update("age", Number(event.target.value))
                    }
                    className="mt-1.5"
                    placeholder="e.g. 41"
                    aria-invalid={!!errors.age}
                  />
                  {errors.age && (
                    <p className="mt-1 text-xs text-destructive font-medium" role="alert">
                      {errors.age}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="elig-gender">Gender</Label>
                  <Select
                    value={profile.gender}
                    onValueChange={(value) =>
                      update("gender", value as Profile["gender"])
                    }
                  >
                    <SelectTrigger id="elig-gender" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Other">Other / Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="elig-income">
                    Annual Household Income (₹)
                  </Label>
                  <Input
                    id="elig-income"
                    type="number"
                    min="0"
                    step="5000"
                    value={profile.income || ""}
                    onChange={(event) =>
                      update("income", Number(event.target.value))
                    }
                    className="mt-1.5"
                    placeholder="e.g. 172000"
                    aria-invalid={!!errors.income}
                  />
                  {errors.income && (
                    <p className="mt-1 text-xs text-destructive font-medium" role="alert">
                      {errors.income}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="elig-state">State / Union Territory</Label>
                  <Select
                    value={profile.state}
                    onValueChange={(value) => update("state", value)}
                  >
                    <SelectTrigger id="elig-state" className="mt-1.5">
                      <SelectValue placeholder="Choose state" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATES.slice(1).map((stateName) => (
                        <SelectItem value={stateName} key={stateName}>
                          {stateName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.state && (
                    <p className="mt-1 text-xs text-destructive font-medium" role="alert">
                      {errors.state}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="elig-bpl">BPL / Priority Ration Status</Label>
                  <Select
                    value={
                      profile.bpl === true
                        ? "yes"
                        : profile.bpl === false
                          ? "no"
                          : "unknown"
                    }
                    onValueChange={(value) =>
                      update(
                        "bpl",
                        value === "yes" ? true : value === "no" ? false : "unknown"
                      )
                    }
                  >
                    <SelectTrigger id="elig-bpl" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">BPL / Priority Household</SelectItem>
                      <SelectItem value="no">Non-BPL (General Category)</SelectItem>
                      <SelectItem value="unknown">Not sure / Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="elig-pucca">
                    Does anyone in your household own a pucca dwelling?
                  </Label>
                  <Select
                    value={profile.puccaHouse}
                    onValueChange={(value) =>
                      update("puccaHouse", value as Profile["puccaHouse"])
                    }
                  >
                    <SelectTrigger id="elig-pucca" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">No (Living in kutcha / temporary housing)</SelectItem>
                      <SelectItem value="yes">Yes (Own permanent pucca house)</SelectItem>
                      <SelectItem value="unknown">Not sure / Tenant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor="elig-land">Cultivable Agricultural Land (Hectares)</Label>
                  <Input
                    id="elig-land"
                    type="number"
                    min="0"
                    step="0.05"
                    value={profile.landHa || ""}
                    onChange={(event) =>
                      update("landHa", Number(event.target.value))
                    }
                    className="mt-1.5"
                    placeholder="e.g. 0.18"
                  />
                  <span className="text-[11px] text-muted-foreground mt-1 block">
                    Enter 0 if landless. 1 hectare is approximately 2.47 acres.
                  </span>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <Label htmlFor="elig-scheme" className="text-sm font-semibold">
                    Select Target Scheme
                  </Label>
                  <Select value={schemeId} onValueChange={chooseScheme}>
                    <SelectTrigger id="elig-scheme" className="mt-1.5">
                      <SelectValue placeholder="Choose a scheme from the catalogue" />
                    </SelectTrigger>
                    <SelectContent>
                      {SCHEMES.map((item: Scheme) => (
                        <SelectItem value={item.id} key={item.id}>
                          {item.name} ({item.department})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.scheme && (
                    <p className="mt-1 text-xs text-destructive font-medium" role="alert">
                      {errors.scheme}
                    </p>
                  )}
                </div>

                {selected ? (
                  <div className="rounded-xl border border-border/70 bg-muted/20 p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-border/50 pb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">
                          {selected.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {selected.department}
                        </p>
                      </div>
                      <span className="rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-900 dark:text-blue-200 px-2.5 py-0.5 text-xs font-mono font-medium">
                        {selected.level}
                      </span>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 text-xs">
                      <div>
                        <span className="font-semibold text-foreground uppercase tracking-wider text-[10px] font-mono block mb-1">
                          Eligibility Criteria
                        </span>
                        <ul className="space-y-1 text-muted-foreground">
                          {selected.eligibility.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-gov font-bold">✓</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="font-semibold text-foreground uppercase tracking-wider text-[10px] font-mono block mb-1">
                          Key Entitlement
                        </span>
                        <p className="font-medium text-foreground">
                          {selected.keyBenefit}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          Documents: {selected.documents.join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Empty
                    title="Choose a scheme to verify eligibility"
                    body="Select any scheme from the dropdown above to evaluate your household against statutory criteria."
                  />
                )}
              </div>
            )}
          </div>

          {/* Form navigation buttons */}
          <div className="flex flex-col-reverse gap-2 border-t border-border/60 bg-muted/30 px-5 py-4 sm:flex-row sm:justify-between sm:px-7">
            {step > 0 ? (
              <Button variant="outline" onClick={back} className="rounded-lg">
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Back
              </Button>
            ) : (
              <span />
            )}

            {step === 2 ? (
              <Button
                onClick={next}
                disabled={!selected}
                className="rounded-lg bg-navy hover:bg-navy/90 text-white font-medium"
              >
                <span>Evaluate My Eligibility</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            ) : (
              <Button
                onClick={next}
                className="rounded-lg bg-navy hover:bg-navy/90 text-white font-medium"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            )}
          </div>
        </MiraCard>
      ) : result && selected ? (
        /* ------------------------------------------------------------------ */
        /* ELIGIBILITY RESULTS VIEW (STRUCTURED)                              */
        /* ------------------------------------------------------------------ */
        <div className="space-y-6">
          <MiraCard variant="elevated" className="p-6 rounded-2xl space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-border/60 pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                    Eligibility Determination
                  </span>
                  {usedHouseholdRecord && (
                    <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 border border-emerald-300 dark:border-emerald-800">
                      Evaluated with Verified Household Records
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  {result.outcome === "Likely Eligible" ? (
                    <>
                      <Check className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      <span>You may be eligible</span>
                    </>
                  ) : result.outcome === "Verification Required" ? (
                    <>
                      <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                      <span>Verification Required</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                      <span>Some requirements are not met</span>
                    </>
                  )}
                </h2>

                <p className="text-xs sm:text-sm text-muted-foreground">
                  Evaluation for <strong>{selected.name}</strong> • Entitlement: {selected.keyBenefit}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="rounded-lg text-xs font-semibold shrink-0"
                onClick={() => {
                  setStep(0);
                  setChecked(false);
                  setUsedHouseholdRecord(false);
                }}
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                <span>Adjust Answers</span>
              </Button>
            </div>

            {/* Structured Criteria Results Table */}
            <div className="space-y-3">
              <div className="rounded-xl border border-border/80 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs sm:text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-border/80 bg-muted/40 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      <th className="py-3 px-4 font-semibold">Requirement</th>
                      <th className="py-3 px-4 font-semibold w-28">Status</th>
                      <th className="py-3 px-4 font-semibold">Evaluation Details</th>
                      <th className="py-3 px-4 font-semibold hidden md:table-cell">Required Evidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {result.criteria.map((c, idx) => {
                      const evidence = getEvidenceForCriterion(c.label, selected);
                      const isPass = c.status === "pass";
                      const isVerify = c.status === "verify";

                      return (
                        <tr key={idx} className="hover:bg-muted/10 transition-colors">
                          <td className="py-3 px-4 font-semibold text-foreground">
                            {c.label}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold font-mono ${
                                isPass
                                  ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                                  : isVerify
                                    ? "bg-amber-50 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                                    : "bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                              }`}
                            >
                              <span>{isPass ? "✓ Met" : isVerify ? "⚠ Check" : "✕ Not Met"}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            {c.detail}
                          </td>
                          <td className="py-3 px-4 text-xs text-muted-foreground hidden md:table-cell leading-relaxed">
                            <span className="flex items-center gap-1.5">
                              <FileText className="h-3.5 w-3.5 text-gov shrink-0" />
                              <span>{evidence}</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Explanation box */}
            <div
              className={`rounded-xl border p-4 sm:p-5 text-xs sm:text-sm ${
                result.outcome === "Likely Eligible"
                  ? "border-emerald-200 bg-emerald-50/70 dark:border-emerald-900/50 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-100"
                  : result.outcome === "Verification Required"
                    ? "border-amber-200 bg-amber-50/70 dark:border-amber-900/50 dark:bg-amber-950/20 text-amber-950 dark:text-amber-100"
                    : "border-rose-200 bg-rose-50/70 dark:border-rose-900/50 dark:bg-rose-950/20 text-rose-950 dark:text-rose-100"
              }`}
            >
              <p className="font-semibold">
                {result.outcome === "Likely Eligible"
                  ? "Preliminary Determination: Likely Eligible"
                  : result.outcome === "Verification Required"
                    ? "Preliminary Determination: Supporting Documents Required"
                    : "Preliminary Determination: One or More Statutory Criteria Not Satisfied"}
              </p>
              <p className="mt-1 text-xs opacity-90 leading-relaxed">
                {result.outcome === "Likely Eligible" &&
                  "All statutory criteria are satisfied based on the information provided. Final approval is subject to document verification by the assigned department officer."}
                {result.outcome === "Verification Required" &&
                  "Some criteria require administrative verification or updated documentation (marked with ⚠ above). You can proceed to apply; the verification officer will examine the records."}
                {result.outcome === "Currently Not Eligible" &&
                  "Based on declared income, property, or categorical data, you do not meet the criteria for this scheme. If your household records have changed, you can update your household data or explore alternate schemes."}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {result.outcome !== "Currently Not Eligible" ? (
                <Button
                  size="lg"
                  asChild
                  className="rounded-lg bg-navy hover:bg-navy/90 text-white font-medium shadow-xs"
                >
                  <Link
                    to="/citizen/apply/$schemeId"
                    params={{ schemeId: selected.id }}
                  >
                    <span>Apply for {selected.name}</span>
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Link>
                </Button>
              ) : (
                <Button
                  size="lg"
                  asChild
                  className="rounded-lg bg-slate-900 text-white hover:bg-slate-800"
                >
                  <Link to="/schemes">
                    <span>Browse Alternate Schemes</span>
                    <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Link>
                </Button>
              )}

              <Button
                variant="outline"
                size="lg"
                asChild
                className="rounded-lg border-slate-300 dark:border-slate-700"
              >
                <Link to="/schemes/$id" params={{ id: selected.id }}>
                  <span>View Scheme Overview</span>
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                asChild
                className="rounded-lg border-slate-300 dark:border-slate-700"
              >
                <Link to="/schemes/$id" params={{ id: selected.id }} search={{ tab: "documents" }}>
                  <FileText className="h-4 w-4 mr-1 text-gov" />
                  <span>Required Documents</span>
                </Link>
              </Button>
            </div>
          </MiraCard>
        </div>
      ) : null}

      <div className="rounded-xl border border-border/60 bg-muted/20 p-4 text-xs text-muted-foreground flex items-start gap-2.5 leading-relaxed">
        <CircleHelp className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
        <span>
          Mira eligibility evaluations are statutory estimates based on available administrative rules. Official sanction is granted
          following field inspection, document verification, and determination by the competent authority.
        </span>
      </div>
    </PageContainer>
  );
}
