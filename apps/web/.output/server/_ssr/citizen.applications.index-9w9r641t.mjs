import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { E as getScheme, I as useApp, T as fmtDate, d as STATUSES, v as downloadAcknowledgement } from "./app-state-C6MbzGTh.mjs";
import { t as Button } from "./button-BT328xhy.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Qt as Download } from "../_libs/lucide-react.mjs";
import { o as PageHeader, t as Empty, u as StatusBadge } from "./ui-Df8W68Fj.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Sj_zxMfs.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-D6hB8ul8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/citizen.applications.index-9w9r641t.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Apps() {
	const { state } = useApp();
	const [status, setStatus] = (0, import_react.useState)("all");
	const list = state.applications.filter((a) => status === "all" || a.status === status);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "My Applications",
			desc: "Applications made by you or for members of your household.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/schemes",
					children: "New application"
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm text-muted-foreground",
				children: "Status"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: status,
				onValueChange: setStatus,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
					className: "w-64",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: "all",
					children: "All statuses"
				}), STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: s,
					children: s
				}, s))] })]
			})]
		}),
		list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
			title: "No applications with this status",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => setStatus("all"),
				children: "Show all"
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-lg border bg-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Application ID" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Scheme" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Applicant" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Applied" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Current Stage" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Last Updated" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "text-right",
					children: "Action"
				})
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: list.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "font-mono text-xs",
					children: a.id
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "min-w-48",
					children: getScheme(a.schemeId)?.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: a.applicant }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: fmtDate(a.appliedOn) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { s: a.status }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: fmtDate(a.updatedOn) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
					className: "whitespace-nowrap text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/citizen/applications/$id",
							params: { id: a.id },
							children: a.status === "Draft" ? "Continue" : "View Details"
						})
					}), a.status !== "Draft" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						"aria-label": "Download acknowledgement",
						onClick: () => downloadAcknowledgement(a, getScheme(a.schemeId)?.name ?? ""),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" })
					})]
				})
			] }, a.id)) })] })
		})
	] });
}
//#endregion
export { Apps as component };
