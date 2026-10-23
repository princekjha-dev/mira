import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { l as SCHEMES, r as CATEGORIES, u as STATES } from "./app-state-7jSiCijd.mjs";
import { t as Button } from "./button-BT328xhy.mjs";
import { S as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as RotateCcw, N as Search } from "../_libs/lucide-react.mjs";
import { a as PageContainer, o as PageHeader, t as Empty } from "./ui-lDSlMDlK.mjs";
import { t as Label } from "./label-DubpHrt-.mjs";
import { t as Input } from "./input-Cl-rV5ml.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Sj_zxMfs.mjs";
import { n as MiraCard } from "./MiraPrimitives-BaYHdl2h.mjs";
import { t as Route } from "./schemes.index-CMTg729-.mjs";
import { t as SchemeCard } from "./SchemeCard-CWS-eln7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/schemes.index-BuBq_yYz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ANY = "any";
function Schemes() {
	const search = Route.useSearch();
	const nav = useNavigate({ from: "/schemes/" });
	const [q, setQ] = (0, import_react.useState)(search.q ?? "");
	const [f, setF] = (0, import_react.useState)({
		level: ANY,
		income: ANY,
		bpl: ANY,
		state: ANY,
		age: "",
		gender: ANY,
		property: ANY
	});
	const category = search.category ?? ANY;
	const list = (0, import_react.useMemo)(() => SCHEMES.filter((s) => {
		const k = (search.q ?? "").toLowerCase();
		if (k && !(s.name + s.description + s.department + s.category).toLowerCase().includes(k)) return false;
		if (category !== ANY && s.category !== category) return false;
		if (f.level !== ANY && s.level !== f.level) return false;
		if (f.income !== ANY && s.incomeMax !== void 0 && s.incomeMax < Number(f.income)) return false;
		if (f.bpl === "no" && s.bplRequired) return false;
		if (f.state !== ANY && !s.states.includes("All States") && !s.states.includes(f.state)) return false;
		const age = Number(f.age);
		if (f.age && (s.ageMin && age < s.ageMin || s.ageMax && age > s.ageMax)) return false;
		if (f.gender === "Male" && s.gender === "Female") return false;
		if (f.property === "none" && s.property === "land-under-2ha") return false;
		if (f.property === "pucca" && s.property === "no-pucca-house") return false;
		return true;
	}), [
		search.q,
		category,
		f
	]);
	const sel = (key, label, opts) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
		className: "text-xs",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
		value: f[key],
		onValueChange: (v) => setF({
			...f,
			[key]: v
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
			className: "mt-1",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
			value: ANY,
			children: "Any"
		}), opts.map(([v, l]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
			value: v,
			children: l
		}, v))] })]
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageContainer, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "SCHEMES & SERVICES",
		title: "Find a scheme",
		desc: "Filter by your situation. See clear eligibility criteria and apply when you're ready.",
		crumbs: [{
			label: "Home",
			to: "/"
		}, { label: "Schemes" }]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[280px_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MiraCard, {
			variant: "elevated",
			className: "h-fit space-y-4 p-5 rounded-2xl",
			"aria-label": "Filters",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						nav({ search: {
							...search,
							q: q || void 0
						} });
					},
					role: "search",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "q",
						className: "text-xs font-medium text-foreground",
						children: "Search"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "q",
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Search schemes by name or keyword",
							className: "h-9"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							type: "submit",
							"aria-label": "Search",
							className: "h-9 w-9 shrink-0 tactile-btn",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4" })
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "text-xs font-medium text-foreground",
					children: "Scheme category"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: category,
					onValueChange: (v) => nav({ search: {
						...search,
						category: v === ANY ? void 0 : v
					} }),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "mt-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: ANY,
						children: "All categories"
					}), CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: c,
						children: c
					}, c))] })]
				})] }),
				sel("level", "Individual / Household", [["Individual", "Individual"], ["Household", "Household"]]),
				sel("income", "Annual household income", [
					["100000", "Up to ₹1,00,000"],
					["200000", "₹1,00,001 – ₹2,00,000"],
					["300000", "₹2,00,001 – ₹3,00,000"],
					["500000", "Above ₹3,00,000"]
				]),
				sel("bpl", "BPL status", [["yes", "BPL household"], ["no", "Not BPL"]]),
				sel("state", "State", STATES.slice(1).map((s) => [s, s])),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "age",
					className: "text-xs font-medium text-foreground",
					children: "Age"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "age",
					type: "number",
					min: 0,
					max: 120,
					value: f.age,
					onChange: (e) => setF({
						...f,
						age: e.target.value
					}),
					className: "mt-1 h-9",
					placeholder: "e.g. 42"
				})] }),
				sel("gender", "Gender (where applicable)", [["Female", "Female"], ["Male", "Male"]]),
				sel("property", "Property criteria", [
					["none", "No land / house"],
					["kutcha", "Kutcha house"],
					["pucca", "Own pucca house"]
				]),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					className: "w-full tactile-btn h-9",
					onClick: () => {
						setF({
							level: ANY,
							income: ANY,
							bpl: ANY,
							state: ANY,
							age: "",
							gender: ANY,
							property: ANY
						});
						setQ("");
						nav({ search: {} });
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "mr-1.5 h-3.5 w-3.5" }), "Reset filters"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-3 text-sm text-muted-foreground",
			"aria-live": "polite",
			children: [
				list.length,
				" scheme",
				list.length !== 1 && "s",
				" found"
			]
		}), list.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2 xl:grid-cols-3",
			children: list.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SchemeCard, { s }, s.id))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
			title: "No schemes match these filters",
			body: "Try removing a filter or searching a different keyword."
		})] })]
	})] });
}
//#endregion
export { Schemes as component };
