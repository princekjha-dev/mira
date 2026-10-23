import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { F as useApp, T as getScheme } from "./app-state-7jSiCijd.mjs";
import { t as Button } from "./button-BT328xhy.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { H as Plus, In as ArrowDown, i as X } from "../_libs/lucide-react.mjs";
import { o as PageHeader, s as Panel, t as Empty } from "./ui-lDSlMDlK.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-Cl-rV5ml.mjs";
import { t as Checkbox } from "./checkbox-wQewKegS.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CRo5rM7C.mjs";
import { t as Route } from "./department.schemes._id-Di7f9V3g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/department.schemes._id-DtjNH0gz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var WF = [
	"Application Submitted",
	"Documents Checked",
	"Eligibility Verified",
	"Duplicate Check",
	"Officer Review",
	"Decision",
	"Benefit / Disbursement"
];
function Cfg() {
	const { id } = Route.useParams();
	const { state, addAudit } = useApp();
	const s = getScheme(id);
	const [basis, setBasis] = (0, import_react.useState)(s?.basis ?? []);
	const [docs, setDocs] = (0, import_react.useState)(s?.documents ?? []);
	const [newDoc, setNewDoc] = (0, import_react.useState)("");
	const [wf, setWf] = (0, import_react.useState)(WF.map((w) => ({
		w,
		on: true
	})));
	if (!s) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
		title: "Scheme not found",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/department/schemes",
				children: "Back"
			})
		})
	});
	const save = (what) => {
		addAudit({
			actor: `${state.session?.name} (${state.session?.id})`,
			action: `Scheme configuration updated: ${what}`,
			application: s.id,
			prev: "—",
			next: what,
			reason: "Admin change"
		});
		toast.success(`${what} saved`, { description: "Change recorded in audit log." });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: s.name,
		desc: s.department,
		crumbs: [{
			label: "Manage Schemes",
			to: "/department/schemes"
		}, { label: s.name }],
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/department/rules",
				search: { scheme: s.id },
				children: "Edit eligibility rules"
			})
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
		defaultValue: "basis",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: "basis",
					children: "Eligibility basis"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: "docs",
					children: "Required Documents"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: "wf",
					children: "Application Workflow"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "basis",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "Eligibility is assessed on",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: [
							"Individual",
							"Household",
							"Property"
						].map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-start gap-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
								checked: basis.includes(b),
								onCheckedChange: (v) => setBasis(v ? [...basis, b] : basis.filter((x) => x !== b)),
								className: "mt-0.5"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: b
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs text-muted-foreground",
								children: b === "Individual" ? "Applicant's own attributes (age, gender, enrolment)" : b === "Household" ? "Household income, BPL status, and one-benefit-per-household checks" : "Land and house ownership across all household members"
							})] })]
						}, b))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4",
						disabled: !basis.length,
						onClick: () => save(`Eligibility basis: ${basis.join(" + ")}`),
						children: "Save"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "docs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "Required documents",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-2",
							children: docs.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between rounded-md border px-3 py-2 text-sm",
								children: [d, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "icon",
									variant: "ghost",
									"aria-label": `Remove ${d}`,
									onClick: () => setDocs(docs.filter((x) => x !== d)),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
								})]
							}, d))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "mt-3 flex gap-2",
							onSubmit: (e) => {
								e.preventDefault();
								if (newDoc.trim()) {
									setDocs([...docs, newDoc.trim()]);
									setNewDoc("");
								}
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: newDoc,
								onChange: (e) => setNewDoc(e.target.value),
								placeholder: "Add document type"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								variant: "outline",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }), "Add"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-4",
							onClick: () => save("Required documents"),
							children: "Save"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "wf",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "Application workflow",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "space-y-1",
							children: wf.map((x, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-md border bg-card px-3 py-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mr-2 font-mono text-xs text-muted-foreground",
									children: i + 1
								}), x.w] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
										checked: x.on,
										disabled: [
											"Application Submitted",
											"Officer Review",
											"Decision"
										].includes(x.w),
										onCheckedChange: (v) => setWf(wf.map((y, j) => j === i ? {
											...y,
											on: !!v
										} : y))
									}), "Enabled"]
								})]
							}), i < wf.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "mx-auto my-0.5 h-3 w-3 text-muted-foreground" })] }, x.w))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: "Officer Review and Decision are mandatory: the platform never issues automatic decisions."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-4",
							onClick: () => save("Application workflow"),
							children: "Save"
						})
					]
				})
			})
		]
	})] });
}
//#endregion
export { Cfg as component };
