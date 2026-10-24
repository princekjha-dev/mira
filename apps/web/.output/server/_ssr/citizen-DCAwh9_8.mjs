import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { _ as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as RequireRole } from "./ui-Df8W68Fj.mjs";
import { t as MiraShell } from "./MiraShell-g-lwmd79.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/citizen-DCAwh9_8.js
var import_jsx_runtime = require_jsx_runtime();
function CitizenLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireRole, {
		role: "citizen",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) })
	});
}
//#endregion
export { CitizenLayout as component };
