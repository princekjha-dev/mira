import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { M as useApp, a as CITIZEN, s as LANGUAGES } from "./app-state-DFvYNEHf.mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { S as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as Mail, B as Phone, D as ShieldCheck, Sn as Bell, T as SlidersVertical, Ut as Eye, bn as Building2, dt as Laptop, l as User, mt as KeyRound, tt as LogOut, ut as Layers, wt as Globe } from "../_libs/lucide-react.mjs";
import { a as DropdownMenuSeparator, i as DropdownMenuLabel, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-tjUsXJpJ.mjs";
import { t as Switch } from "./switch-DtEVXaE2.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as getRoleConfig } from "./role-config-CoC8O2rM.mjs";
import { n as ProfileSection, t as ProfileRow } from "./ProfileSection-Dgf4XSDG.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ProfilePage-BpU06W8a.js
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage({ roleSpecificSection }) {
	const { state, set, logout } = useApp();
	const nav = useNavigate();
	const role = state.session?.role || "citizen";
	const roleConfig = getRoleConfig(role);
	const name = state.session?.name || roleConfig.defaultIdentity.name;
	const email = state.session?.email || (role === "citizen" ? CITIZEN.email : roleConfig.demoEmail);
	const phone = role === "citizen" ? CITIZEN.mobile : "+91 94150 82910";
	const department = state.session?.department || roleConfig.defaultIdentity.organization;
	const idBadge = state.session?.id || roleConfig.defaultIdentity.idBadge;
	const curLang = LANGUAGES.find((l) => l.code === state.lang) ?? LANGUAGES[0];
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl space-y-6 pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row sm:items-center justify-between gap-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex h-16 w-16 sm:h-18 sm:w-18 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-xl font-bold shadow-xs shrink-0",
							children: [getInitials(name), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-900",
								title: "Active Account"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight",
										children: name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500" }), "Active account"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300",
									children: roleConfig.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground pt-0.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: department }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-300 dark:text-slate-700",
											children: "·"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[11px] text-gov font-medium",
											children: idBadge
										})
									]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex sm:flex-col items-center sm:items-end gap-2 shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => {
								toast.success("Security token refreshed & synchronized");
							},
							className: "text-xs h-8 gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verify Token" })]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ProfileSection, {
				title: "Account Identity",
				description: "Official credentials recorded in state directory",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
						icon: User,
						title: "Full Name",
						description: "Verified citizen or government official name",
						value: name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
						icon: ShieldCheck,
						title: "Assigned Role",
						description: "Statutory authorization level within Mira",
						value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "capitalize",
							children: roleConfig.label
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
						icon: Building2,
						title: "Jurisdiction / Office",
						description: "Designated ministry, tehsil, or district unit",
						value: department
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
						icon: Layers,
						title: "Officer / Profile ID",
						description: "Cryptographically anchored identity badge",
						value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono",
							children: idBadge
						}),
						isLast: true
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ProfileSection, {
				title: "Contact Information",
				description: "Channels for official dispatches and OTP verification",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
					icon: Mail,
					title: "Official Email",
					description: "Used for alerts, determinations, and communications",
					value: email
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
					icon: Phone,
					title: "Mobile Number",
					description: "Linked with Aadhaar / State directory for SMS OTP",
					value: phone,
					isLast: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ProfileSection, {
				title: "Preferences & Appearance",
				description: "Language localization and workstation accessibility",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
						icon: Globe,
						title: "Interface Language",
						description: "Currently rendered language across forms and records",
						value: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								size: "sm",
								className: "h-7 text-xs font-semibold gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: curLang.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-400",
									children: "▾"
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
							align: "end",
							className: "w-44 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, {
									className: "text-[10px] uppercase font-mono text-muted-foreground",
									children: "Select Language"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
								LANGUAGES.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onClick: () => {
										set({ lang: l.code });
										toast.success(`Language changed to ${l.label}`);
									},
									className: "flex justify-between text-xs cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: l.label }), state.lang === l.code && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-gov font-bold",
										children: "✓"
									})]
								}, l.code))
							]
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
						icon: Bell,
						title: "In-App & Email Notifications",
						description: "Receive dispatch notifications and clarification alerts",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: state.notifPrefs.app,
							onCheckedChange: (val) => {
								set((s) => ({ notifPrefs: {
									...s.notifPrefs,
									app: val,
									email: val
								} }));
								toast.success("Notification preferences saved");
							}
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
						icon: Eye,
						title: "High Contrast Accessibility",
						description: "Enhances text contrast and visual element separation",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: state.highContrast,
							onCheckedChange: (val) => {
								set({ highContrast: val });
								document.documentElement.classList.toggle("hc", val);
								toast.success(val ? "High contrast enabled" : "High contrast disabled");
							}
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
						icon: SlidersVertical,
						title: "Reduced Motion",
						description: "Disables layout shifts and animated transitions",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: state.reducedMotion,
							onCheckedChange: (val) => {
								set({ reducedMotion: val });
								document.documentElement.classList.toggle("reduce-motion", val);
								toast.success(val ? "Reduced motion enabled" : "Standard motion enabled");
							}
						}),
						isLast: true
					})
				]
			}),
			roleSpecificSection,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ProfileSection, {
				title: "Security & Authentication",
				description: "Cryptographic tokens, sign-in sessions, and audit status",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
					icon: KeyRound,
					title: "Sign-In Mechanism",
					description: "Statutory non-repudiation and verification standard",
					value: role === "citizen" ? "Aadhaar e-KYC (Demo Mode)" : role === "auditor" ? "CAG Forensic Token · RSA-4096" : "Gov Cloud SSO · Multi-Factor"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
					icon: Laptop,
					title: "Active Sessions",
					description: "Current workstation connection from verified IP",
					value: "1 Active Device (This Browser)",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => toast.success("Signed out of all other devices"),
						className: "h-7 text-xs",
						children: "Sign out others"
					}),
					isLast: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileSection, {
				title: "Account Session",
				description: "Terminate your authenticated session",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileRow, {
					icon: LogOut,
					title: "Sign Out of Mira",
					description: "Safely end your workstation session and purge memory tokens",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "destructive",
						size: "sm",
						onClick: handleSignOut,
						className: "h-8 text-xs font-semibold gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3.5 w-3.5" }), "Sign Out"]
					}),
					destructive: true,
					isLast: true
				})
			})
		]
	});
}
//#endregion
export { ProfilePage as t };
