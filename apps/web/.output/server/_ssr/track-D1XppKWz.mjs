import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { M as useApp, S as getScheme, v as fetchApplications, x as fmtDate } from "./app-state-DFvYNEHf.mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { S as useNavigate, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { On as ArrowRight, R as RefreshCw, j as Search } from "../_libs/lucide-react.mjs";
import { a as PageContainer, d as Timeline, i as LoadingState, n as ErrorState, o as PageHeader, t as Empty, u as StatusBadge } from "./ui-C30c-cKm.mjs";
import { t as Label } from "./label-BeT0bXvu.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { n as MiraCard } from "./MiraPrimitives-aHc1BdE1.mjs";
import { t as Route } from "./track-C-Aag1Ls.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/track-D1XppKWz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function referenceMatches(app, query) {
	const extended = app;
	return [app.id, extended.rawId].some((value) => value?.toUpperCase() === query);
}
function nextStep(app) {
	if (app.status === "Approved") return "Your decision is ready. Open the application for details.";
	if (app.status === "Rejected") return "Open the application to review the decision and available next steps.";
	if (app.status === "Verification Required" || app.status === "Additional Evidence Required") return "Please review the request and provide any missing information.";
	if (app.status === "Documents Under Review" || app.status === "Officer Review") return "Your application is being reviewed. Mira will show an update when the stage changes.";
	return "Your application has been received and is moving through the review process.";
}
function ApplicationTrackCard({ app }) {
	const extended = app;
	const schemeName = getScheme(app.schemeId)?.name || extended.schemeName || "Application";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MiraCard, {
		variant: "elevated",
		className: "p-5 sm:p-6 transition-all",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 border-b border-border/60 pb-4 sm:flex-row sm:items-start sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base sm:text-lg font-semibold tracking-tight text-foreground",
						children: schemeName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 break-all font-mono text-xs text-muted-foreground",
						children: app.id
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { s: app.status })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid gap-3 py-4 text-sm sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs text-muted-foreground",
						children: "Submitted"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-1 font-medium text-foreground",
						children: fmtDate(app.appliedOn)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs text-muted-foreground",
						children: "Last updated"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-1 font-medium text-foreground",
						children: fmtDate(app.updatedOn)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "text-xs text-muted-foreground",
						children: "Next step"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "mt-1 leading-5 text-foreground",
						children: nextStep(app)
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border/60 pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-3 text-sm font-semibold tracking-tight text-foreground",
					children: "Application progress"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timeline, { app })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 border-t border-border/60 pt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "link",
					size: "sm",
					className: "h-auto p-0 text-primary font-medium group",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/citizen/applications/$id",
						params: { id: app.rawId || app.id },
						children: ["View application details", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-0.5" })]
					})
				})
			})
		]
	});
}
function Track() {
	const searchParams = Route.useSearch();
	const navigate = useNavigate({ from: "/track" });
	const { state } = useApp();
	const session = state.session;
	const [applications, setApplications] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(false);
	const [id, setId] = (0, import_react.useState)(searchParams.id || "");
	const [submittedId, setSubmittedId] = (0, import_react.useState)(searchParams.id?.trim().toUpperCase() || "");
	const [formatError, setFormatError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (searchParams.id) {
			setId(searchParams.id);
			setSubmittedId(searchParams.id.trim().toUpperCase());
		}
	}, [searchParams.id]);
	const refresh = (0, import_react.useCallback)(async () => {
		if (!session?.apiToken) {
			setApplications([]);
			return;
		}
		setLoading(true);
		setError(false);
		try {
			setApplications(await fetchApplications(session));
		} catch {
			setError(true);
		} finally {
			setLoading(false);
		}
	}, [session]);
	(0, import_react.useEffect)(() => {
		refresh();
	}, [refresh]);
	const displayedApps = session?.apiToken ? applications : [];
	const submittedApps = (0, import_react.useMemo)(() => displayedApps.filter((app) => app.status !== "Draft"), [displayedApps]);
	const searched = submittedId ? submittedApps.find((app) => referenceMatches(app, submittedId)) : null;
	const search = (event) => {
		event.preventDefault();
		const value = id.trim().toUpperCase();
		if (!/^(APP-[A-Z0-9-]{6,}|[A-F0-9-]{16,})$/.test(value)) {
			setFormatError("Enter the application reference from your acknowledgement.");
			setSubmittedId("");
			return;
		}
		setFormatError("");
		setSubmittedId(value);
		navigate({ search: { id: value || void 0 } });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageContainer, {
		className: "max-w-5xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				eyebrow: "APPLICATION STATUS",
				title: "Track your application",
				desc: "See the current status of your welfare applications and what happens next."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraCard, {
				variant: "elevated",
				className: "mb-7 p-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: search,
					role: "search",
					noValidate: true,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "application-reference",
							className: "text-sm font-medium text-foreground",
							children: "Search by application reference"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Use the reference shown on your submission acknowledgement."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-col gap-2 sm:flex-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "application-reference",
								value: id,
								onChange: (event) => {
									setId(event.target.value);
									setFormatError("");
								},
								placeholder: "e.g. APP-2026-000318",
								"aria-invalid": !!formatError,
								"aria-describedby": formatError ? "track-reference-error" : void 0,
								className: "h-10"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								className: "sm:min-w-36 h-10 tactile-btn",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 mr-1.5" }), "Track application"]
							})]
						}),
						formatError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							id: "track-reference-error",
							className: "mt-2 text-xs text-destructive",
							role: "alert",
							children: formatError
						})
					]
				})
			}),
			submittedId && !loading && !error && !searched && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
					title: "No application found",
					body: "Check the reference on your acknowledgement and try again."
				})
			}),
			searched && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-7",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApplicationTrackCard, { app: searched })
			}),
			session?.apiToken && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				"aria-labelledby": "your-applications-heading",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex flex-wrap items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "your-applications-heading",
						className: "text-lg font-semibold tracking-tight text-slate-950",
						children: "Your applications"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-slate-600",
						children: "Applications associated with your signed-in account."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => void refresh(),
						disabled: loading,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-4 w-4 ${loading ? "animate-spin" : ""}` }), "Refresh"]
					})]
				}), loading && applications.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, { label: "Loading your applications…" }) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, { onRetry: () => void refresh() }) : submittedApps.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
					title: "No applications found",
					body: "Applications you submit through Mira will appear here.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/schemes",
							children: "Explore schemes"
						})
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: submittedApps.map((app) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApplicationTrackCard, { app }, app.rawId || app.id))
				})]
			})
		]
	});
}
//#endregion
export { Track as component };
