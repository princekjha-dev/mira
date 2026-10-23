import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { cn as CircleCheck, pt as Key, t as Zap, xt as HardDrive } from "../_libs/lucide-react.mjs";
import { t as Switch } from "./switch-DtEVXaE2.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as ProfileSection, t as ProfileRow } from "./ProfileSection-Dgf4XSDG.mjs";
import { t as ProfilePage } from "./ProfilePage-BpU06W8a.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verifier.settings-D98O7ETC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VerifierProfileRoute() {
	const [autoAssign, setAutoAssign] = (0, import_react.useState)(true);
	const [offlineSync, setOfflineSync] = (0, import_react.useState)(true);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfilePage, { roleSpecificSection: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ProfileSection, {
		title: "Verification Workstation & HSM Security",
		description: "Operational queue parameters and cryptographic hardware signing tokens",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
				icon: Zap,
				title: "Auto-Triage Next Available Case",
				description: "Automatically locks the next critical SLA application on determination completion",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: autoAssign,
					onCheckedChange: (val) => {
						setAutoAssign(val);
						toast.success(val ? "Auto-triage enabled: next case will auto-lock" : "Auto-triage disabled: manual queue selection active");
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
				icon: HardDrive,
				title: "Encrypted Document Cache",
				description: "Maintains encrypted local cache for instantaneous side-by-side verification rendering",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: offlineSync,
					onCheckedChange: (val) => {
						setOfflineSync(val);
						toast.success(val ? "Workstation local cache enabled" : "Workstation cache purged");
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
				icon: Key,
				title: "Hardware Security Module (HSM) Token",
				description: "FIPS 140-2 Level 3 cryptographic smartcard for immutable determination signing",
				value: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), "HSM Connected (UP-GOV-HSM-4029)"]
				}),
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => toast.success("HSM Cryptographic Key Verified"),
					className: "h-7 text-xs ml-2",
					children: "Test Key"
				}),
				isLast: true
			})
		]
	}) });
}
//#endregion
export { VerifierProfileRoute as component };
