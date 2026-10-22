import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { Benefit, SchemeScope, BenefitUnitType } from '../types';
import { useTranslation } from '../i18n/context';
import { useAuth } from '../context/AuthContext';
import {
  Award,
  Filter,
  User,
  Home,
  MapPin,
  Package,
  GitFork,
} from 'lucide-react';

export const BenefitsListPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [scopeFilter, setScopeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const canDisburse = user?.roles.some((r) =>
    ['DEPARTMENT_ADMIN', 'SUPER_ADMIN', 'FIELD_OFFICIAL'].includes(r)
  );

  const { data: benefits = [], isLoading, error } = useQuery<Benefit[]>({
    queryKey: ['benefits', scopeFilter, statusFilter],
    queryFn: async () => {
      let params = new URLSearchParams();
      if (scopeFilter !== 'ALL') params.set('scope', scopeFilter);
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      const q = params.toString();
      return await api.get<Benefit[]>(`/benefits${q ? '?' + q : ''}`);
    },
  });

  const disburseMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.post(`/benefits/${id}/disburse`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['benefits'] });
    },
  });

  const filteredBenefits = benefits.filter((b) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.public_id.toLowerCase().includes(q) ||
      (b.scheme_name && b.scheme_name.toLowerCase().includes(q)) ||
      (b.person_name && b.person_name.toLowerCase().includes(q)) ||
      (b.household_public_id && b.household_public_id.toLowerCase().includes(q)) ||
      (b.property_address && b.property_address.toLowerCase().includes(q))
    );
  });

  const getScopeBadge = (scope?: SchemeScope | BenefitUnitType | null) => {
    switch (scope) {
      case 'INDIVIDUAL':
      case 'PERSON':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <User className="w-3 h-3 mr-1" />
            {t('v3.individualBenefit')}
          </span>
        );
      case 'HOUSEHOLD':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Home className="w-3 h-3 mr-1" />
            {t('v3.householdBenefit')}
          </span>
        );
      case 'PROPERTY':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <MapPin className="w-3 h-3 mr-1" />
            {t('v3.propertyBenefit')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
            {scope}
          </span>
        );
    }
  };

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
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {t('v3.benefits')}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Authoritative register of granted civic entitlements, assets, and benefit units
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/applications"
            className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-semibold rounded-xl text-slate-700 bg-white hover:bg-slate-50 shadow-xs transition-colors"
          >
            Applications Ledger
          </Link>
          <Link
            to="/applications/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-xl shadow-xs text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            {t('v3.newApplication')}
          </Link>
        </div>
      </div>

      {/* SECTION 58: IMPORTANT DEMO VISUAL: BENEFIT RELATIONSHIP FLOW */}
      <div className="mt-6 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white shadow-md">
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/60 mb-6">
          <div className="flex items-center space-x-2">
            <GitFork className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold tracking-wide uppercase text-indigo-300">
              {t('v3.flowDiagram')}
            </h2>
          </div>
          <span className="text-[11px] font-mono bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">
            PS-7 Architecture Core
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          {/* Node 1: Scheme */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              1. Policy Authority
            </span>
            <div className="font-bold text-white text-sm">SCHEME</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Rules & Scope Definition</div>
          </div>

          {/* Node 2: Application */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              2. Civic Claim
            </span>
            <div className="font-bold text-white text-sm">APPLICATION</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Applicant + Eligibility Assessment</div>
          </div>

          {/* Node 3: Benefit Unit (Branching) */}
          <div className="bg-slate-800/80 border border-indigo-500/50 rounded-xl p-3 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block mb-1">
              3. Benefit Unit Target
            </span>
            <div className="flex justify-center gap-1.5 mt-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-900/80 text-purple-200 border border-purple-700">
                Person
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-900/80 text-emerald-200 border border-emerald-700">
                Household
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-900/80 text-amber-200 border border-amber-700">
                Property
              </span>
            </div>
          </div>

          {/* Node 4: Benefit */}
          <div className="bg-slate-800/80 border border-emerald-500/50 rounded-xl p-4 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              4. Entitlement Ledger
            </span>
            <div className="font-bold text-emerald-300 text-sm">BENEFIT LEDGER</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Disbursed Value / Physical Asset</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Scope Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2 flex items-center">
            <Filter className="w-3.5 h-3.5 mr-1" /> {t('v3.scope')}:
          </span>
          {['ALL', 'INDIVIDUAL', 'HOUSEHOLD', 'PROPERTY'].map((s) => (
            <button
              key={s}
              onClick={() => setScopeFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                scopeFilter === s
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s === 'ALL' ? 'All Scopes' : t(`v3.scope${s.charAt(0) + s.slice(1).toLowerCase()}`)}
            </button>
          ))}

          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-2 mr-1">
            Status:
          </span>
          {['ALL', 'APPROVED', 'DISBURSED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {st === 'ALL' ? 'All' : st}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Search by ID, name, household..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3.5 py-1.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Benefits Table */}
      <div className="mt-6 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="py-16 text-center text-slate-400 text-sm">{t('common.loading')}</div>
        ) : error ? (
          <div className="py-12 text-center text-red-600 text-sm">Failed to load benefits ledger</div>
        ) : filteredBenefits.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No benefits recorded under the selected criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">Benefit ID & Scheme</th>
                  <th className="px-6 py-3.5">Benefit Scope & Target</th>
                  <th className="px-6 py-3.5">Granted Value / Asset</th>
                  <th className="px-6 py-3.5">Effective / Disbursed</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredBenefits.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-mono font-semibold text-slate-900">{b.public_id}</div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        {b.scheme_name || b.scheme_code}
                      </div>
                      {b.application_number && (
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          App: {b.application_number}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="mb-1.5">{getScopeBadge(b.benefit_unit_type)}</div>
                      <div className="text-xs font-medium text-slate-900">
                        {b.benefit_unit_type === 'PERSON' && (
                          <span className="flex items-center text-slate-700">
                            <User className="w-3 h-3 mr-1 text-purple-600" />
                            {b.person_name || 'Individual Beneficiary'}
                          </span>
                        )}
                        {b.benefit_unit_type === 'HOUSEHOLD' && (
                          <span className="flex items-center text-slate-700">
                            <Home className="w-3 h-3 mr-1 text-emerald-600" />
                            Household: {b.household_public_id || 'H001'}
                          </span>
                        )}
                        {b.benefit_unit_type === 'PROPERTY' && (
                          <span className="flex items-center text-slate-700">
                            <MapPin className="w-3 h-3 mr-1 text-amber-600" />
                            Property: {b.property_address || 'Registered Parcel'}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {b.amount ? (
                        <div className="font-bold text-slate-900">
                          ₹{b.amount.toLocaleString('en-IN')}
                        </div>
                      ) : (
                        <div className="font-semibold text-slate-900 flex items-center">
                          <Package className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                          <span>
                            {b.quantity || 1} {b.unit || 'Unit'} ({b.description || 'Asset'})
                          </span>
                        </div>
                      )}
                      {b.source_name && (
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Source: {b.source_name}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-xs font-mono text-slate-600">
                      <div>
                        Disbursed:{' '}
                        {b.disbursed_at
                          ? new Date(b.disbursed_at).toLocaleDateString()
                          : 'Pending'}
                      </div>
                      {b.effective_during && (
                        <div className="text-[10px] text-slate-400">
                          Effective: {b.effective_during}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4">{getStatusBadge(b.status)}</td>

                    <td className="px-6 py-4 text-right">
                      {b.status === 'APPROVED' && canDisburse && (
                        <button
                          onClick={() => disburseMutation.mutate(b.id)}
                          disabled={disburseMutation.isPending}
                          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                        >
                          Disburse
                        </button>
                      )}
                      {b.status === 'DISBURSED' && (
                        <span className="text-xs text-slate-400">Completed</span>
                      )}
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
