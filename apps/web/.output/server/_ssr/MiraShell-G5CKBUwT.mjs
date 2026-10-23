import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { F as useApp, N as sendMiraAiChat, l as SCHEMES } from "./app-state-7jSiCijd.mjs";
import { r as cn, t as Button } from "./button-BT328xhy.mjs";
import { S as useNavigate, p as useLocation, x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as ShieldAlert, Dn as Bell, E as Sparkles, K as PanelLeftOpen, Lt as FileText, M as Send, Mt as FolderOpen, N as Search, Pn as ArrowRight, _n as ChevronDown, d as User, i as X, it as Mail, k as ShieldCheck, ot as LogOut, q as PanelLeftClose, sn as ClipboardList, tt as Menu, ut as LoaderCircle, wn as Building, wt as History } from "../_libs/lucide-react.mjs";
import { a as DropdownMenuSeparator, i as DropdownMenuLabel, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-DzuN959_.mjs";
import { n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-DO3wpSNE.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as SheetTitle, i as SheetHeader, n as Sheet, r as SheetContent, t as LanguageMenu } from "./SiteHeader-CR65oOpd.mjs";
import { t as Input } from "./input-Cl-rV5ml.mjs";
import { t as getRoleConfig } from "./role-config-C62DEPSC.mjs";
import { a as TooltipTrigger$1, i as TooltipProvider$1, n as TooltipContent$1, r as TooltipPortal, t as Tooltip$1 } from "../_libs/radix-ui__react-tooltip.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MiraShell-G5CKBUwT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GlobalSearchDialog({ open, onOpenChange }) {
	const { state } = useApp();
	const nav = useNavigate();
	const [query, setQuery] = (0, import_react.useState)("");
	const role = state.session?.role || "citizen";
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				onOpenChange(true);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [onOpenChange]);
	const results = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		if (!q) return [];
		const items = [];
		state.applications.forEach((app) => {
			if (role === "citizen" && state.session?.name && !app.applicant.toLowerCase().includes(state.session.name.toLowerCase()) && !app.id.toLowerCase().includes(q)) return;
			if (app.id.toLowerCase().includes(q) || app.applicant.toLowerCase().includes(q) || app.schemeId.toLowerCase().includes(q)) {
				const dest = role === "officer" ? `/officer/applications/${app.id}` : role === "verifier" ? `/verifier/applications/${app.id}` : role === "auditor" ? `/auditor/applications` : `/citizen/applications/${app.id}`;
				items.push({
					id: app.id,
					category: "Application",
					title: `${app.id} · ${app.applicant}`,
					subtitle: `Scheme: ${app.schemeId} · Status: ${app.status}`,
					url: dest,
					badge: app.status
				});
			}
		});
		SCHEMES.forEach((s) => {
			if (s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)) items.push({
				id: s.id,
				category: "Scheme",
				title: s.name,
				subtitle: `${s.category} · ${s.department}`,
				url: `/schemes/${s.id}`,
				badge: s.level
			});
		});
		state.files.forEach((f) => {
			if (f.name.toLowerCase().includes(q) || f.type.toLowerCase().includes(q)) {
				const dest = role === "verifier" ? `/verifier/documents` : `/citizen/documents`;
				items.push({
					id: f.id,
					category: "Document",
					title: f.name,
					subtitle: `${f.type} · v${f.currentVersion} · ${f.verificationStatus}`,
					url: dest,
					badge: f.verificationStatus
				});
			}
		});
		state.messages.forEach((m) => {
			if (m.subject.toLowerCase().includes(q) || m.preview.toLowerCase().includes(q) || m.sender.name.toLowerCase().includes(q)) {
				const dest = role === "officer" ? `/officer/inbox` : role === "verifier" ? `/verifier/inbox` : role === "admin" ? `/department/inbox` : role === "auditor" ? `/auditor/inbox` : `/citizen/inbox`;
				items.push({
					id: m.id,
					category: "Message",
					title: m.subject,
					subtitle: `From: ${m.sender.name} (${m.sender.role}) · ${m.timestamp}`,
					url: dest,
					badge: m.status === "unread" ? "Unread" : void 0
				});
			}
		});
		if (role === "admin" || role === "auditor" || role === "officer") state.audit.forEach((a) => {
			if (a.action.toLowerCase().includes(q) || a.actor.toLowerCase().includes(q) || a.id.toLowerCase().includes(q)) items.push({
				id: a.id,
				category: "Audit",
				title: `${a.id} — ${a.action}`,
				subtitle: `Actor: ${a.actor} · ${a.ts}`,
				url: role === "auditor" ? `/auditor/audit` : `/department/audit`
			});
		});
		return items.slice(0, 8);
	}, [
		query,
		state,
		role
	]);
	const handleSelect = (url) => {
		onOpenChange(false);
		setQuery("");
		nav({ to: url });
	};
	const getIcon = (category) => {
		switch (category) {
			case "Application": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "h-4 w-4 text-gov" });
			case "Scheme": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "h-4 w-4 text-teal" });
			case "Document": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { className: "h-4 w-4 text-amber-700" });
			case "Message": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 text-blue-600" });
			case "Audit": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-4 w-4 text-purple-700" });
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-slate-500" });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-2xl p-0 overflow-hidden border shadow-2xl rounded-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "sr-only",
					children: "Global Search"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center border-b px-4 py-3 bg-white",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-5 w-5 text-slate-400 mr-2.5 shrink-0" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: query,
							onChange: (e) => setQuery(e.target.value),
							placeholder: "Search applications, schemes, files, messages, audit logs… (Esc to exit)",
							className: "border-0 shadow-none focus-visible:ring-0 text-base h-10 px-0",
							autoFocus: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
							className: "hidden sm:inline-block rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-500 border",
							children: "ESC"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-[60vh] overflow-y-auto p-2 bg-slate-50/50",
					children: !query.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-6 text-center text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium text-slate-700",
							children: "Quick Search across Mira"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1",
							children: [
								"Type an Application ID (e.g. ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "APP-2026-000318" }),
								"), scheme name, document, or citizen message."
							]
						})]
					}) : results.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-8 text-center text-sm text-slate-500",
						children: [
							"No matching records found for \"",
							query,
							"\"."
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-1",
						children: results.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => handleSelect(item.url),
							className: "w-full flex items-center justify-between p-3 rounded-lg text-left hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 group-hover:bg-slate-200/60 shrink-0",
									children: getIcon(item.category)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-sm text-navy truncate",
											children: item.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600",
											children: item.category
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground truncate mt-0.5",
										children: item.subtitle
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 shrink-0 ml-3",
								children: [item.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-semibold px-2 py-0.5 rounded bg-teal/10 text-teal",
									children: item.badge
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 text-slate-400 group-hover:text-gov transition-colors" })]
							})]
						}) }, item.category + item.id))
					})
				})
			]
		})
	});
}
function MiraAIOrb() {
	const { state } = useApp();
	const location = useLocation();
	const role = state.session?.role || "citizen";
	const roleConfig = getRoleConfig(role);
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const [isProcessing, setIsProcessing] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const [contextSummary, setContextSummary] = (0, import_react.useState)("");
	const [messages, setMessages] = (0, import_react.useState)([]);
	const messagesEndRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const defaultGreeting = {
			id: "init",
			sender: "mira",
			text: `Hello ${state.session?.name || roleConfig.defaultIdentity.name}. I am Mira AI. I am attuned to your ${roleConfig.workspaceTitle}. How can I assist you today?`,
			timestamp: "Just now"
		};
		setMessages([defaultGreeting]);
		setContextSummary(`${state.session?.name || roleConfig.defaultIdentity.name} · Authorized Records`);
	}, [
		role,
		state.session?.name,
		roleConfig.workspaceTitle,
		roleConfig.defaultIdentity.name
	]);
	(0, import_react.useEffect)(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isProcessing]);
	const isCommunicationsRoute = location.pathname.includes("inbox");
	const suggestedPrompts = (() => {
		if (isCommunicationsRoute) switch (role) {
			case "citizen": return [
				"What does this message mean?",
				"How do I upload the requested clarification document?",
				"What is the deadline for this inquiry?"
			];
			case "verifier": return [
				"Summarize this conversation.",
				"Draft clarification response for applicant",
				"Explain statutory tolerance for income document"
			];
			case "officer": return ["Summarize field visit dispatch notes", "Confirm applicant residence address for visit"];
			case "auditor": return ["Trace non-repudiation proof for this inquiry", "Summarize inter-departmental notice thread"];
			default: return ["Summarize this conversation.", "Draft official dispatch reply"];
		}
		switch (role) {
			case "citizen": return [
				"Check eligibility for Rural Housing Assistance",
				"What is my household's current verification status?",
				"Why is my application waiting for clarification?"
			];
			case "verifier": return [
				"Summarize evidence for application APP-2026-000455",
				"Explain the income mismatch with Revenue records",
				"What is the statutory tolerance for land holdings?"
			];
			case "officer": return [
				"Show pending inspections on today's route",
				"How do I confirm citizen digital presence?",
				"Verify GPS coordinates for Plot 412/1"
			];
			case "auditor": return [
				"Verify SHA-256 Merkle root for recent decisions",
				"Trace complete audit history for Sharma household",
				"Export ISO/IEC 27001 compliance bundle"
			];
			case "admin": return [
				"Show queue health and bottleneck SLA alerts",
				"Review active eligibility rule versions",
				"Inspect cross-registry UIDAI e-KYC status"
			];
			default: return ["Explain the public welfare verification pipeline", "What records are currently active in my view?"];
		}
	})();
	const handleSend = async (textToSend) => {
		const text = (textToSend || query).trim();
		if (!text || isProcessing) return;
		const userMsg = {
			id: Date.now().toString(),
			sender: "user",
			text,
			timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit"
			})
		};
		setMessages((prev) => [...prev, userMsg]);
		setQuery("");
		setIsProcessing(true);
		try {
			const history = messages.filter((m) => m.id !== "init").slice(-4).map((m) => ({
				role: m.sender === "user" ? "user" : "assistant",
				content: m.text
			}));
			const response = await sendMiraAiChat(state.session, {
				message: text,
				route: location.pathname,
				history
			});
			if (response.context_summary) setContextSummary(response.context_summary);
			const botMsg = {
				id: (Date.now() + 1).toString(),
				sender: "mira",
				text: response.reply,
				timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit"
				}),
				isLiveLLM: response.is_live_llm
			};
			setMessages((prev) => [...prev, botMsg]);
		} catch (err) {
			console.error("Mira AI query error:", err);
			const errorMsg = {
				id: (Date.now() + 1).toString(),
				sender: "mira",
				text: "Mira AI is temporarily unavailable. Please try again.",
				timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit"
				})
			};
			setMessages((prev) => [...prev, errorMsg]);
		} finally {
			setIsProcessing(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed bottom-6 right-6 z-50 select-none print:hidden font-sans",
		children: [isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3.5 flex h-[530px] w-[370px] sm:w-[420px] flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 text-slate-900 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-100 animate-in fade-in slide-in-from-bottom-3 duration-200 origin-bottom-right",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-slate-200/70 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-850/60 px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative flex h-7 w-7 items-center justify-center rounded-xl bg-slate-900 text-teal-400 dark:bg-slate-800 shadow-2xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xs font-bold tracking-tight text-slate-900 dark:text-slate-100",
								children: "Mira Intelligence"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-gov/10 px-1.5 py-0.2 text-[9px] font-semibold text-gov",
								children: role.toUpperCase()
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-muted-foreground",
							children: roleConfig.workspaceTitle
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setIsOpen(false),
						className: "rounded-lg p-1.5 text-muted-foreground hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-800 transition-colors",
						"aria-label": "Close Mira AI",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 px-4 py-1.5 bg-slate-50/40 border-b border-slate-100 dark:bg-slate-900/40 dark:border-slate-800 text-[10px] text-muted-foreground select-text",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "truncate font-medium",
						children: ["Using: ", contextSummary || `${state.session?.name || roleConfig.defaultIdentity.name} · Authorized Records`]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 overflow-y-auto p-4 space-y-3 text-xs leading-relaxed scrollbar-thin",
					children: [
						messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("flex flex-col max-w-[85%]", m.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: cn("rounded-2xl px-3.5 py-2.5 shadow-2xs whitespace-pre-wrap leading-relaxed", m.sender === "user" ? "bg-slate-900 text-white font-medium rounded-br-xs dark:bg-slate-100 dark:text-slate-900" : "bg-slate-50 text-slate-900 border border-slate-200/80 rounded-bl-xs dark:bg-slate-800/80 dark:border-slate-700/60 dark:text-slate-100"),
								children: m.text
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-muted-foreground/75 px-1 mt-0.5 tabular-nums font-mono",
								children: m.timestamp
							})]
						}, m.id)),
						isProcessing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 rounded-2xl bg-slate-50 border border-slate-200/80 px-3.5 py-2 text-xs text-muted-foreground mr-auto dark:bg-slate-800 dark:border-slate-700",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin text-gov" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mira is correlating records…" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: messagesEndRef })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] font-medium text-muted-foreground mb-1.5 font-mono uppercase tracking-wider",
						children: "Contextual Queries:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1",
						children: suggestedPrompts.slice(0, 2).map((p, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => handleSend(p),
							className: "rounded-full border border-slate-200/80 bg-white px-2.5 py-1 text-[10px] text-slate-700 hover:border-slate-300 hover:text-slate-950 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white",
							children: p
						}, idx))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						handleSend();
					},
					className: "flex items-center gap-2 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: `Ask Mira about ${roleConfig.workspaceTitle}…`,
						className: "h-9 flex-1 text-xs bg-slate-50/80 border-slate-200/80 dark:bg-slate-800 dark:border-slate-700 rounded-xl"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						type: "submit",
						disabled: !query.trim() || isProcessing,
						className: "h-9 w-9 shrink-0 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" })
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setIsOpen(!isOpen),
			className: cn("group relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-200 select-none shadow-lg outline-none", "bg-slate-900 text-white border border-slate-700/60 dark:bg-slate-100 dark:text-slate-950 dark:border-slate-300/40", "hover:scale-[1.04] active:scale-[0.96]", isOpen ? "ring-2 ring-gov ring-offset-2 ring-offset-background" : ""),
			"aria-label": "Open Mira AI Assistant",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("absolute -inset-1 rounded-2xl opacity-20 blur-sm transition-opacity duration-300 pointer-events-none", "bg-gradient-to-tr from-sky-400 via-teal-400 to-indigo-400", isProcessing ? "opacity-60 animate-pulse" : "group-hover:opacity-40") }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative z-10 flex items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: cn("h-4.5 w-4.5 transition-transform duration-200", isProcessing ? "animate-spin text-teal-400" : "group-hover:rotate-6 text-teal-300 dark:text-teal-600") })
				}),
				!isOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "pointer-events-none absolute right-14 whitespace-nowrap rounded-xl border border-slate-200/80 bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur-md opacity-0 translate-x-1.5 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0 dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-200",
					children: "Mira AI"
				})
			]
		})]
	});
}
function AccountMenu({ className, compact = false }) {
	const { state, logout } = useApp();
	const nav = useNavigate();
	const role = state.session?.role || "citizen";
	const roleConfig = getRoleConfig(role);
	const name = state.session?.name || roleConfig.defaultIdentity.name;
	const label = roleConfig.label;
	const profileUrl = role === "verifier" ? "/verifier/settings" : role === "officer" ? "/officer/settings" : role === "admin" ? "/department/settings" : role === "auditor" ? "/auditor/settings" : "/citizen/settings";
	const notificationsUrl = role === "officer" ? "/officer/notifications" : role === "admin" ? "/department/notifications" : "/citizen/notifications";
	const getInitials = (n) => {
		const parts = n.trim().split(" ");
		if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
		return (n[0] || "U").toUpperCase();
	};
	const handleSignOut = () => {
		logout();
		toast.success("Signed out successfully");
		nav({ to: "/" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: cn("group flex items-center gap-2.5 rounded-xl border border-transparent p-1 sm:px-2.5 sm:py-1.5 transition-all text-left outline-none hover:bg-slate-100/80 hover:border-slate-200/60 dark:hover:bg-slate-800/80 dark:hover:border-slate-700/60", className),
			"aria-label": "User account menu",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xs font-bold shadow-2xs",
					children: [getInitials(name), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900" })]
				}),
				!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden sm:flex flex-col min-w-0 pr-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight group-hover:text-gov transition-colors",
						children: name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate text-[10px] text-muted-foreground uppercase tracking-wider font-mono",
						children: label
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "hidden sm:block h-3 w-3 text-muted-foreground opacity-60 group-hover:opacity-100 transition-opacity" })
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
		align: "end",
		className: "w-56 p-1.5 rounded-xl border border-slate-200/80 shadow-lg dark:border-slate-800",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuLabel, {
				className: "p-2 space-y-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-bold text-slate-900 dark:text-slate-100 truncate",
							children: name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-1.5 py-0.2 text-[9px] font-semibold text-emerald-700 dark:text-emerald-400",
							children: "Active"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-muted-foreground truncate",
						children: roleConfig.label
					}),
					state.session?.department && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] text-muted-foreground/80 truncate",
						children: state.session.department
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
				asChild: true,
				className: "cursor-pointer text-xs py-2 rounded-lg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: profileUrl,
					className: "flex items-center gap-2.5 w-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3.5 w-3.5 text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View Profile" })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
				asChild: true,
				className: "cursor-pointer text-xs py-2 rounded-lg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: notificationsUrl,
					className: "flex items-center gap-2.5 w-full",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-3.5 w-3.5 text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Notifications" })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
				onClick: handleSignOut,
				className: "cursor-pointer text-xs py-2 text-rose-600 dark:text-rose-400 hover:text-rose-700 focus:text-rose-700 rounded-lg flex items-center gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sign Out" })]
			})
		]
	})] });
}
var TooltipProvider = TooltipProvider$1;
var Tooltip = Tooltip$1;
var TooltipTrigger = TooltipTrigger$1;
var TooltipContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent$1, {
	ref,
	sideOffset,
	className: cn("z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)", className),
	...props
}) }));
TooltipContent.displayName = TooltipContent$1.displayName;
function MiraShell({ children, title, items, isReadOnly }) {
	const { state, logout } = useApp();
	useNavigate();
	const location = useLocation();
	const role = state.session?.role || "citizen";
	const roleConfig = getRoleConfig(role);
	const [expanded, setExpanded] = (0, import_react.useState)(false);
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const [searchOpen, setSearchOpen] = (0, import_react.useState)(false);
	const navItems = items || roleConfig.navItems;
	const workspaceTitle = title || roleConfig.workspaceTitle;
	const isAuditorMode = isReadOnly ?? (role === "auditor" || roleConfig.isReadOnly);
	const unreadMessages = state.messages?.filter((m) => m.status === "unread").length || 0;
	const unreadNotifs = state.notifications?.filter((n) => !n.read).length || 0;
	const mismatchesCount = state.applications?.filter((a) => !!a.mismatch).length || 0;
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				setSearchOpen((prev) => !prev);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);
	const getBadgeCount = (badgeType) => {
		if (badgeType === "unreadMessages") return unreadMessages;
		if (badgeType === "unreadNotifications") return unreadNotifs;
		if (badgeType === "mismatches") return mismatchesCount;
		return 0;
	};
	const renderNavLinks = (onItemClick, isMini = false) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "flex flex-col gap-1.5 p-2",
		"aria-label": workspaceTitle,
		children: navItems.map((item) => {
			const badgeCount = getBadgeCount(item.badge);
			const isActive = location.pathname === item.to || item.to !== "/" && !item.exact && location.pathname.startsWith(item.to);
			const linkEl = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				onClick: onItemClick,
				className: cn("group relative flex items-center gap-3 rounded-xl transition-all duration-150 text-xs font-medium", isMini ? "h-11 w-11 justify-center px-0" : "h-10 px-3", isActive ? "bg-slate-900 text-white shadow-xs dark:bg-slate-100 dark:text-slate-950" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"),
				activeOptions: { exact: item.exact },
				children: [
					isActive && !isMini && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute left-1 h-4 w-1 rounded-full bg-primary" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: cn("h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-105", isActive ? "text-white dark:text-slate-950" : "text-muted-foreground group-hover:text-foreground") }),
					!isMini && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate flex-1",
						children: item.label
					}),
					badgeCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: cn("flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold", isActive ? "bg-white/20 text-white dark:bg-slate-900 dark:text-white" : "bg-primary/10 text-primary"),
						children: badgeCount
					})
				]
			}, item.id + item.to);
			if (isMini) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, {
				delayDuration: 100,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
					asChild: true,
					children: linkEl
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipContent, {
					side: "right",
					className: "text-xs font-medium flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label }), badgeCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-full bg-primary/20 px-1.5 py-0.2 text-[10px] text-primary",
						children: badgeCount
					})]
				})]
			}, item.id);
			return linkEl;
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-slate-50/70 dark:bg-slate-950 text-foreground selection:bg-primary/10 selection:text-primary",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlobalSearchDialog, {
				open: searchOpen,
				onOpenChange: setSearchOpen
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sticky top-0 hidden h-screen p-3 sm:flex flex-col z-30 shrink-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: cn("flex h-full flex-col rounded-2xl border border-border/80 bg-card/90 shadow-sm backdrop-blur-md transition-all duration-200", expanded ? "w-60" : "w-15 items-center"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("flex h-14 items-center border-b border-border/70", expanded ? "w-full justify-between px-3.5" : "w-full justify-center px-0"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/",
								className: "flex items-center gap-2.5 transition-transform active:scale-95",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/miraicon.svg",
									alt: "Mira",
									className: "h-8 w-8 rounded-xl object-contain shadow-2xs"
								}), expanded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 leading-tight",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block font-bold tracking-tight text-sm text-foreground",
										children: "Mira"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block truncate text-[10px] text-muted-foreground",
										children: "Unified Platform"
									})]
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 w-full overflow-y-auto overflow-x-hidden py-2 scrollbar-none",
							children: renderNavLinks(void 0, !expanded)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full border-t border-border/70 p-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setExpanded(!expanded),
								className: cn("flex h-10 w-full items-center rounded-xl text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors text-xs font-medium", expanded ? "px-3 gap-2" : "justify-center"),
								"aria-label": expanded ? "Collapse navigation rail" : "Expand navigation rail",
								children: expanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftClose, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Collapse Rail" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, {
									delayDuration: 150,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftOpen, { className: "h-4 w-4 shrink-0" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, {
										side: "right",
										className: "text-xs",
										children: "Expand Navigation"
									})]
								})
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: mobileOpen,
				onOpenChange: setMobileOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
					side: "left",
					className: "w-68 bg-card p-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, {
						className: "border-b border-border/80 p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/miraicon.svg",
								alt: "Mira",
								className: "h-8 w-8 rounded-xl object-contain"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
								className: "text-left text-sm font-bold",
								children: workspaceTitle
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-y-auto py-2",
						children: renderNavLinks(() => setMobileOpen(false), false)
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [
					isAuditorMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-amber-300/40 bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-800 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "FORENSIC AUDIT WORKSPACE — STRICT READ-ONLY ACCESS (APPLICATION STATE MUTATIONS DISABLED)" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden font-mono text-[10px] opacity-75 sm:inline",
							children: "ISO/IEC 27001 COMPLIANCE"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border/80 bg-card/80 px-4 sm:px-6 backdrop-blur-md",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "icon",
								className: "sm:hidden h-9 w-9 rounded-xl",
								onClick: () => setMobileOpen(true),
								"aria-label": "Open navigation menu",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden items-center gap-2 lg:flex",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-bold tracking-tight text-foreground",
										children: workspaceTitle
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground/40",
										children: "/"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-muted-foreground",
										children: roleConfig.subtitle
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setSearchOpen(true),
								className: "flex h-9 w-full max-w-sm sm:max-w-md items-center gap-2.5 rounded-xl border border-input/70 bg-background/80 px-3 text-xs text-muted-foreground shadow-2xs transition-all hover:bg-accent/60 hover:text-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5 text-muted-foreground" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex-1 text-left truncate",
										children: "Search Mira…"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("kbd", {
										className: "pointer-events-none hidden h-5 select-none items-center gap-0.5 rounded border border-border/80 bg-muted/60 px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs",
											children: "⌘"
										}), "K"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "ml-auto flex items-center gap-1 text-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageMenu, { compact: true }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, {
										delayDuration: 150,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "icon",
												asChild: true,
												className: "relative h-9 w-9 rounded-xl",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
													to: "/citizen/notifications",
													"aria-label": "Notifications",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), unreadNotifs > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "absolute right-1.5 top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground",
														children: unreadNotifs
													})]
												})
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, {
											className: "text-xs",
											children: "Notifications"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "border-l border-border/80 pl-2 ml-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountMenu, {})
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						id: "main",
						className: "mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8 animate-in fade-in duration-150",
						children
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiraAIOrb, {})
		]
	}) });
}
//#endregion
export { MiraShell as t };
