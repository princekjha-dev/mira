import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { _ as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as Mail, At as Flag, Ht as FileCheckCorner, N as ScrollText, gn as Camera, h as TriangleAlert, k as Settings, lt as LayoutDashboard, st as ListChecks } from "../_libs/lucide-react.mjs";
import { l as RequireRole } from "./ui-C30c-cKm.mjs";
import { t as WorkspaceShell } from "./WorkspaceShell-BykzPLcR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verifier-x5C1Tc6m.js
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
