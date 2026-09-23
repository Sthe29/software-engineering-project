import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../../types/auth';
import { AdminTab, AdminUserRecord, ConfiguredPoliceStation, AdminActivityLog, AccountStatus } from '../../types/admin';
import { adminService } from '../../services/adminService';
import { AdminSidebar } from './AdminSidebar';
import { AdminDashboardView } from './AdminDashboardView';
import { AdminUsersView } from './AdminUsersView';
import { AdminActivityView } from './AdminActivityView';
import { AdminProfileView } from './AdminProfileView';
import { SfenLogo } from '../SfenLogo';
import { 
  Shield, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  CheckCircle2, 
  Activity,
  Building2
} from 'lucide-react';

interface AdminPageProps {
  user: UserProfile;
  onSignOut: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ user, onSignOut }) => {
  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dynamic Admin Service States
  const [usersList, setUsersList] = useState<AdminUserRecord[]>([]);
  const [stationData, setStationData] = useState<ConfiguredPoliceStation>(adminService.getConfiguredStation());
  const [activityLogs, setActivityLogs] = useState<AdminActivityLog[]>([]);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile>(user);

  // Trigger to open Add Personnel modal from dashboard
  const [isAddPersonnelOpen, setIsAddPersonnelOpen] = useState(false);

  // Load initial data
  const refreshData = () => {
    setUsersList(adminService.getUsers());
    setStationData(adminService.getConfiguredStation());
    setActivityLogs(adminService.getActivityLogs());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Handlers for User Actions
  const handleAddPersonnel = (data: {
    fullName: string;
    personnelNumber: string;
    email: string;
    phoneNumber?: string;
    rank: string;
    role: UserRole;
    division?: string;
  }) => {
    adminService.addPersonnel(data, currentUserProfile);
    refreshData();
  };

  const handleUpdateUser = (id: string, updates: Partial<AdminUserRecord>) => {
    adminService.updateUser(id, updates, currentUserProfile);
    refreshData();
  };

  const handleSetUserStatus = (id: string, status: AccountStatus) => {
    adminService.setUserStatus(id, status, currentUserProfile);
    refreshData();
  };

  const handleResetPassword = (id: string) => {
    const res = adminService.resetUserPassword(id, currentUserProfile);
    refreshData();
    return res;
  };

  const handleUpdateProfile = (updates: { fullName: string; email: string; phoneNumber?: string }) => {
    const updated = {
      ...currentUserProfile,
      fullName: updates.fullName,
      email: updates.email
    };
    setCurrentUserProfile(updated);
    adminService.logActivity({
      actionType: 'PROFILE_UPDATED',
      title: 'Administrator Profile Updated',
      description: `Administrator ${updated.fullName} updated personal contact email to ${updated.email}.`,
      affectedUser: updated.fullName,
      adminName: updated.fullName,
      adminPersonnelNumber: updated.personnelNumber
    });
    refreshData();
  };

  const handleChangePassword = (oldPassword: string, newPassword: string) => {
    adminService.logActivity({
      actionType: 'PASSWORD_RESET',
      title: 'Administrator Password Changed',
      description: `Administrator ${currentUserProfile.fullName} successfully rotated their personal master password.`,
      affectedUser: currentUserProfile.fullName,
      adminName: currentUserProfile.fullName,
      adminPersonnelNumber: currentUserProfile.personnelNumber
    });
    refreshData();
    return {
      success: true,
      message: 'Master password successfully rotated and cryptographically sealed.'
    };
  };

  // Dashboard Stats
  const dashboardStats = {
    totalUsers: usersList.length,
    activePersonnel: usersList.filter(u => u.accountType === 'PERSONNEL' && u.status === 'ACTIVE').length,
    complainantAccounts: usersList.filter(u => u.accountType === 'COMPLAINANT').length,
    inactiveAccounts: usersList.filter(u => u.status !== 'ACTIVE').length,
    personnelCount: usersList.filter(u => u.accountType === 'PERSONNEL').length,
    recentActivity: activityLogs.slice(0, 5)
  };

  const personnelUsers = usersList.filter(u => u.accountType === 'PERSONNEL');

  return (
    <div id="admin-page-container" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-purple-600 selection:text-white relative">
      {/* Top Header */}
      <header id="admin-topbar" className="w-full bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 sm:px-6 py-3 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Brand & Portal Badge */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white md:hidden cursor-pointer"
              aria-label="Toggle admin menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <SfenLogo size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-white tracking-wide">SFEN</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                  System Administration
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Secure File & Evidence Network • Police Station Administration
              </p>
            </div>
          </div>

          {/* Right: Station Indicator, User Badge, and Sign Out */}
          <div className="flex items-center gap-3">
            {/* Configured Station Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
              <Building2 size={13} className="text-blue-400" />
              <span className="font-medium truncate max-w-[170px]">{stationData.name}</span>
            </div>

            {/* Profile Avatar */}
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-left">
              <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow-xs">
                {currentUserProfile.fullName ? currentUserProfile.fullName.charAt(0) : 'A'}
              </div>
              <div>
                <p className="text-xs font-semibold text-white leading-tight">
                  {currentUserProfile.fullName}
                </p>
                <p className="text-[10px] text-purple-300 font-mono">
                  {currentUserProfile.rank || 'Admin'} • {currentUserProfile.personnelNumber}
                </p>
              </div>
            </div>

            {/* Single Explicit Sign Out Button */}
            <button
              type="button"
              id="btn-admin-logout"
              onClick={onSignOut}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-rose-500/40 hover:bg-rose-500/10 text-slate-300 hover:text-rose-300 text-xs font-semibold transition-all cursor-pointer shadow-xs"
              title="Sign Out of Administration"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden flex flex-col pt-16 px-4 pb-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex-1 flex flex-col justify-between overflow-y-auto">
            <AdminSidebar
              activeTab={activeTab}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                setIsMobileMenuOpen(false);
              }}
              userCount={usersList.length}
              personnelCount={personnelUsers.length}
              onSignOut={onSignOut}
              isMobileDrawer
              onCloseMobileDrawer={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Container: Sidebar + Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden md:block shrink-0">
          <AdminSidebar
            activeTab={activeTab}
            onSelectTab={(tab) => {
              setActiveTab(tab);
            }}
            userCount={usersList.length}
            personnelCount={personnelUsers.length}
            onSignOut={onSignOut}
          />
        </div>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && (
            <AdminDashboardView
              stats={dashboardStats}
              station={stationData}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenAddPersonnel={() => {
                setActiveTab('users');
                setIsAddPersonnelOpen(true);
              }}
            />
          )}

          {activeTab === 'users' && (
            <AdminUsersView
              users={usersList}
              configuredStation={stationData}
              currentUser={currentUserProfile}
              onAddPersonnel={handleAddPersonnel}
              onUpdateUser={handleUpdateUser}
              onSetUserStatus={handleSetUserStatus}
              onResetPassword={handleResetPassword}
              isAddModalOpenInitially={isAddPersonnelOpen}
              onCloseAddModal={() => setIsAddPersonnelOpen(false)}
            />
          )}

          {activeTab === 'activity' && (
            <AdminActivityView
              activityLogs={activityLogs}
            />
          )}

          {activeTab === 'profile' && (
            <AdminProfileView
              currentUser={currentUserProfile}
              onUpdateProfile={handleUpdateProfile}
              onChangePassword={handleChangePassword}
            />
          )}
        </main>
      </div>
    </div>
  );
};
