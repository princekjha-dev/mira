import {
  Inbox,
  Star,
  Send,
  Archive,
  AlertCircle,
  FileCheck2,
  Navigation,
  Calendar,
  Activity,
  Tag,
} from "lucide-react";
import { type MailFolder, type WorkflowFilter } from "./types";
import { cn } from "@/lib/utils";

interface FolderCount {
  inbox: number;
  starred: number;
  sent: number;
  archived: number;
}

interface WorkflowCount {
  "Action Required"?: number;
  Evidence?: number;
  "Field Visit"?: number;
  Schedule?: number;
  Operations?: number;
}

interface MailSidebarProps {
  activeFolder: MailFolder;
  onSelectFolder: (folder: MailFolder) => void;
  activeWorkflow: WorkflowFilter | null;
  onSelectWorkflow: (wf: WorkflowFilter | null) => void;
  folderCounts: FolderCount;
  workflowCounts: WorkflowCount;
}

export function MailSidebar({
  activeFolder,
  onSelectFolder,
  activeWorkflow,
  onSelectWorkflow,
  folderCounts,
  workflowCounts,
}: MailSidebarProps) {
  const mailFolders = [
    { id: "inbox" as const, label: "Inbox", icon: Inbox, count: folderCounts.inbox },
    { id: "starred" as const, label: "Starred", icon: Star, count: folderCounts.starred },
    { id: "sent" as const, label: "Sent", icon: Send, count: folderCounts.sent },
    { id: "archived" as const, label: "Archived", icon: Archive, count: folderCounts.archived },
  ];

  const workflowItems: { id: WorkflowFilter; label: string; icon: typeof AlertCircle }[] = [
    { id: "Action Required", label: "Action Required", icon: AlertCircle },
    { id: "Evidence", label: "Evidence", icon: FileCheck2 },
    { id: "Field Visit", label: "Field Visit", icon: Navigation },
    { id: "Schedule", label: "Schedule", icon: Calendar },
    { id: "Operations", label: "Operations", icon: Activity },
  ];

  return (
    <nav className="flex flex-col gap-5 p-3 text-xs w-full" aria-label="Mail folders and workflows">
      {/* Mail Section */}
      <div className="space-y-1">
        <span className="block px-2 text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
          Mail
        </span>
        <div className="space-y-0.5 pt-0.5">
          {mailFolders.map((f) => {
            const isActive = activeFolder === f.id && activeWorkflow === null;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  onSelectFolder(f.id);
                  onSelectWorkflow(null);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg font-medium transition-colors text-left",
                  isActive
                    ? "bg-slate-200/60 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
                )}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <f.icon
                    className={cn(
                      "h-3.5 w-3.5 shrink-0",
                      isActive
                        ? "text-gov"
                        : "text-slate-400 dark:text-slate-500"
                    )}
                  />
                  <span className="truncate">{f.label}</span>
                </div>

                {f.count > 0 && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.2 text-[10px] font-mono tabular-nums",
                      isActive
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

      {/* Workflow Section */}
      <div className="space-y-1 border-t border-slate-200/60 dark:border-slate-800/60 pt-3">
        <span className="block px-2 text-[10px] font-mono uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">
          Workflow
        </span>
        <div className="space-y-0.5 pt-0.5">
          {workflowItems.map((wf) => {
            const isActive = activeWorkflow === wf.id;
            const count = workflowCounts[wf.id] || 0;
            return (
              <button
                key={wf.id}
                type="button"
                onClick={() => {
                  onSelectWorkflow(isActive ? null : wf.id);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg font-medium transition-colors text-left",
                  isActive
                    ? "bg-slate-200/60 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
                )}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <wf.icon
                    className={cn(
                      "h-3.5 w-3.5 shrink-0",
                      isActive
                        ? "text-gov"
                        : "text-slate-400 dark:text-slate-500"
                    )}
                  />
                  <span className="truncate">{wf.label}</span>
                </div>

                {count > 0 && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.2 text-[10px] font-mono tabular-nums",
                      isActive
                        ? "bg-gov/15 text-gov font-bold"
                        : "bg-slate-200/60 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    )}
                  >
                    {count}
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
