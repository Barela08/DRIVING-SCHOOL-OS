'use client';

import React from 'react';
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
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  FileBadge
} from 'lucide-react';
import { 
  Student, 
  Enrollment, 
  LicenceRecord, 
  Payment, 
  AttendanceRecord, 
  ClassSchedule, 
  Instructor, 
  Vehicle, 
  NotificationItem,
  CourseCertificate
} from '@/types';
import { StudentNavTab } from './StudentSidebar';
import { MyCertificateCard } from './MyCertificateCard';

interface StudentDashboardHomeProps {
  student: Student;
  enrollment: Enrollment;
  licence?: LicenceRecord;
  payments: Payment[];
  attendance: AttendanceRecord[];
  schedules: ClassSchedule[];
  instructor?: Instructor;
  vehicle?: Vehicle;
  notifications: NotificationItem[];
  certificate?: CourseCertificate;
  onSelectTab: (tab: StudentNavTab) => void;
  onOpenReceipt: (payment: Payment) => void;
  onOpenCertificatePreview?: () => void;
  onDownloadCertificate?: () => void;
  onSimulateCompletion?: () => void;
  isSimulating?: boolean;
}

export const StudentDashboardHome: React.FC<StudentDashboardHomeProps> = ({
  student,
  enrollment,
  licence,
  payments,
  attendance,
  schedules,
  instructor,
  vehicle,
  notifications,
  certificate,
  onSelectTab,
  onOpenReceipt,
  onOpenCertificatePreview,
  onDownloadCertificate,
  onSimulateCompletion,
  isSimulating
}) => {
  // Financial calculations
  const confirmedPayments = payments.filter(p => p.status === 'Confirmed');
  const totalPaid = confirmedPayments.reduce((sum, p) => sum + p.amount, 0);
  const outstandingBalance = Math.max(0, enrollment.agreed_fee - totalPaid);

  // Session metrics
  const totalClasses = enrollment.total_sessions || 20;
  const completedClasses = enrollment.completed_sessions || 0;
  const remainingClasses = Math.max(0, totalClasses - completedClasses);
  const progressPercent = Math.min(100, Math.round((completedClasses / totalClasses) * 100));

  // Upcoming scheduled class
  const upcomingSchedule = schedules.find(s => s.status === 'Scheduled');
  const latestConfirmedPayment = confirmedPayments[confirmedPayments.length - 1];

  // RTO Milestone stages
  const rtoStages = [
    { title: 'Documents Verified', done: true, date: 'Admission Stage' },
    { 
      title: 'LL Application Filed', 
      done: Boolean(licence?.ll_application_date), 
      date: licence?.ll_reference ? `Ref: ${licence.ll_reference}` : 'Pending' 
    },
    { 
      title: 'Learner Licence Approved', 
      done: licence?.ll_status === 'LL Approved' || licence?.ll_status === 'DL Test Scheduled' || licence?.ll_status === 'Test Passed' || licence?.ll_status === 'Licence Issued', 
      date: licence?.ll_valid_till ? `Valid till ${licence.ll_valid_till}` : 'In Review' 
    },
    { 
      title: 'DL Practical Test Slot', 
      done: licence?.test_result === 'Passed' || licence?.ll_status === 'Licence Issued', 
      active: licence?.ll_status === 'DL Test Scheduled',
      date: licence?.test_date ? `${licence.test_date} at ${licence.rto_name}` : 'Awaiting 30-day training' 
    },
    { 
      title: 'Driving Licence Issued', 
      done: licence?.ll_status === 'Licence Issued', 
      date: licence?.licence_number ? `DL No: ${licence.licence_number}` : 'Post Practical Test' 
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Top Banner Alert (If DL Test scheduled or Next class is today) */}
      {licence?.test_date && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600/15 via-blue-500/10 to-indigo-600/15 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  RTO Driving Practical Test Confirmed!
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Confirmed Slot
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Scheduled on <strong className="text-blue-600 dark:text-blue-400 font-semibold">{licence.test_date}</strong> at {licence.rto_name}. Training car will be arranged by academy.
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectTab('licence')}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md shadow-blue-600/20 flex items-center gap-1.5 shrink-0"
          >
            <span>View RTO Details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Hero Welcome Card */}
      <div className="bg-gradient-to-r from-[#14243A] via-[#111E32] to-[#0B1728] border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-white">
        {/* Ambient lighting effect */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          {/* Student Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#3B82F6] text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
              {student.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-black tracking-tight text-white">{student.full_name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {student.student_code}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {student.status}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {enrollment.course_name} • Enrolled on {student.admission_date}
              </p>
            </div>
          </div>

          {/* Progress Circular Badge & Quick Count */}
          <div className="flex items-center gap-6 self-start md:self-auto">
            <div className="text-right">
              <div className="text-3xl font-black text-blue-400 tabular-nums">
                {completedClasses} <span className="text-base text-slate-400 font-normal">/ {totalClasses}</span>
              </div>
              <span className="text-xs text-slate-300">Sessions Completed</span>
            </div>

            <div className="w-16 h-16 rounded-full border-4 border-slate-700/80 bg-slate-900/80 flex flex-col items-center justify-center relative font-black text-white shadow-inner">
              <span className="text-sm">{progressPercent}%</span>
              <span className="text-[9px] text-slate-400 font-normal">Done</span>
            </div>
          </div>
        </div>

        {/* Course Progress Bar */}
        <div className="mt-6 space-y-1.5 relative z-10">
          <div className="flex justify-between text-xs text-slate-300 font-medium">
            <span>Overall Course Curriculum Progress</span>
            <span className="text-emerald-400 font-bold">{remainingClasses} Sessions Remaining</span>
          </div>
          <div className="w-full bg-slate-800/80 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700/60">
            <div 
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-md"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* DEDICATED COURSE COMPLETION CERTIFICATE SECTION */}
      <MyCertificateCard
        student={student}
        enrollment={enrollment}
        certificate={certificate}
        onOpenPreview={onOpenCertificatePreview || (() => {})}
        onDownloadClick={onDownloadCertificate || (() => {})}
        onSimulateCompletion={onSimulateCompletion}
        isSimulating={isSimulating}
      />

      {/* Section 5: The 6 Mandatory KPI Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Key Performance Metrics
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">Real-Time Backend Synced</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Card 1: Total Driving Classes */}
          <div 
            onClick={() => onSelectTab('course')}
            className="p-4 rounded-2xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-[11px] font-semibold">Total Classes</span>
              <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
              {totalClasses}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
              Allocated sessions
            </span>
          </div>

          {/* Card 2: Completed Classes */}
          <div 
            onClick={() => onSelectTab('attendance')}
            className="p-4 rounded-2xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-[11px] font-semibold">Completed</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition" />
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
              {completedClasses}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
              Valid attendance records
            </span>
          </div>

          {/* Card 3: Remaining Classes */}
          <div 
            onClick={() => onSelectTab('progress')}
            className="p-4 rounded-2xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-[11px] font-semibold">Remaining</span>
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition" />
            </div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 tabular-nums">
              {remainingClasses}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
              Lessons to master
            </span>
          </div>

          {/* Card 4: Fees Paid */}
          <div 
            onClick={() => onSelectTab('fees')}
            className="p-4 rounded-2xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-[11px] font-semibold">Fees Paid</span>
              <IndianRupee className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
              ₹{totalPaid.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
              Confirmed payments
            </span>
          </div>

          {/* Card 5: Pending Fees */}
          <div 
            onClick={() => onSelectTab('fees')}
            className="p-4 rounded-2xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-[11px] font-semibold">Pending Fees</span>
              <AlertCircle className={`w-4 h-4 ${outstandingBalance > 0 ? 'text-rose-500' : 'text-slate-400'}`} />
            </div>
            <div className={`text-xl sm:text-2xl font-black tabular-nums ${outstandingBalance > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
              ₹{outstandingBalance.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
              {outstandingBalance > 0 ? 'Outstanding balance' : 'Fully cleared'}
            </span>
          </div>

          {/* Card 6: Licence Status */}
          <div 
            onClick={() => onSelectTab('licence')}
            className="p-4 rounded-2xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-[11px] font-semibold">Licence Status</span>
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition" />
            </div>
            <div className="text-xs font-black text-slate-900 dark:text-white truncate">
              {licence?.ll_status || 'In Process'}
            </div>
            <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 mt-1 block truncate">
              {licence?.rto_name || 'RTO MH-12'}
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Operations & Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Next Class & Session Progress Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Next Scheduled Driving Class Card */}
          {upcomingSchedule ? (
            <div className="bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Calendar className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Next Driving Lesson</h3>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Arrive 10 minutes prior to session start</span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Confirmed
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 block uppercase tracking-wider">
                      Lesson Topic
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                      {upcomingSchedule.topic}
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono">
                    Session In Pipeline
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Date & Time:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {new Date(upcomingSchedule.scheduled_start).toLocaleString('en-IN', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Instructor & Vehicle:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate block">
                      {upcomingSchedule.instructor_name} • {upcomingSchedule.vehicle_name || 'Dual Control Car'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                {instructor?.phone && (
                  <a
                    href={`tel:${instructor.phone}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Phone className="w-3.5 h-3.5" /> Call Instructor ({instructor.phone})
                  </a>
                )}
                <button
                  onClick={() => onSelectTab('schedule')}
                  className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white flex items-center gap-1"
                >
                  View Full Schedule <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl p-6 shadow-sm text-center py-8 space-y-3">
              <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Pending Class Scheduled Today</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Academy dispatchers assign lesson slots based on instructor availability and syllabus sequence.
              </p>
              <button
                onClick={() => onSelectTab('schedule')}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition"
              >
                Browse Schedule Calendar
              </button>
            </div>
          )}

          {/* Quick Curriculum Mastery Snapshot */}
          <div className="bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Curriculum Progress Snapshot
              </h3>
              <button
                onClick={() => onSelectTab('progress')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                View All {enrollment.session_allocations?.length || 0} Modules <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {enrollment.session_allocations?.slice(0, 5).map((sa) => {
                const isComplete = sa.completed_count >= sa.allocated_count;
                const pct = Math.round((sa.completed_count / sa.allocated_count) * 100);
                return (
                  <div
                    key={sa.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {sa.session_name_snapshot}
                        </span>
                        <span className={`font-mono font-bold ${isComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`}>
                          {sa.completed_count} / {sa.allocated_count}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${isComplete ? 'bg-emerald-500' : 'bg-blue-600'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isComplete ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> Done
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {sa.allocated_count - sa.completed_count} left
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: RTO Timeline, Quick Receipts & Assigned Instructor (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Driving Licence Lifecycle Timeline Preview */}
          <div className="bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                RTO Licence Lifecycle
              </h3>
              <button
                onClick={() => onSelectTab('licence')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
              >
                Tracker <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {rtoStages.map((stg, idx) => (
                <div key={idx} className="relative">
                  <div className={`absolute -left-[27px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                    stg.done 
                      ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' 
                      : stg.active
                      ? 'bg-blue-600 text-white animate-pulse'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600'
                  }`}>
                    {stg.done ? <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" /> : <span className="w-1.5 h-1.5 rounded-full bg-current" />}
                  </div>

                  <div className={`p-3 rounded-2xl border text-xs ${
                    stg.active
                      ? 'bg-blue-500/10 border-blue-500/30 text-blue-900 dark:text-blue-200'
                      : stg.done
                      ? 'bg-slate-50 dark:bg-[#0B1728]/60 border-[#E5EAF1] dark:border-[#1E293B] text-slate-800 dark:text-slate-200'
                      : 'bg-slate-50/50 dark:bg-[#0B1728]/30 border-transparent text-slate-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{stg.title}</span>
                      {stg.active && (
                        <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-blue-600 text-white">
                          CURRENT
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{stg.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructor & Training Vehicle Card */}
          {instructor && (
            <div className="bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl p-6 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Car className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Assigned Driving Instructor
              </h3>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/15 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-sm">
                    {instructor.full_name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">{instructor.full_name}</h4>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {instructor.experience_years} Years Exp • {instructor.instructor_code}
                    </span>
                  </div>
                </div>
                {instructor.phone && (
                  <a
                    href={`tel:${instructor.phone}`}
                    className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-blue-600 dark:text-blue-400 transition"
                    title="Call Instructor"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                )}
              </div>

              {vehicle && (
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex items-center gap-3 text-xs">
                  <Car className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white block">
                      {vehicle.brand} {vehicle.model}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      {vehicle.registration_number} {vehicle.is_dual_control ? '• Dual Control Fitted' : ''}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Payment & Official Receipt Shortcut */}
          <div className="bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Fee Payment Status
              </h3>
              <button
                onClick={() => onSelectTab('fees')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Ledger <ChevronRight className="w-3 h-3 inline" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Total Course Fee:</span>
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  ₹{enrollment.agreed_fee.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Balance Pending:</span>
                <span className={`text-lg font-black ${outstandingBalance > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  ₹{outstandingBalance.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {latestConfirmedPayment && latestConfirmedPayment.receipt_number && (
              <button
                onClick={() => onOpenReceipt(latestConfirmedPayment)}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Official Receipt ({latestConfirmedPayment.receipt_number})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};