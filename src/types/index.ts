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
  | 'Not Started'
  | 'Documents Pending'
  | 'Application Submitted'
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
  licence_type: string; // 'MCWG + LMV'
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
  next_action_date?: string;
  remarks?: string;
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
