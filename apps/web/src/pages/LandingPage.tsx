import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  BookOpen,
  Search,
  CheckCircle2,
  Users,
  FolderOpen,
  Award,
  AlertTriangle,
  ArrowRight,
  FileCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation, SUPPORTED_LANGUAGES } from '../i18n/context';

export const LandingPage: React.FC = () => {
  const { user, login } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  const navigate = useNavigate();

  const handleQuickDemoLogin = async (email: string) => {
    try {
      await login(email, 'MiraDemo@2026!');
      navigate('/dashboard');
    } catch {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F1] text-[#172033] flex flex-col">
      {/* Top Banner Notice */}
      <div className="bg-[#123B63] text-white text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>{t('app.demoNotice')}</span>
      </div>

      {/* Public Header */}
      <header className="bg-white border-b border-[#DCE3EA] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-[#123B63] text-white flex items-center justify-center shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-[#172033]">
                {t('app.title')}
              </span>
              <span className="hidden sm:inline-block ml-2 text-[11px] text-slate-500 font-medium">
                PS7 Unified Digital Documentation
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
            <Link to="/schemes" className="hover:text-[#123B63] transition-colors">
              {t('nav.schemes')}
            </Link>
            <Link to="/eligibility" className="hover:text-[#123B63] transition-colors">
              Check Eligibility
            </Link>
            <Link to="/track" className="hover:text-[#123B63] transition-colors">
              Track Application
            </Link>
            <Link to="/help" className="hover:text-[#123B63] transition-colors">
              Help & Grievance
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            {/* Language Quick Dropdown */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="bg-slate-50 border border-[#DCE3EA] rounded-md px-2 py-1 text-xs text-slate-700 outline-none"
              aria-label="Language"
            >
              {SUPPORTED_LANGUAGES.map((l: any) => (
                <option key={l.code} value={l.code}>
                  {l.nativeName} ({l.name})
                </option>
              ))}
            </select>

            {user ? (
              <Link
                to="/dashboard"
                className="bg-[#123B63] text-white hover:bg-[#0B2540] px-4 py-2 rounded-[7px] text-xs font-semibold shadow-xs transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-[#123B63] text-white hover:bg-[#0B2540] px-4 py-2 rounded-[7px] text-xs font-semibold shadow-xs transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-[#DCE3EA] bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#EBF3FC] text-[#123B63] border border-[#DCE3EA] mb-6">
            <span className="w-2 h-2 rounded-full bg-[#2563A6] mr-2" />
            Unified Operating System for Citizen Records & Welfare Services
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#172033] leading-tight sm:leading-tight">
            Your public records and welfare services, connected.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            A unified platform for accessing household information, public documentation,
            welfare schemes, applications and benefits with verifiable evidence and human oversight.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/schemes"
              className="inline-flex items-center bg-[#123B63] hover:bg-[#0B2540] text-white px-6 py-3 rounded-[7px] text-sm font-semibold shadow-xs transition-colors group"
            >
              <span>Explore Schemes</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              to="/track"
              className="inline-flex items-center bg-white hover:bg-slate-50 text-slate-700 border border-[#DCE3EA] px-6 py-3 rounded-[7px] text-sm font-semibold shadow-xs transition-colors"
            >
              <Search className="w-4 h-4 mr-2 text-slate-500" />
              <span>Track Application</span>
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center bg-[#F8F8F5] hover:bg-slate-100 text-[#123B63] border border-[#DCE3EA] px-5 py-3 rounded-[7px] text-sm font-medium shadow-xs transition-colors"
            >
              <span>Officer / Department Login</span>
            </Link>
          </div>
        </div>

        {/* Clean Architecture Spine Diagram */}
        <div className="max-w-5xl mx-auto mt-12 p-6 bg-[#F8F8F5] rounded-xl border border-[#DCE3EA]">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider text-center mb-4">
            Unified Public Documentation Architecture Spine
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            <div className="bg-white p-3 rounded-lg border border-[#DCE3EA] shadow-2xs">
              <div className="text-[10px] font-bold text-[#123B63] uppercase">1. Individual</div>
              <div className="text-xs font-semibold text-slate-800 mt-1">Person Record</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Isolated & Verified</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-[#DCE3EA] shadow-2xs">
              <div className="text-[10px] font-bold text-[#2563A6] uppercase">2. Household</div>
              <div className="text-xs font-semibold text-slate-800 mt-1">Temporal Graph</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Valid-From / Valid-To</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-[#DCE3EA] shadow-2xs">
              <div className="text-[10px] font-bold text-[#0F766E] uppercase">3. Scheme</div>
              <div className="text-xs font-semibold text-slate-800 mt-1">Versioned Rules</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Person / HH / Prop</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-[#DCE3EA] shadow-2xs">
              <div className="text-[10px] font-bold text-amber-700 uppercase">4. Application</div>
              <div className="text-xs font-semibold text-slate-800 mt-1">Evidence Pack</div>
              <div className="text-[10px] text-slate-500 mt-0.5">OCR & Mismatch Checks</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-[#DCE3EA] shadow-2xs">
              <div className="text-[10px] font-bold text-indigo-700 uppercase">5. Verification</div>
              <div className="text-xs font-semibold text-slate-800 mt-1">Human Decision</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Duplicate Flag Review</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-[#DCE3EA] shadow-2xs">
              <div className="text-[10px] font-bold text-emerald-700 uppercase">6. Benefit</div>
              <div className="text-xs font-semibold text-slate-800 mt-1">Traceable Ledger</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Audited & Disbursed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Services Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#DCE3EA]">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#172033]">
              Quick Citizen & Public Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Access core public welfare services, check eligibility transparently, and track active records.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#123B63] mt-2 sm:mt-0">
            8 Fully Functional Portals
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Explore Schemes */}
          <Link
            to="/schemes"
            className="bg-white p-5 rounded-lg border border-[#DCE3EA] hover:border-[#123B63] hover:shadow-xs transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#123B63] flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#123B63] transition-colors">
                Explore Schemes
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Discover state and central welfare schemes categorized by Housing, Education, Healthcare, and Agriculture.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-[#2563A6]">
              <span>View Schemes</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 2. Check Eligibility */}
          <Link
            to="/eligibility"
            className="bg-white p-5 rounded-lg border border-[#DCE3EA] hover:border-[#123B63] hover:shadow-xs transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#15803D] flex items-center justify-center mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#123B63] transition-colors">
                Check Eligibility
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Evaluate your household profile against deterministic scheme rules before applying.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-[#15803D]">
              <span>Run Rule Engine</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 3. Apply for Scheme */}
          <Link
            to="/applications/new"
            className="bg-white p-5 rounded-lg border border-[#DCE3EA] hover:border-[#123B63] hover:shadow-xs transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-[#0F766E] flex items-center justify-center mb-3">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#123B63] transition-colors">
                Apply for Scheme
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Submit an application with pre-filled verified records and structured supporting documents.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-[#0F766E]">
              <span>Start Application</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 4. Track Application */}
          <Link
            to="/track"
            className="bg-white p-5 rounded-lg border border-[#DCE3EA] hover:border-[#123B63] hover:shadow-xs transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-[#D97706] flex items-center justify-center mb-3">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#123B63] transition-colors">
                Track Application
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Inspect real-time status, evidence verification stage, and officer review timeline using your ID.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-[#D97706]">
              <span>Track Now</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 5. My Family Record */}
          <Link
            to={user ? '/citizen/family' : '/login'}
            className="bg-white p-5 rounded-lg border border-[#DCE3EA] hover:border-[#123B63] hover:shadow-xs transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#123B63] transition-colors">
                My Family & Household
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Review household members, historical temporal relationships, and submit life event updates.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-700">
              <span>View Household</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 6. My Documents */}
          <Link
            to={user ? '/documents' : '/login'}
            className="bg-white p-5 rounded-lg border border-[#DCE3EA] hover:border-[#123B63] hover:shadow-xs transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center mb-3">
                <FolderOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#123B63] transition-colors">
                My Documents
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Manage uploaded identity, income, and property certificates with OCR field verification.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-sky-700">
              <span>Access Vault</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 7. Benefit History */}
          <Link
            to={user ? '/benefits' : '/login'}
            className="bg-white p-5 rounded-lg border border-[#DCE3EA] hover:border-[#123B63] hover:shadow-xs transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#123B63] transition-colors">
                Benefit Ledger
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Consolidated ledger of individual, household, and property welfare benefits received.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-purple-700">
              <span>View Ledger</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* 8. Raise Grievance */}
          <Link
            to="/help"
            className="bg-white p-5 rounded-lg border border-[#DCE3EA] hover:border-[#123B63] hover:shadow-xs transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-[#B91C1C] flex items-center justify-center mb-3">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#123B63] transition-colors">
                Raise Grievance
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                File a formal discrepancy review or appeal an application assessment directly to department officers.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-[#B91C1C]">
              <span>File Grievance</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* 1-Click Synthetic Demo Persona Quick Launch */}
      <section className="py-10 bg-white border-t border-[#DCE3EA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#F8F8F5] p-6 rounded-xl border border-[#DCE3EA]">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Quick Evaluate: Synthetic Demo Accounts
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click any role below to instantly log in and evaluate authentic workflows:
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => handleQuickDemoLogin('citizen@mira.local')}
                  className="px-3 py-1.5 rounded-md bg-white border border-[#DCE3EA] text-slate-800 hover:border-[#123B63] font-medium shadow-2xs transition-colors"
                >
                  Citizen (Rahul)
                </button>
                <button
                  onClick={() => handleQuickDemoLogin('officer@mira.local')}
                  className="px-3 py-1.5 rounded-md bg-white border border-[#DCE3EA] text-slate-800 hover:border-[#123B63] font-medium shadow-2xs transition-colors"
                >
                  Field Officer
                </button>
                <button
                  onClick={() => handleQuickDemoLogin('verifier@mira.local')}
                  className="px-3 py-1.5 rounded-md bg-white border border-[#DCE3EA] text-slate-800 hover:border-[#123B63] font-medium shadow-2xs transition-colors"
                >
                  Verification Officer
                </button>
                <button
                  onClick={() => handleQuickDemoLogin('admin@mira.local')}
                  className="px-3 py-1.5 rounded-md bg-white border border-[#DCE3EA] text-slate-800 hover:border-[#123B63] font-medium shadow-2xs transition-colors"
                >
                  Department Admin
                </button>
                <button
                  onClick={() => handleQuickDemoLogin('auditor@mira.local')}
                  className="px-3 py-1.5 rounded-md bg-white border border-[#DCE3EA] text-slate-800 hover:border-[#123B63] font-medium shadow-2xs transition-colors"
                >
                  Auditor
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Public Footer */}
      <footer className="mt-auto border-t border-[#DCE3EA] bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-800">{t('app.title')}</span>
            <span>—</span>
            <span>{t('app.tagline')}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/schemes" className="hover:text-slate-800">Schemes</Link>
            <Link to="/track" className="hover:text-slate-800">Track</Link>
            <Link to="/help" className="hover:text-slate-800">Help & FAQs</Link>
            <Link to="/login" className="hover:text-slate-800">Officer Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
