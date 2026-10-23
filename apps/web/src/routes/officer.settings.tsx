import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useApp } from "@/lib/app-state";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel } from "@/components/gov/ui";
import { AccessibilityControls } from "@/components/gov/AccessibilityDialog";

export const Route = createFileRoute("/officer/settings")({
  head: () => ({ meta: [{ title: "Settings — Officer" }, { name: "description", content: "Officer profile, security and accessibility settings." }, { property: "og:title", content: "Officer Settings" }, { property: "og:description", content: "Officer settings." }] }),
  component: S,
});

function S() {
  const { state } = useApp();
  return (
    <div className="space-y-4">
      <PageHeader title="Settings" />
      <Panel title="Officer profile"><dl className="grid gap-3 text-sm sm:grid-cols-2"><div><dt className="text-xs text-muted-foreground">Name</dt><dd>{state.session?.name}</dd></div><div><dt className="text-xs text-muted-foreground">Officer ID</dt><dd className="font-mono">{state.session?.id}</dd></div><div><dt className="text-xs text-muted-foreground">Department</dt><dd>{state.session?.department}</dd></div><div><dt className="text-xs text-muted-foreground">Role</dt><dd>Block Development Officer (Reviewer)</dd></div></dl></Panel>
      <Panel title="Security"><div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => toast.success("Password change link sent to your official email (demo)")}>Change password</Button><Button variant="outline" onClick={() => toast.success("All other sessions signed out")}>Sign out other sessions</Button></div></Panel>
      <Panel title="Accessibility"><AccessibilityControls /></Panel>
    </div>
  );
}
