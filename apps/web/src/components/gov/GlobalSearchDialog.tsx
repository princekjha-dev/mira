import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Search,
  FileText,
  User,
  ClipboardList,
  Mail,
  ShieldAlert,
  ArrowRight,
  FolderOpen,
  History,
  Building,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useApp } from "@/lib/app-state";
import { SCHEMES } from "@/lib/data";

interface SearchResultItem {
  id: string;
  category: "Application" | "Scheme" | "Document" | "Message" | "Audit" | "Citizen";
  title: string;
  subtitle: string;
  url: string;
  badge?: string;
}

export function GlobalSearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { state } = useApp();
  const nav = useNavigate();
  const [query, setQuery] = useState("");
  const role = state.session?.role || "citizen";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenChange]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const items: SearchResultItem[] = [];

    // 1. Applications (Role-based access)
    state.applications.forEach((app) => {
      if (
        role === "citizen" &&
        state.session?.name &&
        !app.applicant.toLowerCase().includes(state.session.name.toLowerCase()) &&
        !app.id.toLowerCase().includes(q)
      ) {
        return;
      }
      if (
        app.id.toLowerCase().includes(q) ||
        app.applicant.toLowerCase().includes(q) ||
        app.schemeId.toLowerCase().includes(q)
      ) {
        const dest =
          role === "officer"
            ? `/officer/applications/${app.id}`
            : role === "verifier"
              ? `/verifier/applications/${app.id}`
              : role === "auditor"
                ? `/auditor/applications`
                : `/citizen/applications/${app.id}`;
        items.push({
          id: app.id,
          category: "Application",
          title: `${app.id} · ${app.applicant}`,
          subtitle: `Scheme: ${app.schemeId} · Status: ${app.status}`,
          url: dest,
          badge: app.status,
        });
      }
    });

    // 2. Schemes
    SCHEMES.forEach((s) => {
      if (
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      ) {
        items.push({
          id: s.id,
          category: "Scheme",
          title: s.name,
          subtitle: `${s.category} · ${s.department}`,
          url: `/schemes/${s.id}`,
          badge: s.level,
        });
      }
    });

    // 3. Documents & Files
    state.files.forEach((f) => {
      if (f.name.toLowerCase().includes(q) || f.type.toLowerCase().includes(q)) {
        const dest =
          role === "verifier"
            ? `/verifier/documents`
            : `/citizen/documents`;
        items.push({
          id: f.id,
          category: "Document",
          title: f.name,
          subtitle: `${f.type} · v${f.currentVersion} · ${f.verificationStatus}`,
          url: dest,
          badge: f.verificationStatus,
        });
      }
    });

    // 4. Messages / Inbox
    state.messages.forEach((m) => {
      if (
        m.subject.toLowerCase().includes(q) ||
        m.preview.toLowerCase().includes(q) ||
        m.sender.name.toLowerCase().includes(q)
      ) {
        const dest =
          role === "officer"
            ? `/officer/inbox`
            : role === "verifier"
              ? `/verifier/inbox`
              : role === "admin"
                ? `/department/inbox`
                : role === "auditor"
                  ? `/auditor/inbox`
                  : `/citizen/inbox`;
        items.push({
          id: m.id,
          category: "Message",
          title: m.subject,
          subtitle: `From: ${m.sender.name} (${m.sender.role}) · ${m.timestamp}`,
          url: dest,
          badge: m.status === "unread" ? "Unread" : undefined,
        });
      }
    });

    // 5. Audit Events (for Admin & Auditor)
    if (role === "admin" || role === "auditor" || role === "officer") {
      state.audit.forEach((a) => {
        if (
          a.action.toLowerCase().includes(q) ||
          a.actor.toLowerCase().includes(q) ||
          a.id.toLowerCase().includes(q)
        ) {
          items.push({
            id: a.id,
            category: "Audit",
            title: `${a.id} — ${a.action}`,
            subtitle: `Actor: ${a.actor} · ${a.ts}`,
            url: role === "auditor" ? `/auditor/audit` : `/department/audit`,
          });
        }
      });
    }

    return items.slice(0, 8);
  }, [query, state, role]);

  const handleSelect = (url: string) => {
    onOpenChange(false);
    setQuery("");
    void nav({ to: url as any });
  };

  const getIcon = (category: SearchResultItem["category"]) => {
    switch (category) {
      case "Application":
        return <ClipboardList className="h-4 w-4 text-gov" />;
      case "Scheme":
        return <Building className="h-4 w-4 text-teal" />;
      case "Document":
        return <FolderOpen className="h-4 w-4 text-amber-700" />;
      case "Message":
        return <Mail className="h-4 w-4 text-blue-600" />;
      case "Audit":
        return <History className="h-4 w-4 text-purple-700" />;
      default:
        return <FileText className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border shadow-2xl rounded-2xl">
        <DialogTitle className="sr-only">Global Search</DialogTitle>
        <div className="flex items-center border-b px-4 py-3 bg-white">
          <Search className="h-5 w-5 text-slate-400 mr-2.5 shrink-0" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search applications, schemes, files, messages, audit logs… (Esc to exit)"
            className="border-0 shadow-none focus-visible:ring-0 text-base h-10 px-0"
            autoFocus
          />
          <kbd className="hidden sm:inline-block rounded bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-500 border">
            ESC
          </kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 bg-slate-50/50">
          {!query.trim() ? (
            <div className="p-6 text-center text-xs text-muted-foreground">
              <p className="font-medium text-slate-700">Quick Search across Mira</p>
              <p className="mt-1">
                Type an Application ID (e.g. <code>APP-2026-000318</code>), scheme name, document, or citizen message.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No matching records found for "{query}".
            </div>
          ) : (
            <ul className="space-y-1">
              {results.map((item) => (
                <li key={item.category + item.id}>
                  <button
                    onClick={() => handleSelect(item.url)}
                    className="w-full flex items-center justify-between p-3 rounded-lg text-left hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-100 group-hover:bg-slate-200/60 shrink-0">
                        {getIcon(item.category)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-navy truncate">
                            {item.title}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      {item.badge && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-teal/10 text-teal">
                          {item.badge}
                        </span>
                      )}
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-gov transition-colors" />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
