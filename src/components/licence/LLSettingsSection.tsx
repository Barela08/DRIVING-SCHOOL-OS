'use client';

import React, { useState } from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { 
  Settings, 
  Bell, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { LLReminderSettings } from '@/types';
import { DEFAULT_LL_REMINDER_SETTINGS } from '@/lib/llTrackingEngine';

export const LLSettingsSection: React.FC = () => {
  const { llReminderSettings, updateLLReminderSettings, currentUser } = useDrivingSchool();

  const [form, setForm] = useState<LLReminderSettings>({
    ...llReminderSettings
  });
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateLLReminderSettings(form);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = () => {
    setForm(DEFAULT_LL_REMINDER_SETTINGS);
  };

  return (
    <div className="rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E5EAF1] dark:border-[#1E293B] gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Learning Licence Reminder Settings
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Configure school-wide automated triggers and reminders based on student attended class days
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Internal Policy Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-600 dark:text-amber-400">
            Internal Driving-School Progress Reminder Policy
          </p>
          <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
            The configured class-day threshold is an <strong>internal driving school operational policy</strong> to remind and assist students in timely RTO application. It is <strong>not</strong> a replacement for statutory government requirements (such as minimum age, medical certificate Form 1A, or address documentation on Sarathi Parivahan).
          </p>
        </div>
      </div>

      {/* Configuration Form */}
      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* 1. Global Enable/Disable Toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B]">
          <div className="space-y-1">
            <span className="font-bold text-sm text-slate-900 dark:text-white block">
              Enable Automatic LL Reminders
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              When enabled, attendance records are evaluated dynamically against your thresholds.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={e => setForm({ ...form, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        {/* 2. Threshold Configurations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Attended Class Days Required */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 dark:text-white">
                Attended Class Days Required *
              </label>
              <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-amber-500/20 text-amber-500">
                {form.required_attended_days} Days
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Number of distinct verified attended class dates before the student receives an LL application reminder. Multiple sessions on the same date count as 1 day.
            </p>
            <input
              type="number"
              min={1}
              max={60}
              required
              value={form.required_attended_days}
              onChange={e => setForm({ ...form, required_attended_days: Math.max(1, parseInt(e.target.value) || 1) })}
              className="w-full bg-white dark:bg-slate-950 border border-[#CBD5E1] dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono font-bold text-sm focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Minimum Completed Practical Sessions */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 dark:text-white">
                Minimum Completed Practical Sessions
              </label>
              <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-blue-500/20 text-blue-500">
                {form.min_completed_sessions || 0} Sessions
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Optional minimum completed session count required in addition to the distinct attended class days.
            </p>
            <input
              type="number"
              min={0}
              max={60}
              value={form.min_completed_sessions || 0}
              onChange={e => setForm({ ...form, min_completed_sessions: Math.max(0, parseInt(e.target.value) || 0) })}
              className="w-full bg-white dark:bg-slate-950 border border-[#CBD5E1] dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono font-bold text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* 3. Frequency & Target Notifications */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Reminder Frequency */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] space-y-2">
            <label className="font-bold text-slate-900 dark:text-white block">
              Reminder Frequency
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              How often to repeat reminder if student hasn't started application.
            </p>
            <select
              value={form.frequency}
              onChange={e => setForm({ ...form, frequency: e.target.value as any })}
              className="w-full bg-white dark:bg-slate-950 border border-[#CBD5E1] dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-amber-500"
            >
              <option value="once">Send Once (No repeat)</option>
              <option value="every_3_days">Repeat every 3 days</option>
              <option value="every_7_days">Repeat every 7 days (Weekly)</option>
              <option value="every_14_days">Repeat every 14 days (Fortnightly)</option>
            </select>
          </div>

          {/* Notify Owner Toggle */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex flex-col justify-between space-y-2">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">
                Notify Owner Dashboard
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Receive notification in Owner Dashboard and show in "Applications Pending"
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={form.notify_owner}
                onChange={e => setForm({ ...form, notify_owner: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-5 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
              <span className="ml-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {form.notify_owner ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>

          {/* Notify Student Toggle */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex flex-col justify-between space-y-2">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">
                Notify Student Dashboard
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Display prominent recommendation banner and action buttons in Student Portal
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={form.notify_student}
                onChange={e => setForm({ ...form, notify_student: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-5 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
              <span className="ml-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                {form.notify_student ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E5EAF1] dark:border-[#1E293B]">
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {form.updated_at ? (
              <span>Last updated: {new Date(form.updated_at).toLocaleString('en-IN')} by {form.updated_by || 'Admin'}</span>
            ) : (
              <span>Using default school rules</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4" /> Settings Saved!
              </span>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20 transition flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Rules...' : 'Save Reminder Rules'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
