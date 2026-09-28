import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Scale, 
  Calendar, 
  ShieldCheck, 
  UserCheck, 
  Eye, 
  Trash2, 
  AlertCircle,
  FileCheck2,
  Printer
} from 'lucide-react';
import { SUBJECT_RIGHTS_TEMPLATES } from '../data/dpiaAndRightsData';
import { SubjectRightTemplate } from '../types/enterpriseFeatures';

interface SubjectRightsTabProps {
  lang: 'ar' | 'en';
  onConsultDpo?: (topic?: string) => void;
}

export const SubjectRightsTab: React.FC<SubjectRightsTabProps> = ({
  lang,
  onConsultDpo
}) => {
  const isAr = lang === 'ar';
  const [selectedTemplate, setSelectedTemplate] = useState<SubjectRightTemplate>(SUBJECT_RIGHTS_TEMPLATES[0]);
  const [selectedLang, setSelectedLang] = useState<'ar' | 'fr'>('ar');
  const [copied, setCopied] = useState(false);
  const [recipientName, setRecipientName] = useState('محمد العلمي / Mohammed Alami');
  const [dpoName, setDpoName] = useState('طه الستري / Taha Setri (DPO)');
  const [cndpNumber, setCndpNumber] = useState('D-W-2024-8841');

  const getCustomizedText = (text: string) => {
    return text
      .replace(/\[اسم المواطن \/ طالب الحق\]/g, recipientName)
      .replace(/\[Nom & Prénom du Demandeur\]/g, recipientName)
      .replace(/\[اسم المعني بالأمر\]/g, recipientName)
      .replace(/\[Nom du Demandeur\]/g, recipientName)
      .replace(/\[رقم التصريح\]/g, cndpNumber)
      .replace(/\[A-VS-XXXX\/202X\]/g, cndpNumber)
      .replace(/\[تاريخ الطلب\]/g, new Date().toLocaleDateString('fr-FR'))
      .replace(/\[Date de réception\]/g, new Date().toLocaleDateString('fr-FR'))
      .replace(/\[تاريخ اليوم\]/g, new Date().toLocaleDateString('fr-FR'))
      .replace(/\[Date\]/g, new Date().toLocaleDateString('fr-FR'));
  };

  const currentContent = selectedLang === 'ar' 
    ? getCustomizedText(selectedTemplate.arabicText) 
    : getCustomizedText(selectedTemplate.frenchText);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([currentContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soverify_${selectedTemplate.id}_${selectedLang}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl border border-teal-500/30 bg-gradient-to-br from-teal-950/60 via-slate-900 to-slate-950 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-lg border border-teal-500/40 bg-teal-500/10 px-3 py-1 text-xs font-mono font-bold text-teal-400">
              <Scale className="h-4 w-4" />
              <span>{isAr ? 'المواد 7، 8، 9 من القانون 08-09' : 'Loi 08-09 Data Subject Rights'}</span>
            </div>
            <h2 className="text-2xl font-black text-white font-mono flex items-center gap-2">
              {isAr ? 'منظومة ممارسة حقوق المعنيين بالأمر (Exercice des Droits)' : 'Data Subject Rights & Legal Response Suite'}
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isAr
                ? 'نماذج قانونية معتمدة ورسائل رسمية ثنائية اللغة (عربي / فرنسي) للاستجابة لطلبات المواطنين في الولوج، التصحيح، ومحو البيانات خلال الأجل القانوني (30 يوماً).'
                : 'Statutory bilingual letter templates and formal response certificates for handling Moroccan citizen requests under Law 08-09.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex rounded-xl bg-slate-900 border border-slate-800 p-1 text-xs font-bold">
              <button
                onClick={() => setSelectedLang('ar')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  selectedLang === 'ar' ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                العربية
              </button>
              <button
                onClick={() => setSelectedLang('fr')}
                className={`px-3 py-1.5 rounded-lg transition ${
                  selectedLang === 'fr' ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Français
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Selector & Editor/Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Template Cards */}
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <FileCheck2 className="h-4 w-4 text-teal-400" />
            <span>{isAr ? 'النماذج القانونية المعتمدة:' : 'Statutory Templates:'}</span>
          </h3>

          {SUBJECT_RIGHTS_TEMPLATES.map((tmpl) => {
            const isSelected = selectedTemplate.id === tmpl.id;
            return (
              <div
                key={tmpl.id}
                onClick={() => setSelectedTemplate(tmpl)}
                className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'border-teal-500/60 bg-teal-950/30 shadow-lg shadow-teal-950/40 ring-1 ring-teal-500/30'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
                    {tmpl.lawArticle}
                  </span>
                  {tmpl.slaDays > 0 && (
                    <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {isAr ? `أجل أقصى: ${tmpl.slaDays} يوماً` : `SLA: ${tmpl.slaDays} Days`}
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-white leading-snug">
                  {isAr ? tmpl.titleAr : tmpl.titleEn}
                </h4>

                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {isAr ? tmpl.descriptionAr : tmpl.descriptionEn}
                </p>
              </div>
            );
          })}

          {/* Quick Customization Fields */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-3 mt-4">
            <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-teal-400" />
              <span>{isAr ? 'تخصيص بيانات الوثيقة آلياً:' : 'Auto-Fill Variables:'}</span>
            </h4>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">{isAr ? 'اسم المواطن / المعني بالأمر:' : 'Subject Full Name:'}</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">{isAr ? 'رقم ترخيص / إشعار CNDP للمؤسسة:' : 'CNDP Receipt N°:'}</label>
              <input
                type="text"
                value={cndpNumber}
                onChange={(e) => setCndpNumber(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Formal Document Viewer */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl p-6 flex flex-col flex-1 justify-between space-y-4">
            {/* Document Header Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-teal-400 block">
                  {selectedTemplate.lawArticle}
                </span>
                <h3 className="text-base font-bold text-white">
                  {isAr ? selectedTemplate.titleAr : selectedTemplate.titleEn}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ النص' : 'Copy Text')}</span>
                </button>
                <button
                  onClick={handleDownloadTxt}
                  className="flex items-center gap-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 px-3 py-1.5 text-xs font-bold text-slate-950 transition shadow-md"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{isAr ? 'تنزيل الوثيقة' : 'Download TXT'}</span>
                </button>
              </div>
            </div>

            {/* Document Parchment / Preview */}
            <div 
              className={`p-6 rounded-xl border border-slate-800/80 bg-slate-950 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-line shadow-inner max-h-[500px] overflow-y-auto select-text ${
                selectedLang === 'ar' ? 'rtl text-right font-sans' : 'ltr text-left'
              }`}
              dir={selectedLang === 'ar' ? 'rtl' : 'ltr'}
            >
              {currentContent}
            </div>

            {/* Statutory Compliance Footer Notice */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-3 flex items-center gap-2.5 text-xs text-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
              <span>
                {isAr
                  ? 'تنبيه نظامي: عدم الرد على طلبات ممارسة الحقوق خلال 30 يوماً يعرّض مسؤولي المعالجة للعقوبات والغرامات المنصوص عليها في المادة 53 من القانون 08-09.'
                  : 'Statutory Notice: Failure to resolve subject requests within 30 days incurs penalties under Article 53 of Moroccan Law 08-09.'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
