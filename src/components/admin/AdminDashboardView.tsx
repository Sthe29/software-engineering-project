import React, { useState } from 'react';
import { AdminTab, AdminActivityLog, ConfiguredPoliceStation } from '../../types/admin';
import { 
  Users, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Building2, 
  UserPlus, 
  MapPin, 
  Phone, 
  Clock, 
  User, 
  Navigation, 
  ExternalLink, 
  X,
  Sparkles
} from 'lucide-react';

interface AdminDashboardViewProps {
  stats: {
    totalUsers: number;
    activePersonnel: number;
    complainantAccounts: number;
    inactiveAccounts: number;
    personnelCount: number;
    recentActivity: AdminActivityLog[];
  };
  station: ConfiguredPoliceStation;
  onNavigate: (tab: AdminTab) => void;
  onOpenAddPersonnel: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  stats,
  station,
  onNavigate,
  onOpenAddPersonnel
}) => {
  const [isStationModalOpen, setIsStationModalOpen] = useState(false);

  return (
    <div id="admin-dashboard-view" className="space-y-6">
      {/* Floating Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 pb-1">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Administrative Overview
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            System administration, user account metrics, and station management for SFEN.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            id="btn-dash-add-personnel"
            onClick={onOpenAddPersonnel}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <UserPlus size={15} />
            <span>Add Personnel</span>
          </button>
        </div>
      </div>

      {/* 4 Core Administrative Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Users</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Users size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {stats.totalUsers}
            </span>
            <span className="text-[11px] text-slate-400">All registered</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
            Personnel + Complainants
          </p>
        </div>

        {/* Active Personnel Accounts */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Active Personnel</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {stats.activePersonnel}
            </span>
            <span className="text-[11px] text-blue-400 font-semibold">Authorized</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
            Across police roles
          </p>
        </div>

        {/* Complainant Accounts */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Complainants</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <UserCheck size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {stats.complainantAccounts}
            </span>
            <span className="text-[11px] text-slate-400">Public accounts</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
            Verified docket access
          </p>
        </div>

        {/* Inactive Accounts */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Inactive Accounts</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <UserX size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {stats.inactiveAccounts}
            </span>
            <span className="text-[11px] text-amber-400 font-semibold">Disabled</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
            Pending review or suspended
          </p>
        </div>
      </div>

      {/* Managed Police Station Card - Clean & Simple */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
            <Building2 size={24} />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Managed Station
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {station.name}
            </h3>
            <p className="text-xs text-slate-300">
              Station Commander: <strong className="text-slate-100">{station.stationCommander}</strong> • {station.address}, {station.suburb}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center shrink-0">
          <button
            type="button"
            id="btn-dash-view-station-info"
            onClick={() => setIsStationModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Building2 size={15} className="text-blue-400" />
            <span>View Station Info</span>
          </button>
        </div>
      </div>

      {/* Reserved Space for AI Analysis */}
      <div 
        id="admin-ai-analysis-container" 
        className="p-8 sm:p-10 rounded-2xl bg-slate-900/60 border border-slate-800 border-dashed min-h-[240px] flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden"
      >
        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shadow-xs">
          <Sparkles size={22} />
        </div>
        <div className="space-y-1 max-w-md">
          <h3 className="text-base sm:text-lg font-extrabold text-white">
            AI Analysis
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Reserved space for AI administrative analysis and intelligent system insights.
          </p>
        </div>
      </div>

      {/* =========================================================================
          MODAL: VIEW STATION DETAILS
          ========================================================================= */}
      {isStationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white">
                    {station.name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Station Details & Contact Directory
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsStationModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Station Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {/* Station Commander */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <User size={13} className="text-blue-400" />
                  <span>Station Commander</span>
                </div>
                <p className="text-xs font-semibold text-white">
                  {station.stationCommander}
                </p>
              </div>

              {/* Operating Hours */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <Clock size={13} className="text-emerald-400" />
                  <span>Operating Hours</span>
                </div>
                <p className="text-xs font-semibold text-emerald-300">
                  {station.operatingHours}
                </p>
              </div>

              {/* Physical Address */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1 sm:col-span-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <MapPin size={13} className="text-purple-400" />
                  <span>Physical Address</span>
                </div>
                <p className="text-xs text-slate-200">
                  {station.address}, {station.suburb}, {station.city}, {station.province} {station.postalCode}
                </p>
              </div>

              {/* Station Lines */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <Phone size={13} className="text-blue-400" />
                  <span>Main Station Phone</span>
                </div>
                <p className="text-xs font-mono font-bold text-white">
                  {station.phone}
                </p>
              </div>

              {/* Emergency Patrol Line */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <Phone size={13} className="text-rose-400" />
                  <span>Sector Patrol Line</span>
                </div>
                <p className="text-xs font-mono font-bold text-rose-300">
                  {station.emergencyPhone}
                </p>
              </div>

              {/* GPS Coordinates */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1 sm:col-span-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                  <Navigation size={13} className="text-amber-400" />
                  <span>Geographic Location</span>
                </div>
                <p className="text-xs font-mono text-slate-300">
                  Lat: {station.latitude.toFixed(4)}, Lng: {station.longitude.toFixed(4)}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(station.name + ' ' + station.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1.5 font-medium"
              >
                <ExternalLink size={13} />
                <span>Open in Google Maps</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsStationModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
