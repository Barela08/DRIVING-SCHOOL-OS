'use client';

import React, { useState } from 'react';
import { 
  FileCheck2, 
  Upload, 
  Calendar, 
  Car, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  X,
  FileText
} from 'lucide-react';

export interface LLRegistrationData {
  hasExistingLL: boolean;
  llNumber?: string;
  llIssueDate?: string;
  llExpiryDate?: string;
  llVehicleCategory?: string;
  llDocumentName?: string;
  llDocumentUrl?: string;
}

interface LLRegistrationFieldsProps {
  value: LLRegistrationData;
  onChange: (data: LLRegistrationData) => void;
  disabled?: boolean;
}

export const LLRegistrationFields: React.FC<LLRegistrationFieldsProps> = ({
  value,
  onChange,
  disabled = false
}) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(value.llDocumentName || null);

  const handleToggleLL = (hasLL: boolean) => {
    onChange({
      ...value,
      hasExistingLL: hasLL,
      llVehicleCategory: hasLL ? (value.llVehicleCategory || 'LMV (Light Motor Vehicle - Car)') : undefined
    });
  };

  const handleSimulatedFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file.name);
      onChange({
        ...value,
        llDocumentName: file.name,
        llDocumentUrl: URL.createObjectURL(file)
      });
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    onChange({
      ...value,
      llDocumentName: undefined,
      llDocumentUrl: undefined
    });
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 dark:bg-slate-900/80 border border-slate-800 space-y-4">
      {/* Question Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-amber-500" />
          <label className="text-xs font-bold text-white uppercase tracking-wider">
            Mandatory RTO Compliance Check *
          </label>
        </div>
        <p className="text-sm font-semibold text-slate-200">
          Do you already have a valid Learning Licence?
        </p>
      </div>

      {/* Yes / No Radio Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={disabled}
          onClick={() => handleToggleLL(true)}
          className={`flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all ${
            value.hasExistingLL
              ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-md shadow-amber-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
          }`}
        >
          <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
            value.hasExistingLL ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-600'
          }`}>
            {value.hasExistingLL && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
          </span>
          YES, I Have a Valid LL
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => handleToggleLL(false)}
          className={`flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all ${
            !value.hasExistingLL
              ? 'bg-blue-500/20 border-blue-500 text-blue-300 shadow-md shadow-blue-500/10'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
          }`}
        >
          <span className={`w-4 h-4 rounded-full border flex items-center justify-center ${
            !value.hasExistingLL ? 'border-blue-400 bg-blue-400 text-slate-950' : 'border-slate-600'
          }`}>
            {!value.hasExistingLL && <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
          </span>
          NO, Need to Apply
        </button>
      </div>

      {/* Conditional Fields: If YES */}
      {value.hasExistingLL ? (
        <div className="pt-3 border-t border-slate-800/80 space-y-3.5 animate-fadeIn">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
            <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
            <span>
              LL status will be recorded as <strong>Already Available</strong>. New application reminders will be turned off. Approaching expiry alerts will be enabled.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Learning Licence Number */}
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">
                Learning Licence Number *
              </label>
              <input
                type="text"
                required={value.hasExistingLL}
                placeholder="e.g. MH12/LL/2026/0019280"
                value={value.llNumber || ''}
                onChange={e => onChange({ ...value, llNumber: e.target.value.toUpperCase() })}
                disabled={disabled}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Vehicle Category */}
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">
                Vehicle Category *
              </label>
              <select
                value={value.llVehicleCategory || 'LMV (Light Motor Vehicle - Car)'}
                onChange={e => onChange({ ...value, llVehicleCategory: e.target.value })}
                disabled={disabled}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="LMV (Light Motor Vehicle - Car)">LMV (Car / 4-Wheeler)</option>
                <option value="MCWG (Motorcycle with Gear)">MCWG (2-Wheeler with Gear)</option>
                <option value="MCWG + LMV (Combo)">MCWG + LMV (Two + Four Wheeler)</option>
                <option value="Commercial / Transport">Commercial / Heavy Transport</option>
              </select>
            </div>

            {/* Issue Date */}
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">
                Issue Date *
              </label>
              <input
                type="date"
                required={value.hasExistingLL}
                value={value.llIssueDate || ''}
                onChange={e => {
                  const issueDate = e.target.value;
                  // Auto-calculate standard 6 months validity if expiry not filled
                  let autoExpiry = value.llExpiryDate;
                  if (issueDate && !value.llExpiryDate) {
                    const d = new Date(issueDate);
                    d.setMonth(d.getMonth() + 6);
                    autoExpiry = d.toISOString().split('T')[0];
                  }
                  onChange({ ...value, llIssueDate: issueDate, llExpiryDate: autoExpiry });
                }}
                disabled={disabled}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Expiry Date */}
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold block">
                Expiry Date * (Standard 6 Months)
              </label>
              <input
                type="date"
                required={value.hasExistingLL}
                value={value.llExpiryDate || ''}
                onChange={e => onChange({ ...value, llExpiryDate: e.target.value })}
                disabled={disabled}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Upload LL Document */}
          <div className="space-y-1.5 pt-1 text-xs">
            <label className="text-slate-300 font-semibold block">
              Upload Learning Licence Document (PDF or Photo)
            </label>
            
            {selectedFile ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-emerald-300">
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate font-mono">{selectedFile}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold shrink-0">
                    Ready
                  </span>
                </div>
                {!disabled && (
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <label className={`flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-slate-700 bg-slate-900/50 hover:bg-slate-900 hover:border-amber-500/50 transition cursor-pointer text-center ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}>
                <Upload className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs text-slate-300 font-medium">Click to select Learning Licence copy</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Supports PDF, PNG, JPG (Max 5MB)</span>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  disabled={disabled}
                  onChange={handleSimulatedFileUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      ) : (
        /* Conditional: If NO */
        <div className="pt-3 border-t border-slate-800/80 animate-fadeIn">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-white">
                Automatic Class-Day Tracking Activated
              </p>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Initial status will be set to <strong className="text-blue-300">Not Applied</strong>. 
                The system will automatically count verified attended class days (multiple sessions per day count as 1 day). 
                Once the driving school threshold is achieved, reminders with Sarathi Parivahan guidance will be triggered for student and owner.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
