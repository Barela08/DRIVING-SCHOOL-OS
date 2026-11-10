'use client';

import React, { useState } from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { Student } from '@/types';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  Phone, 
  BookOpen, 
  IndianRupee, 
  Award, 
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileCheck2
} from 'lucide-react';

interface StudentsViewProps {
  onOpenStudent: (student: Student) => void;
  onQuickAdd: (type: any) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({ onOpenStudent, onQuickAdd }) => {
  const { students, courses, enrollments, payments, instructors } = useDrivingSchool();

  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'balance'>('date');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Filtered and sorted students
  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.student_code.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search);
    const matchesCourse = courseFilter === 'all' || s.enrolled_course_id === courseFilter;
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesCourse && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.full_name.localeCompare(b.full_name);
    if (sortBy === 'balance') {
      const enrA = enrollments.find(e => e.student_id === a.id)?.agreed_fee || 0;
      const paidA = payments.filter(p => p.student_id === a.id && p.status === 'Confirmed').reduce((x, y) => x + y.amount, 0);
      const enrB = enrollments.find(e => e.student_id === b.id)?.agreed_fee || 0;
      const paidB = payments.filter(p => p.student_id === b.id && p.status === 'Confirmed').reduce((x, y) => x + y.amount, 0);
      return (enrB - paidB) - (enrA - paidA);
    }
    return new Date(b.admission_date).getTime() - new Date(a.admission_date).getTime();
  });

  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = filteredStudents.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" /> Student Registry ({students.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete database of registered, active, on-hold and graduated driving academy learners.
          </p>
        </div>
        <button
          onClick={() => onQuickAdd('student')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-lg shadow-blue-600/20 self-start sm:self-center"
        >
          <UserPlus className="w-4 h-4" /> Add Student
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by code, full name, or phone number..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Course filter */}
          <select
            value={courseFilter}
            onChange={e => { setCourseFilter(e.target.value); setPage(1); }}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Courses</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Registered">Registered</option>
            <option value="Course Completed">Course Completed</option>
            <option value="On Hold">On Hold</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="date">Sort: Admission Date</option>
            <option value="name">Sort: Student Name</option>
            <option value="balance">Sort: Pending Balance</option>
          </select>
        </div>
      </div>

      {/* Main Students Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[850px]">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3.5">Learner & Code</th>
                <th className="px-4 py-3.5">Course Enrolled</th>
                <th className="px-4 py-3.5">Assigned Instructor</th>
                <th className="px-4 py-3.5">Total Package</th>
                <th className="px-4 py-3.5">Paid</th>
                <th className="px-4 py-3.5">Pending Dues</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {paginatedStudents.length > 0 ? (
                paginatedStudents.map(stud => {
                  const enr = enrollments.find(e => e.student_id === stud.id);
                  const paid = payments
                    .filter(p => p.student_id === stud.id && p.status === 'Confirmed')
                    .reduce((sum, p) => sum + p.amount, 0);
                  const agreed = enr?.agreed_fee || 12500;
                  const pending = Math.max(0, agreed - paid);

                  return (
                    <tr key={stud.id} className="hover:bg-slate-800/40 transition group">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
                            {stud.full_name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-white text-xs group-hover:text-blue-400 transition block">
                              {stud.full_name}
                            </span>
                            <span className="font-mono text-[10px] text-blue-400 block mt-0.5">
                              {stud.student_code} • {stud.phone}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-slate-200 block">{stud.enrolled_course_name}</span>
                        <span className="text-[10px] text-slate-400 block">{stud.admission_date}</span>
                      </td>
                      <td className="px-4 py-3.5 text-slate-300 font-medium">
                        {stud.assigned_instructor_name || 'Unassigned'}
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-white tabular-nums">
                        ₹{agreed.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-emerald-400 tabular-nums">
                        ₹{paid.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3.5 tabular-nums">
                        <span className={`font-bold ${pending > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                          ₹{pending.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          stud.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          stud.status === 'Registered' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                          stud.status === 'Course Completed' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                          'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {stud.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => onOpenStudent(stud)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-bold text-xs transition"
                        >
                          <Eye className="w-3.5 h-3.5" /> 10-Tab Profile
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500 text-xs">
                    No student records matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">
            Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filteredStudents.length)} of {filteredStudents.length} students
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-white px-2">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:pointer-events-none transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
