'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { UserRole } from '@/types';
import { 
  ShieldCheck, 
  Users, 
  Car, 
  GraduationCap, 
  KeyRound, 
  Building2, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { role, switchRole, currentUser, school } = useDrivingSchool();
  const pathname = usePathname();
  const router = useRouter();

  const roles: { id: UserRole; label: string; icon: any; route: string; color: string; badge: string }[] = [
    { 
      id: 'owner', 
      label: 'Owner / Admin', 
      icon: ShieldCheck, 
      route: '/owner', 
      color: 'bg-purple-600/20 text-purple-400 border-purple-500/30 hover:bg-purple-600/30',
      badge: 'All Access'
    },
    { 
      id: 'staff', 
      label: 'Desk Staff', 
      icon: Users, 
      route: '/staff', 
      color: 'bg-blue-600/20 text-blue-400 border-blue-500/30 hover:bg-blue-600/30',
      badge: 'Admissions & Fees'
    },
    { 
      id: 'instructor', 
      label: 'Driver / Instructor', 
      icon: Car, 
      route: '/instructor', 
      color: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-600/30',
      badge: '1-Click Attendance'
    },
    { 
      id: 'student', 
      label: 'Student Portal', 
      icon: GraduationCap, 
      route: '/student', 
      color: 'bg-amber-600/20 text-amber-400 border-amber-500/30 hover:bg-amber-600/30',
      badge: 'Progress & DL'
    }
  ];

  const handleRoleChange = (targetRole: UserRole, targetRoute: string) => {
    switchRole(targetRole);
    router.push(targetRoute);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 shadow-xl no-print">
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border-b border-slate-800/80 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-slate-300">{school.name}</span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">RTO Reg: {school.rto_registration_no}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400">Timezone: Asia/Kolkata</span>
            <span className="text-slate-600">|</span>
            <Link 
              href="/login" 
              className="flex items-center gap-1 text-slate-300 hover:text-amber-400 font-medium transition"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              Auth Login Page
            </Link>
          </div>
        </div>
      </div>

      {/* Main Switcher Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
            <Car className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-tight">DRIVING SCHOOL OS</h1>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                PRO 1.0
              </span>
            </div>
            <p className="text-xs text-slate-400">Digital Academy Management & RTO Lifecycle</p>
          </div>
        </Link>

        {/* Multi-Role Quick Switcher Pills */}
        <div className="flex items-center flex-wrap gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 px-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Switch Role:
          </span>
          {roles.map(r => {
            const Icon = r.icon;
            const isActive = role === r.id;
            return (
              <button
                key={r.id}
                onClick={() => handleRoleChange(r.id, r.route)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : ''}`} />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* Current User Badge */}
        <div className="hidden lg:flex items-center gap-2 text-xs bg-slate-800/60 border border-slate-700/60 px-3 py-1.5 rounded-lg">
          <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center font-bold text-amber-400 text-[11px]">
            {currentUser.full_name.charAt(0)}
          </div>
          <div>
            <div className="font-semibold text-slate-200">{currentUser.full_name}</div>
            <div className="text-[10px] text-slate-400 capitalize">{currentUser.role} Account</div>
          </div>
        </div>
      </div>
    </header>
  );
};
