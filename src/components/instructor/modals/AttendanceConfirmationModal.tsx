'use client';

import React from 'react';
import { CheckCircle2, X, Clock, AlertCircle, ShieldCheck } from 'lucide-react';

interface AttendanceConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  studentName: string;
  studentCode: string;
  sessionName: string;
  scheduledTime?: string;
  isSubmitting?: boolean;
}

export const AttendanceConfirmationModal: React.FC<AttendanceConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  studentName,
  studentCode,
  sessionName,
  scheduledTime,
  isSubmitting = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white dark:bg-[#111E32] rounded-3xl border border-[#E5EAF1] dark:border-[#1E293B] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 text-slate-900 dark:text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-attendance-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E5EAF1] dark:border-[#1E293B] bg-slate-50 dark:bg-[#0B1728]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 id="confirm-attendance-title" className="text-base font-bold text-slate-900 dark:text-white">
                Confirm Attendance?
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Verify learner presence before signing session log
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content matching prompt specification */}
        <div className="p-6 space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Student:</span>
              <span className="font-bold text-sm text-slate-900 dark:text-white">{studentName}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Student ID:</span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{studentCode}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Session:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{sessionName}</span>
            </div>

            {scheduledTime && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Scheduled Slot:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 font-medium">{scheduledTime}</span>
              </div>
            )}

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-start gap-2">
              <Clock className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-500 dark:text-slate-400 block font-medium">Date and Time:</span>
                <span className="text-slate-900 dark:text-white font-semibold">
                  Automatically determined by the server.
                </span>
                <span className="text-[11px] text-slate-400 block mt-0.5">
                  The official Indian Standard Time (IST) will be captured by atomic server logic upon confirmation.
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px] flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <span>
              Attendance must only be confirmed after the student has arrived in person and participated in the practical lesson.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-5 border-t border-[#E5EAF1] dark:border-[#1E293B] bg-slate-50 dark:bg-[#0B1728]/60 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/25 flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Recording...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" /> Confirm Attendance
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
