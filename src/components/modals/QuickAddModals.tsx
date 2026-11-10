'use client';

import React, { useState } from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { X, UserPlus, Car, Users, IndianRupee, Calendar, ShieldCheck, Check } from 'lucide-react';
import { LLRegistrationFields, LLRegistrationData } from '@/components/licence/LLRegistrationFields';

interface QuickAddModalProps {
  type: 'student' | 'instructor' | 'staff' | 'payment' | 'schedule' | 'vehicle' | null;
  onClose: () => void;
}

export const QuickAddModals: React.FC<QuickAddModalProps> = ({ type, onClose }) => {
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
    addVehicle, 
    addToast 
  } = useDrivingSchool();

  // Student Form State
  const [studentForm, setStudentForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    courseId: courses[0]?.id || '',
    instructorId: instructors[0]?.id || '',
    vehicleId: vehicles[0]?.id || '',
    agreedFee: courses[0]?.price || 12500,
    initialPayment: 3500,
    paymentMethod: 'UPI' as 'UPI' | 'Cash' | 'Bank Transfer',
    gender: 'Male',
    dateOfBirth: '2000-01-01',
    city: 'Pune',
    area: '',
    pincode: '411001'
  });

  const [llData, setLLData] = useState<LLRegistrationData>({ hasExistingLL: false });

  // Instructor Form State
  const [instructorForm, setInstructorForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    licenceNumber: '',
    experienceYears: 5,
    assignedVehicleId: vehicles[0]?.id || ''
  });

  // Staff Form State
  const [staffForm, setStaffForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    roleTitle: 'Front Desk & Admissions Coordinator',
    permissions: {
      can_admit_students: true,
      can_manage_fees: true,
      can_confirm_payments: false,
      can_assign_instructors: true,
      can_manage_licences: true,
      can_manage_vehicles: false,
      can_view_reports: true
    }
  });

  // Payment Form State
  const [paymentForm, setPaymentForm] = useState({
    enrollmentId: enrollments[0]?.id || '',
    amount: 5000,
    paymentMethod: 'UPI' as 'UPI' | 'Cash' | 'Bank Transfer' | 'Card',
    transactionReference: '',
    notes: 'Course fee installment'
  });

  // Schedule Form State
  const [scheduleForm, setScheduleForm] = useState({
    enrollmentId: enrollments[0]?.id || '',
    instructorId: instructors[0]?.id || '',
    vehicleId: vehicles[0]?.id || '',
    date: '2026-11-10',
    time: '08:00',
    topic: 'City Traffic Navigation & Roundabouts'
  });

  // Vehicle Form State
  const [vehicleForm, setVehicleForm] = useState({
    registrationNumber: '',
    brand: 'Maruti Suzuki',
    model: 'Swift Dzire Dual Control',
    vehicleType: '4W_Manual' as '2W' | '4W_Manual' | '4W_Automatic' | 'Heavy',
    fuelType: 'Petrol',
    isDualControl: true,
    assignedInstructorId: instructors[0]?.id || '',
    insuranceExpiry: '2027-11-10',
    pucExpiry: '2027-05-10'
  });

  const [loading, setLoading] = useState(false);

  if (!type) return null;

  // Handlers
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.fullName || !studentForm.phone) {
      alert('Please fill full name and phone number.');
      return;
    }
    setLoading(true);
    try {
      const res = await addStudent({
        fullName: studentForm.fullName,
        phone: studentForm.phone,
        email: studentForm.email,
        courseId: studentForm.courseId,
        instructorId: studentForm.instructorId,
        vehicleId: studentForm.vehicleId,
        agreedFee: Number(studentForm.agreedFee),
        initialPayment: Number(studentForm.initialPayment),
        paymentMethod: studentForm.paymentMethod,
        gender: studentForm.gender,
        dateOfBirth: studentForm.dateOfBirth,
        address: { city: studentForm.city, area: studentForm.area, pincode: studentForm.pincode },
        hasExistingLL: llData.hasExistingLL,
        llNumber: llData.llNumber,
        llIssueDate: llData.llIssueDate,
        llExpiryDate: llData.llExpiryDate,
        llVehicleCategory: llData.llVehicleCategory,
        llDocumentName: llData.llDocumentName,
        llDocumentUrl: llData.llDocumentUrl
      });
      if (res.success) {
        addToast(`Student admitted successfully! Code: ${res.studentCode}`, 'success');
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instructorForm.fullName || !instructorForm.phone) {
      alert('Please fill instructor name and contact phone.');
      return;
    }
    setLoading(true);
    try {
      const res = await addInstructor({
        fullName: instructorForm.fullName,
        phone: instructorForm.phone,
        email: instructorForm.email,
        licenceNumber: instructorForm.licenceNumber,
        experienceYears: Number(instructorForm.experienceYears),
        assignedVehicleId: instructorForm.assignedVehicleId
      });
      if (res.success) {
        addToast(`Instructor registered successfully! Code: ${res.instructorCode}`, 'success');
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffForm.fullName || !staffForm.phone) {
      alert('Please fill staff name and contact number.');
      return;
    }
    setLoading(true);
    try {
      const res = await addStaff({
        fullName: staffForm.fullName,
        phone: staffForm.phone,
        email: staffForm.email,
        roleTitle: staffForm.roleTitle,
        permissions: staffForm.permissions
      });
      if (res.success) {
        addToast(`Staff member registered! ID: ${res.employeeCode}`, 'success');
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentForm.enrollmentId || !paymentForm.amount) {
      alert('Please select student and specify payment amount.');
      return;
    }
    setLoading(true);
    try {
      const res = await addPayment({
        enrollmentId: paymentForm.enrollmentId,
        amount: Number(paymentForm.amount),
        paymentMethod: paymentForm.paymentMethod,
        transactionReference: paymentForm.transactionReference,
        notes: paymentForm.notes
      });
      if (res.success) {
        addToast(res.message, 'success');
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const start = `${scheduleForm.date}T${scheduleForm.time}:00+05:30`;
      const end = `${scheduleForm.date}T${String(Number(scheduleForm.time.split(':')[0]) + 1).padStart(2, '0')}:${scheduleForm.time.split(':')[1]}:00+05:30`;
      const res = await addSchedule({
        enrollmentId: scheduleForm.enrollmentId,
        instructorId: scheduleForm.instructorId,
        vehicleId: scheduleForm.vehicleId,
        scheduledStart: start,
        scheduledEnd: end,
        topic: scheduleForm.topic
      });
      if (res.success) {
        addToast('Driving session scheduled successfully!', 'success');
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleForm.registrationNumber || !vehicleForm.model) {
      alert('Please fill vehicle registration number and model.');
      return;
    }
    setLoading(true);
    try {
      const res = await addVehicle({
        registrationNumber: vehicleForm.registrationNumber,
        brand: vehicleForm.brand,
        model: vehicleForm.model,
        vehicleType: vehicleForm.vehicleType,
        fuelType: vehicleForm.fuelType,
        isDualControl: vehicleForm.isDualControl,
        assignedInstructorId: vehicleForm.assignedInstructorId,
        insuranceExpiry: vehicleForm.insuranceExpiry,
        pucExpiry: vehicleForm.pucExpiry
      });
      if (res.success) {
        addToast(res.message, 'success');
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-xl w-full border border-slate-800 shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="bg-slate-950/80 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              {type === 'student' && <UserPlus className="w-5 h-5" />}
              {type === 'instructor' && <Users className="w-5 h-5" />}
              {type === 'staff' && <ShieldCheck className="w-5 h-5" />}
              {type === 'payment' && <IndianRupee className="w-5 h-5" />}
              {type === 'schedule' && <Calendar className="w-5 h-5" />}
              {type === 'vehicle' && <Car className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white capitalize">
                {type === 'student' && 'New Student Admission'}
                {type === 'instructor' && 'Add Driving Instructor'}
                {type === 'staff' && 'Register Staff Member'}
                {type === 'payment' && 'Record Student Payment'}
                {type === 'schedule' && 'Create Driving Class Schedule'}
                {type === 'vehicle' && 'Add Vehicle to Fleet'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Official Owner Management Console</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
          {/* 1. ADD STUDENT FORM */}
          {type === 'student' && (
            <form onSubmit={handleAddStudent} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={studentForm.fullName}
                    onChange={e => setStudentForm({ ...studentForm, fullName: e.target.value })}
                    placeholder="e.g. Anand Deshmukh"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    value={studentForm.phone}
                    onChange={e => setStudentForm({ ...studentForm, phone: e.target.value })}
                    placeholder="+91 98220 12345"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={studentForm.email}
                    onChange={e => setStudentForm({ ...studentForm, email: e.target.value })}
                    placeholder="anand@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Select Course *</label>
                  <select
                    value={studentForm.courseId}
                    onChange={e => {
                      const c = courses.find(course => course.id === e.target.value);
                      setStudentForm({ 
                        ...studentForm, 
                        courseId: e.target.value,
                        agreedFee: c ? c.price : studentForm.agreedFee 
                      });
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.name} (₹{course.price.toLocaleString('en-IN')})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Assigned Instructor</label>
                  <select
                    value={studentForm.instructorId}
                    onChange={e => setStudentForm({ ...studentForm, instructorId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {instructors.map(ins => (
                      <option key={ins.id} value={ins.id}>
                        {ins.full_name} ({ins.instructor_code})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Assigned Vehicle</label>
                  <select
                    value={studentForm.vehicleId}
                    onChange={e => setStudentForm({ ...studentForm, vehicleId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.brand} {v.model} ({v.registration_number})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Agreed Total Fee (₹)</label>
                  <input
                    type="number"
                    value={studentForm.agreedFee}
                    onChange={e => setStudentForm({ ...studentForm, agreedFee: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Initial Down Payment (₹)</label>
                  <input
                    type="number"
                    value={studentForm.initialPayment}
                    onChange={e => setStudentForm({ ...studentForm, initialPayment: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Payment Method</label>
                  <select
                    value={studentForm.paymentMethod}
                    onChange={e => setStudentForm({ ...studentForm, paymentMethod: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="UPI">UPI / QR</option>
                    <option value="Cash">Cash Counter</option>
                    <option value="Bank Transfer">Bank Transfer / IMPS</option>
                  </select>
                </div>
              </div>

              {/* Mandatory Learning Licence Registration Question */}
              <div className="pt-2 border-t border-slate-800">
                <LLRegistrationFields
                  value={llData}
                  onChange={setLLData}
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-lg shadow-blue-500/20"
                >
                  {loading ? 'Processing...' : 'Complete Admission'}
                </button>
              </div>
            </form>
          )}

          {/* 2. ADD INSTRUCTOR FORM */}
          {type === 'instructor' && (
            <form onSubmit={handleAddInstructor} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Instructor Full Name *</label>
                  <input
                    type="text"
                    required
                    value={instructorForm.fullName}
                    onChange={e => setInstructorForm({ ...instructorForm, fullName: e.target.value })}
                    placeholder="e.g. Ramesh Kadam"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={instructorForm.phone}
                    onChange={e => setInstructorForm({ ...instructorForm, phone: e.target.value })}
                    placeholder="+91 98220 54321"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Driving Licence Number *</label>
                  <input
                    type="text"
                    required
                    value={instructorForm.licenceNumber}
                    onChange={e => setInstructorForm({ ...instructorForm, licenceNumber: e.target.value })}
                    placeholder="MH-12-2015-004921"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    value={instructorForm.experienceYears}
                    onChange={e => setInstructorForm({ ...instructorForm, experienceYears: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Assigned Academy Vehicle</label>
                <select
                  value={instructorForm.assignedVehicleId}
                  onChange={e => setInstructorForm({ ...instructorForm, assignedVehicleId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">None / Standby</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.brand} {v.model} ({v.registration_number})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-lg shadow-blue-500/20"
                >
                  {loading ? 'Saving...' : 'Add Instructor'}
                </button>
              </div>
            </form>
          )}

          {/* 3. ADD STAFF FORM */}
          {type === 'staff' && (
            <form onSubmit={handleAddStaff} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Staff Full Name *</label>
                  <input
                    type="text"
                    required
                    value={staffForm.fullName}
                    onChange={e => setStaffForm({ ...staffForm, fullName: e.target.value })}
                    placeholder="e.g. Aarti Joshi"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={staffForm.phone}
                    onChange={e => setStaffForm({ ...staffForm, phone: e.target.value })}
                    placeholder="+91 98220 99112"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Role Title</label>
                <input
                  type="text"
                  value={staffForm.roleTitle}
                  onChange={e => setStaffForm({ ...staffForm, roleTitle: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-white block mb-2">Granular Permissions</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Object.entries(staffForm.permissions).map(([key, val]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                      <input
                        type="checkbox"
                        checked={val}
                        onChange={e => setStaffForm({
                          ...staffForm,
                          permissions: { ...staffForm.permissions, [key]: e.target.checked }
                        })}
                        className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
                      />
                      <span className="text-[11px] capitalize">{key.replace(/can_/g, '').replace(/_/g, ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-lg shadow-blue-500/20"
                >
                  {loading ? 'Registering...' : 'Register Staff'}
                </button>
              </div>
            </form>
          )}

          {/* 4. ADD PAYMENT FORM */}
          {type === 'payment' && (
            <form onSubmit={handleAddPayment} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Select Student Enrollment *</label>
                <select
                  value={paymentForm.enrollmentId}
                  onChange={e => setPaymentForm({ ...paymentForm, enrollmentId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  {enrollments.map(enr => (
                    <option key={enr.id} value={enr.id}>
                      {enr.student_name} ({enr.student_code}) — {enr.course_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={paymentForm.amount}
                    onChange={e => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 text-sm font-bold tabular-nums"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Payment Method *</label>
                  <select
                    value={paymentForm.paymentMethod}
                    onChange={e => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="UPI">UPI / QR Code</option>
                    <option value="Cash">Cash at Counter</option>
                    <option value="Bank Transfer">Bank Transfer / NEFT</option>
                    <option value="Card">Debit / Credit Card</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Transaction Ref / Cheque No</label>
                <input
                  type="text"
                  value={paymentForm.transactionReference}
                  onChange={e => setPaymentForm({ ...paymentForm, transactionReference: e.target.value })}
                  placeholder="UPI Ref ID: 62918290123"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Notes</label>
                <input
                  type="text"
                  value={paymentForm.notes}
                  onChange={e => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-lg shadow-emerald-500/20"
                >
                  {loading ? 'Recording...' : 'Confirm Payment & Receipt'}
                </button>
              </div>
            </form>
          )}

          {/* 5. CREATE SCHEDULE FORM */}
          {type === 'schedule' && (
            <form onSubmit={handleCreateSchedule} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Student Enrollment *</label>
                <select
                  value={scheduleForm.enrollmentId}
                  onChange={e => setScheduleForm({ ...scheduleForm, enrollmentId: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  {enrollments.map(enr => (
                    <option key={enr.id} value={enr.id}>
                      {enr.student_name} ({enr.student_code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Instructor</label>
                  <select
                    value={scheduleForm.instructorId}
                    onChange={e => setScheduleForm({ ...scheduleForm, instructorId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {instructors.map(ins => (
                      <option key={ins.id} value={ins.id}>
                        {ins.full_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Vehicle</label>
                  <select
                    value={scheduleForm.vehicleId}
                    onChange={e => setScheduleForm({ ...scheduleForm, vehicleId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    {vehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.brand} {v.model} ({v.registration_number})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Class Date</label>
                  <input
                    type="date"
                    value={scheduleForm.date}
                    onChange={e => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Start Time</label>
                  <input
                    type="time"
                    value={scheduleForm.time}
                    onChange={e => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Curriculum Topic / Module</label>
                <input
                  type="text"
                  value={scheduleForm.topic}
                  onChange={e => setScheduleForm({ ...scheduleForm, topic: e.target.value })}
                  placeholder="e.g. Hill Start & Clutch Bite Control"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-lg shadow-blue-500/20"
                >
                  {loading ? 'Booking...' : 'Book Schedule'}
                </button>
              </div>
            </form>
          )}

          {/* 6. ADD VEHICLE FORM */}
          {type === 'vehicle' && (
            <form onSubmit={handleAddVehicle} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Registration Plate *</label>
                  <input
                    type="text"
                    required
                    value={vehicleForm.registrationNumber}
                    onChange={e => setVehicleForm({ ...vehicleForm, registrationNumber: e.target.value.toUpperCase() })}
                    placeholder="MH-12-PQ-9988"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Vehicle Type</label>
                  <select
                    value={vehicleForm.vehicleType}
                    onChange={e => setVehicleForm({ ...vehicleForm, vehicleType: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="4W_Manual">4W Manual (Dual Pedal)</option>
                    <option value="4W_Automatic">4W Automatic</option>
                    <option value="2W">2W Motorcycle / Scooter</option>
                    <option value="Heavy">Heavy Commercial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Brand & Model *</label>
                  <input
                    type="text"
                    required
                    value={vehicleForm.model}
                    onChange={e => setVehicleForm({ ...vehicleForm, model: e.target.value })}
                    placeholder="Maruti Baleno Dual Control"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Assigned Instructor</label>
                  <select
                    value={vehicleForm.assignedInstructorId}
                    onChange={e => setVehicleForm({ ...vehicleForm, assignedInstructorId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Unassigned</option>
                    {instructors.map(ins => (
                      <option key={ins.id} value={ins.id}>
                        {ins.full_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Insurance Expiry</label>
                  <input
                    type="date"
                    value={vehicleForm.insuranceExpiry}
                    onChange={e => setVehicleForm({ ...vehicleForm, insuranceExpiry: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">PUC Expiry</label>
                  <input
                    type="date"
                    value={vehicleForm.pucExpiry}
                    onChange={e => setVehicleForm({ ...vehicleForm, pucExpiry: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-lg shadow-blue-500/20"
                >
                  {loading ? 'Adding...' : 'Add Vehicle'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
