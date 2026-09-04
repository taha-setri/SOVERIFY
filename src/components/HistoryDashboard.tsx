import React, { useState } from 'react';
import { ScanHistoryItem, UserAccount } from '../types';
import { History, TrendingUp, Calendar, ArrowRight, ShieldCheck, AlertTriangle, ExternalLink, RefreshCw, Cloud, CloudCheck, Trash2 } from 'lucide-react';

interface HistoryDashboardProps {
  history: ScanHistoryItem[];
  lang: 'ar' | 'en';
  currentUser: UserAccount | null;
  onSelectReport: (target: string) => void;
  onSyncCurrentToCloud?: () => void;
  onDeleteHistoryItem?: (id: string) => void;
}

export const HistoryDashboard: React.FC<HistoryDashboardProps> = ({
  history,
  lang,
  currentUser,
  onSelectReport,
  onSyncCurrentToCloud,
  onDeleteHistoryItem
}) => {
  const isAr = lang === 'ar';
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const uniqueTargets = ['All', ...Array.from(new Set(history.map((h) => h.target)))];

  const filteredHistory = history.filter((item) => {
    if (selectedFilter === 'All') return true;
    return item.target === selectedFilter;
  });

  // Calculate stats
  const averageScore = Math.round(
    filteredHistory.reduce((acc, h) => acc + h.score, 0) / (filteredHistory.length || 1)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 backdrop-blur shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                <History className="h-3.5 w-3.5" />
                <span>{isAr ? 'لوحة تتبع التقدم وتطور الامتثال' : 'Historical Audit Tracker & Evolution'}</span>
              </div>
              {currentUser?.uid ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-mono">
                  <Cloud className="h-3 w-3 text-teal-400" />
                  <span>{isAr ? 'مزامنة سحابية نشطة (Firebase Firestore)' : 'Firestore Cloud Sync Active'}</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 text-xs font-mono">
                  <span>{isAr ? 'تخزين محلي (سجل الدخول للمزامنة السحابية)' : 'Local Storage (Login for Cloud Sync)'}</span>
                </div>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isAr ? 'سجل الفحوصات ومؤشر تطور الامتثال' : 'Compliance History & Trend Evolution'}
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mt-1 leading-relaxed">
              {isAr
                ? 'استعراض التقارير السابقة ومتابعة سد الثغرات القانونية ومزامنتها عبر السحابة مع قاعدة بيانات Firestore.'
                : 'Monitor the historical trajectory of your domain compliance over consecutive auditing runs, synchronized via Firebase.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-center min-w-[130px]">
              <span className="text-xs font-mono text-slate-400 block">{isAr ? 'متوسط الدرجات' : 'Avg Score'}</span>
              <span className="text-2xl font-bold font-mono text-emerald-400">{averageScore}%</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-center min-w-[130px]">
              <span className="text-xs font-mono text-slate-400 block">{isAr ? 'إجمالي التقارير' : 'Total Audits'}</span>
              <span className="text-2xl font-bold font-mono text-white">{filteredHistory.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Evolution Trend Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span>{isAr ? 'مسار تطور النتيجة عبر الفحوصات المتتالية' : 'Score Evolution Timeline'}</span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {isAr ? 'كل عمود يمثل عملية تدقيق سابقة' : 'Chronological Audit Iterations'}
          </span>
        </div>

        <div className="h-44 w-full flex items-end gap-3 sm:gap-6 pt-6 pb-2 px-2 overflow-x-auto no-scrollbar">
          {filteredHistory.slice().reverse().map((item, idx) => (
            <div key={item.id || idx} className="flex-1 min-w-[48px] flex flex-col items-center gap-2 group">
              <span className="text-[11px] font-mono text-slate-300 opacity-0 group-hover:opacity-100 transition">
                {item.score}%
              </span>
              <div className="w-full bg-slate-950 rounded-t-lg h-32 flex items-end p-1 border border-slate-800">
                <div
                  className={`w-full rounded-t transition-all duration-500 ${
                    item.score >= 85
                      ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30'
                      : item.score >= 60
                      ? 'bg-amber-500 shadow-lg shadow-amber-500/30'
                      : 'bg-rose-500 shadow-lg shadow-rose-500/30'
                  }`}
                  style={{ height: `${item.score}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-slate-400 line-clamp-1 text-center">
                #{idx + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Chips & Cloud Sync Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {uniqueTargets.length > 2 ? (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-500 font-mono text-xs">{isAr ? 'تصفية حسب النطاق:' : 'Filter Domain:'}</span>
            {uniqueTargets.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedFilter(t)}
                className={`px-3 py-1 rounded-lg border font-mono transition text-xs shrink-0 ${
                  selectedFilter === t
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        ) : <div />}

        {onSyncCurrentToCloud && currentUser?.uid && (
          <button
            onClick={onSyncCurrentToCloud}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-500/40 bg-teal-950/40 text-teal-300 hover:bg-teal-900/60 font-mono text-xs transition"
          >
            <Cloud className="h-3.5 w-3.5" />
            <span>{isAr ? 'مزامنة التقرير النشط إلى السحابة' : 'Sync Active Report to Firestore'}</span>
          </button>
        )}
      </div>

      {/* History Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="p-4">{isAr ? 'الهدف / النطاق' : 'Target Domain'}</th>
                <th className="p-4">{isAr ? 'تاريخ التدقيق' : 'Audit Date'}</th>
                <th className="p-4">{isAr ? 'مؤشر الامتثال' : 'Score'}</th>
                <th className="p-4">{isAr ? 'الحالة' : 'Status'}</th>
                <th className="p-4">{isAr ? 'المخالفات والتحذيرات' : 'Gaps / Warnings'}</th>
                <th className="p-4 text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-sans">
              {filteredHistory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-mono font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>{item.target}</span>
                  </td>
                  <td className="p-4 font-mono text-slate-400 text-[11px]">{item.date}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded font-mono font-bold text-xs border ${
                        item.score >= 85
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : item.score >= 60
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      {item.score} / 100
                    </span>
                  </td>
                  <td className="p-4 text-slate-300 text-xs">{item.status}</td>
                  <td className="p-4 font-mono text-xs">
                    <span className="text-rose-400 font-bold">{item.gapsCount} {isAr ? 'مخالفات' : 'gaps'}</span>
                    <span className="text-slate-500 mx-1.5">•</span>
                    <span className="text-amber-400">{item.warningsCount} {isAr ? 'تحذيرات' : 'warnings'}</span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onSelectReport(item.target)}
                        className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-emerald-400 hover:bg-slate-700 hover:border-emerald-500/50 transition font-mono text-xs"
                      >
                        {isAr ? 'فتح التقرير' : 'Open'}
                      </button>
                      {onDeleteHistoryItem && (
                        <button
                          onClick={() => onDeleteHistoryItem(item.id)}
                          title={isAr ? 'حذف من السجل' : 'Delete'}
                          className="p-1.5 rounded-lg border border-slate-800 text-slate-500 hover:text-rose-400 hover:border-rose-900 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
