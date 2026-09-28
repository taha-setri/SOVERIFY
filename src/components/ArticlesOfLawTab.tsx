import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Scale, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  FileText, 
  Lock, 
  Server, 
  Cookie, 
  Building2, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Layers,
  FileCheck
} from 'lucide-react';
import { MOROCCAN_LAW_ARTICLES, LawArticle } from '../data/moroccanLawDatabase';
import { AuditReport, ComplianceGap, ComplianceWarning } from '../types';

interface ArticlesOfLawTabProps {
  lang: 'ar' | 'en';
  currentReport: AuditReport | null;
  selectedArticleId?: string | null;
  onNavigateToRemediation?: () => void;
}

export const ArticlesOfLawTab: React.FC<ArticlesOfLawTabProps> = ({
  lang,
  currentReport,
  selectedArticleId,
  onNavigateToRemediation
}) => {
  const isAr = lang === 'ar';
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterOnlyGaps, setFilterOnlyGaps] = useState<boolean>(false);
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>(selectedArticleId || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const articleRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Auto scroll and expand if selectedArticleId changes
  useEffect(() => {
    if (selectedArticleId) {
      setExpandedArticleId(selectedArticleId);
      // Small timeout to allow DOM update
      setTimeout(() => {
        const el = articleRefs.current[selectedArticleId];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [selectedArticleId]);

  // Match articles with current report's gaps and warnings
  const { matchedArticleIds, gapMap } = useMemo(() => {
    const matched = new Set<string>();
    const map = new Map<string, { gaps: ComplianceGap[]; warnings: ComplianceWarning[] }>();

    if (!currentReport) return { matchedArticleIds: matched, gapMap: map };

    MOROCCAN_LAW_ARTICLES.forEach((article) => {
      const relatedGaps: ComplianceGap[] = [];
      const relatedWarnings: ComplianceWarning[] = [];

      currentReport.gaps.forEach((gap) => {
        const gapText = `${gap.article} ${gap.title} ${gap.category} ${gap.id}`.toLowerCase();
        const matches = article.matchKeywords.some(kw => gapText.includes(kw.toLowerCase()));
        if (matches) {
          relatedGaps.push(gap);
          matched.add(article.id);
        }
      });

      currentReport.warnings.forEach((warn) => {
        const warnText = `${warn.article} ${warn.title} ${warn.category} ${warn.id}`.toLowerCase();
        const matches = article.matchKeywords.some(kw => warnText.includes(kw.toLowerCase()));
        if (matches) {
          relatedWarnings.push(warn);
          matched.add(article.id);
        }
      });

      if (relatedGaps.length > 0 || relatedWarnings.length > 0) {
        map.set(article.id, { gaps: relatedGaps, warnings: relatedWarnings });
      }
    });

    return { matchedArticleIds: matched, gapMap: map };
  }, [currentReport]);

  // Categories list
  const categories = [
    { id: 'all', labelEn: 'All Articles & Rules', labelAr: 'جميع المواد والمداولات' },
    { id: 'consent', labelEn: 'Prior Consent (Art. 3)', labelAr: 'الموافقة المسبقة (م. 3)' },
    { id: 'purpose', labelEn: 'Purpose & Retention (Art. 4)', labelAr: 'مشروعية الغايات (م. 4)' },
    { id: 'transparency', labelEn: 'CNDP Prior Notice (Art. 12)', labelAr: 'الإشعار ووصل CNDP (م. 12)' },
    { id: 'rights', labelEn: 'Citizen Rights (Arts. 13-15)', labelAr: 'حقوق المواطنين (م. 13-15)' },
    { id: 'security', labelEn: 'Security & TLS (Arts. 23-25)', labelAr: 'الأمن والتشفير (م. 23-25)' },
    { id: 'formalities', labelEn: 'Prior Formalities (Arts. 16-22)', labelAr: 'التصريح المسبق (م. 16-22)' },
    { id: 'transfer', labelEn: 'Cross-Border Cloud (Arts. 43-44)', labelAr: 'السيادة والتحويل (م. 43-44)' },
    { id: 'penalties', labelEn: 'Penalties & Fines (Arts. 52-56)', labelAr: 'العقوبات والغرامات (م. 52-56)' },
    { id: 'cookies', labelEn: 'Cookies & CMP (08-2020)', labelAr: 'الكوكيز والتتبع (08-2020)' }
  ];

  // Filtered list
  const filteredArticles = useMemo(() => {
    return MOROCCAN_LAW_ARTICLES.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Filter by current audit gaps
      if (filterOnlyGaps && !matchedArticleIds.has(item.id)) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const searchable = `
          ${item.number} ${item.numberAr} ${item.title} ${item.titleAr} 
          ${item.summary} ${item.summaryAr} ${item.legalTextFr} ${item.legalTextAr}
          ${item.chapterTitle} ${item.chapterTitleAr} ${item.matchKeywords.join(' ')}
        `.toLowerCase();
        return searchable.includes(q);
      }

      return true;
    });
  }, [selectedCategory, filterOnlyGaps, matchedArticleIds, searchQuery]);

  // Copy Legal Citation
  const handleCopyCitation = (article: LawArticle) => {
    const citation = isAr
      ? `السند القانوني: ${article.numberAr} من القانون رقم 08.09 (الظهير الشريف رقم 1.09.15) - ${article.titleAr}.\nالنص التشريعي: "${article.legalTextAr}"\nالمصدر: الجريدة الرسمية للمملكة المغربية / منصة SOVERIFY.`
      : `Référence Juridique: ${article.number} de la Loi n° 08-09 (Dahir n° 1-09-15) - ${article.title}.\nTexte Législatif: "${article.legalTextFr}"\nSource: Bulletin Officiel du Royaume du Maroc / Plateforme SOVERIFY.`;

    navigator.clipboard.writeText(citation);
    setCopiedId(article.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const toggleExpand = (id: string) => {
    setExpandedArticleId(expandedArticleId === id ? null : id);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-medium text-emerald-400">
              <Scale className="h-3.5 w-3.5" />
              <span>{isAr ? 'المرجع القانوني الرسمي • الظهير الشريف 1.09.15' : 'Official Legal Compendium • Dahir n° 1-09-15'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-serif">
              {isAr ? 'مدونة مواد القانون رقم 08.09 وقرارات CNDP' : 'Articles of Law Reference — Loi 08-09 & CNDP'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {isAr
                ? 'دليل استرشادي تفاعلي يتيح لمسؤولي المواقع، المطورين، ومفوضي حماية المعطيات (DPO) مراجعة النصوص القانونية الرسمية، متطلبات الامتثال التقني، والعقوبات الجنائية المنصوص عليها، وربطها المباشر بفجوات التدقيق المرصودة في المنصة.'
                : 'Comprehensive statutory repository enabling engineers, DPOs, and legal counsels to inspect Moroccan Law 08/09 statutory articles, technical requirements, criminal sanctions, and map them directly to detected website audit gaps.'}
            </p>
          </div>

          {/* Quick Info Badge */}
          <div className="shrink-0 rounded-xl border border-slate-800 bg-slate-950/60 p-4 font-mono text-xs space-y-1.5 text-slate-400 min-w-[220px]">
            <div className="flex items-center justify-between text-slate-300">
              <span>{isAr ? 'النطاق القانوني:' : 'Statute:'}</span>
              <span className="font-bold text-emerald-400">Loi n° 08-09</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>{isAr ? 'الهيئة الرقابية:' : 'Regulator:'}</span>
              <span className="font-bold text-slate-200">CNDP Rabat</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>{isAr ? 'المواد المفهرسة:' : 'Articles Indexed:'}</span>
              <span className="font-bold text-emerald-400">{MOROCCAN_LAW_ARTICLES.length}</span>
            </div>
            {currentReport && (
              <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-rose-300">
                <span>{isAr ? 'المواد المرتبطة بفحصك:' : 'Triggered by Report:'}</span>
                <span className="font-bold bg-rose-950/80 px-1.5 py-0.5 rounded text-rose-400 border border-rose-800/60">
                  {matchedArticleIds.size}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Interactive Search & Filter Controls */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:p-5 space-y-4 shadow-lg">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isAr
                  ? 'ابحث برقم المادة أو الكلمة (مثال: المادة 23، كوكيز، عقوبات، إشعار CNDP، تشفير، موافقة...)'
                  : 'Search by article number or concept (e.g. Article 23, consent, TLS, cookies, transfer, sanctions...)'
              }
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 ps-10 pe-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Report Gaps Filter Toggle (Prominent if active report exists) */}
          {currentReport && (
            <button
              onClick={() => setFilterOnlyGaps(!filterOnlyGaps)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition border ${
                filterOnlyGaps
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-md shadow-rose-950/40 ring-1 ring-rose-500/30'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
              }`}
            >
              <AlertTriangle className={`h-4 w-4 ${filterOnlyGaps ? 'text-rose-400' : 'text-slate-400'}`} />
              <span>
                {isAr
                  ? `تصفية بمخالفات تقريرك (${currentReport.domain})`
                  : `Filter by Report Gaps (${currentReport.domain})`}
              </span>
              <span className={`px-1.5 py-0.2 rounded font-mono text-[10px] ${
                filterOnlyGaps ? 'bg-rose-500 text-slate-950 font-bold' : 'bg-slate-700 text-slate-300'
              }`}>
                {matchedArticleIds.size}
              </span>
            </button>
          )}
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-medium">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 rounded-lg px-3 py-1.5 transition ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700/80 border border-slate-700/60'
                }`}
              >
                {isAr ? cat.labelAr : cat.labelEn}
              </button>
            );
          })}
        </div>

        {/* Quick Jump Bar by Article Number */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px] font-mono text-slate-400">
          <span className="shrink-0 text-slate-500 flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            <span>{isAr ? 'انتقال سريع:' : 'Quick Jump:'}</span>
          </span>
          {MOROCCAN_LAW_ARTICLES.map((art) => {
            const hasGap = matchedArticleIds.has(art.id);
            return (
              <button
                key={art.id}
                onClick={() => {
                  setExpandedArticleId(art.id);
                  const el = articleRefs.current[art.id];
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                className={`shrink-0 rounded px-2 py-0.5 transition border ${
                  hasGap 
                    ? 'bg-rose-950/60 border-rose-700/60 text-rose-300 hover:bg-rose-900/60 font-bold' 
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-emerald-400'
                }`}
              >
                {isAr ? art.numberAr : art.number}
                {hasGap && <span className="ms-1 text-[9px] text-rose-400">⚠️</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Filter Results Counter */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
        <div>
          <span>{isAr ? 'المواد المعروضة: ' : 'Showing: '}</span>
          <span className="font-bold text-emerald-400">{filteredArticles.length}</span>
          <span> {isAr ? 'من أصل ' : 'of '}{MOROCCAN_LAW_ARTICLES.length} {isAr ? 'مادة ومداولة' : 'statutory articles'}</span>
        </div>
        {filterOnlyGaps && currentReport && (
          <div className="text-rose-400 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            <span>{isAr ? `تصفية نشطة للمخالفات المرصودة في ${currentReport.domain}` : `Active gap filter for ${currentReport.domain}`}</span>
          </div>
        )}
      </div>

      {/* 4. Articles List */}
      <div className="space-y-4">
        {filteredArticles.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center space-y-3">
            <BookOpen className="h-10 w-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-white">
              {isAr ? 'لم يتم العثور على أي مادة مطابقة لبحثك' : 'No Law Articles Matched Your Search'}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {isAr
                ? 'جرب البحث بكلمات أخرى مثل "المادة 12"، "كوكيز"، "تشفير"، أو قم بإلغاء خيار التصفية.'
                : 'Try searching with other terms like "Article 12", "cookies", "TLS", or clear active filters.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setFilterOnlyGaps(false);
              }}
              className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-emerald-400 border border-slate-700 hover:bg-slate-700 transition"
            >
              {isAr ? 'إعادة ضبط عوامل البحث' : 'Reset All Filters'}
            </button>
          </div>
        ) : (
          filteredArticles.map((article) => {
            const isExpanded = expandedArticleId === article.id;
            const matches = gapMap.get(article.id);
            const hasGaps = matches && (matches.gaps.length > 0 || matches.warnings.length > 0);

            return (
              <div
                key={article.id}
                ref={(el) => { articleRefs.current[article.id] = el; }}
                id={article.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-lg ${
                  hasGaps
                    ? 'border-rose-900/70 bg-slate-900/90 shadow-rose-950/20'
                    : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                }`}
              >
                {/* Header Summary Row */}
                <div
                  onClick={() => toggleExpand(article.id)}
                  className="p-4 sm:p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none hover:bg-slate-850/40 transition"
                >
                  <div className="flex items-start gap-3.5">
                    {/* Number pill */}
                    <div className={`p-2.5 rounded-xl border font-mono font-bold text-xs shrink-0 ${
                      hasGaps
                        ? 'bg-rose-950/60 border-rose-700 text-rose-300'
                        : 'bg-slate-950 border-emerald-500/40 text-emerald-400'
                    }`}>
                      {isAr ? article.numberAr : article.number}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-white font-serif">
                          {isAr ? article.titleAr : article.title}
                        </h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                          {isAr ? article.chapterTitleAr : article.chapterTitle}
                        </span>
                        {hasGaps && currentReport && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                            <AlertTriangle className="h-3 w-3 text-rose-400" />
                            <span>
                              {isAr
                                ? `مخالفة مرصودة في ${currentReport.domain}`
                                : `Infraction Detected on ${currentReport.domain}`}
                            </span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans">
                        {isAr ? article.summaryAr : article.summary}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Expand Chevron */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyCitation(article);
                      }}
                      title={isAr ? 'نسخ السند القانوني الرسمي' : 'Copy Statutory Citation'}
                      className="p-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                    >
                      {copiedId === article.id ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      className="p-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
                      aria-label="Expand"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Detailed Section */}
                {isExpanded && (
                  <div className="border-t border-slate-800 bg-slate-950/60 p-4 sm:p-6 space-y-6 animate-fadeIn">
                    
                    {/* Active Gap Callout Box if this domain violates this article */}
                    {hasGaps && currentReport && matches && (
                      <div className="rounded-xl border border-rose-500/40 bg-rose-950/20 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                            <ShieldAlert className="h-4 w-4 text-rose-400" />
                            <span>
                              {isAr
                                ? `فجوة مطابقة نشطة في تقرير التدقيق (${currentReport.domain}):`
                                : `Active Compliance Violation on Scanned Target (${currentReport.domain}):`}
                            </span>
                          </div>
                          {onNavigateToRemediation && (
                            <button
                              onClick={onNavigateToRemediation}
                              className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 underline underline-offset-4"
                            >
                              <span>{isAr ? 'عرض الإجراء في خطة الـ 30 يوماً' : 'View in 30-Day Plan'}</span>
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          )}
                        </div>

                        {/* List associated gaps */}
                        <div className="space-y-2">
                          {matches.gaps.map((g) => (
                            <div key={g.id} className="p-3 bg-slate-900/90 rounded-lg border border-rose-900/60 text-xs space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-white">
                                  {isAr ? g.titleAr : g.title}
                                </span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-400 font-bold">
                                  {g.severity} (-{g.deduction} pts)
                                </span>
                              </div>
                              <p className="text-slate-400 text-[11px]">{g.impact}</p>
                              <div className="text-[11px] text-emerald-300 font-sans pt-1">
                                <span className="font-bold text-emerald-400">{isAr ? 'المطلوب: ' : 'Action: '}</span>
                                <span>{g.recommendation}</span>
                              </div>
                            </div>
                          ))}

                          {matches.warnings.map((w) => (
                            <div key={w.id} className="p-3 bg-slate-900/90 rounded-lg border border-amber-900/60 text-xs space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-amber-300">
                                  {isAr ? w.titleAr : w.title}
                                </span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-400 font-bold">
                                  WARNING (-{w.deduction} pts)
                                </span>
                              </div>
                              <p className="text-slate-400 text-[11px]">{w.impact}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Official Statutory Text (Authentic Arabic & French) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="h-3.5 w-3.5" />
                          <span>{isAr ? 'النص التشريعي الرسمي (الظهير الشريف 1.09.15)' : 'Authentic Statutory Text (Dahir n° 1-09-15)'}</span>
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">BO n° 5714</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Arabic text */}
                        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/90 text-slate-200 text-xs leading-relaxed font-sans" dir="rtl">
                          <span className="block font-bold text-slate-400 text-[10px] font-mono mb-1">الصيغة الرسمية بالعربية:</span>
                          <blockquote className="border-r-2 border-emerald-500 pe-2.5 italic">
                            "{article.legalTextAr}"
                          </blockquote>
                        </div>

                        {/* French text */}
                        <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/90 text-slate-200 text-xs leading-relaxed font-sans" dir="ltr">
                          <span className="block font-bold text-slate-400 text-[10px] font-mono mb-1">Version Officielle en Français:</span>
                          <blockquote className="border-l-2 border-emerald-500 ps-2.5 italic font-mono text-[11px]">
                            "{article.legalTextFr}"
                          </blockquote>
                        </div>
                      </div>
                    </div>

                    {/* DPO Practical Explanation & How Scanner Verifies It */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Practical explanation */}
                      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Layers className="h-3.5 w-3.5 text-emerald-400" />
                          <span>{isAr ? 'الشرح العملي لمسؤولي المواقع والـ DPO' : 'Practical DPO Compliance Interpretation'}</span>
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">
                          {isAr ? article.dpoExplanationAr : article.dpoExplanation}
                        </p>
                      </div>

                      {/* Scanner Audit criteria */}
                      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-2">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-teal-400" />
                          <span>{isAr ? 'كيف يتحقق فاحص SOVERIFY من هذه المادة' : 'Automated Telemetry & Testing Criteria'}</span>
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed font-sans">
                          {isAr ? article.auditRelevanceAr : article.auditRelevance}
                        </p>
                      </div>
                    </div>

                    {/* Remediation Action Steps */}
                    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-2.5">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 font-mono uppercase">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{isAr ? 'خطوات المعالجة والمطابقة الإلزامية' : 'Mandatory Engineering & Governance Checklist'}</span>
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        {(isAr ? article.remediationStepsAr : article.remediationSteps).map((step, idx) => (
                          <div key={idx} className="p-2.5 rounded-lg border border-slate-800 bg-slate-950/60 flex items-start gap-2">
                            <span className="font-mono text-emerald-400 font-bold shrink-0">{idx + 1}.</span>
                            <span className="text-slate-300 text-[11px] leading-relaxed">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Statutory Penalties & CNDP Forms row */}
                    <div className="flex flex-col sm:flex-row items-stretch gap-3 text-xs">
                      {/* Penalties */}
                      {article.penalties && (
                        <div className="flex-1 rounded-xl border border-rose-900/50 bg-rose-950/20 p-3.5 space-y-1">
                          <div className="flex items-center gap-1.5 text-rose-400 font-bold font-mono text-[11px]">
                            <ShieldAlert className="h-3.5 w-3.5" />
                            <span>{isAr ? 'العقوبات والمخاطر القضائية المقررة (الجرائم الجنائية):' : 'Statutory Sanctions & Penalties:'}</span>
                          </div>
                          <p className="text-rose-200/90 text-xs font-mono">
                            {isAr ? article.penaltiesAr : article.penalties}
                          </p>
                        </div>
                      )}

                      {/* CNDP Forms */}
                      {article.cndpForms && (
                        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-1 sm:min-w-[240px]">
                          <div className="flex items-center gap-1.5 text-slate-400 font-bold font-mono text-[11px]">
                            <Building2 className="h-3.5 w-3.5 text-emerald-400" />
                            <span>{isAr ? 'استمارات ومساطر CNDP ذات الصلة:' : 'Related CNDP Forms:'}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {article.cndpForms.map((form, fIdx) => (
                              <span key={fIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                                {form}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 text-xs">
                      <button
                        onClick={() => handleCopyCitation(article)}
                        className="flex items-center gap-1.5 text-slate-400 hover:text-white transition font-mono text-[11px]"
                      >
                        {copiedId === article.id ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">{isAr ? 'تم نسخ السند القانوني!' : 'Citation Copied to Clipboard!'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>{isAr ? 'نسخ السند القانوني للاستعمال في المذكرات' : 'Copy Formal Citation for Legal DPO Briefs'}</span>
                          </>
                        )}
                      </button>

                      {hasGaps && onNavigateToRemediation && (
                        <button
                          onClick={onNavigateToRemediation}
                          className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition shadow-md shadow-emerald-500/20"
                        >
                          <span>{isAr ? 'الانتقال إلى خطة المعالجة (30 يوماً)' : 'Go to 30-Day Remediation Plan'}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
