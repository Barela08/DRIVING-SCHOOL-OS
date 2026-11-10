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
  LicenceStatus,
  StaffMember,
  NotificationItem 
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
  mockAuditLogs,
  mockStaffMembers,
  mockNotifications
} from '@/lib/mockData';

interface DrivingSchoolContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  role: UserRole;
  switchRole: (newRole: UserRole) => void;
  currentUser: UserProfile;
  school: School;
  branches: Branch[];
  vehicles: Vehicle[];
  courses: Course[];
  instructors: Instructor[];
  staffMembers: StaffMember[];
  students: Student[];
  enrollments: Enrollment[];
  attendanceRecords: AttendanceRecord[];
  payments: Payment[];
  licenceRecords: LicenceRecord[];
  schedules: ClassSchedule[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
  toasts: { id: string; type: 'success' | 'error' | 'info'; message: string }[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  
  // Core Business Actions
  markAttendance: (payload: {
    enrollmentId: string;
    sessionAllocationId: string;
    instructorId: string;
    vehicleId?: string;
    remarks?: string;
  }) => Promise<{ success: boolean; message: string; attendance?: AttendanceRecord }>;
  
  confirmPayment: (paymentId: string) => Promise<{ success: boolean; receiptNumber?: string }>;
  rejectPayment: (paymentId: string, reason: string) => Promise<{ success: boolean }>;
  
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

  updateStudent: (studentId: string, data: Partial<Student>) => Promise<{ success: boolean }>;

  addPayment: (data: {
    enrollmentId: string;
    amount: number;
    paymentMethod: 'UPI' | 'Cash' | 'Bank Transfer' | 'Card';
    transactionReference?: string;
    notes?: string;
  }) => Promise<{ success: boolean; message: string }>;

  addInstructor: (data: {
    fullName: string;
    phone: string;
    email: string;
    licenceNumber: string;
    experienceYears: number;
    assignedVehicleId?: string;
  }) => Promise<{ success: boolean; instructorCode: string; message: string }>;

  addStaff: (data: {
    fullName: string;
    phone: string;
    email: string;
    roleTitle: string;
    permissions?: StaffMember['permissions'];
  }) => Promise<{ success: boolean; employeeCode: string; message: string }>;

  addVehicle: (data: {
    registrationNumber: string;
    brand: string;
    model: string;
    vehicleType: '2W' | '4W_Manual' | '4W_Automatic' | 'Heavy';
    fuelType?: string;
    isDualControl: boolean;
    assignedInstructorId?: string;
    insuranceExpiry?: string;
    pucExpiry?: string;
  }) => Promise<{ success: boolean; message: string }>;

  addCourse: (data: {
    name: string;
    description: string;
    category: '2W' | '4W' | 'Commercial' | 'Combo';
    durationDays: number;
    price: number;
    templates: { sessionName: string; sessionCode: string; totalSessions: number }[];
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
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  exportToCSV: (reportType: string) => void;
  updateInstructor: (id: string, data: Partial<Instructor>) => Promise<{ success: boolean }>;
  updateVehicle: (id: string, data: Partial<Vehicle>) => Promise<{ success: boolean }>;
  updateStaff: (id: string, data: Partial<StaffMember>) => Promise<{ success: boolean }>;
  updateCourse: (id: string, data: Partial<Course>) => Promise<{ success: boolean }>;
  updateSchool: (data: Partial<School>) => Promise<{ success: boolean }>;
  updateSchedule: (id: string, data: Partial<ClassSchedule>) => Promise<{ success: boolean }>;
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
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [role, setRole] = useState<UserRole>('owner');
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEFAULT_USERS.owner);
  
  // State Entities
  const [school, setSchool] = useState<School>(mockSchool);
  const [branches, setBranches] = useState<Branch[]>(mockBranches);
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [instructors, setInstructors] = useState<Instructor[]>(mockInstructors);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(mockStaffMembers);
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [enrollments, setEnrollments] = useState<Enrollment[]>(mockEnrollments);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [licenceRecords, setLicenceRecords] = useState<LicenceRecord[]>(mockLicenceRecords);
  const [schedules, setSchedules] = useState<ClassSchedule[]>(mockSchedules);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [toasts, setToasts] = useState<{ id: string; type: 'success' | 'error' | 'info'; message: string }[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync theme with document class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

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
      message: `Attendance marked successfully for ${allocation.session_name_snapshot}! Completed ${allocation.completed_count + 1}/${allocation.allocated_count}.`,
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

  // Reject Payment
  const rejectPayment = async (paymentId: string, reason: string) => {
    setPayments(prev => prev.map(p => {
      if (p.id === paymentId) {
        return { ...p, status: 'Rejected', notes: `Rejected: ${reason}` };
      }
      return p;
    }));

    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      school_id: school.id,
      actor_name: `${currentUser.full_name} (${currentUser.role})`,
      action: 'REJECT_PAYMENT',
      entity_type: 'payments',
      entity_id: paymentId,
      details: `Rejected payment entry ID ${paymentId}. Reason: ${reason}`,
      created_at: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);
    return { success: true };
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

    // Update instructor active count
    setInstructors(prev => prev.map(ins => {
      if (ins.id === instructor?.id) {
        return { ...ins, active_students_count: (ins.active_students_count || 0) + 1 };
      }
      return ins;
    }));

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

    // Add notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      school_id: school.id,
      title: 'New Student Admission',
      message: `${data.fullName} (${studentCode}) admitted to ${course.name}.`,
      category: 'admission',
      is_read: false,
      created_at: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);

    return { 
      success: true, 
      studentCode, 
      message: `Student registered successfully! Unique Student Code: ${studentCode}` 
    };
  };

  // Update Student
  const updateStudent = async (studentId: string, data: Partial<Student>) => {
    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return { ...s, ...data };
      }
      return s;
    }));
    return { success: true };
  };

  // Add Payment Entry
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

  // Add Instructor
  const addInstructor = async (data: {
    fullName: string;
    phone: string;
    email: string;
    licenceNumber: string;
    experienceYears: number;
    assignedVehicleId?: string;
  }) => {
    const nextSeq = instructors.length + 1;
    const instructorCode = `INS-2026-${String(nextSeq).padStart(2, '0')}`;
    const vehicle = vehicles.find(v => v.id === data.assignedVehicleId);

    const newIns: Instructor = {
      id: `ins-${Date.now()}`,
      school_id: school.id,
      user_id: `usr-${Date.now()}`,
      instructor_code: instructorCode,
      full_name: data.fullName,
      phone: data.phone,
      email: data.email,
      licence_number: data.licenceNumber,
      experience_years: data.experienceYears,
      employment_status: 'active',
      assigned_vehicle_id: data.assignedVehicleId,
      assigned_vehicle_name: vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.registration_number})` : undefined,
      active_students_count: 0,
      today_sessions_count: 0
    };

    setInstructors(prev => [...prev, newIns]);
    return { success: true, instructorCode, message: `Instructor ${data.fullName} registered with Code ${instructorCode}!` };
  };

  // Add Staff Member
  const addStaff = async (data: {
    fullName: string;
    phone: string;
    email: string;
    roleTitle: string;
    permissions?: StaffMember['permissions'];
  }) => {
    const nextSeq = staffMembers.length + 1;
    const employeeCode = `STF-2026-${String(nextSeq).padStart(2, '0')}`;

    const newStaff: StaffMember = {
      id: `stf-${Date.now()}`,
      school_id: school.id,
      user_id: `usr-${Date.now()}`,
      employee_code: employeeCode,
      full_name: data.fullName,
      phone: data.phone,
      email: data.email,
      role_title: data.roleTitle,
      is_active: true,
      permissions: data.permissions || {
        can_admit_students: true,
        can_manage_fees: true,
        can_confirm_payments: false,
        can_assign_instructors: true,
        can_manage_licences: true,
        can_manage_vehicles: false,
        can_view_reports: false
      },
      created_at: new Date().toISOString()
    };

    setStaffMembers(prev => [...prev, newStaff]);
    return { success: true, employeeCode, message: `Staff member ${data.fullName} added with ID ${employeeCode}!` };
  };

  // Add Vehicle
  const addVehicle = async (data: {
    registrationNumber: string;
    brand: string;
    model: string;
    vehicleType: '2W' | '4W_Manual' | '4W_Automatic' | 'Heavy';
    fuelType?: string;
    isDualControl: boolean;
    assignedInstructorId?: string;
    insuranceExpiry?: string;
    pucExpiry?: string;
  }) => {
    const instructor = instructors.find(i => i.id === data.assignedInstructorId);

    const newVehicle: Vehicle = {
      id: `veh-${Date.now()}`,
      school_id: school.id,
      registration_number: data.registrationNumber.toUpperCase(),
      brand: data.brand,
      model: data.model,
      vehicle_type: data.vehicleType,
      fuel_type: data.fuelType || 'Petrol',
      is_dual_control: data.isDualControl,
      assigned_instructor_id: data.assignedInstructorId,
      assigned_instructor_name: instructor?.full_name,
      insurance_expiry: data.insuranceExpiry,
      puc_expiry: data.pucExpiry,
      status: data.assignedInstructorId ? 'Assigned' : 'Available'
    };

    setVehicles(prev => [...prev, newVehicle]);
    return { success: true, message: `Vehicle ${data.registrationNumber} added to academy fleet!` };
  };

  // Add Course
  const addCourse = async (data: {
    name: string;
    description: string;
    category: '2W' | '4W' | 'Commercial' | 'Combo';
    durationDays: number;
    price: number;
    templates: { sessionName: string; sessionCode: string; totalSessions: number }[];
  }) => {
    const courseId = `course-${Date.now()}`;
    const builtTemplates = data.templates.map((t, idx) => ({
      id: `tmpl-${idx}-${Date.now()}`,
      course_id: courseId,
      session_name: t.sessionName,
      session_code: t.sessionCode,
      total_sessions: t.totalSessions,
      sort_order: idx + 1
    }));

    const newCourse: Course = {
      id: courseId,
      school_id: school.id,
      name: data.name,
      description: data.description,
      category: data.category,
      duration_days: data.durationDays,
      price: data.price,
      is_active: true,
      templates: builtTemplates
    };

    setCourses(prev => [...prev, newCourse]);
    return { success: true, message: `Course "${data.name}" published with ${builtTemplates.length} session categories!` };
  };

  // Update Licence Progress
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

  // Schedule Class
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

  // Search Student By Code or Phone
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

  // Mark notification as read
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  // Update Instructor
  const updateInstructor = async (id: string, data: Partial<Instructor>) => {
    setInstructors(prev => prev.map(ins => ins.id === id ? { ...ins, ...data } : ins));
    const ins = instructors.find(i => i.id === id);
    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      school_id: school.id,
      actor_name: `${currentUser.full_name} (${currentUser.role})`,
      action: 'UPDATE_INSTRUCTOR',
      entity_type: 'instructors',
      entity_id: id,
      details: `Updated instructor ${ins?.full_name || id} details.`,
      created_at: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);
    return { success: true };
  };

  // Update Vehicle
  const updateVehicle = async (id: string, data: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(veh => veh.id === id ? { ...veh, ...data } : veh));
    const veh = vehicles.find(v => v.id === id);
    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      school_id: school.id,
      actor_name: `${currentUser.full_name} (${currentUser.role})`,
      action: 'UPDATE_VEHICLE',
      entity_type: 'vehicles',
      entity_id: id,
      details: `Updated vehicle ${veh?.registration_number || id} details.`,
      created_at: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);
    return { success: true };
  };

  // Update Staff
  const updateStaff = async (id: string, data: Partial<StaffMember>) => {
    setStaffMembers(prev => prev.map(stf => stf.id === id ? { ...stf, ...data } : stf));
    const stf = staffMembers.find(s => s.id === id);
    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      school_id: school.id,
      actor_name: `${currentUser.full_name} (${currentUser.role})`,
      action: 'UPDATE_STAFF',
      entity_type: 'staff_members',
      entity_id: id,
      details: `Updated staff ${stf?.full_name || id} permissions/status.`,
      created_at: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);
    return { success: true };
  };

  // Update Course
  const updateCourse = async (id: string, data: Partial<Course>) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    const crs = courses.find(c => c.id === id);
    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      school_id: school.id,
      actor_name: `${currentUser.full_name} (${currentUser.role})`,
      action: 'UPDATE_COURSE',
      entity_type: 'courses',
      entity_id: id,
      details: `Updated course ${crs?.name || id} template / pricing.`,
      created_at: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);
    return { success: true };
  };

  // Update School
  const updateSchool = async (data: Partial<School>) => {
    setSchool(prev => ({ ...prev, ...data }));
    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      school_id: school.id,
      actor_name: `${currentUser.full_name} (${currentUser.role})`,
      action: 'UPDATE_SCHOOL_SETTINGS',
      entity_type: 'schools',
      entity_id: school.id,
      details: `Updated school organization details & branding.`,
      created_at: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);
    return { success: true };
  };

  // Update Schedule
  const updateSchedule = async (id: string, data: Partial<ClassSchedule>) => {
    setSchedules(prev => prev.map(sch => sch.id === id ? { ...sch, ...data } : sch));
    return { success: true };
  };

  // Export to CSV helper
  const exportToCSV = (reportType: string) => {
    let rows: any[] = [];
    let filename = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;

    if (reportType === 'students' || reportType === 'admissions') {
      rows = students.map(s => {
        const enr = enrollments.find(e => e.student_id === s.id);
        const paid = payments.filter(p => p.student_id === s.id && p.status === 'Confirmed').reduce((a, b) => a + b.amount, 0);
        const agreed = enr?.agreed_fee || 0;
        return {
          'Student Code': s.student_code,
          'Full Name': s.full_name,
          'Phone': s.phone,
          'Course': s.enrolled_course_name,
          'Status': s.status,
          'Admission Date': s.admission_date,
          'Agreed Fee (INR)': agreed,
          'Paid Fee (INR)': paid,
          'Pending Fee (INR)': Math.max(0, agreed - paid),
          'Completed Sessions': enr?.completed_sessions || 0,
          'Total Sessions': enr?.total_sessions || 20,
        };
      });
    } else if (reportType === 'attendance') {
      rows = attendanceRecords.map(a => ({
        'Attendance ID': a.id,
        'Date': a.attendance_date,
        'Student Code': a.student_code,
        'Student Name': a.student_name,
        'Instructor': a.instructor_name,
        'Session Category': a.session_name,
        'Vehicle': a.vehicle_info || 'Assigned Car',
        'Status': a.status,
        'Remarks': a.remarks || ''
      }));
    } else if (reportType === 'payments' || reportType === 'fees') {
      rows = payments.map(p => ({
        'Receipt No': p.receipt_number || 'PENDING',
        'Student Name': p.student_name,
        'Student Code': p.student_code,
        'Amount (INR)': p.amount,
        'Payment Mode': p.payment_method,
        'Status': p.status,
        'Received Date': p.received_at,
        'Confirmed By': p.confirmed_by || ''
      }));
    } else if (reportType === 'outstanding') {
      rows = enrollments.map(e => {
        const paid = payments.filter(p => p.student_id === e.student_id && p.status === 'Confirmed').reduce((a, b) => a + b.amount, 0);
        return {
          'Student Code': e.student_code,
          'Student Name': e.student_name,
          'Course': e.course_name,
          'Agreed Fee (INR)': e.agreed_fee,
          'Paid (INR)': paid,
          'Outstanding Balance (INR)': Math.max(0, e.agreed_fee - paid),
          'Enrollment Status': e.status
        };
      }).filter(r => r['Outstanding Balance (INR)'] > 0);
    } else if (reportType === 'instructors') {
      rows = instructors.map(ins => ({
        'Instructor Code': ins.instructor_code,
        'Full Name': ins.full_name,
        'Phone': ins.phone,
        'Licence No': ins.licence_number || '',
        'Experience (Years)': ins.experience_years,
        'Assigned Vehicle': ins.assigned_vehicle_name || 'None',
        'Active Students': ins.active_students_count || 0,
        'Employment Status': ins.employment_status
      }));
    } else if (reportType === 'licences') {
      rows = licenceRecords.map(l => ({
        'Student Code': l.student_code,
        'Student Name': l.student_name,
        'Licence Type': l.licence_type,
        'LL Status': l.ll_status,
        'LL Application Ref': l.ll_reference || '',
        'RTO Location': l.rto_name,
        'Driving Test Date': l.test_date || '',
        'Driving Test Result': l.test_result || 'Pending',
        'Issued Licence No': l.licence_number || ''
      }));
    } else if (reportType === 'fleet' || reportType === 'maintenance') {
      rows = vehicles.map(v => ({
        'Registration No': v.registration_number,
        'Brand': v.brand,
        'Model': v.model,
        'Type': v.vehicle_type,
        'Dual Control': v.is_dual_control ? 'Yes' : 'No',
        'Assigned Driver': v.assigned_instructor_name || 'Unassigned',
        'Status': v.status,
        'PUC Expiry': v.puc_expiry || '',
        'Insurance Expiry': v.insurance_expiry || ''
      }));
    }

    if (rows.length === 0) {
      alert(`No records found for ${reportType} report.`);
      return;
    }

    const headers = Object.keys(rows[0]).join(',');
    const csvContent = [headers, ...rows.map(r => Object.values(r).map(v => `"${v}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  return (
    <DrivingSchoolContext.Provider
      value={{
        theme,
        toggleTheme,
        role,
        switchRole,
        currentUser,
        school,
        branches,
        vehicles,
        courses,
        instructors,
        staffMembers,
        students,
        enrollments,
        attendanceRecords,
        payments,
        licenceRecords,
        schedules,
        notifications,
        auditLogs,
        markAttendance,
        confirmPayment,
        rejectPayment,
        addStudent,
        updateStudent,
        addPayment,
        addInstructor,
        addStaff,
        addVehicle,
        addCourse,
        updateLicenceStatus,
        addSchedule,
        searchStudentByCode,
        markNotificationRead,
        markAllNotificationsRead,
        exportToCSV,
        updateInstructor,
        updateVehicle,
        updateStaff,
        updateCourse,
        updateSchool,
        updateSchedule,
        toasts,
        addToast,
        removeToast
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
