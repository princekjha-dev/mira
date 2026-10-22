import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import {
  BenefitDuplicateCase,
  EvidenceDirection,
} from '../../types';
import { useTranslation } from '../../i18n/context';
import {
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Info,
  Layers,
  Scale,
  Lock,
} from 'lucide-react';

export const BenefitDuplicateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [selectedDecision, setSelectedDecision] = useState<'CONFIRMED_DUPLICATE' | 'NOT_DUPLICATE' | 'REQUIRES_MORE_EVIDENCE'>('NOT_DUPLICATE');
  const [decisionReason, setDecisionReason] = useState<string>('HOUSEHOLD_SEPARATION');
  const [decisionExplanation, setDecisionExplanation] = useState<string>('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: bCase, isLoading, error } = useQuery<BenefitDuplicateCase>({
    queryKey: ['benefit-duplicate-case', id],
    queryFn: async () => {
      return await api.get<BenefitDuplicateCase>(`/benefit-duplicate-checks/${id}`);
    },
    enabled: !!id,
  });

  const decideMutation = useMutation({
    mutationFn: async (payload: { decision: string; reason: string; explanation?: string }) => {
      return await api.post<BenefitDuplicateCase>(`/benefit-duplicate-checks/${id}/decision`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['benefit-duplicate-case', id] });
      queryClient.invalidateQueries({ queryKey: ['benefit-duplicate-cases'] });
    },
    onError: (err: any) => {
      setSubmitError(err?.message || 'Failed to record decision');
    },
  });

  const getDirectionBadge = (direction: EvidenceDirection) => {
    switch (direction) {
      case 'SUPPORTS_MATCH':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
            {t('v4.supportsMatch')}
          </span>
        );
      case 'CONTRADICTS_MATCH':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            {t('v4.contradictsMatch')}
          </span>
        );
      case 'NEUTRAL':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <HelpCircle className="w-3.5 h-3.5 mr-1 text-slate-500" />
            {t('v4.neutral')}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-slate-500">
        <div className="animate-spin w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full mx-auto mb-3" />
        Loading benefit duplicate intelligence assessment...
      </div>
    );
  }

  if (error || !bCase) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl">
          <h2 className="text-lg font-bold mb-2">Error Loading Case</h2>
          <p className="text-sm">Unable to find benefit duplicate check {id}.</p>
          <Link to="/review/benefit-duplicates" className="mt-4 inline-block text-sm font-semibold underline">
            Return to queue
          </Link>
        </div>
      </div>
    );
  }

  const isResolved = bCase.status.startsWith('CONFIRMED_') || bCase.status.startsWith('RESOLVED_');
  const candidate = bCase.candidates && bCase.candidates.length > 0 ? bCase.candidates[0] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/review/benefit-duplicates"
          className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Duplicate Review Queue
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="font-mono text-sm font-bold bg-amber-50 text-amber-800 px-3 py-1 rounded-md border border-amber-200">
                {bCase.public_id}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800">
                STATUS: {bCase.status}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                ASSESSMENT: {bCase.overall_assessment}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Benefit Duplicate Risk Intelligence
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Applicant: <span className="font-semibold text-slate-800">{bCase.applicant_person_name || 'Applicant'}</span> •
              Scheme: <span className="font-semibold text-slate-800">{bCase.scheme_name || 'Scheme'}</span> •
              Scope: <span className="font-semibold text-slate-800">{bCase.scheme_scope || 'INDIVIDUAL'}</span> •
              Rules Version: <span className="font-mono font-medium">{bCase.duplicate_rules_version}</span>
            </p>
          </div>

          <div className="text-right">
            {isResolved ? (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-left">
                <span className="text-xs text-slate-400 block font-semibold">FINAL DECISION</span>
                <span className="font-bold text-slate-900">{bCase.resolution || bCase.status}</span>
                {bCase.resolved_at && (
                  <span className="text-xs text-slate-500 block mt-0.5">
                    Decided at {new Date(bCase.resolved_at).toLocaleString()}
                  </span>
                )}
              </div>
            ) : (
              <div className="inline-flex items-center text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
                <ShieldCheck className="w-4 h-4 mr-1.5 text-amber-600" />
                Human Adjudication Required
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 50: Why Flagged Banner */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-amber-200 rounded-lg text-amber-800 mt-0.5">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-amber-950 mb-1">
              {t('v4.whyFlagged')}
            </h2>
            <p className="text-sm text-amber-900 leading-relaxed font-medium">
              {bCase.reason}
            </p>
            <div className="mt-3 text-xs text-amber-800 bg-white/60 p-2.5 rounded-lg border border-amber-200/60 inline-block">
              <span className="font-bold">Recommended Administrative Action:</span> {bCase.recommended_action}
            </div>
          </div>
        </div>
      </div>

      {/* Section 72: Household & Property Context */}
      {bCase.household_context && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-2 text-slate-900 font-bold mb-4">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base">{t('v4.householdContext')}</h3>
          </div>
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs font-mono text-slate-700 overflow-x-auto">
            <pre>{JSON.stringify(bCase.household_context, null, 2)}</pre>
          </div>
        </div>
      )}

      {/* Candidate Benefit & Evidence */}
      {candidate && (
        <div className="space-y-8 mb-8">
          {/* Affected Benefit History Details */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                {t('v4.affectedBenefit')}
              </h3>
              <p className="text-xs text-slate-500">
                Comparison of the proposed entitlement against existing active grants in the ledger.
              </p>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  New Incoming Claim
                </span>
                <div>
                  <span className="text-xs text-slate-400 block">Applicant:</span>
                  <span className="font-semibold text-slate-900">{bCase.applicant_person_name || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Requested Scheme:</span>
                  <span className="font-medium text-slate-800">{bCase.scheme_name || 'N/A'}</span>
                </div>
              </div>

              <div className="p-4 bg-amber-50/40 rounded-lg border border-amber-200 space-y-2">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                  Existing Recorded Grant
                </span>
                <div>
                  <span className="text-xs text-slate-400 block">Existing Beneficiary Unit:</span>
                  <span className="font-semibold text-slate-900">
                    {candidate.existing_person_name || candidate.existing_household_name || candidate.existing_property_address || 'Unit in Ledger'}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Existing Grant Period:</span>
                  <span className="font-medium text-slate-800">
                    {candidate.existing_benefit_period || 'Active Grant Period'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Evidence Matrix */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                {t('v4.evidence')} Analysis
              </h3>
              <p className="text-xs text-slate-500">
                Directional signals evaluated across scope, temporal overlap, unit identity, and asset linkage.
              </p>
            </div>

            <div className="divide-y divide-slate-200">
              {candidate.evidence?.map((ev) => (
                <div key={ev.id} className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {ev.field}
                      </span>
                      {getDirectionBadge(ev.direction)}
                      <span className="text-xs font-mono text-slate-400">
                        Method: {ev.comparison_method}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-900">
                      {ev.explanation}
                    </p>
                  </div>

                  <div className="text-xs text-slate-500 self-end sm:self-center">
                    Result: <span className="font-semibold text-slate-800">{ev.comparison_result}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Human Decision & Override Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-lg mb-1">
          <Scale className="w-5 h-5 text-amber-600" />
          <h2>{t('v4.decision')} & Adjudication Override</h2>
        </div>
        <p className="text-xs text-slate-500 mb-6">
          Mira never automatically rejects public applications. Authorized officials determine duplicate validity with mandatory rationale logging.
        </p>

        {isResolved ? (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
            <div className="flex items-center space-x-2 text-slate-700 font-semibold mb-2">
              <Lock className="w-4 h-4 text-slate-500" />
              <span>Decision Registered</span>
            </div>
            <p className="text-sm text-slate-600">
              Official decision registered as <span className="font-bold text-slate-900">{bCase.resolution}</span>.
            </p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitError(null);
              decideMutation.mutate({
                decision: selectedDecision,
                reason: decisionReason,
                explanation: decisionExplanation,
              });
            }}
            className="space-y-6"
          >
            {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                {submitError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Official Determination:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedDecision('CONFIRMED_DUPLICATE')}
                  className={`p-3 rounded-lg border text-sm font-semibold flex items-center justify-center space-x-2 transition-all ${
                    selectedDecision === 'CONFIRMED_DUPLICATE'
                      ? 'border-rose-500 bg-rose-50 text-rose-800 ring-2 ring-rose-500/20'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>{t('v4.confirmedDuplicate')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDecision('NOT_DUPLICATE')}
                  className={`p-3 rounded-lg border text-sm font-semibold flex items-center justify-center space-x-2 transition-all ${
                    selectedDecision === 'NOT_DUPLICATE'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{t('v4.notDuplicate')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDecision('REQUIRES_MORE_EVIDENCE')}
                  className={`p-3 rounded-lg border text-sm font-semibold flex items-center justify-center space-x-2 transition-all ${
                    selectedDecision === 'REQUIRES_MORE_EVIDENCE'
                      ? 'border-amber-500 bg-amber-50 text-amber-800 ring-2 ring-amber-500/20'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>{t('v4.moreEvidenceRequired')}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                {t('v4.decisionReason')} (Predefined Override Rationale)
              </label>
              <select
                value={decisionReason}
                onChange={(e) => setDecisionReason(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800 focus:ring-2 focus:ring-amber-500"
              >
                <option value="HOUSEHOLD_SEPARATION">Household Separation (Member separated before application date)</option>
                <option value="DIFFERENT_PERSON">Distinct Beneficiaries (Different person entitlement)</option>
                <option value="INCORRECT_SOURCE_DATA">Incorrect / Stale Source Provenance Data</option>
                <option value="DUPLICATE_CONFIRMED">Duplicate Entitlement Confirmed on Same Asset/Unit</option>
                <option value="PROPERTY_ALREADY_BENEFITED">Property Already Received Active Grant</option>
                <option value="INSUFFICIENT_EVIDENCE">Insufficient Evidence to Determine</option>
                <option value="OTHER">Other Administrative Reason</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                {t('v4.decisionNotes')}
              </label>
              <textarea
                rows={3}
                value={decisionExplanation}
                onChange={(e) => setDecisionExplanation(e.target.value)}
                placeholder="Enter detailed audit justification for this adjudication..."
                className="w-full text-sm border border-slate-300 rounded-lg p-3 text-slate-800 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center justify-end space-x-4 pt-2">
              <Link
                to="/review/benefit-duplicates"
                className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={decideMutation.isPending}
                className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors disabled:opacity-50"
              >
                {decideMutation.isPending ? 'Recording Adjudication...' : 'Submit Official Determination'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
