export interface ProcessingActivity {
  id: string;
  name: string;
  nameAr: string;
  department: string;
  purpose: string;
  purposeAr: string;
  legalBasis: 'CONSENT' | 'LEGAL_OBLIGATION' | 'CONTRACT' | 'LEGITIMATE_INTEREST' | 'PUBLIC_INTEREST';
  dataCategories: string[];
  dataCategoriesAr: string[];
  dataSubjects: string[];
  dataSubjectsAr: string[];
  recipients: string[];
  retentionPeriod: string;
  retentionPeriodAr: string;
  securityMeasures: string[];
  securityMeasuresAr: string[];
  crossBorderTransfer: boolean;
  transferDestination?: string;
  cndpAuthorizationStatus: 'DECLARED' | 'AUTHORIZED' | 'PENDING' | 'EXEMPT';
  cndpDeclarationNumber?: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  lastUpdated: string;
}

export interface DpiaQuestion {
  id: string;
  category: string;
  categoryAr: string;
  question: string;
  questionAr: string;
  description: string;
  descriptionAr: string;
  scoreWeight: number; // 1 to 3
  isTrigger: boolean; // Triggers mandatory CNDP prior authorization
}

export interface DpiaEvaluation {
  id: string;
  projectName: string;
  projectDomain: string;
  conductedBy: string;
  date: string;
  answers: Record<string, boolean>;
  riskScore: number; // 0 - 100
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  priorAuthRequired: boolean;
  applicableArticles: string[];
  recommendations: {
    titleAr: string;
    titleEn: string;
    detailsAr: string;
    detailsEn: string;
    lawRef: string;
  }[];
}

export interface SubjectRightTemplate {
  id: string;
  titleAr: string;
  titleEn: string;
  lawArticle: string;
  category: 'ACCESS' | 'RECTIFICATION' | 'OPPOSITION' | 'ERASURE' | 'CONSENT_WITHDRAWAL';
  descriptionAr: string;
  descriptionEn: string;
  slaDays: number;
  templateType: 'REQUEST_FORM' | 'OFFICIAL_RESPONSE' | 'EMPLOYEE_NOTICE';
  frenchText: string;
  arabicText: string;
}
