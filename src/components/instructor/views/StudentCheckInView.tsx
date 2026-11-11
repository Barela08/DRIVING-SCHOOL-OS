'use client';

import React, { useState } from 'react';
import { 
  Search, 
  X, 
  AlertCircle, 
  ShieldCheck, 
  UserCheck, 
  Clock, 
  CheckCircle2, 
  Phone,
  ArrowRight
} from 'lucide-react';
import { 
  Student, 
  Enrollment, 
  ClassSchedule, 
  AttendanceRecord, 
  Instructor, 
  LicenceRecord, 
  LLReminderSettings, 
  StudentDocument,
  StudentSkillAssessment 
} from '@/types';
import { StudentProfileView } from './StudentProfileView';

interface StudentCheckInViewProps {
  currentInstructor: Instructor;
  students: Student[];
  enrollments: Enrollment[];
  schedules: ClassSchedule[];
  attendanceRecords: AttendanceRecord[];
  licenceRecords: LicenceRecord[];
  llReminderSettings: LLReminderSettings;
  studentDocuments?: StudentDocument[];
  skillAssessments?: StudentSkillAssessment[];
  onMarkAttendance: (allocationId: string, remarks?: string, scheduleId?: string) => Promise<{ success: boolean; message: string }>;
  onSaveSkillAssessment?: (assessment: Partial<StudentSkillAssessment>) => Promise<void>;
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
  initialStudentCode?: string;
}

export const StudentCheckInView: React.FC<StudentCheckInViewProps> = ({
  currentInstructor,
  students,
  enrollments,
  schedules,
  attendanceRecords,
  licenceRecords,
  llReminderSettings,
  studentDocuments = [],
  skillAssessments = [],
  onMarkAttendance,
  onSaveSkillAssessment,
  addToast,
  initialStudentCode = ''
}) => {
  const [studentIdInput, setStudentIdInput] = useState(initialStudentCode);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  
  // Matched authorized student state
  const [matchedStudent, setMatchedStudent] = useState<Student | null>(null);
  const [matchedEnrollment, setMatchedEnrollment] = useState<Enrollment | null>(null);
  const [matchedSchedule, setMatchedSchedule] = useState<ClassSchedule | null>(null);

  const handleClear = () => {
    setStudentIdInput('');
    setSearchError('');
    setMatchedStudent(null);
    setMatchedEnrollment(null);
    setMatchedSchedule(null);
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchError('');
    setMatchedStudent(null);
    setMatchedEnrollment(null);
    setMatchedSchedule(null);

    const query = studentIdInput.trim().toUpperCase();
    if (!query) {
      setSearchError('Please enter a Student ID (e.g. MDA-2026-00125)');
      return;
    }

    setIsSearching(true);

    try {
      // 1. Try server endpoint first for authoritative verification
      const res = await fetch('/api/instructor/student-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: query })
      });

      const data = await res.json();

      if (res.ok && data.success && data.student) {
        setMatchedStudent(data.student);
        setMatchedEnrollment(data.enrollment);
        setMatchedSchedule(data.todaySchedule || null);
        return;
      }

      if (res.status === 403) {
        // Exact message from Part 6
        setSearchError('Access denied. This student is not assigned to your account.');
        return;
      }

      if (res.status === 404 || !data.success) {
        // Fallback to client database lookup if server is running mock/isolated
        const localStudent = students.find(
          s => s.student_code.toUpperCase() === query || s.id.toUpperCase() === query
        );

        if (!localStudent) {
          // Exact message from Part 6
          setSearchError('Student not found. Please check the Student ID.');
          return;
        }

        const localEnrollment = enrollments.find(e => e.student_id === localStudent.id);
        if (!localEnrollment) {
          setSearchError('Student not found. Please check the Student ID.');
          return;
        }

        // Verify assignment to this instructor
        if (localEnrollment.assigned_instructor_id !== currentInstructor.id) {
          // Exact message from Part 6
          setSearchError('Access denied. This student is not assigned to your account.');
          return;
        }

        // Find today's schedule
        const todayStr = new Date().toISOString().split('T')[0];
        const localSched = schedules.find(
          s => s.enrollment_id === localEnrollment.id && 
               (s.scheduled_start.startsWith(todayStr) || s.scheduled_start.startsWith('2026-11-10'))
        ) || null;

        setMatchedStudent(localStudent);
        setMatchedEnrollment(localEnrollment);
        setMatchedSchedule(localSched);
      }
    } catch {
      // Local check fallback in case of offline/network issues
      const localStudent = students.find(
        s => s.student_code.toUpperCase() === query || s.id.toUpperCase() === query
      );

      if (!localStudent) {
        setSearchError('Student not found. Please check the Student ID.');
        return;
      }

      const localEnrollment = enrollments.find(e => e.student_id === localStudent.id);
      if (!localEnrollment || localEnrollment.assigned_instructor_id !== currentInstructor.id) {
        setSearchError('Access denied. This student is not assigned to your account.');
        return;
      }

      setMatchedStudent(localStudent);
      setMatchedEnrollment(localEnrollment);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200 text-slate-900 dark:text-slate-100">
      {/* ========================================================================= */}
      {/* PART 6: INITIAL SEARCH INTERFACE                                          */}
      {/* Initially show ONLY: Title, Student ID input, Search button, Clear button, */}
      {/* Short instructions. NO entire database or contact numbers displayed!       */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Student Check-in
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enter the unique Student ID to verify enrollment, check in for today&apos;s practical training, and inspect driving progress.
          </p>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearch} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={studentIdInput}
                onChange={e => {
                  setStudentIdInput(e.target.value);
                  if (searchError) setSearchError('');
                }}
                placeholder="Enter Student ID (e.g. MDA-2026-00125)"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white font-mono text-xs sm:text-sm font-bold focus:outline-none focus:border-blue-600 transition"
              />
              {studentIdInput && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-white p-0.5"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isSearching || !studentIdInput.trim()}
                className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition"
              >
                <Search className="w-4 h-4" />
                <span>{isSearching ? 'Verifying...' : 'Search'}</span>
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Short instructions matching Part 6 */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
            <span>
              Instructions: Provide the exact student ID from the learner&apos;s smart admission receipt or academy app.
            </span>
            <span className="font-mono text-blue-600 dark:text-blue-400 font-bold hidden md:inline">
              Your Instructor ID: {currentInstructor.instructor_code}
            </span>
          </div>
        </form>

        {/* Error Alert with Exact Prompt Messaging */}
        {searchError && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs flex items-center gap-3 animate-in fade-in duration-150">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-500" />
            <div className="space-y-0.5">
              <span className="font-bold text-sm block">{searchError}</span>
              <p className="text-[11px] opacity-90">
                {searchError.includes('Access denied')
                  ? 'For security and learner privacy, instructors can only inspect and check in students assigned to their official training vehicle.'
                  : 'Double-check the Student ID format (e.g. MDA-2026-00125 or DS-2026-00101) and try again.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MATCHED STUDENT PROFILE (Opens immediately after successful verification) */}
      {/* ========================================================================= */}
      {matchedStudent && matchedEnrollment && (
        <div className="animate-in fade-in duration-300">
          <StudentProfileView
            student={matchedStudent}
            enrollment={matchedEnrollment}
            todaySchedule={matchedSchedule}
            attendanceHistory={attendanceRecords.filter(a => a.student_id === matchedStudent.id)}
            licenceRecord={licenceRecords.find(l => l.student_id === matchedStudent.id)}
            llReminderSettings={llReminderSettings}
            studentDocuments={studentDocuments.filter(d => d.student_id === matchedStudent.id)}
            initialSkillAssessment={skillAssessments.find(s => s.student_id === matchedStudent.id)}
            currentInstructorName={currentInstructor.full_name}
            onBack={handleClear}
            onMarkAttendance={onMarkAttendance}
            onSaveSkillAssessment={onSaveSkillAssessment}
            addToast={addToast}
          />
        </div>
      )}
    </div>
  );
};
