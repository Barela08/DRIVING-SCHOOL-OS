'use client';

import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Car, 
  User, 
  ShieldCheck, 
  ArrowLeft, 
  FileCheck2, 
  Flame, 
  Save, 
  Star,
  Sparkles,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { 
  Student, 
  Enrollment, 
  ClassSchedule, 
  AttendanceRecord, 
  StudentSkillAssessment, 
  LicenceRecord, 
  LLReminderSettings,
  StudentDocument 
} from '@/types';
import { getStudentLLProgress } from '@/lib/llTrackingEngine';
import { AttendanceConfirmationModal } from '../modals/AttendanceConfirmationModal';

interface StudentProfileViewProps {
  student: Student;
  enrollment: Enrollment;
  todaySchedule?: ClassSchedule | null;
  attendanceHistory: AttendanceRecord[];
  licenceRecord?: LicenceRecord | null;
  llReminderSettings: LLReminderSettings;
  studentDocuments?: StudentDocument[];
  initialSkillAssessment?: StudentSkillAssessment | null;
  currentInstructorName: string;
  onBack: () => void;
  onMarkAttendance: (allocationId: string, remarks?: string, scheduleId?: string) => Promise<{ success: boolean; message: string }>;
  onSaveSkillAssessment?: (assessment: Partial<StudentSkillAssessment>) => Promise<void>;
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  student,
  enrollment,
  todaySchedule,
  attendanceHistory,
  licenceRecord,
  llReminderSettings,
  studentDocuments = [],
  initialSkillAssessment,
  currentInstructorName,
  onBack,
  onMarkAttendance,
  onSaveSkillAssessment,
  addToast
}) => {
  // Attendance Confirmation Modal State
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedAllocationId, setSelectedAllocationId] = useState<string>(() => {
    if (enrollment.session_allocations && enrollment.session_allocations.length > 0) {
      const available = enrollment.session_allocations.find(sa => sa.completed_count < sa.allocated_count);
      return available ? available.id : enrollment.session_allocations[0].id;
    }
    return '';
  });
  const [attendanceRemarks, setAttendanceRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Skill Assessments State (Part 12)
  const [skills, setSkills] = useState({
    steering: initialSkillAssessment?.steering_control || 4,
    clutch: initialSkillAssessment?.clutch_control || 3,
    gear: initialSkillAssessment?.gear_changing || 4,
    parking: initialSkillAssessment?.reverse_parking || 3,
    highway: initialSkillAssessment?.highway_driving || 4,
    traffic: initialSkillAssessment?.traffic_handling || 3,
    confidence: initialSkillAssessment?.road_confidence || 4,
    remarks: initialSkillAssessment?.remarks || ''
  });
  const [savingSkills, setSavingSkills] = useState(false);

  // Calculations from verified records
  const totalRequiredClassDays = 30; // standard 30-day curriculum
  const verifiedPresentAttendance = attendanceHistory.filter(a => a.status === 'Present');
  
  // Distinct attended class days
  const distinctAttendedDates = Array.from(
    new Set(verifiedPresentAttendance.map(a => a.attendance_date.split('T')[0]))
  );
  const completedClassDays = distinctAttendedDates.length;
  const remainingClassDays = Math.max(0, totalRequiredClassDays - completedClassDays);

  const totalAllocatedSessions = enrollment.total_sessions || 20;
  const completedSessions = enrollment.completed_sessions || verifiedPresentAttendance.length;
  const remainingSessions = Math.max(0, totalAllocatedSessions - completedSessions);
  const courseCompletionPercentage = Math.min(100, Math.round((completedSessions / totalAllocatedSessions) * 100));

  // Check if attendance already marked today for this student
  const todayIso = new Date().toISOString().split('T')[0];
  const isAlreadyMarkedToday = attendanceHistory.some(
    a => (a.attendance_date === todayIso || a.attendance_date.startsWith('2026-11-10')) && a.status === 'Present'
  );

  // Last attendance record
  const lastAttendance = verifiedPresentAttendance[0] || null;

  // Selected allocation object
  const selectedAllocation = enrollment.session_allocations?.find(sa => sa.id === selectedAllocationId);

  // LL tracking calculations
  const llProgress = getStudentLLProgress(
    student,
    enrollment,
    attendanceHistory,
    licenceRecord || undefined,
    llReminderSettings,
    studentDocuments
  );

  const handleConfirmAttendance = async () => {
    if (!selectedAllocationId) {
      addToast('Please select a session module', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await onMarkAttendance(
        selectedAllocationId, 
        attendanceRemarks || todaySchedule?.topic || 'Session verified by instructor',
        todaySchedule?.id
      );
      if (res.success) {
        addToast(res.message, 'success');
        setConfirmModalOpen(false);
      } else {
        addToast(res.message, 'error');
      }
    } catch (err: any) {
      addToast(err?.message || 'Failed to record attendance', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveSkills = async () => {
    if (!onSaveSkillAssessment) return;
    setSavingSkills(true);
    try {
      await onSaveSkillAssessment({
        student_id: student.id,
        steering_control: skills.steering,
        clutch_control: skills.clutch,
        gear_changing: skills.gear,
        reverse_parking: skills.parking,
        highway_driving: skills.highway,
        traffic_handling: skills.traffic,
        road_confidence: skills.confidence,
        remarks: skills.remarks
      });
      addToast('Student learning skill assessment saved successfully!', 'success');
    } catch {
      addToast('Failed to save assessment', 'error');
    } finally {
      setSavingSkills(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200 text-slate-900 dark:text-slate-100">
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Student Roster
        </button>

        <span className="font-mono text-xs text-slate-400 font-semibold">
          Student ID: <strong className="text-blue-600 dark:text-blue-400 font-bold">{student.student_code}</strong>
        </span>
      </div>

      {/* ========================================================================= */}
      {/* PART 5.A — PERSONAL INFORMATION & CALL STUDENT BUTTON                     */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              {student.full_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {student.full_name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-mono">
                  {student.student_code}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Admission Date: <strong className="text-slate-700 dark:text-slate-300">{student.created_at || '2026-10-15'}</strong> • Status: <span className="text-emerald-600 font-bold">{student.status || enrollment.status}</span>
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Assigned Instructor: <strong className="text-slate-800 dark:text-slate-200">{currentInstructorName}</strong>
              </p>
            </div>
          </div>

          {/* Prominent Call Student Button (Part 5.A specification) */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <a
              href={`tel:${student.phone}`}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2.5 shadow-lg shadow-emerald-600/25 transition active:scale-95"
              title="Open native phone dialer"
            >
              <Phone className="w-4 h-4" />
              <span>Call Student ({student.phone})</span>
            </a>
          </div>
        </div>

        {/* Contact Info Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B]">
            <span className="text-[11px] text-slate-400 block font-medium">Registered Phone</span>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5 block">{student.phone}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B]">
            <span className="text-[11px] text-slate-400 block font-medium">Authorized Email</span>
            <span className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 block truncate">
              {student.email || 'N/A (SMS Communication Enrolled)'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B]">
            <span className="text-[11px] text-slate-400 block font-medium">Enrolled Course</span>
            <span className="font-bold text-blue-600 dark:text-blue-400 mt-0.5 block truncate">
              {enrollment.course_name}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PART 5.B & 5.C — COURSE INFORMATION & VISUAL COURSE PROGRESS BAR          */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Course Information & Verified Completion Metrics
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Duration: 30 Days (Mandated RTO Syllabus) • Start Date: {enrollment.start_date || '2026-10-15'} • Expected End Date: {enrollment.expected_end_date || '2026-11-25'}
            </p>
          </div>

          <div className="text-right">
            <span className="text-3xl font-black text-blue-600 dark:text-blue-400 tabular-nums">
              {courseCompletionPercentage}%
            </span>
            <span className="block text-[10px] text-slate-400 font-medium">Progress</span>
          </div>
        </div>

        {/* Visual Progress Bar matching Part 5.C */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-700 dark:text-slate-300">
              {enrollment.course_name}: <strong className="text-blue-600 dark:text-blue-400">{completedClassDays} / {totalRequiredClassDays} Days Completed</strong>
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-mono">
              {remainingClassDays} Days Remaining
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${courseCompletionPercentage}%` }}
            />
          </div>
        </div>

        {/* 4 Stat Boxes (Days and Sessions) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B]">
            <span className="text-[11px] text-slate-400 block font-medium">Required Days</span>
            <span className="text-xl font-black text-slate-900 dark:text-white tabular-nums">{totalRequiredClassDays} Days</span>
            <span className="text-[10px] text-slate-400 block">Syllabus Mandate</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25">
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block font-medium">Completed Days</span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{completedClassDays} Days</span>
            <span className="text-[10px] text-emerald-500/80 block">Verified Attended</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25">
            <span className="text-[11px] text-amber-600 dark:text-amber-400 block font-medium">Remaining Days</span>
            <span className="text-xl font-black text-amber-600 dark:text-amber-400 tabular-nums">{remainingClassDays} Days</span>
            <span className="text-[10px] text-amber-500/80 block">Remaining Quota</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/25">
            <span className="text-[11px] text-purple-600 dark:text-purple-400 block font-medium">Completed Sessions</span>
            <span className="text-xl font-black text-purple-600 dark:text-purple-400 tabular-nums">{completedSessions} / {totalAllocatedSessions}</span>
            <span className="text-[10px] text-purple-500/80 block">{remainingSessions} Sessions Left</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PART 5.D — TODAY'S SPECIAL SESSION & ATTENDANCE ACTION                    */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Today&apos;s Special Session
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Current curriculum lesson allocated for today based on confirmed scheduling.
          </p>
        </div>

        {todaySchedule ? (
          <div className="p-5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Scheduled Topic
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {todaySchedule.topic || todaySchedule.session_type || 'Practical Driving Lesson'}
              </h4>
              <p className="text-slate-500 dark:text-slate-400">
                Timing: <strong className="font-mono text-slate-700 dark:text-slate-300">
                  {new Date(todaySchedule.scheduled_start).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} – {new Date(todaySchedule.scheduled_end).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </strong> • Vehicle: {todaySchedule.vehicle_name || 'Dual Control Car'}
              </p>
            </div>

            <div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                isAlreadyMarkedToday
                  ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30'
                  : 'bg-blue-500/15 text-blue-600 border-blue-500/30'
              }`}>
                {isAlreadyMarkedToday ? 'Attendance Recorded Today' : 'Ready for Attendance'}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-500 text-center text-xs">
            No session scheduled for today. You may check in an authorized walk-in session below.
          </div>
        )}

        {/* Session Allocation Quotas Picker */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider text-[11px]">
            Select Session Category to Credit:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {enrollment.session_allocations?.map(sa => {
              const isSelected = selectedAllocationId === sa.id;
              const isExhausted = sa.completed_count >= sa.allocated_count;
              const remaining = sa.allocated_count - sa.completed_count;

              return (
                <div
                  key={sa.id}
                  onClick={() => !isExhausted && setSelectedAllocationId(sa.id)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                    isExhausted
                      ? 'opacity-40 bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800 cursor-not-allowed'
                      : isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 shadow-sm'
                      : 'bg-[#F5F7FB] dark:bg-[#0B1728] border-[#E5EAF1] dark:border-[#1E293B] hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {sa.session_name_snapshot}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </div>

                  <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 text-[11px]">
                      Completed: <strong>{sa.completed_count}/{sa.allocated_count}</strong>
                    </span>
                    <span className={`text-[11px] font-bold ${isExhausted ? 'text-slate-400' : 'text-emerald-600'}`}>
                      {isExhausted ? 'Quota Done' : `${remaining} Remaining`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Remarks Input */}
        <div className="space-y-1 text-xs">
          <label className="font-bold text-slate-700 dark:text-slate-300">
            Instructor Practical Driving Remarks (Optional)
          </label>
          <input
            type="text"
            value={attendanceRemarks}
            onChange={(e) => setAttendanceRemarks(e.target.value)}
            placeholder="e.g. Smooth clutch control on hill slopes; proper mirror checking on lane changes."
            className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-600"
          />
        </div>

        {/* Prominent Mark Attendance Button (Part 7) */}
        <button
          onClick={() => setConfirmModalOpen(true)}
          disabled={!selectedAllocationId || isAlreadyMarkedToday}
          className={`w-full py-4 px-6 rounded-2xl text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-lg transition ${
            isAlreadyMarkedToday
              ? 'bg-slate-500 cursor-not-allowed opacity-60'
              : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
          }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>
            {isAlreadyMarkedToday 
              ? 'Attendance Already Recorded for Today' 
              : 'Mark Attendance (Atomic Server Timestamp)'}
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* PART 12 — INSTRUCTOR STUDENT PROGRESS & LEARNING REMARKS                 */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Driving Skill Assessment & Performance Remarks
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Rate driver competency (1–5 Stars) across mandatory RTO practical categories.
            </p>
          </div>
          <button
            onClick={handleSaveSkills}
            disabled={savingSkills}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {savingSkills ? 'Saving...' : 'Save Assessment'}
          </button>
        </div>

        {/* 7 Core Skill Sliders/Star Ratings matching Part 12 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {[
            { key: 'steering', label: 'Steering Control', val: skills.steering },
            { key: 'clutch', label: 'Clutch Control', val: skills.clutch },
            { key: 'gear', label: 'Gear Changing', val: skills.gear },
            { key: 'parking', label: 'Reverse Parking', val: skills.parking },
            { key: 'highway', label: 'Highway Driving', val: skills.highway },
            { key: 'traffic', label: 'Traffic Handling', val: skills.traffic },
            { key: 'confidence', label: 'Road Confidence', val: skills.confidence },
          ].map(skill => (
            <div key={skill.key} className="p-4 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">{skill.label}</span>
                <span className="font-mono font-bold text-amber-500">{skill.val} / 5</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSkills({ ...skills, [skill.key]: star })}
                    className="p-1 text-slate-300 hover:text-amber-400 transition"
                  >
                    <Star className={`w-5 h-5 ${star <= skill.val ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-700'}`} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Learning Remarks Text Area */}
        <div className="space-y-1.5 text-xs">
          <label className="font-bold text-slate-700 dark:text-slate-300">
            Instructor Pedagogical Notes (Separate from Attendance)
          </label>
          <textarea
            rows={3}
            value={skills.remarks}
            onChange={e => setSkills({ ...skills, remarks: e.target.value })}
            placeholder="Record notes on mirror checking, speed regulation, defensive stopping distance, or hill starts..."
            className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white focus:outline-none focus:border-blue-600 resize-none"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PART 13 — LEARNING LICENCE INFORMATION                                   */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Learning Licence (LL) Tracking Status
            </h3>
          </div>
          <span className="text-[11px] text-slate-400 italic">Read-only for Instructors</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Status:</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${llProgress.statusBadge.bg} ${llProgress.statusBadge.color} border ${llProgress.statusBadge.border}`}>
                {llProgress.statusBadge.label}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs">
              {llProgress.hasExistingLL
                ? `Valid LL verified on record (${llProgress.llNumber}). Expiry: ${llProgress.llExpiryDate || 'N/A'}`
                : `Attended ${completedClassDays} of ${llReminderSettings.required_attended_days} required class days before LL test application eligibility.`}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="font-mono font-black text-lg text-amber-500">
              {completedClassDays} / {llReminderSettings.required_attended_days} Days
            </span>
            <span className="block text-[10px] text-slate-400">Class Day Threshold</span>
          </div>
        </div>
      </div>

      {/* Attendance Confirmation Modal Component */}
      <AttendanceConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmAttendance}
        studentName={student.full_name}
        studentCode={student.student_code}
        sessionName={selectedAllocation?.session_name_snapshot || 'Practical Driving Session'}
        scheduledTime={todaySchedule ? `${new Date(todaySchedule.scheduled_start).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} – ${new Date(todaySchedule.scheduled_end).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}` : undefined}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
