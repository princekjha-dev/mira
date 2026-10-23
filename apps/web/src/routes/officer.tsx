import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AlertOctagon, BarChart3, Bell, ClipboardCheck, FileSearch, FileText, Home, LayoutDashboard, ListChecks, ScrollText, Settings, Users } from "lucide-react";
import { RequireRole } from "@/components/gov/ui";
import { WorkspaceShell, type NavItem } from "@/components/gov/WorkspaceShell";

export const Route = createFileRoute("/officer")({ component: OfficerLayout });

const ITEMS: NavItem[] = [
  { to: "/officer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/officer/applications", label: "Applications", icon: ClipboardCheck },
  { to: "/officer/verification", label: "Verification Queue", icon: ListChecks },
  { to: "/officer/duplicates", label: "Duplicate Alerts", icon: AlertOctagon },
  { to: "/officer/citizens/C-1001", label: "Citizen Records", icon: Users },
  { to: "/officer/families/HH-UP-0417-2291", label: "Family Records", icon: Home },
  { to: "/officer/documents", label: "Documents", icon: FileText },
  { to: "/schemes", label: "Schemes", icon: FileSearch },
  { to: "/officer/reports", label: "Reports", icon: BarChart3 },
  { to: "/officer/audit", label: "Audit Logs", icon: ScrollText },
  { to: "/officer/notifications", label: "Notifications", icon: Bell },
  { to: "/officer/settings", label: "Settings", icon: Settings },
];

function OfficerLayout() {
  return <RequireRole role="officer"><WorkspaceShell title="Officer Workspace" items={ITEMS} notifTo="/officer/notifications"><Outlet /></WorkspaceShell></RequireRole>;
}
