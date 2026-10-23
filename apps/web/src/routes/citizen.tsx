import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Bell, ClipboardList, FileText, Gift, Home, MessageSquareWarning, Settings, Users } from "lucide-react";
import { RequireRole } from "@/components/gov/ui";
import { useApp } from "@/lib/app-state";

export const Route = createFileRoute("/citizen")({ component: CitizenLayout });

function CitizenLayout() {
  const { t, state } = useApp();
  const unread = state.notifications.filter((n) => !n.read).length;
  const items = [
    { to: "/citizen/dashboard", label: t("dashboard"), icon: Home },
    { to: "/citizen/applications", label: t("myApplications"), icon: ClipboardList },
    { to: "/citizen/family", label: t("myFamily"), icon: Users },
    { to: "/citizen/documents", label: t("documents"), icon: FileText },
    { to: "/citizen/benefits", label: t("benefits"), icon: Gift },
    { to: "/citizen/notifications", label: `${t("notifications")}${unread ? ` (${unread})` : ""}`, icon: Bell },
    { to: "/citizen/grievances", label: t("grievances"), icon: MessageSquareWarning },
    { to: "/citizen/settings", label: t("settings"), icon: Settings },
  ] as const;
  const mobile = [items[0], items[1], items[2], items[3], items[5]];
  return (
    <RequireRole role="citizen">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 pb-24 md:pb-6">
        <aside className="hidden w-52 shrink-0 md:block">
          <nav className="sticky top-4 space-y-0.5 rounded-lg border bg-card p-2" aria-label="Citizen">
            {items.map((i) => <Link key={i.to} to={i.to} className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm hover:bg-muted" activeProps={{ className: "bg-secondary font-semibold text-navy" }}><i.icon className="h-4 w-4" />{i.label}</Link>)}
          </nav>
        </aside>
        <div className="min-w-0 flex-1"><Outlet /></div>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t bg-card md:hidden" aria-label="Citizen quick navigation">
        {mobile.map((i) => <Link key={i.to} to={i.to} className="flex flex-col items-center gap-0.5 py-2 text-[11px] text-muted-foreground" activeProps={{ className: "text-navy font-semibold" }}><i.icon className="h-5 w-5" /><span className="max-w-full truncate px-1">{i.label.replace(/ \(\d+\)/, "")}</span></Link>)}
      </nav>
    </RequireRole>
  );
}
