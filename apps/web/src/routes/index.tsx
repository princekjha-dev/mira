import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useId, useState } from "react";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Compass,
  FileCheck2,
  FilePlus2,
  FileUp,
  FolderArchive,
  History,
  ListChecks,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  UserPen,
  Building2,
  GraduationCap,
  HeartPulse,
  Sprout,
  Landmark,
  Baby,
  Briefcase,
  Trees,
  HandHeart,
  Check,
  Network,
} from "lucide-react";
import { useApp } from "@/lib/app-state";
import { CATEGORIES, CATEGORY_IMAGE, SCHEMES, type Category } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SchemeCard } from "@/components/gov/SchemeCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mira — Unified Citizen Welfare Platform" },
      {
        name: "description",
        content:
          "Public records, welfare schemes, and citizen benefits in one place. Discover eligible schemes, manage documents, submit applications and track decisions.",
      },
      {
        property: "og:title",
        content: "Mira — Unified Citizen Welfare Platform",
      },
      {
        property: "og:description",
        content:
          "Public records, welfare schemes, and citizen benefits in one place. Access household records, discover eligible schemes, and track applications.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

// 3 Hero images from /apps/web/public/hero
const HERO_IMAGES = [
  {
    src: "/hero/civic-1.jpg",
    alt: "Citizens and modern public welfare services",
  },
  {
    src: "/hero/civic-2.jpg",
    alt: "Families and community welfare support in India",
  },
  {
    src: "/hero/civic-3.jpg",
    alt: "Civic infrastructure and verified public documentation",
  },
];

const SEARCH_CATEGORIES = [
  "All Categories",
  "Schemes",
  "Services",
  "Benefits",
  "Applications",
  "Documents",
  "Help",
] as const;

type SearchCategory = (typeof SEARCH_CATEGORIES)[number];

// 8 Quick Actions specified in prompt
const QUICK_ACTIONS = [
  {
    to: "/schemes",
    title: "Explore Schemes",
    desc: "Browse central and state welfare initiatives",
    icon: Search,
  },
  {
    to: "/eligibility",
    title: "Check Eligibility",
    desc: "See exact criteria and rule-based matches",
    icon: ListChecks,
  },
  {
    to: "/schemes",
    title: "Apply for a Scheme",
    desc: "Apply with verified household details prefilled",
    icon: FilePlus2,
  },
  {
    to: "/track",
    title: "Track Application",
    desc: "Monitor application stages and officer actions",
    icon: Activity,
  },
  {
    to: "/citizen/family",
    title: "My Family Record",
    desc: "View verified household members and linkages",
    icon: Users,
  },
  {
    to: "/citizen/documents",
    title: "My Documents",
    desc: "Digital vault verified once and reusable across schemes",
    icon: FolderArchive,
  },
  {
    to: "/citizen/benefits",
    title: "Benefit History",
    desc: "Direct individual and household benefit disbursements",
    icon: History,
  },
  {
    to: "/citizen/family",
    title: "Update Family Details",
    desc: "Report life events, new dependents, or corrections",
    icon: UserPen,
  },
] as const;

// Category icons for Explore section
const CATEGORY_ICONS: Record<
  Category,
  React.ComponentType<{ className?: string }>
> = {
  Housing: Building2,
  Education: GraduationCap,
  Healthcare: HeartPulse,
  Agriculture: Sprout,
  Pension: Landmark,
  "Women & Child": Baby,
  Employment: Briefcase,
  "Rural Development": Trees,
  "Social Welfare": HandHeart,
};

// 5 Process steps specified in prompt
const PROCESS_STEPS = [
  {
    number: "01",
    title: "Verify Citizen",
    sub: "Secure identity verification",
    desc: "Verify identity securely with government-backed credentials and OTP authentication.",
    icon: ShieldCheck,
  },
  {
    number: "02",
    title: "Complete Family Record",
    sub: "Add and verify household details",
    desc: "Confirm household members, dependent relationships, and socioeconomic indicators.",
    icon: Users,
  },
  {
    number: "03",
    title: "Select Scheme",
    sub: "Find and choose eligible schemes",
    desc: "Discover matching central and state schemes with transparent eligibility criteria.",
    icon: Compass,
  },
  {
    number: "04",
    title: "Upload Documents",
    sub: "Submit required documents",
    desc: "Provide certified certificates once into your secure vault with automated format checks.",
    icon: FileUp,
  },
  {
    number: "05",
    title: "Track Decision",
    sub: "Monitor verification and final decision",
    desc: "Follow end-to-end officer review stages and receive direct entitlement disbursements.",
    icon: CheckCircle2,
  },
] as const;

function Index() {
  const { state } = useApp();
  const nav = useNavigate();
  const selectId = useId();

  // Hero carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategory, setSearchCategory] =
    useState<SearchCategory>("All Categories");

  // Preload hero images to avoid flicker
  useEffect(() => {
    HERO_IMAGES.forEach((item) => {
      const img = new Image();
      img.src = item.src;
    });
  }, []);

  // 2-second automatic transition
  useEffect(() => {
    // Respect prefers-reduced-motion and accessibility state
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches || state.reducedMotion) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [state.reducedMotion]);

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();

    if (
      searchCategory === "Schemes" ||
      searchCategory === "All Categories" ||
      searchCategory === "Services"
    ) {
      nav({
        to: "/schemes",
        search: query ? { q: query } : undefined,
      });
      return;
    }

    if (searchCategory === "Benefits") {
      nav({ to: "/citizen/benefits" });
      return;
    }

    if (searchCategory === "Applications") {
      if (
        query &&
        (query.toUpperCase().startsWith("APP-") || /^\d+$/.test(query))
      ) {
        nav({ to: "/track", search: { id: query } });
      } else {
        nav({ to: "/citizen/applications" });
      }
      return;
    }

    if (searchCategory === "Documents") {
      nav({ to: "/citizen/documents", search: { upload: false } });
      return;
    }

    if (searchCategory === "Help") {
      nav({
        to: "/help",
        search: query ? { q: query } : undefined,
      });
      return;
    }

    // Default fallback
    nav({ to: "/schemes", search: query ? { q: query } : undefined });
  };

  // Curate schemes count per category
  const schemeCounts = CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] = SCHEMES.filter((s) => s.category === cat).length;
      return acc;
    },
    {} as Record<Category, number>,
  );

  // Curated showcase of schemes
  const featuredSchemes = SCHEMES.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* =========================================================================
          HERO SECTION with 2-Second Smooth Carousel
         ========================================================================= */}
      <section className="relative w-full overflow-hidden bg-neutral-900 text-white min-h-[600px] sm:min-h-[650px] lg:min-h-[700px] flex items-center">
        {/* Carousel Background Images */}
        <div className="absolute inset-0 z-0">
          {HERO_IMAGES.map((img, idx) => {
            const isActive = idx === currentSlide;
            return (
              <div
                key={img.src}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive
                    ? "opacity-100 z-10"
                    : "opacity-0 z-0 pointer-events-none"
                }`}
                aria-hidden={!isActive}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="h-full w-full object-cover object-center transform-gpu will-change-transform"
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>
            );
          })}

          {/* Neutral charcoal gradients preserve the photograph while supporting legibility. */}
          <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/65 via-black/35 to-black/5" />
          <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
        </div>

        {/* Hero Foreground Content */}
        <div className="relative z-30 mx-auto w-full max-w-7xl px-4 sm:px-6 py-16 sm:py-20 lg:py-24 flex flex-col items-start">
          {/* Headline */}
          <h1 className="max-w-3xl text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.08]">
            Public records, welfare schemes and benefits, in one place.
          </h1>

          {/* Supporting Copy */}
          <p className="mt-5 max-w-2xl text-base sm:text-lg text-white/90 font-normal leading-relaxed">
            Access household records, discover eligible schemes, manage
            documents, submit applications and track decisions.
          </p>

          {/* Search Interface */}
          <div className="mt-8 w-full max-w-3xl">
            <form
              onSubmit={handleSearchSubmit}
              role="search"
              aria-label="Unified Search"
              className="rounded-2xl border border-white/75 bg-white p-2 sm:p-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.18)] transition-shadow duration-200 focus-within:ring-2 focus-within:ring-blue-500/35"
            >
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                {/* Search Icon & Input */}
                <div className="relative flex-1 flex items-center">
                  <Search className="absolute left-3.5 h-5 w-5 text-slate-400 pointer-events-none" />
                  <Input
                    id="hero-search-input"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search schemes, services, benefits or applications"
                    className="h-11 sm:h-12 w-full border-0 bg-transparent pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:ring-0 shadow-none font-normal"
                    aria-label="Search schemes, services, benefits or applications"
                  />
                </div>

                {/* Category Selector */}
                <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-slate-200/80 pt-2 sm:pt-0 sm:pl-2">
                  <label htmlFor={selectId} className="sr-only">
                    Select category
                  </label>
                  <select
                    id={selectId}
                    value={searchCategory}
                    onChange={(e) =>
                      setSearchCategory(e.target.value as SearchCategory)
                    }
                    className="h-10 sm:h-11 rounded-lg border-0 bg-stone-100 px-3 text-xs sm:text-sm font-medium text-slate-700 hover:bg-stone-200/80 focus:outline-none focus:ring-1 focus:ring-blue-500/40 cursor-pointer transition-colors"
                  >
                    {SEARCH_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>

                  {/* Search / Submit Button */}
                  <Button
                    type="submit"
                    className="h-10 sm:h-11 rounded-xl bg-blue-700 px-5 sm:px-6 text-sm font-medium text-white shadow-sm hover:bg-blue-800 transition-all active:scale-[0.98] shrink-0"
                  >
                    <Search className="mr-1.5 h-4 w-4" />
                    <span>Search</span>
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Discreet Carousel Indicators (Apple-style subtle pill indicators) */}
          <div
            className="mt-8 flex items-center gap-1.5"
            role="tablist"
            aria-label="Hero Carousel Slides"
          >
            {HERO_IMAGES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentSlide
                    ? "w-7 bg-white"
                    : "w-2 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === currentSlide}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          FLOATING QUICK ACTIONS PANEL (Inspired by reference)
         ========================================================================= */}
      <section
        className="relative z-30 -mt-8 sm:-mt-12 mx-auto w-full max-w-7xl px-4 sm:px-6"
        aria-label="Quick Actions"
      >
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-[0_12px_36px_rgba(15,23,42,0.08)] backdrop-blur-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div>
              <h2 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900">
                Citizen Quick Actions
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Direct access to key household and welfare services
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-gov">
              <Sparkles className="h-3.5 w-3.5" />
              Verified Public Services
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {QUICK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  to={action.to}
                  className="group relative flex items-start gap-3.5 rounded-xl border border-slate-200/80 bg-white p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:shadow-md"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 border border-blue-100 text-blue-700 shadow-2xs transition-colors duration-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-sm font-semibold text-slate-900 transition-colors">
                        {action.title}
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {action.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          GOVERNMENT SCHEMES SECTION
         ========================================================================= */}
      <section
        className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-20"
        aria-labelledby="schemes-heading"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 pb-8 border-b border-slate-200/80">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-gov">
              EXPLORE
            </span>
            <h2
              id="schemes-heading"
              className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-navy"
            >
              Government Schemes
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
              Discover schemes across education, healthcare, housing,
              agriculture, pension, employment and more.
            </p>
          </div>

          <Button
            variant="outline"
            size="lg"
            asChild
            className="self-start md:self-auto rounded-xl border-slate-300 hover:border-gov hover:bg-slate-50 text-navy font-medium"
          >
            <Link to="/schemes">
              <span>View All Schemes</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Categories Grid with Real Imagery */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat] ?? Compass;
            const img = CATEGORY_IMAGE[cat];
            const count = schemeCounts[cat] || 0;

            return (
              <Link
                key={cat}
                to="/schemes"
                search={{ category: cat }}
                className="group relative flex flex-col justify-end overflow-hidden rounded-xl border border-slate-200/90 bg-card p-4 h-40 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-gov/50"
              >
                {/* Background Image with Calm Gradient */}
                {img && (
                  <div className="absolute inset-0 z-0">
                    <img
                      src={img}
                      alt={cat}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent" />
                  </div>
                )}

                {/* Category Icon & Details */}
                <div className="relative z-10 text-white">
                  <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-md text-white border border-white/20">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-semibold tracking-tight text-white group-hover:underline">
                    {cat}
                  </h3>
                  <p className="text-[11px] text-white/80 mt-0.5">
                    {count > 0
                      ? `${count} ${count === 1 ? "scheme" : "schemes"}`
                      : "Eligible schemes"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Featured Real Schemes Showcase */}
        <div className="mt-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-navy">
                Featured Welfare Schemes
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Immediate eligibility verification with verified household
                records
              </p>
            </div>
            <Link
              to="/schemes"
              className="text-xs font-semibold text-gov hover:underline inline-flex items-center gap-1"
            >
              Browse all {SCHEMES.length} schemes
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredSchemes.map((scheme) => (
              <SchemeCard key={scheme.id} s={scheme} />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          "HOW MIRA WORKS" SECTION
         ========================================================================= */}
      <section
        className="border-y border-slate-200/80 bg-slate-50/70 py-20"
        aria-labelledby="process-heading"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold tracking-wider uppercase text-gov">
              TRANSPARENT ARCHITECTURE
            </span>
            <h2
              id="process-heading"
              className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-navy"
            >
              A simple, transparent process
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-muted-foreground leading-relaxed">
              From verification to benefits, Mira guides you at every step.
            </p>
          </div>

          {/* Process Timeline: Horizontal on Desktop, Vertical on Mobile */}
          <div className="relative">
            {/* Desktop Horizontal Connecting Line */}
            <div
              className="hidden lg:block absolute top-7 left-12 right-12 h-0.5 bg-slate-200 z-0"
              aria-hidden="true"
            />

            <ol className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-4 relative z-10">
              {PROCESS_STEPS.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <li
                    key={step.number}
                    className="relative flex flex-row lg:flex-col items-start lg:items-center text-left lg:text-center gap-4 lg:gap-0"
                  >
                    {/* Mobile Vertical Connecting Line */}
                    {idx < PROCESS_STEPS.length - 1 && (
                      <div
                        className="lg:hidden absolute top-14 left-7 bottom-0 w-0.5 -ml-px bg-slate-200"
                        aria-hidden="true"
                      />
                    )}

                    {/* Step Node with Number */}
                    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-slate-200 bg-white shadow-xs group-hover:border-navy transition-colors">
                      <span className="text-xs font-mono font-bold text-slate-400 absolute top-1.5 right-2">
                        {step.number}
                      </span>
                      <Icon className="h-5 w-5 text-navy" />
                    </div>

                    <div className="pt-2 lg:pt-4 min-w-0">
                      <h3 className="text-base font-semibold text-navy leading-snug">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-xs font-medium text-gov">
                        {step.sub}
                      </p>
                      <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Direct CTA underneath process */}
          <div className="mt-14 pt-8 border-t border-slate-200/60 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              asChild
              className="rounded-xl bg-navy hover:bg-navy/90 text-white px-7"
            >
              <Link to="/eligibility">
                <Check className="mr-2 h-4 w-4" />
                <span>Check Your Eligibility Now</span>
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="rounded-xl border-slate-300"
            >
              <Link to="/track">
                <span>Track an Application</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          CONSENT-BASED LINKING LAYER / WHY MIRA EXISTS
         ========================================================================= */}
      <section
        className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-20"
        aria-labelledby="why-mira"
      >
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1.3fr] items-center">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-gov">
              DATA SOVEREIGNTY & CITIZEN CONSENT
            </span>
            <h2
              id="why-mira"
              className="mt-1.5 text-2xl sm:text-3xl font-semibold tracking-tight text-navy"
            >
              Verified once, trusted everywhere
            </h2>
            <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              Today, a citizen&apos;s records sit fragmented across different
              line departments. Citizens are repeatedly asked to produce the
              same physical documents, and departments struggle to avoid
              duplication.
            </p>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
              Mira connects records through household and citizen identifiers
              with explicit consent. Each department retains statutory ownership
              of its data while enabling verified, friction-free delivery of
              welfare benefits.
            </p>

            <ul className="mt-6 space-y-3 text-sm text-slate-700">
              {[
                "Departments retain full ownership and statutory authority over their records",
                "Records are linked solely with citizen consent and an auditable access log",
                "Sensitive changes and scheme decisions are reviewed by verified officers",
                "Zero automated rejections — citizen grievances and reviews are protected",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <Check className="h-3 w-3 stroke-[2.5]" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                variant="outline"
                className="rounded-xl border-slate-300"
              >
                <Link to="/help">Read Architecture FAQs</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="rounded-xl text-gov hover:bg-slate-100"
              >
                <Link to="/officer/login">Officer & Department Login →</Link>
              </Button>
            </div>
          </div>

          {/* Interactive Consent Architecture Diagram */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6 shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              {[
                { title: "Civil Registration", sub: "Birth Records" },
                { title: "Identity Authority", sub: "Identity Info" },
                { title: "Family Register", sub: "Household Records" },
                { title: "Revenue & Land", sub: "Income & Land" },
              ].map((src) => (
                <div
                  key={src.title}
                  className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs"
                >
                  <p className="text-xs font-semibold text-navy">{src.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {src.sub}
                  </p>
                </div>
              ))}
            </div>

            <div className="my-4 flex items-center justify-center text-slate-400">
              <Network className="h-6 w-6 text-gov" />
            </div>

            <div className="rounded-xl border-2 border-navy bg-white p-4 text-center shadow-xs">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gov">
                <ShieldCheck className="h-4 w-4" />
                Consent-Based Linking Layer
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                References source records by verified citizen and household ID ·
                Verifies once · Audits every access
              </p>
            </div>

            <div className="my-4 flex items-center justify-center text-slate-400">
              <ArrowRight className="h-5 w-5 rotate-90 text-slate-400" />
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
              <Link
                to="/citizen/dashboard"
                className="rounded-lg bg-white border border-slate-200 p-2.5 font-medium text-navy hover:border-gov transition-colors"
              >
                Citizen Portal
              </Link>
              <Link
                to="/officer/login"
                className="rounded-lg bg-white border border-slate-200 p-2.5 font-medium text-navy hover:border-gov transition-colors"
              >
                Officer Review
              </Link>
              <Link
                to="/department"
                className="rounded-lg bg-white border border-slate-200 p-2.5 font-medium text-navy hover:border-gov transition-colors"
              >
                Department Rules
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
