import React, { Suspense } from 'react';
import StaffDashboardPage from '../page';

export function generateStaticParams() {
  return [
    { module: 'dashboard' },
    { module: 'admissions' },
    { module: 'students' },
    { module: 'instructors' },
    { module: 'courses' },
    { module: 'attendance' },
    { module: 'schedules' },
    { module: 'payments' },
    { module: 'licences' },
    { module: 'vehicles' },
    { module: 'notifications' },
    { module: 'profile' }
  ];
}

export default async function StaffModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  return (
    <Suspense fallback={null}>
      <StaffDashboardPage initialModule={module || 'dashboard'} />
    </Suspense>
  );
}
