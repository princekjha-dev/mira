import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Download,
  Expand,
  FileText,
  Minus,
  Plus,
  X,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Session } from "@/lib/app-state";
import { apiRequest, apiUrl, type ApiDocument } from "@/lib/api";
import { formatBytes } from "@/lib/document-config";
import { DocumentUploader } from "./DocumentUploader";

export interface DocumentExtraction {
  id: string;
  field: string;
  value: string;
  normalized_value: string;
  confidence: number;
  status: string;
}

interface Props {
  document: ApiDocument | null;
  session: Session;
  onClose: () => void;
  onChanged: () => void;
}

interface ApplicationDocumentLink {
  application_id: string;
  application_number: string;
  scheme_name: string;
  status: string;
  required_type: string;
  document_version_id: string;
}

const statusLabel = (doc: ApiDocument) =>
  doc.expires_at && new Date(doc.expires_at) < new Date()
    ? "Expired"
    : ({
        VERIFIED: "Verified",
        ACTION_REQUIRED: "Review required",
        MISMATCH: "Mismatch detected",
        EXPIRED: "Expired",
        REJECTED: "Rejected",
        MANUAL_REVIEW: "Manual review",
        PENDING_REVIEW: "Pending review",
      }[doc.verification_status] || "Pending review");

export function DocumentViewer({ document, session, onClose, onChanged }: Props) {
  const [objectUrl, setObjectUrl] = useState("");
  const [loadError, setLoadError] = useState("");
  const [versions, setVersions] = useState<ApiDocument[]>([]);
  const [applications, setApplications] = useState<ApplicationDocumentLink[]>([]);
  const [extractions, setExtractions] = useState<DocumentExtraction[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState<number | null>(null);
  const [zoom, setZoom] = useState(100);
  const [replace, setReplace] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const preview = useRef<HTMLDivElement>(null);

  const isImage = !!document?.detected_mime_type.startsWith("image/");
  const isPdf = document?.detected_mime_type === "application/pdf";
  const canPreview = isImage || isPdf;

  const isOfficerOrAdmin =
    session.role === "verifier" ||
    session.role === "officer" ||
    session.role === "admin" ||
    session.role === "supervisor" ||
    session.role === "scheme_officer" ||
    session.role === "VERIFICATION_OFFICER" ||
    session.role === "SCHEME_OFFICER" ||
    session.role === "SUPERVISOR" ||
    session.role === "DEPARTMENT_ADMIN";

  const accessPurpose = isOfficerOrAdmin
    ? "APPLICATION_VERIFICATION"
    : "CITIZEN_SELF_SERVICE";

  useEffect(() => {
    if (!document || !session.apiToken) return;
    let active = true;
    setObjectUrl("");
    setLoadError("");
    setPage(1);
    setPages(null);

    if (canPreview) {
      fetch(apiUrl(`/api/v1/documents/${document.id}/preview?purpose=${accessPurpose}`), {
        headers: { Authorization: `Bearer ${session.apiToken}` },
      })
        .then(async (response) => {
          if (!response.ok)
            throw new Error(
              "The protected preview could not be loaded. Try downloading the file."
            );
          const blob = await response.blob();
          if (isPdf) {
            const data = await blob.arrayBuffer();
            const source = new TextDecoder("latin1").decode(data);
            const count = source.match(/\/Type\s*\/Page\b/g)?.length ?? null;
            if (active) setPages(count || null);
          }
          const url = URL.createObjectURL(blob);
          if (active) setObjectUrl(url);
          else URL.revokeObjectURL(url);
        })
        .catch(
          (error) =>
            active &&
            setLoadError(
              error instanceof Error ? error.message : "Preview unavailable."
            )
        );
    }

    apiRequest<{ data: ApiDocument[] }>(session, `/api/v1/documents/${document.id}/versions`)
      .then((result) => active && setVersions(result.data))
      .catch(() => active && setVersions([document]));

    apiRequest<{ data: ApplicationDocumentLink[] }>(
      session,
      `/api/v1/documents/${document.id}/applications`
    )
      .then((result) => active && setApplications(result.data))
      .catch(() => active && setApplications([]));

    apiRequest<{ data: DocumentExtraction[] }>(
      session,
      `/api/v1/documents/${document.id}/extractions`
    )
      .then((result) => active && setExtractions(result.data))
      .catch(() => active && setExtractions([]));

    return () => {
      active = false;
    };
  }, [document?.id, session.apiToken, accessPurpose]);

  useEffect(() => () => {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }, [objectUrl]);

  if (!document) return null;

  const download = async () => {
    try {
      const response = await fetch(
        apiUrl(`/api/v1/documents/${document.id}/download?purpose=${accessPurpose}`),
        { headers: { Authorization: `Bearer ${session.apiToken}` } }
      );
      if (!response.ok) throw new Error("Download unavailable. Try again.");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = document.original_filename;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
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

  const handleOfficerVerify = async (
    newStatus: "VERIFIED" | "ACTION_REQUIRED" | "REJECTED"
  ) => {
    setVerifying(true);
    try {
      await apiRequest(session, `/api/v1/documents/${document.id}/verify`, {
        method: "POST",
        body: JSON.stringify({
          status: newStatus,
          notes:
            newStatus === "VERIFIED"
              ? `Verified by officer ${session.name}`
              : newStatus === "ACTION_REQUIRED"
              ? `Officer ${session.name} flagged data mismatch / action required`
              : `Rejected by officer ${session.name}`,
        }),
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
    year: "numeric",
  });

  const hasConflict =
    document.verification_status === "ACTION_REQUIRED" ||
    document.verification_status === "MISMATCH" ||
    extractions.some((e) => e.status === "CONFLICTING" || e.status === "REJECTED");

  return (
    <>
      <Dialog open={!!document} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] max-w-[1440px] overflow-hidden p-0 sm:h-[calc(100dvh-2rem)] sm:w-[calc(100vw-2rem)] sm:rounded-2xl">
          <div className="grid h-full min-h-0 grid-rows-[auto_1fr] lg:grid-cols-[minmax(0,1fr)_370px] lg:grid-rows-1">
            <div className="flex min-h-0 flex-col bg-stone-100">
              <DialogHeader className="flex flex-row items-center justify-between border-b bg-white px-4 py-3 text-left sm:px-5">
                <DialogTitle className="min-w-0 truncate text-sm font-medium">
                  {document.original_filename}
                </DialogTitle>
                <div className="flex shrink-0 items-center gap-1">
                  {isPdf && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Previous page"
                        disabled={page <= 1}
                        onClick={() => setPage((value) => Math.max(1, value - 1))}
                      >
                        ‹
                      </Button>
                      <span className="px-1 text-xs tabular-nums">
                        {page}
                        {pages ? ` / ${pages}` : ""}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Next page"
                        disabled={pages !== null && page >= pages}
                        onClick={() => setPage((value) => value + 1)}
                      >
                        ›
                      </Button>
                    </>
                  )}
                  {canPreview && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Zoom out"
                        onClick={() => setZoom((value) => Math.max(50, value - 10))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-10 text-center text-xs tabular-nums">{zoom}%</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Zoom in"
                        onClick={() => setZoom((value) => Math.min(200, value + 10))}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Full screen"
                        onClick={() => preview.current?.requestFullscreen?.()}
                      >
                        <Expand className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Close document preview"
                    onClick={onClose}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>
              <div
                ref={preview}
                className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-2 sm:p-5"
              >
                {loadError ? (
                  <div className="max-w-sm rounded-xl border bg-white p-6 text-center text-sm text-slate-600">
                    {loadError}
                    <Button className="mt-4" onClick={download}>
                      <Download className="mr-2 h-4 w-4" />
                      Download file
                    </Button>
                  </div>
                ) : !canPreview ? (
                  <div className="max-w-sm rounded-xl border bg-white p-8 text-center">
                    <FileText className="mx-auto h-10 w-10 text-slate-400" />
                    <p className="mt-3 font-medium">Preview is not supported for this file type</p>
                    <p className="mt-1 text-sm text-slate-500">{document.detected_mime_type}</p>
                    <Button className="mt-5" onClick={download}>
                      <Download className="mr-2 h-4 w-4" />
                      Download {document.original_filename}
                    </Button>
                  </div>
                ) : !objectUrl ? (
                  <div className="text-sm text-slate-500">Loading secure preview…</div>
                ) : isPdf ? (
                  <iframe
                    key={`${objectUrl}#page=${page}&zoom=${zoom}`}
                    title={`PDF preview: ${document.original_filename}`}
                    src={`${objectUrl}#page=${page}&zoom=${zoom}`}
                    className="h-full min-h-[60vh] w-full rounded-lg bg-white"
                  />
                ) : (
                  <img
                    src={objectUrl}
                    alt={`Preview of ${document.original_filename}`}
                    className="max-h-full max-w-full origin-center object-contain transition-transform"
                    style={{ transform: `scale(${zoom / 100})` }}
                  />
                )}
              </div>
            </div>

            <aside className="min-h-0 overflow-y-auto border-t bg-white p-5 lg:border-l lg:border-t-0 space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Document details
                  </p>
                  <h2 className="mt-1 break-words text-lg font-semibold text-slate-900">
                    {document.original_filename}
                  </h2>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                    verified === "Verified"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : verified === "Rejected" || verified === "Mismatch detected"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-amber-50 text-amber-800 border border-amber-200"
                  }`}
                >
                  {verified}
                </span>
              </div>

              {/* Conflict / Alteration Alert Banner */}
              {hasConflict && (
                <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-900 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-950">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>Cross-Validation Conflict Flagged</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Preliminary OCR extractions or declared records have conflicting values. Review the extracted fields below and cross-reference with official registers.
                  </p>
                </div>
              )}

              {/* Officer Verification Action Panel */}
              {isOfficerOrAdmin && (
                <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-900 flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                      Officer Determination
                    </span>
                    <span className="text-[10px] text-blue-700 font-mono">
                      {session.role}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    <Button
                      size="sm"
                      disabled={verifying}
                      onClick={() => handleOfficerVerify("VERIFIED")}
                      className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white px-2"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verify
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={verifying}
                      onClick={() => handleOfficerVerify("ACTION_REQUIRED")}
                      className="h-7 text-[11px] border-amber-400 text-amber-800 hover:bg-amber-100 px-2"
                    >
                      <AlertTriangle className="h-3 w-3 mr-1 text-amber-600" />
                      Flag
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={verifying}
                      onClick={() => handleOfficerVerify("REJECTED")}
                      className="h-7 text-[11px] px-2"
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              )}

              <dl className="grid grid-cols-2 gap-x-3 gap-y-3 text-xs border-y py-3">
                <div>
                  <dt className="text-slate-500">Document Type</dt>
                  <dd className="mt-0.5 font-medium">{document.document_type}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">File Size</dt>
                  <dd className="mt-0.5 font-medium">{formatBytes(document.size_bytes)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Uploaded</dt>
                  <dd className="mt-0.5 font-medium">{uploaded}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Version</dt>
                  <dd className="mt-0.5 font-medium">{document.version_number || 1}</dd>
                </div>
                {document.expires_at && (
                  <div className="col-span-2">
                    <dt className="text-slate-500">Validity Expiry</dt>
                    <dd className="mt-0.5 font-medium text-destructive">
                      {new Date(document.expires_at).toLocaleDateString("en-IN")}
                    </dd>
                  </div>
                )}
              </dl>

              {/* Extracted Intelligence */}
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-blue-600" />
                    Extracted Intelligence
                  </h3>
                  <span className="rounded bg-slate-100 font-mono text-[10px] px-1.5 py-0.5 text-slate-600">
                    {extractions.length} fields
                  </span>
                </div>

                <div className="mt-2.5 space-y-2">
                  {extractions.length > 0 ? (
                    extractions.map((ex) => (
                      <div
                        key={ex.id || ex.field}
                        className={`rounded-md border p-2 text-xs transition-colors ${
                          ex.status === "CONFLICTING"
                            ? "border-amber-300 bg-amber-50/60"
                            : ex.status === "REJECTED"
                            ? "border-red-300 bg-red-50/60"
                            : "border-slate-200 bg-slate-50/50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <span className="text-[10px] font-mono uppercase text-slate-500 block">
                              {ex.field}
                            </span>
                            <span className="font-semibold text-slate-900 mt-0.5 block break-words">
                              {ex.value}
                            </span>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span
                              className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                                ex.confidence >= 0.9
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {Math.round(ex.confidence * 100)}% conf
                            </span>
                            <span className="text-[9px] uppercase font-mono text-slate-500">
                              {ex.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded border border-dashed p-3 text-center text-xs text-slate-400">
                      No automated extractions registered for this document.
                    </div>
                  )}
                </div>
              </div>

              {/* Citizen Actions */}
              <div className="space-y-2 pt-2 border-t">
                <Button className="w-full" size="sm" onClick={download}>
                  <Download className="mr-2 h-4 w-4" />
                  Download File
                </Button>
                {!isOfficerOrAdmin && (
                  <>
                    <Button
                      variant="outline"
                      className="w-full"
                      size="sm"
                      onClick={() => setReplace((value) => !value)}
                    >
                      {replace ? "Cancel Replacement" : "Replace Document"}
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full text-destructive hover:text-destructive text-xs"
                      size="sm"
                      onClick={() => setConfirmDelete(true)}
                    >
                      Archive Document
                    </Button>
                  </>
                )}
              </div>

              {replace && (
                <div className="mt-4 rounded-lg border p-3">
                  <p className="mb-3 text-sm font-medium">Upload a new version</p>
                  <DocumentUploader
                    session={session}
                    documentType={document.document_type}
                    replaceId={document.id}
                    onUploaded={onChanged}
                    onComplete={() => {
                      setReplace(false);
                      onClose();
                    }}
                  />
                </div>
              )}

              {/* Version History */}
              <div className="border-t pt-4">
                <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                  Version History
                </h3>
                {versions.length <= 1 ? (
                  <p className="mt-1 text-xs text-slate-500">No previous versions.</p>
                ) : (
                  <ol className="mt-2 space-y-2">
                    {versions.map((version) => (
                      <li
                        key={version.id}
                        className="flex justify-between gap-2 text-xs"
                      >
                        <span className="min-w-0 truncate">
                          v{version.version_number}: {version.original_filename}
                        </span>
                        <span className="shrink-0 text-slate-500">
                          {new Date(version.created_at).toLocaleDateString("en-IN")}
                          {version.id === document.id ? " · Current" : ""}
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>

              {/* Linked Applications */}
              <div className="border-t pt-4">
                <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                  Linked Applications ({applications.length})
                </h3>
                {applications.length ? (
                  <ul className="mt-2 space-y-2">
                    {applications.map((app) => (
                      <li
                        key={`${app.application_id}-${app.document_version_id}`}
                        className="rounded border bg-slate-50/70 p-2 text-xs"
                      >
                        <p className="font-semibold text-slate-900">{app.scheme_name}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {app.application_number} · {app.status}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-xs text-slate-500">
                    Not currently linked to any application.
                  </p>
                )}
              </div>
            </aside>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive this document?</AlertDialogTitle>
            <AlertDialogDescription>
              This file may be linked to an application. It will be removed from your active list, while its file and audit history remain preserved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void remove();
              }}
            >
              Archive document
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
