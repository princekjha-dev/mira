import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { C as getScheme, S as fmtDate, k as useApp, r as Button, v as cn, w as inr, y as downloadAcknowledgement } from "./button-B0ZnFkgi.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { It as Camera, O as RefreshCw, Ot as CircleCheck, Tt as CircleX, U as LoaderCircle, X as ImageUp, Y as Info, _t as Eye, g as Trash2, m as TriangleAlert, ut as FileUp, yt as Download } from "../_libs/lucide-react.mjs";
import { c as Panel, d as StatusBadge, f as Timeline, n as Empty, s as PageHeader } from "./ui-BPP2eTpy.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DU8wes5o.mjs";
import { t as Label } from "./label-_Ez4PS27.mjs";
import { t as Route } from "./citizen.applications._id-JuC0dJ0N.mjs";
import { t as Textarea } from "./textarea-XPYv0WeA.mjs";
import { t as Progress } from "./progress-DykNykY6.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/citizen.applications._id-DfAYw48B.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PIPELINE = [
	"Uploading",
	"Reading document",
	"Extracting information",
	"Checking format",
	"Validating information",
	"Complete"
];
function decideResult(docType, file, declaredIncome) {
	if (!(file.type === "application/pdf" || file.type.startsWith("image/"))) return { result: "Unreadable document" };
	const n = file.name.toLowerCase();
	if (n.includes("expired") || n.includes("2019")) return { result: "Expired document" };
	if (docType === "Income Certificate" && declaredIncome !== void 0 && declaredIncome !== 145e3) return {
		result: "Mismatch detected",
		mismatch: {
			field: "Annual household income",
			declared: inr(declaredIncome),
			document: inr(145e3)
		}
	};
	if (docType.startsWith("Property")) return { result: "Manual verification required" };
	return { result: "Verified" };
}
var resultUi = {
	Verified: {
		icon: CircleCheck,
		cls: "text-success",
		msg: "Document details match your records."
	},
	"Missing information": {
		icon: TriangleAlert,
		cls: "text-warning",
		msg: "Some required fields could not be found. Please upload a complete copy."
	},
	"Mismatch detected": {
		icon: TriangleAlert,
		cls: "text-warning",
		msg: "Values do not match. Please review or submit supporting evidence."
	},
	"Unreadable document": {
		icon: CircleX,
		cls: "text-destructive",
		msg: "We could not read this file. Upload a clear PDF, JPG or PNG."
	},
	"Expired document": {
		icon: TriangleAlert,
		cls: "text-warning",
		msg: "This document appears to be expired. Please upload a current copy."
	},
	"Manual verification required": {
		icon: TriangleAlert,
		cls: "text-gov",
		msg: "An officer will verify this document manually. No action needed now."
	}
};
function DocUploadCard({ docType, required, declaredIncome, value, onChange }) {
	const fileRef = (0, import_react.useRef)(null);
	const camRef = (0, import_react.useRef)(null);
	const [stage, setStage] = (0, import_react.useState)(-1);
	const [pct, setPct] = (0, import_react.useState)(0);
	const [pending, setPending] = (0, import_react.useState)(null);
	const [preview, setPreview] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!pending) return;
		let s = 0;
		let p = 0;
		setStage(0);
		setPct(0);
		const iv = setInterval(() => {
			if (s === 0) {
				p += 20;
				setPct(p);
				if (p >= 100) {
					s = 1;
					setStage(1);
				}
				return;
			}
			s += 1;
			setStage(s);
			if (s >= 5) {
				clearInterval(iv);
				const r = decideResult(docType, pending, declaredIncome);
				onChange({
					name: pending.name,
					size: pending.size,
					url: URL.createObjectURL(pending),
					...r
				});
				if (r.result === "Verified") toast.success(`${docType} verified`);
				else toast.warning(`${docType}: ${r.result}`);
				setPending(null);
			}
		}, 350);
		return () => clearInterval(iv);
	}, [pending]);
	const pick = (f) => {
		if (!f) return;
		if (f.size > 5242880) {
			toast.error("File is larger than 5 MB");
			return;
		}
		setPending(f);
	};
	const busy = pending !== null;
	const r = value ? resultUi[value.result] : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-lg border bg-card p-4", value?.result === "Mismatch detected" && "border-warning/60"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: docType
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [required ? "Required" : "Optional", " · PDF, JPG or PNG up to 5 MB"]
				})] }), value && r && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cn("flex items-center gap-1 text-xs font-medium", r.cls),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(r.icon, { className: "h-4 w-4" }), value.result]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: fileRef,
				type: "file",
				accept: "application/pdf,image/*",
				className: "hidden",
				onChange: (e) => {
					pick(e.target.files?.[0]);
					e.target.value = "";
				},
				"aria-label": `Upload ${docType}`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: camRef,
				type: "file",
				accept: "image/*",
				capture: "environment",
				className: "hidden",
				onChange: (e) => {
					pick(e.target.files?.[0]);
					e.target.value = "";
				},
				"aria-label": `Capture ${docType}`
			}),
			busy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 space-y-2",
				"aria-live": "polite",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "truncate text-sm",
						children: [
							pending.name,
							" · ",
							(pending.size / 1024).toFixed(0),
							" KB"
						]
					}),
					stage === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: pct }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "grid grid-cols-2 gap-1 text-xs sm:grid-cols-3",
						children: PIPELINE.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: cn("flex items-center gap-1", i < stage ? "text-success" : i === stage ? "font-medium text-navy" : "text-muted-foreground"),
							children: [i < stage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }) : i === stage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3 w-3 rounded-full border" }), p]
						}, p))
					})
				]
			}),
			!busy && value && r && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "truncate text-sm",
						children: [
							value.name,
							" · ",
							(value.size / 1024).toFixed(0),
							" KB"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: r.msg
					}),
					value.mismatch && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-warning/50 bg-warning/10 p-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-medium",
								children: ["Field: ", value.mismatch.field]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Application"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold",
									children: value.mismatch.declared
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: docType
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold",
									children: value.mismatch.document
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs",
								children: "Income values do not match. Please review or submit supporting evidence. Your application will not be rejected for this — it will be reviewed by an officer."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => setPreview(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "mr-1 h-3.5 w-3.5" }), "Preview"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => fileRef.current?.click(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-1 h-3.5 w-3.5" }), "Replace"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "ghost",
								onClick: () => {
									onChange(void 0);
									toast.info(`${docType} removed`);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-1 h-3.5 w-3.5" }), "Remove"]
							})
						]
					})
				]
			}),
			!busy && !value && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => fileRef.current?.click(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "mr-1 h-3.5 w-3.5" }), "Upload PDF"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => fileRef.current?.click(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageUp, { className: "mr-1 h-3.5 w-3.5" }), "Upload image"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => camRef.current?.click(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "mr-1 h-3.5 w-3.5" }), "Mobile capture"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: preview,
				onOpenChange: setPreview,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-3xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: value?.name }) }), value && (value.name.toLowerCase().endsWith(".pdf") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
						src: value.url,
						title: value.name,
						className: "h-[70vh] w-full rounded border"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: value.url,
						alt: docType,
						className: "max-h-[70vh] w-full object-contain"
					}))]
				})
			})
		]
	});
}
function AppDetail() {
	const { id } = Route.useParams();
	const { state, updateApp, addAudit, submitAppEvidence } = useApp();
	const a = state.applications.find((x) => x.id === id || x.rawId === id);
	const [dlg, setDlg] = (0, import_react.useState)(null);
	const [text, setText] = (0, import_react.useState)("");
	const [doc, setDoc] = (0, import_react.useState)();
	if (!a) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
		title: "Application not found",
		body: `No application with ID ${id}.`,
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/citizen/applications",
				children: "Back to applications"
			})
		})
	});
	const s = getScheme(a.schemeId) || {
		id: a.schemeId,
		name: a.schemeName || "Welfare Assistance Scheme",
		level: "Individual",
		documents: ["Income Certificate", "Residence Certificate"]
	};
	const submitText = async (label) => {
		if (text.trim().length < 10) {
			toast.error("Please write at least 10 characters");
			return;
		}
		const targetId = a.rawId || a.id;
		const reqId = a.metadata?.evidence_requests?.[0]?.id || "EV-RESP";
		try {
			await submitAppEvidence(targetId, {
				request_id: reqId,
				explanation: text.trim()
			});
			toast.success(`${label} submitted and forwarded to reviewing officer.`);
		} catch {
			updateApp(a.id, {
				status: "Officer Review",
				stage: Math.max(a.stage, 4)
			}, `${label}: “${text.trim()}”`, a.applicant);
		}
		addAudit({
			actor: `${state.session?.name} (${state.session?.id})`,
			action: label,
			application: a.id,
			prev: a.status,
			next: "Officer Review",
			reason: text.trim().slice(0, 80)
		});
		setText("");
		setDlg(null);
	};
	const submitDoc = async () => {
		if (!doc) {
			toast.error("Upload a document first");
			return;
		}
		const targetId = a.rawId || a.id;
		const reqId = a.metadata?.evidence_requests?.[0]?.id || "EV-DOC";
		try {
			await submitAppEvidence(targetId, {
				request_id: reqId,
				explanation: `Evidence uploaded: ${doc.name}`
			});
			toast.success("Document submitted for verification in officer portal.");
		} catch {
			updateApp(a.id, { status: "Documents Under Review" }, `Evidence uploaded: ${doc.name}`, a.applicant);
		}
		addAudit({
			actor: `${state.session?.name} (${state.session?.id})`,
			action: "Document uploaded",
			application: a.id,
			prev: a.status,
			next: "Documents Under Review",
			reason: doc.name
		});
		setDoc(void 0);
		setDlg(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: s.name,
			desc: `${a.id} · Applicant: ${a.applicant}`,
			crumbs: [{
				label: "My Applications",
				to: "/citizen/applications"
			}, { label: a.id }],
			actions: a.status === "Draft" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/citizen/apply/$schemeId",
					params: { schemeId: a.schemeId },
					children: "Continue application"
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: () => downloadAcknowledgement(a, s.name),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1 h-4 w-4" }), "Download acknowledgement"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-[1.4fr_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						title: "Status",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { s: a.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm text-muted-foreground",
									children: ["Last updated ", fmtDate(a.updatedOn)]
								})]
							}),
							a.status === "Draft" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm",
								children: "This application has not been submitted. Your progress is saved automatically."
							}),
							a.status === "Additional Evidence Required" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 rounded-md border border-warning/50 bg-warning/10 p-3 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: "The officer has asked for additional evidence."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1",
										children: a.events.at(-1)?.text
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex flex-wrap gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											onClick: () => setDlg("upload"),
											children: "Upload Missing Document"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => setDlg("respond"),
											children: "Respond to Officer"
										})]
									})
								]
							}),
							a.decision && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 rounded-md border p-3 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-medium",
										children: ["Decision: ", a.decision.outcome]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-muted-foreground",
										children: ["Reason: ", a.decision.reason]
									}),
									a.decision.note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-muted-foreground",
										children: ["Officer note: ", a.decision.note]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs text-muted-foreground",
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
					}),
					a.duplicate && a.status === "Verification Required" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						title: "Verification Required",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-5 w-5 shrink-0 text-warning" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: "A similar household-level benefit may already exist."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: "This is not a rejection. An officer will review the records and make the final decision. You can help by explaining your situation."
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => setDlg("reason"),
									children: "View reason"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => setDlg("clarify"),
									children: "Provide clarification"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => setDlg("upload"),
									children: "Upload evidence"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									onClick: () => setDlg("review"),
									children: "Request review"
								})
							]
						})]
					}),
					a.mismatch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Information mismatch",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5 shrink-0 text-warning" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: a.mismatch.field
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 grid grid-cols-2 gap-3 rounded-md border p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Application"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold",
											children: a.mismatch.declared
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: a.mismatch.source
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold",
											children: a.mismatch.document
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2",
										children: "Income values do not match. Please review or submit supporting evidence."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										className: "mt-3",
										onClick: () => setDlg("upload"),
										children: "Submit supporting evidence"
									})
								]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Activity",
						children: a.events.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "No activity yet."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-3",
							children: [...a.events].reverse().map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "border-l-2 pl-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: e.text }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										e.date,
										" · ",
										e.by
									]
								})]
							}, i))
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Application timeline",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timeline, { app: a })
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: dlg === "reason",
			onOpenChange: (o) => !o && setDlg(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Why verification is required" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Records available to you as the applicant" })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"A Rural Housing Assistance benefit was approved in 2019 for household ",
							a.householdId,
							", when the family of Rajesh Kumar was part of your household."
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Your household record shows a household split in March 2021. Because this is a household-level scheme, an officer needs to confirm whether the earlier benefit belongs to your current household." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground",
							children: "Sources: household lineage register, benefit registry, land records."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => setDlg("clarify"),
					children: "Provide clarification"
				}) })
			] })
		}),
		[
			"clarify",
			"review",
			"respond"
		].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: dlg === k,
			onOpenChange: (o) => !o && setDlg(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: k === "clarify" ? "Provide clarification" : k === "review" ? "Request review" : "Respond to officer" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Your message is attached to the application and visible to the reviewing officer." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: `t-${k}`,
					children: "Message"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					id: `t-${k}`,
					rows: 5,
					value: text,
					onChange: (e) => setText(e.target.value),
					placeholder: "e.g. The 2019 house was built for my brother-in-law's family, who now live separately in HH-UP-0417-3380."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setDlg(null),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => submitText(k === "clarify" ? "Clarification provided" : k === "review" ? "Review requested" : "Citizen response"),
					children: "Submit"
				})] })
			] })
		}, k)),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: dlg === "upload",
			onOpenChange: (o) => !o && setDlg(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Upload document / evidence" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocUploadCard, {
					docType: "Supporting Evidence",
					required: true,
					value: doc,
					onChange: setDoc
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setDlg(null),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: submitDoc,
					children: "Submit document"
				})] })
			] })
		})
	] });
}
//#endregion
export { AppDetail as component };
