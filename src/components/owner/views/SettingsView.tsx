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
  Save,
  FileCheck2,
  Award,
  Star,
  ExternalLink,
  Globe,
  MapPin,
  Phone,
  Shield,
  FileText,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { LLSettingsSection } from '@/components/licence/LLSettingsSection';

export const SettingsView: React.FC = () => {
  const { school, branches, currentUser, updateSchool, addToast } = useDrivingSchool();

  const [activeSubTab, setActiveSubTab] = useState<
    'profile' | 'website' | 'branding' | 'branches' | 'permissions' | 'courses' | 'notifications' | 'payments' | 'security' | 'account' | 'll-reminders' | 'certificates'
  >('profile');

  // Certificate & Review form state
  const [googleReviewUrl, setGoogleReviewUrl] = useState(school.google_review_url || '');
  const [autoIssueCerts, setAutoIssueCerts] = useState(school.auto_issue_certificates ?? true);
  const [savingReviewSettings, setSavingReviewSettings] = useState(false);

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

  // Website & Public Information form state (Module 9)
  const [websiteForm, setWebsiteForm] = useState({
    name: school.name || 'Model Driving Academy',
    tagline: school.tagline || 'Govt. Approved Motor Driving Training Institute',
    logoUrl: school.logo_url || '',
    contactPhone: school.contact_phone || '+91 98220 12345',
    whatsappPhone: school.whatsapp_phone || '+91 98220 99887',
    contactEmail: school.contact_email || 'info@modeldrivingacademy.com',
    operatingHours: school.operating_hours || 'Monday – Sunday: 6:00 AM – 8:00 PM',
    street: school.address.street || 'Plot No. 42, Model Colony, Shivaji Nagar',
    city: school.address.city || 'Pune',
    state: school.address.state || 'Maharashtra',
    pincode: school.address.pincode || '411016',
    mapsLocationUrl: school.maps_location_url || 'https://maps.google.com/?q=Model+Driving+Academy+Pune+Maharashtra',
    mapsEmbedUrl: school.maps_embed_url || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.9972304856417!2d73.83151817595568!3d18.529023768918235!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf8741366b4d%3A0xe54e4ff8c3c1e33d!2sModel%20Colony%2C%20Shivajinagar%2C%20Pune%2C%20Maharashtra%20411016!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
    rtoRegNumber: school.rto_info?.registration_number || school.rto_registration_no || 'MH-12/MDS/2018/042',
    rtoIssuingAuthority: school.rto_info?.issuing_authority || 'Regional Transport Office (RTO), Maharashtra Motor Vehicles Dept.',
    rtoName: school.rto_info?.rto_name || 'Pune RTO (MH-12)',
    rtoOfficeAddress: school.rto_info?.rto_office_address || 'Regional Transport Office, 38 Dr. Ambedkar Road, Near Sangam Bridge, Pune, Maharashtra 411001',
    rtoContactPhone: school.rto_info?.rto_contact_phone || '020-26058080 / 020-26058090',
    rtoContactEmail: school.rto_info?.rto_contact_email || 'rto.pune-mh@gov.in',
    rtoValidTill: school.rto_info?.valid_till || '2028-03-31',
    rtoVerified: school.rto_info?.verified ?? true,
    privacyPolicy: school.privacy_policy || '',
    privacyPolicyUpdatedAt: school.privacy_policy_updated_at || '2026-11-10',
  });
  const [savingWebsite, setSavingWebsite] = useState(false);

  const handleSaveWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingWebsite(true);
    try {
      await updateSchool({
        name: websiteForm.name,
        tagline: websiteForm.tagline,
        logo_url: websiteForm.logoUrl,
        contact_phone: websiteForm.contactPhone,
        whatsapp_phone: websiteForm.whatsappPhone,
        contact_email: websiteForm.contactEmail,
        operating_hours: websiteForm.operatingHours,
        address: {
          street: websiteForm.street,
          city: websiteForm.city,
          state: websiteForm.state,
          pincode: websiteForm.pincode,
        },
        maps_location_url: websiteForm.mapsLocationUrl,
        maps_embed_url: websiteForm.mapsEmbedUrl,
        rto_registration_no: websiteForm.rtoRegNumber,
        rto_info: {
          registration_number: websiteForm.rtoRegNumber,
          issuing_authority: websiteForm.rtoIssuingAuthority,
          rto_name: websiteForm.rtoName,
          rto_office_address: websiteForm.rtoOfficeAddress,
          rto_contact_phone: websiteForm.rtoContactPhone,
          rto_contact_email: websiteForm.rtoContactEmail,
          valid_till: websiteForm.rtoValidTill,
          verified: websiteForm.rtoVerified,
        },
        privacy_policy: websiteForm.privacyPolicy,
        privacy_policy_updated_at: websiteForm.privacyPolicyUpdatedAt,
      });
      addToast('Public website and official RTO information updated successfully!', 'success');
    } catch {
      addToast('Failed to update website settings', 'error');
    } finally {
      setSavingWebsite(false);
    }
  };

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

      {/* Settings Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 text-xs font-semibold overflow-x-auto scrollbar-none">
        {[
          { id: 'profile', label: '1. School Profile', icon: Building2 },
          { id: 'website', label: '2. Website & Public Info', icon: Globe },
          { id: 'branding', label: '3. Logo & Print', icon: Palette },
          { id: 'branches', label: '4. Branch Hubs', icon: GitBranch },
          { id: 'permissions', label: '5. Staff Permissions', icon: ShieldCheck },
          { id: 'courses', label: '6. Session Quotas', icon: BookOpen },
          { id: 'notifications', label: '7. Gateways', icon: Bell },
          { id: 'payments', label: '8. Payment & GST', icon: IndianRupee },
          { id: 'security', label: '9. Security & RLS', icon: Lock },
          { id: 'account', label: '10. Owner Account', icon: User },
          { id: 'll-reminders', label: '11. LL Reminders', icon: FileCheck2 },
          { id: 'certificates', label: '12. Certificates & Reviews', icon: Award },
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

      {/* TAB 2: WEBSITE & PUBLIC INFORMATION (Module 9) */}
      {activeSubTab === 'website' && (
        <form onSubmit={handleSaveWebsite} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 text-xs max-w-4xl shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" /> Public Website, Location & RTO Settings
              </h3>
              <p className="text-slate-400 mt-0.5">
                Manage all information displayed on the public landing page, Contact Us, Google Maps location, RTO credentials, and Privacy Policy.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1.5 transition text-[11px]"
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-400" /> View Website
              </a>
              <a
                href="/contact"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1.5 transition text-[11px]"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> Contact Page
              </a>
              <a
                href="/privacy-policy"
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1.5 transition text-[11px]"
              >
                <Shield className="w-3.5 h-3.5 text-indigo-400" /> Privacy Policy
              </a>
            </div>
          </div>

          {/* Section 1: Academy Public Brand */}
          <div className="space-y-4">
            <h4 className="font-bold text-white flex items-center gap-2 text-sm text-blue-400">
              <Building2 className="w-4 h-4" /> 1. Academy Brand & Public Identity
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Official Driving School Name *</label>
                <input
                  type="text"
                  required
                  value={websiteForm.name}
                  onChange={e => setWebsiteForm({ ...websiteForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Public Tagline / Subtitle</label>
                <input
                  type="text"
                  value={websiteForm.tagline}
                  onChange={e => setWebsiteForm({ ...websiteForm, tagline: e.target.value })}
                  placeholder="e.g. Govt. Approved Motor Driving Training Institute"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">School Logo URL (Optional)</label>
              <input
                type="text"
                value={websiteForm.logoUrl}
                onChange={e => setWebsiteForm({ ...websiteForm, logoUrl: e.target.value })}
                placeholder="https://example.com/logo.png"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Section 2: Contact Channels & Operating Hours */}
          <div className="border-t border-slate-800 pt-4 space-y-4">
            <h4 className="font-bold text-white flex items-center gap-2 text-sm text-emerald-400">
              <Phone className="w-4 h-4" /> 2. Official Contact Information & Working Hours
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Calling Contact Number *</label>
                <input
                  type="text"
                  required
                  value={websiteForm.contactPhone}
                  onChange={e => setWebsiteForm({ ...websiteForm, contactPhone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Official WhatsApp Number</label>
                <input
                  type="text"
                  value={websiteForm.whatsappPhone}
                  onChange={e => setWebsiteForm({ ...websiteForm, whatsappPhone: e.target.value })}
                  placeholder="+91 98220 99887"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-emerald-400 font-semibold focus:outline-none focus:border-blue-500"
                />
                <span className="text-[11px] text-slate-500 mt-0.5 block">Used for the 1-click &quot;Chat on WhatsApp&quot; button on public pages</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Official Inquiry Email *</label>
                <input
                  type="email"
                  required
                  value={websiteForm.contactEmail}
                  onChange={e => setWebsiteForm({ ...websiteForm, contactEmail: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Business Operating Hours</label>
                <input
                  type="text"
                  value={websiteForm.operatingHours}
                  onChange={e => setWebsiteForm({ ...websiteForm, operatingHours: e.target.value })}
                  placeholder="Monday – Sunday: 6:00 AM – 8:00 PM"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Physical Address & Google Maps Location */}
          <div className="border-t border-slate-800 pt-4 space-y-4">
            <h4 className="font-bold text-white flex items-center gap-2 text-sm text-amber-400">
              <MapPin className="w-4 h-4" /> 3. Campus Address & Google Maps Integration
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-slate-300 font-semibold block mb-1">Full Street Address *</label>
                <input
                  type="text"
                  required
                  value={websiteForm.street}
                  onChange={e => setWebsiteForm({ ...websiteForm, street: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={websiteForm.city}
                  onChange={e => setWebsiteForm({ ...websiteForm, city: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={websiteForm.state}
                    onChange={e => setWebsiteForm({ ...websiteForm, state: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    value={websiteForm.pincode}
                    onChange={e => setWebsiteForm({ ...websiteForm, pincode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Google Maps Location URL (Direct Pin / &quot;Get Directions&quot; Link)
              </label>
              <input
                type="url"
                value={websiteForm.mapsLocationUrl}
                onChange={e => setWebsiteForm({ ...websiteForm, mapsLocationUrl: e.target.value })}
                placeholder="https://maps.google.com/?q=Model+Driving+Academy"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-blue-400 font-mono text-xs focus:outline-none focus:border-blue-500"
              />
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Opens directly in Google Maps mobile app or desktop browser when users click &quot;Get Directions&quot;
              </span>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Google Maps Embed URL (Interactive Iframe)
              </label>
              <input
                type="text"
                value={websiteForm.mapsEmbedUrl}
                onChange={e => setWebsiteForm({ ...websiteForm, mapsEmbedUrl: e.target.value })}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 font-mono text-xs focus:outline-none focus:border-blue-500"
              />
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Renders interactive map directly on homepage and Contact Us page
              </span>
            </div>
          </div>

          {/* Section 4: Verified RTO & Regulatory Credentials */}
          <div className="border-t border-slate-800 pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white flex items-center gap-2 text-sm text-purple-400">
                <ShieldCheck className="w-4 h-4" /> 4. Driving School Authorization & Regional Transport Office (RTO)
              </h4>
              <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  checked={websiteForm.rtoVerified}
                  onChange={e => setWebsiteForm({ ...websiteForm, rtoVerified: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-900 border-slate-700"
                />
                <span className="text-white font-semibold text-xs">Verified & Active Authorization</span>
              </label>
            </div>

            <div className="p-3 bg-blue-950/20 border border-blue-800/40 rounded-xl flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-blue-300 text-[11px] leading-relaxed">
                <strong>Statutory Notice:</strong> Government regulations mandate distinct separation between the driving school&apos;s commercial training authorization and official State RTO office details. The academy does not represent itself as a government department.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">School Driving School Reg. Number *</label>
                <input
                  type="text"
                  required
                  value={websiteForm.rtoRegNumber}
                  onChange={e => setWebsiteForm({ ...websiteForm, rtoRegNumber: e.target.value })}
                  placeholder="e.g. MH-12/MDS/2018/042"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Authorization Validity / Expiry Date</label>
                <input
                  type="date"
                  value={websiteForm.rtoValidTill}
                  onChange={e => setWebsiteForm({ ...websiteForm, rtoValidTill: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">State Issuing Authority</label>
              <input
                type="text"
                value={websiteForm.rtoIssuingAuthority}
                onChange={e => setWebsiteForm({ ...websiteForm, rtoIssuingAuthority: e.target.value })}
                placeholder="e.g. Regional Transport Office (RTO), Maharashtra Motor Vehicles Dept."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Jurisdiction RTO Office Name</label>
                <input
                  type="text"
                  value={websiteForm.rtoName}
                  onChange={e => setWebsiteForm({ ...websiteForm, rtoName: e.target.value })}
                  placeholder="e.g. Pune RTO (MH-12)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Official RTO Helplines</label>
                <input
                  type="text"
                  value={websiteForm.rtoContactPhone}
                  onChange={e => setWebsiteForm({ ...websiteForm, rtoContactPhone: e.target.value })}
                  placeholder="020-26058080 / 020-26058090"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Official RTO Office Address</label>
                <input
                  type="text"
                  value={websiteForm.rtoOfficeAddress}
                  onChange={e => setWebsiteForm({ ...websiteForm, rtoOfficeAddress: e.target.value })}
                  placeholder="Regional Transport Office, 38 Dr. Ambedkar Road, Pune 411001"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Official RTO Email</label>
                <input
                  type="email"
                  value={websiteForm.rtoContactEmail}
                  onChange={e => setWebsiteForm({ ...websiteForm, rtoContactEmail: e.target.value })}
                  placeholder="rto.pune-mh@gov.in"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Public Privacy Policy Editor */}
          <div className="border-t border-slate-800 pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white flex items-center gap-2 text-sm text-cyan-400">
                <FileText className="w-4 h-4" /> 5. Public Privacy Policy Content
              </h4>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-xs">Policy Effective Date:</span>
                <input
                  type="text"
                  value={websiteForm.privacyPolicyUpdatedAt}
                  onChange={e => setWebsiteForm({ ...websiteForm, privacyPolicyUpdatedAt: e.target.value })}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-white text-xs font-mono w-28 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <p className="text-slate-400 text-xs">
              Leave blank to automatically render the academy&apos;s standard comprehensive 10-clause Privacy Policy, or enter custom terms and data protection disclosures below:
            </p>
            <textarea
              rows={6}
              value={websiteForm.privacyPolicy}
              onChange={e => setWebsiteForm({ ...websiteForm, privacyPolicy: e.target.value })}
              placeholder="Enter custom privacy policy clauses or specific regional compliance requirements here... (leave blank to display default legal terms)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono text-xs focus:outline-none focus:border-blue-500 resize-y"
            />
          </div>

          {/* Form Actions */}
          <div className="border-t border-slate-800 pt-4 flex items-center justify-between">
            <span className="text-slate-400 text-[11px] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Changes take effect immediately on public pages
            </span>
            <button
              type="submit"
              disabled={savingWebsite}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs transition shadow-lg shadow-blue-600/20"
            >
              <Save className="w-4 h-4" /> {savingWebsite ? 'Saving...' : 'Save Website & RTO Information'}
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: BRANDING */}
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

      {/* TAB 10: LEARNING LICENCE REMINDER SETTINGS */}
      {activeSubTab === 'll-reminders' && (
        <LLSettingsSection />
      )}

      {/* TAB 11: CERTIFICATES & GOOGLE REVIEWS */}
      {activeSubTab === 'certificates' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 text-xs max-w-4xl shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" /> Automatic Certificates & Google Reviews
            </h3>
            <p className="text-slate-400 mt-1">
              Configure automatic course completion certificates, student feedback collection, and your official Google Review invitation link.
            </p>
          </div>

          {/* Google Review URL Config */}
          <div className="space-y-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <h4 className="font-bold text-white text-sm">Official Google Business Review Link</h4>
              </div>
              {googleReviewUrl && (
                <a
                  href={googleReviewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Test Link
                </a>
              )}
            </div>
            <p className="text-slate-400 leading-relaxed">
              When students download their completion certificate for the first time, they receive an optional invitation to write a public review on your Google Business profile:
            </p>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-300 italic text-xs">
              &quot;Congratulations on completing your driving course! We hope you had a great learning experience. Please share your honest experience and help others discover our driving school.&quot;
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Google Review URL</label>
              <input
                type="url"
                value={googleReviewUrl}
                onChange={e => setGoogleReviewUrl(e.target.value)}
                placeholder="https://g.page/r/your-google-place-id/review"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-blue-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Tip: Get your review shortlink from Google Business Profile Manager &rarr; &quot;Ask for reviews&quot;.
              </p>
            </div>
          </div>

          {/* Automatic Issuance Toggle */}
          <div className="space-y-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4">
            <h4 className="font-bold text-white text-sm">Automatic Certificate Verification & Issuance</h4>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autoIssueCerts}
                onChange={e => setAutoIssueCerts(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-900 border-slate-700"
              />
              <div>
                <span className="font-semibold text-white block">
                  Automatically issue certificates when course requirements are fulfilled
                </span>
                <span className="text-slate-400 text-xs block mt-0.5">
                  Verifies actual attendance records against allocated session quotas. As soon as all sessions are marked Present, the student status updates to &quot;Course Completed&quot; and the certificate is immediately generated.
                </span>
              </div>
            </label>
          </div>

          {/* Action buttons */}
          <div className="border-t border-slate-800 pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={savingReviewSettings}
              onClick={async () => {
                setSavingReviewSettings(true);
                try {
                  await updateSchool({
                    google_review_url: googleReviewUrl.trim(),
                    auto_issue_certificates: autoIssueCerts
                  });
                  addToast('Certificate & Google Review settings saved successfully!', 'success');
                } catch {
                  addToast('Failed to save settings', 'error');
                } finally {
                  setSavingReviewSettings(false);
                }
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs transition shadow-lg shadow-blue-600/20"
            >
              <Save className="w-4 h-4" /> {savingReviewSettings ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
