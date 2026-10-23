import { Link } from "@tanstack/react-router";
import { FileText, ArrowRight, CheckCircle2 } from "lucide-react";
import { CATEGORY_IMAGE, type Scheme } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { LevelBadge, Pill } from "./ui";
import { useApp } from "@/lib/app-state";

export function SchemeCard({ s }: { s: Scheme }) {
  const { t } = useApp();
  return (
    <article className="tactile-card group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900 transition-all duration-200">
      <div className="relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={CATEGORY_IMAGE[s.category]}
          alt=""
          loading="lazy"
          width={1024}
          height={656}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
        <div className="absolute bottom-2.5 left-3 flex flex-wrap items-center gap-1.5">
          <LevelBadge level={s.level} />
          <span className="rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-slate-800 dark:text-slate-200 border border-black/5">
            {s.category}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
          {s.name}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5 font-medium">
          {s.department}
        </p>

        <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300 line-clamp-2">
          {s.description}
        </p>

        <div className="mt-3.5 space-y-1.5 rounded-xl bg-slate-50/70 dark:bg-slate-850/60 p-3 border border-slate-100 dark:border-slate-800/80 text-xs">
          <p className="font-semibold text-slate-800 dark:text-slate-200 text-[11px] uppercase font-mono tracking-wider">
            Key Criteria
          </p>
          <ul className="space-y-1 text-[11px] text-muted-foreground leading-normal">
            {s.eligibility.slice(0, 2).map((e) => (
              <li key={e} className="flex items-start gap-1.5">
                <span className="text-gov font-bold">·</span>
                <span>{e}</span>
              </li>
            ))}
          </ul>
          <p className="mt-1.5 flex items-center gap-1.5 text-[10px] text-muted-foreground pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
            <FileText className="h-3 w-3 shrink-0 text-slate-400" />
            <span className="truncate">{s.documents.join(", ")}</span>
          </p>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
          <Button
            size="sm"
            variant="outline"
            className="tactile-btn text-xs h-8 px-2.5 rounded-lg flex-1"
            asChild
          >
            <Link to="/schemes/$id" params={{ id: s.id }}>
              Details
            </Link>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="tactile-btn text-xs h-8 px-2.5 rounded-lg flex-1"
            asChild
          >
            <Link to="/eligibility" search={{ scheme: s.id }}>
              Eligibility
            </Link>
          </Button>
          <Button
            size="sm"
            className="tactile-btn text-xs h-8 px-3 rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 shadow-2xs font-semibold gap-1"
            asChild
          >
            <Link to="/citizen/apply/$schemeId" params={{ schemeId: s.id }}>
              Apply
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
