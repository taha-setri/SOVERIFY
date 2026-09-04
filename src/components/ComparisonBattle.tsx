import React, { useState } from 'react';
import { AuditReport, ComparisonResult } from '../types';
import { runComplianceScan } from '../services/complianceScanner';
import { Scale, Trophy, ArrowRight, ShieldCheck, AlertTriangle, Cookie, Server, CheckCircle2, XCircle } from 'lucide-react';

interface ComparisonBattleProps {
  lang: 'ar' | 'en';
}

export const ComparisonBattle: React.FC<ComparisonBattleProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const [urlA, setUrlA] = useState('banque-populaire-demo.ma');
  const [urlB, setUrlB] = useState('e-commerce-maroc-store.ma');
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  const handleCompare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlA.trim() || !urlB.trim()) return;

    setIsComparing(true);
    setTimeout(() => {
      const repA = runComplianceScan(urlA.trim());
      const repB = runComplianceScan(urlB.trim());

      const winner = repA.score > repB.score ? 'A' : repB.score > repA.score ? 'B' : 'Tie';
      const scoreDiff = Math.abs(repA.score - repB.score);

      const winningDomain = winner === 'A' ? repA.domain : repB.domain;
      const recAr =
        winner === 'Tie'
          ? 'كلا الموقعين حققا نفس الدرجة في الامتثال لمقتضيات القانون رقم 08-09.'
          : `يتفوق موقع (${winningDomain}) بفارق ${scoreDiff} نقطة، مبرزاً التزاماً أعلى بالضوابط التنظيمية للجنة CNDP وتشفير البيانات.`;

      const recEn =
        winner === 'Tie'
          ? 'Both sites achieved identical compliance ratings under Law 08/09.'
          : `Site (${winningDomain}) demonstrates superior compliance with a lead of +${scoreDiff} points over its competitor.`;

      setComparisonResult({
        siteA: repA,
        siteB: repB,
        winner,
        scoreDifference: scoreDiff,
        recommendation: recEn,
        recommendationAr: recAr
      });
      setIsComparing(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 backdrop-blur shadow-2xl space-y-4">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <Scale className="h-3.5 w-3.5" />
          <span>{isAr ? 'مقارنة الامتثال الرأسي بين موقعين' : 'Head-to-Head Compliance Comparison'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          {isAr ? 'أداة مقارنة الامتثال الرقمي (Compliance Battle)' : 'Compliance Comparison Arena'}
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          {isAr
            ? 'قارن بين موقعين أو علامتين تجاريتين لمعرفة أي منهما أكثر احتراماً للسيادة الرقمية المغربية، مداولات CNDP، وحقوق المعنيين بالأمر.'
            : 'Evaluate two target URLs side-by-side to determine which platform offers superior data privacy protections under Moroccan Law 08/09.'}
        </p>

        {/* Input Form */}
        <form onSubmit={handleCompare} className="pt-2 grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5">
            <label className="block text-xs font-mono text-slate-400 mb-1">
              {isAr ? 'الموقع الأول (Target A)' : 'Target Website A'}
            </label>
            <input
              type="text"
              value={urlA}
              onChange={(e) => setUrlA(e.target.value)}
              placeholder="https://site-a.ma"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white font-mono outline-none focus:border-emerald-500"
            />
          </div>

          <div className="md:col-span-2 flex items-end justify-center pb-1">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl">
              VS
            </span>
          </div>

          <div className="md:col-span-5">
            <label className="block text-xs font-mono text-slate-400 mb-1">
              {isAr ? 'الموقع الثاني (Target B)' : 'Target Website B'}
            </label>
            <input
              type="text"
              value={urlB}
              onChange={(e) => setUrlB(e.target.value)}
              placeholder="https://site-b.ma"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white font-mono outline-none focus:border-emerald-500"
            />
          </div>

          <div className="md:col-span-12 pt-2">
            <button
              type="submit"
              disabled={isComparing}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 py-3 text-sm font-bold text-slate-950 hover:from-emerald-400 hover:to-teal-300 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {isComparing ? (isAr ? 'جاري التدقيق والمقارنة...' : 'Comparing Sites...') : (isAr ? 'بدء فحص المقارنة الفوري' : 'Launch Compliance Comparison')}
            </button>
          </div>
        </form>
      </div>

      {/* Comparison Results Area */}
      {comparisonResult && (
        <div className="space-y-6">
          {/* Winner Recommendation Banner */}
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold">
                {isAr ? 'خلاصة المقارنة القانونية' : 'Comparison Audit Verdict'}
              </span>
              <h4 className="text-base font-bold text-white mt-0.5">
                {isAr ? comparisonResult.recommendationAr : comparisonResult.recommendation}
              </h4>
            </div>
          </div>

          {/* Head-to-Head Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Site A Card */}
            <div
              className={`rounded-2xl border p-6 space-y-4 ${
                comparisonResult.winner === 'A'
                  ? 'border-emerald-500/80 bg-slate-900/90 shadow-2xl ring-1 ring-emerald-500/40'
                  : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-mono text-slate-400">Target A</span>
                  <h3 className="text-lg font-bold text-white font-mono">{comparisonResult.siteA.domain}</h3>
                </div>
                {comparisonResult.winner === 'A' && (
                  <span className="bg-emerald-500 text-slate-950 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                    <Trophy className="h-3 w-3" />
                    <span>{isAr ? 'الأكثر امتثالاً' : 'Winner'}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-xs text-slate-400">{isAr ? 'مؤشر الامتثال الكلي' : 'Compliance Index'}</span>
                <span className="text-4xl font-extrabold font-mono text-emerald-400">
                  {comparisonResult.siteA.score}<span className="text-xs text-slate-500">/100</span>
                </span>
              </div>

              {/* Metric rows */}
              <div className="space-y-2.5 text-xs font-mono border-t border-slate-800 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{isAr ? 'المخالفات وفجوات الامتثال' : 'Critical Gaps'}</span>
                  <span className="text-rose-400 font-bold">{comparisonResult.siteA.gaps.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{isAr ? 'التحذيرات الفنية' : 'Advisory Warnings'}</span>
                  <span className="text-amber-400 font-bold">{comparisonResult.siteA.warnings.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{isAr ? 'مرجع إشعار CNDP' : 'CNDP Authorization'}</span>
                  <span className={comparisonResult.siteA.metrics.cndpDeclarationFound ? 'text-emerald-400' : 'text-rose-400'}>
                    {comparisonResult.siteA.metrics.cndpDeclarationFound ? (isAr ? 'مُشهر ومطابق' : 'Verified') : (isAr ? 'غير معلن' : 'Missing')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{isAr ? 'ملفات التتبع الإعلاني' : 'Marketing Trackers'}</span>
                  <span className="text-slate-200">{comparisonResult.siteA.cookies.filter(c => c.category === 'Marketing').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{isAr ? 'السيادة السحابية (المادة 43)' : 'Sovereignty'}</span>
                  <span className={comparisonResult.siteA.sovereigntyStatus.isMoroccanHosting ? 'text-emerald-400' : 'text-amber-400'}>
                    {comparisonResult.siteA.sovereigntyStatus.isMoroccanHosting ? (isAr ? 'استضافة وطنية' : 'Morocco') : (isAr ? 'سحابة أجنبية' : 'Foreign')}
                  </span>
                </div>
              </div>
            </div>

            {/* Site B Card */}
            <div
              className={`rounded-2xl border p-6 space-y-4 ${
                comparisonResult.winner === 'B'
                  ? 'border-emerald-500/80 bg-slate-900/90 shadow-2xl ring-1 ring-emerald-500/40'
                  : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-mono text-slate-400">Target B</span>
                  <h3 className="text-lg font-bold text-white font-mono">{comparisonResult.siteB.domain}</h3>
                </div>
                {comparisonResult.winner === 'B' && (
                  <span className="bg-emerald-500 text-slate-950 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                    <Trophy className="h-3 w-3" />
                    <span>{isAr ? 'الأكثر امتثالاً' : 'Winner'}</span>
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-xs text-slate-400">{isAr ? 'مؤشر الامتثال الكلي' : 'Compliance Index'}</span>
                <span className="text-4xl font-extrabold font-mono text-emerald-400">
                  {comparisonResult.siteB.score}<span className="text-xs text-slate-500">/100</span>
                </span>
              </div>

              {/* Metric rows */}
              <div className="space-y-2.5 text-xs font-mono border-t border-slate-800 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{isAr ? 'المخالفات وفجوات الامتثال' : 'Critical Gaps'}</span>
                  <span className="text-rose-400 font-bold">{comparisonResult.siteB.gaps.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{isAr ? 'التحذيرات الفنية' : 'Advisory Warnings'}</span>
                  <span className="text-amber-400 font-bold">{comparisonResult.siteB.warnings.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{isAr ? 'مرجع إشعار CNDP' : 'CNDP Authorization'}</span>
                  <span className={comparisonResult.siteB.metrics.cndpDeclarationFound ? 'text-emerald-400' : 'text-rose-400'}>
                    {comparisonResult.siteB.metrics.cndpDeclarationFound ? (isAr ? 'مُشهر ومطابق' : 'Verified') : (isAr ? 'غير معلن' : 'Missing')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{isAr ? 'ملفات التتبع الإعلاني' : 'Marketing Trackers'}</span>
                  <span className="text-slate-200">{comparisonResult.siteB.cookies.filter(c => c.category === 'Marketing').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{isAr ? 'السيادة السحابية (المادة 43)' : 'Sovereignty'}</span>
                  <span className={comparisonResult.siteB.sovereigntyStatus.isMoroccanHosting ? 'text-emerald-400' : 'text-amber-400'}>
                    {comparisonResult.siteB.sovereigntyStatus.isMoroccanHosting ? (isAr ? 'استضافة وطنية' : 'Morocco') : (isAr ? 'سحابة أجنبية' : 'Foreign')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
