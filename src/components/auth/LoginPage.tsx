import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Lock, Mail, CheckCircle2 } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onBackToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onBackToLanding,
}) => {
  const [email, setEmail] = useState('admin@cityos.campus.edu');
  const [password, setPassword] = useState('cityos2026');
  const [rememberMe, setRememberMe] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSentNotice, setResetSentNotice] = useState(false);

  const fillCredentials = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 500);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-[#2563EB] selection:text-white">
      {/* Return to landing button */}
      <button
        onClick={onBackToLanding}
        className="absolute top-6 left-6 text-xs font-semibold text-[#64748B] hover:text-[#1E293B] transition-colors"
      >
        ← Back to CITYOS Overview
      </button>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#2563EB] flex items-center justify-center text-white font-black text-xl shadow-sm mx-auto mb-3">
            C
          </div>
          <h1 className="text-2xl font-extrabold text-[#1E293B] tracking-tight">
            {isRegistering ? 'Create CITYOS Operator Account' : 'CITYOS Operations Portal'}
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Intelligent Campus Operating System · Secure FIDO2 Auth
          </p>
        </div>

        {/* Login Form Box */}
        <div className="p-7 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] shadow-sm space-y-5">
          {/* Explicit Authorized Credentials Box */}
          <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] text-xs text-[#1E293B] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                <span className="font-bold text-[#1E293B]">Authorized Demo Credentials</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#DBEAFE] text-[#1E40AF]">
                Tier-1 Admin
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono bg-white p-2.5 rounded-lg border border-[#BFDBFE]">
              <div>
                <span className="text-[#64748B] font-sans block text-[10px]">Email:</span>
                <span className="text-[#1E293B] font-semibold">admin@cityos.campus.edu</span>
              </div>
              <div>
                <span className="text-[#64748B] font-sans block text-[10px]">Password:</span>
                <span className="text-[#1E293B] font-semibold">cityos2026</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => fillCredentials('admin@cityos.campus.edu', 'cityos2026')}
                className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#F8FAFC] text-[#1E293B] text-xs font-medium transition-colors border border-[#CBD5E1] flex-1 text-center"
              >
                Auto-fill Admin
              </button>
              <button
                type="button"
                onClick={onLoginSuccess}
                className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1E40AF] text-white text-xs font-bold transition-all shadow-sm flex-1 text-center"
              >
                Instant Entry →
              </button>
            </div>
          </div>

          {/* Inline notification if reset requested */}
          {resetSentNotice && (
            <div className="p-3 rounded-xl bg-[#DCFCE7] border border-[#86EFAC] text-[#166534] text-xs flex items-center justify-between">
              <span>Password reset instructions sent to <strong>admin@cityos.campus.edu</strong>.</span>
              <button
                type="button"
                onClick={() => setResetSentNotice(false)}
                className="text-[#166534] hover:text-[#14532D] ml-2"
              >
                ✕
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#1E293B] block mb-1.5">
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@campus.edu"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#1E293B] placeholder-[#64748B] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#1E293B]">
                  Password
                </label>
                {!isRegistering && (
                  <button
                    type="button"
                    onClick={() => setResetSentNotice(true)}
                    className="text-[11px] text-[#2563EB] hover:text-[#1E40AF] font-medium transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#1E293B] placeholder-[#64748B] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]/20 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#64748B] pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-[#CBD5E1] bg-white text-[#2563EB] focus:ring-[#2563EB]"
                />
                <span>Remember me on this workstation</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#2563EB] hover:bg-[#1E40AF] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <span>{isRegistering ? 'Complete Registration' : 'Sign In to CITYOS'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E2E8F0]" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-semibold">
              <span className="bg-white px-2 text-[#64748B]">Or continue with</span>
            </div>
          </div>

          {/* Google SSO Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] text-xs font-semibold text-[#1E293B] flex items-center justify-center gap-2.5 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google Workspace</span>
          </button>

          {/* Toggle between Login and Register */}
          <div className="pt-2 text-center text-xs text-[#64748B]">
            {isRegistering ? (
              <>
                Already have an operator account?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="text-[#2563EB] hover:text-[#1E40AF] font-semibold"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                Need authorization for a new facility?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegistering(true)}
                  className="text-[#2563EB] hover:text-[#1E40AF] font-semibold"
                >
                  Create account
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
