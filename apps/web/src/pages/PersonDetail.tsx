import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import {
  Person,
  PersonRelationship,
  HouseholdMembership,
  PropertyAssociation,
  Benefit,
} from '../types';
import { useTranslation } from '../i18n/context';
import {
  User,
  Clock,
  Home,
  Users,
  Building,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Network,
  FileText,
  Award,
} from 'lucide-react';

export const PersonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryDate = searchParams.get('date') || '2026-10-22';
  const [dateInput, setDateInput] = useState(queryDate);

  const [person, setPerson] = useState<Person | null>(null);
  const [relationships, setRelationships] = useState<PersonRelationship[]>([]);
  const [memberships, setMemberships] = useState<HouseholdMembership[]>([]);
  const [properties, setProperties] = useState<PropertyAssociation[]>([]);
  const [benefits, setBenefits] = useState<Benefit[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'relationships' | 'households' | 'properties' | 'benefits' | 'timeline'>('overview');

  useEffect(() => {
    async function fetchPersonDetails() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const [personRes, relRes, memRes, propRes, benRes] = await Promise.all([
          api.get<{ data: Person }>(`/persons/${id}`),
          api.get<{ data: PersonRelationship[] }>(`/persons/${id}/relationships?date=${queryDate}`),
          api.get<{ data: HouseholdMembership[] }>(`/persons/${id}/households?date=${queryDate}`),
          api.get<{ data: PropertyAssociation[] }>(`/persons/${id}/properties?date=${queryDate}`).catch(() => ({ data: [] })),
          api.get<any>(`/persons/${id}/benefits`).catch(() => []),
        ]);

        setPerson(personRes.data);
        setRelationships(relRes.data);
        setMemberships(memRes.data);
        setProperties(propRes.data);
        setBenefits(Array.isArray(benRes) ? benRes : benRes?.data || []);
      } catch (err: any) {
        setError(err?.message || 'Failed to load person details');
      } finally {
        setLoading(false);
      }
    }

    fetchPersonDetails();
  }, [id, queryDate]);

  const handleDateChange = (newDate: string) => {
    setDateInput(newDate);
    setSearchParams({ date: newDate });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center items-center">
        <div className="flex items-center space-x-3 text-slate-500">
          <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-lg mx-auto">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-red-900">{t('common.error')}</h2>
          <p className="text-sm text-red-700 mt-1">{error || 'Person record not found'}</p>
          <Link
            to="/persons"
            className="mt-4 inline-flex items-center text-xs font-semibold text-red-800 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to Persons
          </Link>
        </div>
      </div>
    );
  }

  const isDeceased = person.status === 'DECEASED';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/persons"
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          {t('v2.persons')}
        </Link>
        <Link
          to={`/graph?type=person&id=${person.id}&date=${queryDate}`}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg text-xs font-semibold transition-colors"
        >
          <Network className="w-4 h-4" />
          <span>View in Family Graph</span>
        </Link>
      </div>

      {/* Hero Profile Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-xs ${
              isDeceased ? 'bg-slate-200 text-slate-600' : 'bg-purple-600 text-white'
            }`}
          >
            <User className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {person.first_name} {person.middle_name ? person.middle_name + ' ' : ''}
                {person.last_name}
              </h1>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  person.status === 'ACTIVE'
                    ? 'bg-emerald-100 text-emerald-800'
                    : isDeceased
                    ? 'bg-slate-200 text-slate-700'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {person.status}
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                {person.public_id}
              </span>
              <span>•</span>
              <span>{person.gender}</span>
              {person.date_of_birth && (
                <>
                  <span>•</span>
                  <span>DOB: {person.date_of_birth}</span>
                </>
              )}
              {person.identity_type && (
                <>
                  <span>•</span>
                  <span>
                    Synthetic ID: {person.identity_type} (***{person.identity_last4})
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Temporal State Control */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
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
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-4">
        {[
          { key: 'overview', label: 'Overview', icon: FileText },
          { key: 'relationships', label: `${t('v2.relationships')} (${relationships.length})`, icon: Users },
          { key: 'households', label: `${t('v2.households')} (${memberships.length})`, icon: Home },
          { key: 'properties', label: `${t('v2.properties')} (${properties.length})`, icon: Building },
          { key: 'benefits', label: `${t('v3.benefits')} (${benefits.length})`, icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`pb-3 px-1 text-sm font-semibold flex items-center space-x-2 border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-purple-600 text-purple-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Individual Identity
              </h3>
              <dl className="grid grid-cols-2 gap-y-3 text-xs">
                <dt className="text-slate-500">{t('v2.publicId')}</dt>
                <dd className="font-mono font-medium text-slate-800">{person.public_id}</dd>

                <dt className="text-slate-500">{t('v2.status')}</dt>
                <dd className="font-medium text-slate-800">{person.status}</dd>

                <dt className="text-slate-500">{t('v2.gender')}</dt>
                <dd className="font-medium text-slate-800">{person.gender}</dd>

                <dt className="text-slate-500">{t('v2.dob')}</dt>
                <dd className="font-mono text-slate-800">{person.date_of_birth || 'Not recorded'}</dd>

                <dt className="text-slate-500">Contact Phone</dt>
                <dd className="font-mono text-slate-800">{person.phone || 'Synthetic / None'}</dd>

                <dt className="text-slate-500">Contact Email</dt>
                <dd className="font-mono text-slate-800">{person.email || 'None'}</dd>
              </dl>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Provenance & Data Integrity
              </h3>
              <div className="text-xs space-y-3">
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <span className="text-slate-500 block mb-1">Source Provenance:</span>
                  <span className="font-semibold text-slate-800">
                    Synthetic Civic Register (Section 42 Demo Seed)
                  </span>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <span className="text-slate-500 block mb-1">Preservation Policy:</span>
                  <span className="text-slate-700">
                    Records are append-only. Historical memberships and relationships are immutable
                    and remain queryable across temporal ranges.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RELATIONSHIPS TAB */}
        {activeTab === 'relationships' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800">
                Verifiable Family Relationships (As of {queryDate})
              </h3>
              <span className="text-xs text-slate-500">Separated from Household Membership</span>
            </div>
            {relationships.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                {t('v2.emptyRelationships')}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {relationships.map((rel) => (
                  <div key={rel.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/persons/${rel.person_b_id}`}
                            className="text-sm font-bold text-slate-900 hover:text-purple-600 hover:underline"
                          >
                            {rel.person_b_name || 'Relative'}
                          </Link>
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800">
                            {rel.relationship_type}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          <span>Public ID: {rel.person_b_public_id || 'P-XXXX'}</span>
                          <span className="mx-1">•</span>
                          <span>
                            Valid: {rel.valid_from} → {rel.valid_to || 'Present'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-xs font-semibold text-emerald-700">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{rel.verification_status}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          Confidence: {rel.confidence}
                        </div>
                      </div>
                      <Link
                        to={`/persons/${rel.person_b_id}`}
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
        )}

        {/* HOUSEHOLDS TAB */}
        {activeTab === 'households' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-800">
                Household Memberships Across Time
              </h3>
              <span className="text-xs text-slate-500">Query Date: {queryDate}</span>
            </div>
            {memberships.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">{t('v2.emptyMembers')}</div>
            ) : (
              <div className="divide-y divide-slate-100">
                {memberships.map((mem) => {
                  const isCurrentForDate =
                    mem.valid_from <= queryDate && (!mem.valid_to || mem.valid_to >= queryDate);
                  return (
                    <div
                      key={mem.id}
                      className={`p-4 flex items-center justify-between transition-colors ${
                        isCurrentForDate ? 'bg-emerald-50/40 hover:bg-emerald-50/70' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                          <Home className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <Link
                              to={`/households/${mem.household_id}`}
                              className="text-sm font-bold text-slate-900 hover:text-emerald-700 hover:underline"
                            >
                              {mem.household_name || 'Household'}
                            </Link>
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                              {mem.membership_role}
                            </span>
                            {isCurrentForDate && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                                Active on {queryDate}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5 font-mono">
                            Valid: {mem.valid_from} → {mem.valid_to || 'Present'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <span className="text-xs font-semibold text-slate-700">
                            {mem.verification_status}
                          </span>
                          <div className="text-[11px] text-slate-400">
                            Confidence: {mem.confidence}
                          </div>
                        </div>
                        <Link
                          to={`/households/${mem.household_id}`}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* PROPERTIES TAB */}
        {activeTab === 'properties' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-800">
                Associated Properties & Infrastructure
              </h3>
            </div>
            {properties.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                {t('v2.emptyProperties')}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {properties.map((prop) => (
                  <div key={prop.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                        <Building className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-slate-900">
                            {prop.address_line || 'Civic Property'}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-800">
                            {prop.association_type}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          <span>{prop.district}</span>
                          <span className="mx-1">•</span>
                          <span>
                            Valid: {prop.valid_from} → {prop.valid_to || 'Present'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-emerald-700">
                      {prop.verification_status}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BENEFITS TAB (V3 Intelligence) */}
        {activeTab === 'benefits' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Entitlement & Benefit History
              </h3>
              <span className="text-xs text-slate-500">
                Scope-differentiated benefits linked to this individual
              </span>
            </div>

            {benefits.length === 0 ? (
              <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500 text-sm">
                No benefits on record for this individual.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {benefits.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center space-x-2 mb-1.5">
                        <span className="font-mono text-xs font-bold text-slate-400">
                          {b.public_id}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            b.benefit_unit_type === 'PERSON'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : b.benefit_unit_type === 'HOUSEHOLD'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {b.benefit_unit_type === 'PERSON'
                            ? 'INDIVIDUAL BENEFIT'
                            : b.benefit_unit_type === 'HOUSEHOLD'
                            ? 'HOUSEHOLD BENEFIT'
                            : 'PROPERTY BENEFIT'}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                          {b.status}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900">
                        {b.scheme_name || b.scheme_code}
                      </h4>

                      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span>
                          <strong>Value / Asset:</strong>{' '}
                          {b.amount
                            ? `₹${b.amount.toLocaleString('en-IN')}`
                            : `${b.quantity || 1} ${b.unit || 'Unit'} (${b.description || 'Asset'})`}
                        </span>
                        {b.disbursed_at && (
                          <span>
                            <strong>Disbursed:</strong>{' '}
                            {new Date(b.disbursed_at).toLocaleDateString()}
                          </span>
                        )}
                        {b.household_public_id && (
                          <span>
                            <strong>Household:</strong> {b.household_public_id}
                          </span>
                        )}
                        {b.source_name && (
                          <span>
                            <strong>Source:</strong> {b.source_name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0">
                      <Link
                        to="/benefits"
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                      >
                        Inspect in Ledger →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonDetailPage;
