import React, { useState } from 'react';
import { UserProfile } from '../../types/auth';
import { DetectiveCaseDocket, SupervisorInstruction, CaseWorkspaceTab } from '../../types/detective';
import { 
  Briefcase, 
  ClipboardList, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Lock,
  FileCheck2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface DetectiveDashboardViewProps {
  detective: UserProfile;
  cases: DetectiveCaseDocket[];
  instructions: SupervisorInstruction[];
  onOpenCase: (caseData: DetectiveCaseDocket, initialTab?: CaseWorkspaceTab) => void;
  onNavigateToCases: (subTab?: 'cases' | 'directives') => void;
  onNavigateToInstructions: () => void;
}

export const DetectiveDashboardView: React.FC<DetectiveDashboardViewProps> = ({
  detective,
  cases,
  instructions,
  onOpenCase,
  onNavigateToCases,
  onNavigateToInstructions
}) => {
  // Dropdown / Accordion state: both initially set as collapsed as requested
  const [isRecentActivityOpen, setIsRecentActivityOpen] = useState(false);
  const [isDirectivesOpen, setIsDirectivesOpen] = useState(false);

  // Cases requiring attention: pending custody receipt or urgent priority
  const casesRequiringAttention = cases.filter(
    c => !c.isCustodyAcknowledgedByDetective || c.priorityLevel === 'Urgent' || c.priorityLevel === 'Critical'
  );

  const outstandingInstructions = instructions.filter(i => i.status === 'OUTSTANDING');
  const finalizedCases = cases.filter(c => c.currentStatus === 'Case Finalized' || c.currentStatus === 'Docket at NPA / Court');

  // Recently worked-on or recently assigned cases (sorted by last activity)
  const recentCases = [...cases].sort(
    (a, b) => new Date(b.lastActivityDate).getTime() - new Date(a.lastActivityDate).getTime()
  ).slice(0, 4);

  return (
    <div id="detective-dashboard-view" className="space-y-6">
      
      {/* Floating Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 pb-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
              Active Investigation Session
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Detective Workspace Overview
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {detective.rank} {detective.fullName} ({detective.personnelNumber}) • {detective.division || 'Commercial Crime & Serious Offence Desk'}
          </p>
        </div>
      </div>

      {/* 4 Core Operational Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Assigned Cases */}
        <div 
          onClick={() => onNavigateToCases('cases')}
          className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Assigned Dockets</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Briefcase size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
              {cases.length}
            </span>
            <span className="text-[11px] text-slate-400">dockets</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 flex items-center justify-between">
            <span>Allocated to your desk</span>
            <ArrowRight size={12} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
          </p>
        </div>

        {/* 2. Requiring Attention */}
        <div 
          onClick={() => onNavigateToCases('cases')}
          className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Requiring Attention</span>
            <div className={`p-2 rounded-xl ${casesRequiringAttention.length > 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${casesRequiringAttention.length > 0 ? 'text-amber-400' : 'text-white'}`}>
              {casesRequiringAttention.length}
            </span>
            <span className="text-[11px] text-slate-400">actions</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 flex items-center justify-between">
            <span>Receipts or urgent priority</span>
            <ArrowRight size={12} className="text-slate-500 group-hover:text-amber-400 transition-colors" />
          </p>
        </div>

        {/* 3. Outstanding Supervisor Directives */}
        <div 
          onClick={() => onNavigateToCases()}
          className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Directives</span>
            <div className={`p-2 rounded-xl ${outstandingInstructions.length > 0 ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-800 text-slate-400'}`}>
              <ClipboardList size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${outstandingInstructions.length > 0 ? 'text-purple-400' : 'text-white'}`}>
              {outstandingInstructions.length}
            </span>
            <span className="text-[11px] text-slate-400">outstanding</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 flex items-center justify-between">
            <span>Commander instructions</span>
            <ArrowRight size={12} className="text-slate-500 group-hover:text-purple-400 transition-colors" />
          </p>
        </div>

        {/* 4. Court Ready / Finalized */}
        <div 
          onClick={() => onNavigateToCases('cases')}
          className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">NPA / Court Ready</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <FileCheck2 size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">
              {finalizedCases.length}
            </span>
            <span className="text-[11px] text-slate-400">advanced</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 flex items-center justify-between">
            <span>Evidence compiled / court stage</span>
            <ArrowRight size={12} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </p>
        </div>

      </div>

      {/* DROPDOWN SECTIONS: RECENT DOCKET ACTIVITY + OUTSTANDING DIRECTIVES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* DROPDOWN 1: Recent Docket Activity */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-all shadow-sm">
          {/* Dropdown Header Trigger */}
          <button
            type="button"
            id="toggle-recent-docket-activity-dropdown"
            onClick={() => setIsRecentActivityOpen(!isRecentActivityOpen)}
            className="w-full p-4 sm:p-5 flex items-center justify-between bg-slate-900/90 hover:bg-slate-850 transition-colors cursor-pointer text-left border-b border-slate-800/80"
            aria-expanded={isRecentActivityOpen}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>Recent Docket Activity</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal">
                    {recentCases.length} recent
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Quick access to recently active investigation dockets
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-400 font-semibold">
                {isRecentActivityOpen ? 'Collapse' : 'Expand'}
              </span>
              <div className="p-1 rounded-lg bg-slate-800 text-slate-300 group-hover:text-white">
                {isRecentActivityOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>
          </button>

          {/* Collapsible Content */}
          {isRecentActivityOpen && (
            <div className="p-4 sm:p-5 space-y-4 animate-in slide-in-from-top-1 duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Last updated dockets
                </span>
                <button
                  type="button"
                  onClick={() => onNavigateToCases('cases')}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>View All in Cases & Directives</span>
                  <ArrowRight size={12} />
                </button>
              </div>

              {recentCases.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <Briefcase size={28} className="text-slate-600 mx-auto" />
                  <p className="text-xs font-bold text-white">No assigned cases</p>
                  <p className="text-[11px] text-slate-400">
                    Assigned dockets will appear here for your review and investigation.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentCases.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => onOpenCase(c, 'overview')}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-amber-500/40 hover:bg-slate-900 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-amber-300">
                            {c.caseNumber}
                          </span>
                          <span className="text-xs text-white font-semibold truncate">
                            {c.incidentType}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 truncate">
                          Complainant: {c.complainant.fullName} • {c.incidentLocation.suburb}
                        </p>

                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                          <span>Assigned: {c.assignedDate}</span>
                          <span>•</span>
                          <span>Last Activity: {c.lastActivityDate}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                          {c.currentStatus}
                        </span>
                        {!c.isCustodyAcknowledgedByDetective && (
                          <span className="text-[10px] font-mono text-amber-400 font-bold">
                            Awaiting Receipt
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Explicit Collapse Dropdown Button */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end">
                <button
                  type="button"
                  id="btn-collapse-recent-activity"
                  onClick={() => setIsRecentActivityOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ChevronUp size={14} />
                  <span>Collapse Dropdown</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* DROPDOWN 2: Outstanding Supervisor Directives */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-all shadow-sm">
          {/* Dropdown Header Trigger */}
          <button
            type="button"
            id="toggle-supervisor-directives-dropdown"
            onClick={() => setIsDirectivesOpen(!isDirectivesOpen)}
            className="w-full p-4 sm:p-5 flex items-center justify-between bg-slate-900/90 hover:bg-slate-850 transition-colors cursor-pointer text-left border-b border-slate-800/80"
            aria-expanded={isDirectivesOpen}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>Outstanding Directives</span>
                  {outstandingInstructions.length > 0 ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
                      {outstandingInstructions.length} pending
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-normal">
                      Up to date
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-slate-400">
                  Directives and SAPS 5 instructions requiring detective response
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-purple-400 font-semibold">
                {isDirectivesOpen ? 'Collapse' : 'Expand'}
              </span>
              <div className="p-1 rounded-lg bg-slate-800 text-slate-300 group-hover:text-white">
                {isDirectivesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>
          </button>

          {/* Collapsible Content */}
          {isDirectivesOpen && (
            <div className="p-4 sm:p-5 space-y-4 animate-in slide-in-from-top-1 duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Commander directives & deadlines
                </span>
                <button
                  type="button"
                  onClick={() => onNavigateToCases('directives')}
                  className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>View All in Cases & Directives</span>
                  <ArrowRight size={12} />
                </button>
              </div>

              {outstandingInstructions.length === 0 ? (
                <div className="p-8 text-center rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <CheckCircle2 size={28} className="text-emerald-400 mx-auto" />
                  <p className="text-xs font-bold text-white">All directives satisfied</p>
                  <p className="text-[11px] text-slate-400">
                    You have addressed all outstanding commander and supervisor instructions.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {outstandingInstructions.slice(0, 3).map((inst) => {
                    const matchedCase = cases.find(c => c.caseNumber === inst.caseNumber);
                    return (
                      <div
                        key={inst.id}
                        onClick={() => {
                          if (matchedCase) onOpenCase(matchedCase, 'instructions');
                          else onNavigateToInstructions();
                        }}
                        className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-purple-500/40 hover:bg-slate-900 transition-all cursor-pointer space-y-2 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-amber-300">
                            {inst.caseNumber}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                            {inst.priority}
                          </span>
                        </div>

                        <p className="text-xs text-white line-clamp-2 leading-relaxed">
                          "{inst.instructionText}"
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-800/60">
                          <span>Issued by: {inst.issuedByRank} {inst.issuedBy}</span>
                          {inst.requiredReviewDate && (
                            <span className="text-amber-400">Due: {inst.requiredReviewDate}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Explicit Collapse Dropdown Button */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-end">
                <button
                  type="button"
                  id="btn-collapse-directives"
                  onClick={() => setIsDirectivesOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ChevronUp size={14} />
                  <span>Collapse Dropdown</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* CORE SFEN ACCOUNTABILITY PRINCIPLE BANNER */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Lock size={16} />
          </div>
          <div>
            <p className="font-bold text-white text-xs">
              SFEN Custody & Tamper-Evident Accountability
            </p>
            <p className="text-[11px] text-slate-400">
              From initial docket allocation to court appearance, all actions, access logs, and transfers are cryptographically sealed.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 font-mono text-[11px] text-emerald-400">
          <ShieldCheck size={14} />
          <span>Active Session ID: {detective.personnelNumber}</span>
        </div>
      </div>

    </div>
  );
};
