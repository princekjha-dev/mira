import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { F as useApp } from "./app-state-7jSiCijd.mjs";
import { k as ShieldCheck } from "../_libs/lucide-react.mjs";
import { o as PageHeader } from "./ui-lDSlMDlK.mjs";
import { n as CardContent, t as Card } from "./card-D_Z_TEMQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verifier.audit-ClUjG6t3.js
var import_jsx_runtime = require_jsx_runtime();
function VerifierAuditPage() {
	const { state } = useApp();
	const logs = state.audit || [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Verification Audit Ledger",
			desc: "Immutable event stream of determinations, status updates, evidence submissions, and overrides.",
			crumbs: [{
				label: "Verifier",
				to: "/verifier/dashboard"
			}, { label: "Audit" }]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "border-border/80 shadow-xs",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-border text-xs",
					children: logs.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 flex flex-col gap-1 hover:bg-muted/30 transition-colors",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-emerald-600 shrink-0" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: log.action
										}),
										log.application && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[11px] text-primary",
											children: log.application
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-[11px] text-muted-foreground",
									children: log.ts
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-muted-foreground",
								children: [
									"Actor: ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground",
										children: log.actor
									}),
									log.prev && log.next && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										" · State: ",
										log.prev,
										" → ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-foreground",
											children: log.next
										})
									] })
								]
							}),
							log.reason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-[11px] italic text-muted-foreground bg-muted/40 p-2 rounded",
								children: [
									"\"",
									log.reason,
									"\""
								]
							})
						]
					}, log.id))
				})
			})
		})]
	});
}
//#endregion
export { VerifierAuditPage as component };
