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
    location: string;
    asn: string;
    crossBorderTransferPermitRequired: boolean;
  };
  metrics: {
    tlsGrade: string;
    cndpDeclarationFound: boolean;
    privacyNoticeScore: number;
    cookieConsentScore: number;
    userRightsPortalPresent: boolean;
  };
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

export type GeminiModelChoice = 'gemini-3.5-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite';

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
  | 'AUTH';

export type AuditTrailStatus = 'SUCCESS' | 'ALERT' | 'WARNING' | 'INFO';

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
  metadata?: Record<string, any>;
}

