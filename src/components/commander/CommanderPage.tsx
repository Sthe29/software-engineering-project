import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types/auth';
import { DetectiveCaseDocket, SupervisorInstruction } from '../../types/detective';
import { 
  CommanderNavTab, 
  CommanderCaseTab, 
  StationComplaintRecord, 
  CommanderNotification,
  CommanderDetectiveWorkload 
} from '../../types/commander';
import { commanderService, AUTHORISED_STATION_DETECTIVES } from '../../services/commanderService';
import { CommanderTopNav } from './CommanderTopNav';
import { CommanderSidebar } from './CommanderSidebar';
import { CommanderDashboardView } from './CommanderDashboardView';
import { CommanderCasesView } from './CommanderCasesView';
import { CommanderDetectivesView } from './CommanderDetectivesView';
import { CommanderComplaintsView } from './CommanderComplaintsView';
import { CommanderDetectivesAndComplaintsView } from './CommanderDetectivesAndComplaintsView';
import { CommanderNotificationsView } from './CommanderNotificationsView';
import { CommanderProfileView } from './CommanderProfileView';
import { CommanderCaseWorkspaceModal } from './CommanderCaseWorkspaceModal';
import { CommanderAssignDetectiveModal } from './CommanderAssignDetectiveModal';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface CommanderPageProps {
  user: UserProfile;
  onSignOut: () => void;
}

export const CommanderPage: React.FC<CommanderPageProps> = ({
  user,
  onSignOut
}) => {
  const [activeTab, setActiveTab] = useState<CommanderNavTab>('dashboard');
  const [casesFilter, setCasesFilter] = useState<string>('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Data states
  const [cases, setCases] = useState<DetectiveCaseDocket[]>([]);
  const [instructions, setInstructions] = useState<SupervisorInstruction[]>([]);
  const [complaints, setComplaints] = useState<StationComplaintRecord[]>([]);
  const [notifications, setNotifications] = useState<CommanderNotification[]>([]);
  const [detectivesWorkload, setDetectivesWorkload] = useState<CommanderDetectiveWorkload[]>([]);

  // Modals
  const [activeWorkspaceCase, setActiveWorkspaceCase] = useState<DetectiveCaseDocket | null>(null);
  const [workspaceInitialTab, setWorkspaceInitialTab] = useState<CommanderCaseTab>('overview');
  const [activeAssignCase, setActiveAssignCase] = useState<DetectiveCaseDocket | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const refreshAllData = (syncWorkspaceCase = true) => {
    const freshCases = commanderService.getSupervisedCases();
    const freshInstructions = commanderService.getAllInstructions();
    const freshComplaints = commanderService.getStationComplaints();
    const freshNotifs = commanderService.getCommanderNotifications();
    const freshWorkload = commanderService.getDetectivesWorkload();

    setCases(freshCases);
    setInstructions(freshInstructions);
    setComplaints(freshComplaints);
    setNotifications(freshNotifs);
    setDetectivesWorkload(freshWorkload);

    if (syncWorkspaceCase && activeWorkspaceCase) {
      const refreshed = freshCases.find(c => c.caseNumber === activeWorkspaceCase.caseNumber);
      if (refreshed) {
        setActiveWorkspaceCase(refreshed);
      }
    }
  };

  useEffect(() => {
    refreshAllData(false);
  }, []);

  // Handlers for modal opening
  const handleOpenCaseWorkspace = (caseDocket: DetectiveCaseDocket, initialTab: CommanderCaseTab = 'overview') => {
    setActiveWorkspaceCase(caseDocket);
    setWorkspaceInitialTab(initialTab);
  };

  const handleOpenAssignModal = (caseDocket: DetectiveCaseDocket) => {
    setActiveAssignCase(caseDocket);
  };

  const handleConfirmAssignment = (params: {
    caseNumber: string;
    detectivePersonnelNumber: string;
    assignmentNotes?: string;
  }) => {
    const res = commanderService.assignDetectiveToCase({
      ...params,
      commander: user
    });

    if (res.success) {
      showToast(res.message, 'success');
      setActiveAssignCase(null);
      refreshAllData(true);
    } else {
      showToast(res.message, 'error');
    }
  };

  const handleOpenCaseByNumber = (caseNumber: string) => {
    const target = cases.find(c => c.caseNumber.trim().toUpperCase() === caseNumber.trim().toUpperCase());
    if (target) {
      handleOpenCaseWorkspace(target, 'overview');
    } else {
      setActiveTab('cases');
      showToast(`Case ${caseNumber} not found.`, 'error');
    }
  };

  const handleOpenComplaintById = (complaintId: string) => {
    setActiveTab('complaints');
  };

  const handleFilterCasesByDetective = (detectivePersonnelNumber: string) => {
    setCasesFilter('all');
    setActiveTab('cases');
  };

  const unreadNotifCount = notifications.filter(n => !n.read).length;
  const unassignedCount = cases.filter(
    c => !c.investigatingOfficerPersonnelNumber || c.investigatingOfficerName === 'Unassigned'
  ).length;
  const pendingComplaintsCount = complaints.filter(
    c => c.status === 'Pending Review' || c.status === 'Under Investigation'
  ).length;

  return (
    <div id="commander-portal" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navigation */}
      <CommanderTopNav
        user={user}
        activeTab={activeTab}
        onNavigate={(tab) => {
          setActiveTab(tab);
          if (tab === 'cases') setCasesFilter('all');
        }}
        onSignOut={onSignOut}
        unreadCount={unreadNotifCount}
        notifications={notifications}
        onMarkNotificationAsRead={(id) => {
          commanderService.markNotificationRead(id);
          refreshAllData(false);
        }}
        onMarkAllNotificationsAsRead={() => {
          commanderService.markAllNotificationsRead();
          refreshAllData(false);
        }}
        onOpenCaseByNumber={handleOpenCaseByNumber}
        onOpenComplaint={handleOpenComplaintById}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Body Container with Sidebar and Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto overflow-hidden">
        
        {/* Desktop Sidebar (Left) */}
        <div className="hidden md:block w-64 shrink-0">
          <CommanderSidebar
            activeTab={activeTab}
            onNavigate={(tab) => {
              setActiveTab(tab);
              if (tab === 'cases') setCasesFilter('all');
            }}
            onSignOut={onSignOut}
            casesCount={cases.length}
            unassignedCasesCount={unassignedCount}
            detectivesCount={AUTHORISED_STATION_DETECTIVES.length}
            pendingComplaintsCount={pendingComplaintsCount}
            unreadNotificationsCount={unreadNotifCount}
          />
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden flex"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsMobileMenuOpen(false);
            }}
          >
            <div className="w-72 h-full bg-slate-900 border-r border-slate-800 shadow-2xl animate-in slide-in-from-left duration-200">
              <CommanderSidebar
                activeTab={activeTab}
                onNavigate={(tab) => {
                  setActiveTab(tab);
                  setIsMobileMenuOpen(false);
                  if (tab === 'cases') setCasesFilter('all');
                }}
                onSignOut={onSignOut}
                casesCount={cases.length}
                unassignedCasesCount={unassignedCount}
                detectivesCount={AUTHORISED_STATION_DETECTIVES.length}
                pendingComplaintsCount={pendingComplaintsCount}
                unreadNotificationsCount={unreadNotifCount}
                onCloseMobileDrawer={() => setIsMobileMenuOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Scrollable View Content (Right) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          
          {/* Global Toast */}
          {toastMessage && (
            <div className={`mb-4 p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 animate-in fade-in ${
              toastMessage.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
            }`}>
              {toastMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{toastMessage.text}</span>
            </div>
          )}

          {/* VIEW: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <CommanderDashboardView
              commander={user}
              cases={cases}
              instructions={instructions}
              complaints={complaints}
              onOpenCase={handleOpenCaseWorkspace}
              onNavigateToCases={(filter) => {
                if (filter) setCasesFilter(filter);
                setActiveTab('cases');
              }}
              onNavigateToDetectives={() => setActiveTab('detectives')}
              onNavigateToComplaints={() => setActiveTab('complaints')}
              onOpenAssignModal={handleOpenAssignModal}
            />
          )}

          {/* VIEW: CASES */}
          {activeTab === 'cases' && (
            <CommanderCasesView
              cases={cases}
              initialFilter={casesFilter}
              onOpenCase={handleOpenCaseWorkspace}
              onOpenAssignModal={handleOpenAssignModal}
            />
          )}

          {/* VIEW: COMBINED DETECTIVES & COMPLAINTS */}
          {(activeTab === 'detectives-complaints' || activeTab === 'detectives' || activeTab === 'complaints') && (
            <CommanderDetectivesAndComplaintsView
              commander={user}
              detectivesWorkload={detectivesWorkload}
              complaints={complaints}
              cases={cases}
              initialSubTab={activeTab === 'complaints' ? 'complaints' : 'detectives'}
              onOpenCase={handleOpenCaseWorkspace}
              onOpenCaseByNumber={handleOpenCaseByNumber}
              onFilterCasesByDetective={handleFilterCasesByDetective}
              onRefreshComplaints={() => refreshAllData(false)}
            />
          )}

          {/* VIEW: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <CommanderNotificationsView
              notifications={notifications}
              onMarkNotificationAsRead={(id) => {
                commanderService.markNotificationRead(id);
                refreshAllData(false);
              }}
              onMarkAllNotificationsAsRead={() => {
                commanderService.markAllNotificationsRead();
                refreshAllData(false);
              }}
              onOpenCaseByNumber={handleOpenCaseByNumber}
              onOpenComplaint={handleOpenComplaintById}
            />
          )}

          {/* VIEW: PROFILE */}
          {activeTab === 'profile' && (
            <CommanderProfileView commander={user} />
          )}

        </main>
      </div>

      {/* SUPERVISORY CASE / DOCKET WORKSPACE MODAL */}
      {activeWorkspaceCase && (
        <CommanderCaseWorkspaceModal
          caseDocket={activeWorkspaceCase}
          commander={user}
          initialTab={workspaceInitialTab}
          onClose={() => {
            setActiveWorkspaceCase(null);
            refreshAllData(false);
          }}
          onOpenAssignModal={(c) => {
            setActiveAssignCase(c);
          }}
          onCaseUpdated={(updated) => {
            setActiveWorkspaceCase(updated);
            refreshAllData(true);
          }}
        />
      )}

      {/* ASSIGN DETECTIVE SUB-MODAL */}
      {activeAssignCase && (
        <CommanderAssignDetectiveModal
          caseDocket={activeAssignCase}
          detectives={AUTHORISED_STATION_DETECTIVES}
          commander={user}
          onClose={() => setActiveAssignCase(null)}
          onConfirmAssignment={handleConfirmAssignment}
        />
      )}

    </div>
  );
};
