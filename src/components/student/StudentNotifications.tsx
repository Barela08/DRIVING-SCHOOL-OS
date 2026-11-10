'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  IndianRupee, 
  ShieldCheck, 
  CheckCheck, 
  Filter,
  Car,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { NotificationItem, Student } from '@/types';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { StudentNavTab } from './StudentSidebar';

interface StudentNotificationsProps {
  notifications: NotificationItem[];
  student: Student;
  onSelectTab: (tab: StudentNavTab) => void;
}

export const StudentNotifications: React.FC<StudentNotificationsProps> = ({
  notifications,
  student,
  onSelectTab
}) => {
  const { markNotificationRead, markAllNotificationsRead } = useDrivingSchool();
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'unread' | 'schedule' | 'attendance' | 'payment' | 'licence'>('all');

  // Filter scoped notifications for this student
  const filteredNotifications = notifications.filter(notif => {
    // Only student's notifications or global announcements
    if (notif.student_id && notif.student_id !== student.id) {
      return false;
    }

    if (categoryFilter === 'unread') return !notif.is_read;
    if (categoryFilter !== 'all') return notif.category === categoryFilter;

    return true;
  });

  const unreadTotal = notifications.filter(n => (!n.student_id || n.student_id === student.id) && !n.is_read).length;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'schedule':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      case 'attendance':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'payment':
        return <IndianRupee className="w-4 h-4 text-emerald-500" />;
      case 'licence':
        return <ShieldCheck className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4 text-amber-500" />;
    }
  };

  const handleActionClick = (notif: NotificationItem) => {
    if (!notif.is_read) {
      markNotificationRead(notif.id);
    }

    if (notif.category === 'schedule') onSelectTab('schedule');
    else if (notif.category === 'attendance') onSelectTab('attendance');
    else if (notif.category === 'payment') onSelectTab('fees');
    else if (notif.category === 'licence') onSelectTab('licence');
    else onSelectTab('dashboard');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Notifications Header & Controls */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Notifications & Alerts
            </h2>
            {unreadTotal > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 font-mono">
                {unreadTotal} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Lesson schedule reminders, attendance receipts, and RTO test date alerts.
          </p>
        </div>

        {unreadTotal > 0 && (
          <button
            onClick={() => markAllNotificationsRead(student.id)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 transition flex items-center gap-1.5 self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" /> Mark All as Read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'unread', label: `Unread (${unreadTotal})` },
          { id: 'schedule', label: 'Class Schedules' },
          { id: 'attendance', label: 'Attendance' },
          { id: 'payment', label: 'Payments & Fees' },
          { id: 'licence', label: 'Licence & RTO' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCategoryFilter(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              categoryFilter === tab.id
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/20'
                : 'bg-white dark:bg-[#111E32] text-slate-600 dark:text-slate-300 border-[#E5EAF1] dark:border-[#1E293B] hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl space-y-2">
          <Bell className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">No notifications found</h3>
          <p className="text-xs text-slate-500">You are completely up to date.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => {
            return (
              <div
                key={notif.id}
                className={`p-5 rounded-3xl border transition shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  !notif.is_read
                    ? 'bg-blue-50/50 dark:bg-[#111E32] border-blue-400/40 dark:border-blue-500/40 shadow-blue-500/5'
                    : 'bg-white dark:bg-[#111E32]/70 border-[#E5EAF1] dark:border-[#1E293B]'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] flex items-center justify-center shrink-0 mt-0.5">
                    {getCategoryIcon(notif.category)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {notif.title}
                      </h4>
                      {!notif.is_read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[11px] text-slate-400 font-mono block pt-0.5">
                      {new Date(notif.created_at).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleActionClick(notif)}
                    className="px-3 py-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {!notif.is_read && (
                    <button
                      onClick={() => markNotificationRead(notif.id)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Mark as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};