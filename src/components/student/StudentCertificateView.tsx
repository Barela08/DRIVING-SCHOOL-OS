'use client';

import React from 'react';
import { 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Download, 
  Eye, 
  ExternalLink, 
  FileText, 
  MessageSquare, 
  Star,
  QrCode,
  Calendar,
  Building2,
  Lock,
  Zap
} from 'lucide-react';
import { CourseCertificate, Enrollment, Student, CertificateFeedback } from '@/types';
import { MyCertificateCard } from './MyCertificateCard';
import { formatCertificateDate } from '@/lib/certificateGenerator';
import Link from 'next/link';

interface StudentCertificateViewProps {
  student: Student;
  enrollment: Enrollment;
  certificate?: CourseCertificate;
  feedbacks: CertificateFeedback[];
  onOpenPreview: () => void;
  onDownloadClick: () => void;
  onSimulateCompletion?: () => void;
  isSimulating?: boolean;
}

export const StudentCertificateView: React.FC<StudentCertificateViewProps> = ({
  student,
  enrollment,
  certificate,
  feedbacks,
  onOpenPreview,
  onDownloadClick,
  onSimulateCompletion,
  isSimulating = false
}) => {
  const isComplete = Boolean(certificate && certificate.status === 'Issued');
  const myFeedback = feedbacks.find(f => f.student_id === student.id);

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-fadeIn">
      {/* Top Breadcrumb & Title */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Student Portal</span>
          <span>/</span>
          <span className="text-amber-500">Official Certification</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <Award className="w-6 h-6 text-amber-500" />
              Course Completion Certificate
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Government RTO Authorized Driving Competence &amp; Training Credentials
            </p>
          </div>

          {certificate && (
            <Link
              href={certificate.qr_verification_url}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition self-start sm:self-auto"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              Public Verification Link
            </Link>
          )}
        </div>
      </div>

      {/* Main Certificate Card */}
      <MyCertificateCard
        student={student}
        enrollment={enrollment}
        certificate={certificate}
        onOpenPreview={onOpenPreview}
        onDownloadClick={onDownloadClick}
        onSimulateCompletion={onSimulateCompletion}
        isSimulating={isSimulating}
      />

      {/* Additional Supporting Details & Audit Records */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Verification & Anti-Counterfeiting Safeguards (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Verification &amp; Security Standards
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex items-start gap-3">
                <QrCode className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Cryptographic QR Verification
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                    Each issued certificate carries a dynamic QR code linked directly to our public authenticity registry. Employers, RTO inspectors, and licensing officers can verify candidate credentials instantly.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Verified Attendance Provenance
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                    Certificates are generated exclusively upon fulfilling 100% of practical attendance sessions logged by authorized driving instructors on dual-control training vehicles.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex items-start gap-3">
                <Lock className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Privacy-Preserving Public Lookup
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                    Public verification displays only essential accreditation details (student name, course, completion date, and validity). Personal contact data, fees, and government IDs remain private.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Feedback & Download History (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Student Feedback Status */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-500" />
              Your Course Feedback
            </h3>

            {myFeedback ? (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">Rating Submitted</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(myFeedback.overall_rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                {myFeedback.written_feedback && (
                  <p className="text-slate-600 dark:text-slate-300 italic">
                    &quot;{myFeedback.written_feedback}&quot;
                  </p>
                )}
                <span className="text-[10px] text-slate-500 block">
                  Submitted on {new Date(myFeedback.created_at).toLocaleDateString('en-IN')}
                </span>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <p>
                  We value your honest feedback to maintain high road safety training quality. You will be invited to share your thoughts when downloading your certificate.
                </p>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                  ✓ Voluntary &amp; Non-Binding
                </span>
              </div>
            )}
          </div>

          {/* Certificate Metadata */}
          {certificate && (
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-3 text-xs">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Issuance Ledger &amp; Auditing
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b border-[#E5EAF1] dark:border-[#1E293B]">
                  <span className="text-slate-500">Issued On:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {new Date(certificate.issued_at).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E5EAF1] dark:border-[#1E293B]">
                  <span className="text-slate-500">Download Count:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {certificate.download_count} {certificate.download_count === 1 ? 'time' : 'times'}
                  </span>
                </div>
                {certificate.last_downloaded_at && (
                  <div className="flex justify-between py-1 border-b border-[#E5EAF1] dark:border-[#1E293B]">
                    <span className="text-slate-500">Last Downloaded:</span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {new Date(certificate.last_downloaded_at).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Tamper-Proof Seal:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    Active &amp; Verified
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
