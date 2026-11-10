'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { UserRole } from '@/types';
import { 
  Car, 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  KeyRound, 
  Smartphone, 
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Lock,
  Sparkles,
  Award
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { switchRole, addToast } = useDrivingSchool();
  const [activeRole, setActiveRole] = useState<UserRole>('instructor');
  
  // Form states
  const [ownerEmail, setOwnerEmail] = useState('owner@apexdriving.in');
  const [ownerPassword, setOwnerPassword] = useState('••••••••');
  
  const [staffEmail, setStaffEmail] = useState('staff@apexdriving.in');
  const [staffPassword, setStaffPassword] = useState('••••••••');

  const [instructorCode, setInstructorCode] = useState('INS-2026-01');
  const [instructorPin, setInstructorPin] = useState('1234');

  const [studentCode, setStudentCode] = useState('DS-2026-00101');
  const [studentPassword, setStudentPassword] = useState('pass123');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      switchRole(activeRole);
      addToast(`Logged in as ${activeRole.toUpperCase()}`, 'success');
      router.push(`/${activeRole}/dashboard`);
    }, 400);
  };

  const handleQuickDemo = (role: UserRole) => {
    switchRole(role);
    addToast(`Quick switch to ${role.toUpperCase()} portal`, 'info');
    router.push(`/${role}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0B1728] flex items-center justify-center p-4 sm:p-6 text-slate-900 dark:text-slate-100">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-[#14243A] border border-[#1E293B] text-blue-500 items-center justify-center shadow-lg shadow-blue-600/10 mb-1">
            <Car className="w-8 h-8 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Sign In to Driving School OS
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Unified authentication portal for Owner, Staff, Instructors & Students
          </p>
        </div>

        {/* 4-Role Tabs */}
        <div className="grid grid-cols-4 gap-1 bg-white dark:bg-[#111E32] p-1.5 rounded-2xl border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm text-xs font-semibold">
          {[
            { id: 'owner', label: 'Owner', icon: ShieldCheck },
            { id: 'staff', label: 'Staff', icon: Users },
            { id: 'instructor', label: 'Instructor', icon: Award },
            { id: 'student', label: 'Student', icon: GraduationCap }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeRole === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => { setActiveRole(tab.id as UserRole); setError(''); }}
                className={`py-2 px-1 rounded-xl transition flex flex-col items-center gap-1 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[11px]">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Auth Form Card */}
        <div className="p-7 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF1] dark:border-[#1E293B]">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                {activeRole} ACCESS
              </span>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {activeRole === 'owner' && 'Owner Administrator Login'}
                {activeRole === 'staff' && 'Counter & Admissions Staff Login'}
                {activeRole === 'instructor' && 'Instructor ID & PIN Login'}
                {activeRole === 'student' && 'Student ID & Password Login'}
              </h2>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
              Supabase RLS
            </span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {/* Owner Fields */}
            {activeRole === 'owner' && (
              <>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Registered Owner Email / Phone</label>
                  <input
                    type="email"
                    required
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Password / OTP</label>
                  <input
                    type="password"
                    required
                    value={ownerPassword}
                    onChange={(e) => setOwnerPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                </div>
              </>
            )}

            {/* Staff Fields */}
            {activeRole === 'staff' && (
              <>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Staff ID / Email</label>
                  <input
                    type="text"
                    required
                    value={staffEmail}
                    onChange={(e) => setStaffEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Password</label>
                  <input
                    type="password"
                    required
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                </div>
              </>
            )}

            {/* Instructor Fields */}
            {activeRole === 'instructor' && (
              <>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Instructor ID or Mobile</label>
                  <input
                    type="text"
                    required
                    value={instructorCode}
                    onChange={(e) => setInstructorCode(e.target.value)}
                    placeholder="e.g. INS-2026-01"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">4-Digit Security PIN</label>
                  <input
                    type="password"
                    maxLength={6}
                    required
                    value={instructorPin}
                    onChange={(e) => setInstructorPin(e.target.value)}
                    placeholder="e.g. 1234"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-blue-600"
                  />
                </div>
              </>
            )}

            {/* Student Fields */}
            {activeRole === 'student' && (
              <>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Student ID or Mobile Number</label>
                  <input
                    type="text"
                    required
                    value={studentCode}
                    onChange={(e) => setStudentCode(e.target.value)}
                    placeholder="e.g. DS-2026-00101"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Password / OTP</label>
                  <input
                    type="password"
                    required
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating with Supabase...</span>
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5" /> Sign In as {activeRole.toUpperCase()}
                </>
              )}
            </button>
          </form>

          {/* 1-Tap Quick Demo Switching Bar */}
          <div className="pt-4 border-t border-[#E5EAF1] dark:border-[#1E293B] space-y-2">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block text-center">
              1-Tap Instant Demo Access (No password required):
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickDemo('owner')}
                className="p-2 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-[#E5EAF1] dark:border-[#1E293B] text-left transition"
              >
                <span className="font-bold text-slate-900 dark:text-white block">👑 Owner</span>
                <span className="text-[10px] text-slate-400">Rajesh Mehta</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('staff')}
                className="p-2 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-[#E5EAF1] dark:border-[#1E293B] text-left transition"
              >
                <span className="font-bold text-slate-900 dark:text-white block">📋 Staff</span>
                <span className="text-[10px] text-slate-400">Sunita Patil</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('instructor')}
                className="p-2 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-[#E5EAF1] dark:border-[#1E293B] text-left transition"
              >
                <span className="font-bold text-slate-900 dark:text-white block">🚘 Instructor</span>
                <span className="text-[10px] text-slate-400">Vikram Shinde</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('student')}
                className="p-2 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-[#E5EAF1] dark:border-[#1E293B] text-left transition"
              >
                <span className="font-bold text-slate-900 dark:text-white block">🎓 Student</span>
                <span className="text-[10px] text-slate-400">Rahul Sharma</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
