'use client';

import React from 'react';
import { 
  Menu, 
  Bell, 
  Sun, 
  Moon, 
  User, 
  HelpCircle, 
  ShieldCheck, 
  Sparkles,
  ChevronDown
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

const TAB_TITLES: Record<StudentNavTab, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'My Dashboard',
    subtitle: 'Track your driving lessons, payments and licence progress.'
  },
  certificate: {
    title: 'My Certificate',
    subtitle: 'Verified course completion certificate, digital QR credential and grade.'
  },
  profile: {
    title: 'My Profile',
    subtitle: 'Manage your verified identification and contact details.'
  },
  course: {
    title: 'My Course',
    subtitle: 'Detailed curriculum, assigned instructor and training vehicle.'
  },
  progress: {
    title: 'Driving Progress',
    subtitle: 'Session-wise curriculum mastery calculated from verified attendance.'
  },
  schedule: {
    title: 'My Schedule',
    subtitle: 'Upcoming driving lessons and calendar appointments.'
  },
  attendance: {
    title: 'Attendance History',
    subtitle: 'Audit-grade record of completed driving sessions and trainer remarks.'
  },
  fees: {
    title: 'Fees & Payments',
    subtitle: 'Clear breakdown of agreed fees, confirmed receipts and pending balances.'
  },
  licence: {
    title: 'Driving Licence Tracker',
    subtitle: 'Real-time status of your RTO Learner and Permanent Driving Licence.'
  },
  documents: {
    title: 'My Documents',
    subtitle: 'Private Supabase document vault with verified identity records.'
  },
  notifications: {
    title: 'Notifications',
    subtitle: 'Important class schedules, payment receipts and RTO reminders.'
  },
  help: {
    title: 'Help & Support',
    subtitle: 'Academy helpline, FAQs and request slot reschedule.'
  },
  settings: {
    title: 'Account Settings',
    subtitle: 'Preferences, notifications, security and session details.'
  }
};

export const StudentHeader: React.FC<StudentHeaderProps> = ({
  activeTab,
  onOpenMobileSidebar,
  onSelectTab,
  student,
  unreadCount
}) => {
  const { theme, toggleTheme, students, setActiveStudentId } = useDrivingSchool();
  const currentTabInfo = TAB_TITLES[activeTab] || TAB_TITLES.dashboard;

  return (
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-[#0B1728]/90 backdrop-blur-md border-b border-[#E5EAF1] dark:border-[#1E293B] px-4 sm:px-6 py-3 transition-colors no-print">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              {currentTabInfo.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              {currentTabInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Student Switcher Pill, Notifications, Help & Theme */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Student Privacy Switcher (Enables instant multi-student privacy testing) */}
          <div className="relative group">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#14243A] border border-[#E5EAF1] dark:border-[#1E293B] text-xs cursor-pointer hover:border-blue-500 transition">
              <div className="w-6 h-6 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-[11px]">
                {student.full_name.charAt(0)}
              </div>
              <div className="hidden md:block text-left">
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs leading-none">
                  {student.full_name}
                </span>
                <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400">
                  {student.student_code}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* Dropdown Menu to test Student Privacy Isolation */}
            <div className="absolute right-0 top-full mt-2 w-64 p-2 bg-white dark:bg-[#111E32] rounded-2xl shadow-2xl border border-[#E5EAF1] dark:border-[#1E293B] hidden group-hover:block z-50 animate-fadeIn">
              <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  🔒 Student Privacy Tester
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Switch active student to verify data isolation.
                </p>
              </div>

              <div className="py-1 space-y-1 max-h-56 overflow-y-auto">
                {students.map((s) => {
                  const isCurrent = s.id === student.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveStudentId(s.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition ${
                        isCurrent
                          ? 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/30'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="truncate">
                        <span className="block truncate font-medium">{s.full_name}</span>
                        <span className="text-[10px] font-mono text-slate-400">{s.student_code}</span>
                      </div>
                      {isCurrent && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white">Active</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Notifications Button with unread counter */}
          <button
            onClick={() => onSelectTab('notifications')}
            className={`relative p-2 rounded-xl border transition ${
              activeTab === 'notifications'
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/30'
                : 'bg-slate-100 dark:bg-[#14243A] text-slate-600 dark:text-slate-300 border-[#E5EAF1] dark:border-[#1E293B] hover:text-blue-600 dark:hover:text-white'
            }`}
            title="View Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Help Button */}
          <button
            onClick={() => onSelectTab('help')}
            className={`p-2 rounded-xl border transition ${
              activeTab === 'help'
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-slate-100 dark:bg-[#14243A] text-slate-600 dark:text-slate-300 border-[#E5EAF1] dark:border-[#1E293B] hover:text-blue-600 dark:hover:text-white'
            }`}
            title="Help & Support"
            aria-label="Help & Support"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-[#14243A] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 transition"
            title="Toggle Light/Dark Theme"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-blue-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};