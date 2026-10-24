import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useState, useEffect, type ReactNode } from "react";
import {
  Bell,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Mail,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-state";
import { getRoleConfig, type RoleNavItem } from "@/lib/role-config";
import { GlobalSearchDialog } from "@/components/gov/GlobalSearchDialog";
import { MiraAIOrb } from "@/components/mira/MiraAIOrb";
import { AccountMenu } from "@/components/mira/profile/AccountMenu";
import { LanguageMenu } from "@/components/gov/SiteHeader";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface MiraShellProps {
  children: ReactNode;
  title?: string;
  items?: RoleNavItem[];
  isReadOnly?: boolean;
}

export function MiraShell({
  children,
  title,
  items,
  isReadOnly,
}: MiraShellProps) {
  const { state, logout } = useApp();
  const nav = useNavigate();
  const location = useLocation();

  const role = state.session?.role || "citizen";
  const roleConfig = getRoleConfig(role);

  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navItems = items || roleConfig.navItems;
  const workspaceTitle = title || roleConfig.workspaceTitle;
  const isAuditorMode =
    isReadOnly ?? (role === "auditor" || roleConfig.isReadOnly);

  // Unread badge counters
  const unreadMessages =
    state.messages?.filter((m) => m.status === "unread").length || 0;
  const unreadNotifs = state.notifications?.filter((n) => !n.read).length || 0;
  const mismatchesCount =
    state.applications?.filter((a) => !!a.mismatch).length || 0;

  // Global Keyboard Shortcut (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const getBadgeCount = (badgeType?: RoleNavItem["badge"]) => {
    if (badgeType === "unreadMessages") return unreadMessages;
    if (badgeType === "unreadNotifications") return unreadNotifs;
    if (badgeType === "mismatches") return mismatchesCount;
    return 0;
  };

  const renderNavLinks = (onItemClick?: () => void, isMini = false) => (
    <nav className="flex flex-col gap-1.5 p-2" aria-label={workspaceTitle}>
      {navItems.map((item) => {
        const badgeCount = getBadgeCount(item.badge);
        const isActive =
          location.pathname === item.to ||
          (item.to !== "/" &&
            !item.exact &&
            location.pathname.startsWith(item.to));

        const linkEl = (
          <Link
            key={item.id + item.to}
            to={item.to as "/"}
            onClick={onItemClick}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl transition-all duration-150 text-xs font-medium",
              isMini ? "h-11 w-11 justify-center px-0" : "h-10 px-3",
              isActive
                ? "bg-slate-900 text-white shadow-xs dark:bg-slate-100 dark:text-slate-950"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
            )}
            activeOptions={{ exact: item.exact }}
          >
            {/* Active Indicator Pip */}
            {isActive && !isMini && (
              <span className="absolute left-1 h-4 w-1 rounded-full bg-primary" />
            )}

            <item.icon
              className={cn(
                "h-4 w-4 shrink-0 transition-transform duration-150 group-hover:scale-105",
                isActive
                  ? "text-white dark:text-slate-950"
                  : "text-muted-foreground group-hover:text-foreground",
              )}
            />

            {!isMini && <span className="truncate flex-1">{item.label}</span>}

            {/* Badge Indicator */}
            {badgeCount > 0 && (
              <span
                className={cn(
                  "flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold",
                  isActive
                    ? "bg-white/20 text-white dark:bg-slate-900 dark:text-white"
                    : "bg-primary/10 text-primary",
                )}
              >
                {badgeCount}
              </span>
            )}
          </Link>
        );

        if (isMini) {
          return (
            <Tooltip key={item.id} delayDuration={100}>
              <TooltipTrigger asChild>{linkEl}</TooltipTrigger>
              <TooltipContent
                side="right"
                className="text-xs font-medium flex items-center gap-2"
              >
                <span>{item.label}</span>
                {badgeCount > 0 && (
                  <span className="rounded-full bg-primary/20 px-1.5 py-0.2 text-[10px] text-primary">
                    {badgeCount}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          );
        }

        return linkEl;
      })}
    </nav>
  );

  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-slate-50/70 dark:bg-slate-950 text-foreground selection:bg-primary/10 selection:text-primary">
        {/* Global Search Dialog */}
        <GlobalSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

        {/* ------------------------------------------------------------------ */}
        {/* Desktop Slim Floating Navigation Rail                              */}
        {/* ------------------------------------------------------------------ */}
        <div className="sticky top-0 hidden h-screen p-3 sm:flex flex-col z-30 shrink-0">
          <aside
            className={cn(
              "flex h-full flex-col rounded-2xl border border-border/80 bg-card/90 shadow-sm backdrop-blur-md transition-all duration-200",
              expanded ? "w-60" : "w-15 items-center",
            )}
          >
            {/* Brand Logo & Context */}
            <div
              className={cn(
                "flex h-14 items-center border-b border-border/70",
                expanded
                  ? "w-full justify-between px-3.5"
                  : "w-full justify-center px-0",
              )}
            >
              <Link
                to="/"
                className="flex items-center gap-2.5 transition-transform active:scale-95"
              >
                <img
                  src="/miraicon.svg"
                  alt="Mira"
                  className="h-8 w-8 rounded-xl object-contain shadow-2xs"
                />
                {expanded && (
                  <div className="min-w-0 leading-tight">
                    <span className="block font-bold tracking-tight text-sm text-foreground">
                      Mira
                    </span>
                    <span className="block truncate text-[10px] text-muted-foreground">
                      Unified Platform
                    </span>
                  </div>
                )}
              </Link>
            </div>

            {/* Scrollable Nav Items */}
            <div className="flex-1 w-full overflow-y-auto overflow-x-hidden py-2 scrollbar-none">
              {renderNavLinks(undefined, !expanded)}
            </div>

            {/* Bottom Expand / Collapse Rail Toggle */}
            <div className="w-full border-t border-border/70 p-2">
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className={cn(
                  "flex h-10 w-full items-center rounded-xl text-muted-foreground hover:bg-muted/70 hover:text-foreground transition-colors text-xs font-medium",
                  expanded ? "px-3 gap-2" : "justify-center",
                )}
                aria-label={
                  expanded
                    ? "Collapse navigation rail"
                    : "Expand navigation rail"
                }
              >
                {expanded ? (
                  <>
                    <PanelLeftClose className="h-4 w-4 shrink-0" />
                    <span>Collapse Rail</span>
                  </>
                ) : (
                  <Tooltip delayDuration={150}>
                    <TooltipTrigger asChild>
                      <PanelLeftOpen className="h-4 w-4 shrink-0" />
                    </TooltipTrigger>
                    <TooltipContent side="right" className="text-xs">
                      Expand Navigation
                    </TooltipContent>
                  </Tooltip>
                )}
              </button>
            </div>
          </aside>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Mobile Navigation Drawer                                           */}
        {/* ------------------------------------------------------------------ */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-68 bg-card p-0">
            <SheetHeader className="border-b border-border/80 p-4">
              <div className="flex items-center gap-2.5">
                <img
                  src="/miraicon.svg"
                  alt="Mira"
                  className="h-8 w-8 rounded-xl object-contain"
                />
                <SheetTitle className="text-left text-sm font-bold">
                  {workspaceTitle}
                </SheetTitle>
              </div>
            </SheetHeader>
            <div className="overflow-y-auto py-2">
              {renderNavLinks(() => setMobileOpen(false), false)}
            </div>
          </SheetContent>
        </Sheet>

        {/* ------------------------------------------------------------------ */}
        {/* Main Content Area                                                  */}
        {/* ------------------------------------------------------------------ */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Auditor Read-Only Forensic Warning Banner */}
          {isAuditorMode && (
            <div className="flex items-center justify-between border-b border-amber-300/40 bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-800 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-300">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>
                  FORENSIC AUDIT WORKSPACE — STRICT READ-ONLY ACCESS
                  (APPLICATION STATE MUTATIONS DISABLED)
                </span>
              </div>
              <span className="hidden font-mono text-[10px] opacity-75 sm:inline">
                ISO/IEC 27001 COMPLIANCE
              </span>
            </div>
          )}

          {/* Clean Top Bar */}
          <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border/80 bg-card/80 px-4 sm:px-6 backdrop-blur-md">
            {/* Mobile Menu Trigger */}
            <Button
              variant="outline"
              size="icon"
              className="sm:hidden h-9 w-9 rounded-xl"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="h-4 w-4" />
            </Button>

            {/* Workspace Context Tag */}
            <div className="hidden items-center gap-2 lg:flex">
              <span className="text-xs font-bold tracking-tight text-foreground">
                {workspaceTitle}
              </span>
              <span className="text-muted-foreground/40">/</span>
              <span className="text-[11px] text-muted-foreground">
                {roleConfig.subtitle}
              </span>
            </div>

            {/* Global Search Center Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-9 w-full max-w-sm sm:max-w-md items-center gap-2.5 rounded-xl border border-input/70 bg-background/80 px-3 text-xs text-muted-foreground shadow-2xs transition-all hover:bg-accent/60 hover:text-foreground"
            >
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="flex-1 text-left truncate">Search Mira…</span>
              <kbd className="pointer-events-none hidden h-5 select-none items-center gap-0.5 rounded border border-border/80 bg-muted/60 px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>

            {/* Right-aligned Navigation Controls */}
            <div className="ml-auto flex items-center gap-1 text-foreground">
              <LanguageMenu compact />

              {/* Notification Bell */}
              <Tooltip delayDuration={150}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="relative h-9 w-9 rounded-xl"
                  >
                    <Link
                      to="/citizen/notifications"
                      aria-label="Notifications"
                    >
                      <Bell className="h-4 w-4" />
                      {unreadNotifs > 0 && (
                        <span className="absolute right-1.5 top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
                          {unreadNotifs}
                        </span>
                      )}
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-xs">
                  Notifications
                </TooltipContent>
              </Tooltip>

              {/* Interactive User Account Menu */}
              <div className="border-l border-border/80 pl-2 ml-1">
                <AccountMenu />
              </div>
            </div>
          </header>

          {/* Workspace Canvas */}
          <main
            id="main"
            className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8 animate-in fade-in duration-150"
          >
            {children}
          </main>
        </div>

        {/* Global Floating Mira AI Orb */}
        <MiraAIOrb />
      </div>
    </TooltipProvider>
  );
}
