import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { F as useApp } from "./app-state-7jSiCijd.mjs";
import { r as cn, t as Button } from "./button-BT328xhy.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Pill, o as PageHeader, s as Panel } from "./ui-lDSlMDlK.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DO3wpSNE.mjs";
import { t as Label } from "./label-DubpHrt-.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Textarea } from "./textarea-D15QmElO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/officer.duplicates-vYHRD1Dd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Dups() {
	const { state, set, addAudit, updateApp } = useApp();
	const [sel, setSel] = (0, import_react.useState)(state.alerts[0]?.id);
	const [act, setAct] = (0, import_react.useState)(null);
	const [note, setNote] = (0, import_react.useState)("");
	const d = state.alerts.find((x) => x.id === sel);
	const apply = () => {
		if (!d || !act) return;
		if (note.trim().length < 10) {
			toast.error("Please add an explanation note of at least 10 characters");
			return;
		}
		set((s) => ({ alerts: s.alerts.map((x) => x.id === d.id ? {
			...x,
			status: act
		} : x) }));
		addAudit({
			actor: `${state.session?.name} (${state.session?.id})`,
			action: `Duplicate determination: ${act}`,
			application: d.appId,
			prev: d.status,
			next: act,
			reason: note
		});
		if (act === "Legitimate Overlap" || act === "Not Duplicate") updateApp(d.appId, {
			status: "Officer Review",
			duplicate: false,
			stage: 4
		}, `Human adjudication cleared alert (${act}): ${note}`, state.session?.name);
		if (act === "Evidence Requested") updateApp(d.appId, { status: "Additional Evidence Required" }, `Evidence requested on duplicate signal: ${note}`, state.session?.name);
		if (act === "Confirmed Duplicate") updateApp(d.appId, { status: "Officer Review" }, `Duplicate confirmed — pending final decision: ${note}`, state.session?.name);
		if (act === "Escalated") updateApp(d.appId, {}, `Duplicate alert escalated to supervisor: ${note}`, state.session?.name);
		toast.success(`Determination recorded: ${act}`, { description: act === "Legitimate Overlap" ? "Alert resolved. Legitimate family/scheme overlap recorded. Not treated as fraud." : act === "Confirmed Duplicate" ? "The application is not auto-rejected. Officer records decision on case file." : "Recorded in audit trail." });
		setAct(null);
		setNote("");
	};
	const sev = (x) => x.severity === "High" ? "bad" : x.severity === "Medium" ? "warn" : "neutral";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Duplicate Claim Detection (Human-in-the-Loop)",
			desc: "Investigation signals flagged by entity resolution and benefit overlap rules. System never automatically rejects a citizen merely for potential duplicates — authorized officers make consequential adjudications."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-[320px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: state.alerts.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setSel(x.id),
					className: cn("w-full rounded-lg border bg-card p-3 text-left text-sm transition-all", sel === x.id && "border-gov ring-1 ring-gov shadow-sm"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs font-semibold",
								children: x.id
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								t: sev(x),
								children: x.severity
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-semibold text-navy",
							children: x.applicant
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground truncate",
							children: x.scheme
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
							className: "mt-2 text-[10px]",
							children: x.status
						})
					]
				}) }, x.id))
			}), d && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						title: `${d.id} — ${d.scheme}`,
						actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/officer/applications/$id",
							params: { id: d.appId },
							className: "text-xs text-gov hover:underline font-semibold",
							children: [
								"Open application ",
								d.appId,
								" ↗"
							]
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 rounded-md bg-blue-50/70 border border-blue-200/60 p-3 text-xs text-blue-900 leading-relaxed",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Investigation Signal:" }), " Potential duplicate detected because two applications share matching identity references or overlapping benefit periods. Platform policy prohibits automatic rejection or fraud accusations prior to human inquiry."]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "grid gap-3 text-sm sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-xs text-muted-foreground",
									children: "Applicant"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-semibold text-navy mt-0.5",
									children: d.applicant
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-xs text-muted-foreground",
									children: "Household ID"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-mono font-semibold text-slate-800 mt-0.5",
									children: d.household
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Potential Matching Record"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "text-xs font-medium text-slate-800 mt-0.5",
										children: d.match
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Matching Rationale"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "text-xs text-slate-700 mt-0.5 leading-relaxed",
										children: d.reason
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Evidence Sources"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "flex flex-wrap gap-1 mt-1",
										children: d.sources.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, { children: s }, s))
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Field-by-Field Evidence Comparison",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "text-left bg-slate-50 border-b text-slate-600",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5",
											children: "Field"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5",
											children: "Current Application"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5",
											children: "Existing Record"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2.5",
											children: "Signal Result"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y text-slate-700",
									children: d.compare.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: cn(c.same && "bg-amber-50/40"),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2.5 font-semibold text-navy",
												children: c.field
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2.5 font-mono",
												children: c.current
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2.5 font-mono",
												children: c.existing
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2.5",
												children: c.same ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
													t: "warn",
													children: "Potential Match"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
													t: "neutral",
													children: "Distinct"
												})
											})
										]
									}, c.field))
								})]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2.5 pt-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "bg-teal hover:bg-teal/90 text-white text-xs h-9",
								onClick: () => setAct("Legitimate Overlap"),
								children: "Legitimate Overlap (Resolve Alert)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								className: "text-xs h-9",
								onClick: () => setAct("Not Duplicate"),
								children: "Mark as Distinct Application"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								className: "text-xs h-9 text-amber-900 border-amber-300 hover:bg-amber-50",
								onClick: () => setAct("Evidence Requested"),
								children: "Request Evidence from Citizen"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "destructive",
								className: "text-xs h-9",
								onClick: () => setAct("Confirmed Duplicate"),
								children: "Confirm Subsumed Duplicate"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								className: "text-xs h-9 text-slate-700",
								onClick: () => setAct("Escalated"),
								children: "Escalate to Supervisor"
							})
						]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!act,
			onOpenChange: (o) => !o && setAct(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: act }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Your note and officer ID will be recorded in the audit trail." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "dn",
					children: "Officer note"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: "dn",
					rows: 4,
					value: note,
					onChange: (e) => setNote(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setAct(null),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: apply,
					children: "Confirm"
				})] })
			] })
		})
	] });
}
//#endregion
export { Dups as component };
