'use client';

import React from 'react';
import { Payment, School } from '@/types';
import { Printer, X, CheckCircle, ShieldCheck } from 'lucide-react';

interface ReceiptModalProps {
  payment: Payment | null;
  school: School;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ payment, school, onClose }) => {
  if (!payment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white text-slate-900 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200">
        {/* Controls - Hidden during print */}
        <div className="flex justify-end gap-2 mb-4 no-print">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition shadow-md"
          >
            <Printer className="w-4 h-4" /> Print Receipt
          </button>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Official Printable Receipt Content */}
        <div className="receipt-box border border-slate-300 rounded-xl p-6 bg-slate-50/50">
          {/* Header */}
          <div className="text-center border-b border-slate-200 pb-4 mb-5">
            {school.logo_url && <img src={school.logo_url} alt={`${school.name} logo`} className="w-16 h-16 object-contain mx-auto mb-2" />}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <CheckCircle className="w-3.5 h-3.5" /> OFFICIAL PAYMENT RECEIPT
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">{school.name}</h2>
            <p className="text-xs text-slate-600 mt-0.5">{school.tagline}</p>
            <p className="text-xs text-slate-500 mt-1">
              {school.address.street}, {school.address.city}, {school.address.state} - {school.address.pincode}
            </p>
            <p className="text-xs font-semibold text-slate-700 mt-1">
              RTO Reg No: <span className="text-slate-900">{school.rto_registration_no}</span> | Phone: {school.contact_phone}
            </p>
          </div>

          {/* Receipt Meta */}
          <div className="grid grid-cols-2 gap-3 text-xs border-b border-slate-200 pb-4 mb-4">
            <div>
              <span className="text-slate-500 block">Receipt No:</span>
              <span className="font-bold text-slate-900 text-sm">{payment.receipt_number || 'RCP-PENDING'}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Date & Time:</span>
              <span className="font-medium text-slate-800">
                {new Date(payment.received_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Student Name:</span>
              <span className="font-bold text-slate-900">{payment.student_name}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Student Code:</span>
              <span className="font-mono font-bold text-blue-700">{payment.student_code}</span>
            </div>
          </div>

          {/* Payment Line Item Table */}
          <div className="border border-slate-200 rounded-lg overflow-hidden mb-5">
            <table className="w-full text-xs">
              <thead className="bg-slate-100 text-slate-700 uppercase font-semibold">
                <tr>
                  <th className="px-3 py-2 text-left">Description</th>
                  <th className="px-3 py-2 text-center">Payment Mode</th>
                  <th className="px-3 py-2 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                <tr>
                  <td className="px-3 py-3">
                    <span className="font-semibold text-slate-800">Driving Course Tuition & Training Fee</span>
                    <span className="block text-[11px] text-slate-500 mt-0.5">
                      {payment.notes || 'Course Installment payment'}
                    </span>
                    {payment.transaction_reference && (
                      <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                        Ref: {payment.transaction_reference}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-medium">
                      {payment.payment_method}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right font-bold text-slate-900 text-sm">
                    ₹{payment.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                <tr>
                  <td colSpan={2} className="px-3 py-2.5 text-right text-slate-700">Total Received:</td>
                  <td className="px-3 py-2.5 text-right text-slate-900 text-base text-emerald-700">
                    ₹{payment.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer & Signature */}
          <div className="flex items-end justify-between pt-4 border-t border-slate-200 text-xs">
            <div className="text-slate-500 text-[11px]">
              <div className="flex items-center gap-1 text-slate-700 font-semibold mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> System Verified Transaction
              </div>
              <span>Confirmed By: {payment.confirmed_by || 'Staff Desk'}</span>
              <p className="text-[10px] text-slate-400 mt-1">This is a computer-generated official receipt.</p>
            </div>
            <div className="text-center">
              <div className="w-28 border-b border-slate-400 mb-1"></div>
              <span className="text-[10px] uppercase font-semibold text-slate-500">Authorized Signatory</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
