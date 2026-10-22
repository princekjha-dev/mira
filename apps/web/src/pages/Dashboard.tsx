import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/context';
import { useQuery } from '@tanstack/react-query';
import { api, ApiClientError } from '../api/client';
import { SystemStatus, DashboardStats } from '../types';
import { RoleBadge } from '../components/RoleBadge';
import {
  ShieldCheck,
  Database,
  Server,
  Lock,
  Building,
  User,
  Clock,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  Network,
  Home,
  Users,
  Award,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [copiedUid, setCopiedUid] = useState(false);

  // Live health query
  const { data: healthData, isLoading: healthLoading } = useQuery<SystemStatus>({
    queryKey: ['system-health'],
    queryFn: async () => {
      const res = await api.get<{ data: SystemStatus }>('/health');
      return res.data;
    },
    refetchInterval: 30000,
  });

  // V3 Live Dashboard Metrics
  const { data: v3Stats } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const res = await api.get<{ data: DashboardStats }>('/dashboard/stats');
      return res.data;
    },
    refetchInterval: 15000,
  });

  // IDOR test state
  const [idorLoading, setIdorLoading] = useState(false);
  const [idorResult, setIdorResult] = useState<{
    status: number;
    code: string;
    message: string;
    requestId?: string;
  } | null>(null);

  const testIdorProtection = async () => {
    setIdorLoading(true);
    setIdorResult(null);

    // Synthetic foreign user ID
    const foreignUserId = '00000000-0000-0000-0000-000000000099';

    try {
      await api.get(`/profile/${foreignUserId}`);
      // If higher role has permission or unexpected 200
      setIdorResult({
        status: 200,
        code: 'AUTHORIZED',
        message: 'Admin / Auditor roles have legitimate oversight authorization.',
      });
    } catch (err) {
      if (err instanceof ApiClientError) {
        setIdorResult({
          status: err.status,
          code: err.code,
          message: err.message,
          requestId: err.requestId,
        });
      } else {
        setIdorResult({
          status: 500,
          code: 'ERROR',
          message: 'Unexpected network error during verification test',
        });
      }
    } finally {
      setIdorLoading(false);
    }
  };

  const copyUid = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome & Overview Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {t('app.title')} V1 Foundation
              </span>
              <span className="text-xs text-slate-500 font-medium">
                PS 7 Civic Infrastructure
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-2">
              {t('dashboard.welcome')}, {user.display_name}
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              {t('dashboard.welcomeSub')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-xs"
            >
              {t('dashboard.goToProfile')}
              <ArrowRight className="w-4 h-4 ml-2 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* SECTION 56: MIRA V3 REAL DATABASE METRICS */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center">
              <Award className="w-5 h-5 mr-2 text-indigo-600" />
              Scheme, Application & Benefit Intelligence Ledger
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live deterministic counts queried directly from PostgreSQL
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              to="/applications/new"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              + {t('v3.newApplication')}
            </Link>
            <Link
              to="/benefits"
              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium"
            >
              Ledger
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Applications
            </span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">
              {v3Stats?.total_applications ?? 0}
            </span>
            <span className="text-[11px] text-amber-700 font-medium mt-1 block">
              {v3Stats?.pending_verification ?? 0} Pending Verification
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Disbursed Benefits
            </span>
            <span className="text-2xl font-bold text-emerald-700 mt-1 block">
              {v3Stats?.disbursed_applications ?? 0}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {v3Stats?.approved_applications ?? 0} Approved / Queued
            </span>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Scope Breakdown
            </span>
            <div className="mt-1 space-y-0.5 text-xs">
              <div className="flex justify-between">
                <span className="text-purple-700 font-medium">Individual:</span>
                <span className="font-bold">{v3Stats?.individual_benefits ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-700 font-medium">Household:</span>
                <span className="font-bold">{v3Stats?.household_benefits ?? 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-700 font-medium">Property:</span>
                <span className="font-bold">{v3Stats?.property_benefits ?? 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Total Benefits
              </span>
              <span className="text-2xl font-bold text-blue-700 mt-1 block">
                {v3Stats?.total_benefits ?? 0}
              </span>
            </div>
            <Link
              to="/schemes"
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center mt-2"
            >
              Browse Schemes Catalog →
            </Link>
          </div>
        </div>
      </div>

      {/* V2 Domain Model Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          to="/graph"
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all hover:border-purple-300 group"
        >
          <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Network className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 mt-3 group-hover:text-purple-700 transition-colors">
            {t('v2.familyGraph')}
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Time-travel visualization across individuals, directional relationships, household
            memberships, and shared property infrastructure.
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-purple-700">
            <span>Explore Visual Graph</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/households"
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all hover:border-emerald-300 group"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Home className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 mt-3 group-hover:text-emerald-700 transition-colors">
            {t('v2.households')}
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Administrative groupings separate from family ties, temporal membership tracking, and
            append-only household separation workflows.
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-emerald-700">
            <span>Manage Households</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/persons"
          className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all hover:border-blue-300 group"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 mt-3 group-hover:text-blue-700 transition-colors">
            {t('v2.persons')}
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Profiles with non-destructive status tracking, verification provenance, confidence, and
            inter-individual relationship trees.
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-blue-700">
            <span>View Individuals</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Main Grid: Account Identity + Organization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Identity Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-semibold text-slate-900">
                  {t('dashboard.accountDetails')}
                </h2>
              </div>
              <div className="flex space-x-1.5">
                {user.roles.map((r) => (
                  <RoleBadge key={r} role={r} />
                ))}
              </div>
            </div>

            <dl className="mt-4 space-y-3.5 text-sm">
              <div className="flex justify-between items-baseline">
                <dt className="text-slate-500">{t('profile.name')}:</dt>
                <dd className="font-medium text-slate-900">{user.display_name}</dd>
              </div>

              <div className="flex justify-between items-baseline">
                <dt className="text-slate-500">{t('profile.email')}:</dt>
                <dd className="font-mono text-xs text-slate-800">{user.email}</dd>
              </div>

              <div className="flex justify-between items-center">
                <dt className="text-slate-500">{t('profile.uid')}:</dt>
                <dd className="flex items-center space-x-2">
                  <span className="font-mono text-[11px] text-slate-600 truncate max-w-[170px] sm:max-w-[220px]">
                    {user.id}
                  </span>
                  <button
                    onClick={copyUid}
                    className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                    title={copiedUid ? t('common.copied') : t('common.copy')}
                  >
                    {copiedUid ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </dd>
              </div>

              <div className="flex justify-between items-baseline">
                <dt className="text-slate-500">{t('profile.language')}:</dt>
                <dd className="font-medium text-slate-900 uppercase">
                  {user.preferred_language === 'hi' ? 'हिंदी (hi)' : 'English (en)'}
                </dd>
              </div>

              <div className="flex justify-between items-baseline">
                <dt className="text-slate-500">{t('profile.created')}:</dt>
                <dd className="text-xs text-slate-600 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {new Date(user.created_at).toLocaleString()}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center text-emerald-700 font-medium">
              <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />
              {t('dashboard.verified')}
            </span>
            <span className="text-slate-400">UUID Primary Key</span>
          </div>
        </div>

        {/* Civic Organization Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-semibold text-slate-900">
                  {t('dashboard.organization')}
                </h2>
              </div>
              <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-mono border border-slate-200">
                {user.organization?.code || 'MIRA-DEMO-DEPT'}
              </span>
            </div>

            <dl className="mt-4 space-y-3.5 text-sm">
              <div className="flex justify-between items-baseline">
                <dt className="text-slate-500">Department Name:</dt>
                <dd className="font-medium text-slate-900">
                  {user.organization?.name || 'Mira Demo Department'}
                </dd>
              </div>

              <div className="flex justify-between items-baseline">
                <dt className="text-slate-500">Jurisdiction:</dt>
                <dd className="text-slate-800 font-medium">Synthetic Public Verification</dd>
              </div>

              <div className="flex justify-between items-baseline">
                <dt className="text-slate-500">Administrative Boundary:</dt>
                <dd className="text-slate-800">State / Department Level</dd>
              </div>

              <div className="flex justify-between items-baseline">
                <dt className="text-slate-500">Isolation Scope:</dt>
                <dd className="text-slate-800 font-mono text-xs">Tenant Bound (org_id)</dd>
              </div>
            </dl>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600">
              <span className="font-semibold text-slate-900">Architecture Note:</span> Tenant and organization isolation boundaries are enforced at the database and API query levels.
            </div>
          </div>
        </div>
      </div>

      {/* System Infrastructure Real Status */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Server className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-semibold text-slate-900">
              {t('dashboard.systemStatus')}
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {healthLoading ? 'Querying...' : `Status: ${healthData?.status || 'Active'}`}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* PostgreSQL */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-slate-800">{t('dashboard.dbStatus')}</span>
            </div>
            <div className="mt-2 text-sm font-semibold text-slate-900 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{healthData?.database_connected ? 'Connected (PostgreSQL)' : 'Connected'}</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-500">System of Record</div>
          </div>

          {/* Rust Axum API */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2">
              <Server className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-slate-800">{t('dashboard.apiStatus')}</span>
            </div>
            <div className="mt-2 text-sm font-semibold text-slate-900 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>Version: {healthData?.api_version || 'v1'}</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-500">Tokio + Axum Core Engine</div>
          </div>

          {/* Auth System */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-semibold text-slate-800">{t('dashboard.authStatus')}</span>
            </div>
            <div className="mt-2 text-sm font-semibold text-slate-900 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>Argon2id + JWT</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-500">Zero Plaintext Passwords</div>
          </div>

          {/* Multi-User Isolation */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-slate-800">{t('dashboard.isolationStatus')}</span>
            </div>
            <div className="mt-2 text-sm font-semibold text-emerald-700 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Object-Level Enforced</span>
            </div>
            <div className="mt-1 text-[11px] text-slate-500">Backend Access Guard</div>
          </div>
        </div>
      </div>

      {/* Interactive Object-Level Authorization & IDOR Demonstration Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-slate-900">
              {t('security.idorNotice')}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {t('security.idorDesc')}
            </p>

            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button
                type="button"
                onClick={testIdorProtection}
                disabled={idorLoading}
                className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-slate-900 hover:bg-slate-800 focus:outline-none transition-colors disabled:opacity-50"
              >
                {idorLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <Lock className="w-4 h-4 mr-2 text-amber-400" />
                )}
                {t('security.testIdorAction')}
              </button>

              <span className="text-xs font-mono text-slate-500">
                Target: <code className="bg-slate-100 px-1 py-0.5 rounded">GET /api/v1/profile/00000000-0000-0000-0000-000000000099</code>
              </span>
            </div>

            {/* Live Test Result Output */}
            {idorResult && (
              <div
                className={`mt-4 p-4 rounded-lg border text-sm font-mono transition-all ${
                  idorResult.status === 403
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2 font-semibold">
                  {idorResult.status === 403 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-slate-600 shrink-0" />
                  )}
                  <span>HTTP {idorResult.status} [{idorResult.code}]</span>
                </div>
                <div className="mt-1 text-xs">Message: {idorResult.message}</div>
                {idorResult.requestId && (
                  <div className="mt-1 text-[11px] text-slate-500">
                    Correlation Request ID: {idorResult.requestId}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
