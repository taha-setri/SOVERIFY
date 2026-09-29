import React from 'react';
import { ShieldCheck, Lock, Award, Server, FileCheck, CheckCircle2, Globe, Sparkles, Activity } from 'lucide-react';
import { Language } from '../types';

const moroccoSealImg = '/morocco_sovereign_seal.jpg';

interface HeroProps {
  lang: Language;
  onQuickAudit?: (domain: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const isFr = lang === 'fr';

  return (
    <section className="relative pt-6 pb-6 sm:pt-10 sm:pb-8 overflow-hidden bg-black text-white">
      {/* Background ambient lighting - Black, Green, White glow */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden pointer-events-none">
        <div className="h-96 w-[800px] rounded-full bg-emerald-500/15 blur-[140px]" />
        <div className="h-64 w-64 rounded-full bg-white/5 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center space-y-7">
        {/* Ministerial & Sovereign Header Seal */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="relative group">
            {/* The Official Seal Image with verified multiple fallbacks */}
            <div className="p-1 rounded-2xl bg-gradient-to-b from-emerald-400 via-emerald-600 to-amber-500 shadow-2xl shadow-emerald-500/30">
              <img
                src={moroccoSealImg}
                alt={isAr ? 'ختم السيادة الرقمية للمملكة المغربية' : isFr ? 'Sceau Officiel de Souveraineté du Royaume du Maroc' : 'Kingdom of Morocco Digital Sovereignty Seal'}
                className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl object-cover bg-black"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.endsWith('/morocco_sovereign_seal.jpg')) {
                    target.src = '/morocco_sovereign_seal.jpg';
                  } else if (!target.src.endsWith('/assets/morocco_sovereign_seal.jpg')) {
                    target.src = '/assets/morocco_sovereign_seal.jpg';
                  }
                }}
              />
            </div>
            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 ring-4 ring-black animate-pulse" />
          </div>

          <div className="text-center sm:text-right space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-950/60 px-4 py-1.5 text-xs sm:text-sm font-mono text-emerald-300 backdrop-blur-md shadow-lg shadow-emerald-950/50">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold tracking-wide">
                {isAr
                  ? 'المملكة المغربية · المنظومة الوطنية المرجعية للسيادة الرقمية · مرجع CNDP'
                  : isFr
                  ? 'Royaume du Maroc · Autorité Nationale de Souveraineté Numérique · Réf CNDP'
                  : 'Kingdom of Morocco · National Digital Sovereignty Authority · CNDP Reference'}
              </span>
            </div>
            <div className="text-xs sm:text-sm font-mono text-slate-300 font-medium">
              {isAr
                ? 'الظهير الشريف رقم 1.09.15 بتنفيذ القانون رقم 09-08 المتعلق بحماية المعطيات الشخصية'
                : isFr
                ? 'Dahir n° 1-09-15 portant promulgation de la Loi n° 09-08 sur la protection des données'
                : 'Dahir No. 1-09-15 Enacting Moroccan Law No. 09-08 on Personal Data Protection'}
            </div>
          </div>
        </div>

        {/* Animated Moving & Repeating Sovereign Regulatory Marquee */}
        <div className="w-full overflow-hidden rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-black via-zinc-950 to-black py-2.5 shadow-xl shadow-emerald-950/40 relative">
          <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
          
          <div className="flex w-max animate-marquee-normal hover:animate-marquee-paused items-center gap-8 text-xs sm:text-sm font-mono font-bold whitespace-nowrap text-emerald-400">
            <span className="flex items-center gap-2 text-white bg-emerald-600 px-3 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider">
              <Activity className="h-3.5 w-3.5 animate-pulse text-white" />
              CNDP LIVE 2026
            </span>
            <span className="text-white">
              {isAr
                ? 'تدقيق سيادي فوري شامل لأي منصة أو موقع إلكتروني بالمغرب'
                : isFr
                ? 'Audit de souveraineté instantané et vérification de conformité en temps réel'
                : 'Real-time digital sovereignty & CNDP regulatory inspection engine'}
            </span>
            <span className="text-emerald-300">★</span>
            <span className="text-emerald-300">
              {isAr
                ? 'التحقق الصارم من توطين المعطيات داخل مراكز البيانات المغربية (المادتان 43 و44)'
                : isFr
                ? 'Contrôle strict de localisation et transfert transfrontalier (Articles 43 & 44)'
                : 'Strict verification of sovereign Moroccan hosting (Articles 43 & 44)'}
            </span>
            <span className="text-emerald-300">★</span>
            <span className="text-white">
              {isAr
                ? 'حظر كوكيز التتبع الإعلاني قبل الموافقة الصريحة الحرة بموجب مداولة CNDP رقم 08-2020'
                : isFr
                ? 'Blocage des cookies traceurs sans consentement préalable selon délibération 08-2020'
                : 'Enforcement of CNDP Deliberation 08-2020 on cookie consent gates'}
            </span>
            <span className="text-emerald-300">★</span>
            <span className="text-emerald-400">
              {isAr
                ? 'تشفير فائق NIST FIPS 203 Post-Quantum مقاوم لخوارزميات شور وغروفر'
                : isFr
                ? 'Chiffrement Post-Quantique conforme NIST FIPS 203 & TLS 1.3 Strict'
                : 'NIST FIPS 203 Post-Quantum Cryptographic Defense (ML-KEM 768)'}
            </span>
            <span className="text-emerald-300">★</span>
            <span className="text-white">
              {isAr
                ? 'بصمات تدقيق غير قابلة للتعديل مشفرة بـ SHA-256 ومحفوظة في سجل السيادة'
                : isFr
                ? 'Scellé d’intégrité infalsifiable SHA-256 enregistré sur registre sécurisé'
                : 'Tamper-proof SHA-256 cryptographic audit seal'}
            </span>
            <span className="text-emerald-300">★</span>

            {/* Repeated once for seamless loop */}
            <span className="flex items-center gap-2 text-white bg-emerald-600 px-3 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider">
              <Activity className="h-3.5 w-3.5 animate-pulse text-white" />
              CNDP LIVE 2026
            </span>
            <span className="text-white">
              {isAr
                ? 'تدقيق سيادي فوري شامل لأي منصة أو موقع إلكتروني بالمغرب'
                : isFr
                ? 'Audit de souveraineté instantané et vérification de conformité en temps réel'
                : 'Real-time digital sovereignty & CNDP regulatory inspection engine'}
            </span>
            <span className="text-emerald-300">★</span>
            <span className="text-emerald-300">
              {isAr
                ? 'التحقق الصارم من توطين المعطيات داخل مراكز البيانات المغربية (المادتان 43 و44)'
                : isFr
                ? 'Contrôle strict de localisation et transfert transfrontalier (Articles 43 & 44)'
                : 'Strict verification of sovereign Moroccan hosting (Articles 43 & 44)'}
            </span>
          </div>
        </div>

        {/* Majestic Sovereign Title - Enlarged & High Contrast */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
            {isAr ? (
              <>
                المنصة الوطنية للسيادة الرقمية <br />
                <span className="bg-gradient-to-r from-emerald-400 via-white to-emerald-400 bg-clip-text text-transparent">
                  ومراقبة الامتثال للقانون المغربي 09-08
                </span>
              </>
            ) : isFr ? (
              <>
                Plateforme Nationale de Souveraineté <br />
                <span className="bg-gradient-to-r from-emerald-400 via-white to-emerald-400 bg-clip-text text-transparent">
                  & Contrôle de Conformité à la Loi 09-08
                </span>
              </>
            ) : (
              <>
                National Digital Sovereignty Portal <br />
                <span className="bg-gradient-to-r from-emerald-400 via-white to-emerald-400 bg-clip-text text-transparent">
                  & Moroccan Law 09-08 Compliance Audit
                </span>
              </>
            )}
          </h1>

          <p className="max-w-4xl mx-auto text-base sm:text-lg md:text-xl text-slate-100 leading-relaxed font-sans font-normal">
            {isAr
              ? 'المنظومة السيادية الأولى المؤتمتة بالمملكة المغربية لإجراء التدقيق الشامل والفوري لأي منصة أو موقع إلكتروني: التحقق من تراخيص CNDP، فحص الاستضافة والتوطين المحلي، رصد سكريبتات التتبع غير المرخصة، وتوليد التقارير الرسمية والخطط التصحيحية.'
              : isFr
              ? 'La première infrastructure souveraine et autonome au Royaume du Maroc pour l’audit immédiat de toute plateforme numérique : vérification des autorisations CNDP, contrôle de la résidence des données, détection des traceurs non autorisés et génération de rapports certifiés.'
              : 'Morocco’s autonomous RegTech inspection engine for real-time audit of any digital platform: CNDP prior declaration checks, cross-border data residency verification, unconsented cookie tracker detection, and certified remediation reports.'}
          </p>
        </div>

        {/* 4 Sovereign Pillars Guarantee - Enlarged, Crisp Black & White & Green */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 text-right">
          <div className="rounded-2xl border border-white/20 bg-zinc-950/90 p-4.5 backdrop-blur-md hover:border-emerald-400/60 transition shadow-lg shadow-black">
            <div className="flex items-center gap-2.5 text-emerald-400 font-extrabold text-sm sm:text-base mb-1.5">
              <Server className="h-5 w-5 shrink-0 text-emerald-400" />
              <span>{isAr ? 'السيادة السحابية (المادة 43)' : isFr ? 'Souveraineté Cloud (Art. 43)' : 'Data Sovereignty (Art. 43)'}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              {isAr 
                ? 'التأكد من توطين المعطيات الحساسة داخل مراكز بيانات وطنية مغربية معتمدة.' 
                : isFr 
                ? 'Vérification de la localisation des données dans des centres serveurs nationaux marocains.' 
                : 'Verified in-kingdom hosting and cross-border transfer authorization.'}
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-zinc-950/90 p-4.5 backdrop-blur-md hover:border-emerald-400/60 transition shadow-lg shadow-black">
            <div className="flex items-center gap-2.5 text-emerald-300 font-extrabold text-sm sm:text-base mb-1.5">
              <FileCheck className="h-5 w-5 shrink-0 text-emerald-400" />
              <span>{isAr ? 'تصريح CNDP (المادة 53)' : isFr ? 'Récépissé CNDP (Art. 53)' : 'CNDP Prior Receipt'}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              {isAr 
                ? 'فحص وصل الإيداع المسبق D-1 ورقم الترخيص القانوني لمعالجة المعطيات.' 
                : isFr 
                ? 'Contrôle automatique du récépissé de déclaration D-1 et numéros d’agrément CNDP.' 
                : 'Automated extraction of formal D-1 declaration and legal filings.'}
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-zinc-950/90 p-4.5 backdrop-blur-md hover:border-emerald-400/60 transition shadow-lg shadow-black">
            <div className="flex items-center gap-2.5 text-emerald-400 font-extrabold text-sm sm:text-base mb-1.5">
              <Lock className="h-5 w-5 shrink-0 text-emerald-400" />
              <span>{isAr ? 'الكوكيز (المداولة 08-2020)' : isFr ? 'Cookies (Délib. 08-2020)' : 'Cookie Consent Rule'}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              {isAr 
                ? 'حظر قاطع لزرع ملفات التتبع الإعلاني قبل الموافقة الصريحة الحرة للمستخدم.' 
                : isFr 
                ? 'Blocage strict des traceurs marketing préalablement au consentement libre et éclairé.' 
                : 'Strict prohibition of trackers before user consent mechanism.'}
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-zinc-950/90 p-4.5 backdrop-blur-md hover:border-emerald-400/60 transition shadow-lg shadow-black">
            <div className="flex items-center gap-2.5 text-white font-extrabold text-sm sm:text-base mb-1.5">
              <Award className="h-5 w-5 shrink-0 text-emerald-400" />
              <span>{isAr ? 'توقيع مشفر SHA-256' : isFr ? 'Scellé SHA-256' : 'SHA-256 Cryptography'}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              {isAr 
                ? 'بصمة تدقيق رقمية غير قابلة للتعديل لتثبيت الإثبات التقني والقانوني المعتمد.' 
                : isFr 
                ? 'Empreinte numérique immuable pour conformité juridique et force probante.' 
                : 'Tamper-proof cryptographic signature for executive & judicial use.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
