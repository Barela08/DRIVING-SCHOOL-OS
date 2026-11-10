'use client';

import React, { useState, useEffect } from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { 
  Users, 
  Award, 
  Calendar, 
  CheckCircle2, 
  IndianRupee, 
  Clock, 
  FileCheck2, 
  Car, 
  Search, 
  Filter, 
  Printer, 
  Download, 
  Plus, 
  ShieldCheck, 
  ChevronRight, 
  AlertTriangle, 
  BookOpen, 
  History, 
  Settings, 
  TrendingUp, 
  FileText,
  UserCheck,
  Bell,
  BarChart3,
  ExternalLink,
  Check,
  X
} from 'lucide-react';
import { OwnerSidebar } from '@/components/owner/OwnerSidebar';
import { OwnerTopNav } from '@/components/owner/OwnerTopNav';
import { StudentDetailModal } from '@/components/owner/StudentDetailModal';
import { QuickAddModals } from '@/components/owner/QuickAddModals';
import { AnalyticsCharts } from '@/components/owner/AnalyticsCharts';
import { ReceiptModal } from '@/components/ReceiptModal';
import { Student, Payment } from '@/types';

export default function OwnerDashboardPage() {
  const { 
    school, 
    branches, 
    students, 
    courses, 
    instructors, 
    staffMembers, 
    vehicles, 
    enrollments, 
    attendanceRecords, 
    payments, 
    licenceRecords, 
    schedules, 
    notifications, 
    auditLogs,
    confirmPayment, 
    rejectPayment, 
    exportToCSV 
  } = useDrivingSchool();

  // Navigation & Layout states
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<'today' | '7days' | '30days' | 'month' | 'custom'>('today');

  // Modals
  const [quickAddType, setQuickAddType] = useState<'student' | 'instructor' | 'staff' | 'payment' | 'schedule' | 'vehicle' | null>(null);
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<Student | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);

  // Filters
  const [operationsStatusFilter, setOperationsStatusFilter] = useState<'all' | 'Scheduled' | 'Completed' | 'Pending' | 'Cancelled'>('all');
  const [studentSearchText, setStudentSearchText] = useState('');
  const [studentStatusFilter, setStudentStatusFilter] = useState('all');

  // Today Date
  const [todayStr, setTodayStr] = useState('2026-11-10');
  useEffect(() => {
    setTodayStr(new Date().toISOString().split('T')[0]);
  }, []);

  // Financial calculations
  const totalAgreedFees = enrollments.reduce((sum, e) => sum + e.agreed_fee, 0);
  const confirmedPayments = payments.filter(p => p.status === 'Confirmed');
  const totalConfirmedRevenue = confirmedPayments.reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = payments.filter(p => p.status === 'Pending');
  const totalPendingAmount = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalOutstanding = Math.max(0, totalAgreedFees - totalConfirmedRevenue);

  const todayConfirmedPayments = confirmedPayments.filter(p => p.received_at.startsWith(todayStr));
  const todayCollectionAmount = todayConfirmedPayments.reduce((sum, p) => sum + p.amount, 0);

  // Student metrics
  const totalRegisteredStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'Active').length;
  const newAdmissionsCount = students.filter(s => s.status === 'Registered' || s.admission_date.startsWith('2026-11')).length;

  // Instructor metrics
  const totalInstructors = instructors.length;
  const activeInstructors = instructors.filter(i => i.employment_status === 'active').length;

  // Today's classes & attendance
  const todayClassesScheduled = schedules.length;
  const todayAttendanceList = attendanceRecords.filter(a => a.attendance_date === todayStr);
  const todayCompletedCount = todayAttendanceList.filter(a => a.status === 'Present').length;
  const attendanceRate = todayClassesScheduled > 0 ? Math.round((todayCompletedCount / todayClassesScheduled) * 100) : 100;

  // Licence & Fleet
  const upcomingLicenceTests = licenceRecords.filter(l => l.ll_status === 'DL Test Scheduled' || l.test_date);
  const availableVehiclesCount = vehicles.filter(v => v.status === 'Available' || v.status === 'Assigned').length;

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0B1728] text-slate-900 dark:text-slate-100 flex flex-col transition-colors">
      {/* Top Navbar */}
      <OwnerTopNav 
        activeModule={activeModule}
        isCollapsed={isCollapsed}
        setIsMobileOpen={setIsMobileOpen}
        onOpenQuickAdd={(type) => setQuickAddType(type)}
        onSelectStudent={(s) => setSelectedStudentForDetail(s)}
      />

      <div className="flex-1 flex">
        {/* Fixed Left Sidebar */}
        <OwnerSidebar 
          activeModule={activeModule}
          setActiveModule={setActiveModule}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />

        {/* Scrollable Main Workspace */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${
          isCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}>
          {/* ========================================================================= */}
          {/* 1. DASHBOARD OVERVIEW VIEW                                              */}
          {/* ========================================================================= */}
          {activeModule === 'dashboard' && (
            <div className="space-y-8 max-w-7xl mx-auto">
              {/* Header Title & Date Range Filter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Welcome back, Owner. Here is your driving school's complete operational overview.
                  </p>
                </div>

                {/* Date-Range Selector */}
                <div className="flex items-center bg-white dark:bg-[#111E32] p-1 rounded-2xl border border-[#E5EAF1] dark:border-[#1E293B] text-xs font-semibold shadow-sm">
                  {(['today', '7days', '30days', 'month', 'custom'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setDateFilter(f)}
                      className={`px-3 py-1.5 rounded-xl capitalize transition ${
                        dateFilter === f
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {f === 'today' && 'Today'}
                      {f === '7days' && 'Last 7 Days'}
                      {f === '30days' && 'Last 30 Days'}
                      {f === 'month' && 'This Month'}
                      {f === 'custom' && 'Custom'}
                    </button>
                  ))}
                </div>
              </div>

              {/* SECTION 5: 8 PREMIUM KPI CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: Total Students */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                    <span className="font-semibold">Total Students</span>
                    <div className="w-9 h-9 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">{totalRegisteredStudents}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{activeStudents} Active</span>
                      <span>•</span>
                      <span>{newAdmissionsCount} New</span>
                    </div>
                  </div>
                </div>

                {/* Card 2: Active Instructors */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                    <span className="font-semibold">Active Instructors</span>
                    <div className="w-9 h-9 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Award className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">{activeInstructors}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                      <span>Total: {totalInstructors} Drivers</span>
                      <span>•</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">100% On-Duty</span>
                    </div>
                  </div>
                </div>

                {/* Card 3: Today's Classes */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                    <span className="font-semibold">Today's Classes</span>
                    <div className="w-9 h-9 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <Calendar className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">{todayClassesScheduled}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">{todayCompletedCount} Completed</span>
                      <span>•</span>
                      <span>{Math.max(0, todayClassesScheduled - todayCompletedCount)} Remaining</span>
                    </div>
                  </div>
                </div>

                {/* Card 4: Attendance */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                    <span className="font-semibold">Attendance</span>
                    <div className="w-9 h-9 rounded-xl bg-teal-600/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-teal-600 dark:text-teal-400 tabular-nums">{attendanceRate}%</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                      <span>{todayAttendanceList.length} Sessions Logged</span>
                      <span>•</span>
                      <span>0 Missed</span>
                    </div>
                  </div>
                </div>

                {/* Card 5: Total Fees */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                    <span className="font-semibold">Total Course Fees</span>
                    <div className="w-9 h-9 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <IndianRupee className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                      ₹{totalAgreedFees.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">₹{totalConfirmedRevenue.toLocaleString('en-IN')} Collected</span>
                    </div>
                  </div>
                </div>

                {/* Card 6: Today's Collection */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                    <span className="font-semibold">Today's Collection</span>
                    <div className="w-9 h-9 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                      ₹{todayCollectionAmount.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                      <span>{todayConfirmedPayments.length} Transactions confirmed</span>
                    </div>
                  </div>
                </div>

                {/* Card 7: Pending Fees */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                    <span className="font-semibold">Pending Fees</span>
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-amber-500 tabular-nums">
                      ₹{totalOutstanding.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                      <span>Due before DL test appointments</span>
                    </div>
                  </div>
                </div>

                {/* Card 8: Upcoming Licence Tests */}
                <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs">
                    <span className="font-semibold">Upcoming Licence Tests</span>
                    <div className="w-9 h-9 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums">
                      {upcomingLicenceTests.length}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                      <span>RTO Alandi Track Scheduled</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 6: ANALYTICS CHARTS */}
              <AnalyticsCharts />

              {/* SECTION 7: TODAY'S DRIVING OPERATIONS */}
              <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">Today's Driving Operations</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Live operational monitor across all instructors and vehicles</p>
                  </div>

                  {/* Operation Status Filter */}
                  <div className="flex items-center gap-1 bg-[#F5F7FB] dark:bg-[#0B1728] p-1 rounded-xl border border-[#E5EAF1] dark:border-[#1E293B] text-xs font-semibold">
                    {(['all', 'Scheduled', 'Completed', 'Pending', 'Cancelled'] as const).map(st => (
                      <button
                        key={st}
                        onClick={() => setOperationsStatusFilter(st)}
                        className={`px-3 py-1 rounded-lg capitalize transition ${
                          operationsStatusFilter === st
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-[#E5EAF1] dark:border-[#1E293B]">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#F5F7FB] dark:bg-[#0B1728] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                      <tr>
                        <th className="px-4 py-3">Student</th>
                        <th className="px-4 py-3">Instructor</th>
                        <th className="px-4 py-3">Session Topic</th>
                        <th className="px-4 py-3">Scheduled Time</th>
                        <th className="px-4 py-3">Vehicle</th>
                        <th className="px-4 py-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5EAF1] dark:divide-[#1E293B]">
                      {schedules.map(sch => (
                        <tr key={sch.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                          <td className="px-4 py-3.5">
                            <span className="font-bold text-slate-900 dark:text-white block">{sch.student_name}</span>
                            <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400">{sch.student_code}</span>
                          </td>
                          <td className="px-4 py-3.5 font-medium">{sch.instructor_name}</td>
                          <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">{sch.topic}</td>
                          <td className="px-4 py-3.5 font-mono text-slate-500">
                            {new Date(sch.scheduled_start).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-4 py-3.5 font-mono">{sch.vehicle_name || 'Swift (MH-12-AB-1234)'}</td>
                          <td className="px-4 py-3.5 text-right">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                              {sch.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION 8 & 9: INSTRUCTOR PERFORMANCE & RECENT ADMISSIONS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Instructor Performance */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-600" /> Instructor Roster Performance
                    </h3>
                    <span className="text-xs text-slate-400">{instructors.length} active</span>
                  </div>

                  <div className="space-y-3">
                    {instructors.map(ins => (
                      <div key={ins.id} className="p-4 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-xs">
                              {ins.full_name.charAt(0)}
                            </div>
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white block">{ins.full_name}</span>
                              <span className="font-mono text-[10px] text-slate-400">{ins.instructor_code}</span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            {ins.employment_status.toUpperCase()}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                          <div>
                            <span>Assigned Car: </span>
                            <strong className="text-slate-800 dark:text-slate-200 block truncate">{ins.assigned_vehicle_name || 'Swift Dzire'}</strong>
                          </div>
                          <div>
                            <span>Active Students: </span>
                            <strong className="text-slate-800 dark:text-slate-200 block">{ins.active_students_count}</strong>
                          </div>
                          <div>
                            <span>Today's Classes: </span>
                            <strong className="text-emerald-600 dark:text-emerald-400 block">{ins.today_sessions_count} Done</strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Student Admissions */}
                <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" /> Recent Student Admissions
                    </h3>
                    <button
                      onClick={() => setQuickAddType('student')}
                      className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Student
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {students.slice(0, 4).map(s => (
                      <div 
                        key={s.id} 
                        onClick={() => setSelectedStudentForDetail(s)}
                        className="p-3.5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex items-center justify-between text-xs hover:border-blue-500 cursor-pointer transition"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white">{s.full_name}</span>
                            <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 font-bold">{s.student_code}</span>
                          </div>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">{s.enrolled_course_name}</span>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            {s.status}
                          </span>
                          <span className="block text-[10px] text-slate-400 mt-1 font-mono">{s.admission_date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. ALL STUDENTS MASTER DIRECTORY VIEW                                     */}
          {/* ========================================================================= */}
          {activeModule === 'students' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-5 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Master Student Directory</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Access, inspect, and update complete student profile records</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={studentSearchText}
                      onChange={(e) => setStudentSearchText(e.target.value)}
                      placeholder="Filter by name, code, phone..."
                      className="bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <button
                    onClick={() => setQuickAddType('student')}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> New Student
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-[#E5EAF1] dark:border-[#1E293B]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F5F7FB] dark:bg-[#0B1728] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="px-4 py-3">Code</th>
                      <th className="px-4 py-3">Full Name</th>
                      <th className="px-4 py-3">Course</th>
                      <th className="px-4 py-3">Assigned Instructor</th>
                      <th className="px-4 py-3">Sessions</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5EAF1] dark:divide-[#1E293B]">
                    {students
                      .filter(s => 
                        s.student_code.toLowerCase().includes(studentSearchText.toLowerCase()) ||
                        s.full_name.toLowerCase().includes(studentSearchText.toLowerCase())
                      )
                      .map(s => {
                        const enr = enrollments.find(e => e.student_id === s.id);
                        return (
                          <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                            <td className="px-4 py-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">{s.student_code}</td>
                            <td className="px-4 py-3.5">
                              <span className="font-bold text-slate-900 dark:text-white block">{s.full_name}</span>
                              <span className="text-[11px] text-slate-400">{s.phone}</span>
                            </td>
                            <td className="px-4 py-3.5">{s.enrolled_course_name}</td>
                            <td className="px-4 py-3.5">{s.assigned_instructor_name || 'Vikram Shinde'}</td>
                            <td className="px-4 py-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              {enr ? `${enr.completed_sessions} / ${enr.total_sessions}` : '0 / 20'}
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                {s.status}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <button
                                onClick={() => setSelectedStudentForDetail(s)}
                                className="px-2.5 py-1 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white transition font-medium text-[11px]"
                              >
                                View 10-Tab Profile
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
          {/* 9. FEES & PAYMENTS FINANCIAL VIEW                                         */}
          {/* ========================================================================= */}
          {activeModule === 'finances' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Fees & Financial Overview</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Confirmed Revenue: ₹{totalConfirmedRevenue.toLocaleString('en-IN')} • Outstanding: ₹{totalOutstanding.toLocaleString('en-IN')}</p>
                </div>
                <button
                  onClick={() => setQuickAddType('payment')}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Record Payment
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-[#E5EAF1] dark:border-[#1E293B]">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#F5F7FB] dark:bg-[#0B1728] text-slate-500 dark:text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="px-4 py-3">Receipt / ID</th>
                      <th className="px-4 py-3">Student</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Mode</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5EAF1] dark:divide-[#1E293B]">
                    {payments.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                        <td className="px-4 py-3.5 font-mono font-bold text-slate-700 dark:text-slate-300">
                          {p.receipt_number || 'PENDING APPROVAL'}
                        </td>
                        <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">{p.student_name}</td>
                        <td className="px-4 py-3.5 font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                          ₹{p.amount.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3.5 font-medium">{p.payment_method}</td>
                        <td className="px-4 py-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            p.status === 'Confirmed'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-slate-400">
                          {new Date(p.received_at).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-4 py-3.5 text-right space-x-2">
                          {p.status === 'Pending' ? (
                            <>
                              <button
                                onClick={async () => {
                                  const res = await confirmPayment(p.id);
                                  if (res.success) alert(`Payment Confirmed! Receipt #${res.receiptNumber}`);
                                }}
                                className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px]"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => rejectPayment(p.id, 'Discrepancy noted')}
                                className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px]"
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setSelectedReceipt(p)}
                              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-blue-600 dark:text-blue-400 font-medium text-[11px] inline-flex items-center gap-1"
                            >
                              <Printer className="w-3 h-3" /> Print Receipt
                            </button>
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
          {/* 14. REPORTS & ANALYTICS VIEW (CSV EXPORT)                                 */}
          {/* ========================================================================= */}
          {activeModule === 'reports' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-6 max-w-7xl mx-auto">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Downloadable Operational Reports</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Export verified records to standard CSV spreadsheets</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { id: 'students', label: 'Students Master Report', desc: 'All registered students & course allocations' },
                  { id: 'attendance', label: 'Attendance Audit Report', desc: 'Timestamped sessions marked by instructors' },
                  { id: 'payments', label: 'Revenue & Collection Report', desc: 'Complete payment receipts ledger' },
                  { id: 'fleet', label: 'Fleet & Maintenance Report', desc: 'Vehicles, dual-control, and PUC status' }
                ].map(rep => (
                  <div key={rep.id} className="p-5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-3 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{rep.label}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{rep.desc}</p>
                    </div>
                    <button
                      onClick={() => exportToCSV(rep.id)}
                      className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" /> Download CSV
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 13. STAFF MANAGEMENT VIEW                                                 */}
          {/* ========================================================================= */}
          {activeModule === 'staff' && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-5 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Staff Management & Permissions</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Configure desk permissions and RBAC overrides</p>
                </div>
                <button
                  onClick={() => setQuickAddType('staff')}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Staff Member
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {staffMembers.map(stf => (
                  <div key={stf.id} className="p-5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-sm text-slate-900 dark:text-white block">{stf.full_name}</span>
                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{stf.role_title}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        ACTIVE
                      </span>
                    </div>

                    <div className="space-y-1 text-xs pt-2 border-t border-slate-200 dark:border-slate-800">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">Granular Permissions:</span>
                      <div className="flex flex-wrap gap-1.5 text-[10px]">
                        <span className={`px-2 py-0.5 rounded ${stf.permissions.can_admit_students ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                          Admit Students: {stf.permissions.can_admit_students ? 'Yes' : 'No'}
                        </span>
                        <span className={`px-2 py-0.5 rounded ${stf.permissions.can_confirm_payments ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                          Confirm Fees: {stf.permissions.can_confirm_payments ? 'Yes' : 'No'}
                        </span>
                        <span className={`px-2 py-0.5 rounded ${stf.permissions.can_manage_licences ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                          Manage RTO: {stf.permissions.can_manage_licences ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* OTHER MODULE FALLBACK RENDERING (Courses, Licences, Fleet, Audit, etc.)    */}
          {/* ========================================================================= */}
          {!['dashboard', 'students', 'finances', 'reports', 'staff'].includes(activeModule) && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4 max-w-7xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF1] dark:border-[#1E293B]">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white capitalize">
                    {activeModule} Operations Module
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Full database connectivity to PostgreSQL & Supabase RLS
                  </p>
                </div>
              </div>

              {activeModule === 'attendance' && (
                <div className="space-y-3 text-xs">
                  <span className="font-bold block">Live Verified Attendance Stream ({attendanceRecords.length})</span>
                  <div className="space-y-2">
                    {attendanceRecords.map(att => (
                      <div key={att.id} className="p-3.5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white">{att.student_name}</span>
                            <span className="font-mono text-blue-600">{att.student_code}</span>
                          </div>
                          <span className="text-slate-500 block mt-0.5">{att.session_name} • Instructor: {att.instructor_name}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-500/10 text-emerald-600">
                          {att.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeModule === 'licences' && (
                <div className="space-y-3 text-xs">
                  <span className="font-bold block">RTO LL & DL Tracking Pipeline</span>
                  <div className="space-y-2">
                    {licenceRecords.map(lic => (
                      <div key={lic.id} className="p-3.5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex items-center justify-between">
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white">{lic.student_name}</span>
                          <span className="text-slate-500 block">{lic.licence_type} • RTO: {lic.rto_name}</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full font-bold text-[10px] bg-blue-500/10 text-blue-600">
                          {lic.ll_status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeModule === 'vehicles' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {vehicles.map(v => (
                    <div key={v.id} className="p-4 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{v.brand} {v.model}</span>
                        <span className="font-mono font-bold text-blue-600">{v.registration_number}</span>
                      </div>
                      <p className="text-slate-500">Dual Control: {v.is_dual_control ? 'Yes' : 'No'} • Status: {v.status}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeModule === 'audit' && (
                <div className="space-y-2 text-xs">
                  <span className="font-bold block">Immutable Audit Records ({auditLogs.length})</span>
                  {auditLogs.map(aud => (
                    <div key={aud.id} className="p-3 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{aud.actor_name} — {aud.action}</span>
                        <p className="text-slate-500">{aud.details}</p>
                      </div>
                      <span className="font-mono text-slate-400 text-[10px]">{new Date(aud.created_at).toLocaleTimeString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* MODALS */}
      {/* 1. Quick Add Modals */}
      <QuickAddModals 
        modalType={quickAddType} 
        onClose={() => setQuickAddType(null)} 
      />

      {/* 2. 10-Tab Student Detail Modal */}
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

      {/* 3. Official Receipt Modal */}
      <ReceiptModal 
        payment={selectedReceipt} 
        school={school} 
        onClose={() => setSelectedReceipt(null)} 
      />
    </div>
  );
}
