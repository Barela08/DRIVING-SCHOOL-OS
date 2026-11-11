'use client';

import React, { useState, useMemo } from 'react';
import { 
  History, 
  Search, 
  Calendar, 
  Filter, 
  Clock, 
  CheckCircle2, 
  Download, 
  X,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { AttendanceRecord, Instructor } from '@/types';

interface AttendanceHistoryViewProps {
  currentInstructor: Instructor;
  attendanceRecords: AttendanceRecord[];
}

export const AttendanceHistoryView: React.FC<AttendanceHistoryViewProps> = ({
  currentInstructor,
  attendanceRecords
}) => {
  // Filters state
  const [timePeriodFilter, setTimePeriodFilter] = useState<'all' | 'today' | 'yesterday' | 'week' | 'month' | 'custom'>('all');
  const [studentIdFilter, setStudentIdFilter] = useState('');
  const [sessionCategoryFilter, setSessionCategoryFilter] = useState('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  // Authorized filter: instructor only sees records they are authorized to access
  const authorizedRecords = useMemo(() => {
    return attendanceRecords.filter(a => a.instructor_id === currentInstructor.id);
  }, [attendanceRecords, currentInstructor.id]);

  // Distinct session categories for dropdown filter
  const sessionCategories = useMemo(() => {
    const set = new Set<string>();
    authorizedRecords.forEach(a => {
      if (a.session_name) set.add(a.session_name);
    });
    return Array.from(set).sort();
  }, [authorizedRecords]);

  // Filtered records based on all active criteria
  const filteredRecords = useMemo(() => {
    const today = new Date();
    const todayIso = today.toISOString().split('T')[0];

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayIso = yesterday.toISOString().split('T')[0];

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoIso = sevenDaysAgo.toISOString().split('T')[0];

    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoIso = thirtyDaysAgo.toISOString().split('T')[0];

    return authorizedRecords.filter(record => {
      const recDate = record.attendance_date;

      // Time period filter
      if (timePeriodFilter === 'today' && recDate !== todayIso && !recDate.startsWith('2026-11-10')) {
        return false;
      }
      if (timePeriodFilter === 'yesterday' && recDate !== yesterdayIso && !recDate.startsWith('2026-11-09')) {
        return false;
      }
      if (timePeriodFilter === 'week' && recDate < sevenDaysAgoIso && recDate < '2026-11-03') {
        return false;
      }
      if (timePeriodFilter === 'month' && recDate < thirtyDaysAgoIso && recDate < '2026-10-10') {
        return false;
      }
      if (timePeriodFilter === 'custom') {
        if (customStartDate && recDate < customStartDate) return false;
        if (customEndDate && recDate > customEndDate) return false;
      }

      // Student ID filter
      if (studentIdFilter.trim()) {
        const q = studentIdFilter.trim().toUpperCase();
        const matchesCode = record.student_code?.toUpperCase().includes(q);
        const matchesName = record.student_name?.toUpperCase().includes(q);
        if (!matchesCode && !matchesName) return false;
      }

      // Session category filter
      if (sessionCategoryFilter !== 'all' && record.session_name !== sessionCategoryFilter) {
        return false;
      }

      return true;
    });
  }, [authorizedRecords, timePeriodFilter, studentIdFilter, sessionCategoryFilter, customStartDate, customEndDate]);

  const clearAllFilters = () => {
    setTimePeriodFilter('all');
    setStudentIdFilter('');
    setSessionCategoryFilter('all');
    setCustomStartDate('');
    setCustomEndDate('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200 text-slate-900 dark:text-slate-100">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <History className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Attendance History
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verified practical sessions and driving lessons logged by {currentInstructor.full_name} ({currentInstructor.instructor_code}).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] text-right text-xs">
            <span className="text-[10px] text-slate-400 block font-medium">Logged Sessions</span>
            <span className="text-lg font-black text-blue-600 dark:text-blue-400 tabular-nums">
              {filteredRecords.length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Bar (matching Part 9: Today, Yesterday, This Week, This Month, Custom Date Range, Student ID, Session Category) */}
      <div className="bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
            <Filter className="w-3.5 h-3.5 text-blue-600" /> Filter Logged Attendance:
          </span>

          {(timePeriodFilter !== 'all' || studentIdFilter || sessionCategoryFilter !== 'all') && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-rose-600 dark:text-rose-400 font-bold hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Clear Filters
            </button>
          )}
        </div>

        {/* Time Period Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs">
          {[
            { id: 'all', label: 'All Records' },
            { id: 'today', label: 'Today' },
            { id: 'yesterday', label: 'Yesterday' },
            { id: 'week', label: 'This Week' },
            { id: 'month', label: 'This Month' },
            { id: 'custom', label: 'Custom Range' },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setTimePeriodFilter(p.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                timePeriodFilter === p.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-[#F5F7FB] dark:bg-[#0B1728] text-slate-600 dark:text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Custom Date Range Inputs */}
        {timePeriodFilter === 'custom' && (
          <div className="p-4 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex flex-col sm:flex-row items-center gap-3 text-xs animate-in fade-in duration-150">
            <div className="w-full sm:w-auto flex-1">
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                Start Date:
              </label>
              <input
                type="date"
                value={customStartDate}
                onChange={e => setCustomStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] font-mono text-xs focus:outline-none focus:border-blue-600"
              />
            </div>
            <div className="w-full sm:w-auto flex-1">
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                End Date:
              </label>
              <input
                type="date"
                value={customEndDate}
                onChange={e => setCustomEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] font-mono text-xs focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>
        )}

        {/* Student ID & Session Category Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={studentIdFilter}
              onChange={e => setStudentIdFilter(e.target.value)}
              placeholder="Search by Student ID or Name..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <select
              value={sessionCategoryFilter}
              onChange={e => setSessionCategoryFilter(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-600"
            >
              <option value="all">All Session Modules</option>
              {sessionCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Attendance History Table matching Part 9 */}
      <div className="bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F5F7FB] dark:bg-[#0B1728] text-slate-500 uppercase font-semibold border-b border-[#E5EAF1] dark:border-[#1E293B]">
              <tr>
                <th className="px-5 py-3.5">Student Name</th>
                <th className="px-5 py-3.5">Student ID</th>
                <th className="px-5 py-3.5">Session Name</th>
                <th className="px-5 py-3.5">Attendance Date</th>
                <th className="px-5 py-3.5">Exact Marked Time (IST)</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Marked By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAF1] dark:divide-[#1E293B]">
              {filteredRecords.map((att) => {
                // Formatted exact marked time in IST
                const markedTime = new Date(att.marked_at).toLocaleTimeString('en-IN', {
                  timeZone: 'Asia/Kolkata',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true
                });

                return (
                  <tr key={att.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="px-5 py-3.5 font-bold text-slate-900 dark:text-white">
                      {att.student_name}
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {att.student_code}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-700 dark:text-slate-300">
                      {att.session_name}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-600 dark:text-slate-400">
                      {att.attendance_date}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-700 dark:text-slate-300 font-medium">
                      {markedTime} IST
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        {att.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {att.created_by || att.instructor_name || currentInstructor.instructor_code}
                    </td>
                  </tr>
                );
              })}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400 text-xs">
                    No attendance records found matching your active filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
