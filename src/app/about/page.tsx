'use client';

import React from 'react';
import Link from 'next/link';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { 
  ShieldCheck, 
  Award, 
  Users, 
  Car, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  FileCheck2, 
  ArrowRight,
  Sparkles,
  PhoneCall,
  Mail,
  Calendar
} from 'lucide-react';

export default function AboutPage() {
  const { school, instructors, vehicles, students } = useDrivingSchool();

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0B1728] text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Header */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#14243A] text-white border border-[#1E293B] shadow-xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/20 text-blue-300 border border-blue-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Established 2018 • Govt. RTO Authorized Institute
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              About {school.name}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              We are a premier motor driving academy dedicated to transforming beginners into confident, responsible, and defensive drivers. Operating under RTO Registration No. <span className="font-mono text-blue-400 font-bold">{school.rto_registration_no}</span>, our institute combines certified dual-control fleet training with automated session-wise digital tracking.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/admission"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/20 transition"
              >
                Enroll Today <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/courses"
                className="px-6 py-3 rounded-xl bg-[#111E32] hover:bg-[#1A2E4C] text-slate-200 border border-[#1E293B] font-semibold text-sm transition"
              >
                Explore Courses
              </Link>
            </div>
          </div>
        </div>

        {/* Operational Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { label: 'Licensed Drivers Trained', value: '2,500+', sub: 'Safe road alumni across Pune' },
            { label: 'RTO First-Attempt Pass Rate', value: '98.4%', sub: 'Alandi & Phulgaon track tests' },
            { label: 'Dual-Control Fleet', value: `${vehicles.length} Cars`, sub: 'Maruti Swift, Dzire & i10' },
            { label: 'Certified Instructors', value: `${instructors.length} Trainers`, sub: '10+ years average experience' }
          ].map((stat, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm text-center space-y-1"
            >
              <div className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400 tabular-nums">
                {stat.value}
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white pt-1">{stat.label}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Our Core Pillars */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Why Choose {school.name}?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Unlike informal driving tutors, we provide a structured, transparent, and technology-driven learning experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-7 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Dual-Control Safety Vehicles</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                All training cars are fitted with dual-control brake and clutch pedals. Your instructor has instant co-driver intervention capabilities so you can practice on live traffic roads with total confidence and zero risk.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">End-to-End RTO Licensing</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                We handle the entire official Parivahan Sarathi pipeline: document verification, medical certificate (Form 1A), Learner Licence (LL) test slot, mandatory 30-day waiting period compliance, and DL practical test track scheduling.
              </p>
            </div>

            <div className="p-7 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Atomic Digital Attendance</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                No missing classes or vague diary signatures. Instructors mark attendance digitally with category tracking (Reverse Parking, Night Driving, Highway, Test Prep). Students can view their live progress bar anytime from their phone.
              </p>
            </div>
          </div>
        </div>

        {/* Certified Instructors Showcase */}
        <div className="p-8 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-blue-600" /> RTO Certified Instructor Roster
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Government certified driving instructors with verified background checks and patient teaching methodologies
              </p>
            </div>
            <Link
              href="/contact"
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              Meet Our Team <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {instructors.map(ins => (
              <div 
                key={ins.id}
                className="p-5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-base">
                    {ins.full_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{ins.full_name}</h4>
                    <span className="text-xs font-mono text-blue-600 dark:text-blue-400">{ins.instructor_code}</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between">
                    <span>Experience:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{ins.experience_years} Years</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Assigned Fleet:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{ins.assigned_vehicle_name || 'Swift Dzire'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Learners:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">{ins.active_students_count} Students</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#14243A] text-white border border-[#1E293B] text-center space-y-4">
          <h3 className="text-2xl sm:text-3xl font-black">Ready to Start Your Driving Journey?</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Book your driving course today and experience India&apos;s most modern, safe, and transparent driving school.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link
              href="/admission"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition"
            >
              Start Admission Process
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl bg-[#111E32] hover:bg-[#1A2E4C] text-slate-200 border border-[#1E293B] font-semibold text-xs sm:text-sm transition"
            >
              Contact Admissions Desk
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
