import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { M as useApp, l as SCHEMES, u as STATES } from "./app-state-DFvYNEHf.mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { S as useNavigate, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as RotateCcw, On as ArrowRight, kn as ArrowLeft, on as CircleQuestionMark, pn as Check } from "../_libs/lucide-react.mjs";
import { a as PageContainer, o as PageHeader, t as Empty } from "./ui-C30c-cKm.mjs";
import { t as Label } from "./label-BeT0bXvu.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DamjaduW.mjs";
import { n as MiraCard } from "./MiraPrimitives-aHc1BdE1.mjs";
import { t as Route } from "./eligibility-lcv3lrzE.mjs";
import { n as EligibilityResult, r as evaluate } from "./EligibilityResult-DWrVkyj0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/eligibility-avuxwHdx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FLOW = [
	"Your details",
	"Household information",
	"Scheme requirements",
	"Eligibility result"
];
var EMPTY_PROFILE = {
	age: 0,
	gender: "Other",
	income: 0,
	bpl: "unknown",
	puccaHouse: "unknown",
	landHa: 0,
	priorHouseholdSchemes: [],
	state: ""
};
function Eligibility() {
	const { scheme: schemeParam } = Route.useSearch();
	const nav = useNavigate({ from: "/eligibility" });
	const { state } = useApp();
	const [schemeId, setSchemeId] = (0, import_react.useState)(schemeParam ?? "");
	const [profile, setProfile] = (0, import_react.useState)({ ...EMPTY_PROFILE });
	const [step, setStep] = (0, import_react.useState)(0);
	const [errors, setErrors] = (0, import_react.useState)({});
	const [checked, setChecked] = (0, import_react.useState)(false);
	const selected = SCHEMES.find((item) => item.id === schemeId);
	const result = selected && checked ? evaluate(selected, profile) : null;
	(0, import_react.useEffect)(() => {
		setSchemeId(schemeParam || "");
		setChecked(false);
	}, [schemeParam]);
	const chooseScheme = (id) => {
		setSchemeId(id);
		setChecked(false);
		nav({ search: { scheme: id } });
	};
	const update = (key, value) => {
		setProfile((current) => ({
			...current,
			[key]: value
		}));
		setErrors((current) => ({
			...current,
			[key]: ""
		}));
	};
	const next = () => {
		const nextErrors = {};
		if (step === 0 && (!Number.isFinite(profile.age) || profile.age < 1 || profile.age > 120)) nextErrors.age = "Enter an age from 1 to 120.";
		if (step === 1) {
			if (!Number.isFinite(profile.income) || profile.income < 0) nextErrors.income = "Enter a valid annual household income.";
			if (!Number.isFinite(profile.landHa) || profile.landHa < 0) nextErrors.landHa = "Enter a valid land area.";
			if (!profile.state) nextErrors.state = "Choose your state or territory.";
		}
		if (step === 2 && !selected) nextErrors.scheme = "Choose a scheme to continue.";
		setErrors(nextErrors);
		if (Object.keys(nextErrors).length) return;
		if (step === 2) {
			setChecked(true);
			setStep(3);
		} else setStep((current) => Math.min(3, current + 1));
	};
	const back = () => {
		setErrors({});
		setStep((current) => Math.max(0, current - 1));
	};
	const reset = () => {
		setProfile({ ...EMPTY_PROFILE });
		setSchemeId("");
		setStep(0);
		setChecked(false);
		setErrors({});
		nav({ search: {} });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageContainer, {
		className: "max-w-6xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				eyebrow: "SCHEME FINDER",
				title: "Check your eligibility",
				desc: "Find schemes and benefits you may qualify for based on your household information."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4",
				"aria-label": "Eligibility check steps",
				children: FLOW.map((label, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					"aria-current": step === index ? "step" : void 0,
					className: `flex min-w-0 items-center gap-2 border-b-2 px-2 pb-3 pt-1 text-xs sm:px-3 sm:text-sm ${index === step ? "border-blue-700 text-slate-950" : index < step ? "border-teal-600 text-slate-700" : "border-slate-200 text-slate-500"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold ${index < step ? "border-teal-700 bg-teal-50 text-teal-800" : index === step ? "border-blue-700 text-blue-800" : "border-slate-300"}`,
						children: index < step ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }) : `0${index + 1}`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "leading-4",
						children: label
					})]
				}, label))
			}),
			step < 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MiraCard, {
				variant: "elevated",
				className: "overflow-hidden p-0 rounded-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-b border-border/60 px-5 py-4 sm:px-7 bg-muted/20",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-medium text-muted-foreground",
								children: [
									"Step 0",
									step + 1,
									" of 04"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 text-lg font-semibold tracking-tight text-foreground",
								children: FLOW[step]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Your answers are used for this check; they won't update your citizen record."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-5 px-5 py-5 sm:px-7 sm:py-6",
						children: [
							step === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "elig-age",
										children: "Your age"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "elig-age",
										type: "number",
										min: "1",
										max: "120",
										inputMode: "numeric",
										value: profile.age || "",
										onChange: (event) => update("age", Number(event.target.value)),
										className: "mt-1.5",
										"aria-invalid": !!errors.age,
										"aria-describedby": errors.age ? "elig-age-error" : void 0
									}),
									errors.age && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										id: "elig-age-error",
										className: "mt-1 text-sm text-destructive",
										role: "alert",
										children: errors.age
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "elig-gender",
									children: "Gender, if required by the scheme"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: profile.gender,
									onValueChange: (value) => update("gender", value),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										id: "elig-gender",
										className: "mt-1.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Female",
											children: "Female"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Male",
											children: "Male"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Other",
											children: "Prefer not to specify / other"
										})
									] })]
								})] })]
							}),
							step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "elig-income",
											children: "Annual household income (₹)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "elig-income",
											type: "number",
											min: "0",
											inputMode: "numeric",
											value: profile.income || "",
											onChange: (event) => update("income", Number(event.target.value)),
											className: "mt-1.5",
											"aria-invalid": !!errors.income,
											"aria-describedby": errors.income ? "elig-income-error" : void 0
										}),
										errors.income && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											id: "elig-income-error",
											className: "mt-1 text-sm text-destructive",
											role: "alert",
											children: errors.income
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "elig-state",
											children: "State or territory"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: profile.state,
											onValueChange: (value) => update("state", value),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												id: "elig-state",
												className: "mt-1.5",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose your location" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATES.filter((item) => item !== "All States").map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: item,
												children: item
											}, item)) })]
										}),
										errors.state && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-sm text-destructive",
											role: "alert",
											children: errors.state
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "elig-bpl",
										children: "Is your household listed as BPL?"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: profile.bpl === "unknown" ? "unknown" : profile.bpl ? "yes" : "no",
										onValueChange: (value) => update("bpl", value === "unknown" ? "unknown" : value === "yes"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "elig-bpl",
											className: "mt-1.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "unknown",
												children: "Not sure"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "yes",
												children: "Yes"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "no",
												children: "No"
											})
										] })]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "elig-pucca",
										children: "Does anyone in your household own a pucca house?"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: profile.puccaHouse,
										onValueChange: (value) => update("puccaHouse", value),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "elig-pucca",
											className: "mt-1.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "unknown",
												children: "Not sure / no record"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "no",
												children: "No"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "yes",
												children: "Yes"
											})
										] })]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "elig-land",
											children: "Cultivable land (hectares)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "elig-land",
											type: "number",
											min: "0",
											step: "0.1",
											value: profile.landHa || "",
											onChange: (event) => update("landHa", Number(event.target.value)),
											className: "mt-1.5",
											"aria-invalid": !!errors.landHa,
											"aria-describedby": errors.landHa ? "elig-land-error" : void 0
										}),
										errors.landHa && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											id: "elig-land-error",
											className: "mt-1 text-sm text-destructive",
											role: "alert",
											children: errors.landHa
										})
									] })
								]
							}),
							step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "elig-scheme",
										children: "Choose a scheme"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: schemeId,
										onValueChange: chooseScheme,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "elig-scheme",
											className: "mt-1.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select a scheme" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: SCHEMES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: item.id,
											children: item.name
										}, item.id)) })]
									}),
									errors.scheme && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-destructive",
										role: "alert",
										children: errors.scheme
									})
								] }), selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-5 border-t border-slate-100 pt-5 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-sm font-semibold text-slate-900",
										children: "Requirements"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-2 list-disc space-y-1.5 pl-5 text-sm leading-5 text-slate-600",
										children: selected.eligibility.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-sm font-semibold text-slate-900",
											children: "Documents to prepare"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
											className: "mt-2 list-disc space-y-1.5 pl-5 text-sm leading-5 text-slate-600",
											children: selected.documents.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-3 text-xs text-slate-500",
											children: "The final decision is made during application review."
										})
									] })]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
									title: "Choose a scheme to see its requirements",
									body: "You can change your selection later.",
									action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										variant: "outline",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/schemes",
											children: "Browse schemes"
										})
									})
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col-reverse gap-2 border-t border-border/60 bg-muted/30 px-5 py-4 sm:flex-row sm:justify-between sm:px-7",
						children: [step > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: back,
							className: "tactile-btn",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4 mr-1.5" }), "Back"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), step === 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: next,
							disabled: !selected,
							className: "tactile-btn",
							children: ["Check Eligibility", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 ml-1.5" })]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: next,
							className: "tactile-btn",
							children: ["Continue", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 ml-1.5" })]
						})]
					})
				]
			}) : result && selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MiraCard, {
					variant: "elevated",
					className: "p-6 rounded-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-[0.13em] text-primary",
								children: "Eligibility result"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 text-xl font-semibold tracking-tight text-foreground",
								children: result.outcome === "Likely Eligible" ? "You may be eligible" : result.outcome === "Verification Required" ? "More information is needed" : "Not currently eligible"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: selected.name
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "tactile-btn",
							onClick: () => {
								setStep(0);
								setChecked(false);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5 mr-1.5" }), "Edit answers"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EligibilityResult, { ...result })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 sm:flex-row",
					children: [result.outcome === "Currently Not Eligible" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						disabled: true,
						children: "Apply for this scheme"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/citizen/apply/$schemeId",
							params: { schemeId: selected.id },
							children: ["Apply for this scheme", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/schemes/$id",
							params: { id: selected.id },
							children: "View scheme details"
						})
					})]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-5 flex items-start gap-2 text-xs leading-5 text-slate-500",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "mt-0.5 h-4 w-4 shrink-0" }), "This is an initial check based on the information you entered. It does not guarantee approval; the department confirms eligibility during application review."]
			}),
			state.session?.apiToken && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 text-right",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "link",
					size: "sm",
					onClick: reset,
					children: "Start over"
				})
			})
		]
	});
}
//#endregion
export { Eligibility as component };
