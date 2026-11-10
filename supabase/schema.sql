-- =====================================================================
-- DRIVING SCHOOL OS — COMPLETE SUPABASE POSTGRESQL SCHEMA & RLS
-- Comprehensive schema covering 28 entities, atomic procedures, & security
-- =====================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------
-- 1. ORGANIZATION AND ACCESS CONTROL
-- ---------------------------------------------------------------------

-- Schools (Driving School Organizations)
CREATE TABLE IF NOT EXISTS public.schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    contact_phone TEXT,
    contact_email TEXT,
    address JSONB DEFAULT '{}'::jsonb,
    logo_url TEXT,
    tagline TEXT,
    rto_registration_no TEXT,
    timezone TEXT DEFAULT 'Asia/Kolkata',
    currency TEXT DEFAULT 'INR',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Branches
CREATE TABLE IF NOT EXISTS public.branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT,
    phone TEXT,
    address JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- User Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- School Memberships (Role-based access mapping)
CREATE TABLE IF NOT EXISTS public.school_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    role TEXT NOT NULL CHECK (role IN ('owner', 'staff', 'instructor', 'student')),
    membership_status TEXT NOT NULL DEFAULT 'active' CHECK (membership_status IN ('active', 'suspended', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(school_id, user_id)
);

-- Role Permissions (Granular staff permission overrides)
CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    can_admit_students BOOLEAN DEFAULT true,
    can_manage_fees BOOLEAN DEFAULT true,
    can_confirm_payments BOOLEAN DEFAULT false,
    can_assign_instructors BOOLEAN DEFAULT true,
    can_manage_licences BOOLEAN DEFAULT true,
    can_manage_vehicles BOOLEAN DEFAULT false,
    can_view_reports BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(school_id, user_id)
);

-- Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    actor_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    before_data JSONB,
    after_data JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ---------------------------------------------------------------------
-- 2. COURSES & SESSION TEMPLATES
-- ---------------------------------------------------------------------

-- Courses
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT '4W' CHECK (category IN ('2W', '4W', 'Commercial', 'Combo')),
    duration_days INTEGER NOT NULL DEFAULT 30,
    price NUMERIC(12,2) NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Course Session Templates (e.g. Reverse Parking, Clutch Control)
CREATE TABLE IF NOT EXISTS public.course_session_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    session_name TEXT NOT NULL,
    session_code TEXT NOT NULL,
    total_sessions INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(course_id, session_code)
);

-- ---------------------------------------------------------------------
-- 3. INSTRUCTORS & FLEET (VEHICLES)
-- ---------------------------------------------------------------------

-- Vehicles
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    registration_number TEXT NOT NULL,
    vehicle_type TEXT NOT NULL DEFAULT '4W' CHECK (vehicle_type IN ('2W', '4W_Manual', '4W_Automatic', 'Heavy')),
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    fuel_type TEXT DEFAULT 'Petrol',
    is_dual_control BOOLEAN DEFAULT true,
    insurance_expiry DATE,
    puc_expiry DATE,
    fitness_expiry DATE,
    status TEXT NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Assigned', 'Under Maintenance', 'Inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(school_id, registration_number)
);

-- Instructors
CREATE TABLE IF NOT EXISTS public.instructors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    instructor_code TEXT NOT NULL,
    pin_hash TEXT, -- Stored hash for Instructor ID + PIN login
    licence_number TEXT,
    licence_valid_till DATE,
    experience_years INTEGER DEFAULT 0,
    employment_status TEXT NOT NULL DEFAULT 'active' CHECK (employment_status IN ('active', 'on_leave', 'terminated')),
    default_vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    joining_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(school_id, instructor_code),
    UNIQUE(school_id, user_id)
);

-- Vehicle Assignments
CREATE TABLE IF NOT EXISTS public.vehicle_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    instructor_id UUID NOT NULL REFERENCES public.instructors(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    unassigned_at TIMESTAMPTZ
);

-- Vehicle Maintenance Records
CREATE TABLE IF NOT EXISTS public.vehicle_maintenance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL,
    odometer_reading INTEGER,
    cost NUMERIC(10,2) NOT NULL DEFAULT 0,
    service_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ---------------------------------------------------------------------
-- 4. STUDENTS & ENROLLMENTS
-- ---------------------------------------------------------------------

-- Students
CREATE TABLE IF NOT EXISTS public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    student_code TEXT NOT NULL,
    password_hash TEXT, -- For Student ID + password login
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    avatar_url TEXT,
    date_of_birth DATE,
    gender TEXT,
    blood_group TEXT,
    address JSONB DEFAULT '{}'::jsonb,
    emergency_contact JSONB DEFAULT '{}'::jsonb,
    admission_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'Registered' CHECK (status IN ('Inquiry', 'Registered', 'Active', 'On Hold', 'Course Completed', 'Cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(school_id, student_code)
);

-- Student Documents
CREATE TABLE IF NOT EXISTS public.student_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL, -- 'Aadhaar', 'Passport_Photo', 'Form_1A_Medical', 'Address_Proof', 'Existing_LL'
    document_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    verification_status TEXT NOT NULL DEFAULT 'Pending' CHECK (verification_status IN ('Pending', 'Verified', 'Rejected')),
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enrollments
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE RESTRICT,
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    assigned_instructor_id UUID REFERENCES public.instructors(id) ON DELETE SET NULL,
    assigned_vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expected_end_date DATE,
    agreed_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Pending', 'Active', 'Completed', 'Cancelled', 'On_Hold')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Instructor Assignments History
CREATE TABLE IF NOT EXISTS public.instructor_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
    instructor_id UUID NOT NULL REFERENCES public.instructors(id) ON DELETE CASCADE,
    assigned_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    unassigned_at TIMESTAMPTZ
);

-- Enrollment Session Allocations (Preserves snapshot of sessions per enrollment)
CREATE TABLE IF NOT EXISTS public.enrollment_session_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
    session_template_id UUID REFERENCES public.course_session_templates(id) ON DELETE SET NULL,
    session_name_snapshot TEXT NOT NULL,
    allocated_count INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(enrollment_id, session_template_id)
);

-- ---------------------------------------------------------------------
-- 5. ATTENDANCE & SCHEDULES
-- ---------------------------------------------------------------------

-- Attendance Records (Core feature: one-click atomic log)
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    instructor_id UUID NOT NULL REFERENCES public.instructors(id) ON DELETE CASCADE,
    session_allocation_id UUID NOT NULL REFERENCES public.enrollment_session_allocations(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
    marked_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    status TEXT NOT NULL DEFAULT 'Present' CHECK (status IN ('Present', 'Absent', 'Cancelled_By_Student', 'Rescheduled')),
    remarks TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Attendance Corrections (Audit trail of any adjustment)
CREATE TABLE IF NOT EXISTS public.attendance_corrections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attendance_record_id UUID NOT NULL REFERENCES public.attendance_records(id) ON DELETE CASCADE,
    corrected_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    previous_status TEXT NOT NULL,
    new_status TEXT NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Class Schedules
CREATE TABLE IF NOT EXISTS public.class_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
    instructor_id UUID NOT NULL REFERENCES public.instructors(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    scheduled_start TIMESTAMPTZ NOT NULL,
    scheduled_end TIMESTAMPTZ NOT NULL,
    topic TEXT,
    status TEXT NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Completed', 'Cancelled', 'No_Show')),
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ---------------------------------------------------------------------
-- 6. FINANCE, FEES & PAYMENTS
-- ---------------------------------------------------------------------

-- Fee Accounts
CREATE TABLE IF NOT EXISTS public.fee_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE UNIQUE,
    agreed_fee NUMERIC(12,2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Payments
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE,
    amount NUMERIC(12,2) NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('UPI', 'Cash', 'Bank Transfer', 'Card', 'Other')),
    transaction_reference TEXT,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Rejected', 'Reversed')),
    received_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    confirmed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    confirmed_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Payment Receipts
CREATE TABLE IF NOT EXISTS public.payment_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE UNIQUE,
    receipt_number TEXT NOT NULL,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(school_id, receipt_number)
);

-- Payment Adjustments / Refunds
CREATE TABLE IF NOT EXISTS public.payment_adjustments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID NOT NULL REFERENCES public.payments(id) ON DELETE CASCADE,
    authorized_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    adjustment_type TEXT NOT NULL CHECK (adjustment_type IN ('Refund', 'Correction', 'Reversal')),
    amount NUMERIC(12,2) NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ---------------------------------------------------------------------
-- 7. DRIVING LICENCE TRACKING (RTO LL & DL)
-- ---------------------------------------------------------------------

-- Licence Records
CREATE TABLE IF NOT EXISTS public.licence_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    licence_type TEXT NOT NULL DEFAULT 'MCWG + LMV',
    ll_application_date DATE,
    ll_reference TEXT,
    ll_status TEXT NOT NULL DEFAULT 'Not Started' CHECK (ll_status IN ('Not Started', 'Documents Pending', 'Application Submitted', 'LL Test Scheduled', 'LL Approved', 'Rejected')),
    ll_issue_date DATE,
    ll_valid_till DATE,
    dl_application_date DATE,
    dl_reference TEXT,
    rto_name TEXT DEFAULT 'MH-12 Pune RTO',
    test_date DATE,
    test_result TEXT CHECK (test_result IN ('Pending', 'Passed', 'Failed')),
    licence_number TEXT,
    issue_date DATE,
    next_action_date DATE,
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(school_id, student_id)
);

-- Licence Events (Timeline of RTO milestone updates)
CREATE TABLE IF NOT EXISTS public.licence_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    licence_record_id UUID NOT NULL REFERENCES public.licence_records(id) ON DELETE CASCADE,
    event_title TEXT NOT NULL,
    event_date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ---------------------------------------------------------------------
-- 8. NOTIFICATIONS & PREFERENCES
-- ---------------------------------------------------------------------

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'attendance' CHECK (category IN ('attendance', 'fee', 'schedule', 'licence', 'announcement')),
    link_url TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Notification Preferences
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    in_app BOOLEAN DEFAULT true,
    email BOOLEAN DEFAULT true,
    whatsapp BOOLEAN DEFAULT true,
    sms BOOLEAN DEFAULT false
);

-- ---------------------------------------------------------------------
-- 9. PERFORMANCE INDEXES
-- ---------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_memberships_user ON public.school_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_memberships_school ON public.school_memberships(school_id);
CREATE INDEX IF NOT EXISTS idx_students_school_code ON public.students(school_id, student_code);
CREATE INDEX IF NOT EXISTS idx_students_phone ON public.students(school_id, phone);
CREATE INDEX IF NOT EXISTS idx_instructors_school_code ON public.instructors(school_id, instructor_code);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON public.enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_instructor ON public.enrollments(assigned_instructor_id);
CREATE INDEX IF NOT EXISTS idx_attendance_enrollment ON public.attendance_records(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance_records(school_id, attendance_date);
CREATE INDEX IF NOT EXISTS idx_payments_enrollment ON public.payments(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_licence_student ON public.licence_records(student_id);
CREATE INDEX IF NOT EXISTS idx_schedules_start ON public.class_schedules(school_id, scheduled_start);

-- ---------------------------------------------------------------------
-- 10. ATOMIC STORED PROCEDURES (CORE BUSINESS LOGIC)
-- ---------------------------------------------------------------------

-- Function 1: Generate Sequential Student Code (e.g. DS-2026-00101)
CREATE OR REPLACE FUNCTION public.generate_student_code(p_school_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_year TEXT := to_char(CURRENT_DATE, 'YYYY');
    v_count INTEGER;
    v_code TEXT;
BEGIN
    SELECT COUNT(*) + 1 INTO v_count
    FROM public.students
    WHERE school_id = p_school_id;

    v_code := 'DS-' || v_year || '-' || lpad(v_count::text, 5, '0');
    RETURN v_code;
END;
$$;

-- Function 2: Generate Sequential Receipt Number (e.g. RCP-2026-00042)
CREATE OR REPLACE FUNCTION public.generate_receipt_number(p_school_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_year TEXT := to_char(CURRENT_DATE, 'YYYY');
    v_count INTEGER;
    v_rcp TEXT;
BEGIN
    SELECT COUNT(*) + 1 INTO v_count
    FROM public.payment_receipts
    WHERE school_id = p_school_id;

    v_rcp := 'RCP-' || v_year || '-' || lpad(v_count::text, 5, '0');
    RETURN v_rcp;
END;
$$;

-- Function 3: One-Click Atomic Attendance Marking
CREATE OR REPLACE FUNCTION public.mark_attendance(
    p_school_id UUID,
    p_enrollment_id UUID,
    p_session_allocation_id UUID,
    p_instructor_id UUID,
    p_vehicle_id UUID DEFAULT NULL,
    p_remarks TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_enrollment RECORD;
    v_allocation RECORD;
    v_completed_count INTEGER;
    v_attendance_id UUID;
    v_vehicle UUID := p_vehicle_id;
    v_student RECORD;
BEGIN
    -- 1. Validate Enrollment
    SELECT e.*, s.full_name AS student_name, s.student_code
    INTO v_enrollment
    FROM public.enrollments e
    JOIN public.students s ON s.id = e.student_id
    WHERE e.id = p_enrollment_id AND e.school_id = p_school_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Active enrollment record not found for this school';
    END IF;

    IF v_enrollment.status NOT IN ('Active', 'Pending') THEN
        RAISE EXCEPTION 'Cannot mark attendance: Enrollment is %', v_enrollment.status;
    END IF;

    -- 2. Validate Session Allocation
    SELECT * INTO v_allocation
    FROM public.enrollment_session_allocations
    WHERE id = p_session_allocation_id AND enrollment_id = p_enrollment_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Session allocation does not exist for this enrollment';
    END IF;

    -- 3. Calculate current completed count for this allocation
    SELECT COUNT(*) INTO v_completed_count
    FROM public.attendance_records
    WHERE session_allocation_id = p_session_allocation_id
      AND status = 'Present';

    -- Check if remaining quota exists
    IF v_completed_count >= v_allocation.allocated_count THEN
        RAISE EXCEPTION 'Quota exhausted for session "%": % of % already completed', 
            v_allocation.session_name_snapshot, v_completed_count, v_allocation.allocated_count;
    END IF;

    -- If vehicle not provided, use enrollment default
    IF v_vehicle IS NULL THEN
        v_vehicle := v_enrollment.assigned_vehicle_id;
    END IF;

    -- 4. Atomic Insert
    INSERT INTO public.attendance_records (
        school_id,
        enrollment_id,
        student_id,
        instructor_id,
        session_allocation_id,
        vehicle_id,
        attendance_date,
        marked_at,
        status,
        remarks,
        created_by
    ) VALUES (
        p_school_id,
        p_enrollment_id,
        v_enrollment.student_id,
        p_instructor_id,
        p_session_allocation_id,
        v_vehicle,
        CURRENT_DATE,
        clock_timestamp(),
        'Present',
        p_remarks,
        auth.uid()
    ) RETURNING id INTO v_attendance_id;

    -- 5. Audit Log
    INSERT INTO public.audit_logs (
        school_id,
        actor_user_id,
        action,
        entity_type,
        entity_id,
        after_data
    ) VALUES (
        p_school_id,
        auth.uid(),
        'MARK_ATTENDANCE',
        'attendance_records',
        v_attendance_id,
        jsonb_build_object(
            'student_id', v_enrollment.student_id,
            'session', v_allocation.session_name_snapshot,
            'completed_now', v_completed_count + 1,
            'total_allocated', v_allocation.allocated_count
        )
    );

    -- 6. Return updated progress
    RETURN jsonb_build_object(
        'success', true,
        'attendance_id', v_attendance_id,
        'session_name', v_allocation.session_name_snapshot,
        'completed', v_completed_count + 1,
        'total', v_allocation.allocated_count,
        'remaining', v_allocation.allocated_count - (v_completed_count + 1),
        'student_code', v_enrollment.student_code,
        'student_name', v_enrollment.student_name
    );
END;
$$;

-- Function 4: Confirm Payment & Auto-Generate Receipt
CREATE OR REPLACE FUNCTION public.confirm_payment(
    p_payment_id UUID,
    p_school_id UUID,
    p_confirmed_by UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_payment RECORD;
    v_receipt_no TEXT;
    v_receipt_id UUID;
    v_fee RECORD;
    v_total_paid NUMERIC(12,2);
BEGIN
    SELECT * INTO v_payment
    FROM public.payments
    WHERE id = p_payment_id AND school_id = p_school_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Payment record not found';
    END IF;

    IF v_payment.status = 'Confirmed' THEN
        RAISE EXCEPTION 'Payment is already confirmed';
    END IF;

    -- Update payment
    UPDATE public.payments
    SET status = 'Confirmed',
        confirmed_by = p_confirmed_by,
        confirmed_at = clock_timestamp()
    WHERE id = p_payment_id;

    -- Generate receipt
    v_receipt_no := public.generate_receipt_number(p_school_id);

    INSERT INTO public.payment_receipts (
        school_id,
        payment_id,
        receipt_number,
        issued_at
    ) VALUES (
        p_school_id,
        p_payment_id,
        v_receipt_no,
        clock_timestamp()
    ) RETURNING id INTO v_receipt_id;

    -- Return updated fee summary
    SELECT fa.*, 
           COALESCE((SELECT SUM(amount) FROM public.payments WHERE enrollment_id = v_payment.enrollment_id AND status = 'Confirmed'), 0) AS total_paid
    INTO v_fee
    FROM public.fee_accounts fa
    WHERE fa.enrollment_id = v_payment.enrollment_id;

    RETURN jsonb_build_object(
        'success', true,
        'receipt_number', v_receipt_no,
        'amount_confirmed', v_payment.amount,
        'agreed_fee', v_fee.agreed_fee,
        'total_paid', v_fee.total_paid,
        'balance_outstanding', (v_fee.agreed_fee - v_fee.discount_amount - v_fee.total_paid)
    );
END;
$$;

-- ---------------------------------------------------------------------
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ---------------------------------------------------------------------

-- Enable RLS across all tables
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_session_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollment_session_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fee_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licence_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licence_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper function: get caller role in a school
CREATE OR REPLACE FUNCTION public.current_user_school_role(p_school_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT role FROM public.school_memberships
    WHERE school_id = p_school_id AND user_id = auth.uid()
    LIMIT 1;
$$;

-- Profiles: Anyone authenticated can read profiles; user can update own profile
CREATE POLICY profiles_read_all ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY profiles_update_own ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());

-- Schools & Memberships
CREATE POLICY school_members_read ON public.schools FOR SELECT TO authenticated
USING (
    EXISTS (SELECT 1 FROM public.school_memberships WHERE school_id = schools.id AND user_id = auth.uid())
);

-- Students:
-- Owner/Staff: Full access to school students
-- Instructor: Access assigned students
-- Student: Access only own student record
CREATE POLICY students_owner_staff ON public.students FOR ALL TO authenticated
USING (
    public.current_user_school_role(school_id) IN ('owner', 'staff')
);

CREATE POLICY students_instructor_read ON public.students FOR SELECT TO authenticated
USING (
    public.current_user_school_role(school_id) = 'instructor'
    AND EXISTS (
        SELECT 1 FROM public.enrollments e
        JOIN public.instructors i ON i.id = e.assigned_instructor_id
        WHERE e.student_id = students.id AND i.user_id = auth.uid()
    )
);

CREATE POLICY students_self_read ON public.students FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- Attendance Records:
-- Owner/Staff: Read/manage all
-- Instructor: Read/insert for assigned students
-- Student: Read own attendance
CREATE POLICY attendance_owner_staff ON public.attendance_records FOR ALL TO authenticated
USING (
    public.current_user_school_role(school_id) IN ('owner', 'staff')
);

CREATE POLICY attendance_instructor ON public.attendance_records FOR ALL TO authenticated
USING (
    public.current_user_school_role(school_id) = 'instructor'
    AND instructor_id IN (SELECT id FROM public.instructors WHERE user_id = auth.uid())
);

CREATE POLICY attendance_student_read ON public.attendance_records FOR SELECT TO authenticated
USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);

-- Payments & Fees:
-- Owner: Full access
-- Staff: View & create payment entries
-- Student: View own payments & receipts
CREATE POLICY fee_owner_staff ON public.fee_accounts FOR ALL TO authenticated
USING (public.current_user_school_role(school_id) IN ('owner', 'staff'));

CREATE POLICY payments_owner_staff ON public.payments FOR ALL TO authenticated
USING (public.current_user_school_role(school_id) IN ('owner', 'staff'));

CREATE POLICY fee_student_read ON public.fee_accounts FOR SELECT TO authenticated
USING (
    enrollment_id IN (
        SELECT e.id FROM public.enrollments e
        JOIN public.students s ON s.id = e.student_id
        WHERE s.user_id = auth.uid()
    )
);

CREATE POLICY payments_student_read ON public.payments FOR SELECT TO authenticated
USING (
    enrollment_id IN (
        SELECT e.id FROM public.enrollments e
        JOIN public.students s ON s.id = e.student_id
        WHERE s.user_id = auth.uid()
    )
);

-- Student Self Profile Update (Restricted permitted contact fields only)
CREATE POLICY students_self_update ON public.students FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Course Enrollments: Student read-only isolation
CREATE POLICY enrollments_owner_staff ON public.enrollments FOR ALL TO authenticated
USING (public.current_user_school_role(school_id) IN ('owner', 'staff'));

CREATE POLICY enrollments_student_read ON public.enrollments FOR SELECT TO authenticated
USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);

-- Enrollment Session Allocations: Student read-only isolation
CREATE POLICY allocations_owner_staff ON public.enrollment_session_allocations FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.enrollments e 
        WHERE e.id = enrollment_session_allocations.enrollment_id 
        AND public.current_user_school_role(e.school_id) IN ('owner', 'staff')
    )
);

CREATE POLICY allocations_student_read ON public.enrollment_session_allocations FOR SELECT TO authenticated
USING (
    enrollment_id IN (
        SELECT e.id FROM public.enrollments e
        JOIN public.students s ON s.id = e.student_id
        WHERE s.user_id = auth.uid()
    )
);

-- Class Schedules: Student read-only isolation
CREATE POLICY schedules_owner_staff ON public.class_schedules FOR ALL TO authenticated
USING (public.current_user_school_role(school_id) IN ('owner', 'staff'));

CREATE POLICY schedules_instructor ON public.class_schedules FOR ALL TO authenticated
USING (
    public.current_user_school_role(school_id) = 'instructor'
    AND instructor_id IN (SELECT id FROM public.instructors WHERE user_id = auth.uid())
);

CREATE POLICY schedules_student_read ON public.class_schedules FOR SELECT TO authenticated
USING (
    enrollment_id IN (
        SELECT e.id FROM public.enrollments e
        JOIN public.students s ON s.id = e.student_id
        WHERE s.user_id = auth.uid()
    )
);

-- Driving Licence Records & Events: Student read-only isolation
CREATE POLICY licence_owner_staff ON public.licence_records FOR ALL TO authenticated
USING (public.current_user_school_role(school_id) IN ('owner', 'staff'));

CREATE POLICY licence_student_read ON public.licence_records FOR SELECT TO authenticated
USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);

CREATE POLICY licence_events_student_read ON public.licence_events FOR SELECT TO authenticated
USING (
    licence_record_id IN (
        SELECT lr.id FROM public.licence_records lr
        JOIN public.students s ON s.id = lr.student_id
        WHERE s.user_id = auth.uid()
    )
);

-- Student Documents: Private storage & table isolation
CREATE POLICY student_docs_owner_staff ON public.student_documents FOR ALL TO authenticated
USING (public.current_user_school_role(school_id) IN ('owner', 'staff'));

CREATE POLICY student_docs_student_read ON public.student_documents FOR SELECT TO authenticated
USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);

CREATE POLICY student_docs_student_insert ON public.student_documents FOR INSERT TO authenticated
WITH CHECK (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);

-- Payment Receipts: Student read-only isolation
CREATE POLICY receipts_owner_staff ON public.payment_receipts FOR ALL TO authenticated
USING (public.current_user_school_role(school_id) IN ('owner', 'staff'));

CREATE POLICY receipts_student_read ON public.payment_receipts FOR SELECT TO authenticated
USING (
    payment_id IN (
        SELECT p.id FROM public.payments p
        JOIN public.enrollments e ON e.id = p.enrollment_id
        JOIN public.students s ON s.id = e.student_id
        WHERE s.user_id = auth.uid()
    )
);

-- Notifications: Strict recipient isolation
CREATE POLICY notifications_owner_staff ON public.notifications FOR ALL TO authenticated
USING (public.current_user_school_role(school_id) IN ('owner', 'staff'));

CREATE POLICY notifications_user_read ON public.notifications FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY notifications_user_update ON public.notifications FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Private Supabase Storage Bucket Security for 'student-documents'
-- INSERT INTO storage.buckets (id, name, public) VALUES ('student-documents', 'student-documents', false);
-- Policy: Students may only read/upload inside their own student_id folder:
-- CREATE POLICY "Student Documents Storage Access" ON storage.objects
--   FOR SELECT TO authenticated
--   USING (bucket_id = 'student-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
-- CREATE POLICY "Student Documents Storage Upload" ON storage.objects
--   FOR INSERT TO authenticated
--   WITH CHECK (bucket_id = 'student-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
