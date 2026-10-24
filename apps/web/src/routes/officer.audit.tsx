import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/gov/ui";
import { AuditTable } from "@/components/gov/AuditTable";

export const Route = createFileRoute("/officer/audit")({
  head: () => ({
    meta: [
      { title: "Audit Logs — Officer" },
      {
        name: "description",
        content: "Immutable activity history of all actions.",
      },
      { property: "og:title", content: "Audit Logs" },
      { property: "og:description", content: "Activity history." },
    ],
  }),
  component: () => (
    <div>
      <PageHeader
        title="Audit Logs"
        desc="Every action on applications and records, with previous and new states."
      />
      <AuditTable />
    </div>
  ),
});
