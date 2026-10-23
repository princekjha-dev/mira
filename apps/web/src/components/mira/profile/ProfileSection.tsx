import React, { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ProfileSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function ProfileSection({
  title,
  description,
  children,
  className,
}: ProfileSectionProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {title && (
        <div className="px-1 space-y-0.5">
          <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider font-mono">
            {title}
          </h3>
          {description && (
            <p className="text-[11px] text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/70">
        {children}
      </div>
    </div>
  );
}
