import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { E as getScheme, I as useApp } from "./app-state-C6MbzGTh.mjs";
import { t as Button } from "./button-BT328xhy.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { N as Search, Pn as ArrowRight, _ as TriangleAlert, pn as CircleCheck } from "../_libs/lucide-react.mjs";
import { o as PageHeader, u as StatusBadge } from "./ui-Df8W68Fj.mjs";
import { t as Input } from "./input-Cl-rV5ml.mjs";
import { n as CardContent, t as Card } from "./card-D_Z_TEMQ.mjs";
import { t as Badge } from "./badge-BwCkcYhX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verifier.queue-CAR9u7uR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VerifierQueuePage() {
	const { state } = useApp();
	const [search, setSearch] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [mismatchOnly, setMismatchOnly] = (0, import_react.useState)(false);
	const filtered = (0, import_react.useMemo)(() => {
		return state.applications.filter((a) => {
			const q = search.trim().toLowerCase();
			const matchesSearch = !q || a.id.toLowerCase().includes(q) || a.applicant.toLowerCase().includes(q) || a.householdId.toLowerCase().includes(q) || (getScheme(a.schemeId)?.name || "").toLowerCase().includes(q);
			const matchesStatus = statusFilter === "all" || statusFilter === "pending" && (a.status === "Documents Under Review" || a.status === "Verification Required" || a.status === "Officer Review") || a.status === statusFilter;
			const matchesMismatch = !mismatchOnly || !!a.mismatch;
			return matchesSearch && matchesStatus && matchesMismatch;
		});
	}, [
		state.applications,
		search,
		statusFilter,
		mismatchOnly
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Verification Determination Queue",
				desc: "Interactive triage table. Review applicant records, registry mismatches, and submit statutory findings.",
				crumbs: [{
					label: "Verifier",
					to: "/verifier/dashboard"
				}, { label: "Queue" }]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: search,
						onChange: (e) => setSearch(e.target.value),
						placeholder: "Search by Application ID, Citizen, or Household…",
						className: "pl-9 text-xs"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 rounded-lg border bg-card p-1 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: statusFilter === "all" ? "secondary" : "ghost",
								className: "h-7 text-xs",
								onClick: () => setStatusFilter("all"),
								children: [
									"All (",
									state.applications.length,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: statusFilter === "pending" ? "secondary" : "ghost",
								className: "h-7 text-xs",
								onClick: () => setStatusFilter("pending"),
								children: "Pending Verification"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: statusFilter === "Approved" ? "secondary" : "ghost",
								className: "h-7 text-xs",
								onClick: () => setStatusFilter("Approved"),
								children: "Approved"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: mismatchOnly ? "default" : "outline",
						className: "h-8 text-xs",
						onClick: () => setMismatchOnly(!mismatchOnly),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mr-1.5 h-3.5 w-3.5 text-amber-500" }), "Mismatches Only"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-border/80 shadow-xs overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-left text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "border-b bg-muted/50 text-muted-foreground font-medium",
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
										children: "Stage & Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-3.5",
										children: "Discrepancy / Signal"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-3.5 pr-4 text-right",
										children: "Action"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-border",
								children: filtered.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-muted/30 transition-colors",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3.5 pl-4 font-mono font-semibold text-primary",
											children: a.id
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "p-3.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium text-foreground",
												children: a.applicant
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-[11px] text-muted-foreground",
												children: a.householdId
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3.5 max-w-[200px] truncate text-foreground",
											children: getScheme(a.schemeId)?.name || "Welfare Assistance"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { s: a.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-[10px] text-muted-foreground",
													children: [
														"Stage ",
														a.stage,
														"/6"
													]
												})]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3.5",
											children: a.mismatch ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
												variant: "outline",
												className: "border-amber-400 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px]",
												children: ["Mismatch: ", a.mismatch.field]
											}) : a.duplicate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "border-blue-400 bg-blue-500/10 text-blue-700 dark:text-blue-300 text-[10px]",
												children: "Overlap Signal"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[11px] text-muted-foreground flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3 text-teal-600" }), " Consistent"]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3.5 pr-4 text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												asChild: true,
												className: "h-7 text-xs",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
													to: "/verifier/applications/$id",
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
			})
		]
	});
}
//#endregion
export { VerifierQueuePage as component };
