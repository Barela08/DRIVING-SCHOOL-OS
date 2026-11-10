'use client';

import React from 'react';
import { 
  Award, 
  CheckCircle2, 
  Clock, 
  Download, 
  Eye, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Calendar,
  Zap,
  Lock
} from 'lucide-react';
import { CourseCertificate, Enrollment, Student } from '@/types';
import { formatCertificateDate } from '@/lib/certificateGenerator';
import Link from 'next/link';

interface MyCertificateCardProps {
  student: Student;
  enrollment: Enrollment;
  certificate?: CourseCertificate;
  onOpenPreview: () => void;
  onDownloadClick: () => void;
  onSimulateCompletion?: () => void;
  isSimulating?: boolean;
}

export const MyCertificateCard: React.FC<MyCertificateCardProps> = ({
  student,
  enrollment,
  certificate,
  onOpenPreview,
  onDownloadClick,
  onSimulateCompletion,
  isSimulating = false
}) => {
  const isComplete = Boolean(certificate && certificate.status === 'Issued');
  const remainingSessions = Math.max(0, enrollment.total_sessions - enrollment.completed_sessions);
  const pct = Math.round((enrollment.completed_sessions / enrollment.total_sessions) * 100);

  if (isComplete && certificate) {
    return (
      <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
              <Award className="w-8 h-8 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {certificate.certificate_number}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" /> {certificate.status}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                Official Course Completion Certificate
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={certificate.qr_verification_url}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" /> Public Registry
            </Link>
          </div>
        </div>

        {/* Certificate Details Snapshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 relative z-10 text-xs">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block">Course Name:</span>
            <span className="font-bold text-white text-sm block leading-tight">
              {certificate.course_name}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block">Student Full Name:</span>
            <span className="font-bold text-white text-sm block">
              {certificate.student_name}
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              ID: {certificate.student_code}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block">Completion Date:</span>
            <span className="font-bold text-emerald-400 text-sm block">
              {formatCertificateDate(certificate.completion_date)}
            </span>
            <span className="text-[10px] text-slate-500">
              Verified from practical records
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
            <span className="text-[11px] text-slate-400 block">Practical Sessions:</span>
            <span className="font-black text-amber-400 text-sm block">
              {certificate.verified_sessions_count} of {certificate.total_required_sessions} Completed
            </span>
            <span className="text-[10px] text-slate-500">
              Instructor: {certificate.instructor_name || 'Assigned Instructor'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800/80 relative z-10">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Certified with official RTO licensing seal and unique QR verification code.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenPreview}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs border border-slate-700 transition"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              Preview Certificate
            </button>

            <button
              type="button"
              onClick={onDownloadClick}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/25 transition transform hover:-translate-y-0.5"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              Download Certificate PDF
            </button>
          </div>
        </div>
      </div>
    );
  }

  // State when course is in progress (not yet complete)
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 text-amber-400 border border-slate-700 flex items-center justify-center shrink-0">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                In Progress ({pct}%)
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {enrollment.completed_sessions} / {enrollment.total_sessions} Classes Completed
              </span>
            </div>
            <h2 className="text-xl font-black text-white mt-1">
              Course Completion Certificate
            </h2>
            <p className="text-xs text-slate-400">
              {enrollment.course_name}
            </p>
          </div>
        </div>

        {onSimulateCompletion && (
          <button
            type="button"
            disabled={isSimulating}
            onClick={onSimulateCompletion}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/20 transition shrink-0"
            title="Instantly marks remaining classes in the database and triggers automatic certificate issuance"
          >
            <Zap className={`w-3.5 h-3.5 text-amber-300 ${isSimulating ? 'animate-spin' : ''}`} />
            {isSimulating ? 'Verifying & Issuing...' : '⚡ Simulate Complete All Remaining Sessions'}
          </button>
        )}
      </div>

      {/* Progress Notice */}
      <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs space-y-2">
        <div className="flex items-center justify-between text-slate-300">
          <span className="font-semibold flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" /> Completion Requirement:
          </span>
          <span className="font-bold text-amber-400">
            {remainingSessions} Practical Sessions Remaining
          </span>
        </div>
        <p className="text-slate-400 leading-relaxed">
          The system continuously evaluates your verified practical driving attendance records in real-time. As soon as all allocated lessons, vehicle controls, and RTO track drills are completed, your official Certificate of Driving Competence will be issued automatically without manual approval.
        </p>

        {/* Mini progress bar */}
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden mt-2">
          <div 
            className="bg-amber-400 h-full rounded-full transition-all duration-500" 
            style={{ width: `${pct}%` }} 
          />
        </div>
      </div>

      {/* Curriculum Breakdown */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Practical Components Checklist
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {enrollment.session_allocations?.map(sa => {
            const isDone = sa.completed_count >= sa.allocated_count;
            return (
              <div 
                key={sa.id}
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  isDone 
                    ? 'bg-slate-950/40 border-slate-800 text-slate-300' 
                    : 'bg-amber-500/5 border-amber-500/20 text-amber-200'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <span className="truncate">{sa.session_name_snapshot}</span>
                </div>
                <span className={`font-mono text-[11px] font-bold shrink-0 ml-2 ${
                  isDone ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {sa.completed_count}/{sa.allocated_count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
