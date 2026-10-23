import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Shield,
  ArrowRight,
  ExternalLink,
  Building,
  User,
  Calendar,
} from 'lucide-react';
import { api } from '../api/client';
import { ApplicationSummary } from '../types';

export const TrackApplicationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';
  const [appId, setAppId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState<ApplicationSummary | null>(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!appId.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      // Fetch all applications and locate matching record by public_id or applicant name
      const res = await api.get<{ data: ApplicationSummary[] }>('/applications');
      const all = res.data || [];
      const match = all.find(
        (a) =>
          a.public_id.toLowerCase() === appId.trim().toLowerCase() ||
          a.id.toLowerCase() === appId.trim().toLowerCase() ||
          (a.applicant_name && a.applicant_name.toLowerCase().includes(appId.trim().toLowerCase()))
      );

      if (match) {
        setApplication(match);
      } else {
        setApplication(null);
      }
    } catch (err: any) {
      setError(err?.message || 'Could not query application tracking database.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (initialId) {
      handleSearch();
    }
  }, [initialId]);

  // Stage resolution based on status
  const getStageIndex = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'DRAFT') return 0;
    if (s === 'SUBMITTED') return 1;
    if (s === 'UNDER_VERIFICATION') return 2;
    if (s === 'APPROVED' || s === 'REJECTED' || s === 'DISBURSED') return 4;
    return 3;
  };

  const timelineSteps = [
    { title: 'Application Submitted', desc: 'Received by Department system' },
    { title: 'Documents Checked', desc: 'OCR & field extraction consistency' },
    { title: 'Eligibility Evaluated', desc: 'Deterministic rule engine assessment' },
    { title: 'Officer Adjudication', desc: 'Manual review & duplicate investigation' },
    { title: 'Final Decision', desc: 'Consequential approval or rejection' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-xl border border-[#DCE3EA] shadow-2xs">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#123B63] flex items-center justify-center">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#172033]">
              Track Public Welfare Application
            </h1>
            <p className="text-xs text-slate-500">
              Enter your Application Reference ID to inspect real-time progress and verification stages.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-4 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              placeholder="e.g. APP-2026-PMGSY-001 or Applicant Name"
              className="w-full bg-[#F5F5F1] border border-[#DCE3EA] rounded-[7px] px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563A6]"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !appId.trim()}
            className="bg-[#123B63] hover:bg-[#0B2540] disabled:opacity-50 text-white font-semibold text-xs px-5 py-2.5 rounded-[7px] shadow-xs transition-colors"
          >
            {loading ? 'Searching...' : 'Track Application'}
          </button>
        </form>

        {/* Demo Fast Fill Chips */}
        <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 overflow-x-auto no-scrollbar">
          <span className="font-medium text-slate-400">Quick Test IDs:</span>
          <button
            type="button"
            onClick={() => {
              setAppId('APP-2026-PMGSY-001');
              setTimeout(handleSearch, 50);
            }}
            className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono transition-colors"
          >
            APP-2026-PMGSY-001
          </button>
          <button
            type="button"
            onClick={() => {
              setAppId('Rahul');
              setTimeout(handleSearch, 50);
            }}
            className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Applicant: Rahul
          </button>
        </div>
      </div>

      {/* Results View */}
      {searched && !loading && (
        <>
          {application ? (
            <div className="bg-white p-6 rounded-xl border border-[#DCE3EA] shadow-2xs space-y-6">
              {/* Application Summary Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#DCE3EA] gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm font-bold text-[#123B63]">
                      {application.public_id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        application.status === 'APPROVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : application.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {application.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">
                    {application.scheme_name}
                  </h2>
                </div>

                <Link
                  to={`/applications/${application.id}`}
                  className="inline-flex items-center text-xs font-semibold text-[#2563A6] hover:underline"
                >
                  <span>Open Full Record Workspace</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>

              {/* Core Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#F8F8F5] rounded-lg border border-[#DCE3EA] text-xs">
                <div>
                  <div className="text-slate-500 font-medium">Applicant</div>
                  <div className="font-semibold text-slate-900 mt-0.5 flex items-center">
                    <User className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {application.applicant_name}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 font-medium">Target Benefit Unit</div>
                  <div className="font-semibold text-slate-900 mt-0.5">
                    {application.target_unit}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 font-medium">Household Context</div>
                  <div className="font-semibold text-slate-900 mt-0.5 font-mono">
                    {application.household_id ? 'Linked H-1001' : 'Individual'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 font-medium">Submitted Date</div>
                  <div className="font-semibold text-slate-900 mt-0.5 flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {new Date(application.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Progress Timeline */}
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                  Lifecycle Verification Timeline
                </h3>
                <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#DCE3EA]">
                  {timelineSteps.map((step, idx) => {
                    const currentStage = getStageIndex(application.status);
                    const isCompleted = idx <= currentStage;
                    const isCurrent = idx === currentStage;

                    return (
                      <div key={idx} className="relative flex items-start space-x-3">
                        <div
                          className={`absolute -left-6 sm:-left-8 mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white ${
                            isCompleted
                              ? 'bg-[#15803D] text-white'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <div>
                          <div
                            className={`text-sm font-semibold ${
                              isCompleted ? 'text-slate-900' : 'text-slate-400'
                            }`}
                          >
                            {step.title}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {step.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Civic Notice */}
              <div className="p-3.5 bg-blue-50/50 rounded-lg border border-blue-200 text-xs text-[#123B63] flex items-start space-x-2">
                <Shield className="w-4 h-4 text-[#2563A6] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Notice on Authoritative Adjudication:</span> All decisions require
                  documented evidence, cross-document OCR extraction consistency, and explicit sign-off by a
                  credentialed government verification officer.
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl border border-[#DCE3EA] text-center text-slate-500">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <div className="text-sm font-semibold text-slate-800">No application found</div>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No active public welfare application matches reference identifier "{appId}". Please check the spelling or track via your registered mobile number.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
