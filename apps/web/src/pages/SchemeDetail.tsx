import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { Scheme, SchemeRule, SchemeScope } from '../types';
import { useTranslation } from '../i18n/context';
import { useAuth } from '../context/AuthContext';
import {
  Plus,
  Layers,
  Building,
  User,
  Home,
  MapPin,
  ArrowLeft,
  CheckCircle2,
  Scale,
  Clock,
} from 'lucide-react';

export const SchemeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [showAddRule, setShowAddRule] = useState(false);
  const [ruleType, setRuleType] = useState('AGE_MIN');
  const [operator, setOperator] = useState('>=');
  const [value, setValue] = useState('18');
  const [priority, setPriority] = useState(1);
  const [ruleError, setRuleError] = useState('');

  const canManage = user?.roles.some((r) =>
    ['DEPARTMENT_ADMIN', 'SUPER_ADMIN'].includes(r)
  );

  const { data: scheme, isLoading: schemeLoading } = useQuery<Scheme>({
    queryKey: ['scheme', id],
    queryFn: async () => {
      return await api.get<Scheme>(`/schemes/${id}`);
    },
    enabled: !!id,
  });

  const { data: rules = [], isLoading: rulesLoading } = useQuery<SchemeRule[]>({
    queryKey: ['scheme-rules', id],
    queryFn: async () => {
      return await api.get<SchemeRule[]>(`/schemes/${id}/rules`);
    },
    enabled: !!id,
  });

  const addRuleMutation = useMutation({
    mutationFn: async () => {
      return await api.post<SchemeRule>(`/schemes/${id}/rules`, {
        rule_type: ruleType,
        operator,
        value,
        priority: Number(priority),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheme-rules', id] });
      setShowAddRule(false);
      setRuleError('');
      setValue('18');
    },
    onError: (err: any) => {
      setRuleError(err.message || 'Failed to add rule');
    },
  });

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) {
      setRuleError('Rule value is required');
      return;
    }
    addRuleMutation.mutate();
  };

  const getScopeBadge = (s?: SchemeScope) => {
    switch (s) {
      case 'INDIVIDUAL':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <User className="w-3.5 h-3.5 mr-1" />
            {t('v3.scopeIndividual')}
          </span>
        );
      case 'HOUSEHOLD':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Home className="w-3.5 h-3.5 mr-1" />
            {t('v3.scopeHousehold')}
          </span>
        );
      case 'PROPERTY':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <MapPin className="w-3.5 h-3.5 mr-1" />
            {t('v3.scopeProperty')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Layers className="w-3.5 h-3.5 mr-1" />
            {s}
          </span>
        );
    }
  };

  const getRuleExplanation = (rule: SchemeRule) => {
    switch (rule.rule_type) {
      case 'AGE_MIN':
        return `Applicant age must be ${rule.operator} ${rule.value} years as of the application date.`;
      case 'AGE_MAX':
        return `Applicant age must be ${rule.operator} ${rule.value} years as of the application date.`;
      case 'GENDER':
        return `Applicant declared gender must be ${rule.operator} '${rule.value}'.`;
      case 'HOUSEHOLD_SIZE_MIN':
        return `Household active membership size must be ${rule.operator} ${rule.value} on the application date.`;
      case 'HOUSEHOLD_SIZE_MAX':
        return `Household active membership size must be ${rule.operator} ${rule.value} on the application date.`;
      case 'RESIDENCY_REQUIRED':
        return `Verified state or district residency record is mandatory.`;
      case 'PROPERTY_REQUIRED':
        return `A verified dwelling or land parcel association is required for the benefit unit.`;
      case 'INCOME_MAX':
        return `Reported household annual income must be ${rule.operator} ₹${Number(rule.value).toLocaleString('en-IN')}.`;
      default:
        return `${rule.rule_type} ${rule.operator} ${rule.value}`;
    }
  };

  if (schemeLoading) {
    return <div className="p-8 text-center text-slate-400">{t('common.loading')}</div>;
  }

  if (!scheme) {
    return (
      <div className="p-8 text-center text-slate-600">
        Scheme not found.{' '}
        <Link to="/schemes" className="text-blue-600 underline">
          Back to schemes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <Link
        to="/schemes"
        className="inline-flex items-center text-xs font-medium text-slate-500 hover:text-slate-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" />
        Back to Schemes List
      </Link>

      {/* Scheme Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              {getScopeBadge(scheme.scope)}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                {scheme.status}
              </span>
              <span className="text-xs font-mono text-slate-400">
                {scheme.code} • {scheme.public_id}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              {scheme.name}
            </h1>
            <p className="mt-2 text-sm text-slate-600 max-w-3xl leading-relaxed">
              {scheme.description}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center">
                <Building className="w-4 h-4 mr-1 text-slate-400" />
                <strong>Department:</strong>&nbsp;{scheme.department}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1 text-slate-400" />
                <strong>Created:</strong>&nbsp;{new Date(scheme.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="shrink-0 flex flex-col gap-2">
            <Link
              to={`/applications/new?scheme=${scheme.id}`}
              className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-xs transition-colors"
            >
              Apply Under This Scheme
            </Link>
          </div>
        </div>
      </div>

      {/* Rules Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center">
              <Scale className="w-5 h-5 mr-2 text-blue-600" />
              {t('v3.rules')}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Deterministic rule vocabulary evaluated without black-box AI models
            </p>
          </div>

          {canManage && (
            <button
              onClick={() => setShowAddRule(!showAddRule)}
              className="inline-flex items-center px-3 py-1.5 border border-slate-300 text-xs font-semibold rounded-lg text-slate-700 bg-white hover:bg-slate-50 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              {showAddRule ? 'Close Rule Builder' : 'Add Rule'}
            </button>
          )}
        </div>

        {/* Rule Builder Drawer/Form */}
        {showAddRule && (
          <div className="mt-4 bg-blue-50/50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-sm font-bold text-blue-900 mb-2">
              {t('v3.ruleBuilder')}
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Add a deterministic rule constraint. This will be evaluated strictly on applicant date-of-birth, verified household size, and provenance records.
            </p>

            {ruleError && (
              <div className="mb-4 p-2.5 bg-red-100 text-red-800 text-xs rounded-lg">
                {ruleError}
              </div>
            )}

            <form onSubmit={handleAddRule} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rule Constraint Type *
                </label>
                <select
                  value={ruleType}
                  onChange={(e) => {
                    setRuleType(e.target.value);
                    if (e.target.value === 'RESIDENCY_REQUIRED' || e.target.value === 'PROPERTY_REQUIRED') {
                      setOperator('=');
                      setValue('TRUE');
                    }
                  }}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500"
                >
                  <option value="AGE_MIN">AGE_MIN (Applicant Min Age)</option>
                  <option value="AGE_MAX">AGE_MAX (Applicant Max Age)</option>
                  <option value="GENDER">GENDER (Target Gender)</option>
                  <option value="HOUSEHOLD_SIZE_MIN">HOUSEHOLD_SIZE_MIN (Family Size)</option>
                  <option value="HOUSEHOLD_SIZE_MAX">HOUSEHOLD_SIZE_MAX (Family Cap)</option>
                  <option value="RESIDENCY_REQUIRED">RESIDENCY_REQUIRED (Residency Check)</option>
                  <option value="PROPERTY_REQUIRED">PROPERTY_REQUIRED (Dwelling Association)</option>
                  <option value="INCOME_MAX">INCOME_MAX (Annual Income Cap)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Operator *
                </label>
                <select
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500"
                >
                  <option value=">=">&gt;= (Greater or Equal)</option>
                  <option value="<=">&lt;= (Less or Equal)</option>
                  <option value="=">= (Equal)</option>
                  <option value=">">&gt; (Strictly Greater)</option>
                  <option value="<">&lt; (Strictly Less)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Value *
                </label>
                <input
                  type="text"
                  required
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="e.g. 18, 5, TRUE"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Priority
                </label>
                <input
                  type="number"
                  min={1}
                  value={priority}
                  onChange={(e) => setPriority(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-end space-x-2">
                <button
                  type="submit"
                  disabled={addRuleMutation.isPending}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50"
                >
                  {addRuleMutation.isPending ? t('common.loading') : 'Save Rule'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Rules Table */}
        <div className="mt-6 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          {rulesLoading ? (
            <div className="p-8 text-center text-xs text-slate-400">{t('common.loading')}</div>
          ) : rules.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No rules configured for this scheme yet.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3">Priority</th>
                  <th className="px-6 py-3">Rule Constraint</th>
                  <th className="px-6 py-3">Condition</th>
                  <th className="px-6 py-3">Deterministic Explanation</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {rules.map((rule, idx) => (
                  <tr key={rule.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500 font-semibold">
                      #{rule.priority || idx + 1}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 font-mono text-xs">
                      {rule.rule_type}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-blue-700 bg-blue-50/40 rounded px-2">
                      {rule.operator} {rule.value}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 max-w-md">
                      {getRuleExplanation(rule)}
                    </td>
                    <td className="px-6 py-4">
                      {rule.active ? (
                        <span className="inline-flex items-center text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                          Enforced
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">Inactive</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
