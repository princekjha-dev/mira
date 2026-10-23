import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Download, Expand, FileText, Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { Session } from "@/lib/app-state";
import { apiRequest, apiUrl, type ApiDocument } from "@/lib/api";
import { formatBytes } from "@/lib/document-config";
import { DocumentUploader } from "./DocumentUploader";

interface Props { document: ApiDocument | null; session: Session; onClose: () => void; onChanged: () => void }
interface ApplicationDocumentLink { application_id: string; application_number: string; scheme_name: string; status: string; required_type: string; document_version_id: string }
const statusLabel = (doc: ApiDocument) => doc.expires_at && new Date(doc.expires_at) < new Date() ? "Expired" : ({ VERIFIED: "Verified", ACTION_REQUIRED: "Review required", MISMATCH: "Mismatch detected", EXPIRED: "Expired", REJECTED: "Rejected", MANUAL_REVIEW: "Manual review", PENDING_REVIEW: "Pending review" }[doc.verification_status] || "Pending review");

export function DocumentViewer({ document, session, onClose, onChanged }: Props) {
  const [objectUrl, setObjectUrl] = useState("");
  const [loadError, setLoadError] = useState("");
  const [versions, setVersions] = useState<ApiDocument[]>([]);
  const [applications, setApplications] = useState<ApplicationDocumentLink[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState<number | null>(null);
  const [zoom, setZoom] = useState(100);
  const [replace, setReplace] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const preview = useRef<HTMLDivElement>(null);
  const isImage = !!document?.detected_mime_type.startsWith("image/");
  const isPdf = document?.detected_mime_type === "application/pdf";
  const canPreview = isImage || isPdf;

  useEffect(() => {
    if (!document || !session.apiToken) return;
    let active = true;
    setObjectUrl("");
    setLoadError("");
    setPage(1);
    setPages(null);
    if (canPreview) {
      fetch(apiUrl(`/api/v1/documents/${document.id}/preview?purpose=CITIZEN_SELF_SERVICE`), { headers: { Authorization: `Bearer ${session.apiToken}` } })
        .then(async (response) => {
          if (!response.ok) throw new Error("The protected preview could not be loaded. Try downloading the file.");
          const blob = await response.blob();
          if (isPdf) {
            const data = await blob.arrayBuffer();
            const source = new TextDecoder("latin1").decode(data);
            const count = source.match(/\/Type\s*\/Page\b/g)?.length ?? null;
            if (active) setPages(count || null);
          }
          const url = URL.createObjectURL(blob);
          if (active) setObjectUrl(url); else URL.revokeObjectURL(url);
        })
        .catch((error) => active && setLoadError(error instanceof Error ? error.message : "Preview unavailable."));
    }
    apiRequest<{ data: ApiDocument[] }>(session, `/api/v1/documents/${document.id}/versions`)
      .then((result) => active && setVersions(result.data))
      .catch(() => active && setVersions([document]));
    apiRequest<{ data: ApplicationDocumentLink[] }>(session, `/api/v1/documents/${document.id}/applications`)
      .then((result) => active && setApplications(result.data))
      .catch(() => active && setApplications([]));
    return () => { active = false; };
  }, [document?.id, session.apiToken]);

  useEffect(() => () => { if (objectUrl) URL.revokeObjectURL(objectUrl); }, [objectUrl]);

  if (!document) return null;

  const download = async () => {
    try {
      const response = await fetch(apiUrl(`/api/v1/documents/${document.id}/download?purpose=CITIZEN_SELF_SERVICE`), { headers: { Authorization: `Bearer ${session.apiToken}` } });
      if (!response.ok) throw new Error("Download unavailable. Try again.");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = document.original_filename;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) { toast.error(error instanceof Error ? error.message : "Download failed."); }
  };

  const remove = async () => {
    try {
      await apiRequest(session, `/api/v1/documents/${document.id}`, { method: "DELETE" });
      toast.success("Document archived. Its audit history is preserved.");
      setConfirmDelete(false);
      onChanged();
      onClose();
    } catch (error) { toast.error(error instanceof Error ? error.message : "Unable to archive document."); }
  };

  const verified = statusLabel(document);
  const uploaded = new Date(document.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  return <>
    <Dialog open={!!document} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-[1440px] overflow-hidden p-0 sm:h-[calc(100dvh-2rem)] sm:w-[calc(100vw-2rem)] sm:rounded-2xl">
        <div className="grid h-full min-h-0 grid-rows-[auto_1fr] lg:grid-cols-[minmax(0,1fr)_350px] lg:grid-rows-1">
          <div className="flex min-h-0 flex-col bg-stone-100">
            <DialogHeader className="flex flex-row items-center justify-between border-b bg-white px-4 py-3 text-left sm:px-5">
              <DialogTitle className="min-w-0 truncate text-sm font-medium">{document.original_filename}</DialogTitle>
              <div className="flex shrink-0 items-center gap-1">
                {isPdf && <><Button variant="ghost" size="icon" aria-label="Previous page" disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>‹</Button><span className="px-1 text-xs tabular-nums">{page}{pages ? ` / ${pages}` : ""}</span><Button variant="ghost" size="icon" aria-label="Next page" disabled={pages !== null && page >= pages} onClick={() => setPage((value) => value + 1)}>›</Button></>}
                {canPreview && <><Button variant="ghost" size="icon" aria-label="Zoom out" onClick={() => setZoom((value) => Math.max(50, value - 10))}><Minus className="h-4 w-4" /></Button><span className="w-10 text-center text-xs tabular-nums">{zoom}%</span><Button variant="ghost" size="icon" aria-label="Zoom in" onClick={() => setZoom((value) => Math.min(200, value + 10))}><Plus className="h-4 w-4" /></Button><Button variant="ghost" size="icon" aria-label="Full screen" onClick={() => preview.current?.requestFullscreen?.()}><Expand className="h-4 w-4" /></Button></>}
                <Button variant="ghost" size="icon" aria-label="Close document preview" onClick={onClose}><X className="h-4 w-4" /></Button>
              </div>
            </DialogHeader>
            <div ref={preview} className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-2 sm:p-5">
              {loadError ? <div className="max-w-sm rounded-xl border bg-white p-6 text-center text-sm text-slate-600">{loadError}<Button className="mt-4" onClick={download}><Download className="mr-2 h-4 w-4" />Download file</Button></div>
                : !canPreview ? <div className="max-w-sm rounded-xl border bg-white p-8 text-center"><FileText className="mx-auto h-10 w-10 text-slate-400" /><p className="mt-3 font-medium">Preview is not supported for this file type</p><p className="mt-1 text-sm text-slate-500">{document.detected_mime_type}</p><Button className="mt-5" onClick={download}><Download className="mr-2 h-4 w-4" />Download {document.original_filename}</Button></div>
                  : !objectUrl ? <div className="text-sm text-slate-500">Loading secure preview…</div>
                    : isPdf ? <iframe key={`${objectUrl}#page=${page}&zoom=${zoom}`} title={`PDF preview: ${document.original_filename}`} src={`${objectUrl}#page=${page}&zoom=${zoom}`} className="h-full min-h-[60vh] w-full rounded-lg bg-white" />
                      : <img src={objectUrl} alt={`Preview of ${document.original_filename}`} className="max-h-full max-w-full origin-center object-contain transition-transform" style={{ transform: `scale(${zoom / 100})` }} />}
            </div>
          </div>
          <aside className="min-h-0 overflow-y-auto border-t bg-white p-5 lg:border-l lg:border-t-0">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0"><p className="text-xs font-medium uppercase tracking-wide text-slate-500">Document details</p><h2 className="mt-1 break-words text-lg font-semibold text-slate-900">{document.original_filename}</h2></div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${verified === "Verified" ? "bg-emerald-50 text-emerald-700" : verified === "Rejected" || verified === "Mismatch detected" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-800"}`}>{verified}</span>
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-x-3 gap-y-4 text-sm">
              <div><dt className="text-xs text-slate-500">Type</dt><dd className="mt-1">{document.detected_mime_type.split("/").pop()?.toUpperCase()}</dd></div>
              <div><dt className="text-xs text-slate-500">Size</dt><dd className="mt-1">{formatBytes(document.size_bytes)}</dd></div>
              <div><dt className="text-xs text-slate-500">Uploaded</dt><dd className="mt-1">{uploaded}</dd></div>
              <div><dt className="text-xs text-slate-500">Last updated</dt><dd className="mt-1">{new Date(document.updated_at).toLocaleDateString("en-IN")}</dd></div>
              <div><dt className="text-xs text-slate-500">Version</dt><dd className="mt-1">{document.version_number || 1}</dd></div>
              {document.expires_at && <div><dt className="text-xs text-slate-500">Expires</dt><dd className="mt-1">{new Date(document.expires_at).toLocaleDateString("en-IN")}</dd></div>}
            </dl>
            <div className="mt-6 space-y-2">
              <Button className="w-full" onClick={download}><Download className="mr-2 h-4 w-4" />Download</Button>
              <Button variant="outline" className="w-full" onClick={() => setReplace((value) => !value)}>{replace ? "Cancel replacement" : "Replace document"}</Button>
              <Button variant="ghost" className="w-full text-destructive hover:text-destructive" onClick={() => setConfirmDelete(true)}>Archive document</Button>
            </div>
              {replace && <div className="mt-4 rounded-lg border p-3"><p className="mb-3 text-sm font-medium">Upload a new version</p><DocumentUploader session={session} documentType={document.document_type} replaceId={document.id} onUploaded={onChanged} onComplete={() => { setReplace(false); onClose(); }} /></div>}
            <div className="mt-7 border-t pt-5"><h3 className="text-sm font-semibold">Version history</h3>{versions.length <= 1 ? <p className="mt-2 text-xs text-slate-500">No previous versions.</p> : <ol className="mt-3 space-y-3">{versions.map((version) => <li key={version.id} className="flex justify-between gap-3 text-xs"><span className="min-w-0 truncate">Version {version.version_number}: {version.original_filename}</span><span className="shrink-0 text-slate-500">{new Date(version.created_at).toLocaleDateString("en-IN")}{version.id === document.id ? " · Current" : ""}</span></li>)}</ol>}</div>
            <div className="mt-6 border-t pt-5"><h3 className="text-sm font-semibold">Used by applications{applications.length ? ` (${applications.length})` : ""}</h3>{applications.length ? <ul className="mt-3 space-y-3">{applications.map((application) => <li key={`${application.application_id}-${application.document_version_id}`}><Link to="/citizen/applications/$id" params={{ id: application.application_number }} className="text-sm font-medium text-blue-700 hover:underline">{application.scheme_name}</Link><p className="mt-0.5 text-xs text-slate-500">{application.application_number} · {application.status} · {application.required_type}</p></li>)}</ul> : <p className="mt-2 text-xs text-slate-500">This document is not linked to an application.</p>}</div>
            <p className="mt-6 text-xs text-slate-500">Uploaded by {session.name}</p>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
    <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Archive this document?</AlertDialogTitle><AlertDialogDescription>This file may be linked to an application. It will be removed from your active list, while its file and audit history remain preserved.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={(event) => { event.preventDefault(); void remove(); }}>Archive document</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
  </>;
}
