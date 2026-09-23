import React, { useState } from 'react';
import { CitizenProfile } from '../../types/auth';
import { evaluatePasswordStrength } from '../../services/authService';
import { 
  User, 
  Mail, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Save,
  KeyRound
} from 'lucide-react';

interface ProfileViewProps {
  citizen: CitizenProfile;
  onUpdateCitizen: (updated: CitizenProfile) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ citizen, onUpdateCitizen }) => {
  // Personal Info State
  const [fullName, setFullName] = useState(citizen.fullName || '');
  const [email, setEmail] = useState(citizen.email || '');
  const [phoneNumber, setPhoneNumber] = useState(citizen.phoneNumber || '');
  
  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Feedback
  const [profileSuccessToast, setProfileSuccessToast] = useState<string | null>(null);
  const [passwordSuccessToast, setPasswordSuccessToast] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const passwordStrength = evaluatePasswordStrength(newPassword);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);

    setTimeout(() => {
      const updated: CitizenProfile = {
        ...citizen,
        fullName,
        email,
        phoneNumber
      };

      // Persist in localStorage registered citizens array
      try {
        const stored = localStorage.getItem('sfen_registered_citizens');
        if (stored) {
          const parsed: CitizenProfile[] = JSON.parse(stored);
          const idx = parsed.findIndex((c) => c.id === citizen.id || c.email === citizen.email);
          if (idx !== -1) {
            parsed[idx] = { ...parsed[idx], ...updated };
            localStorage.setItem('sfen_registered_citizens', JSON.stringify(parsed));
          }
        }
      } catch {
        // ignore
      }

      onUpdateCitizen(updated);
      setIsSavingProfile(false);
      setProfileSuccessToast('Your contact details have been updated successfully.');
      setTimeout(() => setProfileSuccessToast(null), 5000);
    }, 400);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setIsSavingPassword(true);

    setTimeout(() => {
      try {
        const stored = localStorage.getItem('sfen_registered_citizens');
        if (stored) {
          const parsed = JSON.parse(stored);
          const idx = parsed.findIndex((c: any) => c.id === citizen.id || c.email === citizen.email);
          if (idx !== -1) {
            parsed[idx].password = newPassword;
            localStorage.setItem('sfen_registered_citizens', JSON.stringify(parsed));
          }
        }
      } catch {
        // ignore
      }

      setIsSavingPassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordSuccessToast('Your password has been changed successfully.');
      setTimeout(() => setPasswordSuccessToast(null), 5000);
    }, 500);
  };

  return (
    <div id="complainant-profile-view" className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Account Profile & Security Settings
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Manage your contact information and password security.
        </p>
      </div>

      {/* Profile Particulars Form */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
        <div className="flex items-center gap-2">
          <User size={18} className="text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Personal & Contact Details</h3>
        </div>

        {profileSuccessToast && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{profileSuccessToast}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="prof-name" className="text-xs font-semibold text-slate-200 block">
                Full Name
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="prof-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="prof-email" className="text-xs font-semibold text-slate-200 block">
                Email Address
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="prof-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="prof-phone" className="text-xs font-semibold text-slate-200 block">
                Mobile Number
              </label>
              <div className="relative">
                <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="prof-phone"
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save size={14} />
              <span>{isSavingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Card */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
        <div className="flex items-center gap-2">
          <KeyRound size={18} className="text-blue-400" />
          <h3 className="text-sm font-bold text-white">Change Account Password</h3>
        </div>

        {passwordSuccessToast && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{passwordSuccessToast}</span>
          </div>
        )}

        {passwordError && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-400 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="space-y-1.5">
              <label htmlFor="pwd-curr" className="text-xs font-semibold text-slate-200 block">
                Current Password
              </label>
              <input
                id="pwd-curr"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="pwd-new" className="text-xs font-semibold text-slate-200 block">
                New Secure Password
              </label>
              <div className="relative">
                <input
                  id="pwd-new"
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full px-3 pr-9 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="pwd-conf" className="text-xs font-semibold text-slate-200 block">
                Confirm New Password
              </label>
              <input
                id="pwd-conf"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Password Strength Meter */}
          {newPassword.length > 0 && (
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Password Security Score:</span>
                <span className={`font-bold font-mono ${passwordStrength.color}`}>
                  {passwordStrength.label} ({passwordStrength.score}/5)
                </span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div
                    key={level}
                    className={`flex-1 h-full transition-all ${
                      level <= passwordStrength.score
                        ? passwordStrength.score >= 4
                          ? 'bg-emerald-500'
                          : passwordStrength.score >= 3
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                        : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingPassword || !newPassword}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              {isSavingPassword ? 'Updating Password...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};
