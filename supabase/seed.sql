-- =====================================================================
-- DRIVING SCHOOL OS — REALISTIC SEED DATA (INDIA / PUNE REGION)
-- Preloads school, courses, vehicles, instructors, students, & allocations
-- =====================================================================

DO $$
DECLARE
    v_school_id UUID := '00000000-0000-0000-0000-000000000001'::uuid;
    v_branch_camp UUID := '00000000-0000-0000-0000-000000000002'::uuid;
    v_branch_kothrud UUID := '00000000-0000-0000-0000-000000000003'::uuid;
    v_course_4w UUID := '00000000-0000-0000-0000-000000000010'::uuid;
    v_course_2w UUID := '00000000-0000-0000-0000-000000000020'::uuid;
    v_veh_swift UUID := '00000000-0000-0000-0000-000000000030'::uuid;
    v_veh_i10 UUID := '00000000-0000-0000-0000-000000000031'::uuid;
    v_veh_activa UUID := '00000000-0000-0000-0000-000000000032'::uuid;
    v_owner_user UUID := '11111111-1111-1111-1111-111111111111'::uuid;
    v_staff_user UUID := '22222222-2222-2222-2222-222222222222'::uuid;
    v_ins_user_1 UUID := '33333333-3333-3333-3333-333333333333'::uuid;
    v_ins_1 UUID := '33333333-3333-3333-3333-333333333334'::uuid;
    v_stud_user_1 UUID := '44444444-4444-4444-4444-444444444444'::uuid;
    v_student_1 UUID := '44444444-4444-4444-4444-444444444445'::uuid;
    v_enroll_1 UUID := '55555555-5555-5555-5555-555555555555'::uuid;
BEGIN
    -- 1. Create School
    INSERT INTO public.schools (id, name, slug, contact_phone, contact_email, rto_registration_no, tagline)
    VALUES (
        v_school_id,
        'Apex Motor Driving School',
        'apex-driving-school',
        '+91 98220 99887',
        'info@apexdriving.in',
        'MH-12/MDS/2018/042',
        'Govt. Authorized Driving Institute & RTO Consultant'
    ) ON CONFLICT (id) DO NOTHING;

    -- 2. Branches
    INSERT INTO public.branches (id, school_id, name, code, phone)
    VALUES 
    (v_branch_camp, v_school_id, 'Camp Head Office', 'CMP', '+91 98220 99887'),
    (v_branch_kothrud, v_school_id, 'Kothrud Branch', 'KTD', '+91 98220 99888')
    ON CONFLICT (id) DO NOTHING;

    -- 3. Vehicles
    INSERT INTO public.vehicles (id, school_id, branch_id, registration_number, vehicle_type, brand, model, is_dual_control, status)
    VALUES 
    (v_veh_swift, v_school_id, v_branch_camp, 'MH-12-AB-1234', '4W_Manual', 'Maruti Suzuki', 'Swift Dzire (Dual Control)', true, 'Assigned'),
    (v_veh_i10, v_school_id, v_branch_camp, 'MH-12-CD-5678', '4W_Manual', 'Hyundai', 'Grand i10 Nios', true, 'Available'),
    (v_veh_activa, v_school_id, v_branch_camp, 'MH-12-EF-9012', '2W', 'Honda', 'Activa 6G', false, 'Available')
    ON CONFLICT (id) DO NOTHING;

    -- 4. Courses
    INSERT INTO public.courses (id, school_id, name, description, category, duration_days, price)
    VALUES 
    (v_course_4w, v_school_id, 'Four Wheeler Complete Mastery (20 Sessions)', 'Comprehensive LMV manual car training covering all maneuvers, hill assist, and RTO test prep.', '4W', 30, 8500.00),
    (v_course_2w, v_school_id, 'Two Wheeler Professional Riding (10 Sessions)', 'Scooter & Motorcycle balance, traffic, and emergency braking training.', '2W', 15, 3500.00)
    ON CONFLICT (id) DO NOTHING;

    -- 5. Course Session Templates for 4W Course
    INSERT INTO public.course_session_templates (course_id, session_name, session_code, total_sessions, sort_order)
    VALUES
    (v_course_4w, 'Basic Vehicle Controls & Cockpit Drill', 'BASIC_INTRO', 2, 1),
    (v_course_4w, 'Clutch, Gear & Steering Coordination', 'CLUTCH_GEAR', 2, 2),
    (v_course_4w, 'Straight Road Driving & Lane Discipline', 'ROAD_DRIVING', 3, 3),
    (v_course_4w, 'City Traffic & Junction Negotiation', 'TRAFFIC_DRIVING', 3, 4),
    (v_course_4w, 'Reverse Driving in Straight & S-Track', 'REVERSE_DRIVE', 2, 5),
    (v_course_4w, 'Reverse Parking (Perpendicular & Box)', 'REVERSE_PARK', 2, 6),
    (v_course_4w, 'Parallel Parking between Vehicles', 'PARALLEL_PARK', 2, 7),
    (v_course_4w, 'Night Driving & Headlight Etiquette', 'NIGHT_DRIVE', 1, 8),
    (v_course_4w, 'Highway Speed Control & Overtaking', 'HIGHWAY_DRIVE', 1, 9),
    (v_course_4w, 'Hill Start & Half-Clutch Slope Control', 'HILL_DRIVE', 1, 10),
    (v_course_4w, 'RTO Track Mock Test & Signage Quiz', 'TEST_PREP', 1, 11)
    ON CONFLICT (course_id, session_code) DO NOTHING;

END $$;
