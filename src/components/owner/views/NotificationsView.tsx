'use client';

import React, { useState } from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { NotificationItem } from '@/types';
import { 
  Bell, 
  Check, 
  UserPlus, 
  IndianRupee, 
  Clock, 
  Car, 
  FileCheck2, 
  Sliders, 
  CheckCheck,
  ShieldCheck
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead, addToast } = useDrivingSchool();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [prefs, setPrefs] = useState({
    smsAlerts: true,
    whatsappAlerts: true,
    emailAlerts: true,
    admissions: true,
    payments: true,
    licences: true,
    vehicles: true
  });

  const categories = [
    { id: 'all', label: 'All Notifications' },
    { id: 'admission', label: 'New Admissions', icon: UserPlus },
    { id: 'payment', label: 'Fee Payments', icon: IndianRupee },
    { id: 'attendance', label: 'Attendance', icon: Clock },
    { id: 'schedule', label: 'Schedules', icon: Clock },
    { id: 'licence', label: 'Licence Tests', icon: FileCheck2 },
    { id: 'vehicle', label: 'Fleet Alerts', icon: Car },
  ];

  const filtered = notifications.filter(n => {
    if (activeCategory === 'all') return true;
    return n.category === activeCategory;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-blue-400" /> Notifications & Operational Alerts Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time multi-channel feed: fee verifications, RTO appointment alerts and fleet expiry warnings.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center">
          {unreadCount > 0 && (
            <button
              onClick={() => {
                markAllNotificationsRead();
                addToast('All notifications marked as read', 'info');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
            >
              <CheckCheck className="w-4 h-4 text-emerald-400" /> Mark All as Read
            </button>
          )}
          <button
            onClick={() => setPreferencesOpen(!preferencesOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/20"
          >
            <Sliders className="w-4 h-4" /> Preferences
          </button>
        </div>
      </div>

      {/* Preferences Drawer / Modal */}
      {preferencesOpen && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" /> Owner Alert Channels & Rules
            </h3>
            <button onClick={() => setPreferencesOpen(false)} className="text-xs text-slate-400 hover:text-white">
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={prefs.whatsappAlerts}
                onChange={e => setPrefs({ ...prefs, whatsappAlerts: e.target.checked })}
                className="rounded bg-slate-900 text-blue-600"
              />
              <span className="text-slate-300 font-medium">WhatsApp Gateway (Instant)</span>
            </label>
            <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={prefs.smsAlerts}
                onChange={e => setPrefs({ ...prefs, smsAlerts: e.target.checked })}
                className="rounded bg-slate-900 text-blue-600"
              />
              <span className="text-slate-300 font-medium">Transactional SMS Alerts</span>
            </label>
            <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={prefs.emailAlerts}
                onChange={e => setPrefs({ ...prefs, emailAlerts: e.target.checked })}
                className="rounded bg-slate-900 text-blue-600"
              />
              <span className="text-slate-300 font-medium">Owner Email Digest</span>
            </label>
          </div>
        </div>
      )}

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-semibold">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl transition shrink-0 ${
              activeCategory === cat.id
                ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.map(item => (
          <div
            key={item.id}
            onClick={() => markNotificationRead(item.id)}
            className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-4 ${
              item.is_read
                ? 'bg-slate-900/40 border-slate-800/60 text-slate-400'
                : 'bg-slate-900 border-blue-500/40 shadow-lg text-slate-100'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              item.category === 'payment' ? 'bg-emerald-500/10 text-emerald-400' :
              item.category === 'admission' ? 'bg-blue-500/10 text-blue-400' :
              item.category === 'licence' ? 'bg-purple-500/10 text-purple-400' :
              'bg-amber-500/10 text-amber-400'
            }`}>
              {item.category === 'payment' && <IndianRupee className="w-5 h-5" />}
              {item.category === 'admission' && <UserPlus className="w-5 h-5" />}
              {item.category === 'licence' && <FileCheck2 className="w-5 h-5" />}
              {item.category !== 'payment' && item.category !== 'admission' && item.category !== 'licence' && <Car className="w-5 h-5" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">{item.title}</span>
                <span className="text-[10px] text-slate-500">
                  {new Date(item.created_at).toLocaleString('en-IN', {
                    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.message}</p>
            </div>

            {!item.is_read && (
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 mt-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
