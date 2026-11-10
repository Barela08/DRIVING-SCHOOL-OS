-- =====================================================================
-- Migration: Learning Licence (LL) Tracking & Automatic Reminders
-- Date: 2026-11-10
-- Description:
--   1. Adds mandatory LL registration question columns to students table.
--   2. Extends licence_records with attendance-based tracking fields,
--      document metadata, and expanded status enum check.
--   3. Creates school_ll_reminder_settings table for configurable reminder policy.
--   4. Configures Row Level Security (RLS) for owner, staff, and student roles.
-- =====================================================================

-- 1. Extend students table
ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS has_existing_ll BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ll_number TEXT;

-- 2. Extend licence_records table
ALTER TABLE public.licence_records
ADD COLUMN IF NOT EXISTS has_existing_ll BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ll_number TEXT,
ADD COLUMN IF NOT EXISTS ll_vehicle_category TEXT,
ADD COLUMN IF NOT EXISTS ll_document_url TEXT,
ADD COLUMN IF NOT EXISTS ll_document_name TEXT,
ADD COLUMN IF NOT EXISTS ll_document_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS application_number TEXT,
ADD COLUMN IF NOT EXISTS approval_date DATE,
ADD COLUMN IF NOT EXISTS attended_class_days_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS reminder_eligible BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS reminder_count INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_reminder_sent_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS last_status_updated_by TEXT,
ADD COLUMN IF NOT EXISTS last_status_updated_at TIMESTAMPTZ;

-- Drop previous check constraint if present and update with comprehensive LL statuses
ALTER TABLE public.licence_records DROP CONSTRAINT IF EXISTS licence_records_ll_status_check;
ALTER TABLE public.licence_records ADD CONSTRAINT licence_records_ll_status_check 
CHECK (ll_status IN (
    'Not Started', 
    'Documents Pending', 
    'Application Submitted', 
    'LL Test Scheduled', 
    'LL Approved', 
    'Rejected', 
    'Not Applied', 
    'Already Available', 
    'Reminder Sent', 
    'Application Started', 
    'Test Scheduled', 
    'Approved', 
    'Document Uploaded', 
    'DL Test Scheduled', 
    'Test Passed', 
    'Licence Issued'
));

-- 3. Create school_ll_reminder_settings table
CREATE TABLE IF NOT EXISTS public.school_ll_reminder_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE UNIQUE,
    enabled BOOLEAN NOT NULL DEFAULT true,
    required_attended_days INT NOT NULL DEFAULT 10 CHECK (required_attended_days >= 1),
    min_completed_sessions INT NOT NULL DEFAULT 5 CHECK (min_completed_sessions >= 0),
    frequency TEXT NOT NULL DEFAULT 'every_7_days' CHECK (frequency IN ('once', 'every_3_days', 'every_7_days', 'every_14_days')),
    notify_owner BOOLEAN NOT NULL DEFAULT true,
    notify_student BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.school_ll_reminder_settings ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
DROP POLICY IF EXISTS ll_settings_owner_staff ON public.school_ll_reminder_settings;
CREATE POLICY ll_settings_owner_staff ON public.school_ll_reminder_settings FOR ALL TO authenticated
USING (public.current_user_school_role(school_id) IN ('owner', 'staff'));

DROP POLICY IF EXISTS ll_settings_student_read ON public.school_ll_reminder_settings;
CREATE POLICY ll_settings_student_read ON public.school_ll_reminder_settings FOR SELECT TO authenticated
USING (
    school_id IN (SELECT school_id FROM public.students WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS licence_student_update ON public.licence_records;
CREATE POLICY licence_student_update ON public.licence_records FOR UPDATE TO authenticated
USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
)
WITH CHECK (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);
