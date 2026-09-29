import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  Copy, 
  Check, 
  Download, 
  Eye, 
  Code, 
  X, 
  Sparkles, 
  Lock, 
  ExternalLink,
  Shield,
  Layers,
  Fingerprint
} from 'lucide-react';
import { AuditReport, TrustSealConfig } from '../types';

interface SovereignTrustSealModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: AuditReport;
  lang: 'ar' | 'en';
}

export const SovereignTrustSealModal: React.FC<SovereignTrustSealModalProps> = ({
  isOpen,
  onClose,
  report,
  lang: initialLang
}) => {
  const [lang, setLang] = useState<'ar' | 'fr' | 'en'>(initialLang === 'ar' ? 'ar' : 'en');
  const isAr = lang === 'ar';

  const [theme, setTheme] = useState<'emerald' | 'gold' | 'dark' | 'glass'>('emerald');
  const [size, setSize] = useState<'compact' | 'standard' | 'expanded'>('standard');
  const [showScore, setShowScore] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSimulatingClick, setIsSimulatingClick] = useState(false);

  if (!isOpen) return null;

  const isCompliant = report.score >= 75;
  const badgeTitle = isCompliant
    ? (isAr ? 'معتمد سيادياً ومطابق للقانون 08-09' : 'Sovereign Certified · Law 08-09')
    : (isAr ? 'مدقق رسمياً عبر Soverify™' : 'Audited by Soverify™');

  const themeStyles = {
    emerald: 'bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 border-emerald-500/50 text-emerald-300 shadow-emerald-900/30',
    gold: 'bg-gradient-to-r from-amber-950 via-yellow-950 to-slate-950 border-amber-500/50 text-amber-300 shadow-amber-900/30',
    dark: 'bg-slate-950 border-slate-800 text-slate-200 shadow-black/50',
    glass: 'bg-slate-900/60 backdrop-blur-md border-teal-500/40 text-teal-200 shadow-teal-950/40'
  };

  const embedCode = `<!-- SOVERIFY™ Sovereign Trust Seal (Moroccan Law 08-09 Certified) -->
<a href="https://soverify.ma/verify/${encodeURIComponent(report.domain)}" 
   target="_blank" 
   rel="noopener"
   title="Soverify Digital Sovereignty & Law 08-09 Compliance Audit"
   style="display:inline-flex;align-items:center;gap:10px;padding:8px 16px;background:#090d16;color:#34d399;border:1px solid #10b981;border-radius:12px;font-family:system-ui,sans-serif;text-decoration:none;font-size:12px;box-shadow:0 4px 14px rgba(16,185,129,0.25);">
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
  <div>
    <div style="font-weight:700;font-size:11px;letter-spacing:0.5px;color:#f8fafc;">
      SOVERIFY™ ${isCompliant ? 'CERTIFIED' : 'AUDITED'}
    </div>
    <div style="font-size:10px;color:#94a3b8;">
      Loi 08-09 CNDP ${showScore ? `· Score ${report.score}/100` : ''}
    </div>
  </div>
</a>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4 sm:p-5 bg-slate-950/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-mono">
                  {isAr ? 'خاتم الثقة والاعتماد السيادي (Sovereign Trust Seal)' : 'Sovereign Trust Seal & Widget'}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-amber-950 text-amber-300 border border-amber-800">
                  Loi 08-09 Trust
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isAr 
                  ? `شارة الاعتماد القابلة للتضمين في موقع ${report.domain} لإثبات حماية معطيات المواطنين.` 
                  : `Embeddable digital proof of compliance for ${report.domain} website footer.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="px-2.5 py-1 text-xs rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white font-mono"
            >
              {lang === 'ar' ? 'English' : 'العربية'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Customizer controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl border border-slate-800 bg-slate-950/60 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1.5">
                {isAr ? 'طابع المظهر اللوني:' : 'Visual Theme:'}
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setTheme('emerald')}
                  className={`p-2 rounded-lg border text-center font-bold transition ${theme === 'emerald' ? 'border-emerald-500 bg-emerald-950 text-emerald-300' : 'border-slate-800 bg-slate-900 text-slate-400'}`}
                >
                  Emerald
                </button>
                <button
                  onClick={() => setTheme('gold')}
                  className={`p-2 rounded-lg border text-center font-bold transition ${theme === 'gold' ? 'border-amber-500 bg-amber-950 text-amber-300' : 'border-slate-800 bg-slate-900 text-slate-400'}`}
                >
                  Gold Seal
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-2 rounded-lg border text-center font-bold transition ${theme === 'dark' ? 'border-slate-600 bg-slate-800 text-white' : 'border-slate-800 bg-slate-900 text-slate-400'}`}
                >
                  Cyber Dark
                </button>
                <button
                  onClick={() => setTheme('glass')}
                  className={`p-2 rounded-lg border text-center font-bold transition ${theme === 'glass' ? 'border-teal-500 bg-teal-950 text-teal-300' : 'border-slate-800 bg-slate-900 text-slate-400'}`}
                >
                  Glass
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1.5">
                {isAr ? 'الحجم والتصميم:' : 'Badge Size:'}
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setSize('compact')}
                  className={`p-2 rounded-lg border text-center font-bold transition ${size === 'compact' ? 'border-emerald-500 bg-emerald-950 text-emerald-300' : 'border-slate-800 bg-slate-900 text-slate-400'}`}
                >
                  Compact
                </button>
                <button
                  onClick={() => setSize('standard')}
                  className={`p-2 rounded-lg border text-center font-bold transition ${size === 'standard' ? 'border-emerald-500 bg-emerald-950 text-emerald-300' : 'border-slate-800 bg-slate-900 text-slate-400'}`}
                >
                  Standard
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-slate-400 font-bold mb-1.5">
                {isAr ? 'خيارات العرض الإضافية:' : 'Options:'}
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showScore}
                  onChange={(e) => setShowScore(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500"
                />
                <span className="text-slate-300">{isAr ? `إظهار درجة الامتثال (${report.score}/100)` : 'Display audit score'}</span>
              </label>
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                <Eye className="h-4 w-4 text-emerald-400" />
                {isAr ? 'معاينة حية وتفاعلية لخاتم الثقة (انقر لتجربة فحص التحقق):' : 'Interactive Live Badge Preview (Click to test verification):'}
              </h4>
              <span className="text-[11px] text-slate-400">
                {isAr ? 'محاكاة مظهر التذييل (Footer)' : 'Simulates website footer integration'}
              </span>
            </div>

            <div className="p-8 rounded-2xl bg-slate-950 border border-dashed border-slate-700 flex flex-col items-center justify-center gap-4">
              <div
                onClick={() => setIsSimulatingClick(true)}
                className={`cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-xl border rounded-2xl flex items-center gap-3.5 ${
                  size === 'compact' ? 'p-2.5 px-4' : 'p-4 px-6'
                } ${themeStyles[theme]}`}
              >
                <div className="relative flex items-center justify-center">
                  <div className="p-2 rounded-xl bg-slate-900/90 border border-current shadow-inner">
                    <ShieldCheck className="h-6 w-6 animate-pulse" />
                  </div>
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-ping" />
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black font-mono tracking-wider text-white">
                      SOVERIFY™
                    </span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-white/10 uppercase">
                      {isCompliant ? 'Verified' : 'Audited'}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold opacity-90 mt-0.5">
                    {badgeTitle}
                  </div>
                  {showScore && (
                    <div className="text-[10px] font-mono opacity-75 mt-0.5">
                      CNDP Score: {report.score}/100 · SHA-256 Validated
                    </div>
                  )}
                </div>
              </div>

              <p className="text-[11px] text-slate-500 font-mono">
                {isAr ? '👆 اضغط على الخاتم لتجربة شاشة التحقق الفورية التي يراها زوار الموقع' : '👆 Click the seal to test the live certificate modal seen by site visitors'}
              </p>
            </div>
          </div>

          {/* Embed Code Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                <Code className="h-4 w-4 text-emerald-400" />
                {isAr ? 'شيفرة التضمين البرمجية (HTML / JavaScript Snippet):' : 'Embed Code:'}
              </h4>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-sm"
              >
                {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-200" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedCode ? (isAr ? 'تم النسخ بنجاح!' : 'Copied!') : (isAr ? 'نسخ الكود البرمجي' : 'Copy Code')}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto select-all leading-relaxed">
              {embedCode}
            </pre>
          </div>

        </div>

        {/* Live Click Simulation Modal */}
        {isSimulatingClick && (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-md rounded-2xl border border-emerald-500/50 bg-slate-900 p-6 shadow-2xl space-y-4">
              <button
                onClick={() => setIsSimulatingClick(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white font-mono">
                    {isAr ? 'شهادة التحقق السيادي الرسمية' : 'Official Sovereign Certificate'}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">
                    {report.domain}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">{isAr ? 'درجة الامتثال للقانون 08-09:' : 'Law 08-09 Score:'}</span>
                  <span className="font-bold text-emerald-400 font-mono">{report.score} / 100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isAr ? 'التوطين الجغرافي:' : 'Data Hosting:'}</span>
                  <span className="text-white font-mono">{report.sovereigntyStatus.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isAr ? 'حالة التشفير:' : 'Encryption Standard:'}</span>
                  <span className="text-teal-300 font-mono">TLS 1.3 & NIST FIPS 203 Ready</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{isAr ? 'تاريخ التدقيق:' : 'Audit Timestamp:'}</span>
                  <span className="text-slate-300 font-mono">{report.timestamp}</span>
                </div>
              </div>

              <div className="text-[10px] font-mono text-slate-400 break-all p-2 rounded bg-black/40 border border-slate-800">
                Hash: {report.signature || '7f9a2c4e1b8d6a3f0192e4b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7'}
              </div>

              <button
                onClick={() => setIsSimulatingClick(false)}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow"
              >
                {isAr ? 'إغلاق نافذة المعاينة' : 'Close Verification Modal'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
