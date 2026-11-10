'use client';

import React, { useState } from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { 
  FileCheck2, 
  Bell, 
  Send, 
  Clock, 
  User, 
  Phone, 
  Calendar, 
  Award, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Edit3
} from 'lucide-react';
import { getStudentLLProgress } from '@/lib/llTrackingEngine';
import { Student, LicenceRecord } from '@/types';
import { LLWorkflowModal } from './LLWorkflowModal';
import { LLEligibilityInfoModal } from './LLEligibilityInfoModal';

interface LLPendingApplicationsSectionProps {
  onSelectStudent?: (student: Student) => void;
}

export const LLPendingApplicationsSection: React.FC<LLPendingApplicationsSectionProps> = ({
  onSelectStudent
}) => {
  const { 
    students, 
    enrollments, 
    attendanceRecords, 
    licenceRecords, 
    llReminderSettings, 
    studentDocuments,
    triggerLLReminder
  } = useDrivingSchool();

  const [selectedStudentForWorkflow, setSelectedStudentForWorkflow] = useState<{
    student: Student;
    licence?: LicenceRecord;
  } | null>(null);

  const [showEligibilityModal, setShowEligibilityModal] = useState(false);
  const [activeStudentForEligibility, setActiveStudentForEligibility] = useState<string | undefined>();
  const [sendingReminderId, setSendingReminderId] = useState<string | null>(null);

  // Compute all students who have pending LL applications or are eligible for reminders
  const pendingStudentsList = students.map(student => {
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
  }).filter(({ progress, enrollment }) => {
    // Exclude students who already have valid LL or are already Approved
    if (progress.hasExistingLL || progress.llStatus === 'Already Available' || progress.llStatus === 'Approved') {
      return false;
    }
    // Exclude cancelled/inactive
    if (enrollment?.status === 'Cancelled' || enrollment?.status === 'On_Hold') {
      return false;
    }
    // Include if eligible for reminder, reminder sent, or in progress
    return (
      progress.isEligibleForReminder || 
      progress.llStatus === 'Reminder Sent' || 
      progress.llStatus === 'Application Started' || 
      progress.llStatus === 'Application Submitted' || 
      progress.llStatus === 'Test Scheduled' ||
      progress.llStatus === 'Document Uploaded' ||
      progress.totalAttendedClassDays >= llReminderSettings.required_attended_days
    );
  });

  const handleSendReminder = async (studentId: string) => {
    setSendingReminderId(studentId);
    try {
      await triggerLLReminder(studentId, true);
    } finally {
      setSendingReminderId(null);
    }
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm overflow-hidden">
      {/* Section Header */}
      <div className="p-5 sm:p-6 border-b border-[#E5EAF1] dark:border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Learning Licence Applications Pending
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                {pendingStudentsList.length} Active
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Students who reached the driving school reminder policy ({llReminderSettings.required_attended_days} attended days) or have pending RTO applications
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowEligibilityModal(true)}
          className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Statutory Eligibility Rules</span>
        </button>
      </div>

      {/* Table / Grid */}
      {pendingStudentsList.length === 0 ? (
        <div className="p-10 text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">All Clear!</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            No students currently have overdue or pending Learning Licence applications. Students who meet the {llReminderSettings.required_attended_days}-day threshold will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E5EAF1] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#0B1728]/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Instructor</th>
                <th className="py-3 px-4 text-center">Attended Class Days</th>
                <th className="py-3 px-4 text-center">Completed Sessions</th>
                <th className="py-3 px-4">Admission Date</th>
                <th className="py-3 px-4">LL Status</th>
                <th className="py-3 px-4">Trigger Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAF1] dark:divide-[#1E293B]">
              {pendingStudentsList.map(({ student, enrollment, licence, progress }) => {
                const isOverThreshold = progress.totalAttendedClassDays >= llReminderSettings.required_attended_days;

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

                    {/* Instructor */}
                    <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[130px] font-medium">{progress.instructorName}</span>
                      </div>
                    </td>

                    {/* Attended Class Days */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <span>{progress.totalAttendedClassDays}</span>
                        <span className="text-slate-400 font-normal">/ {llReminderSettings.required_attended_days} Days</span>
                      </div>
                      {progress.firstAttendedClassDate && (
                        <span className="block text-[10px] text-slate-400 mt-0.5">
                          First: {progress.firstAttendedClassDate}
                        </span>
                      )}
                    </td>

                    {/* Completed Sessions */}
                    <td className="py-3.5 px-4 text-center font-mono">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {progress.completedPracticalSessions}
                      </span>
                      <span className="text-slate-400 text-[11px]"> / {progress.totalAllocatedSessions}</span>
                    </td>

                    {/* Admission Date */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-[11px] font-mono">
                      {progress.admissionDate}
                    </td>

                    {/* LL Application Status */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] border ${progress.statusBadge.bg} ${progress.statusBadge.color} ${progress.statusBadge.border}`}>
                        {progress.statusBadge.label}
                      </span>
                      {progress.applicationNumber && (
                        <span className="block text-[10px] font-mono text-slate-400 mt-0.5">
                          Ref: {progress.applicationNumber}
                        </span>
                      )}
                    </td>

                    {/* Reminder Trigger Date */}
                    <td className="py-3.5 px-4 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                      {progress.reminderSentDate ? (
                        <div>
                          <span>{new Date(progress.reminderSentDate).toLocaleDateString('en-IN')}</span>
                          <span className="block text-[10px] text-slate-500">
                            Sent {progress.reminderCount} time{progress.reminderCount > 1 ? 's' : ''}
                          </span>
                        </div>
                      ) : isOverThreshold ? (
                        <span className="text-amber-500 font-semibold">Eligible (Not yet sent)</span>
                      ) : (
                        <span className="text-slate-400">Not Triggered</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Send / Resend Reminder */}
                        <button
                          type="button"
                          disabled={sendingReminderId === student.id}
                          onClick={() => handleSendReminder(student.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold text-[11px] flex items-center gap-1 transition"
                          title="Send LL reminder notification to student"
                        >
                          <Send className="w-3 h-3" />
                          <span>{progress.reminderCount > 0 ? 'Resend' : 'Remind'}</span>
                        </button>

                        {/* Update Status Modal */}
                        <button
                          type="button"
                          onClick={() => setSelectedStudentForWorkflow({ student, licence })}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold text-[11px] flex items-center gap-1 transition"
                          title="Update RTO application workflow status"
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
      )}

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
