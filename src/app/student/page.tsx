'use client';

import React, { useState } from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  FileText, 
  Car, 
  User, 
  Calendar, 
  ShieldCheck, 
  Award, 
  ChevronRight, 
  Download, 
  AlertCircle,
  Phone,
  Sparkles
} from 'lucide-react';
import { ReceiptModal } from '@/components/ReceiptModal';
import { Payment } from '@/types';

export default function StudentDashboard() {
  const { 
    school, 
    students, 
    enrollments, 
    attendanceRecords, 
    payments, 
    licenceRecords, 
    schedules, 
    instructors, 
    vehicles 
  } = useDrivingSchool();

  // Active student logged in: Rahul Sharma (DS-2026-00101)
  const currentStudent = students[0];
  const currentEnrollment = enrollments.find(e => e.student_id === currentStudent.id) || enrollments[0];
  const currentLicence = licenceRecords.find(l => l.student_id === currentStudent.id);
  const studentPayments = payments.filter(p => p.enrollment_id === currentEnrollment.id);
  const myAttendance = attendanceRecords.filter(a => a.enrollment_id === currentEnrollment.id);
  const mySchedules = schedules.filter(s => s.enrollment_id === currentEnrollment.id);

  const assignedInstructor = instructors.find(i => i.id === currentEnrollment.assigned_instructor_id) || instructors[0];
  const assignedVehicle = vehicles.find(v => v.id === currentEnrollment.assigned_vehicle_id) || vehicles[0];

  // Financial calculations
  const totalPaid = studentPayments
    .filter(p => p.status === 'Confirmed')
    .reduce((sum, p) => sum + p.amount, 0);
  const outstandingBalance = Math.max(0, currentEnrollment.agreed_fee - totalPaid);

  // Progress percentage
  const progressPercent = Math.round((currentEnrollment.completed_sessions / currentEnrollment.total_sessions) * 100);

  // Active modal receipt
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);

  // RTO Milestone Pipeline definition
  const rtoStages = [
    { title: 'Documents Verified', done: true, date: '06 Oct 2026' },
    { title: 'LL Application Filed', done: true, date: '08 Oct 2026 (Ref: MH12/LL/2026/099182)' },
    { title: 'Learner Licence Approved', done: true, date: '12 Oct 2026 (Valid till Apr 2027)' },
    { title: 'DL Practical Test Slot', done: false, active: true, date: '20 Nov 2026 at Pune RTO Alandi Track' },
    { title: 'Final Driving Licence Issued', done: false, date: 'Pending practical test clearance' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Student Welcome Header Card */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              RS
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">{currentStudent.full_name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {currentStudent.student_code}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {currentEnrollment.course_name} • Enrolled on {currentStudent.admission_date}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-3xl font-black text-amber-400">
                {currentEnrollment.completed_sessions} <span className="text-base text-slate-500 font-normal">/ {currentEnrollment.total_sessions}</span>
              </div>
              <span className="text-xs text-slate-400">Sessions Completed</span>
            </div>

            <div className="w-14 h-14 rounded-full border-4 border-slate-800 flex items-center justify-center relative font-bold text-xs text-white">
              {progressPercent}%
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="mt-6 space-y-1.5">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Overall Course Progress</span>
            <span className="text-emerald-400 font-bold">{currentEnrollment.total_sessions - currentEnrollment.completed_sessions} Sessions Remaining</span>
          </div>
          <div className="w-full bg-slate-800/80 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700/60">
            <div 
              className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-md"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Progress & RTO Milestones (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Detailed Session-Wise Category Progress */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" /> Session-Wise Curriculum Mastery
              </h2>
              <span className="text-xs text-slate-400 font-medium">Derived from Verified Attendance</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {currentEnrollment.session_allocations?.map(sa => {
                const isComplete = sa.completed_count >= sa.allocated_count;
                const pct = Math.round((sa.completed_count / sa.allocated_count) * 100);

                return (
                  <div
                    key={sa.id}
                    className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-white">{sa.session_name_snapshot}</span>
                        <span className={`text-xs font-bold font-mono ${isComplete ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {sa.completed_count} / {sa.allocated_count}
                        </span>
                      </div>

                      {/* Mini Bar */}
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${isComplete ? 'bg-emerald-400' : 'bg-amber-400'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isComplete ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> Done
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">
                          {sa.allocated_count - sa.completed_count} left
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RTO Driving Licence (LL & DL) Status Timeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" /> RTO Driving Licence Lifecycle
              </h2>
              <span className="text-xs text-blue-400 font-mono font-semibold">{currentLicence?.rto_name}</span>
            </div>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {rtoStages.map((stg, idx) => (
                <div key={idx} className="relative group">
                  {/* Dot */}
                  <div className={`absolute -left-[27px] top-1 w-5 h-5 rounded-full flex items-center justify-center ${
                    stg.done 
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30' 
                      : stg.active
                      ? 'bg-amber-500 text-slate-950 animate-pulse'
                      : 'bg-slate-800 border-2 border-slate-700 text-slate-500'
                  }`}>
                    {stg.done ? <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" /> : <span className="w-1.5 h-1.5 rounded-full bg-current" />}
                  </div>

                  <div className={`p-3.5 rounded-2xl border text-xs ${
                    stg.active
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
                      : stg.done
                      ? 'bg-slate-950/60 border-slate-800 text-slate-200'
                      : 'bg-slate-950/30 border-slate-900 text-slate-500'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">{stg.title}</span>
                      {stg.active && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">
                          NEXT UP
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-slate-400">{stg.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Fees, Instructor & Schedules (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Fee & Outstanding Balance Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-emerald-400" /> Fees & Payment Ledger
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 block">Total Course Fee:</span>
                <span className="text-lg font-bold text-white">₹{currentEnrollment.agreed_fee.toLocaleString('en-IN')}</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 block">Paid So Far:</span>
                <span className="text-lg font-bold text-emerald-400">₹{totalPaid.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Outstanding Balance Banner */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs ${
              outstandingBalance > 0 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' 
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            }`}>
              <div>
                <span className="text-[11px] text-slate-400 block">Balance Pending:</span>
                <span className="text-xl font-black">₹{outstandingBalance.toLocaleString('en-IN')}</span>
              </div>
              {outstandingBalance > 0 ? (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Due Before DL Test
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Fully Cleared
                </span>
              )}
            </div>

            {/* Payment Receipts History */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-300 block">Official Receipts:</span>
              {studentPayments.map(pay => (
                <div 
                  key={pay.id} 
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">₹{pay.amount.toLocaleString('en-IN')}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                        {pay.payment_method}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      {new Date(pay.received_at).toLocaleDateString('en-IN')} • {pay.receipt_number || 'Pending'}
                    </span>
                  </div>

                  {pay.receipt_number && (
                    <button
                      onClick={() => setSelectedReceipt(pay)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 text-xs font-medium transition"
                    >
                      <Download className="w-3.5 h-3.5" /> Receipt
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Instructor & Training Car Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Car className="w-4 h-4 text-amber-400" /> Instructor & Training Vehicle
            </h2>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-sm">
                  VS
                </div>
                <div>
                  <span className="font-bold text-white text-sm block">{assignedInstructor.full_name}</span>
                  <span className="text-[11px] text-slate-400">{assignedInstructor.experience_years} Years Experience</span>
                </div>
              </div>
              <a
                href={`tel:${assignedInstructor.phone}`}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 transition"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3 text-xs">
              <Car className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <span className="font-semibold text-white block">{assignedVehicle.brand} {assignedVehicle.model}</span>
                <span className="text-slate-400 font-mono text-[11px]">
                  {assignedVehicle.registration_number} {assignedVehicle.is_dual_control ? '• Dual Control Fitted' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Upcoming Class Schedule */}
          {mySchedules.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400" /> Upcoming Class Schedule
              </h2>
              {mySchedules.map(sch => (
                <div key={sch.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{sch.topic}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300">
                      SCHEDULED
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {new Date(sch.scheduled_start).toLocaleString('en-IN', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Official Receipt Modal */}
      <ReceiptModal 
        payment={selectedReceipt} 
        school={school} 
        onClose={() => setSelectedReceipt(null)} 
      />
    </div>
  );
}
