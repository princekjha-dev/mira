import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { F as useApp, S as fetchMyFamily, T as getScheme, m as apiRequest, w as fmtDate } from "./app-state-7jSiCijd.mjs";
import { t as Button } from "./button-BT328xhy.mjs";
import { S as useNavigate, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { $t as CreditCard, Ct as House, Mt as FolderOpen, Pn as ArrowRight, _ as TriangleAlert, et as MessageSquareWarning, ft as ListChecks, l as Users, m as UserPen, pn as CircleCheck, qt as FileCheckCorner, sn as ClipboardList, wt as History } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as formatBytes, r as DocumentViewer } from "./DocumentViewer-RIeDKuW9.mjs";
import { a as MiraSectionHeader, i as MiraPageHeader, n as MiraCard, o as MiraStatCard, r as MiraEmptyState, s as MiraStatus } from "./MiraPrimitives-BaYHdl2h.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/citizen.dashboard-C9VOzohk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var QUICK_SERVICES = [
	{
		to: "/schemes",
		icon: ClipboardList,
		label: "Apply for Scheme",
		desc: "Discover active welfare programs"
	},
	{
		to: "/eligibility",
		icon: ListChecks,
		label: "Check Eligibility",
		desc: "Instant automated criteria test"
	},
	{
		to: "/citizen/applications",
		icon: FileCheckCorner,
		label: "Track Application",
		desc: "Real-time verification telemetry"
	},
	{
		to: "/citizen/family",
		icon: Users,
		label: "My Family Tree",
		desc: "Verified household roster"
	},
	{
		to: "/citizen/documents",
		icon: FolderOpen,
		label: "Civil Documents",
		desc: "Attested digital certificates"
	},
	{
		to: "/citizen/benefits",
		icon: History,
		label: "Benefit Disbursements",
		desc: "Direct benefit transfer logs"
	},
	{
		to: "/citizen/family",
		icon: UserPen,
		label: "Report Life Event",
		desc: "Birth, marriage & address changes"
	},
	{
		to: "/citizen/grievances",
		icon: MessageSquareWarning,
		label: "Lodge Grievance",
		desc: "Direct supervisory escalation"
	}
];
function CitizenDashboard() {
	const { state } = useApp();
	const navigate = useNavigate();
	const [documents, setDocuments] = (0, import_react.useState)([]);
	const [previewDoc, setPreviewDoc] = (0, import_react.useState)(null);
	const [greeting, setGreeting] = (0, import_react.useState)("Good day");
	const { data: family } = useQuery({
		queryKey: ["my-family", state.session?.apiUserId],
		queryFn: () => fetchMyFamily(state.session),
		enabled: !!state.session
	});
	(0, import_react.useEffect)(() => {
		const hour = (/* @__PURE__ */ new Date()).getHours();
		if (hour < 12) setGreeting("Good morning");
		else if (hour < 17) setGreeting("Good afternoon");
		else setGreeting("Good evening");
	}, []);
	(0, import_react.useEffect)(() => {
		if (!state.session?.apiToken) return;
		let active = true;
		apiRequest(state.session, "/api/v1/documents?owner_type=CITIZEN").then((result) => {
			if (active) setDocuments(result.data.filter((doc) => doc.status !== "REVOKED").slice(0, 5));
		}).catch(() => {
			if (active) setDocuments([]);
		});
		return () => {
			active = false;
		};
	}, [state.session?.apiToken, state.session?.apiUserId]);
	const applications = state.applications;
	const actionRequiredApps = applications.filter((a) => a.status === "Verification Required" || a.status === "Additional Evidence Required" || a.status === "Draft");
	const inProgressCount = applications.filter((a) => ![
		"Draft",
		"Approved",
		"Rejected"
	].includes(a.status)).length;
	const disbursedBenefits = state.benefits.filter((b) => ["Disbursed", "Completed"].includes(b.status)).length;
	const verifiedDocsCount = documents.filter((d) => d.verification_status === "VERIFIED").length;
	const citizenName = state.session?.name || "Rajesh Sharma";
	const householdName = family?.household_name || "Sharma Family";
	const householdId = family?.household_public_id || "MIRA-FAM-10482";
	const memberCount = family?.members?.length || 11;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-7 pb-12 animate-in fade-in duration-200",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraPageHeader, {
				context: "Citizen account",
				title: `${greeting}, ${citizenName}`,
				description: "Unified welfare eligibility, household civil registry, and verified direct entitlement services.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						asChild: true,
						className: "h-8.5 rounded-lg border-border/80 bg-background/80 px-3.5 text-xs font-medium shadow-2xs hover:bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/citizen/family",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mr-1.5 h-3.5 w-3.5 text-muted-foreground" }), "View Family Tree"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						asChild: true,
						className: "h-8.5 rounded-lg bg-primary px-3.5 text-xs font-medium text-primary-foreground shadow-2xs hover:bg-primary/95",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/schemes",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "mr-1.5 h-3.5 w-3.5" }), "Explore Schemes"]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-border/80 bg-gradient-to-b from-card via-card to-muted/20 p-5 shadow-xs",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/5 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-base font-semibold tracking-tight text-foreground",
									children: householdName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded border border-border/60",
									children: householdId
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraStatus, { status: family?.verification_status || "Verified" })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground leading-normal",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-medium text-foreground",
									children: [memberCount, " registered members"]
								}),
								" ·",
								" ",
								family?.bpl_status || "BPL Category A",
								" · ",
								family?.income_category || "Annual Income < ₹1.2L",
								" · Verified via Civil Registration"
							]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2 sm:self-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							asChild: true,
							className: "h-8 rounded-lg text-xs font-medium",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/citizen/family",
								children: ["Manage Household", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1.5 h-3.5 w-3.5 text-muted-foreground" })]
							})
						})
					})]
				})
			}),
			actionRequiredApps.some((a) => a.status === "Additional Evidence Required" || a.status === "Verification Required") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-amber-500/30 bg-amber-500/10 p-4.5 text-amber-950 dark:text-amber-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4.5 w-4.5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xs font-semibold tracking-tight",
							children: "Officer Clarification Requested"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-amber-900/90 dark:text-amber-300/90 leading-relaxed",
							children: "The verification officer has requested supporting documentation for your pending application. Review details and upload attested documents to prevent SLA delays."
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						asChild: true,
						className: "h-8 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-medium shrink-0 shadow-2xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/citizen/applications",
							children: ["Respond to Request", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1.5 h-3.5 w-3.5" })]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraStatCard, {
						title: "Applications in Progress",
						value: inProgressCount,
						subtext: "Under statutory review",
						icon: FileCheckCorner
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraStatCard, {
						title: "Disbursed Benefits",
						value: disbursedBenefits,
						subtext: "Direct bank transfers",
						icon: CreditCard,
						trend: {
							label: "Active",
							tone: "positive"
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraStatCard, {
						title: "Verified Documents",
						value: verifiedDocsCount,
						subtext: `of ${documents.length || 5} civil proofs`,
						icon: FolderOpen,
						trend: {
							label: "Attested",
							tone: "positive"
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraStatCard, {
						title: "Household Members",
						value: memberCount,
						subtext: "Verified kinship registry",
						icon: Users
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
							title: "Active Applications",
							description: "Real-time statutory status and verification progression.",
							action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "ghost",
								asChild: true,
								className: "h-7 text-xs text-muted-foreground hover:text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/citizen/applications",
									children: [
										"View all (",
										applications.length,
										")"
									]
								})
							})
						}), applications.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraEmptyState, {
							icon: FileCheckCorner,
							title: "No active applications",
							description: "Explore schemes and check eligibility to apply for welfare support.",
							action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								asChild: true,
								className: "mt-2 text-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/schemes",
									children: "Apply for Scheme"
								})
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 divide-y divide-border/60",
							children: applications.slice(0, 4).map((app) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5 first:pt-1 last:pb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1 min-w-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 flex-wrap",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-medium font-mono text-muted-foreground",
													children: app.id
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraStatus, { status: app.status }),
												app.duplicate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-400 border border-amber-500/20",
													children: "Duplicate Alert"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-sm font-semibold text-foreground truncate",
											children: getScheme(app.schemeId)?.name || "Welfare Assistance Scheme"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] text-muted-foreground",
											children: [
												"Updated ",
												fmtDate(app.updatedOn),
												" · Assigned to district verification queue"
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
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/citizen/applications/$id",
											params: { id: app.id },
											children: "View Details"
										})
									})
								})]
							}, app.id))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MiraCard, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraSectionHeader, {
							title: "Citizen Services",
							description: "Direct access to lifecycle claims, family registry updates, and scheme discovery."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4",
							children: QUICK_SERVICES.map((srv) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: srv.to,
								className: "group flex flex-col justify-between rounded-xl border border-border/70 bg-card p-3.5 transition-all duration-150 hover:border-primary/40 hover:bg-muted/30",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-foreground group-hover:text-primary transition-colors",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(srv.icon, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3 text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold text-foreground tracking-tight block",
										children: srv.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-0.5 text-[10px] text-muted-foreground line-clamp-1 block",
										children: srv.desc
									})]
								})]
							}, srv.label))
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(MiraCard, {
						className: "p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraSectionHeader, {
								title: "Verified Documents",
								description: "Official proofs linked to your household.",
								action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => void navigate({
										to: "/citizen/documents",
										search: { upload: true }
									}),
									className: "h-7 text-xs text-primary hover:text-primary/90",
									children: "Upload New"
								})
							}),
							documents.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: "No documents uploaded yet. Attested proofs will appear here."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 divide-y divide-border/60",
								children: documents.slice(0, 4).map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setPreviewDoc(doc),
									className: "w-full text-left py-3 first:pt-1 last:pb-1 flex items-center justify-between gap-3 group hover:bg-muted/20 -mx-1 px-1 rounded transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate text-xs font-medium text-foreground group-hover:text-primary transition-colors",
											children: doc.original_filename
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[11px] text-muted-foreground",
											children: [
												formatBytes(doc.size_bytes),
												" · ",
												new Date(doc.created_at).toLocaleDateString("en-IN")
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraStatus, { status: doc.verification_status === "VERIFIED" ? "Verified" : "Pending" })]
								}, doc.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Verification Rate"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold text-teal-600 dark:text-teal-400",
									children: [documents.length ? Math.round(verifiedDocsCount / documents.length * 100) : 100, "%"]
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraCard, {
						className: "p-4.5 bg-muted/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Your household record is protected by statutory end-to-end audit seals. All eligibility determinations are reproducible on the public ledger." })]
						})
					})]
				})]
			}),
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
export { CitizenDashboard as component };
