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
import { FormalPdfReportModal } from './components/FormalPdfReportModal';
import { GeminiDpoChatbot } from './components/GeminiDpoChatbot';
import { DpoEmailAlertModal } from './components/DpoEmailAlertModal';
import { RegulatoryUpdatesTab } from './components/RegulatoryUpdatesTab';
import { AuditTrailTab } from './components/AuditTrailTab';
import { PostQuantumDefenseCenter } from './components/PostQuantumDefenseCenter';
import { CndpDeclarationModal } from './components/CndpDeclarationModal';
import { SovereignMapModal } from './components/SovereignMapModal';
import { CookieSimulatorModal } from './components/CookieSimulatorModal';
import { RopaRegistryModal } from './components/RopaRegistryModal';
import { DpiaAssessmentModal } from './components/DpiaAssessmentModal';
import { SovereignTrustSealModal } from './components/SovereignTrustSealModal';
import { ContinuousAuditModal } from './components/ContinuousAuditModal';
import { Footer } from './components/Footer';
import { runComplianceScan } from './services/complianceScanner';
import { triggerDpoSecurityAlertService, EmailDispatchResult } from './services/dpoNotificationService';
import { recordAuditEvent } from './services/auditTrailService';
import { AuditReport, ComplianceGap, ScanHistoryItem, UserAccount, Language } from './types';
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
  saveReportToFirestore, 
  subscribeToUserReports, 
  deleteReportFromFirestore,
  saveDpoAlertToFirestore
} from './lib/firebase';

export default function App() {
  const [lang, setLang] = useState<Language>('ar');

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const [activeTab, setActiveTab] = useState<string>('audit');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [currentReport, setCurrentReport] = useState<AuditReport | null>(null);
  const [targetInput, setTargetInput] = useState<string>('');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [cloudSyncNotice, setCloudSyncNotice] = useState<string | null>(null);

  // Modals
  const [isPythonModalOpen, setIsPythonModalOpen] = useState<boolean>(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState<boolean>(false);
  const [isEmailAlertModalOpen, setIsEmailAlertModalOpen] = useState<boolean>(false);
  const [isCndpModalOpen, setIsCndpModalOpen] = useState<boolean>(false);
  const [isSovereignMapModalOpen, setIsSovereignMapModalOpen] = useState<boolean>(false);
  const [isCookieSimulatorModalOpen, setIsCookieSimulatorModalOpen] = useState<boolean>(false);
  const [isRopaModalOpen, setIsRopaModalOpen] = useState<boolean>(false);
  const [isDpiaModalOpen, setIsDpiaModalOpen] = useState<boolean>(false);
  const [isTrustSealModalOpen, setIsTrustSealModalOpen] = useState<boolean>(false);
  const [isContinuousAuditModalOpen, setIsContinuousAuditModalOpen] = useState<boolean>(false);
  const [emailDispatchResult, setEmailDispatchResult] = useState<EmailDispatchResult | null>(null);
  const [isDispatchingEmail, setIsDispatchingEmail] = useState<boolean>(false);
  const [dpoConsultationTopic, setDpoConsultationTopic] = useState<string>('');

  // Sovereign Institutional Profile - Open Access, No Login Required
  const [user] = useState<UserAccount>({
    uid: 'soverify-sovereign-auditor',
    name: 'طه الستري (Taha Setri)',
    email: 'tahasetri@gmail.com',
    role: 'المؤسس ورئيس المعمارية السيادية / Chief Architect',
    organization: 'VerifyOS™ Sovereign Systems · Morocco'
  });

  // History state - Clean without preset commercial sites
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);

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

        setHistory((prev) => [newHistoryItem, ...prev]);

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
  const isFr = lang === 'fr';
  const subLang: 'ar' | 'en' = lang === 'ar' ? 'ar' : 'en';

  return (
    <div className={`min-h-screen bg-black text-white selection:bg-emerald-500 selection:text-black flex flex-col font-sans ${isAr ? 'rtl' : 'ltr'}`} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        user={user}
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

      {/* Live Regulatory Ticker / Marquee - Pure Black, White & Green */}
      <div className="bg-black border-b border-white/10 px-4 py-2.5 overflow-hidden flex items-center gap-3 z-30 select-none">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-950 border border-emerald-500/50 text-emerald-400 font-black text-xs shrink-0 font-mono tracking-wider">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>CNDP LIVE</span>
        </div>
        <div className="overflow-hidden w-full">
          {(() => {
            const MarqueeTag = 'marquee' as any;
            return (
              <MarqueeTag
                behavior="scroll"
                direction={isAr ? "right" : "left"}
                scrollamount="6"
                className="text-xs sm:text-sm font-mono text-slate-200 block font-medium"
              >
                <span className="text-red-400 font-bold inline-flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 inline text-red-400" />
                  {isAr 
                    ? 'إنذار رسمي: عقوبات المادة 53 من القانون 09-08 تصل إلى 100,000 درهم عن انعدام التصريح المسبق' 
                    : isFr
                    ? 'Avertissement CNDP : Sanctions de l’Article 53 jusqu’à 100 000 MAD en cas de défaut de déclaration préalable'
                    : 'Official Warning: Article 53 fines up to 100,000 MAD for missing CNDP declaration'}
                </span>
                &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="text-amber-400 font-bold inline-flex items-center gap-1.5">
                  <Scale className="w-4 h-4 inline text-amber-400" />
                  {isAr 
                    ? 'مداولة CNDP رقم 08-2020: حظر وضع ملفات تعريف الارتباط قبل الحصول على الموافقة الصريحة الحرة' 
                    : isFr
                    ? 'Délibération CNDP 08-2020 : Interdiction des cookies et traceurs avant recueil du consentement libre et éclairé'
                    : 'CNDP Deliberation 08-2020: Strict ban on cookies prior to explicit consent'}
                </span>
                &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="text-emerald-400 font-bold inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 inline text-emerald-400" />
                  {isAr 
                    ? 'السيادة الوطنية: توطين معطيات المواطنين المغاربة داخل مراكز بيانات محلية إلزامي قانونياً (المادتان 43 و 44)' 
                    : isFr
                    ? 'Souveraineté Numérique : Localisation des données au Maroc obligatoire (Articles 43 & 44)'
                    : 'National Sovereignty: Local Moroccan data residency strictly enforced under Articles 43 & 44'}
                </span>
                &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="text-sky-400 font-bold inline-flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 inline text-sky-400" />
                  {isAr 
                    ? 'بروتوكول طوارئ 72h: إلزامية إبلاغ اللجنة الوطنية CNDP بأي خرق أمني يمس البيانات الشخصية' 
                    : isFr
                    ? 'Protocole d’urgence 72h : Notification obligatoire de toute violation de données à la CNDP'
                    : '72h Protocol: Mandatory formal data breach notification to CNDP under Article 23'}
                </span>
                &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp;
                <span className="text-emerald-300 font-bold inline-flex items-center gap-1.5">
                  <FileText className="w-4 h-4 inline text-emerald-400" />
                  {isAr 
                    ? 'اعتماد VerifyOS™: المنصة الأولى بالمملكة للتدقيق السيادي ومطابقة CNDP' 
                    : isFr
                    ? 'VerifyOS™ Souverain : Première infrastructure nationale d’audit et de conformité CNDP'
                    : 'VerifyOS™ Certified: Morocco premier sovereign RegTech & CNDP compliance platform'}
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
                lang={subLang}
                onViewCookies={() => setActiveTab('cookies')}
                onViewRemediation={() => setActiveTab('remediation')}
                onViewBreachGuide={() => setActiveTab('breach')}
                onDownloadPdf={() => setIsPdfModalOpen(true)}
                onViewArticle={handleNavigateToArticle}
                onConsultDpo={() => setActiveTab('chatbot')}
                onTriggerDpoEmailAlert={handleTriggerDpoEmailAlert}
                onViewAuditTrail={() => setActiveTab('auditTrail')}
                onOpenCndpDeclaration={() => setIsCndpModalOpen(true)}
                onOpenSovereignMap={() => setIsSovereignMapModalOpen(true)}
                onOpenCookieSimulator={() => setIsCookieSimulatorModalOpen(true)}
                onOpenRopaRegistry={() => setIsRopaModalOpen(true)}
                onOpenDpiaAssessment={() => setIsDpiaModalOpen(true)}
                onOpenTrustSeal={() => setIsTrustSealModalOpen(true)}
                onOpenContinuousAudit={() => setIsContinuousAuditModalOpen(true)}
                history={history}
              />
            ) : (
              <MinisterialPresentationCard
                lang={subLang}
                onStartAuditNow={() => {
                  const el = document.querySelector('input[type="text"]') as HTMLInputElement;
                  if (el) el.focus();
                }}
              />
            )}

            {/* Founder's Vision (Taha Setri) */}
            <FounderVisionMarquee 
              lang={subLang} 
              onOpenVisionScreen={() => setActiveTab('vision')} 
            />
          </div>
        )}

        {/* Tab: Regulatory Updates (CNDP & Moroccan Privacy Law via Google Search) */}
        {activeTab === 'updates' && (
          <RegulatoryUpdatesTab
            lang={subLang}
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
            lang={subLang}
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
            lang={subLang}
            currentReport={currentReport}
            currentUser={user}
            initialPrompt={dpoConsultationTopic}
          />
        )}

        {/* Tab: Articles of Law Reference (Loi 08-09 & CNDP) */}
        {activeTab === 'articles' && (
          <ArticlesOfLawTab
            lang={subLang}
            currentReport={currentReport}
            selectedArticleId={selectedArticleId}
            onNavigateToRemediation={() => setActiveTab('remediation')}
          />
        )}

        {/* Tab 2: Deep Cookies Audit */}
        {activeTab === 'cookies' && (
          currentReport ? (
            <DeepCookiesAudit
              cookies={currentReport.cookies}
              lang={subLang}
              targetUrl={currentReport.target}
            />
          ) : (
            <div className="space-y-6">
              <AuditScanner
                onScan={handleScan}
                isScanning={isScanning}
                lang={lang}
                defaultTarget={targetInput}
              />
              <div className="p-8 text-center rounded-2xl border border-slate-800 bg-slate-900/60">
                <p className="text-slate-400 text-sm">
                  {lang === 'ar' ? 'يرجى إدخال رابط الموقع أعلاه لتشغيل الفحص التفصيلي لملفات تعريف الارتباط والتعقب' : 'Please enter a website URL above to run the deep cookies audit.'}
                </p>
              </div>
            </div>
          )
        )}

        {/* Tab 3: 30-Day Automated Remediation Plan */}
        {activeTab === 'remediation' && (
          currentReport ? (
            <RemediationPlan
              plan={currentReport.remediationPlan}
              lang={subLang}
              targetDomain={currentReport.domain}
              onDownloadPdf={() => setIsPdfModalOpen(true)}
              report={currentReport}
            />
          ) : (
            <div className="space-y-6">
              <AuditScanner
                onScan={handleScan}
                isScanning={isScanning}
                lang={lang}
                defaultTarget={targetInput}
              />
              <div className="p-8 text-center rounded-2xl border border-slate-800 bg-slate-900/60">
                <p className="text-slate-400 text-sm">
                  {lang === 'ar' ? 'يرجى إدخال رابط الموقع أعلاه لتوليد خطة الـ 30 يوماً التصحيحية المخصصة' : 'Please enter a website URL above to generate the customized 30-day remediation roadmap.'}
                </p>
              </div>
            </div>
          )
        )}

        {/* Tab 4: Data Breach Incident Response Guide */}
        {activeTab === 'breach' && (
          <BreachResponseGuide lang={subLang} />
        )}

        {/* Tab 5: Compliance Comparison Tool */}
        {activeTab === 'compare' && (
          <ComparisonBattle lang={subLang} />
        )}

        {/* Tab 6: Historical Reports & Tracking Evolution */}
        {activeTab === 'history' && (
          <HistoryDashboard
            history={history}
            lang={subLang}
            currentUser={user}
            onSelectReport={(target) => handleScan(target)}
            onSyncCurrentToCloud={handleManualSyncToCloud}
            onDeleteHistoryItem={handleDeleteHistoryItem}
          />
        )}

        {/* Tab 7: Chronological Audit Trail & Accountability Ledger */}
        {activeTab === 'auditTrail' && (
          <AuditTrailTab
            lang={subLang}
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
            lang={subLang}
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
              {isAr ? 'المستشار الذكي DPO (Gemini)' : isFr ? 'Conseiller DPO IA' : 'Ask Gemini DPO Advisor'}
            </span>
          </button>
        </div>
      )}

      {/* Institutional Privacy & Cookies Compliance Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <PrivacyAndCookiesSection lang={subLang} />
      </div>

      {/* Moroccan Legal Reference & Founder Footer */}
      <Footer
        lang={subLang}
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
        lang={subLang}
      />

      {/* Formal PDF Report & 30-Day Plan Modal */}
      {currentReport && (
        <FormalPdfReportModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          report={currentReport}
          user={user}
          lang={subLang}
        />
      )}

      {/* CNDP Official Pre-Declaration Dossier Modal */}
      {currentReport && (
        <CndpDeclarationModal
          isOpen={isCndpModalOpen}
          onClose={() => setIsCndpModalOpen(false)}
          report={currentReport}
          user={user}
          lang={subLang}
        />
      )}

      {/* Sovereign Geolocation & Data Border Residency Map Modal */}
      {currentReport && (
        <SovereignMapModal
          isOpen={isSovereignMapModalOpen}
          onClose={() => setIsSovereignMapModalOpen(false)}
          report={currentReport}
          lang={subLang}
        />
      )}

      {/* CNDP Compliant Cookie Banner Simulator & Injector Modal */}
      {currentReport && (
        <CookieSimulatorModal
          isOpen={isCookieSimulatorModalOpen}
          onClose={() => setIsCookieSimulatorModalOpen(false)}
          report={currentReport}
          lang={subLang}
        />
      )}

      {/* RoPA - Mandatory Statutory Processing Activities Register (Art. 23) */}
      {currentReport && (
        <RopaRegistryModal
          isOpen={isRopaModalOpen}
          onClose={() => setIsRopaModalOpen(false)}
          report={currentReport}
          user={user}
          lang={subLang}
        />
      )}

      {/* DPIA / AIPD - Data Protection Impact Assessment (Art. 12) */}
      {currentReport && (
        <DpiaAssessmentModal
          isOpen={isDpiaModalOpen}
          onClose={() => setIsDpiaModalOpen(false)}
          report={currentReport}
          user={user}
          lang={subLang}
        />
      )}

      {/* Sovereign Trust Seal & Embeddable Verification Badge */}
      {currentReport && (
        <SovereignTrustSealModal
          isOpen={isTrustSealModalOpen}
          onClose={() => setIsTrustSealModalOpen(false)}
          report={currentReport}
          lang={subLang}
        />
      )}

      {/* Continuous Audit Sentinel & Cadence Manager */}
      {currentReport && (
        <ContinuousAuditModal
          isOpen={isContinuousAuditModalOpen}
          onClose={() => setIsContinuousAuditModalOpen(false)}
          report={currentReport}
          user={user}
          lang={subLang}
          onTriggerScan={(domain) => handleScan(domain)}
        />
      )}

      {/* DPO Security Alert Email Notification Modal */}
      <DpoEmailAlertModal
        isOpen={isEmailAlertModalOpen}
        onClose={() => setIsEmailAlertModalOpen(false)}
        dispatchResult={emailDispatchResult}
        lang={subLang}
      />
    </div>
  );
}
