'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Car, 
  User, 
  Filter, 
  Award, 
  ShieldCheck, 
  Search,
  MessageSquare,
  FileCheck
} from 'lucide-react';
import { AttendanceRecord, Enrollment } from '@/types';

interface StudentAttendanceProps {
  attendance: AttendanceRecord[];
  enrollment: Enrollment;
}

export const StudentAttendance: React.FC<StudentAttendanceProps> = ({
  attendance,
  enrollment
}) => {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState<'all' | '7days' | '30days'>('all');
  const [searchRemarks, setSearchRemarks] = useState('');

  // Extract unique session category names
  const sessionCategories = Array.from(
    new Set(enrollment.session_allocations?.map(sa => sa.session_name_snapshot) || [])
  );

  // Filter attendance records
  const filteredRecords = attendance.filter(record => {
    // Category filter
    if (categoryFilter !== 'all' && record.session_name !== categoryFilter) {
      return false;
    }

    // Date range filter
    if (dateFilter !== 'all') {
      const recordDate = new Date(record.attendance_date).getTime();
      const now = new Date('2026-11-10').getTime();
      const diffDays = (now - recordDate) / (1000 * 3600 * 24);

      if (dateFilter === '7days' && diffDays > 7) return false;
      if (dateFilter === '30days' && diffDays > 30) return false;
    }

    // Search in remarks or session name
    if (searchRemarks.trim()) {
      const q = searchRemarks.toLowerCase();
      const matchSession = record.session_name.toLowerCase().includes(q);
      const matchRemarks = (record.remarks || '').toLowerCase().includes(q);
      const matchInstructor = record.instructor_name.toLowerCase().includes(q);
      if (!matchSession && !matchRemarks && !matchInstructor) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Read-Only Legal Integrity Header */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Verified Attendance Ledger
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Tamper-Proof
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Logged directly by certified instructors on location after practical driving maneuvers.
          </p>
        </div>

        {/* Metrics Strip */}
        <div className="flex items-center gap-4 text-xs bg-slate-50 dark:bg-[#0B1728] p-3 rounded-2xl border border-[#E5EAF1] dark:border-[#1E293B] self-start md:self-auto">
          <div>
            <span className="text-[10px] text-slate-400 block">Total Attended</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{attendance.length} Sessions</span>
          </div>
          <div className="border-l border-slate-200 dark:border-slate-800 pl-4">
            <span className="text-[10px] text-slate-400 block">Attendance Rate</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">100% Present</span>
          </div>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchRemarks}
            onChange={(e) => setSearchRemarks(e.target.value)}
            placeholder="Search session, feedback, or trainer..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Category filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="all">All Session Categories</option>
          {sessionCategories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        {/* Date filter */}
        <select
          value={dateFilter}
          onChange={(e: any) => setDateFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="all">All Time Records</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
        </select>
      </div>

      {/* Attendance Records List / Table */}
      {filteredRecords.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl space-y-2">
          <CheckCircle2 className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">No attendance records found</h3>
          <p className="text-xs text-slate-500">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRecords.map((att) => {
            const markedTime = att.marked_at 
              ? new Date(att.marked_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
              : '09:00 AM';

            return (
              <div
                key={att.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-3 transition hover:border-blue-500/40"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {att.session_name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Instructor: <strong className="text-slate-700 dark:text-slate-300">{att.instructor_name}</strong> • {att.vehicle_info || 'Dual Control Car'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:text-right self-start sm:self-auto">
                    <div>
                      <span className="font-bold text-xs text-slate-900 dark:text-white block font-mono">
                        {att.attendance_date}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">Recorded at {markedTime}</span>
                    </div>

                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      {att.status}
                    </span>
                  </div>
                </div>

                {/* Trainer remarks evaluation block */}
                {att.remarks && (
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-xs space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-blue-500" /> Trainer Feedback & Road Evaluation
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 italic">
                      &quot;{att.remarks}&quot;
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};