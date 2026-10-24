import { Star, Paperclip, AlertCircle } from "lucide-react";
import { type MessageThread } from "@/lib/data";
import { formatMailDate, getCaseStatusConfig, getRoleBadge } from "./types";
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

  const roleInfo = getRoleBadge(thread.sender.role);
  const statusInfo = getCaseStatusConfig(thread.caseStatus);

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
        "group relative w-full text-left px-3.5 py-3 transition-colors duration-150 cursor-pointer border-b border-slate-200/70 dark:border-slate-800/80 outline-none select-none",
        isSelected
          ? "bg-slate-100/90 dark:bg-slate-800/80 ring-1 ring-inset ring-slate-300/70 dark:ring-slate-700/60"
          : "hover:bg-slate-50/80 dark:hover:bg-slate-850/50 bg-white dark:bg-slate-900"
      )}
    >
      {/* Active Accent Indicator Bar on Left */}
      {isSelected && (
        <span className="absolute left-0 top-1 bottom-1 w-1 rounded-r-full bg-gov dark:bg-gov/90" />
      )}

      {/* Row 1: Sender, Role Badge, and Status */}
      <div className="flex items-center justify-between gap-2">
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
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-200 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200 shrink-0">
            {getInitials(thread.sender.name)}
          </div>

          <div className="flex items-center gap-1.5 truncate">
            <span
              className={cn(
                "truncate text-xs",
                isUnread
                  ? "font-bold text-slate-950 dark:text-white"
                  : "font-semibold text-slate-800 dark:text-slate-200"
              )}
            >
              {thread.sender.name}
            </span>

            <span
              className={cn(
                "rounded px-1.5 py-0.2 text-[9px] font-mono uppercase font-semibold border shrink-0",
                roleInfo.className
              )}
            >
              {roleInfo.label}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium border shrink-0",
            statusInfo.className
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", statusInfo.dotClassName)} />
          <span>{statusInfo.label}</span>
        </span>
      </div>

      {/* Row 2: Subject Line */}
      <div className="mt-1.5 pl-4">
        <h4
          className={cn(
            "text-xs leading-snug line-clamp-1",
            isUnread
              ? "font-bold text-slate-950 dark:text-slate-50"
              : "font-medium text-slate-800 dark:text-slate-200"
          )}
        >
          {thread.subject}
        </h4>

        {/* Row 3: Case Metadata Badges: Application ID, Scheme, Date */}
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px]">
          {thread.applicationId && (
            <span className="font-mono text-[10px] font-bold text-gov bg-gov/10 dark:bg-gov/20 px-1.5 py-0.2 rounded border border-gov/20">
              {thread.applicationId}
            </span>
          )}

          {thread.schemeName && (
            <span className="truncate max-w-[180px] text-[10px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 rounded border border-slate-200/70 dark:border-slate-700/60">
              {thread.schemeName}
            </span>
          )}

          <span className="ml-auto text-[10px] font-mono tabular-nums text-muted-foreground shrink-0">
            {formatMailDate(thread.timestamp)}
          </span>
        </div>

        {/* Row 4: Action Required Banner if active */}
        {thread.actionRequired && (
          <div className="mt-2 flex items-start gap-1.5 rounded-md border border-amber-300/80 bg-amber-50/80 p-1.5 text-[11px] text-amber-950 dark:border-amber-600/30 dark:bg-amber-950/40 dark:text-amber-200">
            <AlertCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-amber-900 dark:text-amber-300">
                Action required:{" "}
              </span>
              <span className="font-medium">{thread.actionRequired}</span>
              {thread.deadline && (
                <span className="block text-[10px] text-amber-800/80 dark:text-amber-400/80 font-mono mt-0.5">
                  Deadline: {thread.deadline}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Row 5: Preview snippet + footer indicators */}
        <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
          <p className="line-clamp-1 text-[11px] text-slate-500 dark:text-slate-400 max-w-[280px]">
            {thread.preview}
          </p>

          <div className="flex items-center gap-2 shrink-0 ml-2">
            {hasAttachments && (
              <span title="Contains official attachments">
                <Paperclip className="h-3 w-3 text-slate-400 dark:text-slate-500" />
              </span>
            )}

            <button
              type="button"
              onClick={(e) => onToggleStar(thread.id, e)}
              className="p-0.5 rounded hover:bg-slate-200/50 dark:hover:bg-slate-700 transition-colors"
              title={thread.isStarred ? "Starred" : "Star"}
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
