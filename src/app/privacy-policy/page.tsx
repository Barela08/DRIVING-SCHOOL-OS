'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { 
  Car, 
  ShieldCheck, 
  ArrowRight, 
  FileText, 
  Lock, 
  UserCheck, 
  Database, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Menu,
  X
} from 'lucide-react';

export default function PrivacyPolicyPage() {
  const { school } = useDrivingSchool();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const policyDate = school.privacy_policy_updated_at || 'November 10, 2026';

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0B1728] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Public Header / Navigation Bar (NO LOGIN LINK) */}
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
            <Link href="/#courses" className="hover:text-blue-400 transition-colors">Courses</Link>
            <Link href="/#about" className="hover:text-blue-400 transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link>
            <Link href="/privacy-policy" className="text-blue-400 font-bold transition-colors">Privacy Policy</Link>
          </nav>

          {/* Primary Action Button (Start New Admission ONLY) */}
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
              <Link 
                href="/#courses" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-blue-400 py-1"
              >
                Courses
              </Link>
              <Link 
                href="/#about" 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-blue-400 py-1"
              >
                About Us
              </Link>
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
                className="text-blue-400 font-bold py-1"
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

      {/* Main Privacy Policy Content */}
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-10">
        {/* Hero Header */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#14243A] text-white border border-[#1E293B] shadow-xl relative overflow-hidden space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/20 text-blue-300 border border-blue-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            Official Privacy & Data Protection Policy
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
            Privacy Policy — {school.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            This Privacy Policy explains how {school.name} collects, manages, uses, and protects personal, educational, and licensing information for students, applicants, and guardians.
          </p>
          <div className="flex items-center gap-2 pt-2 text-xs text-slate-400 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Policy Effective Date: {policyDate}</span>
          </div>
        </div>

        {/* Custom Policy Content if configured by Owner, otherwise verified default text */}
        {school.privacy_policy ? (
          <div className="bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl p-8 sm:p-10 shadow-sm space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
            {school.privacy_policy}
          </div>
        ) : (
          <div className="bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl p-8 sm:p-12 shadow-sm space-y-10 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            
            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                1. Overview & Commitment to Student Privacy
              </h2>
              <p>
                {school.name} ("the Academy", "we", "our") operates a government-authorized motor driving school institute. We are dedicated to respecting and safeguarding the personal privacy of all learners, applicants, and visitors. While no digital infrastructure can claim absolute or 100% impenetrable security, we implement disciplined administrative, technical, and operational practices to protect the integrity and confidentiality of your records.
              </p>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                2. Information Collected During Admission
              </h2>
              <p>When you submit an admission request or register for a driving course, we collect:</p>
              <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm">
                <li><strong className="text-slate-900 dark:text-white">Personal Identification:</strong> Full legal name, date of birth, gender, blood group.</li>
                <li><strong className="text-slate-900 dark:text-white">Contact Information:</strong> Active mobile telephone number, email address, residential and mailing address, postal PIN code.</li>
                <li><strong className="text-slate-900 dark:text-white">Emergency Contacts:</strong> Nominated parent, guardian, or next of kin name, relationship, and emergency telephone number.</li>
                <li><strong className="text-slate-900 dark:text-white">Course Preferences:</strong> Enrolled vehicle category (2-Wheeler MCWG, 4-Wheeler LMV, Commercial), batch timing, and assigned instructor.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                3. Identity and Licence Verification Documents
              </h2>
              <p>
                Under Motor Vehicles Rules and Regional Transport Office (RTO) documentation requirements, we process government-issued documents solely for KYC, medical fitness validation, and driving test scheduling:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm">
                <li>Aadhaar card or government address proof.</li>
                <li>Form 1A medical fitness certificate signed by a registered medical practitioner (where mandated).</li>
                <li>Learner Licence (LL) application reference numbers, issue dates, and expiry dates.</li>
                <li>Passport-sized photographs for identity verification on counter attendance logs.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                4. Attendance and Course Progress Data
              </h2>
              <p>
                To certify practical competencies and satisfy course duration minimums, we maintain:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm">
                <li>Daily practical class attendance records certified by instructors.</li>
                <li>Curriculum topic progress (e.g. cockpit drill, slope start, reverse parking, highway speed control).</li>
                <li>Training vehicle registration numbers and instructor session assessments.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                5. Fee and Payment Records
              </h2>
              <p>
                We maintain an electronic financial ledger of agreed course fees, installment payments, transaction reference IDs (UPI, Bank Transfer, Card, Cash), and issued official academy receipts. We do not store sensitive payment card details or net banking credentials.
              </p>
            </section>

            {/* Section 6 */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                6. Purpose and Use of Collected Information
              </h2>
              <p>Your information is used strictly to:</p>
              <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm">
                <li>Manage student admissions, batch allocation, and instructor scheduling.</li>
                <li>Track course duration and generate authenticated attendance records.</li>
                <li>Assist in filing applications on the official Ministry of Road Transport and Highways (MoRTH) Parivahan Sarathi portal for Learner and Driving Licences.</li>
                <li>Communicate class cancellations, batch reminders, or RTO test date confirmations.</li>
                <li>Provide official course completion certificates with verifiable credentials.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                7. Role-Based Access Restrictions
              </h2>
              <p>
                Access to student information is strictly segregated based on need-to-know administrative roles:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm">
                <li><strong className="text-slate-900 dark:text-white">Students:</strong> Have private access strictly limited to their own attendance, schedule, fee ledger, and documents. Students cannot access another learner's records.</li>
                <li><strong className="text-slate-900 dark:text-white">Instructors:</strong> Can view only active students allocated to their training batches for the purpose of taking attendance and recording session notes.</li>
                <li><strong className="text-slate-900 dark:text-white">Staff:</strong> Authorized counter personnel process admissions, fees, and RTO test scheduling within assigned permissions.</li>
                <li><strong className="text-slate-900 dark:text-white">Owner / Administrator:</strong> Has operational oversight and manages academy-wide settings.</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                8. Data Sharing and Third-Party Services
              </h2>
              <p>
                {school.name} does not sell, rent, or trade student personal information with advertisers or marketing brokers. We share data solely when necessary:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm">
                <li><strong className="text-slate-900 dark:text-white">Government RTO Authorities:</strong> When filing required Form 5 / Form 14 driving school certificates and test appointment schedules with the relevant Regional Transport Office.</li>
                <li><strong className="text-slate-900 dark:text-white">External Maps:</strong> Our public website links to Google Maps to help visitors find our physical campus and driving ground. Please review Google's privacy policy when utilizing their navigation tools.</li>
                <li><strong className="text-slate-900 dark:text-white">Legal Mandate:</strong> When compelled by lawful court order, police verification request, or statutory transport authority inspection.</li>
              </ul>
            </section>

            {/* Section 9 */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                9. Data Retention and Deletion Request Process
              </h2>
              <p>
                Under state transport regulations, motor driving schools are required to preserve attendance registers and enrollment records for a statutory retention period. Once this statutory period has lapsed, or upon formal course completion, students may submit a written data deletion or anonymization request to the academy management. We will review and honor requests in compliance with applicable transport laws.
              </p>
            </section>

            {/* Section 10 */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                10. Privacy Inquiries & Grievance Contact
              </h2>
              <p>
                For questions, clarifications, or requests concerning this Privacy Policy, please contact our admissions desk:
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs">
                <div><strong className="text-slate-900 dark:text-white">{school.name}</strong></div>
                <div>{school.address.street}, {school.address.city}, {school.address.state} — {school.address.pincode}</div>
                <div>Telephone: <a href={`tel:${school.contact_phone}`} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">{school.contact_phone}</a></div>
                <div>Email: <a href={`mailto:${school.contact_email}`} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">{school.contact_email}</a></div>
              </div>
            </section>

          </div>
        )}

        {/* Bottom CTA to Admission */}
        <div className="p-8 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm text-center space-y-4">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            Ready to Enroll at {school.name}?
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Experience structured 30-day driving education with verified attendance and complete licensing assistance.
          </p>
          <Link
            href="/admission"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition"
          >
            <span>Start New Admission</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

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
            <Link href="/#courses" className="hover:text-white transition">Courses</Link>
            <Link href="/#about" className="hover:text-white transition">About Us</Link>
            <Link href="/contact" className="hover:text-white transition">Contact</Link>
            <Link href="/privacy-policy" className="text-blue-400 font-bold transition">Privacy Policy</Link>
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
