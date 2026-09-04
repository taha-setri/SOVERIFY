import React, { useRef, useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Building2, 
  UserCheck, 
  Scale, 
  Calendar,
  Lock,
  Server,
  FileCheck,
  Check,
  Share2
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { AuditReport, UserAccount } from '../types';

interface FormalPdfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: AuditReport;
  user: UserAccount | null;
  lang: 'ar' | 'en';
}

export const FormalPdfReportModal: React.FC<FormalPdfReportModalProps> = ({
  isOpen,
  onClose,
  report,
  user,
  lang: initialLang
}) => {
  const [lang, setLang] = useState<'ar' | 'en'>(initialLang);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const isAr = lang === 'ar';
  const reportDate = new Date().toLocaleDateString(isAr ? 'ar-MA' : 'fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const reportRefNumber = `CNDP-AUDIT-${new Date().getFullYear()}-${report.id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase()}`;

  // Direct PDF Download using html2canvas & jsPDF
  const handleDownloadPdf = async () => {
    if (!printRef.current) return;
    setIsGeneratingPdf(true);

    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1024
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imgHeight = (canvasHeight * pdfWidth) / canvasWidth;

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const cleanDomain = report.domain.replace(/[^a-zA-Z0-9.-]/g, '_');
      pdf.save(`Rapport_Audit_CNDP_Loi08-09_${cleanDomain}.pdf`);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to generate direct PDF, triggering print dialog as fallback', error);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Browser Print / Save as PDF
  const handlePrint = () => {
    window.print();
  };

  // Standalone offline HTML export
  const handleExportHtml = () => {
    if (!printRef.current) return;
    const htmlContent = `<!DOCTYPE html>
<html lang="${isAr ? 'ar' : 'fr'}" dir="${isAr ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <title>Rapport d'Audit CNDP Loi 08-09 - ${report.domain}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
  <style>
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      @page { size: A4 portrait; margin: 12mm 14mm; }
    }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f8fafc; color: #0f172a; }
  </style>
</head>
<body class="p-8">
  <div class="max-w-4xl mx-auto bg-white p-8 border border-gray-200 shadow-md">
    ${printRef.current.innerHTML}
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `CNDP_Loi08-09_Audit_${report.domain.replace(/[^a-zA-Z0-9.-]/g, '_')}.html`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden flex flex-col my-4 max-h-[96vh]">
        
        {/* Modal Top Control Bar (Hidden in Print) */}
        <div className="no-print flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 p-4 bg-slate-950/90 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-mono text-white flex items-center gap-2">
                <span>{isAr ? 'تقرير التدقيق الرسمي وخطة الـ 30 يوماً (PDF)' : 'Formal Audit Report & 30-Day Plan (PDF)'}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Loi 08-09 / CNDP
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {isAr
                  ? 'وثيقة رسمية مهيأة للطباعة والمصادقة الإدارية وتقديمها للجنة الوطنية بالرباط'
                  : 'Formal, printable compliance certification dossier formatted for legal submissions'}
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs text-slate-300 hover:text-white transition font-mono"
            >
              {lang === 'ar' ? 'Français / English' : 'العربية'}
            </button>

            {/* Standalone HTML */}
            <button
              onClick={handleExportHtml}
              title={isAr ? 'تحميل كملف ويب مستقل' : 'Download Standalone HTML Document'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs text-slate-300 hover:text-white hover:border-slate-600 transition font-mono"
            >
              <FileText className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden sm:inline">HTML</span>
            </button>

            {/* Print / Save as PDF (Native) */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs text-slate-200 hover:text-white hover:bg-slate-700 transition font-mono"
            >
              <Printer className="h-3.5 w-3.5 text-emerald-400" />
              <span>{isAr ? 'طباعة / حفظ كـ PDF' : 'Print / Save PDF'}</span>
            </button>

            {/* Direct PDF Download */}
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs hover:from-emerald-400 hover:to-teal-300 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50 font-mono"
            >
              {isGeneratingPdf ? (
                <span className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                  <span>{isAr ? 'جاري التوليد...' : 'Generating PDF...'}</span>
                </span>
              ) : downloadSuccess ? (
                <span className="flex items-center gap-1.5 text-slate-950">
                  <Check className="h-4 w-4" />
                  <span>{isAr ? 'تم التحميل!' : 'Downloaded!'}</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Download className="h-4 w-4" />
                  <span>{isAr ? 'تحميل ملف PDF (.pdf)' : 'Download PDF (.pdf)'}</span>
                </span>
              )}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Container */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-8 bg-slate-950/60 flex justify-center">
          {/* A4 Document Canvas Sheet */}
          <div
            ref={printRef}
            id="printable-audit-report"
            dir={isAr ? 'rtl' : 'ltr'}
            className="print-document-container w-full max-w-[850px] bg-white text-slate-900 p-8 sm:p-12 shadow-2xl rounded-sm border border-slate-200 text-xs leading-relaxed space-y-6 select-text"
          >
            {/* 1. Official Document Header */}
            <div className="border-b-2 border-emerald-700 pb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 font-mono">
                    ROYAUME DU MAROC • COMMISION CNDP • DAHIR N° 1-09-15
                  </div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950 font-serif tracking-tight">
                    {isAr ? 'تقرير التدقيق الرسمي للامتثال القانوني والسيادة الرقمية' : 'OFFICIAL COMPLIANCE & PRIVACY AUDIT REPORT'}
                  </h1>
                  <p className="text-xs font-medium text-slate-600">
                    {isAr 
                      ? 'بموجب مقتضيات القانون رقم 08.09 المتعلق بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي'
                      : 'Under the Statutory Provisions of Moroccan Law 08/09 & CNDP Enactments'}
                  </p>
                </div>

                {/* Official Seal Graphic */}
                <div className="shrink-0 flex items-center gap-3 border border-emerald-300 bg-emerald-50/70 p-2.5 rounded-lg text-emerald-950">
                  <div className="h-10 w-10 rounded-full border-2 border-dashed border-emerald-600 flex items-center justify-center font-bold text-base font-serif bg-white text-emerald-800">
                    ★
                  </div>
                  <div className="text-[9px] font-mono leading-tight">
                    <span className="block font-bold text-emerald-900">CNDP MAROC</span>
                    <span>LOI N° 08-09</span>
                    <span className="block text-[8px] text-slate-500">HOMOLOGUÉ</span>
                  </div>
                </div>
              </div>

              {/* Document Meta Row */}
              <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] font-mono text-slate-700">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">{isAr ? 'المرجع الإداري' : 'REFERENCE'}</span>
                  <span className="font-bold text-slate-900">{reportRefNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">{isAr ? 'تاريخ التحرير' : 'AUDIT DATE'}</span>
                  <span className="font-semibold text-slate-900">{reportDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">{isAr ? 'الموقع / النطاق المستهدف' : 'TARGET DOMAIN'}</span>
                  <span className="font-bold text-emerald-800">{report.domain}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase">{isAr ? 'المسؤول عن المعالجة' : 'DATA CONTROLLER'}</span>
                  <span className="font-semibold text-slate-900">{report.businessName}</span>
                </div>
              </div>
            </div>

            {/* 2. Executive Summary & Compliance Score Section */}
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-6 print-avoid-break">
              <div className="space-y-2 flex-1">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>{isAr ? 'موجز القرار والتقييم النهائي' : 'EXECUTIVE VERDICT & CERTIFICATION'}</span>
                </div>
                <h3 className="text-base font-bold text-slate-950 font-serif">
                  {isAr ? report.statusAr : report.status}
                </h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {isAr
                    ? `تم إخضاع المنصة الرقمية (${report.domain}) لفحص شامل يغطي 11 معياراً إلزامياً وفق الظهير الشريف 1.09.15 وقرارات اللجنة الوطنية CNDP.`
                    : `The platform (${report.domain}) underwent systematic evaluation across Moroccan privacy benchmarks under Law 08/09 statutory controls.`}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[10px]">
                  <span className="px-2 py-0.5 rounded border border-rose-200 bg-rose-50 text-rose-800 font-bold">
                    {report.gaps.length} {isAr ? 'مخالفات قانونية' : 'Critical Gaps'}
                  </span>
                  <span className="px-2 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-800 font-bold">
                    {report.warnings.length} {isAr ? 'ملاحظات وتنبيهات' : 'Advisories'}
                  </span>
                  <span className="px-2 py-0.5 rounded border border-emerald-200 bg-emerald-50 text-emerald-800 font-bold">
                    {report.passed.length} {isAr ? 'تدابير مطابقة' : 'Compliant Safeguards'}
                  </span>
                </div>
              </div>

              {/* Large Score Indicator */}
              <div className="shrink-0 text-center border-2 border-slate-300 bg-white p-4 rounded-xl min-w-[140px] shadow-sm">
                <span className="block text-[10px] font-mono uppercase text-slate-500 font-bold">
                  {isAr ? 'مؤشر الامتثال' : 'COMPLIANCE SCORE'}
                </span>
                <div className="text-4xl font-extrabold font-mono text-emerald-700 my-1">
                  {report.score}<span className="text-sm font-normal text-slate-400">/100</span>
                </div>
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                  report.score >= 85 ? 'bg-emerald-100 text-emerald-800' : report.score >= 60 ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {report.score >= 85 ? 'CONFORME CNDP' : report.score >= 60 ? 'PARTIEL / À METTRE À NIVEAU' : 'NON-CONFORME'}
                </span>
              </div>
            </div>

            {/* 3. Technical & Regulatory Assessment Matrix */}
            <div className="space-y-2 print-avoid-break">
              <h4 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider border-b border-slate-200 pb-1 flex items-center justify-between">
                <span>{isAr ? 'مصفوفة الفحص الفني والتنظيمي' : 'STATUTORY AUDIT TELEMETRY MATRIX'}</span>
                <span className="text-[10px] text-slate-500 font-normal">Articles 3, 4, 12, 23, 43</span>
              </h4>

              <table className="w-full text-[11px] border border-slate-200">
                <thead className="bg-slate-100 text-slate-700 font-mono text-[10px]">
                  <tr>
                    <th className="p-2 text-start border-b border-slate-200">{isAr ? 'المعيار الرقابي' : 'Evaluation Domain'}</th>
                    <th className="p-2 text-start border-b border-slate-200">{isAr ? 'السند القانوني' : 'Law Reference'}</th>
                    <th className="p-2 text-center border-b border-slate-200">{isAr ? 'الوضعية' : 'Status'}</th>
                    <th className="p-2 text-start border-b border-slate-200">{isAr ? 'النتيجة والملاحظات' : 'Finding Summary'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-sans">
                  <tr>
                    <td className="p-2 font-semibold text-slate-800">{isAr ? 'تشفير الاتصال والسرية' : 'Transport Encryption (TLS)'}</td>
                    <td className="p-2 font-mono text-slate-500">Loi 08-09 Art. 23</td>
                    <td className="p-2 text-center font-mono font-bold text-emerald-700">{report.metrics.tlsGrade}</td>
                    <td className="p-2 text-slate-600">{isAr ? 'بروتوكول تشفير معتمد لحماية قنوات نقل المعطيات' : 'Channel transport encryption enforced'}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-slate-800">{isAr ? 'إشعار/ترخيص اللجنة الوطنية' : 'CNDP Prior Declaration (D-1/D-2)'}</td>
                    <td className="p-2 font-mono text-slate-500">Loi 08-09 Art. 12 & 23</td>
                    <td className="p-2 text-center font-mono font-bold">
                      {report.metrics.cndpDeclarationFound ? (
                        <span className="text-emerald-700 font-bold">{isAr ? 'مُشهر' : 'Verified'}</span>
                      ) : (
                        <span className="text-rose-700 font-bold">{isAr ? 'غير معلن' : 'Missing'}</span>
                      )}
                    </td>
                    <td className="p-2 text-slate-600">
                      {report.metrics.cndpDeclarationFound 
                        ? (isAr ? 'رقم الوصل القانوني متوفر في الإشعارات القانونية' : 'Formal CNDP receipt reference displayed')
                        : (isAr ? 'عدم إشهار رقم وصل التصريح المسبق الصادر عن CNDP' : 'No formal CNDP authorization number identified')}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-slate-800">{isAr ? 'بوابة ملفات الكوكيز (CMP)' : 'Cookie Consent Gate (CMP)'}</td>
                    <td className="p-2 font-mono text-slate-500">Délibération 08-2020</td>
                    <td className="p-2 text-center font-mono font-bold text-slate-800">{report.metrics.cookieConsentScore}%</td>
                    <td className="p-2 text-slate-600">
                      {isAr ? 'اشتراط الموافقة الصريحة قبل تفعيل ملفات التتبع غير الضرورية' : 'Explicit prior opt-in gate requirement'}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-slate-800">{isAr ? 'السيادة السحابية ومكان الخوادم' : 'Data Sovereignty & Cloud Hosting'}</td>
                    <td className="p-2 font-mono text-slate-500">Loi 08-09 Art. 43 & 44</td>
                    <td className="p-2 text-center font-mono font-bold text-slate-800">
                      {report.sovereigntyStatus.isMoroccanHosting ? (isAr ? 'سيادية (المغرب)' : 'Morocco') : (isAr ? 'أجنبية' : 'Foreign')}
                    </td>
                    <td className="p-2 text-slate-600">{report.sovereigntyStatus.location} — {report.sovereigntyStatus.asn}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold text-slate-800">{isAr ? 'ممارسة حقوق المعنيين بالأمر' : 'Data Subject Rights Portal'}</td>
                    <td className="p-2 font-mono text-slate-500">Loi 08-09 Art. 13-14</td>
                    <td className="p-2 text-center font-mono font-bold">
                      {report.metrics.userRightsPortalPresent ? (
                        <span className="text-emerald-700">{isAr ? 'متاح' : 'Available'}</span>
                      ) : (
                        <span className="text-amber-700">{isAr ? 'جزئي' : 'Missing'}</span>
                      )}
                    </td>
                    <td className="p-2 text-slate-600">{isAr ? 'آلية تقديم طلبات الولوج والتصحيح والتعرض' : 'Dedicated contact workflow for Articles 13-14 rights'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 4. Critical Compliance Gaps (المخالفات وفجوات الامتثال) */}
            <div className="space-y-2 print-avoid-break">
              <h4 className="text-xs font-bold text-rose-800 uppercase font-mono tracking-wider border-b border-rose-200 pb-1 flex items-center justify-between">
                <span>{isAr ? 'فجوات الامتثال والمخالفات المرصودة' : 'RECORDED COMPLIANCE GAPS & STATUTORY INFRACTIONS'}</span>
                <span className="text-[10px] text-rose-600 font-normal">
                  {report.gaps.length} {isAr ? 'مخالفات تستوجب المعالجة' : 'Gaps'}
                </span>
              </h4>

              {report.gaps.length === 0 ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded text-center text-xs">
                  {isAr ? 'لم يتم رصد مخالفات حرجة. المنصة مستوفية للمتطلبات الأساسية.' : 'Zero critical gaps detected under evaluated scopes.'}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {report.gaps.map((gap, index) => (
                    <div key={gap.id || index} className="p-3 bg-rose-50/40 border border-rose-200 rounded space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-950 text-xs">
                          {index + 1}. {isAr ? gap.titleAr : gap.title}
                        </span>
                        <span className="text-[10px] font-mono bg-rose-100 text-rose-900 border border-rose-300 px-2 py-0.5 rounded font-bold">
                          {gap.article}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-700">{gap.impact}</p>
                      <div className="text-[11px] text-emerald-900 bg-white p-2 rounded border border-slate-200">
                        <span className="font-bold text-emerald-800">{isAr ? 'التصحيح الإلزامي: ' : 'Remediation Measure: '}</span>
                        <span>{gap.recommendation}</span>
                      </div>
                      {gap.penaltyEstimate && (
                        <div className="text-[10px] font-mono text-rose-800">
                          <span className="font-bold">{isAr ? 'التبعات والعقوبات القانونية: ' : 'Statutory Sanction (Loi 08-09): '}</span>
                          <span>{gap.penaltyEstimate}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Advisory Warnings & Safeguards Summary */}
            {report.warnings.length > 0 && (
              <div className="space-y-2 print-avoid-break">
                <h4 className="text-xs font-bold text-amber-800 uppercase font-mono tracking-wider border-b border-amber-200 pb-1">
                  {isAr ? 'الملاحظات والتحذيرات الفنية الاستشارية' : 'TECHNICAL ADVISORY WARNINGS'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {report.warnings.map((w, idx) => (
                    <div key={w.id || idx} className="p-2.5 bg-amber-50/40 border border-amber-200 rounded text-[11px]">
                      <div className="flex items-center justify-between font-bold text-amber-950">
                        <span>{isAr ? w.titleAr : w.title}</span>
                        <span className="font-mono text-[9px] text-amber-800">{w.article}</span>
                      </div>
                      <p className="text-[10px] text-slate-600 mt-1">{w.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Page Break for Formal Presentation */}
            <div className="print-page-break pt-4 border-t-2 border-emerald-700"></div>

            {/* 6. The 30-Day Step-by-Step Remediation Plan */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-300 pb-2">
                <div>
                  <h3 className="text-base font-bold text-slate-950 font-serif">
                    {isAr ? 'خطة المعالجة والتوفيق القانوني لـ 30 يوماً' : 'AUTOMATED 30-DAY REMEDIATION ROADMAP'}
                  </h3>
                  <p className="text-[11px] text-slate-600">
                    {isAr
                      ? 'برنامج تنفيذي زمني متدرج مقسم إلى 4 مراحل أسبوعية للوصول للامتثال التام قبل التفتيش الميداني'
                      : 'Sequential 4-week action plan resolving technical vulnerabilities and legal requirements'}
                  </p>
                </div>
                <div className="text-end font-mono text-[10px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                  {isAr ? 'مدة التنفيذ: 30 يوماً تقويمياً' : 'Total Duration: 30 Days'}
                </div>
              </div>

              {/* 4 Weekly Sprints */}
              <div className="space-y-4">
                {report.remediationPlan.map((week) => (
                  <div key={week.weekNumber} className="border border-slate-300 rounded-lg overflow-hidden bg-slate-50/50 print-avoid-break">
                    <div className="bg-slate-100 p-2.5 border-b border-slate-300 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-800 text-white">
                          WEEK {week.weekNumber} • الأسبوع {week.weekNumber}
                        </span>
                        <h5 className="font-bold text-slate-900 text-xs">
                          {isAr ? week.weekTitleAr : week.weekTitle}
                        </h5>
                      </div>
                      <span className="text-[10px] font-mono text-slate-600">{week.phase}</span>
                    </div>

                    <div className="p-3">
                      <p className="text-[11px] text-slate-600 mb-2 leading-relaxed italic">
                        {week.description}
                      </p>

                      <table className="w-full text-[11px] border border-slate-200 bg-white">
                        <thead className="bg-slate-50 text-slate-700 font-mono text-[10px] border-b border-slate-200">
                          <tr>
                            <th className="p-1.5 text-start w-10">#</th>
                            <th className="p-1.5 text-start">{isAr ? 'الإجراء التصحيحي المطلوب' : 'Remediation Task'}</th>
                            <th className="p-1.5 text-center">{isAr ? 'القسم المسؤول' : 'Assigned Role'}</th>
                            <th className="p-1.5 text-center">{isAr ? 'المدة' : 'Duration'}</th>
                            <th className="p-1.5 text-center">{isAr ? 'السند القانوني' : 'Legal Ref'}</th>
                            <th className="p-1.5 text-center">{isAr ? 'الأولوية' : 'Priority'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {week.tasks.map((task, tIdx) => (
                            <tr key={task.id || tIdx}>
                              <td className="p-1.5 font-mono text-slate-400 text-center">{tIdx + 1}</td>
                              <td className="p-1.5 font-medium text-slate-900">{task.title}</td>
                              <td className="p-1.5 text-center font-mono text-[10px] text-slate-700">{task.assignedTo}</td>
                              <td className="p-1.5 text-center font-mono text-[10px] text-slate-500">{task.duration}</td>
                              <td className="p-1.5 text-center font-mono text-[10px] text-emerald-800">{task.lawRef}</td>
                              <td className="p-1.5 text-center font-mono text-[9px]">
                                <span className={`px-1.5 py-0.5 rounded font-bold ${
                                  task.priority === 'Urgent' ? 'bg-rose-100 text-rose-800' : task.priority === 'High' ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-800'
                                }`}>
                                  {task.priority}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. Sign-off, Attestation & Legal Seal Section */}
            <div className="pt-6 border-t-2 border-slate-300 space-y-4 print-avoid-break">
              <div className="bg-slate-50 p-4 border border-slate-200 rounded-lg text-[10px] text-slate-600 leading-relaxed font-sans space-y-1">
                <span className="font-bold text-slate-900 block uppercase font-mono">
                  {isAr ? 'إقرار ومصادقة التدقيق (Attestation de Conformité):' : 'CERTIFICATION ATTESTATION STATEMENT:'}
                </span>
                <p>
                  {isAr
                    ? `يشهد مكتب التدقيق بأن هذا التقرير وخطة الـ 30 يوماً المرفقة قد تم إعدادهما استناداً لمقتضيات الظهير الشريف رقم 1.09.15 الصادر في 22 صفر 1430 (18 فبراير 2009) بتنفيذ القانون رقم 08.09، والقرارات والمداولات الصادرة عن اللجنة الوطنية لمراقبة حماية المعطيات ذات الطابع الشخصي (CNDP).`
                    : `This formal audit report and its 30-day corrective plan are executed in strict accordance with the Kingdom of Morocco Dahir No. 1-09-15 enacting Law No. 08-09 and CNDP guidelines. The entity commits to fulfilling the remediation milestones.`}
                </p>
              </div>

              {/* Signature Blocks */}
              <div className="grid grid-cols-2 gap-8 pt-2">
                {/* DPO Signature */}
                <div className="border border-slate-300 rounded p-3 bg-white space-y-2">
                  <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                    {isAr ? 'المفوض بحماية المعطيات (DPO / CNDP Delegate)' : 'DATA PROTECTION OFFICER (DPO)'}
                  </div>
                  <div className="text-xs font-bold text-slate-900 font-mono">
                    {user ? user.name : 'Yassine El Fassi, DPO Certifié'}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {user ? user.organization : 'Direction de la Conformité Réglementaire'}
                  </div>
                  <div className="h-12 border-b border-dashed border-slate-300 flex items-end pb-1 text-[9px] text-slate-400 font-mono italic">
                    {isAr ? 'توقيع وتأشير DPO مع التاريخ' : 'Signature & Date'}
                  </div>
                </div>

                {/* CISO Signature */}
                <div className="border border-slate-300 rounded p-3 bg-white space-y-2">
                  <div className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                    {isAr ? 'مدير أمن نظم المعلومات (CISO / RSSI)' : 'CHIEF INFORMATION SECURITY OFFICER (CISO)'}
                  </div>
                  <div className="text-xs font-bold text-slate-900 font-mono">
                    Direction Sécurité & Systèmes d'Information
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Audit & Cyber Governance Division
                  </div>
                  <div className="h-12 border-b border-dashed border-slate-300 flex items-end pb-1 text-[9px] text-slate-400 font-mono italic">
                    {isAr ? 'توقيع وخاتم المؤسسة' : 'Official Corporate Seal & Stamp'}
                  </div>
                </div>
              </div>

              {/* Footer text */}
              <div className="pt-2 text-[9px] text-slate-400 font-mono flex flex-col sm:flex-row items-center justify-between gap-1 border-t border-slate-200">
                <span>CNDP — Angle Boulevard Annakhil et Avenue Mehdi Ben Barka, Hay Riad, Rabat</span>
                <span>SOVERIFY REGULATORY PLATFORM v2.6 • MAROC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
