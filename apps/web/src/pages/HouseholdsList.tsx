import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { Household } from '../types';
import { useTranslation } from '../i18n/context';
import {
  Clock,
  ArrowRight,
  Search,
  Network,
  AlertCircle,
} from 'lucide-react';

export const HouseholdsListPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryDate = searchParams.get('date') || '2026-10-22';
  const [dateInput, setDateInput] = useState(queryDate);

  const [households, setHouseholds] = useState<Household[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHouseholds() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get<{ data: Household[] }>('/households');
        setHouseholds(res.data);
      } catch (err: any) {
        setError(err?.message || 'Failed to fetch households');
      } finally {
        setLoading(false);
      }
    }
    fetchHouseholds();
  }, []);

  const handleDateChange = (newDate: string) => {
    setDateInput(newDate);
    setSearchParams({ date: newDate });
  };

  const filtered = households.filter(
    (h) =>
      h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.public_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{t('v2.households')}</h1>
          <p className="text-xs text-slate-500 mt-1">
            Logical administrative groupings of individuals and shared assets.
          </p>
        </div>

        {/* Time Travel Picker */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex items-center space-x-2 text-xs">
          <Clock className="w-4 h-4 text-amber-700" />
          <span className="font-semibold text-amber-900">{t('v2.viewAsOf')}:</span>
          <input
            type="date"
            value={dateInput}
            onChange={(e) => handleDateChange(e.target.value)}
            className="border border-amber-300 rounded px-2 py-0.5 text-xs bg-white text-slate-800 font-mono shadow-xs focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-3 bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          placeholder="Search by household name or ID (e.g. H001, Ramesh)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
        />
      </div>

      {loading ? (
        <div className="py-12 flex justify-center items-center text-slate-500 text-sm">
          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mr-3" />
          {t('common.loading')}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-800 text-xs">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
          No households found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((h) => (
            <div
              key={h.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-100">
                    {h.public_id}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {h.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-2.5">{h.name}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Administrative Household Unit
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/graph?type=household&id=${h.id}&date=${queryDate}`}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-purple-700 hover:text-purple-900"
                >
                  <Network className="w-3.5 h-3.5" />
                  <span>Graph</span>
                </Link>

                <Link
                  to={`/households/${h.id}?date=${queryDate}`}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HouseholdsListPage;
