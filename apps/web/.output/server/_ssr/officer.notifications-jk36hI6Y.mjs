import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { F as useApp } from "./app-state-7jSiCijd.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as PageHeader } from "./ui-lDSlMDlK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/officer.notifications-jk36hI6Y.js
var import_jsx_runtime = require_jsx_runtime();
function N() {
	const { state } = useApp();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Notifications",
		desc: "Recent activity on applications in your jurisdiction."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "divide-y rounded-lg border bg-card",
		children: state.audit.slice(0, 12).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "p-4 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: a.action
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-muted-foreground",
					children: [
						a.application,
						" · ",
						a.reason
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						a.ts,
						" · ",
						a.actor
					]
				}),
				a.application.startsWith("APP-") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/officer/applications/$id",
					params: { id: a.application },
					className: "text-xs text-gov hover:underline",
					children: "Open application"
				})
			]
		}, a.id))
	})] });
}
//#endregion
export { N as component };
