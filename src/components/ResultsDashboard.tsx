import React from 'react';
import { AuditReport, ComplianceGap, ComplianceWarning } from '../types';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  ShieldCheck, 
  Server, 
  Download, 
  Share2, 
  ExternalLink, 
  Calendar, 
  Scale, 
  Cookie, 
  Info,
  Clock,
  FileCheck,
  BookOpen,
  Bot,
  Mail,
  Send,
  FileClock
} from 'lucide-react';

interface ResultsDashboardProps {
  report: AuditReport;
  lang: 'ar' | 'en';
  onViewCookies: () => void;
  onViewRemediation: () => void;
  onViewBreachGuide: () => void;
  onDownloadPdf: () => void;
  onViewArticle?: (articleId?: string) => void;
  onConsultDpo?: () => void;
  onTriggerDpoEmailAlert?: (gap?: ComplianceGap) => void;
  onViewAuditTrail?: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  report,
  lang,
  onViewCookies,
  onViewRemediation,
  onViewBreachGuide,
  onDownloadPdf,
  onViewArticle,
  onConsultDpo,
  onTriggerDpoEmailAlert,
  onViewAuditTrail
}) => {
  const isAr = lang === 'ar';

  const getArticleIdFromRef = (ref: string): string => {
    const r = ref.toLowerCase();
    if (r.includes('3') && !r.includes('23') && !r.includes('13') && !r.includes('43')) return 'art-3';
    if (r.includes('4') && !r.includes('14') && !r.includes('24') && !r.includes('44') && !r.includes('54')) return 'art-4';
    if (r.includes('12')) return 'art-12';
    if (r.includes('13') || r.includes('14')) return 'art-13-14';
    if (r.includes('15')) return 'art-15';
    if (r.includes('23')) return 'art-23';
    if (r.includes('43') || r.includes('44')) return 'art-43-44';
    if (r.includes('52')) return 'art-52';
    if (r.includes('54')) return 'art-54';
    if (r.includes('08-2020') || r.includes('cookie')) return 'cndp-08-2020';
    return 'art-12';
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 60) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Summary Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 backdrop-blur shadow-2xl relative overflow-hidden">
        {/* Ambient background glow */}
        <div
          className={`absolute -right-20 -top-20 h-64 w-64 rounded-full blur-[100px] pointer-events-none opacity-20 ${
            report.score >= 85 ? 'bg-emerald-500' : report.score >= 60 ? 'bg-amber-500' : 'bg-rose-500'
          }`}
        />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                {isAr ? 'تقرير التدقيق الرسمي' : 'Official Audit Report'}
              </span>
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {report.timestamp}
              </span>
            </div>

            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
                {report.target}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {isAr ? report.statusAr : report.status}
              </p>
            </div>

            {/* Quick Metrics Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-rose-300 font-mono">
                {report.gaps.length} {isAr ? 'مخالفات حرجة' : 'Critical Gaps'}
              </span>
              <span className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-amber-300 font-mono">
                {report.warnings.length} {isAr ? 'تحذيرات وملاحظات' : 'Warnings'}
              </span>
              <span className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-slate-300 font-mono flex items-center gap-1">
                <Server className="h-3 w-3 text-emerald-400" />
                <span>{report.sovereigntyStatus.location}</span>
              </span>
            </div>
          </div>

          {/* Circular Score Gauge */}
          <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0 w-full lg:w-auto justify-center">
            <div className="flex flex-col items-center">
              <div
                className={`relative flex h-36 w-36 items-center justify-center rounded-full border-4 shadow-xl ${getScoreColor(
                  report.score
                )}`}
              >
                <div className="text-center">
                  <span className="text-5xl font-extrabold font-mono tracking-tighter">
                    {report.score}
                  </span>
                  <span className="block text-[11px] font-mono text-slate-400 uppercase">
                    / 100
                  </span>
                </div>
              </div>
              <span className="mt-2 text-xs font-mono font-medium text-slate-300">
                {isAr ? 'مؤشر الامتثال الكلي' : 'Overall Compliance Index'}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <button
                onClick={onDownloadPdf}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-2.5 text-xs font-bold text-slate-950 hover:from-emerald-400 hover:to-teal-300 transition shadow-lg shadow-emerald-500/25 ring-1 ring-emerald-300/40"
              >
                <Download className="h-4 w-4" />
                <span>{isAr ? 'تحميل التقرير كملف PDF' : 'Download Report as PDF'}</span>
              </button>
              <button
                onClick={onViewRemediation}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:border-slate-600 hover:bg-slate-700 transition"
              >
                <Scale className="h-4 w-4 text-emerald-400" />
                <span>{isAr ? 'عرض خطة الـ 30 يوماً' : 'View 30-Day Plan'}</span>
              </button>
              {onTriggerDpoEmailAlert && report.gaps.some(g => g.severity === 'CRITICAL' || g.severity === 'HIGH') && (
                <button
                  onClick={() => onTriggerDpoEmailAlert()}
                  className="flex items-center justify-center gap-2 rounded-xl border border-rose-500/50 bg-gradient-to-r from-rose-950/80 to-red-900/80 px-4 py-2.5 text-xs font-bold text-rose-200 hover:text-white hover:border-rose-400 hover:from-rose-900 hover:to-red-800 transition shadow-lg shadow-rose-950/30"
                >
                  <Mail className="h-4 w-4 text-rose-400 animate-pulse" />
                  <span>{isAr ? 'إرسال إنذار أمني فوري للـ DPO' : 'Dispatch Urgent DPO Alert Email'}</span>
                </button>
              )}
              {onConsultDpo && (
                <button
                  onClick={onConsultDpo}
                  className="flex items-center justify-center gap-2 rounded-xl border border-teal-500/40 bg-gradient-to-r from-teal-950/70 to-emerald-950/70 px-4 py-2.5 text-xs font-bold text-teal-300 hover:text-white hover:border-teal-400 transition shadow-sm"
                >
                  <Bot className="h-4 w-4 text-teal-400 animate-pulse" />
                  <span>{isAr ? 'استشارة المستشار الذكي DPO (Gemini)' : 'Consult Gemini AI DPO'}</span>
                </button>
              )}
              {onViewArticle && (
                <button
                  onClick={() => onViewArticle()}
                  className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-4 py-2 text-xs text-emerald-300 hover:text-white hover:bg-emerald-900/60 transition shadow-sm"
                >
                  <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{isAr ? 'مدونة مواد القانون 08.09' : 'Articles of Law Reference'}</span>
                </button>
              )}
              {onViewAuditTrail && (
                <button
                  onClick={onViewAuditTrail}
                  className="flex items-center justify-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-950/40 px-4 py-2 text-xs text-indigo-300 hover:text-white hover:bg-indigo-900/60 transition shadow-sm font-mono"
                >
                  <FileClock className="h-3.5 w-3.5 text-indigo-400" />
                  <span>{isAr ? 'سجل التدقيق والأنشطة (Audit Trail)' : 'View Audit Trail Log'}</span>
                </button>
              )}
              <button
                onClick={onViewCookies}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs text-slate-300 hover:text-white hover:border-slate-700 transition"
              >
                <Cookie className="h-3.5 w-3.5 text-emerald-400" />
                <span>{isAr ? 'فحص الكوكيز والتتبع' : 'Inspect Cookies'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Key Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
          <span className="text-[11px] font-mono text-slate-400">
            {isAr ? 'تشفير الاتصال (TLS)' : 'Transport Security'}
          </span>
          <div className="text-xl font-bold font-mono text-emerald-400 flex items-center justify-between">
            <span>{report.metrics.tlsGrade}</span>
            <ShieldCheck className="h-5 w-5 text-emerald-500/60" />
          </div>
          <p className="text-[11px] text-slate-500">Loi 08-09 Art. 23</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
          <span className="text-[11px] font-mono text-slate-400">
            {isAr ? 'ترخيص CNDP' : 'CNDP Authorization'}
          </span>
          <div
            className={`text-xl font-bold font-mono flex items-center justify-between ${
              report.metrics.cndpDeclarationFound ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            <span>{report.metrics.cndpDeclarationFound ? (isAr ? 'مُشهر' : 'Found') : (isAr ? 'غير معلن' : 'Missing')}</span>
            {report.metrics.cndpDeclarationFound ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            ) : (
              <ShieldAlert className="h-5 w-5 text-rose-400" />
            )}
          </div>
          <p className="text-[11px] text-slate-500">Formulaire D-1 / D-2</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
          <span className="text-[11px] font-mono text-slate-400">
            {isAr ? 'موافقة الكوكيز (CMP)' : 'Cookie Consent Gate'}
          </span>
          <div className="text-xl font-bold font-mono text-emerald-400 flex items-center justify-between">
            <span>{report.metrics.cookieConsentScore}%</span>
            <Cookie className="h-5 w-5 text-emerald-500/60" />
          </div>
          <p className="text-[11px] text-slate-500">Délibération 08-2020</p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
          <span className="text-[11px] font-mono text-slate-400">
            {isAr ? 'السيادة السحابية' : 'Digital Sovereignty'}
          </span>
          <div
            className={`text-xl font-bold font-mono flex items-center justify-between ${
              report.sovereigntyStatus.isMoroccanHosting ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            <span>{report.sovereigntyStatus.isMoroccanHosting ? (isAr ? 'سيادية' : 'Morocco') : (isAr ? 'أجنبية' : 'Foreign')}</span>
            <Server className="h-5 w-5 text-slate-400" />
          </div>
          <p className="text-[11px] text-slate-500">Loi 08-09 Art. 43/44</p>
        </div>
      </div>

      {/* Main Section: Gaps & Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Gaps (المخالفات) */}
        <div className="rounded-2xl border border-rose-500/30 bg-slate-900/80 p-5 sm:p-6 space-y-4 shadow-lg shadow-rose-950/10">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {isAr ? 'المخالفات وفجوات الامتثال' : 'Compliance Gaps & Infractions'}
                </h3>
                <span className="text-xs text-rose-400 font-mono">
                  {isAr ? 'مخالفات تستوجب المعالجة الفورية' : 'Critical Violations Requiring Remediation'}
                </span>
              </div>
            </div>
            <span className="rounded-md border border-rose-500/40 bg-rose-500/20 px-2 py-0.5 font-mono text-xs text-rose-300">
              {report.gaps.length}
            </span>
          </div>

          {report.gaps.length === 0 ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-6 text-center text-sm text-emerald-400">
              {isAr ? 'تهانينا! لم يتم رصد أي مخالفات قانونية حرجة.' : 'No critical compliance gaps detected.'}
            </div>
          ) : (
            <div className="space-y-4">
              {report.gaps.map((gap) => (
                <div
                  key={gap.id}
                  className="rounded-xl border border-rose-900/50 bg-slate-950/70 p-4 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono border font-semibold ${getSeverityBadge(gap.severity)}`}>
                        {gap.severity}
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        {isAr ? gap.titleAr : gap.title}
                      </h4>
                    </div>
                    {onViewArticle ? (
                      <button
                        onClick={() => onViewArticle(getArticleIdFromRef(gap.article))}
                        title={isAr ? 'عرض وتدقيق نص المادة في مدونة القانون' : 'Inspect Article in Law Reference'}
                        className="text-xs font-mono text-emerald-400/90 bg-slate-900 hover:bg-emerald-950/80 border border-slate-800 hover:border-emerald-500/50 px-2 py-0.5 rounded transition flex items-center gap-1 group"
                      >
                        <BookOpen className="h-3 w-3 text-emerald-500 group-hover:text-emerald-400" />
                        <span>{gap.article}</span>
                      </button>
                    ) : (
                      <span className="text-xs font-mono text-emerald-400/90 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                        {gap.article}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {gap.impact}
                  </p>

                  <div className="rounded-lg bg-emerald-950/30 border border-emerald-500/20 p-2.5 text-xs text-emerald-300/90 flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">{isAr ? 'الإجراء التصحيحي: ' : 'Remediation: '}</span>
                      <span>{gap.recommendation}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
                    {gap.penaltyEstimate ? (
                      <div className="text-[11px] font-mono text-rose-400/80 flex items-center gap-1.5">
                        <ShieldAlert className="h-3.5 w-3.5" />
                        <span>{isAr ? 'التبعات القانونية: ' : 'Legal Risk: '}{gap.penaltyEstimate}</span>
                      </div>
                    ) : <div />}

                    <div className="flex items-center gap-2">
                      {onTriggerDpoEmailAlert && (gap.severity === 'CRITICAL' || gap.severity === 'HIGH') && (
                        <button
                          onClick={() => onTriggerDpoEmailAlert(gap)}
                          title={isAr ? 'إرسال إنذار بريدي مخصص لهذه الثغرة للـ DPO' : 'Dispatch email alert for this gap'}
                          className="text-[11px] font-mono text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 px-2 py-1 rounded transition flex items-center gap-1.5"
                        >
                          <Mail className="h-3 w-3 text-red-400" />
                          <span>{isAr ? 'إنذار DPO بالبريد' : 'Alert DPO'}</span>
                        </button>
                      )}

                      {onViewArticle && (
                        <button
                          onClick={() => onViewArticle(getArticleIdFromRef(gap.article))}
                          className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition underline underline-offset-4"
                        >
                          <BookOpen className="h-3 w-3" />
                          <span>{isAr ? 'مراجعة المادة ↗' : 'Inspect Article ↗'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Warnings & Technical Notes (التحذيرات والملاحظات الفنية) */}
        <div className="rounded-2xl border border-amber-500/30 bg-slate-900/80 p-5 sm:p-6 space-y-4 shadow-lg shadow-amber-950/10">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {isAr ? 'التحذيرات والملاحظات الفنية' : 'Warnings & Advisory Notices'}
                </h3>
                <span className="text-xs text-amber-400 font-mono">
                  {isAr ? 'نقاط تتطلب تحسيناً لتفادي المخالفات' : 'Requires Optimization to Avoid Sanctions'}
                </span>
              </div>
            </div>
            <span className="rounded-md border border-amber-500/40 bg-amber-500/20 px-2 py-0.5 font-mono text-xs text-amber-300">
              {report.warnings.length}
            </span>
          </div>

          {report.warnings.length === 0 ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-6 text-center text-sm text-emerald-400">
              {isAr ? 'لا توجد تحذيرات مسجلة.' : 'No advisory warnings.'}
            </div>
          ) : (
            <div className="space-y-4">
              {report.warnings.map((warn) => (
                <div
                  key={warn.id}
                  className="rounded-xl border border-amber-900/50 bg-slate-950/70 p-4 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono border font-semibold ${getSeverityBadge(warn.severity)}`}>
                        {warn.severity}
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        {isAr ? warn.titleAr : warn.title}
                      </h4>
                    </div>
                    {onViewArticle ? (
                      <button
                        onClick={() => onViewArticle(getArticleIdFromRef(warn.article))}
                        title={isAr ? 'عرض وتدقيق نص المادة في مدونة القانون' : 'Inspect Article in Law Reference'}
                        className="text-xs font-mono text-amber-400 bg-slate-900 hover:bg-amber-950/80 border border-slate-800 hover:border-amber-500/50 px-2 py-0.5 rounded transition flex items-center gap-1 group"
                      >
                        <BookOpen className="h-3 w-3 text-amber-500 group-hover:text-amber-400" />
                        <span>{warn.article}</span>
                      </button>
                    ) : (
                      <span className="text-xs font-mono text-amber-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                        {warn.article}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {warn.impact}
                  </p>

                  <div className="rounded-lg bg-slate-900 border border-slate-800 p-2.5 text-xs text-slate-300 flex items-start gap-2">
                    <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-400">{isAr ? 'التوصية الفنية: ' : 'Recommendation: '}</span>
                      <span>{warn.recommendation}</span>
                    </div>
                  </div>

                  {onViewArticle && (
                    <div className="flex justify-end pt-1 border-t border-slate-800/80">
                      <button
                        onClick={() => onViewArticle(getArticleIdFromRef(warn.article))}
                        className="text-[11px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1 transition underline underline-offset-4"
                      >
                        <BookOpen className="h-3 w-3" />
                        <span>{isAr ? 'مراجعة المادة والمداولة ذات الصلة ↗' : 'Inspect Law Article & Directives ↗'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Verified Compliant Safeguards */}
      <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/60 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              {isAr ? 'النقاط المطابقة والتدابير المحققة (Compliant Safeguards)' : 'Verified Compliant Safeguards'}
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800 px-2 py-0.5 rounded">
            {report.passed.length} {isAr ? 'مطابقات' : 'Passed'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {report.passed.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <h5 className="text-xs font-bold text-emerald-300">
                  {isAr ? p.titleAr : p.title}
                </h5>
                <span className="text-[10px] font-mono text-slate-500">{p.article}</span>
              </div>
              <p className="text-[11px] text-slate-400">{p.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
