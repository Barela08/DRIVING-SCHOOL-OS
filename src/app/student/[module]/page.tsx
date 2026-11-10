import React from 'react';
import StudentDashboardPage from '../page';

export function generateStaticParams() {
  return [
    { module: 'dashboard' },
    { module: 'certificate' },
    { module: 'profile' },
    { module: 'course' },
    { module: 'progress' },
    { module: 'schedule' },
    { module: 'attendance' },
    { module: 'fees' },
    { module: 'payments' },
    { module: 'licence' },
    { module: 'documents' },
    { module: 'notifications' },
    { module: 'help' },
    { module: 'settings' }
  ];
}

export default async function StudentModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  return <StudentDashboardPage initialModule={module || 'dashboard'} />;
}
