import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { I as useApp } from "./app-state-C6MbzGTh.mjs";
import { r as cn, t as Button } from "./button-BT328xhy.mjs";
import { $ as MessageSquare, M as Send, jn as AtSign, tn as CornerDownRight } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Textarea } from "./textarea-D15QmElO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CommentsThread-BK2bVj4K.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CommentsThread({ recordType, recordId, title = "Collaboration & Official Notes" }) {
	const { state, addComment } = useApp();
	const [commentText, setCommentText] = (0, import_react.useState)("");
	const [replyTextMap, setReplyTextMap] = (0, import_react.useState)({});
	const [activeReplyId, setActiveReplyId] = (0, import_react.useState)(null);
	const comments = state.comments.filter((c) => c.recordType === recordType && c.recordId === recordId);
	const handlePostComment = (e) => {
		e.preventDefault();
		if (!commentText.trim()) return;
		const mentions = Array.from(commentText.matchAll(/@(\w+)/g)).map((m) => m[1]);
		addComment({
			recordType,
			recordId,
			text: commentText.trim(),
			mentions
		});
		toast.success("Note added to official thread");
		setCommentText("");
	};
	const handlePostReply = (parentId) => {
		const text = replyTextMap[parentId]?.trim();
		if (!text) return;
		const mentions = Array.from(text.matchAll(/@(\w+)/g)).map((m) => m[1]);
		addComment({
			recordType,
			recordId,
			text,
			mentions,
			replyToId: parentId
		});
		toast.success("Reply recorded");
		setReplyTextMap({
			...replyTextMap,
			[parentId]: ""
		});
		setActiveReplyId(null);
	};
	const roleColor = (roleStr) => {
		switch (roleStr) {
			case "verifier": return "bg-teal/15 text-teal border-teal/20";
			case "officer": return "bg-gov/15 text-gov border-gov/20";
			case "admin": return "bg-purple-100 text-purple-800 border-purple-200";
			case "auditor": return "bg-slate-200 text-slate-800 border-slate-300";
			default: return "bg-blue-50 text-blue-800 border-blue-200";
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border bg-white p-5 shadow-xs space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b pb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-4 w-4 text-gov" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-bold text-navy",
							children: title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700",
							children: comments.length
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[11px] text-muted-foreground",
					children: [
						"Use ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "text-gov font-mono",
							children: "@name"
						}),
						" to mention officers"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: comments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground text-center py-4",
					children: "No notes logged yet. Use this section for team collaboration, verification queries, or field clarifications."
				}) : comments.map((comment) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-slate-100 bg-slate-50/50 p-3.5 space-y-2.5 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-navy",
										children: comment.author.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("rounded text-[9px] px-1.5 py-0.2 border uppercase font-mono font-medium", roleColor(comment.author.role)),
										children: comment.author.role
									}),
									comment.author.department && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] text-slate-400",
										children: ["· ", comment.author.department]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-muted-foreground font-mono",
								children: comment.timestamp
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-slate-800 leading-relaxed whitespace-pre-wrap",
							children: comment.text
						}),
						comment.mentions && comment.mentions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-slate-400",
								children: "Mentioned:"
							}), comment.mentions.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded bg-blue-50 text-blue-700 font-mono text-[10px] px-1.5 py-0.2",
								children: ["@", m]
							}, m))]
						}),
						comment.replies && comment.replies.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 pl-4 border-l-2 border-slate-200 space-y-2.5 pt-1",
							children: comment.replies.map((rep) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded bg-white border border-slate-100 p-2.5 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-[11px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-navy",
											children: rep.author.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("rounded text-[8px] px-1 py-0.1 border uppercase font-mono", roleColor(rep.author.role)),
											children: rep.author.role
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[9px] text-muted-foreground font-mono",
										children: rep.timestamp
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-slate-700 text-xs",
									children: rep.text
								})]
							}, rep.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-1 flex items-center justify-between",
							children: activeReplyId !== comment.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "ghost",
								size: "sm",
								className: "h-6 text-[10px] gap-1 text-gov px-2",
								onClick: () => setActiveReplyId(comment.id),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CornerDownRight, { className: "h-3 w-3" }), "Reply"]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "w-full mt-2 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									placeholder: "Type reply or field update…",
									value: replyTextMap[comment.id] || "",
									onChange: (e) => setReplyTextMap({
										...replyTextMap,
										[comment.id]: e.target.value
									}),
									rows: 2,
									className: "text-xs bg-white"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-end gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "ghost",
										size: "sm",
										className: "h-6 text-xs",
										onClick: () => setActiveReplyId(null),
										children: "Cancel"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										size: "sm",
										className: "h-6 text-xs bg-gov hover:bg-gov/90 text-white",
										onClick: () => handlePostReply(comment.id),
										children: "Send Reply"
									})]
								})]
							})
						})
					]
				}, comment.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handlePostComment,
				className: "pt-2 border-t space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					placeholder: "Add an official note, document query or instruction (e.g. '@Ravi please verify address on-site')…",
					value: commentText,
					onChange: (e) => setCommentText(e.target.value),
					rows: 3,
					className: "text-xs"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 text-[11px] text-slate-500",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtSign, { className: "h-3.5 w-3.5 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tag: @Ananya, @Ravi, @Neha, @Department" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						size: "sm",
						className: "bg-gov hover:bg-gov/90 text-white text-xs h-8 gap-1.5",
						disabled: !commentText.trim(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }), "Post Note"]
					})]
				})]
			})
		]
	});
}
//#endregion
export { CommentsThread as t };
