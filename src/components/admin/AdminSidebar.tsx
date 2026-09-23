import React from 'react';
import { AdminTab } from '../../types/admin';
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  UserCheck, 
  LogOut
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  userCount: number;
  personnelCount: number;
  onSignOut: () => void;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  userCount,
  personnelCount,
  onSignOut,
  isMobileDrawer = false,
  onCloseMobileDrawer
}) => {
  const handleNav = (tab: AdminTab) => {
    onSelectTab(tab);
    if (isMobileDrawer && onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };

  const navItems: Array<{
    id: AdminTab;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeColor?: string;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      badge: userCount,
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    },
    {
      id: 'activity',
      label: 'System Activity',
      icon: Activity
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: UserCheck
    }
  ];

  return (
    <aside 
      id={isMobileDrawer ? 'admin-mobile-drawer' : 'admin-desktop-sidebar'}
      className={`flex flex-col justify-between ${
        isMobileDrawer ? 'w-full py-2' : 'w-64 py-6 pr-4'
      }`}
    >
      <div className="space-y-6">
        {/* Navigation Group */}
        <nav className="space-y-1.5" aria-label="System Administrator navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`admin-nav-${item.id}`}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-900/60 hover:bg-slate-900 border border-transparent hover:border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon 
                    size={16} 
                    className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-purple-400'} 
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      isActive 
                        ? 'bg-white/20 text-white border-white/30' 
                        : item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout button at bottom of drawer/sidebar */}
      <div className="pt-4 border-t border-slate-800/80">
        <button
          type="button"
          id="admin-sidebar-logout"
          onClick={onSignOut}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 text-xs font-semibold transition-all cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-2">
            <LogOut size={15} />
            <span>Sign Out</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Exit Admin</span>
        </button>
      </div>
    </aside>
  );
};
