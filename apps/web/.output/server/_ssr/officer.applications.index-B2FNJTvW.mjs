import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { k as useApp } from "./button-B0ZnFkgi.mjs";
import { s as PageHeader } from "./ui-BPP2eTpy.mjs";
import { t as OfficerAppTable } from "./OfficerAppTable-hrHqXeZN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/officer.applications.index-B2FNJTvW.js
var import_jsx_runtime = require_jsx_runtime();
var SplitComponent = () => {
	const { state } = useApp();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Applications",
		desc: "All submitted applications for your jurisdiction."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfficerAppTable, { apps: state.applications.filter((a) => a.status !== "Draft") })] });
};
//#endregion
export { SplitComponent as component };
