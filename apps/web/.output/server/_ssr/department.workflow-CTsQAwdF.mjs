import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { o as PageHeader } from "./ui-C30c-cKm.mjs";
import { t as Switch } from "./switch-DtEVXaE2.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as CardContent, t as Card } from "./card-C5Nmk_bj.mjs";
import { t as Badge } from "./badge-B3f60TId.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/department.workflow-CTsQAwdF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DeptWorkflowPage() {
	const [stages, setStages] = (0, import_react.useState)([
		{
			id: 1,
			name: "Application Ingestion",
			auto: true,
			desc: "Aadhaar e-KYC validation & duplicate prevention check"
		},
		{
			id: 2,
			name: "Registry Cross-Verification",
			auto: true,
			desc: "Automatic match with Bhulekh Land Records & Revenue data"
		},
		{
			id: 3,
			name: "Field Inspection Dispatch",
			auto: false,
			desc: "Route to assigned Field Official (Ravi Kumar) based on GPS boundary"
		},
		{
			id: 4,
			name: "Physical Evidence Corroboration",
			auto: false,
			desc: "Dwelling photo geotag validation & citizen acknowledgement"
		},
		{
			id: 5,
			name: "Verification Officer Determination",
			auto: false,
			desc: "Statutory finding & reason note recording by Verifier"
		},
		{
			id: 6,
			name: "Benefit Entitlement Generation",
			auto: true,
			desc: "Public ledger record generation & DBT payment queue linkage"
		}
	]);
	const handleToggleAuto = (id) => {
		setStages((prev) => prev.map((s) => s.id === id ? {
			...s,
			auto: !s.auto
		} : s));
		toast.success("Workflow stage execution mode updated.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Workflow & Verification Lifecycle Configurator",
			desc: "Define statutory stages, automated cross-registry triggers, and officer delegation paths.",
			crumbs: [{
				label: "Department",
				to: "/department/dashboard"
			}, { label: "Workflow Config" }]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: stages.map((st, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-border/80 shadow-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0",
							children: st.id
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground text-sm",
								children: st.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: st.auto ? "secondary" : "outline",
								className: "text-[10px]",
								children: st.auto ? "Automated Pipeline" : "Manual Officer Discretion"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: st.desc
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-4 text-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Auto-Advance:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: st.auto,
								onCheckedChange: () => handleToggleAuto(st.id)
							})]
						})
					})]
				})
			}, st.id))
		})]
	});
}
//#endregion
export { DeptWorkflowPage as component };
