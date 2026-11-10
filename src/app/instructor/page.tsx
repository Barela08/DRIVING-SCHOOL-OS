'use client';

import React, { useState, useEffect } from 'react';
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
  HelpCircle, 
  Menu, 
  X, 
  Car, 
  ChevronRight, 
  AlertCircle, 
  Clock, 
  Sparkles, 
  Sun, 
  Moon, 
  Wrench,
  Check,
  Send,
  LogOut,
  Settings
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student, Enrollment, EnrollmentSessionAllocation, AttendanceRecord } from '@/types';

export default function InstructorPortalPage() {
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
    theme,
    toggleTheme,
    currentUser 
  } = useDrivingSchool();

  // Active instructor: Vikram Shinde (INS-2026-01)
  const currentInstructor = instructors[0];
  const assignedVehicle = vehicles.find(v => v.id === currentInstructor.assigned_vehicle_id);

  // Navigation state
  const [activeNav, setActiveNav] = useState<
    'dashboard' | 'find-student' | 'my-students' | 'todays-classes' | 'mark-attendance' | 'attendance-history' | 'schedule' | 'performance' | 'notifications' | 'profile' | 'help'
  >('dashboard');

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Search Student state (Most important feature)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedStudent, setSearchedStudent] = useState<Student | null>(null);
  const [searchedEnrollment, setSearchedEnrollment] = useState<Enrollment | null>(null);
  const [searchError, setSearchError] = useState('');

  // Attendance marking state
  const [selectedAllocation, setSelectedAllocation] = useState<EnrollmentSessionAllocation | null>(null);
  const [instructorRemarks, setInstructorRemarks] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState<{
    studentName: string;
    sessionName: string;
    date: string;
    time: string;
    completed: number;
    total: number;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Class filters
  const [classFilter, setClassFilter] = useState<'all' | 'Scheduled' | 'Completed' | 'Cancelled'>('all');
  const [historyFilter, setHistoryFilter] = useState<'today' | 'yesterday' | 'week' | 'month'>('today');

  // Filter ONLY students assigned to this instructor (Section 19: Security and RBAC)
  const myEnrollments = enrollments.filter(e => 
    e.assigned_instructor_id === currentInstructor.id || 
    e.assigned_instructor_name?.includes(currentInstructor.full_name)
  );

  const myStudents = students.filter(s => 
    myEnrollments.some(e => e.student_id === s.id)
  );

  // Instructor attendance records
  const myAttendanceRecords = attendanceRecords.filter(a => 
    a.instructor_id === currentInstructor.id || 
    a.instructor_name?.includes(currentInstructor.full_name)
  );

  // Instructor schedules
  const mySchedules = schedules.filter(s => 
    s.instructor_id === currentInstructor.id || 
    s.instructor_name?.includes(currentInstructor.full_name)
  );

  // Today Date in state
  const [todayDateStr, setTodayDateStr] = useState('2026-11-10');
  useEffect(() => {
    setTodayDateStr(new Date().toISOString().split('T')[0]);
  }, []);

  // KPI calculations
  const totalAssignedStudents = myStudents.length;
  const activeAssignedStudents = myStudents.filter(s => s.status === 'Active').length;
  const todayClassesTotal = mySchedules.length;
  const todayClassesCompleted = myAttendanceRecords.filter(a => a.attendance_date === todayDateStr).length;
  const todayClassesRemaining = Math.max(0, todayClassesTotal - todayClassesCompleted);
  const lifetimeCompletedSessions = myAttendanceRecords.length;
  const totalRemainingSessionsAcrossAllocations = myEnrollments.reduce((sum, e) => sum + (e.total_sessions - e.completed_sessions), 0);
  const nextUpcomingClass = mySchedules.find(s => s.status === 'Scheduled');

  // Handle Find Student (Section 7)
  const handleFindStudent = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchError('');
    setSearchedStudent(null);
    setSearchedEnrollment(null);
    setSuccessResult(null);

    const query = searchQuery.trim().toUpperCase();
    if (!query) {
      setSearchError('Please enter a Student ID (e.g. DS-2026-00101).');
      return;
    }

    // Security check: Must belong to this instructor!
    const foundEnrollment = myEnrollments.find(e => 
      e.student_code.toUpperCase() === query || 
      e.student_name.toUpperCase().includes(query)
    );

    if (!foundEnrollment) {
      // Must not leak existence of unrelated student IDs (Section 7)
      setSearchError('Student not found or you are not authorized to access this student.');
      return;
    }

    const foundStudent = myStudents.find(s => s.id === foundEnrollment.student_id);
    setSearchedStudent(foundStudent || null);
    setSearchedEnrollment(foundEnrollment);

    // Auto-select first incomplete session allocation
    const nextIncomplete = foundEnrollment.session_allocations?.find(sa => sa.completed_count < sa.allocated_count);
    setSelectedAllocation(nextIncomplete || foundEnrollment.session_allocations?.[0] || null);
  };

  // One-Click Attendance Submission (Section 9)
  const handleConfirmAttendance = async () => {
    if (!searchedEnrollment || !selectedAllocation) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await markAttendance({
        enrollmentId: searchedEnrollment.id,
        sessionAllocationId: selectedAllocation.id,
        instructorId: currentInstructor.id,
        vehicleId: assignedVehicle?.id,
        remarks: instructorRemarks.trim() || undefined
      });

      if (res.success && res.attendance) {
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.65 }
        });

        const now = new Date();
        setSuccessResult({
          studentName: searchedEnrollment.student_name,
          sessionName: selectedAllocation.session_name_snapshot,
          date: now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          completed: selectedAllocation.completed_count + 1,
          total: selectedAllocation.allocated_count
        });

        // Update local enrollment view
        const updatedEnrollment = enrollments.find(e => e.id === searchedEnrollment.id);
        if (updatedEnrollment) {
          setSearchedEnrollment(updatedEnrollment);
          const updatedAlloc = updatedEnrollment.session_allocations?.find(sa => sa.id === selectedAllocation.id);
          if (updatedAlloc) setSelectedAllocation(updatedAlloc);
        }

        setShowConfirmModal(false);
        setInstructorRemarks('');
      } else {
        setErrorMessage(res.message);
        setShowConfirmModal(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit attendance');
      setShowConfirmModal(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Nav items matching EXACT color & style of Owner Dashboard
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'find-student', label: 'Find Student', icon: Search },
    { id: 'my-students', label: 'My Students', icon: Users },
    { id: 'todays-classes', label: 'Today\'s Classes', icon: Calendar },
    { id: 'mark-attendance', label: 'Mark Attendance', icon: CheckCircle2 },
    { id: 'attendance-history', label: 'Attendance History', icon: History },
    { id: 'schedule', label: 'My Schedule', icon: Clock },
    { id: 'performance', label: 'My Performance', icon: Award },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'help', label: 'Help & Support', icon: HelpCircle }
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0B1728] text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      {/* ========================================================================= */}
      {/* TOP NAVIGATION BAR                                                        */}
      {/* ========================================================================= */}
      <header className="sticky top-[49px] z-20 bg-white dark:bg-[#0B1728] border-b border-[#E5EAF1] dark:border-[#1E293B] px-4 py-2.5 transition-colors">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <nav className="flex items-center text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="hover:text-blue-600 cursor-pointer">Instructor</span>
              <span className="mx-2 text-slate-400">/</span>
              <span className="font-semibold text-slate-900 dark:text-white capitalize">
                {activeNav.replace('-', ' ')}
              </span>
            </nav>
          </div>

          {/* Quick Find Student Shortcut */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFindStudent()}
                placeholder="Student ID (e.g. DS-2026-00101)..."
                className="bg-[#F5F7FB] dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 w-60 focus:outline-none focus:border-blue-600 font-mono"
              />
            </div>
            <button
              onClick={() => {
                setActiveNav('find-student');
                handleFindStudent();
              }}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
            >
              Find
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-[#E5EAF1] dark:border-[#1E293B]"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Profile Avatar Badge */}
            <div className="flex items-center gap-2 bg-[#F5F7FB] dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] px-3 py-1.5 rounded-xl text-xs">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
                VS
              </div>
              <div className="hidden md:block">
                <span className="font-bold text-slate-900 dark:text-white block leading-tight">{currentInstructor.full_name}</span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">{currentInstructor.instructor_code}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* ========================================================================= */}
        {/* INSTRUCTOR SIDEBAR (EXACT MATCHING DESIGN SYSTEM: #111E32)                */}
        {/* ========================================================================= */}
        <aside className={`hidden lg:block fixed left-0 top-[88px] bottom-0 z-30 transition-all duration-300 ${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        }`}>
          <div className="flex flex-col h-full bg-[#111E32] text-slate-200 border-r border-[#1E293B]">
            {/* Header */}
            <div className="p-4 border-b border-[#1E293B] flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
                  <Car className="w-5 h-5" />
                </div>
                {!isSidebarCollapsed && (
                  <div className="min-w-0">
                    <h2 className="text-sm font-bold text-white truncate">{school.name}</h2>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mt-0.5">
                      INSTRUCTOR PANEL
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Nav Items */}
            <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveNav(item.id as any)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                        : 'text-slate-300 hover:bg-[#14243A] hover:text-white'
                    } ${isSidebarCollapsed ? 'justify-center px-2' : ''}`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {!isSidebarCollapsed && <span>{item.label}</span>}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-[#1E293B]">
              <div className="p-2.5 rounded-xl bg-[#0B1728] border border-[#1E293B] text-xs">
                <span className="text-[10px] text-slate-400 block">Assigned Car:</span>
                <span className="font-bold text-white block truncate">{assignedVehicle?.brand} {assignedVehicle?.model}</span>
                <span className="font-mono text-[10px] text-blue-400">{assignedVehicle?.registration_number}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {isMobileDrawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsMobileDrawerOpen(false)} />
            <div className="fixed inset-y-0 left-0 w-72 bg-[#111E32] text-slate-200 z-50 p-4 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-bold text-white text-sm">INSTRUCTOR PANEL</span>
                <button onClick={() => setIsMobileDrawerOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-1">
                {navItems.map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveNav(item.id as any);
                        setIsMobileDrawerOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium ${
                        activeNav === item.id ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MAIN WORKSPACE                                                            */}
        {/* ========================================================================= */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${
          isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}>
          {/* ========================================================================= */}
          {/* 1. MAIN INSTRUCTOR DASHBOARD (Section 6)                                  */}
          {/* ========================================================================= */}
          {activeNav === 'dashboard' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Instructor Dashboard</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Welcome back, {currentInstructor.full_name}! Here is your driving activity overview.
                </p>
              </div>

              {/* SECTION 6: 6 KPI CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Card 1: Assigned Students */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span className="font-semibold">Assigned Students</span>
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{totalAssignedStudents}</div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    <strong className="text-emerald-600 dark:text-emerald-400">{activeAssignedStudents} Active Learners</strong> under training
                  </p>
                </div>

                {/* Card 2: Today's Classes */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span className="font-semibold">Today's Classes</span>
                    <Calendar className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{todayClassesTotal}</div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="text-emerald-600 font-bold">{todayClassesCompleted} Completed</span> • {todayClassesRemaining} Remaining
                  </p>
                </div>

                {/* Card 3: Total Completed Sessions */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span className="font-semibold">Total Completed Sessions</span>
                    <Award className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{lifetimeCompletedSessions}</div>
                  <p className="text-[11px] text-slate-500">Verified and logged in database</p>
                </div>

                {/* Card 4: Attendance Rate */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span className="font-semibold">Attendance Rate</span>
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="text-2xl font-black text-teal-600">100%</div>
                  <p className="text-[11px] text-slate-500">{todayClassesCompleted} marked today on server</p>
                </div>

                {/* Card 5: Pending Sessions */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span className="font-semibold">Pending Quota</span>
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-2xl font-black text-amber-500">{totalRemainingSessionsAcrossAllocations}</div>
                  <p className="text-[11px] text-slate-500">Remaining driving classes to deliver</p>
                </div>

                {/* Card 6: Upcoming Class */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span className="font-semibold">Next Scheduled Class</span>
                    <Car className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {nextUpcomingClass ? nextUpcomingClass.student_name : 'No more classes today'}
                  </div>
                  <p className="text-[11px] text-blue-600 dark:text-blue-400 font-mono">
                    {nextUpcomingClass ? nextUpcomingClass.topic : 'Rest period'}
                  </p>
                </div>
              </div>

              {/* QUICK ACCESS: JUMP TO FIND STUDENT OR MARK ATTENDANCE */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold">Fast Attendance Workflow</h3>
                  <p className="text-xs text-blue-200 mt-0.5">
                    Search your assigned student's ID and mark attendance with one click.
                  </p>
                </div>
                <button
                  onClick={() => setActiveNav('find-student')}
                  className="px-5 py-2.5 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs transition shadow-md self-start sm:self-auto"
                >
                  Open Student Search
                </button>
              </div>

              {/* Today's Scheduled Classes List */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Today's Class Schedule</h3>
                <div className="divide-y divide-[#E5EAF1] dark:divide-[#1E293B]">
                  {mySchedules.map(sch => (
                    <div key={sch.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">{sch.student_name}</span>
                          <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{sch.student_code}</span>
                        </div>
                        <span className="text-slate-500 block mt-0.5">{sch.topic}</span>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600">
                          {sch.status}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                          {new Date(sch.scheduled_start).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. FIND STUDENT & ONE-CLICK ATTENDANCE (Section 7, 8, 9 - CORE FEATURE)    */}
          {/* ========================================================================= */}
          {(activeNav === 'find-student' || activeNav === 'mark-attendance') && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Heading & Search Bar */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">Find Student</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Enter a Student ID to access the student's assigned driving information and mark attendance.
                  </p>
                </div>

                <form onSubmit={handleFindStudent} className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter Student ID (e.g. DS-2026-00101)"
                      className="w-full bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600 font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition flex items-center justify-center gap-2"
                  >
                    <Search className="w-4 h-4" /> Find Student
                  </button>
                </form>

                {/* Error message (Section 7 security requirement: never leaks existence of unrelated student IDs) */}
                {searchError && (
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{searchError}</span>
                  </div>
                )}
              </div>

              {/* Success Result Banner (Section 9) */}
              {successResult && (
                <div className="p-6 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 space-y-2 shadow-lg animate-in fade-in">
                  <div className="flex items-center gap-2 text-base font-bold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Attendance marked successfully!
                  </div>
                  <div className="text-xs space-y-0.5 pt-1 text-slate-700 dark:text-slate-300">
                    <p>Student: <strong>{successResult.studentName}</strong></p>
                    <p>Session Topic: <strong>{successResult.sessionName}</strong></p>
                    <p>Recorded Date & Time: <strong>{successResult.date} at {successResult.time}</strong></p>
                    <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                      Updated Quota: {successResult.completed} of {successResult.total} Completed ({successResult.total - successResult.completed} Remaining)
                    </p>
                  </div>
                </div>
              )}

              {/* SECTION 7.1 & 8: STUDENT SEARCH RESULT CARD & SESSION BREAKDOWN */}
              {searchedEnrollment && (
                <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-6">
                  {/* Student Header Card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#E5EAF1] dark:border-[#1E293B] gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-600 dark:text-blue-400 font-bold text-xl flex items-center justify-center border border-blue-500/30">
                        {searchedEnrollment.student_name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{searchedEnrollment.student_name}</h3>
                          <span className="px-2 py-0.5 rounded-full font-mono text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            {searchedEnrollment.student_code}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {searchedEnrollment.course_name}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                        {searchedEnrollment.completed_sessions} <span className="text-xs font-normal text-slate-400">/ {searchedEnrollment.total_sessions}</span>
                      </span>
                      <span className="text-[11px] text-slate-500 block">Total Driving Sessions Completed</span>
                    </div>
                  </div>

                  {/* SECTION 8: Available Session Categories */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                      Select Session Category
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {searchedEnrollment.session_allocations?.map(sa => {
                        const isSelected = selectedAllocation?.id === sa.id;
                        const isExhausted = sa.completed_count >= sa.allocated_count;
                        const remaining = sa.allocated_count - sa.completed_count;
                        const pct = Math.round((sa.completed_count / sa.allocated_count) * 100);

                        return (
                          <button
                            key={sa.id}
                            disabled={isExhausted}
                            onClick={() => setSelectedAllocation(sa)}
                            className={`p-3.5 rounded-2xl border text-left text-xs transition flex flex-col justify-between gap-2 ${
                              isExhausted
                                ? 'opacity-40 bg-slate-100 dark:bg-slate-900 border-transparent cursor-not-allowed'
                                : isSelected
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md font-semibold'
                                : 'bg-[#F5F7FB] dark:bg-[#0B1728] border-[#E5EAF1] dark:border-[#1E293B] text-slate-800 dark:text-slate-200 hover:border-blue-400'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold truncate max-w-[190px]">{sa.session_name_snapshot}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                isExhausted 
                                  ? 'bg-slate-300 text-slate-700' 
                                  : isSelected 
                                  ? 'bg-white text-blue-900' 
                                  : 'bg-blue-100 dark:bg-slate-800 text-blue-600'
                              }`}>
                                {isExhausted ? 'Completed' : `${remaining} left`}
                              </span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${isSelected ? 'bg-white' : 'bg-blue-600'}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>

                            <div className="flex items-center justify-between text-[11px] opacity-80">
                              <span>Completed: {sa.completed_count} of {sa.allocated_count}</span>
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Instructor Remarks */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Driving Performance Remarks (Optional)
                    </label>
                    <input
                      type="text"
                      value={instructorRemarks}
                      onChange={(e) => setInstructorRemarks(e.target.value)}
                      placeholder="e.g. Smooth clutch control, needs practice on parallel box entry..."
                      className="w-full bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  {/* SECTION 9: PRIMARY BLUE 'MARK ATTENDANCE' BUTTON */}
                  <div className="pt-2">
                    <button
                      onClick={() => setShowConfirmModal(true)}
                      disabled={!selectedAllocation || (selectedAllocation.completed_count >= selectedAllocation.allocated_count)}
                      className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wide transition shadow-lg flex items-center justify-center gap-2 ${
                        !selectedAllocation || (selectedAllocation.completed_count >= selectedAllocation.allocated_count)
                          ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-[#2563EB] hover:bg-blue-500 text-white shadow-blue-600/30 active:scale-[0.99]'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
                      <span>MARK ATTENDANCE</span>
                    </button>
                    <p className="text-[11px] text-slate-400 text-center mt-2">
                      🔒 Enforces allocation limits, server-authoritative timestamp, and anti-duplicate protection.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. MY STUDENTS LIST (Section 11)                                          */}
          {/* ========================================================================= */}
          {activeNav === 'my-students' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4 max-w-6xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">My Assigned Students ({myStudents.length})</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Strictly displays students allocated to your training roster</p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-[#E5EAF1] dark:border-[#1E293B]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F5F7FB] dark:bg-[#0B1728] text-slate-500 uppercase font-semibold">
                    <tr>
                      <th className="px-4 py-3">Code</th>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Course</th>
                      <th className="px-4 py-3">Completed Sessions</th>
                      <th className="px-4 py-3">Progress</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5EAF1] dark:divide-[#1E293B]">
                    {myStudents.map(s => {
                      const enr = myEnrollments.find(e => e.student_id === s.id);
                      const pct = enr ? Math.round((enr.completed_sessions / enr.total_sessions) * 100) : 0;
                      return (
                        <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                          <td className="px-4 py-3 font-mono font-bold text-blue-600">{s.student_code}</td>
                          <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{s.full_name}</td>
                          <td className="px-4 py-3">{s.enrolled_course_name}</td>
                          <td className="px-4 py-3 font-mono font-bold text-emerald-600">
                            {enr?.completed_sessions} / {enr?.total_sessions}
                          </td>
                          <td className="px-4 py-3">
                            <div className="w-24 bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div className="bg-blue-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => {
                                setSearchQuery(s.student_code);
                                setActiveNav('find-student');
                                setSearchedStudent(s);
                                setSearchedEnrollment(enr || null);
                                setSelectedAllocation(enr?.session_allocations?.[0] || null);
                              }}
                              className="px-3 py-1 rounded-xl bg-blue-600/10 text-blue-600 font-bold hover:bg-blue-600 hover:text-white transition"
                            >
                              Mark Attendance
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
          {/* 4. ATTENDANCE HISTORY (Section 12)                                        */}
          {/* ========================================================================= */}
          {activeNav === 'attendance-history' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4 max-w-6xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Attendance History</h2>
                  <p className="text-xs text-slate-500">Read-only historical verification log</p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1.5 rounded-xl">
                  {myAttendanceRecords.length} Sessions Logged
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {myAttendanceRecords.map(att => (
                  <div key={att.id} className="p-3.5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{att.student_name}</span>
                        <span className="font-mono text-blue-600">{att.student_code}</span>
                      </div>
                      <span className="text-slate-500 block mt-0.5">{att.session_name}</span>
                      {att.remarks && <span className="text-slate-400 italic block mt-0.5">"{att.remarks}"</span>}
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-500/10 text-emerald-600">
                        {att.status}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-mono mt-1">
                        {new Date(att.marked_at).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. PROFILE & VEHICLE INFO (Section 16)                                    */}
          {/* ========================================================================= */}
          {activeNav === 'profile' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-5 max-w-xl mx-auto text-xs">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Instructor Profile</h2>
              <div className="space-y-3">
                <p>Name: <strong>{currentInstructor.full_name}</strong></p>
                <p>Instructor Code: <strong className="font-mono text-blue-600">{currentInstructor.instructor_code}</strong></p>
                <p>Phone: <strong>{currentInstructor.phone}</strong></p>
                <p>Email: <strong>{currentInstructor.email}</strong></p>
                <p>Driving Licence No: <strong>{currentInstructor.licence_number}</strong></p>
                <p>Experience: <strong>{currentInstructor.experience_years} Years</strong></p>
                <p>Assigned Car: <strong>{assignedVehicle?.brand} {assignedVehicle?.model} ({assignedVehicle?.registration_number})</strong></p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* CONFIRMATION MODAL FOR ATTENDANCE (Section 9.6) */}
      {showConfirmModal && selectedAllocation && searchedEnrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#111E32] text-slate-900 dark:text-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#E5EAF1] dark:border-[#1E293B] space-y-4">
            <h3 className="font-bold text-base">Confirm Attendance Submission</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Are you sure you want to mark attendance for <strong>{searchedEnrollment.student_name}</strong> ({searchedEnrollment.student_code}) for the topic:
            </p>
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-[#0B1728] border border-blue-200 dark:border-blue-900/40 text-xs font-semibold text-blue-700 dark:text-blue-300">
              {selectedAllocation.session_name_snapshot}
            </div>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAttendance}
                disabled={isSubmitting}
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20"
              >
                {isSubmitting ? 'Recording...' : 'Confirm & Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
