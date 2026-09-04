import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AuditScanner } from './components/AuditScanner';
import { ResultsDashboard } from './components/ResultsDashboard';
import { DeepCookiesAudit } from './components/DeepCookiesAudit';
import { RemediationPlan } from './components/RemediationPlan';
import { BreachResponseGuide } from './components/BreachResponseGuide';
import { ComparisonBattle } from './components/ComparisonBattle';
import { HistoryDashboard } from './components/HistoryDashboard';
import { ArticlesOfLawTab } from './components/ArticlesOfLawTab';
import { PythonSourceModal } from './components/PythonSourceModal';
import { AuthModal } from './components/AuthModal';
import { FormalPdfReportModal } from './components/FormalPdfReportModal';
import { GeminiDpoChatbot } from './components/GeminiDpoChatbot';
import { DpoEmailAlertModal } from './components/DpoEmailAlertModal';
import { RegulatoryUpdatesTab } from './components/RegulatoryUpdatesTab';
import { AuditTrailTab } from './components/AuditTrailTab';
import { runComplianceScan } from './services/complianceScanner';
import { triggerDpoSecurityAlertService, EmailDispatchResult } from './services/dpoNotificationService';
import { recordAuditEvent } from './services/auditTrailService';
import { AuditReport, ComplianceGap, ScanHistoryItem, UserAccount } from './types';
import { 
  ShieldCheck, 
  Scale, 
  AlertCircle, 
  FileText, 
  CheckCircle2, 
  Bot, 
  Sparkles, 
  Cloud, 
  CloudCheck,
  Mail,
  ShieldAlert,
  Globe,
  FileClock
} from 'lucide-react';
import { 
  auth, 
  saveReportToFirestore, 
  subscribeToUserReports, 
  deleteReportFromFirestore,
  saveDpoAlertToFirestore
} from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [activeTab, setActiveTab] = useState<string>('audit');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [currentReport, setCurrentReport] = useState<AuditReport | null>(null);
  const [targetInput, setTargetInput] = useState<string>('banque-populaire-demo.ma');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [cloudSyncNotice, setCloudSyncNotice] = useState<string | null>(null);

  // Modals
  const [isPythonModalOpen, setIsPythonModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [isEmailAlertModalOpen, setIsEmailAlertModalOpen] = useState<boolean>(false);
  const [emailDispatchResult, setEmailDispatchResult] = useState<EmailDispatchResult | null>(null);
  const [isDispatchingEmail, setIsDispatchingEmail] = useState<boolean>(false);
  const [dpoConsultationTopic, setDpoConsultationTopic] = useState<string>('');

  // Authenticated User
  const [user, setUser] = useState<UserAccount | null>({
    name: 'Yassine El Fassi',
    email: 'yassine.elfassi@banque.ma',
    role: 'Chief DPO / مسؤول حماية المعطيات',
    organization: 'Groupe Bancaire Marocain'
  });

  // History state
  const [history, setHistory] = useState<ScanHistoryItem[]>([
    {
      id: 'rep_1',
      target: 'https://banque-populaire-demo.ma',
      businessName: 'Banque Populaire (Audit Démo)',
      score: 88,
      status: 'ممتثل للمعايير (Conforme CNDP)',
      date: '2026-08-28 14:30',
      gapsCount: 1,
      warningsCount: 2
    },
    {
      id: 'rep_2',
      target: 'https://e-commerce-maroc-store.ma',
      businessName: 'Maroc E-Commerce Boutique',
      score: 54,
      status: 'غير ممتثل - مخاطر قانونية',
      date: '2026-08-30 10:15',
      gapsCount: 4,
      warningsCount: 4
    },
    {
      id: 'rep_3',
      target: 'https://sante-teleconsult.ma',
      businessName: 'Santé Téléconsult Maroc',
      score: 76,
      status: 'امتثال جزئي يتطلب تحسينات',
      date: '2026-09-02 17:45',
      gapsCount: 2,
      warningsCount: 3
    }
  ]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userObj: UserAccount = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'Google User',
          email: firebaseUser.email || '',
          role: 'DPO / حماية المعطيات الشخصية',
          organization: 'Enterprise (Cloud Verified)',
          photoURL: firebaseUser.photoURL || undefined,
          isFirebaseUser: true
        };
        setUser(userObj);
      }
    });
    return () => unsubscribe();
  }, []);

  // Listen to Firestore real-time reports when a user has a UID
  useEffect(() => {
    if (!user?.uid) return;
    const unsubscribe = subscribeToUserReports(user.uid, (firestoreReports) => {
      if (firestoreReports && firestoreReports.length > 0) {
        const mappedHistory: ScanHistoryItem[] = firestoreReports.map((r) => ({
          id: r.id,
          target: r.target,
          businessName: r.businessName,
          score: r.score,
          status: r.statusAr || r.status,
          date: r.timestamp.substring(0, 16).replace('T', ' '),
          gapsCount: r.gaps?.length || 0,
          warningsCount: r.warnings?.length || 0
        }));
        setHistory(mappedHistory);
      }
    });
    return () => unsubscribe();
  }, [user?.uid]);

  // Initial scan on load
  useEffect(() => {
    handleScan('banque-populaire-demo.ma');
  }, []);

  const handleScan = (target: string) => {
    setIsScanning(true);
    setTargetInput(target);
    setActiveTab('audit');

    // Record audit event for scan initiation
    recordAuditEvent({
      category: 'SCAN',
      actionTitleAr: `بدء فحص الامتثال لموقع: ${target}`,
      actionTitleEn: `Compliance audit scan initiated for: ${target}`,
      actorName: user?.name || 'Compliance Officer',
      actorEmail: user?.email || 'officer@soverify.ma',
      targetResource: target,
      lawArticleRef: 'المادة 23',
      status: 'INFO',
      detailsSummaryAr: `بدء الفحص الآلي لعناصر الامتثال وسياسات الخصوصية والكوكيز والبروتوكولات الأمنية للموقع ${target}.`,
      detailsSummaryEn: `Automated inspection initiated for privacy policies, cookie banners, and Law 08-09 requirements for ${target}.`,
      userId: user?.uid
    });

    setTimeout(async () => {
      const report = runComplianceScan(target);
      setCurrentReport(report);
      setIsScanning(false);

      // Record audit event for scan completion
      const hasCritical = report.gaps.some((g) => g.severity === 'CRITICAL');
      recordAuditEvent({
        category: 'SCAN',
        actionTitleAr: `اكتمال فحص ${report.businessName || target}: النتيجة ${report.score}/100`,
        actionTitleEn: `Scan completed for ${report.businessName || target}: Score ${report.score}/100`,
        actorName: user?.name || 'Compliance Officer',
        actorEmail: user?.email || 'officer@soverify.ma',
        targetResource: target,
        lawArticleRef: hasCritical ? 'المادة 23' : 'المادة 1',
        status: hasCritical ? 'ALERT' : report.score < 70 ? 'WARNING' : 'SUCCESS',
        detailsSummaryAr: `اكتمل الفحص بنتيجة ${report.score}/100 مع رصد ${report.gaps.length} ثغرة قانونية و${report.warnings.length} تنبيه امتثال.`,
        detailsSummaryEn: `Scan finished with compliance score ${report.score}/100 (${report.gaps.length} gaps, ${report.warnings.length} warnings).`,
        userId: user?.uid
      });

      // Save to local history
      const newHistoryItem: ScanHistoryItem = {
        id: report.id,
        target: report.target,
        businessName: report.businessName,
        score: report.score,
        status: report.statusAr,
        date: new Date().toISOString().substring(0, 16).replace('T', ' '),
        gapsCount: report.gaps.length,
        warningsCount: report.warnings.length
      };

      setHistory((prev) => [newHistoryItem, ...prev.filter((h) => h.target !== report.target)]);

      // Auto-save to Firestore if user has UID
      if (user?.uid) {
        try {
          await saveReportToFirestore(user.uid, report);
          showSyncNotice(lang === 'ar' ? 'تم حفظ التقرير في سحابة Firestore بنجاح' : 'Report saved to Firestore successfully');
        } catch (e) {
          console.error('Auto-save to Firestore failed:', e);
        }
      }
    }, 1200);
  };

  const handleManualSyncToCloud = async () => {
    if (!currentReport || !user?.uid) return;
    try {
      await saveReportToFirestore(user.uid, currentReport);
      showSyncNotice(lang === 'ar' ? 'تمت مزامنة التقرير النشط مع قاعدة بيانات Firestore' : 'Active report synced to Firestore');
    } catch (e) {
      console.error('Manual Firestore sync error:', e);
    }
  };

  const handleDeleteHistoryItem = async (reportId: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== reportId));
    if (user?.uid) {
      await deleteReportFromFirestore(reportId).catch(console.error);
    }
  };

  const showSyncNotice = (msg: string) => {
    setCloudSyncNotice(msg);
    setTimeout(() => setCloudSyncNotice(null), 3500);
  };

  const handleTriggerDpoEmailAlert = async (specificGap?: ComplianceGap) => {
    if (!currentReport || !user) return;
    setIsDispatchingEmail(true);

    try {
      const dispatch = await triggerDpoSecurityAlertService(currentReport, user, specificGap);
      setEmailDispatchResult(dispatch);
      setIsEmailAlertModalOpen(true);

      // Record audit event for DPO email dispatch
      recordAuditEvent({
        category: 'ALERT',
        actionTitleAr: `إرسال إنذار DPO أمني عاجل إلى: ${user.email}`,
        actionTitleEn: `Dispatched Urgent DPO Security Alert to: ${user.email}`,
        actorName: user.name,
        actorEmail: user.email,
        targetResource: currentReport.target,
        lawArticleRef: specificGap?.article || 'المادة 23',
        status: 'ALERT',
        detailsSummaryAr: `تم توجيه إنذار عالي الخطورة حول ثغرة "${specificGap?.titleAr || 'ثغرة أمنية حرجة'}" وفقاً للمادة 23 من القانون 08.09 مع تقدير الغرامة المالية.`,
        detailsSummaryEn: `High-risk notification dispatched regarding "${specificGap?.title || 'Critical Gap'}" under Moroccan Law 08-09.`,
        userId: user.uid
      });

      // Also persist the alert in Firestore if user is authenticated
      if (user.uid) {
        await saveDpoAlertToFirestore(user.uid, dispatch.alert).catch(console.error);
      }

      showSyncNotice(
        lang === 'ar' 
          ? `تم إرسال إنذار بريدي فوري إلى ${user.email}` 
          : `Urgent DPO security alert emailed to ${user.email}`
      );
    } catch (error) {
      console.error('Failed to dispatch DPO alert email:', error);
    } finally {
      setIsDispatchingEmail(false);
    }
  };

  const handleNavigateToArticle = (articleId?: string) => {
    if (articleId) {
      setSelectedArticleId(articleId);
    }
    setActiveTab('articles');

    // Record audit event for legal reference inspection
    const cleanArt = articleId ? articleId.replace('art-', 'المادة ') : 'مواد القانون';
    recordAuditEvent({
      category: 'LEGAL_INQUIRY',
      actionTitleAr: `مراجعة النص القانوني لـ ${cleanArt} من القانون 08.09`,
      actionTitleEn: `Legal consultation of ${articleId || 'Law 08-09 Articles'}`,
      actorName: user?.name || 'Compliance Officer',
      actorEmail: user?.email || 'officer@soverify.ma',
      targetResource: `Moroccan Law 08.09 (${cleanArt})`,
      lawArticleRef: cleanArt,
      status: 'INFO',
      detailsSummaryAr: `مراجعة الشروط النظامية والمقتضيات الزجرية المنصوص عليها في التشريع المغربي لحماية المعطيات.`,
      detailsSummaryEn: `Inspected statutory obligations, regulatory penalties, and judicial precedents under Moroccan Law 08-09.`,
      userId: user?.uid
    });
  };

  const isAr = lang === 'ar';

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans ${isAr ? 'rtl' : 'ltr'}`} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenPythonCode={() => {
          setIsPythonModalOpen(true);
          recordAuditEvent({
            category: 'EXPORT',
            actionTitleAr: 'تصدير كود الفحص الآلي بلغة Python (app.py)',
            actionTitleEn: 'Exported Standalone Automated Compliance Python Script',
            actorName: user?.name || 'Compliance Officer',
            actorEmail: user?.email || 'officer@soverify.ma',
            targetResource: currentReport?.target || 'Audit Engine',
            lawArticleRef: 'المادة 23',
            status: 'INFO',
            detailsSummaryAr: 'توليد ومراجعة الكود البرمجي المفتوح لفحص التشفير، الكوكيز، والتصريحات.',
            detailsSummaryEn: 'Generated and reviewed standalone compliance inspection Python script for offline deployment.',
            userId: user?.uid
          });
        }}
        hasReport={!!currentReport}
        onDownloadPdf={() => {
          setIsPdfModalOpen(true);
          recordAuditEvent({
            category: 'EXPORT',
            actionTitleAr: `طلب استخراج تقرير الامتثال الرسمي المعتمد CNDP (PDF) لموقع ${currentReport?.target}`,
            actionTitleEn: `Requested Certified CNDP Audit PDF Report Export for ${currentReport?.target}`,
            actorName: user?.name || 'Compliance Officer',
            actorEmail: user?.email || 'officer@soverify.ma',
            targetResource: currentReport?.target || 'Audit Report',
            lawArticleRef: 'المادة 23',
            status: 'SUCCESS',
            detailsSummaryAr: `تجهيز وثيقة الإثبات الرسمية مع درجة الامتثال (${currentReport?.score}/100) وتوصيات المعالجة المعتمدة.`,
            detailsSummaryEn: `Rendered formal evidentiary PDF documentation including score (${currentReport?.score}/100) and remediation matrix.`,
            userId: user?.uid
          });
        }}
      />

      {/* Cloud Sync Toast Notification */}
      {cloudSyncNotice && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2 rounded-xl border border-teal-500/40 bg-teal-950/90 px-4 py-2.5 text-xs text-teal-200 shadow-2xl backdrop-blur animate-fadeIn">
          <Cloud className="h-4 w-4 text-teal-400" />
          <span>{cloudSyncNotice}</span>
        </div>
      )}

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Tab 1: Compliance Audit */}
        {activeTab === 'audit' && (
          <div className="space-y-8">
            <Hero lang={lang} onQuickAudit={handleScan} />

            <AuditScanner
              onScan={handleScan}
              isScanning={isScanning}
              lang={lang}
              defaultTarget={targetInput}
            />

            {currentReport && (
              <ResultsDashboard
                report={currentReport}
                lang={lang}
                onViewCookies={() => setActiveTab('cookies')}
                onViewRemediation={() => setActiveTab('remediation')}
                onViewBreachGuide={() => setActiveTab('breach')}
                onDownloadPdf={() => setIsPdfModalOpen(true)}
                onViewArticle={handleNavigateToArticle}
                onConsultDpo={() => setActiveTab('chatbot')}
                onTriggerDpoEmailAlert={handleTriggerDpoEmailAlert}
                onViewAuditTrail={() => setActiveTab('auditTrail')}
              />
            )}
          </div>
        )}

        {/* Tab: Regulatory Updates (CNDP & Moroccan Privacy Law via Google Search) */}
        {activeTab === 'updates' && (
          <RegulatoryUpdatesTab
            lang={lang}
            onNavigateToArticle={handleNavigateToArticle}
            onConsultDpoWithTopic={(topic) => {
              setDpoConsultationTopic(topic);
              setActiveTab('chatbot');
            }}
          />
        )}

        {/* Tab: Gemini DPO AI Chatbot (المستشار الذكي) */}
        {activeTab === 'chatbot' && (
          <GeminiDpoChatbot
            lang={lang}
            currentReport={currentReport}
            currentUser={user}
            initialPrompt={dpoConsultationTopic}
          />
        )}

        {/* Tab: Articles of Law Reference (Loi 08-09 & CNDP) */}
        {activeTab === 'articles' && (
          <ArticlesOfLawTab
            lang={lang}
            currentReport={currentReport}
            selectedArticleId={selectedArticleId}
            onNavigateToRemediation={() => setActiveTab('remediation')}
          />
        )}

        {/* Tab 2: Deep Cookies Audit */}
        {activeTab === 'cookies' && currentReport && (
          <DeepCookiesAudit
            cookies={currentReport.cookies}
            lang={lang}
            targetUrl={currentReport.target}
          />
        )}

        {/* Tab 3: 30-Day Automated Remediation Plan */}
        {activeTab === 'remediation' && currentReport && (
          <RemediationPlan
            plan={currentReport.remediationPlan}
            lang={lang}
            targetDomain={currentReport.domain}
            onDownloadPdf={() => setIsPdfModalOpen(true)}
          />
        )}

        {/* Tab 4: Data Breach Incident Response Guide */}
        {activeTab === 'breach' && (
          <BreachResponseGuide lang={lang} />
        )}

        {/* Tab 5: Compliance Comparison Tool */}
        {activeTab === 'compare' && (
          <ComparisonBattle lang={lang} />
        )}

        {/* Tab 6: Historical Reports & Tracking Evolution */}
        {activeTab === 'history' && (
          <HistoryDashboard
            history={history}
            lang={lang}
            currentUser={user}
            onSelectReport={(target) => handleScan(target)}
            onSyncCurrentToCloud={handleManualSyncToCloud}
            onDeleteHistoryItem={handleDeleteHistoryItem}
          />
        )}

        {/* Tab 7: Chronological Audit Trail & Accountability Ledger */}
        {activeTab === 'auditTrail' && (
          <AuditTrailTab
            lang={lang}
            currentUser={user}
            onNavigateToArticle={handleNavigateToArticle}
            onConsultDpo={(topic) => {
              if (topic) setDpoConsultationTopic(topic);
              setActiveTab('chatbot');
            }}
          />
        )}
      </main>

      {/* Floating Shortcut to Gemini DPO Chatbot (When not currently on chatbot tab) */}
      {activeTab !== 'chatbot' && (
        <div className={`fixed bottom-6 ${isAr ? 'left-6' : 'right-6'} z-30`}>
          <button
            onClick={() => setActiveTab('chatbot')}
            className="group flex items-center gap-3 rounded-full border border-emerald-500/40 bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-white shadow-2xl shadow-emerald-500/30 hover:scale-105 transition duration-200"
          >
            <div className="relative flex items-center justify-center">
              <Bot className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300"></span>
              </span>
            </div>
            <span className="text-xs font-bold font-sans">
              {isAr ? 'المستشار الذكي DPO (Gemini)' : 'Ask Gemini DPO Advisor'}
            </span>
          </button>
        </div>
      )}

      {/* Moroccan Legal Reference Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>
              SOVERIFY — منصة التدقيق الآلي وفق القانون رقم 08.09 والظهير الشريف رقم 1.09.15
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <button onClick={() => setActiveTab('updates')} className="text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1 font-bold">
              <Globe className="h-3.5 w-3.5 text-emerald-400" />
              <span>{isAr ? 'مستجدات CNDP (Live Search)' : 'Regulatory Updates'}</span>
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('auditTrail')} className="text-slate-400 hover:text-emerald-300 transition flex items-center gap-1">
              <FileClock className="h-3.5 w-3.5" />
              <span>{isAr ? 'سجل التدقيق (Audit Trail)' : 'Audit Trail'}</span>
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('chatbot')} className="text-slate-400 hover:text-emerald-300 transition flex items-center gap-1">
              <Bot className="h-3.5 w-3.5" />
              <span>{isAr ? 'المستشار الذكي (Gemini)' : 'Gemini DPO Chat'}</span>
            </button>
            <span>•</span>
            <button onClick={() => { setSelectedArticleId(null); setActiveTab('articles'); }} className="hover:text-emerald-400 transition underline underline-offset-4">
              {isAr ? 'مدونة مواد القانون 08.09' : 'Articles of Law 08/09'}
            </button>
            <span>•</span>
            <button onClick={() => setIsPythonModalOpen(true)} className="hover:text-emerald-400 transition underline underline-offset-4">
              {isAr ? 'كود بايثون المستقل (app.py)' : 'Standalone app.py'}
            </button>
            <span>•</span>
            <span>CNDP Rabat, Maroc</span>
            <span>•</span>
            <span>TLS 1.3 / HSTS Enforcement</span>
          </div>
        </div>
      </footer>

      {/* Standalone Python Source Modal */}
      <PythonSourceModal
        isOpen={isPythonModalOpen}
        onClose={() => setIsPythonModalOpen(false)}
        lang={lang}
      />

      {/* Authentication / DPO Profile Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={user}
        onLogin={(acc) => setUser(acc)}
        onLogout={() => setUser(null)}
        lang={lang}
      />

      {/* Formal PDF Report & 30-Day Plan Modal */}
      {currentReport && (
        <FormalPdfReportModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          report={currentReport}
          user={user}
          lang={lang}
        />
      )}

      {/* DPO Security Alert Email Notification Modal */}
      <DpoEmailAlertModal
        isOpen={isEmailAlertModalOpen}
        onClose={() => setIsEmailAlertModalOpen(false)}
        dispatchResult={emailDispatchResult}
        lang={lang}
      />
    </div>
  );
}
