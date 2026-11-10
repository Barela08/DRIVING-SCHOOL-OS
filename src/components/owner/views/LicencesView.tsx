'use client';

import React, { useState } from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { LicenceRecord } from '@/types';
import { FileCheck2, Calendar, List, CalendarDays, CheckCircle2, XCircle, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

interface LicencesViewProps {
  onOpenLicenceUpdate: (licence: LicenceRecord) => void;
}

export const LicencesView: React.FC<LicencesViewProps> = ({ onOpenLicenceUpdate }) => {
  const { licenceRecords } = useDrivingSchool();

  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Metrics
  const llApps = licenceRecords.filter(l => l.ll_reference).length;
  const dlApps = licenceRecords.filter(l => l.dl_reference || l.ll_status.includes('DL')).length;
  const docsPending = licenceRecords.filter(l => l.ll_status === 'Documents Pending').length;
  const upcomingTests = licenceRecords.filter(l => l.test_date || l.ll_status === 'DL Test Scheduled');
  const testPassed = licenceRecords.filter(l => l.ll_status === 'Test Passed' || l.test_result === 'Passed').length;
  const testFailed = licenceRecords.filter(l => l.ll_status === 'Test Failed' || l.test_result === 'Failed').length;
  const licenceIssued = licenceRecords.filter(l => l.ll_status === 'Licence Issued' || l.licence_number).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-purple-400" /> RTO Driving Licence Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            End-to-end Sarathi tracking: Learner Licence (LL) applications, test appointments and DL dispatch.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" /> List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'calendar' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CalendarDays className="w-4 h-4" /> Calendar View
            </button>
          </div>
        </div>
      </div>

      {/* 7 Statutory Pipeline Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
          <span className="text-slate-400 text-[10px] block">LL Apps</span>
          <span className="text-xl font-black text-white tabular-nums mt-1 block">{llApps}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
          <span className="text-slate-400 text-[10px] block">DL Apps</span>
          <span className="text-xl font-black text-blue-400 tabular-nums mt-1 block">{dlApps}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
          <span className="text-slate-400 text-[10px] block">Docs Pending</span>
          <span className="text-xl font-black text-amber-400 tabular-nums mt-1 block">{docsPending}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
          <span className="text-slate-400 text-[10px] block">Upcoming Tests</span>
          <span className="text-xl font-black text-purple-400 tabular-nums mt-1 block">{upcomingTests.length}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
          <span className="text-slate-400 text-[10px] block">Tests Passed</span>
          <span className="text-xl font-black text-emerald-400 tabular-nums mt-1 block">{testPassed}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
          <span className="text-slate-400 text-[10px] block">Tests Failed</span>
          <span className="text-xl font-black text-rose-400 tabular-nums mt-1 block">{testFailed}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
          <span className="text-slate-400 text-[10px] block">DL Issued</span>
          <span className="text-xl font-black text-cyan-400 tabular-nums mt-1 block">{licenceIssued}</span>
        </div>
      </div>

      {/* Main Content Area: List vs Calendar */}
      {viewMode === 'list' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white">Upcoming Driving Test & Application Roster</h3>
          <div className="border border-slate-800 rounded-2xl overflow-x-auto">
            <table className="w-full text-xs text-left min-w-[850px]">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Student ID</th>
                  <th className="px-4 py-3">Licence Type</th>
                  <th className="px-4 py-3">Application Ref</th>
                  <th className="px-4 py-3">RTO Ground</th>
                  <th className="px-4 py-3">Test Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {licenceRecords.map(lic => (
                  <tr key={lic.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-bold text-white">{lic.student_name}</td>
                    <td className="px-4 py-3 font-mono text-blue-400 font-semibold">{lic.student_code}</td>
                    <td className="px-4 py-3 text-slate-300">{lic.licence_type}</td>
                    <td className="px-4 py-3 font-mono text-slate-400 text-[11px]">{lic.ll_reference || 'Pending'}</td>
                    <td className="px-4 py-3 text-slate-300">{lic.rto_name}</td>
                    <td className="px-4 py-3 font-semibold text-amber-400">{lic.test_date || 'Awaiting Slot'}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {lic.ll_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onOpenLicenceUpdate(lic)}
                        className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition"
                      >
                        Update RTO Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Monthly RTO Driving Practical Calendar</h3>
            <span className="text-xs text-purple-400 font-semibold">November 2026</span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="font-bold text-slate-400 py-2 border-b border-slate-800">{day}</div>
            ))}
            {Array.from({ length: 30 }).map((_, i) => {
              const day = i + 1;
              const hasTest = day === 20 || day === 25;
              return (
                <div 
                  key={day}
                  className={`min-h-[70px] p-2 rounded-2xl border text-left transition ${
                    hasTest 
                      ? 'bg-purple-950/40 border-purple-600/60 shadow-lg shadow-purple-600/10'
                      : 'bg-slate-950 border-slate-800/60 text-slate-500'
                  }`}
                >
                  <span className={`font-black text-xs ${hasTest ? 'text-white' : 'text-slate-400'}`}>{day}</span>
                  {hasTest && (
                    <div className="mt-1 bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded truncate">
                      DL Test @ Alandi
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
