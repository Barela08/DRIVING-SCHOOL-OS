'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  User, 
  GraduationCap, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  IndianRupee, 
  ShieldCheck, 
  FolderLock, 
  Bell, 
  HelpCircle, 
  Settings, 
  LogOut, 
  Car, 
  ChevronRight,
  Sun,
  Moon,
  Sparkles,
  X,
  Award
} from 'lucide-react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { Student } from '@/types';

export type StudentNavTab = 
  | 'dashboard'
  | 'calendar'
  | 'certificate'
  | 'profile'
  | 'course'
  | 'progress'
  | 'schedule'
  | 'attendance'
  | 'fees'
  | 'licence'
  | 'documents'
  | 'notifications'
  | 'help'
  | 'settings';

interface StudentSidebarProps {
  activeTab: StudentNavTab;
  onSelectTab: (tab: StudentNavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  student: Student;
  unreadCount: number;
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  student,
  unreadCount
}) => {
  const router = useRouter();
  const { school, theme, toggleTheme, logoutUser } = useDrivingSchool();

  const navItems = [
    { id: 'dashboard' as StudentNavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar' as StudentNavTab, label: 'Course Calendar', icon: Calendar },
    { id: 'certificate' as StudentNavTab, label: 'My Certificate', icon: Award },
    { id: 'profile' as StudentNavTab, label: 'My Profile', icon: User },
    { id: 'course' as StudentNavTab, label: 'My Course', icon: GraduationCap },
    { id: 'progress' as StudentNavTab, label: 'Driving Progress', icon: TrendingUp },
    { id: 'schedule' as StudentNavTab, label: 'My Schedule', icon: Calendar },
    { id: 'attendance' as StudentNavTab, label: 'Attendance History', icon: CheckCircle2 },
    { id: 'fees' as StudentNavTab, label: 'Fees & Payments', icon: IndianRupee },
    { id: 'licence' as StudentNavTab, label: 'Driving Licence', icon: ShieldCheck },
    { id: 'documents' as StudentNavTab, label: 'My Documents', icon: FolderLock },
    { 
      id: 'notifications' as StudentNavTab, 
      label: 'Notifications', 
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    { id: 'help' as StudentNavTab, label: 'Help & Support', icon: HelpCircle },
  ];

  const handleLogout = async () => {
    await logoutUser();
    router.push('/login');
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#111E32] text-slate-200 border-r border-[#1E293B]">
      {/* Brand & School Logo */}
      <div className="p-4 sm:p-5 border-b border-[#1E293B] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#3B82F6] flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition">
            <Car className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black text-white tracking-tight">STUDENT PORTAL</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[150px]">{school.name}</p>
          </div>
        </Link>

        {/* Mobile close button */}
        <button 
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Authenticated Student Mini Card */}
      <div className="p-4 mx-3 my-3 rounded-2xl bg-[#0B1728]/80 border border-[#1E293B] space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-md">
            {student.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <h2 className="text-xs font-bold text-white truncate">{student.full_name}</h2>
            <span className="inline-block px-1.5 py-0.2 rounded font-mono text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {student.student_code}
            </span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="truncate">{student.enrolled_course_name || 'Enrolled Student'}</span>
          <span className="inline-flex items-center gap-1 text-emerald-400 text-[10px] font-semibold shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
          </span>
        </div>
      </div>

      {/* Main Navigation Items */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-none" aria-label="Student Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                isActive
                  ? 'bg-[#2563EB] text-white font-bold shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-[#14243A]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 font-mono">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Controls */}
      <div className="p-3 border-t border-[#1E293B] space-y-1.5 bg-[#0B1728]/50">
        <button
          onClick={() => {
            onSelectTab('settings');
            onCloseMobile();
          }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
            activeTab === 'settings'
              ? 'bg-[#2563EB] text-white font-bold'
              : 'text-slate-400 hover:text-white hover:bg-[#14243A]'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Account Settings</span>
        </button>

        <div className="flex items-center justify-between px-3 py-2 text-xs text-slate-400">
          <span className="text-[11px]">Theme</span>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#14243A] hover:bg-slate-800 text-slate-300 text-xs transition border border-slate-700/60"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px]">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[11px]">Dark</span>
              </>
            )}
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Persistent) */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Slide-out) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Slide-out panel */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-50 transform transition-transform">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};