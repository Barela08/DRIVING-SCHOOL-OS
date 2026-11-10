import type { Metadata } from 'next';
import './globals.css';
import { DrivingSchoolProvider } from '@/context/DrivingSchoolContext';

export const metadata: Metadata = {
  title: 'Model Driving Academy — Operating System for Model Driving Academy',
  description: 'Official portal of Model Driving Academy: RTO Authorized Driving Institute, structured 30-day course curriculum, dual-control fleet, and licensing management.',
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
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t border-[#1E293B] bg-[#070E1A] text-slate-400 text-xs py-6 px-4 no-print mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="font-bold text-white">Model Driving Academy</span> • Operating System for Model Driving Academy
              </div>
              <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                <span>Govt. RTO Authorized</span>
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
