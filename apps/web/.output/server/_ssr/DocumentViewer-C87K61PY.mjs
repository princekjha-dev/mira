import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { F as uploadDocument, h as apiUrl, m as apiRequest } from "./app-state-C6MbzGTh.mjs";
import { t as Button } from "./button-BT328xhy.mjs";
import { B as RotateCcw, H as Plus, It as FileUp, Lt as FileText, Qt as Download, Ut as FileImage, Xt as Expand, Z as Minus, _ as TriangleAlert, i as X, k as ShieldCheck, pn as CircleCheck, un as CircleX, ut as LoaderCircle, vn as Check } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-DO3wpSNE.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-CC_Gil3n.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DocumentViewer-C87K61PY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DOCUMENT_UPLOAD_CONFIG = {
	MAX_UPLOAD_SIZE: 26214400,
	IMAGE_COMPRESSION_THRESHOLD: 3145728,
	IMAGE_MAX_DIMENSION: 3600,
	IMAGE_QUALITY: .9,
	PDF_COMPRESSION_THRESHOLD: 8388608,
	MAX_FILES_PER_UPLOAD: 8,
	ALLOWED_MIME_TYPES: [
		"application/pdf",
		"image/jpeg",
		"image/png",
		"image/webp",
		"text/plain",
		"text/csv",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
	],
	ALLOWED_EXTENSIONS: [
		"pdf",
		"png",
		"jpg",
		"jpeg",
		"webp",
		"txt",
		"csv",
		"docx",
		"xlsx"
	]
};
var DOCUMENT_CATEGORIES = [
	"Identity",
	"Address",
	"Income",
	"BPL / Economic Status",
	"Education",
	"Birth",
	"Marriage",
	"Property",
	"Land",
	"Bank",
	"Employment",
	"Scheme-specific",
	"Other"
];
var DOCUMENT_TYPE_VALUES = {
	Identity: "IDENTITY_SUPPORTING_DOCUMENT",
	Address: "RESIDENCE_CERTIFICATE",
	Income: "INCOME_CERTIFICATE",
	"BPL / Economic Status": "OTHER",
	Education: "OTHER",
	Birth: "BIRTH_CERTIFICATE",
	Marriage: "OTHER",
	Property: "PROPERTY_DOCUMENT",
	Land: "PROPERTY_DOCUMENT",
	Bank: "OTHER",
	Employment: "OTHER",
	"Scheme-specific": "BENEFIT_DOCUMENT",
	Other: "OTHER"
};
function formatBytes(bytes) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`;
	return `${(bytes / 1048576).toFixed(1)} MB`;
}
var extension = (name) => name.split(".").pop()?.toLowerCase() || "";
async function validateFile(file) {
	const ext = extension(file.name);
	if (!DOCUMENT_UPLOAD_CONFIG.ALLOWED_EXTENSIONS.includes(ext)) {
		if (ext === "svg") throw new Error("SVG files aren't supported for citizen documents. Please upload a PDF or image document.");
		throw new Error("This file type isn't supported for document storage.");
	}
	if (file.size <= 0) throw new Error("This file is empty. Choose another document.");
	if (file.size > DOCUMENT_UPLOAD_CONFIG.MAX_UPLOAD_SIZE && !file.type.startsWith("image/")) throw new Error(`This document is larger than ${formatBytes(DOCUMENT_UPLOAD_CONFIG.MAX_UPLOAD_SIZE)}. Choose a smaller PDF to preserve its text and page structure.`);
	const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
	const starts = (...signature) => signature.every((value, index) => bytes[index] === value);
	let valid = false;
	try {
		valid = ext === "pdf" ? starts(37, 80, 68, 70, 45) : ext === "png" ? starts(137, 80, 78, 71, 13, 10, 26, 10) : ext === "jpg" || ext === "jpeg" ? starts(255, 216, 255) : ext === "webp" ? starts(82, 73, 70, 70) && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP" : ext === "docx" || ext === "xlsx" ? starts(80, 75, 3, 4) : ext === "txt" || ext === "csv" ? new TextDecoder("utf-8", { fatal: true }).decode(bytes).length > 0 : false;
	} catch {
		valid = false;
	}
	if (!valid) throw new Error("This file could not be read as a supported document. Choose another file.");
	if (file.type && !DOCUMENT_UPLOAD_CONFIG.ALLOWED_MIME_TYPES.includes(file.type)) throw new Error("This file type isn't supported for document storage.");
}
async function optimizeImage(source) {
	if (source.size <= DOCUMENT_UPLOAD_CONFIG.IMAGE_COMPRESSION_THRESHOLD) return {
		file: source,
		saved: 0
	};
	const image = await createImageBitmap(source).catch(() => {
		throw new Error("Automatic image optimization couldn't read this image. Retry or choose another file.");
	});
	const scale = Math.min(1, DOCUMENT_UPLOAD_CONFIG.IMAGE_MAX_DIMENSION / Math.max(image.width, image.height));
	const canvas = document.createElement("canvas");
	canvas.width = Math.max(1, Math.round(image.width * scale));
	canvas.height = Math.max(1, Math.round(image.height * scale));
	const context = canvas.getContext("2d");
	if (!context) {
		image.close();
		throw new Error("Image optimization is unavailable in this browser.");
	}
	context.fillStyle = "#fff";
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.drawImage(image, 0, 0, canvas.width, canvas.height);
	image.close();
	const outputType = source.type === "image/jpg" ? "image/jpeg" : source.type;
	const blob = await new Promise((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(/* @__PURE__ */ new Error("Image optimization failed. The original file is still available to retry.")), outputType, DOCUMENT_UPLOAD_CONFIG.IMAGE_QUALITY));
	if (blob.size >= source.size * .92) return {
		file: source,
		saved: 0
	};
	return {
		file: new File([blob], source.name, {
			type: outputType,
			lastModified: source.lastModified
		}),
		saved: source.size - blob.size
	};
}
function humanUploadError(message) {
	if (/401|unauthori[sz]ed|token|sign in/i.test(message)) return "Your secure session expired. Sign in again, then retry.";
	if (/403|forbidden/i.test(message)) return "You don't have permission to store this document here.";
	if (/413|exceeds maximum|larger than/i.test(message)) return "This file is larger than the storage limit. Choose a smaller document.";
	if (/415|unsupported.*(media|format|type)/i.test(message)) return "This file type isn't supported for document storage.";
	if (/400|422|validation/i.test(message)) return "Unable to upload this file. Check that it's a valid supported document and try again.";
	if (/network|fetch|connection|interrupted/i.test(message)) return "Upload interrupted. Check your connection and retry.";
	if (/storage|internal server|500|503/i.test(message)) return "Secure storage is temporarily unavailable. Retry in a moment.";
	if (/corrupt|could not be read|signature|empty/i.test(message)) return "This document couldn't be read. Choose a valid PDF or image file.";
	return message;
}
function DocumentUploader({ session, documentType, onUploaded, replaceId, onComplete, onCancel, beforeUpload }) {
	const picker = (0, import_react.useRef)(null);
	const replaceSelection = (0, import_react.useRef)(null);
	const [items, setItems] = (0, import_react.useState)([]);
	const [dragging, setDragging] = (0, import_react.useState)(false);
	const [validating, setValidating] = (0, import_react.useState)(false);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [success, setSuccess] = (0, import_react.useState)(false);
	const busy = validating || uploading;
	const patch = (id, values) => setItems((rows) => rows.map((item) => item.id === id ? {
		...item,
		...values
	} : item));
	const prepare = async (item) => {
		patch(item.id, {
			state: "Validating",
			error: void 0,
			errorTitle: void 0
		});
		try {
			await validateFile(item.source);
			let file = item.source;
			let saved = 0;
			if (file.type.startsWith("image/") && file.size > DOCUMENT_UPLOAD_CONFIG.IMAGE_COMPRESSION_THRESHOLD) {
				patch(item.id, { state: "Compressing" });
				try {
					const optimized = await optimizeImage(file);
					file = optimized.file;
					saved = optimized.saved;
				} catch (error) {
					if (file.size > DOCUMENT_UPLOAD_CONFIG.MAX_UPLOAD_SIZE) throw error;
				}
			}
			if (file.size > DOCUMENT_UPLOAD_CONFIG.MAX_UPLOAD_SIZE) throw new Error(`Optimized file is still larger than ${formatBytes(DOCUMENT_UPLOAD_CONFIG.MAX_UPLOAD_SIZE)}. Choose a smaller image.`);
			patch(item.id, {
				file,
				saved,
				optimizedSize: file.size,
				state: "Selected"
			});
		} catch (error) {
			const message = humanUploadError(error instanceof Error ? error.message : "Unable to validate this file.");
			patch(item.id, {
				state: /supported|SVG/i.test(message) ? "Unsupported" : "Failed",
				errorTitle: /supported|SVG/i.test(message) ? "Unsupported file" : "Unable to prepare document",
				error: message
			});
		}
	};
	const queue = async (files, replacingUnsupported = false) => {
		const incoming = Array.from(files);
		if (!incoming.length) return;
		const capacity = Math.max(0, DOCUMENT_UPLOAD_CONFIG.MAX_FILES_PER_UPLOAD - items.length + (replacingUnsupported ? 1 : 0));
		const selected = incoming.slice(0, replaceId ? 1 : capacity);
		if (!selected.length) return;
		setValidating(true);
		const newItems = selected.map((source) => ({
			id: crypto.randomUUID(),
			source,
			file: source,
			state: "Validating",
			progress: 0
		}));
		setItems((rows) => [...rows, ...newItems]);
		await Promise.all(newItems.map(prepare));
		setValidating(false);
	};
	const onPicker = (event) => {
		if (event.target.files) {
			const replacingUnsupported = Boolean(replaceSelection.current);
			if (replaceSelection.current) {
				const oldId = replaceSelection.current;
				replaceSelection.current = null;
				setItems((rows) => rows.filter((item) => item.id !== oldId));
			}
			queue(event.target.files, replacingUnsupported);
		} else replaceSelection.current = null;
		event.target.value = "";
	};
	const onDrop = (event) => {
		event.preventDefault();
		setDragging(false);
		if (!busy && event.dataTransfer.files.length) queue(event.dataTransfer.files);
	};
	const uploadReady = (0, import_react.useMemo)(() => items.filter((item) => item.state === "Selected"), [items]);
	const submit = async () => {
		if (!uploadReady.length || busy) return;
		setUploading(true);
		setSuccess(false);
		const results = await Promise.all(uploadReady.map(async (item) => {
			patch(item.id, {
				state: "Uploading",
				progress: 0
			});
			try {
				const serverType = DOCUMENT_TYPE_VALUES[documentType] || documentType;
				const result = await uploadDocument(session, item.file, serverType, (loaded, total) => {
					const transferred = total > 0 && loaded >= total;
					patch(item.id, {
						state: transferred ? "Processing" : "Uploading",
						progress: transferred ? 100 : Math.min(99, Math.round(loaded / total * 100))
					});
				}, replaceId, item.source);
				patch(item.id, {
					state: "Processing",
					progress: 100,
					saved: result.original_size_bytes > result.size_bytes ? result.original_size_bytes - result.size_bytes : item.saved,
					optimizedSize: result.size_bytes
				});
				if (result.status === "READY") {
					patch(item.id, { state: "Uploaded" });
					return true;
				}
				patch(item.id, {
					state: "Failed",
					errorTitle: "Processing needs attention",
					error: `The file was stored, but processing returned ${result.status.toLowerCase()}. Retry from your document list.`
				});
				return false;
			} catch (error) {
				const message = humanUploadError(error instanceof Error ? error.message : "Upload failed. Retry this file.");
				patch(item.id, {
					state: "Failed",
					errorTitle: "Upload couldn't finish",
					error: message
				});
				return false;
			}
		}));
		setUploading(false);
		if (results.some(Boolean)) try {
			await onUploaded();
			if (results.every(Boolean)) setSuccess(true);
		} catch {
			setItems((rows) => rows.map((item) => item.state === "Uploaded" ? {
				...item,
				errorTitle: "Upload saved",
				error: "The document was uploaded, but the list couldn't refresh. Close and retry refresh."
			} : item));
		}
	};
	const retry = (item) => {
		if (item.state === "Unsupported") {
			replaceSelection.current = item.id;
			picker.current?.click();
		} else prepare(item);
	};
	const remove = (id) => setItems((rows) => rows.filter((item) => item.id !== id));
	const displayFormat = (file) => extension(file.name).toUpperCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-0 flex-1 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-7",
			children: [
				beforeUpload,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					role: "group",
					tabIndex: 0,
					"aria-disabled": busy,
					"aria-label": "Choose or drop documents to upload",
					"aria-describedby": "document-upload-help",
					onClick: (event) => {
						if (busy) return;
						if (!event.target.closest("button")) picker.current?.click();
					},
					onKeyDown: (event) => {
						if (busy || event.target !== event.currentTarget) return;
						if (event.key === "Enter" || event.key === " ") {
							event.preventDefault();
							picker.current?.click();
						}
					},
					onDragEnter: (event) => {
						event.preventDefault();
						setDragging(true);
					},
					onDragOver: (event) => {
						event.preventDefault();
						setDragging(true);
					},
					onDragLeave: (event) => {
						if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false);
					},
					onDrop,
					className: `group cursor-pointer rounded-lg border border-dashed px-5 py-7 text-center outline-none transition-[background-color,border-color,transform] focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:py-9 ${dragging ? "scale-[1.005] border-blue-500 bg-blue-50/80" : "border-slate-300 bg-stone-50/80 hover:border-slate-400 hover:bg-stone-50"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: picker,
							type: "file",
							className: "sr-only",
							multiple: !replaceId,
							accept: DOCUMENT_UPLOAD_CONFIG.ALLOWED_EXTENSIONS.map((ext) => `.${ext}`).join(","),
							onChange: onPicker,
							"aria-label": "Choose files"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `mx-auto flex h-11 w-11 items-center justify-center rounded-lg transition-colors ${dragging ? "bg-blue-100 text-blue-700" : "bg-white text-slate-600 shadow-sm ring-1 ring-slate-200"}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm font-semibold text-slate-900",
							children: dragging ? "Drop files to upload" : "Upload your documents"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-slate-500",
							children: "Drag and drop files here"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "my-2 text-xs text-slate-400",
							children: "or"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							className: "h-9 border-slate-300 bg-white px-4 shadow-none",
							onClick: (event) => {
								event.stopPropagation();
								picker.current?.click();
							},
							disabled: busy,
							children: "Choose files"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							id: "document-upload-help",
							className: "mt-3 text-xs leading-5 text-slate-500",
							children: [
								"PDF, JPG, JPEG, PNG or WEBP · Maximum",
								" ",
								formatBytes(DOCUMENT_UPLOAD_CONFIG.MAX_UPLOAD_SIZE),
								" per file"
							]
						})
					]
				}),
				items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					"aria-label": "Selected documents",
					className: "space-y-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold text-slate-900",
							children: "Files"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-slate-500",
							children: [
								items.length,
								" of ",
								DOCUMENT_UPLOAD_CONFIG.MAX_FILES_PER_UPLOAD
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						"aria-live": "polite",
						children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: `flex min-w-0 items-start gap-3 rounded-lg border px-3.5 py-3 transition-colors ${item.state === "Failed" || item.state === "Unsupported" ? "border-amber-200 bg-amber-50/50" : "border-slate-200 bg-white"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-stone-100 text-slate-600",
									children: item.source.type.startsWith("image/") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileImage, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "break-all text-sm font-medium leading-5 text-slate-900",
											children: item.source.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-0.5 text-xs text-slate-500",
											children: [
												displayFormat(item.source),
												" ·",
												" ",
												formatBytes(item.source.size),
												item.saved ? ` · Optimized to ${formatBytes(item.optimizedSize || item.file.size)} (saved ${Math.round(item.saved / item.source.size * 100)}%)` : ""
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1.5 flex items-center gap-1.5 text-xs",
											role: item.error ? "alert" : "status",
											children: [
												item.state === "Selected" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-teal-700" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-700",
													children: "Selected · Ready to upload"
												})] }),
												item.state === "Validating" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-600",
													children: "Checking document…"
												})] }),
												item.state === "Compressing" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-600",
													children: "Optimizing document…"
												})] }),
												item.state === "Uploading" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin text-blue-700" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-slate-700",
													children: [
														"Uploading · ",
														item.progress,
														"%"
													]
												})] }),
												item.state === "Processing" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin text-slate-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-slate-600",
													children: item.source.type === "application/pdf" && item.source.size > DOCUMENT_UPLOAD_CONFIG.PDF_COMPRESSION_THRESHOLD ? "Optimizing PDF and processing document…" : "Processing document…"
												})] }),
												item.state === "Uploaded" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-teal-700" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium text-teal-800",
													children: "Uploaded · Verification may still be pending"
												})] }),
												(item.state === "Failed" || item.state === "Unsupported") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium text-amber-900",
													children: item.errorTitle
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-amber-900",
													children: ["— ", item.error]
												})] })
											]
										}),
										(item.state === "Uploading" || item.state === "Processing") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100",
											role: "progressbar",
											"aria-label": `Uploading ${item.source.name}`,
											"aria-valuemin": 0,
											"aria-valuemax": 100,
											"aria-valuenow": item.progress,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-full bg-blue-600 transition-[width]",
												style: { width: `${item.progress}%` }
											})
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex shrink-0 items-center gap-1",
									children: [(item.state === "Failed" || item.state === "Unsupported") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "ghost",
										size: "icon",
										className: "h-8 w-8",
										"aria-label": `${item.state === "Unsupported" ? "Choose another file instead of" : "Retry"} ${item.source.name}`,
										onClick: () => retry(item),
										children: item.state === "Unsupported" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" })
									}), !busy && item.state !== "Uploaded" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "ghost",
										size: "icon",
										className: "h-8 w-8 text-slate-500 hover:text-slate-900",
										"aria-label": `Remove ${item.source.name}`,
										onClick: () => remove(item.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
									})]
								})
							]
						}, item.id))
					})]
				}),
				success && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-teal-200 bg-teal-50 p-3.5",
					role: "status",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-2 text-sm font-semibold text-teal-900",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), "Documents uploaded"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-teal-800",
						children: "Your documents are now available in My Documents."
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
			className: "flex shrink-0 flex-col-reverse gap-3 border-t bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-slate-500",
				"aria-live": "polite",
				children: [items.length ? `${items.length} file${items.length === 1 ? "" : "s"} selected` : "Choose files to begin", items.some((item) => item.state === "Failed" || item.state === "Unsupported") ? ` · ${items.filter((item) => item.state === "Failed" || item.state === "Unsupported").length} need attention` : ""]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
				children: success ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					onClick: onComplete,
					children: "Done"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					className: "border-slate-300",
					onClick: onCancel ?? onComplete,
					disabled: busy,
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					onClick: () => void submit(),
					disabled: !uploadReady.length || busy,
					className: "min-w-40",
					children: uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Uploading…"] }) : "Upload documents"
				})] })
			})]
		})]
	});
}
var statusLabel = (doc) => doc.expires_at && new Date(doc.expires_at) < /* @__PURE__ */ new Date() ? "Expired" : {
	VERIFIED: "Verified",
	ACTION_REQUIRED: "Review required",
	MISMATCH: "Mismatch detected",
	EXPIRED: "Expired",
	REJECTED: "Rejected",
	MANUAL_REVIEW: "Manual review",
	PENDING_REVIEW: "Pending review"
}[doc.verification_status] || "Pending review";
function DocumentViewer({ document, session, onClose, onChanged }) {
	const [objectUrl, setObjectUrl] = (0, import_react.useState)("");
	const [loadError, setLoadError] = (0, import_react.useState)("");
	const [versions, setVersions] = (0, import_react.useState)([]);
	const [applications, setApplications] = (0, import_react.useState)([]);
	const [extractions, setExtractions] = (0, import_react.useState)([]);
	const [page, setPage] = (0, import_react.useState)(1);
	const [pages, setPages] = (0, import_react.useState)(null);
	const [zoom, setZoom] = (0, import_react.useState)(100);
	const [replace, setReplace] = (0, import_react.useState)(false);
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(false);
	const [verifying, setVerifying] = (0, import_react.useState)(false);
	const preview = (0, import_react.useRef)(null);
	const isImage = !!document?.detected_mime_type.startsWith("image/");
	const isPdf = document?.detected_mime_type === "application/pdf";
	const canPreview = isImage || isPdf;
	const isOfficerOrAdmin = session.role === "verifier" || session.role === "officer" || session.role === "admin" || session.role === "supervisor" || session.role === "scheme";
	const accessPurpose = isOfficerOrAdmin ? "APPLICATION_VERIFICATION" : "CITIZEN_SELF_SERVICE";
	(0, import_react.useEffect)(() => {
		if (!document || !session.apiToken) return;
		let active = true;
		setObjectUrl("");
		setLoadError("");
		setPage(1);
		setPages(null);
		if (canPreview) fetch(apiUrl(`/api/v1/documents/${document.id}/preview?purpose=${accessPurpose}`), { headers: { Authorization: `Bearer ${session.apiToken}` } }).then(async (response) => {
			if (!response.ok) throw new Error("The protected preview could not be loaded. Try downloading the file.");
			const blob = await response.blob();
			if (isPdf) {
				const data = await blob.arrayBuffer();
				const count = new TextDecoder("latin1").decode(data).match(/\/Type\s*\/Page\b/g)?.length ?? null;
				if (active) setPages(count || null);
			}
			const url = URL.createObjectURL(blob);
			if (active) setObjectUrl(url);
			else URL.revokeObjectURL(url);
		}).catch((error) => active && setLoadError(error instanceof Error ? error.message : "Preview unavailable."));
		apiRequest(session, `/api/v1/documents/${document.id}/versions`).then((result) => active && setVersions(result.data)).catch(() => active && setVersions([document]));
		apiRequest(session, `/api/v1/documents/${document.id}/applications`).then((result) => active && setApplications(result.data)).catch(() => active && setApplications([]));
		apiRequest(session, `/api/v1/documents/${document.id}/extractions`).then((result) => active && setExtractions(result.data)).catch(() => active && setExtractions([]));
		return () => {
			active = false;
		};
	}, [
		document?.id,
		session.apiToken,
		accessPurpose
	]);
	(0, import_react.useEffect)(() => () => {
		if (objectUrl) URL.revokeObjectURL(objectUrl);
	}, [objectUrl]);
	if (!document) return null;
	const download = async () => {
		try {
			const response = await fetch(apiUrl(`/api/v1/documents/${document.id}/download?purpose=${accessPurpose}`), { headers: { Authorization: `Bearer ${session.apiToken}` } });
			if (!response.ok) throw new Error("Download unavailable. Try again.");
			const blob = await response.blob();
			const url = URL.createObjectURL(blob);
			const link = window.document.createElement("a");
			link.href = url;
			link.download = document.original_filename;
			link.click();
			window.setTimeout(() => URL.revokeObjectURL(url), 1e3);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Download failed.");
		}
	};
	const remove = async () => {
		try {
			await apiRequest(session, `/api/v1/documents/${document.id}`, { method: "DELETE" });
			toast.success("Document archived. Its audit history is preserved.");
			setConfirmDelete(false);
			onChanged();
			onClose();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Unable to archive document.");
		}
	};
	const handleOfficerVerify = async (newStatus) => {
		setVerifying(true);
		try {
			await apiRequest(session, `/api/v1/documents/${document.id}/verify`, {
				method: "POST",
				body: JSON.stringify({
					status: newStatus,
					notes: newStatus === "VERIFIED" ? `Verified by officer ${session.name}` : newStatus === "ACTION_REQUIRED" ? `Officer ${session.name} flagged data mismatch / action required` : `Rejected by officer ${session.name}`
				})
			});
			toast.success(`Document marked as ${newStatus}`);
			onChanged();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Verification update failed.");
		} finally {
			setVerifying(false);
		}
	};
	const verified = statusLabel(document);
	const uploaded = new Date(document.created_at).toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric"
	});
	const hasConflict = document.verification_status === "ACTION_REQUIRED" || document.verification_status === "MISMATCH" || extractions.some((e) => e.status === "CONFLICTING" || e.status === "REJECTED");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: !!document,
		onOpenChange: (open) => !open && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			className: "h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-[1440px] overflow-hidden p-0 sm:h-[calc(100dvh-2rem)] sm:w-[calc(100vw-2rem)] sm:rounded-2xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid h-full min-h-0 grid-rows-[auto_1fr] lg:grid-cols-[minmax(0,1fr)_370px] lg:grid-rows-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-h-0 flex-col bg-stone-100",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
						className: "flex flex-row items-center justify-between border-b bg-white px-4 py-3 text-left sm:px-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "min-w-0 truncate text-sm font-medium",
							children: document.original_filename
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 items-center gap-1",
							children: [
								isPdf && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										"aria-label": "Previous page",
										disabled: page <= 1,
										onClick: () => setPage((value) => Math.max(1, value - 1)),
										children: "‹"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "px-1 text-xs tabular-nums",
										children: [page, pages ? ` / ${pages}` : ""]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										"aria-label": "Next page",
										disabled: pages !== null && page >= pages,
										onClick: () => setPage((value) => value + 1),
										children: "›"
									})
								] }),
								canPreview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										"aria-label": "Zoom out",
										onClick: () => setZoom((value) => Math.max(50, value - 10)),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "w-10 text-center text-xs tabular-nums",
										children: [zoom, "%"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										"aria-label": "Zoom in",
										onClick: () => setZoom((value) => Math.min(200, value + 10)),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										"aria-label": "Full screen",
										onClick: () => preview.current?.requestFullscreen?.(),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Expand, { className: "h-4 w-4" })
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									"aria-label": "Close document preview",
									onClick: onClose,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: preview,
						className: "flex min-h-0 flex-1 items-center justify-center overflow-auto p-2 sm:p-5",
						children: loadError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-w-sm rounded-xl border bg-white p-6 text-center text-sm text-slate-600",
							children: [loadError, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "mt-4",
								onClick: download,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-4 w-4" }), "Download file"]
							})]
						}) : !canPreview ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-w-sm rounded-xl border bg-white p-8 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "mx-auto h-10 w-10 text-slate-400" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 font-medium",
									children: "Preview is not supported for this file type"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-slate-500",
									children: document.detected_mime_type
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "mt-5",
									onClick: download,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-4 w-4" }),
										"Download ",
										document.original_filename
									]
								})
							]
						}) : !objectUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-slate-500",
							children: "Loading secure preview…"
						}) : isPdf ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
							title: `PDF preview: ${document.original_filename}`,
							src: `${objectUrl}#page=${page}&zoom=${zoom}`,
							className: "h-full min-h-[60vh] w-full rounded-lg bg-white"
						}, `${objectUrl}#page=${page}&zoom=${zoom}`) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: objectUrl,
							alt: `Preview of ${document.original_filename}`,
							className: "max-h-full max-w-full origin-center object-contain transition-transform",
							style: { transform: `scale(${zoom / 100})` }
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "min-h-0 overflow-y-auto border-t bg-white p-5 lg:border-l lg:border-t-0 space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium uppercase tracking-wide text-slate-500",
									children: "Document details"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-1 break-words text-lg font-semibold text-slate-900",
									children: document.original_filename
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${verified === "Verified" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : verified === "Rejected" || verified === "Mismatch detected" ? "bg-red-50 text-red-700 border border-red-200" : "bg-amber-50 text-amber-800 border border-amber-200"}`,
								children: verified
							})]
						}),
						hasConflict && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-900 text-xs space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5 font-semibold text-amber-950",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-amber-600 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cross-Validation Conflict Flagged" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-amber-800 leading-relaxed",
								children: "Preliminary OCR extractions or declared records have conflicting values. Review the extracted fields below and cross-reference with official registers."
							})]
						}),
						isOfficerOrAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-blue-200 bg-blue-50/50 p-3 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-semibold text-blue-900 flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-blue-600" }), "Officer Determination"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-blue-700 font-mono",
									children: session.role
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-1.5 pt-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										disabled: verifying,
										onClick: () => handleOfficerVerify("VERIFIED"),
										className: "h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white px-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3 mr-1" }), "Verify"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "outline",
										disabled: verifying,
										onClick: () => handleOfficerVerify("ACTION_REQUIRED"),
										className: "h-7 text-[11px] border-amber-400 text-amber-800 hover:bg-amber-100 px-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3 w-3 mr-1 text-amber-600" }), "Flag"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "destructive",
										disabled: verifying,
										onClick: () => handleOfficerVerify("REJECTED"),
										className: "h-7 text-[11px] px-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-3 w-3 mr-1" }), "Reject"]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "grid grid-cols-2 gap-x-3 gap-y-3 text-xs border-y py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-slate-500",
									children: "Document Type"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "mt-0.5 font-medium",
									children: document.document_type
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-slate-500",
									children: "File Size"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "mt-0.5 font-medium",
									children: formatBytes(document.size_bytes)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-slate-500",
									children: "Uploaded"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "mt-0.5 font-medium",
									children: uploaded
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-slate-500",
									children: "Version"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "mt-0.5 font-medium",
									children: document.version_number || 1
								})] }),
								document.expires_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-slate-500",
										children: "Validity Expiry"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "mt-0.5 font-medium text-destructive",
										children: new Date(document.expires_at).toLocaleDateString("en-IN")
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5 text-blue-600" }), "Extracted Intelligence"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded bg-slate-100 font-mono text-[10px] px-1.5 py-0.5 text-slate-600",
								children: [extractions.length, " fields"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2.5 space-y-2",
							children: extractions.length > 0 ? extractions.map((ex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `rounded-md border p-2 text-xs transition-colors ${ex.status === "CONFLICTING" ? "border-amber-300 bg-amber-50/60" : ex.status === "REJECTED" ? "border-red-300 bg-red-50/60" : "border-slate-200 bg-slate-50/50"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] font-mono uppercase text-slate-500 block",
										children: ex.field
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-slate-900 mt-0.5 block break-words",
										children: ex.value
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col items-end gap-1 shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: `rounded px-1.5 py-0.2 text-[10px] font-bold ${ex.confidence >= .9 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`,
											children: [Math.round(ex.confidence * 100), "% conf"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px] uppercase font-mono text-slate-500",
											children: ex.status
										})]
									})]
								})
							}, ex.id || ex.field)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded border border-dashed p-3 text-center text-xs text-slate-400",
								children: "No automated extractions registered for this document."
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 pt-2 border-t",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "w-full",
								size: "sm",
								onClick: download,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-4 w-4" }), "Download File"]
							}), !isOfficerOrAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								className: "w-full",
								size: "sm",
								onClick: () => setReplace((value) => !value),
								children: replace ? "Cancel Replacement" : "Replace Document"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								className: "w-full text-destructive hover:text-destructive text-xs",
								size: "sm",
								onClick: () => setConfirmDelete(true),
								children: "Archive Document"
							})] })]
						}),
						replace && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 rounded-lg border p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-3 text-sm font-medium",
								children: "Upload a new version"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentUploader, {
								session,
								documentType: document.document_type,
								replaceId: document.id,
								onUploaded: onChanged,
								onComplete: () => {
									setReplace(false);
									onClose();
								}
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xs font-semibold text-slate-800 uppercase tracking-wider",
								children: "Version History"
							}), versions.length <= 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-slate-500",
								children: "No previous versions."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
								className: "mt-2 space-y-2",
								children: versions.map((version) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex justify-between gap-2 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0 truncate",
										children: [
											"v",
											version.version_number,
											": ",
											version.original_filename
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "shrink-0 text-slate-500",
										children: [new Date(version.created_at).toLocaleDateString("en-IN"), version.id === document.id ? " · Current" : ""]
									})]
								}, version.id))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-t pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-xs font-semibold text-slate-800 uppercase tracking-wider",
								children: [
									"Linked Applications (",
									applications.length,
									")"
								]
							}), applications.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 space-y-2",
								children: applications.map((app) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "rounded border bg-slate-50/70 p-2 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-slate-900",
										children: app.scheme_name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] text-slate-500 mt-0.5",
										children: [
											app.application_number,
											" · ",
											app.status
										]
									})]
								}, `${app.application_id}-${app.document_version_id}`))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-slate-500",
								children: "Not currently linked to any application."
							})]
						})
					]
				})]
			})
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
		open: confirmDelete,
		onOpenChange: setConfirmDelete,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Archive this document?" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "This file may be linked to an application. It will be removed from your active list, while its file and audit history remain preserved." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
			onClick: (event) => {
				event.preventDefault();
				remove();
			},
			children: "Archive document"
		})] })] })
	})] });
}
//#endregion
export { formatBytes as i, DocumentUploader as n, DocumentViewer as r, DOCUMENT_CATEGORIES as t };
