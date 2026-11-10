'use client';

import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Car, 
  User, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ListFilter, 
  ChevronLeft, 
  ChevronRight,
  MapPin,
  Sparkles,
  Phone
} from 'lucide-react';
import { ClassSchedule, Instructor, Vehicle } from '@/types';

interface StudentScheduleProps {
  schedules: ClassSchedule[];
  instructor?: Instructor;
  vehicle?: Vehicle;
}

export const StudentSchedule: React.FC<StudentScheduleProps> = ({
  schedules,
  instructor,
  vehicle
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Scheduled' | 'Completed' | 'Cancelled'>('all');
  
  // Calendar month state (November 2026 default)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(10); // 0-indexed: 10 = November
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>('2026-11-10');

  // Filtered list schedules
  const filteredSchedules = schedules.filter(sch => {
    if (statusFilter === 'all') return true;
    return sch.status === statusFilter;
  });

  // Calendar calculations
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
  const monthName = new Date(currentYear, currentMonth, 1).toLocaleString('default', { month: 'long' });

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Schedules matching the selected calendar date
  const selectedDateSchedules = schedules.filter(s => {
    const sDate = s.scheduled_start.split('T')[0];
    return sDate === selectedCalendarDate;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Class Schedules & Road Appointments
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Synchronized with academy dispatch radar. Only your private sessions are shown.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View Mode Toggle */}
          <div className="p-1 rounded-xl bg-slate-100 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex items-center text-xs">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg font-bold transition ${
                viewMode === 'calendar'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Calendar View
            </button>
          </div>

          {/* Status Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">All Statuses ({schedules.length})</option>
            <option value="Scheduled">Upcoming Scheduled</option>
            <option value="Completed">Completed Lessons</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* LIST VIEW */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {filteredSchedules.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl space-y-2">
              <CalendarIcon className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No schedules found</h3>
              <p className="text-xs text-slate-500">No classes match the selected filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSchedules.map((sch) => {
                const isScheduled = sch.status === 'Scheduled';
                const isCompleted = sch.status === 'Completed';
                const isCancelled = sch.status === 'Cancelled';

                const startDate = new Date(sch.scheduled_start);
                const endDate = new Date(sch.scheduled_end);

                return (
                  <div
                    key={sch.id}
                    className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                            Lesson Topic
                          </span>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                            {sch.topic}
                          </h4>
                        </div>

                        {isScheduled && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 shrink-0">
                            Scheduled
                          </span>
                        )}
                        {isCompleted && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
                            Completed
                          </span>
                        )}
                        {isCancelled && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 shrink-0">
                            Cancelled
                          </span>
                        )}
                      </div>

                      {/* Date & Time pill */}
                      <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-1 text-xs">
                        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                          <CalendarIcon className="w-3.5 h-3.5 text-blue-500" />
                          <span>
                            {startDate.toLocaleDateString('en-IN', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>
                            {startDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} - {endDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      {/* Instructor & Vehicle details */}
                      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <User className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span className="truncate">{sch.instructor_name}</span>
                        </div>

                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <Car className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="truncate">{sch.vehicle_name || 'Assigned Car'}</span>
                        </div>
                      </div>
                    </div>

                    {isScheduled && (
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">Arrive at Camp Branch Test Track</span>
                        {instructor?.phone && (
                          <a
                            href={`tel:${instructor.phone}`}
                            className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            <Phone className="w-3 h-3" /> Contact Trainer
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* CALENDAR VIEW */}
      {viewMode === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Calendar Grid (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {monthName} {currentYear}
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={prevMonth}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#0B1728] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#0B1728] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 dark:text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-800">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                <div key={d} className="py-1">{d}</div>
              ))}
            </div>

            {/* Calendar Days Matrix */}
            <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
              {/* Empty leading days */}
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="p-3" />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const isSelected = dateStr === selectedCalendarDate;
                
                // Schedules for this day
                const daySchedules = schedules.filter(s => s.scheduled_start.split('T')[0] === dateStr);
                const hasScheduled = daySchedules.some(s => s.status === 'Scheduled');
                const hasCompleted = daySchedules.some(s => s.status === 'Completed');

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedCalendarDate(dateStr)}
                    className={`p-2.5 rounded-2xl flex flex-col items-center justify-between min-h-[56px] transition relative ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30 ring-2 ring-blue-400'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <span className="text-xs font-semibold">{day}</span>
                    <div className="flex gap-1 mt-1">
                      {hasScheduled && (
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-blue-500'}`} />
                      )}
                      {hasCompleted && (
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-emerald-300' : 'bg-emerald-500'}`} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details for Selected Day (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4">
            <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Selected Day Agenda
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {new Date(selectedCalendarDate).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </h4>
            </div>

            {selectedDateSchedules.length === 0 ? (
              <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-xs space-y-1">
                <CalendarIcon className="w-6 h-6 text-slate-400 mx-auto" />
                <p>No driving sessions scheduled on this date.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateSchedules.map((sch) => (
                  <div
                    key={sch.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{sch.topic}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400">
                        {sch.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      {new Date(sch.scheduled_start).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} - {new Date(sch.scheduled_end).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </p>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                      Instructor: <strong className="text-slate-800 dark:text-slate-200">{sch.instructor_name}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};