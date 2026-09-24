import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../../types/auth';
import { DetectiveNavTab, DetectiveNotification } from '../../types/detective';
import { SfenLogo } from '../SfenLogo';
import { 
  Building2, 
  Bell, 
  LogOut, 
  Menu, 
  X, 
  CheckCheck, 
  Briefcase, 
  ClipboardList, 
  ArrowRightLeft, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  ChevronRight 
} from 'lucide-react';

interface DetectiveTopNavProps {
  user: UserProfile;
  activeTab: DetectiveNavTab;
  onNavigate: (tab: DetectiveNavTab) => void;
  onSignOut: () => void;
  unreadCount: number;
  notifications: DetectiveNotification[];
  onMarkNotificationAsRead: (id: string) => void;
  onMarkAllNotificationsAsRead: () => void;
  onOpenCaseByNumber?: (caseNumber: string, initialTab?: 'overview' | 'diary' | 'documents' | 'instructions' | 'movements' | 'audit') => void;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export const DetectiveTopNav: React.FC<DetectiveTopNavProps> = ({
  user,
  activeTab,
  onNavigate,
  onSignOut,
  unreadCount,
  notifications,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  onOpenCaseByNumber,
  isMobileMenuOpen,
  onToggleMobileMenu
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notifications popover on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    if (isNotifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotifOpen]);

  const handleNotificationClick = (item: DetectiveNotification) => {
    if (!item.read) {
      onMarkNotificationAsRead(item.id);
    }
    setIsNotifOpen(false);

    if (item.caseNumber && onOpenCaseByNumber) {
      const initialTab = item.type === 'INSTRUCTION' ? 'instructions' 
        : item.type === 'MOVEMENT' ? 'movements' 
        : 'overview';
      onOpenCaseByNumber(item.caseNumber, initialTab);
    } else {
      onNavigate('cases');
    }
  };

  const getNotifIcon = (type: DetectiveNotification['type']) => {
    switch (type) {
      case 'ASSIGNMENT':
        return <Briefcase size={14} className="text-amber-400" />;
      case 'INSTRUCTION':
        return <ClipboardList size={14} className="text-purple-400" />;
      case 'MOVEMENT':
        return <ArrowRightLeft size={14} className="text-blue-400" />;
      case 'REVIEW_DUE':
        return <AlertTriangle size={14} className="text-red-400" />;
      default:
        return <ShieldCheck size={14} className="text-emerald-400" />;
    }
  };

  return (
    <header id="detective-topbar" className="w-full bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 sm:px-6 py-3 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Hamburger + Brand & Portal Badge */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white md:hidden cursor-pointer"
            aria-label="Toggle detective menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 text-left focus:outline-none cursor-pointer group"
          >
            <SfenLogo size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight group-hover:text-amber-400 transition-colors">
                  SFEN
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                  Detective Service
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Secure File & Evidence Network • Criminal Investigation Directorate (CID)
              </p>
            </div>
          </button>
        </div>

        {/* Right: Station Indicator, Notifications Popover, User Badge, and Sign Out */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Configured Station Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
            <Building2 size={13} className="text-amber-400" />
            <span className="font-medium truncate max-w-[170px]">
              {user.station || 'SAPS Sandton Police Station'}
            </span>
          </div>

          {/* Interactive Notifications Popover */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              id="btn-detective-nav-notifications"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={`relative p-2 rounded-xl transition-all cursor-pointer ${
                isNotifOpen
                  ? 'bg-slate-800 text-amber-400 border border-amber-500/40 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
              title="Investigation Notifications"
              aria-label="Investigation Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Menu */}
            {isNotifOpen && (
              <div 
                id="detective-notifications-popover"
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 overflow-hidden animate-fade-in"
              >
                <div className="p-3.5 px-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Investigation Directives & Alerts</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={onMarkAllNotificationsAsRead}
                      className="text-[11px] text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <CheckCheck size={13} />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 space-y-1.5">
                      <Bell size={20} className="text-slate-600 mx-auto mb-1" />
                      <p className="font-semibold text-slate-300">No active alerts</p>
                      <p className="text-[11px] text-slate-500">
                        Case assignments, supervisor directives, and docket movements will appear here.
                      </p>
                    </div>
                  ) : (
                    notifications.slice(0, 8).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNotificationClick(item)}
                        className={`w-full text-left p-3.5 hover:bg-slate-800/60 transition-colors flex items-start gap-3 cursor-pointer ${
                          !item.read ? 'bg-amber-500/5' : ''
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-slate-800 shrink-0 mt-0.5">
                          {getNotifIcon(item.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-xs font-bold text-white truncate">
                              {item.title}
                            </span>
                            {!item.read && (
                              <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                            {item.message}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                            <Clock size={10} />
                            <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {item.caseNumber && (
                              <span className="text-amber-400">• {item.caseNumber}</span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                <div className="p-2.5 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 px-3">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <ShieldCheck size={13} className="text-amber-400" />
                    <span>Live Station Alerts</span>
                  </span>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={onMarkAllNotificationsAsRead}
                      className="text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Detective Profile Badge */}
          <div 
            onClick={() => onNavigate('profile')}
            className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group text-left"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow-xs">
              {user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <p className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors leading-tight">
                {user.fullName}
              </p>
              <p className="text-[10px] text-amber-300 font-mono">
                {user.rank} • {user.personnelNumber}
              </p>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            type="button"
            id="btn-detective-logout"
            onClick={onSignOut}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-rose-500/40 hover:bg-rose-500/10 text-slate-300 hover:text-rose-300 text-xs font-semibold transition-all cursor-pointer shadow-xs"
            title="Sign Out of Detective Workspace"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
