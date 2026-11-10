'use client';

import React, { useState } from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { 
  Car, 
  Search, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  AlertCircle, 
  ChevronRight, 
  User, 
  Fuel, 
  Wrench, 
  Sparkles,
  Award,
  Check,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student, Enrollment, EnrollmentSessionAllocation } from '@/types';

export default function InstructorDashboard() {
  const { 
    instructors, 
    vehicles, 
    students, 
    enrollments, 
    attendanceRecords, 
    markAttendance,
    currentUser 
  } = useDrivingSchool();

  // Find active instructor profile
  const currentInstructor = instructors[0]; // Vikram Shinde
  const assignedVehicle = vehicles.find(v => v.id === currentInstructor.assigned_vehicle_id);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(enrollments[0] || null);
  const [selectedAllocation, setSelectedAllocation] = useState<EnrollmentSessionAllocation | null>(
    enrollments[0]?.session_allocations?.[7] || null // Hill start
  );
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Filter assigned students
  const myEnrollments = enrollments.filter(e => 
    e.assigned_instructor_id === currentInstructor.id || 
    e.assigned_instructor_name?.includes('Vikram')
  );

  // Filter search
  const filteredEnrollments = searchQuery.trim()
    ? myEnrollments.filter(e => 
        e.student_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.student_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : myEnrollments;

  // Recent attendance marked by this instructor
  const myRecentAttendance = attendanceRecords
    .filter(a => a.instructor_id === currentInstructor.id || a.instructor_name?.includes('Vikram'))
    .slice(0, 10);

  // 1-Click Attendance Handler
  const handleMarkAttendance = async () => {
    if (!selectedEnrollment || !selectedAllocation) return;

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await markAttendance({
        enrollmentId: selectedEnrollment.id,
        sessionAllocationId: selectedAllocation.id,
        instructorId: currentInstructor.id,
        vehicleId: assignedVehicle?.id,
        remarks: remarks.trim() || undefined
      });

      if (res.success) {
        // Confetti explosion
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 }
        });

        setSuccessMessage(res.message);
        setRemarks('');

        // Refresh selected enrollment from updated list
        const updated = enrollments.find(e => e.id === selectedEnrollment.id);
        if (updated) {
          setSelectedEnrollment(updated);
          const updatedAlloc = updated.session_allocations?.find(sa => sa.id === selectedAllocation.id);
          if (updatedAlloc) setSelectedAllocation(updatedAlloc);
        }
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to record attendance');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Instructor Mobile Header Bar */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xl shadow-lg">
              VS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">{currentInstructor.full_name}</h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {currentInstructor.instructor_code}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Senior Driving Instructor • {currentInstructor.experience_years} Years Experience
              </p>
            </div>
          </div>

          {/* Assigned Training Car */}
          <div className="flex items-center gap-3 bg-slate-950/70 border border-slate-800 px-4 py-2.5 rounded-2xl">
            <Car className="w-5 h-5 text-amber-400" />
            <div className="text-xs">
              <span className="text-slate-400 block text-[10px]">Training Vehicle:</span>
              <span className="font-semibold text-white">{assignedVehicle?.brand} {assignedVehicle?.model}</span>
              <span className="text-slate-400 font-mono block text-[11px]">{assignedVehicle?.registration_number}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Student Search & Selection (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Student Search Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Search Assigned Student</span>
              <span className="text-[11px] text-emerald-400 lowercase">{myEnrollments.length} assigned</span>
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Student Code (e.g. DS-2026-00101) or Name..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* List of Assigned Students */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {filteredEnrollments.map(enr => {
                const isSelected = selectedEnrollment?.id === enr.id;
                const progressPct = Math.round((enr.completed_sessions / enr.total_sessions) * 100);

                return (
                  <button
                    key={enr.id}
                    onClick={() => {
                      setSelectedEnrollment(enr);
                      // Default to first incomplete allocation
                      const nextAlloc = enr.session_allocations?.find(sa => sa.completed_count < sa.allocated_count);
                      setSelectedAllocation(nextAlloc || enr.session_allocations?.[0] || null);
                      setSuccessMessage('');
                      setErrorMessage('');
                    }}
                    className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{enr.student_name}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-slate-800 text-slate-300">
                          {enr.student_code}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate max-w-[210px]">{enr.course_name}</p>

                      {/* Mini Progress */}
                      <div className="flex items-center gap-2 pt-1 text-[11px]">
                        <div className="w-24 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-emerald-400 h-full rounded-full" 
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                        <span className="font-bold text-emerald-400">{enr.completed_sessions} / {enr.total_sessions}</span>
                        <span className="text-slate-500">done</span>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-600'}`} />
                  </button>
                );
              })}

              {filteredEnrollments.length === 0 && (
                <div className="text-center py-8 text-xs text-slate-500">
                  No assigned students matching "{searchQuery}"
                </div>
              )}
            </div>
          </div>

          {/* Quick Vehicle Issue Report */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <Wrench className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Report Vehicle Maintenance Issue</span>
            </div>
            <button 
              onClick={() => alert(`Vehicle issue report logged for ${assignedVehicle?.registration_number}. Staff notified.`)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-amber-300 border border-slate-700 transition"
            >
              Log Issue
            </button>
          </div>
        </div>

        {/* Right Column: ONE-CLICK ATTENDANCE MARKING ACTION (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedEnrollment ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6">
              {/* Selected Student Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {selectedEnrollment.student_code}
                    </span>
                    <h2 className="text-xl font-extrabold text-white">{selectedEnrollment.student_name}</h2>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{selectedEnrollment.course_name}</p>
                </div>

                <div className="text-right sm:text-right">
                  <div className="text-2xl font-black text-emerald-400">
                    {selectedEnrollment.completed_sessions} <span className="text-slate-500 text-base font-normal">/ {selectedEnrollment.total_sessions}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block">Total Driving Sessions Completed</span>
                </div>
              </div>

              {/* Feedback Alerts */}
              {successMessage && (
                <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                  <div className="font-semibold">{successMessage}</div>
                </div>
              )}

              {errorMessage && (
                <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                  <div className="font-semibold">{errorMessage}</div>
                </div>
              )}

              {/* Step 1: Select Session Category */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Select Driving Session Topic (Curriculum Allocation)
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[260px] overflow-y-auto pr-1">
                  {selectedEnrollment.session_allocations?.map(sa => {
                    const isSelected = selectedAllocation?.id === sa.id;
                    const isExhausted = sa.completed_count >= sa.allocated_count;
                    const remaining = sa.allocated_count - sa.completed_count;

                    return (
                      <button
                        key={sa.id}
                        disabled={isExhausted}
                        onClick={() => {
                          setSelectedAllocation(sa);
                          setSuccessMessage('');
                          setErrorMessage('');
                        }}
                        className={`text-left p-3 rounded-xl border text-xs transition flex flex-col justify-between gap-1.5 ${
                          isExhausted
                            ? 'opacity-40 bg-slate-950/40 border-slate-800 cursor-not-allowed'
                            : isSelected
                            ? 'bg-emerald-600/20 border-emerald-500 shadow-md text-white font-bold'
                            : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold truncate max-w-[170px]">{sa.session_name_snapshot}</span>
                          {isExhausted ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-400">
                              DONE
                            </span>
                          ) : (
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-emerald-400'
                            }`}>
                              {remaining} left
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>Completed: {sa.completed_count} of {sa.allocated_count}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Instructor Remarks */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Student Driving Performance Remarks (Optional)
                </label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="e.g. Smooth gear shifts, good mirror checks on turns..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Step 3: THE ONE-CLICK ATTENDANCE ACTION BUTTON */}
              <div className="pt-2">
                <button
                  onClick={handleMarkAttendance}
                  disabled={isSubmitting || !selectedAllocation || (selectedAllocation.completed_count >= selectedAllocation.allocated_count)}
                  className={`w-full py-4 px-6 rounded-2xl font-black text-sm tracking-wide uppercase transition shadow-xl flex items-center justify-center gap-3 ${
                    !selectedAllocation || (selectedAllocation.completed_count >= selectedAllocation.allocated_count)
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      : 'bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 shadow-emerald-500/25 active:scale-[0.99]'
                  }`}
                >
                  <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                  <span>
                    {isSubmitting 
                      ? 'Recording Attendance...' 
                      : `Mark Attendance: ${selectedAllocation?.session_name_snapshot || 'Select Session'}`}
                  </span>
                </button>
                <p className="text-[11px] text-slate-500 text-center mt-2">
                  🔒 Atomic database transaction with anti-duplicate guard & audit logging.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
              <User className="w-12 h-12 mx-auto text-slate-600" />
              <h3 className="text-base font-semibold text-white">No Student Selected</h3>
              <p className="text-xs max-w-sm mx-auto">
                Select an assigned student from the left panel or search by Student Code (e.g. DS-2026-00101) to record driving sessions.
              </p>
            </div>
          )}

          {/* Today's Completed Classes Feed */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>My Recorded Driving Sessions</span>
              <span className="text-emerald-400 text-[11px]">{myRecentAttendance.length} records</span>
            </h3>

            <div className="space-y-2">
              {myRecentAttendance.map(att => (
                <div 
                  key={att.id} 
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{att.student_name}</span>
                      <span className="font-mono text-[10px] text-slate-400">{att.student_code}</span>
                    </div>
                    <span className="text-[11px] text-slate-300 block mt-0.5">{att.session_name}</span>
                    {att.remarks && (
                      <span className="text-[10px] text-slate-500 italic block mt-0.5">"{att.remarks}"</span>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      PRESENT
                    </span>
                    <span className="block text-[10px] text-slate-500 mt-1 font-mono">
                      {new Date(att.marked_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
