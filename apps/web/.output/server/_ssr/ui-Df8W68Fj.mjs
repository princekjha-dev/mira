import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { I as useApp, f as TIMELINE_STAGES } from "./app-state-C6MbzGTh.mjs";
import { r as cn, t as Button } from "./button-BT328xhy.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { ct as Lock, i as X, ln as Circle, ut as LoaderCircle, vn as Check } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ui-Df8W68Fj.js
var import_jsx_runtime = require_jsx_runtime();
var tone = {
	neutral: "bg-muted/60 text-muted-foreground border-border/60",
	info: "bg-primary/10 text-primary border-primary/20",
	warn: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
	ok: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30",
	bad: "bg-destructive/10 text-destructive border-destructive/30",
	teal: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30"
};
function Pill({ children, t = "neutral", className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap", tone[t], className),
		children
	});
}
var statusTone = {
	Draft: "neutral",
	Submitted: "info",
	"Documents Under Review": "info",
	"Verification Required": "warn",
	"Officer Review": "teal",
	Approved: "ok",
	Rejected: "bad",
	"Additional Evidence Required": "warn"
};
var StatusBadge = ({ s }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
	t: statusTone[s],
	children: s
});
function LevelBadge({ level }) {
	return level === "Household" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
		t: "teal",
		className: "uppercase tracking-wide text-[10px]",
		children: "Household"
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
		t: "info",
		className: "uppercase tracking-wide text-[10px]",
		children: "Individual"
	});
}
function PageContainer({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 md:py-10", className),
		children
	});
}
function PageHeader({ title, desc, actions, crumbs, eyebrow }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex flex-col gap-3 border-b border-border/60 pb-4 md:flex-row md:items-end md:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			crumbs && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				"aria-label": "Breadcrumb",
				className: "mb-1.5 flex items-center gap-1.5 text-xs text-muted-foreground",
				children: crumbs.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1.5",
					children: [c.to ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: c.to,
						className: "hover:text-foreground transition-colors",
						children: c.label
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-foreground",
						children: c.label
					}), i < crumbs.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground/50",
						children: "/"
					})]
				}, i))
			}),
			eyebrow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
				children: eyebrow
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl sm:text-2xl font-bold tracking-tight text-foreground",
				children: title
			}),
			desc && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed",
				children: desc
			})
		] }), actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap items-center gap-2",
			children: actions
		})]
	});
}
function Panel({ title, children, actions, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("rounded-xl border border-border/70 bg-card text-card-foreground shadow-xs transition-all duration-150", className),
		children: [title && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b border-border/60 px-5 py-3.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold tracking-tight text-foreground",
				children: title
			}), actions]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-5",
			children
		})]
	});
}
function Empty({ title, body, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-semibold text-slate-900",
				children: title
			}),
			body && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-1.5 max-w-lg text-sm leading-6 text-slate-600",
				children: body
			}),
			action && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: action
			})
		]
	});
}
function LoadingState({ label = "Loading…" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-28 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-600",
		role: "status",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-blue-700" }), label]
	});
}
function ErrorState({ title = "Something went wrong", body = "We couldn't load this information right now.", onRetry }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-amber-200 bg-amber-50/60 p-5",
		role: "alert",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-semibold text-slate-900",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-slate-700",
				children: body
			}),
			onRetry && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "outline",
				className: "mt-3 border-slate-300 bg-white",
				onClick: onRetry,
				children: "Try again"
			})
		]
	});
}
var STAGE_ROLES = [
	"Applicant (Citizen)",
	"Document Intake Service",
	"Verification Officer",
	"Household Registry Service",
	"Eligibility Rules Engine",
	"Field Verification Officer",
	"Verification Officer / Citizen",
	"Scheme Sanctioning Officer",
	"Public Financial Management System",
	"Direct Benefit Transfer"
];
function Timeline({ app }) {
	const rejected = app.status === "Rejected";
	const stage = app.status === "Approved" && app.stage < 7 ? 7 : app.stage;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "space-y-0",
		children: TIMELINE_STAGES.map((label, i) => {
			const state = i < stage || i === stage && i === 9 && app.status === "Approved" ? "done" : i === stage ? "current" : "pending";
			const failed = rejected && i === 7;
			const role = STAGE_ROLES[i] || "Authorized Officer";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "relative flex gap-3 pb-5 last:pb-0",
				children: [
					i < TIMELINE_STAGES.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("absolute left-[11px] top-6 h-full w-px", state === "done" ? "bg-success" : "bg-border"),
						"aria-hidden": true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2", failed ? "border-destructive bg-destructive text-destructive-foreground" : state === "done" ? "border-success bg-success text-success-foreground" : state === "current" ? "border-warning bg-card text-warning" : "border-border bg-card text-muted-foreground"),
						children: failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" }) : state === "done" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }) : state === "current" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: cn("text-sm font-semibold", state === "pending" && "text-muted-foreground"),
									children: label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-mono text-slate-500",
									children: role
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: failed ? "Rejected — see documented reason" : state === "done" ? "Completed & Attested" : state === "current" ? app.status === "Verification Required" || app.status === "Additional Evidence Required" ? "Action Needed: Clarification / Evidence Requested" : "Currently Under Active Evaluation" : "Awaiting Prior Stage Attestation"
							}),
							state === "current" && (app.status === "Verification Required" || app.status === "Additional Evidence Required") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 rounded bg-amber-50 border border-amber-200 p-2 text-xs text-amber-900",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Officer Note:" }), " Address proof discrepancy between municipal records and uploaded electricity bill. Please upload recent utility bill."]
							})
						]
					})
				]
			}, label);
		})
	});
}
function RequireRole({ role, children }) {
	const { state, hydrated } = useApp();
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[40vh] items-center justify-center text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Loading…"]
	});
	const allowed = Array.isArray(role) ? role : [role];
	const userRole = state.session?.role;
	if (!userRole || !allowed.includes(userRole)) {
		const to = allowed.includes("citizen") ? "/login" : "/login";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto my-16 max-w-md rounded-lg border bg-card p-8 text-center shadow-xs",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "mx-auto h-8 w-8 text-gov" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 text-lg font-semibold",
					children: "Sign in required"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: [
						"This area requires authorization for:",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-foreground",
							children: allowed.join(", ").toUpperCase()
						}),
						". Please sign in with an account having this role."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to,
						children: "Go to sign in"
					})
				})
			]
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
//#endregion
export { PageContainer as a, Pill as c, Timeline as d, LoadingState as i, RequireRole as l, ErrorState as n, PageHeader as o, LevelBadge as r, Panel as s, Empty as t, StatusBadge as u };
