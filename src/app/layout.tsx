import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { DrivingSchoolProvider } from '@/context/DrivingSchoolContext';
import { RoleSwitcher } from '@/components/RoleSwitcher';

export const metadata: Metadata = {
  title: 'Driving School OS — Complete Driving Academy Management System',
  description: 'Enterprise driving academy management: admissions, atomic 1-click instructor attendance, fee ledger, fleet management, and RTO LL/DL tracking.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0B1728] text-slate-100 selection:bg-blue-600 selection:text-white">
        <DrivingSchoolProvider>
          <Suspense fallback={null}>
            <RoleSwitcher />
          </Suspense>
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t border-[#1E293B] bg-[#070E1A] text-slate-400 text-xs py-6 px-4 no-print mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="font-bold text-white">Driving School OS</span> • Version 1.0 (India Standard)
              </div>
              <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                <span>Supabase PostgreSQL + RLS Enabled</span>
                <span>•</span>
                <span>Currency: INR (₹)</span>
                <span>•</span>
                <span>Timezone: Asia/Kolkata</span>
              </div>
            </div>
          </footer>
        </DrivingSchoolProvider>
      </body>
    </html>
  );
}
