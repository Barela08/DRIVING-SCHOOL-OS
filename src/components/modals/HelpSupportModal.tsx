'use client';

import React from 'react';
import { X, HelpCircle, Phone, Mail, ExternalLink, ShieldCheck, BookOpen, AlertCircle } from 'lucide-react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';

interface HelpSupportModalProps {
  onClose: () => void;
}

export const HelpSupportModal: React.FC<HelpSupportModalProps> = ({ onClose }) => {
  const { school } = useDrivingSchool();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-lg w-full border border-slate-800 shadow-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Owner Help & Support</h3>
              <p className="text-xs text-slate-400">Enterprise Driving Academy Support</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> RTO Regulatory Compliance
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Driving School OS automatically enforces statutory Motor Vehicle Act quotas (mandatory dual-control pedal inspection, learner licence 30-day wait period, and atomic attendance ledger).
            </p>
            <div className="pt-1 flex items-center gap-4 text-slate-400">
              <span>RTO No: <strong className="text-white">{school.rto_registration_no}</strong></span>
              <span>•</span>
              <a 
                href="https://sarathi.parivahan.gov.in" 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-400 hover:underline inline-flex items-center gap-1"
              >
                Parivahan Sarathi <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-white">Priority Technical Assistance</h4>
            <div className="space-y-2 text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-blue-400" /> Dedicated Hotline:</span>
                <span className="font-mono font-bold text-white">+91 1800 200 4882 (24x7)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-blue-400" /> Support Desk:</span>
                <span className="font-semibold text-white">enterprise-support@drivingschoolos.in</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
          >
            Close Support
          </button>
        </div>
      </div>
    </div>
  );
};
