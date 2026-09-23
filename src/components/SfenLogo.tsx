import React from 'react';
import { ShieldCheck, FileText, Lock } from 'lucide-react';

interface SfenLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SfenLogo: React.FC<SfenLogoProps> = ({ className = '', size = 'md' }) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20'
  };

  const iconSizeMap = {
    sm: 20,
    md: 28,
    lg: 40
  };

  return (
    <div id="sfen-logo-container" className={`relative flex items-center justify-center ${className}`}>
      {/* Outer Glow & Geometric Hex/Shield Container */}
      <div className={`relative ${sizeMap[size]} rounded-2xl bg-slate-900 border border-blue-500/30 p-2.5 shadow-xl shadow-blue-950/40 flex items-center justify-center group overflow-hidden`}>
        {/* Central emblem: Shield with Docket & Lock layer */}
        <div className="relative flex items-center justify-center text-blue-400">
          <ShieldCheck size={iconSizeMap[size]} className="stroke-[1.8] text-blue-400 drop-shadow-sm" />
          <FileText size={iconSizeMap[size] * 0.45} className="absolute text-slate-100 -mt-1 stroke-[2.2]" />
        </div>

        {/* Status dot in corner indicating secure node */}
        <span className="absolute bottom-1 right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      </div>
    </div>
  );
};
