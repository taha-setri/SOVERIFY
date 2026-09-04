import React, { useState, useEffect } from 'react';
import { 
  FileClock, 
  Search, 
  Download, 
  Filter, 
  Trash2, 
  PlusCircle, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Info, 
  Globe, 
  FileText, 
  Mail, 
  Bot, 
  Scale, 
  BookOpen, 
  User, 
  ArrowUpDown, 
  Calendar, 
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal
} from 'lucide-react';
import { AuditTrailEvent, AuditTrailCategory, AuditTrailStatus, UserAccount } from '../types';
import { 
  subscribeToAuditTrail, 
  recordAuditEvent, 
  clearAuditTrail, 
  exportAuditTrailAsCsv, 
  exportAuditTrailAsJson 
} from '../services/auditTrailService';

interface AuditTrailTabProps {
  lang: 'ar' | 'en';
  currentUser?: UserAccount | null;
  onNavigateToArticle?: (articleId?: string) => void;
  onConsultDpo?: (topic?: string) => void;
}

export const AuditTrailTab: React.FC<AuditTrailTabProps> = ({
  lang,
  currentUser,
  onNavigateToArticle,
  onConsultDpo
}) => {
  const isAr = lang === 'ar';

  const [events, setEvents] = useState<AuditTrailEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  // Manual Log Entry Modal State
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);
  const [manualTitle, setManualTitle] = useState<string>('');
  const [manualCategory, setManualCategory] = useState<AuditTrailCategory>('REMEDIATION');
  const [manualTarget, setManualTarget] = useState<string>('');
  const [manualArticle, setManualArticle] = useState<string>('المادة 23');
  const [manualNotes, setManualNotes] = useState<string>('');
  const [manualStatus, setManualStatus] = useState<AuditTrailStatus>('SUCCESS');

  // Clear confirmation dialog
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = subscribeToAuditTrail((updatedEvents) => {
      setEvents(updatedEvents);
    });
    return () => unsubscribe();
  }, []);

  // Format date helper
  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return isoString;
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return isoString;
    }
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return isAr ? 'الآن' : 'Just now';
      if (diffMins === 1) return isAr ? 'منذ دقيقة واحدة' : '1 min ago';
      if (diffMins < 60) return isAr ? `منذ ${diffMins} دقيقة` : `${diffMins} mins ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return isAr ? `منذ ${diffHours} ساعة` : `${diffHours}h ago`;
      return isAr ? `منذ ${Math.floor(diffHours / 24)} يوم` : `${Math.floor(diffHours / 24)}d ago`;
    } catch {
      return '';
    }
  };

  // Helper for law article navigation
  const getArticleId = (artStr?: string): string => {
    if (!artStr) return 'art-1';
    const num = artStr.match(/\d+/);
    return num ? `art-${num[0]}` : 'art-1';
  };

  // Icons and Badges for categories
  const getCategoryInfo = (category: AuditTrailCategory) => {
    switch (category) {
      case 'SCAN':
        return {
          icon: ShieldCheck,
          labelAr: 'فحص امتثال',
          labelEn: 'Audit Scan',
          color: 'text-emerald-400 bg-emerald-950/50 border-emerald-500/30'
        };
      case 'ALERT':
        return {
          icon: Mail,
          labelAr: 'إنذار DPO بريدي',
          labelEn: 'DPO Alert',
          color: 'text-rose-400 bg-rose-950/50 border-rose-500/30'
        };
      case 'EXPORT':
        return {
          icon: Download,
          labelAr: 'تصدير تقرير',
          labelEn: 'Export File',
          color: 'text-blue-400 bg-blue-950/50 border-blue-500/30'
        };
      case 'LEGAL_INQUIRY':
        return {
          icon: Scale,
          labelAr: 'استشارة قانونية',
          labelEn: 'Legal Article',
          color: 'text-purple-400 bg-purple-950/50 border-purple-500/30'
        };
      case 'DPO_CHAT':
        return {
          icon: Bot,
          labelAr: 'المستشار الذكي',
          labelEn: 'Gemini Advisor',
          color: 'text-teal-400 bg-teal-950/50 border-teal-500/30'
        };
      case 'REGULATORY':
        return {
          icon: Globe,
          labelAr: 'مستجدات CNDP',
          labelEn: 'Regulatory CNDP',
          color: 'text-amber-400 bg-amber-950/50 border-amber-500/30'
        };
      case 'REMEDIATION':
        return {
          icon: CheckCircle2,
          labelAr: 'إجراء تصحيحي',
          labelEn: 'Remediation',
          color: 'text-cyan-400 bg-cyan-950/50 border-cyan-500/30'
        };
      default:
        return {
          icon: User,
          labelAr: 'جلسة ومصادقة',
          labelEn: 'Session Auth',
          color: 'text-slate-300 bg-slate-800 border-slate-700'
        };
    }
  };

  const getStatusBadge = (status: AuditTrailStatus) => {
    switch (status) {
      case 'SUCCESS':
        return {
          icon: CheckCircle2,
          textAr: 'ناجح ومطابق',
          textEn: 'Compliant / Success',
          bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
        };
      case 'ALERT':
        return {
          icon: ShieldAlert,
          textAr: 'إنذار حرج',
          textEn: 'Critical Alert',
          bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30'
        };
      case 'WARNING':
        return {
          icon: AlertTriangle,
          textAr: 'تنبيه امتثال',
          textEn: 'Warning',
          bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
        };
      default:
        return {
          icon: Info,
          textAr: 'توثيق إجرائي',
          textEn: 'Logged / Info',
          bg: 'bg-blue-500/15 text-blue-300 border-blue-500/30'
        };
    }
  };

  // Filter and sort events
  const filteredEvents = events
    .filter((e) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        e.actionTitleAr.toLowerCase().includes(q) ||
        e.actionTitleEn.toLowerCase().includes(q) ||
        e.actorName.toLowerCase().includes(q) ||
        e.actorEmail.toLowerCase().includes(q) ||
        (e.targetResource && e.targetResource.toLowerCase().includes(q)) ||
        (e.lawArticleRef && e.lawArticleRef.toLowerCase().includes(q)) ||
        e.detailsSummaryAr.toLowerCase().includes(q) ||
        e.detailsSummaryEn.toLowerCase().includes(q);

      const matchesCat = selectedCategory === 'ALL' || e.category === selectedCategory;
      const matchesStatus = selectedStatus === 'ALL' || e.status === selectedStatus;

      return matchesSearch && matchesCat && matchesStatus;
    })
    .sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });

  // Top Metrics Counts
  const totalCount = events.length;
  const scanCount = events.filter(e => e.category === 'SCAN').length;
  const alertCount = events.filter(e => e.category === 'ALERT' || e.status === 'ALERT').length;
  const exportCount = events.filter(e => e.category === 'EXPORT').length;
  const legalCount = events.filter(e => e.category === 'LEGAL_INQUIRY' || e.category === 'DPO_CHAT').length;

  // Handle Manual Log Submission
  const handleCreateManualLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim()) return;

    recordAuditEvent({
      category: manualCategory,
      actionTitleAr: manualTitle,
      actionTitleEn: manualTitle,
      actorName: currentUser?.name || 'Authorized Compliance Officer',
      actorEmail: currentUser?.email || 'officer@soverify.ma',
      targetResource: manualTarget || 'Manual Compliance Verification',
      lawArticleRef: manualArticle,
      status: manualStatus,
      detailsSummaryAr: manualNotes || 'تم توثيق هذا الإجراء يدوياً من قِبل مسؤول الامتثال لضمان المساءلة.',
      detailsSummaryEn: manualNotes || 'Manually entered compliance action recorded by authorized officer.'
    });

    setIsManualModalOpen(false);
    setManualTitle('');
    setManualTarget('');
    setManualNotes('');
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Banner Card */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/60 px-2.5 py-1 text-xs font-mono font-bold text-emerald-300">
                <FileClock className="h-3.5 w-3.5 text-emerald-400" />
                <span>{isAr ? 'سجل التدقيق والمساءلة الرقمي (Audit Trail)' : 'Session Audit Trail & Accountability Ledger'}</span>
              </span>

              <span className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs font-mono text-slate-300">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>{isAr ? 'سجل جلسة محمي' : 'Session Verified'}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
              {isAr ? 'سجل الأنشطة والتدقيق الزمني (Audit Trail)' : 'Chronological Audit Trail & Compliance Ledger'}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              {isAr
                ? 'توثيق زمني مستمر وتفصيلي لكل عملية فحص، إرسال إنذار، تصدير تقرير، أو استشارة قانونية منجزة خلال الجلسة، لضمان مبدأ المساءلة وتوفير أدلة إثبات قطعية لامتثال المؤسسة أمام لجان CNDP.'
                : 'Comprehensive chronological ledger tracking every scan, security email dispatch, report export, and manual legal verification for end-to-end accountability.'}
            </p>
          </div>

          {/* Action Buttons: Export & Manual Entry */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsManualModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 px-3.5 py-2.5 text-xs font-mono font-bold transition shadow-sm"
            >
              <PlusCircle className="h-3.5 w-3.5 text-emerald-400" />
              <span>{isAr ? 'توثيق إجراء يدوي' : 'Log Manual Action'}</span>
            </button>

            <button
              onClick={() => exportAuditTrailAsCsv(filteredEvents, lang)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/90 hover:bg-slate-700 px-3.5 py-2.5 text-xs font-mono font-bold text-slate-200 transition shadow-sm"
              title={isAr ? 'تنزيل السجل بصيغة CSV' : 'Export as CSV'}
            >
              <Download className="h-3.5 w-3.5 text-slate-400" />
              <span>CSV</span>
            </button>

            <button
              onClick={() => exportAuditTrailAsJson(filteredEvents)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/90 hover:bg-slate-700 px-3.5 py-2.5 text-xs font-mono font-bold text-slate-200 transition shadow-sm"
              title={isAr ? 'تصدير السجل المشفر بصيغة JSON لـ CNDP' : 'Export JSON Ledger'}
            >
              <FileText className="h-3.5 w-3.5 text-slate-400" />
              <span>JSON</span>
            </button>

            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-950/30 hover:bg-rose-950/60 text-rose-300 px-3 py-2.5 text-xs font-mono transition"
              title={isAr ? 'إعادة ضبط سجل الجلسة' : 'Clear Ledger'}
            >
              <Trash2 className="h-3.5 w-3.5 text-rose-400" />
            </button>
          </div>
        </div>

        {/* Clear Confirmation Prompt */}
        {showClearConfirm && (
          <div className="mt-4 rounded-xl border border-rose-500/50 bg-rose-950/80 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs animate-fadeIn">
            <div className="flex items-center gap-2 text-rose-200">
              <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
              <span>
                {isAr 
                  ? 'هل أنت متأكد من رغبتك في مسح سجل العمليات الحالي؟ سيتم الاحتفاظ فقط بسجل بدء الجلسة.' 
                  : 'Are you sure you want to clear the current audit ledger? Only the session initialization entry will remain.'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  clearAuditTrail();
                  setShowClearConfirm(false);
                }}
                className="rounded-lg bg-rose-600 hover:bg-rose-500 px-3 py-1.5 text-xs font-bold text-white shadow"
              >
                {isAr ? 'تأكيد المسح' : 'Confirm Clear'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Top Accountability Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-1">
          <span className="text-[11px] text-slate-400 font-mono block">
            {isAr ? 'إجمالي العمليات الموثقة' : 'Total Logged Actions'}
          </span>
          <div className="text-xl font-extrabold text-white font-mono flex items-center justify-between">
            <span>{totalCount}</span>
            <FileClock className="h-4 w-4 text-emerald-400" />
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-1">
          <span className="text-[11px] text-slate-400 font-mono block">
            {isAr ? 'فحوصات الامتثال' : 'Scans Executed'}
          </span>
          <div className="text-xl font-extrabold text-emerald-400 font-mono flex items-center justify-between">
            <span>{scanCount}</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-1">
          <span className="text-[11px] text-slate-400 font-mono block">
            {isAr ? 'الإنذارات الحرجة' : 'Critical Alerts'}
          </span>
          <div className="text-xl font-extrabold text-rose-400 font-mono flex items-center justify-between">
            <span>{alertCount}</span>
            <ShieldAlert className="h-4 w-4 text-rose-400" />
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-1">
          <span className="text-[11px] text-slate-400 font-mono block">
            {isAr ? 'استشارات ومراجعات المواد' : 'Legal Inquiries'}
          </span>
          <div className="text-xl font-extrabold text-purple-400 font-mono flex items-center justify-between">
            <span>{legalCount}</span>
            <Scale className="h-4 w-4 text-purple-400" />
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[11px] text-slate-400 font-mono block">
            {isAr ? 'التقارير المصدرة' : 'Exported Reports'}
          </span>
          <div className="text-xl font-extrabold text-blue-400 font-mono flex items-center justify-between">
            <span>{exportCount}</span>
            <Download className="h-4 w-4 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Text search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث في الإجراءات، المستخدمين، المواد، أو النطاقات...' : 'Search actions, actors, articles, or resources...'}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-950/90 px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none font-mono"
              >
                <option value="ALL">{isAr ? 'جميع الأصناف' : 'All Categories'}</option>
                <option value="SCAN">{isAr ? 'فحوصات الامتثال (SCAN)' : 'Audit Scans'}</option>
                <option value="ALERT">{isAr ? 'إنذارات الـ DPO (ALERT)' : 'DPO Alerts'}</option>
                <option value="EXPORT">{isAr ? 'تصدير التقارير (EXPORT)' : 'Exports'}</option>
                <option value="LEGAL_INQUIRY">{isAr ? 'مواد القانون (LEGAL)' : 'Legal Inquiries'}</option>
                <option value="DPO_CHAT">{isAr ? 'المستشار الذكي (AI)' : 'Gemini Advisor'}</option>
                <option value="REGULATORY">{isAr ? 'مستجدات CNDP' : 'Regulatory'}</option>
                <option value="REMEDIATION">{isAr ? 'إجراءات تصحيحية' : 'Remediation'}</option>
                <option value="AUTH">{isAr ? 'جلسات ومصادقة' : 'Sessions / Auth'}</option>
              </select>
            </div>

            {/* Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950/90 px-3 py-2 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none font-mono"
            >
              <option value="ALL">{isAr ? 'جميع الحالات' : 'All Statuses'}</option>
              <option value="SUCCESS">{isAr ? 'مطابق / ناجح' : 'Success / Compliant'}</option>
              <option value="ALERT">{isAr ? 'إنذار حرج' : 'Critical Alert'}</option>
              <option value="WARNING">{isAr ? 'تنبيه امتثال' : 'Warning'}</option>
              <option value="INFO">{isAr ? 'توثيق إجرائي' : 'Informational'}</option>
            </select>

            {/* Sort Order Toggle */}
            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-950/90 px-3 py-2 text-xs font-mono text-slate-300 hover:bg-slate-800 transition"
              title={isAr ? 'تبديل الترتيب الزمني' : 'Toggle Sort Order'}
            >
              <ArrowUpDown className="h-3.5 w-3.5 text-emerald-400" />
              <span>{sortOrder === 'desc' ? (isAr ? 'الأحدث أولاً' : 'Newest First') : (isAr ? 'الأقدم أولاً' : 'Oldest First')}</span>
            </button>
          </div>
        </div>

        {/* Counter summary */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60 font-mono">
          <span>
            {isAr
              ? `عرض ${filteredEvents.length} من أصل ${events.length} نشاط مسجل`
              : `Displaying ${filteredEvents.length} of ${events.length} logged activities`}
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>{isAr ? 'سلامة السجل: مؤكدة وغير قابلة للتلاعب' : 'Ledger Integrity: Verified Session Scope'}</span>
          </span>
        </div>
      </div>

      {/* Chronological Timeline Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
        {filteredEvents.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileClock className="h-10 w-10 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">
              {isAr ? 'لا توجد أنشطة مطابقة لشروط البحث' : 'No logged events match your filter'}
            </h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              {isAr 
                ? 'قم بتنفيذ فحص للموقع، أو إرسال إنذار DPO، أو استشارة إحدى مواد القانون ليتم توثيقها تلقائياً هنا.' 
                : 'Perform a compliance scan, dispatch a DPO alert, or inspect a law article to automatically record events.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/70 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-semibold">{isAr ? 'التسلسل والتوقيت' : 'Time & Seq'}</th>
                  <th className="py-3.5 px-4 font-semibold">{isAr ? 'النشاط / الإجراء المنجز' : 'Logged Activity'}</th>
                  <th className="py-3.5 px-4 font-semibold">{isAr ? 'المسؤول والمستخدم' : 'Actor / Officer'}</th>
                  <th className="py-3.5 px-4 font-semibold">{isAr ? 'الهدف / النطاق' : 'Target Resource'}</th>
                  <th className="py-3.5 px-4 font-semibold">{isAr ? 'المادة (القانون 08.09)' : 'Law Article'}</th>
                  <th className="py-3.5 px-4 font-semibold">{isAr ? 'الحالة' : 'Status'}</th>
                  <th className="py-3.5 px-4 font-semibold text-right">{isAr ? 'التفاصيل' : 'Details'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredEvents.map((evt, idx) => {
                  const catInfo = getCategoryInfo(evt.category);
                  const statusInfo = getStatusBadge(evt.status);
                  const Icon = catInfo.icon;
                  const StatusIcon = statusInfo.icon;
                  const isExpanded = expandedEventId === evt.id;

                  return (
                    <React.Fragment key={evt.id}>
                      <tr 
                        onClick={() => setExpandedEventId(isExpanded ? null : evt.id)}
                        className={`transition cursor-pointer ${
                          isExpanded 
                            ? 'bg-slate-800/70' 
                            : idx % 2 === 0 
                              ? 'bg-slate-900/40 hover:bg-slate-800/40' 
                              : 'bg-slate-900/90 hover:bg-slate-800/40'
                        }`}
                      >
                        {/* Time & Sequence Column */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="h-6 w-6 rounded-md bg-slate-800 border border-slate-700 flex items-center justify-center font-mono text-[10px] text-slate-300 font-bold">
                              #{filteredEvents.length - idx}
                            </span>
                            <div>
                              <span className="font-mono text-slate-200 block text-xs font-bold">
                                {formatTime(evt.timestamp)}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 block">
                                {formatRelativeTime(evt.timestamp)}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Activity Column */}
                        <td className="py-3 px-4">
                          <div className="flex items-start gap-2.5 max-w-sm">
                            <div className={`mt-0.5 p-1.5 rounded-lg border shrink-0 ${catInfo.color}`}>
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <div className="font-bold text-white text-xs leading-snug">
                                {isAr ? evt.actionTitleAr : evt.actionTitleEn}
                              </div>
                              <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                                {isAr ? catInfo.labelAr : catInfo.labelEn}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Actor Column */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold text-emerald-300">
                              {evt.actorName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="text-xs font-bold text-slate-200 block truncate max-w-[120px]">
                                {evt.actorName}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 block truncate max-w-[120px]">
                                {evt.actorEmail}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Target Resource Column */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          {evt.targetResource ? (
                            <span className="inline-block max-w-[150px] truncate rounded bg-slate-950/80 border border-slate-800 px-2 py-0.5 font-mono text-[11px] text-emerald-300">
                              {evt.targetResource}
                            </span>
                          ) : (
                            <span className="text-slate-500 font-mono text-[11px]">—</span>
                          )}
                        </td>

                        {/* Law Article Column */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          {evt.lawArticleRef ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigateToArticle?.(getArticleId(evt.lawArticleRef));
                              }}
                              className="inline-flex items-center gap-1 rounded bg-purple-950/40 border border-purple-500/30 px-2 py-0.5 font-mono text-[11px] text-purple-300 hover:bg-purple-900/50 hover:text-white transition"
                              title={isAr ? 'الانتقال لمراجعة نص المادة' : 'Inspect Article'}
                            >
                              <BookOpen className="h-2.5 w-2.5" />
                              <span>{evt.lawArticleRef}</span>
                            </button>
                          ) : (
                            <span className="text-slate-500 font-mono text-[11px]">—</span>
                          )}
                        </td>

                        {/* Status Column */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-mono font-bold ${statusInfo.bg}`}>
                            <StatusIcon className="h-3 w-3 shrink-0" />
                            <span>{isAr ? statusInfo.textAr : statusInfo.textEn}</span>
                          </span>
                        </td>

                        {/* Details / Expand Column */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedEventId(isExpanded ? null : evt.id);
                            }}
                            className="p-1 rounded hover:bg-slate-700/60 text-slate-400 hover:text-slate-200 transition"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Details Row */}
                      {isExpanded && (
                        <tr className="bg-slate-950/80 border-b border-slate-800/80">
                          <td colSpan={7} className="py-4 px-6 text-xs text-slate-300">
                            <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-3">
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                                  <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                                  <span>{formatDate(evt.timestamp)} - {evt.timestamp}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-[11px] text-slate-400">
                                    ID: <span className="text-slate-200 font-bold">{evt.id}</span>
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <span className="text-[11px] font-bold text-emerald-300 font-mono block">
                                  {isAr ? 'سياق المساءلة وبيان العملية الموثقة:' : 'Accountability & Verification Summary:'}
                                </span>
                                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                                  {isAr ? evt.detailsSummaryAr : evt.detailsSummaryEn}
                                </p>
                              </div>

                              {/* Quick Actions from inside the details row */}
                              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                                  <span>{isAr ? 'المسؤول المنفّذ:' : 'Executing Actor:'}</span>
                                  <span className="text-slate-200 font-bold">{evt.actorName} ({evt.actorEmail})</span>
                                </div>

                                <div className="flex items-center gap-2">
                                  {evt.lawArticleRef && onNavigateToArticle && (
                                    <button
                                      onClick={() => onNavigateToArticle(getArticleId(evt.lawArticleRef))}
                                      className="rounded border border-purple-500/40 bg-purple-950/40 px-2.5 py-1 text-[11px] font-mono text-purple-300 hover:bg-purple-900/50 transition flex items-center gap-1"
                                    >
                                      <Scale className="h-3 w-3" />
                                      <span>{isAr ? 'مراجعة المادة في القانون' : 'Inspect Law Article'}</span>
                                    </button>
                                  )}

                                  {onConsultDpo && (
                                    <button
                                      onClick={() => onConsultDpo(isAr ? `أريد تدقيقاً حول النشاط المسجل: ${evt.actionTitleAr} المتعلق بـ ${evt.targetResource || 'الموقع'}` : `Audit inquiry regarding: ${evt.actionTitleEn}`)}
                                      className="rounded border border-blue-500/40 bg-blue-950/40 px-2.5 py-1 text-[11px] font-mono text-blue-300 hover:bg-blue-900/50 transition flex items-center gap-1"
                                    >
                                      <Bot className="h-3 w-3" />
                                      <span>{isAr ? 'استشارة المستشار الذكي DPO' : 'Ask DPO Advisor'}</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Manual Compliance Action Logger */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  {isAr ? 'توثيق إجراء تدقيق يدوي في السجل' : 'Log Manual Compliance Action'}
                </h3>
              </div>
              <button
                onClick={() => setIsManualModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateManualLog} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  {isAr ? 'عنوان الإجراء / التدقيق المنفّذ *' : 'Action Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder={isAr ? 'مثال: تدقيق يدوي لعقد استضافة المعطيات السحابية' : 'e.g., Manual inspection of cloud hosting agreement'}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {isAr ? 'التصنيف' : 'Category'}
                  </label>
                  <select
                    value={manualCategory}
                    onChange={(e) => setManualCategory(e.target.value as AuditTrailCategory)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-emerald-500 focus:outline-none font-mono"
                  >
                    <option value="REMEDIATION">{isAr ? 'إجراء تصحيحي (Remediation)' : 'Remediation'}</option>
                    <option value="LEGAL_INQUIRY">{isAr ? 'فحص قانوني (Legal Review)' : 'Legal Review'}</option>
                    <option value="SCAN">{isAr ? 'فحص يدوي (Manual Scan)' : 'Manual Scan'}</option>
                    <option value="ALERT">{isAr ? 'إنذار داخلي (Internal Alert)' : 'Internal Alert'}</option>
                    <option value="EXPORT">{isAr ? 'أرشفة مستندات (Archive)' : 'Archive'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {isAr ? 'حالة النتيجة' : 'Outcome Status'}
                  </label>
                  <select
                    value={manualStatus}
                    onChange={(e) => setManualStatus(e.target.value as AuditTrailStatus)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-emerald-500 focus:outline-none font-mono"
                  >
                    <option value="SUCCESS">{isAr ? 'ناجح ومطابق (Success)' : 'Success / Compliant'}</option>
                    <option value="WARNING">{isAr ? 'تنبيه امتثال (Warning)' : 'Warning'}</option>
                    <option value="ALERT">{isAr ? 'مخالفة / إنذار (Alert)' : 'Critical Alert'}</option>
                    <option value="INFO">{isAr ? 'توثيق إجرائي (Info)' : 'Informational'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {isAr ? 'المورد أو النطاق المعني' : 'Target Resource / System'}
                  </label>
                  <input
                    type="text"
                    value={manualTarget}
                    onChange={(e) => setManualTarget(e.target.value)}
                    placeholder="e.g. AWS Europe / CNDP Portal"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    {isAr ? 'المادة القانونية المرجعية' : 'Law Article Ref'}
                  </label>
                  <input
                    type="text"
                    value={manualArticle}
                    onChange={(e) => setManualArticle(e.target.value)}
                    placeholder="e.g. المادة 23"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  {isAr ? 'ملاحظات المساءلة والأدلة الموثقة' : 'Accountability Evidence & Notes'}
                </label>
                <textarea
                  rows={3}
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder={isAr ? 'بيّن تفاصيل الإجراء المنفّذ، الأطراف المعنية، ورقم المرجع الداخلي...' : 'Describe the inspection details, verification steps, and internal reference...'}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-slate-300 hover:bg-slate-700 font-mono"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-5 py-2 font-bold text-white font-mono shadow-md"
                >
                  {isAr ? 'حفظ وتوثيق الإجراء' : 'Save to Audit Ledger'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
