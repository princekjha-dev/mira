import type { MessageThread, MailMessage, MailAttachment } from "@/lib/data";

export type MailFolder = "inbox" | "needs_action" | "sent" | "archived" | "starred";

export type CaseActivityFilter =
  | "evidence"
  | "field_visit"
  | "clarification"
  | "decision"
  | null;

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
  schemeId?: string;
  senderRole?: string;
  caseActivity?: CaseActivityFilter;
}

export function getCaseStatusConfig(status?: MessageThread["caseStatus"]) {
  switch (status) {
    case "awaiting_citizen":
    case "evidence_requested":
      return {
        label: status === "evidence_requested" ? "Evidence requested" : "Awaiting citizen response",
        className: "border-amber-300/80 bg-amber-50 text-amber-900 dark:border-amber-600/30 dark:bg-amber-950/40 dark:text-amber-300",
        dotClassName: "bg-amber-500",
      };
    case "awaiting_verification":
    case "field_visit_scheduled":
    case "under_review":
      return {
        label:
          status === "awaiting_verification"
            ? "Awaiting verification"
            : status === "field_visit_scheduled"
              ? "Field visit scheduled"
              : "Under review",
        className: "border-blue-300/80 bg-blue-50 text-blue-900 dark:border-blue-600/30 dark:bg-blue-950/40 dark:text-blue-300",
        dotClassName: "bg-blue-500",
      };
    case "verified":
    case "resolved":
    case "approved":
      return {
        label: status === "verified" ? "Verified" : status === "approved" ? "Approved" : "Resolved",
        className: "border-emerald-300/80 bg-emerald-50 text-emerald-900 dark:border-emerald-600/30 dark:bg-emerald-950/40 dark:text-emerald-300",
        dotClassName: "bg-emerald-500",
      };
    case "rejected":
    case "escalated":
      return {
        label: status === "rejected" ? "Rejected" : "Escalated",
        className: "border-rose-300/80 bg-rose-50 text-rose-900 dark:border-rose-600/30 dark:bg-rose-950/40 dark:text-rose-300",
        dotClassName: "bg-rose-500",
      };
    default:
      return {
        label: "Information only",
        className: "border-slate-300/80 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
        dotClassName: "bg-slate-400",
      };
  }
}

export function getRoleBadge(roleStr?: string) {
  switch (roleStr?.toLowerCase()) {
    case "verifier":
      return {
        label: "Verification Officer",
        className: "border-teal-500/20 bg-teal-500/10 text-teal-800 dark:text-teal-300",
      };
    case "officer":
      return {
        label: "Field Official",
        className: "border-blue-500/20 bg-blue-500/10 text-blue-800 dark:text-blue-300",
      };
    case "admin":
      return {
        label: "Department Admin",
        className: "border-purple-500/20 bg-purple-500/10 text-purple-800 dark:text-purple-300",
      };
    case "auditor":
      return {
        label: "Forensic Auditor",
        className: "border-slate-500/20 bg-slate-500/10 text-slate-800 dark:text-slate-300",
      };
    case "scheme":
      return {
        label: "Scheme Officer",
        className: "border-indigo-500/20 bg-indigo-500/10 text-indigo-800 dark:text-indigo-300",
      };
    default:
      return {
        label: "Citizen / Applicant",
        className: "border-slate-300/80 bg-slate-100 text-slate-700 dark:text-slate-300",
      };
  }
}

export function formatMailDate(isoOrDateStr: string): string {
  try {
    const d = new Date(isoOrDateStr.includes(" ") ? isoOrDateStr.replace(" ", "T") : isoOrDateStr);
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
    const d = new Date(isoOrDateStr.includes(" ") ? isoOrDateStr.replace(" ", "T") : isoOrDateStr);
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
