import React from 'react';
import { IncidentReport, RegisteredCase } from '../../types/complainant';
import { UserProfile } from '../../types/auth';
import { OfficerNotification, OfficerTab, OfficerAuditLog } from '../../types/officer';
import { 
  FileText, 
  Briefcase, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  ArrowRightLeft
} from 'lucide-react';

interface OfficerDashboardViewProps {
  reports: IncidentReport[];
  cases: RegisteredCase[];
  notifications: OfficerNotification[];
  auditLogs: OfficerAuditLog[];
  officer: UserProfile;
  movementsCount?: number;
  onNavigate: (tab: OfficerTab) => void;
  onOpenReport?: (report: IncidentReport) => void;
}

export const OfficerDashboardView: React.FC<OfficerDashboardViewProps> = ({
  reports,
  cases,
  notifications,
  auditLogs,
  officer,
  movementsCount = 0,
  onNavigate,
  onOpenReport
}) => {
  const awaitingReviewReports = reports.filter(r => r.status === 'Awaiting Review');
  const inProgressReports = reports.filter(r => r.status === 'Under Station Review' || r.status === 'Additional Info Required');

  return (
    <div id="officer-dashboard-view" className="space-y-6">
      
      {/* Floating Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 pb-1">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Police Station Overview
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Station operations, citizen incident submissions, official case registration, and docket movement
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            id="btn-dash-review-reports"
            onClick={() => onNavigate('records')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <FileText size={15} />
            <span>View Cases & Reports</span>
          </button>
        </div>
      </div>

      {/* 4 Core Operational Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Reports Awaiting Review */}
        <div
          onClick={() => onNavigate('records')}
          className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Awaiting Review</span>
            <div className={`p-2 rounded-xl ${awaitingReviewReports.length > 0 ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
              <Clock size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${awaitingReviewReports.length > 0 ? 'text-amber-400' : 'text-white'}`}>
              {awaitingReviewReports.length}
            </span>
            <span className="text-[11px] text-slate-400">submissions</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
            {awaitingReviewReports.length > 0 ? 'Action required by station officer' : 'All reports processed'}
          </p>
        </div>

        {/* 2. In Processing */}
        <div
          onClick={() => onNavigate('records')}
          className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">In Processing</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <FileText size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {inProgressReports.length}
            </span>
            <span className="text-[11px] text-slate-400">active reviews</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
            Under review or awaiting info
          </p>
        </div>

        {/* 3. Registered Cases */}
        <div
          onClick={() => onNavigate('records')}
          className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Registered Cases</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Briefcase size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {cases.length}
            </span>
            <span className="text-[11px] text-slate-400">official CAS</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
            Station crime dockets
          </p>
        </div>

        {/* 4. Docket Movement */}
        <div
          onClick={() => onNavigate('docket-movement')}
          className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Docket Movement</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <ArrowRightLeft size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {movementsCount}
            </span>
            <span className="text-[11px] text-slate-400">transfers</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
            Branch handovers & transit
          </p>
        </div>

      </div>

      {/* RECENT OPERATIONAL TRACEABILITY & ACTIVITY REGISTER */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-blue-400" />
            <h3 className="text-sm sm:text-base font-bold text-white">
              Recent Registration Traceability & Action Logs
            </h3>
          </div>

          <span className="text-[11px] text-slate-400 font-mono">
            Automated Officer Audit Log
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {auditLogs.slice(0, 4).map((log) => (
            <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                <div className="space-y-0.5">
                  <p className="font-semibold text-white">
                    {log.description}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Officer: <strong className="text-slate-300">{log.officerRank} {log.officerName}</strong> ({log.personnelNumber}) • Ref: <span className="font-mono text-purple-300">{log.referenceNumber}</span>
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono text-slate-500 shrink-0">
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
