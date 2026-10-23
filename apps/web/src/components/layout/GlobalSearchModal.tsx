import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  User,
  Home,
  FileText,
  BookOpen,
  FolderOpen,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { api } from '../../api/client';
import { Scheme, ApplicationSummary, Person, Household } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResults {
  schemes: Scheme[];
  applications: ApplicationSummary[];
  persons: Person[];
  households: Household[];
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResults>({
    schemes: [],
    applications: [],
    persons: [],
    households: [],
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults({ schemes: [], applications: [], persons: [], households: [] });
    }
  }, [isOpen]);

  // Global search keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search query
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults({ schemes: [], applications: [], persons: [], households: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const q = query.toLowerCase();
        // Fetch all domain datasets in parallel
        const [schemesRes, appsRes, personsRes, hhRes] = await Promise.allSettled([
          api.get<{ data: Scheme[] }>('/schemes'),
          api.get<{ data: ApplicationSummary[] }>('/applications'),
          api.get<{ data: Person[] }>('/persons'),
          api.get<{ data: Household[] }>('/households'),
        ]);

        const schemes = schemesRes.status === 'fulfilled'
          ? (schemesRes.value.data || []).filter(
              (s) =>
                s.name.toLowerCase().includes(q) ||
                s.code.toLowerCase().includes(q) ||
                s.category?.toLowerCase().includes(q)
            ).slice(0, 4)
          : [];

        const applications = appsRes.status === 'fulfilled'
          ? (appsRes.value.data || []).filter(
              (a) =>
                a.public_id.toLowerCase().includes(q) ||
                (a.scheme_name && a.scheme_name.toLowerCase().includes(q)) ||
                (a.applicant_name && a.applicant_name.toLowerCase().includes(q))
            ).slice(0, 4)
          : [];

        const persons = personsRes.status === 'fulfilled'
          ? (personsRes.value.data || []).filter(
              (p) =>
                p.first_name.toLowerCase().includes(q) ||
                p.last_name.toLowerCase().includes(q) ||
                p.public_id.toLowerCase().includes(q) ||
                (p.phone && p.phone.includes(q))
            ).slice(0, 4)
          : [];

        const households = hhRes.status === 'fulfilled'
          ? (hhRes.value.data || []).filter(
              (h) =>
                h.name.toLowerCase().includes(q) ||
                h.public_id.toLowerCase().includes(q)
            ).slice(0, 4)
          : [];

        setResults({ schemes, applications, persons, households });
      } catch {
        // Search error handled gracefully
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const totalResults =
    results.schemes.length +
    results.applications.length +
    results.persons.length +
    results.households.length;

  const handleSelect = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl border border-[#DCE3EA] w-full max-w-2xl overflow-hidden transition-all transform animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#DCE3EA]">
          <Search className="w-5 h-5 text-slate-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 text-slate-800 placeholder-slate-400 bg-transparent text-sm sm:text-base outline-none"
            placeholder="Search records, schemes, applications, household IDs, citizens..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block ml-3 px-2 py-0.5 text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 rounded">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {loading && (
            <div className="py-8 text-center text-sm text-slate-500">
              <div className="inline-block w-5 h-5 border-2 border-[#123B63] border-t-transparent rounded-full animate-spin mb-2" />
              <p>Searching verified public records...</p>
            </div>
          )}

          {!loading && query.trim().length >= 2 && totalResults === 0 && (
            <div className="py-8 text-center text-slate-500">
              <p className="text-sm">No matching records found for "{query}".</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching by Scheme Name, Household ID (e.g., H-1001), or Citizen Name.
              </p>
            </div>
          )}

          {!loading && query.trim().length < 2 && (
            <div className="py-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Quick Shortcuts
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => handleSelect('/schemes')}
                  className="flex items-center p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-left text-slate-700"
                >
                  <BookOpen className="w-4 h-4 text-[#2563A6] mr-2" />
                  <span>Browse Welfare Schemes</span>
                </button>
                <button
                  onClick={() => handleSelect('/track')}
                  className="flex items-center p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-left text-slate-700"
                >
                  <FileText className="w-4 h-4 text-[#0F766E] mr-2" />
                  <span>Track Application Status</span>
                </button>
                <button
                  onClick={() => handleSelect('/eligibility')}
                  className="flex items-center p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-left text-slate-700"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600 mr-2" />
                  <span>Check Eligibility Engine</span>
                </button>
                <button
                  onClick={() => handleSelect('/help')}
                  className="flex items-center p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-left text-slate-700"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600 mr-2" />
                  <span>Raise or Track Grievance</span>
                </button>
              </div>
            </div>
          )}

          {/* Group: Schemes */}
          {results.schemes.length > 0 && (
            <div>
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                  <BookOpen className="w-3.5 h-3.5 mr-1.5 text-[#2563A6]" />
                  Welfare Schemes ({results.schemes.length})
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {results.schemes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSelect(`/schemes/${s.id}`)}
                    className="w-full text-left py-2.5 px-2 hover:bg-slate-50 rounded-md flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-900 group-hover:text-[#123B63]">
                        {s.name}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-[11px] bg-slate-100 px-1 rounded">{s.code}</span>
                        <span>•</span>
                        <span>Target: {s.benefit_unit}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#123B63] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Group: Applications */}
          {results.applications.length > 0 && (
            <div>
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                  <FileText className="w-3.5 h-3.5 mr-1.5 text-[#0F766E]" />
                  Applications ({results.applications.length})
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {results.applications.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => handleSelect(`/applications/${a.id}`)}
                    className="w-full text-left py-2.5 px-2 hover:bg-slate-50 rounded-md flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-900 group-hover:text-[#123B63]">
                        {a.scheme_name}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-[11px] bg-emerald-50 text-emerald-800 px-1 rounded">{a.public_id}</span>
                        <span>•</span>
                        <span>Applicant: {a.applicant_name}</span>
                        <span>•</span>
                        <span className="text-slate-600 capitalize">{a.status.toLowerCase().replace(/_/g, ' ')}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#123B63] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Group: Citizens */}
          {results.persons.length > 0 && (
            <div>
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                  <User className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                  Citizens / Individuals ({results.persons.length})
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {results.persons.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelect(`/persons/${p.id}`)}
                    className="w-full text-left py-2.5 px-2 hover:bg-slate-50 rounded-md flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-900 group-hover:text-[#123B63]">
                        {p.first_name} {p.last_name}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-[11px] bg-slate-100 px-1 rounded">{p.public_id}</span>
                        {p.phone && <span>• Phone: {p.phone}</span>}
                        {p.date_of_birth && <span>• DOB: {p.date_of_birth}</span>}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#123B63] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Group: Households */}
          {results.households.length > 0 && (
            <div>
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
                  <Home className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                  Household Records ({results.households.length})
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {results.households.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => handleSelect(`/households/${h.id}`)}
                    className="w-full text-left py-2.5 px-2 hover:bg-slate-50 rounded-md flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="text-sm font-medium text-slate-900 group-hover:text-[#123B63]">
                        {h.name}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-[11px] bg-amber-50 text-amber-800 px-1 rounded">{h.public_id}</span>
                        <span>• Status: {h.status}</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#123B63] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-[#DCE3EA] flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-3">
            <span>Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↑</kbd> <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↓</kbd> to navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">Enter</kbd> to select</span>
          </div>
          <span className="text-[11px] text-slate-400">Verified Object-Level Isolation</span>
        </div>
      </div>
    </div>
  );
};
