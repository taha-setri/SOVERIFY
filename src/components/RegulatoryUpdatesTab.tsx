import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Search, 
  RefreshCw, 
  ExternalLink, 
  Calendar, 
  ShieldAlert, 
  Sparkles, 
  Filter, 
  ArrowUpRight, 
  Bot, 
  Scale, 
  AlertCircle, 
  CheckCircle2, 
  BookOpen, 
  Tag,
  SlidersHorizontal,
  Info,
  Layers
} from 'lucide-react';
import { RegulatoryUpdate, GroundingSource } from '../types';
import { fetchRegulatoryUpdates } from '../services/regulatoryService';
import { INITIAL_REGULATORY_UPDATES } from '../data/regulatoryUpdatesData';

interface RegulatoryUpdatesTabProps {
  lang: 'ar' | 'en';
  onNavigateToArticle?: (articleId?: string) => void;
  onConsultDpoWithTopic?: (topic: string) => void;
}

export const RegulatoryUpdatesTab: React.FC<RegulatoryUpdatesTabProps> = ({
  lang,
  onNavigateToArticle,
  onConsultDpoWithTopic
}) => {
  const isAr = lang === 'ar';

  const [updates, setUpdates] = useState<RegulatoryUpdate[]>(INITIAL_REGULATORY_UPDATES);
  const [sources, setSources] = useState<GroundingSource[]>([
    { title: 'CNDP - البوابة الرسمية للجنة الوطنية لمراقبة حماية المعطيات', uri: 'https://www.cndp.ma' },
    { title: 'الجريدة الرسمية للمملكة المغربية - الأمانة العامة للحكومة', uri: 'http://www.sgg.gov.ma' }
  ]);
  const [searchQueries, setSearchQueries] = useState<string[]>([
    'site:cndp.ma actualités 2026',
    'Maroc CNDP délibérations loi 08-09'
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLiveSearch, setIsLiveSearch] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleDateString());
  
  // Search & Filter state
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedImpact, setSelectedImpact] = useState<string>('ALL');
  const [activeQueryPreset, setActiveQueryPreset] = useState<string>('');

  const PRESET_QUERIES = [
    { id: 'all', labelAr: 'جميع المستجدات', labelEn: 'All Updates', query: '' },
    { id: 'reform', labelAr: 'إصلاح القانون 08.09', labelEn: 'Law 08-09 Reform', query: 'مشروع تعديل القانون 08-09 المغرب حماية المعطيات الشخصية' },
    { id: 'cookies', labelAr: 'مداولة الكوكيز 08-2020', labelEn: 'Cookies Deliberation', query: 'CNDP Maroc délibération 08-2020 cookies consentement' },
    { id: 'cloud', labelAr: 'السيادة السحابية والمادة 43', labelEn: 'Cloud Sovereignty', query: 'CNDP transfert données étranger cloud souveraineté article 43' },
    { id: 'ai', labelAr: 'الذكاء الاصطناعي والبيومتريا', labelEn: 'AI & Biometrics', query: 'CNDP Maroc reconnaissance faciale biométrie intelligence artificielle' },
    { id: 'sanctions', labelAr: 'العقوبات ومراقبة الشركات', labelEn: 'Sanctions & Audits', query: 'CNDP Maroc contrôles sanctions prospection directe télémarketing' }
  ];

  const loadUpdates = async (customQuery?: string) => {
    setIsLoading(true);
    try {
      const res = await fetchRegulatoryUpdates(customQuery);
      if (res && res.updates && res.updates.length > 0) {
        setUpdates(res.updates);
        if (res.sources && res.sources.length > 0) setSources(res.sources);
        if (res.searchQueries && res.searchQueries.length > 0) setSearchQueries(res.searchQueries);
        setIsLiveSearch(res.isLiveSearch);
        setLastUpdated(new Date(res.timestamp || Date.now()).toLocaleTimeString());
      }
    } catch (err) {
      console.error('Failed to load updates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch from server
    loadUpdates();
  }, []);

  const handlePresetSelect = (preset: typeof PRESET_QUERIES[0]) => {
    setActiveQueryPreset(preset.id);
    if (preset.query) {
      loadUpdates(preset.query);
    } else {
      loadUpdates();
    }
  };

  // Extract article number for navigation (e.g. "المادة 23" -> "art-23" or "23")
  const resolveArticleRef = (artStr: string): string => {
    const match = artStr.match(/\d+/);
    return match ? `art-${match[0]}` : 'art-1';
  };

  // Filtered list
  const filteredUpdates = updates.filter(item => {
    const matchesKeyword = 
      !searchFilter ||
      item.titleAr.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.titleEn.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.summaryAr.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.summaryEn.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.affectedArticles.some(a => a.toLowerCase().includes(searchFilter.toLowerCase()));

    const matchesCategory = 
      selectedCategory === 'ALL' ||
      item.category === selectedCategory ||
      item.categoryAr === selectedCategory;

    const matchesImpact = 
      selectedImpact === 'ALL' ||
      item.impactLevel === selectedImpact;

    return matchesKeyword && matchesCategory && matchesImpact;
  });

  const getImpactBadge = (level: RegulatoryUpdate['impactLevel']) => {
    switch (level) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
          dot: 'bg-rose-500',
          labelAr: 'حرج جداً - تدبير إلزامي',
          labelEn: 'Critical Mandatory'
        };
      case 'HIGH':
        return {
          bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          dot: 'bg-amber-500',
          labelAr: 'عالي الأهمية',
          labelEn: 'High Priority'
        };
      case 'MEDIUM':
        return {
          bg: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
          dot: 'bg-blue-500',
          labelAr: 'متوسط الأثر',
          labelEn: 'Moderate Impact'
        };
      default:
        return {
          bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          dot: 'bg-emerald-500',
          labelAr: 'إرشادي وتوجيهي',
          labelEn: 'Informational'
        };
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/60 px-2.5 py-1 text-xs font-mono font-bold text-emerald-300">
                <Globe className="h-3.5 w-3.5 text-emerald-400" />
                <span>{isAr ? 'مرصد CNDP والمستجدات القانونية' : 'CNDP Regulatory Observatory'}</span>
              </span>

              <div className="flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-950/40 px-2.5 py-1 text-xs font-mono text-blue-300">
                <Sparkles className="h-3.5 w-3.5 text-blue-400 animate-pulse" />
                <span>Google Search Grounding</span>
                {isLiveSearch && (
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping ml-1" />
                )}
              </div>

              <span className="text-[11px] text-slate-400 font-mono">
                {isAr ? `آخر مزامنة: ${lastUpdated}` : `Last sync: ${lastUpdated}`}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
              {isAr ? 'مستجدات وقرارات حماية المعطيات الشخصية بالمغرب' : 'Moroccan Data Privacy Law & CNDP Regulatory Updates'}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              {isAr
                ? 'متابعة حية ومفصلة لقرارات اللجنة الوطنية لمراقبة حماية المعطيات ذات الطابع الشخصي (CNDP)، ومشاريع تعديل القانون 08.09، والمذكرات الإلزامية الخاصة بالسيادة السحابية، ملفات الكوكيز، والذكاء الاصطناعي.'
                : 'Real-time intelligence on CNDP circulars, Law 08-09 modernization bills, cross-border cloud sovereignty directives, cookie consent rulings, and judicial sanctions.'}
            </p>
          </div>

          {/* Refresh via Google Search Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => loadUpdates(activeQueryPreset ? PRESET_QUERIES.find(p => p.id === activeQueryPreset)?.query : undefined)}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-950/40 transition disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 text-emerald-100 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? (isAr ? 'جاري البحث في مصادر الويب...' : 'Searching Web Sources...') : (isAr ? 'تحديث المستجدات الآن' : 'Fetch Latest Live News')}</span>
            </button>
          </div>
        </div>

        {/* Quick Topic Preset Chips */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Filter className="h-3 w-3 text-emerald-400" />
            <span>{isAr ? 'المواضيع الحيوية:' : 'Key Topics:'}</span>
          </span>
          {PRESET_QUERIES.map((preset) => {
            const isSelected = activeQueryPreset === preset.id || (!activeQueryPreset && preset.id === 'all');
            return (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset)}
                className={`rounded-lg px-3 py-1.5 transition font-mono text-[11px] ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/60'
                }`}
              >
                {isAr ? preset.labelAr : preset.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Google Search Grounding Transparency Card */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span className="font-bold text-slate-200 font-mono">
                {isAr ? 'استعلامات Google Search المستخدمة في التحقق:' : 'Google Search Grounding Queries Executed:'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {searchQueries.map((q, idx) => (
                <span key={idx} className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-mono text-slate-300 border border-slate-700/60">
                  "{q}"
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1 md:text-right">
            <span className="text-[11px] text-slate-400 font-mono block">
              {isAr ? 'المصادر والروابط المرجعية المؤكدة:' : 'Verified Grounding References:'}
            </span>
            <div className="flex flex-wrap gap-2 md:justify-end">
              {sources.map((src, idx) => (
                <a
                  key={idx}
                  href={src.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-mono text-emerald-300 hover:bg-emerald-900/60 transition"
                  title={src.title}
                >
                  <ExternalLink className="h-2.5 w-2.5 text-emerald-400" />
                  <span className="max-w-[140px] truncate">{src.title}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Text search input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder={isAr ? 'ابحث في نصوص المستجدات، المواد، أو الكلمات الدلالية...' : 'Filter updates by keyword, article, or topic...'}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
            />
          </div>

          {/* Impact filter */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedImpact}
              onChange={(e) => setSelectedImpact(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950/90 px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none font-mono"
            >
              <option value="ALL">{isAr ? 'جميع مستويات الأثر' : 'All Impact Levels'}</option>
              <option value="CRITICAL">{isAr ? 'حرج (إلزامي فوراً)' : 'Critical Only'}</option>
              <option value="HIGH">{isAr ? 'عالي الأهمية' : 'High Impact'}</option>
              <option value="MEDIUM">{isAr ? 'متوسط الأثر' : 'Medium Impact'}</option>
              <option value="INFO">{isAr ? 'إرشادي وتأهيلي' : 'Informational'}</option>
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/60 font-mono">
          <span>
            {isAr
              ? `عرض ${filteredUpdates.length} من أصل ${updates.length} مستجد تنظيمي`
              : `Showing ${filteredUpdates.length} of ${updates.length} regulatory updates`}
          </span>
          {filteredUpdates.some(u => u.impactLevel === 'CRITICAL') && (
            <span className="flex items-center gap-1 text-rose-400 font-bold">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>{isAr ? 'يتضمن إجراءات قانونية حرجة واجبة التنفيذ' : 'Includes Critical Mandatory Actions'}</span>
            </span>
          )}
        </div>
      </div>

      {/* Updates Cards List */}
      <div className="space-y-4">
        {filteredUpdates.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center">
            <AlertCircle className="h-10 w-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">
              {isAr ? 'لم يتم العثور على مستجدات مطابقة للبحث' : 'No updates match your current filter'}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {isAr ? 'جرب البحث بكلمات أخرى أو إعادة ضبط التصفية' : 'Try modifying keywords or clearing category filters'}
            </p>
            <button
              onClick={() => { setSearchFilter(''); setSelectedImpact('ALL'); setSelectedCategory('ALL'); }}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700"
            >
              {isAr ? 'إعادة ضبط التصفية' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          filteredUpdates.map((update) => {
            const badge = getImpactBadge(update.impactLevel);

            return (
              <div
                key={update.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 transition-all hover:border-slate-700 shadow-md space-y-4 relative group"
              >
                {/* Card Top Metadata */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[11px] font-mono font-bold ${badge.bg}`}>
                      <span className={`h-2 w-2 rounded-full ${badge.dot}`} />
                      <span>{isAr ? badge.labelAr : badge.labelEn}</span>
                    </span>

                    <span className="rounded-md border border-slate-700/60 bg-slate-800/70 px-2.5 py-1 text-[11px] font-mono text-slate-300">
                      {isAr ? update.categoryAr : update.category}
                    </span>

                    <span className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                      <Calendar className="h-3 w-3 text-slate-500" />
                      <span>{update.date}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {update.sourceUrl && (
                      <a
                        href={update.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 transition"
                        title={update.officialSource}
                      >
                        <span>{update.officialSource}</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Title & Summaries */}
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {isAr ? update.titleAr : update.titleEn}
                  </h3>
                  {isAr && update.titleEn && (
                    <p className="text-xs text-slate-400 font-mono">
                      {update.titleEn}
                    </p>
                  )}
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                    {isAr ? update.summaryAr : update.summaryEn}
                  </p>
                </div>

                {/* DPO Action Required Box */}
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{isAr ? 'الإجراء العملي الواجب على مسؤول حماية المعطيات (DPO):' : 'Mandatory Action for Data Protection Officer (DPO):'}</span>
                  </div>
                  <p className="text-xs text-slate-300 pl-6 leading-relaxed">
                    {isAr ? update.dpoActionRequiredAr : update.dpoActionRequiredEn}
                  </p>
                </div>

                {/* Affected Law Articles & Consultation Action */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Tag className="h-3 w-3 text-slate-500" />
                      <span>{isAr ? 'المواد المعنية:' : 'Affected Articles:'}</span>
                    </span>
                    {update.affectedArticles.map((art, idx) => (
                      <button
                        key={idx}
                        onClick={() => onNavigateToArticle?.(resolveArticleRef(art))}
                        title={isAr ? `الانتقال لمراجعة نص ${art}` : `Inspect ${art}`}
                        className="rounded-md border border-slate-700 bg-slate-800/80 px-2 py-0.5 text-[11px] font-mono text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-950/40 transition flex items-center gap-1"
                      >
                        <BookOpen className="h-2.5 w-2.5" />
                        <span>{art}</span>
                      </button>
                    ))}
                  </div>

                  {/* Consult DPO button with prefilled topic */}
                  {onConsultDpoWithTopic && (
                    <button
                      onClick={() => onConsultDpoWithTopic(isAr ? `أريد استشارة قانونية متخصصة حول: ${update.titleAr}. ما هي تداعياته على موقعنا وما هي الإجراءات المطلوبة؟` : `Legal consultation request regarding: ${update.titleEn}. How does this affect our organization and what compliance steps should we take?`)}
                      className="flex items-center gap-1.5 rounded-lg border border-blue-500/40 bg-blue-950/40 px-3 py-1.5 text-xs font-mono text-blue-300 hover:bg-blue-900/60 hover:text-white transition shadow-sm"
                    >
                      <Bot className="h-3.5 w-3.5 text-blue-400" />
                      <span>{isAr ? 'استشر DPO حول هذا المستجد' : 'Ask Gemini DPO Advisor'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
