import React, { useState } from 'react';
import {
  HelpCircle,
  FileQuestion,
  AlertTriangle,
  Send,
  CheckCircle2,
  BookOpen,
  FolderOpen,
  Phone,
  Mail,
  Shield,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface FAQ {
  q: string;
  a: string;
  cat: string;
}

export const HelpGrievancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'faqs' | 'raise' | 'track' | 'contact'>('faqs');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  // Grievance form state
  const [appId, setAppId] = useState('');
  const [category, setCategory] = useState('DOCUMENT_MISMATCH');
  const [description, setDescription] = useState('');
  const [fileAttached, setFileAttached] = useState<string | null>(null);
  const [submittedGrievanceId, setSubmittedGrievanceId] = useState<string | null>(null);

  // Track Grievance state
  const [trackGrievanceId, setTrackGrievanceId] = useState('');
  const [trackResult, setTrackResult] = useState<any | null>(null);

  const faqs: FAQ[] = [
    {
      cat: 'Applications',
      q: 'How does Mira verify citizen applications without manual delays?',
      a: 'Mira combines automated OCR field extraction with deterministic scheme rules. Clean applications with verified records move directly to officer sign-off. Any document discrepancies generate structured evidence warnings rather than automatic rejections.',
    },
    {
      cat: 'Household & Family',
      q: 'What is temporal household history and why is it preserved?',
      a: 'Mira never deletes historical relationships. When a family member marries, separates, or splits households, valid_from and valid_to dates are recorded. This prevents unfair duplicate benefit flags while maintaining verifiable legal provenance.',
    },
    {
      cat: 'Duplicates',
      q: 'Why was my application flagged as a potential duplicate?',
      a: 'If a household-level benefit was already granted to the same address, property, or family member under the same scheme category, Mira flags it for human review. You can upload clarification evidence, and an authorized officer will adjudicate the flag.',
    },
    {
      cat: 'Documents',
      q: 'What should I do if the system flags an "Income Mismatch"?',
      a: 'If the stated income in your application does not match the figure extracted from your uploaded certificate, you will receive a mismatch alert. You can either correct the application form value or submit an updated affidavit for officer review.',
    },
    {
      cat: 'Privacy',
      q: 'Can another user view my records if they know my ID?',
      a: 'No. Mira enforces backend-level object authorization (IDOR protection). Attempting to access another citizen profile or document immediately returns a 403 Forbidden response and is logged in the security audit trail.',
    },
  ];

  const handleGrievanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newId = `GRV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedGrievanceId(newId);
  };

  const handleTrackGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackGrievanceId.trim()) return;

    setTrackResult({
      id: trackGrievanceId,
      category: 'Document Extraction Correction',
      status: 'UNDER_OFFICER_INVESTIGATION',
      filedAt: '2026-10-21',
      assignedOfficer: 'Officer S. Verma (Verification Division)',
      latestUpdate: 'Supporting income tax certificate reviewed. Scheduled for final resolution within 48 hours.',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title */}
      <div className="bg-white p-6 rounded-xl border border-[#DCE3EA] shadow-2xs">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#123B63] flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#172033]">
              Public Documentation Help & Grievance Portal
            </h1>
            <p className="text-xs text-slate-500">
              Browse official guidance, raise an appeal regarding an application assessment, or track your submitted grievance.
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-[#DCE3EA] mt-4 space-x-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('faqs')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'faqs'
                ? 'border-[#123B63] text-[#123B63]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Frequently Asked Questions
          </button>
          <button
            onClick={() => setActiveTab('raise')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'raise'
                ? 'border-[#123B63] text-[#123B63]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Raise Official Grievance
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'track'
                ? 'border-[#123B63] text-[#123B63]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Track Grievance Status
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'contact'
                ? 'border-[#123B63] text-[#123B63]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Contact Department
          </button>
        </div>
      </div>

      {/* FAQs Tab */}
      {activeTab === 'faqs' && (
        <div className="bg-white p-6 rounded-xl border border-[#DCE3EA] shadow-2xs space-y-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Verified Civic Documentation FAQs
          </h2>
          <div className="divide-y divide-slate-100">
            {faqs.map((faq, index) => {
              const isOpen = expandedFaq === index;
              return (
                <div key={index} className="py-3">
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : index)}
                    className="w-full text-left flex items-center justify-between text-sm font-semibold text-slate-800 hover:text-[#123B63] transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="mt-2 text-xs text-slate-600 leading-relaxed bg-[#F8F8F5] p-3 rounded-lg border border-[#DCE3EA]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Raise Grievance Tab */}
      {activeTab === 'raise' && (
        <div className="bg-white p-6 rounded-xl border border-[#DCE3EA] shadow-2xs space-y-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            File an Official Review or Appeal
          </h2>

          {submittedGrievanceId ? (
            <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-emerald-900">
                Grievance Successfully Registered
              </h3>
              <p className="text-xs text-emerald-700">
                Your docket identifier is <span className="font-mono font-bold">{submittedGrievanceId}</span>.
                It has been routed to the district verification division. You will receive an official update within 3 working days.
              </p>
              <button
                onClick={() => {
                  setSubmittedGrievanceId(null);
                  setDescription('');
                  setAppId('');
                }}
                className="mt-4 px-4 py-2 bg-[#123B63] text-white rounded-[7px] text-xs font-semibold"
              >
                File Another Grievance
              </button>
            </div>
          ) : (
            <form onSubmit={handleGrievanceSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Associated Application ID (Optional)
                </label>
                <input
                  type="text"
                  value={appId}
                  onChange={(e) => setAppId(e.target.value)}
                  placeholder="e.g. APP-2026-PMGSY-001"
                  className="w-full bg-[#F5F5F1] border border-[#DCE3EA] rounded-[7px] p-2 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-[#2563A6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Grievance Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#F5F5F1] border border-[#DCE3EA] rounded-[7px] p-2 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-[#2563A6]"
                >
                  <option value="DOCUMENT_MISMATCH">Document Extraction or OCR Mismatch</option>
                  <option value="DUPLICATE_FLAG_APPEAL">Appeal Against Duplicate Benefit Flag</option>
                  <option value="ELIGIBILITY_CONTEST">Contest Ineligible Rule Assessment</option>
                  <option value="HOUSEHOLD_SPLIT_DELAY">Household Split or Life Event Update Delay</option>
                  <option value="OTHER">Other Public Documentation Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detailed Explanation / Grounds of Appeal
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Clearly state why the assessment should be reconsidered or describe the specific record error..."
                  className="w-full bg-[#F5F5F1] border border-[#DCE3EA] rounded-[7px] p-2.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-[#2563A6]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Attach Clarification Evidence (PDF, PNG, JPG)
                </label>
                <input
                  type="file"
                  onChange={(e) => setFileAttached(e.target.files?.[0]?.name || null)}
                  className="text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                />
                {fileAttached && (
                  <span className="text-[11px] text-emerald-600 block mt-1 font-medium">
                    Attached: {fileAttached}
                  </span>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!description.trim()}
                  className="bg-[#123B63] hover:bg-[#0B2540] disabled:opacity-50 text-white font-semibold text-xs px-5 py-2.5 rounded-[7px] shadow-xs transition-colors flex items-center"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  <span>Submit Formal Grievance</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Track Grievance Tab */}
      {activeTab === 'track' && (
        <div className="bg-white p-6 rounded-xl border border-[#DCE3EA] shadow-2xs space-y-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Track Grievance Docket
          </h2>

          <form onSubmit={handleTrackGrievance} className="flex gap-2">
            <input
              type="text"
              value={trackGrievanceId}
              onChange={(e) => setTrackGrievanceId(e.target.value)}
              placeholder="e.g. GRV-2026-8492"
              className="flex-1 bg-[#F5F5F1] border border-[#DCE3EA] rounded-[7px] px-3 py-2 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-[#2563A6]"
            />
            <button
              type="submit"
              className="bg-[#123B63] text-white px-4 py-2 rounded-[7px] text-xs font-semibold"
            >
              Track Docket
            </button>
          </form>

          {trackResult && (
            <div className="p-4 bg-[#F8F8F5] rounded-lg border border-[#DCE3EA] text-xs space-y-2 mt-4">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[#123B63]">{trackResult.id}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  {trackResult.status.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="text-slate-700">
                <span className="font-semibold">Category:</span> {trackResult.category}
              </div>
              <div className="text-slate-700">
                <span className="font-semibold">Assigned Officer:</span> {trackResult.assignedOfficer}
              </div>
              <div className="text-slate-700">
                <span className="font-semibold">Latest Action:</span> {trackResult.latestUpdate}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Contact Tab */}
      {activeTab === 'contact' && (
        <div className="bg-white p-6 rounded-xl border border-[#DCE3EA] shadow-2xs space-y-4">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Department Directory & Public Helpdesk
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-[#F8F8F5] rounded-lg border border-[#DCE3EA]">
              <div className="flex items-center space-x-2 text-[#123B63] font-bold mb-1">
                <Phone className="w-4 h-4" />
                <span>Toll-Free Civic Helpdesk</span>
              </div>
              <p className="text-slate-600">1800-11-MIRA (6472) — Available 8:00 AM – 8:00 PM (Mon–Sat)</p>
            </div>
            <div className="p-4 bg-[#F8F8F5] rounded-lg border border-[#DCE3EA]">
              <div className="flex items-center space-x-2 text-[#123B63] font-bold mb-1">
                <Mail className="w-4 h-4" />
                <span>Email Correspondence</span>
              </div>
              <p className="text-slate-600">helpdesk@mira.gov.in / grievances@mira.gov.in</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
