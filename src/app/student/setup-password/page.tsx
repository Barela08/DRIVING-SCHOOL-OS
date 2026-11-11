'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { FirstLoginPasswordSetup } from '@/components/student/FirstLoginPasswordSetup';

export default function StudentSetupPasswordPage() {
  const router = useRouter();
  const { students, activeStudentId, currentUser } = useDrivingSchool();

  // Find active student or one requiring password change
  const student = 
    students.find(s => s.id === activeStudentId) ||
    students.find(s => s.must_change_password || !s.first_login_completed) ||
    students.find(s => s.student_code === 'MDA-2026-00125') ||
    students[0];

  const handleSuccess = () => {
    router.push('/student/dashboard');
  };

  if (!student) {
    return (
      <div className="min-h-screen bg-[#F5F7FB] dark:bg-[#0B1728] flex items-center justify-center p-4">
        <p className="text-sm text-slate-500">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <FirstLoginPasswordSetup
      student={student}
      onSuccess={handleSuccess}
    />
  );
}
