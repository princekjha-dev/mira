import type { Scheme } from "./data";

export interface Profile {
  age: number;
  gender: "Female" | "Male" | "Other";
  income: number;
  bpl: boolean | "unknown";
  puccaHouse: "no" | "yes" | "unknown";
  landHa: number;
  priorHouseholdSchemes: string[];
  state: string;
}
export type CriterionStatus = "pass" | "verify" | "fail";
export interface Criterion {
  label: string;
  status: CriterionStatus;
  detail: string;
}
export type Outcome =
  "Likely Eligible" | "Verification Required" | "Currently Not Eligible";

export function evaluate(
  s: Scheme,
  p: Profile,
): { criteria: Criterion[]; outcome: Outcome } {
  const c: Criterion[] = [];
  if (s.ageMin !== undefined || s.ageMax !== undefined) {
    const ok =
      (s.ageMin === undefined || p.age >= s.ageMin) &&
      (s.ageMax === undefined || p.age <= s.ageMax);
    const range = `${s.ageMin ?? 0}${s.ageMax ? "–" + s.ageMax : "+"}`;
    c.push({
      label: "Age",
      status: ok ? "pass" : "fail",
      detail: ok
        ? `Age ${p.age} is within the required range (${range}).`
        : `Age ${p.age} is outside the required range (${range}).`,
    });
  }
  if (s.gender) {
    const ok = p.gender === s.gender;
    c.push({
      label: "Gender",
      status: ok ? "pass" : "fail",
      detail: ok
        ? "This scheme is for women applicants; criterion met."
        : "This scheme is only for women applicants.",
    });
  }
  if (s.incomeMax !== undefined) {
    const ok = p.income <= s.incomeMax;
    c.push({
      label: "Income",
      status: ok ? "pass" : "fail",
      detail: `Declared household income ₹${p.income.toLocaleString("en-IN")} ${ok ? "is within" : "exceeds"} the limit of ₹${s.incomeMax.toLocaleString("en-IN")}.`,
    });
  }
  if (s.bplRequired) {
    c.push({
      label: "Household criteria (BPL)",
      status: p.bpl === "unknown" ? "verify" : p.bpl ? "pass" : "fail",
      detail:
        p.bpl === "unknown"
          ? "BPL status is unknown and needs to be checked against your household record."
          : p.bpl
            ? "Household is listed as BPL."
            : "Scheme requires a BPL household; no BPL record found.",
    });
  }
  if (!s.states.includes("All States")) {
    const ok = s.states.includes(p.state);
    c.push({
      label: "State",
      status: ok ? "pass" : "fail",
      detail: ok
        ? `Scheme is available in ${p.state}.`
        : `Scheme is currently available only in: ${s.states.join(", ")}.`,
    });
  }
  if (s.property === "no-pucca-house") {
    const st: CriterionStatus =
      p.puccaHouse === "no"
        ? "pass"
        : p.puccaHouse === "yes"
          ? "fail"
          : "verify";
    c.push({
      label: "Property criteria",
      status: st,
      detail:
        st === "pass"
          ? "No pucca house recorded for the household."
          : st === "fail"
            ? "A pucca house is recorded in the household's name."
            : "Property records are incomplete — a land/house record check is required.",
    });
  }
  if (s.property === "land-under-2ha") {
    const st: CriterionStatus =
      p.landHa > 0 && p.landHa <= 2 ? "pass" : p.landHa > 2 ? "fail" : "verify";
    c.push({
      label: "Property criteria (land)",
      status: st,
      detail:
        st === "pass"
          ? `${p.landHa} ha cultivable land is within the 2 ha limit.`
          : st === "fail"
            ? `${p.landHa} ha exceeds the 2 ha limit.`
            : "No land record found — please upload land documents.",
    });
  }
  if (s.householdExclusive) {
    const conflict = p.priorHouseholdSchemes.includes(s.id);
    c.push({
      label: "Previous household benefit",
      status: conflict ? "verify" : "pass",
      detail: conflict
        ? "A similar household-level benefit may already exist. An officer will review."
        : "No conflicting household benefit found.",
    });
  }
  const outcome: Outcome = c.some((x) => x.status === "fail")
    ? "Currently Not Eligible"
    : c.some((x) => x.status === "verify")
      ? "Verification Required"
      : "Likely Eligible";
  return { criteria: c, outcome };
}

export const DEMO_PROFILE: Profile = {
  age: 42,
  gender: "Female",
  income: 120000,
  bpl: true,
  puccaHouse: "unknown",
  landHa: 0.8,
  priorHouseholdSchemes: ["health-cover"],
  state: "Uttar Pradesh",
};
