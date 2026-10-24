use crate::domain::entity_resolution::models::EvidenceDirection;
use chrono::{Datelike, NaiveDate};

/// Normalizes general text strings by:
/// 1. Trimming leading/trailing whitespace
/// 2. Converting to lowercase
/// 3. Collapsing consecutive whitespace
/// 4. Removing punctuation (except alphanumeric and spaces)
pub fn normalize_text(input: &str) -> String {
    let lower = input.trim().to_lowercase();
    let mut normalized = String::with_capacity(lower.len());
    let mut prev_is_space = false;

    for ch in lower.chars() {
        if ch.is_alphanumeric() {
            normalized.push(ch);
            prev_is_space = false;
        } else if ch.is_whitespace() || ch == '-' || ch == '/' || ch == '.' || ch == ',' {
            if !prev_is_space && !normalized.is_empty() {
                normalized.push(' ');
                prev_is_space = true;
            }
        }
    }

    normalized.trim_end().to_string()
}

/// Normalizes names for comparison by:
/// 1. General text normalization
/// 2. Removing common honorific titles during comparison (without modifying original data)
pub fn normalize_name(name: &str) -> String {
    let text = normalize_text(name);
    let titles = ["shri", "smt", "srimati", "mr", "mrs", "ms", "dr"];

    let tokens: Vec<&str> = text.split_whitespace().collect();
    let token_count = tokens.len();
    let filtered: Vec<&str> = tokens
        .into_iter()
        .filter(|&t| !titles.contains(&t) || token_count == 1)
        .collect();

    if filtered.is_empty() {
        text
    } else {
        filtered.join(" ")
    }
}

/// Deterministic Devanagari (Hindi) to Latin transliteration.
/// Maps Hindi vowels, consonants, matras, and conjuncts to standard Latin phonetic representations.
pub fn transliterate_devanagari_to_latin(input: &str) -> String {
    let preprocessed = input
        .replace("क्ष", "ksh")
        .replace("त्र", "tr")
        .replace("ज्ञ", "gy");
    let mut result = String::with_capacity(preprocessed.len() * 2);
    let chars: Vec<char> = preprocessed.chars().collect();
    let mut i = 0;

    while i < chars.len() {
        let c = chars[i];
        match c {
            // Vowels
            'अ' => result.push('a'),
            'आ' => result.push_str("aa"),
            'इ' => result.push('i'),
            'ई' => result.push_str("ee"),
            'उ' => result.push('u'),
            'ऊ' => result.push_str("oo"),
            'ऋ' => result.push_str("ri"),
            'ए' => result.push('e'),
            'ऐ' => result.push_str("ai"),
            'ओ' => result.push('o'),
            'औ' => result.push_str("au"),

            // Consonants (inherent 'a' unless followed by virama or matra)
            'क' => result.push_str(handle_consonant("k", &chars, i)),
            'ख' => result.push_str(handle_consonant("kh", &chars, i)),
            'ग' => result.push_str(handle_consonant("g", &chars, i)),
            'घ' => result.push_str(handle_consonant("gh", &chars, i)),
            'ङ' => result.push_str(handle_consonant("ng", &chars, i)),
            'च' => result.push_str(handle_consonant("ch", &chars, i)),
            'छ' => result.push_str(handle_consonant("chh", &chars, i)),
            'ज' => result.push_str(handle_consonant("j", &chars, i)),
            'झ' => result.push_str(handle_consonant("jh", &chars, i)),
            'ञ' => result.push_str(handle_consonant("ny", &chars, i)),
            'ट' => result.push_str(handle_consonant("t", &chars, i)),
            'ठ' => result.push_str(handle_consonant("th", &chars, i)),
            'ड' => result.push_str(handle_consonant("d", &chars, i)),
            'ढ' => result.push_str(handle_consonant("dh", &chars, i)),
            'ण' => result.push_str(handle_consonant("n", &chars, i)),
            'त' => result.push_str(handle_consonant("t", &chars, i)),
            'थ' => result.push_str(handle_consonant("th", &chars, i)),
            'द' => result.push_str(handle_consonant("d", &chars, i)),
            'ध' => result.push_str(handle_consonant("dh", &chars, i)),
            'न' => result.push_str(handle_consonant("n", &chars, i)),
            'प' => result.push_str(handle_consonant("p", &chars, i)),
            'फ' => result.push_str(handle_consonant("ph", &chars, i)),
            'ब' => result.push_str(handle_consonant("b", &chars, i)),
            'भ' => result.push_str(handle_consonant("bh", &chars, i)),
            'म' => result.push_str(handle_consonant("m", &chars, i)),
            'य' => result.push_str(handle_consonant("y", &chars, i)),
            'र' => result.push_str(handle_consonant("r", &chars, i)),
            'ल' => result.push_str(handle_consonant("l", &chars, i)),
            'व' => result.push_str(handle_consonant("v", &chars, i)),
            'श' => result.push_str(handle_consonant("sh", &chars, i)),
            'ष' => result.push_str(handle_consonant("sh", &chars, i)),
            'स' => result.push_str(handle_consonant("s", &chars, i)),
            'ह' => result.push_str(handle_consonant("h", &chars, i)),

            // Matras (Vowel signs)
            'ा' => result.push('a'),
            'ि' => result.push('i'),
            'ी' => result.push('i'),
            'ु' => result.push('u'),
            'ू' => result.push('u'),

            'ृ' => result.push_str("ri"),
            'े' => result.push('e'),
            'ै' => result.push_str("ai"),
            'ो' => result.push('o'),
            'ौ' => result.push_str("au"),
            'ं' => result.push('n'),
            'ँ' => result.push('n'),
            'ः' => result.push('h'),
            '्' => {} // Virama (halant) already handled by consonant lookahead

            // Non-Devanagari characters (Latin, spaces, punctuation)
            other => result.push(other),
        }
        i += 1;
    }

    normalize_text(&result)
}

fn handle_consonant(base: &'static str, chars: &[char], i: usize) -> &'static str {
    // If followed by virama (halant ्), no inherent vowel
    if i + 1 < chars.len() && chars[i + 1] == '्' {
        return base;
    }
    // If followed by any matra, no inherent vowel (the matra will supply it)
    if i + 1 < chars.len() && is_matra(chars[i + 1]) {
        return base;
    }
    // If at the end of word or string, or followed by whitespace, common Hindi convention omits trailing schwa
    if i + 1 >= chars.len() || chars[i + 1].is_whitespace() {
        return base;
    }

    // Inherent 'a' between consonants
    match base {
        "k" => "ka",
        "kh" => "kha",
        "g" => "ga",
        "gh" => "gha",
        "ng" => "nga",
        "ch" => "cha",
        "chh" => "chha",
        "j" => "ja",
        "jh" => "jha",
        "ny" => "nya",
        "t" => "ta",
        "th" => "tha",
        "d" => "da",
        "dh" => "dha",
        "n" => "na",
        "p" => "pa",
        "ph" => "pha",
        "b" => "ba",
        "bh" => "bha",
        "m" => "ma",
        "y" => "ya",
        "r" => "ra",
        "l" => "la",
        "v" => "va",
        "sh" => "sha",
        "s" => "sa",
        "h" => "ha",
        "ksh" => "ksha",
        "tr" => "tra",
        "gy" => "gya",
        _ => base,
    }
}

fn is_matra(c: char) -> bool {
    matches!(
        c,
        'ा' | 'ि' | 'ी' | 'ु' | 'ू' | 'ृ' | 'े' | 'ै' | 'ो' | 'ौ' | 'ं' | 'ँ' | 'ः'
    )
}

/// Normalizes phone numbers to digits only and extracts standard suffix
pub fn normalize_phone(phone: &str) -> String {
    let digits: String = phone.chars().filter(|c| c.is_ascii_digit()).collect();
    if digits.len() >= 10 {
        digits[digits.len() - 10..].to_string()
    } else {
        digits
    }
}

/// Normalizes address for token overlap
pub fn normalize_address(address: &str) -> Vec<String> {
    let norm = normalize_text(address);
    let common_words = [
        "village", "vill", "po", "ps", "dist", "district", "near", "road", "street", "house", "no",
        "flat",
    ];
    norm.split_whitespace()
        .filter(|w| !common_words.contains(w) && w.len() > 1)
        .map(|w| w.to_string())
        .collect()
}

pub fn tokenize_address(address: &str) -> Vec<String> {
    normalize_address(address)
}

pub fn transliterate_indic_to_latin(input: &str) -> String {
    transliterate_devanagari_to_latin(input)
}

/// Compares two dates deterministically
/// Returns (similarity: 0.0 - 1.0, is_conflict: bool, explanation)
pub fn compare_dates(d1: Option<NaiveDate>, d2: Option<NaiveDate>) -> (f64, bool, String) {
    match (d1, d2) {
        (Some(a), Some(b)) => {
            if a == b {
                (1.0, false, format!("Exact date of birth match ({})", a))
            } else if a.year() == b.year() && a.month() == b.month() {
                (
                    0.9,
                    false,
                    format!("Same birth month and year ({} vs {})", a, b),
                )
            } else if a.year() == b.year() {
                (
                    0.75,
                    false,
                    format!(
                        "Same birth year ({}) with minor day/month discrepancy",
                        a.year()
                    ),
                )
            } else {
                let diff_years = (a.year() - b.year()).abs();
                (
                    0.0,
                    true,
                    format!(
                        "Significant date of birth conflict: {} vs {} (difference of {} years)",
                        a, b, diff_years
                    ),
                )
            }
        }
        _ => (
            0.5,
            false,
            "Date of birth missing in one or both records (neutral)".to_string(),
        ),
    }
}

/// Evaluates dates of birth specifically for evidence direction and conflict penalty
pub fn compare_dates_with_conflict(
    d1: Option<NaiveDate>,
    d2: Option<NaiveDate>,
) -> (EvidenceDirection, f64, String) {
    match (d1, d2) {
        (Some(a), Some(b)) => {
            if a == b {
                (
                    EvidenceDirection::SupportsMatch,
                    0.0,
                    format!("Exact date of birth match ({})", a),
                )
            } else if a.year() == b.year() && a.month() == b.month() {
                (
                    EvidenceDirection::SupportsMatch,
                    0.0,
                    format!("Same birth year and month ({} vs {})", a, b),
                )
            } else if a.year() == b.year() {
                (
                    EvidenceDirection::SupportsMatch,
                    0.0,
                    format!(
                        "Same birth year ({}) with minor day/month discrepancy",
                        a.year()
                    ),
                )
            } else {
                let diff_years = (a.year() - b.year()).abs();
                let penalty = if diff_years >= 5 { 1.0 } else { 0.6 };
                (
                    EvidenceDirection::ContradictsMatch,
                    penalty,
                    format!(
                        "Significant date of birth conflict: {} vs {} (difference of {} years)",
                        a, b, diff_years
                    ),
                )
            }
        }
        _ => (
            EvidenceDirection::Neutral,
            0.0,
            "Date of birth missing in one or both records (treated as neutral).".to_string(),
        ),
    }
}

#[cfg(test)]
mod tests {

    use super::*;

    #[test]
    fn test_normalize_name() {
        assert_eq!(normalize_name("  Rahul   Kumar  "), "rahul kumar");
        assert_eq!(normalize_name("RAHUL KUMAR"), "rahul kumar");
        assert_eq!(normalize_name("Shri Ramesh Kumar"), "ramesh kumar");
    }

    #[test]
    fn test_transliterate_devanagari() {
        assert_eq!(transliterate_devanagari_to_latin("राहुल"), "rahul");
        assert_eq!(transliterate_devanagari_to_latin("सुनीता"), "sunita");
        assert_eq!(transliterate_devanagari_to_latin("देवी"), "devi");
        assert_eq!(
            transliterate_devanagari_to_latin("सुनीता देवी"),
            "sunita devi"
        );
        assert_eq!(transliterate_devanagari_to_latin("रमेश"), "ramesh");
        assert_eq!(transliterate_devanagari_to_latin("अमित"), "amit");
    }

    #[test]
    fn test_phone_normalization() {
        assert_eq!(normalize_phone("+91-98765-43210"), "9876543210");
        assert_eq!(normalize_phone("09876543210"), "9876543210");
    }
}
