import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { c as LANGUAGES, k as useApp, m as apiRequest, r as Button, v as cn } from "./button-B0ZnFkgi.mjs";
import { b as Link, p as useRouterState, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { B as LogIn, Bt as Bell, C as Search, Mt as ChevronDown, Nt as Check, R as Menu, c as User, it as Globe, jt as ChevronRight, qt as Accessibility, t as X, wt as Circle, z as LogOut } from "../_libs/lucide-react.mjs";
import { d as DialogContent, f as DialogDescription, g as DialogTrigger, h as DialogTitle, l as Dialog, m as DialogPortal, p as DialogOverlay, u as DialogClose } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DropdownMenuItemIndicator, c as DropdownMenuRadioItem$1, d as DropdownMenuSubTrigger$1, f as DropdownMenuTrigger$1, i as DropdownMenuItem$1, l as DropdownMenuSeparator$1, n as DropdownMenuCheckboxItem$1, o as DropdownMenuLabel$1, r as DropdownMenuContent$1, s as DropdownMenuPortal, t as DropdownMenu$1, u as DropdownMenuSubContent$1 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { n as AccessibilityDialog } from "./AccessibilityDialog-2Yn5Clmm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SiteHeader-BYGnYAyt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DropdownMenu = DropdownMenu$1;
var DropdownMenuTrigger = DropdownMenuTrigger$1;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuSubTrigger$1, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = DropdownMenuSubTrigger$1.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSubContent$1, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = DropdownMenuSubContent$1.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuContent$1, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = DropdownMenuContent$1.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem$1, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = DropdownMenuItem$1.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuCheckboxItem$1, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = DropdownMenuCheckboxItem$1.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuRadioItem$1, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = DropdownMenuRadioItem$1.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = DropdownMenuLabel$1.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = DropdownMenuSeparator$1.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var Sheet = Dialog;
var SheetTrigger = DialogTrigger;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription.displayName;
function LanguageMenu({ compact, light = false }) {
	const { state, set, t } = useApp();
	const cur = LANGUAGES.find((l) => l.code === state.lang) ?? LANGUAGES[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuTrigger, {
		className: `inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 ${light ? "text-slate-300 hover:bg-white/10 hover:text-white" : "text-slate-700 hover:bg-slate-100/80 hover:text-navy"}`,
		"aria-label": t("language"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-3.5 w-3.5 opacity-80" }),
			!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: cur.label }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3 opacity-60" })
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
		align: "end",
		className: "w-40",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, { children: t("language") }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
			LANGUAGES.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
				onSelect: () => {
					set({ lang: l.code });
					toast.success(`Language set to ${l.label}`);
				},
				"aria-current": l.code === state.lang,
				className: "flex items-center justify-between",
				children: [l.label, l.code === state.lang && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-gov font-bold",
					children: "✓"
				})]
			}, l.code))
		]
	})] });
}
function SiteHeader() {
	const { state, t, logout } = useApp();
	const nav = useNavigate();
	const [a11y, setA11y] = (0, import_react.useState)(false);
	const [open, setOpen] = (0, import_react.useState)(false);
	const s = state.session;
	const unread = state.notifications.filter((n) => !n.read).length;
	const path = useRouterState({ select: (s) => s.location.pathname });
	const loginPage = path === "/login" || path === "/officer/login";
	const primaryNav = [
		{
			to: "/schemes",
			label: "Schemes"
		},
		{
			to: "/citizen/benefits",
			label: "Benefits"
		},
		{
			to: "/eligibility",
			label: "Eligibility"
		},
		{
			to: "/track",
			label: "Track Application"
		},
		{
			to: "/help",
			label: "Help & Support"
		}
	];
	const mobileNav = [
		{
			to: "/",
			label: "Home"
		},
		{
			to: "/schemes",
			label: "Schemes"
		},
		{
			to: "/citizen/benefits",
			label: "Benefits"
		},
		{
			to: "/eligibility",
			label: "Eligibility"
		},
		{
			to: "/track",
			label: "Track Application"
		},
		{
			to: "/citizen/family",
			label: "My Family Record"
		},
		{
			to: "/citizen/documents",
			label: "My Documents"
		},
		{
			to: "/citizen/applications",
			label: "My Applications"
		},
		{
			to: "/help",
			label: "Help & Support"
		}
	];
	const doLogout = () => {
		if (s?.apiToken) apiRequest(s, "/api/v1/auth/logout", { method: "POST" }).catch(() => void 0);
		logout();
		toast.success("You have been signed out securely.");
		nav({ to: "/" });
	};
	const dashboard = s?.role === "officer" ? "/officer/dashboard" : s?.role === "admin" ? "/department/dashboard" : "/citizen/dashboard";
	const handleSearchClick = () => {
		if (path === "/") {
			const searchInput = document.getElementById("hero-search-input");
			if (searchInput) {
				searchInput.focus();
				searchInput.scrollIntoView({
					behavior: "smooth",
					block: "center"
				});
				return;
			}
		}
		nav({ to: "/schemes" });
	};
	if (loginPage) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-40 border-b border-border/80 bg-white/90 backdrop-blur-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#main",
				className: "sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded-md focus:bg-card focus:p-3 focus:shadow-md",
				children: t("skip")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 py-3.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2.5 transition-opacity hover:opacity-90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/miraicon.svg",
						alt: "Mira Logo",
						className: "h-8 w-8 rounded-lg object-contain shadow-xs",
						loading: "eager"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-base font-semibold tracking-tight text-navy",
							children: "Mira"
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "flex items-center gap-2 text-xs text-navy",
					"aria-label": t("accessLabel"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							size: "sm",
							className: "text-xs text-slate-700",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								children: "Home"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							size: "sm",
							className: "text-xs text-slate-700",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/help",
								children: "Help"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageMenu, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "h-8 w-8 text-slate-700",
							onClick: () => setA11y(true),
							"aria-label": t("accessibility"),
							title: t("accessibility"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accessibility, { className: "h-4 w-4" })
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessibilityDialog, {
				open: a11y,
				onOpenChange: setA11y
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-40 w-full transition-all duration-200",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#main",
				className: "sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-2 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-navy focus:shadow-md",
				children: t("skip")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				"aria-label": "Main Navigation",
				className: "border-b border-slate-200/70 bg-white/95 shadow-[0_2px_12px_rgba(20,24,31,0.035)] backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 py-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex items-center gap-2.5 group shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/miraicon.svg",
								alt: "Mira Logo",
								className: "h-8 w-8 object-contain transition-transform duration-200 group-hover:scale-105",
								loading: "eager"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-col",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-base font-semibold tracking-tight text-navy group-hover:text-gov transition-colors",
									children: "Mira"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "hidden md:flex items-center gap-1 lg:gap-2",
							children: primaryNav.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: link.to,
								className: "rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-navy",
								activeProps: { className: "bg-slate-100/90 text-navy font-semibold" },
								children: link.label
							}) }, link.to))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 sm:gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onClick: handleSearchClick,
									className: "h-9 w-9 text-slate-700 hover:bg-slate-100 hover:text-navy rounded-lg",
									"aria-label": "Search schemes and services",
									title: "Search",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageMenu, {}),
								s?.role === "citizen" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									asChild: true,
									className: "h-9 w-9 text-slate-700 hover:bg-slate-100 relative rounded-lg",
									"aria-label": `${t("notifications")} (${unread} unread)`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/citizen/notifications",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground",
											children: unread
										})]
									})
								}),
								s ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										className: "gap-2 rounded-lg border-slate-200 text-slate-800 hover:bg-slate-50 font-medium",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3.5 w-3.5 text-gov" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "hidden max-w-28 truncate sm:inline text-xs font-semibold",
												children: s.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3 opacity-60" })
										]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
									align: "end",
									className: "w-52",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuLabel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block font-semibold text-navy",
											children: s.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-xs font-normal text-muted-foreground",
											children: s.id
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
											onSelect: () => nav({ to: dashboard }),
											children: t("dashboard")
										}),
										s.role === "citizen" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
											onSelect: () => nav({ to: "/citizen/settings" }),
											children: t("settings")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
											onSelect: doLogout,
											className: "text-destructive focus:text-destructive",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-2 h-4 w-4" }), t("logout")]
										})
									]
								})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									asChild: true,
									className: "rounded-lg bg-navy hover:bg-navy/90 text-white font-medium px-3.5 shadow-xs transition-all duration-150",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/login",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "mr-1.5 h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sign In" })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
									open,
									onOpenChange: setOpen,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											className: "h-9 w-9 text-slate-700 md:hidden rounded-lg",
											"aria-label": "Open navigation menu",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
										side: "right",
										className: "w-80 p-0 flex flex-col bg-card",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, {
											className: "p-4 border-b border-border flex flex-row items-center justify-between",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: "/miraicon.svg",
													alt: "Mira",
													className: "h-7 w-7 rounded-lg object-contain"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
													className: "text-base font-semibold text-navy",
													children: "Mira Navigation"
												})]
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
											className: "flex-1 overflow-y-auto px-3 py-4 space-y-1",
											"aria-label": "Mobile Navigation",
											children: [mobileNav.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: l.to,
												onClick: () => setOpen(false),
												className: "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-navy",
												activeProps: { className: "bg-slate-100 font-semibold text-navy" },
												activeOptions: { exact: l.to === "/" },
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: l.label })
											}, l.to)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "pt-4 border-t border-border mt-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													onClick: () => {
														setOpen(false);
														setA11y(true);
													},
													className: "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-100",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accessibility, { className: "h-4 w-4 text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("accessibility") })]
												}), s ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													onClick: () => {
														setOpen(false);
														doLogout();
													},
													className: "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-destructive hover:bg-destructive/10",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("logout") })]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
													to: "/login",
													onClick: () => setOpen(false),
													className: "mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-3 py-2.5 text-sm font-medium text-white shadow-xs",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sign In" })]
												})]
											})]
										})]
									})]
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessibilityDialog, {
				open: a11y,
				onOpenChange: setA11y
			})
		]
	});
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "mt-12 border-t border-slate-200 bg-stone-50 text-slate-700",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-10 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/miraicon.svg",
								alt: "Mira",
								className: "h-8 w-8 object-contain",
								loading: "lazy"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-lg font-semibold tracking-tight text-slate-900",
								children: "Mira"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-slate-500 leading-relaxed",
							children: "Public records, welfare schemes and benefits, all in one place."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-wider text-slate-500",
						children: "Services"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3.5 space-y-2 text-sm text-slate-600",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/schemes",
								className: "hover:text-slate-900 transition-colors",
								children: "Explore Schemes"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/eligibility",
								className: "hover:text-slate-900 transition-colors",
								children: "Check Eligibility"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/track",
								className: "hover:text-slate-900 transition-colors",
								children: "Track Application"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/citizen/benefits",
								className: "hover:text-slate-900 transition-colors",
								children: "Benefit History"
							}) })
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-wider text-slate-500",
						children: "Your account"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3.5 space-y-2 text-sm text-slate-600",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/citizen/family",
								className: "hover:text-slate-900 transition-colors",
								children: "My Family Record"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/citizen/documents",
								search: { upload: false },
								className: "hover:text-slate-900 transition-colors",
								children: "Document Vault"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/citizen/applications",
								className: "hover:text-slate-900 transition-colors",
								children: "My Applications"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/citizen/grievances",
								className: "hover:text-slate-900 transition-colors",
								children: "Raise Grievance"
							}) })
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-wider text-slate-500",
						children: "Support"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3.5 space-y-2 text-sm text-slate-600",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/help",
							className: "hover:text-slate-900 transition-colors",
							children: "Help & FAQs"
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/officer/login",
							className: "hover:text-slate-900 transition-colors",
							children: "Officer Portal"
						}) })]
					})] })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-5 text-xs text-slate-500 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "© 2026 Mira" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/help",
					className: "hover:text-slate-900",
					children: "Help & support"
				})]
			})]
		})
	});
}
//#endregion
export { SheetTitle as a, SheetHeader as i, Sheet as n, SiteFooter as o, SheetContent as r, SiteHeader as s, LanguageMenu as t };
