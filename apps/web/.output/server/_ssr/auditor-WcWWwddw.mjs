import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { _ as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as Mail, $t as CloudDownload, Ft as FileSearch, Ht as FileCheckCorner, N as ScrollText, P as Scale, c as UsersRound, hn as ChartColumn, k as Settings, lt as LayoutDashboard } from "../_libs/lucide-react.mjs";
import { l as RequireRole } from "./ui-C30c-cKm.mjs";
import { t as WorkspaceShell } from "./WorkspaceShell-BykzPLcR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auditor-WcWWwddw.js
var import_jsx_runtime = require_jsx_runtime();
var ITEMS = [
	{
		to: "/auditor/dashboard",
		label: "Forensic Overview",
		icon: LayoutDashboard
	},
	{
		to: "/auditor/audit",
		label: "Audit Ledger",
		icon: ScrollText
	},
	{
		to: "/auditor/applications",
		label: "Applications Audit",
		icon: FileSearch
	},
	{
		to: "/auditor/decisions",
		label: "Hashed Decisions",
		icon: Scale
	},
	{
		to: "/auditor/evidence",
		label: "Evidence Vault",
		icon: FileCheckCorner
	},
	{
		to: "/auditor/rules",
		label: "Eligibility Rule Audit",
		icon: Scale
	},
	{
		to: "/auditor/officers",
		label: "Officer Integrity",
		icon: UsersRound
	},
	{
		to: "/auditor/reports",
		label: "Forensic Reports",
		icon: ChartColumn
	},
	{
		to: "/auditor/export",
		label: "Cryptographic Export",
		icon: CloudDownload
	},
	{
		to: "/auditor/inbox",
		label: "Audit Communications",
		icon: Mail
	},
	{
		to: "/auditor/settings",
		label: "Audit Standards",
		icon: Settings
	}
];
function AuditorLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireRole, {
		role: ["auditor", "admin"],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspaceShell, {
			title: "Forensic Audit Authority",
			items: ITEMS,
			notifTo: "/auditor/dashboard",
			inboxTo: "/auditor/inbox",
			isAuditor: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		})
	});
}
//#endregion
export { AuditorLayout as component };
