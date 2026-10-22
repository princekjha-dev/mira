import React from 'react';
import { useTranslation } from '../i18n/context';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { AuditEvent } from '../types';
import { Shield, RefreshCw } from 'lucide-react';

export const AuditTrailPage: React.FC = () => {
  const { t } = useTranslation();

  const { data: events, isLoading, refetch, isFetching } = useQuery<AuditEvent[]>({
    queryKey: ['audit-events'],
    queryFn: async () => {
      const res = await api.get<{ data: AuditEvent[] }>('/audit/events?limit=50');
      return res.data;
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              Auditor Oversight
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-2">
            {t('audit.title')}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {t('audit.subtitle')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center px-3.5 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-xs"
        >
          <RefreshCw className={`w-4 h-4 mr-2 text-slate-400 ${isFetching ? 'animate-spin' : ''}`} />
          {t('common.refresh')}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-slate-500">
            {t('common.loading')}
          </div>
        ) : !events || events.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            {t('audit.noEvents')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">{t('audit.eventType')}</th>
                  <th className="px-6 py-3">{t('audit.requestId')}</th>
                  <th className="px-6 py-3">{t('audit.timestamp')}</th>
                  <th className="px-6 py-3">{t('audit.details')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium bg-slate-100 text-slate-800 border border-slate-200">
                        {event.event_type}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap font-mono text-xs text-slate-600">
                      {event.request_id}
                    </td>
                    <td className="px-6 py-3.5 whitespace-nowrap text-xs text-slate-500">
                      {new Date(event.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-3.5 text-xs font-mono text-slate-600 max-w-xs truncate">
                      {JSON.stringify(event.details)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start space-x-2">
        <Shield className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
        <div>
          <span className="font-semibold text-slate-900">V1 Audit Foundation:</span> Security events (logins, logouts, failures, profile changes) capture correlation request IDs and actor IDs. In V2, the table schema is already prepared with <code className="bg-slate-200 px-1 py-0.5 rounded">previous_hash</code> and <code className="bg-slate-200 px-1 py-0.5 rounded">current_hash</code> to transition to a cryptographic tamper-evident merkle chain.
        </div>
      </div>
    </div>
  );
};
