import React from 'react';
import { CommanderNavTab } from '../../types/commander';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  AlertCircle, 
  Bell, 
  UserCheck, 
  LogOut,
  Shield,
  FileCheck2,
  Lock
} from 'lucide-react';

interface CommanderSidebarProps {
  activeTab: CommanderNavTab;
  onNavigate: (tab: CommanderNavTab) => void;
  onSignOut: () => void;
  casesCount: number;
  unassignedCasesCount: number;
  detectivesCount: number;
  pendingComplaintsCount: number;
  unreadNotificationsCount: number;
  onCloseMobileDrawer?: () => void;
}

export const CommanderSidebar: React.FC<CommanderSidebarProps> = ({
  activeTab,
  onNavigate,
  onSignOut,
  casesCount,
  unassignedCasesCount,
  detectivesCount,
  pendingComplaintsCount,
  unreadNotificationsCount,
  onCloseMobileDrawer
}) => {
  const handleNavClick = (tab: CommanderNavTab) => {
    onNavigate(tab);
    if (onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };

  const navItems = [
    {
      id: 'dashboard' as CommanderNavTab,
      label: 'Dashboard',
      icon: <LayoutDashboard size={18} />,
      badge: null
    },
    {
      id: 'cases' as CommanderNavTab,
      label: 'Cases',
      icon: <Briefcase size={18} />,
      badge: unassignedCasesCount > 0 ? (
        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
          {unassignedCasesCount} unassigned
        </span>
      ) : (
        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-400">
          {casesCount}
        </span>
      )
    },
    {
      id: 'detectives' as CommanderNavTab,
      label: 'Detectives',
      icon: <Users size={18} />,
      badge: (
        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-800 text-slate-400">
          {detectivesCount}
        </span>
      )
    },
    {
      id: 'complaints' as CommanderNavTab,
      label: 'Complaints',
      icon: <AlertCircle size={18} />,
      badge: pendingComplaintsCount > 0 ? (
        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">
          {pendingComplaintsCount} new
        </span>
      ) : null
    },
    {
      id: 'notifications' as CommanderNavTab,
      label: 'Notifications',
      icon: <Bell size={18} />,
      badge: unreadNotificationsCount > 0 ? (
        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-emerald-500 text-slate-950">
          {unreadNotificationsCount}
        </span>
      ) : null
    },
    {
      id: 'profile' as CommanderNavTab,
      label: 'Profile',
      icon: <UserCheck size={18} />,
      badge: null
    }
  ];

  return (
    <aside className="w-full h-full flex flex-col justify-between py-5 px-3 bg-slate-900 border-r border-slate-800/80">
      
      {/* Navigation Links */}
      <div className="space-y-6">
        <div>
          <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
            <span>Supervisory Navigation</span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-commander-${item.id}`}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-emerald-400' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge}
                </button>
              );
            })}
          </nav>
        </div>

        {/* SFEN Station Accountability Standard */}
        <div className="px-3 py-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-400">
            <Lock size={13} />
            <span className="text-[11px] font-bold">SFEN Station Seal</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            All supervisor directives, docket transfers, and review sign-offs are cryptographically sealed.
          </p>
        </div>
      </div>

      {/* Bottom Logout Button */}
      <div className="pt-4 border-t border-slate-800/80">
        <button
          type="button"
          id="btn-commander-sidebar-logout"
          onClick={() => {
            if (onCloseMobileDrawer) onCloseMobileDrawer();
            onSignOut();
          }}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 transition-all cursor-pointer"
        >
          <LogOut size={16} />
          <span>Sign Out / End Command</span>
        </button>
      </div>

    </aside>
  );
};
