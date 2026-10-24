import {
  c as e,
  f as t,
  l as n,
  r,
  t as i,
  u as a,
} from "./button-KmRTh43o.js";
import { t as o } from "./link-gIn96cdo.js";
import { t as s } from "./CommentsThread-8Z0QX0oi.js";
import { t as c } from "./camera-O7_j0XUn.js";
import { t as l } from "./download-DTWQ6dGd.js";
import { t as u } from "./file-up-CoMCr36d.js";
import { r as d } from "./dist-oqSnxn6U.js";
import { t as f } from "./dist-D4DH1YF3.js";
import {
  $ as p,
  D as m,
  Fn as h,
  M as g,
  N as _,
  Nn as v,
  O as y,
  Pn as b,
  Q as x,
  Rt as S,
  S as C,
  Tt as w,
  Ut as T,
  X as E,
  Y as D,
  Z as O,
  Zt as k,
  en as A,
  et as j,
  fn as M,
  j as N,
  jt as P,
  mn as ee,
  nn as F,
  q as te,
  s as ne,
} from "./index-B8Y-_llO.js";
var re = e(`image-up`, [
    [
      `path`,
      {
        d: `M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21`,
        key: `9csbqa`,
      },
    ],
    [`path`, { d: `m14 19.5 3-3 3 3`, key: `9vmjn0` }],
    [`path`, { d: `M17 22v-5.5`, key: `1aa6fl` }],
    [`circle`, { cx: `9`, cy: `9`, r: `2`, key: `af1f0g` }],
  ]),
  I = e(`info`, [
    [`circle`, { cx: `12`, cy: `12`, r: `10`, key: `1mglay` }],
    [`path`, { d: `M12 16v-4`, key: `1dtifu` }],
    [`path`, { d: `M12 8h.01`, key: `e9boi3` }],
  ]),
  L = e(`trash-2`, [
    [`path`, { d: `M10 11v6`, key: `nco0om` }],
    [`path`, { d: `M14 11v6`, key: `outv1u` }],
    [`path`, { d: `M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6`, key: `miytrc` }],
    [`path`, { d: `M3 6h18`, key: `d0wm0j` }],
    [`path`, { d: `M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2`, key: `e791ji` }],
  ]),
  R = t(a(), 1),
  z = n(),
  B = Object.defineProperty,
  V = (e, t) => B(e, `name`, { value: t, configurable: !0 }),
  H = `Progress`,
  U = 100,
  [W, ie] = d(H),
  [ae, oe] = W(H),
  G = R.forwardRef(
    V(function (e, t) {
      let {
        __scopeProgress: n,
        value: r = null,
        max: i,
        getValueLabel: a = K,
        ...o
      } = e;
      (i || i === 0) && !Y(i) && console.error(Z(`${i}`, `Progress`));
      let s = Y(i) ? i : U;
      r !== null && !X(r, s) && console.error(Q(`${r}`, `Progress`));
      let c = X(r, s) ? r : null,
        l = J(c) ? a(c, s) : void 0;
      return (0, z.jsx)(ae, {
        scope: n,
        value: c,
        max: s,
        children: (0, z.jsx)(f.div, {
          "aria-valuemax": s,
          "aria-valuemin": 0,
          "aria-valuenow": J(c) ? c : void 0,
          "aria-valuetext": l,
          role: `progressbar`,
          "data-state": q(c, s),
          "data-value": c ?? void 0,
          "data-max": s,
          ...o,
          ref: t,
        }),
      });
    }, `Progress`),
  ),
  se = `ProgressIndicator`,
  ce = R.forwardRef(
    V(function (e, t) {
      let { __scopeProgress: n, ...r } = e,
        i = oe(se, n);
      return (0, z.jsx)(f.div, {
        "data-state": q(i.value, i.max),
        "data-value": i.value ?? void 0,
        "data-max": i.max,
        ...r,
        ref: t,
      });
    }, `ProgressIndicator`),
  );
function K(e, t) {
  return `${Math.round((e / t) * 100)}%`;
}
V(K, `defaultGetValueLabel`);
function q(e, t) {
  return e == null ? `indeterminate` : e === t ? `complete` : `loading`;
}
V(q, `getProgressState`);
function J(e) {
  return typeof e == `number`;
}
V(J, `isNumber`);
function Y(e) {
  return J(e) && !isNaN(e) && e > 0;
}
V(Y, `isValidMaxNumber`);
function X(e, t) {
  return J(e) && !isNaN(e) && e <= t && e >= 0;
}
V(X, `isValidValueNumber`);
function Z(e, t) {
  return `Invalid prop \`max\` of value \`${e}\` supplied to \`${t}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${U}\`.`;
}
V(Z, `getInvalidMaxError`);
function Q(e, t) {
  return `Invalid prop \`value\` of value \`${e}\` supplied to \`${t}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${U} if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`;
}
V(Q, `getInvalidValueError`);
var $ = R.forwardRef(({ className: e, value: t, ...n }, i) =>
  (0, z.jsx)(G, {
    ref: i,
    className: r(
      `relative h-2 w-full overflow-hidden rounded-full bg-primary/20`,
      e,
    ),
    ...n,
    children: (0, z.jsx)(ce, {
      className: `h-full w-full flex-1 bg-primary transition-all`,
      style: { transform: `translateX(-${100 - (t || 0)}%)` },
    }),
  }),
);
$.displayName = G.displayName;
var le = [
  `Uploading`,
  `Reading document`,
  `Extracting information`,
  `Checking format`,
  `Validating information`,
  `Complete`,
];
function ue(e, t, n) {
  if (!(t.type === `application/pdf` || t.type.startsWith(`image/`)))
    return { result: `Unreadable document` };
  let r = t.name.toLowerCase();
  return r.includes(`expired`) || r.includes(`2019`)
    ? { result: `Expired document` }
    : e === `Income Certificate` && n !== void 0 && n !== 145e3
      ? {
          result: `Mismatch detected`,
          mismatch: {
            field: `Annual household income`,
            declared: h(n),
            document: h(145e3),
          },
        }
      : e.startsWith(`Property`)
        ? { result: `Manual verification required` }
        : { result: `Verified` };
}
var de = {
  Verified: {
    icon: F,
    cls: `text-success`,
    msg: `Document details match your records.`,
  },
  "Missing information": {
    icon: P,
    cls: `text-warning`,
    msg: `Some required fields could not be found. Please upload a complete copy.`,
  },
  "Mismatch detected": {
    icon: P,
    cls: `text-warning`,
    msg: `Values do not match. Please review or submit supporting evidence.`,
  },
  "Unreadable document": {
    icon: A,
    cls: `text-destructive`,
    msg: `We could not read this file. Upload a clear PDF, JPG or PNG.`,
  },
  "Expired document": {
    icon: P,
    cls: `text-warning`,
    msg: `This document appears to be expired. Please upload a current copy.`,
  },
  "Manual verification required": {
    icon: P,
    cls: `text-gov`,
    msg: `An officer will verify this document manually. No action needed now.`,
  },
};
function fe({
  docType: e,
  required: t,
  declaredIncome: n,
  value: a,
  onChange: o,
}) {
  let s = (0, R.useRef)(null),
    l = (0, R.useRef)(null),
    [d, f] = (0, R.useState)(-1),
    [m, h] = (0, R.useState)(0),
    [g, _] = (0, R.useState)(null),
    [v, y] = (0, R.useState)(!1);
  (0, R.useEffect)(() => {
    if (!g) return;
    let t = 0,
      r = 0;
    (f(0), h(0));
    let i = setInterval(() => {
      if (t === 0) {
        ((r += 20), h(r), r >= 100 && ((t = 1), f(1)));
        return;
      }
      if (((t += 1), f(t), t >= 5)) {
        clearInterval(i);
        let t = ue(e, g, n);
        (o({ name: g.name, size: g.size, url: URL.createObjectURL(g), ...t }),
          t.result === `Verified`
            ? w.success(`${e} verified`)
            : w.warning(`${e}: ${t.result}`),
          _(null));
      }
    }, 350);
    return () => clearInterval(i);
  }, [g]);
  let b = (e) => {
      if (e) {
        if (e.size > 5242880) {
          w.error(`File is larger than 5 MB`);
          return;
        }
        _(e);
      }
    },
    x = g !== null,
    C = a ? de[a.result] : null;
  return (0, z.jsxs)(`div`, {
    className: r(
      `rounded-lg border bg-card p-4`,
      a?.result === `Mismatch detected` && `border-warning/60`,
    ),
    children: [
      (0, z.jsxs)(`div`, {
        className: `flex items-start justify-between gap-2`,
        children: [
          (0, z.jsxs)(`div`, {
            children: [
              (0, z.jsx)(`p`, { className: `font-medium`, children: e }),
              (0, z.jsxs)(`p`, {
                className: `text-xs text-muted-foreground`,
                children: [
                  t ? `Required` : `Optional`,
                  ` · PDF, JPG or PNG up to 5 MB`,
                ],
              }),
            ],
          }),
          a &&
            C &&
            (0, z.jsxs)(`span`, {
              className: r(
                `flex items-center gap-1 text-xs font-medium`,
                C.cls,
              ),
              children: [
                (0, z.jsx)(C.icon, { className: `h-4 w-4` }),
                a.result,
              ],
            }),
        ],
      }),
      (0, z.jsx)(`input`, {
        ref: s,
        type: `file`,
        accept: `application/pdf,image/*`,
        className: `hidden`,
        onChange: (e) => {
          (b(e.target.files?.[0]), (e.target.value = ``));
        },
        "aria-label": `Upload ${e}`,
      }),
      (0, z.jsx)(`input`, {
        ref: l,
        type: `file`,
        accept: `image/*`,
        capture: `environment`,
        className: `hidden`,
        onChange: (e) => {
          (b(e.target.files?.[0]), (e.target.value = ``));
        },
        "aria-label": `Capture ${e}`,
      }),
      x &&
        (0, z.jsxs)(`div`, {
          className: `mt-3 space-y-2`,
          "aria-live": `polite`,
          children: [
            (0, z.jsxs)(`p`, {
              className: `truncate text-sm`,
              children: [g.name, ` · `, (g.size / 1024).toFixed(0), ` KB`],
            }),
            d === 0 && (0, z.jsx)($, { value: m }),
            (0, z.jsx)(`ol`, {
              className: `grid grid-cols-2 gap-1 text-xs sm:grid-cols-3`,
              children: le.map((e, t) =>
                (0, z.jsxs)(
                  `li`,
                  {
                    className: r(
                      `flex items-center gap-1`,
                      t < d
                        ? `text-success`
                        : t === d
                          ? `font-medium text-navy`
                          : `text-muted-foreground`,
                    ),
                    children: [
                      t < d
                        ? (0, z.jsx)(F, { className: `h-3 w-3` })
                        : t === d
                          ? (0, z.jsx)(T, { className: `h-3 w-3 animate-spin` })
                          : (0, z.jsx)(`span`, {
                              className: `h-3 w-3 rounded-full border`,
                            }),
                      e,
                    ],
                  },
                  e,
                ),
              ),
            }),
          ],
        }),
      !x &&
        a &&
        C &&
        (0, z.jsxs)(`div`, {
          className: `mt-3 space-y-2`,
          children: [
            (0, z.jsxs)(`p`, {
              className: `truncate text-sm`,
              children: [a.name, ` · `, (a.size / 1024).toFixed(0), ` KB`],
            }),
            (0, z.jsx)(`p`, {
              className: `text-xs text-muted-foreground`,
              children: C.msg,
            }),
            a.mismatch &&
              (0, z.jsxs)(`div`, {
                className: `rounded-md border border-warning/50 bg-warning/10 p-3 text-sm`,
                children: [
                  (0, z.jsxs)(`p`, {
                    className: `font-medium`,
                    children: [`Field: `, a.mismatch.field],
                  }),
                  (0, z.jsxs)(`div`, {
                    className: `mt-1 grid grid-cols-2 gap-2`,
                    children: [
                      (0, z.jsxs)(`div`, {
                        children: [
                          (0, z.jsx)(`p`, {
                            className: `text-xs text-muted-foreground`,
                            children: `Application`,
                          }),
                          (0, z.jsx)(`p`, {
                            className: `font-semibold`,
                            children: a.mismatch.declared,
                          }),
                        ],
                      }),
                      (0, z.jsxs)(`div`, {
                        children: [
                          (0, z.jsx)(`p`, {
                            className: `text-xs text-muted-foreground`,
                            children: e,
                          }),
                          (0, z.jsx)(`p`, {
                            className: `font-semibold`,
                            children: a.mismatch.document,
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, z.jsx)(`p`, {
                    className: `mt-2 text-xs`,
                    children: `Income values do not match. Please review or submit supporting evidence. Your application will not be rejected for this — it will be reviewed by an officer.`,
                  }),
                ],
              }),
            (0, z.jsxs)(`div`, {
              className: `flex flex-wrap gap-2`,
              children: [
                (0, z.jsxs)(i, {
                  size: `sm`,
                  variant: `outline`,
                  onClick: () => y(!0),
                  children: [
                    (0, z.jsx)(k, { className: `mr-1 h-3.5 w-3.5` }),
                    `Preview`,
                  ],
                }),
                (0, z.jsxs)(i, {
                  size: `sm`,
                  variant: `outline`,
                  onClick: () => s.current?.click(),
                  children: [
                    (0, z.jsx)(S, { className: `mr-1 h-3.5 w-3.5` }),
                    `Replace`,
                  ],
                }),
                (0, z.jsxs)(i, {
                  size: `sm`,
                  variant: `ghost`,
                  onClick: () => {
                    (o(void 0), w.info(`${e} removed`));
                  },
                  children: [
                    (0, z.jsx)(L, { className: `mr-1 h-3.5 w-3.5` }),
                    `Remove`,
                  ],
                }),
              ],
            }),
          ],
        }),
      !x &&
        !a &&
        (0, z.jsxs)(`div`, {
          className: `mt-3 flex flex-wrap gap-2`,
          children: [
            (0, z.jsxs)(i, {
              size: `sm`,
              variant: `outline`,
              onClick: () => s.current?.click(),
              children: [
                (0, z.jsx)(u, { className: `mr-1 h-3.5 w-3.5` }),
                `Upload PDF`,
              ],
            }),
            (0, z.jsxs)(i, {
              size: `sm`,
              variant: `outline`,
              onClick: () => s.current?.click(),
              children: [
                (0, z.jsx)(re, { className: `mr-1 h-3.5 w-3.5` }),
                `Upload image`,
              ],
            }),
            (0, z.jsxs)(i, {
              size: `sm`,
              variant: `outline`,
              onClick: () => l.current?.click(),
              children: [
                (0, z.jsx)(c, { className: `mr-1 h-3.5 w-3.5` }),
                `Mobile capture`,
              ],
            }),
          ],
        }),
      (0, z.jsx)(D, {
        open: v,
        onOpenChange: y,
        children: (0, z.jsxs)(E, {
          className: `max-w-3xl`,
          children: [
            (0, z.jsx)(p, { children: (0, z.jsx)(j, { children: a?.name }) }),
            a &&
              (a.name.toLowerCase().endsWith(`.pdf`)
                ? (0, z.jsx)(`iframe`, {
                    src: a.url,
                    title: a.name,
                    className: `h-[70vh] w-full rounded border`,
                  })
                : (0, z.jsx)(`img`, {
                    src: a.url,
                    alt: e,
                    className: `max-h-[70vh] w-full object-contain`,
                  })),
          ],
        }),
      }),
    ],
  });
}
function pe() {
  let { id: e } = ne.useParams(),
    { state: t, updateApp: n, addAudit: r, submitAppEvidence: a } = ee(),
    c = t.applications.find((t) => t.id === e || t.rawId === e),
    [u, d] = (0, R.useState)(null),
    [f, h] = (0, R.useState)(``),
    [S, T] = (0, R.useState)();
  if (!c)
    return (0, z.jsx)(C, {
      title: `Application not found`,
      body: `No application with ID ${e}.`,
      action: (0, z.jsx)(i, {
        asChild: !0,
        children: (0, z.jsx)(o, {
          to: `/citizen/applications`,
          children: `Back to applications`,
        }),
      }),
    });
  let k = b(c.schemeId) || {
      id: c.schemeId,
      name: c.schemeName || `Welfare Assistance Scheme`,
      level: `Individual`,
      documents: [`Income Certificate`, `Residence Certificate`],
    },
    A = async (e) => {
      if (f.trim().length < 10) {
        w.error(`Please write at least 10 characters`);
        return;
      }
      let i = c.rawId || c.id,
        o = c.metadata?.evidence_requests?.[0]?.id || `EV-RESP`;
      try {
        (await a(i, { request_id: o, explanation: f.trim() }),
          w.success(`${e} submitted and forwarded to reviewing officer.`));
      } catch {
        n(
          c.id,
          { status: `Officer Review`, stage: Math.max(c.stage, 4) },
          `${e}: “${f.trim()}”`,
          c.applicant,
        );
      }
      (r({
        actor: `${t.session?.name} (${t.session?.id})`,
        action: e,
        application: c.id,
        prev: c.status,
        next: `Officer Review`,
        reason: f.trim().slice(0, 80),
      }),
        h(``),
        d(null));
    },
    F = async () => {
      if (!S) {
        w.error(`Upload a document first`);
        return;
      }
      let e = c.rawId || c.id,
        i = c.metadata?.evidence_requests?.[0]?.id || `EV-DOC`;
      try {
        (await a(e, {
          request_id: i,
          explanation: `Evidence uploaded: ${S.name}`,
        }),
          w.success(`Document submitted for verification in officer portal.`));
      } catch {
        n(
          c.id,
          { status: `Documents Under Review` },
          `Evidence uploaded: ${S.name}`,
          c.applicant,
        );
      }
      (r({
        actor: `${t.session?.name} (${t.session?.id})`,
        action: `Document uploaded`,
        application: c.id,
        prev: c.status,
        next: `Documents Under Review`,
        reason: S.name,
      }),
        T(void 0),
        d(null));
    };
  return (0, z.jsxs)(`div`, {
    children: [
      (0, z.jsx)(m, {
        title: k.name,
        desc: `${c.id} · Applicant: ${c.applicant}`,
        crumbs: [
          { label: `My Applications`, to: `/citizen/applications` },
          { label: c.id },
        ],
        actions:
          c.status === `Draft`
            ? (0, z.jsx)(i, {
                asChild: !0,
                children: (0, z.jsx)(o, {
                  to: `/citizen/apply/$schemeId`,
                  params: { schemeId: c.schemeId },
                  children: `Continue application`,
                }),
              })
            : (0, z.jsxs)(i, {
                variant: `outline`,
                onClick: () => M(c, k.name),
                children: [
                  (0, z.jsx)(l, { className: `mr-1 h-4 w-4` }),
                  `Download acknowledgement`,
                ],
              }),
      }),
      (0, z.jsxs)(`div`, {
        className: `grid gap-6 lg:grid-cols-[1.4fr_1fr]`,
        children: [
          (0, z.jsxs)(`div`, {
            className: `space-y-6`,
            children: [
              (0, z.jsxs)(y, {
                title: `Status`,
                children: [
                  (0, z.jsxs)(`div`, {
                    className: `flex flex-wrap items-center gap-3`,
                    children: [
                      (0, z.jsx)(N, { s: c.status }),
                      (0, z.jsxs)(`span`, {
                        className: `text-sm text-muted-foreground`,
                        children: [`Last updated `, v(c.updatedOn)],
                      }),
                    ],
                  }),
                  c.status === `Draft` &&
                    (0, z.jsx)(`p`, {
                      className: `mt-3 text-sm`,
                      children: `This application has not been submitted. Your progress is saved automatically.`,
                    }),
                  c.status === `Additional Evidence Required` &&
                    (0, z.jsxs)(`div`, {
                      className: `mt-3 rounded-md border border-warning/50 bg-warning/10 p-3 text-sm`,
                      children: [
                        (0, z.jsx)(`p`, {
                          className: `font-medium`,
                          children: `The officer has asked for additional evidence.`,
                        }),
                        (0, z.jsx)(`p`, {
                          className: `mt-1`,
                          children: c.events.at(-1)?.text,
                        }),
                        (0, z.jsxs)(`div`, {
                          className: `mt-3 flex flex-wrap gap-2`,
                          children: [
                            (0, z.jsx)(i, {
                              size: `sm`,
                              onClick: () => d(`upload`),
                              children: `Upload Missing Document`,
                            }),
                            (0, z.jsx)(i, {
                              size: `sm`,
                              variant: `outline`,
                              onClick: () => d(`respond`),
                              children: `Respond to Officer`,
                            }),
                          ],
                        }),
                      ],
                    }),
                  c.decision &&
                    (0, z.jsxs)(`div`, {
                      className: `mt-3 rounded-md border p-3 text-sm`,
                      children: [
                        (0, z.jsxs)(`p`, {
                          className: `font-medium`,
                          children: [`Decision: `, c.decision.outcome],
                        }),
                        (0, z.jsxs)(`p`, {
                          className: `text-muted-foreground`,
                          children: [`Reason: `, c.decision.reason],
                        }),
                        c.decision.note &&
                          (0, z.jsxs)(`p`, {
                            className: `text-muted-foreground`,
                            children: [`Officer note: `, c.decision.note],
                          }),
                        (0, z.jsxs)(`p`, {
                          className: `mt-1 text-xs text-muted-foreground`,
                          children: [
                            `By `,
                            c.decision.by,
                            ` on `,
                            v(c.decision.date),
                          ],
                        }),
                      ],
                    }),
                ],
              }),
              c.duplicate &&
                c.status === `Verification Required` &&
                (0, z.jsxs)(y, {
                  title: `Verification Required`,
                  children: [
                    (0, z.jsxs)(`div`, {
                      className: `flex gap-3`,
                      children: [
                        (0, z.jsx)(I, {
                          className: `h-5 w-5 shrink-0 text-warning`,
                        }),
                        (0, z.jsxs)(`div`, {
                          children: [
                            (0, z.jsx)(`p`, {
                              className: `text-sm font-medium`,
                              children: `A similar household-level benefit may already exist.`,
                            }),
                            (0, z.jsx)(`p`, {
                              className: `mt-1 text-sm text-muted-foreground`,
                              children: `This is not a rejection. An officer will review the records and make the final decision. You can help by explaining your situation.`,
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, z.jsxs)(`div`, {
                      className: `mt-4 flex flex-wrap gap-2`,
                      children: [
                        (0, z.jsx)(i, {
                          size: `sm`,
                          variant: `outline`,
                          onClick: () => d(`reason`),
                          children: `View reason`,
                        }),
                        (0, z.jsx)(i, {
                          size: `sm`,
                          variant: `outline`,
                          onClick: () => d(`clarify`),
                          children: `Provide clarification`,
                        }),
                        (0, z.jsx)(i, {
                          size: `sm`,
                          variant: `outline`,
                          onClick: () => d(`upload`),
                          children: `Upload evidence`,
                        }),
                        (0, z.jsx)(i, {
                          size: `sm`,
                          onClick: () => d(`review`),
                          children: `Request review`,
                        }),
                      ],
                    }),
                  ],
                }),
              c.mismatch &&
                (0, z.jsx)(y, {
                  title: `Information mismatch`,
                  children: (0, z.jsxs)(`div`, {
                    className: `flex gap-3`,
                    children: [
                      (0, z.jsx)(P, {
                        className: `h-5 w-5 shrink-0 text-warning`,
                      }),
                      (0, z.jsxs)(`div`, {
                        className: `flex-1 text-sm`,
                        children: [
                          (0, z.jsx)(`p`, {
                            className: `font-medium`,
                            children: c.mismatch.field,
                          }),
                          (0, z.jsxs)(`div`, {
                            className: `mt-2 grid grid-cols-2 gap-3 rounded-md border p-3`,
                            children: [
                              (0, z.jsxs)(`div`, {
                                children: [
                                  (0, z.jsx)(`p`, {
                                    className: `text-xs text-muted-foreground`,
                                    children: `Application`,
                                  }),
                                  (0, z.jsx)(`p`, {
                                    className: `font-semibold`,
                                    children: c.mismatch.declared,
                                  }),
                                ],
                              }),
                              (0, z.jsxs)(`div`, {
                                children: [
                                  (0, z.jsx)(`p`, {
                                    className: `text-xs text-muted-foreground`,
                                    children: c.mismatch.source,
                                  }),
                                  (0, z.jsx)(`p`, {
                                    className: `font-semibold`,
                                    children: c.mismatch.document,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          (0, z.jsx)(`p`, {
                            className: `mt-2`,
                            children: `Income values do not match. Please review or submit supporting evidence.`,
                          }),
                          (0, z.jsx)(i, {
                            size: `sm`,
                            variant: `outline`,
                            className: `mt-3`,
                            onClick: () => d(`upload`),
                            children: `Submit supporting evidence`,
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
              (0, z.jsx)(y, {
                title: `Activity`,
                children:
                  c.events.length === 0
                    ? (0, z.jsx)(`p`, {
                        className: `text-sm text-muted-foreground`,
                        children: `No activity yet.`,
                      })
                    : (0, z.jsx)(`ul`, {
                        className: `space-y-3`,
                        children: [...c.events]
                          .reverse()
                          .map((e, t) =>
                            (0, z.jsxs)(
                              `li`,
                              {
                                className: `border-l-2 pl-3 text-sm`,
                                children: [
                                  (0, z.jsx)(`p`, { children: e.text }),
                                  (0, z.jsxs)(`p`, {
                                    className: `text-xs text-muted-foreground`,
                                    children: [e.date, ` · `, e.by],
                                  }),
                                ],
                              },
                              t,
                            ),
                          ),
                      }),
              }),
              (0, z.jsx)(s, { recordType: `application`, recordId: c.id }),
            ],
          }),
          (0, z.jsx)(y, {
            title: `Application timeline`,
            children: (0, z.jsx)(g, { app: c }),
          }),
        ],
      }),
      (0, z.jsx)(D, {
        open: u === `reason`,
        onOpenChange: (e) => !e && d(null),
        children: (0, z.jsxs)(E, {
          children: [
            (0, z.jsxs)(p, {
              children: [
                (0, z.jsx)(j, { children: `Why verification is required` }),
                (0, z.jsx)(O, {
                  children: `Records available to you as the applicant`,
                }),
              ],
            }),
            (0, z.jsxs)(`div`, {
              className: `space-y-2 text-sm`,
              children: [
                (0, z.jsxs)(`p`, {
                  children: [
                    `A Rural Housing Assistance benefit was approved in 2019 for household `,
                    c.householdId,
                    `, when the family of Rajesh Kumar was part of your household.`,
                  ],
                }),
                (0, z.jsx)(`p`, {
                  children: `Your household record shows a household split in March 2021. Because this is a household-level scheme, an officer needs to confirm whether the earlier benefit belongs to your current household.`,
                }),
                (0, z.jsx)(`p`, {
                  className: `text-muted-foreground`,
                  children: `Sources: household lineage register, benefit registry, land records.`,
                }),
              ],
            }),
            (0, z.jsx)(x, {
              children: (0, z.jsx)(i, {
                onClick: () => d(`clarify`),
                children: `Provide clarification`,
              }),
            }),
          ],
        }),
      }),
      [`clarify`, `review`, `respond`].map((e) =>
        (0, z.jsx)(
          D,
          {
            open: u === e,
            onOpenChange: (e) => !e && d(null),
            children: (0, z.jsxs)(E, {
              children: [
                (0, z.jsxs)(p, {
                  children: [
                    (0, z.jsx)(j, {
                      children:
                        e === `clarify`
                          ? `Provide clarification`
                          : e === `review`
                            ? `Request review`
                            : `Respond to officer`,
                    }),
                    (0, z.jsx)(O, {
                      children: `Your message is attached to the application and visible to the reviewing officer.`,
                    }),
                  ],
                }),
                (0, z.jsx)(te, { htmlFor: `t-${e}`, children: `Message` }),
                (0, z.jsx)(_, {
                  id: `t-${e}`,
                  rows: 5,
                  value: f,
                  onChange: (e) => h(e.target.value),
                  placeholder: `e.g. The 2019 house was built for my brother-in-law's family, who now live separately in HH-UP-0417-3380.`,
                }),
                (0, z.jsxs)(x, {
                  children: [
                    (0, z.jsx)(i, {
                      variant: `outline`,
                      onClick: () => d(null),
                      children: `Cancel`,
                    }),
                    (0, z.jsx)(i, {
                      onClick: () =>
                        A(
                          e === `clarify`
                            ? `Clarification provided`
                            : e === `review`
                              ? `Review requested`
                              : `Citizen response`,
                        ),
                      children: `Submit`,
                    }),
                  ],
                }),
              ],
            }),
          },
          e,
        ),
      ),
      (0, z.jsx)(D, {
        open: u === `upload`,
        onOpenChange: (e) => !e && d(null),
        children: (0, z.jsxs)(E, {
          children: [
            (0, z.jsx)(p, {
              children: (0, z.jsx)(j, {
                children: `Upload document / evidence`,
              }),
            }),
            (0, z.jsx)(fe, {
              docType: `Supporting Evidence`,
              required: !0,
              value: S,
              onChange: T,
            }),
            (0, z.jsxs)(x, {
              children: [
                (0, z.jsx)(i, {
                  variant: `outline`,
                  onClick: () => d(null),
                  children: `Cancel`,
                }),
                (0, z.jsx)(i, { onClick: F, children: `Submit document` }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
}
export { pe as component };
