'use client';

import React, { useState } from 'react';
import { 
  X, 
  KeyRound, 
  AlertTriangle, 
  ShieldCheck, 
  User, 
  RotateCcw,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { Student } from '@/types';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';

interface ResetPasswordModalProps {
  student: Student | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  student,
  onClose,
  onSuccess
}) => {
  const { resetStudentPassword, currentUser, addToast } = useDrivingSchool();
  const [reason, setReason] = useState('Student forgot password / requested academy credential reset');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!student) return null;

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await resetStudentPassword(student.id, reason);
      if (res.success) {
        addToast(
          `Password for ${student.full_name} (${student.student_code}) has been reset to their temporary Student ID credential.`,
          'success'
        );
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setError(res.message || 'Failed to reset student password.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while resetting credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-[#111E32] rounded-3xl border border-[#E5EAF1] dark:border-[#1E293B] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#E5EAF1] dark:border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Reset Student Password
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Authorized Academy Security Action
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleReset} className="p-6 space-y-5 text-xs">
          {/* Target Student Identity */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white text-sm">
                {student.full_name}
              </span>
              <span className="font-mono text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                {student.student_code}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Phone: {student.phone} • {student.enrolled_course_name || 'Enrolled Student'}
            </div>
          </div>

          {/* Warning / Explanation Alert */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span>What happens upon reset:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-700 dark:text-slate-300">
              <li>Student's password is reset to their <strong>Student ID ({student.student_code})</strong>.</li>
              <li>Status set to <code>FIRST_LOGIN_PASSWORD_CHANGE_REQUIRED</code>.</li>
              <li>The student will be forced to create a new personal password on their next login.</li>
              <li>Any active student login sessions will be immediately terminated.</li>
              <li>This action is permanently recorded in the immutable security audit log.</li>
            </ul>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs">
              {error}
            </div>
          )}

          {/* Reset Reason */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              Reason for Password Reset (Audit Log)
            </label>
            <textarea
              rows={2}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Student requested reset in person at front desk..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 text-xs"
            />
          </div>

          {/* Security Assurance */}
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Staff cannot view or retrieve existing or newly created passwords.</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5EAF1] dark:border-[#1E293B]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-amber-600/20 transition disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Resetting...' : 'Confirm Reset Password'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
