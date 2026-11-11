'use client';

import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Search, 
  Clock, 
  Calendar, 
  History, 
  Users, 
  Bell, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  LogOut,
  Car,
  X
} from 'lucide-react';
import { InstructorNavModule } from '@/types';

interface InstructorSidebarProps {
  activeModule: string;
  onSelectModule: (module: InstructorNavModule) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  unreadNotificationsCount?: number;
  onLogout: () => void;
}

export const InstructorSidebar: React.FC<InstructorSidebarProps> = ({
  activeModule,
  onSelectModule,
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  unreadNotificationsCount = 0,
  onLogout
}) => {
  // Exact 8-Item Navigation matching Part 14
  const navItems: {
    id: InstructorNavModule;
    label: string;
    icon: any;
    badge?: number;
    description: string;
  }[] = [
    {
      id: 'dashboard',
      label: '1. Dashboard',
      icon: LayoutDashboard,
      description: 'Time-slot overview & summary'
    },
    {
      id: 'students',
      label: '2. Students',
      icon: Search,
      description: 'Student ID search & check-in'
    },
    {
      id: 'today-classes',
      label: "3. Today's Classes",
      icon: Clock,
      description: 'Time-slot-wise student lists'
    },
    {
      id: 'schedule',
      label: '4. My Schedule',
      icon: Calendar,
      description: 'Daily and weekly roster'
    },
    {
      id: 'history',
      label: '5. Attendance History',
      icon: History,
      description: 'Logged training sessions'
    },
    {
      id: 'my-students',
      label: '6. My Students',
      icon: Users,
      description: 'Assigned learner roster'
    },
    {
      id: 'notifications',
      label: '7. Notifications',
      icon: Bell,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
      description: 'Schedule updates & alerts'
    },
    {
      id: 'profile',
      label: '8. My Profile',
      icon: User,
      description: 'Account & car credentials'
    }
  ];

  const handleNavClick = (id: InstructorNavModule) => {
    onSelectModule(id);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#111E32] text-slate-100 border-r border-[#1E293B] shadow-2xl select-none">
      {/* Navigation Links */}
      <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeModule === item.id || 
            (item.id === 'students' && activeModule === 'find-student');

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              title={collapsed ? `${item.label} — ${item.description}` : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold transition group ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                  : 'text-slate-300 hover:bg-[#14243A] hover:text-white'
              } ${collapsed ? 'justify-center px-2' : ''}`}
            >
              <div className="relative shrink-0">
                <Icon className="w-4 h-4" />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#111E32]" />
                )}
              </div>

              {!collapsed && (
                <div className="flex-1 flex items-center justify-between text-left truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer: Collapse and Logout Buttons */}
      <div className="p-3 border-t border-[#1E293B] space-y-1">
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex w-full items-center justify-center gap-2 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-medium transition"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span className="text-[11px]">Collapse Menu</span>}
        </button>

        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 text-xs font-semibold transition ${
            collapsed ? 'justify-center' : ''
          }`}
          title="Sign out of instructor portal"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Left Sidebar */}
      <aside
        className={`hidden lg:block fixed left-0 top-16 bottom-0 z-20 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] z-50 shadow-2xl flex flex-col">
            <div className="p-4 bg-[#111E32] text-white border-b border-[#1E293B] flex items-center justify-between">
              <span className="font-bold text-sm">Instructor Menu</span>
              <button
                onClick={onCloseMobile}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              {sidebarContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
