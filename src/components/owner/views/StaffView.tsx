'use client';

import React, { useState } from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { StaffMember } from '@/types';
import { Users2, UserPlus, ShieldCheck, Check, X, Clock, Mail, Phone, Settings } from 'lucide-react';

interface StaffViewProps {
  onQuickAdd: (type: any) => void;
}

export const StaffView: React.FC<StaffViewProps> = ({ onQuickAdd }) => {
  const { staffMembers, updateStaff, addToast } = useDrivingSchool();

  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  const activeStaffCount = staffMembers.filter(s => s.is_active).length;
  const inactiveStaffCount = staffMembers.length - activeStaffCount;

  const handleToggleActive = async (staff: StaffMember) => {
    await updateStaff(staff.id, { is_active: !staff.is_active });
    addToast(`Staff account ${staff.full_name} ${!staff.is_active ? 'Activated' : 'Suspended'}.`, 'info');
  };

  const handlePermissionChange = async (staff: StaffMember, permKey: string, value: boolean) => {
    const updated = {
      ...staff.permissions,
      [permKey]: value
    };
    await updateStaff(staff.id, { permissions: updated });
    addToast(`Updated permissions for ${staff.full_name}`, 'success');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users2 className="w-6 h-6 text-indigo-400" /> Staff & Desk Personnel Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure desk executive roles, granular permissions, and account authorization states.
          </p>
        </div>
        <button
          onClick={() => onQuickAdd('staff')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/20 self-start sm:self-center"
        >
          <UserPlus className="w-4 h-4" /> Add Staff Member
        </button>
      </div>

      {/* Staff KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-slate-400 text-xs font-semibold block">Total Registered Staff</span>
          <span className="text-2xl font-black text-white tabular-nums mt-1 block">{staffMembers.length} Employees</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-slate-400 text-xs font-semibold block">Active Accounts</span>
          <span className="text-2xl font-black text-emerald-400 tabular-nums mt-1 block">{activeStaffCount} Active</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <span className="text-slate-400 text-xs font-semibold block">Suspended / Inactive</span>
          <span className="text-2xl font-black text-slate-400 tabular-nums mt-1 block">{inactiveStaffCount} Suspended</span>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white">Staff Roster & Granular Permissions</h3>
        
        <div className="border border-slate-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[850px]">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Staff Name</th>
                <th className="px-4 py-3">Employee ID</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Assigned Permissions</th>
                <th className="px-4 py-3">Last Login</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {staffMembers.map(stf => (
                <tr key={stf.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3">
                    <span className="font-bold text-white block">{stf.full_name}</span>
                    <span className="text-[10px] text-indigo-400 block mt-0.5">{stf.role_title}</span>
                  </td>
                  <td className="px-4 py-3 font-mono font-semibold text-slate-300">{stf.employee_code}</td>
                  <td className="px-4 py-3">
                    <span className="text-slate-200 block">{stf.phone}</span>
                    <span className="text-[10px] text-slate-400 block">{stf.email}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {stf.permissions.can_admit_students && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-blue-500/20 text-blue-300">
                          Admissions
                        </span>
                      )}
                      {stf.permissions.can_manage_fees && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300">
                          Fees
                        </span>
                      )}
                      {stf.permissions.can_confirm_payments && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300">
                          Confirm Pay
                        </span>
                      )}
                      {stf.permissions.can_manage_licences && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300">
                          Licence
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {stf.last_login ? new Date(stf.last_login).toLocaleDateString('en-IN') : 'Recent'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      stf.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      {stf.is_active ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => setSelectedStaff(stf)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                    >
                      Permissions
                    </button>
                    <button
                      onClick={() => handleToggleActive(stf)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                        stf.is_active 
                          ? 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-300'
                          : 'bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300'
                      }`}
                    >
                      {stf.is_active ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Edit Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h4 className="font-bold text-white text-sm">{selectedStaff.full_name}</h4>
                <span className="text-[11px] text-slate-400">{selectedStaff.role_title}</span>
              </div>
              <button onClick={() => setSelectedStaff(null)} className="p-1 rounded text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              <span className="font-bold text-white block">Toggle Role Permissions:</span>
              {Object.entries(selectedStaff.permissions).map(([key, val]) => (
                <label key={key} className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer">
                  <span className="text-slate-300 font-medium capitalize">
                    {key.replace(/can_/g, '').replace(/_/g, ' ')}
                  </span>
                  <input
                    type="checkbox"
                    checked={val}
                    onChange={e => {
                      handlePermissionChange(selectedStaff, key, e.target.checked);
                      setSelectedStaff({
                        ...selectedStaff,
                        permissions: { ...selectedStaff.permissions, [key]: e.target.checked }
                      });
                    }}
                    className="rounded bg-slate-900 border-slate-700 text-blue-600"
                  />
                </label>
              ))}
            </div>

            <div className="border-t border-slate-800 pt-3 flex justify-end">
              <button
                onClick={() => setSelectedStaff(null)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
