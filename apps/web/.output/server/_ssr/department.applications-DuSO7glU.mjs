import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { M as useApp, S as getScheme } from "./app-state-DFvYNEHf.mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { On as ArrowRight } from "../_libs/lucide-react.mjs";
import { o as PageHeader, u as StatusBadge } from "./ui-C30c-cKm.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { n as CardContent, t as Card } from "./card-C5Nmk_bj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/department.applications-DuSO7glU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DeptApplicationsPage() {
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
				title: "Department-Wide Applications Console",
				desc: "Global lifecycle visibility across all schemes, districts, and officer queues.",
				crumbs: [{
					label: "Department",
					to: "/department/dashboard"
				}, { label: "Applications" }]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center max-w-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Filter by application, applicant, or household…",
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
									children: "Stage"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3.5",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3.5 pr-4 text-right",
									children: "Details"
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
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "p-3.5",
										children: [
											"Stage ",
											a.stage,
											"/6"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { s: a.status })
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
												children: ["Inspect ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 h-3 w-3" })]
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
export { DeptApplicationsPage as component };
