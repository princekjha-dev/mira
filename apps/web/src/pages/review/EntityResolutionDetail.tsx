import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api/client';
import {
  EntityResolutionCase,
  EvidenceDirection,
} from '../../types';
import { useTranslation } from '../../i18n/context';
import {
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Scale,
  Lock,
} from 'lucide-react';

export const EntityResolutionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [expandedEvidence, setExpandedEvidence] = useState<Record<string, boolean>>({});
  const [selectedDecision, setSelectedDecision] = useState<'MATCH' | 'NON_MATCH' | 'UNCERTAIN'>('MATCH');
  const [decisionReason, setDecisionReason] = useState<string>('TYPO_IN_OFFICIAL_RECORD');
  const [decisionNotes, setDecisionNotes] = useState<string>('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: erCase, isLoading, error } = useQuery<EntityResolutionCase>({
    queryKey: ['entity-resolution-case', id],
    queryFn: async () => {
      return await api.get<EntityResolutionCase>(`/entity-resolution/cases/${id}`);
    },
    enabled: !!id,
  });

  const resolveMutation = useMutation({
    mutationFn: async (payload: { decision: string; reason: string; notes?: string }) => {
      return await api.post<EntityResolutionCase>(`/entity-resolution/cases/${id}/resolve`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entity-resolution-case', id] });
      queryClient.invalidateQueries({ queryKey: ['entity-resolution-cases'] });
    },
    onError: (err: any) => {
      setSubmitError(err?.message || 'Failed to submit decision');
    },
  });

  const toggleEvidence = (evId: string) => {
    setExpandedEvidence((prev) => ({
      ...prev,
      [evId]: !prev[evId],
    }));
  };

  const getDirectionBadge = (direction: EvidenceDirection) => {
    switch (direction) {
      case 'SUPPORTS_MATCH':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            {t('v4.supportsMatch')}
          </span>
        );
      case 'CONTRADICTS_MATCH':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-rose-600" />
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
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
        Loading entity resolution case evidence...
      </div>
    );
  }

  if (error || !erCase) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl">
          <h2 className="text-lg font-bold mb-2">Error Loading Case</h2>
          <p className="text-sm">Unable to find case {id}. Please check the case identifier.</p>
          <Link to="/review/entity-resolution" className="mt-4 inline-block text-sm font-semibold underline">
            Return to queue
          </Link>
        </div>
      </div>
    );
  }

  const isResolved = erCase.status.startsWith('RESOLVED_');
  const candidate = erCase.candidates && erCase.candidates.length > 0 ? erCase.candidates[0] : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/review/entity-resolution"
          className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to Entity Resolution Cases
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="font-mono text-sm font-bold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md border border-indigo-200">
                {erCase.public_id}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800">
                STATUS: {erCase.status}
              </span>
              {erCase.priority === 'HIGH' && (
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                  PRIORITY: HIGH
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Potential Entity Resolution Review
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Matching Model: <span className="font-mono font-medium">{erCase.matching_model_version}</span> •
              Normalization: <span className="font-mono font-medium">{erCase.normalization_version}</span> •
              Blocking: <span className="font-mono font-medium">{erCase.blocking_version}</span>
            </p>
          </div>

          <div className="text-right">
            {isResolved ? (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-left">
                <span className="text-xs text-slate-400 block font-semibold">FINAL RESOLUTION</span>
                <span className="font-bold text-slate-900">{erCase.resolution || erCase.status}</span>
                {erCase.resolved_at && (
                  <span className="text-xs text-slate-500 block mt-0.5">
                    Resolved at {new Date(erCase.resolved_at).toLocaleString()}
                  </span>
                )}
              </div>
            ) : (
              <div className="inline-flex items-center text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
                <ShieldCheck className="w-4 h-4 mr-1.5 text-amber-600" />
                Human Reviewer Action Required
              </div>
            )}
          </div>
        </div>
      </div>

      {!candidate ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Info className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900">No Candidate Records Surfaced</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Candidate was not surfaced because no sufficiently strong combination of multi-block evidence
            met the threshold criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Section 27: Side-by-Side Comparison */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
              <h2 className="text-base font-bold text-slate-900">
                Record Disambiguation Comparison
              </h2>
              <p className="text-xs text-slate-500">
                Inspect source citizen record alongside the surfaced candidate for field-by-field parity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
              {/* Source Record */}
              <div className="p-6 bg-blue-50/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2.5 py-1 rounded">
                    {t('v4.sourceRecord')} (A)
                  </span>
                  <span className="font-mono text-xs text-slate-400">
                    ID: {erCase.source_entity_id.slice(0, 8)}...
                  </span>
                </div>

                <div className="space-y-4 text-sm">
                  <div>
                    <span className="text-xs text-slate-400 block">Authoritative Name:</span>
                    <span className="text-lg font-bold text-slate-900">
                      {erCase.source_name || 'N/A'}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block">Date of Birth:</span>
                    <span className="font-medium text-slate-800">
                      {erCase.source_dob || 'Missing / Not Recorded'}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block">Gender:</span>
                    <span className="font-medium text-slate-800">
                      {erCase.source_gender || 'Not Recorded'}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block">Address / Locality:</span>
                    <span className="font-medium text-slate-800">
                      {erCase.source_address || 'Not Recorded'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Candidate Record */}
              <div className="p-6 bg-purple-50/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2.5 py-1 rounded">
                    {t('v4.candidateRecord')} (B)
                  </span>
                  <span className="font-mono text-xs text-slate-400">
                    ID: {candidate.candidate_entity_id.slice(0, 8)}...
                  </span>
                </div>

                <div className="space-y-4 text-sm">
                  <div>
                    <span className="text-xs text-slate-400 block">Candidate Name:</span>
                    <span className="text-lg font-bold text-slate-900">
                      {candidate.candidate_name || 'N/A'}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block">Date of Birth:</span>
                    <span className="font-medium text-slate-800">
                      {candidate.candidate_dob || 'Missing / Not Recorded'}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block">Gender:</span>
                    <span className="font-medium text-slate-800">
                      {candidate.candidate_gender || 'Not Recorded'}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block">Address / Locality:</span>
                    <span className="font-medium text-slate-800">
                      {candidate.candidate_address || 'Not Recorded'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 29 & 30: Explainability Callouts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Why Flagged */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center space-x-2 text-blue-900 font-bold mb-2">
                <Info className="w-5 h-5 text-blue-600" />
                <h3>{t('v4.whyFlagged')}</h3>
              </div>
              <p className="text-sm text-blue-950 leading-relaxed">
                {candidate.why_flagged || 'Candidate matched deterministic blocking keys and passed threshold aggregation.'}
              </p>
            </div>

            {/* Why Not Confident */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center space-x-2 text-amber-900 font-bold mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3>{t('v4.whyNotConfident')}</h3>
              </div>
              <p className="text-sm text-amber-950 leading-relaxed">
                {candidate.why_not_confident || 'Manual verification recommended before any administrative action.'}
              </p>
            </div>
          </div>

          {/* Section 28: Visually Prominent Contradiction Alert */}
          {candidate.contradiction_count > 0 && (
            <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-6 shadow-sm">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-rose-200 rounded-lg text-rose-800 mt-0.5">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-rose-900">
                    ⚠ Field Contradiction Detected ({candidate.contradiction_count} conflict(s))
                  </h3>
                  <p className="text-sm text-rose-800 mt-1">
                    Strong disagreement observed on authoritative attributes (such as date of birth or identity).
                    In Mira, a strong contradiction carries significant penalty and prevents automated assumptions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section 80: Evidence Explorer Matrix */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {t('v4.evidence')} Matrix & Provenance
                </h3>
                <p className="text-xs text-slate-500">
                  Detailed directional analysis for every compared attribute. Click any item to inspect algorithm details.
                </p>
              </div>
              <div className="text-xs font-semibold px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-700">
                Assessment: <span className="font-bold text-blue-700">{candidate.overall_assessment}</span>
              </div>
            </div>

            <div className="divide-y divide-slate-200">
              {candidate.evidence?.map((ev) => {
                const isExpanded = !!expandedEvidence[ev.id];
                return (
                  <div key={ev.id} className="p-5 hover:bg-slate-50/50 transition-colors">
                    <div
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 cursor-pointer"
                      onClick={() => toggleEvidence(ev.id)}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {ev.field}
                          </span>
                          {getDirectionBadge(ev.direction)}
                          <span className="text-xs font-mono text-slate-400">
                            Similarity: {(ev.similarity * 100).toFixed(0)}%
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-900">
                          {ev.explanation}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3 self-end sm:self-center text-xs text-blue-600 font-semibold">
                        <span>{isExpanded ? 'Hide Details' : 'Inspect Algorithm'}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>

                    {/* Expanded Algorithm & Normalization Inspector */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-200/80 bg-slate-50 p-4 rounded-lg text-xs space-y-2 text-slate-700 font-mono">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <span className="text-slate-400 block font-sans">Source Observed Value:</span>
                            <span className="font-semibold text-slate-900 break-all">
                              {ev.source_value || '<NULL>'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-sans">Candidate Observed Value:</span>
                            <span className="font-semibold text-slate-900 break-all">
                              {ev.candidate_value || '<NULL>'}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-200">
                          <div>
                            <span className="text-slate-400 block font-sans">Comparison Algorithm:</span>
                            <span className="font-semibold text-indigo-700">{ev.comparison_method}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-sans">Configured Weight:</span>
                            <span className="font-semibold">{ev.weight}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-sans">Normalized Similarity:</span>
                            <span className="font-semibold">{ev.similarity.toFixed(4)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 52/53: Human Decision Action Screen */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center space-x-2 text-slate-900 font-bold text-lg mb-1">
              <Scale className="w-5 h-5 text-indigo-600" />
              <h2>{t('v4.decision')} & Official Resolution</h2>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Only authorized officers can register an official resolution. Every decision is immutable and permanently recorded in the audit trail.
            </p>

            {isResolved ? (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
                <div className="flex items-center space-x-2 text-slate-700 font-semibold mb-2">
                  <Lock className="w-4 h-4 text-slate-500" />
                  <span>Case Resolved</span>
                </div>
                <p className="text-sm text-slate-600">
                  This entity resolution case has been resolved as{' '}
                  <span className="font-bold text-slate-900">{erCase.resolution}</span> by official reviewer.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitError(null);
                  resolveMutation.mutate({
                    decision: selectedDecision,
                    reason: decisionReason,
                    notes: decisionNotes,
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
                    Select Official Determination:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedDecision('MATCH')}
                      className={`p-3 rounded-lg border text-sm font-semibold flex items-center justify-center space-x-2 transition-all ${
                        selectedDecision === 'MATCH'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{t('v4.confirmMatch')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedDecision('NON_MATCH')}
                      className={`p-3 rounded-lg border text-sm font-semibold flex items-center justify-center space-x-2 transition-all ${
                        selectedDecision === 'NON_MATCH'
                          ? 'border-slate-700 bg-slate-100 text-slate-900 ring-2 ring-slate-700/20'
                          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <XCircle className="w-4 h-4 text-slate-600" />
                      <span>{t('v4.notAMatch')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedDecision('UNCERTAIN')}
                      className={`p-3 rounded-lg border text-sm font-semibold flex items-center justify-center space-x-2 transition-all ${
                        selectedDecision === 'UNCERTAIN'
                          ? 'border-purple-500 bg-purple-50 text-purple-800 ring-2 ring-purple-500/20'
                          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <HelpCircle className="w-4 h-4 text-purple-600" />
                      <span>{t('v4.markUncertain')}</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    {t('v4.decisionReason')} (Mandatory)
                  </label>
                  <select
                    value={decisionReason}
                    onChange={(e) => setDecisionReason(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="TYPO_IN_OFFICIAL_RECORD">Typo / Spelling Discrepancy in Official Record</option>
                    <option value="TRANSLITERATION_VARIATION">Hindi / Devanagari Transliteration Equivalence</option>
                    <option value="DIFFERENT_PERSON">Distinct Individuals Despite Name Similarity</option>
                    <option value="CONFLICTING_DOB_UNVERIFIED">Conflicting Date of Birth from Unverified Source</option>
                    <option value="DOCUMENTARY_PROOF_VERIFIED">Physical Supporting Documentation Verified</option>
                    <option value="INSUFFICIENT_INFORMATION">Insufficient Information to Disambiguate</option>
                    <option value="OTHER">Other Reason (Documented in Notes)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    {t('v4.decisionNotes')}
                  </label>
                  <textarea
                    rows={3}
                    value={decisionNotes}
                    onChange={(e) => setDecisionNotes(e.target.value)}
                    placeholder="Enter audit justification and rationale for this determination..."
                    className="w-full text-sm border border-slate-300 rounded-lg p-3 text-slate-800 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-end space-x-4 pt-2">
                  <Link
                    to="/review/entity-resolution"
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={resolveMutation.isPending}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-sm transition-colors disabled:opacity-50"
                  >
                    {resolveMutation.isPending ? 'Recording Determination...' : 'Submit Human Resolution'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
