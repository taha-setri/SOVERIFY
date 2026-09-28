import React, { useState } from 'react';
import { 
  Globe2, 
  Server, 
  ShieldAlert, 
  ShieldCheck, 
  MapPin, 
  ArrowRight, 
  AlertTriangle,
  Info,
  ExternalLink,
  Lock,
  Cpu
} from 'lucide-react';
import { AuditReport } from '../types';

interface SovereignMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: AuditReport;
  lang: 'ar' | 'en';
}

export const SovereignMapModal: React.FC<SovereignMapModalProps> = ({
  isOpen,
  onClose,
  report,
  lang
}) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'legal'>('visual');
  if (!isOpen) return null;

  const isAr = lang === 'ar';
  const isMorocco = report.sovereigntyStatus.isMoroccoHosted;
  const hostLocation = report.sovereigntyStatus.location || (isMorocco ? 'Casablanca, Morocco' : 'Frankfurt, Germany');
  const serverIp = report.sovereigntyStatus.ip || '196.200.160.45';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4 sm:p-5 bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isMorocco ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
              <Globe2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-mono">
                  {isAr ? 'خريطة التوطين الجغرافي والسيادة الرقمية' : 'Sovereign Data Residency & Border Map'}
                </h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${isMorocco ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'}`}>
                  {isMorocco ? (isAr ? 'سيرفر وطني مغربي' : 'National Morocco Host') : (isAr ? 'بيانات خارج الحدود' : 'Cross-Border Export')}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isAr ? `تتبع تدفق البيانات وموقع الخوادم لنطاق: ${report.domain}` : `Geographical trace of data packets & server location for: ${report.domain}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Map / Visualization Content */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto">
          
          {/* Visual Interactive Map Card */}
          <div className="relative rounded-2xl border border-slate-800 bg-slate-950 p-6 overflow-hidden">
            {/* Background cyber grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
                <div>
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                    {isAr ? 'المسار الرقمي لتدفق البيانات (Packet Flow):' : 'Data Packet Routing Flow:'}
                  </span>
                  <div className="flex items-center gap-2 text-sm font-bold text-white mt-1">
                    <span className="text-emerald-400">🇲🇦 {isAr ? 'مستخدم مغربي (Rabat / Tetouan)' : 'Morocco User'}</span>
                    <ArrowRight className="h-4 w-4 text-slate-500 animate-pulse" />
                    <span className={isMorocco ? 'text-emerald-300' : 'text-rose-400 font-mono'}>
                      {isMorocco ? '📍 داتاسنتر محلي (Casablanca)' : `🌐 ${hostLocation}`}
                    </span>
                  </div>
                </div>

                <div className="text-right sm:text-left">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">IP Server:</span>
                  <span className="font-mono text-xs text-emerald-400 font-bold bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
                    {serverIp}
                  </span>
                </div>
              </div>

              {/* Graphic Representation */}
              <div className="relative h-48 sm:h-56 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-around p-4 overflow-hidden">
                {/* Connection line */}
                <div className={`absolute top-1/2 left-1/4 right-1/4 h-0.5 border-t-2 border-dashed ${isMorocco ? 'border-emerald-500' : 'border-rose-500 animate-pulse'}`} />

                {/* Morocco Node */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-2">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-2xl bg-emerald-950/80 border-2 border-emerald-500 flex items-center justify-center text-2xl shadow-xl shadow-emerald-950/50">
                      🇲🇦
                    </div>
                    <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-ping" />
                  </div>
                  <div>
                    <span className="font-bold text-xs text-white block">{isAr ? 'المملكة المغربية' : 'Morocco Territory'}</span>
                    <span className="text-[10px] font-mono text-emerald-400">Loi 08-09 Jurisdiction</span>
                  </div>
                </div>

                {/* Status Indicator in middle */}
                <div className="relative z-10">
                  <div className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold border backdrop-blur-md shadow-lg ${
                    isMorocco 
                      ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50' 
                      : 'bg-rose-950/90 text-rose-300 border-rose-500/50 animate-bounce'
                  }`}>
                    {isMorocco ? (isAr ? '✓ داخل السيادة' : '✓ 100% In-Border') : (isAr ? '⚠ نقل عابر للحدود' : '⚠ Cross-Border Transfer')}
                  </div>
                </div>

                {/* Server Node */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-2">
                  <div className="relative">
                    <div className={`h-16 w-16 rounded-2xl border-2 flex items-center justify-center text-2xl shadow-xl ${
                      isMorocco 
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400 shadow-emerald-950/50' 
                        : 'bg-rose-950/80 border-rose-500 text-rose-400 shadow-rose-950/50'
                    }`}>
                      <Server className="h-7 w-7" />
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-xs text-white block">{hostLocation}</span>
                    <span className={`text-[10px] font-mono ${isMorocco ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isMorocco ? 'National Cloud' : 'External Foreign Cloud'}
                    </span>
                  </div>
                </div>

              </div>

              {/* Status explanation */}
              <div className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                isMorocco 
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200' 
                  : 'bg-rose-950/30 border-rose-500/30 text-rose-200'
              }`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  {isMorocco ? <ShieldCheck className="h-4 w-4 text-emerald-400" /> : <ShieldAlert className="h-4 w-4 text-rose-400" />}
                  <span>
                    {isMorocco 
                      ? (isAr ? 'مطابق للسيادة الوطنية 100% (توطين سيادي)' : 'Full Sovereign Compliance: 100% Hosted in Morocco') 
                      : (isAr ? 'تنبيه قانوني: بيانات المواطنين تعبر الحدود الوطنية' : 'Statutory Alert: Personal Data Exported Outside Morocco')}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  {isMorocco 
                    ? (isAr 
                        ? 'جميع معطيات المستخدمين والمواطنين المغاربة تُعالج وتُخزن داخل التراب الوطني للمملكة المغربية. لا يلزم الحصول على ترخيص نقل خارجي بموجب المادة 43 من القانون 08-09.' 
                        : 'All data packets and databases reside strictly within the national territory of Morocco, satisfying Articles 23, 43 and 44 without requiring cross-border authorization.')
                    : (isAr 
                        ? `الخوادم تقع في (${hostLocation}) خارج السيادة المغربية. تفرض المادة 43 من القانون 08-09 الحصول على ترخيص مسبق ومكتوب من اللجنة الوطنية CNDP قبل الشروع في أي نقل للمعطيات نحو هذا البلد.` 
                        : `Target servers reside in (${hostLocation}). Under Article 43 of Moroccan Law 08-09, transferring personal data abroad is prohibited without prior written authorization from CNDP.`)}
                </p>
              </div>

            </div>
          </div>

          {/* Statutory References Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px]">المادة 43</span>
                <span>{isAr ? 'مبدأ حظر النقل دون ترخيص' : 'Prohibition of Foreign Transfer'}</span>
              </h4>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                {isAr 
                  ? 'لا يمكن للمسؤول عن المعالجة نقل معطيات ذات طابع شخصي نحو دولة أجنبية إلا إذا كانت توفر مستوى كاف من الحماية وتمنح ترخيصاً مسبقاً من اللجنة الوطنية CNDP.'
                  : 'Data controllers cannot transfer personal data to a foreign country unless it provides adequate protection and express authorization is granted by CNDP.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px]">المادة 60</span>
                <span>{isAr ? 'العقوبات الجنائية والغرامات' : 'Criminal & Financial Sanctions'}</span>
              </h4>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                {isAr 
                  ? 'يُعاقب بالحبس من 3 أشهر إلى سنة وبغرامة من 20.000 إلى 200.000 درهم كل من قام بنقل معطيات نحو دولة أجنبية خرقاً لأحكام المادتين 43 و44.'
                  : 'Fines up to 200,000 MAD and prison terms up to 1 year for any cross-border transfer performed in violation of Articles 43 & 44.'}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
