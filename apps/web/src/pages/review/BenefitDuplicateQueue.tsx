import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { BenefitDuplicateCase, DuplicateCategory } from '../../types';
import { useTranslation } from '../../i18n/context';
import {
  Copy,
  Filter,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Home,
  User,
  MapPin,
  Award,
} from 'lucide-react';

export const BenefitDuplicateQueuePage: React.FC = () => {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const { data: cases = [], isLoading } = useQuery<BenefitDuplicateCase[]>({
    queryKey: ['benefit-duplicate-cases', statusFilter],
    queryFn: async () => {
      const url = statusFilter === 'ALL'
        ? '/benefit-duplicate-checks'
        : `/benefit-duplicate-checks?status=${statusFilter}`;
      return await api.get<BenefitDuplicateCase[]>(url);
    },
  });

  const getAssessmentBadge = (cat: DuplicateCategory) => {
    switch (cat) {
      case 'EXACT_DUPLICATE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {t('v4.exactDuplicate')}
          </span>
        );
      case 'LIKELY_DUPLICATE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {t('v4.likelyDuplicate')}
          </span>
        );
      case 'POTENTIAL_DUPLICATE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-300">
            <HelpCircle className="w-3 h-3 mr-1" />
            {t('v4.potentialDuplicate')}
          </span>
        );
      case 'NOT_DUPLICATE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {t('v4.notDuplicate')}
          </span>
        );
      case 'INSUFFICIENT_INFORMATION':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {t('v4.insufficientInfo')}
          </span>
        );
    }
  };

  const getScopeBadge = (scope?: string) => {
    switch (scope) {
      case 'INDIVIDUAL':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <User className="w-3 h-3 mr-1" />
            INDIVIDUAL
          </span>
        );
      case 'HOUSEHOLD':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Home className="w-3 h-3 mr-1" />
            HOUSEHOLD
          </span>
        );
      case 'PROPERTY':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <MapPin className="w-3 h-3 mr-1" />
            PROPERTY
          </span>
        );
      default:
        return null;
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
            <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
              <Copy className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {t('v4.duplicateCases')}
            </h1>
          </div>
          <p className="text-sm text-slate-500">
            Temporal benefit conflict detection across individual, household, and property entitlements.
          </p>
        </div>

        {/* Notice */}
        <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 font-medium">
          <ShieldAlert className="w-4 h-4 mr-1.5 text-amber-600" />
          {t('v4.humanReviewBanner')}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-slate-300 rounded-md px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="ALL">All Checks</option>
            <option value="OPEN">Open</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="CONFIRMED_DUPLICATE">Confirmed Duplicate</option>
            <option value="RESOLVED_NOT_DUPLICATE">Not a Duplicate</option>
            <option value="REQUIRES_MORE_EVIDENCE">Requires More Evidence</option>
          </select>
        </div>

        <div className="text-xs text-slate-500">
          Showing <span className="font-semibold text-slate-700">{cases.length}</span> duplicate checks
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
          <div className="animate-spin w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full mx-auto mb-3" />
          Loading duplicate benefit review cases...
        </div>
      ) : cases.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900 mb-1">No Benefit Duplicate Checks Found</h3>
          <p className="text-sm text-slate-500 mb-4">
            No applications have pending duplicate risk flags in this view.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {cases.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:border-amber-300 hover:shadow-md transition-all p-5"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
                      {c.public_id}
                    </span>
                    {getAssessmentBadge(c.overall_assessment)}
                    {getPriorityBadge(c.priority)}
                    {getScopeBadge(c.scheme_scope)}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {c.scheme_name || 'Government Scheme Claim'}
                    </h3>
                    <p className="text-sm text-slate-600 mt-0.5">
                      {c.reason}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-slate-500 pt-1">
                    <div>
                      <span className="text-slate-400">Applicant:</span>{' '}
                      <span className="font-semibold text-slate-800">
                        {c.applicant_person_name || 'Applicant'}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400">Rules Version:</span>{' '}
                      <span className="font-mono text-slate-700">{c.duplicate_rules_version}</span>
                    </div>

                    <div>
                      <span className="text-slate-400">Recommendation:</span>{' '}
                      <span className="font-medium text-amber-700">{c.recommended_action}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 self-end lg:self-center">
                  <div className="text-right hidden sm:block">
                    <span className="text-xs text-slate-400 block">Status</span>
                    <span className="text-xs font-bold text-slate-700">
                      {c.status}
                    </span>
                  </div>

                  <Link
                    to={`/review/benefit-duplicates/${c.id}`}
                    className="inline-flex items-center px-4 py-2 text-sm font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors"
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
