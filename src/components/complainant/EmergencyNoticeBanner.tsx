import React from 'react';
import { AlertOctagon, PhoneCall } from 'lucide-react';

interface EmergencyNoticeBannerProps {
  compact?: boolean;
}

export const EmergencyNoticeBanner: React.FC<EmergencyNoticeBannerProps> = () => {
  return (
    <div 
      id="emergency-advisory-banner"
      className="w-full rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 px-4 py-2.5 flex items-center justify-between gap-3 text-xs shadow-sm"
      role="alert"
    >
      <div className="flex items-center gap-2 text-slate-300">
        <AlertOctagon size={16} className="text-amber-400 shrink-0" />
        <span>For active emergencies or crimes in progress, call <strong className="text-amber-300 font-bold">10111</strong> immediately.</span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <a 
          href="tel:10111" 
          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <PhoneCall size={12} />
          <span>Call 10111</span>
        </a>
      </div>
    </div>
  );
};
