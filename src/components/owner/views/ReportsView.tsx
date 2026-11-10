'use client';

import React, { useState } from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { 
  BarChart3, 
  Download, 
  Printer, 
  Calendar, 
  Search, 
  FileSpreadsheet, 
  Users, 
  IndianRupee, 
  CheckCircle2, 
  Car, 
  Award, 
  FileCheck2 
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { exportToCSV, addToast } = useDrivingSchool();

  const [dateFilter, setDateFilter] = useState('');
  const [search, setSearch] = useState('');

  const reportItems = [
    {
      id: 'students',
      title: '1. Student Comprehensive Master Report',
      description: 'Complete student directory with contact info, enrolled course, admission date, and current progress.',
      icon: Users,
      color: 'text-blue-400 bg-blue-500/10'
    },
    {
      id: 'admissions',
      title: '2. Intake & Admission Report',
      description: 'Recent student admissions, batches, initial fee collections, and assigned instructors.',
      icon: Users,
      color: 'text-indigo-400 bg-indigo-500/10'
    },
    {
      id: 'attendance',
      title: '3. Driving Attendance & Session Ledger Report',
      description: 'Detailed log of every completed practical session, student, instructor, date, and vehicle info.',
      icon: CheckCircle2,
      color: 'text-emerald-400 bg-emerald-500/10'
    },
    {
      id: 'instructors',
      title: '4. Instructor Roster & Workload Report',
      description: 'Certified driving instructors, assigned students, active quotas, and verified RTO licences.',
      icon: Award,
      color: 'text-amber-400 bg-amber-500/10'
    },
    {
      id: 'payments',
      title: '5. Fee Collection & Payment Ledger Report',
      description: 'Complete transaction history with confirmed receipt numbers, payment methods, and owner audits.',
      icon: IndianRupee,
      color: 'text-emerald-400 bg-emerald-500/10'
    },
    {
      id: 'outstanding',
      title: '6. Outstanding Dues & Aging Balance Report',
      description: 'Filtered list of all enrolled students with unpaid course balances and overdue accounts.',
      icon: IndianRupee,
      color: 'text-rose-400 bg-rose-500/10'
    },
    {
      id: 'licences',
      title: '7. RTO Licence & Sarathi Pipeline Report',
      description: 'Learner Licence (LL) applications, driving test appointment schedules, pass/fail status, and DL numbers.',
      icon: FileCheck2,
      color: 'text-purple-400 bg-purple-500/10'
    },
    {
      id: 'fleet',
      title: '8. Vehicle Fleet & Maintenance Compliance Report',
      description: 'Fleet inventory, dual-control validation, PUC certificate validity, and insurance expiry schedule.',
      icon: Car,
      color: 'text-cyan-400 bg-cyan-500/10'
    }
  ];

  const handleDownloadCSV = (id: string, title: string) => {
    exportToCSV(id);
    addToast(`Exported "${title}" to CSV format!`, 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" /> Statutory Reports & Analytics Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Generate and export official audit reports, financial balances, and RTO licensing dossiers.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition self-start sm:self-center"
        >
          <Printer className="w-4 h-4" /> Print-Friendly View
        </button>
      </div>

      {/* Date & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search report names and descriptions..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold">Report Period:</span>
          <input
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* 8 Downloadable Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportItems
          .filter(r => r.title.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase()))
          .map(rep => {
            const Icon = rep.icon;
            return (
              <div
                key={rep.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 hover:border-slate-700 transition flex flex-col justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${rep.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm leading-snug">{rep.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{rep.description}</p>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono text-[11px]">Format: UTF-8 CSV</span>
                  <button
                    onClick={() => handleDownloadCSV(rep.id, rep.title)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md shadow-blue-600/20"
                  >
                    <Download className="w-4 h-4" /> Export CSV
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
