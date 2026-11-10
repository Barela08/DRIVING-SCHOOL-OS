import React, { Suspense } from 'react';
import OwnerDashboardPage from '../page';

export function generateStaticParams() {
  return [
    { module: 'dashboard' },
    { module: 'students' },
    { module: 'admissions' },
    { module: 'instructors' },
    { module: 'staff' },
    { module: 'courses' },
    { module: 'attendance' },
    { module: 'schedules' },
    { module: 'payments' },
    { module: 'licences' },
    { module: 'vehicles' },
    { module: 'reports' },
    { module: 'notifications' },
    { module: 'audit-logs' },
    { module: 'settings' },
    { module: 'certificates' }
  ];
}

export default async function OwnerModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  return (
    <Suspense fallback={null}>
      <OwnerDashboardPage initialModule={module || 'dashboard'} />
    </Suspense>
  );
}
