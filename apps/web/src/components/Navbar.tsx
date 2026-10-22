import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/context';
import { RoleBadge } from './RoleBadge';
import {
  Shield,
  LayoutDashboard,
  User,
  History,
  LogOut,
  Globe,
  Menu,
  X,
  AlertCircle,
  Network,
  Home,
  Users,
  BookOpen,
  FileText,
  Award,
  Copy,
  Scale,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isAuditorOrAdmin = user?.roles.some((r) =>
    ['AUDITOR', 'DEPARTMENT_ADMIN', 'SUPER_ADMIN'].includes(r)
  );

  const isOfficerOrAdmin = user?.roles.some((r) =>
    ['FIELD_OFFICER', 'VERIFICATION_OFFICER', 'DEPARTMENT_ADMIN', 'SUPER_ADMIN', 'AUDITOR'].includes(r)
  );

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      {/* Synthetic Demo Banner */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center space-x-2">
        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
        <span>{t('app.demoNotice')}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <Link
              to={user ? '/dashboard' : '/login'}
              className="flex items-center space-x-2.5 focus:outline-none"
              aria-label="Mira Home"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  {t('app.title')}
                </span>
                <span className="text-[10px] text-slate-500 font-medium -mt-1 hidden sm:inline">
                  V1 Foundation
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            {user && (
              <nav className="hidden md:flex ml-8 space-x-1" aria-label="Main Navigation">
                <Link
                  to="/dashboard"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-slate-100 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 mr-1.5 text-slate-400" />
                  {t('nav.dashboard')}
                </Link>

                <Link
                  to="/graph"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive('/graph')
                      ? 'bg-slate-100 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Network className="w-4 h-4 mr-1.5 text-blue-600" />
                  {t('nav.graph')}
                </Link>

                <Link
                  to="/households"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive('/households')
                      ? 'bg-slate-100 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Home className="w-4 h-4 mr-1.5 text-emerald-600" />
                  {t('nav.households')}
                </Link>

                <Link
                  to="/persons"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive('/persons')
                      ? 'bg-slate-100 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Users className="w-4 h-4 mr-1.5 text-purple-600" />
                  {t('nav.persons')}
                </Link>

                <Link
                  to="/schemes"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive('/schemes')
                      ? 'bg-slate-100 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <BookOpen className="w-4 h-4 mr-1.5 text-indigo-600" />
                  {t('nav.schemes')}
                </Link>

                <Link
                  to="/applications"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive('/applications')
                      ? 'bg-slate-100 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-4 h-4 mr-1.5 text-amber-600" />
                  {t('nav.applications')}
                </Link>

                <Link
                  to="/benefits"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive('/benefits')
                      ? 'bg-slate-100 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Award className="w-4 h-4 mr-1.5 text-emerald-600" />
                  {t('nav.benefits')}
                </Link>

                {isOfficerOrAdmin && (
                  <>
                    <Link
                      to="/review/entity-resolution"
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive('/review/entity-resolution')
                          ? 'bg-slate-100 text-blue-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Scale className="w-4 h-4 mr-1.5 text-indigo-600" />
                      {t('v4.entityResolution')}
                    </Link>

                    <Link
                      to="/review/benefit-duplicates"
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive('/review/benefit-duplicates')
                          ? 'bg-slate-100 text-blue-700 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <Copy className="w-4 h-4 mr-1.5 text-amber-600" />
                      {t('v4.duplicateCases')}
                    </Link>
                  </>
                )}

                <Link
                  to="/profile"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive('/profile')
                      ? 'bg-slate-100 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-4 h-4 mr-1.5 text-slate-400" />
                  {t('nav.profile')}
                </Link>

                {isAuditorOrAdmin && (
                  <Link
                    to="/audit"
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive('/audit')
                        ? 'bg-slate-100 text-blue-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <History className="w-4 h-4 mr-1.5 text-slate-400" />
                    {t('nav.auditor')}
                  </Link>
                )}
              </nav>
            )}
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" aria-hidden="true" />
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                  language === 'en'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-pressed={language === 'en'}
                aria-label="Switch to English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 text-xs rounded font-medium transition-colors ${
                  language === 'hi'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                aria-pressed={language === 'hi'}
                aria-label="Switch to Hindi"
              >
                हिं
              </button>
            </div>

            {/* Authenticated user menu */}
            {user ? (
              <div className="hidden sm:flex items-center space-x-3 border-l border-slate-200 pl-4">
                <div className="text-right">
                  <div className="text-xs font-semibold text-slate-900 leading-tight">
                    {user.display_name}
                  </div>
                  <div className="flex justify-end mt-0.5">
                    {user.roles[0] && <RoleBadge role={user.roles[0]} />}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title={t('nav.logout')}
                  aria-label={t('nav.logout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  {t('nav.register')}
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          {user ? (
            <>
              <div className="py-2 border-b border-slate-100">
                <div className="text-sm font-semibold text-slate-900">{user.display_name}</div>
                <div className="text-xs text-slate-500">{user.email}</div>
                <div className="mt-1">
                  {user.roles[0] && <RoleBadge role={user.roles[0]} />}
                </div>
              </div>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {t('nav.dashboard')}
              </Link>
              <Link
                to="/graph"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {t('nav.graph')}
              </Link>
              <Link
                to="/households"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {t('nav.households')}
              </Link>
              <Link
                to="/persons"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {t('nav.persons')}
              </Link>
              <Link
                to="/schemes"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {t('nav.schemes')}
              </Link>
              <Link
                to="/applications"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {t('nav.applications')}
              </Link>
              <Link
                to="/benefits"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {t('nav.benefits')}
              </Link>
              {isOfficerOrAdmin && (
                <>
                  <Link
                    to="/review/entity-resolution"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    {t('v4.entityResolution')}
                  </Link>
                  <Link
                    to="/review/benefit-duplicates"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
                  >
                    {t('v4.duplicateCases')}
                  </Link>
                </>
              )}
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {t('nav.profile')}
              </Link>
              {isAuditorOrAdmin && (
                <Link
                  to="/audit"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  {t('nav.auditor')}
                </Link>
              )}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
              >
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {t('nav.login')}
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                {t('nav.register')}
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
