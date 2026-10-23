import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-BT328xhy.mjs";
import { Kt as FileCheck, Lt as FileText, On as Banknote, _t as Landmark, k as ShieldCheck, wn as Building, zt as FileSpreadsheet } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as ProfileSection, t as ProfileRow } from "./ProfileSection-Db5W_g4I.mjs";
import { t as ProfilePage } from "./ProfilePage-BVIQGx5Q.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-CC_Gil3n.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/citizen.settings-CAo2w1ED.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CitizenProfileRoute() {
	const [records, setRecords] = (0, import_react.useState)([
		{
			id: "civil",
			label: "Civil Registration (Birth & Family Tree)",
			linked: true,
			icon: FileCheck
		},
		{
			id: "revenue",
			label: "Revenue Registry (Income & Caste Certificates)",
			linked: true,
			icon: Building
		},
		{
			id: "land",
			label: "Tehsil Bhulekh (Land & Holding Records)",
			linked: true,
			icon: Landmark
		},
		{
			id: "bpl",
			label: "Rural Development (NFSA & BPL Roster)",
			linked: true,
			icon: FileSpreadsheet
		},
		{
			id: "dbt",
			label: "DBT Direct Benefit Bank Account (PFMS)",
			linked: false,
			icon: Banknote
		}
	]);
	const [revokeTarget, setRevokeTarget] = (0, import_react.useState)(null);
	const handleToggle = (item) => {
		if (item.linked) setRevokeTarget(item.label);
		else {
			setRecords((prev) => prev.map((r) => r.id === item.id ? {
				...r,
				linked: true
			} : r));
			toast.success(`${item.label} successfully linked.`);
		}
	};
	const confirmUnlink = () => {
		if (!revokeTarget) return;
		setRecords((prev) => prev.map((r) => r.label === revokeTarget ? {
			...r,
			linked: false
		} : r));
		toast.info(`${revokeTarget} unlinked from real-time verification.`);
		setRevokeTarget(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfilePage, { roleSpecificSection: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileSection, {
		title: "Connected Government Registries",
		description: "Authorised state registries synchronized for instant benefit eligibility verification",
		children: records.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
			icon: r.icon,
			title: r.label,
			description: r.linked ? "Real-time state API synchronization active" : "Manual document upload required for verification",
			value: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: `inline-flex items-center gap-1 font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full border ${r.linked ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20" : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:border-slate-700"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 w-1.5 rounded-full ${r.linked ? "bg-emerald-500" : "bg-slate-400"}` }), r.linked ? "Synchronized" : "Disconnected"]
			}),
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "sm",
				onClick: () => handleToggle(r),
				className: "h-7 text-xs ml-2",
				children: r.linked ? "Disconnect" : "Connect"
			}),
			isLast: i === records.length - 1
		}, r.id))
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ProfileSection, {
		title: "Privacy, Data Consent & Audit",
		description: "Statutory non-repudiation and consent receipts recorded in immutable audit log",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
			icon: ShieldCheck,
			title: "Application Verification Consent",
			description: "Permission for officers to query linked records for scheme sanctions",
			value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-emerald-600 dark:text-emerald-400 font-semibold text-xs",
				children: "Active Consent"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
			icon: FileText,
			title: "Data Access Disclosure Report",
			description: "Full forensic report of every officer and department that accessed your files",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "sm",
				onClick: () => toast.success("Forensic disclosure report prepared", { description: "Available in your Notifications within 24 hours." }),
				className: "h-7 text-xs",
				children: "Request Report"
			}),
			isLast: true
		})]
	})] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
		open: !!revokeTarget,
		onOpenChange: (o) => !o && setRevokeTarget(null),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, {
			className: "rounded-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, {
				className: "text-sm font-semibold",
				children: [
					"Disconnect ",
					revokeTarget,
					"?"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, {
				className: "text-xs text-muted-foreground",
				children: "Applications requiring this registry will require physical document upload and slower manual tehsil verification."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
				className: "text-xs h-8",
				children: "Cancel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
				onClick: confirmUnlink,
				className: "text-xs h-8 bg-rose-600 hover:bg-rose-700 text-white",
				children: "Disconnect"
			})] })]
		})
	})] });
}
//#endregion
export { CitizenProfileRoute as component };
