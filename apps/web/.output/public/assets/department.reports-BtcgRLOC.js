import { l as e } from "./button-KmRTh43o.js";
import { D as t, O as n, k as r, mn as i } from "./index-B8Y-_llO.js";
import { t as a } from "./Reports-Df5Bx8u9.js";
var o = e();
function s() {
  let { state: e } = i();
  return (0, o.jsxs)(`div`, {
    className: `space-y-6`,
    children: [
      (0, o.jsx)(t, { title: `Reports` }),
      (0, o.jsx)(a, {}),
      (0, o.jsx)(n, {
        title: `Duplicate alerts by outcome`,
        children: (0, o.jsx)(`ul`, {
          className: `space-y-2 text-sm`,
          children: e.alerts.map((e) =>
            (0, o.jsxs)(
              `li`,
              {
                className: `flex justify-between`,
                children: [
                  (0, o.jsxs)(`span`, {
                    children: [e.id, ` · `, e.applicant, ` · `, e.scheme],
                  }),
                  (0, o.jsx)(r, { children: e.status }),
                ],
              },
              e.id,
            ),
          ),
        }),
      }),
    ],
  });
}
export { s as component };
