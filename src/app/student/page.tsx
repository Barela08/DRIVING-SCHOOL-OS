'use client';

import React, { useState, useEffect } from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { Payment } from '@/types';
import { ReceiptModal } from '@/components/ReceiptModal';
import { MyCertificateCard } from '@/components/student/MyCertificateCard';
import { CertificatePreviewModal } from '@/components/modals/CertificatePreviewModal';
import { StudentCourseCalendar } from '@/components/student/StudentCourseCalendar';

import { StudentSidebar, StudentNavTab } from '@/components/student/StudentSidebar';
import { StudentHeader } from '@/components/student/StudentHeader';
import { StudentDashboardHome } from '@/components/student/StudentDashboardHome';
import { StudentProfile } from '@/components/student/StudentProfile';
import { StudentCourse } from '@/components/student/StudentCourse';
import { StudentDrivingProgress } from '@/components/student/StudentDrivingProgress';
import { StudentSchedule } from '@/components/student/StudentSchedule';
import { StudentAttendance } from '@/components/student/StudentAttendance';
import { StudentFees } from '@/components/student/StudentFees';
import { StudentLicenceTracker } from '@/components/student/StudentLicenceTracker';
import { StudentDocuments } from '@/components/student/StudentDocuments';
import { StudentNotifications } from '@/components/student/StudentNotifications';
import { StudentHelpSupport } from '@/components/student/StudentHelpSupport';
import { StudentSettings } from '@/components/student/StudentSettings';
import { StudentCertificateView } from '@/components/student/StudentCertificateView';
import { CertificateFeedbackModal } from '@/components/modals/CertificateFeedbackModal';

interface StudentDashboardPageProps {
  initialModule?: string;
}

const normalizeTab = (module?: string): StudentNavTab => {
  if (!module) return 'dashboard';
  const clean = module.toLowerCase().trim();
  if (clean === 'payments') return 'fees';
  if (
    clean === 'dashboard' ||
    clean === 'calendar' ||
    clean === 'certificate' ||
    clean === 'profile' ||
    clean === 'course' ||
    clean === 'progress' ||
    clean === 'schedule' ||
    clean === 'attendance' ||
    clean === 'fees' ||
    clean === 'licence' ||
    clean === 'documents' ||
    clean === 'notifications' ||
    clean === 'help' ||
    clean === 'settings'
  ) {
    return clean as StudentNavTab;
  }
  return 'dashboard';
};

export default function StudentDashboardPage({ initialModule = 'dashboard' }: StudentDashboardPageProps) {
  const {
    school,
    role,
    students,
    enrollments,
    courses,
    attendanceRecords,
    payments,
    licenceRecords,
    schedules,
    instructors,
    vehicles,
    currentUser,
    notifications,
    studentDocuments,
    supportTickets,
    activeStudentId,
    setActiveStudentId,
    certificates,
    certificateFeedbacks,
    logCertificateDownload,
    markAttendance,
    addToast
  } = useDrivingSchool();

  // Determine active student with strict privacy isolation
  const currentStudent = 
    students.find(s => s.id === activeStudentId) ||
    students.find(s => s.user_id === currentUser.id) ||
    students[0];

  // Sync activeStudentId if not set
  useEffect(() => {
    if (currentStudent && activeStudentId !== currentStudent.id) {
      setActiveStudentId(currentStudent.id);
    }
  }, [currentStudent, activeStudentId, setActiveStudentId]);

  // Scoped student relations
  const currentEnrollment = enrollments.find(e => e.student_id === currentStudent?.id) || enrollments[0];
  const currentCourse = courses.find(c => c.id === currentEnrollment?.course_id);
  const currentLicence = licenceRecords.find(l => l.student_id === currentStudent?.id);
  const studentPayments = payments.filter(p => p.enrollment_id === currentEnrollment?.id);
  const studentAttendance = attendanceRecords.filter(a => a.enrollment_id === currentEnrollment?.id);
  const studentSchedules = schedules.filter(s => s.enrollment_id === currentEnrollment?.id);
  const assignedInstructor = instructors.find(i => i.id === currentEnrollment?.assigned_instructor_id);
  const assignedVehicle = vehicles.find(v => v.id === currentEnrollment?.assigned_vehicle_id);
  const studentDocs = studentDocuments.filter(d => d.student_id === currentStudent?.id);
  const studentTickets = supportTickets.filter(t => t.student_id === currentStudent?.id);

  // Scoped certificate & certificate feedbacks
  const currentCertificate = certificates.find(c => c.student_id === currentStudent?.id);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Scoped notifications
  const scopedNotifications = notifications.filter(
    n => !n.student_id || n.student_id === currentStudent?.id
  );
  const unreadCount = scopedNotifications.filter(n => !n.is_read).length;

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<StudentNavTab>(normalizeTab(initialModule));
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);

  // Certificate Download Handler: triggers voluntary feedback & Google review on first download
  const handleDownloadClick = () => {
    if (!currentCertificate) return;
    const hasFeedback = certificateFeedbacks.some(f => f.student_id === currentStudent.id);
    if (!hasFeedback) {
      setIsFeedbackOpen(true);
    } else {
      executeDownload();
    }
  };

  const executeDownload = async () => {
    if (!currentCertificate) return;
    await logCertificateDownload(currentCertificate.id);
    if (currentCertificate.pdf_data_url) {
      const a = document.createElement('a');
      a.href = currentCertificate.pdf_data_url;
      a.download = `Certificate_${currentCertificate.certificate_number}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      addToast(`Downloading Certificate #${currentCertificate.certificate_number}...`, 'success');
    } else {
      addToast('Certificate PDF is preparing, please try again.', 'info');
    }
  };

  // Instant Real-Time Attendance Completion Simulator (Demo Testing)
  const handleSimulateCompletion = async () => {
    if (!currentEnrollment) return;
    setIsSimulating(true);
    try {
      const allocations = currentEnrollment.session_allocations || [];
      for (const sa of allocations) {
        const remaining = sa.allocated_count - sa.completed_count;
        for (let i = 0; i < remaining; i++) {
          await markAttendance({
            enrollmentId: currentEnrollment.id,
            sessionAllocationId: sa.id,
            instructorId: currentEnrollment.assigned_instructor_id || 'ins-vikram-01',
            remarks: 'Practical session verified for course completion.'
          });
        }
      }
      addToast('🎓 All required classes marked! Automatic certificate generated.', 'success');
    } catch (e) {
      console.error('Simulation error:', e);
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    if (initialModule) {
      setActiveTab(normalizeTab(initialModule));
    }
  }, [initialModule]);

  const handleSelectTab = (tab: StudentNavTab) => {
    setActiveTab(tab);
    setIsOpenMobile(false);
    // Update window history URL cleanly without full page refresh
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/student/${tab === 'fees' ? 'fees' : tab}`);
    }
  };

  if (!currentStudent || !currentEnrollment) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0B1728] flex items-center justify-center p-4">
        <div className="p-8 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-xl text-center space-y-4 max-w-md">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center font-bold">
            DS
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Loading Student Portal...</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Securely initializing your driving lesson records, fees, and licence progress.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0B1728] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Application Header */}
      <StudentHeader
        activeTab={activeTab}
        onOpenMobileSidebar={() => setIsOpenMobile(true)}
        onSelectTab={handleSelectTab}
        student={currentStudent}
        unreadCount={unreadCount}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <StudentSidebar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          isOpenMobile={isOpenMobile}
          onCloseMobile={() => setIsOpenMobile(false)}
          student={currentStudent}
          unreadCount={unreadCount}
        />

        {/* Main Content Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 transition-all duration-300">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Student Account Switcher Bar (Demo & Testing Feature) */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700 dark:text-slate-300">Active Learner Session:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{currentStudent.full_name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold">{currentStudent.student_code}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  currentStudent.status === 'Course Completed'
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-600 border border-amber-500/30'
                }`}>
                  {currentStudent.status}
                </span>
              </div>

              {role !== 'student' && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-500">Staff Preview Switcher:</span>
                  {students.map(s => {
                    let badge = '';
                    if (s.id === 'stud-amit-03') badge = '🎓';
                    else if (s.id === 'stud-kartik-07') badge = '🔔 LL Alert';
                    else if (s.id === 'stud-ananya-06') badge = '✅ Has LL';
                    else if (s.id === 'stud-sneha-08') badge = '⏳ 8 Days';
                    else if (s.id === 'stud-farhan-09') badge = '⚠️ Expired LL';

                    return (
                      <button
                        key={s.id}
                        onClick={() => setActiveStudentId(s.id)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition flex items-center gap-1 ${
                          activeStudentId === s.id
                            ? 'bg-blue-600 text-white font-bold shadow-sm'
                            : 'bg-[#F5F7FB] dark:bg-[#0B1728] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>{s.full_name.split(' ')[0]}</span>
                        {badge && <span className="text-[10px] opacity-90">{badge}</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {activeTab === 'dashboard' && (
              <StudentDashboardHome
                student={currentStudent}
                enrollment={currentEnrollment}
                licence={currentLicence}
                payments={studentPayments}
                attendance={studentAttendance}
                schedules={studentSchedules}
                instructor={assignedInstructor}
                vehicle={assignedVehicle}
                notifications={scopedNotifications}
                certificate={currentCertificate}
                onSelectTab={handleSelectTab}
                onOpenReceipt={(payment) => setSelectedReceipt(payment)}
                onOpenCertificatePreview={() => setIsPreviewOpen(true)}
                onDownloadCertificate={handleDownloadClick}
                onSimulateCompletion={handleSimulateCompletion}
                isSimulating={isSimulating}
              />
            )}

            {activeTab === 'calendar' && (
              <StudentCourseCalendar
                enrollment={currentEnrollment}
                course={currentCourse}
                attendance={studentAttendance}
                schedules={studentSchedules}
                instructor={assignedInstructor}
                vehicle={assignedVehicle}
                school={school}
              />
            )}

            {activeTab === 'certificate' && (
              <StudentCertificateView
                student={currentStudent}
                enrollment={currentEnrollment}
                certificate={currentCertificate}
                feedbacks={certificateFeedbacks}
                onOpenPreview={() => setIsPreviewOpen(true)}
                onDownloadClick={handleDownloadClick}
                onSimulateCompletion={handleSimulateCompletion}
                isSimulating={isSimulating}
              />
            )}

            {activeTab === 'profile' && (
              <StudentProfile
                student={currentStudent}
                enrollment={currentEnrollment}
              />
            )}

            {activeTab === 'course' && (
              <StudentCourse
                course={currentCourse}
                enrollment={currentEnrollment}
                instructor={assignedInstructor}
                vehicle={assignedVehicle}
                attendance={studentAttendance}
                schedules={studentSchedules}
              />
            )}

            {activeTab === 'progress' && (
              <StudentDrivingProgress
                enrollment={currentEnrollment}
                attendance={studentAttendance}
              />
            )}

            {activeTab === 'schedule' && (
              <StudentSchedule
                schedules={studentSchedules}
                instructor={assignedInstructor}
                vehicle={assignedVehicle}
              />
            )}

            {activeTab === 'attendance' && (
              <StudentAttendance
                attendance={studentAttendance}
                enrollment={currentEnrollment}
              />
            )}

            {activeTab === 'fees' && (
              <StudentFees
                payments={studentPayments}
                enrollment={currentEnrollment}
                school={school}
                onOpenReceipt={(payment) => setSelectedReceipt(payment)}
              />
            )}

            {activeTab === 'licence' && (
              <StudentLicenceTracker
                licence={currentLicence}
                student={currentStudent}
                school={school}
                enrollment={currentEnrollment}
              />
            )}

            {activeTab === 'documents' && (
              <StudentDocuments
                documents={studentDocs}
                student={currentStudent}
              />
            )}

            {activeTab === 'notifications' && (
              <StudentNotifications
                notifications={scopedNotifications}
                student={currentStudent}
                onSelectTab={handleSelectTab}
              />
            )}

            {activeTab === 'help' && (
              <StudentHelpSupport
                student={currentStudent}
                instructor={assignedInstructor}
                school={school}
                tickets={studentTickets}
              />
            )}

            {activeTab === 'settings' && (
              <StudentSettings
                student={currentStudent}
              />
            )}
          </div>
        </main>
      </div>

      {/* Official Tax Invoice & Payment Receipt Modal */}
      <ReceiptModal
        payment={selectedReceipt}
        school={school}
        onClose={() => setSelectedReceipt(null)}
      />

      {/* Certificate Preview Modal */}
      <CertificatePreviewModal
        certificate={currentCertificate || null}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onDownloadRequest={handleDownloadClick}
      />

      {/* Voluntary Feedback & Google Review Modal */}
      <CertificateFeedbackModal
        certificate={currentCertificate || null}
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onProceedToDownload={executeDownload}
      />
    </div>
  );
}
