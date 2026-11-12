'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { UserRole } from '@/types';
import { 
  ShieldCheck, 
  Users, 
  Car, 
  GraduationCap, 
  KeyRound, 
  Sparkles,
  BookOpen,
  Phone,
  UserPlus
} from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { role, switchRole, currentUser, school } = useDrivingSchool();
  const router = useRouter();

  const roles: { id: UserRole; label: string; icon: any; route: string }[] = [
    { 
      id: 'owner', 
      label: 'Owner / Admin', 
      icon: ShieldCheck, 
      route: '/owner/dashboard'
    },
    { 
      id: 'staff', 
      label: 'Desk Staff', 
      icon: Users, 
      route: '/staff/dashboard'
    },
    { 
      id: 'instructor', 
      label: 'Instructor PWA', 
      icon: Car, 
      route: '/instructor/dashboard'
    },
    { 
      id: 'student', 
      label: 'Student Portal', 
      icon: GraduationCap, 
      route: '/student/dashboard'
    }
  ];

  const handleRoleChange = (targetRole: UserRole, targetRoute: string) => {
    switchRole(targetRole);
    router.push(targetRoute);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#111E32] border-b border-[#1E293B] text-slate-100 shadow-xl no-print">
      {/* Top Banner Bar */}
      <div className="bg-[#0B1728] border-b border-[#1E293B] px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {school.logo_url && <img src={school.logo_url} alt="" className="w-5 h-5 rounded object-contain bg-white" />}
            <span className="font-semibold text-slate-200">{school.name}</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">RTO Reg: {school.rto_registration_no}</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-blue-400 hidden sm:inline">Asia/Kolkata (IST)</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/courses" className="text-slate-400 hover:text-white transition hidden md:inline">Courses</Link>
            <Link href="/about" className="text-slate-400 hover:text-white transition hidden md:inline">About</Link>
            <Link href="/contact" className="text-slate-400 hover:text-white transition hidden md:inline">Contact</Link>
            <Link href="/admission" className="text-blue-400 hover:text-blue-300 font-bold transition flex items-center gap-1">
              <UserPlus className="w-3 h-3" /> Admission
            </Link>
            <span className="text-slate-600">|</span>
            <Link 
              href="/login" 
              className="flex items-center gap-1 text-slate-300 hover:text-blue-400 font-medium transition"
            >
              <KeyRound className="w-3.5 h-3.5 text-blue-400" />
              Auth Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main Switcher Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 group-hover:scale-105 transition font-bold">
            <Car className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">DRIVING SCHOOL OS</h1>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                PRO 1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Single Driving School Management System</p>
          </div>
        </Link>

        {/* Multi-Role Quick Switcher Pills */}
        <div className="flex items-center flex-wrap gap-1 bg-[#0B1728] p-1 rounded-2xl border border-[#1E293B]">
          <span className="text-[11px] font-semibold text-slate-400 px-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-400" /> Switch Role:
          </span>
          {roles.map(r => {
            const Icon = r.icon;
            const isActive = role === r.id;
            return (
              <button
                key={r.id}
                onClick={() => handleRoleChange(r.id, r.route)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-[#14243A]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* Current User Badge */}
        <div className="hidden lg:flex items-center gap-2 text-xs bg-[#0B1728] border border-[#1E293B] px-3 py-1.5 rounded-xl">
          <div className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-300 flex items-center justify-center font-bold text-[11px]">
            {currentUser.full_name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-white leading-tight">{currentUser.full_name}</div>
            <div className="text-[10px] text-slate-400 capitalize">{currentUser.role} Account</div>
          </div>
        </div>
      </div>
    </header>
  );
};
