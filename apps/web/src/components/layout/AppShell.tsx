import React, { useState } from 'react';
import { FloatingNavRail } from './FloatingNavRail';
import { TopUtilityBar } from './TopUtilityBar';
import { GlobalSearchModal } from './GlobalSearchModal';
import { MiraFloatingAI } from '../ai/MiraFloatingAI';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n/context';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Users,
  FolderOpen,
  Search,
  Bell,
  HelpCircle,
  Settings,
  X,
  History,
  ShieldAlert,
  BarChart3,
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { user } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();

  const roles = user?.roles || [];
  const isOfficerOrAdmin = roles.some((r) =>
    ['FIELD_OFFICER', 'VERIFICATION_OFFICER', 'DEPARTMENT_ADMIN', 'SUPER_ADMIN', 'AUDITOR'].includes(r)
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F1] text-[#172033] antialiased">
      {/* Top Utility Bar */}
      <TopUtilityBar
        onOpenSearch={() => setSearchOpen(true)}
        onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)}
      />

      <div className="flex-1 flex w-full relative">
        {/* Floating Navigation Rail (Desktop) */}
        {user && <FloatingNavRail />}

        {/* Mobile Navigation Drawer */}
        {mobileNavOpen && user && (
          <div className="fixed inset-0 z-50 md:hidden bg-slate-900/50 backdrop-blur-xs flex">
            <div className="w-72 bg-white h-full shadow-2xl flex flex-col p-4 animate-in slide-in-from-left duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-[#DCE3EA]">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-[#123B63] text-white flex items-center justify-center font-bold text-sm">
                    M
                  </div>
                  <span className="font-bold text-slate-800">Mira Navigation</span>
                </div>
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="p-1 rounded-md text-slate-500 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto py-4 space-y-1 text-sm">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  <LayoutDashboard className="w-4 h-4 mr-3 text-slate-500" />
                  <span>{t('nav.dashboard')}</span>
                </Link>
                <Link
                  to="/schemes"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  <BookOpen className="w-4 h-4 mr-3 text-slate-500" />
                  <span>{t('nav.schemes')}</span>
                </Link>
                <Link
                  to="/applications"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  <FileText className="w-4 h-4 mr-3 text-slate-500" />
                  <span>{t('nav.applications')}</span>
                </Link>
                <Link
                  to="/citizen/family"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  <Users className="w-4 h-4 mr-3 text-slate-500" />
                  <span>{t('nav.family')}</span>
                </Link>
                <Link
                  to="/documents"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  <FolderOpen className="w-4 h-4 mr-3 text-slate-500" />
                  <span>{t('nav.documents')}</span>
                </Link>
                <Link
                  to="/track"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  <Search className="w-4 h-4 mr-3 text-slate-500" />
                  <span>{t('nav.track')}</span>
                </Link>
                {isOfficerOrAdmin && (
                  <>
                    <div className="pt-3 pb-1 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Government Oversight
                    </div>
                    <Link
                      to="/officer/verification"
                      onClick={() => setMobileNavOpen(false)}
                      className="flex items-center px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
                    >
                      <ShieldAlert className="w-4 h-4 mr-3 text-amber-500" />
                      <span>{t('nav.verification')}</span>
                    </Link>
                    <Link
                      to="/department/reports"
                      onClick={() => setMobileNavOpen(false)}
                      className="flex items-center px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
                    >
                      <BarChart3 className="w-4 h-4 mr-3 text-slate-500" />
                      <span>{t('nav.reports')}</span>
                    </Link>
                    <Link
                      to="/audit"
                      onClick={() => setMobileNavOpen(false)}
                      className="flex items-center px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
                    >
                      <History className="w-4 h-4 mr-3 text-slate-500" />
                      <span>{t('nav.audit')}</span>
                    </Link>
                  </>
                )}
                <div className="pt-3 pb-1 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Support & Settings
                </div>
                <Link
                  to="/help"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  <HelpCircle className="w-4 h-4 mr-3 text-slate-500" />
                  <span>{t('nav.help')}</span>
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100"
                >
                  <Settings className="w-4 h-4 mr-3 text-slate-500" />
                  <span>{t('nav.settings')}</span>
                </Link>
              </nav>
            </div>
            <div className="flex-1" onClick={() => setMobileNavOpen(false)} />
          </div>
        )}

        {/* Main Content Area */}
        <main
          className={`flex-1 w-full min-w-0 transition-all duration-200 ${
            user ? 'md:pl-20' : ''
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* Contextual Floating Mira AI */}
      <MiraFloatingAI />

      {/* Footer */}
      <footer className={`border-t border-[#DCE3EA] bg-white py-6 mt-auto transition-all ${user ? 'md:pl-20' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-800">{t('app.title')}</span>
            <span>—</span>
            <span>{t('app.tagline')}</span>
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>PS7 Unified Digital Documentation</span>
            <span>•</span>
            <Link to="/help" className="hover:text-slate-600">Grievances</Link>
            <span>•</span>
            <Link to="/track" className="hover:text-slate-600">Tracking</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
