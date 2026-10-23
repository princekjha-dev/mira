import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { D as raiseFamilyDispute, M as useApp, S as getScheme, b as fetchMyFamily, k as reportLifeEvent, l as SCHEMES, p as addFamilyMember, t as AppStateProvider, x as fmtDate } from "./app-state-DFvYNEHf.mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { C as useRouter, _ as Outlet, b as createRootRouteWithContext, d as Scripts, f as HeadContent, g as createRouter, m as useRouterState, v as lazyRouteComponent, x as Link, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as ShieldCheck, Ht as FileCheckCorner, Lt as FileLock, N as ScrollText, O as ShieldAlert, On as ArrowRight, P as Scale, Q as MapPin, R as RefreshCw, _n as Calendar, a as Waves, bn as Building2, cn as CircleCheck, d as UserPlus, en as Clock, h as TriangleAlert, j as Search, kt as FlaskConical, ln as CircleAlert, p as UserCheck, r as Wrench, rt as Lock, st as ListChecks, tn as Clock3, ut as Layers, yt as History } from "../_libs/lucide-react.mjs";
import { c as Pill, o as PageHeader, s as Panel } from "./ui-C30c-cKm.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DOmVNICc.mjs";
import { t as Label } from "./label-BeT0bXvu.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { o as SiteFooter, s as SiteHeader } from "./SiteHeader-Bq-wmDT1.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { t as Textarea } from "./textarea-DjqHhWkA.mjs";
import { t as Route$60 } from "./citizen.applications._id-C9J16qfd.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DamjaduW.mjs";
import { t as Route$61 } from "./citizen.apply._schemeId-CEwjRJbU.mjs";
import { a as MiraSectionHeader, i as MiraPageHeader, n as MiraCard, o as MiraStatCard, r as MiraEmptyState, s as MiraStatus, t as MiraBadge } from "./MiraPrimitives-aHc1BdE1.mjs";
import { i as useQueryClient, n as useQuery, r as QueryClientProvider, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Route$62 } from "./citizen.documents-B2uO-Mqt.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CA_Ke5Cp.mjs";
import { t as Route$63 } from "./department.rules-CxezKO2m.mjs";
import { t as Route$64 } from "./department.schemes._id-C4Nnd3R2.mjs";
import { t as Route$65 } from "./eligibility-lcv3lrzE.mjs";
import { t as Route$66 } from "./help-BwQInenP.mjs";
import { t as Route$67 } from "./officer.applications._id-BEgNV6Y4.mjs";
import { t as Route$68 } from "./officer.citizens._id-V3PEP6az.mjs";
import { t as Route$69 } from "./officer.families._id-DJfub7Kr.mjs";
import { n as Route$70 } from "./login-Cuij199s.mjs";
import { t as Route$71 } from "./track-C-Aag1Ls.mjs";
import { t as Route$72 } from "./schemes.index-DFfwSbMa.mjs";
import { t as Route$73 } from "./schemes._id-XgdTmEiP.mjs";
import { t as Route$74 } from "./verifier.applications._id-mV-WIoN6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CKWr4uFk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DxYcaLM6.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message: describeThrown(error),
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var MAX_SERIALIZED_LENGTH = 2e3;
function describeThrown(error) {
	if (error instanceof Response) return `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`;
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	const { message } = error ?? {};
	if (typeof message === "string" && message.length > 0) return message;
	try {
		return JSON.stringify(error)?.slice(0, MAX_SERIALIZED_LENGTH) ?? String(error);
	} catch {
		return String(error);
	}
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-[60vh] items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-5xl font-bold text-navy",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var FONTS = "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600&family=Noto+Sans+Bengali:wght@400;600&family=Noto+Sans+Tamil:wght@400;600&family=Noto+Sans+Telugu:wght@400;600&family=Noto+Sans+Gujarati:wght@400;600&family=Noto+Sans+Gurmukhi:wght@400;600&display=swap";
var Route$59 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Unified Digital Platform for Accessible Public Documentation" },
			{
				name: "description",
				content: "Citizen records, family households, documents, scheme eligibility and benefits on one trusted public platform."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://gstatic.com"
			},
			{
				rel: "stylesheet",
				href: FONTS
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/miraicon.svg",
				type: "image/svg+xml"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$59.useRouteContext();
	const path = useRouterState({ select: (s) => s.location.pathname });
	const workspace = path.startsWith("/citizen") || path.startsWith("/officer") && !path.startsWith("/officer/login") || path.startsWith("/department") || path.startsWith("/verifier") || path.startsWith("/auditor");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppStateProvider, { children: [workspace ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-h-screen flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					id: "main",
					className: "flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			position: "top-right",
			richColors: true
		})] })
	});
}
var $$splitComponentImporter$54 = () => import("./routes-kgkfiE_K.mjs");
var Route$58 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Mira — Unified Citizen Welfare Platform" },
		{
			name: "description",
			content: "Public records, welfare schemes, and citizen benefits in one place. Discover eligible schemes, manage documents, submit applications and track decisions."
		},
		{
			property: "og:title",
			content: "Mira — Unified Citizen Welfare Platform"
		},
		{
			property: "og:description",
			content: "Public records, welfare schemes, and citizen benefits in one place. Access household records, discover eligible schemes, and track applications."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$54, "component")
});
var $$splitComponentImporter$53 = () => import("./auditor-WcWWwddw.mjs");
var Route$57 = createFileRoute("/auditor")({ component: lazyRouteComponent($$splitComponentImporter$53, "component") });
var $$splitComponentImporter$52 = () => import("./citizen-BEjUgyk6.mjs");
var Route$56 = createFileRoute("/citizen")({ component: lazyRouteComponent($$splitComponentImporter$52, "component") });
var $$splitComponentImporter$51 = () => import("./department-Bm55ZsTA.mjs");
var Route$55 = createFileRoute("/department")({ component: lazyRouteComponent($$splitComponentImporter$51, "component") });
var $$splitComponentImporter$50 = () => import("./officer-CIqzM7Hx.mjs");
var Route$54 = createFileRoute("/officer")({ component: lazyRouteComponent($$splitComponentImporter$50, "component") });
var $$splitComponentImporter$49 = () => import("./verifier-x5C1Tc6m.mjs");
var Route$53 = createFileRoute("/verifier")({ component: lazyRouteComponent($$splitComponentImporter$49, "component") });
var $$splitComponentImporter$48 = () => import("./auditor.applications-Cz-usd5R.mjs");
var Route$52 = createFileRoute("/auditor/applications")({
	head: () => ({ meta: [{ title: "Applications Audit — Forensic Inspection" }, {
		name: "description",
		content: "Read-only application audit inspection."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$48, "component")
});
var $$splitComponentImporter$47 = () => import("./auditor.audit-BM3b7Pcl.mjs");
var Route$51 = createFileRoute("/auditor/audit")({
	head: () => ({ meta: [{ title: "Forensic Audit Ledger — Auditor" }, {
		name: "description",
		content: "Tamper-evident chronological transaction ledger with block hashes."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$47, "component")
});
var Route$50 = createFileRoute("/auditor/dashboard")({
	head: () => ({ meta: [{ title: "Statutory Forensic Audit Station — Priya Nair · Mira" }, {
		name: "description",
		content: "Independent statutory audit overview, decision integrity verification, and immutable cryptographic ledger telemetry."
	}] }),
	component: AuditorDashboardPage
});
function AuditorDashboardPage() {
	const { state } = useApp();
	const totalDecisions = state.decisions?.length || 4;
	const auditLogs = state.audit || [];
	const auditorName = state.session?.name || "Priya Nair";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-7 pb-12 animate-in fade-in duration-200",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraPageHeader, {
				context: "Statutory Auditor",
				title: "Forensic Audit Station",
				description: `${auditorName} · State Audit Directorate · ISO/IEC 27001 Cryptographic Verification · Strict Read-Only Authority`,
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						asChild: true,
						className: "h-8.5 rounded-lg border-border/80 bg-background/80 px-3.5 text-xs font-medium shadow-2xs hover:bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/auditor/decisions",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileLock, { className: "mr-1.5 h-3.5 w-3.5 text-muted-foreground" }), "Sealed Decisions"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						asChild: true,
						className: "h-8.5 rounded-lg bg-primary px-3.5 text-xs font-medium text-primary-foreground shadow-2xs hover:bg-primary/95",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/auditor/audit",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollText, { className: "mr-1.5 h-3.5 w-3.5" }),
								"Inspect Full Ledger (",
								auditLogs.length,
								")"
							]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraStatCard, {
						title: "Chain Integrity",
						value: "Verified Valid",
						subtext: "Zero broken Merkle blocks",
						icon: ShieldCheck,
						trend: {
							label: "Cryptographic Pass",
							tone: "positive"
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraStatCard, {
						title: "Decisions Sealed",
						value: totalDecisions,
						subtext: "SHA-256 state seal affixed",
						icon: Lock,
						trend: {
							label: "Tamper Proof",
							tone: "positive"
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraStatCard, {
						title: "Audit Log Entries",
						value: auditLogs.length,
						subtext: "Immutable append-only stream",
						icon: History,
						trend: {
							label: "Sequential",
							tone: "neutral"
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraStatCard, {
						title: "Detected Anomalies",
						value: "0 critical",
						subtext: "100% compliance record",
						icon: CircleCheck,
						trend: {
							label: "Compliant",
							tone: "positive"
						}
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MiraCard, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraSectionHeader, {
							title: "Immutable Ledger Stream",
							description: "Real-time cryptographic trail of determinations, household splits, and cross-verifications.",
							action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								asChild: true,
								className: "h-7 text-xs text-muted-foreground hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/auditor/audit",
									children: "Inspect Full Ledger"
								})
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 divide-y divide-border/60",
							children: auditLogs.slice(0, 6).map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 first:pt-1 last:pb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-0.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 flex-wrap",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-xs text-foreground",
												children: log.action
											}),
											log.application && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-[11px] text-muted-foreground bg-muted/60 px-1.5 py-0.2 rounded border border-border/60",
												children: log.application
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] text-muted-foreground font-mono",
												children: ["by ", log.actor]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] text-muted-foreground truncate max-w-lg",
										children: [
											log.reason ? `${log.reason} · ` : "",
											log.prev,
											" → ",
											log.next
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 shrink-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[10px] text-muted-foreground",
										children: log.ts
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraBadge, {
										variant: "outline",
										className: "text-[9px] py-0 px-1 font-mono",
										children: "Verified"
									})]
								})]
							}, log.id))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/auditor/decisions",
								className: "rounded-xl border border-border/70 bg-card p-4 transition-all duration-150 hover:border-primary/40 hover:bg-muted/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-primary",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileLock, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3 text-muted-foreground/50" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "mt-2 text-xs font-semibold text-foreground",
										children: "Decision Sealing"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-[11px] text-muted-foreground",
										children: "Inspect cryptographic attestations"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/auditor/evidence",
								className: "rounded-xl border border-border/70 bg-card p-4 transition-all duration-150 hover:border-primary/40 hover:bg-muted/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-teal-600 dark:text-teal-400",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheckCorner, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3 text-muted-foreground/50" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "mt-2 text-xs font-semibold text-foreground",
										children: "Evidence Records"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-[11px] text-muted-foreground",
										children: "Inspect forensic proofs"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/auditor/rules",
								className: "rounded-xl border border-border/70 bg-card p-4 transition-all duration-150 hover:border-primary/40 hover:bg-muted/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollText, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3 text-muted-foreground/50" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "mt-2 text-xs font-semibold text-foreground",
										children: "Rule History Trace"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-[11px] text-muted-foreground",
										children: "Statutory version telemetry"
									})
								]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MiraCard, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraSectionHeader, {
							title: "Statutory Evidence Standard",
							description: "Legally admissible electronic evidence."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 space-y-2.5 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border/60 pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Evidence Act Section 65B:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-teal-600 dark:text-teal-400",
										children: "Compliant"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border/60 pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Hashing Algorithm:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-medium text-foreground",
										children: "SHA-256 Merkle"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border/60 pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Time Sync:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: "NTP Stratum-1 Verified"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between pb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Write Restriction:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-teal-600 dark:text-teal-400",
										children: "Strict Read-Only"
									})]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraCard, {
						className: "p-4.5 bg-muted/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4.5 w-4.5 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground block",
									children: "Independent Oversight Notice"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground leading-relaxed",
									children: "As an independent statutory auditor, your session is cryptographically attested. All audit queries and inspections are recorded in the secondary oversight trail."
								})]
							})]
						})
					})]
				})]
			})
		]
	});
}
var $$splitComponentImporter$46 = () => import("./auditor.decisions-BLqWOtzY.mjs");
var Route$49 = createFileRoute("/auditor/decisions")({
	head: () => ({ meta: [{ title: "Hashed Decisions & Entitlement Determinations — Auditor" }, {
		name: "description",
		content: "Cryptographically verified determinations, public certificates, and SHA-256 seal registry."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$46, "component")
});
var $$splitComponentImporter$45 = () => import("./auditor.evidence-CYoK4dhV.mjs");
var Route$48 = createFileRoute("/auditor/evidence")({
	head: () => ({ meta: [{ title: "Forensic Evidence Vault — Auditor" }, {
		name: "description",
		content: "Inspection of uploaded documents, version histories, and forensic file tokens."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$45, "component")
});
var $$splitComponentImporter$44 = () => import("./auditor.export-DdKGBnl1.mjs");
var Route$47 = createFileRoute("/auditor/export")({
	head: () => ({ meta: [{ title: "Cryptographic Evidence Export — Auditor" }, {
		name: "description",
		content: "Export verifiable cryptographic proofs and SHA-256 Merkle root bundles."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$44, "component")
});
var $$splitComponentImporter$43 = () => import("./auditor.inbox-BvdYvWoK.mjs");
var Route$46 = createFileRoute("/auditor/inbox")({
	head: () => ({ meta: [{ title: "Communications — Forensic Audit Authority" }, {
		name: "description",
		content: "Official messages, citizen clarifications, assignments and departmental correspondence."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$43, "component")
});
var $$splitComponentImporter$42 = () => import("./auditor.officers-BedVK4g5.mjs");
var Route$45 = createFileRoute("/auditor/officers")({
	head: () => ({ meta: [{ title: "Officer Activity & Integrity Oversight — Auditor" }, {
		name: "description",
		content: "Statutory oversight on officer determinations, override statistics, and SLA fidelity."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$42, "component")
});
var $$splitComponentImporter$41 = () => import("./auditor.reports-D3Bsjm3n.mjs");
var Route$44 = createFileRoute("/auditor/reports")({
	head: () => ({ meta: [{ title: "Statutory Audit Reports — Auditor" }, {
		name: "description",
		content: "CAG and statutory compliance reports, leak prevention estimates, and duplicate resolution audits."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$41, "component")
});
var $$splitComponentImporter$40 = () => import("./auditor.rules-DyRWXT4h.mjs");
var Route$43 = createFileRoute("/auditor/rules")({
	head: () => ({ meta: [{ title: "Eligibility Rules & Policy Audit — Auditor" }, {
		name: "description",
		content: "Forensic audit of eligibility criteria, rule engines, and version histories."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$40, "component")
});
var $$splitComponentImporter$39 = () => import("./auditor.settings-KjPOY7ME.mjs");
var Route$42 = createFileRoute("/auditor/settings")({
	head: () => ({ meta: [{ title: "Profile & Standards — Forensic Auditor" }, {
		name: "description",
		content: "Senior forensic auditor profile, CAG compliance benchmarks, and cryptographic verification parameters."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$39, "component")
});
var $$splitComponentImporter$38 = () => import("./citizen.benefits-ChSMP7_w.mjs");
var Route$41 = createFileRoute("/citizen/benefits")({
	head: () => ({ meta: [{ title: "Benefits and assistance — Mira" }, {
		name: "description",
		content: "View benefits available to your household and track support received."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$38, "component")
});
var $$splitComponentImporter$37 = () => import("./citizen.dashboard-De_ILIlY.mjs");
var Route$40 = createFileRoute("/citizen/dashboard")({
	head: () => ({ meta: [{ title: "Rajesh Sharma — Citizen Workspace · Mira" }, {
		name: "description",
		content: "Authoritative family record, scheme applications, verified civil documents, and entitlement services."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$37, "component")
});
var Route$39 = createFileRoute("/citizen/family")({
	head: () => ({ meta: [
		{ title: "My Family Record — Mira Unified Welfare Platform" },
		{
			name: "description",
			content: "Persistent household graph, data-driven family tree, chronological lifecycle timeline, and relationship evidence."
		},
		{
			property: "og:title",
			content: "My Family Record — Mira"
		}
	] }),
	component: FamilyPage
});
function FamilyPage() {
	const { state } = useApp();
	const queryClient = useQueryClient();
	const [isAddMemberOpen, setIsAddMemberOpen] = (0, import_react.useState)(false);
	const [isReportEventOpen, setIsReportEventOpen] = (0, import_react.useState)(false);
	const [isDisputeOpen, setIsDisputeOpen] = (0, import_react.useState)(false);
	const [selectedMemberHistory, setSelectedMemberHistory] = (0, import_react.useState)(null);
	const [newFirstName, setNewFirstName] = (0, import_react.useState)("");
	const [newLastName, setNewLastName] = (0, import_react.useState)("");
	const [newRelationship, setNewRelationship] = (0, import_react.useState)("CHILD");
	const [newDob, setNewDob] = (0, import_react.useState)("");
	const [newGender, setNewGender] = (0, import_react.useState)("Female");
	const [eventType, setEventType] = (0, import_react.useState)("BIRTH");
	const [eventDate, setEventDate] = (0, import_react.useState)("");
	const [eventPerson, setEventPerson] = (0, import_react.useState)("");
	const [eventDetails, setEventDetails] = (0, import_react.useState)("");
	const [eventCertNo, setEventCertNo] = (0, import_react.useState)("");
	const [disputeCategory, setDisputeCategory] = (0, import_react.useState)("Relationship Correction");
	const [disputeDesc, setDisputeDesc] = (0, import_react.useState)("");
	const [disputeDocRef, setDisputeDocRef] = (0, import_react.useState)("");
	const { data: familyData, isLoading, isError, error, refetch, isFetching } = useQuery({
		queryKey: ["my-family", state.session?.apiUserId],
		queryFn: () => fetchMyFamily(state.session),
		enabled: !!state.session,
		staleTime: 3e4
	});
	const addMemberMutation = useMutation({
		mutationFn: (payload) => addFamilyMember(state.session, payload),
		onSuccess: (newMember) => {
			queryClient.invalidateQueries({ queryKey: ["my-family"] });
			toast.success(`${newMember.name} added to family record`, { description: "Relationship recorded in household registry." });
			setIsAddMemberOpen(false);
			setNewFirstName("");
			setNewLastName("");
			setNewDob("");
		},
		onError: (err) => {
			toast.error(err.message || "Failed to add family member.");
		}
	});
	const reportEventMutation = useMutation({
		mutationFn: (payload) => reportLifeEvent(state.session, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["my-family"] });
			toast.success("Life event logged to timeline", { description: "Officer verification signal generated." });
			setIsReportEventOpen(false);
			setEventDetails("");
			setEventCertNo("");
			setEventPerson("");
		},
		onError: (err) => {
			toast.error(err.message || "Failed to report life event.");
		}
	});
	const disputeMutation = useMutation({
		mutationFn: (payload) => raiseFamilyDispute(state.session, payload),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["my-family"] });
			toast.success(`Dispute ${data.id} submitted`, { description: "Officer assigned for correction review." });
			setIsDisputeOpen(false);
			setDisputeDesc("");
			setDisputeDocRef("");
		},
		onError: (err) => {
			toast.error(err.message || "Failed to submit dispute.");
		}
	});
	const handleAddMemberSubmit = (e) => {
		e.preventDefault();
		if (!newFirstName.trim() || !newLastName.trim() || !newDob) {
			toast.error("Please fill in legal first name, last name, and date of birth.");
			return;
		}
		addMemberMutation.mutate({
			first_name: newFirstName.trim(),
			last_name: newLastName.trim(),
			relationship: newRelationship,
			date_of_birth: newDob,
			gender: newGender
		});
	};
	const handleReportEventSubmit = (e) => {
		e.preventDefault();
		if (!eventDate || !eventDetails.trim()) {
			toast.error("Please enter the effective date and details.");
			return;
		}
		reportEventMutation.mutate({
			event_type: eventType,
			effective_date: eventDate,
			person_name: eventPerson.trim(),
			details: eventDetails.trim(),
			certificate_no: eventCertNo.trim()
		});
	};
	const handleDisputeSubmit = (e) => {
		e.preventDefault();
		if (!disputeDesc.trim()) {
			toast.error("Please describe the dispute or correction requested.");
			return;
		}
		disputeMutation.mutate({
			category: disputeCategory,
			description: disputeDesc.trim(),
			document_reference: disputeDocRef.trim() || null
		});
	};
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "My Family Record",
			desc: "Loading verified household records from government database…"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex h-64 items-center justify-center rounded-xl border border-dashed bg-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-6 w-6 animate-spin text-gov" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-slate-600",
					children: "Fetching household graph and relationships…"
				})]
			})
		})]
	});
	if (isError || !familyData) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "My Family Record",
			desc: "Access your verified household graph and member relationships."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "mx-auto h-8 w-8 text-destructive" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-2 text-base font-semibold text-destructive",
					children: "Unable to load family records"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-slate-600",
					children: error instanceof Error ? error.message : "Connection failed."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => refetch(),
					variant: "outline",
					className: "mt-4",
					children: "Retry Connection"
				})
			]
		})]
	});
	const members = familyData.members || [];
	const relationships = familyData.relationships || [];
	const timeline = familyData.timeline || [];
	const headsAndSpouses = members.filter((m) => m.relationship === "HEAD" || m.relationship === "SPOUSE");
	const children = members.filter((m) => m.relationship === "CHILD");
	const dependentsAndOthers = members.filter((m) => m.relationship !== "HEAD" && m.relationship !== "SPOUSE" && m.relationship !== "CHILD");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
					title: "My Family Record",
					desc: "Authoritative household roster, data-driven family tree, and chronological timeline. All changes undergo human officer verification."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [familyData.is_demo_data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 rounded bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900 border border-amber-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-3.5 w-3.5 text-amber-700" }), familyData.disclaimer || ""]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => refetch(),
						disabled: isFetching,
						className: "h-8 gap-1 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}` }), "Refresh"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				title: "Household Overview",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b pb-4 mb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs uppercase font-mono text-muted-foreground tracking-wider",
							children: "HOUSEHOLD PUBLIC ID"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 mt-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-bold font-mono text-navy",
								children: familyData.household_public_id
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded bg-teal/15 text-teal text-xs font-semibold px-2 py-0.5",
								children: familyData.verification_status
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold text-slate-800 mt-1",
							children: familyData.household_name
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs uppercase font-mono text-muted-foreground tracking-wider",
							children: "HOUSEHOLD STATUS"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								t: "ok",
								children: familyData.status
							})
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs font-medium text-muted-foreground",
							children: "BPL Category"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-semibold text-slate-800 mt-0.5",
							children: familyData.bpl_status
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs font-medium text-muted-foreground",
							children: "Income Tier"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-semibold text-slate-800 mt-0.5",
							children: familyData.income_category
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs font-medium text-muted-foreground",
								children: "Verified Property"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "text-slate-800 mt-0.5 text-xs leading-relaxed",
								children: familyData.property_summary
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sm:col-span-2 lg:col-span-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs font-medium text-muted-foreground",
								children: "Current Residence Address"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "flex items-start gap-1.5 text-slate-800 mt-0.5 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: familyData.address })]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-slate-50 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-semibold text-navy",
					children: "Family Actions & Life Events"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Report births, marriages, or address changes. Consequential updates create officer review signals."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => setIsAddMemberOpen(true),
							className: "h-8 gap-1.5 text-xs bg-gov hover:bg-gov/90 text-white",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-3.5 w-3.5" }), "Add Family Member"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => setIsReportEventOpen(true),
							className: "h-8 gap-1.5 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5 text-slate-600" }), "Report Life Event"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => setIsDisputeOpen(true),
							className: "h-8 gap-1.5 text-xs text-amber-900 border-amber-300 hover:bg-amber-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-3.5 w-3.5 text-amber-700" }), "Raise Correction / Dispute"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "tree",
				className: "w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "grid w-full grid-cols-3 max-w-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "tree",
								children: "Family Tree"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "members",
								children: [
									"Members (",
									members.length,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "timeline",
								children: [
									"Timeline (",
									timeline.length,
									")"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "tree",
						className: "space-y-6 pt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
							title: "Data-Driven Family Tree & Relationships",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mb-6",
								children: "Relationships are computed dynamically from verifiable civil registry entries and verified relationships in the database."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-8",
								children: [
									dependentsAndOthers.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs uppercase font-mono tracking-wider font-semibold text-slate-500",
											children: "PARENTS & DEPENDENTS"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 border-t border-slate-200" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3",
										children: dependentsAndOthers.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-start justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm font-semibold text-navy",
													children: m.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs text-slate-500 font-mono mt-0.5",
													children: [
														m.public_id,
														" · DOB ",
														m.dob
													]
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700",
													children: m.relationship
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-teal font-medium flex items-center gap-1",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }),
														" Identity ",
														m.identity
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-500",
													children: m.gender
												})]
											})]
										}, m.id))
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs uppercase font-mono tracking-wider font-semibold text-gov",
											children: "HOUSEHOLD HEAD & SPOUSE"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 border-t border-slate-200" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
										children: headsAndSpouses.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg border-2 border-gov/30 bg-gov/5 p-4 shadow-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-start justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-base font-bold text-navy",
															children: m.name
														}), m.relationship === "HEAD" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "rounded bg-gov text-white text-[10px] font-bold px-1.5 py-0.5",
															children: "HEAD"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-xs text-slate-600 font-mono mt-0.5",
														children: [
															m.public_id,
															" · Born ",
															m.dob
														]
													}),
													m.income && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-xs text-slate-600 font-medium mt-1",
														children: ["Declared Income: ", m.income]
													})
												] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded bg-white/80 px-2 py-0.5 text-xs font-semibold text-gov border border-gov/20",
													children: m.relationship
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 flex items-center justify-between text-xs pt-2 border-t border-gov/10",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-teal font-medium flex items-center gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), " ID Verified"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-600",
													children: m.gender
												})]
											})]
										}, m.id))
									})] }),
									children.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs uppercase font-mono tracking-wider font-semibold text-teal",
											children: [
												"CHILDREN (",
												children.length,
												")"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 border-t border-slate-200" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3",
										children: children.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg border border-teal/20 bg-teal/5 p-3.5 shadow-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-start justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm font-semibold text-navy",
													children: m.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs text-slate-500 font-mono mt-0.5",
													children: [
														m.public_id,
														" · DOB ",
														m.dob
													]
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded bg-teal/15 px-2 py-0.5 text-[10px] font-semibold text-teal",
													children: "Child"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 flex items-center justify-between text-xs pt-2 border-t border-teal/10",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-teal font-medium flex items-center gap-1",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }),
														" Identity ",
														m.identity
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-500",
													children: m.gender
												})]
											})]
										}, m.id))
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-6 pt-4 border-t border-slate-200",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-xs font-semibold uppercase font-mono text-slate-500 tracking-wider mb-2",
											children: "VERIFIED RELATIONSHIPS GRAPH"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "overflow-x-auto rounded-lg border bg-white",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
												className: "w-full text-left text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
													className: "bg-slate-50 text-slate-600 border-b",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
															className: "p-3",
															children: "Person A"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
															className: "p-3",
															children: "Relationship"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
															className: "p-3",
															children: "Person B"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
															className: "p-3",
															children: "Valid From"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
															className: "p-3",
															children: "Verification"
														})
													] })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
													className: "divide-y text-slate-700",
													children: relationships.map((rel) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
														className: "hover:bg-slate-50/50",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "p-3 font-semibold text-navy",
																children: rel.person_a_name
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "p-3",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "rounded bg-slate-100 font-mono px-2 py-0.5 text-[11px] text-slate-800",
																	children: rel.relationship_type
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "p-3 font-semibold text-navy",
																children: rel.person_b_name
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "p-3 text-slate-500 font-mono",
																children: rel.valid_from || "—"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "p-3",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "rounded bg-teal/15 text-teal px-1.5 py-0.5 text-[10px] font-semibold",
																	children: rel.verification_status
																})
															})
														]
													}, rel.id))
												})]
											})
										})]
									})
								]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "members",
						className: "pt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y rounded-lg border bg-card",
							children: members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "grid gap-3 p-4 sm:grid-cols-[1.5fr_1fr_1fr_auto] sm:items-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold text-navy text-sm",
												children: m.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-700",
												children: m.public_id
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground mt-0.5",
											children: [
												m.relationship,
												" · Born ",
												m.dob,
												" · Gender: ",
												m.gender
											]
										}),
										m.income && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-slate-600 font-medium mt-0.5",
											children: ["Income: ", m.income]
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pill, {
											t: m.identity === "Verified" ? "ok" : "warn",
											children: ["ID: ", m.identity]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
											t: m.membership === "Active" ? "info" : "neutral",
											children: m.membership
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-slate-600",
										children: m.benefits?.length ? m.benefits.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "block text-teal font-medium",
											children: ["✓ ", b]
										}, b)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "No active sanctions"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "ghost",
										className: "text-xs",
										onClick: () => setSelectedMemberHistory(m),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "mr-1 h-3.5 w-3.5" }), "Details"]
									})
								]
							}, m.id))
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "timeline",
						className: "pt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
							title: "Family Lifecycle History (Chronological)",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mb-4",
								children: "Events are immutable records from civil registries and attested documents. Historical events are never deleted."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative pl-6 space-y-6 before:absolute before:bottom-0 before:top-2 before:left-2 before:w-0.5 before:bg-slate-200",
								children: timeline.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -left-6 top-1.5 h-3 w-3 rounded-full border-2 border-white bg-gov shadow-sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border bg-white p-4 shadow-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center justify-between gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-mono text-xs font-bold text-gov",
															children: item.date
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-800",
															children: item.event_type
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
															className: "text-sm font-semibold text-navy",
															children: item.title
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded bg-teal/15 px-2 py-0.5 text-[10px] font-semibold text-teal",
													children: item.verification_status
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-2 text-xs text-slate-700 leading-relaxed",
												children: item.description
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 flex flex-wrap items-center justify-between gap-2 border-t pt-2 text-[11px] text-muted-foreground",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Source: ", item.source] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Verified by: ", item.verified_by] }),
													item.evidence && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-mono",
														children: ["Ref: ", item.evidence]
													})
												]
											})
										]
									})]
								}, idx))
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isAddMemberOpen,
				onOpenChange: setIsAddMemberOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add Family Member" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
						"Record a new member in household ",
						familyData.household_public_id,
						". All added members persist in the relational database."
					] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleAddMemberSubmit,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "mem-first-name",
										children: "First Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "mem-first-name",
										placeholder: "e.g. Rohan",
										value: newFirstName,
										onChange: (e) => setNewFirstName(e.target.value),
										required: true
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "mem-last-name",
										children: "Last Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "mem-last-name",
										placeholder: "e.g. Sharma",
										value: newLastName,
										onChange: (e) => setNewLastName(e.target.value),
										required: true
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "mem-relationship",
									children: "Relationship to Head"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: newRelationship,
									onValueChange: setNewRelationship,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										id: "mem-relationship",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select relationship" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "CHILD",
											children: "Child (Son / Daughter)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "SPOUSE",
											children: "Spouse"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "PARENT",
											children: "Parent (Father / Mother)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "DEPENDENT",
											children: "Dependent / Relative"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "GUARDIAN",
											children: "Legal Guardian"
										})
									] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "mem-dob",
										children: "Date of Birth"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "mem-dob",
										type: "date",
										value: newDob,
										onChange: (e) => setNewDob(e.target.value),
										required: true
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "mem-gender",
										children: "Gender"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: newGender,
										onValueChange: setNewGender,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "mem-gender",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Gender" })
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
												children: "Other"
											})
										] })]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setIsAddMemberOpen(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "bg-gov hover:bg-gov/90 text-white",
								disabled: addMemberMutation.isPending,
								children: addMemberMutation.isPending ? "Adding…" : "Save to Household"
							})] })
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isReportEventOpen,
				onOpenChange: setIsReportEventOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Report Life Event" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Log a birth, marriage, divorce, or address change to the chronological family timeline." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleReportEventSubmit,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "ev-type",
									children: "Life Event Type"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: eventType,
									onValueChange: setEventType,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										id: "ev-type",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Event type" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "BIRTH",
											children: "Birth of Child"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "MARRIAGE",
											children: "Marriage"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "DIVORCE",
											children: "Divorce / Separation"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "DEATH",
											children: "Death of Family Member"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "ADDRESS_CHANGE",
											children: "Change of Residence"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "ADOPTION",
											children: "Adoption / Guardianship"
										})
									] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "ev-date",
										children: "Effective Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "ev-date",
										type: "date",
										value: eventDate,
										onChange: (e) => setEventDate(e.target.value),
										required: true
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "ev-person",
										children: "Subject Person (Optional)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "ev-person",
										placeholder: "e.g. Rohan Sharma",
										value: eventPerson,
										onChange: (e) => setEventPerson(e.target.value)
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "ev-cert",
									children: "Certificate / Registration No."
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "ev-cert",
									placeholder: "e.g. BR-2026-9041",
									value: eventCertNo,
									onChange: (e) => setEventCertNo(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "ev-details",
									children: "Event Details"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "ev-details",
									placeholder: "Provide details of civil registry or municipal registration…",
									value: eventDetails,
									onChange: (e) => setEventDetails(e.target.value),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setIsReportEventOpen(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "bg-gov hover:bg-gov/90 text-white",
								disabled: reportEventMutation.isPending,
								children: reportEventMutation.isPending ? "Submitting…" : "Record Life Event"
							})] })
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isDisputeOpen,
				onOpenChange: setIsDisputeOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Raise Record Correction or Dispute" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Submit an official correction for misspelled names, erroneous relationships, or address conflicts." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleDisputeSubmit,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "disp-category",
									children: "Category"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: disputeCategory,
									onValueChange: setDisputeCategory,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										id: "disp-category",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Category" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Relationship Correction",
											children: "Relationship Correction"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Address Correction",
											children: "Address Discrepancy"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Identity Mismatch",
											children: "Name / DOB Spelling Error"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "Duplicate Clarification",
											children: "Duplicate Claim Clarification"
										})
									] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "disp-doc",
									children: "Supporting Document Ref (Optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "disp-doc",
									placeholder: "e.g. DOC-ELEC-2026 or Certificate No.",
									value: disputeDocRef,
									onChange: (e) => setDisputeDocRef(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "disp-desc",
									children: "Explanation"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "disp-desc",
									placeholder: "Detail the correct information and evidence provided…",
									value: disputeDesc,
									onChange: (e) => setDisputeDesc(e.target.value),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setIsDisputeOpen(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "bg-amber-800 hover:bg-amber-900 text-white",
								disabled: disputeMutation.isPending,
								children: disputeMutation.isPending ? "Submitting…" : "Submit Dispute"
							})] })
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!selectedMemberHistory,
				onOpenChange: (open) => !open && setSelectedMemberHistory(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: selectedMemberHistory?.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: ["Member Public ID: ", selectedMemberHistory?.public_id] })] }),
						selectedMemberHistory && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Relationship:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-navy",
										children: selectedMemberHistory.relationship
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Date of Birth:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-navy",
										children: selectedMemberHistory.dob
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Gender:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-navy",
										children: selectedMemberHistory.gender
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Identity Status:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-teal",
										children: selectedMemberHistory.identity
									})] })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-slate-600",
								children: [
									"All civil registry connections for this individual are verified under Household",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono",
										children: familyData.household_public_id
									}),
									"."
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setSelectedMemberHistory(null),
							children: "Close"
						}) })
					]
				})
			})
		]
	});
}
var $$splitComponentImporter$36 = () => import("./citizen.grievances-DqrjmeQ4.mjs");
var Route$38 = createFileRoute("/citizen/grievances")({
	head: () => ({ meta: [
		{ title: "Grievances — Citizen" },
		{
			name: "description",
			content: "Raise and track grievances about applications and services."
		},
		{
			property: "og:title",
			content: "Grievances"
		},
		{
			property: "og:description",
			content: "Raise and track grievances."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$36, "component")
});
var $$splitComponentImporter$35 = () => import("./citizen.inbox-6xYg3bkZ.mjs");
var Route$37 = createFileRoute("/citizen/inbox")({
	head: () => ({ meta: [{ title: "Communications — Citizen Portal" }, {
		name: "description",
		content: "Official messages, citizen clarifications, assignments and departmental correspondence."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$35, "component")
});
var $$splitComponentImporter$34 = () => import("./citizen.notifications-CzioA_VS.mjs");
var Route$36 = createFileRoute("/citizen/notifications")({
	head: () => ({ meta: [
		{ title: "Notifications — Citizen" },
		{
			name: "description",
			content: "Updates about your applications and records."
		},
		{
			property: "og:title",
			content: "Notifications"
		},
		{
			property: "og:description",
			content: "Your application and record updates."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$34, "component")
});
var $$splitComponentImporter$33 = () => import("./citizen.settings-BmoeuhGA.mjs");
var Route$35 = createFileRoute("/citizen/settings")({
	head: () => ({ meta: [{ title: "Profile & Account — Citizen" }, {
		name: "description",
		content: "Citizen profile, authenticated identity, connected government records, and preferences."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$33, "component")
});
var $$splitComponentImporter$32 = () => import("./department.applications-DuSO7glU.mjs");
var Route$34 = createFileRoute("/department/applications")({
	head: () => ({ meta: [{ title: "Department Applications Console — Administrator" }, {
		name: "description",
		content: "Department-wide application oversight and triage."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$32, "component")
});
var $$splitComponentImporter$31 = () => import("./department.audit-_RJKNDxE.mjs");
var Route$33 = createFileRoute("/department/audit")({
	head: () => ({ meta: [
		{ title: "Audit Logs — Department" },
		{
			name: "description",
			content: "Append-only audit trail of all platform actions."
		},
		{
			property: "og:title",
			content: "Department Audit Logs"
		},
		{
			property: "og:description",
			content: "Audit trail."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$31, "component")
});
var Route$32 = createFileRoute("/department/dashboard")({
	head: () => ({ meta: [{ title: "System & Department Administration · Mira" }, {
		name: "description",
		content: "Scheme administration, rule versions, department configurations, and system-wide audit telemetry."
	}] }),
	component: DepartmentDashboardPage
});
var FUTURE_CAPABILITIES = [
	{
		icon: Clock3,
		name: "Entitlement Time Machine",
		text: "Reconstruct what a household was entitled to on any past date, using the rule version in force at that specific historical timestamp."
	},
	{
		icon: Scale,
		name: "Fair Decision Guardian",
		text: "Review officer determinations for parity and demographic consistency across similar cases, flagging statistical outliers."
	},
	{
		icon: Waves,
		name: "Decision Ripple Engine",
		text: "Model downstream cross-scheme impacts when a central family record mutates (e.g. household split, birth, or civil death record)."
	},
	{
		icon: FlaskConical,
		name: "Policy Crash-Test Lab",
		text: "Simulate proposed legislative rule changes against millions of anonymized records before gazetting a new statutory version."
	}
];
function DepartmentDashboardPage() {
	const { state } = useApp();
	const [selectedSim, setSelectedSim] = (0, import_react.useState)(null);
	const activeSchemesCount = SCHEMES.length;
	const ruleVersionsCount = state.ruleVersions?.length || 8;
	const openAlertsCount = state.alerts?.filter((a) => a.status === "Open").length || 3;
	const auditEventsCount = state.audit?.length || 24;
	const adminName = state.session?.name || "Arjun Mehta";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-7 pb-12 animate-in fade-in duration-200",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraPageHeader, {
				context: "System Authority",
				title: "Administration",
				description: `${adminName} · Department of Welfare Services & Entitlements · Statutory Schema Authority`,
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						asChild: true,
						className: "h-8.5 rounded-lg border-border/80 bg-background/80 px-3.5 text-xs font-medium shadow-2xs hover:bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/department/rules",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "mr-1.5 h-3.5 w-3.5 text-muted-foreground" }), "Rule Engine"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						asChild: true,
						className: "h-8.5 rounded-lg bg-primary px-3.5 text-xs font-medium text-primary-foreground shadow-2xs hover:bg-primary/95",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/department/schemes",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheckCorner, { className: "mr-1.5 h-3.5 w-3.5" }),
								"Manage Schemes (",
								activeSchemesCount,
								")"
							]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraStatCard, {
						title: "Active Schemes",
						value: activeSchemesCount,
						subtext: "Centrally administered",
						icon: Building2,
						trend: {
							label: "Operational",
							tone: "positive"
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraStatCard, {
						title: "Rule Versions",
						value: ruleVersionsCount,
						subtext: "Versioned logic trees",
						icon: Layers,
						trend: {
							label: "Immutable",
							tone: "positive"
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraStatCard, {
						title: "Open Anomaly Alerts",
						value: openAlertsCount,
						subtext: "Duplicate or criteria signals",
						icon: TriangleAlert,
						trend: {
							label: openAlertsCount > 0 ? "Under Review" : "Clear",
							tone: openAlertsCount > 0 ? "warning" : "positive"
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraStatCard, {
						title: "System Audit Events",
						value: auditEventsCount,
						subtext: "Cryptographic trail",
						icon: History,
						trend: {
							label: "Live Telemetry",
							tone: "neutral"
						}
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MiraCard, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraSectionHeader, {
							title: "Recent Rule Engine Updates",
							description: "Chronological log of versioned eligibility criteria and effective statutory dates.",
							action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								asChild: true,
								className: "h-7 text-xs text-muted-foreground hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/department/rules",
									children: "View all versions"
								})
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 divide-y divide-border/60",
							children: [...state.ruleVersions].reverse().slice(0, 5).map((rule) => {
								const scheme = SCHEMES.find((s) => s.id === rule.schemeId);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3 first:pt-1 last:pb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-0.5 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-xs font-semibold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/20",
												children: rule.version
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-medium text-foreground truncate",
												children: scheme?.name || "Global Rule Group"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] text-muted-foreground",
											children: [
												rule.reason,
												" · Effective from ",
												rule.effective
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center gap-2 shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraStatus, { status: "Active" })
									})]
								}, rule.version + rule.schemeId);
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MiraCard, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraSectionHeader, {
							title: "Statutory Simulation Engines",
							description: "Policy experimentation, decision parity, and temporal entitlement reconstruction."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 grid gap-3 sm:grid-cols-2",
							children: FUTURE_CAPABILITIES.map((cap) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setSelectedSim(cap),
								className: "group flex gap-3 rounded-xl border border-border/70 bg-card p-3.5 text-left transition-all duration-150 hover:border-primary/40 hover:bg-muted/30",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-foreground group-hover:text-primary transition-colors",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(cap.icon, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold text-foreground tracking-tight",
										children: cap.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraBadge, {
										variant: "outline",
										className: "text-[9px] py-0 px-1 font-mono",
										children: "Statutory Lab"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-[11px] text-muted-foreground line-clamp-2 leading-relaxed",
									children: cap.text
								})] })]
							}, cap.name))
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MiraCard, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraSectionHeader, {
							title: "System Health & Connectivity",
							description: "Enterprise backend services status."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 space-y-2.5 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border/60 pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "PostgreSQL 18 Engine:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-teal-600 dark:text-teal-400",
										children: "Online · Port 5433"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border/60 pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Rust Microservices (Axum):"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-teal-600 dark:text-teal-400",
										children: "Healthy · Port 4000"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border/60 pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Deterministic Seeding:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-teal-600 dark:text-teal-400",
										children: "V4 Active"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between pb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Cross-Scheme Duplicate Index:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-teal-600 dark:text-teal-400",
										children: "Synched"
									})]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraCard, {
						className: "p-4.5 bg-muted/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4.5 w-4.5 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground block",
									children: "Statutory Rule Governance"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground leading-relaxed",
									children: "Modifications to active scheme thresholds require cryptographic co-signatures and automatic version increments to guarantee retrospective determinations remain auditable."
								})]
							})]
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!selectedSim,
				onOpenChange: (open) => !open && setSelectedSim(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "text-base font-semibold",
						children: selectedSim?.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-xs",
						children: "Autonomous statutory telemetry module."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 pt-2 text-xs leading-relaxed text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: selectedSim?.text }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground",
							children: "The platform records immutable versioned rules, household lineage graphs, and an append-only audit trail, which this capability leverages."
						})]
					})]
				})
			})
		]
	});
}
var $$splitComponentImporter$30 = () => import("./department.departments-BJvdKtne.mjs");
var Route$31 = createFileRoute("/department/departments")({
	head: () => ({ meta: [{ title: "Directorate & Jurisdictional Directory — Department" }, {
		name: "description",
		content: "Directory of state directorates, district welfare offices, and block nodes."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$30, "component")
});
var $$splitComponentImporter$29 = () => import("./department.inbox-oVf-Ev9F.mjs");
var Route$30 = createFileRoute("/department/inbox")({
	head: () => ({ meta: [{ title: "Communications — Department Administration" }, {
		name: "description",
		content: "Official messages, citizen clarifications, assignments and departmental correspondence."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$29, "component")
});
var $$splitComponentImporter$28 = () => import("./department.integrations-BCssp2u6.mjs");
var Route$29 = createFileRoute("/department/integrations")({
	head: () => ({ meta: [
		{ title: "Department Integrations" },
		{
			name: "description",
			content: "Source registries linked to the platform."
		},
		{
			property: "og:title",
			content: "Department Integrations"
		},
		{
			property: "og:description",
			content: "Linked record sources."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$28, "component")
});
var $$splitComponentImporter$27 = () => import("./department.notifications-C-95t3Hc.mjs");
var Route$28 = createFileRoute("/department/notifications")({
	head: () => ({ meta: [{ title: "System Notices & Alerts — Department" }, {
		name: "description",
		content: "Department notifications, queue alerts, and statutory bulletins."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$27, "component")
});
var $$splitComponentImporter$26 = () => import("./department.operations-DpY5jM_3.mjs");
var Route$27 = createFileRoute("/department/operations")({
	head: () => ({ meta: [{ title: "Operations & Queue Health — Department" }, {
		name: "description",
		content: "Real-time queue health, SLA breaches, bottleneck analysis, and load distribution."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
var $$splitComponentImporter$25 = () => import("./department.reports-BaihANV2.mjs");
var Route$26 = createFileRoute("/department/reports")({
	head: () => ({ meta: [
		{ title: "Reports — Department" },
		{
			name: "description",
			content: "Application and duplicate alert reports."
		},
		{
			property: "og:title",
			content: "Department Reports"
		},
		{
			property: "og:description",
			content: "Department reports."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("./department.settings-DX1PwiNP.mjs");
var Route$25 = createFileRoute("/department/settings")({
	head: () => ({ meta: [{ title: "System Configuration — Department Administration" }, {
		name: "description",
		content: "Department-wide governance, SLA thresholds, cross-registry synchronization, and cryptographic ledger parameters."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var $$splitComponentImporter$23 = () => import("./department.workflow-CTsQAwdF.mjs");
var Route$24 = createFileRoute("/department/workflow")({
	head: () => ({ meta: [{ title: "Workflow & Lifecycle Configurator — Department" }, {
		name: "description",
		content: "Stage gating, automated verification triggers, and supervisor routing rules."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("./officer.audit-DLW1sKBC.mjs");
var Route$23 = createFileRoute("/officer/audit")({
	head: () => ({ meta: [
		{ title: "Audit Logs — Officer" },
		{
			name: "description",
			content: "Immutable activity history of all actions."
		},
		{
			property: "og:title",
			content: "Audit Logs"
		},
		{
			property: "og:description",
			content: "Activity history."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./officer.dashboard-ro1OyTp3.mjs");
var Route$22 = createFileRoute("/officer/dashboard")({
	head: () => ({ meta: [
		{ title: "Officer Dashboard" },
		{
			name: "description",
			content: "Pending applications, verification and duplicate alerts."
		},
		{
			property: "og:title",
			content: "Officer Dashboard"
		},
		{
			property: "og:description",
			content: "Officer workload overview."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./officer.documents-BReQEbvm.mjs");
var Route$21 = createFileRoute("/officer/documents")({
	head: () => ({ meta: [{ title: "Documents — Mira" }, {
		name: "description",
		content: "Private citizen documents available to your authorized review scope."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./officer.duplicates-Dey6PIT5.mjs");
var Route$20 = createFileRoute("/officer/duplicates")({
	head: () => ({ meta: [
		{ title: "Duplicate Alerts — Officer" },
		{
			name: "description",
			content: "Compare current applications against existing benefit records."
		},
		{
			property: "og:title",
			content: "Duplicate Alerts"
		},
		{
			property: "og:description",
			content: "Possible duplicate household claims."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./officer.evidence-PxYgFioI.mjs");
var Route$19 = createFileRoute("/officer/evidence")({
	head: () => ({ meta: [{ title: "Evidence & Document Vault — Officer Workspace" }, {
		name: "description",
		content: "Versioned document repository, citizen uploads, and geotagged field evidence."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./officer.field-visits-BNpoiYEx.mjs");
var Route$18 = createFileRoute("/officer/field-visits")({
	head: () => ({ meta: [{ title: "Field Visits — Field Official Operations" }, {
		name: "description",
		content: "Field inspections, on-site geotagged verification, and physical dwelling audits."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./officer.inbox-Bl8khedE.mjs");
var Route$17 = createFileRoute("/officer/inbox")({
	head: () => ({ meta: [{ title: "Communications — Field Operational Workspace" }, {
		name: "description",
		content: "Official messages, citizen clarifications, assignments and departmental correspondence."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./officer.notifications-Cs3lQGJW.mjs");
var Route$16 = createFileRoute("/officer/notifications")({
	head: () => ({ meta: [
		{ title: "Notifications — Officer" },
		{
			name: "description",
			content: "Recent activity requiring officer attention."
		},
		{
			property: "og:title",
			content: "Officer Notifications"
		},
		{
			property: "og:description",
			content: "Officer alerts."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./officer.reports-BeessvIe.mjs");
var Route$15 = createFileRoute("/officer/reports")({
	head: () => ({ meta: [
		{ title: "Reports — Officer" },
		{
			name: "description",
			content: "Operational reports for applications."
		},
		{
			property: "og:title",
			content: "Officer Reports"
		},
		{
			property: "og:description",
			content: "Application reports."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./officer.settings-D2i9bKaL.mjs");
var Route$14 = createFileRoute("/officer/settings")({
	head: () => ({ meta: [{ title: "Profile & Field Operations — Field Official" }, {
		name: "description",
		content: "Field verification officer identity, GPS tracking status, and offline route sync."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./officer.verification-CmEVduZy.mjs");
var Route$13 = createFileRoute("/officer/verification")({
	head: () => ({ meta: [
		{ title: "Verification Queue — Officer" },
		{
			name: "description",
			content: "Applications that need record or document verification."
		},
		{
			property: "og:title",
			content: "Verification Queue"
		},
		{
			property: "og:description",
			content: "Applications needing verification."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./officer_.login-FS7vYBW-.mjs");
var Route$12 = createFileRoute("/officer_/login")({
	head: () => ({ meta: [
		{ title: "Officer access — Mira" },
		{
			name: "description",
			content: "Authorized government officer demo sign-in for application review and document verification."
		},
		{
			property: "og:title",
			content: "Officer access — Mira"
		},
		{
			property: "og:description",
			content: "Government officer access to verification, applications and citizen services."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./verifier.audit-DYZHoktd.mjs");
var Route$11 = createFileRoute("/verifier/audit")({
	head: () => ({ meta: [{ title: "Audit Ledger — Verifier Workstation" }, {
		name: "description",
		content: "Cryptographic activity ledger for verification officer determinations."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var Route$10 = createFileRoute("/verifier/dashboard")({
	head: () => ({ meta: [{ title: "Verification Workstation — Vikram Malhotra · Mira" }, {
		name: "description",
		content: "High-density verification operations console, mismatch resolution, and determination queue."
	}] }),
	component: VerifierDashboardPage
});
function VerifierDashboardPage() {
	const { state } = useApp();
	const queueApps = state.applications.filter((a) => a.status === "Documents Under Review" || a.status === "Verification Required" || a.status === "Officer Review" || a.status === "Additional Evidence Required");
	const mismatches = state.applications.filter((a) => a.mismatch);
	const verifierName = state.session?.name || "Vikram Malhotra";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-7 pb-12 animate-in fade-in duration-200",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraPageHeader, {
				context: "Verification Officer",
				title: "Verification",
				description: `${verifierName} · Direct Jurisdictional Operations (Chandauli & Lucknow Sector) · Cryptographic Audit Ledger`,
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						asChild: true,
						className: "h-8.5 rounded-lg border-border/80 bg-background/80 px-3.5 text-xs font-medium shadow-2xs hover:bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/verifier/evidence",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "mr-1.5 h-3.5 w-3.5 text-muted-foreground" }), "Evidence Explorer"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						asChild: true,
						className: "h-8.5 rounded-lg bg-primary px-3.5 text-xs font-medium text-primary-foreground shadow-2xs hover:bg-primary/95",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/verifier/queue",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "mr-1.5 h-3.5 w-3.5" }),
								"Active Queue (",
								queueApps.length,
								")"
							]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraStatCard, {
						title: "Pending Reviews",
						value: queueApps.length,
						subtext: "Assigned for cross-verification",
						icon: ListChecks,
						trend: {
							label: "Active Queue",
							tone: "neutral"
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraStatCard, {
						title: "Active Mismatches",
						value: mismatches.length,
						subtext: "Registry discrepancies found",
						icon: TriangleAlert,
						trend: {
							label: "Requires Action",
							tone: mismatches.length > 0 ? "warning" : "positive"
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraStatCard, {
						title: "Mean Turnaround (SLA)",
						value: "14.2h",
						subtext: "Within 48h statutory deadline",
						icon: Clock,
						trend: {
							label: "98.4% On-time",
							tone: "positive"
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraStatCard, {
						title: "Completed Verification",
						value: "184",
						subtext: "This month · 100% audited",
						icon: ShieldCheck,
						trend: {
							label: "Chain Sealed",
							tone: "positive"
						}
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MiraCard, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraSectionHeader, {
							title: "Priority Applications",
							description: "Awaiting primary document cross-check and field correlation.",
							action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								asChild: true,
								className: "h-7 text-xs text-muted-foreground hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/verifier/queue",
									children: [
										"Open Full Queue (",
										queueApps.length,
										")"
									]
								})
							})
						}), queueApps.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraEmptyState, {
							icon: CircleCheck,
							title: "Queue is all clear",
							description: "All assigned verification cases have been determined or routed for decision."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 divide-y divide-border/60",
							children: queueApps.slice(0, 5).map((app) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 first:pt-1 last:pb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1 min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 flex-wrap",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-xs font-semibold text-primary",
													children: app.id
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraStatus, { status: app.status }),
												app.duplicate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-400 border border-amber-500/20",
													children: "Duplicate Alert"
												}),
												app.mismatch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold text-destructive border border-destructive/20",
													children: "Data Mismatch"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 text-xs font-medium text-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: app.applicant }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "·"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono text-muted-foreground",
													children: app.householdId
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] text-muted-foreground",
											children: [
												getScheme(app.schemeId)?.name || "Welfare Assistance Scheme",
												" · Updated ",
												fmtDate(app.updatedOn)
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-2 shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										asChild: true,
										className: "h-7.5 text-xs font-medium rounded-lg",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/verifier/applications/$id",
											params: { id: app.id },
											children: ["Inspect Case", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 h-3 w-3" })]
										})
									})
								})]
							}, app.id))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-3 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/verifier/mismatches",
								className: "rounded-xl border border-border/70 bg-card p-4 transition-all duration-150 hover:border-primary/40 hover:bg-muted/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-amber-600 dark:text-amber-400",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3 text-muted-foreground/50" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "mt-2 text-xs font-semibold text-foreground",
										children: "Mismatch Resolution"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-[11px] text-muted-foreground",
										children: "Resolve discrepancy claims"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/verifier/evidence",
								className: "rounded-xl border border-border/70 bg-card p-4 transition-all duration-150 hover:border-primary/40 hover:bg-muted/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-primary",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheckCorner, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3 text-muted-foreground/50" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "mt-2 text-xs font-semibold text-foreground",
										children: "Document OCR Vault"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-[11px] text-muted-foreground",
										children: "Inspect cryptographic attestations"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/verifier/audit",
								className: "rounded-xl border border-border/70 bg-card p-4 transition-all duration-150 hover:border-primary/40 hover:bg-muted/30",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-teal-600 dark:text-teal-400",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3 text-muted-foreground/50" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "mt-2 text-xs font-semibold text-foreground",
										children: "Audit Trail"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-[11px] text-muted-foreground",
										children: "Officer determination ledger"
									})
								]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MiraCard, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraSectionHeader, {
							title: "Active Cross-Check Registries",
							description: "Statutory live verification sync."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 space-y-2.5 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border/60 pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "UIDAI Aadhaar Vault:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center text-teal-600 dark:text-teal-400 font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-1 h-3 w-3" }), " Connected"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border/60 pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "State Land Records (Bhulekh):"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center text-teal-600 dark:text-teal-400 font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-1 h-3 w-3" }), " Live Sync"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border/60 pb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Revenue Dept (Income Registry):"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center text-teal-600 dark:text-teal-400 font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-1 h-3 w-3" }), " Live Sync"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between pb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Public Distribution (NFSA):"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center text-teal-600 dark:text-teal-400 font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-1 h-3 w-3" }), " Live Sync"]
									})]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraCard, {
						className: "p-4.5 bg-muted/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-4.5 w-4.5 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground block",
									children: "Verifier Statutory Guidance"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-muted-foreground leading-relaxed",
									children: "Section 14(2) of Public Verification Act requires all adverse determinations to record a reasoned note citing the exact registry discrepancy. No application may be rejected without at least one citizen opportunity to furnish clarifying evidence."
								})]
							})]
						})
					})]
				})]
			})
		]
	});
}
var $$splitComponentImporter$9 = () => import("./verifier.documents-h05T0GRS.mjs");
var Route$9 = createFileRoute("/verifier/documents")({
	head: () => ({ meta: [{ title: "Document Comparison Tool — Verifier Workstation" }, {
		name: "description",
		content: "Side-by-side OCR and registry comparison workstation."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./verifier.escalations-CkInHrma.mjs");
var Route$8 = createFileRoute("/verifier/escalations")({
	head: () => ({ meta: [{ title: "Escalations & Flags — Verifier Workstation" }, {
		name: "description",
		content: "High-risk cases, policy ambiguities, and supervisor reviews."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./verifier.evidence-EKeDIhAm.mjs");
var Route$7 = createFileRoute("/verifier/evidence")({
	head: () => ({ meta: [{ title: "Evidence Vault — Verifier Workstation" }, {
		name: "description",
		content: "Versioned inspection media, document uploads, and biometric audit tokens."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./verifier.inbox-ChY1WOPq.mjs");
var Route$6 = createFileRoute("/verifier/inbox")({
	head: () => ({ meta: [{ title: "Communications — Verifier Workstation" }, {
		name: "description",
		content: "Official messages, citizen clarifications, assignments and departmental correspondence."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./verifier.mismatches-53TSnqg2.mjs");
var Route$5 = createFileRoute("/verifier/mismatches")({
	head: () => ({ meta: [{ title: "Mismatch Resolution — Verifier Workstation" }, {
		name: "description",
		content: "Triage and resolve cross-registry data mismatches and citizen explanations."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./verifier.queue-BQ0UU9AU.mjs");
var Route$4 = createFileRoute("/verifier/queue")({
	head: () => ({ meta: [{ title: "Verification Queue — Verifier Workstation" }, {
		name: "description",
		content: "High-density queue of welfare applications awaiting verification."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./verifier.settings-D98O7ETC.mjs");
var Route$3 = createFileRoute("/verifier/settings")({
	head: () => ({ meta: [{ title: "Profile & Workstation — Verification Officer" }, {
		name: "description",
		content: "Verification officer identity, workstation parameters, and cryptographic token status."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./citizen.applications.index-C2C6dmoo.mjs");
var Route$2 = createFileRoute("/citizen/applications/")({
	head: () => ({ meta: [
		{ title: "My Applications — Citizen" },
		{
			name: "description",
			content: "All scheme applications for your household with current stage."
		},
		{
			property: "og:title",
			content: "My Applications"
		},
		{
			property: "og:description",
			content: "Track all your applications."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./department.schemes.index-CbNCvxt1.mjs");
var Route$1 = createFileRoute("/department/schemes/")({
	head: () => ({ meta: [
		{ title: "Manage Schemes — Department" },
		{
			name: "description",
			content: "Configure schemes, eligibility basis, documents and workflow."
		},
		{
			property: "og:title",
			content: "Manage Schemes"
		},
		{
			property: "og:description",
			content: "Scheme administration."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./officer.applications.index-DHCoObpe.mjs");
var Route = createFileRoute("/officer/applications/")({
	head: () => ({ meta: [
		{ title: "Applications — Officer" },
		{
			name: "description",
			content: "All applications assigned to your office."
		},
		{
			property: "og:title",
			content: "Applications"
		},
		{
			property: "og:description",
			content: "Officer application list."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$58.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$59
});
var AuditorRoute = Route$57.update({
	id: "/auditor",
	path: "/auditor",
	getParentRoute: () => Route$59
});
var CitizenRoute = Route$56.update({
	id: "/citizen",
	path: "/citizen",
	getParentRoute: () => Route$59
});
var DepartmentRoute = Route$55.update({
	id: "/department",
	path: "/department",
	getParentRoute: () => Route$59
});
var EligibilityRoute = Route$65.update({
	id: "/eligibility",
	path: "/eligibility",
	getParentRoute: () => Route$59
});
var HelpRoute = Route$66.update({
	id: "/help",
	path: "/help",
	getParentRoute: () => Route$59
});
var LoginRoute = Route$70.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$59
});
var OfficerRoute = Route$54.update({
	id: "/officer",
	path: "/officer",
	getParentRoute: () => Route$59
});
var TrackRoute = Route$71.update({
	id: "/track",
	path: "/track",
	getParentRoute: () => Route$59
});
var VerifierRoute = Route$53.update({
	id: "/verifier",
	path: "/verifier",
	getParentRoute: () => Route$59
});
var AuditorApplicationsRoute = Route$52.update({
	id: "/applications",
	path: "/applications",
	getParentRoute: () => AuditorRoute
});
var AuditorAuditRoute = Route$51.update({
	id: "/audit",
	path: "/audit",
	getParentRoute: () => AuditorRoute
});
var AuditorDashboardRoute = Route$50.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuditorRoute
});
var AuditorDecisionsRoute = Route$49.update({
	id: "/decisions",
	path: "/decisions",
	getParentRoute: () => AuditorRoute
});
var AuditorEvidenceRoute = Route$48.update({
	id: "/evidence",
	path: "/evidence",
	getParentRoute: () => AuditorRoute
});
var AuditorExportRoute = Route$47.update({
	id: "/export",
	path: "/export",
	getParentRoute: () => AuditorRoute
});
var AuditorInboxRoute = Route$46.update({
	id: "/inbox",
	path: "/inbox",
	getParentRoute: () => AuditorRoute
});
var AuditorOfficersRoute = Route$45.update({
	id: "/officers",
	path: "/officers",
	getParentRoute: () => AuditorRoute
});
var AuditorReportsRoute = Route$44.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => AuditorRoute
});
var AuditorRulesRoute = Route$43.update({
	id: "/rules",
	path: "/rules",
	getParentRoute: () => AuditorRoute
});
var AuditorSettingsRoute = Route$42.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AuditorRoute
});
var CitizenBenefitsRoute = Route$41.update({
	id: "/benefits",
	path: "/benefits",
	getParentRoute: () => CitizenRoute
});
var CitizenDashboardRoute = Route$40.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => CitizenRoute
});
var CitizenDocumentsRoute = Route$62.update({
	id: "/documents",
	path: "/documents",
	getParentRoute: () => CitizenRoute
});
var CitizenFamilyRoute = Route$39.update({
	id: "/family",
	path: "/family",
	getParentRoute: () => CitizenRoute
});
var CitizenGrievancesRoute = Route$38.update({
	id: "/grievances",
	path: "/grievances",
	getParentRoute: () => CitizenRoute
});
var CitizenInboxRoute = Route$37.update({
	id: "/inbox",
	path: "/inbox",
	getParentRoute: () => CitizenRoute
});
var CitizenNotificationsRoute = Route$36.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => CitizenRoute
});
var CitizenSettingsRoute = Route$35.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => CitizenRoute
});
var DepartmentApplicationsRoute = Route$34.update({
	id: "/applications",
	path: "/applications",
	getParentRoute: () => DepartmentRoute
});
var DepartmentAuditRoute = Route$33.update({
	id: "/audit",
	path: "/audit",
	getParentRoute: () => DepartmentRoute
});
var DepartmentDashboardRoute = Route$32.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => DepartmentRoute
});
var DepartmentDepartmentsRoute = Route$31.update({
	id: "/departments",
	path: "/departments",
	getParentRoute: () => DepartmentRoute
});
var DepartmentInboxRoute = Route$30.update({
	id: "/inbox",
	path: "/inbox",
	getParentRoute: () => DepartmentRoute
});
var DepartmentIntegrationsRoute = Route$29.update({
	id: "/integrations",
	path: "/integrations",
	getParentRoute: () => DepartmentRoute
});
var DepartmentNotificationsRoute = Route$28.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => DepartmentRoute
});
var DepartmentOperationsRoute = Route$27.update({
	id: "/operations",
	path: "/operations",
	getParentRoute: () => DepartmentRoute
});
var DepartmentReportsRoute = Route$26.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => DepartmentRoute
});
var DepartmentRulesRoute = Route$63.update({
	id: "/rules",
	path: "/rules",
	getParentRoute: () => DepartmentRoute
});
var DepartmentSettingsRoute = Route$25.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => DepartmentRoute
});
var DepartmentWorkflowRoute = Route$24.update({
	id: "/workflow",
	path: "/workflow",
	getParentRoute: () => DepartmentRoute
});
var OfficerAuditRoute = Route$23.update({
	id: "/audit",
	path: "/audit",
	getParentRoute: () => OfficerRoute
});
var OfficerDashboardRoute = Route$22.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => OfficerRoute
});
var OfficerDocumentsRoute = Route$21.update({
	id: "/documents",
	path: "/documents",
	getParentRoute: () => OfficerRoute
});
var OfficerDuplicatesRoute = Route$20.update({
	id: "/duplicates",
	path: "/duplicates",
	getParentRoute: () => OfficerRoute
});
var OfficerEvidenceRoute = Route$19.update({
	id: "/evidence",
	path: "/evidence",
	getParentRoute: () => OfficerRoute
});
var OfficerFieldVisitsRoute = Route$18.update({
	id: "/field-visits",
	path: "/field-visits",
	getParentRoute: () => OfficerRoute
});
var OfficerInboxRoute = Route$17.update({
	id: "/inbox",
	path: "/inbox",
	getParentRoute: () => OfficerRoute
});
var OfficerNotificationsRoute = Route$16.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => OfficerRoute
});
var OfficerReportsRoute = Route$15.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => OfficerRoute
});
var OfficerSettingsRoute = Route$14.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => OfficerRoute
});
var OfficerVerificationRoute = Route$13.update({
	id: "/verification",
	path: "/verification",
	getParentRoute: () => OfficerRoute
});
var OfficerLoginRoute = Route$12.update({
	id: "/officer_/login",
	path: "/officer/login",
	getParentRoute: () => Route$59
});
var SchemesIndexRoute = Route$72.update({
	id: "/schemes/",
	path: "/schemes/",
	getParentRoute: () => Route$59
});
var SchemesIdRoute = Route$73.update({
	id: "/schemes/$id",
	path: "/schemes/$id",
	getParentRoute: () => Route$59
});
var VerifierAuditRoute = Route$11.update({
	id: "/audit",
	path: "/audit",
	getParentRoute: () => VerifierRoute
});
var VerifierDashboardRoute = Route$10.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => VerifierRoute
});
var VerifierDocumentsRoute = Route$9.update({
	id: "/documents",
	path: "/documents",
	getParentRoute: () => VerifierRoute
});
var VerifierEscalationsRoute = Route$8.update({
	id: "/escalations",
	path: "/escalations",
	getParentRoute: () => VerifierRoute
});
var VerifierEvidenceRoute = Route$7.update({
	id: "/evidence",
	path: "/evidence",
	getParentRoute: () => VerifierRoute
});
var VerifierInboxRoute = Route$6.update({
	id: "/inbox",
	path: "/inbox",
	getParentRoute: () => VerifierRoute
});
var VerifierMismatchesRoute = Route$5.update({
	id: "/mismatches",
	path: "/mismatches",
	getParentRoute: () => VerifierRoute
});
var VerifierQueueRoute = Route$4.update({
	id: "/queue",
	path: "/queue",
	getParentRoute: () => VerifierRoute
});
var VerifierSettingsRoute = Route$3.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => VerifierRoute
});
var CitizenApplicationsIndexRoute = Route$2.update({
	id: "/applications/",
	path: "/applications/",
	getParentRoute: () => CitizenRoute
});
var CitizenApplicationsIdRoute = Route$60.update({
	id: "/applications/$id",
	path: "/applications/$id",
	getParentRoute: () => CitizenRoute
});
var CitizenApplySchemeIdRoute = Route$61.update({
	id: "/apply/$schemeId",
	path: "/apply/$schemeId",
	getParentRoute: () => CitizenRoute
});
var DepartmentSchemesIndexRoute = Route$1.update({
	id: "/schemes/",
	path: "/schemes/",
	getParentRoute: () => DepartmentRoute
});
var DepartmentSchemesIdRoute = Route$64.update({
	id: "/schemes/$id",
	path: "/schemes/$id",
	getParentRoute: () => DepartmentRoute
});
var OfficerApplicationsIndexRoute = Route.update({
	id: "/applications/",
	path: "/applications/",
	getParentRoute: () => OfficerRoute
});
var OfficerApplicationsIdRoute = Route$67.update({
	id: "/applications/$id",
	path: "/applications/$id",
	getParentRoute: () => OfficerRoute
});
var OfficerCitizensIdRoute = Route$68.update({
	id: "/citizens/$id",
	path: "/citizens/$id",
	getParentRoute: () => OfficerRoute
});
var OfficerFamiliesIdRoute = Route$69.update({
	id: "/families/$id",
	path: "/families/$id",
	getParentRoute: () => OfficerRoute
});
var VerifierApplicationsIdRoute = Route$74.update({
	id: "/applications/$id",
	path: "/applications/$id",
	getParentRoute: () => VerifierRoute
});
var AuditorRouteChildren = {
	AuditorApplicationsRoute,
	AuditorAuditRoute,
	AuditorDashboardRoute,
	AuditorDecisionsRoute,
	AuditorEvidenceRoute,
	AuditorExportRoute,
	AuditorInboxRoute,
	AuditorOfficersRoute,
	AuditorReportsRoute,
	AuditorRulesRoute,
	AuditorSettingsRoute
};
var AuditorRouteWithChildren = AuditorRoute._addFileChildren(AuditorRouteChildren);
var CitizenRouteChildren = {
	CitizenBenefitsRoute,
	CitizenDashboardRoute,
	CitizenDocumentsRoute,
	CitizenFamilyRoute,
	CitizenGrievancesRoute,
	CitizenInboxRoute,
	CitizenNotificationsRoute,
	CitizenSettingsRoute,
	CitizenApplicationsIdRoute,
	CitizenApplySchemeIdRoute,
	CitizenApplicationsIndexRoute
};
var CitizenRouteWithChildren = CitizenRoute._addFileChildren(CitizenRouteChildren);
var DepartmentRouteChildren = {
	DepartmentApplicationsRoute,
	DepartmentAuditRoute,
	DepartmentDashboardRoute,
	DepartmentDepartmentsRoute,
	DepartmentInboxRoute,
	DepartmentIntegrationsRoute,
	DepartmentNotificationsRoute,
	DepartmentOperationsRoute,
	DepartmentReportsRoute,
	DepartmentRulesRoute,
	DepartmentSettingsRoute,
	DepartmentWorkflowRoute,
	DepartmentSchemesIdRoute,
	DepartmentSchemesIndexRoute
};
var DepartmentRouteWithChildren = DepartmentRoute._addFileChildren(DepartmentRouteChildren);
var OfficerRouteChildren = {
	OfficerAuditRoute,
	OfficerDashboardRoute,
	OfficerDocumentsRoute,
	OfficerDuplicatesRoute,
	OfficerEvidenceRoute,
	OfficerFieldVisitsRoute,
	OfficerInboxRoute,
	OfficerNotificationsRoute,
	OfficerReportsRoute,
	OfficerSettingsRoute,
	OfficerVerificationRoute,
	OfficerApplicationsIdRoute,
	OfficerCitizensIdRoute,
	OfficerFamiliesIdRoute,
	OfficerApplicationsIndexRoute
};
var OfficerRouteWithChildren = OfficerRoute._addFileChildren(OfficerRouteChildren);
var VerifierRouteChildren = {
	VerifierAuditRoute,
	VerifierDashboardRoute,
	VerifierDocumentsRoute,
	VerifierEscalationsRoute,
	VerifierEvidenceRoute,
	VerifierInboxRoute,
	VerifierMismatchesRoute,
	VerifierQueueRoute,
	VerifierSettingsRoute,
	VerifierApplicationsIdRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuditorRoute: AuditorRouteWithChildren,
	CitizenRoute: CitizenRouteWithChildren,
	DepartmentRoute: DepartmentRouteWithChildren,
	EligibilityRoute,
	HelpRoute,
	LoginRoute,
	OfficerRoute: OfficerRouteWithChildren,
	TrackRoute,
	VerifierRoute: VerifierRoute._addFileChildren(VerifierRouteChildren),
	OfficerLoginRoute,
	SchemesIdRoute,
	SchemesIndexRoute
};
var routeTree = Route$59._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
