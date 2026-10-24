import { c as e, f as t, l as n, t as r, u as i } from "./button-KmRTh43o.js";
import { t as a } from "./link-gIn96cdo.js";
import { t as o } from "./camera-O7_j0XUn.js";
import { t as s } from "./navigation-D6fdW4KN.js";
import {
  $ as c,
  At as l,
  Bt as u,
  D as d,
  Mt as f,
  N as p,
  Q as m,
  Qt as h,
  Tt as g,
  X as _,
  Y as v,
  Yt as y,
  Z as b,
  cn as x,
  dn as S,
  et as C,
  mn as w,
  nn as T,
  x as E,
} from "./index-B8Y-_llO.js";
import { a as D, i as O, n as k, r as A, t as j } from "./card-DNkZ-jvk.js";
var M = e(`square-check-big`, [
    [
      `path`,
      {
        d: `M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344`,
        key: `2acyp4`,
      },
    ],
    [`path`, { d: `m9 11 3 3L22 4`, key: `1pflzl` }],
  ]),
  N = e(`square`, [
    [
      `rect`,
      { width: `18`, height: `18`, x: `3`, y: `3`, rx: `2`, key: `afitv7` },
    ],
  ]),
  P = t(i()),
  F = n();
function I() {
  let { state: e, updateFieldVisit: t, addAudit: n } = w(),
    [i, I] = (0, P.useState)(`all`),
    [L, R] = (0, P.useState)(null),
    [z, B] = (0, P.useState)(``),
    [V, H] = (0, P.useState)(!1),
    U = e.fieldVisits || [],
    W = U.filter((e) =>
      i === `today`
        ? e.scheduledDate === `2026-10-24`
        : i === `completed`
          ? e.status === `Completed`
          : i !== `pending` || e.status !== `Completed`,
    ),
    G = (e, n) => {
      let r = [...e.checklist];
      ((r[n] = { ...r[n], checked: !r[n].checked }),
        t(e.id, { checklist: r }),
        g.success(`Checklist updated`));
    },
    K = (r) => {
      (t(r.id, {
        status: `Completed`,
        officerNotes:
          z ||
          r.officerNotes ||
          `Physical site inspected. Structure condition and family residence confirmed.`,
        citizenConfirmation: {
          confirmed: !0,
          signedBy: r.citizenName,
          timestamp: new Date().toISOString(),
        },
      }),
        n({
          actor: `${e.session?.name} (${e.session?.id})`,
          action: `Field Inspection Completed`,
          application: r.applicationId,
          prev: r.status,
          next: `Completed`,
          reason: `Dwelling verified at ${r.address}`,
        }),
        g.success(
          `Field visit ${r.id} verified and recorded on immutable audit ledger.`,
        ),
        R(null));
    },
    q = (e) => {
      let n = [
        ...(e.evidencePhotos || []),
        `Geotagged Roof & Foundation Photo (${new Date().toLocaleTimeString()})`,
      ];
      (t(e.id, { evidencePhotos: n }),
        g.success(
          `Geotagged camera evidence synced (Lat: 26.8467, Lon: 80.9462)`,
        ),
        H(!1));
    };
  return (0, F.jsxs)(`div`, {
    className: `space-y-6`,
    children: [
      (0, F.jsx)(d, {
        title: `Field Inspection Operations`,
        desc: `On-site physical inspection schedule, geotagged evidence capture, and dwelling status reports.`,
        crumbs: [
          { label: `Officer`, to: `/officer/dashboard` },
          { label: `Field Visits` },
        ],
      }),
      (0, F.jsxs)(`div`, {
        className: `grid grid-cols-2 gap-4 sm:grid-cols-4`,
        children: [
          (0, F.jsx)(j, {
            className: `border-border/60 shadow-xs`,
            children: (0, F.jsxs)(k, {
              className: `p-4`,
              children: [
                (0, F.jsxs)(`div`, {
                  className: `flex items-center justify-between`,
                  children: [
                    (0, F.jsx)(`span`, {
                      className: `text-xs font-medium text-muted-foreground`,
                      children: `Today's Route`,
                    }),
                    (0, F.jsx)(s, { className: `h-4 w-4 text-primary` }),
                  ],
                }),
                (0, F.jsx)(`div`, {
                  className: `mt-2 text-2xl font-bold`,
                  children: `2 Visits`,
                }),
                (0, F.jsx)(`p`, {
                  className: `text-[11px] text-muted-foreground`,
                  children: `Chandauli Rural Cluster`,
                }),
              ],
            }),
          }),
          (0, F.jsx)(j, {
            className: `border-border/60 shadow-xs`,
            children: (0, F.jsxs)(k, {
              className: `p-4`,
              children: [
                (0, F.jsxs)(`div`, {
                  className: `flex items-center justify-between`,
                  children: [
                    (0, F.jsx)(`span`, {
                      className: `text-xs font-medium text-muted-foreground`,
                      children: `Verification Rate`,
                    }),
                    (0, F.jsx)(T, { className: `h-4 w-4 text-teal-600` }),
                  ],
                }),
                (0, F.jsx)(`div`, {
                  className: `mt-2 text-2xl font-bold`,
                  children: `94.8%`,
                }),
                (0, F.jsx)(`p`, {
                  className: `text-[11px] text-teal-600`,
                  children: `SLA compliance met`,
                }),
              ],
            }),
          }),
          (0, F.jsx)(j, {
            className: `border-border/60 shadow-xs`,
            children: (0, F.jsxs)(k, {
              className: `p-4`,
              children: [
                (0, F.jsxs)(`div`, {
                  className: `flex items-center justify-between`,
                  children: [
                    (0, F.jsx)(`span`, {
                      className: `text-xs font-medium text-muted-foreground`,
                      children: `GPS Precision`,
                    }),
                    (0, F.jsx)(u, { className: `h-4 w-4 text-emerald-600` }),
                  ],
                }),
                (0, F.jsx)(`div`, {
                  className: `mt-2 text-2xl font-bold`,
                  children: `± 1.8 m`,
                }),
                (0, F.jsx)(`p`, {
                  className: `text-[11px] text-muted-foreground`,
                  children: `ISRO NavIC high-accuracy lock`,
                }),
              ],
            }),
          }),
          (0, F.jsx)(j, {
            className: `border-border/60 shadow-xs`,
            children: (0, F.jsxs)(k, {
              className: `p-4`,
              children: [
                (0, F.jsxs)(`div`, {
                  className: `flex items-center justify-between`,
                  children: [
                    (0, F.jsx)(`span`, {
                      className: `text-xs font-medium text-muted-foreground`,
                      children: `Pending Action`,
                    }),
                    (0, F.jsx)(h, { className: `h-4 w-4 text-amber-600` }),
                  ],
                }),
                (0, F.jsx)(`div`, {
                  className: `mt-2 text-2xl font-bold`,
                  children: U.filter((e) => e.status !== `Completed`).length,
                }),
                (0, F.jsx)(`p`, {
                  className: `text-[11px] text-amber-600`,
                  children: `Requires physical sign-off`,
                }),
              ],
            }),
          }),
        ],
      }),
      (0, F.jsx)(`div`, {
        className: `flex items-center gap-2 border-b pb-3`,
        children: [
          { id: `all`, label: `All Inspections` },
          { id: `today`, label: `Today's Schedule` },
          { id: `pending`, label: `Pending Sign-off` },
          { id: `completed`, label: `Completed` },
        ].map((e) =>
          (0, F.jsx)(
            r,
            {
              variant: i === e.id ? `default` : `outline`,
              size: `sm`,
              onClick: () => I(e.id),
              className: `rounded-full text-xs`,
              children: e.label,
            },
            e.id,
          ),
        ),
      }),
      (0, F.jsx)(`div`, {
        className: `grid gap-4 md:grid-cols-2`,
        children: W.map((e) =>
          (0, F.jsxs)(
            j,
            {
              className: `flex flex-col justify-between border-border/80 shadow-xs transition-all hover:border-primary/40`,
              children: [
                (0, F.jsx)(O, {
                  className: `p-5 pb-3`,
                  children: (0, F.jsxs)(`div`, {
                    className: `flex items-start justify-between gap-2`,
                    children: [
                      (0, F.jsxs)(`div`, {
                        children: [
                          (0, F.jsxs)(E, {
                            variant:
                              e.status === `Completed`
                                ? `secondary`
                                : `outline`,
                            className: `mb-2 text-[11px]`,
                            children: [e.id, ` · `, e.status],
                          }),
                          (0, F.jsx)(D, {
                            className: `text-base font-semibold`,
                            children: e.citizenName,
                          }),
                          (0, F.jsxs)(A, {
                            className: `flex items-center gap-1.5 pt-1 text-xs`,
                            children: [
                              (0, F.jsx)(u, {
                                className: `h-3.5 w-3.5 text-muted-foreground shrink-0`,
                              }),
                              (0, F.jsx)(`span`, { children: e.address }),
                            ],
                          }),
                        ],
                      }),
                      (0, F.jsx)(`div`, {
                        className: `text-right text-xs`,
                        children: (0, F.jsxs)(`div`, {
                          className: `flex items-center gap-1 text-muted-foreground`,
                          children: [
                            (0, F.jsx)(x, { className: `h-3.5 w-3.5` }),
                            (0, F.jsxs)(`span`, {
                              children: [
                                e.scheduledDate,
                                ` · `,
                                e.scheduledTime,
                              ],
                            }),
                          ],
                        }),
                      }),
                    ],
                  }),
                }),
                (0, F.jsxs)(k, {
                  className: `space-y-4 p-5 pt-2`,
                  children: [
                    (0, F.jsxs)(`div`, {
                      className: `rounded-lg border bg-muted/30 p-3 text-xs`,
                      children: [
                        (0, F.jsx)(`p`, {
                          className: `mb-2 font-medium text-foreground`,
                          children: `On-Site Verification Checklist:`,
                        }),
                        (0, F.jsx)(`div`, {
                          className: `space-y-1.5`,
                          children: e.checklist.map((t, n) =>
                            (0, F.jsxs)(
                              `button`,
                              {
                                type: `button`,
                                onClick: () => G(e, n),
                                className: `flex w-full items-center gap-2 text-left hover:text-primary`,
                                children: [
                                  t.checked
                                    ? (0, F.jsx)(M, {
                                        className: `h-4 w-4 text-teal-600 shrink-0`,
                                      })
                                    : (0, F.jsx)(N, {
                                        className: `h-4 w-4 text-muted-foreground shrink-0`,
                                      }),
                                  (0, F.jsx)(`span`, {
                                    className: t.checked
                                      ? `line-through text-muted-foreground`
                                      : `text-foreground`,
                                    children: t.label,
                                  }),
                                ],
                              },
                              n,
                            ),
                          ),
                        }),
                      ],
                    }),
                    e.officerNotes &&
                      (0, F.jsxs)(`div`, {
                        className: `text-xs text-muted-foreground`,
                        children: [
                          (0, F.jsx)(`span`, {
                            className: `font-semibold text-foreground`,
                            children: `Inspection Finding: `,
                          }),
                          e.officerNotes,
                        ],
                      }),
                    e.evidencePhotos &&
                      e.evidencePhotos.length > 0 &&
                      (0, F.jsx)(`div`, {
                        className: `flex flex-wrap gap-1.5`,
                        children: e.evidencePhotos.map((e, t) =>
                          (0, F.jsxs)(
                            E,
                            {
                              variant: `outline`,
                              className: `bg-background text-[10px] text-muted-foreground`,
                              children: [
                                (0, F.jsx)(o, {
                                  className: `mr-1 h-3 w-3 text-primary`,
                                }),
                                e,
                              ],
                            },
                            t,
                          ),
                        ),
                      }),
                    (0, F.jsxs)(`div`, {
                      className: `flex flex-wrap items-center justify-between gap-2 border-t pt-3`,
                      children: [
                        (0, F.jsxs)(`div`, {
                          className: `flex items-center gap-1.5`,
                          children: [
                            (0, F.jsxs)(r, {
                              size: `sm`,
                              variant: `outline`,
                              className: `h-8 text-xs`,
                              onClick: () => {
                                (R(e), H(!0));
                              },
                              children: [
                                (0, F.jsx)(o, {
                                  className: `mr-1.5 h-3.5 w-3.5`,
                                }),
                                `Add Photo`,
                              ],
                            }),
                            (0, F.jsxs)(r, {
                              size: `sm`,
                              variant:
                                e.status === `Completed`
                                  ? `outline`
                                  : `default`,
                              className: `h-8 text-xs`,
                              onClick: () => {
                                (R(e), B(e.officerNotes || ``));
                              },
                              children: [
                                (0, F.jsx)(y, {
                                  className: `mr-1.5 h-3.5 w-3.5`,
                                }),
                                e.status === `Completed`
                                  ? `Review Inspection`
                                  : `Complete & Sign`,
                              ],
                            }),
                          ],
                        }),
                        (0, F.jsxs)(a, {
                          to: `/officer/applications/$id`,
                          params: { id: e.applicationId },
                          className: `inline-flex items-center text-xs font-medium text-primary hover:underline`,
                          children: [
                            `Application `,
                            (0, F.jsx)(S, { className: `ml-1 h-3 w-3` }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            },
            e.id,
          ),
        ),
      }),
      L &&
        !V &&
        (0, F.jsx)(v, {
          open: !!L,
          onOpenChange: (e) => !e && R(null),
          children: (0, F.jsxs)(_, {
            className: `max-w-md`,
            children: [
              (0, F.jsxs)(c, {
                children: [
                  (0, F.jsxs)(C, {
                    children: [`Complete Field Inspection — `, L.id],
                  }),
                  (0, F.jsxs)(b, {
                    children: [
                      `Record final dwelling determination for `,
                      L.citizenName,
                      ` (`,
                      L.applicationId,
                      `).`,
                    ],
                  }),
                ],
              }),
              (0, F.jsxs)(`div`, {
                className: `space-y-3 py-2 text-xs`,
                children: [
                  (0, F.jsxs)(`div`, {
                    children: [
                      (0, F.jsx)(`label`, {
                        className: `font-medium text-foreground`,
                        children: `Officer Field Observations`,
                      }),
                      (0, F.jsx)(p, {
                        value: z,
                        onChange: (e) => B(e.target.value),
                        placeholder: `e.g. Dwelling inspected. Unfinished kutcha wall verified. Family of 5 residing on premise.`,
                        rows: 4,
                        className: `mt-1 text-xs`,
                      }),
                    ],
                  }),
                  (0, F.jsxs)(`div`, {
                    className: `rounded-md border border-teal-500/30 bg-teal-500/10 p-3 text-teal-800 dark:text-teal-300`,
                    children: [
                      (0, F.jsxs)(`div`, {
                        className: `flex items-center gap-2`,
                        children: [
                          (0, F.jsx)(l, { className: `h-4 w-4` }),
                          (0, F.jsx)(`span`, {
                            className: `font-semibold`,
                            children: `Citizen Digital Presence Acknowledged`,
                          }),
                        ],
                      }),
                      (0, F.jsx)(`p`, {
                        className: `mt-1 text-[11px] opacity-90`,
                        children: `Head of household authenticated via Aadhaar FaceRD/OTP presence on mobile field device.`,
                      }),
                    ],
                  }),
                ],
              }),
              (0, F.jsxs)(m, {
                children: [
                  (0, F.jsx)(r, {
                    variant: `outline`,
                    size: `sm`,
                    onClick: () => R(null),
                    children: `Cancel`,
                  }),
                  (0, F.jsxs)(r, {
                    size: `sm`,
                    onClick: () => K(L),
                    children: [
                      (0, F.jsx)(f, { className: `mr-1.5 h-4 w-4` }),
                      `Submit Verification Record`,
                    ],
                  }),
                ],
              }),
            ],
          }),
        }),
      L &&
        V &&
        (0, F.jsx)(v, {
          open: V,
          onOpenChange: H,
          children: (0, F.jsxs)(_, {
            className: `max-w-sm`,
            children: [
              (0, F.jsxs)(c, {
                children: [
                  (0, F.jsxs)(C, {
                    className: `flex items-center gap-2`,
                    children: [
                      (0, F.jsx)(o, { className: `h-5 w-5 text-primary` }),
                      `Geotagged Evidence Camera`,
                    ],
                  }),
                  (0, F.jsx)(b, {
                    className: `text-xs`,
                    children: `Capturing timestamped physical evidence with GPS coordinate stamping.`,
                  }),
                ],
              }),
              (0, F.jsx)(`div`, {
                className: `space-y-3 py-3`,
                children: (0, F.jsxs)(`div`, {
                  className: `flex aspect-video w-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/40 p-4 text-center`,
                  children: [
                    (0, F.jsx)(o, {
                      className: `h-8 w-8 text-muted-foreground`,
                    }),
                    (0, F.jsx)(`p`, {
                      className: `mt-2 text-xs font-medium`,
                      children: `NavIC GPS: 26.8467° N, 80.9462° E`,
                    }),
                    (0, F.jsx)(`p`, {
                      className: `text-[10px] text-muted-foreground`,
                      children: `Accuracy: ± 1.8m · Bearing: 184° S`,
                    }),
                  ],
                }),
              }),
              (0, F.jsxs)(m, {
                children: [
                  (0, F.jsx)(r, {
                    variant: `outline`,
                    size: `sm`,
                    onClick: () => H(!1),
                    children: `Cancel`,
                  }),
                  (0, F.jsx)(r, {
                    size: `sm`,
                    onClick: () => q(L),
                    children: `Capture & Stash Evidence`,
                  }),
                ],
              }),
            ],
          }),
        }),
    ],
  });
}
export { I as component };
