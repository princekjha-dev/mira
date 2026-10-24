import { useState, useEffect, useRef } from "react";
import { useLocation } from "@tanstack/react-router";
import {
  Sparkles,
  X,
  Send,
  Loader2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Scale,
  Lock,
} from "lucide-react";
import { useApp } from "@/lib/app-state";
import { getRoleConfig } from "@/lib/role-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { ApiRequestError, sendMiraAiChat } from "@/lib/api";

interface ChatMessage {
  id: string;
  sender: "user" | "mira";
  text: string;
  timestamp: string;
  contextRef?: string;
  isLiveLLM?: boolean;
  isError?: boolean;
  retryText?: string;
}

function getMiraErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    if (error.status === 401 || error.status === 403) {
      return "Your session needs attention. Please sign in again to use Mira.";
    }

    switch (error.code) {
      case "GROQ_API_KEY_MISSING":
      case "GROQ_AUTH_ERROR":
      case "GROQ_PERMISSION_ERROR":
        return "Mira AI configuration needs attention.";
      case "GROQ_RATE_LIMIT":
        return "Mira is temporarily busy. Please try again shortly.";
      case "GROQ_CONNECTION_ERROR":
        return "Mira could not connect to the AI service.";
      case "GROQ_REQUEST_ERROR":
      case "GROQ_SERVICE_ERROR":
        return "Mira could not process that request. Please try again.";
      default:
        return "Mira could not process that request. Please try again.";
    }
  }

  if (error instanceof TypeError || (error instanceof Error && error.name === "AbortError")) {
    return "Mira could not connect to the AI service.";
  }
  return "Mira could not process that request. Please try again.";
}

export function MiraAIOrb() {
  const { state } = useApp();
  const location = useLocation();
  const role = state.session?.role || "citizen";
  const roleConfig = getRoleConfig(role);

  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [query, setQuery] = useState("");
  const [contextSummary, setContextSummary] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize role-tailored greeting when role or workspace opens
  useEffect(() => {
    const defaultGreeting: ChatMessage = {
      id: "init",
      sender: "mira",
      text: `Hello ${state.session?.name || roleConfig.defaultIdentity.name}. I am Mira AI. I am attuned to your ${roleConfig.workspaceTitle}. How can I assist you today?`,
      timestamp: "Just now",
    };
    setMessages([defaultGreeting]);
    setContextSummary(`${state.session?.name || roleConfig.defaultIdentity.name} · Authorized Records`);
  }, [role, state.session?.name, roleConfig.workspaceTitle, roleConfig.defaultIdentity.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  // Generate role-specific suggested prompts
  const isCommunicationsRoute = location.pathname.includes("inbox");
  const suggestedPrompts = (() => {
    if (isCommunicationsRoute) {
      switch (role) {
        case "citizen":
          return [
            "What does this message mean?",
            "How do I upload the requested clarification document?",
            "What is the deadline for this inquiry?",
          ];
        case "verifier":
          return [
            "Summarize this conversation.",
            "Draft clarification response for applicant",
            "Explain statutory tolerance for income document",
          ];
        case "officer":
          return [
            "Summarize field visit dispatch notes",
            "Confirm applicant residence address for visit",
          ];
        case "auditor":
          return [
            "Trace non-repudiation proof for this inquiry",
            "Summarize inter-departmental notice thread",
          ];
        default:
          return [
            "Summarize this conversation.",
            "Draft official dispatch reply",
          ];
      }
    }

    switch (role) {
      case "citizen":
        return [
          "Check eligibility for Rural Housing Assistance",
          "What is my household's current verification status?",
          "Why is my application waiting for clarification?",
        ];
      case "verifier":
        return [
          "Summarize evidence for application APP-2026-000455",
          "Explain the income mismatch with Revenue records",
          "What is the statutory tolerance for land holdings?",
        ];
      case "officer":
        return [
          "Show pending inspections on today's route",
          "How do I confirm citizen digital presence?",
          "Verify GPS coordinates for Plot 412/1",
        ];
      case "auditor":
        return [
          "Verify SHA-256 Merkle root for recent decisions",
          "Trace complete audit history for Sharma household",
          "Export ISO/IEC 27001 compliance bundle",
        ];
      case "admin":
        return [
          "Show queue health and bottleneck SLA alerts",
          "Review active eligibility rule versions",
          "Inspect cross-registry UIDAI e-KYC status",
        ];
      default:
        return [
          "Explain the public welfare verification pipeline",
          "What records are currently active in my view?",
        ];
    }
  })();

  const handleSend = async (textToSend?: string, retry = false) => {
    const text = (textToSend || query).trim();
    if (!text || isProcessing) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    if (!retry) {
      setMessages((prev) => [...prev, userMsg]);
    }
    setQuery("");
    setIsProcessing(true);

    try {
      // Build conversation history for context continuity
      const historyMessages = messages.filter((m) => m.id !== "init" && !m.isError);
      const retryHistory = retry && historyMessages.at(-1)?.sender === "user"
        ? historyMessages.slice(0, -1)
        : historyMessages;
      const history = retryHistory
        .slice(-4)
        .map((m) => ({
          role: (m.sender === "user" ? "user" : "assistant") as "user" | "assistant",
          content: m.text,
        }));

      const response = await sendMiraAiChat(state.session, {
        message: text,
        route: location.pathname,
        history,
      });

      if (response.context_summary) {
        setContextSummary(response.context_summary);
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "mira",
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isLiveLLM: response.is_live_llm,
      };

      setMessages((prev) => [...prev.filter((message) => !message.isError), botMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "mira",
        text: getMiraErrorMessage(err),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isError: true,
        retryText: text,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none print:hidden font-sans">
      {/* ---------------------------------------------------------------------- */}
      {/* 1. Spatial AI Assistant Panel (Expanded State)                          */}
      {/* ---------------------------------------------------------------------- */}
      {isOpen && (
        <div className="mb-3.5 flex h-[530px] w-[370px] sm:w-[420px] flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 text-slate-900 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-100 animate-in fade-in slide-in-from-bottom-3 duration-200 origin-bottom-right">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200/70 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-850/60 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-7 w-7 items-center justify-center rounded-xl bg-slate-900 text-teal-400 dark:bg-slate-800 shadow-2xs">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold tracking-tight text-slate-900 dark:text-slate-100">Mira Intelligence</h3>
                  <span className="rounded-full bg-gov/10 px-1.5 py-0.2 text-[9px] font-semibold text-gov">
                    {role.toUpperCase()}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground">{roleConfig.workspaceTitle}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-slate-100 hover:text-foreground dark:hover:bg-slate-800 transition-colors"
              aria-label="Close Mira AI"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Section 28: AI Context Indicator */}
          <div className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-50/40 border-b border-slate-100 dark:bg-slate-900/40 dark:border-slate-800 text-[10px] text-muted-foreground select-text">
            <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="truncate font-medium">Using: {contextSummary || `${state.session?.name || roleConfig.defaultIdentity.name} · Authorized Records`}</span>
          </div>

          {/* Conversation Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs leading-relaxed scrollbar-thin">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex flex-col max-w-[85%]",
                  m.sender === "user" ? "ml-auto items-end" : "mr-auto items-start"
                )}
              >
                <div
                  className={cn(
                    "rounded-2xl px-3.5 py-2.5 shadow-2xs whitespace-pre-wrap leading-relaxed",
                    m.sender === "user"
                      ? "bg-slate-900 text-white font-medium rounded-br-xs dark:bg-slate-100 dark:text-slate-900"
                      : "bg-slate-50 text-slate-900 border border-slate-200/80 rounded-bl-xs dark:bg-slate-800/80 dark:border-slate-700/60 dark:text-slate-100"
                  )}
                >
                  {m.text}
                </div>
                {m.retryText && !isProcessing && (
                  <button
                    type="button"
                    onClick={() => handleSend(m.retryText, true)}
                    className="mt-1 px-1 text-[10px] font-medium text-gov underline-offset-2 hover:underline"
                  >
                    Retry
                  </button>
                )}
                <span className="text-[10px] text-muted-foreground/75 px-1 mt-0.5 tabular-nums font-mono">{m.timestamp}</span>
              </div>
            ))}

            {isProcessing && (
              <div className="flex items-center gap-2 rounded-2xl bg-slate-50 border border-slate-200/80 px-3.5 py-2 text-xs text-muted-foreground mr-auto dark:bg-slate-800 dark:border-slate-700">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-gov" />
                <span>Mira is correlating records…</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Role-Specific Prompt Suggestions */}
          <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 px-3 py-2">
            <p className="text-[10px] font-medium text-muted-foreground mb-1.5 font-mono uppercase tracking-wider">Contextual Queries:</p>
            <div className="flex flex-wrap gap-1">
              {suggestedPrompts.slice(0, 2).map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(p)}
                  className="rounded-full border border-slate-200/80 bg-white px-2.5 py-1 text-[10px] text-slate-700 hover:border-slate-300 hover:text-slate-950 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-white"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5"
          >
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Ask Mira about ${roleConfig.workspaceTitle}…`}
              className="h-9 flex-1 text-xs bg-slate-50/80 border-slate-200/80 dark:bg-slate-800 dark:border-slate-700 rounded-xl"
            />
            <Button size="icon" type="submit" disabled={!query.trim() || isProcessing} className="h-9 w-9 shrink-0 rounded-xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* 2. Floating Luminous AI Orb (Apple Spatial Philosophy)                  */}
      {/* ---------------------------------------------------------------------- */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "group relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-200 select-none shadow-lg outline-none",
          "bg-slate-900 text-white border border-slate-700/60 dark:bg-slate-100 dark:text-slate-950 dark:border-slate-300/40",
          "hover:scale-[1.04] active:scale-[0.96]",
          isOpen ? "ring-2 ring-gov ring-offset-2 ring-offset-background" : ""
        )}
        aria-label="Open Mira AI Assistant"
      >
        {/* Subtle Internal Soft Light (No Gaming Neon) */}
        <span
          className={cn(
            "absolute -inset-1 rounded-2xl opacity-20 blur-sm transition-opacity duration-300 pointer-events-none",
            "bg-gradient-to-tr from-sky-400 via-teal-400 to-indigo-400",
            isProcessing ? "opacity-60 animate-pulse" : "group-hover:opacity-40"
          )}
        />

        {/* Center Orb Icon */}
        <div className="relative z-10 flex items-center justify-center">
          <Sparkles className={cn("h-4.5 w-4.5 transition-transform duration-200", isProcessing ? "animate-spin text-teal-400" : "group-hover:rotate-6 text-teal-300 dark:text-teal-600")} />
        </div>

        {/* Floating Tooltip Label when Idle */}
        {!isOpen && (
          <span className="pointer-events-none absolute right-14 whitespace-nowrap rounded-xl border border-slate-200/80 bg-white/95 px-2.5 py-1 text-xs font-semibold text-slate-800 shadow-sm backdrop-blur-md opacity-0 translate-x-1.5 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0 dark:border-slate-800 dark:bg-slate-900/95 dark:text-slate-200">
            Mira AI
          </span>
        )}
      </button>
    </div>
  );
}
