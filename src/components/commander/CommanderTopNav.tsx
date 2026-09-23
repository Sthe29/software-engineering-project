import React, { useState, useRef, useEffect } from 'react';
import { UserProfile } from '../../types/auth';
import { CommanderNavTab, CommanderNotification } from '../../types/commander';
import { 
  ShieldCheck, 
  Bell, 
  CheckCheck, 
  LogOut, 
  Menu, 
  X, 
  AlertTriangle, 
  Briefcase, 
  ArrowRightLeft, 
  Clock, 
  ChevronRight,
  ClipboardList
} from 'lucide-react';

interface CommanderTopNavProps {
  user: UserProfile;
  activeTab: CommanderNavTab;
  onNavigate: (tab: CommanderNavTab) => void;
  onSignOut: () => void;
  unreadCount: number;
  notifications: CommanderNotification[];
  onMarkNotificationAsRead: (id: string) => void;
  onMarkAllNotificationsAsRead: () => void;
  onOpenCaseByNumber?: (caseNumber: string) => void;
  onOpenComplaint?: (complaintId: string) => void;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

export const CommanderTopNav: React.FC<CommanderTopNavProps> = ({
  user,
  activeTab,
  onNavigate,
  onSignOut,
  unreadCount,
  notifications,
  onMarkNotificationAsRead,
  onMarkAllNotificationsAsRead,
  onOpenCaseByNumber,
  onOpenComplaint,
  isMobileMenuOpen,
  onToggleMobileMenu
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    if (isNotifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotifOpen]);

  const handleNotificationClick = (item: CommanderNotification) => {
    if (!item.read) {
      onMarkNotificationAsRead(item.id);
    }
    setIsNotifOpen(false);

    if (item.caseNumber && onOpenCaseByNumber) {
      onOpenCaseByNumber(item.caseNumber);
    } else if (item.complaintId && onOpenComplaint) {
      onOpenComplaint(item.complaintId);
    } else if (item.type === 'SERVICE_COMPLAINT') {
      onNavigate('complaints');
    } else {
      onNavigate('cases');
    }
  };

  const getNotifIcon = (type: CommanderNotification['type']) => {
    switch (type) {
      case 'CASE_AWAITING_ASSIGNMENT':
        return <Briefcase size={14} className="text-amber-400" />;
      case 'DOCKET_AWAITING_ACKNOWLEDGEMENT':
        return <ArrowRightLeft size={14} className="text-blue-400" />;
      case 'CASE_REQUIRES_REVIEW':
        return <Clock size={14} className="text-emerald-400" />;
      case 'INSTRUCTION_RESPONDED':
        return <ClipboardList size={14} className="text-purple-400" />;
      case 'SERVICE_COMPLAINT':
        return <AlertTriangle size={14} className="text-rose-400" />;
      default:
        return <ShieldCheck size={14} className="text-slate-400" />;
    }
  };

  return (
    <header id="commander-topbar" className="w-full bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 sm:px-6 py-3 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Branding & Station Context */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            id="btn-commander-mobile-menu"
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle navigation drawer"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-xs">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-widest font-mono text-emerald-400 uppercase">
                  SFEN COMMAND
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  Level 3 Supervisor
                </span>
              </div>
              <h1 className="text-sm font-bold text-white leading-none">
                Station Commander Directorate
              </h1>
            </div>
          </div>
        </div>

        {/* Center / Right: Station Identity & User Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Station Indicator (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-bold">{user.station || 'SAPS Sandton Police Station'}</span>
          </div>

          {/* Notifications Dropdown Popover */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              id="btn-commander-bell-notifs"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
              title="Station Notifications"
              aria-label="View supervisory notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span 
                  id="commander-badge-unread-count"
                  className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center justify-center shadow-xs animate-in zoom-in"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div 
                id="commander-notifications-dropdown"
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                {/* Header */}
                <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">Supervisory Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {unreadCount} unread
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={onMarkAllNotificationsAsRead}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <CheckCheck size={13} />
                      <span>Mark all read</span>
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No supervisory notifications at this time.
                    </div>
                  ) : (
                    notifications.slice(0, 6).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleNotificationClick(item)}
                        className={`p-3.5 hover:bg-slate-800/60 transition-colors cursor-pointer flex items-start gap-3 ${
                          !item.read ? 'bg-emerald-950/15' : ''
                        }`}
                      >
                        <div className="p-2 rounded-xl bg-slate-800 border border-slate-700/60 shrink-0 mt-0.5">
                          {getNotifIcon(item.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-xs font-bold text-white truncate">
                              {item.title}
                            </span>
                            {!item.read && (
                              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {item.message}
                          </p>
                          <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500 font-mono">
                            {item.caseNumber && (
                              <span className="text-emerald-400 font-semibold">
                                {item.caseNumber}
                              </span>
                            )}
                            <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* View all footer */}
                <div className="p-2.5 bg-slate-950/60 border-t border-slate-800 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNotifOpen(false);
                      onNavigate('notifications');
                    }}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>View all notifications</span>
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Commander Profile Badge */}
          <div 
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-800 cursor-pointer group"
            title="View Commander Profile"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 flex items-center justify-center font-bold text-xs">
              {user.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                {user.rank} {user.fullName}
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                {user.personnelNumber}
              </div>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            type="button"
            id="btn-commander-top-logout"
            onClick={onSignOut}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/10 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 border border-slate-700/60 transition-colors cursor-pointer hidden md:flex items-center gap-1.5 text-xs font-semibold"
            title="End Commander Session"
          >
            <LogOut size={16} />
            <span className="hidden xl:inline">Logout</span>
          </button>

        </div>

      </div>
    </header>
  );
};
