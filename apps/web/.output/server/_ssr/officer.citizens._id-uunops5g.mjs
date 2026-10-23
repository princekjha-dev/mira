import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { F as useApp, T as getScheme, a as CITIZEN, c as MEMBERS, w as fmtDate } from "./app-state-7jSiCijd.mjs";
import { t as Button } from "./button-BT328xhy.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Pill, o as PageHeader, s as Panel, t as Empty, u as StatusBadge } from "./ui-lDSlMDlK.mjs";
import { t as Route } from "./officer.citizens._id-4k2l8ojA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/officer.citizens._id-uunops5g.js
var import_jsx_runtime = require_jsx_runtime();
function Citizen() {
	const { id } = Route.useParams();
	const { state } = useApp();
	const m = MEMBERS.find((x) => x.id === id);
	if (!m) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
		title: `No citizen record for ${id}`,
		body: "Demo records: C-1001 to C-1005.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/officer/citizens/$id",
				params: { id: "C-1001" },
				children: "Open C-1001"
			})
		})
	});
	const apps = state.applications.filter((a) => a.citizenId === id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: m.name,
				desc: `Citizen ID ${m.id} · Access logged for audit`,
				crumbs: [{ label: "Citizen Records" }, { label: m.id }]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Identity and registration",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "grid gap-3 text-sm sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-muted-foreground",
							children: "Date of birth"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: fmtDate(m.dob) })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-muted-foreground",
							children: "Gender"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: m.gender })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-muted-foreground",
							children: "Identity"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
							t: m.identity === "Verified" ? "ok" : "warn",
							children: m.identity
						}) })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-muted-foreground",
							children: "Household"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/officer/families/$id",
							params: { id: CITIZEN.householdId },
							className: "font-mono text-gov hover:underline",
							children: CITIZEN.householdId
						}) })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-muted-foreground",
							children: "Relationship"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: m.relationship })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-muted-foreground",
							children: "Membership"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: m.membership })] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Record history",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: m.history.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "border-l-2 pl-3 text-sm",
						children: [h.event, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs text-muted-foreground",
							children: fmtDate(h.date)
						})]
					}, i))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Applications",
				children: apps.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y",
					children: apps.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							a.id,
							" · ",
							getScheme(a.schemeId)?.name
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { s: a.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/officer/applications/$id",
									params: { id: a.id },
									children: "Open"
								})
							})]
						})]
					}, a.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No applications."
				})
			})
		]
	});
}
//#endregion
export { Citizen as component };
