import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { D as nowStamp, S as fmtDate, k as useApp, l as MEMBERS, r as Button, s as HOUSEHOLD } from "./button-B0ZnFkgi.mjs";
import { $ as Heart, Q as History, Vt as Baby, Z as House, d as UserPlus, l as UserX, n as Wrench, tt as HeartCrack, v as Split } from "../_libs/lucide-react.mjs";
import { c as Panel, l as Pill, s as PageHeader } from "./ui-BPP2eTpy.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DU8wes5o.mjs";
import { t as Label } from "./label-_Ez4PS27.mjs";
import { t as Textarea } from "./textarea-XPYv0WeA.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-CKf-ASbx.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-s1yBS91Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/citizen.family-Bm3GG-1d.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EVENTS = [
	{
		k: "Add Family Member",
		icon: UserPlus,
		fields: [
			"Full name",
			"Relationship",
			"Date of birth"
		]
	},
	{
		k: "Request Relationship Correction",
		icon: Wrench,
		fields: ["Member name", "Correct relationship / detail"]
	},
	{
		k: "Report Marriage",
		icon: Heart,
		fields: [
			"Spouse name",
			"Date of marriage",
			"Marriage registration no."
		]
	},
	{
		k: "Report Separation",
		icon: HeartCrack,
		fields: ["Member name", "Date of separation"]
	},
	{
		k: "Report Birth",
		icon: Baby,
		fields: [
			"Child name",
			"Date of birth",
			"Birth certificate no."
		]
	},
	{
		k: "Report Death",
		icon: UserX,
		fields: [
			"Member name",
			"Date of death",
			"Death certificate no."
		]
	},
	{
		k: "Request Household Split",
		icon: Split,
		fields: ["Members moving", "New address"]
	}
];
function Family() {
	const { state, set, addAudit } = useApp();
	const [ev, setEv] = (0, import_react.useState)(null);
	const [vals, setVals] = (0, import_react.useState)({});
	const [note, setNote] = (0, import_react.useState)("");
	const [hist, setHist] = (0, import_react.useState)(null);
	const active = MEMBERS.filter((m) => m.membership === "Active");
	const past = MEMBERS.filter((m) => m.membership !== "Active");
	const submit = () => {
		if (!ev) return;
		const missing = ev.fields.filter((f) => !vals[f]?.trim());
		if (missing.length) {
			toast.error(`Please fill: ${missing.join(", ")}`);
			return;
		}
		const id = `FR-2026-${String(42 + state.familyRequests.length).padStart(4, "0")}`;
		set((s) => ({ familyRequests: [{
			id,
			type: ev.k,
			details: ev.fields.map((f) => `${f}: ${vals[f]}`).join("; ") + (note ? ` — ${note}` : ""),
			date: nowStamp().slice(0, 10),
			status: "Pending verification"
		}, ...s.familyRequests] }));
		addAudit({
			actor: `${state.session?.name} (${state.session?.id})`,
			action: `Family update requested: ${ev.k}`,
			application: HOUSEHOLD.id,
			prev: "Verified record",
			next: "Pending verification",
			reason: id
		});
		toast.success("Request submitted for verification", { description: `${id}. Your verified record stays unchanged until an officer approves.` });
		setEv(null);
		setVals({});
		setNote("");
	};
	const memberRow = (m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "grid gap-2 p-4 sm:grid-cols-[1.4fr_1fr_1fr_auto] sm:items-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: m.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						m.relationship,
						" · DOB ",
						fmtDate(m.dob),
						" · ",
						m.id
					]
				}),
				m.income && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: ["Income: ", m.income]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pill, {
					t: m.identity === "Verified" ? "ok" : "warn",
					children: ["ID: ", m.identity]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
					t: m.membership === "Active" ? "info" : "neutral",
					children: m.membership === "Active" ? "Active member" : m.membership
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs",
				children: m.benefits.length ? m.benefits.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: b }, b)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: "No benefits"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "ghost",
				onClick: () => setHist(m.id),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "mr-1 h-3.5 w-3.5" }), "History"]
			})
		]
	}, m.id);
	const hm = MEMBERS.find((m) => m.id === hist);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "My Family Record",
				desc: "Changes to verified information are sent for officer verification. Previous relationships are kept as history and are never deleted."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Family Overview",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-muted-foreground",
							children: "Household ID"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "font-mono",
							children: HOUSEHOLD.id
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-muted-foreground",
							children: "Household status"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
							t: "ok",
							children: HOUSEHOLD.status
						}) })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-muted-foreground",
							children: "BPL category"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: HOUSEHOLD.bpl })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-muted-foreground",
							children: "Income category"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: HOUSEHOLD.income })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted-foreground",
								children: "Current address"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "flex gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" }), HOUSEHOLD.address]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sm:col-span-2 lg:col-span-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted-foreground",
								children: "Property summary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: HOUSEHOLD.property })]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Report a life event or change",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7",
					children: EVENTS.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setEv(e),
						className: "flex flex-col items-center gap-1.5 rounded-md border p-3 text-center text-xs hover:border-gov hover:bg-secondary/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(e.icon, { className: "h-5 w-5 text-gov" }), e.k]
					}, e.k))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "current",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "current",
							children: [
								"Current members (",
								active.length,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "history",
							children: [
								"Former / historical (",
								past.length,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "requests",
							children: [
								"Requests (",
								state.familyRequests.length,
								")"
							]
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "current",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y rounded-lg border bg-card",
							children: active.map(memberRow)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "history",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y rounded-lg border bg-card",
							children: past.map(memberRow)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: "Historical records are kept so earlier household benefits can be correctly attributed."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "requests",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y rounded-lg border bg-card",
							children: state.familyRequests.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex flex-wrap items-center justify-between gap-2 p-4 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: r.type
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										r.id,
										" · ",
										fmtDate(r.date),
										" · ",
										r.details
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
									t: r.status === "Verified" ? "ok" : "warn",
									children: r.status
								})]
							}, r.id))
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!ev,
				onOpenChange: (o) => !o && setEv(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: ev?.k }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "This request will be verified by an officer before your record changes." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [ev?.fields.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: f,
							children: f
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: f,
							type: f.startsWith("Date") ? "date" : "text",
							value: vals[f] ?? "",
							onChange: (e) => setVals({
								...vals,
								[f]: e.target.value
							}),
							className: "mt-1"
						})] }, f)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "note",
							children: "Additional information (optional)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "note",
							value: note,
							onChange: (e) => setNote(e.target.value),
							className: "mt-1"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setEv(null),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: submit,
						children: "Submit for verification"
					})] })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!hm,
				onOpenChange: (o) => !o && setHist(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Record history — ", hm?.name] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: hm?.history.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "border-l-2 pl-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: h.event }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: fmtDate(h.date)
						})]
					}, i))
				})] })
			})
		]
	});
}
//#endregion
export { Family as component };
