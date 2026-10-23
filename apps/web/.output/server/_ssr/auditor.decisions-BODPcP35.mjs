import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { F as useApp } from "./app-state-7jSiCijd.mjs";
import { t as Button } from "./button-BT328xhy.mjs";
import { I as Scale, k as ShieldCheck, nn as Copy, vn as Check } from "../_libs/lucide-react.mjs";
import { o as PageHeader } from "./ui-lDSlMDlK.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as CardHeader, n as CardContent, t as Card } from "./card-D_Z_TEMQ.mjs";
import { t as Badge } from "./badge-BwCkcYhX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auditor.decisions-BODPcP35.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuditorDecisionsPage() {
	const { state } = useApp();
	const [copiedId, setCopiedId] = (0, import_react.useState)(null);
	const decisions = state.decisions || [];
	const handleCopyHash = (hash, id) => {
		navigator.clipboard.writeText(hash);
		setCopiedId(id);
		toast.success("Cryptographic SHA-256 hash copied to clipboard.");
		setTimeout(() => setCopiedId(null), 2e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Cryptographic Decision Registry",
			desc: "Permanent audit ledger of approved and rejected public benefit determinations with immutable SHA-256 state hashes.",
			crumbs: [{
				label: "Auditor",
				to: "/auditor/dashboard"
			}, { label: "Decisions" }]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: decisions.map((dec) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border-border/80 shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "p-5 pb-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "h-4 w-4 text-primary" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs font-bold text-foreground",
									children: dec.id
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: `text-[10px] ${dec.decision === "APPROVED" ? "border-teal-400 bg-teal-500/10 text-teal-700 dark:text-teal-300" : "border-red-400 bg-red-500/10 text-red-700 dark:text-red-300"}`,
									children: dec.decision
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground font-mono",
							children: ["Date: ", dec.decidedAt]
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-5 pt-1 space-y-3 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 sm:grid-cols-2 rounded-lg bg-muted/30 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground text-[11px]",
								children: "Application:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-semibold text-foreground",
								children: [
									dec.applicationId,
									" · ",
									dec.schemeName
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground text-[11px]",
								children: "Beneficiary / Applicant:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold text-foreground",
								children: dec.applicantName
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-foreground",
							children: "Statutory Determination Rationale:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-muted-foreground leading-relaxed italic bg-background p-2.5 rounded border border-border/60",
							children: [
								"\"",
								dec.justification,
								"\""
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3 border-t pt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 font-mono text-[11px] text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-teal-600 shrink-0" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "truncate max-w-xs sm:max-w-md",
										children: ["SHA256: ", dec.auditHash]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										className: "h-6 w-6",
										onClick: () => handleCopyHash(dec.auditHash, dec.id),
										children: copiedId === dec.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3 text-teal-600" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" })
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right text-[11px] text-muted-foreground",
								children: [
									"Affixed by: ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground",
										children: dec.decidedBy
									}),
									" (",
									dec.statutoryRuleRef,
									")"
								]
							})]
						})
					]
				})]
			}, dec.id))
		})]
	});
}
//#endregion
export { AuditorDecisionsPage as component };
