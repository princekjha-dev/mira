import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ShieldAlert,
  ShieldCheck,
  FileText,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit3,
  Sparkles,
  User,
  Home,
  MapPin,
  Clock,
  ArrowLeft,
  RefreshCw,
  Award,
} from 'lucide-react';
import { api } from '../api/client';
import { EvidencePack, DocumentExtraction, DocumentItem } from '../types';
import { DocumentViewer } from '../components/DocumentViewer';
import { useTranslation } from '../i18n/context';

export const CaseEvidenceWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [highlightedExtId, setHighlightedExtId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingExtraction, setEditingExtraction] = useState<DocumentExtraction | null>(null);
  const [correctedValue, setCorrectedValue] = useState('');
  const [correctionReason, setCorrectionReason] = useState('');
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [scenarioLoading, setScenarioLoading] = useState(false);

  // Fetch Evidence Pack for Case
  const { data: pack, isLoading, error, refetch } = useQuery<EvidencePack>({
    queryKey: ['case-evidence-pack', id],
    queryFn: async () => {
      const res = await api.get<{ data: EvidencePack }>(`/cases/${id}/evidence-pack`);
      return res.data;
    },
    enabled: !!id,
  });

  // Verify / Reject / Edit Mutation
  const verifyMutation = useMutation({
    mutationFn: async ({
      docId,
      extId,
      decision,
      correctedVal,
      reason,
    }: {
      docId: string;
      extId: string;
      decision: 'VERIFIED' | 'REJECTED' | 'EDITED';
      correctedVal?: string;
      reason?: string;
    }) => {
      const payload = {
        extraction_id: extId,
        decision,
        corrected_value: correctedVal,
        verification_method: 'MANUAL_INSPECTION',
        reason: reason || (decision === 'VERIFIED' ? 'Officer visual confirmation against scan' : 'Rejected by officer'),
      };
      return api.post(`/documents/${docId}/verify-extraction`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['case-evidence-pack', id] });
      setIsEditModalOpen(false);
      setActionMessage('Extraction verification updated successfully. Preserved in immutable audit trail.');
      setTimeout(() => setActionMessage(null), 4000);
    },
  });

  // Demo Scenarios Trigger
  const triggerDemoScenario = async (scenarioType: string) => {
    if (!pack) return;
    setScenarioLoading(true);
    try {
      const demoPayload = {
        filename: `${scenarioType}.txt`,
        owner_type: 'APPLICATION',
        owner_id: pack.case_id,
        specified_doc_type:
          scenarioType.includes('birth') ? 'BIRTH_CERTIFICATE' :
          scenarioType.includes('income') ? 'INCOME_CERTIFICATE' :
          scenarioType.includes('property') ? 'PROPERTY_DOCUMENT' : 'OTHER',
        document_demo_type: scenarioType,
        access_purpose: 'APPLICATION_VERIFICATION',
      };

      await api.post('/documents', demoPayload);
      await refetch();
      setActionMessage(`Demo Scenario '${scenarioType}' injected and evaluated successfully.`);
      setTimeout(() => setActionMessage(null), 5000);
    } catch (e: any) {
      setActionMessage(`Scenario upload failed: ${e.message}`);
    } finally {
      setScenarioLoading(false);
    }
  };

  const activeDoc: DocumentItem | null =
    pack?.documents?.find((d) => d.id === selectedDocId) ||
    pack?.documents?.[0] ||
    null;

  const activeExtractions = pack?.extractions?.filter((e) => !activeDoc || e.document_id === activeDoc.id) || [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
        <div className="text-slate-600 font-medium">{t('v5.processing')}</div>
      </div>
    );
  }

  if (error || !pack) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Case Evidence Pack Not Found</h2>
        <p className="text-slate-500 mt-2">Could not retrieve evidence pack for case ID: {id}</p>
        <Link
          to="/applications"
          className="inline-flex items-center space-x-2 mt-6 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Breadcrumb & Action Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
        <div className="flex items-center space-x-3">
          <Link
            to={`/applications/${pack.case_id}`}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold">
                {pack.case_public_id}
              </span>
              <h1 className="text-xl font-bold text-slate-900">{t('v5.evidenceWorkspace')}</h1>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              Applicant: <span className="font-semibold text-slate-700">{pack.applicant_name}</span> • Scheme:{' '}
              <span className="font-semibold text-slate-700">{pack.scheme_name}</span>
            </div>
          </div>
        </div>

        {/* Action Status Pill */}
        <div className="flex items-center space-x-3">
          <div
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border ${
              pack.recommended_action === 'MANUAL_OFFICER_REVIEW_REQUIRED'
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-emerald-50 text-emerald-800 border-emerald-300'
            }`}
          >
            {pack.recommended_action === 'MANUAL_OFFICER_REVIEW_REQUIRED' ? (
              <ShieldAlert className="w-4 h-4 text-amber-600" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            )}
            <span>{pack.recommended_action.replace(/_/g, ' ')}</span>
          </div>

          <button
            onClick={() => refetch()}
            className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-sm"
            title="Refresh Evidence"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Human Oversight Notification Callout */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>{t('v5.humanOversightNotice')}</span>
        </div>
        <div className="text-[11px] font-semibold text-blue-700">Audit-Ready Case Pack</div>
      </div>

      {/* Interactive Demo Scenarios Quick-Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
            <Award className="w-4 h-4 text-purple-600" />
            <span>{t('v5.demoScenarios')}</span>
          </span>
          <span className="text-[11px] text-slate-400">Click any scenario to simulate end-to-end evidence processing</span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            onClick={() => triggerDemoScenario('clean_birth')}
            disabled={scenarioLoading}
            className="px-3 py-1.5 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-slate-700 hover:text-emerald-800 text-xs font-medium rounded-lg transition"
          >
            {t('v5.scenario1')}
          </button>
          <button
            onClick={() => triggerDemoScenario('messy_scan')}
            disabled={scenarioLoading}
            className="px-3 py-1.5 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 text-slate-700 hover:text-amber-800 text-xs font-medium rounded-lg transition"
          >
            {t('v5.scenario2')}
          </button>
          <button
            onClick={() => triggerDemoScenario('multilingual_hindi')}
            disabled={scenarioLoading}
            className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 text-slate-700 hover:text-blue-800 text-xs font-medium rounded-lg transition"
          >
            {t('v5.scenario3')}
          </button>
          <button
            onClick={() => triggerDemoScenario('conflict_income_1988')}
            disabled={scenarioLoading}
            className="px-3 py-1.5 bg-slate-50 hover:bg-rose-50 hover:border-rose-300 border border-slate-200 text-slate-700 hover:text-rose-800 text-xs font-medium rounded-lg transition"
          >
            {t('v5.scenario4')}
          </button>
          <button
            onClick={() => triggerDemoScenario('property_p001_sanitation')}
            disabled={scenarioLoading}
            className="px-3 py-1.5 bg-slate-50 hover:bg-purple-50 hover:border-purple-300 border border-slate-200 text-slate-700 hover:text-purple-800 text-xs font-medium rounded-lg transition"
          >
            {t('v5.scenario5')}
          </button>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-lg flex items-center space-x-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Main Grid: Document Viewer on Left (7 cols), Extracted Evidence on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Document Viewer Container */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          {/* Document Selector Pills if multiple documents */}
          {pack.documents.length > 1 && (
            <div className="flex items-center space-x-2 overflow-x-auto pb-1">
              {pack.documents.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center space-x-1.5 whitespace-nowrap transition ${
                    activeDoc?.id === doc.id
                      ? 'bg-slate-900 text-white border-slate-800 shadow'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{doc.original_filename}</span>
                </button>
              ))}
            </div>
          )}

          <div className="h-[620px]">
            <DocumentViewer
              document={activeDoc}
              extractions={activeExtractions}
              highlightedExtractionId={highlightedExtId}
              onSelectExtraction={(ext) => setHighlightedExtId(ext.id)}
              onDownload={() => {
                if (activeDoc) {
                  window.open(`/api/v1/documents/${activeDoc.id}/download?purpose=APPLICATION_VERIFICATION`, '_blank');
                }
              }}
            />
          </div>
        </div>

        {/* Extracted Structured Evidence & Verification Table */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <h2 className="font-bold text-slate-900 text-sm">{t('v5.extractedEvidence')}</h2>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {activeExtractions.length} fields extracted
              </span>
            </div>

            {activeExtractions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No structured fields extracted yet. Upload a supporting document or trigger a demo scenario above.
              </div>
            ) : (
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {activeExtractions.map((field) => {
                  const isHighlighted = field.id === highlightedExtId;
                  const matchingVerification = pack.verifications?.find((v) => v.extraction_id === field.id);

                  return (
                    <div
                      key={field.id}
                      onClick={() => setHighlightedExtId(field.id)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        isHighlighted
                          ? 'border-emerald-500 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-400'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                              {field.field.replace(/_/g, ' ')}
                            </span>
                            {matchingVerification?.decision === 'VERIFIED' && (
                              <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                                <CheckCircle className="w-3 h-3 mr-0.5" /> Verified
                              </span>
                            )}
                            {matchingVerification?.decision === 'EDITED' && (
                              <span className="inline-flex items-center text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded">
                                <Edit3 className="w-3 h-3 mr-0.5" /> Corrected
                              </span>
                            )}
                          </div>
                          <div className="font-semibold text-slate-900 text-sm mt-0.5 font-serif">
                            {matchingVerification?.corrected_value || field.value}
                          </div>
                          {field.normalized_value && field.normalized_value !== field.value && (
                            <div className="text-[11px] text-slate-500">
                              Norm: <span className="font-mono text-slate-600">{field.normalized_value}</span>
                            </div>
                          )}
                        </div>

                        {/* Extraction Confidence Badge */}
                        <div className="text-right">
                          <div className="text-[11px] font-mono text-slate-500">
                            {Math.round(field.confidence * 100)}% conf
                          </div>
                          <div className="text-[10px] text-slate-400">
                            p{field.source_region?.page || 1} [{field.source_region?.x || 0},{field.source_region?.y || 0}]
                          </div>
                        </div>
                      </div>

                      {/* Inline Officer Decision Actions */}
                      <div className="flex items-center justify-end space-x-2 mt-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            verifyMutation.mutate({
                              docId: field.document_id,
                              extId: field.id,
                              decision: 'VERIFIED',
                            });
                          }}
                          className="px-2 py-1 text-[11px] font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded transition border border-emerald-200"
                        >
                          <CheckCircle className="w-3 h-3 inline mr-1" />
                          {t('v5.verify')}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingExtraction(field);
                            setCorrectedValue(field.value);
                            setCorrectionReason('');
                            setIsEditModalOpen(true);
                          }}
                          className="px-2 py-1 text-[11px] font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 rounded transition border border-slate-200"
                        >
                          <Edit3 className="w-3 h-3 inline mr-1" />
                          {t('v5.edit')}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            verifyMutation.mutate({
                              docId: field.document_id,
                              extId: field.id,
                              decision: 'REJECTED',
                            });
                          }}
                          className="px-2 py-1 text-[11px] font-medium bg-rose-50 hover:bg-rose-100 text-rose-700 rounded transition border border-rose-200"
                        >
                          <XCircle className="w-3 h-3 inline mr-1" />
                          {t('v5.reject')}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cross-Document Consistency & Entity Resolution Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-slate-900 text-base">{t('v5.consistencyCheck')}</h2>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {pack.consistency_report.conflict_count > 0 ? (
              <span className="text-rose-600 font-bold">{pack.consistency_report.conflict_count} Conflicts Flagged</span>
            ) : (
              <span className="text-emerald-600 font-bold">All Registry Checks Consistent</span>
            )}
          </span>
        </div>

        {/* Explainability Callout: Why Flagged? */}
        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center space-x-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>{t('v5.whyFlagged')}</span>
          </div>
          <p className="text-sm text-slate-800 leading-relaxed font-sans">{pack.why_flagged}</p>
        </div>

        {/* Consistency Check Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Person Match through V4 */}
          <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Person Match</span>
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  pack.entity_matches.person_matches.length > 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {pack.entity_matches.person_matches.length > 0
                  ? pack.entity_matches.person_matches[0].match_confidence
                  : 'UNCERTAIN'}
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-800">
              {pack.entity_matches.person_matches.length > 0
                ? pack.entity_matches.person_matches[0].full_name
                : 'No high-confidence link'}
            </div>
            <div className="text-xs text-slate-500">
              {pack.entity_matches.person_matches.length > 0
                ? pack.entity_matches.person_matches[0].explanation
                : 'V4 entity resolution requires review.'}
            </div>
          </div>

          {/* 2. Date of Birth Check */}
          <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Date of Birth</span>
              </span>
              {pack.consistency_report.checks.some((c) => c.field === 'DATE_OF_BIRTH' && c.result === 'CONFLICT') ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                  CONFLICT
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  CONSISTENT
                </span>
              )}
            </div>
            <div className="text-sm font-semibold text-slate-800">
              {pack.consistency_report.checks.find((c) => c.field === 'DATE_OF_BIRTH')?.explanation ||
                'DOB verified against civil registry.'}
            </div>
            <div className="text-xs text-slate-500">Cross-checked with Civil Registration Graph</div>
          </div>

          {/* 3. Household Match */}
          <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1">
                <Home className="w-3.5 h-3.5 text-slate-400" />
                <span>Household</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                {pack.entity_matches.household_matches.length > 0 ? 'SUPPORTS' : 'UNLINKED'}
              </span>
            </div>
            <div className="text-sm font-semibold text-slate-800">
              {pack.entity_matches.household_matches.length > 0
                ? pack.entity_matches.household_matches[0].household_name
                : 'No household associated'}
            </div>
            <div className="text-xs text-slate-500">Lifelong V2 Household Relationship Active</div>
          </div>

          {/* 4. Property & Duplicate Alert */}
          <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Property & Duplicate</span>
              </span>
              {pack.entity_matches.property_matches.some((p) => p.has_previous_benefits) ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                  DUPLICATE ALERT
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  CLEAR
                </span>
              )}
            </div>
            <div className="text-sm font-semibold text-slate-800">
              {pack.entity_matches.property_matches.length > 0
                ? pack.entity_matches.property_matches[0].public_id
                : 'No property identified'}
            </div>
            <div className="text-xs text-slate-500">
              {pack.entity_matches.property_matches.some((p) => p.has_previous_benefits)
                ? pack.entity_matches.property_matches[0].previous_benefit_details || 'Prior benefit recorded'
                : 'No previous benefit duplicates on this parcel.'}
            </div>
          </div>
        </div>

        {/* Grounded AI Summary Section */}
        {pack.ai_summary && (
          <div className="p-4 rounded-lg bg-indigo-50/70 border border-indigo-200 space-y-2">
            <div className="flex items-center space-x-2 text-indigo-900 font-semibold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>{t('v5.aiSummary')}</span>
              <span className="text-[10px] bg-indigo-200 text-indigo-800 px-1.5 py-0.2 rounded font-mono">
                {t('v5.sourceCited')}
              </span>
            </div>
            <p className="text-xs text-indigo-950 leading-relaxed font-sans">{pack.ai_summary}</p>
          </div>
        )}
      </div>

      {/* Audit Timeline */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <span>Case Evidence Provenance Timeline</span>
        </h3>

        <div className="space-y-4 pl-4 border-l-2 border-slate-200 ml-2">
          {pack.timeline?.map((ev, idx) => (
            <div key={idx} className="relative space-y-1">
              <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-slate-100" />
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-800">{ev.title}</span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                  {ev.actor}
                </span>
              </div>
              <div className="text-xs text-slate-600">{ev.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Officer Correction Modal */}
      {isEditModalOpen && editingExtraction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Human Officer Field Correction</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-600">
              Original OCR Extracted Value:{' '}
              <span className="font-mono font-bold text-slate-800">{editingExtraction.value}</span>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Original extraction will remain permanently preserved in immutable provenance.
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Corrected Value</label>
              <input
                type="text"
                value={correctedValue}
                onChange={(e) => setCorrectedValue(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Audit Justification / Reason</label>
              <textarea
                value={correctionReason}
                onChange={(e) => setCorrectionReason(e.target.value)}
                placeholder="E.g. Corrected OCR spelling variant based on physical verification"
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  verifyMutation.mutate({
                    docId: editingExtraction.document_id,
                    extId: editingExtraction.id,
                    decision: 'EDITED',
                    correctedVal: correctedValue,
                    reason: correctionReason,
                  });
                }}
                disabled={!correctedValue.trim()}
                className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition disabled:opacity-50"
              >
                Save Correction & Audit Trail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
