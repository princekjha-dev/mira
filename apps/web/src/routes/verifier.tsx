import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  LayoutDashboard,
  ListChecks,
  FileCheck2,
  AlertTriangle,
  Camera,
  Flag,
  Mail,
  ScrollText,
  Settings,
} from "lucide-react";
import { RequireRole } from "@/components/gov/ui";
import { WorkspaceShell, type NavItem } from "@/components/gov/WorkspaceShell";

export const Route = createFileRoute("/verifier")({ component: VerifierLayout });

const ITEMS: NavItem[] = [
  { to: "/verifier/dashboard", label: "Workstation Overview", icon: LayoutDashboard },
  { to: "/verifier/queue", label: "Verification Queue", icon: ListChecks },
  { to: "/verifier/documents", label: "Document Comparison", icon: FileCheck2 },
  { to: "/verifier/mismatches", label: "Mismatch Resolution", icon: AlertTriangle },
  { to: "/verifier/evidence", label: "Evidence Vault", icon: Camera },
  { to: "/verifier/escalations", label: "Escalations & Flags", icon: Flag },
  { to: "/verifier/inbox", label: "Communications", icon: Mail },
  { to: "/verifier/audit", label: "Audit Ledger", icon: ScrollText },
  { to: "/verifier/settings", label: "Workstation Config", icon: Settings },
];

function VerifierLayout() {
  return (
    <RequireRole role={["verifier", "admin", "officer"]}>
      <WorkspaceShell
        title="Verification Workstation"
        items={ITEMS}
        notifTo="/verifier/dashboard"
        inboxTo="/verifier/inbox"
      >
        <Outlet />
      </WorkspaceShell>
    </RequireRole>
  );
}
