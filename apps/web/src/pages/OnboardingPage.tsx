import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  User,
  Home,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Check,
  Sparkles,
  FileText,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n/context';

export const OnboardingPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const steps = [
    { id: 1, title: 'Profile Setup', desc: 'Confirm verified individual identity' },
    { id: 2, title: 'Household Context', desc: 'Link to an existing or new household' },
    { id: 3, title: 'Record Verification', desc: 'Review pre-filled certificates' },
    { id: 4, title: 'Welfare Schemes', desc: 'Discover schemes you may qualify for' },
  ];

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Welcome Card */}
      <div className="bg-white p-8 rounded-xl border border-[#DCE3EA] shadow-2xs text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#123B63] text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome to Mira, {user?.display_name || 'Citizen'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mt-1 leading-relaxed">
          Your unified public documentation portal is ready. Complete these quick steps to connect your household and explore accessible welfare entitlements.
        </p>

        {/* Stepper Progress Bar */}
        <div className="mt-8 mb-6">
          <div className="flex items-center justify-between relative max-w-xl mx-auto">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#DCE3EA] z-0" />
            {steps.map((s) => {
              const isDone = s.id < currentStep;
              const isCurrent = s.id === currentStep;

              return (
                <div key={s.id} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isDone
                        ? 'bg-[#15803D] text-white ring-4 ring-white'
                        : isCurrent
                        ? 'bg-[#123B63] text-white ring-4 ring-blue-100'
                        : 'bg-white text-slate-400 border-2 border-[#DCE3EA]'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4" /> : s.id}
                  </div>
                  <span
                    className={`text-[11px] font-medium mt-1.5 hidden sm:block ${
                      isCurrent ? 'text-slate-900 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Step Content */}
        <div className="max-w-xl mx-auto text-left p-6 bg-[#F8F8F5] rounded-xl border border-[#DCE3EA] mt-4">
          {currentStep === 1 && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-[#123B63] font-bold text-sm">
                <User className="w-4 h-4" />
                <span>Step 1: Individual Profile Setup</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your individual account has been provisioned with UUID object isolation. In Mira, your verified identity remains distinct from your family record.
              </p>
              <div className="p-3 bg-white rounded-lg border border-[#DCE3EA] text-xs space-y-1">
                <div><span className="text-slate-400">Name:</span> <strong className="text-slate-800">{user?.display_name || 'Rahul Kumar'}</strong></div>
                <div><span className="text-slate-400">Email Identifier:</span> <span className="font-mono text-slate-700">{user?.email || 'citizen@mira.local'}</span></div>
                <div><span className="text-slate-400">Assigned Role:</span> <span className="font-semibold text-emerald-700">CITIZEN</span></div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-[#123B63] font-bold text-sm">
                <Home className="w-4 h-4" />
                <span>Step 2: Household & Family Association</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect with your household to enable household-level benefits (like rural housing subsidies and ration cards).
              </p>
              <div className="p-3 bg-white rounded-lg border border-[#DCE3EA] text-xs space-y-1">
                <div><span className="text-slate-400">Associated Household:</span> <strong className="text-slate-800">Kumar Family Household (H-1001)</strong></div>
                <div><span className="text-slate-400">Membership Role:</span> <span className="text-slate-700">HEAD</span></div>
                <div><span className="text-slate-400">Effective Date:</span> <span className="font-mono text-slate-700">2024-01-01 to Present</span></div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-[#123B63] font-bold text-sm">
                <FileText className="w-4 h-4" />
                <span>Step 3: Document Verification Record</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pre-linked synthetic certificates have been verified with automated OCR and consistency checks.
              </p>
              <div className="p-3 bg-white rounded-lg border border-[#DCE3EA] text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span>Synthetic Identity Credential</span>
                  <span className="text-emerald-700 font-semibold">✓ Verified</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Annual Income Certificate</span>
                  <span className="text-emerald-700 font-semibold">✓ Verified (0.95 conf)</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-[#123B63] font-bold text-sm">
                <BookOpen className="w-4 h-4" />
                <span>Step 4: Explore Welfare Schemes</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                You are ready to access your dashboard! You can explore recommended schemes and test deterministic eligibility anytime.
              </p>
              <div className="p-3 bg-white rounded-lg border border-[#DCE3EA] text-xs flex items-center justify-between">
                <span>Recommended: Pradhan Mantri Awas Yojana (Rural)</span>
                <span className="font-semibold text-[#123B63]">Likely Eligible</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="max-w-xl mx-auto flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-xs text-slate-500 hover:text-slate-800"
          >
            Skip for now
          </button>

          <div className="flex items-center space-x-2">
            {currentStep > 1 && (
              <button
                onClick={() => setCurrentStep((c) => c - 1)}
                className="px-3.5 py-1.5 border border-[#DCE3EA] rounded-[7px] text-xs text-slate-700 hover:bg-slate-50"
              >
                Back
              </button>
            )}

            {currentStep < totalSteps ? (
              <button
                onClick={() => setCurrentStep((c) => c + 1)}
                className="px-4 py-1.5 bg-[#123B63] hover:bg-[#0B2540] text-white rounded-[7px] text-xs font-semibold shadow-xs flex items-center"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-5 py-1.5 bg-[#15803D] hover:bg-[#166534] text-white rounded-[7px] text-xs font-semibold shadow-xs flex items-center"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
