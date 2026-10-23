import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { I as Scale, pn as CircleCheck } from "../_libs/lucide-react.mjs";
import { o as PageHeader } from "./ui-lDSlMDlK.mjs";
import { i as CardHeader, n as CardContent, t as Card } from "./card-D_Z_TEMQ.mjs";
import { t as Badge } from "./badge-BwCkcYhX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auditor.rules-Cvq2EDGG.js
var import_jsx_runtime = require_jsx_runtime();
function AuditorRulesPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Eligibility Rules & Policy Logic Audit",
			desc: "Audit trail of statutory rules, legislative gazette references, and version change-logs.",
			crumbs: [{
				label: "Auditor",
				to: "/auditor/dashboard"
			}, { label: "Rules Audit" }]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: [
				{
					scheme: "Rural Housing Assistance Scheme",
					ruleId: "RUL-RHA-01",
					name: "Income Threshold Ceiling",
					criteria: "Annual Household Income <= ₹ 1,80,000",
					version: "v3.2.0 (Active since 2025-04-01)",
					auditStatus: "Statutory Gazetted"
				},
				{
					scheme: "Rural Housing Assistance Scheme",
					ruleId: "RUL-RHA-02",
					name: "Dwelling Condition Qualification",
					criteria: "Dwelling type must be Kutcha or Semi-Kutcha with no prior sanction in 5 fiscal years",
					version: "v2.1.0 (Active since 2024-01-15)",
					auditStatus: "Statutory Gazetted"
				},
				{
					scheme: "Old Age Pension Scheme",
					ruleId: "RUL-OAP-01",
					name: "Senior Citizen Age Gate",
					criteria: "Age >= 60 years authenticated via UIDAI Aadhaar Vault",
					version: "v1.0.0",
					auditStatus: "Statutory Gazetted"
				}
			].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border/80 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "p-4 pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "h-4 w-4 text-primary" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground text-sm",
									children: r.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-[10px] border-teal-500/30 text-teal-700 bg-teal-500/10",
									children: r.auditStatus
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs text-muted-foreground",
							children: r.ruleId
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-4 pt-1 text-xs space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted-foreground",
							children: ["Scheme: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-foreground",
								children: r.scheme
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded border bg-muted/30 p-2.5 font-mono text-[11px] text-foreground",
							children: r.criteria
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-[11px] text-muted-foreground pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Version: ", r.version] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center text-teal-600 font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-1 h-3 w-3" }), " No Rule Tampering Detected"]
							})]
						})
					]
				})]
			}, r.ruleId))
		})]
	});
}
//#endregion
export { AuditorRulesPage as component };
