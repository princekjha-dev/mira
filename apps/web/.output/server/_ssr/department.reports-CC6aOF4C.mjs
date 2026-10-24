import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { I as useApp } from "./app-state-C6MbzGTh.mjs";
import { c as Pill, o as PageHeader, s as Panel } from "./ui-Df8W68Fj.mjs";
import { t as Reports } from "./Reports-2tiYsUES.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/department.reports-CC6aOF4C.js
var import_jsx_runtime = require_jsx_runtime();
function R() {
	const { state } = useApp();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, { title: "Reports" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reports, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Duplicate alerts by outcome",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2 text-sm",
					children: state.alerts.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							a.id,
							" · ",
							a.applicant,
							" · ",
							a.scheme
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, { children: a.status })]
					}, a.id))
				})
			})
		]
	});
}
//#endregion
export { R as component };
