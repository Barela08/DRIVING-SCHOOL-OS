'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Menu, 
  Bell, 
  Sun, 
  Moon, 
  User, 
  HelpCircle, 
  ShieldCheck, 
  Car,
  ChevronDown,
  LogOut,
  GraduationCap,
  Calendar,
  Settings,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { Student } from '@/types';
import { StudentNavTab } from './StudentSidebar';

interface StudentHeaderProps {
  activeTab: StudentNavTab;
  onOpenMobileSidebar: () => void;
  onSelectTab: (tab: StudentNavTab) => void;
  student: Student;
  unreadCount: number;
}

export const StudentHeader: React.FC<StudentHeaderProps> = ({
  activeTab,
  onOpenMobileSidebar,
  onSelectTab,
  student,
  unreadCount
}) => {
  const router = useRouter();
  const { school, theme, toggleTheme, logoutUser, notifications } = useDrivingSchool();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [todayStr, setTodayStr] = useState('');
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTodayStr(new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }));
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setNotificationDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    router.push('/login');
  };

  const studentFirstName = student.full_name ? student.full_name.split(' ')[0] : 'Learner';
  const scopedNotifs = notifications.filter(n => !n.student_id || n.student_id === student.id).slice(0, 5);

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#070E1A]/95 backdrop-blur-md border-b border-[#E5EAF1] dark:border-[#1E293B] px-4 sm:px-6 py-2.5 transition-colors no-print">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left Section: Mobile Menu, Academy Logo, Student Portal Label & Personalized Greeting */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Model Driving Academy Logo & Student Portal Label */}
          <Link href="/student/dashboard" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#3B82F6] flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Car className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white">
                  {school.name || 'Model Driving Academy'}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-blue-600 text-white">
                  STUDENT PORTAL
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Official Learner Console
              </p>
            </div>
          </Link>

          {/* Vertical divider */}
          <div className="hidden md:block h-6 w-px bg-slate-200 dark:bg-slate-800" />

          {/* Personalized Greeting */}
          <div className="truncate">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              Welcome back, <span className="text-blue-600 dark:text-blue-400">{studentFirstName}</span>!
            </h2>
            <span className="text-[10px] text-slate-400 hidden lg:inline-block">
              {todayStr}
            </span>
          </div>
        </div>

        {/* Right Section: Notifications, Theme Toggle & Student Profile Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications Dropdown */}
          <div className="relative" ref={notifMenuRef}>
            <button
              onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
              className={`relative p-2 rounded-xl border transition ${
                activeTab === 'notifications' || notificationDropdownOpen
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/30'
                  : 'bg-slate-100 dark:bg-[#111E32] text-slate-600 dark:text-slate-300 border-[#E5EAF1] dark:border-[#1E293B] hover:text-blue-600 dark:hover:text-white'
              }`}
              title="Notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 p-3 bg-white dark:bg-[#111E32] rounded-2xl shadow-2xl border border-[#E5EAF1] dark:border-[#1E293B] z-50 animate-fadeIn space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-blue-500" />
                    Notifications ({unreadCount} unread)
                  </span>
                  <button
                    onClick={() => {
                      onSelectTab('notifications');
                      setNotificationDropdownOpen(false);
                    }}
                    className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-1.5 max-h-64 overflow-y-auto">
                  {scopedNotifs.length === 0 ? (
                    <p className="text-center py-4 text-xs text-slate-400">No new alerts.</p>
                  ) : (
                    scopedNotifs.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          onSelectTab('notifications');
                          setNotificationDropdownOpen(false);
                        }}
                        className="p-2 rounded-xl bg-slate-50 dark:bg-[#0B1728] border border-slate-100 dark:border-slate-800 text-xs cursor-pointer hover:border-blue-500 transition space-y-0.5"
                      >
                        <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">{n.title}</span>
                        <p className="text-[10px] text-slate-400 line-clamp-2">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 transition"
            title="Toggle Light/Dark Theme"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-blue-600" />
            )}
          </button>

          {/* Student Profile Menu Dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] hover:border-blue-500 transition group"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                {student.full_name ? student.full_name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="hidden md:block text-left">
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs leading-none">
                  {student.full_name}
                </span>
                <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400">
                  {student.student_code}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 p-2.5 bg-white dark:bg-[#111E32] rounded-2xl shadow-2xl border border-[#E5EAF1] dark:border-[#1E293B] z-50 animate-fadeIn space-y-2">
                <div className="p-2 border-b border-slate-100 dark:border-slate-800 space-y-0.5">
                  <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {student.full_name}
                  </div>
                  <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 block">
                    ID: {student.student_code}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate block">
                    {student.phone}
                  </span>
                </div>

                <div className="py-1 space-y-1 text-xs">
                  <button
                    onClick={() => {
                      onSelectTab('profile');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <User className="w-4 h-4 text-blue-500" />
                    <span>My Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectTab('course');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <GraduationCap className="w-4 h-4 text-emerald-500" />
                    <span>My Course & Progress</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectTab('calendar');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <Calendar className="w-4 h-4 text-purple-500" />
                    <span>Course Calendar</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectTab('help');
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <HelpCircle className="w-4 h-4 text-amber-500" />
                    <span>Help & Support</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-500/10 transition font-bold text-xs"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
