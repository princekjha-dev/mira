use crate::domain::document::models::DocumentType;

pub struct DocumentClassifier;

impl DocumentClassifier {
    pub fn classify(filename: &str, text: &str) -> (DocumentType, f64, &'static str) {
        let combined = format!("{} {}", filename, text).to_lowercase();

        // 1. Birth Certificate markers
        if combined.contains("birth certificate")
            || combined.contains("जन्म प्रमाण")
            || combined.contains("birth registration")
            || combined.contains("child name")
            || combined.contains("place of birth")
        {
            return (
                DocumentType::BirthCertificate,
                0.95,
                "Matched Birth Certificate keywords (English/Hindi)",
            );
        }

        // 2. Income Certificate markers
        if combined.contains("income certificate")
            || combined.contains("आय प्रमाण")
            || combined.contains("annual income")
            || combined.contains("वार्षिक आय")
            || combined.contains("financial year")
        {
            return (
                DocumentType::IncomeCertificate,
                0.95,
                "Matched Income Certificate keywords (English/Hindi)",
            );
        }

        // 3. Residence / Domicile Certificate markers
        if combined.contains("residence certificate")
            || combined.contains("निवास प्रमाण")
            || combined.contains("domicile")
            || combined.contains("स्थानीय निवासी")
        {
            return (
                DocumentType::ResidenceCertificate,
                0.94,
                "Matched Residence/Domicile keywords",
            );
        }

        // 4. Property / Infrastructure markers
        if combined.contains("property")
            || combined.contains("khatauni")
            || combined.contains("खतौनी")
            || combined.contains("भूलेख")
            || combined.contains("latrine")
            || combined.contains("ihhl")
            || combined.contains("toilet")
            || combined.contains("survey number")
        {
            return (
                DocumentType::PropertyDocument,
                0.92,
                "Matched Property/Land/Housing keywords",
            );
        }

        // 5. Benefit / Scheme approval markers
        if combined.contains("benefit approval")
            || combined.contains("sanction order")
            || combined.contains("स्वीकृति पत्र")
            || combined.contains("disbursement")
        {
            return (
                DocumentType::BenefitDocument,
                0.90,
                "Matched Scheme Benefit Approval keywords",
            );
        }

        // 6. Household Document markers
        if combined.contains("ration card")
            || combined.contains("राशन कार्ड")
            || combined.contains("household")
            || combined.contains("parivar register")
            || combined.contains("परिवार रजिस्टर")
        {
            return (
                DocumentType::HouseholdDocument,
                0.91,
                "Matched Household / Family Register keywords",
            );
        }

        // 7. Identity Supporting Document
        if combined.contains("identity")
            || combined.contains("voter id")
            || combined.contains("पहचान पत्र")
            || combined.contains("driving licence")
        {
            return (
                DocumentType::IdentitySupportingDocument,
                0.88,
                "Matched Identity Document markers",
            );
        }

        (DocumentType::Other, 0.60, "Generic official document")
    }
}
