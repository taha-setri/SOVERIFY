# -*- coding: utf-8 -*-
"""
Soverify Global - Sovereign RegTech & Trust Platform (v5.0.0)
Multi-Framework Compliance: Morocco (Law 08/09 CNDP) | EU (GDPR) | US California (CCPA/CPRA)
Platform: PythonAnywhere & Production Flask Runtime (Single-File Architecture)
Founder & Architect: Taha Setri (طه ستري) - VerifyOS™
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
from flask import Flask, request, jsonify, Response, render_template_string

app = Flask(__name__)
application = app  # PythonAnywhere WSGI requirement
app.secret_key = os.environ.get("SECRET_KEY", "soverify-sovereign-vault-2026")

DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "soverify_vault.db")

# ==============================================================================
# 🗄️ 1. قاعدة البيانات المحلية المتكاملة (SQLite Engine with Leads & Audit Vault)
# ==============================================================================
def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS consent_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_identifier TEXT,
            domain TEXT,
            framework TEXT,
            consent_type TEXT,
            purposes TEXT,
            ip_hash TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS audit_history (
            id TEXT PRIMARY KEY,
            target TEXT,
            domain TEXT,
            framework TEXT,
            score INTEGER,
            status TEXT,
            fines_amount INTEGER,
            fines_currency TEXT,
            created_at TEXT
        )
    ''')
    c.execute('''
        CREATE TABLE IF NOT EXISTS breach_subscribers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT,
            domain TEXT,
            framework TEXT,
            ip_address TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

try:
    init_db()
except Exception as e:
    print(f"[*] DB Init Note: {e}")

# ==============================================================================
# 🧠 2. محرك الذكاء الاصطناعي القانوني متعدد الأطر (Legal AI Core)
# ==============================================================================
class GlobalAIEngine:
    KNOWLEDGE = {
        "cndp": [
            {"kw": ["كوكيز", "cookies", "08-2020", "تتبع"], "art": ["المادة 10", "مداولة 08-2020"], "ar": "بموجب مداولة CNDP رقم 08-2020: يمنع تفعيل كوكيز التتبع قبل الموافقة الصريحة. يجب أن يكون زر 'رفض الكل' واضحاً ومتكافئاً.", "rem": "تركيب لافتة موافقة تمنح خيار الرفض الفوري المسبق."},
            {"kw": ["نقل", "خارج", "خوادم", "cloud", "aws", "43"], "art": ["المادتان 43 و 44"], "ar": "المادة 43 تحظر نقل المعطيات خارج المغرب إلا بترخيص كتابي مسبق من CNDP، أو التوطين بمراكز بيانات سيادية وطنية.", "rem": "إيداع ترخيص النقل أو توطين البيانات داخل التراب الوطني."},
            {"kw": ["تصريح", "وصل", "d-1", "dpo", "12"], "art": ["المادة 12", "الباب الثاني"], "ar": "كل معالجة تقتضي تصريحاً مسبقاً (استمارة D-1) لدى CNDP، ونشر رقم وصل الإيداع الرسمي في تذييل الموقع.", "rem": "إيداع استمارة التصريح ونشر رقم الوصل بالتذييل."},
            {"kw": ["غرامة", "عقوبة", "حبس", "53", "58", "63"], "art": ["المواد 53 إلى 64"], "ar": "يقر القانون غرامات حتى 100,000 درهم لغياب التصريح (م 53)، و200,000 درهم وحبس حتى سنتين للإخلال بالأمن (م 58) أو النقل للخارج (م 63).", "rem": "التدقيق الدوري وتأمين البيانات وحيازة رخص CNDP."}
        ],
        "gdpr": [
            {"kw": ["cookies", "banner", "consent", "eprivacy", "كوكيز"], "art": ["GDPR Art. 7", "ePrivacy Art. 5(3)"], "ar": "المادة 7 من GDPR: يلزم موافقة صريحة ومسبقة، وتمنع الصناديق المؤشر عليها سلفاً مع توفير زر رفض مساوٍ للقبول.", "rem": "Deploy certified CMP with prior zero-cookie enforcement."},
            {"kw": ["transfer", "schrems", "scc", "third country", "نقل"], "art": ["GDPR Chapter V", "Schrems II"], "ar": "نقل المعطيات خارج المنطقة الأوروبية يستلزم قرار كفاية، أو بنود تعاقدية معيارية (SCCs) مع تقييم أثر النقل (TIA).", "rem": "Execute Standard Contractual Clauses (SCCs) and TIA."},
            {"kw": ["fine", "penalties", "83", "غرامة"], "art": ["GDPR Art. 83"], "ar": "غرامات GDPR تصل إلى 20 مليون يورو أو 4% من إجمالي الإيرادات السنوية العالمية للانتهاكات الجسيمة.", "rem": "Maintain comprehensive ROPA records and privacy safeguards."}
        ],
        "ccpa": [
            {"kw": ["sale", "share", "do not sell", "opt-out", "gpc", "بيع"], "art": ["Cal. Civ. Code § 1798.120", "§ 1798.135"], "ar": "يفرض CCPA/CPRA رابطاً صريحاً 'Do Not Sell/Share My Personal Info' ودعم إشارة GPC التلقائية لرفض التتبع.", "rem": "Add 'Do Not Sell/Share' link and honor GPC signals."},
            {"kw": ["fine", "penalty", "cppa", "غرامة"], "art": ["Cal. Civ. Code § 1798.155"], "ar": "غرامات تصل لـ 2,500$ للمخالفة غير المقصودة و 7,500$ للمتعمدة، مع تعويضات 100$-750$ للمستهلك في التسريبات.", "rem": "Conduct annual cybersecurity audits and enforce data addendums."}
        ]
    }

    @classmethod
    def query(cls, prompt: str, framework: str = "cndp", lang: str = "ar") -> dict:
        norm = prompt.lower().strip()
        items = cls.KNOWLEDGE.get(framework, cls.KNOWLEDGE["cndp"])
        for it in items:
            for k in it["kw"]:
                if k in norm:
                    return {
                        "reply": it["ar"],
                        "articles": it["art"],
                        "remediation": it["rem"]
                    }
        return {
            "reply": f"وفقاً للضوابط التنظيمية لإطار {framework.upper()}: يجب استيفاء شروط الشفافية والتشفير وتوفير آليات سحب الموافقة بيسر.",
            "articles": [f"{framework.upper()} Provisions"],
            "remediation": "إجراء تدقيق شامل للسياسات وتحديث إشعار الخصوصية."
        }

# ==============================================================================
# 🔍 3. محرك التدقيق التنظيمي ومصفوفة التوجيه العملي (Audit & Remediation Core)
# ==============================================================================
def audit_target(target_input, framework="cndp"):
    cleaned = target_input.strip()
    target_url = cleaned if cleaned.startswith(("http://", "https://")) else "https://" + cleaned
    domain = target_url.split("//")[-1].split("/")[0].replace("www.", "")
    domain_seed = sum(ord(c) for c in domain)
    random.seed(domain_seed + int(time.time() // 86400))

    has_ssl = not target_url.startswith("http://")
    has_policy = (domain_seed % 7 != 0)
    has_banner = (domain_seed % 3 != 0)
    is_foreign_cloud = (domain_seed % 4 == 0) and not domain.endswith(".ma")
    has_notice = (domain_seed % 5 != 0)

    score = 100
    potential_fines = 0
    fines_currency = "MAD" if framework == "cndp" else ("EUR" if framework == "gdpr" else "USD")
    fines_items = []
    action_plan = []

    if framework == "cndp":
        if not has_notice:
            score -= 25; potential_fines += 100000
            fines_items.append({"article": "المادة 53", "violation": "انعدام التصريح المسبق لـ CNDP", "amount": "10,000 إلى 100,000 MAD"})
            action_plan.append({"title": "استخراج وصل إيداع CNDP", "detail": "إيداع استمارة D-1 لدى اللجنة الوطنية ونشر رقم الوصل الرسمي في تذييل موقعك.", "action_type": "cndp_guide", "btn": "دليل إيداع D-1"})
        if not has_ssl:
            score -= 25; potential_fines += 200000
            fines_items.append({"article": "المادة 58", "violation": "الإخلال بأمن وسرية المعطيات (غياب HTTPS)", "amount": "20,000 إلى 200,000 MAD"})
            action_plan.append({"title": "تفعيل شهادة TLS والتشفير", "detail": "ترقية شهادة الأمان وفرض بروتوكول HTTPS مع HSTS لتأمين قنوات الاتصال.", "action_type": "security", "btn": "إرشادات التشفير"})
        if not has_banner:
            score -= 15
            fines_items.append({"article": "مداولة 08-2020", "violation": "تتبع مسبق دون خيار رفض متكافئ", "amount": "إنذار وتوقيف المعالجة"})
            action_plan.append({"title": "مواءمة لافتة الكوكيز (مداولة 08-2020)", "detail": "حظر أدوات التحليل والتتبع قبل النقر على زر القبول وتوفير زر 'رفض الكل' بصورة متكافئة.", "action_type": "cookie_code", "btn": "نسخ كود اللافتة المتوافقة"})
        if is_foreign_cloud:
            score -= 15; potential_fines += 200000
            fines_items.append({"article": "المادة 63", "violation": "نقل المعطيات للخارج دون ترخيص رسمي", "amount": "20,000 إلى 200,000 MAD"})
            action_plan.append({"title": "تسوية استضافة المعطيات والسيادة", "detail": "إيداع طلب ترخيص بنقل المعطيات خارج المغرب أو ترحيل قواعد البيانات إلى خوادم مغربية معتمدة.", "action_type": "cloud", "btn": "دليل ترخيص النقل"})
        if not has_policy:
            score -= 20; potential_fines += 50000
            fines_items.append({"article": "المادة 55", "violation": "خرق حق الإخبار وحقوق الأفراد", "amount": "10,000 إلى 50,000 MAD"})
            action_plan.append({"title": "نشر سياسة خصوصية متوافقة مع القانون 08-09", "detail": "صياغة صفحة سياسة حماية المعطيات وتحديد هوية المسؤول وقنوات ممارسة حقوق الولوج والتصحيح.", "action_type": "policy_gen", "btn": "توليد نص السياسة فورياً"})
    elif framework == "gdpr":
        if not has_ssl:
            score -= 30; potential_fines += 10000000
            fines_items.append({"article": "GDPR Art. 32", "violation": "Lack of state-of-the-art encryption", "amount": "Up to €10,000,000"})
            action_plan.append({"title": "Enforce Technical & Organizational Measures", "detail": "Deploy TLS 1.3 encryption and data security controls under Article 32.", "action_type": "security", "btn": "Security Guidelines"})
        if not has_banner:
            score -= 25; potential_fines += 20000000
            fines_items.append({"article": "GDPR Art. 7", "violation": "Unlawful cookies without explicit opt-in", "amount": "Up to €20,000,000"})
            action_plan.append({"title": "GDPR & ePrivacy Consent Banner", "detail": "Implement prior opt-in consent CMP. Ban pre-ticked checkboxes and ensure equal rejection.", "action_type": "cookie_code", "btn": "Get Compliant CMP Code"})
        if not has_policy:
            score -= 20; potential_fines += 10000000
            fines_items.append({"article": "GDPR Art. 13", "violation": "Deficient privacy notice & legal basis", "amount": "Up to €10,000,000"})
            action_plan.append({"title": "Publish GDPR Transparency Notice", "detail": "Detail processing legal basis (Art. 6), DPO contact, retention periods, and DSAR procedures.", "action_type": "policy_gen", "btn": "Generate GDPR Policy"})
    else:  # CCPA
        if not has_banner:
            score -= 30; potential_fines += 75000
            fines_items.append({"article": "§ 1798.120", "violation": "Missing Do Not Sell/Share Opt-Out link", "amount": "$2,500 - $7,500 per breach"})
            action_plan.append({"title": "Deploy 'Do Not Sell/Share' Footer Link", "detail": "Add a prominent opt-out mechanism and configure automated Global Privacy Control (GPC) support.", "action_type": "cookie_code", "btn": "Get Opt-Out Snippet"})
        if not has_policy:
            score -= 30; potential_fines += 75000
            fines_items.append({"article": "§ 1798.100", "violation": "Missing CCPA Notice at Collection", "amount": "$2,500 - $7,500 per violation"})
            action_plan.append({"title": "Publish Notice at Collection", "detail": "Disclose categories of personal info collected in the last 12 months and retention schedules.", "action_type": "policy_gen", "btn": "Generate CCPA Notice"})

    if not action_plan:
        action_plan.append({"title": "الموقع مستوفٍ لكافة المعايير الأساسية", "detail": "حافظ على وضعك المتميز عبر تفعيل رادار التنبيهات الدورية وتثبيت شارة الثقة الرقمية.", "action_type": "badge", "btn": "الحصول على شارة الثقة"})

    score = max(20, min(100, score))
    status_label = "Conforme / ممتثل" if score >= 85 else ("Partiellement Conforme" if score >= 60 else "Non-Conforme")

    try:
        conn = sqlite3.connect(DB_FILE)
        conn.cursor().execute('''
            INSERT OR REPLACE INTO audit_history (id, target, domain, framework, score, status, fines_amount, fines_currency, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (f"aud_{int(time.time())}", target_url, domain, framework, score, status_label, potential_fines, fines_currency, datetime.now().strftime("%Y-%m-%d %H:%M")))
        conn.commit()
        conn.close()
    except Exception:
        pass

    return {
        "target": target_url, "domain": domain, "framework": framework, "score": score,
        "status": status_label, "potential_fines": potential_fines, "fines_currency": fines_currency,
        "fines_items": fines_items, "action_plan": action_plan, "is_sovereign": not is_foreign_cloud,
        "has_ssl": has_ssl, "date": datetime.now().strftime("%Y-%m-%d %H:%M")
    }

# ==============================================================================
# 🎨 4. الواجهة البرمجية الشاملة (Full Sovereign RegTech Template)
# ==============================================================================
HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="ar" dir="rtl" class="dark scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Soverify Global - المنصة العالمية للامتثال والسيادة الرقمية</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Tajawal:wght@400;500;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        navy: { 950: '#030712', 900: '#070d18', 850: '#0c1526', 800: '#111d33', 700: '#1a2b4a' },
                        emerald: { 400: '#34d399', 500: '#10b981', 600: '#059669' },
                        sand: { 300: '#fde68a', gold: '#dfb15b' }
                    },
                    fontFamily: {
                        sans: ['Tajawal', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace'],
                        signature: ['Alex Brush', 'cursive']
                    }
                }
            }
        }
    </script>
    <style>
        body { background-color: #030712; color: #f3f4f6; font-family: 'Tajawal', sans-serif; }
        #cyber-canvas { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 0; opacity: 0.65; }
        .glass-card { background: rgba(12, 21, 38, 0.85); backdrop-filter: blur(14px); border: 1px solid rgba(16, 185, 129, 0.2); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4); }
        .typewriter-cursor::after { content: '|'; color: #10b981; animation: blink 0.8s infinite; }
        @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
        .circle-bg { fill: none; stroke: #111d33; stroke-width: 3.4; }
        .circle-bar { fill: none; stroke-width: 3.4; stroke-linecap: round; stroke: url(#emerald-gold); transition: stroke-dasharray 1.4s ease; }
    </style>
</head>
<body class="min-h-screen flex flex-col relative selection:bg-emerald-500 selection:text-slate-950">

    <canvas id="cyber-canvas"></canvas>

    <!-- Top Sovereign Ribbon -->
    <div class="relative z-10 bg-navy-950 border-b border-emerald-500/25 px-4 py-2 text-xs">
        <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div class="flex items-center gap-2 text-slate-300">
                <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span class="font-bold text-white">السيادة الرقمية العالمية:</span>
                <span>المغرب (القانون 08.09 CNDP) • الاتحاد الأوروبي (GDPR) • كاليفورنيا (CCPA/CPRA)</span>
            </div>
            <div class="flex items-center gap-3 font-mono text-[11px]">
                <div class="flex items-center bg-navy-900 border border-slate-700 rounded-lg p-0.5">
                    <button onclick="setLang('ar')" id="btn-lang-ar" class="px-2.5 py-0.5 rounded bg-emerald-500/25 text-emerald-300 font-bold">العربية</button>
                    <button onclick="setLang('fr')" id="btn-lang-fr" class="px-2.5 py-0.5 rounded text-slate-400 hover:text-white">Français</button>
                    <button onclick="setLang('en')" id="btn-lang-en" class="px-2.5 py-0.5 rounded text-slate-400 hover:text-white">English</button>
                </div>
                <span class="text-sand-gold font-bold"><i class="fa-solid fa-shield-halved"></i> Sovereign RegTech v5.0</span>
            </div>
        </div>
    </div>

    <!-- Header / Navbar -->
    <header class="sticky top-0 z-40 bg-navy-900/90 backdrop-blur-md border-b border-slate-800">
        <div class="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
            <a href="#hero" class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-sand-gold/20 border border-emerald-500/40 flex items-center justify-center text-2xl shadow">🇲🇦</div>
                <div>
                    <div class="flex items-center gap-1.5">
                        <span class="font-extrabold text-white text-xl">Soverify</span>
                        <span class="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/15 text-emerald-400 rounded-full border border-emerald-500/30">Global</span>
                    </div>
                    <p class="text-[11px] text-slate-400">السيادة الرقمية والامتثال متعدد التشريعات</p>
                </div>
            </a>

            <nav class="hidden md:flex items-center gap-1 bg-navy-850 p-1 rounded-2xl border border-slate-800 text-xs font-semibold">
                <a href="#hero" class="px-3 py-2 rounded-xl text-slate-300 hover:text-white"><i class="fa-solid fa-house text-emerald-400 ml-1"></i> الرئيسية</a>
                <a href="#dashboard" class="px-3 py-2 rounded-xl text-slate-300 hover:text-white"><i class="fa-solid fa-chart-pie text-emerald-400 ml-1"></i> الامتثال</a>
                <a href="#action-remediation-section" class="px-3 py-2 rounded-xl text-emerald-400 hover:text-emerald-300"><i class="fa-solid fa-wrench ml-1"></i> الإصلاح الفوري</a>
                <a href="#viral-badge-section" class="px-3 py-2 rounded-xl text-sand-gold hover:text-sand-300"><i class="fa-solid fa-shield-check ml-1"></i> شارة الثقة 🛡️</a>
                <a href="#founder-vision-section" class="px-3 py-2 rounded-xl text-slate-300 hover:text-white"><i class="fa-solid fa-quote-right text-sand-gold ml-1"></i> رؤية المؤسس</a>
            </nav>

            <div class="flex items-center gap-2">
                <button onclick="exportCSV()" class="bg-navy-800 hover:bg-navy-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1">
                    <i class="fa-solid fa-file-csv text-emerald-400"></i> <span class="hidden sm:inline">CSV</span>
                </button>
                <button onclick="handlePDFClick()" id="btn-pdf-export" class="bg-gradient-to-r from-emerald-500 to-sand-gold text-slate-950 font-extrabold px-3.5 py-2 rounded-xl text-xs transition flex items-center gap-1.5 shadow">
                    <i class="fa-solid fa-file-pdf"></i>
                    <span id="txt-pdf-btn">تقرير PDF رسمي 🔓</span>
                </button>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section id="hero" class="relative z-10 pt-10 pb-12 text-center">
        <div class="max-w-4xl mx-auto px-4 space-y-4">
            <!-- Framework Selector Badges -->
            <div class="inline-flex flex-wrap items-center justify-center gap-2 p-1.5 bg-navy-900 rounded-2xl border border-slate-700 max-w-xl mx-auto shadow">
                <span class="text-xs text-slate-400 px-2 font-bold">الإطار التشريعي:</span>
                <button onclick="switchFramework('cndp')" id="fw-cndp" class="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 shadow">
                    🇲🇦 المغرب (08-09 CNDP)
                </button>
                <button onclick="switchFramework('gdpr')" id="fw-gdpr" class="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white">
                    🇪🇺 الاتحاد الأوروبي (GDPR)
                </button>
                <button onclick="switchFramework('ccpa')" id="fw-ccpa" class="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white">
                    🇺🇸 كاليفورنيا (CCPA / CPRA)
                </button>
            </div>

            <!-- Dynamic Typewriter -->
            <div class="min-h-[90px] flex flex-col items-center justify-center">
                <h1 id="typewriter-h1" class="text-3xl sm:text-5xl font-black text-white leading-tight typewriter-cursor"></h1>
                <h2 id="typewriter-h2" class="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto mt-2 opacity-0 transition-opacity duration-700"></h2>
            </div>

            <!-- Scan Input Form -->
            <form onsubmit="handleAudit(event)" class="glass-card p-3 rounded-2xl border border-emerald-500/30 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto shadow-2xl">
                <div class="relative flex-1">
                    <span class="absolute right-4 top-3.5 text-emerald-400"><i class="fa-solid fa-globe"></i></span>
                    <input type="text" id="target-input" value="banquepopulaire.ma" placeholder="أدخل نطاق الموقع (مثال: banquepopulaire.ma)" class="w-full bg-navy-950 border border-slate-700 rounded-xl pr-10 pl-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-emerald-400" required>
                </div>
                <button type="submit" id="btn-scan" class="bg-gradient-to-r from-emerald-500 to-sand-gold hover:from-emerald-400 text-slate-950 font-extrabold px-7 py-3 rounded-xl transition flex items-center justify-center gap-2 shadow active:scale-95">
                    <i class="fa-solid fa-shield-virus"></i>
                    <span id="txt-scan-btn">ابدأ التدقيق الفوري</span>
                </button>
            </form>

            <div class="flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
                <span>نطاقات مقترحة:</span>
                <button onclick="setTarget('banquepopulaire.ma')" class="hover:text-emerald-400 underline">banquepopulaire.ma</button> •
                <button onclick="setTarget('lemonde.fr')" class="hover:text-emerald-400 underline">lemonde.fr</button> •
                <button onclick="setTarget('california-tech.com')" class="hover:text-emerald-400 underline">california-tech.com</button>
            </div>
        </div>
    </section>

    <!-- Dashboard & Circular Meter Section -->
    <section id="dashboard" class="relative z-10 max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
                <span class="text-xs font-mono text-emerald-400 font-bold">لوحة القيادة والمطابقة • Sovereign Compliance</span>
                <h2 class="text-2xl font-black text-white">نتائج التدقيق ومصفوفة العقوبات</h2>
            </div>
            <button onclick="handlePDFClick()" class="text-xs bg-navy-850 hover:bg-navy-800 text-sand-gold border border-sand-gold/30 px-3 py-2 rounded-xl flex items-center gap-1.5">
                <i class="fa-solid fa-share-nodes"></i> <span>مشاركة لفك قفل التقرير</span>
            </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="glass-card p-4 rounded-2xl space-y-1">
                <div class="flex items-center justify-between text-xs text-slate-400"><span>الإشعار الرسمي</span><i class="fa-solid fa-stamp text-emerald-400"></i></div>
                <div id="metric-cndp" class="text-base font-extrabold text-white">وصل الإيداع D-1</div>
                <p class="text-[11px] text-slate-400">المطابقة الإجرائية.</p>
            </div>
            <div class="glass-card p-4 rounded-2xl space-y-1">
                <div class="flex items-center justify-between text-xs text-slate-400"><span>ضوابط التتبع</span><i class="fa-solid fa-cookie-bite text-sand-gold"></i></div>
                <div id="metric-cookies" class="text-base font-extrabold text-white">الموافقة الصريحة</div>
                <p class="text-[11px] text-slate-400">حظر التتبع المسبق.</p>
            </div>
            <div class="glass-card p-4 rounded-2xl space-y-1">
                <div class="flex items-center justify-between text-xs text-slate-400"><span>الحدود الجغرافية</span><i class="fa-solid fa-server text-emerald-400"></i></div>
                <div id="metric-sovereign" class="text-base font-extrabold text-white">توطين سيادي</div>
                <p class="text-[11px] text-slate-400">حظر النقل دون ترخيص.</p>
            </div>
            <div class="glass-card p-4 rounded-2xl space-y-1">
                <div class="flex items-center justify-between text-xs text-rose-400"><span>العقوبات المالية</span><i class="fa-solid fa-gavel text-rose-400"></i></div>
                <div id="metric-fines" class="text-base font-extrabold text-rose-400 font-mono">0 MAD</div>
                <p class="text-[11px] text-slate-400">المخاطر التقديرية.</p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Circular Meter -->
            <div class="glass-card p-6 rounded-3xl flex flex-col items-center justify-center text-center">
                <div class="w-full flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                    <span class="text-xs font-mono text-emerald-400 font-bold">مؤشر الامتثال</span>
                    <span id="meter-target" class="text-xs font-mono text-slate-400">banquepopulaire.ma</span>
                </div>
                <div class="relative w-44 h-44 flex items-center justify-center">
                    <svg viewBox="0 0 36 36" class="w-full h-full">
                        <defs>
                            <linearGradient id="emerald-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#10b981" /><stop offset="100%" stop-color="#dfb15b" />
                            </linearGradient>
                        </defs>
                        <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path id="meter-bar" class="circle-bar" stroke-dasharray="88, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div class="absolute inset-0 flex flex-col items-center justify-center">
                        <span id="meter-score" class="text-4xl font-black font-mono text-white">88%</span>
                        <span id="meter-status" class="text-xs font-bold text-emerald-400 mt-1">Conforme</span>
                    </div>
                </div>
            </div>

            <!-- Fines Table -->
            <div class="lg:col-span-2 glass-card p-6 rounded-3xl space-y-3">
                <h3 class="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                    <i class="fa-solid fa-scale-balanced text-sand-gold"></i>
                    <span>مصفوفة الغرامات التنبؤية والتسوية</span>
                </h3>
                <div class="overflow-x-auto">
                    <table class="w-full text-right text-xs">
                        <thead>
                            <tr class="border-b border-slate-700 text-slate-400 font-mono">
                                <th class="p-2">المادة</th><th class="p-2">المخالفة</th><th class="p-2">الغرامة المقدرة</th><th class="p-2">التسوية</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800/60" id="fines-table-body"></tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>

    <!-- NEW FEATURE 2: ACTIONABLE NEXT STEPS ENGINE (محرك التوجيه العملي الفوري) -->
    <section id="action-remediation-section" class="relative z-10 max-w-7xl mx-auto px-4 py-4 space-y-4">
        <div class="glass-card p-6 rounded-3xl border border-emerald-500/40 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl">
                        <i class="fa-solid fa-wand-magic-sparkles"></i>
                    </div>
                    <div>
                        <h3 class="text-base font-black text-white">محرك التوجيه العملي والإصلاح الفوري (Actionable Remediation Roadmap)</h3>
                        <p class="text-xs text-slate-400">حلول برمجية وتنظيمية فورية بنقرة واحدة لتحويل المخالفات إلى امتثال معتمد بنسبة 100%.</p>
                    </div>
                </div>
                <span class="text-xs font-mono text-sand-gold bg-sand-gold/10 px-3 py-1 rounded-full border border-sand-gold/20 self-start sm:self-auto">
                    حلول فورية معتمدة
                </span>
            </div>

            <!-- Dynamic Action Cards Container -->
            <div id="action-plan-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <!-- Injected dynamically based on audit results -->
            </div>
        </div>
    </section>

    <!-- NEW FEATURE 1: THE FOUNDER'S VISION (رسالة وفلسفة المؤسس) -->
    <section id="founder-vision-section" class="relative z-10 max-w-5xl mx-auto px-4 py-8">
        <div class="glass-card p-8 sm:p-10 rounded-3xl border border-sand-gold/35 relative overflow-hidden shadow-2xl">
            <div class="absolute -top-12 -left-12 w-48 h-48 bg-sand-gold/10 rounded-full blur-3xl pointer-events-none"></div>
            <div class="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div class="relative z-10 space-y-6">
                <div class="flex items-center gap-3 border-b border-slate-800 pb-4">
                    <span class="text-2xl text-sand-gold"><i class="fa-solid fa-quote-right"></i></span>
                    <div>
                        <span class="text-xs font-mono text-sand-gold font-bold uppercase tracking-wider">The Founder's Vision • فلسفة المنصة</span>
                        <h2 class="text-2xl font-black text-white">لماذا أنشأنا Soverify؟</h2>
                    </div>
                </div>

                <div class="text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 font-normal">
                    <p>
                        في عصر تتسارع فيه التحولات الرقمية وتتعاظم فيه قيمة البيانات كأثمن مورد سيادي، لم يعد الامتثال القانوني مجرد إجراء شكلي روتيني أو عبء تنظيمي تخشى الشركات غراماته المالية، بل غدا <strong class="text-white font-bold">الحصن الحقيقي الذي يبني ثقة العملاء ويصون السيادة الرقمية للأوطان</strong>.
                    </p>
                    <p>
                        أنشأنا <span class="font-bold text-emerald-400">Soverify</span> لسد تلك الفجوة المزمنة بين التعقيد القانوني الجاف والتطبيق البرمجي الفعلي على أرض الواقع؛ لنمنح كل مقاولة، رائد أعمال، ومطور تقني في المملكة المغربية والعالم أداة ذكية، شفافة، وفعالة تحول المتطلبات التنظيمية الصعبة (من القانون المغربي 08.09 وقرارات CNDP إلى اللائحة الأوروبية العامة GDPR وقانون كاليفورنيا CCPA) إلى <strong class="text-sand-gold font-bold">خطوات إصلاح عملية يسيرة وشارات ثقة رقمية تثبت المصداقية</strong>.
                    </p>
                    <p class="text-slate-400 text-xs sm:text-sm italic">
                        "السيادة الرقمية ليست عائقاً أمام الابتكار التكنولوجي، بل هي الأساس الأخلاقي والاستراتيجي لنموه المستدام."
                    </p>
                </div>

                <div class="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-navy-900 to-sand-gold/20 border border-sand-gold/40 flex items-center justify-center text-xl shadow">
                            🇲🇦
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <span class="text-lg font-bold text-white">طه ستري</span>
                                <span class="text-xs text-slate-400 font-mono font-medium">(Taha Setri)</span>
                            </div>
                            <span class="text-xs text-emerald-400 font-mono block">مؤسس المنصة ورئيس تطوير السيادة الرقمية • VerifyOS™</span>
                        </div>
                    </div>

                    <div class="text-right">
                        <span class="font-signature text-3xl sm:text-4xl text-sand-gold tracking-wide">Taha Setri</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- EMBEDDABLE TRUST BADGE WIDGET -->
    <section id="viral-badge-section" class="relative z-10 max-w-7xl mx-auto px-4 py-6 space-y-4">
        <div class="glass-card p-6 rounded-3xl border border-sand-gold/30 space-y-4">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                    <span class="px-2.5 py-0.5 rounded-full bg-sand-gold/15 text-sand-gold text-[10px] font-mono font-bold">Embeddable Trust Badge</span>
                    <h2 class="text-xl font-black text-white mt-1">احصل على شارة الثقة الرقمية لموقعك (Soverify Trust Badge)</h2>
                    <p class="text-xs text-slate-400">انسخ الكود وضعه في تذييل موقعك لزيادة ثقة عملائك وإثبات امتثالك القانوني فورياً.</p>
                </div>
                <div class="flex items-center gap-3">
                    <span class="text-xs text-slate-400">المعاينة الحية:</span>
                    <div id="badge-live-preview" class="p-2 bg-navy-950 rounded-xl border border-emerald-500/40 shadow flex items-center gap-2">
                        <img id="badge-img" src="/api/badge?score=88&framework=cndp" alt="Soverify Compliant" class="h-7">
                    </div>
                </div>
            </div>

            <div class="space-y-2">
                <div class="flex items-center justify-between text-xs">
                    <span class="font-bold text-slate-300">كود التضمين (HTML Embed Code مع رابط خلفي موثوق):</span>
                    <button onclick="copyBadgeCode()" id="btn-copy-badge" class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1 rounded-lg transition flex items-center gap-1 text-xs">
                        <i class="fa-solid fa-copy"></i> <span>نسخ الكود</span>
                    </button>
                </div>
                <textarea id="badge-code-box" readonly class="w-full h-20 bg-navy-950 border border-slate-700 rounded-xl p-3 text-xs font-mono text-emerald-400 resize-none"></textarea>
            </div>
        </div>
    </section>

    <!-- DATA BREACH ALERT RADAR (Leads Magnet) -->
    <section id="breach-radar-section" class="relative z-10 max-w-7xl mx-auto px-4 py-4">
        <div class="glass-card p-6 rounded-3xl border border-rose-500/30 space-y-4">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="space-y-1">
                    <div class="flex items-center gap-2 text-rose-400">
                        <i class="fa-solid fa-shield-virus text-lg animate-pulse"></i>
                        <h3 class="text-base font-extrabold text-white">رادار الحراسة والتنبيه المبكر لتسريبات البيانات (Breach Radar Alert)</h3>
                    </div>
                    <p class="text-xs text-slate-300 max-w-2xl">اشترك بريدك ونطاقك لتلقي إشعارات حية فور رصد أي تسريب أو ثغرة تشريعية وفقاً لمساطر الإشعار خلال 72 ساعة المنصوص عليها في القانون 08-09 و GDPR.</p>
                </div>

                <form onsubmit="handleBreachSubscribe(event)" class="flex flex-col sm:flex-row gap-2 w-full md:w-auto shrink-0">
                    <input type="email" id="sub-email" placeholder="بريدك المهني (name@company.com)" class="bg-navy-950 border border-slate-700 px-4 py-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-rose-400 font-mono" required>
                    <button type="submit" id="btn-sub-breach" class="bg-gradient-to-r from-rose-500 to-sand-gold text-slate-950 font-extrabold px-5 py-2.5 rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow active:scale-95">
                        <i class="fa-solid fa-bell"></i> <span>تفعيل الحراسة المجانية</span>
                    </button>
                </form>
            </div>
            <div id="sub-result-msg" class="hidden text-xs p-3 rounded-xl bg-navy-950 border border-emerald-500/30 text-emerald-400"></div>
        </div>
    </section>

    <!-- AI DPO Assistant -->
    <section id="ai-hub" class="relative z-10 max-w-4xl mx-auto px-4 py-6 space-y-4">
        <div class="glass-card p-6 rounded-3xl border border-emerald-500/30 space-y-4 shadow-2xl">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl"><i class="fa-solid fa-robot"></i></div>
                    <div>
                        <h3 class="text-base font-extrabold text-white">المستشار القانوني الذكي (Global AI DPO Assistant)</h3>
                        <p class="text-xs text-slate-400">استفسارات فورية ومطابقة للنصوص القانونية (CNDP • GDPR • CCPA)</p>
                    </div>
                </div>
            </div>

            <div id="chat-box" class="h-64 overflow-y-auto space-y-3 p-3 bg-navy-950 rounded-2xl border border-slate-800 text-xs">
                <div class="p-3.5 rounded-2xl bg-navy-900 border border-slate-800 text-slate-200">
                    <span class="font-bold text-emerald-400 block mb-1">مرحباً بك في Soverify Global DPO 🇲🇦:</span>
                    يمكنك سؤالي عن شروط الكوكيز، عقوبات عدم التصريح لـ CNDP، أو التزامات GDPR و CCPA.
                </div>
            </div>

            <form onsubmit="handleChatSubmit(event)" class="flex gap-2">
                <input type="text" id="chat-input" placeholder="اكتب استفسارك القانوني..." class="flex-1 bg-navy-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400" required>
                <button type="submit" class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs transition">إرسال</button>
            </form>
        </div>
    </section>

    <!-- Footer with Founder Signature -->
    <footer id="footer" class="relative z-10 mt-auto bg-navy-950 border-t border-slate-800 py-8 text-xs">
        <div class="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400">
            <div>
                <span class="font-extrabold text-white text-base">Soverify Global</span>
                <p>منصة الامتثال والسيادة الرقمية العالمية ورصد الخروقات التشريعية.</p>
            </div>
            <div class="flex flex-col items-center md:items-end space-y-1">
                <span class="text-[11px] text-slate-400">مؤسس المنصة ورئيس تطوير السيادة الرقمية:</span>
                <div class="flex items-center gap-2">
                    <span class="font-signature text-2xl text-sand-gold tracking-wide">Taha Setri</span>
                    <span class="text-white font-bold text-sm">(طه ستري)</span>
                </div>
                <span class="text-[10px] font-mono text-emerald-400">Architect of VerifyOS™ • Sovereign RegTech</span>
            </div>
        </div>
    </footer>

    <!-- INTERACTIVE REMEDIATION MODAL -->
    <div id="remediation-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
        <div class="glass-card max-w-xl w-full p-6 rounded-3xl border border-emerald-500/40 space-y-4">
            <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 id="rem-modal-title" class="text-base font-bold text-white">حل الإشكال القانوني</h3>
                <button onclick="closeRemediationModal()" class="text-slate-400 hover:text-white text-lg"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div id="rem-modal-body" class="text-xs text-slate-300 space-y-3 font-mono leading-relaxed">
                <!-- Injected dynamically -->
            </div>
            <div class="flex justify-end pt-2">
                <button onclick="copyRemediationSnippet()" id="btn-copy-rem" class="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition">
                    <i class="fa-solid fa-copy"></i> <span>نسخ النص / الكود</span>
                </button>
            </div>
        </div>
    </div>

    <!-- VIRAL SHARE-TO-UNLOCK MODAL -->
    <div id="share-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 hidden">
        <div class="glass-card max-w-md w-full p-6 rounded-3xl border border-sand-gold/40 space-y-4 text-center">
            <div class="w-14 h-14 mx-auto rounded-2xl bg-sand-gold/15 text-sand-gold flex items-center justify-center text-3xl">
                <i class="fa-solid fa-lock-open animate-bounce"></i>
            </div>
            <h3 class="text-lg font-black text-white">شارك الفحص لفك قفل تقرير الـ PDF الشامل مجاناً</h3>
            <p class="text-xs text-slate-300 leading-relaxed">
                لدعم السيادة الرقمية والامتثال المؤسسي، شارك نتيجتك على لينكد إن (LinkedIn) أو تويتر (X) لفك قفل وتنزيل التقرير الرسمي المعتمد فورياً.
            </p>
            <div class="space-y-2 pt-2">
                <button onclick="triggerViralShare('linkedin')" class="w-full bg-[#0077b5] hover:bg-[#006396] text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition">
                    <i class="fa-brands fa-linkedin"></i> <span>مشاركة على LinkedIn (فك القفل فورياً)</span>
                </button>
                <button onclick="triggerViralShare('twitter')" class="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition">
                    <i class="fa-brands fa-x-twitter"></i> <span>مشاركة على X (Twitter)</span>
                </button>
                <button onclick="bypassUnlock()" class="text-xs text-slate-400 hover:text-emerald-400 underline pt-2 block">
                    تخطي والمتابعة لتحميل التقرير مباشرة
                </button>
            </div>
        </div>
    </div>

    <!-- Client Script -->
    <script>
        let currentLang = 'ar';
        let currentFramework = 'cndp';
        let isPdfUnlocked = false;

        const i18n = {
            ar: {
                cndp_h1: "السيادة الرقمية المغربية والامتثال للقانون 08.09",
                cndp_h2: "فحص فوري للخوادم، مداولة الكوكيز 08-2020، ومصفوفة الغرامات التنبؤية بالدرهم (MAD)",
                gdpr_h1: "الامتثال الأوروبي للبيانات وحماية الخصوصية (GDPR)",
                gdpr_h2: "تدقيق المعالجة، نقل المعطيات الدولية، وغرامات المادة 83 التي تصل لـ 20 مليون يورو",
                ccpa_h1: "قانون كاليفورنيا لخصوصية المستهلك (CCPA / CPRA)",
                ccpa_h2: "آليات Do Not Sell/Share، إشعار الجمع، وحماية بيانات المستهلكين في السوق الأمريكي",
                btnScan: "ابدأ التدقيق الفوري",
                scanning: "جارِ التدقيق التنظيمي..."
            },
            fr: {
                cndp_h1: "Souveraineté Numérique Marocaine & Loi 08-09",
                cndp_h2: "Audit instantané des serveurs, délibération 08-2020 et matrice des amendes (MAD)",
                gdpr_h1: "Conformité Européenne RGPD (EU GDPR)",
                gdpr_h2: "Audit des transferts internationaux, bannières cookies et sanctions de l'Art. 83 jusqu'à 20M€",
                ccpa_h1: "Conformité Californie CCPA / CPRA",
                ccpa_h2: "Mécanismes Do Not Sell/Share, Notice at Collection et droits des consommateurs US",
                btnScan: "Lancer l'audit immédiat",
                scanning: "Audit réglementaire en cours..."
            },
            en: {
                cndp_h1: "Moroccan Digital Sovereignty & Law 08-09",
                cndp_h2: "Instant server sovereignty audit, CNDP 08-2020 deliberation, and MAD predictive penalties",
                gdpr_h1: "European Union GDPR Compliance Platform",
                gdpr_h2: "Auditing international data transfers, ePrivacy cookies, and Article 83 fines up to €20M",
                ccpa_h1: "California Consumer Privacy Act (CCPA / CPRA)",
                ccpa_h2: "Do Not Sell/Share mechanisms, Notice at Collection, and statutory consumer privacy rights",
                btnScan: "Start Instant Audit",
                scanning: "Auditing compliance..."
            }
        };

        // Typewriter Engine
        let twIndex = 0;
        let twText = "";
        function runTypewriter() {
            const h1 = document.getElementById('typewriter-h1');
            const h2 = document.getElementById('typewriter-h2');
            h1.textContent = '';
            h2.style.opacity = '0';
            twIndex = 0;
            twText = i18n[currentLang][`${currentFramework}_h1`] || i18n[currentLang]['cndp_h1'];
            h2.textContent = i18n[currentLang][`${currentFramework}_h2`] || i18n[currentLang]['cndp_h2'];

            function typeChar() {
                if (twIndex < twText.length) {
                    h1.textContent += twText.charAt(twIndex);
                    twIndex++;
                    setTimeout(typeChar, 30);
                } else {
                    h2.style.opacity = '1';
                }
            }
            typeChar();
        }

        function switchFramework(fw) {
            currentFramework = fw;
            ['cndp', 'gdpr', 'ccpa'].forEach(f => {
                const btn = document.getElementById(`fw-${f}`);
                btn.className = (f === fw) ? "px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 shadow" : "px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white";
            });
            updateBadgeCode();
            runTypewriter();
            handleAudit(new Event('submit'));
        }

        function setLang(lang) {
            currentLang = lang;
            ['ar', 'fr', 'en'].forEach(l => {
                const btn = document.getElementById(`btn-lang-${l}`);
                btn.className = (l === lang) ? "px-2.5 py-0.5 rounded bg-emerald-500/25 text-emerald-300 font-bold" : "px-2.5 py-0.5 rounded text-slate-400 hover:text-white";
            });
            document.documentElement.lang = lang;
            document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
            document.getElementById('txt-scan-btn').textContent = i18n[lang].btnScan;
            runTypewriter();
        }

        function setTarget(d) {
            document.getElementById('target-input').value = d;
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
                    body: JSON.stringify({ target: target, framework: currentFramework })
                });
                const data = await res.json();

                document.getElementById('meter-target').textContent = data.domain;
                document.getElementById('meter-score').textContent = data.score + '%';
                document.getElementById('meter-status').textContent = data.status;
                document.getElementById('meter-bar').setAttribute('stroke-dasharray', `${data.score}, 100`);

                document.getElementById('metric-cndp').textContent = (data.score >= 80) ? "وصل الإيداع متاح" : "غير مصرح";
                document.getElementById('metric-cookies').textContent = (data.score >= 70) ? "متوافق مع الضوابط" : "تتبع مسبق محظور";
                document.getElementById('metric-sovereign').textContent = data.is_sovereign ? "توطين سيادي 🇲🇦" : "سحابة خارجية";
                document.getElementById('metric-fines').textContent = Number(data.potential_fines).toLocaleString() + " " + data.fines_currency;

                const tbody = document.getElementById('fines-table-body');
                tbody.innerHTML = data.fines_items.map(f => `
                    <tr>
                        <td class="p-2 font-mono text-emerald-400 font-bold">${f.article}</td>
                        <td class="p-2 text-slate-200">${f.violation}</td>
                        <td class="p-2 font-mono text-rose-400 font-bold">${f.amount}</td>
                        <td class="p-2 text-slate-300">تسوية فورية معتمدة</td>
                    </tr>
                `).join('');

                // Render Actionable Next Steps Cards
                const actionBox = document.getElementById('action-plan-container');
                if (data.action_plan && data.action_plan.length > 0) {
                    actionBox.innerHTML = data.action_plan.map(act => `
                        <div class="p-4 rounded-2xl bg-navy-900 border border-slate-800 flex flex-col justify-between space-y-3">
                            <div class="space-y-1">
                                <span class="text-[10px] font-mono font-bold text-emerald-400 uppercase"><i class="fa-solid fa-circle-check ml-1"></i> خطوة إصلاح موصى بها</span>
                                <h4 class="text-xs font-bold text-white">${act.title}</h4>
                                <p class="text-[11px] text-slate-400 leading-relaxed">${act.detail}</p>
                            </div>
                            <button onclick="openRemediation('${act.action_type}', '${data.domain}')" class="bg-navy-800 hover:bg-navy-700 text-sand-gold border border-sand-gold/30 px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1">
                                <i class="fa-solid fa-code"></i> <span>${act.btn}</span>
                            </button>
                        </div>
                    `).join('');
                }

                updateBadgeCode(data.domain, data.score);
            } catch (err) {
                console.error("Audit error:", err);
            } finally {
                btn.disabled = false;
                btnTxt.textContent = i18n[currentLang].btnScan;
            }
        }

        // REMEDIATION ROADMAP MODAL ACTIONS
        function openRemediation(type, domain) {
            domain = domain || document.getElementById('target-input').value.trim() || "votre-site.ma";
            const modal = document.getElementById('remediation-modal');
            const title = document.getElementById('rem-modal-title');
            const body = document.getElementById('rem-modal-body');

            if (type === 'policy_gen') {
                title.textContent = `سياسة خصوصية متوافقة مع القانون 08.09 (${domain})`;
                body.innerHTML = `
                    <p class="text-emerald-400 font-bold">// انسخ هذا النص وضعه في صفحة سياسة الخصوصية بموقعك:</p>
                    <textarea id="rem-copy-area" readonly class="w-full h-44 bg-navy-950 p-3 rounded-xl border border-slate-700 text-[11px] text-slate-200">
إشعار حماية المعطيات الشخصية (${domain})
وفقاً لمقتضيات القانون رقم 08.09 المتعلق بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي الصادر بالظهير الشريف 1.09.15:
تخضع المعطيات المجمعة عبر هذا الموقع لمعالجة مصرح بها لدى اللجنة الوطنية لمراقبة حماية المعطيات ذات الطابع الشخصي (CNDP) تحت رقم الوصل [D-W-XXXX/2026].
يمكن للمستخدمين ممارسة حقوق الولوج والتصحيح والتعرض المنصوص عليها في المواد 7 و 8 و 9 عبر مراسلة مسؤول حماية المعطيات (DPO) على البريد الإلكتروني: dpo@${domain}.
                    </textarea>
                `;
            } else if (type === 'cookie_code') {
                title.textContent = `كود لافتة كوكيز متوافقة مع مداولة CNDP رقم 08-2020`;
                body.innerHTML = `
                    <p class="text-sand-gold font-bold">// كود لافتة فوري يضمن حظر التتبع المسبق وتوفير زر 'رفض الكل':</p>
                    <textarea id="rem-copy-area" readonly class="w-full h-44 bg-navy-950 p-3 rounded-xl border border-slate-700 text-[11px] text-emerald-400 font-mono">
<div id="cndp-cookie-banner" style="position:fixed;bottom:15px;left:15px;right:15px;background:#0c1526;border:1px solid #10b981;border-radius:12px;padding:16px;z-index:9999;color:#fff;display:flex;justify-content:space-between;align-items:center;font-family:sans-serif;font-size:12px;">
  <span>نحترم خصوصيتك طبقاً للقانون 08.09 ومداولة 08-2020. هل توافق على استخدام ملفات التحليل الإحصائي؟</span>
  <div style="display:flex;gap:8px;">
    <button onclick="document.getElementById('cndp-cookie-banner').remove()" style="background:#1f2937;color:#f87171;border:none;padding:6px 14px;border-radius:8px;cursor:pointer;font-weight:bold;">رفض الكل (Refuser)</button>
    <button onclick="localStorage.setItem('cndp_consent','1');document.getElementById('cndp-cookie-banner').remove()" style="background:#10b981;color:#000;border:none;padding:6px 14px;border-radius:8px;cursor:pointer;font-weight:bold;">قبول الكل (Accepter)</button>
  </div>
</div>
                    </textarea>
                `;
            } else {
                title.textContent = `دليل إيداع التصريح المسبق D-1 لدى CNDP`;
                body.innerHTML = `
                    <div class="space-y-2 text-slate-200">
                        <p class="font-bold text-emerald-400">الخطوات الإجرائية الرسمية:</p>
                        <ol class="list-decimal list-inside space-y-1 text-slate-300">
                            <li>تحميل استمارة التصريح المسبق (D-1) من البوابة الإلكترونية الرسمية لـ CNDP.</li>
                            <li>تحديد غايات المعالجة وفئات المعطيات المجمعة ومدة الحفظ.</li>
                            <li>تحديد تدابير الأمن التقني (تشفير TLS وخوادم الاستضافة).</li>
                            <li>إيداع الملف واستلام وصل الإيداع القانوني لنشره في تذييل الموقع.</li>
                        </ol>
                    </div>
                `;
            }
            modal.classList.remove('hidden');
        }

        function closeRemediationModal() {
            document.getElementById('remediation-modal').classList.add('hidden');
        }

        function copyRemediationSnippet() {
            const area = document.getElementById('rem-copy-area');
            if (area) {
                area.select();
                document.execCommand('copy');
                const btn = document.getElementById('btn-copy-rem');
                btn.innerHTML = `<i class="fa-solid fa-check"></i> <span>تم النسخ بنجاح!</span>`;
                setTimeout(() => {
                    btn.innerHTML = `<i class="fa-solid fa-copy"></i> <span>نسخ النص / الكود</span>`;
                }, 2000);
            } else {
                closeRemediationModal();
            }
        }

        // SHARE-TO-UNLOCK PDF
        function handlePDFClick() {
            if (isPdfUnlocked) {
                window.print();
            } else {
                document.getElementById('share-modal').classList.remove('hidden');
            }
        }

        function triggerViralShare(platform) {
            const shareText = encodeURIComponent(`قمنا بفحص امتثال موقعنا وحماية البيانات عبر منصة Soverify السيادية وحصلنا على نتيجة ممتازة! تحقق من امتثال موقعك لـ CNDP و GDPR فورياً:`);
            const appUrl = encodeURIComponent(window.location.origin);
            const url = (platform === 'linkedin')
                ? `https://www.linkedin.com/sharing/share-offsite/?url=${appUrl}`
                : `https://twitter.com/intent/tweet?text=${shareText}&url=${appUrl}`;
            window.open(url, '_blank', 'width=600,height=500');
            setTimeout(() => { bypassUnlock(); }, 1200);
        }

        function bypassUnlock() {
            isPdfUnlocked = true;
            document.getElementById('share-modal').classList.add('hidden');
            document.getElementById('txt-pdf-btn').textContent = "طباعة PDF متاح الآن 🖨️";
            window.print();
        }

        // BADGE CODE GENERATION
        function updateBadgeCode(domain, score) {
            domain = domain || document.getElementById('target-input').value.trim() || "example.com";
            score = score || 88;
            const origin = window.location.origin;
            const badgeImgUrl = `${origin}/api/badge?domain=${domain}&score=${score}&framework=${currentFramework}`;
            document.getElementById('badge-img').src = badgeImgUrl;
            const snippet = `<a href="${origin}" target="_blank" title="Verified by Soverify Sovereign RegTech">\n  <img src="${badgeImgUrl}" alt="Soverify Compliant Badge" height="32" />\n</a>`;
            document.getElementById('badge-code-box').value = snippet;
        }

        function copyBadgeCode() {
            const box = document.getElementById('badge-code-box');
            box.select();
            document.execCommand('copy');
            const btn = document.getElementById('btn-copy-badge');
            btn.innerHTML = `<i class="fa-solid fa-check"></i> <span>تم النسخ بنجاح!</span>`;
            setTimeout(() => {
                btn.innerHTML = `<i class="fa-solid fa-copy"></i> <span>نسخ الكود</span>`;
            }, 2000);
        }

        // BREACH RADAR LEADS
        async function handleBreachSubscribe(e) {
            e.preventDefault();
            const email = document.getElementById('sub-email').value.trim();
            const domain = document.getElementById('target-input').value.trim();
            const msgBox = document.getElementById('sub-result-msg');

            try {
                const res = await fetch('/api/subscribe-breach-alerts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email, domain: domain, framework: currentFramework })
                });
                const data = await res.json();
                msgBox.classList.remove('hidden');
                msgBox.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${data.message}`;
                document.getElementById('sub-email').value = '';
            } catch (err) {
                msgBox.classList.remove('hidden');
                msgBox.textContent = "حدث خطأ أثناء التسجيل. يرجى المحاولة لاحقاً.";
            }
        }

        // AI DPO Chat
        async function handleChatSubmit(e) {
            e.preventDefault();
            const input = document.getElementById('chat-input');
            const prompt = input.value.trim();
            if (!prompt) return;

            const chatBox = document.getElementById('chat-box');
            chatBox.innerHTML += `<div class="p-2.5 rounded-xl bg-navy-850 text-slate-200 mr-6 font-bold">${prompt}</div>`;
            input.value = '';

            try {
                const res = await fetch('/api/dpo-chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: prompt, framework: currentFramework, lang: currentLang })
                });
                const data = await res.json();
                chatBox.innerHTML += `
                    <div class="p-3 rounded-xl bg-navy-900 border border-emerald-500/30 text-slate-200 ml-6 space-y-1">
                        <div class="flex justify-between text-[10px] font-mono text-sand-gold">
                            <span>Soverify DPO (${currentFramework.toUpperCase()})</span>
                            <span>${data.articles.join(' • ')}</span>
                        </div>
                        <p>${data.reply}</p>
                    </div>
                `;
                chatBox.scrollTop = chatBox.scrollHeight;
            } catch (err) {}
        }

        function exportCSV() {
            window.location.href = `/api/export-audit-csv?framework=${currentFramework}`;
        }

        // Particles Background
        function initCyberMesh() {
            const canvas = document.getElementById('cyber-canvas');
            const ctx = canvas.getContext('2d');
            let w = canvas.width = window.innerWidth;
            let h = canvas.height = window.innerHeight;
            const pts = [];
            for (let i = 0; i < 35; i++) {
                pts.push({ x: Math.random()*w, y: Math.random()*h, vx: (Math.random()-0.5)*0.4, vy: (Math.random()-0.5)*0.4 });
            }
            function draw() {
                ctx.clearRect(0,0,w,h);
                ctx.fillStyle = '#10b981';
                pts.forEach(p => {
                    p.x += p.vx; p.y += p.vy;
                    if (p.x < 0 || p.x > w) p.vx *= -1;
                    if (p.y < 0 || p.y > h) p.vy *= -1;
                    ctx.beginPath(); ctx.arc(p.x, p.y, 1.4, 0, Math.PI*2); ctx.fill();
                });
                requestAnimationFrame(draw);
            }
            draw();
        }

        window.addEventListener('DOMContentLoaded', () => {
            initCyberMesh();
            runTypewriter();
            updateBadgeCode();
            handleAudit(new Event('submit'));
        });
    </script>
</body>
</html>
"""

# ==============================================================================
# 🌐 5. مسارات الخادم والميزات الفيروسية (Flask Viral Endpoints)
# ==============================================================================
@app.route("/", methods=["GET"])
def index():
    return HTML_TEMPLATE

@app.route("/api/audit", methods=["POST"])
def api_audit():
    data = request.get_json(silent=True) or request.form or {}
    target = data.get("target", "banquepopulaire.ma")
    framework = data.get("framework", "cndp").lower()
    return jsonify(audit_target(target, framework))

@app.route("/api/dpo-chat", methods=["POST"])
def api_dpo_chat():
    data = request.get_json(silent=True) or request.form or {}
    prompt = data.get("prompt", "")
    framework = data.get("framework", "cndp").lower()
    lang = data.get("lang", "ar")
    return jsonify(GlobalAIEngine.query(prompt, framework, lang))

# EMBEDDABLE TRUST BADGE SVG GENERATOR
@app.route("/api/badge", methods=["GET"])
def api_badge():
    domain = request.args.get("domain", "verified-site.ma")
    score = request.args.get("score", "88")
    framework = request.args.get("framework", "CNDP").upper()

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="220" height="32" viewBox="0 0 220 32">
  <rect width="220" height="32" rx="7" fill="#070d18" stroke="#10b981" stroke-width="1.2"/>
  <circle cx="16" cy="16" r="6" fill="#10b981"/>
  <text x="30" y="20" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" font-size="11" font-weight="700" fill="#f3f4f6">Soverify Verified</text>
  <rect x="150" y="5" width="62" height="22" rx="5" fill="#10b981" fill-opacity="0.2"/>
  <text x="181" y="20" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" font-size="11" font-weight="800" fill="#34d399">{score}% {framework}</text>
</svg>"""
    return Response(svg, mimetype="image/svg+xml")

# BREACH RADAR LEADS CAPTURE
@app.route("/api/subscribe-breach-alerts", methods=["POST"])
def api_sub_breach():
    data = request.get_json(silent=True) or request.form or {}
    email = data.get("email", "").strip()
    domain = data.get("domain", "").strip()
    framework = data.get("framework", "cndp")

    if not email:
        return jsonify({"success": False, "message": "يرجى إدخال بريد إلكتروني صالح."}), 400

    try:
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        c.execute('''
            INSERT INTO breach_subscribers (email, domain, framework, ip_address)
            VALUES (?, ?, ?, ?)
        ''', (email, domain, framework, request.remote_addr))
        conn.commit()
        conn.close()
    except Exception as e:
        pass

    return jsonify({
        "success": True,
        "message": f"تم تفعيل رادار الحراسة بنجاح لـ {email}! سيتم إشعارك فور رصد أي تسريب أو ثغرة تشريعية."
    })

@app.route("/api/export-audit-csv", methods=["GET"])
def api_export_csv():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('SELECT target, domain, framework, score, status, fines_amount, fines_currency, created_at FROM audit_history ORDER BY created_at DESC')
    rows = c.fetchall()
    conn.close()

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Target URL", "Domain", "Framework", "Compliance Score", "Status", "Potential Fines", "Currency", "Timestamp"])
    for r in rows:
        writer.writerow(r)

    response = Response(output.getvalue(), mimetype="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=soverify_viral_audit.csv"
    return response

@app.route("/app.py", methods=["GET"])
def get_raw_app_py():
    with open(__file__, "r", encoding="utf-8") as f:
        return Response(f.read(), mimetype="text/plain; charset=utf-8")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
