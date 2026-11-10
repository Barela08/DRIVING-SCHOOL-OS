'use client';

import React, { useState } from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { useRouter } from 'next/navigation';
import { OwnerSidebar, OwnerNavSection } from '@/components/owner/OwnerSidebar';
import { OwnerTopNavbar } from '@/components/owner/OwnerTopNavbar';
import { ToastContainer } from '@/components/ToastContainer';

// Views
import { DashboardView } from '@/components/owner/views/DashboardView';
import { StudentsView } from '@/components/owner/views/StudentsView';
import { AdmissionsView } from '@/components/owner/views/AdmissionsView';
import { InstructorsView } from '@/components/owner/views/InstructorsView';
import { StaffView } from '@/components/owner/views/StaffView';
import { CoursesView } from '@/components/owner/views/CoursesView';
import { AttendanceView } from '@/components/owner/views/AttendanceView';
import { ScheduleView } from '@/components/owner/views/ScheduleView';
import { FinancesView } from '@/components/owner/views/FinancesView';
import { LicencesView } from '@/components/owner/views/LicencesView';
import { VehiclesView } from '@/components/owner/views/VehiclesView';
import { DocumentsView } from '@/components/owner/views/DocumentsView';
import { NotificationsView } from '@/components/owner/views/NotificationsView';
import { ReportsView } from '@/components/owner/views/ReportsView';
import { AuditLogsView } from '@/components/owner/views/AuditLogsView';
import { SettingsView } from '@/components/owner/views/SettingsView';

// Modals
import { StudentDetailModal } from '@/components/modals/StudentDetailModal';
import { QuickAddModals } from '@/components/modals/QuickAddModals';
import { ReceiptModal } from '@/components/ReceiptModal';
import { RejectPaymentModal } from '@/components/modals/RejectPaymentModal';
import { UpdateLicenceModal } from '@/components/modals/UpdateLicenceModal';
import { InstructorDetailModal } from '@/components/modals/InstructorDetailModal';
import { HelpSupportModal } from '@/components/modals/HelpSupportModal';

import { Student, Payment, LicenceRecord, Instructor } from '@/types';

export default function OwnerDashboardPage({ initialModule = 'dashboard' }: { initialModule?: string } = {}) {
  const router = useRouter();
  const { school, switchRole, addToast } = useDrivingSchool();

  // Active Navigation Section (1-16)
  const [activeSection, setActiveSection] = useState<OwnerNavSection>((initialModule as OwnerNavSection) || 'dashboard');

  // Sidebar Layout States
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Modals States
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);
  const [rejectPaymentTarget, setRejectPaymentTarget] = useState<Payment | null>(null);
  const [updateLicenceTarget, setUpdateLicenceTarget] = useState<LicenceRecord | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [quickAddType, setQuickAddType] = useState<'student' | 'instructor' | 'staff' | 'payment' | 'schedule' | 'vehicle' | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);

  const handleLogout = () => {
    addToast('Logged out of Owner Console', 'info');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0B1728] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Fixed Left Sidebar */}
      <OwnerSidebar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        onOpenHelp={() => setHelpOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Layout Area */}
      <div 
        className={`flex flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}
      >
        {/* Top Navigation Bar */}
        <OwnerTopNavbar
          activeSection={activeSection}
          onSelectSection={setActiveSection}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onQuickAdd={type => setQuickAddType(type)}
          onSelectStudent={stud => setSelectedStudent(stud)}
          onLogout={handleLogout}
        />

        {/* Scrollable Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeSection === 'dashboard' && (
            <DashboardView
              onOpenStudent={stud => setSelectedStudent(stud)}
              onOpenReceipt={p => setSelectedReceipt(p)}
              onOpenRejectPayment={p => setRejectPaymentTarget(p)}
              onOpenLicenceUpdate={lic => setUpdateLicenceTarget(lic)}
              onOpenInstructor={ins => setSelectedInstructor(ins)}
              onNavigateSection={sec => setActiveSection(sec)}
              onQuickAdd={type => setQuickAddType(type)}
            />
          )}

          {activeSection === 'students' && (
            <StudentsView
              onOpenStudent={stud => setSelectedStudent(stud)}
              onQuickAdd={type => setQuickAddType(type)}
            />
          )}

          {activeSection === 'admissions' && (
            <AdmissionsView
              onOpenStudent={stud => setSelectedStudent(stud)}
              onQuickAdd={type => setQuickAddType(type)}
            />
          )}

          {activeSection === 'instructors' && (
            <InstructorsView
              onOpenInstructor={ins => setSelectedInstructor(ins)}
              onQuickAdd={type => setQuickAddType(type)}
            />
          )}

          {activeSection === 'staff' && (
            <StaffView
              onQuickAdd={type => setQuickAddType(type)}
            />
          )}

          {activeSection === 'courses' && (
            <CoursesView />
          )}

          {activeSection === 'attendance' && (
            <AttendanceView />
          )}

          {activeSection === 'schedule' && (
            <ScheduleView
              onQuickAdd={type => setQuickAddType(type)}
            />
          )}

          {activeSection === 'finances' && (
            <FinancesView
              onOpenReceipt={p => setSelectedReceipt(p)}
              onOpenRejectPayment={p => setRejectPaymentTarget(p)}
              onQuickAdd={type => setQuickAddType(type)}
            />
          )}

          {activeSection === 'licences' && (
            <LicencesView
              onOpenLicenceUpdate={lic => setUpdateLicenceTarget(lic)}
            />
          )}

          {activeSection === 'fleet' && (
            <VehiclesView
              onQuickAdd={type => setQuickAddType(type)}
            />
          )}

          {activeSection === 'documents' && (
            <DocumentsView />
          )}

          {activeSection === 'notifications' && (
            <NotificationsView />
          )}

          {activeSection === 'reports' && (
            <ReportsView />
          )}

          {activeSection === 'audit' && (
            <AuditLogsView />
          )}

          {activeSection === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>

      {/* --- ALL INTERACTIVE MODALS --- */}

      {/* 1. Student Comprehensive 10-Tab Detail Modal */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onOpenReceipt={p => setSelectedReceipt(p)}
        />
      )}

      {/* 2. Quick Add Modal (6 Types) */}
      {quickAddType && (
        <QuickAddModals
          type={quickAddType}
          onClose={() => setQuickAddType(null)}
        />
      )}

      {/* 3. Official Receipt Modal */}
      {selectedReceipt && (
        <ReceiptModal
          payment={selectedReceipt}
          school={school}
          onClose={() => setSelectedReceipt(null)}
        />
      )}

      {/* 4. Reject Payment Modal (with mandatory reason) */}
      {rejectPaymentTarget && (
        <RejectPaymentModal
          payment={rejectPaymentTarget}
          onClose={() => setRejectPaymentTarget(null)}
        />
      )}

      {/* 5. Update RTO Licence Modal */}
      {updateLicenceTarget && (
        <UpdateLicenceModal
          licence={updateLicenceTarget}
          onClose={() => setUpdateLicenceTarget(null)}
        />
      )}

      {/* 6. Instructor Detail Modal */}
      {selectedInstructor && (
        <InstructorDetailModal
          instructor={selectedInstructor}
          onClose={() => setSelectedInstructor(null)}
        />
      )}

      {/* 7. Help & Support Modal */}
      {helpOpen && (
        <HelpSupportModal
          onClose={() => setHelpOpen(false)}
        />
      )}
    </div>
  );
}
