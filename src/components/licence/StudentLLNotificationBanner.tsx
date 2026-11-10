'use client';

import React, { useState } from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { 
  FileCheck2, 
  ExternalLink, 
  Upload, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  ChevronRight,
  Info,
  Edit3
} from 'lucide-react';
import { getStudentLLProgress } from '@/lib/llTrackingEngine';
import { Student, Enrollment } from '@/types';
import { LLEligibilityInfoModal } from './LLEligibilityInfoModal';
import { LLWorkflowModal } from './LLWorkflowModal';

interface StudentLLNotificationBannerProps {
  student: Student;
  enrollment?: Enrollment;
}

export const StudentLLNotificationBanner: React.FC<StudentLLNotificationBannerProps> = ({
  student,
  enrollment
}) => {
  const { 
    attendanceRecords, 
    licenceRecords, 
    llReminderSettings, 
    studentDocuments 
  } = useDrivingSchool();

  const [showEligibilityModal, setShowEligibilityModal] = useState(false);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const currentLicence = licenceRecords.find(l => l.student_id === student.id);
  const progress = getStudentLLProgress(
    student,
    enrollment,
    attendanceRecords,
    currentLicence,
    llReminderSettings,
    studentDocuments
  );

  // Case A: Student has Already Available LL or Approved LL
  if (progress.hasExistingLL || progress.llStatus === 'Approved' || progress.llStatus === 'LL Approved' || progress.llStatus === 'Already Available') {
    return (
      <div className={`p-5 rounded-3xl border shadow-xl transition-all ${
        progress.isLLExpired
          ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
          : progress.isLLExpiringSoon
          ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
          : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              progress.isLLExpired ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
            }`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">
                  {progress.isLLExpired 
                    ? 'Learning Licence Expired' 
                    : progress.isLLExpiringSoon 
                    ? 'Learning Licence Expiring Soon' 
                    : 'Valid Learning Licence Active'}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  progress.isLLExpired ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {progress.llNumber || 'Verified on Record'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                {progress.isLLExpired
                  ? `Your LL expired on ${progress.llExpiryDate}. Please renew on Parivahan before appearing for your final driving test.`
                  : progress.llExpiryDate 
                  ? `Valid till ${progress.llExpiryDate} (${progress.llVehicleCategory || 'LMV'}). Standard LL reminders are turned off.`
                  : 'Your Learning Licence was submitted and verified at registration.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowWorkflowModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Update Details</span>
            </button>
            <button
              onClick={() => setShowEligibilityModal(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Info className="w-3.5 h-3.5" />
              <span>RTO Guidelines</span>
            </button>
          </div>
        </div>

        {/* Workflow Modal */}
        <LLWorkflowModal
          isOpen={showWorkflowModal}
          onClose={() => setShowWorkflowModal(false)}
          student={student}
          licenceRecord={currentLicence}
        />

        {/* Eligibility Modal */}
        <LLEligibilityInfoModal
          isOpen={showEligibilityModal}
          onClose={() => setShowEligibilityModal(false)}
        />
      </div>
    );
  }

  // Case B: Student has NOT reached threshold yet (Class day tracking in progress)
  const isOverThreshold = progress.totalAttendedClassDays >= llReminderSettings.required_attended_days;
  const isEligible = progress.isEligibleForReminder || isOverThreshold;

  return (
    <div className={`p-6 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
      isEligible
        ? 'bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-900 border-amber-500/40 text-slate-100'
        : 'bg-slate-900/90 border-slate-800 text-slate-200'
    }`}>
      {/* Decorative Glow if Eligible */}
      {isEligible && (
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      )}

      <div className="space-y-4">
        {/* Banner Top Row */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isEligible
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
            }`}>
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base">
                  {isEligible 
                    ? 'Time to Apply for your Learning Licence!' 
                    : 'Learning Licence Tracking in Progress'}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${progress.statusBadge.bg} ${progress.statusBadge.color} border ${progress.statusBadge.border}`}>
                  {progress.statusBadge.label}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                {isEligible ? (
                  <>
                    "Your driving classes are progressing! It may be time to apply for your Learning Licence. Please check your eligibility and complete the application process."
                  </>
                ) : (
                  <>
                    You have attended <strong className="text-white font-mono">{progress.totalAttendedClassDays}</strong> of <strong className="text-white font-mono">{llReminderSettings.required_attended_days}</strong> class days required for the school's LL application milestone recommendation.
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Attended Class Days Metric */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 shrink-0 text-center sm:text-right">
            <div>
              <div className="text-xl font-black text-amber-400 font-mono">
                {progress.totalAttendedClassDays} <span className="text-xs text-slate-400 font-normal">/ {llReminderSettings.required_attended_days} Days</span>
              </div>
              <span className="text-[10px] text-slate-400 block">Attended Class Days</span>
            </div>
          </div>
        </div>

        {/* Progress Bar of Attended Days vs Threshold */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>
              {isOverThreshold
                ? 'Driving school readiness threshold achieved!'
                : `${llReminderSettings.required_attended_days - progress.totalAttendedClassDays} more class days until recommendation`}
            </span>
            <span className="font-mono font-bold text-white">
              {Math.min(100, Math.round((progress.totalAttendedClassDays / llReminderSettings.required_attended_days) * 100))}%
            </span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOverThreshold ? 'bg-gradient-to-r from-amber-500 to-emerald-500' : 'bg-blue-500'
              }`}
              style={{
                width: `${Math.min(100, Math.round((progress.totalAttendedClassDays / llReminderSettings.required_attended_days) * 100))}%`
              }}
            />
          </div>
        </div>

        {/* 3 Action Buttons (Section 4 Requirement) */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {/* Button 1: View LL Application Information */}
          <button
            type="button"
            onClick={() => setShowEligibilityModal(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 hover:border-amber-500/50 hover:bg-slate-900 text-slate-200 text-xs font-semibold flex items-center gap-2 transition shadow-sm"
          >
            <Info className="w-4 h-4 text-amber-400" />
            <span>View LL Application Information</span>
          </button>

          {/* Button 2: Update Application Status */}
          <button
            type="button"
            onClick={() => setShowWorkflowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 transition"
          >
            <Edit3 className="w-4 h-4" />
            <span>Update Application Status</span>
          </button>

          {/* Button 3: Upload LL Document */}
          <button
            type="button"
            onClick={() => setShowWorkflowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-2 transition"
          >
            <Upload className="w-4 h-4 text-teal-400" />
            <span>Upload LL Document</span>
          </button>
        </div>
      </div>

      {/* Workflow Modal */}
      <LLWorkflowModal
        isOpen={showWorkflowModal}
        onClose={() => setShowWorkflowModal(false)}
        student={student}
        licenceRecord={currentLicence}
      />

      {/* Eligibility Guide Modal */}
      <LLEligibilityInfoModal
        isOpen={showEligibilityModal}
        onClose={() => setShowEligibilityModal(false)}
        studentName={student.full_name}
      />
    </div>
  );
};
