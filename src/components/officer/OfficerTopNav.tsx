import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../../types/auth';
import { OfficerTab, OfficerNotification } from '../../types/officer';
import { SfenLogo } from '../SfenLogo';
import { 
  Building2, 
  Bell, 
  LogOut, 
  Menu, 
  X, 
  CheckCheck, 
  FileText, 
  ArrowRightLeft, 
  ShieldCheck, 
  Clock, 
  ChevronRight 
} from 'lucide-react';

interface OfficerTopNavProps {
  user: UserProfile;
  activeTab: OfficerTab;
  onNavigate: (tab: OfficerTab) => void;
  onSignOut: () => void;
  unreadCount: number;
  notifications: OfficerNotification[];
  onMarkNotificationAsRead: (id: string) => void;
  onMarkAllNotificationsAsRead: () => void;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export const OfficerTopNav: React.FC<OfficerTopNavProps> = ({
  user,
  activeTab,
  onNavigate,
  onSignOut,
  unreadCount,
  notifications,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
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

  const handleNotificationClick = (item: OfficerNotification) => {
    if (!item.read) {
      onMarkNotificationAsRead(item.id);
    }
    setIsNotifOpen(false);
    if (item.linkedTab === 'reports' || item.linkedTab === 'cases' || item.linkedTab === 'records') {
      onNavigate('records');
    } else if (item.linkedTab) {
      onNavigate(item.linkedTab);
    } else {
      onNavigate('records');
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'NEW_REPORT':
        return <FileText size={14} className="text-amber-400" />;
      case 'REPORT_UPDATE':
        return <FileText size={14} className="text-blue-400" />;
      case 'DOCKET_MOVEMENT':
        return <ArrowRightLeft size={14} className="text-emerald-400" />;
      default:
        return <ShieldCheck size={14} className="text-purple-400" />;
    }
  };

  return (
    <header id="officer-topbar" className="w-full bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 sm:px-6 py-3 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Hamburger + Brand & Portal Badge */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white md:hidden cursor-pointer"
            aria-label="Toggle officer menu"
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
                <span className="font-extrabold text-white text-base tracking-tight group-hover:text-blue-400 transition-colors">
                  SFEN
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
                  Police Official
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Secure File & Evidence Network • Police Station Intake
              </p>
            </div>
          </button>
        </div>

        {/* Right: Station Indicator, Notifications Popover, User Badge, and Sign Out */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Configured Station Indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
            <Building2 size={13} className="text-blue-400" />
            <span className="font-medium truncate max-w-[170px]">
              {user.station || 'SAPS Sandton Police Station'}
            </span>
          </div>

          {/* Interactive Notifications Popover */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              id="btn-officer-nav-notifications"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={`relative p-2 rounded-xl transition-all cursor-pointer ${
                isNotifOpen
                  ? 'bg-slate-800 text-blue-400 border border-blue-500/40 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
              title="Station Notifications"
              aria-label="Station Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[10px] flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Menu */}
            {isNotifOpen && (
              <div 
                id="officer-notifications-popover"
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 overflow-hidden animate-fade-in"
              >
                <div className="p-3.5 px-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Station Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={onMarkAllNotificationsAsRead}
                      className="text-[11px] text-slate-400 hover:text-blue-300 flex items-center gap-1 transition-colors cursor-pointer"
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
                      <p className="font-semibold text-slate-300">No operational notices</p>
                      <p className="text-[11px] text-slate-500">
                        Dispatches and citizen report updates will appear here.
                      </p>
                    </div>
                  ) : (
                    notifications.slice(0, 8).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNotificationClick(item)}
                        className={`w-full text-left p-3.5 hover:bg-slate-800/70 transition-colors flex items-start gap-3 cursor-pointer ${
                          !item.read ? 'bg-slate-950/40' : ''
                        }`}
                      >
                        <div className="mt-0.5 p-1.5 rounded-lg bg-slate-800 border border-slate-700/60 shrink-0">
                          {getNotifIcon(item.type)}
                        </div>

                        <div className="flex-1 min-w-0 space-y-0.5">
                          <div className="flex items-center justify-between gap-1">
                            <p className={`text-xs font-semibold truncate ${!item.read ? 'text-white' : 'text-slate-300'}`}>
                              {item.title}
                            </p>
                            {!item.read && (
                              <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                            {item.message}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                            <span className="flex items-center gap-1 font-mono">
                              <Clock size={10} />
                              <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </span>
                            <span className="text-blue-400 hover:underline flex items-center gap-0.5">
                              <span>View</span>
                              <ChevronRight size={10} />
                            </span>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                <div className="p-2.5 bg-slate-950/80 border-t border-slate-800 text-center">
                  <span className="text-[11px] text-slate-400">
                    Live station notices & operational activity
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Officer Profile Badge */}
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className={`hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-slate-900 border-blue-500/50 text-blue-300'
                : 'bg-slate-950 border-slate-800 text-left hover:border-slate-700'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow-xs">
              {user.fullName ? user.fullName.charAt(0) : 'O'}
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-white leading-tight">
                {user.fullName}
              </p>
              <p className="text-[10px] text-blue-300 font-mono">
                {user.rank || 'Officer'} • {user.personnelNumber}
              </p>
            </div>
          </button>

          {/* Single Explicit Sign Out Button */}
          <button
            type="button"
            id="btn-officer-logout"
            onClick={onSignOut}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-rose-500/40 hover:bg-rose-500/10 text-slate-300 hover:text-rose-300 text-xs font-semibold transition-all cursor-pointer shadow-xs"
            title="Sign Out of Police Session"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
