import React from 'react';
import { DetectiveNavTab } from '../../types/detective';
import { 
  LayoutDashboard, 
  Briefcase, 
  UserCheck, 
  LogOut 
} from 'lucide-react';

interface DetectiveSidebarProps {
  activeTab: DetectiveNavTab;
  onSelectTab: (tab: DetectiveNavTab) => void;
  casesCount: number;
  outstandingInstructionsCount: number;
  onSignOut: () => void;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export const DetectiveSidebar: React.FC<DetectiveSidebarProps> = ({
  activeTab,
  onSelectTab,
  casesCount,
  outstandingInstructionsCount,
  onSignOut,
  isMobileDrawer = false,
  onCloseMobileDrawer
}) => {
  const handleNav = (tab: DetectiveNavTab) => {
    onSelectTab(tab);
    if (isMobileDrawer && onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };

  const isCasesOrDirectivesActive = activeTab === 'cases' || activeTab === 'instructions';

  const navItems: Array<{
    id: DetectiveNavTab;
    label: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeColor?: string;
    isActive: boolean;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      isActive: activeTab === 'dashboard'
    },
    {
      id: 'cases',
      label: 'Cases & Directives',
      icon: Briefcase,
      badge: outstandingInstructionsCount > 0 
        ? `${casesCount} • ${outstandingInstructionsCount} due`
        : casesCount,
      badgeColor: outstandingInstructionsCount > 0
        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
        : 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      isActive: isCasesOrDirectivesActive
    },
    {
      id: 'profile',
      label: 'Detective Profile',
      icon: UserCheck,
      isActive: activeTab === 'profile'
    }
  ];

  return (
    <aside 
      id={isMobileDrawer ? 'detective-mobile-drawer' : 'detective-desktop-sidebar'}
      className={`flex flex-col justify-between ${
        isMobileDrawer ? 'w-full py-2' : 'w-64 py-6 pr-4'
      }`}
    >
      <div className="space-y-6">
        {/* Navigation Group */}
        <nav className="space-y-1.5" aria-label="Detective branch navigation">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                id={`detective-nav-${item.id}`}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  item.isActive
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-900/60 hover:bg-slate-900 border border-transparent hover:border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon 
                    size={16} 
                    className={item.isActive ? 'text-white' : 'text-slate-400 group-hover:text-amber-400'} 
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      item.isActive 
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
          id="detective-sidebar-logout"
          onClick={onSignOut}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/40 text-slate-300 hover:text-rose-300 text-xs font-semibold transition-all cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-2">
            <LogOut size={15} />
            <span>Sign Out</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">End Session</span>
        </button>
      </div>
    </aside>
  );
};
