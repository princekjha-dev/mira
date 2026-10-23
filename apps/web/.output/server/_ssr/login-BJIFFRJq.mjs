import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { D as loginUser, F as useApp, O as mapRoleToUiRole, g as authenticateDemo, j as registerUser } from "./app-state-7jSiCijd.mjs";
import { t as Button } from "./button-BT328xhy.mjs";
import { S as useNavigate, x as Link, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { Jt as Eye, Kt as FileCheck, Pn as ArrowRight, Tn as Building2, h as UserCheck, k as ShieldCheck, l as Users, lt as LockKeyhole, mn as CircleAlert, vn as Check } from "../_libs/lucide-react.mjs";
import { t as Label } from "./label-DubpHrt-.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-Cl-rV5ml.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-BJIFFRJq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var login_family_photo_default = "/assets/login-family-photo-B6kDCwbb.webp";
var login_service_photo_default = "/assets/login-service-photo-CCMLa57X.webp";
var login_civic_photo_default = "/assets/login-civic-photo-BV4fkVjk.webp";
var Route$1 = createFileRoute("/login")({
	head: () => ({ meta: [
		{ title: "Demo & Real Access — Mira Welfare Verification Platform" },
		{
			name: "description",
			content: "Sign in to Mira public services, field verification queues, and audit workspaces."
		},
		{
			property: "og:title",
			content: "Access — Mira"
		}
	] }),
	component: LoginPage
});
var ROLE_ROUTES = {
	citizen: "/citizen/dashboard",
	officer: "/officer/dashboard",
	verifier: "/verifier/dashboard",
	scheme: "/officer/dashboard",
	supervisor: "/verifier/dashboard",
	admin: "/department/dashboard",
	auditor: "/auditor/dashboard"
};
var DEMO_ACCOUNTS = [
	{
		role: "citizen",
		email: "demo.citizen@mira.demo",
		title: "Citizen / Applicant",
		name: "Rajesh Sharma",
		badge: "Citizen Account",
		description: "Sharma Family (MIRA-FAM-10482). Household tree, life events, document upload & scheme applications.",
		icon: Users
	},
	{
		role: "verifier",
		email: "demo.verifier@mira.demo",
		title: "Verification Officer",
		name: "Vikram Malhotra",
		badge: "Field Official",
		description: "Inspect incoming cases, verify family relationships, examine OCR evidence, request clarifications & resolve mismatches.",
		icon: ShieldCheck
	},
	{
		role: "scheme",
		email: "demo.scheme@mira.demo",
		title: "Scheme Officer",
		name: "Sunita Verma",
		badge: "Program Officer",
		description: "Review scheme eligibility evaluations, cross-scheme overlaps, and make final approval or documented rejection decisions.",
		icon: FileCheck
	},
	{
		role: "supervisor",
		email: "demo.supervisor@mira.demo",
		title: "Supervisor",
		name: "Dr. Alok Nath",
		badge: "Senior Review",
		description: "Second-tier reviews, escalated cases, complex duplicate adjudications, and appeal/dispute resolution.",
		icon: UserCheck
	},
	{
		role: "auditor",
		email: "demo.auditor@mira.demo",
		title: "Auditor",
		name: "Priya Nair",
		badge: "Strict Read-Only",
		description: "Immutable audit records, decision inspection, document access history, and compliance verification.",
		icon: Eye
	},
	{
		role: "admin",
		email: "demo.admin@mira.demo",
		title: "Administrator",
		name: "Arjun Mehta",
		badge: "System Authority",
		description: "Configure departments, welfare schemes, eligibility rules, staff permissions, and system settings.",
		icon: Building2
	}
];
function LoginPage({ initialRole } = {}) {
	const { t, login } = useApp();
	const nav = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("demo");
	const [realTab, setRealTab] = (0, import_react.useState)("login");
	const [loadingRole, setLoadingRole] = (0, import_react.useState)(null);
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [displayName, setDisplayName] = (0, import_react.useState)("");
	const [realError, setRealError] = (0, import_react.useState)("");
	const [realBusy, setRealBusy] = (0, import_react.useState)(false);
	const handleDemoSignIn = async (account) => {
		setLoadingRole(account.role);
		try {
			const auth = await authenticateDemo(account.role);
			const verifiedRole = mapRoleToUiRole(auth.user.roles);
			login({
				role: verifiedRole,
				name: auth.user.display_name,
				id: auth.user.id,
				apiToken: auth.token,
				apiUserId: auth.user.id,
				apiEmail: auth.user.email,
				isDemo: auth.user.is_demo,
				department: auth.user.organization?.name
			});
			toast.success(`Signed in as ${auth.user.display_name}`);
			const targetRoute = ROLE_ROUTES[verifiedRole] || "/citizen/dashboard";
			await nav({ to: targetRoute });
		} catch (cause) {
			console.error("Demo login error", cause);
			toast.error(cause instanceof Error ? cause.message : "Unable to launch demo workspace.");
		} finally {
			setLoadingRole(null);
		}
	};
	const handleRealSubmit = async (e) => {
		e.preventDefault();
		setRealError("");
		setRealBusy(true);
		try {
			let auth;
			if (realTab === "register") {
				if (!displayName.trim()) throw new Error("Please enter your full name.");
				auth = await registerUser(email, password, displayName);
				toast.success("Account created successfully!");
			} else auth = await loginUser(email, password);
			const role = mapRoleToUiRole(auth.user.roles);
			login({
				role,
				name: auth.user.display_name,
				id: auth.user.id,
				apiToken: auth.token,
				apiUserId: auth.user.id,
				apiEmail: auth.user.email,
				isDemo: auth.user.is_demo,
				department: auth.user.organization?.name
			});
			toast.success(`Welcome back, ${auth.user.display_name}`);
			const targetRoute = ROLE_ROUTES[role] || "/citizen/dashboard";
			await nav({ to: targetRoute });
		} catch (cause) {
			console.error("Real authentication failed", cause);
			setRealError(cause instanceof Error ? cause.message : "Authentication failed. Please verify credentials.");
		} finally {
			setRealBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "login-page min-h-screen py-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "login-background",
			"aria-hidden": "true",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "login-photo-layer login-photo-civic",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: login_civic_photo_default,
						alt: "",
						width: "1200",
						height: "800",
						className: "login-background-photo"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "login-photo-layer login-photo-family",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: login_family_photo_default,
						alt: "",
						width: "850",
						height: "1000",
						fetchPriority: "high",
						className: "login-background-photo"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "login-photo-layer login-photo-service",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: login_service_photo_default,
						alt: "",
						width: "1000",
						height: "680",
						className: "login-background-photo"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "login-photo-overlay" })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "login-layout mx-auto max-w-4xl px-4 sm:px-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "login-access w-full max-w-2xl mx-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "login-panel w-full rounded-2xl sm:rounded-3xl border border-border/80 bg-card/95 p-6 sm:p-8 shadow-xl backdrop-blur-md material-elevated",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-b border-border/60 pb-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wider uppercase text-primary",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), "MIRA PLATFORM ACCESS"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground font-mono",
										children: "v2.4"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl",
									children: "Sign In to Mira"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1.5 text-sm text-muted-foreground leading-relaxed",
									children: "Unified public welfare environment for citizens, verification officers, and administrators."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5 grid grid-cols-2 gap-1.5 rounded-xl bg-muted/80 p-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setMode("demo"),
										className: `flex items-center justify-center gap-2 rounded-lg py-2 text-xs sm:text-sm font-semibold transition-all active:scale-[0.98] ${mode === "demo" ? "bg-card text-foreground shadow-xs ring-1 ring-border/50" : "text-muted-foreground hover:text-foreground"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-primary" }), "Demo Access"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setMode("real"),
										className: `flex items-center justify-center gap-2 rounded-lg py-2 text-xs sm:text-sm font-semibold transition-all active:scale-[0.98] ${mode === "real" ? "bg-card text-foreground shadow-xs ring-1 ring-border/50" : "text-muted-foreground hover:text-foreground"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { className: "h-3.5 w-3.5 text-teal" }), "Use Real Account"]
									})]
								})
							]
						}),
						mode === "demo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between px-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Continue as"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), " Live sandbox active"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-xs",
								children: DEMO_ACCOUNTS.map((account) => {
									const Icon = account.icon;
									const isBusy = loadingRole === account.role;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										disabled: isBusy || loadingRole !== null,
										onClick: () => handleDemoSignIn(account),
										className: "group flex w-full items-center justify-between p-3.5 sm:px-4 text-left transition-all duration-150 hover:bg-muted/50 active:scale-[0.99] touch-target-44 disabled:opacity-50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3.5 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-muted/60 text-foreground transition-transform group-hover:scale-105",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4.5 w-4.5" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-sm font-semibold text-foreground tracking-tight",
														children: account.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "rounded-full bg-muted/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border/50",
														children: account.title
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-muted-foreground truncate max-w-[280px] sm:max-w-[380px] mt-0.5",
													children: account.description
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 pl-3 shrink-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "hidden sm:inline-flex text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity",
												children: isBusy ? "Opening…" : "Launch"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "flex h-7 w-7 items-center justify-center rounded-full bg-muted/60 text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3.5 w-3.5" })
											})]
										})]
									}, account.role);
								})
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex border-b border-slate-200 mb-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setRealTab("login"),
									className: `pb-2.5 px-4 text-sm font-semibold border-b-2 transition-colors ${realTab === "login" ? "border-gov text-navy" : "border-transparent text-slate-500 hover:text-slate-800"}`,
									children: "Sign In"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setRealTab("register"),
									className: `pb-2.5 px-4 text-sm font-semibold border-b-2 transition-colors ${realTab === "register" ? "border-gov text-navy" : "border-transparent text-slate-500 hover:text-slate-800"}`,
									children: "Create Real Citizen Account"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleRealSubmit,
								className: "space-y-4 max-w-md mx-auto",
								children: [
									realTab === "register" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "real-name",
											children: "Full Legal Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "real-name",
											type: "text",
											placeholder: "e.g. Rajesh Sharma",
											required: true,
											value: displayName,
											onChange: (e) => setDisplayName(e.target.value)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "real-email",
											children: "Email Address"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "real-email",
											type: "email",
											autoComplete: "username",
											placeholder: "citizen@example.com",
											required: true,
											value: email,
											onChange: (e) => setEmail(e.target.value)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "real-password",
												children: "Password"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "real-password",
												type: "password",
												autoComplete: realTab === "login" ? "current-password" : "new-password",
												required: true,
												placeholder: "••••••••••••",
												value: password,
												onChange: (e) => setPassword(e.target.value)
											}),
											realTab === "register" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-muted-foreground",
												children: "Minimum 8 characters. Stored securely with Argon2id hash."
											})
										]
									}),
									realError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: realError })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "submit",
										className: "w-full h-10 mt-2 bg-gov hover:bg-gov/90 text-white",
										disabled: realBusy,
										children: [realBusy ? "Authenticating…" : realTab === "register" ? "Create Real Account & Sign In" : "Sign In to Real Account", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1.5 h-4 w-4" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-center text-xs text-muted-foreground pt-2",
										children: realTab === "login" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											"Don't have an account?",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setRealTab("register"),
												className: "text-gov font-semibold underline underline-offset-2",
												children: "Register here"
											})
										] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											"Already have an account?",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setRealTab("login"),
												className: "text-gov font-semibold underline underline-offset-2",
												children: "Sign in here"
											})
										] })
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap items-center justify-between border-t pt-4 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1 font-medium text-slate-700",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { className: "h-3.5 w-3.5 text-teal" }), t("secureConnection")]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("privacyProtected") })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/help",
								className: "text-gov underline-offset-4 hover:underline",
								children: [
									t("needHelp"),
									" ",
									t("support"),
									" ↗"
								]
							}) })]
						})
					]
				})
			})
		})]
	});
}
//#endregion
export { Route$1 as n, LoginPage as t };
