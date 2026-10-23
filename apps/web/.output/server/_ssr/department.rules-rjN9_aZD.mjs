import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { F as useApp, k as nowStamp, l as SCHEMES } from "./app-state-7jSiCijd.mjs";
import { t as Button } from "./button-BT328xhy.mjs";
import { S as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { H as Plus, i as X } from "../_libs/lucide-react.mjs";
import { o as PageHeader, s as Panel, t as Empty } from "./ui-lDSlMDlK.mjs";
import { t as Label } from "./label-DubpHrt-.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-Cl-rV5ml.mjs";
import { t as Textarea } from "./textarea-D15QmElO.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Sj_zxMfs.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-D6hB8ul8.mjs";
import { t as Route } from "./department.rules-6bpsRGok.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/department.rules-rjN9_aZD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FIELDS = [
	"Household income",
	"Applicant age",
	"BPL status",
	"Property condition",
	"Land holding (ha)",
	"Gender",
	"Previous benefit",
	"State of residence"
];
var OPS = [
	"<",
	"<=",
	"=",
	">=",
	">",
	"NOT received"
];
function Rules() {
	const { scheme } = Route.useSearch();
	const nav = useNavigate({ from: "/department/rules" });
	const sid = scheme ?? "rural-housing";
	const { state, set, addAudit } = useApp();
	const versions = state.ruleVersions.filter((r) => r.schemeId === sid);
	const latest = versions.at(-1);
	const [conds, setConds] = (0, import_react.useState)(latest?.conditions ?? [{
		field: "Household income",
		op: "<",
		value: ""
	}]);
	const [eff, setEff] = (0, import_react.useState)("");
	const [reason, setReason] = (0, import_react.useState)("");
	const [err, setErr] = (0, import_react.useState)("");
	const changeScheme = (v) => {
		nav({ search: { scheme: v } });
		const l = state.ruleVersions.filter((r) => r.schemeId === v).at(-1);
		setConds(l?.conditions ?? [{
			field: "Household income",
			op: "<",
			value: ""
		}]);
	};
	const upd = (i, k, v) => setConds(conds.map((c, j) => j === i ? {
		...c,
		[k]: v
	} : c));
	const publish = () => {
		if (conds.some((c) => !c.value.trim())) return setErr("Every condition needs a value");
		if (!eff) return setErr("Choose an effective date");
		if (reason.trim().length < 10) return setErr("Provide a change reason (at least 10 characters)");
		setErr("");
		const version = versions.length ? `v${latest.version.slice(1).split(".")[0]}.${Number(latest.version.split(".")[1]) + 1}` : "v1.0";
		set((s) => ({ ruleVersions: [...s.ruleVersions, {
			version,
			schemeId: sid,
			effective: eff,
			by: `${s.session?.name} (Dept Admin)`,
			reason,
			conditions: conds
		}] }));
		addAudit({
			actor: `${state.session?.name} (${state.session?.id})`,
			action: "Rule version published",
			application: sid,
			prev: latest?.version ?? "—",
			next: version,
			reason
		});
		toast.success(`Rule ${version} published`, { description: `Effective ${eff}. Earlier versions remain for past decisions.` });
		setReason("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Eligibility Rules",
				desc: "Rules are versioned. Applications are always assessed with the version in force on their submission date."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Scheme" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: sid,
					onValueChange: changeScheme,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "mt-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: SCHEMES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: s.id,
						children: s.name
					}, s.id)) })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				title: "Rule builder",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							conds.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2 rounded-md border bg-background p-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-12 text-xs font-bold text-gov",
										children: i === 0 ? "IF" : "AND"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: c.field,
										onValueChange: (v) => upd(i, "field", v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "w-48",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: FIELDS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: f,
											children: f
										}, f)) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: c.op,
										onValueChange: (v) => upd(i, "op", v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "w-36",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: OPS.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: o,
											children: o
										}, o)) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: c.value,
										onChange: (e) => upd(i, "value", e.target.value),
										placeholder: "Value (e.g. 300000)",
										className: "w-48",
										"aria-label": `Value for condition ${i + 1}`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										disabled: conds.length === 1,
										onClick: () => setConds(conds.filter((_, j) => j !== i)),
										"aria-label": "Remove condition",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
									})
								]
							}, i)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setConds([...conds, {
									field: "BPL status",
									op: "=",
									value: ""
								}]),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }), "Add condition"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-md border-2 border-success/40 bg-success/5 p-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mr-3 text-xs font-bold text-success",
										children: "THEN"
									}),
									"Eligible ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "(subject to officer verification)"
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid gap-3 border-t pt-4 sm:grid-cols-[200px_1fr]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "eff",
							children: "Effective date"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "eff",
							type: "date",
							value: eff,
							onChange: (e) => setEff(e.target.value),
							className: "mt-1",
							min: nowStamp().slice(0, 10)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "rsn",
							children: "Change reason"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "rsn",
							value: reason,
							onChange: (e) => setReason(e.target.value),
							className: "mt-1",
							rows: 2,
							placeholder: "e.g. Income ceiling revised per notification no. …"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-destructive",
						role: "alert",
						children: err
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-2",
						onClick: publish,
						children: "Publish new version"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Rule versions",
				children: versions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
					title: "No versions yet for this scheme",
					body: "Publish the first version above."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Version" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Effective date" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Modified by" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Change reason" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Conditions" })
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: [...versions].reverse().map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-mono",
							children: v.version
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: v.effective }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: v.by }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-sm",
							children: v.reason
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-xs text-muted-foreground",
							children: v.conditions.map((c) => `${c.field} ${c.op} ${c.value}`).join(" AND ")
						})
					] }, v.version)) })] })
				})
			})
		]
	});
}
//#endregion
export { Rules as component };
