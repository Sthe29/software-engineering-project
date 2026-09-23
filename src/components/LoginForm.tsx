import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Lock, User, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { LoginCredentials, UserProfile, DemoAccount } from '../types/auth';
import { authenticatePersonnel, validateCredentials } from '../services/authService';
import { SfenLogo } from './SfenLogo';
import { SecurityNoticeBanner } from './SecurityNoticeBanner';

interface LoginFormProps {
  onSuccess: (user: UserProfile) => void;
  onForgotPassword: (identifier: string) => void;
  prefillAccount?: DemoAccount | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onForgotPassword,
  prefillAccount
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [capsLockActive, setCapsLockActive] = useState(false);

  const identifierInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Load remembered identifier if saved
  useEffect(() => {
    try {
      const savedIdentifier = localStorage.getItem('sfen_last_identifier');
      if (savedIdentifier) {
        setIdentifier(savedIdentifier);
        setRememberMe(true);
      }
    } catch {
      // Ignore in restricted environments
    }
  }, []);

  // Update fields when prefillAccount changes from demo drawer
  useEffect(() => {
    if (prefillAccount) {
      setIdentifier(prefillAccount.personnelNumber);
      setPassword(prefillAccount.password);
      setErrorMessage(null);
    }
  }, [prefillAccount]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Detect Caps Lock
    const isCaps = e.getModifierState && e.getModifierState('CapsLock');
    setCapsLockActive(Boolean(isCaps));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const credentials: LoginCredentials = {
      identifier,
      password,
      rememberMe
    };

    // Client-side validation
    const validation = validateCredentials(credentials);
    if (!validation.isValid) {
      setErrorMessage(validation.error || 'Please fill in all mandatory fields.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authenticatePersonnel(credentials);

      if (response.success && response.user) {
        onSuccess(response.user);
      } else {
        setErrorMessage(response.message || 'Authentication rejected. Please verify your credentials.');
      }
    } catch (err) {
      setErrorMessage('Network connection error. Unable to establish secure link with SFEN authentication server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      id="sfen-login-card" 
      className="w-full max-w-md mx-auto bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden"
    >
      {/* Top subtle highlight */}
      <div className="absolute top-0 inset-x-0 h-1 bg-blue-600" />

      {/* Header with SFEN name and full title */}
      <div className="text-center space-y-3 mb-6">
        <div className="flex justify-center">
          <SfenLogo size="md" />
        </div>

        <div>
          <h1 id="sfen-brand-title" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            SFEN
          </h1>
          <p id="sfen-full-title" className="text-sm font-semibold text-blue-400 uppercase tracking-wider mt-0.5">
            Secure File & Evidence Network
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Police Case Docket & Chain-of-Custody Management System
          </p>
        </div>
      </div>

      {/* Small "Authorised personnel only" security message */}
      <div className="mb-6">
        <SecurityNoticeBanner />
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div 
          id="login-error-alert" 
          className="mb-5 p-3 rounded-lg bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5 animate-shake"
          role="alert"
        >
          <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-red-300">Authentication Failed:</span> {errorMessage}
          </div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Input: Personnel Number or Email */}
        <div className="space-y-1.5">
          <label 
            htmlFor="personnel-identifier" 
            className="text-xs font-semibold text-slate-200 flex items-center justify-between"
          >
            <span>Personnel Number or Email</span>
            <span className="text-[11px] font-normal text-slate-400">e.g. POL-84920</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User size={16} />
            </div>
            <input
              id="personnel-identifier"
              name="identifier"
              type="text"
              autoComplete="username"
              required
              ref={identifierInputRef}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Personnel Number or Email"
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono tracking-normal"
            />
          </div>
        </div>

        {/* Input: Password with Show/Hide toggle */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label 
              htmlFor="personnel-password" 
              className="text-xs font-semibold text-slate-200"
            >
              Password
            </label>
            {capsLockActive && (
              <span className="text-[10px] font-medium text-amber-400 bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-500/30 animate-pulse">
                CAPS LOCK ON
              </span>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock size={16} />
            </div>
            <input
              id="personnel-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              ref={passwordInputRef}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your secure password"
              className="w-full pl-10 pr-11 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            {/* Show / Hide Toggle Button */}
            <button
              id="btn-toggle-password-visibility"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 focus:outline-none focus:text-blue-400 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        {/* Remember Me and Forgot Password row */}
        <div className="flex items-center justify-between pt-1">
          <label 
            id="label-remember-me"
            htmlFor="remember-me-checkbox" 
            className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer select-none"
          >
            <input
              id="remember-me-checkbox"
              name="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-950 border border-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 focus:ring-1 cursor-pointer accent-blue-600"
            />
            <span>Remember Me</span>
          </label>

          <button
            id="link-forgot-password"
            type="button"
            onClick={() => onForgotPassword(identifier)}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline focus:outline-none focus:ring-1 focus:ring-blue-500 rounded transition-colors"
          >
            Forgot Password?
          </button>
        </div>

        {/* Clear Sign In button */}
        <div className="pt-2">
          <button
            id="btn-sign-in"
            type="submit"
            disabled={isLoading || !identifier.trim() || !password}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-900/30 hover:shadow-blue-800/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Authenticating with SFEN...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Footer Security Notice */}
      <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
        <p className="text-[11px] text-slate-500">
          SFEN National Police Docket Infrastructure • v2.4 LTS
        </p>
        <p className="text-[10px] text-slate-600 mt-0.5">
          Role-Based Access Control (RBAC) enforced automatically upon authentication.
        </p>
      </div>
    </div>
  );
};
