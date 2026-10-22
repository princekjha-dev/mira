import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { Scheme, SchemeScope } from '../types';
import { useTranslation } from '../i18n/context';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Plus,
  Filter,
  Layers,
  Building,
  User,
  Home,
  MapPin,
  ArrowRight,
} from 'lucide-react';

export const SchemesListPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [scopeFilter, setScopeFilter] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');
  const [scope, setScope] = useState<SchemeScope>('INDIVIDUAL');
  const [formError, setFormError] = useState('');

  const canManageSchemes = user?.roles.some((r) =>
    ['DEPARTMENT_ADMIN', 'SUPER_ADMIN'].includes(r)
  );

  const { data: schemes = [], isLoading, error } = useQuery<Scheme[]>({
    queryKey: ['schemes', scopeFilter],
    queryFn: async () => {
      const url = scopeFilter === 'ALL' ? '/schemes' : `/schemes?scope=${scopeFilter}`;
      return await api.get<Scheme[]>(url);
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      return await api.post<Scheme>('/schemes', {
        code,
        name,
        description,
        department,
        scope,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schemes'] });
      setShowCreateModal(false);
      setName('');
      setCode('');
      setDescription('');
      setDepartment('');
      setFormError('');
    },
    onError: (err: any) => {
      setFormError(err.message || 'Failed to create scheme');
    },
  });

  const handleCreateScheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code || !department) {
      setFormError('Please fill in all required fields');
      return;
    }
    createMutation.mutate();
  };

  const getScopeBadge = (s: SchemeScope) => {
    switch (s) {
      case 'INDIVIDUAL':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <User className="w-3 h-3 mr-1" />
            {t('v3.scopeIndividual')}
          </span>
        );
      case 'HOUSEHOLD':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Home className="w-3 h-3 mr-1" />
            {t('v3.scopeHousehold')}
          </span>
        );
      case 'PROPERTY':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <MapPin className="w-3 h-3 mr-1" />
            {t('v3.scopeProperty')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Layers className="w-3 h-3 mr-1" />
            {s}
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
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {t('v3.schemes')}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Deterministic scheme definitions, scopes (Individual / Household / Property), and rule constraints
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {canManageSchemes && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('v3.newScheme')}
            </button>
          )}
          <Link
            to="/applications/new"
            className="inline-flex items-center px-4 py-2 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 shadow-sm transition-colors"
          >
            {t('v3.newApplication')}
            <ArrowRight className="w-4 h-4 ml-2 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* Scope Filter Tabs */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2 flex items-center">
          <Filter className="w-3.5 h-3.5 mr-1" /> {t('v3.scope')}:
        </span>
        {['ALL', 'INDIVIDUAL', 'HOUSEHOLD', 'PROPERTY'].map((s) => (
          <button
            key={s}
            onClick={() => setScopeFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              scopeFilter === s
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {s === 'ALL' ? 'All Scopes' : t(`v3.scope${s.charAt(0) + s.slice(1).toLowerCase()}`)}
          </button>
        ))}
      </div>

      {/* Grid of Schemes */}
      {isLoading ? (
        <div className="py-16 text-center text-slate-400 text-sm">{t('common.loading')}</div>
      ) : error ? (
        <div className="py-12 text-center text-red-600 text-sm">Failed to load schemes</div>
      ) : schemes.length === 0 ? (
        <div className="mt-8 bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
          No schemes found for the selected scope.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-2 mb-3">
                  {getScopeBadge(scheme.scope)}
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                    {scheme.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600">
                  {scheme.name}
                </h3>
                <div className="text-xs font-mono text-slate-400 mt-0.5">
                  {scheme.code} • {scheme.public_id}
                </div>

                <p className="mt-3 text-sm text-slate-600 line-clamp-3">
                  {scheme.description}
                </p>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs text-slate-500">
                  <Building className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                  <span className="truncate">{scheme.department}</span>
                </div>
              </div>

              <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/schemes/${scheme.id}`}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center"
                >
                  Configure Rules & View Details
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
                <Link
                  to={`/applications/new?scheme=${scheme.id}`}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Apply
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Scheme Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">{t('v3.newScheme')}</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateScheme} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Scheme Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Higher Secondary Scholarship"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Scheme Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="SCH_SCHOLARSHIP_2025"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Benefit Scope *
                  </label>
                  <select
                    value={scope}
                    onChange={(e) => setScope(e.target.value as SchemeScope)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="INDIVIDUAL">Individual (Person)</option>
                    <option value="HOUSEHOLD">Household (Family Unit)</option>
                    <option value="PROPERTY">Property (Dwelling/Asset)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Department / Authority *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ministry of Education"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide scope, rationale, and eligibility criteria overview..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium shadow-xs disabled:opacity-50"
                >
                  {createMutation.isPending ? t('common.loading') : 'Create Scheme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
