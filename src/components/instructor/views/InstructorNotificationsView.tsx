'use client';

import React from 'react';
import { 
  Bell, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Car, 
  Clock, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { NotificationItem } from '@/types';

interface InstructorNotificationsViewProps {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onMarkSingleRead: (id: string) => void;
}

export const InstructorNotificationsView: React.FC<InstructorNotificationsViewProps> = ({
  notifications,
  onMarkAllRead,
  onMarkSingleRead
}) => {
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Instructor Notifications
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time notifications on student assignments, class updates, schedule adjustments, and owner notices.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map(n => {
          return (
            <div
              key={n.id}
              onClick={() => onMarkSingleRead(n.id)}
              className={`p-5 rounded-3xl border transition cursor-pointer flex items-start gap-4 text-xs ${
                n.is_read
                  ? 'bg-white dark:bg-[#111E32] border-[#E5EAF1] dark:border-[#1E293B] opacity-80'
                  : 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/40 shadow-sm'
              }`}
            >
              <div className="p-2.5 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(n.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {n.message}
                </p>
                {!n.is_read && (
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white mt-1">
                    New Alert
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {notifications.length === 0 && (
          <div className="p-12 text-center bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl space-y-2">
            <Bell className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Notifications</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">You are all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
};
