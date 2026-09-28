import React, { useState } from 'react';
import { 
  Mail, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  ShieldAlert, 
  Clock, 
  X, 
  ExternalLink,
  Building2,
  Copy,
  Check
} from 'lucide-react';
import { EmailDispatchResult } from '../services/dpoNotificationService';

interface DpoEmailAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  dispatchResult: EmailDispatchResult | null;
  lang: 'ar' | 'en';
}

export const DpoEmailAlertModal: React.FC<DpoEmailAlertModalProps> = ({
  isOpen,
  onClose,
  dispatchResult,
  lang
}) => {
  const [copied, setCopied] = useState(false);
  const isAr = lang === 'ar';

  if (!isOpen || !dispatchResult) return null;

  const { alert, recipient, messageId, timestamp, htmlContent } = dispatchResult;

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-red-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-red-500/20 bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <Mail className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-bold text-red-400 border border-red-500/30">
                  <ShieldAlert className="h-3 w-3" />
                  {isAr ? 'تم إرسال إشعار فوري (SMTP Simulated)' : 'Simulated Email Dispatched'}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {messageId}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                {isAr ? 'خدمة إنذار مسؤول حماية المعطيات (DPO Security Alert)' : 'DPO Security Alert Notification Service'}
              </h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Status Banner */}
          <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-emerald-300">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-emerald-200">
                {isAr ? 'تم توجيه البريد الإلكتروني بنجاح إلى مسؤول حماية المعطيات' : 'Email dispatched successfully to registered DPO'}
              </p>
              <p className="text-xs text-emerald-400/90 leading-relaxed">
                {isAr 
                  ? `تم رصد ثغرة أمنية عالية الخطورة (${alert.severity}) في نطاق ${alert.targetDomain}. أُرسل تنبيه مشفر إلى البريد الرسمي للمسؤول للتحرك خلال المهلة القانونية.`
                  : `High-risk vulnerability (${alert.severity}) detected in ${alert.targetDomain}. Official email dispatched to DPO for immediate corrective action.`
                }
              </p>
            </div>
          </div>

          {/* Email Envelope Header Meta */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-2 font-mono text-xs text-slate-300">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
              <span className="text-slate-500">{isAr ? 'المُرسل:' : 'From:'}</span>
              <span className="text-slate-200">security-alerts@cndp-soverify.ma &lt;Soverify Automated Security Dispatch&gt;</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
              <span className="text-slate-500">{isAr ? 'إلى المستلم (DPO):' : 'To (DPO):'}</span>
              <span className="text-teal-400 font-bold">{alert.dpoName} &lt;{recipient}&gt;</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
              <span className="text-slate-500">{isAr ? 'المؤسسة المعنية:' : 'Organization:'}</span>
              <span className="text-slate-200">{alert.companyName} ({alert.targetDomain})</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
              <span className="text-slate-500">{isAr ? 'الموضوع:' : 'Subject:'}</span>
              <span className="text-red-300 font-bold">{alert.emailSubject}</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-slate-500">{isAr ? 'وقت الإرسال:' : 'Sent Timestamp:'}</span>
              <span className="text-slate-400">{timestamp}</span>
            </div>
          </div>

          {/* Simulated Email Body Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {isAr ? 'معاينة نص الرسالة الصادرة للـ DPO:' : 'Email Body Preview:'}
              </span>
              <button
                onClick={handleCopyHtml}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? (isAr ? 'تم النسخ' : 'Copied') : (isAr ? 'نسخ كود HTML' : 'Copy HTML')}</span>
              </button>
            </div>

            <div className="rounded-xl border border-red-500/30 bg-slate-950 p-4 space-y-3">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>{alert.gapTitleAr || alert.gapTitle}</span>
              </div>
              <div className="text-xs text-slate-300 space-y-1 leading-relaxed">
                <p><span className="text-slate-500">{isAr ? 'المادة القانونية:' : 'Article:'}</span> <strong className="text-slate-200">{alert.article}</strong></p>
                {alert.penaltyEstimate && (
                  <p><span className="text-slate-500">{isAr ? 'العقوبة المحتملة:' : 'Penalty Estimate:'}</span> <span className="text-red-400 font-bold">{alert.penaltyEstimate}</span></p>
                )}
                <p><span className="text-slate-500">{isAr ? 'التوصية الفورية:' : 'Immediate Recommendation:'}</span> {alert.recommendationAr || alert.recommendation}</p>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>{isAr ? 'بروتوكول الإرسال: SMTP RFC 5322 (Simulated)' : 'Protocol: SMTP RFC 5322 (Simulated)'}</span>
                <span className="text-emerald-400 font-semibold">{isAr ? 'الحالة: تم التسليم' : 'Status: Delivered'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
