import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as AccordionTrigger$1, i as AccordionItem$1, n as AccordionContent$1, r as AccordionHeader, t as Accordion$1, y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { M as useApp, l as SCHEMES } from "./app-state-DFvYNEHf.mjs";
import { r as cn, t as Button } from "./button-PwNqyxv_.mjs";
import { S as useNavigate, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Dt as FolderOpen, Ht as FileCheckCorner, On as ArrowRight, c as UsersRound, fn as ChevronDown, j as Search, o as WalletCards, on as CircleQuestionMark, r as Wrench, u as UserRound } from "../_libs/lucide-react.mjs";
import { a as PageContainer, o as PageHeader, s as Panel, t as Empty } from "./ui-C30c-cKm.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { n as MiraCard } from "./MiraPrimitives-aHc1BdE1.mjs";
import { t as Route } from "./help-BwQInenP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/help-CXUunf1u.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Accordion = Accordion$1;
var AccordionItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionItem$1, {
	ref,
	className: cn("border-b", className),
	...props
}));
AccordionItem.displayName = "AccordionItem";
var AccordionTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionHeader, {
	className: "flex",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionTrigger$1, {
		ref,
		className: cn("flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })]
	})
}));
AccordionTrigger.displayName = AccordionTrigger$1.displayName;
var AccordionContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent$1, {
	ref,
	className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("pb-4 pt-0", className),
		children
	})
}));
AccordionContent.displayName = AccordionContent$1.displayName;
var FAQ = [
	{
		category: "Account",
		question: "How do I sign in to Mira?",
		answer: "Choose Sign In and follow the identity verification steps shown for your account."
	},
	{
		category: "Account",
		question: "How do I update my account details?",
		answer: "Open account settings after signing in to view the profile information and preferences available to you."
	},
	{
		category: "Applications",
		question: "Why does my application say Verification Required?",
		answer: "Some information needs a document or record check by an authorised reviewer. This status is not a rejection. Open the application to see any requested next steps."
	},
	{
		category: "Applications",
		question: "Can I edit a submitted application?",
		answer: "Submitted applications can't be edited directly. If more information is needed, open the application and respond to the request shown there."
	},
	{
		category: "Documents",
		question: "Which document formats can I upload?",
		answer: "PDF, JPG, JPEG, PNG and WEBP are accepted for citizen documents, up to 25 MB per file. Mira optimizes supported large images before upload."
	},
	{
		category: "Documents",
		question: "What does Review required mean?",
		answer: "Your document has been stored, but a reviewer still needs to check it. Uploading a document and verifying it are separate steps."
	},
	{
		category: "Eligibility",
		question: "How is eligibility checked?",
		answer: "Mira compares the information you provide with the scheme criteria and explains the result. The final decision is made during application review."
	},
	{
		category: "Benefits",
		question: "Where can I see benefits already received?",
		answer: "Open Benefits and assistance to see benefit records available to your signed-in account."
	},
	{
		category: "Family Records",
		question: "How do I request a family record correction?",
		answer: "Open My Family Record to review the available record request options. Submitted changes may need verification."
	},
	{
		category: "Technical Support",
		question: "A page did not load. What should I do?",
		answer: "Retry the page. If the issue continues, use Raise a grievance to describe the service problem."
	}
];
var CATEGORIES = [
	{
		label: "Applications",
		to: "/citizen/applications",
		icon: FileCheckCorner
	},
	{
		label: "Documents",
		to: "/citizen/documents",
		icon: FolderOpen
	},
	{
		label: "Eligibility",
		to: "/eligibility",
		icon: CircleQuestionMark
	},
	{
		label: "Benefits",
		to: "/citizen/benefits",
		icon: WalletCards
	},
	{
		label: "Account",
		to: "/citizen/settings",
		icon: UserRound
	},
	{
		label: "Family records",
		to: "/citizen/family",
		icon: UsersRound
	},
	{
		label: "Technical support",
		to: "/citizen/grievances",
		icon: Wrench
	}
];
function Help() {
	const { state } = useApp();
	const search = Route.useSearch();
	const navigate = useNavigate({ from: "/help" });
	const [query, setQuery] = (0, import_react.useState)(search.q || "");
	const [searched, setSearched] = (0, import_react.useState)(search.q || "");
	const [grievanceId, setGrievanceId] = (0, import_react.useState)("");
	const [grievanceSearch, setGrievanceSearch] = (0, import_react.useState)("");
	const normalized = searched.trim().toLowerCase();
	const results = (0, import_react.useMemo)(() => FAQ.filter((item) => !normalized || `${item.category} ${item.question} ${item.answer}`.toLowerCase().includes(normalized)), [normalized]);
	const schemes = (0, import_react.useMemo)(() => normalized ? SCHEMES.filter((scheme) => `${scheme.name} ${scheme.description} ${scheme.category}`.toLowerCase().includes(normalized)) : [], [normalized]);
	const grievance = grievanceSearch ? state.grievances.find((item) => item.id.toUpperCase() === grievanceSearch) : void 0;
	const searchHelp = (event) => {
		event.preventDefault();
		setSearched(query);
		navigate({ search: { q: query.trim() || void 0 } });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageContainer, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "MIRA SUPPORT",
			title: "How can we help?",
			desc: "Find answers, understand your applications, or get help with Mira services."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraCard, {
			variant: "elevated",
			className: "mb-7 p-4 sm:p-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: searchHelp,
				role: "search",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: "help-search",
					className: "text-sm font-medium text-foreground",
					children: "Search help articles, schemes or services"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex flex-col gap-2 sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "help-search",
							value: query,
							onChange: (event) => setQuery(event.target.value),
							placeholder: "Try ‘documents’ or ‘application status’",
							className: "pl-9 h-10"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						className: "sm:min-w-28 h-10 tactile-btn",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 mr-1.5" }), "Search"]
					})]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mb-8",
			"aria-labelledby": "help-topics-heading",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: "help-topics-heading",
					className: "text-lg font-semibold tracking-tight text-foreground",
					children: "Browse by topic"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Go directly to the Mira service related to your question."
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4",
				children: CATEGORIES.map(({ label, to, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to,
					className: "group flex min-h-[72px] items-center gap-3 rounded-xl border border-border/70 bg-card p-3.5 transition-all duration-200 hover:border-primary/40 hover:shadow-xs active:scale-[0.99] tactile-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-foreground transition-transform group-hover:scale-105",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 flex-1 text-sm font-medium text-foreground",
							children: label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" })
					]
				}, label))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid items-start gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(270px,0.8fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: normalized ? `Search results (${results.length + schemes.length})` : "Frequently asked questions",
				children: results.length || schemes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [schemes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xs font-semibold uppercase tracking-wide text-slate-500",
						children: "Matching schemes"
					}), schemes.slice(0, 4).map((scheme) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/schemes/$id",
						params: { id: scheme.id },
						className: "flex items-center justify-between gap-3 rounded-md border border-slate-200 p-3 text-sm hover:bg-stone-50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-slate-900",
							children: scheme.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 shrink-0 text-slate-500" })]
					}, scheme.id))]
				}), results.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
					type: "single",
					collapsible: true,
					className: "-mt-2",
					children: results.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
						value: `faq-${index}`,
						className: "border-slate-200",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
							className: "py-4 text-left text-sm font-medium text-slate-900 hover:no-underline",
							children: item.question
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionContent, {
							className: "max-w-3xl text-sm leading-6 text-slate-600",
							children: [item.answer, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs font-medium text-slate-500",
								children: item.category
							})]
						})]
					}, item.question))
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
					title: "Can't find what you're looking for?",
					body: "Try a shorter search or use one of the service links on this page.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => {
							setQuery("");
							setSearched("");
							navigate({ search: {} });
						},
						children: "Clear search"
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "Application support",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-6 text-slate-600",
						children: "Need to share an issue about an application or service? Open the existing grievance form and include the relevant reference if you have one."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/citizen/grievances",
							children: ["Raise or track an issue", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "Track a grievance",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-6 text-slate-600",
							children: "Use the reference from your grievance confirmation to check its current status."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "mt-3 flex gap-2",
							onSubmit: (event) => {
								event.preventDefault();
								setGrievanceSearch(grievanceId.trim().toUpperCase());
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								"aria-label": "Grievance reference",
								value: grievanceId,
								onChange: (event) => setGrievanceId(event.target.value),
								placeholder: "Grievance reference"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								size: "icon",
								"aria-label": "Search grievance",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4" })
							})]
						}),
						grievanceSearch && (grievance ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 rounded-md border border-slate-200 bg-stone-50 p-3",
							role: "status",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs text-slate-700",
									children: grievance.id
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-slate-700",
									children: grievance.status
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-slate-700",
								children: grievance.category
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-slate-600",
							role: "status",
							children: "No grievance found with that reference."
						})),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "mt-3",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/citizen/grievances",
								children: "Open grievance center"
							})
						})
					]
				})]
			})]
		})
	] });
}
//#endregion
export { Help as component };
