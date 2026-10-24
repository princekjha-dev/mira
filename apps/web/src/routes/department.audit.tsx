import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/gov/ui";
import { AuditTable } from "@/components/gov/AuditTable";

export const Route = createFileRoute("/department/audit")({
  head: () => ({
    meta: [
      { title: "Audit Logs — Department" },
      {
        name: "description",
        content: "Append-only audit trail of all platform actions.",
      },
      { property: "og:title", content: "Department Audit Logs" },
      { property: "og:description", content: "Audit trail." },
    ],
  }),
  component: () => (
    <div>
      <PageHeader
        title="Audit Logs"
        desc="Includes officer decisions, rule changes and record verifications."
      />
      <AuditTable />
    </div>
  ),
});
