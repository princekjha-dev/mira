import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { F as useApp, i as CATEGORY_IMAGE, l as SCHEMES, r as CATEGORIES } from "./app-state-7jSiCijd.mjs";
import { t as Button } from "./button-BT328xhy.mjs";
import { S as useNavigate, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Dt as HandHeart, E as Sparkles, En as Briefcase, It as FileUp, N as Search, Nt as FolderArchive, Ot as GraduationCap, Pn as ArrowRight, Rn as Activity, T as Sprout, Tn as Building2, Tt as HeartPulse, Vt as FilePlusCorner, Y as Network, _t as Landmark, ft as ListChecks, gn as ChevronRight, k as ShieldCheck, kn as Baby, l as Users, m as UserPen, pn as CircleCheck, rn as Compass, v as Trees, vn as Check, wt as History } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-Cl-rV5ml.mjs";
import { t as SchemeCard } from "./SchemeCard-CWS-eln7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BR9XrbLU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var HERO_IMAGES = [
	{
		src: "/hero/civic-1.jpg",
		alt: "Citizens and modern public welfare services"
	},
	{
		src: "/hero/civic-2.jpg",
		alt: "Families and community welfare support in India"
	},
	{
		src: "/hero/civic-3.jpg",
		alt: "Civic infrastructure and verified public documentation"
	}
];
var SEARCH_CATEGORIES = [
	"All Categories",
	"Schemes",
	"Services",
	"Benefits",
	"Applications",
	"Documents",
	"Help"
];
var QUICK_ACTIONS = [
	{
		to: "/schemes",
		title: "Explore Schemes",
		desc: "Browse central and state welfare initiatives",
		icon: Search
	},
	{
		to: "/eligibility",
		title: "Check Eligibility",
		desc: "See exact criteria and rule-based matches",
		icon: ListChecks
	},
	{
		to: "/schemes",
		title: "Apply for a Scheme",
		desc: "Apply with verified household details prefilled",
		icon: FilePlusCorner
	},
	{
		to: "/track",
		title: "Track Application",
		desc: "Monitor application stages and officer actions",
		icon: Activity
	},
	{
		to: "/citizen/family",
		title: "My Family Record",
		desc: "View verified household members and linkages",
		icon: Users
	},
	{
		to: "/citizen/documents",
		title: "My Documents",
		desc: "Digital vault verified once and reusable across schemes",
		icon: FolderArchive
	},
	{
		to: "/citizen/benefits",
		title: "Benefit History",
		desc: "Direct individual and household benefit disbursements",
		icon: History
	},
	{
		to: "/citizen/family",
		title: "Update Family Details",
		desc: "Report life events, new dependents, or corrections",
		icon: UserPen
	}
];
var CATEGORY_ICONS = {
	Housing: Building2,
	Education: GraduationCap,
	Healthcare: HeartPulse,
	Agriculture: Sprout,
	Pension: Landmark,
	"Women & Child": Baby,
	Employment: Briefcase,
	"Rural Development": Trees,
	"Social Welfare": HandHeart
};
var PROCESS_STEPS = [
	{
		number: "01",
		title: "Verify Citizen",
		sub: "Secure identity verification",
		desc: "Verify identity securely with government-backed credentials and OTP authentication.",
		icon: ShieldCheck
	},
	{
		number: "02",
		title: "Complete Family Record",
		sub: "Add and verify household details",
		desc: "Confirm household members, dependent relationships, and socioeconomic indicators.",
		icon: Users
	},
	{
		number: "03",
		title: "Select Scheme",
		sub: "Find and choose eligible schemes",
		desc: "Discover matching central and state schemes with transparent eligibility criteria.",
		icon: Compass
	},
	{
		number: "04",
		title: "Upload Documents",
		sub: "Submit required documents",
		desc: "Provide certified certificates once into your secure vault with automated format checks.",
		icon: FileUp
	},
	{
		number: "05",
		title: "Track Decision",
		sub: "Monitor verification and final decision",
		desc: "Follow end-to-end officer review stages and receive direct entitlement disbursements.",
		icon: CircleCheck
	}
];
function Index() {
	const { state } = useApp();
	const nav = useNavigate();
	const selectId = (0, import_react.useId)();
	const [currentSlide, setCurrentSlide] = (0, import_react.useState)(0);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [searchCategory, setSearchCategory] = (0, import_react.useState)("All Categories");
	(0, import_react.useEffect)(() => {
		HERO_IMAGES.forEach((item) => {
			const img = new Image();
			img.src = item.src;
		});
	}, []);
	(0, import_react.useEffect)(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || state.reducedMotion) return;
		const timer = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
		}, 2e3);
		return () => clearInterval(timer);
	}, [state.reducedMotion]);
	const handleSearchSubmit = (e) => {
		e.preventDefault();
		const query = searchQuery.trim();
		if (searchCategory === "Schemes" || searchCategory === "All Categories" || searchCategory === "Services") {
			nav({
				to: "/schemes",
				search: query ? { q: query } : void 0
			});
			return;
		}
		if (searchCategory === "Benefits") {
			nav({ to: "/citizen/benefits" });
			return;
		}
		if (searchCategory === "Applications") {
			if (query && (query.toUpperCase().startsWith("APP-") || /^\d+$/.test(query))) nav({
				to: "/track",
				search: { id: query }
			});
			else nav({ to: "/citizen/applications" });
			return;
		}
		if (searchCategory === "Documents") {
			nav({
				to: "/citizen/documents",
				search: { upload: false }
			});
			return;
		}
		if (searchCategory === "Help") {
			nav({
				to: "/help",
				search: query ? { q: query } : void 0
			});
			return;
		}
		nav({
			to: "/schemes",
			search: query ? { q: query } : void 0
		});
	};
	const schemeCounts = CATEGORIES.reduce((acc, cat) => {
		acc[cat] = SCHEMES.filter((s) => s.category === cat).length;
		return acc;
	}, {});
	const featuredSchemes = SCHEMES.slice(0, 3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col min-h-screen bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative w-full overflow-hidden bg-neutral-900 text-white min-h-[600px] sm:min-h-[650px] lg:min-h-[700px] flex items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-0 z-0",
					children: [
						HERO_IMAGES.map((img, idx) => {
							const isActive = idx === currentSlide;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`,
								"aria-hidden": !isActive,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: img.src,
									alt: img.alt,
									className: "h-full w-full object-cover object-center transform-gpu will-change-transform",
									loading: idx === 0 ? "eager" : "lazy",
									decoding: "async"
								})
							}, img.src);
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 z-20 bg-gradient-to-r from-black/65 via-black/35 to-black/5" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 z-20 bg-gradient-to-t from-black/35 via-transparent to-black/10" })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-30 mx-auto w-full max-w-7xl px-4 sm:px-6 py-16 sm:py-20 lg:py-24 flex flex-col items-start",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "max-w-3xl text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.08]",
							children: "Public records, welfare schemes and benefits, in one place."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-2xl text-base sm:text-lg text-white/90 font-normal leading-relaxed",
							children: "Access household records, discover eligible schemes, manage documents, submit applications and track decisions."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 w-full max-w-3xl",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
								onSubmit: handleSearchSubmit,
								role: "search",
								"aria-label": "Unified Search",
								className: "rounded-2xl border border-white/75 bg-white p-2 sm:p-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.18)] transition-shadow duration-200 focus-within:ring-2 focus-within:ring-blue-500/35",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative flex-1 flex items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3.5 h-5 w-5 text-slate-400 pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "hero-search-input",
											type: "search",
											value: searchQuery,
											onChange: (e) => setSearchQuery(e.target.value),
											placeholder: "Search schemes, services, benefits or applications",
											className: "h-11 sm:h-12 w-full border-0 bg-transparent pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 shadow-none font-normal",
											"aria-label": "Search schemes, services, benefits or applications"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-200/80 pt-2 sm:pt-0 sm:pl-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												htmlFor: selectId,
												className: "sr-only",
												children: "Select category"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
												id: selectId,
												value: searchCategory,
												onChange: (e) => setSearchCategory(e.target.value),
												className: "h-10 sm:h-11 rounded-lg border-0 bg-stone-100 px-3 text-xs sm:text-sm font-medium text-slate-700 hover:bg-stone-200/80 focus:outline-none focus:ring-1 focus:ring-blue-500/40 cursor-pointer transition-colors",
												children: SEARCH_CATEGORIES.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: cat,
													children: cat
												}, cat))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												type: "submit",
												className: "h-10 sm:h-11 rounded-xl bg-blue-700 px-5 sm:px-6 text-sm font-medium text-white shadow-sm hover:bg-blue-800 transition-all active:scale-[0.98] shrink-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "mr-1.5 h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Search" })]
											})
										]
									})]
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 flex items-center gap-1.5",
							role: "tablist",
							"aria-label": "Hero Carousel Slides",
							children: HERO_IMAGES.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setCurrentSlide(i),
								className: `h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? "w-7 bg-white" : "w-2 bg-white/40 hover:bg-white/60"}`,
								"aria-label": `Go to slide ${i + 1}`,
								"aria-current": i === currentSlide
							}, i))
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "relative z-30 -mt-8 sm:-mt-12 mx-auto w-full max-w-7xl px-4 sm:px-6",
				"aria-label": "Quick Actions",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-[0_12px_36px_rgba(15,23,42,0.08)] backdrop-blur-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between pb-4 border-b border-slate-100 mb-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base sm:text-lg font-semibold tracking-tight text-slate-900",
							children: "Citizen Quick Actions"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: "Direct access to key household and welfare services"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "hidden sm:inline-flex items-center gap-1 text-xs font-medium text-gov",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), "Verified Public Services"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5",
						children: QUICK_ACTIONS.map((action) => {
							const Icon = action.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: action.to,
								className: "group relative flex items-start gap-3.5 rounded-xl border border-slate-200/80 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-700 shadow-2xs transition-colors duration-200",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-semibold text-slate-900 transition-colors",
											children: action.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed",
										children: action.desc
									})]
								})]
							}, action.title);
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto w-full max-w-7xl px-4 sm:px-6 py-20",
				"aria-labelledby": "schemes-heading",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-8 border-b border-slate-200/80",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold tracking-wider uppercase text-gov",
								children: "EXPLORE"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								id: "schemes-heading",
								className: "mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-navy",
								children: "Government Schemes"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed",
								children: "Discover schemes across education, healthcare, housing, agriculture, pension, employment and more."
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "lg",
							asChild: true,
							className: "self-start md:self-auto rounded-xl border-slate-300 hover:border-gov hover:bg-slate-50 text-navy font-medium",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/schemes",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View All Schemes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2 h-4 w-4" })]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4",
						children: CATEGORIES.map((cat) => {
							const Icon = CATEGORY_ICONS[cat] ?? Compass;
							const img = CATEGORY_IMAGE[cat];
							const count = schemeCounts[cat] || 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/schemes",
								search: { category: cat },
								className: "group relative flex flex-col justify-end overflow-hidden rounded-xl border border-slate-200/90 bg-card p-4 h-40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-gov/50",
								children: [img && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute inset-0 z-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: img,
										alt: cat,
										className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
										loading: "lazy"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative z-10 text-white",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-md text-white border border-white/20",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-sm font-semibold tracking-tight text-white group-hover:underline",
											children: cat
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-white/80 mt-0.5",
											children: count > 0 ? `${count} ${count === 1 ? "scheme" : "schemes"}` : "Eligible schemes"
										})
									]
								})]
							}, cat);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-14",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between mb-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-lg font-semibold text-navy",
								children: "Featured Welfare Schemes"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: "Immediate eligibility verification with verified household records"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/schemes",
								className: "text-xs font-semibold text-gov hover:underline inline-flex items-center gap-1",
								children: [
									"Browse all ",
									SCHEMES.length,
									" schemes",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3",
							children: featuredSchemes.map((scheme) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SchemeCard, { s: scheme }, scheme.id))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-y border-slate-200/80 bg-slate-50/70 py-20",
				"aria-labelledby": "process-heading",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto w-full max-w-7xl px-4 sm:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center max-w-2xl mx-auto mb-14",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold tracking-wider uppercase text-gov",
									children: "TRANSPARENT ARCHITECTURE"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									id: "process-heading",
									className: "mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-navy",
									children: "A simple, transparent process"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2.5 text-sm sm:text-base text-muted-foreground leading-relaxed",
									children: "From verification to benefits, Mira guides you at every step."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "hidden lg:block absolute top-7 left-12 right-12 h-0.5 bg-slate-200 z-0",
								"aria-hidden": "true"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
								className: "grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-4 relative z-10",
								children: PROCESS_STEPS.map((step, idx) => {
									const Icon = step.icon;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "relative flex flex-row lg:flex-col items-start lg:items-center text-left lg:text-center gap-4 lg:gap-0",
										children: [
											idx < PROCESS_STEPS.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "lg:hidden absolute top-14 left-7 bottom-0 w-0.5 -ml-px bg-slate-200",
												"aria-hidden": "true"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-200 bg-white shadow-xs group-hover:border-navy transition-colors",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-mono font-bold text-slate-400 absolute top-1.5 right-2",
													children: step.number
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5 text-navy" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "pt-2 lg:pt-4 min-w-0",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
														className: "text-base font-semibold text-navy leading-snug",
														children: step.title
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mt-1 text-xs font-medium text-gov",
														children: step.sub
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mt-1.5 text-xs text-muted-foreground leading-relaxed",
														children: step.desc
													})
												]
											})
										]
									}, step.number);
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-14 pt-8 border-t border-slate-200/60 flex flex-wrap items-center justify-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								asChild: true,
								className: "rounded-xl bg-navy hover:bg-navy/90 text-white px-7",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/eligibility",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-2 h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Check Your Eligibility Now" })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								variant: "outline",
								asChild: true,
								className: "rounded-xl border-slate-300",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/track",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Track an Application" })
								})
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-auto w-full max-w-7xl px-4 sm:px-6 py-20",
				"aria-labelledby": "why-mira",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-12 lg:grid-cols-[1.1fr_1.3fr] items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-semibold tracking-wider uppercase text-gov",
							children: "DATA SOVEREIGNTY & CITIZEN CONSENT"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "why-mira",
							className: "mt-1.5 text-2xl sm:text-3xl font-semibold tracking-tight text-navy",
							children: "Verified once, trusted everywhere"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed",
							children: "Today, a citizen's records sit fragmented across different line departments. Citizens are repeatedly asked to produce the same physical documents, and departments struggle to avoid duplication."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed",
							children: "Mira connects records through household and citizen identifiers with explicit consent. Each department retains statutory ownership of its data while enabling verified, friction-free delivery of welfare benefits."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-6 space-y-3 text-sm text-slate-700",
							children: [
								"Departments retain full ownership and statutory authority over their records",
								"Records are linked solely with citizen consent and an auditable access log",
								"Sensitive changes and scheme decisions are reviewed by verified officers",
								"Zero automated rejections — citizen grievances and reviews are protected"
							].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3 stroke-[2.5]" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item })]
							}, item))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								className: "rounded-xl border-slate-300",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/help",
									children: "Read Architecture FAQs"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "ghost",
								className: "rounded-xl text-gov hover:bg-slate-100",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/officer/login",
									children: "Officer & Department Login →"
								})
							})]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center",
								children: [
									{
										title: "Civil Registration",
										sub: "Birth Records"
									},
									{
										title: "Identity Authority",
										sub: "Identity Info"
									},
									{
										title: "Family Register",
										sub: "Household Records"
									},
									{
										title: "Revenue & Land",
										sub: "Income & Land"
									}
								].map((src) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-slate-200 bg-white p-3 shadow-2xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold text-navy",
										children: src.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-muted-foreground mt-0.5",
										children: src.sub
									})]
								}, src.title))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "my-4 flex items-center justify-center text-slate-400",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, { className: "h-6 w-6 text-gov" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border-2 border-navy bg-white p-4 text-center shadow-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gov",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" }), "Consent-Based Linking Layer"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "References source records by verified citizen and household ID · Verifies once · Audits every access"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "my-4 flex items-center justify-center text-slate-400",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-5 w-5 rotate-90 text-slate-400" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-2.5 text-center text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/citizen/dashboard",
										className: "rounded-lg bg-white border border-slate-200 p-2.5 font-medium text-navy hover:border-gov transition-colors",
										children: "Citizen Portal"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/officer/login",
										className: "rounded-lg bg-white border border-slate-200 p-2.5 font-medium text-navy hover:border-gov transition-colors",
										children: "Officer Review"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/department",
										className: "rounded-lg bg-white border border-slate-200 p-2.5 font-medium text-navy hover:border-gov transition-colors",
										children: "Department Rules"
									})
								]
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { Index as component };
