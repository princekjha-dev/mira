import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/context';
import { ApiClientError } from '../api/client';
import {
  Shield,
  KeyRound,
  ArrowRight,
  UserCheck,
  AlertCircle,
  Phone,
  Lock,
  Building,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const DEMO_PASSWORD = 'MiraDemo@2026!';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Mode: citizen, officer, admin
  const isOfficerRoute = location.pathname.includes('/officer');
  const [activeTab, setActiveTab] = useState<'citizen' | 'officer' | 'admin'>(
    isOfficerRoute ? 'officer' : 'citizen'
  );

  // Citizen OTP Flow Simulation state
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [consentChecked, setConsentChecked] = useState(true);

  // Email/Password state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let timer: any;
    if (otpSent && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  const demoAccounts = [
    { roleKey: 'auth.roleCitizen', email: 'citizen@mira.local', role: 'CITIZEN' },
    { roleKey: 'auth.roleOfficer', email: 'officer@mira.local', role: 'FIELD_OFFICIAL' },
    { roleKey: 'auth.roleVerifier', email: 'verifier@mira.local', role: 'VERIFICATION_OFFICER' },
    { roleKey: 'auth.roleAdmin', email: 'admin@mira.local', role: 'DEPARTMENT_ADMIN' },
    { roleKey: 'auth.roleAuditor', email: 'auditor@mira.local', role: 'AUDITOR' },
  ];

  const fillDemoAccount = (demoEmail: string) => {
    setLoginMethod('password');
    setEmail(demoEmail);
    setPassword(DEMO_PASSWORD);
    setError(null);
    setValidationErrors({});
  };

  const handleSendOtp = () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      setError('Please enter a valid 10-digit mobile number or synthetic Aadhaar.');
      return;
    }
    setError(null);
    setOtpSent(true);
    setCountdown(30);
    setOtpCode('123456'); // Pre-fill synthetic OTP for demo convenience
  };

  const handleVerifyOtp = async () => {
    if (otpCode !== '123456') {
      setError('Invalid OTP code. For demo, use 123456.');
      return;
    }
    setIsSubmitting(true);
    try {
      // Connects to demo citizen account
      await login('citizen@mira.local', DEMO_PASSWORD);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setValidationErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError('Failed to authenticate. Please check your credentials.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-10 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-[#123B63] flex items-center justify-center text-white shadow-md">
            <Shield className="w-7 h-7 text-white" />
          </div>
        </div>
        <h1 className="mt-4 text-center text-2xl font-bold tracking-tight text-slate-900">
          {t('auth.loginTitle')}
        </h1>
        <p className="mt-1 text-center text-sm text-slate-600">
          {t('auth.loginSubtitle')}
        </p>

        {/* Role Separation Tabs */}
        <div className="mt-6 flex bg-[#F8F8F5] p-1 rounded-xl border border-[#DCE3EA] text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('citizen');
              fillDemoAccount('citizen@mira.local');
            }}
            className={`flex-1 py-2 rounded-lg text-center transition-all ${
              activeTab === 'citizen'
                ? 'bg-white text-[#123B63] shadow-xs border border-[#DCE3EA]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Resident Citizen
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('officer');
              fillDemoAccount('verifier@mira.local');
            }}
            className={`flex-1 py-2 rounded-lg text-center transition-all ${
              activeTab === 'officer'
                ? 'bg-white text-[#123B63] shadow-xs border border-[#DCE3EA]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Government Officer
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              fillDemoAccount('admin@mira.local');
            }}
            className={`flex-1 py-2 rounded-lg text-center transition-all ${
              activeTab === 'admin'
                ? 'bg-white text-[#123B63] shadow-xs border border-[#DCE3EA]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dept Administrator
          </button>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-[#DCE3EA] sm:rounded-xl sm:px-10">
          {error && (
            <div
              className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2.5 text-sm text-red-700"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Citizen Login Method Switcher */}
          {activeTab === 'citizen' && (
            <div className="flex items-center justify-center space-x-4 mb-5 text-xs">
              <button
                type="button"
                onClick={() => setLoginMethod('password')}
                className={`font-semibold pb-1 border-b-2 ${
                  loginMethod === 'password'
                    ? 'border-[#123B63] text-[#123B63]'
                    : 'border-transparent text-slate-500'
                }`}
              >
                Password Login
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('otp')}
                className={`font-semibold pb-1 border-b-2 ${
                  loginMethod === 'otp'
                    ? 'border-[#123B63] text-[#123B63]'
                    : 'border-transparent text-slate-500'
                }`}
              >
                Mobile / Synthetic Aadhaar OTP (Demo)
              </button>
            </div>
          )}

          {/* Citizen OTP Flow */}
          {activeTab === 'citizen' && loginMethod === 'otp' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number / Demo Aadhaar (Synthetic Only)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="Enter 10-digit mobile"
                    className="w-full bg-[#F5F5F1] border border-[#DCE3EA] rounded-[7px] pl-9 pr-3 py-2 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-[#2563A6]"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Demo synthetic integration only. No production UIDAI connectivity.
                </span>
              </div>

              {!otpSent ? (
                <div>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="w-full py-2.5 px-4 rounded-[7px] text-xs font-semibold text-white bg-[#123B63] hover:bg-[#0B2540] transition-colors"
                  >
                    Get 6-Digit Verification Code
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Enter 6-Digit OTP (Demo: 123456)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full bg-[#F5F5F1] border border-[#DCE3EA] rounded-[7px] p-2 text-center font-mono text-base tracking-widest text-slate-900 outline-none focus:ring-1 focus:ring-[#2563A6]"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Code expires in: <strong className="font-mono text-slate-700">{countdown}s</strong></span>
                    {countdown === 0 ? (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-[#2563A6] hover:underline font-semibold"
                      >
                        Resend Code
                      </button>
                    ) : (
                      <span className="text-slate-400">Resend in {countdown}s</span>
                    )}
                  </div>

                  <label className="flex items-start space-x-2 pt-1 text-[11px] text-slate-600">
                    <input
                      type="checkbox"
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      className="rounded border-slate-300 text-[#123B63] mt-0.5"
                    />
                    <span>I consent to using my synthetic demo record for portal verification.</span>
                  </label>

                  <button
                    type="button"
                    disabled={isSubmitting || !consentChecked}
                    onClick={handleVerifyOtp}
                    className="w-full py-2.5 px-4 rounded-[7px] text-xs font-semibold text-white bg-[#15803D] hover:bg-[#166534] disabled:opacity-50 transition-colors"
                  >
                    {isSubmitting ? 'Verifying...' : 'Verify & Sign In'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Standard Password Form (Preserves exact test attributes) */
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  {t('auth.email')}
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('auth.emailPlaceholder')}
                    autoComplete="email"
                    className={`block w-full px-3 py-2 border rounded-lg text-sm shadow-xs transition-colors ${
                      validationErrors.email
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
                    }`}
                    aria-invalid={!!validationErrors.email}
                    aria-describedby={validationErrors.email ? 'email-error' : undefined}
                  />
                  {validationErrors.email && (
                    <p id="email-error" className="mt-1 text-xs text-red-600 font-medium">
                      {validationErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  {t('auth.password')}
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.passwordPlaceholder')}
                    autoComplete="current-password"
                    className={`block w-full px-3 py-2 border rounded-lg text-sm shadow-xs transition-colors ${
                      validationErrors.password
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
                    }`}
                    aria-invalid={!!validationErrors.password}
                    aria-describedby={validationErrors.password ? 'password-error' : undefined}
                  />
                  {validationErrors.password && (
                    <p id="password-error" className="mt-1 text-xs text-red-600 font-medium">
                      {validationErrors.password}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {t('auth.loginAction')}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 1-Click Synthetic Demo Persona Autofill (Preserves exact test selectors) */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center space-x-2 mb-2">
              <UserCheck className="w-4 h-4 text-slate-500" />
              <h2 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                {t('auth.demoAccountsTitle')}
              </h2>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              {t('auth.demoAccountsHint')} Password is <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono text-[11px]">{DEMO_PASSWORD}</code>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => fillDemoAccount(account.email)}
                  className="flex items-center justify-between px-2.5 py-1.5 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 rounded-lg text-left transition-colors"
                >
                  <div>
                    <div className="text-xs font-medium text-slate-800">{t(account.roleKey)}</div>
                    <div className="text-[10px] text-slate-500 font-mono truncate max-w-[130px]">{account.email}</div>
                  </div>
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
              {t('auth.needAccount')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
