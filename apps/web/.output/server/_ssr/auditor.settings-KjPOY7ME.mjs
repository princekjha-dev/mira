import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { $t as CloudDownload, Bt as FileCode, D as ShieldCheck, P as Scale } from "../_libs/lucide-react.mjs";
import { t as Switch } from "./switch-DtEVXaE2.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as ProfileSection, t as ProfileRow } from "./ProfileSection-Dgf4XSDG.mjs";
import { t as ProfilePage } from "./ProfilePage-BpU06W8a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auditor.settings-KjPOY7ME.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuditorProfileRoute() {
	const [strictProof, setStrictProof] = (0, import_react.useState)(true);
	const [anomalySentinel, setAnomalySentinel] = (0, import_react.useState)(true);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfilePage, { roleSpecificSection: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ProfileSection, {
		title: "Forensic Audit Standards (ISO/IEC 27001)",
		description: "CAG audit rigor parameters for continuous mathematical ledger verification",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
				icon: Scale,
				title: "Strict Merkle Hash Verification",
				description: "Re-calculates SHA-256 tree roots on every application determination in memory",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: strictProof,
					onCheckedChange: (val) => {
						setStrictProof(val);
						toast.success(val ? "Strict Merkle verification enabled" : "Standard batch verification mode");
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
				icon: ShieldCheck,
				title: "Automated Anomaly Sentinel",
				description: "Immediately flags overrides where an officer sanctioned outside statutory tolerance",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: anomalySentinel,
					onCheckedChange: (val) => {
						setAnomalySentinel(val);
						toast.success(val ? "Anomaly sentinel active" : "Anomaly sentinel disabled");
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
				icon: FileCode,
				title: "CAG Audit Cryptographic Bundle",
				description: "Read-only compliance export for parliamentary oversight committees",
				value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-[10px] text-slate-500",
					children: "BUNDLE-CAG-2026-Q3"
				}),
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => toast.success("Audit certificate downloaded", { description: "SHA256: 8a4c10…e449 verifiable proof bundle" }),
					className: "h-7 text-xs ml-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudDownload, { className: "mr-1 h-3 w-3" }), "Export"]
				}),
				isLast: true
			})
		]
	}) });
}
//#endregion
export { AuditorProfileRoute as component };
