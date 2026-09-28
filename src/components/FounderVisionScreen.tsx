import React from 'react';
import { 
  Quote, 
  ShieldCheck, 
  Award, 
  MapPin, 
  Server, 
  Lock, 
  Fingerprint, 
  FileCheck2, 
  Scale, 
  Sparkles, 
  ArrowLeft, 
  ArrowRight,
  Shield,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface FounderVisionScreenProps {
  lang: 'ar' | 'en';
  onNavigateTab: (tab: string) => void;
}

export const FounderVisionScreen: React.FC<FounderVisionScreenProps> = ({
  lang,
  onNavigateTab
}) => {
  const isAr = lang === 'ar';

  const principles = [
    {
      num: '01',
      icon: Server,
      titleAr: 'السيادة الإقليمية وتوطين المعطيات بالمملكة',
      titleEn: 'Territorial Data Sovereignty & In-Kingdom Hosting',
      descAr: 'المعطيات ذات الطابع الشخصي للمواطنين المغاربة هي أصل سيادي لا يجوز استباحته أو استضافته خارج التراب الوطني بدون إذن صريح وترخيص مسبق من اللجنة الوطنية CNDP وفقاً للمادتين 43 و63.',
      descEn: 'Moroccan citizen personal data is a strategic sovereign asset that must reside strictly within national data centers, requiring explicit CNDP authorization for any cross-border flow.'
    },
    {
      num: '02',
      icon: Fingerprint,
      titleAr: 'التوثيق المشفر والبصمة الرقمية غير القابلة للإنكار',
      titleEn: 'Cryptographic Immutability & Non-Repudiation',
      descAr: 'اعتماد خوارزمية التشفير SHA-256 لبصم كل عملية فحص، لإنشاء سجل تدقيق رقمي غير قابل للتعديل أو الطعن، ليكون دليلاً رسمياً وقضائياً على حالة الامتثال.',
      descEn: 'Every audit operation is mathematically stamped with SHA-256 cryptographic hashes, establishing an immutable audit trail for executive and judicial verification.'
    },
    {
      num: '03',
      icon: Lock,
      titleAr: 'حماية المعطيات كحق دستوري وأمانة وطنية',
      titleEn: 'Privacy as a Constitutional Right & National Trust',
      descAr: 'تحويل مقتضيات الظهير الشريف رقم 1.09.15 والقانون رقم 08.09 من نصوص نظرية إلى معايير برمجية استباقية تحمي كرامة وخصوصية كل مواطن ومؤسسة بالمغرب.',
      descEn: 'Transforming statutory requirements of Dahir 1-09-15 and Law 08-09 into automated architectural safeguards that protect citizen dignity and privacy.'
    },
    {
      num: '04',
      icon: ShieldCheck,
      titleAr: 'استقلالية المنظومة وخلوها من التبعية السحابية الأجنبية',
      titleEn: 'Zero Foreign Cloud Surveillance & Complete Autonomy',
      descAr: 'بناء معمارية VerifyOS™ لتعمل بكفاءة مطلقة داخل البنية التحتية المحلية، دون نقل أو تسريب سجلات الفحص لأي منصات تحليلية أجنبية أو وسطاء تجاريين.',
      descEn: 'VerifyOS™ operates completely air-gapped from foreign cloud surveillance pipelines, keeping all audit logs and vulnerability telemetry strictly sovereign.'
    },
    {
      num: '05',
      icon: Scale,
      titleAr: 'الأتمتة العلاجية وتجاوز مجرد التشخيص السطحي',
      titleEn: 'Actionable Engineering Remediation vs. Mere Diagnostics',
      descAr: 'المنظومة لا تكتفي بوضع علامات المخالفة، بل تولّد تلقائياً خطط معالجة عملية لـ 30 يوماً وإعدادات NGINX وقوالب سياسات الخصوصية والكوكيز لإغلاق الثغرات فوراً.',
      descEn: 'Beyond flagging gaps, the engine synthesizes code-level NGINX hardening directives, cookie consent logic, and week-by-week 30-day corrective action roadmaps.'
    }
  ];

  return (
    <div className="space-y-10 py-4 max-w-5xl mx-auto">
      {/* Back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigateTab('audit')}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:border-emerald-500/40 transition"
        >
          {isAr ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
          <span>{isAr ? 'العودة إلى منصة الفحص' : 'Back to Audit Console'}</span>
        </button>

        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-mono text-amber-300">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>VerifyOS™ Sovereign Architecture Manifesto</span>
        </div>
      </div>

      {/* Main Founder Profile & Signature Card (Clean, static, spacious, NO control buttons) */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-[#0a1226] via-[#070c18] to-slate-950 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 relative z-10">
          {/* Founder Photo */}
          <div className="flex flex-col items-center shrink-0">
            <div className="relative group">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl p-1 bg-gradient-to-tr from-amber-500 via-emerald-500 to-teal-400 shadow-2xl shadow-emerald-950/60">
                <div className="w-full h-full rounded-[22px] bg-slate-950 overflow-hidden relative">
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
              <div className="absolute -bottom-2 -right-2 rounded-xl bg-emerald-500 text-slate-950 p-2 shadow-lg border-2 border-slate-950">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <MapPin className="h-3.5 w-3.5 text-rose-400" />
                <span>تطوان - مرتيل، المغرب</span>
              </div>
            </div>
          </div>

          {/* Founder Identity & Titles */}
          <div className="flex-1 text-center lg:text-right space-y-4">
            <div className="space-y-1.5">
              <span className="text-xs font-mono text-emerald-400 tracking-wider font-semibold block uppercase">
                VerifyOS™ Founder & Chief Architect
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                طه الستري <span className="text-amber-300 font-serif font-light text-2xl sm:text-3xl">(Taha Setri)</span>
              </h1>
              <p className="text-sm text-slate-300 font-medium">
                {isAr
                  ? 'المؤسس والمهندس المعماري الرئيسي لمنظومة Soverify Global™ ورئيس هندسة أنظمة VerifyOS™ للسيادة الرقمية'
                  : 'Founder & Chief Architect of Soverify Global™ & VerifyOS™ Sovereign Digital Infrastructure Systems'}
              </p>
            </div>

            {/* Pristine Signature Display */}
            <div className="pt-2 pb-1 flex items-center justify-center lg:justify-start gap-4">
              <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">
                Verified Signature
              </span>
              <span 
                style={{ fontFamily: "'Alex Brush', 'Dancing Script', cursive" }} 
                className="text-3xl sm:text-4xl text-amber-300 font-normal tracking-wide select-none drop-shadow-[0_2px_12px_rgba(245,158,11,0.35)] rotate-[-3deg] inline-block"
              >
                Taha Setri
              </span>
            </div>

            {/* Core Sovereign Quote */}
            <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-5 sm:p-6 text-right relative mt-4">
              <Quote className="h-6 w-6 text-amber-400/40 absolute top-4 left-4" />
              <p className="text-sm sm:text-base text-slate-100 font-semibold leading-relaxed">
                {isAr ? (
                  <>
                    «لم تعد حماية المعطيات مجرد بند قانوني، بل الركيزة الصلبة للأمن القومي وبناء الثقة في الاقتصاد الرقمي المغربي. إن تحصين البنية التحتية والامتثال لقوانين CNDP هو استثمار استراتيجي يصون سمعة المؤسسة وهيمنتها السوقية وحقوق المواطنين الدستورية.»
                  </>
                ) : (
                  <>
                    “Data protection is no longer a mere legal formality, but the solid pillar of national security and trust in Morocco's digital economy. Hardening sovereign infrastructure and complying with CNDP regulations is a strategic imperative safeguarding enterprise reputation, market dominance, and constitutional citizen rights.”
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* The Architectural Manifesto (بيان المعمارية السيادية) */}
      <div className="space-y-6">
        <div className="text-center sm:text-right space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center justify-center sm:justify-start gap-2.5">
            <Layers className="h-5 w-5 text-emerald-400" />
            <span>{isAr ? 'المرتكزات الخمسة للهندسة المعمارية السيادية (VerifyOS™)' : 'The 5 VerifyOS™ Sovereign Architectural Tenets'}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {isAr
              ? 'المبادئ التوجيهية التي وضعها المؤسس طه الستري لبناء منظومة تدقيق وطنية لا تقبل المنافسة ولا تعتمد على أي وسيط أجنبي.'
              : 'Architectural tenets established by Chief Architect Taha Setri to guarantee unmatched national auditing integrity.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {principles.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={p.num}
                className={`rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-3 relative hover:border-emerald-500/40 transition group ${
                  idx === 4 ? 'md:col-span-2' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-mono text-xs font-bold text-amber-400">
                      Principle #{p.num}
                    </span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400/60 group-hover:text-emerald-400 transition" />
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white">
                  {isAr ? p.titleAr : p.titleEn}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {isAr ? p.descAr : p.descEn}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Call to action card */}
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-right">
          <h3 className="text-base sm:text-lg font-bold text-white">
            {isAr ? 'تجربة منظومة VerifyOS™ الميدانية الآن' : 'Test VerifyOS™ Live on Your Infrastructure'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            {isAr
              ? 'أدخل رابط موقعك أو بوابتك في منصة التدقيق لمعاينة التطبيق الفعلي لهذه المعايير السيادية.'
              : 'Enter your domain in the audit terminal to inspect live implementation of these sovereign standards.'}
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('audit')}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-3 text-xs sm:text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-300 transition cursor-pointer shrink-0"
        >
          <span>{isAr ? 'بدء فحص موقعك الآن' : 'Start Audit Now'}</span>
          {isAr ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};
