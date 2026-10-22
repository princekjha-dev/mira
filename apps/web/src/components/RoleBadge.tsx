import React from 'react';

interface RoleBadgeProps {
  role: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  const getBadgeStyle = (r: string) => {
    switch (r.toUpperCase()) {
      case 'CITIZEN':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'FIELD_OFFICIAL':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'VERIFICATION_OFFICER':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'DEPARTMENT_ADMIN':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'AUDITOR':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'SUPER_ADMIN':
        return 'bg-slate-900 text-white border-slate-950';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatRole = (r: string) => {
    return r.replace(/_/g, ' ');
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyle(
        role
      )}`}
    >
      {formatRole(role)}
    </span>
  );
};
