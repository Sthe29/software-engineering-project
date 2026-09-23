import React, { useState } from 'react';
import { CitizenProfile } from '../../types/auth';
import { 
  IncidentReport, 
  RegisteredCase, 
  ServiceComplaint, 
  ComplainantNotification,
  ComplainantTab 
} from '../../types/complainant';
import { 
  FileText, 
  Briefcase, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Building2, 
  ChevronDown, 
  ChevronUp,
  ChevronRight
} from 'lucide-react';

interface DashboardOverviewProps {
  citizen: CitizenProfile;
  reports: IncidentReport[];
  cases: RegisteredCase[];
  complaints: ServiceComplaint[];
  notifications?: ComplainantNotification[];
  onNavigate: (tab: ComplainantTab) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  citizen,
  reports,
  cases,
  complaints,
  onNavigate
}) => {
  // Completely isolated dropdown states - both default to shut so user can open one while the other is shut
  const [isCasesOpen, setIsCasesOpen] = useState(false);

  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string>(reports[0]?.id || '');

  const activeReport = reports.find((r) => r.id === selectedReportId) || reports[0];

  const awaitingReports = reports.filter((r) => r.status === 'Awaiting Review' || r.status === 'Under Station Review');
  const activeCases = cases.filter((c) => c.currentStatus !== 'Case Finalized');

  return (
    <div id="complainant-dashboard-view" className="space-y-6 animate-fade-in">
      
      {/* Floating Welcome Header (No enclosing box, floating freely) */}
      <div className="pt-1 pb-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Welcome back, {citizen.fullName || 'User'}
        </h1>
      </div>

      {/* Quick Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Metric 1: Registered Cases */}
        <div 
          onClick={() => onNavigate('my-cases')}
          className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Registered Cases (CAS)</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
              <Briefcase size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white font-mono">{cases.length}</span>
              <span className="text-[11px] text-slate-400">cases</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-blue-400">
              <ShieldCheck size={12} />
              <span>{activeCases.length} active investigations</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Incident Reports */}
        <div 
          onClick={() => onNavigate('my-reports')}
          className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Incident Reports</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
              <FileText size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white font-mono">{reports.length}</span>
              <span className="text-[11px] text-slate-400">submitted</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-400">
              <Clock size={12} />
              <span>{awaitingReports.length} awaiting station review</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Service Complaints */}
        <div 
          onClick={() => onNavigate('complaints')}
          className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Service Complaints</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
              <AlertCircle size={16} />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white font-mono">{complaints.length}</span>
              <span className="text-[11px] text-slate-400">logged</span>
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11px] text-amber-400">
              <Building2 size={12} />
              <span>Station Commander level</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dropdowns Section: Stacked vertically so each operates 100% independently without grid stretch */}
      <div className="space-y-4">
        
        {/* Dropdown 1: Registered Cases (CAS) */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-all shadow-sm">
          <button
            type="button"
            id="btn-toggle-cases-dropdown"
            onClick={() => setIsCasesOpen((prev) => !prev)}
            className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left hover:bg-slate-800/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
                <Briefcase size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-sm sm:text-base font-bold text-white">Registered Cases (CAS)</h3>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 font-semibold border border-blue-500/30">
                    {cases.length} {cases.length === 1 ? 'Docket' : 'Dockets'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isCasesOpen ? 'Click to collapse case information' : 'Click to view registered police cases & detective progress'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400 shrink-0">
              <span className="text-xs font-semibold hidden sm:inline text-slate-400">
                {isCasesOpen ? 'Close' : 'Open'}
              </span>
              <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
                {isCasesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>
          </button>

          {isCasesOpen && (
            <div className="p-5 pt-1 border-t border-slate-800/80 space-y-4 animate-fade-in">
              {cases.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs bg-slate-950/40 rounded-xl border border-slate-800/80 p-4">
                  No registered police cases yet.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {cases.map((c) => (
                    <div 
                      key={c.id} 
                      className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                          <Briefcase size={16} />
                        </div>
                        <span className="font-mono font-bold text-sm sm:text-base text-blue-400 tracking-wide">
                          {c.caseNumber}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onNavigate('my-cases')}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer self-start sm:self-center"
                      >
                        <span>View Docket Timeline</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Dropdown 2: Recent Incident Reports */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden transition-all shadow-sm">
          <button
            type="button"
            id="btn-toggle-reports-dropdown"
            onClick={() => setIsReportsOpen((prev) => !prev)}
            className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left hover:bg-slate-800/40 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                <FileText size={18} />
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-sm sm:text-base font-bold text-white">Recent Incident Reports</h3>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/30">
                    {reports.length} {reports.length === 1 ? 'Report' : 'Reports'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isReportsOpen ? 'Click to collapse report details' : 'Click to view submitted online incident reports'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400 shrink-0">
              <span className="text-xs font-semibold hidden sm:inline text-slate-400">
                {isReportsOpen ? 'Close' : 'Open'}
              </span>
              <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300">
                {isReportsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>
          </button>

          {isReportsOpen && (
            <div className="p-5 pt-1 border-t border-slate-800/80 space-y-4 animate-fade-in">
              {reports.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs bg-slate-950/40 rounded-xl border border-slate-800/80 p-4 space-y-2">
                  <p>You haven't submitted any incident reports yet.</p>
                  <button
                    type="button"
                    onClick={() => onNavigate('my-reports')}
                    className="text-xs text-emerald-400 font-bold hover:underline cursor-pointer"
                  >
                    View Reports in My Records →
                  </button>
                </div>
              ) : (
                <>
                  {/* Report Selector Dropdown if multiple reports exist */}
                  {reports.length > 1 && (
                    <div className="space-y-1.5">
                      <label htmlFor="select-dashboard-report" className="text-xs font-semibold text-slate-300 block">
                        Select Incident Report:
                      </label>
                      <select
                        id="select-dashboard-report"
                        value={activeReport?.id || ''}
                        onChange={(e) => setSelectedReportId(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                      >
                        {reports.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.referenceNumber} — {r.incidentType} ({r.policeStation})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Selected Report Details Card */}
                  {activeReport && (
                    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-mono font-bold text-sm sm:text-base text-emerald-400">
                              {activeReport.referenceNumber}
                            </span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                              activeReport.status === 'Registered to Case'
                                ? 'bg-blue-500/15 border-blue-500/30 text-blue-300'
                                : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                            }`}>
                              {activeReport.status}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-white mt-1">
                            {activeReport.incidentType}
                          </p>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          Date: {activeReport.incidentDate}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                        <Building2 size={14} className="text-emerald-400 shrink-0" />
                        <span className="text-slate-300">{activeReport.policeStation}</span>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                        {activeReport.description}
                      </p>

                      {activeReport.linkedCaseNumber && (
                        <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-500/20 text-xs text-blue-300 flex items-center justify-between flex-wrap gap-2">
                          <span>Converted to Official Police Docket:</span>
                          <span className="font-mono font-bold text-blue-200">{activeReport.linkedCaseNumber}</span>
                        </div>
                      )}

                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => onNavigate('my-reports')}
                          className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Open Report in My Records</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
