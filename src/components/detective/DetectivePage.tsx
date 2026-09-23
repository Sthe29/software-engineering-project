import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types/auth';
import { 
  DetectiveNavTab, 
  DetectiveCaseDocket, 
  CaseWorkspaceTab,
  SupervisorInstruction,
  DetectiveNotification 
} from '../../types/detective';
import { detectiveService } from '../../services/detectiveService';
import { DetectiveSidebar } from './DetectiveSidebar';
import { DetectiveTopNav } from './DetectiveTopNav';
import { DetectiveDashboardView } from './DetectiveDashboardView';
import { DetectiveCasesAndDirectivesView } from './DetectiveCasesAndDirectivesView';
import { DetectiveNotificationsView } from './DetectiveNotificationsView';
import { DetectiveProfileView } from './DetectiveProfileView';
import { DetectiveCaseWorkspaceModal } from './DetectiveCaseWorkspaceModal';

interface DetectivePageProps {
  user: UserProfile;
  onSignOut: () => void;
}

export const DetectivePage: React.FC<DetectivePageProps> = ({ user, onSignOut }) => {
  const [activeTab, setActiveTab] = useState<DetectiveNavTab>('dashboard');
  const [casesSubTab, setCasesSubTab] = useState<'cases' | 'directives'>('cases');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Detective State
  const [assignedCases, setAssignedCases] = useState<DetectiveCaseDocket[]>([]);
  const [allInstructions, setAllInstructions] = useState<SupervisorInstruction[]>([]);
  const [notifications, setNotifications] = useState<DetectiveNotification[]>([]);

  // Open Case Workspace State
  const [selectedCaseForWorkspace, setSelectedCaseForWorkspace] = useState<DetectiveCaseDocket | null>(null);
  const [workspaceInitialTab, setWorkspaceInitialTab] = useState<CaseWorkspaceTab>('overview');

  // Toast feedback banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Load detective's data strictly filtered to their personnel profile
  const refreshDetectiveData = (syncActiveWorkspace: boolean = true) => {
    const cases = detectiveService.getAssignedCases(user.personnelNumber);
    const insts = detectiveService.getSupervisorInstructions({ detectivePersonnelNumber: user.personnelNumber });
    const notifs = detectiveService.getDetectiveNotifications(user.personnelNumber);

    setAssignedCases(cases);
    setAllInstructions(insts);
    setNotifications(notifs);

    // If requested and a workspace is currently open, refresh its data too
    if (syncActiveWorkspace && selectedCaseForWorkspace) {
      const updatedCurrent = detectiveService.getCaseByNumber(selectedCaseForWorkspace.caseNumber, user.personnelNumber);
      if (updatedCurrent) {
        setSelectedCaseForWorkspace(updatedCurrent);
      }
    }
  };

  useEffect(() => {
    refreshDetectiveData(true);
  }, [user.personnelNumber]);

  // Calculations for badges
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const outstandingInstructionsCount = allInstructions.filter(i => i.status === 'OUTSTANDING').length;

  const handleOpenCase = (
    caseData: DetectiveCaseDocket, 
    initialTab: CaseWorkspaceTab = 'overview'
  ) => {
    setSelectedCaseForWorkspace(caseData);
    setWorkspaceInitialTab(initialTab);
  };

  const handleOpenCaseByNumber = (
    caseNumber: string,
    initialTab: CaseWorkspaceTab = 'overview'
  ) => {
    const found = assignedCases.find(c => c.caseNumber === caseNumber);
    if (found) {
      setSelectedCaseForWorkspace(found);
      setWorkspaceInitialTab(initialTab);
    } else {
      setCasesSubTab('cases');
      setActiveTab('cases');
    }
  };

  const handleCloseCaseWorkspace = () => {
    setSelectedCaseForWorkspace(null);
    refreshDetectiveData(false);
  };

  const handleMarkNotificationRead = (id: string) => {
    detectiveService.markNotificationRead(id);
    refreshDetectiveData();
  };

  const handleMarkAllNotificationsRead = () => {
    detectiveService.markAllNotificationsRead();
    refreshDetectiveData();
  };

  const handleNavigateToCases = (subTab: 'cases' | 'directives' = 'cases') => {
    setCasesSubTab(subTab);
    setActiveTab('cases');
  };

  return (
    <div id="detective-page-container" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-600 selection:text-white relative">
      
      {/* Toast Feedback Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-xl bg-amber-600 text-white shadow-2xl border border-amber-400 text-xs font-bold animate-in slide-in-from-top-2 duration-200 flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <DetectiveTopNav
        user={user}
        activeTab={activeTab}
        onNavigate={(tab) => {
          if (tab === 'instructions') {
            setCasesSubTab('directives');
            setActiveTab('cases');
          } else {
            setActiveTab(tab);
          }
        }}
        onSignOut={onSignOut}
        unreadCount={unreadNotificationsCount}
        notifications={notifications}
        onMarkNotificationAsRead={handleMarkNotificationRead}
        onMarkAllNotificationsAsRead={handleMarkAllNotificationsRead}
        onOpenCaseByNumber={handleOpenCaseByNumber}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden flex flex-col pt-16 px-4 pb-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex-1 flex flex-col justify-between overflow-y-auto">
            <DetectiveSidebar
              activeTab={activeTab}
              onSelectTab={(tab) => {
                if (tab === 'instructions') {
                  setCasesSubTab('directives');
                  setActiveTab('cases');
                } else {
                  setActiveTab(tab);
                }
                setIsMobileMenuOpen(false);
              }}
              casesCount={assignedCases.length}
              outstandingInstructionsCount={outstandingInstructionsCount}
              onSignOut={onSignOut}
              isMobileDrawer={true}
              onCloseMobileDrawer={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Container: Sidebar + Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        
        {/* Desktop Sidebar Navigation */}
        <div className="hidden md:block shrink-0">
          <DetectiveSidebar
            activeTab={activeTab}
            onSelectTab={(tab) => {
              if (tab === 'instructions') {
                setCasesSubTab('directives');
                setActiveTab('cases');
              } else {
                setActiveTab(tab);
              }
            }}
            casesCount={assignedCases.length}
            outstandingInstructionsCount={outstandingInstructionsCount}
            onSignOut={onSignOut}
          />
        </div>

        {/* Dynamic Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && (
            <DetectiveDashboardView
              detective={user}
              cases={assignedCases}
              instructions={allInstructions}
              onOpenCase={handleOpenCase}
              onNavigateToCases={handleNavigateToCases}
              onNavigateToInstructions={() => handleNavigateToCases('directives')}
            />
          )}

          {(activeTab === 'cases' || activeTab === 'instructions') && (
            <DetectiveCasesAndDirectivesView
              cases={assignedCases}
              instructions={allInstructions}
              onOpenCase={handleOpenCase}
              initialSubTab={activeTab === 'instructions' ? 'directives' : casesSubTab}
            />
          )}

          {activeTab === 'notifications' && (
            <DetectiveNotificationsView
              notifications={notifications}
              cases={assignedCases}
              onMarkRead={handleMarkNotificationRead}
              onMarkAllRead={handleMarkAllNotificationsRead}
              onOpenCase={handleOpenCase}
            />
          )}

          {activeTab === 'profile' && (
            <DetectiveProfileView
              user={user}
            />
          )}
        </main>
      </div>

      {/* Station Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-[11px] text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            {user.station || 'SAPS Sandton Police Station'} • Republic of South Africa
          </span>
          <span className="font-mono text-slate-500">
            Investigating Officer: {user.rank} {user.fullName} ({user.personnelNumber}) • Criminal Investigation Directorate (CID)
          </span>
        </div>
      </footer>

      {/* FULL CASE / DOCKET WORKSPACE MODAL */}
      {selectedCaseForWorkspace && (
        <DetectiveCaseWorkspaceModal
          caseData={selectedCaseForWorkspace}
          detective={user}
          initialTab={workspaceInitialTab}
          onClose={handleCloseCaseWorkspace}
          onCaseUpdated={(updatedCase) => {
            setSelectedCaseForWorkspace(updatedCase);
            refreshDetectiveData();
            showToast(`Case ${updatedCase.caseNumber} updated successfully.`);
          }}
        />
      )}
    </div>
  );
};
