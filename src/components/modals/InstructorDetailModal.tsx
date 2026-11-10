'use client';

import React from 'react';
import { Instructor } from '@/types';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { X, Award, Phone, Mail, Car, Users, CheckCircle2, Calendar, ShieldCheck } from 'lucide-react';

interface InstructorDetailModalProps {
  instructor: Instructor | null;
  onClose: () => void;
}

export const InstructorDetailModal: React.FC<InstructorDetailModalProps> = ({ instructor, onClose }) => {
  const { students, attendanceRecords, schedules, updateInstructor, addToast } = useDrivingSchool();

  if (!instructor) return null;

  const assignedStudents = students.filter(s => s.assigned_instructor_id === instructor.id);
  const instructorAttendance = attendanceRecords.filter(a => a.instructor_id === instructor.id);
  const instructorSchedules = schedules.filter(s => s.instructor_id === instructor.id);

  const toggleStatus = async () => {
    const nextStatus = instructor.employment_status === 'active' ? 'on_leave' : 'active';
    await updateInstructor(instructor.id, { employment_status: nextStatus });
    addToast(`Instructor ${instructor.full_name} status marked as ${nextStatus}!`, 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-2xl w-full border border-slate-800 shadow-2xl p-6 space-y-6 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20 shrink-0">
              {instructor.full_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">{instructor.full_name}</h3>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                  {instructor.instructor_code}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  instructor.employment_status === 'active' 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {instructor.employment_status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {instructor.phone}</span>
                <span>•</span>
                <span>Experience: {instructor.experience_years} Years</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-slate-400 block mb-1">Active Students</span>
            <span className="text-xl font-black text-white tabular-nums">{assignedStudents.length}</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-slate-400 block mb-1">Sessions Completed</span>
            <span className="text-xl font-black text-emerald-400 tabular-nums">{instructorAttendance.length}</span>
          </div>
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-slate-400 block mb-1">Assigned Vehicle</span>
            <span className="text-xs font-bold text-white block mt-1 truncate">
              {instructor.assigned_vehicle_name || 'Maruti Swift Dzire'}
            </span>
          </div>
        </div>

        {/* Assigned Students */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
            <span>Currently Assigned Learners ({assignedStudents.length})</span>
          </h4>
          {assignedStudents.length > 0 ? (
            <div className="border border-slate-800 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="px-3 py-2.5">Student</th>
                    <th className="px-3 py-2.5">Course</th>
                    <th className="px-3 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {assignedStudents.map(s => (
                    <tr key={s.id} className="hover:bg-slate-800/40">
                      <td className="px-3 py-2.5 font-bold text-white">
                        {s.full_name} <span className="font-normal text-slate-400">({s.student_code})</span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-300">{s.enrolled_course_name}</td>
                      <td className="px-3 py-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800">
              No students assigned currently.
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
          <button
            onClick={toggleStatus}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              instructor.employment_status === 'active'
                ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30'
                : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30'
            }`}
          >
            {instructor.employment_status === 'active' ? 'Mark On Leave / Inactive' : 'Activate Instructor'}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
