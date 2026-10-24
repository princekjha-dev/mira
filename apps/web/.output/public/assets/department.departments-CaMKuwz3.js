import { l as e } from "./button-KmRTh43o.js";
import { Bt as t, D as n, Mt as r, x as i } from "./index-B8Y-_llO.js";
import { a, i as o, n as s, r as c, t as l } from "./card-DNkZ-jvk.js";
var u = e();
function d() {
  return (0, u.jsxs)(`div`, {
    className: `space-y-6`,
    children: [
      (0, u.jsx)(n, {
        title: `Directorate & Jurisdictional Directory`,
        desc: `State public service infrastructure nodes, jurisdictional administrative hierarchies, and officer allocations.`,
        crumbs: [
          { label: `Department`, to: `/department/dashboard` },
          { label: `Directorates` },
        ],
      }),
      (0, u.jsx)(`div`, {
        className: `grid gap-4 md:grid-cols-2`,
        children: [
          {
            name: `Directorate of Rural Development`,
            district: `Lucknow HQ`,
            head: `Arjun Mehta (Director General)`,
            schemes: 12,
            officers: 340,
            slaRate: `97.4%`,
            status: `Operational`,
          },
          {
            name: `District Welfare Office — Chandauli`,
            district: `Chandauli Rural & Urban`,
            head: `Vikramaditya Rao (District Magistrate / CWO)`,
            schemes: 8,
            officers: 42,
            slaRate: `94.8%`,
            status: `Operational`,
          },
          {
            name: `Department of Revenue & Land Records`,
            district: `UP State Center`,
            head: `Suresh P. Tiwari (Principal Secretary)`,
            schemes: 4,
            officers: 680,
            slaRate: `99.1%`,
            status: `Operational`,
          },
          {
            name: `Food & Civil Supplies Department (NFSA)`,
            district: `State Distribution Node`,
            head: `Meenakshi Sundaram (Commissioner)`,
            schemes: 3,
            officers: 512,
            slaRate: `98.2%`,
            status: `Operational`,
          },
        ].map((e) =>
          (0, u.jsxs)(
            l,
            {
              className: `border-border/80 shadow-xs`,
              children: [
                (0, u.jsx)(o, {
                  className: `p-5 pb-3`,
                  children: (0, u.jsx)(`div`, {
                    className: `flex items-start justify-between gap-2`,
                    children: (0, u.jsxs)(`div`, {
                      children: [
                        (0, u.jsxs)(i, {
                          variant: `outline`,
                          className: `mb-2 text-[10px] text-teal-700 dark:text-teal-300 border-teal-500/30 bg-teal-500/10`,
                          children: [
                            (0, u.jsx)(r, { className: `mr-1 h-3 w-3` }),
                            ` `,
                            e.status,
                          ],
                        }),
                        (0, u.jsx)(a, {
                          className: `text-base font-semibold`,
                          children: e.name,
                        }),
                        (0, u.jsxs)(c, {
                          className: `flex items-center gap-1.5 pt-1 text-xs`,
                          children: [
                            (0, u.jsx)(t, {
                              className: `h-3.5 w-3.5 text-muted-foreground shrink-0`,
                            }),
                            (0, u.jsx)(`span`, { children: e.district }),
                          ],
                        }),
                      ],
                    }),
                  }),
                }),
                (0, u.jsxs)(s, {
                  className: `p-5 pt-1 space-y-3 text-xs`,
                  children: [
                    (0, u.jsxs)(`div`, {
                      className: `flex justify-between border-b pb-2`,
                      children: [
                        (0, u.jsx)(`span`, {
                          className: `text-muted-foreground`,
                          children: `Officer-in-Charge:`,
                        }),
                        (0, u.jsx)(`span`, {
                          className: `font-medium text-foreground`,
                          children: e.head,
                        }),
                      ],
                    }),
                    (0, u.jsxs)(`div`, {
                      className: `grid grid-cols-3 gap-2 rounded-lg bg-muted/30 p-2.5 text-center`,
                      children: [
                        (0, u.jsxs)(`div`, {
                          children: [
                            (0, u.jsx)(`div`, {
                              className: `text-[10px] text-muted-foreground`,
                              children: `Active Schemes`,
                            }),
                            (0, u.jsx)(`div`, {
                              className: `font-bold text-foreground text-sm`,
                              children: e.schemes,
                            }),
                          ],
                        }),
                        (0, u.jsxs)(`div`, {
                          children: [
                            (0, u.jsx)(`div`, {
                              className: `text-[10px] text-muted-foreground`,
                              children: `Field Officers`,
                            }),
                            (0, u.jsx)(`div`, {
                              className: `font-bold text-foreground text-sm`,
                              children: e.officers,
                            }),
                          ],
                        }),
                        (0, u.jsxs)(`div`, {
                          children: [
                            (0, u.jsx)(`div`, {
                              className: `text-[10px] text-muted-foreground`,
                              children: `SLA Compliance`,
                            }),
                            (0, u.jsx)(`div`, {
                              className: `font-bold text-teal-600 text-sm`,
                              children: e.slaRate,
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            },
            e.name,
          ),
        ),
      }),
    ],
  });
}
export { d as component };
