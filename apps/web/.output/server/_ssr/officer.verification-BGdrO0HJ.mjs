import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { F as useApp } from "./app-state-7jSiCijd.mjs";
import { o as PageHeader } from "./ui-lDSlMDlK.mjs";
import { t as OfficerAppTable } from "./OfficerAppTable-BJLTn5aZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/officer.verification-BGdrO0HJ.js
var import_jsx_runtime = require_jsx_runtime();
var SplitComponent = () => {
	const { state } = useApp();
	const q = state.applications.filter((a) => [
		"Verification Required",
		"Documents Under Review",
		"Officer Review",
		"Submitted",
		"Additional Evidence Required"
	].includes(a.status));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Verification Queue",
		desc: "Flagged items need your review. Nothing in this queue has been rejected automatically."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfficerAppTable, { apps: q })] });
};
//#endregion
export { SplitComponent as component };
