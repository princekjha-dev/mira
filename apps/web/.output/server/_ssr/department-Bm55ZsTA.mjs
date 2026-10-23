import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { _ as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as Mail, Mn as Activity, N as ScrollText, Nt as FileStack, bn as Building2, ct as Link2, hn as ChartColumn, i as Workflow, k as Settings, lt as LayoutDashboard, nn as ClipboardList, ot as ListTree } from "../_libs/lucide-react.mjs";
import { l as RequireRole } from "./ui-C30c-cKm.mjs";
import { t as WorkspaceShell } from "./WorkspaceShell-BykzPLcR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/department-Bm55ZsTA.js
var import_jsx_runtime = require_jsx_runtime();
var ITEMS = [
	{
		to: "/department/dashboard",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		to: "/department/workflow",
		label: "Workflow Configurator",
		icon: Workflow
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
		to: "/department/applications",
		label: "Department Applications",
		icon: ClipboardList
	},
	{
		to: "/department/operations",
		label: "Operations & SLA Health",
		icon: Activity
	},
	{
		to: "/department/departments",
		label: "Directorate Directory",
		icon: Building2
	},
	{
		to: "/department/integrations",
		label: "Integrations & APIs",
		icon: Link2
	},
	{
		to: "/department/inbox",
		label: "Communications",
		icon: Mail
	},
	{
		to: "/department/reports",
		label: "Reports & Analytics",
		icon: ChartColumn
	},
	{
		to: "/department/audit",
		label: "Audit Ledger",
		icon: ScrollText
	},
	{
		to: "/department/settings",
		label: "Policy Settings",
		icon: Settings
	}
];
function DeptLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireRole, {
		role: ["admin", "supervisor"],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspaceShell, {
			title: "Department Administration",
			items: ITEMS,
			notifTo: "/department/notifications",
			inboxTo: "/department/inbox",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		})
	});
}
//#endregion
export { DeptLayout as component };
