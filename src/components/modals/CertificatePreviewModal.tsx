'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  ExternalLink, 
  Printer, 
  ShieldCheck, 
  Award, 
  Calendar, 
  CheckCircle2, 
  Share2 
} from 'lucide-react';
import { CourseCertificate } from '@/types';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { generateCertificateSvg, generateQrDataUrl } from '@/lib/certificateGenerator';

interface CertificatePreviewModalProps {
  certificate: CourseCertificate | null;
  isOpen: boolean;
  onClose: () => void;
  onDownloadRequest: () => void;
}

export const CertificatePreviewModal: React.FC<CertificatePreviewModalProps> = ({
  certificate,
  isOpen,
  onClose,
  onDownloadRequest
}) => {
  const { school } = useDrivingSchool();
  const [svgContent, setSvgContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(true);

  useEffect(() => {
    if (!certificate || !isOpen) {
      setSvgContent('');
      return;
    }

    let isMounted = true;
    setIsGenerating(true);

    const loadSvg = async () => {
      try {
        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://apexdriving.in';
        const qrUrl = `${origin}${certificate.qr_verification_url}`;
        const qrDataUrl = await generateQrDataUrl(qrUrl);

        const svg = generateCertificateSvg(
          {
            studentName: certificate.student_name,
            studentCode: certificate.student_code,
            courseName: certificate.course_name,
            completionDate: certificate.completion_date,
            certificateNumber: certificate.certificate_number,
            schoolName: school.name,
            instructorName: certificate.instructor_name || 'Vikram Shinde',
            rtoRegNo: school.rto_registration_no,
            qrVerificationUrl: qrUrl
          },
          qrDataUrl
        );

        if (isMounted) {
          setSvgContent(svg);
          setIsGenerating(false);
        }
      } catch (e) {
        console.error('Error generating preview SVG:', e);
        if (isMounted) setIsGenerating(false);
      }
    };

    loadSvg();

    return () => {
      isMounted = false;
    };
  }, [certificate, isOpen, school]);

  if (!isOpen || !certificate) return null;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleOpenVerify = () => {
    if (typeof window !== 'undefined') {
      window.open(certificate.qr_verification_url, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div 
        className="w-full max-w-4xl max-h-[95vh] bg-[#0F1C31] border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Award className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Certificate Preview</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {certificate.certificate_number}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                  {certificate.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {certificate.student_name} • {certificate.course_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Print Certificate"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Certificate Viewer Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#070E1A]/80 flex flex-col items-center justify-center min-h-[350px]">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-3 text-slate-400 py-12">
              <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
              <span className="text-xs font-medium">Generating high-fidelity vector certificate preview...</span>
            </div>
          ) : svgContent ? (
            <div 
              className="w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl border border-amber-500/30 transition-transform duration-300"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">
              Preview preview could not be rendered. Please download the PDF directly.
            </div>
          )}
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="p-4 sm:px-6 bg-slate-900/90 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Includes tamper-proof cryptographic verification QR code pointing to public registry.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenVerify}
              className="px-3.5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              Verify Public Page
            </button>

            <button
              type="button"
              onClick={onDownloadRequest}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5"
            >
              <Download className="w-4 h-4" />
              Download Certificate PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
