'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { 
  Users, 
  UserPlus, 
  IndianRupee, 
  Calendar, 
  FileCheck2, 
  Search, 
  CheckCircle2, 
  Clock, 
  Car, 
  Plus, 
  Printer, 
  ChevronRight,
  Filter,
  AlertCircle,
  LayoutDashboard,
  BookOpen,
  Award,
  Bell,
  User,
  ShieldAlert,
  Download,
  Lock,
  X,
  Menu,
  ChevronLeft
} from 'lucide-react';
import { ReceiptModal } from '@/components/ReceiptModal';
import { StudentDetailModal } from '@/components/owner/StudentDetailModal';
import { QuickAddModals } from '@/components/owner/QuickAddModals';
import { Payment, Student, LicenceStatus } from '@/types';

interface StaffDashboardProps {
  initialModule?: string;
}

export default function StaffDashboardPage({ initialModule = 'dashboard' }: StaffDashboardProps) {
  const { 
    school, 
    currentUser,
    staffMembers,
    students, 
    courses, 
    instructors, 
    vehicles, 
    enrollments, 
    payments, 
    licenceRecords, 
    schedules,
    attendanceRecords,
    notifications,
    auditLogs,
    addStudent, 
    addPayment, 
    confirmPayment, 
    updateLicenceStatus, 
    addSchedule,
    addToast
  } = useDrivingSchool();

  const [activeModule, setActiveModule] = useState(initialModule);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    if (initialModule) {
      setActiveModule(initialModule);
    }
  }, [initialModule]);

  // Current Staff Profile
  const currentStaff = staffMembers.find(s => s.user_id === currentUser.id) || staffMembers[0];
  const permissions = currentStaff?.permissions || {
    can_admit_students: true,
    can_manage_fees: true,
    can_confirm_payments: false,
    can_assign_instructors: true,
    can_manage_licences: true,
    can_manage_vehicles: false,
    can_view_reports: false
  };

  // Modals
  const [quickAddType, setQuickAddType] = useState<'student' | 'payment' | 'schedule' | null>(null);
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<Student | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Navigation Items matching Section 5.B
  const navItems = [
    { id: 'dashboard', path: '/staff/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admissions', path: '/staff/admissions', label: 'Admissions Desk', icon: UserPlus },
    { id: 'students', path: '/staff/students', label: 'Students', icon: Users },
    { id: 'instructors', path: '/staff/instructors', label: 'Instructors', icon: Award },
    { id: 'courses', path: '/staff/courses', label: 'Courses & Sessions', icon: BookOpen },
    { id: 'attendance', path: '/staff/attendance', label: 'Attendance', icon: CheckCircle2 },
    { id: 'schedules', path: '/staff/schedules', label: 'Class Schedule', icon: Calendar },
    { id: 'payments', path: '/staff/payments', label: 'Fees & Payments', icon: IndianRupee },
    { id: 'licences', path: '/staff/licences', label: 'Driving Licence', icon: FileCheck2 },
    { id: 'vehicles', path: '/staff/vehicles', label: 'Vehicles', icon: Car },
    { id: 'notifications', path: '/staff/notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', path: '/staff/profile', label: 'My Profile', icon: User }
  ];

  const handleNavClick = (id: string) => {
    setActiveModule(id);
    setIsMobileOpen(false);
  };

  const confirmedPayments = payments.filter(p => p.status === 'Confirmed');
  const pendingPayments = payments.filter(p => p.status === 'Pending');

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
                STAFF COUNTER DESK • {school.name}
              </h1>
              <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {currentStaff?.role_title || 'Desk Executive'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Logged in as {currentUser.full_name} ({currentStaff?.employee_code})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {permissions.can_admit_students && (
            <button
              onClick={() => setQuickAddType('student')}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> New Admission
            </button>
          )}
          {permissions.can_manage_fees && (
            <button
              onClick={() => setQuickAddType('payment')}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <IndianRupee className="w-3.5 h-3.5" /> Record Fee
            </button>
          )}
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
                const isCurrentActive = activeModule === item.id || 
                  (item.id === 'admissions' && activeModule === 'admissions') ||
                  (item.id === 'schedules' && activeModule === 'schedule') ||
                  (item.id === 'payments' && activeModule === 'finances');

                return (
                  <Link
                    key={item.id}
                    href={item.path}
                    onClick={() => handleNavClick(item.id)}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                      isCurrentActive
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
                <span className="font-bold text-white text-sm">Staff Menu</span>
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
                        activeModule === item.id ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:bg-[#14243A]'
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

        {/* Content Canvas */}
        <main className={`flex-1 transition-all duration-300 p-4 sm:p-6 lg:p-8 ${
          isCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}>
          {/* ========================================================================= */}
          {/* 1. STAFF DASHBOARD OVERVIEW                                               */}
          {/* ========================================================================= */}
          {activeModule === 'dashboard' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Staff Counter Overview</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Daily admissions desk, fee entries, and RTO appointment updates</p>
              </div>

              {/* Counter Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-2">
                  <span className="text-xs text-slate-500 font-semibold">Total Students</span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{students.length}</div>
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">Active Driving Enrollees</span>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-2">
                  <span className="text-xs text-slate-500 font-semibold">Today's Scheduled Classes</span>
                  <div className="text-2xl font-black text-slate-900 dark:text-white">{schedules.length}</div>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">All Slots Confirmed</span>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-2">
                  <span className="text-xs text-slate-500 font-semibold">Pending Payments</span>
                  <div className="text-2xl font-black text-amber-500">{pendingPayments.length} Entries</div>
                  <span className="text-[11px] text-slate-400">Awaiting Owner Confirmation</span>
                </div>

                <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-2">
                  <span className="text-xs text-slate-500 font-semibold">RTO Track Appointments</span>
                  <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
                    {licenceRecords.filter(l => l.test_date).length} Tests
                  </div>
                  <span className="text-[11px] text-slate-400">Pune RTO Alandi Track</span>
                </div>
              </div>

              {/* Quick Staff Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveModule('admissions')}
                  className="p-5 rounded-2xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] hover:border-blue-500 text-left transition space-y-1 shadow-sm"
                >
                  <UserPlus className="w-6 h-6 text-blue-600 mb-2" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Admit New Learner</h4>
                  <p className="text-xs text-slate-500">Auto-generate student code, assign course and dual-control car</p>
                </button>

                <button
                  onClick={() => setActiveModule('payments')}
                  className="p-5 rounded-2xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] hover:border-blue-500 text-left transition space-y-1 shadow-sm"
                >
                  <IndianRupee className="w-6 h-6 text-emerald-600 mb-2" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Record Fee Payment</h4>
                  <p className="text-xs text-slate-500">Record cash/UPI installments and print serialized fee receipts</p>
                </button>

                <button
                  onClick={() => setActiveModule('licences')}
                  className="p-5 rounded-2xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] hover:border-blue-500 text-left transition space-y-1 shadow-sm"
                >
                  <FileCheck2 className="w-6 h-6 text-purple-600 mb-2" />
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Update RTO Test Dates</h4>
                  <p className="text-xs text-slate-500">Log Sarathi LL approvals and practical DL test appointments</p>
                </button>
              </div>

              {/* Recent Admissions */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" /> Recent Student Admissions Desk
                </h3>
                <div className="overflow-x-auto rounded-2xl border border-[#E5EAF1] dark:border-[#1E293B]">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#F5F7FB] dark:bg-[#0B1728] text-slate-500 uppercase font-semibold">
                      <tr>
                        <th className="px-4 py-3">Code</th>
                        <th className="px-4 py-3">Student Name</th>
                        <th className="px-4 py-3">Course</th>
                        <th className="px-4 py-3">Assigned Driver</th>
                        <th className="px-4 py-3">Admission Date</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5EAF1] dark:divide-[#1E293B]">
                      {students.slice(0, 5).map(s => (
                        <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                          <td className="px-4 py-3 font-mono font-bold text-blue-600 dark:text-blue-400">{s.student_code}</td>
                          <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{s.full_name}</td>
                          <td className="px-4 py-3">{s.enrolled_course_name}</td>
                          <td className="px-4 py-3">{s.assigned_instructor_name || 'Vikram Shinde'}</td>
                          <td className="px-4 py-3 font-mono text-slate-400">{s.admission_date}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => setSelectedStudentForDetail(s)}
                              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. ADMISSIONS DESK                                                        */}
          {/* ========================================================================= */}
          {activeModule === 'admissions' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Admissions Desk</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Enroll new learners and allocate driving course modules</p>
                </div>
                {permissions.can_admit_students && (
                  <button
                    onClick={() => setQuickAddType('student')}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Open Student Admission Form
                  </button>
                )}
              </div>

              <div className="overflow-x-auto rounded-2xl border border-[#E5EAF1] dark:border-[#1E293B]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F5F7FB] dark:bg-[#0B1728] text-slate-500 uppercase font-semibold">
                    <tr>
                      <th className="px-4 py-3">ID Code</th>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Course</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Admission Date</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5EAF1] dark:divide-[#1E293B]">
                    {students.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                        <td className="px-4 py-3 font-mono font-bold text-blue-600 dark:text-blue-400">{s.student_code}</td>
                        <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{s.full_name}</td>
                        <td className="px-4 py-3">{s.enrolled_course_name}</td>
                        <td className="px-4 py-3 font-mono">{s.phone}</td>
                        <td className="px-4 py-3 font-mono text-slate-400">{s.admission_date}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setSelectedStudentForDetail(s)}
                            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                          >
                            Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. STUDENTS DIRECTORY                                                     */}
          {/* ========================================================================= */}
          {activeModule === 'students' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-5 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Learners Directory</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Access student progress and contact records</p>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, code, phone..."
                    className="bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-[#E5EAF1] dark:border-[#1E293B]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F5F7FB] dark:bg-[#0B1728] text-slate-500 uppercase font-semibold">
                    <tr>
                      <th className="px-4 py-3">Student Code</th>
                      <th className="px-4 py-3">Full Name</th>
                      <th className="px-4 py-3">Course</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5EAF1] dark:divide-[#1E293B]">
                    {students
                      .filter(s => 
                        s.student_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        s.full_name.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map(s => (
                        <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                          <td className="px-4 py-3 font-mono font-bold text-blue-600 dark:text-blue-400">{s.student_code}</td>
                          <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{s.full_name}</td>
                          <td className="px-4 py-3">{s.enrolled_course_name}</td>
                          <td className="px-4 py-3 font-mono">{s.phone}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                              {s.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => setSelectedStudentForDetail(s)}
                              className="px-2.5 py-1 rounded bg-blue-600/10 text-blue-600 dark:text-blue-400 font-medium text-[11px] hover:bg-blue-600 hover:text-white transition"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. INSTRUCTORS                                                            */}
          {/* ========================================================================= */}
          {activeModule === 'instructors' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Instructors & Training Roster</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">View active driving instructors, car assignments, and contact details</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {instructors.map(ins => (
                  <div key={ins.id} className="p-5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{ins.full_name}</h4>
                      <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{ins.instructor_code}</span>
                    </div>
                    <div className="space-y-1 text-slate-500">
                      <div>Assigned Car: <strong className="text-slate-800 dark:text-slate-200">{ins.assigned_vehicle_name || 'Swift Dzire'}</strong></div>
                      <div>Phone: <strong className="text-slate-800 dark:text-slate-200 font-mono">{ins.phone}</strong></div>
                      <div>Active Learners: <strong className="text-emerald-600 font-semibold">{ins.active_students_count} Students</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. COURSES & SESSIONS                                                     */}
          {/* ========================================================================= */}
          {activeModule === 'courses' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Courses & Session Modules</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">View approved course pricing and curriculum session breakdown</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {courses.map(crs => (
                  <div key={crs.id} className="p-5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        {crs.category}
                      </span>
                      <span className="font-mono text-xs text-slate-400">{crs.duration_days} Days</span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{crs.name}</h3>
                    <div className="text-lg font-black text-slate-900 dark:text-white tabular-nums">
                      ₹{crs.price.toLocaleString('en-IN')}
                    </div>
                    <div className="space-y-1 text-xs pt-2 border-t border-slate-200 dark:border-slate-800 text-slate-500">
                      {crs.templates?.map(t => (
                        <div key={t.id} className="flex justify-between">
                          <span>{t.session_name}</span>
                          <span className="font-mono font-bold">{t.total_sessions} classes</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 6. ATTENDANCE                                                             */}
          {/* ========================================================================= */}
          {activeModule === 'attendance' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-5 max-w-7xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Verified Attendance Stream</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Real-time attendance logs submitted by driving instructors</p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-[#E5EAF1] dark:border-[#1E293B]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F5F7FB] dark:bg-[#0B1728] text-slate-500 uppercase font-semibold">
                    <tr>
                      <th className="px-4 py-3">Timestamp</th>
                      <th className="px-4 py-3">Student</th>
                      <th className="px-4 py-3">Instructor</th>
                      <th className="px-4 py-3">Module</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5EAF1] dark:divide-[#1E293B]">
                    {attendanceRecords.map(att => (
                      <tr key={att.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                        <td className="px-4 py-3 font-mono text-slate-500">
                          {new Date(att.marked_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-slate-900 dark:text-white block">{att.student_name}</span>
                          <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400">{att.student_code}</span>
                        </td>
                        <td className="px-4 py-3">{att.instructor_name}</td>
                        <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">{att.session_name}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            {att.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 7. CLASS SCHEDULE                                                         */}
          {/* ========================================================================= */}
          {activeModule === 'schedules' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Class Scheduling Desk</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Book driving time slots and training topics</p>
                </div>
                <button
                  onClick={() => setQuickAddType('schedule')}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" /> Book Class Slot
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {schedules.map(sch => (
                  <div key={sch.id} className="p-4 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{sch.student_name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600">{sch.status}</span>
                    </div>
                    <p className="text-slate-500">Instructor: <strong>{sch.instructor_name}</strong></p>
                    <p className="text-slate-500">Topic: <strong>{sch.topic}</strong></p>
                    <p className="font-mono text-slate-400">{new Date(sch.scheduled_start).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 8. FEES & PAYMENTS                                                        */}
          {/* ========================================================================= */}
          {activeModule === 'payments' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Fee Collection Desk</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Record payments and generate officialSerialized receipts</p>
                </div>
                {permissions.can_manage_fees && (
                  <button
                    onClick={() => setQuickAddType('payment')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> Record Fee Payment
                  </button>
                )}
              </div>

              <div className="overflow-x-auto rounded-2xl border border-[#E5EAF1] dark:border-[#1E293B]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F5F7FB] dark:bg-[#0B1728] text-slate-500 uppercase font-semibold">
                    <tr>
                      <th className="px-4 py-3">Receipt / Status</th>
                      <th className="px-4 py-3">Student Name</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Method</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5EAF1] dark:divide-[#1E293B]">
                    {payments.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                        <td className="px-4 py-3 font-mono font-bold">
                          {p.receipt_number || (
                            <span className="text-amber-500">PENDING OWNER APPROVAL</span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{p.student_name}</td>
                        <td className="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                          ₹{p.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3 font-medium">{p.payment_method}</td>
                        <td className="px-4 py-3 font-mono text-slate-400">
                          {new Date(p.received_at).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {p.status === 'Confirmed' ? (
                            <button
                              onClick={() => setSelectedReceipt(p)}
                              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-medium inline-flex items-center gap-1"
                            >
                              <Printer className="w-3 h-3" /> Print
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Pending Approval</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 9. DRIVING LICENCE                                                        */}
          {/* ========================================================================= */}
          {activeModule === 'licences' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">RTO Driving Licence (LL & DL) Desk</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Update official Sarathi application references, test slots, and clearance results</p>
              </div>

              <div className="space-y-4">
                {licenceRecords.map(lic => (
                  <div key={lic.id} className="p-5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-3 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">{lic.student_name}</h4>
                          <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{lic.student_code}</span>
                        </div>
                        <span className="text-slate-500">{lic.licence_type} • RTO: {lic.rto_name}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        {lic.ll_status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                      <div>LL Ref: <strong className="font-mono text-slate-800 dark:text-slate-200">{lic.ll_reference || 'MH12LL099182'}</strong></div>
                      <div>DL Test Date: <strong className="text-purple-600 dark:text-purple-400 font-bold">{lic.test_date || '20 Nov 2026'}</strong></div>
                      <div>Test Result: <strong className="text-slate-800 dark:text-slate-200">{lic.test_result || 'Scheduled'}</strong></div>
                      <div>Licence Number: <strong className="font-mono text-emerald-600 font-bold">{lic.licence_number || 'Pending'}</strong></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 10. VEHICLES                                                              */}
          {/* ========================================================================= */}
          {activeModule === 'vehicles' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Academy Dual-Control Fleet</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Inspect vehicle status, assigned trainers, and insurance validity</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {vehicles.map(v => (
                  <div key={v.id} className="p-5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{v.brand} {v.model}</h4>
                      <span className="font-mono text-blue-600 font-bold">{v.registration_number}</span>
                    </div>
                    <p className="text-slate-500">Dual Control: <strong className="text-emerald-600">{v.is_dual_control ? 'Dual Brake Fitted' : 'No'}</strong></p>
                    <p className="text-slate-500">Assigned Driver: <strong>{v.assigned_instructor_name || 'Unassigned'}</strong></p>
                    <p className="text-slate-500">Status: <strong className="text-slate-800 dark:text-slate-200">{v.status}</strong></p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 11. NOTIFICATIONS                                                         */}
          {/* ========================================================================= */}
          {activeModule === 'notifications' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4 max-w-7xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Notifications Feed</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Class scheduling, fee logs, and academy alerts</p>
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
          {/* 12. STAFF PROFILE & PERMISSIONS                                           */}
          {/* ========================================================================= */}
          {activeModule === 'profile' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-6 max-w-2xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">My Staff Profile</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Your registered employee credentials and individual authorization limits</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-4 text-xs">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white font-bold text-xl flex items-center justify-center">
                    {currentUser.full_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">{currentUser.full_name}</h3>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">{currentStaff?.role_title} • Code: {currentStaff?.employee_code}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Email:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{currentUser.email || 'staff@apexdriving.in'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone:</span>
                    <strong className="text-slate-800 dark:text-slate-200 font-mono">{currentUser.phone || '+91 98220 55443'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Assigned Driving Academy:</span>
                    <strong className="text-slate-800 dark:text-slate-200">{school.name}</strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block">Configured Role Permissions:</span>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 font-semibold">
                      Admit Students: {permissions.can_admit_students ? 'Yes' : 'No'}
                    </div>
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 font-semibold">
                      Enter Payments: {permissions.can_manage_fees ? 'Yes' : 'No'}
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 font-semibold">
                      Confirm Collections: {permissions.can_confirm_payments ? 'Authorized' : 'Requires Owner'}
                    </div>
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 font-semibold">
                      Manage Licences: {permissions.can_manage_licences ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODALS */}
      <QuickAddModals 
        modalType={quickAddType} 
        onClose={() => setQuickAddType(null)} 
      />

      <StudentDetailModal 
        student={selectedStudentForDetail}
        enrollment={enrollments.find(e => e.student_id === selectedStudentForDetail?.id)}
        attendanceRecords={attendanceRecords}
        payments={payments}
        licenceRecord={licenceRecords.find(l => l.student_id === selectedStudentForDetail?.id)}
        schedules={schedules}
        auditLogs={auditLogs}
        school={school}
        onClose={() => setSelectedStudentForDetail(null)}
      />

      <ReceiptModal 
        payment={selectedReceipt} 
        school={school} 
        onClose={() => setSelectedReceipt(null)} 
      />
    </div>
  );
}
