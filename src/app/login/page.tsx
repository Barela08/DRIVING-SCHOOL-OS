'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { 
  Car, 
  Lock, 
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  User,
  ShieldCheck,
  ShieldAlert,
  X,
  KeyRound,
  RefreshCw,
  HelpCircle
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginSingleUser, addToast, school } = useDrivingSchool();

  // Unified credentials state
  const [identifier, setIdentifier] = useState('owner@modeldriving.in');
  const [passwordOrPin, setPasswordOrPin] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // CAPTCHA Challenge State (Triggered only when repeated failures occur)
  const [requireCaptcha, setRequireCaptcha] = useState(false);
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');

  // Lockout countdown state
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Forgot Password / PIN Recovery Modal State
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
  const [recoveryId, setRecoveryId] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoveryMessage, setRecoveryMessage] = useState('');
  const [recoveryError, setRecoveryError] = useState('');

  // Handle route-guard redirect alerts
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'unauthorized_owner') {
      setError('Owner authorization required. Please authenticate with your authorized account.');
    } else if (errorParam === 'unauthorized_staff') {
      setError('Staff authorization required to access desk operations.');
    } else if (errorParam === 'unauthorized_instructor') {
      setError('Instructor credentials required to access the driving instructor console.');
    } else if (errorParam === 'unauthorized_student') {
      setError('Student authorization required. Please log in with your Student ID.');
    } else if (errorParam === 'session_tampered') {
      setError('Security warning: Session signature mismatch detected. Please re-authenticate.');
    }
  }, [searchParams]);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds(prev => {
        if (prev <= 1) {
          setError('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    if (!identifier.trim()) {
      setError('Please enter your User ID, Registered Email, Student Code, or Phone.');
      return;
    }
    if (!passwordOrPin) {
      setError('Please enter your Password or secure PIN.');
      return;
    }
    if (requireCaptcha && !captchaAnswer.trim()) {
      setError('Please solve the security challenge before submitting.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await loginSingleUser(identifier.trim(), passwordOrPin, {
        captchaToken: requireCaptcha ? captchaToken : undefined,
        captchaAnswer: requireCaptcha ? captchaAnswer.trim() : undefined
      });

      if (res.success && res.redirectTo) {
        addToast('Credentials verified. Redirecting to your academy portal...', 'success');
        router.push(res.redirectTo);
      } else {
        // Handle rate limiting / lockout / captcha signals
        if (res.isLockedOut && res.lockoutRemainingSeconds) {
          setLockoutSeconds(res.lockoutRemainingSeconds);
          setError('Too many attempts. Please wait before trying again or use account recovery.');
        } else if (res.requireCaptcha && res.captchaChallenge) {
          setRequireCaptcha(true);
          setCaptchaQuestion(res.captchaChallenge.question);
          setCaptchaToken(res.captchaChallenge.token);
          setCaptchaAnswer('');
          setError(res.error || 'Security verification required. Please solve the security check.');
        } else {
          setError(res.error || 'Invalid login details. Please check your credentials and try again.');
        }
        setLoading(false);
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check network connection.');
      setLoading(false);
    }
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryId.trim()) return;

    setRecoveryLoading(true);
    setRecoveryError('');
    setRecoveryMessage('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: recoveryId.trim() })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setRecoveryMessage(data.message || 'If an account matches those details, recovery instructions have been dispatched.');
      } else {
        setRecoveryError(data.error || 'Recovery request could not be processed. Please try again.');
      }
    } catch (err: any) {
      setRecoveryError('Network error while processing password recovery.');
    } finally {
      setRecoveryLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1728] text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#3B82F6] flex items-center justify-center text-white shadow-xl shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Car className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div className="text-left">
              <span className="font-black text-xl tracking-tight text-white block uppercase">
                {school.name || 'Model Driving Academy'}
              </span>
              <span className="text-[11px] text-slate-400 font-medium block">
                Operating System for Model Driving Academy
              </span>
            </div>
          </Link>

          <div className="pt-2">
            <h2 className="text-2xl font-black tracking-tight text-white">
              Academy Portal Login
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Sign in with your registered credentials. Your dashboard will be automatically determined.
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="mt-8 bg-[#111E32] border border-[#1E293B] shadow-2xl rounded-3xl p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-3.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                {error}
                {lockoutSeconds > 0 && (
                  <div className="mt-1 font-mono font-bold text-red-200">
                    Lockout remaining: {Math.floor(lockoutSeconds / 60)}m {lockoutSeconds % 60}s
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Unified Login Form — ZERO role selectors or dropdowns */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Field 1: User ID / Registered ID / Email / Mobile Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                User ID / Registered ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter User ID, Student Code, Email, or Mobile"
                  required
                  autoComplete="username"
                  disabled={lockoutSeconds > 0}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#0B1728] border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-slate-500 text-xs transition disabled:opacity-50"
                />
              </div>
              <span className="text-[10px] text-slate-400 block pl-1">
                Accepted: Email address, Student Code, Staff Code, Instructor ID, or Mobile number.
              </span>
            </div>

            {/* Field 2: Password or Secure PIN */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 block">
                  Password or Secure PIN
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setIsRecoveryOpen(true);
                    setRecoveryId(identifier);
                    setRecoveryMessage('');
                    setRecoveryError('');
                  }}
                  className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition"
                >
                  Forgot Password / PIN?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordOrPin}
                  onChange={(e) => setPasswordOrPin(e.target.value)}
                  placeholder="Enter your account password or PIN"
                  required
                  autoComplete="current-password"
                  disabled={lockoutSeconds > 0}
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#0B1728] border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-slate-500 text-xs transition disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Security CAPTCHA Challenge (Triggered only when repeated failures occur) */}
            {requireCaptcha && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    {captchaQuestion || 'Security Verification'}
                  </span>
                </div>
                <input
                  type="text"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  placeholder="Enter answer"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#0B1728] border border-amber-500/40 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            )}

            {/* Device Security & Remember */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>Remember this device</span>
              </label>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Server Verified
              </span>
            </div>

            {/* Field 3: Login Button */}
            <button
              type="submit"
              disabled={loading || lockoutSeconds > 0}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 text-white font-black text-xs transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials & Role...</span>
                </div>
              ) : lockoutSeconds > 0 ? (
                <span>Locked Out ({lockoutSeconds}s)</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Reference Notice (Passive informational guide, strictly without role selection buttons) */}
          <div className="pt-4 border-t border-slate-800/80">
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-3 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Automatic Role Resolution Enabled</span>
              </div>
              <p className="text-[10px] leading-relaxed text-slate-400">
                You do not need to choose an account type. Model Driving Academy automatically routes you to your authorized dashboard upon verifying your credentials.
              </p>
            </div>
          </div>
        </div>

        {/* Footer links: Field 5 (Student Admission / Registration Link) */}
        <div className="mt-6 text-center text-xs text-slate-400 space-y-2">
          <div>
            Need to register as a new driving student?{' '}
            <Link href="/admission" className="font-bold text-blue-400 hover:text-blue-300 transition">
              Student Admission & Registration
            </Link>
          </div>
          <div>
            <Link href="/" className="hover:text-slate-300 transition">
              ← Return to Academy Website
            </Link>
          </div>
        </div>
      </div>

      {/* Field 4: Forgot Password / PIN Recovery Modal */}
      {isRecoveryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#111E32] border border-[#1E293B] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6 relative">
            <button
              onClick={() => {
                setIsRecoveryOpen(false);
                setRecoveryMessage('');
                setRecoveryError('');
              }}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-white">
                Account Recovery & PIN Reset
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter your registered Email, Student ID, or Mobile number to receive authorization recovery instructions.
              </p>
            </div>

            {recoveryMessage ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-3 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-sm text-white">Recovery Dispatched</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {recoveryMessage}
                </p>
                <button
                  type="button"
                  onClick={() => setIsRecoveryOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleRecoverySubmit} className="space-y-4">
                {recoveryError && (
                  <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{recoveryError}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 block">
                    Registered Identifier
                  </label>
                  <input
                    type="text"
                    value={recoveryId}
                    onChange={(e) => setRecoveryId(e.target.value)}
                    placeholder="Enter email, student code, or phone"
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-[#0B1728] border border-slate-700 text-white placeholder-slate-500 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 text-[11px] text-slate-400 border border-slate-700 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>
                    Students can also visit the Model Driving Academy front desk or call <strong className="text-white">+91 98220 99887</strong> for PIN assistance.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={recoveryLoading}
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                >
                  {recoveryLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processing Request...</span>
                    </>
                  ) : (
                    <span>Send Recovery Instructions</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#0B1728] flex items-center justify-center text-slate-400 text-xs">Loading Academy Portal...</div>}>
      <LoginForm />
    </React.Suspense>
  );
}
