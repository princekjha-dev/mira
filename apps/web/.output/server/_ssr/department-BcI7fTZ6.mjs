import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { g as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
import { Ft as ChartColumn, K as Link2, W as ListTree, at as GitBranch, ft as FileStack, q as LayoutDashboard, r as Workflow, w as ScrollText } from "../_libs/lucide-react.mjs";
import { u as RequireRole } from "./ui-BPP2eTpy.mjs";
import { t as WorkspaceShell } from "./WorkspaceShell-BynGC3fb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/department-BcI7fTZ6.js
var import_jsx_runtime = require_jsx_runtime();
var ITEMS = [
	{
		to: "/department/dashboard",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		to: "/department/schemes",
		label: "Manage Schemes",
		icon: FileStack,
		exact: true
	},
	{
		to: "/department/rules",
		label: "Eligibility Rules",
		icon: ListTree
	},
	{
		to: "/department/schemes/rural-housing",
		label: "Required Documents & Workflow",
		icon: Workflow
	},
	{
		to: "/department/integrations",
		label: "Department Integrations",
		icon: Link2
	},
	{
		to: "/department/reports",
		label: "Reports",
		icon: ChartColumn
	},
	{
		to: "/department/rules",
		label: "Rule Versions",
		icon: GitBranch
	},
	{
		to: "/department/audit",
		label: "Audit Logs",
		icon: ScrollText
	}
];
function DeptLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireRole, {
		role: "admin",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspaceShell, {
			title: "Department Portal",
			items: ITEMS,
			notifTo: "/department/audit",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		})
	});
}
//#endregion
export { DeptLayout as component };
