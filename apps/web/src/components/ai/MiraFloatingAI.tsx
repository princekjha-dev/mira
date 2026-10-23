import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  X,
  Send,
  HelpCircle,
  ShieldCheck,
  FileText,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Message {
  id: string;
  sender: 'mira' | 'user';
  text: string;
  action?: { label: string; url: string };
  timestamp: string;
}

export const MiraFloatingAI: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'mira',
      text: "Hi, I'm Mira. I can help explain public documentation, welfare scheme eligibility rules, application timelines, and evidence requirements.",
      timestamp: 'Just now',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Contextual suggested actions based on current pathname
  const getContextualSuggestions = () => {
    const path = location.pathname;
    if (path.includes('/schemes')) {
      return [
        { label: 'Explain eligibility rules for this scheme', prompt: 'How do the eligibility rules work for this scheme?' },
        { label: 'Check if my household qualifies', prompt: 'Can my household apply if we already received housing subsidy?' },
        { label: 'What documents do I need to prepare?', prompt: 'What documents are required for application?' },
      ];
    }
    if (path.includes('/applications')) {
      return [
        { label: 'Explain current application status', prompt: 'Why is my application in under review status?' },
        { label: 'What is the standard processing timeline?', prompt: 'How long does officer verification take?' },
        { label: 'What happens if a document has a mismatch?', prompt: 'What happens if my income certificate has a discrepancy?' },
      ];
    }
    if (path.includes('/review') || path.includes('/officer') || path.includes('/duplicates')) {
      return [
        { label: 'Explain why duplicate was flagged', prompt: 'What signals triggered the household-level duplicate flag?' },
        { label: 'Show difference between individual & household benefit', prompt: 'Explain the difference between person and household benefit units.' },
        { label: 'How to record field verification?', prompt: 'What is required for officer verification evidence?' },
      ];
    }
    if (path.includes('/family') || path.includes('/households')) {
      return [
        { label: 'Explain temporal household history', prompt: 'How does Mira maintain historical household memberships?' },
        { label: 'How to request family member addition?', prompt: 'How do I submit a family change request?' },
        { label: 'Does household split affect benefits?', prompt: 'What happens to existing benefits after a household split?' },
      ];
    }
    return [
      { label: 'Check eligibility for schemes', prompt: 'How can I check which welfare schemes I qualify for?' },
      { label: 'Explain how Mira protects my privacy', prompt: 'How does Mira enforce object-level authorization and isolation?' },
      { label: 'Track an application', prompt: 'How do I track an existing application status?' },
    ];
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Grounded knowledge response simulation
    setTimeout(() => {
      let reply = "I can guide you through that. In Mira, all records and eligibility criteria are deterministic and traceable.";
      let action: { label: string; url: string } | undefined;

      const q = query.toLowerCase();
      if (q.includes('eligib') || q.includes('qualif')) {
        reply = "Eligibility in Mira is computed transparently against versioned scheme rules (such as income limits, age brackets, property ownership, and prior benefit claims). You can run a live evaluation anytime without submitting an application.";
        action = { label: 'Open Eligibility Engine', url: '/eligibility' };
      } else if (q.includes('status') || q.includes('track') || q.includes('timeline')) {
        reply = "Applications progress through: 1) Submitted → 2) Document OCR & Verification → 3) Deterministic Eligibility Assessment → 4) Officer Review → 5) Consequential Decision. You can enter any Application ID to track the real-time timeline.";
        action = { label: 'Track Application', url: '/track' };
      } else if (q.includes('duplicate') || q.includes('flag')) {
        reply = "Duplicate flags occur when an application shares key attributes (such as the same Household ID, Address, or Property) with an existing active benefit under the same scheme category. Flags are never auto-rejected; they are placed in the Officer Verification Queue for explainable evidence review.";
        action = { label: 'View Duplicate Review Queue', url: '/review/benefit-duplicates' };
      } else if (q.includes('family') || q.includes('split') || q.includes('household')) {
        reply = "Mira uses a bitemporal household model. When individuals change households or report life events (birth, marriage, separation), historical records are preserved with valid_from and valid_to timestamps rather than overwritten.";
        action = { label: 'View Family Record', url: '/citizen/family' };
      } else if (q.includes('document') || q.includes('mismatch')) {
        reply = "When you upload identity or income documents, Mira extracts key fields and checks consistency against your application. If a discrepancy exists (e.g. stated income vs certificate value), it flags a 'Mismatch Detected' for transparent evidence clarification.";
        action = { label: 'Documents Portal', url: '/documents' };
      } else {
        reply = "I understand. Mira connects citizen profiles, household history, welfare schemes, and documentation into one unified, auditable platform. Feel free to explore available schemes or view your family ledger.";
        action = { label: 'Explore Schemes', url: '/schemes' };
      }

      const botMsg: Message = {
        id: `m-${Date.now()}`,
        sender: 'mira',
        text: reply,
        action,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  const suggestions = getContextualSuggestions();

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 bg-[#123B63] hover:bg-[#0B2540] text-white px-4 py-2.5 rounded-full shadow-lg border border-slate-700/30 transition-all duration-200 hover:scale-105 group"
          aria-label="Open Mira AI Assistant"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span className="text-xs font-semibold tracking-wide">Ask Mira</span>
        </button>
      ) : (
        <div className="bg-white rounded-2xl shadow-2xl border border-[#DCE3EA] w-[360px] sm:w-[400px] h-[520px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-[#123B63] text-white p-3.5 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
                  <span>Mira AI Civic Assistant</span>
                  <span className="text-[9px] bg-white/20 px-1 rounded font-normal">Grounded</span>
                </div>
                <div className="text-[10px] text-slate-300 leading-tight">Public Documentation Guidance</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close Assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Civic Oversight Disclaimer Notice */}
          <div className="bg-[#F0F6FC] px-3 py-1.5 border-b border-[#DCE3EA] text-[10px] text-[#123B63] flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0F766E] flex-shrink-0" />
            <span>AI assists with guidance only. Final decisions are made by authorized officers.</span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#F8F8F5]/50 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#123B63] text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-[#DCE3EA] rounded-bl-xs shadow-2xs'
                  }`}
                >
                  <p>{m.text}</p>
                  {m.action && (
                    <button
                      onClick={() => {
                        navigate(m.action!.url);
                        setIsOpen(false);
                      }}
                      className="mt-2.5 inline-flex items-center text-xs font-semibold text-[#2563A6] bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-[6px] border border-blue-200 transition-colors"
                    >
                      <span>{m.action.label}</span>
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </button>
                  )}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center space-x-1 p-2.5 bg-white border border-[#DCE3EA] rounded-xl w-16 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#123B63] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#123B63] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#123B63] animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Contextual Suggestions Chips */}
          <div className="px-3 py-2 bg-white border-t border-[#DCE3EA] overflow-x-auto no-scrollbar flex items-center space-x-1.5">
            {suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(s.prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-medium transition-colors border border-slate-200/60"
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-2.5 bg-white border-t border-[#DCE3EA] flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="Ask Mira about schemes, rules, status..."
              className="flex-1 bg-[#F5F5F1] border border-[#DCE3EA] rounded-[8px] px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2563A6]"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim()}
              className="p-2 rounded-[8px] bg-[#123B63] text-white hover:bg-[#0B2540] disabled:opacity-40 transition-colors"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
