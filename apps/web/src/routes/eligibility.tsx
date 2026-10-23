import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleHelp,
  RotateCcw,
} from "lucide-react";
import { SCHEMES, STATES, type Scheme } from "@/lib/data";
import { evaluate, type Profile } from "@/lib/eligibility";
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
import { EligibilityResult } from "@/components/gov/EligibilityResult";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/eligibility")({
  validateSearch: (s: Record<string, unknown>): { scheme?: string } => ({
    scheme: typeof s.scheme === "string" ? s.scheme : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Check your eligibility — Mira" },
      {
        name: "description",
        content:
          "Find schemes and benefits you may qualify for based on your household information.",
      },
      { property: "og:title", content: "Check your eligibility — Mira" },
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

function Eligibility() {
  const { scheme: schemeParam } = Route.useSearch();
  const nav = useNavigate({ from: "/eligibility" });
  const { state } = useApp();
  const [schemeId, setSchemeId] = useState(schemeParam ?? "");
  const [profile, setProfile] = useState<Profile>({ ...EMPTY_PROFILE });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);
  const selected = SCHEMES.find((item) => item.id === schemeId);
  const result = selected && checked ? evaluate(selected, profile) : null;

  useEffect(() => {
    setSchemeId(schemeParam || "");
    setChecked(false);
  }, [schemeParam]);

  const chooseScheme = (id: string) => {
    setSchemeId(id);
    setChecked(false);
    void nav({ search: { scheme: id } });
  };
  const update = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    setProfile((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: "" }));
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
    setErrors({});
    void nav({ search: {} });
  };

  return (
    <PageContainer className="max-w-6xl">
      <PageHeader
        eyebrow="SCHEME FINDER"
        title="Check your eligibility"
        desc="Find schemes and benefits you may qualify for based on your household information."
      />
      <ol
        className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4"
        aria-label="Eligibility check steps"
      >
        {FLOW.map((label, index) => (
          <li
            key={label}
            aria-current={step === index ? "step" : undefined}
            className={`flex min-w-0 items-center gap-2 border-b-2 px-2 pb-3 pt-1 text-xs sm:px-3 sm:text-sm ${index === step ? "border-blue-700 text-slate-950" : index < step ? "border-teal-600 text-slate-700" : "border-slate-200 text-slate-500"}`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold ${index < step ? "border-teal-700 bg-teal-50 text-teal-800" : index === step ? "border-blue-700 text-blue-800" : "border-slate-300"}`}
            >
              {index < step ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                `0${index + 1}`
              )}
            </span>
            <span className="leading-4">{label}</span>
          </li>
        ))}
      </ol>

      {step < 3 ? (
        <Panel className="overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-4 sm:px-7">
            <p className="text-xs font-medium text-slate-500">
              Step 0{step + 1} of 04
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-950">
              {FLOW[step]}
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Your answers are used for this check; they won't update your
              citizen record.
            </p>
          </div>
          <div className="space-y-5 px-5 py-5 sm:px-7 sm:py-6">
            {step === 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="elig-age">Your age</Label>
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
                    aria-invalid={!!errors.age}
                    aria-describedby={errors.age ? "elig-age-error" : undefined}
                  />
                  {errors.age && (
                    <p
                      id="elig-age-error"
                      className="mt-1 text-sm text-destructive"
                      role="alert"
                    >
                      {errors.age}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="elig-gender">
                    Gender, if required by the scheme
                  </Label>
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
                      <SelectItem value="Other">
                        Prefer not to specify / other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            {step === 1 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="elig-income">
                    Annual household income (₹)
                  </Label>
                  <Input
                    id="elig-income"
                    type="number"
                    min="0"
                    inputMode="numeric"
                    value={profile.income || ""}
                    onChange={(event) =>
                      update("income", Number(event.target.value))
                    }
                    className="mt-1.5"
                    aria-invalid={!!errors.income}
                    aria-describedby={
                      errors.income ? "elig-income-error" : undefined
                    }
                  />
                  {errors.income && (
                    <p
                      id="elig-income-error"
                      className="mt-1 text-sm text-destructive"
                      role="alert"
                    >
                      {errors.income}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="elig-state">State or territory</Label>
                  <Select
                    value={profile.state}
                    onValueChange={(value) => update("state", value)}
                  >
                    <SelectTrigger id="elig-state" className="mt-1.5">
                      <SelectValue placeholder="Choose your location" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATES.filter((item) => item !== "All States").map(
                        (item) => (
                          <SelectItem value={item} key={item}>
                            {item}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  {errors.state && (
                    <p className="mt-1 text-sm text-destructive" role="alert">
                      {errors.state}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="elig-bpl">
                    Is your household listed as BPL?
                  </Label>
                  <Select
                    value={
                      profile.bpl === "unknown"
                        ? "unknown"
                        : profile.bpl
                          ? "yes"
                          : "no"
                    }
                    onValueChange={(value) =>
                      update(
                        "bpl",
                        value === "unknown" ? "unknown" : value === "yes",
                      )
                    }
                  >
                    <SelectTrigger id="elig-bpl" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unknown">Not sure</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="elig-pucca">
                    Does anyone in your household own a pucca house?
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
                      <SelectItem value="unknown">
                        Not sure / no record
                      </SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="yes">Yes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="elig-land">Cultivable land (hectares)</Label>
                  <Input
                    id="elig-land"
                    type="number"
                    min="0"
                    step="0.1"
                    value={profile.landHa || ""}
                    onChange={(event) =>
                      update("landHa", Number(event.target.value))
                    }
                    className="mt-1.5"
                    aria-invalid={!!errors.landHa}
                    aria-describedby={
                      errors.landHa ? "elig-land-error" : undefined
                    }
                  />
                  {errors.landHa && (
                    <p
                      id="elig-land-error"
                      className="mt-1 text-sm text-destructive"
                      role="alert"
                    >
                      {errors.landHa}
                    </p>
                  )}
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <Label htmlFor="elig-scheme">Choose a scheme</Label>
                  <Select value={schemeId} onValueChange={chooseScheme}>
                    <SelectTrigger id="elig-scheme" className="mt-1.5">
                      <SelectValue placeholder="Select a scheme" />
                    </SelectTrigger>
                    <SelectContent>
                      {SCHEMES.map((item: Scheme) => (
                        <SelectItem value={item.id} key={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.scheme && (
                    <p className="mt-1 text-sm text-destructive" role="alert">
                      {errors.scheme}
                    </p>
                  )}
                </div>
                {selected ? (
                  <div className="grid gap-5 border-t border-slate-100 pt-5 sm:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        Requirements
                      </h3>
                      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-5 text-slate-600">
                        {selected.eligibility.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        Documents to prepare
                      </h3>
                      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-5 text-slate-600">
                        {selected.documents.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                      <p className="mt-3 text-xs text-slate-500">
                        The final decision is made during application review.
                      </p>
                    </div>
                  </div>
                ) : (
                  <Empty
                    title="Choose a scheme to see its requirements"
                    body="You can change your selection later."
                    action={
                      <Button asChild variant="outline">
                        <Link to="/schemes">Browse schemes</Link>
                      </Button>
                    }
                  />
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-stone-50/70 px-5 py-4 sm:flex-row sm:justify-between sm:px-7">
            {step > 0 ? (
              <Button variant="outline" onClick={back}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            ) : (
              <span />
            )}
            {step === 2 ? (
              <Button onClick={next} disabled={!selected}>
                Check Eligibility
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={next}>
                Continue
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Panel>
      ) : result && selected ? (
        <div className="space-y-5">
          <Panel>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.13em] text-blue-700">
                  Eligibility result
                </p>
                <h2 className="mt-1 text-xl font-semibold text-slate-950">
                  {result.outcome === "Likely Eligible"
                    ? "You may be eligible"
                    : result.outcome === "Verification Required"
                      ? "More information is needed"
                      : "Not currently eligible"}
                </h2>
                <p className="mt-1 text-sm text-slate-600">{selected.name}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setStep(0);
                  setChecked(false);
                }}
              >
                <RotateCcw className="h-4 w-4" />
                Edit answers
              </Button>
            </div>
            <div className="mt-5">
              <EligibilityResult {...result} />
            </div>
          </Panel>
          <div className="flex flex-col gap-3 sm:flex-row">
            {result.outcome === "Currently Not Eligible" ? (
              <Button disabled>Apply for this scheme</Button>
            ) : (
              <Button asChild>
                <Link
                  to="/citizen/apply/$schemeId"
                  params={{ schemeId: selected.id }}
                >
                  Apply for this scheme
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link to="/schemes/$id" params={{ id: selected.id }}>
                View scheme details
              </Link>
            </Button>
          </div>
        </div>
      ) : null}
      <p className="mt-5 flex items-start gap-2 text-xs leading-5 text-slate-500">
        <CircleHelp className="mt-0.5 h-4 w-4 shrink-0" />
        This is an initial check based on the information you entered. It does
        not guarantee approval; the department confirms eligibility during
        application review.
      </p>
      {state.session?.apiToken && (
        <div className="mt-3 text-right">
          <Button variant="link" size="sm" onClick={reset}>
            Start over
          </Button>
        </div>
      )}
    </PageContainer>
  );
}
