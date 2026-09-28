import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Scale, 
  FileCheck2, 
  Lock, 
  Cpu, 
  Award, 
  CheckCircle, 
  ExternalLink,
  ChevronRight,
  Fingerprint,
  FileSpreadsheet
} from 'lucide-react';

interface MinisterialPresentationCardProps {
  lang: 'ar' | 'en';
  onStartAuditNow: () => void;
}

export const MinisterialPresentationCard: React.FC<MinisterialPresentationCardProps> = ({
  lang,
  onStartAuditNow
}) => {
  const isAr = lang === 'ar';

  const ministerialPillars = [
    {
      num: '01',
      titleAr: 'استقلالية سيادية رقمية بنسبة 100%',
      titleEn: '100% Autonomous Sovereign Stack',
      descAr: 'المنظومة مصممة لتعمل باستقلالية كاملة داخل التراب الوطني دون أي ارتباط أو تصدير لمعطيات التدقيق نحو خوادم سحابية أجنبية.',
      descEn: 'Zero dependency on foreign cloud APIs or surveillance intermediaries; guaranteed sovereign on-premise operation.'
    },
    {
      num: '02',
      titleAr: 'تغطية قانونية حرفية للقانون 08.09 ومداولات CNDP',
      titleEn: 'Exhaustive Legal Alignment (CNDP Law 08/09)',
      descAr: 'مطابقة دقيقة للمواد 23 (الأمن والسرية)، 43 و63 (الترخيص المسبق للنقل الدولي)، و53 (التصريح المسبق D-1)، ومداولة ملفات الارتباط 08-2020.',
      descEn: 'Direct statutory mapping for Articles 23, 43, 53, 55, 63, and CNDP Deliberation 08-2020 on cookie consent.'
    },
    {
      num: '03',
      titleAr: 'محرك الفحص الميداني الآلي الحي (VerifyOS™)',
      titleEn: 'Live Autonomous Inspection Engine',
      descAr: 'تحليل حي للاتصال المشفر (TLS 1.3)، والتحقق من شهادات الأمان، وتتبع ملفات الكوكيز قبل الموافقة، وفحص عناوين IP ومواقع الاستضافة.',
      descEn: 'Autonomous deep-probe inspection of cryptographic handshakes, tracker injection, and sovereign ASN hosting.'
    },
    {
      num: '04',
      titleAr: 'البصمة الرقمية المشفرة وتوثيق السجلات (SHA-256 Vault)',
      titleEn: 'Tamper-Proof Audit Signatures (SHA-256 Vault)',
      descAr: 'توليد بصمة تشفير إلكترونية فورية لكل عملية فحص مع حفظ تاريخ ووقت الفحص في دفتر التدقيق الوطني لمنع أي تلاعب أو إنكار.',
      descEn: 'Cryptographic hash stamping stored in persistent local database for indisputable judicial and administrative audit trail.'
    },
    {
      num: '05',
      titleAr: 'خطة المعالجة التقنية لـ 30 يوماً والتقرير التنفيذي المعتمد',
      titleEn: '30-Day Remediation Roadmap & PDF Certification',
      descAr: 'تزويد مديري النظم والمعلوماتية (DSI/DPO) بخطوات برمجية دقيقة لإغلاق الثغرات، وإصدار تقرير رسمي مختوم لتقديمه للجنة الوطنية.',
      descEn: 'Automated week-by-week technical hardening guidance with official executive PDF & HTML documentation for ministerial review.'
    }
  ];

  return (
    <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-b from-[#0c1429] to-[#070b16] p-6 sm:p-10 shadow-2xl relative overflow-hidden space-y-8">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-mono text-amber-300">
            <Building2 className="h-3.5 w-3.5" />
            <span>{isAr ? 'الملف المؤسسي للسيادة الرقمية واللجنة الوطنية CNDP' : 'National Sovereign & CNDP Institutional Brief'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {isAr
              ? 'المنظومة الوطنية المرجعية للسيادة الرقمية وحماية المعطيات'
              : 'Morocco’s Sovereign Benchmark for Data Protection & Digital Trust'}
          </h2>
          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            {isAr
              ? 'تم تطوير منصة Soverify Global™ لتكون الخيار الوطني الأول والأقوى للمملكة المغربية، متفوقة على أي أدوات تقليدية بدقتها العالية، وتكاملها مع التشريعات المغربية، وتزويد المؤسسات العمومية والخاصة بآلية تدقيق لا تقبل المنازعة.'
              : 'Engineered specifically for the Kingdom of Morocco to serve as the benchmark digital compliance auditor, empowering national institutions with irrefutable, sovereign automated auditing.'}
          </p>
        </div>

        <div className="flex sm:flex-col items-center sm:items-end gap-3 shrink-0">
          <a
            href="/soverify_report.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-sky-400/40 bg-sky-950/60 px-4 py-2.5 text-xs font-mono text-sky-200 hover:bg-sky-900/60 transition shadow-sm"
          >
            <FileSpreadsheet className="h-4 w-4 text-sky-400" />
            <span>{isAr ? 'عرض تقرير التدقيق السيادي (HTML)' : 'Open HTML Audit Report'}</span>
          </a>
        </div>
      </div>

      {/* 5 Structural Pillars */}
      <div className="space-y-4">
        <h3 className="text-xs sm:text-sm font-mono font-bold text-emerald-400 uppercase tracking-wider">
          {isAr ? '✦ ركائز القوة والامتياز لمنظومة Soverify Global™ الوطنية:' : '✦ Strategic Pillars of Excellence for Institutional Adoption:'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ministerialPillars.map((p, idx) => (
            <div
              key={p.num}
              className={`rounded-2xl border border-slate-800/90 bg-slate-950/80 p-5 space-y-3 relative hover:border-emerald-500/40 transition group ${
                idx === 4 ? 'md:col-span-2 lg:col-span-2' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2.5 py-0.5 rounded-lg">
                  {p.num}
                </span>
                <CheckCircle className="h-4 w-4 text-emerald-400 opacity-60 group-hover:opacity-100 transition" />
              </div>
              <h4 className="text-sm font-bold text-white leading-snug">
                {isAr ? p.titleAr : p.titleEn}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isAr ? p.descAr : p.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Executive Call to Action */}
      <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-right">
          <h4 className="text-base font-bold text-white">
            {isAr ? 'هل أنت جاهز لتجربة التدقيق الميداني على منصتك أو موقعك؟' : 'Ready to Run the Field Audit on Your Target Platform?'}
          </h4>
          <p className="text-xs text-slate-300">
            {isAr
              ? 'أدخل رابط موقعك في شريط التدقيق أعلاه وستحصل خلال ثوانٍ على التقرير التنفيذي الرسمي الموثق.'
              : 'Enter your domain in the inspection console above to generate your certified sovereign compliance report in seconds.'}
          </p>
        </div>

        <button
          onClick={() => {
            window.scrollTo({ top: 350, behavior: 'smooth' });
            onStartAuditNow();
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-3 text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-300 transition shrink-0 cursor-pointer"
        >
          <span>{isAr ? 'الانتقال إلى حقل إدخال الرابط' : 'Go to Target URL Input'}</span>
          <ChevronRight className={`h-4 w-4 ${isAr ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
};
