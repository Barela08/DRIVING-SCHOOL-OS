'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { 
  BookOpen, 
  Car, 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  Filter,
  Check,
  Sparkles,
  PhoneCall
} from 'lucide-react';

export default function CoursesPage() {
  const { courses, school } = useDrivingSchool();
  const [selectedCategory, setSelectedCategory] = useState<'all' | '2W' | '4W' | 'Commercial' | 'Combo'>('all');

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses.filter(c => c.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0B1728] text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Hero Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#14243A] text-white border border-[#1E293B] shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <Car className="w-96 h-96" />
          </div>
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/20 text-blue-300 border border-blue-500/30">
              <Award className="w-3.5 h-3.5 text-blue-400" />
              Govt. RTO Certified Curriculum
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Driving Courses & Training Curriculum
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Tailored driving programs conducted in dual-control dual-brake safety vehicles by RTO-approved certified instructors. Includes complete Sarathi Parivahan Learner Licence (LL) and Driving Licence (DL) test preparation.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/admission"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/20 transition"
              >
                Apply for Admission <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="px-6 py-3 rounded-xl bg-[#111E32] hover:bg-[#1A2E4C] text-slate-200 border border-[#1E293B] font-semibold text-sm transition"
              >
                Schedule Free Demo Class
              </Link>
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5EAF1] dark:border-[#1E293B] pb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" /> Available Course Packages
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Choose from 2-wheeler, 4-wheeler, commercial vehicle, and combo packages
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-white dark:bg-[#111E32] p-1.5 rounded-2xl border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm text-xs font-semibold">
            {[
              { id: 'all', label: 'All Courses' },
              { id: '4W', label: 'Four Wheeler (4W)' },
              { id: '2W', label: 'Two Wheeler (2W)' },
              { id: 'Commercial', label: 'Commercial' },
              { id: 'Combo', label: 'Combo (2W + 4W)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl transition ${
                  selectedCategory === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map(course => {
            const totalSessions = course.templates?.reduce((sum, t) => sum + t.total_sessions, 0) || 20;

            return (
              <div
                key={course.id}
                className="rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6 sm:p-7 space-y-5">
                  {/* Category Badge & Duration */}
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                      {course.category} Certification
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" /> {course.duration_days} Days
                    </span>
                  </div>

                  {/* Course Title & Description */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                      {course.name}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {/* Price Banner */}
                  <div className="p-4 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Course Fee</span>
                      <div className="text-2xl font-black text-slate-900 dark:text-white flex items-center tabular-nums">
                        <IndianRupee className="w-5 h-5 mr-0.5" />
                        {course.price.toLocaleString('en-IN')}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-slate-500 block">Total Driving Classes</span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {totalSessions} Practical Sessions
                      </span>
                    </div>
                  </div>

                  {/* Curriculum Session Breakdown */}
                  <div className="space-y-2.5 pt-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block uppercase tracking-wider text-[11px]">
                      Session Breakdown ({course.templates?.length || 0} Modules):
                    </span>
                    <div className="space-y-1.5">
                      {course.templates?.map(t => (
                        <div
                          key={t.id}
                          className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
                        >
                          <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                            {t.session_name}
                          </span>
                          <span className="font-mono text-slate-500 font-bold text-[11px]">
                            {t.total_sessions} {t.total_sessions === 1 ? 'class' : 'classes'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features Checklist */}
                  <div className="pt-3 border-t border-[#E5EAF1] dark:border-[#1E293B] space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Dual-control safety vehicles (Maruti Swift & Dzire)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>RTO Alandi Test Track Mock Exam practice</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Complete Sarathi Parivahan LL & DL filing included</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Digital attendance & session completion tracker</span>
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="p-6 pt-0 border-t border-[#E5EAF1] dark:border-[#1E293B] bg-slate-50/50 dark:bg-slate-900/30">
                  <Link
                    href={`/admission?courseId=${course.id}`}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
                  >
                    Apply for Admission <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guarantee Banner */}
        <div className="p-8 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="space-y-2 p-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">100% Dual-Brake Safety</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Every training car is equipped with secondary dual-control pedals operated by your instructor.
            </p>
          </div>

          <div className="space-y-2 p-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">98.4% RTO First-Pass Rate</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rigorous reverse S-curve, parallel parking, and hill start simulation ensures first-attempt success.
            </p>
          </div>

          <div className="space-y-2 p-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/10 text-purple-600 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Flexible Slot Timings</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Morning (6 AM - 10 AM) and Evening (4 PM - 8 PM) batch options for working professionals and students.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
