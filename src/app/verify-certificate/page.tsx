'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Award, 
  Calendar, 
  Building2, 
  UserCheck, 
  FileText, 
  Download, 
  ExternalLink,
  Lock,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { formatCertificateDate } from '@/lib/certificateGenerator';

function VerifyCertificateContent() {
  const searchParams = useSearchParams();
  const initialCertNo = searchParams.get('certNumber') || searchParams.get('cert') || 'APEX-CRT-2026-00103';

  const { certificates, school } = useDrivingSchool();
  const [searchQuery, setSearchQuery] = useState(initialCertNo);
  const [activeCertNo, setActiveCertNo] = useState(initialCertNo);

  // Find certificate matching the active query (case-insensitive)
  const matchedCertificate = certificates.find(
    c => c.certificate_number.trim().toUpperCase() === activeCertNo.trim().toUpperCase()
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveCertNo(searchQuery.trim());
    }
  };

  return (
    <div className="min-h-screen bg-[#070E1A] text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-[#0B1728]/80 backdrop-blur px-4 py-4 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <Award className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-black text-sm tracking-tight text-white block">
                {school.name}
              </span>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                Public Certificate Registry
              </span>
            </div>
          </Link>

          <Link
            href="/login"
            className="text-xs px-3.5 py-1.5 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition font-medium"
          >
            Portal Login
          </Link>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 space-y-8">
        {/* Search Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <ShieldCheck className="w-4 h-4" /> Official Motor Driving Certificate Verification
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Verify Certificate Authenticity
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Scan QR code or enter the unique serialized Certificate Number below to verify verified completion records and RTO practical driving qualification.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto pt-2 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="e.g. APEX-CRT-2026-00103"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-amber-500 text-white text-xs sm:text-sm outline-none font-mono tracking-wider transition"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition shadow-lg shadow-amber-500/20"
            >
              Verify
            </button>
          </form>
        </div>

        {/* Verification Result Card */}
        {matchedCertificate ? (
          <div className="bg-gradient-to-b from-slate-900 to-[#0B1728] border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6 animate-in fade-in slide-in-from-bottom-2">
            {/* Top Validity Badge Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950">
                      OFFICIALLY VERIFIED &amp; VALID
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Status: {matchedCertificate.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-white mt-0.5">
                    Course Completion Record Verified
                  </h2>
                </div>
              </div>

              {matchedCertificate.pdf_data_url && (
                <a
                  href={matchedCertificate.pdf_data_url}
                  download={`Certificate_${matchedCertificate.certificate_number}.pdf`}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
                >
                  <Download className="w-4 h-4 text-amber-400" /> Download Official PDF
                </a>
              )}
            </div>

            {/* Verified Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-[11px] font-medium text-slate-400 block flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-blue-400" /> Student Full Name:
                </span>
                <span className="text-base font-bold text-white block">
                  {matchedCertificate.student_name}
                </span>
                <span className="text-[11px] font-mono text-slate-500 block">
                  Candidate Code: {matchedCertificate.student_code}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-[11px] font-medium text-slate-400 block flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-400" /> Certificate Number:
                </span>
                <span className="text-base font-black font-mono text-amber-300 block">
                  {matchedCertificate.certificate_number}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Issued: {new Date(matchedCertificate.issued_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-[11px] font-medium text-slate-400 block flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-purple-400" /> Course Name:
                </span>
                <span className="text-sm font-bold text-white block">
                  {matchedCertificate.course_name}
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold block">
                  ✓ {matchedCertificate.verified_sessions_count} Practical Sessions Verified &amp; Completed
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <span className="text-[11px] font-medium text-slate-400 block flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Course Completion Date:
                </span>
                <span className="text-base font-bold text-white block">
                  {formatCertificateDate(matchedCertificate.completion_date)}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Derived from Verified Instructor Attendance Records
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1 md:col-span-2">
                <span className="text-[11px] font-medium text-slate-400 block flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" /> Issuing Driving Institute:
                </span>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-sm font-bold text-white block">
                      {school.name}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      Govt. RTO Registration No: {school.rto_registration_no || 'MH-12/MDS/2018/042'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                    Security Hash: {matchedCertificate.qr_hash}
                  </span>
                </div>
              </div>
            </div>

            {/* Privacy & Anti-Tamper Notice */}
            <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
              <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p>
                <strong className="text-slate-300">Data Privacy &amp; Protection:</strong> In compliance with RTO security standards, private student information (contact telephone numbers, residential address, fee payments, and Aadhaar identity documents) is strictly withheld from public verification lookup.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-slate-900 border border-rose-500/30 rounded-3xl p-8 text-center space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8 stroke-[2]" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-black text-white">No Verified Certificate Found</h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                No issued driving course completion certificate matches the reference code <span className="font-mono text-rose-400 font-bold">&quot;{activeCertNo}&quot;</span> in our registry.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => {
                  setSearchQuery('APEX-CRT-2026-00103');
                  setActiveCertNo('APEX-CRT-2026-00103');
                }}
                className="text-xs text-amber-400 hover:text-amber-300 underline font-semibold"
              >
                View sample verified certificate: APEX-CRT-2026-00103
              </button>
            </div>
          </div>
        )}

        {/* Informational Footer */}
        <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-800">
          <p>© {new Date().getFullYear()} {school.name}. Authorized Motor Driving Training Institution &amp; Licensing Centre.</p>
        </div>
      </main>
    </div>
  );
}

export default function VerifyCertificatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#070E1A] flex items-center justify-center text-white">
        Loading Certificate Verification Registry...
      </div>
    }>
      <VerifyCertificateContent />
    </Suspense>
  );
}
