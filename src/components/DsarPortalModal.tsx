import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  Send, 
  Code, 
  Copy, 
  Check, 
  Eye, 
  Edit3, 
  ShieldOff, 
  FileCheck, 
  Building2, 
  Mail, 
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';
import { AuditReport } from '../types';

interface DsarPortalModalProps {
  report?: AuditReport | null;
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
}

export const DsarPortalModal: React.FC<DsarPortalModalProps> = ({
  report,
  isOpen,
  onClose,
  lang
}) => {
  const isAr = lang === 'ar';
  const targetDomain = report?.domain || report?.target || 'mon-entreprise.ma';
  const businessName = report?.businessName || 'المؤسسة الوطنية المسؤولة';
  const [activeTab, setActiveTab] = useState<'simulator' | 'embed'>('simulator');
  const [copiedCode, setCopiedCode] = useState(false);

  // Form State for Citizen Request
  const [requestType, setRequestType] = useState<'access' | 'rectification' | 'opposition'>('access');
  const [fullName, setFullName] = useState('');
  const [cinNumber, setCinNumber] = useState('');
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setFullName('');
    setCinNumber('');
    setEmail('');
    setDetails('');
  };

  const embedCode = `<!-- Soverify Law 08/09 Citizen Rights Portal Embed -->
<div id="soverify-dsar-portal" data-domain="${targetDomain}"></div>
<script src="https://soverify.ma/cdn/dsar-portal.v1.js" async defer></script>
<noscript>
  <a href="mailto:dpo@${targetDomain}?subject=Exercise%20Law%2008-09%20Rights">
    Exercise Your Data Subject Rights (Law 08-09 / CNDP)
  </a>
</noscript>`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-md">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-teal-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {isAr ? 'بوابة ممارسة حقوق الأفراد (المواد 7، 8، 9 - قانون 08-09)' : 'Data Subject Rights (DSAR) Portal Generator'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {businessName} • {targetDomain}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('simulator')}
                className={`px-3 py-1 rounded-lg transition ${activeTab === 'simulator' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
              >
                {isAr ? 'نموذج الممارسة الحي' : 'Live Portal'}
              </button>
              <button
                onClick={() => setActiveTab('embed')}
                className={`px-3 py-1 rounded-lg transition ${activeTab === 'embed' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-300 hover:text-white'}`}
              >
                {isAr ? 'كود التضمين للموقع' : 'Embed Code'}
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          {activeTab === 'simulator' ? (
            <div className="space-y-6">
              {/* Notice Banner */}
              <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/30 text-xs text-teal-200 flex items-start gap-3">
                <FileCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-teal-300 mb-0.5">
                    {isAr ? 'إلزام قانوني صريح تحت طائلة المادة 61' : 'Mandatory Statutory Obligation Under Law 08-09'}
                  </div>
                  <div>
                    {isAr
                      ? 'يفرض القانون المغربي تمكين المواطنين من وسيلة واضحة ومباشرة لممارسة حق الولوج، التصحيح، والتعرض مع أجل رد أقصاه 30 يوماً.'
                      : 'Moroccan Law mandates a transparent, easily accessible mechanism for citizens to exercise rights with a statutory 30-day response SLA.'}
                  </div>
                </div>
              </div>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-slate-950 border border-white/10 space-y-4">
                  {/* Select Right Type */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-slate-300 mb-2">
                      {isAr ? 'حدد الحق المراد ممارسته:' : 'Select Data Subject Right:'}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setRequestType('access')}
                        className={`p-3 rounded-xl border text-right transition flex items-center gap-2 cursor-pointer ${
                          requestType === 'access'
                            ? 'bg-teal-500/20 border-teal-500 text-teal-200'
                            : 'bg-slate-900 border-white/5 text-slate-400'
                        }`}
                      >
                        <Eye className="w-4 h-4 text-teal-400" />
                        <div>
                          <div className="font-bold text-xs">{isAr ? 'حق الولوج (المادة 7)' : 'Right of Access (Art. 7)'}</div>
                          <div className="text-[10px] text-slate-400">{isAr ? 'طلب نسخة من البيانات المخزنة' : 'Obtain copy of your data'}</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRequestType('rectification')}
                        className={`p-3 rounded-xl border text-right transition flex items-center gap-2 cursor-pointer ${
                          requestType === 'rectification'
                            ? 'bg-teal-500/20 border-teal-500 text-teal-200'
                            : 'bg-slate-900 border-white/5 text-slate-400'
                        }`}
                      >
                        <Edit3 className="w-4 h-4 text-teal-400" />
                        <div>
                          <div className="font-bold text-xs">{isAr ? 'حق التصحيح (المادة 8)' : 'Right to Rectify (Art. 8)'}</div>
                          <div className="text-[10px] text-slate-400">{isAr ? 'تعديل بيانات غير صحيحة' : 'Update incorrect records'}</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRequestType('opposition')}
                        className={`p-3 rounded-xl border text-right transition flex items-center gap-2 cursor-pointer ${
                          requestType === 'opposition'
                            ? 'bg-teal-500/20 border-teal-500 text-teal-200'
                            : 'bg-slate-900 border-white/5 text-slate-400'
                        }`}
                      >
                        <ShieldOff className="w-4 h-4 text-teal-400" />
                        <div>
                          <div className="font-bold text-xs">{isAr ? 'حق التعرض (المادة 9)' : 'Right to Object (Art. 9)'}</div>
                          <div className="text-[10px] text-slate-400">{isAr ? 'رفض الاستعمال لأغراض تسويقية' : 'Opt-out of data processing'}</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Citizen Info Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        {isAr ? 'الاسم الكامل:' : 'Full Name:'}
                      </label>
                      <input 
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={isAr ? 'مثال: فاطمة الزهراء العمراني' : 'e.g. Fatima Zahra'}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-teal-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        {isAr ? 'رقم البطاقة الوطنية (CIN):' : 'National ID (CIN):'}
                      </label>
                      <input 
                        type="text"
                        required
                        value={cinNumber}
                        onChange={(e) => setCinNumber(e.target.value)}
                        placeholder="AB123456"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-teal-500 outline-none uppercase font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        {isAr ? 'البريد الإلكتروني للرد:' : 'Contact Email:'}
                      </label>
                      <input 
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="citizen@domain.ma"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-teal-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Details Field */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      {isAr ? 'تفاصيل الطلب أو المعطيات المراد تصحيحها / سحبها:' : 'Request Details / Specific Data Subject Details:'}
                    </label>
                    <textarea 
                      rows={3}
                      required
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder={isAr ? 'أطلب بموجب القانون 08-09 تزويدي بكافة المعطيات المحفوظة في خوادمكم...' : 'Pursuant to Law 08-09, I request a comprehensive audit copy of my data...'}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:border-teal-500 outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isAr ? 'إرسال الطلب الرسمي لمسؤول حماية المعطيات (DPO)' : 'Submit Official DSAR Request to DPO'}</span>
                  </button>
                </form>
              ) : (
                /* Success Confirmation State */
                <div className="p-8 rounded-2xl bg-teal-950/30 border border-teal-500/40 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center mx-auto text-teal-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">
                      {isAr ? 'تم استلام وتوثيق طلبك في السجل السيادي' : 'DSAR Request Registered & Logged'}
                    </h4>
                    <p className="text-xs font-mono text-teal-300 mt-1">
                      {isAr ? 'الرقم المرجعي القانوني:' : 'Statutory Reference:'} REQ-2026-{Math.floor(100000 + Math.random() * 900000)}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 text-xs text-slate-300 max-w-lg mx-auto text-right space-y-2">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-slate-400">{isAr ? 'المواطن المعني:' : 'Requester:'}</span>
                      <span className="font-bold text-white">{fullName} ({cinNumber})</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-slate-400">{isAr ? 'نوع الحق المطالب به:' : 'Right Category:'}</span>
                      <span className="font-bold text-teal-400 uppercase font-mono">{requestType}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{isAr ? 'الأجل القانوني للرد (CNDP):' : 'Legal SLA:'}</span>
                      <span className="font-bold text-emerald-400">30 {isAr ? 'يوماً كحد أقصى' : 'days statutory max'}</span>
                    </div>
                  </div>
                  <button
                    onClick={resetForm}
                    className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
                  >
                    {isAr ? 'تقديم طلب جديد' : 'Submit Another Request'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Embed Code Tab */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-teal-400" />
                    {isAr ? 'كود التضمين في موقع المنشأة (HTML/JavaScript):' : 'Embed Code for Webmaster:'}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-mono text-xs transition cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الكود' : 'Copy Code')}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-slate-900 text-teal-300 text-xs font-mono overflow-x-auto border border-white/5">
                  {embedCode}
                </pre>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 text-xs text-slate-300 space-y-2">
                <h5 className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {isAr ? 'إرشادات النشر على الموقع:' : 'Deployment Instructions:'}
                </h5>
                <ol className="list-decimal list-inside space-y-1 text-slate-400 pr-1">
                  <li>{isAr ? 'قم بإلصاق الكود أعلاه في صفحة سياسة الخصوصية (Privacy Policy) أو في تذييل الموقع (Footer).' : 'Paste the code inside your Privacy Policy page or Footer.'}</li>
                  <li>{isAr ? 'يقوم النموذج بالتحقق التلقائي من هوية المشتكي وإشعار مسؤول حماية المعطيات فوراً.' : 'The widget automatically validates citizen requests and dispatches alerts to the DPO.'}</li>
                  <li>{isAr ? 'يتم حفظ جميع الطلبات في سجل رقمي غير قابل للتعديل لإبرازه أمام مفتشي CNDP.' : 'All incoming requests are logged into an audit trail ready for CNDP inspections.'}</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
