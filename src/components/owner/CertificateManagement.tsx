'use client';

import React, { useState } from 'react';
import { 
  Award, 
  Search, 
  Download, 
  Eye, 
  ExternalLink, 
  Upload, 
  Settings, 
  Star, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Users, 
  FileCheck2, 
  Sliders, 
  RefreshCw, 
  Save, 
  Sparkles,
  ChevronRight,
  TrendingUp,
  Link as LinkIcon
} from 'lucide-react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { CourseCertificate, CertificateTemplate, CertificateFieldPosition } from '@/types';
import { formatCertificateDate } from '@/lib/certificateGenerator';
import { CertificatePreviewModal } from '@/components/modals/CertificatePreviewModal';
import Link from 'next/link';

export const CertificateManagement: React.FC = () => {
  const { 
    school, 
    certificates, 
    certificateTemplates, 
    activeTemplate, 
    certificateFeedbacks, 
    certificateDownloads, 
    students, 
    enrollments, 
    attendanceRecords,
    generateCertificate,
    updateCertificateTemplate,
    updateSchoolSettings,
    logCertificateDownload,
    addToast 
  } = useDrivingSchool();

  // Sub-tabs: 'issued' | 'feedback' | 'template' | 'queue'
  const [activeTab, setActiveTab] = useState<'issued' | 'feedback' | 'template' | 'queue'>('issued');

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');

  // Selected certificate for preview modal
  const [previewCert, setPreviewCert] = useState<CourseCertificate | null>(null);

  // Template editor form state
  const [templateName, setTemplateName] = useState(activeTemplate?.name || 'Apex Master Template');
  const [googleReviewUrl, setGoogleReviewUrl] = useState(school?.google_review_url || 'https://g.page/r/apex-driving-school/review');
  const [autoIssue, setAutoIssue] = useState<boolean>(school?.auto_issue_certificates ?? true);

  // Field position states
  const [fieldsConfig, setFieldsConfig] = useState(activeTemplate?.fields_config || {
    student_name: { x: 421, y: 370, fontSize: 28, alignment: 'center' },
    student_code: { x: 421, y: 348, fontSize: 10, alignment: 'center' },
    course_name: { x: 421, y: 273, fontSize: 16, alignment: 'center' },
    completion_date: { x: 421, y: 250, fontSize: 11, alignment: 'center' },
    certificate_number: { x: 46, y: 46, fontSize: 9.5, alignment: 'left' },
    school_name: { x: 421, y: 521, fontSize: 21, alignment: 'center' },
    instructor_name: { x: 90, y: 112, fontSize: 11, alignment: 'left' },
    qr_code: { x: 732, y: 42, size: 64 }
  });

  const [uploadedBase64, setUploadedBase64] = useState<string>(activeTemplate?.template_data_url || '');

  // Filtered issued certificates
  const filteredCertificates = certificates.filter(c => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    return (
      c.student_name.toLowerCase().includes(q) ||
      c.student_code.toLowerCase().includes(q) ||
      c.certificate_number.toLowerCase().includes(q) ||
      c.course_name.toLowerCase().includes(q)
    );
  });

  // Calculate statistics
  const totalIssued = certificates.length;
  const totalDownloads = certificates.reduce((sum, c) => sum + (c.download_count || 0), 0);
  const totalFeedbacks = certificateFeedbacks.length;
  const avgOverallRating = totalFeedbacks > 0 
    ? (certificateFeedbacks.reduce((sum, f) => sum + f.overall_rating, 0) / totalFeedbacks).toFixed(1)
    : '5.0';
  const avgInstructorRating = totalFeedbacks > 0 
    ? (certificateFeedbacks.reduce((sum, f) => sum + f.instructor_rating, 0) / totalFeedbacks).toFixed(1)
    : '5.0';
  const avgQualityRating = totalFeedbacks > 0 
    ? (certificateFeedbacks.reduce((sum, f) => sum + f.training_quality_rating, 0) / totalFeedbacks).toFixed(1)
    : '5.0';

  // Handle template file upload
  const handleTemplateFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      addToast('Please upload an image (PNG/JPEG) or PDF template file.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadedBase64(result);
      addToast(`Uploaded template: ${file.name}. Configured for future certificates!`, 'success');
    };
    reader.readAsDataURL(file);
  };

  // Save template configuration
  const handleSaveTemplateConfig = async () => {
    await updateCertificateTemplate({
      name: templateName,
      template_data_url: uploadedBase64,
      fields_config: fieldsConfig
    });

    await updateSchoolSettings({
      google_review_url: googleReviewUrl,
      auto_issue_certificates: autoIssue
    });
  };

  // Trigger manual generation / regeneration for student in queue
  const handleGenerateForEnrollment = async (enrollmentId: string) => {
    const res = await generateCertificate(enrollmentId, { force: true });
    if (res.success && res.certificate) {
      setPreviewCert(res.certificate);
    }
  };

  const handleDownloadPdf = async (cert: CourseCertificate) => {
    await logCertificateDownload(cert.id);
    if (cert.pdf_data_url) {
      const a = document.createElement('a');
      a.href = cert.pdf_data_url;
      a.download = `Certificate_${cert.certificate_number}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      addToast(`Downloaded Certificate #${cert.certificate_number}`, 'success');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Owner Dashboard</span>
            <span>/</span>
            <span className="text-blue-600 dark:text-blue-400">Certificates Engine</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5 mt-1">
            <Award className="w-7 h-7 text-amber-500" />
            Automatic Course Completion Certificates
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Automatic verification, template formatting, public QR registry, and Google review management
          </p>
        </div>

        {/* Quick Tabs Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm self-start sm:self-auto text-xs">
          <button
            onClick={() => setActiveTab('issued')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeTab === 'issued'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            Issued ({certificates.length})
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeTab === 'feedback'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Star className="w-4 h-4 text-amber-400" />
            Feedback ({certificateFeedbacks.length})
          </button>

          <button
            onClick={() => setActiveTab('template')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeTab === 'template'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Template &amp; Settings
          </button>

          <button
            onClick={() => setActiveTab('queue')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${
              activeTab === 'queue'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            Verification Queue
          </button>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Total Issued</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">
            {totalIssued}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            100% Automatic Generation
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Average Feedback</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-500 tabular-nums flex items-baseline gap-1">
            {avgOverallRating} <span className="text-base font-normal text-slate-400">/ 5.0</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Based on {totalFeedbacks} verified submissions
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Total Downloads</span>
            <Download className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-blue-600 dark:text-blue-400 tabular-nums">
            {totalDownloads}
          </div>
          <span className="text-[11px] text-slate-400">
            Logged across student sessions
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Google Reviews Flow</span>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-3xl font-black text-purple-600 dark:text-purple-400 tabular-nums">
            {certificateFeedbacks.filter(f => f.google_review_clicked).length}
          </div>
          <span className="text-[11px] text-slate-400">
            Learners invited to Google Review
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ISSUED CERTIFICATES TABLE                                          */}
      {/* ========================================================================= */}
      {activeTab === 'issued' && (
        <div className="bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl shadow-sm overflow-hidden space-y-4">
          <div className="p-5 border-b border-[#E5EAF1] dark:border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Recently Generated Certificates
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official certificates generated automatically from verified practical attendance records
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by student, ID, or cert..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 transition"
              />
            </div>
          </div>

          {/* Certificates Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F7FB] dark:bg-[#0B1728] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-[#E5EAF1] dark:border-[#1E293B]">
                <tr>
                  <th className="py-3 px-4">Student &amp; ID</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Certificate No</th>
                  <th className="py-3 px-4">Verified Completion</th>
                  <th className="py-3 px-4">Downloads</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EAF1] dark:divide-[#1E293B]">
                {filteredCertificates.map(cert => (
                  <tr key={cert.id} className="hover:bg-slate-50 dark:hover:bg-[#0E1A2C] transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 font-bold flex items-center justify-center text-xs shrink-0">
                          {cert.student_name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block">
                            {cert.student_name}
                          </span>
                          <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400">
                            {cert.student_code}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800 dark:text-slate-200 block">
                        {cert.course_name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {cert.verified_sessions_count} sessions verified
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                        {cert.certificate_number}
                      </span>
                      <span className="text-[10px] text-slate-400 block">
                        Template: {cert.template_id}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-900 dark:text-white block">
                        {formatCertificateDate(cert.completion_date)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Issued: {new Date(cert.issued_at).toLocaleDateString('en-IN')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
                        {cert.download_count} {cert.download_count === 1 ? 'time' : 'times'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" /> {cert.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setPreviewCert(cert)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          title="Preview Certificate"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDownloadPdf(cert)}
                          className="p-1.5 rounded-lg text-blue-600 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        <Link
                          href={cert.qr_verification_url}
                          target="_blank"
                          className="p-1.5 rounded-lg text-amber-500 hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 transition"
                          title="Open Public Registry Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredCertificates.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                      No issued certificates match your search query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: STUDENT FEEDBACK & GOOGLE REVIEWS                                  */}
      {/* ========================================================================= */}
      {activeTab === 'feedback' && (
        <div className="space-y-6">
          {/* Average Ratings Header Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-semibold">Overall Course Experience</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-amber-500">{avgOverallRating}</span>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
              </div>
              <span className="text-[11px] text-slate-400">Based on student download responses</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-semibold">Instructor Guidance Rating</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-blue-500">{avgInstructorRating}</span>
                <div className="flex text-blue-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-blue-400" />
                  ))}
                </div>
              </div>
              <span className="text-[11px] text-slate-400">Patience, clutch &amp; parking coaching</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-semibold">Training Quality &amp; Fleet</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-emerald-500">{avgQualityRating}</span>
                <div className="flex text-emerald-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-emerald-400" />
                  ))}
                </div>
              </div>
              <span className="text-[11px] text-slate-400">Dual-control vehicle condition &amp; tracks</span>
            </div>
          </div>

          {/* Individual Feedback Submissions */}
          <div className="bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Student Feedback Submissions ({certificateFeedbacks.length})
            </h2>

            <div className="space-y-3">
              {certificateFeedbacks.map(fb => (
                <div 
                  key={fb.id} 
                  className="p-4 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 font-bold flex items-center justify-center">
                        {fb.student_name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {fb.student_name}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Submitted on {new Date(fb.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-amber-400">
                        <span className="font-bold text-slate-900 dark:text-white mr-1">{fb.overall_rating} / 5</span>
                        {[...Array(fb.overall_rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>

                      {fb.google_review_clicked ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Clicked Google Review
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-500">
                          Review Skipped
                        </span>
                      )}
                    </div>
                  </div>

                  {fb.written_feedback && (
                    <div className="p-3 rounded-xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B]">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-0.5">Feedback:</span>
                      <p className="text-slate-600 dark:text-slate-400 italic">
                        &quot;{fb.written_feedback}&quot;
                      </p>
                    </div>
                  )}

                  {fb.suggestions && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      <strong>Suggestions:</strong> {fb.suggestions}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CERTIFICATE TEMPLATE & SETTINGS                                    */}
      {/* ========================================================================= */}
      {activeTab === 'template' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Template Upload & Position Configuration (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF1] dark:border-[#1E293B]">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Certificate Template Upload &amp; Formatting
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Upload your driving school&apos;s original design or customize text insertion coordinates
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/30">
                  Future Certificates Only
                </span>
              </div>

              {/* Upload Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Upload Custom Certificate Template (PNG, JPEG, PDF)
                </label>
                <div className="border-2 border-dashed border-[#CBD5E1] dark:border-[#1E293B] rounded-2xl p-6 text-center space-y-2 hover:border-blue-500 transition">
                  <Upload className="w-8 h-8 text-blue-500 mx-auto" />
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    <label className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer">
                      Click to choose template file
                      <input
                        type="file"
                        accept="image/png,image/jpeg,application/pdf"
                        onChange={handleTemplateFileUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Supports A4 Landscape template designs with logos, signatures, and stamps.
                    </p>
                  </div>
                </div>
              </div>

              {/* Template Name & Organization Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    Template Display Name
                  </label>
                  <input
                    type="text"
                    value={templateName}
                    onChange={e => setTemplateName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    Official Google Review URL (Settings)
                  </label>
                  <input
                    type="url"
                    value={googleReviewUrl}
                    onChange={e => setGoogleReviewUrl(e.target.value)}
                    placeholder="https://g.page/r/..."
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-900 dark:text-white outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              {/* Configurable Text Positions & Font Sizes */}
              <div className="space-y-3 pt-2 border-t border-[#E5EAF1] dark:border-[#1E293B]">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Configurable Field Coordinates &amp; Font Sizes
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Student Name */}
                  <div className="p-3 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-1.5">
                    <span className="font-bold text-slate-900 dark:text-white block">Student Name</span>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-[10px] text-slate-400 block">Y Position (pt)</label>
                        <input
                          type="number"
                          value={fieldsConfig.student_name.y}
                          onChange={e => setFieldsConfig({
                            ...fieldsConfig,
                            student_name: { ...fieldsConfig.student_name, y: Number(e.target.value) }
                          })}
                          className="w-full px-2 py-1 rounded bg-white dark:bg-[#111E32] border border-[#CBD5E1] dark:border-[#1E293B] text-xs"
                        />
                      </div>
                      <div className="w-20">
                        <label className="text-[10px] text-slate-400 block">Font Size</label>
                        <input
                          type="number"
                          value={fieldsConfig.student_name.fontSize}
                          onChange={e => setFieldsConfig({
                            ...fieldsConfig,
                            student_name: { ...fieldsConfig.student_name, fontSize: Number(e.target.value) }
                          })}
                          className="w-full px-2 py-1 rounded bg-white dark:bg-[#111E32] border border-[#CBD5E1] dark:border-[#1E293B] text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Course Name */}
                  <div className="p-3 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-1.5">
                    <span className="font-bold text-slate-900 dark:text-white block">Course Title</span>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-[10px] text-slate-400 block">Y Position (pt)</label>
                        <input
                          type="number"
                          value={fieldsConfig.course_name.y}
                          onChange={e => setFieldsConfig({
                            ...fieldsConfig,
                            course_name: { ...fieldsConfig.course_name, y: Number(e.target.value) }
                          })}
                          className="w-full px-2 py-1 rounded bg-white dark:bg-[#111E32] border border-[#CBD5E1] dark:border-[#1E293B] text-xs"
                        />
                      </div>
                      <div className="w-20">
                        <label className="text-[10px] text-slate-400 block">Font Size</label>
                        <input
                          type="number"
                          value={fieldsConfig.course_name.fontSize}
                          onChange={e => setFieldsConfig({
                            ...fieldsConfig,
                            course_name: { ...fieldsConfig.course_name, fontSize: Number(e.target.value) }
                          })}
                          className="w-full px-2 py-1 rounded bg-white dark:bg-[#111E32] border border-[#CBD5E1] dark:border-[#1E293B] text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Completion Date */}
                  <div className="p-3 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-1.5">
                    <span className="font-bold text-slate-900 dark:text-white block">Completion Date</span>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-[10px] text-slate-400 block">Y Position (pt)</label>
                        <input
                          type="number"
                          value={fieldsConfig.completion_date.y}
                          onChange={e => setFieldsConfig({
                            ...fieldsConfig,
                            completion_date: { ...fieldsConfig.completion_date, y: Number(e.target.value) }
                          })}
                          className="w-full px-2 py-1 rounded bg-white dark:bg-[#111E32] border border-[#CBD5E1] dark:border-[#1E293B] text-xs"
                        />
                      </div>
                      <div className="w-20">
                        <label className="text-[10px] text-slate-400 block">Font Size</label>
                        <input
                          type="number"
                          value={fieldsConfig.completion_date.fontSize}
                          onChange={e => setFieldsConfig({
                            ...fieldsConfig,
                            completion_date: { ...fieldsConfig.completion_date, fontSize: Number(e.target.value) }
                          })}
                          className="w-full px-2 py-1 rounded bg-white dark:bg-[#111E32] border border-[#CBD5E1] dark:border-[#1E293B] text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* QR Code Position */}
                  <div className="p-3 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-1.5">
                    <span className="font-bold text-slate-900 dark:text-white block">Verification QR Code</span>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="text-[10px] text-slate-400 block">X Coordinate</label>
                        <input
                          type="number"
                          value={fieldsConfig.qr_code.x}
                          onChange={e => setFieldsConfig({
                            ...fieldsConfig,
                            qr_code: { ...fieldsConfig.qr_code, x: Number(e.target.value) }
                          })}
                          className="w-full px-2 py-1 rounded bg-white dark:bg-[#111E32] border border-[#CBD5E1] dark:border-[#1E293B] text-xs"
                        />
                      </div>
                      <div className="w-20">
                        <label className="text-[10px] text-slate-400 block">Size (pt)</label>
                        <input
                          type="number"
                          value={fieldsConfig.qr_code.size}
                          onChange={e => setFieldsConfig({
                            ...fieldsConfig,
                            qr_code: { ...fieldsConfig.qr_code, size: Number(e.target.value) }
                          })}
                          className="w-full px-2 py-1 rounded bg-white dark:bg-[#111E32] border border-[#CBD5E1] dark:border-[#1E293B] text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveTemplateConfig}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 transition"
                >
                  <Save className="w-4 h-4" /> Save Template &amp; Settings
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Information & Immutability Notice (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Template Immutability Guarantee
              </h3>

              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>
                  <strong className="text-slate-900 dark:text-white">Historical Preservation:</strong> Uploading or updating the certificate template affects future issued certificates. Previously issued certificates preserve their original layout, serial number, and timestamp.
                </p>
                <p>
                  <strong className="text-slate-900 dark:text-white">Tamper-Proof Signatures:</strong> The original signatures of Director Rajesh Mehta and Chief Instructor Vikram Shinde are permanently affixed.
                </p>
                <p>
                  <strong className="text-slate-900 dark:text-white">Instant Preview:</strong> Issued certificates can be viewed anytime in vector format or downloaded as official PDF documents.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: COURSE COMPLETION VERIFICATION QUEUE                               */}
      {/* ========================================================================= */}
      {activeTab === 'queue' && (
        <div className="bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl shadow-sm overflow-hidden space-y-4">
          <div className="p-5 border-b border-[#E5EAF1] dark:border-[#1E293B] flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Course Completion &amp; Eligibility Audit Queue
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Live attendance verification status across active student enrollments
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5F7FB] dark:bg-[#0B1728] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-[#E5EAF1] dark:border-[#1E293B]">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Verified Attendance</th>
                  <th className="py-3 px-4">Remaining Sessions</th>
                  <th className="py-3 px-4">Certificate Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5EAF1] dark:divide-[#1E293B]">
                {enrollments.map(enr => {
                  const cert = certificates.find(c => c.enrollment_id === enr.id);
                  const isDone = enr.completed_sessions >= enr.total_sessions;

                  return (
                    <tr key={enr.id} className="hover:bg-slate-50 dark:hover:bg-[#0E1A2C] transition">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {enr.student_name}
                        </span>
                        <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400">
                          {enr.student_code}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-slate-800 dark:text-slate-200 block">
                          {enr.course_name}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono">
                        <span className={`font-bold ${isDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                          {enr.completed_sessions} / {enr.total_sessions}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          {Math.round((enr.completed_sessions / enr.total_sessions) * 100)}% Verified
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {isDone ? (
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            ✓ All requirements met
                          </span>
                        ) : (
                          <span className="text-amber-500 font-semibold">
                            {enr.total_sessions - enr.completed_sessions} sessions left
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {cert ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
                            Issued: {cert.certificate_number}
                          </span>
                        ) : isDone ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/30">
                            Pending Auto Generation
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">
                            In Progress
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {cert ? (
                          <button
                            onClick={() => setPreviewCert(cert)}
                            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-900 dark:text-white font-bold text-xs"
                          >
                            View
                          </button>
                        ) : (
                          <button
                            onClick={() => handleGenerateForEnrollment(enr.id)}
                            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-sm"
                          >
                            Generate Now
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Certificate Preview Modal */}
      <CertificatePreviewModal
        certificate={previewCert}
        isOpen={Boolean(previewCert)}
        onClose={() => setPreviewCert(null)}
        onDownloadRequest={() => {
          if (previewCert) handleDownloadPdf(previewCert);
        }}
      />
    </div>
  );
};
