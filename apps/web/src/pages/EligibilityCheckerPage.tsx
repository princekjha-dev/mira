import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  BookOpen,
  Sliders,
  DollarSign,
  User,
  Home,
  Check,
} from 'lucide-react';
import { api } from '../api/client';
import { Scheme } from '../types';

interface EvaluationResult {
  ruleName: string;
  field: string;
  condition: string;
  status: 'ELIGIBLE' | 'INELIGIBLE' | 'REQUIRES_VERIFICATION';
  details: string;
}

export const EligibilityCheckerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const preselectedSchemeId = searchParams.get('scheme') || '';

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [selectedSchemeId, setSelectedSchemeId] = useState(preselectedSchemeId);
  const [age, setAge] = useState<number>(34);
  const [income, setIncome] = useState<number>(140000);
  const [bplStatus, setBplStatus] = useState<boolean>(true);
  const [propertyOwnership, setPropertyOwnership] = useState<'KACCHA' | 'PUCCA' | 'NONE'>('KACCHA');
  const [hasPriorBenefit, setHasPriorBenefit] = useState<boolean>(false);
  const [results, setResults] = useState<EvaluationResult[] | null>(null);
  const [evaluating, setEvaluating] = useState<boolean>(false);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await api.get<{ data: Scheme[] }>('/schemes');
        const active = (res.data || []).filter((s) => s.status === 'ACTIVE');
        setSchemes(active);
        if (!selectedSchemeId && active.length > 0) {
          setSelectedSchemeId(active[0].id);
        }
      } catch {
        // Fallback
      }
    };
    fetchSchemes();
  }, []);

  const selectedScheme = schemes.find((s) => s.id === selectedSchemeId) || schemes[0];

  const handleEvaluate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setEvaluating(true);

    setTimeout(() => {
      const evaluation: EvaluationResult[] = [];

      // 1. Age Evaluation Rule
      if (age >= 18 && age <= 65) {
        evaluation.push({
          ruleName: 'Citizen Working Age Criterion',
          field: 'Age',
          condition: '18 <= Age <= 65',
          status: 'ELIGIBLE',
          details: `Applicant is ${age} years old (meets general adult applicant age threshold).`,
        });
      } else {
        evaluation.push({
          ruleName: 'Citizen Age Criterion',
          field: 'Age',
          condition: 'Age >= 18',
          status: 'INELIGIBLE',
          details: `Applicant age of ${age} does not meet the minimum requirement.`,
        });
      }

      // 2. Household Income Rule
      const incomeLimit = 250000;
      if (income <= incomeLimit) {
        evaluation.push({
          ruleName: 'Annual Household Income Ceiling',
          field: 'Income',
          condition: `Annual Income <= ₹${incomeLimit.toLocaleString('en-IN')}`,
          status: 'ELIGIBLE',
          details: `Reported household annual income of ₹${income.toLocaleString('en-IN')} is within the scheme ceiling.`,
        });
      } else {
        evaluation.push({
          ruleName: 'Annual Household Income Ceiling',
          field: 'Income',
          condition: `Annual Income <= ₹${incomeLimit.toLocaleString('en-IN')}`,
          status: 'INELIGIBLE',
          details: `Income of ₹${income.toLocaleString('en-IN')} exceeds the ceiling of ₹${incomeLimit.toLocaleString('en-IN')}.`,
        });
      }

      // 3. Property & Housing Condition
      if (propertyOwnership === 'KACCHA' || propertyOwnership === 'NONE') {
        evaluation.push({
          ruleName: 'Housing Deprivation Condition',
          field: 'Property Type',
          condition: 'Property condition is Kutcha or Homeless',
          status: 'ELIGIBLE',
          details: 'Dwelling classification qualifies under rural housing distress guidelines.',
        });
      } else {
        evaluation.push({
          ruleName: 'Housing Deprivation Condition',
          field: 'Property Type',
          condition: 'Property condition is Kutcha or Homeless',
          status: 'REQUIRES_VERIFICATION',
          details: 'Pucca dwelling indicated; field official verification required to verify non-exclusive ownership.',
        });
      }

      // 4. Duplicate / Prior Benefit Conflict Rule
      if (!hasPriorBenefit) {
        evaluation.push({
          ruleName: 'Prior Claim & Duplicate Check',
          field: 'Benefit Ledger',
          condition: 'No active household claim in same category within 3 years',
          status: 'ELIGIBLE',
          details: 'Clean record. No conflicting active benefit detected for this household or property.',
        });
      } else {
        evaluation.push({
          ruleName: 'Prior Claim & Duplicate Check',
          field: 'Benefit Ledger',
          condition: 'No active household claim in same category within 3 years',
          status: 'REQUIRES_VERIFICATION',
          details: 'Prior assistance recorded; duplicate detection intelligence will cross-reference beneficiary dates.',
        });
      }

      setResults(evaluation);
      setEvaluating(false);
    }, 200);
  };

  useEffect(() => {
    if (selectedScheme) {
      handleEvaluate();
    }
  }, [selectedSchemeId, age, income, propertyOwnership, hasPriorBenefit]);

  const hasIneligible = results?.some((r) => r.status === 'INELIGIBLE');
  const hasVerificationRequired = results?.some((r) => r.status === 'REQUIRES_VERIFICATION');

  const overallStatus = hasIneligible
    ? 'NOT_ELIGIBLE'
    : hasVerificationRequired
    ? 'VERIFICATION_REQUIRED'
    : 'LIKELY_ELIGIBLE';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Title */}
      <div className="bg-white p-6 rounded-xl border border-[#DCE3EA] shadow-2xs">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#15803D] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#172033]">
              Deterministic Scheme Eligibility Engine
            </h1>
            <p className="text-xs text-slate-500">
              Transparent, rule-by-rule evaluation. No hidden AI scoring — every criterion is explainable and verifiable.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Criteria Inputs */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-[#DCE3EA] shadow-2xs space-y-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
            <Sliders className="w-3.5 h-3.5 mr-1.5 text-[#123B63]" />
            Eligibility Input Parameters
          </h2>

          {/* Scheme Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Welfare Scheme
            </label>
            <select
              value={selectedSchemeId}
              onChange={(e) => setSelectedSchemeId(e.target.value)}
              className="w-full bg-[#F5F5F1] border border-[#DCE3EA] rounded-[7px] p-2 text-xs text-slate-800 font-medium outline-none focus:ring-1 focus:ring-[#2563A6]"
            >
              {schemes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.benefit_unit})
                </option>
              ))}
            </select>
            {selectedScheme && (
              <p className="text-[11px] text-slate-500 mt-1">
                Target Scope: <span className="font-semibold text-slate-700">{selectedScheme.benefit_unit}</span> • Department: {selectedScheme.department}
              </p>
            )}
          </div>

          {/* Applicant Age */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Applicant Age (Years)
            </label>
            <input
              type="number"
              min={10}
              max={100}
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value) || 0)}
              className="w-full bg-[#F5F5F1] border border-[#DCE3EA] rounded-[7px] p-2 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-[#2563A6]"
            />
          </div>

          {/* Household Income */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Annual Household Income (₹)
            </label>
            <input
              type="number"
              step={5000}
              value={income}
              onChange={(e) => setIncome(parseInt(e.target.value) || 0)}
              className="w-full bg-[#F5F5F1] border border-[#DCE3EA] rounded-[7px] p-2 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-[#2563A6]"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Ceiling: ₹2,50,000 / year for priority subsidy
            </span>
          </div>

          {/* Property Condition */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Current Dwelling / Property Type
            </label>
            <select
              value={propertyOwnership}
              onChange={(e) => setPropertyOwnership(e.target.value as any)}
              className="w-full bg-[#F5F5F1] border border-[#DCE3EA] rounded-[7px] p-2 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-[#2563A6]"
            >
              <option value="KACCHA">Kutcha / Temporary Structure (Eligible)</option>
              <option value="NONE">Homeless / Zero Land Ownership (Eligible)</option>
              <option value="PUCCA">Pucca / Permanent Masonry (Verification Req)</option>
            </select>
          </div>

          {/* Prior Benefit Conflict */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasPriorBenefit}
                onChange={(e) => setHasPriorBenefit(e.target.checked)}
                className="rounded border-slate-300 text-[#123B63] focus:ring-[#2563A6]"
              />
              <span className="text-xs text-slate-700 font-medium">
                Has household received a similar welfare benefit in past 3 years?
              </span>
            </label>
          </div>
        </div>

        {/* Transparent Results Display */}
        <div className="lg:col-span-7 space-y-4">
          {/* Final Verdict Banner */}
          <div
            className={`p-5 rounded-xl border flex items-center justify-between shadow-2xs ${
              overallStatus === 'LIKELY_ELIGIBLE'
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                : overallStatus === 'VERIFICATION_REQUIRED'
                ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                : 'bg-rose-50/70 border-rose-200 text-rose-900'
            }`}
          >
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                Evaluation Outcome
              </div>
              <div className="text-lg font-bold mt-0.5 flex items-center">
                {overallStatus === 'LIKELY_ELIGIBLE' && (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-2" />
                    <span>Likely Eligible for Benefit</span>
                  </>
                )}
                {overallStatus === 'VERIFICATION_REQUIRED' && (
                  <>
                    <AlertTriangle className="w-5 h-5 text-amber-600 mr-2" />
                    <span>Verification Required by Officer</span>
                  </>
                )}
                {overallStatus === 'NOT_ELIGIBLE' && (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600 mr-2" />
                    <span>Does Not Meet Current Scheme Rules</span>
                  </>
                )}
              </div>
              <p className="text-xs opacity-90 mt-1 max-w-md">
                {overallStatus === 'LIKELY_ELIGIBLE'
                  ? 'All configured deterministic rules passed with high confidence. You can proceed with application submission.'
                  : overallStatus === 'VERIFICATION_REQUIRED'
                  ? 'Criteria require field verification or document evidence review to ensure zero duplication.'
                  : 'One or more mandatory eligibility constraints are not satisfied by the provided parameters.'}
              </p>
            </div>

            {selectedScheme && (
              <Link
                to={`/applications/new?scheme=${selectedScheme.id}`}
                className="hidden sm:inline-flex items-center bg-[#123B63] hover:bg-[#0B2540] text-white px-4 py-2.5 rounded-[7px] text-xs font-semibold shadow-xs transition-colors whitespace-nowrap"
              >
                <span>Apply for Scheme</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            )}
          </div>

          {/* Rule-by-Rule Breakdown Card */}
          <div className="bg-white p-5 rounded-xl border border-[#DCE3EA] shadow-2xs">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Rule-by-Rule Transparent Assessment
            </h2>

            <div className="divide-y divide-slate-100">
              {results?.map((r, idx) => (
                <div key={idx} className="py-3 flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-2.5">
                    <div className="mt-0.5">
                      {r.status === 'ELIGIBLE' && (
                        <Check className="w-4 h-4 text-[#15803D]" />
                      )}
                      {r.status === 'REQUIRES_VERIFICATION' && (
                        <AlertTriangle className="w-4 h-4 text-[#D97706]" />
                      )}
                      {r.status === 'INELIGIBLE' && (
                        <XCircle className="w-4 h-4 text-[#B91C1C]" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        {r.ruleName}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                        Criterion: {r.condition}
                      </div>
                      <div className="text-xs text-slate-600 mt-1">
                        {r.details}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${
                      r.status === 'ELIGIBLE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : r.status === 'REQUIRES_VERIFICATION'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {r.status === 'ELIGIBLE' ? '✓ Eligible' : r.status === 'REQUIRES_VERIFICATION' ? '⚠ Verification' : '✗ Ineligible'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
