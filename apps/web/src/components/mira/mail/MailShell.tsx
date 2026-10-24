import { useState, useMemo, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-state";
import { type MessageThread, type MailAttachment } from "@/lib/data";
import { MailSidebar } from "./MailSidebar";
import { MailToolbar } from "./MailToolbar";
import { MessageList } from "./MessageList";
import { MessageReader } from "./MessageReader";
import { ComposeSheet } from "./ComposeSheet";
import {
  type MailFolder,
  type WorkflowFilter,
  type MailFilterState,
  type SortOrder,
  type CaseActivityFilter,
} from "./types";
import { cn } from "@/lib/utils";

interface MailShellProps {
  title?: string;
  subtitle?: string;
  defaultApplicationId?: string;
}

export function MailShell({
  title = "Communications",
  subtitle = "Official messages, citizen clarifications, assignments and departmental correspondence.",
  defaultApplicationId,
}: MailShellProps) {
  const {
    state,
    sendMessage,
    markMessageRead,
    toggleStarMessage,
    archiveMessage,
  } = useApp();

  const [activeFolder, setActiveFolder] = useState<MailFolder>("inbox");
  const [activeActivity, setActiveActivity] = useState<CaseActivityFilter>(null);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(
    () => state.messages[0]?.id || null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [filter, setFilter] = useState<MailFilterState>({
    unreadOnly: false,
    hasAttachment: false,
    tag: null,
    applicationId: undefined,
  });
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [mobileView, setMobileView] = useState<"folders" | "list" | "reader">("list");

  const searchInputRef = useRef<HTMLInputElement>(null);
  const replyRef = useRef<HTMLDivElement>(null);

  // Keyboard shortcuts (c = compose, r = reply, e = archive, / = search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement;

      if (isInput) return;

      if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        setIsComposeOpen(true);
      } else if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        replyRef.current?.scrollIntoView({ behavior: "smooth" });
        const textarea = replyRef.current?.querySelector("textarea");
        textarea?.focus();
      } else if (e.key === "e" || e.key === "E") {
        if (selectedThreadId) {
          e.preventDefault();
          archiveMessage(selectedThreadId);
          toast.success("Thread archived");
        }
      } else if (e.key === "/") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedThreadId, archiveMessage]);

  // Compute available application IDs
  const availableApplications = useMemo(() => {
    const set = new Set<string>();
    state.messages.forEach((m) => {
      if (m.applicationId) set.add(m.applicationId);
    });
    return Array.from(set);
  }, [state.messages]);

  // Folder and case activity counts
  const folderCounts = useMemo(() => {
    return {
      inbox: state.messages.filter(
        (m) => (!m.folder || m.folder === "inbox") && !m.isArchived
      ).length,
      needs_action: state.messages.filter(
        (m) =>
          !m.isArchived &&
          (!!m.actionRequired ||
            m.caseStatus === "awaiting_citizen" ||
            m.caseStatus === "evidence_requested")
      ).length,
      sent: state.messages.filter((m) => m.folder === "sent").length,
      archived: state.messages.filter((m) => !!m.isArchived).length,
    };
  }, [state.messages]);

  const activityCounts = useMemo(() => {
    return {
      evidence: state.messages.filter(
        (m) =>
          !m.isArchived &&
          (m.caseType === "evidence_request" || m.tags?.includes("Evidence"))
      ).length,
      field_visit: state.messages.filter(
        (m) =>
          !m.isArchived &&
          (m.caseType === "field_visit" || m.tags?.includes("Field Visit"))
      ).length,
      clarification: state.messages.filter(
        (m) => !m.isArchived && m.caseType === "clarification"
      ).length,
      decision: state.messages.filter(
        (m) => !m.isArchived && m.caseType === "decision"
      ).length,
    };
  }, [state.messages]);

  // Filtered and Sorted Threads
  const filteredThreads = useMemo(() => {
    const filtered = state.messages.filter((thread) => {
      // 1. Folder check
      if (activeFolder === "starred" && !thread.isStarred) return false;
      if (activeFolder === "archived" && !thread.isArchived) return false;
      if (activeFolder === "sent" && thread.folder !== "sent") return false;
      if (activeFolder === "needs_action") {
        if (thread.isArchived) return false;
        if (
          !thread.actionRequired &&
          thread.caseStatus !== "awaiting_citizen" &&
          thread.caseStatus !== "evidence_requested"
        ) {
          return false;
        }
      }
      if (
        activeFolder === "inbox" &&
        (thread.isArchived || thread.folder === "sent")
      ) {
        return false;
      }

      // 2. Case Activity check
      if (activeActivity) {
        if (
          activeActivity === "evidence" &&
          thread.caseType !== "evidence_request" &&
          !thread.tags?.includes("Evidence")
        )
          return false;
        if (
          activeActivity === "field_visit" &&
          thread.caseType !== "field_visit" &&
          !thread.tags?.includes("Field Visit")
        )
          return false;
        if (
          activeActivity === "clarification" &&
          thread.caseType !== "clarification"
        )
          return false;
        if (
          activeActivity === "decision" &&
          thread.caseType !== "decision"
        )
          return false;
      }

      // 3. Filter Popover checks
      if (filter.unreadOnly && thread.status !== "unread") return false;
      if (
        filter.hasAttachment &&
        !thread.messages.some((m) => m.attachments && m.attachments.length > 0)
      )
        return false;
      if (filter.tag && !thread.tags?.includes(filter.tag)) return false;
      if (
        filter.applicationId &&
        thread.applicationId !== filter.applicationId
      )
        return false;

      // 4. Case-aware Multi-field Search (applicant, case ID, scheme, sender, dept, action)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSubject = thread.subject.toLowerCase().includes(q);
        const matchesSender = thread.sender.name.toLowerCase().includes(q);
        const matchesSenderEmail = thread.sender.email.toLowerCase().includes(q);
        const matchesSenderDept = thread.sender.department?.toLowerCase().includes(q) ?? false;
        const matchesRecipient = thread.recipient.name.toLowerCase().includes(q);
        const matchesAppId = thread.applicationId?.toLowerCase().includes(q) ?? false;
        const matchesScheme = thread.schemeName?.toLowerCase().includes(q) ?? false;
        const matchesHousehold = thread.householdId?.toLowerCase().includes(q) ?? false;
        const matchesAction = thread.actionRequired?.toLowerCase().includes(q) ?? false;
        const matchesTags = thread.tags?.some((t) => t.toLowerCase().includes(q)) ?? false;
        const matchesBody = thread.messages.some((m) =>
          m.body.toLowerCase().includes(q)
        );

        if (
          !matchesSubject &&
          !matchesSender &&
          !matchesSenderEmail &&
          !matchesSenderDept &&
          !matchesRecipient &&
          !matchesAppId &&
          !matchesScheme &&
          !matchesHousehold &&
          !matchesAction &&
          !matchesTags &&
          !matchesBody
        ) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    return filtered.sort((a, b) => {
      if (sortOrder === "unread_first") {
        if (a.status === "unread" && b.status !== "unread") return -1;
        if (b.status === "unread" && a.status !== "unread") return 1;
      }
      const timeA = new Date(
        a.timestamp.includes(" ") ? a.timestamp.replace(" ", "T") : a.timestamp
      ).getTime();
      const timeB = new Date(
        b.timestamp.includes(" ") ? b.timestamp.replace(" ", "T") : b.timestamp
      ).getTime();
      return sortOrder === "oldest" ? timeA - timeB : timeB - timeA;
    });
  }, [
    state.messages,
    activeFolder,
    activeActivity,
    filter,
    searchQuery,
    sortOrder,
  ]);

  // Selected thread object
  const activeThread = useMemo(() => {
    return (
      state.messages.find((t) => t.id === selectedThreadId) ||
      filteredThreads[0] ||
      null
    );
  }, [state.messages, selectedThreadId, filteredThreads]);

  const handleSelectThread = (thread: MessageThread) => {
    setSelectedThreadId(thread.id);
    setMobileView("reader");
    if (thread.status === "unread") {
      markMessageRead(thread.id);
    }
  };

  const handleToggleStar = (threadId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    toggleStarMessage(threadId);
  };

  const handleArchive = (threadId: string) => {
    archiveMessage(threadId);
    toast.success("Message archived");
    // Select next available
    const remaining = filteredThreads.filter((t) => t.id !== threadId);
    if (remaining.length > 0) {
      setSelectedThreadId(remaining[0].id);
    } else {
      setSelectedThreadId(null);
    }
  };

  const handleSendReply = (body: string, files?: File[]) => {
    if (!activeThread) return;

    sendMessage({
      threadId: activeThread.id,
      toEmail: activeThread.sender.email,
      toName: activeThread.sender.name,
      toRole: activeThread.sender.role,
      subject: `Re: ${activeThread.subject}`,
      body,
      applicationId: activeThread.applicationId,
    });

    toast.success("Reply recorded in official thread", {
      description: `Dispatched to ${activeThread.sender.name} with audit confirmation`,
    });
  };

  const handleComposeSend = async ({
    toEmail,
    subject: compSubject,
    body: compBody,
    applicationId: compAppId,
  }: {
    toEmail: string;
    subject: string;
    body: string;
    applicationId?: string;
  }) => {
    sendMessage({
      toEmail,
      subject: compSubject,
      body: compBody,
      applicationId: compAppId,
    });
  };

  return (
    <div className="space-y-4">
      {/* Section 4: Quiet Mail Page Header */}
      <div className="flex flex-col gap-0.5 px-0.5">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h1>
        <p className="text-xs text-muted-foreground leading-normal max-w-3xl">
          {subtitle}
        </p>
      </div>

      {/* Main Mail Surface: One continuous workspace */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden flex flex-col min-h-[640px] max-h-[820px]">
        {/* Section 5: Compact Mail Toolbar */}
        <MailToolbar
          onComposeClick={() => setIsComposeOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filter={filter}
          onFilterChange={setFilter}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          onRefresh={() => {
            // Simulated refresh
          }}
          selectedThreadId={activeThread?.id}
          isSelectedStarred={activeThread?.isStarred}
          onToggleStar={() => activeThread && handleToggleStar(activeThread.id)}
          onArchive={() => activeThread && handleArchive(activeThread.id)}
          availableApplications={availableApplications}
          searchRef={searchInputRef}
          isReadOnly={state.session?.role === "auditor"}
        />

        {/* Section 6 & 19: Responsive Three-Pane Layout */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200/70 dark:divide-slate-800/80 overflow-hidden">
          {/* Pane 1: Quiet Mail Navigation Rail (Col 2 or 3) */}
          <div
            className={cn(
              "md:col-span-3 lg:col-span-2 bg-slate-50/60 dark:bg-slate-900/40 overflow-y-auto",
              mobileView !== "folders" && "hidden md:block"
            )}
          >
            <MailSidebar
              activeFolder={activeFolder}
              onSelectFolder={(folder) => {
                setActiveFolder(folder);
                setMobileView("list");
              }}
              activeActivity={activeActivity}
              onSelectActivity={(act) => {
                setActiveActivity(act);
                setMobileView("list");
              }}
              folderCounts={folderCounts}
              activityCounts={activityCounts}
            />
          </div>

          {/* Pane 2: Apple-Inspired Message List (Col 4) */}
          <div
            className={cn(
              "md:col-span-4 lg:col-span-4 flex flex-col bg-white dark:bg-slate-900 overflow-hidden",
              mobileView === "reader" && "hidden md:flex",
              mobileView === "folders" && "hidden md:flex"
            )}
          >
            {/* Folder / Filter status pill indicator */}
            <div className="flex flex-col gap-1.5 px-3.5 py-2 border-b border-slate-200/70 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 text-[11px]">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {activeActivity
                    ? activeActivity === "evidence"
                      ? "Evidence Requests"
                      : activeActivity === "field_visit"
                        ? "Field Visits"
                        : activeActivity === "clarification"
                          ? "Clarifications"
                          : "Decisions"
                    : activeFolder === "needs_action"
                      ? "Needs My Action"
                      : activeFolder === "sent"
                        ? "Sent Dispatches"
                        : activeFolder === "archived"
                          ? "Archived Records"
                          : "Official Correspondence"}
                </span>
                <span className="font-mono tabular-nums text-slate-500">
                  {filteredThreads.length} record{filteredThreads.length === 1 ? "" : "s"}
                </span>
              </div>

              {/* Quick Filter Chips */}
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
                <button
                  type="button"
                  onClick={() => {
                    setActiveFolder("inbox");
                    setActiveActivity(null);
                  }}
                  className={cn(
                    "rounded px-2 py-0.5 text-[10px] font-medium border transition-colors shrink-0",
                    activeFolder === "inbox" && activeActivity === null
                      ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-950"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                  )}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveFolder("needs_action");
                    setActiveActivity(null);
                  }}
                  className={cn(
                    "rounded px-2 py-0.5 text-[10px] font-medium border transition-colors shrink-0",
                    activeFolder === "needs_action"
                      ? "bg-amber-600 text-white border-amber-600"
                      : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60"
                  )}
                >
                  Needs Action
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveActivity("evidence");
                  }}
                  className={cn(
                    "rounded px-2 py-0.5 text-[10px] font-medium border transition-colors shrink-0",
                    activeActivity === "evidence"
                      ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-950"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                  )}
                >
                  Evidence
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveActivity("field_visit");
                  }}
                  className={cn(
                    "rounded px-2 py-0.5 text-[10px] font-medium border transition-colors shrink-0",
                    activeActivity === "field_visit"
                      ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-950"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                  )}
                >
                  Visits
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveActivity("decision");
                  }}
                  className={cn(
                    "rounded px-2 py-0.5 text-[10px] font-medium border transition-colors shrink-0",
                    activeActivity === "decision"
                      ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-950"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                  )}
                >
                  Decisions
                </button>
              </div>
            </div>

            <MessageList
              threads={filteredThreads}
              selectedThreadId={activeThread?.id || null}
              onSelectThread={handleSelectThread}
              onToggleStar={handleToggleStar}
            />
          </div>

          {/* Pane 3: Selected Conversation Reading Pane (Col 5 or 6) */}
          <div
            className={cn(
              "md:col-span-5 lg:col-span-6 flex flex-col bg-white dark:bg-slate-900 overflow-hidden",
              mobileView !== "reader" && "hidden md:flex"
            )}
          >
            <MessageReader
              thread={activeThread}
              onBackToMobileList={() => setMobileView("list")}
              onToggleStar={handleToggleStar}
              onArchive={handleArchive}
              onMarkUnread={() => {
                // Keep mark as unread available
              }}
              onSendReply={handleSendReply}
              replyRef={replyRef}
            />
          </div>
        </div>
      </div>

      {/* Floating Modal Composer */}
      <ComposeSheet
        open={isComposeOpen}
        onOpenChange={setIsComposeOpen}
        onSend={handleComposeSend}
        defaultApplicationId={defaultApplicationId}
      />
    </div>
  );
}
