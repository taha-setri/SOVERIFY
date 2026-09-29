import React, { useState, useMemo } from 'react';
import { 
  X, 
  AlertTriangle, 
  Scale, 
  Coins, 
  ShieldAlert, 
  FileText, 
  Calculator, 
  ArrowRight, 
  Lock, 
  Sliders, 
  Info,
  CheckCircle,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import { AuditReport, ComplianceGap } from '../types';

interface PenaltyCalculatorModalProps {
  report?: AuditReport | null;
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
}

interface LawViolationItem {
  article: string;
  articleTitle: string;
  articleTitleAr: string;
  articleTitleEn?: string;
  minFine: number;
  maxFine: number;
  prisonRisk: boolean;
  prisonTermAr?: string;
  prisonTermEn?: string;
  condition: boolean;
  notesAr: string;
  notesEn: string;
}

export const PenaltyCalculatorModal: React.FC<PenaltyCalculatorModalProps> = ({
  report,
  isOpen,
  onClose,
  lang
}) => {
  const isAr = lang === 'ar';
  const targetDomain = report?.domain || report?.target || 'mon-entreprise.ma';

  // Interactive Simulation Controls
  const [isRepeatOffense, setIsRepeatOffense] = useState(false);
  const [dataSubjectScale, setDataSubjectScale] = useState<number>(10000);
  const [hasCrossBorderBreach, setHasCrossBorderBreach] = useState(
    Boolean(report?.sovereigntyStatus?.crossBorderTransferPermitRequired || !report?.sovereigntyStatus?.isMoroccanHosting)
  );
  const [lacksCndpDeclaration, setLacksCndpDeclaration] = useState(
    Boolean(!report?.metrics?.cndpDeclarationFound)
  );
  const [inadequateSecurity, setInadequateSecurity] = useState(
    Boolean(report?.metrics?.tlsGrade && report.metrics.tlsGrade !== 'A+' && report.metrics.tlsGrade !== 'A')
  );
  const [cookieConsentDeficit, setCookieConsentDeficit] = useState(
    Boolean((report?.metrics?.cookieConsentScore ?? 45) < 70)
  );

  if (!isOpen) return null;

  // Breakdown of statutory violations mapped to Law 08-09
  const violations: LawViolationItem[] = [
    {
      article: 'المادة 53',
      articleTitle: 'Article 53',
      articleTitleAr: 'عدم التصريح المسبق لدى اللجنة الوطنية CNDP',
      articleTitleEn: 'Failure to declare processing to CNDP',
      minFine: 10000,
      maxFine: 100000,
      prisonRisk: false,
      condition: lacksCndpDeclaration,
      notesAr: 'يعاقب بغرامة من 10,000 إلى 100,000 درهم كل من أحدث معالجة دون التصريح المسبق المنصوص عليه في المادة 12.',
      notesEn: 'Fine from 10,000 to 100,000 MAD for processing personal data without prior CNDP declaration (Art. 12).'
    },
    {
      article: 'المادة 54',
      articleTitle: 'Article 54',
      articleTitleAr: 'المعالجة دون موافقة صريحة مسبقة للمستخدم (Consent)',
      articleTitleEn: 'Processing without explicit data subject consent',
      minFine: 20000,
      maxFine: 200000,
      prisonRisk: false,
      condition: cookieConsentDeficit,
      notesAr: 'يعاقب بغرامة من 20,000 إلى 200,000 درهم كل من عالج معطيات شخصية دون الرضا الصريح للشخص المعني.',
      notesEn: 'Fine from 20,000 to 200,000 MAD for processing personal data without explicit unambiguous consent.'
    },
    {
      article: 'المادة 56',
      articleTitle: 'Article 56',
      articleTitleAr: 'نقل معطيات شخصية نحو الخارج دون ترخيص CNDP',
      articleTitleEn: 'Unauthorized cross-border data transfer',
      minFine: 50000,
      maxFine: 300000,
      prisonRisk: true,
      prisonTermAr: 'حبس من 3 أشهر إلى سنة وغرامة مالية',
      prisonTermEn: 'Imprisonment 3 months to 1 year + fine',
      condition: hasCrossBorderBreach,
      notesAr: 'يعاقب بالحبس من 3 أشهر إلى سنة وبغرامة من 50,000 إلى 300,000 درهم أو بإحدى هاتين العقوبتين فقط كل من نقل معطيات إلى بلد أجنبي دون ترخيص CNDP.',
      notesEn: 'Imprisonment 3 months to 1 year and fine 50,000 to 300,000 MAD for unauthorized cross-border data export.'
    },
    {
      article: 'المادة 58',
      articleTitle: 'Article 58',
      articleTitleAr: 'الإخلال بالتدابير الأمنية والسرية والتشفير التقني',
      articleTitleEn: 'Failure to enforce technical security & encryption',
      minFine: 20000,
      maxFine: 200000,
      prisonRisk: false,
      condition: inadequateSecurity,
      notesAr: 'يعاقب بغرامة من 20,000 إلى 200,000 درهم كل من أهمل اتخاذ التدابير التقنية والتنظيمية الضرورية لحفظ أمن وسرية المعطيات.',
      notesEn: 'Fine from 20,000 to 200,000 MAD for failure to enforce confidentiality and technical encryption measures.'
    },
    {
      article: 'المادة 61',
      articleTitle: 'Article 61',
      articleTitleAr: 'عرقلة ممارسة حق الولوج والتصحيح والتعرض',
      articleTitleEn: 'Obstructing citizen rights of access & rectification',
      minFine: 20000,
      maxFine: 100000,
      prisonRisk: false,
      condition: !Boolean(report?.metrics?.userRightsPortalPresent),
      notesAr: 'يعاقب بغرامة من 20,000 إلى 100,000 درهم كل من عرقل ممارسة حقوق الولوج أو التصحيح أو التعرض.',
      notesEn: 'Fine from 20,000 to 100,000 MAD for denying or hindering data subject access/rectification rights.'
    }
  ];

  // Financial calculations
  const activeViolations = violations.filter(v => v.condition);
  const multiplier = isRepeatOffense ? 2 : 1; // Art 63: Double penalty in case of repeat offense within 2 years
  
  const totalMinFine = activeViolations.reduce((sum, v) => sum + v.minFine, 0) * multiplier;
  const totalMaxFine = activeViolations.reduce((sum, v) => sum + v.maxFine, 0) * multiplier;
  const hasImprisonmentRisk = activeViolations.some(v => v.prisonRisk);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-rose-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>{isAr ? 'حاسبة المخاطر المالية والجنائية (القانون 08/09)' : 'Law 08/09 Penalty & Financial Liability Calculator'}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono">MAD</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {targetDomain}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Executive Risk Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Financial Exposure Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-950 border border-rose-500/40 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-rose-300 font-bold flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-rose-400" />
                  {isAr ? 'إجمالي الغرامات القانونية المقدرة' : 'Estimated Statutory Fines'}
                </span>
                <div className="mt-2">
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
                    {totalMinFine.toLocaleString()} - {totalMaxFine.toLocaleString()}
                  </div>
                  <div className="text-xs font-bold text-rose-400 font-mono mt-0.5">
                    {isAr ? 'درهم مغربي (MAD)' : 'Moroccan Dirham'}
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-white/5">
                {isAr ? `بناءً على المواد 53 إلى 64 من القانون 08-09 (${activeViolations.length} مخالفات)` : `Based on Arts 53-64 (${activeViolations.length} active violations)`}
              </p>
            </div>

            {/* Criminal Sanctions Card */}
            <div className={`p-5 rounded-2xl border shadow-xl flex flex-col justify-between ${
              hasImprisonmentRisk 
                ? 'bg-gradient-to-br from-red-950/60 to-slate-950 border-red-500/60 text-white' 
                : 'bg-slate-900/60 border-emerald-500/30 text-slate-300'
            }`}>
              <div>
                <span className={`text-xs font-mono uppercase font-bold flex items-center gap-1.5 ${hasImprisonmentRisk ? 'text-red-400' : 'text-emerald-400'}`}>
                  <ShieldAlert className="w-4 h-4" />
                  {isAr ? 'المسؤولية الجنائية للمسيرين' : 'Officer Criminal Liability'}
                </span>
                <div className="mt-2">
                  <div className="text-lg font-bold">
                    {hasImprisonmentRisk 
                      ? (isAr ? '⚠️ خطر عقوبة سالبة للحرية' : '⚠️ Imprisonment Liability Active') 
                      : (isAr ? '✓ غير مشمول بعقوبات سالبة' : '✓ No Direct Prison Risk')}
                  </div>
                  <div className="text-xs text-slate-300 mt-1">
                    {hasImprisonmentRisk 
                      ? (isAr ? 'حبس من 3 أشهر إلى سنة (المادة 56 - نقل البيانات للخارج)' : '3 to 12 months (Art 56 - Cross-border transfer)') 
                      : (isAr ? 'مقتصر على الغرامات الإدارية والمالية' : 'Restricted to administrative & civil fines')}
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-white/5">
                {isAr ? 'تطال المسؤول القانوني وممثل الشركة' : 'Applies to Legal Representative & C-Suite'}
              </div>
            </div>

            {/* Scale of Impact Card */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 shadow-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-teal-400 font-bold flex items-center gap-1.5">
                  <Sliders className="w-4 h-4" />
                  {isAr ? 'معامل التكرار وحجم المتأثرين' : 'Repetition & Scale Factor'}
                </span>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={isRepeatOffense}
                      onChange={(e) => setIsRepeatOffense(e.target.checked)}
                      className="w-4 h-4 text-rose-500 rounded bg-slate-800 border-slate-700"
                    />
                    <span className="text-xs font-semibold text-slate-200">
                      {isAr ? 'حالة العود (المادة 63: مضاعفة الغرامة)' : 'Repeat Offense (Art 63: 2x Fines)'}
                    </span>
                  </label>
                  <div className="text-[11px] text-slate-400">
                    {isRepeatOffense 
                      ? (isAr ? 'مطبق: تمت مضاعفة العقوبة مرتين' : 'Applied: Fines doubled within 2-year window') 
                      : (isAr ? 'مخالفة أولية مفترضة' : 'First-time observed violation')}
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 pt-2 border-t border-white/5">
                {isAr ? 'سجل CNDP الرقابي السنوي' : 'Official CNDP Inspection Track'}
              </div>
            </div>
          </div>

          {/* Interactive Toggle Simulator for What-If Analysis */}
          <div className="p-5 rounded-2xl bg-black/40 border border-white/10">
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'محاكاة السيناريوهات القانونية (تعديل وضعية الامتثال):' : 'Interactive Legal Simulation Matrix:'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <button
                onClick={() => setHasCrossBorderBreach(!hasCrossBorderBreach)}
                className={`p-3 rounded-xl border text-right transition cursor-pointer flex flex-col justify-between ${
                  hasCrossBorderBreach 
                    ? 'border-rose-500/50 bg-rose-950/30 text-rose-200' 
                    : 'border-slate-800 bg-slate-900/40 text-slate-400'
                }`}
              >
                <span className="font-bold">{isAr ? 'نقل البيانات للخارج دون ترخيص' : 'Cross-border transfer without permit'}</span>
                <span className="text-[10px] mt-1 font-mono">{hasCrossBorderBreach ? '🔴 المادة 56 مفعلة' : '⚪ معالجة محليا'}</span>
              </button>

              <button
                onClick={() => setLacksCndpDeclaration(!lacksCndpDeclaration)}
                className={`p-3 rounded-xl border text-right transition cursor-pointer flex flex-col justify-between ${
                  lacksCndpDeclaration 
                    ? 'border-rose-500/50 bg-rose-950/30 text-rose-200' 
                    : 'border-slate-800 bg-slate-900/40 text-slate-400'
                }`}
              >
                <span className="font-bold">{isAr ? 'غياب التصريح المسبق CNDP' : 'Unregistered CNDP Database'}</span>
                <span className="text-[10px] mt-1 font-mono">{lacksCndpDeclaration ? '🔴 المادة 53 مفعلة' : '⚪ مصرح بها'}</span>
              </button>

              <button
                onClick={() => setCookieConsentDeficit(!cookieConsentDeficit)}
                className={`p-3 rounded-xl border text-right transition cursor-pointer flex flex-col justify-between ${
                  cookieConsentDeficit 
                    ? 'border-amber-500/50 bg-amber-950/30 text-amber-200' 
                    : 'border-slate-800 bg-slate-900/40 text-slate-400'
                }`}
              >
                <span className="font-bold">{isAr ? 'جمع كوكيز بدون رضا مسبق' : 'Tracking without prior consent'}</span>
                <span className="text-[10px] mt-1 font-mono">{cookieConsentDeficit ? '🟡 المادة 54 مفعلة' : '⚪ رضا مطابق'}</span>
              </button>

              <button
                onClick={() => setInadequateSecurity(!inadequateSecurity)}
                className={`p-3 rounded-xl border text-right transition cursor-pointer flex flex-col justify-between ${
                  inadequateSecurity 
                    ? 'border-amber-500/50 bg-amber-950/30 text-amber-200' 
                    : 'border-slate-800 bg-slate-900/40 text-slate-400'
                }`}
              >
                <span className="font-bold">{isAr ? 'ضعف التشفير وإجراءات الأمان' : 'Weak SSL/TLS Encryption'}</span>
                <span className="text-[10px] mt-1 font-mono">{inadequateSecurity ? '🟡 المادة 58 مفعلة' : '⚪ تشفير سيادي'}</span>
              </button>
            </div>
          </div>

          {/* Detailed Violation Matrix Table */}
          <div className="rounded-2xl border border-white/10 overflow-hidden bg-slate-950">
            <div className="px-5 py-3 bg-slate-900/80 border-b border-white/10 font-bold text-xs text-slate-300">
              {isAr ? 'تفصيل الغرامات المترتبة حسب فصول القانون 08-09' : 'Detailed Statutory Penalty Breakdown'}
            </div>
            <div className="divide-y divide-white/5">
              {activeViolations.length === 0 ? (
                <div className="p-8 text-center text-slate-400 font-mono text-sm">
                  ✓ {isAr ? 'لا توجد مخالفات مفعلة وفقاً لسيناريو المحاكاة المحدد.' : 'No active statutory violations detected in this simulation.'}
                </div>
              ) : (
                activeViolations.map((v, i) => (
                  <div key={i} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-mono font-bold text-xs">
                          {v.article}
                        </span>
                        <h5 className="font-bold text-white text-sm">
                          {isAr ? v.articleTitleAr : v.articleTitleEn}
                        </h5>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                        {isAr ? v.notesAr : v.notesEn}
                      </p>
                    </div>

                    <div className="sm:text-left shrink-0 font-mono">
                      <div className="text-sm font-extrabold text-white">
                        {(v.minFine * multiplier).toLocaleString()} - {(v.maxFine * multiplier).toLocaleString()} MAD
                      </div>
                      {v.prisonRisk && (
                        <div className="text-[11px] text-red-400 font-bold flex items-center gap-1 mt-0.5">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{isAr ? v.prisonTermAr : v.prisonTermEn}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/90 border-t border-white/10 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono">
            {isAr ? 'وفق مقتضيات الظهير الشريف رقم 1.09.15' : 'Official Dahir No. 1.09.15 Reference'}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
          >
            {isAr ? 'إغلاق الحاسبة' : 'Close Calculator'}
          </button>
        </div>
      </div>
    </div>
  );
};
