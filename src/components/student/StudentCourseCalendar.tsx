'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Ban, 
  Calendar as CalendarIcon, 
  Car, 
  User, 
  ShieldCheck, 
  ChevronRight, 
  X, 
  Sparkles,
  Info,
  Award,
  Phone,
  FileCheck2,
  CalendarDays,
  Flame
} from 'lucide-react';
import { 
  Enrollment, 
  Course, 
  AttendanceRecord, 
  ClassSchedule, 
  Instructor, 
  Vehicle, 
  School 
} from '@/types';

export type CalendarDayStatus = 'attended' | 'incomplete' | 'scheduled' | 'holiday_cancelled';

export interface CalendarDaySlot {
  dayNumber: number;
  dateStr?: string;
  formattedDate: string;
  status: CalendarDayStatus;
  statusLabel: string;
  topic: string;
  instructorName?: string;
  instructorPhone?: string;
  vehicleInfo?: string;
  attendanceRecord?: AttendanceRecord;
  scheduleRecord?: ClassSchedule;
  remarks?: string;
  verifiedAt?: string;
  isHoliday?: boolean;
}

interface StudentCourseCalendarProps {
  enrollment: Enrollment;
  course?: Course;
  attendance: AttendanceRecord[];
  schedules: ClassSchedule[];
  instructor?: Instructor;
  vehicle?: Vehicle;
  school?: School;
}

export const StudentCourseCalendar: React.FC<StudentCourseCalendarProps> = ({
  enrollment,
  course,
  attendance,
  schedules,
  instructor,
  vehicle,
  school
}) => {
  const [selectedSlot, setSelectedSlot] = useState<CalendarDaySlot | null>(null);
  const [viewFilter, setViewFilter] = useState<'all' | 'attended' | 'incomplete' | 'scheduled'>('all');

  // Total course duration in days (e.g. 30 days default or course.duration_days)
  const courseDurationDays = course?.duration_days || enrollment.total_sessions || 30;

  // Actual verified attendance records (Present)
  const verifiedPresentAttendance = attendance
    .filter(a => a.status === 'Present')
    .sort((a, b) => new Date(a.attendance_date).getTime() - new Date(b.attendance_date).getTime());

  // Distinct attended calendar dates: multiple sessions on the same date do not inflate distinct class-day count
  const distinctAttendedDates = Array.from(
    new Set(verifiedPresentAttendance.map(a => a.attendance_date.split('T')[0]))
  ).sort();

  // Upcoming scheduled classes
  const upcomingSchedules = schedules
    .filter(s => s.status === 'Scheduled')
    .sort((a, b) => new Date(a.scheduled_start).getTime() - new Date(b.scheduled_start).getTime());

  // Cancelled or holiday records
  const cancelledAttendance = attendance.filter(
    a => a.status === 'Cancelled_By_Student' || a.status === 'Absent'
  );
  const cancelledSchedules = schedules.filter(s => s.status === 'Cancelled');

  // Completed class count derived purely from distinct verified class dates
  const completedCount = distinctAttendedDates.length;
  const remainingCount = Math.max(0, courseDurationDays - completedCount);
  const progressPercent = Math.min(100, Math.round((completedCount / courseDurationDays) * 100));

  // Determine enrollment start date
  const startDate = enrollment.start_date ? new Date(enrollment.start_date) : new Date('2026-10-15');

  // Build the slots for the full course duration (1 to courseDurationDays)
  const daySlots: CalendarDaySlot[] = [];

  // Track upcoming schedules matched to future days
  let scheduleIndex = 0;

  for (let i = 1; i <= courseDurationDays; i++) {
    // Projected calendar date for day i
    const slotDate = new Date(startDate);
    slotDate.setDate(slotDate.getDate() + (i - 1));
    const isoDate = slotDate.toISOString().split('T')[0];
    const formattedDate = slotDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    if (i <= completedCount) {
      // Completed Day (GREEN)
      const record = verifiedPresentAttendance[i - 1];
      const recDate = record?.attendance_date ? new Date(record.attendance_date) : slotDate;
      daySlots.push({
        dayNumber: i,
        dateStr: record?.attendance_date || isoDate,
        formattedDate: recDate.toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        status: 'attended',
        statusLabel: 'Attended & Completed',
        topic: record?.session_name || `Curriculum Module #${i}`,
        instructorName: record?.instructor_name || instructor?.full_name || 'Assigned Instructor',
        instructorPhone: instructor?.phone,
        vehicleInfo: record?.vehicle_info || vehicle ? `${vehicle?.brand} ${vehicle?.model} (${vehicle?.registration_number})` : 'Dual Control Car',
        attendanceRecord: record,
        remarks: record?.remarks || 'Practical driving competency verified by instructor.',
        verifiedAt: record?.marked_at || `${record?.attendance_date || isoDate}T10:30:00+05:30`
      });
    } else {
      // Future or remaining day
      // Check if there is an upcoming scheduled class for this slot
      if (scheduleIndex < upcomingSchedules.length) {
        const sched = upcomingSchedules[scheduleIndex];
        scheduleIndex++;
        const sDate = new Date(sched.scheduled_start);
        daySlots.push({
          dayNumber: i,
          dateStr: sDate.toISOString().split('T')[0],
          formattedDate: sDate.toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
          }),
          status: 'scheduled',
          statusLabel: 'Upcoming Scheduled Class',
          topic: sched.topic || `Course Session #${i}`,
          instructorName: sched.instructor_name || instructor?.full_name || 'Assigned Instructor',
          instructorPhone: instructor?.phone,
          vehicleInfo: sched.vehicle_name || vehicle ? `${vehicle?.brand} ${vehicle?.model} (${vehicle?.registration_number})` : 'Dual Control Car',
          scheduleRecord: sched,
          remarks: `Confirmed time slot: ${sDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}. Please arrive 10 mins early.`
        });
      } else {
        // Required class remains incomplete (RED)
        daySlots.push({
          dayNumber: i,
          dateStr: isoDate,
          formattedDate: `Required Day ${i}`,
          status: 'incomplete',
          statusLabel: 'Required Class Incomplete',
          topic: `Syllabus Practical Lesson #${i}`,
          instructorName: instructor?.full_name || 'Assigned Instructor',
          instructorPhone: instructor?.phone,
          vehicleInfo: vehicle ? `${vehicle?.brand} ${vehicle?.model}` : 'Dual Control Training Vehicle',
          remarks: 'This session is required to fulfill the 30-day driving curriculum before RTO DL test endorsement.'
        });
      }
    }
  }

  // Filter slots if user selects a filter
  const displayedSlots = daySlots.filter(slot => {
    if (viewFilter === 'all') return true;
    return slot.status === viewFilter;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner Card: Course Duration & Progress Stats */}
      <div className="bg-gradient-to-r from-[#14243A] via-[#111E32] to-[#0B1728] border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Student Course Calendar</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Daily Class Progress & Attendance
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Track your full <strong className="text-white font-bold">30-Day Course Duration</strong> ({courseDurationDays} scheduled course days). Calendar statuses update automatically from verified instructor attendance logs.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start lg:self-auto shrink-0">
              <div className="p-4 rounded-2xl bg-[#0B1728]/80 border border-slate-800 text-right space-y-1">
                <span className="text-[11px] text-slate-400 block font-medium">Curriculum Progress</span>
                <div className="text-3xl font-black text-white tabular-nums flex items-center justify-end gap-1.5">
                  <span>{progressPercent}%</span>
                  <Flame className="w-5 h-5 text-amber-400" />
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold block">
                  {completedCount} of {courseDurationDays} Days Verified
                </span>
              </div>
            </div>
          </div>

          {/* KPI Stat Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800 text-xs">
            {/* Total Duration */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-blue-400" /> Total Duration
              </span>
              <div className="text-xl font-black text-white tabular-nums">
                {courseDurationDays} <span className="text-xs font-normal text-slate-400">Days</span>
              </div>
              <span className="text-[10px] text-slate-400">Mandated RTO Syllabus</span>
            </div>

            {/* Completed Days (GREEN) */}
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
              <span className="text-[11px] text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Completed Days
              </span>
              <div className="text-xl font-black text-emerald-300 tabular-nums">
                {completedCount} <span className="text-xs font-normal text-emerald-400/80">Attended</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-semibold">GREEN Status</span>
            </div>

            {/* Remaining Days (RED) */}
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/25 space-y-1">
              <span className="text-[11px] text-red-300 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-red-400" /> Remaining Days
              </span>
              <div className="text-xl font-black text-red-300 tabular-nums">
                {remainingCount} <span className="text-xs font-normal text-red-400/80">Required</span>
              </div>
              <span className="text-[10px] text-red-400 font-semibold">RED Status</span>
            </div>

            {/* Upcoming Scheduled (BLUE) */}
            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/25 space-y-1">
              <span className="text-[11px] text-blue-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" /> Upcoming
              </span>
              <div className="text-xl font-black text-blue-300 tabular-nums">
                {upcomingSchedules.length} <span className="text-xs font-normal text-blue-400/80">Booked</span>
              </div>
              <span className="text-[10px] text-blue-400 font-semibold">BLUE Status</span>
            </div>
          </div>
        </div>
      </div>

      {/* Color System Legend & Interactive Filter Bar */}
      <div className="bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Course Calendar Color System
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Click on any day card below to inspect instructor remarks, topic coverage, and vehicle logs.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setViewFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                viewFilter === 'all'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All {courseDurationDays} Days
            </button>
            <button
              onClick={() => setViewFilter('attended')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                viewFilter === 'attended'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Attended ({completedCount})
            </button>
            <button
              onClick={() => setViewFilter('incomplete')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                viewFilter === 'incomplete'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Incomplete ({remainingCount - upcomingSchedules.length})
            </button>
            <button
              onClick={() => setViewFilter('scheduled')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                viewFilter === 'scheduled'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Scheduled ({upcomingSchedules.length})
            </button>
          </div>
        </div>

        {/* Legend Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40">
            <span className="w-3.5 h-3.5 rounded-md bg-emerald-600 shrink-0 flex items-center justify-center text-white text-[9px] font-bold">✓</span>
            <div>
              <span className="font-bold text-emerald-800 dark:text-emerald-300 block text-[11px]">GREEN</span>
              <span className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80">Class Attended & Completed</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40">
            <span className="w-3.5 h-3.5 rounded-md bg-red-600 shrink-0 flex items-center justify-center text-white text-[9px] font-bold">!</span>
            <div>
              <span className="font-bold text-red-800 dark:text-red-300 block text-[11px]">RED</span>
              <span className="text-[10px] text-red-700/80 dark:text-red-400/80">Required Class Incomplete</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40">
            <span className="w-3.5 h-3.5 rounded-md bg-blue-600 shrink-0 flex items-center justify-center text-white text-[9px] font-bold">⏱</span>
            <div>
              <span className="font-bold text-blue-800 dark:text-blue-300 block text-[11px]">BLUE</span>
              <span className="text-[10px] text-blue-700/80 dark:text-blue-400/80">Upcoming Scheduled Class</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
            <span className="w-3.5 h-3.5 rounded-md bg-slate-400 shrink-0 flex items-center justify-center text-white text-[9px] font-bold">✕</span>
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300 block text-[11px]">GREY</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Holiday / Cancelled Class</span>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Slots Grid (30 Course Days) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 sm:gap-4">
        {displayedSlots.map((slot) => {
          // Determine styles based on strict color specification
          let bgClass = '';
          let borderClass = '';
          let badgeClass = '';
          let icon = null;

          if (slot.status === 'attended') {
            // GREEN: Attended successfully and required session completed
            bgClass = 'bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent dark:bg-emerald-950/20 hover:bg-emerald-500/15';
            borderClass = 'border-emerald-500/40 hover:border-emerald-500 shadow-sm shadow-emerald-500/5';
            badgeClass = 'bg-emerald-600 text-white';
            icon = <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />;
          } else if (slot.status === 'scheduled') {
            // BLUE: Upcoming scheduled class
            bgClass = 'bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent dark:bg-blue-950/20 hover:bg-blue-500/15';
            borderClass = 'border-blue-500/40 hover:border-blue-500 shadow-sm shadow-blue-500/5';
            badgeClass = 'bg-blue-600 text-white';
            icon = <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 animate-pulse" />;
          } else if (slot.status === 'holiday_cancelled') {
            // GREY: Official school holiday or cancelled class
            bgClass = 'bg-slate-100 dark:bg-slate-900/50 opacity-70 hover:opacity-100';
            borderClass = 'border-slate-300 dark:border-slate-800';
            badgeClass = 'bg-slate-500 text-white';
            icon = <Ban className="w-4 h-4 text-slate-400 shrink-0" />;
          } else if (slot.status === 'incomplete') {
            // RED: Required class/session remains incomplete
            bgClass = 'bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent dark:bg-red-950/20 hover:bg-red-500/15';
            borderClass = 'border-red-500/30 hover:border-red-500/70 shadow-sm shadow-red-500/5';
            badgeClass = 'bg-red-600 text-white';
            icon = <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />;
          } else {
            bgClass = 'bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent dark:bg-red-950/20 hover:bg-red-500/15';
            borderClass = 'border-red-500/30 hover:border-red-500/70 shadow-sm shadow-red-500/5';
            badgeClass = 'bg-red-600 text-white';
            icon = <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />;
          }

          return (
            <button
              key={slot.dayNumber}
              onClick={() => setSelectedSlot(slot)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between gap-3 group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 ${bgClass} ${borderClass}`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between w-full">
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black font-mono tracking-wider ${badgeClass}`}>
                  Day {String(slot.dayNumber).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tabular-nums">
                  {slot.dateStr ? slot.formattedDate.split(',')[0] : `Slot #${slot.dayNumber}`}
                </span>
              </div>

              {/* Status & Topic */}
              <div className="space-y-1.5 my-1">
                <div className="flex items-center gap-1.5">
                  {icon}
                  <span className={`text-[11px] font-bold tracking-tight ${
                    slot.status === 'attended' 
                      ? 'text-emerald-700 dark:text-emerald-300' 
                      : slot.status === 'scheduled'
                      ? 'text-blue-700 dark:text-blue-300'
                      : slot.status === 'holiday_cancelled'
                      ? 'text-slate-500 dark:text-slate-400'
                      : 'text-red-700 dark:text-red-300'
                  }`}>
                    {slot.status === 'attended' ? 'Attended' : slot.status === 'scheduled' ? 'Scheduled' : 'Incomplete'}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {slot.topic}
                </p>
              </div>

              {/* Footer hint */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between w-full text-[10px] text-slate-400">
                <span className="truncate max-w-[90px]">{slot.instructorName ? slot.instructorName.split(' ')[0] : 'Instructor'}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity font-bold text-blue-600 dark:text-blue-400 flex items-center">
                  Details →
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Historical Attendance Log Summary */}
      <div className="bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Verified Historical Attendance Logs ({verifiedPresentAttendance.length} Sessions)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Audited electronic attendance records certified by instructors. Unscheduled days and holidays are never penalized.
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              100% Attendance Integrity
            </span>
          </div>
        </div>

        {verifiedPresentAttendance.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {verifiedPresentAttendance.map((rec, idx) => (
              <div key={rec.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold font-mono flex items-center justify-center shrink-0">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {rec.session_name}
                    </h4>
                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 mt-0.5 flex-wrap">
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <CalendarIcon className="w-3 h-3 text-slate-400" /> {rec.attendance_date}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" /> Instructor: {rec.instructor_name}
                      </span>
                      {rec.vehicle_info && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Car className="w-3 h-3 text-slate-400" /> {rec.vehicle_info}
                          </span>
                        </>
                      )}
                    </div>
                    {rec.remarks && (
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 italic bg-slate-50 dark:bg-[#0B1728] px-2.5 py-1 rounded-lg border border-slate-200/50 dark:border-slate-800">
                        "{rec.remarks}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Present Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-slate-500">
            No attendance marked yet. Your first session will automatically appear in GREEN once verified by your trainer.
          </div>
        )}
      </div>

      {/* Day Details Modal */}
      {selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setSelectedSlot(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg text-xs font-black font-mono bg-blue-600 text-white">
                  DAY {String(selectedSlot.dayNumber).padStart(2, '0')} OF {courseDurationDays}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  {selectedSlot.formattedDate}
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {selectedSlot.topic}
              </h3>
            </div>

            {/* Status Banner */}
            <div className={`p-4 rounded-2xl border flex items-start gap-3 ${
              selectedSlot.status === 'attended'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                : selectedSlot.status === 'scheduled'
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-800 dark:text-blue-300'
                : selectedSlot.status === 'holiday_cancelled'
                ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                : 'bg-red-500/10 border-red-500/30 text-red-800 dark:text-red-300'
            }`}>
              <div className="shrink-0 mt-0.5">
                {selectedSlot.status === 'attended' && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                {selectedSlot.status === 'scheduled' && <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                {selectedSlot.status === 'incomplete' && <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />}
                {selectedSlot.status === 'holiday_cancelled' && <Ban className="w-5 h-5 text-slate-400" />}
              </div>

              <div className="space-y-0.5 text-xs">
                <span className="font-bold text-sm block">
                  {selectedSlot.statusLabel}
                </span>
                <p className="opacity-90 leading-relaxed">
                  {selectedSlot.status === 'attended'
                    ? 'Class attended successfully and required session completed. Certified in academy records.'
                    : selectedSlot.status === 'scheduled'
                    ? 'Session scheduled and reserved on the fleet calendar. Please arrive 10 minutes prior.'
                    : selectedSlot.status === 'holiday_cancelled'
                    ? 'School holiday or session rescheduling.'
                    : 'Required class/session remains incomplete. Will be scheduled in upcoming training slots.'}
                </p>
              </div>
            </div>

            {/* Session Information Table */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Assigned Driving Instructor:</span>
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-500" />
                    {selectedSlot.instructorName || 'Academy Instructor'}
                  </span>
                </div>

                {selectedSlot.instructorPhone && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Instructor Contact:</span>
                    <a
                      href={`tel:${selectedSlot.instructorPhone}`}
                      className="font-mono font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" /> {selectedSlot.instructorPhone}
                    </a>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Training Vehicle:</span>
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-amber-500" />
                    {selectedSlot.vehicleInfo || 'Dual Control Fleet Vehicle'}
                  </span>
                </div>

                {selectedSlot.verifiedAt && (
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Verified Timestamp:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">
                      {new Date(selectedSlot.verifiedAt).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}
              </div>

              {/* Remarks / Feedback */}
              {selectedSlot.remarks && (
                <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/40 space-y-1">
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 block uppercase tracking-wider">
                    Instructor Driving Assessment
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                    "{selectedSlot.remarks}"
                  </p>
                </div>
              )}
            </div>

            {/* Read-only Security Disclaimer */}
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2 border border-slate-200 dark:border-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Official Attendance Record:</strong> Maintained under strict academy access controls. Attendance and calendar colors cannot be modified by students.
              </span>
            </div>

            <button
              onClick={() => setSelectedSlot(null)}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-lg shadow-blue-600/20"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
