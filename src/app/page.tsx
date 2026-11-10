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
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  const { students, instructors, vehicles, payments, attendanceRecords, switchRole } = useDrivingSchool();

  // Metrics calculation
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'Active').length;
  const totalFleet = vehicles.length;
  const availableFleet = vehicles.filter(v => v.status === 'Available' || v.status === 'Assigned').length;
  const totalCollections = payments
    .filter(p => p.status === 'Confirmed')
    .reduce((sum, p) => sum + p.amount, 0);

  const portals = [
    {
      role: 'owner',
      title: 'Owner & Super Admin',
      subtitle: 'Complete Operational Oversight & Control',
      badge: 'Full Access',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      icon: ShieldCheck,
      color: 'from-purple-900/40 via-slate-900 to-slate-900 border-purple-500/30',
      textColor: 'text-purple-400',
      btnColor: 'bg-purple-600 hover:bg-purple-500 text-white',
      route: '/owner',
      features: [
        'Real-time operational dashboard & charts',
        'Staff & Instructor performance tracking',
        'Fee accounts & revenue analytics',
        'Vehicle maintenance & insurance alerts',
        'Complete immutable audit logging'
      ]
    },
    {
      role: 'staff',
      title: 'Desk & Admissions Staff',
      subtitle: 'Student Lifecycle & Daily Operations',
      badge: 'Counter Operations',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      icon: Users,
      color: 'from-blue-900/40 via-slate-900 to-slate-900 border-blue-500/30',
      textColor: 'text-blue-400',
      btnColor: 'bg-blue-600 hover:bg-blue-500 text-white',
      route: '/staff',
      features: [
        'Instant student registration (auto DS codes)',
        'Course enrollment & instructor allocation',
        'Record fee payments & print receipts',
        'Schedule driving slots & RTO test dates',
        'Verify KYC & Form 1A medical documents'
      ]
    },
    {
      role: 'instructor',
      title: 'Driver / Instructor PWA',
      subtitle: 'Mobile-First Quick Attendance Marking',
      badge: 'Core Field Feature',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: Car,
      color: 'from-emerald-900/40 via-slate-900 to-slate-900 border-emerald-500/30',
      textColor: 'text-emerald-400',
      btnColor: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      route: '/instructor',
      features: [
        'Search students by ID (e.g. DS-2026-00101)',
        'One-click atomic attendance marking',
        'Session quota enforcement (anti-duplicate)',
        'Driving performance remarks entry',
        'Daily completed class count & summary'
      ]
    },
    {
      role: 'student',
      title: 'Student Self-Service Portal',
      subtitle: 'Track Your Driving Journey & Licencing',
      badge: 'Private & Secure',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: GraduationCap,
      color: 'from-amber-900/40 via-slate-900 to-slate-900 border-amber-500/30',
      textColor: 'text-amber-400',
      btnColor: 'bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold',
      route: '/student',
      features: [
        'Session-wise progress breakdown (e.g. 13/20)',
        'Category mastery (Parking, Highway, Slopes)',
        'Fee balance & downloadable PDF receipts',
        'Live RTO status (LL Approved -> DL Test)',
        'Assigned instructor & training car info'
      ]
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800 bg-gradient-to-b from-slate-900/80 via-slate-950 to-slate-950">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-4 h-4" /> Next-Gen Driving Academy Operating System
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            The Digital Operating System for <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">Driving Schools</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
            Unify student admissions, driving lessons, 1-click instructor attendance, fee ledgers, fleet health, and RTO Learner & Driving Licence milestones in one single source of truth.
          </p>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/owner"
              onClick={() => switchRole('owner')}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-amber-500/25 flex items-center gap-2"
            >
              Launch Owner Console <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/instructor"
              onClick={() => switchRole('instructor')}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition border border-slate-700 flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" /> Instructor Attendance PWA
            </Link>
          </div>
        </div>

        {/* Live Metrics Ticker Bar */}
        <div className="max-w-6xl mx-auto mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-center gap-3 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{totalStudents}</div>
              <div className="text-xs text-slate-400">Total Students ({activeStudents} Active)</div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-center gap-3 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{attendanceRecords.length}</div>
              <div className="text-xs text-slate-400">Driving Sessions Marked</div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-center gap-3 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Car className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{availableFleet} / {totalFleet}</div>
              <div className="text-xs text-slate-400">Dual-Control Vehicles</div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex items-center gap-3 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">₹{totalCollections.toLocaleString('en-IN')}</div>
              <div className="text-xs text-slate-400">Confirmed Revenue</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Role Portals Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Four Dedicated Role Interfaces</h2>
          <p className="text-sm text-slate-400">
            Strict role-based access control (RBAC). Each actor sees only what they need to succeed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portals.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.role}
                className={`relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br ${p.color} border transition duration-300 hover:shadow-2xl hover:scale-[1.01] flex flex-col justify-between`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center ${p.textColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${p.badgeColor}`}>
                      {p.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white">{p.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{p.subtitle}</p>
                  </div>

                  <ul className="space-y-2 pt-2 border-t border-slate-800/60">
                    {p.features.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${p.textColor}`} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800/80">
                  <Link
                    href={p.route}
                    onClick={() => switchRole(p.role as any)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition ${p.btnColor}`}
                  >
                    Enter {p.title} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Core Architectural Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-10 space-y-8">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Enterprise Standards</span>
            <h2 className="text-2xl font-bold text-white mt-1">Built to Specifications for Indian Driving Academies</h2>
            <p className="text-sm text-slate-400 mt-2">
              Designed around actual ground realities: instructor mobile connectivity, cash/UPI split fee installments, and Sarathi RTO Learner & Driving Licence test pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-950/60 border border-slate-800/80 p-5 rounded-2xl space-y-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-white">Atomic 1-Click Attendance</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Prevents duplicate entries with session quota decrementing. An instructor cannot mark more than allocated sessions without owner approval.
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 p-5 rounded-2xl space-y-2">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-white">Strict Student Privacy & RLS</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Row Level Security enforces that students cannot view other learners' progress or fees. Instructors only see their own assigned cohort.
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 p-5 rounded-2xl space-y-2">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-white">RTO LL & DL Tracking</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full milestone tracking from Application Submitted to Learner Licence Issued, mandatory 30-day training window, and practical test appointment.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
