import { c as e, l as t } from "./button-KmRTh43o.js";
import { t as n } from "./camera-O7_j0XUn.js";
import { a as r, n as i } from "./role-config-SRjM_HxE.js";
import { t as a } from "./file-search-ByiRh-nu.js";
import { t as o } from "./house-C7oibhrH.js";
import { n as s, t as c } from "./WorkspaceShell-CSEbCXFL.js";
import { t as l } from "./mail-BPXI5_FF.js";
import { t as u } from "./navigation-D6fdW4KN.js";
import { t as d } from "./octagon-alert-Ca3H8Dym.js";
import {
  A as f,
  Ft as p,
  Jt as m,
  Ln as h,
  Ot as g,
  Wt as _,
  un as v,
} from "./index-B8Y-_llO.js";
var y = e(`clipboard-check`, [
    [
      `rect`,
      {
        width: `8`,
        height: `4`,
        x: `8`,
        y: `2`,
        rx: `1`,
        ry: `1`,
        key: `tgr4d6`,
      },
    ],
    [
      `path`,
      {
        d: `M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2`,
        key: `116196`,
      },
    ],
    [`path`, { d: `m9 14 2 2 4-4`, key: `df797q` }],
  ]),
  b = t(),
  x = [
    { to: `/officer/dashboard`, label: `Dashboard`, icon: s },
    { to: `/officer/field-visits`, label: `Field Inspections`, icon: u },
    { to: `/officer/applications`, label: `Applications`, icon: y },
    { to: `/officer/verification`, label: `Verification Queue`, icon: _ },
    { to: `/officer/evidence`, label: `Evidence Vault`, icon: n },
    { to: `/officer/duplicates`, label: `Duplicate Alerts`, icon: d },
    { to: `/officer/inbox`, label: `Communications`, icon: l },
    { to: `/officer/citizens/C-1001`, label: `Citizen Records`, icon: g },
    {
      to: `/officer/families/HH-UP-0417-2291`,
      label: `Family Records`,
      icon: o,
    },
    { to: `/officer/documents`, label: `Documents`, icon: m },
    { to: `/schemes`, label: `Schemes`, icon: a },
    { to: `/officer/reports`, label: `Reports`, icon: r },
    { to: `/officer/audit`, label: `Audit Logs`, icon: p },
    { to: `/officer/notifications`, label: `Notifications`, icon: v },
    { to: `/officer/settings`, label: `Settings`, icon: i },
  ];
function S() {
  return (0, b.jsx)(f, {
    role: `officer`,
    children: (0, b.jsx)(c, {
      title: `Field Official Workspace`,
      items: x,
      notifTo: `/officer/notifications`,
      inboxTo: `/officer/inbox`,
      children: (0, b.jsx)(h, {}),
    }),
  });
}
export { S as component };
