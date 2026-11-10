'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { 
  Menu, 
  Search, 
  Bell, 
  Plus, 
  Sun, 
  Moon, 
  ChevronDown, 
  UserPlus, 
  Car, 
  IndianRupee, 
  Calendar, 
  Award, 
  UserCheck, 
  X,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { Student } from '@/types';

interface OwnerTopNavProps {
  activeModule: string;
  isCollapsed: boolean;
  setIsMobileOpen: (open: boolean) => void;
  onOpenQuickAdd: (modalType: 'student' | 'instructor' | 'staff' | 'payment' | 'schedule' | 'vehicle') => void;
  onSelectStudent: (student: Student) => void;
}

export const OwnerTopNav: React.FC<OwnerTopNavProps> = ({
  activeModule,
  isCollapsed,
  setIsMobileOpen,
  onOpenQuickAdd,
  onSelectStudent
}) => {
  const { 
    currentUser, 
    theme, 
    toggleTheme, 
    notifications, 
    markNotificationRead, 
    students, 
    enrollments 
  } = useDrivingSchool();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showQuickAddMenu, setShowQuickAddMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const quickAddRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadNotifications = notifications.filter(n => !n.is_read);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
      if (quickAddRef.current && !quickAddRef.current.contains(e.target as Node)) {
        setShowQuickAddMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter students based on search
  const searchResults = searchQuery.trim()
    ? students.filter(s => 
        s.student_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone.includes(searchQuery)
      ).slice(0, 5)
    : [];

  const formatModuleName = (mod: string) => {
    switch (mod) {
      case 'dashboard': return 'Executive Overview';
      case 'students': return 'Students Directory';
      case 'admissions': return 'New Admissions';
      case 'instructors': return 'Instructors & Drivers';
      case 'staff': return 'Staff & Permissions';
      case 'courses': return 'Courses & Sessions';
      case 'attendance': return 'Attendance Logs';
      case 'schedule': return 'Class Schedules';
      case 'finances': return 'Fees & Payments';
      case 'licences': return 'RTO Driving Licences';
      case 'vehicles': return 'Fleet & Vehicles';
      case 'documents': return 'Document Vault';
      case 'notifications': return 'Notification Center';
      case 'reports': return 'Reports & Analytics';
      case 'audit': return 'Audit Logs';
      case 'settings': return 'System Settings';
      default: return mod;
    }
  };

  return (
    <header className="sticky top-[49px] z-20 bg-[#FFFFFF] dark:bg-[#0B1728] border-b border-[#E5EAF1] dark:border-[#1E293B] px-4 py-2.5 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumbs */}
          <nav className="flex items-center text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">Owner</span>
            <span className="mx-2 text-slate-400">/</span>
            <span className="font-semibold text-slate-900 dark:text-white capitalize">
              {formatModuleName(activeModule)}
            </span>
          </nav>
        </div>

        {/* Center: Global Student Search */}
        <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Quick search student by code, name or phone..."
              className="w-full bg-[#F5F7FB] dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {isSearchOpen && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-2xl shadow-xl overflow-hidden z-50 divide-y divide-slate-100 dark:divide-slate-800">
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 dark:bg-slate-900/50">
                Matching Student Records
              </div>
              {searchResults.map(s => {
                const enr = enrollments.find(e => e.student_id === s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      onSelectStudent(s);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full p-3 text-left hover:bg-blue-50/50 dark:hover:bg-slate-800/60 transition flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{s.full_name}</span>
                        <span className="px-1.5 py-0.2 rounded font-mono text-[10px] bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold">
                          {s.student_code}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                        {s.enrolled_course_name}
                      </span>
                    </div>
                    <div className="text-right text-[11px]">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {enr ? `${enr.completed_sessions}/${enr.total_sessions} Sessions` : '0/20'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5">
          {/* Quick Add Dropdown */}
          <div ref={quickAddRef} className="relative">
            <button
              onClick={() => setShowQuickAddMenu(!showQuickAddMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span className="hidden sm:inline">Quick Add</span>
              <ChevronDown className="w-3 h-3 ml-0.5" />
            </button>

            {showQuickAddMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-2xl shadow-2xl py-1.5 z-50 text-xs">
                <button
                  onClick={() => { onOpenQuickAdd('student'); setShowQuickAddMenu(false); }}
                  className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition"
                >
                  <UserPlus className="w-4 h-4 text-blue-500" /> Add Student
                </button>
                <button
                  onClick={() => { onOpenQuickAdd('instructor'); setShowQuickAddMenu(false); }}
                  className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition"
                >
                  <Award className="w-4 h-4 text-emerald-500" /> Add Instructor
                </button>
                <button
                  onClick={() => { onOpenQuickAdd('staff'); setShowQuickAddMenu(false); }}
                  className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition"
                >
                  <UserCheck className="w-4 h-4 text-purple-500" /> Add Staff Member
                </button>
                <button
                  onClick={() => { onOpenQuickAdd('payment'); setShowQuickAddMenu(false); }}
                  className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition"
                >
                  <IndianRupee className="w-4 h-4 text-emerald-500" /> Record Fee Payment
                </button>
                <button
                  onClick={() => { onOpenQuickAdd('schedule'); setShowQuickAddMenu(false); }}
                  className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition"
                >
                  <Calendar className="w-4 h-4 text-amber-500" /> Create Class Schedule
                </button>
                <button
                  onClick={() => { onOpenQuickAdd('vehicle'); setShowQuickAddMenu(false); }}
                  className="w-full px-3 py-2 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 transition"
                >
                  <Car className="w-4 h-4 text-cyan-500" /> Register Vehicle
                </button>
              </div>
            )}
          </div>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-[#E5EAF1] dark:border-[#1E293B] transition"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Notification Bell with Flyout */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-[#E5EAF1] dark:border-[#1E293B] transition"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-2xl shadow-2xl p-3 z-50 text-xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white">Notifications</span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold cursor-pointer">
                    {unreadNotifications.length} unread
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                  {notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2.5 rounded-xl border transition cursor-pointer ${
                        n.is_read 
                          ? 'bg-transparent border-transparent opacity-60' 
                          : 'bg-blue-50/50 dark:bg-slate-800/80 border-blue-200 dark:border-blue-900/40'
                      }`}
                    >
                      <span className="font-bold text-slate-900 dark:text-white block">{n.title}</span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                      <span className="text-[9px] text-slate-400 block mt-1 font-mono">
                        {new Date(n.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
