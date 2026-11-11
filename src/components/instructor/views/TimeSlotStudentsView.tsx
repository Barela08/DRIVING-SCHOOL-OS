'use client';

import React from 'react';
import { 
  Clock, 
  ArrowLeft, 
  Users, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Car,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { InstructorTimeSlotSummary, ClassSchedule, Student, Enrollment, AttendanceRecord } from '@/types';

interface TimeSlotStudentsViewProps {
  slot: InstructorTimeSlotSummary;
  students: Student[];
  enrollments: Enrollment[];
  todayAttendance: AttendanceRecord[];
  onBack: () => void;
  onOpenStudentProfile: (student: Student, enrollment: Enrollment, schedule?: ClassSchedule) => void;
}

export const TimeSlotStudentsView: React.FC<TimeSlotStudentsViewProps> = ({
  slot,
  students,
  enrollments,
  todayAttendance,
  onBack,
  onOpenStudentProfile
}) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200 text-slate-900 dark:text-slate-100">
      {/* Top Header & Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-600 dark:text-slate-300 hover:text-white hover:bg-slate-800 transition shadow-sm"
            title="Back to all time slots"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-lg sm:text-xl text-slate-900 dark:text-white">
                {slot.slot_label}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/25">
                {slot.slot_status}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Total Students: <strong className="text-slate-800 dark:text-slate-200">{slot.total_students}</strong> • Completed: <strong className="text-emerald-600">{slot.completed_classes}</strong> • Pending: <strong className="text-amber-600">{slot.pending_classes}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={onBack}
          className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline self-start sm:self-auto"
        >
          &larr; Back to Time Slots
        </button>
      </div>

      {/* Info notice: Strict Privacy Rule */}
      <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>
            <strong>Roster Privacy Active:</strong> Contact numbers are hidden in slot lists. To place a call, open the individual student profile.
          </span>
        </div>
      </div>

      {/* Assigned Student Cards / Table */}
      {slot.schedules.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl space-y-2">
          <Users className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Students in this Time Slot</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">All shifts for this period are unassigned.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {slot.schedules.map((schedule) => {
            const student = students.find(s => s.student_code === schedule.student_code || s.id === schedule.student_code) || ({
              id: schedule.student_code,
              student_code: schedule.student_code,
              full_name: schedule.student_name,
              phone: schedule.student_phone || '+91 98000 00000',
              status: 'Active',
              admission_date: '2026-10-15',
              created_at: '2026-10-15',
              school_id: schedule.school_id,
              user_id: `usr-${schedule.student_code}`,
              date_of_birth: '2000-01-01',
              gender: 'Other',
              address: { street: '', city: 'Pune', state: 'Maharashtra', pincode: '411001' }
            } as unknown as Student);

            const enrollment = enrollments.find(e => e.student_id === student.id || e.id === schedule.enrollment_id) || ({
              id: schedule.enrollment_id || `enr-${student.id}`,
              school_id: schedule.school_id,
              student_id: student.id,
              student_name: student.full_name,
              student_code: student.student_code,
              course_id: 'course-4w-mastery',
              course_name: schedule.course_name || 'Four Wheeler Complete Mastery Course',
              assigned_instructor_id: schedule.instructor_id,
              assigned_instructor_name: schedule.instructor_name,
              start_date: '2026-10-15',
              agreed_fee: 8500,
              status: 'Active',
              total_sessions: 20,
              completed_sessions: 0,
              session_allocations: []
            } as unknown as Enrollment);

            // Determine attendance status
            const isAttended = todayAttendance.some(
              a => (a.student_id === student.id || a.student_code === student.student_code) && a.status === 'Present'
            );

            let statusLabel: 'Upcoming' | 'Waiting' | 'In Progress' | 'Completed' | 'Absent' | 'Cancelled' | 'Rescheduled' = 'Waiting';
            if (isAttended || schedule.attendance_status === 'Present') {
              statusLabel = 'Completed';
            } else if (schedule.status === 'Cancelled') {
              statusLabel = 'Cancelled';
            } else if (schedule.status === 'No_Show') {
              statusLabel = 'Absent';
            } else if (slot.slot_status === 'Upcoming') {
              statusLabel = 'Upcoming';
            } else if (slot.slot_status === 'In Progress') {
              statusLabel = 'In Progress';
            }

            return (
              <div
                key={schedule.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                {/* Student Full Name & ID */}
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                    statusLabel === 'Completed'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                  }`}>
                    {student.full_name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {student.full_name}
                      </span>
                      <span className="font-mono text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-800/40">
                        {student.student_code}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                      Course: <strong className="text-slate-700 dark:text-slate-300 font-medium">{schedule.course_name || enrollment.course_name}</strong>
                    </span>
                  </div>
                </div>

                {/* Today's Session Type */}
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">
                    Today&apos;s Session Module
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white text-xs block">
                    {schedule.session_type || schedule.topic || 'Practical Driving'}
                  </span>
                </div>

                {/* Attendance Status Badge (Part 4 specification) */}
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                    statusLabel === 'Completed'
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                      : statusLabel === 'In Progress'
                      ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30 animate-pulse'
                      : statusLabel === 'Waiting'
                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
                      : statusLabel === 'Upcoming'
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                      : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                  }`}>
                    {statusLabel === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                    {statusLabel}
                  </span>
                </div>

                {/* Open Student Profile Button */}
                <div className="shrink-0 flex items-center justify-end">
                  <button
                    onClick={() => onOpenStudentProfile(student, enrollment, schedule)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                  >
                    <span>Open Student Profile</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
