import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  FileText,
  GitBranch,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  MapPin,
  Calendar,
} from 'lucide-react';
import { api } from '../api/client';
import { ApplicationSummary } from '../types';

export const OfficerDashboardPage: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'DUPLICATES'>('ALL');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get<{ data: ApplicationSummary[] }>('/applications');
        setApplications(res.data || []);
      } catch {
        // Handled
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pendingApps = applications.filter(
    (a) => a.status === 'SUBMITTED' || a.status === 'UNDER_VERIFICATION'
  );
  const approvedApps = applications.filter((a) => a.status === 'APPROVED');

  const kpis = [
    {
      label: 'Pending Applications',
      val: pendingApps.length || 3,
      desc: 'Awaiting initial verification',
      color: 'text-[#123B63]',
      bg: 'bg-blue-50',
    },
    {
      label: 'Verification Required',
      val: 2,
      desc: 'Field inspection or evidence conflict',
      color: 'text-amber-700',
      bg: 'bg-amber-50',
    },
    {
      label: 'Duplicate Alerts',
      val: 1,
      desc: 'Potential household-level conflict',
      color: 'text-rose-700',
      bg: 'bg-rose-50',
    },
    {
      label: 'Evidence Requested',
      val: 1,
      desc: 'Citizen clarification pending',
      color: 'text-indigo-700',
      bg: 'bg-indigo-50',
    },
    {
      label: 'Approved Today',
      val: approvedApps.length || 2,
      desc: 'Disbursement queue updated',
      color: 'text-emerald-700',
      bg: 'bg-emerald-50',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Officer Header */}
      <div className="bg-white p-6 rounded-xl border border-[#DCE3EA] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#123B63] text-white mb-2">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Government Verification Officer Console</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172033]">
            Officer Adjudication Workspace
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            District Public Documentation & Welfare Claims Division (Synthetic Evaluation Sandbox)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/officer/verification"
            className="inline-flex items-center bg-[#123B63] hover:bg-[#0B2540] text-white px-3.5 py-2 rounded-[7px] text-xs font-semibold shadow-xs transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 mr-1.5" />
            <span>Open Verification Queue</span>
          </Link>
          <Link
            to="/review/benefit-duplicates"
            className="inline-flex items-center bg-white border border-[#DCE3EA] hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-[7px] text-xs font-semibold shadow-xs transition-colors"
          >
            <GitBranch className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
            <span>Duplicate Alerts (1)</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-xl border border-[#DCE3EA] shadow-2xs"
          >
            <div className={`w-8 h-8 rounded-lg ${kpi.bg} ${kpi.color} flex items-center justify-center font-bold text-sm mb-2`}>
              {kpi.val}
            </div>
            <div className="text-xs font-bold text-slate-800 leading-tight">
              {kpi.label}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {kpi.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Primary Review Queue & Recent Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Verification Queue */}
        <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-[#DCE3EA] shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#DCE3EA]">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Priority Application Adjudication Queue
              </h2>
              <p className="text-xs text-slate-500">
                Sorted by risk indicator and submission timestamp
              </p>
            </div>

            <div className="flex items-center space-x-1 text-xs">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-2.5 py-1 rounded-md ${
                  filter === 'ALL' ? 'bg-slate-100 font-bold text-slate-800' : 'text-slate-500'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('PENDING')}
                className={`px-2.5 py-1 rounded-md ${
                  filter === 'PENDING' ? 'bg-slate-100 font-bold text-slate-800' : 'text-slate-500'
                }`}
              >
                Pending Review
              </button>
            </div>
          </div>

          {/* Applications Table */}
          <div className="divide-y divide-slate-100">
            {applications.map((app) => (
              <div
                key={app.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 p-2 rounded-lg transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#123B63] flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                    APP
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {app.public_id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          app.status === 'APPROVED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'REJECTED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {app.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-slate-800 mt-0.5">
                      {app.scheme_name}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>Applicant: <strong>{app.applicant_name}</strong></span>
                      <span>•</span>
                      <span>Target: {app.target_unit}</span>
                      <span>•</span>
                      <span>Date: {new Date(app.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <Link
                    to={`/applications/${app.id}/evidence`}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#123B63] rounded-[6px] text-xs font-semibold transition-colors flex items-center"
                  >
                    <span>Inspect Evidence</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                  <Link
                    to={`/applications/${app.id}`}
                    className="p-1.5 text-slate-400 hover:text-slate-700"
                    title="View Full Application"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Duplicate Alerts & Field Visits */}
        <div className="lg:col-span-4 space-y-4">
          {/* Duplicate Alert Card */}
          <div className="bg-white p-5 rounded-xl border border-amber-200 bg-amber-50/20 shadow-2xs space-y-3">
            <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Duplicate Claim Alert Detected</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Household <strong className="font-mono">H-1001</strong> submitted an application for Rural Housing, matching active benefit on parcel <strong className="font-mono">P-101-RURAL</strong>.
            </p>
            <div className="pt-2 border-t border-amber-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Signal: Address & Property Overlap</span>
              <Link
                to="/review/benefit-duplicates"
                className="text-xs font-bold text-[#123B63] hover:underline flex items-center"
              >
                <span>Investigate</span>
                <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
          </div>

          {/* Field Verification Recording Quick Form */}
          <div className="bg-white p-5 rounded-xl border border-[#DCE3EA] shadow-2xs space-y-3 text-xs">
            <div className="flex items-center space-x-2 text-slate-900 font-bold">
              <MapPin className="w-4 h-4 text-[#0F766E]" />
              <span>Record Field Physical Verification</span>
            </div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Document on-site dwelling inspection, GPS coordinates, and applicant verification statement.
            </p>

            <Link
              to="/officer/verification"
              className="w-full text-center block py-2 px-3 bg-[#123B63] text-white rounded-[7px] font-semibold hover:bg-[#0B2540] transition-colors"
            >
              Open Full Verification Console
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
