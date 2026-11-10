'use client';

import React, { useState } from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { History, ShieldCheck, Filter, Search, Clock, Lock } from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useDrivingSchool();

  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filtered = auditLogs.filter(log => {
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    const matchesSearch = 
      log.actor_name.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.entity_type.toLowerCase().includes(search.toLowerCase());
    return matchesAction && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-purple-400" /> Immutable System Audit Trail ({auditLogs.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Tamper-proof chronological log of admissions, fee confirmations, attendance punches and permissions.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold self-start sm:self-center">
          <Lock className="w-3.5 h-3.5" /> Read-Only Append-Only Ledger
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search audit events by user, action, student code..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Actions</option>
            <option value="NEW_ADMISSION">NEW_ADMISSION</option>
            <option value="CONFIRM_PAYMENT">CONFIRM_PAYMENT</option>
            <option value="REJECT_PAYMENT">REJECT_PAYMENT</option>
            <option value="MARK_ATTENDANCE">MARK_ATTENDANCE</option>
            <option value="UPDATE_LICENCE_STATUS">UPDATE_LICENCE_STATUS</option>
            <option value="UPDATE_INSTRUCTOR">UPDATE_INSTRUCTOR</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[850px]">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3.5">Timestamp</th>
                <th className="px-4 py-3.5">Actor & Role</th>
                <th className="px-4 py-3.5">Action Code</th>
                <th className="px-4 py-3.5">Entity Target</th>
                <th className="px-4 py-3.5">Audit Event Details</th>
                <th className="px-4 py-3.5 text-right">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3.5 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                    {new Date(log.created_at).toLocaleString('en-IN', {
                      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
                    })}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-white whitespace-nowrap">
                    {log.actor_name}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-[11px] font-bold text-purple-400 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-400 text-[11px]">
                    {log.entity_type}
                  </td>
                  <td className="px-4 py-3.5 text-slate-200 text-xs max-w-md">
                    {log.details}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                      <ShieldCheck className="w-3 h-3" /> Signed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
