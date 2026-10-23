import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { k as useApp, r as Button, v as cn } from "./button-B0ZnFkgi.mjs";
import { b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { Bt as Bell, C as Search, M as PanelLeftOpen, N as PanelLeftClose, R as Menu, z as LogOut } from "../_libs/lucide-react.mjs";
import { t as Emblem } from "./ui-BPP2eTpy.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-CKf-ASbx.mjs";
import { a as SheetTitle, i as SheetHeader, n as Sheet, r as SheetContent, t as LanguageMenu } from "./SiteHeader-BYGnYAyt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/WorkspaceShell-BynGC3fb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WorkspaceShell({ title, items, children, notifTo }) {
	const { state, logout } = useApp();
	const nav = useNavigate();
	const [collapsed, setCollapsed] = (0, import_react.useState)(false);
	const [mobile, setMobile] = (0, import_react.useState)(false);
	const [q, setQ] = (0, import_react.useState)("");
	const sideNav = (onClick, mini = false) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "flex flex-col gap-0.5 p-2",
		"aria-label": title,
		children: items.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: it.to,
			onClick,
			title: it.label,
			className: cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent", mini && "justify-center px-2"),
			activeProps: { className: "bg-sidebar-accent font-semibold text-sidebar-accent-foreground" },
			activeOptions: { exact: it.exact },
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(it.icon, { className: "h-4 w-4 shrink-0" }), !mini && it.label]
		}, it.to + it.label))
	});
	const search = (e) => {
		e.preventDefault();
		const v = q.trim().toUpperCase();
		if (!v) return;
		const app = state.applications.find((a) => a.id === v || a.applicant.toUpperCase().includes(v));
		if (app && state.session?.role === "officer") nav({
			to: "/officer/applications/$id",
			params: { id: app.id }
		});
		else if (v.startsWith("HH-")) nav({
			to: "/officer/families/$id",
			params: { id: v }
		});
		else if (v.startsWith("C-")) nav({
			to: "/officer/citizens/$id",
			params: { id: v }
		});
		else toast.error(`No record found for “${q}”`, { description: "Try an Application ID (APP-…), Citizen ID (C-…) or Household ID (HH-…)." });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: cn("sticky top-0 hidden h-screen shrink-0 flex-col bg-sidebar md:flex", collapsed ? "w-16" : "w-60"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 border-b border-sidebar-border px-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Emblem, { className: "h-8 w-8 shrink-0" }), !collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "leading-tight text-sidebar-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold",
								children: title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] opacity-75",
								children: "Unified Public Documentation"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 overflow-y-auto",
						children: sideNav(void 0, collapsed)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setCollapsed(!collapsed),
						className: "flex items-center gap-2 border-t border-sidebar-border px-4 py-3 text-xs text-sidebar-foreground hover:bg-sidebar-accent",
						"aria-label": collapsed ? "Expand sidebar" : "Collapse sidebar",
						children: collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftOpen, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftClose, { className: "h-4 w-4" }), "Collapse"] })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: mobile,
				onOpenChange: setMobile,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
					side: "left",
					className: "w-64 bg-sidebar p-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, {
						className: "border-b border-sidebar-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
							className: "text-sidebar-foreground",
							children: title
						})
					}), sideNav(() => setMobile(false))]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-20 flex items-center gap-3 border-b bg-card px-4 py-2.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							className: "md:hidden",
							onClick: () => setMobile(true),
							"aria-label": "Open menu",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: search,
							className: "relative max-w-md flex-1",
							role: "search",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: q,
								onChange: (e) => setQ(e.target.value),
								placeholder: "Search application, citizen or household ID",
								className: "pl-8",
								"aria-label": "Global search"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden truncate rounded border bg-muted px-2 py-1 text-xs lg:inline",
							children: state.session?.department ?? "Department"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-1 text-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageMenu, { compact: true }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									asChild: true,
									"aria-label": "Notifications",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: notifTo,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-5 w-5" })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "hidden text-right text-xs leading-tight sm:block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: state.session?.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground",
										children: state.session?.id
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									"aria-label": "Logout",
									onClick: () => {
										logout();
										toast.success("Logged out");
										nav({ to: "/" });
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-5 w-5" })
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					id: "main",
					className: "mx-auto w-full max-w-7xl flex-1 p-4 md:p-6",
					children
				})]
			})
		]
	});
}
//#endregion
export { WorkspaceShell as t };
