import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { D as ShieldCheck, F as Save, R as RefreshCw, Yt as Cpu, rt as Lock, wt as Globe } from "../_libs/lucide-react.mjs";
import { t as Switch } from "./switch-DtEVXaE2.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as ProfileSection, t as ProfileRow } from "./ProfileSection-Dgf4XSDG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/department.settings-DX1PwiNP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DeptSettingsPage() {
	const [immutableAudits, setImmutableAudits] = (0, import_react.useState)(true);
	const [crossRegistrySync, setCrossRegistrySync] = (0, import_react.useState)(true);
	const [publicTransparency, setPublicTransparency] = (0, import_react.useState)(true);
	const [autoSlaEscalation, setAutoSlaEscalation] = (0, import_react.useState)(true);
	const handleSave = () => {
		toast.success("System configuration saved to state directory.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl space-y-6 pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-0.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100",
					children: "System Configuration"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground leading-normal max-w-3xl",
					children: "Department-wide policy parameters, cryptographic ledger anchors, and statewide cross-registry synchronization."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ProfileSection, {
				title: "Ledger Trust & Cryptographic Anchors",
				description: "Statutory non-repudiation parameters governed under ISO/IEC 27001",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
						icon: ShieldCheck,
						title: "Immutable Audit Ledger Hashing",
						description: "Generates verifiable SHA-256 Merkle root proofs on every citizen application determination",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: immutableAudits,
							onCheckedChange: setImmutableAudits
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
						icon: RefreshCw,
						title: "Live Cross-Registry Reconciliation",
						description: "Continuous synchronization with state Bhulekh land registry, NFSA ration rosters, and UIDAI e-KYC",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: crossRegistrySync,
							onCheckedChange: setCrossRegistrySync
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
						icon: Globe,
						title: "Citizen Public Transparency Portal",
						description: "Publishes sanitized aggregate scheme disbursements and sanction statistics to public dashboard",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: publicTransparency,
							onCheckedChange: setPublicTransparency
						}),
						isLast: true
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ProfileSection, {
				title: "Department Operations & SLA Thresholds",
				description: "Automated bottleneck alerts and supervisory escalations",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
					icon: Cpu,
					title: "Automated 72-Hour SLA Escalation",
					description: "Dispatches overdue verification queries to regional supervisor inbox automatically",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: autoSlaEscalation,
						onCheckedChange: setAutoSlaEscalation
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
					icon: Lock,
					title: "Cryptographic Hardware Key Rotations",
					description: "Automated 90-day HSM token lifecycle enforcement across all verification cells",
					value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-xs text-emerald-600 font-semibold",
						children: "Active · 90-Day Policy"
					}),
					isLast: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end pt-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: handleSave,
					className: "text-xs bg-gov hover:bg-gov/90 text-white font-medium gap-1.5 shadow-2xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5" }), "Save System Configuration"]
				})
			})
		]
	});
}
//#endregion
export { DeptSettingsPage as component };
