import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Scale, 
  AlertTriangle, 
  CheckCircle2, 
  Printer, 
  X, 
  FileText, 
  Sliders, 
  HelpCircle,
  Lock,
  Cpu,
  Fingerprint,
  Building2,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { AuditReport, DpiaAssessment, DpiaRiskItem, UserAccount } from '../types';

interface DpiaAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: AuditReport;
  user: UserAccount | null;
  lang: 'ar' | 'en';
}

export const DpiaAssessmentModal: React.FC<DpiaAssessmentModalProps> = ({
  isOpen,
  onClose,
  report,
  user,
  lang: initialLang
}) => {
  const [lang, setLang] = useState<'ar' | 'fr'>(initialLang === 'ar' ? 'ar' : 'fr');
  const isAr = lang === 'ar';

  // High Risk Criteria Checkers (Article 12 of Law 08-09)
  const [hasBiometricOrHealth, setHasBiometricOrHealth] = useState(false);
  const [hasAutomatedProfiling, setHasAutomatedProfiling] = useState(
    report.cookies.some(c => c.category === 'Marketing')
  );
  const [hasLargeScaleData, setHasLargeScaleData] = useState(true);
  const [hasCrossBorderCloud, setHasCrossBorderCloud] = useState(
    !report.sovereigntyStatus.isMoroccoHosted
  );

  // Dynamic Risk List
  const [risks, setRisks] = useState<DpiaRiskItem[]>([
    {
      id: 'risk-1',
      category: 'Data Breach & Exfiltration',
      categoryAr: 'تسريب واختراق المعطيات الشخصية عبر الشبكة',
      threatDescription: 'Unauthorized interception of sensitive user packets in transit or server misconfiguration.',
      threatDescriptionAr: 'اعتراض غير مصرح به لحزم المعطيات أثناء النقل أو استغلال ثغرات بالخادم.',
      likelihood: report.metrics.tlsGrade.startsWith('A') ? 2 : 3,
      severity: 3,
      riskScore: (report.metrics.tlsGrade.startsWith('A') ? 2 : 3) * 3,
      mitigationMeasures: 'Deploy strict HSTS, TLS 1.3 with Post-Quantum NIST ML-KEM-768 cipher suites and Web Application Firewall.',
      mitigationMeasuresAr: 'تفعيل HSTS الإلزامي، تشفير TLS 1.3 مدعوم بدرع NIST للكم ML-KEM وجدار ناري WAF.',
      residualRisk: 'Low'
    },
    {
      id: 'risk-2',
      category: 'Cookie Tracking Without Prior Consent',
      categoryAr: 'تتبع المستخدمين بملفات تعريف الارتباط قبل الموافقة الصريحة',
      threatDescription: 'Third-party adtech dropping trackers violating CNDP Deliberation 08-2020.',
      threatDescriptionAr: 'إيداع برمجيات تتبع تسويقية قبل نقر الزائر على زر الموافقة في لافتة الكوكيز.',
      likelihood: report.cookies.some(c => c.moroccanLawStatus.includes('Non-Compliant')) ? 4 : 1,
      severity: 3,
      riskScore: (report.cookies.some(c => c.moroccanLawStatus.includes('Non-Compliant')) ? 4 : 1) * 3,
      mitigationMeasures: 'Implement zero-cookie gatekeeper script, block Google/Meta tags until explicit opt-in.',
      mitigationMeasuresAr: 'اعتماد سكريبت الحظر المسبق التام وعدم تمرير أي بيكسل إعلاني إلا بعد الموافقة.',
      residualRisk: 'Low'
    },
    {
      id: 'risk-3',
      category: 'Cross-Border Jurisdiction Conflict (Cloud Act / FISA)',
      categoryAr: 'نقل المعطيات خارج السيادة الوطنية والتعرض للقوانين الأجنبية',
      threatDescription: 'Hosting personal data on foreign servers without CNDP Article 63 formal authorization.',
      threatDescriptionAr: 'استضافة معطيات المغاربة في خوادم أجنبية دون ترخيص استثنائي من اللجنة CNDP.',
      likelihood: report.sovereigntyStatus.isMoroccoHosted ? 1 : 4,
      severity: 4,
      riskScore: (report.sovereigntyStatus.isMoroccoHosted ? 1 : 4) * 4,
      mitigationMeasures: 'Migrate core databases to sovereign datacenters in Morocco (Maroc Telecom / inwi / N+ONE).',
      mitigationMeasuresAr: 'نقل قواعد البيانات إلى مراكز بيانات سيادية معتمدة داخل التراب الوطني.',
      residualRisk: report.sovereigntyStatus.isMoroccoHosted ? 'Low' : 'High'
    }
  ]);

  if (!isOpen) return null;

  const isPriorAuthMandatory = hasBiometricOrHealth || (hasCrossBorderCloud && hasLargeScaleData);
  const totalRiskScore = risks.reduce((acc, r) => acc + r.riskScore, 0);
  const overallRiskLevel = totalRiskScore > 25 ? 'CRITICAL' : totalRiskScore > 16 ? 'HIGH' : totalRiskScore > 10 ? 'MODERATE' : 'LOW';

  const updateRisk = (id: string, likelihood: number, severity: number) => {
    setRisks(risks.map(r => {
      if (r.id === id) {
        const score = likelihood * severity;
        const residual = score >= 12 ? 'Critical' : score >= 8 ? 'High' : score >= 4 ? 'Medium' : 'Low';
        return {
          ...r,
          likelihood: likelihood as any,
          severity: severity as any,
          riskScore: score,
          residualRisk: residual
        };
      }
      return r;
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4 sm:p-5 bg-slate-950/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-mono">
                  {isAr ? 'تقييم أثر حماية المعطيات الشخصية (AIPD / DPIA)' : 'Data Protection Impact Assessment (AIPD)'}
                </h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  overallRiskLevel === 'LOW' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                  overallRiskLevel === 'MODERATE' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  'bg-rose-950 text-rose-300 border border-rose-800'
                }`}>
                  {isAr ? `مستوى الخطر الكلي: ${overallRiskLevel}` : `Overall Risk: ${overallRiskLevel}`}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isAr 
                  ? `دراسة المخاطر والتناسب لنظام: ${report.businessName || report.domain} بموجب القانون 08-09` 
                  : `Proportionality & Risk Assessment under Moroccan Law 08-09 for: ${report.domain}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === 'ar' ? 'fr' : 'ar')}
              className="px-2.5 py-1 text-xs rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-white font-mono"
            >
              {lang === 'ar' ? 'Français' : 'العربية'}
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
          
          {/* Article 12 CNDP Prior Authorization Verdict Card */}
          <div className={`p-4 rounded-xl border ${
            isPriorAuthMandatory 
              ? 'bg-rose-950/30 border-rose-500/40 text-rose-200' 
              : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
          }`}>
            <div className="flex items-start gap-3">
              {isPriorAuthMandatory ? (
                <ShieldAlert className="h-6 w-6 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <h4 className="text-sm font-bold">
                  {isPriorAuthMandatory 
                    ? (isAr ? 'تنبيه نظامي: يتطلب ترخيصاً مسبقاً (Autorisation Préalable) من CNDP بموجب المادة 12' : 'CNDP Prior Authorization Required under Article 12')
                    : (isAr ? 'يكتفي بإشعار وتصريح مسبق عادي (Déclaration Préalable) وفق المادة 12' : 'Standard Prior Declaration Sufficient under Law 08/09')}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isPriorAuthMandatory
                    ? (isAr 
                        ? 'نظراً لاحتواء النظام على معطيات حساسة، أو نقلاً دولياً للبيانات، يمنع تشغيل المعالجة دون ترخيص رسمي مكتوب ومسبق من اللجنة الوطنية لضمان عدم التعرض لعقوبات الحبس والغرامات بالمادتين 52 و53.'
                        : 'Because the processing involves high-risk factors or cross-border transfer, prior formal authorization from CNDP is required before deployment.')
                    : (isAr 
                        ? 'المعالجة تندرج ضمن الأنشطة الاعتيادية ولا تتطلب رخصة استثنائية، شريطة إيداع التصريح المسبق وحفظ سجل المعالجة وتأمين التشفير.'
                        : 'Standard declaration is sufficient provided security measures, encryption, and RoPA register are maintained.')}
                </p>
              </div>
            </div>
          </div>

          {/* High-Risk Triggers Checklist */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
              <Layers className="h-4 w-4 text-emerald-400" />
              {isAr ? 'عوامل الخطورة المرتفعة وفق المادة 12 والممارسات الفضلى لـ CNDP:' : 'High-Risk Trigger Criteria:'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-800 bg-slate-900 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={hasBiometricOrHealth}
                  onChange={(e) => setHasBiometricOrHealth(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                />
                <span className="text-slate-300">
                  {isAr ? 'معطيات بيومترية، صحية، أو جينات وراثية (المادة 12)' : 'Biometric, health, or genetic data'}
                </span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-800 bg-slate-900 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={hasAutomatedProfiling}
                  onChange={(e) => setHasAutomatedProfiling(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                />
                <span className="text-slate-300">
                  {isAr ? 'تنميط آلي أو كوكيز إعلانية سلوكية مكثفة' : 'Automated profiling or tracking cookies'}
                </span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-800 bg-slate-900 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={hasLargeScaleData}
                  onChange={(e) => setHasLargeScaleData(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                />
                <span className="text-slate-300">
                  {isAr ? 'معالجة واسعة النطاق تشمل آلاف المواطنين المغاربة' : 'Large-scale processing of citizen data'}
                </span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-800 bg-slate-900 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={hasCrossBorderCloud}
                  onChange={(e) => setHasCrossBorderCloud(e.target.checked)}
                  className="rounded border-slate-700 text-emerald-500 focus:ring-0"
                />
                <span className="text-slate-300">
                  {isAr ? 'استضافة سحابية خارج التراب الوطني (المادة 63)' : 'Cross-border cloud data hosting (Art. 63)'}
                </span>
              </label>
            </div>
          </div>

          {/* Risk Scoring & Threat Matrix */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                <Sliders className="h-4 w-4 text-emerald-400" />
                {isAr ? 'مصفوفة تحليل المخاطر والتدابير المضادة (Risk Matrix):' : 'Risk & Mitigation Matrix:'}
              </h4>
              <span className="text-xs font-mono text-slate-400">
                {isAr ? 'الاحتمالية × الشدة = درجة الخطر' : 'Likelihood x Severity = Score'}
              </span>
            </div>

            <div className="space-y-3">
              {risks.map((risk) => (
                <div key={risk.id} className="p-4 rounded-xl border border-slate-800 bg-slate-950/70 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-white">
                        {isAr ? risk.categoryAr : risk.category}
                      </span>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {isAr ? risk.threatDescriptionAr : risk.threatDescription}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        risk.residualRisk === 'Low' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        risk.residualRisk === 'Medium' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}>
                        {isAr ? `الخطر المتبقي: ${risk.residualRisk}` : `Residual: ${risk.residualRisk}`} ({risk.riskScore}/16)
                      </span>
                    </div>
                  </div>

                  {/* Sliders for Likelihood & Severity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>{isAr ? 'الاحتمالية (Likelihood):' : 'Likelihood:'}</span>
                        <span className="font-mono text-white font-bold">{risk.likelihood} / 4</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="4"
                        value={risk.likelihood}
                        onChange={(e) => updateRisk(risk.id, parseInt(e.target.value), risk.severity)}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>{isAr ? 'الشدة والوقع (Severity):' : 'Severity:'}</span>
                        <span className="font-mono text-white font-bold">{risk.severity} / 4</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="4"
                        value={risk.severity}
                        onChange={(e) => updateRisk(risk.id, risk.likelihood, parseInt(e.target.value))}
                        className="w-full accent-purple-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Mitigation plan */}
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                    <Lock className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-emerald-400">{isAr ? 'الإجراء الوقائي المعتمد: ' : 'Mitigation: '}</strong>
                      {isAr ? risk.mitigationMeasuresAr : risk.mitigationMeasures}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DPO Signature & Endorsement */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                <Fingerprint className="h-4 w-4 text-emerald-400" />
                {isAr ? 'اعتماد مسؤول حماية المعطيات (DPO Endorsement):' : 'DPO Official Opinion:'}
              </span>
              <p className="text-xs text-slate-300">
                {isAr 
                  ? `أشهد أنا ${user?.name || 'طه الستري'}، بصفتي DPO، أن التدابير التقنية والتنظيمية المبرمجة كافية ومناسبة لتأمين المعالجة وفق القانون 08-09.` 
                  : `Certified that organizational & technical measures are compliant with Moroccan data sovereignty standards.`}
              </p>
            </div>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg transition"
            >
              <Printer className="h-4 w-4" />
              <span>{isAr ? 'طباعة تقرير دراسة الأثر (PDF)' : 'Print DPIA Report'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
