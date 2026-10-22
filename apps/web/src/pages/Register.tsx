import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/context';
import { ApiClientError } from '../api/client';
import { Shield, ArrowRight, AlertCircle } from 'lucide-react';
import { z } from 'zod';

const registerSchema = z.object({
  display_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  preferred_language: z.enum(['en', 'hi']),
});

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    const result = registerSchema.safeParse({
      display_name: displayName,
      email,
      password,
      preferred_language: language,
    });

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
      await register({
        display_name: displayName,
        email,
        password,
        preferred_language: language,
      });
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Failed to create account. Please try again.');
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
          {t('auth.registerTitle')}
        </h1>
        <p className="mt-1 text-center text-sm text-slate-600">
          {t('auth.registerSubtitle')}
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

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-slate-700">
                {t('auth.displayName')}
              </label>
              <div className="mt-1">
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder={t('auth.displayNamePlaceholder')}
                  className={`block w-full px-3 py-2 border rounded-lg text-sm shadow-xs ${
                    validationErrors.display_name
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
                  }`}
                  aria-invalid={!!validationErrors.display_name}
                />
                {validationErrors.display_name && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{validationErrors.display_name}</p>
                )}
              </div>
            </div>

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
                  className={`block w-full px-3 py-2 border rounded-lg text-sm shadow-xs ${
                    validationErrors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
                  }`}
                  aria-invalid={!!validationErrors.email}
                />
                {validationErrors.email && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{validationErrors.email}</p>
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
                  autoComplete="new-password"
                  className={`block w-full px-3 py-2 border rounded-lg text-sm shadow-xs ${
                    validationErrors.password
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
                  }`}
                  aria-invalid={!!validationErrors.password}
                />
                {validationErrors.password && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{validationErrors.password}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-slate-700">
                {t('auth.preferredLanguage')}
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              >
                <option value="en">English (en)</option>
                <option value="hi">हिंदी - Hindi (hi)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center py-2.5 px-4 mt-2 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {t('auth.registerAction')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              {t('auth.haveAccount')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
