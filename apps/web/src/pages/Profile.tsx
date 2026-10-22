import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation, Language } from '../i18n/context';
import { RoleBadge } from '../components/RoleBadge';
import {
  User,
  Mail,
  Fingerprint,
  Languages,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  Shield,
  Building,
} from 'lucide-react';
import { ApiClientError } from '../api/client';

export const ProfilePage: React.FC = () => {
  const { user, updatePreferences } = useAuth();
  const { t, language, setLanguage } = useTranslation();

  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    (user?.preferred_language as Language) || language
  );
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await updatePreferences({
        display_name: displayName,
        preferred_language: selectedLanguage,
      });
      setLanguage(selectedLanguage);
      setSuccessMessage(t('profile.updateSuccess'));
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(t('common.error'));
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {t('profile.title')}
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          {t('profile.subtitle')}
        </p>
      </div>

      {successMessage && (
        <div
          className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center space-x-2 text-sm text-emerald-800"
          role="status"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div
          className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-sm text-red-800"
          role="alert"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Profile Form & Settings */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100">
        {/* Read-Only Identity Section */}
        <div className="p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-semibold text-slate-900 flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span>Civic Credential Record</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <span className="text-xs text-slate-500 font-medium flex items-center">
                <Mail className="w-3.5 h-3.5 mr-1 text-slate-400" />
                {t('profile.email')}
              </span>
              <div className="mt-1 font-mono text-sm text-slate-900">{user.email}</div>
            </div>

            <div>
              <span className="text-xs text-slate-500 font-medium flex items-center">
                <Fingerprint className="w-3.5 h-3.5 mr-1 text-slate-400" />
                {t('profile.uid')}
              </span>
              <div className="mt-1 font-mono text-xs text-slate-700 truncate">{user.id}</div>
            </div>

            <div>
              <span className="text-xs text-slate-500 font-medium flex items-center">
                <Building className="w-3.5 h-3.5 mr-1 text-slate-400" />
                {t('profile.org')}
              </span>
              <div className="mt-1 text-sm font-medium text-slate-900">
                {user.organization?.name || 'Mira Demo Department'}
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-500 font-medium flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                {t('profile.created')}
              </span>
              <div className="mt-1 text-xs text-slate-700">
                {new Date(user.created_at).toLocaleString()}
              </div>
            </div>

            <div className="sm:col-span-2">
              <span className="text-xs text-slate-500 font-medium">
                {t('profile.role')}
              </span>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {user.roles.map((r) => (
                  <RoleBadge key={r} role={r} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Editable Preferences Section */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-semibold text-slate-900 flex items-center space-x-2">
            <User className="w-5 h-5 text-blue-600" />
            <span>Manage Preferences</span>
          </h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-slate-700">
                {t('profile.name')}
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                className="mt-1 block w-full max-w-md px-3 py-2 border border-slate-300 rounded-lg text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label htmlFor="prefLanguage" className="block text-sm font-medium text-slate-700">
                {t('profile.language')}
              </label>
              <div className="mt-1 flex items-center space-x-3 max-w-md">
                <Languages className="w-5 h-5 text-slate-400 shrink-0" />
                <select
                  id="prefLanguage"
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                  className="block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="en">{t('profile.langEn')}</option>
                  <option value="hi">{t('profile.langHi')}</option>
                </select>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {t('profile.languageHint')}
              </p>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <div className="text-xs text-slate-500 hidden sm:block">
              {t('profile.isolationNotice')}
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
