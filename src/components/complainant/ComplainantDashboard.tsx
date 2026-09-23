import React, { useState, useEffect } from 'react';
import { CitizenProfile } from '../../types/auth';
import { 
  ComplainantTab, 
  IncidentReport, 
  RegisteredCase, 
  ServiceComplaint, 
  ComplainantNotification 
} from '../../types/complainant';
import { 
  getIncidentReports, 
  getRegisteredCases, 
  getServiceComplaints, 
  getNotifications 
} from '../../services/complainantService';
import { ComplainantTopNav } from './ComplainantTopNav';
import { ComplainantSidebar } from './ComplainantSidebar';
import { DashboardOverview } from './DashboardOverview';
import { ReportIncidentForm } from './ReportIncidentForm';
import { CombinedRecordsView } from './CombinedRecordsView';
import { ProfileView } from './ProfileView';

interface ComplainantDashboardProps {
  citizen: CitizenProfile;
  onSignOut: () => void;
  onUpdateCitizen: (updated: CitizenProfile) => void;
}

export const ComplainantDashboard: React.FC<ComplainantDashboardProps> = ({
  citizen,
  onSignOut,
  onUpdateCitizen
}) => {
  const [activeTab, setActiveTab] = useState<ComplainantTab>('dashboard');
  const [recordsSubTab, setRecordsSubTab] = useState<'cases' | 'reports' | 'complaints'>('cases');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Complainant Data State
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [cases, setCases] = useState<RegisteredCase[]>([]);
  const [complaints, setComplaints] = useState<ServiceComplaint[]>([]);
  const [notifications, setNotifications] = useState<ComplainantNotification[]>([]);

  const loadData = () => {
    setReports(getIncidentReports(citizen.id));
    setCases(getRegisteredCases(citizen.id));
    setComplaints(getServiceComplaints(citizen.id));
    setNotifications(getNotifications(citizen.id));
  };

  useEffect(() => {
    loadData();
  }, [citizen.id]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleReportSubmitted = (newReport: IncidentReport) => {
    loadData();
    setRecordsSubTab('reports');
    setActiveTab('my-records');
  };

  const handleNavigate = (tab: ComplainantTab) => {
    if (tab === 'my-cases') {
      setRecordsSubTab('cases');
      setActiveTab('my-records');
    } else if (tab === 'my-reports') {
      setRecordsSubTab('reports');
      setActiveTab('my-records');
    } else if (tab === 'complaints') {
      setRecordsSubTab('complaints');
      setActiveTab('my-records');
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div id="complainant-portal-shell" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
      
      {/* Top Navbar */}
      <ComplainantTopNav
        citizen={citizen}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          handleNavigate(tab);
          setMobileMenuOpen(false);
        }}
        unreadCount={unreadCount}
        notifications={notifications}
        onRefreshNotifications={loadData}
        onSignOut={onSignOut}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div 
          id="complainant-mobile-drawer-overlay"
          className="md:hidden fixed inset-x-0 top-16 z-30 bg-slate-950/95 border-b border-slate-800 p-4 backdrop-blur-xl shadow-2xl animate-fade-in"
        >
          <ComplainantSidebar
            activeTab={activeTab}
            onSelectTab={(tab) => {
              handleNavigate(tab);
              setMobileMenuOpen(false);
            }}
            reportCount={reports.length}
            caseCount={cases.length}
            complaintCount={complaints.length}
            unreadNotifications={unreadCount}
            onSignOut={onSignOut}
            isMobileDrawer={true}
            onCloseMobileDrawer={() => setMobileMenuOpen(false)}
          />
        </div>
      )}

      {/* Main Body Layout: Sidebar + Main Views */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex">
        
        {/* Desktop Sidebar */}
        <div className="hidden md:block shrink-0 border-r border-slate-800/80">
          <div className="sticky top-20">
            <ComplainantSidebar
              activeTab={activeTab}
              onSelectTab={handleNavigate}
              reportCount={reports.length}
              caseCount={cases.length}
              complaintCount={complaints.length}
              unreadNotifications={unreadCount}
              onSignOut={onSignOut}
            />
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 min-w-0 py-6 sm:py-8 md:pl-8">
          
          {activeTab === 'dashboard' && (
            <DashboardOverview
              citizen={citizen}
              reports={reports}
              cases={cases}
              complaints={complaints}
              notifications={notifications}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'report-incident' && (
            <ReportIncidentForm
              citizen={citizen}
              onReportSubmitted={handleReportSubmitted}
              onNavigate={handleNavigate}
            />
          )}

          {(activeTab === 'my-records' || activeTab === 'my-reports' || activeTab === 'my-cases' || activeTab === 'complaints') && (
            <CombinedRecordsView
              citizen={citizen}
              reports={reports}
              cases={cases}
              complaints={complaints}
              initialSubTab={recordsSubTab}
              onRefreshData={loadData}
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView
              citizen={citizen}
              onUpdateCitizen={onUpdateCitizen}
            />
          )}

        </main>
      </div>

      {/* Legal & Statutory Police Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 py-5 px-4 sm:px-6 mt-12 text-center md:text-left text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="space-y-0.5">
            <p className="font-semibold text-slate-400">
              National Police Service • Secure File & Evidence Network (SFEN) Complainant Portal
            </p>
            <p className="text-[11px] text-slate-500 max-w-2xl leading-relaxed">
              Protected under the Criminal Procedure Act, Data Protection Act, and Evidence Directives. False reporting or fabrication of criminal complaints is a punishable crime.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400 shrink-0">
            <span>SFEN v2.4.0 (Citizen)</span>
            <span>•</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer" onClick={() => handleNavigate('complaints')}>
              File Grievance
            </span>
            <span>•</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer" onClick={() => handleNavigate('profile')}>
              Account Privacy
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
