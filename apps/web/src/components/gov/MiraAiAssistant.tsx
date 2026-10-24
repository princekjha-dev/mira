import { useState, useMemo } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  Bot,
  ChevronDown,
  CornerDownLeft,
  HelpCircle,
  MessageCircle,
  Send,
  Sparkles,
  X,
  ShieldCheck,
} from "lucide-react";
import { useApp } from "@/lib/app-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function MiraAiAssistant() {
  const { state } = useApp();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [chatLog, setChatLog] = useState<
    Array<{ sender: "user" | "mira"; text: string }>
  >([]);

  const role = state.session?.role || "citizen";

  // Contextual initial suggestion based on current route
  const contextualHint = useMemo(() => {
    if (path.includes("/applications/")) {
      return "Ask Mira about this application's current stage or officer remarks";
    }
    if (path.includes("/verification") || path.includes("/queue")) {
      return "Ask Mira about OCR extraction confidence or mismatch signals";
    }
    if (path.includes("/rules")) {
      return "Ask Mira to explain active rule conditions or revision history";
    }
    if (path.includes("/audit")) {
      return "Ask Mira to trace the provenance of a specific decision";
    }
    if (path.includes("/family")) {
      return "Ask Mira about household lineage or life event verification rules";
    }
    return "Ask Mira a question about your schemes, documents or deadlines";
  }, [path]);

  const handleAsk = (userQuery: string) => {
    if (!userQuery.trim()) return;

    const q = userQuery.trim().toLowerCase();
    let reply = "";

    if (
      q.includes("why is my application waiting") ||
      q.includes("status") ||
      q.includes("waiting")
    ) {
      const activeApp =
        state.applications.find(
          (a) =>
            a.status === "Additional Evidence Required" ||
            a.status === "Verification Required",
        ) || state.applications[0];
      if (activeApp) {
        reply = `Your application ${activeApp.id} for ${activeApp.schemeId} is in stage "${activeApp.status}". Verification Officer Neha Verma requested an updated income certificate with a clear seal on 22 Oct 2026. Once uploaded, the verification cell will proceed with sanction review.`;
      } else {
        reply =
          "You do not have any applications currently awaiting clarification. All your active filings are progressing through regular intake.";
      }
    } else if (q.includes("mismatch") || q.includes("duplicate")) {
      reply =
        "Mira flagged an investigation signal on duplicate alert DA-2026-10483 regarding an existing district ration entitlement. Under human-in-the-loop policy, this is NOT treated as fraud; it is marked for officer review to confirm household transition.";
    } else if (q.includes("rule") || q.includes("eligibility")) {
      reply =
        "Rural Housing Assistance Scheme is currently on Rule Version 3.2. Requirements: Household income under ₹1,50,000, no existing pucca dwelling, and verified resident of state.";
    } else if (q.includes("family") || q.includes("household")) {
      reply =
        "Household MIRA-FAM-10482 (Sharma Family) has 5 verified members (Rajesh, Sunita, Meena, Ananya, Aarav). All relationships are attested against civil registration records.";
    } else if (q.includes("audit") || q.includes("decided")) {
      reply =
        "Every consequential state transition is recorded in the immutable audit log with cryptographic hash. Auditors have read-only inspection access without mutation permissions.";
    } else {
      reply = `I am Mira, your verified public service assistant. I can help explain status for ${role} workspace records, statutory criteria, and required documents. Try asking: "Why is my application waiting?" or "Explain duplicate signals".`;
    }

    setChatLog((prev) => [
      ...prev,
      { sender: "user", text: userQuery },
      { sender: "mira", text: reply },
    ]);
    setPrompt("");
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 print:hidden font-sans">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 rounded-full bg-navy px-4 py-2.5 text-white shadow-xl hover:bg-slate-900 transition-all hover:scale-105 active:scale-95 group border border-slate-700/50"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal text-navy">
            <Sparkles className="h-3.5 w-3.5 fill-navy" />
          </div>
          <span className="text-xs font-semibold tracking-wide">Ask Mira</span>
        </button>
      ) : (
        <div className="w-[360px] sm:w-[400px] rounded-2xl border bg-white shadow-2xl overflow-hidden flex flex-col max-h-[500px] ring-1 ring-black/10">
          {/* Header */}
          <div className="bg-navy p-3.5 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal text-navy">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight flex items-center gap-1.5">
                  Mira AI Contextual Assistant
                </h4>
                <p className="text-[10px] text-slate-300">
                  {state.session?.name} · {state.session?.role || "Citizen"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Context Banner */}
          <div className="bg-slate-50 border-b px-3 py-2 text-[11px] text-slate-600 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-teal shrink-0" />
            <span className="truncate">{contextualHint}</span>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[220px] max-h-[300px] text-xs">
            {chatLog.length === 0 ? (
              <div className="space-y-2 py-2">
                <p className="text-slate-600 text-xs leading-relaxed">
                  Namaste! I have live context on your active workspace. What
                  can I clarify for you?
                </p>
                <div className="space-y-1.5 pt-1">
                  {[
                    "Why is my application waiting?",
                    "How are duplicate claims evaluated?",
                    "What are the housing scheme rules?",
                  ].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleAsk(s)}
                      className="w-full text-left rounded-lg border bg-slate-50 px-2.5 py-1.5 text-[11px] text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      {s} →
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              chatLog.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex flex-col max-w-[85%] rounded-xl p-2.5 text-xs leading-relaxed",
                    msg.sender === "user"
                      ? "ml-auto bg-gov text-white"
                      : "mr-auto bg-slate-100 text-slate-800 border",
                  )}
                >
                  <span className="text-[9px] font-mono opacity-70 mb-0.5">
                    {msg.sender === "user" ? "You" : "Mira AI"}
                  </span>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              ))
            )}
          </div>

          {/* Prompt Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAsk(prompt);
            }}
            className="p-2 border-t bg-white flex items-center gap-1.5"
          >
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask Mira a question about this page…"
              className="h-8 text-xs bg-slate-50 border-slate-200"
            />
            <Button
              type="submit"
              size="icon"
              className="h-8 w-8 bg-gov hover:bg-gov/90 text-white shrink-0"
              disabled={!prompt.trim()}
            >
              <CornerDownLeft className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
