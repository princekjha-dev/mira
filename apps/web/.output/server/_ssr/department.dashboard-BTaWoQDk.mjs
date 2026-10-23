import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { k as useApp, u as SCHEMES } from "./button-B0ZnFkgi.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { T as Scale, i as Waves, lt as FlaskConical, xt as Clock3 } from "../_libs/lucide-react.mjs";
import { c as Panel, l as Pill, s as PageHeader } from "./ui-BPP2eTpy.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DU8wes5o.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/department.dashboard-BTaWoQDk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FUTURE = [
	{
		icon: Clock3,
		name: "Entitlement Time Machine",
		text: "Reconstruct what a household was entitled to on any past date, using the rule version in force at that time."
	},
	{
		icon: Scale,
		name: "Fair Decision Guardian",
		text: "Review officer decisions for consistency across similar cases and flag outliers for supervisory review."
	},
	{
		icon: Waves,
		name: "Decision Ripple Engine",
		text: "Show which other benefits are affected when a family record changes (e.g. a household split or death record)."
	},
	{
		icon: FlaskConical,
		name: "Policy Crash-Test Lab",
		text: "Simulate a proposed rule change against anonymised records before publishing a new rule version."
	}
];
function DD() {
	const { state } = useApp();
	const [f, setF] = (0, import_react.useState)(null);
	const cards = [
		{
			l: "Active schemes",
			n: SCHEMES.length,
			to: "/department/schemes"
		},
		{
			l: "Rule versions",
			n: state.ruleVersions.length,
			to: "/department/rules"
		},
		{
			l: "Open duplicate alerts",
			n: state.alerts.filter((a) => a.status === "Open").length,
			to: "/department/reports"
		},
		{
			l: "Audit events",
			n: state.audit.length,
			to: "/department/audit"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Department Portal",
				desc: state.session?.department
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
				children: cards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: c.to,
					className: "rounded-lg border bg-card p-4 hover:border-gov",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: c.l
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-2xl font-semibold text-navy",
						children: c.n
					})]
				}, c.l))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Latest rule changes",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y",
					children: [...state.ruleVersions].reverse().slice(0, 4).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap justify-between gap-2 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono",
								children: r.version
							}),
							" · ",
							SCHEMES.find((s) => s.id === r.schemeId)?.name
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground",
							children: [
								r.reason,
								" · effective ",
								r.effective
							]
						})]
					}, r.version + r.schemeId))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Planned analytics capabilities",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 md:grid-cols-2",
					children: FUTURE.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setF(x),
						className: "flex gap-3 rounded-md border border-dashed p-3 text-left hover:border-gov",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(x.icon, { className: "h-5 w-5 shrink-0 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2 text-sm font-medium",
							children: [x.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, { children: "Planned" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: x.text
						})] })]
					}, x.name))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!f,
				onOpenChange: (o) => !o && setF(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: f?.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Planned module — not active in this prototype." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: f?.text
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "The platform already records versioned rules, household lineage and an append-only audit trail, which this module will build on."
					})
				] })
			})
		]
	});
}
//#endregion
export { DD as component };
