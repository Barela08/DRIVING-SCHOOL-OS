'use client';

import React, { useState } from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { Course } from '@/types';
import { BookOpen, Plus, ShieldCheck, Check, Clock, IndianRupee, Layers, AlertCircle, Edit3 } from 'lucide-react';

export const CoursesView: React.FC = () => {
  const { courses, students, addCourse, updateCourse, addToast } = useDrivingSchool();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [courseForm, setCourseForm] = useState({
    name: '',
    description: '',
    category: '4W' as '2W' | '4W' | 'Commercial' | 'Combo',
    durationDays: 30,
    price: 12500,
    templates: [
      { sessionName: 'Simulator & Controls Familiarization', sessionCode: 'SIM', totalSessions: 2 },
      { sessionName: 'Track Driving & Ground Manoeuvres', sessionCode: 'TRK', totalSessions: 4 },
      { sessionName: 'City Traffic & Junction Discipline', sessionCode: 'CTY', totalSessions: 8 },
      { sessionName: 'Highway & Lane Overtaking', sessionCode: 'HWY', totalSessions: 3 },
      { sessionName: 'Parallel & Reverse Box Parking', sessionCode: 'PRK', totalSessions: 2 },
      { sessionName: 'Night Driving & Emergency Hazards', sessionCode: 'NGT', totalSessions: 1 }
    ]
  });

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.name) {
      alert('Please enter course name');
      return;
    }
    if (editingCourse) {
      await updateCourse(editingCourse.id, {
        name: courseForm.name,
        description: courseForm.description,
        price: Number(courseForm.price),
        duration_days: Number(courseForm.durationDays)
      });
      addToast(`Course "${courseForm.name}" updated successfully.`, 'success');
    } else {
      await addCourse({
        name: courseForm.name,
        description: courseForm.description,
        category: courseForm.category,
        durationDays: Number(courseForm.durationDays),
        price: Number(courseForm.price),
        templates: courseForm.templates
      });
      addToast(`Course "${courseForm.name}" published with session quota blueprint.`, 'success');
    }
    setModalOpen(false);
    setEditingCourse(null);
  };

  const handleToggleCourseActive = async (course: Course) => {
    await updateCourse(course.id, { is_active: !course.is_active });
    addToast(`Course "${course.name}" ${!course.is_active ? 'Activated' : 'Deactivated'}.`, 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-400" /> Driving Courses & Session Quota Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure course packages, practical quotas, pricing, and category breakdowns.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCourse(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-lg shadow-blue-600/20 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" /> Create New Course
        </button>
      </div>

      {/* Regulatory Immutable Snapshot Notice */}
      <div className="bg-blue-950/40 border border-blue-800/60 rounded-2xl p-4 text-xs flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-white block font-bold">Standard Regulatory Isolation Guaranteed</strong>
          <span className="text-slate-300">
            When you adjust course prices or session categories below, existing student enrollments retain their immutable session snapshot allocations. Historical quota records are never retroactively overwritten.
          </span>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map(crs => {
          const enrolledCount = students.filter(s => s.enrolled_course_id === crs.id).length;
          const totalSessions = crs.templates?.reduce((acc, t) => acc + t.total_sessions, 0) || 20;

          return (
            <div
              key={crs.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 hover:border-slate-700 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-base">{crs.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300">
                      {crs.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{crs.description}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  crs.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
                }`}>
                  {crs.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 text-xs bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center">
                <div>
                  <span className="text-slate-400 text-[10px] block">Course Fee</span>
                  <span className="text-sm font-black text-white tabular-nums mt-0.5 block">
                    ₹{crs.price.toLocaleString('en-IN')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Duration</span>
                  <span className="text-sm font-black text-white tabular-nums mt-0.5 block">
                    {crs.duration_days} Days
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Total Sessions</span>
                  <span className="text-sm font-black text-blue-400 tabular-nums mt-0.5 block">
                    {totalSessions} Quotas
                  </span>
                </div>
              </div>

              {/* Session breakdown template tags */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Curriculum Module Breakdown:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(crs.templates || []).map(t => (
                    <span 
                      key={t.id}
                      className="px-2 py-1 rounded-lg bg-slate-800 text-[11px] text-slate-300 flex items-center gap-1.5 border border-slate-700/50"
                    >
                      <span className="font-semibold">{t.session_name}</span>
                      <strong className="text-blue-400">({t.total_sessions})</strong>
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer actions */}
              <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">
                  {enrolledCount} Active Learners Enrolled
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingCourse(crs);
                      setCourseForm({
                        name: crs.name,
                        description: crs.description,
                        category: crs.category,
                        durationDays: crs.duration_days,
                        price: crs.price,
                        templates: (crs.templates || []).map(t => ({
                          sessionName: t.session_name,
                          sessionCode: t.session_code,
                          totalSessions: t.total_sessions
                        }))
                      });
                      setModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
                  >
                    Edit Pricing
                  </button>
                  <button
                    onClick={() => handleToggleCourseActive(crs)}
                    className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-semibold transition"
                  >
                    {crs.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Course Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 text-xs shadow-2xl my-auto">
            <h3 className="text-base font-bold text-white">
              {editingCourse ? 'Edit Course Template' : 'Create New Driving Course'}
            </h3>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Course Name *</label>
                <input
                  type="text"
                  required
                  value={courseForm.name}
                  onChange={e => setCourseForm({ ...courseForm, name: e.target.value })}
                  placeholder="e.g. 4W Defensive Highway & Night Masterclass"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Description</label>
                <input
                  type="text"
                  value={courseForm.description}
                  onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Package Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={courseForm.price}
                    onChange={e => setCourseForm({ ...courseForm, price: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 tabular-nums"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    value={courseForm.durationDays}
                    onChange={e => setCourseForm({ ...courseForm, durationDays: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-lg shadow-blue-500/20"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
