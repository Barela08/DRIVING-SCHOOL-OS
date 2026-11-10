'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ExternalLink, 
  AlertCircle, 
  Award, 
  Check, 
  MapPin, 
  Car, 
  Info,
  Sparkles,
  FileBadge
} from 'lucide-react';
import { LicenceRecord, Student, School, Enrollment } from '@/types';
import { StudentLLNotificationBanner } from '@/components/licence/StudentLLNotificationBanner';

interface StudentLicenceTrackerProps {
  licence?: LicenceRecord;
  student: Student;
  school: School;
  enrollment?: Enrollment;
}

export const StudentLicenceTracker: React.FC<StudentLicenceTrackerProps> = ({
  licence,
  student,
  school,
  enrollment
}) => {
  // 6 Visual Pipeline stages from Section 12
  const pipeline = [
    {
      id: 'docs',
      name: 'Documents Pending',
      status: 'completed',
      date: '05 Oct 2026',
      desc: 'Aadhaar, photo, and medical fitness form verified.'
    },
    {
      id: 'app_sub',
      name: 'Application Submitted',
      status: licence?.ll_application_date ? 'completed' : 'pending',
      date: licence?.ll_application_date ? `${licence.ll_application_date}` : 'Awaiting counter dispatch',
      ref: licence?.ll_reference ? `Ref: ${licence.ll_reference}` : undefined,
      desc: 'Online Learner Licence application logged on Sarathi Parivahan.'
    },
    {
      id: 'll_process',
      name: 'LL Process (Learner Licence)',
      status: (licence?.ll_issue_date || licence?.ll_status === 'LL Approved' || licence?.ll_status === 'DL Test Scheduled' || licence?.ll_status === 'Test Passed' || licence?.ll_status === 'Licence Issued') ? 'completed' : 'in_progress',
      date: licence?.ll_issue_date ? `Approved: ${licence.ll_issue_date}` : 'Under RTO scrutiny',
      validTill: licence?.ll_valid_till ? `Valid till: ${licence.ll_valid_till}` : undefined,
      desc: 'Learner Licence approved. Mandatory 30-day practical training commenced.'
    },
    {
      id: 'dl_app',
      name: 'DL Application',
      status: licence?.dl_application_date ? 'completed' : (licence?.ll_status === 'LL Approved' ? 'in_progress' : 'pending'),
      date: licence?.dl_application_date ? `Filed on ${licence.dl_application_date}` : 'Post 30-day LL training',
      ref: licence?.dl_reference ? `Ref: ${licence.dl_reference}` : undefined,
      desc: 'Permanent Driving Licence practical test slot booking.'
    },
    {
      id: 'driving_test',
      name: 'Driving Test',
      status: licence?.test_result === 'Passed' ? 'completed' : (licence?.test_date ? 'active' : 'pending'),
      date: licence?.test_date ? `Test Date: ${licence.test_date}` : 'Slot booking underway',
      confirmed: Boolean(licence?.test_date),
      result: licence?.test_result,
      desc: licence?.test_date 
        ? `Confirmed RTO practical driving test on Alandi Track with academy training car.` 
        : 'Slot booking pending.'
    },
    {
      id: 'licence_issued',
      name: 'Licence Issued',
      status: licence?.licence_number || licence?.ll_status === 'Licence Issued' ? 'completed' : 'pending',
      date: licence?.issue_date ? `Issued: ${licence.issue_date}` : 'After practical clearance',
      licenceNumber: licence?.licence_number,
      desc: licence?.licence_number 
        ? `Official DL #${licence.licence_number} generated. Smart Card dispatched via Speed Post.` 
        : 'Smart Card DL generated after RTO clearance.'
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Learning Licence Tracking & Automatic Reminder Banner */}
      <StudentLLNotificationBanner student={student} enrollment={enrollment} />

      {/* Top Banner with Confirmed RTO Slot Highlight */}
      <div className="bg-gradient-to-r from-[#14243A] via-[#111E32] to-[#0B1728] border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-xl text-white space-y-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                {licence?.licence_type || 'MCWG + LMV (Motorcycle + Car)'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {licence?.ll_status || 'In Process'}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              RTO Driving Licence Status Tracker
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Official Parivahan Sarathi RTO tracking integration. Live milestone status from initial document verification through practical test and physical smart card delivery.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-right shrink-0 space-y-1">
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Jurisdiction RTO Office</span>
            <div className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5 justify-end">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>{licence?.rto_name || 'MH-12 Pune (Alandi Track)'}</span>
            </div>
            <span className="text-[11px] text-blue-400 font-mono block">
              Govt Agency: Maharashtra Motor Vehicles Dept
            </span>
          </div>
        </div>

        {/* Confirmed vs Estimated Dates Indicator */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80 text-xs relative z-10">
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400">LL Reference No:</span>
            <span className="font-mono font-bold text-white block text-sm">
              {licence?.ll_reference || 'MH12/LL/2026/099182'}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400">DL Application No:</span>
            <span className="font-mono font-bold text-white block text-sm">
              {licence?.dl_reference || 'MH12/DL/2026/102948'}
            </span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400">RTO Driving Test Date:</span>
            {licence?.test_date ? (
              <span className="font-bold text-emerald-400 block text-sm flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> {licence.test_date} (Confirmed)
              </span>
            ) : (
              <span className="font-bold text-amber-400 block text-sm">
                Estimated ~30 Days Post-LL
              </span>
            )}
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400">Permanent DL Number:</span>
            {licence?.licence_number ? (
              <span className="font-mono font-black text-emerald-400 block text-sm">
                {licence.licence_number}
              </span>
            ) : (
              <span className="text-slate-400 italic block text-xs">
                Pending Practical Test Clearance
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Visual Progress Timeline (From Section 12 Specification) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Six-Stage RTO Licensing Timeline
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Documents Pending → Application Submitted → LL Process → DL Application → Driving Test → Licence Issued
            </p>
          </div>

          <a
            href="https://sarathi.parivahan.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Parivahan Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Desktop / Tablet Timeline Step Flow */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          {pipeline.map((step, idx) => {
            const isCompleted = step.status === 'completed';
            const isActive = step.status === 'active' || step.status === 'in_progress';

            return (
              <div
                key={step.id}
                className={`p-4 rounded-2xl border flex flex-col justify-between space-y-3 relative transition ${
                  isActive
                    ? 'bg-blue-500/10 border-blue-500 shadow-md ring-1 ring-blue-500'
                    : isCompleted
                    ? 'bg-slate-50 dark:bg-[#0B1728] border-emerald-500/30'
                    : 'bg-slate-50/50 dark:bg-[#0B1728]/30 border-[#E5EAF1] dark:border-[#1E293B] opacity-60'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {idx + 1}
                    </span>

                    {isCompleted ? (
                      <span className="p-1 rounded-full bg-emerald-500 text-white shadow">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    ) : isActive ? (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-600 text-white animate-pulse">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
                    )}
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                    {step.name}
                  </h4>
                </div>

                <div className="space-y-1 text-[11px] pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400 block truncate">
                    {step.date}
                  </span>
                  {step.ref && (
                    <span className="text-[10px] text-slate-400 font-mono block truncate">{step.ref}</span>
                  )}
                  {step.licenceNumber && (
                    <span className="text-[10px] text-emerald-500 font-mono font-bold block">{step.licenceNumber}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Test Day Practical Guidance & Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Checklist of Mandatory Documents to Carry */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Test Day Checklist (Must Bring to RTO)
            </h3>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Mandatory Originals
            </span>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-[#0B1728]">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong>Original Learner Licence (LL) Printout</strong>
                <p className="text-[11px] text-slate-500">Color printout of official Form 3 certificate.</p>
              </div>
            </li>

            <li className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-[#0B1728]">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong>Original Aadhaar Card / Government Photo ID</strong>
                <p className="text-[11px] text-slate-500">For biometric and signature identity verification.</p>
              </div>
            </li>

            <li className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-[#0B1728]">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong>Form 1A Certified Medical Fitness Form</strong>
                <p className="text-[11px] text-slate-500">Certified by Registered Medical Practitioner with vision report.</p>
              </div>
            </li>

            <li className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-[#0B1728]">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <strong>Slot Booking Receipt / Application Acknowledgment</strong>
                <p className="text-[11px] text-slate-500">Form 5 / Form 5B Driving School Training Certificate.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Academy Vehicle & Test Track Maneuvers Guide */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Car className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Academy Test Car & Track Protocol
            </h3>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
              Arranged by Academy
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-1">
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider block">
                Dual-Control Test Car
              </span>
              <p>
                Apex Motor Driving School will provide the registered dual-pedal <strong>Maruti Suzuki Swift Dzire (MH-12-AB-1234)</strong> at the Alandi RTO track for your practical assessment.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-1">
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider block">
                Track Maneuvers to Execute
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600 dark:text-slate-400">
                <li>Reverse &quot;S&quot; track navigation without curb touching</li>
                <li>&quot;H&quot; track parking maneuver inside boundary sensors</li>
                <li>Slope stop &amp; restart with half-clutch without vehicle rollback</li>
                <li>Emergency braking and hand signal demonstration</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component
const FileCheck = ({ className }: { className?: string }) => (
  <ShieldCheck className={className} />
);