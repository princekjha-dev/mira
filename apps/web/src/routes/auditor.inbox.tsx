import { createFileRoute } from "@tanstack/react-router";
import { MailShell } from "@/components/mira/mail";

export const Route = createFileRoute("/auditor/inbox")({
  head: () => ({
    meta: [
      { title: "Communications — Forensic Audit Authority" },
      { name: "description", content: "Official messages, citizen clarifications, assignments and departmental correspondence." },
    ],
  }),
  component: AuditorInboxPage,
});

function AuditorInboxPage() {
  return (
    <MailShell
      title="Communications"
      subtitle="Official messages, citizen clarifications, assignments and departmental correspondence."
    />
  );
}
