import { Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { CATEGORY_IMAGE, type Scheme } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { LevelBadge, Pill } from "./ui";
import { useApp } from "@/lib/app-state";

export function SchemeCard({ s }: { s: Scheme }) {
  const { t } = useApp();
  return (
    <article className="flex flex-col overflow-hidden rounded-lg border bg-card">
      <img src={CATEGORY_IMAGE[s.category]} alt="" loading="lazy" width={1024} height={656} className="h-36 w-full object-cover" />
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2"><LevelBadge level={s.level} /><Pill>{s.category}</Pill></div>
        <h3 className="font-semibold text-navy">{s.name}</h3>
        <p className="text-xs text-muted-foreground">{s.department}</p>
        <p className="mt-2 text-sm">{s.description}</p>
        <div className="mt-3 text-xs">
          <p className="font-medium">Eligibility</p>
          <ul className="mt-1 list-disc space-y-0.5 pl-4 text-muted-foreground">{s.eligibility.slice(0, 2).map((e) => <li key={e}>{e}</li>)}</ul>
          <p className="mt-2 flex items-start gap-1 text-muted-foreground"><FileText className="mt-0.5 h-3.5 w-3.5 shrink-0" />{s.documents.join(", ")}</p>
        </div>
        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <Button size="sm" variant="outline" asChild><Link to="/schemes/$id" params={{ id: s.id }}>{t("viewDetails")}</Link></Button>
          <Button size="sm" variant="outline" asChild><Link to="/eligibility" search={{ scheme: s.id }}>{t("checkEligibility")}</Link></Button>
          <Button size="sm" asChild><Link to="/citizen/apply/$schemeId" params={{ schemeId: s.id }}>{t("apply")}</Link></Button>
        </div>
      </div>
    </article>
  );
}
