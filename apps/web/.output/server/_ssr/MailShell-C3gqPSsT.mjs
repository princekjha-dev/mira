import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { M as useApp } from "./app-state-DFvYNEHf.mjs";
import { r as cn, t as Button } from "./button-PwNqyxv_.mjs";
import { $ as Mail, A as Send, D as ShieldCheck, Dn as ArrowUpDown, E as SlidersHorizontal, Et as Funnel, H as Paperclip, Ht as FileCheckCorner, I as RotateCw, Kt as EllipsisVertical, L as RotateCcw, M as SearchX, Mn as Activity, Mt as FileText, Pt as FileSpreadsheet, Rt as FileImage, Ut as Eye, Vt as FileCheck, Wt as ExternalLink, Xt as CornerDownRight, Zt as Copy, _n as Calendar, at as LoaderCircle, et as MailCheck, fn as ChevronDown, gt as Inbox, j as Search, jn as Archive, kn as ArrowLeft, ln as CircleAlert, n as X, pn as Check, q as Navigation, qt as Download, un as ChevronUp, w as Sparkles, x as SquarePen, y as Star } from "../_libs/lucide-react.mjs";
import { a as DropdownMenuSeparator, i as DropdownMenuLabel, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-tjUsXJpJ.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DOmVNICc.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { t as Textarea } from "./textarea-DjqHhWkA.mjs";
import { i as PopoverTrigger$1, n as PopoverContent$1, r as PopoverPortal, t as Popover$1 } from "../_libs/radix-ui__react-popover.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MailShell-C3gqPSsT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function formatMailDate(isoOrDateStr) {
	try {
		const d = new Date(isoOrDateStr.includes(" ") ? isoOrDateStr.replace(" ", "T") : isoOrDateStr);
		if (isNaN(d.getTime())) return isoOrDateStr;
		const now = /* @__PURE__ */ new Date();
		if (d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) return d.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit"
		});
		return d.toLocaleDateString([], {
			month: "short",
			day: "numeric"
		});
	} catch {
		return isoOrDateStr;
	}
}
function formatFullMailDate(isoOrDateStr) {
	try {
		const d = new Date(isoOrDateStr.includes(" ") ? isoOrDateStr.replace(" ", "T") : isoOrDateStr);
		if (isNaN(d.getTime())) return isoOrDateStr;
		return d.toLocaleDateString([], {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		});
	} catch {
		return isoOrDateStr;
	}
}
function AttachmentRow({ attachment, onPreview }) {
	const [isPreviewOpen, setIsPreviewOpen] = (0, import_react.useState)(false);
	const getFileIcon = (name, type) => {
		const ext = name.split(".").pop()?.toLowerCase();
		if (ext === "pdf" || type?.includes("pdf")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-rose-500 shrink-0" });
		if ([
			"png",
			"jpg",
			"jpeg",
			"webp"
		].includes(ext || "") || type?.includes("image")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileImage, { className: "h-4 w-4 text-emerald-500 shrink-0" });
		if ([
			"xlsx",
			"csv",
			"xls"
		].includes(ext || "") || type?.includes("sheet")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-4 w-4 text-teal-600 shrink-0" });
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "h-4 w-4 text-slate-500 shrink-0" });
	};
	const handleOpen = () => {
		if (onPreview) onPreview(attachment);
		else setIsPreviewOpen(true);
	};
	const handleDownload = () => {
		toast.success(`Downloading ${attachment.name}`, { description: `${Math.round(attachment.size / 1024)} KB · Verified secure attachment` });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group flex items-center justify-between gap-3 rounded-lg border border-slate-200/70 bg-slate-50/60 px-3 py-2 text-xs transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:bg-slate-800/60",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 items-center gap-2.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-7 w-7 items-center justify-center rounded-md bg-white shadow-2xs dark:bg-slate-800",
				children: getFileIcon(attachment.name, attachment.type)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate font-medium text-slate-900 dark:text-slate-100",
					children: attachment.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[11px] text-muted-foreground",
					children: [Math.round(attachment.size / 1024), " KB · Official attachment"]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-1 shrink-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "ghost",
				size: "sm",
				onClick: handleOpen,
				className: "h-7 px-2 text-[11px] font-medium text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "mr-1 h-3 w-3" }), "Open"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "ghost",
				size: "sm",
				onClick: handleDownload,
				className: "h-7 px-2 text-[11px] font-medium text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1 h-3 w-3" }), "Download"]
			})]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: isPreviewOpen,
		onOpenChange: setIsPreviewOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-2xl p-0 overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
				className: "border-b border-border/80 px-5 py-3.5 flex flex-row items-center justify-between space-y-0 bg-slate-50/50 dark:bg-slate-900/50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "text-sm font-semibold flex items-center gap-2",
					children: [getFileIcon(attachment.name, attachment.type), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: attachment.name })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
					className: "text-xs text-muted-foreground mt-0.5",
					children: [Math.round(attachment.size / 1024), " KB · Recorded in verification audit trail"]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2 pr-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3 w-3" }), "Verified Signature"]
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-6 bg-slate-100/60 dark:bg-slate-950/60 flex flex-col items-center justify-center min-h-[340px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-xl border border-border/70 bg-white dark:bg-slate-900 p-6 shadow-sm text-center space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800",
							children: getFileIcon(attachment.name, attachment.type)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "text-sm font-semibold text-slate-900 dark:text-slate-100",
								children: attachment.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Official Public Records Department Document Specification"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3 text-left text-xs space-y-1.5 border border-border/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "File size:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono text-foreground font-medium",
										children: [Math.round(attachment.size / 1024), " KB"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Format:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-foreground font-medium uppercase",
										children: attachment.type || "application/pdf"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Audit Seal:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-emerald-600 dark:text-emerald-400 font-medium",
										children: "SHA256: 4b2f…9e81"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								className: "flex-1 text-xs",
								onClick: () => {
									handleDownload();
									setIsPreviewOpen(false);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1.5 h-3.5 w-3.5" }), "Save Copy"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								className: "flex-1 text-xs bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900",
								onClick: () => {
									toast.success("Document opened in secure viewer tab");
									setIsPreviewOpen(false);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "mr-1.5 h-3.5 w-3.5" }), "Full Viewer"]
							})]
						})
					]
				})
			})]
		})
	})] });
}
function ReplyComposer({ recipientName, recipientEmail, recipientRole, applicationId, onSend, isSending = false }) {
	const [text, setText] = (0, import_react.useState)("");
	const [attachedFiles, setAttachedFiles] = (0, import_react.useState)([]);
	const [isFocused, setIsFocused] = (0, import_react.useState)(false);
	const fileInputRef = (0, import_react.useRef)(null);
	const textareaRef = (0, import_react.useRef)(null);
	const quickTemplates = [
		"Clarification verified. Updated document is attested in records.",
		"Please submit the stamped original certificate at your nearest Tehsil center.",
		"Inspection scheduled as per protocol. Household confirmation received.",
		"Noted and recorded in official verification ledger."
	];
	const handleAttachClick = () => {
		fileInputRef.current?.click();
	};
	const handleFileChange = (e) => {
		if (e.target.files) {
			const files = Array.from(e.target.files);
			setAttachedFiles((prev) => [...prev, ...files]);
			toast.success(`${files.length} document(s) attached`);
		}
	};
	const removeAttachment = (index) => {
		setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!text.trim() || isSending) return;
		try {
			await onSend(text.trim(), attachedFiles);
			setText("");
			setAttachedFiles([]);
		} catch (err) {
			toast.error("Failed to dispatch reply");
		}
	};
	const handleInsertTemplate = (snippet) => {
		setText((prev) => prev ? `${prev} ${snippet}` : snippet);
		textareaRef.current?.focus();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-2xl border transition-all duration-200 bg-white dark:bg-slate-900/90 shadow-2xs", isFocused ? "border-gov/60 ring-2 ring-gov/15 dark:ring-gov/30 shadow-xs" : "border-slate-200/80 dark:border-slate-800"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "flex flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 px-4 py-2 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CornerDownRight, { className: "h-3.5 w-3.5 text-gov" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Reply to" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-slate-800 dark:text-slate-200",
								children: recipientName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] text-muted-foreground/70",
								children: [
									"(",
									recipientEmail,
									")"
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 text-[11px] text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3 w-3 text-emerald-600 dark:text-emerald-400" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "Official record · Recorded in audit history"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "sm:hidden",
								children: "Official Record"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						ref: textareaRef,
						value: text,
						onChange: (e) => setText(e.target.value),
						onFocus: () => setIsFocused(true),
						onBlur: () => setIsFocused(false),
						placeholder: `Type clarification, dispatch notes, or official reply to ${recipientName}…`,
						rows: 3,
						className: "w-full resize-none border-0 bg-transparent p-1 text-xs leading-relaxed text-slate-900 placeholder:text-muted-foreground focus-visible:ring-0 dark:text-slate-100 min-h-[72px]"
					})
				}),
				attachedFiles.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5 px-3 pb-2",
					children: attachedFiles.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "h-3 w-3 text-gov" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "max-w-[140px] truncate",
								children: f.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => removeAttachment(i),
								className: "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
							})
						]
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 px-3 py-2 bg-slate-50/40 dark:bg-slate-900/40 rounded-b-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								ref: fileInputRef,
								onChange: handleFileChange,
								multiple: true,
								className: "hidden"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "ghost",
								size: "sm",
								onClick: handleAttachClick,
								className: "h-8 px-2.5 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "mr-1.5 h-3.5 w-3.5 text-slate-500" }), "Attach"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									variant: "ghost",
									size: "sm",
									className: "h-8 px-2.5 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mr-1.5 h-3.5 w-3.5 text-gov" }), "Insert"]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
								align: "start",
								className: "w-72 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, {
										className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-wider",
										children: "Official Standard Clauses"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
									quickTemplates.map((t, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										onClick: () => handleInsertTemplate(t),
										className: "text-xs cursor-pointer py-1.5",
										children: t
									}, idx))
								]
							})] })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "sm",
						disabled: !text.trim() || isSending,
						className: "h-8 px-3.5 text-xs font-medium gap-1.5 bg-gov text-white hover:bg-gov/90 shadow-2xs disabled:opacity-50",
						children: isSending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }), "Sending…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }), "Send"] })
					})]
				})
			]
		})
	});
}
function ConversationThread({ messages, onAttachmentPreview }) {
	const [expandedIds, setExpandedIds] = (0, import_react.useState)(() => {
		const init = {};
		if (messages.length > 1) {
			const latest = messages[messages.length - 1];
			if (latest) init[latest.id] = true;
		} else if (messages[0]) init[messages[0].id] = true;
		return init;
	});
	const toggleExpand = (id) => {
		setExpandedIds((prev) => ({
			...prev,
			[id]: !prev[id]
		}));
	};
	const getRoleBadge = (role) => {
		switch (role.toLowerCase()) {
			case "verifier": return "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20";
			case "officer": return "bg-gov/10 text-gov border-gov/20";
			case "admin": return "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20";
			case "auditor": return "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20";
			case "citizen": return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
			default: return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300";
		}
	};
	const getAvatarInitials = (name) => {
		const parts = name.trim().split(" ");
		if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
		return (name[0] || "M").toUpperCase();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-4",
		children: messages.map((msg, index) => {
			const isLatest = index === messages.length - 1;
			const isExpanded = expandedIds[msg.id] ?? isLatest;
			const hasAttachments = msg.attachments && msg.attachments.length > 0;
			if (!isExpanded && !isLatest) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => toggleExpand(msg.id),
				className: "w-full text-left flex items-center justify-between p-3 rounded-xl border border-slate-200/60 bg-slate-50/50 hover:bg-slate-100/60 dark:border-slate-800/80 dark:bg-slate-900/30 dark:hover:bg-slate-800/50 transition-colors duration-150",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5 min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-6 w-6 items-center justify-center rounded-full bg-slate-200/80 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300 shrink-0",
							children: getAvatarInitials(msg.senderName)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-xs text-slate-900 dark:text-slate-100 truncate",
							children: msg.senderName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[11px] text-muted-foreground truncate max-w-sm hidden sm:inline",
							children: ["— ", msg.body]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 shrink-0 text-muted-foreground",
					children: [
						hasAttachments && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "h-3 w-3 text-slate-400" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-mono tabular-nums",
							children: formatFullMailDate(msg.timestamp)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3.5 w-3.5 text-slate-400" })
					]
				})]
			}, msg.id);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: cn("rounded-2xl border transition-all duration-150 p-5 space-y-3", isLatest ? "bg-white dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800 shadow-2xs" : "bg-slate-50/40 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 ring-1 ring-border/50 shrink-0",
								children: getAvatarInitials(msg.senderName)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100",
									children: msg.senderName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("rounded px-1.5 py-0.2 text-[10px] font-mono uppercase font-medium border", getRoleBadge(msg.senderRole)),
									children: msg.senderRole
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: msg.senderEmail
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
								className: "text-[11px] text-muted-foreground font-mono tabular-nums",
								children: formatFullMailDate(msg.timestamp)
							}), messages.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => toggleExpand(msg.id),
								className: "p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md",
								"aria-label": "Toggle message expansion",
								children: isExpanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3.5 w-3.5" })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-w-3xl text-[14px] sm:text-[15px] leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap py-1",
						children: msg.body
					}),
					hasAttachments && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider font-mono",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Attachments (",
								msg.attachments.length,
								")"
							] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-2",
							children: msg.attachments.map((att) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AttachmentRow, {
								attachment: att,
								onPreview: onAttachmentPreview
							}, att.id))
						})]
					})
				]
			}, msg.id);
		})
	});
}
function MessageRow({ thread, isSelected, onSelect, onToggleStar }) {
	const isUnread = thread.status === "unread";
	const hasAttachments = thread.messages.some((m) => m.attachments && m.attachments.length > 0);
	const getRoleBadge = (roleStr) => {
		switch (roleStr.toLowerCase()) {
			case "verifier": return "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20";
			case "officer": return "bg-gov/10 text-gov border-gov/20";
			case "admin": return "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20";
			case "auditor": return "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20";
			default: return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
		}
	};
	const getInitials = (name) => {
		const parts = name.trim().split(" ");
		if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
		return (name[0] || "M").toUpperCase();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "button",
		tabIndex: 0,
		onClick: () => onSelect(thread),
		onKeyDown: (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				onSelect(thread);
			}
		},
		className: cn("group relative w-full text-left px-3.5 py-3 transition-colors duration-150 cursor-pointer border-b border-slate-100 dark:border-slate-800/80 outline-none select-none", isSelected ? "bg-slate-100/80 dark:bg-slate-800/70" : "hover:bg-slate-50/70 dark:hover:bg-slate-850/50 bg-transparent"),
		children: [
			isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute left-0 top-1 bottom-1 w-1 rounded-r-full bg-gov dark:bg-gov/90" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("h-2 w-2 rounded-full shrink-0 transition-opacity", isUnread ? "bg-gov shadow-2xs shadow-gov/50 opacity-100" : "opacity-0"),
							title: isUnread ? "Unread message" : void 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-6 w-6 items-center justify-center rounded-full bg-slate-200/80 dark:bg-slate-700 text-[10px] font-semibold text-slate-700 dark:text-slate-200 shrink-0",
							children: getInitials(thread.sender.name)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("truncate text-xs", isUnread ? "font-bold text-slate-950 dark:text-white" : "font-medium text-slate-700 dark:text-slate-300"),
							children: thread.sender.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("rounded px-1 py-0.2 text-[9px] font-mono uppercase font-medium border shrink-0 hidden sm:inline", getRoleBadge(thread.sender.role)),
							children: thread.sender.role
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("text-[11px] font-mono tabular-nums shrink-0 ml-1", isUnread ? "font-semibold text-gov dark:text-gov/90" : "text-muted-foreground"),
					children: formatMailDate(thread.timestamp)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 pl-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: cn("truncate text-xs leading-snug", isUnread ? "font-semibold text-slate-900 dark:text-slate-100" : "font-normal text-slate-700 dark:text-slate-300"),
						children: thread.subject
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground",
						children: thread.preview
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1.5 flex items-center justify-between text-[10px]",
						children: [thread.applicationId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-gov font-medium rounded bg-gov/5 dark:bg-gov/15 px-1.5 py-0.2 border border-gov/15",
							children: thread.applicationId
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-muted-foreground",
							children: [hasAttachments && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								title: "Contains attachments",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "h-3 w-3 text-slate-400 dark:text-slate-500" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: (e) => onToggleStar(thread.id, e),
								className: "p-0.5 rounded hover:bg-slate-200/50 dark:hover:bg-slate-700 transition-colors",
								title: thread.isStarred ? "Starred message" : "Star message",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("h-3.5 w-3.5 transition-colors", thread.isStarred ? "fill-amber-400 text-amber-500" : "text-slate-300 dark:text-slate-600 hover:text-amber-500") })
							})]
						})]
					})
				]
			})
		]
	});
}
function MessageList({ threads, selectedThreadId, onSelectThread, onToggleStar }) {
	const listRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			const activeEl = document.activeElement;
			if (activeEl instanceof HTMLInputElement || activeEl instanceof HTMLTextAreaElement || threads.length === 0) return;
			if (e.key === "ArrowDown") {
				e.preventDefault();
				const currentIndex = threads.findIndex((t) => t.id === selectedThreadId);
				const nextIndex = Math.min(threads.length - 1, currentIndex + 1);
				if (threads[nextIndex]) onSelectThread(threads[nextIndex]);
			} else if (e.key === "ArrowUp") {
				e.preventDefault();
				const currentIndex = threads.findIndex((t) => t.id === selectedThreadId);
				const prevIndex = Math.max(0, currentIndex - 1);
				if (threads[prevIndex]) onSelectThread(threads[prevIndex]);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		threads,
		selectedThreadId,
		onSelectThread
	]);
	if (threads.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 flex flex-col items-center justify-center p-8 text-center text-xs text-muted-foreground min-h-[300px]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchX, { className: "h-6 w-6" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-semibold text-slate-800 dark:text-slate-200",
				children: "No communications found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-xs text-[11px] leading-relaxed",
				children: "No messages match the current folder, active filters, or search terms."
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: listRef,
		className: "flex-1 overflow-y-auto divide-y divide-transparent scrollbar-thin",
		role: "listbox",
		"aria-label": "Message list",
		children: threads.map((thread) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageRow, {
			thread,
			isSelected: thread.id === selectedThreadId,
			onSelect: onSelectThread,
			onToggleStar
		}, thread.id))
	});
}
var Popover = Popover$1;
var PopoverTrigger = PopoverTrigger$1;
var PopoverContent = import_react.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent$1, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)", className),
	...props
}) }));
PopoverContent.displayName = PopoverContent$1.displayName;
function MailFilter({ filter, onChange, availableApplications = [] }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const workflowTags = [
		"Action Required",
		"Evidence",
		"Field Visit",
		"Schedule",
		"Operations"
	];
	const activeCount = (filter.unreadOnly ? 1 : 0) + (filter.hasAttachment ? 1 : 0) + (filter.tag ? 1 : 0) + (filter.applicationId ? 1 : 0);
	const resetFilters = () => {
		onChange({
			unreadOnly: false,
			hasAttachment: false,
			tag: null,
			applicationId: void 0
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				className: cn("h-8 px-2.5 text-xs font-medium gap-1.5 transition-colors", activeCount > 0 ? "border-gov/50 text-gov bg-gov/5 hover:bg-gov/10" : "text-slate-700 dark:text-slate-300 hover:text-slate-900"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-3.5 w-3.5" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Filter" }),
					activeCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex h-4 w-4 items-center justify-center rounded-full bg-gov text-[10px] font-bold text-white",
						children: activeCount
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
			align: "end",
			className: "w-72 p-4 text-xs space-y-4 rounded-xl border border-border/80 shadow-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b pb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-3.5 w-3.5 text-gov" }), "Filter Messages"]
					}), activeCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: resetFilters,
						className: "text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3 w-3" }), "Reset"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold",
						children: "Status & Attachments"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onChange({
								...filter,
								unreadOnly: !filter.unreadOnly
							}),
							className: cn("flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors", filter.unreadOnly ? "bg-slate-100 dark:bg-slate-800 font-medium text-slate-900 dark:text-slate-100" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MailCheck, { className: "h-3.5 w-3.5 text-slate-500" }), "Unread Messages Only"]
							}), filter.unreadOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-gov" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onChange({
								...filter,
								hasAttachment: !filter.hasAttachment
							}),
							className: cn("flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors", filter.hasAttachment ? "bg-slate-100 dark:bg-slate-800 font-medium text-slate-900 dark:text-slate-100" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "h-3.5 w-3.5 text-slate-500" }), "Has Attached Files"]
							}), filter.hasAttachment && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-gov" })]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold",
						children: "Workflow Category"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1.5 pt-0.5",
						children: workflowTags.map((tag) => {
							const isSelected = filter.tag === tag;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => onChange({
									...filter,
									tag: isSelected ? null : tag
								}),
								className: cn("text-[11px] px-2.5 py-1 rounded-md border transition-all duration-150 font-medium", isSelected ? "border-gov bg-gov/10 text-gov dark:bg-gov/20" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"),
								children: tag
							}, tag);
						})
					})]
				}),
				availableApplications.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold",
						children: "Filter by Application"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1",
						children: availableApplications.slice(0, 4).map((appId) => {
							const isSelected = filter.applicationId === appId;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => onChange({
									...filter,
									applicationId: isSelected ? void 0 : appId
								}),
								className: cn("text-[10px] font-mono px-2 py-0.5 rounded border transition-colors", isSelected ? "border-gov bg-gov text-white font-bold" : "border-border bg-slate-50 text-muted-foreground hover:border-slate-400"),
								children: appId
							}, appId);
						})
					})]
				})
			]
		})]
	});
}
function MailToolbar({ onComposeClick, searchQuery, onSearchChange, filter, onFilterChange, sortOrder, onSortChange, onRefresh, selectedThreadId, isSelectedStarred = false, onToggleStar, onArchive, availableApplications, searchRef }) {
	const [isRefreshing, setIsRefreshing] = (0, import_react.useState)(false);
	const handleRefreshClick = () => {
		setIsRefreshing(true);
		onRefresh();
		setTimeout(() => {
			setIsRefreshing(false);
			toast.success("Mail synchronised with state ledger");
		}, 450);
	};
	const getSortLabel = (order) => {
		switch (order) {
			case "newest": return "Newest First";
			case "oldest": return "Oldest First";
			case "unread_first": return "Unread First";
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 border-b border-slate-200/80 bg-white/95 dark:border-slate-800 dark:bg-slate-900/90 px-4 py-2.5 backdrop-blur-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: onComposeClick,
				className: "h-8 px-3 text-xs font-semibold gap-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 shadow-2xs transition-all active:scale-95",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Compose" })]
			}), selectedThreadId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden sm:flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-2 ml-1",
				children: [onToggleStar && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					onClick: onToggleStar,
					className: "h-8 w-8 text-slate-500 hover:text-amber-500 rounded-lg",
					title: isSelectedStarred ? "Unstar" : "Star message",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("h-3.5 w-3.5", isSelectedStarred && "fill-amber-400 text-amber-500") })
				}), onArchive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					onClick: onArchive,
					className: "h-8 w-8 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg",
					title: "Archive thread",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "h-3.5 w-3.5" })
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 flex-1 sm:flex-initial sm:max-w-md justify-end",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 sm:w-64",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							ref: searchRef,
							type: "search",
							value: searchQuery,
							onChange: (e) => onSearchChange(e.target.value),
							placeholder: "Search communications… (/)",
							className: "h-8 pl-8 pr-7 text-xs bg-slate-50/70 border-slate-200/80 rounded-lg focus-visible:bg-white dark:bg-slate-800/60 dark:border-slate-700/60 dark:focus-visible:bg-slate-800"
						}),
						searchQuery && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onSearchChange(""),
							className: "absolute right-2 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MailFilter, {
					filter,
					onChange: onFilterChange,
					availableApplications
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						className: "h-8 px-2 text-xs text-slate-600 dark:text-slate-300 gap-1 rounded-lg",
						title: "Sort messages",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden md:inline",
							children: getSortLabel(sortOrder)
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
					align: "end",
					className: "w-40 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, {
							className: "text-[10px] font-semibold text-muted-foreground uppercase font-mono",
							children: "Sort By"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
						[
							"newest",
							"oldest",
							"unread_first"
						].map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: () => onSortChange(order),
							className: "flex items-center justify-between text-xs cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: getSortLabel(order) }), sortOrder === order && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-gov font-bold",
								children: "✓"
							})]
						}, order))
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					onClick: handleRefreshClick,
					className: "h-8 w-8 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg",
					title: "Refresh messages",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: cn("h-3.5 w-3.5", isRefreshing && "animate-spin text-gov") })
				})
			]
		})]
	});
}
function MailSidebar({ activeFolder, onSelectFolder, activeWorkflow, onSelectWorkflow, folderCounts, workflowCounts }) {
	const mailFolders = [
		{
			id: "inbox",
			label: "Inbox",
			icon: Inbox,
			count: folderCounts.inbox
		},
		{
			id: "starred",
			label: "Starred",
			icon: Star,
			count: folderCounts.starred
		},
		{
			id: "sent",
			label: "Sent",
			icon: Send,
			count: folderCounts.sent
		},
		{
			id: "archived",
			label: "Archived",
			icon: Archive,
			count: folderCounts.archived
		}
	];
	const workflowItems = [
		{
			id: "Action Required",
			label: "Action Required",
			icon: CircleAlert
		},
		{
			id: "Evidence",
			label: "Evidence",
			icon: FileCheckCorner
		},
		{
			id: "Field Visit",
			label: "Field Visit",
			icon: Navigation
		},
		{
			id: "Schedule",
			label: "Schedule",
			icon: Calendar
		},
		{
			id: "Operations",
			label: "Operations",
			icon: Activity
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		className: "flex flex-col gap-5 p-3 text-xs w-full",
		"aria-label": "Mail folders and workflows",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block px-2 text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500",
				children: "Mail"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-0.5 pt-0.5",
				children: mailFolders.map((f) => {
					const isActive = activeFolder === f.id && activeWorkflow === null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							onSelectFolder(f.id);
							onSelectWorkflow(null);
						},
						className: cn("w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg font-medium transition-colors text-left", isActive ? "bg-slate-200/60 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold shadow-2xs" : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5 truncate",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: cn("h-3.5 w-3.5 shrink-0", isActive ? "text-gov" : "text-slate-400 dark:text-slate-500") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: f.label
							})]
						}), f.count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("rounded-full px-1.5 py-0.2 text-[10px] font-mono tabular-nums", isActive ? "bg-gov/15 text-gov font-bold" : "bg-slate-200/60 text-slate-600 dark:bg-slate-800 dark:text-slate-400"),
							children: f.count
						})]
					}, f.id);
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-1 border-t border-slate-200/60 dark:border-slate-800/60 pt-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block px-2 text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500",
				children: "Workflow"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-0.5 pt-0.5",
				children: workflowItems.map((wf) => {
					const isActive = activeWorkflow === wf.id;
					const count = workflowCounts[wf.id] || 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							onSelectWorkflow(isActive ? null : wf.id);
						},
						className: cn("w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg font-medium transition-colors text-left", isActive ? "bg-slate-200/60 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold shadow-2xs" : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5 truncate",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(wf.icon, { className: cn("h-3.5 w-3.5 shrink-0", isActive ? "text-gov" : "text-slate-400 dark:text-slate-500") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: wf.label
							})]
						}), count > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("rounded-full px-1.5 py-0.2 text-[10px] font-mono tabular-nums", isActive ? "bg-gov/15 text-gov font-bold" : "bg-slate-200/60 text-slate-600 dark:bg-slate-800 dark:text-slate-400"),
							children: count
						})]
					}, wf.id);
				})
			})]
		})]
	});
}
function MessageReader({ thread, onBackToMobileList, onToggleStar, onArchive, onMarkUnread, onSendReply, onAttachmentPreview, replyRef }) {
	const [isSending, setIsSending] = (0, import_react.useState)(false);
	if (!thread) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 flex flex-col items-center justify-center p-8 text-center text-xs text-muted-foreground min-h-[400px]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-7 w-7" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-semibold text-sm text-slate-800 dark:text-slate-200",
				children: "Select a communication thread"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground",
				children: "Choose an official message or query from the list to review determinations and compose replies."
			})
		]
	});
	const handleCopyAppId = () => {
		if (thread.applicationId) {
			navigator.clipboard.writeText(thread.applicationId);
			toast.success("Application ID copied to clipboard");
		}
	};
	const handleReplyDispatch = async (text, files) => {
		setIsSending(true);
		try {
			await onSendReply(text, files);
		} finally {
			setIsSending(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-slate-900",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-slate-200/80 dark:border-slate-800 px-6 py-4 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5 min-w-0 flex-1",
					children: [
						onBackToMobileList && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: onBackToMobileList,
							className: "md:hidden flex items-center gap-1 text-xs text-gov font-medium mb-1 hover:underline",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), "Back to Messages"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug",
							children: thread.subject
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600 dark:text-slate-400",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-slate-900 dark:text-slate-100",
									children: thread.sender.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-300 dark:text-slate-600",
									children: "·"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "capitalize",
									children: thread.sender.role
								}),
								thread.sender.department && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-300 dark:text-slate-600",
									children: "·"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: thread.sender.department })] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5 pt-0.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
									className: "text-[11px] text-muted-foreground font-mono tabular-nums",
									children: formatFullMailDate(thread.timestamp)
								}),
								thread.applicationId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: handleCopyAppId,
									className: "inline-flex items-center gap-1 font-mono text-[10px] text-gov font-semibold px-2 py-0.5 rounded-full bg-gov/10 border border-gov/20 hover:bg-gov/20 transition-colors",
									title: "Click to copy Application ID",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: thread.applicationId }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-2.5 w-2.5 opacity-60" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Recorded in audit history" })]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 shrink-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							onClick: () => onToggleStar(thread.id),
							className: "h-8 w-8 text-slate-500 hover:text-amber-500 rounded-lg",
							title: thread.isStarred ? "Starred" : "Star",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: cn("h-4 w-4", thread.isStarred && "fill-amber-400 text-amber-500") })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							onClick: () => onArchive(thread.id),
							className: "h-8 w-8 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg",
							title: "Archive thread",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								className: "h-8 w-8 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "h-4 w-4" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
							align: "end",
							className: "w-48 text-xs",
							children: [
								onMarkUnread && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									onClick: () => {
										onMarkUnread(thread.id);
										toast.success("Thread marked as unread");
									},
									children: "Mark as Unread"
								}),
								thread.applicationId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									onClick: handleCopyAppId,
									children: "Copy Application Reference"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
									onClick: () => {
										toast.info(`Audit Log: Immutable event ${thread.id} timestamped.`);
									},
									children: "View Cryptographic Proof"
								})
							]
						})] })
					]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 overflow-y-auto px-6 py-5 space-y-6 scrollbar-thin",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConversationThread, {
				messages: thread.messages,
				onAttachmentPreview
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: replyRef,
				className: "pt-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReplyComposer, {
					recipientName: thread.sender.name,
					recipientEmail: thread.sender.email,
					recipientRole: thread.sender.role,
					applicationId: thread.applicationId,
					onSend: handleReplyDispatch,
					isSending
				})
			})]
		})]
	});
}
function ComposeSheet({ open, onOpenChange, onSend, defaultApplicationId = "" }) {
	const [toEmail, setToEmail] = (0, import_react.useState)("");
	const [subject, setSubject] = (0, import_react.useState)("");
	const [applicationId, setApplicationId] = (0, import_react.useState)(defaultApplicationId);
	const [body, setBody] = (0, import_react.useState)("");
	const [isSending, setIsSending] = (0, import_react.useState)(false);
	const [attachments, setAttachments] = (0, import_react.useState)([]);
	const fileInputRef = (0, import_react.useRef)(null);
	const suggestions = [
		{
			label: "Citizen Desk",
			email: "citizen@mira.local"
		},
		{
			label: "Verification Cell",
			email: "verifier@mira.local"
		},
		{
			label: "Field Inspection Unit",
			email: "officer@mira.local"
		},
		{
			label: "State Administration",
			email: "admin@mira.local"
		},
		{
			label: "Audit Oversight",
			email: "auditor@mira.local"
		}
	];
	const handleAttachClick = () => {
		fileInputRef.current?.click();
	};
	const handleFileChange = (e) => {
		if (e.target.files) {
			const files = Array.from(e.target.files);
			setAttachments((prev) => [...prev, ...files]);
			toast.success(`${files.length} document(s) attached to dispatch`);
		}
	};
	const removeAttachment = (index) => {
		setAttachments((prev) => prev.filter((_, i) => i !== index));
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!toEmail.trim() || !subject.trim() || !body.trim() || isSending) {
			toast.error("Please fill in recipient, subject, and message content.");
			return;
		}
		setIsSending(true);
		try {
			await onSend({
				toEmail: toEmail.trim(),
				subject: subject.trim(),
				body: body.trim(),
				applicationId: applicationId.trim() || void 0
			});
			toast.success("Official dispatch recorded", { description: `Dispatched to ${toEmail.trim()} with verifiable audit receipt` });
			setToEmail("");
			setSubject("");
			setApplicationId("");
			setBody("");
			setAttachments([]);
			onOpenChange(false);
		} catch (err) {
			toast.error("Could not send dispatch");
		} finally {
			setIsSending(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-xl p-0 overflow-hidden rounded-2xl border border-slate-200/80 shadow-2xl dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
				className: "border-b border-border/80 px-5 py-3.5 flex flex-row items-center justify-between space-y-0 bg-slate-50/50 dark:bg-slate-900/50",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-7 w-7 items-center justify-center rounded-lg bg-gov/10 text-gov",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "text-sm font-semibold",
						children: "New Official Communication"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2 pr-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" }), "Verifiable Record"]
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "flex flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 space-y-3.5 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-semibold text-slate-800 dark:text-slate-200",
									children: "Recipient"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex gap-1.5 overflow-x-auto py-0.5",
									children: suggestions.slice(0, 3).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setToEmail(s.email),
										className: "text-[10px] text-gov hover:underline shrink-0",
										children: ["+", s.label]
									}, s.email))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								required: true,
								value: toEmail,
								onChange: (e) => setToEmail(e.target.value),
								placeholder: "citizen@mira.local or verifier@mira.local",
								className: "h-9 text-xs rounded-lg"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-semibold text-slate-800 dark:text-slate-200",
								children: "Subject"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								value: subject,
								onChange: (e) => setSubject(e.target.value),
								placeholder: "e.g. Additional Evidence: Ration Card Verification",
								className: "h-9 text-xs rounded-lg"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-semibold text-slate-800 dark:text-slate-200",
									children: "Application Context (Optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground",
									children: "e.g. APP-2026-000318"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: applicationId,
								onChange: (e) => setApplicationId(e.target.value),
								placeholder: "APP-2026-XXXXXX",
								className: "h-9 text-xs font-mono rounded-lg"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-semibold text-slate-800 dark:text-slate-200",
								children: "Official Message"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								required: true,
								rows: 5,
								value: body,
								onChange: (e) => setBody(e.target.value),
								placeholder: "Type official determination, citizen query clarification, or supervisor notice…",
								className: "text-xs leading-relaxed rounded-lg min-h-[110px]"
							})]
						}),
						attachments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] font-semibold text-muted-foreground uppercase font-mono",
								children: [
									"Attached Documents (",
									attachments.length,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: attachments.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "h-3 w-3 text-gov" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "max-w-[160px] truncate",
											children: f.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => removeAttachment(i),
											className: "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
										})
									]
								}, i))
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-t border-border/80 px-5 py-3 bg-slate-50/50 dark:bg-slate-900/50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							ref: fileInputRef,
							onChange: handleFileChange,
							multiple: true,
							className: "hidden"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "ghost",
							size: "sm",
							onClick: handleAttachClick,
							className: "h-8 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "mr-1.5 h-3.5 w-3.5" }), "Attach File"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							size: "sm",
							onClick: () => onOpenChange(false),
							className: "h-8 text-xs",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "sm",
							disabled: isSending || !toEmail.trim() || !subject.trim() || !body.trim(),
							className: "h-8 text-xs bg-gov text-white hover:bg-gov/90 gap-1.5 font-medium shadow-2xs",
							children: isSending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }), "Recording…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }), "Dispatch Message"] })
						})]
					})]
				})]
			})]
		})
	});
}
function MailShell({ title = "Communications", subtitle = "Official messages, citizen clarifications, assignments and departmental correspondence.", defaultApplicationId }) {
	const { state, sendMessage, markMessageRead, toggleStarMessage, archiveMessage } = useApp();
	const [activeFolder, setActiveFolder] = (0, import_react.useState)("inbox");
	const [activeWorkflow, setActiveWorkflow] = (0, import_react.useState)(null);
	const [selectedThreadId, setSelectedThreadId] = (0, import_react.useState)(() => state.messages[0]?.id || null);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [sortOrder, setSortOrder] = (0, import_react.useState)("newest");
	const [filter, setFilter] = (0, import_react.useState)({
		unreadOnly: false,
		hasAttachment: false,
		tag: null,
		applicationId: void 0
	});
	const [isComposeOpen, setIsComposeOpen] = (0, import_react.useState)(false);
	const [mobileView, setMobileView] = (0, import_react.useState)("list");
	const searchInputRef = (0, import_react.useRef)(null);
	const replyRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			const activeEl = document.activeElement;
			if (activeEl instanceof HTMLInputElement || activeEl instanceof HTMLTextAreaElement) return;
			if (e.key === "c" || e.key === "C") {
				e.preventDefault();
				setIsComposeOpen(true);
			} else if (e.key === "r" || e.key === "R") {
				e.preventDefault();
				replyRef.current?.scrollIntoView({ behavior: "smooth" });
				(replyRef.current?.querySelector("textarea"))?.focus();
			} else if (e.key === "e" || e.key === "E") {
				if (selectedThreadId) {
					e.preventDefault();
					archiveMessage(selectedThreadId);
					toast.success("Thread archived (Press ⌘Z to undo)");
				}
			} else if (e.key === "/") {
				e.preventDefault();
				searchInputRef.current?.focus();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [selectedThreadId, archiveMessage]);
	const availableApplications = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		state.messages.forEach((m) => {
			if (m.applicationId) set.add(m.applicationId);
		});
		return Array.from(set);
	}, [state.messages]);
	const folderCounts = (0, import_react.useMemo)(() => {
		return {
			inbox: state.messages.filter((m) => (!m.folder || m.folder === "inbox") && !m.isArchived && m.status === "unread").length,
			starred: state.messages.filter((m) => !!m.isStarred).length,
			sent: state.messages.filter((m) => m.folder === "sent").length,
			archived: state.messages.filter((m) => !!m.isArchived).length
		};
	}, [state.messages]);
	const workflowCounts = (0, import_react.useMemo)(() => {
		const counts = {};
		[
			"Action Required",
			"Evidence",
			"Field Visit",
			"Schedule",
			"Operations"
		].forEach((tag) => {
			counts[tag] = state.messages.filter((m) => !m.isArchived && m.tags?.includes(tag)).length;
		});
		return counts;
	}, [state.messages]);
	const filteredThreads = (0, import_react.useMemo)(() => {
		return state.messages.filter((thread) => {
			if (activeFolder === "starred" && !thread.isStarred) return false;
			if (activeFolder === "archived" && !thread.isArchived) return false;
			if (activeFolder === "sent" && thread.folder !== "sent") return false;
			if (activeFolder === "inbox" && (thread.isArchived || thread.folder === "sent")) return false;
			if (activeWorkflow && !thread.tags?.includes(activeWorkflow)) return false;
			if (filter.unreadOnly && thread.status !== "unread") return false;
			if (filter.hasAttachment && !thread.messages.some((m) => m.attachments && m.attachments.length > 0)) return false;
			if (filter.tag && !thread.tags?.includes(filter.tag)) return false;
			if (filter.applicationId && thread.applicationId !== filter.applicationId) return false;
			if (searchQuery.trim()) {
				const q = searchQuery.toLowerCase();
				const matchesSubject = thread.subject.toLowerCase().includes(q);
				const matchesSender = thread.sender.name.toLowerCase().includes(q);
				const matchesSenderEmail = thread.sender.email.toLowerCase().includes(q);
				const matchesAppId = thread.applicationId?.toLowerCase().includes(q) ?? false;
				const matchesTags = thread.tags?.some((t) => t.toLowerCase().includes(q)) ?? false;
				const matchesBody = thread.messages.some((m) => m.body.toLowerCase().includes(q));
				if (!matchesSubject && !matchesSender && !matchesSenderEmail && !matchesAppId && !matchesTags && !matchesBody) return false;
			}
			return true;
		}).sort((a, b) => {
			if (sortOrder === "unread_first") {
				if (a.status === "unread" && b.status !== "unread") return -1;
				if (b.status === "unread" && a.status !== "unread") return 1;
			}
			const timeA = new Date(a.timestamp.includes(" ") ? a.timestamp.replace(" ", "T") : a.timestamp).getTime();
			const timeB = new Date(b.timestamp.includes(" ") ? b.timestamp.replace(" ", "T") : b.timestamp).getTime();
			if (sortOrder === "oldest") return timeA - timeB;
			return timeB - timeA;
		});
	}, [
		state.messages,
		activeFolder,
		activeWorkflow,
		filter,
		searchQuery,
		sortOrder
	]);
	const activeThread = (0, import_react.useMemo)(() => {
		return state.messages.find((t) => t.id === selectedThreadId) || filteredThreads[0] || null;
	}, [
		state.messages,
		selectedThreadId,
		filteredThreads
	]);
	const handleSelectThread = (thread) => {
		setSelectedThreadId(thread.id);
		setMobileView("reader");
		if (thread.status === "unread") markMessageRead(thread.id);
	};
	const handleToggleStar = (threadId, e) => {
		if (e) e.stopPropagation();
		toggleStarMessage(threadId);
	};
	const handleArchive = (threadId) => {
		archiveMessage(threadId);
		toast.success("Message archived");
		const remaining = filteredThreads.filter((t) => t.id !== threadId);
		if (remaining.length > 0) setSelectedThreadId(remaining[0].id);
		else setSelectedThreadId(null);
	};
	const handleSendReply = (body, files) => {
		if (!activeThread) return;
		sendMessage({
			threadId: activeThread.id,
			toEmail: activeThread.sender.email,
			toName: activeThread.sender.name,
			toRole: activeThread.sender.role,
			subject: `Re: ${activeThread.subject}`,
			body,
			applicationId: activeThread.applicationId
		});
		toast.success("Reply recorded in official thread", { description: `Dispatched to ${activeThread.sender.name} with audit confirmation` });
	};
	const handleComposeSend = async ({ toEmail, subject: compSubject, body: compBody, applicationId: compAppId }) => {
		sendMessage({
			toEmail,
			subject: compSubject,
			body: compBody,
			applicationId: compAppId
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-0.5 px-0.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground leading-normal max-w-3xl",
					children: subtitle
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden flex flex-col min-h-[640px] max-h-[820px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MailToolbar, {
					onComposeClick: () => setIsComposeOpen(true),
					searchQuery,
					onSearchChange: setSearchQuery,
					filter,
					onFilterChange: setFilter,
					sortOrder,
					onSortChange: setSortOrder,
					onRefresh: () => {},
					selectedThreadId: activeThread?.id,
					isSelectedStarred: activeThread?.isStarred,
					onToggleStar: () => activeThread && handleToggleStar(activeThread.id),
					onArchive: () => activeThread && handleArchive(activeThread.id),
					availableApplications,
					searchRef: searchInputRef
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200/70 dark:divide-slate-800/80 overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("md:col-span-3 lg:col-span-2 bg-slate-50/60 dark:bg-slate-900/40 overflow-y-auto", mobileView !== "folders" && "hidden md:block"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MailSidebar, {
								activeFolder,
								onSelectFolder: (folder) => {
									setActiveFolder(folder);
									setMobileView("list");
								},
								activeWorkflow,
								onSelectWorkflow: (wf) => {
									setActiveWorkflow(wf);
									setMobileView("list");
								},
								folderCounts,
								workflowCounts
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: cn("md:col-span-4 lg:col-span-4 flex flex-col bg-white dark:bg-slate-900 overflow-hidden", mobileView === "reader" && "hidden md:flex", mobileView === "folders" && "hidden md:flex"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between px-3.5 py-2 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-900/30 text-[11px] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-slate-700 dark:text-slate-300 capitalize",
									children: activeWorkflow || activeFolder
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono tabular-nums",
									children: [
										filteredThreads.length,
										" message",
										filteredThreads.length === 1 ? "" : "s"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageList, {
								threads: filteredThreads,
								selectedThreadId: activeThread?.id || null,
								onSelectThread: handleSelectThread,
								onToggleStar: handleToggleStar
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("md:col-span-5 lg:col-span-6 flex flex-col bg-white dark:bg-slate-900 overflow-hidden", mobileView !== "reader" && "hidden md:flex"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageReader, {
								thread: activeThread,
								onBackToMobileList: () => setMobileView("list"),
								onToggleStar: handleToggleStar,
								onArchive: handleArchive,
								onMarkUnread: () => {},
								onSendReply: handleSendReply,
								replyRef
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComposeSheet, {
				open: isComposeOpen,
				onOpenChange: setIsComposeOpen,
				onSend: handleComposeSend,
				defaultApplicationId
			})
		]
	});
}
//#endregion
export { MailShell as t };
