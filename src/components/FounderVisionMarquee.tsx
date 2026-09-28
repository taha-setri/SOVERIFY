import React from 'react';
import { Quote, Sparkles, ArrowLeft, ArrowRight, ShieldCheck, Award } from 'lucide-react';

interface FounderVisionMarqueeProps {
  lang: 'ar' | 'en';
  onOpenVisionScreen?: () => void;
}

export const FounderVisionMarquee: React.FC<FounderVisionMarqueeProps> = ({ 
  lang, 
  onOpenVisionScreen 
}) => {
  const isAr = lang === 'ar';

  const quoteAr =
    'لم تعد حماية المعطيات مجرد بند قانوني، بل الركيزة الصلبة للأمن القومي وبناء الثقة في الاقتصاد الرقمي المغربي. إن تحصين البنية التحتية والامتثال لقوانين CNDP هو استثمار استراتيجي يصون سمعة المؤسسة وهيمنتها السوقية.';
  const quoteEn =
    'Data protection is no longer a mere legal formality, but the solid pillar of national security and trust in Morocco\'s digital economy. Hardening sovereign infrastructure and complying with CNDP regulations is a strategic imperative safeguarding enterprise reputation and digital sovereignty.';

  return (
    <section className="rounded-2xl sm:rounded-3xl border border-slate-800 bg-gradient-to-r from-[#070d1e] via-[#050914] to-[#0a1226] p-5 sm:p-7 shadow-xl relative overflow-hidden">
      {/* Decorative ambient lights */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        {/* Founder Avatar & Identification */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-[2px] bg-gradient-to-tr from-amber-500 via-emerald-500 to-teal-400 shadow-lg shadow-emerald-950/50">
              <div className="w-full h-full rounded-[14px] bg-slate-950 overflow-hidden">
                <img
                  src={localStorage.getItem('soverify_founder_custom_photo') || "/taha_setri.jpg"}
                  alt="طه الستري (Taha Setri)"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 rounded-full p-1 border-2 border-slate-950 shadow pointer-events-none">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded">
                VerifyOS™
              </span>
              <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                المملكة المغربية
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white mt-1">
              طه الستري <span className="text-xs font-normal text-slate-400 font-mono">(Taha Setri)</span>
            </h3>
            <p className="text-xs text-slate-300 font-medium">
              {isAr ? 'المؤسس ورئيس المعمارية السيادية' : 'Founder & Chief Architect'}
            </p>
          </div>
        </div>

        {/* Clean, readable quote (Ample space, NO overlap, NO ticker) */}
        <div className="flex-1 text-center md:text-right border-y md:border-y-0 md:border-r border-slate-800/80 py-4 md:py-0 md:pr-6 md:mr-2">
          <div className="flex items-start gap-2">
            <Quote className="h-5 w-5 text-amber-400 shrink-0 mt-0.5 hidden sm:block opacity-75" />
            <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
              «{isAr ? quoteAr : quoteEn}»
            </p>
          </div>
        </div>

        {/* Action Button & Signature */}
        <div className="flex flex-col items-center md:items-end gap-2 shrink-0">
          <span 
            style={{ fontFamily: "'Alex Brush', 'Dancing Script', cursive" }} 
            className="text-2xl sm:text-3xl text-amber-300 font-normal tracking-wide select-none drop-shadow-[0_2px_8px_rgba(245,158,11,0.3)] rotate-[-3deg] inline-block"
          >
            Taha Setri
          </span>

          {onOpenVisionScreen && (
            <button
              onClick={onOpenVisionScreen}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 px-3.5 py-1.5 text-xs font-mono font-bold transition shadow-sm cursor-pointer"
            >
              <span>{isAr ? 'رؤية المؤسس الكاملة' : 'View Full Manifesto'}</span>
              {isAr ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
