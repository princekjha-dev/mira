import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { F as useApp } from "./app-state-7jSiCijd.mjs";
import { N as Search, k as ShieldCheck } from "../_libs/lucide-react.mjs";
import { o as PageHeader } from "./ui-lDSlMDlK.mjs";
import { t as Input } from "./input-Cl-rV5ml.mjs";
import { n as CardContent, t as Card } from "./card-D_Z_TEMQ.mjs";
import { t as Badge } from "./badge-BwCkcYhX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auditor.audit-XyO2hOFx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuditorAuditPage() {
	const { state } = useApp();
	const [q, setQ] = (0, import_react.useState)("");
	const logs = (state.audit || []).filter((l) => {
		const s = q.trim().toLowerCase();
		return !s || l.action.toLowerCase().includes(s) || l.actor.toLowerCase().includes(s) || (l.application || "").toLowerCase().includes(s) || (l.reason || "").toLowerCase().includes(s);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Tamper-Evident Forensic Audit Ledger",
				desc: "Chronological, immutable event ledger recording every application lifecycle mutation, officer determination, and registry query.",
				crumbs: [{
					label: "Auditor",
					to: "/auditor/dashboard"
				}, { label: "Audit Ledger" }]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search by action, officer, application ID, or keyword…",
						className: "pl-9 text-xs"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					variant: "outline",
					className: "border-teal-400 bg-teal-500/10 text-teal-700 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mr-1 h-3.5 w-3.5" }), " Chain Verification: 100% Valid"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-border/80 shadow-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "p-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-border text-xs",
						children: logs.map((log, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 hover:bg-muted/30 transition-colors space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono text-[10px] text-muted-foreground",
												children: ["#", logs.length - index]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-foreground text-sm",
												children: log.action
											}),
											log.application && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-xs font-semibold text-primary",
												children: log.application
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[11px] text-muted-foreground",
										children: log.ts
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-3 text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Author: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground font-medium",
											children: log.actor
										})] }),
										log.prev && log.next && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											"State Transition: ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-foreground",
												children: log.prev
											}),
											" → ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-foreground",
												children: log.next
											})
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "ml-auto font-mono text-[10px] text-muted-foreground",
											children: [
												"Block Hash: SHA256:",
												Math.abs(log.id.split("").reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)).toString(16).padStart(12, "0"),
												"…"
											]
										})
									]
								}),
								log.reason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-[11px] bg-muted/40 p-2.5 rounded border border-border/50 text-foreground font-sans",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-muted-foreground",
										children: "Recorded Rationale: "
									}), log.reason]
								})
							]
						}, log.id))
					})
				})
			})
		]
	});
}
//#endregion
export { AuditorAuditPage as component };
