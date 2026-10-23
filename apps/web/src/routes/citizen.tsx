import { createFileRoute, Outlet } from "@tanstack/react-router";
import { RequireRole } from "@/components/gov/ui";
import { MiraShell } from "@/components/mira/MiraShell";

export const Route = createFileRoute("/citizen")({ component: CitizenLayout });

function CitizenLayout() {
  return (
    <RequireRole role="citizen">
      <MiraShell>
        <Outlet />
      </MiraShell>
    </RequireRole>
  );
}
