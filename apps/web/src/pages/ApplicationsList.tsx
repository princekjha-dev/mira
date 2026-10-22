import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { Application, SchemeScope } from '../types';
import { useTranslation } from '../i18n/context';
import {
  FileText,
  Plus,
  Filter,
  User,
  Home,
  MapPin,
  ArrowRight,
} from 'lucide-react';

export const ApplicationsListPage: React.FC = () => {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const { data: applications = [], isLoading, error } = useQuery<Application[]>({
    queryKey: ['applications', statusFilter],
    queryFn: async () => {
      const url = statusFilter === 'ALL' ? '/applications' : `/applications?status=${statusFilter}`;
      return await api.get<Application[]>(url);
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DISBURSED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            {t('v3.statusDisbursed')}
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            {t('v3.statusApproved')}
          </span>
        );
      case 'UNDER_VERIFICATION':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            {t('v3.statusUnderVerification')}
          </span>
        );
      case 'SUBMITTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300">
            {t('v3.statusSubmitted')}
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
            {t('v3.statusRejected')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
            {status}
          </span>
        );
    }
  };

  const getScopeBadge = (scope?: SchemeScope | null) => {
    if (!scope) return null;
    switch (scope) {
      case 'INDIVIDUAL':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <User className="w-3 h-3 mr-1" />
            {t('v3.scopeIndividual')}
          </span>
        );
      case 'HOUSEHOLD':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Home className="w-3 h-3 mr-1" />
            {t('v3.scopeHousehold')}
          </span>
        );
      case 'PROPERTY':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <MapPin className="w-3 h-3 mr-1" />
            {t('v3.scopeProperty')}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {t('v3.applications')}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Official applications lifecycle, deterministic eligibility assessments, and benefit approvals
              </p>
            </div>
          </div>
        </div>

        <div>
          <Link
            to="/applications/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-xl shadow-xs text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('v3.newApplication')}
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2 flex items-center">
          <Filter className="w-3.5 h-3.5 mr-1" /> Status:
        </span>
        {['ALL', 'SUBMITTED', 'UNDER_VERIFICATION', 'APPROVED', 'DISBURSED', 'REJECTED'].map(
          (st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {st === 'ALL' ? 'All Statuses' : st.replace('_', ' ')}
            </button>
          )
        )}
      </div>

      {/* Table */}
      <div className="mt-6 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="py-16 text-center text-slate-400 text-sm">{t('common.loading')}</div>
        ) : error ? (
          <div className="py-12 text-center text-red-600 text-sm">Failed to load applications</div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No applications found matching the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">Application Number</th>
                  <th className="px-6 py-3.5">Scheme & Scope</th>
                  <th className="px-6 py-3.5">Applicant / Target</th>
                  <th className="px-6 py-3.5">Application Date</th>
                  <th className="px-6 py-3.5">Stage & Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono font-semibold text-slate-900">
                        {app.application_number}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">{app.public_id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        {app.scheme_name || app.scheme_code || 'Scheme'}
                      </div>
                      <div className="mt-1">{getScopeBadge(app.scheme_scope)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-medium text-slate-900">
                        Applicant: {app.applicant_name || app.applicant_person_id}
                      </div>
                      {app.target_label && (
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Target: {app.target_label}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-600">
                      {app.application_date}
                    </td>
                    <td className="px-6 py-4">
                      <div className="mb-1">{getStatusBadge(app.status)}</div>
                      <span className="text-[10px] font-mono uppercase text-slate-400">
                        {app.current_stage}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/applications/${app.id}`}
                        className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-800"
                      >
                        Inspect & Review
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
