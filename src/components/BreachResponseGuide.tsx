import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  ShieldAlert, 
  FileText, 
  CheckCircle2, 
  Copy, 
  Download, 
  PhoneCall, 
  Send,
  Building2,
  Users,
  KeyRound
} from 'lucide-react';

interface BreachResponseGuideProps {
  lang: 'ar' | 'en';
}

export const BreachResponseGuide: React.FC<BreachResponseGuideProps> = ({ lang }) => {
  const isAr = lang === 'ar';

  const [companyName, setCompanyName] = useState('Maroc Digital SARL');
  const [dpoContact, setDpoContact] = useState('dpo@entreprise.ma');
  const [recordsCount, setRecordsCount] = useState('3500');
  const [breachType, setBreachType] = useState('تسريب قاعدة بيانات عبر خادم مكشوف (Exposed Database / Ransomware)');
  const [hasCinOrFinancial, setHasCinOrFinancial] = useState(true);
  const [copied, setCopied] = useState(false);

  // 72-hour countdown simulation
  const [hoursLeft, setHoursLeft] = useState(71);
  const [minutesLeft, setMinutesLeft] = useState(48);
  const [secondsLeft, setSecondsLeft] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 0) return prev - 1;
        setMinutesLeft((m) => {
          if (m > 0) return m - 1;
          setHoursLeft((h) => Math.max(0, h - 1));
          return 59;
        });
        return 59;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const severity = hasCinOrFinancial || parseInt(recordsCount) > 1000 ? 'CRITICAL / عالي الخطورة' : 'MEDIUM / متوسط';

  const generatedCndpLetter = `À l'attention de Monsieur le Président de la CNDP
Commission Nationale de contrôle de la protection des Données à caractère Personnel
Angle Boulevard Annakhil et Avenue Mehdi Ben Barka, Hay Riad, Rabat - Maroc

OBJET : Notification formelle d'incident de sécurité et violation de données personnelles
RÉFÉRENCE LÉGALE : Dahir n° 1-09-15 portant promulgation de la Loi n° 08-09 (Articles 23 & 24)

Monsieur le Président de la Commission,

Par la présente et en application des dispositions légales en vigueur au Royaume du Maroc, la société "${companyName}" vous notifie officiellement la survenance d'un incident de sécurité :

1. CIRCONSTANCES ET TYPE DE L'INCIDENT :
- Nature de l'incident : ${breachType}
- Date et heure de détection : ${new Date().toISOString().substring(0, 16).replace('T', ' à ')}
- Périmètre d'impact estimé : Environ ${recordsCount} personnes physiques (résidents et citoyens marocains).

2. DONNÉES PERSONNELLES CONCERNÉES :
${hasCinOrFinancial 
  ? "- Données à risque élevé : Numéros de Carte d'Identité Nationale (CIN), numéros de téléphone, coordonnées bancaires partielles ou hachées."
  : "- Données courantes : Adresses électroniques, identifiants de compte."}
- Mesures de confinement prises : Clés d'accès révoquées, isolation des serveurs de base de données.

3. MESURES DE REMÉDIATION ET INVESTIGATION FORENSIC :
- Intervention immédiate de la cellule de crise RSSI / DPO.
- Confinement réseau et conservation des journaux d'accès (logs) pour réquisition judiciaire ou enquête CNDP.
- Information directe en cours de déploiement auprès des personnes concernées par e-mail et SMS d'alerte.

4. COORDONNÉES DU DÉLÉGUÉ À LA PROTECTION DES DONNÉES (DPO) :
- E-mail d'astreinte : ${dpoContact}
- Téléphone de crise : +212 5 37 XX XX XX

Fait à Casablanca, le ${new Date().toLocaleDateString('fr-FR')}.
Cachet et signature de la Direction Générale.`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCndpLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with 72h Countdown */}
      <div className="rounded-2xl border border-rose-500/30 bg-slate-900/90 p-6 sm:p-8 backdrop-blur shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
              <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
              <span>{isAr ? 'بروتوكول الطوارئ الإلزامي للجنة CNDP' : 'Mandatory CNDP Emergency Incident Protocol'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {isAr ? 'دليل الاستجابة الفورية لحوادث تسريب البيانات' : 'Data Breach Incident Response Guide'}
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              {isAr
                ? 'دليل إجرائي تفاعلي يحدد الخطوات القانونية والتقنية الملزمة بموجب المادتين 23 و 24 من القانون رقم 08-09 لتفادي المسؤولية الجنائية والغرامات.'
                : 'Step-by-step procedural containment workflow and official notification generator under Moroccan Law 08/09.'}
            </p>
          </div>

          {/* 72H Deadline Countdown Timer Widget */}
          <div className="rounded-xl border border-rose-500/40 bg-rose-950/20 p-4 min-w-[260px] text-center space-y-1">
            <span className="text-[11px] font-mono text-rose-300 uppercase tracking-wider flex items-center justify-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{isAr ? 'المهلة النظامية لإشعار CNDP (72 ساعة)' : 'CNDP 72-Hour Legal Deadline'}</span>
            </span>
            <div className="text-3xl font-extrabold font-mono text-rose-400">
              {String(hoursLeft).padStart(2, '0')}:{String(minutesLeft).padStart(2, '0')}:{String(secondsLeft).padStart(2, '0')}
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              {isAr ? 'يبدأ العد من لحظة اكتشاف الاختراق' : 'Commences immediately upon discovery'}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Emergency Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-rose-500/30 bg-slate-950 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-rose-400">01 / العزل الفوري</span>
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          </div>
          <h4 className="font-bold text-white text-sm">
            {isAr ? 'عزل الأنظمة المصابة' : 'Containment & Isolation'}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAr
              ? 'تجميد الاتصال بالشبكة للخوادم المخترقة، إبطال مفاتيح API، وحفظ نسخ من سجلات الولوج (Logs) كأدلة جنائية.'
              : 'Sever network ingress, revoke credentials, and snapshot forensic logs without tampering.'}
          </p>
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-slate-950 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-400">02 / تقييم الأثر</span>
            <span className="h-2 w-2 rounded-full bg-amber-500" />
          </div>
          <h4 className="font-bold text-white text-sm">
            {isAr ? 'تحديد المعطيات المسربة' : 'Triage & Scope Evaluation'}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAr
              ? 'حصر نوعية البيانات (بطاقة وطنية CIN، كلمات مرور، بيانات حساسة) وعدد المواطنين المتأثرين بالواقعة.'
              : 'Determine if sensitive attributes (CIN, financial, medical) and Moroccan citizens are exposed.'}
          </p>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-slate-950 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-400">03 / إشعار CNDP</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <h4 className="font-bold text-white text-sm">
            {isAr ? 'الإخطار الرسمي للجنة CNDP' : 'Official CNDP Notification'}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAr
              ? 'إرسال التقرير الأولي للجنة الوطنية بالرباط وتعيين مسؤول للتواصل المباشر مع المفتشين.'
              : 'Submit formal notification letter within 72h window to CNDP headquarters in Rabat.'}
          </p>
        </div>

        <div className="rounded-xl border border-blue-500/30 bg-slate-950 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-blue-400">04 / إخطار المعنيين</span>
            <span className="h-2 w-2 rounded-full bg-blue-500" />
          </div>
          <h4 className="font-bold text-white text-sm">
            {isAr ? 'إبلاغ أصحاب المعطيات' : 'Data Subjects Advisory'}
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAr
              ? 'في حال وجود خطر وشيك على المستخدمين، يجب إرسال إشعار مباشر يوجههم لتغيير كلمات المرور وحماية حساباتهم.'
              : 'Directly inform affected individuals with actionable guidance to protect their identity.'}
          </p>
        </div>
      </div>

      {/* Generator Form & Letter Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Details */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <FileText className="h-4 w-4 text-emerald-400" />
            <span>{isAr ? 'بيانات إعداد الإشعار الرسمي' : 'Incident Notification Parameters'}</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-mono">{isAr ? 'اسم المؤسسة / الشركة المسؤولة' : 'Company Name'}</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-mono">{isAr ? 'البريد الإلكتروني للـ DPO / RSSI' : 'DPO / CISO Emergency Contact'}</label>
              <input
                type="text"
                value={dpoContact}
                onChange={(e) => setDpoContact(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-mono">{isAr ? 'عدد السجلات المتأثرة' : 'Estimated Affected Records'}</label>
              <input
                type="number"
                value={recordsCount}
                onChange={(e) => setRecordsCount(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-mono">{isAr ? 'طبيعة الحادث الأمني' : 'Breach Classification'}</label>
              <select
                value={breachType}
                onChange={(e) => setBreachType(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-500"
              >
                <option value="تسريب قاعدة بيانات عبر خادم مكشوف (Exposed Database / Cloud Misconfiguration)">Exposed Database / Cloud Misconfiguration</option>
                <option value="هجوم فدية وتشفير خبيث (Ransomware Attack)">Ransomware Attack</option>
                <option value="اختراق حساب موظف واقتناص الصلاحيات (Credential Stuffing / Phishing)">Credential Stuffing / Phishing</option>
                <option value="تسريب عبر طرف ثالث ومزود خارجي (Third-Party SaaS Breach)">Third-Party SaaS Breach</option>
              </select>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasCinOrFinancial}
                  onChange={(e) => setHasCinOrFinancial(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                />
                <span>{isAr ? 'يشمل أرقام البطاقة الوطنية CIN أو بيانات مالية حساسة' : 'Includes CIN numbers or financial credentials'}</span>
              </label>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">{isAr ? 'مستوى خطورة الواقعة:' : 'Calculated Severity:'}</span>
              <span className="text-rose-400 font-mono font-bold">{severity}</span>
            </div>
          </div>
        </div>

        {/* Live Draft Preview */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-white">
                {isAr ? 'مسودة الخطاب الرسمي الموجه لرئاسة CNDP' : 'Official CNDP Formal Notification Draft'}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {isAr ? 'جاهزة للطباعة أو الإرسال الفوري عبر البريد المعتمد' : 'Compliant with Article 24 of Moroccan Law 08-09'}
              </p>
            </div>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400 hover:bg-emerald-500/20 transition font-mono"
            >
              {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ المسودة' : 'Copy Text')}</span>
            </button>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap max-h-[380px] overflow-y-auto no-scrollbar">
            {generatedCndpLetter}
          </div>

          <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between pt-1">
            <span>العنوان الرسمي: مقر اللجنة الوطنية CNDP - شارع النخيل، حي الرياض، الرباط</span>
            <span>الهاتف: +212 5 37 57 11 24</span>
          </div>
        </div>
      </div>
    </div>
  );
};
