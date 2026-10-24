import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { I as useApp } from "./app-state-C6MbzGTh.mjs";
import { t as Button } from "./button-BT328xhy.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { Kt as FileCheck, Pn as ArrowRight, S as Square, Sn as Calendar, X as Navigation, an as Clock, h as UserCheck, k as ShieldCheck, pn as CircleCheck, rt as MapPin, w as SquareCheckBig, xn as Camera } from "../_libs/lucide-react.mjs";
import { o as PageHeader } from "./ui-Df8W68Fj.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DO3wpSNE.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-D_Z_TEMQ.mjs";
import { t as Badge } from "./badge-BwCkcYhX.mjs";
import { t as Textarea } from "./textarea-D15QmElO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/officer.field-visits-Bg5suuGW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OfficerFieldVisitsPage() {
	const { state, updateFieldVisit, addAudit } = useApp();
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [activeVisit, setActiveVisit] = (0, import_react.useState)(null);
	const [inspectionNotes, setInspectionNotes] = (0, import_react.useState)("");
	const [isPhotoDialogOpen, setIsPhotoDialogOpen] = (0, import_react.useState)(false);
	const visits = state.fieldVisits || [];
	const filteredVisits = visits.filter((v) => {
		if (filter === "today") return v.scheduledDate === "2026-10-24";
		if (filter === "completed") return v.status === "Completed";
		if (filter === "pending") return v.status !== "Completed";
		return true;
	});
	const handleToggleChecklist = (visit, itemIndex) => {
		const updatedChecklist = [...visit.checklist];
		updatedChecklist[itemIndex] = {
			...updatedChecklist[itemIndex],
			checked: !updatedChecklist[itemIndex].checked
		};
		updateFieldVisit(visit.id, { checklist: updatedChecklist });
		toast.success("Checklist updated");
	};
	const handleCompleteVisit = (visit) => {
		updateFieldVisit(visit.id, {
			status: "Completed",
			officerNotes: inspectionNotes || visit.officerNotes || "Physical site inspected. Structure condition and family residence confirmed.",
			citizenConfirmation: {
				confirmed: true,
				signedBy: visit.citizenName,
				timestamp: (/* @__PURE__ */ new Date()).toISOString()
			}
		});
		addAudit({
			actor: `${state.session?.name} (${state.session?.id})`,
			action: "Field Inspection Completed",
			application: visit.applicationId,
			prev: visit.status,
			next: "Completed",
			reason: `Dwelling verified at ${visit.address}`
		});
		toast.success(`Field visit ${visit.id} verified and recorded on immutable audit ledger.`);
		setActiveVisit(null);
	};
	const handleSimulatePhoto = (visit) => {
		const newPhotos = [...visit.evidencePhotos || [], `Geotagged Roof & Foundation Photo (${(/* @__PURE__ */ new Date()).toLocaleTimeString()})`];
		updateFieldVisit(visit.id, { evidencePhotos: newPhotos });
		toast.success("Geotagged camera evidence synced (Lat: 26.8467, Lon: 80.9462)");
		setIsPhotoDialogOpen(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Field Inspection Operations",
				desc: "On-site physical inspection schedule, geotagged evidence capture, and dwelling status reports.",
				crumbs: [{
					label: "Officer",
					to: "/officer/dashboard"
				}, { label: "Field Visits" }]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-4 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "border-border/60 shadow-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-medium text-muted-foreground",
										children: "Today's Route"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigation, { className: "h-4 w-4 text-primary" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 text-2xl font-bold",
									children: "2 Visits"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "Chandauli Rural Cluster"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "border-border/60 shadow-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-medium text-muted-foreground",
										children: "Verification Rate"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-teal-600" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 text-2xl font-bold",
									children: "94.8%"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-teal-600",
									children: "SLA compliance met"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "border-border/60 shadow-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-medium text-muted-foreground",
										children: "GPS Precision"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 text-emerald-600" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 text-2xl font-bold",
									children: "± 1.8 m"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "ISRO NavIC high-accuracy lock"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "border-border/60 shadow-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-medium text-muted-foreground",
										children: "Pending Action"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-amber-600" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 text-2xl font-bold",
									children: visits.filter((v) => v.status !== "Completed").length
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-amber-600",
									children: "Requires physical sign-off"
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-2 border-b pb-3",
				children: [
					{
						id: "all",
						label: "All Inspections"
					},
					{
						id: "today",
						label: "Today's Schedule"
					},
					{
						id: "pending",
						label: "Pending Sign-off"
					},
					{
						id: "completed",
						label: "Completed"
					}
				].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: filter === tab.id ? "default" : "outline",
					size: "sm",
					onClick: () => setFilter(tab.id),
					className: "rounded-full text-xs",
					children: tab.label
				}, tab.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: filteredVisits.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "flex flex-col justify-between border-border/80 shadow-xs transition-all hover:border-primary/40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "p-5 pb-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: v.status === "Completed" ? "secondary" : "outline",
									className: "mb-2 text-[11px]",
									children: [
										v.id,
										" · ",
										v.status
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
									className: "text-base font-semibold",
									children: v.citizenName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardDescription, {
									className: "flex items-center gap-1.5 pt-1 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: v.address })]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-right text-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1 text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										v.scheduledDate,
										" · ",
										v.scheduledTime
									] })]
								})
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-4 p-5 pt-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border bg-muted/30 p-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-2 font-medium text-foreground",
									children: "On-Site Verification Checklist:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-1.5",
									children: v.checklist.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => handleToggleChecklist(v, idx),
										className: "flex w-full items-center gap-2 text-left hover:text-primary",
										children: [item.checked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquareCheckBig, { className: "h-4 w-4 text-teal-600 shrink-0" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "h-4 w-4 text-muted-foreground shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: item.checked ? "line-through text-muted-foreground" : "text-foreground",
											children: item.label
										})]
									}, idx))
								})]
							}),
							v.officerNotes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: "Inspection Finding: "
								}), v.officerNotes]
							}),
							v.evidencePhotos && v.evidencePhotos.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: v.evidencePhotos.map((photo, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: "bg-background text-[10px] text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "mr-1 h-3 w-3 text-primary" }), photo]
								}, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center justify-between gap-2 border-t pt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "outline",
										className: "h-8 text-xs",
										onClick: () => {
											setActiveVisit(v);
											setIsPhotoDialogOpen(true);
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "mr-1.5 h-3.5 w-3.5" }), "Add Photo"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: v.status === "Completed" ? "outline" : "default",
										className: "h-8 text-xs",
										onClick: () => {
											setActiveVisit(v);
											setInspectionNotes(v.officerNotes || "");
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "mr-1.5 h-3.5 w-3.5" }), v.status === "Completed" ? "Review Inspection" : "Complete & Sign"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/officer/applications/$id",
									params: { id: v.applicationId },
									className: "inline-flex items-center text-xs font-medium text-primary hover:underline",
									children: ["Application ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 h-3 w-3" })]
								})]
							})
						]
					})]
				}, v.id))
			}),
			activeVisit && !isPhotoDialogOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!activeVisit,
				onOpenChange: (open) => !open && setActiveVisit(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Complete Field Inspection — ", activeVisit.id] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
							"Record final dwelling determination for ",
							activeVisit.citizenName,
							" (",
							activeVisit.applicationId,
							")."
						] })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 py-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-medium text-foreground",
								children: "Officer Field Observations"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: inspectionNotes,
								onChange: (e) => setInspectionNotes(e.target.value),
								placeholder: "e.g. Dwelling inspected. Unfinished kutcha wall verified. Family of 5 residing on premise.",
								rows: 4,
								className: "mt-1 text-xs"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-md border border-teal-500/30 bg-teal-500/10 p-3 text-teal-800 dark:text-teal-300",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										children: "Citizen Digital Presence Acknowledged"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-[11px] opacity-90",
									children: "Head of household authenticated via Aadhaar FaceRD/OTP presence on mobile field device."
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setActiveVisit(null),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => handleCompleteVisit(activeVisit),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mr-1.5 h-4 w-4" }), "Submit Verification Record"]
						})] })
					]
				})
			}),
			activeVisit && isPhotoDialogOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isPhotoDialogOpen,
				onOpenChange: setIsPhotoDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-5 w-5 text-primary" }), "Geotagged Evidence Camera"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs",
							children: "Capturing timestamped physical evidence with GPS coordinate stamping."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex aspect-video w-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/40 p-4 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-8 w-8 text-muted-foreground" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-xs font-medium",
										children: "NavIC GPS: 26.8467° N, 80.9462° E"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-muted-foreground",
										children: "Accuracy: ± 1.8m · Bearing: 184° S"
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setIsPhotoDialogOpen(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => handleSimulatePhoto(activeVisit),
							children: "Capture & Stash Evidence"
						})] })
					]
				})
			})
		]
	});
}
//#endregion
export { OfficerFieldVisitsPage as component };
