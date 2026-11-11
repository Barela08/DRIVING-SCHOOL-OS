'use client';

import React from 'react';
import { 
  User, 
  Car, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Calendar, 
  Award, 
  Clock, 
  FileCheck2,
  Lock
} from 'lucide-react';
import { Instructor, Vehicle, School } from '@/types';

interface InstructorProfileViewProps {
  instructor: Instructor;
  assignedVehicle?: Vehicle;
  school: School;
}

export const InstructorProfileView: React.FC<InstructorProfileViewProps> = ({
  instructor,
  assignedVehicle,
  school
}) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          Instructor Profile & Credentials
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Verified academy instructor account details, government driving licence records, and vehicle assignment.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              {instructor.full_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  {instructor.full_name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  {instructor.instructor_code}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Official RTO Certified Driving Instructor • {school.name}
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 self-start sm:self-auto">
            Active Instructor Staff
          </span>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Registered Phone</span>
            <div className="font-mono font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-500" />
              {instructor.phone}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Email Address</span>
            <div className="font-medium text-slate-900 dark:text-white text-sm flex items-center gap-2 truncate">
              <Mail className="w-3.5 h-3.5 text-blue-500" />
              {instructor.email || 'vikram.instructor@modeldriving.in'}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Driving Licence Number</span>
            <div className="font-mono font-bold text-amber-500 text-sm flex items-center gap-2">
              <FileCheck2 className="w-3.5 h-3.5 text-amber-500" />
              {instructor.licence_number || 'MH12-20150049182'}
            </div>
            <span className="text-[10px] text-slate-400">Class: LMV-TR / Transport Endorsed</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-1">
            <span className="text-[11px] text-slate-400 font-medium">Teaching Experience</span>
            <div className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-purple-500" />
              {instructor.experience_years} Years Professional Experience
            </div>
            <span className="text-[10px] text-slate-400">Over 350+ Students Graduated</span>
          </div>
        </div>

        {/* Assigned Vehicle Section */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-blue-500/5 border border-blue-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Assigned Training Vehicle
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {assignedVehicle ? `${assignedVehicle.brand} ${assignedVehicle.model}` : 'Maruti Swift Dzire'}
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-600 text-white font-mono">
              {assignedVehicle?.registration_number || 'MH-12-AB-1234'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-blue-500/20 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Transmission</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">Manual Dual-Brake</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Fitness Validity</span>
              <span className="font-mono text-emerald-600 font-semibold">Valid 2028</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">Dual Controls</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">RTO Certified</span>
            </div>
          </div>
        </div>

        {/* Security / RLS Note */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-xs flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-slate-900 dark:text-white block font-bold">Role-Based Access Policy Enforced</strong>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
              Your account operates with strict Instructor RLS permissions. You have full access to your assigned time slots and students. Administrative functions such as fee confirmation and course master edits are reserved for Academy Owners and Staff.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
