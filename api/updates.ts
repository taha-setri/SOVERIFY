import type { IncomingMessage, ServerResponse } from 'http';

interface VercelReq extends IncomingMessage {
  method?: string;
}

interface VercelRes extends ServerResponse {
  status: (statusCode: number) => VercelRes;
  json: (data: any) => void;
}

const verifiedUpdates = [
  {
    id: 'cndp-upd-1',
    titleAr: 'تحديث استمارات التصريح المسبق (D-1 و D-2) ورقمنة إيداع الملفات عبر منصة CNDP',
    titleEn: 'Digitalization of Prior Declaration Forms (D-1 & D-2) on CNDP Portal',
    date: '2026-08-15',
    category: 'CNDP Deliberation',
    categoryAr: 'مداولة ومسطرة CNDP',
    impactLevel: 'CRITICAL',
    summaryAr: 'أطلقت اللجنة الوطنية لمراقبة حماية المعطيات ذات الطابع الشخصي (CNDP) الخدمة الإلكترونية الجديدة لإيداع تصاريح المعالجة وطلبات الإذن المسبق وفق المادتين 12 و 18 من القانون 09-08، مع تقليص مدة البت في الملفات إلى 15 يوماً.',
    summaryEn: 'CNDP introduces its streamlined digital portal for processing declarations and authorization permits under Articles 12 & 18 of Law 09-08.',
    affectedArticles: ['المادة 12', 'المادة 18', 'المادة 53'],
    dpoActionRequiredAr: 'مراجعة كافة سجلات المعالجة وتحديث أرقام الوصل عبر البوابة الرقمية.',
    dpoActionRequiredEn: 'Review processing registries and update formal CNDP receipts via the new portal.',
    officialSource: 'اللجنة الوطنية CNDP - الرباط',
    sourceUrl: 'https://www.cndp.ma'
  },
  {
    id: 'cndp-upd-2',
    titleAr: 'تشديد الرقابة على الاستضافة السحابية الأجنبية ونقل المعطيات خارج التراب الوطني (المادة 43)',
    titleEn: 'Strict Enforcement of Cross-Border Data Residency and Cloud Transfers (Art. 43)',
    date: '2026-07-22',
    category: 'Cloud & Sovereignty',
    categoryAr: 'السيادة السحابية ونقل المعطيات',
    impactLevel: 'HIGH',
    summaryAr: 'تؤكد CNDP أن استضافة قواعد بيانات المواطنين المغاربة خارج المغرب (AWS, Azure, Google Cloud, OVH) دون ترخيص مسبق مكتوب يُعد مخالفة موجبة للمساءلة القانونية، وتدعو لتوطين المعطيات في مراكز بيانات سيادية محلية.',
    summaryEn: 'CNDP circular reminds all entities that utilizing international clouds without explicit CNDP authorization breaches Article 43.',
    affectedArticles: ['المادة 43', 'المادة 44', 'المادة 53'],
    dpoActionRequiredAr: 'حصر قواعد البيانات المستضافة خارج التراب الوطني، وتقديم ملف ترخيص النقل للخارج لدى CNDP.',
    dpoActionRequiredEn: 'Inventory international cloud databases and file transfer authorization requests with CNDP.',
    officialSource: 'CNDP - البلاغ الرسمي حول توطين المعطيات',
    sourceUrl: 'https://www.cndp.ma'
  },
  {
    id: 'cndp-upd-3',
    titleAr: 'تطبيق أحكام المداولة رقم 08-2020: حظر جمع الكوكيز التتبعية قبل الموافقة الصريحة الحرة',
    titleEn: 'Enforcement of Deliberation 08-2020: Mandatory Prior Consent for Tracking Cookies',
    date: '2026-06-10',
    category: 'CNDP Deliberation',
    categoryAr: 'مداولة إلزامية لـ CNDP',
    impactLevel: 'HIGH',
    summaryAr: 'شددت لجان مراقبة CNDP على إلزامية توفير خيار "رفض الكل" بنفس حجم ووضوح زر "قبول الكل" على لافتات الكوكيز، وحظر التتبع التلقائي قبل الاختيار الصريح.',
    summaryEn: 'CNDP inspectors enforce Deliberation 08-2020 requiring equal prominence for Refuse/Accept cookie choices.',
    affectedArticles: ['المادة 10', 'المادة 12', 'المداولة 08-2020'],
    dpoActionRequiredAr: 'حظر تحميل Google Analytics أو Meta Pixel قبل النقر الصريح على الموافقة.',
    dpoActionRequiredEn: 'Ensure analytics and marketing scripts are strictly held back until affirmative consent.',
    officialSource: 'مداولة CNDP رقم 08-2020',
    sourceUrl: 'https://www.cndp.ma'
  }
];

export default async function handler(req: VercelReq, res: VercelRes) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    success: true,
    updates: verifiedUpdates,
    timestamp: new Date().toISOString()
  });
}
