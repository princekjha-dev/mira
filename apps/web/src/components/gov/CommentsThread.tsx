import { useState } from "react";
import {
  AtSign,
  CheckCircle2,
  CornerDownRight,
  MessageSquare,
  Send,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-state";
import { type CommentItem } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface CommentsThreadProps {
  recordType: CommentItem["recordType"];
  recordId: string;
  title?: string;
}

export function CommentsThread({
  recordType,
  recordId,
  title = "Collaboration & Official Notes",
}: CommentsThreadProps) {
  const { state, addComment } = useApp();
  const [commentText, setCommentText] = useState("");
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const comments = state.comments.filter(
    (c) => c.recordType === recordType && c.recordId === recordId,
  );

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    // Detect @mentions
    const mentions = Array.from(commentText.matchAll(/@(\w+)/g)).map((m) => m[1]);

    addComment({
      recordType,
      recordId,
      text: commentText.trim(),
      mentions,
    });

    toast.success("Note added to official thread");
    setCommentText("");
  };

  const handlePostReply = (parentId: string) => {
    const text = replyTextMap[parentId]?.trim();
    if (!text) return;

    const mentions = Array.from(text.matchAll(/@(\w+)/g)).map((m) => m[1]);

    addComment({
      recordType,
      recordId,
      text,
      mentions,
      replyToId: parentId,
    });

    toast.success("Reply recorded");
    setReplyTextMap({ ...replyTextMap, [parentId]: "" });
    setActiveReplyId(null);
  };

  const roleColor = (roleStr: string) => {
    switch (roleStr) {
      case "verifier":
        return "bg-teal/15 text-teal border-teal/20";
      case "officer":
        return "bg-gov/15 text-gov border-gov/20";
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "auditor":
        return "bg-slate-200 text-slate-800 border-slate-300";
      default:
        return "bg-blue-50 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className="rounded-xl border bg-white p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-gov" />
          <h3 className="text-sm font-bold text-navy">{title}</h3>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
            {comments.length}
          </span>
        </div>
        <span className="text-[11px] text-muted-foreground">
          Use <code className="text-gov font-mono">@name</code> to mention officers
        </span>
      </div>

      {/* Existing Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            No notes logged yet. Use this section for team collaboration, verification queries, or field clarifications.
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-lg border border-slate-100 bg-slate-50/50 p-3.5 space-y-2.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-navy">{comment.author.name}</span>
                  <span
                    className={cn(
                      "rounded text-[9px] px-1.5 py-0.2 border uppercase font-mono font-medium",
                      roleColor(comment.author.role),
                    )}
                  >
                    {comment.author.role}
                  </span>
                  {comment.author.department && (
                    <span className="text-[10px] text-slate-400">
                      · {comment.author.department}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {comment.timestamp}
                </span>
              </div>

              <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">
                {comment.text}
              </p>

              {comment.mentions && comment.mentions.length > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-slate-400">Mentioned:</span>
                  {comment.mentions.map((m) => (
                    <span
                      key={m}
                      className="rounded bg-blue-50 text-blue-700 font-mono text-[10px] px-1.5 py-0.2"
                    >
                      @{m}
                    </span>
                  ))}
                </div>
              )}

              {/* Threaded Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3 pl-4 border-l-2 border-slate-200 space-y-2.5 pt-1">
                  {comment.replies.map((rep) => (
                    <div
                      key={rep.id}
                      className="rounded bg-white border border-slate-100 p-2.5 space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-navy">
                            {rep.author.name}
                          </span>
                          <span
                            className={cn(
                              "rounded text-[8px] px-1 py-0.1 border uppercase font-mono",
                              roleColor(rep.author.role),
                            )}
                          >
                            {rep.author.role}
                          </span>
                        </div>
                        <span className="text-[9px] text-muted-foreground font-mono">
                          {rep.timestamp}
                        </span>
                      </div>
                      <p className="text-slate-700 text-xs">{rep.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Button / Form */}
              <div className="pt-1 flex items-center justify-between">
                {activeReplyId !== comment.id ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 text-[10px] gap-1 text-gov px-2"
                    onClick={() => setActiveReplyId(comment.id)}
                  >
                    <CornerDownRight className="h-3 w-3" />
                    Reply
                  </Button>
                ) : (
                  <div className="w-full mt-2 space-y-2">
                    <Textarea
                      placeholder="Type reply or field update…"
                      value={replyTextMap[comment.id] || ""}
                      onChange={(e) =>
                        setReplyTextMap({
                          ...replyTextMap,
                          [comment.id]: e.target.value,
                        })
                      }
                      rows={2}
                      className="text-xs bg-white"
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs"
                        onClick={() => setActiveReplyId(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        className="h-6 text-xs bg-gov hover:bg-gov/90 text-white"
                        onClick={() => handlePostReply(comment.id)}
                      >
                        Send Reply
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Top-Level Comment Form */}
      <form onSubmit={handlePostComment} className="pt-2 border-t space-y-2">
        <Textarea
          placeholder="Add an official note, document query or instruction (e.g. '@Ravi please verify address on-site')…"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          rows={3}
          className="text-xs"
        />
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <AtSign className="h-3.5 w-3.5 text-slate-400" />
            <span>Tag: @Ananya, @Ravi, @Neha, @Department</span>
          </div>
          <Button
            type="submit"
            size="sm"
            className="bg-gov hover:bg-gov/90 text-white text-xs h-8 gap-1.5"
            disabled={!commentText.trim()}
          >
            <Send className="h-3.5 w-3.5" />
            Post Note
          </Button>
        </div>
      </form>
    </div>
  );
}
