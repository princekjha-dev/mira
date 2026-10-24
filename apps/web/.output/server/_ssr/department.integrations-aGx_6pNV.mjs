import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-BT328xhy.mjs";
import { ut as LoaderCircle } from "../_libs/lucide-react.mjs";
import { c as Pill, o as PageHeader } from "./ui-Df8W68Fj.mjs";
import { t as Switch } from "./switch-CsJp6lIU.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/department.integrations-aGx_6pNV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var INIT = [
	{
		name: "Civil Registration System (birth, death)",
		owner: "Registrar General",
		on: true,
		sync: "2026-10-22 06:00"
	},
	{
		name: "Household / Family Register",
		owner: "State Planning Dept.",
		on: true,
		sync: "2026-10-22 06:00"
	},
	{
		name: "Income certificates",
		owner: "Revenue Dept. (Tehsil)",
		on: true,
		sync: "2026-10-21 22:00"
	},
	{
		name: "BPL list",
		owner: "Rural Development Dept.",
		on: true,
		sync: "2026-10-20 22:00"
	},
	{
		name: "Land records",
		owner: "Revenue Dept. (Bhulekh)",
		on: true,
		sync: "2026-10-21 22:00"
	},
	{
		name: "Benefit registries",
		owner: "Line departments",
		on: true,
		sync: "2026-10-22 02:00"
	},
	{
		name: "Identity verification (OTP)",
		owner: "Identity authority",
		on: false,
		sync: "Not connected — prototype uses demo OTP"
	}
];
function Int() {
	const [list, setList] = (0, import_react.useState)(INIT);
	const [testing, setTesting] = (0, import_react.useState)(null);
	const test = (n) => {
		setTesting(n);
		setTimeout(() => {
			setTesting(null);
			list.find((x) => x.name === n)?.on ? toast.success(`${n}: connection healthy (demo)`) : toast.error(`${n}: not connected`);
		}, 900);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Department Integrations",
		desc: "Each source remains owned by its department. The platform reads references with consent; it does not copy whole databases."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "divide-y rounded-lg border bg-card",
		children: list.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex flex-wrap items-center justify-between gap-3 p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium",
				children: x.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground",
				children: [
					"Owner: ",
					x.owner,
					" · Last sync: ",
					x.sync
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
						t: x.on ? "ok" : "neutral",
						children: x.on ? "Connected" : "Disabled"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => test(x.name),
						disabled: testing === x.name,
						children: testing === x.name ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : "Test connection"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: x.on,
						"aria-label": `Toggle ${x.name}`,
						onCheckedChange: (v) => {
							setList(list.map((y) => y.name === x.name ? {
								...y,
								on: v
							} : y));
							toast.success(`${x.name} ${v ? "enabled" : "disabled"}`);
						}
					})
				]
			})]
		}, x.name))
	})] });
}
//#endregion
export { Int as component };
