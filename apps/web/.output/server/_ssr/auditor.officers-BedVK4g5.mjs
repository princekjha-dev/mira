import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { D as ShieldCheck } from "../_libs/lucide-react.mjs";
import { o as PageHeader } from "./ui-C30c-cKm.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-C5Nmk_bj.mjs";
import { t as Badge } from "./badge-B3f60TId.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auditor.officers-BedVK4g5.js
var import_jsx_runtime = require_jsx_runtime();
function AuditorOfficersPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Officer Integrity & Determination Oversight",
			desc: "Objective forensic evaluation of officer determination patterns, data override frequencies, and adherence to public service canons.",
			crumbs: [{
				label: "Auditor",
				to: "/auditor/dashboard"
			}, { label: "Officer Oversight" }]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-3",
			children: [
				{
					name: "Neha Verma",
					role: "Verification Officer (Tier 2)",
					district: "Lucknow & Chandauli Jurisdiction",
					totalVerified: 184,
					overrideRate: "1.6%",
					avgSlaHours: "14.2h",
					anomalies: 0,
					status: "Exemplary Compliance"
				},
				{
					name: "Ravi Kumar",
					role: "Field Operational Officer",
					district: "Chandauli Rural Cluster",
					totalVerified: 216,
					overrideRate: "0.9%",
					avgSlaHours: "18.5h",
					anomalies: 0,
					status: "Exemplary Compliance"
				},
				{
					name: "Arjun Mehta",
					role: "Department Administrator / Director",
					district: "State Headquarters",
					totalVerified: 48,
					overrideRate: "2.1%",
					avgSlaHours: "6.0h",
					anomalies: 0,
					status: "Exemplary Compliance"
				}
			].map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border/80 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "p-4 pb-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							className: "mb-1 text-[10px] border-teal-500/30 text-teal-700 bg-teal-500/10 w-fit",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mr-1 h-3 w-3" }),
								" ",
								o.status
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base font-semibold",
							children: o.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, {
							className: "text-xs",
							children: [
								o.role,
								" · ",
								o.district
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-4 pt-2 text-xs space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between border-b pb-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Cases Resolved:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: o.totalVerified
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between border-b pb-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Registry Override Rate:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-foreground",
								children: o.overrideRate
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between border-b pb-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Mean Turnaround:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-foreground",
								children: o.avgSlaHours
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between pb-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Integrity Flags:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-teal-600 font-semibold",
								children: [o.anomalies, " flags"]
							})]
						})
					]
				})]
			}, o.name))
		})]
	});
}
//#endregion
export { AuditorOfficersPage as component };
