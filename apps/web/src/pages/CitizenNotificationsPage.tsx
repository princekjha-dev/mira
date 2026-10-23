import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  ShieldCheck,
  Check,
  Award,
  Users,
} from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  category: 'APPLICATION' | 'DOCUMENT' | 'BENEFIT' | 'FAMILY';
  unread: boolean;
}

export const CitizenNotificationsPage: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'Application Moved to Officer Review',
      desc: 'Application APP-2026-PMGSY-001 has passed automated OCR and deterministic rule evaluation and is assigned to verification officer.',
      time: '15 minutes ago',
      category: 'APPLICATION',
      unread: true,
    },
    {
      id: '2',
      title: 'Income Certificate Verified',
      desc: 'Structured evidence extraction verified certificate issued by Tehsildar (Extraction confidence: 0.95).',
      time: '2 hours ago',
      category: 'DOCUMENT',
      unread: true,
    },
    {
      id: '3',
      title: 'Welfare Benefit Disbursed',
      desc: 'First installment of Rural Housing Subsidy credited to verified Aadhaar-linked beneficiary bank account.',
      time: '1 day ago',
      category: 'BENEFIT',
      unread: false,
    },
    {
      id: '4',
      title: 'Household Record Verified',
      desc: 'Bitemporal membership in Household H-1001 verified against State Civil Supplies register.',
      time: '3 days ago',
      category: 'FAMILY',
      unread: false,
    },
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const filtered = filter === 'UNREAD' ? notifications.filter((n) => n.unread) : notifications;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="bg-white p-6 rounded-xl border border-[#DCE3EA] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#123B63] flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#172033]">
              Citizen Notification Center
            </h1>
            <p className="text-xs text-slate-500">
              Timely updates regarding application milestones, evidence requests, and benefit disbursements.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => setFilter(filter === 'ALL' ? 'UNREAD' : 'ALL')}
            className="px-3 py-1.5 border border-[#DCE3EA] rounded-[7px] text-slate-700 hover:bg-slate-50 font-medium"
          >
            {filter === 'ALL' ? 'Show Unread Only' : 'Show All'}
          </button>
          <button
            onClick={markAllRead}
            className="px-3 py-1.5 bg-[#123B63] text-white rounded-[7px] font-semibold hover:bg-[#0B2540]"
          >
            Mark All as Read
          </button>
        </div>
      </div>

      {/* Notifications Feed */}
      <div className="bg-white p-6 rounded-xl border border-[#DCE3EA] shadow-2xs space-y-3">
        <div className="divide-y divide-slate-100">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`py-4 px-3 rounded-lg flex items-start justify-between gap-3 transition-colors ${
                item.unread ? 'bg-blue-50/30' : 'hover:bg-slate-50/70'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                  {item.category === 'APPLICATION' && (
                    <FileText className="w-4 h-4 text-[#123B63]" />
                  )}
                  {item.category === 'DOCUMENT' && (
                    <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                  )}
                  {item.category === 'BENEFIT' && (
                    <Award className="w-4 h-4 text-purple-700" />
                  )}
                  {item.category === 'FAMILY' && (
                    <Users className="w-4 h-4 text-[#0F766E]" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">
                      {item.title}
                    </span>
                    {item.unread && (
                      <span className="w-2 h-2 rounded-full bg-[#2563A6]" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    {item.desc}
                  </p>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    {item.time}
                  </span>
                </div>
              </div>

              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {item.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
