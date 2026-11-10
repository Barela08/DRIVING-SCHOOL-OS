'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { 
  Car, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  IndianRupee, 
  Calendar, 
  Sparkles,
  Award,
  Phone,
  Clock,
  Check,
  MapPin,
  Mail,
  GraduationCap,
  Users,
  Compass,
  FileCheck2,
  PhoneCall,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

export default function HomePage() {
  const { courses, school } = useDrivingSchool();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const trainingModules = [
    {
      step: '01',
      title: 'Cockpit Drill & ABC Controls',
      description: 'Seat ergonomics, mirror adjustment, clutch bite point understanding, and accelerator-brake coordination.'
    },
    {
      step: '02',
      title: 'Closed Compound Maneuvering',
      description: 'Smooth gear progression, low-speed clutch control, steering hand-over-hand technique, and emergency stopping.'
    },
    {
      step: '03',
      title: 'City Traffic & Junction Negotiation',
      description: 'Merging into heavy traffic, roundabouts, traffic signals, safe distance maintenance, and pedestrian awareness.'
    },
    {
      step: '04',
      title: 'Reverse, Parallel & Box Parking',
      description: '3-point turns, tight reverse parking using mirrors, perpendicular garage entry, and parallel street parking.'
    },
    {
      step: '05',
      title: 'Slope Balance & Highway Speed',
      description: 'Half-clutch hill start without rollback, lane discipline at 60+ km/h, overtaking protocol, and night driving.'
    },
    {
      step: '06',
      title: 'RTO Track Mock Test & Licensing',
      description: 'Rigorous practice on simulated RTO 8-track, H-track, gradient slopes, and road sign theoretical viva.'
    }
  ];

  const safetyFeatures = [
    {
      icon: ShieldCheck,
      title: 'RTO Certified Dual-Control Fleet',
      desc: 'All training vehicles feature certified dual brake and clutch pedals on the instructor side for absolute emergency safety.'
    },
    {
      icon: Users,
      title: 'Govt. Authorized Certified Trainers',
      desc: 'Our instructors possess a minimum of 10+ years of driving pedagogy, police background verification, and patient mentorship.'
    },
    {
      icon: Calendar,
      title: 'Structured 30-Day Course Calendar',
      desc: 'Every student receives an individualized course duration plan with verified attendance tracking, ensuring zero skipped skills.'
    },
    {
      icon: Award,
      title: 'End-to-End Sarathi RTO Assistance',
      desc: 'Complete documentation for Learner Licence (LL) and Permanent Driving Licence (DL) test slot booking with our training vehicle.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0B1728] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Public Header / Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#111E32]/95 backdrop-blur-md border-b border-[#1E293B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#2563EB] to-[#3B82F6] flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <Car className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl tracking-tight text-white uppercase">
                  {school.name || 'Model Driving Academy'}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  RTO Authorized
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Operating System for Model Driving Academy
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
            <a href="#about" className="hover:text-blue-400 transition-colors">About Us</a>
            <a href="#courses" className="hover:text-blue-400 transition-colors">Courses</a>
            <a href="#training" className="hover:text-blue-400 transition-colors">Training Plan</a>
            <a href="#fleet" className="hover:text-blue-400 transition-colors">Fleet & Safety</a>
            <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition shadow-sm"
            >
              Login
            </Link>
            <Link
              href="/admission"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition shadow-lg shadow-blue-600/25 flex items-center gap-1.5"
            >
              <span>Start New Admission</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0B1728] border-b border-[#1E293B] px-4 py-6 space-y-4 animate-fadeIn">
            <nav className="flex flex-col space-y-3 text-sm font-semibold text-slate-300">
              <a 
                href="#about" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-blue-400 py-1"
              >
                About Us
              </a>
              <a 
                href="#courses" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-blue-400 py-1"
              >
                Courses
              </a>
              <a 
                href="#training" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-blue-400 py-1"
              >
                Training Plan
              </a>
              <a 
                href="#fleet" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-blue-400 py-1"
              >
                Fleet & Safety
              </a>
              <a 
                href="#contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-blue-400 py-1"
              >
                Contact
              </a>
            </nav>

            <div className="pt-4 border-t border-slate-800 flex flex-col gap-2.5">
              <Link
                href="/admission"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl text-xs font-bold text-center text-white bg-blue-600 hover:bg-blue-500 transition"
              >
                Start New Admission
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl text-xs font-bold text-center text-slate-300 bg-slate-800 hover:bg-slate-700 transition"
              >
                Login to Portal
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#111E32] via-[#0D192B] to-[#0B1728] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Glow backdrop circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Operating System for Model Driving Academy</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.15] text-white">
            Master the Road with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              Confidence & Precision
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Govt. RTO Authorized Driving Institute in Pune. Experience structured 30-day curriculum, dual-control safety fleet, certified instructors, and 100% digital student course tracking.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/admission"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black text-sm transition-all shadow-xl shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
            >
              <span>Start New Admission</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#14243A] hover:bg-[#1A2E4B] border border-slate-700 text-slate-200 font-bold text-sm transition-all shadow-md hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span>Student & Staff Login</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>

          {/* Trust KPI Strip */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-800/80 text-left">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">99.4%</div>
              <p className="text-xs text-slate-400 mt-1">First-Attempt RTO Pass Rate</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">10,000+</div>
              <p className="text-xs text-slate-400 mt-1">Licensed Confident Drivers</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">15+</div>
              <p className="text-xs text-slate-400 mt-1">Dual-Control Certified Fleet</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">100%</div>
              <p className="text-xs text-slate-400 mt-1">RTO Sarathi Compliant</p>
            </div>
          </div>
        </div>
      </section>

      {/* Academy Introduction & Features */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            Why Model Driving Academy
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Engineering Safer Roads, One Driver at a Time
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            At Model Driving Academy, driving is taught as a lifelong safety discipline rather than a quick test-passing shortcut. Our structured 30-day curriculum guarantees total mastery of vehicle mechanics, defensive driving, and tight space maneuvering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {safetyFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm hover:shadow-md transition space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Available Driving Courses */}
      <section id="courses" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#0D1726] border-y border-[#E5EAF1] dark:border-[#1E293B]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Government RTO Endorsed
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Available Driving Training Programs
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Transparent, all-inclusive pricing with complete RTO paperwork, learner licence processing, and certified instructor allocations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => {
              const isPopular = course.category === '4W';
              return (
                <div
                  key={course.id}
                  className={`rounded-3xl p-8 flex flex-col justify-between transition-all relative ${
                    isPopular
                      ? 'bg-gradient-to-b from-white to-blue-50/40 dark:from-[#111E32] dark:to-[#14243A] border-2 border-blue-500 shadow-xl'
                      : 'bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm hover:shadow-md'
                  }`}
                >
                  {isPopular && (
                    <span className="absolute -top-3.5 right-6 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-md">
                      Most Popular Course
                    </span>
                  )}

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          {course.category} Category
                        </span>
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-blue-500" />
                          {course.duration_days} Days Program
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        {course.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex items-baseline justify-between">
                      <div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">All-Inclusive Fee</span>
                        <div className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">
                          ₹{course.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        Includes RTO LL & DL
                      </span>
                    </div>

                    <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <span className="font-bold text-slate-900 dark:text-white block text-[11px] uppercase tracking-wider">
                        Program Inclusions:
                      </span>
                      <div className="space-y-2 text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{course.duration_days} Daily practical behind-the-wheel sessions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Individual dual-control training car allocation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Reverse, S-Curve & Parallel parking drills</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Sarathi online application & test date slot</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Official course completion certificate</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                    <Link
                      href={`/admission?course=${course.id}`}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition ${
                        isPopular
                          ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white'
                      }`}
                    >
                      <span>Start Admission for {course.category}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Structured Training Methodology Walkthrough */}
      <section id="training" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            Step-by-Step Road Mastery
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Structured 6-Stage Curriculum
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Every session builds upon the last. Track your daily attendance and session logs in real time on the Student Course Calendar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainingModules.map((mod) => (
            <div
              key={mod.step}
              className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-3 relative overflow-hidden"
            >
              <span className="text-3xl font-black text-blue-600/20 dark:text-blue-400/20 font-mono block">
                {mod.step}
              </span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {mod.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {mod.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Fleet & Safety Section */}
      <section id="fleet" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#14243A] via-[#111E32] to-[#0B1728] text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Fleet Excellence & Safety
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Safety Certified Dual-Control Vehicles
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every car in the Model Driving Academy fleet is certified by the regional transport office (RTO) and fitted with emergency dual-pedals. You will learn in air-conditioned comfort with modern power steering, ABS, and clean maintenance logs.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-4 rounded-2xl bg-[#0B1728]/80 border border-slate-800 space-y-1">
                <span className="font-bold text-white block text-sm">Dual Brake & Clutch</span>
                <span className="text-slate-400">Certified by Govt RTO Vehicle Inspectors</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#0B1728]/80 border border-slate-800 space-y-1">
                <span className="font-bold text-white block text-sm">Manual & Automatic</span>
                <span className="text-slate-400">Choose between 5-Speed Manual or Automatic</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#0B1728]/80 border border-slate-800 space-y-1">
                <span className="font-bold text-white block text-sm">Sanitized & Air-Conditioned</span>
                <span className="text-slate-400">Clean cabin hygiene maintained after each session</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#0B1728]/80 border border-slate-800 space-y-1">
                <span className="font-bold text-white block text-sm">Insurance & Fitness</span>
                <span className="text-slate-400">Comprehensive commercial driving school insurance</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[#0B1728] border border-slate-800 shadow-2xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <Car className="w-8 h-8 stroke-[2]" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Ready to begin your driving journey?</h3>
                <p className="text-xs text-slate-400">Complete admission online in under 2 minutes.</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant Student Code provisioning (e.g. DS-2026-00101)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Access to the Student Course Calendar and attendance tracker</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct phone access to your assigned instructor</span>
              </div>
            </div>

            <Link
              href="/admission"
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              <span>Start New Admission Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact & Location Details */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            Get in Touch
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Visit Our Main Campus or Call Us Today
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Have questions about our course durations, batch timings, or RTO procedures? Our admissions desk is open 7 days a week.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Academy Address</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Plot 42, Near RTO Circle, MG Road,<br />
              Pune, Maharashtra — 411001
            </p>
            <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 block pt-1">
              RTO Reg: MH-12/MDS/2018/042
            </span>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Direct Hotline</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Call our support coordinators directly for instant batch allotment.
            </p>
            <a
              href="tel:+919822099887"
              className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400 hover:underline block pt-1"
            >
              +91 98220 99887
            </a>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Operating Hours</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Practical driving batches run every hour from 6:00 AM to 7:00 PM.
            </p>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block pt-1">
              Mon – Sun: 6:00 AM – 8:00 PM
            </span>
          </div>
        </div>
      </section>

      {/* Public Footer */}
      <footer className="mt-auto border-t border-[#1E293B] bg-[#070E1A] text-slate-400 text-xs py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
              <Car className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-black text-sm text-white tracking-tight uppercase">
                {school.name || 'Model Driving Academy'}
              </span>
              <p className="text-[11px] text-slate-500">
                Operating System for Model Driving Academy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <a href="#about" className="hover:text-white transition">About</a>
            <a href="#courses" className="hover:text-white transition">Courses</a>
            <a href="#training" className="hover:text-white transition">Training Plan</a>
            <Link href="/admission" className="hover:text-white transition">Admission</Link>
            <Link href="/login" className="hover:text-white transition">Login</Link>
          </div>

          <div className="text-[11px] text-slate-500 text-center md:text-right">
            © 2026 Model Driving Academy. All rights reserved.<br />
            Govt. RTO Registration MH-12/MDS/2018/042
          </div>
        </div>
      </footer>
    </div>
  );
}
