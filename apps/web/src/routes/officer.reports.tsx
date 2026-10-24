import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/gov/ui";
import { Reports } from "@/components/gov/Reports";

export const Route = createFileRoute("/officer/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Officer" },
      { name: "description", content: "Operational reports for applications." },
      { property: "og:title", content: "Officer Reports" },
      { property: "og:description", content: "Application reports." },
    ],
  }),
  component: () => (
    <div>
      <PageHeader title="Reports" />
      <Reports />
    </div>
  ),
});
