import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Cookie, 
  FileText, 
  Scale, 
  CheckCircle2, 
  Sliders, 
  X, 
  Check, 
  ExternalLink,
  Server,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface PrivacyAndCookiesSectionProps {
  lang: 'ar' | 'en';
}

export const PrivacyAndCookiesSection: React.FC<PrivacyAndCookiesSectionProps> = ({ lang }) => {
  const isAr = lang === 'ar';

  const [activePolicyTab, setActivePolicyTab] = useState<'privacy' | 'cookies' | 'legal'>('privacy');
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Cookie preferences state stored in localStorage
  const [preferences, setPreferences] = useState<{
    necessary: boolean;
    functional: boolean;
    analytics: boolean;
  }>(() => {
    try {
      const saved = localStorage.getItem('soverify_cookie_prefs');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { necessary: true, functional: true, analytics: false };
  });

  const [saveToast, setSaveToast] = useState(false);

  const handleSavePreferences = () => {
    try {
      localStorage.setItem('soverify_cookie_prefs', JSON.stringify(preferences));
      setSaveToast(true);
      setTimeout(() => {
        setSaveToast(false);
        setIsCookieModalOpen(false);
      }, 1200);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-800 bg-[#080e1d] p-6 sm:p-8 shadow-2xl relative overflow-hidden mt-8 text-slate-300">
      {/* Decorative ambient gradient */}
      <div className="absolute top-0 right-1/3 w-64 h-32 bg-emerald-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-64 h-32 bg-amber-500/5 blur-3xl pointer-events-none" />

      {/* Header and Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>
              {isAr ? 'ميثاق الشفافية والامتثال للقانون 08-09 ومداولات CNDP' : 'Moroccan Law 08-09 Transparency & CNDP Compliance'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {isAr ? 'الخصوصية، ملفات تعريف الارتباط (الكوكيز) والإشعار القانوني' : 'Privacy, Cookies Policy & Sovereign Legal Notice'}
          </h2>
          <p className="text-xs text-slate-400">
            {isAr
              ? 'الضمانات السيادية لحماية المعطيات، عدم تعقب الزوار، وتدبير ملفات الارتباط وفق المداولة 08-2020.'
              : 'Sovereign data protection assurances, zero untracked surveillance, and CNDP Deliberation 08-2020 compliance.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCookieModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 px-3.5 py-2 text-xs font-mono font-bold text-amber-300 transition cursor-pointer"
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>{isAr ? 'إدارة الكوكيز' : 'Cookie Settings'}</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 px-3.5 py-2 text-xs font-medium text-slate-200 transition cursor-pointer"
          >
            <span>{isExpanded ? (isAr ? 'طي التفاصيل' : 'Collapse') : (isAr ? 'عرض السياسة كاملة' : 'Read Full Policy')}</span>
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* 3 Pillars Summary Bar (Always Visible) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-5">
        <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <Lock className="h-4 w-4" />
            <span>{isAr ? 'خصوصية مطلقة وخلو من التعقب' : 'Zero Tracking Guarantee'}</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAr
              ? 'لا نقوم بجمع أو بيع أو تسجيل معطياتكم الشخصية. عمليات الفحص موجهة فقط لتقييم عناوين المواقع تقنياً.'
              : 'We do not collect, sell, or log visitors\' personal data. All scans strictly analyze technical target domain endpoints.'}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <Cookie className="h-4 w-4" />
            <span>{isAr ? 'امتثال لمداولة CNDP للكوكيز' : 'CNDP Deliberation 08-2020'}</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAr
              ? 'حظر قاطع لزرع أي ملفات تعريف ارتباط دعائية قبل الموافقة الصريحة الحرة. يمكنك تعديل خياراتك في أي وقت.'
              : 'Strict prohibition of marketing cookies prior to explicit consent. You maintain complete control over cookie storage.'}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 space-y-2">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
            <Server className="h-4 w-4" />
            <span>{isAr ? 'استضافة سيادية بالمملكة (المادة 43)' : 'Moroccan Sovereign Hosting'}</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAr
              ? 'تتم معالجة كافة سجلات التدقيق المشفرة وتخزينها محلياً دون أي تحويل لمعطيات المواطنين خارج التراب الوطني.'
              : 'All encrypted audit registries are processed and stored locally without cross-border citizen data leakage.'}
          </p>
        </div>
      </div>

      {/* Expandable Comprehensive Legal & Policy Tabs */}
      {isExpanded && (
        <div className="border-t border-slate-800/80 pt-6 space-y-6">
          {/* Sub Navigation */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActivePolicyTab('privacy')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activePolicyTab === 'privacy'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Lock className="h-3.5 w-3.5" />
              <span>{isAr ? 'سياسة حماية المعطيات الشخصية (08-09)' : 'Personal Data Protection Policy'}</span>
            </button>

            <button
              onClick={() => setActivePolicyTab('cookies')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activePolicyTab === 'cookies'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Cookie className="h-3.5 w-3.5" />
              <span>{isAr ? 'سياسة ملفات تعريف الارتباط (الكوكيز)' : 'Cookie Usage & Consent Policy'}</span>
            </button>

            <button
              onClick={() => setActivePolicyTab('legal')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activePolicyTab === 'legal'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Scale className="h-3.5 w-3.5" />
              <span>{isAr ? 'الإشعار القانوني ومسؤول المعالجة' : 'Legal Notice & DPO Liaison'}</span>
            </button>
          </div>

          {/* Policy Tab Content */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-5 sm:p-7 text-xs leading-relaxed space-y-4">
            {activePolicyTab === 'privacy' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-400" />
                    <span>{isAr ? 'ميثاق الخصوصية المعتمد وفق الظهير الشريف 1.09.15' : 'Moroccan Law 08-09 Privacy Charter'}</span>
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                    Dahir n° 1-09-15
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-bold text-white text-xs">{isAr ? '1. الغايات من المعالجة (Finalités):' : '1. Processing Purposes:'}</h4>
                    <p className="text-slate-300">
                      {isAr
                        ? 'تقتصر المعالجة التقنية على إجراء الفحص الآلي المستقل لروابط المواقع لتقييم مدى مطابقتها لقواعد حماية المعطيات، دون تسجيل أي بيانات شخصية تخص زوار المنصة.'
                        : 'Technical processing is strictly limited to autonomous security and compliance auditing of requested domain endpoints without capturing visitor identifiers.'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-white text-xs">{isAr ? '2. حقوق الأشخاص المعنيين (المواد 7، 8، 9):' : '2. Data Subject Rights (Articles 7, 8, 9):'}</h4>
                    <p className="text-slate-300">
                      {isAr
                        ? 'يضمن القانون رقم 08-09 للأشخاص المعنيين حق الولوج (Droit d’accès)، وحق التصحيح (Droit de rectification)، وحق التعرض لأسباب مشروعة (Droit d’opposition). لممارسة هذه الحقوق، يمكنكم التواصل مع مسؤول حماية المعطيات عبر البريد الإلكتروني المعتمد.'
                        : 'Law 08-09 guarantees citizen rights of access, rectification, and legitimate opposition. You may exercise these statutory rights by contacting our verified DPO.'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-white text-xs">{isAr ? '3. مدة حفظ البيانات وسجلات الفحص:' : '3. Retention Periods:'}</h4>
                    <p className="text-slate-300">
                      {isAr
                        ? 'تحفظ سجلات التدقيق التقنية مشفرة ببصمة SHA-256 لأغراض إحصائية وإثبات الامتثال، ويمكن حذف أي فحص بناءً على طلب رسمي من صاحب النطاق بعد إثبات ملكيته.'
                        : 'Audit logs are stored cryptographically hashed for compliance verification and can be purged upon verified domain owner request.'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-white text-xs">{isAr ? '4. السيادة وعدم التحويل للخارج (المادة 43):' : '4. In-Kingdom Residency:'}</h4>
                    <p className="text-slate-300">
                      {isAr
                        ? 'تؤكد المنظومة التزامها الصارم بالمادة 43 من القانون 08-09، بحيث لا يتم تحويل أي معطيات نحو خوادم أجنبية بدون ترخيص صريح من اللجنة الوطنية CNDP.'
                        : 'Zero personal data is transferred across international borders without formal CNDP cross-border authorization pursuant to Article 43.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activePolicyTab === 'cookies' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Cookie className="h-4 w-4 text-amber-400" />
                    <span>{isAr ? 'سياسة ملفات تعريف الارتباط وفق المداولة 08-2020 لـ CNDP' : 'Cookie Policy (CNDP Deliberation 08-2020)'}</span>
                  </h3>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded">
                    Délibération n° 08-2020
                  </span>
                </div>

                <p className="text-slate-300">
                  {isAr
                    ? 'طبقاً للمداولة رقم 08-2020 الصادرة عن اللجنة الوطنية لمراقبة حماية المعطيات ذات الطابع الشخصي (CNDP)، يتم إخطار المستعملين بطبيعة ملفات تعريف الارتباط المستخدمة وتمكينهم من قبولها أو رفضها بحرية تامة:'
                    : 'Pursuant to CNDP Deliberation No. 08-2020, users are transparently informed of all cookie categories and provided full autonomous control:'}
                </p>

                <div className="space-y-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">{isAr ? '1. ملفات تقنية ضرورية (Strictly Necessary Cookies):' : '1. Strictly Necessary Cookies:'}</strong>
                      <span className="text-slate-400 text-xs">
                        {isAr
                          ? 'ضرورية لتشغيل المنصة وحفظ جلسة العمل وتأمين الطلبات المشفرة (لا تتطلب موافقة مسبقة لأنها لازمة لتقديم الخدمة).'
                          : 'Essential for technical platform operation, session security, and encrypted request dispatch.'}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block">{isAr ? '2. ملفات التفضيلات الوظيفية (Functional Preferences):' : '2. Functional Preferences:'}</strong>
                      <span className="text-slate-400 text-xs">
                        {isAr
                          ? 'تُستخدم لتذكر تفضيل اللغة (العربية أو الإنجليزية) وحفظ إعدادات العرض المفضلة لديك محلياً في متصفحك.'
                          : 'Remembers your interface language selection (Arabic / English) and local view preferences.'}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3.5 flex items-start gap-3">
                    <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-rose-300 block">{isAr ? '3. ملفات التتبع الإعلاني والتجاري (Third-Party Trackers):' : '3. Third-Party Ad Trackers:'}</strong>
                      <span className="text-slate-300 text-xs font-semibold">
                        {isAr
                          ? 'محظورة تماماً وغير مفعلة في منصة Soverify Global™. نحن لا نستخدم أي كوكيز تتبع تسويقي أو سكريبتات إعلانية دخيلة.'
                          : 'Completely forbidden and absent from Soverify Global™. We operate zero third-party commercial marketing cookies.'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setIsCookieModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-4 py-2 text-xs font-bold transition cursor-pointer"
                  >
                    <Sliders className="h-3.5 w-3.5" />
                    <span>{isAr ? 'فتح مركز تعديل تفضيلات الكوكيز' : 'Open Cookie Consent Center'}</span>
                  </button>
                </div>
              </div>
            )}

            {activePolicyTab === 'legal' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Scale className="h-4 w-4 text-sky-400" />
                    <span>{isAr ? 'الإشعار القانوني ومسؤولية حماية المعطيات' : 'Legal Mentions & DPO Contact'}</span>
                  </h3>
                  <span className="text-[10px] font-mono text-sky-400 bg-sky-950/60 border border-sky-500/30 px-2 py-0.5 rounded">
                    Sovereign Legal Notice
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1.5">
                    <strong className="text-white block">{isAr ? 'مسؤول المعالجة والمنظومة (Responsable du traitement):' : 'Data Controller & Architecture:'}</strong>
                    <p className="text-slate-300">
                      {isAr
                        ? 'منظومة Soverify Global™ VerifyOS™ للهندسة السيادية الرقمية، تحت إشراف المؤسس والمهندس المعماري الرئيسي: طه الستري (Taha Setri).'
                        : 'Soverify Global™ VerifyOS™ Sovereign Architecture, under the direction of Founder & Chief Architect Taha Setri.'}
                    </p>
                    <p className="text-xs text-slate-400 font-mono">
                      المقر: تطوان - مرتيل، جهة طنجة تطوان الحسيمة، المملكة المغربية.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1.5">
                    <strong className="text-white block">{isAr ? 'قناة التواصل الرسمية لمسؤول حماية المعطيات (Contact DPO):' : 'Official DPO Contact:'}</strong>
                    <p className="text-slate-300">
                      {isAr
                        ? 'لأي استفسار بخصوص حماية المعطيات الشخصية أو ممارسة حقوقكم القانونية، يمكنكم مراسلة مسؤول حماية المعطيات مباشرة عبر البريد الإلكتروني:'
                        : 'For inquiries regarding personal data protection or statutory rights, reach out to the verified DPO liaison:'}
                    </p>
                    <a
                      href="mailto:tahasetri@gmail.com"
                      className="inline-flex items-center gap-1.5 font-mono text-xs text-emerald-400 hover:text-emerald-300 underline"
                    >
                      <span>tahasetri@gmail.com</span>
                    </a>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
                    <strong className="text-white block">{isAr ? 'الإسناد التشريعي والقرارات:' : 'Statutory Enactments:'}</strong>
                    <p className="text-slate-400 text-xs">
                      الظهير الشريف رقم 1.09.15 الصادر في 22 صفر 1430 (18 فبراير 2009) بتنفيذ القانون رقم 08.09، ومداولات اللجنة الوطنية لمراقبة حماية المعطيات ذات الطابع الشخصي (CNDP) ذات الصلة.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive Cookie Preferences Modal */}
      {isCookieModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-amber-500/40 bg-slate-900 p-6 sm:p-8 shadow-2xl space-y-6 text-right">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <button
                onClick={() => setIsCookieModalOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {isAr ? 'إدارة تفضيلات ملفات تعريف الارتباط (الكوكيز)' : 'Cookie Consent Preferences'}
                </h3>
                <Cookie className="h-5 w-5 text-amber-400" />
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {isAr
                ? 'وفقاً لمداولة اللجنة الوطنية CNDP رقم 08-2020، يمكنك اختيار الفئات التي ترغب في السماح بها على متصفحك. لن يتم زرع أي ملفات اختيارية دون موافقتك الصريحة.'
                : 'Pursuant to CNDP Deliberation 08-2020, select your permitted cookie categories. Non-essential cookies will never be placed without your consent.'}
            </p>

            {/* Cookie Categories Toggles */}
            <div className="space-y-3">
              {/* Category 1: Strictly Necessary */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded">
                    {isAr ? 'دائماً مفعل' : 'Always Active'}
                  </span>
                </div>
                <div className="space-y-0.5 text-right flex-1">
                  <h4 className="text-xs font-bold text-white">{isAr ? 'ملفات تقنية وأمنية لازمة' : 'Essential Technical Cookies'}</h4>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {isAr ? 'ضرورية لضمان أمان الجلسة وتشفير SHA-256 وسلامة المنصة.' : 'Required for session integrity, SHA-256 cryptography, and platform uptime.'}
                  </p>
                </div>
              </div>

              {/* Category 2: Functional */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 flex items-center justify-between gap-4">
                <input
                  type="checkbox"
                  id="functional-toggle"
                  checked={preferences.functional}
                  onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="functional-toggle" className="space-y-0.5 text-right flex-1 cursor-pointer">
                  <h4 className="text-xs font-bold text-white">{isAr ? 'تفضيلات اللغة والعرض' : 'Functional & Language Preferences'}</h4>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {isAr ? 'تذكر خيار لغة الواجهة (العربية / English) بين الزيارات.' : 'Saves your preferred UI language and display choices locally.'}
                  </p>
                </label>
              </div>

              {/* Category 3: Commercial Trackers (Disabled permanently) */}
              <div className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-4 flex items-center justify-between gap-4 opacity-60">
                <input
                  type="checkbox"
                  disabled
                  checked={false}
                  className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-slate-600 cursor-not-allowed"
                />
                <div className="space-y-0.5 text-right flex-1">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-[10px] font-mono text-rose-400 bg-rose-950/80 px-1.5 py-0.5 rounded">
                      {isAr ? 'محظور تماماً' : 'Permanently Blocked'}
                    </span>
                    <h4 className="text-xs font-bold text-slate-300">{isAr ? 'ملفات التتبع الإعلاني والتجاري' : 'Ad & Marketing Trackers'}</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {isAr ? 'المنصة خالية 100% من أي سكريبتات إعلانية أو تتبع تجاري للزوار.' : 'Soverify operates zero surveillance trackers or advertising beacons.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setPreferences({ necessary: true, functional: true, analytics: false });
                  handleSavePreferences();
                }}
                className="text-xs text-slate-400 hover:text-slate-200 underline cursor-pointer"
              >
                {isAr ? 'قبول الموصى به فقط' : 'Accept Recommended'}
              </button>

              <button
                onClick={handleSavePreferences}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-300 transition cursor-pointer"
              >
                <Check className="h-4 w-4" />
                <span>{isAr ? 'حفظ تفضيلاتي' : 'Save My Preferences'}</span>
              </button>
            </div>

            {saveToast && (
              <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/90 p-3 text-center text-xs text-emerald-300 font-bold animate-in fade-in">
                {isAr ? '✓ تم حفظ تفضيلات الكوكيز بنجاح في متصفحك وفق معايير CNDP' : '✓ Cookie preferences successfully saved.'}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
