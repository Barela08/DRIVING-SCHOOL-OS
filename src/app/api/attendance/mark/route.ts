import { NextRequest, NextResponse } from 'next/server';
import { mockEnrollments, mockInstructors, mockStudents, mockSchedules, mockAttendanceRecords } from '@/lib/mockData';
import { AttendanceRecord, AuditLog } from '@/types';

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user from session cookie
    const roleCookie = req.cookies.get('ds_role')?.value;
    const sessionCookie = req.cookies.get('ds_auth_session')?.value;

    if (!roleCookie || !sessionCookie) {
      return NextResponse.json(
        { success: false, error: 'Authentication required. Please log in.' },
        { status: 401 }
      );
    }

    let sessionObj: any;
    try {
      sessionObj = JSON.parse(sessionCookie);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid session. Please log in again.' },
        { status: 401 }
      );
    }

    // Role check: Only instructor or owner/staff can mark attendance
    if (roleCookie !== 'instructor' && roleCookie !== 'owner' && roleCookie !== 'staff') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Only authorized instructors can mark driving attendance.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    let { enrollmentId, sessionAllocationId, allocationId, scheduleId, remarks } = body;
    const targetAllocationId = sessionAllocationId || allocationId;

    if (!targetAllocationId) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameter: sessionAllocationId is mandatory.' },
        { status: 400 }
      );
    }

    if (!enrollmentId) {
      const foundSched = scheduleId ? mockSchedules.find(s => s.id === scheduleId) : null;
      if (foundSched?.enrollment_id) {
        enrollmentId = foundSched.enrollment_id;
      } else {
        const foundEnr = mockEnrollments.find(e => 
          e.session_allocations?.some(sa => sa.id === targetAllocationId)
        );
        if (foundEnr) {
          enrollmentId = foundEnr.id;
        }
      }
    }

    if (!enrollmentId) {
      return NextResponse.json(
        { success: false, error: 'Could not determine enrollment for this session allocation.' },
        { status: 400 }
      );
    }

    sessionAllocationId = targetAllocationId;

    // 2. Authoritative Server Timestamp (UTC + Asia/Kolkata formatting)
    const serverNow = new Date();
    const serverUtcIso = serverNow.toISOString();
    const serverAttendanceDate = serverUtcIso.split('T')[0]; // YYYY-MM-DD
    const serverTimeIst = serverNow.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    const serverDateIst = serverNow.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // 3. Resolve Instructor Identity from verified session
    const instructorCodeOrId = sessionObj.instructorId || sessionObj.userId || 'ins-vikram-01';
    const instructor = mockInstructors.find(
      i => i.id === instructorCodeOrId || i.user_id === instructorCodeOrId || i.instructor_code === instructorCodeOrId
    ) || mockInstructors[0];

    // 4. Verify Student Enrollment & Assignment
    const enrollment = mockEnrollments.find(e => e.id === enrollmentId);
    if (!enrollment) {
      return NextResponse.json(
        { success: false, error: 'Enrollment record not found.' },
        { status: 404 }
      );
    }

    const student = mockStudents.find(s => s.id === enrollment.student_id);
    if (!student) {
      return NextResponse.json(
        { success: false, error: 'Student record not found.' },
        { status: 404 }
      );
    }

    // Security Check: If requester is an instructor, ensure student is assigned to this instructor
    if (roleCookie === 'instructor' && enrollment.assigned_instructor_id !== instructor.id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Access denied. You are only authorized to mark attendance for students assigned to your roster.' 
        },
        { status: 403 }
      );
    }

    // Check enrollment active status
    if (enrollment.status === 'Cancelled' || student.status === 'Cancelled') {
      return NextResponse.json(
        { success: false, error: 'Cannot record attendance: Student enrollment has been cancelled.' },
        { status: 400 }
      );
    }

    // 5. Verify Session Allocation Quota
    const allocation = enrollment.session_allocations?.find(sa => sa.id === sessionAllocationId);
    if (!allocation) {
      return NextResponse.json(
        { success: false, error: 'Specified session allocation module not found for this enrollment.' },
        { status: 404 }
      );
    }

    if (allocation.completed_count >= allocation.allocated_count) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Quota reached: ${allocation.completed_count}/${allocation.allocated_count} sessions already completed for ${allocation.session_name_snapshot}.` 
        },
        { status: 400 }
      );
    }

    // 6. Duplicate Prevention Check (Idempotency)
    // Check if attendance has already been recorded for this enrollment & allocation today
    const existingToday = mockAttendanceRecords.find(
      a => a.enrollment_id === enrollment.id && 
           a.session_allocation_id === sessionAllocationId &&
           a.attendance_date === serverAttendanceDate &&
           a.status === 'Present'
    );

    if (existingToday) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Attendance already recorded today (${serverDateIst}) at ${new Date(existingToday.marked_at).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' })} IST for ${allocation.session_name_snapshot}. Duplicate attendance is prevented.` 
        },
        { status: 409 }
      );
    }

    // 7. Create authoritative attendance record
    const newRecordId = `att-${Date.now()}`;
    const newAttendance: AttendanceRecord = {
      id: newRecordId,
      school_id: enrollment.school_id || 'school-model-001',
      enrollment_id: enrollment.id,
      student_id: student.id,
      student_code: student.student_code,
      student_name: student.full_name,
      instructor_id: instructor.id,
      instructor_name: instructor.full_name,
      session_allocation_id: allocation.id,
      session_name: allocation.session_name_snapshot,
      attendance_date: serverAttendanceDate,
      marked_at: serverUtcIso,
      status: 'Present',
      remarks: remarks ? String(remarks).trim() : 'Session conducted and verified by instructor',
      created_by: instructor.instructor_code
    };

    // Update in-memory mock record
    mockAttendanceRecords.unshift(newAttendance);
    allocation.completed_count += 1;
    enrollment.completed_sessions += 1;

    // If scheduleId provided, update schedule status
    if (scheduleId) {
      const schedule = mockSchedules.find(s => s.id === scheduleId);
      if (schedule) {
        schedule.status = 'Completed';
        schedule.attendance_status = 'Present';
      }
    }

    return NextResponse.json({
      success: true,
      message: `Attendance confirmed for ${student.full_name} (${student.student_code})!`,
      attendance: newAttendance,
      serverDetails: {
        attendanceDate: serverDateIst,
        markedAtIst: `${serverTimeIst} IST`,
        markedBy: `${instructor.full_name} (${instructor.instructor_code})`,
        sessionName: allocation.session_name_snapshot,
        completedSessions: enrollment.completed_sessions,
        totalSessions: enrollment.total_sessions
      }
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Server error while recording attendance.' },
      { status: 500 }
    );
  }
}
