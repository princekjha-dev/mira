import React from 'react';
import {
  UserCheck,
  Shield,
  Mail,
  MapPin,
  CheckCircle2,
  Clock,
  Search,
} from 'lucide-react';

export const DepartmentOfficersPage: React.FC = () => {
  const officers = [
    {
      name: 'P. K. Verma',
      email: 'officer@mira.local',
      role: 'Field Inspection Official',
      district: 'Central Division / Block 4',
      activeCases: 4,
      clearedThisMonth: 38,
      status: 'ACTIVE_ON_DUTY',
    },
    {
      name: 'Sunita Meena',
      email: 'verifier@mira.local',
      role: 'Senior Verification Officer',
      district: 'State Adjudication Cell',
      activeCases: 6,
      clearedThisMonth: 62,
      status: 'ACTIVE_ON_DUTY',
    },
    {
      name: 'Anil Deshmukh',
      email: 'admin@mira.local',
      role: 'Department Administrator',
      district: 'Headquarters Secretariat',
      activeCases: 0,
      clearedThisMonth: 120,
      status: 'SUPERVISOR',
    },
    {
      name: 'Deepak Rao',
      email: 'auditor@mira.local',
      role: 'Chief Civic Auditor',
      district: 'Independent Oversight Bureau',
      activeCases: 0,
      clearedThisMonth: 95,
      status: 'INSPECTOR',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Title */}
      <div className="bg-white p-6 rounded-xl border border-[#DCE3EA] shadow-2xs">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#123B63] flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#172033]">
              Credentialed Officer & Verifier Directory
            </h1>
            <p className="text-xs text-slate-500">
              Department personnel authorized for evidence inspection, duplicate adjudication, and physical field visits.
            </p>
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {officers.map((off, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-xl border border-[#DCE3EA] shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">{off.name}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {off.status.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="text-xs font-semibold text-[#123B63] mt-0.5">{off.role}</div>

              <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center text-slate-500">
                  <Mail className="w-3.5 h-3.5 mr-1.5" />
                  <span className="font-mono text-[11px]">{off.email}</span>
                </div>
                <div className="flex items-center text-slate-500">
                  <MapPin className="w-3.5 h-3.5 mr-1.5" />
                  <span>{off.district}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Active Workload: <strong className="text-slate-800">{off.activeCases}</strong></span>
              <span>Cleared: <strong className="text-emerald-700">{off.clearedThisMonth}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
