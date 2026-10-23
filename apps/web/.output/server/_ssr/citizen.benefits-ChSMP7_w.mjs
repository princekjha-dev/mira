import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { M as useApp, v as fetchApplications, y as fetchBenefits } from "./app-state-DFvYNEHf.mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { En as ArrowUpRight, Ht as FileCheckCorner, R as RefreshCw, sn as CircleDollarSign, vn as CalendarDays } from "../_libs/lucide-react.mjs";
import { a as PageContainer, i as LoadingState, n as ErrorState, o as PageHeader, t as Empty } from "./ui-C30c-cKm.mjs";
import { t as Label } from "./label-BeT0bXvu.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DamjaduW.mjs";
import { n as MiraCard } from "./MiraPrimitives-aHc1BdE1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/citizen.benefits-ChSMP7_w.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ALL = "all";
var statusStyle = {
	Active: "border-emerald-200 bg-emerald-50 text-emerald-800",
	Approved: "border-emerald-200 bg-emerald-50 text-emerald-800",
	Disbursed: "border-teal-200 bg-teal-50 text-teal-800",
	Completed: "border-slate-200 bg-slate-100 text-slate-700",
	Pending: "border-amber-200 bg-amber-50 text-amber-900",
	"Under Review": "border-amber-200 bg-amber-50 text-amber-900",
	Suspended: "border-orange-200 bg-orange-50 text-orange-900",
	Rejected: "border-rose-200 bg-rose-50 text-rose-800",
	Expired: "border-slate-200 bg-slate-100 text-slate-700"
};
var inProgress = (app) => ![
	"Draft",
	"Approved",
	"Rejected"
].includes(app.status);
var asDate = (value) => value ? new Date(value).toLocaleDateString("en-IN", {
	day: "numeric",
	month: "short",
	year: "numeric"
}) : "Not available";
function Benefits() {
	const { state } = useApp();
	const session = state.session;
	const [benefits, setBenefits] = (0, import_react.useState)([]);
	const [applications, setApplications] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(false);
	const [member, setMember] = (0, import_react.useState)(ALL);
	const [year, setYear] = (0, import_react.useState)(ALL);
	const [type, setType] = (0, import_react.useState)(ALL);
	const refresh = (0, import_react.useCallback)(async () => {
		if (!session?.apiToken) {
			setBenefits([]);
			setApplications([]);
			return;
		}
		setLoading(true);
		setError(false);
		try {
			const [loadedBenefits, loadedApplications] = await Promise.all([fetchBenefits(session), fetchApplications(session)]);
			setBenefits(loadedBenefits);
			setApplications(loadedApplications);
		} catch {
			setError(true);
		} finally {
			setLoading(false);
		}
	}, [session]);
	(0, import_react.useEffect)(() => {
		refresh();
	}, [refresh]);
	const members = (0, import_react.useMemo)(() => [...new Set(benefits.map((benefit) => benefit.beneficiary))], [benefits]);
	const years = (0, import_react.useMemo)(() => [...new Set(benefits.map((benefit) => benefit.approvedOn.slice(0, 4)).filter(Boolean))].sort().reverse(), [benefits]);
	const filtered = (0, import_react.useMemo)(() => benefits.filter((benefit) => (member === ALL || benefit.beneficiary === member) && (year === ALL || benefit.approvedOn.startsWith(year)) && (type === ALL || benefit.type === type)), [
		benefits,
		member,
		year,
		type
	]);
	const active = benefits.filter((benefit) => benefit.status === "Active" || benefit.status === "Approved").length;
	const received = benefits.filter((benefit) => benefit.status === "Disbursed" || benefit.status === "Completed").length;
	const applicationsInProgress = applications.filter(inProgress).length;
	const pendingActions = applications.filter((app) => ["Verification Required", "Additional Evidence Required"].includes(app.status)).length;
	const summary = [
		{
			label: "Active benefits",
			value: active,
			icon: CircleDollarSign
		},
		{
			label: "Applications in progress",
			value: applicationsInProgress,
			icon: FileCheckCorner
		},
		{
			label: "Benefits received",
			value: received,
			icon: CalendarDays
		},
		{
			label: "Pending actions",
			value: pendingActions,
			icon: RefreshCw
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageContainer, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "YOUR BENEFITS",
		title: "Benefits and assistance",
		desc: "View the welfare benefits available to your household and track the support you've received."
	}), !session?.apiToken ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
		title: "Sign in to view your benefits",
		body: "Your benefit history is private and will appear here after you sign in.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/login",
				children: "Sign in"
			})
		})
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: loading && benefits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { label: "Loading your benefits…" }) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { onRetry: () => void refresh() }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			"aria-label": "Benefits overview",
			className: "mb-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4",
			children: summary.map(({ label, value, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraCard, {
				variant: "elevated",
				className: "p-4 rounded-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/60 text-foreground border border-border/50",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4.5 w-4.5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-2xl font-bold tracking-tight text-foreground",
							children: value
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground truncate",
							children: label
						})]
					})]
				})
			}, label))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-lg font-semibold tracking-tight text-slate-950",
				children: "Your benefit history"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-slate-600",
				children: "Records currently available for your account."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 sm:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "benefit-member",
						className: "text-xs text-slate-600",
						children: "Beneficiary"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: member,
						onValueChange: setMember,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							id: "benefit-member",
							className: "mt-1 w-full sm:w-48",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: ALL,
							children: "All people"
						}), members.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: name,
							children: name
						}, name))] })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "benefit-year",
						className: "text-xs text-slate-600",
						children: "Year"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: year,
						onValueChange: setYear,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							id: "benefit-year",
							className: "mt-1 w-full sm:w-32",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: ALL,
							children: "All years"
						}), years.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: item,
							children: item
						}, item))] })]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "benefit-type",
						className: "text-xs text-slate-600",
						children: "Benefit type"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: type,
						onValueChange: setType,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							id: "benefit-type",
							className: "mt-1 w-full sm:w-36",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: ALL,
								children: "All types"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "Individual",
								children: "Individual"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "Household",
								children: "Household"
							})
						] })]
					})] })
				]
			})]
		}),
		loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { label: "Refreshing benefits…" }) : filtered.length === 0 ? benefits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
			title: "No benefits yet",
			body: "You don't have any recorded benefits yet. Eligible benefits and approved assistance will appear here.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: () => void refresh(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4" }), "Refresh"]
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
			title: "No benefits match these filters",
			body: "Change a filter to see more of your benefit history."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-3",
			children: filtered.map((benefit) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MiraCard, {
				variant: "elevated",
				className: "p-5 rounded-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] font-semibold uppercase tracking-[0.13em] text-primary",
									children: [benefit.type, " benefit"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-1 text-base font-semibold tracking-tight text-foreground",
									children: benefit.scheme
								}),
								benefit.department && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 text-xs text-muted-foreground",
									children: benefit.department
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `w-fit rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyle[benefit.status] || statusStyle.Pending}`,
							children: benefit.status
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-4 grid gap-x-6 gap-y-3 border-t border-border/60 pt-4 text-sm sm:grid-cols-2 lg:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted-foreground",
								children: "Beneficiary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 font-medium text-foreground",
								children: benefit.beneficiary
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted-foreground",
								children: "Approved"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 font-medium text-foreground",
								children: asDate(benefit.approvedOn)
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted-foreground",
								children: "Reference"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 break-all font-mono text-xs text-muted-foreground",
								children: benefit.ref
							})] }),
							benefit.amount !== null && benefit.amount !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-slate-500",
								children: "Benefit value"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 font-medium text-slate-800",
								children: new Intl.NumberFormat("en-IN", {
									style: "currency",
									currency: benefit.currency || "INR",
									maximumFractionDigits: 0
								}).format(benefit.amount)
							})] }),
							benefit.validTo && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-slate-500",
								children: "Valid through"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 text-slate-800",
								children: asDate(benefit.validTo)
							})] })
						]
					}),
					benefit.applicationId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 border-t border-slate-100 pt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "link",
							size: "sm",
							className: "h-auto p-0 text-blue-700",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/citizen/applications/$id",
								params: { id: benefit.applicationId },
								children: [
									"View related application",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5" })
								]
							})
						})
					})
				]
			}) }, benefit.ref))
		})
	] }) })] });
}
//#endregion
export { Benefits as component };
