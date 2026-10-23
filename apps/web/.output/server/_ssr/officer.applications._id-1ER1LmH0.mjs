import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { C as inr, M as useApp, S as getScheme, a as CITIZEN, c as MEMBERS, n as BENEFITS, o as HOUSEHOLD, x as fmtDate } from "./app-state-DFvYNEHf.mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { G as OctagonAlert, cn as CircleCheck, h as TriangleAlert } from "../_libs/lucide-react.mjs";
import { c as Pill, d as Timeline, o as PageHeader, r as LevelBadge, s as Panel, t as Empty, u as StatusBadge } from "./ui-C30c-cKm.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DOmVNICc.mjs";
import { t as Label } from "./label-BeT0bXvu.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Textarea } from "./textarea-DjqHhWkA.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DamjaduW.mjs";
import { n as EligibilityResult, r as evaluate, t as DEMO_PROFILE } from "./EligibilityResult-DWrVkyj0.mjs";
import { t as Route } from "./officer.applications._id-BEgNV6Y4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/officer.applications._id-1ER1LmH0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var REASONS = {
	Approve: ["All criteria met and documents verified", "Criteria met after clarification"],
	"Request Evidence": [
		"Updated income certificate required",
		"Property document unclear",
		"Clarification on prior household benefit",
		"Expired document"
	],
	Escalate: [
		"Complex household history",
		"Possible policy exception",
		"Inter-department record conflict"
	],
	Reject: [
		"Income exceeds scheme limit",
		"Confirmed duplicate household benefit",
		"Not resident in eligible area",
		"Ineligible after verification"
	]
};
var NEXT = {
	Approve: "Approved",
	"Request Evidence": "Additional Evidence Required",
	Escalate: "Officer Review",
	Reject: "Rejected"
};
function Review() {
	const { id } = Route.useParams();
	const { state, updateApp, addAudit, set, approveApp, rejectApp, requestAppEvidence, assignApp } = useApp();
	const a = state.applications.find((x) => x.id === id || x.rawId === id);
	const [act, setAct] = (0, import_react.useState)(null);
	const [reason, setReason] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [err, setErr] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (!a) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
		title: "Application not found",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/officer/applications",
				children: "Back"
			})
		})
	});
	const s = getScheme(a.schemeId) || {
		id: a.schemeId,
		name: a.schemeName || "Welfare Assistance Scheme",
		level: "Individual",
		documents: ["Income Certificate", "Residence Certificate"]
	};
	const own = a.householdId === CITIZEN.householdId;
	const elig = evaluate(s, {
		...DEMO_PROFILE,
		income: a.declaredIncome,
		priorHouseholdSchemes: a.duplicate ? [s.id] : []
	});
	const alert = state.alerts.find((d) => d.appId === a.id);
	const closed = a.status === "Approved" || a.status === "Rejected";
	const decide = async () => {
		if (!act) return;
		if (!reason) return setErr("Select a reason");
		if ((act === "Reject" || act === "Escalate" || act === "Request Evidence") && note.trim().length < 10) return setErr("An officer note of at least 10 characters is required");
		setBusy(true);
		try {
			const by = `${state.session?.name} (${state.session?.id})`;
			const next = NEXT[act];
			const targetId = a.rawId || a.id;
			if (act === "Approve") {
				await approveApp(targetId);
				toast.success("Application approved and benefit created in database.");
			} else if (act === "Reject") {
				await rejectApp(targetId, reason, note);
				toast.success("Application rejected and citizen notified.");
			} else if (act === "Request Evidence") {
				await requestAppEvidence(targetId, {
					evidence_type: "INCOME_CERTIFICATE",
					reason,
					description: note,
					deadline: new Date(Date.now() + 12096e5).toISOString().slice(0, 10)
				});
				toast.success("Evidence request sent to citizen portal.");
			} else updateApp(a.id, {
				status: next,
				stage: 4
			}, `${act}: ${reason}${note ? ` — ${note}` : ""}`, by);
			addAudit({
				actor: by,
				action: act === "Approve" ? "Application approved" : act === "Reject" ? "Application rejected" : act === "Escalate" ? "Application escalated" : "Officer requested evidence",
				application: a.id,
				prev: a.status,
				next,
				reason: `${reason}${note ? ` — ${note}` : ""}`
			});
			setAct(null);
			setReason("");
			setNote("");
			setErr("");
		} catch (e) {
			setErr(e.message || "Failed to process decision on database.");
		} finally {
			setBusy(false);
		}
	};
	const handleSelfAssign = async () => {
		if (!state.session?.apiUserId) return;
		try {
			const targetId = a.rawId || a.id;
			await assignApp(targetId, state.session.apiUserId, `Assigned to ${state.session.name}`);
			toast.success(`Application assigned to ${state.session.name}`);
		} catch (e) {
			toast.error(e.message || "Assignment failed");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: `${a.applicant} — ${s.name}`,
				desc: `${a.id} · received ${fmtDate(a.appliedOn)}`,
				crumbs: [{
					label: "Applications",
					to: "/officer/applications"
				}, { label: a.id }],
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LevelBadge, { level: s.level }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { s: a.status })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 xl:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							title: "Citizen information",
							actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/officer/citizens/$id",
								params: { id: a.citizenId },
								className: "text-xs text-gov hover:underline",
								children: "Full record"
							}),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "grid grid-cols-2 gap-3 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: a.applicant })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Citizen ID"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "font-mono",
										children: a.citizenId
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Aadhaar"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "font-mono",
										children: own ? CITIZEN.aadhaarMasked : "XXXX XXXX 1190"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Identity"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
										t: "ok",
										children: "Verified"
									}) })] })
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							title: "Family information",
							actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/officer/families/$id",
								params: { id: a.householdId },
								className: "text-xs text-gov hover:underline",
								children: "Family record"
							}),
							children: own ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "text-sm",
								children: MEMBERS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex justify-between border-b py-1.5 last:border-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										m.name,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted-foreground",
											children: ["· ", m.relationship]
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
										t: m.membership === "Active" ? "info" : "neutral",
										children: m.membership
									})]
								}, m.id))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: [
									"Household ",
									a.householdId,
									" · 4 active members"
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							title: "Income / BPL and Property",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "grid grid-cols-2 gap-3 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Declared income"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: inr(a.declaredIncome) })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "BPL"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: own ? HOUSEHOLD.bpl : "BPL" })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-xs text-muted-foreground",
											children: "Property"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: own ? HOUSEHOLD.property : "No property record found" })]
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							title: "Benefit history (household)",
							children: own ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-1.5 text-sm",
								children: BENEFITS.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										b.scheme,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-muted-foreground",
											children: ["· ", b.beneficiary]
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
										t: b.type === "Household" ? "teal" : "info",
										children: b.type
									})]
								}, b.ref))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "No prior benefits recorded."
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							title: "Uploaded documents",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-1.5 text-sm",
								children: s.documents.map((d, i) => {
									const st = d === "Income Certificate" && a.mismatch ? "Mismatch detected" : d.startsWith("Property") ? "Manual verification required" : d === "BPL Certificate" && a.status === "Additional Evidence Required" ? "Expired document" : "Verified";
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											d,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs text-muted-foreground",
												children: [
													"· file_",
													i + 1,
													".pdf"
												]
											})
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
											t: st === "Verified" ? "ok" : "warn",
											children: st
										})]
									}, d);
								})
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							title: "Eligibility result",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EligibilityResult, { ...elig })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							title: "Validation warnings",
							children: a.mismatch ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 shrink-0 text-warning" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-medium",
									children: [
										a.mismatch.field,
										": application ",
										a.mismatch.declared,
										" vs document ",
										a.mismatch.document
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-muted-foreground",
									children: ["Source: ", a.mismatch.source]
								})] })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-2 text-sm text-success",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), "No validation warnings"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
							title: "Duplicate alerts",
							children: alert ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctagonAlert, { className: "h-4 w-4 text-destructive" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: alert.id
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
												t: alert.severity === "High" ? "bad" : "warn",
												children: alert.severity
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, { children: alert.status })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2",
										children: alert.reason
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-muted-foreground",
										children: ["Supporting evidence: ", alert.sources.join(", ")]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										className: "mt-3",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/officer/duplicates",
											children: "Open comparison view"
										})
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-2 text-sm text-success",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), "No duplicate benefit found"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
							title: "Application timeline",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timeline, { app: a }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-4 space-y-2 border-t pt-3",
								children: [...a.events].reverse().map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: e.text
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "block text-muted-foreground",
										children: [
											e.date,
											" · ",
											e.by
										]
									})]
								}, i))
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-x-0 bottom-0 z-20 border-t bg-card md:left-60",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3 md:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mr-auto hidden text-sm text-muted-foreground sm:inline",
							children: closed ? `Decision recorded: ${a.status}` : "Every decision is recorded in the audit trail."
						}),
						!a.metadata?.assignment && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							onClick: handleSelfAssign,
							children: "Assign to Me"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: closed || busy,
							className: "bg-success text-success-foreground hover:bg-success/90",
							onClick: () => setAct("Approve"),
							children: "Approve"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: closed || busy,
							variant: "outline",
							onClick: () => setAct("Request Evidence"),
							children: "Request Evidence"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: closed || busy,
							variant: "outline",
							onClick: () => setAct("Escalate"),
							children: "Escalate"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: closed || busy,
							variant: "destructive",
							onClick: () => setAct("Reject"),
							children: "Reject"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!act,
				onOpenChange: (o) => {
					if (!o) {
						setAct(null);
						setErr("");
					}
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [
						act,
						": ",
						a.id
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: act === "Reject" ? "Rejection requires a reason and an officer note. The citizen will see the reason." : "This decision will be recorded with your officer ID." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Reason" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: reason,
								onValueChange: setReason,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "mt-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select a reason" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: act && REASONS[act].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: r,
									children: r
								}, r)) })]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
								htmlFor: "note",
								children: [
									"Officer note",
									" ",
									act !== "Approve" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-destructive",
										children: "*"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "note",
								rows: 4,
								value: note,
								onChange: (e) => setNote(e.target.value),
								className: "mt-1"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-destructive",
								role: "alert",
								children: err
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setAct(null),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: act === "Reject" ? "destructive" : "default",
						onClick: decide,
						children: ["Confirm ", act]
					})] })
				] })
			})
		]
	});
}
//#endregion
export { Review as component };
