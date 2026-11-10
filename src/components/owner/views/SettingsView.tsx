'use client';

import React, { useState } from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { 
  Settings, 
  Building2, 
  Palette, 
  GitBranch, 
  Users, 
  ShieldCheck, 
  BookOpen, 
  Bell, 
  IndianRupee, 
  Lock, 
  User, 
  Check, 
  Save 
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { school, branches, currentUser, updateSchool, addToast } = useDrivingSchool();

  const [activeSubTab, setActiveSubTab] = useState<
    'profile' | 'branding' | 'branches' | 'permissions' | 'courses' | 'notifications' | 'payments' | 'security' | 'account'
  >('profile');

  // School profile form state
  const [profileForm, setProfileForm] = useState({
    name: school.name,
    tagline: school.tagline || '',
    rtoRegistrationNo: school.rto_registration_no || '',
    contactPhone: school.contact_phone,
    contactEmail: school.contact_email,
    street: school.address.street || '',
    city: school.address.city || '',
    state: school.address.state || '',
    pincode: school.address.pincode || '',
    currency: school.currency,
    timezone: school.timezone
  });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSchool({
      name: profileForm.name,
      tagline: profileForm.tagline,
      rto_registration_no: profileForm.rtoRegistrationNo,
      contact_phone: profileForm.contactPhone,
      contact_email: profileForm.contactEmail,
      address: {
        street: profileForm.street,
        city: profileForm.city,
        state: profileForm.state,
        pincode: profileForm.pincode
      }
    });
    addToast('Academy organization profile saved successfully!', 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-400" /> Enterprise Organization Settings
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure school profile, official RTO credentials, branding, branch hubs and bank ledgers.
          </p>
        </div>
      </div>

      {/* 11 Settings Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 text-xs font-semibold overflow-x-auto scrollbar-none">
        {[
          { id: 'profile', label: '1. School Profile', icon: Building2 },
          { id: 'branding', label: '2. Logo & Branding', icon: Palette },
          { id: 'branches', label: '3. Branch Management', icon: GitBranch },
          { id: 'permissions', label: '4. Staff Permissions', icon: ShieldCheck },
          { id: 'courses', label: '5. Session Quotas', icon: BookOpen },
          { id: 'notifications', label: '6. Notification Gateways', icon: Bell },
          { id: 'payments', label: '7. Payment Settings & GST', icon: IndianRupee },
          { id: 'security', label: '8. Security & Supabase RLS', icon: Lock },
          { id: 'account', label: '9. Owner Account', icon: User },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3 py-2 rounded-xl transition flex items-center gap-1.5 shrink-0 whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: SCHOOL PROFILE */}
      {activeSubTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 text-xs max-w-4xl shadow-xl">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Official Driving Institute Profile</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Driving School Name *</label>
              <input
                type="text"
                required
                value={profileForm.name}
                onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Govt RTO Registration Number *</label>
              <input
                type="text"
                required
                value={profileForm.rtoRegistrationNo}
                onChange={e => setProfileForm({ ...profileForm, rtoRegistrationNo: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 focus:outline-none focus:border-blue-500 font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Official Tagline / Institute Title</label>
            <input
              type="text"
              value={profileForm.tagline}
              onChange={e => setProfileForm({ ...profileForm, tagline: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Official Contact Phone</label>
              <input
                type="text"
                value={profileForm.contactPhone}
                onChange={e => setProfileForm({ ...profileForm, contactPhone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Official Contact Email</label>
              <input
                type="email"
                value={profileForm.contactEmail}
                onChange={e => setProfileForm({ ...profileForm, contactEmail: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 space-y-4">
            <h4 className="font-bold text-white">Registered Academy Address</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Street Address</label>
                <input
                  type="text"
                  value={profileForm.street}
                  onChange={e => setProfileForm({ ...profileForm, street: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">City</label>
                <input
                  type="text"
                  value={profileForm.city}
                  onChange={e => setProfileForm({ ...profileForm, city: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-lg shadow-blue-600/20"
            >
              <Save className="w-4 h-4" /> Save Academy Profile
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: BRANDING */}
      {activeSubTab === 'branding' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 text-xs max-w-4xl shadow-xl">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Logo & Print Customization</h3>
          <p className="text-slate-400">Customize the look of printed fee receipts, Sarathi test cards, and portal branding.</p>
          
          <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-black">
              A
            </div>
            <div>
              <span className="font-bold text-white block">Apex Motor Driving School Logo</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">High-res SVG / PNG (Recommended: 512x512)</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: BRANCHES */}
      {activeSubTab === 'branches' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 text-xs max-w-4xl shadow-xl">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Academy Branches & Driving Tracks</h3>
          <div className="space-y-3">
            {branches.map(br => (
              <div key={br.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{br.name}</span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">{br.code}</span>
                  </div>
                  <span className="text-slate-400 text-[11px] block mt-1">Phone: {br.phone}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                  Operational Hub
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: PAYMENTS & GST */}
      {activeSubTab === 'payments' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 text-xs max-w-4xl shadow-xl">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Financial Gateway & Receipt Configuration</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Receipt Number Prefix</label>
              <input
                type="text"
                disabled
                value="RCP-2026-"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono opacity-80"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Official Academy UPI VPA</label>
              <input
                type="text"
                value="apexdriving@icici"
                readOnly
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: SECURITY & SUPABASE RLS */}
      {activeSubTab === 'security' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 text-xs max-w-4xl shadow-xl">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" /> PostgreSQL Row-Level Security (RLS) Status
          </h3>
          
          <div className="bg-emerald-950/30 border border-emerald-800/60 p-4 rounded-2xl flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-white block font-bold">Multi-Tenant School Isolation Active</strong>
              <p className="text-slate-300 mt-1">
                PostgreSQL RLS ensures that only users with confirmed memberships in {school.name} can read or mutate student files, payments, and attendance.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: OWNER ACCOUNT */}
      {activeSubTab === 'account' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 text-xs max-w-4xl shadow-xl">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Owner Account Credentials</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Owner Full Name:</span>
              <span className="font-bold text-white">{currentUser.full_name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Account Role:</span>
              <span className="font-bold text-purple-400">Super Admin / Owner (Highest Authority)</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-400">Registered Email:</span>
              <span className="font-medium text-white">{currentUser.email}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
