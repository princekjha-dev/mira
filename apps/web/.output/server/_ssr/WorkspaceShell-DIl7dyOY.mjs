import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as MiraShell } from "./MiraShell-G5CKBUwT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/WorkspaceShell-DIl7dyOY.js
var import_jsx_runtime = require_jsx_runtime();
function WorkspaceShell({ title, items, children, isAuditor = false }) {
  const convertedItems = items.map((it, idx) => ({
    id: `nav-${idx}`,
    label: it.label,
    to: it.to,
    icon: it.icon,
    exact: it.exact,
  }));
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraShell, {
    title,
    items: convertedItems,
    isReadOnly: isAuditor,
    children,
  });
}
//#endregion
export { WorkspaceShell as t };
