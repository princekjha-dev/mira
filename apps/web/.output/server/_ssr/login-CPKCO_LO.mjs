import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { E as mapRoleToUiRole, T as loginUser, g as authenticateDemo, k as useApp, r as Button } from "./button-B0ZnFkgi.mjs";
import { b as Link, v as createFileRoute, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { H as LockKeyhole, Nt as Check, Rt as Building2, Ut as ArrowRight, Wt as ArrowLeft, o as Users, x as ShieldCheck } from "../_libs/lucide-react.mjs";
import { t as Label } from "./label-_Ez4PS27.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-CKf-ASbx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-CPKCO_LO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var login_family_photo_default = "/assets/login-family-photo-B6kDCwbb.webp";
var login_service_photo_default = "/assets/login-service-photo-CCMLa57X.webp";
var login_civic_photo_default = "/assets/login-civic-photo-BV4fkVjk.webp";
var Route = createFileRoute("/login")({
	head: () => ({ meta: [
		{ title: "Secure access — Mira" },
		{
			name: "description",
			content: "Sign in to Mira citizen services and authorized workspaces."
		},
		{
			property: "og:title",
			content: "Secure access — Mira"
		}
	] }),
	component: LoginPage
});
var ROLE_ROUTES = {
	citizen: "/citizen/dashboard",
	officer: "/officer/dashboard",
	verifier: "/officer/verification",
	admin: "/department/dashboard",
	auditor: "/officer/audit"
};
var DEMO_ACCOUNTS = [
	{
		role: "citizen",
		icon: Users,
		title: "Citizen access",
		description: "Explore schemes, household services and applications."
	},
	{
		role: "officer",
		icon: ShieldCheck,
		title: "Field official",
		description: "Review assigned applications and field work."
	},
	{
		role: "verifier",
		icon: ShieldCheck,
		title: "Verification officer",
		description: "Review documents and verification tasks."
	},
	{
		role: "admin",
		icon: Building2,
		title: "Department administrator",
		description: "Manage schemes, rules and service operations."
	},
	{
		role: "auditor",
		icon: LockKeyhole,
		title: "Auditor",
		description: "Inspect read-only audit and decision records."
	}
];
function LoginPage({ initialRole = "choose" }) {
	const { t } = useApp();
	const [role, setRole] = (0, import_react.useState)(initialRole);
	const panel = (0, import_react.useRef)(null);
	const choose = (value) => {
		setRole(value);
		requestAnimationFrame(() => panel.current?.focus());
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "login-page",
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
			className: "login-layout mx-auto max-w-7xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "login-access",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "login-panel w-full",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-widest text-teal",
							children: "Secure access"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 text-2xl font-semibold leading-snug text-navy",
							children: "Welcome to Mira"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted-foreground",
							children: "Choose an account to continue to its Mira workspace."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							ref: panel,
							tabIndex: -1,
							className: "mt-5 border-t pt-5 outline-none",
							children: role === "choose" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								"aria-label": "Choose demo account",
								children: [
									DEMO_ACCOUNTS.map(({ role: accountRole, icon: Icon, title, description }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										className: "login-role group h-auto w-full justify-start whitespace-normal border-border bg-card p-4 text-left shadow-none",
										onClick: () => choose(accountRole),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary text-gov",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "min-w-0 flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "block text-base font-semibold text-navy",
													children: title
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "mt-1 block text-sm font-normal leading-5 text-muted-foreground",
													children: description
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "login-role-arrow text-gov" })
										]
									}, accountRole)),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										className: "h-10 w-full text-sm text-slate-700",
										onClick: () => choose("account"),
										children: "Sign in with email and password"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "pt-2 text-xs leading-5 text-muted-foreground",
										children: "Prototype access uses synthetic demo accounts and data."
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "login-form-enter",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-5 flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "link",
										className: "h-auto p-0 text-gov",
										onClick: () => choose("choose"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {}), " Change account"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1 text-xs font-medium text-teal",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), "Demo account"]
									})]
								}), role === "account" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountLogin, {}) : role === "citizen" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CitizenLogin, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaffLogin, { role })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-4 text-[11px] text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { className: "h-3.5 w-3.5" }), t("secureConnection")]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("privacyProtected") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("roleAccess") })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-xs text-muted-foreground",
							children: [
								t("needHelp"),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/help",
									className: "text-gov underline-offset-4 hover:underline",
									children: [
										t("support"),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											"aria-hidden": "true",
											children: "↗"
										})
									]
								})
							]
						})
					]
				})
			})
		})]
	});
}
function useDemoSignIn(role) {
	const { login } = useApp();
	const nav = useNavigate();
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const signIn = async () => {
		setError("");
		setBusy(true);
		try {
			const auth = await authenticateDemo(role);
			const verifiedRole = mapRoleToUiRole(auth.user.roles);
			if (!auth.user.is_demo || verifiedRole !== role) throw new Error("This demo account is not configured for the selected workspace.");
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
			toast.success(`Welcome to Mira, ${auth.user.display_name}`);
			await nav({ to: ROLE_ROUTES[verifiedRole] });
		} catch (cause) {
			console.error("Demo sign-in failed", cause);
			setError(cause instanceof Error ? cause.message : "Unable to sign you in. Please try again.");
		} finally {
			setBusy(false);
		}
	};
	return {
		signIn,
		error,
		busy
	};
}
function AccountLogin() {
	const { login } = useApp();
	const nav = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const submit = async (event) => {
		event.preventDefault();
		setError("");
		setBusy(true);
		try {
			const auth = await loginUser(email, password);
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
			toast.success(`Welcome to Mira, ${auth.user.display_name}`);
			await nav({ to: ROLE_ROUTES[role] });
		} catch (cause) {
			console.error("Mira sign-in failed", cause);
			setError(cause instanceof Error ? cause.message : "Unable to sign you in. Please try again.");
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: submit,
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-semibold text-navy",
				children: "Sign in to Mira"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-6 text-muted-foreground",
				children: "Use the email and password associated with your Mira account."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "account-email",
					children: "Email"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "account-email",
					type: "email",
					autoComplete: "username",
					required: true,
					value: email,
					onChange: (event) => setEmail(event.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "account-password",
					children: "Password"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "account-password",
					type: "password",
					autoComplete: "current-password",
					required: true,
					value: password,
					onChange: (event) => setPassword(event.target.value)
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "alert",
				className: "rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "submit",
				className: "h-11 w-full",
				disabled: busy,
				children: [busy ? "Signing in…" : "Sign in", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
			})
		]
	});
}
function CitizenLogin() {
	const { signIn, error, busy } = useDemoSignIn("citizen");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-xl font-semibold text-navy",
			children: "Citizen access"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm leading-6 text-muted-foreground",
			children: "Sign in to your secure Mira demo account. No real identity service is contacted."
		}),
		error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			role: "alert",
			className: "mt-4 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive",
			children: error
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			type: "button",
			className: "mt-5 h-11 w-full",
			onClick: () => void signIn(),
			disabled: busy,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { className: "mr-1.5 h-4 w-4" }),
				busy ? "Connecting securely…" : "Continue as demo citizen",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-xs leading-5 text-muted-foreground",
			children: "Your demo account uses the same authenticated Mira services and persistent records as other accounts."
		})
	] });
}
function StaffLogin({ role }) {
	const { signIn, error, busy } = useDemoSignIn(role);
	const title = DEMO_ACCOUNTS.find((account) => account.role === role)?.title ?? "Mira workspace";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-xl font-semibold text-navy",
			children: title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm leading-6 text-muted-foreground",
			children: "Continue with the configured synthetic demonstration account."
		}),
		error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			role: "alert",
			className: "mt-4 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive",
			children: error
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			type: "button",
			className: "mt-5 h-11 w-full",
			onClick: () => void signIn(),
			disabled: busy,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockKeyhole, { className: "mr-1.5 h-4 w-4" }),
				busy ? "Connecting securely…" : `Continue to ${title}`,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})
			]
		}),
		role === "auditor" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-xs text-muted-foreground",
			children: "Auditor access is read-only."
		})
	] });
}
//#endregion
export { Route as n, LoginPage as t };
