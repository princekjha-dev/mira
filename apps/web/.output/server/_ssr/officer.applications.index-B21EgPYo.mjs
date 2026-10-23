import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { F as useApp } from "./app-state-7jSiCijd.mjs";
import { o as PageHeader } from "./ui-lDSlMDlK.mjs";
import { t as OfficerAppTable } from "./OfficerAppTable-BJLTn5aZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/officer.applications.index-B21EgPYo.js
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
