import { GoogleGenAI } from '@google/genai';
import { AiRemediationOptimization } from '../src/types';

interface OptimizeInput {
  targetDomain: string;
  techStack: string;
  score: number;
  gaps: any[];
  warnings: any[];
}

export async function generateTechStackRemediation(
  ai: GoogleGenAI | null,
  input: OptimizeInput
): Promise<AiRemediationOptimization> {
  const { targetDomain, techStack, score, gaps, warnings } = input;

  // Curated Fallbacks if Gemini is offline or API key missing
  const fallbackOptimization: AiRemediationOptimization = {
    techStack: techStack || 'WordPress / Generic Web Stack',
    targetDomain,
    markdownGuide: `### خطة المعالجة التقنية المحسنة لبيئة ${techStack || 'WordPress / Web Application'}

وفقاً لمقتضيات **القانون رقم 08.09** ومداولة **CNDP رقم 08-2020**، إليك خطوات التنفيذ البرمجية المباشرة لسد الثغرات المكتشفة في (${targetDomain}):

1. **حجب ملفات التتبع قبل الموافقة الصريحة**: تمنع المداولة 08-2020 إطلاق أي سكريبت تحليلي أو تسويقي (مثل Google Analytics أو Meta Pixel) قبل نقر الزائر على زر "قبول".
2. **فرض التشفير الصارم وترويسات الأمان (المادة 23)**: تكوين خادم الويب ببروتوكول TLS 1.3 مع ترويسة HSTS لمنع هجمات التجريد.
3. **توطيد بوابة ممارسة حقوق الأفراد (المادتان 13 و14)**: توفير مسار برمجي مؤتمت لاستقبال طلبات الولوج والتصحيح مع إشعار تلقائي لـ DPO.`,
    codeSnippets: [
      {
        title: techStack.includes('WordPress')
          ? 'WordPress: functions.php - CNDP Prior Consent Filter'
          : techStack.includes('Next') || techStack.includes('React')
          ? 'Next.js / React: CndpConsentGate.tsx Component'
          : 'Server / Middleware: CNDP Tracking Gate',
        language: techStack.includes('WordPress') ? 'php' : 'typescript',
        code: techStack.includes('WordPress')
          ? `// WordPress Theme functions.php: Block Analytics until CNDP consent
add_action('wp_enqueue_scripts', function() {
    // Only load GA4 if explicit consent cookie exists
    if (!isset($_COOKIE['cndp_consent_choice']) || $_COOKIE['cndp_consent_choice'] !== 'accepted') {
        wp_dequeue_script('google-analytics');
        wp_dequeue_script('facebook-pixel');
    }
}, 999);`
          : `'use client';
import { useEffect, useState } from 'react';
import Script from 'next/script';

export function CndpConsentGate() {
  const [consentGranted, setConsentGranted] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cndp_consent_status');
    if (consent === 'granted') setConsentGranted(true);
  }, []);

  if (!consentGranted) return null;

  return (
    <Script
      src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"
      strategy="afterInteractive"
    />
  );
}`,
        description: 'يضمن عدم تنزيل أي كوكيز تتبعية قبل موافقة المستخدم الصريحة وفق مداولة CNDP رقم 08-2020.'
      },
      {
        title: 'Nginx / Apache: TLS 1.3 & HSTS Security Headers (Article 23)',
        language: 'nginx',
        code: `# Nginx VirtualHost Configuration for Morocco Law 08-09 Art. 23
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers off;

# Strict Transport Security (HSTS) - 1 Year + Subdomains
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# Content Security Policy & Anti-Clickjacking
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;`,
        description: 'تطبيق أحدث معايير التشفير والسرية للامتثال للمادة 23 من القانون 08.09.'
      },
      {
        title: 'API / Backend: Data Subject Rights Verification Endpoint (Art. 13 & 14)',
        language: 'typescript',
        code: `// Express / Node.js API Route for Data Subject Requests (DSR)
app.post('/api/cndp/exercise-rights', async (req, res) => {
  const { cinNumber, fullName, requestType, email } = req.body;
  // Verify Moroccan National ID (CIN) format and log in ROPA audit trail
  const ticketId = 'CNDP-DSR-' + Date.now();
  console.log(\`[DSR INTAKE] Ticket \${ticketId} for \${fullName} (\${requestType})\`);
  
  // Mandatory legal SLA under Law 08-09: Respond within 30 days
  res.json({ success: true, ticketId, statutoryDeadlineDays: 30 });
});`,
        description: 'مسار معالجة طلبات ممارسة حق الولوج والتصحيح مع الالتزام بالمهلة القانونية (30 يوماً).'
      }
    ],
    customChecklist: [
      {
        phase: 'المرحلة 1 (الأسبوع الأول): الحماية الحرجة والإشعار',
        items: [
          'تحديث شهادة SSL وتفعيل TLS 1.3 وترويسة HSTS لمنع الهجمات.',
          'إيداع إشعار التصريح المسبق D-1 لدى CNDP وإبراز رقم الوصل في التذييل.'
        ]
      },
      {
        phase: 'المرحلة 2 (الأسبوع الثاني): إدارة الموافقة والكوكيز',
        items: [
          'تطبيق كود الحجب المسبق للسكريبتات التحليلية والإعلانية.',
          'توفير زر "رفض الكل" بنفس الحجم والوضوح في لافتة الكوكيز.'
        ]
      },
      {
        phase: 'المرحلة 3 (الأسبوع الثالث): الاستضافة والسيادة',
        items: [
          'حصر الخدمات السحابية الخارجية وتقديم طلب ترخيص النقل بموجب المادة 43.',
          'التحقق من حصر قواعد بيانات المعطيات الحساسة في خوادم وطنية إن أمكن.'
        ]
      }
    ]
  };

  if (!ai) {
    return fallbackOptimization;
  }

  try {
    const prompt = `You are a Senior Security Architect and Moroccan CNDP Data Protection Officer (DPO) Consultant.
Target Domain: ${targetDomain}
Detected Tech Stack: ${techStack || 'Web Application'}
Current Law 08/09 Compliance Score: ${score}/100
Gaps to Remediate:
${gaps.map((g: any) => `- [${g.article}] ${g.title}: ${g.recommendation}`).join('\n')}
Warnings:
${warnings.map((w: any) => `- [${w.article}] ${w.title}: ${w.recommendation}`).join('\n')}

Generate an authoritative, production-ready technical remediation implementation guide specifically tailored to ${techStack}.
Provide concrete, copy-pasteable code snippets for this specific tech stack (e.g. actual WordPress PHP hooks, Next.js components, or Laravel middleware) solving:
1. Blocking third-party cookies (GA4, Meta Pixel) before affirmative consent under CNDP Délibération 08-2020.
2. Web server security headers & TLS hardening under Article 23.
3. Automated intake / API for Data Subject Rights (Articles 13 & 14).

Return your output STRICTLY as a JSON object matching this schema:
{
  "techStack": "${techStack}",
  "targetDomain": "${targetDomain}",
  "markdownGuide": "Markdown explanation in clear professional Arabic with technical specifics",
  "codeSnippets": [
    {
      "title": "Title of the snippet",
      "language": "php | typescript | javascript | nginx | python",
      "code": "Actual production-ready code",
      "description": "Arabic description of where to paste and how it enforces compliance"
    }
  ],
  "customChecklist": [
    {
      "phase": "Sprint Phase Name (e.g. الأسبوع 1)",
      "items": ["Item 1", "Item 2"]
    }
  ]
}
Output only JSON or markdown fenced JSON.`;

    let responseText = '';
    const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-2.5-flash'];
    for (const m of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: m,
          contents: prompt,
          config: {
            temperature: 0.2
          }
        });
        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (genErr: any) {
        console.warn(`[Remediation Optimizer] Model ${m} skipped: ${genErr.message || genErr}`);
      }
    }

    if (!responseText) {
      return fallbackOptimization;
    }

    const text = responseText;
    let cleaned = text.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '').trim();
    }

    const parsed = JSON.parse(cleaned);
    return {
      techStack: parsed.techStack || techStack,
      targetDomain,
      markdownGuide: parsed.markdownGuide || fallbackOptimization.markdownGuide,
      codeSnippets: Array.isArray(parsed.codeSnippets) && parsed.codeSnippets.length > 0 ? parsed.codeSnippets : fallbackOptimization.codeSnippets,
      customChecklist: Array.isArray(parsed.customChecklist) && parsed.customChecklist.length > 0 ? parsed.customChecklist : fallbackOptimization.customChecklist
    };
  } catch (err: any) {
    console.warn('Gemini Remediation Optimization failed, using fallback:', err?.message || err);
    return fallbackOptimization;
  }
}
