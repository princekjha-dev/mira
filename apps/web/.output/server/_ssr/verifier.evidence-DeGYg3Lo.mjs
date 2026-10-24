import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { o as PageHeader } from "./ui-Df8W68Fj.mjs";
import { t as FilesExplorer } from "./FilesExplorer-Bt_gGmJH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verifier.evidence-DeGYg3Lo.js
var import_jsx_runtime = require_jsx_runtime();
function VerifierEvidencePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Verification Evidence Vault",
			desc: "Authoritative document store, version diffing, and cryptographic file checksum records.",
			crumbs: [{
				label: "Verifier",
				to: "/verifier/dashboard"
			}, { label: "Evidence Vault" }]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilesExplorer, {})]
	});
}
//#endregion
export { VerifierEvidencePage as component };
