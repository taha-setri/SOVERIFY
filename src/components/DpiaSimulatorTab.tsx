import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  RefreshCw, 
  Download, 
  BookOpen, 
  FileCheck,
  Scale,
  Sparkles,
  Bot
} from 'lucide-react';
import { DPIA_ASSESSMENT_QUESTIONS } from '../data/dpiaAndRightsData';
import { DpiaEvaluation } from '../types/enterpriseFeatures';

interface DpiaSimulatorTabProps {
  lang: 'ar' | 'en';
  onConsultDpo?: (topic?: string) => void;
  onNavigateToArticles?: (articleId?: string) => void;
}

export const DpiaSimulatorTab: React.FC<DpiaSimulatorTabProps> = ({
  lang,
  onConsultDpo,
  onNavigateToArticles
}) => {
  const isAr = lang === 'ar';
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [projectName, setProjectName] = useState('منظومة معالجة جديدة (New System)');
  const [projectDomain, setProjectDomain] = useState('enterprise.ma');
  const [hasEvaluated, setHasEvaluated] = useState(false);

  const handleToggle = (id: string, value: boolean) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const calculateResult = (): DpiaEvaluation => {
    let rawScore = 0;
    let priorAuthRequired = false;
    const applicableArticles: string[] = ['المادة 12', 'المادة 23'];

    DPIA_ASSESSMENT_QUESTIONS.forEach(q => {
      const isYes = answers[q.id] === true;
      if (isYes) {
        rawScore += q.scoreWeight * 18;
        if (q.isTrigger) {
          priorAuthRequired = true;
          if (q.id === 'dpia-q1') applicableArticles.push('المادة 12 (البيومترية)');
          if (q.id === 'dpia-q2') applicableArticles.push('المادتان 43 و44 (نقل المعطيات للخارج)');
          if (q.id === 'dpia-q3') applicableArticles.push('قرار CNDP 455-2014 (كاميرات وتتبع)');
          if (q.id === 'dpia-q4') applicableArticles.push('المادة 21 (المعطيات الحساسة)');
        }
      }
    });

    const riskScore = Math.min(100, Math.max(10, rawScore));
    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (riskScore >= 75) riskLevel = 'CRITICAL';
    else if (riskScore >= 50) riskLevel = 'HIGH';
    else if (riskScore >= 25) riskLevel = 'MEDIUM';

    const recommendations = [];
    if (priorAuthRequired) {
      recommendations.push({
        titleAr: 'إلزامية تقديم طلب ترخيص مسبق لدى CNDP (Demande d’Autorisation Préalable)',
        titleEn: 'Mandatory CNDP Prior Authorization Required',
        detailsAr: 'نظراً لاحتواء المشروع على معطيات حساسة، بيومترية أو نقلاً خارج الحدود؛ يمنع الشروع في المعالجة قبل صدور قرار الترخيص الرسمي من CNDP.',
        detailsEn: 'Do not commence processing until explicit written authorization is rendered by the National Privacy Commission (CNDP).',
        lawRef: 'المادة 12 و13 من القانون 08-09'
      });
    }

    if (answers['dpia-q2']) {
      recommendations.push({
        titleAr: 'توطين المعطيات داخل المملكة أو إبرام عقود نقل نموذجية (Standard Clauses)',
        titleEn: 'Enforce Sovereign Data Localization or CNDP Cross-Border Permitting',
        detailsAr: 'يوصى بنقل قواعد البيانات إلى مراكز بيانات سيادية مغربية (Maroc Telecom, Inwi, Medasys) لتجنب التعقيدات القانونية.',
        detailsEn: 'Migrate hosting to sovereign Moroccan data centers or submit formal bilateral standard contractual clauses.',
        lawRef: 'المادة 44'
      });
    }

    recommendations.push({
      titleAr: 'تضمين بنود الشفافية وإشعار الأشخاص المعنيين (Art 5 Notice)',
      titleEn: 'Implement Transparent Privacy Notice & Purpose Specification',
      detailsAr: 'تحديث سياسة الخصوصية واستمارات التسجيل لتتضمن الغاية، هوية مسؤول المعالجة، وسبل ممارسة حقوق الولوج والتعرض.',
      detailsEn: 'Update data collection forms with controller identity, strict purposes, and subject rights contact points.',
      lawRef: 'المادة 5'
    });

    return {
      id: `dpia-${Date.now()}`,
      projectName,
      projectDomain,
      conductedBy: 'Soverify Enterprise Engine',
      date: new Date().toISOString().substring(0, 10),
      answers,
      riskScore,
      riskLevel,
      priorAuthRequired,
      applicableArticles: Array.from(new Set(applicableArticles)),
      recommendations
    };
  };

  const evaluation = calculateResult();

  const handleReset = () => {
    setAnswers({});
    setHasEvaluated(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl border border-sky-500/30 bg-gradient-to-br from-sky-950/60 via-slate-900 to-slate-950 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-lg border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-xs font-mono font-bold text-sky-400">
              <Scale className="h-4 w-4" />
              <span>{isAr ? 'تقييم الأثر على الخصوصية (AIPD / DPIA)' : 'Data Protection Impact Assessment'}</span>
            </div>
            <h2 className="text-2xl font-black text-white font-mono flex items-center gap-2">
              {isAr ? 'محاكي تقييم الأثر والمخاطر وفق معايير CNDP' : 'Moroccan CNDP DPIA & Risk Assessment Simulator'}
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isAr
                ? 'استبيان تشخيصي رسمي يحدد هل مشروعك الرقمي أو التقني يتطلب إذناً مسبقاً (Autorisation) من CNDP أم مجرد تصريح عادي (Déclaration)، مع احتساب مؤشر المخاطر.'
                : 'Determine whether your digital or algorithmic system necessitates CNDP Prior Authorization or standard declaration under Law 08-09.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700 transition"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>{isAr ? 'إعادة التعيين' : 'Reset'}</span>
            </button>
            <button
              onClick={() => setHasEvaluated(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-teal-400 px-5 py-2.5 text-xs font-bold text-slate-950 hover:from-sky-400 transition shadow-lg shadow-sky-500/20"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isAr ? 'تحليل واعتماد النتيجة' : 'Generate Assessment'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Project Meta Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1">{isAr ? 'اسم المشروع أو النظام التقني:' : 'System / Project Name:'}</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-400 mb-1">{isAr ? 'النطاق / المؤسسة:' : 'Target Organization / Domain:'}</label>
          <input
            type="text"
            value={projectDomain}
            onChange={(e) => setProjectDomain(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white font-mono"
          />
        </div>
      </div>

      {/* Questionnaire Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <FileCheck className="h-4 w-4 text-sky-400" />
          <span>{isAr ? 'المعايير التشخيصية الستة لتحديد المخاطر والمسار الإداري:' : 'Six Statutory Criteria for CNDP Classification:'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DPIA_ASSESSMENT_QUESTIONS.map((q, idx) => {
            const isChecked = answers[q.id] === true;
            return (
              <div
                key={q.id}
                className={`rounded-xl border p-4 transition flex flex-col justify-between space-y-3 ${
                  isChecked
                    ? 'border-red-500/40 bg-red-950/20'
                    : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300">
                      #{idx + 1} · {isAr ? q.categoryAr : q.category}
                    </span>
                    {q.isTrigger && (
                      <span className="text-[10px] font-mono font-bold text-amber-400 border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 rounded">
                        {isAr ? 'موجب للترخيص المسبق' : 'Prior Auth Trigger'}
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-white leading-relaxed">
                    {isAr ? q.questionAr : q.question}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    {isAr ? q.descriptionAr : q.description}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/60">
                  <button
                    type="button"
                    onClick={() => handleToggle(q.id, false)}
                    className={`px-3 py-1 text-xs rounded-lg font-semibold transition ${
                      answers[q.id] === false
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {isAr ? 'لا (Non)' : 'No'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggle(q.id, true)}
                    className={`px-3 py-1 text-xs rounded-lg font-bold transition ${
                      answers[q.id] === true
                        ? 'bg-red-500 text-white shadow-md shadow-red-500/30'
                        : 'border border-slate-700 text-slate-300 hover:border-red-500/50 hover:text-red-400'
                    }`}
                  >
                    {isAr ? 'نعم (Oui)' : 'Yes'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Evaluation Results Box */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">
              {isAr ? 'خلاصة تقييم الأثر القانوني' : 'Assessment Outcome Summary'}
            </span>
            <h3 className="text-xl font-black text-white font-mono mt-0.5">
              {projectName} · ({projectDomain})
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-xl border text-center ${
              evaluation.riskLevel === 'CRITICAL'
                ? 'border-red-500/40 bg-red-950/40 text-red-300'
                : evaluation.riskLevel === 'HIGH'
                ? 'border-amber-500/40 bg-amber-950/40 text-amber-300'
                : 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300'
            }`}>
              <span className="text-[10px] block font-mono opacity-80">{isAr ? 'مستوى المخاطر' : 'Risk Level'}</span>
              <span className="text-base font-black font-mono">{evaluation.riskLevel}</span>
            </div>

            <div className={`px-4 py-2 rounded-xl border text-center ${
              evaluation.priorAuthRequired
                ? 'border-red-500/50 bg-red-500/10 text-red-400'
                : 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
            }`}>
              <span className="text-[10px] block font-mono opacity-80">{isAr ? 'المسار القانوني لدى CNDP' : 'CNDP Track'}</span>
              <span className="text-xs font-black">
                {evaluation.priorAuthRequired 
                  ? (isAr ? '⚠️ إذن مسبق إلزامي (Autorisation)' : '⚠️ Prior Authorization Required')
                  : (isAr ? '✓ تصريح عادي مسبق (Déclaration)' : '✓ Standard Declaration Track')}
              </span>
            </div>
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{isAr ? 'التدابير الإلزامية وخارطة الطريق النظامية:' : 'Statutory Roadmap & Mitigation Actions:'}</span>
          </h4>

          <div className="grid grid-cols-1 gap-3">
            {evaluation.recommendations.map((rec, i) => (
              <div key={i} className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-white">
                    {isAr ? rec.titleAr : rec.titleEn}
                  </h5>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                    {rec.lawRef}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {isAr ? rec.detailsAr : rec.detailsEn}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            {isAr 
              ? 'هل تحتاج لمساعدة في صياغة ملف الترخيص المسبق وإيداعه لدى مقر CNDP بالرباط؟'
              : 'Need assistance preparing and submitting your formal authorization dossier to CNDP Rabat?'}
          </div>

          <div className="flex items-center gap-2">
            {onConsultDpo && (
              <button
                onClick={() => onConsultDpo(`استشارة حول تقييم الأثر AIPD لمشروع: ${projectName}`)}
                className="flex items-center gap-1.5 rounded-lg border border-sky-500/40 bg-sky-950/60 px-3 py-1.5 text-xs font-semibold text-sky-200 hover:text-white"
              >
                <Bot className="h-3.5 w-3.5" />
                <span>{isAr ? 'استشارة الـ DPO الذكي' : 'Consult AI DPO'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
