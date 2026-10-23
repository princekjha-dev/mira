import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { k as useApp, p as TIMELINE_STAGES, r as Button, v as cn } from "./button-B0ZnFkgi.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Nt as Check, U as LoaderCircle, V as Lock, t as X, wt as Circle } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ui-BPP2eTpy.js
var import_jsx_runtime = require_jsx_runtime();
var tone = {
	neutral: "bg-muted text-muted-foreground border-border",
	info: "bg-secondary text-gov border-gov/30",
	warn: "bg-warning/10 text-warning-foreground border-warning/40",
	ok: "bg-success/10 text-success border-success/30",
	bad: "bg-destructive/10 text-destructive border-destructive/30",
	teal: "bg-accent text-accent-foreground border-teal/30"
};
function Pill({ children, t = "neutral", className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center gap-1 rounded border px-2 py-0.5 text-xs font-medium whitespace-nowrap", tone[t], className),
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
		className: "uppercase tracking-wide",
		children: "Household"
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
		t: "info",
		className: "uppercase tracking-wide",
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
		className: "mb-7 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			crumbs && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				"aria-label": "Breadcrumb",
				className: "mb-1 text-xs text-muted-foreground",
				children: crumbs.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [c.to ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: c.to,
					className: "hover:text-gov hover:underline",
					children: c.label
				}) : c.label, i < crumbs.length - 1 && " / "] }, i))
			}),
			eyebrow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-700",
				children: eyebrow
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-[clamp(1.7rem,3vw,2.25rem)] font-semibold leading-tight tracking-tight text-slate-950",
				children: title
			}),
			desc && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-sm leading-6 text-slate-600",
				children: desc
			})
		] }), actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children: actions
		})]
	});
}
function Panel({ title, children, actions, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("rounded-xl border border-slate-200 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.045)]", className),
		children: [title && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between border-b px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold text-navy",
				children: title
			}), actions]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-4",
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
function Timeline({ app }) {
	const rejected = app.status === "Rejected";
	const stage = app.status === "Approved" && app.stage < 5 ? 5 : app.stage;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "space-y-0",
		children: TIMELINE_STAGES.map((label, i) => {
			const state = i < stage || i === stage && i === 6 && app.status === "Approved" ? "done" : i === stage ? "current" : "pending";
			const failed = rejected && i === 5;
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("text-sm font-medium", state === "pending" && "text-muted-foreground"),
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: failed ? "Rejected — see reason" : state === "done" ? "Completed" : state === "current" ? app.status === "Verification Required" || app.status === "Additional Evidence Required" ? "Action needed: " + app.status : "In progress" : "Pending"
					})] })
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
	if (state.session?.role !== role) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto my-16 max-w-md rounded-lg border bg-card p-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "mx-auto h-8 w-8 text-gov" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 text-lg font-semibold",
				children: "Sign in required"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: [
					"This area is for",
					" ",
					role === "citizen" ? "citizens" : role === "officer" ? "government officers" : "department administrators",
					". Please sign in with the correct account type."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: role === "officer" ? "/officer/login" : "/login",
					children: "Go to sign in"
				})
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function Emblem({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: "/miraicon.svg",
		alt: "Mira Emblem",
		className: cn("h-10 w-10 rounded-xl object-contain shrink-0", className),
		loading: "eager"
	});
}
//#endregion
export { LoadingState as a, Panel as c, StatusBadge as d, Timeline as f, LevelBadge as i, Pill as l, Empty as n, PageContainer as o, ErrorState as r, PageHeader as s, Emblem as t, RequireRole as u };
