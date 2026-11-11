'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Car, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles,
  HelpCircle,
  Search
} from 'lucide-react';
import { Instructor, ClassSchedule, AttendanceRecord, Student, Vehicle, InstructorTimeSlotSummary } from '@/types';

interface InstructorDashboardViewProps {
  instructor: Instructor;
  assignedVehicle?: Vehicle;
  assignedStudents: Student[];
  todaySchedules: ClassSchedule[];
  todayAttendance: AttendanceRecord[];
  timeSlotSummaries: InstructorTimeSlotSummary[];
  onSelectTimeSlot: (slot: InstructorTimeSlotSummary) => void;
  onQuickCheckIn: () => void;
}

export const InstructorDashboardView: React.FC<InstructorDashboardViewProps> = ({
  instructor,
  assignedVehicle,
  assignedStudents,
  todaySchedules,
  todayAttendance,
  timeSlotSummaries,
  onSelectTimeSlot,
  onQuickCheckIn
}) => {
  // State for client-evaluated time to prevent prerender hydration mismatches
  const [currentHour, setCurrentHour] = useState<number>(10);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('10:00');

  useEffect(() => {
    const d = new Date();
    const h = d.getHours();
    const m = d.getMinutes();
    setCurrentHour(h);
    setCurrentTimeStr(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  }, []);

  const greeting = currentHour < 12 
    ? `Good Morning, ${instructor.full_name}!`
    : currentHour < 17 
    ? `Good Afternoon, ${instructor.full_name}!`
    : `Good Evening, ${instructor.full_name}!`;

  // Dynamic calculations from actual database records
  const totalStudentsCount = assignedStudents.length;
  const todayTimeSlotsCount = timeSlotSummaries.length;
  const todayScheduledClassesCount = todaySchedules.length;
  
  // Completed classes today (marked Present)
  const completedClassesCount = todayAttendance.filter(a => a.status === 'Present').length;
  
  // Pending classes today
  const pendingClassesCount = Math.max(0, todayScheduledClassesCount - completedClassesCount);
  
  // Upcoming classes: scheduled with start time greater than current time or upcoming slot
  const upcomingClassesCount = todaySchedules.filter(s => {
    try {
      const startTime = new Date(s.scheduled_start).toTimeString().slice(0, 5);
      return startTime > currentTimeStr && s.status === 'Scheduled';
    } catch {
      return s.status === 'Scheduled';
    }
  }).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-200">
      {/* Personalized Greeting Header */}
      <div className="bg-gradient-to-r from-[#14243A] via-[#111E32] to-[#0B1728] border border-[#1E293B] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <Car className="w-3.5 h-3.5 text-blue-400" />
              <span>Model Driving Academy • Instructor Field Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {greeting}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Assigned Vehicle: <strong className="text-white font-bold">{assignedVehicle?.brand} {assignedVehicle?.model} ({assignedVehicle?.registration_number})</strong> • Instructor ID: <span className="font-mono text-blue-400 font-bold">{instructor.instructor_code}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onQuickCheckIn}
              className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition"
            >
              <Search className="w-4 h-4" /> Student Check-in
            </button>
          </div>
        </div>
      </div>

      {/* 6 Summary Cards matching Part 3 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* 1. My Total Students */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-500" /> Total Students
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            {totalStudentsCount}
          </div>
          <span className="text-[10px] text-slate-400 block">Assigned Roster</span>
        </div>

        {/* 2. Today's Time Slots */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-500" /> Today&apos;s Slots
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            {todayTimeSlotsCount}
          </div>
          <span className="text-[10px] text-slate-400 block">Confirmed Shifts</span>
        </div>

        {/* 3. Today's Scheduled Classes */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-600" /> Scheduled
          </span>
          <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            {todayScheduledClassesCount}
          </div>
          <span className="text-[10px] text-slate-400 block">Today&apos;s Lessons</span>
        </div>

        {/* 4. Completed Classes */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Completed
          </span>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
            {completedClassesCount}
          </div>
          <span className="text-[10px] text-emerald-500/80 block">Verified Present</span>
        </div>

        {/* 5. Pending Classes */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Pending
          </span>
          <div className="text-2xl font-black text-amber-500 tabular-nums">
            {pendingClassesCount}
          </div>
          <span className="text-[10px] text-slate-400 block">Awaiting Check-in</span>
        </div>

        {/* 6. Upcoming Classes */}
        <div className="p-4 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-1">
          <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-purple-500" /> Upcoming
          </span>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400 tabular-nums">
            {upcomingClassesCount}
          </div>
          <span className="text-[10px] text-slate-400 block">Later Today</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CRITICAL REQUIREMENT: TIME SLOT FIRST INTERFACE (Part 3)                  */}
      {/* Main dashboard must show time-slot cards, NOT student profile cards.      */}
      {/* Do NOT display student names, IDs, or contact numbers on this dashboard.   */}
      {/* Show ONLY time slots and their student counts.                            */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" /> Today&apos;s Training Time Slots
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select a confirmed time slot below to view its assigned learner group and log attendance.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">
            {timeSlotSummaries.length} Slots Assigned Today
          </span>
        </div>

        {timeSlotSummaries.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl space-y-3">
            <Clock className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Time Slots Scheduled Today</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              You do not have any confirmed student driving shifts assigned for today. Contact academy staff if you expect roster additions.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {timeSlotSummaries.map((slot) => {
              const isAllCompleted = slot.completed_classes > 0 && slot.pending_classes === 0;
              const isInProgress = slot.slot_status === 'In Progress';
              
              return (
                <div
                  key={slot.slot_id}
                  onClick={() => onSelectTimeSlot(slot)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectTimeSlot(slot);
                    }
                  }}
                  className={`p-6 rounded-3xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-sm hover:shadow-md ${
                    isAllCompleted
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 hover:border-emerald-400'
                      : isInProgress
                      ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700 hover:border-blue-500'
                      : 'bg-white dark:bg-[#111E32] border-[#E5EAF1] dark:border-[#1E293B] hover:border-blue-400 dark:hover:border-blue-500'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Slot Header: Start & End Time + Status Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isAllCompleted 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        }`}>
                          <Clock className="w-4 h-4" />
                        </div>
                        <span className="font-mono font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                          {slot.slot_label}
                        </span>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                        isAllCompleted
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                          : isInProgress
                          ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30 animate-pulse'
                          : slot.slot_status === 'Upcoming'
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                          : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
                      }`}>
                        {slot.slot_status}
                      </span>
                    </div>

                    {/* Total Assigned Students Count */}
                    <div className="pt-2">
                      <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums flex items-baseline gap-2">
                        <span>{slot.total_students}</span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {slot.total_students === 1 ? 'Student Assigned' : 'Students Assigned'}
                        </span>
                      </div>
                    </div>

                    {/* Progress indicators: Completed vs Pending Count */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#0B1728]/60 border border-slate-200/60 dark:border-slate-800">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Completed</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {slot.completed_classes} Classes
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-[#0B1728]/60 border border-slate-200/60 dark:border-slate-800">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">Pending</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          {slot.pending_classes} Classes
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Clickable Navigation Indicator */}
                  <div className="pt-4 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-500 transition">
                    <span>View Student List</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
