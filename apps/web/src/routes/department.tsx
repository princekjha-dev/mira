import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BarChart3, FileStack, GitBranch, LayoutDashboard, Link2, ListTree, ScrollText, Workflow } from "lucide-react";
import { RequireRole } from "@/components/gov/ui";
import { WorkspaceShell, type NavItem } from "@/components/gov/WorkspaceShell";

export const Route = createFileRoute("/department")({ component: DeptLayout });

const ITEMS: NavItem[] = [
  { to: "/department/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/department/schemes", label: "Manage Schemes", icon: FileStack, exact: true },
  { to: "/department/rules", label: "Eligibility Rules", icon: ListTree },
  { to: "/department/schemes/rural-housing", label: "Required Documents & Workflow", icon: Workflow },
  { to: "/department/integrations", label: "Department Integrations", icon: Link2 },
  { to: "/department/reports", label: "Reports", icon: BarChart3 },
  { to: "/department/rules", label: "Rule Versions", icon: GitBranch },
  { to: "/department/audit", label: "Audit Logs", icon: ScrollText },
];

function DeptLayout() {
  return <RequireRole role="admin"><WorkspaceShell title="Department Portal" items={ITEMS} notifTo="/department/audit"><Outlet /></WorkspaceShell></RequireRole>;
}
