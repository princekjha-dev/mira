use super::normalization::{normalize_name, normalize_text, transliterate_devanagari_to_latin};
use std::cmp::{max, min};

/// Computes Levenshtein distance between two strings
pub fn levenshtein_distance(s1: &str, s2: &str) -> usize {
    let s1_chars: Vec<char> = s1.chars().collect();
    let s2_chars: Vec<char> = s2.chars().collect();
    let m = s1_chars.len();
    let n = s2_chars.len();

    if m == 0 {
        return n;
    }
    if n == 0 {
        return m;
    }

    let mut dp = vec![vec![0; n + 1]; m + 1];

    for i in 0..=m {
        dp[i][0] = i;
    }
    for j in 0..=n {
        dp[0][j] = j;
    }

    for i in 1..=m {
        for j in 1..=n {
            let cost = if s1_chars[i - 1] == s2_chars[j - 1] { 0 } else { 1 };
            dp[i][j] = min(
                dp[i - 1][j] + 1, // deletion
                min(
                    dp[i][j - 1] + 1, // insertion
                    dp[i - 1][j - 1] + cost, // substitution
                ),
            );
        }
    }

    dp[m][n]
}

/// Computes normalized Levenshtein similarity between 0.0 and 1.0
pub fn levenshtein_similarity(s1: &str, s2: &str) -> f64 {
    let max_len = max(s1.chars().count(), s2.chars().count());
    if max_len == 0 {
        return 1.0;
    }
    let dist = levenshtein_distance(s1, s2);
    1.0 - (dist as f64 / max_len as f64)
}

/// Computes Jaro similarity between two strings
pub fn jaro_similarity(s1: &str, s2: &str) -> f64 {
    let s1_chars: Vec<char> = s1.chars().collect();
    let s2_chars: Vec<char> = s2.chars().collect();
    let len1 = s1_chars.len();
    let len2 = s2_chars.len();

    if len1 == 0 && len2 == 0 {
        return 1.0;
    }
    if len1 == 0 || len2 == 0 {
        return 0.0;
    }

    let match_distance = (max(len1, len2) / 2).saturating_sub(1);
    let mut s1_matches = vec![false; len1];
    let mut s2_matches = vec![false; len2];

    let mut matches = 0;
    for i in 0..len1 {
        let start = i.saturating_sub(match_distance);
        let end = min(i + match_distance + 1, len2);

        for j in start..end {
            if s2_matches[j] || s1_chars[i] != s2_chars[j] {
                continue;
            }
            s1_matches[i] = true;
            s2_matches[j] = true;
            matches += 1;
            break;
        }
    }

    if matches == 0 {
        return 0.0;
    }

    let mut transpositions = 0;
    let mut k = 0;
    for i in 0..len1 {
        if !s1_matches[i] {
            continue;
        }
        while !s2_matches[k] {
            k += 1;
        }
        if s1_chars[i] != s2_chars[k] {
            transpositions += 1;
        }
        k += 1;
    }

    let m = matches as f64;
    let jaro = (m / len1 as f64 + m / len2 as f64 + (m - (transpositions as f64 / 2.0)) / m) / 3.0;
    jaro
}

/// Computes Jaro-Winkler similarity with standard prefix scale = 0.1, max prefix = 4
pub fn jaro_winkler(s1: &str, s2: &str) -> f64 {
    let jaro = jaro_similarity(s1, s2);
    if jaro < 0.7 {
        return jaro;
    }

    let s1_chars: Vec<char> = s1.chars().collect();
    let s2_chars: Vec<char> = s2.chars().collect();
    let mut prefix = 0;

    for (c1, c2) in s1_chars.iter().zip(s2_chars.iter()) {
        if c1 == c2 {
            prefix += 1;
            if prefix == 4 {
                break;
            }
        } else {
            break;
        }
    }

    let prefix_scale = 0.1;
    jaro + (prefix as f64 * prefix_scale * (1.0 - jaro))
}

/// Token Jaccard similarity between two multi-word strings
pub fn token_similarity(s1: &str, s2: &str) -> f64 {
    let tokens1: std::collections::HashSet<String> = normalize_text(s1)
        .split_whitespace()
        .map(|s| s.to_string())
        .collect();
    let tokens2: std::collections::HashSet<String> = normalize_text(s2)
        .split_whitespace()
        .map(|s| s.to_string())
        .collect();

    if tokens1.is_empty() && tokens2.is_empty() {
        return 1.0;
    }
    if tokens1.is_empty() || tokens2.is_empty() {
        return 0.0;
    }

    let intersection_count = tokens1.intersection(&tokens2).count();
    let union_count = tokens1.union(&tokens2).count();

    intersection_count as f64 / union_count as f64
}

pub fn token_jaccard_similarity(tokens1: &[String], tokens2: &[String]) -> f64 {
    let set1: std::collections::HashSet<&String> = tokens1.iter().collect();
    let set2: std::collections::HashSet<&String> = tokens2.iter().collect();
    if set1.is_empty() && set2.is_empty() {
        return 1.0;
    }
    if set1.is_empty() || set2.is_empty() {
        return 0.0;
    }
    let intersection = set1.intersection(&set2).count();
    let union = set1.union(&set2).count();
    intersection as f64 / union as f64
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct NameComparisonResult {
    pub similarity: f64,
    pub method: String,
    pub explanation: String,
}

/// Compares names across English and Devanagari transliterations.
/// Returns NameComparisonResult
pub fn compare_names(n1: &str, n2: &str) -> NameComparisonResult {
    let raw1 = normalize_text(n1);
    let raw2 = normalize_text(n2);

    if raw1 == raw2 {
        return NameComparisonResult {
            similarity: 1.0,
            method: "EXACT_STRING_MATCH".to_string(),
            explanation: format!("Exact name match: '{}'", n1),
        };
    }

    // Check if either is Devanagari
    let has_devanagari1 = raw1.chars().any(|c| ('\u{0900}'..='\u{097F}').contains(&c));
    let has_devanagari2 = raw2.chars().any(|c| ('\u{0900}'..='\u{097F}').contains(&c));

    let (t1, t2, is_translit) = if has_devanagari1 || has_devanagari2 {
        let lat1 = if has_devanagari1 { transliterate_devanagari_to_latin(n1) } else { raw1.clone() };
        let lat2 = if has_devanagari2 { transliterate_devanagari_to_latin(n2) } else { raw2.clone() };
        (lat1, lat2, true)
    } else {
        (raw1.clone(), raw2.clone(), false)
    };

    let norm1 = normalize_name(&t1);
    let norm2 = normalize_name(&t2);

    if norm1 == norm2 {
        let method = if is_translit { "TRANSLITERATION_MATCH" } else { "NORMALIZED_NAME_MATCH" };
        let explanation = if is_translit {
            format!("Phonetic transliteration match between Devanagari and Latin script ('{}' ≈ '{}')", n1, n2)
        } else {
            format!("Normalized name match ignoring titles ('{}' == '{}')", n1, n2)
        };
        return NameComparisonResult {
            similarity: 1.0,
            method: method.to_string(),
            explanation,
        };
    }

    let fold_phonetics = |s: &str| -> String {
        s.to_lowercase()
            .replace("ee", "i")
            .replace("oo", "u")
            .replace("aa", "a")
            .replace("w", "v")
            .replace("sh", "s")
    };

    let p1 = fold_phonetics(&norm1);
    let p2 = fold_phonetics(&norm2);
    if p1 == p2 {
        let method = if is_translit { "TRANSLITERATION_MATCH" } else { "PHONETIC_VARIATION_MATCH" };
        let explanation = format!("Phonetic equivalence match ('{}' ≈ '{}')", n1, n2);
        return NameComparisonResult {
            similarity: 0.98,
            method: method.to_string(),
            explanation,
        };
    }

    // Calculate Jaro-Winkler and Token similarity
    let jw_raw = jaro_winkler(&norm1, &norm2);
    let jw_phonetic = jaro_winkler(&p1, &p2);
    let jw = f64::max(jw_raw, jw_phonetic);

    let token_sim = token_similarity(&norm1, &norm2);
    let lev_sim = levenshtein_similarity(&norm1, &norm2);


    // Blended score favoring Jaro-Winkler with token overlap
    let score = (jw * 0.6) + (token_sim * 0.25) + (lev_sim * 0.15);

    let method = if is_translit {
        "TRANSLITERATED_JARO_WINKLER"
    } else {
        "JARO_WINKLER_TOKEN"
    };

    let explanation = format!(
        "Name similarity score {:.2} (Jaro-Winkler: {:.2}, Token: {:.2}) between '{}' and '{}'",
        score, jw, token_sim, n1, n2
    );

    NameComparisonResult {
        similarity: (score * 100.0).round() / 100.0,
        method: method.to_string(),
        explanation,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_jaro_winkler() {
        assert_eq!(jaro_winkler("rahul", "rahul"), 1.0);
        let sim = jaro_winkler("rahul", "rahool");
        assert!(sim > 0.85);

        let typo = jaro_winkler("ramesh kumar", "ramesh kumaar");
        assert!(typo > 0.95);
    }

    #[test]
    fn test_compare_names_transliteration() {
        let res = compare_names("सुनीता देवी", "Sunita Devi");
        assert!(res.similarity >= 0.85, "Transliteration similarity should be high: got {}", res.similarity);
        assert!(res.method.contains("TRANSLITERAT"));

        let res_rahul = compare_names("राहुल कुमार", "Rahul Kumar");
        assert!(res_rahul.similarity >= 0.90);
    }


    #[test]
    fn test_token_similarity() {
        let sim = token_similarity("Village Rampur District Dadri", "Rampur Village");
        assert!(sim >= 0.50);
    }
}
