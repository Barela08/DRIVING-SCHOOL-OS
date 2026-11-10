'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  UserProfile, 
  School, 
  Branch, 
  Vehicle, 
  Course, 
  Instructor, 
  Student, 
  Enrollment, 
  AttendanceRecord, 
  Payment, 
  LicenceRecord, 
  ClassSchedule, 
  AuditLog, 
  LicenceStatus 
} from '@/types';
import { 
  mockSchool, 
  mockBranches, 
  mockVehicles, 
  mockCourses, 
  mockInstructors, 
  mockStudents, 
  mockEnrollments, 
  mockAttendanceRecords, 
  mockPayments, 
  mockLicenceRecords, 
  mockSchedules, 
  mockAuditLogs 
} from '@/lib/mockData';

interface DrivingSchoolContextType {
  role: UserRole;
  switchRole: (newRole: UserRole) => void;
  currentUser: UserProfile;
  school: School;
  branches: Branch[];
  vehicles: Vehicle[];
  courses: Course[];
  instructors: Instructor[];
  students: Student[];
  enrollments: Enrollment[];
  attendanceRecords: AttendanceRecord[];
  payments: Payment[];
  licenceRecords: LicenceRecord[];
  schedules: ClassSchedule[];
  auditLogs: AuditLog[];
  
  // Core Business Actions
  markAttendance: (payload: {
    enrollmentId: string;
    sessionAllocationId: string;
    instructorId: string;
    vehicleId?: string;
    remarks?: string;
  }) => Promise<{ success: boolean; message: string; attendance?: AttendanceRecord }>;
  
  confirmPayment: (paymentId: string) => Promise<{ success: boolean; receiptNumber?: string }>;
  
  addStudent: (data: {
    fullName: string;
    phone: string;
    email?: string;
    courseId: string;
    instructorId?: string;
    vehicleId?: string;
    agreedFee?: number;
    initialPayment?: number;
    paymentMethod?: 'UPI' | 'Cash' | 'Bank Transfer';
    gender?: string;
    dateOfBirth?: string;
    address?: { city?: string; area?: string; pincode?: string };
  }) => Promise<{ success: boolean; studentCode: string; message: string }>;

  addPayment: (data: {
    enrollmentId: string;
    amount: number;
    paymentMethod: 'UPI' | 'Cash' | 'Bank Transfer' | 'Card';
    transactionReference?: string;
    notes?: string;
  }) => Promise<{ success: boolean; message: string }>;

  updateLicenceStatus: (
    studentId: string, 
    newStatus: LicenceStatus, 
    testDate?: string, 
    remarks?: string,
    licenceNumber?: string
  ) => Promise<{ success: boolean; message: string }>;

  addSchedule: (data: {
    enrollmentId: string;
    instructorId: string;
    vehicleId?: string;
    scheduledStart: string;
    scheduledEnd: string;
    topic: string;
  }) => Promise<{ success: boolean; message: string }>;

  searchStudentByCode: (code: string) => { student?: Student; enrollment?: Enrollment };
}

const DrivingSchoolContext = createContext<DrivingSchoolContextType | null>(null);

const DEFAULT_USERS: Record<UserRole, UserProfile> = {
  owner: {
    id: 'usr-owner-rajesh',
    full_name: 'Rajesh Mehta',
    phone: '+91 98220 99887',
    email: 'owner@apexdriving.in',
    is_active: true,
    role: 'owner',
    school_id: 'school-apex-001'
  },
  staff: {
    id: 'usr-staff-sunita',
    full_name: 'Sunita Patil',
    phone: '+91 98220 55443',
    email: 'staff@apexdriving.in',
    is_active: true,
    role: 'staff',
    school_id: 'school-apex-001'
  },
  instructor: {
    id: 'usr-ins-vikram',
    full_name: 'Vikram Shinde',
    phone: '+91 98220 12345',
    email: 'vikram.instructor@apexdriving.in',
    is_active: true,
    role: 'instructor',
    school_id: 'school-apex-001'
  },
  student: {
    id: 'usr-stud-rahul',
    full_name: 'Rahul Sharma',
    phone: '+91 98900 11223',
    email: 'rahul.sharma@gmail.com',
    is_active: true,
    role: 'student',
    school_id: 'school-apex-001'
  }
};

export const DrivingSchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('owner');
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEFAULT_USERS.owner);
  
  // State Entities
  const [school] = useState<School>(mockSchool);
  const [branches] = useState<Branch[]>(mockBranches);
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [instructors, setInstructors] = useState<Instructor[]>(mockInstructors);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(mockEnrollments);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [licenceRecords, setLicenceRecords] = useState<LicenceRecord[]>(mockLicenceRecords);
  const [schedules, setSchedules] = useState<ClassSchedule[]>(mockSchedules);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);

  // Switch role handler
  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    setCurrentUser(DEFAULT_USERS[newRole]);
  };

  // 1. One-Click Atomic Attendance Marking
  const markAttendance = async ({
    enrollmentId,
    sessionAllocationId,
    instructorId,
    vehicleId,
    remarks
  }: {
    enrollmentId: string;
    sessionAllocationId: string;
    instructorId: string;
    vehicleId?: string;
    remarks?: string;
  }) => {
    const enrollment = enrollments.find(e => e.id === enrollmentId);
    if (!enrollment) {
      return { success: false, message: 'Enrollment record not found' };
    }

    const allocation = enrollment.session_allocations?.find(sa => sa.id === sessionAllocationId);
    if (!allocation) {
      return { success: false, message: 'Session allocation not found' };
    }

    if (allocation.completed_count >= allocation.allocated_count) {
      return { 
        success: false, 
        message: `Allocation quota reached: ${allocation.completed_count}/${allocation.allocated_count} already completed for ${allocation.session_name_snapshot}` 
      };
    }

    const instructor = instructors.find(i => i.id === instructorId) || mockInstructors[0];
    const vehicle = vehicles.find(v => v.id === vehicleId) || vehicles.find(v => v.id === enrollment.assigned_vehicle_id);

    const newAttendance: AttendanceRecord = {
      id: `att-${Date.now()}`,
      school_id: school.id,
      enrollment_id: enrollment.id,
      student_id: enrollment.student_id,
      student_code: enrollment.student_code,
      student_name: enrollment.student_name,
      instructor_id: instructor.id,
      instructor_name: instructor.full_name,
      session_allocation_id: allocation.id,
      session_name: allocation.session_name_snapshot,
      vehicle_id: vehicle?.id,
      vehicle_info: vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.registration_number})` : undefined,
      attendance_date: new Date().toISOString().split('T')[0],
      marked_at: new Date().toISOString(),
      status: 'Present',
      remarks: remarks || 'Session completed successfully'
    };

    // Update Enrollment session allocation counts
    const updatedAllocations = enrollment.session_allocations?.map(sa => {
      if (sa.id === sessionAllocationId) {
        return { ...sa, completed_count: sa.completed_count + 1 };
      }
      return sa;
    });

    const updatedEnrollments = enrollments.map(e => {
      if (e.id === enrollmentId) {
        return {
          ...e,
          completed_sessions: e.completed_sessions + 1,
          session_allocations: updatedAllocations
        };
      }
      return e;
    });

    // Update instructor session count
    setInstructors(prev => prev.map(ins => {
      if (ins.id === instructor.id) {
        return { ...ins, today_sessions_count: (ins.today_sessions_count || 0) + 1 };
      }
      return ins;
    }));

    setEnrollments(updatedEnrollments);
    setAttendanceRecords(prev => [newAttendance, ...prev]);

    // Record audit log
    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      school_id: school.id,
      actor_name: `${instructor.full_name} (Instructor)`,
      action: 'MARK_ATTENDANCE',
      entity_type: 'attendance_records',
      entity_id: newAttendance.id,
      details: `Marked attendance for ${enrollment.student_name} (${enrollment.student_code}) — ${allocation.session_name_snapshot} (${allocation.completed_count + 1}/${allocation.allocated_count})`,
      created_at: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);

    return { 
      success: true, 
      message: `Marked present for ${allocation.session_name_snapshot}! Completed ${allocation.completed_count + 1}/${allocation.allocated_count}.`,
      attendance: newAttendance
    };
  };

  // 2. Confirm Payment
  const confirmPayment = async (paymentId: string) => {
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return { success: false };

    const receiptNo = `RCP-2026-${String(payments.length + 101).padStart(5, '0')}`;

    setPayments(prev => prev.map(p => {
      if (p.id === paymentId) {
        return {
          ...p,
          status: 'Confirmed',
          confirmed_by: currentUser.full_name,
          confirmed_at: new Date().toISOString(),
          receipt_number: receiptNo
        };
      }
      return p;
    }));

    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      school_id: school.id,
      actor_name: `${currentUser.full_name} (${currentUser.role})`,
      action: 'CONFIRM_PAYMENT',
      entity_type: 'payments',
      entity_id: paymentId,
      details: `Confirmed payment of ₹${payment.amount.toLocaleString('en-IN')} for ${payment.student_name}. Receipt #${receiptNo} generated.`,
      created_at: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);

    return { success: true, receiptNumber: receiptNo };
  };

  // 3. Add Student Admission
  const addStudent = async (data: {
    fullName: string;
    phone: string;
    email?: string;
    courseId: string;
    instructorId?: string;
    vehicleId?: string;
    agreedFee?: number;
    initialPayment?: number;
    paymentMethod?: 'UPI' | 'Cash' | 'Bank Transfer';
    gender?: string;
    dateOfBirth?: string;
    address?: { city?: string; area?: string; pincode?: string };
  }) => {
    const nextSeq = students.length + 101;
    const studentCode = `DS-2026-${String(nextSeq).padStart(5, '0')}`;
    const studentId = `stud-${Date.now()}`;
    const enrollmentId = `enr-${Date.now()}`;

    const course = courses.find(c => c.id === data.courseId) || courses[0];
    const instructor = instructors.find(i => i.id === data.instructorId) || instructors[0];
    const vehicle = vehicles.find(v => v.id === data.vehicleId) || vehicles[0];
    const finalFee = data.agreedFee || course.price;

    const newStudent: Student = {
      id: studentId,
      school_id: school.id,
      student_code: studentCode,
      full_name: data.fullName,
      phone: data.phone,
      email: data.email,
      date_of_birth: data.dateOfBirth,
      gender: data.gender,
      address: data.address,
      admission_date: new Date().toISOString().split('T')[0],
      status: 'Active',
      assigned_instructor_id: instructor?.id,
      assigned_instructor_name: instructor?.full_name,
      enrolled_course_id: course.id,
      enrolled_course_name: course.name,
      created_at: new Date().toISOString()
    };

    // Build session allocations from course templates
    const allocations = (course.templates || []).map((tmpl, idx) => ({
      id: `sa-new-${idx}-${Date.now()}`,
      enrollment_id: enrollmentId,
      session_template_id: tmpl.id,
      session_name_snapshot: tmpl.session_name,
      allocated_count: tmpl.total_sessions,
      completed_count: 0,
      sort_order: tmpl.sort_order
    }));

    const totalSessions = allocations.reduce((acc, a) => acc + a.allocated_count, 0) || 20;

    const newEnrollment: Enrollment = {
      id: enrollmentId,
      school_id: school.id,
      student_id: studentId,
      student_code: studentCode,
      student_name: data.fullName,
      course_id: course.id,
      course_name: course.name,
      branch_id: branches[0]?.id,
      assigned_instructor_id: instructor?.id,
      assigned_instructor_name: instructor?.full_name,
      assigned_vehicle_id: vehicle?.id,
      vehicle_registration: vehicle?.registration_number,
      start_date: new Date().toISOString().split('T')[0],
      agreed_fee: finalFee,
      status: 'Active',
      total_sessions: totalSessions,
      completed_sessions: 0,
      session_allocations: allocations
    };

    // Initialize Licence Record
    const newLicence: LicenceRecord = {
      id: `lic-${Date.now()}`,
      school_id: school.id,
      student_id: studentId,
      student_name: data.fullName,
      student_code: studentCode,
      licence_type: course.category === '2W' ? 'MCWG (Motorcycle with Gear)' : 'LMV (Light Motor Vehicle - Car)',
      ll_status: 'Documents Pending',
      rto_name: 'MH-12 Pune RTO',
      remarks: 'Application initiated upon admission.'
    };

    setStudents(prev => [newStudent, ...prev]);
    setEnrollments(prev => [newEnrollment, ...prev]);
    setLicenceRecords(prev => [newLicence, ...prev]);

    // Handle initial payment if provided
    if (data.initialPayment && data.initialPayment > 0) {
      const receiptNo = `RCP-2026-${String(payments.length + 101).padStart(5, '0')}`;
      const newPay: Payment = {
        id: `pay-${Date.now()}`,
        school_id: school.id,
        enrollment_id: enrollmentId,
        student_id: studentId,
        student_name: data.fullName,
        student_code: studentCode,
        amount: data.initialPayment,
        payment_method: data.paymentMethod || 'UPI',
        status: 'Confirmed',
        received_at: new Date().toISOString(),
        confirmed_by: currentUser.full_name,
        confirmed_at: new Date().toISOString(),
        receipt_number: receiptNo,
        notes: 'Admission down payment'
      };
      setPayments(prev => [newPay, ...prev]);
    }

    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      school_id: school.id,
      actor_name: `${currentUser.full_name} (${currentUser.role})`,
      action: 'NEW_ADMISSION',
      entity_type: 'students',
      entity_id: studentId,
      details: `Enrolled student ${data.fullName} with Code ${studentCode} in ${course.name}.`,
      created_at: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);

    return { 
      success: true, 
      studentCode, 
      message: `Student registered successfully! Unique Student Code: ${studentCode}` 
    };
  };

  // 4. Add Payment Entry
  const addPayment = async (data: {
    enrollmentId: string;
    amount: number;
    paymentMethod: 'UPI' | 'Cash' | 'Bank Transfer' | 'Card';
    transactionReference?: string;
    notes?: string;
  }) => {
    const enrollment = enrollments.find(e => e.id === data.enrollmentId);
    if (!enrollment) return { success: false, message: 'Enrollment not found' };

    const receiptNo = `RCP-2026-${String(payments.length + 101).padStart(5, '0')}`;

    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      school_id: school.id,
      enrollment_id: enrollment.id,
      student_id: enrollment.student_id,
      student_name: enrollment.student_name,
      student_code: enrollment.student_code,
      amount: data.amount,
      payment_method: data.paymentMethod,
      transaction_reference: data.transactionReference,
      status: currentUser.role === 'owner' ? 'Confirmed' : 'Pending',
      received_at: new Date().toISOString(),
      confirmed_by: currentUser.role === 'owner' ? currentUser.full_name : undefined,
      confirmed_at: currentUser.role === 'owner' ? new Date().toISOString() : undefined,
      receipt_number: currentUser.role === 'owner' ? receiptNo : undefined,
      notes: data.notes
    };

    setPayments(prev => [newPayment, ...prev]);

    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      school_id: school.id,
      actor_name: `${currentUser.full_name} (${currentUser.role})`,
      action: 'PAYMENT_RECORDED',
      entity_type: 'payments',
      entity_id: newPayment.id,
      details: `Received ₹${data.amount.toLocaleString('en-IN')} via ${data.paymentMethod} from ${enrollment.student_name} (${newPayment.status}).`,
      created_at: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);

    return { 
      success: true, 
      message: currentUser.role === 'owner' 
        ? `Payment of ₹${data.amount.toLocaleString('en-IN')} confirmed! Receipt #${receiptNo}` 
        : `Payment entry of ₹${data.amount.toLocaleString('en-IN')} saved as Pending Confirmation.` 
    };
  };

  // 5. Update Licence Progress
  const updateLicenceStatus = async (
    studentId: string, 
    newStatus: LicenceStatus, 
    testDate?: string, 
    remarks?: string,
    licenceNumber?: string
  ) => {
    setLicenceRecords(prev => prev.map(lic => {
      if (lic.student_id === studentId) {
        return {
          ...lic,
          ll_status: newStatus,
          test_date: testDate || lic.test_date,
          remarks: remarks || lic.remarks,
          licence_number: licenceNumber || lic.licence_number,
          test_result: newStatus === 'Test Passed' ? 'Passed' : newStatus === 'Test Failed' ? 'Failed' : lic.test_result
        };
      }
      return lic;
    }));

    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      school_id: school.id,
      actor_name: `${currentUser.full_name} (${currentUser.role})`,
      action: 'UPDATE_LICENCE_STATUS',
      entity_type: 'licence_records',
      details: `Updated RTO licence status to "${newStatus}" for student ${studentId}.`,
      created_at: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);

    return { success: true, message: `Licence status updated to: ${newStatus}` };
  };

  // 6. Schedule Class
  const addSchedule = async (data: {
    enrollmentId: string;
    instructorId: string;
    vehicleId?: string;
    scheduledStart: string;
    scheduledEnd: string;
    topic: string;
  }) => {
    const enrollment = enrollments.find(e => e.id === data.enrollmentId);
    if (!enrollment) return { success: false, message: 'Enrollment not found' };

    const instructor = instructors.find(i => i.id === data.instructorId);
    const vehicle = vehicles.find(v => v.id === data.vehicleId);

    const newSch: ClassSchedule = {
      id: `sch-${Date.now()}`,
      school_id: school.id,
      enrollment_id: enrollment.id,
      student_name: enrollment.student_name,
      student_code: enrollment.student_code,
      instructor_id: instructor?.id || '',
      instructor_name: instructor?.full_name || '',
      vehicle_id: vehicle?.id,
      vehicle_name: vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.registration_number})` : undefined,
      scheduled_start: data.scheduledStart,
      scheduled_end: data.scheduledEnd,
      topic: data.topic,
      status: 'Scheduled'
    };

    setSchedules(prev => [newSch, ...prev]);
    return { success: true, message: 'Class scheduled successfully' };
  };

  // 7. Search Student By Code or Phone
  const searchStudentByCode = (query: string) => {
    const cleanQuery = query.trim().toUpperCase();
    if (!cleanQuery) return {};

    const student = students.find(s => 
      s.student_code.toUpperCase().includes(cleanQuery) || 
      s.phone.replace(/\D/g, '').includes(cleanQuery.replace(/\D/g, '')) ||
      s.full_name.toUpperCase().includes(cleanQuery)
    );

    if (!student) return {};

    const enrollment = enrollments.find(e => e.student_id === student.id);
    return { student, enrollment };
  };

  return (
    <DrivingSchoolContext.Provider
      value={{
        role,
        switchRole,
        currentUser,
        school,
        branches,
        vehicles,
        courses,
        instructors,
        students,
        enrollments,
        attendanceRecords,
        payments,
        licenceRecords,
        schedules,
        auditLogs,
        markAttendance,
        confirmPayment,
        addStudent,
        addPayment,
        updateLicenceStatus,
        addSchedule,
        searchStudentByCode
      }}
    >
      {children}
    </DrivingSchoolContext.Provider>
  );
};

export const useDrivingSchool = () => {
  const context = useContext(DrivingSchoolContext);
  if (!context) {
    throw new Error('useDrivingSchool must be used within a DrivingSchoolProvider');
  }
  return context;
};
