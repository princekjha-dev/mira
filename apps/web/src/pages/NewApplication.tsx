import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import {
  Scheme,
  Person,
  Household,
  Property,
  Application,
  EligibilityAssessment,
} from '../types';
import { useTranslation } from '../i18n/context';
import {
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Send,
} from 'lucide-react';

export const NewApplicationPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  // Wizard step: 1: Scheme, 2: Applicant & Target, 3: Details & Assess, 4: Confirmed
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form selections
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(
    searchParams.get('scheme') || ''
  );
  const [applicantPersonId, setApplicantPersonId] = useState<string>('');
  const [targetPersonId, setTargetPersonId] = useState<string>('');
  const [targetHouseholdId, setTargetHouseholdId] = useState<string>('');
  const [targetPropertyId, setTargetPropertyId] = useState<string>('');
  const [applicationDate, setApplicationDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [incomeAmount, setIncomeAmount] = useState<string>('75000');
  const [notes, setNotes] = useState<string>('Standard application under verified demographic register.');

  const [formError, setFormError] = useState<string>('');
  const [createdApp, setCreatedApp] = useState<Application | null>(null);
  const [assessment, setAssessment] = useState<EligibilityAssessment | null>(null);
  const [isAssessing, setIsAssessing] = useState<boolean>(false);

  // 1. Fetch all active schemes
  const { data: schemes = [] } = useQuery<Scheme[]>({
    queryKey: ['schemes-active'],
    queryFn: async () => {
      return await api.get<Scheme[]>('/schemes');
    },
  });

  // 2. Fetch persons
  const { data: persons = [] } = useQuery<Person[]>({
    queryKey: ['persons-list'],
    queryFn: async () => {
      return await api.get<Person[]>('/persons');
    },
  });

  // 3. Fetch households
  const { data: households = [] } = useQuery<Household[]>({
    queryKey: ['households-list'],
    queryFn: async () => {
      return await api.get<Household[]>('/households');
    },
  });

  // 4. Fetch properties
  const { data: properties = [] } = useQuery<Property[]>({
    queryKey: ['properties-list'],
    queryFn: async () => {
      return await api.get<Property[]>('/properties');
    },
  });

  const selectedScheme = schemes.find((s) => s.id === selectedSchemeId);

  // Auto-set applicant or default target when scheme/applicant changes
  useEffect(() => {
    if (selectedScheme?.scope === 'INDIVIDUAL' && applicantPersonId && !targetPersonId) {
      setTargetPersonId(applicantPersonId);
    }
  }, [selectedScheme, applicantPersonId, targetPersonId]);

  // Step 1 -> 2
  const handleSelectScheme = (schemeId: string) => {
    setSelectedSchemeId(schemeId);
    setFormError('');
    setCurrentStep(2);
  };

  // Step 2 validation & proceed
  const handleProceedToDetails = () => {
    if (!applicantPersonId) {
      setFormError('Please select the primary applicant');
      return;
    }

    if (selectedScheme?.scope === 'INDIVIDUAL' && !targetPersonId) {
      setTargetPersonId(applicantPersonId);
    }
    if (selectedScheme?.scope === 'HOUSEHOLD' && !targetHouseholdId) {
      setFormError('Household scheme requires selecting a target household unit');
      return;
    }
    if (selectedScheme?.scope === 'PROPERTY' && !targetPropertyId) {
      setFormError('Property scheme requires selecting a target property unit');
      return;
    }

    setFormError('');
    setCurrentStep(3);
  };

  // Create Application & Run Assessment
  const handleRunAssessment = async () => {
    setIsAssessing(true);
    setFormError('');

    try {
      // 1. Create Application in DRAFT status
      const payload: Record<string, any> = {
        scheme_id: selectedSchemeId,
        applicant_person_id: applicantPersonId,
        application_date: applicationDate,
        target_person_id: selectedScheme?.scope === 'INDIVIDUAL' ? (targetPersonId || applicantPersonId) : null,
        target_household_id: selectedScheme?.scope === 'HOUSEHOLD' ? targetHouseholdId : null,
        target_property_id: selectedScheme?.scope === 'PROPERTY' ? targetPropertyId : null,
        metadata: {
          declared_annual_income: incomeAmount ? Number(incomeAmount) : null,
          applicant_notes: notes,
        },
      };

      const app = await api.post<Application>('/applications', payload);
      setCreatedApp(app);

      // 2. Assess Eligibility using deterministic rule engine
      const assessResult = await api.post<EligibilityAssessment>(
        `/applications/${app.id}/assess`,
        {}
      );
      setAssessment(assessResult);
    } catch (err: any) {
      setFormError(err.message || 'Failed to evaluate eligibility');
    } finally {
      setIsAssessing(false);
    }
  };

  // Submit Application
  const handleSubmitApplication = async () => {
    if (!createdApp) return;

    try {
      await api.post(`/applications/${createdApp.id}/submit`, {});
      setCurrentStep(4);
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit application');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center space-x-2 text-xs text-slate-500">
        <Link to="/applications" className="hover:text-slate-800">
          Applications
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-800">{t('v3.newApplication')}</span>
      </div>

      {/* Progress Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[
            { num: 1, label: 'Select Scheme' },
            { num: 2, label: 'Applicant & Target Unit' },
            { num: 3, label: 'Deterministic Assessment' },
            { num: 4, label: 'Submitted' },
          ].map((st) => (
            <div key={st.num} className="flex flex-col items-center flex-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  currentStep === st.num
                    ? 'bg-blue-600 text-white shadow-sm ring-4 ring-blue-100'
                    : currentStep > st.num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {currentStep > st.num ? '✓' : st.num}
              </div>
              <span className="text-[11px] font-semibold mt-1.5 text-slate-600 text-center">
                {st.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {formError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* STEP 1: Select Scheme */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 mb-1">Step 1: Choose Scheme</h2>
          <p className="text-xs text-slate-500 mb-6">
            Every scheme specifies a strict benefit scope (Individual, Household, or Property).
          </p>

          <div className="space-y-4">
            {schemes.map((sch) => (
              <div
                key={sch.id}
                onClick={() => handleSelectScheme(sch.id)}
                className={`p-5 rounded-xl border cursor-pointer transition-all ${
                  selectedSchemeId === sch.id
                    ? 'border-blue-500 bg-blue-50/30 ring-2 ring-blue-200'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900">{sch.name}</span>
                      <span className="text-xs font-mono text-slate-400">({sch.code})</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{sch.description}</p>
                    <div className="mt-2 text-[11px] text-slate-400">
                      Department: {sch.department}
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                      sch.scope === 'INDIVIDUAL'
                        ? 'bg-purple-100 text-purple-800'
                        : sch.scope === 'HOUSEHOLD'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {sch.scope}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Applicant & Target Unit */}
      {currentStep === 2 && selectedScheme && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Step 2: Benefit Target</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Scheme: <strong>{selectedScheme.name}</strong> ({selectedScheme.scope} scope)
              </p>
            </div>
            <button
              onClick={() => setCurrentStep(1)}
              className="text-xs text-blue-600 hover:underline"
            >
              Change Scheme
            </button>
          </div>

          <div className="space-y-6">
            {/* Applicant */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                1. Submitting Applicant (Person) *
              </label>
              <select
                value={applicantPersonId}
                onChange={(e) => setApplicantPersonId(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">-- Select Person --</option>
                {persons.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.first_name} {p.last_name} ({p.public_id} - DOB: {p.date_of_birth || 'N/A'})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 mt-1">
                The individual presenting the official civic application.
              </p>
            </div>

            {/* Target Unit based on Scope */}
            {selectedScheme.scope === 'INDIVIDUAL' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  2. Beneficiary Individual (Person) *
                </label>
                <select
                  value={targetPersonId || applicantPersonId}
                  onChange={(e) => setTargetPersonId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">-- Same as Applicant --</option>
                  {persons.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.first_name} {p.last_name} ({p.public_id})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedScheme.scope === 'HOUSEHOLD' && (
              <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl">
                <label className="block text-xs font-semibold text-emerald-900 uppercase tracking-wider mb-2">
                  2. Beneficiary Household Unit *
                </label>
                <select
                  value={targetHouseholdId}
                  onChange={(e) => setTargetHouseholdId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-emerald-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="">-- Select Target Household --</option>
                  {households.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.public_id} - Status: {h.status})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-emerald-700 mt-2">
                  Temporal Rule: Household membership is strictly evaluated as of the application date.
                </p>
              </div>
            )}

            {selectedScheme.scope === 'PROPERTY' && (
              <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-xl">
                <label className="block text-xs font-semibold text-amber-900 uppercase tracking-wider mb-2">
                  2. Beneficiary Property Asset *
                </label>
                <select
                  value={targetPropertyId}
                  onChange={(e) => setTargetPropertyId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-amber-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="">-- Select Target Property --</option>
                  {properties.map((prop) => (
                    <option key={prop.id} value={prop.id}>
                      {prop.public_id} — {prop.property_type} ({prop.address_line}, {prop.district})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-amber-700 mt-2">
                  Asset Association: This benefit will attach directly to this physical property parcel.
                </p>
              </div>
            )}

            {/* Application Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Application Date *
                </label>
                <input
                  type="date"
                  required
                  value={applicationDate}
                  onChange={(e) => setApplicationDate(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Rules (Age, Household size) are evaluated as of this date.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Reported Annual Household Income (₹)
                </label>
                <input
                  type="number"
                  value={incomeAmount}
                  onChange={(e) => setIncomeAmount(e.target.value)}
                  placeholder="e.g. 75000"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Applicant Submission Notes
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional civic notes or declarations..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleProceedToDetails}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Continue to Assessment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: Deterministic Eligibility Assessment */}
      {currentStep === 3 && selectedScheme && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
          <div className="pb-4 border-b border-slate-100 mb-6">
            <h2 className="text-xl font-bold text-slate-900">
              Step 3: {t('v3.eligibility')}
            </h2>
            <p className="text-xs text-blue-700 font-medium mt-0.5 bg-blue-50 p-2.5 rounded-lg border border-blue-100">
              {t('v3.evalNotice')}
            </p>
          </div>

          {!assessment ? (
            <div className="text-center py-12">
              <ShieldCheck className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">
                Ready to Evaluate Application Rules
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
                Mira will deterministically check the applicant's age at application date ({applicationDate}), verified household size as of that date, and residency records.
              </p>
              <button
                type="button"
                disabled={isAssessing}
                onClick={handleRunAssessment}
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all disabled:opacity-50"
              >
                {isAssessing ? t('common.loading') : 'Run Deterministic Assessment'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Overall Assessment Banner */}
              <div
                className={`p-5 rounded-xl border flex items-start space-x-3 ${
                  assessment.result === 'ELIGIBLE'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : assessment.result === 'INELIGIBLE'
                    ? 'bg-red-50 border-red-200 text-red-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                {assessment.result === 'ELIGIBLE' ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-base">
                      Assessment Result: {assessment.result}
                    </span>
                    <span className="text-[10px] font-mono bg-white/60 px-2 py-0.5 rounded border">
                      Engine: {assessment.engine_version}
                    </span>
                  </div>
                  <p className="text-xs mt-1 leading-relaxed">{assessment.summary}</p>
                </div>
              </div>

              {/* Explainable Rule-by-Rule Breakdown */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Rule Evaluation Ledger
                </h4>
                <div className="space-y-2">
                  {assessment.rule_results?.map((r) => (
                    <div
                      key={r.id}
                      className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start justify-between gap-4 text-xs"
                    >
                      <div className="flex items-start space-x-2.5">
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
                          <div className="font-semibold text-slate-900 flex items-center space-x-2">
                            <span>{r.rule_type}</span>
                            <span className="text-[11px] font-mono text-slate-500 font-normal">
                              Expected: {r.expected_value} • Observed: {r.actual_value || 'N/A'}
                            </span>
                          </div>
                          <p className="text-slate-600 mt-1">{r.explanation}</p>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold shrink-0 ${
                          r.result === 'PASS'
                            ? 'bg-emerald-100 text-emerald-800'
                            : r.result === 'FAIL'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.result}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Back to Target Selection
                </button>

                <button
                  type="button"
                  onClick={handleSubmitApplication}
                  className="inline-flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 mr-2" />
                  Confirm & Submit Application
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 4: Application Confirmed */}
      {currentStep === 4 && createdApp && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Application Submitted</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Your application has been logged to the immutable ledger under ID{' '}
            <strong className="font-mono text-slate-800">{createdApp.application_number}</strong>.
          </p>

          <div className="mt-6 max-w-sm mx-auto bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Application Number:</span>
              <span className="font-mono font-semibold">{createdApp.application_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Scheme:</span>
              <span className="font-semibold">{selectedScheme?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Scope:</span>
              <span className="font-semibold">{selectedScheme?.scope}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Current Status:</span>
              <span className="font-semibold text-blue-600">SUBMITTED</span>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-4">
            <Link
              to={`/applications/${createdApp.id}`}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              View Application Timeline & Review
            </Link>
            <Link
              to="/applications"
              className="px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Applications Ledger
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
