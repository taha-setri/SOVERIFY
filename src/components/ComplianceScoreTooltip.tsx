import React, { useState, useRef, useEffect } from 'react';
import { Info, HelpCircle, Scale, ShieldCheck, ShieldAlert, AlertTriangle, ExternalLink } from 'lucide-react';

export interface ComplianceScoreTooltipProps {
  score: number;
  lang: 'ar' | 'en';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const ComplianceScoreTooltip: React.FC<ComplianceScoreTooltipProps> = ({
  score,
  lang,
  size = 'md',
  showLabel = false,
  className = '',
  children
}) => {
  const isAr = lang === 'ar';
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const getTierDetails = (s: number) => {
    if (s >= 85) {
      return {
        tierAr: 'ممتثل للمعايير (Conforme CNDP)',
        tierEn: 'Fully Compliant (CNDP Standard)',
        badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40',
        summaryAr: 'الموقع يحقق اشتراطات التشفير، التصريح المسبق، سياسة الكوكيز وحماية المعطيات الشخصية بنجاح.',
        summaryEn: 'Meets mandatory transport cryptography, CNDP prior declaration, cookie consent, and digital sovereignty.',
        legalRiskAr: 'مخاطر قانونية منخفضة / شهادة مطابقة مؤهلة',
        legalRiskEn: 'Low regulatory risk / Eligible for CNDP compliance certification'
      };
    } else if (s >= 70) {
      return {
        tierAr: 'امتثال جزئي مع تنبيهات (Réserves)',
        tierEn: 'Partially Compliant (With Observations)',
        badgeColor: 'text-teal-400 bg-teal-950/80 border-teal-500/40',
        summaryAr: 'تتوفر تدابير أمنية أساسية، لكن توجد نواقص إجرائية أو غموض في فترات الاحتفاظ أو بيانات الاتصال بالـ DPO.',
        summaryEn: 'Core security verified; minor procedural gaps in DPO contacts, retention periods or declaration receipts.',
        legalRiskAr: 'يتطلب تصحيحاً خلال 30 يوماً لتجنب إخطار CNDP',
        legalRiskEn: 'Correction required within 30 days to avoid CNDP formal observations'
      };
    } else if (s >= 50) {
      return {
        tierAr: 'غير ممتثل - مخاطر قانونية (Non-Conforme)',
        tierEn: 'Non-Compliant (Legal Risks Detected)',
        badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-500/40',
        summaryAr: 'رصد مخالفات جوهرية مثل نشر سكريبتات تتبع قبل موافقة الزائر أو غياب آلية ممارسة الحقوق (المادة 7-9).',
        summaryEn: 'Substantial violations detected: pre-consent tracking cookies, missing user rights mechanisms (Arts. 7-9).',
        legalRiskAr: 'عرضة لتوجيه إنذار رسمي (Mise en demeure) وغرامات',
        legalRiskEn: 'Exposed to CNDP formal notice (Mise en demeure) and administrative penalties'
      };
    } else {
      return {
        tierAr: 'مخالفة صريحة - عقوبات زجرية (Infraction Critique)',
        tierEn: 'Critical Infraction (High Sanctions Risk)',
        badgeColor: 'text-rose-400 bg-rose-950/80 border-rose-500/40',
        summaryAr: 'خرق صريح للتدابير الأمنية (المادة 23) أو نقل غير مرخص خارج المغرب (المادة 43) أو معالجة سرية دون إشعار.',
        summaryEn: 'Critical breach of security (Art. 23), unauthorized international transfer (Art. 43), or clandestine processing.',
        legalRiskAr: 'غرامات مالية من 20.000 إلى 300.000 درهم وعقوبات سالبة للحرية (المواد 52-64)',
        legalRiskEn: 'Financial penalties 20,000 to 300,000 MAD and penal sanctions under Articles 52-64'
      };
    }
  };

  const tier = getTierDetails(score);

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center gap-1 ${className}`}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* If children are passed, render them as the trigger */}
      {children ? (
        <div
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsOpen(true)}
          className="cursor-help inline-flex items-center gap-1 focus:outline-none"
          role="button"
          tabIndex={0}
          aria-label={isAr ? 'دليل منهجية احتساب مؤشر الامتثال' : 'Compliance scoring methodology guide'}
        >
          {children}
          <HelpCircle className="h-3.5 w-3.5 text-slate-400 hover:text-emerald-400 transition shrink-0 opacity-70 hover:opacity-100" />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsOpen(true)}
          className="inline-flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition p-1 rounded-md hover:bg-slate-800/60 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
          title={isAr ? 'منهجية احتساب النقاط وفق القانون 08.09' : 'Law 08/09 scoring methodology'}
          aria-expanded={isOpen}
        >
          <Info className={size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} />
          {showLabel && (
            <span className="text-[11px] font-mono text-slate-400 underline decoration-slate-600 underline-offset-2">
              {isAr ? 'منهجية الاحتساب' : 'Grading Rules'}
            </span>
          )}
        </button>
      )}

      {/* Popover Tooltip Box */}
      {isOpen && (
        <div
          onMouseLeave={() => setIsOpen(false)}
          className={`absolute z-50 bottom-full ${
            isAr ? 'right-0 sm:-right-8' : 'left-0 sm:-left-8'
          } mb-2 w-80 sm:w-96 rounded-2xl border border-emerald-500/40 bg-slate-900/98 p-4 text-xs shadow-2xl shadow-black/80 backdrop-blur-xl animate-fadeIn`}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Scale className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">
                  {isAr ? 'منهجية تقييم الامتثال (القانون 08.09)' : 'Law 08/09 Grading Methodology'}
                </h4>
                <span className="text-[10px] font-mono text-slate-400">
                  {isAr ? 'الظهير الشريف 1.09.15 ومداولات CNDP' : 'Dahir n° 1-09-15 & CNDP Standards'}
                </span>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="text-slate-500 hover:text-slate-300 text-xs px-1"
            >
              ✕
            </button>
          </div>

          {/* Current Score Context */}
          <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/70 p-2.5 space-y-1.5 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{isAr ? 'الدرجة المسجلة:' : 'Evaluated Score:'}</span>
              <span className={`px-2 py-0.5 rounded font-bold border text-[11px] ${tier.badgeColor}`}>
                {score} / 100 — {isAr ? tier.tierAr : tier.tierEn}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
              {isAr ? tier.summaryAr : tier.summaryEn}
            </p>
            <div className="text-[10px] text-amber-300/90 font-sans flex items-center gap-1 pt-1 border-t border-slate-800/60">
              <ShieldAlert className="h-3 w-3 shrink-0" />
              <span>{isAr ? tier.legalRiskAr : tier.legalRiskEn}</span>
            </div>
          </div>

          {/* 4 Pillars Scoring Matrix Breakdown */}
          <div className="mt-3 space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
              {isAr ? 'توزيع المحاور الأربعة (100 نقطة):' : 'Scoring Breakdown (4 Pillars × 25 pts):'}
            </span>

            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-2 space-y-0.5">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-slate-300 font-bold">{isAr ? 'التشفير (TLS)' : 'Encryption'}</span>
                  <span className="text-emerald-400 font-bold">25 {isAr ? 'نقطة' : 'pts'}</span>
                </div>
                <span className="text-[10px] text-slate-500 block">{isAr ? 'المادة 23 (الأمن وسرية المعالجة)' : 'Art. 23 (Data Security & TLS)'}</span>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-2 space-y-0.5">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-slate-300 font-bold">{isAr ? 'إشعار CNDP' : 'CNDP Filing'}</span>
                  <span className="text-emerald-400 font-bold">25 {isAr ? 'نقطة' : 'pts'}</span>
                </div>
                <span className="text-[10px] text-slate-500 block">{isAr ? 'المادة 12 و52 (التصريح والترخيص)' : 'Arts. 12 & 52 (Prior Notice)'}</span>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-2 space-y-0.5">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-slate-300 font-bold">{isAr ? 'موافقة الكوكيز' : 'Cookie CMP'}</span>
                  <span className="text-emerald-400 font-bold">25 {isAr ? 'نقطة' : 'pts'}</span>
                </div>
                <span className="text-[10px] text-slate-500 block">{isAr ? 'مداولة 08-2020 (حظر التتبع المسبق)' : 'Deliberation 08-2020'}</span>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-2 space-y-0.5">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-slate-300 font-bold">{isAr ? 'السيادة السحابية' : 'Sovereignty'}</span>
                  <span className="text-emerald-400 font-bold">25 {isAr ? 'نقطة' : 'pts'}</span>
                </div>
                <span className="text-[10px] text-slate-500 block">{isAr ? 'المادة 43 و44 (نقل المعطيات للخارج)' : 'Arts. 43 & 44 (Data Transfer)'}</span>
              </div>
            </div>
          </div>

          {/* Legal Scale Ladder */}
          <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>≥85%: {isAr ? 'ممتثل' : 'Compliant'}</span>
            </span>
            <span className="flex items-center gap-1 text-teal-400">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
              <span>70-84%: {isAr ? 'تنبيهات' : 'Advisory'}</span>
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span>50-69%: {isAr ? 'مخاطر' : 'Risk'}</span>
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
              <span>&lt;50%: {isAr ? 'زجري' : 'Sanction'}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
