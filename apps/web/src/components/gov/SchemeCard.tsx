import { Link } from "@tanstack/react-router";
import { FileText, ArrowRight, CheckCircle2, Gift, Users, Sparkles } from "lucide-react";
import { CATEGORY_IMAGE, type Scheme } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { LevelBadge } from "./ui";
import { SchemeStatus } from "./scheme/SchemeStatus";
import { useApp } from "@/lib/app-state";

export function SchemeCard({ s }: { s: Scheme }) {
  const { state } = useApp();
  const existingApp = state.applications?.find((a) => a.schemeId === s.id);
  const isApproved = existingApp?.status === "Approved";

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900 transition-all duration-200 hover:shadow-sm">
      <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={CATEGORY_IMAGE[s.category]}
          alt=""
          loading="lazy"
          width={1024}
          height={656}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />

        <div className="absolute bottom-2.5 left-3 flex flex-wrap items-center gap-1.5">
          <LevelBadge level={s.level} />
          <span className="rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-slate-800 dark:text-slate-200 border border-black/5">
            {s.category}
          </span>
        </div>

        <div className="absolute top-2.5 right-3 flex flex-col items-end gap-1">
          <SchemeStatus status={s.status} size="sm" />
          {existingApp && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/95 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
              <CheckCircle2 className="h-2.5 w-2.5" />
              <span>Applied · {existingApp.status}</span>
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight leading-snug line-clamp-1">
          {s.name}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5 font-medium truncate">
          {s.department}
        </p>

        {/* Short purpose */}
        <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-2">
          {s.description}
        </p>

        {/* Who it is for & Key Benefit */}
        <div className="mt-3 space-y-1.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 p-3 border border-slate-200/60 dark:border-slate-800 text-xs">
          <div className="flex items-start gap-1.5 text-[11px] text-slate-700 dark:text-slate-300">
            <Users className="h-3.5 w-3.5 text-gov shrink-0 mt-0.5" />
            <span className="leading-snug">
              <strong className="font-semibold text-foreground">Who it's for:</strong> {s.targetAudience}
            </span>
          </div>

          <div className="flex items-start gap-1.5 text-[11px] text-blue-900 dark:text-blue-300 pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
            <Gift className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <span className="leading-snug font-medium">
              <strong className="font-semibold text-foreground">Key Benefit:</strong> {s.keyBenefit}
            </span>
          </div>
        </div>

        {/* Eligibility summary */}
        <div className="mt-2.5 space-y-1 text-xs">
          <span className="text-[10px] uppercase font-mono tracking-wider font-semibold text-muted-foreground block">
            Eligibility Summary
          </span>
          <ul className="space-y-0.5 text-[11px] text-slate-600 dark:text-slate-400">
            {s.eligibility.slice(0, 2).map((e, idx) => (
              <li key={idx} className="flex items-start gap-1.5 line-clamp-1">
                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                <span className="truncate">{e}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action buttons */}
        <div className="mt-auto flex items-center gap-2 pt-4">
          <Button
            size="sm"
            asChild
            className="flex-1 rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 font-semibold text-xs h-8.5 shadow-2xs"
          >
            <Link to="/schemes/$id" params={{ id: s.id }}>
              <span>View Scheme</span>
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>

          <Button
            size="sm"
            variant="outline"
            asChild
            className="flex-1 rounded-lg border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium text-xs h-8.5"
          >
            <Link to="/eligibility" search={{ scheme: s.id }}>
              <Sparkles className="h-3.5 w-3.5 mr-1 text-gov" />
              <span>Check Eligibility</span>
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
