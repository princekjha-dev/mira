import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { I as useApp } from "./app-state-C6MbzGTh.mjs";
import { t as Button } from "./button-BT328xhy.mjs";
import { Qt as Download, ct as Lock } from "../_libs/lucide-react.mjs";
import { t as Empty } from "./ui-Df8W68Fj.mjs";
import { t as Input } from "./input-Cl-rV5ml.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-D6hB8ul8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AuditTable-CQK4LarU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuditTable() {
	const { state } = useApp();
	const [q, setQ] = (0, import_react.useState)("");
	const list = state.audit.filter((a) => !q || Object.values(a).join(" ").toLowerCase().includes(q.toLowerCase()));
	const exportCsv = () => {
		const rows = [[
			"ID",
			"Timestamp",
			"User / Officer",
			"Action",
			"Application",
			"Previous state",
			"New state",
			"Reason"
		], ...list.map((a) => [
			a.id,
			a.ts,
			a.actor,
			a.action,
			a.application,
			a.prev,
			a.next,
			a.reason
		])];
		const blob = new Blob([rows.map((r) => r.map((c) => `"${c.replace(/"/g, "\"\"")}"`).join(",")).join("\n")], { type: "text/csv" });
		const l = document.createElement("a");
		l.href = URL.createObjectURL(blob);
		l.download = "audit-log.csv";
		l.click();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-3 flex flex-wrap items-center gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: q,
				onChange: (e) => setQ(e.target.value),
				placeholder: "Filter by user, action, application…",
				className: "max-w-sm",
				"aria-label": "Filter audit log"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: exportCsv,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1 h-4 w-4" }), "Export CSV"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "ml-auto flex items-center gap-1 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" }), "Append-only record · entries cannot be edited or deleted"]
			})
		]
	}), list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { title: "No audit entries match" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto rounded-lg border bg-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Timestamp" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "User / Officer" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Action" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Application / Record" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Previous state" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "New state" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Reason" })
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: list.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "whitespace-nowrap font-mono text-xs",
				children: a.ts
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "text-sm",
				children: a.actor
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "font-medium",
				children: a.action
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "font-mono text-xs",
				children: a.application
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "text-sm text-muted-foreground",
				children: a.prev
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "text-sm",
				children: a.next
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "min-w-48 text-sm text-muted-foreground",
				children: a.reason
			})
		] }, a.id)) })] })
	})] });
}
//#endregion
export { AuditTable as t };
