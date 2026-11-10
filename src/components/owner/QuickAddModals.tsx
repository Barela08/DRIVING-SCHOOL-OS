'use client';

import React, { useState } from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { 
  X, 
  UserPlus, 
  Award, 
  UserCheck, 
  IndianRupee, 
  Calendar, 
  Car, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface QuickAddModalsProps {
  modalType: 'student' | 'instructor' | 'staff' | 'payment' | 'schedule' | 'vehicle' | null;
  onClose: () => void;
}

export const QuickAddModals: React.FC<QuickAddModalsProps> = ({ modalType, onClose }) => {
  const { 
    courses, 
    instructors, 
    vehicles, 
    enrollments, 
    addStudent, 
    addInstructor, 
    addStaff, 
    addPayment, 
    addSchedule, 
    addVehicle 
  } = useDrivingSchool();

  const [loading, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form states
  // 1. Student
  const [studName, setStudName] = useState('');
  const [studPhone, setStudPhone] = useState('');
  const [studEmail, setStudEmail] = useState('');
  const [studCourseId, setStudCourseId] = useState(courses[0]?.id || '');
  const [studInstructorId, setStudInstructorId] = useState(instructors[0]?.id || '');
  const [studFee, setStudFee] = useState(courses[0]?.price || 8500);
  const [studDownPay, setStudDownPay] = useState(5000);

  // 2. Instructor
  const [insName, setInsName] = useState('');
  const [insPhone, setInsPhone] = useState('');
  const [insEmail, setInsEmail] = useState('');
  const [insLicence, setInsLicence] = useState('');
  const [insExp, setInsExp] = useState(5);
  const [insVehicleId, setInsVehicleId] = useState(vehicles[0]?.id || '');

  // 3. Staff
  const [stfName, setStfName] = useState('');
  const [stfPhone, setStfPhone] = useState('');
  const [stfEmail, setStfEmail] = useState('');
  const [stfRole, setStfRole] = useState('Counter Operations');

  // 4. Payment
  const [payEnrollmentId, setPayEnrollmentId] = useState(enrollments[0]?.id || '');
  const [payAmount, setPayAmount] = useState(3500);
  const [payMethod, setPayMethod] = useState<'UPI' | 'Cash' | 'Bank Transfer'>('UPI');
  const [payRef, setPayRef] = useState('');

  // 5. Schedule
  const [schEnrollmentId, setSchEnrollmentId] = useState(enrollments[0]?.id || '');
  const [schInstructorId, setSchInstructorId] = useState(instructors[0]?.id || '');
  const [schVehicleId, setSchVehicleId] = useState(vehicles[0]?.id || '');
  const [schTopic, setSchTopic] = useState('Reverse Box & Parallel Parking');
  const [schStart, setSchStart] = useState('2026-11-12T09:00');
  const [schEnd, setSchEnd] = useState('2026-11-12T10:00');

  // 6. Vehicle
  const [vehReg, setVehReg] = useState('');
  const [vehBrand, setVehBrand] = useState('Maruti Suzuki');
  const [vehModel, setVehModel] = useState('Swift Dzire');
  const [vehType, setVehType] = useState<'4W_Manual' | '4W_Automatic' | '2W'>('4W_Manual');
  const [vehDual, setVehDual] = useState(true);

  if (!modalType) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAlertMsg(null);

    try {
      if (modalType === 'student') {
        const res = await addStudent({
          fullName: studName,
          phone: studPhone,
          email: studEmail,
          courseId: studCourseId,
          instructorId: studInstructorId,
          agreedFee: Number(studFee),
          initialPayment: Number(studDownPay)
        });
        setAlertMsg({ type: 'success', text: res.message });
      } else if (modalType === 'instructor') {
        const res = await addInstructor({
          fullName: insName,
          phone: insPhone,
          email: insEmail,
          licenceNumber: insLicence || 'MH12-2015-09881',
          experienceYears: Number(insExp),
          assignedVehicleId: insVehicleId
        });
        setAlertMsg({ type: 'success', text: res.message });
      } else if (modalType === 'staff') {
        const res = await addStaff({
          fullName: stfName,
          phone: stfPhone,
          email: stfEmail,
          roleTitle: stfRole
        });
        setAlertMsg({ type: 'success', text: res.message });
      } else if (modalType === 'payment') {
        const res = await addPayment({
          enrollmentId: payEnrollmentId,
          amount: Number(payAmount),
          paymentMethod: payMethod,
          transactionReference: payRef
        });
        setAlertMsg({ type: 'success', text: res.message });
      } else if (modalType === 'schedule') {
        const res = await addSchedule({
          enrollmentId: schEnrollmentId,
          instructorId: schInstructorId,
          vehicleId: schVehicleId,
          scheduledStart: schStart,
          scheduledEnd: schEnd,
          topic: schTopic
        });
        setAlertMsg({ type: 'success', text: res.message });
      } else if (modalType === 'vehicle') {
        const res = await addVehicle({
          registrationNumber: vehReg,
          brand: vehBrand,
          model: vehModel,
          vehicleType: vehType,
          isDualControl: vehDual
        });
        setAlertMsg({ type: 'success', text: res.message });
      }

      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      setAlertMsg({ type: 'error', text: err.message || 'Error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#111E32] text-slate-900 dark:text-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E5EAF1] dark:border-[#1E293B] space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF1] dark:border-[#1E293B]">
          <h3 className="text-base font-bold text-slate-900 dark:text-white capitalize">
            {modalType === 'student' && 'Add New Student'}
            {modalType === 'instructor' && 'Register Driving Instructor'}
            {modalType === 'staff' && 'Create Staff Account'}
            {modalType === 'payment' && 'Record Payment Receipt'}
            {modalType === 'schedule' && 'Create Class Schedule'}
            {modalType === 'vehicle' && 'Register Academy Vehicle'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {alertMsg && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            alertMsg.type === 'success' 
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
          }`}>
            {alertMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{alertMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {modalType === 'student' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={studName}
                    onChange={(e) => setStudName(e.target.value)}
                    placeholder="e.g. Sameer Kulkarni"
                    className="w-full bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={studPhone}
                    onChange={(e) => setStudPhone(e.target.value)}
                    placeholder="+91 98220 12345"
                    className="w-full bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Course Selection</label>
                <select
                  value={studCourseId}
                  onChange={(e) => setStudCourseId(e.target.value)}
                  className="w-full bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] rounded-xl px-3 py-2"
                >
                  {courses.map(c => <option key={c.id} value={c.id}>{c.name} (₹{c.price})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Agreed Fee (₹)</label>
                  <input
                    type="number"
                    value={studFee}
                    onChange={(e) => setStudFee(Number(e.target.value))}
                    className="w-full bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] rounded-xl px-3 py-2 font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Down Payment (₹)</label>
                  <input
                    type="number"
                    value={studDownPay}
                    onChange={(e) => setStudDownPay(Number(e.target.value))}
                    className="w-full bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] rounded-xl px-3 py-2 font-bold text-emerald-600 dark:text-emerald-400"
                  />
                </div>
              </div>
            </>
          )}

          {modalType === 'instructor' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold">Instructor Name *</label>
                  <input
                    type="text"
                    required
                    value={insName}
                    onChange={(e) => setInsName(e.target.value)}
                    placeholder="e.g. Ramesh Kadam"
                    className="w-full bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] rounded-xl px-3 py-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={insPhone}
                    onChange={(e) => setInsPhone(e.target.value)}
                    placeholder="+91 98220 54321"
                    className="w-full bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] rounded-xl px-3 py-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold">Experience (Years)</label>
                  <input
                    type="number"
                    value={insExp}
                    onChange={(e) => setInsExp(Number(e.target.value))}
                    className="w-full bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] rounded-xl px-3 py-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold">Assign Car</label>
                  <select
                    value={insVehicleId}
                    onChange={(e) => setInsVehicleId(e.target.value)}
                    className="w-full bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] rounded-xl px-3 py-2"
                  >
                    {vehicles.map(v => <option key={v.id} value={v.id}>{v.brand} {v.model}</option>)}
                  </select>
                </div>
              </div>
            </>
          )}

          {modalType === 'staff' && (
            <>
              <div className="space-y-1">
                <label className="font-semibold">Staff Full Name *</label>
                <input
                  type="text"
                  required
                  value={stfName}
                  onChange={(e) => setStfName(e.target.value)}
                  placeholder="e.g. Kavita Shinde"
                  className="w-full bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] rounded-xl px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold">Mobile *</label>
                  <input
                    type="tel"
                    required
                    value={stfPhone}
                    onChange={(e) => setStfPhone(e.target.value)}
                    placeholder="+91 98220 99001"
                    className="w-full bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] rounded-xl px-3 py-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold">Role Title</label>
                  <input
                    type="text"
                    value={stfRole}
                    onChange={(e) => setStfRole(e.target.value)}
                    className="w-full bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] rounded-xl px-3 py-2"
                  />
                </div>
              </div>
            </>
          )}

          {modalType === 'payment' && (
            <>
              <div className="space-y-1">
                <label className="font-semibold">Select Student</label>
                <select
                  value={payEnrollmentId}
                  onChange={(e) => setPayEnrollmentId(e.target.value)}
                  className="w-full bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] rounded-xl px-3 py-2"
                >
                  {enrollments.map(e => <option key={e.id} value={e.id}>{e.student_name} ({e.student_code})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(Number(e.target.value))}
                    className="w-full bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] rounded-xl px-3 py-2 font-bold text-emerald-600 dark:text-emerald-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold">Method</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as any)}
                    className="w-full bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] rounded-xl px-3 py-2"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {modalType === 'vehicle' && (
            <>
              <div className="space-y-1">
                <label className="font-semibold">Registration Number (e.g. MH-12-PQ-9988) *</label>
                <input
                  type="text"
                  required
                  value={vehReg}
                  onChange={(e) => setVehReg(e.target.value)}
                  placeholder="MH-12-XX-0000"
                  className="w-full bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] rounded-xl px-3 py-2 uppercase font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold">Brand</label>
                  <input
                    type="text"
                    value={vehBrand}
                    onChange={(e) => setVehBrand(e.target.value)}
                    className="w-full bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] rounded-xl px-3 py-2"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold">Model</label>
                  <input
                    type="text"
                    value={vehModel}
                    onChange={(e) => setVehModel(e.target.value)}
                    className="w-full bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] rounded-xl px-3 py-2"
                  />
                </div>
              </div>
            </>
          )}

          {modalType === 'schedule' && (
            <>
              <div className="space-y-1">
                <label className="font-semibold">Student</label>
                <select
                  value={schEnrollmentId}
                  onChange={(e) => setSchEnrollmentId(e.target.value)}
                  className="w-full bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] rounded-xl px-3 py-2"
                >
                  {enrollments.map(e => <option key={e.id} value={e.id}>{e.student_name} ({e.student_code})</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-semibold">Class Topic / Module</label>
                <input
                  type="text"
                  value={schTopic}
                  onChange={(e) => setSchTopic(e.target.value)}
                  className="w-full bg-[#F5F7FB] dark:bg-[#0B1728] border border-[#E5EAF1] dark:border-[#1E293B] rounded-xl px-3 py-2"
                />
              </div>
            </>
          )}

          <div className="pt-3 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-600/20"
            >
              {loading ? 'Submitting...' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
