import { createFileRoute } from "@tanstack/react-router";
import { MailShell } from "@/components/mira/mail";

export const Route = createFileRoute("/department/inbox")({
  head: () => ({
    meta: [
      { title: "Communications — Department Administration" },
      {
        name: "description",
        content:
          "Official messages, citizen clarifications, assignments and departmental correspondence.",
      },
    ],
  }),
  component: DeptInboxPage,
});

function DeptInboxPage() {
  return (
    <MailShell
      title="Communications"
      subtitle="Official messages, citizen clarifications, assignments and departmental correspondence."
    />
  );
}
