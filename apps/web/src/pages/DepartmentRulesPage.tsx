import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Sliders,
  Plus,
  CheckCircle2,
  Clock,
  History,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  GitBranch,
  Edit,
  Trash2,
} from 'lucide-react';
import { api } from '../api/client';
import { Scheme } from '../types';

interface RuleVersion {
  version: string;
  effectiveDate: string;
  createdBy: string;
  changeReason: string;
  rules: {
    field: string;
    operator: string;
    value: string;
  }[];
  verdict: 'ELIGIBLE' | 'REQUIRES_VERIFICATION' | 'INELIGIBLE';
}

export const DepartmentRulesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialScheme = searchParams.get('scheme') || '';

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [selectedSchemeId, setSelectedSchemeId] = useState(initialScheme);
  const [modalOpen, setModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // New rule builder form
  const [incomeLimit, setIncomeLimit] = useState('250000');
  const [propertyCondition, setPropertyCondition] = useState('KUTCHA_OR_NONE');
  const [duplicateCheck, setDuplicateCheck] = useState('NO_ACTIVE_CLAIM_3_YEARS');
  const [effectiveDate, setEffectiveDate] = useState('2026-11-01');
  const [changeReason, setChangeReason] = useState('Annual revision of rural income limits per notification 42-B');

  const [ruleVersions, setRuleVersions] = useState<RuleVersion[]>([
    {
      version: 'v2.1 (Active)',
      effectiveDate: '2026-01-01',
      createdBy: 'Admin / Director of Rural Welfare',
      changeReason: 'Updated annual household income ceiling from ₹2,00,000 to ₹2,50,000 to accommodate inflation.',
      verdict: 'ELIGIBLE',
      rules: [
        { field: 'Household Annual Income', operator: '<=', value: '₹2,50,000' },
        { field: 'Dwelling Classification', operator: 'IN', value: 'Kutcha, Homeless, Temporary' },
        { field: 'Previous Benefit Claim', operator: 'EQUALS', value: 'None in last 3 years' },
      ],
    },
    {
      version: 'v2.0 (Historical)',
      effectiveDate: '2024-04-01',
      createdBy: 'Admin / Principal Secretary',
      changeReason: 'Initial digitized deterministic rule schema for Unified Digital Platform.',
      verdict: 'ELIGIBLE',
      rules: [
        { field: 'Household Annual Income', operator: '<=', value: '₹2,00,000' },
        { field: 'Dwelling Classification', operator: 'IN', value: 'Kutcha' },
        { field: 'Previous Benefit Claim', operator: 'EQUALS', value: 'None' },
      ],
    },
  ]);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await api.get<{ data: Scheme[] }>('/schemes');
        const active = res.data || [];
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

  const handleCreateRuleVersion = (e: React.FormEvent) => {
    e.preventDefault();
    const newVer: RuleVersion = {
      version: `v2.2 (Draft Effective ${effectiveDate})`,
      effectiveDate,
      createdBy: 'Current Administrator',
      changeReason,
      verdict: 'ELIGIBLE',
      rules: [
        { field: 'Household Annual Income', operator: '<=', value: `₹${parseInt(incomeLimit).toLocaleString('en-IN')}` },
        { field: 'Dwelling Classification', operator: 'IN', value: propertyCondition },
        { field: 'Previous Benefit Claim', operator: 'EQUALS', value: duplicateCheck },
      ],
    };

    setRuleVersions([newVer, ...ruleVersions]);
    setSuccessBanner(`Rule Version v2.2 successfully created. Historical past decisions remain strictly reproducible against v2.1 and v2.0.`);
    setModalOpen(false);
  };

  const selectedScheme = schemes.find((s) => s.id === selectedSchemeId) || schemes[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Title */}
      <div className="bg-white p-6 rounded-xl border border-[#DCE3EA] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#123B63] flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#172033]">
              Deterministic Rule Builder & Versioning
            </h1>
            <p className="text-xs text-slate-500">
              Configure deterministic IF/THEN eligibility criteria. Rules are strictly versioned for historical reproducibility.
            </p>
          </div>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-[#123B63] hover:bg-[#0B2540] text-white rounded-[7px] text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>New Rule Version</span>
        </button>
      </div>

      {successBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successBanner}</span>
        </div>
      )}

      {/* Scheme Selector */}
      <div className="bg-white p-4 rounded-xl border border-[#DCE3EA] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-700">Scheme:</span>
          <select
            value={selectedSchemeId}
            onChange={(e) => setSelectedSchemeId(e.target.value)}
            className="bg-[#F5F5F1] border border-[#DCE3EA] rounded-md px-2.5 py-1.5 text-slate-800 font-bold outline-none"
          >
            {schemes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.code})
              </option>
            ))}
          </select>
        </div>
        <div className="text-slate-500">
          Target Scope: <strong className="text-slate-800">{selectedScheme?.benefit_unit || 'HOUSEHOLD'}</strong>
        </div>
      </div>

      {/* Readable Rule Architecture Visualizer */}
      <div className="space-y-4">
        {ruleVersions.map((rv, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-[#DCE3EA] shadow-2xs overflow-hidden"
          >
            {/* Version Meta Bar */}
            <div className="bg-[#F8F8F5] px-6 py-3 border-b border-[#DCE3EA] flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-[#123B63] font-mono text-sm">
                  {rv.version}
                </span>
                <span className="text-slate-500">
                  Effective: <strong className="text-slate-700">{rv.effectiveDate}</strong>
                </span>
                <span className="text-slate-500">
                  Author: <strong className="text-slate-700">{rv.createdBy}</strong>
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Reproducible in Audit Engine
              </span>
            </div>

            {/* Rule Content */}
            <div className="p-6 space-y-4">
              <div className="text-xs text-slate-600 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                <span className="font-semibold text-slate-800">Change Rationale:</span> {rv.changeReason}
              </div>

              {/* IF - THEN Visual Block */}
              <div className="p-4 bg-[#F5F5F1] rounded-xl border border-[#DCE3EA] space-y-2 text-xs font-mono">
                <div className="text-[11px] font-bold text-[#123B63] uppercase tracking-wider">
                  IF (All Conditions Satisfied)
                </div>

                <div className="pl-4 space-y-1.5 text-slate-800">
                  {rv.rules.map((r, rIdx) => (
                    <div key={rIdx} className="flex items-center space-x-2">
                      <span className="text-slate-400 font-bold">{rIdx === 0 ? '  ' : 'AND'}</span>
                      <span className="font-semibold text-slate-900">{r.field}</span>
                      <span className="text-[#2563A6] font-bold">{r.operator}</span>
                      <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-800 font-bold">
                        {r.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-[11px] font-bold text-emerald-700 uppercase tracking-wider border-t border-slate-200">
                  THEN
                </div>
                <div className="pl-4 text-emerald-800 font-bold flex items-center space-x-2">
                  <span>→ Assessed as:</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded font-semibold text-xs">
                    {rv.verdict} FOR WELFARE BENEFIT
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: New Rule Version */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-[#DCE3EA] max-w-lg w-full p-6 animate-in zoom-in-95 duration-150 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE3EA]">
              <h3 className="text-sm font-bold text-slate-900">
                Publish New Scheme Rule Version
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRuleVersion} className="mt-4 space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Annual Household Income Ceiling (₹)
                </label>
                <input
                  type="number"
                  value={incomeLimit}
                  onChange={(e) => setIncomeLimit(e.target.value)}
                  className="w-full bg-[#F5F5F1] border border-[#DCE3EA] rounded-[7px] p-2 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Property Deprivation Requirement
                </label>
                <select
                  value={propertyCondition}
                  onChange={(e) => setPropertyCondition(e.target.value)}
                  className="w-full bg-[#F5F5F1] border border-[#DCE3EA] rounded-[7px] p-2 outline-none"
                >
                  <option value="KUTCHA_OR_NONE">Kutcha or Zero Land Ownership Only</option>
                  <option value="ANY_SUB_100_SQFT">Less than 100 sq ft pucca allowed</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Effective From Date
                </label>
                <input
                  type="date"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  className="w-full bg-[#F5F5F1] border border-[#DCE3EA] rounded-[7px] p-2 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Official Administrative Rationale / Gazetted Reference
                </label>
                <textarea
                  rows={3}
                  value={changeReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                  required
                  placeholder="Cite cabinet resolution or welfare notification number..."
                  className="w-full bg-[#F5F5F1] border border-[#DCE3EA] rounded-[7px] p-2.5 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-2 border border-[#DCE3EA] text-slate-700 rounded-[7px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#123B63] text-white font-semibold rounded-[7px]"
                >
                  Publish Version
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
