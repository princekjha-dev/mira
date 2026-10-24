import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { o as PageHeader } from "./ui-Df8W68Fj.mjs";
import { t as FilesExplorer } from "./FilesExplorer-Bt_gGmJH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auditor.evidence-BsufrVRa.js
var import_jsx_runtime = require_jsx_runtime();
function AuditorEvidencePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Forensic Evidence & Document Vault",
			desc: "Read-only forensic inspection of uploaded affidavits, land deeds, income certificates, and version trees.",
			crumbs: [{
				label: "Auditor",
				to: "/auditor/dashboard"
			}, { label: "Evidence Vault" }]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilesExplorer, {})]
	});
}
//#endregion
export { AuditorEvidencePage as component };
