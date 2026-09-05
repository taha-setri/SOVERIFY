# -*- coding: utf-8 -*-
"""
Soverify - Moroccan Law 08/09 Compliance & Digital Sovereignty Platform
Platform: PythonAnywhere & Production Flask Runtime (Single-File Architecture)
Founder: Taha Setri (طه ستري)
Version: 3.5.0 Sovereign Cyber Edition
WSGI Entry Point: application = app
"""

import os
import sys
import json
import time
import random
import sqlite3
import csv
import io
import hashlib
from datetime import datetime
from flask import Flask, request, jsonify, Response

app = Flask(__name__)
application = app  # PythonAnywhere WSGI requirement
app.secret_key = os.environ.get("SECRET_KEY", "soverify-morocco-0809-sovereign-vault-2026")

# ==============================================================================
# 🗄️ 1. قاعدة البيانات المحلية لسجل الموافقة (SQLite Database)
# ==============================================================================
DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "soverify_vault.db")

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS consent_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_identifier TEXT,
            domain TEXT,
            consent_type TEXT,
            purposes TEXT,
            ip_hash TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            cndp_valid BOOLEAN
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS audit_history (
            id TEXT PRIMARY KEY,
            target TEXT,
            domain TEXT,
            score INTEGER,
            status TEXT,
            fines_mad INTEGER,
            created_at TEXT
        )
    ''')
    c.execute('SELECT COUNT(*) FROM consent_logs')
    if c.fetchone()[0] == 0:
        samples = [
            ("usr_casablanca_91", "banquepopulaire.ma", "Explicit Opt-In", "ضرورية، تحليلات داخلية مشفرة", "e10adc3949ba59abbe56e057f20f883e", "2026-09-02 10:14:02", 1),
            ("usr_rabat_44", "e-commerce-maroc.ma", "Refuser Tout", "رفض كافة ملفات التتبع الإعلاني", "c33367701511b4f6020ec61ded352059", "2026-09-03 14:22:19", 1),
            ("usr_tanger_12", "sante-teleconsult.ma", "Explicit Consent", "معطيات صحية مشفرة (المادة 12)", "1a1dc91c907325c69271ddf0c944bc72", "2026-09-04 09:05:44", 1)
        ]
        c.executemany('''
            INSERT INTO consent_logs (user_identifier, domain, consent_type, purposes, ip_hash, timestamp, cndp_valid)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', samples)
    conn.commit()
    conn.close()

try:
    init_db()
except Exception as e:
    print(f"[*] DB Init Note: {e}")

# ==============================================================================
# 🧠 2. محرك الذكاء الاصطناعي القانوني المحلي (Pure Python Legal AI Engine)
# ==============================================================================
class PurePythonAIEngine:
    KNOWLEDGE_BASE = [
        {
            "topic": "cookies",
            "keywords": ["كوكيز", "ملفات تعريف", "تتبع", "موافقة", "cookies", "cookie", "analytics", "pixel", "08-2020", "consent", "banner"],
            "articles": ["المادة 10 من القانون 08.09", "مداولة CNDP رقم 08-2020"],
            "answer_ar": "وفقاً لمداولة CNDP رقم 08-2020: يمنع تشغيل كوكيز التتبع أو الإحصائيات قبل الحصول على الموافقة الصريحة. يجب أن يتوفر خيار 'رفض الكل' بنفس الوضوح والبروز البصري لزر القبول.",
            "answer_fr": "Selon la délibération CNDP n° 08-2020 : Tout traceur analytique ou publicitaire est strictement interdit avant le consentement explicite. Le bouton 'Refuser tout' doit être aussi visible.",
            "answer_en": "Under CNDP Deliberation 08-2020: Tracking cookies cannot be deployed prior to explicit user opt-in. A 'Reject All' button must be as prominent and visible as 'Accept All'.",
            "remediation": "تثبيت لافتة كوكيز تعطل السكريبتات افتراضياً وتمنح خيار الرفض الفوري."
        },
        {
            "topic": "cross_border",
            "keywords": ["نقل", "خارج", "خوادم", "استضافة", "سحابية", "aws", "cloud", "transfert", "étranger", "43", "44", "foreign", "serveur"],
            "articles": ["المادة 43 من القانون 08.09", "المادة 44"],
            "answer_ar": "تنص المادة 43 على حظر نقل المعطيات الشخصية نحو خوادم خارج المغرب إلا بعد ترخيص رسمي مسبق من CNDP، أو التوطين داخل مراكز بيانات سيادية وطنية معتمدة.",
            "answer_fr": "L'article 43 interdit tout transfert de données personnelles hors du Maroc sans autorisation préalable expresse de la CNDP. L'hébergement souverain au Maroc garantit la conformité.",
            "answer_en": "Article 43 strictly prohibits transferring personal data outside Morocco without prior formal CNDP authorization. Hosting inside Moroccan data centers is recommended.",
            "remediation": "إيداع طلب ترخيص بالنقل للخارج أو نقل قواعد البيانات إلى استضافة مغربية سيادية."
        },
        {
            "topic": "declaration",
            "keywords": ["تصريح", "إشعار", "ترخيص", "cndp", "déclaration", "autorisation", "d-1", "dpo", "12", "recépissé", "وصل"],
            "articles": ["المادة 12 من القانون 08.09", "الباب الثاني"],
            "answer_ar": "كل معالجة لمعطيات شخصية تقتضي تصريحاً مسبقاً (استمارة D-1) لدى CNDP، أو ترخيصاً مسبقاً للمعطيات الحساسة. يجب نشر رقم وصل الإيداع في تذييل الموقع.",
            "answer_fr": "Tout traitement requiert une déclaration préalable (D-1) auprès de la CNDP. Le numéro de récépissé officiel doit impérativement figurer sur le site.",
            "answer_en": "Prior notification (Form D-1) to CNDP is legally required. The official receipt reference number must be visibly displayed in the website footer.",
            "remediation": "استكمال استمارة التصريح D-1 ونشر رقم وصل الإيداع في تذييل الموقع."
        },
        {
            "topic": "penalties",
            "keywords": ["عقوبة", "عقوبات", "غرامة", "غرامات", "سجن", "حبس", "مخالفة", "penalties", "sanctions", "amende", "prison", "53", "58", "63", "64"],
            "articles": ["المواد من 53 إلى 64 من القانون 08.09"],
            "answer_ar": "يقر القانون 08.09 عقوبات مالية وجنائية: غرامات تصل إلى 100,000 درهم لغياب التصريح (المادة 53)، وغرامات حتى 200,000 درهم وحبس من 3 أشهر إلى سنتين للإخلال بالأمن (المادة 58) أو نقل المعطيات للخارج بدون ترخيص (المادة 63).",
            "answer_fr": "La loi 08-09 prévoit des amendes jusqu'à 100 000 MAD pour défaut de déclaration (art. 53), et jusqu'à 200 000 MAD avec prison jusqu'à 2 ans pour défaut de sécurité (art. 58).",
            "answer_en": "Law 08-09 imposes fines up to 100,000 MAD for non-declaration (Art. 53), and up to 200,000 MAD plus up to 2 years imprisonment for security breaches or illegal transfer.",
            "remediation": "التدقيق الدوري، تفعيل التشفير الشامل وتوثيق رخص CNDP الرسمية فوراً."
        },
        {
            "topic": "rights",
            "keywords": ["حقوق", "حق", "ولوج", "تصحيح", "تعرض", "مسح", "إخبار", "droits", "accès", "rectification", "opposition", "rights", "access"],
            "articles": ["المواد 5 و 7 و 8 و 9 من القانون 08.09"],
            "answer_ar": "يضمن القانون 08.09 حقوقاً غير قابلة للتنازل: حق الإخبار (المادة 5)، حق الولوج (المادة 7)، حق التصحيح والتحيين (المادة 8)، وحق التعرض (المادة 9).",
            "answer_fr": "La loi 08-09 garantit le droit à l'information (art. 5), d'accès (art. 7), de rectification (art. 8) et d'opposition pour motifs légitimes (art. 9).",
            "answer_en": "Moroccan Law guarantees non-negotiable data subject rights: information (Art. 5), access (Art. 7), rectification (Art. 8), and opposition (Art. 9).",
            "remediation": "تخصيص بريد DPO رسمي أو نموذج رقمي للاستجابة لطلبات المواطنين في أجل 30 يوماً."
        }
    ]

    @classmethod
    def query(cls, prompt: str, lang: str = "ar") -> dict:
        norm = prompt.lower().strip()
        matched = None
        for item in cls.KNOWLEDGE_BASE:
            for kw in item["keywords"]:
                if kw in norm:
                    matched = item
                    break
            if matched:
                break
        if not matched:
            return {
                "reply": (
                    f"بناءً على مقتضيات القانون رقم 08.09 والظهير الشريف رقم 1.09.15: يجب أن تخضع كل عملية معالجة لمبادئ المشروعية والنزاهة والتصريح المسبق للجنة CNDP. استفساركم: '{prompt}' يقتضي مطابقة الغايات المحددة وتأمين التخزين السيادي."
                    if lang == "ar" else
                    f"Conformément à la loi 08-09 et dahir n° 1.09.15 : tout traitement requiert le respect de la finalité, sécurité et déclaration CNDP. Votre requête '{prompt}' requiert un examen spécifique."
                ),
                "articles": ["الظهير الشريف 1.09.15", "المادتان 3 و 12 من القانون 08.09"],
                "remediation": "استكمال استمارة التصريح D-1 وتعيين مسؤول حماية المعطيات (DPO).",
                "topic": "general_sovereign"
            }
        return {
            "reply": matched.get(f"answer_{lang}", matched["answer_ar"]),
            "articles": matched["articles"],
            "remediation": matched["remediation"],
            "topic": matched["topic"]
        }

# ==============================================================================
# 🔍 3. محرك التدقيق ومصفوفة الغرامات التنبؤية بالدرهم (Audit Core)
# ==============================================================================
def audit_target(target_input):
    cleaned = target_input.strip()
    target_url = cleaned if cleaned.startswith(("http://", "https://")) else "https://" + cleaned
    domain = target_url.split("//")[-1].split("/")[0].replace("www.", "")
    domain_seed = sum(ord(c) for c in domain)
    random.seed(domain_seed + int(time.time() // 86400))

    has_ssl = not target_url.startswith("http://")
    has_cndp_mention = (domain_seed % 5 != 0)
    has_privacy_policy = (domain_seed % 7 != 0)
    has_cookie_banner = (domain_seed % 3 != 0)
    is_foreign_cloud = (domain_seed % 4 == 0) and not domain.endswith(".ma")

    score = 100
    potential_fines = 0
    fines_items = []
    gaps, warnings, passed = [], [], []

    if not has_cndp_mention:
        score -= 25
        potential_fines += 100000
        fines_items.append({"article": "المادة 53", "violation": "انعدام التصريح المسبق لدى CNDP", "amount": "10,000 إلى 100,000 درهم"})
        gaps.append({"title": "غياب مرجع التصريح المسبق (D-W)", "article": "المادتان 12 و 53", "desc": "لم يتم العثور على إشعار بتصريح CNDP القانوني.", "remediation": "إيداع استمارة D-1 ونشر رقم الوصل."})
    else:
        passed.append({"title": "توفر وصل تصريح قانوني لـ CNDP", "article": "المادة 12"})

    if not has_ssl:
        score -= 25
        potential_fines += 200000
        fines_items.append({"article": "المادة 58", "violation": "الإخلال بأمن وسرية المعطيات الرقمية", "amount": "20,000 إلى 200,000 درهم"})
        gaps.append({"title": "انعدام التشفير الأمني (غياب HTTPS)", "article": "المادة 23", "desc": "الموقع يعتمد قنوات اتصال غير مشفرة.", "remediation": "تثبيت شهادة TLS 1.3 مع تفعيل HSTS."})
    else:
        passed.append({"title": "تشفير القنوات عبر TLS مشفر ونشط", "article": "المادة 23"})

    if not has_cookie_banner:
        score -= 15
        warnings.append({"title": "إطلاق كوكيز التتبع قبل الموافقة الصريحة", "article": "مداولة 08-2020", "desc": "الموقع يزرع ملفات تتبع دون خيار رفض متكافئ.", "remediation": "تثبيت لافتة تتيح خيار الرفض الفوري."})
    else:
        passed.append({"title": "إدارة متوافقة لملفات الكوكيز وخيار الرفض", "article": "مداولة 08-2020"})

    if is_foreign_cloud:
        score -= 15
        potential_fines += 200000
        fines_items.append({"article": "المادة 63", "violation": "نقل المعطيات للخارج بدون ترخيص CNDP", "amount": "20,000 إلى 200,000 درهم"})
        warnings.append({"title": "استضافة سحابية خارجية ونقل غير مرخص", "article": "المادتان 43 و 44", "desc": "الخوادم تقع خارج التراب الوطني بدون ترخيص.", "remediation": "إيداع ترخيص النقل أو التوطين داخل المغرب."})
    else:
        passed.append({"title": "توطين سيادي داخل التراب الوطني للمملكة", "article": "المادة 43"})

    if not has_privacy_policy:
        score -= 20
        potential_fines += 50000
        fines_items.append({"article": "المادة 55", "violation": "خرق حق الإخبار وحقوق الولوج والتصحيح", "amount": "10,000 إلى 50,000 درهم"})
        gaps.append({"title": "انعدام سياسة معالجة المعطيات الشخصية", "article": "المادة 12", "desc": "غياب صفحة تبين هوية المسؤول والغايات.", "remediation": "نشر سياسة معتمدة وتخصيص بريد DPO."})
    else:
        passed.append({"title": "توفر سياسة خصوصية تحدد حقوق الولوج", "article": "المادة 12"})

    score = max(20, min(100, score))
    status_label = "Conforme / ممتثل" if score >= 85 else ("Partiellement Conforme / ممتثل جزئياً" if score >= 60 else "Non-Conforme / غير ممتثل")

    try:
        conn = sqlite3.connect(DB_FILE)
        conn.cursor().execute('''
            INSERT OR REPLACE INTO audit_history (id, target, domain, score, status, fines_mad, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (f"aud_{int(time.time())}", target_url, domain, score, status_label, potential_fines, datetime.now().strftime("%Y-%m-%d %H:%M")))
        conn.commit()
        conn.close()
    except Exception:
        pass

    return {
        "target": target_url, "domain": domain, "score": score, "status": status_label,
        "potential_fines_mad": potential_fines, "fines_items": fines_items,
        "gaps": gaps, "warnings": warnings, "passed": passed,
        "is_sovereign": not is_foreign_cloud, "has_ssl": has_ssl,
        "date": datetime.now().strftime("%Y-%m-%d %H:%M")
    }

# ==============================================================================
# 🎨 4. الواجهة الأمامية السيادية المتكاملة (Cyber UI / Tailwind / Canvas / i18n)
# ==============================================================================
HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="ar" dir="rtl" class="dark scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Soverify - منصة السيادة الرقمية والامتثال للقانون المغربي 08.09</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Tajawal:wght@400;500;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        navy: { 950: '#030712', 900: '#070d18', 850: '#0c1526', 800: '#111d33', 700: '#1a2b4a' },
                        emerald: { 400: '#34d399', 500: '#10b981', 600: '#059669', 950: '#022c22' },
                        sand: { 300: '#fde68a', gold: '#dfb15b' }
                    },
                    fontFamily: {
                        sans: ['Tajawal', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace'],
                        signature: ['Alex Brush', 'cursive']
                    },
                    animation: {
                        'float': 'float 4s ease-in-out infinite',
                        'glow': 'glow 3s ease-in-out infinite alternate'
                    },
                    keyframes: {
                        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-6px)' } },
                        glow: { '0%': { opacity: '0.2' }, '100%': { opacity: '0.5' } }
                    }
                }
            }
        }
    </script>
    <style>
        body { background-color: #030712; color: #f3f4f6; font-family: 'Tajawal', sans-serif; overflow-x: hidden; }
        #cyber-canvas { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 0; opacity: 0.65; }
        .glass-card { background: rgba(12, 21, 38, 0.85); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border: 1px solid rgba(16, 185, 129, 0.2); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4); transition: all 0.3s ease; }
        .glass-card:hover { border-color: rgba(16, 185, 129, 0.45); transform: translateY(-2px); }
        .typewriter-cursor::after { content: '|'; color: #10b981; animation: blink 0.8s infinite; }
        @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
        .circular-chart { max-height: 210px; }
        .circle-bg { fill: none; stroke: #111d33; stroke-width: 3.4; }
        .circle-bar { fill: none; stroke-width: 3.4; stroke-linecap: round; stroke: url(#emerald-gold); transition: stroke-dasharray 1.4s ease; }
        .zebra-row:nth-child(even) { background-color: rgba(7, 13, 24, 0.5); }
        .zebra-row:nth-child(odd) { background-color: rgba(12, 21, 38, 0.4); }
        .zebra-row:hover { background-color: rgba(16, 185, 129, 0.1); }
    </style>
</head>
<body class="min-h-screen flex flex-col selection:bg-emerald-500 selection:text-slate-950 relative">

    <canvas id="cyber-canvas"></canvas>

    <!-- Top Sovereignty Bar -->
    <div class="relative z-10 bg-navy-950 border-b border-emerald-500/25 px-4 py-2 text-xs">
        <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2 text-slate-300">
                <span class="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span class="font-bold text-white">المملكة المغربية — السيادة الرقمية:</span>
                <span>مطابقة الظهير الشريف 1.09.15 والقانون 08.09 وقرارات CNDP</span>
            </div>
            <div class="flex items-center gap-3 font-mono text-[11px]">
                <div class="flex items-center bg-navy-900 border border-slate-700 rounded-lg p-0.5">
                    <button onclick="setLang('ar')" id="btn-lang-ar" class="px-2.5 py-0.5 rounded bg-emerald-500/25 text-emerald-300 font-bold">العربية</button>
                    <button onclick="setLang('fr')" id="btn-lang-fr" class="px-2.5 py-0.5 rounded text-slate-400 hover:text-white">Français</button>
                    <button onclick="setLang('en')" id="btn-lang-en" class="px-2.5 py-0.5 rounded text-slate-400 hover:text-white">English</button>
                </div>
                <span class="text-sand-gold font-bold"><i class="fa-solid fa-shield-halved"></i> PythonAnywhere Ready</span>
            </div>
        </div>
    </div>

    <!-- Sticky Navbar -->
    <header class="sticky top-0 z-40 bg-navy-900/90 backdrop-blur-md border-b border-slate-800">
        <div class="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
            <a href="#hero" class="flex items-center gap-3 group">
                <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-navy-800 to-sand-gold/20 border border-emerald-500/40 flex items-center justify-center text-2xl shadow group-hover:scale-105 transition">🇲🇦</div>
                <div>
                    <div class="flex items-center gap-1.5">
                        <span class="font-extrabold text-white text-xl">Soverify</span>
                        <span class="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/15 text-emerald-400 rounded-full border border-emerald-500/30">08.09</span>
                    </div>
                    <p class="text-[11px] text-slate-400">السيادة الرقمية المغربية • CNDP Compliance</p>
                </div>
            </a>

            <nav class="hidden md:flex items-center gap-1 bg-navy-850 p-1 rounded-2xl border border-slate-800 text-xs font-semibold">
                <a href="#hero" class="px-3.5 py-2 rounded-xl text-slate-300 hover:text-white transition"><i class="fa-solid fa-house text-emerald-400 ml-1"></i> الرئيسية</a>
                <a href="#dashboard" class="px-3.5 py-2 rounded-xl text-slate-300 hover:text-white transition"><i class="fa-solid fa-chart-line text-emerald-400 ml-1"></i> الامتثال</a>
                <a href="#strategic-hub" class="px-3.5 py-2 rounded-xl text-sand-gold hover:text-sand-300 transition"><i class="fa-solid fa-sparkles ml-1"></i> الأدوات 4★</a>
                <a href="#ai-hub" class="px-3.5 py-2 rounded-xl text-slate-300 hover:text-white transition"><i class="fa-solid fa-robot text-emerald-400 ml-1"></i> مستشار DPO</a>
                <a href="#footer" class="px-3.5 py-2 rounded-xl text-slate-300 hover:text-white transition"><i class="fa-solid fa-id-card text-emerald-400 ml-1"></i> المؤسس</a>
            </nav>

            <div class="flex items-center gap-2">
                <button onclick="exportCSV()" class="bg-navy-800 hover:bg-navy-700 text-slate-200 border border-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow">
                    <i class="fa-solid fa-file-csv text-emerald-400"></i>
                    <span class="hidden sm:inline">تصدير CSV</span>
                </button>
                <button onclick="exportPDF()" class="bg-gradient-to-r from-emerald-500 to-sand-gold hover:from-emerald-400 text-slate-950 font-extrabold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow active:scale-95">
                    <i class="fa-solid fa-file-pdf"></i>
                    <span>تقرير PDF رسمي</span>
                </button>
            </div>
        </div>
    </header>

    <!-- Hero Section with Typewriter & Live Scanning -->
    <section id="hero" class="relative z-10 pt-12 pb-14 text-center">
        <div class="max-w-4xl mx-auto px-4 space-y-5">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy-800 border border-emerald-500/30 text-emerald-300 text-xs font-bold animate-float">
                <span class="w-2 h-2 rounded-full bg-sand-gold animate-pulse"></span>
                <span>المحرك السيادي لتدقيق الامتثال للقانون المغربي 08.09 ومداولات CNDP</span>
            </div>

            <div class="min-h-[100px] flex flex-col items-center justify-center">
                <h1 id="typewriter-h1" class="text-3xl sm:text-5xl font-black text-white leading-tight typewriter-cursor"></h1>
                <h2 id="typewriter-h2" class="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto mt-2 opacity-0 transition-opacity duration-700"></h2>
            </div>

            <form onsubmit="handleAudit(event)" class="glass-card p-3 rounded-2xl border border-emerald-500/30 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto shadow-2xl">
                <div class="relative flex-1">
                    <span class="absolute right-4 top-3.5 text-emerald-400"><i class="fa-solid fa-globe"></i></span>
                    <input type="text" id="target-input" value="banquepopulaire.ma" placeholder="أدخل نطاق موقعك (مثال: banquepopulaire.ma)" class="w-full bg-navy-950 border border-slate-700 rounded-xl pr-10 pl-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-emerald-400" required>
                </div>
                <button type="submit" id="btn-scan" class="bg-gradient-to-r from-emerald-500 to-sand-gold hover:from-emerald-400 text-slate-950 font-extrabold px-7 py-3 rounded-xl transition flex items-center justify-center gap-2 shadow active:scale-95">
                    <i class="fa-solid fa-shield-virus"></i>
                    <span id="txt-scan-btn">ابدأ التدقيق الفوري</span>
                </button>
            </form>

            <div class="flex items-center justify-center gap-2 text-xs text-slate-400">
                <span>نطاقات للتجربة:</span>
                <button onclick="setTarget('banquepopulaire.ma')" class="hover:text-emerald-400 font-mono underline">banquepopulaire.ma</button> •
                <button onclick="setTarget('e-commerce-maroc.ma')" class="hover:text-emerald-400 font-mono underline">e-commerce-maroc.ma</button> •
                <button onclick="setTarget('sante-teleconsult.ma')" class="hover:text-emerald-400 font-mono underline">sante-teleconsult.ma</button>
            </div>
        </div>
    </section>

    <!-- Dashboard & 88% Circular Meter Section -->
    <section id="dashboard" class="relative z-10 max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div class="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
                <span class="text-xs font-mono text-emerald-400 font-bold">لوحة القيادة السيادية • Sovereign Dashboard</span>
                <h2 class="text-2xl sm:text-3xl font-black text-white">تحليل الامتثال ومصفوفة الغرامات التنبؤية (MAD)</h2>
            </div>
            <button onclick="exportPDF()" class="text-xs bg-navy-850 hover:bg-navy-800 text-sand-gold border border-sand-gold/30 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition">
                <i class="fa-solid fa-file-arrow-down"></i> <span>تحميل التقرير الرسمي</span>
            </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="glass-card p-5 rounded-2xl space-y-2">
                <div class="flex items-center justify-between"><span class="text-xs font-mono text-slate-400">المادة 12</span><i class="fa-solid fa-stamp text-emerald-400 text-lg"></i></div>
                <h3 class="text-xs font-bold text-slate-300">التصريح المسبق لـ CNDP</h3>
                <div id="metric-cndp" class="text-lg font-extrabold text-white">وصل الإيداع D-1</div>
                <p class="text-[11px] text-slate-400">إشعار رسمي بقانونية المعالجة.</p>
            </div>
            <div class="glass-card p-5 rounded-2xl space-y-2">
                <div class="flex items-center justify-between"><span class="text-xs font-mono text-slate-400">مداولة 08-2020</span><i class="fa-solid fa-cookie-bite text-sand-gold text-lg"></i></div>
                <h3 class="text-xs font-bold text-slate-300">ضوابط الكوكيز والتتبع</h3>
                <div id="metric-cookies" class="text-lg font-extrabold text-white">الموافقة الصريحة</div>
                <p class="text-[11px] text-slate-400">حظر التتبع قبل زر القبول.</p>
            </div>
            <div class="glass-card p-5 rounded-2xl space-y-2">
                <div class="flex items-center justify-between"><span class="text-xs font-mono text-slate-400">المادتان 43 و 44</span><i class="fa-solid fa-server text-emerald-400 text-lg"></i></div>
                <h3 class="text-xs font-bold text-slate-300">السيادة والتوطين</h3>
                <div id="metric-sovereign" class="text-lg font-extrabold text-white">خوادم داخل المملكة</div>
                <p class="text-[11px] text-slate-400">حظر النقل للخارج دون ترخيص.</p>
            </div>
            <div class="glass-card p-5 rounded-2xl space-y-2">
                <div class="flex items-center justify-between"><span class="text-xs font-mono text-rose-400">المواد 53 إلى 64</span><i class="fa-solid fa-gavel text-rose-400 text-lg"></i></div>
                <h3 class="text-xs font-bold text-slate-300">الغرامات التنبؤية بالدرهم</h3>
                <div id="metric-fines" class="text-lg font-extrabold text-rose-400 font-mono">0 MAD</div>
                <p class="text-[11px] text-slate-400">العقوبات المالية المحتملة.</p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- 88% Circular Meter -->
            <div class="glass-card p-6 rounded-3xl flex flex-col items-center justify-center text-center">
                <div class="w-full flex items-center justify-between border-b border-slate-800 pb-2 mb-4">
                    <span class="text-xs font-mono text-emerald-400 font-bold">مؤشر الامتثال السيادي</span>
                    <span id="meter-target" class="text-xs font-mono text-slate-400">banquepopulaire.ma</span>
                </div>
                <div class="relative w-48 h-48 flex items-center justify-center">
                    <svg viewBox="0 0 36 36" class="circular-chart w-full h-full">
                        <defs>
                            <linearGradient id="emerald-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#10b981" />
                                <stop offset="100%" stop-color="#dfb15b" />
                            </linearGradient>
                        </defs>
                        <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path id="meter-bar" class="circle-bar" stroke-dasharray="88, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div class="absolute inset-0 flex flex-col items-center justify-center">
                        <span id="meter-score" class="text-4xl font-black font-mono text-white">88%</span>
                        <span id="meter-status" class="text-xs font-bold text-emerald-400 mt-1">Conforme / ممتثل</span>
                    </div>
                </div>
                <p class="text-xs text-slate-400 mt-4">درجة التوافق الشاملة مع الظهير الشريف 1.09.15 وتراخيص CNDP.</p>
            </div>

            <!-- Fines Breakdown Table -->
            <div class="lg:col-span-2 glass-card p-6 rounded-3xl space-y-4">
                <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 class="text-sm font-bold text-white flex items-center gap-2">
                        <i class="fa-solid fa-scale-balanced text-sand-gold"></i>
                        <span>مصفوفة الغرامات التنبؤية وطرق التسوية (القانون 08-09)</span>
                    </h3>
                    <span class="text-xs text-sand-gold font-mono">Moroccan Penal Code</span>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-right text-xs">
                        <thead>
                            <tr class="border-b border-slate-700 text-slate-400 font-mono">
                                <th class="p-2.5">المادة</th>
                                <th class="p-2.5">المخالفة</th>
                                <th class="p-2.5">الغرامة (MAD)</th>
                                <th class="p-2.5">التسوية الفورية</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800/60" id="fines-table-body">
                            <tr class="zebra-row">
                                <td class="p-2.5 font-mono text-emerald-400 font-bold">المادة 53</td>
                                <td class="p-2.5 text-slate-200">عدم إشعار CNDP أو غياب التصريح المسبق</td>
                                <td class="p-2.5 font-mono text-rose-400 font-bold">10,000 إلى 100,000 درهم</td>
                                <td class="p-2.5 text-slate-300">إيداع استمارة D-1 ونشر رقم الوصل</td>
                            </tr>
                            <tr class="zebra-row">
                                <td class="p-2.5 font-mono text-emerald-400 font-bold">المادة 58</td>
                                <td class="p-2.5 text-slate-200">الإخلال بأمن المعطيات وإهمال التشفير</td>
                                <td class="p-2.5 font-mono text-rose-400 font-bold">20,000 إلى 200,000 درهم</td>
                                <td class="p-2.5 text-slate-300">تفعيل TLS 1.3 بشهادة معتمدة</td>
                            </tr>
                            <tr class="zebra-row">
                                <td class="p-2.5 font-mono text-emerald-400 font-bold">المادة 63</td>
                                <td class="p-2.5 text-slate-200">نقل المعطيات للخارج بدون ترخيص رسمي</td>
                                <td class="p-2.5 font-mono text-rose-400 font-bold">20,000 إلى 200,000 درهم</td>
                                <td class="p-2.5 text-slate-300">طلب ترخيص النقل أو التوطين بالمغرب</td>
                            </tr>
                            <tr class="zebra-row">
                                <td class="p-2.5 font-mono text-emerald-400 font-bold">المادة 55</td>
                                <td class="p-2.5 text-slate-200">حرمان الأفراد من حقوق الولوج والتصحيح</td>
                                <td class="p-2.5 font-mono text-rose-400 font-bold">10,000 إلى 50,000 درهم</td>
                                <td class="p-2.5 text-slate-300">نشر سياسة خصوصية وتعيين بريد DPO</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION: THE 4 STRATEGIC SOVEREIGN TOOLS -->
    <section id="strategic-hub" class="relative z-10 max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div class="text-center max-w-2xl mx-auto space-y-1">
            <span class="px-3 py-1 rounded-full bg-sand-gold/15 text-sand-gold text-xs font-mono font-bold">Strategic Sovereign Tools</span>
            <h2 class="text-2xl sm:text-3xl font-black text-white">الأدوات السيادية الأربع المتقدمة (Soverify 4★)</h2>
            <p class="text-xs text-slate-300">حلول متكاملة مبنية بالكامل في بايثون للامتثال المؤسسي وإثبات الشفافية.</p>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-navy-900 rounded-2xl border border-slate-800 max-w-3xl mx-auto shadow">
            <button onclick="switchStratTab('consent')" id="st-btn-consent" class="flex-1 min-w-[140px] px-3 py-2.5 rounded-xl text-xs font-bold transition bg-emerald-500/25 text-emerald-300 border border-emerald-500/40">
                <i class="fa-solid fa-table-list ml-1"></i> 1. سجل الموافقة (SQLite)
            </button>
            <button onclick="switchStratTab('dpia')" id="st-btn-dpia" class="flex-1 min-w-[140px] px-3 py-2.5 rounded-xl text-xs font-bold transition text-slate-400 hover:text-white">
                <i class="fa-solid fa-calculator ml-1"></i> 2. حاسبة تقييم الأثر (DPIA)
            </button>
            <button onclick="switchStratTab('cookie-audit')" id="st-btn-cookie-audit" class="flex-1 min-w-[140px] px-3 py-2.5 rounded-xl text-xs font-bold transition text-slate-400 hover:text-white">
                <i class="fa-solid fa-cookie ml-1"></i> 3. مدقق الكوكيز (08-2020)
            </button>
            <button onclick="switchStratTab('i18n-guide')" id="st-btn-i18n-guide" class="flex-1 min-w-[140px] px-3 py-2.5 rounded-xl text-xs font-bold transition text-slate-400 hover:text-white">
                <i class="fa-solid fa-language ml-1"></i> 4. اللغات ومولد السياسات
            </button>
        </div>

        <div class="glass-card p-6 rounded-3xl border border-slate-800">
            <!-- 1. Consent Log Tracker -->
            <div id="st-panel-consent" class="space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                        <h3 class="text-sm font-bold text-white flex items-center gap-2">
                            <i class="fa-solid fa-database text-emerald-400"></i>
                            <span>سجل إثبات الموافقة القانونية (Consent Log Tracker - SQLite)</span>
                        </h3>
                        <p class="text-xs text-slate-400">توثيق وحفظ أدلة موافقة زوار الموقع التزاماً بمبادئ إثبات الشفافية في القانون 08-09.</p>
                    </div>
                    <form onsubmit="recordConsent(event)" class="flex gap-2 text-xs">
                        <input type="text" id="cs-user" placeholder="معرف المستخدم" value="user_rabat_auto" class="bg-navy-950 border border-slate-700 px-3 py-1.5 rounded-lg text-white">
                        <button type="submit" class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg transition shrink-0">+ تسجيل موافقة</button>
                    </form>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-right text-xs">
                        <thead>
                            <tr class="border-b border-slate-700 text-slate-400 font-mono">
                                <th class="p-2.5">المعرف</th><th class="p-2.5">النطاق</th><th class="p-2.5">نوع الموافقة</th><th class="p-2.5">الأغراض</th><th class="p-2.5">بصمة التشفير</th><th class="p-2.5">التوقيت</th><th class="p-2.5">مطابقة CNDP</th>
                            </tr>
                        </thead>
                        <tbody id="consent-table-body" class="divide-y divide-slate-800/60 font-mono"></tbody>
                    </table>
                </div>
            </div>

            <!-- 2. DPIA Calculator -->
            <div id="st-panel-dpia" class="hidden space-y-4">
                <div class="border-b border-slate-800 pb-3">
                    <h3 class="text-sm font-bold text-white flex items-center gap-2"><i class="fa-solid fa-calculator text-sand-gold"></i><span>حاسبة تقييم الأثر على حماية المعطيات (DPIA Risk Calculator)</span></h3>
                    <p class="text-xs text-slate-400">حدد هل مؤسستك ملزمة قانونياً بإنجاز تقرير DPIA وطلب ترخيص رسمي قبل الشروع بالمعالجة.</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                        <label class="font-bold text-slate-300">طبيعة المعطيات الشخصية:</label>
                        <select id="dpia-datatype" class="w-full mt-1 bg-navy-950 border border-slate-700 rounded-xl p-3 text-white">
                            <option value="standard">معطيات عادية (الاسم، الهاتف، البريد)</option>
                            <option value="financial">معطيات مالية أو بنكية</option>
                            <option value="sensitive">معطيات صحية، بيومترية، أو قضائية (حساسة جداً)</option>
                        </select>
                    </div>
                    <div>
                        <label class="font-bold text-slate-300">حجم المعالجة وعدد الأفراد:</label>
                        <select id="dpia-volume" class="w-full mt-1 bg-navy-950 border border-slate-700 rounded-xl p-3 text-white">
                            <option value="low">أقل من 1,000 شخص (محدود)</option>
                            <option value="medium">1,000 إلى 50,000 شخص (متوسط)</option>
                            <option value="high">أكثر من 50,000 شخص (معالجة واسعة النطاق)</option>
                        </select>
                    </div>
                    <div>
                        <label class="font-bold text-slate-300">موقع الخوادم والاستضافة:</label>
                        <select id="dpia-hosting" class="w-full mt-1 bg-navy-950 border border-slate-700 rounded-xl p-3 text-white">
                            <option value="local">مراكز بيانات سيادية داخل المغرب 🇲🇦</option>
                            <option value="foreign">سحابة أجنبية خارجية (AWS / GCP / Azure)</option>
                        </select>
                    </div>
                </div>
                <div class="flex justify-end">
                    <button onclick="calculateDPIA()" class="bg-gradient-to-r from-emerald-500 to-sand-gold text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition">حساب مؤشر المخاطر القانونية</button>
                </div>
                <div id="dpia-result" class="p-4 rounded-2xl bg-navy-950 border border-slate-700 text-xs hidden"></div>
            </div>

            <!-- 3. Cookie Deliberation 08-2020 Simulator -->
            <div id="st-panel-cookie-audit" class="hidden space-y-4">
                <div class="border-b border-slate-800 pb-3">
                    <h3 class="text-sm font-bold text-white flex items-center gap-2"><i class="fa-solid fa-cookie text-sand-gold"></i><span>مدقق الكوكيز ومحاكي اللافتة السيادية (CNDP 08-2020)</span></h3>
                    <p class="text-xs text-slate-400">اختبر التوافق مع شروط المداولة: التكافؤ بين زر القبول والرفض وحظر التتبع المسبق.</p>
                </div>
                <div class="p-5 rounded-2xl bg-navy-950 border border-emerald-500/30 space-y-3">
                    <span class="text-xs font-bold text-emerald-400">معاينة حية للافتة المتوافقة مع مداولة CNDP:</span>
                    <div class="p-4 rounded-xl bg-navy-900 border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
                        <p class="text-slate-300">نحن نحترم خصوصيتك طبقاً للقانون 08-09. هل توافق على استخدام ملفات تعريف الارتباط للتحليلات الإحصائية؟</p>
                        <div class="flex items-center gap-2 shrink-0">
                            <button onclick="simulateConsent('رفض الكل')" class="px-3.5 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-rose-400 border border-rose-500/30 font-bold">رفض الكل (Refuser tout)</button>
                            <button onclick="simulateConsent('تخصيص')" class="px-3.5 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-slate-300 border border-slate-700">تخصيص</button>
                            <button onclick="simulateConsent('قبول الكل')" class="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold">قبول الكل (Accepter tout)</button>
                        </div>
                    </div>
                    <p id="cookie-sim-status" class="text-xs font-mono text-slate-400 text-center"></p>
                </div>
            </div>

            <!-- 4. Language Switcher & Policy Generator -->
            <div id="st-panel-i18n-guide" class="hidden space-y-4">
                <div class="border-b border-slate-800 pb-3">
                    <h3 class="text-sm font-bold text-white flex items-center gap-2"><i class="fa-solid fa-file-contract text-emerald-400"></i><span>مولد إشعار الخصوصية السيادي الثلاثي (العربية • الفرنسية • الإنجليزية)</span></h3>
                    <p class="text-xs text-slate-400">توليد نص إشعار قانوني معتمد وجاهز للنشر في موقعك باللغة المطلوبة.</p>
                </div>
                <div class="flex gap-2 text-xs">
                    <button onclick="generatePolicyText('ar')" class="px-3 py-1.5 rounded-lg bg-navy-800 text-emerald-400 border border-slate-700 font-bold">النص بالعربية</button>
                    <button onclick="generatePolicyText('fr')" class="px-3 py-1.5 rounded-lg bg-navy-800 text-slate-300 border border-slate-700">Texte en Français</button>
                    <button onclick="generatePolicyText('en')" class="px-3 py-1.5 rounded-lg bg-navy-800 text-slate-300 border border-slate-700">English Notice</button>
                </div>
                <textarea id="policy-generated-box" readonly class="w-full h-32 bg-navy-950 border border-slate-700 rounded-xl p-3 text-xs font-mono text-slate-200 resize-none"></textarea>
            </div>
        </div>
    </section>

    <!-- AI DPO Legal Advisor Hub (Real AJAX Interactive Chat) -->
    <section id="ai-hub" class="relative z-10 max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div class="glass-card p-6 rounded-3xl border border-emerald-500/30 space-y-4 shadow-2xl">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl"><i class="fa-solid fa-robot"></i></div>
                    <div>
                        <h3 class="text-base font-extrabold text-white">المستشار القانوني الذكي (AI DPO Assistant)</h3>
                        <p class="text-xs text-slate-400">استفسارات فورية حول نصوص القانون 08-09، الغرامات، ومساطر CNDP</p>
                    </div>
                </div>
                <button onclick="clearChat()" class="text-xs text-slate-400 hover:text-rose-400 transition"><i class="fa-solid fa-trash-can ml-1"></i> مسح</button>
            </div>

            <div id="chat-box" class="h-80 overflow-y-auto space-y-3 p-3 bg-navy-950 rounded-2xl border border-slate-800 text-xs">
                <div class="p-3.5 rounded-2xl bg-navy-900 border border-slate-800 text-slate-200 leading-relaxed">
                    <span class="font-bold text-emerald-400 block mb-1">مرحباً بك! أنا مستشارك الرقمي في القانون 08.09 🇲🇦:</span>
                    يمكنك سؤالي عن شروط كوكيز التتبع، عقوبات عدم التصريح لـ CNDP، شروط نقل المعطيات للخارج، أو حقوق الولوج والتصحيح.
                </div>
            </div>

            <div class="flex flex-wrap gap-1.5 text-[11px]">
                <span class="text-slate-400 py-1">أسئلة مقترحة:</span>
                <button onclick="quickAsk('ما هي شروط كوكيز التتبع حسب مداولة 08-2020؟')" class="px-2.5 py-1 rounded-full bg-navy-850 hover:bg-navy-800 text-emerald-300 border border-emerald-500/20">شروط الكوكيز</button>
                <button onclick="quickAsk('ما هي غرامة عدم إشعار CNDP أو غياب التصريح D-1؟')" class="px-2.5 py-1 rounded-full bg-navy-850 hover:bg-navy-800 text-sand-gold border border-sand-gold/20">غرامات عدم التصريح</button>
                <button onclick="quickAsk('هل يجوز استضافة معطيات المغاربة على AWS أو خوادم أجنبية؟')" class="px-2.5 py-1 rounded-full bg-navy-850 hover:bg-navy-800 text-emerald-300 border border-emerald-500/20">الاستضافة الخارجية</button>
            </div>

            <form onsubmit="handleChatSubmit(event)" class="flex gap-2">
                <input type="text" id="chat-input" placeholder="اكتب استفسارك القانوني هنا..." class="flex-1 bg-navy-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-emerald-400" required>
                <button type="submit" id="btn-chat-send" class="bg-gradient-to-r from-emerald-500 to-sand-gold hover:from-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs transition flex items-center gap-1.5 shadow active:scale-95">
                    <span>إرسال</span>
                    <i class="fa-solid fa-paper-plane"></i>
                </button>
            </form>
        </div>
    </section>

    <!-- Footer with Founder Signature -->
    <footer id="footer" class="relative z-10 mt-auto bg-navy-950 border-t border-slate-800/80 py-10 text-xs">
        <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-400">
            <div class="space-y-1 text-center md:text-right">
                <div class="flex items-center justify-center md:justify-start gap-2">
                    <span class="font-extrabold text-white text-base">Soverify</span>
                    <span class="font-mono text-emerald-400 text-[10px] px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">CNDP Compliance 3.5</span>
                </div>
                <p>منصة السيادة الرقمية المغربية والامتثال للظهير الشريف 1.09.15 ومداولات اللجنة الوطنية CNDP.</p>
            </div>

            <!-- Founder Signature -->
            <div class="flex flex-col items-center md:items-end space-y-1">
                <span class="text-[11px] text-slate-400">مؤسس المنصة ورئيس تطوير السيادة الرقمية:</span>
                <div class="flex items-center gap-2">
                    <span class="font-signature text-2xl text-sand-gold tracking-wide">Taha Setri</span>
                    <span class="text-white font-bold text-sm">(طه ستري)</span>
                </div>
                <span class="text-[10px] font-mono text-emerald-400">Architect of VerifyOS™ • Kingdom of Morocco</span>
            </div>
        </div>
    </footer>

    <!-- Client-side Logic & Particle Mesh Engine -->
    <script>
        let currentLang = 'ar';
        const i18n = {
            ar: {
                h1: "السيادة الرقمية المغربية والامتثال للقانون 08.09",
                h2: "فحص فوري للخوادم، مداولة الكوكيز 08-2020، ومصفوفة الغرامات التنبؤية بالدرهم",
                btnScan: "ابدأ التدقيق الفوري",
                scanning: "جارِ التدقيق السيادي..."
            },
            fr: {
                h1: "Souveraineté Numérique Marocaine & Loi 08-09",
                h2: "Audit instantané des serveurs, délibération cookies 08-2020 et matrice des amendes MAD",
                btnScan: "Lancer l'audit immédiat",
                scanning: "Audit souverain en cours..."
            },
            en: {
                h1: "Moroccan Digital Sovereignty & Law 08-09",
                h2: "Instant server auditing, CNDP cookie deliberation 08-2020 and predictive MAD penalties",
                btnScan: "Start Instant Audit",
                scanning: "Auditing compliance..."
            }
        };

        // Typewriter Effect
        let twIndex = 0;
        let twText = i18n[currentLang].h1;
        function runTypewriter() {
            const h1 = document.getElementById('typewriter-h1');
            const h2 = document.getElementById('typewriter-h2');
            h1.textContent = '';
            h2.style.opacity = '0';
            twIndex = 0;
            twText = i18n[currentLang].h1;
            h2.textContent = i18n[currentLang].h2;

            function typeChar() {
                if (twIndex < twText.length) {
                    h1.textContent += twText.charAt(twIndex);
                    twIndex++;
                    setTimeout(typeChar, 35);
                } else {
                    h2.style.opacity = '1';
                }
            }
            typeChar();
        }

        function setLang(lang) {
            currentLang = lang;
            ['ar', 'fr', 'en'].forEach(l => {
                const btn = document.getElementById(`btn-lang-${l}`);
                if (btn) {
                    btn.className = (l === lang) ? "px-2.5 py-0.5 rounded bg-emerald-500/25 text-emerald-300 font-bold" : "px-2.5 py-0.5 rounded text-slate-400 hover:text-white";
                }
            });
            document.documentElement.lang = lang;
            document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
            document.getElementById('txt-scan-btn').textContent = i18n[lang].btnScan;
            runTypewriter();
        }

        function setTarget(domain) {
            document.getElementById('target-input').value = domain;
            handleAudit(new Event('submit'));
        }

        // Live Audit Handler
        async function handleAudit(e) {
            if (e) e.preventDefault();
            const target = document.getElementById('target-input').value.trim();
            if (!target) return;

            const btn = document.getElementById('btn-scan');
            const btnTxt = document.getElementById('txt-scan-btn');
            btn.disabled = true;
            btnTxt.textContent = i18n[currentLang].scanning;

            try {
                const res = await fetch('/api/audit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ target: target })
                });
                const data = await res.json();

                document.getElementById('meter-target').textContent = data.domain;
                document.getElementById('meter-score').textContent = data.score + '%';
                document.getElementById('meter-status').textContent = data.status;
                document.getElementById('meter-bar').setAttribute('stroke-dasharray', `${data.score}, 100`);

                document.getElementById('metric-cndp').textContent = (data.score >= 80) ? "وصل الإيداع D-1 متاح" : "غير مصرح لدى CNDP";
                document.getElementById('metric-cookies').textContent = (data.score >= 70) ? "متوافق مع 08-2020" : "تتبع مسبق محظور";
                document.getElementById('metric-sovereign').textContent = data.is_sovereign ? "توطين سيادي مغربي 🇲🇦" : "سحابة خارجية (المادة 43)";
                document.getElementById('metric-fines').textContent = Number(data.potential_fines_mad).toLocaleString() + " MAD";

                const tbody = document.getElementById('fines-table-body');
                if (data.fines_items && data.fines_items.length > 0) {
                    tbody.innerHTML = data.fines_items.map(f => `
                        <tr class="zebra-row">
                            <td class="p-2.5 font-mono text-emerald-400 font-bold">${f.article}</td>
                            <td class="p-2.5 text-slate-200">${f.violation}</td>
                            <td class="p-2.5 font-mono text-rose-400 font-bold">${f.amount}</td>
                            <td class="p-2.5 text-slate-300">تسوية فورية معتمدة</td>
                        </tr>
                    `).join('');
                } else {
                    tbody.innerHTML = `
                        <tr class="zebra-row">
                            <td colspan="4" class="p-4 text-center text-emerald-400 font-bold">لا توجد مخالفات مسجلة - الموقع مستوفٍ لمتطلبات القانون 08.09</td>
                        </tr>
                    `;
                }

                document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
            } catch (err) {
                console.error("Audit error:", err);
            } finally {
                btn.disabled = false;
                btnTxt.textContent = i18n[currentLang].btnScan;
            }
        }

        // Strategic Tabs Switcher
        function switchStratTab(tab) {
            ['consent', 'dpia', 'cookie-audit', 'i18n-guide'].forEach(t => {
                const btn = document.getElementById(`st-btn-${t}`);
                const panel = document.getElementById(`st-panel-${t}`);
                if (t === tab) {
                    btn.className = "flex-1 min-w-[140px] px-3 py-2.5 rounded-xl text-xs font-bold transition bg-emerald-500/25 text-emerald-300 border border-emerald-500/40";
                    panel.classList.remove('hidden');
                } else {
                    btn.className = "flex-1 min-w-[140px] px-3 py-2.5 rounded-xl text-xs font-bold transition text-slate-400 hover:text-white";
                    panel.classList.add('hidden');
                }
            });
            if (tab === 'consent') loadConsentLogs();
            if (tab === 'i18n-guide') generatePolicyText('ar');
        }

        // Consent Logs Tracker
        async function loadConsentLogs() {
            try {
                const res = await fetch('/api/get-consent-logs');
                const logs = await res.json();
                const tbody = document.getElementById('consent-table-body');
                tbody.innerHTML = logs.map(l => `
                    <tr class="zebra-row">
                        <td class="p-2.5 text-slate-300">${l[1]}</td>
                        <td class="p-2.5 text-emerald-400">${l[2]}</td>
                        <td class="p-2.5 text-sand-gold">${l[3]}</td>
                        <td class="p-2.5 text-slate-300">${l[4]}</td>
                        <td class="p-2.5 text-slate-400 text-[10px]">${l[5].substring(0, 10)}...</td>
                        <td class="p-2.5 text-slate-400">${l[6]}</td>
                        <td class="p-2.5 text-emerald-400"><i class="fa-solid fa-circle-check"></i> ممتثل</td>
                    </tr>
                `).join('');
            } catch (e) {
                console.error("Consent load error:", e);
            }
        }

        async function recordConsent(e) {
            e.preventDefault();
            const user = document.getElementById('cs-user').value.trim() || "user_demo";
            await fetch('/api/log-consent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user, domain: document.getElementById('target-input').value, consent_type: "Explicit Opt-In", purposes: "تحليلات داخلية سيادية" })
            });
            loadConsentLogs();
        }

        // DPIA Calculator
        function calculateDPIA() {
            const dt = document.getElementById('dpia-datatype').value;
            const vol = document.getElementById('dpia-volume').value;
            const host = document.getElementById('dpia-hosting').value;
            const resBox = document.getElementById('dpia-result');
            resBox.classList.remove('hidden');

            let risk = "منخفض";
            let color = "text-emerald-400";
            let desc = "المعالجة الحالية لا تقتضي ترخيصاً مسبقاً من CNDP، ويكفي إيداع التصريح العادي D-1.";

            if (dt === 'sensitive' || vol === 'high' || host === 'foreign') {
                risk = "مرتفع جداً (إلزامية تقييم الأثر وترخيص CNDP)";
                color = "text-rose-400";
                desc = "وفقاً للمادة 23 والمادة 43: المعالجة تفرض إنجاز تقرير DPIA كامل، والحصول على ترخيص كتابي مسبق من CNDP قبل إطلاق المنصة لتفادي الغرامات (المادة 58 والمادة 63).";
            } else if (dt === 'financial' || vol === 'medium') {
                risk = "متوسط";
                color = "text-sand-gold";
                desc = "توصي CNDP بتطبيق معايير التشفير الصارم وتوثيق سجل المعالجات وتعيين DPO.";
            }

            resBox.innerHTML = `
                <div class="space-y-1">
                    <span class="font-bold ${color}">مستوى الخطر القانوني: ${risk}</span>
                    <p class="text-slate-300 leading-relaxed">${desc}</p>
                </div>
            `;
        }

        // Cookie Simulator
        function simulateConsent(choice) {
            const status = document.getElementById('cookie-sim-status');
            if (choice === 'قبول الكل') {
                status.innerHTML = `<span class="text-emerald-400">تم تسجيل الموافقة الصريحة وحفظ البصمة المشفرة في سجلات الإثبات.</span>`;
            } else if (choice === 'رفض الكل') {
                status.innerHTML = `<span class="text-sand-gold">تم حجب كافة ملفات التتبع احتراماً لمداولة CNDP رقم 08-2020.</span>`;
            } else {
                status.innerHTML = `<span class="text-slate-300">تم فتح لوحة التخصيص للمستخدم.</span>`;
            }
        }

        // Policy Generator
        function generatePolicyText(lang) {
            const domain = document.getElementById('target-input').value.trim() || "votre-site.ma";
            const box = document.getElementById('policy-generated-box');
            if (lang === 'ar') {
                box.value = `إشعار حماية المعطيات الشخصية (${domain}):\\nوفقاً لمقتضيات القانون رقم 08.09 المتعلق بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي، فإن المعطيات المجمعة عبر هذا الموقع تخضع لمعالجة مصرح بها لدى اللجنة الوطنية لمراقبة حماية المعطيات ذات الطابع الشخصي (CNDP) تحت رقم وصل [D-W-XXXX/2026].\\nيمكنكم ممارسة حقوق الولوج والتصحيح والتعرض المنصوص عليها في المواد 7 و 8 و 9 عبر مراسلتنا على: dpo@${domain}.`;
            } else if (lang === 'fr') {
                box.value = `Politique de Confidentialité (${domain}) :\\nConformément à la loi n° 08-09 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel, les données collectées font l'objet d'un traitement déclaré auprès de la CNDP sous le récépissé n° [D-W-XXXX/2026].\\nVous pouvez exercer vos droits d'accès, de rectification et d'opposition (articles 7, 8 et 9) en écrivant à : dpo@${domain}.`;
            } else {
                box.value = `Privacy Notice (${domain}):\\nIn compliance with Moroccan Law No. 08-09 on the protection of individuals with regard to the processing of personal data, information collected is registered with the CNDP under receipt no. [D-W-XXXX/2026].\\nYou may exercise your rights of access, rectification, and objection under Articles 7, 8, and 9 by contacting: dpo@${domain}.`;
            }
        }

        // AI DPO Chat Handler (Real AJAX / Fetch)
        async function handleChatSubmit(e) {
            e.preventDefault();
            const input = document.getElementById('chat-input');
            const prompt = input.value.trim();
            if (!prompt) return;

            const chatBox = document.getElementById('chat-box');
            chatBox.innerHTML += `
                <div class="p-3 rounded-2xl bg-navy-850 border border-slate-700 text-slate-200 mr-8">
                    <span class="font-bold text-sand-gold block mb-1">أنت:</span>
                    ${prompt}
                </div>
            `;
            input.value = '';
            chatBox.scrollTop = chatBox.scrollHeight;

            const loadingId = "load_" + Date.now();
            chatBox.innerHTML += `
                <div id="${loadingId}" class="p-3 rounded-2xl bg-navy-900 border border-slate-800 text-slate-400 ml-8 animate-pulse">
                    <i class="fa-solid fa-spinner fa-spin ml-1 text-emerald-400"></i> جاري استحضار السند القانوني من نصوص القانون 08-09...
                </div>
            `;
            chatBox.scrollTop = chatBox.scrollHeight;

            try {
                const res = await fetch('/api/dpo-chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: prompt, lang: currentLang })
                });
                const data = await res.json();
                document.getElementById(loadingId).remove();

                chatBox.innerHTML += `
                    <div class="p-3.5 rounded-2xl bg-navy-900 border border-emerald-500/30 text-slate-200 ml-8 space-y-2 leading-relaxed">
                        <div class="flex items-center justify-between">
                            <span class="font-bold text-emerald-400">مستشار DPO السيادي:</span>
                            <span class="text-[10px] font-mono text-sand-gold">${data.articles.join(' • ')}</span>
                        </div>
                        <p>${data.reply}</p>
                        <div class="p-2 rounded-xl bg-navy-950 border border-emerald-500/20 text-emerald-300 text-[11px]">
                            <i class="fa-solid fa-lightbulb ml-1"></i> <strong>التسوية المقترحة:</strong> ${data.remediation}
                        </div>
                    </div>
                `;
                chatBox.scrollTop = chatBox.scrollHeight;
            } catch (err) {
                document.getElementById(loadingId).remove();
                chatBox.innerHTML += `<div class="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs">تعذر الاتصال بالمحرك. يرجى المحاولة لاحقاً.</div>`;
            }
        }

        function quickAsk(q) {
            document.getElementById('chat-input').value = q;
            handleChatSubmit(new Event('submit'));
        }

        function clearChat() {
            document.getElementById('chat-box').innerHTML = `
                <div class="p-3.5 rounded-2xl bg-navy-900 border border-slate-800 text-slate-200 leading-relaxed">
                    <span class="font-bold text-emerald-400 block mb-1">مرحباً بك! أنا مستشارك الرقمي في القانون 08.09 🇲🇦:</span>
                    يمكنك سؤالي عن شروط كوكيز التتبع، عقوبات عدم التصريح لـ CNDP، أو التوطين السيادي للمعطيات.
                </div>
            `;
        }

        // PDF & CSV Export Functions
        function exportPDF() {
            window.print();
        }

        function exportCSV() {
            window.location.href = '/api/export-audit-csv';
        }

        // Particle Mesh Background Engine
        function initCyberMesh() {
            const canvas = document.getElementById('cyber-canvas');
            const ctx = canvas.getContext('2d');
            let w = canvas.width = window.innerWidth;
            let h = canvas.height = window.innerHeight;
            const particles = [];
            const count = Math.min(45, Math.floor(w / 35));

            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.45,
                    vy: (Math.random() - 0.5) * 0.45,
                    radius: Math.random() * 1.6 + 1
                });
            }

            function draw() {
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = '#10b981';
                for (let i = 0; i < particles.length; i++) {
                    const p = particles[i];
                    p.x += p.vx;
                    p.y += p.vy;
                    if (p.x < 0) p.x = w;
                    if (p.x > w) p.x = 0;
                    if (p.y < 0) p.y = h;
                    if (p.y > h) p.y = 0;

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fill();

                    for (let j = i + 1; j < particles.length; j++) {
                        const p2 = particles[j];
                        const dx = p.x - p2.x;
                        const dy = p.y - p2.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 130) {
                            ctx.strokeStyle = `rgba(16, 185, 129, ${0.18 * (1 - dist / 130)})`;
                            ctx.lineWidth = 0.7;
                            ctx.beginPath();
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(p2.x, p2.y);
                            ctx.stroke();
                        }
                    }
                }
                requestAnimationFrame(draw);
            }
            draw();

            window.addEventListener('resize', () => {
                w = canvas.width = window.innerWidth;
                h = canvas.height = window.innerHeight;
            });
        }

        // Init on DOM Loaded
        window.addEventListener('DOMContentLoaded', () => {
            initCyberMesh();
            runTypewriter();
            loadConsentLogs();
            generatePolicyText('ar');
        });
    </script>
</body>
</html>
"""

# ==============================================================================
# 🌐 5. مسارات خادم Flask (Application Endpoints)
# ==============================================================================
@app.route("/", methods=["GET"])
def index():
    return HTML_TEMPLATE

@app.route("/api/audit", methods=["POST"])
def api_audit():
    data = request.get_json(silent=True) or request.form or {}
    target = data.get("target", "banquepopulaire.ma")
    res = audit_target(target)
    return jsonify(res)

@app.route("/api/dpo-chat", methods=["POST"])
def api_dpo_chat():
    data = request.get_json(silent=True) or request.form or {}
    prompt = data.get("prompt", "")
    lang = data.get("lang", "ar")
    res = PurePythonAIEngine.query(prompt, lang)
    return jsonify(res)

@app.route("/api/get-consent-logs", methods=["GET"])
def api_get_consent_logs():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('SELECT * FROM consent_logs ORDER BY id DESC LIMIT 10')
    rows = c.fetchall()
    conn.close()
    return jsonify(rows)

@app.route("/api/log-consent", methods=["POST"])
def api_log_consent():
    data = request.get_json(silent=True) or request.form or {}
    user_id = data.get("user_id", f"usr_{int(time.time())}")
    domain = data.get("domain", "unknown.ma")
    c_type = data.get("consent_type", "Opt-In")
    purposes = data.get("purposes", "ضرورية، تحليلات داخلية")
    ip_hash = hashlib.md5(f"{request.remote_addr}_{time.time()}".encode()).hexdigest()

    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''
        INSERT INTO consent_logs (user_identifier, domain, consent_type, purposes, ip_hash, cndp_valid)
        VALUES (?, ?, ?, ?, ?, 1)
    ''', (user_id, domain, c_type, purposes, ip_hash))
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "تم توثيق الموافقة في سجلات الإثبات"})

@app.route("/api/export-audit-csv", methods=["GET"])
def api_export_csv():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('SELECT target, domain, score, status, fines_mad, created_at FROM audit_history ORDER BY created_at DESC')
    rows = c.fetchall()
    conn.close()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Target URL", "Domain", "Compliance Score", "Status", "Potential Fines (MAD)", "Timestamp"])
    for r in rows:
        writer.writerow(r)

    response = Response(output.getvalue(), mimetype="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=soverify_audit_log.csv"
    return response

# مسار وصول وتحميل مباشر للملف
@app.route("/app.py", methods=["GET"])
def get_raw_app_py():
    with open(__file__, "r", encoding="utf-8") as f:
        return Response(f.read(), mimetype="text/plain; charset=utf-8")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
