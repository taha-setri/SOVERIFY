import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Plus, 
  Trash2, 
  Download, 
  CheckCircle, 
  ShieldAlert, 
  Clock, 
  Building2, 
  Search, 
  Filter,
  Copy,
  ExternalLink,
  Info,
  FileCheck
} from 'lucide-react';
import { ProcessingActivity } from '../types/enterpriseFeatures';
import { INITIAL_PROCESSING_ACTIVITIES } from '../data/processingActivitiesData';

interface ProcessingRegistryTabProps {
  lang: 'ar' | 'en';
  onConsultDpo?: (topic?: string) => void;
}

export const ProcessingRegistryTab: React.FC<ProcessingRegistryTabProps> = ({
  lang,
  onConsultDpo
}) => {
  const isAr = lang === 'ar';
  const [activities, setActivities] = useState<ProcessingActivity[]>(INITIAL_PROCESSING_ACTIVITIES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [activeActivityModal, setActiveActivityModal] = useState<ProcessingActivity | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Activity form state
  const [formData, setFormData] = useState<Partial<ProcessingActivity>>({
    name: '',
    nameAr: '',
    department: 'Direction Générale',
    purpose: '',
    purposeAr: '',
    legalBasis: 'CONSENT',
    dataCategories: ['Identity / CIN'],
    dataCategoriesAr: ['معطيات الهوية والتعريف'],
    dataSubjects: ['Clients / زبناء'],
    dataSubjectsAr: ['الزبائن والعملاء'],
    recipients: ['Direction Commerciale'],
    retentionPeriod: '5 ans après fin de relation',
    retentionPeriodAr: '5 سنوات بعد انتهاء التعامل',
    securityMeasures: ['Chiffrement AES', 'Contrôle d’accès'],
    securityMeasuresAr: ['تشفير قواعد البيانات', 'مراقبة الصلاحيات'],
    crossBorderTransfer: false,
    cndpAuthorizationStatus: 'DECLARED',
    riskLevel: 'LOW'
  });

  const filteredActivities = activities.filter((act) => {
    const matchesSearch = 
      act.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.nameAr.includes(searchTerm) ||
      act.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (act.cndpDeclarationNumber && act.cndpDeclarationNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (selectedDept === 'ALL') return matchesSearch;
    return matchesSearch && act.department.includes(selectedDept);
  });

  const handleExportCSV = () => {
    const headers = [
      'ID',
      'Name (AR)',
      'Name (EN)',
      'Department',
      'Legal Basis',
      'Retention Period',
      'CNDP Status',
      'CNDP Receipt Number',
      'Cross Border Transfer',
      'Risk Level'
    ];

    const rows = activities.map(act => [
      act.id,
      `"${act.nameAr.replace(/"/g, '""')}"`,
      `"${act.name.replace(/"/g, '""')}"`,
      `"${act.department}"`,
      act.legalBasis,
      `"${act.retentionPeriodAr}"`,
      act.cndpAuthorizationStatus,
      act.cndpDeclarationNumber || 'N/A',
      act.crossBorderTransfer ? 'OUI' : 'NON',
      act.riskLevel
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `soverify_registre_cndp_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveNewActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nameAr || !formData.name) return;

    const newAct: ProcessingActivity = {
      id: `act-${Date.now().toString().slice(-4)}`,
      name: formData.name || 'Unnamed Activity',
      nameAr: formData.nameAr || 'نشاط غير معنون',
      department: formData.department || 'Général',
      purpose: formData.purpose || 'Traitement administratif interne.',
      purposeAr: formData.purposeAr || 'معالجة إدارية داخلية وفق ضوابط القانون 08-09.',
      legalBasis: formData.legalBasis || 'CONSENT',
      dataCategories: formData.dataCategories || ['Données de base'],
      dataCategoriesAr: formData.dataCategoriesAr || ['بيانات أساسية'],
      dataSubjects: formData.dataSubjects || ['Utilisateurs'],
      dataSubjectsAr: formData.dataSubjectsAr || ['المستخدمون'],
      recipients: formData.recipients || ['Services internes autorisés'],
      retentionPeriod: formData.retentionPeriod || 'Durée contractuelle',
      retentionPeriodAr: formData.retentionPeriodAr || 'طيلة مدة العلاقة القانونية',
      securityMeasures: formData.securityMeasures || ['Accès restreint'],
      securityMeasuresAr: formData.securityMeasuresAr || ['حماية الصلاحيات'],
      crossBorderTransfer: formData.crossBorderTransfer || false,
      cndpAuthorizationStatus: formData.cndpAuthorizationStatus || 'PENDING',
      cndpDeclarationNumber: formData.cndpDeclarationNumber || undefined,
      riskLevel: formData.riskLevel || 'LOW',
      lastUpdated: new Date().toISOString().substring(0, 10)
    };

    setActivities([newAct, ...activities]);
    setIsAddingNew(false);
  };

  const handleDelete = (id: string) => {
    setActivities(activities.filter(a => a.id !== id));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-mono font-bold text-emerald-400">
              <FileSpreadsheet className="h-4 w-4" />
              <span>{isAr ? 'المادة 12 وما يليها من القانون 08-09' : 'Loi 08-09 Art 12 Registry'}</span>
            </div>
            <h2 className="text-2xl font-black text-white font-mono flex items-center gap-2">
              {isAr ? 'سجل أنشطة معالجة البيانات الشخصية (CNDP Register)' : 'Personal Data Processing Activities Register'}
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isAr
                ? 'الوثيقة المرجعية الرسمية الملزمة قانوناً لكل مؤسسة وشركة بالمغرب لتوثيق أغراض المعالجة، الفئات المستهدفة، مدد الحفظ، وأرقام تصاريح اللجنة الوطنية CNDP.'
                : 'The statutory register mandated by Moroccan Law 08-09 for recording personal data operations, retention periods, legal baselines and CNDP authorizations.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/80 px-4 py-2.5 text-xs font-bold text-emerald-300 hover:text-white hover:bg-emerald-900/60 transition shadow-lg"
            >
              <Download className="h-4 w-4" />
              <span>{isAr ? 'تصدير السجل كـ Excel / CSV' : 'Export Register CSV'}</span>
            </button>
            <button
              onClick={() => setIsAddingNew(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-2.5 text-xs font-bold text-slate-950 hover:from-emerald-400 hover:to-teal-300 transition shadow-lg shadow-emerald-500/20"
            >
              <Plus className="h-4 w-4" />
              <span>{isAr ? 'إضافة نشاط معالجة جديد' : 'Add Processing Activity'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-2">
          <Search className={`absolute top-3 ${isAr ? 'right-3' : 'left-3'} h-4 w-4 text-slate-500`} />
          <input
            type="text"
            placeholder={isAr ? 'ابحث عن نشاط معالجة، قسم، أو رقم إشعار CNDP...' : 'Search activity, department, or CNDP receipt #...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none ${
              isAr ? 'pr-9 pl-4' : 'pl-9 pr-4'
            }`}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-2.5 text-xs text-slate-300 focus:border-emerald-500 focus:outline-none"
          >
            <option value="ALL">{isAr ? 'جميع الأقسام والمصالح' : 'All Departments'}</option>
            <option value="RH">{isAr ? 'الموارد البشرية (RH)' : 'Human Resources'}</option>
            <option value="Sécurité">{isAr ? 'الأمن والسلامة (Sécurité)' : 'Security / Facilities'}</option>
            <option value="Commercial">{isAr ? 'التجارة والزبناء (Commercial)' : 'Sales & E-Commerce'}</option>
            <option value="Logistique">{isAr ? 'اللوجستيك والنقل' : 'Logistics'}</option>
          </select>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredActivities.map((act) => {
          const isHighRisk = act.riskLevel === 'HIGH';
          const isAuthorized = act.cndpAuthorizationStatus === 'AUTHORIZED';
          const isDeclared = act.cndpAuthorizationStatus === 'DECLARED';

          return (
            <div
              key={act.id}
              className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur hover:border-slate-700 transition flex flex-col justify-between space-y-4 shadow-lg group"
            >
              <div className="space-y-3">
                {/* Header tags */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] font-mono font-bold text-slate-300">
                      {act.department}
                    </span>
                    <span className={`rounded-md border px-2 py-0.5 text-[10px] font-mono font-bold ${
                      isHighRisk 
                        ? 'border-red-500/40 bg-red-950/40 text-red-400' 
                        : 'border-emerald-500/40 bg-emerald-950/40 text-emerald-400'
                    }`}>
                      {act.riskLevel === 'HIGH' ? (isAr ? 'مخاطر عالية' : 'High Risk') : (isAr ? 'مخاطر اعتيادية' : 'Standard Risk')}
                    </span>
                  </div>

                  <span className={`flex items-center gap-1 text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    isAuthorized
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                      : isDeclared
                      ? 'border-blue-500/40 bg-blue-500/10 text-blue-300'
                      : 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                  }`}>
                    <FileCheck className="h-3 w-3" />
                    <span>{act.cndpAuthorizationStatus}</span>
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition">
                    {isAr ? act.nameAr : act.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {isAr ? act.purposeAr : act.purpose}
                  </p>
                </div>

                {/* Metadata badges */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="rounded-lg bg-slate-950/60 border border-slate-800/80 p-2 space-y-0.5">
                    <span className="text-[10px] font-mono text-slate-500 block">
                      {isAr ? 'السند القانوني الأساسي' : 'Legal Basis'}
                    </span>
                    <span className="font-semibold text-slate-200">{act.legalBasis}</span>
                  </div>
                  <div className="rounded-lg bg-slate-950/60 border border-slate-800/80 p-2 space-y-0.5">
                    <span className="text-[10px] font-mono text-slate-500 block">
                      {isAr ? 'مدة الحفظ المقررة' : 'Retention Window'}
                    </span>
                    <span className="font-semibold text-slate-200 line-clamp-1">
                      {isAr ? act.retentionPeriodAr : act.retentionPeriod}
                    </span>
                  </div>
                </div>

                {/* CNDP Receipt info if available */}
                {act.cndpDeclarationNumber && (
                  <div className="flex items-center justify-between gap-2 rounded-lg border border-teal-500/20 bg-teal-950/20 px-3 py-1.5 text-xs font-mono">
                    <span className="text-teal-400 flex items-center gap-1.5 font-bold">
                      <CheckCircle className="h-3.5 w-3.5" />
                      {isAr ? 'رقم الإشعار المعتمد:' : 'CNDP Receipt N°:'}
                    </span>
                    <button
                      onClick={() => copyToClipboard(act.cndpDeclarationNumber!, act.id)}
                      className="text-teal-200 font-bold hover:text-white flex items-center gap-1 transition"
                      title="Copy receipt number"
                    >
                      <span>{act.cndpDeclarationNumber}</span>
                      <Copy className="h-3 w-3 text-teal-400" />
                    </button>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs">
                <span className="text-[11px] text-slate-500 font-mono">
                  {isAr ? `تحديث: ${act.lastUpdated}` : `Updated: ${act.lastUpdated}`}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveActivityModal(act)}
                    className="rounded-lg bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-slate-200 text-xs font-semibold transition"
                  >
                    {isAr ? 'عرض التفاصيل الكاملة' : 'View Full Details'}
                  </button>
                  <button
                    onClick={() => handleDelete(act.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/40 transition"
                    title={isAr ? 'حذف النشاط من السجل' : 'Delete activity'}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: View Full Details */}
      {activeActivityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl rounded-2xl border border-emerald-500/40 bg-slate-900 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-emerald-400" />
                <h3 className="text-lg font-black text-white font-mono">
                  {isAr ? activeActivityModal.nameAr : activeActivityModal.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveActivityModal(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="text-slate-400 font-semibold mb-1">{isAr ? 'الغاية من المعالجة (Finalité):' : 'Processing Purpose:'}</h4>
                <p className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-slate-200 leading-relaxed">
                  {isAr ? activeActivityModal.purposeAr : activeActivityModal.purpose}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-slate-400 font-semibold mb-1">{isAr ? 'فئات البيانات المجمعة:' : 'Data Categories:'}</h4>
                  <ul className="list-disc list-inside bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-slate-300 space-y-1">
                    {(isAr ? activeActivityModal.dataCategoriesAr : activeActivityModal.dataCategories).map((cat, i) => (
                      <li key={i}>{cat}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-slate-400 font-semibold mb-1">{isAr ? 'الأشخاص المعنيون (Concerne):' : 'Data Subjects:'}</h4>
                  <ul className="list-disc list-inside bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-slate-300 space-y-1">
                    {(isAr ? activeActivityModal.dataSubjectsAr : activeActivityModal.dataSubjects).map((sub, i) => (
                      <li key={i}>{sub}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="text-slate-400 font-semibold mb-1">{isAr ? 'تدابير الحماية والأمان التقنية (المادة 23):' : 'Security Measures (Art 23):'}</h4>
                <div className="flex flex-wrap gap-2">
                  {(isAr ? activeActivityModal.securityMeasuresAr : activeActivityModal.securityMeasures).map((sec, i) => (
                    <span key={i} className="rounded-md border border-emerald-500/30 bg-emerald-950/40 px-2.5 py-1 text-emerald-300 font-mono">
                      ✓ {sec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-sky-500/30 bg-sky-950/30 p-3 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-sky-400 font-mono block">{isAr ? 'توطين المعطيات والسيادة الرقمية' : 'Sovereignty & Location'}</span>
                  <span className="text-xs text-white font-semibold">
                    {activeActivityModal.crossBorderTransfer 
                      ? (isAr ? 'يوجد نقل للخارج (يتطلب رخصة نقل CNDP)' : 'Cross-border transfer in effect (CNDP permit required)')
                      : (isAr ? 'مستضافة محلياً داخل المملكة المغربية 100%' : '100% Hosted within Kingdom of Morocco')}
                  </span>
                </div>
                {onConsultDpo && (
                  <button
                    onClick={() => {
                      setActiveActivityModal(null);
                      onConsultDpo(`استشارة حول نشاط المعالجة: ${activeActivityModal.nameAr}`);
                    }}
                    className="rounded-lg bg-sky-600/40 hover:bg-sky-600/60 border border-sky-400/40 px-3 py-1.5 text-sky-200 text-xs font-semibold"
                  >
                    {isAr ? 'استشر الـ DPO' : 'Ask DPO'}
                  </button>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveActivityModal(null)}
                className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-bold text-white"
              >
                {isAr ? 'إغلاق النافذة' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Activity Form */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl rounded-2xl border border-emerald-500/40 bg-slate-900 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-black text-white font-mono">
                {isAr ? 'تسجيل نشاط معالجة جديد في السجل القانوني' : 'Register New Processing Activity'}
              </h3>
              <button onClick={() => setIsAddingNew(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveNewActivity} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">{isAr ? 'اسم المعالجة بالعربية' : 'Activity Name (Arabic)'}</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: تدبير عقود العملاء والفوترة"
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">{isAr ? 'الاسم بالفرنسية / الإنجليزية' : 'Name (FR / EN)'}</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Customer Contracts & Invoicing"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">{isAr ? 'القسم / المصلحة المسؤولة' : 'Department'}</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">{isAr ? 'السند القانوني (Base Légale)' : 'Legal Basis'}</label>
                  <select
                    value={formData.legalBasis}
                    onChange={(e) => setFormData({ ...formData, legalBasis: e.target.value as any })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white"
                  >
                    <option value="CONSENT">موافقة صريحة مسبقة (Consentement)</option>
                    <option value="CONTRACT">تنفيذ عقد (Exécution de contrat)</option>
                    <option value="LEGAL_OBLIGATION">التزام قانوني وتنظيمي (Obligation légale)</option>
                    <option value="LEGITIMATE_INTEREST">المصلحة المشروعة (Intérêt légitime)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">{isAr ? 'الغاية المحددة من المعالجة' : 'Purpose'}</label>
                <textarea
                  rows={2}
                  placeholder="وصف دقيق للهدف القانوني والتقني من جمع هذه المعطيات..."
                  value={formData.purposeAr}
                  onChange={(e) => setFormData({ ...formData, purposeAr: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">{isAr ? 'مدة الحفظ المقررة' : 'Retention Period'}</label>
                  <input
                    type="text"
                    placeholder="مثال: 5 سنوات بعد نهاية التعاقد"
                    value={formData.retentionPeriodAr}
                    onChange={(e) => setFormData({ ...formData, retentionPeriodAr: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">{isAr ? 'رقم ترخيص / تصريح CNDP (إن وُجد)' : 'CNDP Receipt N°'}</label>
                  <input
                    type="text"
                    placeholder="ex: D-W-2024-XXXX"
                    value={formData.cndpDeclarationNumber || ''}
                    onChange={(e) => setFormData({ ...formData, cndpDeclarationNumber: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="rounded-xl bg-slate-800 hover:bg-slate-700 px-4 py-2 text-white font-bold"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-5 py-2 font-bold text-slate-950 hover:from-emerald-400"
                >
                  {isAr ? 'حفظ النشاط في السجل' : 'Save to Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
