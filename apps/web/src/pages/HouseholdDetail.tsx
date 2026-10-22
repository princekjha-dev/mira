import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import {
  Household,
  HouseholdMembership,
  PropertyAssociation,
  HouseholdTimelineItem,
  Benefit,
} from '../types';
import { useTranslation } from '../i18n/context';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  User,
  Clock,
  Building,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Network,
  Split,
  CheckCircle2,
  X,
  History,
  Award,
} from 'lucide-react';

export const HouseholdDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryDate = searchParams.get('date') || '2026-10-22';
  const [dateInput, setDateInput] = useState(queryDate);

  const [household, setHousehold] = useState<Household | null>(null);
  const [activeMembers, setActiveMembers] = useState<HouseholdMembership[]>([]);
  const [allMemberships, setAllMemberships] = useState<HouseholdMembership[]>([]);
  const [properties, setProperties] = useState<PropertyAssociation[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<HouseholdTimelineItem[]>([]);
  const [benefits, setBenefits] = useState<Benefit[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Split Modal State
  const [splitModalOpen, setSplitModalOpen] = useState(false);
  const [splitPersonId, setSplitPersonId] = useState('');
  const [newHouseholdName, setNewHouseholdName] = useState('');
  const [splitEffectiveDate, setSplitEffectiveDate] = useState('2025-07-01');
  const [splitLoading, setSplitLoading] = useState(false);
  const [splitSuccessMessage, setSplitSuccessMessage] = useState<string | null>(null);

  const isOfficialOrAdmin = user?.roles.some((r) =>
    ['SUPER_ADMIN', 'DEPARTMENT_ADMIN', 'FIELD_OFFICIAL', 'VERIFICATION_OFFICER'].includes(r)
  );

  const fetchHouseholdData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const [hRes, activeMemsRes, allMemsRes, propsRes, timelineRes, benRes] = await Promise.all([
        api.get<{ data: Household }>(`/households/${id}`),
        api.get<{ data: HouseholdMembership[] }>(`/households/${id}/members?date=${queryDate}`),
        api.get<{ data: HouseholdMembership[] }>(`/households/${id}/members`),
        api.get<{ data: PropertyAssociation[] }>(`/households/${id}/properties?date=${queryDate}`).catch(() => ({ data: [] })),
        api.get<{ data: HouseholdTimelineItem[] }>(`/households/${id}/timeline`),
        api.get<any>(`/households/${id}/benefits`).catch(() => []),
      ]);

      setHousehold(hRes.data);
      setActiveMembers(activeMemsRes.data);
      setAllMemberships(allMemsRes.data);
      setProperties(propsRes.data);
      setTimelineEvents(timelineRes.data);
      setBenefits(Array.isArray(benRes) ? benRes : benRes?.data || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load household details');
    } finally {
      setLoading(false);
    }
  }, [id, queryDate]);

  useEffect(() => {
    fetchHouseholdData();
  }, [fetchHouseholdData]);

  const handleDateChange = (newDate: string) => {
    setDateInput(newDate);
    setSearchParams({ date: newDate });
  };

  const handleExecuteSplit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !splitPersonId || !newHouseholdName) return;

    setSplitLoading(true);
    try {
      await api.post('/households/split', {
        source_household_id: id,
        person_id: splitPersonId,
        new_household_name: newHouseholdName,
        effective_date: splitEffectiveDate,
      });

      setSplitSuccessMessage(
        `Household split successfully recorded. The person was assigned to ${newHouseholdName} as of ${splitEffectiveDate}, preserving past memberships.`
      );
      setSplitModalOpen(false);
      fetchHouseholdData();
    } catch (err: any) {
      alert(err?.message || 'Failed to execute household split');
    } finally {
      setSplitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center items-center">
        <div className="flex items-center space-x-3 text-slate-500">
          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  if (error || !household) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-lg mx-auto">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-red-900">{t('common.error')}</h2>
          <p className="text-sm text-red-700 mt-1">{error || 'Household record not found'}</p>
          <Link
            to="/households"
            className="mt-4 inline-flex items-center text-xs font-semibold text-red-800 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Households
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/households"
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          {t('v2.households')}
        </Link>
        <div className="flex items-center space-x-2">
          {isOfficialOrAdmin && (
            <button
              onClick={() => {
                if (activeMembers.length > 0) {
                  setSplitPersonId(activeMembers[0].person_id);
                  setNewHouseholdName(`${activeMembers[0].person_name || 'Individual'} Household`);
                }
                setSplitModalOpen(true);
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              <Split className="w-4 h-4" />
              <span>{t('v2.householdSplit')}</span>
            </button>
          )}
          <Link
            to={`/graph?type=household&id=${household.id}&date=${queryDate}`}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition-colors"
          >
            <Network className="w-4 h-4" />
            <span>View in Graph</span>
          </Link>
        </div>
      </div>

      {splitSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{splitSuccessMessage}</span>
          </div>
          <button
            onClick={() => setSplitSuccessMessage(null)}
            className="text-emerald-600 hover:text-emerald-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Household Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl font-bold shadow-xs">
            <Home className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{household.name}</h1>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                {household.status}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                {household.public_id}
              </span>
              <span>•</span>
              <span>
                {activeMembers.length} {activeMembers.length === 1 ? 'member' : 'members'} on {queryDate}
              </span>
              <span>•</span>
              <span>Administrative Unit (Not strictly 1 address)</span>
            </div>
          </div>
        </div>

        {/* Temporal Time-Travel Box */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center gap-2 text-xs shadow-xs">
          <div className="flex items-center space-x-2 text-amber-900 font-medium">
            <Clock className="w-4 h-4 text-amber-700" />
            <span>{t('v2.viewAsOf')}:</span>
          </div>
          <input
            type="date"
            value={dateInput}
            onChange={(e) => handleDateChange(e.target.value)}
            className="border border-amber-300 rounded px-2.5 py-1 text-xs bg-white text-slate-800 font-mono shadow-xs focus:ring-1 focus:ring-amber-500"
          />
          <div className="flex items-center space-x-1 pl-2">
            <button
              onClick={() => handleDateChange('2024-06-01')}
              className={`px-2 py-1 text-[10px] rounded font-semibold ${
                queryDate === '2024-06-01' ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-800'
              }`}
            >
              2024
            </button>
            <button
              onClick={() => handleDateChange('2026-10-22')}
              className={`px-2 py-1 text-[10px] rounded font-semibold ${
                queryDate === '2026-10-22' ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-800'
              }`}
            >
              2026
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MEMBERS ON SELECTED DATE */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-800">
                  Members Belonging to Household on {queryDate}
                </h3>
                <p className="text-xs text-slate-500">
                  {activeMembers.length} active individual{activeMembers.length === 1 ? '' : 's'} at this temporal slice
                </p>
              </div>
            </div>

            {activeMembers.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">{t('v2.emptyMembers')}</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {activeMembers.map((mem) => (
                  <div key={mem.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/persons/${mem.person_id}?date=${queryDate}`}
                            className="text-sm font-bold text-slate-900 hover:text-emerald-700 hover:underline"
                          >
                            {mem.person_name || 'Member'}
                          </Link>
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                            {mem.membership_role}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 font-mono">
                          Period: {mem.valid_from} → {mem.valid_to || 'Present'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-xs font-semibold text-emerald-700">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{mem.verification_status}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          Confidence: {mem.confidence}
                        </div>
                      </div>
                      <Link
                        to={`/persons/${mem.person_id}?date=${queryDate}`}
                        className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ALL HISTORICAL MEMBERSHIPS (PERSISTED AUDIT / PROVENANCE) */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Complete Membership History</h3>
                <p className="text-xs text-slate-500">
                  Every historical record is preserved without destructive overwriting
                </p>
              </div>
              <span className="text-xs font-mono bg-slate-200 px-2 py-0.5 rounded text-slate-700">
                {allMemberships.length} Total Records
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {allMemberships.map((m) => (
                <div key={m.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 rounded-full bg-slate-400" />
                    <div>
                      <span className="font-semibold text-slate-900">{m.person_name}</span>
                      <span className="ml-2 text-slate-500">({m.membership_role})</span>
                    </div>
                  </div>
                  <div className="font-mono text-slate-600">
                    {m.valid_from} → {m.valid_to || 'Present'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SIDEBAR: TIMELINE & PROPERTIES */}
        <div className="space-y-6">
          {/* Real Chronological Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 mb-4">
              <History className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold text-slate-900">{t('v2.timeline')}</h3>
            </div>

            {timelineEvents.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">{t('v2.emptyTimeline')}</p>
            ) : (
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {timelineEvents.map((evt) => (
                  <div key={evt.id} className="relative">
                    <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-purple-600 ring-4 ring-purple-100" />
                    <div className="text-[11px] font-mono font-semibold text-purple-700">
                      {evt.date}
                    </div>
                    <div className="text-xs font-bold text-slate-800 mt-0.5">{evt.title}</div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Associated Properties */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100 mb-4">
              <Building className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">{t('v2.properties')}</h3>
            </div>

            {properties.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">{t('v2.emptyProperties')}</p>
            ) : (
              <div className="space-y-3">
                {properties.map((p) => (
                  <div key={p.id} className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                    <div className="font-semibold text-slate-900">{p.address_line}</div>
                    <div className="flex justify-between text-slate-500 mt-1">
                      <span>{p.district}</span>
                      <span className="font-semibold text-blue-600">{p.association_type}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 30: Household Benefits & Assets History */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">{t('v3.householdBenefit')} History</h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {benefits.length} Recorded
              </span>
            </div>

            {benefits.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No household-level benefits recorded.</p>
            ) : (
              <div className="space-y-3">
                {benefits.map((b) => (
                  <div key={b.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{b.scheme_name || b.scheme_code}</span>
                      <span className="font-bold text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        {b.status}
                      </span>
                    </div>
                    <div className="text-slate-600 flex items-center justify-between">
                      <span className="font-semibold text-slate-800">
                        {b.amount
                          ? `₹${b.amount.toLocaleString('en-IN')}`
                          : `${b.quantity || 1} ${b.unit || 'unit'} (${b.description || 'Asset'})`}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {b.disbursed_at ? new Date(b.disbursed_at).getFullYear() : '2024'}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200/60 flex justify-between">
                      <span>Unit: HOUSEHOLD</span>
                      <span>ID: {b.public_id}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HOUSEHOLD SPLIT MODAL */}
      {splitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Split className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">{t('v2.splitModalTitle')}</h3>
              </div>
              <button
                onClick={() => setSplitModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">{t('v2.splitDescription')}</p>

            <form onSubmit={handleExecuteSplit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Member to Separate
                </label>
                <select
                  value={splitPersonId}
                  onChange={(e) => {
                    setSplitPersonId(e.target.value);
                    const selected = activeMembers.find((m) => m.person_id === e.target.value);
                    if (selected) {
                      setNewHouseholdName(`${selected.person_name || 'Individual'} Household`);
                    }
                  }}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:border-amber-500 focus:outline-none"
                  required
                >
                  {activeMembers.map((m) => (
                    <option key={m.person_id} value={m.person_id}>
                      {m.person_name} ({m.membership_role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('v2.targetHouseholdName')}
                </label>
                <input
                  type="text"
                  value={newHouseholdName}
                  onChange={(e) => setNewHouseholdName(e.target.value)}
                  placeholder="e.g. Rahul Kumar Household"
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('v2.effectiveDate')}
                </label>
                <input
                  type="date"
                  value={splitEffectiveDate}
                  onChange={(e) => setSplitEffectiveDate(e.target.value)}
                  className="w-full text-xs rounded-lg border border-slate-300 p-2.5 font-mono focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setSplitModalOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={splitLoading}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50"
                >
                  {splitLoading ? t('common.loading') : t('v2.confirmSplit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseholdDetailPage;
