import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AuditScanner } from './components/AuditScanner';
import { ResultsDashboard } from './components/ResultsDashboard';
import { MinisterialPresentationCard } from './components/MinisterialPresentationCard';
import { DeepCookiesAudit } from './components/DeepCookiesAudit';
import { RemediationPlan } from './components/RemediationPlan';
import { BreachResponseGuide } from './components/BreachResponseGuide';
import { ComparisonBattle } from './components/ComparisonBattle';
import { HistoryDashboard } from './components/HistoryDashboard';
import { ArticlesOfLawTab } from './components/ArticlesOfLawTab';
import { FounderVisionMarquee } from './components/FounderVisionMarquee';
import { FounderVisionScreen } from './components/FounderVisionScreen';
import { PrivacyAndCookiesSection } from './components/PrivacyAndCookiesSection';
import { PythonSourceModal } from './components/PythonSourceModal';
import { AuthModal } from './components/AuthModal';
import { FormalPdfReportModal } from './components/FormalPdfReportModal';
import { GeminiDpoChatbot } from './components/GeminiDpoChatbot';
import { DpoEmailAlertModal } from './components/DpoEmailAlertModal';
import { RegulatoryUpdatesTab } from './components/RegulatoryUpdatesTab';
import { AuditTrailTab } from './components/AuditTrailTab';
import { PostQuantumDefenseCenter } from './components/PostQuantumDefenseCenter';
import { ProcessingRegistryTab } from './components/ProcessingRegistryTab';
import { DpiaSimulatorTab } from './components/DpiaSimulatorTab';
import { SubjectRightsTab } from './components/SubjectRightsTab';
import { CndpDeclarationModal } from './components/CndpDeclarationModal';
import { SovereignMapModal } from './components/SovereignMapModal';
import { CookieSimulatorModal } from './components/CookieSimulatorModal';
import { Footer } from './components/Footer';
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
  const [targetInput, setTargetInput] = useState<string>('');
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

  // Authenticated User - Institutional & Founder Profile
  const [user, setUser] = useState<UserAccount | null>({
    name: 'طه الستري (Taha Setri)',
    email: 'tahasetri@gmail.com',
    role: 'المؤسس ورئيس المعمارية السيادية / Chief Architect',
    organization: 'VerifyOS™ Sovereign Systems · Morocco'
  });

  // History state - Clean without preset commercial sites
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);

  // Listen to Firebase Auth state safely
  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(
        auth,
        (firebaseUser) => {
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
        },
        (error) => {
          console.warn('[Soverify Auth] Auth state observer notice (non-fatal):', error);
        }
      );
      return () => {
        try {
          unsubscribe();
        } catch {
          // ignore
        }
      };
    } catch (e) {
      console.warn('[Soverify Auth] Failed to attach auth state observer:', e);
    }
  }, []);

  // Listen to Firestore real-time reports when a user has a UID
  useEffect(() => {
    if (!user?.uid) return;
    try {
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
      return () => {
        try {
          unsubscribe();
        } catch {
          // ignore
        }
      };
    } catch (e) {
      console.warn('[Soverify Firestore] Failed to subscribe to user reports:', e);
    }
  }, [user?.uid]);

  const handleScan = (target: string) => {
    setIsScanning(true);
    setTargetInput(target);
    setActiveTab('audit');

    // Record audit event for scan initiation
    try {
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
    } catch (e) {
      console.warn('[Soverify Audit] Scan start logging notice:', e);
    }

    setTimeout(async () => {
      try {
        const report = await runComplianceScan(target);
        if (!report) {
          setIsScanning(false);
          return;
        }
        setCurrentReport(report);
        setIsScanning(false);

        // Record audit event for scan completion
        const gaps = report.gaps || [];
        const warnings = report.warnings || [];
        const hasCritical = gaps.some((g) => g.severity === 'CRITICAL');
        try {
          recordAuditEvent({
            category: 'SCAN',
            actionTitleAr: `اكتمال فحص ${report.businessName || target}: النتيجة ${report.score}/100`,
            actionTitleEn: `Scan completed for ${report.businessName || target}: Score ${report.score}/100`,
            actorName: user?.name || 'Compliance Officer',
            actorEmail: user?.email || 'officer@soverify.ma',
            targetResource: target,
            lawArticleRef: hasCritical ? 'المادة 23' : 'المادة 1',
            status: hasCritical ? 'ALERT' : report.score < 70 ? 'WARNING' : 'SUCCESS',
            detailsSummaryAr: `اكتمل الفحص بنتيجة ${report.score}/100 مع رصد ${gaps.length} ثغرة قانونية و${warnings.length} تنبيه امتثال.`,
            detailsSummaryEn: `Scan finished with compliance score ${report.score}/100 (${gaps.length} gaps, ${warnings.length} warnings).`,
            userId: user?.uid
          });
        } catch (e) {
          console.warn('[Soverify Audit] Scan finish logging notice:', e);
        }

        // Save to local history
        const newHistoryItem: ScanHistoryItem = {
          id: report.id,
          target: report.target,
          businessName: report.businessName,
          score: report.score,
          status: report.statusAr || report.status,
          date: new Date().toISOString().substring(0, 16).replace('T', ' '),
          gapsCount: gaps.length,
          warningsCount: warnings.length
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
      } catch (scanErr) {
        console.error('[Soverify Scanner] handleScan failure:', scanErr);
        setIsScanning(false);
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

      {/* Live Regulatory Ticker / Marquee */}
      <div className="bg-slate-900/95 border-b border-slate-800/80 px-4 py-2 overflow-hidden flex items-center gap-3 z-30 select-none">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-bold text-xs shrink-0 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>CNDP LIVE</span>
        </div>
        <div className="overflow-hidden w-full">
          {(() => {
            const MarqueeTag = 'marquee' as any;
            return (
              <MarqueeTag
                behavior="scroll"
                direction={isAr ? "right" : "left"}
                scrollamount="5"
                className="text-xs font-mono text-slate-300 block"
              >
                <span className="text-red-400 font-bold inline-flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 inline text-red-400" />
                  {isAr ? 'إنذار رسمي: عقوبات المادة 53 من القانون 08-09 تصل إلى 100,000 درهم عن انعدام التصريح المسبق' : 'Official Warning: Article 53 fines up to 100,000 MAD for missing CNDP declaration'}
                </span>
                &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="text-amber-400 font-bold inline-flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 inline text-amber-400" />
                  {isAr ? 'مداولة CNDP رقم 08-2020: حظر وضع ملفات تعريف الارتباط قبل الحصول على الموافقة الصريحة الحرة' : 'CNDP Deliberation 08-2020: Strict ban on cookies prior to explicit consent'}
                </span>
                &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="text-emerald-400 font-bold inline-flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 inline text-emerald-400" />
                  {isAr ? 'السيادة الوطنية: توطين معطيات المواطنين المغاربة داخل مراكز بيانات محلية إلزامي قانونياً' : 'National Sovereignty: Local data residency strictly enforced under Article 63'}
                </span>
                &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="text-blue-400 font-bold inline-flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 inline text-blue-400" />
                  {isAr ? 'بروتوكول طوارئ 72h: إلزامية إبلاغ اللجنة الوطنية CNDP بأي خرق أمني يمس البيانات الشخصية' : '72h Protocol: Mandatory formal data breach notification to CNDP under Article 23'}
                </span>
                &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="text-purple-400 font-bold inline-flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 inline text-purple-400" />
                  {isAr ? 'اعتماد VerifyOS™: المنصة الأولى بالمملكة للتدقيق السيادي ومطابقة CNDP & GDPR' : 'VerifyOS™ Certified: Morocco premier sovereign RegTech & compliance platform'}
                </span>
              </MarqueeTag>
            );
          })()}
        </div>
      </div>

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
              onSelectReportFromBulk={(report) => {
                setCurrentReport(report);
                setTargetInput(report.domain);
              }}
              onBulkReportsGenerated={(reports) => {
                const newItems: ScanHistoryItem[] = reports.map((r) => ({
                  id: r.id,
                  target: r.target,
                  businessName: r.businessName,
                  score: r.score,
                  status: r.statusAr,
                  date: new Date().toISOString().substring(0, 16).replace('T', ' '),
                  gapsCount: r.gaps.length,
                  warningsCount: r.warnings.length
                }));
                setHistory((prev) => {
                  const existingTargets = new Set(newItems.map((n) => n.target));
                  return [...newItems, ...prev.filter((p) => !existingTargets.has(p.target))];
                });
                showSyncNotice(
                  lang === 'ar'
                    ? `اكتمل الفحص المجمّع لـ ${reports.length} نطاقات وتسجيل النتائج`
                    : `Bulk audit completed for ${reports.length} domains & added to ledger`
                );
              }}
            />

            {currentReport ? (
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
            ) : (
              <MinisterialPresentationCard
                lang={lang}
                onStartAuditNow={() => {
                  const el = document.querySelector('input[type="text"]') as HTMLInputElement;
                  if (el) el.focus();
                }}
              />
            )}

            {/* Founder's Vision (Taha Setri) */}
            <FounderVisionMarquee 
              lang={lang} 
              onOpenVisionScreen={() => setActiveTab('vision')} 
            />
          </div>
        )}

        {/* Tab: CNDP Processing Activities Register (سجل معالجة البيانات الشخصية) */}
        {activeTab === 'registry' && (
          <ProcessingRegistryTab
            lang={lang}
            onConsultDpo={(topic) => {
              if (topic) setDpoConsultationTopic(topic);
              setActiveTab('chatbot');
            }}
          />
        )}

        {/* Tab: DPIA / AIPD Risk Assessment Simulator (محاكي تقييم الأثر والمخاطر) */}
        {activeTab === 'dpia' && (
          <DpiaSimulatorTab
            lang={lang}
            onConsultDpo={(topic) => {
              if (topic) setDpoConsultationTopic(topic);
              setActiveTab('chatbot');
            }}
            onNavigateToArticles={handleNavigateToArticle}
          />
        )}

        {/* Tab: Data Subject Rights Response Suite (ممارسة حقوق المعنيين بالأمر) */}
        {activeTab === 'rights' && (
          <SubjectRightsTab
            lang={lang}
            onConsultDpo={(topic) => {
              if (topic) setDpoConsultationTopic(topic);
              setActiveTab('chatbot');
            }}
          />
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

        {/* Tab: Post-Quantum Cryptography & Defense Center (NIST FIPS 203/204) */}
        {activeTab === 'quantum' && (
          <PostQuantumDefenseCenter
            lang={lang}
            currentDomain={currentReport?.domain || targetInput || 'banquepopulaire.ma'}
            onNavigateToAudit={(domain) => {
              setTargetInput(domain);
              setActiveTab('audit');
              handleScan(domain);
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
            report={currentReport}
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

        {/* Tab 8: Dedicated Founder's Vision Screen (Taha Setri) */}
        {activeTab === 'vision' && (
          <FounderVisionScreen
            lang={lang}
            onNavigateTab={(tab) => {
              setSelectedArticleId(null);
              setActiveTab(tab);
            }}
          />
        )}
      </main>

      {/* Floating Shortcut to Gemini DPO Chatbot (When not currently on chatbot tab) */}
      {activeTab !== 'chatbot' && (
        <div className={`fixed bottom-6 ${isAr ? 'left-6' : 'right-6'} z-30 no-print`}>
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

      {/* Institutional Privacy & Cookies Compliance Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <PrivacyAndCookiesSection lang={lang} />
      </div>

      {/* Moroccan Legal Reference & Founder Footer */}
      <Footer
        lang={lang}
        onNavigateTab={(tab) => {
          setSelectedArticleId(null);
          setActiveTab(tab);
        }}
        onOpenPythonModal={() => setIsPythonModalOpen(true)}
      />

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
