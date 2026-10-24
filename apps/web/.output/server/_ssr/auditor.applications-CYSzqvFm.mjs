import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { E as getScheme, I as useApp } from "./app-state-C6MbzGTh.mjs";
import { t as Button } from "./button-BT328xhy.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Jt as Eye, k as ShieldCheck } from "../_libs/lucide-react.mjs";
import { o as PageHeader, u as StatusBadge } from "./ui-Df8W68Fj.mjs";
import { t as Input } from "./input-Cl-rV5ml.mjs";
import { n as CardContent, t as Card } from "./card-D_Z_TEMQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auditor.applications-CYSzqvFm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuditorApplicationsPage() {
	const { state } = useApp();
	const [q, setQ] = (0, import_react.useState)("");
	const apps = state.applications.filter((a) => {
		const s = q.trim().toLowerCase();
		const schemeName = getScheme(a.schemeId)?.name || "";
		return !s || a.id.toLowerCase().includes(s) || a.applicant.toLowerCase().includes(s) || a.householdId.toLowerCase().includes(s) || schemeName.toLowerCase().includes(s);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Application Records Audit Inspection",
				desc: "Examine complete application data trails, stage transitions, and verification evidence without write locks.",
				crumbs: [{
					label: "Auditor",
					to: "/auditor/dashboard"
				}, { label: "Applications" }]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center max-w-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Filter by application, citizen, or household ID…",
					className: "text-xs"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-border/80 shadow-xs overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "border-b bg-muted/40 font-medium text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3.5 pl-4",
									children: "Application ID"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3.5",
									children: "Applicant & Household"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3.5",
									children: "Scheme"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3.5",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3.5",
									children: "Audit Integrity"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3.5 pr-4 text-right",
									children: "Inspection"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border",
							children: apps.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-muted/30 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3.5 pl-4 font-mono font-semibold text-primary",
										children: a.id
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "p-3.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium",
											children: a.applicant
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-muted-foreground",
											children: a.householdId
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3.5 text-muted-foreground",
										children: getScheme(a.schemeId)?.name || "Welfare Assistance"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { s: a.status })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1 text-teal-600 font-medium text-[11px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3 w-3" }), " Sealed SHA-256"]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3.5 pr-4 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "outline",
											asChild: true,
											className: "h-7 text-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: "/officer/applications/$id",
												params: { id: a.id },
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "mr-1 h-3 w-3" }), " View Provenance"]
											})
										})
									})
								]
							}, a.id))
						})]
					})
				})
			})
		]
	});
}
//#endregion
export { AuditorApplicationsPage as component };
