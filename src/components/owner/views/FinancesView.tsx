'use client';

import React, { useState } from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { Payment } from '@/types';
import { IndianRupee, Printer, Plus, Check, X, Search, Filter, AlertTriangle, ShieldCheck } from 'lucide-react';

interface FinancesViewProps {
  onOpenReceipt: (payment: Payment) => void;
  onOpenRejectPayment: (payment: Payment) => void;
  onQuickAdd: (type: any) => void;
}

export const FinancesView: React.FC<FinancesViewProps> = ({
  onOpenReceipt,
  onOpenRejectPayment,
  onQuickAdd
}) => {
  const { payments, enrollments, confirmPayment, addToast } = useDrivingSchool();

  const [statusFilter, setStatusFilter] = useState<'all' | 'Confirmed' | 'Pending' | 'Rejected'>('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Calculations
  const totalAgreedFees = enrollments.reduce((sum, e) => sum + e.agreed_fee, 0);
  const confirmedCollections = payments
    .filter(p => p.status === 'Confirmed')
    .reduce((sum, p) => sum + p.amount, 0);
  const outstandingBalance = Math.max(0, totalAgreedFees - confirmedCollections);

  const pendingPayments = payments.filter(p => p.status === 'Pending');
  const pendingTotal = pendingPayments.reduce((sum, p) => sum + p.amount, 0);

  const filtered = payments.filter(p => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || p.payment_method === methodFilter;
    const matchesSearch = 
      p.student_name.toLowerCase().includes(search.toLowerCase()) ||
      p.student_code.toLowerCase().includes(search.toLowerCase()) ||
      (p.receipt_number && p.receipt_number.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesMethod && matchesSearch;
  });

  const handleConfirm = async (p: Payment) => {
    const res = await confirmPayment(p.id);
    if (res.success) {
      addToast(`Payment of ₹${p.amount.toLocaleString('en-IN')} confirmed! Receipt #${res.receiptNumber}`, 'success');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <IndianRupee className="w-6 h-6 text-emerald-400" /> Fees & Payment Financial Ledger
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Authoritative owner payment confirmation, cash/UPI audits, and instant GST receipt printing.
          </p>
        </div>
        <button
          onClick={() => onQuickAdd('payment')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-600/20 self-start sm:self-center"
        >
          <IndianRupee className="w-4 h-4" /> Record New Payment
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400 font-medium block">Total Agreed Course Fees</span>
          <div className="text-2xl font-black text-white mt-1 tabular-nums">
            ₹{totalAgreedFees.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-500 block mt-1">Signed contracts</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400 font-medium block">Confirmed Collections</span>
          <div className="text-2xl font-black text-emerald-400 mt-1 tabular-nums">
            ₹{confirmedCollections.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-emerald-400/80 font-bold block mt-1">
            {Math.round((confirmedCollections / (totalAgreedFees || 1)) * 100)}% Realized
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400 font-medium block">Outstanding Dues</span>
          <div className="text-2xl font-black text-amber-400 mt-1 tabular-nums">
            ₹{outstandingBalance.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-amber-400/80 font-bold block mt-1">Active balances</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-xs text-slate-400 font-medium block">Awaiting Owner Approval</span>
          <div className="text-2xl font-black text-blue-400 mt-1 tabular-nums">
            ₹{pendingTotal.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-blue-300 font-bold block mt-1">
            {pendingPayments.length} Pending Records
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by student, student code, receipt #..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Payment Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending Confirmation</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={methodFilter}
            onChange={e => setMethodFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Methods</option>
            <option value="UPI">UPI</option>
            <option value="Cash">Cash Counter</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Card">Card</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[850px]">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3.5">Receipt #</th>
                <th className="px-4 py-3.5">Student Learner</th>
                <th className="px-4 py-3.5">Amount</th>
                <th className="px-4 py-3.5">Method</th>
                <th className="px-4 py-3.5">Reference ID</th>
                <th className="px-4 py-3.5">Date & Time</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Owner Authority Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3.5 font-mono font-bold text-blue-400">{p.receipt_number || 'PENDING'}</td>
                  <td className="px-4 py-3.5">
                    <span className="font-bold text-white block">{p.student_name}</span>
                    <span className="font-mono text-[10px] text-slate-400 block">{p.student_code}</span>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-white tabular-nums text-sm">
                    ₹{p.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-300">{p.payment_method}</td>
                  <td className="px-4 py-3.5 font-mono text-slate-400 text-[11px]">{p.transaction_reference || 'N/A'}</td>
                  <td className="px-4 py-3.5 text-slate-400">
                    {new Date(p.received_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      p.status === 'Confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      p.status === 'Pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right space-x-2">
                    {p.status === 'Pending' ? (
                      <>
                        <button
                          onClick={() => handleConfirm(p)}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                        >
                          Confirm & Issue
                        </button>
                        <button
                          onClick={() => onOpenRejectPayment(p)}
                          className="px-3 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-bold text-xs transition"
                        >
                          Reject
                        </button>
                      </>
                    ) : p.status === 'Confirmed' ? (
                      <button
                        onClick={() => onOpenReceipt(p)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs transition"
                      >
                        <Printer className="w-3.5 h-3.5" /> Print Receipt
                      </button>
                    ) : (
                      <span className="text-slate-500 text-xs italic">Rejected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
