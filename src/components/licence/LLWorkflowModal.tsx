'use client';

import React, { useState } from 'react';
import { LicenceRecord, LicenceStatus, Student } from '@/types';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { 
  X, 
  FileCheck2, 
  Calendar, 
  ExternalLink, 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck,
  FileText
} from 'lucide-react';
import { OFFICIAL_PARIVAHAN_URL } from '@/lib/llTrackingEngine';

interface LLWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  licenceRecord?: LicenceRecord;
}

export const LLWorkflowModal: React.FC<LLWorkflowModalProps> = ({
  isOpen,
  onClose,
  student,
  licenceRecord
}) => {
  const { updateLLApplicationWorkflow, currentUser } = useDrivingSchool();

  const [status, setStatus] = useState<LicenceStatus>(
    licenceRecord?.ll_status || 'Application Started'
  );
  const [appNumber, setAppNumber] = useState(
    licenceRecord?.application_number || licenceRecord?.ll_reference || ''
  );
  const [appDate, setAppDate] = useState(
    licenceRecord?.ll_application_date || '2026-11-10'
  );
  const [testDate, setTestDate] = useState(licenceRecord?.test_date || '');
  const [approvalDate, setApprovalDate] = useState(
    licenceRecord?.approval_date || licenceRecord?.ll_issue_date || '2026-11-10'
  );
  const [uploadedDocName, setUploadedDocName] = useState(
    licenceRecord?.ll_document_name || ''
  );
  const [uploadedDocUrl, setUploadedDocUrl] = useState(
    licenceRecord?.ll_document_url || ''
  );
  const [auditReason, setAuditReason] = useState('');
  const [remarks, setRemarks] = useState(licenceRecord?.remarks || '');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedDocName(file.name);
      setUploadedDocUrl(URL.createObjectURL(file));
      if (status === 'Not Applied' || status === 'Reminder Sent') {
        setStatus('Document Uploaded');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateLLApplicationWorkflow({
        studentId: student.id,
        newStatus: status,
        applicationNumber: appNumber || undefined,
        applicationDate: (status === 'Application Submitted' || status === 'Application Started' || appNumber) ? appDate : undefined,
        testDate: status === 'Test Scheduled' ? testDate : undefined,
        approvalDate: status === 'Approved' ? approvalDate : undefined,
        documentFile: uploadedDocUrl || undefined,
        documentName: uploadedDocName || undefined,
        remarks: remarks || undefined,
        auditReason: auditReason || `Status transition to ${status} by ${currentUser.full_name}`
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const isStaffOrOwner = currentUser.role === 'owner' || currentUser.role === 'staff';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-slate-100 space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Update Learning Licence Application
              </h3>
              <p className="text-xs text-slate-400">
                {student.full_name} ({student.student_code})
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Parivahan Shortcut Link */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Apply online or check test results on Sarathi Parivahan</span>
          </div>
          <a
            href={OFFICIAL_PARIVAHAN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-blue-400 hover:text-blue-300 underline inline-flex items-center gap-1 shrink-0 ml-2"
          >
            Portal <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Workflow Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Status Select */}
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold block">
              Application Workflow Milestone *
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as LicenceStatus)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500 font-medium"
            >
              <option value="Not Applied">Not Applied (Automatic tracking in progress)</option>
              <option value="Reminder Sent">Reminder Sent (Threshold achieved)</option>
              <option value="Application Started">Application Started (Draft on Sarathi)</option>
              <option value="Application Submitted">Application Submitted (Fee paid & docs uploaded)</option>
              <option value="Test Scheduled">Test Scheduled (Slot confirmed)</option>
              <option value="Document Uploaded">Document Uploaded (Awaiting verification)</option>
              <option value="Approved">Approved (LL issued & verified)</option>
              <option value="Rejected">Rejected (Correction / Re-test required)</option>
              {isStaffOrOwner && (
                <option value="Already Available">Already Available (Exempt from application)</option>
              )}
            </select>
          </div>

          {/* Conditional Guidance Note for Approved */}
          {status === 'Approved' && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Marking <strong>Approved</strong> automatically halts all future LL application reminders for this student and initiates 6-month validity tracking.
              </span>
            </div>
          )}

          {/* Application Number (e.g. Parivahan Reference) */}
          {['Application Started', 'Application Submitted', 'Test Scheduled', 'Approved', 'Document Uploaded'].includes(status) && (
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">
                Sarathi Application / Reference Number
              </label>
              <input
                type="text"
                placeholder="e.g. MH12/LL/2026/099182"
                value={appNumber}
                onChange={e => setAppNumber(e.target.value.toUpperCase())}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          )}

          {/* Dates Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Application Date */}
            {['Application Submitted', 'Application Started', 'Test Scheduled', 'Approved'].includes(status) && (
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">
                  Application Submission Date
                </label>
                <input
                  type="date"
                  value={appDate}
                  onChange={e => setAppDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            {/* Test Date */}
            {status === 'Test Scheduled' && (
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">
                  Scheduled LL Test Date *
                </label>
                <input
                  type="date"
                  required
                  value={testDate}
                  onChange={e => setTestDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            {/* Approval Date */}
            {status === 'Approved' && (
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold block">
                  LL Approval Date *
                </label>
                <input
                  type="date"
                  required
                  value={approvalDate}
                  onChange={e => setApprovalDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            )}
          </div>

          {/* Document Upload */}
          <div className="space-y-1.5 pt-1">
            <label className="text-slate-300 font-semibold block">
              Upload LL Document or Screenshot (Optional)
            </label>
            {uploadedDocName ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200">
                <div className="flex items-center gap-2 truncate">
                  <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="truncate font-mono">{uploadedDocName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => { setUploadedDocName(''); setUploadedDocUrl(''); }}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-700 bg-slate-950/40 hover:bg-slate-950 hover:border-amber-500/50 cursor-pointer transition">
                <Upload className="w-4 h-4 text-slate-400" />
                <span className="text-slate-300">Click to upload LL file (PDF / JPG)</span>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Remarks & Audit Reason */}
          <div className="space-y-1">
            <label className="text-slate-300 font-semibold block">
              Remarks / Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Test slot booked at Alandi RTO, slot 10:30 AM"
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          {isStaffOrOwner && (
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">
                Audit Reason for Correction (Saved to immutable audit log)
              </label>
              <input
                type="text"
                placeholder="e.g. Verified original physical LL copy at front desk"
                value={auditReason}
                onChange={e => setAuditReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Save & Update Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
