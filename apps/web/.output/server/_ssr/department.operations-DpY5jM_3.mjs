import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { cn as CircleCheck } from "../_libs/lucide-react.mjs";
import { o as PageHeader } from "./ui-C30c-cKm.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-C5Nmk_bj.mjs";
import { t as Badge } from "./badge-B3f60TId.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/department.operations-DpY5jM_3.js
var import_jsx_runtime = require_jsx_runtime();
function DeptOperationsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Operations & Queue Health Monitoring",
				desc: "Systemic SLA tracking, verification bottleneck detection, and processing load indicators across administrative blocks.",
				crumbs: [{
					label: "Department",
					to: "/department/dashboard"
				}, { label: "Operations" }]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "border-border/80 shadow-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Overall System Health"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 text-2xl font-bold text-teal-600 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-6 w-6" }), " 99.4%"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "All verification services active"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "border-border/80 shadow-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "SLA Breaches (24h)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 text-2xl font-bold text-amber-600",
									children: "4 cases"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-amber-600",
									children: "Dispatched to regional supervisor"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "border-border/80 shadow-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Active Triage Load"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 text-2xl font-bold",
									children: "223 items"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "Across 14 officer queues"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "border-border/80 shadow-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Average Resolution Speed"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 text-2xl font-bold text-primary",
									children: "16.8 hrs"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-teal-600",
									children: "Statutory limit: 48.0 hrs"
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-semibold text-foreground",
					children: "Jurisdictional Queue Health Status"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 md:grid-cols-2",
					children: [
						{
							name: "Rural Housing Assistance (Tier 1 Triage)",
							count: 28,
							slaBreaches: 0,
							medianTime: "11.4h",
							health: "Optimal"
						},
						{
							name: "Old Age Pension Cross-Verification",
							count: 64,
							slaBreaches: 1,
							medianTime: "18.2h",
							health: "Normal"
						},
						{
							name: "Farmer Fertilizer Subsidy Aadhaar Linkage",
							count: 112,
							slaBreaches: 3,
							medianTime: "26.8h",
							health: "Elevated"
						},
						{
							name: "State Girl Child Education Grant",
							count: 19,
							slaBreaches: 0,
							medianTime: "8.5h",
							health: "Optimal"
						}
					].map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border/80 shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
							className: "p-4 pb-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
									className: "text-sm font-semibold",
									children: q.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: `text-[10px] ${q.health === "Optimal" ? "border-teal-400 bg-teal-500/10 text-teal-700 dark:text-teal-300" : q.health === "Normal" ? "border-blue-400 bg-blue-500/10 text-blue-700 dark:text-blue-300" : "border-amber-400 bg-amber-500/10 text-amber-700 dark:text-amber-300"}`,
									children: q.health
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-4 pt-1 space-y-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between border-b pb-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Pending in Queue:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold text-foreground",
										children: [q.count, " cases"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between border-b pb-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Median Resolution Time:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: q.medianTime
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between pb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "SLA Breach Count:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `font-semibold ${q.slaBreaches > 0 ? "text-amber-600" : "text-teal-600"}`,
										children: [q.slaBreaches, " breaches"]
									})]
								})
							]
						})]
					}, q.name))
				})]
			})
		]
	});
}
//#endregion
export { DeptOperationsPage as component };
