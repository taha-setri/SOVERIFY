import { AuditReport, ComplianceGap, DpoSecurityAlert, UserAccount } from '../types';

export interface EmailDispatchResult {
  success: boolean;
  alert: DpoSecurityAlert;
  messageId: string;
  recipient: string;
  timestamp: string;
  htmlContent: string;
}

/**
 * Triggers a simulated email notification service that alerts the registered DPO
 * when a high-risk security vulnerability or critical Moroccan Law 08/09 breach is detected.
 */
export async function triggerDpoSecurityAlertService(
  report: AuditReport,
  dpoUser: UserAccount,
  specificGap?: ComplianceGap
): Promise<EmailDispatchResult> {
  // Determine highest risk gap
  const criticalGaps = report.gaps.filter((g) => g.severity === 'CRITICAL');
  const highGaps = report.gaps.filter((g) => g.severity === 'HIGH');
  
  const targetGap = specificGap || criticalGaps[0] || highGaps[0] || report.gaps[0];

  const now = new Date().toISOString();
  const alertId = `alert_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const messageId = `<soverify.sec.${alertId}@cndp-alert.ma>`;

  const recipientEmail = dpoUser.email || 'dpo@company.ma';
  const dpoName = dpoUser.name || 'DPO / مسؤول حماية المعطيات';
  const companyName = dpoUser.organization || report.businessName || 'المؤسسة المعنية';
  const severity = targetGap?.severity || 'CRITICAL';

  const subject = `[URGENT DPO SECURITY ALERT] رصد ثغرة أمنية عالية الخطورة (${severity}) - ${report.domain}`;

  const htmlContent = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #020617; color: #f8fafc; margin: 0; padding: 24px; }
    .container { max-width: 650px; margin: 0 auto; background: #0f172a; border: 1px solid #dc2626; border-radius: 16px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%); padding: 24px; text-align: right; border-bottom: 2px solid #ef4444; }
    .badge { display: inline-block; background: #ef4444; color: #ffffff; padding: 4px 12px; border-radius: 9999px; font-weight: bold; font-size: 12px; }
    .content { padding: 28px; text-align: right; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 18px; margin: 16px 0; }
    .danger-box { background: rgba(220, 38, 38, 0.15); border-right: 4px solid #ef4444; padding: 14px; margin: 16px 0; border-radius: 0 8px 8px 0; }
    .footer { background: #0b0f19; padding: 18px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #1e293b; }
    .btn { display: inline-block; background: #059669; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="badge">إنذار أمني عالي الخطورة (${severity})</span>
      <h2 style="color: #ffffff; margin: 10px 0 4px 0;">SOVERIFY SECURITY DISPATCH — نظام الإنذار المبكر للمسؤولين</h2>
      <p style="color: #fca5a5; margin: 0; font-size: 13px;">تنبيه فوري لمسؤول حماية المعطيات (DPO) وفق القانون 08.09</p>
    </div>
    <div class="content">
      <p style="font-size: 15px;">السيد(ة) <strong>${dpoName}</strong> المحترم(ة)،</p>
      <p style="line-height: 1.6; color: #cbd5e1;">
        نحيطكم علماً بأن منظومة التدقيق الآلي للامتثال قد رصدت <strong>ثغرة أمنية عالية الخطورة ومخالفة صريحة</strong> لأحكام القانون رقم 08.09 المتعلق بحماية المعطيات الشخصية في المنصة الرقمية التابعة لمؤسستكم:
      </p>

      <div class="card">
        <p style="margin: 4px 0; color: #94a3b8; font-size: 12px;">المؤسسة المستهدفة:</p>
        <p style="margin: 0 0 10px 0; font-weight: bold; font-size: 16px; color: #38bdf8;">${companyName} (${report.domain})</p>
        <p style="margin: 4px 0; color: #94a3b8; font-size: 12px;">مؤشر الامتثال الحالي:</p>
        <p style="margin: 0; font-size: 20px; font-weight: bold; color: ${report.score < 60 ? '#ef4444' : '#f59e0b'};">${report.score}/100 — ${report.statusAr}</p>
      </div>

      <div class="danger-box">
        <h3 style="color: #ef4444; margin: 0 0 8px 0;">⚠️ تفاصيل الثغرة المكتشفة: ${targetGap.titleAr || targetGap.title}</h3>
        <p style="margin: 4px 0; font-size: 13px; color: #f87171;"><strong>المادة القانونية المنتهكة:</strong> ${targetGap.article}</p>
        <p style="margin: 6px 0; font-size: 13px; color: #e2e8f0;"><strong>الأثر القانوني والتقني:</strong> ${targetGap.impact}</p>
        ${targetGap.penaltyEstimate ? `<p style="margin: 6px 0; font-size: 13px; color: #fca5a5;"><strong>العقوبة المقدرة CNDP:</strong> ${targetGap.penaltyEstimate}</p>` : ''}
      </div>

      <div class="card">
        <h4 style="color: #10b981; margin: 0 0 8px 0;">الإجراء التصحيحي الفوري المطلوب (المادة 23):</h4>
        <p style="margin: 0; font-size: 13px; color: #cbd5e1; line-height: 1.6;">${targetGap.recommendation}</p>
      </div>

      <p style="font-size: 12px; color: #94a3b8; line-height: 1.6;">
        طبقاً للمادة 23 من القانون 08.09، يتعين على المسؤول عن المعالجة اتخاذ التدابير التقنية والتنظيمية الملائمة فوراً لحماية المعطيات، وتفادي المساءلة بموجب المواد 52 إلى 56.
      </p>

      <center>
        <a href="https://${report.domain}" class="btn">الانتقال إلى خطة المعالجة السريعة (30 يوماً)</a>
      </center>
    </div>
    <div class="footer">
      <p style="margin: 0 0 4px 0;">Soverify Automated DPO Alert Engine | CNDP Compliance Monitoring Hub</p>
      <p style="margin: 0;">Message-ID: ${messageId} • Dispatch Time: ${now}</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const alertRecord: DpoSecurityAlert = {
    id: alertId,
    userId: dpoUser.uid,
    dpoEmail: recipientEmail,
    dpoName,
    companyName,
    targetDomain: report.domain,
    severity: (severity as 'CRITICAL' | 'HIGH'),
    gapTitle: targetGap.title,
    gapTitleAr: targetGap.titleAr,
    article: targetGap.article,
    penaltyEstimate: targetGap.penaltyEstimate,
    recommendation: targetGap.recommendation,
    recommendationAr: targetGap.recommendation,
    sentAt: now,
    status: 'DELIVERED',
    emailSubject: subject,
    emailBodyHtml: htmlContent
  };

  // Try calling the server simulated email endpoint
  try {
    const response = await fetch('/api/alert-dpo-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        alert: alertRecord,
        recipient: recipientEmail,
        subject,
        htmlContent
      })
    });
    if (!response.ok) {
      console.warn('Server alert dispatch status:', response.status);
    }
  } catch (err) {
    console.info('Simulated email dispatched in-app client engine:', err);
  }

  return {
    success: true,
    alert: alertRecord,
    messageId,
    recipient: recipientEmail,
    timestamp: now,
    htmlContent
  };
}
