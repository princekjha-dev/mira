import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  CircleHelp,
  FileCheck2,
  FolderOpen,
  Search,
  UserRound,
  UsersRound,
  WalletCards,
  Wrench,
} from "lucide-react";
import { SCHEMES } from "@/lib/data";
import { useApp } from "@/lib/app-state";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Empty, PageContainer, PageHeader, Panel } from "@/components/gov/ui";
import { MiraCard } from "@/components/mira/MiraPrimitives";

type HelpSearch = { q?: string };
export const Route = createFileRoute("/help")({
  validateSearch: (search: Record<string, unknown>): HelpSearch => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Help & Support — Mira" },
      {
        name: "description",
        content:
          "Find answers, understand your applications, or get help with Mira services.",
      },
      { property: "og:title", content: "Help & Support — Mira" },
    ],
  }),
  component: Help,
});

const FAQ: { category: string; question: string; answer: string }[] = [
  {
    category: "Account",
    question: "How do I sign in to Mira?",
    answer:
      "Choose Sign In and follow the identity verification steps shown for your account.",
  },
  {
    category: "Account",
    question: "How do I update my account details?",
    answer:
      "Open account settings after signing in to view the profile information and preferences available to you.",
  },
  {
    category: "Applications",
    question: "Why does my application say Verification Required?",
    answer:
      "Some information needs a document or record check by an authorised reviewer. This status is not a rejection. Open the application to see any requested next steps.",
  },
  {
    category: "Applications",
    question: "Can I edit a submitted application?",
    answer:
      "Submitted applications can't be edited directly. If more information is needed, open the application and respond to the request shown there.",
  },
  {
    category: "Documents",
    question: "Which document formats can I upload?",
    answer:
      "PDF, JPG, JPEG, PNG and WEBP are accepted for citizen documents, up to 25 MB per file. Mira optimizes supported large images before upload.",
  },
  {
    category: "Documents",
    question: "What does Review required mean?",
    answer:
      "Your document has been stored, but a reviewer still needs to check it. Uploading a document and verifying it are separate steps.",
  },
  {
    category: "Eligibility",
    question: "How is eligibility checked?",
    answer:
      "Mira compares the information you provide with the scheme criteria and explains the result. The final decision is made during application review.",
  },
  {
    category: "Benefits",
    question: "Where can I see benefits already received?",
    answer:
      "Open Benefits and assistance to see benefit records available to your signed-in account.",
  },
  {
    category: "Family Records",
    question: "How do I request a family record correction?",
    answer:
      "Open My Family Record to review the available record request options. Submitted changes may need verification.",
  },
  {
    category: "Technical Support",
    question: "A page did not load. What should I do?",
    answer:
      "Retry the page. If the issue continues, use Raise a grievance to describe the service problem.",
  },
];

const CATEGORIES = [
  { label: "Applications", to: "/citizen/applications", icon: FileCheck2 },
  { label: "Documents", to: "/citizen/documents", icon: FolderOpen },
  { label: "Eligibility", to: "/eligibility", icon: CircleHelp },
  { label: "Benefits", to: "/citizen/benefits", icon: WalletCards },
  { label: "Account", to: "/citizen/settings", icon: UserRound },
  { label: "Family records", to: "/citizen/family", icon: UsersRound },
  { label: "Technical support", to: "/citizen/grievances", icon: Wrench },
] as const;

function Help() {
  const { state } = useApp();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/help" });
  const [query, setQuery] = useState(search.q || "");
  const [searched, setSearched] = useState(search.q || "");
  const [grievanceId, setGrievanceId] = useState("");
  const [grievanceSearch, setGrievanceSearch] = useState("");
  const normalized = searched.trim().toLowerCase();
  const results = useMemo(
    () =>
      FAQ.filter(
        (item) =>
          !normalized ||
          `${item.category} ${item.question} ${item.answer}`
            .toLowerCase()
            .includes(normalized),
      ),
    [normalized],
  );
  const schemes = useMemo(
    () =>
      normalized
        ? SCHEMES.filter((scheme) =>
            `${scheme.name} ${scheme.description} ${scheme.category}`
              .toLowerCase()
              .includes(normalized),
          )
        : [],
    [normalized],
  );
  const grievance = grievanceSearch
    ? state.grievances.find((item) => item.id.toUpperCase() === grievanceSearch)
    : undefined;
  const searchHelp = (event: React.FormEvent) => {
    event.preventDefault();
    setSearched(query);
    void navigate({ search: { q: query.trim() || undefined } });
  };

  return (
    <PageContainer>
      <PageHeader
        eyebrow="MIRA SUPPORT"
        title="How can we help?"
        desc="Find answers, understand your applications, or get help with Mira services."
      />
      <MiraCard variant="elevated" className="mb-7 p-4 sm:p-5">
        <form onSubmit={searchHelp} role="search">
          <label
            htmlFor="help-search"
            className="text-sm font-medium text-foreground"
          >
            Search help articles, schemes or services
          </label>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="help-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try ‘documents’ or ‘application status’"
                className="pl-9 h-10"
              />
            </div>
            <Button type="submit" className="sm:min-w-28 h-10 tactile-btn">
              <Search className="h-4 w-4 mr-1.5" />
              Search
            </Button>
          </div>
        </form>
      </MiraCard>

      <section className="mb-8" aria-labelledby="help-topics-heading">
        <div className="mb-3">
          <h2
            id="help-topics-heading"
            className="text-lg font-semibold tracking-tight text-foreground"
          >
            Browse by topic
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Go directly to the Mira service related to your question.
          </p>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map(({ label, to, icon: Icon }) => (
            <Link
              to={to}
              key={label}
              className="group flex min-h-[72px] items-center gap-3 rounded-xl border border-border/70 bg-card p-3.5 transition-all duration-200 hover:border-primary/40 hover:shadow-xs active:scale-[0.99] tactile-card"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted/60 text-foreground transition-transform group-hover:scale-105">
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1 text-sm font-medium text-foreground">
                {label}
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(270px,0.8fr)]">
        <Panel
          title={
            normalized
              ? `Search results (${results.length + schemes.length})`
              : "Frequently asked questions"
          }
        >
          {results.length || schemes.length ? (
            <>
              {schemes.length > 0 && (
                <div className="mb-4 space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Matching schemes
                  </h3>
                  {schemes.slice(0, 4).map((scheme) => (
                    <Link
                      to="/schemes/$id"
                      params={{ id: scheme.id }}
                      key={scheme.id}
                      className="flex items-center justify-between gap-3 rounded-md border border-slate-200 p-3 text-sm hover:bg-stone-50"
                    >
                      <span className="font-medium text-slate-900">
                        {scheme.name}
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-slate-500" />
                    </Link>
                  ))}
                </div>
              )}
              {results.length > 0 && (
                <Accordion type="single" collapsible className="-mt-2">
                  {results.map((item, index) => (
                    <AccordionItem
                      key={item.question}
                      value={`faq-${index}`}
                      className="border-slate-200"
                    >
                      <AccordionTrigger className="py-4 text-left text-sm font-medium text-slate-900 hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="max-w-3xl text-sm leading-6 text-slate-600">
                        {item.answer}
                        <p className="mt-2 text-xs font-medium text-slate-500">
                          {item.category}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </>
          ) : (
            <Empty
              title="Can't find what you're looking for?"
              body="Try a shorter search or use one of the service links on this page."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery("");
                    setSearched("");
                    void navigate({ search: {} });
                  }}
                >
                  Clear search
                </Button>
              }
            />
          )}
        </Panel>

        <div className="space-y-4">
          <Panel title="Application support">
            <p className="text-sm leading-6 text-slate-600">
              Need to share an issue about an application or service? Open the
              existing grievance form and include the relevant reference if you
              have one.
            </p>
            <Button className="mt-4" asChild>
              <Link to="/citizen/grievances">
                Raise or track an issue
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Panel>
          <Panel title="Track a grievance">
            <p className="text-sm leading-6 text-slate-600">
              Use the reference from your grievance confirmation to check its
              current status.
            </p>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                setGrievanceSearch(grievanceId.trim().toUpperCase());
              }}
            >
              <Input
                aria-label="Grievance reference"
                value={grievanceId}
                onChange={(event) => setGrievanceId(event.target.value)}
                placeholder="Grievance reference"
              />
              <Button type="submit" size="icon" aria-label="Search grievance">
                <Search className="h-4 w-4" />
              </Button>
            </form>
            {grievanceSearch &&
              (grievance ? (
                <div
                  className="mt-3 rounded-md border border-slate-200 bg-stone-50 p-3"
                  role="status"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-xs text-slate-700">
                      {grievance.id}
                    </p>
                    <span className="text-xs font-medium text-slate-700">
                      {grievance.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-700">
                    {grievance.category}
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-600" role="status">
                  No grievance found with that reference.
                </p>
              ))}
            <Button variant="outline" className="mt-3" asChild>
              <Link to="/citizen/grievances">Open grievance center</Link>
            </Button>
          </Panel>
        </div>
      </div>
    </PageContainer>
  );
}
