import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  ShieldCheck, 
  Bell, 
  Mail, 
  Calendar, 
  Play, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Sliders, 
  Sparkles,
  Zap,
  Globe2
} from 'lucide-react';
import { AuditReport, ContinuousAuditSchedule, UserAccount } from '../types';

interface ContinuousAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: AuditReport;
  user: UserAccount | null;
  lang: 'ar' | 'en';
  onTriggerScan?: (domain: string) => void;
}

export const ContinuousAuditModal: React.FC<ContinuousAuditModalProps> = ({
  isOpen,
  onClose,
  report,
  user,
  lang: initialLang,
  onTriggerScan
}) => {
  const [lang, setLang] = useState<'ar' | 'en'>(initialLang);
  const isAr = lang === 'ar';

  const storageKey = `soverify_cadence_${report.domain}`;
  
  const [frequency, setFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [alertEmail, setAlertEmail] = useState(user?.email || 'dpo@' + report.domain);
  const [thresholdScore, setThresholdScore] = useState(75);
  const [alertOnNewCookies, setAlertOnNewCookies] = useState(true);
  const [alertOnCrossBorder, setAlertOnCrossBorder] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [activeSchedules, setActiveSchedules] = useState<ContinuousAuditSchedule[]>([]);

  // Load existing schedule if present
  useEffect(() => {
    try {
      const stored = localStorage.getItem('soverify_continuous_audits');
      if (stored) {
        setActiveSchedules(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, [report.domain]);

  if (!isOpen) return null;

  const handleSaveSchedule = () => {
    const nextDate = new Date();
    if (frequency === 'weekly') nextDate.setDate(nextDate.getDate() + 7);
    else if (frequency === 'biweekly') nextDate.setDate(nextDate.getDate() + 14);
    else nextDate.setMonth(nextDate.getMonth() + 1);

    const newSched: ContinuousAuditSchedule = {
      id: `cadence-${Date.now()}`,
      domain: report.domain,
      frequency,
      alertEmail,
      scoreThresholdAlert: thresholdScore,
      alertOnNewCookies,
      alertOnCrossBorderHosting: alertOnCrossBorder,
      active: true,
      lastRunDate: new Date().toISOString().slice(0, 10),
      nextRunDate: nextDate.toISOString().slice(0, 10),
      historyRunsCount: 1
    };

    const updated = [newSched, ...activeSchedules.filter(s => s.domain !== report.domain)];
    setActiveSchedules(updated);
    try {
      localStorage.setItem('soverify_continuous_audits', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleDeleteSchedule = (id: string) => {
    const updated = activeSchedules.filter(s => s.id !== id);
    setActiveSchedules(updated);
    try {
      localStorage.setItem('soverify_continuous_audits', JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4 sm:p-5 bg-slate-950/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-mono">
                  {isAr ? 'نظام المراقبة الدورية المستمرة (Continuous Audit Sentinel)' : 'Continuous Compliance Sentinel'}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-teal-950 text-teal-300 border border-teal-800">
                  Automated RegTech
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isAr 
                  ? `جدولة فحص تلقائي ورصد أي انحراف عن مقتضيات القانون 08-09 لنطاق: ${report.domain}` 
                  : `Automated periodic auditing & drift detection for: ${report.domain}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="px-2.5 py-1 text-xs rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white font-mono"
            >
              {lang === 'ar' ? 'English' : 'العربية'}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Scheduling Configuration */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/70 space-y-4">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
              <Sliders className="h-4 w-4 text-teal-400" />
              {isAr ? 'إعدادات دورية الفحص والتنبيهات:' : 'Audit Frequency & Alert Configuration:'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1.5">
                  {isAr ? 'وتيرة الفحص الآلي:' : 'Scan Frequency:'}
                </label>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => setFrequency('weekly')}
                    className={`py-2 px-1 text-center font-bold rounded-lg border transition ${frequency === 'weekly' ? 'border-teal-500 bg-teal-950 text-teal-300' : 'border-slate-800 bg-slate-900 text-slate-400'}`}
                  >
                    {isAr ? 'أسبوعياً' : 'Weekly'}
                  </button>
                  <button
                    onClick={() => setFrequency('biweekly')}
                    className={`py-2 px-1 text-center font-bold rounded-lg border transition ${frequency === 'biweekly' ? 'border-teal-500 bg-teal-950 text-teal-300' : 'border-slate-800 bg-slate-900 text-slate-400'}`}
                  >
                    {isAr ? 'كل 14 يوماً' : '14 Days'}
                  </button>
                  <button
                    onClick={() => setFrequency('monthly')}
                    className={`py-2 px-1 text-center font-bold rounded-lg border transition ${frequency === 'monthly' ? 'border-teal-500 bg-teal-950 text-teal-300' : 'border-slate-800 bg-slate-900 text-slate-400'}`}
                  >
                    {isAr ? 'شهرياً' : 'Monthly'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1.5">
                  {isAr ? 'البريد الإلكتروني للإنذار العاجل:' : 'DPO Alert Email:'}
                </label>
                <div className="relative">
                  <Mail className={`absolute top-2.5 ${isAr ? 'right-3' : 'left-3'} h-4 w-4 text-slate-400`} />
                  <input
                    type="email"
                    value={alertEmail}
                    onChange={(e) => setAlertEmail(e.target.value)}
                    placeholder="dpo@company.ma"
                    className={`w-full rounded-lg border border-slate-700 bg-slate-900 py-2 ${isAr ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'} text-white focus:border-teal-500 text-xs`}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 font-bold mb-1.5">
                  <span>{isAr ? 'عتبة التنبيه في حالة هبوط النقاط:' : 'Alert if score drops below:'}</span>
                  <span className="font-mono text-teal-400 font-bold">{thresholdScore} / 100</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={thresholdScore}
                  onChange={(e) => setThresholdScore(parseInt(e.target.value))}
                  className="w-full accent-teal-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Drift triggers switches */}
            <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-800 bg-slate-900 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={alertOnNewCookies}
                  onChange={(e) => setAlertOnNewCookies(e.target.checked)}
                  className="rounded border-slate-700 text-teal-500"
                />
                <span className="text-slate-300">
                  {isAr ? 'إرسال إنذار فوري عند رصد كوكيز إعلانية/تتبعية جديدة' : 'Alert immediately on new untracked cookies'}
                </span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-800 bg-slate-900 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={alertOnCrossBorder}
                  onChange={(e) => setAlertOnCrossBorder(e.target.checked)}
                  className="rounded border-slate-700 text-teal-500"
                />
                <span className="text-slate-300">
                  {isAr ? 'إنذار عند نقل الاستضافة لخوادم خارج المغرب (المادة 63)' : 'Alert if DNS/Hosting leaves Moroccan borders'}
                </span>
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveSchedule}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg transition"
              >
                {isSaved ? <CheckCircle2 className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                <span>{isSaved ? (isAr ? 'تم تفعيل المراقبة بنجاح!' : 'Monitoring Activated!') : (isAr ? 'تفعيل جدول المراقبة المستمرة' : 'Activate Periodic Sentinel')}</span>
              </button>
            </div>
          </div>

          {/* Active Sentinel Schedules List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
              <Calendar className="h-4 w-4 text-teal-400" />
              {isAr ? 'جداول المراقبة النشطة حالياً:' : 'Active Sentinel Audits:'}
            </h4>

            {activeSchedules.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500 font-mono">
                {isAr ? 'لا توجد جداول مراقبة نشطة بعد. قم بتفعيل المراقبة أعلاه.' : 'No active schedules yet. Set up monitoring above.'}
              </div>
            ) : (
              <div className="space-y-2">
                {activeSchedules.map((s) => (
                  <div
                    key={s.id}
                    className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{s.domain}</span>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-teal-950 border border-teal-800 text-teal-300">
                          {s.frequency.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {isAr ? `تنبيه: ${s.alertEmail}` : `Alert: ${s.alertEmail}`}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {isAr ? `الفحص القادم: ${s.nextRunDate} · عتبة الهبوط: ${s.scoreThresholdAlert}/100` : `Next run: ${s.nextRunDate} · Threshold: ${s.scoreThresholdAlert}/100`}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {onTriggerScan && (
                        <button
                          onClick={() => {
                            onClose();
                            onTriggerScan(s.domain);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:text-white text-xs font-mono"
                          title={isAr ? 'تشغيل فحص فوري الآن' : 'Trigger audit now'}
                        >
                          <Play className="h-3 w-3 text-teal-400" />
                          <span>{isAr ? 'فحص الآن' : 'Run'}</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteSchedule(s.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
