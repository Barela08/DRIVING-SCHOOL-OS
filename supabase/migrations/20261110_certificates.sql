-- =====================================================================
-- MIGRATION: 20261110_certificates.sql
-- AUTOMATIC COURSE COMPLETION CERTIFICATE SYSTEM & GOOGLE REVIEWS
-- =====================================================================

-- 1. Extend schools table with Google Review URL & Auto-issue switch
ALTER TABLE public.schools 
ADD COLUMN IF NOT EXISTS google_review_url TEXT,
ADD COLUMN IF NOT EXISTS auto_issue_certificates BOOLEAN NOT NULL DEFAULT true;

-- 2. Certificate Templates Table
CREATE TABLE IF NOT EXISTS public.certificate_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    template_data_url TEXT NOT NULL,
    mime_type TEXT NOT NULL DEFAULT 'image/png',
    width NUMERIC NOT NULL DEFAULT 841.89,
    height NUMERIC NOT NULL DEFAULT 595.28,
    is_active BOOLEAN NOT NULL DEFAULT true,
    fields_config JSONB NOT NULL DEFAULT '{
        "student_name": {"x": 420.95, "y": 320, "fontSize": 28, "fontWeight": "bold", "color": "#0F172A", "align": "center"},
        "student_id": {"x": 420.95, "y": 285, "fontSize": 13, "fontWeight": "normal", "color": "#475569", "align": "center"},
        "course_name": {"x": 420.95, "y": 230, "fontSize": 20, "fontWeight": "bold", "color": "#1E3A8A", "align": "center"},
        "completion_date": {"x": 230, "y": 140, "fontSize": 12, "fontWeight": "normal", "color": "#334155", "align": "center"},
        "certificate_number": {"x": 420.95, "y": 80, "fontSize": 11, "fontWeight": "normal", "color": "#64748B", "align": "center"},
        "school_name": {"x": 420.95, "y": 485, "fontSize": 24, "fontWeight": "bold", "color": "#0F172A", "align": "center"},
        "instructor_name": {"x": 610, "y": 140, "fontSize": 12, "fontWeight": "normal", "color": "#334155", "align": "center"},
        "qr_code": {"x": 735, "y": 85, "size": 65}
    }'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_cert_templates_school_active 
ON public.certificate_templates(school_id, is_active);

-- 3. Issued Course Completion Certificates Table
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    enrollment_id UUID NOT NULL REFERENCES public.enrollments(id) ON DELETE CASCADE UNIQUE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    student_code TEXT NOT NULL,
    student_name TEXT NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE SET NULL,
    course_name TEXT NOT NULL,
    instructor_name TEXT,
    certificate_number TEXT NOT NULL UNIQUE,
    completion_date DATE NOT NULL,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    status TEXT NOT NULL DEFAULT 'Issued' CHECK (status IN ('Pending', 'Issued', 'Revoked')),
    pdf_url TEXT,
    qr_verification_url TEXT NOT NULL,
    download_count INTEGER NOT NULL DEFAULT 0,
    template_id UUID REFERENCES public.certificate_templates(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_certificates_student_id ON public.certificates(student_id);
CREATE INDEX IF NOT EXISTS idx_certificates_school_id ON public.certificates(school_id);
CREATE INDEX IF NOT EXISTS idx_certificates_cert_number ON public.certificates(certificate_number);

-- 4. Certificate Feedback Table (1-5 Star Ratings & Suggestions)
CREATE TABLE IF NOT EXISTS public.certificate_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_id UUID NOT NULL REFERENCES public.certificates(id) ON DELETE CASCADE UNIQUE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    overall_rating SMALLINT NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
    instructor_rating SMALLINT NOT NULL CHECK (instructor_rating BETWEEN 1 AND 5),
    training_quality_rating SMALLINT NOT NULL CHECK (training_quality_rating BETWEEN 1 AND 5),
    written_feedback TEXT,
    suggestions TEXT,
    google_review_clicked BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_cert_feedback_cert ON public.certificate_feedback(certificate_id);
CREATE INDEX IF NOT EXISTS idx_cert_feedback_student ON public.certificate_feedback(student_id);

-- 5. Certificate Download Audit History
CREATE TABLE IF NOT EXISTS public.certificate_downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_id UUID NOT NULL REFERENCES public.certificates(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    downloaded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    ip_address TEXT,
    user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_cert_downloads_cert ON public.certificate_downloads(certificate_id);
CREATE INDEX IF NOT EXISTS idx_cert_downloads_student ON public.certificate_downloads(student_id);

-- ---------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ---------------------------------------------------------------------

ALTER TABLE public.certificate_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificate_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificate_downloads ENABLE ROW LEVEL SECURITY;

-- Templates: Owner/Staff have full access; students can read active template
CREATE POLICY cert_templates_owner_staff ON public.certificate_templates FOR ALL TO authenticated
USING (public.current_user_school_role(school_id) IN ('owner', 'staff'));

CREATE POLICY cert_templates_student_read ON public.certificate_templates FOR SELECT TO authenticated
USING (is_active = true);

-- Certificates: Owner/Staff have full access; students can ONLY access their own
CREATE POLICY certificates_owner_staff ON public.certificates FOR ALL TO authenticated
USING (public.current_user_school_role(school_id) IN ('owner', 'staff'));

CREATE POLICY certificates_student_read ON public.certificates FOR SELECT TO authenticated
USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);

-- Certificate Feedback: Students can insert & read own; Owner/Staff can view all
CREATE POLICY cert_feedback_owner_staff ON public.certificate_feedback FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.certificates c 
        WHERE c.id = certificate_feedback.certificate_id 
        AND public.current_user_school_role(c.school_id) IN ('owner', 'staff')
    )
);

CREATE POLICY cert_feedback_student_insert ON public.certificate_feedback FOR INSERT TO authenticated
WITH CHECK (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);

CREATE POLICY cert_feedback_student_select ON public.certificate_feedback FOR SELECT TO authenticated
USING (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
);

-- Certificate Downloads: Students can insert & read own; Owner/Staff can view all
CREATE POLICY cert_downloads_owner_staff ON public.certificate_downloads FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.certificates c 
        WHERE c.id = certificate_downloads.certificate_id 
        AND public.current_user_school_role(c.school_id) IN ('owner', 'staff')
    )
);

CREATE POLICY cert_downloads_insert ON public.certificate_downloads FOR INSERT TO authenticated
WITH CHECK (
    student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid())
    OR EXISTS (
        SELECT 1 FROM public.certificates c 
        WHERE c.id = certificate_downloads.certificate_id 
        AND public.current_user_school_role(c.school_id) IN ('owner', 'staff')
    )
);

-- ---------------------------------------------------------------------
-- PUBLIC CERTIFICATE VERIFICATION FUNCTION (SECURE - NO PRIVATE DATA)
-- ---------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.verify_certificate_public(p_cert_number TEXT)
RETURNS TABLE (
    certificate_number TEXT,
    student_name TEXT,
    course_name TEXT,
    completion_date DATE,
    school_name TEXT,
    validity_status TEXT,
    issued_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.certificate_number,
        c.student_name,
        c.course_name,
        c.completion_date,
        s.name AS school_name,
        c.status AS validity_status,
        c.issued_at
    FROM public.certificates c
    JOIN public.schools s ON s.id = c.school_id
    WHERE LOWER(c.certificate_number) = LOWER(TRIM(p_cert_number))
      AND c.status = 'Issued'
    LIMIT 1;
END;
$$;

-- Grant anonymous and authenticated access to the public verification function
GRANT EXECUTE ON FUNCTION public.verify_certificate_public(TEXT) TO anon, authenticated;

-- ---------------------------------------------------------------------
-- AUTOMATIC COURSE COMPLETION DETECTION & ISSUANCE TRIGGER
-- ---------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.fn_check_course_completion_and_issue_cert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_enrollment RECORD;
    v_school RECORD;
    v_student RECORD;
    v_course RECORD;
    v_instructor_name TEXT;
    v_total_allocated INT := 0;
    v_total_present INT := 0;
    v_last_present_date DATE;
    v_cert_number TEXT;
    v_cert_id UUID;
    v_random_suffix TEXT;
BEGIN
    -- Only evaluate on attendance Present
    IF NEW.status != 'Present' THEN
        RETURN NEW;
    END IF;

    -- Fetch enrollment
    SELECT * INTO v_enrollment FROM public.enrollments WHERE id = NEW.enrollment_id;
    IF NOT FOUND THEN
        RETURN NEW;
    END IF;

    -- Check if already completed and certificate issued
    IF EXISTS (SELECT 1 FROM public.certificates WHERE enrollment_id = v_enrollment.id) THEN
        RETURN NEW;
    END IF;

    -- Fetch school settings
    SELECT * INTO v_school FROM public.schools WHERE id = v_enrollment.school_id;
    IF v_school.auto_issue_certificates IS FALSE THEN
        RETURN NEW;
    END IF;

    -- Check session allocations vs verified attendance
    SELECT COALESCE(SUM(allocated_count), 0) INTO v_total_allocated
    FROM public.enrollment_session_allocations
    WHERE enrollment_id = v_enrollment.id;

    SELECT 
        COUNT(*),
        MAX(attendance_date)::DATE
    INTO 
        v_total_present,
        v_last_present_date
    FROM public.attendance_records
    WHERE enrollment_id = v_enrollment.id
      AND status = 'Present';

    -- Must have at least 1 allocated session and present count must meet/exceed allocation
    IF v_total_allocated > 0 AND v_total_present >= v_total_allocated THEN
        -- Fetch Student
        SELECT * INTO v_student FROM public.students WHERE id = v_enrollment.student_id;
        
        -- Fetch Course
        SELECT * INTO v_course FROM public.courses WHERE id = v_enrollment.course_id;

        -- Fetch Primary Instructor Name (if assigned)
        SELECT p.full_name INTO v_instructor_name
        FROM public.instructors ins
        JOIN public.profiles p ON p.id = ins.user_id
        WHERE ins.id = v_enrollment.assigned_instructor_id;

        -- Generate unique certificate number: e.g. APEX-CRT-2026-XXXXX
        v_random_suffix := LPAD(FLOOR(RANDOM() * 90000 + 10000)::TEXT, 5, '0');
        v_cert_number := 'APEX-CRT-' || TO_CHAR(COALESCE(v_last_present_date, CURRENT_DATE), 'YYYY') || '-' || v_random_suffix;

        -- 1. Update Student status to 'Course Completed'
        UPDATE public.students 
        SET status = 'Course Completed', updated_at = timezone('utc'::text, now())
        WHERE id = v_student.id;

        -- 2. Update Enrollment status to 'Completed'
        UPDATE public.enrollments 
        SET status = 'Completed', completion_date = COALESCE(v_last_present_date, CURRENT_DATE), updated_at = timezone('utc'::text, now())
        WHERE id = v_enrollment.id;

        -- 3. Automatically insert Certificate record (Idempotent)
        INSERT INTO public.certificates (
            school_id,
            enrollment_id,
            student_id,
            student_code,
            student_name,
            course_id,
            course_name,
            instructor_name,
            certificate_number,
            completion_date,
            issued_at,
            status,
            qr_verification_url,
            download_count,
            metadata
        ) VALUES (
            v_school.id,
            v_enrollment.id,
            v_student.id,
            v_student.student_code,
            v_student.full_name,
            v_course.id,
            COALESCE(v_course.name, 'Comprehensive Driving Program'),
            v_instructor_name,
            v_cert_number,
            COALESCE(v_last_present_date, CURRENT_DATE),
            timezone('utc'::text, now()),
            'Issued',
            '/verify-certificate?certNumber=' || v_cert_number,
            0,
            jsonb_build_object(
                'auto_generated', true,
                'verified_sessions_count', v_total_present,
                'allocated_sessions_count', v_total_allocated,
                'completed_at', timezone('utc'::text, now())
            )
        )
        ON CONFLICT (enrollment_id) DO NOTHING
        RETURNING id INTO v_cert_id;

        -- 4. Send notification to Student
        INSERT INTO public.notifications (
            school_id,
            user_id,
            title,
            message,
            notification_type,
            link_url
        ) VALUES (
            v_school.id,
            v_student.user_id,
            '🎉 Course Completion Certificate Ready!',
            'Congratulations on completing all required driving sessions! Your official certificate #' || v_cert_number || ' is now available for download.',
            'certificate_issued',
            '/student?tab=certificate'
        );

        -- 5. Audit Log Entry
        INSERT INTO public.audit_logs (
            school_id,
            action,
            entity_type,
            entity_id,
            after_data
        ) VALUES (
            v_school.id,
            'AUTOMATIC_CERTIFICATE_ISSUED',
            'certificate',
            v_cert_id,
            jsonb_build_object(
                'certificate_number', v_cert_number,
                'student_id', v_student.id,
                'student_name', v_student.full_name,
                'course_name', v_course.name,
                'verified_sessions', v_total_present
            )
        );
    END IF;

    RETURN NEW;
END;
$$;

-- Create Trigger on attendance_records table
DROP TRIGGER IF EXISTS trg_check_course_completion ON public.attendance_records;
CREATE TRIGGER trg_check_course_completion
AFTER INSERT OR UPDATE OF status ON public.attendance_records
FOR EACH ROW
EXECUTE FUNCTION public.fn_check_course_completion_and_issue_cert();
