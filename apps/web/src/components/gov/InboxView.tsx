import { MailShell } from "@/components/mira/mail";

interface InboxViewProps {
  title?: string;
  subtitle?: string;
  defaultApplicationId?: string;
}

export function InboxView({
  title = "Communications",
  subtitle = "Official messages, citizen clarifications, assignments and departmental correspondence.",
  defaultApplicationId,
}: InboxViewProps) {
  return (
    <MailShell
      title={title}
      subtitle={subtitle}
      defaultApplicationId={defaultApplicationId}
    />
  );
}
