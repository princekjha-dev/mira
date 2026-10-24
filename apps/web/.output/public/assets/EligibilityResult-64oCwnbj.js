import { l as e, r as t } from "./button-KmRTh43o.js";
import { en as n, jt as r, nn as i } from "./index-B8Y-_llO.js";
function a(e, t) {
  let n = [];
  if (e.ageMin !== void 0 || e.ageMax !== void 0) {
    let r =
        (e.ageMin === void 0 || t.age >= e.ageMin) &&
        (e.ageMax === void 0 || t.age <= e.ageMax),
      i = `${e.ageMin ?? 0}${e.ageMax ? `–` + e.ageMax : `+`}`;
    n.push({
      label: `Age`,
      status: r ? `pass` : `fail`,
      detail: r
        ? `Age ${t.age} is within the required range (${i}).`
        : `Age ${t.age} is outside the required range (${i}).`,
    });
  }
  if (e.gender) {
    let r = t.gender === e.gender;
    n.push({
      label: `Gender`,
      status: r ? `pass` : `fail`,
      detail: r
        ? `This scheme is for women applicants; criterion met.`
        : `This scheme is only for women applicants.`,
    });
  }
  if (e.incomeMax !== void 0) {
    let r = t.income <= e.incomeMax;
    n.push({
      label: `Income`,
      status: r ? `pass` : `fail`,
      detail: `Declared household income ₹${t.income.toLocaleString(`en-IN`)} ${r ? `is within` : `exceeds`} the limit of ₹${e.incomeMax.toLocaleString(`en-IN`)}.`,
    });
  }
  if (
    (e.bplRequired &&
      n.push({
        label: `Household criteria (BPL)`,
        status: t.bpl === `unknown` ? `verify` : t.bpl ? `pass` : `fail`,
        detail:
          t.bpl === `unknown`
            ? `BPL status is unknown and needs to be checked against your household record.`
            : t.bpl
              ? `Household is listed as BPL.`
              : `Scheme requires a BPL household; no BPL record found.`,
      }),
    !e.states.includes(`All States`))
  ) {
    let r = e.states.includes(t.state);
    n.push({
      label: `State`,
      status: r ? `pass` : `fail`,
      detail: r
        ? `Scheme is available in ${t.state}.`
        : `Scheme is currently available only in: ${e.states.join(`, `)}.`,
    });
  }
  if (e.property === `no-pucca-house`) {
    let e =
      t.puccaHouse === `no`
        ? `pass`
        : t.puccaHouse === `yes`
          ? `fail`
          : `verify`;
    n.push({
      label: `Property criteria`,
      status: e,
      detail:
        e === `pass`
          ? `No pucca house recorded for the household.`
          : e === `fail`
            ? `A pucca house is recorded in the household's name.`
            : `Property records are incomplete — a land/house record check is required.`,
    });
  }
  if (e.property === `land-under-2ha`) {
    let e =
      t.landHa > 0 && t.landHa <= 2 ? `pass` : t.landHa > 2 ? `fail` : `verify`;
    n.push({
      label: `Property criteria (land)`,
      status: e,
      detail:
        e === `pass`
          ? `${t.landHa} ha cultivable land is within the 2 ha limit.`
          : e === `fail`
            ? `${t.landHa} ha exceeds the 2 ha limit.`
            : `No land record found — please upload land documents.`,
    });
  }
  if (e.householdExclusive) {
    let r = t.priorHouseholdSchemes.includes(e.id);
    n.push({
      label: `Previous household benefit`,
      status: r ? `verify` : `pass`,
      detail: r
        ? `A similar household-level benefit may already exist. An officer will review.`
        : `No conflicting household benefit found.`,
    });
  }
  return {
    criteria: n,
    outcome: n.some((e) => e.status === `fail`)
      ? `Currently Not Eligible`
      : n.some((e) => e.status === `verify`)
        ? `Verification Required`
        : `Likely Eligible`,
  };
}
var o = {
    age: 42,
    gender: `Female`,
    income: 12e4,
    bpl: !0,
    puccaHouse: `unknown`,
    landHa: 0.8,
    priorHouseholdSchemes: [`health-cover`],
    state: `Uttar Pradesh`,
  },
  s = e(),
  c = { pass: i, verify: r, fail: n },
  l = {
    pass: `text-success`,
    verify: `text-warning`,
    fail: `text-destructive`,
  },
  u = { pass: `Eligible`, verify: `Verification Required`, fail: `Not met` };
function d({ criteria: e, outcome: n }) {
  let r =
    n === `Likely Eligible`
      ? `border-success/40 bg-success/5`
      : n === `Verification Required`
        ? `border-warning/50 bg-warning/5`
        : `border-destructive/40 bg-destructive/5`;
  return (0, s.jsxs)(`div`, {
    className: `space-y-4`,
    children: [
      (0, s.jsx)(`ul`, {
        className: `divide-y rounded-lg border bg-card`,
        children: e.map((e) => {
          let n = c[e.status];
          return (0, s.jsxs)(
            `li`,
            {
              className: `flex gap-3 p-3`,
              children: [
                (0, s.jsx)(n, {
                  className: t(`mt-0.5 h-5 w-5 shrink-0`, l[e.status]),
                  "aria-hidden": !0,
                }),
                (0, s.jsxs)(`div`, {
                  className: `min-w-0 flex-1`,
                  children: [
                    (0, s.jsxs)(`div`, {
                      className: `flex flex-wrap items-center justify-between gap-2`,
                      children: [
                        (0, s.jsx)(`p`, {
                          className: `font-medium`,
                          children: e.label,
                        }),
                        (0, s.jsx)(`span`, {
                          className: t(`text-sm font-medium`, l[e.status]),
                          children: u[e.status],
                        }),
                      ],
                    }),
                    (0, s.jsx)(`p`, {
                      className: `text-sm text-muted-foreground`,
                      children: e.detail,
                    }),
                  ],
                }),
              ],
            },
            e.label,
          );
        }),
      }),
      (0, s.jsxs)(`div`, {
        className: t(`rounded-lg border-2 p-4`, r),
        role: `status`,
        children: [
          (0, s.jsx)(`p`, {
            className: `text-xs uppercase tracking-wide text-muted-foreground`,
            children: `Final status`,
          }),
          (0, s.jsx)(`p`, { className: `text-lg font-semibold`, children: n }),
          (0, s.jsxs)(`p`, {
            className: `mt-1 text-sm text-muted-foreground`,
            children: [
              n === `Likely Eligible` &&
                `All criteria are met based on the information available. Final approval is made by the officer after document verification.`,
              n === `Verification Required` &&
                `Some criteria need record or document checks (shown above with ⚠). You can still apply; an officer will verify.`,
              n === `Currently Not Eligible` &&
                `One or more criteria are not met (shown above with ✕). If your records are outdated, you can update them and check again.`,
            ],
          }),
        ],
      }),
    ],
  });
}
export { o as n, a as r, d as t };
