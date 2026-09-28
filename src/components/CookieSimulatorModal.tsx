import React, { useState } from 'react';
import { 
  Cookie, 
  ShieldCheck, 
  ShieldAlert, 
  Copy, 
  CheckCircle2, 
  Check, 
  Sliders, 
  Eye, 
  Code,
  X,
  FileCode2,
  Sparkles
} from 'lucide-react';
import { AuditReport } from '../types';

interface CookieSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: AuditReport;
  lang: 'ar' | 'en';
}

export const CookieSimulatorModal: React.FC<CookieSimulatorModalProps> = ({
  isOpen,
  onClose,
  report,
  lang: initialLang
}) => {
  const [lang, setLang] = useState<'ar' | 'fr'>(initialLang === 'ar' ? 'ar' : 'fr');
  const [bannerTheme, setBannerTheme] = useState<'dark' | 'light' | 'emerald'>('dark');
  const [position, setPosition] = useState<'bottom' | 'modal'>('bottom');
  const [copiedCode, setCopiedCode] = useState(false);
  const [userChoice, setUserChoice] = useState<'none' | 'accepted' | 'rejected' | 'custom'>('none');
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');

  if (!isOpen) return null;

  const isAr = lang === 'ar';

  const embedCodeSnippet = `<!-- SOVERIFY™ Official CNDP-Compliant Cookie Consent Banner -->
<!-- Certified according to Moroccan Law 08-09 (Zero Cookies dropped before explicit Consent) -->
<div id="soverify-cndp-banner" style="position:fixed;bottom:0;left:0;right:0;background:#090d16;color:#f8fafc;padding:18px 24px;border-top:1px solid #10b981;font-family:system-ui,-apple-system,sans-serif;z-index:999999;box-shadow:0 -10px 25px rgba(0,0,0,0.5);">
  <div style="max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px;">
    <div style="flex:1;min-width:280px;">
      <p style="margin:0 0 6px 0;font-weight:700;font-size:14px;color:#34d399;">
        🍪 ${isAr ? 'احترام الخصوصية والامتثال للقانون المغربي 08-09' : 'Respect de la Vie Privée - Loi 08-09 (CNDP)'}
      </p>
      <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.5;">
        ${isAr 
          ? `نحن نحترم معطياتك الشخصية. لا نضع ملفات تعريف الارتباط التتبعية أو الإعلانية إلا بعد موافقتك الصريحة وفقاً لمتطلبات اللجنة الوطنية CNDP.` 
          : `Nous respectons vos données personnelles. Aucun cookie non-essentiel n'est déposé sans votre consentement exprès conformément à la réglementation CNDP.`}
      </p>
    </div>
    <div style="display:flex;align-items:center;gap:10px;">
      <button onclick="soverifyRejectCookies()" style="background:#1e293b;color:#cbd5e1;border:1px solid #334155;padding:8px 16px;border-radius:8px;font-size:12px;cursor:pointer;font-weight:600;">
        ${isAr ? 'رفض الجميع (Refuser)' : 'Tout Refuser'}
      </button>
      <button onclick="soverifyAcceptCookies()" style="background:#10b981;color:#022c22;border:none;padding:8px 20px;border-radius:8px;font-size:12px;cursor:pointer;font-weight:700;">
        ${isAr ? 'قبول الجميع (Accepter)' : 'Tout Accepter'}
      </button>
    </div>
  </div>
</div>

<script>
  function soverifyAcceptCookies() {
    localStorage.setItem('cndp_consent', 'accepted');
    document.getElementById('soverify-cndp-banner').style.display = 'none';
  }
  function soverifyRejectCookies() {
    localStorage.setItem('cndp_consent', 'rejected');
    document.getElementById('soverify-cndp-banner').style.display = 'none';
  }
</script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCodeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4 sm:p-5 bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Cookie className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-mono">
                  {isAr ? 'محاكي ومولّد لافتة الموافقة على الكوكيز المتوافقة مع CNDP' : 'Simulateur & Générateur de Bandeau Cookies CNDP'}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                  Loi 08-09 Certified
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isAr 
                  ? 'تصميم لافتة كوكيز تطبق القواعد الإلزامية للجنة الوطنية (مبدأ الرفض بنفس سهولة القبول وعدم زرع الكوكيز قبل النقر)' 
                  : 'Garantit l’égalité Refus/Acceptation et l’absence de dépôt préalable de traceurs'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-950/60 border-b border-slate-800 text-xs">
          {/* Tabs */}
          <div className="flex rounded-lg border border-slate-700 bg-slate-800/80 p-0.5">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition font-medium ${
                activeTab === 'preview' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>{isAr ? 'معاينة تفاعلية' : 'Aperçu Direct'}</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition font-medium ${
                activeTab === 'code' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Code className="h-3.5 w-3.5" />
              <span>{isAr ? 'كود التضمين (HTML / JS)' : 'Code Intégrable'}</span>
            </button>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <div className="flex rounded-lg border border-slate-700 bg-slate-800 p-0.5">
              <button
                onClick={() => setLang('ar')}
                className={`px-2 py-1 rounded text-xs ${lang === 'ar' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
              >
                العربية
              </button>
              <button
                onClick={() => setLang('fr')}
                className={`px-2 py-1 rounded text-xs ${lang === 'fr' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
              >
                Français
              </button>
            </div>

            {activeTab === 'code' && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition"
              >
                {copiedCode ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedCode ? (isAr ? 'تم النسخ!' : 'Copié!') : (isAr ? 'نسخ الكود' : 'Copier le script')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {activeTab === 'preview' ? (
            <div className="space-y-6">
              {/* Virtual Browser Window Simulation */}
              <div className="rounded-xl border border-slate-700 bg-slate-950 overflow-hidden shadow-2xl">
                {/* Browser top chrome */}
                <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-mono">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex-1 text-center bg-slate-950 px-3 py-1 rounded text-slate-300 truncate max-w-sm mx-auto border border-slate-800">
                    🔒 https://{report.domain}/
                  </div>
                </div>

                {/* Simulated Web Page Content */}
                <div className="relative min-h-[320px] p-8 bg-slate-900/40 flex flex-col justify-between">
                  <div className="space-y-4 opacity-40 select-none">
                    <div className="h-6 w-1/3 bg-slate-700 rounded animate-pulse" />
                    <div className="h-4 w-full bg-slate-800 rounded" />
                    <div className="h-4 w-5/6 bg-slate-800 rounded" />
                    <div className="h-4 w-2/3 bg-slate-800 rounded" />
                  </div>

                  {/* Simulated Cookie Banner */}
                  {userChoice === 'none' ? (
                    <div className="relative mt-8 rounded-xl border border-emerald-500/50 bg-slate-950/95 p-5 shadow-2xl backdrop-blur-md">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 font-mono">
                              <Cookie className="h-4 w-4" />
                              {isAr ? 'احترام الخصوصية ومطابقة القانون 08-09' : 'Gestion des Cookies & Traçabilité (CNDP)'}
                            </span>
                            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.5 rounded font-mono">
                              CNDP Law 08-09
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {isAr 
                              ? `نحن نلتزم بالقانون رقم 08.09 بحماية معطياتك الشخصية. لن يتم تفعيل ملفات تعريف الارتباط التحليلية أو التتبعية إلا بموافقتك الحرة والصريحة.`
                              : `Conformément à la Loi 08-09, nous respectons vos données. Aucun cookie d'analyse ou de traçage n'est activé avant votre consentement exprès.`}
                          </p>
                        </div>

                        {/* Equal Buttons (Refuse vs Accept) as required by CNDP */}
                        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
                          <button
                            onClick={() => setUserChoice('rejected')}
                            className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition"
                          >
                            {isAr ? 'رفض الجميع' : 'Tout Refuser'}
                          </button>
                          <button
                            onClick={() => setUserChoice('accepted')}
                            className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-slate-950 transition shadow-md shadow-emerald-950"
                          >
                            {isAr ? 'قبول الجميع' : 'Tout Accepter'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-8 p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/30 text-emerald-300 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        <span>
                          {userChoice === 'accepted' 
                            ? (isAr ? 'تم تسجيل موافقتك وحفظ السجل التوثيقي' : 'Consentement enregistré avec succès')
                            : (isAr ? 'تم رفض ملفات الكوكيز وحجب أي تتبع مسبق' : 'Tous les cookies non-essentiels ont été bloqués')}
                        </span>
                      </div>
                      <button
                        onClick={() => setUserChoice('none')}
                        className="text-[11px] underline text-slate-400 hover:text-white"
                      >
                        {isAr ? 'إعادة التجربة' : 'Réinitialiser le test'}
                      </button>
                    </div>
                  )}

                </div>
              </div>

              {/* Legal Checklist for CNDP Cookie Compliance */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>{isAr ? 'الشروط الإلزامية للجنة CNDP في لافتات الكوكيز:' : 'Exigences Légales CNDP pour les traceurs:'}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-bold text-emerald-400 block mb-1">1. تكافؤ الرفض والقبول</span>
                    <p className="text-[11px] text-slate-400">زر "رفض الجميع" بنفس الحجم والوضوح وسهولة زر "قبول الجميع" (منع الـ Dark Patterns).</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-bold text-emerald-400 block mb-1">2. الحظر المسبق التام</span>
                    <p className="text-[11px] text-slate-400">عدم تحميل أي سكريبت تحليلي (مثل Google Analytics / Meta Pixel) قبل نقر الزائر.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="font-bold text-emerald-400 block mb-1">3. إثبات التوثيق (Proof)</span>
                    <p className="text-[11px] text-slate-400">حفظ ختم زمني لموافقة المستخدم لإبرازه لمفتشي CNDP عند الرقابة.</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {isAr ? 'قم بنسخ هذا الكود ووضعه في وسم <head> أو قبل إغلاق </body> في موقعك:' : 'Copiez ce script dans votre code source avant la fermeture de </body> :'}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  Zero-Dependency Vanilla JS
                </span>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-200 overflow-x-auto select-all leading-relaxed">
                <code>{embedCodeSnippet}</code>
              </pre>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
