import { createFileRoute } from "@tanstack/react-router";
import { MailShell } from "@/components/mira/mail";

export const Route = createFileRoute("/verifier/inbox")({
  head: () => ({
    meta: [
      { title: "Communications — Verifier Workstation" },
      { name: "description", content: "Official messages, citizen clarifications, assignments and departmental correspondence." },
    ],
  }),
  component: VerifierInboxPage,
});

function VerifierInboxPage() {
  return (
    <MailShell
      title="Communications"
      subtitle="Official messages, citizen clarifications, assignments and departmental correspondence."
    />
  );
}
