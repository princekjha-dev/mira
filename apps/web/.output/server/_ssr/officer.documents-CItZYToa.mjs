import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { k as useApp, m as apiRequest, r as Button } from "./button-B0ZnFkgi.mjs";
import { O as RefreshCw, _t as Eye, dt as FileText } from "../_libs/lucide-react.mjs";
import { s as PageHeader } from "./ui-BPP2eTpy.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-CeCLWmiI.mjs";
import { i as formatBytes, r as DocumentViewer } from "./DocumentViewer-INJrCOZj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/officer.documents-CItZYToa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Docs() {
	const { state } = useApp();
	const [documents, setDocuments] = (0, import_react.useState)([]);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const session = state.session;
	const refresh = (0, import_react.useCallback)(async () => {
		if (!session?.apiToken) return;
		setLoading(true);
		setError("");
		try {
			const result = await apiRequest(session, "/api/v1/documents");
			setDocuments(result.data.filter((doc) => doc.status !== "REVOKED"));
		} catch (reason) {
			setError(reason instanceof Error ? reason.message : "Unable to load documents.");
		} finally {
			setLoading(false);
		}
	}, [session?.apiToken, session?.apiUserId]);
	(0, import_react.useEffect)(() => {
		refresh();
	}, [refresh]);
	const verify = async (doc) => {
		if (!session) return;
		try {
			const pending = (await apiRequest(session, `/api/v1/documents/${doc.id}/extractions`)).data.filter((field) => !["OFFICER_VERIFIED", "SOURCE_VERIFIED"].includes(field.status));
			if (!pending.length) {
				toast.info("This document has no unverified extracted fields.");
				return;
			}
			for (const field of pending) await apiRequest(session, `/api/v1/documents/${doc.id}/verify-extraction`, {
				method: "POST",
				body: JSON.stringify({
					extraction_id: field.id,
					decision: "VERIFIED",
					verification_method: "MANUAL_INSPECTION",
					reason: "Officer reviewed the extracted document fields."
				})
			});
			toast.success("Extracted document fields verified.");
			await refresh();
		} catch (reason) {
			toast.error(reason instanceof Error ? reason.message : "Verification failed.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Documents",
			desc: "Review citizen documents available to your authorized role and application scope.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: () => void refresh(),
				disabled: loading,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-2 h-4 w-4" }), "Refresh"]
			})
		}),
		error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			role: "alert",
			className: "mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800",
			children: error
		}),
		!session?.apiToken ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border bg-white p-8 text-center text-sm text-slate-600",
			children: "Secure sign in is required to review private documents."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-xl border bg-white",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Document" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Owner" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Uploaded" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Verification" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "File status" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {})
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [documents.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-slate-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-56 truncate text-sm font-medium",
						children: doc.original_filename
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-slate-500",
						children: [
							doc.document_type.replaceAll("_", " "),
							" · ",
							formatBytes(doc.size_bytes)
						]
					})] })]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "font-mono text-xs",
					children: doc.owner_id
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: new Date(doc.created_at).toLocaleDateString("en-IN") }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-800",
					children: doc.verification_status.replaceAll("_", " ")
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: doc.status }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => setSelected(doc),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "mr-1 h-3.5 w-3.5" }), "View"]
					}), doc.verification_status !== "VERIFIED" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => void verify(doc),
						children: "Review fields"
					})]
				}) })
			] }, doc.id)), !documents.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				colSpan: 6,
				className: "h-28 text-center text-sm text-slate-500",
				children: loading ? "Loading documents…" : "No documents are available in your current scope."
			}) })] })] })
		}),
		session && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentViewer, {
			document: selected,
			session,
			onClose: () => setSelected(null),
			onChanged: () => void refresh()
		})
	] });
}
//#endregion
export { Docs as component };
