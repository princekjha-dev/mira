import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FileText,
  UploadCloud,
  Camera,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Lock,
  Layers,
} from 'lucide-react';
import { api } from '../api/client';
import { DocumentItem } from '../types';
import { useTranslation } from '../i18n/context';

export const DocumentsPortal: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedPurpose, setSelectedPurpose] = useState('APPLICATION_VERIFICATION');

  // Fetch list of accessible documents
  const { data: documents = [], isLoading, refetch } = useQuery<DocumentItem[]>({
    queryKey: ['documents'],
    queryFn: async () => {
      const res = await api.get<{ data: DocumentItem[] }>('/documents');
      return res.data;
    },
  });

  // Upload Mutation
  const uploadMutation = useMutation({
    mutationFn: async ({ file, purpose }: { file: File; purpose: string }) => {
      setUploadProgress('Validating file signature & scanning...');

      // Convert file to Base64 data URL
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setUploadProgress('Scanning for malicious content & ingesting...');

      const payload = {
        filename: file.name,
        owner_type: 'CITIZEN',
        owner_id: '00000000-0000-0000-0000-000000000000', // Server defaults to current authenticated citizen/case
        file_content_base64: base64Data,
        access_purpose: purpose,
      };

      return api.post('/documents', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      setUploadProgress(null);
      setUploadError(null);
    },
    onError: (err: any) => {
      setUploadProgress(null);
      setUploadError(err.message || 'File upload and security scanning failed');
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadError(null);
      uploadMutation.mutate({ file, purpose: selectedPurpose });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setUploadError(null);
      uploadMutation.mutate({ file, purpose: selectedPurpose });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              V5 Evidence Operating System
            </span>
            <span className="text-xs text-slate-400">• Security & Privacy Enforced</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">{t('v5.title')}</h1>
          <p className="text-sm text-slate-500 mt-1">
            Tamper-evident ingestion, format verification, Devanagari/Latin OCR, structured extraction, and provenance audit.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="flex items-center space-x-1.5 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Purpose Limitation & Drag-and-Drop Ingestion Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <UploadCloud className="w-5 h-5 text-emerald-600" />
              <span>{t('v5.uploadDocument')}</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict magic-byte validation, quarantine virus scan, and lossless preview generation.
            </p>
          </div>

          {/* Purpose Limitation Dropdown */}
          <div className="flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <label className="text-xs font-semibold text-slate-700">Access Purpose:</label>
            <select
              value={selectedPurpose}
              onChange={(e) => setSelectedPurpose(e.target.value)}
              className="text-xs font-medium border border-slate-300 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-800 outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="APPLICATION_VERIFICATION">Application Verification</option>
              <option value="DUPLICATE_REVIEW">Duplicate Review</option>
              <option value="ELIGIBILITY_REVIEW">Eligibility Review</option>
              <option value="AUDIT">Audit & Compliance</option>
              <option value="CITIZEN_SELF_SERVICE">Citizen Self Service</option>
            </select>
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/20 rounded-xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-3"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.csv,.docx,.xlsx"
          />

          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-800">{t('v5.dropzone')}</div>
            <div className="text-xs text-slate-400 mt-1">{t('v5.fileRestrictions')}</div>
          </div>

          <div className="flex items-center space-x-4 pt-2">
            <span className="text-xs text-slate-500 flex items-center space-x-1">
              <Camera className="w-3.5 h-3.5 text-slate-400" />
              <span>Camera Capture Ready</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ClamAV Compatible Scanner</span>
            </span>
          </div>
        </div>

        {/* Upload State Feedback */}
        {uploadProgress && (
          <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-lg flex items-center space-x-2">
            <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
            <span>{uploadProgress}</span>
          </div>
        )}

        {uploadError && (
          <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 text-xs rounded-lg flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>{uploadError}</span>
          </div>
        )}
      </div>

      {/* Ingested Documents List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-slate-600" />
            <h2 className="text-base font-bold text-slate-900">Ingested Supporting Documents</h2>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {documents.length} verified artifacts
          </span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading documents...</div>
        ) : documents.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs space-y-2">
            <FileText className="w-8 h-8 text-slate-300 mx-auto" />
            <div>No documents ingested yet. Upload an evidence artifact above.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Document / Public ID</th>
                  <th className="py-3 px-4">Classified Type</th>
                  <th className="py-3 px-4">Integrity (SHA-256)</th>
                  <th className="py-3 px-4">MIME & Size</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{doc.original_filename}</div>
                      <div className="font-mono text-[11px] text-slate-400">{doc.public_id}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {doc.document_type.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      <span title={doc.sha256}>
                        {doc.sha256 ? `${doc.sha256.substring(0, 16)}...` : 'N/A'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                      <div>{doc.detected_mime_type}</div>
                      <div>{Math.round(doc.size_bytes / 1024)} KB</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          doc.status === 'READY'
                            ? 'bg-emerald-100 text-emerald-800'
                            : doc.status === 'PROCESSING'
                            ? 'bg-blue-100 text-blue-800'
                            : doc.status === 'QUARANTINED'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <a
                        href={`/api/v1/documents/${doc.id}/download?purpose=${selectedPurpose}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-600 hover:text-slate-900 font-medium underline inline-flex items-center space-x-1"
                      >
                        <span>Download</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
