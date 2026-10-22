use uuid::Uuid;
use crate::errors::AppError;

pub const MAX_FILE_SIZE_BYTES: i64 = 25 * 1024 * 1024; // 25 MB

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum SupportedFormat {
    Pdf,
    Png,
    Jpeg,
    Webp,
    Txt,
    Csv,
    Docx,
    Xlsx,
}

impl SupportedFormat {
    pub fn extension(&self) -> &'static str {
        match self {
            Self::Pdf => "pdf",
            Self::Png => "png",
            Self::Jpeg => "jpg",
            Self::Webp => "webp",
            Self::Txt => "txt",
            Self::Csv => "csv",
            Self::Docx => "docx",
            Self::Xlsx => "xlsx",
        }
    }

    pub fn standard_mime(&self) -> &'static str {
        match self {
            Self::Pdf => "application/pdf",
            Self::Png => "image/png",
            Self::Jpeg => "image/jpeg",
            Self::Webp => "image/webp",
            Self::Txt => "text/plain",
            Self::Csv => "text/csv",
            Self::Docx => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            Self::Xlsx => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }
    }

    pub fn supports_ocr(&self) -> bool {
        matches!(self, Self::Pdf | Self::Png | Self::Jpeg | Self::Webp)
    }

    pub fn supports_preview(&self) -> bool {
        matches!(self, Self::Pdf | Self::Png | Self::Jpeg | Self::Webp | Self::Txt | Self::Csv)
    }

    pub fn supports_optimization(&self) -> bool {
        matches!(self, Self::Pdf | Self::Png | Self::Jpeg | Self::Webp)
    }
}

#[derive(Debug, Clone)]
pub struct ValidatedFile {
    pub detected_format: SupportedFormat,
    pub sanitized_filename: String,
    pub storage_key: String,
    pub detected_mime: String,
    pub size_bytes: i64,
}

pub struct FileTypeRegistry;

impl FileTypeRegistry {
    /// Strict file validation against magic bytes, MIME, size, and sanitization
    pub fn validate(
        raw_filename: &str,
        _client_mime: Option<&str>,
        bytes: &[u8],
    ) -> Result<ValidatedFile, AppError> {
        let size_bytes = bytes.len() as i64;

        // 1. Size Validation
        if size_bytes == 0 {
            return Err(AppError::Validation("Empty file uploaded. Content is 0 bytes.".into()));
        }
        if size_bytes > MAX_FILE_SIZE_BYTES {
            return Err(AppError::Validation(format!(
                "File exceeds maximum allowed size of 25MB (provided: {} MB)",
                size_bytes / (1024 * 1024)
            )));
        }

        // 2. Reject Obvious Executable / Script Signatures (Security Scan Step 1)
        Self::scan_for_malicious_signatures(bytes)?;

        // 3. Magic Signature Detection (Never trust client MIME or extension alone)
        let detected_format = Self::detect_format_from_bytes(bytes, raw_filename)?;

        // 4. Client Extension Cross-Check
        let declared_ext = Self::extract_extension(raw_filename);
        if let Some(ext) = declared_ext {
            if ext == "exe" || ext == "sh" || ext == "bat" || ext == "cmd" || ext == "js" || ext == "php" {
                return Err(AppError::Validation(format!(
                    "Executable file extension '.{}' is strictly prohibited.",
                    ext
                )));
            }
        }

        // 5. Filename Sanitization & Safe Storage Key Generation
        let sanitized_filename = Self::sanitize_filename(raw_filename);
        let storage_key = format!(
            "{}.{}",
            Uuid::new_v4(),
            detected_format.extension()
        );

        let detected_mime = detected_format.standard_mime().to_string();

        Ok(ValidatedFile {
            detected_format,
            sanitized_filename,
            storage_key,
            detected_mime,
            size_bytes,
        })
    }

    fn detect_format_from_bytes(bytes: &[u8], filename: &str) -> Result<SupportedFormat, AppError> {
        // PDF: %PDF (hex: 25 50 44 46)
        if bytes.len() >= 4 && &bytes[0..4] == b"%PDF" {
            return Ok(SupportedFormat::Pdf);
        }

        // PNG: 89 50 4E 47 0D 0A 1A 0A
        if bytes.len() >= 8 && &bytes[0..8] == [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] {
            return Ok(SupportedFormat::Png);
        }

        // JPEG: FF D8 FF
        if bytes.len() >= 3 && &bytes[0..3] == [0xFF, 0xD8, 0xFF] {
            return Ok(SupportedFormat::Jpeg);
        }

        // WEBP: RIFF .... WEBP
        if bytes.len() >= 12 && &bytes[0..4] == b"RIFF" && &bytes[8..12] == b"WEBP" {
            return Ok(SupportedFormat::Webp);
        }

        // ZIP / DOCX / XLSX: PK\x03\x04
        if bytes.len() >= 4 && &bytes[0..4] == [0x50, 0x4B, 0x03, 0x04] {
            let ext = Self::extract_extension(filename).unwrap_or_default();
            if ext == "xlsx" {
                return Ok(SupportedFormat::Xlsx);
            }
            return Ok(SupportedFormat::Docx);
        }

        // Text / CSV verification
        if Self::is_valid_utf8_text(bytes) {
            let ext = Self::extract_extension(filename).unwrap_or_default();
            if ext == "csv" || bytes.contains(&b',') {
                return Ok(SupportedFormat::Csv);
            }
            return Ok(SupportedFormat::Txt);
        }

        Err(AppError::Validation(
            "Unsupported file format or invalid file signature. Accepted formats: PDF, PNG, JPEG, WEBP, TXT, CSV, DOCX, XLSX.".into()
        ))
    }

    fn is_valid_utf8_text(bytes: &[u8]) -> bool {
        // Inspect up to first 4KB for non-printable control characters
        let sample = if bytes.len() > 4096 { &bytes[..4096] } else { bytes };
        if let Ok(s) = std::str::from_utf8(sample) {
            !s.chars().any(|c| c.is_control() && c != '\n' && c != '\r' && c != '\t')
        } else {
            false
        }
    }

    fn scan_for_malicious_signatures(bytes: &[u8]) -> Result<(), AppError> {
        // Windows Executable (MZ)
        if bytes.len() >= 2 && &bytes[0..2] == b"MZ" {
            return Err(AppError::Validation(
                "Security Alert: Executable binary (MZ header) detected and rejected.".into(),
            ));
        }

        // Linux Executable (ELF: \x7FELF)
        if bytes.len() >= 4 && &bytes[0..4] == [0x7F, 0x45, 0x4C, 0x46] {
            return Err(AppError::Validation(
                "Security Alert: Executable binary (ELF header) detected and rejected.".into(),
            ));
        }

        // Shell script shebang
        if bytes.len() >= 2 && &bytes[0..2] == b"#!" {
            return Err(AppError::Validation(
                "Security Alert: Executable script (#!) detected and rejected.".into(),
            ));
        }

        // Embedded malicious script tags in text formats
        if let Ok(text) = std::str::from_utf8(if bytes.len() > 2048 { &bytes[..2048] } else { bytes }) {
            let lower = text.to_lowercase();
            if lower.contains("<script") || lower.contains("<?php") || lower.contains("javascript:") {
                return Err(AppError::Validation(
                    "Security Alert: Embedded script tags detected in uploaded document.".into(),
                ));
            }
        }

        Ok(())
    }

    pub fn sanitize_filename(raw: &str) -> String {
        // Remove path traversal components (../, ..\, etc.)
        let clean = raw
            .replace('\\', "/")
            .split('/')
            .last()
            .unwrap_or("document")
            .trim()
            .to_string();

        let safe: String = clean
            .chars()
            .map(|c| if c.is_alphanumeric() || c == '.' || c == '-' || c == '_' || c == ' ' { c } else { '_' })
            .collect();

        if safe.is_empty() || safe == "." || safe == ".." {
            "document.bin".to_string()
        } else {
            safe
        }
    }

    pub fn extract_extension(raw: &str) -> Option<String> {
        let clean = raw.replace('\\', "/");
        let basename = clean.split('/').last().unwrap_or(raw);
        basename
            .rsplit('.')
            .next()
            .map(|s| s.to_lowercase())
            .filter(|s| !s.is_empty() && s.len() <= 8)
    }
}
