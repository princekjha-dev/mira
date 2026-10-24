import { useState, useRef } from "react";
import {
  Send,
  X,
  Paperclip,
  ShieldCheck,
  Sparkles,
  Loader2,
  FileText,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ComposeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSend: (message: {
    toEmail: string;
    subject: string;
    body: string;
    applicationId?: string;
  }) => Promise<void> | void;
  defaultApplicationId?: string;
}

export function ComposeSheet({
  open,
  onOpenChange,
  onSend,
  defaultApplicationId = "",
}: ComposeSheetProps) {
  const [toEmail, setToEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [applicationId, setApplicationId] = useState(defaultApplicationId);
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Suggested official dispatch contacts for auto-completion
  const suggestions = [
    { label: "Citizen Desk", email: "citizen@mira.local" },
    { label: "Verification Cell", email: "verifier@mira.local" },
    { label: "Field Inspection Unit", email: "officer@mira.local" },
    { label: "State Administration", email: "admin@mira.local" },
    { label: "Audit Oversight", email: "auditor@mira.local" },
  ];

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...files]);
      toast.success(`${files.length} document(s) attached to dispatch`);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toEmail.trim() || !subject.trim() || !body.trim() || isSending) {
      toast.error("Please fill in recipient, subject, and message content.");
      return;
    }

    setIsSending(true);
    try {
      await onSend({
        toEmail: toEmail.trim(),
        subject: subject.trim(),
        body: body.trim(),
        applicationId: applicationId.trim() || undefined,
      });

      toast.success("Official dispatch recorded", {
        description: `Dispatched to ${toEmail.trim()} with verifiable audit receipt`,
      });

      // Reset
      setToEmail("");
      setSubject("");
      setApplicationId("");
      setBody("");
      setAttachments([]);
      onOpenChange(false);
    } catch (err) {
      toast.error("Could not send dispatch");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-2xl border border-slate-200/80 shadow-2xl dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        <DialogHeader className="border-b border-border/80 px-5 py-3.5 flex flex-row items-center justify-between space-y-0 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gov/10 text-gov">
              <Send className="h-3.5 w-3.5" />
            </div>
            <DialogTitle className="text-sm font-semibold">
              New Official Communication
            </DialogTitle>
          </div>

          <div className="flex items-center gap-2 pr-6">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              Verifiable Record
            </span>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="p-5 space-y-3.5 text-xs">
            {/* Recipient Input */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Recipient
                </label>
                <div className="flex gap-1.5 overflow-x-auto py-0.5">
                  {suggestions.slice(0, 3).map((s) => (
                    <button
                      key={s.email}
                      type="button"
                      onClick={() => setToEmail(s.email)}
                      className="text-[10px] text-gov hover:underline shrink-0"
                    >
                      +{s.label}
                    </button>
                  ))}
                </div>
              </div>
              <Input
                type="email"
                required
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                placeholder="citizen@mira.local or verifier@mira.local"
                className="h-9 text-xs rounded-lg"
              />
            </div>

            {/* Subject */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-800 dark:text-slate-200">
                Subject
              </label>
              <Input
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Additional Evidence: Ration Card Verification"
                className="h-9 text-xs rounded-lg"
              />
            </div>

            {/* Related Application ID (optional) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Application Context (Optional)
                </label>
                <span className="text-[10px] text-muted-foreground">
                  e.g. APP-2026-000318
                </span>
              </div>
              <Input
                value={applicationId}
                onChange={(e) => setApplicationId(e.target.value)}
                placeholder="APP-2026-XXXXXX"
                className="h-9 text-xs font-mono rounded-lg"
              />
            </div>

            {/* Message Body */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-800 dark:text-slate-200">
                Official Message
              </label>
              <Textarea
                required
                rows={5}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Type official determination, citizen query clarification, or supervisor notice…"
                className="text-xs leading-relaxed rounded-lg min-h-[110px]"
              />
            </div>

            {/* Attached Files List */}
            {attachments.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase font-mono">
                  Attached Documents ({attachments.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {attachments.map((f, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
                    >
                      <Paperclip className="h-3 w-3 text-gov" />
                      <span className="max-w-[160px] truncate">{f.name}</span>
                      <button
                        type="button"
                        onClick={() => removeAttachment(i)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dialog Footer */}
          <div className="flex items-center justify-between border-t border-border/80 px-5 py-3 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                className="hidden"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleAttachClick}
                className="h-8 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              >
                <Paperclip className="mr-1.5 h-3.5 w-3.5" />
                Attach File
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={
                  isSending ||
                  !toEmail.trim() ||
                  !subject.trim() ||
                  !body.trim()
                }
                className="h-8 text-xs bg-gov text-white hover:bg-gov/90 gap-1.5 font-medium shadow-2xs"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Recording…
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    Dispatch Message
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
