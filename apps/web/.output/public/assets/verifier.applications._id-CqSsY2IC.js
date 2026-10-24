import { f as e, l as t, t as n, u as r } from "./button-KmRTh43o.js";
import { t as i } from "./link-gIn96cdo.js";
import { t as a } from "./CommentsThread-8Z0QX0oi.js";
import { t as o } from "./DocumentViewer-Dry7D_TW.js";
import { t as s } from "./flag-DF2bmYZI.js";
import {
  $ as c,
  D as l,
  Jt as u,
  M as d,
  Mt as f,
  N as p,
  Nn as m,
  Ot as h,
  Pn as g,
  Q as _,
  S as v,
  Tt as y,
  X as b,
  Y as x,
  Z as S,
  Zt as C,
  en as w,
  et as T,
  hn as E,
  j as D,
  jt as O,
  mn as k,
  t as A,
  tn as j,
  x as M,
} from "./index-B8Y-_llO.js";
import { a as N, i as P, n as F, r as I, t as L } from "./card-DNkZ-jvk.js";
var R = e(r()),
  z = t();
function B() {
  let { id: e } = A.useParams(),
    { state: t, updateApp: r, addAudit: B } = k(),
    V = t.applications.find((t) => t.id === e || t.rawId === e),
    [H, U] = (0, R.useState)(null),
    [W, G] = (0, R.useState)(``),
    [K, q] = (0, R.useState)([]),
    [J, Y] = (0, R.useState)(null),
    X = () => {
      if (!t.session?.apiToken) return;
      let e = V?.rawId || V?.id;
      e &&
        E(t.session, `/api/v1/applications/${e}/documents`)
          .then((e) => {
            e.data && e.data.length > 0
              ? q(e.data)
              : E(t.session, `/api/v1/documents`)
                  .then((e) => q(e.data || []))
                  .catch(() => q([]));
          })
          .catch(() => {
            E(t.session, `/api/v1/documents`)
              .then((e) => q(e.data || []))
              .catch(() => q([]));
          });
    };
  if (
    ((0, R.useEffect)(() => {
      V && X();
    }, [V?.id, V?.rawId, t.session?.apiToken]),
    !V)
  )
    return (0, z.jsx)(v, {
      title: `Application not found`,
      body: `No application record found for ${e}.`,
      action: (0, z.jsx)(n, {
        asChild: !0,
        children: (0, z.jsx)(i, {
          to: `/verifier/queue`,
          children: `Back to Verification Queue`,
        }),
      }),
    });
  let Z = g(V.schemeId) || {
      id: V.schemeId,
      name: `Welfare Assistance Scheme`,
      level: `Individual`,
      documents: [`Income Certificate`, `Residence Certificate`],
    },
    Q = (e) => {
      if (!W.trim()) {
        y.error(`Please enter a determination note or legal finding.`);
        return;
      }
      let n = t.session?.name || `Neha Verma (Verification Officer)`;
      (e === `Approved`
        ? (r(
            V.id,
            {
              status: `Approved`,
              stage: 6,
              decision: {
                outcome: `Approved`,
                reason: W.trim(),
                note: W.trim(),
                date: new Date().toISOString().split(`T`)[0],
                by: n,
              },
            },
            `Statutory approval granted: ${W.trim()}`,
            n,
          ),
          B({
            actor: n,
            action: `Application Approved`,
            application: V.id,
            prev: V.status,
            next: `Approved`,
            reason: W.trim(),
          }),
          y.success(
            `Application ${V.id} approved. Benefit entitlement generated.`,
          ))
        : e === `Rejected`
          ? (r(
              V.id,
              {
                status: `Rejected`,
                stage: 6,
                decision: {
                  outcome: `Rejected`,
                  reason: W.trim(),
                  note: W.trim(),
                  date: new Date().toISOString().split(`T`)[0],
                  by: n,
                },
              },
              `Application rejected with cause: ${W.trim()}`,
              n,
            ),
            B({
              actor: n,
              action: `Application Rejected`,
              application: V.id,
              prev: V.status,
              next: `Rejected`,
              reason: W.trim(),
            }),
            y.error(`Application ${V.id} rejected.`))
          : e === `Additional Evidence Required`
            ? (r(
                V.id,
                { status: `Additional Evidence Required` },
                `Clarification required from citizen: ${W.trim()}`,
                n,
              ),
              B({
                actor: n,
                action: `Evidence Requested`,
                application: V.id,
                prev: V.status,
                next: `Additional Evidence Required`,
                reason: W.trim(),
              }),
              y.info(`Clarification request dispatched to ${V.applicant}.`))
            : e === `Escalated` &&
              (r(
                V.id,
                { status: `Verification Required` },
                `Escalated to Supervisor: ${W.trim()}`,
                n,
              ),
              B({
                actor: n,
                action: `Escalated to Supervisor`,
                application: V.id,
                prev: V.status,
                next: `Verification Required`,
                reason: W.trim(),
              }),
              y.warning(
                `Application ${V.id} flagged and escalated to Supervisor.`,
              )),
        U(null),
        G(``));
    };
  return (0, z.jsxs)(`div`, {
    className: `space-y-6`,
    children: [
      (0, z.jsx)(l, {
        title: `Determination: ${Z.name}`,
        desc: `${V.id} · Applicant: ${V.applicant} · Household: ${V.householdId}`,
        crumbs: [
          { label: `Verifier Queue`, to: `/verifier/queue` },
          { label: V.id },
        ],
        actions: (0, z.jsxs)(`div`, {
          className: `flex flex-wrap items-center gap-2`,
          children: [
            (0, z.jsxs)(n, {
              size: `sm`,
              variant: `outline`,
              onClick: () => U(`evidence`),
              className: `text-xs`,
              children: [
                (0, z.jsx)(j, {
                  className: `mr-1.5 h-3.5 w-3.5 text-amber-500`,
                }),
                `Request Evidence`,
              ],
            }),
            (0, z.jsxs)(n, {
              size: `sm`,
              variant: `outline`,
              onClick: () => U(`escalate`),
              className: `text-xs`,
              children: [
                (0, z.jsx)(s, {
                  className: `mr-1.5 h-3.5 w-3.5 text-blue-500`,
                }),
                `Escalate to Supervisor`,
              ],
            }),
            (0, z.jsxs)(n, {
              size: `sm`,
              variant: `destructive`,
              onClick: () => U(`reject`),
              className: `text-xs`,
              children: [
                (0, z.jsx)(w, { className: `mr-1.5 h-3.5 w-3.5` }),
                `Reject`,
              ],
            }),
            (0, z.jsxs)(n, {
              size: `sm`,
              onClick: () => U(`approve`),
              className: `text-xs bg-emerald-600 hover:bg-emerald-700`,
              children: [
                (0, z.jsx)(f, { className: `mr-1.5 h-3.5 w-3.5` }),
                `Approve Benefit`,
              ],
            }),
          ],
        }),
      }),
      (0, z.jsxs)(`div`, {
        className: `grid gap-6 lg:grid-cols-3`,
        children: [
          (0, z.jsxs)(`div`, {
            className: `space-y-6 lg:col-span-2`,
            children: [
              (0, z.jsxs)(L, {
                className: `border-border/80 shadow-xs`,
                children: [
                  (0, z.jsx)(P, {
                    className: `p-4 pb-2`,
                    children: (0, z.jsxs)(`div`, {
                      className: `flex items-center justify-between`,
                      children: [
                        (0, z.jsxs)(`div`, {
                          className: `flex items-center gap-2`,
                          children: [
                            (0, z.jsx)(D, { s: V.status }),
                            (0, z.jsxs)(`span`, {
                              className: `text-xs text-muted-foreground`,
                              children: [`Updated `, m(V.updatedOn)],
                            }),
                          ],
                        }),
                        (0, z.jsxs)(M, {
                          variant: `outline`,
                          className: `text-[10px]`,
                          children: [`Stage `, V.stage, ` / 6`],
                        }),
                      ],
                    }),
                  }),
                  (0, z.jsxs)(F, {
                    className: `p-4 pt-2 text-xs space-y-3`,
                    children: [
                      V.duplicate &&
                        (0, z.jsxs)(`div`, {
                          className: `rounded-lg border border-blue-300/40 bg-blue-500/10 p-3 text-blue-900 dark:text-blue-200`,
                          children: [
                            (0, z.jsxs)(`div`, {
                              className: `flex items-center gap-2 font-semibold`,
                              children: [
                                (0, z.jsx)(f, {
                                  className: `h-4 w-4 text-blue-600`,
                                }),
                                (0, z.jsx)(`span`, {
                                  children: `Household Lineage Cross-Match (Duplicate Signal)`,
                                }),
                              ],
                            }),
                            (0, z.jsx)(`p`, {
                              className: `mt-1 text-[11px] opacity-90`,
                              children: `Earlier benefit sanctioned in 2019 for pre-split household lineage. March 2021 formal bifurcation registered in family register. Determination must verify distinct independent dwelling status.`,
                            }),
                          ],
                        }),
                      V.mismatch &&
                        (0, z.jsxs)(`div`, {
                          className: `rounded-lg border border-amber-300/40 bg-amber-500/10 p-3 text-amber-900 dark:text-amber-200`,
                          children: [
                            (0, z.jsxs)(`div`, {
                              className: `flex items-center gap-2 font-semibold`,
                              children: [
                                (0, z.jsx)(O, {
                                  className: `h-4 w-4 text-amber-600`,
                                }),
                                (0, z.jsxs)(`span`, {
                                  children: [
                                    `Data Mismatch Flagged: `,
                                    V.mismatch.field,
                                  ],
                                }),
                              ],
                            }),
                            (0, z.jsxs)(`div`, {
                              className: `mt-2 grid grid-cols-2 gap-2 text-[11px]`,
                              children: [
                                (0, z.jsxs)(`div`, {
                                  children: [
                                    (0, z.jsx)(`span`, {
                                      className: `text-muted-foreground`,
                                      children: `Citizen Declared:`,
                                    }),
                                    (0, z.jsx)(`p`, {
                                      className: `font-semibold text-foreground`,
                                      children: V.mismatch.declared,
                                    }),
                                  ],
                                }),
                                (0, z.jsxs)(`div`, {
                                  children: [
                                    (0, z.jsxs)(`span`, {
                                      className: `text-muted-foreground`,
                                      children: [V.mismatch.source, `:`],
                                    }),
                                    (0, z.jsx)(`p`, {
                                      className: `font-semibold text-foreground`,
                                      children: V.mismatch.document,
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                      V.decision &&
                        (0, z.jsxs)(`div`, {
                          className: `rounded-lg border border-teal-300/40 bg-teal-500/10 p-3 text-teal-900 dark:text-teal-200`,
                          children: [
                            (0, z.jsxs)(`div`, {
                              className: `font-semibold`,
                              children: [
                                `Official Determination: `,
                                V.decision.outcome,
                              ],
                            }),
                            (0, z.jsxs)(`p`, {
                              className: `mt-1 text-[11px]`,
                              children: [`Reason: `, V.decision.reason],
                            }),
                            (0, z.jsxs)(`p`, {
                              className: `mt-1 text-[10px] text-muted-foreground`,
                              children: [
                                `By `,
                                V.decision.by,
                                ` on `,
                                m(V.decision.date),
                              ],
                            }),
                          ],
                        }),
                    ],
                  }),
                ],
              }),
              (0, z.jsxs)(L, {
                className: `border-border/80 shadow-xs`,
                children: [
                  (0, z.jsx)(P, {
                    className: `p-4 pb-2`,
                    children: (0, z.jsxs)(`div`, {
                      className: `flex items-center justify-between`,
                      children: [
                        (0, z.jsxs)(`div`, {
                          children: [
                            (0, z.jsxs)(N, {
                              className: `text-sm font-semibold flex items-center gap-1.5`,
                              children: [
                                (0, z.jsx)(u, {
                                  className: `h-4 w-4 text-blue-600`,
                                }),
                                `Submitted Documents & Evidence`,
                              ],
                            }),
                            (0, z.jsx)(I, {
                              className: `text-xs`,
                              children: `Certificates attached to this application with OCR extracted intelligence`,
                            }),
                          ],
                        }),
                        (0, z.jsxs)(M, {
                          variant: `outline`,
                          className: `text-[10px]`,
                          children: [K.length, ` Documents`],
                        }),
                      ],
                    }),
                  }),
                  (0, z.jsx)(F, {
                    className: `p-4 pt-1 space-y-2 text-xs`,
                    children:
                      K.length > 0
                        ? (0, z.jsx)(`div`, {
                            className: `divide-y rounded-md border bg-slate-50/50`,
                            children: K.map((e) => {
                              let t =
                                e.verification_status === `ACTION_REQUIRED` ||
                                e.verification_status === `MISMATCH`;
                              return (0, z.jsxs)(
                                `div`,
                                {
                                  className: `flex flex-wrap items-center justify-between p-3 gap-2`,
                                  children: [
                                    (0, z.jsxs)(`div`, {
                                      className: `flex items-center gap-2.5 min-w-0`,
                                      children: [
                                        (0, z.jsx)(u, {
                                          className: `h-4 w-4 shrink-0 ${t ? `text-amber-600` : e.verification_status === `VERIFIED` ? `text-emerald-600` : `text-slate-500`}`,
                                        }),
                                        (0, z.jsxs)(`div`, {
                                          className: `min-w-0`,
                                          children: [
                                            (0, z.jsx)(`p`, {
                                              className: `font-semibold text-slate-900 truncate`,
                                              children: e.original_filename,
                                            }),
                                            (0, z.jsxs)(`p`, {
                                              className: `text-[11px] text-muted-foreground`,
                                              children: [
                                                e.document_type,
                                                ` · v`,
                                                e.version_number || 1,
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                    (0, z.jsxs)(`div`, {
                                      className: `flex items-center gap-2`,
                                      children: [
                                        (0, z.jsx)(`span`, {
                                          className: `rounded px-2 py-0.5 text-[10px] font-semibold border ${e.verification_status === `VERIFIED` ? `border-emerald-300 bg-emerald-50 text-emerald-800` : t ? `border-amber-300 bg-amber-50 text-amber-900` : e.verification_status === `REJECTED` ? `border-red-300 bg-red-50 text-red-800` : `border-slate-300 bg-slate-100 text-slate-700`}`,
                                          children: e.verification_status,
                                        }),
                                        (0, z.jsxs)(n, {
                                          size: `sm`,
                                          variant: `outline`,
                                          onClick: () => Y(e),
                                          className: `h-7 text-xs px-2.5 gap-1 text-blue-700 border-blue-200 hover:bg-blue-50`,
                                          children: [
                                            (0, z.jsx)(C, {
                                              className: `h-3.5 w-3.5`,
                                            }),
                                            `View Document`,
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                },
                                e.id,
                              );
                            }),
                          })
                        : (0, z.jsx)(`div`, {
                            className: `rounded border border-dashed p-4 text-center text-xs text-muted-foreground`,
                            children: `No submitted documents loaded.`,
                          }),
                  }),
                ],
              }),
              (0, z.jsxs)(L, {
                className: `border-border/80 shadow-xs`,
                children: [
                  (0, z.jsxs)(P, {
                    className: `p-4 pb-2`,
                    children: [
                      (0, z.jsx)(N, {
                        className: `text-sm font-semibold`,
                        children: `Statutory Eligibility Verification`,
                      }),
                      (0, z.jsxs)(I, {
                        className: `text-xs`,
                        children: [`Criteria prescribed under `, Z.name],
                      }),
                    ],
                  }),
                  (0, z.jsxs)(F, {
                    className: `p-4 pt-1 space-y-2 text-xs`,
                    children: [
                      (0, z.jsxs)(`div`, {
                        className: `flex items-center justify-between border-b pb-2`,
                        children: [
                          (0, z.jsxs)(`div`, {
                            children: [
                              (0, z.jsx)(`span`, {
                                className: `font-medium text-foreground`,
                                children: `Annual Household Income < ₹ 2,00,000`,
                              }),
                              (0, z.jsx)(`p`, {
                                className: `text-[11px] text-muted-foreground`,
                                children: `Verified against Tehsildar & State Revenue Registry`,
                              }),
                            ],
                          }),
                          (0, z.jsx)(M, {
                            variant: `outline`,
                            className: `border-teal-400 bg-teal-500/10 text-teal-700 text-[10px]`,
                            children: `Pass (₹ 1,72,000)`,
                          }),
                        ],
                      }),
                      (0, z.jsxs)(`div`, {
                        className: `flex items-center justify-between border-b pb-2`,
                        children: [
                          (0, z.jsxs)(`div`, {
                            children: [
                              (0, z.jsx)(`span`, {
                                className: `font-medium text-foreground`,
                                children: `Rural Residence & Land Holding`,
                              }),
                              (0, z.jsx)(`p`, {
                                className: `text-[11px] text-muted-foreground`,
                                children: `Plot 42/Ward 7 recorded in UP Bhulekh Khatauni`,
                              }),
                            ],
                          }),
                          (0, z.jsx)(M, {
                            variant: `outline`,
                            className: `border-teal-400 bg-teal-500/10 text-teal-700 text-[10px]`,
                            children: `Pass (0.18 Ha)`,
                          }),
                        ],
                      }),
                      (0, z.jsxs)(`div`, {
                        className: `flex items-center justify-between pb-1`,
                        children: [
                          (0, z.jsxs)(`div`, {
                            children: [
                              (0, z.jsx)(`span`, {
                                className: `font-medium text-foreground`,
                                children: `No Prior Disqualifying Benefit in 5 Years`,
                              }),
                              (0, z.jsx)(`p`, {
                                className: `text-[11px] text-muted-foreground`,
                                children: `Household split authenticated by Gram Panchayat`,
                              }),
                            ],
                          }),
                          (0, z.jsx)(M, {
                            variant: `outline`,
                            className: `border-blue-400 bg-blue-500/10 text-blue-700 text-[10px]`,
                            children: `Requires Sign-off`,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              (0, z.jsx)(a, { recordType: `application`, recordId: V.id }),
            ],
          }),
          (0, z.jsxs)(`div`, {
            className: `space-y-6`,
            children: [
              (0, z.jsxs)(L, {
                className: `border-border/80 shadow-xs`,
                children: [
                  (0, z.jsx)(P, {
                    className: `p-4 pb-2`,
                    children: (0, z.jsx)(N, {
                      className: `text-sm font-semibold`,
                      children: `Application Lifecycle`,
                    }),
                  }),
                  (0, z.jsx)(F, {
                    className: `p-4 pt-1`,
                    children: (0, z.jsx)(d, { app: V }),
                  }),
                ],
              }),
              (0, z.jsxs)(L, {
                className: `border-border/80 shadow-xs`,
                children: [
                  (0, z.jsx)(P, {
                    className: `p-4 pb-2`,
                    children: (0, z.jsx)(N, {
                      className: `text-sm font-semibold`,
                      children: `Household Summary`,
                    }),
                  }),
                  (0, z.jsxs)(F, {
                    className: `p-4 pt-1 space-y-2 text-xs`,
                    children: [
                      (0, z.jsxs)(`div`, {
                        className: `flex justify-between border-b pb-1.5`,
                        children: [
                          (0, z.jsx)(`span`, {
                            className: `text-muted-foreground`,
                            children: `Household ID:`,
                          }),
                          (0, z.jsx)(`span`, {
                            className: `font-mono font-medium`,
                            children: V.householdId,
                          }),
                        ],
                      }),
                      (0, z.jsxs)(`div`, {
                        className: `flex justify-between border-b pb-1.5`,
                        children: [
                          (0, z.jsx)(`span`, {
                            className: `text-muted-foreground`,
                            children: `Members Registered:`,
                          }),
                          (0, z.jsx)(`span`, {
                            className: `font-medium font-semibold text-blue-900 dark:text-blue-200`,
                            children: V.householdId?.includes(`10482`)
                              ? `35 Members (Multi-Gen)`
                              : `5 Members`,
                          }),
                        ],
                      }),
                      (0, z.jsxs)(`div`, {
                        className: `flex justify-between border-b pb-1.5`,
                        children: [
                          (0, z.jsx)(`span`, {
                            className: `text-muted-foreground`,
                            children: `Registration Date:`,
                          }),
                          (0, z.jsx)(`span`, {
                            className: `font-medium`,
                            children: `February 2010`,
                          }),
                        ],
                      }),
                      (0, z.jsxs)(`div`, {
                        className: `flex justify-between pb-1`,
                        children: [
                          (0, z.jsx)(`span`, {
                            className: `text-muted-foreground`,
                            children: `Jurisdiction:`,
                          }),
                          (0, z.jsx)(`span`, {
                            className: `font-medium`,
                            children: `Civil Lines, Demo District`,
                          }),
                        ],
                      }),
                      (0, z.jsx)(`div`, {
                        className: `pt-2`,
                        children: (0, z.jsx)(n, {
                          asChild: !0,
                          variant: `outline`,
                          size: `sm`,
                          className: `w-full text-xs font-semibold gap-1.5 border-gov/30 text-gov hover:bg-gov/5`,
                          children: (0, z.jsxs)(i, {
                            to: `/verifier/family360`,
                            children: [
                              (0, z.jsx)(h, { className: `h-3.5 w-3.5` }),
                              (0, z.jsx)(`span`, {
                                children: `Inspect in Family360 Graph`,
                              }),
                              (0, z.jsx)(ExternalLink, {
                                className: `h-3 w-3 ml-auto`,
                              }),
                            ],
                          }),
                        }),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      H &&
        (0, z.jsx)(x, {
          open: !!H,
          onOpenChange: (e) => !e && U(null),
          children: (0, z.jsxs)(b, {
            className: `max-w-md`,
            children: [
              (0, z.jsxs)(c, {
                children: [
                  (0, z.jsx)(T, {
                    className: `capitalize`,
                    children:
                      H === `approve`
                        ? `Approve Application & Entitlement`
                        : H === `reject`
                          ? `Issue Rejection Order`
                          : H === `evidence`
                            ? `Request Additional Evidence`
                            : `Escalate to Supervisor`,
                  }),
                  (0, z.jsx)(S, {
                    className: `text-xs`,
                    children:
                      H === `approve`
                        ? `This determination will be cryptographically hashed and recorded to the state ledger.`
                        : `State statutory finding and administrative rationale.`,
                  }),
                ],
              }),
              (0, z.jsx)(`div`, {
                className: `space-y-3 py-2 text-xs`,
                children: (0, z.jsxs)(`div`, {
                  children: [
                    (0, z.jsx)(`label`, {
                      className: `font-medium text-foreground`,
                      children: `Determination Finding / Directive Note`,
                    }),
                    (0, z.jsx)(p, {
                      value: W,
                      onChange: (e) => G(e.target.value),
                      placeholder:
                        H === `approve`
                          ? `e.g. All statutory criteria met. Household split confirmed independent. Prior 2019 benefit pertained to separate brother-in-law dwelling.`
                          : H === `reject`
                            ? `e.g. Ineligible under Rule 8(b): Income ceiling exceeded based on revenue records.`
                            : `e.g. Please furnish registered partition deed or Gram Panchayat resolution.`,
                      rows: 4,
                      className: `mt-1 text-xs`,
                    }),
                  ],
                }),
              }),
              (0, z.jsxs)(_, {
                children: [
                  (0, z.jsx)(n, {
                    variant: `outline`,
                    size: `sm`,
                    onClick: () => U(null),
                    children: `Cancel`,
                  }),
                  (0, z.jsx)(n, {
                    size: `sm`,
                    variant: H === `reject` ? `destructive` : `default`,
                    onClick: () =>
                      Q(
                        H === `approve`
                          ? `Approved`
                          : H === `reject`
                            ? `Rejected`
                            : H === `evidence`
                              ? `Additional Evidence Required`
                              : `Escalated`,
                      ),
                    children: `Confirm Determination`,
                  }),
                ],
              }),
            ],
          }),
        }),
      J &&
        t.session &&
        (0, z.jsx)(o, {
          document: J,
          session: t.session,
          onClose: () => Y(null),
          onChanged: () => {
            X();
          },
        }),
    ],
  });
}
export { B as component };
