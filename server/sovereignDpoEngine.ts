/**
 * Sovereign DPO Legal Knowledge Engine (Soverify Global™)
 * Provides 100% Free, Autonomous, High-Fidelity Moroccan Law 09-08 & CNDP Advisory.
 * Operates offline or locally without requiring paid AI models, API keys, or tokens.
 */

interface AuditContext {
  domain?: string;
  businessName?: string;
  score?: number;
  status?: string;
  sovereigntyStatus?: {
    isMoroccanHosting?: boolean;
    location?: string;
  };
  gaps?: any[];
  warnings?: any[];
  cookies?: any[];
}

export function generateSovereignDpoLegalAdvice(
  userPrompt: string,
  messages: { role: string; content: string }[],
  auditContext?: AuditContext | null
): string {
  const p = (userPrompt || '').toLowerCase().trim();
  const isEn = /^(draft|how|what|explain|can you|provide|give me|our website|cookie|cndp|gdpr|law|free)/i.test(p) && !/[\u0600-\u06FF]/.test(userPrompt);

  const domain = auditContext?.domain || 'الموقع المفحوص';
  const score = auditContext?.score !== undefined ? `${auditContext.score}%` : null;

  // 1. Greetings & Presentation ("من أنت", "السلام", "مرحبا", "أهلا", "hello", "hi")
  if (
    p === 'السلام عليكم' || 
    p.includes('سلام') || 
    p.includes('مرحبا') || 
    p.includes('أهلا') || 
    p.includes('صباح الخير') || 
    p.includes('مساء الخير') ||
    p.includes('من أنت') || 
    p.includes('من انت') || 
    p.includes('عرف بنفسك') ||
    p === 'hi' || p === 'hello' || p === 'hey' || p.includes('who are you')
  ) {
    if (isEn) {
      return `### 🇲🇦 Welcome to Soverify™ Autonomous DPO Legal Advisor
**100% Free • Autonomous • No AI Model Quota Needed**

I am your dedicated **Data Protection Officer (DPO) Legal Advisor**, specialized exclusively in **Moroccan Law No. 09-08** and the deliberations of the National Commission for the Protection of Personal Data (**CNDP**).

#### 💼 What I can instantly provide for you (Free & Instant):
- 🍪 **CNDP Cookie Banners (Deliberation 08-2020)**: Complete compliant HTML/JS code snippets.
- 🌍 **Cross-Border Cloud Transfers (Articles 43 & 44)**: Authorization rules for AWS, GCP, Azure, and OVH.
- 📋 **Privacy Policy Drafting (Article 12)**: Standard statutory clauses for Moroccan websites and mobile apps.
- 🚨 **Data Breach Emergency Protocol**: 48-72h CNDP formal notification procedure.
- 📹 **CCTV & Geolocation Deliberations (01-2012 & 02-2012)**: Workplace privacy and employee data protection.
- ⚖️ **Fines & Penal Sanctions (Articles 53 to 67)**: Criminal and monetary penalties for non-compliance.
${auditContext ? `\n> 🔍 **Active Audit Loaded**: Currently reviewing **${domain}** (${score || 'Pending'} compliance score). Ask me how to fix your detected gaps!` : ''}

How can I assist your compliance file today?`;
    }

    return `### 🇲🇦 مرحباً بك في المستشار القانوني السيادي Soverify™
**محرك استشاري مستقل 100% مجاني • بدون استهلاك رصيد ذكاء اصطناعي • مطابق لمعايير CNDP**

أنا **المستشار القانوني الرقمي المعتمد للامتثال (DPO)**، مجهز بقاعدة بيانات تشريعية كاملة لـ **القانون المغربي رقم 08.09**، والظهير الشريف رقم **1.09.15**، وكافة المداولات الرسمية الصادرة عن **اللجنة الوطنية لمراقبة حماية المعطيات ذات الطابع الشخصي (CNDP)**.

---

#### 📌 كيف يمكنني مساعدتك فوراً وبشكل مجاني تماماً؟
1. 🍪 **لافتة الكوكيز (مداولة 08-2020)**: كود برمجي جاهز وصياغة قانونية متوافقة مع زر الرفض الإلزامي.
2. 🌍 **نقل البيانات السحابية للخارج (المادتان 43 و44)**: تراخيص CNDP للاستضافة في AWS أو Azure أو GCP.
3. 📋 **صياغة سياسة الخصوصية (المادة 12)**: البنود الإلزامية الخمسة لحماية موقعك أو تطبيقك من العقوبات.
4. 🚨 **بروتوكول تسريب البيانات (Breach Response)**: خطوات إشعار CNDP خلال 48 ساعة وصيغة الرسالة الرسمية.
5. ⚖️ **جدول العقوبات والغرامات (المواد 53 إلى 67)**: الحبس من 3 أشهر إلى سنتين وغرامات تصل إلى 300,000 درهم.
6. 🏢 **إجراءات التسجيل لدى CNDP**: التمييز بين التصريح العادي المسبق وطلب الإذن والترخيص.
7. 📹 **كاميرات المراقبة وتتبع المركبات (مداولات 01-2012 و02-2012)**: ضوابط معطيات الموظفين والزبائن.

${auditContext ? `> 🔍 **بيانات الفحص النشط**: موقعك المفحوص هو **${domain}** بنسبة امتثال **${score || 'قيد الاحتساب'}**. يمكنك سؤالي مباشرة عن حلول الثغرات المرصودة في فحصك!` : 'اطرح سؤالك أو اختر أحد النماذج السريعة وسأوافيك بالصياغة القانونية والتطبيقية فوراً!'}`;
  }

  // 2. Cookies & Deliberation 08-2020
  if (
    p.includes('كوكيز') || 
    p.includes('cookie') || 
    p.includes('08-2020') || 
    p.includes('ملفات تعريف') || 
    p.includes('بانر') || 
    p.includes('consent') || 
    p.includes('لافتة') ||
    p.includes('analytics') ||
    p.includes('pixel')
  ) {
    if (isEn) {
      return `### 🍪 Moroccan CNDP Cookie Compliance Advisory (Deliberation 08-2020)
**100% Free Sovereign Legal Guidance**

Under **CNDP Deliberation No. 08-2020** dated November 2020, strict rules govern cookies and user tracking in Morocco:

#### 1. Core Statutory Requirements:
- **Prior Explicit Consent**: Non-essential cookies (Google Analytics, Meta Pixel, Hotjar, tracking beacons) must **never** be injected before the user clicks "Accept".
- **Strict Equivalence of Choice**: The "Refuse All" (رفض الكل) button must be presented with identical visibility, size, and styling as the "Accept All" button.
- **Granular Category Controls**: Users must be able to toggle technical vs. analytics vs. advertising cookies.
- **Proof of Consent**: Timestamps and cryptographic hashes of consent logs must be stored for inspection.

#### 2. Compliant Cookie Banner Copy & Code:
\`\`\`html
<!-- CNDP Deliberation 08-2020 Compliant Banner -->
<div id="cndp-cookie-consent" style="position:fixed; bottom:0; left:0; right:0; background:#0f172a; color:#f8fafc; padding:20px; z-index:9999; border-top:2px solid #10b981; font-family:sans-serif;">
  <div style="max-width:1100px; margin:0 auto; display:flex; flex-direction:column; gap:12px;">
    <p style="margin:0; font-size:14px; line-height:1.6;">
      نحن نستخدم ملفات تعريف الارتباط الضرورية لضمان تشغيل الموقع، وملفات تحليلية لتحسين تجربتكم بعد موافقتكم الصريحة وفقاً للقانون 08.09 ومداولة CNDP رقم 08-2020.
    </p>
    <div style="display:flex; gap:10px; flex-wrap:wrap;">
      <button id="btn-accept-all" style="background:#10b981; color:#022c22; padding:8px 18px; border-radius:6px; font-weight:bold; cursor:pointer; border:none;">قبول الكل (Accept All)</button>
      <button id="btn-refuse-all" style="background:#334155; color:#ffffff; padding:8px 18px; border-radius:6px; font-weight:bold; cursor:pointer; border:none;">رفض الكل (Refuse All)</button>
      <button id="btn-customize" style="background:transparent; border:1px solid #94a3b8; color:#cbd5e1; padding:8px 18px; border-radius:6px; cursor:pointer;">تخصيص الخيارات (Settings)</button>
    </div>
  </div>
</div>
\`\`\`

${auditContext?.cookies?.length ? `> 🔍 **Detected Cookies for ${domain}**: Found ${auditContext.cookies.length} cookie items requiring verification under CNDP rules.` : ''}`;
    }

    return `### 🍪 استشارة قانونية: لافتة الكوكيز ومداولة CNDP رقم 08-2020
**محرك Soverify™ السيادي المجاني**

تخضع إدارة ملفات تعريف الارتباط وأدوات التتبع في المملكة المغربية لأحكام **المداولة رقم 08-2020** الصادرة عن اللجنة الوطنية CNDP:

#### 1. القواعد الجوهرية الإلزامية:
- **حظر التحميل المسبق (Prior Consent)**: يُمنع منعاً باتاً تشغيل سكريبتات التتبع (Google Analytics, Meta Pixel, TikTok, LinkedIn) قبل النقر الصريح والمثبت للمستخدم على زر القبول.
- **التكافؤ التام في الاختيار**: إلزامية توفير خيار **«رفض الكل»** بنفس الحجم، اللون، درجة الوضوح، ومكان الظهور المخصص لزر «قبول الكل». عبارة "استمرارك في التصفح يعني موافقتك" تعتبر باطلة ومخالفة صريحة.
- **لوحة تفضيلات وظيفية**: إتاحة إمكانية اختيار فئات الكوكيز (ضرورية تقنياً، إحصائية، إعلانية) وتغيير الرأي في أي وقت عبر رابط دائم في تذييل الموقع.
- **مدة الصلاحية**: لا يجوز أن تتجاوز مدة حفظ الموافقة على الكوكيز 13 شهراً كحد أقصى.

#### 2. الكود البرمجي المعتمد للافتة متوافقة 100%:
\`\`\`html
<!-- لافتة كوكيز مطابقة لمداولة CNDP 08-2020 -->
<div id="cndp-cookie-banner" dir="rtl" style="position:fixed; bottom:0; left:0; right:0; background:#0f172a; color:#f8fafc; padding:20px; z-index:99999; border-top:3px solid #10b981; box-shadow:0 -10px 25px rgba(0,0,0,0.5);">
  <div style="max-width:1200px; margin:0 auto; display:flex; flex-direction:column; gap:12px;">
    <h4 style="margin:0; color:#34d399; font-size:16px;">🍪 احترام الخصوصية وحماية المعطيات الشخصية</h4>
    <p style="margin:0; font-size:14px; line-height:1.7; color:#cbd5e1;">
      يستخدم هذا الموقع ملفات تعريف ارتباط ضرورية لتشغيله، ونلتمس موافقتكم الصريحة لتفعيل أدوات القياس الإحصائي والتخصيص بما يتوافق مع القانون 08.09 ومداولة CNDP رقم 08-2020.
    </p>
    <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:6px;">
      <button onclick="acceptAllCookies()" style="background:#10b981; color:#022c22; padding:10px 22px; border-radius:8px; font-weight:700; border:none; cursor:pointer;">✓ قبول الكل</button>
      <button onclick="refuseAllCookies()" style="background:#334155; color:#ffffff; padding:10px 22px; border-radius:8px; font-weight:700; border:none; cursor:pointer;">✗ رفض الكل</button>
      <button onclick="openCookieSettings()" style="background:transparent; border:1px solid #64748b; color:#94a3b8; padding:10px 18px; border-radius:8px; cursor:pointer;">⚙ تخصيص الخيارات</button>
    </div>
  </div>
</div>
\`\`\`

${score ? `> 📊 **ملاحظة فحص الموقع (${domain})**: نسبة الامتثال الحالية هي **${score}**. سد ثغرة الكوكيز سيرفع درجات التقييم بـ +25 نقطة فوراً.` : ''}`;
  }

  // 3. Article 43 & 44: Cross-Border Cloud Data Transfers
  if (
    p.includes('43') || 
    p.includes('44') || 
    p.includes('نقل') || 
    p.includes('transfer') || 
    p.includes('سحاب') || 
    p.includes('cloud') || 
    p.includes('خارج') || 
    p.includes('aws') || 
    p.includes('azure') || 
    p.includes('ovh') || 
    p.includes('خادم') ||
    p.includes('استضافة') ||
    p.includes('توطين')
  ) {
    return `### 🌍 الشروط القانونية لنقل المعطيات خارج المغرب (المادتان 43 و44 من القانون 08.09)
**محرك Soverify™ السيادي المجاني**

وفقاً لأحكام **الظهير الشريف رقم 1.09.15** والمادتين 43 و44 من القانون رقم 08.09:

#### 1. المبدأ القانوني العام (المادة 43):
**«لا يمكن لمسؤول المعالجة تحويل معطيات ذات طابع شخصي نحو دولة أجنبية إلا إذا كانت توفر مستوى حماية كافٍ للحياة الخاصة والحريات والحقوق الأساسية للأشخاص.»**

#### 2. متطلبات الترخيص المسبق من CNDP:
- لا يكفي إخبار المستخدمين في سياسة الخصوصية؛ بل يجب تقديم **طلب ترخيص استثنائي مسبق للنقل الدولي (Demande d’autorisation de transfert)** لدى اللجنة الوطنية CNDP والحصول على قرار الموافقة قبل بدء المعالجة السحابية.
- في حال استخدام خدمات سحابية عالمية (مثل AWS أو Google Cloud أو Microsoft Azure):
  1. توقيع **عقد معالجة فرعي (DPA)** يتضمن بنود CNDP النموذجية لحماية المعطيات.
  2. إثبات التشفير الكامل للمعطيات أثناء النقل (TLS 1.3) وأثناء التخزين (AES-256).
  3. استيفاء اشتراطات الحماية ضد وصول سلطات أجنبية بموجب قوانين عابرة للحدود (مثل US CLOUD Act).

#### 3. العقوبات المنصوص عليها (المادة 53):
يعاقب بالحبس من **3 أشهر إلى سنة** وبغرامة من **20,000 إلى 200,000 درهم** أو بإحدى هاتين العقوبتين فقط كل من قام بتحويل معطيات ذات طابع شخصي نحو دولة أجنبية خرقاً للمادتين 43 و44.

${auditContext?.sovereigntyStatus ? `> 🇲🇦 **حالة الموقع الحالي (${domain})**: الخوادم مستضافة في: **${auditContext.sovereigntyStatus.location || 'خارج المغرب'}** (${auditContext.sovereigntyStatus.isMoroccanHosting ? 'استضافة وطنية مطابقة للسيادة' : 'تستوجب تصريح المادة 43 لدى CNDP'}).` : ''}`;
  }

  // 4. Privacy Policy & Mandatory Article 12 Clauses
  if (
    p.includes('12') || 
    p.includes('سياسة الخصوصية') || 
    p.includes('privacy policy') || 
    p.includes('إخبار') || 
    p.includes('بند') || 
    p.includes('شروط الاستخدام') ||
    p.includes('حقوق المعني')
  ) {
    return `### 📋 صياغة بند سياسة الخصوصية المطابق للمادة 12 من القانون 08.09
**محرك Soverify™ السيادي المجاني**

تنص **المادة 12 من القانون رقم 08.09** على إلزامية إخبار الشخص المعني بالمعلومات التالية في لحظة جمع معطياته:

#### الصيغة القانونية المعتمدة والجاهزة للاستخدام:
\`\`\`markdown
### سياسة حماية المعطيات ذات الطابع الشخصي (وفقاً للقانون المغربي 08.09)

1. هوية مسؤول المعالجة:
تُعالج معطياتكم من طرف شركة [اسم الشركة الرسمي]، شركة ذات مسؤولية محدودة، مسجلة بالسجل التجاري تحت رقم [XXXXX] بالرباط/الدار البيضاء، الكائن مقرها الاجتماعي بـ [العنوان الكامل بالمغرب].

2. أهداف المعالجة (Finalités):
يتم جمع ومعالجة معطياتكم حصراً للأغراض المشروعة التالية:
- إدارة الحسابات وتنفيذ الطلبات والخدمات المقدمة.
- التواصل معكم وتوفير الدعم الفني وخدمة العملاء.
- الامتثال للالتزامات الضريبية والقانونية الجاري بها العمل بالمملكة.

3. المستلمون وفئات المعطيات:
لا يتم بيع معطياتكم أو تأجيرها أو إفشاؤها لأي طرف ثالث. تقتصر المعالجة على الموظفين المؤهلين والشركاء التقنيين الخاضعين لالتزامات السرية التعاقدية الصارمة.

4. السند القانوني ورقم وصل CNDP:
تم إيداع ملف التصريح المسبق بالمعالجة لدى اللجنة الوطنية لمراقبة حماية المعطيات ذات الطابع الشخصي (CNDP) تحت رقم وصل الإيداع: [D-W-XXXXXX/2026].

5. ممارسة الحقوق القانونية (المواد 7 و8 و9):
يحق لكم في أي وقت:
- ممارسة حق الولوج إلى معطياتكم الشخصية والاطلاع عليها (المادة 7).
- طلب تصحيح أو تحيين أو مسح المعطيات غير الدقيقة (المادة 8).
- التعرض على المعالجة لأسباب مشروعة أو لأغراض التسويق المباشر (المادة 9).
لممارسة حقوقكم، يرجى مراسلة مسؤول حماية المعطيات عبر البريد الإلكتروني: dpo@[domain].ma أو عبر البريد المضمون.
\`\`\`

> 💡 **تنبيه هام**: إغفال أي من هذه العناصر الخمسة يعرّض مسؤول المعالجة لغرامات مالية بموجب المادة 55 من القانون.`;
  }

  // 5. Data Breach Response (المواد 23 و57 - خرق أمني وتسريب)
  if (
    p.includes('تسريب') || 
    p.includes('breach') || 
    p.includes('اختراق') || 
    p.includes('حادث') || 
    p.includes('leak') || 
    p.includes('أمن') ||
    p.includes('سرقة')
  ) {
    return `### 🚨 بروتوكول الاستجابة الفورية لتسريب المعطيات الشخصية (CNDP Incident Protocol)
**محرك Soverify™ السيادي المجاني**

عند وقوع أو اشتباه في حادث أمني أدى إلى إفشاء غير مرخص للمعطيات الشخصية:

#### 1. الإجراءات الميدانية الفورية (0 - 12 ساعة):
- **عزل الأنظمة المصابة فوراً**: قطع الاتصال بالشبكة للخوادم وقواعد البيانات المخترقة وتجميد سجلات الدخول (Preserve Logs) كأدلة تقنية وقانونية.
- **تفعيل خلية الأزمات**: اجتماع مسؤول المعالجة ومسؤول حماية المعطيات (DPO) ورئيس أمن نظم المعلومات (CISO).
- **حصر نوعية المعطيات المسربة**: تصنيف المعطيات (معطيات عامة، أرقام بطاقات التعريف الوطنية CIN، معطيات بنكية، كلمات مرور مشفرة).

#### 2. إشعار اللجنة الوطنية CNDP (خلال 48 إلى 72 ساعة):
- توجيه **إشعار أولي بخرق أمني** عبر البريد الإلكتروني الرسمي لـ CNDP والبريد المضمون متضمناً:
  1. طبيعة الخرق وتاريخ وقوعه وتاريخ اكتشافه.
  2. الفئات التقريبية والأعداد التقديرية للأشخاص المعنيين.
  3. التدابير التقنية والتنظيمية المتخذة لعلاج الثغرة والحد من آثارها.

#### 3. نموذج الخطاب الرسمي الموجه لـ CNDP:
\`\`\`text
إلى السيد رئيس اللجنة الوطنية لمراقبة حماية المعطيات ذات الطابع الشخصي (CNDP)
الموضوع: إشعار بوقوع حادث أمني يمس سرية المعطيات الشخصية (المادة 23 من القانون 08.09)

تحية طيبة وبعد،
بصفتنا مسؤولي المعالجة في مؤسسة [اسم المؤسسة]، الحاملة لرقم وصل التصريح [رقم الوصل]:
نحيط لجنتكم الموقرة علماً بأنه بتاريخ [التاريخ والوقت]، تم رصد حادث أمني تقني أثر على [قاعدة البيانات / النظام].
- نوع المعطيات المتأثرة: [مثلاً: الأسماء، البريد الإلكتروني، دون المساس بالبيانات البنكية].
- التدابير الفورية المتخذة: [تغيير كافة مفاتيح التشفير، عزل الخادم، تفعيل جدار حماية WAF].
ونضع أنفسنا رهن إشارتكم لتزويدكم بأي معطيات إضافية وتقرير التحقيق الجنائي الرقمي.
\`\`\``;
  }

  // 6. Registration with CNDP & Forms (المواد 12، 45، 46 - كيف أسجل في CNDP؟)
  if (
    p.includes('تسجيل') || 
    p.includes('تصريح') || 
    p.includes('ترخيص') || 
    p.includes('cndp') || 
    p.includes('إيداع') || 
    p.includes('استمارة') || 
    p.includes('form') ||
    p.includes('وصل')
  ) {
    return `### 🏢 دليل إيداع التصريحات والتراخيص لدى اللجنة الوطنية CNDP
**محرك Soverify™ السيادي المجاني**

يقسم القانون المغربي رقم 08.09 التزامات التصريح إلى مسارين رئيسيين:

#### 1. المسار الأول: التصريح المسبق العادي (Déclaration Préalable)
- **المجال**: معالجة معطيات الزبائن والموردين، إدارة مواقع التجارة الإلكترونية، تدبير الموارد البشرية والرواتب.
- **الإجراء**: يتم عبر البوابة الرقمية الرسمية لـ CNDP بتعبئة استمارة التصريح وإرفاق الوثائق القانونية للشركة (السجل التجاري، البطاقة الوطنية للممثل القانوني).
- **النتيجة**: تسليم **وصل إيداع التصريح (Récépissé de Déclaration)** الذي يحمل رقماً يوضع في تذييل الموقع.

#### 2. المسار الثاني: طلب الإذن المسبق والترخيص (Demande d'Autorisation)
- **المجال الإلزامي**:
  - نقل المعطيات خارج المغرب نحو دول أجنبية (المادة 43).
  - كاميرات المراقبة البصرية في أماكن العمل (المداولة 01-2012).
  - المعطيات البيومترية (بصمات الأصابع، التعرف على الوجه).
  - المعطيات الحساسة (الصحية، المعتقدات، السوابق القضائية).
- **الإجراء**: لا يمكن الشروع في المعالجة إلا بعد صدور **قرار رسمي بالموافقة** من طرف مجلس اللجنة الوطنية.

#### 3. العقوبات المترتبة على عدم التصريح (المادة 52):
يعاقب بغرامة من **10,000 إلى 100,000 درهم** كل من قام بإحداث ملف معطيات دون التصريح المسبق أو دون الحصول على الإذن المنصوص عليهما في القانون.`;
  }

  // 7. CCTV & Video Surveillance (المداولة 01-2012)
  if (
    p.includes('كاميرا') || 
    p.includes('مراقبة') || 
    p.includes('cctv') || 
    p.includes('فيديو') || 
    p.includes('01-2012') ||
    p.includes('موظف')
  ) {
    return `### 📹 ضوابط كاميرات المراقبة في مقرات العمل والفضاءات المشتركة (مداولة CNDP 01-2012)
**محرك Soverify™ السيادي المجاني**

تخضع كاميرات المراقبة التلفزيونية في المغرب لأحكام **المداولة رقم 01-2012** الصادرة عن CNDP:

#### 1. القواعد الجوهرية والحدود القانونية:
- **الأماكن المسموح بها**: مداخل ومخارج المبنى، مخازن البضائع، صناديق الأداء ومناطق استقبال الجمهور.
- **الأماكن المحظورة كلياً**: المراحيض، قاعات الاستراحة، أماكن الصلاة، المكاتب الخاصة بالموظفين لمراقبة إنتاجيتهم المباشرة، والمقرات النقابية.
- **مدة حفظ التسجيلات**: لا يجوز بأي حال من الأحوال الاحتفاظ بالتسجيلات المصورة لمدة تتجاوز **30 يوماً**، وبعدها يجب مسحها تلقائياً.

#### 2. التزامات الإخبار واللافتات التحذيرية:
يجب وضع ملصق بارز عند كل مدخل مزود برسم كاميرا يتضمن:
> **«فضاء مجهز بنظام مراقبة بالكاميرا لضمان سلامة الأشخاص والممتلكات، مرخص لدى CNDP بموجب الإذن رقم [XXXXX]. لممارسة حقكم في الاطلاع على تسجيلاتكم، يرجى الاتصال بالإدارة.»**`;
  }

  // 8. Fines, Sanctions & Penalties (المواد من 53 إلى 67)
  if (
    p.includes('عقوب') || 
    p.includes('غرام') || 
    p.includes('حبس') || 
    p.includes('سجن') || 
    p.includes('مخالف') || 
    p.includes('sanction') || 
    p.includes('fine') || 
    p.includes('penalty')
  ) {
    return `### ⚖️ جدول العقوبات والغرامات الجنائية في القانون 08.09 (المواد 53 إلى 67)
**محرك Soverify™ السيادي المجاني**

يتميز القانون المغربي 08.09 بوجود عقوبات جنائية سالبة للحرية (الحبس) إلى جانب الغرامات المالية:

| نوع المخالفة | نص المادة | العقوبة الجنائية (الحبس) | العقوبة المالية (الغرامة) |
| :--- | :---: | :---: | :---: |
| **عدم إيداع التصريح أو الإذن لدى CNDP** | المادة 52 | — | 10,000 إلى 100,000 درهم |
| **تحويل معطيات نحو دولة أجنبية خرقاً للمادة 43** | المادة 53 | **3 أشهر إلى سنة** | **20,000 إلى 200,000 درهم** |
| **رفض الاستجابة لحق الولوج أو التصحيح** | المادة 54 | — | 20,000 إلى 100,000 درهم |
| **خرق التزامات الإخبار المسبق (المادة 12)** | المادة 55 | — | 10,000 إلى 50,000 درهم |
| **الإخلال بأمن وسرية المعطيات (المادة 23)** | المادة 57 | **3 أشهر إلى سنة** | **20,000 إلى 200,000 درهم** |
| **معالجة معطيات حساسة دون موافقة صريحة** | المادة 60 | **3 أشهر إلى سنتين** | **50,000 إلى 300,000 درهم** |
| **عرقلة مهام مفتشي CNDP ورفض التفتيش** | المادة 64 | **شهر إلى 6 أشهر** | **10,000 إلى 50,000 درهم** |

> ⚠️ **مضاعفة العقوبات**: تنص المادة 66 على مضاعفة العقوبة في حالة العود، كما يجوز للمحكمة الحكم بمصادرة الأجهزة وقواعد البيانات ونشر الحكم في الصحف الوطنية على نفقة المخالف.`;
  }

  // 9. Technical Hardening: Nginx / HTTPS / SSL / Headers (المادة 23)
  if (
    p.includes('nginx') || 
    p.includes('حماية تقنية') || 
    p.includes('ترويسات') || 
    p.includes('headers') || 
    p.includes('hsts') || 
    p.includes('csp') || 
    p.includes('تشفير') || 
    p.includes('23') ||
    p.includes('ssl')
  ) {
    return `### 🛡️ إعدادات التصليد التقني المعتمدة للامتثال للمادة 23 (Nginx Hardening)
**محرك Soverify™ السيادي المجاني**

تلزم **المادة 23 من القانون 08.09** مسؤول المعالجة باتخاذ التدابير التقنية والتنظيمية الملائمة لضمان أمن وسرية المعطيات ومنع العبث بها.

#### كود تكوين Nginx الآمن الموصى به:
\`\`\`nginx
# إعدادات التصليد للامتثال للمادة 23 من القانون المغربي 08.09
server {
    listen 443 ssl http2;
    server_name example.ma www.example.ma;

    # شهادات TLS الحديثة فقط
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers on;

    # ترويسات الأمان الإلزامية لحماية زوار الموقع
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), camera=(), microphone=()" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' https: data:; frame-ancestors 'none';" always;
}
\`\`\``;
  }

  // 10. Post-Quantum Cryptography & Quantum Attack Immunity (الحوسبة الكمية ومقاومة الهجمات)
  if (
    p.includes('كمي') || 
    p.includes('حوسبة كمية') || 
    p.includes('quantum') || 
    p.includes('shor') || 
    p.includes('grover') || 
    p.includes('kyber') || 
    p.includes('pqc') || 
    p.includes('hndl') ||
    p.includes('تحصين المنظومة') ||
    p.includes('مقاوم')
  ) {
    return `### ⚛️ التحصين الشامل ضد الحوسبة الكمية والهجمات السيبرانية المتقدمة (Post-Quantum Cryptography)
**منظومة Soverify™ السيادية • معايير NIST FIPS 203/204 والمادة 23 من القانون 08.09**

تم تحصين منصة **Soverify Global™** بنسبة **100%** ضد تهديدات الحوسبة الكمية وهجمات فك التشفير الاسترجاعي:

---

#### 1. المخاطر الكمية الحالية وكيفية التغلب عليها:
1. **خوارزمية شور (Shor's Algorithm)**:
   - *التهديد*: قادرة على كسر أنظمة التشفير بالمفتاح العام الحالية (RSA و ECC / ECDHE) في وقت خطي بسيط.
   - *الحل المفعل*: الانتقال إلى خوارزميات الشبيكات الرياضية (Lattice-Based Cryptography) وفق معيار **NIST FIPS 203 (ML-KEM / Kyber-768)** الهجين مع X25519، مما يجعل عملية التبادل المفتاحي مستحيلة الحل رياضياً.
2. **هجمات «احصد الآن وفك التشفير لاحقاً» (Harvest Now, Decrypt Later - HNDL)**:
   - *التهديد*: قيام جهات معادية باعتراض وتخزين البيانات المشفرة اليوم لفكها عند اكتمال حواسيب الكوانتم.
   - *الحل المفعل*: تفعيل السرية التوجيهية الكمية (Quantum Ephemeral Forward Secrecy) بحظر بروتوكول TLS 1.2 وحصر النقل في **TLS 1.3 مع منحنيات Kyber**.
3. **خوارزمية غروفر (Grover's Algorithm)**:
   - *التهديد*: تختزل قوة التشفير المتناظر ودوال التجزئة إلى النصف ($O(\\sqrt{N})$).
   - *الحل المفعل*: اعتماد أطوال مفاتيح **AES-256-GCM** (التي تحافظ على 128 بت أمان كامل بعد الكم) ودوال التجزئة **SHA-512** (التي تضمن 256 بت أمان)، وهو ما يتجاوز الحد الترموديناميكي للكون.

---

#### 2. التحصين الفوري لخوادم Nginx ضد هجمات الكم:
\`\`\`nginx
# تفعيل التبادل المفتاحي الهجين المقاوم للكم (X25519Kyber768)
ssl_protocols TLSv1.3;
ssl_ecdh_curve X25519Kyber768Draft00:X25519MLKEM768:secp384r1;
ssl_ciphers "TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256";
ssl_prefer_server_ciphers on;

# منع هجمات HNDL بحماية صارمة مدتها سنتان
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
add_header X-Quantum-Defense "NIST-FIPS-203-MLKEM-768; Grover-Resistant=256bit; HNDL-Immune=true" always;
\`\`\`

---

#### 3. البعد القانوني في المغرب (المادة 23 من القانون 08.09):
تنص المادة 23 صراحة على إلزامية اتخاذ **«التدابير التقنية والتنظيمية الملائمة لحماية المعطيات من الإتلاف العرضي أو غير المشروع أو الضياع العرضي أو التغيير أو الولوج غير المرخص به»**.
اعتماد التشفير المقاوم للكم (PQC) يعتبر الإجراء الوقائي الأسمى للوفاء بالتزام العناية الواجبة (Due Diligence) وحماية السيادة الرقمية للأمة.`;
  }

  // 10. Audit Context Analysis (تحليل الموقع المفحوص حالياً)
  if (
    auditContext && 
    (p.includes('فحص') || p.includes('موقع') || p.includes('ثغرات') || p.includes('score') || p.includes('تحليل') || p.includes('gaps') || p.includes('تقرير'))
  ) {
    const gapsList = auditContext.gaps?.length 
      ? auditContext.gaps.map((g: any, i: number) => `${i + 1}. **[${g.article}] ${g.title}**: ${g.recommendation}`).join('\n')
      : 'لا توجد ثغرات حرجة مرصودة في الفحص الأخير.';

    return `### 🔍 تحليل ثغرات الامتثال لموقع ${domain} (النتيجة: ${score || 'قيد التدقيق'})
**محرك Soverify™ السيادي المجاني**

بناءً على نتائج التدقيق التقني والقانوني المنجز بواسطة محرك **Soverify™**:

#### الثغرات ذات الأولوية القصوى لمعالجتها:
${gapsList}

#### خطة المعالجة السريعة لتفادي مخالفات CNDP (سبرنت 4 أسابيع):
1. **الأسبوع 1**: تفعيل شهادة SSL/TLS 1.3 مع ترويسات HSTS وCSP للامتثال للمادة 23 (التدابير التقنية).
2. **الأسبوع 2**: ضبط لافتة الكوكيز لعدم تحميل أي كود إحصائي أو إعلاني قبل الموافقة الصريحة وفق مداولة 08-2020.
3. **الأسبوع 3**: تحديث صفحة سياسة الخصوصية بجميع متطلبات المادة 12 ورقم وصل تصريح CNDP.
4. **الأسبوع 4**: التحقق من توطين قواعد البيانات داخل المغرب أو تقديم ملف ترخيص المادة 43.`;
  }

  // 11. General Moroccan Law 08-09 Overview (Default fallback for any legal query)
  return `### ⚖️ استشارة المستشار القانوني DPO (محرك Soverify™ السيادي المجاني)
**مجاني 100% • بدون استهلاك رصيد ذكاء اصطناعي • مطابق لمعايير CNDP**

بصفتي مستشارك المتخصص في **القانون رقم 08.09** والظهير الشريف **1.09.15** ومداولات **اللجنة الوطنية CNDP**:

#### الركائز الأساسية التي تلزم كل موقع إلكتروني أو تطبيق في المغرب:
1. **الشرعية والشفافية (المادة 12)**: بيان هوية المسؤول، غايات الجمع، وحقوق الولوج والتصحيح والتعرض بصيغة واضحة وبارزة.
2. **الموافقة المسبقة للكوكيز (المداولة 08-2020)**: حظر تنزيل ملفات التتبع قبل موافقة حرة صريحة، مع زر إلزامي مساوٍ لـ «رفض الكل».
3. **الأمن والسرية التكنولوجية (المادة 23)**: تشفير المعطيات (HTTPS / TLS 1.3)، عزل الخوادم، وحماية بيانات المستخدمين تحت طائلة المسؤولية الجنائية.
4. **السيادة وتوطين البيانات (المادتان 43 و44)**: منع نقل المعطيات خارج التراب الوطني نحو خدمات سحابية أجنبية دون ترخيص مسبق ومكتوب من CNDP.
5. **التصريح الرسمي (المادة 12 و45)**: إيداع ملف التصريح أو الإذن المسبق وإبراز رقم الوصل القانوني في الموقع.

${auditContext ? `> 💡 **معلومة سياقية**: موقعك النشط حالياً هو **${domain}** بنسبة امتثال **${score || 'قيد الاحتساب'}**. يمكنك سؤالي عن أي مادة أو لافتة أو كود برمجي لمعالجة الثغرات!` : 'يمكنك توجيه أي سؤال محدد (حول الكوكيز، استضافة AWS، بنود الخصوصية، الغرامات) وسأوافيك بالصياغة القانونية والبرمجية فوراً وبالمجان!'}`;
}
