import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { k as useApp } from "./button-B0ZnFkgi.mjs";
import { b as Link, g as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
import { Bt as Bell, L as MessageSquareWarning, S as Settings, St as ClipboardList, Z as House, dt as FileText, o as Users, ot as Gift } from "../_libs/lucide-react.mjs";
import { u as RequireRole } from "./ui-BPP2eTpy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/citizen-D5qkFs38.js
var import_jsx_runtime = require_jsx_runtime();
function CitizenLayout() {
	const { t, state } = useApp();
	const unread = state.notifications.filter((n) => !n.read).length;
	const items = [
		{
			to: "/citizen/dashboard",
			label: t("dashboard"),
			icon: House
		},
		{
			to: "/citizen/applications",
			label: t("myApplications"),
			icon: ClipboardList
		},
		{
			to: "/citizen/family",
			label: t("myFamily"),
			icon: Users
		},
		{
			to: "/citizen/documents",
			label: t("documents"),
			icon: FileText
		},
		{
			to: "/citizen/benefits",
			label: t("benefits"),
			icon: Gift
		},
		{
			to: "/citizen/notifications",
			label: `${t("notifications")}${unread ? ` (${unread})` : ""}`,
			icon: Bell
		},
		{
			to: "/citizen/grievances",
			label: t("grievances"),
			icon: MessageSquareWarning
		},
		{
			to: "/citizen/settings",
			label: t("settings"),
			icon: Settings
		}
	];
	const mobile = [
		items[0],
		items[1],
		items[2],
		items[3],
		items[5]
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RequireRole, {
		role: "citizen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-7xl gap-6 px-4 py-6 pb-24 md:pb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
				className: "hidden w-52 shrink-0 md:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "sticky top-4 space-y-0.5 rounded-lg border bg-card p-2",
					"aria-label": "Citizen",
					children: items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: i.to,
						className: "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm hover:bg-muted",
						activeProps: { className: "bg-secondary font-semibold text-navy" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(i.icon, { className: "h-4 w-4" }), i.label]
					}, i.to))
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-w-0 flex-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: "fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t bg-card md:hidden",
			"aria-label": "Citizen quick navigation",
			children: mobile.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: i.to,
				className: "flex flex-col items-center gap-0.5 py-2 text-[11px] text-muted-foreground",
				activeProps: { className: "text-navy font-semibold" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(i.icon, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "max-w-full truncate px-1",
					children: i.label.replace(/ \(\d+\)/, "")
				})]
			}, i.to))
		})]
	});
}
//#endregion
export { CitizenLayout as component };
