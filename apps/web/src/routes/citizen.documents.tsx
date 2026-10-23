import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  FileImage,
  FileText,
  FolderOpen,
  Search,
  SlidersHorizontal,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-state";
import { apiRequest, apiUrl, type ApiDocument } from "@/lib/api";
import { DOCUMENT_CATEGORIES, formatBytes } from "@/lib/document-config";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DocumentUploader } from "@/components/gov/DocumentUploader";
import { DocumentViewer } from "@/components/gov/DocumentViewer";
import { PageHeader } from "@/components/gov/ui";

export const Route = createFileRoute("/citizen/documents")({
  head: () => ({
    meta: [
      { title: "My Documents — Mira" },
      {
        name: "description",
        content:
          "Securely manage your documents for applications and public services.",
      },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    upload: search.upload === true || search.upload === "1",
  }),
  component: Docs,
});

type Tab =
  | "All Documents"
  | "Recent"
  | "Verified"
  | "Action Required"
  | "Expired"
  | "Rejected";
const TABS: Tab[] = [
  "All Documents",
  "Recent",
  "Verified",
  "Action Required",
  "Expired",
  "Rejected",
];
const docCategory = (doc: ApiDocument) => {
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
const statusOf = (doc: ApiDocument) =>
  doc.expires_at && new Date(doc.expires_at) < new Date()
    ? "EXPIRED"
    : doc.verification_status;
const statusText = (doc: ApiDocument) =>
  ({
    VERIFIED: "Verified",
    ACTION_REQUIRED: "Review required",
    MISMATCH: "Mismatch detected",
    EXPIRED: "Expired",
    REJECTED: "Rejected",
    MANUAL_REVIEW: "Manual review",
    PENDING_REVIEW: "Pending review",
  })[statusOf(doc)] || "Pending review";
const statusTone = (doc: ApiDocument) =>
  statusOf(doc) === "VERIFIED"
    ? "bg-emerald-50 text-emerald-700"
    : ["REJECTED", "MISMATCH"].includes(statusOf(doc))
      ? "bg-red-50 text-red-700"
      : "bg-amber-50 text-amber-800";

function Docs() {
  const searchParams = Route.useSearch();
  const { state } = useApp();
  const session = state.session;
  const [documents, setDocuments] = useState<ApiDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [tab, setTab] = useState<Tab>("All Documents");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All categories");
  const [type, setType] = useState("All types");
  const [sort, setSort] = useState("Newest");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState("Identity");
  const [viewer, setViewer] = useState<ApiDocument | null>(null);

  const refresh = useCallback(async () => {
    if (!session?.apiToken) {
      setDocuments([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError("");
    try {
      const result = await apiRequest<{ data: ApiDocument[] }>(
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

  useEffect(() => {
    void refresh();
  }, [refresh]);
  useEffect(() => {
    if (searchParams.upload) setUploadOpen(true);
  }, [searchParams.upload]);

  const filtered = useMemo(() => {
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

  const download = async (doc: ApiDocument) => {
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
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Download failed.");
    }
  };

  return (
    <div>
      <PageHeader
        title="My Documents"
        desc="Securely manage the documents used for your applications and public services."
        actions={
          <Button onClick={() => setUploadOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        }
      />
      {!session?.apiToken ? (
        <div className="rounded-xl border bg-white p-8 text-center">
          <FolderOpen className="mx-auto h-8 w-8 text-slate-400" />
          <h2 className="mt-3 font-semibold">
            Sign in to access your documents
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your private document library is available after secure sign in.
          </p>
          <Button asChild className="mt-4">
            <Link to="/login">Sign In</Link>
          </Button>
        </div>
      ) : (
        <>
          <div
            className="mb-5 flex flex-wrap items-center gap-2"
            role="tablist"
            aria-label="Document status filter"
          >
            {TABS.map((item) => (
              <button
                key={item}
                role="tab"
                aria-selected={tab === item}
                onClick={() => setTab(item)}
                className={`rounded-full px-3.5 py-2 text-sm transition-colors ${tab === item ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-stone-100"}`}
              >
                {item}
                {item === "All Documents"
                  ? ` (${documents.length})`
                  : item === "Verified"
                    ? ` (${documents.filter((doc) => statusOf(doc) === "VERIFIED").length})`
                    : ""}
              </button>
            ))}
          </div>
          <div className="mb-5 grid gap-3 rounded-xl border bg-white p-3 sm:grid-cols-[minmax(220px,1fr)_repeat(3,minmax(140px,190px))]">
            <label className="relative">
              <span className="sr-only">Search documents</span>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search documents"
                className="h-10 w-full rounded-lg border-0 bg-stone-50 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </label>
            <label className="sr-only" htmlFor="doc-category">
              Category
            </label>
            <select
              id="doc-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-10 rounded-lg border bg-white px-3 text-sm"
            >
              <option>All categories</option>
              {DOCUMENT_CATEGORIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <label className="sr-only" htmlFor="doc-type">
              File type
            </label>
            <select
              id="doc-type"
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="h-10 rounded-lg border bg-white px-3 text-sm"
            >
              <option>All types</option>
              {Array.from(
                new Set(documents.map((doc) => doc.detected_mime_type)),
              ).map((item) => (
                <option key={item} value={item}>
                  {item.split("/").pop()?.toUpperCase()}
                </option>
              ))}
            </select>
            <label className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <span className="sr-only">Sort documents</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-sm"
              >
                <option>Newest</option>
                <option>Oldest</option>
                <option>Name A–Z</option>
                <option>Name Z–A</option>
                <option>Largest</option>
                <option>Smallest</option>
                <option>Recently updated</option>
              </select>
            </label>
          </div>
          {loadError && (
            <div
              role="alert"
              className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              {loadError}
              <Button
                size="sm"
                variant="outline"
                className="ml-auto"
                onClick={() => void refresh()}
              >
                Retry
              </Button>
            </div>
          )}
          {loading ? (
            <div className="rounded-xl border bg-white py-16 text-center text-sm text-slate-500">
              Loading your secure documents…
            </div>
          ) : filtered.length === 0 ? (
            documents.length === 0 ? (
              <div className="rounded-xl border bg-white px-6 py-9 text-center">
                <FolderOpen className="mx-auto h-8 w-8 text-slate-400" />
                <h2 className="mt-3 text-base font-semibold text-slate-900">
                  No documents yet
                </h2>
                <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-600">
                  Upload documents once and reuse them across your applications.
                </p>
                <Button className="mt-4" onClick={() => setUploadOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </div>
            ) : (
              <div className="rounded-xl border bg-white py-12 text-center text-sm text-slate-500">
                No documents match these filters.
              </div>
            )
          ) : (
            <ul className="space-y-2">
              {filtered.map((doc) => (
                <li
                  key={doc.id}
                  className="group rounded-lg border border-slate-200 bg-white px-4 py-3.5 transition-colors hover:border-slate-300 hover:bg-stone-50/40"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-stone-100 text-slate-600">
                        {doc.detected_mime_type.startsWith("image/") ? (
                          <FileImage className="h-5 w-5" />
                        ) : (
                          <FileText className="h-5 w-5" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="max-w-full truncate text-sm font-semibold text-slate-900">
                            {doc.original_filename}
                          </h2>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusTone(doc)}`}
                          >
                            {statusText(doc)}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          {doc.detected_mime_type
                            .split("/")
                            .pop()
                            ?.toUpperCase()}{" "}
                          · {formatBytes(doc.size_bytes)} · {docCategory(doc)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Updated{" "}
                          {new Date(doc.updated_at).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}{" "}
                          · Uploaded{" "}
                          {new Date(doc.created_at).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2 pl-[52px] sm:pl-0">
                      <Button size="sm" onClick={() => setViewer(doc)}>
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => void download(doc)}
                      >
                        Download
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setViewer(doc)}
                      >
                        Replace
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="flex h-[min(85dvh,760px)] w-[calc(100vw-2rem)] max-w-[780px] flex-col gap-0 overflow-hidden p-0 sm:rounded-xl max-sm:left-0 max-sm:top-0 max-sm:h-[100dvh] max-sm:w-full max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-none">
          <DialogHeader className="shrink-0 border-b border-slate-200 px-5 py-5 pr-14 text-left sm:px-7">
            <DialogTitle className="text-lg font-semibold text-slate-900">
              Upload documents
            </DialogTitle>
            <DialogDescription className="mt-1">
              Add documents to your secure document vault.
            </DialogDescription>
          </DialogHeader>
          {session && (
            <DocumentUploader
              session={session}
              documentType={uploadCategory}
              onUploaded={refresh}
              onComplete={() => setUploadOpen(false)}
              onCancel={() => setUploadOpen(false)}
              beforeUpload={
                <div className="max-w-sm space-y-1.5">
                  <label
                    htmlFor="upload-category"
                    className="block text-sm font-medium text-slate-800"
                  >
                    Document category
                  </label>
                  <select
                    id="upload-category"
                    value={uploadCategory}
                    onChange={(event) => setUploadCategory(event.target.value)}
                    className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    {DOCUMENT_CATEGORIES.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>
              }
            />
          )}
        </DialogContent>
      </Dialog>
      {session && (
        <DocumentViewer
          document={viewer}
          session={session}
          onClose={() => setViewer(null)}
          onChanged={() => void refresh()}
        />
      )}
    </div>
  );
}
