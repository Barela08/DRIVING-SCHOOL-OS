'use client';

import React, { useState } from 'react';
import { Payment } from '@/types';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { X, AlertTriangle, IndianRupee } from 'lucide-react';

interface RejectPaymentModalProps {
  payment: Payment | null;
  onClose: () => void;
}

export const RejectPaymentModal: React.FC<RejectPaymentModalProps> = ({ payment, onClose }) => {
  const { rejectPayment, addToast } = useDrivingSchool();
  const [reason, setReason] = useState('UPI reference invalid or not reflected in bank statement');
  const [loading, setLoading] = useState(false);

  if (!payment) return null;

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Please specify a rejection reason.');
      return;
    }
    setLoading(true);
    try {
      await rejectPayment(payment.id, reason);
      addToast(`Payment of ₹${payment.amount.toLocaleString('en-IN')} rejected.`, 'error');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-md w-full border border-slate-800 shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Reject Payment Record</h3>
              <p className="text-xs text-slate-400">Owner Audit & Disapproval Action</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">Student:</span>
            <span className="font-bold text-white">{payment.student_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Amount:</span>
            <span className="font-bold text-rose-400 tabular-nums">₹{payment.amount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Method:</span>
            <span className="text-slate-300">{payment.payment_method}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Reference:</span>
            <span className="font-mono text-slate-400">{payment.transaction_reference || 'N/A'}</span>
          </div>
        </div>

        <form onSubmit={handleReject} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Reason for Rejection *</label>
            <select
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500 mb-2"
            >
              <option value="UPI reference invalid or not reflected in bank statement">UPI reference invalid or not reflected</option>
              <option value="Cheque bounced / returned by bank">Cheque bounced / returned by bank</option>
              <option value="Incorrect amount entered by desk staff">Incorrect amount entered by desk staff</option>
              <option value="Duplicate transaction entry">Duplicate transaction entry</option>
              <option value="Cash amount discrepancy">Cash amount discrepancy</option>
              <option value="Other">Other reason</option>
            </select>
            {reason === 'Other' && (
              <input
                type="text"
                placeholder="Enter custom rejection reason..."
                onChange={e => setReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
              />
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition shadow-lg shadow-rose-500/20"
            >
              {loading ? 'Rejecting...' : 'Confirm Disapproval'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
