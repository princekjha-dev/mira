import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RequireRole } from "@/components/gov/ui";
import { WorkspaceShell } from "@/components/gov/WorkspaceShell";

export const Route = createFileRoute("/verifier")({ component: VerifierLayout });

function VerifierLayout() {
  return (
    <RequireRole role={["verifier", "supervisor", "admin", "officer"]}>
      <WorkspaceShell>
        <Outlet />
      </WorkspaceShell>
    </RequireRole>
  );
}
