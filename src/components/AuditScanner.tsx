import React, { useState, useEffect } from 'react';
import { Search, Globe, ShieldAlert, Sparkles, RefreshCw, CheckCircle2, ShieldCheck, Server, AlertCircle } from 'lucide-react';

interface AuditScannerProps {
  onScan: (target: string) => void;
  isScanning: boolean;
  lang: 'ar' | 'en';
  defaultTarget?: string;
}

export const AuditScanner: React.FC<AuditScannerProps> = ({
  onScan,
  isScanning,
  lang,
  defaultTarget = ''
}) => {
  const isAr = lang === 'ar';
  const [target, setTarget] = useState(defaultTarget);
  const [scanStepIndex, setScanStepIndex] = useState(0);

  useEffect(() => {
    if (defaultTarget) {
      setTarget(defaultTarget);
    }
  }, [defaultTarget]);

  const scanSteps = [
    { textAr: 'فحص التشفير ونفق الاتصال الآمن (TLS 1.3 / HSTS)...', textEn: 'Analyzing cryptographic transport security & TLS 1.3...' },
    { textAr: 'التحقق من رقم وصل إشعار أو ترخيص اللجنة الوطنية CNDP...', textEn: 'Querying CNDP prior declaration receipt references...' },
    { textAr: 'فحص ملفات تعريف الارتباط وسكريبتات التتبع قبل الموافقة...', textEn: 'Inspecting trackers & pre-consent cookie scripts...' },
    { textAr: 'تدقيق السيادة وموقع الاستضافة السحابية وفق المادة 43...', textEn: 'Auditing cross-border hosting & digital sovereignty...' },
    { textAr: 'توليد خارطة المعالجة لـ 30 يوماً وتقييم العقوبات المحتملة...', textEn: 'Synthesizing 30-day remediation roadmap & score...' },
  ];

  useEffect(() => {
    if (isScanning) {
      setScanStepIndex(0);
      const interval = setInterval(() => {
        setScanStepIndex((prev) => (prev < scanSteps.length - 1 ? prev + 1 : prev));
      }, 550);
      return () => clearInterval(interval);
    }
  }, [isScanning]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!target.trim()) return;
    onScan(target.trim());
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative rounded-2xl border border-emerald-500/30 bg-slate-900/90 p-4 sm:p-6 shadow-2xl shadow-emerald-950/20 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 right-3.5 sm:right-4 flex items-center pointer-events-none text-slate-500">
                <Globe className="h-5 w-5 text-emerald-500/70" />
              </div>
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder={
                  isAr
                    ? 'أدخل رابط الموقع (مثال: banque.ma أو domain.com) أو اسم المؤسسة...'
                    : 'Enter website URL (e.g. banque.ma) or company name...'
                }
                disabled={isScanning}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-950 py-3.5 pr-11 pl-4 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition font-mono disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isScanning || !target.trim()}
              className="relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-emerald-300 disabled:opacity-50 transition cursor-pointer shrink-0"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                  <span>{isAr ? 'جاري الفحص...' : 'Auditing...'}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>{isAr ? 'فحص الامتثال' : 'Audit Now'}</span>
                </>
              )}
            </button>
          </div>

          {/* Quick legal checklist tags */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{isAr ? 'الظهير الشريف 1.09.15' : 'Dahir n° 1-09-15'}</span>
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Server className="h-3.5 w-3.5 text-slate-500" />
              <span>{isAr ? 'المادتان 23 و 43 (السرية والسيادة)' : 'Art. 23 & 43'}</span>
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldAlert className="h-3.5 w-3.5 text-slate-500" />
              <span>{isAr ? 'مداولات CNDP لملفات التتبع' : 'CNDP Trackers Rule'}</span>
            </span>
          </div>
        </form>

        {/* Live scanning progress simulation */}
        {isScanning && (
          <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 flex items-center gap-1.5 animate-pulse">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>{isAr ? scanSteps[scanStepIndex].textAr : scanSteps[scanStepIndex].textEn}</span>
              </span>
              <span className="text-slate-400">{Math.round(((scanStepIndex + 1) / scanSteps.length) * 100)}%</span>
            </div>

            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                style={{ width: `${((scanStepIndex + 1) / scanSteps.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
