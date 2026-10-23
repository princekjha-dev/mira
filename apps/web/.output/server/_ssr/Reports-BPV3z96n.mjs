import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { f as STATUSES, k as useApp, r as Button, u as SCHEMES } from "./button-B0ZnFkgi.mjs";
import { yt as Download } from "../_libs/lucide-react.mjs";
import { c as Panel } from "./ui-BPP2eTpy.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CeCLWmiI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Reports-BPV3z96n.js
var import_jsx_runtime = require_jsx_runtime();
function Reports() {
	const { state } = useApp();
	const apps = state.applications.filter((a) => a.status !== "Draft");
	const shown = STATUSES.filter((s) => s !== "Draft");
	const rows = SCHEMES.map((s) => ({
		s,
		counts: shown.map((st) => apps.filter((a) => a.schemeId === s.id && a.status === st).length)
	})).filter((r) => r.counts.some(Boolean));
	const exportCsv = () => {
		const csv = [["Scheme", ...shown].join(","), ...rows.map((r) => [`"${r.s.name}"`, ...r.counts].join(","))].join("\n");
		const l = document.createElement("a");
		l.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
		l.download = "applications-by-status.csv";
		l.click();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		title: "Applications by scheme and status",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			size: "sm",
			variant: "outline",
			onClick: exportCsv,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1 h-4 w-4" }), "Export CSV"]
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Scheme" }), shown.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-center text-xs",
				children: s
			}, s))] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "font-medium",
				children: r.s.name
			}), r.counts.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "text-center",
				children: c || "—"
			}, i))] }, r.s.id)) })] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-xs text-muted-foreground",
			children: "Counts are computed live from current demo records."
		})]
	});
}
//#endregion
export { Reports as t };
