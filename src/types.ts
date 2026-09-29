export type Language = 'ar' | 'en' | 'fr';
export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface ComplianceGap {
  id: string;
  category: string;
  article: string;
  title: string;
  titleAr: string;
  impact: string;
  recommendation: string;
  severity: SeverityLevel;
  deduction: number;
  penaltyEstimate?: string;
}

export interface ComplianceWarning {
  id: string;
  category: string;
  article: string;
  title: string;
  titleAr: string;
  impact: string;
  recommendation: string;
  severity: 'MEDIUM' | 'LOW';
  deduction: number;
}

export interface CompliancePassedTest {
  id: string;
  title: string;
  titleAr: string;
  article: string;
  detail: string;
}

export interface CookieItem {
  name: string;
  provider: string;
  category: 'Essential' | 'Analytics' | 'Marketing' | 'Functional';
  lifespan: string;
  moroccanLawStatus: 'Exempt' | 'Requires Prior Consent' | 'Non-Compliant Dropped Before Consent';
  risk: 'Low' | 'Medium' | 'High';
  description: string;
}

export interface RemediationTask {
  id: string;
  title: string;
  assignedTo: string;
  duration: string;
  lawRef: string;
  completed?: boolean;
  priority: 'Urgent' | 'High' | 'Normal';
}

export interface RemediationWeek {
  weekNumber: number;
  weekTitle: string;
  weekTitleAr: string;
  phase: string;
  description: string;
  tasks: RemediationTask[];
}

export interface AuditReport {
  id: string;
  target: string;
  domain: string;
  businessName: string;
  timestamp: string;
  score: number;
  status: string;
  statusAr: string;
  statusColor: 'emerald' | 'amber' | 'rose';
  gaps: ComplianceGap[];
  warnings: ComplianceWarning[];
  passed: CompliancePassedTest[];
  cookies: CookieItem[];
  remediationPlan: RemediationWeek[];
  sovereigntyStatus: {
    isMoroccanHosting: boolean;
    isMoroccoHosted?: boolean;
    location: string;
    asn: string;
    crossBorderTransferPermitRequired: boolean;
    ip?: string;
  };
  metrics: {
    tlsGrade: string;
    cndpDeclarationFound: boolean;
    privacyNoticeScore: number;
    cookieConsentScore: number;
    userRightsPortalPresent: boolean;
  };
  techStack?: string;
  isRealScan?: boolean;
  signature?: string;
  serverIp?: string;
  tlsDetails?: {
    protocol?: string;
    issuer?: string;
    validTo?: string;
    cipher?: string;
    authorized?: boolean;
  };
  securityHeaders?: {
    hsts: boolean;
    csp: boolean;
    xFrameOptions: boolean;
    xContentTypeOptions: boolean;
  };
}

export interface BulkScanItemProgress {
  domain: string;
  status: 'PENDING' | 'SCANNING' | 'COMPLETED' | 'FAILED';
  report?: AuditReport;
  error?: string;
}

export interface BulkAuditSummary {
  id: string;
  timestamp: string;
  totalDomains: number;
  averageScore: number;
  compliantCount: number;
  warningCount: number;
  criticalCount: number;
  reports: AuditReport[];
}

export interface AiRemediationOptimization {
  techStack: string;
  targetDomain: string;
  markdownGuide: string;
  codeSnippets: {
    title: string;
    language: string;
    code: string;
    description: string;
  }[];
  customChecklist: {
    phase: string;
    items: string[];
  }[];
}

export interface ScanHistoryItem {
  id: string;
  target: string;
  businessName: string;
  score: number;
  status: string;
  date: string;
  gapsCount: number;
  warningsCount: number;
}

export interface ComparisonResult {
  siteA: AuditReport;
  siteB: AuditReport;
  winner: 'A' | 'B' | 'Tie';
  scoreDifference: number;
  recommendation: string;
  recommendationAr: string;
}

export interface UserAccount {
  uid?: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  company?: string;
  photoURL?: string;
  isFirebaseUser?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  modelUsed?: string;
  attachmentName?: string;
  attachmentPreview?: string;
  isError?: boolean;
}

export interface DpoSecurityAlert {
  id: string;
  userId?: string;
  dpoEmail: string;
  dpoName: string;
  companyName: string;
  targetDomain: string;
  severity: 'CRITICAL' | 'HIGH';
  gapTitle: string;
  gapTitleAr?: string;
  article: string;
  penaltyEstimate?: string;
  recommendation: string;
  recommendationAr?: string;
  sentAt: string;
  status: 'DELIVERED' | 'SIMULATED';
  emailSubject: string;
  emailBodyHtml?: string;
}

export interface DpoEmailNotificationPayload {
  dpoEmail: string;
  dpoName: string;
  companyName: string;
  targetDomain: string;
  auditScore: number;
  criticalGaps: ComplianceGap[];
  highGaps: ComplianceGap[];
}

export type GeminiModelChoice = 
  | 'sovereign-free'
  | 'gemini-3.8-flash' 
  | 'gemini-3.1-flash-lite' 
  | 'gemini-2.5-flash' 
  | 'gemini-3.1-pro-preview';

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface RegulatoryUpdate {
  id: string;
  titleAr: string;
  titleEn: string;
  date: string;
  category: 'CNDP Deliberation' | 'Legislative Reform' | 'Sanctions & Controls' | 'Cloud & Sovereignty' | 'AI & Biometrics' | 'International Standards';
  categoryAr: string;
  impactLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  summaryAr: string;
  summaryEn: string;
  affectedArticles: string[];
  dpoActionRequiredAr: string;
  dpoActionRequiredEn: string;
  officialSource: string;
  sourceUrl?: string;
}

export interface RegulatoryUpdatesResponse {
  success: boolean;
  updates: RegulatoryUpdate[];
  searchQueries: string[];
  sources: GroundingSource[];
  isLiveSearch: boolean;
  timestamp: string;
}

export type AuditTrailCategory = 
  | 'SCAN' 
  | 'EXPORT' 
  | 'ALERT' 
  | 'LEGAL_INQUIRY' 
  | 'DPO_CHAT' 
  | 'REMEDIATION' 
  | 'REGULATORY' 
  | 'AUTH'
  | 'QUANTUM_DEFENSE';

export type AuditTrailStatus = 'SUCCESS' | 'ALERT' | 'WARNING' | 'INFO';

export interface PostQuantumSystemStatus {
  isQuantumReady: boolean;
  quantumDefenseLevel: '100% FORTIFIED' | 'HYBRID_ACTIVE' | 'VULNERABLE';
  standards: {
    kem: string;
    signature: string;
    symmetric: string;
    hashIntegrity: string;
  };
  keyExchange: {
    protocol: string;
    hybridMode: string;
    resistanceToShor: string;
  };
  hndlProtection: {
    status: string;
    forwardSecrecy: string;
    dataRetentionImmunity: string;
  };
  auditChainHash: string;
  verifiedAt: string;
}

export interface AuditTrailEvent {
  id: string;
  timestamp: string; // ISO string
  category: AuditTrailCategory;
  actionTitleAr: string;
  actionTitleEn: string;
  actorName: string;
  actorEmail: string;
  targetResource?: string;
  lawArticleRef?: string;
  status: AuditTrailStatus;
  detailsSummaryAr: string;
  detailsSummaryEn: string;
  quantumHash?: string;
  previousQuantumHash?: string;
  metadata?: Record<string, any>;
}

// -------------------------------------------------------------
// New Sovereign Enterprise Features (RoPA, DPIA, Seal, Cadence)
// -------------------------------------------------------------

export interface RopaActivity {
  id: string;
  name: string;
  nameAr: string;
  purpose: string;
  purposeAr: string;
  legalBasis: 'Consent' | 'Contract' | 'LegalObligation' | 'PublicInterest' | 'VitalInterest';
  legalBasisAr: string;
  law0809Article: string;
  dataCategories: string[];
  dataCategoriesAr: string[];
  dataSubjects: string[];
  dataSubjectsAr: string[];
  recipients: string[];
  recipientsAr: string[];
  retentionPeriod: string;
  retentionPeriodAr: string;
  isCrossBorder: boolean;
  crossBorderCountry?: string;
  securityMeasures: string[];
  securityMeasuresAr: string[];
  status: 'ACTIVE' | 'ARCHIVED' | 'UNDER_REVIEW';
}

export interface DpiaRiskItem {
  id: string;
  category: string;
  categoryAr: string;
  threatDescription: string;
  threatDescriptionAr: string;
  likelihood: 1 | 2 | 3 | 4; // 1: Low, 4: Critical
  severity: 1 | 2 | 3 | 4;   // 1: Low, 4: Critical
  riskScore: number;         // likelihood * severity (1-16)
  mitigationMeasures: string;
  mitigationMeasuresAr: string;
  residualRisk: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface DpiaAssessment {
  id: string;
  targetDomain: string;
  businessName: string;
  date: string;
  assessorName: string;
  assessorRole: string;
  systemDescription: string;
  systemDescriptionAr: string;
  processingNecessity: string;
  processingNecessityAr: string;
  isCndpPriorLicensingRequired: boolean; // Article 12 (Biometrics, Genetic, Health, High risk)
  risks: DpiaRiskItem[];
  overallRiskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  dpoConclusionAr: string;
  dpoConclusionEn: string;
  signatureHash?: string;
}

export interface TrustSealConfig {
  theme: 'emerald' | 'gold' | 'dark' | 'glass';
  size: 'compact' | 'standard' | 'expanded';
  language: 'ar' | 'fr' | 'en';
  showScore: boolean;
  showSignature: boolean;
  showMoroccoFlag: boolean;
}

export interface ContinuousAuditSchedule {
  id: string;
  domain: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  alertEmail: string;
  scoreThresholdAlert: number;
  alertOnNewCookies: boolean;
  alertOnCrossBorderHosting: boolean;
  active: boolean;
  lastRunDate?: string;
  nextRunDate: string;
  historyRunsCount: number;
}



