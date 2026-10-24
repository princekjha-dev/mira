import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { F as useApp } from "./app-state-7jSiCijd.mjs";
import { Dn as Bell } from "../_libs/lucide-react.mjs";
import { o as PageHeader } from "./ui-lDSlMDlK.mjs";
import { n as CardContent, t as Card } from "./card-D_Z_TEMQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/department.notifications-CrzG55bv.js
var import_jsx_runtime = require_jsx_runtime();
function DeptNotificationsPage() {
  const { state } = useApp();
  const notifs = state.notifications || [];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
    className: "space-y-6",
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
        title: "Department Notices & Alerts",
        desc: "Real-time alerts on statutory deadlines, SLA thresholds, and administrative dispatches.",
        crumbs: [
          {
            label: "Department",
            to: "/department/dashboard",
          },
          { label: "Notifications" },
        ],
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
        className: "border-border/80 shadow-xs",
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
          className: "p-0",
          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
            className: "divide-y divide-border text-xs",
            children: notifs.map((n) =>
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "div",
                {
                  className:
                    "p-4 flex items-start gap-3 hover:bg-muted/30 transition-colors",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, {
                      className: "h-4 w-4 text-primary shrink-0 mt-0.5",
                    }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                      className: "flex-1",
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                          className: "flex items-center justify-between",
                          children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                              className:
                                "font-semibold text-foreground text-sm",
                              children: n.title,
                            }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                              "span",
                              {
                                className: "text-[11px] text-muted-foreground",
                                children: n.date,
                              },
                            ),
                          ],
                        }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                          className: "mt-1 text-muted-foreground",
                          children: n.body,
                        }),
                      ],
                    }),
                  ],
                },
                n.id,
              ),
            ),
          }),
        }),
      }),
    ],
  });
}
//#endregion
export { DeptNotificationsPage as component };
