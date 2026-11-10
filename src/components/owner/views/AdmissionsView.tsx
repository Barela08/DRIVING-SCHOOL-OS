'use client';

import React, { useState } from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { Student } from '@/types';
import { UserPlus, CheckCircle2, Clock, FileCheck2, ArrowRight, Eye, Phone, IndianRupee } from 'lucide-react';

interface AdmissionsViewProps {
  onOpenStudent: (student: Student) => void;
  onQuickAdd: (type: any) => void;
}

export const AdmissionsView: React.FC<AdmissionsViewProps> = ({ onOpenStudent, onQuickAdd }) => {
  const { students, courses, enrollments, payments } = useDrivingSchool();

  const [activeStage, setActiveStage] = useState<'all' | 'Inquiry' | 'Registered' | 'Active' | 'Completed'>('all');

  const stageCounts = {
    all: students.length,
    Inquiry: students.filter(s => s.status === 'Inquiry').length,
    Registered: students.filter(s => s.status === 'Registered').length,
    Active: students.filter(s => s.status === 'Active').length,
    Completed: students.filter(s => s.status === 'Course Completed').length,
  };

  const filtered = students.filter(s => {
    if (activeStage === 'all') return true;
    if (activeStage === 'Completed') return s.status === 'Course Completed';
    return s.status === activeStage;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-blue-400" /> Admissions & Intake Funnel
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track inquiries, initial down payments, document readiness and learner batch onboarding.
          </p>
        </div>
        <button
          onClick={() => onQuickAdd('student')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-lg shadow-blue-600/20 self-start sm:self-center"
        >
          <UserPlus className="w-4 h-4" /> New Admission Intake
        </button>
      </div>

      {/* Funnel Stage Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { id: 'Inquiry', label: 'Inquiries', count: stageCounts.Inquiry, color: 'text-amber-400', icon: Clock },
          { id: 'Registered', label: 'Registered', count: stageCounts.Registered, color: 'text-blue-400', icon: FileCheck2 },
          { id: 'Active', label: 'In Training', count: stageCounts.Active, color: 'text-emerald-400', icon: CheckCircle2 },
          { id: 'Completed', label: 'Graduated', count: stageCounts.Completed, color: 'text-purple-400', icon: CheckCircle2 },
        ].map(stage => {
          const Icon = stage.icon;
          return (
            <div 
              key={stage.id} 
              onClick={() => setActiveStage(stage.id as any)}
              className={`bg-slate-900 border rounded-2xl p-4 shadow-lg cursor-pointer transition ${
                activeStage === stage.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">{stage.label}</span>
                <Icon className={`w-4 h-4 ${stage.color}`} />
              </div>
              <div className={`text-2xl font-black mt-2 tabular-nums ${stage.color}`}>{stage.count}</div>
              <span className="text-[10px] text-slate-500 block mt-1">Click to filter</span>
            </div>
          );
        })}
      </div>

      {/* Admissions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl space-y-4 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">
            Admissions Flow ({filtered.length} Learners)
          </h3>
          {activeStage !== 'all' && (
            <button
              onClick={() => setActiveStage('all')}
              className="text-xs text-blue-400 hover:underline"
            >
              Clear Filter (Show All)
            </button>
          )}
        </div>

        <div className="border border-slate-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[750px]">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Student Code</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Admission Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(stud => (
                <tr key={stud.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3 font-bold text-white flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-black text-xs">
                      {stud.full_name.charAt(0)}
                    </div>
                    <span>{stud.full_name}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-blue-400 font-semibold">{stud.student_code}</td>
                  <td className="px-4 py-3 text-slate-300">{stud.enrolled_course_name}</td>
                  <td className="px-4 py-3 text-slate-400">{stud.admission_date}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300">
                      {stud.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onOpenStudent(stud)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-bold transition text-xs"
                    >
                      <Eye className="w-3.5 h-3.5" /> Open File
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
