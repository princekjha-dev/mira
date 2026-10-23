import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Globe,
  ChevronDown,
  HelpCircle,
  LogOut,
  User,
  Shield,
  Check,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation, Language, SUPPORTED_LANGUAGES } from '../../i18n/context';
import { RoleBadge } from '../RoleBadge';

interface TopUtilityBarProps {
  onOpenSearch: () => void;
  onToggleMobileNav?: () => void;
}

export const TopUtilityBar: React.FC<TopUtilityBarProps> = ({ onOpenSearch, onToggleMobileNav }) => {
  const { user, logout, login } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Compute breadcrumbs from current pathname
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const formatted = segment
      .replace(/-/g, ' ')
      .replace(/^\w/, (c) => c.toUpperCase());
    return { name: formatted, url };
  });

  const handleLogout = async () => {
    setProfileMenuOpen(false);
    await logout();
    navigate('/login');
  };

  // 1-Click Role Switcher for Demo Evaluation
  const handleQuickSwitchRole = async (email: string) => {
    try {
      setProfileMenuOpen(false);
      await login(email, 'MiraDemo@2026!');
      navigate('/dashboard');
    } catch {
      // Ignored
    }
  };

  // Demo notifications list
  const notifications = [
    {
      id: '1',
      title: 'Document Verified',
      desc: 'Income Certificate extracted and verified with high confidence (0.95).',
      time: '10m ago',
      unread: true,
    },
    {
      id: '2',
      title: 'Duplicate Check Clear',
      desc: 'No conflicting claims detected for Household H-1001 under Housing Category.',
      time: '1h ago',
      unread: true,
    },
    {
      id: '3',
      title: 'Rule Engine Evaluation',
      desc: 'Application A-2026-001 assessed as Likely Eligible for Solar Subsidy.',
      time: '3h ago',
      unread: false,
    },
  ];

  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-[#DCE3EA]">
      {/* Synthetic Demo Banner Notice */}
      <div className="bg-[#123B63] text-white text-[11px] py-1 px-4 flex items-center justify-between font-medium">
        <div className="flex items-center space-x-2 mx-auto sm:mx-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{t('app.demoNotice')}</span>
        </div>
        <div className="hidden sm:flex items-center space-x-3 text-slate-300 text-[10px]">
          <span>PS7 Public Documentation Platform</span>
          <span>•</span>
          <span className="font-mono">ENV: SYNTHETIC_DEMO</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Left: Mobile Nav Button + Breadcrumbs */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleMobileNav}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Navigation */}
            <nav className="flex items-center text-xs font-medium text-slate-500 overflow-x-auto no-scrollbar py-1">
              <Link to="/dashboard" className="text-slate-700 hover:text-[#123B63] font-semibold flex items-center">
                Mira
              </Link>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.url}>
                  <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-400 flex-shrink-0" />
                  {idx === breadcrumbs.length - 1 ? (
                    <span className="text-[#123B63] font-semibold truncate max-w-[150px] sm:max-w-[200px]">
                      {crumb.name}
                    </span>
                  ) : (
                    <Link to={crumb.url} className="hover:text-slate-900 truncate max-w-[120px]">
                      {crumb.name}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Right: Search, Notifications, Language, Help, Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Global Search Bar (Trigger) */}
            <button
              onClick={onOpenSearch}
              className="flex items-center bg-[#F5F5F1] hover:bg-[#EAEAE5] border border-[#DCE3EA] rounded-[7px] px-2.5 py-1.5 text-xs text-slate-600 transition-colors group focus:outline-none focus:ring-1 focus:ring-[#2563A6]"
              title="Search records, schemes, applications (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400 mr-2 group-hover:text-slate-600" />
              <span className="hidden sm:inline pr-2 text-slate-500">Search records, schemes...</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-white border border-slate-200 rounded">
                ⌘K
              </kbd>
            </button>

            {/* Multilingual Selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-[7px] border border-[#DCE3EA] hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors"
                aria-label="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">{currentLangObj.nativeName}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-48 bg-white border border-[#DCE3EA] rounded-xl shadow-lg py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 font-semibold text-slate-400 text-[10px] uppercase tracking-wider border-b border-slate-100">
                    Select Language ({SUPPORTED_LANGUAGES.length})
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          language === lang.code ? 'font-bold text-[#123B63] bg-blue-50/50' : 'text-slate-700'
                        }`}
                      >
                        <div className="flex flex-col">
                          <span>{lang.nativeName}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{lang.name}</span>
                        </div>
                        {language === lang.code && <Check className="w-3.5 h-3.5 text-[#123B63]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifMenuOpen(!notifMenuOpen)}
                className="relative p-2 text-slate-600 hover:text-slate-900 rounded-[7px] hover:bg-slate-100 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white" />
              </button>

              {notifMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-80 bg-white border border-[#DCE3EA] rounded-xl shadow-lg z-50 overflow-hidden text-xs animate-in fade-in zoom-in-95 duration-100">
                  <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-slate-800">Notifications</span>
                    <Link
                      to="/citizen/notifications"
                      onClick={() => setNotifMenuOpen(false)}
                      className="text-[11px] text-[#2563A6] hover:underline"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-800">{n.title}</span>
                          <span className="text-[10px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11px]">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Help Shortcut */}
            <Link
              to="/help"
              className="p-2 text-slate-600 hover:text-slate-900 rounded-[7px] hover:bg-slate-100 transition-colors"
              title="Help & Grievance Portal"
            >
              <HelpCircle className="w-4 h-4" />
            </Link>

            {/* User Profile & Demo Role Switcher */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center space-x-2 pl-2 pr-1 py-1 rounded-[7px] hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                >
                  <div className="w-7 h-7 rounded-full bg-[#123B63] text-white flex items-center justify-center font-semibold text-xs">
                    {user.display_name ? user.display_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-800 leading-tight">
                      {user.display_name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {user.roles[0] || 'CITIZEN'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-64 bg-white border border-[#DCE3EA] rounded-xl shadow-lg py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <div className="font-semibold text-slate-800">{user.display_name}</div>
                      <div className="text-slate-500 text-[11px] font-mono truncate">{user.email}</div>
                      <div className="mt-1.5">
                        <RoleBadge role={user.roles[0] || 'CITIZEN'} />
                      </div>
                    </div>

                    {/* Quick Switch Demo Roles */}
                    <div className="px-3 py-1.5 border-b border-slate-100">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Demo Role Switcher (1-Click)
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[11px]">
                        <button
                          onClick={() => handleQuickSwitchRole('citizen@mira.local')}
                          className="px-2 py-1 rounded bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#123B63] text-left transition-colors"
                        >
                          Citizen
                        </button>
                        <button
                          onClick={() => handleQuickSwitchRole('officer@mira.local')}
                          className="px-2 py-1 rounded bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#123B63] text-left transition-colors"
                        >
                          Field Officer
                        </button>
                        <button
                          onClick={() => handleQuickSwitchRole('verifier@mira.local')}
                          className="px-2 py-1 rounded bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#123B63] text-left transition-colors"
                        >
                          Verifier
                        </button>
                        <button
                          onClick={() => handleQuickSwitchRole('admin@mira.local')}
                          className="px-2 py-1 rounded bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#123B63] text-left transition-colors"
                        >
                          Dept Admin
                        </button>
                      </div>
                    </div>

                    <div className="pt-1">
                      <Link
                        to="/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center px-3 py-2 hover:bg-slate-50 text-slate-700"
                      >
                        <User className="w-3.5 h-3.5 mr-2 text-slate-400" />
                        <span>Profile & Accessibility</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center px-3 py-2 hover:bg-red-50 text-red-600 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5 mr-2 text-red-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-[#123B63] text-white hover:bg-[#0B2540] px-3 py-1.5 rounded-[7px] text-xs font-semibold shadow-xs transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
