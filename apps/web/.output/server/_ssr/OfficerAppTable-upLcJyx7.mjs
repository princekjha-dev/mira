import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { S as getScheme, d as STATUSES, x as fmtDate } from "./app-state-DFvYNEHf.mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { G as OctagonAlert, h as TriangleAlert } from "../_libs/lucide-react.mjs";
import { t as Empty, u as StatusBadge } from "./ui-C30c-cKm.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DamjaduW.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-BcaWptOW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/OfficerAppTable-upLcJyx7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OfficerAppTable({ apps, statusFilter = true }) {
	const [q, setQ] = (0, import_react.useState)("");
	const [st, setSt] = (0, import_react.useState)("all");
	const list = apps.filter((a) => (st === "all" || a.status === st) && (!q || (a.id + a.applicant + (getScheme(a.schemeId)?.name ?? "")).toLowerCase().includes(q.toLowerCase())));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-3 flex flex-wrap gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			value: q,
			onChange: (e) => setQ(e.target.value),
			placeholder: "Filter by ID, applicant or scheme",
			className: "max-w-xs",
			"aria-label": "Filter"
		}), statusFilter && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
			value: st,
			onValueChange: setSt,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
				className: "w-60",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
				value: "all",
				children: "All statuses"
			}), STATUSES.filter((s) => s !== "Draft").map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
				value: s,
				children: s
			}, s))] })]
		})]
	}), list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, { title: "No applications in this view" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto rounded-lg border bg-card",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Application ID" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Applicant" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Scheme" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Received" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Flags" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {})
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: list.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "font-mono text-xs",
				children: a.id
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: a.applicant }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "min-w-48",
				children: getScheme(a.schemeId)?.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: fmtDate(a.appliedOn) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-1",
				children: [a.duplicate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					title: "Duplicate alert",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctagonAlert, { className: "h-4 w-4 text-destructive" })
				}), a.mismatch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					title: "Data mismatch",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-warning" })
				})]
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { s: a.status }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/officer/applications/$id",
					params: { id: a.id },
					children: "Review"
				})
			}) })
		] }, a.id)) })] })
	})] });
}
//#endregion
export { OfficerAppTable as t };
