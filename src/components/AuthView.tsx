import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QuestoraLogo } from './QuestoraLogo';
import {
  Compass,
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Shield,
  Loader2,
  Zap,
} from 'lucide-react';

export const AuthView: React.FC<{ onSkipToLanding?: () => void }> = ({ onSkipToLanding }) => {
  const {
    signInGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendResetPassword,
    enterDemoMode,
    authError,
    setAuthError,
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Google Sign-In via Firebase Auth provider
  const handleGoogleSignIn = async () => {
    setLoadingGoogle(true);
    setSuccessMsg(null);
    setAuthError(null);
    try {
      await signInGoogle();
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setLoadingEmail(true);

    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else if (mode === 'signup') {
        await signUpWithEmail(email, password, displayName);
      } else if (mode === 'forgot') {
        await sendResetPassword(email);
        setSuccessMsg(`Password reset link sent to ${email}. Check your inbox!`);
      }
    } catch (err: any) {
      // Error surfaced in AppContext
    } finally {
      setLoadingEmail(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 sm:p-6 transition-colors">
      {/* Background ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] h-[360px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/15 to-cyan-500/15 blur-3xl rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-md space-y-6">
        {/* Brand Header with QUESTORA Logo */}
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <QuestoraLogo size="lg" showText={true} showTagline={true} animated={true} />
        </div>

        {/* Main Auth Card */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-5">
          {/* Streamlined Primary Action: Google Sign-In with Firebase */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold">
              <span className="text-slate-500 dark:text-slate-400">Recommended Sign-In</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                Instant 1-Click
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loadingGoogle || loadingEmail}
              className="w-full relative group overflow-hidden rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white font-bold text-sm py-3.5 px-4 shadow-sm hover:shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {loadingGoogle ? (
                <>
                  <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                  <span>Signing in with Google...</span>
                </>
              ) : (
                <>
                  {/* Official Google 'G' Mark */}
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
                  <span>Continue with Google</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-slate-400">
              Secured with Firebase Authentication provider
            </p>
          </div>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
            <span className="flex-shrink mx-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              or use email
            </span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
          </div>

          {/* Email / Password Tabs */}
          {mode !== 'forgot' ? (
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800/80 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setAuthError(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  mode === 'signin'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setAuthError(null);
                  setSuccessMsg(null);
                }}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  mode === 'signup'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Sign Up
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between pb-1 border-b border-slate-200 dark:border-slate-800">
              <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                Password Recovery
              </h2>
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setAuthError(null);
                  setSuccessMsg(null);
                }}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                Back to Sign In
              </button>
            </div>
          )}

          {/* Feedback messages */}
          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
              <div className="space-y-1">
                <div className="font-semibold">{authError}</div>
                {authError.includes('Firebase Console') && (
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                    Tip: Use <strong>Google Sign-In</strong> above or <strong>Judge Demo Access</strong> below while Email/Password is being configured in the console.
                  </div>
                )}
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Alex Chen"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 pl-9 pr-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 pl-9 pr-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setAuthError(null);
                        setSuccessMsg(null);
                      }}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 pl-9 pr-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loadingEmail || loadingGoogle}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/25 active:scale-95 transition-all mt-1"
            >
              {loadingEmail ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'signin'
                      ? 'Sign In with Email'
                      : mode === 'signup'
                      ? 'Create Student Account'
                      : 'Send Password Reset Link'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Instant Judge / Demo Access */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                enterDemoMode();
                if (onSkipToLanding) onSkipToLanding();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 hover:from-amber-500/20 hover:to-orange-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-xs font-bold transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Hackathon Judge Demo Access</span>
            </button>
          </div>
        </div>

        {/* Security & Config Transparency Footer */}
        <div className="text-center text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
          <div className="flex items-center justify-center gap-1.5 font-medium">
            <Shield className="w-3.5 h-3.5 text-indigo-500" />
            <span>Secured by Firebase Authentication & Firestore Security Rules</span>
          </div>
          {onSkipToLanding && (
            <div>
              <button
                onClick={onSkipToLanding}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline mt-1"
              >
                View Public Landing Page
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
