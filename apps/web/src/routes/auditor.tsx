import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RequireRole } from "@/components/gov/ui";
import { WorkspaceShell } from "@/components/gov/WorkspaceShell";

export const Route = createFileRoute("/auditor")({ component: AuditorLayout });

function AuditorLayout() {
  return (
    <RequireRole role={["auditor", "admin"]}>
      <WorkspaceShell isAuditor={true}>
        <Outlet />
      </WorkspaceShell>
    </RequireRole>
  );
}
