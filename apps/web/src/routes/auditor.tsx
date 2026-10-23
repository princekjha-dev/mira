import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  ShieldAlert,
  LayoutDashboard,
  ScrollText,
  FileCheck2,
  FileSearch,
  Scale,
  Users2,
  BarChart3,
  DownloadCloud,
  Mail,
  Settings,
} from "lucide-react";
import { RequireRole } from "@/components/gov/ui";
import { WorkspaceShell, type NavItem } from "@/components/gov/WorkspaceShell";

export const Route = createFileRoute("/auditor")({ component: AuditorLayout });

const ITEMS: NavItem[] = [
  { to: "/auditor/dashboard", label: "Forensic Overview", icon: LayoutDashboard },
  { to: "/auditor/audit", label: "Audit Ledger", icon: ScrollText },
  { to: "/auditor/applications", label: "Applications Audit", icon: FileSearch },
  { to: "/auditor/decisions", label: "Hashed Decisions", icon: Scale },
  { to: "/auditor/evidence", label: "Evidence Vault", icon: FileCheck2 },
  { to: "/auditor/rules", label: "Eligibility Rule Audit", icon: Scale },
  { to: "/auditor/officers", label: "Officer Integrity", icon: Users2 },
  { to: "/auditor/reports", label: "Forensic Reports", icon: BarChart3 },
  { to: "/auditor/export", label: "Cryptographic Export", icon: DownloadCloud },
  { to: "/auditor/inbox", label: "Audit Communications", icon: Mail },
  { to: "/auditor/settings", label: "Audit Standards", icon: Settings },
];

function AuditorLayout() {
  return (
    <RequireRole role={["auditor", "admin"]}>
      <WorkspaceShell
        title="Forensic Audit Authority"
        items={ITEMS}
        notifTo="/auditor/dashboard"
        inboxTo="/auditor/inbox"
        isAuditor={true}
      >
        <Outlet />
      </WorkspaceShell>
    </RequireRole>
  );
}
