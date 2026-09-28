import React, { useState } from 'react';
import { MapPin, Globe, Shield, ShieldCheck, FileClock, Bot, Code2, CheckCircle, ExternalLink } from 'lucide-react';

interface FooterProps {
  lang: 'ar' | 'en';
  onNavigateTab: (tab: string) => void;
  onOpenPythonModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  onNavigateTab,
  onOpenPythonModal,
}) => {
  const isAr = lang === 'ar';
  const [imgError, setImgError] = useState(false);
  const [customPhoto] = useState<string | null>(() => {
    try {
      return localStorage.getItem('soverify_founder_custom_photo');
    } catch {
      return null;
    }
  });

  return (
    <footer id="main-footer" className="border-t border-slate-800/90 bg-gradient-to-b from-slate-950 via-[#070c14] to-black text-slate-400 font-sans relative overflow-hidden">
      {/* Decorative top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
      <div className="absolute top-0 right-1/4 w-48 h-24 bg-emerald-500/5 blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-48 h-24 bg-rose-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Founder & Identity Showcase Card */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md shadow-2xl mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* 1. Founder Section (بطاقة المؤسس) */}
            <div className="flex items-center gap-5 sm:gap-6 w-full lg:w-auto">
              {/* Circular Avatar with Distinctive Moroccan Tricolor Ring */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-[3px] bg-gradient-to-tr from-emerald-600 via-rose-700 to-emerald-500 shadow-xl shadow-emerald-950/40">
                  <div className="w-full h-full rounded-full p-[2px] bg-slate-950 overflow-hidden">
                    {!imgError ? (
                      <img
                        src={customPhoto || "/taha_setri.jpg"}
                        alt="طه ستري (Taha Setri)"
                        referrerPolicy="no-referrer"
                        onError={() => setImgError(true)}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-emerald-400 font-bold font-mono text-xl">
                        TS
                      </div>
                    )}
                  </div>
                </div>

                {/* Active verified badge on right */}
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 rounded-full p-1 border-2 border-slate-950 shadow pointer-events-none">
                  <Shield className="w-3.5 h-3.5 fill-current" />
                </div>
              </div>

              {/* Founder Information & Signature */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                    طه ستري <span className="text-emerald-400 font-bold">(Taha Setri)</span>
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-300 font-medium mt-0.5">
                  <span className="text-slate-200 font-semibold">مؤسس Soverify</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-emerald-400/90 font-mono text-xs">Founder of Soverify</span>
                </div>

                <div className="flex items-center gap-4 mt-2.5">
                  <span className="text-xs font-mono text-slate-400 bg-slate-800/70 border border-slate-700/60 px-2.5 py-0.5 rounded-md">
                    مايو 2026 (May 2026)
                  </span>

                  {/* Elegant Signature Rendering */}
                  <div className="flex items-center">
                    <span 
                      style={{ fontFamily: "'Alex Brush', 'Dancing Script', cursive" }} 
                      className="text-2xl sm:text-3xl text-emerald-300 font-normal tracking-wide select-none drop-shadow-[0_2px_8px_rgba(16,185,129,0.3)] rotate-[-4deg] inline-block"
                      title="Signature: Taha Setri"
                    >
                      Taha Setri
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider on mobile */}
            <div className="w-full h-px bg-slate-800 lg:hidden" />

            {/* 2. Platform Logo & Official Brand Identity (شعار المنصة الرسمي) */}
            <div className="flex items-center gap-4 lg:gap-6 self-center lg:self-auto">
              {/* Official Platform Logo */}
              <div className="relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-1 bg-gradient-to-tr from-emerald-500/30 via-slate-800 to-rose-500/30 border border-slate-700/60 shadow-xl overflow-hidden flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Soverify Official Brand Logo"
                  className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                  onError={(e) => {
                    (e.target as HTMLElement).src = '/logo.jpg';
                  }}
                />
              </div>

              {/* Brand Typography: Soverify */}
              <div className="flex flex-col">
                <div className="flex items-center tracking-tight text-3xl sm:text-4xl font-extrabold text-emerald-400 font-sans select-none">
                  <span className="text-emerald-400">S</span>
                  {/* Moroccan Star Red Dot for the 'o' */}
                  <span className="relative inline-flex items-center justify-center mx-[1px] w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-red-600 to-rose-700 shadow-inner">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-950 fill-current" viewBox="0 0 24 24">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                  </span>
                  <span className="text-emerald-400">verify</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 mt-0.5 tracking-wider uppercase">
                  Digital Sovereignty Auditor
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Geographical Location & Regional Sovereignty Notice */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-5 rounded-xl bg-slate-950/60 border border-slate-800/70 text-xs text-slate-400 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">🇲🇦</span>
            <div className="flex items-center gap-1.5 font-medium text-slate-300">
              <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
              <span>مقر المؤسسة والتواجد الرقمي:</span>
              <strong className="text-white font-bold">تطوان مارتيل، المغرب (Tetouan-Martil, Morocco)</strong>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              استضافة سيادية ومطابقة لمعايير CNDP
            </span>
            <span>•</span>
            <span>Rabat-Casablanca Hub</span>
          </div>
        </div>

        {/* Navigation Shortcuts */}
        <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-5 text-xs text-slate-400 pb-6 border-b border-slate-900">
          <button 
            onClick={() => onNavigateTab('updates')} 
            className="hover:text-emerald-400 transition flex items-center gap-1.5"
          >
            <Globe className="h-3.5 w-3.5 text-emerald-400" />
            <span>{isAr ? 'مستجدات CNDP المباشرة' : 'CNDP Updates'}</span>
          </button>

          <span className="text-slate-700">•</span>

          <button 
            onClick={() => onNavigateTab('auditTrail')} 
            className="hover:text-emerald-400 transition flex items-center gap-1.5"
          >
            <FileClock className="h-3.5 w-3.5 text-slate-400" />
            <span>{isAr ? 'سجل التدقيق (Audit Trail)' : 'Audit Trail'}</span>
          </button>

          <span className="text-slate-700">•</span>

          <button 
            onClick={() => onNavigateTab('chatbot')} 
            className="hover:text-emerald-400 transition flex items-center gap-1.5"
          >
            <Bot className="h-3.5 w-3.5 text-emerald-400" />
            <span>{isAr ? 'المستشار الذكي (DPO Assistant)' : 'DPO Assistant'}</span>
          </button>

          <span className="text-slate-700">•</span>

          <button 
            onClick={() => onNavigateTab('articles')} 
            className="hover:text-emerald-400 transition"
          >
            {isAr ? 'مدونة مواد القانون 08.09' : 'Law 08/09 Articles'}
          </button>

          <span className="text-slate-700">•</span>

          <button 
            onClick={() => onNavigateTab('vision')} 
            className="hover:text-amber-400 transition flex items-center gap-1.5 text-amber-300 font-semibold"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
            <span>{isAr ? 'رؤية المؤسس (Founder Vision)' : 'Founder Vision'}</span>
          </button>

          <span className="text-slate-700">•</span>

          <div className="text-emerald-400 flex items-center gap-1.5 font-mono text-xs">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>{isAr ? 'الهندسة السيادية (VerifyOS™)' : 'VerifyOS™ Sovereign Architecture'}</span>
          </div>
        </div>

        {/* 4. Legal Rights & Compliance Statement (الحقوق القانونية) */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right text-xs text-slate-400">
          <p className="font-mono text-[11px] sm:text-xs leading-relaxed text-slate-400">
            جميع الحقوق محفوظة © 2026 <strong className="text-white font-bold">Soverify</strong> — منصة السيادة الرقمية وحماية المعطيات الشخصية وفق القانون المغربي 09-08 والظهير الشريف رقم 1.09.15.
          </p>

          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 shrink-0">
            <span className="text-slate-400">CNDP Compliance Certified</span>
            <span>•</span>
            <span className="text-emerald-400">TLS 1.3 Strict</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
