import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { _ as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as ScrollText, Ft as Flag, _ as TriangleAlert, ft as ListChecks, it as Mail, j as Settings, mt as LayoutDashboard, qt as FileCheckCorner, xn as Camera } from "../_libs/lucide-react.mjs";
import { l as RequireRole } from "./ui-Df8W68Fj.mjs";
import { t as WorkspaceShell } from "./WorkspaceShell-YbtT8mIt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verifier-EVFRgqPR.js
var import_jsx_runtime = require_jsx_runtime();
var ITEMS = [
	{
		to: "/verifier/dashboard",
		label: "Workstation Overview",
		icon: LayoutDashboard
	},
	{
		to: "/verifier/queue",
		label: "Verification Queue",
		icon: ListChecks
	},
	{
		to: "/verifier/documents",
		label: "Document Comparison",
		icon: FileCheckCorner
	},
	{
		to: "/verifier/mismatches",
		label: "Mismatch Resolution",
		icon: TriangleAlert
	},
	{
		to: "/verifier/evidence",
		label: "Evidence Vault",
		icon: Camera
	},
	{
		to: "/verifier/escalations",
		label: "Escalations & Flags",
		icon: Flag
	},
	{
		to: "/verifier/inbox",
		label: "Communications",
		icon: Mail
	},
	{
		to: "/verifier/audit",
		label: "Audit Ledger",
		icon: ScrollText
	},
	{
		to: "/verifier/settings",
		label: "Workstation Config",
		icon: Settings
	}
];
function VerifierLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireRole, {
		role: [
			"verifier",
			"supervisor",
			"admin",
			"officer"
		],
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkspaceShell, {
			title: "Verification Workstation",
			items: ITEMS,
			notifTo: "/verifier/dashboard",
			inboxTo: "/verifier/inbox",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		})
	});
}
//#endregion
export { VerifierLayout as component };
