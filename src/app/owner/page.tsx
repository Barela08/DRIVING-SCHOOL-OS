'use client';

import React, { useState } from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { 
  ShieldCheck, 
  Users, 
  Car, 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  TrendingUp, 
  FileCheck2, 
  Wrench, 
  History, 
  Settings, 
  Search, 
  Printer, 
  Filter, 
  Sparkles, 
  AlertTriangle,
  Award,
  ChevronRight,
  UserPlus,
  BookOpen
} from 'lucide-react';
import { ReceiptModal } from '@/components/ReceiptModal';
import { Payment } from '@/types';

export default function OwnerDashboard() {
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
    auditLogs,
    confirmPayment 
  } = useDrivingSchool();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'students' | 'instructors' | 'attendance' | 'finances' | 'licences' | 'fleet' | 'audit' | 'courses'
  >('overview');

  const [searchStudent, setSearchStudent] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);

  // Financial calculations
  const totalRevenue = payments
    .filter(p => p.status === 'Confirmed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayments = payments.filter(p => p.status === 'Pending');
  const pendingRevenue = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

  const totalAgreedFees = enrollments.reduce((sum, e) => sum + e.agreed_fee, 0);
  const outstandingFeesTotal = Math.max(0, totalAgreedFees - totalRevenue);

  // Today's classes & attendance
  const [todayDate, setTodayDate] = useState('2026-11-10');
  React.useEffect(() => {
    setTodayDate(new Date().toISOString().split('T')[0]);
  }, []);
  const todayAttendance = attendanceRecords.filter(a => a.attendance_date === todayDate);

  // Upcoming RTO tests
  const upcomingTests = licenceRecords.filter(l => l.ll_status === 'DL Test Scheduled' || l.test_date);

  // Vehicles needing attention (PUC / Insurance expiring within 60 days)
  const expiringVehicles = vehicles.filter(v => v.puc_expiry && new Date(v.puc_expiry) < new Date('2027-01-01'));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-slate-900 border border-purple-500/30 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white">{school.name} — Owner Console</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Super Admin
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-Time School Analytics • Financial Audit • Instructor Performance • Fleet Health • RTO Milestones
          </p>
        </div>

        {/* Quick School Meta */}
        <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-2xl text-xs">
          <div>
            <span className="text-slate-400 text-[10px] block">RTO License:</span>
            <span className="font-mono font-bold text-amber-400">{school.rto_registration_no}</span>
          </div>
          <div className="border-l border-slate-800 pl-4">
            <span className="text-slate-400 text-[10px] block">Branches:</span>
            <span className="font-bold text-white">{branches.length} Active Centers</span>
          </div>
        </div>
      </div>

      {/* Owner Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-semibold overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'overview' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" /> Executive KPI Overview
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'attendance' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> Live Attendance Feed ({attendanceRecords.length})
        </button>
        <button
          onClick={() => setActiveTab('finances')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'finances' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <IndianRupee className="w-3.5 h-3.5" /> Financials & Collections
          {pendingPayments.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-slate-950 font-bold">
              {pendingPayments.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('students')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'students' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" /> All Students ({students.length})
        </button>
        <button
          onClick={() => setActiveTab('instructors')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'instructors' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5" /> Instructors & Staff ({instructors.length})
        </button>
        <button
          onClick={() => setActiveTab('licences')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'licences' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" /> RTO Licences ({licenceRecords.length})
        </button>
        <button
          onClick={() => setActiveTab('fleet')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'fleet' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <Car className="w-3.5 h-3.5" /> Fleet & Vehicles ({vehicles.length})
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'courses' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> Courses & Modules ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 shrink-0 ${
            activeTab === 'audit' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white bg-slate-900'
          }`}
        >
          <History className="w-3.5 h-3.5" /> Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: EXECUTIVE KPI OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Total Revenue Collected</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <IndianRupee className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white">₹{totalRevenue.toLocaleString('en-IN')}</div>
              <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <span>Verified in Bank / Cash Ledger</span>
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Outstanding Dues</span>
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-amber-400">₹{outstandingFeesTotal.toLocaleString('en-IN')}</div>
              <p className="text-[11px] text-slate-400">
                Pending balance from active enrollments
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>Active Learners</span>
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white">{students.filter(s => s.status === 'Active').length}</div>
              <p className="text-[11px] text-slate-400">
                {students.length} Total Enrolled ({instructors.length} Instructors)
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-2">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span>RTO Tests Due</span>
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <FileCheck2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-purple-400">{upcomingTests.length}</div>
              <p className="text-[11px] text-slate-400">
                Learner / Driving test appointments
              </p>
            </div>
          </div>

          {/* Quick Insights Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Driving Sessions Feed */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Recent Verified Driving Attendance
                </h3>
                <span className="text-xs text-slate-400 font-mono">Live Stream</span>
              </div>

              <div className="space-y-2.5">
                {attendanceRecords.slice(0, 4).map(att => (
                  <div key={att.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{att.student_name}</span>
                        <span className="font-mono text-[10px] text-slate-400">({att.student_code})</span>
                      </div>
                      <span className="text-[11px] text-slate-300 block mt-0.5">{att.session_name}</span>
                      <span className="text-[10px] text-slate-500 block">Instructor: {att.instructor_name}</span>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                        {att.status}
                      </span>
                      <span className="block text-[10px] text-slate-500 font-mono mt-1">
                        {new Date(att.marked_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Payments Needing Owner Approval */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <IndianRupee className="w-4 h-4 text-amber-400" /> Pending Payment Confirmations
                </h3>
                <span className="text-xs font-bold text-amber-400 font-mono">₹{pendingRevenue.toLocaleString('en-IN')} pending</span>
              </div>

              {pendingPayments.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  All recorded payments are confirmed and receipts issued!
                </div>
              ) : (
                <div className="space-y-2.5">
                  {pendingPayments.map(pay => (
                    <div key={pay.id} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{pay.student_name}</span>
                          <span className="text-emerald-400 font-bold font-mono">₹{pay.amount.toLocaleString('en-IN')}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Mode: {pay.payment_method} • {pay.notes || 'Course fee'}
                        </span>
                      </div>

                      <button
                        onClick={async () => {
                          const res = await confirmPayment(pay.id);
                          if (res.success) {
                            alert(`Confirmed! Receipt #${res.receiptNumber} generated.`);
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md shadow-emerald-600/20"
                      >
                        Approve & Issue Receipt
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE ATTENDANCE FEED */}
      {activeTab === 'attendance' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Complete School Attendance Audit Trail
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Every record is timestamped by the server and tied to an instructor & vehicle.
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30">
              Total Recorded: {attendanceRecords.length} Sessions
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Student Name & Code</th>
                  <th className="px-4 py-3">Session Category</th>
                  <th className="px-4 py-3">Instructor</th>
                  <th className="px-4 py-3">Vehicle</th>
                  <th className="px-4 py-3">Instructor Remarks</th>
                  <th className="px-4 py-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/60 text-slate-300">
                {attendanceRecords.map(att => (
                  <tr key={att.id} className="hover:bg-slate-850/60 transition">
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-white block">{att.student_name}</span>
                      <span className="font-mono text-[10px] text-blue-400">{att.student_code}</span>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-200">{att.session_name}</td>
                    <td className="px-4 py-3.5">{att.instructor_name}</td>
                    <td className="px-4 py-3.5 font-mono text-slate-400">{att.vehicle_info || 'Assigned Car'}</td>
                    <td className="px-4 py-3.5 italic text-slate-400">{att.remarks || '—'}</td>
                    <td className="px-4 py-3.5 text-right font-mono text-slate-400">
                      {new Date(att.marked_at).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: FINANCIALS & COLLECTIONS */}
      {activeTab === 'finances' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-emerald-400" /> Financial Ledger & Revenue Reconciliation
              </h2>
              <p className="text-xs text-slate-400">Total Confirmed Collections: ₹{totalRevenue.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Receipt No</th>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Mode</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Confirmed By</th>
                  <th className="px-4 py-3 text-right">Official Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/60 text-slate-300">
                {payments.map(pay => (
                  <tr key={pay.id} className="hover:bg-slate-850/60 transition">
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-300">
                      {pay.receipt_number || 'PENDING APPROVAL'}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-semibold text-white block">{pay.student_name}</span>
                      <span className="text-[10px] font-mono text-slate-500">{pay.student_code}</span>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-emerald-400 text-sm">
                      ₹{pay.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3.5">{pay.payment_method}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        pay.status === 'Confirmed'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      }`}>
                        {pay.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-400">{pay.confirmed_by || 'Awaiting Owner'}</td>
                    <td className="px-4 py-3.5 text-right">
                      {pay.receipt_number ? (
                        <button
                          onClick={() => setSelectedReceipt(pay)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 text-[11px] inline-flex items-center gap-1 font-medium transition"
                        >
                          <Printer className="w-3 h-3" /> View Receipt
                        </button>
                      ) : (
                        <button
                          onClick={async () => {
                            await confirmPayment(pay.id);
                          }}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition"
                        >
                          Confirm & Issue
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

      {/* TAB 4: STUDENTS LIST */}
      {activeTab === 'students' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" /> Student Master Database ({students.length})
            </h2>
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                placeholder="Search by code, name or phone..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Instructor</th>
                  <th className="px-4 py-3">Completed Sessions</th>
                  <th className="px-4 py-3">Fee Balance</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/60 text-slate-300">
                {students
                  .filter(s => 
                    s.student_code.toLowerCase().includes(searchStudent.toLowerCase()) ||
                    s.full_name.toLowerCase().includes(searchStudent.toLowerCase())
                  )
                  .map(stud => {
                    const enr = enrollments.find(e => e.student_id === stud.id);
                    const paid = payments
                      .filter(p => p.student_id === stud.id && p.status === 'Confirmed')
                      .reduce((sum, p) => sum + p.amount, 0);
                    const due = enr ? Math.max(0, enr.agreed_fee - paid) : 0;

                    return (
                      <tr key={stud.id} className="hover:bg-slate-850/60 transition">
                        <td className="px-4 py-3.5 font-mono font-bold text-purple-400">{stud.student_code}</td>
                        <td className="px-4 py-3.5">
                          <span className="font-bold text-white block">{stud.full_name}</span>
                          <span className="text-[10px] text-slate-500">{stud.phone}</span>
                        </td>
                        <td className="px-4 py-3.5">{stud.enrolled_course_name}</td>
                        <td className="px-4 py-3.5">{stud.assigned_instructor_name || 'Unassigned'}</td>
                        <td className="px-4 py-3.5 font-bold text-emerald-400">
                          {enr ? `${enr.completed_sessions} / ${enr.total_sessions}` : '0'}
                        </td>
                        <td className="px-4 py-3.5">
                          {due > 0 ? (
                            <span className="text-amber-400 font-bold">₹{due.toLocaleString('en-IN')} Due</span>
                          ) : (
                            <span className="text-emerald-400 font-bold">Cleared</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            {stud.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: INSTRUCTORS & PERFORMANCE */}
      {activeTab === 'instructors' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" /> Instructor Roster & Daily Performance
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {instructors.map(ins => (
              <div key={ins.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-sm">
                      {ins.full_name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{ins.full_name}</h4>
                      <span className="font-mono text-xs text-emerald-400 font-semibold">{ins.instructor_code}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                    {ins.employment_status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80 text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Assigned Car:</span>
                    <span>{ins.assigned_vehicle_name || 'None'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Experience:</span>
                    <span>{ins.experience_years} Years</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Active Students:</span>
                    <span className="font-bold text-white">{ins.active_students_count} Learners</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Today's Sessions:</span>
                    <span className="font-bold text-emerald-400">{ins.today_sessions_count} Classes Completed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: RTO LICENCES */}
      {activeTab === 'licences' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-blue-400" /> RTO Learning & Driving Licence Pipeline
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Licence Category</th>
                  <th className="px-4 py-3">Current RTO Stage</th>
                  <th className="px-4 py-3">Test Date & Center</th>
                  <th className="px-4 py-3 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/60 text-slate-300">
                {licenceRecords.map(lic => (
                  <tr key={lic.id} className="hover:bg-slate-850/60 transition">
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-white block">{lic.student_name}</span>
                      <span className="font-mono text-[10px] text-blue-400">{lic.student_code}</span>
                    </td>
                    <td className="px-4 py-3.5 font-medium">{lic.licence_type}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                        {lic.ll_status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-white block">{lic.test_date || 'Awaiting slot'}</span>
                      <span className="text-[10px] text-slate-500">{lic.rto_name}</span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-bold">
                      {lic.test_result === 'Passed' ? (
                        <span className="text-emerald-400">PASSED</span>
                      ) : lic.test_result === 'Failed' ? (
                        <span className="text-rose-400">FAILED</span>
                      ) : (
                        <span className="text-slate-500">PENDING TEST</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: FLEET & VEHICLES */}
      {activeTab === 'fleet' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Car className="w-4 h-4 text-amber-400" /> Academy Fleet & Dual-Control Cars
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vehicles.map(v => (
              <div key={v.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">{v.brand} {v.model}</h4>
                    <span className="font-mono text-xs text-amber-400 font-bold">{v.registration_number}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    v.status === 'Assigned' 
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                  }`}>
                    {v.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800 text-slate-400">
                  <div>
                    <span>Dual Control: </span>
                    <strong className="text-white">{v.is_dual_control ? 'Yes (Govt RTO Approved)' : 'No'}</strong>
                  </div>
                  <div>
                    <span>Driver Assigned: </span>
                    <strong className="text-white">{v.assigned_instructor_name || 'None'}</strong>
                  </div>
                  <div>
                    <span>Insurance Expiry: </span>
                    <strong className="text-slate-300 font-mono">{v.insurance_expiry || '—'}</strong>
                  </div>
                  <div>
                    <span>PUC Expiry: </span>
                    <strong className="text-amber-400 font-mono">{v.puc_expiry || '—'}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: COURSES & CURRICULUM */}
      {activeTab === 'courses' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-400" /> Driving Courses & Session Category Templates
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {courses.map(c => (
              <div key={c.id} className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 uppercase">
                      Category {c.category}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1">{c.name}</h3>
                    <p className="text-xs text-slate-400">{c.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-emerald-400">₹{c.price.toLocaleString('en-IN')}</span>
                    <span className="block text-[11px] text-slate-500">{c.duration_days} Days Duration</span>
                  </div>
                </div>

                {c.templates && c.templates.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-slate-800">
                    <span className="text-xs font-semibold text-slate-300 block">
                      Allocated Session Modules ({c.templates.reduce((acc, t) => acc + t.total_sessions, 0)} Total Driving Classes):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {c.templates.map(t => (
                        <div key={t.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-xs flex items-center justify-between">
                          <span className="truncate max-w-[170px] text-slate-300">{t.session_name}</span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 font-bold text-emerald-400 text-[10px]">
                            {t.total_sessions} Class{t.total_sessions > 1 ? 'es' : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: IMMUTABLE AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-amber-400" /> Immutable System Audit Trail
              </h2>
              <p className="text-xs text-slate-400">Logs every attendance mark, fee receipt, and student mutation.</p>
            </div>
            <span className="text-xs font-mono text-slate-400">{auditLogs.length} Events Logged</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Actor</th>
                  <th className="px-4 py-3">Action Type</th>
                  <th className="px-4 py-3">Entity</th>
                  <th className="px-4 py-3">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/60 text-slate-300">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-850/60 transition">
                    <td className="px-4 py-3.5 font-mono text-slate-400">
                      {new Date(log.created_at).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-white">{log.actor_name}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-800 text-amber-300 border border-slate-700">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-400 font-mono">{log.entity_type}</td>
                    <td className="px-4 py-3.5 text-slate-300">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Official Receipt Modal */}
      <ReceiptModal 
        payment={selectedReceipt} 
        school={school} 
        onClose={() => setSelectedReceipt(null)} 
      />
    </div>
  );
}
