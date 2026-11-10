'use client';

import React, { useState } from 'react';
import { LicenceRecord, LicenceStatus } from '@/types';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { X, FileCheck2, Calendar, Award } from 'lucide-react';

interface UpdateLicenceModalProps {
  licence: LicenceRecord | null;
  onClose: () => void;
}

export const UpdateLicenceModal: React.FC<UpdateLicenceModalProps> = ({ licence, onClose }) => {
  const { updateLicenceStatus, addToast } = useDrivingSchool();
  const [status, setStatus] = useState<LicenceStatus>(licence?.ll_status || 'Application Submitted');
  const [testDate, setTestDate] = useState(licence?.test_date || '');
  const [remarks, setRemarks] = useState(licence?.remarks || '');
  const [licenceNumber, setLicenceNumber] = useState(licence?.licence_number || '');
  const [loading, setLoading] = useState(false);

  if (!licence) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateLicenceStatus(
        licence.student_id,
        status,
        testDate || undefined,
        remarks || undefined,
        licenceNumber || undefined
      );
      if (res.success) {
        addToast(`Licence status updated for ${licence.student_name}!`, 'success');
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-lg w-full border border-slate-800 shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Update RTO Driving Licence</h3>
              <p className="text-xs text-slate-400">{licence.student_name} ({licence.student_code})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">RTO Milestone / Status *</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as LicenceStatus)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
            >
              <option value="Documents Pending">Documents Pending</option>
              <option value="Application Submitted">Application Submitted</option>
              <option value="LL Test Scheduled">LL Test Scheduled</option>
              <option value="LL Approved">LL Approved</option>
              <option value="DL Application Submitted">DL Application Submitted</option>
              <option value="DL Test Scheduled">DL Test Scheduled</option>
              <option value="Test Passed">Test Passed (Driving Skill Verified)</option>
              <option value="Test Failed">Test Failed (Re-test Required)</option>
              <option value="Licence Issued">Licence Issued by RTO</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">RTO Driving Test Date</label>
              <input
                type="date"
                value={testDate}
                onChange={e => setTestDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Permanent DL Number</label>
              <input
                type="text"
                placeholder="MH-12-2026-009182"
                value={licenceNumber}
                onChange={e => setLicenceNumber(e.target.value.toUpperCase())}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Examiner / Track Notes & Remarks</label>
            <textarea
              rows={3}
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              placeholder="e.g. Reverse S-track and gradient parking completed cleanly."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 resize-none"
            />
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
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition shadow-lg shadow-purple-500/20"
            >
              {loading ? 'Updating...' : 'Save RTO Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
