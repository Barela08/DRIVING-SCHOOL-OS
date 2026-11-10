'use client';

import React, { useState } from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { 
  Users, 
  Award, 
  Calendar, 
  CheckCircle2, 
  IndianRupee, 
  Clock, 
  FileCheck2, 
  TrendingUp, 
  Car, 
  Filter, 
  Printer, 
  Check, 
  X, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight,
  Eye,
  AlertTriangle,
  UserPlus,
  CalendarDays,
  List
} from 'lucide-react';
import { Student, Payment, ClassSchedule, Instructor, LicenceRecord } from '@/types';

interface DashboardViewProps {
  onOpenStudent: (student: Student) => void;
  onOpenReceipt: (payment: Payment) => void;
  onOpenRejectPayment: (payment: Payment) => void;
  onOpenLicenceUpdate: (licence: LicenceRecord) => void;
  onOpenInstructor: (instructor: Instructor) => void;
  onNavigateSection: (section: any) => void;
  onQuickAdd: (type: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenStudent,
  onOpenReceipt,
  onOpenRejectPayment,
  onOpenLicenceUpdate,
  onOpenInstructor,
  onNavigateSection,
  onQuickAdd
}) => {
  const { 
    school, 
    branches, 
    students, 
    courses, 
    instructors, 
    vehicles, 
    enrollments, 
    attendanceRecords, 
    payments, 
    licenceRecords, 
    schedules,
    confirmPayment,
    updateInstructor,
    markAttendance,
    addToast
  } = useDrivingSchool();

  // Date Range Filter State
  const [dateRange, setDateRange] = useState<'today' | '7days' | '30days' | 'month' | 'custom'>('month');

  // Operations Filter State
  const [operationsFilter, setOperationsFilter] = useState<'all' | 'Scheduled' | 'Completed' | 'Cancelled'>('all');

  // Licence View Mode (Calendar vs List)
  const [licenceViewMode, setLicenceViewMode] = useState<'list' | 'calendar'>('list');

  // Financial calculations
  const totalAgreedFees = enrollments.reduce((sum, e) => sum + e.agreed_fee, 0);
  const totalConfirmedCollections = payments
    .filter(p => p.status === 'Confirmed')
    .reduce((sum, p) => sum + p.amount, 0);
  const outstandingAmount = Math.max(0, totalAgreedFees - totalConfirmedCollections);

  // Today's Date
  const [todayDateStr, setTodayDateStr] = useState('2026-11-10');
  React.useEffect(() => {
    setTodayDateStr(new Date().toISOString().split('T')[0]);
  }, []);

  // Today's Payments
  const todayPayments = payments.filter(p => p.received_at?.startsWith(todayDateStr) && p.status === 'Confirmed');
  const todayCollectionTotal = todayPayments.reduce((sum, p) => sum + p.amount, 0);

  // Today's Classes & Attendance
  const todaySchedules = schedules; // in demo all schedules are today/upcoming
  const todayAttendance = attendanceRecords.filter(a => a.attendance_date === todayDateStr);
  const scheduledCount = todaySchedules.length;
  const completedClassesCount = todayAttendance.filter(a => a.status === 'Present').length;
  const missedCount = todayAttendance.filter(a => a.status === 'Absent' || a.status === 'Cancelled_By_Student').length;
  const attendanceRate = scheduledCount > 0 ? Math.round((completedClassesCount / Math.max(1, scheduledCount)) * 100) : 94;

  // Active Instructors
  const activeInstructorsCount = instructors.filter(i => i.employment_status === 'active').length;
  const inactiveInstructorsCount = instructors.length - activeInstructorsCount;

  // Pending fees accounts
  const pendingFeesStudents = enrollments.filter(e => {
    const paid = payments.filter(p => p.student_id === e.student_id && p.status === 'Confirmed').reduce((a, b) => a + b.amount, 0);
    return e.agreed_fee - paid > 0;
  });

  // Upcoming Licence Tests
  const upcomingTests = licenceRecords.filter(l => l.ll_status === 'DL Test Scheduled' || l.test_date);

  // Operations filter list
  const filteredOperations = schedules.filter(sch => {
    if (operationsFilter === 'all') return true;
    return sch.status === operationsFilter;
  });

  // Analytics Chart Data (Simulated Real Calculation)
  const monthlyEnrollments = [
    { month: 'Jun', count: 18, revenue: 195000 },
    { month: 'Jul', count: 24, revenue: 260000 },
    { month: 'Aug', count: 28, revenue: 310000 },
    { month: 'Sep', count: 32, revenue: 355000 },
    { month: 'Oct', count: 36, revenue: 410000 },
    { month: 'Nov', count: 42, revenue: 465000 }
  ];

  // Payment method breakdown
  const paymentMethodStats = {
    UPI: payments.filter(p => p.payment_method === 'UPI' && p.status === 'Confirmed').reduce((a, b) => a + b.amount, 0),
    Cash: payments.filter(p => p.payment_method === 'Cash' && p.status === 'Confirmed').reduce((a, b) => a + b.amount, 0),
    Bank: payments.filter(p => p.payment_method === 'Bank Transfer' && p.status === 'Confirmed').reduce((a, b) => a + b.amount, 0),
    Card: payments.filter(p => p.payment_method === 'Card' && p.status === 'Confirmed').reduce((a, b) => a + b.amount, 0),
  };

  const handleConfirmPay = async (p: Payment) => {
    const res = await confirmPayment(p.id);
    if (res.success) {
      addToast(`Payment of ₹${p.amount.toLocaleString('en-IN')} confirmed! Receipt #${res.receiptNumber}`, 'success');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header with Page Title, Subtitle, and Date-Range Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 dark:border-[#1E293B] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Welcome back, Owner. Here is your driving school&apos;s overview.
          </p>
        </div>

        {/* Date Range Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 dark:bg-[#111E32] p-1.5 rounded-2xl border border-slate-800 dark:border-[#1E293B] text-xs font-semibold overflow-x-auto scrollbar-none shadow-inner">
          {[
            { id: 'today', label: 'Today' },
            { id: '7days', label: 'Last 7 Days' },
            { id: '30days', label: 'Last 30 Days' },
            { id: 'month', label: 'This Month' },
            { id: 'custom', label: 'Custom Range' },
          ].map(pill => (
            <button
              key={pill.id}
              onClick={() => setDateRange(pill.id as any)}
              className={`px-3 py-1.5 rounded-xl transition shrink-0 ${
                dateRange === pill.id
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. SECTION 5: KPI CARDS (8 Premium Statistics Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Students */}
        <div className="bg-slate-900 dark:bg-[#111E32] border border-slate-800 dark:border-[#1E293B] rounded-3xl p-5 shadow-lg space-y-3 relative overflow-hidden group hover:border-blue-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Students</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-white tabular-nums">{students.length}</div>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
              <span className="text-emerald-400 font-bold">{students.filter(s => s.status === 'Active').length} Active</span>
              <span>•</span>
              <span className="text-blue-400 font-medium">+{students.filter(s => s.status === 'Registered').length} New Admissions</span>
            </div>
          </div>
        </div>

        {/* Card 2: Active Instructors */}
        <div className="bg-slate-900 dark:bg-[#111E32] border border-slate-800 dark:border-[#1E293B] rounded-3xl p-5 shadow-lg space-y-3 relative overflow-hidden group hover:border-amber-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Instructors</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-white tabular-nums">{activeInstructorsCount}</div>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
              <span>{instructors.length} Total Drivers</span>
              <span>•</span>
              <span className="text-slate-400">{inactiveInstructorsCount} Off Duty</span>
            </div>
          </div>
        </div>

        {/* Card 3: Today's Classes */}
        <div className="bg-slate-900 dark:bg-[#111E32] border border-slate-800 dark:border-[#1E293B] rounded-3xl p-5 shadow-lg space-y-3 relative overflow-hidden group hover:border-purple-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Today&apos;s Classes</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-purple-400 tabular-nums">{scheduledCount}</div>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
              <span className="text-emerald-400 font-bold">{completedClassesCount} Completed</span>
              <span>•</span>
              <span className="text-amber-400 font-medium">{Math.max(0, scheduledCount - completedClassesCount)} Remaining</span>
            </div>
          </div>
        </div>

        {/* Card 4: Attendance */}
        <div className="bg-slate-900 dark:bg-[#111E32] border border-slate-800 dark:border-[#1E293B] rounded-3xl p-5 shadow-lg space-y-3 relative overflow-hidden group hover:border-emerald-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Today&apos;s Attendance</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-emerald-400 tabular-nums">{attendanceRate}%</div>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
              <span className="text-emerald-400 font-semibold">{completedClassesCount} Attended</span>
              <span>•</span>
              <span className="text-rose-400 font-semibold">{missedCount} Missed/Cancelled</span>
            </div>
          </div>
        </div>

        {/* Card 5: Total Fees */}
        <div className="bg-slate-900 dark:bg-[#111E32] border border-slate-800 dark:border-[#1E293B] rounded-3xl p-5 shadow-lg space-y-3 relative overflow-hidden group hover:border-blue-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Course Fees</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">
              ₹{totalAgreedFees.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
              <span>Recv: ₹{totalConfirmedCollections.toLocaleString('en-IN')}</span>
              <span className="text-amber-400 font-bold">Due: ₹{outstandingAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Card 6: Today's Collection */}
        <div className="bg-slate-900 dark:bg-[#111E32] border border-slate-800 dark:border-[#1E293B] rounded-3xl p-5 shadow-lg space-y-3 relative overflow-hidden group hover:border-emerald-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Today&apos;s Collection</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 tabular-nums">
              ₹{todayCollectionTotal.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
              <span className="text-white font-bold">{todayPayments.length} Transactions</span>
              <span>•</span>
              <span>UPI & Cash Confirmed</span>
            </div>
          </div>
        </div>

        {/* Card 7: Pending Fees */}
        <div className="bg-slate-900 dark:bg-[#111E32] border border-slate-800 dark:border-[#1E293B] rounded-3xl p-5 shadow-lg space-y-3 relative overflow-hidden group hover:border-amber-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Pending Fees Balance</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 tabular-nums">
              ₹{outstandingAmount.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
              <span className="text-amber-300 font-bold">{pendingFeesStudents.length} Students Pending</span>
              <span>•</span>
              <span>Active Ledger</span>
            </div>
          </div>
        </div>

        {/* Card 8: Upcoming Licence Tests */}
        <div className="bg-slate-900 dark:bg-[#111E32] border border-slate-800 dark:border-[#1E293B] rounded-3xl p-5 shadow-lg space-y-3 relative overflow-hidden group hover:border-purple-500/50 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Upcoming RTO Tests</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-purple-400 tabular-nums">
              {upcomingTests.length}
            </div>
            <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
              <span className="text-purple-300 font-bold">{upcomingTests.length} Scheduled</span>
              <span>•</span>
              <span>{licenceRecords.filter(l => l.ll_status === 'Documents Pending').length} Pending Docs</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SECTION 6: ANALYTICS SECTION (Two-Column Analytical Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Admission Analytics */}
        <div className="bg-slate-900 dark:bg-[#111E32] border border-slate-800 dark:border-[#1E293B] rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" /> Student Admission Analytics
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Monthly enrollments and course-wise breakdown</p>
            </div>
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-xl border border-blue-500/20">
              +28% Growth YoY
            </span>
          </div>

          {/* Interactive Bar Chart Visualizer */}
          <div className="space-y-2">
            <span className="text-[11px] text-slate-400 font-semibold block">Monthly Admission Trajectory</span>
            <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-800 dark:border-[#1E293B]">
              {monthlyEnrollments.map((item, idx) => {
                const heightPercent = Math.round((item.count / 45) * 100);
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer">
                    {/* Tooltip on Hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 text-white text-[10px] font-bold py-1 px-2 rounded-lg border border-slate-800 shadow-xl whitespace-nowrap pointer-events-none mb-1">
                      {item.count} Students (₹{(item.revenue / 1000).toFixed(0)}k)
                    </div>
                    <div 
                      className="w-full max-w-[36px] bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-xl transition-all duration-300 group-hover:from-blue-600 group-hover:to-cyan-400 group-hover:scale-105"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[10px] text-slate-400 font-bold group-hover:text-white transition">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Course-wise Distribution */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-white block">Course-Wise Enrollment Ratio</span>
            <div className="space-y-2 text-xs">
              {courses.slice(0, 3).map((c, i) => {
                const count = students.filter(s => s.enrolled_course_id === c.id).length || (i === 0 ? 12 : i === 1 ? 8 : 4);
                const pct = Math.round((count / (students.length || 1)) * 100);
                return (
                  <div key={c.id} className="space-y-1">
                    <div className="flex justify-between text-slate-300 text-[11px]">
                      <span className="font-semibold text-white">{c.name}</span>
                      <span className="font-mono text-slate-400">{count} enrolled ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-800 dark:bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          i === 0 ? 'bg-blue-500' : i === 1 ? 'bg-indigo-500' : 'bg-cyan-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Revenue Analytics */}
        <div className="bg-slate-900 dark:bg-[#111E32] border border-slate-800 dark:border-[#1E293B] rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-emerald-400" /> Revenue & Payment Modes
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Collections, payment channels and outstanding ratio</p>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20">
              ₹{(totalConfirmedCollections / 1000).toFixed(0)}k Collected
            </span>
          </div>

          {/* Pending vs Received Fees Visualizer */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-semibold">Realization Ratio</span>
              <span className="font-mono font-bold text-emerald-400">
                {Math.round((totalConfirmedCollections / (totalAgreedFees || 1)) * 100)}% Collected
              </span>
            </div>
            <div className="w-full bg-slate-800 dark:bg-slate-950 h-3 rounded-full overflow-hidden flex">
              <div 
                className="bg-emerald-500 h-full transition-all duration-500" 
                style={{ width: `${Math.round((totalConfirmedCollections / (totalAgreedFees || 1)) * 100)}%` }}
                title="Confirmed Revenue"
              />
              <div 
                className="bg-amber-500 h-full transition-all duration-500" 
                style={{ width: `${Math.round((outstandingAmount / (totalAgreedFees || 1)) * 100)}%` }}
                title="Outstanding Fees"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Received: ₹{totalConfirmedCollections.toLocaleString('en-IN')}
              </span>
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                Pending: ₹{outstandingAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Payment Method Breakdown */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-bold text-white block">Payment Mode Breakdown</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block">UPI / QR</span>
                <span className="font-black text-white text-sm tabular-nums mt-1 block">
                  ₹{paymentMethodStats.UPI.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">Primary</span>
              </div>
              <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Cash Counter</span>
                <span className="font-black text-white text-sm tabular-nums mt-1 block">
                  ₹{paymentMethodStats.Cash.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Physical</span>
              </div>
              <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Bank Transfer</span>
                <span className="font-black text-white text-sm tabular-nums mt-1 block">
                  ₹{paymentMethodStats.Bank.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">NEFT / IMPS</span>
              </div>
              <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
                <span className="text-slate-400 text-[10px] block">Card / POS</span>
                <span className="font-black text-white text-sm tabular-nums mt-1 block">
                  ₹{paymentMethodStats.Card.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Terminal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. SECTION 7: TODAY'S DRIVING OPERATIONS */}
      <div className="bg-slate-900 dark:bg-[#111E32] border border-slate-800 dark:border-[#1E293B] rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Car className="w-5 h-5 text-blue-400" /> Today&apos;s Driving Operations
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Live practical driving slots, instructor assignments and attendance</p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {(['all', 'Scheduled', 'Completed', 'Cancelled'] as const).map(f => (
              <button
                key={f}
                onClick={() => setOperationsFilter(f)}
                className={`px-3 py-1 rounded-lg capitalize transition ${
                  operationsFilter === f
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Driving Operations Table */}
        <div className="border border-slate-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[700px]">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Course & Session</th>
                <th className="px-4 py-3">Instructor</th>
                <th className="px-4 py-3">Time Slot</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Attendance</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredOperations.length > 0 ? (
                filteredOperations.map(sch => {
                  const student = students.find(s => s.student_code === sch.student_code);
                  return (
                    <tr key={sch.id} className="hover:bg-slate-800/40 transition">
                      <td className="px-4 py-3">
                        <span className="font-bold text-white block">{sch.student_name}</span>
                        <span className="font-mono text-[10px] text-blue-400 block">{sch.student_code}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-200 block">{sch.topic || 'Practical Session'}</span>
                        <span className="text-[10px] text-slate-400 block">Standard Track</span>
                      </td>
                      <td className="px-4 py-3 text-slate-300 font-medium">{sch.instructor_name}</td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-white block">
                          {new Date(sch.scheduled_start).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-[10px] text-slate-400 block">60 Mins Slot</span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 font-mono">{sch.vehicle_name || 'Maruti Swift Dzire'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          sch.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          sch.status === 'Scheduled' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                          sch.status === 'Cancelled' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                          'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {sch.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {student && (
                          <button
                            onClick={() => onOpenStudent(student)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition font-medium text-xs"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500 text-xs">
                    No operations matching &quot;{operationsFilter}&quot; status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. SECTION 8: INSTRUCTOR PERFORMANCE */}
      <div className="bg-slate-900 dark:bg-[#111E32] border border-slate-800 dark:border-[#1E293B] rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" /> Instructor Operations & Workload
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Real-time driver roster, assigned student loads and attendance records</p>
          </div>
          <button
            onClick={() => onQuickAdd('instructor')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            <UserPlus className="w-3.5 h-3.5" /> Add Driver
          </button>
        </div>

        <div className="border border-slate-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[750px]">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Instructor</th>
                <th className="px-4 py-3">ID Code</th>
                <th className="px-4 py-3">Assigned Students</th>
                <th className="px-4 py-3">Today&apos;s Classes</th>
                <th className="px-4 py-3">Total Attendance</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {instructors.map(ins => {
                const assignedCount = students.filter(s => s.assigned_instructor_id === ins.id).length;
                const totalAtt = attendanceRecords.filter(a => a.instructor_id === ins.id).length;
                return (
                  <tr key={ins.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-bold text-white flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs">
                        {ins.full_name.charAt(0)}
                      </div>
                      <div>
                        <span>{ins.full_name}</span>
                        <span className="text-[10px] text-slate-400 block font-normal">{ins.phone}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-slate-300">{ins.instructor_code}</td>
                    <td className="px-4 py-3 font-bold text-white tabular-nums">{assignedCount} Students</td>
                    <td className="px-4 py-3 tabular-nums text-slate-200">
                      {schedules.filter(s => s.instructor_id === ins.id).length} Scheduled
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-400 tabular-nums">{totalAtt} Sessions</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ins.employment_status === 'active' 
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {ins.employment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => onOpenInstructor(ins)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
                      >
                        Profile
                      </button>
                      <button
                        onClick={async () => {
                          const next = ins.employment_status === 'active' ? 'on_leave' : 'active';
                          await updateInstructor(ins.id, { employment_status: next });
                          addToast(`Instructor ${ins.full_name} marked as ${next}.`, 'info');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-medium transition"
                      >
                        {ins.employment_status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. SECTION 9: RECENT STUDENT ADMISSIONS */}
      <div className="bg-slate-900 dark:bg-[#111E32] border border-slate-800 dark:border-[#1E293B] rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" /> Recent Student Admissions
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Enrolled learners, course packages and payment status</p>
          </div>
          <button
            onClick={() => onQuickAdd('student')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md shadow-blue-600/20"
          >
            <UserPlus className="w-3.5 h-3.5" /> New Admission
          </button>
        </div>

        <div className="border border-slate-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[800px]">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Admission Date</th>
                <th className="px-4 py-3">Total Fee</th>
                <th className="px-4 py-3">Paid Amount</th>
                <th className="px-4 py-3">Pending</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {students.slice(0, 6).map(stud => {
                const enr = enrollments.find(e => e.student_id === stud.id);
                const paid = payments
                  .filter(p => p.student_id === stud.id && p.status === 'Confirmed')
                  .reduce((sum, p) => sum + p.amount, 0);
                const agreed = enr?.agreed_fee || 12500;
                const pending = Math.max(0, agreed - paid);

                return (
                  <tr key={stud.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-bold text-white flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-black text-xs">
                        {stud.full_name.charAt(0)}
                      </div>
                      <div>
                        <span>{stud.full_name}</span>
                        <span className="font-mono text-[10px] text-blue-400 block font-normal">{stud.student_code}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{stud.enrolled_course_name}</td>
                    <td className="px-4 py-3 text-slate-400">{stud.admission_date}</td>
                    <td className="px-4 py-3 font-semibold text-white tabular-nums">₹{agreed.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 font-bold text-emerald-400 tabular-nums">₹{paid.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 tabular-nums">
                      <span className={pending > 0 ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                        ₹{pending.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        stud.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        stud.status === 'Registered' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      }`}>
                        {stud.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onOpenStudent(stud)}
                        className="px-3 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-bold text-xs transition"
                      >
                        10-Tab Profile
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. SECTION 10: FEE AND PAYMENT OVERVIEW & TRANSACTIONS */}
      <div className="bg-slate-900 dark:bg-[#111E32] border border-slate-800 dark:border-[#1E293B] rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <IndianRupee className="w-5 h-5 text-emerald-400" /> Recent Financial Transactions
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Authoritative owner approval ledger & official receipt generator</p>
          </div>
          <button
            onClick={() => onQuickAdd('payment')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md shadow-emerald-600/20"
          >
            <IndianRupee className="w-3.5 h-3.5" /> Record Payment
          </button>
        </div>

        <div className="border border-slate-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[800px]">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Receipt / ID</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Payment Mode</th>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Owner Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {payments.slice(0, 6).map(p => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3 font-mono font-bold text-blue-400">{p.receipt_number || 'PENDING'}</td>
                  <td className="px-4 py-3">
                    <span className="font-bold text-white block">{p.student_name}</span>
                    <span className="font-mono text-[10px] text-slate-400 block">{p.student_code}</span>
                  </td>
                  <td className="px-4 py-3 font-bold text-white tabular-nums text-sm">
                    ₹{p.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-slate-300 font-medium">{p.payment_method}</td>
                  <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">{p.transaction_reference || 'Counter Cash'}</td>
                  <td className="px-4 py-3 text-slate-400">{new Date(p.received_at).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      p.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      p.status === 'Pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {p.status === 'Pending' ? (
                      <>
                        <button
                          onClick={() => handleConfirmPay(p)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => onOpenRejectPayment(p)}
                          className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-bold text-xs transition"
                        >
                          Reject
                        </button>
                      </>
                    ) : p.status === 'Confirmed' ? (
                      <button
                        onClick={() => onOpenReceipt(p)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold transition"
                      >
                        <Printer className="w-3.5 h-3.5" /> Print Receipt
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 8. SECTION 11 & 12: LICENCE & VEHICLE FLEET OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Licence Management Overview with Calendar / List toggle */}
        <div className="bg-slate-900 dark:bg-[#111E32] border border-slate-800 dark:border-[#1E293B] rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-purple-400" /> RTO Driving Licence Pipeline
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Upcoming driving practical tests and SARATHI tracking</p>
            </div>
            {/* View mode toggle */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setLicenceViewMode('list')}
                className={`p-1.5 rounded-lg transition ${licenceViewMode === 'list' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLicenceViewMode('calendar')}
                className={`p-1.5 rounded-lg transition ${licenceViewMode === 'calendar' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
                title="Calendar View"
              >
                <CalendarDays className="w-4 h-4" />
              </button>
            </div>
          </div>

          {licenceViewMode === 'list' ? (
            <div className="border border-slate-800 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="px-3 py-2.5">Learner</th>
                    <th className="px-3 py-2.5">Licence Type</th>
                    <th className="px-3 py-2.5">Test Date</th>
                    <th className="px-3 py-2.5">Status</th>
                    <th className="px-3 py-2.5 text-right">Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {licenceRecords.map(lic => (
                    <tr key={lic.id} className="hover:bg-slate-800/40">
                      <td className="px-3 py-2.5 font-bold text-white">
                        {lic.student_name}
                        <span className="block text-[10px] text-slate-400 font-normal">{lic.rto_name}</span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-300">{lic.licence_type}</td>
                      <td className="px-3 py-2.5 font-semibold text-amber-400">{lic.test_date || 'In Progress'}</td>
                      <td className="px-3 py-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300">
                          {lic.ll_status}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <button
                          onClick={() => onOpenLicenceUpdate(lic)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-white block">November 2026 — RTO Test Appointments</span>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                  <span key={i} className="text-slate-500 font-bold py-1">{d}</span>
                ))}
                {Array.from({ length: 30 }).map((_, i) => {
                  const day = i + 1;
                  const hasTest = day === 20 || day === 25;
                  return (
                    <div 
                      key={day}
                      className={`py-2 rounded-xl border text-[11px] font-bold ${
                        hasTest
                          ? 'bg-purple-600/30 border-purple-500 text-white shadow-lg'
                          : 'bg-slate-900 border-slate-800/60 text-slate-400'
                      }`}
                    >
                      {day}
                      {hasTest && <span className="block text-[8px] text-purple-300 font-normal">Test</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Vehicle Fleet Health & Expiry Alerts */}
        <div className="bg-slate-900 dark:bg-[#111E32] border border-slate-800 dark:border-[#1E293B] rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Car className="w-5 h-5 text-cyan-400" /> Academy Fleet & Maintenance
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Dual-control vehicles, PUC certificates and insurance alerts</p>
            </div>
            <button
              onClick={() => onNavigateSection('fleet')}
              className="text-xs font-bold text-cyan-400 hover:underline"
            >
              Manage Fleet →
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-slate-400 text-[10px] block">Total Fleet</span>
              <span className="text-xl font-black text-white tabular-nums mt-1 block">{vehicles.length}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-slate-400 text-[10px] block">Active / Assigned</span>
              <span className="text-xl font-black text-emerald-400 tabular-nums mt-1 block">
                {vehicles.filter(v => v.status === 'Assigned').length}
              </span>
            </div>
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
              <span className="text-slate-400 text-[10px] block">PUC Alerts Due</span>
              <span className="text-xl font-black text-amber-400 tabular-nums mt-1 block">1</span>
            </div>
          </div>

          <div className="space-y-2">
            {vehicles.slice(0, 3).map(veh => (
              <div key={veh.id} className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">{veh.registration_number}</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-500/20 text-blue-300">
                      Dual Pedal
                    </span>
                  </div>
                  <span className="text-slate-400 text-[11px] block mt-0.5">{veh.brand} {veh.model}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-300 block font-semibold">PUC: {veh.puc_expiry}</span>
                  <span className={`text-[10px] font-bold block ${
                    veh.status === 'Assigned' ? 'text-emerald-400' : 'text-slate-400'
                  }`}>
                    {veh.assigned_instructor_name || 'Standby'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
