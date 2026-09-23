import React, { useState, useEffect } from 'react';
import { Shield, Lock, Radio, Database } from 'lucide-react';

export const OfficialTopBar: React.FC = () => {
  const [timeString, setTimeString] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }) + ' UTC'
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header id="sfen-official-topbar" className="w-full bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-md px-4 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
        {/* Left: Police Service Identifier */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-blue-400 font-semibold tracking-wide uppercase text-[11px]">
            <Shield size={14} className="text-blue-400" />
            <span>National Police Service</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-400 font-medium hidden sm:inline text-[11px]">
            Case Docket & Evidence Network
          </span>
        </div>

        {/* Right: Security & Network Telemetry */}
        <div className="flex items-center gap-4 text-[11px] text-slate-400">
          <div className="hidden md:flex items-center gap-1.5 font-mono">
            <Radio size={12} className="text-emerald-400 animate-pulse" />
            <span>Terminal Node: HQ-CP-04</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
            <Lock size={12} className="text-blue-400" />
            <span className="font-mono text-[10px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
              TLS 1.3 / AES-256
            </span>
          </div>

          <div className="font-mono text-slate-300 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800">
            {timeString || '14:50:42 UTC'}
          </div>
        </div>
      </div>
    </header>
  );
};
