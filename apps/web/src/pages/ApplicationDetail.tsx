import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { Application, EligibilityAssessment, Benefit, SchemeScope } from '../types';
import { useTranslation } from '../i18n/context';
import { useAuth } from '../context/AuthContext';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowLeft,
  User,
  Home,
  MapPin,
  ShieldCheck,
  Award,
  Sparkles,
} from 'lucide-react';

export const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [actionError, setActionError] = useState<string>('');
  const [actionSuccess, setActionSuccess] = useState<string>('');

  const canReview = user?.roles.some((r) =>
    ['VERIFICATION_OFFICER', 'DEPARTMENT_ADMIN', 'SUPER_ADMIN'].includes(r)
  );

  // 1. Fetch application
  const { data: app, isLoading: appLoading } = useQuery<Application>({
    queryKey: ['application', id],
    queryFn: async () => {
      return await api.get<Application>(`/applications/${id}`);
    },
    enabled: !!id,
  });

  // 2. Fetch latest assessment if available
  const { data: assessment } = useQuery<EligibilityAssessment>({
    queryKey: ['application-assessment', id],
    queryFn: async () => {
      return await api.get<EligibilityAssessment>(`/applications/${id}/assessment`);
    },
    enabled: !!id,
    retry: false,
  });

  // 3. Fetch linked benefit if approved/disbursed
  const { data: benefits = [] } = useQuery<Benefit[]>({
    queryKey: ['application-benefit', id],
    queryFn: async () => {
      return await api.get<Benefit[]>(`/benefits?application_id=${id}`);
    },
    enabled: !!id && (app?.status === 'APPROVED' || app?.status === 'DISBURSED'),
  });

  const linkedBenefit = benefits.length > 0 ? benefits[0] : null;

  // Mutation: Run Assessment
  const assessMutation = useMutation({
    mutationFn: async () => {
      return await api.post<EligibilityAssessment>(`/applications/${id}/assess`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application', id] });
      queryClient.invalidateQueries({ queryKey: ['application-assessment', id] });
      setActionSuccess('Deterministic eligibility assessment completed successfully.');
      setActionError('');
    },
    onError: (err: any) => {
      setActionError(err.message || 'Assessment evaluation failed');
    },
  });

  // Mutation: Approve Application & Create Benefit
  const approveMutation = useMutation({
    mutationFn: async () => {
      return await api.post<Benefit>(`/applications/${id}/approve`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application', id] });
      queryClient.invalidateQueries({ queryKey: ['application-benefit', id] });
      queryClient.invalidateQueries({ queryKey: ['benefits'] });
      setActionSuccess('Application approved and benefit created in the ledger.');
      setActionError('');
    },
    onError: (err: any) => {
      setActionError(err.message || 'Approval failed');
    },
  });

  // Mutation: Disburse Benefit
  const disburseMutation = useMutation({
    mutationFn: async (benefitId: string) => {
      return await api.post<Benefit>(`/benefits/${benefitId}/disburse`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application', id] });
      queryClient.invalidateQueries({ queryKey: ['application-benefit', id] });
      queryClient.invalidateQueries({ queryKey: ['benefits'] });
      setActionSuccess('Benefit successfully disbursed to target unit.');
      setActionError('');
    },
    onError: (err: any) => {
      setActionError(err.message || 'Disbursement failed');
    },
  });

  if (appLoading) {
    return <div className="p-8 text-center text-slate-400">{t('common.loading')}</div>;
  }

  if (!app) {
    return (
      <div className="p-8 text-center text-slate-600">
        Application not found.{' '}
        <Link to="/applications" className="text-blue-600 underline">
          Back to list
        </Link>
      </div>
    );
  }

  const getScopeBadge = (scope?: SchemeScope | null) => {
    switch (scope) {
      case 'INDIVIDUAL':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <User className="w-3.5 h-3.5 mr-1" />
            {t('v3.scopeIndividual')}
          </span>
        );
      case 'HOUSEHOLD':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Home className="w-3.5 h-3.5 mr-1" />
            {t('v3.scopeHousehold')}
          </span>
        );
      case 'PROPERTY':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <MapPin className="w-3.5 h-3.5 mr-1" />
            {t('v3.scopeProperty')}
          </span>
        );
      default:
        return null;
    }
  };

  // Timeline steps
  const timelineStages = [
    { key: 'SUBMITTED', label: 'Application Submitted', date: app.submitted_at || app.created_at },
    {
      key: 'ASSESSED',
      label: 'Eligibility Evaluated',
      date: assessment?.evaluated_at,
    },
    {
      key: 'VERIFIED',
      label: 'Under Verification',
      date: app.status !== 'DRAFT' && app.status !== 'SUBMITTED' ? app.updated_at : null,
    },
    {
      key: 'APPROVED',
      label: 'Benefit Approved',
      date: linkedBenefit?.approved_at,
    },
    {
      key: 'DISBURSED',
      label: 'Benefit Disbursed',
      date: linkedBenefit?.disbursed_at,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back link */}
      <Link
        to="/applications"
        className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" />
        Back to Applications Ledger
      </Link>

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="font-mono text-xs font-bold text-slate-400">
                {app.public_id}
              </span>
              {getScopeBadge(app.scheme_scope)}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {app.status}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Application #{app.application_number}
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-600">
              Scheme: <strong>{app.scheme_name || app.scheme_code}</strong>
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 pt-4 border-t border-slate-100">
              <div>
                <span className="text-slate-400 block mb-0.5">Primary Applicant:</span>
                <span className="font-semibold text-slate-900">
                  {app.applicant_name || app.applicant_person_id}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Benefit Target Unit:</span>
                <span className="font-semibold text-slate-900">
                  {app.target_label || (app.scheme_scope === 'INDIVIDUAL' ? 'Person' : 'Household / Property')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Application Date:</span>
                <span className="font-mono font-semibold text-slate-900">
                  {app.application_date}
                </span>
              </div>
            </div>
          </div>

          {/* Administrative Action Buttons */}
          {canReview && (
            <div className="flex flex-col gap-2 shrink-0">
              <Link
                to={`/cases/${app.id}/evidence`}
                className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Evidence Workspace (V5)</span>
              </Link>

              {app.status === 'SUBMITTED' && (
                <>
                  <button
                    onClick={() => assessMutation.mutate()}
                    disabled={assessMutation.isPending}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
                  >
                    {assessMutation.isPending ? t('common.loading') : 'Run Deterministic Assessment'}
                  </button>
                  <button
                    onClick={() => approveMutation.mutate()}
                    disabled={approveMutation.isPending}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
                  >
                    {approveMutation.isPending ? t('common.loading') : 'Approve & Issue Benefit'}
                  </button>
                </>
              )}

              {app.status === 'APPROVED' && linkedBenefit && !linkedBenefit.disbursed_at && (
                <button
                  onClick={() => disburseMutation.mutate(linkedBenefit.id)}
                  disabled={disburseMutation.isPending}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
                >
                  {disburseMutation.isPending ? t('common.loading') : 'Disburse Benefit Asset'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {actionSuccess && (
        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Grid: Timeline and Assessment */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Deterministic Assessment & Linked Benefit */}
        <div className="lg:col-span-2 space-y-8">
          {/* Eligibility Assessment Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center">
                  <ShieldCheck className="w-5 h-5 mr-2 text-blue-600" />
                  {t('v3.eligibility')}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Audit-ready rule verification without black-box inference
                </p>
              </div>

              {assessment && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    assessment.result === 'ELIGIBLE'
                      ? 'bg-emerald-100 text-emerald-800'
                      : assessment.result === 'INELIGIBLE'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {assessment.result}
                </span>
              )}
            </div>

            {!assessment ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No formal eligibility assessment evaluated yet.{' '}
                {canReview && (
                  <button
                    onClick={() => assessMutation.mutate()}
                    className="text-blue-600 font-semibold underline ml-1"
                  >
                    Evaluate now
                  </button>
                )}
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="font-semibold text-slate-800">Summary:</div>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">{assessment.summary}</p>
                  <div className="mt-2 text-[10px] font-mono text-slate-400">
                    Engine Version: {assessment.engine_version} • Evaluated:{' '}
                    {new Date(assessment.evaluated_at).toLocaleString()}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Evaluated Rules:
                  </h4>
                  {assessment.rule_results?.map((r) => (
                    <div
                      key={r.id}
                      className="p-3 bg-white border border-slate-200 rounded-xl flex items-start justify-between gap-4 text-xs"
                    >
                      <div className="flex items-start space-x-2">
                        <span
                          className={`mt-0.5 font-bold ${
                            r.result === 'PASS'
                              ? 'text-emerald-600'
                              : r.result === 'FAIL'
                              ? 'text-red-600'
                              : 'text-amber-600'
                          }`}
                        >
                          {r.result === 'PASS' ? '✓' : r.result === 'FAIL' ? '✗' : '?'}
                        </span>
                        <div>
                          <div className="font-semibold text-slate-900">
                            {r.rule_type}{' '}
                            <span className="text-[11px] font-mono font-normal text-slate-500">
                              (Expected: {r.expected_value} • Observed: {r.actual_value || 'None'})
                            </span>
                          </div>
                          <div className="text-slate-600 text-[11px] mt-0.5">
                            {r.explanation}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                          r.result === 'PASS'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : r.result === 'FAIL'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {r.result}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Linked Benefit Card (If Approved/Disbursed) */}
          {linkedBenefit && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-emerald-600" />
                  Granted Benefit Record
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {linkedBenefit.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Benefit Public ID:</span>
                  <span className="font-mono font-semibold">{linkedBenefit.public_id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Benefit Scope:</span>
                  <span className="font-semibold">{linkedBenefit.benefit_unit_type}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Granted Value / Asset:</span>
                  <span className="font-semibold text-slate-900">
                    {linkedBenefit.amount
                      ? `₹${linkedBenefit.amount.toLocaleString('en-IN')}`
                      : `${linkedBenefit.quantity || 1} ${linkedBenefit.unit || 'Unit'} (${linkedBenefit.description || 'Asset'})`}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Disbursed Date:</span>
                  <span className="font-mono">
                    {linkedBenefit.disbursed_at
                      ? new Date(linkedBenefit.disbursed_at).toLocaleDateString()
                      : 'Pending Disbursement'}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <Link
                  to="/benefits"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center"
                >
                  View in Benefit Intelligence Ledger →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Lifecycle Timeline */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-slate-500" />
              {t('v3.timeline')}
            </h3>

            <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 py-2">
              {timelineStages.map((st) => (
                <div key={st.key} className="relative pl-6">
                  <div
                    className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 bg-white ${
                      st.date ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'
                    }`}
                  />
                  <div>
                    <h4
                      className={`text-xs font-semibold ${
                        st.date ? 'text-slate-900' : 'text-slate-400'
                      }`}
                    >
                      {st.label}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-500">
                      {st.date ? new Date(st.date).toLocaleDateString() : 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
