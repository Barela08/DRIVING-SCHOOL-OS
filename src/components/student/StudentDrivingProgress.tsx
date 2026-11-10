'use client';

import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  Car, 
  TrendingUp, 
  Check, 
  Sparkles,
  Info
} from 'lucide-react';
import { Enrollment, AttendanceRecord } from '@/types';

interface StudentDrivingProgressProps {
  enrollment: Enrollment;
  attendance: AttendanceRecord[];
}

export const StudentDrivingProgress: React.FC<StudentDrivingProgressProps> = ({
  enrollment,
  attendance
}) => {
  const totalSessions = enrollment.total_sessions || 20;
  const completedSessions = enrollment.completed_sessions || 0;
  const remainingSessions = Math.max(0, totalSessions - completedSessions);
  const overallPercentage = Math.min(100, Math.round((completedSessions / totalSessions) * 100));

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Integrity & Read-Only Protection Alert */}
      <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-900 dark:text-blue-300 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold">Verified Attendance Driven Ledger</span>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Session completion progress is calculated automatically upon digital attendance logging by certified driving instructors using one-click dual verification. Students cannot manually alter progress.
          </p>
        </div>
      </div>

      {/* Hero Overall Completion Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Course: {enrollment.course_name}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Comprehensive practical curriculum mastery tracker
            </p>
          </div>

          <div className="flex items-center gap-4 self-start sm:self-auto">
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 tabular-nums">
                {overallPercentage}%
              </span>
              <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Overall Mastery</span>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-xl shadow-inner">
              <TrendingUp className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B]">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Total Sessions</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tabular-nums">{totalSessions}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B]">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Completed</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">{completedSessions}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B]">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Remaining</span>
            <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 tabular-nums">{remainingSessions}</span>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>Course Completion Status</span>
            <span className="text-blue-600 dark:text-blue-400">{completedSessions} of {totalSessions} Sessions Cleared</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-[#E5EAF1] dark:border-slate-700">
            <div 
              className="bg-gradient-to-r from-blue-600 to-emerald-400 h-full rounded-full transition-all duration-700 shadow"
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Session Categories Detailed Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Session Categories & Mastery Breakdown
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {enrollment.session_allocations?.length || 0} Practical Modules
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enrollment.session_allocations?.map((sa, idx) => {
            const isComplete = sa.completed_count >= sa.allocated_count;
            const remaining = Math.max(0, sa.allocated_count - sa.completed_count);
            const percentage = Math.round((sa.completed_count / sa.allocated_count) * 100);

            // Latest attendance log for this session category
            const latestAtt = attendance.find(a => a.session_allocation_id === sa.id);

            return (
              <div
                key={sa.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isComplete 
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' 
                          : 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                          {sa.session_name_snapshot}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">Module Code #{idx + 1}</span>
                      </div>
                    </div>

                    {isComplete ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                      </span>
                    ) : sa.completed_count > 0 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 shrink-0">
                        In Progress
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0">
                        Upcoming
                      </span>
                    )}
                  </div>

                  {/* Metrics Strip */}
                  <div className="grid grid-cols-3 gap-2 py-3 text-center text-xs">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B]">
                      <span className="text-[10px] text-slate-400 block">Allocated</span>
                      <span className="font-bold text-slate-900 dark:text-white tabular-nums">{sa.allocated_count}</span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B]">
                      <span className="text-[10px] text-slate-400 block">Completed</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{sa.completed_count}</span>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B]">
                      <span className="text-[10px] text-slate-400 block">Remaining</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400 tabular-nums">{remaining}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      <span>Progress</span>
                      <span>{percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          isComplete ? 'bg-emerald-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Trainer remarks or latest date */}
                {latestAtt && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Last marked on {latestAtt.attendance_date}:</span>{' '}
                    <span className="italic">{latestAtt.remarks || 'Completed successfully'}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};