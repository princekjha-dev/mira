import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { k as useApp, r as Button, v as cn } from "./button-B0ZnFkgi.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Panel, l as Pill, s as PageHeader } from "./ui-BPP2eTpy.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DU8wes5o.mjs";
import { t as Label } from "./label-_Ez4PS27.mjs";
import { t as Textarea } from "./textarea-XPYv0WeA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/officer.duplicates-BS-9lsYT.js
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
			toast.error("Please add a note of at least 10 characters");
			return;
		}
		set((s) => ({ alerts: s.alerts.map((x) => x.id === d.id ? {
			...x,
			status: act
		} : x) }));
		addAudit({
			actor: `${state.session?.name} (${state.session?.id})`,
			action: `Duplicate alert: ${act}`,
			application: d.appId,
			prev: d.status,
			next: act,
			reason: note
		});
		if (act === "Not Duplicate") updateApp(d.appId, {
			status: "Officer Review",
			duplicate: false,
			stage: 4
		}, `Duplicate alert cleared: ${note}`, state.session?.name);
		if (act === "Evidence Requested") updateApp(d.appId, { status: "Additional Evidence Required" }, `Evidence requested on duplicate alert: ${note}`, state.session?.name);
		if (act === "Confirmed Duplicate") updateApp(d.appId, { status: "Officer Review" }, `Duplicate confirmed — pending final decision: ${note}`, state.session?.name);
		if (act === "Escalated") updateApp(d.appId, {}, `Duplicate alert escalated: ${note}`, state.session?.name);
		toast.success(`Alert marked: ${act}`, { description: act === "Confirmed Duplicate" ? "The application is not auto-rejected. Record your final decision on the review page." : "Recorded in audit trail." });
		setAct(null);
		setNote("");
	};
	const sev = (x) => x.severity === "High" ? "bad" : x.severity === "Medium" ? "warn" : "neutral";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Duplicate Alerts",
			desc: "Possible matches with existing benefits. Alerts never reject an application automatically — you decide."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-[320px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: state.alerts.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setSel(x.id),
					className: cn("w-full rounded-lg border bg-card p-3 text-left text-sm", sel === x.id && "border-gov ring-1 ring-gov"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs",
								children: x.id
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								t: sev(x),
								children: x.severity
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-medium",
							children: x.applicant
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: x.scheme
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
							className: "mt-2",
							children: x.status
						})
					]
				}) }, x.id))
			}), d && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: `${d.id} — ${d.scheme}`,
						actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/officer/applications/$id",
							params: { id: d.appId },
							className: "text-xs text-gov hover:underline",
							children: ["Open application ", d.appId]
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "grid gap-3 text-sm sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-xs text-muted-foreground",
									children: "Applicant"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: d.applicant })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-xs text-muted-foreground",
									children: "Household"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-mono",
									children: d.household
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Potential matching benefit"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: d.match })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Reason for match"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: d.reason })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-xs text-muted-foreground",
										children: "Evidence sources"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "flex flex-wrap gap-1",
										children: d.sources.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, { children: s }, s))
									})]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Comparison: Current Application vs Existing Record",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "text-left text-xs text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2",
											children: "Field"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2",
											children: "Current Application"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2",
											children: "Existing Record"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "p-2",
											children: "Match"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: d.compare.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: cn("border-t", c.same && "bg-warning/5"),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2 font-medium",
											children: c.field
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2",
											children: c.current
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2",
											children: c.existing
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-2",
											children: c.same ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
												t: "warn",
												children: "Same"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, { children: "Different" })
										})
									]
								}, c.field)) })]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setAct("Not Duplicate"),
								children: "Mark as Not Duplicate"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setAct("Evidence Requested"),
								children: "Request Evidence"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "destructive",
								onClick: () => setAct("Confirmed Duplicate"),
								children: "Confirm Duplicate"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setAct("Escalated"),
								children: "Escalate"
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
