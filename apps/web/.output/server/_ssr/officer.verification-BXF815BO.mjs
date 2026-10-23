import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { k as useApp } from "./button-B0ZnFkgi.mjs";
import { s as PageHeader } from "./ui-BPP2eTpy.mjs";
import { t as OfficerAppTable } from "./OfficerAppTable-hrHqXeZN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/officer.verification-BXF815BO.js
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
