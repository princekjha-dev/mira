import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as CATEGORY_IMAGE, r as Button } from "./button-B0ZnFkgi.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Ot as CircleCheck, dt as FileText } from "../_libs/lucide-react.mjs";
import { c as Panel, i as LevelBadge, l as Pill, s as PageHeader } from "./ui-BPP2eTpy.mjs";
import { t as Route } from "./schemes._id-Jp19e_AH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/schemes._id-CIArXnVM.js
var import_jsx_runtime = require_jsx_runtime();
function Detail() {
	const s = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl px-4 py-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: s.name,
			desc: s.department,
			crumbs: [
				{
					label: "Home",
					to: "/"
				},
				{
					label: "Schemes",
					to: "/schemes"
				},
				{ label: s.name }
			],
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/eligibility",
					search: { scheme: s.id },
					children: "Check Eligibility"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/citizen/apply/$schemeId",
					params: { schemeId: s.id },
					children: "Apply"
				})
			})] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 md:grid-cols-[1.4fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: CATEGORY_IMAGE[s.category],
					alt: "",
					width: 1024,
					height: 656,
					className: "aspect-[16/9] w-full rounded-lg border object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "About the scheme",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: s.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LevelBadge, { level: s.level }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, { children: s.category }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pill, { children: ["Eligibility basis: ", s.basis.join(" + ")] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-muted-foreground",
							children: s.level === "Household" ? "This is a household benefit: only one benefit may be granted per household. Previous household benefits are checked." : "This is an individual benefit: it is granted to the named beneficiary."
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Eligibility criteria",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2 text-sm",
							children: s.eligibility.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 shrink-0 text-success" }), e]
							}, e))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Documents required",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2 text-sm",
							children: s.documents.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 shrink-0 text-gov" }), d]
							}, d))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						title: "Availability",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: s.states.join(", ")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: "Benefit amounts are notified by the department and are not shown in this prototype."
						})]
					})
				]
			})]
		})]
	});
}
//#endregion
export { Detail as component };
