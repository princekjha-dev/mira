import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Building2,
  ClipboardList,
  FileStack,
  GitBranch,
  LayoutDashboard,
  Link2,
  ListTree,
  Mail,
  ScrollText,
  Settings,
  Workflow,
} from "lucide-react";
import { RequireRole } from "@/components/gov/ui";
import { WorkspaceShell, type NavItem } from "@/components/gov/WorkspaceShell";

export const Route = createFileRoute("/department")({ component: DeptLayout });

const ITEMS: NavItem[] = [
  { to: "/department/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    to: "/department/workflow",
    label: "Workflow Configurator",
    icon: Workflow,
  },
  {
    to: "/department/schemes",
    label: "Manage Schemes",
    icon: FileStack,
    exact: true,
  },
  { to: "/department/rules", label: "Eligibility Rules", icon: ListTree },
  {
    to: "/department/applications",
    label: "Department Applications",
    icon: ClipboardList,
  },
  {
    to: "/department/operations",
    label: "Operations & SLA Health",
    icon: Activity,
  },
  {
    to: "/department/departments",
    label: "Directorate Directory",
    icon: Building2,
  },
  { to: "/department/integrations", label: "Integrations & APIs", icon: Link2 },
  { to: "/department/inbox", label: "Communications", icon: Mail },
  { to: "/department/reports", label: "Reports & Analytics", icon: BarChart3 },
  { to: "/department/audit", label: "Audit Ledger", icon: ScrollText },
  { to: "/department/settings", label: "Policy Settings", icon: Settings },
];

function DeptLayout() {
  return (
    <RequireRole role={["admin", "supervisor"]}>
      <WorkspaceShell
        title="Department Administration"
        items={ITEMS}
        notifTo="/department/notifications"
        inboxTo="/department/inbox"
      >
        <Outlet />
      </WorkspaceShell>
    </RequireRole>
  );
}
