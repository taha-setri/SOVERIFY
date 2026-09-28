import React, { useState } from 'react';
import { ScanHistoryItem, UserAccount } from '../types';
import { History, TrendingUp, Calendar, ArrowRight, ShieldCheck, AlertTriangle, ExternalLink, RefreshCw, Cloud, CloudCheck, Trash2, Download, FileSpreadsheet } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ReferenceLine
} from 'recharts';
import { ComplianceScoreTooltip } from './ComplianceScoreTooltip';
import { ComplianceHeatmap } from './ComplianceHeatmap';

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

  // CSV Export handler with UTF-8 BOM for Arabic support
  const handleDownloadCsv = () => {
    if (filteredHistory.length === 0) return;

    const headers = [
      'Iteration ID',
      'Target Domain',
      'Organization / Business',
      'Audit Date',
      'Compliance Score',
      'Compliance Tier',
      'Legal Status',
      'Gaps Count',
      'Warnings Count'
    ];

    const rows = filteredHistory.map((item, idx) => {
      const tier = item.score >= 85 ? 'Compliant' : item.score >= 60 ? 'Advisory' : 'Critical Non-Compliance';
      return [
        `#${idx + 1} (${item.id})`,
        item.target,
        item.businessName || item.target.replace(/^www\./, '').split('.')[0],
        item.date,
        `${item.score}%`,
        tier,
        item.status,
        item.gapsCount,
        item.warningsCount
      ];
    });

    const csvContent =
      '\uFEFF' + // UTF-8 BOM
      [headers, ...rows]
        .map((row) =>
          row
            .map((val) => {
              const str = String(val ?? '');
              return `"${str.replace(/"/g, '""')}"`;
            })
            .join(',')
        )
        .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `soverify-cndp-audit-history-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Prepare chronological data for the Recharts line chart
  const chartData = [...filteredHistory]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((item, idx) => {
      const shortDate = item.date.split(' ')[0] || item.date;
      return {
        id: item.id || `hist-${idx}`,
        iteration: `#${idx + 1}`,
        date: shortDate,
        fullDate: item.date,
        target: item.target,
        score: item.score,
        status: item.status,
        gapsCount: item.gapsCount,
        warningsCount: item.warningsCount
      };
    });

  // Custom Tooltip for Recharts
  const CustomChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className="rounded-xl border border-emerald-500/40 bg-slate-950/95 p-3 shadow-2xl backdrop-blur-md text-xs font-mono space-y-1.5 min-w-[200px]"
          dir={isAr ? 'rtl' : 'ltr'}
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="text-slate-400">{data.iteration} • {data.date}</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                data.score >= 85
                  ? 'text-emerald-400 border-emerald-500/40 bg-emerald-950/60'
                  : data.score >= 60
                  ? 'text-amber-400 border-amber-500/40 bg-amber-950/60'
                  : 'text-rose-400 border-rose-500/40 bg-rose-950/60'
              }`}
            >
              {data.score} / 100
            </span>
          </div>
          <div className="text-white font-bold truncate max-w-[220px]">{data.target}</div>
          <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1">
            <span className="text-rose-400 font-bold">{data.gapsCount} {isAr ? 'مخالفات' : 'gaps'}</span>
            <span className="text-amber-400">{data.warningsCount} {isAr ? 'تحذيرات' : 'warnings'}</span>
          </div>
          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
            {data.score >= 85
              ? isAr ? 'ممتثل لمعايير CNDP' : 'Compliant under Law 08/09'
              : data.score >= 60
              ? isAr ? 'مخاطر إجرائية تستدعي التصحيح' : 'Procedural observations'
              : isAr ? 'مخالفة صريحة تستوجب التدخل' : 'Critical infractions detected'}
          </div>
        </div>
      );
    }
    return null;
  };

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
              <div className="flex items-center justify-center gap-1 text-xs font-mono text-slate-400 mb-0.5">
                <span>{isAr ? 'متوسط الدرجات' : 'Avg Score'}</span>
                <ComplianceScoreTooltip score={averageScore} lang={lang} size="sm" />
              </div>
              <span className="text-2xl font-bold font-mono text-emerald-400">{averageScore}%</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-center min-w-[130px]">
              <span className="text-xs font-mono text-slate-400 block mb-0.5">{isAr ? 'إجمالي التقارير' : 'Total Audits'}</span>
              <span className="text-2xl font-bold font-mono text-white">{filteredHistory.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Evolution Trend Line Chart using Recharts */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span>{isAr ? 'مسار تطور النتيجة عبر الزمن (Recharts Evolution Chart)' : 'Compliance Score Evolution Over Time (Recharts)'}</span>
            <ComplianceScoreTooltip score={averageScore} lang={lang} size="sm" />
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>≥85% {isAr ? 'مطابق' : 'Compliant'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span>&lt;60% {isAr ? 'مخاطر' : 'Risk'}</span>
            </span>
          </div>
        </div>

        {chartData.length === 0 ? (
          <div className="h-56 flex items-center justify-center text-slate-500 text-sm font-mono">
            {isAr ? 'لا توجد بيانات كافية لعرض الرسم البياني' : 'No audit history available for this domain.'}
          </div>
        ) : (
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 15, right: 30, left: -10, bottom: 5 }}>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" opacity={0.25} />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  dy={6}
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  stroke="#64748b"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  unit="%"
                />
                <RechartsTooltip content={<CustomChartTooltip />} />
                <ReferenceLine
                  y={85}
                  stroke="#10b981"
                  strokeDasharray="4 4"
                  label={{
                    value: isAr ? 'حد الامتثال (85%)' : 'Compliance (85%)',
                    fill: '#34d399',
                    fontSize: 10,
                    position: 'insideTopRight'
                  }}
                />
                <ReferenceLine
                  y={60}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  label={{
                    value: isAr ? 'عتبة الخطر (60%)' : 'Risk (60%)',
                    fill: '#fbbf24',
                    fontSize: 10,
                    position: 'insideTopRight'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#10b981', stroke: '#0f172a', strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: '#34d399', stroke: '#022c22', strokeWidth: 3 }}
                  animationDuration={800}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* 30-Day Activity & Compliance Heatmap */}
      <ComplianceHeatmap history={history} lang={lang} />

      {/* Filter Chips & Action Triggers (CSV Download & Cloud Sync) */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {uniqueTargets.length > 2 ? (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-500 font-mono text-xs">{isAr ? 'تصفية حسب النطاق:' : 'Filter Domain:'}</span>
            {uniqueTargets.map((t) => (
              <button
                key={t}
                onClick={() => setSelectedFilter(t)}
                className={`px-3 py-1 rounded-lg border font-mono transition text-xs shrink-0 cursor-pointer ${
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

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 font-mono text-xs transition cursor-pointer shadow-sm"
            title={isAr ? 'تصدير كامل السجل كملف Excel / CSV' : 'Export complete audit history to CSV'}
          >
            <Download className="h-3.5 w-3.5" />
            <span>{isAr ? 'تصدير السجل (CSV)' : 'Download CSV'}</span>
          </button>

          {onSyncCurrentToCloud && currentUser?.uid && (
            <button
              onClick={onSyncCurrentToCloud}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-500/40 bg-teal-950/40 text-teal-300 hover:bg-teal-900/60 font-mono text-xs transition cursor-pointer"
            >
              <Cloud className="h-3.5 w-3.5" />
              <span>{isAr ? 'مزامنة التقرير النشط إلى السحابة' : 'Sync Active Report to Firestore'}</span>
            </button>
          )}
        </div>
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
                    <div className="flex items-center gap-1.5">
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
                      <ComplianceScoreTooltip score={item.score} lang={lang} size="sm" />
                    </div>
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
                        className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-emerald-400 hover:bg-slate-700 hover:border-emerald-500/50 transition font-mono text-xs cursor-pointer"
                      >
                        {isAr ? 'فتح التقرير' : 'Open'}
                      </button>
                      {onDeleteHistoryItem && (
                        <button
                          onClick={() => onDeleteHistoryItem(item.id)}
                          title={isAr ? 'حذف من السجل' : 'Delete'}
                          className="p-1.5 rounded-lg border border-slate-800 text-slate-500 hover:text-rose-400 hover:border-rose-900 transition cursor-pointer"
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
