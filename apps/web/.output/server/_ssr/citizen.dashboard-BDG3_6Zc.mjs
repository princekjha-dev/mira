import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { C as getScheme, S as fmtDate, k as useApp, m as apiRequest, r as Button } from "./button-B0ZnFkgi.mjs";
import { b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { G as ListChecks, L as MessageSquareWarning, Q as History, St as ClipboardList, Ut as ArrowRight, f as UserPen, gt as FileCheckCorner, o as Users, st as FolderOpen } from "../_libs/lucide-react.mjs";
import { c as Panel, d as StatusBadge } from "./ui-BPP2eTpy.mjs";
import { t as Progress } from "./progress-DykNykY6.mjs";
import { i as formatBytes, r as DocumentViewer } from "./DocumentViewer-INJrCOZj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/citizen.dashboard-BDG3_6Zc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ACTIONS = [
	{
		to: "/schemes",
		icon: ClipboardList,
		label: "Apply for Scheme"
	},
	{
		to: "/eligibility",
		icon: ListChecks,
		label: "Check Eligibility"
	},
	{
		to: "/citizen/applications",
		icon: FileCheckCorner,
		label: "Track Application"
	},
	{
		to: "/citizen/family",
		icon: Users,
		label: "My Family"
	},
	{
		to: "/citizen/documents",
		icon: FolderOpen,
		label: "My Documents"
	},
	{
		to: "/citizen/benefits",
		icon: History,
		label: "Benefit History"
	},
	{
		to: "/citizen/family",
		icon: UserPen,
		label: "Update Family Details"
	},
	{
		to: "/citizen/grievances",
		icon: MessageSquareWarning,
		label: "Raise Grievance"
	}
];
function Dash() {
	const { state } = useApp();
	const navigate = useNavigate();
	const [documents, setDocuments] = (0, import_react.useState)([]);
	const [previewDoc, setPreviewDoc] = (0, import_react.useState)(null);
	const [greet, setGreet] = (0, import_react.useState)("Welcome");
	(0, import_react.useEffect)(() => {
		const h = (/* @__PURE__ */ new Date()).getHours();
		setGreet(h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening");
	}, []);
	(0, import_react.useEffect)(() => {
		if (!state.session?.apiToken) return;
		let active = true;
		apiRequest(state.session, "/api/v1/documents?owner_type=CITIZEN").then((result) => active && setDocuments(result.data.filter((doc) => doc.status !== "REVOKED").slice(0, 5))).catch(() => active && setDocuments([]));
		return () => {
			active = false;
		};
	}, [state.session?.apiToken, state.session?.apiUserId]);
	const mine = state.applications;
	const action = mine.filter((a) => a.status === "Verification Required" || a.status === "Additional Evidence Required" || a.status === "Draft");
	const inProgress = mine.filter((a) => ![
		"Draft",
		"Approved",
		"Rejected"
	].includes(a.status)).length;
	const received = state.benefits.filter((benefit) => ["Disbursed", "Completed"].includes(benefit.status)).length;
	const docsOk = documents.filter((d) => d.verification_status === "VERIFIED").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "text-2xl font-semibold text-navy",
				children: [
					greet,
					", ",
					state.session?.name
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: state.session?.isDemo ? "Demo account · Synthetic records" : "Your Mira account"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Applications in progress"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xl font-semibold",
							children: inProgress
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/citizen/applications",
							className: "mt-3 inline-block text-xs text-gov hover:underline",
							children: "View applications"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Benefits received"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xl font-semibold",
							children: received
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/citizen/benefits",
							className: "mt-3 inline-block text-xs text-gov hover:underline",
							children: "View benefit history"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Verified documents"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xl font-semibold",
							children: docsOk
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							value: documents.length ? docsOk / documents.length * 100 : 0,
							className: "mt-2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/citizen/documents",
							search: { upload: false },
							className: "mt-2 inline-block text-xs text-gov hover:underline",
							children: "Review documents"
						})
					] })
				]
			}),
			action.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: `Needs your attention (${action.length})`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y",
					children: action.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center justify-between gap-2 py-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: getScheme(a.schemeId)?.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								a.id,
								" · updated ",
								fmtDate(a.updatedOn)
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { s: a.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/citizen/applications/$id",
									params: { id: a.id },
									children: "Open"
								})
							})]
						})]
					}, a.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "My Documents",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => void navigate({
							to: "/citizen/documents",
							search: { upload: true }
						}),
						children: "Upload document"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/citizen/documents",
							search: { upload: false },
							children: "View all documents"
						})
					})]
				}),
				children: documents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-4 text-sm text-muted-foreground",
					children: "No documents uploaded yet. Upload files to reuse them across applications."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y",
					children: documents.slice(0, 4).map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center justify-between gap-2 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setPreviewDoc(doc),
							className: "min-w-0 text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block truncate text-sm font-medium text-slate-900",
								children: doc.original_filename
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: [
									formatBytes(doc.size_bytes),
									" ·",
									" ",
									new Date(doc.created_at).toLocaleDateString("en-IN")
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `rounded-full px-2 py-1 text-xs ${doc.verification_status === "VERIFIED" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`,
							children: doc.verification_status === "VERIFIED" ? "Verified" : doc.verification_status === "REJECTED" ? "Rejected" : "Review required"
						})]
					}, doc.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 font-semibold text-navy",
				children: "Services"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
				children: ACTIONS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: a.to,
					className: "group flex flex-col gap-2 rounded-lg border bg-card p-4 hover:border-gov",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(a.icon, { className: "h-5 w-5 text-gov" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center justify-between text-sm font-medium",
						children: [a.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5 text-muted-foreground group-hover:text-gov" })]
					})]
				}, a.label))
			})] }),
			state.session && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentViewer, {
				document: previewDoc,
				session: state.session,
				onClose: () => setPreviewDoc(null),
				onChanged: () => {
					if (!state.session?.apiToken) return;
					apiRequest(state.session, "/api/v1/documents?owner_type=CITIZEN").then((result) => setDocuments(result.data.filter((doc) => doc.status !== "REVOKED").slice(0, 5))).catch(() => void 0);
				}
			})
		]
	});
}
//#endregion
export { Dash as component };
