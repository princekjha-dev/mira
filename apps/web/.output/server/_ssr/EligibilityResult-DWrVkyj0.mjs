import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { r as cn } from "./button-PwNqyxv_.mjs";
import { an as CircleX, cn as CircleCheck, h as TriangleAlert } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/EligibilityResult-DWrVkyj0.js
var import_jsx_runtime = require_jsx_runtime();
function evaluate(s, p) {
	const c = [];
	if (s.ageMin !== void 0 || s.ageMax !== void 0) {
		const ok = (s.ageMin === void 0 || p.age >= s.ageMin) && (s.ageMax === void 0 || p.age <= s.ageMax);
		const range = `${s.ageMin ?? 0}${s.ageMax ? "–" + s.ageMax : "+"}`;
		c.push({
			label: "Age",
			status: ok ? "pass" : "fail",
			detail: ok ? `Age ${p.age} is within the required range (${range}).` : `Age ${p.age} is outside the required range (${range}).`
		});
	}
	if (s.gender) {
		const ok = p.gender === s.gender;
		c.push({
			label: "Gender",
			status: ok ? "pass" : "fail",
			detail: ok ? "This scheme is for women applicants; criterion met." : "This scheme is only for women applicants."
		});
	}
	if (s.incomeMax !== void 0) {
		const ok = p.income <= s.incomeMax;
		c.push({
			label: "Income",
			status: ok ? "pass" : "fail",
			detail: `Declared household income ₹${p.income.toLocaleString("en-IN")} ${ok ? "is within" : "exceeds"} the limit of ₹${s.incomeMax.toLocaleString("en-IN")}.`
		});
	}
	if (s.bplRequired) c.push({
		label: "Household criteria (BPL)",
		status: p.bpl === "unknown" ? "verify" : p.bpl ? "pass" : "fail",
		detail: p.bpl === "unknown" ? "BPL status is unknown and needs to be checked against your household record." : p.bpl ? "Household is listed as BPL." : "Scheme requires a BPL household; no BPL record found."
	});
	if (!s.states.includes("All States")) {
		const ok = s.states.includes(p.state);
		c.push({
			label: "State",
			status: ok ? "pass" : "fail",
			detail: ok ? `Scheme is available in ${p.state}.` : `Scheme is currently available only in: ${s.states.join(", ")}.`
		});
	}
	if (s.property === "no-pucca-house") {
		const st = p.puccaHouse === "no" ? "pass" : p.puccaHouse === "yes" ? "fail" : "verify";
		c.push({
			label: "Property criteria",
			status: st,
			detail: st === "pass" ? "No pucca house recorded for the household." : st === "fail" ? "A pucca house is recorded in the household's name." : "Property records are incomplete — a land/house record check is required."
		});
	}
	if (s.property === "land-under-2ha") {
		const st = p.landHa > 0 && p.landHa <= 2 ? "pass" : p.landHa > 2 ? "fail" : "verify";
		c.push({
			label: "Property criteria (land)",
			status: st,
			detail: st === "pass" ? `${p.landHa} ha cultivable land is within the 2 ha limit.` : st === "fail" ? `${p.landHa} ha exceeds the 2 ha limit.` : "No land record found — please upload land documents."
		});
	}
	if (s.householdExclusive) {
		const conflict = p.priorHouseholdSchemes.includes(s.id);
		c.push({
			label: "Previous household benefit",
			status: conflict ? "verify" : "pass",
			detail: conflict ? "A similar household-level benefit may already exist. An officer will review." : "No conflicting household benefit found."
		});
	}
	return {
		criteria: c,
		outcome: c.some((x) => x.status === "fail") ? "Currently Not Eligible" : c.some((x) => x.status === "verify") ? "Verification Required" : "Likely Eligible"
	};
}
var DEMO_PROFILE = {
	age: 42,
	gender: "Female",
	income: 12e4,
	bpl: true,
	puccaHouse: "unknown",
	landHa: .8,
	priorHouseholdSchemes: ["health-cover"],
	state: "Uttar Pradesh"
};
var icon = {
	pass: CircleCheck,
	verify: TriangleAlert,
	fail: CircleX
};
var color = {
	pass: "text-success",
	verify: "text-warning",
	fail: "text-destructive"
};
var word = {
	pass: "Eligible",
	verify: "Verification Required",
	fail: "Not met"
};
function EligibilityResult({ criteria, outcome }) {
	const box = outcome === "Likely Eligible" ? "border-success/40 bg-success/5" : outcome === "Verification Required" ? "border-warning/50 bg-warning/5" : "border-destructive/40 bg-destructive/5";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y rounded-lg border bg-card",
			children: criteria.map((c) => {
				const I = icon[c.status];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-3 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(I, {
						className: cn("mt-0.5 h-5 w-5 shrink-0", color[c.status]),
						"aria-hidden": true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: c.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("text-sm font-medium", color[c.status]),
								children: word[c.status]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: c.detail
						})]
					})]
				}, c.label);
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("rounded-lg border-2 p-4", box),
			role: "status",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-wide text-muted-foreground",
					children: "Final status"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-lg font-semibold",
					children: outcome
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: [
						outcome === "Likely Eligible" && "All criteria are met based on the information available. Final approval is made by the officer after document verification.",
						outcome === "Verification Required" && "Some criteria need record or document checks (shown above with ⚠). You can still apply; an officer will verify.",
						outcome === "Currently Not Eligible" && "One or more criteria are not met (shown above with ✕). If your records are outdated, you can update them and check again."
					]
				})
			]
		})]
	});
}
//#endregion
export { EligibilityResult as n, evaluate as r, DEMO_PROFILE as t };
