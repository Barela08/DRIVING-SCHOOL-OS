import React, { Suspense } from 'react';
import InstructorPortalPage from '../page';

export function generateStaticParams() {
  return [
    { module: 'dashboard' },
    { module: 'students' },
    { module: 'find-student' },
    { module: 'today-classes' },
    { module: 'schedule' },
    { module: 'history' },
    { module: 'attendance' },
    { module: 'my-students' },
    { module: 'notifications' },
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
