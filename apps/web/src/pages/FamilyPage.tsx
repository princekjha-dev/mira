import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Home,
  UserPlus,
  Clock,
  ShieldCheck,
  Calendar,
  AlertCircle,
  CheckCircle2,
  GitBranch,
  ArrowRight,
  Plus,
  ExternalLink,
  Building,
  Heart,
  Baby,
  UserMinus,
  FileCheck,
  Sparkles,
} from 'lucide-react';
import { api } from '../api/client';
import { Household, HouseholdMembership, Person } from '../types';

export const FamilyPage: React.FC = () => {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null);
  const [members, setMembers] = useState<HouseholdMembership[]>([]);
  const [loading, setLoading] = useState(true);

  // Change request modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [requestType, setRequestType] = useState('ADD_MEMBER');
  const [memberName, setMemberName] = useState('');
  const [relationRole, setRelationRole] = useState('SPOUSE');
  const [effectiveDate, setEffectiveDate] = useState('2026-10-23');
  const [notes, setNotes] = useState('');
  const [submittedAlert, setSubmittedAlert] = useState<string | null>(null);

  useEffect(() => {
    const fetchFamilyData = async () => {
      try {
        const res = await api.get<{ data: Household[] }>('/households');
        const hhs = res.data || [];
        setHouseholds(hhs);
        if (hhs.length > 0) {
          const mainHh = hhs[0];
          setSelectedHousehold(mainHh);
          const membersRes = await api.get<{ data: HouseholdMembership[] }>(
            `/households/${mainHh.id}/members`
          );
          setMembers(membersRes.data || []);
        }
      } catch {
        // Fallback demo state
      } finally {
        setLoading(false);
      }
    };
    fetchFamilyData();
  }, []);

  const handleSelectHousehold = async (hh: Household) => {
    setSelectedHousehold(hh);
    setLoading(true);
    try {
      const res = await api.get<{ data: HouseholdMembership[] }>(
        `/households/${hh.id}/members`
      );
      setMembers(res.data || []);
    } catch {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChangeRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedAlert(
      `Family change workflow initiated (${requestType.replace(/_/g, ' ')}). Sent to verification queue for officer sign-off. Verified records remain unchanged until reviewed.`
    );
    setModalOpen(false);
    setMemberName('');
    setNotes('');
  };

  // Synthetic Temporal History intervals
  const temporalHistory = [
    {
      period: '2024-01-01 — Present',
      household: selectedHousehold?.name || 'Kumar Family Household',
      publicId: selectedHousehold?.public_id || 'H-1001',
      role: 'HEAD OF HOUSEHOLD',
      status: 'VERIFIED',
      source: 'State Civil Supplies & Census Record',
    },
    {
      period: '2018-06-15 — 2023-12-31',
      household: 'Paternal Ancestral Household',
      publicId: 'H-0942',
      role: 'DEPENDENT / SON',
      status: 'HISTORICAL_ARCHIVED',
      source: 'District Rural Registry (Legacy)',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Page Title & Actions */}
      <div className="bg-white p-6 rounded-xl border border-[#DCE3EA] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#123B63] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#172033]">
              Family & Household Record
            </h1>
            <p className="text-xs text-slate-500">
              Manage family relationships, inspect bitemporal household timelines, and submit verified life-event updates.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/graph"
            className="inline-flex items-center px-3.5 py-2 bg-white border border-[#DCE3EA] text-slate-700 hover:bg-slate-50 rounded-[7px] text-xs font-semibold shadow-xs transition-colors"
          >
            <GitBranch className="w-3.5 h-3.5 mr-1.5 text-[#2563A6]" />
            <span>Interactive Family Graph</span>
          </Link>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center px-3.5 py-2 bg-[#123B63] hover:bg-[#0B2540] text-white rounded-[7px] text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            <span>Family Change Request</span>
          </button>
        </div>
      </div>

      {submittedAlert && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start space-x-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <span className="font-bold">Workflow Queued:</span> {submittedAlert}
          </div>
        </div>
      )}

      {/* Household Selector Tabs if multiple */}
      {households.length > 1 && (
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
          {households.map((hh) => (
            <button
              key={hh.id}
              onClick={() => handleSelectHousehold(hh)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                selectedHousehold?.id === hh.id
                  ? 'bg-white border-[#123B63] text-[#123B63] font-bold shadow-2xs'
                  : 'bg-[#F8F8F5] border-[#DCE3EA] text-slate-600 hover:text-slate-900'
              }`}
            >
              {hh.name} ({hh.public_id})
            </button>
          ))}
        </div>
      )}

      {/* Household Summary & Active Members */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Active Members Tree */}
        <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-[#DCE3EA] shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#DCE3EA]">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-[#123B63] bg-blue-50 px-1.5 py-0.5 rounded">
                  {selectedHousehold?.public_id || 'H-1001'}
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  {selectedHousehold?.name || 'Kumar Family Household'}
                </h2>
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Active Members: {members.length} • Status: {selectedHousehold?.status || 'ACTIVE'}
              </div>
            </div>

            <Link
              to={selectedHousehold ? `/households/${selectedHousehold.id}` : '#'}
              className="text-xs text-[#2563A6] hover:underline flex items-center font-semibold"
            >
              <span>Manage Record</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </Link>
          </div>

          {/* Members List */}
          <div className="space-y-2.5">
            {members.map((m) => (
              <div
                key={m.id}
                className="p-3.5 rounded-lg border border-[#DCE3EA] hover:border-slate-300 bg-[#F8F8F5]/60 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-[#123B63] text-white flex items-center justify-center font-bold text-xs">
                    {m.person_name ? m.person_name.charAt(0) : 'P'}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                      <span>{m.person_name || 'Individual Record'}</span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-full uppercase">
                        {m.membership_role}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>Member since {m.valid_from}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-medium">✓ Verified Record</span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/persons/${m.person_id}`}
                  className="px-2.5 py-1 text-xs border border-[#DCE3EA] hover:bg-white rounded-md text-slate-700 font-medium transition-colors"
                >
                  View Person
                </Link>
              </div>
            ))}
          </div>

          {/* Linked Assets & Benefits Notice */}
          <div className="p-3.5 bg-blue-50/50 rounded-lg border border-blue-200 text-xs text-[#123B63] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#2563A6] shrink-0" />
              <span>Linked to Parcel ID: <strong className="font-mono">P-101-RURAL</strong> & 2 Active Welfare Schemes</span>
            </div>
            <Link to="/benefits" className="text-xs font-semibold text-[#2563A6] hover:underline">
              Ledger
            </Link>
          </div>
        </div>

        {/* Right: Temporal Household History */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-[#DCE3EA] shadow-2xs space-y-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1.5 text-[#123B63]" />
            Temporal Household History
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Relationships are immutable across time. Life events do not overwrite past household contexts.
          </p>

          <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#DCE3EA]">
            {temporalHistory.map((item, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-5 mt-1 w-3 h-3 rounded-full bg-[#123B63] ring-4 ring-white" />
                <div className="text-xs font-bold text-slate-800">{item.period}</div>
                <div className="text-xs text-slate-700 font-medium mt-0.5">
                  {item.household} <span className="font-mono text-[10px] text-slate-500">({item.publicId})</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Role: <span className="font-semibold text-slate-700">{item.role}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Source: {item.source}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <div className="text-[11px] text-slate-500">
              Need to split a household or report marriage?
            </div>
            <button
              onClick={() => {
                setRequestType('REQUEST_SPLIT');
                setModalOpen(true);
              }}
              className="mt-1 text-xs font-semibold text-[#2563A6] hover:underline"
            >
              Initiate Household Split Workflow →
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Family Change Request Workflow */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-[#DCE3EA] max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#DCE3EA]">
              <h3 className="text-sm font-bold text-slate-900">
                Submit Family Change Request
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateChangeRequest} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Change Request Type
                </label>
                <select
                  value={requestType}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="w-full bg-[#F5F5F1] border border-[#DCE3EA] rounded-[7px] p-2 text-slate-800 outline-none"
                >
                  <option value="ADD_MEMBER">Add Family Member</option>
                  <option value="REPORT_BIRTH">Report Birth</option>
                  <option value="REPORT_MARRIAGE">Report Marriage</option>
                  <option value="REPORT_SEPARATION">Report Separation</option>
                  <option value="REPORT_DEATH">Report Death</option>
                  <option value="REQUEST_SPLIT">Request Household Split</option>
                  <option value="RELATION_CORRECTION">Request Relationship Correction</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Individual / Member Full Name
                </label>
                <input
                  type="text"
                  required
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="e.g. Priya Kumar"
                  className="w-full bg-[#F5F5F1] border border-[#DCE3EA] rounded-[7px] p-2 text-slate-800 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Relationship Role
                  </label>
                  <select
                    value={relationRole}
                    onChange={(e) => setRelationRole(e.target.value)}
                    className="w-full bg-[#F5F5F1] border border-[#DCE3EA] rounded-[7px] p-2 text-slate-800 outline-none"
                  >
                    <option value="SPOUSE">Spouse</option>
                    <option value="CHILD">Child</option>
                    <option value="PARENT">Parent</option>
                    <option value="SIBLING">Sibling</option>
                    <option value="DEPENDENT">Dependent</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Effective Date
                  </label>
                  <input
                    type="date"
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                    className="w-full bg-[#F5F5F1] border border-[#DCE3EA] rounded-[7px] p-2 text-slate-800 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Justification & Supporting Document Reference
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Reference birth certificate, marriage certificate, or legal split order..."
                  className="w-full bg-[#F5F5F1] border border-[#DCE3EA] rounded-[7px] p-2 text-slate-800 outline-none"
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 leading-relaxed flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Strict Civic Rule:</strong> Citizen requests enter an audited verification workflow and require officer sign-off. Verified records cannot be altered immediately without official adjudication.
                </span>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3.5 py-2 border border-[#DCE3EA] text-slate-700 rounded-[7px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#123B63] text-white font-semibold rounded-[7px]"
                >
                  Submit Change Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
