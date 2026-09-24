import React from 'react';
import { UserProfile } from '../../types/auth';
import { DetectiveCaseDocket, SupervisorInstruction } from '../../types/detective';
import { StationComplaintRecord } from '../../types/commander';
import { 
  Briefcase, 
  UserPlus, 
  Clock, 
  ClipboardList, 
  ArrowRightLeft, 
  ArrowRight, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  FileText,
  UserCheck
} from 'lucide-react';

interface CommanderDashboardViewProps {
  commander: UserProfile;
  cases: DetectiveCaseDocket[];
  instructions: SupervisorInstruction[];
  complaints: StationComplaintRecord[];
  onOpenCase: (caseDocket: DetectiveCaseDocket, initialTab?: any) => void;
  onNavigateToCases: (filter?: string) => void;
  onNavigateToDetectives: () => void;
  onNavigateToComplaints: () => void;
  onOpenAssignModal: (caseDocket: DetectiveCaseDocket) => void;
}

export const CommanderDashboardView: React.FC<CommanderDashboardViewProps> = ({
  commander,
  cases,
  instructions,
  complaints,
  onOpenCase,
  onNavigateToCases,
  onNavigateToDetectives,
  onNavigateToComplaints,
  onOpenAssignModal
}) => {
  const today = new Date().toISOString().split('T')[0];

  // 1. Cases Awaiting Detective Assignment
  const unassignedCases = cases.filter(
    c => !c.investigatingOfficerPersonnelNumber || c.investigatingOfficerName === 'Unassigned' || c.investigatingOfficerRank === 'Awaiting Allocation'
  );

  // 2. Cases Requiring Review (scheduled review date <= today)
  const casesRequiringReview = cases.filter(
    c => c.scheduledReviewDate && c.scheduledReviewDate <= today
  );

  // 3. Outstanding Supervisor Instructions
  const outstandingInstructions = instructions.filter(i => i.status === 'OUTSTANDING');

  // 4. Dockets Awaiting Acknowledgement (either detective receipt pending or commander receipt pending)
  const docketsAwaitingAck = cases.filter(
    c => !c.isCustodyAcknowledgedByDetective || c.custodyStatus === 'TRANSFERRED_AWAITING_RECEIPT'
  );

  // Cases Requiring Commander's Immediate Attention:
  // - Unassigned cases
  // - Dockets where custodian is Station Commander but awaiting acknowledgement
  // - Overdue reviews
  // - Critical priority cases
  const immediateAttentionCases = cases.filter(c => {
    const isUnassigned = !c.investigatingOfficerPersonnelNumber || c.investigatingOfficerName === 'Unassigned';
    const isCommanderCustodyPending = c.currentCustodianPersonnelNumber === commander.personnelNumber && !c.isCustodyAcknowledgedByDetective;
    const isReviewDue = c.scheduledReviewDate && c.scheduledReviewDate <= today;
    const isCritical = c.priorityLevel === 'Critical';
    return isUnassigned || isCommanderCustodyPending || isReviewDue || isCritical;
  });

  return (
    <div id="commander-dashboard-view" className="space-y-6">
      
      {/* Station Commander Floating Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 pb-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 " />
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
              Station Command Supervision • Active Session
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Supervisory Command Overview
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {commander.rank} {commander.fullName} ({commander.personnelNumber}) • {commander.station || 'SAPS Sandton Police Station'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigateToCases('unassigned')}
            className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <UserPlus size={15} />
            <span>Assign Dockets ({unassignedCases.length})</span>
          </button>
        </div>
      </div>

      {/* 5 Core Supervisory Operational Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        
        {/* 1. Cases Under Supervision */}
        <div 
          onClick={() => onNavigateToCases('all')}
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Under Supervision</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Briefcase size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-white">
              {cases.length}
            </span>
            <span className="text-[11px] text-slate-400">cases</span>
          </div>
          <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80 flex items-center justify-between">
            <span>Station dockets</span>
            <ArrowRight size={11} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
          </p>
        </div>

        {/* 2. Cases Awaiting Detective Assignment */}
        <div 
          onClick={() => onNavigateToCases('unassigned')}
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Awaiting Assignment</span>
            <div className={`p-2 rounded-xl ${unassignedCases.length > 0 ? 'bg-amber-500/10 text-amber-400 ' : 'bg-slate-800 text-slate-400'}`}>
              <UserPlus size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${unassignedCases.length > 0 ? 'text-amber-400' : 'text-white'}`}>
              {unassignedCases.length}
            </span>
            <span className="text-[11px] text-slate-400">pending</span>
          </div>
          <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80 flex items-center justify-between">
            <span>Needs investigator</span>
            <ArrowRight size={11} className="text-slate-500 group-hover:text-amber-400 transition-colors" />
          </p>
        </div>

        {/* 3. Cases Requiring Review */}
        <div 
          onClick={() => onNavigateToCases('review_due')}
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/40 transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Requiring Review</span>
            <div className={`p-2 rounded-xl ${casesRequiringReview.length > 0 ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-800 text-slate-400'}`}>
              <Clock size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${casesRequiringReview.length > 0 ? 'text-rose-400' : 'text-white'}`}>
              {casesRequiringReview.length}
            </span>
            <span className="text-[11px] text-slate-400">due</span>
          </div>
          <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80 flex items-center justify-between">
            <span>Scheduled review date</span>
            <ArrowRight size={11} className="text-slate-500 group-hover:text-rose-400 transition-colors" />
          </p>
        </div>

        {/* 4. Outstanding Supervisor Instructions */}
        <div 
          onClick={() => onNavigateToCases('all')}
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-purple-500/40 transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Directives Issued</span>
            <div className={`p-2 rounded-xl ${outstandingInstructions.length > 0 ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-800 text-slate-400'}`}>
              <ClipboardList size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${outstandingInstructions.length > 0 ? 'text-purple-400' : 'text-white'}`}>
              {outstandingInstructions.length}
            </span>
            <span className="text-[11px] text-slate-400">active</span>
          </div>
          <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80 flex items-center justify-between">
            <span>SAPS 5 instructions</span>
            <ArrowRight size={11} className="text-slate-500 group-hover:text-purple-400 transition-colors" />
          </p>
        </div>

        {/* 5. Dockets Awaiting Acknowledgement */}
        <div 
          onClick={() => onNavigateToCases('awaiting_ack')}
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group space-y-2 col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Transfers Pending</span>
            <div className={`p-2 rounded-xl ${docketsAwaitingAck.length > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
              <ArrowRightLeft size={16} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${docketsAwaitingAck.length > 0 ? 'text-emerald-400' : 'text-white'}`}>
              {docketsAwaitingAck.length}
            </span>
            <span className="text-[11px] text-slate-400">in-transit</span>
          </div>
          <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80 flex items-center justify-between">
            <span>Custody handover</span>
            <ArrowRight size={11} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </p>
        </div>

      </div>

      {/* CASES REQUIRING COMMANDER'S IMMEDIATE ATTENTION */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xs">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Cases Requiring Commander Attention</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  {immediateAttentionCases.length} priority items
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Unassigned cases, custody handovers, overdue reviews, and critical incidents
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateToCases('all')}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>View All Cases</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Content Table / Cards */}
        {immediateAttentionCases.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <CheckCircle2 size={32} className="text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">All supervisory actions up to date</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              No unassigned dockets, overdue supervisory reviews, or pending commander handovers.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/70">
            {immediateAttentionCases.map((c) => {
              const isUnassigned = !c.investigatingOfficerPersonnelNumber || c.investigatingOfficerName === 'Unassigned';
              const isCommanderCustodyPending = c.currentCustodianPersonnelNumber === commander.personnelNumber && !c.isCustodyAcknowledgedByDetective;
              const isReviewDue = c.scheduledReviewDate && c.scheduledReviewDate <= today;

              return (
                <div
                  key={c.id}
                  className="p-4 sm:p-5 hover:bg-slate-850/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {c.caseNumber}
                      </span>
                      <span className="text-xs font-semibold text-white">
                        {c.incidentType}
                      </span>
                      {isUnassigned && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          Awaiting Detective Assignment
                        </span>
                      )}
                      {!c.isCustodyAcknowledgedByDetective && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Custody Receipt Pending
                        </span>
                      )}
                      {isReviewDue && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          Supervisory Review Due
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-1">
                      Complainant: <span className="text-slate-300">{c.complainant.fullName}</span> • {c.incidentLocation.address}, {c.incidentLocation.suburb}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-mono">
                      <span>Investigator: <strong className={isUnassigned ? 'text-rose-400' : 'text-slate-300'}>{c.investigatingOfficerName}</strong></span>
                      <span>•</span>
                      <span>Custodian: <strong className="text-emerald-400">{c.currentCustodianName}</strong></span>
                      {c.scheduledReviewDate && (
                        <>
                          <span>•</span>
                          <span className={isReviewDue ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                            Review Date: {c.scheduledReviewDate}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {isUnassigned ? (
                      <button
                        type="button"
                        onClick={() => onOpenAssignModal(c)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <UserPlus size={14} />
                        <span>Assign Detective</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onOpenCase(c, isReviewDue ? 'supervisory-review' : 'overview')}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                      >
                        <span>Open Workspace</span>
                        <ArrowRight size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* QUICK WORKSPACE LINKS: DETECTIVES SUMMARY & STATION COMPLAINTS SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Detectives Under Supervision Summary */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <UserCheck size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Station Detectives Roster</h4>
                <p className="text-xs text-slate-400">Investigating officers under your command</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onNavigateToDetectives}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Detectives</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Monitor active case assignments, ensure balanced caseloads, inspect pending directives, and track docket receipts without gamified employee scores.
          </p>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Station Authorized Detectives:</span>
            <span className="font-mono font-bold text-white">4 Active Investigators</span>
          </div>
        </div>

        {/* Station Complaints Summary */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                <FileText size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Service & Case Complaints</h4>
                <p className="text-xs text-slate-400">Complainant accountability & conduct logs</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onNavigateToComplaints}
              className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
            >
              <span>View Complaints ({complaints.length})</span>
              <ArrowRight size={12} />
            </button>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Review service delivery grievances, investigate delays, record formal supervisory responses, and maintain transparent accountability for victims.
          </p>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Complaints Pending Review:</span>
            <span className="font-mono font-bold text-amber-400">
              {complaints.filter(c => c.status === 'Pending Review' || c.status === 'Under Investigation').length} Pending Action
            </span>
          </div>
        </div>

      </div>

      {/* CORE SFEN ACCOUNTABILITY BANNER */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck size={18} />
          </div>
          <div>
            <p className="font-bold text-white text-xs">
              SFEN Supervisory Accountability Framework
            </p>
            <p className="text-[11px] text-slate-400">
              No docket can be transferred or closed without documented supervisory oversight and cryptographic verification.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 font-mono text-[11px] text-emerald-400">
          <span>Commander Clearance: Level 3</span>
        </div>
      </div>

    </div>
  );
};
