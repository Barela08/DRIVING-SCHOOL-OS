'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  Unlock, 
  RefreshCw, 
  Download, 
  Filter, 
  Search, 
  KeyRound, 
  Smartphone, 
  Globe, 
  EyeOff, 
  CheckCircle2, 
  Clock,
  Flame
} from 'lucide-react';
import { SecurityLog } from '@/types';

export const SecurityView: React.FC = () => {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [stats, setStats] = useState({
    totalLogins24h: 0,
    failedLogins24h: 0,
    lockouts24h: 0,
    rateLimitExceeded24h: 0,
    activeLockoutsCount: 0
  });
  const [activeLockouts, setActiveLockouts] = useState<{ key: string; lockoutRemainingSeconds: number; attempts: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventType, setSelectedEventType] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [actionMessage, setActionMessage] = useState<string>('');

  const fetchSecurityData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/security-logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
        setStats(data.stats || {
          totalLogins24h: 0,
          failedLogins24h: 0,
          lockouts24h: 0,
          rateLimitExceeded24h: 0,
          activeLockoutsCount: 0
        });
        setActiveLockouts(data.lockouts || []);
      }
    } catch (err) {
      console.error('Failed to fetch security logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSecurityData();
    const interval = setInterval(fetchSecurityData, 15000); // 15s refresh
    return () => clearInterval(interval);
  }, []);

  const handleClearAllLockouts = async () => {
    if (!confirm('Are you sure you want to clear all active account and IP lockouts?')) return;
    try {
      const res = await fetch('/api/auth/security-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear_all_lockouts' })
      });
      if (res.ok) {
        setActionMessage('All active temporary lockouts have been cleared.');
        fetchSecurityData();
        setTimeout(() => setActionMessage(''), 4000);
      }
    } catch {
      alert('Failed to clear lockouts.');
    }
  };

  const handleUnlockKey = async (key: string) => {
    try {
      const res = await fetch('/api/auth/security-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear_lockout', key })
      });
      if (res.ok) {
        setActionMessage(`Unlocked ${key}`);
        fetchSecurityData();
        setTimeout(() => setActionMessage(''), 3000);
      }
    } catch {
      alert('Failed to unlock target.');
    }
  };

  const handleExportCSV = () => {
    if (logs.length === 0) return;
    const headers = ['Timestamp (IST)', 'Event Type', 'Masked Identifier', 'Client IP', 'Status', 'Severity', 'User Agent'];
    const rows = logs.map(l => [
      `"${new Date(l.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}"`,
      `"${l.event_type}"`,
      `"${l.masked_identifier}"`,
      `"${l.ip_address}"`,
      `"${l.status}"`,
      `"${l.severity}"`,
      `"${l.user_agent.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `model_driving_security_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.masked_identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ip_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.event_type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedEventType === 'ALL' || log.event_type === selectedEventType;
    const matchesSeverity = selectedSeverity === 'ALL' || log.severity === selectedSeverity;

    return matchesSearch && matchesType && matchesSeverity;
  });

  const getEventBadge = (type: string) => {
    switch (type) {
      case 'LOGIN_SUCCESS':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"><CheckCircle2 className="w-3 h-3" /> Login Success</span>;
      case 'LOGIN_FAILURE':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30"><AlertTriangle className="w-3 h-3" /> Failed Login</span>;
      case 'TEMPORARY_LOCKOUT':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-500/15 text-red-400 border border-red-500/30"><Lock className="w-3 h-3" /> Account Lockout</span>;
      case 'RATE_LIMIT_EXCEEDED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30"><Flame className="w-3 h-3" /> Rate Limited</span>;
      case 'OTP_ABUSE':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30"><Smartphone className="w-3 h-3" /> OTP Abuse</span>;
      case 'PASSWORD_RESET_REQUESTED':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30"><KeyRound className="w-3 h-3" /> Password Reset</span>;
      case 'ACCOUNT_DISABLED_ATTEMPT':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-950 text-red-300 border border-red-800"><ShieldAlert className="w-3 h-3" /> Disabled Account</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">{type}</span>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-red-600 text-white">Critical</span>;
      case 'danger':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">Danger</span>;
      case 'warning':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">Warning</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">Info</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Security & Authentication Monitoring
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time server threat monitoring, atomic rate limiting policies, and audit logs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={fetchSecurityData}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#111E32] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {activeLockouts.length > 0 && (
            <button
              onClick={handleClearAllLockouts}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-amber-600/20"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Clear All Lockouts</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-600/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111E32] border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Total Logins (24h)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {stats.totalLogins24h}
          </div>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            Authenticated via Server
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111E32] border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Failed Attempts (24h)</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {stats.failedLogins24h}
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            Rate limit counters triggered
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111E32] border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Active Lockouts</span>
            <Lock className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {activeLockouts.length}
          </div>
          <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">
            Temporarily blocked accounts/IPs
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111E32] border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <span>Rate-Limit Blocks (24h)</span>
            <Flame className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {stats.rateLimitExceeded24h}
          </div>
          <p className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
            Automated threshold guards
          </p>
        </div>
      </div>

      {/* Active Lockouts Alert (if any) */}
      {activeLockouts.length > 0 && (
        <div className="p-5 rounded-3xl bg-red-500/10 border border-red-500/30 text-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-400" />
              <h3 className="font-bold text-sm text-red-200">
                Active Temporary Lockouts ({activeLockouts.length})
              </h3>
            </div>
            <span className="text-[11px] text-red-300">
              Auto-expires after configured 15m window
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeLockouts.map(item => (
              <div key={item.key} className="p-3 rounded-2xl bg-[#0B1728] border border-red-500/30 flex items-center justify-between">
                <div>
                  <span className="font-mono text-xs text-white block">{item.key}</span>
                  <span className="text-[10px] text-slate-400">
                    Remaining: {Math.floor(item.lockoutRemainingSeconds / 60)}m {item.lockoutRemainingSeconds % 60}s ({item.attempts} attempts)
                  </span>
                </div>
                <button
                  onClick={() => handleUnlockKey(item.key)}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-red-400 text-xs font-bold transition"
                >
                  Unlock
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rate Limiting Policy Summary Panel */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#111E32] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          <span>Active Server-Enforced Rate Limiting Policies</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 text-[10px] block">Login Failures / Account</span>
            <span className="font-black text-slate-900 dark:text-white text-sm">5 attempts</span>
            <span className="text-[10px] text-slate-400 block">in 15 minutes</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 text-[10px] block">Login Failures / IP</span>
            <span className="font-black text-slate-900 dark:text-white text-sm">20 attempts</span>
            <span className="text-[10px] text-slate-400 block">in 15 minutes</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 text-[10px] block">OTP Generation</span>
            <span className="font-black text-slate-900 dark:text-white text-sm">3 requests</span>
            <span className="text-[10px] text-slate-400 block">in 15 minutes</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 text-[10px] block">OTP Verification</span>
            <span className="font-black text-slate-900 dark:text-white text-sm">5 attempts</span>
            <span className="text-[10px] text-slate-400 block">per active OTP</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 text-[10px] block">Password Reset</span>
            <span className="font-black text-slate-900 dark:text-white text-sm">3 requests</span>
            <span className="text-[10px] text-slate-400 block">per hour</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B1728] border border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 text-[10px] block">CAPTCHA Threshold</span>
            <span className="font-black text-slate-900 dark:text-white text-sm">3 failures</span>
            <span className="text-[10px] text-slate-400 block">triggers math challenge</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#111E32] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search masked ID or IP address..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1728] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedEventType}
            onChange={(e) => setSelectedEventType(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1728] border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Event Types</option>
            <option value="LOGIN_SUCCESS">Login Success</option>
            <option value="LOGIN_FAILURE">Login Failure</option>
            <option value="TEMPORARY_LOCKOUT">Temporary Lockouts</option>
            <option value="RATE_LIMIT_EXCEEDED">Rate Limit Exceeded</option>
            <option value="OTP_ABUSE">OTP Abuse</option>
            <option value="PASSWORD_RESET_REQUESTED">Password Reset Requests</option>
            <option value="ACCOUNT_DISABLED_ATTEMPT">Disabled Account Attempts</option>
          </select>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0B1728] border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="danger">Danger</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Security Logs Audit Table */}
      <div className="rounded-3xl bg-white dark:bg-[#111E32] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <h3 className="font-black text-sm text-slate-900 dark:text-white">
              Security Activity & Audit Trail ({filteredLogs.length})
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Masked identifiers • Zero credentials stored
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#0B1728] text-slate-500 dark:text-slate-400 text-[11px] font-bold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Timestamp (IST)</th>
                <th className="py-3 px-4">Event Type</th>
                <th className="py-3 px-4">Masked Account</th>
                <th className="py-3 px-4">Client IP</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Device & Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No security events matching current criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                      {new Date(log.created_at).toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        hour12: true,
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getEventBadge(log.event_type)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono font-bold text-slate-900 dark:text-white">
                      {log.masked_identifier}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-mono text-slate-500 dark:text-slate-400">
                      {log.ip_address}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getSeverityBadge(log.severity)}
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-[11px] text-slate-400">
                      <span className="block truncate">{log.user_agent}</span>
                      {log.details && Object.keys(log.details).length > 0 && (
                        <span className="text-[10px] text-slate-500 font-mono">
                          {JSON.stringify(log.details)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
