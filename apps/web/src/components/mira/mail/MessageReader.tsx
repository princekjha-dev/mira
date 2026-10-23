import { useState, useRef } from "react";
import {
  Star,
  Archive,
  MoreVertical,
  Reply,
  ArrowLeft,
  Mail,
  ShieldCheck,
  Copy,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { type MessageThread, type MailAttachment } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConversationThread } from "./ConversationThread";
import { ReplyComposer } from "./ReplyComposer";
import { formatFullMailDate } from "./types";
import { cn } from "@/lib/utils";

interface MessageReaderProps {
  thread: MessageThread | null;
  onBackToMobileList?: () => void;
  onToggleStar: (threadId: string) => void;
  onArchive: (threadId: string) => void;
  onMarkUnread?: (threadId: string) => void;
  onSendReply: (text: string, files?: File[]) => Promise<void> | void;
  onAttachmentPreview?: (attachment: MailAttachment) => void;
  replyRef?: React.RefObject<HTMLDivElement | null>;
}

export function MessageReader({
  thread,
  onBackToMobileList,
  onToggleStar,
  onArchive,
  onMarkUnread,
  onSendReply,
  onAttachmentPreview,
  replyRef,
}: MessageReaderProps) {
  const [isSending, setIsSending] = useState(false);

  if (!thread) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-xs text-muted-foreground min-h-[400px]">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
          <Mail className="h-7 w-7" />
        </div>
        <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
          Select a communication thread
        </h3>
        <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">
          Choose an official message or query from the list to review determinations and compose replies.
        </p>
      </div>
    );
  }

  const handleCopyAppId = () => {
    if (thread.applicationId) {
      navigator.clipboard.writeText(thread.applicationId);
      toast.success("Application ID copied to clipboard");
    }
  };

  const handleReplyDispatch = async (text: string, files?: File[]) => {
    setIsSending(true);
    try {
      await onSendReply(text, files);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-slate-900">
      {/* Top Header & Actions Bar */}
      <header className="border-b border-slate-200/80 dark:border-slate-800 px-6 py-4 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5 min-w-0 flex-1">
            {/* Mobile Back Button */}
            {onBackToMobileList && (
              <button
                type="button"
                onClick={onBackToMobileList}
                className="md:hidden flex items-center gap-1 text-xs text-gov font-medium mb-1 hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Messages
              </button>
            )}

            {/* Subject Title */}
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {thread.subject}
            </h1>

            {/* Sender and Department Context */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {thread.sender.name}
              </span>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span className="capitalize">{thread.sender.role}</span>
              {thread.sender.department && (
                <>
                  <span className="text-slate-300 dark:text-slate-600">·</span>
                  <span>{thread.sender.department}</span>
                </>
              )}
            </div>

            {/* Timestamp & Application Reference Pill */}
            <div className="flex items-center gap-2.5 pt-0.5">
              <time className="text-[11px] text-muted-foreground font-mono tabular-nums">
                {formatFullMailDate(thread.timestamp)}
              </time>

              {thread.applicationId && (
                <button
                  type="button"
                  onClick={handleCopyAppId}
                  className="inline-flex items-center gap-1 font-mono text-[10px] text-gov font-semibold px-2 py-0.5 rounded-full bg-gov/10 border border-gov/20 hover:bg-gov/20 transition-colors"
                  title="Click to copy Application ID"
                >
                  <span>{thread.applicationId}</span>
                  <Copy className="h-2.5 w-2.5 opacity-60" />
                </button>
              )}

              {/* Official Record Seal */}
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="h-3 w-3" />
                <span>Recorded in audit history</span>
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleStar(thread.id)}
              className="h-8 w-8 text-slate-500 hover:text-amber-500 rounded-lg"
              title={thread.isStarred ? "Starred" : "Star"}
            >
              <Star
                className={cn(
                  "h-4 w-4",
                  thread.isStarred && "fill-amber-400 text-amber-500"
                )}
              />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onArchive(thread.id)}
              className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg"
              title="Archive thread"
            >
              <Archive className="h-4 w-4" />
            </Button>

            {/* More Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 text-xs">
                {onMarkUnread && (
                  <DropdownMenuItem
                    onClick={() => {
                      onMarkUnread(thread.id);
                      toast.success("Thread marked as unread");
                    }}
                  >
                    Mark as Unread
                  </DropdownMenuItem>
                )}
                {thread.applicationId && (
                  <DropdownMenuItem onClick={handleCopyAppId}>
                    Copy Application Reference
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    toast.info(`Audit Log: Immutable event ${thread.id} timestamped.`);
                  }}
                >
                  View Cryptographic Proof
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Continuous Reading Area */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 scrollbar-thin">
        {/* Thread of Messages */}
        <ConversationThread
          messages={thread.messages}
          onAttachmentPreview={onAttachmentPreview}
        />

        {/* Embedded Native Reply Composer */}
        <div ref={replyRef} className="pt-2">
          <ReplyComposer
            recipientName={thread.sender.name}
            recipientEmail={thread.sender.email}
            recipientRole={thread.sender.role}
            applicationId={thread.applicationId}
            onSend={handleReplyDispatch}
            isSending={isSending}
          />
        </div>
      </div>
    </div>
  );
}
