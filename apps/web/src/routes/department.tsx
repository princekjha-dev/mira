import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RequireRole } from "@/components/gov/ui";
import { WorkspaceShell } from "@/components/gov/WorkspaceShell";

export const Route = createFileRoute("/department")({ component: DeptLayout });

function DeptLayout() {
  return (
    <RequireRole role={["admin", "supervisor", "scheme"]}>
      <WorkspaceShell>
        <Outlet />
      </WorkspaceShell>
    </RequireRole>
  );
}
