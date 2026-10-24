import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { E as getScheme, I as useApp, T as fmtDate } from "./app-state-C6MbzGTh.mjs";
import { t as Button } from "./button-BT328xhy.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Pill, o as PageHeader, s as Panel, u as StatusBadge } from "./ui-Df8W68Fj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/officer.dashboard-DHCdz6jC.js
var import_jsx_runtime = require_jsx_runtime();
function OD() {
	const { state } = useApp();
	const A = state.applications.filter((a) => a.status !== "Draft");
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const cards = [
		{
			label: "Applications Pending",
			n: A.filter((a) => !["Approved", "Rejected"].includes(a.status)).length,
			to: "/officer/applications"
		},
		{
			label: "Verification Required",
			n: A.filter((a) => a.status === "Verification Required").length,
			to: "/officer/verification"
		},
		{
			label: "Duplicate Alerts",
			n: state.alerts.filter((a) => a.status === "Open").length,
			to: "/officer/duplicates"
		},
		{
			label: "Evidence Requested",
			n: A.filter((a) => a.status === "Additional Evidence Required").length,
			to: "/officer/applications"
		},
		{
			label: "Approved Today",
			n: A.filter((a) => a.status === "Approved" && a.updatedOn === today).length,
			to: "/officer/applications"
		}
	];
	const queue = A.filter((a) => [
		"Officer Review",
		"Verification Required",
		"Documents Under Review"
	].includes(a.status));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: `Welcome, ${state.session?.name}`,
			desc: `${state.session?.department} · Block Office, Sadar`
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3 lg:grid-cols-5",
			children: cards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: c.to,
				className: "rounded-lg border bg-card p-4 hover:border-gov",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: c.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-2xl font-semibold text-navy",
					children: c.n
				})]
			}, c.label))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Awaiting your action",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "ghost",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/officer/applications",
						children: "View all"
					})
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y",
					children: queue.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center justify-between gap-2 py-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm font-medium",
							children: [
								a.applicant,
								" — ",
								getScheme(a.schemeId)?.name
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								a.id,
								" · received ",
								fmtDate(a.appliedOn)
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { s: a.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/officer/applications/$id",
									params: { id: a.id },
									children: "Review"
								})
							})]
						})]
					}, a.id))
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Open duplicate alerts",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3",
					children: state.alerts.filter((d) => d.status === "Open").map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-md border p-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs",
									children: d.id
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
									t: d.severity === "High" ? "bad" : "warn",
									children: d.severity
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1",
								children: [
									d.applicant,
									" · ",
									d.scheme
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/officer/duplicates",
								className: "text-xs text-gov hover:underline",
								children: "Open comparison"
							})
						]
					}, d.id))
				})
			})]
		})
	] });
}
//#endregion
export { OD as component };
