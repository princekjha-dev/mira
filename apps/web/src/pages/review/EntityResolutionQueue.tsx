import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { EntityResolutionCase } from '../../types';
import { useTranslation } from '../../i18n/context';
import {
  Users,
  Filter,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';

export const EntityResolutionQueuePage: React.FC = () => {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const { data: cases = [], isLoading } = useQuery<EntityResolutionCase[]>({
    queryKey: ['entity-resolution-cases', statusFilter],
    queryFn: async () => {
      const url = statusFilter === 'ALL'
        ? '/entity-resolution/cases'
        : `/entity-resolution/cases?status=${statusFilter}`;
      return await api.get<EntityResolutionCase[]>(url);
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            OPEN
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            UNDER REVIEW
          </span>
        );
      case 'RESOLVED_MATCH':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            RESOLVED MATCH
          </span>
        );
      case 'RESOLVED_NON_MATCH':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <XCircle className="w-3 h-3 mr-1" />
            NON-MATCH
          </span>
        );
      case 'RESOLVED_UNCERTAIN':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            UNCERTAIN
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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            HIGH
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-600">
            LOW
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
              <Users className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {t('v4.entityResolutionCases')}
            </h1>
          </div>
          <p className="text-sm text-slate-500">
            Multilingual transliteration & deterministic typo resolution with human oversight.
          </p>
        </div>

        {/* Notice */}
        <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800 font-medium">
          <ShieldAlert className="w-4 h-4 mr-1.5 text-blue-600" />
          {t('v4.humanReviewBanner')}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Status Filter:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-slate-300 rounded-md px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Cases</option>
            <option value="OPEN">Open</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="RESOLVED_MATCH">Resolved Match</option>
            <option value="RESOLVED_NON_MATCH">Resolved Non-Match</option>
            <option value="RESOLVED_UNCERTAIN">Resolved Uncertain</option>
          </select>
        </div>

        <div className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-700">{cases.length}</span> cases
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
          Loading entity resolution review queue...
        </div>
      ) : cases.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900 mb-1">No Entity Resolution Cases Found</h3>
          <p className="text-sm text-slate-500 mb-4">
            No records currently require manual entity disambiguation in this view.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {cases.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all p-5"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
                      {c.public_id}
                    </span>
                    {getStatusBadge(c.status)}
                    {getPriorityBadge(c.priority)}
                    <span className="text-xs text-slate-400 font-mono">
                      v:{c.matching_model_version}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-slate-700">
                    <div>
                      <span className="text-xs text-slate-400 block">Source Person:</span>
                      <span className="font-semibold text-slate-900 text-base">
                        {c.source_name || 'Anonymous Person Record'}
                      </span>
                    </div>

                    {c.source_dob && (
                      <div>
                        <span className="text-xs text-slate-400 block">Date of Birth:</span>
                        <span className="font-medium">{c.source_dob}</span>
                      </div>
                    )}

                    {c.source_gender && (
                      <div>
                        <span className="text-xs text-slate-400 block">Gender:</span>
                        <span className="font-medium">{c.source_gender}</span>
                      </div>
                    )}

                    {c.source_address && (
                      <div>
                        <span className="text-xs text-slate-400 block">Locality / Address:</span>
                        <span className="font-medium">{c.source_address}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4 self-end lg:self-center">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs text-slate-400 block">Created</span>
                    <span className="text-xs font-medium text-slate-600">
                      {new Date(c.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <Link
                    to={`/review/entity-resolution/${c.id}`}
                    className="inline-flex items-center px-4 py-2 text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
                  >
                    <span>Inspect Evidence</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
