import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { o as PageHeader } from "./ui-C30c-cKm.mjs";
import { t as FilesExplorer } from "./FilesExplorer-CkJadSrr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/officer.evidence-PxYgFioI.js
var import_jsx_runtime = require_jsx_runtime();
function OfficerEvidencePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Evidence & Document Vault",
			desc: "Immutable document repository, field inspection geotagged photographs, and version histories.",
			crumbs: [{
				label: "Officer",
				to: "/officer/dashboard"
			}, { label: "Evidence Vault" }]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilesExplorer, {})]
	});
}
//#endregion
export { OfficerEvidencePage as component };
