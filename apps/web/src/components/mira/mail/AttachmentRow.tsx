import { useState } from "react";
import {
  FileText,
  FileImage,
  FileSpreadsheet,
  FileCheck,
  Download,
  Eye,
  X,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { type MailAttachment } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface AttachmentRowProps {
  attachment: MailAttachment;
  onPreview?: (attachment: MailAttachment) => void;
}

export function AttachmentRow({ attachment, onPreview }: AttachmentRowProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const getFileIcon = (name: string, type?: string) => {
    const ext = name.split(".").pop()?.toLowerCase();
    if (ext === "pdf" || type?.includes("pdf")) {
      return <FileText className="h-4 w-4 text-rose-500 shrink-0" />;
    }
    if (["png", "jpg", "jpeg", "webp"].includes(ext || "") || type?.includes("image")) {
      return <FileImage className="h-4 w-4 text-emerald-500 shrink-0" />;
    }
    if (["xlsx", "csv", "xls"].includes(ext || "") || type?.includes("sheet")) {
      return <FileSpreadsheet className="h-4 w-4 text-teal-600 shrink-0" />;
    }
    return <FileCheck className="h-4 w-4 text-slate-500 shrink-0" />;
  };

  const handleOpen = () => {
    if (onPreview) {
      onPreview(attachment);
    } else {
      setIsPreviewOpen(true);
    }
  };

  const handleDownload = () => {
    toast.success(`Downloading ${attachment.name}`, {
      description: `${Math.round(attachment.size / 1024)} KB · Verified secure attachment`,
    });
  };

  return (
    <>
      <div className="group flex items-center justify-between gap-3 rounded-lg border border-slate-200/70 bg-slate-50/60 px-3 py-2 text-xs transition-colors hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800/80 dark:bg-slate-900/40 dark:hover:bg-slate-800/60">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-white shadow-2xs dark:bg-slate-800">
            {getFileIcon(attachment.name, attachment.type)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900 dark:text-slate-100">
              {attachment.name}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {Math.round(attachment.size / 1024)} KB · Official attachment
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleOpen}
            className="h-7 px-2 text-[11px] font-medium text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
          >
            <Eye className="mr-1 h-3 w-3" />
            Open
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="h-7 px-2 text-[11px] font-medium text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
          >
            <Download className="mr-1 h-3 w-3" />
            Download
          </Button>
        </div>
      </div>

      {/* Inline Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <DialogHeader className="border-b border-border/80 px-5 py-3.5 flex flex-row items-center justify-between space-y-0 bg-slate-50/50 dark:bg-slate-900/50">
            <div>
              <DialogTitle className="text-sm font-semibold flex items-center gap-2">
                {getFileIcon(attachment.name, attachment.type)}
                <span>{attachment.name}</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {Math.round(attachment.size / 1024)} KB · Recorded in verification audit trail
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2 pr-6">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="h-3 w-3" />
                Verified Signature
              </span>
            </div>
          </DialogHeader>

          <div className="p-6 bg-slate-100/60 dark:bg-slate-950/60 flex flex-col items-center justify-center min-h-[340px]">
            <div className="w-full max-w-md rounded-xl border border-border/70 bg-white dark:bg-slate-900 p-6 shadow-sm text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                {getFileIcon(attachment.name, attachment.type)}
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {attachment.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  Official Public Records Department Document Specification
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3 text-left text-xs space-y-1.5 border border-border/60">
                <div className="flex justify-between text-muted-foreground">
                  <span>File size:</span>
                  <span className="font-mono text-foreground font-medium">
                    {Math.round(attachment.size / 1024)} KB
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Format:</span>
                  <span className="font-mono text-foreground font-medium uppercase">
                    {attachment.type || "application/pdf"}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Audit Seal:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                    SHA256: 4b2f…9e81
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => {
                    handleDownload();
                    setIsPreviewOpen(false);
                  }}
                >
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Save Copy
                </Button>
                <Button
                  size="sm"
                  className="flex-1 text-xs bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900"
                  onClick={() => {
                    toast.success("Document opened in secure viewer tab");
                    setIsPreviewOpen(false);
                  }}
                >
                  <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                  Full Viewer
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
