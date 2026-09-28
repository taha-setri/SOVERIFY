import React, { useState } from 'react';
import { ComplianceGap, SeverityLevel } from '../types';
import { 
  Grid, 
  AlertOctagon, 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  Scale, 
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';

interface ComplianceRiskMatrixProps {
  gaps: ComplianceGap[];
  lang: 'ar' | 'en';
  onViewArticle?: (articleId?: string) => void;
  onConsultDpo?: (topic?: string) => void;
}

const SEVERITY_CONFIG: Record<SeverityLevel, {
  labelEn: string;
  labelAr: string;
  bgBadge: string;
  border: string;
  textColor: string;
  countBg: string;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  CRITICAL: {
    labelEn: 'Critical',
    labelAr: 'حرج جداً',
    bgBadge: 'bg-red-500/10 text-red-400 border-red-500/30',
    border: 'border-red-500/40',
    textColor: 'text-red-400',
    countBg: 'bg-red-500 text-white',
    icon: AlertOctagon
  },
  HIGH: {
    labelEn: 'High',
    labelAr: 'مرتفع',
    bgBadge: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    border: 'border-rose-500/40',
    textColor: 'text-rose-300',
    countBg: 'bg-rose-500 text-white',
    icon: AlertTriangle
  },
  MEDIUM: {
    labelEn: 'Medium',
    labelAr: 'متوسط',
    bgBadge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    border: 'border-amber-500/30',
    textColor: 'text-amber-300',
    countBg: 'bg-amber-500 text-slate-950',
    icon: AlertCircle
  },
  LOW: {
    labelEn: 'Low',
    labelAr: 'منخفض',
    bgBadge: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
    border: 'border-sky-500/30',
    textColor: 'text-sky-300',
    countBg: 'bg-sky-500 text-slate-950',
    icon: Info
  }
};

const SEVERITY_ORDER: SeverityLevel[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

export const ComplianceRiskMatrix: React.FC<ComplianceRiskMatrixProps> = ({
  gaps,
  lang,
  onViewArticle,
  onConsultDpo
}) => {
  const isAr = lang === 'ar';
  const [selectedSeverity, setSelectedSeverity] = useState<SeverityLevel | 'ALL'>('ALL');
  const [selectedArticle, setSelectedArticle] = useState<string>('ALL');

  // Extract unique articles from gaps
  const uniqueArticles = Array.from(new Set(gaps.map(g => g.article))).sort();

  // Helper to normalize article for lookup
  const getArticleIdFromRef = (articleStr: string): string => {
    const cleaned = articleStr.replace(/[^0-9]/g, '');
    return cleaned ? `art-${cleaned}` : '';
  };

  // Filter gaps
  const filteredGaps = gaps.filter(g => {
    const matchesSev = selectedSeverity === 'ALL' || g.severity === selectedSeverity;
    const matchesArt = selectedArticle === 'ALL' || g.article === selectedArticle;
    return matchesSev && matchesArt;
  });

  // Calculate distribution by severity
  const severityCounts: Record<SeverityLevel, number> = {
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0
  };
  gaps.forEach(g => {
    if (severityCounts[g.severity] !== undefined) {
      severityCounts[g.severity]++;
    }
  });

  // Calculate distribution by article
  const articleMatrix: Record<string, Record<SeverityLevel, ComplianceGap[]>> = {};
  uniqueArticles.forEach(art => {
    articleMatrix[art] = {
      CRITICAL: [],
      HIGH: [],
      MEDIUM: [],
      LOW: []
    };
  });
  gaps.forEach(g => {
    if (articleMatrix[g.article]) {
      articleMatrix[g.article][g.severity].push(g);
    }
  });

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 sm:p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl border border-teal-500/30 bg-teal-500/10 text-teal-400">
            <Grid className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white font-mono">
                {isAr ? 'مصفوفة مخاطر الامتثال القانوني' : 'Compliance Risk Matrix'}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-teal-500/30 bg-teal-950/40 text-teal-300">
                Loi 08-09
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAr
                ? 'خريطة تفاعلية لتصنيف المخالفات والثغرات بحسب درجة الخطورة والمواد القانونية المنتهكة'
                : 'Interactive matrix mapping compliance gaps by severity levels and violated statutory articles'}
            </p>
          </div>
        </div>

        {/* Severity Summary Pills */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          <button
            onClick={() => setSelectedSeverity('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition ${
              selectedSeverity === 'ALL'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-slate-200 bg-slate-800/60'
            }`}
          >
            {isAr ? 'الكل' : 'All'} ({gaps.length})
          </button>
          {SEVERITY_ORDER.map(sev => {
            const cfg = SEVERITY_CONFIG[sev];
            const count = severityCounts[sev];
            const isSelected = selectedSeverity === sev;
            const Icon = cfg.icon;
            return (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(isSelected ? 'ALL' : sev)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition border ${
                  isSelected
                    ? `${cfg.border} bg-slate-800 ${cfg.textColor} ring-1 ring-white/20`
                    : `border-transparent bg-slate-950/60 text-slate-400 hover:text-white`
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{isAr ? cfg.labelAr : cfg.labelEn}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${cfg.countBg}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Matrix Filter & Article Selection */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-slate-400 font-mono">{isAr ? 'تصفية بالمادة القانونية:' : 'Filter by Article:'}</span>
          <select
            value={selectedArticle}
            onChange={(e) => setSelectedArticle(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:border-teal-500 focus:outline-none"
          >
            <option value="ALL">{isAr ? 'جميع المواد القانونية' : 'All Law Articles'}</option>
            {uniqueArticles.map(art => (
              <option key={art} value={art}>{art}</option>
            ))}
          </select>
        </div>

        <span className="text-slate-500 font-mono text-[11px]">
          {isAr ? `عرض ${filteredGaps.length} من أصل ${gaps.length} فجوة` : `Showing ${filteredGaps.length} of ${gaps.length} gaps`}
        </span>
      </div>

      {/* Visual Heat Grid of Articles vs Severity */}
      {uniqueArticles.length > 0 && selectedArticle === 'ALL' && (
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                <th className={`py-2 px-3 ${isAr ? 'text-right' : 'text-left'}`}>
                  {isAr ? 'المادة القانونية' : 'Law Article'}
                </th>
                {SEVERITY_ORDER.map(sev => (
                  <th key={sev} className="py-2 px-3 text-center">
                    {isAr ? SEVERITY_CONFIG[sev].labelAr : SEVERITY_CONFIG[sev].labelEn}
                  </th>
                ))}
                <th className="py-2 px-3 text-center">{isAr ? 'الإجراء' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {uniqueArticles.map(art => {
                const row = articleMatrix[art];
                const totalInRow = SEVERITY_ORDER.reduce((acc, sev) => acc + (row ? row[sev].length : 0), 0);
                if (totalInRow === 0) return null;

                return (
                  <tr key={art} className="hover:bg-slate-900/50 transition">
                    <td className={`py-2.5 px-3 font-bold text-slate-200 ${isAr ? 'text-right font-sans' : 'text-left'}`}>
                      <div className="flex items-center gap-2">
                        <Scale className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                        <span>{art}</span>
                      </div>
                    </td>
                    {SEVERITY_ORDER.map(sev => {
                      const count = row ? row[sev].length : 0;
                      const cfg = SEVERITY_CONFIG[sev];
                      return (
                        <td key={sev} className="py-2.5 px-3 text-center">
                          {count > 0 ? (
                            <button
                              onClick={() => {
                                setSelectedArticle(art);
                                setSelectedSeverity(sev);
                              }}
                              className={`inline-flex items-center justify-center h-6 min-w-[24px] px-1.5 rounded-md font-bold text-[11px] ${cfg.countBg} hover:opacity-80 transition cursor-pointer shadow-sm`}
                              title={`${count} ${sev} gaps in ${art}`}
                            >
                              {count}
                            </button>
                          ) : (
                            <span className="text-slate-700 font-normal">-</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="py-2.5 px-3 text-center">
                      {onViewArticle && (
                        <button
                          onClick={() => onViewArticle(getArticleIdFromRef(art))}
                          className="p-1 rounded hover:bg-slate-800 text-teal-400 hover:text-teal-300 transition"
                          title={isAr ? 'عرض نص المادة القانونية ↗' : 'Inspect Article Reference ↗'}
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Filtered Gaps Cards List */}
      <div className="space-y-3">
        {filteredGaps.length === 0 ? (
          <div className="text-center py-8 rounded-xl border border-slate-800/80 bg-slate-950/40 text-slate-500 text-xs">
            {isAr ? 'لا توجد فجوات مطابقة لمعايير التصفية المحددة' : 'No compliance gaps match the selected filters.'}
          </div>
        ) : (
          filteredGaps.map(gap => {
            const cfg = SEVERITY_CONFIG[gap.severity] || SEVERITY_CONFIG.MEDIUM;
            const Icon = cfg.icon;

            return (
              <div
                key={gap.id}
                className={`rounded-xl border ${cfg.border} bg-slate-950/60 p-4 transition hover:bg-slate-950/90 space-y-2`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-mono font-bold ${cfg.bgBadge}`}>
                      <Icon className="h-3 w-3" />
                      <span>{isAr ? cfg.labelAr : cfg.labelEn}</span>
                    </span>
                    <span className="rounded-md border border-slate-800 bg-slate-900 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                      {gap.article}
                    </span>
                    <span className="rounded-md border border-slate-800 bg-slate-900 px-2 py-0.5 text-[10px] font-mono text-slate-400">
                      {gap.category}
                    </span>
                  </div>

                  {gap.penaltyEstimate && (
                    <span className="text-[11px] font-mono text-rose-400 bg-rose-950/40 border border-rose-500/30 px-2 py-0.5 rounded">
                      {gap.penaltyEstimate}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                    {isAr ? gap.titleAr : gap.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {gap.impact}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
                  <div className="text-[11px] text-emerald-400 font-mono">
                    <span className="font-bold">{isAr ? 'الإجراء التصحيحي: ' : 'Fix: '}</span>
                    <span className="text-slate-300">{gap.recommendation}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {onViewArticle && (
                      <button
                        onClick={() => onViewArticle(getArticleIdFromRef(gap.article))}
                        className="text-[10px] font-mono text-teal-400 hover:text-teal-300 flex items-center gap-1 transition"
                      >
                        <Scale className="h-3 w-3" />
                        <span>{isAr ? 'نص المادة' : 'Law text'}</span>
                      </button>
                    )}
                    {onConsultDpo && (
                      <button
                        onClick={() => onConsultDpo(`استشارة حول المخالفة: ${gap.titleAr} (${gap.article})`)}
                        className="text-[10px] font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1 transition"
                      >
                        <span>{isAr ? 'استشر DPO' : 'Ask DPO'}</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
