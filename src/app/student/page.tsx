'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  FileText, 
  Car, 
  User, 
  Calendar, 
  ShieldCheck, 
  Award, 
  ChevronRight, 
  Download, 
  AlertCircle,
  Phone,
  Sparkles,
  Printer,
  FileCheck2,
  Bell,
  HelpCircle,
  Check,
  Send,
  Menu,
  X,
  ChevronLeft
} from 'lucide-react';
import { ReceiptModal } from '@/components/ReceiptModal';
import { Payment } from '@/types';
import { mockStudentDocuments, mockSupportTickets } from '@/lib/mockData';

interface StudentPortalProps {
  initialModule?: string;
}

export default function StudentDashboardPage({ initialModule = 'dashboard' }: StudentPortalProps) {
  const { 
    school, 
    students, 
    enrollments, 
    attendanceRecords, 
    payments, 
    licenceRecords, 
    schedules, 
    instructors, 
    vehicles,
    currentUser,
    notifications,
    addToast
  } = useDrivingSchool();

  // Active student logged in: Rahul Sharma (DS-2026-00101)
  const currentStudent = students.find(s => s.user_id === currentUser.id) || students[0];
  const currentEnrollment = enrollments.find(e => e.student_id === currentStudent.id) || enrollments[0];
  const currentLicence = licenceRecords.find(l => l.student_id === currentStudent.id);
  const studentPayments = payments.filter(p => p.enrollment_id === currentEnrollment.id);
  const myAttendance = attendanceRecords.filter(a => a.enrollment_id === currentEnrollment.id);
  const mySchedules = schedules.filter(s => s.enrollment_id === currentEnrollment.id);

  const assignedInstructor = instructors.find(i => i.id === currentEnrollment.assigned_instructor_id) || instructors[0];
  const assignedVehicle = vehicles.find(v => v.id === currentEnrollment.assigned_vehicle_id) || vehicles[0];

  // Navigation state
  const [activeNav, setActiveNav] = useState(initialModule);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (initialModule) {
      setActiveNav(initialModule);
    }
  }, [initialModule]);

  // Financial calculations
  const totalPaid = studentPayments
    .filter(p => p.status === 'Confirmed')
    .reduce((sum, p) => sum + p.amount, 0);
  const outstandingBalance = Math.max(0, currentEnrollment.agreed_fee - totalPaid);

  // Progress percentage
  const progressPercent = Math.round((currentEnrollment.completed_sessions / currentEnrollment.total_sessions) * 100);

  // Active modal receipt
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);

  // Support ticket form state
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketsList, setTicketsList] = useState(mockSupportTickets);

  const navItems = [
    { id: 'dashboard', path: '/student/dashboard', label: 'Dashboard', icon: GraduationCap },
    { id: 'profile', path: '/student/profile', label: 'My Profile', icon: User },
    { id: 'course', path: '/student/course', label: 'My Course', icon: Car },
    { id: 'progress', path: '/student/progress', label: 'Driving Progress', icon: Award },
    { id: 'schedule', path: '/student/schedule', label: 'My Schedule', icon: Calendar },
    { id: 'attendance', path: '/student/attendance', label: 'Attendance History', icon: CheckCircle2 },
    { id: 'payments', path: '/student/payments', label: 'Fees & Payments', icon: IndianRupee },
    { id: 'licence', path: '/student/licence', label: 'Driving Licence', icon: FileCheck2 },
    { id: 'documents', path: '/student/documents', label: 'My Documents', icon: FileText },
    { id: 'notifications', path: '/student/notifications', label: 'Notifications', icon: Bell },
    { id: 'help', path: '/student/help', label: 'Help & Support', icon: HelpCircle }
  ];

  const handleNavClick = (id: string) => {
    setActiveNav(id);
    setIsMobileOpen(false);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;

    const newTicket = {
      id: `tkt-${Date.now()}`,
      school_id: school.id,
      student_id: currentStudent.id,
      student_name: currentStudent.full_name,
      student_code: currentStudent.student_code,
      category: 'scheduling' as const,
      subject: ticketSubject,
      message: ticketMessage,
      status: 'Open' as const,
      created_at: new Date().toISOString()
    };

    setTicketsList(prev => [newTicket, ...prev]);
    setTicketSubject('');
    setTicketMessage('');
    addToast('Support ticket sent to academy desk!', 'success');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0B1728] text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Top Banner Header */}
      <div className="bg-[#111E32] border-b border-[#1E293B] text-white py-3 px-4 sm:px-6 flex items-center justify-between sticky top-[53px] z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-tight">
                STUDENT SELF-SERVICE PORTAL
              </h1>
              <span className="px-2 py-0.2 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {currentStudent.student_code}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Welcome, {currentStudent.full_name} • {currentEnrollment.course_name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-slate-400">Assigned Instructor:</span>
            <span className="font-bold text-blue-400">{assignedInstructor.full_name}</span>
          </div>
          <a
            href={`tel:${assignedInstructor.phone}`}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" /> Call Instructor
          </a>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Fixed Desktop Sidebar */}
        <aside className={`hidden lg:block fixed left-0 top-[102px] bottom-0 z-20 bg-[#111E32] border-r border-[#1E293B] transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-64'
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
                    onClick={() => handleNavClick(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                        : 'text-slate-300 hover:bg-[#14243A] hover:text-white'
                    } ${isCollapsed ? 'justify-center px-2' : ''}`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-[#1E293B]">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition"
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                {!isCollapsed && <span className="ml-2 text-[11px]">Collapse Menu</span>}
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div 
              className="fixed inset-0 bg-black/70 backdrop-blur-sm" 
              onClick={() => setIsMobileOpen(false)} 
            />
            <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#111E32] p-4 shadow-2xl z-50 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1E293B]">
                <span className="font-bold text-white text-sm">Student Portal</span>
                <button onClick={() => setIsMobileOpen(false)} className="text-slate-400 hover:text-white">
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
                      onClick={() => handleNavClick(item.id)}
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
          isCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}>
          {/* ========================================================================= */}
          {/* 1. DASHBOARD OVERVIEW & 7 KPIS                                             */}
          {/* ========================================================================= */}
          {activeNav === 'dashboard' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              {/* Student Welcome Header Card */}
              <div className="bg-[#14243A] text-white border border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                      {currentStudent.full_name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-black text-white">{currentStudent.full_name}</h1>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {currentStudent.student_code}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300">
                        {currentEnrollment.course_name} • Enrolled on {currentStudent.admission_date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-3xl font-black text-blue-400">
                        {currentEnrollment.completed_sessions} <span className="text-base text-slate-400 font-normal">/ {currentEnrollment.total_sessions}</span>
                      </div>
                      <span className="text-xs text-slate-400">Classes Completed</span>
                    </div>

                    <div className="w-14 h-14 rounded-full border-4 border-blue-600 flex items-center justify-center font-bold text-xs text-white">
                      {progressPercent}%
                    </div>
                  </div>
                </div>

                {/* Overall Course Progress Bar */}
                <div className="mt-6 space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Overall Course Progress</span>
                    <span className="text-emerald-400 font-bold">
                      {currentEnrollment.total_sessions - currentEnrollment.completed_sessions} Sessions Remaining
                    </span>
                  </div>
                  <div className="w-full bg-[#0B1728] rounded-full h-3 overflow-hidden p-0.5 border border-[#1E293B]">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-700 shadow-md"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 7 Required Statistics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-2">
                  <span className="text-xs text-slate-500 font-semibold">Total Driving Classes</span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{currentEnrollment.total_sessions}</div>
                  <span className="text-[11px] text-slate-400">Curriculum Total</span>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-2">
                  <span className="text-xs text-slate-500 font-semibold">Completed Classes</span>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{currentEnrollment.completed_sessions}</div>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Verified by Instructor</span>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-2">
                  <span className="text-xs text-slate-500 font-semibold">Remaining Classes</span>
                  <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                    {currentEnrollment.total_sessions - currentEnrollment.completed_sessions}
                  </div>
                  <span className="text-[11px] text-slate-400">Pending Lessons</span>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-2">
                  <span className="text-xs text-slate-500 font-semibold">Total Agreed Fees</span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">₹{currentEnrollment.agreed_fee.toLocaleString('en-IN')}</div>
                  <span className="text-[11px] text-slate-400">All-Inclusive</span>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-2">
                  <span className="text-xs text-slate-500 font-semibold">Fees Paid</span>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">₹{totalPaid.toLocaleString('en-IN')}</div>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Confirmed Receipts</span>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-2">
                  <span className="text-xs text-slate-500 font-semibold">Pending Balance</span>
                  <div className="text-2xl font-black text-amber-500">₹{outstandingBalance.toLocaleString('en-IN')}</div>
                  <span className="text-[11px] text-slate-400">Due before DL test</span>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-2 col-span-2">
                  <span className="text-xs text-slate-500 font-semibold">Driving Licence Status</span>
                  <div className="text-base font-black text-purple-600 dark:text-purple-400">
                    {currentLicence?.ll_status || 'LL Approved • DL Test Scheduled'}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    RTO Track Date: {currentLicence?.test_date || '20 Nov 2026'}
                  </span>
                </div>
              </div>

              {/* Quick Jump Links */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveNav('progress')}
                  className="p-5 rounded-2xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] hover:border-blue-500 text-left transition space-y-1 shadow-sm"
                >
                  <Award className="w-5 h-5 text-blue-600 mb-1" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Curriculum Progress</h4>
                  <p className="text-xs text-slate-500">View category-wise progress (Reverse, Highway, Night Driving)</p>
                </button>

                <button
                  onClick={() => setActiveNav('payments')}
                  className="p-5 rounded-2xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] hover:border-blue-500 text-left transition space-y-1 shadow-sm"
                >
                  <IndianRupee className="w-5 h-5 text-emerald-600 mb-1" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Payment Receipts</h4>
                  <p className="text-xs text-slate-500">Download official serialized receipts for fee payments</p>
                </button>

                <button
                  onClick={() => setActiveNav('licence')}
                  className="p-5 rounded-2xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] hover:border-blue-500 text-left transition space-y-1 shadow-sm"
                >
                  <FileCheck2 className="w-5 h-5 text-purple-600 mb-1" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">RTO Test Timeline</h4>
                  <p className="text-xs text-slate-500">Track Learner Licence and Driving Licence test dates</p>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. STUDENT PROFILE                                                        */}
          {/* ========================================================================= */}
          {activeNav === 'profile' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-6 max-w-3xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Student Profile & RTO Registration</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Personal information on record with {school.name}</p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-4 pb-4 border-b border-[#E5EAF1] dark:border-[#1E293B]">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-bold text-2xl flex items-center justify-center">
                    {currentStudent.full_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">{currentStudent.full_name}</h3>
                    <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{currentStudent.student_code}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 block">Mobile Phone:</span>
                    <strong className="text-slate-900 dark:text-white font-mono">{currentStudent.phone}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Email Address:</span>
                    <strong className="text-slate-900 dark:text-white">{currentStudent.email || 'rahul.sharma@example.com'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Date of Birth:</span>
                    <strong className="text-slate-900 dark:text-white">{currentStudent.date_of_birth || '2004-05-15'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Admission Date:</span>
                    <strong className="text-slate-900 dark:text-white font-mono">{currentStudent.admission_date}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Enrolled Course:</span>
                    <strong className="text-slate-900 dark:text-white">{currentEnrollment.course_name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Assigned Instructor:</span>
                    <strong className="text-blue-600 dark:text-blue-400">{assignedInstructor.full_name} ({assignedInstructor.phone})</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Assigned Dual-Control Car:</span>
                    <strong className="text-slate-900 dark:text-white">{assignedVehicle.brand} {assignedVehicle.model} ({assignedVehicle.registration_number})</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Enrollment Status:</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                      {currentEnrollment.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. MY COURSE                                                              */}
          {/* ========================================================================= */}
          {activeNav === 'course' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-6 max-w-3xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Enrolled Course Curriculum</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Program structure and training modules</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{currentEnrollment.course_name}</h3>
                  <span className="text-base font-black text-blue-600 dark:text-blue-400 tabular-nums">
                    ₹{currentEnrollment.agreed_fee.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                  <div>Start Date: <strong className="text-slate-900 dark:text-white">{currentEnrollment.start_date}</strong></div>
                  <div>Total Practical Classes: <strong className="text-slate-900 dark:text-white">{currentEnrollment.total_sessions} Classes</strong></div>
                  <div>Assigned Trainer: <strong className="text-slate-900 dark:text-white">{assignedInstructor.full_name}</strong></div>
                  <div>Training Car: <strong className="text-slate-900 dark:text-white">{assignedVehicle.brand} {assignedVehicle.model}</strong></div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. DRIVING PROGRESS (CATEGORY BREAKDOWN)                                   */}
          {/* ========================================================================= */}
          {activeNav === 'progress' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-5 max-w-3xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Session-Wise Curriculum Mastery</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Calculated directly from verified instructor attendance records</p>
              </div>

              <div className="space-y-3">
                {currentEnrollment.session_allocations?.map(sa => {
                  const isDone = sa.completed_count >= sa.allocated_count;
                  const pct = Math.round((sa.completed_count / sa.allocated_count) * 100);

                  return (
                    <div
                      key={sa.id}
                      className="p-4 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">{sa.session_name_snapshot}</span>
                        <span className={`font-mono font-bold ${isDone ? 'text-emerald-600' : 'text-blue-600 dark:text-blue-400'}`}>
                          {sa.completed_count} / {sa.allocated_count} {isDone && '✓ Complete'}
                        </span>
                      </div>

                      <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${isDone ? 'bg-emerald-600' : 'bg-blue-600'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-[11px] text-slate-500">
                        <span>Allocated: {sa.allocated_count} classes</span>
                        <span>{sa.allocated_count - sa.completed_count} remaining</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. MY SCHEDULE                                                            */}
          {/* ========================================================================= */}
          {activeNav === 'schedule' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-5 max-w-3xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Upcoming Driving Slots</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Class timings scheduled with your instructor</p>
              </div>

              <div className="space-y-3">
                {mySchedules.map(sch => (
                  <div key={sch.id} className="p-4 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex items-center justify-between text-xs">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{sch.topic}</h4>
                      <p className="text-slate-500">Instructor: {sch.instructor_name} • Car: {sch.vehicle_name || 'Swift'}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold font-mono text-blue-600 dark:text-blue-400 block">
                        {new Date(sch.scheduled_start).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(sch.scheduled_start).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 6. ATTENDANCE HISTORY                                                     */}
          {/* ========================================================================= */}
          {activeNav === 'attendance' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-5 max-w-3xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Verified Attendance Logs</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Individual timestamps recorded by your instructor</p>
              </div>

              <div className="space-y-2">
                {myAttendance.map(att => (
                  <div key={att.id} className="p-3.5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{att.session_name}</span>
                      <span className="text-slate-500 text-[11px]">{att.remarks || 'Standard practical drive conducted'}</span>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 block">
                        {att.status}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400 block mt-0.5">
                        {new Date(att.marked_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 7. FEES & PAYMENTS                                                        */}
          {/* ========================================================================= */}
          {activeNav === 'payments' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-6 max-w-3xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Fee Balance & Official Receipts</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Only confirmed payments count towards your settled balance</p>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-xs">
                <div>
                  <span className="text-slate-500 block">Total Agreed Fee:</span>
                  <strong className="text-sm font-bold text-slate-900 dark:text-white">₹{currentEnrollment.agreed_fee.toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Confirmed Paid:</span>
                  <strong className="text-sm font-bold text-emerald-600">₹{totalPaid.toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Balance Pending:</span>
                  <strong className="text-sm font-bold text-amber-500">₹{outstandingBalance.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block uppercase tracking-wider text-[11px]">
                  Receipts Ledger:
                </span>
                {studentPayments.map(p => (
                  <div key={p.id} className="p-4 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 dark:text-white">
                          {p.receipt_number || 'PENDING CONFIRMATION'}
                        </span>
                        <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                          {p.status}
                        </span>
                      </div>
                      <span className="text-slate-500 mt-0.5 block">{p.payment_method} • {new Date(p.received_at).toLocaleDateString('en-IN')}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-emerald-600">₹{p.amount.toLocaleString('en-IN')}</span>
                      {p.status === 'Confirmed' && (
                        <button
                          onClick={() => setSelectedReceipt(p)}
                          className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium text-[11px] flex items-center gap-1"
                        >
                          <Printer className="w-3 h-3" /> Receipt
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 8. DRIVING LICENCE (SARATHI RTO TRACKING)                                  */}
          {/* ========================================================================= */}
          {activeNav === 'licence' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-6 max-w-3xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">RTO Driving Licence Status</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Official tracking from Learner&apos;s Licence to Final DL clearance</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{currentLicence?.licence_type || 'MCWG + LMV'}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    {currentLicence?.ll_status || 'LL Approved'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                  <div>RTO Office: <strong className="text-slate-900 dark:text-white">{currentLicence?.rto_name || 'Pune RTO (MH-12)'}</strong></div>
                  <div>LL Reference: <strong className="font-mono text-slate-900 dark:text-white">{currentLicence?.ll_reference || 'MH12LL099182'}</strong></div>
                  <div>DL Practical Test Slot: <strong className="text-purple-600 dark:text-purple-400 font-bold">{currentLicence?.test_date || '20 Nov 2026 (Alandi Track)'}</strong></div>
                  <div>Final Licence Number: <strong className="font-mono text-emerald-600 font-bold">{currentLicence?.licence_number || 'Pending practical exam'}</strong></div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 9. MY DOCUMENTS                                                           */}
          {/* ========================================================================= */}
          {activeNav === 'documents' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-5 max-w-3xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Uploaded KYC & RTO Documents</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Form 1A medical certificate, Aadhaar, and LL document copies</p>
              </div>

              <div className="space-y-3">
                {mockStudentDocuments.slice(0, 4).map(doc => (
                  <div key={doc.id} className="p-4 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">{doc.document_name}</span>
                      <span className="text-[11px] text-slate-500">{doc.document_type} • {doc.file_size}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600">
                      {doc.verification_status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 10. NOTIFICATIONS                                                         */}
          {/* ========================================================================= */}
          {activeNav === 'notifications' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4 max-w-3xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Student Notifications</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Class schedules, attendance confirmations, and RTO test alerts</p>
              </div>

              <div className="space-y-2">
                {notifications.map(n => (
                  <div key={n.id} className="p-3.5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{n.title}</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {new Date(n.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 11. HELP & SUPPORT                                                        */}
          {/* ========================================================================= */}
          {activeNav === 'help' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-6 max-w-3xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Help & Academy Support</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Need to reschedule a slot or ask a question about your DL test?</p>
              </div>

              <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Subject</label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="e.g. Reschedule tomorrow's reverse parking slot"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Message</label>
                  <textarea
                    rows={3}
                    required
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    placeholder="Provide details for the coordinator..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Request to Desk
                </button>
              </form>

              {/* Past tickets */}
              <div className="space-y-2 pt-4 border-t border-[#E5EAF1] dark:border-[#1E293B]">
                <span className="font-bold text-xs text-slate-700 dark:text-slate-300 block">Previous Inquiries:</span>
                {ticketsList.map(tkt => (
                  <div key={tkt.id} className="p-3.5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{tkt.subject}</span>
                      <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600">
                        {tkt.status}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400">{tkt.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Official Receipt Modal */}
      <ReceiptModal 
        payment={selectedReceipt} 
        school={school} 
        onClose={() => setSelectedReceipt(null)} 
      />
    </div>
  );
}
