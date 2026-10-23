import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { k as ShieldCheck, rt as MapPin } from "../_libs/lucide-react.mjs";
import { o as PageHeader } from "./ui-lDSlMDlK.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-D_Z_TEMQ.mjs";
import { t as Badge } from "./badge-BwCkcYhX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/department.departments-BB-nbksQ.js
var import_jsx_runtime = require_jsx_runtime();
function DeptDirectoriesPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Directorate & Jurisdictional Directory",
			desc: "State public service infrastructure nodes, jurisdictional administrative hierarchies, and officer allocations.",
			crumbs: [{
				label: "Department",
				to: "/department/dashboard"
			}, { label: "Directorates" }]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2",
			children: [
				{
					name: "Directorate of Rural Development",
					district: "Lucknow HQ",
					head: "Arjun Mehta (Director General)",
					schemes: 12,
					officers: 340,
					slaRate: "97.4%",
					status: "Operational"
				},
				{
					name: "District Welfare Office — Chandauli",
					district: "Chandauli Rural & Urban",
					head: "Vikramaditya Rao (District Magistrate / CWO)",
					schemes: 8,
					officers: 42,
					slaRate: "94.8%",
					status: "Operational"
				},
				{
					name: "Department of Revenue & Land Records",
					district: "UP State Center",
					head: "Suresh P. Tiwari (Principal Secretary)",
					schemes: 4,
					officers: 680,
					slaRate: "99.1%",
					status: "Operational"
				},
				{
					name: "Food & Civil Supplies Department (NFSA)",
					district: "State Distribution Node",
					head: "Meenakshi Sundaram (Commissioner)",
					schemes: 3,
					officers: 512,
					slaRate: "98.2%",
					status: "Operational"
				}
			].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border/80 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "p-5 pb-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-start justify-between gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: "mb-2 text-[10px] text-teal-700 dark:text-teal-300 border-teal-500/30 bg-teal-500/10",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mr-1 h-3 w-3" }),
									" ",
									d.status
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base font-semibold",
								children: d.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, {
								className: "flex items-center gap-1.5 pt-1 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: d.district })]
							})
						] })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-5 pt-1 space-y-3 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between border-b pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Officer-in-Charge:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-foreground",
							children: d.head
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-2 rounded-lg bg-muted/30 p-2.5 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-muted-foreground",
								children: "Active Schemes"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-bold text-foreground text-sm",
								children: d.schemes
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-muted-foreground",
								children: "Field Officers"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-bold text-foreground text-sm",
								children: d.officers
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-muted-foreground",
								children: "SLA Compliance"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-bold text-teal-600 text-sm",
								children: d.slaRate
							})] })
						]
					})]
				})]
			}, d.name))
		})]
	});
}
//#endregion
export { DeptDirectoriesPage as component };
