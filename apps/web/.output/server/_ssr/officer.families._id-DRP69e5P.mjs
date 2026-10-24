import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { I as useApp, T as fmtDate, c as MEMBERS, n as BENEFITS, o as HOUSEHOLD } from "./app-state-C6MbzGTh.mjs";
import { t as Button } from "./button-BT328xhy.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Pill, o as PageHeader, s as Panel, t as Empty } from "./ui-Df8W68Fj.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Route } from "./officer.families._id-B42DAte9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/officer.families._id-DRP69e5P.js
var import_jsx_runtime = require_jsx_runtime();
function Fam() {
	const { id } = Route.useParams();
	const { state, set, addAudit } = useApp();
	if (id !== HOUSEHOLD.id) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
		title: `No household record for ${id}`,
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/officer/families/$id",
				params: { id: HOUSEHOLD.id },
				children: ["Open ", HOUSEHOLD.id]
			})
		})
	});
	const act = (rid, status) => {
		set((s) => ({ familyRequests: s.familyRequests.map((r) => r.id === rid ? {
			...r,
			status
		} : r) }));
		addAudit({
			actor: `${state.session?.name} (${state.session?.id})`,
			action: status === "Verified" ? "Record verified" : "Family update returned",
			application: rid,
			prev: "Pending verification",
			next: status,
			reason: "Officer review of family update"
		});
		toast.success(`Request ${status === "Verified" ? "verified" : "returned to citizen"}`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: `Household ${HOUSEHOLD.id}`,
				desc: HOUSEHOLD.address,
				crumbs: [{ label: "Family Records" }, { label: HOUSEHOLD.id }]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Overview",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "grid gap-3 text-sm sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-muted-foreground",
							children: "Status"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
							t: "ok",
							children: HOUSEHOLD.status
						}) })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-muted-foreground",
							children: "BPL"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: HOUSEHOLD.bpl })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-muted-foreground",
							children: "Registered"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: fmtDate(HOUSEHOLD.registeredOn) })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sm:col-span-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted-foreground",
								children: "Property"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: HOUSEHOLD.property })]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Members and relationship history",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y",
					children: MEMBERS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center justify-between gap-2 py-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/officer/citizens/$id",
								params: { id: m.id },
								className: "text-gov hover:underline",
								children: m.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: m.relationship
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: m.history.at(-1)?.event
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								t: m.membership === "Active" ? "info" : "neutral",
								children: m.membership
							})
						]
					}, m.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Household benefits",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1 text-sm",
					children: BENEFITS.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							b.scheme,
							" · ",
							b.beneficiary
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
							t: b.type === "Household" ? "teal" : "info",
							children: b.type
						})]
					}, b.ref))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Pending family updates",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y",
					children: state.familyRequests.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center justify-between gap-2 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: r.type
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								r.id,
								" · ",
								r.details
							]
						})] }), r.status === "Pending verification" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: () => act(r.id, "Verified"),
								children: "Verify"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => act(r.id, "Returned"),
								children: "Return"
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
							t: r.status === "Verified" ? "ok" : "warn",
							children: r.status
						})]
					}, r.id))
				})
			})
		]
	});
}
//#endregion
export { Fam as component };
