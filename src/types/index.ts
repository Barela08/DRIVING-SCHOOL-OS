// =====================================================================
// DRIVING SCHOOL OS — CORE TYPE DEFINITIONS
// =====================================================================

export type UserRole = 'owner' | 'staff' | 'instructor' | 'student';

export interface School {
  id: string;
  name: string;
  slug: string;
  contact_phone: string;
  contact_email: string;
  address: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  logo_url?: string;
  tagline?: string;
  rto_registration_no?: string;
  timezone: string;
  currency: string;
  google_review_url?: string;
  auto_issue_certificates?: boolean;
  created_at: string;
}

export interface Branch {
  id: string;
  school_id: string;
  name: string;
  code: string;
  phone: string;
  is_active: boolean;
}

export interface UserProfile {
  id: string;
  full_name: string;
  phone?: string;
  email?: string;
  avatar_url?: string;
  is_active: boolean;
  role: UserRole;
  school_id: string;
  branch_id?: string;
}

export interface Student {
  id: string;
  school_id: string;
  user_id?: string;
  student_code: string; // e.g. DS-2026-00101
  full_name: string;
  phone: string;
  email?: string;
  avatar_url?: string;
  date_of_birth?: string;
  gender?: string;
  blood_group?: string;
  address?: {
    city?: string;
    area?: string;
    pincode?: string;
  };
  emergency_contact?: {
    name?: string;
    relation?: string;
    phone?: string;
  };
  admission_date: string;
  status: 'Inquiry' | 'Registered' | 'Active' | 'On Hold' | 'Course Completed' | 'Cancelled';
  assigned_instructor_id?: string;
  assigned_instructor_name?: string;
  enrolled_course_id?: string;
  enrolled_course_name?: string;
  has_existing_ll?: boolean;
  ll_number?: string;
  created_at: string;
}

export interface CourseSessionTemplate {
  id: string;
  course_id: string;
  session_name: string;
  session_code: string;
  total_sessions: number;
  sort_order: number;
}

export interface Course {
  id: string;
  school_id: string;
  name: string;
  description: string;
  category: '2W' | '4W' | 'Commercial' | 'Combo';
  duration_days: number;
  price: number;
  is_active: boolean;
  templates?: CourseSessionTemplate[];
}

export interface EnrollmentSessionAllocation {
  id: string;
  enrollment_id: string;
  session_template_id: string;
  session_name_snapshot: string;
  allocated_count: number;
  completed_count: number;
  sort_order: number;
}

export interface Enrollment {
  id: string;
  school_id: string;
  student_id: string;
  student_code: string;
  student_name: string;
  course_id: string;
  course_name: string;
  branch_id?: string;
  assigned_instructor_id?: string;
  assigned_instructor_name?: string;
  assigned_vehicle_id?: string;
  vehicle_registration?: string;
  start_date: string;
  expected_end_date?: string;
  agreed_fee: number;
  status: 'Pending' | 'Active' | 'Completed' | 'Cancelled' | 'On_Hold';
  session_allocations?: EnrollmentSessionAllocation[];
  total_sessions: number;
  completed_sessions: number;
}

export interface AttendanceRecord {
  id: string;
  school_id: string;
  enrollment_id: string;
  student_id: string;
  student_code: string;
  student_name: string;
  instructor_id: string;
  instructor_name: string;
  session_allocation_id: string;
  session_name: string;
  vehicle_id?: string;
  vehicle_info?: string;
  attendance_date: string;
  marked_at: string;
  status: 'Present' | 'Absent' | 'Cancelled_By_Student' | 'Rescheduled';
  remarks?: string;
  created_by?: string;
}

export interface FeeAccount {
  id: string;
  school_id: string;
  enrollment_id: string;
  agreed_fee: number;
  discount_amount: number;
  total_paid: number;
  outstanding_balance: number;
}

export interface Payment {
  id: string;
  school_id: string;
  enrollment_id: string;
  student_id: string;
  student_name: string;
  student_code: string;
  amount: number;
  payment_method: 'UPI' | 'Cash' | 'Bank Transfer' | 'Card' | 'Other';
  transaction_reference?: string;
  status: 'Pending' | 'Confirmed' | 'Rejected' | 'Reversed';
  received_at: string;
  confirmed_by?: string;
  confirmed_at?: string;
  notes?: string;
  receipt_number?: string;
}

export interface PaymentReceipt {
  id: string;
  school_id: string;
  payment_id: string;
  receipt_number: string;
  student_name: string;
  student_code: string;
  course_name: string;
  amount: number;
  payment_method: string;
  issued_at: string;
  school_name: string;
  rto_reg_no?: string;
}

export type LicenceStatus = 
  | 'Not Applied'
  | 'Already Available'
  | 'Reminder Sent'
  | 'Application Started'
  | 'Application Submitted'
  | 'Test Scheduled'
  | 'Approved'
  | 'Rejected'
  | 'Document Uploaded'
  | 'Not Started'
  | 'Documents Pending'
  | 'LL Test Scheduled'
  | 'LL Approved'
  | 'DL Application Submitted'
  | 'DL Test Scheduled'
  | 'Test Passed'
  | 'Test Failed'
  | 'Licence Issued';

export interface LicenceRecord {
  id: string;
  school_id: string;
  student_id: string;
  student_name: string;
  student_code: string;
  licence_type: string; // e.g. 'LMV' | 'MCWG' | 'MCWG + LMV' | 'Commercial'
  has_existing_ll?: boolean;
  ll_application_date?: string;
  ll_reference?: string;
  ll_status: LicenceStatus;
  ll_issue_date?: string;
  ll_valid_till?: string;
  dl_application_date?: string;
  dl_reference?: string;
  rto_name: string;
  test_date?: string;
  test_result?: 'Pending' | 'Passed' | 'Failed';
  licence_number?: string;
  issue_date?: string;
  approval_date?: string;
  application_number?: string;
  ll_document_url?: string;
  ll_document_name?: string;
  ll_document_verified?: boolean;
  reminder_eligible?: boolean;
  reminder_count?: number;
  last_reminder_sent_date?: string;
  last_status_updated_by?: string;
  last_status_updated_at?: string;
  next_action_date?: string;
  remarks?: string;
}

export interface LLReminderSettings {
  enabled: boolean;
  required_attended_days: number;
  min_completed_sessions: number;
  frequency: 'once' | 'every_3_days' | 'every_7_days' | 'every_14_days';
  notify_owner: boolean;
  notify_student: boolean;
  approaching_threshold_days: number;
  updated_at?: string;
  updated_by?: string;
}

export interface StudentLLProgress {
  studentId: string;
  studentCode: string;
  studentName: string;
  mobileNumber: string;
  instructorName: string;
  courseName: string;
  admissionDate: string;
  totalAttendedClassDays: number;
  completedPracticalSessions: number;
  totalAllocatedSessions: number;
  firstAttendedClassDate?: string;
  mostRecentAttendedClassDate?: string;
  courseProgressPercent: number;
  hasExistingLL: boolean;
  llStatus: LicenceStatus;
  llNumber?: string;
  llIssueDate?: string;
  llExpiryDate?: string;
  llVehicleCategory?: string;
  applicationNumber?: string;
  applicationDate?: string;
  testDate?: string;
  approvalDate?: string;
  documentUploaded: boolean;
  documentVerified: boolean;
  documentUrl?: string;
  documentName?: string;
  isEligibleForReminder: boolean;
  isApproachingThreshold: boolean;
  daysToThreshold: number;
  reminderSentDate?: string;
  reminderCount: number;
  canSendReminder: boolean;
  isLLValid: boolean;
  isLLExpired: boolean;
  isLLExpiringSoon: boolean;
  statusBadge: {
    label: string;
    color: string;
    bg: string;
    border: string;
  };
}

export interface Vehicle {
  id: string;
  school_id: string;
  registration_number: string; // e.g. MH-12-AB-1234
  vehicle_type: '2W' | '4W_Manual' | '4W_Automatic' | 'Heavy';
  brand: string;
  model: string;
  fuel_type?: string;
  is_dual_control: boolean;
  assigned_instructor_id?: string;
  assigned_instructor_name?: string;
  insurance_expiry?: string;
  puc_expiry?: string;
  fitness_expiry?: string;
  status: 'Available' | 'Assigned' | 'Under Maintenance' | 'Inactive';
}

export interface Instructor {
  id: string;
  school_id: string;
  user_id: string;
  instructor_code: string; // e.g. INS-2026-01
  full_name: string;
  phone: string;
  email?: string;
  avatar_url?: string;
  licence_number?: string;
  experience_years: number;
  employment_status: 'active' | 'on_leave' | 'terminated';
  assigned_vehicle_id?: string;
  assigned_vehicle_name?: string;
  active_students_count?: number;
  today_sessions_count?: number;
}

export interface ClassSchedule {
  id: string;
  school_id: string;
  enrollment_id: string;
  student_name: string;
  student_code: string;
  instructor_id: string;
  instructor_name: string;
  vehicle_id?: string;
  vehicle_name?: string;
  scheduled_start: string;
  scheduled_end: string;
  topic?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No_Show';
  cancellation_reason?: string;
}

export interface AuditLog {
  id: string;
  school_id: string;
  actor_name: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details: string;
  created_at: string;
}

export interface StaffMember {
  id: string;
  school_id: string;
  user_id: string;
  employee_code: string; // e.g. STF-001
  full_name: string;
  phone: string;
  email: string;
  role_title: string;
  is_active: boolean;
  permissions: {
    can_admit_students: boolean;
    can_manage_fees: boolean;
    can_confirm_payments: boolean;
    can_assign_instructors: boolean;
    can_manage_licences: boolean;
    can_manage_vehicles: boolean;
    can_view_reports: boolean;
  };
  last_login?: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  school_id: string;
  student_id?: string;
  title: string;
  message: string;
  category: 'admission' | 'attendance' | 'payment' | 'schedule' | 'licence' | 'vehicle' | 'system' | 'announcement';
  is_read: boolean;
  created_at: string;
  link_url?: string;
  action_type?: string;
}

export type DocumentType = 
  | 'Aadhaar' 
  | 'Passport_Photo' 
  | 'Form_1A_Medical' 
  | 'Address_Proof' 
  | 'Learner_Licence' 
  | 'Driving_Licence' 
  | 'Payment_Receipt' 
  | 'Course_Certificate';

export interface StudentDocument {
  id: string;
  school_id: string;
  student_id: string;
  document_type: DocumentType;
  document_name: string;
  file_url: string;
  file_size?: string;
  mime_type?: string;
  verification_status: 'Pending' | 'Verified' | 'Rejected';
  uploaded_at: string;
  verified_at?: string;
  notes?: string;
}

export interface SupportTicket {
  id: string;
  school_id: string;
  student_id: string;
  student_name: string;
  student_code: string;
  category: 'scheduling' | 'instructor' | 'fee' | 'licence' | 'general';
  subject: string;
  message: string;
  status: 'Open' | 'In_Progress' | 'Resolved';
  created_at: string;
}

export interface CertificateFieldPosition {
  x: number; // pt or %
  y: number; // pt or %
  fontSize?: number;
  fontFamily?: 'Helvetica' | 'Helvetica-Bold' | 'Times-Roman' | 'Times-Bold' | 'Courier';
  fontWeight?: 'normal' | 'bold';
  color?: string; // hex e.g. '#0f172a'
  alignment?: 'center' | 'left' | 'right';
  maxWidth?: number;
}

export interface CertificateTemplateFieldsConfig {
  student_name: CertificateFieldPosition;
  student_code: CertificateFieldPosition;
  course_name: CertificateFieldPosition;
  completion_date: CertificateFieldPosition;
  certificate_number: CertificateFieldPosition;
  school_name: CertificateFieldPosition;
  instructor_name: CertificateFieldPosition;
  qr_code: { x: number; y: number; size: number };
}

export interface CertificateTemplate {
  id: string;
  school_id: string;
  name: string;
  template_data_url: string; // Base64 or image/pdf URL
  mime_type: string; // 'image/png' | 'image/jpeg' | 'application/pdf'
  width: number;
  height: number;
  is_active: boolean;
  fields_config: CertificateTemplateFieldsConfig;
  created_at: string;
  updated_at: string;
}

export interface CourseCertificate {
  id: string;
  school_id: string;
  enrollment_id: string;
  student_id: string;
  student_code: string;
  student_name: string;
  course_id: string;
  course_name: string;
  instructor_id?: string;
  instructor_name?: string;
  certificate_number: string; // e.g. APEX-CRT-2026-00101
  completion_date: string; // Calculated from actual verified attendance records
  issued_at: string;
  status: 'Issued' | 'Revoked' | 'Draft';
  pdf_data_url?: string;
  storage_path?: string;
  qr_verification_url: string;
  download_count: number;
  last_downloaded_at?: string;
  template_id: string;
  verified_sessions_count: number;
  total_required_sessions: number;
  qr_hash: string;
  created_at: string;
}

export interface CertificateFeedback {
  id: string;
  certificate_id: string;
  student_id: string;
  student_name: string;
  overall_rating: number; // 1-5
  instructor_rating: number; // 1-5
  training_quality_rating: number; // 1-5
  written_feedback?: string;
  suggestions?: string;
  google_review_clicked: boolean;
  created_at: string;
}

export interface CertificateDownloadLog {
  id: string;
  certificate_id: string;
  student_id: string;
  student_name: string;
  downloaded_at: string;
  ip_address?: string;
}

