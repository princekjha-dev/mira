import { createFileRoute } from "@tanstack/react-router";
import { MailShell } from "@/components/mira/mail";

export const Route = createFileRoute("/citizen/inbox")({
  head: () => ({
    meta: [
      { title: "Communications — Citizen Portal" },
      {
        name: "description",
        content:
          "Official messages, citizen clarifications, assignments and departmental correspondence.",
      },
    ],
  }),
  component: CitizenInboxPage,
});

function CitizenInboxPage() {
  return (
    <MailShell
      title="Communications"
      subtitle="Official messages, citizen clarifications, assignments and departmental correspondence."
    />
  );
}
