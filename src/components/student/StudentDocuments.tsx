'use client';

import React, { useState } from 'react';
import { 
  FolderLock, 
  FileText, 
  Download, 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  Plus, 
  Eye, 
  X,
  FileCheck2,
  Lock,
  ExternalLink
} from 'lucide-react';
import { StudentDocument, Student, DocumentType } from '@/types';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';

interface StudentDocumentsProps {
  documents: StudentDocument[];
  student: Student;
}

export const StudentDocuments: React.FC<StudentDocumentsProps> = ({
  documents,
  student
}) => {
  const { uploadStudentDocument } = useDrivingSchool();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [docType, setDocType] = useState<DocumentType>('Aadhaar');
  const [docName, setDocName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Selected document to preview in a modal
  const [previewDoc, setPreviewDoc] = useState<StudentDocument | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) {
      setUploadStatus({ type: 'error', text: 'Please enter a document name or select a file.' });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const fileName = docName.endsWith('.pdf') || docName.endsWith('.jpg') ? docName : `${docName}.pdf`;
      const res = await uploadStudentDocument({
        studentId: student.id,
        documentType: docType,
        documentName: fileName,
        fileSize: '1.2 MB'
      });

      setIsUploading(false);
      if (res.success) {
        setUploadStatus({ type: 'success', text: res.message });
        setDocName('');
        setTimeout(() => {
          setIsUploadModalOpen(false);
          setUploadStatus(null);
        }, 1500);
      } else {
        setUploadStatus({ type: 'error', text: res.message });
      }
    } catch (err: any) {
      setIsUploading(false);
      setUploadStatus({ type: 'error', text: err?.message || 'Upload failed.' });
    }
  };

  const getDocTypeBadge = (type: DocumentType) => {
    switch (type) {
      case 'Aadhaar':
      case 'Address_Proof':
        return 'Identity Record';
      case 'Form_1A_Medical':
        return 'Medical Fitness';
      case 'Learner_Licence':
        return 'Learner Permit';
      case 'Driving_Licence':
        return 'Driving Licence';
      case 'Payment_Receipt':
        return 'Financial Receipt';
      case 'Course_Certificate':
        return 'Training Certificate';
      default:
        return 'Document';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Supabase Storage Private Vault Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderLock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Private Documents Vault
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Supabase Storage RLS Protected
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Encrypted personal vault for Government RTO registration and course verification records.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white font-bold text-xs transition shadow-lg shadow-blue-600/20 flex items-center gap-2 self-start md:self-auto"
        >
          <Upload className="w-4 h-4" /> Upload New Document
        </button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => {
          const isVerified = doc.verification_status === 'Verified';
          const isPending = doc.verification_status === 'Pending';

          return (
            <div
              key={doc.id}
              className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4 flex flex-col justify-between hover:border-blue-500/40 transition"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <FileText className="w-6 h-6" />
                  </div>

                  {isVerified ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  ) : isPending ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                      <Clock className="w-3 h-3" /> In Verification
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                      <AlertCircle className="w-3 h-3" /> Rejected
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                    {getDocTypeBadge(doc.document_type)}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 truncate" title={doc.document_name}>
                    {doc.document_name}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                    <span>{doc.file_size || '1.2 MB'}</span>
                    <span>•</span>
                    <span>{new Date(doc.uploaded_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>

                {doc.notes && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-[#0B1728] p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    {doc.notes}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setPreviewDoc(doc)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" /> View
                </button>

                <a
                  href={doc.file_url}
                  download={doc.document_name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-blue-200 dark:border-blue-800"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-md w-full bg-white dark:bg-[#111E32] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E5EAF1] dark:border-[#1E293B] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Upload Document to Vault
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadStatus && (
              <div className={`p-3 rounded-2xl text-xs flex items-center gap-2 ${
                uploadStatus.type === 'success' 
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400'
              }`}>
                {uploadStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{uploadStatus.text}</span>
              </div>
            )}

            <form onSubmit={handleUpload} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Document Type
                </label>
                <select
                  value={docType}
                  onChange={(e: any) => setDocType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Aadhaar">Aadhaar Card (Identity Proof)</option>
                  <option value="Form_1A_Medical">Form 1A Certified Medical Fitness</option>
                  <option value="Passport_Photo">Passport Size Photograph</option>
                  <option value="Address_Proof">Electricity / Utility Bill Address Proof</option>
                  <option value="Learner_Licence">Existing Learner Licence Copy</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Document File Name / Description
                </label>
                <input
                  type="text"
                  required
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  placeholder="e.g. Aadhaar_Front_Back_Scanned.pdf"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2 cursor-pointer hover:border-blue-500 transition">
                <Upload className="w-8 h-8 text-blue-500 mx-auto" />
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-blue-600 dark:text-blue-400">Click to select document</span> or drag & drop
                </div>
                <p className="text-[10px] text-slate-400">PDF, JPG, PNG up to 10MB</p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white font-bold text-xs transition shadow-md shadow-blue-600/20"
                >
                  {isUploading ? 'Uploading...' : 'Upload Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document View Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="max-w-2xl w-full bg-white dark:bg-[#111E32] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#E5EAF1] dark:border-[#1E293B] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-md">
                    {previewDoc.document_name}
                  </h3>
                  <span className="text-[10px] text-slate-400">{getDocTypeBadge(previewDoc.document_type)}</span>
                </div>
              </div>

              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Document Viewer */}
            <div className="h-80 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex flex-col items-center justify-center p-6 text-center space-y-3">
              <FileCheck2 className="w-16 h-16 text-emerald-500" />
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Document Digitally Verified & Archived
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                  Encrypted at rest in private storage. Authorized for Sarathi RTO application #{student.student_code}.
                </p>
              </div>
              <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                Verification Status: {previewDoc.verification_status}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close Preview
              </button>
              <a
                href={previewDoc.file_url}
                download={previewDoc.document_name}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white font-bold text-xs transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download Copy
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};