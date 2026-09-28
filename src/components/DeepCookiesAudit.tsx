import React, { useState } from 'react';
import { CookieItem } from '../types';
import { Cookie, AlertTriangle, ShieldCheck, Filter, Code2, CheckCircle2, XCircle, Info } from 'lucide-react';
import { CNDP_COOKIE_GUIDELINES } from '../data/law0809Rules';

interface DeepCookiesAuditProps {
  cookies: CookieItem[];
  lang: 'ar' | 'en';
  targetUrl: string;
}

export const DeepCookiesAudit: React.FC<DeepCookiesAuditProps> = ({
  cookies,
  lang,
  targetUrl
}) => {
  const isAr = lang === 'ar';
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [showCodeSnippet, setShowCodeSnippet] = useState<boolean>(false);

  const filteredCookies = cookies.filter((c) => {
    if (selectedFilter === 'All') return true;
    return c.category === selectedFilter;
  });

  const nonCompliantCount = cookies.filter((c) => c.risk === 'High').length;

  return (
    <div className="space-y-6">
      {/* Header and CNDP Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 backdrop-blur shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-2">
              <Cookie className="h-3.5 w-3.5" />
              <span>{CNDP_COOKIE_GUIDELINES.deliberation}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isAr ? 'الفحص العميق لملفات تعريف الارتباط وسكريبتات التتبع' : 'Deep Cookies & Tracker Scripts Audit'}
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              {isAr
                ? 'تحليل دقيق لكافة ملفات الكوكيز وسكريبتات التحليلات المنزلة، والتحقق من اشتراط الموافقة المسبقة قبل التثبيت وفق مداولات اللجنة CNDP.'
                : 'Scrutinizes tracker scripts, advertising pixels, and session tokens against Moroccan CNDP prior consent rules.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-center min-w-[120px]">
              <span className="text-xs font-mono text-slate-400 block">{isAr ? 'إجمالي الملفات' : 'Total Trackers'}</span>
              <span className="text-2xl font-bold font-mono text-white">{cookies.length}</span>
            </div>
            <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 text-center min-w-[120px]">
              <span className="text-xs font-mono text-rose-300 block">{isAr ? 'غير مطابقة' : 'Non-Compliant'}</span>
              <span className="text-2xl font-bold font-mono text-rose-400">{nonCompliantCount}</span>
            </div>
          </div>
        </div>

        {/* Legal Guideline Callout */}
        <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4 text-xs text-slate-300 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <Info className="h-4 w-4" />
            <span>{isAr ? 'قاعدة CNDP الذهبية للملفات:' : 'Moroccan CNDP Golden Rule for Cookies:'}</span>
          </div>
          <p className="leading-relaxed text-slate-400">
            {isAr ? CNDP_COOKIE_GUIDELINES.summary : 'All analytics (e.g. Google Analytics) and marketing trackers (Meta Pixel) strictly require affirmative prior opt-in consent before initial script loading. Pre-checked boxes and implicit acceptance via scrolling are prohibited.'}
          </p>
        </div>
      </div>

      {/* Filter and Code Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs">
          {['All', 'Essential', 'Analytics', 'Marketing', 'Functional'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                selectedFilter === cat
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat === 'All' ? (isAr ? 'الكل' : 'All') : cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowCodeSnippet(!showCodeSnippet)}
          className="flex items-center gap-1.5 text-xs font-mono bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-700 px-3 py-2 rounded-xl transition"
        >
          <Code2 className="h-4 w-4" />
          <span>{showCodeSnippet ? (isAr ? 'إخفاء سكريبت الحجب' : 'Hide Blocking Script') : (isAr ? 'عرض كود الحجب المتوافق' : 'View Compliant Blocking Code')}</span>
        </button>
      </div>

      {/* Optional code snippet for webmasters */}
      {showCodeSnippet && (
        <div className="rounded-xl border border-emerald-500/30 bg-slate-950 p-4 font-mono text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-between text-emerald-400 text-[11px]">
            <span>// CNDP-Compliant Consent Gate (Blocking GA until user opt-in)</span>
            <span>JavaScript</span>
          </div>
          <pre className="overflow-x-auto text-[11px] leading-relaxed p-2 bg-slate-900 rounded-lg text-emerald-300">
{`<!-- Replace standard Google Analytics tag with CNDP Consent Wrapper -->
<script type="text/plain" data-cookiecategory="analytics" src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"></script>
<script>
  window.addEventListener('soverify_cndp_consent_granted', function() {
    // Dynamically load analytics only AFTER affirmative consent
    console.log('[Soverify] Prior consent logged under Moroccan Law 08-09.');
  });
</script>`}
          </pre>
        </div>
      )}

      {/* Cookies Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="p-4">{isAr ? 'اسم الملف (Cookie Name)' : 'Cookie Name'}</th>
                <th className="p-4">{isAr ? 'المزود (Provider)' : 'Provider'}</th>
                <th className="p-4">{isAr ? 'التصنيف' : 'Category'}</th>
                <th className="p-4">{isAr ? 'الصلاحية' : 'Retention'}</th>
                <th className="p-4">{isAr ? 'الحالة القانونية CNDP' : 'Moroccan Law Status'}</th>
                <th className="p-4">{isAr ? 'مستوى الخطر' : 'Risk'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-sans">
              {filteredCookies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    {isAr ? 'لا توجد عناصر في هذا التصنيف' : 'No items found for selected filter.'}
                  </td>
                </tr>
              ) : (
                filteredCookies.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-mono font-bold text-white flex items-center gap-2">
                      <Cookie className="h-3.5 w-3.5 text-emerald-400" />
                      <span>{c.name}</span>
                    </td>
                    <td className="p-4 text-slate-300 font-mono text-[11px]">{c.provider}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-700">
                        {c.category}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-400 text-[11px]">{c.lifespan}</td>
                    <td className="p-4">
                      {c.moroccanLawStatus === 'Exempt' ? (
                        <span className="text-emerald-400 flex items-center gap-1 font-mono text-[11px]">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>{isAr ? 'معفى من الموافقة (فني ضروري)' : 'Exempt (Essential)'}</span>
                        </span>
                      ) : (
                        <span className="text-amber-400 flex items-center gap-1 font-mono text-[11px]">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          <span>{isAr ? 'يستوجب موافقة مسبقة صريحة' : 'Requires Prior Consent'}</span>
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                          c.risk === 'High'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : c.risk === 'Medium'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        {c.risk}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
