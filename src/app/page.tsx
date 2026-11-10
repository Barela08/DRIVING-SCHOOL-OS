'use client';

import React from 'react';
import Link from 'next/link';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { 
  ShieldCheck, 
  Users, 
  Car, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight, 
  IndianRupee, 
  Calendar, 
  FileCheck2, 
  TrendingUp, 
  Smartphone, 
  Lock, 
  Gauge,
  Sparkles,
  BookOpen,
  Award,
  PhoneCall,
  Clock,
  Check
} from 'lucide-react';

export default function HomePage() {
  const { students, instructors, vehicles, payments, attendanceRecords, switchRole, courses, school } = useDrivingSchool();

  // Metrics calculation
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'Active').length;
  const totalFleet = vehicles.length;
  const totalCollections = payments
    .filter(p => p.status === 'Confirmed')
    .reduce((sum, p) => sum + p.amount, 0);

  const portals = [
    {
      role: 'owner',
      title: 'Owner & Super Admin',
      subtitle: 'Complete Operational Oversight & Control',
      badge: 'Full Authority',
      icon: ShieldCheck,
      route: '/owner/dashboard',
      features: [
        'Real-time executive KPI dashboard & analytics',
        'Staff management & individual RBAC permissions',
        'Fee reconciliation & payment confirmation desk',
        'Fleet maintenance & insurance/PUC alerts',
        'Complete immutable audit logging trail'
      ]
    },
    {
      role: 'staff',
      title: 'Desk & Admissions Staff',
      subtitle: 'Student Lifecycle & Daily Operations',
      badge: 'Counter Operations',
      icon: Users,
      route: '/staff/dashboard',
      features: [
        'Instant student registration (auto DS-2026 codes)',
        'Course enrollment & instructor allocation',
        'Record fee payments & print official receipts',
        'Schedule driving slots & RTO test dates',
        'Verify KYC & Form 1A medical documents'
      ]
    },
    {
      role: 'instructor',
      title: 'Driver / Instructor PWA',
      subtitle: 'Mobile-First Quick Attendance Marking',
      badge: 'Core Field Feature',
      icon: Car,
      route: '/instructor/dashboard',
      features: [
        'Search students by ID (e.g. DS-2026-00101)',
        'One-click atomic attendance marking',
        'Session quota enforcement (anti-duplicate)',
        'Driving performance remarks entry',
        'Daily completed class count & vehicle logs'
      ]
    },
    {
      role: 'student',
      title: 'Student Self-Service Portal',
      subtitle: 'Track Your Driving Journey & Licencing',
      badge: 'Private & Secure',
      icon: GraduationCap,
      route: '/student/dashboard',
      features: [
        'Strict Row Level Security (RLS) data privacy',
        'Visual category-wise curriculum progress bar',
        'Fee ledger, paid receipts & balance breakdown',
        'Sarathi RTO LL & DL appointment tracker',
        'Direct phone link to assigned driving instructor'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0B1728] text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#E5EAF1] dark:border-[#1E293B]">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Main Hero Header */}
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Complete Single Driving School Management System • Version 1.0
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              The Operating System for Modern Driving Academies
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Digitize your entire driving school operations in India: student admissions, 1-click instructor mobile attendance, fee collection, dual-control fleet, and Sarathi RTO licensing.
            </p>

            {/* CTA Group */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                href="/admission"
                className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/25 transition"
              >
                Start New Student Admission <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="px-6 py-3.5 rounded-2xl bg-white dark:bg-[#111E32] hover:bg-slate-50 dark:hover:bg-[#14243A] text-slate-900 dark:text-white border border-[#E5EAF1] dark:border-[#1E293B] font-bold text-sm shadow-sm transition"
              >
                Sign In to Dashboard
              </Link>
              <Link
                href="/courses"
                className="px-6 py-3.5 rounded-2xl bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold text-sm transition"
              >
                View Courses & Fees
              </Link>
            </div>
          </div>

          {/* KPI Ticker Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-xl">
            <div className="p-4 text-center border-r border-[#E5EAF1] dark:border-[#1E293B] last:border-0">
              <span className="text-xs font-semibold text-slate-500 block">Total Students</span>
              <div className="text-3xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
                {totalStudents}
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">{activeStudents} Active Learners</span>
            </div>

            <div className="p-4 text-center border-r border-[#E5EAF1] dark:border-[#1E293B] last:border-0">
              <span className="text-xs font-semibold text-slate-500 block">Revenue Confirmed</span>
              <div className="text-3xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
                ₹{totalCollections.toLocaleString('en-IN')}
              </div>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">100% Verified Ledger</span>
            </div>

            <div className="p-4 text-center border-r border-[#E5EAF1] dark:border-[#1E293B] last:border-0">
              <span className="text-xs font-semibold text-slate-500 block">Dual-Control Fleet</span>
              <div className="text-3xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
                {totalFleet} Cars
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">All Dual-Brake Equipped</span>
            </div>

            <div className="p-4 text-center">
              <span className="text-xs font-semibold text-slate-500 block">Attendance Logs</span>
              <div className="text-3xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
                {attendanceRecords.length}
              </div>
              <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">Atomic 1-Click Logs</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Dedicated Role Portals */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 w-full">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Four Specialized Role-Based Dashboards
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            One consistent design system with tailored workflows for every team member and student
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portals.map(p => {
            const Icon = p.icon;
            return (
              <div
                key={p.role}
                className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-6">
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                      <Icon className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      {p.badge}
                    </span>
                  </div>

                  {/* Header Title */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {p.subtitle}
                    </p>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                    {p.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Direct Action Link */}
                <div className="pt-6 mt-6 border-t border-[#E5EAF1] dark:border-[#1E293B]">
                  <Link
                    href={p.route}
                    onClick={() => switchRole(p.role as any)}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
                  >
                    Launch {p.title.split(' ')[0]} Portal <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Core Workflow Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#14243A] text-white border-t border-[#1E293B] mt-auto">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black">
              The Complete Digital Driving Lifecycle
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              From the moment a learner visits your desk to the day their official Driving Licence is issued
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center text-xs">
            {[
              { step: '01', title: 'Student Admission', desc: 'Auto DS-2026 code generation & course enrollment' },
              { step: '02', title: 'Session Allocation', desc: 'Basic, Road, Reverse, Night & Highway modules' },
              { step: '03', title: '1-Click Attendance', desc: 'Driver marks attendance with quota checks' },
              { step: '04', title: 'Fee Collection Desk', desc: 'UPI/Cash records & serialized receipts' },
              { step: '05', title: 'Sarathi RTO Tracking', desc: 'LL approval to practical DL track test' }
            ].map(st => (
              <div key={st.step} className="p-5 rounded-2xl bg-[#111E32] border border-[#1E293B] space-y-2">
                <span className="font-mono text-xl font-black text-blue-400 block">{st.step}</span>
                <h4 className="font-bold text-white text-sm">{st.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
