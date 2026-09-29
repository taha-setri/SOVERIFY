import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  X, 
  HelpCircle,
  FileCheck2,
  Lock,
  Globe2,
  AlertTriangle
} from 'lucide-react';
import { AuditReport, UserAccount } from '../types';

interface CndpDeclarationModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: AuditReport;
  user: UserAccount | null;
  lang: 'ar' | 'en';
}

export const CndpDeclarationModal: React.FC<CndpDeclarationModalProps> = ({
  isOpen,
  onClose,
  report,
  user,
  lang: initialLang
}) => {
  const [lang, setLang] = useState<'ar' | 'fr'>(initialLang === 'ar' ? 'ar' : 'fr');
  const [companyName, setCompanyName] = useState(user?.company || user?.organization || 'المؤسسة الوطنية / SARL');
  const [rcNumber, setRcNumber] = useState('RC-TET-2024-8921');
  const [iceNumber, setIceNumber] = useState('002891928000045');
  const [dpoName, setDpoName] = useState(user?.name || 'طه ستري (Taha Setri)');
  const [dpoEmail, setDpoEmail] = useState(user?.email || 'dpo@' + report.domain);
  const [serverHost, setServerHost] = useState(report.sovereigntyStatus.location || 'Maroc Datacenter (Casablanca)');
  const [treatmentPurpose, setTreatmentPurpose] = useState(
    'Gestion de la plateforme web, relation client, traçabilité des accès et conformité aux obligations de la Loi 08-09'
  );
  const [crossBorderTransfer, setCrossBorderTransfer] = useState<'yes' | 'no'>(
    (report.sovereigntyStatus.isMoroccoHosted ?? report.sovereigntyStatus.isMoroccanHosting) ? 'no' : 'yes'
  );
  const [isCopied, setIsCopied] = useState(false);
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const isAr = lang === 'ar';
  const currentDate = new Date().toLocaleDateString(isAr ? 'ar-MA' : 'fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const declarationRef = `CNDP-DEC-0809-${new Date().getFullYear()}-${report.id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase()}`;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    if (printAreaRef.current) {
      navigator.clipboard.writeText(printAreaRef.current.innerText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl border border-emerald-500/40 bg-slate-900 shadow-2xl overflow-hidden flex flex-col my-4 max-h-[96vh]">
        
        {/* Top Header Control Bar */}
        <div className="no-print flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 p-4 bg-slate-950/90 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 shadow-md">
              <FileCheck2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-mono">
                  {isAr ? 'مولد وثائق التصريح المسبق للجنة CNDP' : 'Générateur de Déclaration Préalable CNDP'}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Loi 08-09 (Art. 12 & 15)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isAr 
                  ? 'وثيقة رسمية مطابقة للمعيار الوطني لإيداع ملفات المعالجة لدى مقر اللجنة الوطنية بالرباط' 
                  : 'Dossier officiel pré-rempli pour soumission légale à la Commission Nationale CNDP Rabat'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Lang switcher */}
            <div className="flex rounded-lg border border-slate-700 bg-slate-800 p-0.5 text-xs font-mono">
              <button
                onClick={() => setLang('ar')}
                className={`px-2.5 py-1 rounded-md transition ${lang === 'ar' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                العربية
              </button>
              <button
                onClick={() => setLang('fr')}
                className={`px-2.5 py-1 rounded-md transition ${lang === 'fr' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Français
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition shadow-md"
            >
              <Printer className="h-4 w-4" />
              <span>{isAr ? 'طباعة الاستمارة' : 'Imprimer'}</span>
            </button>

            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition"
            >
              {isCopied ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <FileText className="h-4 w-4" />}
              <span>{isCopied ? (isAr ? 'تم النسخ!' : 'Copié!') : (isAr ? 'نسخ النص' : 'Copier texte')}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Customization Inputs Panel */}
        <div className="no-print bg-slate-950/70 border-b border-slate-800 p-4 text-xs text-slate-300 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-mono">{isAr ? 'اسم الشركة / الهيئة:' : 'Raison Sociale / Entité:'}</label>
            <input 
              type="text" 
              value={companyName} 
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-mono">{isAr ? 'رقم السجل التجاري (RC) & ICE:' : 'N° RC & Identifiant ICE:'}</label>
            <div className="flex gap-1.5">
              <input 
                type="text" 
                value={rcNumber} 
                onChange={(e) => setRcNumber(e.target.value)}
                className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-[11px] focus:border-emerald-500 focus:outline-none"
                placeholder="RC"
              />
              <input 
                type="text" 
                value={iceNumber} 
                onChange={(e) => setIceNumber(e.target.value)}
                className="w-1/2 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-[11px] focus:border-emerald-500 focus:outline-none"
                placeholder="ICE"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-mono">{isAr ? 'المسؤول عن المعالجة (DPO):' : 'Responsable du Traitement (DPO):'}</label>
            <input 
              type="text" 
              value={dpoName} 
              onChange={(e) => setDpoName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[11px] text-slate-400 mb-1 font-mono">{isAr ? 'نقل البيانات إلى الخارج (Art. 43):' : 'Transfert Transfrontalier (Art. 43):'}</label>
            <select
              value={crossBorderTransfer}
              onChange={(e) => setCrossBorderTransfer(e.target.value as 'yes' | 'no')}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white focus:border-emerald-500 focus:outline-none font-mono"
            >
              <option value="no">{isAr ? 'لا يوجد نقل (استضافة وطنية بالمغرب)' : 'Non (Hébergé au Maroc)'}</option>
              <option value="yes">{isAr ? 'نعم (يستلزم ترخيص خاص من CNDP)' : 'Oui (Soumis à Autorisation Expresse)'}</option>
            </select>
          </div>
        </div>

        {/* Printable Official CNDP Dossier Sheet */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950/60 flex justify-center">
          <div
            ref={printAreaRef}
            dir={isAr ? 'rtl' : 'ltr'}
            className="w-full max-w-[850px] bg-white text-slate-900 p-8 sm:p-12 shadow-2xl rounded-sm border border-slate-300 text-xs leading-relaxed space-y-6 select-text print:p-0 print:border-none print:shadow-none"
          >
            {/* Document Official Header */}
            <div className="border-b-2 border-slate-900 pb-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-wider text-emerald-900 font-mono">
                    ROYAUME DU MAROC • COMMISION NATIONALE DE CONTRÔLE DE PROTECTION DES DONNÉES À CARACTÈRE PERSONNEL
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-950 font-serif">
                    {isAr 
                      ? 'تصريح مسبق بمعالجة المعطيات ذات الطابع الشخصي' 
                      : 'DÉCLARATION PRÉALABLE DE TRAITEMENT DE DONNÉES PERSONNELLES'}
                  </h1>
                  <p className="text-[11px] font-semibold text-slate-700">
                    {isAr 
                      ? 'تطبيقاً لمقتضيات المادتين 12 و15 من القانون رقم 08.09 الصادر بتنفيذه الظهير الشريف رقم 1.09.15' 
                      : 'En application des articles 12 et 15 de la Loi n° 08-09 promulguée par le Dahir n° 1-09-15'}
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-2 border-2 border-slate-900 p-2 rounded bg-slate-50 text-center">
                  <img src="/logo.png" alt="Soverify" className="h-10 w-10 object-contain" />
                  <div className="text-[9px] font-mono leading-tight text-right">
                    <span className="block font-bold text-slate-900">FORMULAIRE OFFICIEL</span>
                    <span className="text-emerald-700 font-bold">CNDP-08/09</span>
                    <span className="block text-[8px] text-slate-500">Réf: {declarationRef}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cadre 1: Identité du Responsable de Traitement */}
            <div className="border border-slate-800 rounded p-4 bg-slate-50/50 space-y-3">
              <div className="bg-slate-900 text-white px-2.5 py-1 text-[11px] font-bold font-mono uppercase tracking-wider rounded-sm flex items-center justify-between">
                <span>{isAr ? '1. هوية المسؤول عن المعالجة (Le Responsable du Traitement)' : '1. IDENTIFICATION DU RESPONSABLE DU TRAITEMENT'}</span>
                <span className="text-[9px] text-emerald-400 font-normal">Art. 13 - Loi 08-09</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">{isAr ? 'الاسم التجاري / الشركة:' : 'Raison Sociale:'}</span>
                  <span className="font-bold text-slate-900 text-sm">{companyName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">{isAr ? 'النطاق / الموقع الرقمي:' : 'Domaine / Application Web:'}</span>
                  <span className="font-mono font-bold text-emerald-800">{report.domain}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">{isAr ? 'السجل التجاري (RC) والتعريف الموحد (ICE):' : 'RC & Identifiant Commun (ICE):'}</span>
                  <span className="font-mono text-slate-800">{rcNumber} / ICE: {iceNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">{isAr ? 'الشخص المعين / ضابط الامتثال (DPO):' : 'Délégué à la Protection des Données (DPO):'}</span>
                  <span className="font-semibold text-slate-900">{dpoName} ({dpoEmail})</span>
                </div>
              </div>
            </div>

            {/* Cadre 2: Finalités et Catégories de Données */}
            <div className="border border-slate-800 rounded p-4 bg-slate-50/50 space-y-3">
              <div className="bg-slate-900 text-white px-2.5 py-1 text-[11px] font-bold font-mono uppercase tracking-wider rounded-sm flex items-center justify-between">
                <span>{isAr ? '2. الغايات من المعالجة وطبيعة المعطيات (Finalités & Catégories)' : '2. FINALITÉS ET CATÉGORIES DES DONNÉES COLLECTÉES'}</span>
                <span className="text-[9px] text-emerald-400 font-normal">Art. 3 & 4 - Loi 08-09</span>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">{isAr ? 'الغاية المحددة والصريحة للمعالجة:' : 'Finalité Déterminée, Explicite et Légitime:'}</span>
                  <p className="text-slate-800 italic bg-white p-2 rounded border border-slate-200 mt-1">
                    "{treatmentPurpose}"
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">{isAr ? 'فئات المعطيات المجمعة عبر المنصة:' : 'Catégories de données traitées:'}</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5 p-1.5 bg-white rounded border border-slate-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{isAr ? 'معطيات التعريف (الاسم، البريد الإلكتروني، الهاتف)' : 'Données d’identification (Nom, Email, Tél)'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-1.5 bg-white rounded border border-slate-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>{isAr ? 'معطيات التتبع والاتصال (عناوين IP، ملفات تعريف الارتباط)' : 'Données de connexion (IP, Cookies techniques)'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cadre 3: Localisation des Serveurs & Transfert à l'Étranger */}
            <div className="border border-slate-800 rounded p-4 bg-slate-50/50 space-y-3">
              <div className="bg-slate-900 text-white px-2.5 py-1 text-[11px] font-bold font-mono uppercase tracking-wider rounded-sm flex items-center justify-between">
                <span>{isAr ? '3. التوطين والسيادة الرقمية (Localisation & Souveraineté)' : '3. LOCALISATION DE L’HÉBERGEMENT & TRANSFERTS'}</span>
                <span className="text-[9px] text-emerald-400 font-normal">Art. 23, 43 & 44</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">{isAr ? 'موقع خوادم المعالجة وقواعد البيانات:' : 'Localisation des serveurs de stockage:'}</span>
                  <span className="font-bold text-slate-900">{serverHost}</span>
                  <span className="block text-[10px] text-slate-500 mt-0.5 font-mono">
                    IP: {report.serverIp || report.sovereigntyStatus.ip || '196.200.160.1'} ({(report.sovereigntyStatus.isMoroccoHosted ?? report.sovereigntyStatus.isMoroccanHosting) ? 'Maroc / National' : 'Étranger / International'})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">{isAr ? 'الوضعية القانونية لنقل المعطيات للخارج:' : 'Régime du transfert hors du Maroc (Art. 43):'}</span>
                  {crossBorderTransfer === 'no' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      {isAr ? 'معفى (البيانات محفوظة بالكامل داخل المغرب)' : 'Exempt (Stockage 100% Souverain au Maroc)'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      {isAr ? 'يتطلب ترخيصاً مسبقاً صريحاً من CNDP' : 'Soumis à demande d’autorisation formelle'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Cadre 4: Mesures de Sécurité & Engagements */}
            <div className="border border-slate-800 rounded p-4 bg-slate-50/50 space-y-2">
              <div className="bg-slate-900 text-white px-2.5 py-1 text-[11px] font-bold font-mono uppercase tracking-wider rounded-sm flex items-center justify-between">
                <span>{isAr ? '4. التدابير الأمنية المتخذة (Sécurité des Traitements)' : '4. MESURES DE SÉCURITÉ TECHNIQUES & ORGANISATIONNELLES'}</span>
                <span className="text-[9px] text-emerald-400 font-normal">Art. 23 - Loi 08-09</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-700">
                <li>{isAr ? 'تشفير جميع القنوات باستخدام بروتوكول TLS 1.3 مع شهادات أمان معتمدة.' : 'Chiffrement systématique des flux via TLS 1.3.'}</li>
                <li>{isAr ? 'حصر صلاحيات الوصول لقواعد المعطيات وفق مبدأ الصلاحيات الدنيا (Least Privilege).' : 'Contrôle strict des accès et journalisation des consultations.'}</li>
                <li>{isAr ? 'إجراء تدقيق سيادي دوري ومستمر عبر منصة SOVERIFY™ المعتمدة.' : 'Audit de conformité continu opéré via la plateforme SOVERIFY™.'}</li>
              </ul>
            </div>

            {/* Cadre 5: Signature et Engagement */}
            <div className="pt-4 border-t-2 border-slate-800 grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-600 block">{isAr ? 'محرر بالرباط / تطوان في:' : 'Fait à Rabat / Tétouan, le:'}</span>
                <p className="font-bold text-slate-900">{currentDate}</p>
                <div className="mt-4 p-3 bg-slate-100 rounded border border-slate-300 text-center">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block mb-1">
                    {isAr ? 'خاتم وتوقيع ممثل المؤسسة المعتمد' : 'Cachet & Signature du Représentant Légal'}
                  </span>
                  <div className="h-16 flex items-center justify-center font-serif text-slate-400 italic">
                    [توقيع وختم المؤسسة الرسمي]
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-600 block">{isAr ? 'إفادة المطابقة الصادرة عن منظومة Soverify:' : 'Attestation d’Audit Numérique Soverify:'}</span>
                <div className="p-3 bg-emerald-50 rounded border border-emerald-300 text-[10px] font-mono space-y-1">
                  <div className="flex justify-between">
                    <span>Audit Score:</span>
                    <strong className="text-emerald-800">{report.score}/100</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Audit Hash:</span>
                    <span className="text-slate-600 truncate max-w-[140px]">{report.signature || 'SHA256-CNDP-VALID'}</span>
                  </div>
                  <div className="text-[9px] text-slate-500 pt-1 border-t border-emerald-200">
                    Document vérifié conformément à la méthodologie nationale SOVERIFY™.
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
