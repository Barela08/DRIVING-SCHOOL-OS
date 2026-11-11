'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Phone, 
  ChevronRight, 
  ShieldCheck, 
  BookOpen, 
  CheckCircle2, 
  FileCheck2 
} from 'lucide-react';
import { Student, Enrollment, AttendanceRecord, LicenceRecord, LLReminderSettings, StudentDocument } from '@/types';
import { getStudentLLProgress } from '@/lib/llTrackingEngine';

interface MyStudentsViewProps {
  students: Student[];
  enrollments: Enrollment[];
  attendanceRecords: AttendanceRecord[];
  licenceRecords: LicenceRecord[];
  llReminderSettings: LLReminderSettings;
  studentDocuments?: StudentDocument[];
  onOpenStudent: (student: Student, enrollment: Enrollment) => void;
}

export const MyStudentsView: React.FC<MyStudentsViewProps> = ({
  students,
  enrollments,
  attendanceRecords,
  licenceRecords,
  llReminderSettings,
  studentDocuments = [],
  onOpenStudent
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = students.filter(s => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    return s.full_name.toLowerCase().includes(q) || 
           s.student_code.toLowerCase().includes(q) ||
           s.phone.includes(q);
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            My Assigned Students
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Learners enrolled under your training guidance. Total roster: <strong className="text-blue-600 dark:text-blue-400 font-bold">{students.length} Learners</strong>.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search learner..."
            className="w-full pl-9 pr-3 py-2 rounded-2xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] text-xs focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Student List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStudents.map(student => {
          const enrollment = enrollments.find(e => e.student_id === student.id) || {
            id: `enr-${student.id}`,
            school_id: student.school_id,
            student_id: student.id,
            student_name: student.full_name,
            student_code: student.student_code,
            course_id: 'course-4w-mastery',
            course_name: 'Four Wheeler Driving Program',
            status: 'Active',
            total_sessions: 20,
            completed_sessions: 5,
            start_date: '2026-10-15',
            agreed_fee: 8500,
            session_allocations: []
          } as unknown as Enrollment;

          const licence = licenceRecords.find(l => l.student_id === student.id);
          const llProgress = getStudentLLProgress(
            student,
            enrollment,
            attendanceRecords,
            licence,
            llReminderSettings,
            studentDocuments
          );

          const studentAttendance = attendanceRecords.filter(a => a.student_id === student.id && a.status === 'Present');
          const distinctDays = Array.from(new Set(studentAttendance.map(a => a.attendance_date.split('T')[0]))).length;
          const completionPercent = Math.min(100, Math.round((distinctDays / 30) * 100));

          return (
            <div
              key={student.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between text-xs"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/15 text-blue-600 dark:text-blue-400 font-black text-lg flex items-center justify-center shrink-0">
                      {student.full_name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {student.full_name}
                        </span>
                        <span className="font-mono text-blue-600 dark:text-blue-400 font-bold px-1.5 py-0.2 rounded bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50 text-[11px]">
                          {student.student_code}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 truncate max-w-[200px]">
                        {enrollment.course_name}
                      </span>
                    </div>
                  </div>

                  <a
                    href={`tel:${student.phone}`}
                    className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition shrink-0"
                    title={`Call ${student.full_name}`}
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400">Class Attendance</span>
                    <span className="font-bold text-slate-900 dark:text-white font-mono">
                      {distinctDays} / 30 Days ({completionPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${completionPercent}%` }}
                    />
                  </div>
                </div>

                {/* LL Status */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <FileCheck2 className="w-3.5 h-3.5 text-indigo-500" /> Learning Licence
                  </span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${llProgress.statusBadge.bg} ${llProgress.statusBadge.color}`}>
                    {llProgress.statusBadge.label}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                <button
                  onClick={() => onOpenStudent(student, enrollment)}
                  className="w-full py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
                >
                  <span>Open Full Profile & Check-in</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredStudents.length === 0 && (
          <div className="col-span-full p-12 text-center bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl space-y-2">
            <Users className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Students Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">No assigned learners matched your query.</p>
          </div>
        )}
      </div>
    </div>
  );
};
