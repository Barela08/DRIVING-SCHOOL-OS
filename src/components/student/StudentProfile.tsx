'use client';

import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  AlertCircle, 
  Check, 
  HeartHandshake, 
  GraduationCap, 
  Building,
  Save
} from 'lucide-react';
import { Student, Enrollment } from '@/types';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';

interface StudentProfileProps {
  student: Student;
  enrollment?: Enrollment;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({ student, enrollment }) => {
  const { updateStudentProfile } = useDrivingSchool();

  // Permitted editable fields state
  const [phone, setPhone] = useState(student.phone || '');
  const [email, setEmail] = useState(student.email || '');
  const [area, setArea] = useState(student.address?.area || '');
  const [city, setCity] = useState(student.address?.city || 'Pune');
  const [pincode, setPincode] = useState(student.address?.pincode || '');
  
  const [emergencyName, setEmergencyName] = useState(student.emergency_contact?.name || '');
  const [emergencyRelation, setEmergencyRelation] = useState(student.emergency_contact?.relation || '');
  const [emergencyPhone, setEmergencyPhone] = useState(student.emergency_contact?.phone || '');

  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSaveContactInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const res = await updateStudentProfile(student.id, {
        phone: phone.trim(),
        email: email.trim(),
        address: {
          area: area.trim(),
          city: city.trim(),
          pincode: pincode.trim()
        },
        emergency_contact: {
          name: emergencyName.trim(),
          relation: emergencyRelation.trim(),
          phone: emergencyPhone.trim()
        }
      });

      setIsSaving(false);
      if (res.success) {
        setStatusMessage({ type: 'success', text: 'Contact details and emergency info saved successfully!' });
      } else {
        setStatusMessage({ type: 'error', text: res.message || 'Failed to save profile changes.' });
      }
    } catch (err: any) {
      setIsSaving(false);
      setStatusMessage({ type: 'error', text: err?.message || 'Error updating student contact info.' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header Profile Identity Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-3xl flex items-center justify-center shadow-xl shadow-blue-500/25">
            {student.full_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <span className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-emerald-500 text-white shadow-md" title="Verified Identity">
            <ShieldCheck className="w-4 h-4" />
          </span>
        </div>

        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{student.full_name}</h2>
            <span className="px-2.5 py-0.5 rounded-full font-mono font-bold text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              {student.student_code}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            {student.enrolled_course_name || 'Four Wheeler Complete Mastery Course'} • Admitted on {student.admission_date}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              <Building className="w-3.5 h-3.5 text-blue-500" /> Camp Head Office Branch
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Check className="w-3.5 h-3.5" /> Enrolled & Verified
            </span>
          </div>
        </div>
      </div>

      {/* Administrative Credentials (Read-Only Section) */}
      <div className="bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-500" />
              Administrative & Legal Records
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              These fields are bound to official RTO licensing and can only be altered by academy management.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 uppercase">
            Read-Only
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B]">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Full Legal Name</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 block">{student.full_name}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B]">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Student Unique Code</span>
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm mt-0.5 block">{student.student_code}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B]">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Date of Birth</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 block">{student.date_of_birth || '14 Jul 1998'}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B]">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Gender & Blood Group</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 block">{student.gender || 'Male'} • Blood Group: {student.blood_group || 'O+'}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B]">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Admission Date</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 block">{student.admission_date}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B]">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Enrolled Course</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 block truncate">{student.enrolled_course_name}</span>
          </div>
        </div>
      </div>

      {/* Permitted Contact Information (Editable Form) */}
      <form onSubmit={handleSaveContactInfo} className="bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Permitted Contact Details
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Keep your contact phone and emergency numbers up-to-date for lesson notifications and RTO dispatches.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 uppercase">
            Editable
          </span>
        </div>

        {statusMessage && (
          <div className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
              : 'bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400'
          }`}>
            {statusMessage.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Mobile Phone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98900 11223"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <p className="text-[10px] text-slate-400">Used for WhatsApp lesson alerts & login OTP</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <p className="text-[10px] text-slate-400">Official fee receipts are delivered here</p>
          </div>
        </div>

        {/* Address Subsection */}
        <div className="pt-2 space-y-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-500" /> Residential Address
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-[11px] text-slate-500 dark:text-slate-400">Street / Society / Area</label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Lane 4, Viman Nagar"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-500 dark:text-slate-400">Pincode</label>
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="411014"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact Subsection */}
        <div className="pt-2 space-y-3 border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <HeartHandshake className="w-3.5 h-3.5 text-rose-500" /> Emergency Contact
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-500 dark:text-slate-400">Contact Person Name</label>
              <input
                type="text"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                placeholder="e.g. Sunil Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-500 dark:text-slate-400">Relationship</label>
              <input
                type="text"
                value={emergencyRelation}
                onChange={(e) => setEmergencyRelation(e.target.value)}
                placeholder="e.g. Father / Spouse"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-500 dark:text-slate-400">Emergency Phone</label>
              <input
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="+91 98900 99887"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-500 text-white font-bold text-xs transition shadow-lg shadow-blue-600/20 flex items-center gap-2"
          >
            {isSaving ? (
              <span>Saving Changes...</span>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Contact Details
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};