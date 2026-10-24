import { l as e } from "./button-KmRTh43o.js";
import { t } from "./link-gIn96cdo.js";
import { D as n, mn as r } from "./index-B8Y-_llO.js";
var i = e();
function a() {
  let { state: e } = r();
  return (0, i.jsxs)(`div`, {
    children: [
      (0, i.jsx)(n, {
        title: `Notifications`,
        desc: `Recent activity on applications in your jurisdiction.`,
      }),
      (0, i.jsx)(`ul`, {
        className: `divide-y rounded-lg border bg-card`,
        children: e.audit
          .slice(0, 12)
          .map((e) =>
            (0, i.jsxs)(
              `li`,
              {
                className: `p-4 text-sm`,
                children: [
                  (0, i.jsx)(`p`, {
                    className: `font-medium`,
                    children: e.action,
                  }),
                  (0, i.jsxs)(`p`, {
                    className: `text-muted-foreground`,
                    children: [e.application, ` · `, e.reason],
                  }),
                  (0, i.jsxs)(`p`, {
                    className: `text-xs text-muted-foreground`,
                    children: [e.ts, ` · `, e.actor],
                  }),
                  e.application.startsWith(`APP-`) &&
                    (0, i.jsx)(t, {
                      to: `/officer/applications/$id`,
                      params: { id: e.application },
                      className: `text-xs text-gov hover:underline`,
                      children: `Open application`,
                    }),
                ],
              },
              e.id,
            ),
          ),
      }),
    ],
  });
}
export { a as component };
