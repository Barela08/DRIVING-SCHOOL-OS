'use client';

import React, { useState } from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { 
  Users, 
  UserPlus, 
  IndianRupee, 
  Calendar, 
  FileCheck2, 
  Search, 
  CheckCircle2, 
  Clock, 
  Car, 
  Plus, 
  Printer, 
  ChevronRight,
  Filter,
  AlertCircle
} from 'lucide-react';
import { ReceiptModal } from '@/components/ReceiptModal';
import { Payment, Student } from '@/types';

export default function StaffDashboard() {
  const { 
    school, 
    students, 
    courses, 
    instructors, 
    vehicles, 
    enrollments, 
    payments, 
    licenceRecords, 
    schedules,
    addStudent, 
    addPayment, 
    confirmPayment, 
    updateLicenceStatus, 
    addSchedule 
  } = useDrivingSchool();

  const [activeTab, setActiveTab] = useState<'admissions' | 'payments' | 'licences' | 'schedules'>('admissions');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);

  // Admission form state
  const [admName, setAdmName] = useState('');
  const [admPhone, setAdmPhone] = useState('');
  const [admEmail, setAdmEmail] = useState('');
  const [admCourseId, setAdmCourseId] = useState(courses[0]?.id || '');
  const [admInstructorId, setAdmInstructorId] = useState(instructors[0]?.id || '');
  const [admVehicleId, setAdmVehicleId] = useState(vehicles[0]?.id || '');
  const [admFee, setAdmFee] = useState(courses[0]?.price || 8500);
  const [admDownPayment, setAdmDownPayment] = useState(5000);
  const [admPaymentMethod, setAdmPaymentMethod] = useState<'UPI' | 'Cash' | 'Bank Transfer'>('UPI');
  const [isSubmittingAdm, setIsSubmittingAdm] = useState(false);
  const [admAlert, setAdmAlert] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Payment form state
  const [payEnrollmentId, setPayEnrollmentId] = useState(enrollments[0]?.id || '');
  const [payAmount, setPayAmount] = useState<number>(3500);
  const [payMethod, setPayMethod] = useState<'UPI' | 'Cash' | 'Bank Transfer' | 'Card'>('UPI');
  const [payRef, setPayRef] = useState('');
  const [payNotes, setPayNotes] = useState('');
  const [isSubmittingPay, setIsSubmittingPay] = useState(false);

  // Licence update state
  const [selectedLicStudentId, setSelectedLicStudentId] = useState<string | null>(null);
  const [newLicStatus, setNewLicStatus] = useState<any>('DL Test Scheduled');
  const [newTestDate, setNewTestDate] = useState('2026-11-28');

  // Submit Admission
  const handleAdmissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingAdm(true);
    setAdmAlert(null);

    try {
      const res = await addStudent({
        fullName: admName,
        phone: admPhone,
        email: admEmail,
        courseId: admCourseId,
        instructorId: admInstructorId,
        vehicleId: admVehicleId,
        agreedFee: Number(admFee),
        initialPayment: Number(admDownPayment),
        paymentMethod: admPaymentMethod
      });

      if (res.success) {
        setAdmAlert({ type: 'success', text: res.message });
        setAdmName('');
        setAdmPhone('');
        setAdmEmail('');
        setTimeout(() => {
          setShowAdmissionModal(false);
          setAdmAlert(null);
        }, 1200);
      }
    } catch (err: any) {
      setAdmAlert({ type: 'error', text: err.message || 'Error creating student' });
    } finally {
      setIsSubmittingAdm(false);
    }
  };

  // Submit Payment
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPay(true);

    try {
      const res = await addPayment({
        enrollmentId: payEnrollmentId,
        amount: Number(payAmount),
        paymentMethod: payMethod,
        transactionReference: payRef.trim() || undefined,
        notes: payNotes.trim() || undefined
      });

      if (res.success) {
        alert(res.message);
        setShowPaymentModal(false);
        setPayNotes('');
        setPayRef('');
      }
    } catch (err: any) {
      alert(err.message || 'Error recording payment');
    } finally {
      setIsSubmittingPay(false);
    }
  };

  // Filter students
  const filteredStudents = students.filter(s => 
    s.student_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.phone.includes(searchQuery)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Staff Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-slate-900 border border-blue-500/30 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white">Desk Staff & Admissions Operations</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              Staff Portal
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Student Admissions • Fee Collection & Receipts • RTO Licence Records • Driving Schedules
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAdmissionModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold text-xs transition shadow-lg shadow-blue-500/20 flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> New Student Admission
          </button>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-bold text-xs transition flex items-center gap-2"
          >
            <IndianRupee className="w-4 h-4" /> Collect Fee
          </button>
        </div>
      </div>

      {/* Staff Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('admissions')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'admissions' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" /> Student Registry ({students.length})
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'payments' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <IndianRupee className="w-4 h-4" /> Payments & Receipts ({payments.length})
        </button>
        <button
          onClick={() => setActiveTab('licences')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'licences' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <FileCheck2 className="w-4 h-4" /> RTO Licences ({licenceRecords.length})
        </button>
        <button
          onClick={() => setActiveTab('schedules')}
          className={`px-4 py-2 rounded-xl transition flex items-center gap-2 ${
            activeTab === 'schedules' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" /> Class Schedules ({schedules.length})
        </button>
      </div>

      {/* TAB 1: STUDENT REGISTRY & ADMISSIONS */}
      {activeTab === 'admissions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" /> Active Student Register
            </h2>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, name or phone..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Student Code</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Course Enrolled</th>
                  <th className="px-4 py-3">Assigned Instructor</th>
                  <th className="px-4 py-3">Sessions</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Admission Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/60 text-slate-300">
                {filteredStudents.map(stud => {
                  const enr = enrollments.find(e => e.student_id === stud.id);
                  return (
                    <tr key={stud.id} className="hover:bg-slate-850/60 transition">
                      <td className="px-4 py-3.5 font-mono font-bold text-blue-400">{stud.student_code}</td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-white block">{stud.full_name}</span>
                        <span className="text-[11px] text-slate-500">{stud.phone}</span>
                      </td>
                      <td className="px-4 py-3.5">{stud.enrolled_course_name}</td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {stud.assigned_instructor_name || 'Unassigned'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-emerald-400">
                        {enr ? `${enr.completed_sessions} / ${enr.total_sessions}` : '0 / 20'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {stud.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-slate-400">{stud.admission_date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PAYMENTS & RECEIPTS */}
      {activeTab === 'payments' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-emerald-400" /> Payment Entries & Confirmation Desk
            </h2>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Record Payment
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Receipt / ID</th>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/60 text-slate-300">
                {payments.map(pay => (
                  <tr key={pay.id} className="hover:bg-slate-850/60 transition">
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-300">
                      {pay.receipt_number || 'PENDING'}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-white block">{pay.student_name}</span>
                      <span className="text-[10px] font-mono text-slate-500">{pay.student_code}</span>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-emerald-400 text-sm">
                      ₹{pay.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3.5 font-medium">{pay.payment_method}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        pay.status === 'Confirmed'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      }`}>
                        {pay.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-400">
                      {new Date(pay.received_at).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-2">
                      {pay.status === 'Pending' ? (
                        <button
                          onClick={async () => {
                            await confirmPayment(pay.id);
                          }}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition"
                        >
                          Confirm & Print
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedReceipt(pay)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 font-medium text-[11px] transition inline-flex items-center gap-1"
                        >
                          <Printer className="w-3 h-3" /> View Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LICENCE RECORDS & RTO DATES */}
      {activeTab === 'licences' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-amber-400" /> RTO Learning & Driving Licence Status Tracker
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Licence Category</th>
                  <th className="px-4 py-3">Current RTO Stage</th>
                  <th className="px-4 py-3">Test Date</th>
                  <th className="px-4 py-3">Test Result</th>
                  <th className="px-4 py-3 text-right">Quick Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/60 text-slate-300">
                {licenceRecords.map(lic => (
                  <tr key={lic.id} className="hover:bg-slate-850/60 transition">
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-white block">{lic.student_name}</span>
                      <span className="text-[10px] font-mono text-slate-500">{lic.student_code}</span>
                    </td>
                    <td className="px-4 py-3.5 font-medium">{lic.licence_type}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        {lic.ll_status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-300">{lic.test_date || 'Not Scheduled'}</td>
                    <td className="px-4 py-3.5">
                      {lic.test_result ? (
                        <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-500/20 text-emerald-400">
                          {lic.test_result}
                        </span>
                      ) : (
                        <span className="text-slate-500">Pending</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => {
                          const newSt = prompt('Enter new RTO Status (e.g. DL Test Scheduled, Test Passed, Licence Issued):', lic.ll_status);
                          if (newSt) {
                            updateLicenceStatus(lic.student_id, newSt as any);
                          }
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-[11px] font-medium transition"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CLASS SCHEDULES */}
      {activeTab === 'schedules' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" /> Scheduled Driving Classes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schedules.map(sch => (
              <div key={sch.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{sch.topic}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
                    {sch.status}
                  </span>
                </div>
                <div className="text-slate-400 space-y-0.5">
                  <p>👤 Student: <strong className="text-slate-200">{sch.student_name}</strong> ({sch.student_code})</p>
                  <p>🚘 Instructor: <strong className="text-slate-200">{sch.instructor_name}</strong></p>
                  <p>🚗 Car: <strong className="text-slate-200">{sch.vehicle_name}</strong></p>
                  <p className="font-mono text-emerald-400 mt-1">
                    ⏰ {new Date(sch.scheduled_start).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: NEW STUDENT ADMISSION MODAL */}
      {showAdmissionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">New Student Admission</h3>
                  <p className="text-xs text-slate-400">Generates unique student ID e.g. DS-2026-00106</p>
                </div>
              </div>
              <button onClick={() => setShowAdmissionModal(false)} className="text-slate-400 hover:text-white text-xs">
                ✕ Close
              </button>
            </div>

            {admAlert && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                admAlert.type === 'success' 
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300' 
                  : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
              }`}>
                {admAlert.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{admAlert.text}</span>
              </div>
            )}

            <form onSubmit={handleAdmissionSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={admName}
                    onChange={(e) => setAdmName(e.target.value)}
                    placeholder="e.g. Aditya Verma"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Mobile Number (WhatsApp) *</label>
                  <input
                    type="tel"
                    required
                    value={admPhone}
                    onChange={(e) => setAdmPhone(e.target.value)}
                    placeholder="+91 98900 12345"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Course Selection *</label>
                <select
                  value={admCourseId}
                  onChange={(e) => {
                    setAdmCourseId(e.target.value);
                    const selected = courses.find(c => c.id === e.target.value);
                    if (selected) setAdmFee(selected.price);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} — ₹{c.price.toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Assign Instructor</label>
                  <select
                    value={admInstructorId}
                    onChange={(e) => setAdmInstructorId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {instructors.map(i => (
                      <option key={i.id} value={i.id}>{i.full_name} ({i.instructor_code})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Assign Vehicle</label>
                  <select
                    value={admVehicleId}
                    onChange={(e) => setAdmVehicleId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.registration_number})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-slate-800">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Agreed Fee (₹)</label>
                  <input
                    type="number"
                    value={admFee}
                    onChange={(e) => setAdmFee(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Down Payment (₹)</label>
                  <input
                    type="number"
                    value={admDownPayment}
                    onChange={(e) => setAdmDownPayment(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Payment Mode</label>
                  <select
                    value={admPaymentMethod}
                    onChange={(e) => setAdmPaymentMethod(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="UPI">UPI (GPay/PhonePe)</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAdmissionModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingAdm}
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/20"
                >
                  {isSubmittingAdm ? 'Enrolling...' : 'Complete Admission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RECORD PAYMENT MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-emerald-400" /> Record Fee Collection
              </h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400 hover:text-white text-xs">
                ✕ Close
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Select Student Enrollment</label>
                <select
                  value={payEnrollmentId}
                  onChange={(e) => setPayEnrollmentId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  {enrollments.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.student_name} ({e.student_code}) — {e.course_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Amount (INR) *</label>
                  <input
                    type="number"
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-300 font-medium">Payment Mode</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Card">Card</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Transaction Reference (Optional)</label>
                <input
                  type="text"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  placeholder="e.g. UPI/20261110/881928"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-medium">Remarks / Installment Notes</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  placeholder="e.g. 2nd Installment prior to DL test"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPay}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  {isSubmittingPay ? 'Saving...' : 'Save Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      <ReceiptModal 
        payment={selectedReceipt} 
        school={school} 
        onClose={() => setSelectedReceipt(null)} 
      />
    </div>
  );
}
