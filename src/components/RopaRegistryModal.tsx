import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Plus, 
  Trash2, 
  Printer, 
  Download, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Lock, 
  Globe2, 
  Scale, 
  X, 
  Search, 
  Building2, 
  Calendar,
  ExternalLink,
  Info
} from 'lucide-react';
import { AuditReport, RopaActivity, UserAccount } from '../types';

interface RopaRegistryModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: AuditReport;
  user: UserAccount | null;
  lang: 'ar' | 'en';
}

export const RopaRegistryModal: React.FC<RopaRegistryModalProps> = ({
  isOpen,
  onClose,
  report,
  user,
  lang: initialLang
}) => {
  const [lang, setLang] = useState<'ar' | 'fr'>(initialLang === 'ar' ? 'ar' : 'fr');
  const isAr = lang === 'ar';

  const defaultActivities: RopaActivity[] = useMemo(() => [
    {
      id: 'act-1',
      name: 'User Authentication & Account Management',
      nameAr: 'إدارة حسابات المستخدمين والمصادقة الرقمية',
      purpose: 'User access control, password security, session management and multi-factor auth.',
      purposeAr: 'التحقق من هوية المشتركين، تأمين الجلسات، والتحكم في الولوج الرقمي وفق المادة 23.',
      legalBasis: 'Contract',
      legalBasisAr: 'تنفيذ العقد (المادة 4)',
      law0809Article: 'المادة 4 و 23',
      dataCategories: ['Full Name', 'Email address', 'Hashed password', 'Phone number', 'Last login IP'],
      dataCategoriesAr: ['الاسم الكامل', 'البريد الإلكتروني', 'كلمات المرور المشفرة', 'رقم الهاتف', 'عنوان IP'],
      dataSubjects: ['Platform Users', 'Subscribers'],
      dataSubjectsAr: ['المستخدمون المسجلون', 'المشتركون'],
      recipients: ['Internal Security Team', 'Moroccan Cloud Hosting Provider'],
      recipientsAr: ['فريق الأمن السيبراني الداخلي', 'مزود الاستضافة السحابية المعتمد بالمغرب'],
      retentionPeriod: 'Account lifetime + 1 year after closure',
      retentionPeriodAr: 'طيلة مدة تفعيل الحساب + سنة واحدة بعد الإغلاق',
      isCrossBorder: !report.sovereigntyStatus.isMoroccoHosted,
      crossBorderCountry: report.sovereigntyStatus.isMoroccoHosted ? undefined : report.sovereigntyStatus.location,
      securityMeasures: ['Argon2 / bcrypt password hashing', 'TLS 1.3 in transit', 'RBAC access control'],
      securityMeasuresAr: ['تشفير كلمات المرور بـ Argon2', 'بروتوكول TLS 1.3 للنقل المشفر', 'نظام صلاحيات صارم RBAC'],
      status: 'ACTIVE'
    },
    {
      id: 'act-2',
      name: 'Connection Logs & Forensic Traceability',
      nameAr: 'سجلات الاتصال والتتبع الجنائي الرقمي (ANRT / DGSSI)',
      purpose: 'Compliance with Moroccan cyber security directives, forensic incident response, anti-fraud.',
      purposeAr: 'الاستجابة لمتطلبات المديرية العامة لأمن نظم المعلومات (DGSSI) والتحقيق في الحوادث السيبرانية.',
      legalBasis: 'LegalObligation',
      legalBasisAr: 'التزام قانوني نظامي (المادة 3)',
      law0809Article: 'المادة 3 و 23',
      dataCategories: ['Timestamped access logs', 'Source IP', 'User-Agent', 'HTTP methods & routes'],
      dataCategoriesAr: ['سجلات الولوج الزمنية', 'عناوين IP المصدر', 'بصمة المتصفح User-Agent', 'روابط الطلبات الرقمية'],
      dataSubjects: ['All Website Visitors', 'API Consumers'],
      dataSubjectsAr: ['جميع زوار الموقع', 'مستخدمو واجهات API'],
      recipients: ['DGSSI Authorities upon judicial warrant', 'SOC Team'],
      recipientsAr: ['السلطات القضائية والأمنية المختصة عند الطلب', 'مركز العمليات الأمنية SOC'],
      retentionPeriod: '12 months (Mandatory legal retention)',
      retentionPeriodAr: '12 شهراً إجبارية بموجب النصوص المنظمة لأمن نظم المعلومات',
      isCrossBorder: false,
      securityMeasures: ['Immutable append-only audit trail', 'Log integrity hashing (SHA-256)'],
      securityMeasuresAr: ['سجلات غير قابلة للتعديل Append-Only', 'توقيع سلامة السجلات بـ SHA-256'],
      status: 'ACTIVE'
    },
    {
      id: 'act-3',
      name: 'Audience Analytics & Performance Metrics',
      nameAr: 'تحليلات الأداء وقياس مؤشرات الزيارات (Cookies & Analytics)',
      purpose: 'Optimizing platform usability, aggregated performance benchmarks without invasive profiling.',
      purposeAr: 'قياس أداء البوابة وتحسين تجربة التصفح دون أي تجزئة إعلانية غير مصرح بها.',
      legalBasis: 'Consent',
      legalBasisAr: 'الموافقة الصريحة الحرة (مداولة CNDP رقم 08-2020)',
      law0809Article: 'مداولة 08-2020 والمادة 4',
      dataCategories: ['Anonymized IP (last octet masked)', 'Browser type', 'Screen resolution', 'Referrer header'],
      dataCategoriesAr: ['عناوين IP معماة (إخفاء الجزء الأخير)', 'نوع المتصفح', 'أبعاد الشاشة', 'مصدر الإحالة'],
      dataSubjects: ['Consent-Given Visitors'],
      dataSubjectsAr: ['الزوار الذين منحوا موافقة صريحة عبر لافتة الكوكيز'],
      recipients: ['Analytics processor'],
      recipientsAr: ['نظام التحليلات السيادي'],
      retentionPeriod: '6 months maximum',
      retentionPeriodAr: '6 أشهر كحد أقصى وفق توجيهات اللجنة الوطنية CNDP',
      isCrossBorder: report.cookies.some(c => c.category === 'Analytics' && c.provider.toLowerCase().includes('google')),
      crossBorderCountry: report.cookies.some(c => c.category === 'Analytics' && c.provider.toLowerCase().includes('google')) ? 'USA (Google Cloud)' : undefined,
      securityMeasures: ['Zero cookies dropped before explicit opt-in', 'IP Anonymization active'],
      securityMeasuresAr: ['حظر الإيداع قبل الموافقة الصريحة', 'تفعيل بروتوكول تعمية الـ IP الفوري'],
      status: 'ACTIVE'
    }
  ], [report]);

  const [activities, setActivities] = useState<RopaActivity[]>(defaultActivities);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New activity form state
  const [newName, setNewName] = useState('');
  const [newPurpose, setNewPurpose] = useState('');
  const [newLegalBasis, setNewLegalBasis] = useState<RopaActivity['legalBasis']>('Consent');
  const [newDataCategories, setNewDataCategories] = useState('');
  const [newRetention, setNewRetention] = useState('24 months');

  if (!isOpen) return null;

  const filteredActivities = activities.filter(a => 
    (isAr ? a.nameAr : a.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
    (isAr ? a.purposeAr : a.purpose).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddActivity = () => {
    if (!newName.trim()) return;
    const item: RopaActivity = {
      id: `act-${Date.now()}`,
      name: newName,
      nameAr: newName,
      purpose: newPurpose || 'Processing necessary for operations',
      purposeAr: newPurpose || 'معالجة تقنية وإدارية محددة وفق المادة 23 من القانون 08-09',
      legalBasis: newLegalBasis,
      legalBasisAr: newLegalBasis === 'Consent' ? 'الموافقة الصريحة (المادة 4)' : newLegalBasis === 'Contract' ? 'تنفيذ العقد' : 'التزام قانوني',
      law0809Article: 'المادة 23',
      dataCategories: newDataCategories ? newDataCategories.split(',').map(s => s.trim()) : ['General data'],
      dataCategoriesAr: newDataCategories ? newDataCategories.split(',').map(s => s.trim()) : ['معطيات عامة'],
      dataSubjects: ['Users'],
      dataSubjectsAr: ['المعنيون بالأمر'],
      recipients: ['Internal Authorized Staff'],
      recipientsAr: ['الموظفون المخولون داخلياً'],
      retentionPeriod: newRetention,
      retentionPeriodAr: newRetention,
      isCrossBorder: false,
      securityMeasures: ['Standard encryption in transit & rest'],
      securityMeasuresAr: ['تشفير المعطيات أثناء النقل والتخزين'],
      status: 'ACTIVE'
    };
    setActivities([item, ...activities]);
    setNewName('');
    setNewPurpose('');
    setNewDataCategories('');
    setIsAddingNew(false);
  };

  const handleDeleteActivity = (id: string) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  const exportCsv = () => {
    const headers = isAr
      ? ['معرف النشاط', 'اسم المعالجة', 'الغاية من المعالجة', 'الأساس القانوني', 'فئات المعطيات', 'مدة الاحتفاظ', 'نقل للخارج', 'الحالة']
      : ['Activity ID', 'Processing Name', 'Purpose', 'Legal Basis', 'Data Categories', 'Retention Period', 'Cross Border', 'Status'];

    const rows = activities.map(a => [
      a.id,
      `"${isAr ? a.nameAr : a.name}"`,
      `"${isAr ? a.purposeAr : a.purpose}"`,
      `"${isAr ? a.legalBasisAr : a.legalBasis}"`,
      `"${(isAr ? a.dataCategoriesAr : a.dataCategories).join(' | ')}"`,
      `"${isAr ? a.retentionPeriodAr : a.retentionPeriod}"`,
      a.isCrossBorder ? (isAr ? 'نعم (خارج المملكة)' : 'Yes') : (isAr ? 'لا (محلي مغربي)' : 'No'),
      a.status
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Soverify_RoPA_Register_${report.domain}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4 sm:p-5 bg-slate-950/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-mono">
                  {isAr ? 'سجل أنشطة المعالجة الإلزامي (RoPA - المادة 23)' : 'Record of Processing Activities (RoPA - Art. 23)'}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Loi 08-09 CNDP
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isAr 
                  ? `السجل الرسمي لأنشطة معالجة المعطيات الشخصية لنطاق: ${report.domain}` 
                  : `Official statutory register of personal data processing for: ${report.domain}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'ar' ? 'fr' : 'ar')}
              className="px-2.5 py-1 text-xs rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white font-mono"
            >
              {lang === 'ar' ? 'Français' : 'العربية'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-4 bg-slate-950/50 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="relative flex-1 min-w-[220px]">
            <Search className={`absolute top-2.5 ${isAr ? 'right-3' : 'left-3'} h-4 w-4 text-slate-400`} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isAr ? 'بحث في أنشطة المعالجة أو الغايات...' : 'Search processing activities or purposes...'}
              className={`w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2 ${isAr ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'} text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none`}
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>{isAr ? 'إضافة نشاط معالجة جديد' : 'New Activity'}</span>
            </button>
            <button
              onClick={exportCsv}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
            >
              <Download className="h-4 w-4 text-emerald-400" />
              <span>{isAr ? 'تصدير Excel / CSV' : 'Export CSV'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-sky-500/40 bg-sky-950/60 hover:bg-sky-900/60 text-sky-300 text-xs font-bold transition"
            >
              <Printer className="h-4 w-4 text-sky-400" />
              <span>{isAr ? 'طباعة السجل الرسمي' : 'Print Register'}</span>
            </button>
          </div>
        </div>

        {/* New Activity Collapsible Form */}
        {isAddingNew && (
          <div className="p-4 bg-emerald-950/20 border-b border-emerald-500/30 space-y-3 shrink-0 animate-fadeIn">
            <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              {isAr ? 'تسجيل نشاط معالجة جديد في السجل السيادي' : 'Register New Processing Activity'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">{isAr ? 'اسم المعالجة' : 'Processing Name'}</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={isAr ? 'مثال: معالجة بيانات المترشحين للتوظيف' : 'e.g., Recruitment & Candidate Data'}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white text-xs focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">{isAr ? 'الغاية الأساسية (المادة 23)' : 'Purpose'}</label>
                <input
                  type="text"
                  value={newPurpose}
                  onChange={(e) => setNewPurpose(e.target.value)}
                  placeholder={isAr ? 'دراسة السير الذاتية وتحديد المقابلات' : 'CV screening and interview scheduling'}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white text-xs focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">{isAr ? 'الأساس القانوني' : 'Legal Basis'}</label>
                <select
                  value={newLegalBasis}
                  onChange={(e) => setNewLegalBasis(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white text-xs focus:border-emerald-500"
                >
                  <option value="Consent">{isAr ? 'الموافقة الصريحة (المادة 4)' : 'Explicit Consent'}</option>
                  <option value="Contract">{isAr ? 'تنفيذ العقد' : 'Contract Execution'}</option>
                  <option value="LegalObligation">{isAr ? 'التزام قانوني تنظيمي' : 'Legal Obligation'}</option>
                  <option value="PublicInterest">{isAr ? 'المصلحة العامة' : 'Public Interest'}</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] text-slate-400 mb-1">{isAr ? 'فئات المعطيات (مفصولة بفاصلة)' : 'Data Categories (comma-separated)'}</label>
                <input
                  type="text"
                  value={newDataCategories}
                  onChange={(e) => setNewDataCategories(e.target.value)}
                  placeholder={isAr ? 'الاسم، رقم الهاتف، المؤهلات العلمية، الدبلومات' : 'Name, Phone, Diploma, Experience'}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white text-xs focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">{isAr ? 'مدة الاحتفاظ' : 'Retention'}</label>
                <input
                  type="text"
                  value={newRetention}
                  onChange={(e) => setNewRetention(e.target.value)}
                  placeholder="24 months"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-white text-xs focus:border-emerald-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white text-xs"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleAddActivity}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                {isAr ? 'حفظ وإدراج في السجل' : 'Save to Register'}
              </button>
            </div>
          </div>
        )}

        {/* Activities Table Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
            <span>
              {isAr ? `إجمالي الأنشطة المقيدة: ${filteredActivities.length}` : `Total registered processing: ${filteredActivities.length}`}
            </span>
            <span className="font-mono text-[11px] text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              {isAr ? 'مطابق لمتطلبات المادة 23 من القانون 08-09' : 'Compliant with Article 23 (Morocco Law 08/09)'}
            </span>
          </div>

          <div className="space-y-3">
            {filteredActivities.map((act) => (
              <div
                key={act.id}
                className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 transition hover:border-slate-700 space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800/60">
                        {act.id}
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        {isAr ? act.nameAr : act.name}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {isAr ? act.purposeAr : act.purpose}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-950/80 border border-sky-800 text-sky-300">
                      {isAr ? act.legalBasisAr : act.legalBasis}
                    </span>
                    <button
                      onClick={() => handleDeleteActivity(act.id)}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 transition"
                      title={isAr ? 'حذف النشاط' : 'Delete activity'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block mb-1">
                      {isAr ? 'فئات المعطيات المعالجة:' : 'Data Categories:'}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {(isAr ? act.dataCategoriesAr : act.dataCategories).map((c, i) => (
                        <span key={i} className="text-[10px] bg-slate-900 border border-slate-700/80 text-slate-200 px-1.5 py-0.5 rounded">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block mb-1">
                      {isAr ? 'مدة الاحتفاظ والتقادم:' : 'Retention Period:'}
                    </span>
                    <span className="text-xs font-mono text-amber-300">
                      {isAr ? act.retentionPeriodAr : act.retentionPeriod}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-400 block mb-1">
                      {isAr ? 'التوطين ونقل المعطيات:' : 'Residency & Cross-Border:'}
                    </span>
                    {act.isCrossBorder ? (
                      <span className="text-[11px] font-mono text-rose-300 flex items-center gap-1">
                        <Globe2 className="h-3 w-3 text-rose-400" />
                        {isAr ? `نقل دولي (${act.crossBorderCountry || 'خارج المغرب'})` : `Cross-Border (${act.crossBorderCountry})`}
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-emerald-300 flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3 text-emerald-400" />
                        {isAr ? 'توطين سيادي داخل المملكة المغربية' : 'Moroccan Sovereign Hosting'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Security Measures */}
                <div className="pt-2 border-t border-slate-900 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                  <span className="font-bold text-slate-300 flex items-center gap-1">
                    <Lock className="h-3 w-3 text-emerald-400" />
                    {isAr ? 'تدابير الأمان المنصوص عليها:' : 'Security Measures:'}
                  </span>
                  {(isAr ? act.securityMeasuresAr : act.securityMeasures).join(' • ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info & notice */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-emerald-400" />
            <span>
              {isAr 
                ? 'وفق المادة 23، يجب وضع هذا السجل رهن إشارة أعوان ومفتشي اللجنة الوطنية CNDP عند كل عملية مراقبة.' 
                : 'Article 23 mandates keeping this register available for CNDP regulatory inspectors at all times.'}
            </span>
          </div>
          <span className="font-mono text-slate-500">
            Soverify Sovereign RoPA v2.4
          </span>
        </div>

      </div>
    </div>
  );
};
