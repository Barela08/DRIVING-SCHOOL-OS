'use client';

import React from 'react';
import Link from 'next/link';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Award, 
  UserCheck, 
  BookOpen, 
  CheckCircle2, 
  Calendar, 
  IndianRupee, 
  FileCheck2, 
  Car, 
  FileText, 
  Bell, 
  BarChart3, 
  History, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  HelpCircle,
  ShieldCheck,
  X
} from 'lucide-react';

interface OwnerSidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const OwnerSidebar: React.FC<OwnerSidebarProps> = ({
  activeModule,
  setActiveModule,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const { school, currentUser, switchRole, notifications } = useDrivingSchool();
  const unreadCount = notifications.filter(n => !n.is_read).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'admissions', label: 'Admissions', icon: UserPlus },
    { id: 'instructors', label: 'Instructors / Drivers', icon: Award },
    { id: 'staff', label: 'Staff Management', icon: UserCheck },
    { id: 'courses', label: 'Courses & Sessions', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: CheckCircle2 },
    { id: 'schedule', label: 'Class Schedule', icon: Calendar },
    { id: 'finances', label: 'Fees & Payments', icon: IndianRupee },
    { id: 'licences', label: 'Driving Licence', icon: FileCheck2 },
    { id: 'vehicles', label: 'Vehicles & Fleet', icon: Car },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'audit', label: 'Audit Logs', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleNavClick = (id: string) => {
    setActiveModule(id);
    setIsMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#111E32] text-slate-200 border-r border-[#1E293B]">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#1E293B] flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-500 flex items-center justify-center text-white shadow-md shrink-0 font-bold">
            <Car className="w-5 h-5 stroke-[2.2]" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-white tracking-tight truncate leading-tight">
                {school.name}
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block mt-0.5">
                OWNER PANEL
              </span>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition group relative ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-[#14243A] hover:text-white'
              } ${isCollapsed ? 'justify-center px-2' : ''}`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
              {!isCollapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}
              {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                  {item.badge}
                </span>
              )}
              {isCollapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Profile & Settings */}
      <div className="p-3 border-t border-[#1E293B] space-y-2">
        <div className={`flex items-center gap-2.5 p-2 rounded-xl bg-[#0B1728] border border-[#1E293B] ${isCollapsed ? 'justify-center p-1.5' : ''}`}>
          <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-300 font-bold flex items-center justify-center text-xs shrink-0">
            {currentUser.full_name.charAt(0)}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-xs text-white block truncate leading-tight">
                {currentUser.full_name}
              </span>
              <span className="text-[10px] text-slate-400 capitalize block">Owner & Admin</span>
            </div>
          )}
        </div>

        {/* Collapse toggle (Desktop only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex w-full items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!isCollapsed && <span className="ml-2 text-[11px]">Collapse Menu</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className={`hidden lg:block fixed left-0 top-[88px] bottom-0 z-30 transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}>
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileOpen(false)} 
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-50">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
