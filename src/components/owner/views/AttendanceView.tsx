'use client';

import React, { useState } from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { AttendanceRecord } from '@/types';
import { CheckCircle2, Calendar, Filter, Search, Award, Car, Clock } from 'lucide-react';

export const AttendanceView: React.FC = () => {
  const { attendanceRecords, instructors } = useDrivingSchool();

  const [dateFilter, setDateFilter] = useState('');
  const [instructorFilter, setInstructorFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = attendanceRecords.filter(a => {
    const matchesDate = !dateFilter || a.attendance_date === dateFilter;
    const matchesInstructor = instructorFilter === 'all' || a.instructor_id === instructorFilter;
    const matchesSearch = 
      a.student_name.toLowerCase().includes(search.toLowerCase()) ||
      a.student_code.toLowerCase().includes(search.toLowerCase()) ||
      a.session_name.toLowerCase().includes(search.toLowerCase());
    return matchesDate && matchesInstructor && matchesSearch;
  });

  const presentCount = attendanceRecords.filter(a => a.status === 'Present').length;
  const absentCount = attendanceRecords.filter(a => a.status === 'Absent').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" /> Attendance Ledger & Session Audits
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time atomic instructor punch-in logs, biometric/timestamp verification, and vehicle logs.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400 block">Total Practical Sessions Logged</span>
          <span className="text-2xl font-black text-white tabular-nums mt-1 block">{attendanceRecords.length} Classes</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400 block">Present & Completed</span>
          <span className="text-2xl font-black text-emerald-400 tabular-nums mt-1 block">{presentCount} Verified</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400 block">Absent / Rescheduled</span>
          <span className="text-2xl font-black text-rose-400 tabular-nums mt-1 block">{absentCount} Missed</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by student, student code, topic..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
          />
          <select
            value={instructorFilter}
            onChange={e => setInstructorFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Instructors</option>
            {instructors.map(ins => (
              <option key={ins.id} value={ins.id}>{ins.full_name}</option>
            ))}
          </select>
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="text-xs text-blue-400 hover:underline"
            >
              Clear Date
            </button>
          )}
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[850px]">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3.5">Session Date</th>
                <th className="px-4 py-3.5">Student Learner</th>
                <th className="px-4 py-3.5">Curriculum Module</th>
                <th className="px-4 py-3.5">Instructor</th>
                <th className="px-4 py-3.5">Vehicle Used</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Instructor Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.length > 0 ? (
                filtered.map(att => (
                  <tr key={att.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="font-bold text-white block">{att.attendance_date}</span>
                      <span className="text-[10px] text-slate-400 block">
                        {new Date(att.marked_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-white block">{att.student_name}</span>
                      <span className="font-mono text-[10px] text-blue-400 block">{att.student_code}</span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-200">{att.session_name}</td>
                    <td className="px-4 py-3.5 text-slate-300 font-medium">{att.instructor_name}</td>
                    <td className="px-4 py-3.5 font-mono text-slate-400">{att.vehicle_info || 'Maruti Swift (Dual Control)'}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        att.status === 'Present' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {att.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-400 text-[11px] max-w-xs truncate">
                      {att.remarks || 'Session logged successfully.'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500 text-xs">
                    No attendance records found for this criteria.
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
