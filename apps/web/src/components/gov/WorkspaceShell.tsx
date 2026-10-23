import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Bell, LogOut, Menu, PanelLeftClose, PanelLeftOpen, Search, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Emblem } from "./ui";
import { LanguageMenu } from "./SiteHeader";

export interface NavItem { to: string; label: string; icon: LucideIcon; exact?: boolean }

export function WorkspaceShell({ title, items, children, notifTo }: { title: string; items: NavItem[]; children: ReactNode; notifTo: string }) {
  const { state, logout } = useApp();
  const nav = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [q, setQ] = useState("");

  const sideNav = (onClick?: () => void, mini = false) => (
    <nav className="flex flex-col gap-0.5 p-2" aria-label={title}>
      {items.map((it) => (
        <Link key={it.to + it.label} to={it.to as "/"} onClick={onClick} title={it.label}
          className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent", mini && "justify-center px-2")}
          activeProps={{ className: "bg-sidebar-accent font-semibold text-sidebar-accent-foreground" }} activeOptions={{ exact: it.exact }}>
          <it.icon className="h-4 w-4 shrink-0" />{!mini && it.label}
        </Link>
      ))}
    </nav>
  );

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    const v = q.trim().toUpperCase();
    if (!v) return;
    const app = state.applications.find((a) => a.id === v || a.applicant.toUpperCase().includes(v));
    if (app && state.session?.role === "officer") nav({ to: "/officer/applications/$id", params: { id: app.id } });
    else if (v.startsWith("HH-")) nav({ to: "/officer/families/$id", params: { id: v } });
    else if (v.startsWith("C-")) nav({ to: "/officer/citizens/$id", params: { id: v } });
    else toast.error(`No record found for “${q}”`, { description: "Try an Application ID (APP-…), Citizen ID (C-…) or Household ID (HH-…)." });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className={cn("sticky top-0 hidden h-screen shrink-0 flex-col bg-sidebar md:flex", collapsed ? "w-16" : "w-60")}>
        <div className="flex items-center gap-2 border-b border-sidebar-border px-3 py-3">
          <Emblem className="h-8 w-8 shrink-0" />
          {!collapsed && <div className="leading-tight text-sidebar-foreground"><p className="text-sm font-semibold">{title}</p><p className="text-[10px] opacity-75">Unified Public Documentation</p></div>}
        </div>
        <div className="flex-1 overflow-y-auto">{sideNav(undefined, collapsed)}</div>
        <button onClick={() => setCollapsed(!collapsed)} className="flex items-center gap-2 border-t border-sidebar-border px-4 py-3 text-xs text-sidebar-foreground hover:bg-sidebar-accent" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <><PanelLeftClose className="h-4 w-4" />Collapse</>}
        </button>
      </aside>
      <Sheet open={mobile} onOpenChange={setMobile}>
        <SheetContent side="left" className="w-64 bg-sidebar p-0">
          <SheetHeader className="border-b border-sidebar-border"><SheetTitle className="text-sidebar-foreground">{title}</SheetTitle></SheetHeader>
          {sideNav(() => setMobile(false))}
        </SheetContent>
      </Sheet>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-card px-4 py-2.5">
          <Button variant="outline" size="icon" className="md:hidden" onClick={() => setMobile(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></Button>
          <form onSubmit={search} className="relative max-w-md flex-1" role="search">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search application, citizen or household ID" className="pl-8" aria-label="Global search" />
          </form>
          <span className="hidden truncate rounded border bg-muted px-2 py-1 text-xs lg:inline">{state.session?.department ?? "Department"}</span>
          <div className="ml-auto flex items-center gap-1 text-foreground">
            <LanguageMenu compact />
            <Button variant="ghost" size="icon" asChild aria-label="Notifications"><Link to={notifTo as "/"}><Bell className="h-5 w-5" /></Link></Button>
            <div className="hidden text-right text-xs leading-tight sm:block"><p className="font-medium">{state.session?.name}</p><p className="text-muted-foreground">{state.session?.id}</p></div>
            <Button variant="ghost" size="icon" aria-label="Logout" onClick={() => { logout(); toast.success("Logged out"); nav({ to: "/" }); }}><LogOut className="h-5 w-5" /></Button>
          </div>
        </header>
        <main id="main" className="mx-auto w-full max-w-7xl flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
