'use client';

import React from 'react';
import { 
  X, 
  ExternalLink, 
  ShieldAlert, 
  CheckCircle2, 
  FileText, 
  Calendar, 
  UserCheck, 
  Car, 
  HelpCircle,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { OFFICIAL_PARIVAHAN_URL } from '@/lib/llTrackingEngine';

interface LLEligibilityInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
  category?: string;
}

export const LLEligibilityInfoModal: React.FC<LLEligibilityInfoModalProps> = ({
  isOpen,
  onClose,
  studentName,
  category = 'LMV (Light Motor Vehicle)'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl text-slate-100 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Official RTO Learning Licence Guide & Eligibility
              </h3>
              <p className="text-xs text-slate-400">
                Government of India Ministry of Road Transport & Highways (MoRTH) Sarathi Guidelines
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

        {/* CRITICAL LEGAL NOTICE / DISCLAIMER */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-amber-400 text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Important Statutory Eligibility Notice</span>
          </div>
          <p className="leading-relaxed text-slate-300">
            Attending driving school classes does <strong>not</strong> automatically grant legal licence eligibility. 
            The driving school threshold is solely an internal reminder policy. Every applicant must independently satisfy statutory age, physical fitness, biometric authentication, and document criteria on the Government portal before appearing for the official test.
          </p>
        </div>

        {/* Age by Vehicle Category Breakdown */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Car className="w-3.5 h-3.5 text-blue-400" /> Statutory Age Requirements
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-white block">Motorcycle &le; 50cc</span>
              <span className="text-emerald-400 font-bold block text-sm">16 Years</span>
              <p className="text-[11px] text-slate-400">Without gear. Requires written consent from parent or legal guardian.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 bg-amber-500/5 space-y-1">
              <span className="font-bold text-white block">LMV & MCWG</span>
              <span className="text-amber-400 font-bold block text-sm">18 Years</span>
              <p className="text-[11px] text-slate-400">Cars, light motor vehicles, and geared motorcycles. Most common for learners.</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="font-bold text-white block">Commercial / Heavy</span>
              <span className="text-purple-400 font-bold block text-sm">20 Years</span>
              <p className="text-[11px] text-slate-400">Transport and heavy commercial vehicles. Requires prior valid LMV licence for 1+ year.</p>
            </div>
          </div>
        </div>

        {/* Mandatory Documents Checklist */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-purple-400" /> Mandatory Documents to Keep Ready
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Aadhaar Card</strong> (for Aadhaar-based paperless e-KYC authentication)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Proof of Age & Address</strong> (Voter ID, Passport, 10th marksheet, or Electricity bill)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Medical Certificate (Form 1A)</strong> (Required for applicants aged 40+ or transport)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Passport Size Photographs</strong> & Signature scan copy</span>
            </div>
          </div>
        </div>

        {/* 5-Step Application Process Walkthrough */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <ArrowRight className="w-3.5 h-3.5 text-teal-400" /> 5-Step Application Process
          </h4>
          <ol className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/40">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
              <div>
                <strong className="text-white">Visit Parivahan Sarathi:</strong> Go to <span className="font-mono text-blue-400">sarathi.parivahan.gov.in</span> and select your State (e.g. Maharashtra).
              </div>
            </li>
            <li className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/40">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
              <div>
                <strong className="text-white">Apply for Learner Licence:</strong> Click "Apply for Learner Licence" & select "Applicant does not hold Driving/Learner Licence".
              </div>
            </li>
            <li className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/40">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
              <div>
                <strong className="text-white">Aadhaar e-KYC:</strong> Select "Submit via Aadhaar Authentication" for instant online test from home without visiting RTO counter.
              </div>
            </li>
            <li className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/40">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">4</span>
              <div>
                <strong className="text-white">Pay Statutory Government Fee:</strong> Complete the online payment (approx ₹150 - ₹200 per category) and save the application reference.
              </div>
            </li>
            <li className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/40">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">5</span>
              <div>
                <strong className="text-white">Take LL Test & Download:</strong> Pass the computerised traffic signs and road safety test to immediately download your digital Learner Licence.
              </div>
            </li>
          </ol>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <p className="text-[11px] text-slate-500">
            Driving School System does not represent the RTO authority.
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
            >
              Close
            </button>
            <a
              href={OFFICIAL_PARIVAHAN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/20"
            >
              <span>Open Parivahan Sarathi Portal</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
