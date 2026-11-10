'use client';

import React, { useState } from 'react';
import { 
  Student, 
  Enrollment, 
  AttendanceRecord, 
  Payment, 
  LicenceRecord, 
  ClassSchedule, 
  AuditLog, 
  School 
} from '@/types';
import { 
  X, 
  User, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  IndianRupee, 
  FileCheck2, 
  FileText, 
  Calendar, 
  History, 
  Phone, 
  Mail, 
  MapPin, 
  Car, 
  Clock, 
  Download,
  AlertCircle
} from 'lucide-react';
import { ReceiptModal } from '@/components/ReceiptModal';

interface StudentDetailModalProps {
  student: Student | null;
  enrollment?: Enrollment;
  attendanceRecords: AttendanceRecord[];
  payments: Payment[];
  licenceRecord?: LicenceRecord;
  schedules: ClassSchedule[];
  auditLogs: AuditLog[];
  school: School;
  onClose: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  enrollment,
  attendanceRecords,
  payments,
  licenceRecord,
  schedules,
  auditLogs,
  school,
  onClose
}) => {
  if (!student) return null;

  const [activeTab, setActiveTab] = useState<
    'overview' | 'personal' | 'course' | 'progress' | 'attendance' | 'fees' | 'licence' | 'documents' | 'schedule' | 'activity'
  >('overview');

  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);

  const studentAttendance = attendanceRecords.filter(a => a.student_id === student.id);
  const studentPayments = payments.filter(p => p.student_id === student.id);
  const studentSchedules = schedules.filter(s => s.enrollment_id === enrollment?.id);
  const studentAudits = auditLogs.filter(a => a.entity_id === student.id || a.details.includes(student.student_code));

  const totalPaid = studentPayments
    .filter(p => p.status === 'Confirmed')
    .reduce((sum, p) => sum + p.amount, 0);
  const agreedFee = enrollment?.agreed_fee || 8500;
  const balanceDue = Math.max(0, agreedFee - totalPaid);

  const completedSessions = enrollment?.completed_sessions || studentAttendance.length;
  const totalSessions = enrollment?.total_sessions || 20;
  const progressPct = Math.round((completedSessions / totalSessions) * 100);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'course', label: 'Course Details', icon: BookOpen },
    { id: 'progress', label: 'Driving Progress', icon: Award },
    { id: 'attendance', label: 'Attendance History', icon: CheckCircle2 },
    { id: 'fees', label: 'Fees & Payments', icon: IndianRupee },
    { id: 'licence', label: 'Licence Info', icon: FileCheck2 },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'schedule', label: 'Class Schedule', icon: Calendar },
    { id: 'activity', label: 'Activity Logs', icon: History }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#111E32] text-slate-900 dark:text-white rounded-3xl max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl border border-[#E5EAF1] dark:border-[#1E293B] overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#E5EAF1] dark:border-[#1E293B] bg-slate-50 dark:bg-[#0B1728] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-600 dark:text-blue-400 font-black text-lg flex items-center justify-center border border-blue-500/30">
              {student.full_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{student.full_name}</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                  {student.student_code}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {student.status}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {student.enrolled_course_name} • Instructor: {student.assigned_instructor_name || 'Unassigned'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 10 Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto px-5 py-2.5 border-b border-[#E5EAF1] dark:border-[#1E293B] bg-white dark:bg-[#111E32] scrollbar-none text-xs font-medium">
          {tabs.map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stat Pill Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B]">
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Completed Sessions:</span>
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    {completedSessions} <span className="text-xs font-normal text-slate-400">/ {totalSessions}</span>
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B]">
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Agreed Fee:</span>
                  <span className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                    ₹{agreedFee.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B]">
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Fee Balance:</span>
                  <span className={`text-xl font-bold font-mono ${balanceDue > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                    ₹{balanceDue.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B]">
                  <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Licence Status:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 text-xs">
                    {licenceRecord?.ll_status || 'In Progress'}
                  </span>
                </div>
              </div>

              {/* Driving Progress Bar */}
              <div className="p-5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Course Completion Rate</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{progressPct}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PERSONAL INFO */}
          {activeTab === 'personal' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-3">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Contact Details</h4>
                <p>📞 Phone: <strong>{student.phone}</strong></p>
                <p>📧 Email: <strong>{student.email || '—'}</strong></p>
                <p>🎂 Date of Birth: <strong>{student.date_of_birth || '—'}</strong></p>
                <p>🩸 Blood Group: <strong>{student.blood_group || '—'}</strong></p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-3">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Emergency Contact & Address</h4>
                <p>🏠 Area: {student.address?.area || '—'}</p>
                <p>📍 City: {student.address?.city || 'Pune'} - {student.address?.pincode || '411001'}</p>
                <p>🚨 Emergency Person: {student.emergency_contact?.name || '—'} ({student.emergency_contact?.relation || 'Guardian'})</p>
                <p>📞 Emergency Phone: {student.emergency_contact?.phone || '—'}</p>
              </div>
            </div>
          )}

          {/* TAB 3: COURSE DETAILS */}
          {activeTab === 'course' && (
            <div className="p-5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-4 text-xs">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">{enrollment?.course_name}</h4>
              <p className="text-slate-500 dark:text-slate-400">
                Enrollment Start Date: <strong>{enrollment?.start_date}</strong> • Expected Completion: <strong>{enrollment?.expected_end_date || '30 Days'}</strong>
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 block">Assigned Instructor:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{student.assigned_instructor_name || 'Vikram Shinde'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Training Vehicle:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{enrollment?.vehicle_registration || 'Maruti Swift Dzire (MH-12-AB-1234)'}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DRIVING PROGRESS */}
          {activeTab === 'progress' && (
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Session Allocations & Category Progress</h4>
              <div className="grid grid-cols-1 gap-2.5">
                {enrollment?.session_allocations?.map(sa => {
                  const done = sa.completed_count >= sa.allocated_count;
                  return (
                    <div key={sa.id} className="p-3.5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{sa.session_name_snapshot}</span>
                        <div className="w-48 bg-slate-200 dark:bg-slate-800 rounded-full h-1.5">
                          <div 
                            className={`h-full rounded-full ${done ? 'bg-emerald-500' : 'bg-blue-600'}`}
                            style={{ width: `${Math.round((sa.completed_count / sa.allocated_count) * 100)}%` }}
                          />
                        </div>
                      </div>
                      <span className={`font-mono font-bold ${done ? 'text-emerald-500' : 'text-blue-500'}`}>
                        {sa.completed_count} / {sa.allocated_count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: ATTENDANCE HISTORY */}
          {activeTab === 'attendance' && (
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Attendance Records ({studentAttendance.length})</h4>
              <div className="space-y-2">
                {studentAttendance.map(att => (
                  <div key={att.id} className="p-3 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{att.session_name}</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Instructor: {att.instructor_name} • {att.remarks}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        {att.status}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-mono mt-1">
                        {new Date(att.marked_at).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: FEES & PAYMENTS */}
          {activeTab === 'fees' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B]">
                  <span className="text-slate-400 block text-[11px]">Agreed Fee:</span>
                  <span className="font-bold text-base text-slate-900 dark:text-white">₹{agreedFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B]">
                  <span className="text-slate-400 block text-[11px]">Total Paid:</span>
                  <span className="font-bold text-base text-emerald-500">₹{totalPaid.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B]">
                  <span className="text-slate-400 block text-[11px]">Balance Due:</span>
                  <span className="font-bold text-base text-amber-500">₹{balanceDue.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block">Receipts:</span>
                {studentPayments.map(p => (
                  <div key={p.id} className="p-3 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">₹{p.amount.toLocaleString('en-IN')}</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block">{p.payment_method} • {p.receipt_number || 'Pending'}</span>
                    </div>
                    {p.receipt_number && (
                      <button 
                        onClick={() => setSelectedReceipt(p)}
                        className="px-2.5 py-1 rounded bg-blue-600 text-white font-medium text-[11px]"
                      >
                        Receipt
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: LICENCE INFO */}
          {activeTab === 'licence' && (
            <div className="p-5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-3 text-xs">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">RTO Licensing Lifecycle</h4>
              <p>Type: <strong>{licenceRecord?.licence_type || 'LMV'}</strong></p>
              <p>RTO Office: <strong>{licenceRecord?.rto_name || 'MH-12 Pune'}</strong></p>
              <p>Current Status: <strong className="text-blue-500">{licenceRecord?.ll_status || 'In Progress'}</strong></p>
              <p>LL Application Ref: <strong>{licenceRecord?.ll_reference || 'MH12/LL/2026/099182'}</strong></p>
              <p>DL Test Date: <strong>{licenceRecord?.test_date || 'Awaiting Practical Slot'}</strong></p>
            </div>
          )}

          {/* TAB 8: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Aadhaar Card (KYC)</span>
                  <span className="text-emerald-500 text-[11px]">✓ Verified</span>
                </div>
                <FileText className="w-5 h-5 text-slate-400" />
              </div>
              <div className="p-4 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Form 1A Medical Fitness</span>
                  <span className="text-emerald-500 text-[11px]">✓ Verified by RTO Doctor</span>
                </div>
                <FileText className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          )}

          {/* TAB 9: SCHEDULE */}
          {activeTab === 'schedule' && (
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Upcoming Driving Slots</h4>
              {studentSchedules.length > 0 ? (
                studentSchedules.map(sch => (
                  <div key={sch.id} className="p-3.5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white">{sch.topic}</span>
                    <p className="text-slate-400 font-mono">
                      {new Date(sch.scheduled_start).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">No scheduled upcoming sessions.</p>
              )}
            </div>
          )}

          {/* TAB 10: ACTIVITY HISTORY */}
          {activeTab === 'activity' && (
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">Student Audit Logs</h4>
              {studentAudits.map(aud => (
                <div key={aud.id} className="p-3 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B]">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{aud.action}</span>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">{aud.details}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ReceiptModal 
        payment={selectedReceipt} 
        school={school} 
        onClose={() => setSelectedReceipt(null)} 
      />
    </div>
  );
};
