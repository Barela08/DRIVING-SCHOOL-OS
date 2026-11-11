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
  ExternalLink,
  Navigation,
  Building2,
  MessageCircle
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

  const whatsappNumber = school.whatsapp_phone?.replace(/\D/g, '') || school.contact_phone.replace(/\D/g, '');
  const mapsUrl = school.maps_location_url || `https://maps.google.com/?q=${encodeURIComponent(`${school.name} ${school.address.street} ${school.address.city} ${school.address.pincode}`)}`;
  const mapsEmbed = school.maps_embed_url || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.180295841459!2d73.87483447519171!3d18.520430282574044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c045b85a3637%3A0xb366b56b3e83b482!2sRTO%20Pune!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin';

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0B1728] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* MODULE 2: Public Navigation (NO LOGIN BUTTON/LINK) */}
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
            <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
            <a href="#courses" className="hover:text-blue-400 transition-colors">Courses</a>
            <a href="#about" className="hover:text-blue-400 transition-colors">About Us</a>
            <Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link>
            <Link href="/privacy-policy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
          </nav>

          {/* Primary Action Button (Start New Admission ONLY — NO LOGIN) */}
          <div className="hidden sm:flex items-center gap-3">
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
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0B1728] border-b border-[#1E293B] px-4 py-6 space-y-4 animate-fadeIn">
            <nav className="flex flex-col space-y-3 text-sm font-semibold text-slate-300">
              <Link 
                href="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-blue-400 py-1"
              >
                Home
              </Link>
              <a 
                href="#courses" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-blue-400 py-1"
              >
                Courses
              </a>
              <a 
                href="#about" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-blue-400 py-1"
              >
                About Us
              </a>
              <Link 
                href="/contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-blue-400 py-1"
              >
                Contact
              </Link>
              <Link 
                href="/privacy-policy" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-blue-400 py-1"
              >
                Privacy Policy
              </Link>
            </nav>

            <div className="pt-4 border-t border-slate-800">
              <Link
                href="/admission"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl text-xs font-bold text-center text-white bg-blue-600 hover:bg-blue-500 transition block"
              >
                Start New Admission
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* MODULE 1: Hero Section (Only one primary admission action: START NEW ADMISSION) */}
      <section className="relative bg-gradient-to-b from-[#111E32] via-[#0D192B] to-[#0B1728] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Glow backdrop circle */}
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

          {/* Primary Action Button (Only START NEW ADMISSION — NO LOGIN BUTTON) */}
          <div className="flex items-center justify-center pt-2">
            <Link
              href="/admission"
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-black text-sm transition-all shadow-xl shadow-blue-600/30 hover:shadow-blue-600/40 hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
            >
              <span>Start New Admission</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                        Includes RTO Documentation
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
            Every session builds upon the last, progressively turning beginners into confident, licensed highway drivers.
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
              Every car in the Model Driving Academy fleet is certified by the regional transport office (RTO) and fitted with emergency dual-pedals. Learn in air-conditioned comfort with modern power steering, ABS, and clean maintenance logs.
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
                <span>Verified attendance and course progress tracking</span>
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

      {/* MODULE 4: Google Maps Location & Campus Address Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <Compass className="w-3.5 h-3.5" />
              Campus Location & Directions
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Visit Model Driving Academy
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {school.address.street}, {school.address.city}, {school.address.state} — {school.address.pincode}
            </p>
          </div>

          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition shrink-0"
          >
            <Navigation className="w-4 h-4" />
            <span>Get Directions on Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
        </div>

        {/* Embedded Interactive Map */}
        <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 h-80 sm:h-96 w-full bg-slate-100 dark:bg-slate-900 relative shadow-sm">
          <iframe
            title={`${school.name} Google Maps Location`}
            src={mapsEmbed}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
          />
        </div>
      </section>

      {/* MODULE 5: RTO and Driving School Official Information */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#0D1726] border-y border-[#E5EAF1] dark:border-[#1E293B]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Regulatory Credentials
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Official Driving School & Government RTO Information
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Transparent, verified licensing records for {school.name} alongside regional transport office jurisdiction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Box 1: Driving School Authorization */}
            <div className="p-7 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Car className="w-4 h-4 text-blue-600" />
                  Driving School Authorization
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  Verified Active
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">School Registration Number:</span>
                  <strong className="text-slate-900 dark:text-white font-mono text-sm block mt-0.5">
                    {school.rto_info?.registration_number || school.rto_registration_no || 'MH-12/MDS/2018/042'}
                  </strong>
                </div>

                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Issuing Authority:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold block mt-0.5">
                    {school.rto_info?.issuing_authority || 'Regional Transport Officer (RTO), Pune Division'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Authorization Validity:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold block mt-0.5">
                    Valid till {school.rto_info?.valid_till || 'March 31, 2028'}
                  </span>
                </div>

                <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                  Govt. authorized under Motor Vehicles Rules for theoretical road safety instruction and dual-control vehicle practical training.
                </div>
              </div>
            </div>

            {/* Box 2: Relevant Government RTO Information */}
            <div className="p-7 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-600" />
                  Government RTO Jurisdiction
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                  MoRTH Sarathi
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Applicable RTO Division:</span>
                  <strong className="text-slate-900 dark:text-white font-mono text-sm block mt-0.5">
                    {school.rto_info?.rto_name || 'Pune RTO (MH-12)'}
                  </strong>
                </div>

                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">RTO Office Address:</span>
                  <span className="text-slate-800 dark:text-slate-200 block mt-0.5 leading-relaxed">
                    {school.rto_info?.rto_office_address || 'Regional Transport Office, Near Sangam Bridge, Pune, Maharashtra 411001'}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Official National Portal:</span>
                  <a
                    href="https://parivahan.gov.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold hover:underline mt-0.5"
                  >
                    <span>parivahan.gov.in (Sarathi)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Notice */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#111E32] border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-200">Regulatory Disclaimer:</span>
            <p className="leading-relaxed">
              {school.name} is an authorized private driving institute providing classroom and cockpit driving instruction. We are not a government RTO office. All official Learner Licences and Driving Licences are issued exclusively by the Government Transport Department via the official Parivahan Sarathi framework.
            </p>
          </div>
        </div>
      </section>

      {/* MODULE 3: Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            Get in Touch
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Official Academy Contact Information
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Have questions regarding batch timings, course fees, or RTO procedures? Our admissions desk is open 7 days a week.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Postal Address</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {school.address.street},<br />
              {school.address.city}, {school.address.state} — {school.address.pincode}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Official Telephone</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Direct line to admissions coordinator.
            </p>
            <a
              href={`tel:${school.contact_phone}`}
              className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400 hover:underline block pt-1"
            >
              {school.contact_phone}
            </a>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">WhatsApp Desk</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Instant batch timing and slot availability.
            </p>
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-black font-mono text-emerald-600 dark:text-emerald-400 hover:underline pt-1"
            >
              <span>{school.whatsapp_phone || school.contact_phone}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Business Hours</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {school.operating_hours || 'Monday – Sunday: 6:00 AM – 8:00 PM'}
            </p>
          </div>
        </div>
      </section>

      {/* Public Footer (NO LOGIN LINK) */}
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
            <Link href="/" className="hover:text-white transition">Home</Link>
            <a href="#courses" className="hover:text-white transition">Courses</a>
            <a href="#about" className="hover:text-white transition">About Us</a>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
            <Link href="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="/admission" className="hover:text-white transition font-semibold text-white">Start New Admission</Link>
          </div>

          <div className="text-[11px] text-slate-500 text-center md:text-right">
            © 2026 {school.name}. All rights reserved.<br />
            Govt. RTO Registration {school.rto_registration_no}
          </div>
        </div>
      </footer>
    </div>
  );
}
