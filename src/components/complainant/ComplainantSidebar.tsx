import React, { useState, useEffect } from 'react';
import { ComplainantTab } from '../../types/complainant';
import { 
  LayoutDashboard, 
  FilePlus2, 
  FileText, 
  Briefcase, 
  AlertCircle, 
  Bell, 
  UserCheck, 
  ShieldCheck,
  PhoneCall,
  Info,
  ChevronLeft,
  ChevronRight,
  Building2,
  Scale,
  HelpCircle,
  FileCheck2
} from 'lucide-react';

const INFO_SLIDES = [
  {
    step: '1/4',
    title: '1. File Online Report',
    desc: 'Lodge preliminary incident details under My Reports to get an instant tracking reference (SFEN-RPT-xxx).',
    icon: FileCheck2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20'
  },
  {
    step: '2/4',
    title: '2. Station CSC Review',
    desc: 'Station officers review entries. Visit the station if a signed sworn affidavit is needed for court.',
    icon: Building2,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20'
  },
  {
    step: '3/4',
    title: '3. Official CAS Docket',
    desc: 'Once approved, an official CAS number (CAS xxx/xx/xxxx) and investigating detective are assigned.',
    icon: Scale,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/20'
  },
  {
    step: '4/4',
    title: '4. Support & Escalations',
    desc: 'Experiencing delays or lack of detective updates? Submit a complaint directly to Station Command.',
    icon: HelpCircle,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/20'
  }
];

const SidebarInfoSlideshow: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % INFO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const slide = INFO_SLIDES[currentIdx];
  const Icon = slide.icon;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + INFO_SLIDES.length) % INFO_SLIDES.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % INFO_SLIDES.length);
  };

  return (
    <div 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5 transition-all shadow-xs"
    >
      {/* Header with Step Indicator & Nav Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
          <Info size={13} className="text-emerald-400" />
          <span>Information Guide</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous info slide"
            className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronLeft size={12} />
          </button>
          <span className="text-[10px] font-mono font-semibold text-slate-400 px-1">
            {slide.step}
          </span>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next info slide"
            className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* Slide Content */}
      <div className="space-y-1.5 min-h-[76px] flex flex-col justify-center">
        <div className="flex items-center gap-1.5">
          <div className={`p-1 rounded-md border ${slide.bg}`}>
            <Icon size={13} className={slide.color} />
          </div>
          <h4 className="text-[11px] font-bold text-white tracking-tight">
            {slide.title}
          </h4>
        </div>
        <p className="text-[10.5px] text-slate-300 leading-relaxed pl-0.5">
          {slide.desc}
        </p>
      </div>

      {/* Dot Indicators */}
      <div className="flex items-center justify-center gap-1.5 pt-0.5">
        {INFO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentIdx(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              idx === currentIdx 
                ? 'w-4 bg-emerald-400' 
                : 'w-1.5 bg-slate-700 hover:bg-slate-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

interface ComplainantSidebarProps {
  activeTab: ComplainantTab;
  onSelectTab: (tab: ComplainantTab) => void;
  reportCount: number;
  caseCount: number;
  complaintCount: number;
  unreadNotifications: number;
  onSignOut: () => void;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

export const ComplainantSidebar: React.FC<ComplainantSidebarProps> = ({
  activeTab,
  onSelectTab,
  reportCount,
  caseCount,
  complaintCount,
  unreadNotifications,
  onSignOut,
  isMobileDrawer = false,
  onCloseMobileDrawer
}) => {
  const handleNav = (tab: ComplainantTab) => {
    onSelectTab(tab);
    if (isMobileDrawer && onCloseMobileDrawer) {
      onCloseMobileDrawer();
    }
  };

  const totalRecordsCount = reportCount + caseCount + complaintCount;

  const navItems: Array<{
    id: ComplainantTab;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
    isActiveMatch?: (current: ComplainantTab) => boolean;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      isActiveMatch: (cur) => cur === 'dashboard'
    },
    {
      id: 'report-incident',
      label: 'Report Incident',
      icon: FilePlus2,
      isActiveMatch: (cur) => cur === 'report-incident'
    },
    {
      id: 'my-records',
      label: 'My Records',
      icon: Briefcase,
      badge: totalRecordsCount,
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      isActiveMatch: (cur) => cur === 'my-records' || cur === 'my-cases' || cur === 'my-reports' || cur === 'complaints'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: UserCheck,
      isActiveMatch: (cur) => cur === 'profile'
    }
  ];

  return (
    <aside 
      id={isMobileDrawer ? 'complainant-mobile-drawer' : 'complainant-desktop-sidebar'}
      className={`flex flex-col justify-between ${
        isMobileDrawer ? 'w-full py-2' : 'w-64 py-6 pr-4'
      }`}
    >
      <div className="space-y-6">
        
        {/* Navigation Group */}
        <nav className="space-y-1.5" aria-label="Complainant navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.isActiveMatch ? item.isActiveMatch(activeTab) : activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                type="button"
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 border border-emerald-500/40 text-emerald-300 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={17} className={isActive ? 'text-emerald-400' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border ${
                      item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Information Guide Slideshow under Profile button */}
        <SidebarInfoSlideshow />

      </div>

      {/* Helpline */}
      <div className="pt-6 border-t border-slate-800/60">
        <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-300 font-medium">
            <PhoneCall size={14} />
            <span>Crisis Desk</span>
          </div>
          <span className="font-mono font-bold text-emerald-400">0800 012 322</span>
        </div>
      </div>
    </aside>
  );
};
