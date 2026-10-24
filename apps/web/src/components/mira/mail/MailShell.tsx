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
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowFilter | null>(
    null,
  );
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(
    () => state.messages[0]?.id || null,
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
  const [mobileView, setMobileView] = useState<"folders" | "list" | "reader">(
    "list",
  );

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
          toast.success("Thread archived (Press ⌘Z to undo)");
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

  // Folder and workflow counts
  const folderCounts = useMemo(() => {
    return {
      inbox: state.messages.filter(
        (m) =>
          (!m.folder || m.folder === "inbox") &&
          !m.isArchived &&
          m.status === "unread",
      ).length,
      starred: state.messages.filter((m) => !!m.isStarred).length,
      sent: state.messages.filter((m) => m.folder === "sent").length,
      archived: state.messages.filter((m) => !!m.isArchived).length,
    };
  }, [state.messages]);

  const workflowCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const tags = [
      "Action Required",
      "Evidence",
      "Field Visit",
      "Schedule",
      "Operations",
    ];
    tags.forEach((tag) => {
      counts[tag] = state.messages.filter(
        (m) => !m.isArchived && m.tags?.includes(tag),
      ).length;
    });
    return counts;
  }, [state.messages]);

  // Filtered and Sorted Threads
  const filteredThreads = useMemo(() => {
    const filtered = state.messages.filter((thread) => {
      // 1. Folder check
      if (activeFolder === "starred" && !thread.isStarred) return false;
      if (activeFolder === "archived" && !thread.isArchived) return false;
      if (activeFolder === "sent" && thread.folder !== "sent") return false;
      if (
        activeFolder === "inbox" &&
        (thread.isArchived || thread.folder === "sent")
      )
        return false;

      // 2. Sidebar Workflow check
      if (activeWorkflow && !thread.tags?.includes(activeWorkflow))
        return false;

      // 3. Filter Popover checks
      if (filter.unreadOnly && thread.status !== "unread") return false;
      if (
        filter.hasAttachment &&
        !thread.messages.some((m) => m.attachments && m.attachments.length > 0)
      )
        return false;
      if (filter.tag && !thread.tags?.includes(filter.tag)) return false;
      if (filter.applicationId && thread.applicationId !== filter.applicationId)
        return false;

      // 4. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesSubject = thread.subject.toLowerCase().includes(q);
        const matchesSender = thread.sender.name.toLowerCase().includes(q);
        const matchesSenderEmail = thread.sender.email
          .toLowerCase()
          .includes(q);
        const matchesAppId =
          thread.applicationId?.toLowerCase().includes(q) ?? false;
        const matchesTags =
          thread.tags?.some((t) => t.toLowerCase().includes(q)) ?? false;
        const matchesBody = thread.messages.some((m) =>
          m.body.toLowerCase().includes(q),
        );

        if (
          !matchesSubject &&
          !matchesSender &&
          !matchesSenderEmail &&
          !matchesAppId &&
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
        a.timestamp.includes(" ") ? a.timestamp.replace(" ", "T") : a.timestamp,
      ).getTime();
      const timeB = new Date(
        b.timestamp.includes(" ") ? b.timestamp.replace(" ", "T") : b.timestamp,
      ).getTime();

      if (sortOrder === "oldest") return timeA - timeB;
      return timeB - timeA;
    });
  }, [
    state.messages,
    activeFolder,
    activeWorkflow,
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
        />

        {/* Section 6 & 19: Responsive Three-Pane Layout */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200/70 dark:divide-slate-800/80 overflow-hidden">
          {/* Pane 1: Quiet Mail Navigation Rail (Col 2 or 3) */}
          <div
            className={cn(
              "md:col-span-3 lg:col-span-2 bg-slate-50/60 dark:bg-slate-900/40 overflow-y-auto",
              mobileView !== "folders" && "hidden md:block",
            )}
          >
            <MailSidebar
              activeFolder={activeFolder}
              onSelectFolder={(folder) => {
                setActiveFolder(folder);
                setMobileView("list");
              }}
              activeWorkflow={activeWorkflow}
              onSelectWorkflow={(wf) => {
                setActiveWorkflow(wf);
                setMobileView("list");
              }}
              folderCounts={folderCounts}
              workflowCounts={workflowCounts}
            />
          </div>

          {/* Pane 2: Apple-Inspired Message List (Col 4) */}
          <div
            className={cn(
              "md:col-span-4 lg:col-span-4 flex flex-col bg-white dark:bg-slate-900 overflow-hidden",
              mobileView === "reader" && "hidden md:flex",
              mobileView === "folders" && "hidden md:flex",
            )}
          >
            {/* Folder / Filter status pill indicator */}
            <div className="flex items-center justify-between px-3.5 py-2 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-900/30 text-[11px] text-muted-foreground">
              <span className="font-medium text-slate-700 dark:text-slate-300 capitalize">
                {activeWorkflow || activeFolder}
              </span>
              <span className="font-mono tabular-nums">
                {filteredThreads.length} message
                {filteredThreads.length === 1 ? "" : "s"}
              </span>
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
              mobileView !== "reader" && "hidden md:flex",
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
