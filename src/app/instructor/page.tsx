'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { 
  LayoutDashboard, 
  Search, 
  Users, 
  Calendar, 
  CheckCircle2, 
  History, 
  Award, 
  Bell, 
  User, 
  Menu, 
  X, 
  Car, 
  ChevronRight, 
  AlertCircle, 
  Clock, 
  Sparkles, 
  Wrench,
  Check,
  Send,
  Lock,
  ChevronLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student, Enrollment, EnrollmentSessionAllocation, AttendanceRecord } from '@/types';

interface InstructorPortalProps {
  initialModule?: string;
}

export default function InstructorPortalPage({ initialModule = 'dashboard' }: InstructorPortalProps) {
  const { 
    school, 
    instructors, 
    vehicles, 
    students, 
    enrollments, 
    attendanceRecords, 
    schedules, 
    notifications, 
    markAttendance,
    currentUser,
    addToast
  } = useDrivingSchool();

  // Active instructor: Vikram Shinde (INS-2026-01)
  const currentInstructor = instructors.find(i => i.user_id === currentUser.id) || instructors[0];
  const assignedVehicle = vehicles.find(v => v.id === currentInstructor.assigned_vehicle_id);

  // Active navigation module
  const [activeNav, setActiveNav] = useState(initialModule);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  useEffect(() => {
    if (initialModule) {
      setActiveNav(initialModule);
    }
  }, [initialModule]);

  // Student Search State
  const [searchCode, setSearchCode] = useState('');
  const [searchedStudent, setSearchedStudent] = useState<Student | null>(null);
  const [searchedEnrollment, setSearchedEnrollment] = useState<Enrollment | null>(null);
  const [searchError, setSearchError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // One-Click Attendance Form State
  const [selectedAllocationId, setSelectedAllocationId] = useState<string>('');
  const [attendanceRemarks, setAttendanceRemarks] = useState('');
  const [isSubmittingAttendance, setIsSubmittingAttendance] = useState(false);
  const [lastMarkedRecord, setLastMarkedRecord] = useState<AttendanceRecord | null>(null);

  // Navigation Items matching Section 5.C
  const navItems = [
    { id: 'dashboard', path: '/instructor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'find-student', path: '/instructor/find-student', label: 'Find Student', icon: Search },
    { id: 'students', path: '/instructor/students', label: 'My Students', icon: Users },
    { id: 'attendance', path: '/instructor/attendance', label: 'Mark Attendance', icon: CheckCircle2 },
    { id: 'history', path: '/instructor/history', label: 'Attendance History', icon: History },
    { id: 'schedule', path: '/instructor/schedule', label: 'My Schedule', icon: Calendar },
    { id: 'profile', path: '/instructor/profile', label: 'My Profile', icon: User }
  ];

  // Assigned students to this instructor
  const myEnrollments = enrollments.filter(e => e.assigned_instructor_id === currentInstructor.id);
  const myStudentIds = new Set(myEnrollments.map(e => e.student_id));
  const myStudents = students.filter(s => myStudentIds.has(s.id));

  // Today's schedule for this instructor
  const todayStr = '2026-11-10';
  const myTodaySchedules = schedules.filter(s => s.instructor_id === currentInstructor.id);
  const myAttendanceRecords = attendanceRecords.filter(a => a.instructor_id === currentInstructor.id);
  const todayCompletedCount = myAttendanceRecords.filter(a => a.attendance_date === todayStr).length;

  // Student Search Handler enforcing assignment security
  const handleSearchStudent = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchError('');
    setSearchedStudent(null);
    setSearchedEnrollment(null);

    const query = searchCode.trim().toUpperCase();
    if (!query) {
      setSearchError('Please enter a Student ID (e.g. DS-2026-00101)');
      return;
    }

    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      // Strictly verify assignment to current instructor!
      // If student does not exist OR is not assigned to this instructor:
      // Show exactly the requested message: "Student not found or you are not authorized to access this student."
      const student = students.find(s => s.student_code.toUpperCase() === query);
      const enrollment = student ? enrollments.find(e => e.student_id === student.id) : null;

      if (!student || !enrollment || enrollment.assigned_instructor_id !== currentInstructor.id) {
        setSearchError('Student not found or you are not authorized to access this student.');
        return;
      }

      setSearchedStudent(student);
      setSearchedEnrollment(enrollment);
      if (enrollment.session_allocations && enrollment.session_allocations.length > 0) {
        // default to first category with remaining quota
        const firstAvailable = enrollment.session_allocations.find(sa => sa.completed_count < sa.allocated_count);
        setSelectedAllocationId(firstAvailable ? firstAvailable.id : enrollment.session_allocations[0].id);
      }
    }, 200);
  };

  // One-Click Attendance Action
  const handleMarkAttendance = async () => {
    if (!searchedEnrollment || !selectedAllocationId) {
      addToast('Please select a session module', 'error');
      return;
    }

    const allocation = searchedEnrollment.session_allocations?.find(sa => sa.id === selectedAllocationId);
    if (!allocation) {
      addToast('Invalid session allocation', 'error');
      return;
    }

    if (allocation.completed_count >= allocation.allocated_count) {
      addToast(`Allocation exhausted for ${allocation.session_name_snapshot}!`, 'error');
      return;
    }

    setIsSubmittingAttendance(true);
    try {
      const res = await markAttendance({
        enrollmentId: searchedEnrollment.id,
        sessionAllocationId: selectedAllocationId,
        instructorId: currentInstructor.id,
        vehicleId: assignedVehicle?.id,
        remarks: attendanceRemarks || 'Driving lesson conducted'
      });

      if (res.success) {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });

        if (res.attendance) {
          setLastMarkedRecord(res.attendance);
        }

        addToast(res.message, 'success');
        setAttendanceRemarks('');

        // Refresh searched enrollment allocations
        const updatedEnrollment = enrollments.find(e => e.id === searchedEnrollment.id);
        if (updatedEnrollment) {
          setSearchedEnrollment(updatedEnrollment);
        }
      } else {
        addToast(res.message, 'error');
      }
    } catch (err: any) {
      addToast(err?.message || 'Failed to mark attendance', 'error');
    } finally {
      setIsSubmittingAttendance(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0B1728] text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Mobile-Friendly Top Navigation */}
      <div className="bg-[#111E32] border-b border-[#1E293B] text-white py-3 px-4 sm:px-6 flex items-center justify-between sticky top-[53px] z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight">
                INSTRUCTOR MOBILE PWA
              </h1>
              <span className="text-[10px] text-blue-400 font-mono">
                {currentInstructor.full_name} ({currentInstructor.instructor_code})
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="hidden sm:inline font-mono text-slate-400">
            Car: {assignedVehicle?.model || 'Swift Dzire'}
          </span>
          <button
            onClick={() => setActiveNav('find-student')}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Search className="w-3.5 h-3.5" /> Quick Student Look-up
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Fixed Desktop Sidebar */}
        <aside className={`hidden lg:block fixed left-0 top-[102px] bottom-0 z-20 bg-[#111E32] border-r border-[#1E293B] transition-all duration-300 ${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        }`}>
          <div className="flex flex-col h-full py-4 px-2 space-y-1">
            <div className="flex-1 overflow-y-auto space-y-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    onClick={() => setActiveNav(item.id)}
                    title={isSidebarCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                        : 'text-slate-300 hover:bg-[#14243A] hover:text-white'
                    } ${isSidebarCollapsed ? 'justify-center px-2' : ''}`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-[#1E293B]">
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition"
              >
                {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                {!isSidebarCollapsed && <span className="ml-2 text-[11px]">Collapse Menu</span>}
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div 
              className="fixed inset-0 bg-black/70 backdrop-blur-sm" 
              onClick={() => setIsMobileDrawerOpen(false)} 
            />
            <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#111E32] p-4 shadow-2xl z-50 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
                <span className="font-bold text-white text-sm">Instructor Menu</span>
                <button onClick={() => setIsMobileDrawerOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-1">
                {navItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.id}
                      href={item.path}
                      onClick={() => { setActiveNav(item.id); setIsMobileDrawerOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                        activeNav === item.id ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-[#14243A]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className={`flex-1 transition-all duration-300 p-4 sm:p-6 lg:p-8 ${
          isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}>
          {/* ========================================================================= */}
          {/* 1. DASHBOARD & STATS                                                      */}
          {/* ========================================================================= */}
          {activeNav === 'dashboard' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Instructor Dashboard
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Welcome back, {currentInstructor.full_name} • Dual-Control Car: {assignedVehicle?.model} ({assignedVehicle?.registration_number})
                  </p>
                </div>
              </div>

              {/* 6 Statistics Cards matching Section 5.C */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-2">
                  <span className="text-xs text-slate-500 font-semibold">Assigned Students</span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{myStudents.length}</div>
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">Active Enrollees</span>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-2">
                  <span className="text-xs text-slate-500 font-semibold">Today's Classes</span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{myTodaySchedules.length}</div>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">{todayCompletedCount} Completed</span>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-2">
                  <span className="text-xs text-slate-500 font-semibold">Completed Sessions</span>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{todayCompletedCount}</div>
                  <span className="text-[11px] text-slate-400">Marked Today</span>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-2">
                  <span className="text-xs text-slate-500 font-semibold">Pending Sessions</span>
                  <div className="text-2xl font-black text-amber-500">
                    {Math.max(0, myTodaySchedules.length - todayCompletedCount)}
                  </div>
                  <span className="text-[11px] text-slate-400">Remaining Today</span>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-2">
                  <span className="text-xs text-slate-500 font-semibold">This Month's Classes</span>
                  <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{myAttendanceRecords.length}</div>
                  <span className="text-[11px] text-slate-400">Atomic Logs Verified</span>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-2">
                  <span className="text-xs text-slate-500 font-semibold">Attendance Summary</span>
                  <div className="text-2xl font-black text-teal-600 dark:text-teal-400">100%</div>
                  <span className="text-[11px] text-slate-400">Zero Unaccounted Sessions</span>
                </div>
              </div>

              {/* Quick 1-Click Search Callout */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-[#14243A] to-[#111E32] text-white border border-[#1E293B] shadow-xl space-y-4">
                <div className="max-w-xl space-y-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    CORE FIELD TOOL
                  </span>
                  <h3 className="text-lg font-bold">1-Click Mobile Driving Attendance</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Search your assigned student by ID (e.g. <span className="font-mono text-blue-400 font-bold">DS-2026-00101</span>) to inspect remaining quota and log driving attendance atomically.
                  </p>
                </div>
                <button
                  onClick={() => setActiveNav('find-student')}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
                >
                  <Search className="w-4 h-4" /> Open Student Attendance Form
                </button>
              </div>

              {/* Today's Classes List */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" /> Today's Scheduled Driving Lessons
                </h3>

                <div className="space-y-3">
                  {myTodaySchedules.map(sch => (
                    <div
                      key={sch.id}
                      className="p-4 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">{sch.student_name}</span>
                          <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{sch.student_code}</span>
                        </div>
                        <span className="text-slate-500 mt-0.5 block">Topic: {sch.topic}</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-mono text-slate-600 dark:text-slate-400 font-medium">
                          {new Date(sch.scheduled_start).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} – {new Date(sch.scheduled_end).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <button
                          onClick={() => {
                            setSearchCode(sch.student_code);
                            setActiveNav('find-student');
                            setTimeout(() => {
                              // Trigger auto search
                              const btn = document.getElementById('search-student-btn');
                              if (btn) btn.click();
                            }, 100);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                        >
                          Mark Attendance
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. FIND STUDENT & 1-CLICK ATOMIC ATTENDANCE                                */}
          {/* ========================================================================= */}
          {(activeNav === 'find-student' || activeNav === 'attendance') && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Find Assigned Learner & Mark Attendance
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enter the student code. Only students assigned to your training roster can be verified.
                  </p>
                </div>

                {/* Prominent Student Search Form */}
                <form onSubmit={handleSearchStudent} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={searchCode}
                      onChange={(e) => setSearchCode(e.target.value)}
                      placeholder="Enter Student ID (e.g. DS-2026-00101)"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white font-mono font-bold text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <button
                    id="search-student-btn"
                    type="submit"
                    disabled={isSearching}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition disabled:opacity-50"
                  >
                    {isSearching ? 'Searching...' : 'Find Student'}
                  </button>
                </form>

                {/* Strict Error Message */}
                {searchError && (
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span className="font-medium">{searchError}</span>
                  </div>
                )}
              </div>

              {/* Student Information & One-Click Attendance Interface */}
              {searchedStudent && searchedEnrollment && (
                <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-xl space-y-6">
                  {/* Student Details Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5EAF1] dark:border-[#1E293B]">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-600 dark:text-blue-400 font-black text-xl flex items-center justify-center">
                        {searchedStudent.full_name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-slate-900 dark:text-white">
                            {searchedStudent.full_name}
                          </h3>
                          <span className="px-2 py-0.2 rounded text-xs font-mono font-bold bg-blue-500/20 text-blue-400">
                            {searchedStudent.student_code}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {searchedEnrollment.course_name} • Status: <strong className="text-emerald-600">{searchedEnrollment.status}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-black text-blue-600 dark:text-blue-400 tabular-nums">
                        {searchedEnrollment.completed_sessions} <span className="text-xs text-slate-400 font-normal">/ {searchedEnrollment.total_sessions}</span>
                      </div>
                      <span className="text-xs text-slate-400">Total Driving Sessions</span>
                    </div>
                  </div>

                  {/* Session Categories Selection */}
                  <div className="space-y-3">
                    <label className="font-bold text-xs text-slate-700 dark:text-slate-300 block uppercase tracking-wider text-[11px]">
                      Select Practical Driving Session Category:
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {searchedEnrollment.session_allocations?.map(sa => {
                        const isSelected = selectedAllocationId === sa.id;
                        const isExhausted = sa.completed_count >= sa.allocated_count;
                        const remaining = sa.allocated_count - sa.completed_count;

                        return (
                          <div
                            key={sa.id}
                            onClick={() => !isExhausted && setSelectedAllocationId(sa.id)}
                            className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                              isExhausted
                                ? 'opacity-40 bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-800 cursor-not-allowed'
                                : isSelected
                                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 shadow-md'
                                : 'bg-[#F5F7FB] dark:bg-[#0B1728] border-[#E5EAF1] dark:border-[#1E293B] hover:border-blue-400'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-slate-900 dark:text-white">
                                {sa.session_name_snapshot}
                              </span>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                            </div>

                            <div className="flex items-center justify-between text-xs mt-3 pt-2 border-t border-slate-200 dark:border-slate-800">
                              <span className="text-slate-500 text-[11px]">
                                Completed: <strong>{sa.completed_count}/{sa.allocated_count}</strong>
                              </span>
                              <span className={`text-[11px] font-bold ${isExhausted ? 'text-slate-400' : 'text-emerald-600'}`}>
                                {isExhausted ? 'Quota Done' : `${remaining} Remaining`}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Driving Performance Remarks */}
                  <div className="space-y-1 text-xs">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Driving Performance Remarks (Optional)
                    </label>
                    <input
                      type="text"
                      value={attendanceRemarks}
                      onChange={(e) => setAttendanceRemarks(e.target.value)}
                      placeholder="e.g. Smooth clutch control on hill slopes; good mirror checks."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  {/* Big Touch-Friendly "Mark Attendance" Action Button */}
                  <button
                    onClick={handleMarkAttendance}
                    disabled={isSubmittingAttendance || !selectedAllocationId}
                    className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
                  >
                    {isSubmittingAttendance ? (
                      <span>Validating & Recording Attendance...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" /> Mark Driving Attendance Now (Atomic)
                      </>
                    )}
                  </button>

                  {/* Last Recorded Attendance Confirmation */}
                  {lastMarkedRecord && (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>
                          Attendance logged for <strong>{lastMarkedRecord.student_name}</strong> ({lastMarkedRecord.session_name})
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-500">
                        {new Date(lastMarkedRecord.marked_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. MY ASSIGNED STUDENTS LIST                                              */}
          {/* ========================================================================= */}
          {activeNav === 'students' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-5 max-w-5xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">My Assigned Learners</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Students allocated to your training vehicle</p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-[#E5EAF1] dark:border-[#1E293B]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F5F7FB] dark:bg-[#0B1728] text-slate-500 uppercase font-semibold">
                    <tr>
                      <th className="px-4 py-3">Code</th>
                      <th className="px-4 py-3">Learner Name</th>
                      <th className="px-4 py-3">Course</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Progress</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5EAF1] dark:divide-[#1E293B]">
                    {myStudents.map(s => {
                      const enr = enrollments.find(e => e.student_id === s.id);
                      return (
                        <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                          <td className="px-4 py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">{s.student_code}</td>
                          <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">{s.full_name}</td>
                          <td className="px-4 py-3.5">{s.enrolled_course_name}</td>
                          <td className="px-4 py-3.5 font-mono">{s.phone}</td>
                          <td className="px-4 py-3.5 font-mono font-bold text-emerald-600">
                            {enr ? `${enr.completed_sessions} / ${enr.total_sessions}` : '0 / 20'}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <button
                              onClick={() => {
                                setSearchCode(s.student_code);
                                setActiveNav('find-student');
                                setTimeout(() => {
                                  const btn = document.getElementById('search-student-btn');
                                  if (btn) btn.click();
                                }, 50);
                              }}
                              className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px]"
                            >
                              Open
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. ATTENDANCE HISTORY                                                     */}
          {/* ========================================================================= */}
          {activeNav === 'history' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-5 max-w-5xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">My Attendance History</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Past classes logged by {currentInstructor.full_name}</p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-[#E5EAF1] dark:border-[#1E293B]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F5F7FB] dark:bg-[#0B1728] text-slate-500 uppercase font-semibold">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Time</th>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Session Category</th>
                      <th className="px-4 py-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5EAF1] dark:divide-[#1E293B]">
                    {myAttendanceRecords.map(att => (
                      <tr key={att.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                        <td className="px-4 py-3.5 font-mono text-slate-500">{att.attendance_date}</td>
                        <td className="px-4 py-3.5 font-mono text-slate-400">
                          {new Date(att.marked_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">{att.student_name}</td>
                        <td className="px-4 py-3.5 font-semibold text-blue-600 dark:text-blue-400">{att.session_name}</td>
                        <td className="px-4 py-3.5 text-slate-500 italic">{att.remarks || 'Standard drive'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. MY SCHEDULE                                                            */}
          {/* ========================================================================= */}
          {activeNav === 'schedule' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-5 max-w-5xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">My Driving Class Roster</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Scheduled slots assigned to your vehicle</p>
              </div>

              <div className="space-y-3">
                {myTodaySchedules.map(sch => (
                  <div key={sch.id} className="p-4 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{sch.student_name}</span>
                        <span className="font-mono text-blue-600 font-bold">{sch.student_code}</span>
                      </div>
                      <span className="text-slate-500 block mt-0.5">{sch.topic}</span>
                    </div>
                    <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">
                      {new Date(sch.scheduled_start).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} – {new Date(sch.scheduled_end).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 6. INSTRUCTOR PROFILE                                                     */}
          {/* ========================================================================= */}
          {activeNav === 'profile' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-6 max-w-xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Instructor Profile</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Driver identity and vehicle assignment details</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-4 text-xs">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-bold text-xl flex items-center justify-center">
                    {currentInstructor.full_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">{currentInstructor.full_name}</h3>
                    <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{currentInstructor.instructor_code}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Mobile:</span>
                    <strong className="text-slate-800 dark:text-slate-200 font-mono">{currentInstructor.phone}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Driving Licence #:</span>
                    <strong className="text-slate-800 dark:text-slate-200 font-mono">{currentInstructor.licence_number || 'MH12-20150049182'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Assigned Dual-Control Car:</span>
                    <strong className="text-blue-600 dark:text-blue-400">{assignedVehicle?.brand} {assignedVehicle?.model} ({assignedVehicle?.registration_number})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Teaching Experience:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{currentInstructor.experience_years} Years</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
