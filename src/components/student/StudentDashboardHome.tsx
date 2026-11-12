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
import { StudentLLNotificationBanner } from '@/components/licence/StudentLLNotificationBanner';
import { StudentCourseCalendar } from './StudentCourseCalendar';

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
  const [mountedTime, setMountedTime] = React.useState<number | null>(null);

  React.useEffect(() => {
    setMountedTime(Date.now());
    const interval = setInterval(() => {
      setMountedTime(Date.now());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Financial calculations
  const confirmedPayments = payments.filter(p => p.status === 'Confirmed');
  const totalPaid = confirmedPayments.reduce((sum, p) => sum + p.amount, 0);
  const outstandingBalance = Math.max(0, enrollment.agreed_fee - totalPaid);

  // Verified Distinct Class Days (multiple sessions on same date counted as 1 distinct class day)
  const distinctAttendedDates = Array.from(
    new Set(attendance.filter(a => a.status === 'Present').map(a => a.attendance_date.split('T')[0]))
  );
  const totalCourseDays = enrollment.total_sessions || 30;
  const completedClassDays = distinctAttendedDates.length;
  const remainingClassDays = Math.max(0, totalCourseDays - completedClassDays);
  const courseCompletionPercentage = Math.min(100, Math.round((completedClassDays / totalCourseDays) * 100));

  // Total session allocation count
  const totalSessions = enrollment.total_sessions || 30;
  const completedSessions = enrollment.completed_sessions || completedClassDays;
  const completedClasses = completedClassDays;
  const totalClasses = totalCourseDays;
  const progressPercent = courseCompletionPercentage;
  const remainingClasses = remainingClassDays;

  // Upcoming scheduled class
  const upcomingSchedule = schedules.find(s => s.status === 'Scheduled');
  const latestConfirmedPayment = confirmedPayments[confirmedPayments.length - 1];

  // Reschedule Modal State
  const [isRescheduleOpen, setIsRescheduleOpen] = React.useState(false);
  const [rescheduleReason, setRescheduleReason] = React.useState('College exam / Work conflict');
  const [rescheduleDate, setRescheduleDate] = React.useState('');
  const [rescheduleSlot, setRescheduleSlot] = React.useState('Morning 08:00 AM - 09:00 AM');
  const [rescheduleSubmitted, setRescheduleSubmitted] = React.useState(false);

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
      {/* Learning Licence Automatic Reminder & Milestone Tracker */}
      <StudentLLNotificationBanner student={student} enrollment={enrollment} />

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
                {completedClassDays} <span className="text-base text-slate-400 font-normal">/ {totalCourseDays}</span>
              </div>
              <span className="text-xs text-slate-300">Sessions Completed</span>
            </div>

            <div className="w-16 h-16 rounded-full border-4 border-slate-700/80 bg-slate-900/80 flex flex-col items-center justify-center relative font-black text-white shadow-inner">
              <span className="text-sm">{courseCompletionPercentage}%</span>
              <span className="text-[9px] text-slate-400 font-normal">Done</span>
            </div>
          </div>
        </div>

        {/* Course Progress Bar */}
        <div className="mt-6 space-y-1.5 relative z-10">
          <div className="flex justify-between text-xs text-slate-300 font-medium">
            <span>Overall Course Curriculum Progress</span>
            <span className="text-emerald-400 font-bold">{remainingClassDays} Sessions Remaining</span>
          </div>
          <div className="w-full bg-slate-800/80 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700/60">
            <div 
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-700 shadow-md"
              style={{ width: `${courseCompletionPercentage}%` }}
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

      {/* Section 2: The 6 Required Summary Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Dashboard Overview
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">Verified Database Records</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Card 1: Total Course Days */}
          <div 
            onClick={() => onSelectTab('calendar')}
            className="p-4 rounded-2xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-[11px] font-semibold">Total Days</span>
              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
              {totalCourseDays}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
              Required course days
            </span>
          </div>

          {/* Card 2: Completed Class Days */}
          <div 
            onClick={() => onSelectTab('calendar')}
            className="p-4 rounded-2xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-[11px] font-semibold">Completed Days</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition" />
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
              {completedClassDays}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
              Distinct attended days
            </span>
          </div>

          {/* Card 3: Remaining Class Days */}
          <div 
            onClick={() => onSelectTab('calendar')}
            className="p-4 rounded-2xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-[11px] font-semibold">Remaining Days</span>
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition" />
            </div>
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400 tabular-nums">
              {remainingClassDays}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
              Days to graduate
            </span>
          </div>

          {/* Card 4: Course Completion Percentage */}
          <div 
            onClick={() => onSelectTab('course')}
            className="p-4 rounded-2xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-[11px] font-semibold">Completion</span>
              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition" />
            </div>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400 tabular-nums">
              {courseCompletionPercentage}%
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
              Curriculum mastery
            </span>
          </div>

          {/* Card 5: Next Scheduled Class */}
          <div 
            onClick={() => onSelectTab('schedule')}
            className="p-4 rounded-2xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-[11px] font-semibold">Next Class</span>
              <Car className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition" />
            </div>
            <div className="text-xs font-black text-slate-900 dark:text-white truncate">
              {upcomingSchedule ? new Date(upcomingSchedule.scheduled_start).toLocaleDateString('en-IN', { weekday: 'short', hour: '2-digit', minute: '2-digit' }) : 'Awaiting Slot'}
            </div>
            <span className="text-[10px] text-purple-600 dark:text-purple-400 mt-1 block truncate">
              {upcomingSchedule ? upcomingSchedule.instructor_name.split(' ')[0] : 'Desk dispatch'}
            </span>
          </div>

          {/* Card 6: Outstanding Fee Balance */}
          <div 
            onClick={() => onSelectTab('fees')}
            className="p-4 rounded-2xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm hover:shadow-md transition cursor-pointer group"
          >
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-[11px] font-semibold">Balance Due</span>
              <IndianRupee className={`w-4 h-4 ${outstandingBalance > 0 ? 'text-rose-500' : 'text-emerald-500'}`} />
            </div>
            <div className={`text-xl sm:text-2xl font-black tabular-nums ${outstandingBalance > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              ₹{outstandingBalance.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
              {outstandingBalance > 0 ? 'Outstanding fee' : 'Fully settled'}
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Operations & Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Next Class & Session Progress Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Next Scheduled Driving Class Card with Part 11 Countdown */}
          {upcomingSchedule ? (() => {
            const startDate = new Date(upcomingSchedule.scheduled_start);
            const targetMs = startDate.getTime();
            let countdownText = 'Upcoming Next';
            if (mountedTime !== null) {
              const diffMs = targetMs - mountedTime;
              if (diffMs > 0) {
                const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                if (days > 0) {
                  countdownText = `${days} Day${days > 1 ? 's' : ''}, ${hours} Hour${hours > 1 ? 's' : ''} Remaining`;
                } else if (hours > 0) {
                  countdownText = `${hours} Hour${hours > 1 ? 's' : ''}, ${mins} Mins Remaining`;
                } else {
                  countdownText = `${mins} Mins Remaining`;
                }
              } else if (diffMs > -3600000) {
                countdownText = 'Class In Progress Now';
              } else {
                countdownText = 'Completed';
              }
            }

            const formattedNextDate = startDate.toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long'
            });
            const formattedNextTime = startDate.toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            });

            return (
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

                {/* Countdown Spotlight Banner (Part 11) */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-600/15 via-indigo-600/15 to-purple-600/10 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                      Upcoming Class Countdown
                    </span>
                    <div className="font-mono text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      Countdown: {countdownText}
                    </div>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Next Class: <strong>{formattedNextDate}</strong> • Time: <strong>{formattedNextTime}</strong>
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/60 dark:bg-[#0B1728]/80 border border-blue-500/20 text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block font-medium">Remaining Quota</span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs">
                      {remainingClassDays} Days / {Math.max(0, totalSessions - completedSessions)} Sessions
                    </span>
                  </div>
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
                        {formattedNextDate}, {formattedNextTime}
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
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsRescheduleOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-xs font-bold transition"
                    >
                      Request Reschedule
                    </button>
                    <button
                      onClick={() => onSelectTab('schedule')}
                      className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-white flex items-center gap-1"
                    >
                      Full Schedule <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Strict Security Notice: No Self-Attendance */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1728] border border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>Attendance marking is certified directly by your instructor on location. Students cannot mark their own attendance.</span>
                </div>
              </div>
            );
          })() : (
            <div className="bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl p-6 shadow-sm text-center py-8 space-y-3">
              <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Upcoming Class Scheduled</h3>
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

      {/* Course Calendar: 30-Day Course Slots & Attendance Progress */}
      <div className="pt-2">
        <StudentCourseCalendar
          enrollment={enrollment}
          attendance={attendance}
          schedules={schedules}
          instructor={instructor}
          vehicle={vehicle}
        />
      </div>

      {/* Reschedule Request Modal */}
      {isRescheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#111E32] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 relative">
            <button
              onClick={() => {
                setIsRescheduleOpen(false);
                setRescheduleSubmitted(false);
              }}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition"
            >
              ✕
            </button>

            <div className="space-y-1">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Request Slot Reschedule
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Submit your preferred date and time. Desk dispatchers will adjust your schedule without reducing session quotas.
              </p>
            </div>

            {rescheduleSubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Request Dispatched!</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Your reschedule preference has been submitted to the front desk. You will receive an SMS and portal update once confirmed.
                </p>
                <button
                  onClick={() => {
                    setIsRescheduleOpen(false);
                    setRescheduleSubmitted(false);
                  }}
                  className="mt-2 w-full py-2.5 rounded-xl bg-slate-900 dark:bg-blue-600 text-white dark:text-white font-bold text-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setRescheduleSubmitted(true);
                }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Preferred New Date
                  </label>
                  <input
                    type="date"
                    required
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1728] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Preferred Time Slot
                  </label>
                  <select
                    value={rescheduleSlot}
                    onChange={(e) => setRescheduleSlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1728] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Morning 08:00 AM - 09:00 AM">Morning 08:00 AM - 09:00 AM</option>
                    <option value="Morning 09:00 AM - 10:00 AM">Morning 09:00 AM - 10:00 AM</option>
                    <option value="Afternoon 04:00 PM - 05:00 PM">Afternoon 04:00 PM - 05:00 PM</option>
                    <option value="Evening 05:00 PM - 06:00 PM">Evening 05:00 PM - 06:00 PM</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Reason for Reschedule
                  </label>
                  <select
                    value={rescheduleReason}
                    onChange={(e) => setRescheduleReason(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1728] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="College exam / Academic conflict">College exam / Academic conflict</option>
                    <option value="Office work meeting / Travel">Office work meeting / Travel</option>
                    <option value="Health / Personal emergency">Health / Personal emergency</option>
                    <option value="Weather / Heavy rain">Weather / Heavy rain</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-lg shadow-blue-600/25"
                  >
                    Send Reschedule Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
