import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { I as useApp, M as registerUser, O as loginUser, _ as checkDemoHealth, g as authenticateDemo, k as mapRoleToUiRole } from "./app-state-C6MbzGTh.mjs";
import { t as Button } from "./button-BT328xhy.mjs";
import { S as useNavigate, x as Link, y as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { Jt as Eye, Kt as FileCheck, Pn as ArrowRight, Tn as Building2, V as RefreshCw, _ as TriangleAlert, h as UserCheck, k as ShieldCheck, l as Users, lt as LockKeyhole, mn as CircleAlert, ut as LoaderCircle, vn as Check } from "../_libs/lucide-react.mjs";
import { t as Label } from "./label-DubpHrt-.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-Cl-rV5ml.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-BJrgGkEr.js
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
		name: "Rajesh Sharma",
		titleKey: "demoAccountCitizenTitle",
		badgeKey: "demoAccountCitizenBadge",
		descKey: "demoAccountCitizenDesc",
		icon: Users
	},
	{
		role: "verifier",
		email: "demo.verifier@mira.demo",
		name: "Vikram Malhotra",
		titleKey: "demoAccountVerifierTitle",
		badgeKey: "demoAccountVerifierBadge",
		descKey: "demoAccountVerifierDesc",
		icon: ShieldCheck
	},
	{
		role: "scheme",
		email: "demo.scheme@mira.demo",
		name: "Sunita Verma",
		titleKey: "demoAccountSchemeTitle",
		badgeKey: "demoAccountSchemeBadge",
		descKey: "demoAccountSchemeDesc",
		icon: FileCheck
	},
	{
		role: "supervisor",
		email: "demo.supervisor@mira.demo",
		name: "Dr. Alok Nath",
		titleKey: "demoAccountSupervisorTitle",
		badgeKey: "demoAccountSupervisorBadge",
		descKey: "demoAccountSupervisorDesc",
		icon: UserCheck
	},
	{
		role: "auditor",
		email: "demo.auditor@mira.demo",
		name: "Priya Nair",
		titleKey: "demoAccountAuditorTitle",
		badgeKey: "demoAccountAuditorBadge",
		descKey: "demoAccountAuditorDesc",
		icon: Eye
	},
	{
		role: "admin",
		email: "demo.admin@mira.demo",
		name: "Arjun Mehta",
		titleKey: "demoAccountAdminTitle",
		badgeKey: "demoAccountAdminBadge",
		descKey: "demoAccountAdminDesc",
		icon: Building2
	}
];
function LoginPage({ initialRole } = {}) {
	const { t, login, logout } = useApp();
	const nav = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("demo");
	const [realTab, setRealTab] = (0, import_react.useState)("login");
	const [loadingRole, setLoadingRole] = (0, import_react.useState)(null);
	const [activeSigningAccount, setActiveSigningAccount] = (0, import_react.useState)(null);
	const [demoHealth, setDemoHealth] = (0, import_react.useState)("initializing");
	const [demoHealthDetails, setDemoHealthDetails] = (0, import_react.useState)(null);
	const [demoError, setDemoError] = (0, import_react.useState)(null);
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [displayName, setDisplayName] = (0, import_react.useState)("");
	const [realError, setRealError] = (0, import_react.useState)("");
	const [realBusy, setRealBusy] = (0, import_react.useState)(false);
	const fetchHealth = async () => {
		setDemoHealth("initializing");
		setDemoError(null);
		const res = await checkDemoHealth();
		setDemoHealth(res.state);
		setDemoHealthDetails(res.details || null);
	};
	(0, import_react.useEffect)(() => {
		let active = true;
		checkDemoHealth().then((res) => {
			if (!active) return;
			setDemoHealth(res.state);
			setDemoHealthDetails(res.details || null);
		});
		return () => {
			active = false;
		};
	}, []);
	const handleDemoSignIn = async (account) => {
		if (loadingRole) return;
		setLoadingRole(account.role);
		setActiveSigningAccount(account);
		setDemoError(null);
		try {
			logout();
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
			console.error("Demo login error:", cause);
			const message = cause instanceof Error ? cause.message : t("demoLaunchError");
			setDemoError(message);
		} finally {
			setLoadingRole(null);
			setActiveSigningAccount(null);
		}
	};
	const handleRealSubmit = async (e) => {
		e.preventDefault();
		setRealError("");
		setRealBusy(true);
		try {
			logout();
			let auth;
			if (realTab === "register") {
				if (!displayName.trim()) throw new Error("Please enter your legal full name.");
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
			console.error("Real authentication failed:", cause);
			setRealError(cause instanceof Error ? cause.message : t("authErrorFallback"));
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
					className: "login-panel w-full rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-b border-border/60 pb-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wider uppercase text-primary",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), t("platformAccess")]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground font-mono",
										children: "v2.4"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl",
									children: t("signInTitle")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1.5 text-sm text-muted-foreground leading-relaxed",
									children: t("signInSubtitle")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5 grid grid-cols-2 gap-1.5 rounded-xl bg-muted/80 p-1",
									role: "tablist",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										role: "tab",
										"aria-selected": mode === "demo",
										onClick: () => {
											setMode("demo");
											setDemoError(null);
										},
										className: `flex items-center justify-center gap-2 rounded-lg py-2 text-xs sm:text-sm font-semibold transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gov ${mode === "demo" ? "bg-card text-foreground shadow-xs ring-1 ring-border/50" : "text-muted-foreground hover:text-foreground"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-primary" }), t("demoAccessTab")]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										role: "tab",
										"aria-selected": mode === "real",
										onClick: () => {
											setMode("real");
											setRealError("");
										},
										className: `flex items-center justify-center gap-2 rounded-lg py-2 text-xs sm:text-sm font-semibold transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gov ${mode === "real" ? "bg-card text-foreground shadow-xs ring-1 ring-border/50" : "text-muted-foreground hover:text-foreground"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { className: "h-3.5 w-3.5 text-teal" }), t("realAccessTab")]
									})]
								})
							]
						}),
						mode === "demo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between px-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
										children: t("continueAs")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											demoHealth === "ready" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-emerald-600" }), t("liveSandboxActive")]
											}),
											demoHealth === "initializing" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin text-slate-500" }), t("preparingDemoEnvironment")]
											}),
											demoHealth === "degraded" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3.5 w-3.5 text-amber-600" }), t("demoEnvironmentDegraded")]
											}),
											demoHealth === "unavailable" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "inline-flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1.5 text-xs font-medium text-rose-700 dark:text-rose-400",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5 text-rose-600" }), t("demoEnvironmentUnavailable")]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: fetchHealth,
													className: "text-xs underline text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3 w-3" }), t("retryConnection")]
												})]
											})
										]
									})]
								}),
								loadingRole && activeSigningAccount && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									role: "status",
									className: "flex items-center gap-2.5 rounded-lg border border-gov/20 bg-gov/5 p-3 text-xs font-medium text-gov animate-pulse",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin shrink-0 text-gov" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										t("signingInAs"),
										" ",
										activeSigningAccount.name,
										"…"
									] })]
								}),
								demoError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									role: "alert",
									className: "flex items-center justify-between gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: demoError })]
									}), activeSigningAccount && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										className: "h-7 text-xs border-destructive/30 hover:bg-destructive/10 text-destructive",
										onClick: () => handleDemoSignIn(activeSigningAccount),
										children: t("retryAction")
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									role: "list",
									className: "divide-y divide-border/60 overflow-hidden rounded-xl border border-border/80 bg-card shadow-xs",
									children: DEMO_ACCOUNTS.map((account) => {
										const Icon = account.icon;
										const isBusy = loadingRole === account.role;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											role: "listitem",
											disabled: loadingRole !== null || demoHealth === "unavailable",
											onClick: () => handleDemoSignIn(account),
											"aria-label": `${t("launch")} ${account.name}, ${t(account.titleKey)}`,
											className: "group flex w-full items-center justify-between p-3 sm:px-4 text-left transition-all duration-150 hover:bg-muted/50 active:scale-[0.99] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gov focus-visible:z-10 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3.5 min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/70 bg-muted/60 text-foreground transition-transform group-hover:scale-105",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5 text-slate-700 dark:text-slate-300" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-sm font-semibold text-foreground tracking-tight",
															children: account.name
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border/50",
															children: t(account.titleKey)
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-muted-foreground truncate max-w-[270px] sm:max-w-[390px] mt-0.5",
														children: t(account.descKey)
													})]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex items-center gap-2 pl-3 shrink-0",
												children: isBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1.5 text-xs font-semibold text-gov",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }), t("opening")]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-background px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 group-hover:border-gov group-hover:text-gov group-hover:bg-gov/5 transition-colors",
													children: [t("launch"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3 transition-transform group-hover:translate-x-0.5" })]
												})
											})]
										}, account.role);
									})
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex border-b border-border/80 mb-5",
								role: "tablist",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									role: "tab",
									"aria-selected": realTab === "login",
									onClick: () => {
										setRealTab("login");
										setRealError("");
									},
									className: `pb-2.5 px-4 text-sm font-semibold border-b-2 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gov ${realTab === "login" ? "border-gov text-navy" : "border-transparent text-muted-foreground hover:text-foreground"}`,
									children: t("signInTab")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									role: "tab",
									"aria-selected": realTab === "register",
									onClick: () => {
										setRealTab("register");
										setRealError("");
									},
									className: `pb-2.5 px-4 text-sm font-semibold border-b-2 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-gov ${realTab === "register" ? "border-gov text-navy" : "border-transparent text-muted-foreground hover:text-foreground"}`,
									children: t("createCitizenAccountTab")
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleRealSubmit,
								className: "space-y-4 max-w-md mx-auto",
								children: [
									realTab === "register" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "real-name",
											children: t("fullLegalName")
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
											children: t("emailAddress")
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
												children: t("passwordPlaceholder")
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
												children: t("passwordRequirement")
											})
										]
									}),
									realError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										role: "alert",
										className: "flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: realError })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "submit",
										className: "w-full h-10 mt-2 bg-gov hover:bg-gov/90 text-white font-medium",
										disabled: realBusy,
										children: [realBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), t("authenticating")]
										}) : realTab === "register" ? t("registerButton") : t("signInButton"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1.5 h-4 w-4" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-center text-xs text-muted-foreground pt-2",
										children: realTab === "login" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											t("dontHaveAccountPrompt"),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													setRealTab("register");
													setRealError("");
												},
												className: "text-gov font-semibold underline underline-offset-2 hover:text-gov/80",
												children: t("registerHereLink")
											})
										] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											t("alreadyHaveAccountPrompt"),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													setRealTab("login");
													setRealError("");
												},
												className: "text-gov font-semibold underline underline-offset-2 hover:text-gov/80",
												children: t("signInHereLink")
											})
										] })
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1 font-medium text-slate-700 dark:text-slate-300",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { className: "h-3.5 w-3.5 text-teal" }), t("secureConnection")]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("privacyProtected") })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/help",
								className: "text-gov font-medium underline-offset-4 hover:underline",
								children: [t("support"), " ↗"]
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
