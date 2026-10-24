import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { E as getScheme, I as useApp, T as fmtDate, m as apiRequest } from "./app-state-C6MbzGTh.mjs";
import { t as Button } from "./button-BT328xhy.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Ft as Flag, Jt as Eye, Lt as FileText, Yt as ExternalLink, _ as TriangleAlert, dn as CircleQuestionMark, k as ShieldCheck, l as Users, un as CircleX } from "../_libs/lucide-react.mjs";
import { d as Timeline, o as PageHeader, t as Empty, u as StatusBadge } from "./ui-Df8W68Fj.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DO3wpSNE.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-D_Z_TEMQ.mjs";
import { t as Badge } from "./badge-BwCkcYhX.mjs";
import { t as Textarea } from "./textarea-D15QmElO.mjs";
import { t as CommentsThread } from "./CommentsThread-BK2bVj4K.mjs";
import { r as DocumentViewer } from "./DocumentViewer-C87K61PY.mjs";
import { t as Route } from "./verifier.applications._id-dyQaFfk3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verifier.applications._id-C0u4xTxS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VerifierAppDetailWorkbench() {
	const { id } = Route.useParams();
	const { state, updateApp, addAudit } = useApp();
	const a = state.applications.find((x) => x.id === id || x.rawId === id);
	const [decisionDlg, setDecisionDlg] = (0, import_react.useState)(null);
	const [reason, setReason] = (0, import_react.useState)("");
	const [submittedDocs, setSubmittedDocs] = (0, import_react.useState)([]);
	const [activeDoc, setActiveDoc] = (0, import_react.useState)(null);
	const loadDocuments = () => {
		if (!state.session?.apiToken) return;
		const targetId = a?.rawId || a?.id;
		if (!targetId) return;
		apiRequest(state.session, `/api/v1/applications/${targetId}/documents`).then((res) => {
			if (res.data && res.data.length > 0) setSubmittedDocs(res.data);
			else apiRequest(state.session, `/api/v1/documents`).then((all) => setSubmittedDocs(all.data || [])).catch(() => setSubmittedDocs([]));
		}).catch(() => {
			apiRequest(state.session, `/api/v1/documents`).then((all) => setSubmittedDocs(all.data || [])).catch(() => setSubmittedDocs([]));
		});
	};
	(0, import_react.useEffect)(() => {
		if (a) loadDocuments();
	}, [
		a?.id,
		a?.rawId,
		state.session?.apiToken
	]);
	if (!a) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
		title: "Application not found",
		body: `No application record found for ${id}.`,
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/verifier/queue",
				children: "Back to Verification Queue"
			})
		})
	});
	const s = getScheme(a.schemeId) || {
		id: a.schemeId,
		name: "Welfare Assistance Scheme",
		level: "Individual",
		documents: ["Income Certificate", "Residence Certificate"]
	};
	const handleDecision = (outcome) => {
		if (!reason.trim()) {
			toast.error("Please enter a determination note or legal finding.");
			return;
		}
		const officerName = state.session?.name || "Neha Verma (Verification Officer)";
		if (outcome === "Approved") {
			updateApp(a.id, {
				status: "Approved",
				stage: 6,
				decision: {
					outcome: "Approved",
					reason: reason.trim(),
					note: reason.trim(),
					date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
					by: officerName
				}
			}, `Statutory approval granted: ${reason.trim()}`, officerName);
			addAudit({
				actor: officerName,
				action: "Application Approved",
				application: a.id,
				prev: a.status,
				next: "Approved",
				reason: reason.trim()
			});
			toast.success(`Application ${a.id} approved. Benefit entitlement generated.`);
		} else if (outcome === "Rejected") {
			updateApp(a.id, {
				status: "Rejected",
				stage: 6,
				decision: {
					outcome: "Rejected",
					reason: reason.trim(),
					note: reason.trim(),
					date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
					by: officerName
				}
			}, `Application rejected with cause: ${reason.trim()}`, officerName);
			addAudit({
				actor: officerName,
				action: "Application Rejected",
				application: a.id,
				prev: a.status,
				next: "Rejected",
				reason: reason.trim()
			});
			toast.error(`Application ${a.id} rejected.`);
		} else if (outcome === "Additional Evidence Required") {
			updateApp(a.id, { status: "Additional Evidence Required" }, `Clarification required from citizen: ${reason.trim()}`, officerName);
			addAudit({
				actor: officerName,
				action: "Evidence Requested",
				application: a.id,
				prev: a.status,
				next: "Additional Evidence Required",
				reason: reason.trim()
			});
			toast.info(`Clarification request dispatched to ${a.applicant}.`);
		} else if (outcome === "Escalated") {
			updateApp(a.id, { status: "Verification Required" }, `Escalated to Supervisor: ${reason.trim()}`, officerName);
			addAudit({
				actor: officerName,
				action: "Escalated to Supervisor",
				application: a.id,
				prev: a.status,
				next: "Verification Required",
				reason: reason.trim()
			});
			toast.warning(`Application ${a.id} flagged and escalated to Supervisor.`);
		}
		setDecisionDlg(null);
		setReason("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: `Determination: ${s.name}`,
				desc: `${a.id} · Applicant: ${a.applicant} · Household: ${a.householdId}`,
				crumbs: [{
					label: "Verifier Queue",
					to: "/verifier/queue"
				}, { label: a.id }],
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => setDecisionDlg("evidence"),
							className: "text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "mr-1.5 h-3.5 w-3.5 text-amber-500" }), "Request Evidence"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => setDecisionDlg("escalate"),
							className: "text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "mr-1.5 h-3.5 w-3.5 text-blue-500" }), "Escalate to Supervisor"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "destructive",
							onClick: () => setDecisionDlg("reject"),
							className: "text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "mr-1.5 h-3.5 w-3.5" }), "Reject"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => setDecisionDlg("approve"),
							className: "text-xs bg-emerald-600 hover:bg-emerald-700",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mr-1.5 h-3.5 w-3.5" }), "Approve Benefit"]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 lg:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "border-border/80 shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
								className: "p-4 pb-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { s: a.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: ["Updated ", fmtDate(a.updatedOn)]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "outline",
										className: "text-[10px]",
										children: [
											"Stage ",
											a.stage,
											" / 6"
										]
									})]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-4 pt-2 text-xs space-y-3",
								children: [
									a.duplicate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border border-blue-300/40 bg-blue-500/10 p-3 text-blue-900 dark:text-blue-200",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 font-semibold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-blue-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Household Lineage Cross-Match (Duplicate Signal)" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-[11px] opacity-90",
											children: "Earlier benefit sanctioned in 2019 for pre-split household lineage. March 2021 formal bifurcation registered in family register. Determination must verify distinct independent dwelling status."
										})]
									}),
									a.mismatch && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border border-amber-300/40 bg-amber-500/10 p-3 text-amber-900 dark:text-amber-200",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 font-semibold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-amber-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Data Mismatch Flagged: ", a.mismatch.field] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2 grid grid-cols-2 gap-2 text-[11px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Citizen Declared:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold text-foreground",
												children: a.mismatch.declared
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-muted-foreground",
												children: [a.mismatch.source, ":"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold text-foreground",
												children: a.mismatch.document
											})] })]
										})]
									}),
									a.decision && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border border-teal-300/40 bg-teal-500/10 p-3 text-teal-900 dark:text-teal-200",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "font-semibold",
												children: ["Official Determination: ", a.decision.outcome]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-1 text-[11px]",
												children: ["Reason: ", a.decision.reason]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "mt-1 text-[10px] text-muted-foreground",
												children: [
													"By ",
													a.decision.by,
													" on ",
													fmtDate(a.decision.date)
												]
											})
										]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "border-border/80 shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
								className: "p-4 pb-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
										className: "text-sm font-semibold flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-blue-600" }), "Submitted Documents & Evidence"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
										className: "text-xs",
										children: "Certificates attached to this application with OCR extracted intelligence"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "outline",
										className: "text-[10px]",
										children: [submittedDocs.length, " Documents"]
									})]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
								className: "p-4 pt-1 space-y-2 text-xs",
								children: submittedDocs.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "divide-y rounded-md border bg-slate-50/50",
									children: submittedDocs.map((doc) => {
										const isConflicting = doc.verification_status === "ACTION_REQUIRED" || doc.verification_status === "MISMATCH";
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center justify-between p-3 gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2.5 min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: `h-4 w-4 shrink-0 ${isConflicting ? "text-amber-600" : doc.verification_status === "VERIFIED" ? "text-emerald-600" : "text-slate-500"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-semibold text-slate-900 truncate",
														children: doc.original_filename
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-[11px] text-muted-foreground",
														children: [
															doc.document_type,
															" · v",
															doc.version_number || 1
														]
													})]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `rounded px-2 py-0.5 text-[10px] font-semibold border ${doc.verification_status === "VERIFIED" ? "border-emerald-300 bg-emerald-50 text-emerald-800" : isConflicting ? "border-amber-300 bg-amber-50 text-amber-900" : doc.verification_status === "REJECTED" ? "border-red-300 bg-red-50 text-red-800" : "border-slate-300 bg-slate-100 text-slate-700"}`,
													children: doc.verification_status
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													size: "sm",
													variant: "outline",
													onClick: () => setActiveDoc(doc),
													className: "h-7 text-xs px-2.5 gap-1 text-blue-700 border-blue-200 hover:bg-blue-50",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }), "View Document"]
												})]
											})]
										}, doc.id);
									})
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded border border-dashed p-4 text-center text-xs text-muted-foreground",
									children: "No submitted documents loaded."
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "border-border/80 shadow-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
								className: "p-4 pb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
									className: "text-sm font-semibold",
									children: "Statutory Eligibility Verification"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, {
									className: "text-xs",
									children: ["Criteria prescribed under ", s.name]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "p-4 pt-1 space-y-2 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between border-b pb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-foreground",
											children: "Annual Household Income < ₹ 2,00,000"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground",
											children: "Verified against Tehsildar & State Revenue Registry"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "border-teal-400 bg-teal-500/10 text-teal-700 text-[10px]",
											children: "Pass (₹ 1,72,000)"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between border-b pb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-foreground",
											children: "Rural Residence & Land Holding"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground",
											children: "Plot 42/Ward 7 recorded in UP Bhulekh Khatauni"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "border-teal-400 bg-teal-500/10 text-teal-700 text-[10px]",
											children: "Pass (0.18 Ha)"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between pb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-foreground",
											children: "No Prior Disqualifying Benefit in 5 Years"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground",
											children: "Household split authenticated by Gram Panchayat"
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "border-blue-400 bg-blue-500/10 text-blue-700 text-[10px]",
											children: "Requires Sign-off"
										})]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommentsThread, {
							recordType: "application",
							recordId: a.id
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border/80 shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
							className: "p-4 pb-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-sm font-semibold",
								children: "Application Lifecycle"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
							className: "p-4 pt-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timeline, { app: a })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border/80 shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
							className: "p-4 pb-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-sm font-semibold",
								children: "Household Summary"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-4 pt-1 space-y-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between border-b pb-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Household ID:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono font-medium",
										children: a.householdId
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between border-b pb-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Members Registered:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium font-semibold text-blue-900 dark:text-blue-200",
										children: a.householdId?.includes("10482") ? "35 Members (Multi-Gen)" : "5 Members"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between border-b pb-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Registration Date:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: "February 2010"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between pb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Jurisdiction:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: "Civil Lines, Demo District"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pt-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										asChild: true,
										variant: "outline",
										size: "sm",
										className: "w-full text-xs font-semibold gap-1.5 border-gov/30 text-gov hover:bg-gov/5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/verifier/family360",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3.5 w-3.5" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Inspect in Family360 Graph" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3 ml-auto" })
											]
										})
									})
								})
							]
						})]
					})]
				})]
			}),
			decisionDlg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!decisionDlg,
				onOpenChange: (open) => !open && setDecisionDlg(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "capitalize",
							children: decisionDlg === "approve" ? "Approve Application & Entitlement" : decisionDlg === "reject" ? "Issue Rejection Order" : decisionDlg === "evidence" ? "Request Additional Evidence" : "Escalate to Supervisor"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs",
							children: decisionDlg === "approve" ? "This determination will be cryptographically hashed and recorded to the state ledger." : "State statutory finding and administrative rationale."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3 py-2 text-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-medium text-foreground",
								children: "Determination Finding / Directive Note"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: reason,
								onChange: (e) => setReason(e.target.value),
								placeholder: decisionDlg === "approve" ? "e.g. All statutory criteria met. Household split confirmed independent. Prior 2019 benefit pertained to separate brother-in-law dwelling." : decisionDlg === "reject" ? "e.g. Ineligible under Rule 8(b): Income ceiling exceeded based on revenue records." : "e.g. Please furnish registered partition deed or Gram Panchayat resolution.",
								rows: 4,
								className: "mt-1 text-xs"
							})] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setDecisionDlg(null),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: decisionDlg === "reject" ? "destructive" : "default",
							onClick: () => handleDecision(decisionDlg === "approve" ? "Approved" : decisionDlg === "reject" ? "Rejected" : decisionDlg === "evidence" ? "Additional Evidence Required" : "Escalated"),
							children: "Confirm Determination"
						})] })
					]
				})
			}),
			activeDoc && state.session && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentViewer, {
				document: activeDoc,
				session: state.session,
				onClose: () => setActiveDoc(null),
				onChanged: () => {
					loadDocuments();
				}
			})
		]
	});
}
//#endregion
export { VerifierAppDetailWorkbench as component };
