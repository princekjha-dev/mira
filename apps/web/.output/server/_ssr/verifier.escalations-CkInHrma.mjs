import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { M as useApp, S as getScheme } from "./app-state-DFvYNEHf.mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { At as Flag, On as ArrowRight, cn as CircleCheck } from "../_libs/lucide-react.mjs";
import { o as PageHeader, u as StatusBadge } from "./ui-C30c-cKm.mjs";
import { i as CardHeader, n as CardContent, t as Card } from "./card-C5Nmk_bj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verifier.escalations-CkInHrma.js
var import_jsx_runtime = require_jsx_runtime();
function VerifierEscalationsPage() {
	const { state } = useApp();
	const escalated = state.applications.filter((a) => a.duplicate || a.events && a.events.some((e) => e.text.toLowerCase().includes("escalat")));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Supervisor Escalations & Complex Cases",
			desc: "Applications involving household split legal disputes, historical duplicate overlap, or policy exceptions.",
			crumbs: [{
				label: "Verifier",
				to: "/verifier/dashboard"
			}, { label: "Escalations" }]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [escalated.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border/80 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "p-4 pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "h-4 w-4 text-blue-600" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs font-semibold text-primary",
									children: a.id
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { s: a.status })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: a.householdId
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-4 pt-1 text-xs space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-medium text-foreground",
							children: [
								a.applicant,
								" — ",
								getScheme(a.schemeId)?.name || "Welfare Assistance"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-md border bg-muted/30 p-2.5 text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: "Escalation Trigger: "
							}), a.duplicate ? "Historical benefit duplication detected across 2021 household bifurcation boundary. Requires Joint Secretary / Supervisor concurrence." : "Supervisory review requested for policy interpretation."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-end pt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								asChild: true,
								className: "h-8 text-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/verifier/applications/$id",
									params: { id: a.id },
									children: ["Review Escalation ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1.5 h-3.5 w-3.5" })]
								})
							})
						})
					]
				})]
			}, a.id)), escalated.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-8 text-center text-muted-foreground border-dashed",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mx-auto h-8 w-8 text-teal-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm font-medium",
					children: "No active escalations"
				})]
			})]
		})]
	});
}
//#endregion
export { VerifierEscalationsPage as component };
