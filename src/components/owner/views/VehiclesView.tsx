'use client';

import React, { useState } from 'react';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { Vehicle } from '@/types';
import { Car, Plus, Wrench, ShieldAlert, CheckCircle2, AlertTriangle, Edit3 } from 'lucide-react';

interface VehiclesViewProps {
  onQuickAdd: (type: any) => void;
}

export const VehiclesView: React.FC<VehiclesViewProps> = ({ onQuickAdd }) => {
  const { vehicles, instructors, updateVehicle, addToast } = useDrivingSchool();

  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);

  const totalCount = vehicles.length;
  const availableCount = vehicles.filter(v => v.status === 'Available').length;
  const assignedCount = vehicles.filter(v => v.status === 'Assigned').length;
  const maintenanceCount = vehicles.filter(v => v.status === 'Under Maintenance').length;

  const handleStatusChange = async (veh: Vehicle, nextStatus: Vehicle['status']) => {
    await updateVehicle(veh.id, { status: nextStatus });
    addToast(`Vehicle ${veh.registration_number} status updated to ${nextStatus}!`, 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Car className="w-6 h-6 text-cyan-400" /> Academy Fleet & Maintenance Roster
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Statutory dual-pedal vehicle health, RTO fitness, PUC renewal alerts and driver assignments.
          </p>
        </div>
        <button
          onClick={() => onQuickAdd('vehicle')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition shadow-lg shadow-cyan-600/20 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
          <span className="text-slate-400 text-[10px] block">Total Fleet</span>
          <span className="text-xl font-black text-white tabular-nums mt-1 block">{totalCount} Cars</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
          <span className="text-slate-400 text-[10px] block">Available</span>
          <span className="text-xl font-black text-emerald-400 tabular-nums mt-1 block">{availableCount} Ready</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
          <span className="text-slate-400 text-[10px] block">Assigned / On Road</span>
          <span className="text-xl font-black text-blue-400 tabular-nums mt-1 block">{assignedCount} Active</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
          <span className="text-slate-400 text-[10px] block">Under Maintenance</span>
          <span className="text-xl font-black text-amber-400 tabular-nums mt-1 block">{maintenanceCount} Workshop</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
          <span className="text-slate-400 text-[10px] block">PUC Alerts Due</span>
          <span className="text-xl font-black text-rose-400 tabular-nums mt-1 block">1 Alert</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 text-center">
          <span className="text-slate-400 text-[10px] block">Dual Control Verified</span>
          <span className="text-xl font-black text-cyan-400 tabular-nums mt-1 block">100% RTO</span>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white">Academy Fleet Registry</h3>
        <div className="border border-slate-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[850px]">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Registration Plate</th>
                <th className="px-4 py-3">Brand & Model</th>
                <th className="px-4 py-3">Vehicle Type</th>
                <th className="px-4 py-3">Assigned Pilot</th>
                <th className="px-4 py-3">Insurance Expiry</th>
                <th className="px-4 py-3">PUC Expiry</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Maintenance Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {vehicles.map(veh => (
                <tr key={veh.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3 font-mono font-bold text-white">
                    {veh.registration_number}
                    {veh.is_dual_control && (
                      <span className="ml-2 px-1.5 py-0.2 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300">
                        Dual Control
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-200 font-medium">{veh.brand} {veh.model}</td>
                  <td className="px-4 py-3 text-slate-400">{veh.vehicle_type}</td>
                  <td className="px-4 py-3 font-semibold text-white">
                    {veh.assigned_instructor_name || <span className="text-slate-500 font-normal">Unassigned</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-300">{veh.insurance_expiry}</td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-amber-400">{veh.puc_expiry}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      veh.status === 'Assigned' ? 'bg-blue-500/20 text-blue-300' :
                      veh.status === 'Available' ? 'bg-emerald-500/20 text-emerald-300' :
                      'bg-amber-500/20 text-amber-300'
                    }`}>
                      {veh.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => handleStatusChange(veh, veh.status === 'Under Maintenance' ? 'Available' : 'Under Maintenance')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
                    >
                      {veh.status === 'Under Maintenance' ? 'Mark Operational' : 'Send to Workshop'}
                    </button>
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
