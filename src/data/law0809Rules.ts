export const MOROCCAN_LAW_INFO = {
  lawNumber: "Loi n° 08-09",
  dahir: "Dahir n° 1-09-15 du 22 safar 1430 (18 février 2009)",
  titleAr: "القانون رقم 08.09 المتعلق بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي",
  authority: "CNDP (Commission Nationale de contrôle de la protection des Données à caractère Personnel)",
  authorityAr: "اللجنة الوطنية لمراقبة حماية المعطيات ذات الطابع الشخصي",
  headquarters: "Rabat, Royaume du Maroc",
  articles: [
    {
      article: "المادة 3 (Article 3)",
      topic: "الموافقة الصريحة المسبقة (Informed Prior Consent)",
      summary: "لا يمكن معالجة المعطيات الشخصية إلا إذا كان الشخص المعني قد عبر عن رضاه الصريح عن المعالجة المزمعة."
    },
    {
      article: "المادة 4 (Article 4)",
      topic: "مشروعية المعالجة وملاءمة الغايات (Legitimate Purpose)",
      summary: "يجب جمع المعطيات لغايات محددة وصريحة ومشروعة، وألا تتم معالجتها بطريقة لا تتوافق مع هذه الغايات."
    },
    {
      article: "المادة 12 (Article 12)",
      topic: "الإشعار المسبق وحق الإعلام (Right of Information)",
      summary: "يجب على المسؤول عن المعالجة إخبار المعني بالأمر بهويته وغايات المعالجة، ومرجع إشعار CNDP وحقوق الولوج."
    },
    {
      article: "المادة 13 & 14 (Articles 13 & 14)",
      topic: "حقوق الولوج والتصحيح (Access & Rectification Rights)",
      summary: "حق أي شخص ذاتي في الحصول من المسؤول عن المعالجة على تأكيد معالجة معطياته وتصحيحها ومحوها."
    },
    {
      article: "المادة 23 & 24 (Articles 23 & 24)",
      topic: "السرية وأمن المعالجة (Security & Confidentiality Obligations)",
      summary: "وجوب اتخاذ كافة التدابير التقنية والتنظيمية الضرورية للمحافظة على أمن المعطيات وتفادي تسريبها أو إتلافها."
    },
    {
      article: "المادة 43 & 44 (Articles 43 & 44)",
      topic: "نقل المعطيات إلى الخارج (Cross-Border Data Transfer)",
      summary: "لا يمكن نقل المعطيات نحو دولة أجنبية إلا بترخيص مسبق من CNDP مع اشتراط توفير مستوى حماية كافٍ."
    },
    {
      article: "المادة 52 إلى 65 (Penalties)",
      topic: "العقوبات الجنائية والغرامات (Fines & Criminal Sanctions)",
      summary: "غرامات مالية تتراوح بين 10,000 و 300,000 درهم مع إمكانية الحبس من 3 أشهر إلى سنتين عند المخالفات العمدية."
    }
  ]
};

export const CNDP_COOKIE_GUIDELINES = {
  deliberation: "Délibération n° 08-2020 relative aux cookies et traceurs",
  summary: "تفرض مداولات CNDP الحصول على موافقة مسبقة وصريحة قبل تثبيت ملفات التتبع غير الضرورية، وتوفير زر للرفض بنفس درجة وضوح زر القبول.",
  exemptions: [
    "ملفات تعريف الجلسة الفنية (Session identifiers)",
    "ملفات تخزين خيارات المستخدم وسلة الشراء (Shopping cart / Language)",
    "ملفات حفظ تفضيلات الموافقة على الكوكيز نفسها (Consent preferences)"
  ],
  nonExemptions: [
    "Google Analytics & Universal Measurement tags",
    "Meta Pixel / Facebook Tracking Pixel",
    "ملفات الإعلانات التوجيهية وتتبع السلوك عبر المنصات (Retargeting trackers)",
    "سكربتات خرائط الحرارة وتحليل سلوك الفأرة (Hotjar, Clarity)"
  ]
};
