import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { g as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
import { Bt as Bell, Ct as ClipboardCheck, Ft as ChartColumn, G as ListChecks, P as OctagonAlert, S as Settings, Z as House, dt as FileText, o as Users, pt as FileSearch, q as LayoutDashboard, w as ScrollText } from "../_libs/lucide-react.mjs";
import { u as RequireRole } from "./ui-BPP2eTpy.mjs";
import { t as WorkspaceShell } from "./WorkspaceShell-BynGC3fb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/officer-CTLI8k-x.js
var import_jsx_runtime = require_jsx_runtime();
var ITEMS = [
	{
		to: "/officer/dashboard",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		to: "/officer/applications",
		label: "Applications",
		icon: ClipboardCheck
	},
	{
		to: "/officer/verification",
		label: "Verification Queue",
		icon: ListChecks
	},
	{
		to: "/officer/duplicates",
		label: "Duplicate Alerts",
		icon: OctagonAlert
	},
	{
		to: "/officer/citizens/C-1001",
		label: "Citizen Records",
		icon: Users
	},
	{
		to: "/officer/families/HH-UP-0417-2291",
		label: "Family Records",
		icon: House
	},
	{
		to: "/officer/documents",
		label: "Documents",
		icon: FileText
	},
	{
		to: "/schemes",
		label: "Schemes",
		icon: FileSearch
	},
	{
		to: "/officer/reports",
		label: "Reports",
		icon: ChartColumn
	},
	{
		to: "/officer/audit",
		label: "Audit Logs",
		icon: ScrollText
	},
	{
		to: "/officer/notifications",
		label: "Notifications",
		icon: Bell
	},
	{
		to: "/officer/settings",
		label: "Settings",
		icon: Settings
	}
];
function OfficerLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireRole, {
		role: "officer",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspaceShell, {
			title: "Officer Workspace",
			items: ITEMS,
			notifTo: "/officer/notifications",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		})
	});
}
//#endregion
export { OfficerLayout as component };
