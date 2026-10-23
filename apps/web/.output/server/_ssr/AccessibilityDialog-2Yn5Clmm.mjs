import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { k as useApp, r as Button } from "./button-B0ZnFkgi.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DU8wes5o.mjs";
import { t as Label } from "./label-_Ez4PS27.mjs";
import { t as Switch } from "./switch-D-EfSjDz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AccessibilityDialog-2Yn5Clmm.js
var import_jsx_runtime = require_jsx_runtime();
function AccessibilityControls() {
	const { state, set } = useApp();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-2 text-sm font-medium",
			children: "Font size"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex gap-2",
			role: "group",
			"aria-label": "Font size",
			children: [
				{
					v: -1,
					l: "A-"
				},
				{
					v: 0,
					l: "A"
				},
				{
					v: 1,
					l: "A+"
				},
				{
					v: 2,
					l: "A++"
				}
			].map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: state.fontScale === o.v ? "default" : "outline",
				"aria-pressed": state.fontScale === o.v,
				onClick: () => set({ fontScale: o.v }),
				children: o.l
			}, o.v))
		})] }), [
			{
				k: "highContrast",
				label: "High contrast",
				hint: "Stronger text and border contrast"
			},
			{
				k: "reducedMotion",
				label: "Reduced motion",
				hint: "Turns off animations and transitions"
			},
			{
				k: "srMode",
				label: "Screen-reader-friendly mode",
				hint: "Stronger focus outlines and underlined links"
			}
		].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: r.k,
				children: r.label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: r.hint
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
				id: r.k,
				checked: state[r.k],
				onCheckedChange: (v) => set({ [r.k]: v })
			})]
		}, r.k))]
	});
}
function AccessibilityDialog({ open, onOpenChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Accessibility settings" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Changes apply instantly and are remembered on this device." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessibilityControls, {})] })
	});
}
//#endregion
export { AccessibilityDialog as n, AccessibilityControls as t };
