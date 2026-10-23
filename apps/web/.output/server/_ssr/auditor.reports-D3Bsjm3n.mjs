import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { _n as Calendar, zt as FileDown } from "../_libs/lucide-react.mjs";
import { o as PageHeader } from "./ui-C30c-cKm.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-C5Nmk_bj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auditor.reports-D3Bsjm3n.js
var import_jsx_runtime = require_jsx_runtime();
function AuditorReportsPage() {
	const reports = [
		{
			title: "Quarterly Public Welfare Leak Prevention Audit (Q3 FY26)",
			period: "July 2026 – September 2026",
			summary: "Evaluated 12,410 applications. Duplicate detection across household splits prevented estimated ₹ 4.2 Cr in erroneous duplicate disbursements.",
			code: "CAG-REP-2026-Q3"
		},
		{
			title: "Cross-Registry Data Discrepancy & Override Analysis",
			period: "Fiscal Year 2025-26",
			summary: "Review of human verifier overrides on Tehsildar income certificates. Found 98.4% of overrides accompanied by valid secondary documentation.",
			code: "AUD-OVR-2026-01"
		},
		{
			title: "Field Geotag Accuracy & NavIC Satellite Lock Audit",
			period: "August 2026 – October 2026",
			summary: "99.1% of field inspection photographs possessed cryptographic GPS stamps within 3 meters of registered land revenue coordinates.",
			code: "TEC-GEO-2026-08"
		}
	];
	const handleDownload = (code) => {
		toast.success(`Statutory Audit Report ${code} exported as cryptographically signed PDF.`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Statutory Forensic Audit Reports",
			desc: "Formal audit reports submitted to the Comptroller and Auditor General (CAG) and Ministry of Social Justice.",
			crumbs: [{
				label: "Auditor",
				to: "/auditor/dashboard"
			}, { label: "Reports" }]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: reports.map((rep) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border/80 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "p-5 pb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-base font-semibold",
							children: rep.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-xs text-muted-foreground",
							children: rep.code
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, {
						className: "flex items-center gap-1.5 pt-1 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: rep.period })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-5 pt-1 space-y-3 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground leading-relaxed",
						children: rep.summary
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-end pt-2 border-t",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => handleDownload(rep.code),
							className: "h-8 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "mr-1.5 h-3.5 w-3.5 text-primary" }), "Download Signed Report"]
						})
					})]
				})]
			}, rep.code))
		})]
	});
}
//#endregion
export { AuditorReportsPage as component };
