import { NextRequest, NextResponse } from 'next/server';
import { 
  mockStudents, 
  mockEnrollments, 
  mockInstructors, 
  mockSchedules, 
  mockAttendanceRecords, 
  mockLicenceRecords,
  mockLLReminderSettings,
  mockStudentSkillAssessments 
} from '@/lib/mockData';

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user from session cookie
    const roleCookie = req.cookies.get('ds_role')?.value;
    const sessionCookie = req.cookies.get('ds_auth_session')?.value;

    if (!roleCookie || !sessionCookie) {
      return NextResponse.json(
        { success: false, error: 'Authentication required. Please sign in.' },
        { status: 401 }
      );
    }

    let sessionObj: any;
    try {
      sessionObj = JSON.parse(sessionCookie);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid authentication session.' },
        { status: 401 }
      );
    }

    // Role check
    if (roleCookie !== 'instructor' && roleCookie !== 'owner' && roleCookie !== 'staff') {
      return NextResponse.json(
        { success: false, error: 'Access denied.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { studentId } = body;

    if (!studentId || !String(studentId).trim()) {
      return NextResponse.json(
        { success: false, error: 'Please enter a Student ID (e.g. MDA-2026-00125).' },
        { status: 400 }
      );
    }

    const query = String(studentId).trim().toUpperCase();

    // 2. Resolve Authenticated Instructor
    const instructorCodeOrId = sessionObj.instructorId || sessionObj.userId || 'ins-vikram-01';
    const currentInstructor = mockInstructors.find(
      i => i.id === instructorCodeOrId || i.user_id === instructorCodeOrId || i.instructor_code === instructorCodeOrId
    ) || mockInstructors[0];

    // 3. Search for Student by exact student code or matching code
    const student = mockStudents.find(
      s => s.student_code.toUpperCase() === query || s.id.toUpperCase() === query
    );

    // If student does not exist: Exact message from prompt
    if (!student) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Student not found. Please check the Student ID.' 
        },
        { status: 404 }
      );
    }

    // 4. Find active enrollment
    const enrollment = mockEnrollments.find(e => e.student_id === student.id);
    if (!enrollment) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Student not found. Please check the Student ID.' 
        },
        { status: 404 }
      );
    }

    // 5. Check if student is assigned to this instructor (Role boundary check)
    // If not assigned: Exact message from prompt with ZERO private details revealed!
    if (roleCookie === 'instructor' && enrollment.assigned_instructor_id !== currentInstructor.id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Access denied. This student is not assigned to your account.' 
        },
        { status: 403 }
      );
    }

    // 6. Retrieve today's confirmed schedule (if any)
    const todayStr = new Date().toISOString().split('T')[0];
    const todaySchedule = mockSchedules.find(
      s => s.enrollment_id === enrollment.id && 
           (s.scheduled_start.startsWith(todayStr) || s.scheduled_start.startsWith('2026-11-10'))
    ) || null;

    // 7. Retrieve student's attendance records for this instructor
    const studentAttendance = mockAttendanceRecords.filter(
      a => a.enrollment_id === enrollment.id
    );

    // 8. Retrieve licence record
    const licenceRecord = mockLicenceRecords.find(l => l.student_id === student.id) || null;

    // 9. Retrieve skill assessment
    const skillAssessment = mockStudentSkillAssessments.find(
      sa => sa.student_id === student.id
    ) || null;

    // Authorized payload
    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        student_code: student.student_code,
        full_name: student.full_name,
        phone: student.phone,
        email: student.email || null,
        status: student.status,
        created_at: student.created_at,
        assigned_instructor_name: enrollment.assigned_instructor_name || currentInstructor.full_name
      },
      enrollment: {
        id: enrollment.id,
        course_id: enrollment.course_id,
        course_name: enrollment.course_name,
        start_date: enrollment.start_date,
        expected_end_date: enrollment.expected_end_date,
        status: enrollment.status,
        total_sessions: enrollment.total_sessions,
        completed_sessions: enrollment.completed_sessions,
        session_allocations: enrollment.session_allocations || []
      },
      todaySchedule,
      attendanceHistory: studentAttendance,
      licenceRecord,
      skillAssessment
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Server error during student search.' },
      { status: 500 }
    );
  }
}
