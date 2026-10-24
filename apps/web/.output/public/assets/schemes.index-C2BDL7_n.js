import { f as e, l as t, t as n, u as r } from "./button-KmRTh43o.js";
import {
  An as i,
  D as a,
  E as o,
  F as s,
  Lt as c,
  Pt as l,
  Rn as u,
  S as d,
  Tn as f,
  U as p,
  f as m,
  g as h,
  h as g,
  jn as _,
  l as v,
  m as y,
  p as b,
  q as x,
} from "./index-B8Y-_llO.js";
import { t as S } from "./SchemeCard-zxRJVe4M.js";
var C = e(r()),
  w = t(),
  T = `any`;
function E() {
  let e = v.useSearch(),
    t = u({ from: `/schemes/` }),
    [r, E] = (0, C.useState)(e.q ?? ``),
    [D, O] = (0, C.useState)({
      level: T,
      income: T,
      bpl: T,
      state: T,
      age: ``,
      gender: T,
      property: T,
    }),
    k = e.category ?? T,
    A = (0, C.useMemo)(
      () =>
        i.filter((t) => {
          let n = (e.q ?? ``).toLowerCase();
          if (
            (n &&
              !(t.name + t.description + t.department + t.category)
                .toLowerCase()
                .includes(n)) ||
            (k !== T && t.category !== k) ||
            (D.level !== T && t.level !== D.level) ||
            (D.income !== T &&
              t.incomeMax !== void 0 &&
              t.incomeMax < Number(D.income)) ||
            (D.bpl === `no` && t.bplRequired) ||
            (D.state !== T &&
              !t.states.includes(`All States`) &&
              !t.states.includes(D.state))
          )
            return !1;
          let r = Number(D.age);
          return !(
            (D.age &&
              ((t.ageMin && r < t.ageMin) || (t.ageMax && r > t.ageMax))) ||
            (D.gender === `Male` && t.gender === `Female`) ||
            (D.property === `none` && t.property === `land-under-2ha`) ||
            (D.property === `pucca` && t.property === `no-pucca-house`)
          );
        }),
      [e.q, k, D],
    ),
    j = (e, t, n) =>
      (0, w.jsxs)(`div`, {
        children: [
          (0, w.jsx)(x, { className: `text-xs`, children: t }),
          (0, w.jsxs)(m, {
            value: D[e],
            onValueChange: (t) => O({ ...D, [e]: t }),
            children: [
              (0, w.jsx)(g, { className: `mt-1`, children: (0, w.jsx)(h, {}) }),
              (0, w.jsxs)(b, {
                children: [
                  (0, w.jsx)(y, { value: T, children: `Any` }),
                  n.map(([e, t]) =>
                    (0, w.jsx)(y, { value: e, children: t }, e),
                  ),
                ],
              }),
            ],
          }),
        ],
      });
  return (0, w.jsxs)(o, {
    children: [
      (0, w.jsx)(a, {
        eyebrow: `SCHEMES & SERVICES`,
        title: `Find a scheme`,
        desc: `Filter by your situation. See clear eligibility criteria and apply when you're ready.`,
        crumbs: [{ label: `Home`, to: `/` }, { label: `Schemes` }],
      }),
      (0, w.jsxs)(`div`, {
        className: `grid gap-6 lg:grid-cols-[280px_1fr]`,
        children: [
          (0, w.jsxs)(s, {
            variant: `elevated`,
            className: `h-fit space-y-4 p-5 rounded-2xl`,
            "aria-label": `Filters`,
            children: [
              (0, w.jsxs)(`form`, {
                onSubmit: (n) => {
                  (n.preventDefault(), t({ search: { ...e, q: r || void 0 } }));
                },
                role: `search`,
                children: [
                  (0, w.jsx)(x, {
                    htmlFor: `q`,
                    className: `text-xs font-medium text-foreground`,
                    children: `Search`,
                  }),
                  (0, w.jsxs)(`div`, {
                    className: `mt-1 flex gap-2`,
                    children: [
                      (0, w.jsx)(p, {
                        id: `q`,
                        value: r,
                        onChange: (e) => E(e.target.value),
                        placeholder: `Search schemes by name or keyword`,
                        className: `h-9`,
                      }),
                      (0, w.jsx)(n, {
                        size: `icon`,
                        type: `submit`,
                        "aria-label": `Search`,
                        className: `h-9 w-9 shrink-0 tactile-btn`,
                        children: (0, w.jsx)(l, { className: `h-4 w-4` }),
                      }),
                    ],
                  }),
                ],
              }),
              (0, w.jsxs)(`div`, {
                children: [
                  (0, w.jsx)(x, {
                    className: `text-xs font-medium text-foreground`,
                    children: `Scheme category`,
                  }),
                  (0, w.jsxs)(m, {
                    value: k,
                    onValueChange: (n) =>
                      t({ search: { ...e, category: n === T ? void 0 : n } }),
                    children: [
                      (0, w.jsx)(g, {
                        className: `mt-1`,
                        children: (0, w.jsx)(h, {}),
                      }),
                      (0, w.jsxs)(b, {
                        children: [
                          (0, w.jsx)(y, {
                            value: T,
                            children: `All categories`,
                          }),
                          f.map((e) =>
                            (0, w.jsx)(y, { value: e, children: e }, e),
                          ),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              j(`level`, `Individual / Household`, [
                [`Individual`, `Individual`],
                [`Household`, `Household`],
              ]),
              j(`income`, `Annual household income`, [
                [`100000`, `Up to ₹1,00,000`],
                [`200000`, `₹1,00,001 – ₹2,00,000`],
                [`300000`, `₹2,00,001 – ₹3,00,000`],
                [`500000`, `Above ₹3,00,000`],
              ]),
              j(`bpl`, `BPL status`, [
                [`yes`, `BPL household`],
                [`no`, `Not BPL`],
              ]),
              j(
                `state`,
                `State`,
                _.slice(1).map((e) => [e, e]),
              ),
              (0, w.jsxs)(`div`, {
                children: [
                  (0, w.jsx)(x, {
                    htmlFor: `age`,
                    className: `text-xs font-medium text-foreground`,
                    children: `Age`,
                  }),
                  (0, w.jsx)(p, {
                    id: `age`,
                    type: `number`,
                    min: 0,
                    max: 120,
                    value: D.age,
                    onChange: (e) => O({ ...D, age: e.target.value }),
                    className: `mt-1 h-9`,
                    placeholder: `e.g. 42`,
                  }),
                ],
              }),
              j(`gender`, `Gender (where applicable)`, [
                [`Female`, `Female`],
                [`Male`, `Male`],
              ]),
              j(`property`, `Property criteria`, [
                [`none`, `No land / house`],
                [`kutcha`, `Kutcha house`],
                [`pucca`, `Own pucca house`],
              ]),
              (0, w.jsxs)(n, {
                variant: `outline`,
                className: `w-full tactile-btn h-9`,
                onClick: () => {
                  (O({
                    level: T,
                    income: T,
                    bpl: T,
                    state: T,
                    age: ``,
                    gender: T,
                    property: T,
                  }),
                    E(``),
                    t({ search: {} }));
                },
                children: [
                  (0, w.jsx)(c, { className: `mr-1.5 h-3.5 w-3.5` }),
                  `Reset filters`,
                ],
              }),
            ],
          }),
          (0, w.jsxs)(`div`, {
            children: [
              (0, w.jsxs)(`p`, {
                className: `mb-3 text-sm text-muted-foreground`,
                "aria-live": `polite`,
                children: [
                  A.length,
                  ` scheme`,
                  A.length !== 1 && `s`,
                  ` found`,
                ],
              }),
              A.length
                ? (0, w.jsx)(`div`, {
                    className: `grid gap-4 md:grid-cols-2 xl:grid-cols-3`,
                    children: A.map((e) => (0, w.jsx)(S, { s: e }, e.id)),
                  })
                : (0, w.jsx)(d, {
                    title: `No schemes match these filters`,
                    body: `Try removing a filter or searching a different keyword.`,
                  }),
            ],
          }),
        ],
      }),
    ],
  });
}
export { E as component };
