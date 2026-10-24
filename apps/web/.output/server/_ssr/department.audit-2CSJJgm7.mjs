import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { o as PageHeader } from "./ui-lDSlMDlK.mjs";
import { t as AuditTable } from "./AuditTable-DWvohFV6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/department.audit-2CSJJgm7.js
var import_jsx_runtime = require_jsx_runtime();
var SplitComponent = () =>
  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
        title: "Audit Logs",
        desc: "Includes officer decisions, rule changes and record verifications.",
      }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuditTable, {}),
    ],
  });
//#endregion
export { SplitComponent as component };
