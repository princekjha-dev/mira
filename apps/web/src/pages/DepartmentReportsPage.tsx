import React from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Download,
  Calendar,
} from 'lucide-react';

export const DepartmentReportsPage: React.FC = () => {
  const metrics = [
    { title: 'Total Applications Processed', count: '1,420', change: '+12% this month' },
    { title: 'Average Adjudication Turnaround', count: '2.4 days', change: '85% automated rule pass' },
    { title: 'Duplicate Claims Prevented', count: '48 Cases', change: 'Zero wrongful disbursals' },
    { title: 'Total Entitlement Value Issued', count: '₹1.84 Cr', change: '100% verified beneficiary accounts' },
  ];

  const breakdownByCategory = [
    { category: 'Rural Housing (PMAY-G)', count: 620, percent: '43.6%' },
    { category: 'Agricultural Input Subsidy', count: 390, percent: '27.4%' },
    { category: 'Elderly Social Pension', count: 280, percent: '19.7%' },
    { category: 'Women & Child Nutrition Support', count: 130, percent: '9.3%' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Title */}
      <div className="bg-white p-6 rounded-xl border border-[#DCE3EA] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#123B63] text-white mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Public Welfare Intelligence</span>
          </div>
          <h1 className="text-xl font-bold text-[#172033]">
            Department Welfare Analytics & Processing Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational turnaround tracking, duplicate detection frequency, and disbursement oversight.
          </p>
        </div>

        <button
          onClick={() => alert('Operational intelligence export generated as signed CSV report.')}
          className="inline-flex items-center px-4 py-2 bg-white border border-[#DCE3EA] text-slate-700 hover:bg-slate-50 rounded-[7px] text-xs font-semibold shadow-xs"
        >
          <Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
          <span>Export Audited Report</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-[#DCE3EA] shadow-2xs">
            <div className="text-2xl font-extrabold text-[#123B63]">{m.count}</div>
            <div className="text-xs font-bold text-slate-800 mt-1">{m.title}</div>
            <div className="text-[11px] text-emerald-700 mt-0.5 font-medium">{m.change}</div>
          </div>
        ))}
      </div>

      {/* Breakdown by Scheme Category */}
      <div className="bg-white p-6 rounded-xl border border-[#DCE3EA] shadow-2xs space-y-4">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Processing Volume by Welfare Category
        </h2>

        <div className="space-y-3">
          {breakdownByCategory.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                <span>{item.category}</span>
                <span>{item.count} applications ({item.percent})</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#123B63] h-2 rounded-full"
                  style={{ width: item.percent }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
