'use client';

import React from 'react';
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  IndianRupee, 
  Car, 
  User, 
  Phone, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Sparkles,
  MapPin,
  Check
} from 'lucide-react';
import { Course, Enrollment, Instructor, Vehicle, AttendanceRecord, ClassSchedule } from '@/types';
import { StudentCourseCalendar } from './StudentCourseCalendar';

interface StudentCourseProps {
  course?: Course;
  enrollment: Enrollment;
  instructor?: Instructor;
  vehicle?: Vehicle;
  attendance?: AttendanceRecord[];
  schedules?: ClassSchedule[];
}

export const StudentCourse: React.FC<StudentCourseProps> = ({
  course,
  enrollment,
  instructor,
  vehicle,
  attendance,
  schedules
}) => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Course Main Hero Card */}
      <div className="bg-gradient-to-r from-[#14243A] via-[#111E32] to-[#0B1728] border border-blue-500/30 rounded-3xl p-6 sm:p-8 shadow-xl text-white space-y-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                {course?.category || '4W'} Comprehensive Program
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> {enrollment.status}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {enrollment.course_name}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {course?.description || 'Comprehensive driving training curriculum structured to build full vehicle handling mastery, advanced highway navigation, tight reverse parking, and RTO test readiness.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-right self-start md:self-auto shrink-0 space-y-1">
            <span className="text-[11px] text-slate-400 block">Agreed Course Fee</span>
            <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">
              ₹{enrollment.agreed_fee.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-emerald-400 block font-semibold">Includes RTO Documentation</span>
          </div>
        </div>

        {/* Course Key Metrics Pill Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80 text-xs relative z-10">
          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-400" /> Total Sessions
            </span>
            <span className="font-bold text-white text-sm">{enrollment.total_sessions} Practical Lessons</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-400" /> Start Date
            </span>
            <span className="font-bold text-white text-sm">{enrollment.start_date}</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Expected Completion
            </span>
            <span className="font-bold text-white text-sm">{enrollment.expected_end_date || '30 Days from Start'}</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Completed
            </span>
            <span className="font-bold text-amber-300 text-sm">{enrollment.completed_sessions} Sessions Done</span>
          </div>
        </div>
      </div>

      {/* 2-Column: Assigned Instructor & Vehicle Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Assigned Instructor Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Assigned Driving Instructor
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono">
              {instructor?.instructor_code || 'INS-01'}
            </span>
          </div>

          {instructor ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                  {instructor.full_name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">{instructor.full_name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{instructor.experience_years} Years Professional Driving Experience</p>
                  <span className="inline-block text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    Licence: {instructor.licence_number || 'Govt. Authorized Trainer'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Instructor Direct Line:</span>
                  <span className="text-sm font-mono font-bold text-slate-900 dark:text-white">{instructor.phone}</span>
                </div>
                <a
                  href={`tel:${instructor.phone}`}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md shadow-blue-600/20 flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Now
                </a>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">Instructor will be allocated prior to your cockpit session.</p>
          )}
        </div>

        {/* Assigned Training Vehicle Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Car className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Assigned Training Vehicle
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              RTO Fitness Certified
            </span>
          </div>

          {vehicle ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Car className="w-7 h-7 stroke-[2]" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">
                    {vehicle.brand} {vehicle.model}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Transmission: {vehicle.vehicle_type === '4W_Manual' ? 'Manual (5-Speed)' : 'Automatic'} • Fuel: {vehicle.fuel_type || 'Petrol'}
                  </p>
                  <span className="inline-block text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400">
                    Plate: {vehicle.registration_number}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Dual Control Safety Pedals:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {vehicle.is_dual_control ? 'Fitted & Certified by RTO Inspector' : 'Standard'}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                  Dual Brake & Clutch
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">Dedicated vehicle allocated on class dispatch.</p>
          )}
        </div>
      </div>

      {/* Curriculum Syllabus Modules Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Structured Syllabus & Lesson Allocations
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Every student completes these modular lessons step-by-step to build progressive road confidence.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
            {enrollment.session_allocations?.length || 0} Modules
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {enrollment.session_allocations?.map((sa, idx) => {
            const isDone = sa.completed_count >= sa.allocated_count;
            return (
              <div key={sa.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold text-slate-500 flex items-center justify-center text-[11px] shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{sa.session_name_snapshot}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Module #{idx + 1}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                      {sa.completed_count} / {sa.allocated_count} Sessions
                    </span>
                  </div>

                  {isDone ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" /> Completed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {sa.allocated_count - sa.completed_count} Remaining
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Course Duration Calendar Progress */}
      {attendance && (
        <div className="pt-2">
          <StudentCourseCalendar
            enrollment={enrollment}
            course={course}
            attendance={attendance}
            schedules={schedules || []}
            instructor={instructor}
            vehicle={vehicle}
          />
        </div>
      )}
    </div>
  );
};