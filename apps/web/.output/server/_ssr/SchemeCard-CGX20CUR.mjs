import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { a as CATEGORY_IMAGE, k as useApp, r as Button } from "./button-B0ZnFkgi.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { dt as FileText } from "../_libs/lucide-react.mjs";
import { i as LevelBadge, l as Pill } from "./ui-BPP2eTpy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SchemeCard-CGX20CUR.js
var import_jsx_runtime = require_jsx_runtime();
function SchemeCard({ s }) {
	const { t } = useApp();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "flex flex-col overflow-hidden rounded-lg border bg-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: CATEGORY_IMAGE[s.category],
			alt: "",
			loading: "lazy",
			width: 1024,
			height: 656,
			className: "h-36 w-full object-cover"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LevelBadge, { level: s.level }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, { children: s.category })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-semibold text-navy",
					children: s.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: s.department
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm",
					children: s.description
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: "Eligibility"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-1 list-disc space-y-0.5 pl-4 text-muted-foreground",
							children: s.eligibility.slice(0, 2).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: e }, e))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 flex items-start gap-1 text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "mt-0.5 h-3.5 w-3.5 shrink-0" }), s.documents.join(", ")]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-auto flex flex-wrap gap-2 pt-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/schemes/$id",
								params: { id: s.id },
								children: t("viewDetails")
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/eligibility",
								search: { scheme: s.id },
								children: t("checkEligibility")
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/citizen/apply/$schemeId",
								params: { schemeId: s.id },
								children: t("apply")
							})
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { SchemeCard as t };
