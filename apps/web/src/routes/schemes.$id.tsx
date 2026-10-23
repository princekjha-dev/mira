import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CheckCircle2, FileText } from "lucide-react";
import { CATEGORY_IMAGE, getScheme } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { LevelBadge, PageHeader, Panel, Pill } from "@/components/gov/ui";

export const Route = createFileRoute("/schemes/$id")({
  loader: ({ params }) => { const s = getScheme(params.id); if (!s) throw notFound(); return s; },
  head: ({ loaderData }) => ({ meta: loaderData ? [
    { title: `${loaderData.name} — Scheme details` },
    { name: "description", content: loaderData.description },
    { property: "og:title", content: loaderData.name },
    { property: "og:description", content: loaderData.description },
  ] : [{ title: "Scheme unavailable" }, { name: "robots", content: "noindex" }] }),
  component: Detail,
});

function Detail() {
  const s = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <PageHeader title={s.name} desc={s.department} crumbs={[{ label: "Home", to: "/" }, { label: "Schemes", to: "/schemes" }, { label: s.name }]}
        actions={<><Button variant="outline" asChild><Link to="/eligibility" search={{ scheme: s.id }}>Check Eligibility</Link></Button><Button asChild><Link to="/citizen/apply/$schemeId" params={{ schemeId: s.id }}>Apply</Link></Button></>} />
      <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <img src={CATEGORY_IMAGE[s.category]} alt="" width={1024} height={656} className="aspect-[16/9] w-full rounded-lg border object-cover" />
          <Panel title="About the scheme"><p className="text-sm">{s.description}</p>
            <div className="mt-3 flex flex-wrap gap-2"><LevelBadge level={s.level} /><Pill>{s.category}</Pill><Pill>Eligibility basis: {s.basis.join(" + ")}</Pill></div>
            <p className="mt-3 text-xs text-muted-foreground">{s.level === "Household" ? "This is a household benefit: only one benefit may be granted per household. Previous household benefits are checked." : "This is an individual benefit: it is granted to the named beneficiary."}</p>
          </Panel>
        </div>
        <div className="space-y-6">
          <Panel title="Eligibility criteria"><ul className="space-y-2 text-sm">{s.eligibility.map((e) => <li key={e} className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-success" />{e}</li>)}</ul></Panel>
          <Panel title="Documents required"><ul className="space-y-2 text-sm">{s.documents.map((d) => <li key={d} className="flex gap-2"><FileText className="h-4 w-4 shrink-0 text-gov" />{d}</li>)}</ul></Panel>
          <Panel title="Availability"><p className="text-sm">{s.states.join(", ")}</p><p className="mt-2 text-xs text-muted-foreground">Benefit amounts are notified by the department and are not shown in this prototype.</p></Panel>
        </div>
      </div>
    </div>
  );
}
