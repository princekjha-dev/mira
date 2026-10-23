import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as AppStateProvider } from "./button-B0ZnFkgi.mjs";
import { S as useRouter, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, v as createFileRoute, y as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route$27 } from "./citizen.applications._id-JuC0dJ0N.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$28 } from "./citizen.apply._schemeId-C27Cx4NY.mjs";
import { t as Route$29 } from "./citizen.documents-D83DG79G.mjs";
import { o as SiteFooter, s as SiteHeader } from "./SiteHeader-BYGnYAyt.mjs";
import { t as Route$30 } from "./department.rules-twpQu8PR.mjs";
import { t as Route$31 } from "./department.schemes._id-sI9SYMO5.mjs";
import { t as Route$32 } from "./eligibility-DaEYWF6y.mjs";
import { t as Route$33 } from "./help-D4vHudD2.mjs";
import { t as Route$34 } from "./officer.applications._id-CrY_vklN.mjs";
import { t as Route$35 } from "./officer.citizens._id-Cpkxsna-.mjs";
import { t as Route$36 } from "./officer.families._id-CpbghG9h.mjs";
import { n as Route$37 } from "./login-CPKCO_LO.mjs";
import { t as Route$38 } from "./track-BJ4Wxl1f.mjs";
import { t as Route$39 } from "./schemes.index-BvGBku3I.mjs";
import { t as Route$40 } from "./schemes._id-Jp19e_AH.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-HCogMjU8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-EkG61A9n.css";
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
var Route$26 = createRootRouteWithContext()({
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
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
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
	const { queryClient } = Route$26.useRouteContext();
	const path = useRouterState({ select: (s) => s.location.pathname });
	const workspace = path.startsWith("/officer") && !path.startsWith("/officer/login") || path.startsWith("/department");
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
var $$splitComponentImporter$25 = () => import("./routes-CKWjME45.mjs");
var Route$25 = createFileRoute("/")({
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
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("./citizen-D5qkFs38.mjs");
var Route$24 = createFileRoute("/citizen")({ component: lazyRouteComponent($$splitComponentImporter$24, "component") });
var $$splitComponentImporter$23 = () => import("./department-BcI7fTZ6.mjs");
var Route$23 = createFileRoute("/department")({ component: lazyRouteComponent($$splitComponentImporter$23, "component") });
var $$splitComponentImporter$22 = () => import("./officer-CTLI8k-x.mjs");
var Route$22 = createFileRoute("/officer")({ component: lazyRouteComponent($$splitComponentImporter$22, "component") });
var $$splitComponentImporter$21 = () => import("./citizen.benefits-DJU-Exo8.mjs");
var Route$21 = createFileRoute("/citizen/benefits")({
	head: () => ({ meta: [{ title: "Benefits and assistance — Mira" }, {
		name: "description",
		content: "View benefits available to your household and track support received."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./citizen.dashboard-BDG3_6Zc.mjs");
var Route$20 = createFileRoute("/citizen/dashboard")({
	head: () => ({ meta: [
		{ title: "My Dashboard — Citizen" },
		{
			name: "description",
			content: "Your applications, household and document status."
		},
		{
			property: "og:title",
			content: "Citizen Dashboard"
		},
		{
			property: "og:description",
			content: "Your citizen services at a glance."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./citizen.family-Bm3GG-1d.mjs");
var Route$19 = createFileRoute("/citizen/family")({
	head: () => ({ meta: [
		{ title: "My Family Record — Citizen" },
		{
			name: "description",
			content: "Household overview, members, relationships and lifecycle events."
		},
		{
			property: "og:title",
			content: "My Family Record"
		},
		{
			property: "og:description",
			content: "Your verified household record."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./citizen.grievances-3Hgsayjo.mjs");
var Route$18 = createFileRoute("/citizen/grievances")({
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
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./citizen.notifications-DT05Urjf.mjs");
var Route$17 = createFileRoute("/citizen/notifications")({
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
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./citizen.settings-BT8_Fzpx.mjs");
var Route$16 = createFileRoute("/citizen/settings")({
	head: () => ({ meta: [
		{ title: "Settings — Citizen" },
		{
			name: "description",
			content: "Language, accessibility, notifications, privacy and security settings."
		},
		{
			property: "og:title",
			content: "Settings"
		},
		{
			property: "og:description",
			content: "Manage your preferences."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./department.audit-D7iEysBF.mjs");
var Route$15 = createFileRoute("/department/audit")({
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
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./department.dashboard-BTaWoQDk.mjs");
var Route$14 = createFileRoute("/department/dashboard")({
	head: () => ({ meta: [
		{ title: "Department Portal — Dashboard" },
		{
			name: "description",
			content: "Scheme administration, rules, integrations and audit."
		},
		{
			property: "og:title",
			content: "Department Portal"
		},
		{
			property: "og:description",
			content: "Department administration dashboard."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./department.integrations-R9ViYg2x.mjs");
var Route$13 = createFileRoute("/department/integrations")({
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
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./department.reports-Of76ZVEQ.mjs");
var Route$12 = createFileRoute("/department/reports")({
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
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./officer.audit-ChDYildM.mjs");
var Route$11 = createFileRoute("/officer/audit")({
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
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./officer.dashboard-CNZzH65B.mjs");
var Route$10 = createFileRoute("/officer/dashboard")({
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
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./officer.documents-CItZYToa.mjs");
var Route$9 = createFileRoute("/officer/documents")({
	head: () => ({ meta: [{ title: "Documents — Mira" }, {
		name: "description",
		content: "Private citizen documents available to your authorized review scope."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./officer.duplicates-BS-9lsYT.mjs");
var Route$8 = createFileRoute("/officer/duplicates")({
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
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./officer.notifications-B7PqK7c7.mjs");
var Route$7 = createFileRoute("/officer/notifications")({
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
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./officer.reports-DSPvF7a4.mjs");
var Route$6 = createFileRoute("/officer/reports")({
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
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./officer.settings-C4ubeAGL.mjs");
var Route$5 = createFileRoute("/officer/settings")({
	head: () => ({ meta: [
		{ title: "Settings — Officer" },
		{
			name: "description",
			content: "Officer profile, security and accessibility settings."
		},
		{
			property: "og:title",
			content: "Officer Settings"
		},
		{
			property: "og:description",
			content: "Officer settings."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./officer.verification-BXF815BO.mjs");
var Route$4 = createFileRoute("/officer/verification")({
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
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./officer_.login-Bfw4wYjS.mjs");
var Route$3 = createFileRoute("/officer_/login")({
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
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./citizen.applications.index-C-ClLW_4.mjs");
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
var $$splitComponentImporter$1 = () => import("./department.schemes.index-BEqLSM_K.mjs");
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
var $$splitComponentImporter = () => import("./officer.applications.index-B2FNJTvW.mjs");
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
var IndexRoute = Route$25.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$26
});
var CitizenRoute = Route$24.update({
	id: "/citizen",
	path: "/citizen",
	getParentRoute: () => Route$26
});
var DepartmentRoute = Route$23.update({
	id: "/department",
	path: "/department",
	getParentRoute: () => Route$26
});
var EligibilityRoute = Route$32.update({
	id: "/eligibility",
	path: "/eligibility",
	getParentRoute: () => Route$26
});
var HelpRoute = Route$33.update({
	id: "/help",
	path: "/help",
	getParentRoute: () => Route$26
});
var LoginRoute = Route$37.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$26
});
var OfficerRoute = Route$22.update({
	id: "/officer",
	path: "/officer",
	getParentRoute: () => Route$26
});
var TrackRoute = Route$38.update({
	id: "/track",
	path: "/track",
	getParentRoute: () => Route$26
});
var CitizenBenefitsRoute = Route$21.update({
	id: "/benefits",
	path: "/benefits",
	getParentRoute: () => CitizenRoute
});
var CitizenDashboardRoute = Route$20.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => CitizenRoute
});
var CitizenDocumentsRoute = Route$29.update({
	id: "/documents",
	path: "/documents",
	getParentRoute: () => CitizenRoute
});
var CitizenFamilyRoute = Route$19.update({
	id: "/family",
	path: "/family",
	getParentRoute: () => CitizenRoute
});
var CitizenGrievancesRoute = Route$18.update({
	id: "/grievances",
	path: "/grievances",
	getParentRoute: () => CitizenRoute
});
var CitizenNotificationsRoute = Route$17.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => CitizenRoute
});
var CitizenSettingsRoute = Route$16.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => CitizenRoute
});
var DepartmentAuditRoute = Route$15.update({
	id: "/audit",
	path: "/audit",
	getParentRoute: () => DepartmentRoute
});
var DepartmentDashboardRoute = Route$14.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => DepartmentRoute
});
var DepartmentIntegrationsRoute = Route$13.update({
	id: "/integrations",
	path: "/integrations",
	getParentRoute: () => DepartmentRoute
});
var DepartmentReportsRoute = Route$12.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => DepartmentRoute
});
var DepartmentRulesRoute = Route$30.update({
	id: "/rules",
	path: "/rules",
	getParentRoute: () => DepartmentRoute
});
var OfficerAuditRoute = Route$11.update({
	id: "/audit",
	path: "/audit",
	getParentRoute: () => OfficerRoute
});
var OfficerDashboardRoute = Route$10.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => OfficerRoute
});
var OfficerDocumentsRoute = Route$9.update({
	id: "/documents",
	path: "/documents",
	getParentRoute: () => OfficerRoute
});
var OfficerDuplicatesRoute = Route$8.update({
	id: "/duplicates",
	path: "/duplicates",
	getParentRoute: () => OfficerRoute
});
var OfficerNotificationsRoute = Route$7.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => OfficerRoute
});
var OfficerReportsRoute = Route$6.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => OfficerRoute
});
var OfficerSettingsRoute = Route$5.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => OfficerRoute
});
var OfficerVerificationRoute = Route$4.update({
	id: "/verification",
	path: "/verification",
	getParentRoute: () => OfficerRoute
});
var OfficerLoginRoute = Route$3.update({
	id: "/officer_/login",
	path: "/officer/login",
	getParentRoute: () => Route$26
});
var SchemesIndexRoute = Route$39.update({
	id: "/schemes/",
	path: "/schemes/",
	getParentRoute: () => Route$26
});
var SchemesIdRoute = Route$40.update({
	id: "/schemes/$id",
	path: "/schemes/$id",
	getParentRoute: () => Route$26
});
var CitizenApplicationsIndexRoute = Route$2.update({
	id: "/applications/",
	path: "/applications/",
	getParentRoute: () => CitizenRoute
});
var CitizenApplicationsIdRoute = Route$27.update({
	id: "/applications/$id",
	path: "/applications/$id",
	getParentRoute: () => CitizenRoute
});
var CitizenApplySchemeIdRoute = Route$28.update({
	id: "/apply/$schemeId",
	path: "/apply/$schemeId",
	getParentRoute: () => CitizenRoute
});
var DepartmentSchemesIndexRoute = Route$1.update({
	id: "/schemes/",
	path: "/schemes/",
	getParentRoute: () => DepartmentRoute
});
var DepartmentSchemesIdRoute = Route$31.update({
	id: "/schemes/$id",
	path: "/schemes/$id",
	getParentRoute: () => DepartmentRoute
});
var OfficerApplicationsIndexRoute = Route.update({
	id: "/applications/",
	path: "/applications/",
	getParentRoute: () => OfficerRoute
});
var OfficerApplicationsIdRoute = Route$34.update({
	id: "/applications/$id",
	path: "/applications/$id",
	getParentRoute: () => OfficerRoute
});
var OfficerCitizensIdRoute = Route$35.update({
	id: "/citizens/$id",
	path: "/citizens/$id",
	getParentRoute: () => OfficerRoute
});
var OfficerFamiliesIdRoute = Route$36.update({
	id: "/families/$id",
	path: "/families/$id",
	getParentRoute: () => OfficerRoute
});
var CitizenRouteChildren = {
	CitizenBenefitsRoute,
	CitizenDashboardRoute,
	CitizenDocumentsRoute,
	CitizenFamilyRoute,
	CitizenGrievancesRoute,
	CitizenNotificationsRoute,
	CitizenSettingsRoute,
	CitizenApplicationsIdRoute,
	CitizenApplySchemeIdRoute,
	CitizenApplicationsIndexRoute
};
var CitizenRouteWithChildren = CitizenRoute._addFileChildren(CitizenRouteChildren);
var DepartmentRouteChildren = {
	DepartmentAuditRoute,
	DepartmentDashboardRoute,
	DepartmentIntegrationsRoute,
	DepartmentReportsRoute,
	DepartmentRulesRoute,
	DepartmentSchemesIdRoute,
	DepartmentSchemesIndexRoute
};
var DepartmentRouteWithChildren = DepartmentRoute._addFileChildren(DepartmentRouteChildren);
var OfficerRouteChildren = {
	OfficerAuditRoute,
	OfficerDashboardRoute,
	OfficerDocumentsRoute,
	OfficerDuplicatesRoute,
	OfficerNotificationsRoute,
	OfficerReportsRoute,
	OfficerSettingsRoute,
	OfficerVerificationRoute,
	OfficerApplicationsIdRoute,
	OfficerCitizensIdRoute,
	OfficerFamiliesIdRoute,
	OfficerApplicationsIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	CitizenRoute: CitizenRouteWithChildren,
	DepartmentRoute: DepartmentRouteWithChildren,
	EligibilityRoute,
	HelpRoute,
	LoginRoute,
	OfficerRoute: OfficerRoute._addFileChildren(OfficerRouteChildren),
	TrackRoute,
	OfficerLoginRoute,
	SchemesIdRoute,
	SchemesIndexRoute
};
var routeTree = Route$26._addFileChildren(rootRouteChildren)._addFileTypes();
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
