import { DpiaQuestion, SubjectRightTemplate } from '../types/enterpriseFeatures';

export const DPIA_ASSESSMENT_QUESTIONS: DpiaQuestion[] = [
  {
    id: 'dpia-q1',
    category: 'Biometrics & AI',
    categoryAr: 'الذكاء الاصطناعي والقياسات الحيوية',
    question: 'Does the processing use Biometric recognition (Fingerprints, Facial Recognition, Voice ID)?',
    questionAr: 'هل تتضمن المعالجة استخدام تقنيات البصمة الحيوية (بصمات الأصابع، التعرف على الوجه، بصمة الصوت)؟',
    description: 'Under Moroccan Law 08-09 (Art 12), biometric processing categorically requires Prior Authorization from CNDP.',
    descriptionAr: 'المادة 12 من القانون 08-09 تنص صراحة على أن المعالجات الحيوية تخضع إلزامياً لإذن مسبق وموافقة كتابية من CNDP.',
    scoreWeight: 3,
    isTrigger: true
  },
  {
    id: 'dpia-q2',
    category: 'Sovereignty & Cross-border',
    categoryAr: 'السيادة ونقل المعطيات للخارج',
    question: 'Are personal data transferred or hosted on servers located outside the Kingdom of Morocco?',
    questionAr: 'هل يتم استضافة البيانات أو نقلها إلى خوادم أو مزودي خدمات سحابية يقعون خارج التراب الوطني للمملكة؟',
    description: 'Mandatory CNDP Transfer Authorization required under Articles 43 and 44 with rigorous sovereignty vetting.',
    descriptionAr: 'يلزم الحصول على ترخيص نقل البيانات خارج المملكة بموجب المادتين 43 و44 مع إثبات توفير مستوى حماية كافٍ.',
    scoreWeight: 3,
    isTrigger: true
  },
  {
    id: 'dpia-q3',
    category: 'Surveillance & Tracking',
    categoryAr: 'المراقبة المستمرة والتتبع الجغرافي',
    question: 'Does the solution perform systematic geolocation tracking (GPS) or extensive CCTV monitoring of individuals?',
    questionAr: 'هل يقوم النظام بالتتبع الجغرافي المستمر (GPS) للموظفين أو الرصد البصري المكثف للأفراد عبر الكاميرات؟',
    description: 'CNDP regulations restrict continuous monitoring and require explicit prior notice, purpose limitation, and maximum retention rules.',
    descriptionAr: 'تخضع أنظمة المراقبة الدائمة لضوابط صارمة من CNDP للحد من المساس بالحياة الخاصة للمواطنين والعمال.',
    scoreWeight: 2,
    isTrigger: true
  },
  {
    id: 'dpia-q4',
    category: 'Sensitive Data (Art 21)',
    categoryAr: 'المعطيات الحساسة (المادة 21)',
    question: 'Does the system process health data, religious/political beliefs, trade union affiliations, or criminal records?',
    questionAr: 'هل تشمل المعالجة معطيات حساسة كالملفات الطبية، المعتقدات، الانتماء النقابي، أو السجلات القضائية؟',
    description: 'Article 21 of Law 08-09 formally forbids processing sensitive data without strict statutory exemptions or express written consent.',
    descriptionAr: 'المادة 21 تحظر معالجة المعطيات الحساسة إلا في حالات استثنائية محددة قانوناً وتتطلب ترخيصاً رسمياً مسبقاً.',
    scoreWeight: 3,
    isTrigger: true
  },
  {
    id: 'dpia-q5',
    category: 'Automated Profiling & AI Decisions',
    categoryAr: 'التوصيف الآلي وقرارات الذكاء الاصطناعي',
    question: 'Are automated algorithms or AI scoring models evaluating creditworthiness, performance, or behavior without human review?',
    questionAr: 'هل يتم الاعتماد على خوارزميات ذكاء اصطناعي أو تنقيط آلي لاتخاذ قرارات تؤثر مباشرة على الوضع القانوني أو المالي للأشخاص دون مراجعة بشرية؟',
    description: 'Individuals possess the right to reject fully automated decisions having legal effects under modern privacy doctrines.',
    descriptionAr: 'يحق للمواطن بموجب القوانين المنظمة رفض القرارات المستندة كلياً إلى المعالجة الآلية إذا كانت ترتب آثاراً قانونية.',
    scoreWeight: 2,
    isTrigger: false
  },
  {
    id: 'dpia-q6',
    category: 'Scale & Vulnerable Populations',
    categoryAr: 'حجم المعالجة والفئات الهشة (الأطفال)',
    question: 'Does the processing involve large-scale data of Moroccan minors/children or more than 50,000 unique records?',
    questionAr: 'هل تشمل المعالجة بيانات واسعة النطاق لأطفال وقاصرين، أو تتجاوز قاعدة البيانات 50,000 سجل شخصي؟',
    description: 'High volume and youth data necessitate robust safeguards, strict cryptographic protection, and parental consent mechanics.',
    descriptionAr: 'معالجة بيانات القاصرين أو المعطيات الضخمة تتطلب دروع حماية مشددة وموافقة أولياء الأمور وحماية تشفيرية مضاعفة.',
    scoreWeight: 2,
    isTrigger: false
  }
];

export const SUBJECT_RIGHTS_TEMPLATES: SubjectRightTemplate[] = [
  {
    id: 'template-access',
    titleAr: 'نموذج ممارسة حق الولوج إلى البيانات الشخصية (المادة 7)',
    titleEn: 'Right of Access Request & Official Response (Article 7)',
    lawArticle: 'المادة 7 من القانون 08-09',
    category: 'ACCESS',
    descriptionAr: 'يمنح المعني بالأمر حق الحصول من مسؤول المعالجة على تأكيد معالجة بياناته والحصول على نسخة مطابقة منها خلال أجل لا يتعدى 30 يوماً.',
    descriptionEn: 'Allows data subjects to obtain confirmation and full transcript of their processed data within the statutory 30-day window.',
    slaDays: 30,
    templateType: 'OFFICIAL_RESPONSE',
    arabicText: `المملكة المغربية
إلى السيد(ة): [اسم المواطن / طالب الحق]
الموضوع: الاستجابة لطلب ممارسة حق الولوج (المادة 7 من القانون رقم 08-09)

تحية طيبة وبعد،

بناءً على طلبكم المؤرخ في [تاريخ الطلب] والمتعلق بممارسة حق الولوج إلى بياناتكم ذات الطابع الشخصي المعالجة في منظومتنا؛
يشرفنا أن نؤكد لكم أن مؤسستنا، بصفتها مسؤولاً عن المعالجة ومصرحاً بها لدى اللجنة الوطنية لمراقبة حماية المعطيات ذات الطابع الشخصي (CNDP) تحت إشعار رقم [رقم التصريح]، قد قامت بحصر البيانات العائدة لكم كالتالي:

1. المعطيات التعريفية: [الاسم، البريد الإلكتروني، رقم الهاتف]
2. الغرض من المعالجة: [تنفيذ العقد المبرم بين الطرفين / تدبير الخدمة]
3. الفئات المتلقية للبيانات: [الإدارات المختصة حصراً]
4. مدة الحفظ المعتمدة: [مدة العلاقة التعاقدية + 5 سنوات]

تجدون رفقة هذه الرسالة مستخرجاً كاملاً ومؤمناً لكافة البيانات المسجلة باسمكم في سجلاتنا.

وتفضلوا بقبول أسمى عبارات التقدير والاحترام.

توقيع: مسؤول حماية المعطيات (DPO) / الممثل القانوني للمؤسسة`,
    frenchText: `Royaume du Maroc
À l'attention de : [Nom & Prénom du Demandeur]
Objet : Réponse à la demande d'exercice du Droit d'Accès (Article 7 de la Loi n° 08-09)

Madame, Monsieur,

Faisant suite à votre demande reçue en date du [Date de réception], relative à l'exercice de votre droit d'accès aux données à caractère personnel vous concernant, nous vous confirmons que notre organisme traite les données suivantes :

1. Données d'identification : [Nom, Prénom, Email, Téléphone]
2. Finalité du traitement : [Exécution de la relation contractuelle / Service client]
3. Destinataires habilités : [Services internes autorisés & Organismes légaux]
4. Durée de conservation : [Durée légale conforme au récépissé CNDP]

Veuillez trouver ci-joint l'extrait exhaustif et sécurisé des données enregistrées dans notre système d'information.

Veuillez agréer, Madame, Monsieur, l'expression de nos salutations distinguées.

Le Délégué à la Protection des Données (DPO)`
  },
  {
    id: 'template-erasure',
    titleAr: 'نموذج طلب وحق محو البيانات الشخصية / التعرض (المادة 8 والمادة 9)',
    titleEn: 'Right to Rectification & Erasure / Opposition (Articles 8 & 9)',
    lawArticle: 'المادتان 8 و9 من القانون 08-09',
    category: 'ERASURE',
    descriptionAr: 'وثيقة رسمية تفيد بحذف وتطهير البيانات بعد انتهاء الغرض القانوني أو عند اعتراض المعني بالأمر على استغلالها في التسويق المباشر.',
    descriptionEn: 'Formal acknowledgement of data deletion/rectification following subject request or objection to direct marketing.',
    slaDays: 30,
    templateType: 'OFFICIAL_RESPONSE',
    arabicText: `المملكة المغربية
إلى السيد(ة): [اسم المعني بالأمر]
الموضوع: إشهاد نهائي بمحو وتطهير البيانات الشخصية (المادتان 8 و9 من القانون 08-09)

تحية احترام وتقدير،

نحيطكم علماً بأن مصالحنا التقنية والقانونية قد قامت بتاريخ [تاريخ التنفيذ] بتنفيذ طلبكم القاضي بحذف ومحو كافة المعطيات ذات الطابع الشخصي الخاصة بكم من قواعد بياناتنا النشطة ومخازن النسخ الاحتياطية.

تفاصيل العملية:
- نوع العملية: تطهير كلي وحذف نهائي (Purge Définitive)
- النطاق: الحساب الإلكتروني وسجلات الاتصال والاشتراك في النشرات الترويجية
- الاستثناءات القانونية (إن وجدت): يتم الاحتفاظ فقط بالفواتير المحاسبية المتقادمة المفروضة بنص القانون الجبائي المغربي.

تؤكد المؤسسة أن بياناتكم لم تعد قابلة للاسترجاع أو الاستخدام لأي غرض تجاري أو إحصائي.

حرر بتاريخ: [تاريخ اليوم]
الممثل القانوني ومسؤول حماية المعطيات`,
    frenchText: `Royaume du Maroc
À l'attention de : [Nom du Demandeur]
Objet : Attestation de suppression et purge des données personnelles (Articles 8 et 9 de la Loi 08-09)

Madame, Monsieur,

Nous vous informons qu'en réponse à votre demande formulée le [Date], nos équipes techniques ont procédé à la suppression définitive et irréversible de l'ensemble de vos données à caractère personnel de nos systèmes d'information.

Détails de l'opération :
- Statut : Purge intégrale effectuée
- Périmètre : Données de compte, historique d'activité, désinscription stricte de nos listes de diffusion.
- Exception légale : Seuls les justificatifs comptables soumis à obligation légale de conservation (Code de Commerce marocain) sont archivés de manière sécurisée et isolée.

Fait pour valoir ce que de droit.

Le Responsable du Traitement / DPO`
  },
  {
    id: 'template-cctv-notice',
    titleAr: 'إشعار قانوني معلق للمستخدمين والزوار بوجود كاميرات مراقبة (المادة 12 ومداولة 455-2014)',
    titleEn: 'Official Workplace & Visitor CCTV Surveillance Notice',
    lawArticle: 'المادة 12 وقرار CNDP رقم 455-2014',
    category: 'ACCESS',
    descriptionAr: 'ملصق وإشعار قانوني إلزامي يوضع في مداخل المقرات لإعلام العموم بوجود كاميرات مراقبة ومدة الاحتفاظ وتفاصيل ترخيص CNDP.',
    descriptionEn: 'Mandatory physical sign & legal notice for building entrances detailing CNDP authorization, retention & contact.',
    slaDays: 0,
    templateType: 'EMPLOYEE_NOTICE',
    arabicText: `إشعار قانوني رسمي: هذا الموقع مجهز بنظام للمراقبة البصرية بالفيديو
Avis Légal : Établissement sous Vidéosurveillance

وفقاً لمقتضيات القانون رقم 08-09 المتعلق بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي، ومداولة اللجنة الوطنية (CNDP) رقم 455-2014:

1. الغرض: ضمان أمن وسلامة الأشخاص والممتلكات داخل المنشأة.
2. ترخيص CNDP: تم إيداع هذا النظام والحصول على إذن رسمي من اللجنة الوطنية برقم: [A-VS-XXXX/202X].
3. مدة الحفظ: يتم مسح التسجيلات آلياً بعد انقضاء 30 يوماً كأقصى حد.
4. ممارسة الحقوق: لممارسة حقكم في الولوج إلى تسجيلاتكم، يرجى الاتصال بمسؤول حماية المعطيات عبر البريد الإلكتروني: dpo@entreprise.ma أو عبر الهاتف: +212 5XX-XXXXXX.`,
    frenchText: `AVIS LÉGAL : ÉTABLISSEMENT SOUS VIDÉOSURVEILLANCE
Conformément à la Loi n° 08-09 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel et à la délibération CNDP n° 455-2014 :

1. Finalité : Sécurité des personnes et des biens.
2. Récépissé / Autorisation CNDP : [A-VS-XXXX/202X].
3. Durée de conservation des images : 30 jours maximum, au-delà de laquelle elles sont automatiquement écrasées.
4. Exercice des droits : Vous pouvez exercer vos droits d'accès prévus à l'article 7 de la loi 08-09 auprès du Délégué à la Protection des Données (DPO) : dpo@entreprise.ma.`
  }
];
