'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Car, 
  Bell, 
  User, 
  LogOut, 
  Menu, 
  Search, 
  ChevronDown, 
  ShieldCheck, 
  Moon, 
  Sun,
  Calendar,
  Clock
} from 'lucide-react';
import { Instructor, School, NotificationItem } from '@/types';

interface InstructorTopNavbarProps {
  school: School;
  instructor: Instructor;
  notifications: NotificationItem[];
  onToggleMobileSidebar: () => void;
  onOpenQuickCheckIn: () => void;
  onNavigate: (module: string) => void;
  onLogout: () => void;
  theme?: string;
  onToggleTheme?: () => void;
}

export const InstructorTopNavbar: React.FC<InstructorTopNavbarProps> = ({
  school,
  instructor,
  notifications,
  onToggleMobileSidebar,
  onOpenQuickCheckIn,
  onNavigate,
  onLogout,
  theme,
  onToggleTheme
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter(n => !n.is_read);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-[#111E32] text-white border-b border-[#1E293B] shadow-lg">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle + Academy Brand Logo and Name */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/instructor/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-tight text-white block">
                  {school.name || 'Model Driving Academy'}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  INSTRUCTOR
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block font-medium">
                Field Training & Attendance Console
              </span>
            </div>
          </Link>
        </div>

        {/* Center/Right: Quick Search Button & Instructor Badges */}
        <div className="flex items-center gap-3">
          {/* Quick Check-in CTA Button */}
          <button
            onClick={onOpenQuickCheckIn}
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Student Check-in</span>
          </button>

          {/* Instructor Identity Info Pill */}
          <div className="hidden md:flex flex-col text-right pr-2">
            <span className="text-xs font-bold text-white">
              {instructor.full_name}
            </span>
            <span className="text-[11px] font-mono text-blue-400 font-semibold">
              ID: {instructor.instructor_code}
            </span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#111E32] rounded-2xl border border-[#E5EAF1] dark:border-[#1E293B] shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#0B1728]/50">
                  <span className="font-bold text-xs">Instructor Notifications</span>
                  <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                    {unreadNotifs.length} Unread
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {notifications.slice(0, 5).map(n => (
                    <div key={n.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                      <div className="font-semibold text-slate-900 dark:text-white text-[11px]">{n.title}</div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="p-4 text-center text-slate-400 text-xs">No notifications</div>
                  )}
                </div>
                <div className="p-2 border-t border-slate-100 dark:border-slate-800 text-center bg-slate-50 dark:bg-[#0B1728]/50">
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(false);
                      onNavigate('notifications');
                    }}
                    className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    View All Notifications &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 transition text-left"
              aria-label="Profile menu"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                {instructor.full_name.charAt(0)}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#111E32] rounded-2xl border border-[#E5EAF1] dark:border-[#1E293B] shadow-2xl p-2 text-slate-900 dark:text-slate-100 z-50 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                  <div className="font-bold text-slate-900 dark:text-white truncate">
                    {instructor.full_name}
                  </div>
                  <div className="font-mono text-[10px] text-blue-600 dark:text-blue-400">
                    {instructor.instructor_code}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onNavigate('profile');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition"
                >
                  <User className="w-4 h-4 text-blue-500" />
                  <span>My Profile & Car</span>
                </button>

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onNavigate('schedule');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition"
                >
                  <Calendar className="w-4 h-4 text-emerald-500" />
                  <span>My Class Schedule</span>
                </button>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-bold transition"
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
