import React, { useState, useEffect } from 'react';
import {
  Activity,
  RefreshCw,
  Search,
  Lock,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { ActivityLog } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { authFetch } from '../utils/auth';

export const ActivityLogView: React.FC = () => {
  const { language, t } = useLanguage();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await authFetch('/api/logs');
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        setLogs(data);
      }
    } catch (err) {
      console.error('Failed to fetch activity logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'security' && log.severity === 'security') ||
      (filter === 'alert' && log.severity === 'alert') ||
      (filter === 'journal' && log.action.includes('JOURNAL')) ||
      (filter === 'auth' && log.action.includes('AUTH'));

    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.userName.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                {t('auditTitle')}
              </h3>
              <p className="text-xs text-neutral-400">
                {t('auditSubtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={fetchLogs}
            disabled={loading}
            className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl border border-neutral-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            {t('auditRefreshBtn')}
          </button>
        </div>
      </div>

      {/* Controls: Segmented Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Interactive Segmented Filter */}
        <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-xl overflow-x-auto">
          {[
            { id: 'all', label: t('auditFilterAll') },
            { id: 'security', label: t('auditFilterSecurity') },
            { id: 'alert', label: t('auditFilterAlert') },
            { id: 'journal', label: t('auditFilterJournal') },
            { id: 'auth', label: t('auditFilterAuth') },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                filter === tab.id
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder={t('auditSearchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 w-full sm:w-60"
          />
        </div>
      </div>

      {/* Log Table / List */}
      <div className="rounded-2xl border border-neutral-800 overflow-hidden bg-neutral-900/60 shadow-inner">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-500">
            {t('auditEmptyLogs')}
          </div>
        ) : (
          <div className="divide-y divide-neutral-800">
            {filteredLogs.map((log) => {
              const isSecurity = log.severity === 'security';
              const isAlert = log.severity === 'alert';
              const isWarning = log.severity === 'warning';

              return (
                <div
                  key={log.id}
                  className="p-3.5 hover:bg-neutral-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isSecurity
                          ? 'bg-amber-500/20 text-amber-400'
                          : isAlert
                          ? 'bg-red-500/20 text-red-400'
                          : isWarning
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {isSecurity ? (
                        <Lock className="w-3.5 h-3.5" />
                      ) : isAlert ? (
                        <AlertTriangle className="w-3.5 h-3.5" />
                      ) : (
                        <Info className="w-3.5 h-3.5" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-white text-[11px]">
                          {log.action}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                            log.role === 'child'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : log.role === 'parent'
                              ? 'bg-purple-950 text-purple-400 border border-purple-800'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          {log.role === 'child' ? t('childRole') : log.role === 'parent' ? t('parentRole') : log.role}
                        </span>
                        <span className="text-neutral-300 font-medium">{log.userName}</span>
                      </div>
                      <p className="text-neutral-400 text-xs leading-relaxed">{log.details}</p>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between text-[11px] text-neutral-500 font-mono shrink-0 pl-10 md:pl-0">
                    <span>
                      {new Date(log.timestamp).toLocaleTimeString(
                        language === 'ja' ? 'ja-JP' : language === 'en' ? 'en-US' : 'id-ID',
                        {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        }
                      )}
                    </span>
                    <span className="text-[10px] text-neutral-600">IP: {log.ip}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
