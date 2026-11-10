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
  Lock
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { switchRole } = useDrivingSchool();
  const [activeTab, setActiveTab] = useState<'admin' | 'instructor' | 'student'>('instructor');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [instructorCode, setInstructorCode] = useState('INS-2026-01');
  const [pin, setPin] = useState('1234');
  const [studentCode, setStudentCode] = useState('DS-2026-00101');
  const [studentPass, setStudentPass] = useState('pass123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      switchRole('owner');
      router.push('/owner');
    }, 400);
  };

  const handleInstructorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      if (instructorCode.toUpperCase().startsWith('INS')) {
        switchRole('instructor');
        router.push('/instructor');
      } else {
        setError('Please enter a valid Instructor ID (e.g. INS-2026-01)');
      }
    }, 400);
  };

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      if (studentCode.toUpperCase().startsWith('DS')) {
        switchRole('student');
        router.push('/student');
      } else {
        setError('Please enter a valid Student ID (e.g. DS-2026-00101)');
      }
    }, 400);
  };

  const quickDemoLogin = (role: UserRole, path: string) => {
    switchRole(role);
    router.push(path);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 items-center justify-center shadow-lg shadow-amber-500/20 mb-1">
            <Car className="w-7 h-7 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Sign In to Driving School OS</h1>
          <p className="text-xs text-slate-400">Select your role to access your personalized portal</p>
        </div>

        {/* Auth Role Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1.5 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => { setActiveTab('instructor'); setError(''); }}
            className={`py-2 px-2 rounded-lg font-medium transition flex items-center justify-center gap-1.5 ${
              activeTab === 'instructor'
                ? 'bg-emerald-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-3.5 h-3.5" /> Instructor
          </button>
          <button
            onClick={() => { setActiveTab('student'); setError(''); }}
            className={`py-2 px-2 rounded-lg font-medium transition flex items-center justify-center gap-1.5 ${
              activeTab === 'student'
                ? 'bg-amber-600 text-slate-950 font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" /> Student
          </button>
          <button
            onClick={() => { setActiveTab('admin'); setError(''); }}
            className={`py-2 px-2 rounded-lg font-medium transition flex items-center justify-center gap-1.5 ${
              activeTab === 'admin'
                ? 'bg-purple-600 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Owner / Staff
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          {/* TAB 1: INSTRUCTOR LOGIN */}
          {activeTab === 'instructor' && (
            <form onSubmit={handleInstructorLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Instructor ID / Code</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={instructorCode}
                    onChange={(e) => setInstructorCode(e.target.value)}
                    placeholder="e.g. INS-2026-01"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono uppercase"
                  />
                </div>
                <p className="text-[11px] text-slate-500">Instructor code allocated by management</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">4-Digit Security PIN</label>
                <input
                  type="password"
                  required
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 tracking-widest text-center text-lg"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
              >
                {loading ? 'Authenticating...' : 'Sign In as Instructor'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 2: STUDENT LOGIN */}
          {activeTab === 'student' && (
            <form onSubmit={handleStudentLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Student Unique Code</label>
                <input
                  type="text"
                  required
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value)}
                  placeholder="e.g. DS-2026-00101"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500 font-mono uppercase"
                />
                <p className="text-[11px] text-slate-500">Found on your admission receipt or SMS</p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Password / Mobile OTP</label>
                <input
                  type="password"
                  required
                  value={studentPass}
                  onChange={(e) => setStudentPass(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                {loading ? 'Logging in...' : 'Sign In to Student Portal'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 3: OWNER & STAFF LOGIN */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Registered Email / Mobile</label>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@apexdriving.in"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Secure Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2"
              >
                {loading ? 'Verifying...' : 'Sign In to Administrative Console'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 1-Tap Quick Demo Credentials */}
          <div className="pt-4 border-t border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block mb-2">⚡ 1-Tap Quick Demo Access:</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => quickDemoLogin('owner', '/owner')}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-purple-300 transition"
              >
                👑 <strong>Owner</strong>
                <span className="block text-[10px] text-slate-500">Rajesh Mehta</span>
              </button>

              <button
                onClick={() => quickDemoLogin('staff', '/staff')}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-blue-300 transition"
              >
                📋 <strong>Staff</strong>
                <span className="block text-[10px] text-slate-500">Sunita Patil</span>
              </button>

              <button
                onClick={() => quickDemoLogin('instructor', '/instructor')}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-emerald-300 transition"
              >
                🚘 <strong>Instructor</strong>
                <span className="block text-[10px] text-slate-500">INS-2026-01 (Vikram)</span>
              </button>

              <button
                onClick={() => quickDemoLogin('student', '/student')}
                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left text-amber-300 transition"
              >
                🎓 <strong>Student</strong>
                <span className="block text-[10px] text-slate-500">DS-2026-00101 (Rahul)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
