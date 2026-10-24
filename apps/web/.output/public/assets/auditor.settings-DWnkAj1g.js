import { c as e, f as t, l as n, t as r, u as i } from "./button-KmRTh43o.js";
import { t as a } from "./cloud-download-BzyOEdhj.js";
import { t as o } from "./ProfilePage-NmHVoZXQ.js";
import { n as s, t as c } from "./ProfileSection-Byb9vkPr.js";
import { It as l, J as u, Mt as d, Tt as f } from "./index-B8Y-_llO.js";
var p = e(`file-code`, [
    [
      `path`,
      {
        d: `M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z`,
        key: `1oefj6`,
      },
    ],
    [`path`, { d: `M14 2v5a1 1 0 0 0 1 1h5`, key: `wfsgrz` }],
    [`path`, { d: `M10 12.5 8 15l2 2.5`, key: `1tg20x` }],
    [`path`, { d: `m14 12.5 2 2.5-2 2.5`, key: `yinavb` }],
  ]),
  m = t(i()),
  h = n();
function g() {
  let [e, t] = (0, m.useState)(!0),
    [n, i] = (0, m.useState)(!0);
  return (0, h.jsx)(o, {
    roleSpecificSection: (0, h.jsxs)(c, {
      title: `Forensic Audit Standards (ISO/IEC 27001)`,
      description: `CAG audit rigor parameters for continuous mathematical ledger verification`,
      children: [
        (0, h.jsx)(s, {
          icon: l,
          title: `Strict Merkle Hash Verification`,
          description: `Re-calculates SHA-256 tree roots on every application determination in memory`,
          action: (0, h.jsx)(u, {
            checked: e,
            onCheckedChange: (e) => {
              (t(e),
                f.success(
                  e
                    ? `Strict Merkle verification enabled`
                    : `Standard batch verification mode`,
                ));
            },
          }),
        }),
        (0, h.jsx)(s, {
          icon: d,
          title: `Automated Anomaly Sentinel`,
          description: `Immediately flags overrides where an officer sanctioned outside statutory tolerance`,
          action: (0, h.jsx)(u, {
            checked: n,
            onCheckedChange: (e) => {
              (i(e),
                f.success(
                  e ? `Anomaly sentinel active` : `Anomaly sentinel disabled`,
                ));
            },
          }),
        }),
        (0, h.jsx)(s, {
          icon: p,
          title: `CAG Audit Cryptographic Bundle`,
          description: `Read-only compliance export for parliamentary oversight committees`,
          value: (0, h.jsx)(`span`, {
            className: `font-mono text-[10px] text-slate-500`,
            children: `BUNDLE-CAG-2026-Q3`,
          }),
          action: (0, h.jsxs)(r, {
            variant: `outline`,
            size: `sm`,
            onClick: () =>
              f.success(`Audit certificate downloaded`, {
                description: `SHA256: 8a4c10…e449 verifiable proof bundle`,
              }),
            className: `h-7 text-xs ml-2`,
            children: [(0, h.jsx)(a, { className: `mr-1 h-3 w-3` }), `Export`],
          }),
          isLast: !0,
        }),
      ],
    }),
  });
}
export { g as component };
