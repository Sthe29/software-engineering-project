import React, { useState } from 'react';
import { DetectiveCaseDocket, SupervisorInstruction, CaseWorkspaceTab } from '../../types/detective';
import { 
  Briefcase, 
  ClipboardList, 
  Search, 
  Filter, 
  ArrowRight, 
  Calendar, 
  Clock, 
  FolderOpen
} from 'lucide-react';

interface DetectiveCasesAndDirectivesViewProps {
  cases: DetectiveCaseDocket[];
  instructions: SupervisorInstruction[];
  onOpenCase: (caseData: DetectiveCaseDocket, initialTab?: CaseWorkspaceTab) => void;
  initialSubTab?: 'cases' | 'directives';
}

export const DetectiveCasesAndDirectivesView: React.FC<DetectiveCasesAndDirectivesViewProps> = ({
  cases,
  instructions,
  onOpenCase,
  initialSubTab = 'cases'
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'cases' | 'directives'>(initialSubTab);

  // Search & Filter state for Cases
  const [caseSearchQuery, setCaseSearchQuery] = useState('');
  const [caseStatusFilter, setCaseStatusFilter] = useState<'ALL' | 'Investigation Active' | 'Evidence Analysis' | 'Docket at NPA / Court' | 'Case Finalized'>('ALL');

  // Search & Filter state for Directives
  const [directiveSearchQuery, setDirectiveSearchQuery] = useState('');
  const [directiveStatusFilter, setDirectiveStatusFilter] = useState<'ALL' | 'OUTSTANDING' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');

  const filteredCases = cases.filter(c => {
    const matchesSearch = 
      c.caseNumber.toLowerCase().includes(caseSearchQuery.toLowerCase()) ||
      c.incidentType.toLowerCase().includes(caseSearchQuery.toLowerCase()) ||
      c.complainant.fullName.toLowerCase().includes(caseSearchQuery.toLowerCase()) ||
      (c.reportReference && c.reportReference.toLowerCase().includes(caseSearchQuery.toLowerCase()));

    const matchesStatus = caseStatusFilter === 'ALL' || c.currentStatus === caseStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredInstructions = instructions.filter(i => {
    const matchesStatus = directiveStatusFilter === 'ALL' || i.status === directiveStatusFilter;
    const matchesSearch = 
      i.caseNumber.toLowerCase().includes(directiveSearchQuery.toLowerCase()) ||
      i.instructionText.toLowerCase().includes(directiveSearchQuery.toLowerCase()) ||
      i.issuedBy.toLowerCase().includes(directiveSearchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const outstandingInstructionsCount = instructions.filter(i => i.status === 'OUTSTANDING').length;
  const casesNeedingCustodyAckCount = cases.filter(c => !c.isCustodyAcknowledgedByDetective).length;

  return (
    <div id="detective-cases-and-directives-view" className="space-y-6">
      
      {/* Floating Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 pb-1">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Cases & Directives
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Assigned investigation dockets and commander SAPS 5 directives allocated to your desk
          </p>
        </div>

        {/* Combined Quick Statistics */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            {cases.length} {cases.length === 1 ? 'Docket' : 'Dockets'}
          </span>
          {outstandingInstructionsCount > 0 && (
            <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold">
              {outstandingInstructionsCount} Directives Due
            </span>
          )}
          {casesNeedingCustodyAckCount > 0 && (
            <span className="px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/30 text-xs font-mono">
              {casesNeedingCustodyAckCount} Receipt Pending
            </span>
          )}
        </div>
      </div>

      {/* Main Combined Sub-Tabs Bar */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800">
        <button
          type="button"
          id="btn-subtab-assigned-cases"
          onClick={() => setActiveSubTab('cases')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'cases'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Briefcase size={16} />
          <span>Assigned Dockets</span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
            activeSubTab === 'cases'
              ? 'bg-black/20 text-white'
              : 'bg-slate-800 text-slate-400'
          }`}>
            {cases.length}
          </span>
        </button>

        <button
          type="button"
          id="btn-subtab-supervisor-directives"
          onClick={() => setActiveSubTab('directives')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'directives'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <ClipboardList size={16} />
          <span>Supervisor Directives</span>
          {outstandingInstructionsCount > 0 ? (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-extrabold animate-pulse">
              {outstandingInstructionsCount} Due
            </span>
          ) : (
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
              activeSubTab === 'directives'
                ? 'bg-black/20 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}>
              {instructions.length}
            </span>
          )}
        </button>
      </div>

      {/* ================= SECTION 1: ASSIGNED CASES ================= */}
      {activeSubTab === 'cases' && (
        <div className="space-y-4">
          {/* Filter & Search for Cases */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={caseSearchQuery}
                onChange={(e) => setCaseSearchQuery(e.target.value)}
                placeholder="Search dockets by CAS number (e.g. CAS 342), offence, complainant..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter size={14} className="text-slate-400 shrink-0 hidden sm:block" />
              <select
                value={caseStatusFilter}
                onChange={(e) => setCaseStatusFilter(e.target.value as any)}
                className="w-full sm:w-auto px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="ALL">All Case Phases</option>
                <option value="Investigation Active">Investigation Active</option>
                <option value="Evidence Analysis">Evidence Analysis</option>
                <option value="Docket at NPA / Court">Docket at NPA / Court</option>
                <option value="Case Finalized">Case Finalized</option>
              </select>
            </div>
          </div>

          {filteredCases.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
              <Briefcase size={32} className="text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-white">No assigned cases found</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {caseSearchQuery 
                  ? 'No assigned dockets match your search query.'
                  : 'You currently have no investigation cases assigned to your personnel profile.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCases.map((c) => {
                const needsCustodyAck = !c.isCustodyAcknowledgedByDetective;
                const caseDirectives = instructions.filter(i => i.caseNumber === c.caseNumber);
                const pendingDirectives = caseDirectives.filter(i => i.status === 'OUTSTANDING');

                return (
                  <div
                    key={c.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group ${
                      needsCustodyAck
                        ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    {/* Essential Info Left */}
                    <div className="space-y-2 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-sm sm:text-base font-bold text-amber-300">
                          {c.caseNumber}
                        </span>

                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                          {c.currentStatus}
                        </span>

                        {needsCustodyAck && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                            Awaiting Your Receipt
                          </span>
                        )}

                        {pendingDirectives.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setDirectiveSearchQuery(c.caseNumber);
                              setActiveSubTab('directives');
                            }}
                            className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 cursor-pointer transition-colors"
                          >
                            {pendingDirectives.length} Directive{pendingDirectives.length > 1 ? 's' : ''} Due
                          </button>
                        )}

                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.priorityLevel === 'Urgent' || c.priorityLevel === 'Critical'
                            ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {c.priorityLevel} Priority
                        </span>
                      </div>

                      {/* Offence / Category */}
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                          {c.incidentType}
                        </h3>
                        {c.offenceSubcategory && (
                          <p className="text-xs text-slate-400 truncate">
                            {c.offenceSubcategory}
                          </p>
                        )}
                      </div>

                      {/* Date Assigned & Date of Last Activity */}
                      <div className="flex items-center gap-3 text-xs text-slate-400 font-mono flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar size={13} className="text-slate-500" />
                          Date Assigned: <strong className="text-slate-300">{c.assignedDate}</strong>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={13} className="text-slate-500" />
                          Last Activity: <strong className="text-slate-300">{c.lastActivityDate}</strong>
                        </span>
                        <span>•</span>
                        <span className="text-slate-400">
                          Complainant: <strong className="text-slate-300">{c.complainant.fullName}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                      <button
                        type="button"
                        id={`btn-open-case-${c.caseNumber.replace(/[^a-zA-Z0-9]/g, '-')}`}
                        onClick={() => onOpenCase(c, 'overview')}
                        className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                      >
                        <FolderOpen size={15} />
                        <span>Open Case</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= SECTION 2: SUPERVISOR DIRECTIVES ================= */}
      {activeSubTab === 'directives' && (
        <div className="space-y-4">
          {/* Filter & Search for Directives */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={directiveSearchQuery}
                onChange={(e) => setDirectiveSearchQuery(e.target.value)}
                placeholder="Search directives by CAS number, directive instructions, or commander..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter size={14} className="text-slate-400 shrink-0 hidden sm:block" />
              <select
                value={directiveStatusFilter}
                onChange={(e) => setDirectiveStatusFilter(e.target.value as any)}
                className="w-full sm:w-auto px-3 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="ALL">All Directive Statuses</option>
                <option value="OUTSTANDING">Outstanding</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          {filteredInstructions.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-2">
              <ClipboardList size={32} className="text-slate-600 mx-auto" />
              <p className="text-sm font-bold text-white">No directives found</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {directiveSearchQuery 
                  ? 'No instructions match your search criteria.' 
                  : 'There are currently no supervisor directives on your assigned dockets.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredInstructions.map((inst) => {
                const matchedCase = cases.find(c => c.caseNumber === inst.caseNumber);

                return (
                  <div
                    key={inst.id}
                    onClick={() => {
                      if (matchedCase) onOpenCase(matchedCase, 'instructions');
                    }}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer space-y-3 group ${
                      inst.status === 'COMPLETED'
                        ? 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700'
                        : 'bg-slate-900/90 border-slate-800 hover:border-amber-500/40 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs sm:text-sm font-bold text-amber-300">
                          {inst.caseNumber}
                        </span>
                        {inst.offenceCategory && (
                          <span className="text-xs text-slate-400">
                            • {inst.offenceCategory}
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inst.status === 'COMPLETED'
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : inst.status === 'IN_PROGRESS'
                            ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        }`}>
                          {inst.status}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inst.priority === 'Critical' || inst.priority === 'Urgent'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {inst.priority}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 font-mono">
                        Issued by: {inst.issuedByRank} {inst.issuedBy} ({inst.issuedByPersonnelNumber})
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
                        "{inst.instructionText}"
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-xs">
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono flex-wrap">
                        <span>Issued: {new Date(inst.issuedAt).toLocaleDateString()}</span>
                        {inst.requiredReviewDate && (
                          <>
                            <span>•</span>
                            <span className="text-amber-400 font-semibold">Review Due: {inst.requiredReviewDate}</span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all">
                        <span>Open Case to Respond</span>
                        <ArrowRight size={13} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
