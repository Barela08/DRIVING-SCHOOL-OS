import type { Metadata } from 'next';
import './globals.css';
import { DrivingSchoolProvider } from '@/context/DrivingSchoolContext';
import { RoleSwitcher } from '@/components/RoleSwitcher';

export const metadata: Metadata = {
  title: 'Driving School OS — Digital Driving Academy & RTO Platform',
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
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
        <DrivingSchoolProvider>
          <RoleSwitcher />
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t border-slate-900 bg-slate-950/80 text-slate-500 text-xs py-6 px-4 no-print mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="font-semibold text-slate-400">Driving School OS</span> • Standard Product Specification v1.0
              </div>
              <div className="flex items-center gap-4 text-slate-400">
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
