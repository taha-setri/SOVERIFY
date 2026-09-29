import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  History, 
  Cookie, 
  Scale, 
  AlertTriangle, 
  Code, 
  Languages, 
  Download, 
  FileText, 
  BookOpen, 
  Bot, 
  Sparkles, 
  Globe, 
  FileClock, 
  Atom 
} from 'lucide-react';
import { UserAccount, Language } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  user: UserAccount | null;
  onOpenPythonCode: () => void;
  hasReport?: boolean;
  onDownloadPdf?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  user,
  onOpenPythonCode,
  hasReport,
  onDownloadPdf
}) => {
  const isAr = lang === 'ar';
  const isFr = lang === 'fr';

  const navItems = [
    { id: 'audit', labelEn: 'Compliance Audit', labelAr: 'فحص الامتثال', labelFr: 'Audit Conformité', icon: ShieldCheck },
    { id: 'quantum', labelEn: 'Post-Quantum Shield', labelAr: 'درع الكم PQC', labelFr: 'Bouclier PQC', icon: Atom, isHighlight: true },
    { id: 'updates', labelEn: 'Regulatory Updates', labelAr: 'مستجدات CNDP', labelFr: 'Actualités CNDP', icon: Globe },
    { id: 'chatbot', labelEn: 'Free DPO Advisor', labelAr: 'المستشار القانوني (مجاني)', labelFr: 'Conseiller DPO', icon: Bot, isHighlight: true },
    { id: 'articles', labelEn: 'Articles of Law', labelAr: 'مواد القانون 09.08', labelFr: 'Articles Loi 09-08', icon: BookOpen },
    { id: 'cookies', labelEn: 'Cookies Audit', labelAr: 'فحص الكوكيز', labelFr: 'Audit Cookies', icon: Cookie },
    { id: 'remediation', labelEn: '30-Day Plan', labelAr: 'خطة الـ 30 يوماً', labelFr: 'Plan 30 Jours', icon: Scale },
    { id: 'breach', labelEn: 'Breach Response', labelAr: 'دليل التسريبات', labelFr: 'Guide Fuites', icon: AlertTriangle },
    { id: 'compare', labelEn: 'Compare Sites', labelAr: 'مقارنة موقعين', labelFr: 'Comparatif', icon: Scale },
    { id: 'auditTrail', labelEn: 'Audit Trail', labelAr: 'سجل الأنشطة', labelFr: 'Registre Audit', icon: FileClock },
    { id: 'vision', labelEn: "Founder's Vision", labelAr: 'رؤية المؤسس', labelFr: 'Vision Fondateur', icon: Sparkles },
    { id: 'history', labelEn: 'History & Evolution', labelAr: 'سجل الفحوصات', labelFr: 'Historique', icon: History },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Logo & Identity - Crisp Black, White, Green */}
          <div className="flex items-center gap-3.5 cursor-pointer shrink-0" onClick={() => setActiveTab('audit')}>
            <div className="relative flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-2xl bg-zinc-950 border-2 border-emerald-500/50 shadow-xl shadow-emerald-500/25 overflow-hidden">
              <img
                src="/logo.png"
                alt="Soverify Official Logo"
                className="h-full w-full object-contain p-1"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.jpg';
                }}
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-black animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-black tracking-tight text-white font-mono">
                  SOVERIFY™
                </span>
                <span className="hidden sm:inline-block rounded-md border border-emerald-500/50 bg-emerald-500/15 px-2 py-0.5 text-xs font-mono font-bold text-emerald-300">
                  {isAr ? 'المملكة المغربية' : isFr ? 'Royaume du Maroc' : 'Morocco CNDP'}
                </span>
                <span className="hidden md:inline-block rounded-md border border-white/20 bg-white/10 px-2 py-0.5 text-xs font-mono font-bold text-white">
                  Loi 09-08
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 font-sans line-clamp-1 font-medium">
                {isAr 
                  ? 'المنصة الوطنية للسيادة الرقمية وتدقيق الامتثال' 
                  : isFr 
                  ? 'Plateforme Nationale de Souveraineté & Audit de Conformité' 
                  : 'National Digital Sovereignty & Compliance Auditor'}
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden xl:flex items-center gap-1.5 rounded-2xl bg-zinc-950 p-1.5 border border-white/10 text-xs sm:text-sm font-semibold">
            {navItems.slice(0, 7).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const label = isAr ? item.labelAr : isFr ? item.labelFr : item.labelEn;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-2 transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-black font-extrabold shadow-md shadow-emerald-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-zinc-900 border border-transparent'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-black' : 'text-emerald-400'}`} />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Multilingual Switcher, PDF Download & Founder Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Download PDF Report Button (When report is ready) */}
            {hasReport && onDownloadPdf && (
              <button
                onClick={onDownloadPdf}
                title={isAr ? 'تحميل تقرير التدقيق الرسمي كملف PDF' : isFr ? 'Télécharger Rapport PDF' : 'Download Official Audit Report as PDF'}
                className="flex items-center gap-1.5 rounded-xl border border-emerald-500/50 bg-emerald-500 text-black px-3 py-2 text-xs sm:text-sm font-mono font-black hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <Download className="h-4 w-4 text-black" />
                <span className="font-black">PDF</span>
              </button>
            )}

            {/* Multilingual 3-Language Switcher (AR / FR / EN) */}
            <div className="flex items-center rounded-xl border border-white/20 bg-zinc-950 p-1 text-xs font-mono font-bold shadow-inner">
              <button
                onClick={() => setLang('ar')}
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                  lang === 'ar'
                    ? 'bg-emerald-500 text-black font-black shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="العربية"
              >
                عربي
              </button>
              <button
                onClick={() => setLang('fr')}
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                  lang === 'fr'
                    ? 'bg-emerald-500 text-black font-black shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Français"
              >
                FR
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-2.5 py-1.5 rounded-lg transition cursor-pointer ${
                  lang === 'en'
                    ? 'bg-emerald-500 text-black font-black shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
            </div>

            {/* Sovereign Institutional Authority Badge */}
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-zinc-950 px-3 py-1.5 text-xs text-white shadow-sm">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline font-mono font-bold text-xs sm:text-sm">
                {isAr ? 'طه الستري' : 'Taha Setri'}
              </span>
              <span className="text-xs text-emerald-400 font-mono hidden md:inline font-semibold">
                {isAr ? '(المعمارية السيادية)' : isFr ? '(Architecte en Chef)' : '(Chief Architect)'}
              </span>
            </div>
          </div>
        </div>

        {/* Responsive Mobile / Tablet Sub-Navigation */}
        <div className="flex xl:hidden overflow-x-auto py-2.5 gap-2 border-t border-white/10 no-scrollbar text-xs sm:text-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const label = isAr ? item.labelAr : isFr ? item.labelFr : item.labelEn;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 transition ${
                  isActive
                    ? 'bg-emerald-500 text-black font-black shadow-sm'
                    : 'text-slate-300 hover:text-white bg-zinc-950 border border-white/10'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-black' : 'text-emerald-400'}`} />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
