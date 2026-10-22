import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/context';
import { ApiClientError } from '../api/client';
import { Shield, KeyRound, ArrowRight, UserCheck, AlertCircle } from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const DEMO_PASSWORD = 'MiraDemo@2026!';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const demoAccounts = [
    { roleKey: 'auth.roleCitizen', email: 'citizen@mira.local', role: 'CITIZEN' },
    { roleKey: 'auth.roleOfficer', email: 'officer@mira.local', role: 'FIELD_OFFICIAL' },
    { roleKey: 'auth.roleVerifier', email: 'verifier@mira.local', role: 'VERIFICATION_OFFICER' },
    { roleKey: 'auth.roleAdmin', email: 'admin@mira.local', role: 'DEPARTMENT_ADMIN' },
    { roleKey: 'auth.roleAuditor', email: 'auditor@mira.local', role: 'AUDITOR' },
  ];

  const fillDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword(DEMO_PASSWORD);
    setError(null);
    setValidationErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setValidationErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Failed to authenticate. Please check your credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
            <Shield className="w-7 h-7 text-white" />
          </div>
        </div>
        <h1 className="mt-4 text-center text-2xl font-bold tracking-tight text-slate-900">
          {t('auth.loginTitle')}
        </h1>
        <p className="mt-1 text-center text-sm text-slate-600">
          {t('auth.loginSubtitle')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-xl sm:px-10">
          {error && (
            <div
              className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2.5 text-sm text-red-700"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                {t('auth.email')}
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.emailPlaceholder')}
                  autoComplete="email"
                  className={`block w-full px-3 py-2 border rounded-lg text-sm shadow-xs transition-colors ${
                    validationErrors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
                  }`}
                  aria-invalid={!!validationErrors.email}
                  aria-describedby={validationErrors.email ? 'email-error' : undefined}
                />
                {validationErrors.email && (
                  <p id="email-error" className="mt-1 text-xs text-red-600 font-medium">
                    {validationErrors.email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                {t('auth.password')}
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.passwordPlaceholder')}
                  autoComplete="current-password"
                  className={`block w-full px-3 py-2 border rounded-lg text-sm shadow-xs transition-colors ${
                    validationErrors.password
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
                  }`}
                  aria-invalid={!!validationErrors.password}
                  aria-describedby={validationErrors.password ? 'password-error' : undefined}
                />
                {validationErrors.password && (
                  <p id="password-error" className="mt-1 text-xs text-red-600 font-medium">
                    {validationErrors.password}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {t('auth.loginAction')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Switcher Section */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center space-x-2 mb-2">
              <UserCheck className="w-4 h-4 text-slate-500" />
              <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                {t('auth.demoAccountsTitle')}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              {t('auth.demoAccountsHint')} Password is <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono text-[11px]">{DEMO_PASSWORD}</code>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => fillDemoAccount(account.email)}
                  className="flex items-center justify-between px-2.5 py-1.5 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 rounded-lg text-left transition-colors"
                >
                  <div>
                    <div className="text-xs font-medium text-slate-800">{t(account.roleKey)}</div>
                    <div className="text-[10px] text-slate-500 font-mono truncate max-w-[130px]">{account.email}</div>
                  </div>
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
              {t('auth.needAccount')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
