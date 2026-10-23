import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Users,
  FolderOpen,
  Award,
  Search,
  Bell,
  HelpCircle,
  Settings,
  ShieldAlert,
  Sliders,
  BarChart3,
  UserCheck,
  History,
  GitBranch,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n/context';

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

export const FloatingNavRail: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();

  // Role detection
  const roles = user?.roles || [];
  const isDepartmentAdmin = roles.some((r) =>
    ['DEPARTMENT_ADMIN', 'SUPER_ADMIN'].includes(r)
  );
  const isOfficer = roles.some((r) =>
    ['FIELD_OFFICER', 'VERIFICATION_OFFICER'].includes(r)
  );
  const isAuditor = roles.includes('AUDITOR');

  // Build role-tailored navigation items
  let navItems: NavItem[] = [];

  if (isDepartmentAdmin) {
    navItems = [
      { to: '/department/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
      { to: '/schemes', label: t('nav.schemes'), icon: BookOpen },
      { to: '/department/rules', label: t('nav.rules'), icon: Sliders },
      { to: '/applications', label: t('nav.applications'), icon: FileText },
      { to: '/department/reports', label: t('nav.reports'), icon: BarChart3 },
      { to: '/department/officers', label: t('nav.officers'), icon: UserCheck },
      { to: '/audit', label: t('nav.audit'), icon: History },
      { to: '/profile', label: t('nav.settings'), icon: Settings },
    ];
  } else if (isOfficer || isAuditor) {
    navItems = [
      { to: '/officer/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
      { to: '/applications', label: t('nav.applications'), icon: FileText },
      { to: '/officer/verification', label: t('nav.verification'), icon: ShieldAlert, badge: '!' },
      { to: '/officer/duplicates', label: t('nav.duplicates'), icon: GitBranch },
      { to: '/persons', label: t('v2.persons'), icon: Users },
      { to: '/households', label: t('v2.households'), icon: FolderOpen },
      { to: '/documents', label: t('nav.documents'), icon: FileText },
      { to: '/schemes', label: t('nav.schemes'), icon: BookOpen },
      { to: '/department/reports', label: t('nav.reports'), icon: BarChart3 },
      { to: '/audit', label: t('nav.audit'), icon: History },
      { to: '/profile', label: t('nav.settings'), icon: Settings },
    ];
  } else {
    // Citizen Navigation
    navItems = [
      { to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
      { to: '/schemes', label: t('nav.schemes'), icon: BookOpen },
      { to: '/applications', label: t('nav.applications'), icon: FileText },
      { to: '/citizen/family', label: t('nav.family'), icon: Users },
      { to: '/documents', label: t('nav.documents'), icon: FolderOpen },
      { to: '/benefits', label: t('nav.benefits'), icon: Award },
      { to: '/track', label: t('nav.track'), icon: Search },
      { to: '/citizen/notifications', label: t('nav.notifications'), icon: Bell },
      { to: '/help', label: t('nav.help'), icon: HelpCircle },
      { to: '/profile', label: t('nav.settings'), icon: Settings },
    ];
  }

  return (
    <aside
      className="hidden md:flex flex-col items-center fixed left-3 top-20 bottom-6 w-14 bg-white border border-[#DCE3EA] rounded-2xl shadow-xs py-3 z-30 transition-all duration-200 select-none"
      aria-label="Sidebar Navigation Rail"
    >
      {/* Brand Emblem */}
      <NavLink
        to="/dashboard"
        className="w-10 h-10 rounded-xl bg-[#123B63] text-white flex items-center justify-center font-bold text-sm shadow-xs mb-3 hover:bg-[#0B2540] transition-colors"
        title="Mira Operating System"
      >
        M
      </NavLink>

      <div className="w-8 h-[1px] bg-[#DCE3EA] mb-3" />

      {/* Nav List */}
      <nav className="flex-1 flex flex-col space-y-1.5 items-center w-full px-2 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.to ||
            (item.to !== '/dashboard' && location.pathname.startsWith(item.to));

          return (
            <div key={item.to} className="relative group flex items-center justify-center">
              <NavLink
                to={item.to}
                className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-[#123B63] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
                aria-label={item.label}
              >
                <Icon className="w-5 h-5" />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </NavLink>

              {/* Accessible Floating Tooltip */}
              <div className="absolute left-14 hidden group-hover:flex items-center z-50 pointer-events-none">
                <div className="bg-[#172033] text-white text-xs font-medium py-1.5 px-2.5 rounded-md shadow-md whitespace-nowrap border border-slate-700">
                  {item.label}
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Bottom Separator & Settings Quick Icon */}
      <div className="w-8 h-[1px] bg-[#DCE3EA] mt-2 mb-2" />
      <NavLink
        to="/profile"
        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
          location.pathname === '/profile'
            ? 'bg-[#123B63] text-white'
            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
        }`}
        title={t('nav.settings')}
      >
        <Settings className="w-4 h-4" />
      </NavLink>
    </aside>
  );
};
