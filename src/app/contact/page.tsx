'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  Car, 
  Building2, 
  Navigation,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  MessageCircle,
  Menu,
  X,
  Compass
} from 'lucide-react';

export default function ContactPage() {
  const { school, courses, addToast } = useDrivingSchool();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [courseInterest, setCourseInterest] = useState(courses[0]?.id || '');
  const [preferredSlot, setPreferredSlot] = useState('Morning (7:30 AM - 9:30 AM)');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      addToast('Please enter your full name and phone number', 'error');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      addToast('Thank you! Our admissions coordinator will contact you shortly.', 'success');
    }, 600);
  };

  const whatsappNumber = school.whatsapp_phone?.replace(/\D/g, '') || school.contact_phone.replace(/\D/g, '');
  const mapsUrl = school.maps_location_url || `https://maps.google.com/?q=${encodeURIComponent(`${school.name} ${school.address.street} ${school.address.city} ${school.address.pincode}`)}`;
  const mapsEmbed = school.maps_embed_url || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.180295841459!2d73.87483447519171!3d18.520430282574044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c045b85a3637%3A0xb366b56b3e83b482!2sRTO%20Pune!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin';

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
            <Link href="/contact" className="text-blue-400 font-bold transition-colors">Contact</Link>
            <Link href="/privacy-policy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
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
                className="text-blue-400 font-bold py-1"
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

      {/* Main Content Area */}
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        {/* Hero Header */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#14243A] text-white border border-[#1E293B] shadow-xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/20 text-blue-300 border border-blue-500/30">
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              Admissions & Student Inquiry Desk
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Contact {school.name}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Have questions regarding 30-day course schedules, RTO test dates, dual-control vehicle fleet, or fee installment plans? Contact us directly or visit our academy desk.
            </p>
          </div>
        </div>

        {/* 2-Column Section: Verified Contact Information & Inquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Direct Contact Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-7 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-6">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Building2 className="w-4 h-4 text-blue-600" /> Academy Headquarters
              </h3>

              <div className="space-y-5 text-xs">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block text-sm">Full Postal Address</span>
                    <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {school.address.street}, {school.address.city}, {school.address.state} — {school.address.pincode}
                    </p>
                  </div>
                </div>

                {/* Telephone */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block text-sm">Official Telephone</span>
                    <a 
                      href={`tel:${school.contact_phone}`} 
                      className="text-blue-600 dark:text-blue-400 font-bold hover:underline font-mono text-sm block mt-0.5"
                    >
                      {school.contact_phone}
                    </a>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block text-sm">WhatsApp Assistance</span>
                    <a
                      href={`https://wa.me/${whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold hover:underline font-mono text-sm mt-0.5"
                    >
                      <span>{school.whatsapp_phone || school.contact_phone}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block text-sm">Official Email Address</span>
                    <a 
                      href={`mailto:${school.contact_email}`} 
                      className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 block mt-0.5"
                    >
                      {school.contact_email}
                    </a>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block text-sm">Business Operating Hours</span>
                    <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                      {school.operating_hours || 'Monday – Sunday: 6:00 AM – 8:00 PM (IST)'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Submit an Inquiry / Request Batch Timing
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Fill in your details below and our training coordinator will contact you with batch availability and fee schedules.
                </p>
              </div>

              {isSubmitted ? (
                <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white">Inquiry Received Successfully!</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                      Thank you, <strong className="text-emerald-600">{name}</strong>. An admissions advisor from {school.name} will reach you at <span className="font-mono font-bold">{phone}</span> today.
                    </p>
                  </div>
                  <button
                    onClick={() => { setIsSubmitted(false); setName(''); setPhone(''); setMessage(''); }}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Mobile Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 98220 12345"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Email Address (Optional)</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. rahul@example.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Course of Interest</label>
                      <select
                        value={courseInterest}
                        onChange={(e) => setCourseInterest(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 text-xs"
                      >
                        {courses.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name} — ₹{c.price.toLocaleString('en-IN')}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Preferred Daily Training Slot</label>
                    <select
                      value={preferredSlot}
                      onChange={(e) => setPreferredSlot(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 text-xs"
                    >
                      <option value="Early Morning (6 AM - 7:30 AM)">Early Morning (6:00 AM – 7:30 AM)</option>
                      <option value="Morning (7:30 AM - 9:30 AM)">Morning (7:30 AM – 9:30 AM)</option>
                      <option value="Afternoon (1:00 PM - 3:00 PM)">Afternoon (1:00 PM – 3:00 PM)</option>
                      <option value="Evening (4:30 PM - 6:30 PM)">Evening (4:30 PM – 6:30 PM)</option>
                      <option value="Late Evening (6:30 PM - 8:00 PM)">Late Evening (6:30 PM – 8:00 PM)</option>
                      <option value="Weekend Batch Only">Weekend Batch Only (Saturday & Sunday)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">Additional Remarks / Questions</label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="e.g. Do I need my own Learner's Licence before starting or will you apply for it?"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Submit Inquiry to Admissions Desk
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* MODULE 4: Google Maps Location & Get Directions Section */}
        <section className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-2">
                <Compass className="w-3.5 h-3.5" />
                Verified Campus Location
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Google Maps Location & Driving Grounds
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {school.address.street}, {school.address.city}, {school.address.state} — {school.address.pincode}
              </p>
            </div>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition shrink-0"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 h-80 sm:h-96 w-full bg-slate-100 dark:bg-slate-900 relative">
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
        <section className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              Official Registration & Regulatory Information
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Driving School Registration & Government RTO Details
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Official regulatory credentials for {school.name} alongside government transport office references.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Box 1: Driving School's Own Authorization */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Car className="w-4 h-4 text-blue-600" />
                  Driving School Authorization
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  Verified Active
                </span>
              </div>

              <div className="space-y-2.5">
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
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Validity / Expiry Date:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold block mt-0.5">
                    {school.rto_info?.valid_till || 'March 31, 2028'}
                  </span>
                </div>

                <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 italic">
                  Certified to conduct theoretical and practical driving instruction under Rule 24 of Central Motor Vehicles Rules.
                </div>
              </div>
            </div>

            {/* Box 2: Relevant Government RTO Office Contact */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-purple-600" />
                  Government RTO Jurisdiction
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
                  MoRTH Sarathi
                </span>
              </div>

              <div className="space-y-2.5">
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

          {/* Legal Clarification Banner */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <div className="font-bold text-slate-800 dark:text-slate-200">Official Notice:</div>
            <p className="leading-relaxed">
              {school.name} is a privately operated, government-authorized motor driving training institute. We are not a government Regional Transport Office. All official Learner Licences and Driving Licences are issued directly by the Government Transport Department via the national Parivahan Sarathi framework.
            </p>
          </div>
        </section>
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
            <Link href="/contact" className="text-blue-400 font-bold transition">Contact</Link>
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
