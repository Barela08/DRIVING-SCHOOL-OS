'use client';

import React from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { Instructor } from '@/types';
import { Award, UserPlus, Phone, Mail, Car, Users, CheckCircle2, ShieldAlert } from 'lucide-react';

interface InstructorsViewProps {
  onOpenInstructor: (instructor: Instructor) => void;
  onQuickAdd: (type: any) => void;
}

export const InstructorsView: React.FC<InstructorsViewProps> = ({ onOpenInstructor, onQuickAdd }) => {
  const { instructors, students, attendanceRecords, updateInstructor, addToast } = useDrivingSchool();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-400" /> Driving Instructors & Fleet Pilots ({instructors.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Certified instructors, assigned dual-pedal vehicles, and operational quotas. (No arbitrary performance rankings).
          </p>
        </div>
        <button
          onClick={() => onQuickAdd('instructor')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-600/20 self-start sm:self-center"
        >
          <UserPlus className="w-4 h-4" /> Add Certified Instructor
        </button>
      </div>

      {/* Instructor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {instructors.map(ins => {
          const assignedCount = students.filter(s => s.assigned_instructor_id === ins.id).length;
          const totalSessions = attendanceRecords.filter(a => a.instructor_id === ins.id).length;

          return (
            <div 
              key={ins.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-lg shadow-md shrink-0">
                    {ins.full_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{ins.full_name}</h3>
                    <span className="font-mono text-xs text-amber-400 font-bold block">{ins.instructor_code}</span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  ins.employment_status === 'active' 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {ins.employment_status}
                </span>
              </div>

              <div className="space-y-2 text-xs border-y border-slate-800 py-3 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Phone:</span>
                  <span className="font-semibold text-white">{ins.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Licence No:</span>
                  <span className="font-mono text-slate-300">{ins.licence_number || 'Verified RTO'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Experience:</span>
                  <span className="font-semibold text-white">{ins.experience_years} Years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned Car:</span>
                  <span className="font-semibold text-cyan-400 truncate max-w-[160px]">
                    {ins.assigned_vehicle_name || 'Maruti Swift (MH-12)'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Active Learners</span>
                  <span className="text-base font-black text-white tabular-nums mt-0.5 block">{assignedCount}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Classes Taken</span>
                  <span className="text-base font-black text-emerald-400 tabular-nums mt-0.5 block">{totalSessions}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => onOpenInstructor(ins)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
                >
                  View Details
                </button>
                <button
                  onClick={async () => {
                    const next = ins.employment_status === 'active' ? 'on_leave' : 'active';
                    await updateInstructor(ins.id, { employment_status: next });
                    addToast(`Instructor ${ins.full_name} status updated to ${next}`, 'info');
                  }}
                  className="px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-semibold transition"
                >
                  {ins.employment_status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
