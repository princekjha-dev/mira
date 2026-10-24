export const DOCUMENT_UPLOAD_CONFIG = {
  MAX_UPLOAD_SIZE: 25 * 1024 * 1024,
  IMAGE_COMPRESSION_THRESHOLD: 3 * 1024 * 1024,
  IMAGE_MAX_DIMENSION: 3600,
  IMAGE_QUALITY: 0.9,
  PDF_COMPRESSION_THRESHOLD: 8 * 1024 * 1024,
  MAX_FILES_PER_UPLOAD: 8,
  ALLOWED_MIME_TYPES: [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "text/plain",
    "text/csv",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
  ALLOWED_EXTENSIONS: [
    "pdf",
    "png",
    "jpg",
    "jpeg",
    "webp",
    "txt",
    "csv",
    "docx",
    "xlsx",
  ],
} as const;

export const DOCUMENT_CATEGORIES = [
  "Identity",
  "Address",
  "Income",
  "BPL / Economic Status",
  "Education",
  "Birth",
  "Marriage",
  "Property",
  "Land",
  "Bank",
  "Employment",
  "Scheme-specific",
  "Other",
] as const;

export const DOCUMENT_TYPE_VALUES: Record<string, string> = {
  Identity: "IDENTITY_SUPPORTING_DOCUMENT",
  Address: "RESIDENCE_CERTIFICATE",
  Income: "INCOME_CERTIFICATE",
  "BPL / Economic Status": "OTHER",
  Education: "OTHER",
  Birth: "BIRTH_CERTIFICATE",
  Marriage: "OTHER",
  Property: "PROPERTY_DOCUMENT",
  Land: "PROPERTY_DOCUMENT",
  Bank: "OTHER",
  Employment: "OTHER",
  "Scheme-specific": "BENEFIT_DOCUMENT",
  Other: "OTHER",
};

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
