import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RequireRole } from "@/components/gov/ui";
import { WorkspaceShell } from "@/components/gov/WorkspaceShell";

export const Route = createFileRoute("/officer")({ component: OfficerLayout });

function OfficerLayout() {
  return (
    <RequireRole role={["officer", "scheme", "admin"]}>
      <WorkspaceShell>
        <Outlet />
      </WorkspaceShell>
    </RequireRole>
  );
}
