'use client';

import React, { useState } from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { LicenceRecord, Student } from '@/types';
import { 
  FileCheck2, 
  Calendar, 
  List, 
  CalendarDays, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  BarChart3,
  Bell
} from 'lucide-react';
import { LLAnalyticsView } from '@/components/licence/LLAnalyticsView';
import { LLPendingApplicationsSection } from '@/components/licence/LLPendingApplicationsSection';

interface LicencesViewProps {
  onOpenLicenceUpdate: (licence: LicenceRecord) => void;
  onOpenStudent?: (student: Student) => void;
}

export const LicencesView: React.FC<LicencesViewProps> = ({ 
  onOpenLicenceUpdate,
  onOpenStudent 
}) => {
  const { licenceRecords } = useDrivingSchool();

  const [activeTab, setActiveTab] = useState<'analytics' | 'pending' | 'pipeline'>('analytics');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Metrics
  const llApps = licenceRecords.filter(l => l.ll_reference).length;
  const dlApps = licenceRecords.filter(l => l.dl_reference || l.ll_status.includes('DL')).length;
  const docsPending = licenceRecords.filter(l => l.ll_status === 'Documents Pending' || l.ll_status === 'Not Applied').length;
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
            End-to-end Sarathi tracking: Automated class-day thresholds, LL reminders, test slots, and DL issuance.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl self-start sm:self-center">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'analytics' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>LL Analytics & Filters</span>
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'pending' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Applications Pending</span>
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'pipeline' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>RTO Test Roster</span>
          </button>
        </div>
      </div>

      {/* 1. Analytics Tab */}
      {activeTab === 'analytics' && (
        <LLAnalyticsView onSelectStudent={onOpenStudent} />
      )}

      {/* 2. Pending Applications Tab */}
      {activeTab === 'pending' && (
        <LLPendingApplicationsSection onSelectStudent={onOpenStudent} />
      )}

      {/* 3. Pipeline / RTO Test Appointment Tab */}
      {activeTab === 'pipeline' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">RTO Test Pipeline & Slot Verification</h3>
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

          {viewMode === 'list' ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white">Upcoming Driving Test & Application Roster</h3>
              <div className="border border-slate-800 rounded-2xl overflow-x-auto">
                <table className="w-full text-xs text-left min-w-[850px]">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="px-3 py-2.5">Learner</th>
                      <th className="px-3 py-2.5">Licence Type</th>
                      <th className="px-3 py-2.5">Test Date</th>
                      <th className="px-3 py-2.5">Status</th>
                      <th className="px-3 py-2.5 text-right">Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {licenceRecords.map(lic => (
                      <tr key={lic.id} className="hover:bg-slate-800/40">
                        <td className="px-3 py-2.5 font-bold text-white">
                          {lic.student_name}
                          <span className="block text-[10px] text-slate-400 font-normal">{lic.rto_name}</span>
                        </td>
                        <td className="px-3 py-2.5 text-slate-300">{lic.licence_type}</td>
                        <td className="px-3 py-2.5 font-semibold text-amber-400">{lic.test_date || 'In Progress'}</td>
                        <td className="px-3 py-2.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300">
                            {lic.ll_status}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <button
                            onClick={() => onOpenLicenceUpdate(lic)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                          >
                            Update
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
              <span className="text-xs font-bold text-white block">November 2026 — RTO Test Appointments</span>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                  <span key={i} className="text-slate-500 font-bold py-1">{d}</span>
                ))}
                {Array.from({ length: 30 }).map((_, i) => {
                  const dayNum = i + 1;
                  const dateStr = `2026-11-${String(dayNum).padStart(2, '0')}`;
                  const testsOnDay = licenceRecords.filter(l => l.test_date === dateStr);
                  return (
                    <div
                      key={dayNum}
                      className={`min-h-[50px] p-1.5 rounded-xl border flex flex-col justify-between text-left ${
                        testsOnDay.length > 0 
                          ? 'border-purple-500/50 bg-purple-950/20' 
                          : 'border-slate-800/60 bg-slate-950/40 text-slate-500'
                      }`}
                    >
                      <span className="font-bold text-[10px]">{dayNum}</span>
                      {testsOnDay.length > 0 && (
                        <div className="space-y-0.5 mt-1">
                          {testsOnDay.map(t => (
                            <span key={t.id} className="block truncate text-[9px] px-1 py-0.5 rounded bg-purple-600 text-white font-medium" title={t.student_name}>
                              {t.student_name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
