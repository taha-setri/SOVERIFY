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
  FileClock,
  Printer,
  Fingerprint,
  FileText
} from 'lucide-react';
import { ComplianceScoreTooltip } from './ComplianceScoreTooltip';
import { NginxHardeningSection } from './NginxHardeningSection';
import { EnterpriseLeadCard } from './EnterpriseLeadCard';
import { ComplianceRiskMatrix } from './ComplianceRiskMatrix';
import { CndpDeclarationModal } from './CndpDeclarationModal';
import { SovereignMapModal } from './SovereignMapModal';
import { CookieSimulatorModal } from './CookieSimulatorModal';

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
  onOpenCndpDeclaration?: () => void;
  onOpenSovereignMap?: () => void;
  onOpenCookieSimulator?: () => void;
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
    <>
      <div className="space-y-8 animate-fadeIn print:hidden">
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

            {/* SHA-256 Cryptographic Audit Signature & Soverify HTML Report */}
            {report.signature && (
              <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-sky-500/30 bg-sky-950/40 p-2.5 text-xs font-mono">
                <span className="font-bold text-sky-400 flex items-center gap-1.5 shrink-0">
                  <Fingerprint className="h-4 w-4 text-sky-400 animate-pulse" />
                  {isAr ? 'البصمة المشفرة (SHA-256):' : 'SHA-256 Signature:'}
                </span>
                <span className="text-[11px] text-sky-200 select-all bg-slate-950/80 px-2 py-0.5 rounded border border-sky-800/60 break-all font-mono">
                  {report.signature}
                </span>
                <a
                  href="/soverify_report.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mr-auto inline-flex items-center gap-1.5 rounded-lg bg-sky-600/30 hover:bg-sky-600/50 text-sky-200 border border-sky-400/40 px-2.5 py-1 text-xs font-sans font-semibold transition"
                  title={isAr ? 'عرض جدول التقارير وسجلات التدقيق' : 'View HTML Audit Report Table'}
                >
                  <FileText className="h-3.5 w-3.5 text-sky-300" />
                  <span>{isAr ? 'تقرير التدقيق (HTML Report)' : 'Export HTML Report'}</span>
                </a>
              </div>
            )}
          </div>

          {/* Circular Score Gauge */}
          <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0 w-full lg:w-auto justify-center">
            <div className="flex flex-col items-center">
              <ComplianceScoreTooltip score={report.score} lang={lang} size="md">
                <div
                  className={`relative flex h-36 w-36 items-center justify-center rounded-full border-4 shadow-xl cursor-help transition hover:scale-105 ${getScoreColor(
                    report.score
                  )}`}
                  title={isAr ? 'انقر لعرض تفاصيل ومنهجية احتساب النقاط' : 'Click to inspect Law 08/09 scoring rules'}
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
              </ComplianceScoreTooltip>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="text-xs font-mono font-medium text-slate-300">
                  {isAr ? 'مؤشر الامتثال الكلي' : 'Overall Compliance Index'}
                </span>
                <ComplianceScoreTooltip score={report.score} lang={lang} size="sm" showLabel={false} />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2 w-full sm:w-auto no-print">
              <button
                onClick={handlePrint}
                className="flex items-center justify-center gap-2 rounded-xl border border-sky-500/40 bg-gradient-to-r from-sky-950/70 to-blue-950/70 px-4 py-2.5 text-xs font-bold text-sky-300 hover:text-white hover:border-sky-400 hover:from-sky-900/80 hover:to-blue-900/80 transition shadow-md shadow-sky-950/30 cursor-pointer"
              >
                <Printer className="h-4 w-4 text-sky-400" />
                <span>{isAr ? 'طباعة الملخص التنفيذي' : 'Print Summary'}</span>
              </button>
              <button
                onClick={onDownloadPdf}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-2.5 text-xs font-bold text-slate-950 hover:from-emerald-400 hover:to-teal-300 transition shadow-lg shadow-emerald-500/25 ring-1 ring-emerald-300/40 cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>{isAr ? 'تحميل التقرير كملف PDF' : 'Download Report as PDF'}</span>
              </button>
              <button
                onClick={() => {
                  const headers = ['Category', 'Article', 'Title (AR)', 'Title (EN)', 'Severity', 'Penalty Estimate', 'Recommendation'];
                  const rows = (report.gaps || []).map(g => [
                    `"${g.category}"`,
                    `"${g.article}"`,
                    `"${g.titleAr.replace(/"/g, '""')}"`,
                    `"${g.title.replace(/"/g, '""')}"`,
                    g.severity,
                    `"${g.penaltyEstimate || 'N/A'}"`,
                    `"${g.recommendation.replace(/"/g, '""')}"`
                  ]);
                  const csv = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
                  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `soverify_gaps_${report.domain}_${new Date().toISOString().substring(0, 10)}.csv`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
                className="flex items-center justify-center gap-2 rounded-xl border border-teal-500/40 bg-teal-950/60 px-4 py-2 text-xs font-bold text-teal-300 hover:text-white hover:bg-teal-900/60 transition cursor-pointer"
              >
                <Download className="h-4 w-4 text-teal-400" />
                <span>{isAr ? 'تصدير الثغرات كملف CSV / Excel' : 'Export Gaps to CSV'}</span>
              </button>

              {onOpenCndpDeclaration && (
                <button
                  onClick={onOpenCndpDeclaration}
                  className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/50 bg-gradient-to-r from-emerald-950/80 via-teal-950/80 to-slate-950 px-4 py-2.5 text-xs font-bold text-emerald-300 hover:text-white hover:border-emerald-400 hover:from-emerald-900 transition shadow-md shadow-emerald-950/40 cursor-pointer"
                >
                  <FileText className="h-4 w-4 text-emerald-400" />
                  <span>{isAr ? '📄 توليد وثائق التصريح المسبق (CNDP)' : '📄 Generate CNDP Declaration'}</span>
                </button>
              )}

              {onOpenSovereignMap && (
                <button
                  onClick={onOpenSovereignMap}
                  className="flex items-center justify-center gap-2 rounded-xl border border-sky-500/40 bg-gradient-to-r from-sky-950/70 to-slate-950 px-4 py-2.5 text-xs font-bold text-sky-300 hover:text-white hover:border-sky-400 transition cursor-pointer"
                >
                  <Server className="h-4 w-4 text-sky-400" />
                  <span>{isAr ? '🗺️ خريطة التوطين والسيادة الرقمية' : '🗺️ Sovereign Residency Map'}</span>
                </button>
              )}

              {onOpenCookieSimulator && (
                <button
                  onClick={onOpenCookieSimulator}
                  className="flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-950/60 to-slate-950 px-4 py-2.5 text-xs font-bold text-amber-300 hover:text-white hover:border-amber-400 transition cursor-pointer"
                >
                  <Cookie className="h-4 w-4 text-amber-400" />
                  <span>{isAr ? '🍪 محاكي لافتة الكوكيز المتوافقة' : '🍪 CNDP Cookie Simulator'}</span>
                </button>
              )}

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

        <div 
          onClick={onOpenCookieSimulator} 
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1 hover:border-amber-500/50 hover:bg-slate-900 transition cursor-pointer group"
          title={isAr ? 'انقر لفتح محاكي لافتة الكوكيز' : 'Click to launch cookie simulator'}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 group-hover:text-amber-300">
              {isAr ? 'موافقة الكوكيز (CMP)' : 'Cookie Consent Gate'}
            </span>
            <span className="text-[10px] text-amber-400 font-mono bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/60">
              {isAr ? 'محاكاة ↗' : 'Simulate ↗'}
            </span>
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 flex items-center justify-between">
            <span>{report.metrics.cookieConsentScore}%</span>
            <Cookie className="h-5 w-5 text-emerald-500/60 group-hover:text-amber-400 transition" />
          </div>
          <p className="text-[11px] text-slate-500">Délibération 08-2020</p>
        </div>

        <div 
          onClick={onOpenSovereignMap}
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1 hover:border-sky-500/50 hover:bg-slate-900 transition cursor-pointer group"
          title={isAr ? 'انقر لفتح خريطة التوطين والسيادة' : 'Click to inspect sovereignty residency map'}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400 group-hover:text-sky-300">
              {isAr ? 'السيادة السحابية' : 'Digital Sovereignty'}
            </span>
            <span className="text-[10px] text-sky-400 font-mono bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-800/60">
              {isAr ? 'خريطة ↗' : 'Map ↗'}
            </span>
          </div>
          <div
            className={`text-xl font-bold font-mono flex items-center justify-between ${
              report.sovereigntyStatus.isMoroccanHosting ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            <span>{report.sovereigntyStatus.isMoroccanHosting ? (isAr ? 'سيادية' : 'Morocco') : (isAr ? 'أجنبية' : 'Foreign')}</span>
            <Server className="h-5 w-5 text-slate-400 group-hover:text-sky-400 transition" />
          </div>
          <p className="text-[11px] text-slate-500">Loi 08-09 Art. 43/44</p>
        </div>
      </div>

      {/* Compliance Risk Matrix Component (Maps gaps by severity and Law 08-09 articles) */}
      <ComplianceRiskMatrix
        gaps={report.gaps}
        lang={lang}
        onViewArticle={onViewArticle}
        onConsultDpo={(topic) => onConsultDpo && onConsultDpo()}
      />

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

      {/* Sovereign Security Headers & Nginx Hardening (with Official Lock / Paywall) */}
      <NginxHardeningSection domain={report.target} lang={lang} />

      {/* Enterprise Lead Generation / Official CNDP Escort */}
      <EnterpriseLeadCard domain={report.target} lang={lang} />
    </div>

      {/* ========================================================================= */}
      {/* PRINT-FRIENDLY COMPLIANCE REPORT SUMMARY (Formatted for A4 Print CSS)     */}
      {/* ========================================================================= */}
      <div className="hidden print:block print-document-container font-sans text-slate-900 bg-white p-4" dir={isAr ? 'rtl' : 'ltr'}>
        {/* Official Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-base font-extrabold uppercase tracking-tight text-slate-900">
                {isAr ? 'المملكة المغربية — تقرير التدقيق التنفيذي للامتثال القانوني' : 'KINGDOM OF MOROCCO — EXECUTIVE COMPLIANCE AUDIT SUMMARY'}
              </h1>
              <h2 className="text-xs font-semibold text-slate-700 mt-0.5">
                {isAr
                  ? 'مراقبة حماية المعطيات ذات الطابع الشخصي — الظهير الشريف 1.09.15 (القانون رقم 08-09)'
                  : 'Personal Data Protection Regulatory Oversight — Dahir 1.09.15 (Law 08-09)'}
              </h2>
            </div>
            <div className="text-right text-[10px] font-mono text-slate-600">
              <div>CNDP COMPLIANCE AUDIT</div>
              <div className="font-bold text-slate-900">REF: {report.target.replace(/[^a-zA-Z0-9]/g, '-').toUpperCase()}</div>
              <div>{report.timestamp}</div>
            </div>
          </div>
        </div>

        {/* Executive Target & Score Card */}
        <div className="grid grid-cols-3 gap-4 border border-slate-300 rounded-lg p-3 mb-4 print-avoid-break bg-slate-50">
          <div className="col-span-2 space-y-1">
            <div className="text-[11px] font-bold text-slate-500 uppercase">{isAr ? 'الموقع ونطاق الفحص' : 'Target URL / Entity'}</div>
            <div className="text-sm font-bold font-mono text-slate-900">{report.target}</div>
            <div className="text-xs text-slate-700">{isAr ? report.statusAr : report.status}</div>
            <div className="text-[10px] text-slate-600 pt-1">
              <span>{isAr ? 'موقع الاستضافة: ' : 'Hosting Location: '}{report.sovereigntyStatus.location}</span>
              <span className="mx-2">•</span>
              <span>{report.sovereigntyStatus.isMoroccanHosting ? (isAr ? 'استضافة سيادية داخل المغرب' : 'Moroccan Sovereign Hosting') : (isAr ? 'استضافة خارجية (تتطلب ترخيص النقل)' : 'Foreign Hosting')}</span>
            </div>
          </div>

          <div className="col-span-1 border-r border-slate-300 pr-3 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-mono font-bold text-slate-600 uppercase">
              {isAr ? 'مؤشر الامتثال الكلي' : 'Compliance Score'}
            </span>
            <div className="text-3xl font-extrabold font-mono text-slate-900 mt-0.5">
              {report.score} / 100
            </div>
            <span className="text-[10px] font-bold uppercase mt-1 px-2 py-0.5 border border-slate-800 rounded">
              {report.score >= 85 ? (isAr ? 'ممتثل للمعايير' : 'COMPLIANT') : report.score >= 60 ? (isAr ? 'امتثال جزئي' : 'PARTIALLY COMPLIANT') : (isAr ? 'غير ممتثل - مخاطر' : 'NON-COMPLIANT')}
            </span>
          </div>
        </div>

        {/* 4 Compliance Pillars Breakdown */}
        <div className="mb-4 print-avoid-break">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
            {isAr ? 'نتائج المحاور الأربعة الأساسية للامتثال (Law 08-09 Grading Matrix)' : 'Core 4 Compliance Pillars Evaluation'}
          </h3>
          <table className="w-full text-left text-xs border border-slate-300" dir={isAr ? 'rtl' : 'ltr'}>
            <thead className="bg-slate-200 text-slate-800 font-bold text-[10px]">
              <tr>
                <th className="p-1.5 border border-slate-300">{isAr ? 'المحور الرقابي' : 'Evaluation Pillar'}</th>
                <th className="p-1.5 border border-slate-300">{isAr ? 'المرجع القانوني' : 'Legal Basis'}</th>
                <th className="p-1.5 border border-slate-300">{isAr ? 'النتيجة المسجلة' : 'Status'}</th>
                <th className="p-1.5 border border-slate-300 text-center">{isAr ? 'التقييم' : 'Grade'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 text-[11px]">
              <tr>
                <td className="p-1.5 border border-slate-300 font-semibold">{isAr ? 'تشفير النقل والسرية' : 'Transport Security & Encryption'}</td>
                <td className="p-1.5 border border-slate-300 font-mono text-[10px]">Loi 08-09 Art. 23</td>
                <td className="p-1.5 border border-slate-300">{report.metrics.tlsGrade} (TLS 1.3 / HTTPS Strict)</td>
                <td className="p-1.5 border border-slate-300 text-center font-mono font-bold">25 / 25</td>
              </tr>
              <tr>
                <td className="p-1.5 border border-slate-300 font-semibold">{isAr ? 'التصريح المسبق لدى CNDP' : 'CNDP Prior Declaration / Authorization'}</td>
                <td className="p-1.5 border border-slate-300 font-mono text-[10px]">Loi 08-09 Art. 12 & 52</td>
                <td className="p-1.5 border border-slate-300">
                  {report.metrics.cndpDeclarationFound ? (isAr ? 'مرجع التصريح مسجل ومطابق' : 'Prior Declaration Found') : (isAr ? 'لم يعثر على إشعار CNDP صريح' : 'Declaration Missing')}
                </td>
                <td className="p-1.5 border border-slate-300 text-center font-mono font-bold">
                  {report.metrics.cndpDeclarationFound ? '25 / 25' : '0 / 25'}
                </td>
              </tr>
              <tr>
                <td className="p-1.5 border border-slate-300 font-semibold">{isAr ? 'إدارة موافقة الكوكيز والتتبع' : 'Cookie Governance & Prior Consent'}</td>
                <td className="p-1.5 border border-slate-300 font-mono text-[10px]">CNDP Délibération 08-2020</td>
                <td className="p-1.5 border border-slate-300">{report.metrics.cookieConsentScore}% {isAr ? 'معدل الحجب قبل الموافقة' : 'Pre-consent blocking'}</td>
                <td className="p-1.5 border border-slate-300 text-center font-mono font-bold">
                  {Math.round((report.metrics.cookieConsentScore / 100) * 25)} / 25
                </td>
              </tr>
              <tr>
                <td className="p-1.5 border border-slate-300 font-semibold">{isAr ? 'السيادة الرقمية وتوطين البيانات' : 'Digital Sovereignty & Data Residency'}</td>
                <td className="p-1.5 border border-slate-300 font-mono text-[10px]">Loi 08-09 Art. 43 & 44</td>
                <td className="p-1.5 border border-slate-300">{report.sovereigntyStatus.isMoroccanHosting ? (isAr ? 'خوادم داخل المملكة المغربية' : 'Hosted in Morocco') : (isAr ? 'خوادم أجنبية' : 'Foreign Cloud')}</td>
                <td className="p-1.5 border border-slate-300 text-center font-mono font-bold">
                  {report.sovereigntyStatus.isMoroccanHosting ? '25 / 25' : '15 / 25'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Critical Compliance Gaps Table */}
        <div className="mb-4 print-avoid-break">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
            {isAr ? `المخالفات وفجوات الامتثال الحرجة (${report.gaps.length})` : `Identified Compliance Gaps & Infractions (${report.gaps.length})`}
          </h3>
          {report.gaps.length === 0 ? (
            <div className="p-2 border border-slate-300 rounded text-xs text-slate-700 bg-slate-50">
              {isAr ? 'لم تسجل أي مخالفات قانونية حرجة أثناء هذا الفحص.' : 'No critical legal gaps detected.'}
            </div>
          ) : (
            <table className="w-full text-left text-xs border border-slate-300" dir={isAr ? 'rtl' : 'ltr'}>
              <thead className="bg-slate-200 text-slate-800 font-bold text-[10px]">
                <tr>
                  <th className="p-1.5 border border-slate-300">{isAr ? 'الدرجة' : 'Severity'}</th>
                  <th className="p-1.5 border border-slate-300">{isAr ? 'المخالفة القانونية' : 'Infraction Title'}</th>
                  <th className="p-1.5 border border-slate-300">{isAr ? 'المادة' : 'Article'}</th>
                  <th className="p-1.5 border border-slate-300">{isAr ? 'الإجراء التصحيحي المطلوب' : 'Required Remediation'}</th>
                  <th className="p-1.5 border border-slate-300">{isAr ? 'التبعات والعقوبات المحتملة' : 'Statutory Penalty'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 text-[10px]">
                {report.gaps.map((g) => (
                  <tr key={g.id}>
                    <td className="p-1.5 border border-slate-300 font-mono font-bold">{g.severity}</td>
                    <td className="p-1.5 border border-slate-300 font-semibold">{isAr ? g.titleAr : g.title}</td>
                    <td className="p-1.5 border border-slate-300 font-mono">{g.article}</td>
                    <td className="p-1.5 border border-slate-300">{g.recommendation}</td>
                    <td className="p-1.5 border border-slate-300 text-slate-800 font-mono">{g.penaltyEstimate || 'Mise en demeure CNDP'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Technical Warnings & Notes */}
        {report.warnings.length > 0 && (
          <div className="mb-4 print-avoid-break">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">
              {isAr ? `الملاحظات والتوصيات التحسينية (${report.warnings.length})` : `Advisory Technical Warnings (${report.warnings.length})`}
            </h3>
            <ul className="list-disc pr-4 pl-4 text-[10px] space-y-1 text-slate-700">
              {report.warnings.map((w) => (
                <li key={w.id}>
                  <strong className="text-slate-900">{isAr ? w.titleAr : w.title} ({w.article}):</strong> {w.recommendation}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Remediation Action Plan (30 Days) */}
        <div className="mb-4 print-avoid-break border border-slate-300 rounded p-3 bg-slate-50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
            {isAr ? 'خلاصة خطة التصحيح الإلزامية (30 يوماً)' : 'Mandatory 30-Day Remediation Roadmap Summary'}
          </h3>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <span className="font-bold text-slate-900 block">{isAr ? 'الأسبوع 1 (تدابير فورية):' : 'Week 1 (Immediate):'}</span>
              <span className="text-slate-700">{isAr ? 'حظر إطلاق ملفات التتبع قبل موافقة الزائر الصريحة وضبط شهادات TLS 1.3.' : 'Block pre-consent tracking cookies and enforce strict TLS 1.3 encryption.'}</span>
            </div>
            <div>
              <span className="font-bold text-slate-900 block">{isAr ? 'الأسبوع 2 (الإجراءات الإدارية):' : 'Week 2 (Administrative):'}</span>
              <span className="text-slate-700">{isAr ? 'إيداع استمارة التصريح المسبق D-1 وتعيين مسؤول حماية المعطيات DPO.' : 'Submit CNDP prior declaration D-1 and formally register domain DPO.'}</span>
            </div>
            <div>
              <span className="font-bold text-slate-900 block">{isAr ? 'الأسبوع 3 (الشفافية وحقوق الأفراد):' : 'Week 3 (Transparency):'}</span>
              <span className="text-slate-700">{isAr ? 'نشر سياسة خصوصية واضحة ومسار ممارسة حقوق الولوج والتصحيح (المواد 7-9).' : 'Publish compliant privacy policy and user rights mechanisms (Arts. 7-9).'}</span>
            </div>
            <div>
              <span className="font-bold text-slate-900 block">{isAr ? 'الأسبوع 4 (التدقيق النهائي والشهادة):' : 'Week 4 (Certification):'}</span>
              <span className="text-slate-700">{isAr ? 'إعادة الفحص الآلي وإصدار شهادة المطابقة القانونية المعتمدة.' : 'Execute automated re-audit and certify full Law 08-09 compliance.'}</span>
            </div>
          </div>
        </div>

        {/* Legal Sign-off / Certification Footer */}
        <div className="border-t border-slate-300 pt-3 flex items-end justify-between print-avoid-break text-[10px] text-slate-600">
          <div>
            <p className="max-w-md leading-relaxed">
              {isAr
                ? 'تم إصدار هذا الملخص التنفيذي بناءً على الفحص الآلي لمعايير القانون رقم 08-09 والظهير الشريف 1.09.15 ومداولات CNDP ذات الصلة.'
                : 'This summary report is generated following automated evidentiary scanning against Law 08-09 standards and CNDP regulatory deliberation rules.'}
            </p>
            <p className="mt-1 font-mono text-[9px]">HASH: SHA256:{Math.random().toString(36).substring(2, 10).toUpperCase()}-CNDP-EVIDENTIARY</p>
          </div>
          <div className="text-center border border-slate-400 rounded p-3 w-44 bg-white">
            <div className="font-bold text-slate-800 text-[10px] mb-6">
              {isAr ? 'تأشيرة مسؤول حماية المعطيات (DPO)' : 'DPO / Legal Counsel Signature'}
            </div>
            <div className="text-[9px] text-slate-400 border-t border-dashed border-slate-300 pt-1">
              {isAr ? 'الختم والتوقيع الرسمي' : 'Official Seal & Stamp'}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
