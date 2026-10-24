import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Eye,
  FileUp,
  ImageUp,
  Loader2,
  RefreshCw,
  Trash2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { inr } from "@/lib/data";
import { cn } from "@/lib/utils";

export const PIPELINE = [
  "Uploading",
  "Reading document",
  "Extracting information",
  "Checking format",
  "Validating information",
  "Complete",
];
export type DocResult =
  | "Verified"
  | "Missing information"
  | "Mismatch detected"
  | "Unreadable document"
  | "Expired document"
  | "Manual verification required";

export interface UploadedDoc {
  name: string;
  size: number;
  url: string;
  result: DocResult;
  documentId?: string;
  versionId?: string;
  mismatch?: { field: string; declared: string; document: string };
}

export function decideResult(
  docType: string,
  file: { name: string; type: string },
  declaredIncome?: number,
): Pick<UploadedDoc, "result" | "mismatch"> {
  const ok = file.type === "application/pdf" || file.type.startsWith("image/");
  if (!ok) return { result: "Unreadable document" };
  const n = file.name.toLowerCase();
  if (n.includes("expired") || n.includes("2019"))
    return { result: "Expired document" };
  if (
    docType === "Income Certificate" &&
    declaredIncome !== undefined &&
    declaredIncome !== 145000
  )
    return {
      result: "Mismatch detected",
      mismatch: {
        field: "Annual household income",
        declared: inr(declaredIncome),
        document: inr(145000),
      },
    };
  if (docType.startsWith("Property"))
    return { result: "Manual verification required" };
  return { result: "Verified" };
}

const resultUi: Record<
  DocResult,
  { icon: typeof CheckCircle2; cls: string; msg: string }
> = {
  Verified: {
    icon: CheckCircle2,
    cls: "text-success",
    msg: "Document details match your records.",
  },
  "Missing information": {
    icon: AlertTriangle,
    cls: "text-warning",
    msg: "Some required fields could not be found. Please upload a complete copy.",
  },
  "Mismatch detected": {
    icon: AlertTriangle,
    cls: "text-warning",
    msg: "Values do not match. Please review or submit supporting evidence.",
  },
  "Unreadable document": {
    icon: XCircle,
    cls: "text-destructive",
    msg: "We could not read this file. Upload a clear PDF, JPG or PNG.",
  },
  "Expired document": {
    icon: AlertTriangle,
    cls: "text-warning",
    msg: "This document appears to be expired. Please upload a current copy.",
  },
  "Manual verification required": {
    icon: AlertTriangle,
    cls: "text-gov",
    msg: "An officer will verify this document manually. No action needed now.",
  },
};

export function DocUploadCard({
  docType,
  required,
  declaredIncome,
  value,
  onChange,
}: {
  docType: string;
  required?: boolean;
  declaredIncome?: number;
  value?: UploadedDoc;
  onChange: (d: UploadedDoc | undefined) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const camRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState(-1);
  const [pct, setPct] = useState(0);
  const [pending, setPending] = useState<File | null>(null);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (!pending) return;
    let s = 0;
    let p = 0;
    setStage(0);
    setPct(0);
    const iv = setInterval(() => {
      if (s === 0) {
        p += 20;
        setPct(p);
        if (p >= 100) {
          s = 1;
          setStage(1);
        }
        return;
      }
      s += 1;
      setStage(s);
      if (s >= 5) {
        clearInterval(iv);
        const r = decideResult(docType, pending, declaredIncome);
        onChange({
          name: pending.name,
          size: pending.size,
          url: URL.createObjectURL(pending),
          ...r,
        });
        if (r.result === "Verified") toast.success(`${docType} verified`);
        else toast.warning(`${docType}: ${r.result}`);
        setPending(null);
      }
    }, 350);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending]);

  const pick = (f?: File) => {
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      toast.error("File is larger than 5 MB");
      return;
    }
    setPending(f);
  };
  const busy = pending !== null;
  const r = value ? resultUi[value.result] : null;

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-4",
        value?.result === "Mismatch detected" && "border-warning/60",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium">{docType}</p>
          <p className="text-xs text-muted-foreground">
            {required ? "Required" : "Optional"} · PDF, JPG or PNG up to 5 MB
          </p>
        </div>
        {value && r && (
          <span
            className={cn("flex items-center gap-1 text-xs font-medium", r.cls)}
          >
            <r.icon className="h-4 w-4" />
            {value.result}
          </span>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="application/pdf,image/*"
        className="hidden"
        onChange={(e) => {
          pick(e.target.files?.[0]);
          e.target.value = "";
        }}
        aria-label={`Upload ${docType}`}
      />
      <input
        ref={camRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          pick(e.target.files?.[0]);
          e.target.value = "";
        }}
        aria-label={`Capture ${docType}`}
      />
      {busy && (
        <div className="mt-3 space-y-2" aria-live="polite">
          <p className="truncate text-sm">
            {pending.name} · {(pending.size / 1024).toFixed(0)} KB
          </p>
          {stage === 0 && <Progress value={pct} />}
          <ol className="grid grid-cols-2 gap-1 text-xs sm:grid-cols-3">
            {PIPELINE.map((p, i) => (
              <li
                key={p}
                className={cn(
                  "flex items-center gap-1",
                  i < stage
                    ? "text-success"
                    : i === stage
                      ? "font-medium text-navy"
                      : "text-muted-foreground",
                )}
              >
                {i < stage ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : i === stage ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <span className="h-3 w-3 rounded-full border" />
                )}
                {p}
              </li>
            ))}
          </ol>
        </div>
      )}
      {!busy && value && r && (
        <div className="mt-3 space-y-2">
          <p className="truncate text-sm">
            {value.name} · {(value.size / 1024).toFixed(0)} KB
          </p>
          <p className="text-xs text-muted-foreground">{r.msg}</p>
          {value.mismatch && (
            <div className="rounded-md border border-warning/50 bg-warning/10 p-3 text-sm">
              <p className="font-medium">Field: {value.mismatch.field}</p>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">Application</p>
                  <p className="font-semibold">{value.mismatch.declared}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{docType}</p>
                  <p className="font-semibold">{value.mismatch.document}</p>
                </div>
              </div>
              <p className="mt-2 text-xs">
                Income values do not match. Please review or submit supporting
                evidence. Your application will not be rejected for this — it
                will be reviewed by an officer.
              </p>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPreview(true)}
            >
              <Eye className="mr-1 h-3.5 w-3.5" />
              Preview
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileRef.current?.click()}
            >
              <RefreshCw className="mr-1 h-3.5 w-3.5" />
              Replace
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                onChange(undefined);
                toast.info(`${docType} removed`);
              }}
            >
              <Trash2 className="mr-1 h-3.5 w-3.5" />
              Remove
            </Button>
          </div>
        </div>
      )}
      {!busy && !value && (
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => fileRef.current?.click()}
          >
            <FileUp className="mr-1 h-3.5 w-3.5" />
            Upload PDF
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => fileRef.current?.click()}
          >
            <ImageUp className="mr-1 h-3.5 w-3.5" />
            Upload image
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => camRef.current?.click()}
          >
            <Camera className="mr-1 h-3.5 w-3.5" />
            Mobile capture
          </Button>
        </div>
      )}
      <Dialog open={preview} onOpenChange={setPreview}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{value?.name}</DialogTitle>
          </DialogHeader>
          {value &&
            (value.name.toLowerCase().endsWith(".pdf") ? (
              <iframe
                src={value.url}
                title={value.name}
                className="h-[70vh] w-full rounded border"
              />
            ) : (
              <img
                src={value.url}
                alt={docType}
                className="max-h-[70vh] w-full object-contain"
              />
            ))}
        </DialogContent>
      </Dialog>
    </div>
  );
}
