'use client';

import React, { useState } from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { TrendingUp, IndianRupee, Users, PieChart } from 'lucide-react';

export const AnalyticsCharts: React.FC = () => {
  const { students, courses, payments, enrollments } = useDrivingSchool();
  const [admissionsTimeframe, setAdmissionsTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [revenueTimeframe, setRevenueTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  // Revenue by payment method
  const upiTotal = payments
    .filter(p => p.payment_method === 'UPI' && p.status === 'Confirmed')
    .reduce((sum, p) => sum + p.amount, 0);

  const cashTotal = payments
    .filter(p => p.payment_method === 'Cash' && p.status === 'Confirmed')
    .reduce((sum, p) => sum + p.amount, 0);

  const bankTotal = payments
    .filter(p => (p.payment_method === 'Bank Transfer' || p.payment_method === 'Card') && p.status === 'Confirmed')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalCollected = upiTotal + cashTotal + bankTotal || 1;
  const upiPct = Math.round((upiTotal / totalCollected) * 100);
  const cashPct = Math.round((cashTotal / totalCollected) * 100);
  const bankPct = Math.round((bankTotal / totalCollected) * 100);

  // Mock monthly admissions trend
  const monthlyAdmissionsData = [
    { label: 'Jun', count: 12 },
    { label: 'Jul', count: 18 },
    { label: 'Aug', count: 24 },
    { label: 'Sep', count: 22 },
    { label: 'Oct', count: 28 },
    { label: 'Nov', count: 32 }
  ];

  // Mock monthly revenue trend (in thousands)
  const monthlyRevenueData = [
    { label: 'Jun', amount: 85 },
    { label: 'Jul', amount: 140 },
    { label: 'Aug', amount: 185 },
    { label: 'Sep', amount: 170 },
    { label: 'Oct', amount: 230 },
    { label: 'Nov', amount: 280 }
  ];

  const maxAdm = Math.max(...monthlyAdmissionsData.map(d => d.count));
  const maxRev = Math.max(...monthlyRevenueData.map(d => d.amount));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Student Admission Analytics */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Student Admission Analytics</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Enrollment growth and monthly trajectory</p>
            </div>
          </div>

          <div className="flex items-center bg-[#F5F7FB] dark:bg-[#0B1728] p-1 rounded-xl border border-[#E5EAF1] dark:border-[#1E293B] text-[11px] font-semibold">
            {(['daily', 'weekly', 'monthly'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setAdmissionsTimeframe(tf)}
                className={`px-2.5 py-1 rounded-lg capitalize transition ${
                  admissionsTimeframe === tf 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Bar Chart Visualization */}
        <div className="pt-4">
          <div className="h-44 flex items-end justify-between gap-3 px-2 border-b border-[#E5EAF1] dark:border-[#1E293B] pb-2">
            {monthlyAdmissionsData.map(d => {
              const heightPct = Math.round((d.count / maxAdm) * 100);
              return (
                <div key={d.label} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition">
                    {d.count}
                  </div>
                  <div 
                    className="w-full max-w-[36px] bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-xl transition-all duration-500 hover:brightness-110 shadow-sm"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[10px] font-medium text-slate-400">{d.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Course-wise Breakdown Footer */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728]">
            <span className="text-[10px] text-slate-400 block">4W Complete</span>
            <span className="font-bold text-slate-900 dark:text-white">68% Share</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728]">
            <span className="text-[10px] text-slate-400 block">2W Expert</span>
            <span className="font-bold text-slate-900 dark:text-white">20% Share</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#F5F7FB] dark:bg-[#0B1728]">
            <span className="text-[10px] text-slate-400 block">Combo Pack</span>
            <span className="font-bold text-slate-900 dark:text-white">12% Share</span>
          </div>
        </div>
      </div>

      {/* 2. Revenue Analytics & Payment Modes */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#111E32] border border-[#E5EAF1] dark:border-[#1E293B] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Revenue & Collections</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Monthly inflow and payment mode split</p>
            </div>
          </div>

          <div className="flex items-center bg-[#F5F7FB] dark:bg-[#0B1728] p-1 rounded-xl border border-[#E5EAF1] dark:border-[#1E293B] text-[11px] font-semibold">
            {(['daily', 'weekly', 'monthly'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setRevenueTimeframe(tf)}
                className={`px-2.5 py-1 rounded-lg capitalize transition ${
                  revenueTimeframe === tf 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Revenue Bars */}
        <div className="pt-4">
          <div className="h-44 flex items-end justify-between gap-3 px-2 border-b border-[#E5EAF1] dark:border-[#1E293B] pb-2">
            {monthlyRevenueData.map(d => {
              const heightPct = Math.round((d.amount / maxRev) * 100);
              return (
                <div key={d.label} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[10px] font-bold text-slate-600 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition">
                    ₹{d.amount}k
                  </div>
                  <div 
                    className="w-full max-w-[36px] bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-xl transition-all duration-500 hover:brightness-110 shadow-sm"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[10px] font-medium text-slate-400">{d.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Mode Distribution Multi-Bar */}
        <div className="space-y-2 pt-1 text-xs">
          <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
            <span>Mode Breakdown: UPI ({upiPct}%) • Cash ({cashPct}%) • Bank ({bankPct}%)</span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-800">
            <div style={{ width: `${upiPct}%` }} className="bg-blue-600 h-full" title={`UPI: ₹${upiTotal}`} />
            <div style={{ width: `${cashPct}%` }} className="bg-emerald-500 h-full" title={`Cash: ₹${cashTotal}`} />
            <div style={{ width: `${bankPct}%` }} className="bg-purple-500 h-full" title={`Bank: ₹${bankTotal}`} />
          </div>
        </div>
      </div>
    </div>
  );
};
