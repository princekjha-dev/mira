import { createFileRoute } from "@tanstack/react-router";
import { MailShell } from "@/components/mira/mail";

export const Route = createFileRoute("/officer/inbox")({
  head: () => ({
    meta: [
      { title: "Communications — Field Operational Workspace" },
      {
        name: "description",
        content:
          "Official messages, citizen clarifications, assignments and departmental correspondence.",
      },
    ],
  }),
  component: OfficerInboxPage,
});

function OfficerInboxPage() {
  return (
    <MailShell
      title="Communications"
      subtitle="Official messages, citizen clarifications, assignments and departmental correspondence."
    />
  );
}
