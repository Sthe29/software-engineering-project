import React from 'react';
import { 
  Users, 
  Search, 
  ShieldAlert, 
  LogIn, 
  Sparkles,
  UserCheck,
  ChevronDown
} from 'lucide-react';
import policeStationHero from '../assets/images/police_station_hero_1790253890766.jpg';

interface WelcomePageProps {
  onSignInCitizen: () => void;
  onSignInOfficial: () => void;
  onQuickDemoCitizen?: () => void;
  onQuickDemoCommander?: () => void;
  onQuickDemoDetective?: () => void;
  onQuickDemoOfficer?: () => void;
  onQuickDemoAdmin?: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onSignInCitizen,
  onSignInOfficial,
  onQuickDemoCitizen,
  onQuickDemoCommander,
  onQuickDemoDetective,
  onQuickDemoOfficer
}) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between text-white selection:bg-blue-600 selection:text-white overflow-hidden bg-slate-950 font-sans">
      
      {/* Background Image with Dark Vignette & Cinematic Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={policeStationHero}
          alt="South African Police Service precinct at dusk"
          className="w-full h-full object-cover object-center scale-105 transform motion-safe:animate-pulse [animation-duration:15s]"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.src.endsWith('/assets/police_station_hero.jpg')) {
              target.src = '/assets/police_station_hero.jpg';
            }
          }}
        />
        {/* Deep cinematic gradient overlay matching the reference image */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-900/60 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/40 to-slate-950/90" />
      </div>

      {/* Top Header Strip */}
      <header className="relative z-10 w-full pt-6 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-900/80 border border-blue-500/40 flex items-center justify-center shadow-lg backdrop-blur-md">
            <span className="text-xl">🇿🇦</span>
          </div>
          <div>
            <div className="text-xs font-extrabold uppercase tracking-widest text-blue-300 drop-shadow">
              South African Police Service
            </div>
            <div className="text-[10px] text-slate-400 font-mono tracking-wider">
              Republic of South Africa • Official e-Docket
            </div>
          </div>
        </div>

        {/* Quick Top Sign-in Shortcut */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSignInOfficial}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900/70 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 backdrop-blur-md transition-all cursor-pointer"
          >
            Official Portal
          </button>
          <button
            type="button"
            onClick={onSignInCitizen}
            className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600/90 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/60 backdrop-blur-md transition-all cursor-pointer"
          >
            Citizen Sign In
          </button>
        </div>
      </header>

      {/* Center Main Stage */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-8 max-w-5xl mx-auto w-full text-center">
        
        {/* SFEN Main Title */}
        <div className="space-y-1 mb-2">
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white font-['Space_Grotesk'] drop-shadow-2xl">
            SFEN
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-emerald-400 mx-auto rounded-full" />
        </div>

        {/* Subtitle */}
        <p className="text-base sm:text-xl font-medium text-slate-200 tracking-wide mt-2 drop-shadow">
          Police Case Management and Electronic Records System
        </p>

        {/* Core Pillars */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-blue-300/90 my-3">
          <span>SECURE</span>
          <span className="text-slate-600">|</span>
          <span>EFFICIENT</span>
          <span className="text-slate-600">|</span>
          <span>ACCOUNTABLE</span>
          <span className="text-slate-600">|</span>
          <span>CONNECTED</span>
        </div>

        {/* Empowering Justice Paragraph requested by user */}
        <div className="max-w-2xl mx-auto my-3 px-2">
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed drop-shadow-md">
            <span className="font-bold text-white">Empowering Justice. Protecting Communities.</span>{' '}
            A unified digital policing ecosystem connecting citizens and law enforcement. Lodge incident reports, track CAS docket milestones in real-time, safeguard evidence custody, and streamline investigations with complete transparency.
          </p>
        </div>

        {/* The 4 Role Capability Cards (Directly matching user image) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full mt-4 mb-6">
          
          {/* Card 1: Complainant */}
          <div
            onClick={onQuickDemoCitizen || onSignInCitizen}
            className="group relative p-4 sm:p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/85 border border-slate-700/70 hover:border-emerald-500/60 backdrop-blur-md transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center shadow-lg hover:shadow-emerald-950/40 hover:-translate-y-0.5"
          >
            <div className="h-11 w-11 rounded-xl bg-slate-800/80 group-hover:bg-emerald-600/30 border border-slate-700 group-hover:border-emerald-400/50 flex items-center justify-center text-slate-200 group-hover:text-emerald-300 transition-colors mb-2.5">
              <Users size={22} />
            </div>
            <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
              Complainant
            </div>
            <div className="text-xs text-slate-400 group-hover:text-slate-200 mt-1">
              Report and track cases
            </div>
            <span className="mt-2 text-[10px] text-emerald-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Click to Open →
            </span>
          </div>

          {/* Card 2: Police Officer (CSC) */}
          <div
            onClick={onQuickDemoOfficer || onSignInOfficial}
            className="group relative p-4 sm:p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/85 border border-slate-700/70 hover:border-blue-500/60 backdrop-blur-md transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center shadow-lg hover:shadow-blue-950/40 hover:-translate-y-0.5"
          >
            <div className="h-11 w-11 rounded-xl bg-slate-800/80 group-hover:bg-blue-600/30 border border-slate-700 group-hover:border-blue-400/50 flex items-center justify-center text-slate-200 group-hover:text-blue-300 transition-colors mb-2.5">
              <UserCheck size={22} />
            </div>
            <div className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
              Police Officer (CSC)
            </div>
            <div className="text-xs text-slate-400 group-hover:text-slate-200 mt-1">
              Capture and manage cases
            </div>
            <span className="mt-2 text-[10px] text-blue-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Click to Open →
            </span>
          </div>

          {/* Card 3: Detective */}
          <div
            onClick={onQuickDemoDetective || onSignInOfficial}
            className="group relative p-4 sm:p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/85 border border-slate-700/70 hover:border-amber-500/60 backdrop-blur-md transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center shadow-lg hover:shadow-amber-950/40 hover:-translate-y-0.5"
          >
            <div className="h-11 w-11 rounded-xl bg-slate-800/80 group-hover:bg-amber-600/30 border border-slate-700 group-hover:border-amber-400/50 flex items-center justify-center text-slate-200 group-hover:text-amber-300 transition-colors mb-2.5">
              <Search size={22} />
            </div>
            <div className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
              Detective
            </div>
            <div className="text-xs text-slate-400 group-hover:text-slate-200 mt-1">
              Investigate and update
            </div>
            <span className="mt-2 text-[10px] text-amber-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Click to Open →
            </span>
          </div>

          {/* Card 4: Commander / Admin */}
          <div
            onClick={onQuickDemoCommander || onSignInOfficial}
            className="group relative p-4 sm:p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/85 border border-slate-700/70 hover:border-purple-500/60 backdrop-blur-md transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center shadow-lg hover:shadow-purple-950/40 hover:-translate-y-0.5"
          >
            <div className="h-11 w-11 rounded-xl bg-slate-800/80 group-hover:bg-purple-600/30 border border-slate-700 group-hover:border-purple-400/50 flex items-center justify-center text-slate-200 group-hover:text-purple-300 transition-colors mb-2.5">
              <ShieldAlert size={22} />
            </div>
            <div className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
              Commander/Admin
            </div>
            <div className="text-xs text-slate-400 group-hover:text-slate-200 mt-1">
              Monitor and oversee
            </div>
            <span className="mt-2 text-[10px] text-purple-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              Click to Open →
            </span>
          </div>

        </div>

        {/* Clear, Prominent Sign In Buttons at the bottom as requested */}
        <div className="w-full max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-center gap-3">
          
          <button
            type="button"
            id="btn-welcome-citizen-signin"
            onClick={onSignInCitizen}
            className="w-full sm:w-1/2 py-3 px-5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xl shadow-emerald-950/70 border border-emerald-400/40 transition-all flex items-center justify-center gap-2 cursor-pointer group"
          >
            <LogIn size={16} className="group-hover:translate-x-0.5 transition-transform" />
            <span>Citizen Sign In</span>
          </button>

          <button
            type="button"
            id="btn-welcome-official-signin"
            onClick={onSignInOfficial}
            className="w-full sm:w-1/2 py-3 px-5 rounded-xl font-bold text-sm bg-slate-900/90 hover:bg-slate-800 text-slate-100 hover:text-white border border-slate-600 hover:border-blue-400/60 backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <ShieldAlert size={16} className="text-blue-400" />
            <span>Police Official Sign In</span>
          </button>

        </div>

      </main>

      {/* Subtle Bottom Footer matching reference image */}
      <footer className="relative z-10 w-full pb-6 pt-2 px-4 text-center">
        <div className="flex flex-col items-center gap-1.5 text-slate-400">
          <ChevronDown size={18} className="text-slate-500 animate-bounce" />
          <div className="text-[11px] font-bold tracking-widest uppercase text-slate-300 font-['Space_Grotesk']">
            A Safer South Africa Through Better Records
          </div>
          <div className="text-[10px] text-slate-500">
            Secure File & Evidence Network • Official SAPS Docket Administration
          </div>
        </div>
      </footer>

    </div>
  );
};
