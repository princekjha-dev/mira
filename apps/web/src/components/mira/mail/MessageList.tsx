import { useEffect, useRef } from "react";
import { Mail, SearchX } from "lucide-react";
import { type MessageThread } from "@/lib/data";
import { MessageRow } from "./MessageRow";

interface MessageListProps {
  threads: MessageThread[];
  selectedThreadId: string | null;
  onSelectThread: (thread: MessageThread) => void;
  onToggleStar: (threadId: string, e: React.MouseEvent) => void;
}

export function MessageList({
  threads,
  selectedThreadId,
  onSelectThread,
  onToggleStar,
}: MessageListProps) {
  const listRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation support: arrow up / arrow down to navigate threads
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        threads.length === 0
      ) {
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const currentIndex = threads.findIndex(
          (t) => t.id === selectedThreadId,
        );
        const nextIndex = Math.min(threads.length - 1, currentIndex + 1);
        if (threads[nextIndex]) {
          onSelectThread(threads[nextIndex]);
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const currentIndex = threads.findIndex(
          (t) => t.id === selectedThreadId,
        );
        const prevIndex = Math.max(0, currentIndex - 1);
        if (threads[prevIndex]) {
          onSelectThread(threads[prevIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [threads, selectedThreadId, onSelectThread]);

  if (threads.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-xs text-muted-foreground min-h-[300px]">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
          <SearchX className="h-6 w-6" />
        </div>
        <p className="font-semibold text-slate-800 dark:text-slate-200">
          No communications found
        </p>
        <p className="mt-1 max-w-xs text-[11px] leading-relaxed">
          No messages match the current folder, active filters, or search terms.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={listRef}
      className="flex-1 overflow-y-auto divide-y divide-transparent scrollbar-thin"
      role="listbox"
      aria-label="Message list"
    >
      {threads.map((thread) => (
        <MessageRow
          key={thread.id}
          thread={thread}
          isSelected={thread.id === selectedThreadId}
          onSelect={onSelectThread}
          onToggleStar={onToggleStar}
        />
      ))}
    </div>
  );
}
