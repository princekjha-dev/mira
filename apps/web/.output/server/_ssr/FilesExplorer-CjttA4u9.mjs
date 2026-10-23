import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { F as useApp } from "./app-state-7jSiCijd.mjs";
import { r as cn, t as Button } from "./button-BT328xhy.mjs";
import { Lt as FileText, N as Search, Qt as Download, g as Upload, wt as History } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-DO3wpSNE.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-Cl-rV5ml.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/FilesExplorer-CjttA4u9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FilesExplorer({ title = "Mira Document Vault & Evidence Files", subtitle = "Cryptographically attested, versioned documents and civil registry artifacts.", allowedCategories }) {
	const { state, addFileVersion } = useApp();
	const [activeCategory, setActiveCategory] = (0, import_react.useState)("All");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [selectedFileForVersions, setSelectedFileForVersions] = (0, import_react.useState)(null);
	const [uploadFileTarget, setUploadFileTarget] = (0, import_react.useState)(null);
	const [newVersionReason, setNewVersionReason] = (0, import_react.useState)("");
	const [newVersionFilename, setNewVersionFilename] = (0, import_react.useState)("");
	const categories = allowedCategories ? ["All", ...allowedCategories] : [
		"All",
		"My Files",
		"Application Files",
		"Household Files",
		"Evidence",
		"Requested Documents",
		"Archived"
	];
	const filteredFiles = state.files.filter((file) => {
		if (activeCategory !== "All" && file.category !== activeCategory) return false;
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase();
			const matchesName = file.name.toLowerCase().includes(q);
			const matchesType = file.type.toLowerCase().includes(q);
			const matchesUploader = file.uploadedBy.toLowerCase().includes(q);
			if (!matchesName && !matchesType && !matchesUploader) return false;
		}
		return true;
	});
	const handleUploadNewVersionSubmit = (e) => {
		e.preventDefault();
		if (!uploadFileTarget || !newVersionReason.trim() || !newVersionFilename.trim()) {
			toast.error("Please specify a replacement filename and reason for versioning.");
			return;
		}
		addFileVersion(uploadFileTarget.id, {
			filename: newVersionFilename.trim(),
			sizeBytes: Math.round(uploadFileTarget.sizeBytes * 1.05),
			reason: newVersionReason.trim()
		});
		toast.success(`Version ${uploadFileTarget.currentVersion + 1} logged`, { description: `Previous version preserved in immutable history.` });
		setUploadFileTarget(null);
		setNewVersionReason("");
		setNewVersionFilename("");
	};
	const statusBadge = (status) => {
		switch (status) {
			case "Verified": return "bg-teal/15 text-teal border-teal/20";
			case "Action Required":
			case "Mismatch Detected": return "bg-amber-100 text-amber-800 border-amber-200";
			default: return "bg-slate-100 text-slate-700 border-slate-200";
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight text-navy",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mt-0.5",
					children: subtitle
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						className: "text-xs h-9 gap-1.5",
						onClick: () => toast.info("Select file from local storage to upload"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5" }), "Upload New File"]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-center gap-1.5 border-b pb-2",
				children: categories.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setActiveCategory(cat),
					className: cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all", activeCategory === cat ? "bg-gov text-white font-semibold shadow-xs" : "text-slate-600 hover:bg-slate-100"),
					children: cat
				}, cat))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative max-w-sm flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: searchQuery,
						onChange: (e) => setSearchQuery(e.target.value),
						placeholder: "Search by filename, document type or citizen uploader…",
						className: "h-8 pl-8 text-xs bg-white"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-muted-foreground font-mono",
					children: [
						"Showing ",
						filteredFiles.length,
						" file records"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border bg-white shadow-xs overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-xs text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-slate-50 border-b text-slate-600 font-semibold",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3",
									children: "File Name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3",
									children: "Category"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3",
									children: "Size"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3",
									children: "Uploaded By"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3",
									children: "Version"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3",
									children: "Verification"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "p-3 text-right",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y text-slate-700",
							children: filteredFiles.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 7,
								className: "p-8 text-center text-slate-400",
								children: "No files found in this category."
							}) }) : filteredFiles.map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-slate-50/60 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3 font-semibold text-navy",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-gov shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate max-w-[200px]",
												title: file.name,
												children: file.name
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3 text-slate-500",
										children: file.category
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "p-3 font-mono text-slate-500",
										children: [Math.round(file.sizeBytes / 1024), " KB"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "truncate max-w-[140px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-slate-900",
												children: file.uploadedBy
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-slate-400 block font-mono",
												children: file.uploadedDate
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => setSelectedFileForVersions(file),
											className: "inline-flex items-center gap-1 font-mono font-bold text-gov hover:underline text-[11px]",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-3 w-3" }),
												"v",
												file.currentVersion
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "p-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: cn("rounded text-[10px] font-semibold px-2 py-0.5 border", statusBadge(file.verificationStatus)),
											children: file.verificationStatus
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "p-3 text-right space-x-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "ghost",
											className: "h-7 px-2 text-xs text-gov gap-1",
											onClick: () => toast.success(`Downloading ${file.name}…`),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3 w-3" }), "Save"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											className: "h-7 px-2 text-xs gap-1",
											onClick: () => {
												setUploadFileTarget(file);
												setNewVersionFilename(`${file.name.replace(/\.[^/.]+$/, "")}_updated.pdf`);
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3 w-3" }), "Replace"]
										})]
									})
								]
							}, file.id))
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!selectedFileForVersions,
				onOpenChange: (o) => !o && setSelectedFileForVersions(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-4 w-4 text-gov" }), "File Version Ledger"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
							selectedFileForVersions?.name,
							" (Current: v",
							selectedFileForVersions?.currentVersion,
							")"
						] })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 pt-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: "Government archival rule: Prior document versions are never deleted. They are preserved for auditability and verification attribution."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative pl-4 space-y-4 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200",
								children: selectedFileForVersions?.versions.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -left-4 top-1.5 h-2 w-2 rounded-full bg-gov ring-4 ring-white" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded border bg-slate-50 p-3 space-y-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-bold text-navy font-mono",
													children: ["Version ", v.versionNumber]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-muted-foreground font-mono",
													children: v.uploadedAt
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-mono text-slate-600 truncate",
												children: v.filename
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-slate-700 italic text-[11px] pt-1",
												children: [
													"Reason: \"",
													v.reason,
													"\""
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] text-slate-400 block pt-1",
												children: ["Uploaded by: ", v.uploadedBy]
											})
										]
									})]
								}, v.versionNumber))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setSelectedFileForVersions(null),
							children: "Close Ledger"
						}) })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!uploadFileTarget,
				onOpenChange: (o) => !o && setUploadFileTarget(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Upload Replacement Document Version" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
						"Creating Version ",
						uploadFileTarget ? uploadFileTarget.currentVersion + 1 : 2,
						" for ",
						uploadFileTarget?.name,
						"."
					] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleUploadNewVersionSubmit,
						className: "space-y-3 pt-2 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-semibold text-slate-700",
									children: "New File Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: newVersionFilename,
									onChange: (e) => setNewVersionFilename(e.target.value),
									required: true,
									className: "text-xs h-9"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-semibold text-slate-700",
									children: "Reason for Replacement"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "e.g. Uploaded attested copy with clear seal per Officer request",
									value: newVersionReason,
									onChange: (e) => setNewVersionReason(e.target.value),
									required: true,
									className: "text-xs h-9"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground leading-relaxed",
								children: "Replacing this document generates an immutable audit entry and prompts the assigned Verification Officer to review the new file."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									size: "sm",
									onClick: () => setUploadFileTarget(null),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									size: "sm",
									className: "bg-gov hover:bg-gov/90 text-white",
									children: "Commit New Version"
								})]
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { FilesExplorer as t };
