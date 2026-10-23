import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { S as fmtDate, k as useApp, r as Button, v as cn } from "./button-B0ZnFkgi.mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { Pt as CheckCheck } from "../_libs/lucide-react.mjs";
import { n as Empty, s as PageHeader } from "./ui-BPP2eTpy.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as TabsTrigger, r as TabsList, t as Tabs } from "./tabs-s1yBS91Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/citizen.notifications-DT05Urjf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Notifs() {
	const { state, set } = useApp();
	const nav = useNavigate();
	const [tab, setTab] = (0, import_react.useState)("all");
	const list = state.notifications.filter((n) => tab === "all" || (tab === "unread" ? !n.read : n.read));
	const mark = (id, read) => set((s) => ({ notifications: s.notifications.map((n) => n.id === id ? {
		...n,
		read
	} : n) }));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Notifications",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: () => {
					set((s) => ({ notifications: s.notifications.map((n) => ({
						...n,
						read: true
					})) }));
					toast.success("All marked as read");
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "mr-1 h-4 w-4" }), "Mark all as read"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
			value: tab,
			onValueChange: setTab,
			className: "mb-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: "all",
					children: "All"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
					value: "unread",
					children: [
						"Unread (",
						state.notifications.filter((n) => !n.read).length,
						")"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: "read",
					children: "Read"
				})
			] })
		}),
		list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
			title: "You're all caught up",
			body: "No notifications in this view."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y rounded-lg border bg-card",
			children: list.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: cn("flex gap-3 p-4", !n.read && "bg-secondary/40"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", n.read ? "bg-transparent" : "bg-gov"),
					"aria-label": n.read ? "Read" : "Unread"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: cn("text-sm", !n.read && "font-semibold"),
							children: n.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: n.body
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: fmtDate(n.date)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex gap-2",
							children: [n.link && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => {
									mark(n.id, true);
									nav({ to: n.link });
								},
								children: "Open"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => mark(n.id, !n.read),
								children: ["Mark as ", n.read ? "unread" : "read"]
							})]
						})
					]
				})]
			}, n.id))
		})
	] });
}
//#endregion
export { Notifs as component };
