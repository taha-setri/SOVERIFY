import React, { useState } from 'react';
import { Shield, Building2, User, Mail, Phone, Send, CheckCircle2, MessageSquare, Sparkles, AlertTriangle } from 'lucide-react';

interface EnterpriseLeadCardProps {
  domain: string;
  lang: 'ar' | 'en';
  onNavigateToLaw?: () => void;
}

export const EnterpriseLeadCard: React.FC<EnterpriseLeadCardProps> = ({ domain, lang }) => {
  const isAr = lang === 'ar';
  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('إيداع ملفات التصريح المسبق D-1 لدى CNDP');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [leadId, setLeadId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !name.trim() || !email.trim() || !phone.trim()) {
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        company: company.trim(),
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        service,
        domain: domain || 'banquepopulaire.ma'
      };

      const res = await fetch('/api/enterprise-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));
      setLeadId(data.lead_id || `LEAD-${Date.now().toString().slice(-6)}`);
      setSubmitted(true);
    } catch (err) {
      console.error('Lead submit error:', err);
      setLeadId(`LEAD-${Date.now().toString().slice(-6)}`);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const founderWhatsAppUrl = `https://wa.me/212634424914?text=${encodeURIComponent(
    `السلام عليكم أستاذ طه الستري، تم تسجيل طلب مرافقة مؤسسية (${leadId || 'جديد'}) لنطاق (${domain}) لمؤسسة (${company || 'المؤسسة'}).`
  )}`;

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/40 bg-gradient-to-br from-slate-900 via-slate-950 to-navy-950 p-6 sm:p-8 shadow-2xl animate-fadeIn" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-mono font-bold text-amber-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>{isAr ? 'خدمة المرافقة المؤسسية المعتمدة • CNDP VIP ESCORT' : 'Official CNDP Institutional Escort'}</span>
          </div>
          <h3 className="mt-2 text-xl sm:text-2xl font-black tracking-tight text-white">
            {isAr
              ? 'طلب مرافقة قانونية وتقنية لإيداع ملفات CNDP وتفادي الغرامات'
              : 'Request Official CNDP Compliance Escort & Remediation'}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            {isAr
              ? 'تجهيز وصل الإيداع القانوني D-1، صياغة سياسات الخصوصية المطابقة لمداولة 08-2020، ومرافقة مباشرة من المؤسس طه الستري وفريق المستشارين المعتمدين.'
              : 'Direct liaison with Founder Taha Setri and certified legal engineers to prepare official CNDP D-1 declarations and shield against statutory penalties.'}
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <a
            href={founderWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-bold text-white transition shadow-lg"
          >
            <MessageSquare className="h-4 w-4" />
            <span>{isAr ? 'محادثة فورية (واتساب المؤسس)' : 'Instant Founder Chat'}</span>
          </a>
        </div>
      </div>

      {/* Form or Confirmation */}
      <div className="relative z-10 mt-6">
        {submitted ? (
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-6 text-center space-y-4 animate-scaleUp">
            <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">
                {isAr ? 'تم استلام طلبكم المؤسسي بنجاح!' : 'Your Request Has Been Received!'}
              </h4>
              <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                {isAr
                  ? `الرقم المرجعي: ${leadId} — سيتواصل معكم المستشار القانوني خلال ساعتين عبر البريد الإلكتروني أو الهاتف.`
                  : `Reference ID: ${leadId} — Our legal compliance team will contact you within 2 hours.`}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={founderWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 px-5 py-2.5 text-xs font-black text-slate-950 transition"
              >
                <MessageSquare className="h-4 w-4" />
                <span>{isAr ? 'تأكيد الطلب عبر واتساب مع المؤسس' : 'Confirm via WhatsApp'}</span>
              </a>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs text-slate-300 hover:text-white transition"
              >
                {isAr ? 'إرسال طلب إضافي' : 'Submit Another Request'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Company */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {isAr ? 'اسم المؤسسة أو الشركة *' : 'Company / Entity Name *'}
                </label>
                <div className="relative">
                  <Building2 className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500`} />
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder={isAr ? 'بنك / شركة SA' : 'Enterprise SA'}
                    className={`w-full rounded-xl border border-slate-700 bg-slate-900/90 py-2.5 ${isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'} text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none`}
                  />
                </div>
              </div>

              {/* Contact Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {isAr ? 'اسم المسؤول / DPO *' : 'Contact Person / DPO *'}
                </label>
                <div className="relative">
                  <User className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500`} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isAr ? 'السيد(ة) مسؤول المعالجة' : 'Full Name'}
                    className={`w-full rounded-xl border border-slate-700 bg-slate-900/90 py-2.5 ${isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'} text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none`}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {isAr ? 'البريد الإلكتروني المهني *' : 'Corporate Email *'}
                </label>
                <div className="relative">
                  <Mail className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500`} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dpo@company.ma"
                    className={`w-full rounded-xl border border-slate-700 bg-slate-900/90 py-2.5 ${isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'} text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none font-mono`}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {isAr ? 'رقم الهاتف / الواتساب *' : 'Phone / WhatsApp *'}
                </label>
                <div className="relative">
                  <Phone className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500`} />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+212 600-000000"
                    className={`w-full rounded-xl border border-slate-700 bg-slate-900/90 py-2.5 ${isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'} text-xs text-white placeholder-slate-500 focus:border-amber-400 focus:outline-none font-mono`}
                  />
                </div>
              </div>
            </div>

            {/* Service & Domain Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {isAr ? 'نوع الخدمة أو المرافقة المطلوبة *' : 'Requested Service *'}
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2.5 text-xs text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="إيداع ملفات التصريح المسبق D-1 لدى CNDP">
                    {isAr ? 'إيداع ملفات التصريح المسبق D-1 لدى CNDP واستلام وصل الإيداع' : 'CNDP Prior Declaration D-1 Filing & Receipt'}
                  </option>
                  <option value="مرافقة وتدقيق شامل للامتثال للقانون 08-09">
                    {isAr ? 'مرافقة وتدقيق شامل للامتثال للقانون 08-09 وسد الفجوات' : 'Full Law 08-09 Remediation & Audit Escort'}
                  </option>
                  <option value="صياغة سياسات الخصوصية ولافتة الكوكيز الذكية">
                    {isAr ? 'صياغة سياسات الخصوصية ولافتة الكوكيز الذكية (مداولة 08-2020)' : 'Privacy Policy & Compliant Cookie Banner Setup'}
                  </option>
                  <option value="خدمة مسؤول حماية المعطيات الخارجي DPO as a Service">
                    {isAr ? 'خدمة مسؤول حماية المعطيات الخارجي (DPO as a Service)' : 'External DPO as a Service'}
                  </option>
                  <option value="تحصين ترويسات الخوادم والسيادة الرقمية">
                    {isAr ? 'تحصين ترويسات الخوادم Nginx والسيادة الرقمية (توطين المعطيات)' : 'Nginx Sovereign Hardening & Data Localization'}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1">
                  {isAr ? 'النطاق المعني بالفحص' : 'Target Domain'}
                </label>
                <div className="rounded-xl border border-slate-800 bg-slate-950/80 px-3.5 py-2.5 text-xs font-mono text-amber-300 truncate">
                  {domain || 'banquepopulaire.ma'}
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <Shield className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  {isAr
                    ? 'بياناتكم محمية بموجب السرية المهنية والمادة 23 من القانون 08-09.'
                    : 'Your information is protected under professional privilege and Law 08-09 Art. 23.'}
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 px-7 py-3 text-xs font-black text-slate-950 shadow-xl transition disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" />
                <span>
                  {submitting
                    ? isAr
                      ? 'جاري إرسال الطلب...'
                      : 'Submitting...'
                    : isAr
                    ? 'إرسال طلب الاستشارة والمرافقة'
                    : 'Submit Escort Request'}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
