export interface LawArticle {
  id: string;
  number: string;
  numberAr: string;
  chapterNumber: number;
  chapterTitle: string;
  chapterTitleAr: string;
  category: 'consent' | 'purpose' | 'transparency' | 'rights' | 'security' | 'formalities' | 'transfer' | 'penalties' | 'cookies';
  title: string;
  titleAr: string;
  summary: string;
  summaryAr: string;
  legalTextFr: string;
  legalTextAr: string;
  dpoExplanation: string;
  dpoExplanationAr: string;
  auditRelevance: string;
  auditRelevanceAr: string;
  remediationSteps: string[];
  remediationStepsAr: string[];
  penalties?: string;
  penaltiesAr?: string;
  cndpForms?: string[];
  matchKeywords: string[];
}

export const MOROCCAN_LAW_ARTICLES: LawArticle[] = [
  {
    id: 'art-3',
    number: 'Article 3',
    numberAr: 'المادة 3',
    chapterNumber: 2,
    chapterTitle: 'Titre II: Qualité des données et légitimité des traitements',
    chapterTitleAr: 'الباب الثاني: جودة المعطيات ومشروعية المعالجة',
    category: 'consent',
    title: 'Requirement of Informed Prior Consent',
    titleAr: 'اشتراط الموافقة الصريحة المسبقة للشخص المعني',
    summary: 'Personal data may only be processed if the data subject has unambiguously given their express prior consent.',
    summaryAr: 'لا يمكن معالجة المعطيات ذات الطابع الشخصي إلا إذا كان الشخص المعني قد عبر عن رضاه وموافقته الصريحة قبل الشروع في المعالجة.',
    legalTextFr: 'Le traitement de données à caractère personnel ne peut être effectué que si la personne concernée a indubitablement donné son consentement à l\'opération ou à l\'ensemble des opérations envisagées.',
    legalTextAr: 'لا يمكن معالجة المعطيات ذات الطابع الشخصي إلا إذا كان الشخص المعني قد عبر عن رضاه وموافقته الصريحة على العملية أو مجموع العمليات المزمع إنجازها.',
    dpoExplanation: 'Every form, user registration, newsletter signup, and tracking script must obtain genuine affirmative consent. Pre-checked boxes or silent opt-in mechanisms are strictly invalid under Moroccan regulatory doctrine.',
    dpoExplanationAr: 'يجب على كل موقع إلكتروني الحصول على موافقة نشطة ومسبقة من الزائر قبل تسجيله أو جمع بياناته أو تفعيل التتبع. الصناديق المؤشر عليها مسبقاً (Pre-ticked boxes) باطلة قانونياً لدى CNDP.',
    auditRelevance: 'Scanner evaluates form submission gates, newsletter opt-ins, and checks for explicit consent checkmarks.',
    auditRelevanceAr: 'يقوم الفاحص بالتحقق من وجود مربعات موافقة صريحة وغير مؤشرة مسبقاً في استمارات التسجيل والاتصال.',
    remediationSteps: [
      'Uncheck all opt-in checkboxes by default across all forms and landing pages.',
      'Record timestamp, IP hash, and consent version in database audit trails.',
      'Ensure consent can be withdrawn as easily as it was granted.'
    ],
    remediationStepsAr: [
      'إلغاء التأشير التلقائي عن جميع مربعات الموافقة في الاستمارات الإلكترونية.',
      'الاحتفاظ بسجل رقمي يثبت تاريخ وساعة وصيغة موافقة كل مستخدم.',
      'توفير آلية بسيطة تمكن المستخدم من سحب موافقته في أي وقت بسهولة.'
    ],
    penalties: 'Up to 100,000 MAD fine and potential nullification of database processing records under Art. 53.',
    penaltiesAr: 'غرامة تصل إلى 100,000 درهم وإمكانية الحكم ببطلان معالجة قاعدة البيانات ومصادرتها وفق المادة 53.',
    cndpForms: ['Formulaire D-1 (Notice explicative)'],
    matchKeywords: ['art. 3', 'article 3', 'المادة 3', 'consent', 'موافقة', 'رضا', 'opt-in', 'consentement']
  },
  {
    id: 'art-4',
    number: 'Article 4',
    numberAr: 'المادة 4',
    chapterNumber: 2,
    chapterTitle: 'Titre II: Qualité des données et légitimité des traitements',
    chapterTitleAr: 'الباب الثاني: جودة المعطيات ومشروعية المعالجة',
    category: 'purpose',
    title: 'Legitimate Purpose, Proportionality & Retention Limits',
    titleAr: 'مشروعية الغايات، مبدأ التناسب وتحديد مدة الحفظ',
    summary: 'Data must be collected for specified, explicit, and legitimate purposes, must be adequate and proportionate, and retained no longer than necessary.',
    summaryAr: 'يجب جمع المعطيات لغايات محددة وصريحة ومشروعة، وأن تكون ملائمة وغير مفرطة، ولا يجوز حفظها لمدة تفوق المدة الضرورية لتحقيق الغايات.',
    legalTextFr: 'Les données à caractère personnel doivent être: 1° traitées loyalement et licitement; 2° collectées pour des finalités déterminées, explicites et légitimes; 3° adéquates, pertinentes et non excessives au regard des finalités; 4° conservées pendant une durée n\'excédant pas celle nécessaire.',
    legalTextAr: 'يجب أن تكون المعطيات ذات الطابع الشخصي: 1- معالجة بنزاهة ومشروعية؛ 2- مجمعة لغايات محددة وصريحة ومشروعة؛ 3- ملائمة ومناسبة وغير مفرطة؛ 4- محفوظة لمدة لا تتجاوز المدة الضرورية لإنجاز الغايات التي جمعت من أجلها.',
    dpoExplanation: 'Organizations cannot collect unnecessary citizen data (e.g. demanding CIN number for a basic newsletter). Clear data retention schedules and automated purging scripts must be enforced.',
    dpoExplanationAr: 'يمنع جمع معطيات غير ضرورية (مثل طلب رقم البطاقة الوطنية CIN لمجرد الاشتراك في نشرة بريدية). يجب تحديد جدول رسمي لآجال مسح وحذف البيانات القديمة آلياً.',
    auditRelevance: 'Audits form input field requirements and checks privacy policy for stated data retention schedules (durées de conservation).',
    auditRelevanceAr: 'يفحص الحقول المطلوبة في الاستمارات ويتحقق من تضمين سياسة الخصوصية لجدول صريح يوضح مدة حفظ كل صنف من المعطيات.',
    remediationSteps: [
      'Eliminate non-essential form fields from checkout and registration funnels.',
      'Publish explicit retention timeframes (e.g., 3 years for customer records, 13 months for cookies).',
      'Implement scheduled data purging routines in the production database.'
    ],
    remediationStepsAr: [
      'حذف الحقول غير الضرورية من استمارات التسجيل والشراء.',
      'تحديد آجال الحفظ صراحة (مثال: 3 سنوات لمعطيات الزبناء، 13 شهراً لملفات الكوكيز).',
      'برمجة سكربتات دورية لأرشفة ومسح المعطيات المنتهية الصلاحية بقاعدة البيانات.'
    ],
    penalties: '20,000 to 200,000 MAD fine under Article 53 for diverting processing purposes.',
    penaltiesAr: 'غرامة من 20,000 إلى 200,000 درهم وفق المادة 53 في حال تحويل المعطيات عن غايتها المعلنة.',
    cndpForms: ['Formulaire D-1 (Cadre Finalités)'],
    matchKeywords: ['art. 4', 'article 4', 'المادة 4', 'purpose', 'غاية', 'تناسب', 'حفظ', 'finalité', 'retention']
  },
  {
    id: 'art-12',
    number: 'Article 12',
    numberAr: 'المادة 12',
    chapterNumber: 3,
    chapterTitle: 'Titre III: Droits de la personne concernée - Droit à l\'information',
    chapterTitleAr: 'الباب الثالث: حقوق الشخص المعني بالأمر - حق الإعلام',
    category: 'transparency',
    title: 'Mandatory Prior Information & CNDP Disclosure',
    titleAr: 'إلزامية الإعلام المسبق وإشهار مرجع ترخيص CNDP',
    summary: 'Data controller must inform data subjects of their identity, processing purposes, recipients, rights of access/rectification, and the formal CNDP declaration receipt number.',
    summaryAr: 'يلزم المسؤول عن المعالجة بإخبار المعني بالأمر بهويته، وغايات المعالجة، والجهات المتلقية، وحقوق الولوج والتصحيح، ورقم وصل التصريح أو الإذن الصادر عن CNDP.',
    legalTextFr: 'Le responsable du traitement doit fournir à la personne auprès de laquelle il recueille des données à caractère personnel: son identité, les finalités du traitement, les destinataires des données, l\'existence des droits d\'accès et de rectification, ainsi que le récépissé de déclaration ou d\'autorisation de la CNDP.',
    legalTextAr: 'يجب على المسؤول عن المعالجة أن يدلي للشخص المعني الذي تم تحصيل معطياته بهويته، وغايات المعالجة، والجهات الموجهة إليها المعطيات، ووجود حقي الولوج والتصحيح، فضلاً عن رقم وتاريخ وصل التصريح أو الإذن المسلم من طرف اللجنة الوطنية CNDP.',
    dpoExplanation: 'Every website footer must link to an official Privacy Policy and Legal Notice containing the exact statutory CNDP declaration code (e.g., "Déclaration CNDP n° D-W-123/2024"). Missing this is one of the most frequent enforcement grounds.',
    dpoExplanationAr: 'يفرض هذا الفصل إدراج رقم وصل تصريح CNDP في أسفل صفحات الموقع وفي سياسة الخصوصية بصيغة صريحة (مثال: Déclaration CNDP n° D-W-123/2024)، وإشعار الزوار بحقوقهم القانونية.',
    auditRelevance: 'Auditor searches HTML, legal notices, and privacy documentation for the CNDP declaration stamp and mandatory legal disclosure clauses.',
    auditRelevanceAr: 'يقوم الفاحص بالبحث الدقيق في شفرة الموقع وأسفل الصفحات وسياسة الخصوصية عن رقم إشعار CNDP والبيانات الإلزامية.',
    remediationSteps: [
      'Obtain official declaration receipt (Récépissé D-1) from CNDP in Rabat.',
      'Display statement in website footer: "Traitement déclaré auprès de la CNDP sous le n° [D-W-XXX/202X]".',
      'Deploy comprehensive bilingual Privacy Notice detailing controller coordinates.'
    ],
    remediationStepsAr: [
      'إيداع ملف التصريح المسبق D-1 لدى مصالح CNDP بالرباط والحصول على الوصل.',
      'نشر عبارة التصريح في تذييل الموقع: "معالجة مصرح بها لدى CNDP تحت رقم [D-W-XXX/202X]".',
      'نشر سياسة خصوصية ثنائية اللغة (عربية/فرنسية) تتضمن تفاصيل المسؤول عن المعالجة.'
    ],
    penalties: 'Formal notice (Mise en demeure), fines up to 100,000 MAD, and public disclosure of non-compliance.',
    penaltiesAr: 'إنذار رسمي من CNDP مع إعطاء مهلة محددة، وغرامات مالية تصل إلى 100,000 درهم.',
    cndpForms: ['Formulaire D-1 (Déclaration Préalable)', 'Modèle Mention d\'information CNDP'],
    matchKeywords: ['art. 12', 'article 12', 'المادة 12', 'information', 'cndp', 'privacy policy', 'سياسة الخصوصية', 'وصل', 'إشعار', 'd-1', 'gap_privacy', 'gap_cndp', 'pass_cndp']
  },
  {
    id: 'art-13-14',
    number: 'Articles 13 & 14',
    numberAr: 'المادتان 13 و 14',
    chapterNumber: 3,
    chapterTitle: 'Titre III: Droits de la personne concernée - Accès et Rectification',
    chapterTitleAr: 'الباب الثالث: حقوق الشخص المعني بالأمر - الولوج والتصحيح',
    category: 'rights',
    title: 'Right of Access, Rectification & Erasure',
    titleAr: 'حق الولوج، التصحيح ومحو المعطيات الشخصية',
    summary: 'Guarantees the right of any individual to confirm whether their data is being processed, obtain a legible copy, and demand prompt correction or deletion of inaccurate records.',
    summaryAr: 'يضمن حق أي شخص في الحصول على تأكيد معالجة معطياته، والاطلاع عليها بنسخة واضحة، والمطالبة بتصحيحها أو استكمالها أو مسحها إذا كانت غير صحيحة.',
    legalTextFr: 'Art. 13: Toute personne a le droit d\'obtenir du responsable du traitement confirmation et communication sous une forme accessible des données faisant l\'objet de traitements.\nArt. 14: Toute personne a le droit d\'exiger que soient rectifiées, complétées, mises à jour, verrouillées ou effacées les données inexactes ou incomplètes.',
    legalTextAr: 'المادة 13: يحق لكل شخص ذاتي الحصول مجاناً من المسؤول عن المعالجة على تأكيد معالجة معطياته والتواصل بها في شكل يسهل فهمه.\nالمادة 14: يحق لكل شخص ذاتي المطالبة بتصحيح أو استكمال أو تحيين أو حجب أو محو المعطيات غير الصحيحة أو غير المكتملة.',
    dpoExplanation: 'Websites must provide an accessible mechanism (dedicated email like dpo@domain.ma or online ticket form) enabling Moroccan citizens to request data extracts or purge their profiles within 30 calendar days.',
    dpoExplanationAr: 'يلزم القانون بإنشاء مسار إلكتروني ميسر (بريد مخصص dpo@domain.ma أو استمارة رقمية) يمكن المواطنين من تقديم طلبات ممارسة حقوقهم والرد عليهم داخل أجل 30 يوماً.',
    auditRelevance: 'Inspects footer, support hubs, and privacy pages for dedicated data subject rights channels and DPO contact routing.',
    auditRelevanceAr: 'يفحص الموقع للتحقق من وجود رابط أو بريد إلكتروني مخصص لاستقبال طلبات الولوج والتصحيح وممارسة حقوق المواطنين.',
    remediationSteps: [
      'Create dedicated email address: dpo@domain.ma or conformite@domain.ma.',
      'Publish a structured 4-field request form for Data Subject Requests (DSR).',
      'Establish internal procedure with a maximum 30-day response turnaround.'
    ],
    remediationStepsAr: [
      'تخصيص بريد إلكتروني رسمي: dpo@domain.ma أو conformite@domain.ma.',
      'إنشاء استمارة إلكترونية مبسطة لاستقبال طلبات تصحيح ومحو المعطيات.',
      'اعتماد مسطرة داخلية تضمن معالجة الطلبات والرد عليها كتابياً في ظرف 30 يوماً كأقصى تقدير.'
    ],
    penalties: 'Fines of 20,000 to 100,000 MAD under Article 55 for refusing legitimate access requests.',
    penaltiesAr: 'غرامة من 20,000 إلى 100,000 درهم وفق المادة 55 عند الامتناع عن تمكين المواطنين من حقوقهم المشروعة.',
    cndpForms: ['Guide CNDP d\'exercice des droits'],
    matchKeywords: ['art. 13', 'art. 14', 'article 13', 'article 14', 'المادة 13', 'المادة 14', 'حقوق', 'ولوج', 'تصحيح', 'محو', 'access', 'rectification', 'rights', 'warn_rights']
  },
  {
    id: 'art-15',
    number: 'Article 15',
    numberAr: 'المادة 15',
    chapterNumber: 3,
    chapterTitle: 'Titre III: Droits de la personne concernée - Droit d\'opposition',
    chapterTitleAr: 'الباب الثالث: حقوق الشخص المعني بالأمر - حق التعرض',
    category: 'rights',
    title: 'Right to Object & Direct Marketing Prohibition',
    titleAr: 'حق التعرض ومنع الإشهار التجاري المباشر دون إذن',
    summary: 'Grants the data subject the right to object on legitimate grounds to processing, and absolute right without justification to refuse direct marketing and commercial prospecting.',
    summaryAr: 'يمنح المعني بالأمر حق التعرض لأسباب مشروعة على معالجة معطياته، وحقاً مطلقاً وبدون تعليل لرفض استغلال معطياته في الإشهار والتسويق التجاري المباشر.',
    legalTextFr: 'Toute personne a le droit de s\'opposer, pour des motifs légitimes, à ce que des données la concernant fassent l\'objet d\'un traitement. Elle a le droit de s\'opposer, sans frais et sans justification, à ce que les données soient utilisées à des fins de prospection, notamment commerciale.',
    legalTextAr: 'يحق لكل شخص ذاتي أن يتعرض لأسباب مشروعة على معالجة معطياته الشخصية. ويحق له دون أية مصاريف وبدون تعليل، التعرض على استعمال المعطيات لغايات الاستقراء لا سيما التجاري منها.',
    dpoExplanation: 'Marketing emails and SMS campaigns in Morocco must include an instant, one-click unsubscribe link. Using purchased cold lead lists without prior consent violates Article 15.',
    dpoExplanationAr: 'يجب أن تشتمل كل رسالة بريدية أو نصية تسويقية على رابط فوري بنقرة واحدة لإلغاء الاشتراك مجاناً (Lien de désinscription). بيع وشراء قوائم الاتصال بدون إذن ممنوع قطيعاً.',
    auditRelevance: 'Verifies presence of opt-out links and refusal mechanisms in marketing triggers and registration flows.',
    auditRelevanceAr: 'يفحص وجود روابط واضحة لإلغاء الاشتراك وعدم فرض الموافقة على الرسائل الإشهارية كشرط لاستخدام الخدمة.',
    remediationSteps: [
      'Incorporate 1-click unsubscribe links in all outgoing commercial communication.',
      'Separate terms of service acceptance from marketing newsletters opt-in.',
      'Maintain an internal suppression blacklist for opt-out requests.'
    ],
    remediationStepsAr: [
      'إدراج رابط إلغاء اشتراك فوري في أسفل جميع النشرات والرسائل الإشهارية.',
      'فصل الموافقة على شروط الاستخدام العامة عن الموافقة على استقبال العروض الإعلانية.',
      'تحيين لائحة الحظر المركزية (Suppression list) لمنع مراسلة من رفض الإشهار.'
    ],
    penalties: 'Fines up to 100,000 MAD and injunctions to cease commercial prospecting campaigns.',
    penaltiesAr: 'غرامة تصل إلى 100,000 درهم وأمر قضائي بوقف حملات التسويق غير المرخصة ومسح القوائم.',
    cndpForms: ['Modèle Opposition Prospection CNDP'],
    matchKeywords: ['art. 15', 'article 15', 'المادة 15', 'opposition', 'تعرض', 'marketing', 'prospection', 'إشهار', 'unsubscribe']
  },
  {
    id: 'art-16-19',
    number: 'Articles 16 à 19',
    numberAr: 'المواد من 16 إلى 19',
    chapterNumber: 4,
    chapterTitle: 'Titre IV: Formalités préalables - Régime de la déclaration',
    chapterTitleAr: 'الباب الرابع: الإجراءات القبلية - نظام التصريح المسبق',
    category: 'formalities',
    title: 'Statutory CNDP Prior Declaration Regime',
    titleAr: 'نظام التصريح المسبق الإلزامي لدى اللجنة الوطنية CNDP',
    summary: 'All automated or non-automated processing of personal data must be officially declared to CNDP prior to deployment, generating a formal administrative receipt.',
    summaryAr: 'تخضع جميع عمليات المعالجة الآلية أو غير الآلية للمعطيات الشخصية لإلزامية التصريح المسبق لدى CNDP قبل الشروع في تنفيذها، مع تسليم وصل إداري رسمي.',
    legalTextFr: 'Art. 16: Les traitements de données à caractère personnel font l\'objet d\'une déclaration préalable auprès de la CNDP. La déclaration comporte l\'engagement que le traitement satisfait aux exigences de la loi.',
    legalTextAr: 'المادة 16: تكون معالجة المعطيات ذات الطابع الشخصي محل تصريح مسبق يوجه إلى اللجنة الوطنية CNDP. ويتضمن التصريح التزاماً بمطابقة المعالجة لمقتضيات هذا القانون.',
    dpoExplanation: 'Before launching any e-commerce platform, corporate intranet, CRM, or client database in Morocco, the legal entity must file Formulaire D-1 with CNDP and await the formal receipt.',
    dpoExplanationAr: 'قبل إطلاق أي موقع تجارة إلكترونية، أو منصة حجز، أو قاعدة معطيات زبناء بالمغرب، يتعين إيداع الاستمارة D-1 لدى CNDP والحصول على الوصل القانوني قبل بدء التشغيل الفعلي.',
    auditRelevance: 'Scanner evaluates website against declared database records and validates CNDP receipt notation syntax.',
    auditRelevanceAr: 'يتحقق الفاحص من إعلان الموقع عن مرجع التصريح ومطابقته للصيغ المعتمدة لدى CNDP.',
    remediationSteps: [
      'Download and complete official Formulaire D-1 from www.cndp.ma.',
      'Submit dossier signed by the legal representative to CNDP Hay Riad, Rabat.',
      'Integrate the received receipt code (D-W-...) into platform documentation.'
    ],
    remediationStepsAr: [
      'تحميل وتعبئة الاستمارة الرسمية D-1 من البوابة الإلكترونية www.cndp.ma.',
      'إيداع الملف موقعاً من الممثل القانوني لدى مقر CNDP بحي الرياض، الرباط.',
      'إدراج رمز الوصل المسلم (D-W-...) في التوثيق الرقمي وأسفل صفحات الموقع.'
    ],
    penalties: 'Criminal sanctions under Art. 52: 3 months to 1 year imprisonment and 10,000 to 100,000 MAD fine.',
    penaltiesAr: 'عقوبات جنائية وفق المادة 52: الحبس من 3 أشهر إلى سنة وغرامة من 10,000 إلى 100,000 درهم.',
    cndpForms: ['Formulaire D-1 (Sites Web & Commerce électronique)', 'Formulaire D-2 (Gestion RH)'],
    matchKeywords: ['art. 16', 'art. 17', 'art. 18', 'art. 19', 'المادة 16', 'تصريح', 'declaration', 'd-1', 'd-2', 'cndp declaration']
  },
  {
    id: 'art-20-22',
    number: 'Articles 20 à 22',
    numberAr: 'المواد من 20 إلى 22',
    chapterNumber: 4,
    chapterTitle: 'Titre IV: Formalités préalables - Régime de l\'autorisation',
    chapterTitleAr: 'الباب الرابع: الإجراءات القبلية - نظام الإذن والترخيص المسبق',
    category: 'formalities',
    title: 'Prior Authorization Regime for Sensitive Data',
    titleAr: 'نظام الإذن المسبق للمعطيات الحساسة والمراقبة البصرية',
    summary: 'Requires express prior authorization from CNDP for processing biometric data, genetic/health records, video surveillance, or interconnection of disparate databases.',
    summaryAr: 'يشترط الحصول على إذن مسبق وصريح من CNDP قبل معالجة المعطيات البيومترية، أو الملفات الصحية والجينية، أو كاميرات المراقبة، أو الربط بين ملفات مختلفة.',
    legalTextFr: 'Art. 20: Sont soumis à l\'autorisation préalable de la CNDP: 1° les traitements portant sur les données génétiques, médicales ou de santé; 2° les traitements biométriques; 3° les traitements ayant pour objet l\'interconnexion de fichiers.',
    legalTextAr: 'المادة 20: تخضع لإذن مسبق من اللجنة الوطنية CNDP المعالجات المتعلقة بـ: 1- المعطيات الجينية أو الصحية؛ 2- المعطيات البيومترية؛ 3- المعالجات الرامية إلى الربط البيني بين الملفات.',
    dpoExplanation: 'Medical teleconsultation platforms, fitness tracking portals, or authentication systems using fingerprint/facial biometrics cannot operate on simple declaration; formal CNDP Commission Deliberation approval is mandatory.',
    dpoExplanationAr: 'منصات التطبيب عن بعد، وتطبيقات الصحة، وأنظمة الدخول بالبصمة البيومترية لا يكفيها التصريح البسيط، بل يلزمها إذن رسمي صادر عن مداولات اللجنة الوطنية بالرباط.',
    auditRelevance: 'Screens whether scanned application collects health data, biometric identifiers, or executes cross-system database interconnections.',
    auditRelevanceAr: 'يتحقق الفحص مما إذا كان الموقع يجمع معطيات حساسة تستوجب إذناً خاصاً بدلاً من التصريح العادي.',
    remediationSteps: [
      'File Formulaire A-1 (Demande d\'autorisation préalable).',
      'Submit detailed technical architecture and data encryption scheme to CNDP.',
      'Suspend processing of biometric/health telemetry until written decree is issued.'
    ],
    remediationStepsAr: [
      'إيداع الاستمارة A-1 (طلب الحصول على إذن مسبق) لدى CNDP.',
      'تقديم تقرير فني يوضح خطة التشفير والهندسة التقنية المعتمدة لحماية المعطيات.',
      'عدم تفعيل معالجة البيانات الصحية أو البيومترية إلا بعد صدور قرار الإذن المكتوب.'
    ],
    penalties: 'Criminal sanctions under Art. 52: 3 months to 1 year imprisonment and up to 100,000 MAD fine.',
    penaltiesAr: 'الحبس من 3 أشهر إلى سنة وغرامة تصل إلى 100,000 درهم وفق المادة 52.',
    cndpForms: ['Formulaire A-1 (Demande d\'Autorisation)', 'Formulaire A-4 (Données de santé)'],
    matchKeywords: ['art. 20', 'art. 21', 'art. 22', 'المادة 20', 'autorisation', 'إذن', 'ترخيص', 'صحة', 'بيومتري', 'biométrie', 'santé']
  },
  {
    id: 'art-23',
    number: 'Article 23',
    numberAr: 'المادة 23',
    chapterNumber: 5,
    chapterTitle: 'Titre V: Obligations du responsable - Confidentialité et sécurité',
    chapterTitleAr: 'الباب الخامس: التزامات المسؤول - السرية وأمن المعالجة',
    category: 'security',
    title: 'Technical Security & Cryptographic Safeguards',
    titleAr: 'التدابير التقنية والتنظيمية الإلزامية لأمن وسرية المعطيات',
    summary: 'The data controller is legally bound to implement appropriate technical and organizational measures protecting data against accidental destruction, loss, alteration, or unauthorized access.',
    summaryAr: 'يلزم المسؤول عن المعالجة باتخاذ كافة التدابير التقنية والتنظيمية الملائمة لضمان أمن المعطيات وحمايتها من الإتلاف العرضي أو الضياع أو التسريب أو الولوج غير المرخص.',
    legalTextFr: 'Le responsable du traitement est tenu de prendre toutes précautions utiles, au regard de la nature des données et des risques présentés par le traitement, pour préserver la sécurité des données et, notamment, empêcher qu\'elles soient déformées, endommagées, ou que des tiers non autorisés y aient accès.',
    legalTextAr: 'يلزم المسؤول عن المعالجة باتخاذ كافة التدابير التقنية والتنظيمية المناسبة للمحافظة على أمن المعطيات، لا سيما تفادي تشويهها أو إتلافها أو اطلاع أشخاص غير مرخص لهم عليها بالنظر لطبيعة المعطيات ومخاطر المعالجة.',
    dpoExplanation: 'Enforces TLS 1.3 encryption for web transit, salted cryptographic hashing (Argon2/bcrypt) for stored credentials, role-based access control (RBAC), and strict database access segregation.',
    dpoExplanationAr: 'يفرض تشفير قنوات الاتصال ببروتوكولات حديثة (TLS 1.3)، وتشفير كلمات المرور في قواعد المعطيات، وتحديد صلاحيات الولوج (RBAC)، وعزل قواعد المعطيات خلف جدران حماية نارية.',
    auditRelevance: 'Inspects SSL/TLS cipher suites, HTTPS enforcement, HSTS headers, secure cookie flags, and transport encryption posture.',
    auditRelevanceAr: 'يقوم الفاحص باختبار شهادة الأمان TLS، وإلزامية بروتوكول HTTPS، وترويسات الأمان الصارمة HSTS، وخصائص حماية الكوكيز (Secure, HttpOnly).',
    remediationSteps: [
      'Enforce TLS 1.3 protocol and disable legacy protocols (TLS 1.0, 1.1, SSLv3).',
      'Deploy HTTP Strict Transport Security (HSTS) with minimum 1-year max-age.',
      'Configure regular encrypted backups stored in segregated sovereign storage.'
    ],
    remediationStepsAr: [
      'تفعيل بروتوكول TLS 1.3 وإيقاف البروتوكولات القديمة غير الآمنة كلياً.',
      'تثبيت ترويسة HSTS لفرض الاتصال الآمن مع تفعيل إعدادات Preload.',
      'برمجة نسخ احتياطية مشفرة دورياً وحفظها في بنية استضافة معزولة وآمنة.'
    ],
    penalties: 'Criminal sanctions under Art. 54: 3 months to 1 year imprisonment and 20,000 to 200,000 MAD fine for failing to protect data.',
    penaltiesAr: 'عقوبة جنائية وفق المادة 54: الحبس من 3 أشهر إلى سنة وغرامة من 20,000 إلى 200,000 درهم عن الإخلال بأمن المعطيات.',
    cndpForms: ['Délibération CNDP n° 335-2013 sur la sécurité'],
    matchKeywords: ['art. 23', 'article 23', 'المادة 23', 'security', 'أمن', 'تشفير', 'tls', 'ssl', 'حماية', 'confidentialité', 'gap_ssl', 'pass_ssl']
  },
  {
    id: 'art-24-25',
    number: 'Articles 24 & 25',
    numberAr: 'المادتان 24 و 25',
    chapterNumber: 5,
    chapterTitle: 'Titre V: Obligations du responsable - Sous-traitance et secret',
    chapterTitleAr: 'الباب الخامس: التزامات المسؤول - المعالجة من الباطن والسر المهني',
    category: 'security',
    title: 'Subcontractor Liability & Professional Secrecy',
    titleAr: 'مسؤولية المقاول من الباطن والالتزام بالسر المهني',
    summary: 'Subcontractors (cloud vendors, SaaS providers, developers) must guarantee adequate security and be bound by a formal written contract ensuring compliance with Law 08-09.',
    summaryAr: 'يلزم المقاول من الباطن (مزودو السحابة، شركات تطوير البرمجيات) بتقديم ضمانات أمنية كافية والارتباط بعقد مكتوب يفرض الالتزام الصارم بالقانون 08.09 والسر المهني.',
    legalTextFr: 'Art. 24: Le traitement de données par un sous-traitant doit être régi par un contrat écrit liant le sous-traitant au responsable du traitement, stipulant que le sous-traitant n\'agit que sur instruction et qu\'il applique les mesures de sécurité.\nArt. 25: Toute personne appelée à traiter des données est tenue au secret professionnel.',
    legalTextAr: 'المادة 24: يجب أن تتم المعالجة المنجزة من لدن مقاول من الباطن بموجب عقد مكتوب يربطه بالمسؤول عن المعالجة، يلزمه بالعمل وفق التعليمات فقط وتطبيق تدابير الأمن والسلامة.\nالمادة 25: يلزم كل شخص يتدخل في معالجة المعطيات بالسر المهني حتى بعد انتهاء مهامه.',
    dpoExplanation: 'Companies using third-party web agencies or cloud providers must execute a Data Processing Agreement (DPA / Accord de sous-traitance) stating Law 08-09 jurisdiction.',
    dpoExplanationAr: 'يجب على الشركات التي تستعين بوكالات رقمية أو مزودي برمجيات توقيع ملحق حماية المعطيات (DPA) يحدد المسؤوليات ويخضع للاختصاص القضائي المغربي.',
    auditRelevance: 'Audits third-party embedded JavaScript vendors (analytics, live chats, payment gateways) and identifies external processor dependencies.',
    auditRelevanceAr: 'يرصد الفاحص كافة السكربتات ومزودي الخدمات المدمجة بالموقع (مثل خدمات الدفع، التحليلات، الشات) لتحديد المقاولين من الباطن.',
    remediationSteps: [
      'Execute Moroccan Law 08-09 compliant DPA with all IT providers and cloud vendors.',
      'Require non-disclosure agreements (NDA) and confidentiality clauses for all technical staff.',
      'Audit third-party SaaS vendors and restrict data sharing APIs.'
    ],
    remediationStepsAr: [
      'توقيع عقود معالجة فرعية (DPA) خاضعة للقانون 08.09 مع كافة مزودي البرمجيات.',
      'إلزام المطورين وموظفي تكنولوجيا المعلومات بتوقيع التزام بالسر المهني.',
      'إجراء تدقيق دوري لشركاء التكنولوجيا الخارجيين وحصر مشاركة البيانات عبر API.'
    ],
    penalties: 'Shared civil and criminal liability between controller and subcontractor under Arts. 54 & 64.',
    penaltiesAr: 'مسؤولية تضامنية جنائية ومدنية بين الشركة والمقاول من الباطن وفق المادتين 54 و 64.',
    cndpForms: ['Modèle Clause Sous-traitance CNDP'],
    matchKeywords: ['art. 24', 'art. 25', 'article 24', 'article 25', 'المادة 24', 'المادة 25', 'sous-traitance', 'مقاول من الباطن', 'سر مهني', 'dpa']
  },
  {
    id: 'art-43-44',
    number: 'Articles 43 & 44',
    numberAr: 'المادتان 43 و 44',
    chapterNumber: 6,
    chapterTitle: 'Titre VI: Transfert des données vers un pays étranger',
    chapterTitleAr: 'الباب السادس: نقل المعطيات نحو دولة أجنبية والسيادة الرقمية',
    category: 'transfer',
    title: 'Cross-Border Data Transfers & Cloud Sovereignty',
    titleAr: 'التحويل الدولي للمعطيات وحماية السيادة الرقمية السحابية',
    summary: 'Transfer of personal data outside Morocco is prohibited unless authorized in advance by CNDP or directed to a jurisdiction providing adequate data protection levels.',
    summaryAr: 'يحظر نقل المعطيات ذات الطابع الشخصي إلى دولة أجنبية إلا بترخيص مسبق من CNDP أو نحو دول توفر مستوى حماية كافٍ، مع إبرام بنود تعاقدية نموذجية.',
    legalTextFr: 'Art. 43: Le responsable d\'un traitement ne peut transférer des données vers un pays étranger que si cet Etat assure un niveau de protection suffisant de la vie privée et des droits et libertés fondamentaux, ou avec l\'autorisation préalable de la CNDP.',
    legalTextAr: 'المادة 43: لا يمكن للمسؤول عن معالجة نقل معطيات ذات طابع شخصي نحو دولة أجنبية إلا إذا كانت هذه الدولة تضمن مستوى حماية كافياً للحياة الخاصة والحريات والحقوق الأساسية، أو بعد الحصول على إذن مسبق من اللجنة الوطنية CNDP.',
    dpoExplanation: 'Hosting citizen databases on AWS (US/Ireland), Google Cloud, or foreign SaaS services without CNDP cross-border authorization is illegal. Platforms must either host locally in Morocco or obtain the explicit CNDP transfer visa.',
    dpoExplanationAr: 'استضافة قواعد بيانات المغاربة على خوادم أجنبية (AWS، أزور، جوجل) بدون ترخيص مسبق لنقل المعطيات من CNDP يشكل مخالفة جسيمة. يلزم ترخيص رسمي أو الاستضافة داخل مراكز بيانات مغربية.',
    auditRelevance: 'Resolves website IP address, performs autonomous system (ASN) reverse lookup, and identifies geolocation of hosting datacenters.',
    auditRelevanceAr: 'يقوم الفاحص بتحديد عنوان IP الخاص بالخادم والاستعلام عن الموقع الجغرافي لمركز البيانات ومزود الاستضافة (ASN).',
    remediationSteps: [
      'Submit Demande de Transfert Transfrontalier (Formulaire T-1) to CNDP.',
      'Deploy Standard Contractual Clauses (Clauses contractuelles types CNDP).',
      'Or migrate core databases to Moroccan sovereign clouds (Maroc Telecom, Inwi, Cloud Temple Maroc).'
    ],
    remediationStepsAr: [
      'إيداع طلب ترخيص نقل المعطيات نحو الخارج (استمارة T-1) لدى CNDP.',
      'توقيع البنود التعاقدية النموذجية المعتمدة لحماية البيانات خارج الحدود.',
      'أو ترحيل قواعد البيانات الحساسة إلى مراكز استضافة وطنية سيادية بالمغرب.'
    ],
    penalties: 'Criminal sanctions under Art. 56: 3 months to 1 year imprisonment and 20,000 to 200,000 MAD fine.',
    penaltiesAr: 'عقوبات جنائية وفق المادة 56: الحبس من 3 أشهر إلى سنة وغرامة من 20,000 إلى 200,000 درهم.',
    cndpForms: ['Formulaire T-1 (Transfert de données vers l\'étranger)', 'Contrat-type CNDP Transfert'],
    matchKeywords: ['art. 43', 'art. 44', 'article 43', 'article 44', 'المادة 43', 'المادة 44', 'transfert', 'نقل المعطيات', 'خارج', 'سحابة', 'sovereignty', 'سيادة', 'warn_sovereignty', 'pass_sovereignty']
  },
  {
    id: 'art-52',
    number: 'Article 52',
    numberAr: 'المادة 52',
    chapterNumber: 7,
    chapterTitle: 'Titre VII: Sanctions pénales - Défaut de déclaration',
    chapterTitleAr: 'الباب السابع: العقوبات الجنائية - التخلف عن التصريح',
    category: 'penalties',
    title: 'Penalties for Operating Without CNDP Declaration',
    titleAr: 'العقوبات الجنائية على معالجة المعطيات دون تصريح مسبق',
    summary: 'Punishes operating an undeclared personal data processing system with 3 months to 1 year imprisonment and fines from 10,000 to 100,000 MAD.',
    summaryAr: 'يعاقب كل من يقوم بإحداث أو تشغيل معالجة لمعطيات شخصية دون إنجاز التصريح المسبق بالحبس من 3 أشهر إلى سنة وغرامة من 10,000 إلى 100,000 درهم.',
    legalTextFr: 'Est puni d\'un emprisonnement de trois mois à un an et d\'une amende de 10.000 à 100.000 DH, ou de l\'une de ces deux peines seulement, quiconque met en œuvre un traitement de données sans avoir procédé à la déclaration ou obtenu l\'autorisation requise.',
    legalTextAr: 'يعاقب بالحبس من ثلاثة أشهر إلى سنة وبغرامة من 10.000 إلى 100.000 درهم أو بإحدى هاتين العقوبتين فقط كل من أنجز معالجة معطيات ذات طابع شخصي دون القيام بالتصريح أو الحصول على الإذن المطلوب.',
    dpoExplanation: 'Legal managers and corporate executives are directly criminally liable if their website collects personal data without an active CNDP declaration file on record.',
    dpoExplanationAr: 'يتحمل المسير القانوني ومدير الشركة المسؤولية الجنائية الشخصية المباشرة في حال تشغيل موقع يجمع معطيات دون ملف تصريح رسمي مودع لدى CNDP.',
    auditRelevance: 'Calculates the statutory penalty tier whenever CNDP receipt is missing from the scanned site.',
    auditRelevanceAr: 'يحدد الفاحص حجم الخطر المالي والقضائي المترتب عند غياب مرجع التصريح لدى CNDP.',
    remediationSteps: [
      'File emergency D-1 regularization dossier with CNDP immediately.',
      'Cease collecting sensitive user telemetry until administrative receipt is received.'
    ],
    remediationStepsAr: [
      'إيداع ملف تسوية عاجل D-1 لدى مصالح CNDP دون تأخير.',
      'تجميد جمع المعطيات غير الأساسية مؤقتاً لحين استلام الوصل الإداري.'
    ],
    penalties: '3 months to 1 year imprisonment and 10,000 to 100,000 MAD fine (multiplied up to 5x for legal entities).',
    penaltiesAr: 'الحبس من 3 أشهر إلى سنة وغرامة من 10,000 إلى 100,000 درهم (تضاعف حتى 5 مرات بالنسبة للشركات).',
    cndpForms: ['Formulaire D-1 Régularisation'],
    matchKeywords: ['art. 52', 'article 52', 'المادة 52', 'عقوبات', 'حبس', 'غرامة', 'sanction', 'penalties', 'infraction']
  },
  {
    id: 'art-54',
    number: 'Article 54',
    numberAr: 'المادة 54',
    chapterNumber: 7,
    chapterTitle: 'Titre VII: Sanctions pénales - Défaut de sécurité',
    chapterTitleAr: 'الباب السابع: العقوبات الجنائية - الإخلال بالتدابير الأمنية',
    category: 'penalties',
    title: 'Penalties for Security Negligence & Data Breaches',
    titleAr: 'العقوبات الجنائية على الإهمال الأمني وتسريب المعطيات',
    summary: 'Sanctions failure to adopt mandatory security measures (Article 23) leading to data alteration, loss, or unauthorized breach with 3 months to 1 year imprisonment and fines up to 200,000 MAD.',
    summaryAr: 'يعاقب بالحبس من 3 أشهر إلى سنة وغرامة تصل إلى 200,000 درهم عن الإخلال بالتدابير الأمنية الإلزامية المؤدي إلى إتلاف أو ضياع أو تسريب المعطيات الشخصية.',
    legalTextFr: 'Est puni d\'un emprisonnement de trois mois à un an et d\'une amende de 20.000 à 200.000 DH quiconque, n\'ayant pas pris les mesures de sécurité prévues à l\'article 23, aura permis la destruction, la perte ou l\'accès non autorisé aux données.',
    legalTextAr: 'يعاقب بالحبس من ثلاثة أشهر إلى سنة وبغرامة من 20.000 إلى 200.000 درهم كل من تهاون في اتخاذ التدابير الأمنية المنصوص عليها في المادة 23 وأدى ذلك إلى إتلاف أو ضياع المعطيات أو تسريبها لأشخاص غير مرخص لهم.',
    dpoExplanation: 'Leaving databases exposed without encryption, using expired SSL certificates, or suffering an avoidable cyber breach constitutes criminal negligence under Moroccan jurisprudence.',
    dpoExplanationAr: 'ترك قواعد البيانات دون تشفير، أو استخدام شهادات أمان منتهية الصلاحية، أو وقوع تسريب معطيات بسبب التهاون التقني يعتبر خطأ جسيماً موجباً للمتابعة الجنائية.',
    auditRelevance: 'Triggered when technical transport encryption (TLS) or sensitive storage safety checks fail.',
    auditRelevanceAr: 'يتم استحضار هذه المادة عند فشل فحص تشفير الاتصال أو اكتشاف ثغرات أمنية في نقل وحفظ المعطيات.',
    remediationSteps: [
      'Conduct third-party penetration testing and vulnerability assessment.',
      'Deploy end-to-end cryptographic safeguards across database and API tiers.'
    ],
    remediationStepsAr: [
      'إجراء فحص اختراق أمني دوري بواسطة خبراء معتمدين لتشخيص الثغرات.',
      'تطبيق التشفير الشامل للمعطيات الحساسة في قواعد البيانات وقنوات الربط البرمجي.'
    ],
    penalties: 'Imprisonment from 3 months to 1 year and fines from 20,000 to 200,000 MAD.',
    penaltiesAr: 'الحبس من 3 أشهر إلى سنة وغرامة من 20,000 إلى 200,000 درهم.',
    cndpForms: ['Formulaire Notification de Violation CNDP'],
    matchKeywords: ['art. 54', 'article 54', 'المادة 54', 'تسريب', 'إهمال أمني', 'breach', 'fuite', 'sanction sécurité']
  },
  {
    id: 'cndp-08-2020',
    number: 'Délibération 08-2020',
    numberAr: 'مداولة CNDP رقم 08-2020',
    chapterNumber: 8,
    chapterTitle: 'Directives Spéciales CNDP: Traceurs, Cookies et CMP',
    chapterTitleAr: 'توجيهات CNDP الخاصة: ملفات التتبع والكوكيز وبوابات الموافقة',
    category: 'cookies',
    title: 'Cookie Consent Gate & Tracker Guidelines',
    titleAr: 'المداولة الإلزامية لملفات تعريف الارتباط والكوكيز وبوابات CMP',
    summary: 'Prohibits dropping non-essential analytics and marketing trackers prior to explicit opt-in, mandates equal prominent Refuse/Accept buttons, and prohibits cookie walls.',
    summaryAr: 'تحظر المداولة تنزيل ملفات التتبع التحليلي أو الإعلاني قبل الموافقة الصريحة، وتفرض زر "رفض" بنفس حجم ومظهر زر "قبول"، وتمنع حجب الموقع عند الرفض (Cookie Walls).',
    legalTextFr: 'La CNDP rappelle que le dépôt de cookies non strictement nécessaires (mesure d\'audience, reciblage, réseaux sociaux) est subordonné au consentement préalable de l\'internaute. Le refus doit être aussi simple à exprimer que l\'acceptation.',
    legalTextAr: 'تؤكد اللجنة الوطنية CNDP أن تثبيت ملفات الكوكيز غير الضرورية تقنياً (مثل تحليلات الزوار، بكسل فيسبوك، الإعلانات الموجهة) مشروط بالموافقة المسبقة والصريحة للمستخدم، ويجب أن يكون خيار الرفض متاحاً بنفس سهولة ووضوح خيار القبول.',
    dpoExplanation: 'Dark patterns such as giant green "Accept All" with hidden gray "Settings" or dropping Google Analytics scripts immediately on page load are non-compliant and routinely penalized by CNDP.',
    dpoExplanationAr: 'الحيل التصميمية (Dark patterns) مثل إبراز زر "قبول الكل" وإخفاء زر الرفض، أو تشغيل Google Analytics تلقائياً قبل نقر الزائر، تخالف صراحة قرارات CNDP.',
    auditRelevance: 'Audits cookie banner DOM structure, verifies whether analytics scripts fire before click, and evaluates opt-in parity.',
    auditRelevanceAr: 'يفحص بنية نافذة الكوكيز، ويتحقق مما إذا كانت سكربتات التتبع تعمل قبل تفاعل المستخدم، ويقيس التوازن بين زري القبول والرفض.',
    remediationSteps: [
      'Install a compliant CMP (Cookiebot, Axeptio, Didomi, or custom compliant script).',
      'Hold all marketing and analytical scripts until window.dataLayer triggers consent status.',
      'Ensure "Refuse All" button has equal optical weight and color contrast as "Accept All".'
    ],
    remediationStepsAr: [
      'تثبيت بوابة موافقة مطابقة (CMP) تحجب ملفات التتبع تلقائياً.',
      'إيقاف إطلاق سكربتات التحليلات والتسويق حتى ينقر الزائر صراحة على القبول.',
      'جعل زر "رفض الكل" بنفس الحجم والوضوح والتباين البصري لزر "قبول الكل".'
    ],
    penalties: 'Formal notice (Mise en demeure), suspension of advertising tracking tags, and administrative fines.',
    penaltiesAr: 'إنذار رسمي من CNDP، وإلزام الموقع بإيقاف سكربتات التتبع فوراً تحت طائلة المتابعة القضائية.',
    cndpForms: ['Lignes directrices CNDP sur les traceurs'],
    matchKeywords: ['deliberation 08-2020', 'délibération 08-2020', '08-2020', 'cookie', 'cookies', 'كوكيز', 'تتبع', 'cmp', 'traceurs', 'warn_cookie', 'pass_cookie']
  }
];
