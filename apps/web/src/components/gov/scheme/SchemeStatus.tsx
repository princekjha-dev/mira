import { cn } from "@/lib/utils";
import type { Scheme } from "@/lib/data";

interface SchemeStatusProps {
  status: Scheme["status"];
  className?: string;
  size?: "sm" | "md";
}

export function SchemeStatus({ status, className, size = "md" }: SchemeStatusProps) {
  const config = {
    "Accepting Applications": {
      label: "Accepting Applications",
      style: "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300",
      dot: "bg-emerald-500",
    },
    Active: {
      label: "Active Scheme",
      style: "border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-800/60 dark:bg-sky-950/40 dark:text-sky-300",
      dot: "bg-sky-500",
    },
    Rolling: {
      label: "Rolling Enrollment",
      style: "border-teal-200 bg-teal-50 text-teal-800 dark:border-teal-800/60 dark:bg-teal-950/40 dark:text-teal-300",
      dot: "bg-teal-500",
    },
    "Verification Underway": {
      label: "Verification In Progress",
      style: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-300",
      dot: "bg-amber-500",
    },
  }[status] || {
    label: status,
    style: "border-slate-200 bg-slate-50 text-slate-700",
    dot: "bg-slate-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium tracking-tight shadow-2xs font-mono",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        config.style,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", config.dot)} />
      <span>{config.label}</span>
    </span>
  );
}
