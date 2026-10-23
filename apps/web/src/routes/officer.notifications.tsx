import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/lib/app-state";
import { PageHeader } from "@/components/gov/ui";

export const Route = createFileRoute("/officer/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Officer" }, { name: "description", content: "Recent activity requiring officer attention." }, { property: "og:title", content: "Officer Notifications" }, { property: "og:description", content: "Officer alerts." }] }),
  component: N,
});

function N() {
  const { state } = useApp();
  return (
    <div>
      <PageHeader title="Notifications" desc="Recent activity on applications in your jurisdiction." />
      <ul className="divide-y rounded-lg border bg-card">{state.audit.slice(0, 12).map((a) => (
        <li key={a.id} className="p-4 text-sm"><p className="font-medium">{a.action}</p><p className="text-muted-foreground">{a.application} · {a.reason}</p><p className="text-xs text-muted-foreground">{a.ts} · {a.actor}</p>
          {a.application.startsWith("APP-") && <Link to="/officer/applications/$id" params={{ id: a.application }} className="text-xs text-gov hover:underline">Open application</Link>}</li>
      ))}</ul>
    </div>
  );
}
