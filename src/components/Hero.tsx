import React from 'react';
import { ShieldCheck, Lock, Award, Server, FileCheck, CheckCircle2, ChevronDown } from 'lucide-react';

interface HeroProps {
  lang: 'ar' | 'en';
  onQuickAudit?: (domain: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ lang }) => {
  const isAr = lang === 'ar';

  return (
    <section className="relative pt-6 pb-4 sm:pt-8 sm:pb-6 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden pointer-events-none">
        <div className="h-80 w-[700px] rounded-full bg-emerald-600/10 blur-[130px]" />
        <div className="h-60 w-60 rounded-full bg-amber-500/5 blur-[100px]" />
      </div>

      <div className="max-w-5xl mx-auto text-center space-y-6">
        {/* Ministerial & Sovereign Header Seal */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="relative">
            <img
              src="/src/assets/images/morocco_sovereign_seal_1790488166778.jpg"
              alt="ختم السيادة الرقمية للمملكة المغربية"
              className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border-2 border-amber-500/40 shadow-xl shadow-amber-950/40 object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="text-center sm:text-right">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-mono text-amber-300 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {isAr
                  ? 'المملكة المغربية · المنظومة الوطنية المرجعية للسيادة الرقمية · مرجع CNDP'
                  : 'Kingdom of Morocco · National Digital Sovereignty Authority · CNDP Reference'}
              </span>
            </div>
            <div className="text-xs font-mono text-slate-400 mt-1">
              {isAr
                ? 'الظهير الشريف رقم 1.09.15 بتنفيذ القانون رقم 08.09 المتعلق بحماية المعطيات الشخصية'
                : 'Dahir No. 1-09-15 Enacting Law No. 08-09 on Personal Data Protection'}
            </div>
          </div>
        </div>

        {/* Majestic Sovereign Title */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {isAr ? (
              <>
                المنصة الوطنية للسيادة الرقمية <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                  ومراقبة الامتثال للقانون المغربي 08-09
                </span>
              </>
            ) : (
              <>
                National Digital Sovereignty Portal <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                  & Moroccan Law 08/09 Compliance Verification
                </span>
              </>
            )}
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            {isAr
              ? 'المنظومة السيادية الأولى المؤتمتة بالمملكة المغربية لإجراء التدقيق الشامل والفوري لأي منصة أو موقع إلكتروني: التحقق من تراخيص CNDP، فحص الاستضافة والتوطين المحلي، رصد سكريبتات التتبع غير المرخصة، وتوليد التقارير الرسمية والخطط التصحيحية.'
              : 'Morocco’s autonomous RegTech inspection engine for real-time audit of any digital platform: CNDP prior declaration checks, cross-border data residency verification, unconsented cookie tracker detection, and certified remediation reports.'}
          </p>
        </div>

        {/* 4 Sovereign Pillars Guarantee */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-right">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs mb-1">
              <Server className="h-4 w-4 shrink-0" />
              <span>{isAr ? 'السيادة السحابية (المادة 43)' : 'Data Sovereignty'}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              {isAr ? 'التأكد من توطين المعطيات الحساسة داخل مراكز بيانات وطنية مغربية.' : 'Verified in-kingdom hosting and cross-border transfer authorization.'}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs mb-1">
              <FileCheck className="h-4 w-4 shrink-0" />
              <span>{isAr ? 'تصريح CNDP (المادة 53)' : 'CNDP Prior Receipt'}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              {isAr ? 'فحص وصل الإيداع المسبق D-1 ورقم الترخيص القانوني لمعالجة المعطيات.' : 'Automated extraction of formal D-1 declaration and legal filings.'}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-teal-400 font-bold text-xs mb-1">
              <Lock className="h-4 w-4 shrink-0" />
              <span>{isAr ? 'الكوكيز (المداولة 08-2020)' : 'Cookie Consent Rule'}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              {isAr ? 'حظر أي زرع لملفات التتبع الإعلاني قبل الموافقة الصريحة الحرة.' : 'Strict prohibition of trackers before user consent mechanism.'}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-xs mb-1">
              <Award className="h-4 w-4 shrink-0" />
              <span>{isAr ? 'توقيع مشفر SHA-256' : 'SHA-256 Cryptography'}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              {isAr ? 'بصمة تدقيق رقمية غير قابلة للتعديل محفوظة في DataStore Vault.' : 'Tamper-proof cryptographic signature for executive & judicial use.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

