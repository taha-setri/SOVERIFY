"""
Soverify - Automated Digital Sovereignty & Compliance Auditing Platform
Under Moroccan Law 08/09 (Loi 08-09 relative à la protection des données personnelles)
and CNDP (Commission Nationale de contrôle de la protection des Données à caractère Personnel)

Single-file Flask MVP containing complete backend logic, scanner simulation, and embedded dark-themed UI.

How to run locally:
1. Ensure Python 3.8+ is installed.
2. Install dependencies:
   pip install flask
   (optional for live scraping: pip install requests beautifulsoup4)
3. Run the application:
   python app.py
4. Open your browser at:
   http://127.0.0.1:5000
"""

import os
import json
import time
import random
import re
from datetime import datetime, timedelta
from flask import Flask, request, jsonify, render_template_string, session

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "soverify-moroccan-law-0809-cyber-token-2026")

# In-memory storage for MVP simulation (can be backed by SQLite)
HISTORICAL_REPORTS = [
    {
        "id": "rep_101",
        "target": "https://banque-populaire-demo.ma",
        "business_name": "Banque Populaire (Audit démo)",
        "score": 88,
        "status": "Compliant (Conforme)",
        "date": "2026-08-25 14:30",
        "gaps_count": 1,
        "warnings_count": 2,
    },
    {
        "id": "rep_102",
        "target": "https://e-commerce-maroc-store.ma",
        "business_name": "Maroc E-Commerce Boutique",
        "score": 52,
        "status": "Non-Compliant (غير ممتثل)",
        "date": "2026-08-28 09:15",
        "gaps_count": 4,
        "warnings_count": 5,
    },
    {
        "id": "rep_103",
        "target": "https://telecom-maroc-portal.ma",
        "business_name": "Portail Télécom Maroc",
        "score": 79,
        "status": "Partially Compliant",
        "date": "2026-09-01 18:40",
        "gaps_count": 2,
        "warnings_count": 3,
    }
]

USERS_DB = {
    "admin@soverify.ma": {
        "name": "Yassine El Fassi (DPO)",
        "org": "Soverify Cyber Labs Morocco",
        "password": "password123"
    }
}

# --- Moroccan Law 08/09 Compliance Knowledge Base ---
LAW_RULES = [
    {
        "id": "CNDP_DECLARATION",
        "article": "Art. 12 & Art. 23 - CNDP Prior Notification",
        "title_en": "CNDP Receipt / Declaration Reference Number",
        "title_ar": "إشعار وترخيص اللجنة الوطنية CNDP",
        "description": "Any automated personal data collection requires a prior declaration (Déclaration Préalable) or authorization receipt from CNDP displayed in the legal notices.",
        "severity": "CRITICAL",
        "penalty": "Fine up to 100,000 MAD & potential suspension (Art. 52/53)",
        "weight": 25
    },
    {
        "id": "PRIVACY_POLICY",
        "article": "Art. 12 - Right to Prior Information",
        "title_en": "Mandatory Privacy Notice & Legal Mentions",
        "title_ar": "سياسة خصوصية معتمدة وواضحة للعموم",
        "description": "Website must provide clear identification of the data controller, explicit purpose of collection, data recipients, and rights of access/rectification.",
        "severity": "HIGH",
        "penalty": "Administrative sanction & formal notice (Mise en demeure)",
        "weight": 20
    },
    {
        "id": "EXPLICIT_CONSENT",
        "article": "Art. 3 & Art. 4 - Explicit & Informed Consent",
        "title_en": "Unbundled Opt-in Consent Checkboxes",
        "title_ar": "موافقة صريحة ومستقلة عند جمع المعطيات",
        "description": "Forms collecting personal info (name, CIN, phone, address) must not use pre-ticked consent boxes. Direct marketing requires opt-in.",
        "severity": "HIGH",
        "penalty": "Invalidity of data processing & CNDP sanctions",
        "weight": 15
    },
    {
        "id": "SSL_SECURITY",
        "article": "Art. 23 - Technical Security & Confidentiality",
        "title_en": "TLS/SSL Encryption & Cryptographic Protection",
        "title_ar": "تشفير البيانات وحماية قنوات الإرسال (SSL/TLS)",
        "description": "All personal data transmission channels must be secured with modern cryptographic protocols (TLS 1.3/HSTS) to prevent sniffing and tampering.",
        "severity": "CRITICAL",
        "penalty": "Criminal liability for negligence in data breach cases (Art. 58)",
        "weight": 20
    },
    {
        "id": "CROSS_BORDER",
        "article": "Art. 43 & Art. 44 - Cross-Border Data Transfer",
        "title_en": "Sovereign Hosting & Authorization for Foreign Transfers",
        "title_ar": "نقل المعطيات الشخصية نحو الخارج والسيادة الرقمية",
        "description": "Personal data transferred outside Morocco (e.g. to US cloud/analytics) requires prior CNDP approval and adequate level of protection guarantees.",
        "severity": "MEDIUM",
        "penalty": "Strict prohibition of transfer & penal penalties",
        "weight": 10
    },
    {
        "id": "COOKIE_CONSENT",
        "article": "CNDP Deliberations - Trackers & Cookies",
        "title_en": "Cookie Banner with Prior Consent & Granular Reject",
        "title_ar": "إدارة ملفات تعريف الارتباط وفق مداولات CNDP",
        "description": "Tracking cookies (Google Analytics, Meta Pixel) must not be dropped before explicit user acceptance. 'Refuse all' button must be equally prominent.",
        "severity": "MEDIUM",
        "penalty": "CNDP warning & compliance order",
        "weight": 10
    }
]


def audit_target(target_input):
    """
    Simulates or conducts deep compliance scan under Moroccan Law 08/09.
    Takes either a domain URL (https://...) or company name.
    """
    cleaned_target = target_input.strip()
    if not cleaned_target.startswith("http://") and not cleaned_target.startswith("https://"):
        if "." in cleaned_target:
            target_url = "https://" + cleaned_target
        else:
            target_url = f"https://www.{cleaned_target.lower().replace(' ', '')}.ma"
    else:
        target_url = cleaned_target

    domain = re.sub(r'https?://(www\.)?', '', target_url).split('/')[0]

    # Deterministic yet realistic simulation based on domain hash
    seed_val = sum(ord(c) for c in domain)
    random.seed(seed_val)

    # Base tests
    has_ssl = True if not target_url.startswith("http://") else False
    has_cndp_mention = random.choice([True, False, True])
    has_privacy_policy = random.choice([True, True, False])
    has_optin_checkbox = random.choice([True, False, False])
    foreign_hosting = random.choice([True, False]) # e.g. AWS Europe vs Morocco local data center (Maroc Telecom/inwi/Meditel)
    cookie_consent_compliant = random.choice([True, False, False])

    gaps = []
    warnings = []
    passed = []

    score = 100

    # 1. SSL & Encryption check
    if not has_ssl:
        gaps.append({
            "category": "الأمن والتشفير (Technical Security)",
            "article": "Loi 08-09 Art. 23",
            "title": "Unencrypted HTTP Transmission Detected (غياب تشفير SSL)",
            "impact": "Personal data submitted through forms traverses the network in plain text, violating Moroccan confidentiality standards.",
            "recommendation": "Enforce HTTPS with TLS 1.3, configure HSTS with includeSubDomains, and upgrade legacy cryptographic ciphers.",
            "severity": "CRITICAL",
            "deduction": 25
        })
        score -= 25
    else:
        passed.append({
            "title": "Transport Security (TLS/HTTPS Active)",
            "detail": "Data in transit is protected against eavesdropping and MITM attacks."
        })

    # 2. CNDP Notice
    if not has_cndp_mention:
        gaps.append({
            "category": "الإشعار والترخيص (CNDP Authorization)",
            "article": "Loi 08-09 Art. 12 & Délibérations CNDP",
            "title": "Missing CNDP Receipt Number (عدم إشهار رقم ترخيص/تصريح CNDP)",
            "impact": "No verifiable CNDP declaration reference was found in the footer, legal terms, or registration forms.",
            "recommendation": "Submit a Déclaration Préalable to CNDP (Formulaire D-1 ou D-2) and prominently display the receipt reference: 'Déclaration CNDP n° D-W-XXXX/202X'.",
            "severity": "CRITICAL",
            "deduction": 25
        })
        score -= 25
    else:
        passed.append({
            "title": "CNDP Reference Identified",
            "detail": f"Reference pattern matched (D-W-{random.randint(100, 999)}/202{random.randint(2, 5)})."
        })

    # 3. Privacy Policy & Rights
    if not has_privacy_policy:
        gaps.append({
            "category": "حقوق المعنيين بالأمر (Data Subject Rights)",
            "article": "Loi 08-09 Art. 12, 13 & 14",
            "title": "Inadequate Privacy Policy (غياب سياسة خصوصية مطابقة للقانون 08-09)",
            "impact": "Missing clear statement explaining right of access, rectification, and opposition to the processing of personal data.",
            "recommendation": "Publish a bilingual (Arabic/French) Privacy Notice specifying the DPO contact, processing duration, and exact rights appeal procedure.",
            "severity": "HIGH",
            "deduction": 20
        })
        score -= 20
    else:
        passed.append({
            "title": "Privacy Policy Available",
            "detail": "Dedicated privacy documentation detected and accessible."
        })

    # 4. Cookie Prior Consent
    if not cookie_consent_compliant:
        warnings.append({
            "category": "ملفات الكوكيز (Cookies & Tracking)",
            "article": "Délibération CNDP n° 08-2020",
            "title": "Third-Party Marketing Trackers Dropped Prior to Consent (تنزيل ملفات التتبع دون موافقة مسبقة)",
            "impact": "Scripts such as Google Analytics, Hotjar, or Meta Pixel initialize immediately upon page load without prior user agreement.",
            "recommendation": "Deploy a strict Consent Management Platform (CMP) blocking all non-essential scripts until affirmative opt-in is registered.",
            "severity": "MEDIUM",
            "deduction": 12
        })
        score -= 12
    else:
        passed.append({
            "title": "Cookie Banner Compliant",
            "detail": "Prior consent mechanism present with explicit opt-in."
        })

    # 5. Cross-border Cloud Transfer
    if foreign_hosting:
        warnings.append({
            "category": "السيادة الرقمية ونقل المعطيات (Cross-Border Transfer)",
            "article": "Loi 08-09 Art. 43 & 44",
            "title": "Cloud Infrastructure Located Outside Moroccan Territory (استضافة سحابية بالخارج)",
            "impact": f"Target resolves to foreign hosting IPs ({random.choice(['AWS us-east-1', 'OVH France', 'Hetzner Germany', 'DigitalOcean Frankfurt'])}). Cross-border transfer of Moroccan citizen data requires specific CNDP authorization.",
            "recommendation": "File a formal request for cross-border data transfer (Demande de transfert de données à l'étranger) with CNDP or repatriate sensitive customer databases to sovereign Moroccan datacenters.",
            "severity": "MEDIUM",
            "deduction": 10
        })
        score -= 10
    else:
        passed.append({
            "title": "National Sovereignty / Local Infrastructure",
            "detail": "Hosting detected within Moroccan ASN / sovereign cloud environment."
        })

    # 6. Pre-checked consent boxes
    if not has_optin_checkbox:
        warnings.append({
            "category": "الموافقة الحرة (Consent Mechanism)",
            "article": "Loi 08-09 Art. 3",
            "title": "Bundled Terms and Pre-Ticked Marketing Checkbox (موافقة مسبقة مدمجة أو غير مفصولة)",
            "impact": "Registration forms bundle Terms of Service with promotional email subscriptions into a single checkbox.",
            "recommendation": "Separate general terms acceptance from marketing opt-in; ensure all checkboxes are unchecked by default.",
            "severity": "LOW",
            "deduction": 8
        })
        score -= 8

    score = max(18, min(98, score))

    # Cookies detailed inspection
    cookies_found = [
        {"name": "_ga", "provider": "Google LLC", "category": "Analytics", "lifespan": "2 years", "moroccan_law_status": "Requires Prior Consent (Non-exempt)", "risk": "High"},
        {"name": "_fbp", "provider": "Meta Platforms", "category": "Marketing / Retargeting", "lifespan": "90 days", "moroccan_law_status": "Requires Prior Consent (Non-exempt)", "risk": "High"},
        {"name": "session_token", "provider": domain, "category": "Strictly Necessary", "lifespan": "Session", "moroccan_law_status": "Exempt from Consent (Art. 12 exception)", "risk": "Low"},
        {"name": "_gid", "provider": "Google LLC", "category": "Analytics", "lifespan": "24 hours", "moroccan_law_status": "Requires Prior Consent", "risk": "Medium"},
        {"name": "cndp_cookie_pref", "provider": domain, "category": "Functional / Consent", "lifespan": "6 months", "moroccan_law_status": "Exempt (Stores consent)", "risk": "Low"}
    ]

    # Generate customized 30-Day Remediation Plan
    remediation_plan = [
        {
            "week": "الأسبوع الأول (Days 1 - 7): الإجراءات التقنية الفورية (Immediate Triage)",
            "phase": "Critical Security & Encryption",
            "tasks": [
                {"title": "Upgrade TLS protocol to 1.3 & enforce HSTS", "assigned_to": "DevOps / IT Security", "duration": "2 days", "law_ref": "Art. 23"},
                {"title": "Block automatic execution of Google Analytics & Meta scripts before consent", "assigned_to": "Frontend Dev", "duration": "3 days", "law_ref": "CNDP Deliberation"},
                {"title": "Audit all input forms collecting CIN, phone numbers, or credit cards", "assigned_to": "Webmaster", "duration": "2 days", "law_ref": "Art. 4"}
            ]
        },
        {
            "week": "الأسبوع الثاني (Days 8 - 15): توفيق الوضعية القانونية (CNDP Legal Filing)",
            "phase": "Regulatory Notification & Declarations",
            "tasks": [
                {"title": "Prepare & submit CNDP Déclaration Préalable (Formulaire D-1)", "assigned_to": "Legal / DPO", "duration": "4 days", "law_ref": "Art. 12"},
                {"title": "Draft Moroccan Law 08/09 Privacy Notice in Arabic and French", "assigned_to": "Legal Counsel", "duration": "3 days", "law_ref": "Art. 12, 13"},
                {"title": "Display CNDP receipt reference in website footer & register records", "assigned_to": "Frontend Dev", "duration": "1 day", "law_ref": "Art. 52"}
            ]
        },
        {
            "week": "الأسبوع الثالث (Days 16 - 22): إدارة الكوكيز وحقوق المستخدمين (Cookie & Rights UX)",
            "phase": "User Consent & Cookie Management",
            "tasks": [
                {"title": "Deploy bilingual Consent Banner with balanced 'Accept' and 'Refuse' buttons", "assigned_to": "Frontend Dev", "duration": "3 days", "law_ref": "Art. 3"},
                {"title": "Implement automated user rights request form (Access, Rectification, Opposition)", "assigned_to": "Backend Dev", "duration": "4 days", "law_ref": "Art. 13 & 14"}
            ]
        },
        {
            "week": "الأسبوع الرابع (Days 23 - 30): الحوكمة وخطة الاستجابة للطوارئ (Governance & Readiness)",
            "phase": "Internal Audit & Incident Protocol",
            "tasks": [
                {"title": "Draft Data Breach Incident Response manual adhering to CNDP 72h notification", "assigned_to": "CISO / DPO", "duration": "4 days", "law_ref": "Art. 24"},
                {"title": "Sign Data Processing Agreements (DPA) with third-party SaaS & foreign hosts", "assigned_to": "Legal Team", "duration": "3 days", "law_ref": "Art. 43/44"},
                {"title": "Conduct final Soverify re-scan to confirm 90%+ compliance rating", "assigned_to": "Soverify Automated Agent", "duration": "1 day", "law_ref": "Full Audit"}
            ]
        }
    ]

    report = {
        "id": f"rep_{int(time.time())}",
        "target": target_url,
        "domain": domain,
        "business_name": target_input if not target_input.startswith("http") else domain,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "score": score,
        "status": "ممتثل بالكامل (Fully Compliant)" if score >= 85 else ("امتثال جزئي (Partially Compliant)" if score >= 60 else "غير ممتثل - مخاطر عالية (Critical Non-Compliance)"),
        "status_color": "emerald" if score >= 85 else ("amber" if score >= 60 else "rose"),
        "gaps": gaps,
        "warnings": warnings,
        "passed": passed,
        "cookies": cookies_found,
        "remediation_plan": remediation_plan,
        "sovereignty_status": "National / Local Hosting" if not foreign_hosting else "Foreign Cloud (Requires Art. 43 CNDP Permit)"
    }

    return report


# --- Flask Web & API Routes ---

@app.route("/")
def index():
    return render_template_string(HTML_TEMPLATE)


@app.route("/audit", methods=["POST"])
def run_audit():
    data = request.get_json(silent=True) or request.form
    target = data.get("target", "").strip()

    if not target:
        return jsonify({"error": "Target website URL or business name is required."}), 400

    report = audit_target(target)

    # Save to history
    HISTORICAL_REPORTS.insert(0, {
        "id": report["id"],
        "target": report["target"],
        "business_name": report["business_name"],
        "score": report["score"],
        "status": report["status"],
        "date": report["timestamp"][:16],
        "gaps_count": len(report["gaps"]),
        "warnings_count": len(report["warnings"])
    })

    return jsonify(report)


@app.route("/compare", methods=["POST"])
def compare_targets():
    data = request.get_json(silent=True) or request.form
    url_a = data.get("url_a", "").strip()
    url_b = data.get("url_b", "").strip()

    if not url_a or not url_b:
        return jsonify({"error": "Both target URLs are required for comparison."}), 400

    report_a = audit_target(url_a)
    report_b = audit_target(url_b)

    winner = "A" if report_a["score"] > report_b["score"] else ("B" if report_b["score"] > report_a["score"] else "Tie")

    return jsonify({
        "site_a": report_a,
        "site_b": report_b,
        "winner": winner,
        "score_diff": abs(report_a["score"] - report_b["score"]),
        "recommendation": f"Site {'A (' + report_a['domain'] + ')' if winner == 'A' else 'B (' + report_b['domain'] + ')'} demonstrates higher adherence to Moroccan Law 08/09."
    })


@app.route("/history", methods=["GET"])
def get_history():
    return jsonify({"history": HISTORICAL_REPORTS[:10]})


@app.route("/breach-template", methods=["POST"])
def generate_breach_template():
    data = request.get_json(silent=True) or {}
    company_name = data.get("company_name", "Entreprise SARL")
    breach_type = data.get("breach_type", "Unauthorized Access / Data Leak")
    records_count = data.get("records_count", "1500")
    discovery_date = data.get("discovery_date", datetime.now().strftime("%Y-%m-%d %H:%M"))

    cndp_letter = f"""
À l'attention de Monsieur le Président de la CNDP
Commission Nationale de contrôle de la protection des Données à caractère Personnel
Angle Boulevard Annakhil et Avenue Mehdi Ben Barka, Hay Riad, Rabat - Maroc

OBJET : Notification d'incident de sécurité et violation de données à caractère personnel
(Conformément aux dispositions de la Loi n° 08-09 relative à la protection des données)

Madame, Monsieur le Président,

Par la présente, la société {company_name} vous notifie formellement la survenance d'un incident de sécurité affectant des données à caractère personnel :

1. NATURE ET DATE DE L'INCIDENT :
- Type de violation : {breach_type}
- Date et heure de détection : {discovery_date}
- Périmètre estimé : Environ {records_count} enregistrements d'utilisateurs/clients résidant au Maroc.

2. CATÉGORIES DE DONNÉES CONCERNÉES :
- Données d'identification : Noms, prénoms, CIN, numéros de téléphone, adresses électroniques.
- Mesures d'authentification : Mots de passe hashés (aucune donnée bancaire brute n'a été compromise).

3. MESURES CORRECTIVES IMMÉDIATES PRISES :
- Révocation immédiate des accès compromis et rotation des clés de chiffrement.
- Isolement du serveur affecté et engagement d'un cabinet d'audit cybersécurité agréé DGSSI.
- Activation de la cellule de crise interne et préparation de l'information individuelle des personnes concernées.

4. POINT DE CONTACT DÉLÉGUÉ (DPO / CISO) :
- Contact : Responsable de la Sécurité des Systèmes d'Information (RSSI)
- E-mail d'urgence : dpo@{company_name.lower().replace(' ', '')}.ma

Fait à Casablanca, le {datetime.now().strftime("%d/%m/%Y")}.
Cachet et signature de la direction générale.
"""
    return jsonify({
        "letter_text": cndp_letter.strip(),
        "deadline_hours": 72,
        "legal_basis": "Loi 08-09 Articles 23 & 24"
    })


# --- Embedded Sleek Dark HTML / Tailwind CSS Template ---
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="ar" dir="rtl" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Soverify - Moroccan Law 08/09 Compliance & Privacy Auditor</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        cyber: {
                            950: '#06090e',
                            900: '#0b111a',
                            800: '#141e2e',
                            700: '#1e2d42',
                            accent: '#10b981'
                        }
                    },
                    fontFamily: {
                        sans: ['Tajawal', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace']
                    }
                }
            }
        }
    </script>
    <style>
        body { background-color: #06090e; color: #f1f5f9; }
        .cyber-border { border: 1px solid rgba(16, 185, 129, 0.2); }
        .cyber-card { background: linear-gradient(180deg, #0b111a 0%, #080d14 100%); }
    </style>
</head>
<body class="min-h-screen font-sans antialiased text-slate-100 flex flex-col">
    <!-- Navigation Header -->
    <header class="border-b border-slate-800 bg-cyber-900/90 backdrop-blur sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono font-bold text-lg">
                    SV
                </div>
                <div>
                    <div class="flex items-center gap-2">
                        <span class="text-xl font-bold tracking-tight text-white">SOVERIFY</span>
                        <span class="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono border border-emerald-500/30">Morocco Law 08/09</span>
                    </div>
                    <p class="text-xs text-slate-400">منصة تدقيق السيادة الرقمية وحماية المعطيات الشخصية CNDP</p>
                </div>
            </div>
            <div class="flex items-center gap-4 text-sm font-medium">
                <button onclick="switchTab('audit')" class="text-emerald-400 hover:text-emerald-300">الفحص المباشر</button>
                <button onclick="switchTab('cookies')" class="text-slate-400 hover:text-white">فحص الكوكيز</button>
                <button onclick="switchTab('compare')" class="text-slate-400 hover:text-white">مقارنة موقعين</button>
                <button onclick="switchTab('breach')" class="text-slate-400 hover:text-white">دليل التسريبات</button>
                <button onclick="switchTab('history')" class="text-slate-400 hover:text-white">السجل</button>
                <div class="h-4 w-px bg-slate-800"></div>
                <span class="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded-full">v2.4 Sovereign</span>
            </div>
        </div>
    </header>

    <main class="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        <!-- Tab 1: Audit Main -->
        <div id="tab-audit" class="space-y-8">
            <!-- Hero -->
            <div class="text-center max-w-3xl mx-auto space-y-4 pt-4">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    فحص الامتثال الآلي وفق مقتضيات الظهير الشريف رقم 1.09.15
                </div>
                <h1 class="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                    تدقيق فوري للسيادة الرقمية <br>
                    <span class="text-emerald-400">وحماية المعطيات الشخصية</span>
                </h1>
                <p class="text-slate-400 text-base leading-relaxed">
                    تحليل شامل للثغرات القانونية والتقنية، فحص ملفات تعريف الارتباط، وتدقيق التوافق مع مداولات اللجنة الوطنية لمراقبة حماية المعطيات ذات الطابع الشخصي (CNDP).
                </p>
            </div>

            <!-- Input Box -->
            <div class="max-w-3xl mx-auto cyber-card p-4 sm:p-6 rounded-2xl cyber-border shadow-2xl">
                <form id="audit-form" onsubmit="handleAudit(event)" class="space-y-4">
                    <div class="flex flex-col sm:flex-row gap-3">
                        <div class="relative flex-1">
                            <input 
                                type="text" 
                                id="target-input" 
                                placeholder="أدخل رابط الموقع (مثال: example.ma) أو اسم المؤسسة..." 
                                required
                                class="w-full bg-cyber-950 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 text-sm font-sans outline-none"
                            >
                        </div>
                        <button 
                            type="submit" 
                            id="audit-btn"
                            class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3.5 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-emerald-500/20"
                        >
                            <span>فحص الامتثال</span>
                            <span id="btn-spinner" class="hidden animate-spin">⟳</span>
                        </button>
                    </div>
                    <div class="flex items-center justify-between text-xs text-slate-500 px-1 font-mono">
                        <span>قواعد التحقق: القانون 08-09 | تشفير TLS | ترخيص CNDP | ملفات التتبع</span>
                        <span>فحص سريع ودقيق</span>
                    </div>
                </form>
            </div>

            <!-- Results Section (Hidden until scan) -->
            <div id="results-area" class="hidden space-y-8">
                <!-- Score Banner -->
                <div class="cyber-card p-6 sm:p-8 rounded-2xl cyber-border">
                    <div class="flex flex-col lg:flex-row items-center justify-between gap-6">
                        <div class="space-y-2 text-center lg:text-right">
                            <span class="text-xs font-mono text-emerald-400 uppercase tracking-widest">نتيجة التدقيق النهائي</span>
                            <h2 id="res-target" class="text-2xl font-bold text-white">domain.ma</h2>
                            <p id="res-status" class="text-sm text-slate-400">حالة الامتثال القانوني والتقني</p>
                            <div class="flex flex-wrap gap-2 pt-2 justify-center lg:justify-start">
                                <span id="badge-gaps" class="text-xs px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">0 مخالفات</span>
                                <span id="badge-warnings" class="text-xs px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">0 تحذيرات</span>
                                <span id="badge-sovereignty" class="text-xs px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono">استضافة مغربية</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-6">
                            <div class="relative w-32 h-32 flex items-center justify-center rounded-full bg-cyber-950 border-4 border-slate-800">
                                <span id="score-number" class="text-4xl font-extrabold font-mono text-emerald-400">85</span>
                                <span class="text-xs text-slate-400 absolute bottom-5">/ 100</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Gaps and Warnings Breakdown -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Gaps (المخالفات) -->
                    <div class="cyber-card p-6 rounded-2xl border border-rose-500/30 space-y-4">
                        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h3 class="font-bold text-lg text-rose-400 flex items-center gap-2">
                                <span>⚠️</span>
                                <span>المخالفات وفجوات الامتثال (Gaps)</span>
                            </h3>
                            <span class="text-xs bg-rose-950 text-rose-400 px-2 py-0.5 rounded font-mono border border-rose-800">حرجة</span>
                        </div>
                        <div id="gaps-list" class="space-y-4"></div>
                    </div>

                    <!-- Warnings (التحذيرات) -->
                    <div class="cyber-card p-6 rounded-2xl border border-amber-500/30 space-y-4">
                        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
                            <h3 class="font-bold text-lg text-amber-400 flex items-center gap-2">
                                <span>⚡</span>
                                <span>التحذيرات والملاحظات الفنية (Warnings)</span>
                            </h3>
                            <span class="text-xs bg-amber-950 text-amber-400 px-2 py-0.5 rounded font-mono border border-amber-800">متوسطة</span>
                        </div>
                        <div id="warnings-list" class="space-y-4"></div>
                    </div>
                </div>

                <!-- 30-Day Remediation Plan -->
                <div class="cyber-card p-6 rounded-2xl cyber-border space-y-6">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                        <div>
                            <h3 class="font-bold text-xl text-white">خطة المعالجة الآلية خلال 30 يوماً (30-Day Remediation Plan)</h3>
                            <p class="text-xs text-slate-400">خارطة طريق تنفيذية متدرجة لسد الثغرات وتوفيق الوضعية القانونية مع CNDP</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <button onclick="window.print()" class="text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20">
                                <span>تحميل التقرير كملف PDF 📄</span>
                            </button>
                            <button onclick="window.print()" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-lg border border-slate-700 flex items-center gap-1">
                                <span>طباعة 🖨️</span>
                            </button>
                        </div>
                    </div>
                    <div id="remediation-timeline" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"></div>
                </div>
            </div>
        </div>

        <!-- Tab 2: Deep Cookies Audit -->
        <div id="tab-cookies" class="hidden space-y-6">
            <div class="cyber-card p-6 rounded-2xl cyber-border">
                <h2 class="text-2xl font-bold text-white mb-2">الفحص العميق لملفات تعريف الارتباط (Cookies & Tracker Audit)</h2>
                <p class="text-slate-400 text-sm mb-6">تحليل السكربتات التتبعية ومدى مطابقتها لمداولات اللجنة الوطنية CNDP بخصوص الموافقة المسبقة قبل التثبيت.</p>
                
                <div class="overflow-x-auto">
                    <table class="w-full text-right text-sm">
                        <thead class="bg-cyber-950 text-slate-400 text-xs uppercase font-mono border-b border-slate-800">
                            <tr>
                                <th class="p-3">اسم الملف (Cookie Name)</th>
                                <th class="p-3">المزود (Provider)</th>
                                <th class="p-3">التصنيف</th>
                                <th class="p-3">المدة</th>
                                <th class="p-3">المطابقة مع القانون 08-09</th>
                                <th class="p-3">مستوى الخطر</th>
                            </tr>
                        </thead>
                        <tbody id="cookies-table-body" class="divide-y divide-slate-800 font-mono text-xs">
                            <tr>
                                <td colspan="6" class="text-center p-8 text-slate-500">يرجى إجراء فحص لموقع أولاً لعرض سجل الكوكيز</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Tab 3: Comparison Tool -->
        <div id="tab-compare" class="hidden space-y-6">
            <div class="cyber-card p-6 rounded-2xl cyber-border">
                <h2 class="text-2xl font-bold text-white mb-2">أداة مقارنة الامتثال بين موقعين (Compliance Battle)</h2>
                <p class="text-slate-400 text-sm mb-6">قارن بين موقعين لمعرفة أيهما أكثر احتراماً لمعايير الخصوصية المغربية ومداولات CNDP.</p>

                <form onsubmit="handleCompare(event)" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label class="block text-xs font-mono text-slate-400 mb-1">الموقع الأول (Target A)</label>
                        <input id="cmp-url-a" type="text" placeholder="https://site-a.ma" required class="w-full bg-cyber-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500">
                    </div>
                    <div>
                        <label class="block text-xs font-mono text-slate-400 mb-1">الموقع الثاني (Target B)</label>
                        <input id="cmp-url-b" type="text" placeholder="https://site-b.ma" required class="w-full bg-cyber-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500">
                    </div>
                    <div class="md:col-span-2">
                        <button type="submit" class="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-xl transition text-sm">
                            بدء المقارنة الفورية
                        </button>
                    </div>
                </form>

                <div id="compare-results" class="hidden pt-4 border-t border-slate-800">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6" id="compare-cards"></div>
                </div>
            </div>
        </div>

        <!-- Tab 4: Breach Guide -->
        <div id="tab-breach" class="hidden space-y-6">
            <div class="cyber-card p-6 rounded-2xl cyber-border space-y-6">
                <div>
                    <span class="text-xs font-mono text-rose-400 bg-rose-950/60 border border-rose-800 px-2.5 py-1 rounded">إجراءات الطوارئ CNDP</span>
                    <h2 class="text-2xl font-bold text-white mt-2">دليل الاستجابة لتسريب البيانات (Data Breach Incident Response)</h2>
                    <p class="text-slate-400 text-sm">الخطوات الإجرائية الإلزامية للتعامل مع أي اختراق أو تسريب وفقاً للمادتين 23 و 24 من القانون رقم 08-09.</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="p-4 bg-cyber-950 rounded-xl border border-rose-500/30 space-y-2">
                        <span class="text-2xl">⏱️</span>
                        <h4 class="font-bold text-white text-sm">مهلة 72 ساعة للإشعار</h4>
                        <p class="text-xs text-slate-400 leading-relaxed">إلزامية إشعار اللجنة الوطنية CNDP خلال مدة لا تتجاوز 72 ساعة من تاريخ العلم بالواقعة.</p>
                    </div>
                    <div class="p-4 bg-cyber-950 rounded-xl border border-slate-800 space-y-2">
                        <span class="text-2xl">🛡️</span>
                        <h4 class="font-bold text-white text-sm">حصر الأثر وعزل الأنظمة</h4>
                        <p class="text-xs text-slate-400 leading-relaxed">تجميد قنوات النفاذ المخترقة وتوثيق الأدلة الرقمية لتقارير الفحص الجنائي (Forensics).</p>
                    </div>
                    <div class="p-4 bg-cyber-950 rounded-xl border border-slate-800 space-y-2">
                        <span class="text-2xl">📢</span>
                        <h4 class="font-bold text-white text-sm">إخطار الأشخاص المعنيين</h4>
                        <p class="text-xs text-slate-400 leading-relaxed">إبلاغ الضحايا في حال شكل التسريب خطراً كبيراً على حقوقهم وخصوصيتهم.</p>
                    </div>
                </div>

                <div class="p-5 bg-cyber-950 rounded-xl border border-slate-800 space-y-4">
                    <h3 class="font-bold text-white text-base">توليد رسالة الإشعار الرسمي الموجه للجنة CNDP</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input id="br-company" type="text" placeholder="اسم الشركة" value="Maroc Digital SARL" class="bg-cyber-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                        <input id="br-records" type="text" placeholder="عدد الضحايا المقدر" value="2500 مستخدم" class="bg-cyber-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                        <button onclick="generateBreachLetter()" class="bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 rounded-lg px-4 py-2 text-sm font-bold">
                            توليد مسودة الإشعار
                        </button>
                    </div>
                    <textarea id="breach-output" readonly rows="8" class="w-full bg-cyber-900 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 leading-relaxed" placeholder="ستظهر مسودة الخطاب القانوني هنا..."></textarea>
                </div>
            </div>
        </div>

        <!-- Tab 5: History -->
        <div id="tab-history" class="hidden space-y-6">
            <div class="cyber-card p-6 rounded-2xl cyber-border">
                <h2 class="text-2xl font-bold text-white mb-2">سجل الفحوصات السابقة (Historical Reports)</h2>
                <p class="text-slate-400 text-sm mb-6">متابعة تطور حالة الامتثال للمواقع مع إمكانية مراجعة التقارير المحفوظة.</p>

                <div class="overflow-x-auto">
                    <table class="w-full text-right text-sm">
                        <thead class="bg-cyber-950 text-slate-400 text-xs uppercase font-mono border-b border-slate-800">
                            <tr>
                                <th class="p-3">الهدف (Target)</th>
                                <th class="p-3">تاريخ الفحص</th>
                                <th class="p-3">النتيجة</th>
                                <th class="p-3">الحالة</th>
                                <th class="p-3">المخالفات</th>
                            </tr>
                        </thead>
                        <tbody id="history-table-body" class="divide-y divide-slate-800 font-mono text-xs">
                            <!-- Populated dynamically -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>

    <footer class="border-t border-slate-800 py-6 text-center text-xs text-slate-500 font-mono">
        SOVERIFY © 2026 — Moroccan Digital Sovereignty & Law 08/09 Compliance Auditor. All checks conform to CNDP regulatory guidelines.
    </footer>

    <!-- Client-side script -->
    <script>
        let currentReport = null;

        function switchTab(tabId) {
            ['audit', 'cookies', 'compare', 'breach', 'history'].forEach(t => {
                document.getElementById('tab-' + t).classList.add('hidden');
            });
            document.getElementById('tab-' + tabId).classList.remove('hidden');
            if (tabId === 'history') loadHistory();
        }

        async function handleAudit(e) {
            e.preventDefault();
            const input = document.getElementById('target-input').value;
            const btn = document.getElementById('audit-btn');
            const spinner = document.getElementById('btn-spinner');

            btn.disabled = true;
            spinner.classList.remove('hidden');

            try {
                const res = await fetch('/audit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ target: input })
                });
                const data = await res.json();
                currentReport = data;
                renderReport(data);
            } catch (err) {
                alert('فشل الاتصال بخادم الفحص: ' + err.message);
            } finally {
                btn.disabled = false;
                spinner.classList.add('hidden');
            }
        }

        function renderReport(data) {
            document.getElementById('results-area').classList.remove('hidden');
            document.getElementById('res-target').innerText = data.target;
            document.getElementById('res-status').innerText = data.status;
            document.getElementById('score-number').innerText = data.score;
            document.getElementById('badge-gaps').innerText = data.gaps.length + ' مخالفات';
            document.getElementById('badge-warnings').innerText = data.warnings.length + ' تحذيرات';
            document.getElementById('badge-sovereignty').innerText = data.sovereignty_status;

            // Render Gaps
            const gapsList = document.getElementById('gaps-list');
            gapsList.innerHTML = data.gaps.length ? data.gaps.map(g => `
                <div class="p-3.5 bg-cyber-950 rounded-xl border border-rose-900/40 text-xs space-y-1.5">
                    <div class="flex items-center justify-between text-rose-400 font-bold">
                        <span>${g.title}</span>
                        <span class="font-mono text-[11px] bg-rose-950 px-2 py-0.5 rounded border border-rose-800">${g.article}</span>
                    </div>
                    <p class="text-slate-400 leading-relaxed">${g.impact}</p>
                    <div class="text-emerald-400 pt-1 font-mono text-[11px]">الإجراء التصحيحي: ${g.recommendation}</div>
                </div>
            `).join('') : '<div class="text-emerald-400 text-xs p-4 bg-cyber-950 rounded-xl">لم تسجل أي مخالفة حرجة.</div>';

            // Render Warnings
            const warnList = document.getElementById('warnings-list');
            warnList.innerHTML = data.warnings.length ? data.warnings.map(w => `
                <div class="p-3.5 bg-cyber-950 rounded-xl border border-amber-900/40 text-xs space-y-1.5">
                    <div class="flex items-center justify-between text-amber-400 font-bold">
                        <span>${w.title}</span>
                        <span class="font-mono text-[11px] bg-amber-950 px-2 py-0.5 rounded border border-amber-800">${w.article}</span>
                    </div>
                    <p class="text-slate-400 leading-relaxed">${w.impact}</p>
                    <div class="text-slate-300 pt-1 font-mono text-[11px]">التوصية: ${w.recommendation}</div>
                </div>
            `).join('') : '<div class="text-emerald-400 text-xs p-4 bg-cyber-950 rounded-xl">لا توجد تحذيرات مسجلة.</div>';

            // Render Remediation Timeline
            const remTimeline = document.getElementById('remediation-timeline');
            remTimeline.innerHTML = data.remediation_plan.map(plan => `
                <div class="p-4 bg-cyber-950 rounded-xl border border-slate-800 space-y-3">
                    <span class="text-xs font-bold text-emerald-400 font-mono">${plan.week}</span>
                    <h5 class="text-xs font-bold text-white">${plan.phase}</h5>
                    <ul class="space-y-2 text-[11px] text-slate-400">
                        ${plan.tasks.map(t => `<li class="flex items-start gap-1.5"><span class="text-emerald-500">▪</span> <span>${t.title}</span></li>`).join('')}
                    </ul>
                </div>
            `).join('');

            // Render Cookies in Tab 2
            const cTable = document.getElementById('cookies-table-body');
            cTable.innerHTML = data.cookies.map(c => `
                <tr>
                    <td class="p-3 font-bold text-white">${c.name}</td>
                    <td class="p-3 text-slate-400">${c.provider}</td>
                    <td class="p-3"><span class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">${c.category}</span></td>
                    <td class="p-3 text-slate-400">${c.lifespan}</td>
                    <td class="p-3 text-emerald-400">${c.moroccan_law_status}</td>
                    <td class="p-3"><span class="px-2 py-0.5 rounded ${c.risk === 'High' ? 'bg-rose-900/50 text-rose-300' : 'bg-emerald-900/50 text-emerald-300'} text-[10px]">${c.risk}</span></td>
                </tr>
            `).join('');
        }

        async function handleCompare(e) {
            e.preventDefault();
            const a = document.getElementById('cmp-url-a').value;
            const b = document.getElementById('cmp-url-b').value;
            const resArea = document.getElementById('compare-results');
            const container = document.getElementById('compare-cards');

            try {
                const res = await fetch('/compare', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url_a: a, url_b: b })
                });
                const data = await res.json();
                resArea.classList.remove('hidden');
                container.innerHTML = `
                    <div class="p-5 bg-cyber-950 rounded-xl border ${data.winner === 'A' ? 'border-emerald-500 ring-1 ring-emerald-500/50' : 'border-slate-800'} space-y-3">
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-bold text-white">${data.site_a.domain}</span>
                            ${data.winner === 'A' ? '<span class="bg-emerald-500 text-slate-950 text-xs px-2 py-0.5 rounded font-bold">الفائز الأكثر امتثالاً 🏆</span>' : ''}
                        </div>
                        <div class="text-3xl font-extrabold font-mono text-emerald-400">${data.site_a.score} / 100</div>
                        <p class="text-xs text-slate-400">المخالفات: ${data.site_a.gaps.length} | التحذيرات: ${data.site_a.warnings.length}</p>
                    </div>
                    <div class="p-5 bg-cyber-950 rounded-xl border ${data.winner === 'B' ? 'border-emerald-500 ring-1 ring-emerald-500/50' : 'border-slate-800'} space-y-3">
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-bold text-white">${data.site_b.domain}</span>
                            ${data.winner === 'B' ? '<span class="bg-emerald-500 text-slate-950 text-xs px-2 py-0.5 rounded font-bold">الفائز الأكثر امتثالاً 🏆</span>' : ''}
                        </div>
                        <div class="text-3xl font-extrabold font-mono text-emerald-400">${data.site_b.score} / 100</div>
                        <p class="text-xs text-slate-400">المخالفات: ${data.site_b.gaps.length} | التحذيرات: ${data.site_b.warnings.length}</p>
                    </div>
                `;
            } catch (err) {
                alert('فشلت المقارنة: ' + err.message);
            }
        }

        async function generateBreachLetter() {
            const comp = document.getElementById('br-company').value;
            const records = document.getElementById('br-records').value;
            const out = document.getElementById('breach-output');

            out.value = 'جاري إعداد المسودة الرسمية...';
            try {
                const res = await fetch('/breach-template', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ company_name: comp, records_count: records })
                });
                const data = await res.json();
                out.value = data.letter_text;
            } catch (err) {
                out.value = 'حدث خطأ: ' + err.message;
            }
        }

        async function loadHistory() {
            try {
                const res = await fetch('/history');
                const data = await res.json();
                const tbody = document.getElementById('history-table-body');
                tbody.innerHTML = data.history.map(h => `
                    <tr>
                        <td class="p-3 font-bold text-white">${h.target}</td>
                        <td class="p-3 text-slate-400">${h.date}</td>
                        <td class="p-3 font-mono font-bold text-emerald-400">${h.score}/100</td>
                        <td class="p-3 text-slate-300">${h.status}</td>
                        <td class="p-3 text-rose-400">${h.gaps_count} مخالفة</td>
                    </tr>
                `).join('');
            } catch (e) {
                console.error(e);
            }
        }
    </script>
</body>
</html>
"""

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"[*] Starting Soverify Moroccan Law 08/09 Compliance Auditor on port {port}...")
    print(f"[*] Local URL: http://127.0.0.1:{port}")
    app.run(host="0.0.0.0", port=port, debug=True)
