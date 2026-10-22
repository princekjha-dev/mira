import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Maximize2, Download, FileText, CheckCircle2, ShieldCheck, Eye } from 'lucide-react';
import { BoundingBox, DocumentExtraction, DocumentItem } from '../types';
import { useTranslation } from '../i18n/context';

interface DocumentViewerProps {
  document: DocumentItem | null;
  extractions: DocumentExtraction[];
  highlightedExtractionId?: string | null;
  onSelectExtraction?: (extraction: DocumentExtraction) => void;
  onDownload?: () => void;
  rawText?: string | null;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  extractions,
  highlightedExtractionId,
  onSelectExtraction,
  onDownload,
  rawText,
}) => {
  const { t } = useTranslation();
  const [zoom, setZoom] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'visual' | 'text'>('visual');

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 20, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 20, 60));
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleReset = () => {
    setZoom(100);
    setRotation(0);
  };

  const selectedExtraction = extractions.find((e) => e.id === highlightedExtractionId);

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
      {/* Viewer Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 border-b border-slate-700 text-slate-200">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-sm truncate max-w-xs" title={document?.original_filename}>
            {document ? document.original_filename : 'No Document Selected'}
          </span>
          {document && (
            <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300 border border-slate-600">
              {document.detected_mime_type}
            </span>
          )}
        </div>

        {/* View Mode & Controls */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-slate-700 rounded-lg p-0.5 mr-2 text-xs">
            <button
              onClick={() => setActiveTab('visual')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeTab === 'visual' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5 inline mr-1" />
              Document View
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeTab === 'text' ? 'bg-emerald-600 text-white font-medium' : 'text-slate-300 hover:text-white'
              }`}
            >
              OCR Text
            </button>
          </div>

          <button
            onClick={handleZoomOut}
            title={t('v5.zoomOut')}
            className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-slate-400 w-10 text-center">{zoom}%</span>
          <button
            onClick={handleZoomIn}
            title={t('v5.zoomIn')}
            className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleRotate}
            title={t('v5.rotate')}
            className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            title={t('v5.fitScreen')}
            className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {onDownload && (
            <button
              onClick={onDownload}
              title={t('v5.downloadAuthorized')}
              className="flex items-center space-x-1 ml-2 px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-xs font-medium rounded text-slate-200 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('v5.downloadAuthorized')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 overflow-auto bg-slate-950 p-6 flex items-center justify-center relative select-none">
        {activeTab === 'visual' ? (
          <div
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
              transition: 'transform 0.15s ease-out',
            }}
            className="relative bg-white text-slate-900 rounded shadow-2xl p-8 max-w-2xl min-h-[580px] w-full font-serif text-sm border border-slate-300"
          >
            {/* Watermark / Header */}
            <div className="border-b-2 border-double border-slate-800 pb-3 mb-6 text-center">
              <div className="text-xs uppercase tracking-widest text-slate-500 font-sans font-bold">
                Government Supporting Evidence Document
              </div>
              <div className="text-lg font-bold text-slate-900 tracking-wide mt-1">
                {document?.document_type.replace(/_/g, ' ') || 'OFFICIAL RECORD'}
              </div>
              <div className="text-xs text-slate-500 font-sans">
                Ref: {document?.public_id || 'DOC-GEN-2026-001'} • Integrity SHA-256 Verified
              </div>
            </div>

            {/* Simulated Document Certificate Content with Bounding Box Overlays */}
            <div className="space-y-4 font-sans text-xs">
              {extractions.length === 0 ? (
                <div className="p-8 text-center text-slate-400 font-sans">
                  No OCR extractions available for this document.
                </div>
              ) : (
                extractions.map((ext) => {
                  const isHighlighted = ext.id === highlightedExtractionId;
                  const region: BoundingBox = ext.source_region || { x: 0, y: 0, width: 200, height: 24, page: 1 };

                  return (
                    <div
                      key={ext.id}
                      onClick={() => onSelectExtraction && onSelectExtraction(ext)}
                      className={`relative p-2 rounded cursor-pointer transition-all ${
                        isHighlighted
                          ? 'ring-2 ring-emerald-500 bg-emerald-50/80 shadow-md'
                          : 'hover:bg-slate-50 border border-transparent hover:border-slate-200'
                      }`}
                    >
                      {/* Bounding box marker indicator */}
                      {isHighlighted && (
                        <div className="absolute -top-2.5 right-2 bg-emerald-600 text-white text-[10px] font-mono px-1.5 py-0.5 rounded shadow flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>
                            p{region.page || 1} [{Math.round(region.x)},{Math.round(region.y)}] ({Math.round(ext.confidence * 100)}% conf)
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-slate-600 uppercase text-[11px] tracking-wider">
                          {ext.field.replace(/_/g, ' ')}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {ext.extraction_method}
                        </span>
                      </div>
                      <div className="text-slate-900 font-medium text-sm mt-0.5 font-serif">
                        {ext.value}
                      </div>
                      {ext.normalized_value && ext.normalized_value !== ext.value && (
                        <div className="text-[11px] text-slate-500 italic font-sans">
                          Normalized: {ext.normalized_value}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Official seal & audit footer */}
            <div className="mt-8 pt-4 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-500 font-sans">
              <div className="flex items-center space-x-1 text-emerald-700 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>SHA-256: {document?.sha256?.substring(0, 16)}...</span>
              </div>
              <div>Authorized Mira Evidence Store • Immutable Original Preserved</div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl bg-slate-900 text-slate-100 font-mono text-xs p-6 rounded-lg border border-slate-700 h-[520px] overflow-auto whitespace-pre-wrap leading-relaxed">
            {rawText || 'No raw OCR text available.'}
          </div>
        )}
      </div>

      {/* Provenance Footnote Banner */}
      {selectedExtraction && (
        <div className="px-4 py-2 bg-slate-800/90 border-t border-slate-700 text-xs text-slate-300 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-emerald-400 font-semibold">Focused Evidence:</span>
            <span className="font-medium text-white">{selectedExtraction.field}</span>
            <span className="text-slate-400">→</span>
            <span className="font-mono text-emerald-300 font-bold">{selectedExtraction.value}</span>
          </div>
          <div className="text-slate-400 font-mono text-[11px]">
            Region: p{selectedExtraction.source_region?.page || 1} [x:{selectedExtraction.source_region?.x}, y:{selectedExtraction.source_region?.y}, w:{selectedExtraction.source_region?.width}, h:{selectedExtraction.source_region?.height}]
          </div>
        </div>
      )}
    </div>
  );
};
