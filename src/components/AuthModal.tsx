import React, { useState } from 'react';
import { AuthService } from '../lib/firebase';
import { AppUser } from '../types';
import { 
  X, Mail, Lock, User, LogIn, UserPlus, KeyRound, 
  HelpCircle, AlertCircle, ShieldAlert, Sparkles, LogOut, CheckCircle, ArrowRight
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AppUser, message: string) => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (isSignUp) {
        if (!displayName.trim()) {
          throw new Error('Please enter a display name!');
        }
        const user = await AuthService.signUp(email, password, displayName);
        onSuccess(user, `Welcome to the MakerSpace, ${user.displayName}!`);
        onClose();
      } else {
        const user = await AuthService.signIn(email, password);
        onSuccess(user, `Welcome back, ${user.displayName}!`);
        onClose();
      }
    } catch (err: any) {
      console.error('Authentication boundary caught error:', err instanceof Error ? err.message : String(err));
      // Map firebase error codes into beautiful friendly human readable lines
      let userFriendlyMsg = err.message || 'An unexpected authentication glitch occurred.';
      if (userFriendlyMsg.includes('auth/email-already-in-use')) {
        userFriendlyMsg = 'This email user is already registered. Please Login instead!';
      } else if (userFriendlyMsg.includes('auth/wrong-password')) {
        userFriendlyMsg = 'Incorrect passcode coordinates. Double check and try again.';
      } else if (userFriendlyMsg.includes('auth/user-not-found')) {
        userFriendlyMsg = 'No maker workspace matches this email address. Try Registering!';
      } else if (userFriendlyMsg.includes('auth/invalid-email')) {
        userFriendlyMsg = 'The email address coordinates provided look structurally invalid.';
      } else if (userFriendlyMsg.includes('auth/weak-password')) {
        userFriendlyMsg = 'The passcode must consist of 6 characters or above to be structurally sound.';
      }
      setErrorMessage(userFriendlyMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const user = await AuthService.signInWithGoogle();
      onSuccess(user, `Welcome, ${user.displayName}! Handshake complete.`);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Google Auth Popup was closed or interrupted.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in animate-[duration_0.2s]">
      <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full border border-gray-150 dark:border-gray-800 overflow-hidden shadow-2xl relative">
        
        {/* Dynamic header backdrop */}
        <div className="h-2 bg-gradient-to-r from-blue-500 via-orange-500 to-emerald-500 w-full" />
        
        {/* Close trigger */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-150 dark:hover:bg-gray-800 text-gray-500 cursor-pointer transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 space-y-6">
          {/* Welcome Intro */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl flex items-center justify-center mx-auto text-indigo-600 shadow-inner">
              {isSignUp ? <UserPlus className="w-6 h-6 animate-pulse" /> : <LogIn className="w-6 h-6" />}
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
              {isSignUp ? 'Create Maker Account' : 'Welcome to the Lab'}
            </h3>
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 leading-relaxed max-w-xs mx-auto">
              {isSignUp 
                ? 'Join our interactive classroom to unlock lessons, save your projects, and share your simulations.'
                : 'Sign in to access your saved circuits, block codes, and track your guided mission badges.'}
            </p>
          </div>

          {/* Social Sign In Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-750 text-xs font-black text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer transition-all disabled:opacity-40"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0">
              <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.65 1.58 14.99 1 12 1 7.35 1 3.39 3.67 1.39 7.56l3.85 2.99C6.18 7.39 8.87 5.04 12 5.04z" />
              <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.76 2.91c2.19-2.02 3.47-5 3.47-8.64z" />
              <path fill="#FBBC05" d="M5.24 10.55c-.24-.72-.38-1.49-.38-2.3c0-.81.14-1.58.38-2.3L1.39 2.96C.49 4.77 0 6.81 0 8.95c0 2.14.49 4.18 1.39 5.99l3.85-3.39z" />
              <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.76-2.91c-1.1.74-2.52 1.18-4.2 1.18-3.13 0-5.82-2.35-6.76-5.51L1.39 16.14C3.39 20.33 7.35 23 12 23z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-x-0 border-t border-gray-150 dark:border-gray-800" />
            <span className="relative z-10 bg-white dark:bg-gray-900 px-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest font-mono">
              Or credentials
            </span>
          </div>

          {/* Form wrapper */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            
            {/* Display name field (Register only) */}
            {isSignUp && (
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-black text-gray-550 dark:text-gray-400 tracking-wider">
                  Display name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    maxLength={30}
                    placeholder="e.g. Tony Stark"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-750 rounded-xl text-xs font-semibold text-gray-800 dark:text-gray-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-black text-gray-550 dark:text-gray-400 tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  placeholder="name@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-750 rounded-xl text-xs font-semibold text-gray-800 dark:text-gray-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-black text-gray-550 dark:text-gray-400 tracking-wider">
                Password passcode
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-750 rounded-xl text-xs font-semibold text-gray-800 dark:text-gray-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* User notifications & logs */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-150 dark:border-rose-900/40 rounded-xl flex items-start gap-2 text-[11px] leading-relaxed font-semibold text-rose-600 dark:text-rose-400 font-mono">
                <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5 animate-bounce" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Control */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase flex items-center justify-center gap-1 cursor-pointer transition-all shadow-sm active:scale-98 disabled:opacity-40"
            >
              <span>{isLoading ? 'Processing Handshake...' : (isSignUp ? 'Create Workspace' : 'Enter Playground')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Guest Access */}
            <button
              type="button"
              disabled={isLoading}
              onClick={async () => {
                setIsLoading(true);
                setErrorMessage(null);
                try {
                  const randomId = Math.random().toString(36).substring(2, 7);
                  const guestEmail = `guest_${randomId}@pascha.edu`;
                  const guestUser = await AuthService.signUp(guestEmail, 'guest123', `Guest Inventor ${randomId.toUpperCase()}`);
                  onSuccess(guestUser, `Welcome as ${guestUser.displayName}! Settings unlocked.`);
                  onClose();
                } catch (err: any) {
                  setErrorMessage(err.message || 'Could not instantiate guest session.');
                } finally {
                  setIsLoading(false);
                }
              }}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-gray-200 dark:border-gray-700"
            >
              <span>🚀 Play as Guest (Instant Access)</span>
            </button>
          </form>

          {/* Toggle modes trigger */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMessage(null);
              }}
              className="text-xs text-indigo-650 dark:text-indigo-400 hover:underline font-bold uppercase transition-all cursor-pointer"
            >
              {isSignUp ? 'Already registered? Login here' : 'New student helper? Register workspace'}
            </button>
          </div>

          <div className="bg-amber-500/5 border border-amber-300/30 p-3 rounded-2xl text-[9px] text-amber-600 dark:text-amber-450 font-medium leading-relaxed flex gap-2">
            <Sparkles className="w-4 h-4 text-amber-550 shrink-0 animate-pulse" />
            <span>
              <strong>Dual Mode Sandbox Enabled</strong>: Sign up and register works instantly using our secure Offline sandbox fallbacks if direct live cloud sync is completed or pending!
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
