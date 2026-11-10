import React, { Suspense } from 'react';
import InstructorPortalPage from '../page';

export function generateStaticParams() {
  return [
    { module: 'dashboard' },
    { module: 'find-student' },
    { module: 'students' },
    { module: 'attendance' },
    { module: 'history' },
    { module: 'schedule' },
    { module: 'profile' }
  ];
}

export default async function InstructorModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  return (
    <Suspense fallback={null}>
      <InstructorPortalPage initialModule={module || 'dashboard'} />
    </Suspense>
  );
}
