'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  GraduationCap, 
  IndianRupee, 
  User, 
  ShieldCheck 
} from 'lucide-react';
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
import { FirstLoginPasswordSetup } from '@/components/student/FirstLoginPasswordSetup';

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

function StudentDashboardContent({ initialModule = 'dashboard' }: StudentDashboardPageProps) {
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

  // MANDATORY ROUTE GUARD: First-Time Login Password Setup
  // If first login or password setup is required, prevent accessing the dashboard
  const isPasswordSetupRequired = Boolean(
    currentStudent.must_change_password ||
    currentStudent.first_login_completed === false ||
    currentStudent.account_status === 'FIRST_LOGIN_PASSWORD_CHANGE_REQUIRED'
  );

  if (isPasswordSetupRequired) {
    return (
      <FirstLoginPasswordSetup
        student={currentStudent}
        onSuccess={() => {
          setActiveTab('dashboard');
        }}
      />
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
            {/* Active Learner Status Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                  {currentStudent.full_name ? currentStudent.full_name.charAt(0).toUpperCase() : 'S'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">{currentStudent.full_name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">{currentStudent.student_code}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      currentStudent.status === 'Course Completed'
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                    }`}>
                      {currentStudent.status}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    {currentEnrollment.course_name} • Admitted on {currentStudent.admission_date}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto text-[11px]">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#0B1728] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Authenticated Learner Session</span>
                </span>
              </div>
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

      {/* Mobile Bottom Navigation Bar (Section 14) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#111E32]/95 backdrop-blur-md border-t border-[#E5EAF1] dark:border-[#1E293B] py-2 px-3 flex items-center justify-around text-[10px] no-print shadow-xl">
        <button
          onClick={() => handleSelectTab('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
            activeTab === 'dashboard' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => handleSelectTab('calendar')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
            activeTab === 'calendar' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Calendar</span>
        </button>

        <button
          onClick={() => handleSelectTab('course')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
            activeTab === 'course' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Course</span>
        </button>

        <button
          onClick={() => handleSelectTab('fees')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
            activeTab === 'fees' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <IndianRupee className="w-4 h-4" />
          <span>Fees</span>
        </button>

        <button
          onClick={() => handleSelectTab('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
            activeTab === 'profile' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile</span>
        </button>
      </nav>

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

export default function StudentDashboardPage(props: StudentDashboardPageProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading Student Dashboard...</div>}>
      <StudentDashboardContent {...props} />
    </Suspense>
  );
}
