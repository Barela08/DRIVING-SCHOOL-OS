'use client';

import React from 'react';
import InstructorPortalPage from '../page';

export default function InstructorClientWrapper({ initialModule }: { initialModule: string }) {
  return <InstructorPortalPage initialModule={initialModule} />;
}