'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { 
  UserPlus, 
  Car, 
  IndianRupee, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  Phone, 
  Mail, 
  ShieldCheck, 
  FileCheck2, 
  Sparkles,
  Printer,
  Copy,
  Check
} from 'lucide-react';
import { ReceiptModal } from '@/components/ReceiptModal';
import { LLRegistrationFields, LLRegistrationData } from '@/components/licence/LLRegistrationFields';
import confetti from 'canvas-confetti';

export default function AdmissionPage() {
  const { courses, instructors, vehicles, addStudent, addToast, school } = useDrivingSchool();

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('2004-05-15');
  const [gender, setGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [city, setCity] = useState('Pune');
  const [area, setArea] = useState('Kothrud');
  const [pincode, setPincode] = useState('411038');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState('Parent');

  // Course & Financials
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
  const [selectedInstructorId, setSelectedInstructorId] = useState(instructors[0]?.id || '');
  const [selectedVehicleId, setSelectedVehicleId] = useState(vehicles[0]?.id || '');
  
  const currentCourse = courses.find(c => c.id === selectedCourseId) || courses[0];
  const [agreedFee, setAgreedFee] = useState(currentCourse?.price || 8500);
  const [downPayment, setDownPayment] = useState(5000);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Cash' | 'Bank Transfer'>('UPI');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [admissionSuccess, setAdmissionSuccess] = useState<{
    studentCode: string;
    studentName: string;
    courseName: string;
    agreedFee: number;
    initialPaid: number;
  } | null>(null);

  const [copiedCode, setCopiedCode] = useState(false);

  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId);
    const crs = courses.find(c => c.id === courseId);
    if (crs) {
      setAgreedFee(crs.price);
      setDownPayment(Math.min(5000, crs.price));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !phone) {
      addToast('Please enter full name and phone number', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await addStudent({
        fullName,
        phone,
        email: email || undefined,
        courseId: selectedCourseId,
        instructorId: selectedInstructorId,
        vehicleId: selectedVehicleId,
        agreedFee: Number(agreedFee),
        initialPayment: Number(downPayment),
        paymentMethod,
        gender,
        dateOfBirth,
        address: { city, area, pincode }
      });

      if (res.success) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });

        setAdmissionSuccess({
          studentCode: res.studentCode,
          studentName: fullName,
          courseName: currentCourse.name,
          agreedFee: Number(agreedFee),
          initialPaid: Number(downPayment)
        });

        addToast(res.message, 'success');
      }
    } catch (err: any) {
      addToast(err?.message || 'Admission registration failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyCodeToClipboard = () => {
    if (admissionSuccess?.studentCode) {
      navigator.clipboard.writeText(admissionSuccess.studentCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0B1728] text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="p-8 rounded-3xl bg-[#14243A] text-white border border-[#1E293B] shadow-xl relative overflow-hidden">
          <div className="max-w-2xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-600/20 text-blue-300 border border-blue-500/30">
              <UserPlus className="w-3.5 h-3.5 text-blue-400" />
              Official Online Admission Desk
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Student Admission & Course Enrollment
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Register with {school.name}. Your unique student identification code (e.g. <span className="font-mono text-blue-400 font-bold">DS-2026-00101</span>) will be instantly provisioned, enabling one-click digital attendance, progress tracking, and RTO test scheduling.
            </p>
          </div>
        </div>

        {/* Success Card or Registration Form */}
        {admissionSuccess ? (
          <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-xl space-y-6 text-center">
            <div className="w-20 h-20 rounded-3xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                ADMISSION CONFIRMED
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Welcome to {school.name}, {admissionSuccess.studentName}!
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                Your admission has been permanently recorded in the database. Use your Student ID below to log in to the Student Portal and track your driving classes.
              </p>
            </div>

            {/* Serialized Student ID Display Box */}
            <div className="max-w-md mx-auto p-5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border-2 border-blue-600/40 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Official Serialized Student Identification Code
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl font-black font-mono text-blue-600 dark:text-blue-400 tracking-wider">
                  {admissionSuccess.studentCode}
                </span>
                <button
                  onClick={copyCodeToClipboard}
                  className="p-2 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 transition"
                  title="Copy Student ID"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-[10px] text-slate-500 block">
                Save this code. Your driving instructor will scan or search this ID before every practical lesson.
              </span>
            </div>

            {/* Enrollment Summary */}
            <div className="max-w-md mx-auto grid grid-cols-2 gap-3 text-left text-xs p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-[#E5EAF1] dark:border-[#1E293B]">
              <div>
                <span className="text-slate-500 block">Enrolled Course:</span>
                <strong className="text-slate-900 dark:text-white block mt-0.5">{admissionSuccess.courseName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Course Fee:</span>
                <strong className="text-slate-900 dark:text-white block mt-0.5">₹{admissionSuccess.agreedFee.toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Initial Downpayment:</span>
                <strong className="text-emerald-600 dark:text-emerald-400 block mt-0.5">₹{admissionSuccess.initialPaid.toLocaleString('en-IN')}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Pending Balance:</span>
                <strong className="text-amber-500 block mt-0.5">
                  ₹{(admissionSuccess.agreedFee - admissionSuccess.initialPaid).toLocaleString('en-IN')}
                </strong>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/student"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/20 transition"
              >
                Go to Student Portal <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => window.print()}
                className="px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 border border-[#E5EAF1] dark:border-[#1E293B] font-semibold text-xs sm:text-sm flex items-center gap-2 transition"
              >
                <Printer className="w-4 h-4" /> Print Admission Card
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-8">
            {/* 1. Personal Information */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#E5EAF1] dark:border-[#1E293B] flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-blue-600" /> 1. Personal & Contact Details
                </h3>
                <span className="text-xs text-slate-400 font-medium">* Required for RTO Sarathi KYC</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Student Full Name (as on Aadhaar) *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Ramesh Sharma"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Registered Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 98220 12345"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. rahul@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Area / Locality</label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 2. Course Selection & Allocations */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#E5EAF1] dark:border-[#1E293B]">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Car className="w-4 h-4 text-blue-600" /> 2. Course Program & Training Allocation
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Select Driving Course *</label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => handleCourseChange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 font-semibold"
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.category}) — ₹{c.price.toLocaleString('en-IN')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Assigned Driving Instructor</label>
                  <select
                    value={selectedInstructorId}
                    onChange={(e) => setSelectedInstructorId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white"
                  >
                    {instructors.map(i => (
                      <option key={i.id} value={i.id}>
                        {i.full_name} ({i.instructor_code}) — {i.experience_years} yrs exp
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Assigned Dual-Control Car</label>
                  <select
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white font-mono"
                  >
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.brand} {v.model} ({v.registration_number})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Course Module Preview */}
              <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-2 text-xs">
                <span className="font-bold text-blue-900 dark:text-blue-300 block">
                  Curriculum Allocated for {currentCourse.name}:
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentCourse.templates?.map(t => (
                    <span
                      key={t.id}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#111E32] border border-blue-200 dark:border-blue-800 text-[11px] font-medium text-slate-700 dark:text-slate-300"
                    >
                      {t.session_name}: <strong>{t.total_sessions} classes</strong>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Fee & Payment Entry */}
            <div className="space-y-4">
              <div className="pb-2 border-b border-[#E5EAF1] dark:border-[#1E293B]">
                <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-blue-600" /> 3. Fee Agreement & Initial Payment
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Total Agreed Course Fee (₹) *</label>
                  <input
                    type="number"
                    required
                    value={agreedFee}
                    onChange={(e) => setAgreedFee(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Initial Down Payment (₹)</label>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Payment Mode</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white font-semibold"
                  >
                    <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                    <option value="Cash">Cash at Counter</option>
                    <option value="Bank Transfer">Bank Transfer / NEFT</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submission Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Generating Student ID & Enrolling...</span>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" /> Complete Student Admission & Generate Student ID
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
