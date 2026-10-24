import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RotateCcw, Search, Sparkles, ListTree, Gift, Bookmark } from "lucide-react";
import { CATEGORIES, SCHEMES, STATES } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SchemeCard } from "@/components/gov/SchemeCard";
import { Empty, PageContainer, PageHeader } from "@/components/gov/ui";
import { MiraCard } from "@/components/mira/MiraPrimitives";
import { cn } from "@/lib/utils";

type S = { q?: string; category?: string };
export const Route = createFileRoute("/schemes/")({
  validateSearch: (s: Record<string, unknown>): S => ({
    q: typeof s.q === "string" ? s.q : undefined,
    category: typeof s.category === "string" ? s.category : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Find Government Schemes — Unified Public Documentation" },
      {
        name: "description",
        content:
          "Search welfare schemes by category, income, BPL status, state, age and household criteria.",
      },
      { property: "og:title", content: "Find Government Schemes" },
      {
        property: "og:description",
        content:
          "Search and filter welfare schemes with clear eligibility summaries.",
      },
    ],
  }),
  component: Schemes,
});

const ANY = "any";
function Schemes() {
  const search = Route.useSearch();
  const nav = useNavigate({ from: "/schemes/" });
  const [viewMode, setViewMode] = useState<"browse" | "recommended" | "saved">("browse");
  const [q, setQ] = useState(search.q ?? "");
  const [f, setF] = useState({
    level: ANY,
    income: ANY,
    bpl: ANY,
    state: ANY,
    age: "",
    gender: ANY,
    property: ANY,
    benefitType: ANY,
    status: ANY,
  });
  const category = search.category ?? ANY;

  const list = useMemo(
    () =>
      SCHEMES.filter((s) => {
        if (viewMode === "recommended") {
          return ["post-matric", "sanitation", "health-cover", "rural-housing", "farmer-support"].includes(s.id);
        }
        if (viewMode === "saved") {
          return ["post-matric", "health-cover", "rural-housing"].includes(s.id);
        }
        const k = (search.q ?? "").toLowerCase();
        if (
          k &&
          !(s.name + s.description + s.department + s.category + s.keyBenefit + s.targetAudience)
            .toLowerCase()
            .includes(k)
        )
          return false;
        if (category !== ANY && s.category !== category) return false;
        if (f.level !== ANY && s.level !== f.level) return false;
        if (f.benefitType !== ANY && s.benefitType !== f.benefitType) return false;
        if (f.status !== ANY && s.status !== f.status) return false;
        if (
          f.income !== ANY &&
          s.incomeMax !== undefined &&
          s.incomeMax < Number(f.income)
        )
          return false;
        if (f.bpl === "no" && s.bplRequired) return false;
        if (
          f.state !== ANY &&
          !s.states.includes("All States") &&
          !s.states.includes(f.state)
        )
          return false;
        const age = Number(f.age);
        if (
          f.age &&
          ((s.ageMin && age < s.ageMin) || (s.ageMax && age > s.ageMax))
        )
          return false;
        if (f.gender === "Male" && s.gender === "Female") return false;
        if (f.property === "none" && s.property === "land-under-2ha")
          return false;
        if (f.property === "pucca" && s.property === "no-pucca-house")
          return false;
        return true;
      }),
    [search.q, category, f, viewMode],
  );

  const sel = (
    key: keyof typeof f,
    label: string,
    opts: [string, string][],
  ) => (
    <div>
      <Label className="text-xs">{label}</Label>
      <Select value={f[key]} onValueChange={(v) => setF({ ...f, [key]: v })}>
        <SelectTrigger className="mt-1">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ANY}>Any</SelectItem>
          {opts.map(([v, l]) => (
            <SelectItem key={v} value={v}>
              {l}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <PageContainer>
      <PageHeader
        eyebrow="PUBLIC WELFARE CATALOGUE"
        title="Government Schemes & Benefits"
        desc="Explore public welfare schemes, eligibility requirements and available benefits."
        crumbs={[{ label: "Home", to: "/" }, { label: "Schemes & Benefits" }]}
      />

      {/* Schemes Destination Sub-navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-border/80 pb-2.5 mb-6 scrollbar-none">
        <button
          type="button"
          onClick={() => setViewMode("browse")}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors flex items-center gap-1.5",
            viewMode === "browse"
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 shadow-2xs"
              : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
          )}
        >
          <Search className="h-3.5 w-3.5" />
          <span>Browse Schemes</span>
        </button>
        <button
          type="button"
          onClick={() => setViewMode("recommended")}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors flex items-center gap-1.5",
            viewMode === "recommended"
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 shadow-2xs"
              : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
          )}
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Recommended for You</span>
        </button>
        <Link
          to="/eligibility"
          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors flex items-center gap-1.5"
        >
          <ListTree className="h-3.5 w-3.5" />
          <span>Eligibility Criteria</span>
        </Link>
        <Link
          to="/citizen/benefits"
          className="rounded-lg px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors flex items-center gap-1.5"
        >
          <Gift className="h-3.5 w-3.5" />
          <span>Benefits & Entitlements</span>
        </Link>
        <button
          type="button"
          onClick={() => setViewMode("saved")}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors flex items-center gap-1.5",
            viewMode === "saved"
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 shadow-2xs"
              : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
          )}
        >
          <Bookmark className="h-3.5 w-3.5" />
          <span>Saved Schemes</span>
        </button>
      </div>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <MiraCard
          variant="elevated"
          className="h-fit space-y-4 p-5 rounded-2xl"
          aria-label="Filters"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              nav({ search: { ...search, q: q || undefined } });
            }}
            role="search"
          >
            <Label htmlFor="q" className="text-xs font-medium text-foreground">
              Search
            </Label>
            <div className="mt-1 flex gap-2">
              <Input
                id="q"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search schemes by name or keyword"
                className="h-9"
              />
              <Button size="icon" type="submit" aria-label="Search" className="h-9 w-9 shrink-0 tactile-btn">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
          <div>
            <Label className="text-xs font-medium text-foreground">Scheme category</Label>
            <Select
              value={category}
              onValueChange={(v) =>
                nav({
                  search: { ...search, category: v === ANY ? undefined : v },
                })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ANY}>All categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {sel("level", "Individual / Household", [
            ["Individual", "Individual"],
            ["Household", "Household"],
          ])}
          {sel("benefitType", "Benefits Type", [
            ["Direct Benefit Transfer (DBT)", "Direct Benefit Transfer (DBT)"],
            ["Subsidy / Grant", "Subsidy / Grant"],
            ["Healthcare Coverage", "Healthcare Coverage"],
            ["Monthly Pension", "Monthly Pension"],
            ["In-kind Assistance", "In-kind Assistance"],
          ])}
          {sel("status", "Scheme Status", [
            ["Active", "Active Scheme"],
            ["Accepting Applications", "Accepting Applications"],
            ["Rolling", "Rolling Enrollment"],
            ["Verification Underway", "Verification Underway"],
          ])}
          {sel("income", "Annual household income", [
            ["100000", "Up to ₹1,00,000"],
            ["200000", "₹1,00,001 – ₹2,00,000"],
            ["300000", "₹2,00,001 – ₹3,00,000"],
            ["500000", "Above ₹3,00,000"],
          ])}
          {sel("bpl", "BPL status", [
            ["yes", "BPL household"],
            ["no", "Not BPL"],
          ])}
          {sel(
            "state",
            "State",
            STATES.slice(1).map((s) => [s, s]),
          )}
          <div>
            <Label htmlFor="age" className="text-xs font-medium text-foreground">
              Age
            </Label>
            <Input
              id="age"
              type="number"
              min={0}
              max={120}
              value={f.age}
              onChange={(e) => setF({ ...f, age: e.target.value })}
              className="mt-1 h-9"
              placeholder="e.g. 42"
            />
          </div>
          {sel("gender", "Gender (where applicable)", [
            ["Female", "Female"],
            ["Male", "Male"],
          ])}
          {sel("property", "Property criteria", [
            ["none", "No land / house"],
            ["kutcha", "Kutcha house"],
            ["pucca", "Own pucca house"],
          ])}
          <Button
            variant="outline"
            className="w-full tactile-btn h-9"
            onClick={() => {
              setF({
                level: ANY,
                income: ANY,
                bpl: ANY,
                state: ANY,
                age: "",
                gender: ANY,
                property: ANY,
                benefitType: ANY,
                status: ANY,
              });
              setQ("");
              nav({ search: {} });
            }}
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Reset filters
          </Button>
        </MiraCard>
        <div>
          <p className="mb-3 text-sm text-muted-foreground" aria-live="polite">
            {list.length} scheme{list.length !== 1 && "s"} found
          </p>
          {list.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {list.map((s) => (
                <SchemeCard key={s.id} s={s} />
              ))}
            </div>
          ) : (
            <Empty
              title="No schemes match these filters"
              body="Try removing a filter or searching a different keyword."
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
}
