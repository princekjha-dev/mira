import { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  FileText,
  X,
  Sparkles,
  ShieldCheck,
  CornerDownRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ReplyComposerProps {
  recipientName: string;
  recipientEmail: string;
  recipientRole?: string;
  applicationId?: string;
  onSend: (text: string, attachments?: File[]) => Promise<void> | void;
  isSending?: boolean;
}

export function ReplyComposer({
  recipientName,
  recipientEmail,
  recipientRole,
  applicationId,
  onSend,
  isSending = false,
}: ReplyComposerProps) {
  const [text, setText] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Quick reply snippets for quick civil workflow responses
  const quickTemplates = [
    "Clarification verified. Updated document is attested in records.",
    "Please submit the stamped original certificate at your nearest Tehsil center.",
    "Inspection scheduled as per protocol. Household confirmation received.",
    "Noted and recorded in official verification ledger.",
  ];

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setAttachedFiles((prev) => [...prev, ...files]);
      toast.success(`${files.length} document(s) attached`);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isSending) return;

    try {
      await onSend(text.trim(), attachedFiles);
      setText("");
      setAttachedFiles([]);
    } catch (err) {
      toast.error("Failed to dispatch reply");
    }
  };

  const handleInsertTemplate = (snippet: string) => {
    setText((prev) => (prev ? `${prev} ${snippet}` : snippet));
    textareaRef.current?.focus();
  };

  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-200 bg-white dark:bg-slate-900/90 shadow-2xs",
        isFocused
          ? "border-gov/60 ring-2 ring-gov/15 dark:ring-gov/30 shadow-xs"
          : "border-slate-200/80 dark:border-slate-800",
      )}
    >
      <form onSubmit={handleSubmit} className="flex flex-col">
        {/* Subtle recipient header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 px-4 py-2 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CornerDownRight className="h-3.5 w-3.5 text-gov" />
            <span>Reply to</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {recipientName}
            </span>
            <span className="text-[11px] text-muted-foreground/70">
              ({recipientEmail})
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">
              Official record · Recorded in audit history
            </span>
            <span className="sm:hidden">Official Record</span>
          </div>
        </div>

        {/* Text Area */}
        <div className="p-3">
          <Textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={`Type clarification, dispatch notes, or official reply to ${recipientName}…`}
            rows={3}
            className="w-full resize-none border-0 bg-transparent p-1 text-xs leading-relaxed text-slate-900 placeholder:text-muted-foreground focus-visible:ring-0 dark:text-slate-100 min-h-[72px]"
          />
        </div>

        {/* Attached files pills */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-3 pb-2">
            {attachedFiles.map((f, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
              >
                <Paperclip className="h-3 w-3 text-gov" />
                <span className="max-w-[140px] truncate">{f.name}</span>
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
        )}

        {/* Action footer */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 px-3 py-2 bg-slate-50/40 dark:bg-slate-900/40 rounded-b-2xl">
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
              className="h-8 px-2.5 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 font-medium"
            >
              <Paperclip className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
              Attach
            </Button>

            {/* Quick Template Inserter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2.5 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 font-medium"
                >
                  <Sparkles className="mr-1.5 h-3.5 w-3.5 text-gov" />
                  Insert
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-72 text-xs">
                <DropdownMenuLabel className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Official Standard Clauses
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {quickTemplates.map((t, idx) => (
                  <DropdownMenuItem
                    key={idx}
                    onClick={() => handleInsertTemplate(t)}
                    className="text-xs cursor-pointer py-1.5"
                  >
                    {t}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button
            type="submit"
            size="sm"
            disabled={!text.trim() || isSending}
            className="h-8 px-3.5 text-xs font-medium gap-1.5 bg-gov text-white hover:bg-gov/90 shadow-2xs disabled:opacity-50"
          >
            {isSending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Sending…
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                Send
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
