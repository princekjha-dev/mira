import { useState } from "react";
import {
  Filter,
  Check,
  X,
  SlidersHorizontal,
  RotateCcw,
  Tag,
  Paperclip,
  MailCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type MailFilterState, type WorkflowFilter } from "./types";
import { cn } from "@/lib/utils";

interface MailFilterProps {
  filter: MailFilterState;
  onChange: (filter: MailFilterState) => void;
  availableApplications?: string[];
}

export function MailFilter({
  filter,
  onChange,
  availableApplications = [],
}: MailFilterProps) {
  const [open, setOpen] = useState(false);

  const workflowTags: WorkflowFilter[] = [
    "Action Required",
    "Evidence",
    "Field Visit",
    "Schedule",
    "Operations",
  ];

  const activeCount =
    (filter.unreadOnly ? 1 : 0) +
    (filter.hasAttachment ? 1 : 0) +
    (filter.tag ? 1 : 0) +
    (filter.applicationId ? 1 : 0);

  const resetFilters = () => {
    onChange({
      unreadOnly: false,
      hasAttachment: false,
      tag: null,
      applicationId: undefined,
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 px-2.5 text-xs font-medium gap-1.5 transition-colors",
            activeCount > 0
              ? "border-gov/50 text-gov bg-gov/5 hover:bg-gov/10"
              : "text-slate-700 dark:text-slate-300 hover:text-slate-900"
          )}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>Filter</span>
          {activeCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gov text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-72 p-4 text-xs space-y-4 rounded-xl border border-border/80 shadow-lg">
        <div className="flex items-center justify-between border-b pb-2">
          <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-gov" />
            Filter Messages
          </span>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          )}
        </div>

        {/* Quick flags */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
            Status & Attachments
          </span>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() =>
                onChange({ ...filter, unreadOnly: !filter.unreadOnly })
              }
              className={cn(
                "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors",
                filter.unreadOnly
                  ? "bg-slate-100 dark:bg-slate-800 font-medium text-slate-900 dark:text-slate-100"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              )}
            >
              <span className="flex items-center gap-2">
                <MailCheck className="h-3.5 w-3.5 text-slate-500" />
                Unread Messages Only
              </span>
              {filter.unreadOnly && <Check className="h-3.5 w-3.5 text-gov" />}
            </button>

            <button
              type="button"
              onClick={() =>
                onChange({ ...filter, hasAttachment: !filter.hasAttachment })
              }
              className={cn(
                "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors",
                filter.hasAttachment
                  ? "bg-slate-100 dark:bg-slate-800 font-medium text-slate-900 dark:text-slate-100"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              )}
            >
              <span className="flex items-center gap-2">
                <Paperclip className="h-3.5 w-3.5 text-slate-500" />
                Has Attached Files
              </span>
              {filter.hasAttachment && <Check className="h-3.5 w-3.5 text-gov" />}
            </button>
          </div>
        </div>

        {/* Workflow Category */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
            Workflow Category
          </span>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {workflowTags.map((tag) => {
              const isSelected = filter.tag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() =>
                    onChange({
                      ...filter,
                      tag: isSelected ? null : tag,
                    })
                  }
                  className={cn(
                    "text-[11px] px-2.5 py-1 rounded-md border transition-all duration-150 font-medium",
                    isSelected
                      ? "border-gov bg-gov/10 text-gov dark:bg-gov/20"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                  )}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Application context */}
        {availableApplications.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              Filter by Application
            </span>
            <div className="flex flex-wrap gap-1">
              {availableApplications.slice(0, 4).map((appId) => {
                const isSelected = filter.applicationId === appId;
                return (
                  <button
                    key={appId}
                    type="button"
                    onClick={() =>
                      onChange({
                        ...filter,
                        applicationId: isSelected ? undefined : appId,
                      })
                    }
                    className={cn(
                      "text-[10px] font-mono px-2 py-0.5 rounded border transition-colors",
                      isSelected
                        ? "border-gov bg-gov text-white font-bold"
                        : "border-border bg-slate-50 text-muted-foreground hover:border-slate-400"
                    )}
                  >
                    {appId}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
