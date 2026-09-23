import React, { useState } from 'react';
import { OfficialTopBar } from './components/OfficialTopBar';
import { LoginForm } from './components/LoginForm';
import { CitizenPortal } from './components/CitizenPortal';
import { ComplainantDashboard } from './components/complainant/ComplainantDashboard';
import { AdminPage } from './components/admin/AdminPage';
import { OfficerPage } from './components/officer/OfficerPage';
import { DetectivePage } from './components/detective/DetectivePage';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { AuthenticationSuccessModal } from './components/AuthenticationSuccessModal';
import { DemoAccountsDrawer } from './components/DemoAccountsDrawer';
import { UserProfile, DemoAccount, PortalType, CitizenProfile } from './types/auth';
import { ShieldCheck, Lock, FileCheck2, Scale, Users, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';

export default function App() {
  // Focus on the citizen ("the people") side by default as requested
  const [activePortal, setActivePortal] = useState<PortalType>('citizen');
  
  // Police Official Session State
  const [authenticatedOfficer, setAuthenticatedOfficer] = useState<UserProfile | null>(null);
  const [selectedDemoAccount, setSelectedDemoAccount] = useState<DemoAccount | null>(null);

  // Citizen Session State
  const [authenticatedCitizen, setAuthenticatedCitizen] = useState<CitizenProfile | null>(null);

  // Shared Modals
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotPasswordIdentifier, setForgotPasswordIdentifier] = useState('');

  const handleOfficerLoginSuccess = (user: UserProfile) => {
    setAuthenticatedOfficer(user);
  };

  const handleCitizenLoginSuccess = (citizen: CitizenProfile) => {
    setAuthenticatedCitizen(citizen);
  };

  const handleSignOutOfficer = () => {
    setAuthenticatedOfficer(null);
  };

  const handleSignOutCitizen = () => {
    setAuthenticatedCitizen(null);
  };

  const handleDirectDemoCitizenLogin = () => {
    const demoCitizen: CitizenProfile = {
      id: 'ctz_thandi_01',
      fullName: 'Thandi Molefe',
      email: 'thandi.molefe@gmail.com',
      phoneNumber: '0825550192',
      registeredAt: '2026-03-10T09:15:00Z',
      activeDocketsCount: 1,
      residentialAddress: '42 Nelson Mandela Boulevard, Morningside, Johannesburg',
      nationalId: '920412 5082 089'
    };
    setAuthenticatedCitizen(demoCitizen);
  };

  const handleDirectDemoAdminLogin = () => {
    const demoAdmin: UserProfile = {
      id: 'usr_admin_01',
      personnelNumber: 'POL-40199',
      fullName: 'Marcus Cole',
      rank: 'Chief ICT Security Officer',
      email: 'm.cole@admin.sfen.gov',
      station: 'National Police Directorate',
      division: 'Information & Cryptographic Security',
      role: 'ADMINISTRATOR',
      clearanceLevel: 'Level 4 - National Security & Full Docket Audits',
      lastLogin: new Date().toISOString(),
      token: 'jwt_mock_admin_token_sfen_2026'
    };
    setAuthenticatedOfficer(demoAdmin);
  };

  const handleDirectDemoOfficerLogin = () => {
    const demoOfficer: UserProfile = {
      id: 'usr_csc_01',
      personnelNumber: 'POL-10824',
      fullName: 'Sarah Ndlovu',
      rank: 'Constable',
      email: 's.ndlovu@saps.gov.za',
      station: 'SAPS Sandton Police Station',
      division: 'Community Service Centre (CSC) Frontline Intake',
      role: 'CSC_OFFICER',
      clearanceLevel: 'Level 1 - Frontline Intake & Registration',
      lastLogin: new Date().toISOString(),
      token: 'jwt_mock_officer_token_sfen_2026'
    };
    setAuthenticatedOfficer(demoOfficer);
  };

  const handleDirectDemoDetectiveLogin = () => {
    const demoDetective: UserProfile = {
      id: 'usr_pol_20491',
      personnelNumber: 'POL-20491',
      fullName: 'David Khumalo',
      rank: 'Detective Inspector',
      email: 'd.khumalo@saps.gov.za',
      station: 'SAPS Sandton Police Station',
      division: 'Commercial Crime Section - Specialist Desk',
      role: 'DETECTIVE',
      clearanceLevel: 'Level 2 - Specialist Docket Custody & CID',
      lastLogin: new Date().toISOString(),
      token: 'jwt_mock_detective_token_sfen_2026'
    };
    setAuthenticatedOfficer(demoDetective);
  };

  const handleOpenForgotPassword = (identifier: string) => {
    setForgotPasswordIdentifier(identifier);
    setIsForgotPasswordOpen(true);
  };

  const handleSelectDemoAccount = (account: DemoAccount) => {
    setSelectedDemoAccount(account);
  };

  // If citizen is authenticated, render the complete Complainant/User Dashboard
  if (authenticatedCitizen) {
    return (
      <ComplainantDashboard
        citizen={authenticatedCitizen}
        onSignOut={handleSignOutCitizen}
        onUpdateCitizen={(updated) => setAuthenticatedCitizen(updated)}
      />
    );
  }

  // If detective / investigating officer is authenticated, render the standalone Detective Page
  if (authenticatedOfficer && (authenticatedOfficer.role === 'DETECTIVE' || authenticatedOfficer.role === 'COMMANDER')) {
    return (
      <DetectivePage
        user={authenticatedOfficer}
        onSignOut={handleSignOutOfficer}
      />
    );
  }

  // If police officer / CSC officer is authenticated, render the dedicated Police Officer Page
  if (authenticatedOfficer && authenticatedOfficer.role === 'CSC_OFFICER') {
    return (
      <OfficerPage
        user={authenticatedOfficer}
        onSignOut={handleSignOutOfficer}
      />
    );
  }

  // If system administrator is authenticated as staff, render the dedicated System Administrator Page
  if (authenticatedOfficer && authenticatedOfficer.role === 'ADMINISTRATOR') {
    return (
      <AdminPage
        user={authenticatedOfficer}
        onSignOut={handleSignOutOfficer}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* Background Decorative Police Matrix & Security Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-blue-900/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[300px] bg-slate-900/40 rounded-full blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      {/* Top Official Status Bar */}
      <div className="relative z-10">
        <OfficialTopBar />
      </div>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-10">
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
          
          {/* Main Portal Switcher: The People (Citizen) vs Police Officials */}
          <div className="w-full max-w-md mx-auto mb-6">
            <div className="p-1 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-xl flex items-center gap-1 backdrop-blur-md">
              <button
                type="button"
                id="portal-tab-citizen"
                onClick={() => {
                  setActivePortal('citizen');
                  setAuthenticatedOfficer(null);
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activePortal === 'citizen'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Users size={16} />
                <span>Citizen / Public Portal</span>
              </button>

              <button
                type="button"
                id="portal-tab-officials"
                onClick={() => {
                  setActivePortal('official');
                  setAuthenticatedCitizen(null);
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activePortal === 'official'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <ShieldAlert size={16} />
                <span>Police Officials</span>
              </button>
            </div>
          </div>

          {/* CITIZEN PORTAL */}
          {activePortal === 'citizen' && (
            <div className="w-full flex flex-col items-center">
              <CitizenPortal
                onSuccess={handleCitizenLoginSuccess}
                onForgotPassword={handleOpenForgotPassword}
              />

              {/* Quick Demo Access banner to test the Complainant Dashboard immediately */}
              <div className="mt-4 w-full max-w-lg">
                <button
                  type="button"
                  id="btn-quick-demo-complainant"
                  onClick={handleDirectDemoCitizenLogin}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-900 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-300 text-xs font-semibold transition-all flex items-center justify-between cursor-pointer group shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-emerald-400 group-hover:rotate-12 transition-transform" />
                    <span>Quick Demo: Instant Access as Complainant <strong>(Thandi Molefe)</strong></span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                    <span>Enter Dashboard</span>
                    <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              </div>

                  {/* Citizen Public Services Badges */}
                  <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl px-2">
                    <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/80 text-center flex flex-col items-center gap-1.5">
                      <FileCheck2 size={16} className="text-emerald-400" />
                      <span className="text-[11px] font-semibold text-slate-300">Docket Status</span>
                      <span className="text-[10px] text-slate-500">Real-Time Alerts</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/80 text-center flex flex-col items-center gap-1.5">
                      <ShieldCheck size={16} className="text-emerald-400" />
                      <span className="text-[11px] font-semibold text-slate-300">Evidence Portal</span>
                      <span className="text-[10px] text-slate-500">Secure Statements</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/80 text-center flex flex-col items-center gap-1.5">
                      <Scale size={16} className="text-emerald-400" />
                      <span className="text-[11px] font-semibold text-slate-300">Court Updates</span>
                      <span className="text-[10px] text-slate-500">Hearing Schedules</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/80 text-center flex flex-col items-center gap-1.5">
                      <Lock size={16} className="text-emerald-400" />
                      <span className="text-[11px] font-semibold text-slate-300">Dual Verified</span>
                      <span className="text-[10px] text-slate-500">Email & Mobile</span>
                    </div>
                  </div>
            </div>
          )}

          {/* POLICE OFFICIALS PORTAL */}
          {activePortal === 'official' && (
            <div className="w-full flex flex-col items-center">
              {authenticatedOfficer ? (
                <AuthenticationSuccessModal
                  user={authenticatedOfficer}
                  onSignOut={handleSignOutOfficer}
                />
              ) : (
                <div className="w-full flex flex-col items-center">
                  <LoginForm
                    onSuccess={handleOfficerLoginSuccess}
                    onForgotPassword={handleOpenForgotPassword}
                    prefillAccount={selectedDemoAccount}
                  />

                  {/* Quick Demo Access for Detective, Police Officer & System Administrator */}
                  <div className="mt-4 w-full max-w-lg space-y-2">
                    <button
                      type="button"
                      id="btn-quick-demo-detective"
                      onClick={handleDirectDemoDetectiveLogin}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-900 border border-amber-500/30 hover:border-amber-500/60 text-amber-300 text-xs font-semibold transition-all flex items-center justify-between cursor-pointer group shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles size={14} className="text-amber-400 group-hover:rotate-12 transition-transform" />
                        <span>Quick Demo: Instant Access as Detective <strong>(Det. Insp. David Khumalo)</strong></span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-amber-400">
                        <span>Enter Detective Portal</span>
                        <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>

                    <button
                      type="button"
                      id="btn-quick-demo-officer"
                      onClick={handleDirectDemoOfficerLogin}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-900 border border-blue-500/30 hover:border-blue-500/60 text-blue-300 text-xs font-semibold transition-all flex items-center justify-between cursor-pointer group shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles size={14} className="text-blue-400 group-hover:rotate-12 transition-transform" />
                        <span>Quick Demo: Instant Access as Police Officer <strong>(Constable Sarah Ndlovu)</strong></span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-blue-400">
                        <span>Enter Officer Portal</span>
                        <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>

                    <button
                      type="button"
                      id="btn-quick-demo-admin"
                      onClick={handleDirectDemoAdminLogin}
                      className="w-full py-2 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-900 border border-purple-500/30 hover:border-purple-500/60 text-purple-300 text-xs font-semibold transition-all flex items-center justify-between cursor-pointer group shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles size={14} className="text-purple-400 group-hover:rotate-12 transition-transform" />
                        <span>Quick Demo: Instant Access as System Administrator <strong>(Marcus Cole)</strong></span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-purple-400">
                        <span>Enter Admin Page</span>
                        <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  </div>

                  <DemoAccountsDrawer onSelectAccount={handleSelectDemoAccount} />

                  <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl px-2">
                    <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/80 text-center flex flex-col items-center gap-1.5">
                      <ShieldCheck size={16} className="text-blue-400" />
                      <span className="text-[11px] font-semibold text-slate-300">Evidence Chain</span>
                      <span className="text-[10px] text-slate-500">Tamper-Evident</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/80 text-center flex flex-col items-center gap-1.5">
                      <FileCheck2 size={16} className="text-blue-400" />
                      <span className="text-[11px] font-semibold text-slate-300">Digital Dockets</span>
                      <span className="text-[10px] text-slate-500">End-to-End Tracking</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/80 text-center flex flex-col items-center gap-1.5">
                      <Scale size={16} className="text-blue-400" />
                      <span className="text-[11px] font-semibold text-slate-300">Court Ready</span>
                      <span className="text-[10px] text-slate-500">Judicial Compliance</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/50 border border-slate-800/80 text-center flex flex-col items-center gap-1.5">
                      <Lock size={16} className="text-blue-400" />
                      <span className="text-[11px] font-semibold text-slate-300">RBAC Security</span>
                      <span className="text-[10px] text-slate-500">Automated Clearance</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        initialIdentifier={forgotPasswordIdentifier}
      />

      {/* Official Legal & Compliance Footer */}
      <footer id="sfen-official-footer" className="relative z-10 w-full border-t border-slate-800/80 bg-slate-950/90 py-5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left text-xs text-slate-500">
          <div className="space-y-1">
            <p className="font-medium text-slate-400">
              National Police Service • Docket & Evidence Administration
            </p>
            <p className="text-[11px] text-slate-500 max-w-2xl leading-relaxed">
              CONFIDENTIAL LAW ENFORCEMENT REPOSITORY. Unauthorised access, extraction, tampering, or dissemination of police case dockets is strictly prohibited under the Criminal Procedure Act, National Evidence Directives, and Cybercrimes Act. All interactions are monitored and cryptographically sealed.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400 shrink-0">
            <span className="hover:text-slate-300 transition-colors cursor-pointer" onClick={() => alert('SFEN System Version: 2.4.0-PROD (Build: 20260921)\nSecurity Specification: NIST SP 800-53 / ISO 27001')}>
              System Ver. 2.4.0
            </span>
            <span>•</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer" onClick={() => handleOpenForgotPassword('')}>
              Public Help Desk
            </span>
            <span>•</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer" onClick={() => alert('Chain of custody: Each docket action is immutably appended to the police audit register.')}>
              Chain of Custody
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

