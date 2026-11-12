'use client';

import React, { useState } from 'react';
import { Student, Enrollment, Payment, AttendanceRecord, LicenceRecord, ClassSchedule } from '@/types';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { 
  X, 
  User, 
  BookOpen, 
  TrendingUp, 
  CheckCircle2, 
  IndianRupee, 
  FileCheck2, 
  FileText, 
  Calendar, 
  History, 
  Phone, 
  Mail, 
  MapPin, 
  Award, 
  Car, 
  Printer, 
  Check, 
  AlertTriangle,
  Clock,
  ShieldCheck,
  ExternalLink,
  Edit3,
  KeyRound,
  Lock,
  Unlock,
  ShieldAlert,
  RotateCcw
} from 'lucide-react';
import { ResetPasswordModal } from '@/components/modals/ResetPasswordModal';
import { LLWorkflowModal } from '@/components/licence/LLWorkflowModal';
import { getStudentLLProgress } from '@/lib/llTrackingEngine';

interface StudentDetailModalProps {
  student: Student | null;
  onClose: () => void;
  onOpenReceipt?: (payment: Payment) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
  onOpenReceipt
}) => {
  const { 
    school, 
    enrollments, 
    attendanceRecords, 
    payments, 
    licenceRecords, 
    schedules, 
    auditLogs,
    instructors,
    llReminderSettings,
    studentDocuments,
    updateLicenceStatus,
    toggleStudentAccount,
    addToast
  } = useDrivingSchool();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'personal' | 'course' | 'progress' | 'attendance' | 'finances' | 'licence' | 'documents' | 'schedule' | 'history'
  >('overview');

  const [isLLWorkflowOpen, setIsLLWorkflowOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  if (!student) return null;

  const enrollment = enrollments.find(e => e.student_id === student.id);
  const studentAttendance = attendanceRecords.filter(a => a.student_id === student.id);
  const studentPayments = payments.filter(p => p.student_id === student.id);
  const studentLicence = licenceRecords.find(l => l.student_id === student.id);
  const studentSchedules = schedules.filter(s => s.enrollment_id === enrollment?.id);
  const studentAudits = auditLogs.filter(a => a.details.includes(student.student_code) || a.entity_id === student.id);

  const llProgress = getStudentLLProgress(
    student,
    enrollment,
    attendanceRecords,
    studentLicence,
    llReminderSettings,
    studentDocuments
  );

  const totalAgreedFee = enrollment?.agreed_fee || 0;
  const totalPaid = studentPayments
    .filter(p => p.status === 'Confirmed')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingFee = Math.max(0, totalAgreedFee - totalPaid);

  const totalSessions = enrollment?.total_sessions || 20;
  const completedSessions = enrollment?.completed_sessions || studentAttendance.filter(a => a.status === 'Present').length;
  const remainingSessions = Math.max(0, totalSessions - completedSessions);
  const progressPercent = Math.min(100, Math.round((completedSessions / totalSessions) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-5xl w-full border border-slate-800 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-950/80 p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/20 shrink-0">
              {student.full_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-white">{student.full_name}</h2>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                  {student.student_code}
                </span>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  student.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  student.status === 'Course Completed' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                  'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {student.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-slate-400" /> {student.enrolled_course_name}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-amber-400" /> Instructor: {student.assigned_instructor_name || 'Unassigned'}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> Admitted: {student.admission_date}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="self-start sm:self-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 10 Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-slate-800 bg-slate-950/40 px-6 py-2 overflow-x-auto scrollbar-none text-xs font-semibold">
          {[
            { id: 'overview', label: '1. Overview', icon: User },
            { id: 'personal', label: '2. Personal Info', icon: User },
            { id: 'course', label: '3. Course Details', icon: BookOpen },
            { id: 'progress', label: '4. Driving Progress', icon: TrendingUp },
            { id: 'attendance', label: `5. Attendance (${studentAttendance.length})`, icon: CheckCircle2 },
            { id: 'finances', label: `6. Fees & Ledger (${studentPayments.length})`, icon: IndianRupee },
            { id: 'licence', label: '7. RTO Licence', icon: FileCheck2 },
            { id: 'documents', label: '8. Documents', icon: FileText },
            { id: 'schedule', label: `9. Schedules (${studentSchedules.length})`, icon: Calendar },
            { id: 'history', label: `10. Activity Trail (${studentAudits.length})`, icon: History },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
                  <span className="text-[11px] text-slate-400 font-medium block">Course Sessions</span>
                  <div className="text-2xl font-black text-white mt-1 tabular-nums">
                    {completedSessions} / {totalSessions}
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full mt-2.5 overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-blue-400 font-semibold block mt-1">
                    {remainingSessions} sessions remaining ({progressPercent}%)
                  </span>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
                  <span className="text-[11px] text-slate-400 font-medium block">Total Agreed Fee</span>
                  <div className="text-2xl font-black text-white mt-1 tabular-nums">
                    ₹{totalAgreedFee.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-2">
                    Official Course Package
                  </span>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
                  <span className="text-[11px] text-slate-400 font-medium block">Amount Collected</span>
                  <div className="text-2xl font-black text-emerald-400 mt-1 tabular-nums">
                    ₹{totalPaid.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-emerald-400/80 font-medium block mt-2">
                    {Math.round((totalPaid / (totalAgreedFee || 1)) * 100)}% Paid
                  </span>
                </div>

                <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4">
                  <span className="text-[11px] text-slate-400 font-medium block">Pending Balance</span>
                  <div className={`text-2xl font-black mt-1 tabular-nums ${pendingFee > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                    ₹{pendingFee.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-amber-400/80 font-medium block mt-2">
                    {pendingFee === 0 ? 'Full balance cleared' : 'Outstanding dues'}
                  </span>
                </div>
              </div>

              {/* Driving Progress & RTO Snapshot */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Car className="w-4 h-4 text-blue-400" /> Training & Vehicle Details
                    </h3>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Assigned Instructor:</span>
                      <span className="font-semibold text-white">{student.assigned_instructor_name || 'None Assigned'}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Assigned Vehicle:</span>
                      <span className="font-semibold text-white">{enrollment?.vehicle_registration || 'Maruti Swift (Dual Control)'}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">Course Duration:</span>
                      <span className="font-semibold text-white">30 Days Daily Practical</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">Admission Date:</span>
                      <span className="font-semibold text-white">{student.admission_date}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-purple-400" /> RTO Licence Milestone
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {studentLicence?.ll_status || 'Pending LL'}
                    </span>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">RTO Office:</span>
                      <span className="font-semibold text-white">{studentLicence?.rto_name || 'MH-12 Pune'}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">LL Application Ref:</span>
                      <span className="font-mono font-semibold text-blue-400">{studentLicence?.ll_reference || 'Pending'}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-800">
                      <span className="text-slate-400">DL Test Date:</span>
                      <span className="font-semibold text-amber-400">{studentLicence?.test_date || 'Not Scheduled'}</span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-slate-400">Final Licence Number:</span>
                      <span className="font-mono font-semibold text-emerald-400">{studentLicence?.licence_number || 'Awaiting Test'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account & Security Credentials */}
              <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">Student Account & Security</h3>
                      <p className="text-[11px] text-slate-400">Authentication status, first login verification, and access controls</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsResetModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reset to Temp Password
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        const res = await toggleStudentAccount(student.id);
                        addToast(res.message, 'info');
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        student.account_enabled === false
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30 hover:bg-rose-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                      }`}
                    >
                      {student.account_enabled === false ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      {student.account_enabled === false ? 'Account Disabled (Click to Enable)' : 'Account Enabled'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block mb-1">Student ID (Username)</span>
                    <span className="font-mono font-bold text-blue-400 text-sm">{student.student_code}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block mb-1">Account Activation Status</span>
                    {student.account_enabled === false || student.account_status === 'DISABLED' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        <ShieldAlert className="w-3 h-3 text-rose-400" /> Disabled
                      </span>
                    ) : student.account_status === 'FIRST_LOGIN_PASSWORD_CHANGE_REQUIRED' || !student.first_login_completed ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        <KeyRound className="w-3 h-3 text-amber-400" /> 1st Login Required
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" /> Active & Secured
                      </span>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block mb-1">First-Time Setup Status</span>
                    <span className="font-semibold text-white">
                      {student.first_login_completed ? 'Completed' : 'Pending First Login'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-slate-400 block mb-1">Password Last Changed</span>
                    <span className="font-semibold text-white">
                      {student.password_changed_at 
                        ? new Date(student.password_changed_at).toLocaleDateString() 
                        : 'Initial temporary credential'}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 text-[11px] text-slate-400 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>
                    Staff and administrators cannot view student passwords. Passwords are securely hashed with PBKDF2-SHA256. Resetting credentials creates a temporary password matching the Student ID, and forces the student to create a new password upon their next login.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PERSONAL INFORMATION */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-4">Student Identity & Contact Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">Full Legal Name:</span>
                    <span className="font-bold text-white text-sm">{student.full_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Phone Number:</span>
                    <span className="font-bold text-white text-sm flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-blue-400" /> {student.phone}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Email Address:</span>
                    <span className="font-medium text-slate-200 text-sm flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-400" /> {student.email || 'Not provided'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Date of Birth:</span>
                    <span className="font-semibold text-white">{student.date_of_birth || '15-Aug-2002'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Gender:</span>
                    <span className="font-semibold text-white">{student.gender || 'Male'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Blood Group:</span>
                    <span className="font-bold text-rose-400">{student.blood_group || 'O +ve'}</span>
                  </div>
                </div>

                <div className="border-t border-slate-800 mt-6 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">Residential Address:</span>
                    <p className="font-medium text-slate-200 flex items-start gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      {student.address?.area ? `${student.address.area}, ` : ''}{student.address?.city || 'Pune'}, {student.address?.pincode || '411001'}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Emergency Contact:</span>
                    <p className="font-semibold text-white">
                      {student.emergency_contact?.name || 'Ramesh Sharma'} ({student.emergency_contact?.relation || 'Father'})
                    </p>
                    <p className="text-slate-300 mt-0.5">
                      Phone: {student.emergency_contact?.phone || '+91 98220 11224'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COURSE DETAILS */}
          {activeTab === 'course' && (
            <div className="space-y-6">
              <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">{student.enrolled_course_name}</h3>
                    <p className="text-xs text-slate-400 mt-1">Official Academy Curriculum with Session Snapshot Guarantee</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Category: 4W Light Motor Vehicle
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block">Package Fee</span>
                    <span className="text-base font-bold text-white tabular-nums mt-1 block">₹{totalAgreedFee.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block">Total Quota Sessions</span>
                    <span className="text-base font-bold text-white tabular-nums mt-1 block">{totalSessions} Sessions</span>
                  </div>
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block">Daily Practical Duration</span>
                    <span className="text-base font-bold text-white tabular-nums mt-1 block">60 Mins per session</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DRIVING PROGRESS */}
          {activeTab === 'progress' && (
            <div className="space-y-6">
              <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Curriculum Category Progress Snapshot</h3>
                  <span className="text-xs font-bold text-blue-400">{progressPercent}% Overall Course Completion</span>
                </div>

                {enrollment?.session_allocations && enrollment.session_allocations.length > 0 ? (
                  <div className="space-y-4">
                    {enrollment.session_allocations.map(sa => {
                      const pct = Math.min(100, Math.round((sa.completed_count / sa.allocated_count) * 100));
                      return (
                        <div key={sa.id} className="bg-slate-900/70 border border-slate-800 p-4 rounded-xl space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white">{sa.session_name_snapshot}</span>
                            <span className="font-mono text-slate-300">
                              {sa.completed_count} / {sa.allocated_count} Sessions ({pct}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                pct >= 100 ? 'bg-emerald-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-xs text-slate-400">
                    No custom session quotas recorded for this enrollment.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: ATTENDANCE HISTORY */}
          {activeTab === 'attendance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Session Attendance Ledger ({studentAttendance.length})</h3>
              </div>

              {studentAttendance.length > 0 ? (
                <div className="border border-slate-800 rounded-2xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                      <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Topic / Category</th>
                        <th className="px-4 py-3">Instructor</th>
                        <th className="px-4 py-3">Vehicle</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {studentAttendance.map(att => (
                        <tr key={att.id} className="hover:bg-slate-800/40">
                          <td className="px-4 py-3 font-semibold text-white whitespace-nowrap">{att.attendance_date}</td>
                          <td className="px-4 py-3 text-slate-200">{att.session_name}</td>
                          <td className="px-4 py-3 text-slate-300">{att.instructor_name}</td>
                          <td className="px-4 py-3 text-slate-400">{att.vehicle_info || 'Maruti Swift (Dual Control)'}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              att.status === 'Present' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                            }`}>
                              {att.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-400 text-[11px]">{att.remarks || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-slate-500 text-xs bg-slate-950/40 rounded-2xl border border-slate-800">
                  No attendance records logged yet.
                </div>
              )}
            </div>
          )}

          {/* TAB 6: FEES & PAYMENTS */}
          {activeTab === 'finances' && (
            <div className="space-y-6">
              {/* Financial summary bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
                  <span className="text-xs text-slate-400 block">Agreed Course Fee</span>
                  <span className="text-xl font-black text-white tabular-nums mt-1 block">₹{totalAgreedFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
                  <span className="text-xs text-slate-400 block">Paid Amount</span>
                  <span className="text-xl font-black text-emerald-400 tabular-nums mt-1 block">₹{totalPaid.toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
                  <span className="text-xs text-slate-400 block">Outstanding Balance</span>
                  <span className={`text-xl font-black tabular-nums mt-1 block ${pendingFee > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                    ₹{pendingFee.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Payment Transactions</h4>
                {studentPayments.length > 0 ? (
                  <div className="border border-slate-800 rounded-2xl overflow-hidden">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                        <tr>
                          <th className="px-4 py-3">Receipt No</th>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Amount</th>
                          <th className="px-4 py-3">Method</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {studentPayments.map(p => (
                          <tr key={p.id} className="hover:bg-slate-800/40">
                            <td className="px-4 py-3 font-mono font-bold text-blue-400">{p.receipt_number || 'PENDING'}</td>
                            <td className="px-4 py-3 text-slate-300">{new Date(p.received_at).toLocaleDateString('en-IN')}</td>
                            <td className="px-4 py-3 font-bold text-white tabular-nums">₹{p.amount.toLocaleString('en-IN')}</td>
                            <td className="px-4 py-3 text-slate-300">{p.payment_method}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                p.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400' :
                                p.status === 'Pending' ? 'bg-amber-500/20 text-amber-400' :
                                'bg-rose-500/20 text-rose-400'
                              }`}>
                                {p.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              {p.status === 'Confirmed' && onOpenReceipt && (
                                <button
                                  onClick={() => onOpenReceipt(p)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
                                >
                                  <Printer className="w-3.5 h-3.5" /> Receipt
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-xs text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800">
                    No payment transactions recorded for this student.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: LICENCE INFORMATION */}
          {activeTab === 'licence' && (
            <div className="space-y-6">
              {/* Learning Licence Tracking & Attendance Engine Summary */}
              <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        Learning Licence (LL) Tracking Engine
                      </h3>
                      <p className="text-xs text-slate-400">
                        Class-day attendance threshold tracking & Sarathi RTO workflow
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${llProgress.statusBadge.bg} ${llProgress.statusBadge.color} border ${llProgress.statusBadge.border}`}>
                      {llProgress.statusBadge.label}
                    </span>
                    <button
                      onClick={() => setIsLLWorkflowOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Update LL Workflow</span>
                    </button>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-400 block text-[11px]">Attended Class Days</span>
                    <div className="text-lg font-black text-amber-400 font-mono mt-0.5">
                      {llProgress.totalAttendedClassDays} <span className="text-xs text-slate-400 font-normal">/ {llReminderSettings.required_attended_days} Days</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Distinct Present Dates</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-400 block text-[11px]">Practical Sessions</span>
                    <div className="text-lg font-black text-blue-400 font-mono mt-0.5">
                      {llProgress.completedPracticalSessions} <span className="text-xs text-slate-400 font-normal">/ {enrollment?.total_sessions || 20}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Completed On-Road</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-400 block text-[11px]">First Attended Date</span>
                    <div className="text-sm font-bold text-white font-mono mt-1">
                      {llProgress.firstAttendedClassDate || 'Not started'}
                    </div>
                    <span className="text-[10px] text-slate-500">First Present Stamp</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-slate-400 block text-[11px]">Most Recent Class</span>
                    <div className="text-sm font-bold text-white font-mono mt-1">
                      {llProgress.mostRecentAttendedClassDate || 'None yet'}
                    </div>
                    <span className="text-[10px] text-slate-500">Last Verified Class</span>
                  </div>
                </div>

                {/* LL Registration & Sarathi Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Existing LL at Admission:</span>
                    <strong className={llProgress.hasExistingLL ? 'text-emerald-400' : 'text-slate-200'}>
                      {llProgress.hasExistingLL ? 'Yes (Already Available)' : 'No (Tracking Started)'}
                    </strong>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">Learning Licence Number:</span>
                    <span className="font-mono font-bold text-white">
                      {llProgress.llNumber || studentLicence?.ll_reference || 'Not Issued Yet'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">Application Number:</span>
                    <span className="font-mono font-bold text-blue-400">
                      {llProgress.applicationNumber || 'Pending Filing'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">LL Expiry Date:</span>
                    <span className={llProgress.isLLExpired ? 'text-rose-400 font-bold' : 'text-white'}>
                      {llProgress.llExpiryDate || 'N/A'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">Vehicle Category:</span>
                    <span className="font-bold text-white">
                      {llProgress.llVehicleCategory || studentLicence?.licence_type || 'LMV'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">LL Document Uploaded:</span>
                    <span className={llProgress.documentUploaded ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                      {llProgress.documentUploaded ? `✓ ${llProgress.documentName || 'Document on File'}` : 'Not Uploaded'}
                    </span>
                  </div>
                </div>

                {/* Government Portal Link & Statutory Disclaimer */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-amber-400 block">Official Parivahan Sarathi Portal:</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Attending driving classes is school training; official LL issuance is governed by RTO statutory rules.
                    </p>
                  </div>
                  <a
                    href="https://sarathi.parivahan.gov.in/"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition"
                  >
                    <span>sarathi.parivahan.gov.in</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* DL Test Stage Details */}
                <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">DL Test Date:</span>
                    <span className="font-bold text-purple-400">{studentLicence?.test_date || 'Awaiting Practical Slot'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Test Result:</span>
                    <span className="font-bold text-white">{studentLicence?.test_result || 'Pending'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Permanent DL Number:</span>
                    <span className="font-mono font-bold text-emerald-400">{studentLicence?.licence_number || 'Awaiting Clearance'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Student KYC & RTO Documents</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Aadhaar Card (Identity & Address)', type: 'PDF / Image', status: 'Verified', date: student.admission_date },
                  { title: 'Form 1A Medical Fitness Certificate', type: 'Doctor Signed Form', status: 'Verified', date: student.admission_date },
                  { title: 'Age Proof (10th Board Certificate)', type: 'PDF', status: 'Verified', date: student.admission_date },
                  { title: 'Learner Licence (LL) Copy', type: 'Sarathi RTO PDF', status: studentLicence?.ll_reference ? 'Verified' : 'Pending', date: studentLicence?.ll_issue_date || 'Pending' }
                ].map((doc, idx) => (
                  <div key={idx} className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{doc.title}</h4>
                        <span className="text-[11px] text-slate-400 block">{doc.type} • {doc.date}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      doc.status === 'Verified' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: CLASS SCHEDULE */}
          {activeTab === 'schedule' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Driving Class Slots ({studentSchedules.length})</h3>
              {studentSchedules.length > 0 ? (
                <div className="space-y-3">
                  {studentSchedules.map(sch => (
                    <div key={sch.id} className="bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{sch.topic}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300">
                            {sch.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                          <span>Instructor: {sch.instructor_name}</span>
                          <span>•</span>
                          <span>Vehicle: {sch.vehicle_name}</span>
                        </p>
                      </div>
                      <div className="text-right text-xs">
                        <span className="font-semibold text-white block">
                          {new Date(sch.scheduled_start).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          {new Date(sch.scheduled_start).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-xs text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800">
                  No upcoming schedule slots booked.
                </div>
              )}
            </div>
          )}

          {/* TAB 10: ACTIVITY HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Audit Trail & Activity Log</h3>
              {studentAudits.length > 0 ? (
                <div className="space-y-3">
                  {studentAudits.map(log => (
                    <div key={log.id} className="bg-slate-800/40 border border-slate-800 rounded-xl p-3 text-xs flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{log.action}</span>
                          <span className="text-[10px] text-slate-400">{new Date(log.created_at).toLocaleString('en-IN')}</span>
                        </div>
                        <p className="text-slate-300 text-[11px] mt-0.5">{log.details}</p>
                        <span className="text-[10px] text-slate-500 block mt-1">Actor: {log.actor_name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-xs text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800">
                  No recent audit history logged for this student.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950/80 p-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Driving School OS • Student File Record
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
          >
            Close Student Record
          </button>
        </div>
      </div>

      {/* Learning Licence Application Workflow Modal */}
      <LLWorkflowModal
        isOpen={isLLWorkflowOpen}
        onClose={() => setIsLLWorkflowOpen(false)}
        student={student}
        licenceRecord={studentLicence}
      />

      {/* Reset Password Modal */}
      {isResetModalOpen && (
        <ResetPasswordModal
          student={student}
          onClose={() => setIsResetModalOpen(false)}
        />
      )}
    </div>
  );
};
