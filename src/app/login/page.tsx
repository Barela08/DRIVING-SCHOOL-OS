'use client';

import React, { useState, useEffect, Suspense } from 'react';
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
  ShieldAlert,
  X,
  KeyRound
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

  // Handle route-guard redirect alerts with neutral messaging
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError('Authorization required. Please sign in to access this area.');
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
      setError('Please enter your User ID.');
      return;
    }
    if (!passwordOrPin) {
      setError('Please enter your Password or PIN.');
      return;
    }
    if (requireCaptcha && !captchaAnswer.trim()) {
      setError('Please answer the security verification.');
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
        addToast('Signed in successfully.', 'success');
        router.push(res.redirectTo);
      } else {
        // Handle rate limiting / lockout / captcha signals
        if (res.isLockedOut && res.lockoutRemainingSeconds) {
          setLockoutSeconds(res.lockoutRemainingSeconds);
          setError('Too many attempts. Please wait before trying again.');
        } else if (res.requireCaptcha && res.captchaChallenge) {
          setRequireCaptcha(true);
          setCaptchaQuestion(res.captchaChallenge.question);
          setCaptchaToken(res.captchaChallenge.token);
          setCaptchaAnswer('');
          setError('Security check required. Please solve the problem below.');
        } else {
          setError(res.error || 'Invalid credentials. Please check your details and try again.');
        }
        setLoading(false);
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to sign in. Please check your connection.');
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
        setRecoveryMessage('If an account is associated with this User ID, recovery instructions have been sent.');
      } else {
        setRecoveryError(data.error || 'Unable to process recovery request.');
      }
    } catch {
      setRecoveryError('Network error while processing request.');
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
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#3B82F6] flex items-center justify-center text-white shadow-xl shadow-blue-500/25 group-hover:scale-105 transition-transform overflow-hidden">
              {school.logo_url ? <img src={school.logo_url} alt={`${school.name} logo`} className="w-full h-full object-contain bg-white" /> : <Car className="w-7 h-7 stroke-[2.5]" />}
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
              Please enter your credentials to access your account.
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
                    Remaining time: {Math.floor(lockoutSeconds / 60)}m {lockoutSeconds % 60}s
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Minimal, Neutral Form (Module 7) */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Field 1: User ID / Registered ID */}
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
                  placeholder="Enter User ID, Email or Phone"
                  required
                  autoComplete="username"
                  disabled={lockoutSeconds > 0}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#0B1728] border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white placeholder-slate-500 text-xs transition disabled:opacity-50"
                />
              </div>
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
                  placeholder="Enter password or PIN"
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

            {/* Security Check (if triggered by rate limiter) */}
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

            {/* Remember Me */}
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
                  <span>Signing In...</span>
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

          {/* Quick Demo Credentials for Fast Testing */}
          <div className="pt-2 border-t border-slate-800 space-y-2.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block text-center">
              Quick Test Credentials
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setIdentifier('MDA-2026-00125');
                  setPasswordOrPin('MDA-2026-00125');
                  setError('');
                }}
                className="p-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 font-bold transition text-left"
                title="Student with initial temporary password equal to Student ID"
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">New Student (1st Login)</span>
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded">1st Login</span>
                </div>
                <div className="font-mono text-[10px] text-slate-400 mt-0.5">MDA-2026-00125</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIdentifier('DS-2026-001');
                  setPasswordOrPin('pass123');
                  setError('');
                }}
                className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold transition text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">Active Student</span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 rounded">Active</span>
                </div>
                <div className="font-mono text-[10px] text-slate-400 mt-0.5">DS-2026-001</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIdentifier('owner@modeldriving.in');
                  setPasswordOrPin('••••••••');
                  setError('');
                }}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold transition text-left"
              >
                <div className="truncate">Academy Owner</div>
                <div className="font-mono text-[10px] text-slate-400 mt-0.5">owner@modeldriving.in</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIdentifier('ins-2026-01');
                  setPasswordOrPin('1234');
                  setError('');
                }}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold transition text-left"
              >
                <div className="truncate">Instructor Vikram</div>
                <div className="font-mono text-[10px] text-slate-400 mt-0.5">ins-2026-01</div>
              </button>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center text-xs text-slate-400 space-y-2">
          <div>
            <Link href="/" className="hover:text-slate-300 transition">
              ← Return to Home
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
                Enter your registered User ID to receive account recovery instructions.
              </p>
            </div>

            {recoveryMessage ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs space-y-3 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-sm text-white">Recovery Instructions Sent</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {recoveryMessage}
                </p>
                <button
                  type="button"
                  onClick={() => setIsRecoveryOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                >
                  Return to Sign In
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
                    Registered User ID
                  </label>
                  <input
                    type="text"
                    value={recoveryId}
                    onChange={(e) => setRecoveryId(e.target.value)}
                    placeholder="Enter User ID"
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-[#0B1728] border border-slate-700 text-white placeholder-slate-500 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={recoveryLoading}
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs transition shadow-lg shadow-blue-600/30"
                >
                  {recoveryLoading ? 'Processing...' : 'Send Recovery Instructions'}
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
    <Suspense fallback={
      <div className="min-h-screen bg-[#0B1728] flex items-center justify-center text-slate-400 text-xs">
        Loading...
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
