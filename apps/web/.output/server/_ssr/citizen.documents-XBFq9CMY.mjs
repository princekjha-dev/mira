import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import {
  F as useApp,
  h as apiUrl,
  m as apiRequest,
} from "./app-state-7jSiCijd.mjs";
import { t as Button } from "./button-BT328xhy.mjs";
import { x as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import {
  Lt as FileText,
  Mt as FolderOpen,
  N as Search,
  O as SlidersHorizontal,
  Ut as FileImage,
  g as Upload,
  mn as CircleAlert,
} from "../_libs/lucide-react.mjs";
import { o as PageHeader } from "./ui-lDSlMDlK.mjs";
import {
  a as DialogHeader,
  n as DialogContent,
  o as DialogTitle,
  r as DialogDescription,
  t as Dialog,
} from "./dialog-DO3wpSNE.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import {
  i as formatBytes,
  n as DocumentUploader,
  r as DocumentViewer,
  t as DOCUMENT_CATEGORIES,
} from "./DocumentViewer-RIeDKuW9.mjs";
import { t as Route } from "./citizen.documents-BqtajKFo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/citizen.documents-XBFq9CMY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
  "All Documents",
  "Recent",
  "Verified",
  "Action Required",
  "Expired",
  "Rejected",
];
var docCategory = (doc) => {
  const type = doc.document_type.toLowerCase();
  const name = doc.original_filename.toLowerCase();
  if (type.includes("bpl") || name.includes("bpl") || name.includes("economic"))
    return "BPL / Economic Status";
  if (name.includes("land") || type.includes("land")) return "Land";
  if (
    type.includes("education") ||
    name.includes("education") ||
    name.includes("scholarship")
  )
    return "Education";
  if (type.includes("marriage") || name.includes("marriage")) return "Marriage";
  if (type.includes("bank") || name.includes("bank")) return "Bank";
  if (type.includes("employment") || name.includes("employment"))
    return "Employment";
  if (type.includes("identity")) return "Identity";
  if (type.includes("residence")) return "Address";
  if (type.includes("income")) return "Income";
  if (type.includes("birth")) return "Birth";
  if (type.includes("property") || type.includes("land")) return "Property";
  if (type.includes("benefit")) return "Scheme-specific";
  return "Other";
};
var statusOf = (doc) =>
  doc.expires_at && new Date(doc.expires_at) < /* @__PURE__ */ new Date()
    ? "EXPIRED"
    : doc.verification_status;
var statusText = (doc) =>
  ({
    VERIFIED: "Verified",
    ACTION_REQUIRED: "Review required",
    MISMATCH: "Mismatch detected",
    EXPIRED: "Expired",
    REJECTED: "Rejected",
    MANUAL_REVIEW: "Manual review",
    PENDING_REVIEW: "Pending review",
  })[statusOf(doc)] || "Pending review";
var statusTone = (doc) =>
  statusOf(doc) === "VERIFIED"
    ? "bg-emerald-50 text-emerald-700"
    : ["REJECTED", "MISMATCH"].includes(statusOf(doc))
      ? "bg-red-50 text-red-700"
      : "bg-amber-50 text-amber-800";
function Docs() {
  const searchParams = Route.useSearch();
  const { state } = useApp();
  const session = state.session;
  const [documents, setDocuments] = (0, import_react.useState)([]);
  const [loading, setLoading] = (0, import_react.useState)(true);
  const [loadError, setLoadError] = (0, import_react.useState)("");
  const [tab, setTab] = (0, import_react.useState)("All Documents");
  const [query, setQuery] = (0, import_react.useState)("");
  const [category, setCategory] = (0, import_react.useState)("All categories");
  const [type, setType] = (0, import_react.useState)("All types");
  const [sort, setSort] = (0, import_react.useState)("Newest");
  const [uploadOpen, setUploadOpen] = (0, import_react.useState)(false);
  const [uploadCategory, setUploadCategory] = (0, import_react.useState)(
    "Identity",
  );
  const [viewer, setViewer] = (0, import_react.useState)(null);
  const refresh = (0, import_react.useCallback)(async () => {
    if (!session?.apiToken) {
      setDocuments([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError("");
    try {
      const result = await apiRequest(
        session,
        "/api/v1/documents?owner_type=CITIZEN",
      );
      setDocuments(result.data.filter((doc) => doc.status !== "REVOKED"));
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Unable to load your documents.",
      );
    } finally {
      setLoading(false);
    }
  }, [session]);
  (0, import_react.useEffect)(() => {
    refresh();
  }, [refresh]);
  (0, import_react.useEffect)(() => {
    if (searchParams.upload) setUploadOpen(true);
  }, [searchParams.upload]);
  const filtered = (0, import_react.useMemo)(() => {
    let rows = [...documents];
    const term = query.trim().toLowerCase();
    if (term)
      rows = rows.filter((doc) =>
        [
          doc.original_filename,
          doc.document_type,
          doc.detected_mime_type,
          statusText(doc),
          docCategory(doc),
        ].some((value) => value.toLowerCase().includes(term)),
      );
    if (category !== "All categories")
      rows = rows.filter((doc) => docCategory(doc) === category);
    if (type !== "All types")
      rows = rows.filter((doc) => doc.detected_mime_type === type);
    if (tab === "Recent") rows = rows.slice(0, 5);
    if (tab === "Verified")
      rows = rows.filter((doc) => statusOf(doc) === "VERIFIED");
    if (tab === "Action Required")
      rows = rows.filter((doc) =>
        [
          "ACTION_REQUIRED",
          "MISMATCH",
          "MANUAL_REVIEW",
          "PENDING_REVIEW",
        ].includes(statusOf(doc)),
      );
    if (tab === "Expired")
      rows = rows.filter((doc) => statusOf(doc) === "EXPIRED");
    if (tab === "Rejected")
      rows = rows.filter((doc) => statusOf(doc) === "REJECTED");
    rows.sort((a, b) => {
      if (sort === "Oldest") return a.created_at.localeCompare(b.created_at);
      if (sort === "Name A–Z")
        return a.original_filename.localeCompare(b.original_filename);
      if (sort === "Name Z–A")
        return b.original_filename.localeCompare(a.original_filename);
      if (sort === "Largest") return b.size_bytes - a.size_bytes;
      if (sort === "Smallest") return a.size_bytes - b.size_bytes;
      if (sort === "Recently updated")
        return b.updated_at.localeCompare(a.updated_at);
      return b.created_at.localeCompare(a.created_at);
    });
    return rows;
  }, [documents, query, category, type, tab, sort]);
  const download = async (doc) => {
    try {
      const response = await fetch(
        apiUrl(
          `/api/v1/documents/${doc.id}/download?purpose=CITIZEN_SELF_SERVICE`,
        ),
        { headers: { Authorization: `Bearer ${session?.apiToken}` } },
      );
      if (!response.ok) throw new Error("Download failed. Try again.");
      const url = URL.createObjectURL(await response.blob());
      const link = window.document.createElement("a");
      link.href = url;
      link.download = doc.original_filename;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1e3);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Download failed.");
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
    children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
        title: "My Documents",
        desc: "Securely manage the documents used for your applications and public services.",
        actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
          onClick: () => setUploadOpen(true),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {
              className: "mr-2 h-4 w-4",
            }),
            "Upload Document",
          ],
        }),
      }),
      !session?.apiToken
        ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
            className: "rounded-xl border bg-white p-8 text-center",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, {
                className: "mx-auto h-8 w-8 text-slate-400",
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
                className: "mt-3 font-semibold",
                children: "Sign in to access your documents",
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                className: "mt-1 text-sm text-muted-foreground",
                children:
                  "Your private document library is available after secure sign in.",
              }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
                asChild: true,
                className: "mt-4",
                children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
                  to: "/login",
                  children: "Sign In",
                }),
              }),
            ],
          })
        : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            import_jsx_runtime.Fragment,
            {
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                  className: "mb-5 flex flex-wrap items-center gap-2",
                  role: "tablist",
                  "aria-label": "Document status filter",
                  children: TABS.map((item) =>
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                      "button",
                      {
                        role: "tab",
                        "aria-selected": tab === item,
                        onClick: () => setTab(item),
                        className: `rounded-full px-3.5 py-2 text-sm transition-colors ${tab === item ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-stone-100"}`,
                        children: [
                          item,
                          item === "All Documents"
                            ? ` (${documents.length})`
                            : item === "Verified"
                              ? ` (${documents.filter((doc) => statusOf(doc) === "VERIFIED").length})`
                              : "",
                        ],
                      },
                      item,
                    ),
                  ),
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                  className:
                    "mb-5 grid gap-3 rounded-xl border bg-white p-3 sm:grid-cols-[minmax(220px,1fr)_repeat(3,minmax(140px,190px))]",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
                      className: "relative",
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                          className: "sr-only",
                          children: "Search documents",
                        }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
                          className:
                            "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400",
                        }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
                          value: query,
                          onChange: (event) => setQuery(event.target.value),
                          placeholder: "Search documents",
                          className:
                            "h-10 w-full rounded-lg border-0 bg-stone-50 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30",
                        }),
                      ],
                    }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
                      className: "sr-only",
                      htmlFor: "doc-category",
                      children: "Category",
                    }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
                      id: "doc-category",
                      value: category,
                      onChange: (event) => setCategory(event.target.value),
                      className: "h-10 rounded-lg border bg-white px-3 text-sm",
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
                          children: "All categories",
                        }),
                        DOCUMENT_CATEGORIES.map((item) =>
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                            "option",
                            { children: item },
                            item,
                          ),
                        ),
                      ],
                    }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
                      className: "sr-only",
                      htmlFor: "doc-type",
                      children: "File type",
                    }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
                      id: "doc-type",
                      value: type,
                      onChange: (event) => setType(event.target.value),
                      className: "h-10 rounded-lg border bg-white px-3 text-sm",
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
                          children: "All types",
                        }),
                        Array.from(
                          new Set(
                            documents.map((doc) => doc.detected_mime_type),
                          ),
                        ).map((item) =>
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                            "option",
                            {
                              value: item,
                              children: item.split("/").pop()?.toUpperCase(),
                            },
                            item,
                          ),
                        ),
                      ],
                    }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
                      className: "relative",
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                          SlidersHorizontal,
                          {
                            className:
                              "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400",
                          },
                        ),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
                          className: "sr-only",
                          children: "Sort documents",
                        }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
                          value: sort,
                          onChange: (event) => setSort(event.target.value),
                          className:
                            "h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-sm",
                          children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                              "option",
                              { children: "Newest" },
                            ),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                              "option",
                              { children: "Oldest" },
                            ),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                              "option",
                              { children: "Name A–Z" },
                            ),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                              "option",
                              { children: "Name Z–A" },
                            ),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                              "option",
                              { children: "Largest" },
                            ),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                              "option",
                              { children: "Smallest" },
                            ),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                              "option",
                              { children: "Recently updated" },
                            ),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                loadError &&
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                    role: "alert",
                    className:
                      "mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, {
                        className: "h-4 w-4 shrink-0",
                      }),
                      loadError,
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
                        size: "sm",
                        variant: "outline",
                        className: "ml-auto",
                        onClick: () => void refresh(),
                        children: "Retry",
                      }),
                    ],
                  }),
                loading
                  ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                      className:
                        "rounded-xl border bg-white py-16 text-center text-sm text-slate-500",
                      children: "Loading your secure documents…",
                    })
                  : filtered.length === 0
                    ? documents.length === 0
                      ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
                          className:
                            "rounded-xl border bg-white px-6 py-9 text-center",
                          children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                              FolderOpen,
                              { className: "mx-auto h-8 w-8 text-slate-400" },
                            ),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
                              className:
                                "mt-3 text-base font-semibold text-slate-900",
                              children: "No documents yet",
                            }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
                              className:
                                "mx-auto mt-1.5 max-w-md text-sm text-slate-600",
                              children:
                                "Upload documents once and reuse them across your applications.",
                            }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                              Button,
                              {
                                className: "mt-4",
                                onClick: () => setUploadOpen(true),
                                children: [
                                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                                    Upload,
                                    { className: "mr-2 h-4 w-4" },
                                  ),
                                  "Upload Document",
                                ],
                              },
                            ),
                          ],
                        })
                      : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
                          className:
                            "rounded-xl border bg-white py-12 text-center text-sm text-slate-500",
                          children: "No documents match these filters.",
                        })
                    : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
                        className: "space-y-2",
                        children: filtered.map((doc) =>
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                            "li",
                            {
                              className:
                                "group rounded-lg border border-slate-200 bg-white px-4 py-3.5 transition-colors hover:border-slate-300 hover:bg-stone-50/40",
                              children: /* @__PURE__ */ (0,
                              import_jsx_runtime.jsxs)("div", {
                                className:
                                  "flex flex-col gap-3 sm:flex-row sm:items-center",
                                children: [
                                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                                    "div",
                                    {
                                      className:
                                        "flex min-w-0 flex-1 items-start gap-3",
                                      children: [
                                        /* @__PURE__ */ (0,
                                        import_jsx_runtime.jsx)("div", {
                                          className:
                                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-stone-100 text-slate-600",
                                          children:
                                            doc.detected_mime_type.startsWith(
                                              "image/",
                                            )
                                              ? /* @__PURE__ */ (0,
                                                import_jsx_runtime.jsx)(
                                                  FileImage,
                                                  { className: "h-5 w-5" },
                                                )
                                              : /* @__PURE__ */ (0,
                                                import_jsx_runtime.jsx)(
                                                  FileText,
                                                  { className: "h-5 w-5" },
                                                ),
                                        }),
                                        /* @__PURE__ */ (0,
                                        import_jsx_runtime.jsxs)("div", {
                                          className: "min-w-0 flex-1",
                                          children: [
                                            /* @__PURE__ */ (0,
                                            import_jsx_runtime.jsxs)("div", {
                                              className:
                                                "flex flex-wrap items-center gap-2",
                                              children: [
                                                /* @__PURE__ */ (0,
                                                import_jsx_runtime.jsx)("h2", {
                                                  className:
                                                    "max-w-full truncate text-sm font-semibold text-slate-900",
                                                  children:
                                                    doc.original_filename,
                                                }),
                                                /* @__PURE__ */ (0,
                                                import_jsx_runtime.jsx)(
                                                  "span",
                                                  {
                                                    className: `rounded-full px-2 py-0.5 text-[11px] font-medium ${statusTone(doc)}`,
                                                    children: statusText(doc),
                                                  },
                                                ),
                                              ],
                                            }),
                                            /* @__PURE__ */ (0,
                                            import_jsx_runtime.jsxs)("p", {
                                              className:
                                                "mt-1 text-xs text-slate-500",
                                              children: [
                                                doc.detected_mime_type
                                                  .split("/")
                                                  .pop()
                                                  ?.toUpperCase(),
                                                " ",
                                                "· ",
                                                formatBytes(doc.size_bytes),
                                                " · ",
                                                docCategory(doc),
                                              ],
                                            }),
                                            /* @__PURE__ */ (0,
                                            import_jsx_runtime.jsxs)("p", {
                                              className:
                                                "mt-1 text-xs text-slate-500",
                                              children: [
                                                "Updated",
                                                " ",
                                                new Date(
                                                  doc.updated_at,
                                                ).toLocaleDateString("en-IN", {
                                                  day: "numeric",
                                                  month: "short",
                                                  year: "numeric",
                                                }),
                                                " ",
                                                "· Uploaded",
                                                " ",
                                                new Date(
                                                  doc.created_at,
                                                ).toLocaleDateString("en-IN", {
                                                  day: "numeric",
                                                  month: "short",
                                                  year: "numeric",
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    },
                                  ),
                                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                                    "div",
                                    {
                                      className:
                                        "flex shrink-0 flex-wrap gap-2 pl-[52px] sm:pl-0",
                                      children: [
                                        /* @__PURE__ */ (0,
                                        import_jsx_runtime.jsx)(Button, {
                                          size: "sm",
                                          onClick: () => setViewer(doc),
                                          children: "View",
                                        }),
                                        /* @__PURE__ */ (0,
                                        import_jsx_runtime.jsx)(Button, {
                                          size: "sm",
                                          variant: "outline",
                                          onClick: () => void download(doc),
                                          children: "Download",
                                        }),
                                        /* @__PURE__ */ (0,
                                        import_jsx_runtime.jsx)(Button, {
                                          size: "sm",
                                          variant: "ghost",
                                          onClick: () => setViewer(doc),
                                          children: "Replace",
                                        }),
                                      ],
                                    },
                                  ),
                                ],
                              }),
                            },
                            doc.id,
                          ),
                        ),
                      }),
              ],
            },
          ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
        open: uploadOpen,
        onOpenChange: setUploadOpen,
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
          className:
            "flex h-[min(85dvh,760px)] w-[calc(100vw-2rem)] max-w-[780px] flex-col gap-0 overflow-hidden p-0 sm:rounded-xl max-sm:left-0 max-sm:top-0 max-sm:h-[100dvh] max-sm:w-full max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-none",
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, {
              className:
                "shrink-0 border-b border-slate-200 px-5 py-5 pr-14 text-left sm:px-7",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
                  className: "text-lg font-semibold text-slate-900",
                  children: "Upload documents",
                }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
                  className: "mt-1",
                  children: "Add documents to your secure document vault.",
                }),
              ],
            }),
            session &&
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentUploader, {
                session,
                documentType: uploadCategory,
                onUploaded: refresh,
                onComplete: () => setUploadOpen(false),
                onCancel: () => setUploadOpen(false),
                beforeUpload: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  "div",
                  {
                    className: "max-w-sm space-y-1.5",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
                        htmlFor: "upload-category",
                        className: "block text-sm font-medium text-slate-800",
                        children: "Document category",
                      }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
                        id: "upload-category",
                        value: uploadCategory,
                        onChange: (event) =>
                          setUploadCategory(event.target.value),
                        className:
                          "h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                        children: DOCUMENT_CATEGORIES.map((item) =>
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                            "option",
                            { children: item },
                            item,
                          ),
                        ),
                      }),
                    ],
                  },
                ),
              }),
          ],
        }),
      }),
      session &&
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentViewer, {
          document: viewer,
          session,
          onClose: () => setViewer(null),
          onChanged: () => void refresh(),
        }),
    ],
  });
}
//#endregion
export { Docs as component };
