import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  Award, 
  Fingerprint, 
  QrCode, 
  Building2, 
  Calendar, 
  ExternalLink,
  CheckCircle2,
  Lock,
  Globe2
} from 'lucide-react';
import { AuditReport } from '../types';

interface OfficialCertificateModalProps {
  report: AuditReport;
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
}

export const OfficialCertificateModal: React.FC<OfficialCertificateModalProps> = ({
  report,
  isOpen,
  onClose,
  lang
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const isAr = lang === 'ar';

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const certificateId = `CNDP-CERT-${report.id.slice(0, 8).toUpperCase()}-${new Date().getFullYear()}`;
  const issueDate = new Date(report.timestamp).toLocaleDateString(isAr ? 'ar-MA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const expiryDate = new Date(new Date(report.timestamp).getTime() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(isAr ? 'ar-MA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const isCompliant = report.score >= 70;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-white/10 no-print">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {isAr ? 'شهادة المطابقة الرقمية المعتمدة (Law 08/09)' : 'Official Digital Compliance Certificate'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {certificateId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              <Printer className="w-4 h-4" />
              <span>{isAr ? 'طباعة الشهادة' : 'Print Certificate'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Body */}
        <div className="p-6 sm:p-10 overflow-y-auto bg-slate-950 print:bg-white print:text-black">
          <div 
            ref={printRef}
            className="relative mx-auto max-w-3xl p-8 sm:p-12 rounded-3xl border-4 border-double border-emerald-500/50 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-100 shadow-2xl print:border-emerald-700 print:bg-white print:text-black"
          >
            {/* Corner Decorative Guilloche Badges */}
            <div className="absolute top-4 left-4 text-emerald-500/40 text-2xl font-serif">❖</div>
            <div className="absolute top-4 right-4 text-emerald-500/40 text-2xl font-serif">❖</div>
            <div className="absolute bottom-4 left-4 text-emerald-500/40 text-2xl font-serif">❖</div>
            <div className="absolute bottom-4 right-4 text-emerald-500/40 text-2xl font-serif">❖</div>

            {/* Official Header */}
            <div className="text-center pb-6 border-b border-emerald-500/30">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-xl">🇲🇦</span>
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold">
                  {isAr ? 'المملكة المغربية • المعمارية السيادية للبيانات' : 'Kingdom of Morocco • Sovereign Data Governance'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white print:text-slate-900 tracking-tight font-serif mt-1">
                {isAr ? 'شهادة مطابقة حماية المعطيات ذات الطابع الشخصي' : 'Certificate of Data Protection Compliance'}
              </h1>
              <p className="text-xs sm:text-sm text-emerald-300 font-mono mt-1">
                {isAr ? 'وفقاً لمقتضيات القانون رقم 08-09 وتوصيات CNDP' : 'In Accordance with Moroccan Law No. 08-09 & CNDP Guidelines'}
              </p>
            </div>

            {/* Certificate Statement */}
            <div className="my-8 text-center space-y-4">
              <p className="text-xs sm:text-sm text-slate-300 print:text-slate-700">
                {isAr
                  ? 'تشهد منصة Soverify للتدقيق السيادي بأن المنظومة الرقمية للمنشأة التالية قد خضعت للتدقيق والتقييم الآلي الشامل:'
                  : 'This is to officially certify that the digital service infrastructure of the following organization has undergone automated compliance auditing:'}
              </p>

              <div className="py-4 px-6 rounded-2xl bg-black/40 border border-emerald-500/30 inline-block w-full max-w-xl mx-auto shadow-inner">
                <div className="text-xl sm:text-2xl font-bold text-white print:text-black">
                  {report.businessName}
                </div>
                <div className="text-sm font-mono text-emerald-400 font-semibold mt-0.5">
                  {report.domain || report.target}
                </div>
              </div>

              {/* Status & Score */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-2">
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">
                    {isAr ? 'مؤشر الامتثال الكلي' : 'Compliance Score'}
                  </span>
                  <span className="text-3xl font-mono font-extrabold text-emerald-400">
                    {report.score} / 100
                  </span>
                </div>
                <div className="h-10 w-[1px] bg-slate-800" />
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">
                    {isAr ? 'الموقع السيادي للاستضافة' : 'Hosting Sovereignty'}
                  </span>
                  <span className="text-sm font-bold text-teal-300 mt-1 flex items-center gap-1">
                    <Globe2 className="w-3.5 h-3.5 text-teal-400" />
                    {report.sovereigntyStatus.location}
                  </span>
                </div>
                <div className="h-10 w-[1px] bg-slate-800" />
                <div className="flex flex-col items-center">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">
                    {isAr ? 'حالة الاعتماد' : 'Certification Status'}
                  </span>
                  <span className={`text-sm font-bold mt-1 ${isCompliant ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {isCompliant 
                      ? (isAr ? '✓ مؤهل للمطابقة السيادية' : '✓ Verified Compliant') 
                      : (isAr ? '⚠ مشروط بتنفيذ خطة المعالجة' : '⚠ Conditional Remediation')}
                  </span>
                </div>
              </div>
            </div>

            {/* Audit Attributes Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono p-4 rounded-xl bg-slate-900/60 border border-white/5 my-6 text-slate-300">
              <div>
                <span className="block text-[10px] text-slate-400">{isAr ? 'تاريخ الفحص:' : 'Audit Date:'}</span>
                <span className="font-semibold text-white">{issueDate}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400">{isAr ? 'صلاحية الشهادة:' : 'Valid Until:'}</span>
                <span className="font-semibold text-emerald-400">{expiryDate}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400">{isAr ? 'بروتوكول التشفير:' : 'TLS Security:'}</span>
                <span className="font-semibold text-white">{report.metrics.tlsGrade} (TLS 1.3 / Sovereign)</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400">{isAr ? 'إشعار الكوكيز:' : 'Cookie Consent:'}</span>
                <span className="font-semibold text-white">{report.metrics.cookieConsentScore}% {isAr ? 'مطابق' : 'score'}</span>
              </div>
            </div>

            {/* Footer with Seal, QR & Cryptographic Signature */}
            <div className="mt-8 pt-6 border-t border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* QR and Verification Hash */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white text-slate-950 border border-slate-300 shadow">
                  <QrCode className="w-12 h-12" />
                </div>
                <div className="text-[10px] font-mono text-slate-400 max-w-xs space-y-0.5">
                  <div className="text-emerald-400 font-bold">{isAr ? 'رمز التحقق الرقمي المشفر' : 'Cryptographic Verification'}</div>
                  <div className="break-all select-all text-slate-300">{report.signature || 'SHA-256: 8f4a1c7e9b2d...'}</div>
                  <div className="text-[9px] text-slate-400">soverify.ma/verify/{report.id}</div>
                </div>
              </div>

              {/* Sovereign Gold Stamp */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full border-4 border-emerald-500/60 bg-gradient-to-tr from-emerald-950 via-teal-900 to-emerald-900 flex flex-col items-center justify-center text-center shadow-lg shadow-emerald-500/20 rotate-[-6deg]">
                  <ShieldCheck className="w-7 h-7 text-emerald-300" />
                  <span className="text-[8px] font-mono font-bold text-emerald-200 tracking-tighter uppercase">
                    SOVERIFY • CNDP
                  </span>
                  <span className="text-[7px] text-emerald-300 font-bold">2026/2027</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 font-mono">{isAr ? 'ختم المطابقة المعتمد' : 'Official Seal'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
