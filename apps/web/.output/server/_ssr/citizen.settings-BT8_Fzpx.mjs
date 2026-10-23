import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { c as LANGUAGES, k as useApp, o as CITIZEN, r as Button } from "./button-B0ZnFkgi.mjs";
import { b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Panel, l as Pill, s as PageHeader } from "./ui-BPP2eTpy.mjs";
import { t as Label } from "./label-_Ez4PS27.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-DO9HdihQ.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-s1yBS91Q.mjs";
import { t as Switch } from "./switch-D-EfSjDz.mjs";
import { t as AccessibilityControls } from "./AccessibilityDialog-2Yn5Clmm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/citizen.settings-BT8_Fzpx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Settings() {
	const { state, set, logout } = useApp();
	const nav = useNavigate();
	const [links, setLinks] = (0, import_react.useState)([
		{
			k: "Civil registration (birth/death)",
			on: true
		},
		{
			k: "Revenue — income certificates",
			on: true
		},
		{
			k: "Land records (Tehsil)",
			on: true
		},
		{
			k: "Rural Development — BPL list",
			on: true
		},
		{
			k: "Bank account (DBT)",
			on: false
		}
	]);
	const [revoke, setRevoke] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, { title: "Settings" }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "language",
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList, {
					className: "h-auto flex-wrap",
					children: [
						"language",
						"accessibility",
						"notifications",
						"privacy",
						"records",
						"security",
						"help"
					].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: t,
						className: "capitalize",
						children: t === "records" ? "Connected records" : t === "privacy" ? "Privacy & consent" : t === "security" ? "Login / security" : t
					}, t))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "language",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Language",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-2 sm:grid-cols-4",
							children: LANGUAGES.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: state.lang === l.code ? "default" : "outline",
								onClick: () => {
									set({ lang: l.code });
									toast.success(`Language set to ${l.label}`);
								},
								children: l.label
							}, l.code))
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "accessibility",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Accessibility",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessibilityControls, {})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "notifications",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Notification preferences",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4",
							children: [
								["sms", "SMS to " + CITIZEN.mobile],
								["email", "Email to " + CITIZEN.email],
								["app", "In-app notifications"]
							].map(([k, l]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: k,
									children: l
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									id: k,
									checked: state.notifPrefs[k],
									onCheckedChange: (v) => {
										set((s) => ({ notifPrefs: {
											...s.notifPrefs,
											[k]: v
										} }));
										toast.success("Preference saved");
									}
								})]
							}, k))
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "privacy",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						title: "Privacy & consent",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "You have given consent for departments to access linked records only when processing your applications. Every access is recorded in the audit log."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-3 space-y-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Consent for scheme verification" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
										t: "ok",
										children: "Active"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Consent for household benefit check" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
										t: "ok",
										children: "Active"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								className: "mt-4",
								onClick: () => toast.success("Your data access report has been prepared", { description: "Available in Notifications within 24 hours (demo)." }),
								children: "Request my data access report"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "records",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Connected records",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y",
							children: links.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between py-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: l.k }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
										t: l.on ? "ok" : "neutral",
										children: l.on ? "Linked" : "Not linked"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => l.on ? setRevoke(l.k) : (setLinks(links.map((x, j) => j === i ? {
											...x,
											on: true
										} : x)), toast.success(`${l.k} linked`)),
										children: l.on ? "Unlink" : "Link"
									})]
								})]
							}, l.k))
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "security",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						title: "Login / security",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "space-y-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Sign-in method" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: "Aadhaar OTP (demo)" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Registered mobile" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: CITIZEN.mobile })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Last sign-in" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: "This session" })]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "mt-4",
							onClick: () => toast.success("Signed out of all other devices"),
							children: "Sign out of other devices"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "help",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Help",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm",
							children: [
								"Visit ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/help",
									className: "text-gov underline",
									children: "Help & Support"
								}),
								" for FAQs, or ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/citizen/grievances",
									className: "text-gov underline",
									children: "raise a grievance"
								}),
								"."
							]
						})
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "destructive",
				onClick: () => {
					logout();
					toast.success("Logged out");
					nav({ to: "/" });
				},
				children: "Logout"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
			open: !!revoke,
			onOpenChange: (o) => !o && setRevoke(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogTitle, { children: [
				"Unlink ",
				revoke,
				"?"
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "Applications that need this record will ask you to upload documents manually instead." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
				onClick: () => {
					setLinks(links.map((x) => x.k === revoke ? {
						...x,
						on: false
					} : x));
					toast.success("Record unlinked");
				},
				children: "Unlink"
			})] })] })
		})
	] });
}
//#endregion
export { Settings as component };
