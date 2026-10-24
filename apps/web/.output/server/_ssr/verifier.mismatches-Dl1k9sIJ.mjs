import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { I as useApp } from "./app-state-C6MbzGTh.mjs";
import { t as Button } from "./button-BT328xhy.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Pn as ArrowRight, dn as CircleQuestionMark, pn as CircleCheck } from "../_libs/lucide-react.mjs";
import { o as PageHeader } from "./ui-Df8W68Fj.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DO3wpSNE.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as CardHeader, n as CardContent, t as Card } from "./card-D_Z_TEMQ.mjs";
import { t as Badge } from "./badge-BwCkcYhX.mjs";
import { t as Textarea } from "./textarea-D15QmElO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verifier.mismatches-Dl1k9sIJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VerifierMismatchesPage() {
	const { state, updateApp, addAudit } = useApp();
	const [selectedMismatchApp, setSelectedMismatchApp] = (0, import_react.useState)(null);
	const [resolutionNote, setResolutionNote] = (0, import_react.useState)("");
	const mismatches = state.applications.filter((a) => !!a.mismatch);
	const handleResolve = (appId, outcome) => {
		const app = state.applications.find((a) => a.id === appId);
		if (!app) return;
		if (outcome === "Accepted") {
			updateApp(appId, {
				mismatch: void 0,
				status: "Officer Review"
			}, `Mismatch resolved by verifier: ${resolutionNote || "Explanation and supporting records validated against revenue register."}`, state.session?.name);
			addAudit({
				actor: `${state.session?.name} (${state.session?.id})`,
				action: "Mismatch Overridden / Accepted",
				application: appId,
				prev: "Verification Required",
				next: "Officer Review",
				reason: resolutionNote || "Discrepancy reconciled with auxiliary proof."
			});
			toast.success(`Mismatch resolved for ${appId}. Forwarded to final review.`);
		} else {
			updateApp(appId, { status: "Additional Evidence Required" }, `Clarification requested: ${resolutionNote || "Please submit updated certificate or employer statement."}`, state.session?.name);
			addAudit({
				actor: `${state.session?.name} (${state.session?.id})`,
				action: "Evidence Requested",
				application: appId,
				prev: app.status,
				next: "Additional Evidence Required",
				reason: resolutionNote || "Clarification requested from citizen."
			});
			toast.success(`Evidence request sent to citizen for ${appId}.`);
		}
		setSelectedMismatchApp(null);
		setResolutionNote("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Mismatch & Discrepancy Resolution",
				desc: "Cross-registry discrepancies flagged by automated verification rules requiring human judgment.",
				crumbs: [{
					label: "Verifier",
					to: "/verifier/dashboard"
				}, { label: "Mismatches" }]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [mismatches.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "border-border/80 shadow-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "p-5 pb-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs font-semibold text-primary",
									children: a.id
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: "border-amber-400 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[10px]",
									children: [a.mismatch?.field, " Mismatch"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									"Applicant: ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: a.applicant
									}),
									" (",
									a.householdId,
									")"
								]
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-5 pt-2 space-y-4 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 rounded-lg border bg-muted/30 p-3 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground",
									children: "Citizen Declared Value:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-semibold text-foreground",
									children: a.mismatch?.declared
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] text-muted-foreground",
									children: [a.mismatch?.source, " Value:"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-semibold text-foreground",
									children: a.mismatch?.document
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground leading-relaxed",
								children: "The revenue department database reflects agricultural income combined with dairy earnings. The applicant's certificate dated August 2025 records base agricultural earnings only."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-2 border-t pt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "outline",
										className: "h-8 text-xs",
										onClick: () => setSelectedMismatchApp(a.id),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "mr-1.5 h-3.5 w-3.5 text-amber-600" }), "Request Citizen Clarification"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										className: "h-8 text-xs",
										onClick: () => {
											setSelectedMismatchApp(a.id);
											setResolutionNote("Validated against Tehsildar endorsement.");
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-1.5 h-3.5 w-3.5 text-teal-600" }), "Accept Declared Value & Resolve"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/verifier/applications/$id",
									params: { id: a.id },
									className: "inline-flex items-center text-xs font-medium text-primary hover:underline",
									children: ["Full Application ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 h-3 w-3" })]
								})]
							})
						]
					})]
				}, a.id)), mismatches.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "border-dashed p-8 text-center text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mx-auto h-8 w-8 text-teal-600" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm font-medium",
							children: "No unresolved mismatches in your jurisdiction"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs",
							children: "All records match authoritative databases within allowable tolerances."
						})
					]
				})]
			}),
			selectedMismatchApp && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!selectedMismatchApp,
				onOpenChange: (open) => !open && setSelectedMismatchApp(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Discrepancy Resolution — ", selectedMismatchApp] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs",
							children: "Submit finding or dispatch a statutory notice to the applicant."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3 py-2 text-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-medium text-foreground",
								children: "Official Rationale / Query Note"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: resolutionNote,
								onChange: (e) => setResolutionNote(e.target.value),
								placeholder: "Record justification for accepting the mismatch or specify the clarification required from the citizen.",
								rows: 4,
								className: "mt-1 text-xs"
							})] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2 sm:gap-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => handleResolve(selectedMismatchApp, "Clarification"),
								children: "Send Clarification Request"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: () => handleResolve(selectedMismatchApp, "Accepted"),
								children: "Accept & Reconcile"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { VerifierMismatchesPage as component };
