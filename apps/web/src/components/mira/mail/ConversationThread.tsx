import { useState } from "react";
import { ChevronDown, ChevronUp, User, Paperclip } from "lucide-react";
import { type MailMessage, type MailAttachment } from "@/lib/data";
import { AttachmentRow } from "./AttachmentRow";
import { formatFullMailDate } from "./types";
import { cn } from "@/lib/utils";

interface ConversationThreadProps {
  messages: MailMessage[];
  onAttachmentPreview?: (attachment: MailAttachment) => void;
}

export function ConversationThread({
  messages,
  onAttachmentPreview,
}: ConversationThreadProps) {
  // If multiple messages, keep all except the last one collapsible (default collapsed if >= 2)
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>(
    () => {
      const init: Record<string, boolean> = {};
      if (messages.length > 1) {
        // expand the latest message by default
        const latest = messages[messages.length - 1];
        if (latest) init[latest.id] = true;
      } else if (messages[0]) {
        init[messages[0].id] = true;
      }
      return init;
    },
  );

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case "verifier":
        return "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20";
      case "officer":
        return "bg-gov/10 text-gov border-gov/20";
      case "admin":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20";
      case "auditor":
        return "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20";
      case "citizen":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300";
    }
  };

  const getAvatarInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (name[0] || "M").toUpperCase();
  };

  return (
    <div className="space-y-4">
      {messages.map((msg, index) => {
        const isLatest = index === messages.length - 1;
        const isExpanded = expandedIds[msg.id] ?? isLatest;
        const hasAttachments = msg.attachments && msg.attachments.length > 0;

        if (!isExpanded && !isLatest) {
          // Collapsed preview row
          return (
            <button
              key={msg.id}
              type="button"
              onClick={() => toggleExpand(msg.id)}
              className="w-full text-left flex items-center justify-between p-3 rounded-xl border border-slate-200/60 bg-slate-50/50 hover:bg-slate-100/60 dark:border-slate-800/80 dark:bg-slate-900/30 dark:hover:bg-slate-800/50 transition-colors duration-150"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200/80 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300 shrink-0">
                  {getAvatarInitials(msg.senderName)}
                </div>
                <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                  {msg.senderName}
                </span>
                <span className="text-[11px] text-muted-foreground truncate max-w-sm hidden sm:inline">
                  — {msg.body}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0 text-muted-foreground">
                {hasAttachments && (
                  <Paperclip className="h-3 w-3 text-slate-400" />
                )}
                <span className="text-[11px] font-mono tabular-nums">
                  {formatFullMailDate(msg.timestamp)}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </div>
            </button>
          );
        }

        // Expanded full message surface
        return (
          <article
            key={msg.id}
            className={cn(
              "rounded-2xl border transition-all duration-150 p-5 space-y-3",
              isLatest
                ? "bg-white dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800 shadow-2xs"
                : "bg-slate-50/40 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60",
            )}
          >
            {/* Sender and timestamp header */}
            <header className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 ring-1 ring-border/50 shrink-0">
                  {getAvatarInitials(msg.senderName)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                      {msg.senderName}
                    </h3>
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.2 text-[10px] font-mono uppercase font-medium border",
                        getRoleBadge(msg.senderRole),
                      )}
                    >
                      {msg.senderRole}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {msg.senderEmail}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <time className="text-[11px] text-muted-foreground font-mono tabular-nums">
                  {formatFullMailDate(msg.timestamp)}
                </time>
                {messages.length > 1 && (
                  <button
                    type="button"
                    onClick={() => toggleExpand(msg.id)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
                    aria-label="Toggle message expansion"
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>
                )}
              </div>
            </header>

            {/* Message Body */}
            <div className="max-w-3xl text-[14px] sm:text-[15px] leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap py-1">
              {msg.body}
            </div>

            {/* Attachments Section */}
            {hasAttachments && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider font-mono">
                  <Paperclip className="h-3 w-3" />
                  <span>Attachments ({msg.attachments!.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {msg.attachments!.map((att) => (
                    <AttachmentRow
                      key={att.id}
                      attachment={att}
                      onPreview={onAttachmentPreview}
                    />
                  ))}
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
