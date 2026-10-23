import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { k as useApp, r as Button } from "./button-B0ZnFkgi.mjs";
import { c as Panel, s as PageHeader } from "./ui-BPP2eTpy.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as AccessibilityControls } from "./AccessibilityDialog-2Yn5Clmm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/officer.settings-C4ubeAGL.js
var import_jsx_runtime = require_jsx_runtime();
function S() {
	const { state } = useApp();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, { title: "Settings" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Officer profile",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "grid gap-3 text-sm sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-muted-foreground",
							children: "Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: state.session?.name })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-muted-foreground",
							children: "Officer ID"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-mono",
							children: state.session?.id
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-muted-foreground",
							children: "Department"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: state.session?.department })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-muted-foreground",
							children: "Role"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: "Block Development Officer (Reviewer)" })] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Security",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => toast.success("Password change link sent to your official email (demo)"),
						children: "Change password"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => toast.success("All other sessions signed out"),
						children: "Sign out other sessions"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Accessibility",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessibilityControls, {})
			})
		]
	});
}
//#endregion
export { S as component };
