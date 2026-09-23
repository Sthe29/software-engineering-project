import React, { useState, useRef, useEffect } from 'react';
import { SfenLogo } from '../SfenLogo';
import { CitizenProfile } from '../../types/auth';
import { ComplainantTab, ComplainantNotification } from '../../types/complainant';
import { markAllNotificationsAsRead, markNotificationAsRead } from '../../services/complainantService';
import { 
  Bell, 
  LogOut, 
  Menu, 
  X, 
  Shield, 
  Briefcase, 
  FileText, 
  AlertCircle, 
  CheckCheck,
  ChevronRight,
  Clock
} from 'lucide-react';

interface ComplainantTopNavProps {
  citizen: CitizenProfile;
  activeTab: ComplainantTab;
  onSelectTab: (tab: ComplainantTab) => void;
  unreadCount: number;
  notifications?: ComplainantNotification[];
  onRefreshNotifications?: () => void;
  onSignOut: () => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export const ComplainantTopNav: React.FC<ComplainantTopNavProps> = ({
  citizen,
  activeTab,
  onSelectTab,
  unreadCount,
  notifications = [],
  onRefreshNotifications,
  onSignOut,
  mobileMenuOpen,
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

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead(citizen.id);
    if (onRefreshNotifications) {
      onRefreshNotifications();
    }
  };

  const handleNotificationClick = (item: ComplainantNotification) => {
    markNotificationAsRead(item.id);
    if (onRefreshNotifications) {
      onRefreshNotifications();
    }
    setIsNotifOpen(false);

    if (item.linkedTab) {
      onSelectTab(item.linkedTab);
    } else if (item.type === 'case') {
      onSelectTab('my-cases');
    } else if (item.type === 'report') {
      onSelectTab('my-reports');
    } else if (item.type === 'complaint') {
      onSelectTab('complaints');
    } else {
      onSelectTab('my-records');
    }
  };

  const getNotifIcon = (type: ComplainantNotification['type']) => {
    switch (type) {
      case 'case':
        return <Briefcase size={14} className="text-blue-400" />;
      case 'report':
        return <FileText size={14} className="text-emerald-400" />;
      case 'complaint':
        return <AlertCircle size={14} className="text-amber-400" />;
      case 'security':
      default:
        return <Shield size={14} className="text-indigo-400" />;
    }
  };

  return (
    <header 
      id="complainant-top-navbar"
      className="sticky top-0 z-40 w-full bg-slate-950/95 border-b border-slate-800/90 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-3 text-left focus:outline-none cursor-pointer group"
          >
            <SfenLogo size="sm" />
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight group-hover:text-emerald-400 transition-colors">
                  SFEN
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                  Citizen Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none">
                Secure File & Evidence Network
              </p>
            </div>
          </button>
        </div>

        {/* Right: Notifications, User info, Logout */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Notifications Bell Button & Popover */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              id="btn-nav-notifications"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className={`relative p-2 rounded-xl transition-all cursor-pointer ${
                isNotifOpen
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/40 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
              }`}
              title="Notifications & Updates"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Popover */}
            {isNotifOpen && (
              <div 
                id="notifications-popover"
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 overflow-hidden animate-fade-in"
              >
                {/* Header */}
                <div className="p-3.5 px-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="text-[11px] text-slate-400 hover:text-emerald-300 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <CheckCheck size={13} />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-400 space-y-1.5">
                      <Bell size={20} className="text-slate-600 mx-auto mb-1" />
                      <p className="font-semibold text-slate-300">No notifications yet</p>
                      <p className="text-[11px] text-slate-500">
                        Updates on case dockets and report reviews will appear here.
                      </p>
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((item) => (
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
                              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                            {item.message}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                            <span className="flex items-center gap-1 font-mono">
                              <Clock size={10} />
                              <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                            </span>
                            <span className="text-emerald-400 hover:underline flex items-center gap-0.5">
                              <span>View</span>
                              <ChevronRight size={10} />
                            </span>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                {/* Footer link to Records */}
                <div className="p-2.5 bg-slate-950/80 border-t border-slate-800 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNotifOpen(false);
                      onSelectTab('my-records');
                    }}
                    className="text-[11px] font-semibold text-emerald-400 hover:underline"
                  >
                    View all cases & reports →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <button
            type="button"
            id="btn-nav-profile-pill"
            onClick={() => onSelectTab('profile')}
            className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-slate-900 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
            }`}
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow-xs">
              {citizen.fullName ? citizen.fullName.charAt(0) : 'U'}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-semibold text-slate-200 leading-tight max-w-[140px] truncate">
                {citizen.fullName || 'Citizen User'}
              </p>
            </div>
          </button>

          {/* Single Official Logout Button */}
          <button
            type="button"
            id="btn-nav-logout"
            onClick={onSignOut}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 transition-colors cursor-pointer"
            title="Sign out of SFEN"
          >
            <LogOut size={15} />
            <span className="hidden xs:inline">Logout</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            id="btn-mobile-menu-toggle"
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>
    </header>
  );
};

