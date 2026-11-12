'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  KeyRound, 
  Sparkles, 
  AlertCircle,
  Car,
  ArrowRight
} from 'lucide-react';
import { Student } from '@/types';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { validateNewPassword } from '@/lib/passwordSecurity';

interface FirstLoginPasswordSetupProps {
  student: Student;
  onSuccess?: () => void;
}

export const FirstLoginPasswordSetup: React.FC<FirstLoginPasswordSetupProps> = ({
  student,
  onSuccess
}) => {
  const router = useRouter();
  const { school, setupInitialPassword, addToast } = useDrivingSchool();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Live real-time validation & strength calculation
  const validation = validateNewPassword(newPassword, confirmPassword, student.student_code);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!validation.isValid) {
      setFormError(validation.errors[0] || 'Please fulfill all password security requirements.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await setupInitialPassword({
        studentId: student.id,
        newPassword: newPassword.trim(),
        confirmPassword: confirmPassword.trim()
      });

      if (res.success) {
        addToast('Permanent password created successfully! Welcome to your dashboard.', 'success');
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/student/dashboard');
        }
      } else {
        setFormError(res.message || 'Failed to update password. Please try again.');
      }
    } catch (err: any) {
      setFormError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0B1728] flex items-center justify-center p-4 sm:p-6 text-slate-900 dark:text-slate-100">
      <div className="max-w-lg w-full space-y-6 animate-fadeIn">
        {/* Academy Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-16 h-16 rounded-3xl bg-[#14243A] border border-[#1E293B] text-blue-500 items-center justify-center shadow-xl shadow-blue-600/10 mb-2">
            <Car className="w-9 h-9 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Welcome to {school.name || 'Model Driving Academy'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            Your account has been created successfully. Please create your personal password to continue.
          </p>
        </div>

        {/* Security Setup Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-2xl space-y-6">
          {/* Student Identity Badge */}
          <div className="p-4 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow">
                {student.full_name.charAt(0)}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  {student.full_name}
                </span>
                <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400 font-bold block">
                  Student ID: {student.student_code}
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              1st Login Setup Required
            </span>
          </div>

          {formError && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {/* Field 1: New Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                  New Password
                </label>
                {newPassword.length > 0 && (
                  <span className={`text-[11px] font-bold ${validation.strength.color}`}>
                    {validation.strength.label}
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter strong personal password"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white pr-10 focus:outline-none focus:border-blue-600 text-sm font-medium transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength Meter Bar */}
              {newPassword.length > 0 && (
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div
                    className={`h-full ${validation.strength.barClass} transition-all duration-300`}
                    style={{ width: `${validation.strength.percent}%` }}
                  />
                </div>
              )}
            </div>

            {/* Field 2: Confirm New Password */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  autoComplete="new-password"
                  className="w-full px-4 py-3 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white pr-10 focus:outline-none focus:border-blue-600 text-sm font-medium transition"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Live Requirements Checklist */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-2">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                Password Security Checklist:
              </span>
              <ul className="space-y-1.5 text-[11px]">
                <li className={`flex items-center gap-2 ${validation.requirements.minLength ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-500 dark:text-slate-300'}`}>
                  {validation.requirements.minLength ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <span className="w-3.5 h-3.5 rounded-full border border-slate-400 shrink-0 inline-block" />}
                  <span>Minimum 8 characters</span>
                </li>
                <li className={`flex items-center gap-2 ${validation.requirements.hasUppercase ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-500 dark:text-slate-300'}`}>
                  {validation.requirements.hasUppercase ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <span className="w-3.5 h-3.5 rounded-full border border-slate-400 shrink-0 inline-block" />}
                  <span>At least one uppercase letter (A-Z)</span>
                </li>
                <li className={`flex items-center gap-2 ${validation.requirements.hasLowercase ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-500 dark:text-slate-300'}`}>
                  {validation.requirements.hasLowercase ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <span className="w-3.5 h-3.5 rounded-full border border-slate-400 shrink-0 inline-block" />}
                  <span>At least one lowercase letter (a-z)</span>
                </li>
                <li className={`flex items-center gap-2 ${validation.requirements.hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-500 dark:text-slate-300'}`}>
                  {validation.requirements.hasNumber ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <span className="w-3.5 h-3.5 rounded-full border border-slate-400 shrink-0 inline-block" />}
                  <span>At least one number (0-9)</span>
                </li>
                <li className={`flex items-center gap-2 ${validation.requirements.hasSpecialChar ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-slate-500 dark:text-slate-300'}`}>
                  {validation.requirements.hasSpecialChar ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <span className="w-3.5 h-3.5 rounded-full border border-slate-400 shrink-0 inline-block" />}
                  <span>At least one special character (!@#$%^&*...)</span>
                </li>
                <li className={`flex items-center gap-2 ${validation.requirements.notStudentId ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-rose-500 font-bold'}`}>
                  {validation.requirements.notStudentId ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <XCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />}
                  <span>Cannot be your Student ID ({student.student_code})</span>
                </li>
                {confirmPassword.length > 0 && (
                  <li className={`flex items-center gap-2 ${validation.requirements.passwordsMatch ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-rose-500 font-bold'}`}>
                    {validation.requirements.passwordsMatch ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <XCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />}
                    <span>Passwords match</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={!validation.isValid || isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-600/25 transition cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span>Securing and saving credential...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" /> Save New Password & Proceed to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Privacy & Security Note */}
          <div className="pt-3 border-t border-[#E5EAF1] dark:border-[#1E293B] text-center text-[10px] text-slate-500 dark:text-slate-400">
            <span>
              🔒 Your password will be securely hashed with PBKDF2-SHA256. Academy staff cannot see or retrieve your permanent password.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
