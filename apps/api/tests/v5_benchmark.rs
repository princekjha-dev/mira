use mira_api::domain::document::classifier::DocumentClassifier;
use mira_api::domain::document::extraction::DocumentExtractor;
use mira_api::domain::document::file_type_registry::FileTypeRegistry;
use mira_api::domain::document::models::DocumentType;
use mira_api::domain::document::ocr::{
    generate_bounding_boxes_for_text, BilingualOcrProvider, OCRProvider,
};
use mira_api::domain::document::storage::LocalStorageAdapter;
use std::time::Instant;

#[derive(Debug, Clone)]
struct GroundTruthRecord {
    filename: String,
    content: String,
    expected_doc_type: DocumentType,
    expected_name: String,
    expected_dob: String,
    expected_doc_number: String,
    expected_parent: String,
}

fn generate_synthetic_document(idx: usize) -> GroundTruthRecord {
    let names = [
        "Rahul Kumar",
        "Sunita Devi",
        "Amit Sharma",
        "Priya Verma",
        "Ramesh Singh",
    ];
    let dobs = [
        "1998-04-12",
        "1995-05-15",
        "1988-11-20",
        "2000-01-01",
        "1992-08-25",
    ];
    let parents = [
        "Ramesh Kumar",
        "Ram Lal",
        "Vijay Sharma",
        "Suresh Verma",
        "Dinesh Singh",
    ];

    let n = names[idx % names.len()];
    let d = dobs[idx % dobs.len()];
    let p = parents[idx % parents.len()];
    let doc_num = format!("REG-UP-2025-{:04}", idx);

    let content = if idx % 2 == 0 {
        format!(
            "GOVERNMENT OF UTTAR PRADESH\nDEPARTMENT OF PLANNING\nBIRTH CERTIFICATE / जन्म प्रमाण पत्र\nRegistration No: {}\nChild Name / नाम: {}\nDate of Birth / जन्म तिथि: {}\nFather Name / पिता का नाम: {}\nPermanent Address: House No {}, Ward 7, Varanasi, UP\nIssuing Authority: Municipal Corporation",
            doc_num, n, d, p, idx + 10
        )
    } else {
        format!(
            "GOVERNMENT OF UTTAR PRADESH\nREVENUE DEPARTMENT\nINCOME CERTIFICATE / आय प्रमाण पत्र\nCertificate No: {}\nApplicant Name / प्रार्थी का नाम: {}\nDate of Birth: {}\nFather's Name: {}\nAnnual Income / वार्षिक आय: ₹ 95,000\nAddress: Plot {}, Dashashwamedh, Varanasi",
            doc_num, n, d, p, idx + 20
        )
    };

    GroundTruthRecord {
        filename: if idx % 2 == 0 {
            format!("birth_cert_{:04}.txt", idx)
        } else {
            format!("income_cert_{:04}.txt", idx)
        },
        content,
        expected_doc_type: if idx % 2 == 0 {
            DocumentType::BirthCertificate
        } else {
            DocumentType::IncomeCertificate
        },
        expected_name: n.to_lowercase(),
        expected_dob: d.to_string(),
        expected_doc_number: doc_num,
        expected_parent: p.to_lowercase(),
    }
}

#[tokio::test]
async fn test_v5_benchmark_and_evaluation_suite() {
    println!("\n========================================================");
    println!("MIRA V5 SYNTHETIC EVALUATION & PERFORMANCE BENCHMARK");
    println!("========================================================");

    let ocr_provider = BilingualOcrProvider::new();
    let temp_dir = std::env::temp_dir().join(format!("mira_bench_{}", uuid::Uuid::new_v4()));
    let _storage = LocalStorageAdapter::new(temp_dir)
        .await
        .expect("Storage init");

    let batch_sizes = [100, 500, 1000];

    for &size in &batch_sizes {
        let corpus: Vec<GroundTruthRecord> = (0..size).map(generate_synthetic_document).collect();

        let start_time = Instant::now();
        let mut validation_duration = std::time::Duration::ZERO;
        let mut classification_duration = std::time::Duration::ZERO;
        let mut ocr_duration = std::time::Duration::ZERO;
        let mut extraction_duration = std::time::Duration::ZERO;

        let mut correct_name_matches = 0;
        let mut correct_dob_matches = 0;
        let mut correct_doc_num_matches = 0;
        let mut correct_parent_matches = 0;
        let mut total_fields_evaluated = 0;

        for item in &corpus {
            let data = item.content.as_bytes();

            // 1. File validation
            let t0 = Instant::now();
            let validated = FileTypeRegistry::validate(&item.filename, Some("text/plain"), data)
                .expect("Validation must succeed");
            validation_duration += t0.elapsed();

            // 2. Classification
            let t1 = Instant::now();
            let (classified_type, _, _) =
                DocumentClassifier::classify(&validated.sanitized_filename, &item.content);
            classification_duration += t1.elapsed();

            // 3. OCR simulation
            let t2 = Instant::now();
            let ocr_res = ocr_provider
                .process_document(
                    &validated.sanitized_filename,
                    &validated.detected_mime,
                    data,
                )
                .await
                .expect("OCR must succeed");
            ocr_duration += t2.elapsed();

            // 4. Structured extraction
            let t3 = Instant::now();
            let all_regions = generate_bounding_boxes_for_text(&ocr_res.full_text, 1);
            let extracted =
                DocumentExtractor::extract(&classified_type, &ocr_res.full_text, &all_regions);
            extraction_duration += t3.elapsed();

            // Accuracy evaluation against ground truth
            for f in &extracted {
                total_fields_evaluated += 1;
                match f.field_name.as_str() {
                    "NAME" => {
                        if f.normalized_value.contains(&item.expected_name) {
                            correct_name_matches += 1;
                        }
                    }
                    "DATE_OF_BIRTH" => {
                        if f.normalized_value == item.expected_dob {
                            correct_dob_matches += 1;
                        }
                    }
                    "DOCUMENT_NUMBER" => {
                        if f.normalized_value == item.expected_doc_number {
                            correct_doc_num_matches += 1;
                        }
                    }
                    "PARENT_NAME" => {
                        if f.normalized_value.contains(&item.expected_parent) {
                            correct_parent_matches += 1;
                        }
                    }
                    _ => {}
                }
            }
        }

        let total_elapsed = start_time.elapsed();
        let avg_latency_ms = total_elapsed.as_secs_f64() * 1000.0 / size as f64;

        let name_accuracy = (correct_name_matches as f64 / size as f64) * 100.0;
        let dob_accuracy = (correct_dob_matches as f64 / size as f64) * 100.0;
        let doc_num_accuracy = (correct_doc_num_matches as f64 / size as f64) * 100.0;
        let parent_accuracy = (correct_parent_matches as f64 / (size / 2) as f64) * 100.0; // Parent is in birth certs

        println!(
            "\n--- Synthetic Corpus Benchmark: N = {} Documents ---",
            size
        );
        println!("Total Processing Latency: {:.2?}", total_elapsed);
        println!(
            "Average End-to-End Latency per Doc: {:.2} ms",
            avg_latency_ms
        );
        println!(
            "  - Validation avg: {:.3} ms",
            (validation_duration.as_secs_f64() * 1000.0) / size as f64
        );
        println!(
            "  - Classification avg: {:.3} ms",
            (classification_duration.as_secs_f64() * 1000.0) / size as f64
        );
        println!(
            "  - OCR & Text avg: {:.3} ms",
            (ocr_duration.as_secs_f64() * 1000.0) / size as f64
        );
        println!(
            "  - Field Extraction avg: {:.3} ms",
            (extraction_duration.as_secs_f64() * 1000.0) / size as f64
        );
        println!("Field Precision / Accuracy:");
        println!("  - Name Accuracy: {:.1}%", name_accuracy);
        println!("  - DOB Accuracy: {:.1}%", dob_accuracy);
        println!("  - Document Number Accuracy: {:.1}%", doc_num_accuracy);
        println!("  - Parent Name Accuracy: {:.1}%", parent_accuracy);
        println!(
            "Total Extracted Fields Evaluated: {}",
            total_fields_evaluated
        );

        assert!(name_accuracy >= 98.0, "Name precision must exceed 98%");
        assert!(dob_accuracy >= 98.0, "DOB precision must exceed 98%");
        assert!(
            avg_latency_ms < 50.0,
            "Average latency must be under 50ms per doc in deterministic mode"
        );
    }

    // OCR Confusion Pair Tests (Section 93)
    let confusion_cases = [
        ("12/O5/199S", "0/O and 5/S OCR confusion in date"),
        ("12/05/1995", "Clean date"),
    ];

    for (sample, desc) in confusion_cases {
        let text = format!(
            "Child Name: Sunita Devi\nDate of Birth: {}\nParent: Ram Lal",
            sample
        );
        let boxes = generate_bounding_boxes_for_text(&text, 1);
        let fields = DocumentExtractor::extract(&DocumentType::BirthCertificate, &text, &boxes);
        let dob_field = fields.iter().find(|f| f.field_name == "DATE_OF_BIRTH");

        if let Some(f) = dob_field {
            println!(
                "Confusion test [{}]: status={:?}, confidence={:.2}",
                desc, f.validation_status, f.confidence
            );
            if sample.contains('O') || sample.contains('S') {
                assert!(
                    f.confidence < 0.75,
                    "OCR confusion must lower confidence and flag for manual review"
                );
            }
        }
    }

    println!("\n✓ V5 Synthetic Benchmark and Evaluation completed successfully.");
}
