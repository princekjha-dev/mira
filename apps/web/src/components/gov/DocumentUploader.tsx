import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type ReactNode,
} from "react";
import {
  Check,
  CheckCircle2,
  FileImage,
  FileText,
  FileUp,
  LoaderCircle,
  RotateCcw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Session } from "@/lib/app-state";
import { uploadDocument } from "@/lib/api";
import {
  DOCUMENT_TYPE_VALUES,
  DOCUMENT_UPLOAD_CONFIG,
  formatBytes,
} from "@/lib/document-config";

type UploadState =
  | "Validating"
  | "Compressing"
  | "Selected"
  | "Uploading"
  | "Processing"
  | "Uploaded"
  | "Failed"
  | "Unsupported";
interface UploadItem {
  id: string;
  source: File;
  file: File;
  state: UploadState;
  progress: number;
  error?: string;
  errorTitle?: string;
  saved?: number;
  optimizedSize?: number;
}
interface Props {
  session: Session;
  documentType: string;
  onUploaded: () => void | Promise<unknown>;
  replaceId?: string;
  onComplete?: () => void;
  onCancel?: () => void;
  beforeUpload?: ReactNode;
}

const extension = (name: string) => name.split(".").pop()?.toLowerCase() || "";

async function validateFile(file: File): Promise<void> {
  const ext = extension(file.name);
  if (!DOCUMENT_UPLOAD_CONFIG.ALLOWED_EXTENSIONS.includes(ext as never)) {
    if (ext === "svg")
      throw new Error(
        "SVG files aren't supported for citizen documents. Please upload a PDF or image document.",
      );
    throw new Error("This file type isn't supported for document storage.");
  }
  if (file.size <= 0)
    throw new Error("This file is empty. Choose another document.");
  if (
    file.size > DOCUMENT_UPLOAD_CONFIG.MAX_UPLOAD_SIZE &&
    !file.type.startsWith("image/")
  ) {
    throw new Error(
      `This document is larger than ${formatBytes(DOCUMENT_UPLOAD_CONFIG.MAX_UPLOAD_SIZE)}. Choose a smaller PDF to preserve its text and page structure.`,
    );
  }

  const bytes = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const starts = (...signature: number[]) =>
    signature.every((value, index) => bytes[index] === value);
  let valid = false;
  try {
    valid =
      ext === "pdf"
        ? starts(0x25, 0x50, 0x44, 0x46, 0x2d)
        : ext === "png"
          ? starts(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)
          : ext === "jpg" || ext === "jpeg"
            ? starts(0xff, 0xd8, 0xff)
            : ext === "webp"
              ? starts(0x52, 0x49, 0x46, 0x46) &&
                String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
              : ext === "docx" || ext === "xlsx"
                ? starts(0x50, 0x4b, 0x03, 0x04)
                : ext === "txt" || ext === "csv"
                  ? new TextDecoder("utf-8", { fatal: true }).decode(bytes)
                      .length > 0
                  : false;
  } catch {
    valid = false;
  }
  if (!valid)
    throw new Error(
      "This file could not be read as a supported document. Choose another file.",
    );
  if (
    file.type &&
    !DOCUMENT_UPLOAD_CONFIG.ALLOWED_MIME_TYPES.includes(file.type as never)
  ) {
    throw new Error("This file type isn't supported for document storage.");
  }
}

async function optimizeImage(
  source: File,
): Promise<{ file: File; saved: number }> {
  if (source.size <= DOCUMENT_UPLOAD_CONFIG.IMAGE_COMPRESSION_THRESHOLD)
    return { file: source, saved: 0 };
  const image = await createImageBitmap(source).catch(() => {
    throw new Error(
      "Automatic image optimization couldn't read this image. Retry or choose another file.",
    );
  });
  const scale = Math.min(
    1,
    DOCUMENT_UPLOAD_CONFIG.IMAGE_MAX_DIMENSION /
      Math.max(image.width, image.height),
  );
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
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (value) =>
        value
          ? resolve(value)
          : reject(
              new Error(
                "Image optimization failed. The original file is still available to retry.",
              ),
            ),
      outputType,
      DOCUMENT_UPLOAD_CONFIG.IMAGE_QUALITY,
    ),
  );
  if (blob.size >= source.size * 0.92) return { file: source, saved: 0 };
  return {
    file: new File([blob], source.name, {
      type: outputType,
      lastModified: source.lastModified,
    }),
    saved: source.size - blob.size,
  };
}

function humanUploadError(message: string) {
  if (/401|unauthori[sz]ed|token|sign in/i.test(message))
    return "Your secure session expired. Sign in again, then retry.";
  if (/403|forbidden/i.test(message))
    return "You don't have permission to store this document here.";
  if (/413|exceeds maximum|larger than/i.test(message))
    return "This file is larger than the storage limit. Choose a smaller document.";
  if (/415|unsupported.*(media|format|type)/i.test(message))
    return "This file type isn't supported for document storage.";
  if (/400|422|validation/i.test(message))
    return "Unable to upload this file. Check that it's a valid supported document and try again.";
  if (/network|fetch|connection|interrupted/i.test(message))
    return "Upload interrupted. Check your connection and retry.";
  if (/storage|internal server|500|503/i.test(message))
    return "Secure storage is temporarily unavailable. Retry in a moment.";
  if (/corrupt|could not be read|signature|empty/i.test(message))
    return "This document couldn't be read. Choose a valid PDF or image file.";
  return message;
}

export function DocumentUploader({
  session,
  documentType,
  onUploaded,
  replaceId,
  onComplete,
  onCancel,
  beforeUpload,
}: Props) {
  const picker = useRef<HTMLInputElement>(null);
  const replaceSelection = useRef<string | null>(null);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [validating, setValidating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const busy = validating || uploading;
  const patch = (id: string, values: Partial<UploadItem>) =>
    setItems((rows) =>
      rows.map((item) => (item.id === id ? { ...item, ...values } : item)),
    );

  const prepare = async (item: UploadItem) => {
    patch(item.id, {
      state: "Validating",
      error: undefined,
      errorTitle: undefined,
    });
    try {
      await validateFile(item.source);
      let file = item.source;
      let saved = 0;
      if (
        file.type.startsWith("image/") &&
        file.size > DOCUMENT_UPLOAD_CONFIG.IMAGE_COMPRESSION_THRESHOLD
      ) {
        patch(item.id, { state: "Compressing" });
        try {
          const optimized = await optimizeImage(file);
          file = optimized.file;
          saved = optimized.saved;
        } catch (error) {
          if (file.size > DOCUMENT_UPLOAD_CONFIG.MAX_UPLOAD_SIZE) throw error;
        }
      }
      if (file.size > DOCUMENT_UPLOAD_CONFIG.MAX_UPLOAD_SIZE)
        throw new Error(
          `Optimized file is still larger than ${formatBytes(DOCUMENT_UPLOAD_CONFIG.MAX_UPLOAD_SIZE)}. Choose a smaller image.`,
        );
      patch(item.id, {
        file,
        saved,
        optimizedSize: file.size,
        state: "Selected",
      });
    } catch (error) {
      const message = humanUploadError(
        error instanceof Error
          ? error.message
          : "Unable to validate this file.",
      );
      patch(item.id, {
        state: /supported|SVG/i.test(message) ? "Unsupported" : "Failed",
        errorTitle: /supported|SVG/i.test(message)
          ? "Unsupported file"
          : "Unable to prepare document",
        error: message,
      });
    }
  };

  const queue = async (
    files: FileList | File[],
    replacingUnsupported = false,
  ) => {
    const incoming = Array.from(files);
    if (!incoming.length) return;
    const capacity = Math.max(
      0,
      DOCUMENT_UPLOAD_CONFIG.MAX_FILES_PER_UPLOAD -
        items.length +
        (replacingUnsupported ? 1 : 0),
    );
    const selected = incoming.slice(0, replaceId ? 1 : capacity);
    if (!selected.length) return;
    setValidating(true);
    const newItems: UploadItem[] = selected.map((source) => ({
      id: crypto.randomUUID(),
      source,
      file: source,
      state: "Validating",
      progress: 0,
    }));
    setItems((rows) => [...rows, ...newItems]);
    await Promise.all(newItems.map(prepare));
    setValidating(false);
  };

  const onPicker = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const replacingUnsupported = Boolean(replaceSelection.current);
      if (replaceSelection.current) {
        const oldId = replaceSelection.current;
        replaceSelection.current = null;
        setItems((rows) => rows.filter((item) => item.id !== oldId));
      }
      void queue(event.target.files, replacingUnsupported);
    } else replaceSelection.current = null;
    event.target.value = "";
  };
  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    if (!busy && event.dataTransfer.files.length)
      void queue(event.dataTransfer.files);
  };

  const uploadReady = useMemo(
    () => items.filter((item) => item.state === "Selected"),
    [items],
  );
  const submit = async () => {
    if (!uploadReady.length || busy) return;
    setUploading(true);
    setSuccess(false);
    const results = await Promise.all(
      uploadReady.map(async (item) => {
        patch(item.id, { state: "Uploading", progress: 0 });
        try {
          const serverType = DOCUMENT_TYPE_VALUES[documentType] || documentType;
          const result = await uploadDocument(
            session,
            item.file,
            serverType,
            (loaded, total) => {
              const transferred = total > 0 && loaded >= total;
              patch(item.id, {
                state: transferred ? "Processing" : "Uploading",
                progress: transferred
                  ? 100
                  : Math.min(99, Math.round((loaded / total) * 100)),
              });
            },
            replaceId,
            item.source,
          );
          patch(item.id, {
            state: "Processing",
            progress: 100,
            saved:
              result.original_size_bytes > result.size_bytes
                ? result.original_size_bytes - result.size_bytes
                : item.saved,
            optimizedSize: result.size_bytes,
          });
          if (result.status === "READY") {
            patch(item.id, { state: "Uploaded" });
            return true;
          }
          patch(item.id, {
            state: "Failed",
            errorTitle: "Processing needs attention",
            error: `The file was stored, but processing returned ${result.status.toLowerCase()}. Retry from your document list.`,
          });
          return false;
        } catch (error) {
          const message = humanUploadError(
            error instanceof Error
              ? error.message
              : "Upload failed. Retry this file.",
          );
          patch(item.id, {
            state: "Failed",
            errorTitle: "Upload couldn't finish",
            error: message,
          });
          return false;
        }
      }),
    );
    setUploading(false);
    if (results.some(Boolean)) {
      try {
        await onUploaded();
        if (results.every(Boolean)) setSuccess(true);
      } catch {
        setItems((rows) =>
          rows.map((item) =>
            item.state === "Uploaded"
              ? {
                  ...item,
                  errorTitle: "Upload saved",
                  error:
                    "The document was uploaded, but the list couldn't refresh. Close and retry refresh.",
                }
              : item,
          ),
        );
      }
    }
  };

  const retry = (item: UploadItem) => {
    if (item.state === "Unsupported") {
      replaceSelection.current = item.id;
      picker.current?.click();
    } else void prepare(item);
  };
  const remove = (id: string) =>
    setItems((rows) => rows.filter((item) => item.id !== id));
  const displayFormat = (file: File) => extension(file.name).toUpperCase();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-7">
        {beforeUpload}
        <div
          role="group"
          tabIndex={0}
          aria-disabled={busy}
          aria-label="Choose or drop documents to upload"
          aria-describedby="document-upload-help"
          onClick={(event) => {
            if (busy) return;
            if (!(event.target as HTMLElement).closest("button"))
              picker.current?.click();
          }}
          onKeyDown={(event) => {
            if (busy || event.target !== event.currentTarget) return;
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              picker.current?.click();
            }
          }}
          onDragEnter={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node))
              setDragging(false);
          }}
          onDrop={onDrop}
          className={`group cursor-pointer rounded-lg border border-dashed px-5 py-7 text-center outline-none transition-[background-color,border-color,transform] focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:py-9 ${dragging ? "scale-[1.005] border-blue-500 bg-blue-50/80" : "border-slate-300 bg-stone-50/80 hover:border-slate-400 hover:bg-stone-50"}`}
        >
          <input
            ref={picker}
            type="file"
            className="sr-only"
            multiple={!replaceId}
            accept={DOCUMENT_UPLOAD_CONFIG.ALLOWED_EXTENSIONS.map(
              (ext) => `.${ext}`,
            ).join(",")}
            onChange={onPicker}
            aria-label="Choose files"
          />
          <span
            className={`mx-auto flex h-11 w-11 items-center justify-center rounded-lg transition-colors ${dragging ? "bg-blue-100 text-blue-700" : "bg-white text-slate-600 shadow-sm ring-1 ring-slate-200"}`}
          >
            <FileUp className="h-5 w-5" />
          </span>
          <p className="mt-3 text-sm font-semibold text-slate-900">
            {dragging ? "Drop files to upload" : "Upload your documents"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Drag and drop files here
          </p>
          <p className="my-2 text-xs text-slate-400">or</p>
          <Button
            type="button"
            variant="outline"
            className="h-9 border-slate-300 bg-white px-4 shadow-none"
            onClick={(event) => {
              event.stopPropagation();
              picker.current?.click();
            }}
            disabled={busy}
          >
            Choose files
          </Button>
          <p
            id="document-upload-help"
            className="mt-3 text-xs leading-5 text-slate-500"
          >
            PDF, JPG, JPEG, PNG or WEBP · Maximum{" "}
            {formatBytes(DOCUMENT_UPLOAD_CONFIG.MAX_UPLOAD_SIZE)} per file
          </p>
        </div>

        {items.length > 0 && (
          <section aria-label="Selected documents" className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Files</h3>
              <span className="text-xs text-slate-500">
                {items.length} of {DOCUMENT_UPLOAD_CONFIG.MAX_FILES_PER_UPLOAD}
              </span>
            </div>
            <ul className="space-y-2" aria-live="polite">
              {items.map((item) => (
                <li
                  key={item.id}
                  className={`flex min-w-0 items-start gap-3 rounded-lg border px-3.5 py-3 transition-colors ${item.state === "Failed" || item.state === "Unsupported" ? "border-amber-200 bg-amber-50/50" : "border-slate-200 bg-white"}`}
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-stone-100 text-slate-600">
                    {item.source.type.startsWith("image/") ? (
                      <FileImage className="h-4 w-4" />
                    ) : (
                      <FileText className="h-4 w-4" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="break-all text-sm font-medium leading-5 text-slate-900">
                      {item.source.name}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {displayFormat(item.source)} ·{" "}
                      {formatBytes(item.source.size)}
                      {item.saved
                        ? ` · Optimized to ${formatBytes(item.optimizedSize || item.file.size)} (saved ${Math.round((item.saved / item.source.size) * 100)}%)`
                        : ""}
                    </p>
                    <div
                      className="mt-1.5 flex items-center gap-1.5 text-xs"
                      role={item.error ? "alert" : "status"}
                    >
                      {item.state === "Selected" && (
                        <>
                          <Check className="h-3.5 w-3.5 text-teal-700" />
                          <span className="text-slate-700">
                            Selected · Ready to upload
                          </span>
                        </>
                      )}
                      {item.state === "Validating" && (
                        <>
                          <LoaderCircle className="h-3.5 w-3.5 animate-spin text-slate-500" />
                          <span className="text-slate-600">
                            Checking document…
                          </span>
                        </>
                      )}
                      {item.state === "Compressing" && (
                        <>
                          <LoaderCircle className="h-3.5 w-3.5 animate-spin text-slate-500" />
                          <span className="text-slate-600">
                            Optimizing document…
                          </span>
                        </>
                      )}
                      {item.state === "Uploading" && (
                        <>
                          <LoaderCircle className="h-3.5 w-3.5 animate-spin text-blue-700" />
                          <span className="text-slate-700">
                            Uploading · {item.progress}%
                          </span>
                        </>
                      )}
                      {item.state === "Processing" && (
                        <>
                          <LoaderCircle className="h-3.5 w-3.5 animate-spin text-slate-500" />
                          <span className="text-slate-600">
                            {item.source.type === "application/pdf" &&
                            item.source.size >
                              DOCUMENT_UPLOAD_CONFIG.PDF_COMPRESSION_THRESHOLD
                              ? "Optimizing PDF and processing document…"
                              : "Processing document…"}
                          </span>
                        </>
                      )}
                      {item.state === "Uploaded" && (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-teal-700" />
                          <span className="font-medium text-teal-800">
                            Uploaded · Verification may still be pending
                          </span>
                        </>
                      )}
                      {(item.state === "Failed" ||
                        item.state === "Unsupported") && (
                        <>
                          <span className="font-medium text-amber-900">
                            {item.errorTitle}
                          </span>
                          <span className="text-amber-900">— {item.error}</span>
                        </>
                      )}
                    </div>
                    {(item.state === "Uploading" ||
                      item.state === "Processing") && (
                      <div
                        className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"
                        role="progressbar"
                        aria-label={`Uploading ${item.source.name}`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={item.progress}
                      >
                        <div
                          className="h-full bg-blue-600 transition-[width]"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {(item.state === "Failed" ||
                      item.state === "Unsupported") && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label={`${item.state === "Unsupported" ? "Choose another file instead of" : "Retry"} ${item.source.name}`}
                        onClick={() => retry(item)}
                      >
                        {item.state === "Unsupported" ? (
                          <FileUp className="h-4 w-4" />
                        ) : (
                          <RotateCcw className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                    {!busy && item.state !== "Uploaded" && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-slate-900"
                        aria-label={`Remove ${item.source.name}`}
                        onClick={() => remove(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {success && (
          <div
            className="rounded-lg border border-teal-200 bg-teal-50 p-3.5"
            role="status"
          >
            <p className="flex items-center gap-2 text-sm font-semibold text-teal-900">
              <CheckCircle2 className="h-4 w-4" />
              Documents uploaded
            </p>
            <p className="mt-1 text-sm text-teal-800">
              Your documents are now available in My Documents.
            </p>
          </div>
        )}
      </div>

      <footer className="flex shrink-0 flex-col-reverse gap-3 border-t bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <p className="text-xs text-slate-500" aria-live="polite">
          {items.length
            ? `${items.length} file${items.length === 1 ? "" : "s"} selected`
            : "Choose files to begin"}
          {items.some(
            (item) => item.state === "Failed" || item.state === "Unsupported",
          )
            ? ` · ${items.filter((item) => item.state === "Failed" || item.state === "Unsupported").length} need attention`
            : ""}
        </p>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          {success ? (
            <Button type="button" onClick={onComplete}>
              Done
            </Button>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                className="border-slate-300"
                onClick={onCancel ?? onComplete}
                disabled={busy}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => void submit()}
                disabled={!uploadReady.length || busy}
                className="min-w-40"
              >
                {uploading ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    Uploading…
                  </>
                ) : (
                  "Upload documents"
                )}
              </Button>
            </>
          )}
        </div>
      </footer>
    </div>
  );
}
