import React, { type ReactNode } from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileRowProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  value?: ReactNode;
  action?: ReactNode;
  onClick?: () => void;
  isLast?: boolean;
  destructive?: boolean;
}

export function ProfileRow({
  icon: Icon,
  title,
  description,
  value,
  action,
  onClick,
  isLast = false,
  destructive = false,
}: ProfileRowProps) {
  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (isClickable && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "flex items-center justify-between gap-4 px-4 py-3 text-xs transition-colors",
        !isLast && "border-b border-slate-100 dark:border-slate-800/70",
        isClickable && "hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer select-none",
        destructive && "text-rose-600 dark:text-rose-400"
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        {Icon && (
          <div
            className={cn(
              "flex h-7 w-7 items-center justify-center rounded-lg shrink-0",
              destructive
                ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
          </div>
        )}

        <div className="min-w-0">
          <p
            className={cn(
              "font-medium truncate",
              destructive
                ? "text-rose-600 dark:text-rose-400 font-semibold"
                : "text-slate-900 dark:text-slate-100"
            )}
          >
            {title}
          </p>
          {description && (
            <p className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {value && (
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            {value}
          </span>
        )}
        {action}
        {isClickable && !action && (
          <ChevronRight className="h-4 w-4 text-slate-300 dark:text-slate-600" />
        )}
      </div>
    </div>
  );
}
