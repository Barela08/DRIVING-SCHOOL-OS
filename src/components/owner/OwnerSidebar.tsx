'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useDrivingSchool } from '@/context/DrivingSchoolContext';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Award, 
  Users2, 
  BookOpen, 
  CheckCircle2, 
  Calendar, 
  IndianRupee, 
  FileCheck2, 
  Wrench, 
  FolderKanban, 
  Bell, 
  BarChart3, 
  History, 
  Settings,
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  HelpCircle, 
  Car,
  ShieldAlert,
  X
} from 'lucide-react';

export type OwnerNavSection = 
  | 'dashboard'
  | 'students'
  | 'admissions'
  | 'instructors'
  | 'staff'
  | 'courses'
  | 'attendance'
  | 'schedule'
  | 'finances'
  | 'licences'
  | 'fleet'
  | 'documents'
  | 'notifications'
  | 'reports'
  | 'audit'
  | 'settings'
  | 'certificates'
  | 'security';

export interface OwnerSidebarProps {
  activeSection: OwnerNavSection;
  onSelectSection: (section: OwnerNavSection) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenHelp?: () => void;
  onLogout?: () => void;
}

export const OwnerSidebar: React.FC<OwnerSidebarProps> = ({
  activeSection,
  onSelectSection,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  onOpenHelp,
  onLogout
}) => {
  const { school, currentUser, notifications } = useDrivingSchool();
  const unreadCount = notifications.filter(n => !n.is_read).length;

  const navItems: { id: OwnerNavSection; label: string; icon: any; badge?: number }[] = [
    { id: 'dashboard', label: '1. Dashboard', icon: LayoutDashboard },
    { id: 'students', label: '2. Students', icon: Users },
    { id: 'admissions', label: '3. Admissions', icon: UserPlus },
    { id: 'instructors', label: '4. Instructors / Drivers', icon: Award },
    { id: 'staff', label: '5. Staff Management', icon: Users2 },
    { id: 'courses', label: '6. Courses & Sessions', icon: BookOpen },
    { id: 'attendance', label: '7. Attendance', icon: CheckCircle2 },
    { id: 'schedule', label: '8. Class Schedule', icon: Calendar },
    { id: 'finances', label: '9. Fees & Payments', icon: IndianRupee },
    { id: 'licences', label: '10. Driving Licence', icon: FileCheck2 },
    { id: 'fleet', label: '11. Vehicles & Maintenance', icon: Wrench },
    { id: 'documents', label: '12. Documents', icon: FolderKanban },
    { id: 'notifications', label: '13. Notifications', icon: Bell, badge: unreadCount },
    { id: 'reports', label: '14. Reports & Analytics', icon: BarChart3 },
    { id: 'audit', label: '15. Audit Logs', icon: History },
    { id: 'settings', label: '16. Settings', icon: Settings },
    { id: 'certificates', label: '17. Certificates & Reviews', icon: Award },
    { id: 'security', label: '18. Security & Auth Monitoring', icon: ShieldAlert },
  ];

  const handleNavClick = (section: OwnerNavSection) => {
    onSelectSection(section);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#111E32] text-slate-100 border-r border-[#1E293B] shadow-2xl select-none">
      {/* Top Brand Header */}
      <div className="p-4 border-b border-[#1E293B] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 shrink-0 overflow-hidden">
            {school.logo_url ? <img src={school.logo_url} alt="School logo" className="w-full h-full object-contain bg-white" /> : <Car className="w-5 h-5 stroke-[2.5]" />}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <span className="font-black text-sm text-white tracking-tight truncate block">
                {school.name}
              </span>
              <span className="inline-block px-2 py-0.5 mt-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
                OWNER PANEL
              </span>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
              } ${collapsed ? 'justify-center px-2' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              
              {!collapsed && (
                <div className="flex-1 flex items-center justify-between min-w-0 text-left">
                  <span className="truncate">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}

              {/* Collapsed Badge Indicator */}
              {collapsed && item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-[#111E32]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Profile & Actions */}
      <div className="p-3 border-t border-[#1E293B] shrink-0 space-y-2 bg-[#0B1728]/50">
        {/* Owner Profile Card */}
        <div 
          onClick={() => handleNavClick('settings')}
          className={`flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/60 transition cursor-pointer ${collapsed ? 'justify-center' : ''}`}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md shrink-0">
            {currentUser.full_name.charAt(0)}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-white block truncate leading-tight">
                {currentUser.full_name}
              </span>
              <span className="text-[10px] text-slate-400 block truncate">
                Super Admin • Owner
              </span>
            </div>
          )}
        </div>

        {/* Secondary buttons */}
        {!collapsed && (
          <div className="grid grid-cols-2 gap-1 pt-1 text-[11px] font-medium text-slate-400">
            {onOpenHelp && (
              <button
                onClick={onOpenHelp}
                className="flex items-center justify-center gap-1.5 p-2 rounded-lg hover:text-white hover:bg-slate-800/60 transition"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Help & Docs</span>
              </button>
            )}
            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center justify-center gap-1.5 p-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside 
        className={`hidden lg:block fixed top-0 bottom-0 left-0 z-30 transition-all duration-300 no-print ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm animate-in fade-in"
          onClick={onCloseMobile}
        >
          <div 
            className="w-72 max-w-[85vw] h-full"
            onClick={e => e.stopPropagation()}
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
