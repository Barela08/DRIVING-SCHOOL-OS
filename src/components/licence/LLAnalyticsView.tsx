'use client';

import React, { useState, useMemo } from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { 
  FileCheck2, 
  Search, 
  Filter, 
  Send, 
  Edit3, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  User, 
  Award, 
  Calendar, 
  Phone, 
  ExternalLink,
  ChevronDown,
  RefreshCw,
  XCircle,
  FileText
} from 'lucide-react';
import { getStudentLLProgress } from '@/lib/llTrackingEngine';
import { Student, LicenceRecord, LicenceStatus } from '@/types';
import { LLWorkflowModal } from './LLWorkflowModal';
import { LLEligibilityInfoModal } from './LLEligibilityInfoModal';

interface LLAnalyticsViewProps {
  onSelectStudent?: (student: Student) => void;
}

export const LLAnalyticsView: React.FC<LLAnalyticsViewProps> = ({
  onSelectStudent
}) => {
  const { 
    students, 
    enrollments, 
    attendanceRecords, 
    licenceRecords, 
    instructors, 
    courses, 
    llReminderSettings, 
    studentDocuments,
    triggerLLReminder
  } = useDrivingSchool();

  // Filters State
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>('all');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState<'all' | 'last30' | 'last60' | 'last90'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedStudentForWorkflow, setSelectedStudentForWorkflow] = useState<{
    student: Student;
    licence?: LicenceRecord;
  } | null>(null);
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);
  const [sendingReminderId, setSendingReminderId] = useState<string | null>(null);

  // Compute all students' progress
  const allStudentsProgress = useMemo(() => {
    return students.map(student => {
      const enrollment = enrollments.find(e => e.student_id === student.id);
      const licence = licenceRecords.find(l => l.student_id === student.id);
      const progress = getStudentLLProgress(
        student,
        enrollment,
        attendanceRecords,
        licence,
        llReminderSettings,
        studentDocuments
      );
      return {
        student,
        enrollment,
        licence,
        progress
      };
    });
  }, [students, enrollments, attendanceRecords, licenceRecords, llReminderSettings, studentDocuments]);

  // Aggregate Metrics (Section 7)
  const metrics = useMemo(() => {
    let withoutLL = 0;
    let approachingThreshold = 0;
    let eligibleForReminder = 0;
    let remindersSent = 0;
    let inProgress = 0;
    let approved = 0;
    let expiredLL = 0;

    allStudentsProgress.forEach(({ progress }) => {
      // 1. Without LL: Not Applied and does not have existing LL
      if (progress.llStatus === 'Not Applied' && !progress.hasExistingLL) {
        withoutLL++;
      }

      // 2. Approaching Threshold: within configured approaching window
      if (progress.isApproachingThreshold) {
        approachingThreshold++;
      }

      // 3. Eligible for LL reminder: threshold reached and Not Applied
      if (progress.isEligibleForReminder) {
        eligibleForReminder++;
      }

      // 4. Reminders sent
      if (progress.llStatus === 'Reminder Sent' || (progress.reminderCount && progress.reminderCount > 0)) {
        remindersSent++;
      }

      // 5. Applications in progress
      if (
        progress.llStatus === 'Application Started' || 
        progress.llStatus === 'Application Submitted' || 
        progress.llStatus === 'Test Scheduled' ||
        progress.llStatus === 'Document Uploaded'
      ) {
        inProgress++;
      }

      // 6. LL Approved / Already Available
      if (
        progress.llStatus === 'Approved' || 
        progress.llStatus === 'LL Approved' || 
        progress.llStatus === 'Licence Issued' ||
        (progress.hasExistingLL && !progress.isLLExpired)
      ) {
        approved++;
      }

      // 7. Expired LL
      if (progress.isLLExpired) {
        expiredLL++;
      }
    });

    return {
      withoutLL,
      approachingThreshold,
      eligibleForReminder,
      remindersSent,
      inProgress,
      approved,
      expiredLL
    };
  }, [allStudentsProgress]);

  // Filtered Students List
  const filteredStudents = useMemo(() => {
    return allStudentsProgress.filter(({ student, enrollment, progress }) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          student.full_name.toLowerCase().includes(q) ||
          student.student_code.toLowerCase().includes(q) ||
          student.phone.includes(q) ||
          (progress.applicationNumber && progress.applicationNumber.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Instructor
      if (selectedInstructorId !== 'all') {
        const insId = student.assigned_instructor_id || enrollment?.assigned_instructor_id;
        if (insId !== selectedInstructorId) return false;
      }

      // Course
      if (selectedCourseId !== 'all') {
        const cId = student.enrolled_course_id || enrollment?.course_id;
        if (cId !== selectedCourseId) return false;
      }

      // Status Filter
      if (selectedStatusFilter !== 'all') {
        if (selectedStatusFilter === 'without_ll') {
          if (progress.hasExistingLL || progress.llStatus !== 'Not Applied') return false;
        } else if (selectedStatusFilter === 'approaching') {
          if (!progress.isApproachingThreshold) return false;
        } else if (selectedStatusFilter === 'eligible') {
          if (!progress.isEligibleForReminder) return false;
        } else if (selectedStatusFilter === 'reminder_sent') {
          if (progress.llStatus !== 'Reminder Sent') return false;
        } else if (selectedStatusFilter === 'in_progress') {
          if (!['Application Started', 'Application Submitted', 'Test Scheduled', 'Document Uploaded'].includes(progress.llStatus)) return false;
        } else if (selectedStatusFilter === 'approved') {
          if (!['Approved', 'LL Approved', 'Licence Issued', 'Already Available'].includes(progress.llStatus)) return false;
        } else if (selectedStatusFilter === 'expired') {
          if (!progress.isLLExpired) return false;
        }
      }

      // Admission Date Filter
      if (selectedDateFilter !== 'all') {
        const admTime = new Date(student.admission_date).getTime();
        const now = Date.now();
        const daysAgo = (now - admTime) / (1000 * 60 * 60 * 24);
        if (selectedDateFilter === 'last30' && daysAgo > 30) return false;
        if (selectedDateFilter === 'last60' && daysAgo > 60) return false;
        if (selectedDateFilter === 'last90' && daysAgo > 90) return false;
      }

      return true;
    });
  }, [allStudentsProgress, searchQuery, selectedInstructorId, selectedCourseId, selectedStatusFilter, selectedDateFilter]);

  const handleSendReminder = async (studentId: string) => {
    setSendingReminderId(studentId);
    try {
      await triggerLLReminder(studentId, true);
    } finally {
      setSendingReminderId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 7 Key Analytics Cards (Section 7) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* 1. Students without LL */}
        <button
          onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'without_ll' ? 'all' : 'without_ll')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            selectedStatusFilter === 'without_ll'
              ? 'bg-slate-800 border-slate-600 shadow-md ring-2 ring-slate-500/20'
              : 'bg-white dark:bg-[#111E32] border-[#E5EAF1] dark:border-[#1E293B] hover:border-slate-400'
          }`}
        >
          <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-semibold truncate">
            Without LL
          </span>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
            {metrics.withoutLL}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Not Applied</span>
        </button>

        {/* 2. Approaching Threshold */}
        <button
          onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'approaching' ? 'all' : 'approaching')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            selectedStatusFilter === 'approaching'
              ? 'bg-cyan-500/10 border-cyan-500 shadow-md ring-2 ring-cyan-500/20'
              : 'bg-white dark:bg-[#111E32] border-[#E5EAF1] dark:border-[#1E293B] hover:border-cyan-400'
          }`}
        >
          <span className="text-[11px] text-cyan-600 dark:text-cyan-400 block font-semibold truncate">
            Approaching
          </span>
          <div className="text-xl font-black text-cyan-600 dark:text-cyan-400 mt-1">
            {metrics.approachingThreshold}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">&le; 2 days away</span>
        </button>

        {/* 3. Eligible for LL Reminder */}
        <button
          onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'eligible' ? 'all' : 'eligible')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            selectedStatusFilter === 'eligible'
              ? 'bg-amber-500/10 border-amber-500 shadow-md ring-2 ring-amber-500/20'
              : 'bg-white dark:bg-[#111E32] border-[#E5EAF1] dark:border-[#1E293B] hover:border-amber-400'
          }`}
        >
          <span className="text-[11px] text-amber-600 dark:text-amber-400 block font-semibold truncate">
            Eligible
          </span>
          <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {metrics.eligibleForReminder}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">&ge; {llReminderSettings.required_attended_days} days</span>
        </button>

        {/* 4. LL Reminders Sent */}
        <button
          onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'reminder_sent' ? 'all' : 'reminder_sent')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            selectedStatusFilter === 'reminder_sent'
              ? 'bg-indigo-500/10 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
              : 'bg-white dark:bg-[#111E32] border-[#E5EAF1] dark:border-[#1E293B] hover:border-indigo-400'
          }`}
        >
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 block font-semibold truncate">
            Reminders Sent
          </span>
          <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {metrics.remindersSent}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Notified learners</span>
        </button>

        {/* 5. Applications In Progress */}
        <button
          onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'in_progress' ? 'all' : 'in_progress')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            selectedStatusFilter === 'in_progress'
              ? 'bg-blue-500/10 border-blue-500 shadow-md ring-2 ring-blue-500/20'
              : 'bg-white dark:bg-[#111E32] border-[#E5EAF1] dark:border-[#1E293B] hover:border-blue-400'
          }`}
        >
          <span className="text-[11px] text-blue-600 dark:text-blue-400 block font-semibold truncate">
            In Progress
          </span>
          <div className="text-xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {metrics.inProgress}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Filing / Test</span>
        </button>

        {/* 6. LL Approved */}
        <button
          onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'approved' ? 'all' : 'approved')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            selectedStatusFilter === 'approved'
              ? 'bg-emerald-500/10 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
              : 'bg-white dark:bg-[#111E32] border-[#E5EAF1] dark:border-[#1E293B] hover:border-emerald-400'
          }`}
        >
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block font-semibold truncate">
            Approved / Valid
          </span>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {metrics.approved}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Verified learners</span>
        </button>

        {/* 7. Students with Expired LL */}
        <button
          onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'expired' ? 'all' : 'expired')}
          className={`p-3.5 rounded-2xl border text-left transition-all ${
            selectedStatusFilter === 'expired'
              ? 'bg-rose-500/10 border-rose-500 shadow-md ring-2 ring-rose-500/20'
              : 'bg-white dark:bg-[#111E32] border-[#E5EAF1] dark:border-[#1E293B] hover:border-rose-400'
          }`}
        >
          <span className="text-[11px] text-rose-600 dark:text-rose-400 block font-semibold truncate">
            Expired LL
          </span>
          <div className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1">
            {metrics.expiredLL}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">Needs renewal</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search student, ID, phone..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] rounded-xl pl-8 pr-3 py-2 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Instructor Filter */}
          <div>
            <select
              value={selectedInstructorId}
              onChange={e => setSelectedInstructorId(e.target.value)}
              className="w-full bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Instructors ({instructors.length})</option>
              {instructors.map(ins => (
                <option key={ins.id} value={ins.id}>{ins.full_name}</option>
              ))}
            </select>
          </div>

          {/* Course Filter */}
          <div>
            <select
              value={selectedCourseId}
              onChange={e => setSelectedCourseId(e.target.value)}
              className="w-full bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Courses ({courses.length})</option>
              {courses.map(crs => (
                <option key={crs.id} value={crs.id}>{crs.name}</option>
              ))}
            </select>
          </div>

          {/* Admission Date Filter */}
          <div>
            <select
              value={selectedDateFilter}
              onChange={e => setSelectedDateFilter(e.target.value as any)}
              className="w-full bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            >
              <option value="all">All Admission Dates</option>
              <option value="last30">Admitted in Last 30 Days</option>
              <option value="last60">Admitted in Last 60 Days</option>
              <option value="last90">Admitted in Last 90 Days</option>
            </select>
          </div>

          {/* LL Status Filter */}
          <div>
            <select
              value={selectedStatusFilter}
              onChange={e => setSelectedStatusFilter(e.target.value)}
              className="w-full bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-medium"
            >
              <option value="all">All LL Statuses</option>
              <option value="without_ll">Students without LL</option>
              <option value="approaching">Approaching Threshold</option>
              <option value="eligible">Eligible for Reminder</option>
              <option value="reminder_sent">Reminders Sent</option>
              <option value="in_progress">Applications in Progress</option>
              <option value="approved">LL Approved / Valid</option>
              <option value="expired">Expired LL</option>
            </select>
          </div>
        </div>

        {/* Active filter tags & reset */}
        {(selectedInstructorId !== 'all' || selectedCourseId !== 'all' || selectedStatusFilter !== 'all' || selectedDateFilter !== 'all' || searchQuery) && (
          <div className="flex items-center gap-2 pt-2 border-t border-[#E5EAF1] dark:border-[#1E293B] text-[11px] text-slate-500">
            <span>Filtered results: <strong>{filteredStudents.length}</strong> of {allStudentsProgress.length} students</span>
            <button
              onClick={() => {
                setSelectedInstructorId('all');
                setSelectedCourseId('all');
                setSelectedStatusFilter('all');
                setSelectedDateFilter('all');
                setSearchQuery('');
              }}
              className="text-amber-500 hover:underline font-semibold ml-auto"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div className="rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E5EAF1] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#0B1728]/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Course & Instructor</th>
                <th className="py-3 px-4 text-center">Attended Class Days</th>
                <th className="py-3 px-4 text-center">Course Progress</th>
                <th className="py-3 px-4">LL Status & Ref</th>
                <th className="py-3 px-4">Dates & Validity</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAF1] dark:divide-[#1E293B]">
              {filteredStudents.map(({ student, enrollment, licence, progress }) => {
                return (
                  <tr 
                    key={student.id} 
                    className="hover:bg-[#F5F7FB] dark:hover:bg-[#0B1728] transition group"
                  >
                    {/* Student Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center shrink-0 text-xs">
                          {student.full_name.charAt(0)}
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={() => onSelectStudent && onSelectStudent(student)}
                            className="font-bold text-slate-900 dark:text-white hover:text-amber-500 transition text-left block"
                          >
                            {student.full_name}
                          </button>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                              {student.student_code}
                            </span>
                            <span className="text-slate-400">•</span>
                            <a 
                              href={`tel:${student.phone}`} 
                              className="text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 inline-flex items-center gap-1"
                            >
                              <Phone className="w-2.5 h-2.5" />
                              {student.phone}
                            </a>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Course & Instructor */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate max-w-[180px]">
                        {progress.courseName}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 truncate max-w-[180px]">
                        Instructor: {progress.instructorName}
                      </span>
                    </td>

                    {/* Attended Class Days */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700">
                        <span>{progress.totalAttendedClassDays}</span>
                        <span className="text-slate-400 font-normal">/ {llReminderSettings.required_attended_days} Days</span>
                      </div>
                      <span className="block text-[10px] text-slate-500 mt-0.5">
                        {progress.completedPracticalSessions} sessions completed
                      </span>
                    </td>

                    {/* Course Progress */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="w-24 mx-auto space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                          <span>Progress</span>
                          <span>{progress.courseProgressPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${progress.courseProgressPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* LL Status */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] border ${progress.statusBadge.bg} ${progress.statusBadge.color} ${progress.statusBadge.border}`}>
                        {progress.statusBadge.label}
                      </span>
                      {progress.llNumber ? (
                        <span className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          LL: {progress.llNumber}
                        </span>
                      ) : progress.applicationNumber ? (
                        <span className="block text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          Ref: {progress.applicationNumber}
                        </span>
                      ) : null}
                    </td>

                    {/* Dates & Validity */}
                    <td className="py-3.5 px-4 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                      {progress.llExpiryDate ? (
                        <div>
                          <span className={progress.isLLExpired ? 'text-rose-500 font-bold' : progress.isLLExpiringSoon ? 'text-amber-500 font-bold' : 'text-slate-300'}>
                            Exp: {progress.llExpiryDate}
                          </span>
                          <span className="block text-[10px] text-slate-500">
                            {progress.isLLExpired ? 'Expired' : progress.isLLExpiringSoon ? 'Expiring Soon' : 'Valid'}
                          </span>
                        </div>
                      ) : progress.testDate ? (
                        <div>
                          <span className="text-purple-400 font-semibold">Test: {progress.testDate}</span>
                        </div>
                      ) : progress.firstAttendedClassDate ? (
                        <div>
                          <span>First: {progress.firstAttendedClassDate}</span>
                          <span className="block text-[10px] text-slate-500">Recent: {progress.mostRecentAttendedClassDate}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">Enrolled: {progress.admissionDate}</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Remind Button */}
                        {!progress.hasExistingLL && progress.llStatus !== 'Approved' && (
                          <button
                            type="button"
                            disabled={sendingReminderId === student.id}
                            onClick={() => handleSendReminder(student.id)}
                            className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 transition"
                            title="Send LL reminder notification"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Update Workflow */}
                        <button
                          type="button"
                          onClick={() => setSelectedStudentForWorkflow({ student, licence })}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-[11px] flex items-center gap-1 transition"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Update</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Workflow Modal */}
      {selectedStudentForWorkflow && (
        <LLWorkflowModal
          isOpen={true}
          onClose={() => setSelectedStudentForWorkflow(null)}
          student={selectedStudentForWorkflow.student}
          licenceRecord={selectedStudentForWorkflow.licence}
        />
      )}

      {/* Eligibility Info Modal */}
      <LLEligibilityInfoModal
        isOpen={showEligibilityModal}
        onClose={() => setShowEligibilityModal(false)}
      />
    </div>
  );
};
