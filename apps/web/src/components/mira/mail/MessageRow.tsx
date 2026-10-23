import { Star, Paperclip } from "lucide-react";
import { type MessageThread } from "@/lib/data";
import { formatMailDate } from "./types";
import { cn } from "@/lib/utils";

interface MessageRowProps {
  thread: MessageThread;
  isSelected: boolean;
  onSelect: (thread: MessageThread) => void;
  onToggleStar: (threadId: string, e: React.MouseEvent) => void;
}

export function MessageRow({
  thread,
  isSelected,
  onSelect,
  onToggleStar,
}: MessageRowProps) {
  const isUnread = thread.status === "unread";
  const hasAttachments = thread.messages.some(
    (m) => m.attachments && m.attachments.length > 0
  );

  const getRoleBadge = (roleStr: string) => {
    switch (roleStr.toLowerCase()) {
      case "verifier":
        return "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20";
      case "officer":
        return "bg-gov/10 text-gov border-gov/20";
      case "admin":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20";
      case "auditor":
        return "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20";
      default:
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (name[0] || "M").toUpperCase();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(thread)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(thread);
        }
      }}
      className={cn(
        "group relative w-full text-left px-3.5 py-3 transition-colors duration-150 cursor-pointer border-b border-slate-100 dark:border-slate-800/80 outline-none select-none",
        isSelected
          ? "bg-slate-100/80 dark:bg-slate-800/70"
          : "hover:bg-slate-50/70 dark:hover:bg-slate-850/50 bg-transparent"
      )}
    >
      {/* Active Accent Indicator Bar on Left */}
      {isSelected && (
        <span className="absolute left-0 top-1 bottom-1 w-1 rounded-r-full bg-gov dark:bg-gov/90" />
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* Subtle Unread Pip */}
          <span
            className={cn(
              "h-2 w-2 rounded-full shrink-0 transition-opacity",
              isUnread
                ? "bg-gov shadow-2xs shadow-gov/50 opacity-100"
                : "opacity-0"
            )}
            title={isUnread ? "Unread message" : undefined}
          />

          {/* Sender Avatar Initials */}
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200/80 dark:bg-slate-700 text-[10px] font-semibold text-slate-700 dark:text-slate-200 shrink-0">
            {getInitials(thread.sender.name)}
          </div>

          <span
            className={cn(
              "truncate text-xs",
              isUnread
                ? "font-bold text-slate-950 dark:text-white"
                : "font-medium text-slate-700 dark:text-slate-300"
            )}
          >
            {thread.sender.name}
          </span>

          <span
            className={cn(
              "rounded px-1 py-0.2 text-[9px] font-mono uppercase font-medium border shrink-0 hidden sm:inline",
              getRoleBadge(thread.sender.role)
            )}
          >
            {thread.sender.role}
          </span>
        </div>

        {/* Timestamp */}
        <span
          className={cn(
            "text-[11px] font-mono tabular-nums shrink-0 ml-1",
            isUnread
              ? "font-semibold text-gov dark:text-gov/90"
              : "text-muted-foreground"
          )}
        >
          {formatMailDate(thread.timestamp)}
        </span>
      </div>

      {/* Subject Line */}
      <div className="mt-1 pl-4">
        <p
          className={cn(
            "truncate text-xs leading-snug",
            isUnread
              ? "font-semibold text-slate-900 dark:text-slate-100"
              : "font-normal text-slate-700 dark:text-slate-300"
          )}
        >
          {thread.subject}
        </p>

        {/* Short Preview Body */}
        <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
          {thread.preview}
        </p>

        {/* Footer: Application ID context + Star & Attachment indicators */}
        <div className="mt-1.5 flex items-center justify-between text-[10px]">
          {thread.applicationId ? (
            <span className="font-mono text-gov font-medium rounded bg-gov/5 dark:bg-gov/15 px-1.5 py-0.2 border border-gov/15">
              {thread.applicationId}
            </span>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2 text-muted-foreground">
            {hasAttachments && (
              <span title="Contains attachments">
                <Paperclip className="h-3 w-3 text-slate-400 dark:text-slate-500" />
              </span>
            )}

            <button
              type="button"
              onClick={(e) => onToggleStar(thread.id, e)}
              className="p-0.5 rounded hover:bg-slate-200/50 dark:hover:bg-slate-700 transition-colors"
              title={thread.isStarred ? "Starred message" : "Star message"}
            >
              <Star
                className={cn(
                  "h-3.5 w-3.5 transition-colors",
                  thread.isStarred
                    ? "fill-amber-400 text-amber-500"
                    : "text-slate-300 dark:text-slate-600 hover:text-amber-500"
                )}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
