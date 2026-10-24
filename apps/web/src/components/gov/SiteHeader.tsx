import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bell,
  ChevronDown,
  Globe,
  LogIn,
  LogOut,
  Menu,
  Search,
  User,
  Accessibility,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-state";
import { LANGUAGES } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AccessibilityDialog } from "./AccessibilityDialog";
import { apiRequest } from "@/lib/api";

export function LanguageMenu({
  compact,
  light = false,
}: {
  compact?: boolean;
  light?: boolean;
}) {
  const { state, set, t } = useApp();
  const cur = LANGUAGES.find((l) => l.code === state.lang) ?? LANGUAGES[0];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 ${
          light
            ? "text-slate-300 hover:bg-white/10 hover:text-white"
            : "text-slate-700 hover:bg-slate-100/80 hover:text-navy"
        }`}
        aria-label={t("language")}
      >
        <Globe className="h-3.5 w-3.5 opacity-80" />
        {!compact && <span>{cur.label}</span>}
        <ChevronDown className="h-3 w-3 opacity-60" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>{t("language")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LANGUAGES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onSelect={() => {
              set({ lang: l.code });
              toast.success(`Language set to ${l.label}`);
            }}
            aria-current={l.code === state.lang}
            className="flex items-center justify-between"
          >
            {l.label}
            {l.code === state.lang && (
              <span className="text-xs text-gov font-bold">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SiteHeader() {
  const { state, t, logout } = useApp();
  const nav = useNavigate();
  const [a11y, setA11y] = useState(false);
  const [open, setOpen] = useState(false);
  const s = state.session;
  const unread = state.notifications.filter((n) => !n.read).length;
  const path = useRouterState({ select: (s) => s.location.pathname });
  const loginPage = path === "/login" || path === "/officer/login";

  // Canonical public services navigation:
  // Schemes, Eligibility, Benefits & Entitlements, Track Application, Help & Support
  const primaryNav = [
    { to: "/schemes", label: "Schemes" },
    { to: "/eligibility", label: "Eligibility" },
    { to: "/citizen/benefits", label: "Benefits & Entitlements" },
    { to: "/track", label: "Track Application" },
    { to: "/help", label: "Help & Support" },
  ] as const;

  const dashboard =
    s?.role === "officer"
      ? "/officer/dashboard"
      : s?.role === "admin"
        ? "/department/dashboard"
        : "/citizen/dashboard";

  const mobileNav = s
    ? [
        { to: dashboard, label: "My Dashboard" },
        { to: "/schemes", label: "Schemes & Benefits" },
        { to: "/eligibility", label: "Eligibility Criteria" },
        { to: "/citizen/benefits", label: "Benefits & Entitlements" },
        { to: "/citizen/applications", label: "My Applications" },
        { to: "/citizen/family", label: "My Family Record" },
        { to: "/citizen/documents", label: "My Documents" },
        { to: "/track", label: "Track Application" },
        { to: "/help", label: "Help & Support" },
      ]
    : [
        { to: "/", label: "Home" },
        { to: "/schemes", label: "Schemes" },
        { to: "/eligibility", label: "Eligibility" },
        { to: "/citizen/benefits", label: "Benefits & Entitlements" },
        { to: "/track", label: "Track Application" },
        { to: "/help", label: "Help & Support" },
      ];

  const doLogout = () => {
    if (s?.apiToken)
      void apiRequest(s, "/api/v1/auth/logout", { method: "POST" }).catch(
        () => undefined,
      );
    logout();
    toast.success("You have been signed out securely.");
    nav({ to: "/" });
  };

  const handleSearchClick = () => {
    if (path === "/") {
      const searchInput = document.getElementById("hero-search-input");
      if (searchInput) {
        searchInput.focus();
        searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }
    nav({ to: "/schemes" });
  };

  if (loginPage) {
    return (
      <header className="sticky top-0 z-40 border-b border-border/80 bg-white/90 backdrop-blur-md">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded-md focus:bg-card focus:p-3 focus:shadow-md"
        >
          {t("skip")}
        </a>
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 py-3.5">
          <Link
            to="/"
            className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            <img
              src="/miraicon.svg"
              alt="Mira Logo"
              className="h-8 w-8 rounded-lg object-contain shadow-xs"
              loading="eager"
            />
            <div className="flex flex-col">
              <span className="text-base font-semibold tracking-tight text-navy">
                Mira
              </span>
            </div>
          </Link>
          <nav
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
            aria-label={t("accessLabel")}
          >
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-8 text-xs font-medium text-slate-600 hover:text-navy hover:bg-slate-100/70"
            >
              <Link to="/">{t("home")}</Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-8 text-xs font-medium text-slate-600 hover:text-navy hover:bg-slate-100/70"
            >
              <Link to="/help">{t("help")}</Link>
            </Button>
            <LanguageMenu />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-600 hover:text-navy hover:bg-slate-100/70"
              onClick={() => setA11y(true)}
              aria-label={t("accessibility")}
              title={t("accessibility")}
            >
              <Accessibility className="h-4 w-4" />
            </Button>
          </nav>
        </div>
        <AccessibilityDialog open={a11y} onOpenChange={setA11y} />
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-200">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-2 focus:z-50 focus:rounded-md focus:bg-white focus:px-3 focus:py-2 focus:text-navy focus:shadow-md"
      >
        {t("skip")}
      </a>

      {/* Main Mira navigation */}
      <nav
        aria-label="Main Navigation"
        className="border-b border-slate-200/70 bg-white/95 shadow-[0_2px_12px_rgba(20,24,31,0.035)] backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 py-2.5">
          {/* Mira logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <img
              src="/miraicon.svg"
              alt="Mira Logo"
              className="h-8 w-8 object-contain transition-transform duration-200 group-hover:scale-105"
              loading="eager"
            />
            <div className="flex flex-col">
              <span className="text-base font-semibold tracking-tight text-navy group-hover:text-gov transition-colors">
                Mira
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <ul className="hidden md:flex items-center gap-1 lg:gap-2">
            {primaryNav.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-navy"
                  activeProps={{
                    className: "bg-slate-100/90 text-navy font-semibold",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side items */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search icon */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSearchClick}
              className="h-9 w-9 text-slate-700 hover:bg-slate-100 hover:text-navy rounded-lg"
              aria-label="Search schemes and services"
              title="Search"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Language selector */}
            <LanguageMenu />

            {/* Notifications (if signed in as citizen) */}
            {s?.role === "citizen" && (
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="h-9 w-9 text-slate-700 hover:bg-slate-100 relative rounded-lg"
                aria-label={`${t("notifications")} (${unread} unread)`}
              >
                <Link to="/citizen/notifications">
                  <Bell className="h-4 w-4" />
                  {unread > 0 && (
                    <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                      {unread}
                    </span>
                  )}
                </Link>
              </Button>
            )}

            {/* Sign In / User Profile */}
            {s ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-lg border-slate-200 text-slate-800 hover:bg-slate-50 font-medium"
                  >
                    <User className="h-3.5 w-3.5 text-gov" />
                    <span className="hidden max-w-28 truncate sm:inline text-xs font-semibold">
                      {s.name}
                    </span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>
                    <span className="block font-semibold text-navy">
                      {s.name}
                    </span>
                    <span className="block text-xs font-normal text-muted-foreground">
                      {s.id}
                    </span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => nav({ to: dashboard })}>
                    {t("dashboard")}
                  </DropdownMenuItem>
                  {s.role === "citizen" && (
                    <DropdownMenuItem
                      onSelect={() => nav({ to: "/citizen/settings" })}
                    >
                      {t("settings")}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={doLogout}
                    className="text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="hidden sm:inline-flex rounded-lg border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold px-3 h-8 shadow-2xs"
                >
                  <Link to="/schemes">
                    <span>Explore Schemes</span>
                  </Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="rounded-lg bg-navy hover:bg-navy/90 text-white font-medium px-3.5 h-8 shadow-xs transition-all duration-150"
                >
                  <Link to="/login">
                    <LogIn className="mr-1.5 h-3.5 w-3.5" />
                    <span>Sign In</span>
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile menu sheet */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-slate-700 md:hidden rounded-lg"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-80 p-0 flex flex-col bg-card"
              >
                <SheetHeader className="p-4 border-b border-border flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src="/miraicon.svg"
                      alt="Mira"
                      className="h-7 w-7 rounded-lg object-contain"
                    />
                    <SheetTitle className="text-base font-semibold text-navy">
                      Mira Navigation
                    </SheetTitle>
                  </div>
                </SheetHeader>

                <nav
                  className="flex-1 overflow-y-auto px-3 py-4 space-y-1"
                  aria-label="Mobile Navigation"
                >
                  {mobileNav.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-navy"
                      activeProps={{
                        className: "bg-slate-100 font-semibold text-navy",
                      }}
                      activeOptions={{ exact: l.to === "/" }}
                    >
                      <span>{l.label}</span>
                    </Link>
                  ))}

                  <div className="pt-4 border-t border-border mt-4">
                    <button
                      onClick={() => {
                        setOpen(false);
                        setA11y(true);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-100"
                    >
                      <Accessibility className="h-4 w-4 text-slate-500" />
                      <span>{t("accessibility")}</span>
                    </button>

                    {s ? (
                      <button
                        onClick={() => {
                          setOpen(false);
                          doLogout();
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-destructive hover:bg-destructive/10"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{t("logout")}</span>
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        onClick={() => setOpen(false)}
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-3 py-2.5 text-sm font-medium text-white shadow-xs"
                      >
                        <LogIn className="h-4 w-4" />
                        <span>Sign In</span>
                      </Link>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <AccessibilityDialog open={a11y} onOpenChange={setA11y} />
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-stone-50 text-slate-700">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <img
                src="/miraicon.svg"
                alt="Mira"
                className="h-8 w-8 object-contain"
                loading="lazy"
              />
              <span className="text-lg font-semibold tracking-tight text-slate-900">
                Mira
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Public records, welfare schemes and benefits, all in one place.
            </p>
          </div>

          {/* Services Column */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Services
            </p>
            <ul className="mt-3.5 space-y-2 text-sm text-slate-600">
              <li>
                <Link
                  to="/schemes"
                  className="hover:text-slate-900 transition-colors"
                >
                  Explore Schemes
                </Link>
              </li>
              <li>
                <Link
                  to="/eligibility"
                  className="hover:text-slate-900 transition-colors"
                >
                  Check Eligibility
                </Link>
              </li>
              <li>
                <Link
                  to="/track"
                  className="hover:text-slate-900 transition-colors"
                >
                  Track Application
                </Link>
              </li>
              <li>
                <Link
                  to="/citizen/benefits"
                  className="hover:text-slate-900 transition-colors"
                >
                  Benefit History
                </Link>
              </li>
            </ul>
          </div>

          {/* Citizen Services Column */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Your account
            </p>
            <ul className="mt-3.5 space-y-2 text-sm text-slate-600">
              <li>
                <Link
                  to="/citizen/family"
                  className="hover:text-slate-900 transition-colors"
                >
                  My Family Record
                </Link>
              </li>
              <li>
                <Link
                  to="/citizen/documents"
                  search={{ upload: false }}
                  className="hover:text-slate-900 transition-colors"
                >
                  Document Vault
                </Link>
              </li>
              <li>
                <Link
                  to="/citizen/applications"
                  className="hover:text-slate-900 transition-colors"
                >
                  My Applications
                </Link>
              </li>
              <li>
                <Link
                  to="/citizen/grievances"
                  className="hover:text-slate-900 transition-colors"
                >
                  Raise Grievance
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Support Column */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Support
            </p>
            <ul className="mt-3.5 space-y-2 text-sm text-slate-600">
              <li>
                <Link
                  to="/help"
                  className="hover:text-slate-900 transition-colors"
                >
                  Help & FAQs
                </Link>
              </li>
              <li>
                <Link
                  to="/officer/login"
                  className="hover:text-slate-900 transition-colors"
                >
                  Officer Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-5 text-xs text-slate-500 sm:flex-row">
          <p>© 2026 Mira</p>
          <Link to="/help" className="hover:text-slate-900">
            Help & support
          </Link>
        </div>
      </div>
    </footer>
  );
}
