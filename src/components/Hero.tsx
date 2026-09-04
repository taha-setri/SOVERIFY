import React from 'react';
import { Shield, Lock, FileCheck2, Cpu, ArrowRight } from 'lucide-react';

interface HeroProps {
  lang: 'ar' | 'en';
  onQuickAudit: (domain: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, onQuickAudit }) => {
  const isAr = lang === 'ar';

  const presets = [
    { label: 'banque-digitale.ma', name: isAr ? 'بوابة بنكية مغربية' : 'Moroccan Digital Bank' },
    { label: 'ecommerce-maroc.ma', name: isAr ? 'متجر إلكتروني محلي' : 'Local E-Commerce Store' },
    { label: 'sante-teleconsult.ma', name: isAr ? 'منصة استشارات طبية' : 'Health Teleconsultation' },
    { label: 'startup-fintech.ma', name: isAr ? 'تطبيق خدمات مالية' : 'Fintech SaaS App' }
  ];

  return (
    <div className="relative pt-6 pb-4 sm:pt-10 sm:pb-8">
      {/* Background glow and grid overlay */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div className="h-72 w-[600px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
        <div className="h-48 w-48 rounded-full bg-blue-500/5 blur-[90px] pointer-events-none" />
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-4">
        {/* Compliance Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono text-emerald-400 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>
            {isAr
              ? 'مراقبة الامتثال للقانون رقم 08.09 ومداولات اللجنة الوطنية CNDP'
              : 'Moroccan Law 08/09 & CNDP Regulatory Verification Engine'}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          {isAr ? (
            <>
              تدقيق السيادة الرقمية <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                وحماية المعطيات الشخصية في المغرب
              </span>
            </>
          ) : (
            <>
              Automated Digital Sovereignty <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                & Moroccan Law 08/09 Compliance Audit
              </span>
            </>
          )}
        </h1>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed">
          {isAr
            ? 'فحص شامل وفوري للثغرات القانونية والتقنية: تراخيص CNDP، تشفير البيانات، ملفات تعريف الارتباط، السيادة السحابية، وخطة علاجية مؤتمتة لمدة 30 يوماً.'
            : 'Autonomous scanning for personal data security, mandatory CNDP prior declaration receipts, cookie trackers, cross-border hosting, and 30-day corrective action plans.'}
        </p>

        {/* Quick presets */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-500 font-mono text-[11px]">
            {isAr ? 'أمثلة سريعة للفحص:' : 'Quick Presets:'}
          </span>
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => onQuickAudit(p.label)}
              className="rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-slate-300 hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-slate-800/80 transition flex items-center gap-1 font-mono text-[11px]"
            >
              <span>{p.label}</span>
              <ArrowRight className={`h-3 w-3 ${isAr ? 'rotate-180' : ''}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
