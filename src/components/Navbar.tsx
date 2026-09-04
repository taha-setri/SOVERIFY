import React from 'react';
import { ShieldCheck, Lock, History, Cookie, Scale, AlertTriangle, Code, User, Languages, Download, FileText, BookOpen, Bot, Sparkles, Globe, FileClock } from 'lucide-react';
import { UserAccount } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  user: UserAccount | null;
  onOpenAuth: () => void;
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
  onOpenAuth,
  onOpenPythonCode,
  hasReport,
  onDownloadPdf
}) => {
  const isAr = lang === 'ar';

  const navItems = [
    { id: 'audit', labelEn: 'Compliance Audit', labelAr: 'فحص الامتثال', icon: ShieldCheck },
    { id: 'updates', labelEn: 'Regulatory Updates', labelAr: 'مستجدات CNDP', icon: Globe },
    { id: 'chatbot', labelEn: 'Gemini DPO Advisor', labelAr: 'المستشار الذكي DPO', icon: Bot, isHighlight: true },
    { id: 'articles', labelEn: 'Articles of Law', labelAr: 'مواد القانون 08.09', icon: BookOpen },
    { id: 'cookies', labelEn: 'Cookies Audit', labelAr: 'فحص الكوكيز', icon: Cookie },
    { id: 'remediation', labelEn: '30-Day Plan', labelAr: 'خطة الـ 30 يوماً', icon: Scale },
    { id: 'breach', labelEn: 'Breach Response', labelAr: 'دليل التسريبات', icon: AlertTriangle },
    { id: 'compare', labelEn: 'Compare Sites', labelAr: 'مقارنة موقعين', icon: Scale },
    { id: 'auditTrail', labelEn: 'Audit Trail', labelAr: 'سجل الأنشطة', icon: FileClock },
    { id: 'history', labelEn: 'History & Evolution', labelAr: 'سجل الفحوصات', icon: History },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('audit')}>
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-950 border border-emerald-500/40 text-emerald-400 shadow-lg shadow-emerald-950/40">
              <ShieldCheck className="h-5 w-5" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-extrabold tracking-tight text-white font-mono">
                  SOVERIFY
                </span>
                <span className="hidden sm:inline-block rounded-md border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-mono font-medium text-emerald-400">
                  Loi 08-09
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans line-clamp-1">
                {isAr ? 'منصة تدقيق السيادة الرقمية والامتثال لـ CNDP' : 'Digital Sovereignty & CNDP Compliance Auditor'}
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 rounded-xl bg-slate-900/80 p-1 border border-slate-800 text-xs font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{isAr ? item.labelAr : item.labelEn}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Download PDF Report Button (When report is ready) */}
            {hasReport && onDownloadPdf && (
              <button
                onClick={onDownloadPdf}
                title={isAr ? 'تحميل تقرير التدقيق الرسمي كملف PDF' : 'Download Official Audit Report as PDF'}
                className="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/60 px-2.5 py-1.5 text-xs font-mono text-emerald-300 hover:bg-emerald-900/60 transition shadow-sm"
              >
                <Download className="h-3.5 w-3.5 text-emerald-400" />
                <span className="hidden sm:inline font-bold">PDF</span>
              </button>
            )}

            {/* View Python Code Button */}
            <button
              onClick={onOpenPythonCode}
              title={isAr ? 'عرض كود بايثون المستقل (app.py)' : 'View Standalone Python Flask Code (app.py)'}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs font-mono text-slate-300 hover:border-emerald-500/50 hover:text-emerald-400 transition"
            >
              <Code className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden md:inline font-mono">app.py</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/90 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition"
              title="Toggle Language"
            >
              <Languages className="h-3.5 w-3.5 text-slate-400" />
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            {/* User Account / DPO Profile */}
            {user ? (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-2.5 py-1 text-xs text-emerald-300 hover:bg-emerald-950/70 transition"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.name}
                    className="h-6 w-6 rounded-full border border-emerald-400 object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
                <span className="hidden sm:inline font-mono font-bold">{user.name.split(' ')[0]}</span>
                <span className="text-[10px] text-emerald-400/80 font-mono hidden md:inline">
                  {user.isFirebaseUser ? '☁️ Cloud' : `(${user.role.split('/')[0].trim()})`}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition"
              >
                <User className="h-3.5 w-3.5" />
                <span>{isAr ? 'دخول DPO' : 'DPO Login'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Sub-Navigation */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1.5 border-t border-slate-800/80 no-scrollbar text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 transition ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{isAr ? item.labelAr : item.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
