-- =====================================================================
-- MIGRATION: 20261111_instructor_attendance_system.sql
-- MODEL DRIVING ACADEMY: INSTRUCTOR DASHBOARD & ATTENDANCE MANAGEMENT
-- =====================================================================

-- 1. Time Slots Table (Owner-configured shifts & capacities)
CREATE TABLE IF NOT EXISTS public.time_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    slot_label TEXT NOT NULL, -- e.g. "07:00 AM – 08:00 AM"
    start_time TEXT NOT NULL,  -- e.g. "07:00"
    end_time TEXT NOT NULL,    -- e.g. "08:00"
    period TEXT NOT NULL CHECK (period IN ('Morning', 'Afternoon', 'Evening')),
    max_capacity INTEGER NOT NULL DEFAULT 4,
    is_active BOOLEAN NOT NULL DEFAULT true,
    default_instructor_id UUID REFERENCES public.instructors(id) ON DELETE SET NULL,
    default_vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_time_slots_school_active 
ON public.time_slots(school_id, is_active);

-- 2. Student Skill Assessments Table (Part 12)
CREATE TABLE IF NOT EXISTS public.student_skill_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    instructor_id UUID NOT NULL REFERENCES public.instructors(id) ON DELETE CASCADE,
    steering_control SMALLINT NOT NULL DEFAULT 3 CHECK (steering_control BETWEEN 1 AND 5),
    clutch_control SMALLINT NOT NULL DEFAULT 3 CHECK (clutch_control BETWEEN 1 AND 5),
    gear_changing SMALLINT NOT NULL DEFAULT 3 CHECK (gear_changing BETWEEN 1 AND 5),
    reverse_parking SMALLINT NOT NULL DEFAULT 3 CHECK (reverse_parking BETWEEN 1 AND 5),
    highway_driving SMALLINT NOT NULL DEFAULT 3 CHECK (highway_driving BETWEEN 1 AND 5),
    traffic_handling SMALLINT NOT NULL DEFAULT 3 CHECK (traffic_handling BETWEEN 1 AND 5),
    road_confidence SMALLINT NOT NULL DEFAULT 3 CHECK (road_confidence BETWEEN 1 AND 5),
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(student_id, instructor_id)
);

CREATE INDEX IF NOT EXISTS idx_skill_assessments_student 
ON public.student_skill_assessments(student_id);

-- 3. Attendance Corrections Table (Audited Corrections - Part 17)
CREATE TABLE IF NOT EXISTS public.attendance_corrections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    attendance_record_id UUID NOT NULL REFERENCES public.attendance_records(id) ON DELETE CASCADE,
    corrected_by_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    previous_status TEXT NOT NULL,
    new_status TEXT NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Unique Index on attendance_records to Prevent Duplicate Attendance (Part 8)
-- Prevents two simultaneous attendance records for the same student, allocation, and date
CREATE UNIQUE INDEX IF NOT EXISTS uq_attendance_student_allocation_date
ON public.attendance_records(enrollment_id, session_allocation_id, attendance_date)
WHERE status = 'Present';

-- ---------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ---------------------------------------------------------------------

ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_skill_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_corrections ENABLE ROW LEVEL SECURITY;

-- Time slots: All authenticated users can view; owner/staff can edit
CREATE POLICY time_slots_view ON public.time_slots FOR SELECT TO authenticated
USING (is_active = true OR public.current_user_school_role(school_id) IN ('owner', 'staff'));

CREATE POLICY time_slots_manage ON public.time_slots FOR ALL TO authenticated
USING (public.current_user_school_role(school_id) IN ('owner', 'staff'));

-- Skill Assessments: Instructor can insert/update their own; student can view their own
CREATE POLICY skill_assessments_instructor ON public.student_skill_assessments FOR ALL TO authenticated
USING (
    instructor_id IN (SELECT id FROM public.instructors WHERE user_id = auth.uid())
    OR public.current_user_school_role(school_id) IN ('owner', 'staff')
);

CREATE POLICY skill_assessments_student_read ON public.student_skill_assessments FOR SELECT TO authenticated
USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);

-- Attendance Records: Instructors can only insert and view records for their assigned students
CREATE POLICY attendance_instructor_insert ON public.attendance_records FOR INSERT TO authenticated
WITH CHECK (
    instructor_id IN (SELECT id FROM public.instructors WHERE user_id = auth.uid())
    AND enrollment_id IN (
        SELECT e.id FROM public.enrollments e 
        JOIN public.instructors ins ON ins.id = e.assigned_instructor_id 
        WHERE ins.user_id = auth.uid()
    )
);

CREATE POLICY attendance_instructor_select ON public.attendance_records FOR SELECT TO authenticated
USING (
    instructor_id IN (SELECT id FROM public.instructors WHERE user_id = auth.uid())
    OR public.current_user_school_role(school_id) IN ('owner', 'staff')
);

-- Attendance Corrections: Only owner and staff can create corrections
CREATE POLICY attendance_corrections_owner_staff ON public.attendance_corrections FOR ALL TO authenticated
USING (public.current_user_school_role(school_id) IN ('owner', 'staff'));
