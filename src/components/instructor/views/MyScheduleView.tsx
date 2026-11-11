'use client';

import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Car, 
  User, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  CalendarDays
} from 'lucide-react';
import { ClassSchedule, Instructor, Vehicle } from '@/types';

interface MyScheduleViewProps {
  currentInstructor: Instructor;
  assignedVehicle?: Vehicle;
  schedules: ClassSchedule[];
  onOpenStudent: (studentCode: string) => void;
}

export const MyScheduleView: React.FC<MyScheduleViewProps> = ({
  currentInstructor,
  assignedVehicle,
  schedules,
  onOpenStudent
}) => {
  const [selectedDayTab, setSelectedDayTab] = useState<'today' | 'tomorrow' | 'week'>('today');

  // Filter schedules assigned to this instructor
  const mySchedules = schedules.filter(s => s.instructor_id === currentInstructor.id);

  const todayStr = '2026-11-10'; // or current date
  const todayClasses = mySchedules.filter(s => s.scheduled_start.startsWith(todayStr));
  const tomorrowClasses = mySchedules.filter(s => s.scheduled_start.startsWith('2026-11-11'));

  const displayedClasses = selectedDayTab === 'today' 
    ? todayClasses 
    : selectedDayTab === 'tomorrow' 
    ? tomorrowClasses 
    : mySchedules;

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-200 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <CalendarIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            My Driving Schedule Roster
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Daily and weekly schedule of confirmed student driving appointments assigned to {currentInstructor.full_name}.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] text-xs font-bold">
          <button
            onClick={() => setSelectedDayTab('today')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              selectedDayTab === 'today'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-white'
            }`}
          >
            Today ({todayClasses.length})
          </button>
          <button
            onClick={() => setSelectedDayTab('tomorrow')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              selectedDayTab === 'tomorrow'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-white'
            }`}
          >
            Tomorrow ({tomorrowClasses.length})
          </button>
          <button
            onClick={() => setSelectedDayTab('week')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              selectedDayTab === 'week'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-white'
            }`}
          >
            All Classes ({mySchedules.length})
          </button>
        </div>
      </div>

      {/* Vehicle Info Callout */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white">Assigned Dual-Control Car:</span>
            <span className="text-slate-500 dark:text-slate-400 block mt-0.5">
              {assignedVehicle ? `${assignedVehicle.brand} ${assignedVehicle.model} (${assignedVehicle.registration_number})` : 'Maruti Swift Dzire (MH-12-AB-1234)'}
            </span>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 border border-emerald-500/25">
          Dual Control Ready
        </span>
      </div>

      {/* Schedule Items List */}
      <div className="space-y-3">
        {displayedClasses.map(sch => {
          const startTime = new Date(sch.scheduled_start).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
          const endTime = new Date(sch.scheduled_end).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
          const formattedDate = new Date(sch.scheduled_start).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

          return (
            <div
              key={sch.id}
              className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:border-blue-400 transition"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-center min-w-[80px]">
                  <span className="font-mono font-black text-sm text-blue-600 dark:text-blue-400 block">
                    {startTime}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">to {endTime}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">
                      {sch.student_name}
                    </span>
                    <span className="font-mono text-blue-600 dark:text-blue-400 font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50">
                      {sch.student_code}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400">
                    Topic: <strong className="text-slate-700 dark:text-slate-300 font-medium">{sch.topic || sch.session_type || 'Practical Driving Session'}</strong>
                  </p>
                  <span className="text-[11px] text-slate-400 block">
                    Date: {formattedDate} • Car: {sch.vehicle_name || 'Dual Control Swift'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto">
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                  sch.status === 'Completed' || sch.attendance_status === 'Present'
                    ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30'
                    : sch.status === 'Cancelled'
                    ? 'bg-rose-500/15 text-rose-600 border-rose-500/30'
                    : 'bg-blue-500/15 text-blue-600 border-blue-500/30'
                }`}>
                  {sch.attendance_status === 'Present' ? 'Completed' : sch.status}
                </span>

                <button
                  onClick={() => onOpenStudent(sch.student_code)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                >
                  <span>Student Profile</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {displayedClasses.length === 0 && (
          <div className="p-12 text-center bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl space-y-2">
            <CalendarIcon className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Classes for Selected Period</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">You do not have any confirmed driving appointments scheduled here.</p>
          </div>
        )}
      </div>
    </div>
  );
};
