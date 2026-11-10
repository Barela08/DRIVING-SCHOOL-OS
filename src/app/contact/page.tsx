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
  MessageSquare, 
  CheckCircle2, 
  Car, 
  Calendar,
  Building2,
  Navigation
} from 'lucide-react';

export default function ContactPage() {
  const { school, branches, courses, addToast } = useDrivingSchool();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [courseInterest, setCourseInterest] = useState(courses[0]?.id || '');
  const [preferredSlot, setPreferredSlot] = useState('Morning (7 AM - 9 AM)');
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
      addToast('Thank you! Our admissions desk will call you within 2 business hours.', 'success');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0B1728] text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Hero */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#14243A] text-white border border-[#1E293B] shadow-xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/20 text-blue-300 border border-blue-500/30">
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              Admissions & RTO Support Desk
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Get in Touch with {school.name}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Have questions regarding course schedules, RTO test slots, dual-control car fleet, or fee installment plans? Reach out directly or visit our academy desk.
            </p>
          </div>
        </div>

        {/* 2-Column Section: Contact Information & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Direct Contact Info & Branches (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-7 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-6">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" /> Academy Headquarters
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Main Campus & Driving Track</span>
                    <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {school.address.street}, {school.address.city}, {school.address.state} — {school.address.pincode}
                    </p>
                    <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 block mt-1">
                      Govt. RTO License: {school.rto_registration_no}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Admissions Telephone</span>
                    <a href={`tel:${school.contact_phone}`} className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                      {school.contact_phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-600/10 text-purple-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Official Email</span>
                    <a href={`mailto:${school.contact_email}`} className="text-slate-600 dark:text-slate-300 hover:text-blue-600">
                      {school.contact_email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">Training Hours</span>
                    <p className="text-slate-600 dark:text-slate-400">Monday – Sunday: 6:00 AM – 8:00 PM (IST)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Branch Locations */}
            <div className="p-7 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Navigation className="w-4 h-4 text-blue-600" /> Training Centers & Simulator Hubs
              </h3>

              <div className="space-y-3">
                {branches.map(br => (
                  <div
                    key={br.id}
                    className="p-3.5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{br.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-600/10 text-blue-600">
                        {br.code}
                      </span>
                    </div>
                    <p className="text-slate-500">{br.phone} • Dual-control test track & computer simulator</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Inquiry Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Send an Inquiry / Request Demo Slot
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Fill in your details below and our training coordinator will contact you with batch availability and fee structure.
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
      </div>
    </div>
  );
}
