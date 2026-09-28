import React, { useState, useEffect } from 'react';
import { Search, Globe, ShieldAlert, Sparkles, RefreshCw, CheckCircle2, ShieldCheck, Server, AlertCircle, ListPlus, Layers, Download, ArrowRight, ExternalLink, Filter } from 'lucide-react';
import { AuditReport, BulkAuditSummary } from '../types';
import { runComplianceScan } from '../services/complianceScanner';
import { ComplianceScoreTooltip } from './ComplianceScoreTooltip';

interface AuditScannerProps {
  onScan: (target: string) => void;
  isScanning: boolean;
  lang: 'ar' | 'en';
  defaultTarget?: string;
  onSelectReportFromBulk?: (report: AuditReport) => void;
  onBulkReportsGenerated?: (reports: AuditReport[]) => void;
}

export const AuditScanner: React.FC<AuditScannerProps> = ({
  onScan,
  isScanning,
  lang,
  defaultTarget = '',
  onSelectReportFromBulk,
  onBulkReportsGenerated
}) => {
  const isAr = lang === 'ar';
  const [scanMode, setScanMode] = useState<'single' | 'bulk'>('single');
  const [target, setTarget] = useState(defaultTarget);
  const [scanStepIndex, setScanStepIndex] = useState(0);

  // Bulk scan state - No hardcoded preset sites; user enters their own target domains
  const [bulkInput, setBulkInput] = useState<string>('');
  const [isBulkRunning, setIsBulkRunning] = useState<boolean>(false);
  const [bulkCurrentIndex, setBulkCurrentIndex] = useState<number>(0);
  const [bulkTotalCount, setBulkTotalCount] = useState<number>(0);
  const [bulkCurrentDomain, setBulkCurrentDomain] = useState<string>('');
  const [bulkSummary, setBulkSummary] = useState<BulkAuditSummary | null>(null);

  useEffect(() => {
    if (defaultTarget !== undefined) {
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

  const handleSingleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!target.trim()) return;
    onScan(target.trim());
  };

  // Run sequential bulk audit
  const handleStartBulkAudit = async () => {
    const rawLines = bulkInput
      .split(/[\n,]+/)
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    const domains = Array.from(new Set(rawLines));
    if (domains.length === 0) return;

    setIsBulkRunning(true);
    setBulkTotalCount(domains.length);
    setBulkCurrentIndex(0);
    setBulkSummary(null);

    const completedReports: AuditReport[] = [];

    for (let i = 0; i < domains.length; i++) {
      const current = domains[i];
      setBulkCurrentIndex(i + 1);
      setBulkCurrentDomain(current);

      try {
        const report = await runComplianceScan(current);
        completedReports.push(report);
      } catch (err) {
        console.error(`Bulk audit failed for ${current}:`, err);
      }
    }

    setIsBulkRunning(false);

    // Calculate consolidated summary
    const total = completedReports.length;
    const avgScore = total > 0 ? Math.round(completedReports.reduce((acc, r) => acc + r.score, 0) / total) : 0;
    const compliant = completedReports.filter((r) => r.score >= 85).length;
    const warning = completedReports.filter((r) => r.score >= 60 && r.score < 85).length;
    const critical = completedReports.filter((r) => r.score < 60).length;

    const summary: BulkAuditSummary = {
      id: `bulk-${Date.now()}`,
      timestamp: new Date().toISOString(),
      totalDomains: total,
      averageScore: avgScore,
      compliantCount: compliant,
      warningCount: warning,
      criticalCount: critical,
      reports: completedReports
    };

    setBulkSummary(summary);

    if (onBulkReportsGenerated) {
      onBulkReportsGenerated(completedReports);
    }
  };

  const handleDownloadBulkCsv = () => {
    if (!bulkSummary || bulkSummary.reports.length === 0) return;

    const headers = [
      'Domain / Target',
      'Organization',
      'Compliance Score',
      'Status (Morocco Law 08/09)',
      'TLS Grade',
      'CNDP Receipt Found',
      'Sovereign Hosting',
      'Gaps Count',
      'Warnings Count'
    ];

    const rows = bulkSummary.reports.map((r) => [
      r.domain,
      r.businessName,
      `${r.score}%`,
      r.statusAr || r.status,
      r.metrics.tlsGrade,
      r.metrics.cndpDeclarationFound ? 'Yes' : 'No',
      r.sovereigntyStatus.isMoroccanHosting ? 'Morocco Sovereign' : 'International Cloud',
      r.gaps.length,
      r.warnings.length
    ]);

    const csvContent =
      '\uFEFF' +
      [headers, ...rows]
        .map((row) =>
          row
            .map((val) => {
              const str = String(val ?? '');
              return `"${str.replace(/"/g, '""')}"`;
            })
            .join(',')
        )
        .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `soverify-bulk-audit-summary-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Scanner Mode Toggle */}
      <div className="flex items-center justify-center">
        <div className="inline-flex rounded-xl border border-slate-800 bg-slate-950 p-1 font-mono text-xs">
          <button
            onClick={() => setScanMode('single')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition cursor-pointer ${
              scanMode === 'single'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="h-3.5 w-3.5" />
            <span>{isAr ? 'فحص نطاق فردي' : 'Single Target Scan'}</span>
          </button>
          <button
            onClick={() => setScanMode('bulk')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition cursor-pointer ${
              scanMode === 'bulk'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListPlus className="h-3.5 w-3.5" />
            <span>{isAr ? 'فحص جماعي مجمّع (Bulk Audit)' : 'Bulk Multi-Domain Audit'}</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Single Scan */}
      {scanMode === 'single' ? (
        <div className="relative rounded-2xl border border-emerald-500/40 bg-slate-900/95 p-5 sm:p-7 shadow-2xl shadow-emerald-950/30 backdrop-blur-xl">
          <form onSubmit={handleSingleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className={`absolute inset-y-0 ${isAr ? 'right-4' : 'left-4'} flex items-center pointer-events-none text-slate-500`}>
                  <Globe className="h-5 w-5 text-emerald-400" />
                </div>
                <input
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder={
                    isAr
                      ? 'أدخل رابط موقعك أو المنصة الإلكترونية المراد فحصها (مثال: https://your-domain.ma أو your-site.ma)...'
                      : 'Enter website URL or domain to audit (e.g. https://your-domain.ma or your-site.ma)...'
                  }
                  disabled={isScanning}
                  autoFocus
                  className={`w-full rounded-xl border border-slate-700/80 bg-slate-950/90 py-4 ${isAr ? 'pr-12 pl-4' : 'pl-12 pr-4'} text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition font-mono disabled:opacity-50 shadow-inner`}
                />
                {target && !isScanning && (
                  <button
                    type="button"
                    onClick={() => setTarget('')}
                    className={`absolute inset-y-0 ${isAr ? 'left-3' : 'right-3'} flex items-center text-xs text-slate-500 hover:text-slate-300 font-mono`}
                  >
                    {isAr ? 'مسح' : 'Clear'}
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isScanning || !target.trim()}
                className="relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 px-8 py-4 text-sm font-black text-slate-950 shadow-xl shadow-emerald-500/30 hover:from-emerald-400 hover:to-teal-300 disabled:opacity-50 transition cursor-pointer shrink-0"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                    <span>{isAr ? 'جاري الفحص الميداني...' : 'Inspecting Target...'}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-5 w-5" />
                    <span>{isAr ? 'بدء التدقيق السيادي الفوري' : 'Run Sovereign Audit'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick legal checklist tags */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[11px] text-slate-400 font-mono border-t border-slate-800/60">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{isAr ? 'مطابقة الظهير الشريف 1.09.15' : 'Dahir 1-09-15 Certified'}</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Server className="h-3.5 w-3.5 text-emerald-500" />
                <span>{isAr ? 'المادتان 43 و 63: السيادة والتوطين' : 'Art. 43 & 63: Data Residency'}</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                <span>{isAr ? 'المادة 53: وصل CNDP وتصريح D-1' : 'Art. 53: CNDP Declaration'}</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                <span>{isAr ? 'خوارزمية التشفير SHA-256' : 'SHA-256 Tamper-Proof'}</span>
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
                <span className="text-slate-400 font-bold">{Math.round(((scanStepIndex + 1) / scanSteps.length) * 100)}%</span>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                  style={{ width: `${((scanStepIndex + 1) / scanSteps.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Mode 2: Bulk Multi-Domain Scan */
        <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/90 p-6 shadow-2xl shadow-emerald-950/20 backdrop-blur-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="h-4 w-4 text-emerald-400" />
                <span>{isAr ? 'فحص جماعي مجمّع لعدة نطاقات' : 'Batch Multi-Domain Sovereign Audit'}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isAr
                  ? 'أدخل قائمة النطاقات أو الروابط المراد فحصها (نطاق واحد في كل سطر) لإجراء تدقيق تسلسلي كامل.'
                  : 'Enter target domain URLs (one per line) for automated sequential compliance audit and consolidated report.'}
              </p>
            </div>

            <div className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-lg">
              {isAr ? 'إدخال حر مخصص بالكامل' : 'Custom URLs Input'}
            </div>
          </div>

          <div className="space-y-3">
            <textarea
              rows={4}
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              disabled={isBulkRunning}
              placeholder={isAr ? 'أدخل رابط موقع في كل سطر:\nhttps://domain1.ma\nportal.service.gov.ma\nexample.ma' : 'Enter one URL per line:\nhttps://domain1.ma\nportal.service.gov.ma\nexample.ma'}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3.5 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none disabled:opacity-50"
            />

            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">
                {bulkInput.split(/[\n,]+/).filter((d) => d.trim().length > 0).length}{' '}
                {isAr ? 'نطاقات محددة' : 'domains queued'}
              </span>

              <button
                type="button"
                onClick={handleStartBulkAudit}
                disabled={isBulkRunning || !bulkInput.trim()}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-emerald-300 disabled:opacity-50 transition cursor-pointer"
              >
                {isBulkRunning ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>
                      {isAr
                        ? `جاري فحص (${bulkCurrentIndex} من ${bulkTotalCount}): ${bulkCurrentDomain}...`
                        : `Auditing (${bulkCurrentIndex}/${bulkTotalCount}): ${bulkCurrentDomain}...`}
                    </span>
                  </>
                ) : (
                  <>
                    <ListPlus className="h-4 w-4" />
                    <span>{isAr ? 'بدء الفحص الجماعي' : 'Run Bulk Audit'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Bulk Scanning Live Progress */}
          {isBulkRunning && (
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
                <span>
                  {isAr
                    ? `جاري فحص النطاق ${bulkCurrentIndex} من ${bulkTotalCount}: ${bulkCurrentDomain}`
                    : `Processing domain ${bulkCurrentIndex} of ${bulkTotalCount}: ${bulkCurrentDomain}`}
                </span>
                <span>{Math.round((bulkCurrentIndex / bulkTotalCount) * 100)}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${(bulkCurrentIndex / bulkTotalCount) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Consolidated Bulk Summary Report Display */}
      {bulkSummary && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/95 p-6 space-y-6 shadow-2xl">
          {/* Header & Export */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-1">
                <Layers className="h-3.5 w-3.5" />
                <span>{isAr ? 'تقرير التدقيق الجماعي الموحد' : 'Consolidated Bulk Audit Summary'}</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {isAr
                  ? `ملخص امتثال ${bulkSummary.totalDomains} نطاقاً لمقتضيات القانون 08.09`
                  : `Batch Audit Summary: ${bulkSummary.totalDomains} Domains`}
              </h3>
            </div>

            <button
              onClick={handleDownloadBulkCsv}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-500/40 bg-emerald-950/40 px-3.5 py-2 text-xs font-mono text-emerald-300 hover:bg-emerald-900/60 transition cursor-pointer shadow-sm"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isAr ? 'تصدير الملخص الشامل (CSV)' : 'Download Batch CSV'}</span>
            </button>
          </div>

          {/* Consolidated KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center font-mono">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <span className="text-[11px] text-slate-400 block mb-1">{isAr ? 'إجمالي النطاقات' : 'Audited'}</span>
              <span className="text-2xl font-bold text-white">{bulkSummary.totalDomains}</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mb-1">
                <span>{isAr ? 'متوسط الامتثال' : 'Mean Score'}</span>
                <ComplianceScoreTooltip score={bulkSummary.averageScore} lang={lang} size="sm" />
              </div>
              <span
                className={`text-2xl font-bold ${
                  bulkSummary.averageScore >= 85
                    ? 'text-emerald-400'
                    : bulkSummary.averageScore >= 60
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {bulkSummary.averageScore}%
              </span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <span className="text-[11px] text-emerald-400 block mb-1">{isAr ? 'ممتثل تام (≥85%)' : 'Compliant'}</span>
              <span className="text-2xl font-bold text-emerald-400">{bulkSummary.compliantCount}</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <span className="text-[11px] text-amber-400 block mb-1">{isAr ? 'ملاحظات (60-84%)' : 'Advisory'}</span>
              <span className="text-2xl font-bold text-amber-400">{bulkSummary.warningCount}</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
              <span className="text-[11px] text-rose-400 block mb-1">{isAr ? 'مخالفات (<60%)' : 'Critical'}</span>
              <span className="text-2xl font-bold text-rose-400">{bulkSummary.criticalCount}</span>
            </div>
          </div>

          {/* Comparative Table */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">{isAr ? 'النطاق / المؤسسة' : 'Target Domain'}</th>
                    <th className="p-3.5">{isAr ? 'مؤشر الامتثال' : 'Score'}</th>
                    <th className="p-3.5">{isAr ? 'حالة القانون 08.09' : 'Law 08/09 Status'}</th>
                    <th className="p-3.5">{isAr ? 'المخالفات / التنبيهات' : 'Gaps / Warns'}</th>
                    <th className="p-3.5">{isAr ? 'السيادة الوطنية (Art. 43)' : 'Sovereignty'}</th>
                    <th className="p-3.5 text-center">{isAr ? 'إجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-sans">
                  {bulkSummary.reports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-900/40 transition">
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-white flex items-center gap-1.5">
                          <Globe className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                          <span>{report.domain}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-sans">{report.businessName}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded font-mono font-bold text-xs border ${
                              report.score >= 85
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : report.score >= 60
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            }`}
                          >
                            {report.score}%
                          </span>
                          <ComplianceScoreTooltip score={report.score} lang={lang} size="sm" />
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-300 text-xs">
                        {isAr ? report.statusAr : report.status}
                      </td>
                      <td className="p-3.5 font-mono text-xs">
                        <span className="text-rose-400 font-bold">{report.gaps.length}</span>
                        <span className="text-slate-500 mx-1">/</span>
                        <span className="text-amber-400">{report.warnings.length}</span>
                      </td>
                      <td className="p-3.5">
                        {report.sovereigntyStatus.isMoroccanHosting ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-[11px]">
                            <ShieldCheck className="h-3 w-3" />
                            <span>{isAr ? 'استضافة وطنية' : 'Morocco Host'}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono text-[11px]">
                            <AlertCircle className="h-3 w-3" />
                            <span>{isAr ? 'ترخيص Art. 43 مطلوب' : 'Art. 43 Required'}</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            if (onSelectReportFromBulk) {
                              onSelectReportFromBulk(report);
                            } else {
                              onScan(report.target);
                            }
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-slate-700 bg-slate-800 text-emerald-400 hover:bg-slate-700 hover:border-emerald-500 font-mono text-xs transition cursor-pointer"
                        >
                          <span>{isAr ? 'عرض التقرير' : 'View Report'}</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
