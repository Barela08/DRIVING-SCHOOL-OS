'use client';

import React, { useState } from 'react';
import { 
  IndianRupee, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Send, 
  Plus, 
  ShieldCheck, 
  CreditCard, 
  FileText,
  X,
  Sparkles
} from 'lucide-react';
import { Payment, Enrollment, School } from '@/types';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';

interface StudentFeesProps {
  payments: Payment[];
  enrollment: Enrollment;
  school: School;
  onOpenReceipt: (payment: Payment) => void;
}

export const StudentFees: React.FC<StudentFeesProps> = ({
  payments,
  enrollment,
  school,
  onOpenReceipt
}) => {
  const { submitStudentPayment } = useDrivingSchool();

  // Modal state for submitting online payment proof
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Bank Transfer' | 'Cash' | 'Card'>('UPI');
  const [utrRef, setUtrRef] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Financial calculations
  const confirmedPayments = payments.filter(p => p.status === 'Confirmed');
  const totalPaid = confirmedPayments.reduce((sum, p) => sum + p.amount, 0);
  const outstandingBalance = Math.max(0, enrollment.agreed_fee - totalPaid);

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setSubmitMessage({ type: 'error', text: 'Please enter a valid payment amount.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const res = await submitStudentPayment({
        enrollmentId: enrollment.id,
        studentId: enrollment.student_id,
        amount: numAmount,
        paymentMethod,
        transactionReference: utrRef.trim() || undefined,
        notes: notes.trim() || undefined
      });

      setIsSubmitting(false);
      if (res.success) {
        setSubmitMessage({ type: 'success', text: res.message });
        setAmount('');
        setUtrRef('');
        setNotes('');
        setTimeout(() => {
          setIsSubmitModalOpen(false);
          setSubmitMessage(null);
        }, 1800);
      } else {
        setSubmitMessage({ type: 'error', text: res.message });
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setSubmitMessage({ type: 'error', text: err?.message || 'Failed to submit payment.' });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Agreed Course Fee */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
            Total Agreed Course Fee
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums">
            ₹{enrollment.agreed_fee.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Includes 20 sessions & RTO documentation</p>
        </div>

        {/* Total Confirmed Payments */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
            Confirmed Payments (Paid)
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
            ₹{totalPaid.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            {confirmedPayments.length} Official Confirmed Receipts
          </p>
        </div>

        {/* Outstanding Balance */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
            Outstanding Pending Balance
          </span>
          <div className={`text-2xl sm:text-3xl font-black tabular-nums ${outstandingBalance > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            ₹{outstandingBalance.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {outstandingBalance > 0 ? 'Installment due prior to DL test slot' : 'Full course fees settled'}
          </p>
        </div>
      </div>

      {/* Installment Structure & Online Payment Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Course Installment Plan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Academy approved 2-part milestone payment breakdown.
            </p>
          </div>

          {outstandingBalance > 0 && (
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/20 flex items-center gap-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" /> Submit Payment Slip / UTR
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-emerald-800 dark:text-emerald-300">
                1st Installment (Admission Down Payment)
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">
                CLEARED
              </span>
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
              ₹5,000
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Paid at enrollment counter via UPI. Receipt #RCP-2026-00042 issued.
            </p>
          </div>

          <div className={`p-4 rounded-2xl border space-y-2 ${
            outstandingBalance > 0
              ? 'bg-amber-500/10 border-amber-500/30'
              : 'bg-emerald-500/10 border-emerald-500/30'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`font-bold text-xs ${outstandingBalance > 0 ? 'text-amber-800 dark:text-amber-300' : 'text-emerald-800 dark:text-emerald-300'}`}>
                2nd Installment (Final Balance)
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${outstandingBalance > 0 ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'}`}>
                {outstandingBalance > 0 ? 'PENDING' : 'CLEARED'}
              </span>
            </div>
            <div className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
              ₹{outstandingBalance > 0 ? outstandingBalance.toLocaleString('en-IN') : '0'}
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              {outstandingBalance > 0 
                ? 'Mandatory clearance required before RTO practical test slot scheduling.' 
                : 'All dues cleared. RTO dispatch approved.'}
            </p>
          </div>
        </div>
      </div>

      {/* Transaction History & Receipts Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Official Transaction Ledger & Receipts
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Only confirmed payments count towards your official balance. Receipts contain academy digital seal.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
            {payments.length} Transactions
          </span>
        </div>

        {payments.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No transactions recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-3 px-3">Date & Time</th>
                  <th className="py-3 px-3">Transaction Reference</th>
                  <th className="py-3 px-3">Payment Method</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {payments.map((pay) => {
                  const isConfirmed = pay.status === 'Confirmed';
                  return (
                    <tr key={pay.id} className="hover:bg-slate-50 dark:hover:bg-[#0B1728]/50 transition">
                      <td className="py-3.5 px-3 font-mono text-slate-600 dark:text-slate-400">
                        {new Date(pay.received_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>

                      <td className="py-3.5 px-3 font-mono font-medium text-slate-800 dark:text-slate-200">
                        {pay.transaction_reference || pay.id}
                        {pay.notes && (
                          <span className="block text-[10px] text-slate-400 font-sans mt-0.5">
                            {pay.notes}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {pay.payment_method}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white tabular-nums text-sm">
                        ₹{pay.amount.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-3">
                        {isConfirmed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" /> Confirmed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                            <Clock className="w-3 h-3" /> Pending Verification
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        {isConfirmed && pay.receipt_number ? (
                          <button
                            onClick={() => onOpenReceipt(pay)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-bold transition text-xs"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>{pay.receipt_number}</span>
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Awaiting Desk</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Submit Payment Proof Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full bg-white dark:bg-[#111E32] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E5EAF1] dark:border-[#1E293B] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Submit Fee Payment Slip
              </h3>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitMessage && (
              <div className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 ${
                submitMessage.type === 'success' 
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400'
              }`}>
                {submitMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{submitMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmitProof} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Payment Amount (INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    required
                    min="100"
                    max={outstandingBalance || 10000}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder={String(outstandingBalance || 3500)}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e: any) => setPaymentMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="UPI">UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="Bank Transfer">Bank Transfer (NEFT / IMPS)</option>
                  <option value="Cash">Cash Handed at Front Desk</option>
                  <option value="Card">Debit / Credit Card</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  UPI UTR / Bank Reference Number
                </label>
                <input
                  type="text"
                  required
                  value={utrRef}
                  onChange={(e) => setUtrRef(e.target.value)}
                  placeholder="e.g. UPI/20261110/9821820"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Notes / Installment Details
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. 2nd Installment payment prior to DL test"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white font-bold text-xs transition shadow-md shadow-blue-600/20"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};