import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { i as useQueryClient, n as useQuery, r as QueryClientProvider, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { C as fetchMyFamily, E as getScheme, I as useApp, N as reportLifeEvent, T as fmtDate, j as raiseFamilyDispute, l as SCHEMES, p as addFamilyMember, t as AppStateProvider, w as fetchPerson360, x as fetchHouseholdFamily } from "./app-state-C6MbzGTh.mjs";
import { r as cn, t as Button } from "./button-BT328xhy.mjs";
import { C as useRouter, _ as Outlet, b as createRootRouteWithContext, d as Scripts, f as HeadContent, g as createRouter, m as useRouterState, v as lazyRouteComponent, x as Link, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as ShieldAlert, An as Award, B as RotateCcw, F as ScrollText, Ht as FileLock, I as Scale, Jt as Eye, Lt as FileText, N as Search, Pn as ArrowRight, Pt as FlaskConical, Q as Minimize2, R as Route, Sn as Calendar, Tn as Building2, V as RefreshCw, _ as TriangleAlert, a as Wrench, an as Clock, ct as Lock, ft as ListChecks, gn as ChevronRight, h as UserCheck, ht as Layers, k as ShieldCheck, l as Users, mn as CircleAlert, n as ZoomIn, nt as Maximize2, on as Clock3, p as UserPlus, pn as CircleCheck, qt as FileCheckCorner, rt as MapPin, s as Waves, sn as ClipboardList, t as ZoomOut, wt as History } from "../_libs/lucide-react.mjs";
import { c as Pill, o as PageHeader, s as Panel } from "./ui-Df8W68Fj.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DO3wpSNE.mjs";
import { t as Label } from "./label-DubpHrt-.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { n as Sheet, o as SiteFooter, r as SheetContent, s as SiteHeader } from "./SiteHeader-8--4G3ES.mjs";
import { t as Input } from "./input-Cl-rV5ml.mjs";
import { t as Badge } from "./badge-BwCkcYhX.mjs";
import { t as Textarea } from "./textarea-D15QmElO.mjs";
import { t as Route$64 } from "./citizen.applications._id-Dd6pmFsx.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Sj_zxMfs.mjs";
import { t as Route$65 } from "./citizen.apply._schemeId-B3mIEZ3w.mjs";
import { a as MiraSectionHeader, i as MiraPageHeader, n as MiraCard, o as MiraStatCard, r as MiraEmptyState, s as MiraStatus, t as MiraBadge } from "./MiraPrimitives-BaYHdl2h.mjs";
import { t as Route$66 } from "./citizen.documents-BdjP2m6C.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-CRo5rM7C.mjs";
import { t as Route$67 } from "./department.rules-BkHDDoqL.mjs";
import { t as Route$68 } from "./department.schemes._id-gpEOMPfH.mjs";
import { t as Route$69 } from "./eligibility-DDtH8A8G.mjs";
import { t as Route$70 } from "./help-WU1Ta5BK.mjs";
import { t as Route$71 } from "./officer.applications._id-wHaAEvt6.mjs";
import { t as Route$72 } from "./officer.citizens._id-CW6hDdMx.mjs";
import { t as Route$73 } from "./officer.families._id-B42DAte9.mjs";
import { n as Route$1$74 } from "./login-BJrgGkEr.mjs";
import { t as Route$75 } from "./track-DeK3DqNY.mjs";
import { t as Route$74 } from "./schemes.index-CeDAaBGB.mjs";
import { t as Route$76 } from "./schemes._id-fXuNlQ5n.mjs";
import { t as Route$77 } from "./verifier.applications._id-dyQaFfk3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-v-ROf6Ms.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-U0bLUWQi.css";
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
var Route$63 = createRootRouteWithContext()({
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
	const { queryClient } = Route$63.useRouteContext();
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
var $$splitComponentImporter$54 = () => import("./routes-BJYQe1wo.mjs");
var Route$62 = createFileRoute("/")({
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
var $$splitComponentImporter$53 = () => import("./auditor-ns_7J5qw.mjs");
var Route$61 = createFileRoute("/auditor")({ component: lazyRouteComponent($$splitComponentImporter$53, "component") });
var $$splitComponentImporter$52 = () => import("./citizen-DCAwh9_8.mjs");
var Route$60 = createFileRoute("/citizen")({ component: lazyRouteComponent($$splitComponentImporter$52, "component") });
var $$splitComponentImporter$51 = () => import("./department-DD6a20JC.mjs");
var Route$59 = createFileRoute("/department")({ component: lazyRouteComponent($$splitComponentImporter$51, "component") });
var $$splitComponentImporter$50 = () => import("./officer-BbPSDtBW.mjs");
var Route$58 = createFileRoute("/officer")({ component: lazyRouteComponent($$splitComponentImporter$50, "component") });
var $$splitComponentImporter$49 = () => import("./verifier-EVFRgqPR.mjs");
var Route$57 = createFileRoute("/verifier")({ component: lazyRouteComponent($$splitComponentImporter$49, "component") });
var $$splitComponentImporter$48 = () => import("./auditor.applications-CYSzqvFm.mjs");
var Route$56 = createFileRoute("/auditor/applications")({
	head: () => ({ meta: [{ title: "Applications Audit — Forensic Inspection" }, {
		name: "description",
		content: "Read-only application audit inspection."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$48, "component")
});
var $$splitComponentImporter$47 = () => import("./auditor.audit-5UbZbuBl.mjs");
var Route$55 = createFileRoute("/auditor/audit")({
	head: () => ({ meta: [{ title: "Forensic Audit Ledger — Auditor" }, {
		name: "description",
		content: "Tamper-evident chronological transaction ledger with block hashes."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$47, "component")
});
var Route$54 = createFileRoute("/auditor/dashboard")({
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
var $$splitComponentImporter$46 = () => import("./auditor.decisions-DLuvP8SR.mjs");
var Route$53 = createFileRoute("/auditor/decisions")({
	head: () => ({ meta: [{ title: "Hashed Decisions & Entitlement Determinations — Auditor" }, {
		name: "description",
		content: "Cryptographically verified determinations, public certificates, and SHA-256 seal registry."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$46, "component")
});
var $$splitComponentImporter$45 = () => import("./auditor.evidence-BsufrVRa.mjs");
var Route$52 = createFileRoute("/auditor/evidence")({
	head: () => ({ meta: [{ title: "Forensic Evidence Vault — Auditor" }, {
		name: "description",
		content: "Inspection of uploaded documents, version histories, and forensic file tokens."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$45, "component")
});
var $$splitComponentImporter$44 = () => import("./auditor.export-DRZDDVqm.mjs");
var Route$51 = createFileRoute("/auditor/export")({
	head: () => ({ meta: [{ title: "Cryptographic Evidence Export — Auditor" }, {
		name: "description",
		content: "Export verifiable cryptographic proofs and SHA-256 Merkle root bundles."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$44, "component")
});
function Family360({ householdId = "MIRA-FAM-10482", initialSelectedPersonId, readOnly = false, role, className }) {
	const { state } = useApp();
	const containerRef = (0, import_react.useRef)(null);
	const [zoom, setZoom] = (0, import_react.useState)(1);
	const [pan, setPan] = (0, import_react.useState)({
		x: 40,
		y: 30
	});
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const [dragStart, setDragStart] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const [isFullscreen, setIsFullscreen] = (0, import_react.useState)(false);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [generationFilter, setGenerationFilter] = (0, import_react.useState)("ALL");
	const [roleFilter, setRoleFilter] = (0, import_react.useState)("ALL");
	const [verificationFilter, setVerificationFilter] = (0, import_react.useState)("ALL");
	const [hoveredMemberId, setHoveredMemberId] = (0, import_react.useState)(null);
	const [selectedPersonId, setSelectedPersonId] = (0, import_react.useState)(initialSelectedPersonId || null);
	const [isDrawerOpen, setIsDrawerOpen] = (0, import_react.useState)(false);
	const [isPathFinderOpen, setIsPathFinderOpen] = (0, import_react.useState)(false);
	const [pathFromId, setPathFromId] = (0, import_react.useState)("");
	const [pathToId, setToId] = (0, import_react.useState)("");
	const [computedPath, setComputedPath] = (0, import_react.useState)(null);
	const { data: familyData, isLoading, isError, error, refetch } = useQuery({
		queryKey: [
			"household-family-360",
			householdId,
			state.session?.apiUserId
		],
		queryFn: () => fetchHouseholdFamily(state.session, householdId),
		enabled: !!state.session,
		staleTime: 6e4
	});
	const { data: person360Data, isLoading: isLoading360 } = useQuery({
		queryKey: [
			"person-360-details",
			selectedPersonId,
			state.session?.apiUserId
		],
		queryFn: () => fetchPerson360(state.session, selectedPersonId),
		enabled: !!selectedPersonId && !!state.session,
		staleTime: 3e4
	});
	const { positionedMembers, relationships, generationCounts } = (0, import_react.useMemo)(() => {
		if (!familyData?.members) return {
			positionedMembers: [],
			relationships: [],
			generationCounts: {
				g1: 0,
				g2: 0,
				g3: 0,
				g4: 0
			}
		};
		const members = familyData.members;
		const rels = familyData.relationships || [];
		const assigned = members.map((m) => {
			let bYear = 1990;
			if (m.dob) {
				const parts = m.dob.split("-");
				if (parts[0]) bYear = parseInt(parts[0], 10) || 1990;
			}
			let gen = 2;
			let genLabel = "G2 • Parents & Heads";
			if (bYear < 1952) {
				gen = 1;
				genLabel = "G1 • Elders & Patriarchs";
			} else if (bYear >= 1952 && bYear < 1992) {
				gen = 2;
				genLabel = "G2 • Parents & Applicants";
			} else if (bYear >= 1992 && bYear < 2015) {
				gen = 3;
				genLabel = "G3 • Youth & Children";
			} else {
				gen = 4;
				genLabel = "G4 • Infants & Dependents";
			}
			return {
				...m,
				gen,
				genLabel,
				birthYear: bYear,
				x: 0,
				y: 0
			};
		});
		const g1 = assigned.filter((m) => m.gen === 1).sort((a, b) => a.birthYear - b.birthYear);
		const g2 = assigned.filter((m) => m.gen === 2).sort((a, b) => a.birthYear - b.birthYear);
		const g3 = assigned.filter((m) => m.gen === 3).sort((a, b) => a.birthYear - b.birthYear);
		const g4 = assigned.filter((m) => m.gen === 4).sort((a, b) => a.birthYear - b.birthYear);
		const GEN_Y_START = 80;
		const GEN_Y_GAP = 180;
		const layoutGen = (list, genIndex) => {
			const totalWidth = list.length * 236;
			const startX = Math.max(60, (2600 - totalWidth) / 2);
			list.forEach((node, i) => {
				node.x = startX + i * 236;
				node.y = GEN_Y_START + genIndex * GEN_Y_GAP;
			});
		};
		layoutGen(g1, 0);
		layoutGen(g2, 1);
		layoutGen(g3, 2);
		layoutGen(g4, 3);
		return {
			positionedMembers: [
				...g1,
				...g2,
				...g3,
				...g4
			],
			relationships: rels,
			generationCounts: {
				g1: g1.length,
				g2: g2.length,
				g3: g3.length,
				g4: g4.length
			}
		};
	}, [familyData]);
	const memberMap = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		positionedMembers.forEach((m) => {
			map.set(m.id, m);
			map.set(m.public_id, m);
			if (m.person_id) map.set(m.person_id, m);
		});
		return map;
	}, [positionedMembers]);
	const visibleMembers = (0, import_react.useMemo)(() => {
		return positionedMembers.filter((m) => {
			if (generationFilter !== "ALL" && m.gen !== parseInt(generationFilter, 10)) return false;
			if (roleFilter !== "ALL") {
				if (roleFilter === "HEAD" && m.relationship !== "HEAD") return false;
				if (roleFilter === "SPOUSE" && m.relationship !== "SPOUSE") return false;
				if (roleFilter === "CHILD" && m.relationship !== "CHILD") return false;
				if (roleFilter === "DEPENDENT" && m.relationship !== "DEPENDENT" && m.relationship !== "PARENT") return false;
			}
			if (verificationFilter !== "ALL") {
				const isVer = (m.identity || "").toLowerCase().includes("verif");
				if (verificationFilter === "VERIFIED" && !isVer) return false;
				if (verificationFilter === "PENDING" && isVer) return false;
			}
			if (searchQuery.trim()) {
				const q = searchQuery.toLowerCase();
				return m.name.toLowerCase().includes(q) || m.public_id.toLowerCase().includes(q) || m.relationship.toLowerCase().includes(q);
			}
			return true;
		});
	}, [
		positionedMembers,
		generationFilter,
		roleFilter,
		verificationFilter,
		searchQuery
	]);
	const visibleIdSet = (0, import_react.useMemo)(() => {
		const s = /* @__PURE__ */ new Set();
		visibleMembers.forEach((m) => {
			s.add(m.id);
			if (m.person_id) s.add(m.person_id);
		});
		return s;
	}, [visibleMembers]);
	const handleSelectMember = (personIdOrPublicId) => {
		setSelectedPersonId(personIdOrPublicId);
		setIsDrawerOpen(true);
	};
	const handleMouseDown = (e) => {
		if (e.button !== 0) return;
		setIsDragging(true);
		setDragStart({
			x: e.clientX - pan.x,
			y: e.clientY - pan.y
		});
	};
	const handleMouseMove = (e) => {
		if (!isDragging) return;
		setPan({
			x: e.clientX - dragStart.x,
			y: e.clientY - dragStart.y
		});
	};
	const handleMouseUp = () => setIsDragging(false);
	const centerOnMember = (0, import_react.useCallback)((member) => {
		if (!containerRef.current) return;
		const rect = containerRef.current.getBoundingClientRect();
		const targetX = rect.width / 2 - member.x * zoom - 105 * zoom;
		const targetY = rect.height / 2 - member.y * zoom - 45 * zoom;
		setPan({
			x: targetX,
			y: targetY
		});
	}, [zoom]);
	const handleFindPath = () => {
		if (!pathFromId || !pathToId) {
			toast.error("Please select both starting and target individuals.");
			return;
		}
		if (pathFromId === pathToId) {
			toast.info("Both selections are the same person.");
			return;
		}
		const adj = /* @__PURE__ */ new Map();
		relationships.forEach((r) => {
			const a = r.person_a_id;
			const b = r.person_b_id;
			if (!adj.has(a)) adj.set(a, []);
			if (!adj.has(b)) adj.set(b, []);
			adj.get(a).push({
				to: b,
				rel: r.relationship_type
			});
			adj.get(b).push({
				to: a,
				rel: `Related to (${r.relationship_type})`
			});
		});
		const queue = [{
			curr: pathFromId,
			path: []
		}];
		const visited = /* @__PURE__ */ new Set([pathFromId]);
		let foundPath = null;
		while (queue.length > 0) {
			const { curr, path } = queue.shift();
			if (curr === pathToId) {
				foundPath = path;
				break;
			}
			const neighbors = adj.get(curr) || [];
			for (const n of neighbors) if (!visited.has(n.to)) {
				visited.add(n.to);
				queue.push({
					curr: n.to,
					path: [...path, {
						from: curr,
						to: n.to,
						rel: n.rel
					}]
				});
			}
		}
		if (foundPath && foundPath.length > 0) {
			setComputedPath(foundPath);
			toast.success(`Relationship path identified (${foundPath.length} step${foundPath.length > 1 ? "s" : ""})`);
		} else {
			setComputedPath(null);
			toast.warning("No direct verified relationship path found in the registry.");
		}
	};
	const summaryMetrics = (0, import_react.useMemo)(() => {
		const total = positionedMembers.length;
		const verified = positionedMembers.filter((m) => (m.identity || "").toLowerCase().includes("verif")).length;
		return {
			total,
			verified,
			pending: total - verified,
			income: "₹1,72,000 / yr",
			documentsCount: 10,
			applicationsCount: 6,
			discrepancyCount: 1
		};
	}, [positionedMembers]);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-96 w-full flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3 text-slate-600 dark:text-slate-400",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-6 animate-spin rounded-full border-2 border-slate-900 border-t-transparent dark:border-slate-100" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: "Generating Multi-Generational Family360 Graph..."
			})]
		})
	});
	if (isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-96 w-full flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/50 p-8 text-center dark:border-red-900/50 dark:bg-red-950/20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-10 w-10 text-red-600 dark:text-red-400 mb-3" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-bold text-red-900 dark:text-red-200",
				children: "Failed to load Family360 Record"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-red-700 dark:text-red-400 max-w-md",
				children: error instanceof Error ? error.message : "Access restricted or household registry unavailable."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: () => refetch(),
				className: "mt-4 gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), "Retry Connection"]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative flex flex-col rounded-2xl border border-slate-200/90 bg-slate-50/50 shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-950", isFullscreen && "fixed inset-0 z-50 rounded-none border-none", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-3 dark:border-slate-800 dark:bg-slate-900",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100",
								children: "Sharma Family Household Graph"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "font-mono text-[11px] bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
								children: householdId
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-[11px]",
								children: "4 Generations Active"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Tehsil Bilaspur · Rampur District · Multi-Tier Household Registry"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-4 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase font-mono tracking-wider text-muted-foreground",
								children: "Total Members"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold text-slate-900 dark:text-slate-100",
								children: [summaryMetrics.total, " Individuals"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-7 w-[1px] bg-slate-200 dark:bg-slate-800" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase font-mono tracking-wider text-muted-foreground",
								children: "Verified Civil ID"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), summaryMetrics.verified]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-7 w-[1px] bg-slate-200 dark:bg-slate-800" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase font-mono tracking-wider text-muted-foreground",
								children: "Review Flags"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3 w-3" }),
									summaryMetrics.discrepancyCount,
									" Pending"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-7 w-[1px] bg-slate-200 dark:bg-slate-800" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] uppercase font-mono tracking-wider text-muted-foreground",
								children: "Household Income"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-bold text-slate-900 dark:text-slate-100",
								children: summaryMetrics.income
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 bg-white/70 px-4 py-2.5 backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/70",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-48 sm:w-64",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "text",
								placeholder: "Search member or ID...",
								value: searchQuery,
								onChange: (e) => setSearchQuery(e.target.value),
								className: "h-8 pl-8 text-xs bg-white dark:bg-slate-950"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: generationFilter,
							onValueChange: setGenerationFilter,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-8 w-36 text-xs bg-white dark:bg-slate-950",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Generation" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: "ALL",
									children: [
										"All Generations (",
										summaryMetrics.total,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: "1",
									children: [
										"G1 • Elders (",
										generationCounts.g1,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: "2",
									children: [
										"G2 • Parents (",
										generationCounts.g2,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: "3",
									children: [
										"G3 • Youth (",
										generationCounts.g3,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: "4",
									children: [
										"G4 • Infants (",
										generationCounts.g4,
										")"
									]
								})
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: roleFilter,
							onValueChange: setRoleFilter,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-8 w-32 text-xs bg-white dark:bg-slate-950",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Role" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "ALL",
									children: "All Roles"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "HEAD",
									children: "Household Head"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "SPOUSE",
									children: "Spouse"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "CHILD",
									children: "Children"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "DEPENDENT",
									children: "Dependents"
								})
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: isPathFinderOpen ? "default" : "outline",
							size: "sm",
							onClick: () => setIsPathFinderOpen(!isPathFinderOpen),
							className: "h-8 gap-1.5 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Path Finder" })]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							className: "h-8 w-8",
							onClick: () => setZoom((z) => Math.min(z + .15, 2)),
							title: "Zoom In",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomIn, { className: "h-3.5 w-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							className: "h-8 w-8",
							onClick: () => setZoom((z) => Math.max(z - .15, .45)),
							title: "Zoom Out",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomOut, { className: "h-3.5 w-3.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							className: "h-8 text-xs px-2 font-mono",
							onClick: () => {
								setZoom(1);
								setPan({
									x: 40,
									y: 30
								});
							},
							title: "Reset View",
							children: [Math.round(zoom * 100), "%"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							className: "h-8 w-8",
							onClick: () => setIsFullscreen(!isFullscreen),
							title: isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode",
							children: isFullscreen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minimize2, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "h-3.5 w-3.5" })
						})
					]
				})]
			}),
			isPathFinderOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900/40 dark:bg-amber-950/20 animate-in slide-in-from-top-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Route, { className: "h-4 w-4 text-amber-700 dark:text-amber-400" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-bold text-amber-900 dark:text-amber-200",
								children: "Statutory Relationship Traversal"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-amber-700/80 dark:text-amber-400/80",
								children: "Compute verified civil relationship chain between any two household members"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2 w-full sm:w-auto",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: pathFromId,
								onValueChange: setPathFromId,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-8 w-44 text-xs bg-white dark:bg-slate-900",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "From Member..." })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: positionedMembers.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: m.person_id || m.id,
									children: [
										m.name,
										" (",
										m.public_id,
										")"
									]
								}, m.id)) })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 text-amber-700 shrink-0" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: pathToId,
								onValueChange: setToId,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-8 w-44 text-xs bg-white dark:bg-slate-900",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "To Member..." })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: positionedMembers.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: m.person_id || m.id,
									children: [
										m.name,
										" (",
										m.public_id,
										")"
									]
								}, m.id)) })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								className: "h-8 text-xs bg-amber-600 hover:bg-amber-700 text-white font-medium gap-1",
								onClick: handleFindPath,
								children: "Compute Chain"
							})
						]
					})]
				}), computedPath && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 rounded-lg border border-amber-300 bg-white p-3 shadow-2xs dark:border-amber-800 dark:bg-slate-900",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider",
						children: "Verified Lineage Path:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap items-center gap-1.5 text-xs font-medium",
						children: computedPath.map((step, idx) => {
							const fromNode = memberMap.get(step.from);
							const toNode = memberMap.get(step.to);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-slate-900 dark:text-slate-100",
									children: fromNode?.name || step.from
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-800 dark:bg-amber-900/50 dark:text-amber-200",
									children: step.rel
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3 text-slate-400" }),
								idx === computedPath.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-slate-900 dark:text-slate-100",
									children: toNode?.name || step.to
								})
							] }, idx);
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: containerRef,
				onMouseDown: handleMouseDown,
				onMouseMove: handleMouseMove,
				onMouseUp: handleMouseUp,
				onMouseLeave: handleMouseUp,
				className: cn("relative h-[640px] w-full cursor-grab overflow-hidden select-none bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)]", isDragging && "cursor-grabbing"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					className: "absolute inset-0 h-full w-full pointer-events-none",
					style: {
						transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
						transformOrigin: "0 0",
						width: "2800px",
						height: "1000px"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
							id: "edgeGrad",
							x1: "0%",
							y1: "0%",
							x2: "100%",
							y2: "100%",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "0%",
								stopColor: "#94a3b8",
								stopOpacity: "0.4"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "100%",
								stopColor: "#3b82f6",
								stopOpacity: "0.7"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
							id: "edgeActive",
							x1: "0%",
							y1: "0%",
							x2: "100%",
							y2: "100%",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "0%",
								stopColor: "#d97706"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "100%",
								stopColor: "#2563eb"
							})]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
							className: "generation-bands opacity-50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
									x: "20",
									y: "50",
									width: "2700",
									height: "150",
									rx: "12",
									fill: "#f8fafc",
									className: "dark:fill-slate-900/40"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
									x: "40",
									y: "75",
									fill: "#64748b",
									fontSize: "12",
									fontWeight: "700",
									fontFamily: "monospace",
									children: "TIER 1 • ELDERS & ANCESTORS (G1)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
									x: "20",
									y: "230",
									width: "2700",
									height: "150",
									rx: "12",
									fill: "#f1f5f9",
									className: "dark:fill-slate-900/60"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
									x: "40",
									y: "255",
									fill: "#0284c7",
									fontSize: "12",
									fontWeight: "700",
									fontFamily: "monospace",
									children: "TIER 2 • HOUSEHOLD HEADS & PARENTS (G2)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
									x: "20",
									y: "410",
									width: "2700",
									height: "150",
									rx: "12",
									fill: "#f8fafc",
									className: "dark:fill-slate-900/40"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
									x: "40",
									y: "435",
									fill: "#0d9488",
									fontSize: "12",
									fontWeight: "700",
									fontFamily: "monospace",
									children: "TIER 3 • CHILDREN & STUDENTS (G3)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
									x: "20",
									y: "590",
									width: "2700",
									height: "150",
									rx: "12",
									fill: "#f1f5f9",
									className: "dark:fill-slate-900/60"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
									x: "40",
									y: "615",
									fill: "#8b5cf6",
									fontSize: "12",
									fontWeight: "700",
									fontFamily: "monospace",
									children: "TIER 4 • INFANTS & YOUNG DEPENDENTS (G4)"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {
							className: "edges",
							children: relationships.map((rel) => {
								const fromNode = memberMap.get(rel.person_a_id);
								const toNode = memberMap.get(rel.person_b_id);
								if (!fromNode || !toNode) return null;
								const isFromVisible = visibleIdSet.has(fromNode.id);
								const isToVisible = visibleIdSet.has(toNode.id);
								if (!isFromVisible || !isToVisible) return null;
								const x1 = fromNode.x + 105;
								const y1 = fromNode.y + 40;
								const x2 = toNode.x + 105;
								const y2 = toNode.y + 40;
								const isHighlighted = hoveredMemberId === fromNode.id || hoveredMemberId === toNode.id || hoveredMemberId === fromNode.person_id || hoveredMemberId === toNode.person_id;
								const midY = (y1 + y2) / 2;
								const d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									d,
									fill: "none",
									stroke: isHighlighted ? "url(#edgeActive)" : "#cbd5e1",
									strokeWidth: isHighlighted ? 3 : 1.5,
									strokeDasharray: rel.relationship_type === "SPOUSE" ? "4 4" : void 0,
									className: "transition-all duration-200"
								}), isHighlighted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
									x: (x1 + x2) / 2,
									y: (y1 + y2) / 2 - 4,
									fill: "#1e293b",
									fontSize: "10",
									fontWeight: "bold",
									textAnchor: "middle",
									className: "select-none bg-white font-mono",
									children: rel.relationship_type
								})] }, rel.id);
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 pointer-events-auto",
					style: {
						transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
						transformOrigin: "0 0",
						width: "2800px",
						height: "1000px"
					},
					children: visibleMembers.map((member) => {
						const isHovered = hoveredMemberId === member.id || hoveredMemberId === member.person_id;
						const isSelected = selectedPersonId === member.id || selectedPersonId === member.public_id || selectedPersonId === member.person_id;
						const isHead = member.relationship === "HEAD";
						const isVerified = (member.identity || "").toLowerCase().includes("verif");
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: (e) => {
								e.stopPropagation();
								handleSelectMember(member.public_id || member.id);
							},
							onMouseEnter: () => setHoveredMemberId(member.id),
							onMouseLeave: () => setHoveredMemberId(null),
							style: {
								position: "absolute",
								left: `${member.x}px`,
								top: `${member.y}px`,
								width: "210px"
							},
							className: cn("group relative cursor-pointer rounded-xl border bg-white p-3.5 shadow-xs transition-all duration-200 dark:bg-slate-900 select-none", isHead ? "border-gov/60 bg-gov/[0.03] ring-1 ring-gov/20 dark:border-gov/80" : "border-slate-200/90 dark:border-slate-800", isHovered && "shadow-md scale-[1.03] border-blue-500 z-30", isSelected && "ring-2 ring-blue-600 border-blue-600 shadow-md z-40"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "text-xs font-bold text-slate-900 dark:text-slate-100 truncate",
												children: member.name
											}), isHead && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded bg-gov px-1 py-0.2 text-[9px] font-bold text-white uppercase tracking-wider shrink-0",
												children: "Head"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-mono text-[10px] text-muted-foreground truncate",
											children: [
												member.public_id,
												" · ",
												member.gender
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("rounded px-1.5 py-0.5 text-[10px] font-semibold shrink-0 uppercase tracking-wider", isHead ? "bg-gov/10 text-gov font-bold" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"),
										children: member.relationship
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] dark:border-slate-800/80",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1 font-mono text-slate-500",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: member.dob || "DOB Verified" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center gap-1",
										children: isVerified ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 font-medium",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), "ID OK"]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-amber-600 dark:text-amber-400 flex items-center gap-0.5 font-medium",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), "Review"]
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: (e) => {
										e.stopPropagation();
										centerOnMember(member);
									},
									className: "absolute -top-2 -right-2 hidden h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-white shadow-xs group-hover:flex hover:bg-blue-600 dark:bg-slate-100 dark:text-slate-900 text-[10px]",
									title: "Center View",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-2.5 w-2.5" })
								})
							]
						}, member.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: isDrawerOpen,
				onOpenChange: setIsDrawerOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
					side: "right",
					className: "w-full sm:max-w-xl p-0 overflow-y-auto bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800",
					children: isLoading360 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-full flex-col items-center justify-center p-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-8 animate-spin rounded-full border-2 border-slate-900 border-t-transparent dark:border-slate-100 mb-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-slate-600",
							children: "Loading Person 360 Records..."
						})]
					}) : person360Data?.person ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 pb-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-b border-slate-200 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-slate-900/50",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-start justify-between gap-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-lg font-bold shadow-xs",
										children: person360Data.person.name.split(" ").map((n) => n[0]).join("")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "text-lg font-bold text-slate-900 dark:text-slate-100",
												children: person360Data.person.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-[10px]",
												children: person360Data.person.verification_status
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-mono text-xs text-muted-foreground mt-0.5",
											children: [
												person360Data.person.public_id,
												" · ",
												person360Data.person.membership_role
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-slate-600 dark:text-slate-400 mt-1",
											children: [
												"Aadhaar: ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-mono",
													children: person360Data.person.masked_id
												}),
												" · Age ",
												person360Data.person.age
											]
										})
									] })]
								})
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
								defaultValue: "overview",
								className: "w-full",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
										className: "grid w-full grid-cols-5 text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
												value: "overview",
												children: "Overview"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
												value: "relations",
												children: [
													"Links (",
													person360Data.relationships.length,
													")"
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
												value: "docs",
												children: [
													"Docs (",
													person360Data.documents.length,
													")"
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
												value: "schemes",
												children: [
													"Schemes (",
													person360Data.schemes.length,
													")"
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
												value: "timeline",
												children: [
													"History (",
													person360Data.timeline.length,
													")"
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
										value: "overview",
										className: "space-y-4 pt-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "text-xs font-bold uppercase tracking-wider text-slate-500 mb-3",
												children: "Civil Demographics"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
												className: "grid grid-cols-2 gap-3 text-xs",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
														className: "text-muted-foreground",
														children: "Full Name"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
														className: "font-medium text-slate-900 dark:text-slate-100 mt-0.5",
														children: [
															person360Data.person.first_name,
															" ",
															person360Data.person.last_name
														]
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
														className: "text-muted-foreground",
														children: "Date of Birth"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
														className: "font-medium text-slate-900 dark:text-slate-100 mt-0.5",
														children: [
															person360Data.person.dob,
															" (",
															person360Data.person.age,
															" years)"
														]
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
														className: "text-muted-foreground",
														children: "Gender"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
														className: "font-medium text-slate-900 dark:text-slate-100 mt-0.5",
														children: person360Data.person.gender
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
														className: "text-muted-foreground",
														children: "Household ID"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
														className: "font-mono font-medium text-gov mt-0.5",
														children: person360Data.person.household_public_id
													})] })
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "text-xs font-bold uppercase tracking-wider text-slate-500 mb-2",
												children: "Household Membership Role"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Status within Household" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: "font-bold text-gov",
													children: person360Data.person.membership_role
												})]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
										value: "relations",
										className: "space-y-3 pt-4",
										children: person360Data.relationships.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground text-center py-6",
											children: "No direct relationships registered in civil record."
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
											className: "divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900",
											children: person360Data.relationships.map((rel) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex items-center justify-between p-3.5 text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-semibold text-slate-900 dark:text-slate-100",
													children: rel.related_person_name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "font-mono text-[11px] text-muted-foreground",
													children: [
														rel.related_person_public_id,
														" · ",
														rel.relationship_type
													]
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
														variant: "outline",
														className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px]",
														children: [Math.round(rel.confidence * 100), "% Verified"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														variant: "ghost",
														size: "sm",
														className: "h-7 text-xs",
														onClick: () => handleSelectMember(rel.related_person_public_id),
														children: "Inspect"
													})]
												})]
											}, rel.id))
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
										value: "docs",
										className: "space-y-3 pt-4",
										children: person360Data.documents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground text-center py-6",
											children: "No identity evidence documents uploaded."
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-2",
											children: person360Data.documents.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5 text-xs shadow-2xs dark:border-slate-800 dark:bg-slate-900",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-semibold text-slate-900 dark:text-slate-100",
														children: doc.title
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "font-mono text-[11px] text-muted-foreground",
														children: [
															doc.public_id,
															" · ",
															doc.document_type
														]
													})] })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: cn("text-[10px]", doc.verification_status === "VERIFIED" ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" : "bg-amber-500/10 text-amber-700 border-amber-500/20"),
													children: doc.verification_status
												})]
											}, doc.id))
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
										value: "schemes",
										className: "space-y-4 pt-4",
										children: person360Data.schemes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground text-center py-6",
											children: "No scheme evaluations found for this person."
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-3",
											children: person360Data.schemes.map((sch) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl border border-slate-200 bg-white p-4 text-xs shadow-2xs dark:border-slate-800 dark:bg-slate-900",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-start justify-between gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
															className: "font-bold text-slate-900 dark:text-slate-100",
															children: sch.name
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "font-mono text-[10px] text-muted-foreground",
															children: sch.code
														})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
															variant: "outline",
															className: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 text-[10px] font-bold",
															children: sch.eligibility_status.replace("_", " ")
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "mt-2.5 rounded-lg bg-slate-50 p-2.5 border border-slate-100 dark:bg-slate-800/60 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "font-medium",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-bold text-gov",
																children: "Determination: "
															}), sch.explanation]
														})
													}),
													sch.satisfied_conditions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-2 space-y-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400",
															children: "Satisfied Criteria:"
														}), sch.satisfied_conditions.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3 text-emerald-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c })]
														}, i))]
													}),
													sch.unmet_conditions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-2 space-y-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400",
															children: "Pending Verification / Evidence:"
														}), sch.unmet_conditions.map((u, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3 w-3 text-amber-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: u })]
														}, i))]
													})
												]
											}, sch.scheme_id))
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
										value: "timeline",
										className: "space-y-3 pt-4",
										children: person360Data.timeline.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground text-center py-6",
											children: "No recorded lifecycle events."
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200 dark:before:bg-slate-800",
											children: person360Data.timeline.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -left-6 top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-blue-600 dark:border-slate-900" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "rounded-lg border border-slate-200 bg-white p-3 shadow-2xs dark:border-slate-800 dark:bg-slate-900",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-between text-[11px] text-muted-foreground mb-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-semibold text-gov",
															children: event.event_type
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-mono",
															children: event.effective_date
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-medium text-slate-900 dark:text-slate-100",
														children: event.description
													})]
												})]
											}, event.id))
										})
									})
								]
							})
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-full items-center justify-center p-8 text-center text-xs text-muted-foreground",
						children: "Select an individual on the Family360 graph to view complete profile and evidence."
					})
				})
			})
		]
	});
}
var Route$50 = createFileRoute("/auditor/family360")({
	head: () => ({ meta: [
		{ title: "Family360 Forensic Record — Auditor Oversight" },
		{
			name: "description",
			content: "Read-only cryptographic audit perspective over household compositions, historical relationship alterations, and CAG compliance."
		},
		{
			property: "og:title",
			content: "Family360 — Auditor"
		}
	] }),
	component: AuditorFamily360Page
});
function AuditorFamily360Page() {
	const [householdInput, setHouseholdInput] = (0, import_react.useState)("MIRA-FAM-10482");
	const [activeHouseholdId, setActiveHouseholdId] = (0, import_react.useState)("MIRA-FAM-10482");
	const handleSearch = (e) => {
		e.preventDefault();
		if (householdInput.trim()) setActiveHouseholdId(householdInput.trim());
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
						title: "Family360 Forensic Inspection",
						desc: "Read-only statutory inspection of household relationships, cryptographic evidence links, and state modification trails.",
						crumbs: [{
							label: "Audit Overview",
							to: "/auditor/dashboard"
						}, { label: "Family360" }]
					})
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row items-start sm:items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/20 text-xs py-1 px-2.5 gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Forensic Read-Only Mode" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSearch,
						className: "flex items-center gap-2 shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-44 sm:w-56",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "text",
								placeholder: "Household ID...",
								value: householdInput,
								onChange: (e) => setHouseholdInput(e.target.value),
								className: "h-8 pl-8 text-xs font-mono bg-white dark:bg-slate-900"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "sm",
							variant: "outline",
							className: "h-8 text-xs",
							children: "Audit"
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Family360, {
				householdId: activeHouseholdId,
				role: "auditor",
				readOnly: true
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auditor/audit",
						className: "rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-gov/50 transition-colors dark:border-slate-800 dark:bg-slate-900",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-8 w-8 items-center justify-center rounded-lg bg-gov/10 text-gov",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-bold text-slate-900 dark:text-slate-100",
									children: "Forensic Audit Ledger"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "SHA-256 Merkle chain logs"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 text-slate-400" })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auditor/reports",
						className: "rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-gov/50 transition-colors dark:border-slate-800 dark:bg-slate-900",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheckCorner, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-bold text-slate-900 dark:text-slate-100",
									children: "Compliance Benchmarks"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "CAG welfare parameters"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 text-slate-400" })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auditor/reports",
						className: "rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-gov/50 transition-colors dark:border-slate-800 dark:bg-slate-900",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-700",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-bold text-slate-900 dark:text-slate-100",
									children: "Audit Reports"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "Discrepancy and duplicate reports"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 text-slate-400" })]
						})
					})
				]
			})
		]
	});
}
var $$splitComponentImporter$43 = () => import("./auditor.inbox-CpFS3nZN.mjs");
var Route$49 = createFileRoute("/auditor/inbox")({
	head: () => ({ meta: [{ title: "Communications — Forensic Audit Authority" }, {
		name: "description",
		content: "Official messages, citizen clarifications, assignments and departmental correspondence."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$43, "component")
});
var $$splitComponentImporter$42 = () => import("./auditor.officers-k74T-zop.mjs");
var Route$48 = createFileRoute("/auditor/officers")({
	head: () => ({ meta: [{ title: "Officer Activity & Integrity Oversight — Auditor" }, {
		name: "description",
		content: "Statutory oversight on officer determinations, override statistics, and SLA fidelity."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$42, "component")
});
var $$splitComponentImporter$41 = () => import("./auditor.reports-CbSP2cPU.mjs");
var Route$47 = createFileRoute("/auditor/reports")({
	head: () => ({ meta: [{ title: "Statutory Audit Reports — Auditor" }, {
		name: "description",
		content: "CAG and statutory compliance reports, leak prevention estimates, and duplicate resolution audits."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$41, "component")
});
var $$splitComponentImporter$40 = () => import("./auditor.rules-BbMLLy9X.mjs");
var Route$46 = createFileRoute("/auditor/rules")({
	head: () => ({ meta: [{ title: "Eligibility Rules & Policy Audit — Auditor" }, {
		name: "description",
		content: "Forensic audit of eligibility criteria, rule engines, and version histories."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$40, "component")
});
var $$splitComponentImporter$39 = () => import("./auditor.settings-DKPNcwyy.mjs");
var Route$45 = createFileRoute("/auditor/settings")({
	head: () => ({ meta: [{ title: "Profile & Standards — Forensic Auditor" }, {
		name: "description",
		content: "Senior forensic auditor profile, CAG compliance benchmarks, and cryptographic verification parameters."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$39, "component")
});
var $$splitComponentImporter$38 = () => import("./citizen.benefits-BBN82tfk.mjs");
var Route$44 = createFileRoute("/citizen/benefits")({
	head: () => ({ meta: [{ title: "Benefits and assistance — Mira" }, {
		name: "description",
		content: "View benefits available to your household and track support received."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$38, "component")
});
var $$splitComponentImporter$37 = () => import("./citizen.dashboard-BP8ltSfQ.mjs");
var Route$43 = createFileRoute("/citizen/dashboard")({
	head: () => ({ meta: [{ title: "Rajesh Sharma — Citizen Workspace · Mira" }, {
		name: "description",
		content: "Authoritative family record, scheme applications, verified civil documents, and entitlement services."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$37, "component")
});
var Route$42 = createFileRoute("/citizen/family")({
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
				defaultValue: "family360",
				className: "w-full",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "grid w-full grid-cols-4 max-w-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "family360",
								className: "font-semibold text-gov",
								children: "Family360 Graph"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "tree",
								children: "Tiered Tree"
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
						value: "family360",
						className: "space-y-4 pt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Family360, {
							householdId: familyData?.household_public_id || "MIRA-FAM-10482",
							role: "citizen"
						})
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
var $$splitComponentImporter$36 = () => import("./citizen.grievances-00uEbcuY.mjs");
var Route$41 = createFileRoute("/citizen/grievances")({
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
var $$splitComponentImporter$35 = () => import("./citizen.inbox-Ckes_SM2.mjs");
var Route$40 = createFileRoute("/citizen/inbox")({
	head: () => ({ meta: [{ title: "Communications — Citizen Portal" }, {
		name: "description",
		content: "Official messages, citizen clarifications, assignments and departmental correspondence."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$35, "component")
});
var $$splitComponentImporter$34 = () => import("./citizen.notifications-Cl0ybb06.mjs");
var Route$39 = createFileRoute("/citizen/notifications")({
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
var $$splitComponentImporter$33 = () => import("./citizen.settings-EXURD8GM.mjs");
var Route$38 = createFileRoute("/citizen/settings")({
	head: () => ({ meta: [{ title: "Profile & Account — Citizen" }, {
		name: "description",
		content: "Citizen profile, authenticated identity, connected government records, and preferences."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$33, "component")
});
var $$splitComponentImporter$32 = () => import("./department.applications-ggRQSh2M.mjs");
var Route$37 = createFileRoute("/department/applications")({
	head: () => ({ meta: [{ title: "Department Applications Console — Administrator" }, {
		name: "description",
		content: "Department-wide application oversight and triage."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$32, "component")
});
var $$splitComponentImporter$31 = () => import("./department.audit-DaBIlwPF.mjs");
var Route$36 = createFileRoute("/department/audit")({
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
var Route$35 = createFileRoute("/department/dashboard")({
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
var $$splitComponentImporter$30 = () => import("./department.departments-CuohZu_9.mjs");
var Route$34 = createFileRoute("/department/departments")({
	head: () => ({ meta: [{ title: "Directorate & Jurisdictional Directory — Department" }, {
		name: "description",
		content: "Directory of state directorates, district welfare offices, and block nodes."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$30, "component")
});
var $$splitComponentImporter$29 = () => import("./department.inbox-DyR1crnh.mjs");
var Route$33 = createFileRoute("/department/inbox")({
	head: () => ({ meta: [{ title: "Communications — Department Administration" }, {
		name: "description",
		content: "Official messages, citizen clarifications, assignments and departmental correspondence."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$29, "component")
});
var $$splitComponentImporter$28 = () => import("./department.integrations-aGx_6pNV.mjs");
var Route$32 = createFileRoute("/department/integrations")({
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
var $$splitComponentImporter$27 = () => import("./department.notifications-BwLcrJFV.mjs");
var Route$31 = createFileRoute("/department/notifications")({
	head: () => ({ meta: [{ title: "System Notices & Alerts — Department" }, {
		name: "description",
		content: "Department notifications, queue alerts, and statutory bulletins."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$27, "component")
});
var $$splitComponentImporter$26 = () => import("./department.operations-CsXBFR8r.mjs");
var Route$30 = createFileRoute("/department/operations")({
	head: () => ({ meta: [{ title: "Operations & Queue Health — Department" }, {
		name: "description",
		content: "Real-time queue health, SLA breaches, bottleneck analysis, and load distribution."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
var $$splitComponentImporter$25 = () => import("./department.reports-CC6aOF4C.mjs");
var Route$29 = createFileRoute("/department/reports")({
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
var $$splitComponentImporter$24 = () => import("./department.settings-DcI670Hz.mjs");
var Route$28 = createFileRoute("/department/settings")({
	head: () => ({ meta: [{ title: "System Configuration — Department Administration" }, {
		name: "description",
		content: "Department-wide governance, SLA thresholds, cross-registry synchronization, and cryptographic ledger parameters."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var $$splitComponentImporter$23 = () => import("./department.workflow-BMjufHoT.mjs");
var Route$27 = createFileRoute("/department/workflow")({
	head: () => ({ meta: [{ title: "Workflow & Lifecycle Configurator — Department" }, {
		name: "description",
		content: "Stage gating, automated verification triggers, and supervisor routing rules."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("./officer.audit-E2VelhL0.mjs");
var Route$26 = createFileRoute("/officer/audit")({
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
var $$splitComponentImporter$21 = () => import("./officer.dashboard-DHCdz6jC.mjs");
var Route$25 = createFileRoute("/officer/dashboard")({
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
var $$splitComponentImporter$20 = () => import("./officer.documents-BiBqwxHx.mjs");
var Route$24 = createFileRoute("/officer/documents")({
	head: () => ({ meta: [{ title: "Documents — Mira" }, {
		name: "description",
		content: "Private citizen documents available to your authorized review scope."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./officer.duplicates-DG_N_wQW.mjs");
var Route$23 = createFileRoute("/officer/duplicates")({
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
var $$splitComponentImporter$18 = () => import("./officer.evidence-CQoUKlL6.mjs");
var Route$22 = createFileRoute("/officer/evidence")({
	head: () => ({ meta: [{ title: "Evidence & Document Vault — Officer Workspace" }, {
		name: "description",
		content: "Versioned document repository, citizen uploads, and geotagged field evidence."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var Route$21 = createFileRoute("/officer/family360")({
	head: () => ({ meta: [
		{ title: "Family360 Operations — Scheme & Field Officer" },
		{
			name: "description",
			content: "Operational multi-generational household registry, scheme eligibility evaluations, and field verification."
		},
		{
			property: "og:title",
			content: "Family360 — Scheme Officer"
		}
	] }),
	component: OfficerFamily360Page
});
function OfficerFamily360Page() {
	const [householdInput, setHouseholdInput] = (0, import_react.useState)("MIRA-FAM-10482");
	const [activeHouseholdId, setActiveHouseholdId] = (0, import_react.useState)("MIRA-FAM-10482");
	const handleSearch = (e) => {
		e.preventDefault();
		if (householdInput.trim()) setActiveHouseholdId(householdInput.trim());
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
					title: "Family360 Scheme Operations",
					desc: "Household composition analysis, multi-generational dependent verification, and statutory benefit eligibility.",
					crumbs: [{
						label: "Scheme Operations",
						to: "/schemes"
					}, { label: "Family360" }]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSearch,
					className: "flex items-center gap-2 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-48 sm:w-60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "text",
							placeholder: "Household ID...",
							value: householdInput,
							onChange: (e) => setHouseholdInput(e.target.value),
							className: "h-8 pl-8 text-xs font-mono bg-white dark:bg-slate-900"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "sm",
						variant: "outline",
						className: "h-8 text-xs",
						children: "Inspect"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Family360, {
				householdId: activeHouseholdId,
				role: "officer"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/schemes",
						className: "rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-gov/50 transition-colors dark:border-slate-800 dark:bg-slate-900",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-8 w-8 items-center justify-center rounded-lg bg-gov/10 text-gov",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-bold text-slate-900 dark:text-slate-100",
									children: "Scheme Catalog & Rules"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "Review eligibility rules"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 text-slate-400" })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/officer/field-visits",
						className: "rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-gov/50 transition-colors dark:border-slate-800 dark:bg-slate-900",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-bold text-slate-900 dark:text-slate-100",
									children: "Field Visits"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "Conduct on-site inspections"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 text-slate-400" })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/officer/applications",
						className: "rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-gov/50 transition-colors dark:border-slate-800 dark:bg-slate-900",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-700",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-bold text-slate-900 dark:text-slate-100",
									children: "Applications Queue"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "Manage active submissions"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 text-slate-400" })]
						})
					})
				]
			})
		]
	});
}
var $$splitComponentImporter$17 = () => import("./officer.field-visits-Bg5suuGW.mjs");
var Route$20 = createFileRoute("/officer/field-visits")({
	head: () => ({ meta: [{ title: "Field Visits — Field Official Operations" }, {
		name: "description",
		content: "Field inspections, on-site geotagged verification, and physical dwelling audits."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./officer.inbox-Do-bK06f.mjs");
var Route$19 = createFileRoute("/officer/inbox")({
	head: () => ({ meta: [{ title: "Communications — Field Operational Workspace" }, {
		name: "description",
		content: "Official messages, citizen clarifications, assignments and departmental correspondence."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./officer.notifications-5voRZBGw.mjs");
var Route$18 = createFileRoute("/officer/notifications")({
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
var $$splitComponentImporter$14 = () => import("./officer.reports-DJ6CZL1I.mjs");
var Route$17 = createFileRoute("/officer/reports")({
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
var $$splitComponentImporter$13 = () => import("./officer.settings-BFI61o_b.mjs");
var Route$16 = createFileRoute("/officer/settings")({
	head: () => ({ meta: [{ title: "Profile & Field Operations — Field Official" }, {
		name: "description",
		content: "Field verification officer identity, GPS tracking status, and offline route sync."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./officer.verification-BWju5hWc.mjs");
var Route$15 = createFileRoute("/officer/verification")({
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
var $$splitComponentImporter$11 = () => import("./officer_.login-Lb3XE3I-.mjs");
var Route$14 = createFileRoute("/officer_/login")({
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
var $$splitComponentImporter$10 = () => import("./verifier.audit-CWuXDYEK.mjs");
var Route$13 = createFileRoute("/verifier/audit")({
	head: () => ({ meta: [{ title: "Audit Ledger — Verifier Workstation" }, {
		name: "description",
		content: "Cryptographic activity ledger for verification officer determinations."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var Route$12 = createFileRoute("/verifier/dashboard")({
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
var $$splitComponentImporter$9 = () => import("./verifier.documents-DG2tnS4m.mjs");
var Route$11 = createFileRoute("/verifier/documents")({
	head: () => ({ meta: [{ title: "Document Comparison Tool — Verifier Workstation" }, {
		name: "description",
		content: "Side-by-side OCR and registry comparison workstation."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./verifier.escalations-DNnfchW1.mjs");
var Route$10 = createFileRoute("/verifier/escalations")({
	head: () => ({ meta: [{ title: "Escalations & Flags — Verifier Workstation" }, {
		name: "description",
		content: "High-risk cases, policy ambiguities, and supervisor reviews."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./verifier.evidence-DeGYg3Lo.mjs");
var Route$9 = createFileRoute("/verifier/evidence")({
	head: () => ({ meta: [{ title: "Evidence Vault — Verifier Workstation" }, {
		name: "description",
		content: "Versioned inspection media, document uploads, and biometric audit tokens."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var Route$8 = createFileRoute("/verifier/family360")({
	head: () => ({ meta: [
		{ title: "Family360 Intelligence — Verification Officer Workstation" },
		{
			name: "description",
			content: "Multi-generational household graph, relationship evidence, and civil record verification workstation."
		},
		{
			property: "og:title",
			content: "Family360 — Verification Officer"
		}
	] }),
	component: VerifierFamily360Page
});
function VerifierFamily360Page() {
	const [householdInput, setHouseholdInput] = (0, import_react.useState)("MIRA-FAM-10482");
	const [activeHouseholdId, setActiveHouseholdId] = (0, import_react.useState)("MIRA-FAM-10482");
	const handleSearch = (e) => {
		e.preventDefault();
		if (householdInput.trim()) setActiveHouseholdId(householdInput.trim());
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
					title: "Family360 Household Intelligence",
					desc: "Multi-generational relationship verification, civil evidence cross-referencing, and conflict detection.",
					crumbs: [{
						label: "Verification Workstation",
						to: "/verifier/queue"
					}, { label: "Family360" }]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSearch,
					className: "flex items-center gap-2 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-48 sm:w-60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "text",
							placeholder: "Household ID (e.g. MIRA-FAM-10482)...",
							value: householdInput,
							onChange: (e) => setHouseholdInput(e.target.value),
							className: "h-8 pl-8 text-xs font-mono bg-white dark:bg-slate-900"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "sm",
						variant: "outline",
						className: "h-8 text-xs",
						children: "Inspect"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Family360, {
				householdId: activeHouseholdId,
				role: "verifier"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/verifier/queue",
						className: "rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-gov/50 transition-colors dark:border-slate-800 dark:bg-slate-900",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-8 w-8 items-center justify-center rounded-lg bg-gov/10 text-gov",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheckCorner, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-bold text-slate-900 dark:text-slate-100",
									children: "Verification Queue"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "Adjudicate pending claims"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 text-slate-400" })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/verifier/documents",
						className: "rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-gov/50 transition-colors dark:border-slate-800 dark:bg-slate-900",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-700",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-bold text-slate-900 dark:text-slate-100",
									children: "Evidence Vault & OCR"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "Cross-examine documents"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 text-slate-400" })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/verifier/audit",
						className: "rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-gov/50 transition-colors dark:border-slate-800 dark:bg-slate-900",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-bold text-slate-900 dark:text-slate-100",
									children: "Audit Ledger"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "Verify cryptographic seals"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 text-slate-400" })]
						})
					})
				]
			})
		]
	});
}
var $$splitComponentImporter$6 = () => import("./verifier.inbox-COE0cC4n.mjs");
var Route$7 = createFileRoute("/verifier/inbox")({
	head: () => ({ meta: [{ title: "Communications — Verifier Workstation" }, {
		name: "description",
		content: "Official messages, citizen clarifications, assignments and departmental correspondence."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./verifier.mismatches-Dl1k9sIJ.mjs");
var Route$6 = createFileRoute("/verifier/mismatches")({
	head: () => ({ meta: [{ title: "Mismatch Resolution — Verifier Workstation" }, {
		name: "description",
		content: "Triage and resolve cross-registry data mismatches and citizen explanations."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./verifier.queue-CAR9u7uR.mjs");
var Route$5 = createFileRoute("/verifier/queue")({
	head: () => ({ meta: [{ title: "Verification Queue — Verifier Workstation" }, {
		name: "description",
		content: "High-density queue of welfare applications awaiting verification."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./verifier.settings-Dhw6zugF.mjs");
var Route$4 = createFileRoute("/verifier/settings")({
	head: () => ({ meta: [{ title: "Profile & Workstation — Verification Officer" }, {
		name: "description",
		content: "Verification officer identity, workstation parameters, and cryptographic token status."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./citizen.applications.index-9w9r641t.mjs");
var Route$3 = createFileRoute("/citizen/applications/")({
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
var $$splitComponentImporter$1 = () => import("./department.schemes.index-Cx7wq-K6.mjs");
var Route$2 = createFileRoute("/department/schemes/")({
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
var $$splitComponentImporter = () => import("./officer.applications.index-BwGK6org.mjs");
var Route$1 = createFileRoute("/officer/applications/")({
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
var IndexRoute = Route$62.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$63
});
var AuditorRoute = Route$61.update({
	id: "/auditor",
	path: "/auditor",
	getParentRoute: () => Route$63
});
var CitizenRoute = Route$60.update({
	id: "/citizen",
	path: "/citizen",
	getParentRoute: () => Route$63
});
var DepartmentRoute = Route$59.update({
	id: "/department",
	path: "/department",
	getParentRoute: () => Route$63
});
var EligibilityRoute = Route$69.update({
	id: "/eligibility",
	path: "/eligibility",
	getParentRoute: () => Route$63
});
var HelpRoute = Route$70.update({
	id: "/help",
	path: "/help",
	getParentRoute: () => Route$63
});
var LoginRoute = Route$1$74.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$63
});
var OfficerRoute = Route$58.update({
	id: "/officer",
	path: "/officer",
	getParentRoute: () => Route$63
});
var TrackRoute = Route$75.update({
	id: "/track",
	path: "/track",
	getParentRoute: () => Route$63
});
var VerifierRoute = Route$57.update({
	id: "/verifier",
	path: "/verifier",
	getParentRoute: () => Route$63
});
var AuditorApplicationsRoute = Route$56.update({
	id: "/applications",
	path: "/applications",
	getParentRoute: () => AuditorRoute
});
var AuditorAuditRoute = Route$55.update({
	id: "/audit",
	path: "/audit",
	getParentRoute: () => AuditorRoute
});
var AuditorDashboardRoute = Route$54.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuditorRoute
});
var AuditorDecisionsRoute = Route$53.update({
	id: "/decisions",
	path: "/decisions",
	getParentRoute: () => AuditorRoute
});
var AuditorEvidenceRoute = Route$52.update({
	id: "/evidence",
	path: "/evidence",
	getParentRoute: () => AuditorRoute
});
var AuditorExportRoute = Route$51.update({
	id: "/export",
	path: "/export",
	getParentRoute: () => AuditorRoute
});
var AuditorFamily360Route = Route$50.update({
	id: "/family360",
	path: "/family360",
	getParentRoute: () => AuditorRoute
});
var AuditorInboxRoute = Route$49.update({
	id: "/inbox",
	path: "/inbox",
	getParentRoute: () => AuditorRoute
});
var AuditorOfficersRoute = Route$48.update({
	id: "/officers",
	path: "/officers",
	getParentRoute: () => AuditorRoute
});
var AuditorReportsRoute = Route$47.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => AuditorRoute
});
var AuditorRulesRoute = Route$46.update({
	id: "/rules",
	path: "/rules",
	getParentRoute: () => AuditorRoute
});
var AuditorSettingsRoute = Route$45.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AuditorRoute
});
var CitizenBenefitsRoute = Route$44.update({
	id: "/benefits",
	path: "/benefits",
	getParentRoute: () => CitizenRoute
});
var CitizenDashboardRoute = Route$43.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => CitizenRoute
});
var CitizenDocumentsRoute = Route$66.update({
	id: "/documents",
	path: "/documents",
	getParentRoute: () => CitizenRoute
});
var CitizenFamilyRoute = Route$42.update({
	id: "/family",
	path: "/family",
	getParentRoute: () => CitizenRoute
});
var CitizenGrievancesRoute = Route$41.update({
	id: "/grievances",
	path: "/grievances",
	getParentRoute: () => CitizenRoute
});
var CitizenInboxRoute = Route$40.update({
	id: "/inbox",
	path: "/inbox",
	getParentRoute: () => CitizenRoute
});
var CitizenNotificationsRoute = Route$39.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => CitizenRoute
});
var CitizenSettingsRoute = Route$38.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => CitizenRoute
});
var DepartmentApplicationsRoute = Route$37.update({
	id: "/applications",
	path: "/applications",
	getParentRoute: () => DepartmentRoute
});
var DepartmentAuditRoute = Route$36.update({
	id: "/audit",
	path: "/audit",
	getParentRoute: () => DepartmentRoute
});
var DepartmentDashboardRoute = Route$35.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => DepartmentRoute
});
var DepartmentDepartmentsRoute = Route$34.update({
	id: "/departments",
	path: "/departments",
	getParentRoute: () => DepartmentRoute
});
var DepartmentInboxRoute = Route$33.update({
	id: "/inbox",
	path: "/inbox",
	getParentRoute: () => DepartmentRoute
});
var DepartmentIntegrationsRoute = Route$32.update({
	id: "/integrations",
	path: "/integrations",
	getParentRoute: () => DepartmentRoute
});
var DepartmentNotificationsRoute = Route$31.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => DepartmentRoute
});
var DepartmentOperationsRoute = Route$30.update({
	id: "/operations",
	path: "/operations",
	getParentRoute: () => DepartmentRoute
});
var DepartmentReportsRoute = Route$29.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => DepartmentRoute
});
var DepartmentRulesRoute = Route$67.update({
	id: "/rules",
	path: "/rules",
	getParentRoute: () => DepartmentRoute
});
var DepartmentSettingsRoute = Route$28.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => DepartmentRoute
});
var DepartmentWorkflowRoute = Route$27.update({
	id: "/workflow",
	path: "/workflow",
	getParentRoute: () => DepartmentRoute
});
var OfficerAuditRoute = Route$26.update({
	id: "/audit",
	path: "/audit",
	getParentRoute: () => OfficerRoute
});
var OfficerDashboardRoute = Route$25.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => OfficerRoute
});
var OfficerDocumentsRoute = Route$24.update({
	id: "/documents",
	path: "/documents",
	getParentRoute: () => OfficerRoute
});
var OfficerDuplicatesRoute = Route$23.update({
	id: "/duplicates",
	path: "/duplicates",
	getParentRoute: () => OfficerRoute
});
var OfficerEvidenceRoute = Route$22.update({
	id: "/evidence",
	path: "/evidence",
	getParentRoute: () => OfficerRoute
});
var OfficerFamily360Route = Route$21.update({
	id: "/family360",
	path: "/family360",
	getParentRoute: () => OfficerRoute
});
var OfficerFieldVisitsRoute = Route$20.update({
	id: "/field-visits",
	path: "/field-visits",
	getParentRoute: () => OfficerRoute
});
var OfficerInboxRoute = Route$19.update({
	id: "/inbox",
	path: "/inbox",
	getParentRoute: () => OfficerRoute
});
var OfficerNotificationsRoute = Route$18.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => OfficerRoute
});
var OfficerReportsRoute = Route$17.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => OfficerRoute
});
var OfficerSettingsRoute = Route$16.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => OfficerRoute
});
var OfficerVerificationRoute = Route$15.update({
	id: "/verification",
	path: "/verification",
	getParentRoute: () => OfficerRoute
});
var OfficerLoginRoute = Route$14.update({
	id: "/officer_/login",
	path: "/officer/login",
	getParentRoute: () => Route$63
});
var SchemesIndexRoute = Route$74.update({
	id: "/schemes/",
	path: "/schemes/",
	getParentRoute: () => Route$63
});
var SchemesIdRoute = Route$76.update({
	id: "/schemes/$id",
	path: "/schemes/$id",
	getParentRoute: () => Route$63
});
var VerifierAuditRoute = Route$13.update({
	id: "/audit",
	path: "/audit",
	getParentRoute: () => VerifierRoute
});
var VerifierDashboardRoute = Route$12.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => VerifierRoute
});
var VerifierDocumentsRoute = Route$11.update({
	id: "/documents",
	path: "/documents",
	getParentRoute: () => VerifierRoute
});
var VerifierEscalationsRoute = Route$10.update({
	id: "/escalations",
	path: "/escalations",
	getParentRoute: () => VerifierRoute
});
var VerifierEvidenceRoute = Route$9.update({
	id: "/evidence",
	path: "/evidence",
	getParentRoute: () => VerifierRoute
});
var VerifierFamily360Route = Route$8.update({
	id: "/family360",
	path: "/family360",
	getParentRoute: () => VerifierRoute
});
var VerifierInboxRoute = Route$7.update({
	id: "/inbox",
	path: "/inbox",
	getParentRoute: () => VerifierRoute
});
var VerifierMismatchesRoute = Route$6.update({
	id: "/mismatches",
	path: "/mismatches",
	getParentRoute: () => VerifierRoute
});
var VerifierQueueRoute = Route$5.update({
	id: "/queue",
	path: "/queue",
	getParentRoute: () => VerifierRoute
});
var VerifierSettingsRoute = Route$4.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => VerifierRoute
});
var CitizenApplicationsIndexRoute = Route$3.update({
	id: "/applications/",
	path: "/applications/",
	getParentRoute: () => CitizenRoute
});
var CitizenApplicationsIdRoute = Route$64.update({
	id: "/applications/$id",
	path: "/applications/$id",
	getParentRoute: () => CitizenRoute
});
var CitizenApplySchemeIdRoute = Route$65.update({
	id: "/apply/$schemeId",
	path: "/apply/$schemeId",
	getParentRoute: () => CitizenRoute
});
var DepartmentSchemesIndexRoute = Route$2.update({
	id: "/schemes/",
	path: "/schemes/",
	getParentRoute: () => DepartmentRoute
});
var DepartmentSchemesIdRoute = Route$68.update({
	id: "/schemes/$id",
	path: "/schemes/$id",
	getParentRoute: () => DepartmentRoute
});
var OfficerApplicationsIndexRoute = Route$1.update({
	id: "/applications/",
	path: "/applications/",
	getParentRoute: () => OfficerRoute
});
var OfficerApplicationsIdRoute = Route$71.update({
	id: "/applications/$id",
	path: "/applications/$id",
	getParentRoute: () => OfficerRoute
});
var OfficerCitizensIdRoute = Route$72.update({
	id: "/citizens/$id",
	path: "/citizens/$id",
	getParentRoute: () => OfficerRoute
});
var OfficerFamiliesIdRoute = Route$73.update({
	id: "/families/$id",
	path: "/families/$id",
	getParentRoute: () => OfficerRoute
});
var VerifierApplicationsIdRoute = Route$77.update({
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
	AuditorFamily360Route,
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
	OfficerFamily360Route,
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
	VerifierFamily360Route,
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
var routeTree = Route$63._addFileChildren(rootRouteChildren)._addFileTypes();
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
