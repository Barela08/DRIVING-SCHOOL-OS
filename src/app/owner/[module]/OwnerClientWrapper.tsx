'use client';

import React from 'react';
import OwnerDashboardPage from '../page';

export default function OwnerClientWrapper({ initialModule }: { initialModule: string }) {
  return <OwnerDashboardPage initialModule={initialModule} />;
}