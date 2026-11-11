'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import confetti from 'canvas-confetti';
import { ToastContainer } from '@/components/ToastContainer';
import { 
  Instructor, 
  Student, 
  Enrollment, 
  ClassSchedule, 
  AttendanceRecord, 
  InstructorTimeSlotSummary,
  InstructorNavModule,
  StudentSkillAssessment 
} from '@/types';
import { mockTimeSlots, mockStudentSkillAssessments } from '@/lib/mockData';

// Instructor Modular Components
import { InstructorTopNavbar } from '@/components/instructor/InstructorTopNavbar';
import { InstructorSidebar } from '@/components/instructor/InstructorSidebar';
import { InstructorDashboardView } from '@/components/instructor/views/InstructorDashboardView';
import { TimeSlotStudentsView } from '@/components/instructor/views/TimeSlotStudentsView';
import { StudentProfileView } from '@/components/instructor/views/StudentProfileView';
import { StudentCheckInView } from '@/components/instructor/views/StudentCheckInView';
import { AttendanceHistoryView } from '@/components/instructor/views/AttendanceHistoryView';
import { MyScheduleView } from '@/components/instructor/views/MyScheduleView';
import { MyStudentsView } from '@/components/instructor/views/MyStudentsView';
import { InstructorNotificationsView } from '@/components/instructor/views/InstructorNotificationsView';
import { InstructorProfileView } from '@/components/instructor/views/InstructorProfileView';

interface InstructorPortalProps {
  initialModule?: string;
}

function InstructorPortalContent({ initialModule = 'dashboard' }: InstructorPortalProps) {
  const router = useRouter();
  const { 
    school, 
    instructors, 
    vehicles, 
    students, 
    enrollments, 
    attendanceRecords, 
    schedules, 
    licenceRecords,
    llReminderSettings,
    studentDocuments,
    notifications, 
    markAttendance,
    currentUser,
    addToast,
    markNotificationRead,
    markAllNotificationsRead 
  } = useDrivingSchool();

  // Active instructor: Vikram Shinde (INS-2026-01) by default or matching logged in user
  const currentInstructor: Instructor = useMemo(() => {
    return instructors.find(i => i.user_id === currentUser.id || i.id === currentUser.id) || instructors[0];
  }, [instructors, currentUser.id]);

  const assignedVehicle = vehicles.find(v => v.id === currentInstructor.assigned_vehicle_id);

  // Active navigation module
  const [activeNav, setActiveNav] = useState<InstructorNavModule>((initialModule as InstructorNavModule) || 'dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Interactive drilling states
  const [selectedSlot, setSelectedSlot] = useState<InstructorTimeSlotSummary | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<ClassSchedule | null>(null);

  // Skill assessments local state
  const [skillAssessments, setSkillAssessments] = useState<StudentSkillAssessment[]>(mockStudentSkillAssessments);

  useEffect(() => {
    if (initialModule) {
      setActiveNav(initialModule as InstructorNavModule);
      // Reset deep drilldowns when navigating via top-level tab
      if (initialModule !== 'today-classes') {
        setSelectedSlot(null);
      }
      setSelectedStudent(null);
      setSelectedEnrollment(null);
      setSelectedSchedule(null);
    }
  }, [initialModule]);

  // Students assigned to this instructor
  const myEnrollments = useMemo(() => {
    return enrollments.filter(e => e.assigned_instructor_id === currentInstructor.id);
  }, [enrollments, currentInstructor.id]);

  const myStudentIds = useMemo(() => {
    return new Set(myEnrollments.map(e => e.student_id));
  }, [myEnrollments]);

  const myStudents = useMemo(() => {
    return students.filter(s => myStudentIds.has(s.id));
  }, [students, myStudentIds]);

  // Today's schedules for this instructor
  const todayStr = '2026-11-10';
  const [nowHour, setNowHour] = useState(9);
  useEffect(() => {
    setNowHour(new Date().getHours());
  }, []);

  const myTodaySchedules = useMemo(() => {
    return schedules.filter(s => s.instructor_id === currentInstructor.id && s.scheduled_start.startsWith(todayStr));
  }, [schedules, currentInstructor.id, todayStr]);

  // Today's attendance logged by this instructor
  const myTodayAttendance = useMemo(() => {
    return attendanceRecords.filter(a => a.instructor_id === currentInstructor.id && a.attendance_date === todayStr);
  }, [attendanceRecords, currentInstructor.id, todayStr]);

  // =========================================================================
  // DYNAMIC TIME SLOT FIRST INTERFACE ENGINE (Part 3)
  // Group confirmed schedules into Owner-configured time slots
  // =========================================================================
  const timeSlotSummaries: InstructorTimeSlotSummary[] = useMemo(() => {
    // Collect distinct time slots assigned to this instructor today
    const slotMap = new Map<string, InstructorTimeSlotSummary>();

    // 1. First, populate from owner-configured time slots where instructor is default or has schedules
    mockTimeSlots.forEach(ts => {
      // Find today's schedules matching this slot
      const matchingSchedules = myTodaySchedules.filter(sch => {
        if (sch.time_slot_id === ts.id) return true;
        // Or match by scheduled start time
        const schStartHour = sch.scheduled_start.split('T')[1]?.slice(0, 5) || '08:00';
        return schStartHour >= ts.start_time && schStartHour < ts.end_time;
      });

      if (matchingSchedules.length > 0) {
        // Calculate completed vs pending
        let completedCount = 0;
        matchingSchedules.forEach(sch => {
          const isMarked = myTodayAttendance.some(
            att => (att.student_code === sch.student_code || att.student_name === sch.student_name) && att.status === 'Present'
          );
          if (isMarked || sch.attendance_status === 'Present') {
            completedCount++;
          }
        });

        const pendingCount = matchingSchedules.length - completedCount;

        // Determine slot status
        let status: 'Upcoming' | 'In Progress' | 'Completed' | 'Pending' = 'Upcoming';
        const currentSlotStartHour = parseInt(ts.start_time.split(':')[0], 10);
        const currentSlotEndHour = parseInt(ts.end_time.split(':')[0], 10);

        if (completedCount > 0 && pendingCount === 0) {
          status = 'Completed';
        } else if (nowHour >= currentSlotStartHour && nowHour < currentSlotEndHour) {
          status = 'In Progress';
        } else if (nowHour >= currentSlotEndHour && pendingCount > 0) {
          status = 'Pending';
        } else {
          status = 'Upcoming';
        }

        slotMap.set(ts.id, {
          slot_id: ts.id,
          slot_label: ts.slot_label,
          start_time: ts.start_time,
          end_time: ts.end_time,
          total_students: matchingSchedules.length,
          completed_classes: completedCount,
          pending_classes: pendingCount,
          slot_status: status,
          schedules: matchingSchedules
        });
      }
    });

    // 2. Ensure any remaining schedules without explicit time_slot_id are also captured
    myTodaySchedules.forEach(sch => {
      const schSlotLabel = sch.time_slot_label || '07:00 AM – 08:00 AM';
      const slotKey = sch.time_slot_id || schSlotLabel;

      if (!slotMap.has(slotKey)) {
        const isMarked = myTodayAttendance.some(
          att => att.student_code === sch.student_code && att.status === 'Present'
        );

        slotMap.set(slotKey, {
          slot_id: slotKey,
          slot_label: schSlotLabel,
          start_time: '07:00',
          end_time: '08:00',
          total_students: 1,
          completed_classes: isMarked ? 1 : 0,
          pending_classes: isMarked ? 0 : 1,
          slot_status: isMarked ? 'Completed' : 'Upcoming',
          schedules: [sch]
        });
      }
    });

    return Array.from(slotMap.values()).sort((a, b) => a.start_time.localeCompare(b.start_time));
  }, [myTodaySchedules, myTodayAttendance]);

  // Attendance Action with Server Endpoint
  const handleExecuteAttendance = async (
    allocationId: string, 
    remarks?: string, 
    scheduleId?: string
  ): Promise<{ success: boolean; message: string }> => {
    const student = selectedStudent;
    const enrollment = selectedEnrollment;

    if (!student || !enrollment) {
      return { success: false, message: 'Student profile not active' };
    }

    try {
      // 1. Call server API endpoint for atomic server timestamp
      const apiRes = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentId: enrollment.id,
          sessionAllocationId: allocationId,
          scheduleId,
          remarks
        })
      });

      const data = await apiRes.json();

      if (apiRes.ok && data.success) {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 }
        });

        // Also update context state
        await markAttendance({
          enrollmentId: enrollment.id,
          sessionAllocationId: allocationId,
          instructorId: currentInstructor.id,
          vehicleId: assignedVehicle?.id,
          remarks: remarks || 'Driving session conducted and verified'
        });

        return { success: true, message: data.message || 'Attendance verified successfully!' };
      }

      // If server returned duplicate or quota error
      if (data.error) {
        return { success: false, message: data.error };
      }

      // Fallback context execution
      const fallbackRes = await markAttendance({
        enrollmentId: enrollment.id,
        sessionAllocationId: allocationId,
        instructorId: currentInstructor.id,
        vehicleId: assignedVehicle?.id,
        remarks: remarks || 'Driving session conducted and verified'
      });

      return fallbackRes;
    } catch {
      // Offline fallback
      const fallbackRes = await markAttendance({
        enrollmentId: enrollment.id,
        sessionAllocationId: allocationId,
        instructorId: currentInstructor.id,
        vehicleId: assignedVehicle?.id,
        remarks: remarks || 'Driving session conducted and verified'
      });
      return fallbackRes;
    }
  };

  // Skill Assessment Saving Handler
  const handleSaveSkillAssessment = async (assessment: Partial<StudentSkillAssessment>) => {
    if (!assessment.student_id) return;
    setSkillAssessments(prev => {
      const idx = prev.findIndex(a => a.student_id === assessment.student_id);
      const updated: StudentSkillAssessment = {
        id: idx >= 0 ? prev[idx].id : `skill-${Date.now()}`,
        student_id: assessment.student_id!,
        instructor_id: currentInstructor.id,
        instructor_name: currentInstructor.full_name,
        steering_control: assessment.steering_control || 4,
        clutch_control: assessment.clutch_control || 3,
        gear_changing: assessment.gear_changing || 4,
        reverse_parking: assessment.reverse_parking || 3,
        highway_driving: assessment.highway_driving || 4,
        traffic_handling: assessment.traffic_handling || 3,
        road_confidence: assessment.road_confidence || 4,
        remarks: assessment.remarks || '',
        updated_at: new Date().toISOString()
      };

      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updated;
        return next;
      }
      return [updated, ...prev];
    });
  };

  // Sign out handler
  const handleLogout = () => {
    if (window.confirm('Sign out of the instructor portal?')) {
      document.cookie = 'ds_role=; path=/; max-age=0';
      document.cookie = 'ds_auth_session=; path=/; max-age=0';
      document.cookie = 'ds_user_id=; path=/; max-age=0';
      addToast('Signed out of instructor portal', 'info');
      router.push('/login');
    }
  };

  // Quick student look-up trigger from schedule or time slot
  const handleOpenStudentByCode = (studentCode: string) => {
    const student = students.find(s => s.student_code === studentCode || s.id === studentCode);
    const enrollment = student ? enrollments.find(e => e.student_id === student.id) : null;
    const schedule = myTodaySchedules.find(s => s.student_code === studentCode) || null;

    if (student && enrollment) {
      setSelectedStudent(student);
      setSelectedEnrollment(enrollment);
      setSelectedSchedule(schedule);
    } else {
      setActiveNav('students');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0B1728] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Top Navbar */}
      <InstructorTopNavbar
        school={school}
        instructor={currentInstructor}
        notifications={notifications}
        onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        onOpenQuickCheckIn={() => {
          setSelectedStudent(null);
          setSelectedEnrollment(null);
          setSelectedSlot(null);
          setActiveNav('students');
        }}
        onNavigate={(mod) => {
          setSelectedStudent(null);
          setSelectedEnrollment(null);
          setSelectedSlot(null);
          setActiveNav(mod as InstructorNavModule);
        }}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex">
        {/* Fixed Left Sidebar (Desktop + Mobile Drawer) */}
        <InstructorSidebar
          activeModule={activeNav}
          onSelectModule={(mod) => {
            setSelectedStudent(null);
            setSelectedEnrollment(null);
            setSelectedSlot(null);
            setActiveNav(mod);
          }}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          unreadNotificationsCount={notifications.filter(n => !n.is_read).length}
          onLogout={handleLogout}
        />

        {/* Scrollable Main Content Workspace */}
        <main
          className={`flex-1 transition-all duration-300 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto ${
            sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-68'
          }`}
        >
          {/* 1. STUDENT PROFILE DRILLDOWN (If a student is selected) */}
          {selectedStudent && selectedEnrollment ? (
            <StudentProfileView
              student={selectedStudent}
              enrollment={selectedEnrollment}
              todaySchedule={selectedSchedule}
              attendanceHistory={attendanceRecords.filter(a => a.student_id === selectedStudent.id)}
              licenceRecord={licenceRecords.find(l => l.student_id === selectedStudent.id)}
              llReminderSettings={llReminderSettings}
              studentDocuments={studentDocuments.filter(d => d.student_id === selectedStudent.id)}
              initialSkillAssessment={skillAssessments.find(s => s.student_id === selectedStudent.id)}
              currentInstructorName={currentInstructor.full_name}
              onBack={() => {
                setSelectedStudent(null);
                setSelectedEnrollment(null);
                setSelectedSchedule(null);
              }}
              onMarkAttendance={handleExecuteAttendance}
              onSaveSkillAssessment={handleSaveSkillAssessment}
              addToast={addToast}
            />
          ) : selectedSlot && (activeNav === 'dashboard' || activeNav === 'today-classes') ? (
            /* 2. TIME SLOT-WISE STUDENT LIST (If a time slot is selected - Part 4) */
            <TimeSlotStudentsView
              slot={selectedSlot}
              students={students}
              enrollments={enrollments}
              todayAttendance={myTodayAttendance}
              onBack={() => setSelectedSlot(null)}
              onOpenStudentProfile={(stud, enr, sched) => {
                setSelectedStudent(stud);
                setSelectedEnrollment(enr);
                setSelectedSchedule(sched || null);
              }}
            />
          ) : (
            /* 3. TOP-LEVEL VIEWS BASED ON NAVIGATION */
            <>
              {/* TAB 1: MAIN DASHBOARD (Time Slot First Interface - Part 3) */}
              {activeNav === 'dashboard' && (
                <InstructorDashboardView
                  instructor={currentInstructor}
                  assignedVehicle={assignedVehicle}
                  assignedStudents={myStudents}
                  todaySchedules={myTodaySchedules}
                  todayAttendance={myTodayAttendance}
                  timeSlotSummaries={timeSlotSummaries}
                  onSelectTimeSlot={(slot) => setSelectedSlot(slot)}
                  onQuickCheckIn={() => setActiveNav('students')}
                />
              )}

              {/* TAB 2: STUDENTS / STUDENT ID SEARCH & CHECK-IN (Part 6) */}
              {(activeNav === 'students' || activeNav === 'find-student') && (
                <StudentCheckInView
                  currentInstructor={currentInstructor}
                  students={students}
                  enrollments={enrollments}
                  schedules={schedules}
                  attendanceRecords={attendanceRecords}
                  licenceRecords={licenceRecords}
                  llReminderSettings={llReminderSettings}
                  studentDocuments={studentDocuments}
                  skillAssessments={skillAssessments}
                  onMarkAttendance={handleExecuteAttendance}
                  onSaveSkillAssessment={handleSaveSkillAssessment}
                  addToast={addToast}
                />
              )}

              {/* TAB 3: TODAY'S CLASSES (Time-slot overview or slot list) */}
              {activeNav === 'today-classes' && (
                <div className="space-y-6">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      Today&apos;s Time Slot Shift Rosters
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Select a confirmed time slot to inspect the learner group and log attendance.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {timeSlotSummaries.map((slot) => (
                      <div
                        key={slot.slot_id}
                        onClick={() => setSelectedSlot(slot)}
                        className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm hover:shadow-md cursor-pointer transition hover:border-blue-400 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                            {slot.slot_label}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-600 border border-blue-500/25">
                            {slot.slot_status}
                          </span>
                        </div>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">
                          {slot.total_students} Learners
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <span>{slot.completed_classes} Completed</span>
                          <span className="font-bold text-blue-600">Open Roster &rarr;</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: MY SCHEDULE (Part 14) */}
              {activeNav === 'schedule' && (
                <MyScheduleView
                  currentInstructor={currentInstructor}
                  assignedVehicle={assignedVehicle}
                  schedules={schedules}
                  onOpenStudent={handleOpenStudentByCode}
                />
              )}

              {/* TAB 5: ATTENDANCE HISTORY (Part 9) */}
              {activeNav === 'history' && (
                <AttendanceHistoryView
                  currentInstructor={currentInstructor}
                  attendanceRecords={attendanceRecords}
                />
              )}

              {/* TAB 6: MY STUDENTS (Part 14) */}
              {activeNav === 'my-students' && (
                <MyStudentsView
                  students={myStudents}
                  enrollments={myEnrollments}
                  attendanceRecords={attendanceRecords}
                  licenceRecords={licenceRecords}
                  llReminderSettings={llReminderSettings}
                  studentDocuments={studentDocuments}
                  onOpenStudent={(stud, enr) => {
                    setSelectedStudent(stud);
                    setSelectedEnrollment(enr);
                  }}
                />
              )}

              {/* TAB 7: NOTIFICATIONS (Part 15) */}
              {activeNav === 'notifications' && (
                <InstructorNotificationsView
                  notifications={notifications}
                  onMarkAllRead={markAllNotificationsRead}
                  onMarkSingleRead={markNotificationRead}
                />
              )}

              {/* TAB 8: MY PROFILE (Part 14) */}
              {activeNav === 'profile' && (
                <InstructorProfileView
                  instructor={currentInstructor}
                  assignedVehicle={assignedVehicle}
                  school={school}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default function InstructorPortalPage(props: InstructorPortalProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Instructor Portal...</div>}>
      <InstructorPortalContent {...props} />
    </Suspense>
  );
}
