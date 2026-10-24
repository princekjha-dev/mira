import type { MessageThread, MailMessage, MailAttachment } from "@/lib/data";

export type MailFolder = "inbox" | "starred" | "sent" | "archived";

export type WorkflowFilter =
  | "All"
  | "Action Required"
  | "Evidence"
  | "Field Visit"
  | "Schedule"
  | "Operations";

export type SortOrder = "newest" | "oldest" | "unread_first";

export interface MailFilterState {
  unreadOnly: boolean;
  hasAttachment: boolean;
  tag: WorkflowFilter | null;
  applicationId?: string;
  senderRole?: string;
}

export function formatMailDate(isoOrDateStr: string): string {
  try {
    const d = new Date(
      isoOrDateStr.includes(" ")
        ? isoOrDateStr.replace(" ", "T")
        : isoOrDateStr,
    );
    if (isNaN(d.getTime())) return isoOrDateStr;
    const now = new Date();
    const isToday =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();

    if (isToday) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return isoOrDateStr;
  }
}

export function formatFullMailDate(isoOrDateStr: string): string {
  try {
    const d = new Date(
      isoOrDateStr.includes(" ")
        ? isoOrDateStr.replace(" ", "T")
        : isoOrDateStr,
    );
    if (isNaN(d.getTime())) return isoOrDateStr;
    return d.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoOrDateStr;
  }
}
