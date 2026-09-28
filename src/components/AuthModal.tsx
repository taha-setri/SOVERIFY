import React, { useState } from 'react';
import { X, User, Lock, Building, ShieldCheck, CheckCircle2, Cloud, Sparkles, AlertCircle } from 'lucide-react';
import { UserAccount } from '../types';
import { signInWithGoogle, logoutFirebase } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onLogin: (user: UserAccount) => void;
  onLogout: () => void;
  lang: 'ar' | 'en';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  lang
}) => {
  const isAr = lang === 'ar';
  const [email, setEmail] = useState('dpo@soverify.ma');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Yassine El Fassi');
  const [org, setOrg] = useState('Maroc Cyber Defense Labs');
  const [role, setRole] = useState('DPO Certified CNDP');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  if (!isOpen) return null;

  const demoAccounts: UserAccount[] = [
    {
      name: 'Yassine El Fassi',
      email: 'yassine.elfassi@banque.ma',
      role: 'Chief DPO / مسؤول حماية المعطيات',
      organization: 'Groupe Bancaire Marocain'
    },
    {
      name: 'Fatima-Zahra Bennani',
      email: 'fz.bennani@telecom.ma',
      role: 'CISO / مدير أمن نظم المعلومات',
      organization: 'Opérateur Télécom National'
    },
    {
      name: 'Karim Tazi',
      email: 'karim.tazi@fintech.ma',
      role: 'Compliance Lead / مسؤول الامتثال',
      organization: 'Fintech Casablanca Hub'
    }
  ];

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setAuthError(null);
    try {
      const firebaseUser = await signInWithGoogle();
      if (firebaseUser) {
        const userObj: UserAccount = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'Google User',
          email: firebaseUser.email || '',
          role: 'DPO / حماية المعطيات الشخصية',
          organization: 'Enterprise (Cloud Verified)',
          photoURL: firebaseUser.photoURL || undefined,
          isFirebaseUser: true
        };
        onLogin(userObj);
        onClose();
      }
    } catch (err: any) {
      console.error('Google Sign-in failed:', err);
      setAuthError(err.message || (isAr ? 'فشل تسجيل الدخول عبر Google' : 'Google Sign-in failed'));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      name: name || 'Yassine El Fassi',
      email: email || 'dpo@soverify.ma',
      role: role || 'DPO',
      organization: org || 'Morocco Enterprise',
      isFirebaseUser: false
    });
    onClose();
  };

  const handleSelectDemo = (acc: UserAccount) => {
    onLogin({
      ...acc,
      isFirebaseUser: false
    });
    onClose();
  };

  const handleSignOut = async () => {
    if (currentUser?.isFirebaseUser) {
      await logoutFirebase().catch(console.error);
    }
    onLogout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {currentUser ? (isAr ? 'حساب مسؤول الامتثال (DPO)' : 'DPO Account Profile') : isAr ? 'تسجيل الدخول لبوابة الامتثال' : 'DPO Portal Login'}
              </h3>
              <p className="text-xs text-slate-400">
                {isAr ? 'حفظ التقارير السحابية عبر Firebase ومزامنتها فورياً' : 'Sync audit reports with Firebase Cloud Firestore'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {authError && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{authError}</span>
          </div>
        )}

        {currentUser ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              {currentUser.photoURL && (
                <div className="flex items-center gap-3 pb-2 border-b border-slate-800/80">
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.name}
                    className="h-11 w-11 rounded-full border border-emerald-500/40 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-sm font-bold text-white block">{currentUser.name}</span>
                    <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                      <Cloud className="h-3 w-3" />
                      {isAr ? 'مُتصل بسحابة Firebase' : 'Firebase Cloud Synced'}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{isAr ? 'الاسم:' : 'Name:'}</span>
                <span className="text-sm font-bold text-white font-mono">{currentUser.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{isAr ? 'الصفة القانونية:' : 'Role:'}</span>
                <span className="text-xs text-emerald-400 font-mono">{currentUser.role}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{isAr ? 'المؤسسة:' : 'Organization:'}</span>
                <span className="text-xs text-slate-300 font-mono">{currentUser.organization}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{isAr ? 'البريد:' : 'Email:'}</span>
                <span className="text-xs text-slate-400 font-mono">{currentUser.email}</span>
              </div>
              {currentUser.uid && (
                <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[10px] text-slate-500 font-mono">
                  <span>UID:</span>
                  <span className="truncate max-w-[180px]">{currentUser.uid}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleSignOut}
              className="w-full rounded-xl border border-rose-500/40 bg-rose-950/20 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-950/50 transition font-mono"
            >
              {isAr ? 'تسجيل الخروج' : 'Sign Out'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Primary Google Sign-In with Firebase */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-slate-700 bg-white px-4 py-2.5 text-sm font-bold text-slate-900 hover:bg-slate-100 transition shadow-lg shadow-white/5 disabled:opacity-60"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isGoogleLoading ? (isAr ? 'جارِ الاتصال...' : 'Connecting...') : (isAr ? 'تسجيل الدخول بواسطة Google' : 'Sign in with Google')}</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-800" />
              <span className="text-[11px] font-mono text-slate-500 uppercase">{isAr ? 'أو عبر البريد المهني' : 'Or with work email'}</span>
              <div className="h-px flex-1 bg-slate-800" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">{isAr ? 'البريد الإلكتروني المهني' : 'Work Email'}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white font-mono outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">{isAr ? 'كلمة المرور' : 'Password'}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white font-mono outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-500 py-2.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20"
              >
                {isAr ? 'دخول لوحة المتابعة' : 'Access DPO Dashboard'}
              </button>
            </form>

            {/* Quick Demo Accounts */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-mono text-slate-500 block">
                {isAr ? 'أو تجربة حسابات جاهزة بضغطة واحدة:' : 'Or Quick Login with Demo DPO Profiles:'}
              </span>
              <div className="space-y-1.5">
                {demoAccounts.map((acc, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectDemo(acc)}
                    className="w-full text-right p-2.5 rounded-lg border border-slate-800 bg-slate-950/70 hover:border-emerald-500/40 hover:bg-slate-900 transition flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">{acc.name}</span>
                      <span className="text-[10px] text-slate-400">{acc.organization}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800 px-2 py-0.5 rounded">
                      {acc.role.split('/')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
