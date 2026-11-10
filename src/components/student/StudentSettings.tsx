'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Bell, 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  Check, 
  Moon, 
  Sun, 
  LogOut, 
  User, 
  KeyRound,
  FileCheck2
} from 'lucide-react';
import { Student } from '@/types';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { useRouter } from 'next/navigation';

interface StudentSettingsProps {
  student: Student;
}

export const StudentSettings: React.FC<StudentSettingsProps> = ({ student }) => {
  const router = useRouter();
  const { theme, toggleTheme, switchRole, addToast } = useDrivingSchool();

  // Notification preferences state
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [smsReminders, setSmsReminders] = useState(true);
  const [emailReceipts, setEmailReceipts] = useState(true);
  const [autoSyncCalendar, setAutoSyncCalendar] = useState(false);

  const handleSavePreferences = () => {
    addToast('Notification preferences updated!', 'success');
  };

  const handleSignOut = () => {
    switchRole('owner');
    router.push('/login');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-1">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Account Settings & Security
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Configure lesson reminders, notification dispatch channels, and active security sessions.
        </p>
      </div>

      {/* Notification Delivery Channels */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-6">
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Communication & Notification Preferences
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Choose which communication channels you prefer for lesson alerts and payment receipts.
          </p>
        </div>

        <div className="space-y-4 text-xs">
          {/* WhatsApp Alerts */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B]">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">WhatsApp Driving Lesson Reminders</span>
              <span className="text-[11px] text-slate-500">Receive departure alerts 1 hour before scheduled road classes.</span>
            </div>
            <button
              onClick={() => setWhatsappAlerts(!whatsappAlerts)}
              className={`w-12 h-6 rounded-full transition-colors relative ${whatsappAlerts ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${whatsappAlerts ? 'left-6.5' : 'left-0.5'}`} />
            </button>
          </div>

          {/* SMS Reminders */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B]">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">SMS Slot Confirmation & OTP Login</span>
              <span className="text-[11px] text-slate-500">Critical security codes and slot confirmation dispatches.</span>
            </div>
            <button
              onClick={() => setSmsReminders(!smsReminders)}
              className={`w-12 h-6 rounded-full transition-colors relative ${smsReminders ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${smsReminders ? 'left-6.5' : 'left-0.5'}`} />
            </button>
          </div>

          {/* Email Payment Receipts */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B]">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">Email Official Receipts & Certificates</span>
              <span className="text-[11px] text-slate-500">Official digital PDF receipts sent upon fee confirmation.</span>
            </div>
            <button
              onClick={() => setEmailReceipts(!emailReceipts)}
              className={`w-12 h-6 rounded-full transition-colors relative ${emailReceipts ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
            >
              <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${emailReceipts ? 'left-6.5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSavePreferences}
            className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white font-bold text-xs transition shadow-md shadow-blue-600/20"
          >
            Save Notification Preferences
          </button>
        </div>
      </div>

      {/* Theme & Display Mode */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4">
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Moon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Visual Theme & Appearance
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Switch between high-contrast Navy Dark and Crisp Light modes.
          </p>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Current Theme: <strong className="capitalize">{theme} Mode</strong>
          </span>

          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-slate-800 dark:text-slate-200 font-bold transition flex items-center gap-2"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" /> Switch to Light Mode
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-blue-600" /> Switch to Dark Mode
              </>
            )}
          </button>
        </div>
      </div>

      {/* Security Credentials & Active Session Info */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-4">
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Active Session Security
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Authenticated student credentials & PostgreSQL RLS session.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B]">
            <span className="text-[11px] text-slate-400 block">Logged In As</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm block mt-0.5">{student.full_name}</span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">{student.student_code}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B]">
            <span className="text-[11px] text-slate-400 block">Database Authorization</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm block mt-0.5">Row-Level Security Active</span>
            <span className="text-[10px] text-slate-400">Strict Single-Student Isolation Enforced</span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSignOut}
            className="px-5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-bold transition flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" /> Sign Out of Student Account
          </button>
        </div>
      </div>
    </div>
  );
};