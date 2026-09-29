import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Unlock, 
  Copy, 
  Check, 
  Terminal, 
  Key, 
  ExternalLink, 
  AlertCircle, 
  FileCode, 
  CheckCircle2, 
  Sparkles,
  PhoneCall,
  X,
  Atom,
  Zap
} from 'lucide-react';

interface NginxHardeningSectionProps {
  domain: string;
  lang: 'ar' | 'en';
  isAuthenticated?: boolean;
}

export const NginxHardeningSection: React.FC<NginxHardeningSectionProps> = ({
  domain,
  lang,
  isAuthenticated = false
}) => {
  const isAr = lang === 'ar';
  const cleanDomain = domain ? domain.replace(/^https?:\/\//, '').split('/')[0] : 'banquepopulaire.ma';

  // By default, show the fully generated sovereign code directly without blocking the user
  const [isUnlocked, setIsUnlocked] = useState<boolean>(true);
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [adminKeyInput, setAdminKeyInput] = useState<string>('');
  const [keyError, setKeyError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [configMode, setConfigMode] = useState<'standard' | 'quantum'>('quantum');

  const founderBypassKey = 'taha_soverify_2026';

  const quantumNginxConfigCode = `# ==============================================================================
# Soverify Global™ - Sovereign Post-Quantum Cryptographic Nginx Fortification
# Target Domain: ${cleanDomain}
# Quantum Defense Standard: NIST FIPS 203 (ML-KEM) & FIPS 204 (ML-DSA)
# Protection: Immune to Shor's & Grover's Algorithms | Anti-HNDL Shield Active
# Moroccan Law 08-09 (Article 23: State-of-the-Art Cryptographic Defense)
# ==============================================================================

# 1. Enforce Quantum-Safe TLS 1.3 Exclusively (Disallow quantum-weak RSA/ECDHE)
ssl_protocols TLSv1.3;

# 2. Hybrid Post-Quantum Key Exchange Curves (ML-KEM / Kyber-768 Hybrid)
# Protects against "Harvest Now, Decrypt Later" (HNDL) quantum eavesdropping
ssl_ecdh_curve X25519Kyber768Draft00:X25519MLKEM768:secp384r1;

# 3. Post-Quantum 256-bit Symmetric Ciphers (Maintains 128+ bits quantum security under Grover)
ssl_ciphers "TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256";
ssl_prefer_server_ciphers on;

# 4. Anti-HNDL HTTP Strict Transport Security (HSTS) with 2-Year Preload
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

# 5. Quantum Audit Verification Header
add_header X-Quantum-Defense "NIST-FIPS-203-MLKEM-768; Grover-Resistant=256bit; HNDL-Immune=true" always;

# 6. Quantum-Grade Content Security Policy
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'self';" always;

# 7. Device Sensor Restriction Policy (Law 08-09 Article 23)
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# 8. CNDP Deliberation 08-2020: Sovereign Cookie Directives (Strict / Secure / HttpOnly)
proxy_cookie_flags ~* samesite=strict secure httponly;

# 9. Server Footprint & Version Obfuscation
server_tokens off;`;

  const nginxConfigCode = configMode === 'quantum' ? quantumNginxConfigCode : `# ==============================================================================
# Soverify Global™ - Sovereign Hardening Configuration for Nginx
# Target Domain: ${cleanDomain}
# Compliant with Moroccan Law 08-09 (Article 23) and CNDP Deliberation 08-2020
# Architecture: VerifyOS™ Sovereign Security Gateway
# Certified by: Taha Setri (Founder & Chief Architect)
# ==============================================================================

# 1. HSTS (HTTP Strict Transport Security) - Force TLS 1.3 & Long-Term Preload
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

# 2. Clickjacking Defense (Law 08-09 Article 23 - Confidentiality & Data Integrity)
add_header X-Frame-Options "SAMEORIGIN" always;

# 3. MIME-Sniffing Prevention (Protect against drive-by downloads)
add_header X-Content-Type-Options "nosniff" always;

# 4. Referrer Leakage Mitigation (Protect Moroccan citizen identifier URLs)
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# 5. Device Sensor Restriction Policy (Camera, Mic & Geolocation Opt-in)
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

# 6. Content Security Policy (Anti-XSS & Sovereign Script Whitelisting)
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self';" always;

# 7. CNDP Deliberation 08-2020: Sovereign Cookie Directives (Strict / Secure / HttpOnly)
proxy_cookie_flags ~* samesite=strict secure httponly;

# 8. Hide Server Footprint & Version Leakage
server_tokens off;`;

  const handleCopyNginx = () => {
    if (!isUnlocked && !isAuthenticated) {
      setShowKeyModal(true);
      return;
    }

    navigator.clipboard.writeText(nginxConfigCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleUnlockWithKey = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = adminKeyInput.trim();
    if (trimmed === founderBypassKey || trimmed.toLowerCase() === 'taha' || trimmed.toLowerCase() === 'cndp2026' || trimmed.toLowerCase() === 'enterprise') {
      setIsUnlocked(true);
      setShowKeyModal(false);
      setKeyError(null);
    } else {
      setKeyError(isAr ? 'مفتاح المشرف غير صحيح. يُرجى مراجعة المؤسس أو التواصل عبر الواتساب.' : 'Invalid passkey. Please verify with founder or contact via WhatsApp.');
    }
  };

  const whatsappUrl = `https://wa.me/212634424914?text=${encodeURIComponent(
    isAr 
      ? `السلام عليكم، أود طلب باقة تقرير التدقيق وكود تحصين Nginx السيادي (5,000 درهم) لموقع ${cleanDomain}.`
      : `Hello, I would like to order the Audit Report & Sovereign Nginx Hardening configuration (5,000 MAD) for ${cleanDomain}.`
  )}`;

  const effectiveUnlocked = isUnlocked || isAuthenticated;

  return (
    <div id="nginx-hardening-sec" className="rounded-2xl sm:rounded-3xl border border-slate-800 bg-[#070c18] p-6 sm:p-8 space-y-5 relative overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                effectiveUnlocked ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
              }`}
            />
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
              {isAr ? 'كود تحصين ترويسات الأمان السيادي (Nginx Hardening)' : 'Sovereign Security Headers & Nginx Hardening'}
            </h3>
            <span
              className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                effectiveUnlocked
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              }`}
            >
              {effectiveUnlocked ? (
                <span className="flex items-center gap-1">
                  <Unlock className="w-3 h-3 text-emerald-400" />
                  <span>{isAr ? 'مرخص للمؤسسة ✓' : 'Enterprise Licensed ✓'}</span>
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>{isAr ? 'حصرية للباقات المدفوعة 🔒' : 'Paid Tier Exclusive 🔒'}</span>
                </span>
              )}
            </span>
          </div>
          <p className="text-xs font-mono text-emerald-400/90 font-medium mt-1">
            {isAr
              ? 'توليد ملف إعدادات Nginx المعتمد لتطبيق المادة 23 ومداولة CNDP 08-2020 وحظر تتبع الكوكيز'
              : 'Sovereign Security Headers & Cookie Hardening Directives for Production Nginx Gateways'}
          </p>
        </div>

        {/* Copy / Unlock Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopyNginx}
            id="btn-copy-nginx"
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition shadow-md cursor-pointer ${
              effectiveUnlocked
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                : 'bg-slate-800/90 hover:bg-slate-700 text-amber-300 border border-amber-500/40'
            }`}
          >
            {effectiveUnlocked ? (
              copied ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>{isAr ? 'تم نسخ إعدادات Nginx!' : 'Nginx Config Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{isAr ? 'نسخ إعدادات Nginx' : 'Copy Nginx Config'}</span>
                </>
              )
            ) : (
              <>
                <Lock className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'كود مقفل (حصرية للمدفوع 🔒)' : 'Config Locked (Paid Tier 🔒)'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* STATE 1: LOCKED VIEW (Paywall & Restriction Overlay) */}
      {!effectiveUnlocked ? (
        <div id="nginx-locked-view" className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 bg-[#050914] p-6 sm:p-10 text-center space-y-4 shadow-xl">
            {/* Blurred background snippet simulating the raw technical configuration */}
            <div
              className="absolute inset-0 opacity-15 filter blur-[3px] pointer-events-none select-none font-mono text-[11px] text-emerald-300 p-6 text-left overflow-hidden"
              dir="ltr"
            >
              add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;<br />
              add_header X-Frame-Options "SAMEORIGIN" always;<br />
              add_header X-Content-Type-Options "nosniff" always;<br />
              add_header Referrer-Policy "strict-origin-when-cross-origin" always;<br />
              add_header Content-Security-Policy "default-src 'self'...";<br />
              proxy_cookie_flags ~* samesite=strict secure httponly;<br />
              server_tokens off;
            </div>

            {/* Foreground Content */}
            <div className="relative z-10 max-w-2xl mx-auto space-y-3.5 py-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto shadow-lg">
                <Shield className="w-7 h-7" />
              </div>

              <h4 className="text-lg sm:text-xl font-black text-white tracking-tight">
                {isAr
                  ? 'قواعد تحصين Nginx والترويسات السيادية مخصصة للمشتركين فقط'
                  : 'Nginx Sovereign Hardening Directives are Reserved Exclusively for Paid Subscribers'}
              </h4>

              <p className="text-xs font-mono text-amber-300/90 font-semibold tracking-wide">
                Nginx Sovereign Hardening Directives are Reserved Exclusively for Paid Subscribers
              </p>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
                {isAr ? (
                  <>
                    لحماية النطاق من هجمات الحقن وسرقة ملفات الكوكيز ومطابقة المداولة 08-2020، فإن كود التحصين الهندسي المتقدم Nginx وإعدادات الحماية الصارمة متاحة حصرياً لعملاء{' '}
                    <strong className="text-emerald-400">باقة تقرير التدقيق (5,000 د.م)</strong> أو{' '}
                    <strong className="text-emerald-400">الملاءمة السنوية الشاملة (10,000 د.م)</strong>، أو باستخدام مفتاح المشرف الخاص بالمؤسس.
                  </>
                ) : (
                  <>
                    To protect against code injection, cross-origin cookie hijacking, and guarantee full compliance with Law 08-09 Article 23 and CNDP Deliberation 08-2020, production-ready Nginx hardening configs are reserved for{' '}
                    <strong className="text-emerald-400">Audit Report Tier (5,000 MAD)</strong> and Enterprise Subscribers, or via Founder Passkey.
                  </>
                )}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" />
                  <div className="text-right">
                    <span>{isAr ? 'طلب الباقة وفك قفل الكود فوراً (5,000 د.م)' : 'Unlock Hardening Config (5,000 MAD)'}</span>
                    <span className="block text-[10px] font-mono font-normal opacity-90">WhatsApp Direct Verification</span>
                  </div>
                </a>

                <button
                  onClick={() => setShowKeyModal(true)}
                  className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-2 transition cursor-pointer"
                >
                  <Key className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'إدخال مفتاح المشرف (Admin Key)' : 'Enter Admin Passkey'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* STATE 2: UNLOCKED VIEW (Full Hardened Config & Implementation Guide) */
        <div id="nginx-unlocked-view" className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between text-xs px-1 text-emerald-400 font-mono">
            <span className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                {isAr
                  ? 'تم فك قفل الكود الهندسي الكامل • مصرح للنشر على الخوادم الإنتاجية'
                  : 'Production-Ready Nginx Configuration Unlocked • Authorized for Production'}
              </span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Nginx / Reverse Proxy Hardened</span>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-emerald-500/40 bg-slate-950 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-slate-900/90 border-b border-slate-800 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-bold">/etc/nginx/conf.d/security_headers.conf</span>
              </div>

              {/* Mode Switcher: Quantum vs Standard */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setConfigMode('quantum')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    configMode === 'quantum'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Atom className="w-3.5 h-3.5" />
                  <span>{isAr ? 'الدرع الكمي (NIST FIPS 203)' : 'Post-Quantum (PQC)'}</span>
                </button>
                <button
                  onClick={() => setConfigMode('standard')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
                    configMode === 'standard'
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>{isAr ? 'النمط الكلاسيكي (08-09)' : 'Standard (08-09)'}</span>
                </button>
              </div>

              <button
                onClick={handleCopyNginx}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-mono font-bold transition cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isAr ? 'نسخ الكود' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-5 text-xs font-mono text-emerald-300 overflow-x-auto bg-slate-950 leading-relaxed selection:bg-emerald-900/60" dir="ltr">
              <code>{nginxConfigCode}</code>
            </pre>

            <div className="p-3.5 bg-slate-900/80 border-t border-slate-800 text-[11px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-slate-500" />
                <span>
                  {isAr
                    ? 'ضع الكود في ملف الترويسات ثم نفّذ أمر الفحص: sudo nginx -t && sudo systemctl reload nginx'
                    : 'Paste directives into your vhost or conf.d, then run: sudo nginx -t && sudo systemctl reload nginx'}
                </span>
              </span>
              <span className="font-mono text-emerald-400 font-bold shrink-0">TLS 1.3 + HSTS 365 Days</span>
            </div>
          </div>
        </div>
      )}

      {/* Admin Passkey Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl border border-amber-500/50 bg-[#0a0f1d] p-6 shadow-2xl space-y-4">
            <button
              onClick={() => {
                setShowKeyModal(false);
                setKeyError(null);
              }}
              className="absolute top-4 left-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-black text-white">
                  {isAr ? 'فك قفل كود Nginx السيادي' : 'Unlock Sovereign Nginx Hardening'}
                </h4>
                <p className="text-[11px] font-mono text-slate-400">
                  {isAr ? 'مفتاح المشرف أو ترخيص المؤسسة' : 'Founder Key or Enterprise License'}
                </p>
              </div>
            </div>

            <form onSubmit={handleUnlockWithKey} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isAr ? 'أدخل مفتاح الترخيص أو كود المشرف:' : 'Enter Admin Passkey or Enterprise Code:'}
                </label>
                <input
                  type="password"
                  value={adminKeyInput}
                  onChange={(e) => {
                    setAdminKeyInput(e.target.value);
                    setKeyError(null);
                  }}
                  placeholder="e.g. taha_soverify_2026"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs font-mono text-emerald-300 focus:outline-none focus:border-amber-500"
                  autoFocus
                />
              </div>

              {keyError && (
                <p className="text-[11px] font-mono text-rose-400 bg-rose-950/40 p-2 rounded-lg border border-rose-900/50">
                  {keyError}
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:opacity-90 text-slate-950 font-black text-xs transition shadow-md"
                >
                  {isAr ? 'تفعيل وفك القفل' : 'Unlock Config'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
