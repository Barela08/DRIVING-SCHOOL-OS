'use client';

import React, { useState } from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { FolderKanban, FileText, CheckCircle2, Clock, X, Search, ShieldCheck, Download } from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const { students, licenceRecords, addToast } = useDrivingSchool();

  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');

  // Synthetic KYC document entries based on registered students
  const docs = students.flatMap(s => {
    const lic = licenceRecords.find(l => l.student_id === s.id);
    return [
      {
        id: `doc-aadhaar-${s.id}`,
        studentId: s.id,
        studentName: s.full_name,
        studentCode: s.student_code,
        docTitle: 'Aadhaar Card (Identity & DOB Proof)',
        docCategory: 'Identity',
        uploadedAt: s.admission_date,
        status: 'Verified'
      },
      {
        id: `doc-form1a-${s.id}`,
        studentId: s.id,
        studentName: s.full_name,
        studentCode: s.student_code,
        docTitle: 'Form 1A Registered Doctor Medical Certificate',
        docCategory: 'Medical',
        uploadedAt: s.admission_date,
        status: 'Verified'
      },
      {
        id: `doc-ll-${s.id}`,
        studentId: s.id,
        studentName: s.full_name,
        studentCode: s.student_code,
        docTitle: 'Parivahan Learner Licence (LL) PDF',
        docCategory: 'RTO',
        uploadedAt: s.admission_date,
        status: lic?.ll_reference ? 'Verified' : 'Pending Verification'
      }
    ];
  });

  const filtered = docs.filter(d => {
    const matchesFilter = filterType === 'all' || d.docCategory === filterType;
    const matchesSearch = 
      d.studentName.toLowerCase().includes(search.toLowerCase()) ||
      d.studentCode.toLowerCase().includes(search.toLowerCase()) ||
      d.docTitle.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleVerify = (docTitle: string, studentName: string) => {
    addToast(`Document "${docTitle}" for ${studentName} verified!`, 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-blue-400" /> Student KYC & RTO Compliance Documents
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Centralized document vault: Aadhaar ID, Form 1A medical certificates, and official Sarathi LL copies.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by student, student code or document title..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Document Types</option>
            <option value="Identity">Identity Proof</option>
            <option value="Medical">Medical Form 1A</option>
            <option value="RTO">RTO Licences</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(doc => (
          <div
            key={doc.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3 hover:border-slate-700 transition"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                doc.status === 'Verified' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {doc.status}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-white text-xs leading-snug">{doc.docTitle}</h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Learner: <strong className="text-white">{doc.studentName}</strong> ({doc.studentCode})
              </p>
            </div>

            <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-500">Date: {doc.uploadedAt}</span>
              <button
                onClick={() => handleVerify(doc.docTitle, doc.studentName)}
                className="px-3 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-semibold transition"
              >
                Verify Document
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
