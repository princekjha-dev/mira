import { l as e } from "./button-KmRTh43o.js";
import { D as t, nn as n, x as r } from "./index-B8Y-_llO.js";
import { a as i, i as a, n as o, t as s } from "./card-DNkZ-jvk.js";
var c = e();
function l() {
  return (0, c.jsxs)(`div`, {
    className: `space-y-6`,
    children: [
      (0, c.jsx)(t, {
        title: `Operations & Queue Health Monitoring`,
        desc: `Systemic SLA tracking, verification bottleneck detection, and processing load indicators across administrative blocks.`,
        crumbs: [
          { label: `Department`, to: `/department/dashboard` },
          { label: `Operations` },
        ],
      }),
      (0, c.jsxs)(`div`, {
        className: `grid grid-cols-2 gap-4 lg:grid-cols-4`,
        children: [
          (0, c.jsx)(s, {
            className: `border-border/80 shadow-xs`,
            children: (0, c.jsxs)(o, {
              className: `p-4`,
              children: [
                (0, c.jsx)(`span`, {
                  className: `text-xs font-medium text-muted-foreground`,
                  children: `Overall System Health`,
                }),
                (0, c.jsxs)(`div`, {
                  className: `mt-2 text-2xl font-bold text-teal-600 flex items-center gap-1.5`,
                  children: [(0, c.jsx)(n, { className: `h-6 w-6` }), ` 99.4%`],
                }),
                (0, c.jsx)(`p`, {
                  className: `text-[11px] text-muted-foreground`,
                  children: `All verification services active`,
                }),
              ],
            }),
          }),
          (0, c.jsx)(s, {
            className: `border-border/80 shadow-xs`,
            children: (0, c.jsxs)(o, {
              className: `p-4`,
              children: [
                (0, c.jsx)(`span`, {
                  className: `text-xs font-medium text-muted-foreground`,
                  children: `SLA Breaches (24h)`,
                }),
                (0, c.jsx)(`div`, {
                  className: `mt-2 text-2xl font-bold text-amber-600`,
                  children: `4 cases`,
                }),
                (0, c.jsx)(`p`, {
                  className: `text-[11px] text-amber-600`,
                  children: `Dispatched to regional supervisor`,
                }),
              ],
            }),
          }),
          (0, c.jsx)(s, {
            className: `border-border/80 shadow-xs`,
            children: (0, c.jsxs)(o, {
              className: `p-4`,
              children: [
                (0, c.jsx)(`span`, {
                  className: `text-xs font-medium text-muted-foreground`,
                  children: `Active Triage Load`,
                }),
                (0, c.jsx)(`div`, {
                  className: `mt-2 text-2xl font-bold`,
                  children: `223 items`,
                }),
                (0, c.jsx)(`p`, {
                  className: `text-[11px] text-muted-foreground`,
                  children: `Across 14 officer queues`,
                }),
              ],
            }),
          }),
          (0, c.jsx)(s, {
            className: `border-border/80 shadow-xs`,
            children: (0, c.jsxs)(o, {
              className: `p-4`,
              children: [
                (0, c.jsx)(`span`, {
                  className: `text-xs font-medium text-muted-foreground`,
                  children: `Average Resolution Speed`,
                }),
                (0, c.jsx)(`div`, {
                  className: `mt-2 text-2xl font-bold text-primary`,
                  children: `16.8 hrs`,
                }),
                (0, c.jsx)(`p`, {
                  className: `text-[11px] text-teal-600`,
                  children: `Statutory limit: 48.0 hrs`,
                }),
              ],
            }),
          }),
        ],
      }),
      (0, c.jsxs)(`div`, {
        className: `space-y-4`,
        children: [
          (0, c.jsx)(`h2`, {
            className: `text-sm font-semibold text-foreground`,
            children: `Jurisdictional Queue Health Status`,
          }),
          (0, c.jsx)(`div`, {
            className: `grid gap-4 md:grid-cols-2`,
            children: [
              {
                name: `Rural Housing Assistance (Tier 1 Triage)`,
                count: 28,
                slaBreaches: 0,
                medianTime: `11.4h`,
                health: `Optimal`,
              },
              {
                name: `Old Age Pension Cross-Verification`,
                count: 64,
                slaBreaches: 1,
                medianTime: `18.2h`,
                health: `Normal`,
              },
              {
                name: `Farmer Fertilizer Subsidy Aadhaar Linkage`,
                count: 112,
                slaBreaches: 3,
                medianTime: `26.8h`,
                health: `Elevated`,
              },
              {
                name: `State Girl Child Education Grant`,
                count: 19,
                slaBreaches: 0,
                medianTime: `8.5h`,
                health: `Optimal`,
              },
            ].map((e) =>
              (0, c.jsxs)(
                s,
                {
                  className: `border-border/80 shadow-xs`,
                  children: [
                    (0, c.jsx)(a, {
                      className: `p-4 pb-2`,
                      children: (0, c.jsxs)(`div`, {
                        className: `flex items-center justify-between`,
                        children: [
                          (0, c.jsx)(i, {
                            className: `text-sm font-semibold`,
                            children: e.name,
                          }),
                          (0, c.jsx)(r, {
                            variant: `outline`,
                            className: `text-[10px] ${e.health === `Optimal` ? `border-teal-400 bg-teal-500/10 text-teal-700 dark:text-teal-300` : e.health === `Normal` ? `border-blue-400 bg-blue-500/10 text-blue-700 dark:text-blue-300` : `border-amber-400 bg-amber-500/10 text-amber-700 dark:text-amber-300`}`,
                            children: e.health,
                          }),
                        ],
                      }),
                    }),
                    (0, c.jsxs)(o, {
                      className: `p-4 pt-1 space-y-2 text-xs`,
                      children: [
                        (0, c.jsxs)(`div`, {
                          className: `flex justify-between border-b pb-1.5`,
                          children: [
                            (0, c.jsx)(`span`, {
                              className: `text-muted-foreground`,
                              children: `Pending in Queue:`,
                            }),
                            (0, c.jsxs)(`span`, {
                              className: `font-semibold text-foreground`,
                              children: [e.count, ` cases`],
                            }),
                          ],
                        }),
                        (0, c.jsxs)(`div`, {
                          className: `flex justify-between border-b pb-1.5`,
                          children: [
                            (0, c.jsx)(`span`, {
                              className: `text-muted-foreground`,
                              children: `Median Resolution Time:`,
                            }),
                            (0, c.jsx)(`span`, {
                              className: `font-medium text-foreground`,
                              children: e.medianTime,
                            }),
                          ],
                        }),
                        (0, c.jsxs)(`div`, {
                          className: `flex justify-between pb-1`,
                          children: [
                            (0, c.jsx)(`span`, {
                              className: `text-muted-foreground`,
                              children: `SLA Breach Count:`,
                            }),
                            (0, c.jsxs)(`span`, {
                              className: `font-semibold ${e.slaBreaches > 0 ? `text-amber-600` : `text-teal-600`}`,
                              children: [e.slaBreaches, ` breaches`],
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
      }),
    ],
  });
}
export { l as component };
