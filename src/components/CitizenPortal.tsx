import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Loader2, 
  ShieldCheck, 
  UserPlus, 
  LogIn, 
  Info,
  Key
} from 'lucide-react';
import { CitizenLoginCredentials, CitizenSignUpData, CitizenProfile } from '../types/auth';
import { authenticateCitizen, registerCitizen, evaluatePasswordStrength } from '../services/authService';
import { SfenLogo } from './SfenLogo';
import { ConsentInfoModal } from './ConsentInfoModal';

interface CitizenPortalProps {
  onSuccess: (citizen: CitizenProfile) => void;
  onForgotPassword: (identifier: string) => void;
}

export const CitizenPortal: React.FC<CitizenPortalProps> = ({
  onSuccess,
  onForgotPassword
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Sign Up State
  const [fullName, setFullName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Password Strength for Sign Up
  const passwordStrength = evaluatePasswordStrength(signUpPassword);

  // Auto-populate saved citizen email and phone
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem('sfen_citizen_last_email');
      const savedPhone = localStorage.getItem('sfen_citizen_last_phone');
      if (savedEmail) {
        setLoginEmail(savedEmail);
        setRememberMe(true);
      }
      if (savedPhone) {
        setLoginPhone(savedPhone);
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleQuickFillDemo = () => {
    setAuthMode('login');
    setLoginEmail('thandi.molefe@gmail.com');
    setLoginPhone('0825550192');
    setLoginPassword('SecureDocket2026!');
    setErrorMessage(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    const credentials: CitizenLoginCredentials = {
      email: loginEmail,
      phoneNumber: loginPhone,
      password: loginPassword,
      rememberMe
    };

    setIsLoading(true);

    try {
      const result = await authenticateCitizen(credentials);
      if (result.success && result.citizen) {
        onSuccess(result.citizen);
      } else {
        setErrorMessage(result.message);
      }
    } catch (err) {
      setErrorMessage('Communication error with SFEN Public Portal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    const data: CitizenSignUpData = {
      fullName,
      email: signUpEmail,
      phoneNumber: signUpPhone,
      password: signUpPassword,
      confirmPassword,
      acceptedTerms
    };

    setIsLoading(true);

    try {
      const result = await registerCitizen(data);
      if (result.success && result.citizen) {
        onSuccess(result.citizen);
      } else {
        setErrorMessage(result.message);
      }
    } catch (err) {
      setErrorMessage('Registration server error. Please verify your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      id="citizen-auth-card" 
      className="w-full max-w-md mx-auto bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden"
    >
      {/* Top subtle highlight */}
      <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500" />

      {/* Header */}
      <div className="text-center space-y-2.5 mb-5">
        <div className="flex justify-center">
          <SfenLogo size="md" />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            SFEN
          </h1>
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mt-0.5">
            Public Case & Docket Access
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Secure tracking for victims, witnesses & reporting citizens
          </p>
        </div>
      </div>

      {/* Mode Switcher: Sign In vs Sign Up */}
      <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 mb-5">
        <button
          type="button"
          id="btn-citizen-tab-login"
          onClick={() => {
            setAuthMode('login');
            setErrorMessage(null);
          }}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            authMode === 'login'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LogIn size={14} />
          Sign In
        </button>
        <button
          type="button"
          id="btn-citizen-tab-signup"
          onClick={() => {
            setAuthMode('signup');
            setErrorMessage(null);
          }}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            authMode === 'signup'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserPlus size={14} />
          Sign Up (New Account)
        </button>
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div 
          id="citizen-error-alert" 
          className="mb-4 p-3 rounded-lg bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5 animate-shake"
          role="alert"
        >
          <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-red-300">Notice:</span> {errorMessage}
          </div>
        </div>
      )}

      {/* Success Notice */}
      {successNotice && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2.5">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
          <div>{successNotice}</div>
        </div>
      )}

      {/* LOGIN VIEW (Requires Email, Phone Number, Password) */}
      {authMode === 'login' ? (
        <form onSubmit={handleLoginSubmit} className="space-y-3.5" noValidate>
          {/* Email input */}
          <div className="space-y-1">
            <label htmlFor="citizen-login-email" className="text-xs font-semibold text-slate-200 block">
              Registered Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail size={16} />
              </div>
              <input
                id="citizen-login-email"
                type="email"
                required
                autoComplete="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono"
              />
            </div>
          </div>

          {/* Phone Number input */}
          <div className="space-y-1">
            <label htmlFor="citizen-login-phone" className="text-xs font-semibold text-slate-200 block">
              Registered Mobile Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone size={16} />
              </div>
              <input
                id="citizen-login-phone"
                type="tel"
                required
                autoComplete="tel"
                value={loginPhone}
                onChange={(e) => setLoginPhone(e.target.value)}
                placeholder="e.g. 082 555 0192 or +27 82 555 0192"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-400 flex items-center gap-1">
              <Info size={11} className="text-slate-400" />
              Both email and phone number are verified to protect case docket privacy.
            </p>
          </div>

          {/* Password input */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="citizen-login-password" className="text-xs font-semibold text-slate-200">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock size={16} />
              </div>
              <input
                id="citizen-login-password"
                type={showLoginPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-11 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
              <button
                type="button"
                id="btn-toggle-citizen-password"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
              >
                {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between pt-1">
            <label 
              htmlFor="citizen-remember-me"
              className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer select-none"
            >
              <input
                id="citizen-remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-950 border border-slate-700 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0 focus:ring-1 cursor-pointer accent-emerald-600"
              />
              <span>Remember Me</span>
            </label>

            <button
              id="citizen-link-forgot-password"
              type="button"
              onClick={() => onForgotPassword(loginEmail || loginPhone)}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          {/* Sign In Button */}
          <div className="pt-2">
            <button
              id="btn-citizen-sign-in"
              type="submit"
              disabled={isLoading || !loginEmail || !loginPhone || !loginPassword}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  <span>Verifying Citizen Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to SFEN</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>

          {/* Quick Demo Citizen Helper */}
          <div className="pt-3 border-t border-slate-800 text-center">
            <button
              type="button"
              id="btn-quick-fill-citizen-sample"
              onClick={handleQuickFillDemo}
              className="text-[11px] text-slate-400 hover:text-emerald-300 flex items-center justify-center gap-1.5 mx-auto font-medium transition-colors"
            >
              <Key size={12} className="text-emerald-400" />
              <span>Click to auto-fill sample citizen test credentials</span>
            </button>
          </div>
        </form>
      ) : (
        /* SIGN UP VIEW (Requires Full Name, Phone Number, Email, and Secure Password Creation) */
        <form onSubmit={handleSignUpSubmit} className="space-y-3.5" noValidate>
          {/* Full Name */}
          <div className="space-y-1">
            <label htmlFor="citizen-signup-name" className="text-xs font-semibold text-slate-200 block">
              Full Legal Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User size={16} />
              </div>
              <input
                id="citizen-signup-name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Sipho Sithole"
                className="w-full pl-10 pr-3.5 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label htmlFor="citizen-signup-email" className="text-xs font-semibold text-slate-200 block">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail size={16} />
              </div>
              <input
                id="citizen-signup-email"
                type="email"
                required
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full pl-10 pr-3.5 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <label htmlFor="citizen-signup-phone" className="text-xs font-semibold text-slate-200 block">
              Mobile Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone size={16} />
              </div>
              <input
                id="citizen-signup-phone"
                type="tel"
                required
                value={signUpPhone}
                onChange={(e) => setSignUpPhone(e.target.value)}
                placeholder="e.g. 082 123 4567"
                className="w-full pl-10 pr-3.5 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-mono"
              />
            </div>
            <p className="text-[10px] text-slate-400">
              SMS docket notifications and court date alerts are dispatched to this number.
            </p>
          </div>

          {/* Create Secure Password */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label htmlFor="citizen-signup-password" className="text-xs font-semibold text-slate-200">
                Create Secure Password
              </label>
              {signUpPassword && (
                <span className={`text-[10px] font-bold ${passwordStrength.color.split(' ')[0]}`}>
                  {passwordStrength.label}
                </span>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock size={16} />
              </div>
              <input
                id="citizen-signup-password"
                type={showSignUpPassword ? 'text' : 'password'}
                required
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full pl-10 pr-11 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                aria-label={showSignUpPassword ? 'Hide password' : 'Show password'}
              >
                {showSignUpPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Password Strength Meter */}
            {signUpPassword && (
              <div className="space-y-1 pt-1">
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex gap-1">
                  <div className={`h-full rounded-full transition-all duration-300 ${
                    passwordStrength.score >= 1 ? passwordStrength.color.split(' ')[1] : 'bg-transparent'
                  } w-1/4`} />
                  <div className={`h-full rounded-full transition-all duration-300 ${
                    passwordStrength.score >= 2 ? passwordStrength.color.split(' ')[1] : 'bg-transparent'
                  } w-1/4`} />
                  <div className={`h-full rounded-full transition-all duration-300 ${
                    passwordStrength.score >= 3 ? passwordStrength.color.split(' ')[1] : 'bg-transparent'
                  } w-1/4`} />
                  <div className={`h-full rounded-full transition-all duration-300 ${
                    passwordStrength.score >= 4 ? passwordStrength.color.split(' ')[1] : 'bg-transparent'
                  } w-1/4`} />
                </div>

                {/* Password Criteria Checklist */}
                <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400 pt-0.5">
                  <span className={`flex items-center gap-1 ${passwordStrength.hasMinLength ? 'text-emerald-400' : 'text-slate-400'}`}>
                    <span className="text-xs">{passwordStrength.hasMinLength ? '✓' : '•'}</span> 8+ Characters
                  </span>
                  <span className={`flex items-center gap-1 ${passwordStrength.hasUppercase && passwordStrength.hasLowercase ? 'text-emerald-400' : 'text-slate-400'}`}>
                    <span className="text-xs">{passwordStrength.hasUppercase && passwordStrength.hasLowercase ? '✓' : '•'}</span> Upper & Lowercase
                  </span>
                  <span className={`flex items-center gap-1 ${passwordStrength.hasNumber ? 'text-emerald-400' : 'text-slate-400'}`}>
                    <span className="text-xs">{passwordStrength.hasNumber ? '✓' : '•'}</span> Numbers (0-9)
                  </span>
                  <span className={`flex items-center gap-1 ${passwordStrength.hasSpecial ? 'text-emerald-400' : 'text-slate-400'}`}>
                    <span className="text-xs">{passwordStrength.hasSpecial ? '✓' : '•'}</span> Symbols (!@#$)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label htmlFor="citizen-signup-confirm-password" className="text-xs font-semibold text-slate-200 block">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock size={16} />
              </div>
              <input
                id="citizen-signup-confirm-password"
                type={showSignUpPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full pl-10 pr-3.5 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
            {confirmPassword && signUpPassword !== confirmPassword && (
              <p className="text-[11px] text-red-400">Passwords do not match.</p>
            )}
          </div>

          {/* Mandatory Consent & Agreement Section */}
          <div className="pt-1.5 p-3 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
            <div className="flex items-start gap-2.5">
              <input
                id="citizen-accept-terms"
                type="checkbox"
                required
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-950 border border-slate-700 text-emerald-600 focus:ring-emerald-500 mt-0.5 accent-emerald-600 cursor-pointer shrink-0"
              />
              <div className="space-y-1 text-xs">
                <label 
                  htmlFor="citizen-accept-terms" 
                  className="font-medium text-slate-200 cursor-pointer select-none leading-snug block"
                >
                  I have read and tick to accept the personal information & case docket consent terms.
                </label>
                
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-400">Must read and agree:</span>
                  <button
                    type="button"
                    id="btn-agree-to-consent-link"
                    onClick={() => setIsConsentModalOpen(true)}
                    className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Agree to Consent Info (View Details)</span>
                    <ArrowRight size={11} />
                  </button>
                </div>
              </div>
            </div>

            {!acceptedTerms && (
              <p className="text-[10px] text-amber-400/90 pl-6.5 font-medium">
                • You must tick the consent box above before being able to create an account.
              </p>
            )}
          </div>

          {/* Sign Up Submit Button */}
          <div className="pt-2">
            <button
              id="btn-citizen-create-account"
              type="submit"
              disabled={
                isLoading || 
                !fullName.trim() || 
                !signUpEmail.trim() || 
                !signUpPhone.trim() || 
                !acceptedTerms || 
                signUpPassword !== confirmPassword || 
                passwordStrength.score < 3
              }
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-950/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  <span>Creating Secure Citizen Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Access SFEN</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>

          <div className="pt-2 text-center">
            <p className="text-xs text-slate-400">
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-emerald-400 font-semibold hover:underline"
              >
                Sign in with your email and phone
              </button>
            </p>
          </div>
        </form>
      )}

      {/* Security footer */}
      <div className="mt-5 pt-4 border-t border-slate-800 text-center">
        <p className="text-[10px] text-slate-500">
          Official Republic Docket Access • Dual Factor (Email + SMS Verified)
        </p>
      </div>

      {/* Consent Info Modal */}
      <ConsentInfoModal
        isOpen={isConsentModalOpen}
        onClose={() => setIsConsentModalOpen(false)}
        onAgree={() => setAcceptedTerms(true)}
        isAgreed={acceptedTerms}
      />
    </div>
  );
};
