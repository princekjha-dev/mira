import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RotateCcw, Search } from "lucide-react";
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
  const [q, setQ] = useState(search.q ?? "");
  const [f, setF] = useState({
    level: ANY,
    income: ANY,
    bpl: ANY,
    state: ANY,
    age: "",
    gender: ANY,
    property: ANY,
  });
  const category = search.category ?? ANY;

  const list = useMemo(
    () =>
      SCHEMES.filter((s) => {
        const k = (search.q ?? "").toLowerCase();
        if (
          k &&
          !(s.name + s.description + s.department + s.category)
            .toLowerCase()
            .includes(k)
        )
          return false;
        if (category !== ANY && s.category !== category) return false;
        if (f.level !== ANY && s.level !== f.level) return false;
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
    [search.q, category, f],
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
        eyebrow="SCHEMES & SERVICES"
        title="Find a scheme"
        desc="Filter by your situation. See clear eligibility criteria and apply when you're ready."
        crumbs={[{ label: "Home", to: "/" }, { label: "Schemes" }]}
      />
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
              <Button
                size="icon"
                type="submit"
                aria-label="Search"
                className="h-9 w-9 shrink-0 tactile-btn"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
          <div>
            <Label className="text-xs font-medium text-foreground">
              Scheme category
            </Label>
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
            <Label
              htmlFor="age"
              className="text-xs font-medium text-foreground"
            >
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
