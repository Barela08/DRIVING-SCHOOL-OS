'use client';

import React, { useState } from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { ClassSchedule } from '@/types';
import { Calendar, Plus, Clock, Car, Award, CheckCircle2, XCircle, Search, Filter } from 'lucide-react';

interface ScheduleViewProps {
  onQuickAdd: (type: any) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ onQuickAdd }) => {
  const { schedules, instructors, updateSchedule, addToast } = useDrivingSchool();

  const [filterInstructor, setFilterInstructor] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = schedules.filter(s => {
    const matchesIns = filterInstructor === 'all' || s.instructor_id === filterInstructor;
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchesIns && matchesStatus;
  });

  const handleStatusChange = async (sch: ClassSchedule, nextStatus: 'Completed' | 'Cancelled') => {
    await updateSchedule(sch.id, { status: nextStatus });
    addToast(`Schedule marked as ${nextStatus}!`, nextStatus === 'Completed' ? 'success' : 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-purple-400" /> Class Schedule & Timetable
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Book slots, assign vehicles and balance driving ground training capacity.
          </p>
        </div>
        <button
          onClick={() => onQuickAdd('schedule')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-lg shadow-purple-600/20 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" /> Book Schedule Slot
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <select
            value={filterInstructor}
            onChange={e => setFilterInstructor(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Instructors</option>
            {instructors.map(ins => (
              <option key={ins.id} value={ins.id}>{ins.full_name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <span className="text-xs text-slate-400 font-semibold">
          {filtered.length} Scheduled Slots Active
        </span>
      </div>

      {/* Schedule Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(sch => (
          <div
            key={sch.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 hover:border-slate-700 transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-bold text-white text-sm block">{sch.student_name}</span>
                <span className="font-mono text-[11px] text-blue-400 block">{sch.student_code}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                sch.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' :
                sch.status === 'Scheduled' ? 'bg-purple-500/20 text-purple-300' :
                'bg-rose-500/20 text-rose-400'
              }`}>
                {sch.status}
              </span>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-purple-400" /> Slot Time:</span>
                <span className="font-bold text-white">
                  {new Date(sch.scheduled_start).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 flex items-center gap-1"><Award className="w-3.5 h-3.5 text-amber-400" /> Instructor:</span>
                <span className="font-medium text-slate-200">{sch.instructor_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 flex items-center gap-1"><Car className="w-3.5 h-3.5 text-cyan-400" /> Vehicle:</span>
                <span className="font-mono text-[11px] text-cyan-300 truncate max-w-[150px]">{sch.vehicle_name}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 font-medium">
              Topic: <strong className="text-white">{sch.topic || 'Driving Practical'}</strong>
            </p>

            {/* Quick Actions */}
            {sch.status === 'Scheduled' && (
              <div className="border-t border-slate-800 pt-3 flex items-center gap-2 text-xs">
                <button
                  onClick={() => handleStatusChange(sch, 'Completed')}
                  className="flex-1 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-bold transition flex items-center justify-center gap-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Mark Done
                </button>
                <button
                  onClick={() => handleStatusChange(sch, 'Cancelled')}
                  className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-bold transition flex items-center justify-center gap-1"
                >
                  <XCircle className="w-3.5 h-3.5" /> Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
