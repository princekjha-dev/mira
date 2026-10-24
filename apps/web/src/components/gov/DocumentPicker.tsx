import { useMemo, useState } from "react";
import { Check, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentUploader } from "./DocumentUploader";
import { DocumentViewer } from "./DocumentViewer";
import type { Session } from "@/lib/app-state";
import type { ApiDocument } from "@/lib/api";
import { formatBytes } from "@/lib/document-config";
import type { UploadedDoc } from "./DocUpload";

interface Props {
  session?: Session | null;
  documents: ApiDocument[];
  docType: string;
  required?: boolean;
  value?: UploadedDoc;
  onChange: (document?: UploadedDoc) => void;
  onUploaded: () => Promise<ApiDocument[]>;
}

function matchesRequirement(doc: ApiDocument, required: string) {
  const text = `${doc.document_type} ${doc.original_filename}`
    .toLowerCase()
    .replaceAll("_", " ");
  const requirement = required.toLowerCase();
  if (requirement.includes("income")) return text.includes("income");
  if (requirement.includes("aadhaar") || requirement.includes("identity"))
    return text.includes("identity") || text.includes("aadhaar");
  if (requirement.includes("residence") || requirement.includes("address"))
    return text.includes("residence") || text.includes("address");
  if (requirement.includes("bpl"))
    return text.includes("bpl") || text.includes("economic");
  if (requirement.includes("birth")) return text.includes("birth");
  if (requirement.includes("property") || requirement.includes("land"))
    return text.includes("property") || text.includes("land");
  if (requirement.includes("bank")) return text.includes("bank");
  return text.includes(requirement);
}

function categoryFor(requirement: string) {
  const text = requirement.toLowerCase();
  if (text.includes("income")) return "Income";
  if (text.includes("aadhaar") || text.includes("identity")) return "Identity";
  if (text.includes("residence") || text.includes("address")) return "Address";
  if (text.includes("bpl")) return "BPL / Economic Status";
  if (text.includes("birth")) return "Birth";
  if (text.includes("property")) return "Property";
  if (text.includes("land")) return "Land";
  if (text.includes("bank")) return "Bank";
  return "Scheme-specific";
}

export function DocumentPicker({
  session,
  documents,
  docType,
  required,
  value,
  onChange,
  onUploaded,
}: Props) {
  const [showUpload, setShowUpload] = useState(false);
  const [preview, setPreview] = useState<ApiDocument | null>(null);
  const options = useMemo(
    () =>
      documents.filter(
        (doc) => doc.status === "READY" && matchesRequirement(doc, docType),
      ),
    [documents, docType],
  );
  const selected = options.find((doc) => doc.id === value?.documentId);

  const choose = (doc: ApiDocument) =>
    onChange({
      name: doc.original_filename,
      size: doc.size_bytes,
      url: "",
      result:
        doc.verification_status === "VERIFIED"
          ? "Verified"
          : doc.verification_status === "REJECTED"
            ? "Unreadable document"
            : "Manual verification required",
      documentId: doc.id,
      versionId: doc.id,
    });

  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            {docType}
            {required && <span className="ml-1 text-red-600">*</span>}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Choose a secure document already in your library or upload one.
          </p>
        </div>
        <FileText className="h-5 w-5 text-slate-400" />
      </div>
      {selected ? (
        <div className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-stone-50 p-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {selected.original_filename}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              {formatBytes(selected.size_bytes)} ·{" "}
              {selected.verification_status === "VERIFIED"
                ? "Verified"
                : "Review required"}{" "}
              · Version {selected.version_number || 1}
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(undefined)}
          >
            Remove
          </Button>
        </div>
      ) : options.length ? (
        <ul className="mt-3 space-y-2">
          {options.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center gap-2 rounded-lg border p-2.5"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {doc.original_filename}
                </p>
                <p className="text-xs text-slate-500">
                  {formatBytes(doc.size_bytes)} ·{" "}
                  {new Date(doc.created_at).toLocaleDateString("en-IN")} ·{" "}
                  {doc.verification_status === "VERIFIED"
                    ? "Verified"
                    : "Review required"}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setPreview(doc)}
              >
                View
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => choose(doc)}
              >
                <Check className="mr-1 h-3.5 w-3.5" />
                Use
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 rounded-lg bg-stone-50 p-3 text-xs text-slate-500">
          No matching document in My Documents yet.
        </p>
      )}
      {session && (
        <div className="mt-3">
          {showUpload ? (
            <div className="space-y-2">
              <DocumentUploader
                session={session}
                documentType={categoryFor(docType)}
                onUploaded={async () => {
                  const updated = await onUploaded();
                  const match = updated.find((doc) =>
                    matchesRequirement(doc, docType),
                  );
                  if (match) choose(match);
                }}
                onComplete={() => setShowUpload(false)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowUpload(false)}
              >
                Close uploader
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowUpload(true)}
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Upload document
            </Button>
          )}
        </div>
      )}
      {preview && session && (
        <DocumentViewer
          document={preview}
          session={session}
          onClose={() => setPreview(null)}
          onChanged={() => void onUploaded()}
        />
      )}
    </div>
  );
}
