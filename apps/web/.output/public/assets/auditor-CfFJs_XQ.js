import { l as e } from "./button-KmRTh43o.js";
import { a as t, n } from "./role-config-SRjM_HxE.js";
import { t as r } from "./cloud-download-BzyOEdhj.js";
import { t as i } from "./file-search-ByiRh-nu.js";
import { n as a, t as o } from "./WorkspaceShell-CSEbCXFL.js";
import { t as s } from "./mail-BPXI5_FF.js";
import { t as c } from "./users-round-BAofTSk0.js";
import {
  A as l,
  Ft as u,
  It as d,
  Ln as f,
  Xt as p,
} from "./index-B8Y-_llO.js";
var m = e(),
  h = [
    { to: `/auditor/dashboard`, label: `Forensic Overview`, icon: a },
    { to: `/auditor/audit`, label: `Audit Ledger`, icon: u },
    { to: `/auditor/applications`, label: `Applications Audit`, icon: i },
    { to: `/auditor/decisions`, label: `Hashed Decisions`, icon: d },
    { to: `/auditor/evidence`, label: `Evidence Vault`, icon: p },
    { to: `/auditor/rules`, label: `Eligibility Rule Audit`, icon: d },
    { to: `/auditor/officers`, label: `Officer Integrity`, icon: c },
    { to: `/auditor/reports`, label: `Forensic Reports`, icon: t },
    { to: `/auditor/export`, label: `Cryptographic Export`, icon: r },
    { to: `/auditor/inbox`, label: `Audit Communications`, icon: s },
    { to: `/auditor/settings`, label: `Audit Standards`, icon: n },
  ];
function g() {
  return (0, m.jsx)(l, {
    role: [`auditor`, `admin`],
    children: (0, m.jsx)(o, {
      title: `Forensic Audit Authority`,
      items: h,
      notifTo: `/auditor/dashboard`,
      inboxTo: `/auditor/inbox`,
      isAuditor: !0,
      children: (0, m.jsx)(f, {}),
    }),
  });
}
export { g as component };
