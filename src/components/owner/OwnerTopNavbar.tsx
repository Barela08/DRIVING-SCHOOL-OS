'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { OwnerNavSection } from './OwnerSidebar';
import { Student } from '@/types';
import { 
  Menu, 
  Search, 
  Bell, 
  Plus, 
  Sun, 
  Moon, 
  ChevronDown, 
  UserPlus, 
  Award, 
  Users2, 
  IndianRupee, 
  Calendar, 
  Car, 
  Check, 
  X, 
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  LogOut,
  User
} from 'lucide-react';

interface OwnerTopNavbarProps {
  activeSection: OwnerNavSection;
  onSelectSection: (section: OwnerNavSection) => void;
  onToggleMobileSidebar: () => void;
  onQuickAdd: (type: 'student' | 'instructor' | 'staff' | 'payment' | 'schedule' | 'vehicle') => void;
  onSelectStudent: (student: Student) => void;
  onLogout: () => void;
}

export const OwnerTopNavbar: React.FC<OwnerTopNavbarProps> = ({
  activeSection,
  onSelectSection,
  onToggleMobileSidebar,
  onQuickAdd,
  onSelectStudent,
  onLogout
}) => {
  const { 
    school, 
    currentUser, 
    theme, 
    toggleTheme, 
    students, 
    notifications, 
    markNotificationRead,
    markAllNotificationsRead 
  } = useDrivingSchool();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Quick Add dropdown state
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const quickAddRef = useRef<HTMLDivElement>(null);

  // Notifications dropdown state
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Profile dropdown state
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter(n => !n.is_read);

  // Filter students based on search query
  const searchResults = searchQuery.trim()
    ? students.filter(s => 
        s.student_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.phone.includes(searchQuery)
      ).slice(0, 5)
    : [];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (quickAddRef.current && !quickAddRef.current.contains(e.target as Node)) {
        setQuickAddOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sectionTitles: Record<OwnerNavSection, string> = {
    dashboard: 'Executive Dashboard',
    students: 'Student Directory',
    admissions: 'Admissions Pipeline',
    instructors: 'Instructors & Drivers',
    staff: 'Staff Management',
    courses: 'Courses & Curriculum',
    attendance: 'Attendance Registry',
    schedule: 'Driving Class Schedule',
    finances: 'Fees & Payment Ledger',
    licences: 'Driving Licence & RTO',
    fleet: 'Fleet & Maintenance',
    documents: 'Document Verification',
    notifications: 'Notifications Center',
    reports: 'Reports & Export Engine',
    audit: 'Immutable Audit Trail',
    settings: 'Organization Settings'
  };

  return (
    <header className="sticky top-0 z-20 bg-slate-900/95 dark:bg-[#070E1A]/95 backdrop-blur border-b border-slate-800 dark:border-[#1E293B] px-4 py-2.5 shadow-sm transition-colors no-print">
      <div className="flex items-center justify-between gap-3">
        {/* Left Section: Sidebar Toggle & Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumbs */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs">
            <span className="font-semibold text-slate-400">Owner Panel</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="font-bold text-white tracking-wide truncate">
              {sectionTitles[activeSection]}
            </span>
          </div>
        </div>

        {/* Center: Global Student Search with Autocomplete */}
        <div ref={searchRef} className="relative flex-1 max-w-md mx-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              placeholder="Global Search (Student Code, Name, Phone)..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-8 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {searchOpen && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 block">
                Matching Student Records ({searchResults.length})
              </span>
              {searchResults.length > 0 ? (
                <div className="space-y-1 mt-1">
                  {searchResults.map(s => (
                    <button
                      key={s.id}
                      onClick={() => {
                        onSelectStudent(s);
                        setSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 transition flex items-center justify-between group"
                    >
                      <div>
                        <span className="font-bold text-xs text-white group-hover:text-blue-400 transition block">
                          {s.full_name}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          {s.enrolled_course_name} • {s.phone}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold block">
                          {s.student_code}
                        </span>
                        <span className="text-[10px] text-emerald-400 block mt-1">Open 10-Tab File →</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-slate-400">
                  No students found matching &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Add Button with Dropdown */}
          <div ref={quickAddRef} className="relative">
            <button
              onClick={() => setQuickAddOpen(!quickAddOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md shadow-blue-600/20"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Quick Add</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>

            {quickAddOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 text-xs">
                <div className="px-3 py-1.5 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                  Create New Record
                </div>
                <button
                  onClick={() => { onQuickAdd('student'); setQuickAddOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800 transition"
                >
                  <UserPlus className="w-4 h-4 text-blue-400" />
                  <span>Add Student Admission</span>
                </button>
                <button
                  onClick={() => { onQuickAdd('payment'); setQuickAddOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800 transition"
                >
                  <IndianRupee className="w-4 h-4 text-emerald-400" />
                  <span>Record Fee Payment</span>
                </button>
                <button
                  onClick={() => { onQuickAdd('schedule'); setQuickAddOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800 transition"
                >
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>Create Class Schedule</span>
                </button>
                <button
                  onClick={() => { onQuickAdd('instructor'); setQuickAddOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800 transition"
                >
                  <Award className="w-4 h-4 text-purple-400" />
                  <span>Add Instructor</span>
                </button>
                <button
                  onClick={() => { onQuickAdd('staff'); setQuickAddOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800 transition"
                >
                  <Users2 className="w-4 h-4 text-indigo-400" />
                  <span>Add Staff Member</span>
                </button>
                <button
                  onClick={() => { onQuickAdd('vehicle'); setQuickAddOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800 transition"
                >
                  <Car className="w-4 h-4 text-cyan-400" />
                  <span>Add Vehicle</span>
                </button>
              </div>
            )}
          </div>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
          </button>

          {/* Notification Bell with Badge & Popover */}
          <div ref={notifRef} className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <span className="font-bold text-white">Notifications ({unreadNotifs.length} Unread)</span>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={() => markAllNotificationsRead()}
                      className="text-[10px] text-blue-400 hover:underline font-semibold"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.slice(0, 4).map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`p-2.5 rounded-xl border transition cursor-pointer ${
                        notif.is_read
                          ? 'bg-slate-950/40 border-slate-800/60 text-slate-400'
                          : 'bg-blue-500/10 border-blue-500/30 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold text-[11px] text-white">
                        <span>{notif.title}</span>
                        {!notif.is_read && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{notif.message}</p>
                      <span className="text-[9px] text-slate-500 block mt-1">
                        {new Date(notif.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800 mt-2 text-center">
                  <button
                    onClick={() => {
                      onSelectSection('notifications');
                      setNotifOpen(false);
                    }}
                    className="text-[11px] font-bold text-blue-400 hover:underline"
                  >
                    View All Notifications →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Owner Profile Dropdown */}
          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 transition"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                {currentUser.full_name.charAt(0)}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 text-xs">
                <div className="p-3 border-b border-slate-800 mb-1">
                  <span className="font-bold text-white block text-sm">{currentUser.full_name}</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">{currentUser.email}</span>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Highest Authority: Owner
                  </span>
                </div>

                <button
                  onClick={() => {
                    onSelectSection('settings');
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800 transition text-left"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Account & Academy Settings</span>
                </button>

                <button
                  onClick={() => {
                    onSelectSection('audit');
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-200 hover:text-white hover:bg-slate-800 transition text-left"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Security & Audit Trails</span>
                </button>

                <div className="border-t border-slate-800 my-1" />

                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of OS</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
