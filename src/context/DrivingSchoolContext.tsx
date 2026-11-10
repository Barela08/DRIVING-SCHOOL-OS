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
  NotificationItem,
  StudentDocument,
  SupportTicket,
  DocumentType,
  LLReminderSettings,
  StudentLLProgress,
  CourseCertificate,
  CertificateTemplate,
  CertificateFeedback,
  CertificateDownloadLog
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
  mockNotifications,
  mockStudentDocuments,
  mockSupportTickets,
  mockLLReminderSettings,
  mockCertificates,
  mockCertificateTemplates,
  mockCertificateFeedbacks,
  mockCertificateDownloads
} from '@/lib/mockData';
import { 
  calculateAttendedClassDays, 
  shouldDispatchReminder, 
  DEFAULT_LL_REMINDER_SETTINGS 
} from '@/lib/llTrackingEngine';
import { verifyCourseCompletion, CompletionVerificationResult } from '@/lib/completionVerifier';
import { generateCertificatePdf } from '@/lib/certificateGenerator';
import { DEFAULT_CERTIFICATE_TEMPLATE } from '@/lib/defaultTemplate';

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
    hasExistingLL?: boolean;
    llNumber?: string;
    llIssueDate?: string;
    llExpiryDate?: string;
    llVehicleCategory?: string;
    llDocumentName?: string;
    llDocumentUrl?: string;
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

  // Learning Licence Tracking & Automatic Reminders
  llReminderSettings: LLReminderSettings;
  updateLLReminderSettings: (newSettings: Partial<LLReminderSettings>) => Promise<{ success: boolean; message: string }>;
  triggerLLReminder: (studentId: string, manual?: boolean) => Promise<{ success: boolean; message: string }>;
  updateLLApplicationWorkflow: (data: {
    studentId: string;
    newStatus: LicenceStatus;
    applicationNumber?: string;
    applicationDate?: string;
    testDate?: string;
    approvalDate?: string;
    documentFile?: File | string;
    documentName?: string;
    remarks?: string;
    auditReason?: string;
  }) => Promise<{ success: boolean; message: string }>;

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
  markAllNotificationsRead: (studentId?: string) => void;
  exportToCSV: (reportType: string) => void;
  updateInstructor: (id: string, data: Partial<Instructor>) => Promise<{ success: boolean }>;
  updateVehicle: (id: string, data: Partial<Vehicle>) => Promise<{ success: boolean }>;
  updateStaff: (id: string, data: Partial<StaffMember>) => Promise<{ success: boolean }>;
  updateCourse: (id: string, data: Partial<Course>) => Promise<{ success: boolean }>;
  updateSchool: (data: Partial<School>) => Promise<{ success: boolean }>;
  updateSchedule: (id: string, data: Partial<ClassSchedule>) => Promise<{ success: boolean }>;

  // Student Portal specific extensions
  activeStudentId: string;
  setActiveStudentId: (id: string) => void;
  studentDocuments: StudentDocument[];
  supportTickets: SupportTicket[];
  uploadStudentDocument: (data: {
    studentId: string;
    documentType: DocumentType;
    documentName: string;
    fileUrl?: string;
    fileSize?: string;
  }) => Promise<{ success: boolean; message: string; document?: StudentDocument }>;
  updateStudentProfile: (
    studentId: string, 
    allowedData: { phone?: string; email?: string; address?: Student['address']; emergency_contact?: Student['emergency_contact'] }
  ) => Promise<{ success: boolean; message: string }>;
  submitStudentPayment: (data: {
    enrollmentId: string;
    studentId: string;
    amount: number;
    paymentMethod: 'UPI' | 'Cash' | 'Bank Transfer' | 'Card';
    transactionReference?: string;
    notes?: string;
  }) => Promise<{ success: boolean; message: string }>;
  submitSupportTicket: (data: {
    studentId: string;
    category: SupportTicket['category'];
    subject: string;
    message: string;
  }) => Promise<{ success: boolean; ticketId: string; message: string }>;
  loginStudent: (identifier: string, passOrOtp: string, mode: 'id' | 'otp') => Promise<{ success: boolean; student?: Student; error?: string }>;

  // Certificate Management System
  certificates: CourseCertificate[];
  certificateTemplates: CertificateTemplate[];
  activeTemplate: CertificateTemplate;
  certificateFeedbacks: CertificateFeedback[];
  certificateDownloads: CertificateDownloadLog[];
  verifyCourseCompletion: (enrollmentId: string) => Promise<CompletionVerificationResult>;
  generateCertificate: (enrollmentId: string, options?: { force?: boolean }) => Promise<{ success: boolean; certificate?: CourseCertificate; message: string }>;
  submitCertificateFeedback: (data: {
    certificateId: string;
    overallRating: number;
    instructorRating: number;
    trainingQualityRating: number;
    writtenFeedback?: string;
    suggestions?: string;
    googleReviewClicked: boolean;
  }) => Promise<{ success: boolean; message: string }>;
  logCertificateDownload: (certificateId: string) => Promise<{ success: boolean }>;
  updateCertificateTemplate: (templateData: Partial<CertificateTemplate>) => Promise<{ success: boolean; message: string }>;
  updateSchoolSettings: (settings: { google_review_url?: string; auto_issue_certificates?: boolean }) => Promise<{ success: boolean; message: string }>;
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

  // Student Portal Specific State
  const [activeStudentId, setActiveStudentId] = useState<string>('stud-rahul-01');
  const [studentDocuments, setStudentDocuments] = useState<StudentDocument[]>(mockStudentDocuments);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(mockSupportTickets);

  // Learning Licence Reminder Settings
  const [llReminderSettings, setLlReminderSettings] = useState<LLReminderSettings>(mockLLReminderSettings);

  // Certificate Management System State
  const [certificates, setCertificates] = useState<CourseCertificate[]>(mockCertificates);
  const [certificateTemplates, setCertificateTemplates] = useState<CertificateTemplate[]>(mockCertificateTemplates);
  const [activeTemplate, setActiveTemplate] = useState<CertificateTemplate>(mockCertificateTemplates[0] || DEFAULT_CERTIFICATE_TEMPLATE);
  const [certificateFeedbacks, setCertificateFeedbacks] = useState<CertificateFeedback[]>(mockCertificateFeedbacks);
  const [certificateDownloads, setCertificateDownloads] = useState<CertificateDownloadLog[]>(mockCertificateDownloads);

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

  // Keep student user profile synchronized when role is student or activeStudentId changes
  useEffect(() => {
    if (role === 'student') {
      const activeStud = students.find(s => s.id === activeStudentId) || students[0];
      if (activeStud) {
        setCurrentUser({
          id: activeStud.user_id || `usr-${activeStud.id}`,
          full_name: activeStud.full_name,
          phone: activeStud.phone,
          email: activeStud.email,
          is_active: true,
          role: 'student',
          school_id: activeStud.school_id
        });
      }
    }
  }, [activeStudentId, role, students]);

  // Switch role handler
  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    if (newRole === 'student') {
      const activeStud = students.find(s => s.id === activeStudentId) || students[0];
      if (activeStud) {
        setCurrentUser({
          id: activeStud.user_id || `usr-${activeStud.id}`,
          full_name: activeStud.full_name,
          phone: activeStud.phone,
          email: activeStud.email,
          is_active: true,
          role: 'student',
          school_id: activeStud.school_id
        });
        return;
      }
    }
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

    // =========================================================================
    // AUTOMATIC COURSE COMPLETION DETECTION & CERTIFICATE TRIGGER
    // Automatically verify when all mandatory sessions & requirements are satisfied.
    // No manual Owner approval required!
    // =========================================================================
    const hypotheticalEnrollment: Enrollment = {
      ...enrollment,
      completed_sessions: enrollment.completed_sessions + 1,
      session_allocations: updatedAllocations
    };
    const hypotheticalAttendance = [newAttendance, ...attendanceRecords];
    const compResult = verifyCourseCompletion(hypotheticalEnrollment, hypotheticalAttendance);

    if (compResult.isComplete) {
      // 1. Mark student status as 'Course Completed'
      setStudents(prev => prev.map(s => s.id === enrollment.student_id ? { ...s, status: 'Course Completed' } : s));
      
      // 2. Mark enrollment status as 'Completed'
      setEnrollments(prev => prev.map(e => e.id === enrollment.id ? { 
        ...e, 
        status: 'Completed', 
        completed_sessions: e.completed_sessions + 1, 
        session_allocations: updatedAllocations 
      } : e));

      // 3. Immediately trigger certificate generation (idempotent & automatic)
      setTimeout(async () => {
        await generateCertificate(enrollment.id, { force: false });
      }, 50);
    }

    // =========================================================================
    // AUTOMATIC LEARNING LICENCE REMINDER EVALUATION
    // Evaluates actual verified attended class days against Owner configured policy.
    // Count distinct dates where status === 'Present'.
    // =========================================================================
    try {
      const allStudentAttendance = [newAttendance, ...attendanceRecords];
      const { distinctDaysCount, completedSessionsCount } = calculateAttendedClassDays(
        enrollment.student_id, 
        allStudentAttendance
      );

      const lic = licenceRecords.find(l => l.student_id === enrollment.student_id);
      const hasValidLL = Boolean(
        lic?.has_existing_ll || 
        lic?.ll_status === 'Already Available' || 
        lic?.ll_status === 'Approved' || 
        lic?.ll_status === 'LL Approved' ||
        lic?.ll_status === 'Licence Issued'
      );

      if (!hasValidLL && llReminderSettings.enabled && enrollment.status === 'Active') {
        const reachedDays = distinctDaysCount >= llReminderSettings.required_attended_days;
        const reachedSessions = completedSessionsCount >= (llReminderSettings.min_completed_sessions || 0);

        if (reachedDays && reachedSessions && shouldDispatchReminder(lic, llReminderSettings)) {
          const nowIso = new Date().toISOString();

          // Update licence record status to 'Reminder Sent'
          setLicenceRecords(prev => prev.map(l => {
            if (l.student_id === enrollment.student_id) {
              return {
                ...l,
                ll_status: 'Reminder Sent' as const,
                reminder_eligible: true,
                last_reminder_sent_date: nowIso,
                reminder_count: (l.reminder_count || 0) + 1,
                remarks: `Automated LL reminder dispatched upon reaching ${distinctDaysCount} attended class days.`
              };
            }
            return l;
          }));

          // Notify Owner and/or Student based on settings
          const newNotifs: NotificationItem[] = [];
          if (llReminderSettings.notify_owner) {
            newNotifs.push({
              id: `notif-ll-owner-${Date.now()}`,
              school_id: school.id,
              title: `LL Application Pending: ${enrollment.student_name}`,
              message: `Student ${enrollment.student_name} (${enrollment.student_code}) has completed ${distinctDaysCount} distinct attended class days (threshold: ${llReminderSettings.required_attended_days}). LL application reminder dispatched.`,
              category: 'licence',
              is_read: false,
              created_at: nowIso,
              link_url: '/owner?module=licences'
            });
          }

          if (llReminderSettings.notify_student) {
            newNotifs.push({
              id: `notif-ll-student-${Date.now()}`,
              school_id: school.id,
              student_id: enrollment.student_id,
              title: 'Time to Apply for your Learning Licence!',
              message: 'Your driving classes are progressing! It may be time to apply for your Learning Licence. Please check your eligibility and complete the application process.',
              category: 'licence',
              is_read: false,
              created_at: nowIso,
              link_url: '/student'
            });
          }

          if (newNotifs.length > 0) {
            setNotifications(prev => [...newNotifs, ...prev]);
          }

          setAuditLogs(prev => [
            {
              id: `aud-ll-trigger-${Date.now()}`,
              school_id: school.id,
              actor_name: 'System Automation',
              action: 'LL_REMINDER_TRIGGERED',
              entity_type: 'licence_records',
              entity_id: lic?.id,
              details: `Automated LL application reminder triggered for ${enrollment.student_name} (${enrollment.student_code}) on completing ${distinctDaysCount} attended class days.`,
              created_at: nowIso
            },
            ...prev
          ]);

          addToast(`🔔 LL reminder dispatched for ${enrollment.student_name} (${distinctDaysCount} attended class days)!`, 'info');
        }
      }
    } catch (err) {
      console.error('Error evaluating automatic LL reminder:', err);
    }

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
    hasExistingLL?: boolean;
    llNumber?: string;
    llIssueDate?: string;
    llExpiryDate?: string;
    llVehicleCategory?: string;
    llDocumentName?: string;
    llDocumentUrl?: string;
  }) => {
    const nextSeq = students.length + 101;
    const studentCode = `DS-2026-${String(nextSeq).padStart(5, '0')}`;
    const studentId = `stud-${Date.now()}`;
    const enrollmentId = `enr-${Date.now()}`;

    const course = courses.find(c => c.id === data.courseId) || courses[0];
    const instructor = instructors.find(i => i.id === data.instructorId) || instructors[0];
    const vehicle = vehicles.find(v => v.id === data.vehicleId) || vehicles[0];
    const finalFee = data.agreedFee || course.price;
    const hasLL = Boolean(data.hasExistingLL);

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
      has_existing_ll: hasLL,
      ll_number: hasLL ? data.llNumber : undefined,
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

    // Initialize Licence Record based on LL Question
    let initialLLStatus: LicenceStatus = 'Not Applied';
    let remarks = 'Automatic attended class-day tracking initiated upon admission.';
    if (hasLL) {
      initialLLStatus = 'Already Available';
      remarks = 'Valid LL provided during registration. No initial application reminder needed.';
    }

    const newLicence: LicenceRecord = {
      id: `lic-${Date.now()}`,
      school_id: school.id,
      student_id: studentId,
      student_name: data.fullName,
      student_code: studentCode,
      licence_type: data.llVehicleCategory || (course.category === '2W' ? 'MCWG' : course.category === 'Commercial' ? 'Commercial' : 'LMV'),
      has_existing_ll: hasLL,
      ll_status: initialLLStatus,
      licence_number: hasLL ? data.llNumber : undefined,
      ll_issue_date: hasLL ? data.llIssueDate : undefined,
      ll_valid_till: hasLL ? data.llExpiryDate : undefined,
      rto_name: 'MH-12 Pune RTO',
      ll_document_url: data.llDocumentUrl || (hasLL ? '/documents/ll_sample.pdf' : undefined),
      ll_document_name: data.llDocumentName || (hasLL ? 'Uploaded_Learner_Licence.pdf' : undefined),
      ll_document_verified: hasLL,
      reminder_eligible: false,
      reminder_count: 0,
      remarks
    };

    // If student has existing LL with document, store in studentDocuments
    if (hasLL) {
      const newDoc: StudentDocument = {
        id: `doc-ll-${Date.now()}`,
        school_id: school.id,
        student_id: studentId,
        document_type: 'Learner_Licence',
        document_name: data.llDocumentName || 'Learner_Licence_Document.pdf',
        file_url: data.llDocumentUrl || 'https://storage.supabase.co/student-documents/ll.pdf',
        file_size: '1.4 MB',
        mime_type: 'application/pdf',
        verification_status: 'Verified',
        uploaded_at: new Date().toISOString(),
        verified_at: new Date().toISOString(),
        notes: 'Submitted during admission (Already Available)'
      };
      setStudentDocuments(prev => [newDoc, ...prev]);

      // If already expired, alert owner
      if (data.llExpiryDate) {
        const todayStr = new Date().toISOString().split('T')[0];
        if (data.llExpiryDate < todayStr) {
          const expNotif: NotificationItem = {
            id: `notif-exp-${Date.now()}`,
            school_id: school.id,
            student_id: studentId,
            title: `Expired LL Warning: ${data.fullName}`,
            message: `The Learning Licence provided for ${data.fullName} expired on ${data.llExpiryDate}. Student will require renewal on Sarathi Parivahan before practical test.`,
            category: 'licence',
            is_read: false,
            created_at: new Date().toISOString(),
            link_url: '/owner?module=licences'
          };
          setNotifications(prev => [expNotif, ...prev]);
        }
      }
    }

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

  // Learning Licence Reminder Settings
  const updateLLReminderSettings = async (newSettings: Partial<LLReminderSettings>) => {
    const updated: LLReminderSettings = {
      ...llReminderSettings,
      ...newSettings,
      updated_at: new Date().toISOString(),
      updated_by: `${currentUser.full_name} (${currentUser.role})`
    };
    setLlReminderSettings(updated);

    const audit: AuditLog = {
      id: `aud-ll-sett-${Date.now()}`,
      school_id: school.id,
      actor_name: `${currentUser.full_name} (${currentUser.role})`,
      action: 'UPDATE_LL_SETTINGS',
      entity_type: 'school_ll_reminder_settings',
      details: `Updated LL reminder rules: threshold=${updated.required_attended_days} days, minSessions=${updated.min_completed_sessions}, freq=${updated.frequency}, enabled=${updated.enabled}.`,
      created_at: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);

    addToast('Learning Licence reminder settings saved successfully!', 'success');
    return { success: true, message: 'Settings saved successfully' };
  };

  // Trigger LL Reminder (Automated or Manual)
  const triggerLLReminder = async (studentId: string, manual = false) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return { success: false, message: 'Student not found' };

    const { distinctDaysCount } = calculateAttendedClassDays(studentId, attendanceRecords);
    const nowIso = new Date().toISOString();

    setLicenceRecords(prev => prev.map(l => {
      if (l.student_id === studentId) {
        return {
          ...l,
          ll_status: 'Reminder Sent' as const,
          reminder_eligible: true,
          last_reminder_sent_date: nowIso,
          reminder_count: (l.reminder_count || 0) + 1,
          remarks: manual 
            ? `Manual reminder sent by ${currentUser.full_name} (${distinctDaysCount} days attended).`
            : `Automated reminder dispatched after ${distinctDaysCount} attended class days.`
        };
      }
      return l;
    }));

    const newNotifs: NotificationItem[] = [];
    if (llReminderSettings.notify_owner || manual) {
      newNotifs.push({
        id: `notif-ll-owner-${Date.now()}`,
        school_id: school.id,
        title: `LL Reminder Sent: ${student.full_name}`,
        message: `${student.full_name} (${student.student_code}) has completed ${distinctDaysCount} attended class days and was notified to apply for a Learning Licence.`,
        category: 'licence',
        is_read: false,
        created_at: nowIso,
        link_url: '/owner?module=licences'
      });
    }

    if (llReminderSettings.notify_student) {
      newNotifs.push({
        id: `notif-ll-student-${Date.now()}`,
        school_id: school.id,
        student_id: student.id,
        title: 'Time to Apply for your Learning Licence!',
        message: 'Your driving classes are progressing! It may be time to apply for your Learning Licence. Please check your eligibility and complete the application process.',
        category: 'licence',
        is_read: false,
        created_at: nowIso,
        link_url: '/student'
      });
    }

    if (newNotifs.length > 0) {
      setNotifications(prev => [...newNotifs, ...prev]);
    }

    setAuditLogs(prev => [
      {
        id: `aud-ll-rem-${Date.now()}`,
        school_id: school.id,
        actor_name: `${currentUser.full_name} (${currentUser.role})`,
        action: 'LL_REMINDER_DISPATCHED',
        entity_type: 'licence_records',
        details: `Dispatched LL reminder for ${student.full_name} (${student.student_code}) with ${distinctDaysCount} attended days. Mode: ${manual ? 'Manual' : 'Automated'}.`,
        created_at: nowIso
      },
      ...prev
    ]);

    addToast(`Learning Licence reminder sent to ${student.full_name}!`, 'success');
    return { success: true, message: `Reminder sent to ${student.full_name}` };
  };

  // Update LL Application Workflow with Audit Logging & Document handling
  const updateLLApplicationWorkflow = async (data: {
    studentId: string;
    newStatus: LicenceStatus;
    applicationNumber?: string;
    applicationDate?: string;
    testDate?: string;
    approvalDate?: string;
    documentFile?: File | string;
    documentName?: string;
    remarks?: string;
    auditReason?: string;
  }) => {
    const student = students.find(s => s.id === data.studentId);
    if (!student) return { success: false, message: 'Student not found' };

    const nowIso = new Date().toISOString();
    const todayStr = nowIso.split('T')[0];

    // Compute 6-month validity if status is Approved
    let validTill: string | undefined = undefined;
    if (data.newStatus === 'Approved') {
      const apprDate = data.approvalDate || todayStr;
      const d = new Date(apprDate);
      d.setMonth(d.getMonth() + 6);
      validTill = d.toISOString().split('T')[0];
    }

    setLicenceRecords(prev => prev.map(l => {
      if (l.student_id === data.studentId) {
        return {
          ...l,
          ll_status: data.newStatus,
          application_number: data.applicationNumber || l.application_number,
          ll_reference: data.applicationNumber || l.ll_reference,
          ll_application_date: data.applicationDate || l.ll_application_date,
          test_date: data.testDate || l.test_date,
          approval_date: data.approvalDate || (data.newStatus === 'Approved' ? todayStr : l.approval_date),
          ll_issue_date: data.approvalDate || (data.newStatus === 'Approved' ? todayStr : l.ll_issue_date),
          ll_valid_till: validTill || l.ll_valid_till,
          ll_document_url: typeof data.documentFile === 'string' ? data.documentFile : l.ll_document_url,
          ll_document_name: data.documentName || l.ll_document_name,
          ll_document_verified: currentUser.role !== 'student',
          last_status_updated_by: `${currentUser.full_name} (${currentUser.role})`,
          last_status_updated_at: nowIso,
          // Stop reminders when Approved or Already Available
          reminder_eligible: data.newStatus === 'Approved' ? false : l.reminder_eligible,
          remarks: data.remarks || l.remarks
        };
      }
      return l;
    }));

    // If document is uploaded
    if (data.documentName || data.documentFile) {
      const newDoc: StudentDocument = {
        id: `doc-${Date.now()}`,
        school_id: school.id,
        student_id: data.studentId,
        document_type: 'Learner_Licence',
        document_name: data.documentName || 'Learner_Licence_Document.pdf',
        file_url: typeof data.documentFile === 'string' ? data.documentFile : 'https://storage.supabase.co/student-documents/ll.pdf',
        file_size: '1.2 MB',
        mime_type: 'application/pdf',
        verification_status: currentUser.role === 'student' ? 'Pending' : 'Verified',
        uploaded_at: nowIso,
        verified_at: currentUser.role === 'student' ? undefined : nowIso,
        notes: `Uploaded during LL status update (${data.newStatus}) by ${currentUser.full_name}`
      };
      setStudentDocuments(prev => [newDoc, ...prev]);
    }

    // Add Immutable Audit Log
    const audit: AuditLog = {
      id: `aud-ll-flow-${Date.now()}`,
      school_id: school.id,
      actor_name: `${currentUser.full_name} (${currentUser.role})`,
      action: 'UPDATE_LL_WORKFLOW',
      entity_type: 'licence_records',
      entity_id: data.studentId,
      details: `Updated LL workflow status to "${data.newStatus}" for ${student.full_name} (${student.student_code}). Reason/Audit: ${data.auditReason || data.remarks || 'Workflow update'}.`,
      created_at: nowIso
    };
    setAuditLogs(prev => [audit, ...prev]);

    // Create Notification
    setNotifications(prev => [
      {
        id: `notif-ll-stat-${Date.now()}`,
        school_id: school.id,
        student_id: data.studentId,
        title: `LL Status: ${data.newStatus}`,
        message: `Learning Licence status for ${student.full_name} (${student.student_code}) was updated to "${data.newStatus}".`,
        category: 'licence',
        is_read: false,
        created_at: nowIso,
        link_url: currentUser.role === 'student' ? '/student' : '/owner?module=licences'
      },
      ...prev
    ]);

    addToast(`Learning Licence status updated to ${data.newStatus}!`, 'success');
    return { success: true, message: `Status updated to ${data.newStatus}` };
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

  const markAllNotificationsRead = (studentId?: string) => {
    setNotifications(prev => prev.map(n => {
      if (!studentId || n.student_id === studentId || !n.student_id) {
        return { ...n, is_read: true };
      }
      return n;
    }));
  };

  // Student Portal: Update Permitted Contact Information
  const updateStudentProfile = async (
    studentId: string, 
    allowedData: { phone?: string; email?: string; address?: Student['address']; emergency_contact?: Student['emergency_contact'] }
  ) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return { success: false, message: 'Student record not found' };

    setStudents(prev => prev.map(s => {
      if (s.id === studentId) {
        return {
          ...s,
          phone: allowedData.phone || s.phone,
          email: allowedData.email !== undefined ? allowedData.email : s.email,
          address: allowedData.address ? { ...s.address, ...allowedData.address } : s.address,
          emergency_contact: allowedData.emergency_contact ? { ...s.emergency_contact, ...allowedData.emergency_contact } : s.emergency_contact,
        };
      }
      return s;
    }));

    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      school_id: school.id,
      actor_name: `${student.full_name} (Student)`,
      action: 'UPDATE_STUDENT_PROFILE',
      entity_type: 'students',
      entity_id: studentId,
      details: `Student updated permitted contact details (phone: ${allowedData.phone || student.phone})`,
      created_at: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);
    addToast('Contact details updated successfully!', 'success');
    return { success: true, message: 'Profile contact information updated successfully!' };
  };

  // Student Portal: Upload Document for Verification
  const uploadStudentDocument = async (data: {
    studentId: string;
    documentType: DocumentType;
    documentName: string;
    fileUrl?: string;
    fileSize?: string;
  }) => {
    const student = students.find(s => s.id === data.studentId);
    if (!student) return { success: false, message: 'Student not found' };

    const newDoc: StudentDocument = {
      id: `doc-${Date.now()}`,
      school_id: school.id,
      student_id: data.studentId,
      document_type: data.documentType,
      document_name: data.documentName,
      file_url: data.fileUrl || `https://storage.supabase.co/student-documents/${data.studentId}/${data.documentName}`,
      file_size: data.fileSize || '1.2 MB',
      mime_type: data.documentName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
      verification_status: 'Pending',
      uploaded_at: new Date().toISOString(),
      notes: 'Submitted via Student Portal. Awaiting counter verification.'
    };

    setStudentDocuments(prev => [newDoc, ...prev]);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      school_id: school.id,
      student_id: data.studentId,
      title: 'New Document Uploaded',
      message: `${student.full_name} (${student.student_code}) uploaded ${data.documentName} for verification.`,
      category: 'admission',
      is_read: false,
      created_at: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);

    addToast(`Document "${data.documentName}" uploaded for verification!`, 'success');
    return { success: true, message: 'Document uploaded successfully and queued for counter verification!', document: newDoc };
  };

  // Student Portal: Submit Payment Slip / UTR Reference
  const submitStudentPayment = async (data: {
    enrollmentId: string;
    studentId: string;
    amount: number;
    paymentMethod: 'UPI' | 'Cash' | 'Bank Transfer' | 'Card';
    transactionReference?: string;
    notes?: string;
  }) => {
    const enrollment = enrollments.find(e => e.id === data.enrollmentId);
    const student = students.find(s => s.id === data.studentId);
    if (!enrollment || !student) return { success: false, message: 'Enrollment or student record not found' };

    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      school_id: school.id,
      enrollment_id: enrollment.id,
      student_id: student.id,
      student_name: student.full_name,
      student_code: student.student_code,
      amount: data.amount,
      payment_method: data.paymentMethod,
      transaction_reference: data.transactionReference || `ONLINE/${Date.now()}`,
      status: 'Pending',
      received_at: new Date().toISOString(),
      notes: data.notes || 'Submitted via Student Portal (Pending Counter Confirmation)'
    };

    setPayments(prev => [newPayment, ...prev]);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      school_id: school.id,
      student_id: student.id,
      title: 'New Fee Payment Submitted',
      message: `${student.full_name} submitted ₹${data.amount.toLocaleString('en-IN')} via ${data.paymentMethod}. Awaiting confirmation.`,
      category: 'payment',
      is_read: false,
      created_at: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);

    addToast(`Payment proof of ₹${data.amount.toLocaleString('en-IN')} submitted!`, 'info');
    return { success: true, message: 'Payment submitted! Once verified by desk staff, your official receipt will be issued.' };
  };

  // Student Portal: Support Tickets
  const submitSupportTicket = async (data: {
    studentId: string;
    category: SupportTicket['category'];
    subject: string;
    message: string;
  }) => {
    const student = students.find(s => s.id === data.studentId);
    if (!student) return { success: false, ticketId: '', message: 'Student not found' };

    const ticketId = `TKT-2026-${String(supportTickets.length + 101).padStart(4, '0')}`;
    const newTicket: SupportTicket = {
      id: ticketId,
      school_id: school.id,
      student_id: student.id,
      student_name: student.full_name,
      student_code: student.student_code,
      category: data.category,
      subject: data.subject,
      message: data.message,
      status: 'Open',
      created_at: new Date().toISOString()
    };

    setSupportTickets(prev => [newTicket, ...prev]);
    addToast(`Support request #${ticketId} submitted. Academy staff will contact you.`, 'success');
    return { success: true, ticketId, message: `Support request #${ticketId} submitted successfully!` };
  };

  // Student Authentication with Student ID + Password or Mobile + OTP
  const loginStudent = async (identifier: string, passOrOtp: string, mode: 'id' | 'otp') => {
    const cleanId = identifier.trim().toUpperCase();
    const cleanDigits = identifier.replace(/\D/g, '');

    const found = students.find(s => 
      mode === 'id' 
        ? s.student_code.toUpperCase() === cleanId || s.student_code.toUpperCase().includes(cleanId)
        : s.phone.replace(/\D/g, '').endsWith(cleanDigits.slice(-10))
    );

    if (!found) {
      return { 
        success: false, 
        error: mode === 'id' 
          ? `No student found with Student ID "${identifier}". Please enter your code (e.g. DS-2026-00101).`
          : `No student registered with mobile number "${identifier}".`
      };
    }

    if (mode === 'id') {
      if (!passOrOtp || passOrOtp.length < 3) {
        return { success: false, error: 'Please enter your password.' };
      }
    } else {
      if (!passOrOtp || passOrOtp.length < 4) {
        return { success: false, error: 'Please enter a valid OTP.' };
      }
    }

    setActiveStudentId(found.id);
    setRole('student');
    setCurrentUser({
      id: found.user_id || `usr-${found.id}`,
      full_name: found.full_name,
      phone: found.phone,
      email: found.email,
      is_active: true,
      role: 'student',
      school_id: found.school_id
    });

    addToast(`Welcome back, ${found.full_name}!`, 'success');
    return { success: true, student: found };
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

  // =========================================================================
  // AUTOMATIC CERTIFICATE GENERATION & MANAGEMENT METHODS
  // =========================================================================

  const verifyCourseCompletionAction = async (enrollmentId: string): Promise<CompletionVerificationResult> => {
    const enr = enrollments.find(e => e.id === enrollmentId);
    if (!enr) {
      return {
        isComplete: false,
        enrollmentId,
        studentId: '',
        studentCode: '',
        studentName: '',
        courseName: '',
        totalRequiredSessions: 0,
        totalVerifiedSessions: 0,
        allocationsBreakdown: [],
        unfulfilledAllocations: [],
        summaryMessage: 'Enrollment record not found.'
      };
    }
    return verifyCourseCompletion(enr, attendanceRecords);
  };

  const generateCertificate = async (
    enrollmentId: string,
    options?: { force?: boolean }
  ): Promise<{ success: boolean; certificate?: CourseCertificate; message: string }> => {
    // 1. Idempotency Check: Do not generate duplicate certificates for the same course completion
    const existing = certificates.find(c => c.enrollment_id === enrollmentId && c.status === 'Issued');
    if (existing && !options?.force) {
      return {
        success: true,
        certificate: existing,
        message: `Certificate ${existing.certificate_number} already generated and issued.`
      };
    }

    const enr = enrollments.find(e => e.id === enrollmentId);
    if (!enr) {
      return { success: false, message: 'Enrollment record not found.' };
    }

    const student = students.find(s => s.id === enr.student_id);
    if (!student) {
      return { success: false, message: 'Student record not found.' };
    }

    // 2. Automated verification against verified attendance records
    const verification = verifyCourseCompletion(enr, attendanceRecords);
    if (!verification.isComplete && !options?.force) {
      return {
        success: false,
        message: `Course completion verification failed: ${verification.summaryMessage}`
      };
    }

    // 3. Unique serialized certificate number
    const seq = String(certificates.length + 101).padStart(5, '0');
    const certNumber = `APEX-CRT-2026-${seq}`;
    const qrUrl = `/verify-certificate?certNumber=${certNumber}`;
    const completionDate = verification.completionDate || new Date().toISOString().split('T')[0];
    const instructor = instructors.find(i => i.id === enr.assigned_instructor_id);

    // 4. Safe Generation with Automatic Retry
    let pdfDataUrl = '';
    let attempt = 0;
    let lastError: any = null;

    while (attempt < 3 && !pdfDataUrl) {
      try {
        attempt++;
        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://apexdriving.in';
        const genResult = await generateCertificatePdf(
          {
            studentName: student.full_name,
            studentCode: student.student_code,
            courseName: enr.course_name,
            completionDate,
            certificateNumber: certNumber,
            schoolName: school.name,
            instructorName: instructor?.full_name || 'Vikram Shinde',
            rtoRegNo: school.rto_registration_no,
            qrVerificationUrl: `${origin}${qrUrl}`
          },
          activeTemplate,
          school
        );
        pdfDataUrl = genResult.pdfDataUrl;
      } catch (err) {
        lastError = err;
        console.error(`Certificate generation attempt ${attempt} failed:`, err);
        await new Promise(r => setTimeout(r, 150));
      }
    }

    // Never mark an unsuccessful generation as completed
    if (!pdfDataUrl) {
      addToast(`Certificate generation failed: ${lastError?.message || 'PDF render error'}`, 'error');
      return {
        success: false,
        message: `Failed to generate certificate PDF after retries: ${lastError?.message || 'Unknown error'}`
      };
    }

    // 5. Create final issued certificate record
    const newCert: CourseCertificate = {
      id: `cert-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      school_id: school.id,
      enrollment_id: enr.id,
      student_id: student.id,
      student_code: student.student_code,
      student_name: student.full_name,
      course_id: enr.course_id,
      course_name: enr.course_name,
      instructor_id: instructor?.id,
      instructor_name: instructor?.full_name,
      certificate_number: certNumber,
      completion_date: completionDate,
      issued_at: new Date().toISOString(),
      status: 'Issued',
      pdf_data_url: pdfDataUrl,
      qr_verification_url: qrUrl,
      download_count: 0,
      template_id: activeTemplate.id,
      verified_sessions_count: verification.totalVerifiedSessions,
      total_required_sessions: verification.totalRequiredSessions,
      qr_hash: Math.random().toString(36).substr(2, 10),
      created_at: new Date().toISOString()
    };

    // 6. Save in state
    setCertificates(prev => [newCert, ...prev.filter(c => c.enrollment_id !== enr.id)]);

    // 7. Mark student as Course Completed and Enrollment as Completed
    setStudents(prev => prev.map(s => s.id === student.id ? { ...s, status: 'Course Completed' } : s));
    setEnrollments(prev => prev.map(e => e.id === enr.id ? { ...e, status: 'Completed' } : e));

    // 8. Notification to student that certificate is ready
    const notif: NotificationItem = {
      id: `notif-cert-${Date.now()}`,
      school_id: school.id,
      student_id: student.id,
      title: '🎓 Course Completion Certificate Ready!',
      message: `Congratulations ${student.full_name}! You have fulfilled all practical driving course requirements. Certificate #${certNumber} has been issued and is available for download in your dashboard.`,
      category: 'system',
      is_read: false,
      created_at: new Date().toISOString(),
      link_url: '/student'
    };
    setNotifications(prev => [notif, ...prev]);

    // 9. Immutable Audit Log
    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      school_id: school.id,
      actor_name: 'System (Automatic Completion Engine)',
      action: 'AUTOMATIC_CERTIFICATE_ISSUED',
      entity_type: 'certificates',
      entity_id: newCert.id,
      details: `Auto-verified course completion for ${student.full_name} (${student.student_code}) based on ${verification.totalVerifiedSessions} verified attendance records. Issued certificate ${certNumber}.`,
      created_at: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);

    addToast(`🎓 Certificate #${certNumber} generated for ${student.full_name}!`, 'success');

    return {
      success: true,
      certificate: newCert,
      message: `Certificate #${certNumber} issued successfully.`
    };
  };

  const submitCertificateFeedback = async (data: {
    certificateId: string;
    overallRating: number;
    instructorRating: number;
    trainingQualityRating: number;
    writtenFeedback?: string;
    suggestions?: string;
    googleReviewClicked: boolean;
  }): Promise<{ success: boolean; message: string }> => {
    const cert = certificates.find(c => c.id === data.certificateId);
    if (!cert) return { success: false, message: 'Certificate not found.' };

    const newFeedback: CertificateFeedback = {
      id: `fb-${Date.now()}`,
      certificate_id: cert.id,
      student_id: cert.student_id,
      student_name: cert.student_name,
      overall_rating: data.overallRating,
      instructor_rating: data.instructorRating,
      training_quality_rating: data.trainingQualityRating,
      written_feedback: data.writtenFeedback,
      suggestions: data.suggestions,
      google_review_clicked: data.googleReviewClicked,
      created_at: new Date().toISOString()
    };

    setCertificateFeedbacks(prev => [newFeedback, ...prev]);

    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      school_id: school.id,
      actor_name: `${cert.student_name} (Student)`,
      action: 'SUBMIT_CERTIFICATE_FEEDBACK',
      entity_type: 'certificate_feedback',
      entity_id: newFeedback.id,
      details: `Submitted rating: ${data.overallRating}/5 (Instructor: ${data.instructorRating}/5, Quality: ${data.trainingQualityRating}/5). Google Review: ${data.googleReviewClicked ? 'Clicked' : 'Skipped'}.`,
      created_at: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);

    addToast('Thank you! Your feedback has been received.', 'success');
    return { success: true, message: 'Thank you for your feedback!' };
  };

  const logCertificateDownload = async (certificateId: string): Promise<{ success: boolean }> => {
    const cert = certificates.find(c => c.id === certificateId);
    if (!cert) return { success: false };

    const newLog: CertificateDownloadLog = {
      id: `dl-${Date.now()}`,
      certificate_id: cert.id,
      student_id: cert.student_id,
      student_name: cert.student_name,
      downloaded_at: new Date().toISOString()
    };

    setCertificateDownloads(prev => [newLog, ...prev]);
    setCertificates(prev => prev.map(c => 
      c.id === certificateId 
        ? { ...c, download_count: c.download_count + 1, last_downloaded_at: new Date().toISOString() }
        : c
    ));

    return { success: true };
  };

  const updateCertificateTemplate = async (templateData: Partial<CertificateTemplate>): Promise<{ success: boolean; message: string }> => {
    const updated = {
      ...activeTemplate,
      ...templateData,
      updated_at: new Date().toISOString()
    };
    setActiveTemplate(updated);
    setCertificateTemplates(prev => {
      const exists = prev.some(t => t.id === updated.id);
      return exists ? prev.map(t => t.id === updated.id ? updated : t) : [updated, ...prev];
    });

    const audit: AuditLog = {
      id: `aud-${Date.now()}`,
      school_id: school.id,
      actor_name: `${currentUser.full_name} (${currentUser.role})`,
      action: 'UPDATE_CERTIFICATE_TEMPLATE',
      entity_type: 'certificate_templates',
      entity_id: updated.id,
      details: `Updated certificate template layout, text positions, and formatting rules. Applied for future issuances.`,
      created_at: new Date().toISOString()
    };
    setAuditLogs(prev => [audit, ...prev]);

    addToast('Certificate template configuration saved successfully!', 'success');
    return { success: true, message: 'Template saved.' };
  };

  const updateSchoolSettings = async (settings: { google_review_url?: string; auto_issue_certificates?: boolean }): Promise<{ success: boolean; message: string }> => {
    setSchool(prev => ({
      ...prev,
      ...settings
    }));

    addToast('Organization settings updated successfully.', 'success');
    return { success: true, message: 'Settings updated.' };
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
        removeToast,
        // Student Portal specific extensions
        activeStudentId,
        setActiveStudentId,
        studentDocuments,
        supportTickets,
        uploadStudentDocument,
        updateStudentProfile,
        submitStudentPayment,
        submitSupportTicket,
        loginStudent,
        // Learning Licence & Reminders
        llReminderSettings,
        updateLLReminderSettings,
        triggerLLReminder,
        updateLLApplicationWorkflow,
        // Certificate Management
        certificates,
        certificateTemplates,
        activeTemplate,
        certificateFeedbacks,
        certificateDownloads,
        verifyCourseCompletion: verifyCourseCompletionAction,
        generateCertificate,
        submitCertificateFeedback,
        logCertificateDownload,
        updateCertificateTemplate,
        updateSchoolSettings
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
