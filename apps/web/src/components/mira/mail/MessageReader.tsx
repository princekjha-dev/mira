import { useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  Star,
  Archive,
  MoreVertical,
  Reply,
  ArrowLeft,
  Mail,
  ShieldCheck,
  Copy,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Upload,
  FileCheck2,
  Calendar,
  Check,
  Flag,
  FileText,
  Building2,
  ArrowUpRight,
  Send,
  Loader2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-state";
import { type MessageThread, type MailAttachment } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConversationThread } from "./ConversationThread";
import { ReplyComposer } from "./ReplyComposer";
import { formatFullMailDate, getCaseStatusConfig, getRoleBadge } from "./types";
import { cn } from "@/lib/utils";

interface MessageReaderProps {
  thread: MessageThread | null;
  onBackToMobileList?: () => void;
  onToggleStar: (threadId: string) => void;
  onArchive: (threadId: string) => void;
  onMarkUnread?: (threadId: string) => void;
  onSendReply: (text: string, files?: File[]) => Promise<void> | void;
  onAttachmentPreview?: (attachment: MailAttachment) => void;
  replyRef?: React.RefObject<HTMLDivElement | null>;
}

export function MessageReader({
  thread,
  onBackToMobileList,
  onToggleStar,
  onArchive,
  onMarkUnread,
  onSendReply,
  onAttachmentPreview,
  replyRef,
}: MessageReaderProps) {
  const { state, sendMessage } = useApp();
  const [isSending, setIsSending] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadNote, setUploadNote] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const role = state.session?.role || "citizen";

  if (!thread) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-xs text-muted-foreground min-h-[400px]">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
          <Mail className="h-7 w-7" />
        </div>
        <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
          Select a communication thread
        </h3>
        <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">
          Choose an official message or case query from the list to review determinations and inspect case records.
        </p>
      </div>
    );
  }

  const roleInfo = getRoleBadge(thread.sender.role);
  const statusInfo = getCaseStatusConfig(thread.caseStatus);

  // Derive role-aware destination paths
  const appLink =
    role === "officer"
      ? `/officer/applications`
      : role === "verifier"
        ? `/verifier/queue`
        : role === "auditor"
          ? `/auditor/applications`
          : role === "admin"
            ? `/department/applications`
            : `/citizen/applications`;

  const auditUrl =
    role === "auditor"
      ? "/auditor/audit"
      : role === "verifier"
        ? "/verifier/audit"
        : role === "officer"
          ? "/officer/audit"
          : role === "admin"
            ? "/department/audit"
            : "/citizen/dashboard";

  const handleCopyAppId = () => {
    if (thread.applicationId) {
      navigator.clipboard.writeText(thread.applicationId);
      toast.success("Application ID copied to clipboard");
    }
  };

  const handleReplyDispatch = async (text: string, files?: File[]) => {
    setIsSending(true);
    try {
      await onSendReply(text, files);
    } finally {
      setIsSending(false);
    }
  };

  // Structured Action: Direct Document Upload Submission
  const handleDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !uploadNote.trim()) {
      toast.error("Please select a file or provide a clarification note");
      return;
    }

    setIsUploading(true);
    try {
      const docName = selectedFile ? selectedFile.name : `${thread.requestedDocType || "Document"}_Submission.pdf`;
      const docSize = selectedFile ? selectedFile.size : 185000;
      const docType = selectedFile ? selectedFile.type : "application/pdf";

      sendMessage({
        toEmail: thread.sender.email,
        toName: thread.sender.name,
        toRole: thread.sender.role,
        subject: `Re: ${thread.subject} - Evidence Submitted`,
        body: uploadNote.trim() || `Submitted requested document: ${thread.requestedDocType || "Income Certificate"} for verification under ${thread.applicationId}.`,
        applicationId: thread.applicationId,
        threadId: thread.id,
        attachments: [
          {
            id: `att-doc-${Date.now()}`,
            name: docName,
            size: docSize,
            type: docType,
          },
        ],
        updatedCaseStatus: "awaiting_verification",
        clearActionRequired: true,
        auditAction: `Uploaded requested document (${thread.requestedDocType || "Certificate"}) for ${thread.applicationId}`,
      });

      toast.success("Evidence submitted successfully", {
        description: "Case communication updated to 'Awaiting verification' and logged in audit ledger.",
      });

      setIsUploadModalOpen(false);
      setSelectedFile(null);
      setUploadNote("");
    } catch {
      toast.error("Failed to submit evidence");
    } finally {
      setIsUploading(false);
    }
  };

  // Structured Officer Actions
  const handleConfirmVisit = () => {
    sendMessage({
      toEmail: thread.recipient.email,
      toName: thread.recipient.name,
      toRole: thread.recipient.role,
      subject: `Confirmed: Inspection Visit for ${thread.applicationId}`,
      body: `Field inspection confirmed for ${thread.deadline || "Monday morning"}. Dwelling presence verified with household.`,
      applicationId: thread.applicationId,
      threadId: thread.id,
      updatedCaseStatus: "under_review",
      clearActionRequired: true,
      auditAction: `Field inspection confirmed for ${thread.applicationId}`,
    });
    toast.success("Field visit confirmed and recorded in audit ledger");
  };

  const handleMarkEvidenceReviewed = () => {
    sendMessage({
      toEmail: thread.recipient.email,
      toName: thread.recipient.name,
      toRole: thread.recipient.role,
      subject: `Evidence Verified: ${thread.applicationId}`,
      body: `Submitted evidence and documents verified against registry statutory criteria. Proceeding to determination stage.`,
      applicationId: thread.applicationId,
      threadId: thread.id,
      updatedCaseStatus: "verified",
      clearActionRequired: true,
      auditAction: `Evidence verified and accepted for ${thread.applicationId}`,
    });
    toast.success("Evidence marked as verified in case record");
  };

  const handleResolveCommunication = () => {
    sendMessage({
      toEmail: thread.recipient.email,
      toName: thread.recipient.name,
      toRole: thread.recipient.role,
      subject: `Resolved: ${thread.subject}`,
      body: `This official clarification query has been resolved and logged in statutory record.`,
      applicationId: thread.applicationId,
      threadId: thread.id,
      updatedCaseStatus: "resolved",
      clearActionRequired: true,
      auditAction: `Communication resolved for ${thread.applicationId}`,
    });
    toast.success("Official communication marked as resolved");
  };

  const handleEscalateCase = () => {
    sendMessage({
      toEmail: "supervisor@mira.local",
      toName: "Dr. Alok Nath",
      toRole: "supervisor",
      subject: `Escalation Notice: ${thread.applicationId}`,
      body: `Case escalated for supervisory adjudication regarding compliance tolerances on ${thread.schemeName || "Application"}.`,
      applicationId: thread.applicationId,
      threadId: thread.id,
      updatedCaseStatus: "escalated",
      auditAction: `Application escalated to supervisor for ${thread.applicationId}`,
    });
    toast.warning("Case escalated to supervisory queue");
  };

  const handleApproveSanction = () => {
    sendMessage({
      toEmail: thread.recipient.email,
      toName: thread.recipient.name,
      toRole: thread.recipient.role,
      subject: `Sanction Approved: ${thread.applicationId}`,
      body: `Departmental sanction has been approved. Formal sanction certificate issued to state beneficiary register.`,
      applicationId: thread.applicationId,
      threadId: thread.id,
      updatedCaseStatus: "approved",
      clearActionRequired: true,
      auditAction: `Sanction approved for ${thread.applicationId}`,
    });
    toast.success("Sanction approved and attested in state ledger");
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-slate-900">
      {/* ------------------------------------------------------------------ */}
      {/* Top Header & Context Bar                                           */}
      {/* ------------------------------------------------------------------ */}
      <header className="border-b border-slate-200/80 dark:border-slate-800 px-5 py-3.5 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0 flex-1">
            {/* Mobile Back Button */}
            {onBackToMobileList && (
              <button
                type="button"
                onClick={onBackToMobileList}
                className="md:hidden flex items-center gap-1 text-xs text-gov font-medium mb-1 hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Communications
              </button>
            )}

            {/* Subject Title */}
            <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {thread.subject}
            </h1>

            {/* Sender and Department Context */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {thread.sender.name}
              </span>
              <span className="text-slate-300 dark:text-slate-600">·</span>
              <span className="capitalize">{roleInfo.label}</span>
              {thread.sender.department && (
                <>
                  <span className="text-slate-300 dark:text-slate-600">·</span>
                  <span>{thread.sender.department}</span>
                </>
              )}
            </div>

            {/* Timestamp */}
            <div className="flex items-center gap-2 pt-0.5">
              <time className="text-[11px] text-muted-foreground font-mono tabular-nums">
                {formatFullMailDate(thread.timestamp)}
              </time>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleStar(thread.id)}
              className="h-8 w-8 text-slate-500 hover:text-amber-500 rounded-lg"
              title={thread.isStarred ? "Starred" : "Star"}
            >
              <Star
                className={cn(
                  "h-4 w-4",
                  thread.isStarred && "fill-amber-400 text-amber-500"
                )}
              />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onArchive(thread.id)}
              className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg"
              title="Archive thread"
            >
              <Archive className="h-4 w-4" />
            </Button>

            {/* More Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 text-xs">
                {onMarkUnread && (
                  <DropdownMenuItem
                    onClick={() => {
                      onMarkUnread(thread.id);
                      toast.success("Thread marked as unread");
                    }}
                  >
                    Mark as Unread
                  </DropdownMenuItem>
                )}
                {thread.applicationId && (
                  <DropdownMenuItem onClick={handleCopyAppId}>
                    Copy Application Reference
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={auditUrl as "/"}>
                    View Audit Ledger Record
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Main Continuous Reading Area                                       */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 scrollbar-thin">
        {/* ================================================================ */}
        {/* Section 8: Compact Case Context Summary Area                     */}
        {/* ================================================================ */}
        <div className="rounded-xl border border-slate-200/90 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/60 p-3.5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 dark:border-slate-800/80 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-500">
                CASE CONTEXT
              </span>
              {thread.auditRef && (
                <span className="font-mono text-[10px] text-muted-foreground">
                  ({thread.auditRef})
                </span>
              )}
            </div>

            {/* Clickable Audit Link */}
            <Link
              to={auditUrl as "/"}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
              title="Open verified audit record"
            >
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              <span>Recorded in audit history</span>
              <ExternalLink className="h-2.5 w-2.5 opacity-60" />
            </Link>
          </div>

          {/* 4-Column Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="block text-[10px] font-mono uppercase text-muted-foreground font-medium">
                Application
              </span>
              {thread.applicationId ? (
                <Link
                  to={appLink as "/"}
                  className="font-mono font-bold text-gov hover:underline flex items-center gap-1 mt-0.5"
                >
                  <span>{thread.applicationId}</span>
                  <ArrowUpRight className="h-3 w-3 shrink-0" />
                </Link>
              ) : (
                <span className="text-muted-foreground">Not attached</span>
              )}
            </div>

            <div>
              <span className="block text-[10px] font-mono uppercase text-muted-foreground font-medium">
                Scheme
              </span>
              {thread.schemeName ? (
                <Link
                  to={(thread.schemeId ? `/schemes/${thread.schemeId}` : "/schemes") as "/"}
                  className="font-semibold text-slate-900 dark:text-slate-100 hover:text-gov hover:underline flex items-center gap-1 mt-0.5 truncate"
                  title={thread.schemeName}
                >
                  <span className="truncate">{thread.schemeName}</span>
                  <ArrowUpRight className="h-3 w-3 shrink-0" />
                </Link>
              ) : (
                <span className="text-muted-foreground">General Service</span>
              )}
            </div>

            <div>
              <span className="block text-[10px] font-mono uppercase text-muted-foreground font-medium">
                Current Stage
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block mt-0.5">
                {thread.currentStage || "Document Verification"}
              </span>
            </div>

            <div>
              <span className="block text-[10px] font-mono uppercase text-muted-foreground font-medium">
                Status
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold border mt-0.5",
                  statusInfo.className
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", statusInfo.dotClassName)} />
                <span>{statusInfo.label}</span>
              </span>
            </div>
          </div>

          {/* Action Required Banner if active */}
          {thread.actionRequired && (
            <div className="flex items-start justify-between gap-3 rounded-lg border border-amber-300/90 bg-amber-500/10 p-2.5 text-xs text-amber-950 dark:border-amber-600/30 dark:bg-amber-950/40 dark:text-amber-200">
              <div className="flex items-start gap-2 min-w-0">
                <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-900 dark:text-amber-300">
                    ACTION REQUIRED:{" "}
                  </span>
                  <span className="font-medium">{thread.actionRequired}</span>
                  {thread.deadline && (
                    <span className="block text-[11px] font-mono text-amber-800/80 dark:text-amber-400/80 mt-0.5">
                      Statutory Deadline: {thread.deadline}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* Section 9: Structured Permission-Aware Action Buttons          */}
          {/* ============================================================== */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-800">
            {/* Citizen Actions */}
            {role === "citizen" && (
              <>
                {(thread.actionType === "upload_document" ||
                  thread.caseStatus === "awaiting_citizen" ||
                  thread.caseStatus === "evidence_requested") && (
                  <Button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="h-8 px-3 text-xs font-semibold rounded-lg bg-gov text-white hover:bg-gov/90 shadow-2xs gap-1.5 active:scale-95 transition-all"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Upload Requested Document</span>
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-8 px-3 text-xs font-medium rounded-lg border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Link to={appLink as "/"}>
                    <span>View Application</span>
                    <ArrowUpRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-8 px-3 text-xs font-medium rounded-lg border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Link to="/citizen/documents" search={{ upload: false }}>
                    <span>View Documents</span>
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    replyRef?.current?.scrollIntoView({ behavior: "smooth" });
                    replyRef?.current?.querySelector("textarea")?.focus();
                  }}
                  className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Reply className="h-3.5 w-3.5 mr-1" />
                  <span>Reply to Officer</span>
                </Button>
              </>
            )}

            {/* Field Official Actions */}
            {role === "officer" && (
              <>
                <Button
                  onClick={handleConfirmVisit}
                  size="sm"
                  className="h-8 px-3 text-xs font-semibold rounded-lg bg-gov text-white hover:bg-gov/90 gap-1.5"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Confirm Visit</span>
                </Button>

                <Button
                  onClick={handleMarkEvidenceReviewed}
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs font-medium rounded-lg"
                >
                  <FileCheck2 className="h-3.5 w-3.5 mr-1 text-gov" />
                  <span>Record Field Outcome</span>
                </Button>

                <Button
                  onClick={handleEscalateCase}
                  variant="outline"
                  size="sm"
                  className="h-8 px-2.5 text-xs text-rose-700 border-rose-200 dark:border-rose-800/60 dark:text-rose-400 hover:bg-rose-50"
                >
                  <Flag className="h-3.5 w-3.5 mr-1" />
                  <span>Escalate Case</span>
                </Button>
              </>
            )}

            {/* Verification Officer Actions */}
            {role === "verifier" && (
              <>
                <Button
                  onClick={handleMarkEvidenceReviewed}
                  size="sm"
                  className="h-8 px-3 text-xs font-semibold rounded-lg bg-gov text-white hover:bg-gov/90 gap-1.5"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Mark Evidence Reviewed</span>
                </Button>

                <Button
                  onClick={handleResolveCommunication}
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs font-medium rounded-lg"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                  <span>Resolve Communication</span>
                </Button>

                <Button
                  onClick={handleEscalateCase}
                  variant="outline"
                  size="sm"
                  className="h-8 px-2.5 text-xs text-rose-700 border-rose-200 dark:border-rose-800/60 dark:text-rose-400 hover:bg-rose-50"
                >
                  <Flag className="h-3.5 w-3.5 mr-1" />
                  <span>Escalate</span>
                </Button>
              </>
            )}

            {/* Department Administrator Actions */}
            {role === "admin" && (
              <>
                <Button
                  onClick={handleApproveSanction}
                  size="sm"
                  className="h-8 px-3 text-xs font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 gap-1.5"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Approve Sanction</span>
                </Button>

                <Button
                  onClick={handleResolveCommunication}
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs font-medium rounded-lg"
                >
                  <span>Resolve</span>
                </Button>

                <Button
                  onClick={handleEscalateCase}
                  variant="outline"
                  size="sm"
                  className="h-8 px-2.5 text-xs text-rose-700 border-rose-200 dark:border-rose-800/60 dark:text-rose-400 hover:bg-rose-50"
                >
                  <Flag className="h-3.5 w-3.5 mr-1" />
                  <span>Request Review</span>
                </Button>
              </>
            )}

            {/* Auditor Read-Only Inspection Mode */}
            {role === "auditor" && (
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-1 rounded border border-amber-300/60">
                  Read-Only Inspection Mode
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-8 px-3 text-xs font-medium rounded-lg"
                >
                  <Link to="/auditor/audit">
                    <ShieldCheck className="h-3.5 w-3.5 mr-1 text-gov" />
                    <span>View Audit Ledger</span>
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="h-8 px-3 text-xs font-medium rounded-lg"
                >
                  <Link to="/auditor/decisions">
                    <span>View Decision Records</span>
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Thread Messages */}
        <ConversationThread
          messages={thread.messages}
          onAttachmentPreview={onAttachmentPreview}
        />

        {/* Embedded Reply Composer (Not shown to Auditor since strictly read-only) */}
        {role !== "auditor" && (
          <div ref={replyRef} className="pt-2">
            <ReplyComposer
              recipientName={thread.sender.name}
              recipientEmail={thread.sender.email}
              recipientRole={thread.sender.role}
              applicationId={thread.applicationId}
              onSend={handleReplyDispatch}
              isSending={isSending}
            />
          </div>
        )}
      </div>

      {/* ================================================================== */}
      {/* Section 10: First-Class Document Request Upload Dialog              */}
      {/* ================================================================== */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-md p-5 rounded-2xl">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Upload className="h-4 w-4 text-gov" />
              <span>Upload Requested Evidence Document</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-normal">
              Directly submit the requested evidence for your active case. This upload preserves application reference and updates status to &apos;Awaiting verification&apos;.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleDocumentSubmit} className="space-y-3.5 pt-2">
            {/* Preserved Case Context Summary */}
            <div className="rounded-lg border border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/60 p-3 text-xs space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Application:</span>
                <span className="font-mono font-bold text-gov">{thread.applicationId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Scheme:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[220px]">
                  {thread.schemeName || "Welfare Scheme"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Requested Document:</span>
                <span className="font-semibold text-amber-900 dark:text-amber-300">
                  {thread.requestedDocType || "Income Certificate"}
                </span>
              </div>
            </div>

            {/* Document File Input */}
            <div className="space-y-1.5">
              <Label htmlFor="doc-upload" className="text-xs font-semibold">
                Select Document File (PDF, PNG, JPG)
              </Label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-gov dark:border-slate-700 dark:hover:border-gov rounded-xl p-4 text-center transition-colors bg-white dark:bg-slate-950"
              >
                <input
                  id="doc-upload"
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setSelectedFile(file);
                  }}
                />
                {selectedFile ? (
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-gov">
                    <FileText className="h-4 w-4" />
                    <span className="truncate max-w-[220px]">{selectedFile.name}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      ({Math.round(selectedFile.size / 1024)} KB)
                    </span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="h-6 w-6 text-slate-400 mx-auto" />
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Click to choose document or drop file here
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Maximum file size: 10 MB (Attested / Digital Copy)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Optional Clarification Note */}
            <div className="space-y-1.5">
              <Label htmlFor="doc-note" className="text-xs font-semibold">
                Notes for Verification Officer (Optional)
              </Label>
              <Textarea
                id="doc-note"
                value={uploadNote}
                onChange={(e) => setUploadNote(e.target.value)}
                placeholder="e.g. Uploaded updated digital certificate issued by Tehsil Sadar with clear revenue seal."
                rows={2}
                className="text-xs resize-none rounded-lg"
              />
            </div>

            <DialogFooter className="pt-2 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsUploadModalOpen(false)}
                className="rounded-lg text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isUploading}
                className="rounded-lg text-xs font-semibold bg-gov text-white hover:bg-gov/90"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    <span>Submitting Evidence…</span>
                  </>
                ) : (
                  <span>Submit Evidence</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
