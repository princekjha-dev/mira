import {
  Inbox,
  AlertCircle,
  Send,
  Archive,
  FileCheck2,
  Navigation,
  MessageSquare,
  Scale,
} from "lucide-react";
import { type MailFolder, type CaseActivityFilter } from "./types";
import { cn } from "@/lib/utils";

export interface FolderCount {
  inbox: number;
  needs_action: number;
  sent: number;
  archived: number;
}

export interface CaseActivityCount {
  evidence: number;
  field_visit: number;
  clarification: number;
  decision: number;
}

interface MailSidebarProps {
  activeFolder: MailFolder;
  onSelectFolder: (folder: MailFolder) => void;
  activeActivity: CaseActivityFilter;
  onSelectActivity: (activity: CaseActivityFilter) => void;
  folderCounts: FolderCount;
  activityCounts: CaseActivityCount;
}

export function MailSidebar({
  activeFolder,
  onSelectFolder,
  activeActivity,
  onSelectActivity,
  folderCounts,
  activityCounts,
}: MailSidebarProps) {
  const commFolders = [
    {
      id: "inbox" as const,
      label: "Inbox",
      icon: Inbox,
      count: folderCounts.inbox,
    },
    {
      id: "needs_action" as const,
      label: "Needs My Action",
      icon: AlertCircle,
      count: folderCounts.needs_action,
      highlight: true,
    },
    {
      id: "sent" as const,
      label: "Sent",
      icon: Send,
      count: folderCounts.sent,
    },
    {
      id: "archived" as const,
      label: "Archived",
      icon: Archive,
      count: folderCounts.archived,
    },
  ];

  const caseActivities: {
    id: NonNullable<CaseActivityFilter>;
    label: string;
    icon: typeof FileCheck2;
    count: number;
  }[] = [
    {
      id: "evidence",
      label: "Evidence Requests",
      icon: FileCheck2,
      count: activityCounts.evidence,
    },
    {
      id: "field_visit",
      label: "Field Visits",
      icon: Navigation,
      count: activityCounts.field_visit,
    },
    {
      id: "clarification",
      label: "Clarifications",
      icon: MessageSquare,
      count: activityCounts.clarification,
    },
    {
      id: "decision",
      label: "Decisions",
      icon: Scale,
      count: activityCounts.decision,
    },
  ];

  return (
    <nav className="flex flex-col gap-4 p-3 text-xs w-full" aria-label="Official communications and case activities">
      {/* COMMUNICATIONS Section */}
      <div className="space-y-1">
        <span className="block px-2 text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
          Communications
        </span>
        <div className="space-y-0.5 pt-0.5">
          {commFolders.map((f) => {
            const isActive = activeFolder === f.id && activeActivity === null;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  onSelectFolder(f.id);
                  onSelectActivity(null);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg font-medium transition-colors text-left",
                  isActive
                    ? "bg-slate-200/70 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <f.icon
                    className={cn(
                      "h-3.5 w-3.5 shrink-0",
                      isActive
                        ? "text-gov"
                        : f.highlight && f.count > 0
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-slate-400 dark:text-slate-500"
                    )}
                  />
                  <span className="truncate">{f.label}</span>
                </div>

                {f.count > 0 && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.2 text-[10px] font-mono tabular-nums",
                      f.highlight
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold"
                        : isActive
                          ? "bg-gov/15 text-gov font-bold"
                          : "bg-slate-200/60 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    )}
                  >
                    {f.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* CASE ACTIVITY Section */}
      <div className="space-y-1 border-t border-slate-200/60 dark:border-slate-800/60 pt-3">
        <span className="block px-2 text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
          Case Activity
        </span>
        <div className="space-y-0.5 pt-0.5">
          {caseActivities.map((act) => {
            const isActive = activeActivity === act.id;
            return (
              <button
                key={act.id}
                type="button"
                onClick={() => {
                  onSelectActivity(isActive ? null : act.id);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg font-medium transition-colors text-left",
                  isActive
                    ? "bg-slate-200/70 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  <act.icon
                    className={cn(
                      "h-3.5 w-3.5 shrink-0",
                      isActive
                        ? "text-gov"
                        : "text-slate-400 dark:text-slate-500"
                    )}
                  />
                  <span className="truncate">{act.label}</span>
                </div>

                {act.count > 0 && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.2 text-[10px] font-mono tabular-nums",
                      isActive
                        ? "bg-gov/15 text-gov font-bold"
                        : "bg-slate-200/60 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    )}
                  >
                    {act.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
